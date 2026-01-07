# Technical Specification: Refueling Vehicle Implementation

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Requires new DRV type with similar mechanics to existing cooperative DRVs
- Must implement satellite/DRV lifespan system (currently missing for satellites)
- Moderate complexity in extending capture mechanism
- Need to add UI controls and visual indicators
- Requires balancing cost/benefit to make feature worthwhile

---

## Technical Context

### Current Implementation Analysis

**Existing DRV Types:**
1. **Cooperative DRV** - Captures and removes cooperative debris and satellites
2. **Uncooperative DRV** - Removes uncooperative debris
3. **GeoTug** - Moves GEO satellites to graveyard orbit

**DRV Lifecycle (Current):**
- DRVs have `age` and `maxAge` properties (default maxAge = 10 turns)
- DRVs auto-decommission when `age >= maxAge` (safely deorbit, no debris)
- Cooperative DRVs use capture mechanism: target (1 turn) → capture → hold (2 turns) → release/remove

**Satellite Lifecycle (Current):**
- Satellites have `age` counter that increments each turn
- **CRITICAL GAP**: No expiration mechanism implemented (unlike original notebook which had 20-turn LEO lifetime)
- Satellites only removed via collision or cooperative DRV capture

### Problem Statement

The user wants to implement a "Refueling Vehicle" that:
1. Launches to an orbit
2. Captures a satellite or DRV using cooperative capture pattern
3. Holds for 1 day (1 turn) - refueling operation
4. Releases with extended lifespan

**Key Issue**: Without satellite/DRV expiration, refueling provides no gameplay value. DRVs already auto-deorbit safely, and satellites never expire, so there's no lifespan to extend.

### Recommended Solution

Implement a complete lifespan system alongside the refueling vehicle:

1. **Add Satellite Lifespan System**
   - Satellites have finite operational lifetime based on orbit
   - Visual indicators for remaining lifespan
   - Warning systems for satellites nearing end-of-life

2. **Add DRV Lifespan Extension**
   - DRVs can have their operational time extended
   - Useful for keeping valuable cooperative DRVs operational longer

3. **Implement Refueling Vehicle**
   - New DRV type that can refuel both satellites and DRVs
   - Extends target's lifespan back to "new" state
   - Strategic value: cheaper than launching new vehicles/satellites

---

## Implementation Approach

### Phase 1: Lifespan System Foundation

#### Satellite Lifespan Configuration

Add lifespan constants to `kessler-game/src/game/constants.ts`:

```typescript
export const SATELLITE_LIFESPAN: Record<OrbitLayer, number> = {
  LEO: 20,        // 20 turns (harsh environment)
  MEO: 40,        // 40 turns (moderate environment)
  GEO: 60,        // 60 turns (stable environment)
  GRAVEYARD: 999, // Effectively infinite
};
```

#### Type Updates

Update `kessler-game/src/game/types.ts`:

```typescript
export interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  maxAge: number;              // NEW: Lifespan based on orbit
  insuranceTier: InsuranceTier;
  inGraveyard?: boolean;
  radius: number;
  captureRadius?: number;
  metadata?: { /* ... */ };
}

// Update DRVType to include refueling
export type DRVType = 'cooperative' | 'uncooperative' | 'geotug' | 'refueling';

export interface RefuelingInfo {
  refuelingVehicleId: string;
  targetId: string;
  targetType: 'satellite' | 'drv';
  layer: OrbitLayer;
  previousAge: number;
  newAge: number;
}

export interface GameState {
  // ... existing fields
  recentRefuelings: RefuelingInfo[];
  satellitesExpired: number;  // NEW: Track expired satellites
}
```

#### Cost Configuration

Add refueling costs to `kessler-game/src/game/constants.ts`:

```typescript
export const DRV_CONFIG = {
  costs: {
    LEO: { 
      cooperative: 2_000_000, 
      uncooperative: 3_500_000, 
      geotug: 25_000_000,
      refueling: 1_500_000      // NEW: Cheaper than cooperative
    },
    MEO: { 
      cooperative: 3_000_000, 
      uncooperative: 5_250_000, 
      geotug: 25_000_000,
      refueling: 2_250_000      // NEW
    },
    GEO: { 
      cooperative: 5_000_000, 
      uncooperative: 8_750_000, 
      geotug: 25_000_000,
      refueling: 3_750_000      // NEW
    },
    GRAVEYARD: { 
      cooperative: 0, 
      uncooperative: 0, 
      geotug: 0,
      refueling: 0
    },
  },
  capacity: {
    cooperative: [2, 3] as [number, number],
    uncooperative: [6, 9] as [number, number],
    geotug: [1, 1] as [number, number],
    refueling: [1, 1] as [number, number],  // NEW: Refuel 1 at a time
  },
  successRate: {
    cooperative: 0.85,
    uncooperative: 0.90,
    geotug: 1.0,
    refueling: 0.95,  // NEW: High success rate
  },
  duration: {
    cooperative: 10,
    uncooperative: 10,
    geotug: 999,
    refueling: 15,    // NEW: Longer operational life
  },
};
```

