# Technical Specification: Log Play Interruptions

## Task Complexity Assessment

**Difficulty**: Medium

This task requires:
- Modifying the existing play logging system to track session duration
- Extending the data model to capture play completion status
- Implementing end-of-game logging in multiple scenarios
- Updating both frontend utilities and backend API
- Handling edge cases (browser close, page refresh)

## Technical Context

### Language & Framework
- **Frontend**: React 19.2.0 + TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Upstash Redis (production) / localStorage (development)
- **Build Tool**: Vite 7.2.4

### Current Implementation

The existing play logging system (`src/utils/plays.ts`) only tracks:
- `playerName`: string
- `date`: string (ISO timestamp)

Current flow:
1. User starts game in `GameSetupScreen.tsx:27` → `logPlay(playerName)` called
2. Game ends in `GameOverModal.tsx` → High scores saved, but **no play end logging**
3. Data stored in Redis (`plays` list) or localStorage (`kessler-plays` key)

## Implementation Approach

### 1. Data Model Extension

**Extend `PlayRecord` interface** to capture session details:

```typescript
interface PlayRecord {
  playerName: string;
  startTime: string;        // ISO timestamp
  endTime?: string;         // ISO timestamp (optional - null if interrupted)
  duration?: number;        // milliseconds
  completed: boolean;       // true if game finished normally, false if interrupted
  turnsSurvived?: number;   // Game progress indicator
  finalScore?: number;      // Final score achieved
  gameOverReason?: string;  // 'budget' | 'debris-limit' | 'max-turns' | 'severe-cascade' | 'interrupted'
}
```

### 2. Session Tracking Implementation

**Update play logging flow**:

1. **Game Start** (`GameSetupScreen.tsx`):
   - Store session ID in sessionStorage
   - Log initial play record with `startTime`
   - Mark `completed: false` initially

2. **Game End** (`GameOverModal.tsx`):
   - Calculate duration from stored start time
   - Update play record with `endTime`, `duration`, `completed: true`
   - Include game stats (turns survived, score, reason)

3. **Page Unload** (App.tsx):
   - Add `beforeunload` event listener
   - Log interrupted play if game was in progress
   - Set `gameOverReason: 'interrupted'`

### 3. File Changes

#### Modified Files

1. **`src/utils/plays.ts`**
   - Update `PlayRecord` interface
   - Modify `logPlay()` → `logPlayStart()` to store session start
   - Add `logPlayEnd()` to record completion/interruption
   - Add `getActiveSession()` helper to retrieve in-progress session

2. **`src/components/Setup/GameSetupScreen.tsx`**
   - Replace `logPlay(trimmedName)` with `logPlayStart(trimmedName)`

3. **`src/components/GameOver/GameOverModal.tsx`**
   - Add `useEffect` hook to call `logPlayEnd()` on mount
   - Pass game state (turns, score, reason) to logging function

4. **`src/App.tsx`**
   - Add `beforeunload` event listener to handle browser close
   - Check for active game session and log interruption

5. **`api/plays.ts`**
   - Update POST handler to accept new `PlayRecord` structure
   - Maintain backward compatibility with old records

#### Session Storage Schema

```typescript
interface GameSession {
  sessionId: string;        // UUID
  playerName: string;
  startTime: string;        // ISO timestamp
  gameStarted: boolean;     // Flag to track if game is active
}
```

Store in: `sessionStorage.setItem('kessler-game-session', JSON.stringify(session))`

### 4. API Changes

The existing `/api/plays` endpoint already accepts any JSON body, so it will naturally support the extended `PlayRecord` structure without breaking changes.

**Backward compatibility**: Old records with only `playerName` and `date` will continue to work.

## Data Flow

```
1. User clicks "Start Game"
   ↓
2. logPlayStart(playerName)
   - Generate sessionId
   - Store session in sessionStorage
   - POST to /api/plays with { playerName, startTime, completed: false }
   ↓
3a. Game ends normally (GameOverModal)
   ↓
   logPlayEnd({ completed: true, ... })
   - Retrieve session from sessionStorage
   - Calculate duration
   - POST to /api/plays with full stats
   - Clear sessionStorage

3b. User closes browser/tab
   ↓
   beforeunload handler
   ↓
   logPlayEnd({ completed: false, gameOverReason: 'interrupted' })
   - POST to /api/plays with interruption data
   - Clear sessionStorage
```

## Verification Approach

### Unit Tests
- Test `logPlayStart()` creates session correctly
- Test `logPlayEnd()` calculates duration accurately
- Test session retrieval and clearing

### Integration Tests
- Verify play records are stored with correct structure
- Test completed game flow end-to-end
- Test interrupted game flow

### Manual Testing
1. Start game → Complete normally → Verify record has `completed: true`, correct duration
2. Start game → Close browser → Verify record has `completed: false`, `gameOverReason: 'interrupted'`
3. Start game → Refresh page → Verify interruption logged
4. Check Redis/localStorage contains new fields
5. Verify backward compatibility with old records

### Lint & Type Check
- Run `npm run lint` (ESLint)
- Run `npm run build` (TypeScript compilation)
- Run `npm run test` (Vitest)

## Edge Cases

1. **Multiple tabs**: Each tab gets unique sessionId - won't conflict
2. **Page refresh during game**: Treated as interruption (expected behavior)
3. **Network failure during logging**: Silent failure with console error (existing behavior)
4. **Old records in database**: New fields are optional - no migration needed
5. **Development vs Production**: Both localStorage and Redis handle JSON storage - implementation identical

## Risk Assessment

**Low Risk Changes**:
- Adding optional fields to PlayRecord (backward compatible)
- New utility functions (no existing code affected)

**Medium Risk Changes**:
- beforeunload event listener (could affect performance if not properly cleaned up)
- SessionStorage usage (need to ensure proper cleanup)

## Success Criteria

1. ✅ Every game start creates a play record with `startTime`
2. ✅ Every completed game updates record with `endTime`, `duration`, stats
3. ✅ Browser close/refresh during game logs interruption
4. ✅ Old play records continue to display correctly
5. ✅ No TypeScript errors
6. ✅ All existing tests pass
7. ✅ Development and production environments work identically
