# Technical Specification: Orbital Mechanics and Collision Detection Refactoring

## Difficulty Assessment
**Medium-Hard Complexity**

**Reasoning:**
- Refactors core game mechanics across multiple interconnected systems
- Coordinate system complexity: hybrid game coordinates + pixel rendering + polar visualization
- Must maintain backward compatibility and game balance
- Spatial hash optimization with toroidal wraparound edge cases
- Architecture for future elliptical orbit support requires careful interface design
- High risk of subtle bugs affecting gameplay if distance/collision calculations are incorrect

---

## Technical Context

### Language and Framework
- **TypeScript** with React and Redux Toolkit
- **Build Tool**: Vite
- **Testing**: None (manual verification only - **recommend adding unit tests**)
- **Linting**: ESLint

### Key Dependencies
- `@reduxjs/toolkit` ^2.11.2: State management
- `react-redux` ^9.2.0: React bindings
- `framer-motion` ^12.23.26: Animation library (rendering layer)
- No physics/math libraries (all calculations custom)

---

## Current State: Detailed Analysis

### Coordinate Systems (Three Distinct Spaces)

The game uses three interconnected coordinate systems:

#### 1. **Game Coordinate Space** (State Layer)
- **X-axis**: 0-100 units, wraps around (toroidal)
  - Represents angular position around orbit
  - x=0 and x=100 are the same position
- **Y-axis**: Layer-specific bounds (no wraparound)
  - LEO: 0-50
  - MEO: 50-100  
  - GEO: 100-150
  - GRAVEYARD: 150-200
  - Represents distance from Earth within orbital shell

**Storage**: All game entities store positions in this coordinate system.

#### 2. **Pixel Coordinate Space** (Rendering Layer)
- **Canvas**: 1000×1000px, center at (500, 500)
- **Orbital radii** (in pixels):
  - LEO: 50px (inner) to 225px (outer)
  - MEO: 225px to 325px
  - GEO: 325px to 400px
  - GRAVEYARD: 400px to 475px
- **Mapping**: `mapToPixels(entity)` in `utils.ts`
  - Converts game (x, y) → polar (angle, radius) → Cartesian (px, py)
  - Includes slight eccentricity effect for visual variety

#### 3. **Polar Coordinate Space** (Intermediate/Collision Layer)
- **Angle**: 0-360 degrees (derived from x)
- **Radius**: 50-475 pixels (derived from y and layer)
- **Usage**: Current collision detection operates in this space

**Key Issue**: Polar collision detection is scale-dependent. At radius 50px, 15° ≈ 13px arc length. At radius 475px, 15° ≈ 124px arc length. This makes collision detection inconsistent.

### Visual Sizes (from Sprite Components)

Analyzing actual rendered sizes:

| Object Type | Font Size | Symbol | Approx Visual Diameter |
|------------|-----------|---------|------------------------|
| Satellite  | 20px      | 🛰️ ☁️ 📡 | ~20-24px |
| DRV        | 20px      | ⬟       | ~20-24px |
| Debris (coop) | 12px   | •       | ~12-14px |
| Debris (uncoop) | 12px | ••      | ~14-16px |

**Implication**: Collision radii should be ~half the visual diameter for visual-collision alignment.

### Current Collision Detection (Detailed)

**File**: `src/game/engine/collision.ts`

**Algorithm**:
1. Filter objects by layer (collisions only within same layer)
2. Convert (x, y) → (angle, radius) using `toPolarCoordinates`
3. Create spatial hash grid with angular buckets (bucket size ≥ 2× angle threshold)
4. For each bucket and adjacent buckets:
   - Check all object pairs
   - Collision if: `angleDiff < angleThreshold AND radiusDiff < radiusThreshold`
5. Also check DRVs against all objects in their layer

**Thresholds** (from `constants.ts`):
```typescript
collisionAngleThreshold: 15° (degrees)
collisionRadiusMultiplier: 1.0 (multiplies base radii)
radiusPixels: { LEO: 40, MEO: 50, GEO: 60, GRAVEYARD: 70 }
```

**Performance**: Spatial hash reduces collision checks from O(n²) to ~O(n) for typical object distributions.

### Current Capture Detection (Detailed)

**File**: `src/game/engine/debrisRemoval.ts`

**Algorithm**:
```typescript
function calculateDistance(x1, y1, x2, y2): number {
  const dx = Math.min(Math.abs(x1 - x2), 100 - Math.abs(x1 - x2));
  const dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
}
```

- Already uses Euclidean distance with x-wraparound
- Fixed threshold: `CAPTURE_DISTANCE_THRESHOLD = 15` (game units)
- Does NOT account for object sizes (satellite vs debris)

**Problem**: 15 game units is scale-dependent:
- At inner LEO (R=50px), 1 x-unit ≈ 3.14px, so 15 units ≈ 47px
- At outer GRAVEYARD (R=475px), 1 x-unit ≈ 30px, so 15 units ≈ 450px

### Current Orbital Mechanics

**Position Updates** (in `gameSlice.ts:advanceTurn`):
```typescript
satellites.forEach(sat => {
  sat.age++;
  if (!capturedObjectIds.has(sat.id)) {
    const speed = getEntitySpeedVariation(sat.id, sat.layer, orbitalSpeeds);
    sat.x = (sat.x + speed) % 100;  // Only x updates, y stays constant
  }
});
```

