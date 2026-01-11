# Technical Specification: End of Game Behaviour for Cascading Collisions

## Problem Statement

The game currently continues playing even during large-scale cascading collision events, which feels unrealistic and creates a poor user experience. When massive cascade events occur (e.g., 10-20+ simultaneous collisions), the game doesn't end until the debris count exceeds `MAX_DEBRIS_LIMIT` (250), which may take several turns. This allows catastrophic scenarios to worsen before the game ends.

## Current Behavior Analysis

### Cascade Detection (gameSlice.ts:697-701)
```typescript
if (collisions.length >= CASCADE_THRESHOLD) {
  state.cascadeTriggered = true;
  state.lastCascadeTurn = state.step;
  state.totalCascades += 1;
}
```
- `CASCADE_THRESHOLD = 3` (constants.ts:218)
- Cascade flag is set when 3+ simultaneous collisions occur
- No automatic game-ending behavior

### Game Over Check (gameSlice.ts:831-835)
```typescript
checkGameOver: (state) => {
  if (state.budget < 0 || state.step >= state.maxSteps || state.debris.length > MAX_DEBRIS_LIMIT) {
    state.gameOver = true;
  }
}
```

**Game only ends when:**
1. Budget becomes negative (`state.budget < 0`)
2. Max turns reached (`state.step >= state.maxSteps` where MAX_STEPS = 100)
3. Debris exceeds limit (`state.debris.length > MAX_DEBRIS_LIMIT` where MAX_DEBRIS_LIMIT = 250)

### Issue Flow
1. Large cascade occurs (e.g., 15 simultaneous collisions)
2. Each collision generates `debrisPerCollision` pieces (default: 5)
3. 15 collisions × 5 debris = 75 new debris pieces
4. `cascadeTriggered` flag is set
5. Cascade warning UI displays for 1 second
6. Game continues normally
7. More collisions occur in subsequent turns
8. Game only ends when debris count eventually exceeds 250

## Technical Context

**Language**: TypeScript + React + Redux Toolkit  
**Key Files**:
- `kessler-game/src/store/slices/gameSlice.ts` - Game state management
- `kessler-game/src/game/engine/collision.ts` - Collision detection
- `kessler-game/src/game/constants.ts` - Game configuration constants
- `kessler-game/src/hooks/useGameSpeed.ts` - Game loop execution
- `kessler-game/src/components/GameBoard/CascadeWarning.tsx` - Cascade UI feedback

**Dependencies**: 
- Redux Toolkit for state management
- Framer Motion for animations

## Difficulty Assessment

**Medium** - This requires:
- Understanding of game balance implications
- Careful consideration of edge cases
- Testing to ensure the fix doesn't create false positives
- UI/UX considerations for player feedback
- Potential adjustment of multiple thresholds

## Implementation Approach

### Option 1: Severe Cascade Auto-End (Recommended)

Add a "severe cascade" threshold that immediately ends the game when an unrecoverable cascade occurs.

**Benefits**:
- Clear, immediate feedback to player
- Realistic simulation of Kessler syndrome
- Preserves existing cascade detection for warnings
- Minimal changes to existing code

**Implementation**:
1. Add `SEVERE_CASCADE_THRESHOLD` constant (e.g., 10-15 simultaneous collisions)
2. Check collision count in `processCollisions` reducer
3. Set `gameOver = true` when severe cascade detected
4. Add specific game-over reason for severe cascade

### Option 2: Cascade Streak Tracking

Track consecutive turns with cascades and end the game after N consecutive cascade events.

**Benefits**:
- Allows player to attempt recovery
- More forgiving for borderline cases
- Provides clear progression toward failure

**Implementation**:
1. Add `consecutiveCascadeTurns` to game state
2. Increment when cascade occurs, reset when cascade-free turn occurs
3. End game when streak reaches threshold (e.g., 3)

### Option 3: Debris Generation Rate Check

End the game when debris generation rate exceeds potential removal capacity.

**Benefits**:
- Mathematically sound approach
- Accounts for player's actual ability to recover
- More sophisticated than simple thresholds

**Implementation**:
1. Calculate debris generation rate (debris added per turn)
2. Calculate maximum removal capacity (active DRVs × capacity)
3. End game when generation rate exceeds removal capacity by threshold

### Option 4: Auto-Pause on Cascade (Lightweight Alternative)

Instead of ending the game, automatically pause when a cascade is detected.

