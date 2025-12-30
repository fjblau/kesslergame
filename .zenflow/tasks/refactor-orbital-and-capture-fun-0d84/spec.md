# Technical Specification: Circle-Based Collision Detection Refactoring

## Difficulty Assessment
**Medium Complexity**

**Reasoning:**
- Involves refactoring core game mechanics (collision detection, capture mechanics)
- Requires changes across multiple interconnected files (types, collision engine, debris removal, game slice)
- Must maintain backward compatibility and game balance
- Need to handle edge cases (x-axis wraparound, multi-layer interactions)
- Performance optimization with spatial partitioning should be preserved
- Risk of subtle bugs if distance calculations don't account for toroidal geometry

---

## Technical Context

### Language and Framework
- **TypeScript** with React and Redux Toolkit
- **Build Tool**: Vite
- **Testing**: None detected (manual verification required)
- **Linting**: ESLint

### Key Dependencies
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings for Redux
- No physics or math libraries (all calculations custom)

---

## Current State Analysis

### Coordinate System
- **X-axis**: 0-100 range with wraparound (toroidal/periodic boundary)
- **Y-axis**: Layer-specific bounds (LEO: 0-50, MEO: 50-100, GEO: 100-150, GRAVEYARD: 150-200)
- **Visual rendering**: Circular orbits in OrbitVisualization component

### Current Collision Detection (`collision.ts`)
1. Converts (x, y) to polar coordinates (angle, radius)
   - `angle = (x / 100) * 360`
   - `radius = inner + normalizedY * (outer - inner)`
2. Uses angular threshold (15°) and radial threshold (40-70px by layer)
3. Normalizes angle differences to handle 0°/360° boundary
4. Uses spatial hash grid based on angular buckets for optimization

**Problem**: At small orbital radii (inner edge of LEO ~50px radius), 15° arc length ≈ 13px. At large radii (outer edge of GRAVEYARD ~475px), 15° ≈ 124px. This creates inconsistent collision detection.

### Current Capture Detection (`debrisRemoval.ts`)
- Uses `calculateDistance(x1, y1, x2, y2)` with x-wraparound
- Fixed threshold: 15 units
- Already Euclidean-based but uses fixed threshold regardless of object type

---

## Implementation Approach

### Phase 1: Data Model Changes

#### Type Updates (`types.ts`)
Add radius properties to all orbital objects:

```typescript
export interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;
  inGraveyard?: boolean;
  radius: number;           // NEW: Visual/physical radius
  captureRadius?: number;   // NEW: Optional capture radius (defaults to radius)
}

export interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;
  radius: number;           // NEW
  captureRadius?: number;   // NEW
}

export interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  removalType: DRVType;
  targetPriority: DRVTargetPriority;
  age: number;
  maxAge: number;
  capacity: number;
  successRate: number;
  debrisRemoved: number;
  targetDebrisId?: string;
  capturedDebrisId?: string;
  captureOrbitsRemaining?: number;
  radius: number;           // NEW
  captureRadius?: number;   // NEW
}
```

#### Constants for Radii (`constants.ts`)
```typescript
export const OBJECT_RADII = {
  satellite: 8,        // Base visual radius
  debris: 5,           // Smaller than satellites
  drv: {
    cooperative: 10,   // Larger to represent capture capability
    uncooperative: 8,
    geotug: 12,        // Largest for visualization
  },
};

export const CAPTURE_RADIUS_MULTIPLIER = 1.5;  // captureRadius = radius * multiplier
```

**Rationale**: 
- Satellites are primary objects (radius: 8)
- Debris is smaller and harder to see (radius: 5)
- DRVs are larger to show their capability (radius: 8-12)
- Capture radius ~1.5x larger to allow "approach and capture" gameplay feel

### Phase 2: Collision Detection Refactor

#### New Euclidean Distance Function (`collision.ts`)
```typescript
function calculateEuclideanDistance(obj1: GameObject, obj2: GameObject): number {
  const dx = Math.min(Math.abs(obj1.x - obj2.x), 100 - Math.abs(obj1.x - obj2.x));
  const dy = Math.abs(obj1.y - obj2.y);
  return Math.sqrt(dx * dx + dy * dy);
}

function areObjectsColliding(obj1: GameObject, obj2: GameObject): boolean {
  const dx = Math.min(Math.abs(obj1.x - obj2.x), 100 - Math.abs(obj1.x - obj2.x));
  const dy = Math.abs(obj1.y - obj2.y);
  const distanceSquared = dx * dx + dy * dy;
  
  const radius1 = obj1.radius || 8;
  const radius2 = obj2.radius || 8;
  const collisionDistanceSquared = (radius1 + radius2) * (radius1 + radius2);
  
  return distanceSquared <= collisionDistanceSquared;
}
```