**Observations**:
1. **Circular orbits only**: x (angle) updates, y (radius) stays constant
2. **Speed variation**: Each entity has a unique speed multiplier (0.7-1.3×) for visual variety
3. **Layer-specific speeds**: LEO 6.4, MEO 4.0, GEO 2.4, GRAVEYARD 2.2 (units per turn)
4. **Orbital mechanics are coupled to game loop**: Position updates happen in Redux reducer

**Architecture Issue**: Orbital position computation is embedded in the game slice. For elliptical orbits, both x and y need to update based on orbital mechanics, requiring a cleaner separation.

---

## Part 1: Circle-Based Collision Detection

### Objective
Replace angular/radial polar collision detection with Euclidean distance-based detection using object radii, ensuring scale-independent behavior across all orbital altitudes.

### Implementation Approach

#### Phase 1.1: Data Model Changes

**Type Updates** (`src/game/types.ts`):
```typescript
export interface Satellite {
  // ... existing fields
  radius: number;          // Physical radius in pixels for collision detection
  captureRadius?: number;  // Optional larger radius for capture detection (defaults to radius)
}

export interface Debris {
  // ... existing fields
  radius: number;
  captureRadius?: number;
}

export interface DebrisRemovalVehicle {
  // ... existing fields
  radius: number;
  captureRadius?: number;
}
```

**Constants** (`src/game/constants.ts`):
```typescript
// Object radii in pixels (based on visual sizes)
export const OBJECT_RADII = {
  SATELLITE: 10,  // Half of 20-24px visual diameter
  DEBRIS: 6,      // Half of 12-16px visual diameter  
  DRV: {
    cooperative: 10,    // Same as satellite for consistency
    uncooperative: 10,
    geotug: 12,         // Slightly larger for visual prominence
  },
};

// Capture radius multiplier (allows "approach and grab" gameplay feel)
export const CAPTURE_RADIUS_MULTIPLIER = 1.5;
```

**Rationale for Values**:
- Visual diameter = collision diameter for intuitive gameplay
- Capture radius 1.5× larger gives players margin for maneuvering
- All values in pixels to match rendering coordinate space

#### Phase 1.2: Euclidean Collision Detection

**Key Design Decision**: Perform collision detection in **pixel coordinate space**, not game coordinate space.

**Reasoning**:
1. Visual overlap happens in pixels, so collision should match visuals
2. Avoids complex scale-dependent conversions from game coords to distance
3. `mapToPixels()` function already exists for rendering - reuse it

**New Functions** (`src/game/engine/collision.ts`):

```typescript
// Convert game coordinates to pixel coordinates for collision detection
function toPixelCoordinates(obj: GameObject): { px: number; py: number } {
  const centerX = 500;
  const centerY = 500;
  const { inner, outer } = ORBIT_RADII[obj.layer];
  
  const [yMin, yMax] = LAYER_BOUNDS[obj.layer];
  const normalizedY = (obj.y - yMin) / (yMax - yMin);
  const radius = inner + normalizedY * (outer - inner);
  
  const angle = (obj.x / 100) * 2 * Math.PI;
  
  return {
    px: centerX + radius * Math.cos(angle),
    py: centerY + radius * Math.sin(angle),
  };
}

// Calculate Euclidean distance in pixel space
function calculatePixelDistance(obj1: GameObject, obj2: GameObject): number {
  const pos1 = toPixelCoordinates(obj1);
  const pos2 = toPixelCoordinates(obj2);
  
  const dx = pos2.px - pos1.px;
  const dy = pos2.py - pos1.py;
  
  return Math.sqrt(dx * dx + dy * dy);
}

// Check collision using squared distance (avoids sqrt for performance)
function areObjectsColliding(obj1: GameObject, obj2: GameObject): boolean {
  const pos1 = toPixelCoordinates(obj1);
  const pos2 = toPixelCoordinates(obj2);
  
  const dx = pos2.px - pos1.px;
  const dy = pos2.py - pos1.py;
  const distanceSquared = dx * dx + dy * dy;
  
  const radius1 = obj1.radius || OBJECT_RADII.SATELLITE;  // Fallback for migration
  const radius2 = obj2.radius || OBJECT_RADII.SATELLITE;
  const collisionDistanceSquared = (radius1 + radius2) * (radius1 + radius2);
  
  return distanceSquared <= collisionDistanceSquared;
}
```

**Note**: No wraparound handling needed in pixel space since we're working with Cartesian coordinates derived from polar. The circle topology is inherent in the polar-to-Cartesian conversion.

#### Phase 1.3: Spatial Hash Optimization (Pixel Space)

**Challenge**: Efficiently partition 1000×1000px canvas to avoid O(n²) collision checks.

**Solution**: 2D grid hash in pixel space.

