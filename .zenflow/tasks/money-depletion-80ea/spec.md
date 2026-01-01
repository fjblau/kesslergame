# Technical Specification: Money Depletion Issue

## Complexity Assessment
**Difficulty: Medium**

The issue involves timing and state synchronization between React effects and Redux state updates. While the fix is conceptually straightforward, it requires understanding the game loop timing and ensuring the auto-pause mechanism activates reliably before game over conditions are met.

---

## Problem Summary

**User Report**: When budget is critical, the game stops operating before the user can respond.

**Root Cause Analysis**:

1. **Current Budget Monitoring Flow**:
   - Auto-pause check occurs in `useGameSpeed.ts:61-66` when `autoPauseOnBudgetLow` is enabled
   - Triggers when `budget < $20,000,000`
   - Check happens when the `useEffect` re-runs (triggered by budget state change)

2. **Game Over Condition** (`gameSlice.ts:702-706`):
   - Game ends when `budget < $0`
   - Check happens at the END of each turn within the game loop interval
   - Called after: `processDRVOperations()` → `advanceTurn()` → `processCollisions()` → `addSatelliteRevenue()`

3. **The Timing Problem**:
   - **Turn execution** happens inside `setInterval()` callback (lines 72-293 of `useGameSpeed.ts`)
   - Budget can drop significantly in a single turn due to:
     - Budget drain on "challenge" difficulty ($2M/turn)
     - Multiple satellite collisions (losing revenue streams)
     - No insurance payouts if satellites had no insurance
   - If budget drops from `>$20M` to `<$0` within a **single turn execution**, the game ends before auto-pause can trigger
   - Even if budget lands between `$0-$20M`, fast mode (2s intervals) gives users minimal reaction time
   - The auto-pause check only runs when the effect **re-runs** (after the interval callback completes and state updates propagate), but by then `checkGameOver()` may have already set `gameOver = true`

4. **Critical Window**:
   - Fast mode: 2-second intervals (even less with risk multipliers)
   - Normal mode: 4-second intervals (with risk multipliers: 6s for MEDIUM, 8s for CRITICAL)
   - If budget drops rapidly in consecutive turns, users may not have time to pause and assess

---

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **Framework**: React 18 with Redux Toolkit
- **State Management**: Redux with Redux Toolkit slices

### Relevant Files
- `kessler-game/src/hooks/useGameSpeed.ts` (lines 56-66, 72-296)
- `kessler-game/src/store/slices/gameSlice.ts` (lines 474-488, 574-582, 702-706)
- `kessler-game/src/store/slices/uiSlice.ts` (lines 9, 21-23)
- `kessler-game/src/game/constants.ts` (lines 85-125)

### Current Architecture

**Game Loop** (`useGameSpeed.ts`):
```typescript
// Effect dependency: budget
useEffect(() => {
  // Auto-pause check happens HERE (before interval setup)
  const shouldPause = autoPauseBudgetLow && budget < 20_000_000;
  if (shouldPause) {
    dispatch(setGameSpeed('paused'));
    return;
  }
  
  // Interval is set up
  const interval = setInterval(() => {
    // Turn execution
    dispatch(processDRVOperations());
    dispatch(advanceTurn());           // Budget drain happens here
    dispatch(processCollisions());      // Budget effects from insurance
    dispatch(addSatelliteRevenue());   // Budget increase
    dispatch(checkGameOver());         // GAME OVER check - may end game
  }, intervalDuration);
  
  return () => clearInterval(interval);
}, [budget, ...]);  // Effect re-runs when budget changes
```

**Race Condition**:
1. Turn N starts executing in the interval callback
2. `advanceTurn()` drains budget (challenge mode: -$2M)
3. `processCollisions()` destroys satellites with insurance payouts
4. `addSatelliteRevenue()` adds revenue from remaining satellites
5. Budget drops from $22M → $-3M
6. `checkGameOver()` sees `budget < 0` → sets `gameOver = true`
7. Effect re-runs with new budget state
8. Auto-pause check sees `budget < 20M` but game is already over

---

## Implementation Approach

### Strategy: Proactive Critical Budget Detection

Move the budget threshold check **inside the game loop interval** so it evaluates BEFORE `checkGameOver()` is called. This ensures the game pauses to alert the user when budget becomes critical, giving them a chance to assess the situation before game over.

### Specific Changes

#### 1. Add Critical Budget Check in Game Loop
**File**: `kessler-game/src/hooks/useGameSpeed.ts`

