# Bug Investigation: Game Pauses When Status Changes

## Bug Summary
The game automatically pauses whenever the risk level (status) changes between LOW, MEDIUM, and CRITICAL. Specifically:
- Pauses when changing from LOW → MEDIUM
- Pauses when changing from MEDIUM → CRITICAL
- This behavior is undesired and interrupts gameplay

## Root Cause Analysis

### Location
`kessler-game/src/hooks/useGameSpeed.ts:28-33`

### Code
```typescript
useEffect(() => {
  if (autoPauseOnRiskChange && riskLevel !== previousRiskLevel.current) {
    dispatch(setGameSpeed('paused'));
  }
  previousRiskLevel.current = riskLevel;
}, [riskLevel, autoPauseOnRiskChange, dispatch]);
```

### Issue
The effect triggers on **ANY** risk level change (`riskLevel !== previousRiskLevel.current`), causing the game to pause every time the status transitions between levels.

### Risk Level Calculation
Risk levels are determined by debris count (in `game/engine/risk.ts`):
- **LOW**: < 150 debris
- **MEDIUM**: 150-300 debris  
- **CRITICAL**: > 300 debris

The risk level is recalculated after every DRV operation in `gameSlice.ts:339`:
```typescript
state.riskLevel = calculateRiskLevel(state.debris.length);
```

## Affected Components
1. `kessler-game/src/hooks/useGameSpeed.ts` - Contains the problematic pause logic
2. `kessler-game/src/store/slices/uiSlice.ts` - Defines `autoPauseOnRiskChange` (defaults to `true`)
3. `kessler-game/src/game/types.ts` - Type definition for `autoPauseOnRiskChange`

## Proposed Solution

**Option 1: Only pause on CRITICAL (Recommended)**
Modify the condition to only pause when the risk level becomes CRITICAL:
```typescript
useEffect(() => {
  if (autoPauseOnRiskChange && riskLevel === 'CRITICAL' && previousRiskLevel.current !== 'CRITICAL') {
    dispatch(setGameSpeed('paused'));
  }
  previousRiskLevel.current = riskLevel;
}, [riskLevel, autoPauseOnRiskChange, dispatch]);
```

**Rationale**: Pausing when reaching CRITICAL status makes sense as an important alert, but pausing on every status change (LOW→MEDIUM) is disruptive to gameplay.

**Option 2: Remove auto-pause on risk change entirely**
Change the default to `false` in `uiSlice.ts` or remove the feature completely.

**Recommendation**: Implement Option 1 - it provides a useful warning when things get critical while not interrupting normal gameplay transitions.

## Edge Cases & Considerations
- When debris count fluctuates around threshold values (149-151 for LOW/MEDIUM), should avoid rapid pause/unpause cycles
- Solution addresses this by only checking the transition TO CRITICAL, not from it
- Users can still disable the feature via the UI toggle if desired
- Maintains backward compatibility with the existing `autoPauseOnRiskChange` setting