### Phase 2: Satellite Expiration Logic

#### Update Launch Logic

Modify `kessler-game/src/store/slices/gameSlice.ts` in `launchSatellite` reducer:

```typescript
const satellite = {
  id: generateId(),
  ...randomPositionInLayer(orbit),
  layer: orbit,
  purpose,
  age: 0,
  maxAge: SATELLITE_LIFESPAN[orbit],  // NEW
  insuranceTier,
  radius: OBJECT_RADII.satellite,
  captureRadius: OBJECT_RADII.satellite * CAPTURE_RADIUS_MULTIPLIER,
  ...(metadata && { metadata }),
};
```

#### Add Satellite Expiration Reducer

Add new reducer to `gameSlice.ts`:

```typescript
expireSatellites: (state) => {
  const expiredSatellites: Satellite[] = [];
  
  state.satellites = state.satellites.filter(sat => {
    if (sat.age >= sat.maxAge && !sat.inGraveyard) {
      expiredSatellites.push(sat);
      return false;
    }
    return true;
  });
  
  state.satellitesExpired += expiredSatellites.length;
  
  // Log expiration events
  expiredSatellites.forEach(sat => {
    // Will be handled by event logging system
  });
  
  state.riskLevel = calculateRiskLevel(state.debris.length);
},
```

### Phase 3: Refueling Vehicle Implementation

#### Add Refueling Operation Logic

Create new function in `kessler-game/src/game/engine/debrisRemoval.ts`:

```typescript
export function selectRefuelingTarget(
  drv: DebrisRemovalVehicle,
  satellites: Satellite[],
  drvs: DebrisRemovalVehicle[],
  allDRVs?: DebrisRemovalVehicle[]
): Satellite | DebrisRemovalVehicle | null {
  const alreadyTargetedIds = new Set<string>();
  if (allDRVs) {
    allDRVs.forEach(otherDrv => {
      if (otherDrv.id !== drv.id) {
        if (otherDrv.targetDebrisId) alreadyTargetedIds.add(otherDrv.targetDebrisId);
        if (otherDrv.capturedDebrisId) alreadyTargetedIds.add(otherDrv.capturedDebrisId);
      }
    });
  }
  
  // Find satellites and DRVs that need refueling (age > 50% of maxAge)
  const satellitesNeedingRefuel = satellites.filter(s => 
    s.layer === drv.layer && 
    !s.inGraveyard &&
    s.age > s.maxAge * 0.5 &&
    !alreadyTargetedIds.has(s.id)
  );
  
  const drvsNeedingRefuel = drvs.filter(d =>
    d.layer === drv.layer &&
    d.id !== drv.id &&
    d.age > d.maxAge * 0.5 &&
    d.removalType !== 'refueling' && // Can't refuel other refueling vehicles
    !alreadyTargetedIds.has(d.id)
  );
  
  const allTargets: (Satellite | DebrisRemovalVehicle)[] = [
    ...satellitesNeedingRefuel,
    ...drvsNeedingRefuel
  ];
  
  if (allTargets.length === 0) return null;
  return allTargets[Math.floor(Math.random() * allTargets.length)];
}

export function processRefuelingOperations(
  drv: DebrisRemovalVehicle,
  satellites: Satellite[],
  drvs: DebrisRemovalVehicle[],
  allDRVs?: DebrisRemovalVehicle[]
): {
  refueledSatelliteId: string | undefined;
  refueledDRVId: string | undefined;
  newTargetId: string | undefined;
  capturedObjectId: string | undefined;
  captureOrbitsRemaining: number | undefined;
  targetingTurnsRemaining: number | undefined;
} {
  const REFUEL_ORBITS = 1; // Hold for 1 turn to refuel
  
  // If holding a captured object
  if (drv.capturedDebrisId) {
    const capturedSat = satellites.find(s => s.id === drv.capturedDebrisId);
    const capturedDRV = drvs.find(d => d.id === drv.capturedDebrisId);
    const capturedObject = capturedSat || capturedDRV;
    
    if (!capturedObject) {
      return {
        refueledSatelliteId: undefined,
        refueledDRVId: undefined,
        newTargetId: undefined,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined
      };
    }
    
    const orbitsRemaining = (drv.captureOrbitsRemaining !== undefined ? drv.captureOrbitsRemaining : REFUEL_ORBITS) - 1;
    
    // Refueling complete
    if (orbitsRemaining <= 0) {
      // Reset age to 0 (fully refueled)
      capturedObject.age = 0;
      
      return {
        refueledSatelliteId: capturedSat?.id,
        refueledDRVId: capturedDRV?.id,
        newTargetId: undefined,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined
      };
    }
    
    // Still refueling
    return {
      refueledSatelliteId: undefined,
      refueledDRVId: undefined,
      newTargetId: undefined,
      capturedObjectId: drv.capturedDebrisId,
      captureOrbitsRemaining: orbitsRemaining,
      targetingTurnsRemaining: undefined
    };
  }
  
  // Targeting logic (similar to cooperative DRV)
  if (drv.targetDebrisId) {
    const currentSat = satellites.find(s => s.id === drv.targetDebrisId);
    const currentDRV = drvs.find(d => d.id === drv.targetDebrisId);
    const currentTarget = currentSat || currentDRV;
    
    if (!currentTarget) {
      const newTarget = selectRefuelingTarget(drv, satellites, drvs, allDRVs);
      return {
        refueledSatelliteId: undefined,
        refueledDRVId: undefined,
        newTargetId: newTarget?.id,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined
      };
    }
    
    const turnsRemaining = (drv.targetingTurnsRemaining !== undefined ? drv.targetingTurnsRemaining : ORBITS_TO_TARGET) - 1;
    
    if (turnsRemaining <= 0) {
      return {
        refueledSatelliteId: undefined,
        refueledDRVId: undefined,
        newTargetId: undefined,
        capturedObjectId: currentTarget.id,
        captureOrbitsRemaining: REFUEL_ORBITS,
        targetingTurnsRemaining: undefined
      };
    }
    
    return {
      refueledSatelliteId: undefined,
      refueledDRVId: undefined,
      newTargetId: drv.targetDebrisId,
      capturedObjectId: undefined,
      captureOrbitsRemaining: undefined,
      targetingTurnsRemaining: turnsRemaining
    };
  }
  
  // Select new target
  const newTarget = selectRefuelingTarget(drv, satellites, drvs, allDRVs);
  return {
    refueledSatelliteId: undefined,
    refueledDRVId: undefined,
    newTargetId: newTarget?.id,
    capturedObjectId: undefined,
    captureOrbitsRemaining: undefined,
    targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined
  };
}
```

