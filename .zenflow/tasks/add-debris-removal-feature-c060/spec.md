# Technical Specification: Debris Removal Feature

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Builds on existing game architecture with established patterns
- Requires new entity type (debris removal vehicles) similar to satellites
- Adds new player action but follows existing launch mechanics
- Mission system already exists, just needs new debris-related missions
- Collision system can be extended with debris removal logic
- Main complexity is balancing game mechanics and UI integration

---

## Technical Context

### Existing Codebase
- **Source Material**: `spec.md` and `kessler.ipynb`
- **Technology Stack**: React 18.x + TypeScript 5.x + Redux Toolkit/Zustand
- **Current Game Systems**: Satellites, debris, collisions, missions, insurance, budget
- **Visualization**: Canvas/Konva.js for orbital display

### Dependencies (Existing)
All required dependencies already specified in main spec.md. No new packages needed.

---

## Implementation Approach

### Feature Overview

Add debris removal vehicles (DRVs) as a new strategic option for players to mitigate Kessler Event risk. Players can launch two types of DRVs:

1. **Cooperative Debris Removal** - Targets large, trackable debris
2. **Uncooperative Debris Removal** - Targets small, untracked debris (more expensive, higher risk)

### Core Mechanics

#### Debris Types
Extend debris to have a `type` property:
- **Cooperative**: Large, trackable debris (70% of debris)
- **Uncooperative**: Small, untracked debris (30% of debris)

#### Debris Removal Vehicle (DRV)
New entity type with properties:
- **Removal Type**: Cooperative or Uncooperative
- **Orbital Layer**: LEO, MEO, or GEO
- **Capacity**: How many debris pieces it can remove
- **Active Duration**: Number of turns before decommission
- **Cost**: Launch cost based on type and orbit

#### Removal Mechanics
- DRVs operate for a limited number of turns (5-10 turns)
- Each turn, a DRV removes debris within its layer
- Cooperative DRVs: Remove 2-3 cooperative debris per turn, 85% success rate
- Uncooperative DRVs: Remove 1-2 uncooperative debris per turn, 60% success rate
- Failed removals can create additional debris (risk factor)
- DRVs expire after their duration and become debris themselves

#### Economic Balance
**Cooperative DRV Costs**:
- LEO: $4M (2x satellite cost)
- MEO: $6M (2x satellite cost)
- GEO: $10M (2x satellite cost)

**Uncooperative DRV Costs**:
- LEO: $8M (4x satellite cost)
- MEO: $12M (4x satellite cost)
- GEO: $20M (4x satellite cost)

Higher costs reflect complexity and risk of debris removal operations.

### Game Flow Integration

**Enhanced Turn Execution**:
```
1. Player makes launch decision (satellite OR debris removal vehicle)
2. Validate budget availability
3. Create satellite/DRV if affordable
4. Age all satellites and DRVs
5. Execute DRV debris removal operations
6. Remove expired LEO satellites and expired DRVs
7. Detect collisions
8. Resolve collisions (create debris, destroy satellites)
9. Process insurance payouts
10. Trigger random events
11. Update metrics and risk level
12. Check mission completion
13. Check end game conditions
14. Advance step counter
```

---

## Source Code Structure

### Modified Files

```
src/
├── game/
│   ├── types.ts                      # ADD: DebrisRemovalVehicle, DebrisType types
│   ├── constants.ts                  # ADD: DRV costs, capacities, durations
│   ├── engine/
│   │   ├── simulation.ts             # MODIFY: Add DRV processing logic
│   │   ├── collision.ts              # MODIFY: Handle debris types
│   │   └── missions.ts               # ADD: New debris removal missions
│   └── utils.ts                      # ADD: Debris removal helpers
├── store/
│   └── slices/
│       ├── gameSlice.ts              # MODIFY: Add DRVs to state
│       ├── economySlice.ts           # MODIFY: Add DRV launch costs
│       └── metricsSlice.ts           # ADD: Track debris removal stats
├── components/
│   ├── GameBoard/
│   │   ├── OrbitVisualization.tsx    # MODIFY: Render DRVs
│   │   └── DRVSprite.tsx             # NEW: DRV visual representation
│   ├── ControlPanel/
│   │   ├── ControlPanel.tsx          # MODIFY: Add DRV launch option
│   │   ├── LaunchSelector.tsx        # NEW: Choose satellite or DRV
│   │   └── DRVConfiguration.tsx      # NEW: Configure DRV type
│   ├── MissionPanel/
│   │   └── MissionCard.tsx           # MODIFY: Display new missions
│   └── StatsPanel/
│       └── DebrisBreakdown.tsx       # NEW: Show debris types
```