```typescript
interface SpatialBucket {
  objects: GameObject[];
}

// Create spatial hash grid in pixel space
function createPixelSpatialGrid(
  objects: GameObject[],
  gridSize: number = 100  // 100px buckets = 10×10 grid
): Map<string, SpatialBucket> {
  const grid = new Map<string, SpatialBucket>();
  
  for (const obj of objects) {
    const { px, py } = toPixelCoordinates(obj);
    const gridX = Math.floor(px / gridSize);
    const gridY = Math.floor(py / gridSize);
    const key = `${gridX},${gridY}`;
    
    if (!grid.has(key)) {
      grid.set(key, { objects: [] });
    }
    grid.get(key)!.objects.push(obj);
  }
  
  return grid;
}

// Get adjacent grid cells (3×3 neighborhood)
function getAdjacentCells(gridX: number, gridY: number): string[] {
  const cells: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      cells.push(`${gridX + dx},${gridY + dy}`);
    }
  }
  return cells;
}
```

**Updated `detectCollisions` Function**:

```typescript
export function detectCollisions(
  satellites: Satellite[],
  debris: Debris[],
  angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,  // DEPRECATED
  radiusMultiplier: number = 1,  // Now scales collision radii
  drvs: DebrisRemovalVehicle[] = []
): CollisionPair[] {
  const collisions: CollisionPair[] = [];
  
  const capturedObjectIds = new Set(
    drvs.filter(drv => drv.capturedDebrisId).map(drv => drv.capturedDebrisId)
  );
  
  const activeSatellites = satellites.filter(s => 
    !capturedObjectIds.has(s.id) && s.age >= 3 && !s.inGraveyard
  );
  const activeDebris = debris.filter(d => !capturedObjectIds.has(d.id));
  
  const allObjects: GameObject[] = [...activeSatellites, ...activeDebris];

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO', 'GRAVEYARD'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const drvsInLayer = drvs.filter(drv => drv.layer === layer);
    
    // Apply radius multiplier if needed (for difficulty tuning)
    if (radiusMultiplier !== 1) {
      objectsInLayer.forEach(obj => {
        if (obj.radius) obj.radius *= radiusMultiplier;
      });
      drvsInLayer.forEach(drv => {
        if (drv.radius) drv.radius *= radiusMultiplier;
      });
    }

    const gridSize = 100; // 100px buckets
    const spatialGrid = createPixelSpatialGrid(objectsInLayer, gridSize);
    
    const checkedPairs = new Set<string>();
    
    // Check objects within and adjacent grid cells
    for (const [cellKey, bucket] of spatialGrid.entries()) {
      const [gridX, gridY] = cellKey.split(',').map(Number);
      const adjacentCells = getAdjacentCells(gridX, gridY);
      const nearbyObjects: GameObject[] = [...bucket.objects];
      
      // Gather objects from adjacent cells
      for (const adjKey of adjacentCells) {
        const adjBucket = spatialGrid.get(adjKey);
        if (adjBucket) {
          nearbyObjects.push(...adjBucket.objects);
        }
      }
      
      // Check all pairs in neighborhood
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
      const { px, py } = toPixelCoordinates(drv);
      const gridX = Math.floor(px / gridSize);
      const gridY = Math.floor(py / gridSize);
      const adjacentCells = getAdjacentCells(gridX, gridY);
      
      for (const cellKey of adjacentCells) {
        const bucket = spatialGrid.get(cellKey);
        if (!bucket) continue;
        
        for (const obj of bucket.objects) {
          if (areObjectsColliding(drv, obj)) {
            collisions.push({ obj1: drv, obj2: obj, layer });
          }
        }
      }
    }
    
    // Restore radii if multiplier was applied
    if (radiusMultiplier !== 1) {
      objectsInLayer.forEach(obj => {
        if (obj.radius) obj.radius /= radiusMultiplier;
      });
      drvsInLayer.forEach(drv => {
        if (drv.radius) drv.radius /= radiusMultiplier;
      });
    }
  }

  return collisions;
}
```

**Deprecation Path**:
- `angleThresholdDegrees` parameter kept for API compatibility but unused
- `radiusMultiplier` repurposed to scale collision radii (not radial threshold)
- Old `toPolarCoordinates` and `normalizeAngleDiff` can be removed or commented as reference

### Phase 1.4: Capture Detection Refactor

**File**: `src/game/engine/debrisRemoval.ts`

**New Function**:
```typescript
function isWithinCaptureRange(drv: DebrisRemovalVehicle, target: CapturableObject): boolean {
  const pos1 = toPixelCoordinates(drv);
  const pos2 = toPixelCoordinates(target);
  
  const dx = pos2.px - pos1.px;
  const dy = pos2.py - pos1.py;
  const distanceSquared = dx * dx + dy * dy;
  
  const drvCaptureRadius = drv.captureRadius || drv.radius || OBJECT_RADII.DRV.cooperative;
  const targetRadius = target.radius || OBJECT_RADII.DEBRIS;
  const captureDistanceSquared = (drvCaptureRadius + targetRadius) * (drvCaptureRadius + targetRadius);
  
  return distanceSquared <= captureDistanceSquared;
}
```

**Update `processCooperativeDRVOperations`**:
```typescript
// Replace line 213:
// if (distance < CAPTURE_DISTANCE_THRESHOLD) {
if (isWithinCaptureRange(drv, currentTarget)) {
```

**Update `processGeoTugOperations`**:
```typescript
// Replace line 312:
// if (distance < CAPTURE_DISTANCE_THRESHOLD) {
if (isWithinCaptureRange(drv, currentSatellite)) {
```

