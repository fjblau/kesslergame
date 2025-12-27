# Technical Specification: Fix Game Freeze with 23+ Satellites

## Task Difficulty Assessment
**Difficulty: Medium**

This is a performance optimization task that requires:
- Understanding the current O(n²) collision detection algorithm
- Implementing a spatial partitioning optimization
- Ensuring collision detection behavior remains unchanged
- Testing with various object counts to verify performance improvement

## Problem Analysis

### Root Cause
The game freezes when there are more than ~23 satellites in the same orbit due to **quadratic time complexity (O(n²))** in the collision detection algorithm.

**Location**: `kessler-game/src/game/engine/collision.ts:81-96`

The `detectCollisions` function uses nested loops to check every pair of objects within each orbital layer:

```typescript
for (let i = 0; i < objectsInLayer.length; i++) {
  for (let j = i + 1; j < objectsInLayer.length; j++) {
    // Collision check with polar coordinate conversion
  }
}
```

**Performance Impact**:
- 23 satellites = 253 pairwise comparisons (23 × 22 / 2)
- Plus all debris and DRVs in the same layer
- Each comparison involves:
  - Polar coordinate conversion (2 objects × ~10 operations)
  - Angle difference calculation with normalization
  - Radius difference calculation
  - Threshold comparison
- This runs **every game tick** (every 2-4 seconds) via `processCollisions()` in `useGameSpeed.ts:85`

With 30+ objects in one layer: 30 × 29 / 2 = 435 comparisons per tick → noticeable lag/freeze

## Technical Context

### Language & Framework
- **Language**: TypeScript 5.9
- **Framework**: React 19.2 with Redux Toolkit 2.11
- **Build Tool**: Vite 7.2

### Dependencies
- No additional dependencies needed (pure algorithm optimization)
- Uses existing game constants and types

### Key Files
1. **`kessler-game/src/game/engine/collision.ts`** - Collision detection logic (PRIMARY)
2. **`kessler-game/src/store/slices/gameSlice.ts`** - Calls `detectCollisions()` in `processCollisions` reducer
3. **`kessler-game/src/hooks/useGameSpeed.ts`** - Game loop that dispatches `processCollisions()`

## Implementation Approach

### Solution: Spatial Hash Grid (Angular Bucketing)

Implement a **spatial hash grid** based on angular position to reduce collision checks from O(n²) to approximately O(n).

**Key Insight**: Objects are arranged in circular orbits, so we can partition the 360° circle into angular buckets. Objects only need to be checked against nearby buckets.

### Algorithm Design

1. **Bucket Creation**:
   - Divide the 360° orbit into angular buckets (e.g., 36 buckets = 10° each)
   - Bucket size should be slightly larger than `angleThreshold` for safety margin
   - Each layer (LEO, MEO, GEO) has its own bucket grid

2. **Object Assignment**:
   - Calculate each object's angle: `angle = (x / 100) * 360`
   - Assign to bucket: `bucketIndex = Math.floor(angle / bucketSize)`
   - Objects near bucket boundaries should also be added to adjacent buckets

3. **Collision Detection**:
   - For each bucket, only check objects within the same and adjacent buckets (max 3 buckets)
   - This drastically reduces comparisons:
     - Without optimization: n × (n-1) / 2 comparisons
     - With bucketing: ~(n/buckets) × (n/buckets) × 3 buckets ≈ 3n²/buckets²

**Example**:
- 30 objects in one layer with 36 buckets
- Without: 30 × 29 / 2 = 435 comparisons
- With: ~30/36 per bucket × 3 adjacent buckets ≈ 2.5 objects × 3 buckets ≈ 7.5 comparisons per object → ~112 total comparisons
- **~74% reduction in comparisons**

### Optimized Algorithm Structure

