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

### Initial Changes Made (INCORRECT - Later Reverted)

Initially tried changing the holding condition from `orbitsRemaining <= 0` to `orbitsRemaining < 0`, but this was **incorrect** and caused satellites to be held for 3 turns instead of 2.

### Root Cause - Misunderstanding of Counter Semantics

**Key Insight:** Both targeting and holding use countdown timers that should trigger when they reach 0, not when they go negative:
- `ORBITS_TO_HOLD = 2` means "hold for 2 turns AFTER capturing" → triggers when counter reaches 0
- `ORBITS_TO_TARGET = 1` means "takes 1 turn TO capture" → triggers when counter reaches 0
- **Both require `<= 0` condition**

### Third Bug Discovered - targetDebrisId Not Cleared

After user testing again, discovered satellites were being captured but **never removed**. Investigation revealed that while holding, the DRV was keeping `targetDebrisId` pointing to the captured satellite.

**Issue:** When capturing or holding, the code was returning `newTargetId: drv.targetDebrisId`, which kept the target ID set even while the object was captured. This created an inconsistent state where both `targetDebrisId` and `capturedDebrisId` pointed to the same object.

### Third Fix - Clear targetDebrisId During Capture and Holding

Changed four locations to return `newTargetId: undefined` instead of `newTargetId: drv.targetDebrisId`:

5. **Line 266** in `processCooperativeDRVOperations` (capture transition)
   - Changed: `newTargetId: drv.targetDebrisId` → `newTargetId: undefined`
   
6. **Line 236** in `processCooperativeDRVOperations` (while holding)
   - Changed: `newTargetId: drv.targetDebrisId` → `newTargetId: undefined`
   
7. **Line 393** in `processGeoTugOperations` (capture transition)
   - Changed: `newTargetId: drv.targetDebrisId` → `newTargetId: undefined`
   
8. **Line 365** in `processGeoTugOperations` (while holding)
   - Changed: `newTargetId: drv.targetDebrisId` → `newTargetId: undefined`

This ensures proper state transitions: targeting → captured (clear target) → holding (keep target clear) → removed (find new target).

### Fourth Bug - Holding Condition Wrong (FINAL FIX)

After user verification, discovered that satellites were **still** not being removed. The holding condition `< 0` was incorrect - it caused satellites to be held for 3 turns instead of 2.

**Final Fix:** Reverted holding conditions back to `<= 0`:

9. **Line 213** in `processCooperativeDRVOperations` function
   - Reverted: `if (orbitsRemaining < 0)` → `if (orbitsRemaining <= 0)`
   
10. **Line 352** in `processGeoTugOperations` function
    - Reverted: `if (orbitsRemaining < 0)` → `if (orbitsRemaining <= 0)`

### Final Implementation Summary

**Holding behavior** - Satellites are held for exactly `ORBITS_TO_HOLD` (2) turns:
- Turn when captured: Set `captureOrbitsRemaining = 2`
- Turn 1 of holding: Decrement to 1, continue holding
- Turn 2 of holding: Decrement to 0, check `0 <= 0` → **remove**
- Total: Held for exactly 2 turns

**Targeting behavior** - Targets for exactly `ORBITS_TO_TARGET` (1) turn:
- Turn when targeted: Set `targetingTurnsRemaining = 1`
- Next turn: Decrement to 0, check `0 <= 0` → **capture**
- Total: 1 turn of targeting before capture

**State management** - Clear `targetDebrisId` during capture and holding:
- Prevents inconsistent state where both target and captured IDs are set
- Ensures proper state transitions through the DRV lifecycle

### Verification

- **Build**: ✅ Passed (`npm run build`)
- **Lint**: ✅ Passed (`npm run lint`)
- **Tests**: N/A (No testing framework configured in project)