**Deprecate**:
```typescript
// Mark as deprecated, keep for reference
// const CAPTURE_DISTANCE_THRESHOLD = 15;  // DEPRECATED: Use radius-based capture instead
```

### Phase 1.5: Entity Initialization

**File**: `src/store/slices/gameSlice.ts`

Add imports:
```typescript
import { OBJECT_RADII, CAPTURE_RADIUS_MULTIPLIER } from '../../game/constants';
```

**Update `launchSatellite` reducer**:
```typescript
const satellite = {
  id: generateId(),
  ...randomPositionInLayer(orbit),
  layer: orbit,
  purpose,
  age: 0,
  insuranceTier,
  radius: OBJECT_RADII.SATELLITE,
  captureRadius: OBJECT_RADII.SATELLITE * CAPTURE_RADIUS_MULTIPLIER,
};
```

**Update `launchDRV` reducer**:
```typescript
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
  radius: OBJECT_RADII.DRV[drvType],
  captureRadius: OBJECT_RADII.DRV[drvType] * CAPTURE_RADIUS_MULTIPLIER,
};
```

**Update `generateDebrisFromCollision`** in `collision.ts`:
```typescript
debris.push({
  id: generateId(),
  x: clampToLayer(x + xOffset, layer),
  y: clampToLayer(y + yOffset, layer),
  layer,
  type: 'uncooperative',
  radius: OBJECT_RADII.DEBRIS,
  captureRadius: OBJECT_RADII.DEBRIS * CAPTURE_RADIUS_MULTIPLIER,
});
```

---

## Part 2: Orbital Mechanics Separation

### Objective
Establish clean architectural separation between orbital mechanics (position computation) and game systems (collision, rendering). Design interface for future elliptical orbit support.

### Current Architecture Analysis

**Position Updates** (coupling issues):
1. **Location**: Embedded in Redux reducer (`gameSlice.ts:advanceTurn`)
2. **Logic**: Direct x-coordinate mutation based on orbital speed
3. **Speed variation**: Hash-based per-entity multiplier calculated inline
4. **Cooperative DRV movement**: Special case with interception logic

**Rendering** (well-separated):
1. **Location**: `OrbitVisualization.tsx` and sprite components
2. **Logic**: Reads (x, y) from state, uses `mapToPixels()` for display
3. **No coupling**: Rendering doesn't know about orbital mechanics

**Collision** (will be well-separated after Part 1):
1. **Location**: `collision.ts`
2. **Logic**: Reads (x, y) from state, converts to pixels, checks distances
3. **No coupling**: Collision doesn't need to know how positions are computed

**Assessment**: Orbital mechanics are currently coupled to game loop but can be cleanly separated.

### Proposed Architecture

```
┌──────────────────────────────────────┐
│   Orbital Mechanics Module           │
│   (computes x, y per frame)          │
│   - Circular orbit impl (default)    │
│   - Elliptical orbit impl (future)   │
└──────────────┬───────────────────────┘
               │ Updates position (x, y)
               ▼
┌──────────────────────────────────────┐
│   Game State (Redux)                 │
│   { satellites, debris, drvs, ... }  │
│   Each entity has: x, y, orbitParams │
└──────────┬───────────────────────────┘
           │ Reads positions
           ├────────────┬────────────────┐
           ▼            ▼                ▼
    ┌──────────┐  ┌──────────┐   ┌──────────────┐
    │ Collision│  │ Rendering│   │ Game Logic   │
    │ Detection│  │  (pixels)│   │ (captures,..)│
    └──────────┘  └──────────┘   └──────────────┘
```

### Orbital Model Interface Design

**Core Abstraction** - Entity with orbital parameters:

```typescript
// Orbital parameter types
export type OrbitType = 'circular' | 'elliptical';

export interface CircularOrbitParams {
  type: 'circular';
  orbitRadius: number;        // Fixed radius (in game y-units)
  angularVelocity: number;    // Degrees per turn (derived from orbital speed)
  initialAngle: number;       // Starting angle (degrees)
}

export interface EllipticalOrbitParams {
  type: 'elliptical';
  semiMajorAxis: number;      // Half of longest diameter (game units)
  eccentricity: number;       // 0 = circle, 0 < e < 1 = ellipse
  argumentOfPeriapsis: number; // Orientation of ellipse (degrees)
  meanAnomalyRate: number;    // Mean anomaly change per turn (degrees/turn)
  initialMeanAnomaly: number; // Starting mean anomaly (degrees)
}

export type OrbitParams = CircularOrbitParams | EllipticalOrbitParams;

// Extend entity interfaces
export interface Satellite {
  // ... existing fields
  orbitParams?: OrbitParams;  // Optional: defaults to circular if not specified
  speedMultiplier?: number;   // Per-entity speed variation (0.7-1.3)
}

export interface Debris {
  // ... existing fields
  orbitParams?: OrbitParams;
  speedMultiplier?: number;
}

export interface DebrisRemovalVehicle {
  // ... existing fields
  orbitParams?: OrbitParams;
  speedMultiplier?: number;
  // Note: Cooperative/geotug DRVs may override position with interception logic
}
```

### Orbital Position Computer (New Module)

**File**: `src/game/engine/orbital.ts`