#### Integrate Refueling into Game Loop

Update `processDRVOperations` in `gameSlice.ts`:

```typescript
processDRVOperations: (state) => {
  const activeDRVs = state.debrisRemovalVehicles.filter(drv => drv.age < drv.maxAge);
  const removalEvents: DebrisRemovalInfo[] = [];
  const satelliteCaptures: SatelliteCaptureInfo[] = [];
  const graveyardMoves: GraveyardMoveInfo[] = [];
  const refuelings: RefuelingInfo[] = [];  // NEW

  activeDRVs.forEach(drv => {
    if (drv.removalType === 'cooperative') {
      // ... existing cooperative logic
    } else if (drv.removalType === 'geotug') {
      // ... existing geotug logic
    } else if (drv.removalType === 'refueling') {
      // NEW: Refueling logic
      const result = processRefuelingOperations(
        drv, 
        state.satellites, 
        state.debrisRemovalVehicles,
        state.debrisRemovalVehicles
      );
      
      drv.targetDebrisId = result.newTargetId;
      drv.capturedDebrisId = result.capturedObjectId;
      drv.captureOrbitsRemaining = result.captureOrbitsRemaining;
      drv.targetingTurnsRemaining = result.targetingTurnsRemaining;
      
      if (result.refueledSatelliteId) {
        const satellite = state.satellites.find(s => s.id === result.refueledSatelliteId);
        if (satellite) {
          refuelings.push({
            refuelingVehicleId: drv.id,
            targetId: satellite.id,
            targetType: 'satellite',
            layer: drv.layer,
            previousAge: satellite.age,
            newAge: 0,
          });
        }
      }
      
      if (result.refueledDRVId) {
        const targetDRV = state.debrisRemovalVehicles.find(d => d.id === result.refueledDRVId);
        if (targetDRV) {
          refuelings.push({
            refuelingVehicleId: drv.id,
            targetId: targetDRV.id,
            targetType: 'drv',
            layer: drv.layer,
            previousAge: targetDRV.age,
            newAge: 0,
          });
        }
      }
    } else {
      // ... existing uncooperative logic
    }
  });

  state.recentRefuelings = refuelings;  // NEW
  // ... rest of logic
},
```

### Phase 4: UI Integration

#### Files to Modify

1. **Launch Controls** - Add refueling vehicle option
   - `kessler-game/src/components/ControlPanel/LaunchSelector.tsx` (if exists)
   - Or modify existing launch UI

