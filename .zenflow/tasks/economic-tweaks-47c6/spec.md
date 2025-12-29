# Technical Specification: Economic Tweaks - Satellite Revenue Fix

## Task Difficulty
**Medium** - Requires understanding Redux state flow and careful modification of the game loop to ensure satellites don't generate revenue after being destroyed/removed.

## Problem Statement

Currently, satellites that are destroyed or removed during a turn still generate revenue at the beginning of that turn. This happens because the game loop executes actions in this order:

1. `advanceTurn()` - calculates and adds revenue from ALL satellites
2. `processDRVOperations()` - removes satellites captured by cooperative DRVs  
3. `processCollisions()` - removes destroyed satellites

This means a satellite destroyed in turn N generates revenue in turn N, which is incorrect per the requirement.

## Technical Context

- **Language**: TypeScript
- **Framework**: React + Redux Toolkit
- **State Management**: Redux with slices
- **Key Files**:
  - `kessler-game/src/store/slices/gameSlice.ts` - Game state and reducers
  - `kessler-game/src/hooks/useGameSpeed.ts` - Game loop that dispatches actions
  - `kessler-game/src/game/constants.ts` - Revenue constants

## Root Cause Analysis

In `gameSlice.ts:378-384`, the `advanceTurn` reducer contains:

```typescript
const satelliteRevenue = state.satellites.reduce((total, sat) => {
  return total + SATELLITE_REVENUE[sat.purpose];
}, 0);

if (satelliteRevenue > 0) {
  state.budget += satelliteRevenue;
}
```

This calculation happens before satellites are removed by:
- **Cooperative DRVs** (`processDRVOperations` at line 340: `state.satellites = state.satellites.filter(...)`)
- **Collisions** (`processCollisions` at line 531: `state.satellites = state.satellites.filter(...)`)

## Implementation Approach

### Solution: Extract Revenue Calculation to Separate Action

Move satellite revenue calculation from `advanceTurn` to a new Redux action called `addSatelliteRevenue` that is dispatched AFTER satellites are removed.

### Changes Required:

1. **gameSlice.ts**:
   - Remove satellite revenue calculation from `advanceTurn` reducer (lines 378-384)
   - Create new reducer `addSatelliteRevenue` that calculates and adds revenue
   - Keep all other `advanceTurn` functionality (step increment, budget drain, periodic income, movement, history)

2. **useGameSpeed.ts**:
   - Import the new `addSatelliteRevenue` action
   - Dispatch `addSatelliteRevenue()` AFTER both `processDRVOperations()` and `processCollisions()` (after line 86)

## Data Model Changes

**No schema changes required.** The `Satellite` interface and `GameState` remain unchanged.

## Source Code Structure

### Modified Files:
1. `kessler-game/src/store/slices/gameSlice.ts`
   - Remove revenue calculation from `advanceTurn` (lines 378-384)
   - Add new `addSatelliteRevenue` reducer
   - Export new action

2. `kessler-game/src/hooks/useGameSpeed.ts`
   - Import `addSatelliteRevenue`
   - Add dispatch call after line 86

### No New Files Required

## Verification Approach

### Manual Testing:
1. Launch the game in dev mode: `npm run dev`
2. Launch several satellites (mix of Weather, Comms, GPS)
3. Note the initial budget and satellite revenue per turn
4. Launch a cooperative DRV to remove satellites
5. **Verify**: When satellites are captured and removed, revenue decreases in the SAME turn (not the next turn)
6. Cause a collision by having high debris/satellite density
7. **Verify**: When satellites are destroyed, revenue decreases in the SAME turn

### Build & Lint:
- Run `npm run build` to check for TypeScript errors
- Run `npm run lint` to check for linting issues

### Edge Cases to Test:
- All satellites removed in one turn → revenue should be $0 that turn
- Satellite destroyed on first turn after launch → should not generate revenue
- Multiple satellites destroyed in same turn → revenue should reflect all removals immediately

## Implementation Plan

Given the straightforward nature of this fix, a detailed multi-step plan is not necessary. The implementation can proceed directly with:

1. Modify `gameSlice.ts` to extract revenue calculation
2. Update `useGameSpeed.ts` to dispatch revenue action after removals
3. Test manually to verify correct behavior
4. Run build and lint checks

## Success Criteria

- ✅ Satellites destroyed by collisions do not generate revenue in the turn they are destroyed
- ✅ Satellites removed by cooperative DRVs do not generate revenue in the turn they are removed
- ✅ All other game mechanics remain unchanged (budget drain, periodic income, scoring, etc.)
- ✅ TypeScript compilation succeeds (`npm run build`)
- ✅ Linting passes (`npm run lint`)