```typescript
import type { OrbitParams, CircularOrbitParams, EllipticalOrbitParams, OrbitLayer } from '../types';
import { LAYER_BOUNDS } from '../constants';

// Compute position for circular orbit
function computeCircularOrbitPosition(
  params: CircularOrbitParams,
  currentTurn: number,
  speedMultiplier: number = 1.0
): { x: number; y: number } {
  const angleChange = params.angularVelocity * speedMultiplier * currentTurn;
  const currentAngle = (params.initialAngle + angleChange) % 360;
  
  const x = (currentAngle / 360) * 100;  // Convert angle to x (0-100)
  const y = params.orbitRadius;           // y stays constant for circular orbit
  
  return { x, y };
}

// Solve Kepler's equation for eccentric anomaly (iterative Newton-Raphson)
function solveKeplerEquation(meanAnomaly: number, eccentricity: number, tolerance: number = 1e-6): number {
  let E = meanAnomaly;  // Initial guess
  let delta = 1;
  let iterations = 0;
  const maxIterations = 10;
  
  while (Math.abs(delta) > tolerance && iterations < maxIterations) {
    delta = E - eccentricity * Math.sin(E) - meanAnomaly;
    E = E - delta / (1 - eccentricity * Math.cos(E));
    iterations++;
  }
  
  return E;
}

// Compute position for elliptical orbit
function computeEllipticalOrbitPosition(
  params: EllipticalOrbitParams,
  currentTurn: number,
  speedMultiplier: number = 1.0,
  layer: OrbitLayer
): { x: number; y: number } {
  // Update mean anomaly
  const meanAnomalyChange = params.meanAnomalyRate * speedMultiplier * currentTurn;
  const currentMeanAnomaly = (params.initialMeanAnomaly + meanAnomalyChange) % 360;
  const M = currentMeanAnomaly * (Math.PI / 180);  // Convert to radians
  
  // Solve Kepler's equation for eccentric anomaly
  const E = solveKeplerEquation(M, params.eccentricity);
  
  // Compute true anomaly from eccentric anomaly
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + params.eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - params.eccentricity) * Math.cos(E / 2)
  );
  
  // Compute radial distance (in game y-units)
  const a = params.semiMajorAxis;
  const e = params.eccentricity;
  const r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
  
  // Compute angle including argument of periapsis
  const omega = params.argumentOfPeriapsis * (Math.PI / 180);
  const theta = trueAnomaly + omega;
  
  // Convert to game coordinates
  const x = ((theta * 180 / Math.PI) / 360) * 100;  // Angle to x (0-100)
  const [yMin, yMax] = LAYER_BOUNDS[layer];
  const normalizedRadius = (r - yMin) / (yMax - yMin);  // Normalize radius to [0, 1]
  const y = yMin + normalizedRadius * (yMax - yMin);    // Map to layer bounds
  
  return { x: x % 100, y: Math.max(yMin, Math.min(yMax, y)) };
}

// Main position computer (dispatcher based on orbit type)
export function computeOrbitalPosition(
  orbitParams: OrbitParams | undefined,
  layer: OrbitLayer,
  currentTurn: number,
  speedMultiplier: number = 1.0,
  fallbackX: number,
  fallbackY: number
): { x: number; y: number } {
  if (!orbitParams) {
    // Legacy entities without orbit params: use current x as initial angle
    const circularParams: CircularOrbitParams = {
      type: 'circular',
      orbitRadius: fallbackY,
      angularVelocity: 1.0,  // Will be scaled by layer speed and speedMultiplier
      initialAngle: (fallbackX / 100) * 360,
    };
    return computeCircularOrbitPosition(circularParams, currentTurn, speedMultiplier);
  }
  
  if (orbitParams.type === 'circular') {
    return computeCircularOrbitPosition(orbitParams, currentTurn, speedMultiplier);
  } else {
    return computeEllipticalOrbitPosition(orbitParams, currentTurn, speedMultiplier, layer);
  }
}
```

### Integration with Game Loop

**Update `advanceTurn` in `gameSlice.ts`**:

```typescript
advanceTurn: (state) => {
  state.step += 1;

  // ... budget logic ...

  const capturedObjectIds = new Set(
    state.debrisRemovalVehicles
      .filter(drv => drv.capturedDebrisId)
      .map(drv => drv.capturedDebrisId)
  );
  
  const orbitalSpeeds = {
    LEO: state.orbitalSpeedLEO,
    MEO: state.orbitalSpeedMEO,
    GEO: state.orbitalSpeedGEO,
    GRAVEYARD: state.orbitalSpeedGRAVEYARD,
  };
  
  // Update satellite positions using orbital mechanics
  state.satellites.forEach(sat => {
    sat.age++;
    if (!capturedObjectIds.has(sat.id)) {
      // For now, use legacy logic (direct x update)
      // TODO: Migrate to computeOrbitalPosition when orbitParams are added
      const speed = getEntitySpeedVariation(sat.id, sat.layer, orbitalSpeeds);
      sat.x = (sat.x + speed) % 100;
      
      // Future with orbital mechanics module:
      // const newPos = computeOrbitalPosition(
      //   sat.orbitParams,
      //   sat.layer,
      //   state.step,
      //   sat.speedMultiplier || 1.0,
      //   sat.x,
      //   sat.y
      // );
      // sat.x = newPos.x;
      // sat.y = newPos.y;
    }
  });
  
  // DRVs and debris similar...
}
```

