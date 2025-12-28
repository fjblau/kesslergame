# Implementation Report: Reset should clear score

## Task 1: Reset should clear score (COMPLETED)

### Changes Made

Modified `kessler-game/src/store/middleware/scoreMiddleware.ts`:
- Added `resetGame` import from gameSlice
- Updated middleware to reset score when `resetGame` action is dispatched (line 18)

### Summary

The Reset button now properly clears the score when clicked. The score is reset automatically by the middleware when the `resetGame` action is dispatched. This ensures:
1. Score state is reset to all zeros (totalScore, satelliteLaunchScore, debrisRemovalScore, etc.)
2. Score history is cleared
3. The middleware handles score reset consistently for both `initializeGame` and `resetGame` actions

## Task 2: Risk level based on debris-to-satellite ratio (COMPLETED)

### Changes Made

Modified `kessler-game/src/game/engine/risk.ts`:
- Updated `calculateRiskLevel` function signature to accept both `debrisCount` and `satelliteCount`
- Changed risk level calculation to use ratio of debris to satellites instead of absolute debris count
- New thresholds:
  - **LOW**: ratio < 2 (less than 2 debris per satellite)
  - **MEDIUM**: ratio < 5 (2-5 debris per satellite)
  - **CRITICAL**: ratio >= 5 (5 or more debris per satellite)
- Special case: when no satellites exist, risk is CRITICAL if debris exists, LOW if no debris

Modified `kessler-game/src/store/slices/gameSlice.ts`:
- Updated 4 call sites to pass both `state.debris.length` and `state.satellites.length`:
  - Line 339: After DRV operations
  - Line 512: After collisions
  - Line 546: After cleaning up expired DRVs
  - Line 552: After solar storm

Modified `kessler-game/src/components/StatsPanel/StatsPanel.tsx`:
- Updated local `calculateRiskLevel` function to use debris-to-satellite ratio
- Same thresholds as the engine function (ratio < 2 for LOW, < 5 for MEDIUM, >= 5 for CRITICAL)
- Updated call site to pass `satellites.length`
- Colors remain the same (green for LOW, yellow for MEDIUM, red for CRITICAL)

## Verification

- Linter: ✅ Passed
- TypeScript build: ✅ Passed