**Benefits**:
- Gives player awareness of critical moment
- Allows player to decide whether to continue
- Less disruptive than forced game-over

**Implementation**:
1. Check `cascadeTriggered` in game loop
2. Dispatch `setGameSpeed('paused')` 
3. Show enhanced cascade warning with option to continue/quit
4. Already has auto-pause infrastructure for collisions

## Recommended Solution

**Hybrid Approach: Severe Cascade Auto-End + Enhanced Warning**

Combine Options 1 and 4:
1. Add severe cascade threshold (10+ collisions) that immediately ends game
2. Keep existing cascade warning (3-9 collisions) with auto-pause option
3. Add cascade severity indicator to UI

This provides:
- Immediate end for truly catastrophic events
- Player agency for manageable cascades
- Clear feedback about cascade severity

## Source Code Structure Changes

### Files to Modify

#### 1. `kessler-game/src/game/constants.ts`
```typescript
export const CASCADE_THRESHOLD = 3; // Existing
export const SEVERE_CASCADE_THRESHOLD = 10; // New
```

#### 2. `kessler-game/src/game/types.ts`
```typescript
interface GameState {
  // ... existing fields
  cascadeTriggered: boolean;
  lastCascadeTurn: number | undefined;
  totalCascades: number;
  severeCascadeTriggered: boolean; // New
  consecutiveCascadeTurns: number; // New (optional for Option 2)
}
```

#### 3. `kessler-game/src/store/slices/gameSlice.ts`

**Modify `processCollisions` reducer:**
```typescript
processCollisions: (state) => {
  const collisions = detectCollisions(/* ... */);
  
  if (collisions.length === 0) {
    state.consecutiveCascadeTurns = 0; // Reset streak
    return;
  }
  
  // Existing cascade detection
  if (collisions.length >= CASCADE_THRESHOLD) {
    state.cascadeTriggered = true;
    state.lastCascadeTurn = state.step;
    state.totalCascades += 1;
    state.consecutiveCascadeTurns += 1;
  } else {
    state.consecutiveCascadeTurns = 0;
  }
  
  // New: Severe cascade detection
  if (collisions.length >= SEVERE_CASCADE_THRESHOLD) {
    state.severeCascadeTriggered = true;
    state.gameOver = true;
    state.gameOverReason = 'severe-cascade'; // New field
    // Don't process debris generation - game is over
    return;
  }
  
  // ... existing collision processing
}
```

**Modify `checkGameOver` reducer:**
```typescript
checkGameOver: (state) => {
  const isGameOver = 
    state.budget < 0 || 
    state.step >= state.maxSteps || 
    state.debris.length > MAX_DEBRIS_LIMIT ||
    state.severeCascadeTriggered; // New condition
  
  if (isGameOver && !state.gameOver) {
    state.gameOver = true;
    // Set reason if not already set
    if (!state.gameOverReason) {
      if (state.budget < 0) state.gameOverReason = 'budget';
      else if (state.step >= state.maxSteps) state.gameOverReason = 'max-turns';
      else if (state.debris.length > MAX_DEBRIS_LIMIT) state.gameOverReason = 'debris-limit';
    }
  }
}
```

#### 4. `kessler-game/src/hooks/useGameSpeed.ts`

**Add auto-pause for cascades:**
```typescript
// After collision processing
if (autoPauseOnCascade && updatedState.cascadeTriggered && !updatedState.severeCascadeTriggered && !updatedState.gameOver && updatedState.collisionPauseCooldown === 0) {
  const collisionCount = updatedState.recentCollisions.length;
  dispatch(setGameSpeed('paused'));
  dispatch(setCollisionPauseCooldown(3));
  dispatch(addEvent({
    type: 'cascade-warning',
    turn: updatedState.step,
    day: updatedState.days,
    message: `⚠️ CASCADE EVENT (${collisionCount} collisions)! Game paused. Deploy DRVs immediately or risk severe cascade.`,
    details: { autoPause: true, collisionCount }
  }));
  clearInterval(interval);
  return;
}
```

#### 5. `kessler-game/src/components/GameOver/GameOverModal.tsx`

**Add cascade-specific game over message:**
```typescript
const gameOverMessages = {
  'severe-cascade': {
    title: '💥 SEVERE CASCADE EVENT',
    message: 'Catastrophic collision cascade detected. The orbital environment has become unrecoverable.',
  },
  'debris-limit': {
    title: '🛑 DEBRIS LIMIT EXCEEDED',
    message: 'Debris count exceeded safe operational limits.',
  },
  // ... other reasons
};
```

