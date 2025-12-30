# Bug Investigation: Captured Satellite Not Removed

## Bug Description
When there is only one captured satellite in orbit, it never gets removed.

## Root Cause Analysis

### Affected Components
- `kessler-game/src/game/engine/debrisRemoval.ts` - `processCooperativeDRVOperations` function (lines 179-292)
- `kessler-game/src/game/engine/debrisRemoval.ts` - `processGeoTugOperations` function (lines 324-420)

### Key Constants
- `ORBITS_TO_HOLD = 2` (line 4) - Number of orbits a DRV should hold a captured object before removing it

### Current Logic Flow

When a cooperative DRV captures a satellite:
1. **Capture turn**: Sets `captureOrbitsRemaining = ORBITS_TO_HOLD` (which is 2)
2. **Next turn**: Calculates `orbitsRemaining = 2 - 1 = 1`, continues holding
3. **Next turn**: Calculates `orbitsRemaining = 1 - 1 = 0`, checks condition

The key code is at line 211-213:
```javascript
const orbitsRemaining = (drv.captureOrbitsRemaining ?? ORBITS_TO_HOLD) - 1;

if (orbitsRemaining <= 0) {
  // Remove satellite
}
```

### The Bug

The condition `if (orbitsRemaining <= 0)` causes the satellite to be removed when `orbitsRemaining == 0`.

However, the semantic meaning of `ORBITS_TO_HOLD = 2` is "hold for 2 complete orbits". The current implementation:
- Turn 1: Capture, set counter to 2
- Turn 2: Decrement to 1 (1st orbit completed), keep holding  
- Turn 3: Decrement to 0 (2nd orbit completed), **REMOVES** (via `<= 0` condition)

This means the satellite is held for only **1 full orbit** (between turn 2-3), not 2 orbits as intended.

The correct behavior should be:
- Turn 1: Capture, set counter to 2
- Turn 2: Decrement to 1 (1st orbit completed), keep holding
- Turn 3: Decrement to 0 (2nd orbit completed), **keep holding**
- Turn 4: Decrement to -1 (holding period over), **REMOVES** (via `< 0` condition)

### Proposed Solution

Change the condition from `orbitsRemaining <= 0` to `orbitsRemaining < 0` in two places:

1. Line 213 in `processCooperativeDRVOperations`
2. Line 352 in `processGeoTugOperations`

This ensures satellites are held for the full `ORBITS_TO_HOLD` (2) orbits before removal.

### Edge Cases to Consider
- Multiple DRVs capturing multiple satellites
- DRV capturing satellite in different orbital layers
- DRV with undefined `captureOrbitsRemaining` value
- Satellite removed by collision before DRV completes holding period

### Test Scenarios
1. Single DRV captures single satellite - should hold for 2 orbits then remove
2. DRV captures satellite, satellite collides during holding - DRV should release gracefully
3. Multiple DRVs capture multiple satellites - all should be held for 2 orbits
4. GeoTug captures satellite - should hold for 2 orbits then move to graveyard

---

## Implementation

### Initial Changes Made (First Fix)

Fixed the bug by changing the holding condition from `orbitsRemaining <= 0` to `orbitsRemaining < 0` in two locations:

1. **Line 213** in `processCooperativeDRVOperations` function
   - Changed: `if (orbitsRemaining <= 0)` → `if (orbitsRemaining < 0)`
   
2. **Line 352** in `processGeoTugOperations` function
   - Changed: `if (orbitsRemaining <= 0)` → `if (orbitsRemaining < 0)`

### Additional Bug Discovered

After user testing, discovered that satellites were being **targeted but never captured**. Investigation revealed the same off-by-one error exists in the targeting logic.

With `ORBITS_TO_TARGET = 1` and the buggy condition `<= 0`:
- Turn 1: Start targeting, set counter to 1
- Turn 2: Calculate turnsRemaining = 0, condition true, capture immediately

This means satellites are captured instantly (0 orbits) instead of after 1 complete orbit.

### Additional Changes Made (Second Fix)

Fixed the targeting bug by changing the targeting condition from `turnsRemaining <= 0` to `turnsRemaining < 0` in two locations:

3. **Line 262** in `processCooperativeDRVOperations` function
   - Changed: `if (turnsRemaining <= 0)` → `if (turnsRemaining < 0)`
   
4. **Line 390** in `processGeoTugOperations` function
   - Changed: `if (turnsRemaining <= 0)` → `if (turnsRemaining < 0)`

### Verification

- **Build**: ✅ Passed (`npm run build`)
- **Lint**: ✅ Passed (`npm run lint`)
- **Tests**: N/A (No testing framework configured in project)

### Implementation Notes

**Holding behavior** - The fix ensures that captured satellites are held for the full `ORBITS_TO_HOLD` (2) orbits before being removed:
- Turn 1: Capture, set counter to 2
- Turn 2: Decrement to 1 (1st orbit completed), continue holding
- Turn 3: Decrement to 0 (2nd orbit completed), continue holding
- Turn 4: Decrement to -1 (holding period over), remove satellite

**Targeting behavior** - The fix ensures that satellites are targeted for the full `ORBITS_TO_TARGET` (1) orbit before being captured:
- Turn 1: Start targeting, set counter to 1
- Turn 2: Decrement to 0 (1st orbit completed), continue targeting
- Turn 3: Decrement to -1 (targeting period over), capture satellite

This corrects the previous behavior where:
- Satellites were removed after only 1 complete orbit instead of 2
- Satellites were captured immediately instead of after 1 complete orbit