### New UI Components

1. **LaunchSelector** - Radio/tab selection between satellites and DRVs
2. **DRVConfiguration** - Choose cooperative vs uncooperative DRV
3. **DRVSprite** - Visual representation of active DRVs on orbit view
4. **DebrisBreakdown** - Pie chart showing cooperative vs uncooperative debris

---

## Data Model / API / Interface Changes

### New TypeScript Types

```typescript
// Debris types
type DebrisType = 'cooperative' | 'uncooperative';
type DRVType = 'cooperative' | 'uncooperative';

// Updated Debris interface
interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;  // NEW
}

// New Debris Removal Vehicle interface
interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  removalType: DRVType;
  age: number;
  maxAge: number;
  capacity: number;  // Debris removed per turn
  successRate: number;  // Probability of successful removal
  debrisRemoved: number;  // Total debris removed
}

// Updated GameState
interface GameState {
  // ... existing fields
  debrisRemovalVehicles: DebrisRemovalVehicle[];  // NEW
  
  // Enhanced metrics
  cooperativeDebrisCount: number;  // NEW
  uncooperativeDebrisCount: number;  // NEW
  totalDebrisRemoved: number;  // NEW
  activeDRVs: number;  // NEW
  debrisRemovedHistory: number[];  // NEW
}

// New action types
type LaunchType = 'satellite' | 'debris-removal';

interface LaunchAction {
  type: LaunchType;  // MODIFIED
  orbit: OrbitLayer;
  insured?: boolean;  // Only for satellites
  drvType?: DRVType;  // Only for DRVs
}

// DRV Configuration
interface DRVConfig {
  costs: Record<OrbitLayer, Record<DRVType, number>>;
  capacity: Record<DRVType, [number, number]>;  // [min, max] per turn
  successRate: Record<DRVType, number>;
  duration: Record<DRVType, number>;  // Active turns
  failureDebrisMultiplier: number;  // Debris created on failure
}
```

### Configuration Constants

```typescript
const DRV_CONFIG: DRVConfig = {
  costs: {
    LEO: { cooperative: 4_000_000, uncooperative: 8_000_000 },
    MEO: { cooperative: 6_000_000, uncooperative: 12_000_000 },
    GEO: { cooperative: 10_000_000, uncooperative: 20_000_000 },
  },
  capacity: {
    cooperative: [2, 3],    // Remove 2-3 debris per turn
    uncooperative: [1, 2],  // Remove 1-2 debris per turn
  },
  successRate: {
    cooperative: 0.85,      // 85% success rate
    uncooperative: 0.60,    // 60% success rate
  },
  duration: {
    cooperative: 10,        // Active for 10 turns
    uncooperative: 8,       // Active for 8 turns
  },
  failureDebrisMultiplier: 2,  // Failed removal creates 2 debris
};

// Debris type distribution
const DEBRIS_TYPE_DISTRIBUTION = {
  cooperative: 0.70,      // 70% of debris is cooperative
  uncooperative: 0.30,    // 30% of debris is uncooperative
};
```

### New Redux Actions

```typescript
// Game actions
const gameActions = {
  // ... existing actions
  launchDebrisRemovalVehicle: (orbit: OrbitLayer, drvType: DRVType) => {},
  processDRVOperations: () => {},  // Execute debris removal
  ageDRVs: () => {},  // Increment DRV age
  decommissionExpiredDRVs: () => {},  // Remove expired DRVs
  updateDebrisStats: () => {},  // Track debris removal metrics
};
```

