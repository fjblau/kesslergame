# Technical Specification: DRV Decommissioning

## Technical Context

**Language**: TypeScript  
**Framework**: Redux Toolkit (RTK)  
**Target File**: `kessler-game/src/store/slices/gameSlice.ts`

## Task Overview

Implement automatic decommissioning of Debris Removal Vehicles (DRVs) when they reach their maximum operational age. When a DRV expires, it should be removed from active service and converted into cooperative debris at its current position.

## Current State Analysis

### Existing DRV Implementation
- DRVs are tracked in `GameState.debrisRemovalVehicles` array
- Each DRV has:
  - `age`: number (current operational turns)
  - `maxAge`: number (maximum operational lifetime)
  - `x`, `y`: position coordinates
  - `layer`: OrbitLayer
  - `removalType`: 'cooperative' | 'uncooperative'
- Age is incremented each turn in `advanceTurn` reducer (line 107)
- maxAge values from `DRV_CONFIG.duration`:
  - cooperative: 10 turns
  - uncooperative: 8 turns

### Debris Structure
- Interface: `{ id: string, x: number, y: number, layer: OrbitLayer, type: DebrisType }`
- DebrisType: 'cooperative' | 'uncooperative'
- Debris tracked in `GameState.debris` array

## Implementation Approach

### 1. Create `decommissionExpiredDRVs` Reducer Action

Add a new reducer to `gameSlice` that:
1. Identifies DRVs with `age >= maxAge`
2. Removes expired DRVs from `state.debrisRemovalVehicles`
3. Creates new debris entries for each decommissioned DRV
4. New debris characteristics:
   - Position: same `x`, `y`, `layer` as decommissioned DRV
   - Type: always `'cooperative'` (per requirements)
   - ID: generated using existing `generateId()` helper

### 2. Integration Pattern

The action should be:
- Called immediately after `advanceTurn()` dispatch in all locations
- Current dispatch locations:
  - `kessler-game/src/components/ControlPanel/ControlPanel.tsx:53` (after manual launch)
  - `kessler-game/src/hooks/useGameSpeed.ts:23` (in game speed loop)
- Exported from gameSlice for use by UI components
- Pure function with no side effects (standard Redux pattern)

**Implementation locations**:
```typescript
// In ControlPanel.tsx:53, change:
dispatch(advanceTurn());

// To:
dispatch(advanceTurn());
dispatch(decommissionExpiredDRVs());

// In useGameSpeed.ts:23, change:
dispatch(advanceTurn());

// To:
dispatch(advanceTurn());
dispatch(decommissionExpiredDRVs());
```

## Source Code Changes

### Files to Modify

**`kessler-game/src/store/slices/gameSlice.ts`**
- Add `decommissionExpiredDRVs` reducer (no payload needed)
- Export action in the destructured exports (line 112-119):
  ```typescript
  export const {
    initializeGame,
    launchSatellite,
    launchDRV,
    spendBudget,
    addBudget,
    advanceTurn,
    decommissionExpiredDRVs, // ADD THIS
  } = gameSlice.actions;
  ```

**`kessler-game/src/components/ControlPanel/ControlPanel.tsx`**
- Import `decommissionExpiredDRVs` action (line 3)
- Dispatch after `advanceTurn()` call (line 53)

**`kessler-game/src/hooks/useGameSpeed.ts`**
- Import `decommissionExpiredDRVs` action (line 3)
- Dispatch after `advanceTurn()` call (line 23)

### Implementation Details

**Optimized single-pass implementation**:
```typescript
decommissionExpiredDRVs: (state) => {
  const remaining = [];
  
  state.debrisRemovalVehicles.forEach(drv => {
    if (drv.age >= drv.maxAge) {
      state.debris.push({
        id: generateId(),
        x: drv.x,
        y: drv.y,
        layer: drv.layer,
        type: 'cooperative',
      });
    } else {
      remaining.push(drv);
    }
  });
  
  state.debrisRemovalVehicles = remaining;
}
```

This implementation uses a single iteration instead of filtering twice for better performance.

## Data Model Changes

No interface or type changes required. All necessary types exist:
- `DebrisRemovalVehicle` interface (complete)
- `Debris` interface (complete)
- `DebrisType` type (includes 'cooperative')

## Verification Approach

### Manual Testing Steps
1. Launch a cooperative DRV in any orbit (maxAge = 10 turns)
2. Use fast game speed or manual advance to reach turn 10+
3. Verify the DRV disappears from the visualization
4. Check Redux DevTools: `state.game.debrisRemovalVehicles` should not contain the expired DRV
5. Check Redux DevTools: `state.game.debris` should have a new cooperative debris item at the DRV's position
6. Repeat test with uncooperative DRV (maxAge = 8 turns)

### Code Quality Commands
```bash
npm run build   # Runs TypeScript compiler (tsc -b) and build
npm run lint    # Runs ESLint
```

### Verification Checklist
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no new warnings
- [ ] DRVs are removed when age >= maxAge
- [ ] Cooperative debris created at correct position and layer
- [ ] No console errors in browser dev tools
- [ ] Game continues normally after decommissioning

## Complexity Assessment

**Easy** - Justification:
- Single reducer function addition
- No new types or interfaces needed
- Follows existing patterns (similar to other state mutations)
- Clear requirements with no ambiguity
- Minimal integration complexity