**Key Points**:
- X-axis wraparound handled by `Math.min(Math.abs(x1 - x2), 100 - Math.abs(x1 - x2))`
- Squared distance comparison avoids expensive `sqrt()`
- Fallback to radius 8 for backward compatibility during migration

#### Updated `detectCollisions` Function
Replace polar coordinate conversion with direct Euclidean distance checks. Keep spatial hash grid optimization but base it on x-position instead of angle:

```typescript
export function detectCollisions(
  satellites: Satellite[],
  debris: Debris[],
  angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,  // DEPRECATED but kept for compatibility
  radiusMultiplier: number = 1,  // Can be repurposed as collision radius multiplier
  drvs: DebrisRemovalVehicle[] = []
): CollisionPair[] {
  const collisions: CollisionPair[] = [];
  
  const capturedObjectIds = new Set(
    drvs.filter(drv => drv.capturedDebrisId).map(drv => drv.capturedDebrisId)
  );
  
  const activeSatellites = satellites.filter(s => !capturedObjectIds.has(s.id) && s.age >= 3 && !s.inGraveyard);
  const activeDebris = debris.filter(d => !capturedObjectIds.has(d.id));
  const allObjects: GameObject[] = [...activeSatellites, ...activeDebris];

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO', 'GRAVEYARD'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const drvsInLayer = drvs.filter(drv => drv.layer === layer);

    // Spatial hash grid based on x-position (0-100)
    const bucketSize = 10;  // 10 units per bucket
    const bucketCount = 10;
    const spatialGrid = createSpatialHashGridByX(objectsInLayer, bucketSize);
    
    const checkedPairs = new Set<string>();
    
    // Check objects within and adjacent buckets
    for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex++) {
      const bucket = spatialGrid.get(bucketIndex);
      if (!bucket || bucket.objects.length === 0) continue;
      
      const adjacentBuckets = getAdjacentBucketIndices(bucketIndex, bucketCount);
      const nearbyObjects: GameObject[] = [];
      
      for (const adjIndex of adjacentBuckets) {
        const adjBucket = spatialGrid.get(adjIndex);
        if (adjBucket) {
          nearbyObjects.push(...adjBucket.objects);
        }
      }
      
      // Check all pairs
      for (let i = 0; i < nearbyObjects.length; i++) {
        for (let j = i + 1; j < nearbyObjects.length; j++) {
          const obj1 = nearbyObjects[i];
          const obj2 = nearbyObjects[j];
          
          const pairKey = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
          if (checkedPairs.has(pairKey)) continue;
          checkedPairs.add(pairKey);

          if (areObjectsColliding(obj1, obj2)) {
            collisions.push({ obj1, obj2, layer });
          }
        }
      }
    }
    
    // Check DRVs against objects
    for (const drv of drvsInLayer) {
      const bucketIndex = getBucketIndex(drv.x, bucketSize);
      const adjacentBuckets = getAdjacentBucketIndices(bucketIndex, bucketCount);
      
      for (const adjIndex of adjacentBuckets) {
        const bucket = spatialGrid.get(adjIndex);
        if (!bucket) continue;
        
        for (const obj of bucket.objects) {
          if (areObjectsColliding(drv, obj)) {
            collisions.push({ obj1: drv, obj2: obj, layer });
          }
        }
      }
    }
  }

  return collisions;
}
```

**Changes from current implementation**:
- Spatial bucketing now by x-position (0-100) instead of angle
- Removed `toPolarCoordinates` function
- Removed `normalizeAngleDiff` function (no longer needed)
- `areObjectsColliding` uses Euclidean distance with wraparound
- `radiusMultiplier` parameter repurposed to scale collision radii if needed

### Phase 3: Capture Detection Refactor

#### Update `debrisRemoval.ts`
Replace fixed `CAPTURE_DISTANCE_THRESHOLD` with radius-based detection:

```typescript
function isWithinCaptureRange(drv: DebrisRemovalVehicle, target: CapturableObject): boolean {
  const dx = Math.min(Math.abs(drv.x - target.x), 100 - Math.abs(drv.x - target.x));
  const dy = Math.abs(drv.y - target.y);
  const distanceSquared = dx * dx + dy * dy;
  
  const drvCaptureRadius = drv.captureRadius || drv.radius || 10;
  const targetRadius = target.radius || 5;
  const captureDistanceSquared = (drvCaptureRadius + targetRadius) * (drvCaptureRadius + targetRadius);
  
  return distanceSquared <= captureDistanceSquared;
}
```

Update `processCooperativeDRVOperations` and `processGeoTugOperations`:
```typescript
// Replace this line:
if (distance < CAPTURE_DISTANCE_THRESHOLD) {
  
// With:
if (isWithinCaptureRange(drv, currentTarget)) {
```

### Phase 4: Entity Initialization

#### Update `gameSlice.ts`
Add radius fields when creating new entities:

```typescript
// In launchSatellite reducer:
const satellite = {
  id: generateId(),
  ...randomPositionInLayer(orbit),
  layer: orbit,
  purpose,
  age: 0,
  insuranceTier,
  radius: OBJECT_RADII.satellite,
  captureRadius: OBJECT_RADII.satellite * CAPTURE_RADIUS_MULTIPLIER,
};

// In launchDRV reducer:
const drv = {
  id: generateId(),
  ...randomPositionInLayer(orbit),
  layer: orbit,
  removalType: drvType,
  targetPriority,
  age: 0,
  maxAge: state.drvDecommissionTime,
  capacity: Math.floor(Math.random() * (maxCapacity - minCapacity + 1)) + minCapacity,
  successRate,
  debrisRemoved: 0,
  radius: OBJECT_RADII.drv[drvType],
  captureRadius: OBJECT_RADII.drv[drvType] * CAPTURE_RADIUS_MULTIPLIER,
};

// In generateDebrisFromCollision:
debris.push({
  id: generateId(),
  x: clampToLayer(x + xOffset, layer),
  y: clampToLayer(y + yOffset, layer),
  layer,
  type: 'uncooperative',
  radius: OBJECT_RADII.debris,
  captureRadius: OBJECT_RADII.debris * CAPTURE_RADIUS_MULTIPLIER,
});
```

---

## Files to Modify

### Core Implementation
1. **`src/game/types.ts`**
   - Add `radius` and `captureRadius?` to `Satellite`, `Debris`, `DebrisRemovalVehicle`

2. **`src/game/constants.ts`**
   - Add `OBJECT_RADII` configuration
   - Add `CAPTURE_RADIUS_MULTIPLIER`
   - Optionally deprecate `COLLISION_THRESHOLDS.angleDegrees` (or document as legacy)

3. **`src/game/engine/collision.ts`**
   - Add `calculateEuclideanDistance` function
   - Add `areObjectsColliding` function
   - Replace `toPolarCoordinates` usage in `detectCollisions`
   - Update spatial hash grid to use x-position instead of angle
   - Remove `normalizeAngleDiff` (or keep for reference)
   - Remove `ORBIT_RADII` constant (no longer needed)

4. **`src/game/engine/debrisRemoval.ts`**
   - Add `isWithinCaptureRange` function
   - Update `processCooperativeDRVOperations` to use radius-based capture
   - Update `processGeoTugOperations` to use radius-based capture
   - Keep existing `calculateDistance` for reference but mark as deprecated

5. **`src/store/slices/gameSlice.ts`**
   - Update `launchSatellite` to add radius fields
   - Update `launchDRV` to add radius fields
   - Import and use `OBJECT_RADII`, `CAPTURE_RADIUS_MULTIPLIER` from constants
   - Update collision generation in `generateDebrisFromCollision` (if inline) or delegate to engine

### Potential Breaking Changes
- **State migration**: Existing game states in localStorage won't have radius fields
  - **Solution**: Add fallback defaults in collision/capture functions
- **Settings UI**: `collisionAngleThreshold` and `collisionRadiusMultiplier` may need new labels/tooltips
  - **Solution**: Repurpose `collisionRadiusMultiplier` as global collision scale, deprecate angle threshold

---

## Data Model Changes

### Before
```typescript
interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;
  inGraveyard?: boolean;
}
```

### After
```typescript
interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;
  inGraveyard?: boolean;
  radius: number;          // NEW: Physical collision radius
  captureRadius?: number;  // NEW: Capture detection radius (defaults to radius if omitted)
}
```