### Migration Path to Orbital Mechanics Module

**Phase 1**: Add `orbitParams` and `speedMultiplier` to type definitions (optional fields)

**Phase 2**: Create `orbital.ts` module with position computers

**Phase 3**: Update entity initialization to populate `orbitParams`:
```typescript
// In launchSatellite reducer:
orbitParams: {
  type: 'circular',
  orbitRadius: satellite.y,
  angularVelocity: orbitalSpeeds[orbit],
  initialAngle: (satellite.x / 100) * 360,
},
speedMultiplier: 0.7 + (hashId(satellite.id) % 600) / 1000,
```

**Phase 4**: Replace position update logic in `advanceTurn` with `computeOrbitalPosition` calls

**Phase 5**: Add elliptical orbit support by allowing `orbitParams.type = 'elliptical'` at entity creation

### Benefits of Separation

1. **Collision system unchanged**: Still reads (x, y) from state
2. **Rendering unchanged**: Still uses `mapToPixels()`  
3. **Testable**: Orbital mechanics can be unit tested independently
4. **Extensible**: Adding elliptical orbits requires no changes to collision/rendering
5. **Debuggable**: Orbital position computation is isolated and inspectable

---

## Files to Modify

### Part 1: Collision Detection

| File | Changes | Lines Affected |
|------|---------|----------------|
| `src/game/types.ts` | Add `radius`, `captureRadius?` to Satellite, Debris, DebrisRemovalVehicle | ~10 lines |
| `src/game/constants.ts` | Add `OBJECT_RADII`, `CAPTURE_RADIUS_MULTIPLIER` | ~12 lines |
| `src/game/engine/collision.ts` | Add `toPixelCoordinates`, `areObjectsColliding`, `createPixelSpatialGrid`, `getAdjacentCells`; refactor `detectCollisions`; update `generateDebrisFromCollision` | ~150 lines (major rewrite) |
| `src/game/engine/debrisRemoval.ts` | Add `isWithinCaptureRange`; update `processCooperativeDRVOperations` and `processGeoTugOperations` to use it | ~30 lines |
| `src/store/slices/gameSlice.ts` | Add radius fields to `launchSatellite`, `launchDRV`; import constants | ~10 lines |

### Part 2: Orbital Mechanics (Optional/Future)

| File | Changes | Lines Affected |
|------|---------|----------------|
| `src/game/types.ts` | Add `OrbitType`, `CircularOrbitParams`, `EllipticalOrbitParams`, `OrbitParams`; add `orbitParams?`, `speedMultiplier?` to entities | ~40 lines |
| `src/game/engine/orbital.ts` | **New file**: `computeCircularOrbitPosition`, `computeEllipticalOrbitPosition`, `solveKeplerEquation`, `computeOrbitalPosition` | ~120 lines |
| `src/store/slices/gameSlice.ts` | Optionally refactor `advanceTurn` to use `computeOrbitalPosition` | ~20 lines (future) |

---

## Testing Strategy

### Unit Tests (Recommended - Currently Missing)

**High Priority Tests** (should be added):

```typescript
// tests/collision.test.ts
describe('Euclidean Collision Detection', () => {
  test('detects collision when objects overlap', () => {
    const sat1 = { x: 50, y: 25, layer: 'LEO', radius: 10 };
    const sat2 = { x: 50.1, y: 25, layer: 'LEO', radius: 10 };
    expect(areObjectsColliding(sat1, sat2)).toBe(true);
  });
  
  test('no collision when objects are far apart', () => {
    const sat1 = { x: 0, y: 25, layer: 'LEO', radius: 10 };
    const sat2 = { x: 50, y: 25, layer: 'LEO', radius: 10 };
    expect(areObjectsColliding(sat1, sat2)).toBe(false);
  });
  
  test('different layers do not collide', () => {
    const sat1 = { x: 50, y: 25, layer: 'LEO', radius: 10 };
    const sat2 = { x: 50, y: 75, layer: 'MEO', radius: 10 };
    expect(detectCollisions([sat1], [sat2], 15, 1, [])).toHaveLength(0);
  });
  
  test('scale-independent: same visual overlap = collision at any radius', () => {
    // Inner LEO (R=50px): objects 15px apart
    const leo1 = { x: 0, y: 0, layer: 'LEO', radius: 10 };
    const leo2 = { x: 1.5, y: 0, layer: 'LEO', radius: 10 };  // ~5px apart at R=50px
    
    // Outer GRAVEYARD (R=475px): objects same game-coord distance apart
    const grave1 = { x: 0, y: 200, layer: 'GRAVEYARD', radius: 10 };
    const grave2 = { x: 1.5, y: 200, layer: 'GRAVEYARD', radius: 10 };  // ~45px apart at R=475px
    
    // Both should collide (radius sum = 20px)
    expect(areObjectsColliding(leo1, leo2)).toBe(true);
    expect(areObjectsColliding(grave1, grave2)).toBe(false); // Actually far apart in pixels
  });
});

// tests/orbital.test.ts (for Part 2)
describe('Orbital Mechanics', () => {
  test('circular orbit returns correct position', () => {
    const params = { type: 'circular', orbitRadius: 25, angularVelocity: 1, initialAngle: 0 };
    const pos = computeOrbitalPosition(params, 'LEO', 90, 1.0, 0, 25);
    expect(pos.x).toBeCloseTo(25, 1);  // 90° rotation
    expect(pos.y).toBe(25);             // radius unchanged
  });
  
  test('elliptical orbit varies radius', () => {
    const params = {
      type: 'elliptical',
      semiMajorAxis: 25,
      eccentricity: 0.3,
      argumentOfPeriapsis: 0,
      meanAnomalyRate: 1,
      initialMeanAnomaly: 0
    };
    
    const periapsis = computeOrbitalPosition(params, 'LEO', 0, 1.0, 0, 25);
    const apoapsis = computeOrbitalPosition(params, 'LEO', 180, 1.0, 0, 25);
    
    expect(periapsis.y).toBeLessThan(apoapsis.y);  // Closer to Earth at periapsis
  });
});
```