```typescript
interface SpatialBucket {
  objects: GameObject[];
}

function createSpatialHashGrid(
  objects: GameObject[],
  angleThreshold: number
): Map<number, SpatialBucket> {
  // Bucket size should be ~2x angleThreshold to ensure we don't miss collisions
  const bucketSize = angleThreshold * 2;
  const bucketCount = Math.ceil(360 / bucketSize);
  const grid = new Map<number, SpatialBucket>();
  
  // Initialize buckets and assign objects
  for (const obj of objects) {
    const polar = toPolarCoordinates(obj);
    const bucketIndex = Math.floor(polar.angle / bucketSize);
    
    // Add to primary bucket
    if (!grid.has(bucketIndex)) {
      grid.set(bucketIndex, { objects: [] });
    }
    grid.get(bucketIndex)!.objects.push(obj);
  }
  
  return grid;
}

function detectCollisionsOptimized(
  satellites: Satellite[],
  debris: Debris[],
  angleThresholdDegrees: number,
  radiusMultiplier: number,
  drvs: DebrisRemovalVehicle[]
): CollisionPair[] {
  // Group by layer, create spatial hash grid per layer
  // Check collisions only within same and adjacent buckets
  // Return collision pairs as before
}
```

### Preserving Behavior

**Critical**: The optimized algorithm must produce **identical results** to the current implementation.

**Verification approach**:
1. Keep original `detectCollisions` function temporarily renamed to `detectCollisionsNaive`
2. Run both algorithms in parallel during testing
3. Compare results to ensure identical collision detection
4. Remove naive implementation once verified

## Source Code Structure Changes

### Files to Modify

#### 1. `kessler-game/src/game/engine/collision.ts`
**Changes**:
- Add spatial hash grid helper functions:
  - `createSpatialHashGrid()` - Creates angular bucket grid
  - `getAdjacentBuckets()` - Returns indices of adjacent buckets
- Replace nested loop in `detectCollisions()` with bucket-based approach
- Maintain all existing function signatures (no API changes)

**No new files needed** - all changes are internal optimizations.

## Data Model / API / Interface Changes

**None** - This is a pure internal optimization. All function signatures remain unchanged:

```typescript
// Signature remains identical
export function detectCollisions(
  satellites: Satellite[],
  debris: Debris[],
  angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,
  radiusMultiplier: number = 1,
  drvs: DebrisRemovalVehicle[] = []
): CollisionPair[]
```

All types (`CollisionPair`, `GameObject`, etc.) remain unchanged.

## Performance Expectations

### Before Optimization
- 23 satellites in one orbit: ~253 comparisons → **noticeable lag**
- 30 satellites: ~435 comparisons → **freeze/stutter**
- 50 satellites: ~1,225 comparisons → **unplayable**

### After Optimization
- 23 satellites: ~69 comparisons (~73% reduction)
- 30 satellites: ~112 comparisons (~74% reduction)
- 50 satellites: ~312 comparisons (~75% reduction)

**Expected outcome**: Game should run smoothly with 50+ satellites in the same orbit.

## Verification Approach

### Testing Strategy

1. **Manual Testing**:
   - Launch 25+ satellites in the same orbit (LEO)
   - Verify game does not freeze
   - Check that collisions still occur correctly
   - Monitor browser performance (DevTools Performance tab)

2. **Behavioral Verification**:
   - Create test scenarios with known collision patterns
   - Compare collision results before/after optimization
   - Ensure collision events, debris generation, and game state remain identical

3. **Performance Measurement**:
   - Add performance.now() timing around `detectCollisions()` calls
   - Log execution time with various object counts:
     - 10, 20, 30, 40, 50 satellites
   - Verify linear vs quadratic time complexity

4. **Lint & Type Check**:
   ```bash
   cd kessler-game
   npm run lint
   npm run build  # Includes TypeScript compilation check
   ```

### Edge Cases to Test
- Objects at angle boundary (359° → 0°)
- All objects in same angular bucket
- Empty buckets
- Multiple layers with different object densities
- Collision threshold edge cases (objects just within/outside threshold)

## Implementation Plan

Given the medium complexity, the implementation can be done in a single cohesive step:

1. **Optimize collision detection**:
   - Implement spatial hash grid functions
   - Replace nested loop with bucket-based iteration
   - Add performance logging (optional, for verification)
   - Test with 25+ satellites to verify no freezing
   - Run lint and build checks
   - Document results in report.md

This is straightforward enough to not require multiple incremental steps, but complex enough to warrant careful testing and verification.
