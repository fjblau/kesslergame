# Bug Investigation: Failed to Submit Feedback

## Bug Summary
Users receive "Failed to submit feedback" error when attempting to submit feedback from the Game Over screen.

## Root Cause Analysis

### Key Finding: Feedback is the ONLY endpoint that reports failures to users

After comparing all three APIs (feedback, high-scores, plays), the critical difference is:

1. **`submitFeedback()`** - Returns `Promise<boolean>` and checks `result?.success`
2. **`saveHighScore()`** - Returns `Promise<void>`, fires and forgets
3. **`logPlay()`** - Returns `Promise<void>`, fires and forgets

### Error Flow
When the API call fails (for ANY reason):
1. Client's `callAPI` catches the error and returns `null` (`utils/feedback.ts:29-30`)
2. `submitFeedback` evaluates `result?.success ?? false` → returns `false` (`utils/feedback.ts:50`)
3. UI shows "Failed to submit feedback" error (`GameOverModal.tsx:332-334`)

### Geographic-Specific Failure Pattern
**Key Discovery**: Feedback submission works from Austria but fails for US users

This indicates:
- **Network latency/timeout issues** - US → Europe roundtrip exceeds default fetch timeout
- **Regional routing** - Vercel edge functions or Upstash Redis regional connectivity
- **No timeout configured** - Fetch API has no default timeout, hangs indefinitely on slow connections

### Why Only Feedback Shows Errors
`submitFeedback()` returns boolean and checks success, while `saveHighScore()` and `logPlay()` return void and fail silently.

## Affected Components
- **`api/feedback.ts`** - Serverless API handler requiring Redis
- **`utils/feedback.ts:34-55`** - Client-side `submitFeedback` function
- **`GameOverModal.tsx:107-139`** - UI feedback submission handler

## Proposed Solution

**Option 1: Silent Fallback to localStorage (Recommended)**
Align feedback behavior with `saveHighScore` and `logPlay`:
- Always save to localStorage as backup (not just in dev mode)
- Attempt API call in production
- Never show error to user - fail silently with local storage as safety net
- Return `true` regardless of API success (since data is saved locally)

### Implementation in `utils/feedback.ts`
```typescript
export async function submitFeedback(feedback: Feedback): Promise<boolean> {
  try {
    // Always save to localStorage first as backup
    const stored = localStorage.getItem(FEEDBACK_KEY);
    const feedbacks = stored ? JSON.parse(stored) : [];
    feedbacks.unshift(feedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));

    // Try to sync to API if not in development
    if (!isDevelopment) {
      await callAPI<{ success: boolean }>(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      // Don't check result - localStorage is our source of truth
    }

    return true; // Always succeed since we saved locally
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return true; // Still return true since localStorage likely succeeded
  }
}
```

### Advantages
- Users never see errors
- Feedback always preserved locally  
- Consistent behavior with other endpoints
- Simple, reliable fallback mechanism

## Edge Cases Considered
- Redis not configured (primary issue)
- Network failures during fetch
- CORS issues (API has CORS headers configured)
- API validation errors (400 status)

## Implementation Notes

### Changes Made

**1. `kessler-game/src/utils/feedback.ts`**

**Timeout increased to 30 seconds (line 18)**
```typescript
const API_TIMEOUT = 30000; // 30 second timeout for global users
```

**Added retry logic with exponential backoff (lines 72-98)**
- 3 total attempts (initial + 2 retries)
- Exponential backoff: 1s, 2s delays between retries
- Catches transient network failures

**Enhanced logging (lines 60-66)**
- Logs timezone, user agent, timestamp
- Tracks retry attempts
- Shows detailed error information

**2. Created `kessler-game/vercel.json`**
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```
Configures Vercel serverless functions to allow 30-second execution time.

### Why This Solves Geographic Issues
1. **30-second timeout**: Accommodates high-latency US→Vercel→Upstash roundtrips
2. **Retry logic**: Handles transient network failures or cold starts
3. **Server-side timeout config**: Prevents Vercel from killing the function prematurely
4. **Enhanced logging**: Provides diagnostic info to identify remaining issues

### API-First Approach Maintained
- Feedback MUST reach backend database to succeed
- LocalStorage only saved AFTER successful API submission
- Failures show error message to user (as required for data collection)

### Result
- US users should now successfully submit feedback via API
- 30s timeout + retries handles high-latency connections
- Detailed console logs help diagnose any remaining regional issues
