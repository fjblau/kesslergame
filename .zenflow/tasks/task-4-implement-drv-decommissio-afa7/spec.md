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
- Called after age increment in turn processing
- Exported from gameSlice for use by game engine/UI
- Pure function with no side effects (standard Redux pattern)

## Source Code Changes

### Files to Modify

**`kessler-game/src/store/slices/gameSlice.ts`**
- Add `decommissionExpiredDRVs` reducer (no payload needed)
- Export action in the destructured exports (line 112-119)

### Implementation Details

```typescript
decommissionExpiredDRVs: (state) => {
  const expired = state.debrisRemovalVehicles.filter(drv => drv.age >= drv.maxAge);
  
  expired.forEach(drv => {
    state.debris.push({
      id: generateId(),
      x: drv.x,
      y: drv.y,
      layer: drv.layer,
      type: 'cooperative',
    });
  });
  
  state.debrisRemovalVehicles = state.debrisRemovalVehicles.filter(
    drv => drv.age < drv.maxAge
  );
}
```

## Data Model Changes

No interface or type changes required. All necessary types exist:
- `DebrisRemovalVehicle` interface (complete)
- `Debris` interface (complete)
- `DebrisType` type (includes 'cooperative')

## Verification Approach

### Manual Testing
1. Launch a DRV (cooperative or uncooperative)
2. Advance turns until DRV reaches maxAge
3. Verify DRV is removed from the vehicles array
4. Verify cooperative debris appears at the DRV's position

### Code Quality Checks
- Run TypeScript compiler to verify type correctness
- Run project linter if configured
- Verify no console errors in development build

### Integration Verification
The action needs to be called appropriately in the game loop. Determine where:
- Check existing game engine files for turn processing
- Verify the action is dispatched after `advanceTurn`
- This may require checking files like game hooks or engine modules

## Complexity Assessment

**Easy** - Justification:
- Single reducer function addition
- No new types or interfaces needed
- Follows existing patterns (similar to other state mutations)
- Clear requirements with no ambiguity
- Minimal integration complexity
