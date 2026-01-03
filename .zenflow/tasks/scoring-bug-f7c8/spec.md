# Technical Specification: Scoring Bug Fix

## Problem Summary

The game awards points from turn 1 even when no satellites or DRVs are launched:
- **Turn 1 score**: 2,200 points
- **Score increase per turn**: 200 points
- **Expected behavior**: Points should only be awarded if there are satellites or DRVs in orbit

## Root Cause Analysis

After analyzing the codebase, the issue stems from two score components being calculated incorrectly:

### 1. Budget Management Score
**Location**: `kessler-game/src/game/scoring.ts:59-62`

**Current implementation**:
```typescript
export function calculateBudgetManagementScore(budget: number): number {
  if (budget < 0) return 0;
  return (budget / 1_000_000) * SCORE_CONFIG.BUDGET_MULTIPLIER;
}
```

**Issue**: Awards points based on current budget amount. With normal difficulty starting at $200M:
- Score = (200,000,000 / 1,000,000) * 10 = **2,000 points**
- This is awarded from turn 0/1, even with no activity

### 2. Survival Score
**Location**: `kessler-game/src/game/scoring.ts:64-70`

**Current implementation**:
```typescript
export function calculateSurvivalScore(days: number): number {
  const multiplier = SCORE_CONFIG.SURVIVAL.MULTIPLIERS
    .slice()
    .reverse()
    .find(m => days >= m.threshold)?.multiplier ?? 1;
  return days * SCORE_CONFIG.SURVIVAL.BASE * multiplier;
}
```

**Issue**: Awards points based on days survived regardless of player activity:
- Days increment every second (via `incrementDays()` in `useGameSpeed.ts:49-53`)
- After 4 seconds/days: 4 * 50 * 1 = **200 points**
- Continues to increase by 50 points per day

**Combined**: 2,000 + 200 = 2,200 points at turn 1, matching the bug report.

### 3. Score Calculation Trigger
**Location**: `kessler-game/src/store/middleware/scoreMiddleware.ts:20-32`

The middleware recalculates score on every game action, including `advanceTurn`, which means these "idle" scores are continuously updated.

## Technical Context

- **Language**: TypeScript
- **Framework**: React + Redux Toolkit
- **Architecture**: Redux slices with middleware for score calculation
- **Key files**:
  - `kessler-game/src/game/scoring.ts` - Core scoring logic
  - `kessler-game/src/store/slices/scoreSlice.ts` - Redux state management
  - `kessler-game/src/store/middleware/scoreMiddleware.ts` - Score recalculation trigger

## Implementation Approach

Based on the requirement that **"Points should only be awarded if there are satellites or DRVs in orbit"**, the fix should modify the scoring functions to check for active entities:

### Option A: Conditional Scoring (Recommended)
Modify both scoring functions to return 0 when no satellites or DRVs are active:

1. **Budget Management Score**: Only award when satellites or DRVs exist
2. **Survival Score**: Only award when satellites or DRVs exist

**Rationale**: This aligns with the bug report requirement and makes gameplay sense - you shouldn't earn survival/management points if you haven't deployed any assets.

### Option B: Game-Over-Only Scoring
These scores could be treated as "final bonus" scores only calculated at game over.

**Decision**: Option A is recommended as it provides ongoing feedback and aligns with the stated requirement.

## Files to Modify

### 1. `kessler-game/src/game/scoring.ts`
- Modify `calculateBudgetManagementScore()` to accept satellites and DRVs count
- Modify `calculateSurvivalScore()` to accept satellites and DRVs count
- Return 0 if both counts are 0

### 2. `kessler-game/src/store/slices/scoreSlice.ts`
- Update `calculateScore` reducer to pass satellite and DRV counts to scoring functions

## Data Model Changes

**Function signature changes**:

**Before**:
```typescript
calculateBudgetManagementScore(budget: number): number
calculateSurvivalScore(days: number): number
```

**After**:
```typescript
calculateBudgetManagementScore(budget: number, hasSatellitesOrDRVs: boolean): number
calculateSurvivalScore(days: number, hasSatellitesOrDRVs: boolean): number
```

## Verification Approach

### Test Steps
1. **Fresh game start**:
   - Initialize a new game
   - Verify Turn 1 score is 0
   - Advance several turns without launching anything
   - Verify score remains 0

2. **After launching satellite**:
   - Launch a satellite
   - Verify score now includes budget management and survival components
   - Advance turns
   - Verify score increases with survival score

3. **After satellite destruction**:
   - Cause satellite to be destroyed
   - Verify if no satellites/DRVs remain, scoring stops incrementing survival/budget scores

4. **After launching DRV**:
   - Launch a DRV (with no satellites)
   - Verify score includes budget management and survival components

### Manual Verification Commands
```bash
cd kessler-game
npm run dev
```

Then test in browser:
1. Start game on normal difficulty
2. Check Turn 1 score = 0
3. Launch satellite
4. Check score increases appropriately

### Automated Testing
If test framework exists in the project:
```bash
npm test
```

Run lint and typecheck:
```bash
npm run lint
npm run typecheck  # or tsc --noEmit
```

## Edge Cases & Considerations

1. **Satellite recovery**: When satellites are recovered (moved to graveyard), should they still count as "active"?
   - **Decision**: Graveyard satellites are still in orbit, so they should count
   
2. **Expired DRVs**: DRVs that have been decommissioned no longer count
   - **Implementation**: Check `debrisRemovalVehicles` array length (only includes active ones)

3. **Score history**: Historical score entries should remain unchanged
   - **Impact**: None - score history records snapshot values

4. **Game difficulty**: Budget amounts vary by difficulty, but logic remains the same
   - **No changes needed**

## Complexity Assessment

**Difficulty**: Easy

**Justification**:
- Straightforward bug fix with clear root cause
- Limited scope: 2 function modifications in one file, 1 update in another
- No architectural changes required
- No new dependencies
- Simple boolean check logic

## Implementation Plan

Given the straightforward nature of this fix, a single Implementation step is sufficient:

1. Modify `calculateBudgetManagementScore()` in `scoring.ts`
2. Modify `calculateSurvivalScore()` in `scoring.ts`
3. Update calls in `scoreSlice.ts` to pass the check
4. Test manually in the browser
5. Run lint/typecheck if available
6. Document changes in report.md