**Location**: Inside the `setInterval` callback, after `addSatelliteRevenue()` and BEFORE `checkGameOver()`

**Logic**:
```typescript
// After addSatelliteRevenue()
const updatedState = (store.getState() as RootState).game;

// Check if budget is critically low and pause if needed
if (autoPauseBudgetLow && updatedState.budget < 20_000_000 && !updatedState.gameOver) {
  dispatch(setGameSpeed('paused'));
  clearInterval(interval);
  return;
}

// Then proceed to checkGameOver()
dispatch(checkGameOver());
```

**Rationale**: 
- Checks budget immediately after all turn operations complete
- Pauses BEFORE `checkGameOver()` can trigger game over
- Clears the current interval to prevent further turns
- User gets a paused game with budget gauge showing critical state
- User can then choose to launch satellites, adjust strategy, or accept game over

#### 2. Remove Redundant Auto-Pause Check
**File**: `kessler-game/src/hooks/useGameSpeed.ts`

**Location**: Lines 56-66 (the existing auto-pause check)

**Action**: Keep the check for safety, but the in-loop check will handle the critical case

**Rationale**: The existing check still serves as a safety net if budget drops due to user actions (launching satellites/DRVs) rather than turn progression.

---

## Data Model / API / Interface Changes

**No breaking changes**. All existing Redux state and actions remain unchanged.

**Behavioral Change**:
- Game will pause more reliably when budget drops below $20M threshold
- Pause happens synchronously within the turn execution, not on effect re-run
- User will always get a chance to respond before game over (unless they're already at $0 when turn starts)

---

## Verification Approach

### Manual Testing

1. **Test Case: Rapid Budget Drain on Challenge Difficulty**
   - Start game on "Challenge" difficulty (starts at $100M, drains $2M/turn)
   - Launch several satellites and DRVs to bring budget close to $20M
   - Enable fast-forward mode
   - **Expected**: Game pauses when budget crosses below $20M threshold
   - **Verify**: User can see budget gauge in red, game is paused, can make decisions

2. **Test Case: Multiple Collisions**
   - Set up a scenario with many satellites in LEO (no insurance)
   - Let debris accumulate and cause cascade
   - Monitor budget as satellites are destroyed
   - **Expected**: Game pauses when budget drops below $20M due to lost revenue
   - **Verify**: Game pauses before going negative

3. **Test Case: Budget Recovery After Pause**
   - Get budget below $20M to trigger auto-pause
   - While paused, launch a high-revenue satellite (GPS: $200k/turn)
   - Resume game
   - **Expected**: Game continues normally if budget recovers

4. **Test Case: Disable Auto-Pause**
   - Turn off "Auto-pause on budget low" in game settings
   - Let budget drop below $20M
   - **Expected**: Game continues without pausing until budget < $0

### Code Review Checklist

- [ ] Budget check occurs after `addSatelliteRevenue()` and before `checkGameOver()`
- [ ] Interval is cleared when pausing due to critical budget
- [ ] `autoPauseBudgetLow` setting is respected
- [ ] No infinite loops or redundant pause triggers
- [ ] Game over still triggers correctly when budget < $0 and user chooses to continue

### Edge Cases to Test

1. **Budget exactly at $0**: Should pause, not end game
2. **Budget at $19,999,999**: Should pause
3. **Budget goes from $25M to -$10M in one turn**: Game ends (no way to prevent)
4. **Fast-forward with risk multipliers**: Should still pause reliably
5. **Multiple collisions in one turn**: Should pause after all turn operations complete

---

## Risk Assessment

**Low Risk**:
- Change is localized to game loop timing
- No changes to game state structure
- Existing auto-pause mechanism is preserved as fallback
- Easy to rollback if issues arise

**Potential Issues**:
- If budget check is too aggressive, might pause too frequently (mitigated by keeping $20M threshold)
- Need to ensure interval is properly cleared to avoid memory leaks

---

## Testing Commands

**Run TypeScript type checking**:
```bash
cd kessler-game && npm run typecheck
```

**Run linting**:
```bash
cd kessler-game && npm run lint
```

**Build for production**:
```bash
cd kessler-game && npm run build
```

**Start dev server**:
```bash
cd kessler-game && npm run dev
```

---

## Success Criteria

✅ Game pauses reliably when budget drops below $20M threshold  
✅ User always has opportunity to respond before game over (except extreme single-turn drops)  
✅ Auto-pause setting still works correctly when toggled  
✅ No memory leaks from interval management  
✅ TypeScript compiles without errors  
✅ Linting passes without warnings