Same changes apply to `Debris` and `DebrisRemovalVehicle`.

---

## Verification Approach

### Manual Testing
1. **Visual collision alignment**
   - Launch satellites in LEO and verify visual overlap matches collision timing
   - Repeat for MEO and GEO to ensure scale-independence
   
2. **Boundary wraparound**
   - Place objects near x=0 and x=100
   - Verify collisions detect across the 0°/360° boundary without issues
   
3. **Capture behavior**
   - Launch cooperative DRV and verify capture distance feels consistent
   - Test with objects at different y-positions in same layer
   
4. **Performance**
   - Load game with 100+ objects
   - Verify smooth frame rate (spatial hashing should keep O(n) behavior)

### Linting and Type Checking
```bash
cd kessler-game
npm run lint
npm run build  # TypeScript compilation via tsc
```

### Regression Checks
- Verify game still starts and runs
- Verify satellites can be launched
- Verify DRVs can capture debris
- Verify collisions generate debris
- Verify insurance payouts still work
- Verify saved settings still load (with fallback defaults)

---

## Migration Strategy

### Backward Compatibility
1. **Add fallback defaults** in all collision/capture functions:
   ```typescript
   const radius1 = obj1.radius || 8;  // Default if undefined
   ```

2. **Keep deprecated parameters** in `detectCollisions` signature:
   ```typescript
   detectCollisions(
     satellites: Satellite[],
     debris: Debris[],
     angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,  // DEPRECATED
     radiusMultiplier: number = 1,  // Repurposed
     drvs: DebrisRemovalVehicle[] = []
   )
   ```

3. **Document changes** in code comments:
   ```typescript
   // DEPRECATED: angleThresholdDegrees is no longer used for collision detection.
   // Collisions now use Euclidean distance with object radii.
   // This parameter is kept for backward compatibility.
   ```

### Tuning Values
Initial values (`OBJECT_RADII`) are estimates. May need adjustment based on:
- Visual feedback from users
- Gameplay balance (too many/few collisions)
- Capture feel (too easy/hard to intercept)

Provide settings UI or constants that can be tweaked without code changes.

---

## Out of Scope (Phase 3 - Future)

### Elliptical Orbits
- Requires additional orbital parameters (eccentricity, semi-major axis, true anomaly)
- Requires Kepler equation solver for position updates
- Interface already supports this (x, y are computed values)
- Can be added later without changing collision or rendering systems

### Advanced Spatial Partitioning
- Quadtree or R-tree for very large object counts (>500)
- Current spatial hash should handle expected load (<200 objects)

---

## Risk Assessment

### High Risk
- **Breaking game balance**: Euclidean collision may be more/less strict than angular
  - **Mitigation**: Tune `OBJECT_RADII` and `CAPTURE_RADIUS_MULTIPLIER` to match current feel
  
### Medium Risk  
- **Performance regression**: Euclidean with sqrt is slower than angle comparison
  - **Mitigation**: Use squared distance comparison (no sqrt)
  
### Low Risk
- **Visual-collision mismatch**: If sprite sizes don't match collision radii
  - **Mitigation**: Update sprite rendering to use radius field
  
- **State migration issues**: Old saves missing radius
  - **Mitigation**: Fallback defaults in all functions

---

## Success Criteria

1. ✅ Collision detection works consistently across all orbital layers
2. ✅ No 0°/360° boundary artifacts
3. ✅ Visual overlap matches collision detection
4. ✅ Capture detection uses radius-based distance
5. ✅ Game performance remains smooth with 100+ objects
6. ✅ All existing game features still work (satellites, DRVs, debris, insurance)
7. ✅ TypeScript builds without errors
8. ✅ ESLint passes with no new warnings
9. ✅ No runtime errors in browser console

---

## Timeline Estimate

- **Type definitions**: 30 minutes
- **Constants setup**: 15 minutes
- **Collision refactor**: 2 hours
- **Capture refactor**: 1 hour
- **Entity initialization**: 1 hour
- **Testing and tuning**: 2 hours
- **Total**: ~7 hours

---

## Notes

- The current system already computes x, y positions each frame (orbital update in `advanceTurn`)
- Orbital mechanics are cleanly separated from collision detection
- This refactor maintains that separation and improves collision accuracy
- The architecture is ready for future elliptical orbits (no changes needed to collision system)