2. **Visual Indicators**
   - `kessler-game/src/components/GameBoard/SatelliteSprite.tsx` - Add lifespan indicator
   - `kessler-game/src/components/GameBoard/DRVSprite.tsx` - Add lifespan indicator, refueling icon
   - Create `kessler-game/src/components/GameBoard/RefuelingEffect.tsx` - Visual for refueling operation

3. **Status Display**
   - Add satellite/DRV lifespan warnings
   - Show refueling operations in event log

4. **Event System**
   - Add events for satellite expiration
   - Add events for refueling operations

---

## Source Code Structure Changes

### New Files

```
kessler-game/src/
├── components/
│   └── GameBoard/
│       └── RefuelingEffect.tsx         # NEW: Refueling animation
```

### Modified Files

```
kessler-game/src/
├── game/
│   ├── constants.ts                    # Add SATELLITE_LIFESPAN, update DRV_CONFIG
│   ├── types.ts                        # Update Satellite, DRVType, GameState
│   └── engine/
│       └── debrisRemoval.ts            # Add refueling functions
├── store/
│   └── slices/
│       └── gameSlice.ts                # Add expireSatellites, update processDRVOperations
└── components/
    ├── GameBoard/
    │   ├── SatelliteSprite.tsx         # Add lifespan visualization
    │   └── DRVSprite.tsx               # Add refueling vehicle rendering
    └── ControlPanel/
        └── [Launch UI component]       # Add refueling vehicle option
```

---

## Verification Approach

### Unit Tests

1. **Lifespan Logic**
   - Satellites expire at correct age
   - Different orbits have different lifespans
   - Graveyard satellites don't expire

2. **Refueling Logic**
   - Target selection prioritizes older satellites/DRVs
   - Refueling resets age to 0
   - Refueling vehicle operates correctly

3. **Edge Cases**
   - Refueling a satellite about to expire
   - Multiple refueling vehicles targeting same object
   - Refueling vehicle expires while holding target

### Integration Tests

1. End-to-end refueling operation
2. Satellite expiration affects budget (lost revenue)
3. Event log shows refueling and expiration events

### Manual Testing

1. Launch satellites, verify they expire
2. Launch refueling vehicle, verify it extends lifespan
3. Verify cost/benefit balance
4. Test UI indicators and visual feedback

---

## Design Questions for User

Before implementation, clarify:

1. **Satellite Lifespan Values** - Are the proposed values (LEO:20, MEO:40, GEO:60 turns) acceptable?

2. **Refueling Cost** - Should refueling vehicles be ~75% of cooperative DRV cost, or different ratio?

3. **Refueling Strategy** - Should refueling:
   - Reset age to 0 (fully refueled)?
   - Add fixed turns (e.g., +10 turns)?
   - Restore to "new" maxAge?

4. **Multiple Refuelings** - Can a satellite/DRV be refueled multiple times?

5. **Expiration Consequences** - When satellites expire, should they:
   - Simply disappear (current approach)?
   - Create debris?
   - Have insurance payout option?

6. **UI Priority** - Which visual indicators are most important:
   - Lifespan bars on sprites?
   - Color coding (green→yellow→red)?
   - Warnings in event log?

---

## Implementation Complexity Breakdown

### Easy (1-2 hours)
- Add constants for satellite lifespan
- Update type definitions
- Add expireSatellites reducer

### Medium (3-5 hours)
- Implement refueling operation logic
- Integrate into game loop
- Add basic UI for launching refueling vehicles

### Complex (6-8 hours)
- Visual indicators for lifespan
- Refueling animation effects
- Balancing costs and gameplay value
- Comprehensive testing

**Total Estimated Time**: 10-15 hours

---

## Risks and Mitigations

### Risk 1: Game Balance
**Issue**: Refueling might be too cheap/expensive
**Mitigation**: Make costs configurable, test multiple scenarios

### Risk 2: UI Clutter
**Issue**: Too many lifespan indicators overwhelming
**Mitigation**: Progressive disclosure - only show when relevant (e.g., <50% remaining)

### Risk 3: Edge Cases
**Issue**: Complex interactions with capture, collision, etc.
**Mitigation**: Comprehensive test coverage, careful state management

---

## Alternative Approaches Considered

### Option 1: No Satellite Lifespan (Original Request Only)
- Implement refueling without satellite expiration
- Only works for extending DRV operational time
- **Rejected**: Provides minimal gameplay value

### Option 2: Satellite Degradation Instead of Expiration
- Satellites lose revenue capacity over time instead of expiring
- Refueling restores revenue capacity
- **Rejected**: More complex to implement and explain

### Option 3: Hybrid Insurance/Refueling
- Refueling also provides insurance benefit
- **Rejected**: Conflates two separate mechanics