#### 6. `kessler-game/src/components/Configuration/AutoPauseSettings.tsx`

**Add auto-pause on cascade option:**
```typescript
// New setting
<SettingToggle
  label="Auto-Pause on Cascade"
  checked={autoPauseOnCascade}
  onChange={(checked) => dispatch(setAutoPauseOnCascade(checked))}
  description="Automatically pause the game when a collision cascade is detected"
/>
```

## Data Model Changes

### GameState Interface Updates
```typescript
interface GameState {
  // ... existing fields
  gameOverReason?: 'budget' | 'max-turns' | 'debris-limit' | 'severe-cascade'; // New
  severeCascadeTriggered: boolean; // New
  consecutiveCascadeTurns: number; // New
}

// Initial state updates
const initialState: GameState = {
  // ... existing
  gameOverReason: undefined,
  severeCascadeTriggered: false,
  consecutiveCascadeTurns: 0,
};
```

### UIState Interface Updates
```typescript
interface UIState {
  // ... existing fields
  autoPauseOnCascade: boolean; // New
}
```

## Verification Approach

### Unit Tests
1. Test severe cascade detection with 10+ collisions
2. Test game-over triggers correctly with severe cascade
3. Test consecutive cascade tracking
4. Test auto-pause on cascade
5. Test game continues normally with <3 collisions

### Integration Tests
1. Simulate large-scale cascade scenario
2. Verify game ends at appropriate threshold
3. Verify UI displays correct game-over message
4. Test auto-pause configuration option

### Manual Testing Scenarios
1. **Scenario A**: Trigger 3-9 simultaneous collisions, verify auto-pause (if enabled)
2. **Scenario B**: Trigger 10+ simultaneous collisions, verify immediate game over
3. **Scenario C**: Create cascading collisions over multiple turns, verify consecutive tracking
4. **Scenario D**: Disable auto-pause, verify cascade warning still displays
5. **Scenario E**: Test existing game-over conditions still work (budget, max turns, debris limit)

### Testing Commands
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Type check
npm run typecheck
```

## Edge Cases to Consider

1. **Multiple simultaneous game-over conditions**: If severe cascade AND debris limit AND budget negative all occur on same turn, which reason should display?
   - **Solution**: Prioritize severe cascade as most dramatic/immediate cause

2. **Cascade triggered but game already over**: Prevent double game-over processing
   - **Solution**: Check `!state.gameOver` before processing cascade

3. **Collision count exactly at threshold**: 10 collisions should trigger severe cascade
   - **Solution**: Use `>=` not `>`

4. **Cascade warning spam**: Multiple cascades in quick succession
   - **Solution**: Use existing `collisionPauseCooldown` mechanism

5. **DRV collisions**: Should collisions involving DRVs count toward cascade?
   - **Current behavior**: Yes, DRVs are included in collision detection
   - **Keep this**: DRV destruction contributes to cascade severity

## Configuration Tuning

Recommended threshold values for testing:

```typescript
CASCADE_THRESHOLD = 3           // Light cascade - warning only
SEVERE_CASCADE_THRESHOLD = 10   // Catastrophic - immediate game over
MAX_DEBRIS_LIMIT = 250          // Existing limit
```

Alternative conservative values:
```typescript
CASCADE_THRESHOLD = 5           // Higher warning threshold
SEVERE_CASCADE_THRESHOLD = 15   // Very catastrophic only
MAX_DEBRIS_LIMIT = 200          // Lower debris tolerance
```

## Open Questions for User

1. **Threshold values**: Should severe cascade threshold be 10, 12, or 15 simultaneous collisions?
2. **Auto-pause default**: Should auto-pause on cascade be enabled by default?
3. **Recovery possibility**: Should there be any way to recover from a severe cascade, or should it always end the game?
4. **Streak threshold**: If implementing consecutive cascade tracking, should 2 or 3 consecutive cascade turns end the game?
5. **UI feedback**: Should the severe cascade game-over screen show different visuals than normal game over (e.g., special animation)?

## Implementation Priority

1. ✅ **High Priority**: Add severe cascade threshold and immediate game-over
2. ✅ **High Priority**: Add game-over reason tracking
3. ✅ **Medium Priority**: Add auto-pause on cascade option
4. ⚠️ **Low Priority**: Add consecutive cascade tracking (nice-to-have)
5. ⚠️ **Low Priority**: Enhanced cascade warning UI with severity indicator