---

## UI Wireframes and Screens

### 1. Enhanced Control Panel

```
┌─────────────────────────────────────────────┐
│  LAUNCH CONTROLS                            │
├─────────────────────────────────────────────┤
│                                             │
│  Launch Type:                               │
│  ○ Satellite    ● Debris Removal Vehicle   │
│                                             │
│  Orbit Layer:                               │
│  ○ LEO    ○ MEO    ● GEO                    │
│                                             │
│  DRV Type:                                  │
│  ● Cooperative    ○ Uncooperative          │
│                                             │
│  Cost: $10,000,000                         │
│  Removes: 2-3 debris/turn (85% success)   │
│  Active: 10 turns                          │
│                                             │
│  ┌──────────────┐                          │
│  │ LAUNCH  DRV  │                          │
│  └──────────────┘                          │
│                                             │
│  Budget: $45,000,000                       │
└─────────────────────────────────────────────┘
```

### 2. Enhanced Status Display

```
┌─────────────────────────────────────────────┐
│  ORBITAL STATUS                             │
├─────────────────────────────────────────────┤
│                                             │
│  Active Satellites: 12                     │
│  Active DRVs: 3                            │
│                                             │
│  Total Debris: 156                         │
│    ├─ Cooperative: 109 (70%)              │
│    └─ Uncooperative: 47 (30%)             │
│                                             │
│  Debris Removed: 34                        │
│                                             │
│  Risk Level: 🟡 MEDIUM                     │
└─────────────────────────────────────────────┘
```

### 3. DRV Visualization on Orbit Display

```
Visual representation:
- Satellites: Circle with icon (GPS/Weather/Comms)
- DRVs: Pentagon/shield shape with distinct color
  - Cooperative: Blue/cyan
  - Uncooperative: Orange/red
- Debris: Small dots/particles
  - Cooperative: Gray dots
  - Uncooperative: Red dots
- Animation: DRVs show "capture effect" when removing debris
```

### 4. New Missions Panel Entries

```
┌─────────────────────────────────────────────┐
│  MISSIONS                                   │
├─────────────────────────────────────────────┤
│                                             │
│  ☐ Debris Cleaner                          │
│     Launch 2 debris removal vehicles       │
│                                             │
│  ☐ Clean Sweep                             │
│     Remove 50 debris pieces total          │
│                                             │
│  ☐ Risk Reduction                          │
│     Reduce debris from 200+ to below 100   │
│     using DRVs                              │
│                                             │
│  ✓ GPS Priority (COMPLETED)                │
└─────────────────────────────────────────────┘
```

### 5. Enhanced Charts

```
Add new chart to metrics visualization:

┌─────────────────────────────────────────────┐
│  DEBRIS REMOVAL OVER TIME                   │
├─────────────────────────────────────────────┤
│                                             │
│  Cumulative Debris Removed                 │
│   50 │                              ╱──    │
│      │                         ╱────       │
│   25 │                   ╱─────            │
│      │             ╱─────                  │
│    0 │─────────────                        │
│      └────────────────────────────────      │
│      0    25    50    75   100 (turns)    │
└─────────────────────────────────────────────┘
```

---

## New Missions

Add 5 new debris removal focused missions:

1. **Debris_Cleaner**: Launch 2 debris removal vehicles
2. **Clean_Sweep**: Remove 50 total debris pieces using DRVs
3. **Risk_Reduction**: Reduce debris from 200+ to below 100 using DRVs
4. **Cooperative_Focus**: Remove 30 cooperative debris
5. **Challenge_Mode**: Launch 1 uncooperative DRV and successfully remove 10 debris with it

These integrate with the existing mission system (13 original + 5 new = 18 total missions, still randomly select 3).

---

## Verification Approach

### Testing Strategy