### Manual Testing Checklist

**Part 1 Verification**:
- [ ] Game starts without errors
- [ ] Satellites launch in all layers (LEO, MEO, GEO)
- [ ] Collisions occur when objects visually overlap
- [ ] No collisions when objects are visually separated
- [ ] Collision frequency similar to original (tune radii if needed)
- [ ] Collision detection consistent at inner vs outer edges of layers
- [ ] Cooperative DRVs capture debris
- [ ] Geotug captures and moves satellites to graveyard
- [ ] Uncooperative DRVs remove debris
- [ ] Debris generated from collisions
- [ ] Insurance payouts work
- [ ] Game performance smooth with 100+ objects
- [ ] No browser console errors

**Part 2 Verification** (if implemented):
- [ ] Circular orbits behave identically to current system
- [ ] Elliptical orbits vary in radius over time
- [ ] Objects on elliptical orbits move faster at periapsis, slower at apoapsis
- [ ] Collision detection works for elliptical orbits
- [ ] Rendering displays elliptical paths correctly

### Build and Lint Verification

```bash
cd kessler-game
npm run build   # TypeScript compilation check
npm run lint    # ESLint code quality check
npm run dev     # Manual browser testing
```

---

## Backward Compatibility and Migration

### State Migration

**Issue**: Existing game states (localStorage) won't have `radius` or `orbitParams` fields.

**Solution**: Provide fallback defaults in all functions:

```typescript
const radius1 = obj1.radius || OBJECT_RADII.SATELLITE;
const orbitParams = sat.orbitParams || defaultCircularParams(sat.x, sat.y);
```

### Settings UI

**Current**: Users can adjust `collisionAngleThreshold` and `collisionRadiusMultiplier`.

**After Part 1**:
- `collisionAngleThreshold`: **Deprecated**, kept for API compatibility but unused
- `collisionRadiusMultiplier`: **Repurposed** to scale all collision radii (game difficulty tuning)

**Recommendation**: Update settings tooltips/labels:
- Old: "Collision Angle Threshold (degrees)"
- New: "Collision Angle Threshold (deprecated - now uses radius-based detection)"
- Old: "Collision Radius Multiplier"
- New: "Collision Size Multiplier (scales all object collision radii)"

---

## Performance Considerations

### Part 1: Collision Detection

**Spatial Hash Performance**:
- Grid size: 100px → 10×10 grid (100 buckets)
- Each object checks 3×3 = 9 neighboring cells
- Expected collision checks: O(n × 9 × objects_per_bucket) ≈ O(n) for evenly distributed objects
- Worst case: All objects in one cell → O(n²) within that cell

**Compared to Current**:
- Current: Angular buckets + polar distance checks
- New: Cartesian grid + Euclidean distance checks
- **Performance**: Similar O(n) average case
- **Tradeoff**: `toPixelCoordinates` adds cos/sin calls, but removes `atan2` from angular normalization

**Optimization**: Cache pixel coordinates if recalculated frequently:
```typescript
// Add to GameObject type:
_cachedPixelPos?: { px: number; py: number; cacheStep: number };
```

### Part 2: Orbital Mechanics

**Circular Orbits**: Negligible overhead (simple x update)

**Elliptical Orbits**: More expensive:
- Kepler equation solver: ~10 iterations × (sin, cos) per object per frame
- Impact: For 100 objects, ~1000 trig operations per turn
- Acceptable for browser environment (< 1ms on modern hardware)

---

## Risk Assessment

### High Risk
- **Visual-collision mismatch**: If pixel radii don't match sprite sizes
  - **Mitigation**: Measure sprite sizes, tune `OBJECT_RADII` to match
  - **Validation**: Manual testing with visual overlap verification

### Medium Risk  
- **Game balance change**: Euclidean collision may be more/less strict than polar
  - **Mitigation**: Start with radii that approximate current thresholds, then tune
  - **Validation**: Playtest and compare collision frequency to baseline

- **Spatial grid bucket edge cases**: Objects near canvas edges
  - **Mitigation**: Grid cells outside (0, 0)-(1000, 1000) are valid but empty
  - **Validation**: Test objects at x=0/100 boundary positions

### Low Risk
- **Performance regression**: More expensive distance calculations
  - **Mitigation**: Squared distance comparison (no sqrt), similar to current `atan2` cost
  - **Validation**: Profile with 200+ objects

