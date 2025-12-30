# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: e60a1234-2190-48d0-8db1-bbd7bb0a6713 -->

**Difficulty: Medium**

Technical specification created at `.zenflow/tasks/refactor-orbital-and-capture-fun-0d84/spec.md`

Key findings:
- Current collision uses polar coordinates (angle + radius) which is scale-dependent
- Need to add `radius` and `captureRadius` fields to all orbital objects
- Replace angular/radial collision with Euclidean distance + object radii
- Must handle x-axis wraparound (toroidal geometry)
- Spatial hash optimization should be preserved

---

## Implementation Steps

### [x] Step 1: Update Data Model and Constants
<!-- chat-id: b082ef83-c61f-419c-915b-70b1ddbc2bdf -->

**Objective**: Add radius properties to type definitions and create radius constants.

**Changes**:
- `src/game/types.ts`: Add `radius` and `captureRadius?` to `Satellite`, `Debris`, `DebrisRemovalVehicle`
- `src/game/constants.ts`: Add `OBJECT_RADII` and `CAPTURE_RADIUS_MULTIPLIER` constants

**Verification**:
- Run `npm run build` to check TypeScript compilation
- Run `npm run lint` to verify code style
- No runtime errors expected (additive changes only)

---

### [x] Step 2: Implement Euclidean Collision Detection
<!-- chat-id: 143be75c-6540-40da-8c39-435111610517 -->

**Objective**: Replace polar coordinate collision with Euclidean distance-based detection.

**Changes**:
- `src/game/engine/collision.ts`:
  - Add `areObjectsColliding(obj1, obj2)` function using Euclidean distance
  - Update `detectCollisions()` to use new collision function
  - Update spatial hash grid to bucket by x-position instead of angle
  - Keep `toPolarCoordinates` and `normalizeAngleDiff` as commented reference
  - Remove dependency on `ORBIT_RADII` constant

**Verification**:
- Run `npm run build` to check TypeScript compilation ✅
- Run `npm run lint` ✅
- Test in browser: Launch satellites and verify collisions still occur (pending manual testing)
- Check browser console for errors (pending manual testing)

**Note**: Also implemented radius field initialization in `gameSlice.ts` and `generateDebrisFromCollision()` from Step 4.

---

### [x] Step 3: Update Capture Detection
<!-- chat-id: 4148637b-7417-4e40-b6a3-c6796c48cd04 -->

**Objective**: Replace fixed distance threshold with radius-based capture detection.

**Changes**:
- `src/game/engine/debrisRemoval.ts`:
  - Add `isWithinCaptureRange(drv, target)` function ✅
  - Update `processCooperativeDRVOperations()` to use `isWithinCaptureRange` ✅
  - Update `processGeoTugOperations()` to use `isWithinCaptureRange` ✅
  - Remove deprecated `CAPTURE_DISTANCE_THRESHOLD` and `calculateDistance()` ✅

**Verification**:
- Run `npm run build` ✅
- Run `npm run lint` ✅
- Test in browser: Launch cooperative DRV and verify it can still capture debris (pending manual testing)
- Check that capture behavior feels consistent (pending manual testing)

---

### [x] Step 4: Initialize Radius Fields on Entity Creation

**Objective**: Ensure all new entities (satellites, DRVs, debris) are created with radius fields.

**Changes**:
- `src/store/slices/gameSlice.ts`:
  - Update `launchSatellite` reducer to add `radius` and `captureRadius` ✅
  - Update `launchDRV` reducer to add `radius` and `captureRadius` ✅
  - Import `OBJECT_RADII` and `CAPTURE_RADIUS_MULTIPLIER` from constants ✅
- `src/game/engine/collision.ts`:
  - Update `generateDebrisFromCollision()` to add `radius` and `captureRadius` to debris ✅

**Verification**:
- Run `npm run build` ✅
- Run `npm run lint` ✅
- Test in browser: Launch satellites/DRVs and inspect state to verify radius fields exist (pending manual testing)
- Verify collisions work with newly created objects (pending manual testing)

**Note**: Completed during Step 2 implementation.

---

### [ ] Step 5: Manual Testing and Tuning

**Objective**: Verify all game features work correctly and tune radius values for game balance.

**Testing Checklist**:
- [ ] Game starts without errors
- [ ] Satellites can be launched in all layers (LEO, MEO, GEO)
- [ ] Collisions occur and visual overlap matches collision timing
- [ ] Collisions work across 0°/360° boundary (x-axis wraparound)
- [ ] Collision detection is consistent at small and large radii
- [ ] Cooperative DRVs can capture debris
- [ ] Geotug can capture and move satellites to graveyard
- [ ] Uncooperative DRVs remove debris
- [ ] Debris is generated from collisions
- [ ] Insurance payouts work correctly
- [ ] Game performance is smooth with 100+ objects
- [ ] Settings load from localStorage correctly
- [ ] Browser console has no errors

**Tuning**:
- Adjust `OBJECT_RADII` values if collisions feel too frequent/rare
- Adjust `CAPTURE_RADIUS_MULTIPLIER` if capture feels too easy/hard

**Verification**:
- All manual tests pass
- Game feels balanced and playable
- No console errors

---

### [ ] Step 6: Final Report

**Objective**: Document what was implemented and lessons learned.

**Deliverable**: Write report to `.zenflow/tasks/refactor-orbital-and-capture-fun-0d84/report.md` covering:
- Summary of changes made
- Final radius values chosen and rationale
- Testing results
- Any issues encountered and how they were resolved
- Comparison of collision behavior before/after refactor
- Recommendations for future improvements (elliptical orbits, etc.)
