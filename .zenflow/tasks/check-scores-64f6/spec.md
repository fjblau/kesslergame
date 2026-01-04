# Technical Specification: Check Scores

## Complexity Assessment
**Medium** - This task involves analyzing scoring formulas, identifying discrepancies, determining realistic thresholds, and fixing inconsistencies across multiple files.

## Technical Context
- **Language**: TypeScript
- **Framework**: React with Redux Toolkit
- **Game**: Kessler Game - A space debris management simulation
- **Storage**: localStorage (browser-based, local to user's machine)

## Problem Analysis

### 1. High Scores Storage Location
**Answer to user question**: High scores are **only for the current user's machine**, not for any user of the app on the server.

**Evidence**:
- `src/utils/highScores.ts:10` uses `localStorage.getItem('kessler-high-scores')`
- localStorage is browser-local storage, not server-based
- Each user's browser maintains its own separate high scores list

### 2. Grade Threshold Discrepancy (Critical Bug)
There is a **major discrepancy** between actual grade thresholds and displayed thresholds:

**Actual thresholds** in `src/game/scoring.ts:29-35`:
```typescript
export const SCORE_GRADES = {
  S: 50000,
  A: 30000,
  B: 15000,
  C: 5000,
  D: 0,
};
```

**Displayed thresholds** in `src/components/HighScores/HighScoresPanel.tsx:127-151`:
- S: 10,000+
- A: 7,500+
- B: 5,000+
- C: 2,500+
- D: < 2,500

### 3. Realistic Score Analysis
Based on game mechanics and scoring formulas in `src/game/scoring.ts`:

**Scoring components**:
- Satellite Launch: 100 base + layer bonus (0-100)
- Debris Removal: 50 (cooperative) or 75 (uncooperative) per piece
- Satellite Recovery: 200 per satellite
- Budget Management: (budget / 1,000,000) × 10
- Survival: days × 50 × multiplier (1x, 1.5x, or 2x based on days survived)

**Example calculation for a strong game** (100 days survived, 15 satellites, 40 debris removed, 3 satellites recovered, $60M final budget):
- Satellites: ~2,250 (15 satellites × ~150 avg)
- Debris: ~2,600 (40 pieces × 65 avg)
- Recovery: 600 (3 × 200)
- Budget: 600 (60M / 1M × 10)
- Survival: 10,000 (100 days × 50 × 2x multiplier)
- **Total: ~16,050 points**

**Conclusion**: The current thresholds in `scoring.ts` (S: 50,000) are **unrealistically high** and likely unachievable through normal gameplay. The displayed thresholds in HighScoresPanel appear more reasonable but don't match the actual code.

## Implementation Approach

### Option A: Use Displayed Thresholds (Recommended)
Update `src/game/scoring.ts` to match the displayed values in HighScoresPanel:
- S: 10,000
- A: 7,500
- B: 5,000
- C: 2,500
- D: 0

**Rationale**: These thresholds align better with achievable scores based on game mechanics.

### Option B: Adjust Scoring Formulas
Keep thresholds at 50,000/30,000/15,000/5,000 but increase scoring multipliers significantly.

**Rationale**: Would require rebalancing the entire scoring system.

**Recommendation**: Proceed with **Option A** unless user prefers Option B.

## Files to Modify

### 1. `src/game/scoring.ts` (Primary Change)
Update `SCORE_GRADES` constant (lines 29-35) to use realistic thresholds.

### 2. `src/components/HighScores/HighScoresPanel.tsx` (Potential Update)
If we choose different thresholds than displayed, update the Grade Thresholds section (lines 121-153) to match.

## Verification Approach

1. **Unit Testing**: Verify `getScoreGrade` function in GameOverModal returns expected grades for various scores
2. **Manual Testing**: 
   - Play through a game and verify final grade matches score
   - Check High Scores panel displays correct thresholds
   - Verify grade colors and display are consistent
3. **Lint & Type Check**: Run project's lint/typecheck commands to ensure no TypeScript errors

## Implementation Notes

### Vercel KV Sunset (September 2025)
During implementation, discovered that Vercel KV was sunset in September 2025. Migrated to **Upstash Redis** via Vercel Marketplace instead:
- Replaced `@vercel/kv` with `@upstash/redis`
- Updated environment variable detection to use `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Same Redis API (zadd, zrange, zcard, zpopmin, del)
- Better free tier: 256 MB storage, 500K commands/month

## Questions for User (Resolved)

1. **Preferred threshold values**: ✅ Used displayed values (10k/7.5k/5k/2.5k)
2. **Should high scores be server-based?** ✅ Yes, implemented with Upstash Redis
3. **Scoring formula adjustments?** ✅ No changes needed, thresholds are now realistic
