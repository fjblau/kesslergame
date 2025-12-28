# Technical Specification: Debris Generation Adjustment

## Task Difficulty Assessment

**Complexity Level**: **EASY**

**Reasoning**:
- Simple logic change in collision detection
- Single file modification (collision.ts)
- Clear root cause identified
- No complex edge cases or architectural considerations
- Straightforward testing approach

---

## Technical Context

### Technology Stack
- **Language**: TypeScript 5.x
- **Framework**: React 18.x with Vite
- **State Management**: Redux Toolkit
- **Build Tool**: Vite

### Current Project Structure
```
kessler-game/src/
├── game/
│   ├── engine/
│   │   ├── collision.ts         # ← File to modify
│   │   └── debrisRemoval.ts
│   ├── constants.ts
│   └── types.ts
├── store/
│   └── slices/
│       └── gameSlice.ts
└── components/
```

---

## Problem Analysis

### Root Cause

When only DRVs (Debris Removal Vehicles) are in orbit, collisions between them cause rapid debris escalation due to:

1. **DRVs collide with each other**: The collision detection system treats DRVs as collidable objects (collision.ts:108)
   ```typescript
   const allObjects: GameObject[] = [...activeSatellites, ...activeDebris, ...drvs];
   ```

2. **Each collision generates debris**: When two DRVs collide, they both get destroyed and generate debris based on `debrisPerCollision` (default: 5 pieces per collision)

3. **Cascade effect**: The newly created debris pieces are in close proximity and immediately collide with:
   - Each other
   - Remaining DRVs
   - Each subsequent collision creates more debris (5 pieces each)

4. **Exponential growth**: With only DRVs in orbit:
   - Turn 1: 2 DRVs collide → 5 debris created, 0 DRVs remain
   - Turn 2: 5 debris pieces collide with each other → 10-15 more debris
   - Turn 3: 15-20 debris collide → 30-50 debris
   - Turn 4: 50+ debris → 100+ debris (exponential escalation)

### Why This Is Problematic

**DRVs should not collide with each other because:**
- They are active, maneuverable spacecraft with collision avoidance systems
- In the game logic, they already exhibit intelligent movement (cooperative DRVs actively seek targets)
- It creates unrealistic gameplay where cleanup vehicles become debris generators
- It makes DRV-only scenarios unplayable

---

## Implementation Approach

### Solution: Exclude DRV-DRV Collisions

**Primary Fix**: Modify the collision detection logic to skip pairs where both objects are DRVs.

**Location**: `kessler-game/src/game/engine/collision.ts:152`

**Current Code** (lines 137-154):
```typescript
for (let i = 0; i < nearbyObjects.length; i++) {
  for (let j = i + 1; j < nearbyObjects.length; j++) {
    const obj1 = nearbyObjects[i];
    const obj2 = nearbyObjects[j];
    
    const pairKey = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
    if (checkedPairs.has(pairKey)) continue;
    checkedPairs.add(pairKey);

    const polar1 = toPolarCoordinates(obj1);
    const polar2 = toPolarCoordinates(obj2);

    const angleDiff = normalizeAngleDiff(polar1.angle - polar2.angle);
    const radiusDiff = Math.abs(polar1.radius - polar2.radius);

    if (angleDiff < angleThreshold && radiusDiff < radiusThreshold) {
      collisions.push({ obj1, obj2, layer });
    }
  }
}
```

**Modified Code** (add check before collision detection):
```typescript
for (let i = 0; i < nearbyObjects.length; i++) {
  for (let j = i + 1; j < nearbyObjects.length; j++) {
    const obj1 = nearbyObjects[i];
    const obj2 = nearbyObjects[j];
    
    const pairKey = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
    if (checkedPairs.has(pairKey)) continue;
    checkedPairs.add(pairKey);

    // Skip DRV-DRV collisions (DRVs have collision avoidance)
    const isDRV1 = 'removalType' in obj1;
    const isDRV2 = 'removalType' in obj2;
    if (isDRV1 && isDRV2) continue;

    const polar1 = toPolarCoordinates(obj1);
    const polar2 = toPolarCoordinates(obj2);

    const angleDiff = normalizeAngleDiff(polar1.angle - polar2.angle);
    const radiusDiff = Math.abs(polar1.radius - polar2.radius);

    if (angleDiff < angleThreshold && radiusDiff < radiusThreshold) {
      collisions.push({ obj1, obj2, layer });
    }
  }
}
```

**Type Detection Logic**:
- DRVs have a unique `removalType` property
- Satellites have a `purpose` property
- Debris objects have neither
- Using `'removalType' in obj` is a reliable type guard

---

## Source Code Structure Changes

### Files to Modify

1. **kessler-game/src/game/engine/collision.ts** (PRIMARY)
   - Add DRV-DRV collision exclusion check
   - Location: Line ~145 (inside the collision detection loop)
   - Change type: Logic addition (3 lines)

### Files to Review (No Changes Required)

1. **kessler-game/src/game/types.ts**
   - Verify type definitions for DRVs, Satellites, and Debris
   - Confirm `removalType` is unique to DRVs

2. **kessler-game/src/store/slices/gameSlice.ts**
   - Review collision processing logic
   - Confirm DRV destruction handling is correct

---

## Data Model / API / Interface Changes

**No changes required.**

