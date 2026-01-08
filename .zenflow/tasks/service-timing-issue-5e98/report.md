# Service Timing Issue - Implementation Report

## Task Description
A satellite that is captured by a Service Vehicle cannot be expired or de-orbited. There should be some buffer to allow for the refueling.

## Changes Made

### Modified Files

1. **kessler-game/src/store/slices/gameSlice.ts**
   - Updated `expireSatellites` reducer to check if satellites are currently captured by any DRV before expiring them
   - Added logic to build a set of captured satellite IDs from all debris removal vehicles
   - Modified the satellite filtering logic to exclude captured satellites from expiration
   - Location: Lines 792-810

2. **kessler-game/src/store/slices/gameSlice.refueling.test.ts**
   - Added two new tests to verify the fix:
     - `should not expire satellites captured by a DRV` - Tests that satellites manually captured by a DRV are not expired
     - `should not expire satellites being refueled even if age >= maxAge` - Tests the complete refueling workflow to ensure satellites aren't expired during the refueling process
   - Location: Lines 139-208

## Implementation Details

The fix works by:
1. Collecting all satellite IDs that are currently captured by any DRV (stored in `drv.capturedDebrisId`)
2. Checking this set when determining which satellites should expire
3. Excluding any captured satellites from both the expiration count and the filter operation

This ensures that:
- Satellites being refueled are not expired while the refueling vehicle has them captured
- Satellites being handled by cooperative DRVs or geotugs are also protected from expiration
- The buffer period is implicit - satellites are protected for the entire duration they are captured (REFUEL_ORBITS = 3 for refueling, ORBITS_TO_HOLD = 2 for other operations)

## Testing

All tests pass successfully:
- ✓ All 31 existing tests continue to pass
- ✓ 2 new tests added specifically for this issue
- ✓ Linter passes with no errors
- ✓ TypeScript compilation succeeds with no errors

## Verification

The implementation was verified by:
1. Running the full test suite: `npm run test:run` - All 31 tests passed
2. Running the linter: `npm run lint` - No errors
3. Running type checking: `npx tsc --noEmit` - No errors