#### Unit Tests
- **DRV creation**: Test DRV instantiation with correct properties
- **Debris removal logic**: Test removal calculations, success/failure rates
- **Debris type distribution**: Verify 70/30 split on collision debris creation
- **DRV aging and expiration**: Test lifecycle management
- **Cost calculations**: Verify DRV launch costs by type and orbit
- **Mission completion**: Test new debris removal mission logic

#### Integration Tests
- **Full turn with DRV**: Execute turn with active DRV, verify debris reduction
- **DRV and satellite interaction**: Test both entities coexisting
- **Budget constraints**: Test launching DRVs with insufficient funds
- **Multi-DRV scenarios**: Test multiple DRVs operating simultaneously
- **DRV expiration**: Test DRV becoming debris after max age

#### E2E Tests
- **Launch DRV flow**: Complete UI interaction to launch DRV
- **Debris removal gameplay**: Play through scenario focusing on debris cleanup
- **Mission completion**: Achieve new debris removal missions
- **Cost-benefit strategy**: Test economic viability of DRVs vs prevention

### Manual Verification Steps

1. **Launch cooperative DRV** into each orbit and verify debris removal
2. **Launch uncooperative DRV** and verify higher failure rate
3. **Test cost validation** by attempting to launch DRV without budget
4. **Verify DRV expiration** and conversion to debris
5. **Complete new missions** focused on debris removal
6. **Test visualization** of DRVs on orbit display
7. **Verify metrics** showing debris removed over time
8. **Test edge cases**: Max DRVs, zero debris, all debris removed
9. **Verify debris type distribution** after collisions
10. **Test strategic gameplay** balancing satellites vs DRVs

### Success Criteria

- ✅ DRVs launch and remove debris correctly
- ✅ Debris types (cooperative/uncooperative) tracked accurately
- ✅ DRV costs balanced and economically viable
- ✅ New missions achievable and correctly validated
- ✅ UI clearly shows DRV options and status
- ✅ Visualization distinguishes DRVs from satellites
- ✅ All unit tests pass
- ✅ No TypeScript errors
- ✅ Game remains balanced and playable
- ✅ Performance unaffected with DRVs active

---

## Specification Wireframe Updates Summary

**New Screens/Panels**:
1. Enhanced Control Panel with DRV launch options
2. DRV configuration selector
3. Debris type breakdown in status panel
4. DRV visualization sprites on orbit display
5. Debris removal metrics chart
6. Updated mission panel with new missions

**UI Modifications**:
- Add launch type selector (satellite vs DRV)
- Add DRV type selector (cooperative vs uncooperative)
- Update cost display to show DRV pricing
- Add DRV stats to status panel
- Add debris type breakdown visualization
- Update charts to show debris removal trends

---

## Risk Assessment

### Technical Risks

1. **Game balance disruption**
   - **Mitigation**: Conservative pricing (2-4x satellite cost), limited effectiveness

2. **Performance with additional entities**
   - **Mitigation**: DRVs reuse existing satellite rendering patterns, limited max count

3. **UI complexity increase**
   - **Mitigation**: Clear tabbed/radio interface, progressive disclosure

### Game Design Risks

1. **DRVs too powerful**
   - **Mitigation**: High cost, limited capacity, failure rate, time limit

2. **DRVs too weak/never used**
   - **Mitigation**: Missions requiring DRVs, late-game debris cleanup necessity

---

## Implementation Complexity Breakdown

**Easy** (1-2 hours each):
- Add DebrisType to Debris interface
- Create DRV TypeScript types
- Add DRV constants configuration

**Medium** (3-5 hours each):
- Implement debris type distribution on collision
- Create debris removal logic
- Build DRV UI components
- Add DRV visualization sprites
- Update control panel with launch selector

**Complex** (6-8 hours each):
- Integrate DRV operations into turn execution
- Implement new mission checks
- Create debris removal metrics tracking
- Build comprehensive unit tests

**Total Estimated Time**: 2-3 days for full implementation

---

**Specification Created**: December 18, 2025  
**Task**: Add Debris Removal Feature  
**Builds On**: Original Kessler Simulation spec (spec.md)  
**Recommended**: Proceed with implementation following incremental approach