The existing type system already provides sufficient differentiation:
- `DebrisRemovalVehicle` type has `removalType: DRVType`
- `Satellite` type has `purpose: SatelliteType`
- `Debris` type has `type: DebrisType`

Type guard `'removalType' in obj` is sufficient to identify DRVs.

---

## Verification Approach

### Manual Testing

**Test Scenario 1: DRV-only orbit**
1. Launch only DRVs (both cooperative and uncooperative types)
2. Launch multiple DRVs into the same layer (LEO)
3. Advance multiple turns
4. **Expected**: DRVs should move around without colliding with each other
5. **Expected**: No debris should be generated from DRV-DRV collisions

**Test Scenario 2: DRV-debris collisions still work**
1. Launch satellites to generate initial debris
2. Launch DRVs to clean up
3. Advance turns
4. **Expected**: DRVs should still collide with debris (and be destroyed)
5. **Expected**: DRV-debris collisions should generate debris as normal

**Test Scenario 3: DRV-satellite collisions still work**
1. Launch satellites
2. Launch DRVs
3. Advance turns until they potentially collide
4. **Expected**: DRVs should still collide with satellites (and be destroyed)
5. **Expected**: DRV-satellite collisions should generate debris as normal

**Test Scenario 4: Mixed environment**
1. Launch satellites, generate debris, launch DRVs
2. Advance multiple turns
3. **Expected**: All collision types work except DRV-DRV
4. **Expected**: Satellite-satellite, satellite-debris, debris-debris, DRV-satellite, DRV-debris collisions still occur

### Automated Testing

If test framework is available:
```typescript
describe('Collision Detection', () => {
  it('should not detect collisions between two DRVs', () => {
    const drv1 = createDRV({ x: 10, y: 25, layer: 'LEO' });
    const drv2 = createDRV({ x: 10, y: 25, layer: 'LEO' });
    
    const collisions = detectCollisions([], [], 15, 1, [drv1, drv2]);
    
    expect(collisions).toHaveLength(0);
  });
  
  it('should detect collision between DRV and debris', () => {
    const drv = createDRV({ x: 10, y: 25, layer: 'LEO' });
    const debris = createDebris({ x: 10, y: 25, layer: 'LEO' });
    
    const collisions = detectCollisions([], [debris], 15, 1, [drv]);
    
    expect(collisions).toHaveLength(1);
  });
  
  it('should detect collision between DRV and satellite', () => {
    const drv = createDRV({ x: 10, y: 25, layer: 'LEO' });
    const satellite = createSatellite({ x: 10, y: 25, layer: 'LEO' });
    
    const collisions = detectCollisions([satellite], [], 15, 1, [drv]);
    
    expect(collisions).toHaveLength(1);
  });
});
```

### Build & Lint Verification

Run the following commands to ensure code quality:
```bash
npm run build      # Verify TypeScript compilation
npm run lint       # Check for linting errors
npm run typecheck  # Verify type correctness
```

---

## Risk Assessment

### Low Risk

This change is low-risk because:
1. **Localized change**: Only affects collision detection logic
2. **Conservative approach**: Removes a collision type rather than adding complexity
3. **Type-safe**: Uses TypeScript type guards
4. **No data model changes**: Existing types remain unchanged
5. **No breaking changes**: API surface remains the same

### Potential Edge Cases

**None identified.**

The type guard approach is reliable because:
- DRVs always have `removalType` property
- Satellites and Debris never have `removalType` property
- TypeScript types enforce this at compile time

---

## Alternative Approaches Considered

### Alternative 1: Reduce debris generation for DRV collisions
**Approach**: Generate fewer debris pieces when DRVs collide (e.g., 1-2 instead of 5)

**Pros**:
- DRVs could still collide, adding gameplay challenge
- More gradual debris growth

**Cons**:
- Unrealistic (DRVs should avoid each other)
- Adds complexity (collision type-specific debris generation)
- Doesn't fully solve escalation problem

**Decision**: ❌ Not recommended

### Alternative 2: Increase collision threshold for DRVs
**Approach**: Make DRVs harder to collide with (larger threshold)

**Pros**:
- Simple parameter change
- DRVs have some collision avoidance

**Cons**:
- Doesn't fully prevent DRV-DRV collisions
- Inconsistent with DRV capabilities
- Still allows escalation, just slower

**Decision**: ❌ Not recommended

### Alternative 3: Give DRVs collision immunity
**Approach**: DRVs never collide with anything

**Pros**:
- Completely prevents DRV escalation
- Simple to implement

**Cons**:
- Unrealistic (DRVs can still hit debris/satellites)
- Reduces gameplay challenge
- Inconsistent with game mechanics

**Decision**: ❌ Not recommended

### Chosen Solution: Exclude DRV-DRV collisions only
**Decision**: ✅ **Recommended**

**Rationale**:
- Most realistic (active collision avoidance between manned/controlled vehicles)
- Preserves DRV-debris and DRV-satellite collisions
- Minimal code change
- No parameter tuning required
- Fully addresses the reported issue

---

## Success Criteria

1. ✅ DRVs no longer collide with each other
2. ✅ DRVs still collide with satellites and debris
3. ✅ Debris generation in DRV-only scenarios is eliminated
4. ✅ All other collision types work as before
5. ✅ No TypeScript compilation errors
6. ✅ No linting errors
7. ✅ Build succeeds