- **Elliptical orbit numerical stability**: Kepler solver convergence
  - **Mitigation**: Bounded iteration count, fallback to last valid position
  - **Validation**: Unit tests with edge cases (e=0.9, large mean anomalies)

---

## Success Criteria

### Part 1: Collision Detection
1. ✅ TypeScript builds without errors
2. ✅ ESLint passes with no new warnings
3. ✅ Collision detection scale-independent (consistent at all radii)
4. ✅ Visual overlap matches collision detection within 2px tolerance
5. ✅ No false negatives at any orbital position
6. ✅ Game performance smooth with 100+ objects (60fps)
7. ✅ All existing game features work (satellites, DRVs, debris, insurance)
8. ✅ Browser console has no runtime errors
9. ✅ Collision frequency similar to baseline (±20%)

### Part 2: Orbital Mechanics (Future)
1. ✅ Circular orbits produce identical behavior to current system
2. ✅ Elliptical orbit interface defined and documented
3. ✅ Sample elliptical orbit implementation works correctly
4. ✅ Collision detection works for elliptical orbits without modification
5. ✅ Rendering adapts to variable-radius orbits without changes

---

## Timeline Estimate

### Part 1: Collision Detection
- Type definitions: 30 minutes
- Constants setup: 15 minutes
- `toPixelCoordinates` and collision functions: 1.5 hours
- Spatial grid refactor: 2 hours
- Capture detection refactor: 1 hour
- Entity initialization: 45 minutes
- Manual testing and tuning: 2 hours
- **Part 1 Total**: ~8 hours

### Part 2: Orbital Mechanics (Optional)
- Orbital parameter types: 30 minutes
- Circular orbit implementation: 1 hour
- Elliptical orbit implementation: 2.5 hours (Kepler solver)
- Integration with game loop: 1 hour
- Migration and testing: 1.5 hours
- **Part 2 Total**: ~6.5 hours

### **Grand Total**: ~14.5 hours

---

## Implementation Order

### Phase 1: Collision Detection (Required)
1. Update types (`radius`, `captureRadius`)
2. Add constants (`OBJECT_RADII`, `CAPTURE_RADIUS_MULTIPLIER`)
3. Implement `toPixelCoordinates` and `areObjectsColliding`
4. Refactor `detectCollisions` with pixel-space spatial grid
5. Update capture detection (`isWithinCaptureRange`)
6. Initialize radius fields on entity creation
7. Test and tune radii values
8. Run build, lint, manual tests

### Phase 2: Orbital Mechanics Interface (Optional - Foundation)
1. Define orbit parameter types
2. Create `orbital.ts` module with circular orbit implementation
3. Add `orbitParams` to entity initialization (circular only)
4. Update `advanceTurn` to use `computeOrbitalPosition`
5. Verify circular orbits work identically to baseline

### Phase 3: Elliptical Orbits (Optional - Future Enhancement)
1. Implement `solveKeplerEquation` and `computeEllipticalOrbitPosition`
2. Add UI/config to create elliptical debris or satellites
3. Test collision and rendering with mixed orbit types
4. Document gameplay implications (e.g., Molniya-style challenge orbits)

---

## Notes and Recommendations

### Collision Radii Tuning
The proposed values (`SATELLITE: 10`, `DEBRIS: 6`, `DRV: 10-12`) are **initial estimates**. Tune based on:
1. **Visual feedback**: Do collisions match sprite overlap?
2. **Gameplay balance**: Too many/few collisions?
3. **Player testing**: Does capture feel responsive?

### Automated Testing
**Strongly recommend** adding unit tests for:
- Collision detection edge cases
- Orbital mechanics (especially Kepler solver)
- Spatial grid bucketing

### Elliptical Orbits as Gameplay Feature
Potential use cases:
- **Challenge debris**: Highly eccentric orbits (e=0.5-0.8) cross multiple layers
- **Molniya satellites**: High-eccentricity GEO orbits (e=0.7)
- **Perturbed orbits**: Satellites drift into elliptical paths after near-miss collisions

### Documentation
After implementation, document:
- New collision detection algorithm
- How to add elliptical orbits
- Radius tuning guidelines
- Performance characteristics

---

## Appendix: Coordinate System Reference

### Game Coords → Pixel Coords Mapping

```
Game Space           Polar              Pixel Space
──────────          ──────             ────────────
x: 0-100      →     θ: 0-360°    →     px: centerX + r×cos(θ)
y: layer bounds →   r: inner-outer →   py: centerY + r×sin(θ)
```

**Example**:
```
Satellite at game coords (x=25, y=25) in LEO
→ Polar: θ = 90°, r = 50 + (25/50)×175 = 137.5px
→ Pixels: px = 500 + 137.5×cos(90°) = 500px
          py = 500 + 137.5×sin(90°) = 637.5px
```

### Visual Size → Collision Radius

| Object | Visual Diameter | Collision Radius | Reasoning |
|--------|----------------|------------------|-----------|
| Satellite | 20-24px | 10px | Half of visual for edge-to-edge collision |
| DRV | 20-24px | 10px | Same as satellite for consistency |
| Debris (coop) | 12-14px | 6px | Half of visual |
| Debris (uncoop) | 14-16px | 6px | Simplified to same as coop |

**Capture Radius** = Collision Radius × 1.5 = allows "approach and grab" gameplay

---

**End of Technical Specification**
