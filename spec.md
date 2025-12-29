# Technical Specification: Kessler Simulation React Game

## Task Difficulty Assessment

**Complexity Level**: **HARD**

**Reasoning**:
- Complex game state with multiple interdependent systems
- Real-time collision detection with O(n²) complexity
- Multiple game mechanics (budget, insurance, missions, events)
- Turn-based logic with cascading effects
- Requires sophisticated state management
- Performance optimization needed for 100+ objects
- Rich UI/UX requirements

---

## Technical Context

### Source Material
- **File**: `kessler.ipynb` (Jupyter notebook, 997 lines)
- **Language**: Python (numpy, matplotlib, ipywidgets)
- **Primary Game Cell**: #4a (lines 498-802)
- **Game Type**: Turn-based strategy simulation

### Target Technology Stack

#### Core
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **State Management**: Redux Toolkit or Zustand
- **Build Tool**: Vite

#### Visualization
- **2D Graphics**: HTML5 Canvas API or Konva.js
- **Charts**: Recharts or Victory
- **Animations**: Framer Motion

#### Supporting Libraries
- **Random Number Generation**: seedrandom (for deterministic gameplay)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Styling**: Tailwind CSS

### Dependencies
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.6.0",
  "@reduxjs/toolkit": "^2.5.0",
  "react-redux": "^9.2.0",
  "framer-motion": "^11.15.0",
  "recharts": "^2.15.0",
  "seedrandom": "^3.0.5"
}
```

---

## Implementation Approach

### Architecture Pattern

**Model-View-Controller (MVC) with Unidirectional Data Flow**

```
User Action → Dispatcher → Reducers → State Update → Component Re-render → UI Update
```

### State Management Strategy

Use Redux Toolkit with the following slice structure:

1. **gameSlice** - Core game state (satellites, debris, step counter)
2. **economySlice** - Budget, costs, insurance tracking
3. **missionsSlice** - Mission definitions, progress, completion
4. **metricsSlice** - Historical data, charts, statistics
5. **uiSlice** - UI state (selected orbit, view mode, modals)

### Core Game Loop

**Turn Execution Flow**:
```
1. Player makes launch decision (satellite OR debris removal vehicle)
2. Validate budget availability
3. Create satellite/DRV if affordable
4. Age all satellites (increment age counter)
5. Age all DRVs (increment age counter)
6. Execute DRV debris removal operations
7. Remove expired LEO satellites
8. Decommission expired DRVs (convert to debris)
9. Detect collisions (O(n²) within each layer)
10. Resolve collisions (create debris with types, destroy satellites)
11. Process insurance payouts
12. Trigger random events (solar storms)
13. Update metrics and risk level
14. Update debris type statistics
15. Check mission completion
16. Check end game conditions
17. Advance step counter
```

### Collision Detection Algorithm

**Optimization**: Spatial partitioning by orbital layer

```typescript
function detectCollisions(satellites: Satellite[]): Collision[] {
  const collisions: Collision[] = [];
  const byLayer = groupByLayer(satellites);
  
  for (const layer of ['LEO', 'MEO', 'GEO']) {
    const sats = byLayer[layer] || [];
    const threshold = COLLISION_THRESHOLDS[layer];
    
    for (let i = 0; i < sats.length; i++) {
      for (let j = i + 1; j < sats.length; j++) {
        const distance = calculateDistance(sats[i], sats[j]);
        if (distance < threshold) {
          collisions.push({ sat1: sats[i], sat2: sats[j], layer });
        }
      }
    }
  }
  
  return collisions;
}
```

**Complexity**: O(n²) worst case, O(n²/3) average case with layer partitioning

---

## Source Code Structure

### New Files to Create

```
src/
├── main.tsx                          # App entry point
├── App.tsx                           # Root component
├── store/
│   ├── index.ts                      # Store configuration
│   ├── slices/
│   │   ├── gameSlice.ts              # Core game state
│   │   ├── economySlice.ts           # Budget & costs
│   │   ├── missionsSlice.ts          # Missions system
│   │   ├── metricsSlice.ts           # Historical data
│   │   └── uiSlice.ts                # UI state
│   └── hooks.ts                      # Typed hooks
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx             # Main game visualization
│   │   ├── OrbitVisualization.tsx    # Canvas rendering
│   │   ├── SatelliteSprite.tsx       # Satellite rendering
│   │   ├── DRVSprite.tsx             # DRV rendering
│   │   └── DebrisParticle.tsx        # Debris rendering (with type variants)
│   ├── ControlPanel/
│   │   ├── ControlPanel.tsx          # Launch controls
│   │   ├── LaunchSelector.tsx        # Satellite vs DRV selector
│   │   ├── OrbitSelector.tsx         # LEO/MEO/GEO buttons
│   │   ├── DRVConfiguration.tsx      # Cooperative vs Uncooperative DRV
│   │   ├── InsuranceToggle.tsx       # Insurance checkbox
│   │   └── StatusDisplay.tsx         # Metrics display (including DRVs)
│   ├── StatsPanel/
│   │   ├── StatsPanel.tsx            # Overall stats container
│   │   └── DebrisBreakdown.tsx       # Cooperative vs Uncooperative debris
│   ├── MissionPanel/
│   │   ├── MissionPanel.tsx          # Mission list
│   │   ├── MissionCard.tsx           # Individual mission
│   │   └── MissionProgress.tsx       # Progress indicator
│   ├── Charts/
│   │   ├── DebrisChart.tsx           # Debris over time
│   │   ├── SatelliteChart.tsx        # Satellites over time
│   │   └── DebrisRemovalChart.tsx    # Debris removed over time
│   └── EventLog/
│       ├── EventLog.tsx              # Game events display
│       └── EventItem.tsx             # Single event entry
├── game/
│   ├── engine/
│   │   ├── collision.ts              # Collision detection (with debris typing)
│   │   ├── simulation.ts             # Turn processing (with DRV operations)
│   │   ├── debrisRemoval.ts          # DRV debris removal logic
│   │   ├── events.ts                 # Random events
│   │   └── missions.ts               # Mission logic (including DRV missions)
│   ├── constants.ts                  # Game configuration (including DRV costs)
│   ├── types.ts                      # TypeScript types (including DRV types)
│   └── utils.ts                      # Helper functions
├── hooks/
│   ├── useGameLoop.ts                # Game loop hook
│   ├── useCollisionDetection.ts      # Collision hook
│   └── useMissionCheck.ts            # Mission checking
└── assets/
    ├── sounds/
    │   ├── launch.mp3
    │   ├── collision.mp3
    │   └── alert.mp3
    └── images/
        ├── satellite-gps.svg
        ├── satellite-comms.svg
        └── satellite-weather.svg
```

### Configuration Files

```
.
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite config
├── tailwind.config.js                # Tailwind CSS
├── .eslintrc.json                    # ESLint rules
└── vitest.config.ts                  # Test config
```

---

## Data Model / API / Interface Changes

### Core TypeScript Types

```typescript
// Game constants
type OrbitLayer = 'LEO' | 'MEO' | 'GEO';
type SatelliteType = 'Weather' | 'Comms' | 'GPS';
type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';
type MissionId = string;
type DebrisType = 'cooperative' | 'uncooperative';
type DRVType = 'cooperative' | 'uncooperative';

// Core entities
interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insured: boolean;
}

interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;  // cooperative (70%) or uncooperative (30%)
}

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

interface Mission {
  id: MissionId;
  name: string;
  description: string;
  check: (state: GameState) => boolean;
  completed: boolean;
}

// Game state
interface GameState {
  // Simulation
  step: number;
  maxSteps: number;
  gameOver: boolean;
  
  // Assets
  satellites: Satellite[];
  debris: Debris[];
  debrisRemovalVehicles: DebrisRemovalVehicle[];
  
  // Economy
  budget: number;
  
  // Missions
  activeMissions: Mission[];
  completedMissions: MissionId[];
  
  // Metrics
  debrisHistory: number[];
  satelliteHistory: number[];
  cooperativeDebrisCount: number;
  uncooperativeDebrisCount: number;
  totalDebrisRemoved: number;
  activeDRVs: number;
  debrisRemovedHistory: number[];
  
  // Trackers
  gpsLaunched: number;
  riskStreak: number;
  insurancePayouts: number;
  expiredLeoSats: number;
  cascadeTriggered: boolean;
  launchHistory: (OrbitLayer | 'none')[];
  launchedLayers: Set<OrbitLayer>;
  purposeCounts: Record<SatelliteType, number>;
}

// Actions
type LaunchType = 'satellite' | 'debris-removal';

interface LaunchAction {
  type: LaunchType;
  orbit: OrbitLayer;
  insured?: boolean;  // Only for satellites
  drvType?: DRVType;  // Only for debris removal vehicles
}

interface CollisionResult {
  destroyedSatellites: string[];
  newDebris: Debris[];
  cascadeTriggered: boolean;
}

// Configuration
interface GameConfig {
  collisionThresholds: Record<OrbitLayer, number>;
  layerBounds: Record<OrbitLayer, [number, number]>;
  launchCosts: Record<OrbitLayer, number>;
  insuranceCost: number;
  insuranceRefund: number;
  startingBudget: number;
  debrisPerCollision: number;
  maxDebrisLimit: number;
  maxSteps: number;
  leoLifetime: number;
  solarActivityChance: number;
  debrisDecayRate: number;
  cascadeThreshold: number;
  
  // Satellite Revenue / Budget Difficulty configuration
  budgetDifficulty: BudgetDifficulty;
  incomeAmount: number;      // Revenue received per income interval
  incomeInterval: number;    // Turns between income payments (0 = no income)
  drainAmount: number;       // Budget drained per turn (0 = no drain)
  
  // Debris Removal Vehicle configuration
  drvCosts: Record<OrbitLayer, Record<DRVType, number>>;
  drvCapacity: Record<DRVType, [number, number]>;  // [min, max] per turn
  drvSuccessRate: Record<DRVType, number>;
  drvDuration: Record<DRVType, number>;  // Active turns
  drvFailureDebrisMultiplier: number;  // Debris created on failure
  debrisTypeDistribution: Record<DebrisType, number>;  // 70% cooperative, 30% uncooperative
}

// Debris Removal Vehicle Configuration Constants
const DRV_CONFIG = {
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

// Debris type distribution (on collision)
const DEBRIS_TYPE_DISTRIBUTION = {
  cooperative: 0.70,      // 70% of debris is cooperative
  uncooperative: 0.30,    // 30% of debris is uncooperative
};

// Satellite Revenue / Budget Difficulty Configuration
type BudgetDifficulty = 'easy' | 'normal' | 'hard' | 'challenge';

const BUDGET_DIFFICULTY_CONFIG: Record<BudgetDifficulty, {
  startingBudget: number;
  incomeAmount: number;
  incomeInterval: number;  // Turns between income (0 = no income)
  drainAmount: number;     // Per-turn budget drain (0 = no drain)
  label: string;
  description: string;
}> = {
  easy: {
    startingBudget: 300_000_000,  // $300M starting budget
    incomeAmount: 10_000_000,     // $10M revenue per income
    incomeInterval: 10,            // Income every 10 turns
    drainAmount: 0,                // No budget drain
    label: 'Easy',
    description: 'Generous budget with regular income - ideal for learning',
  },
  normal: {
    startingBudget: 200_000_000,  // $200M starting budget
    incomeAmount: 5_000_000,      // $5M revenue per income
    incomeInterval: 20,            // Income every 20 turns
    drainAmount: 0,                // No budget drain
    label: 'Normal',
    description: 'Balanced challenge requiring strategic resource management',
  },
  hard: {
    startingBudget: 150_000_000,  // $150M starting budget
    incomeAmount: 0,               // No revenue
    incomeInterval: 0,             // No income
    drainAmount: 0,                // No budget drain
    label: 'Hard',
    description: 'Limited budget with no income - every launch must count',
  },
  challenge: {
    startingBudget: 100_000_000,  // $100M starting budget
    incomeAmount: 0,               // No revenue
    incomeInterval: 0,             // No income
    drainAmount: 2_000_000,        // $2M drain per turn
    label: 'Challenge',
    description: 'Tight budget with continuous drain - race against bankruptcy',
  },
};
```

### Redux Actions

```typescript
// Game actions
const gameActions = {
  launchSatellite: (orbit: OrbitLayer, insured: boolean) => {},
  launchDebrisRemovalVehicle: (orbit: OrbitLayer, drvType: DRVType) => {},
  skipTurn: () => {},
  ageSatellites: () => {},
  ageDRVs: () => {},
  processDRVOperations: () => {},
  decommissionExpiredDRVs: () => {},
  processCollisions: () => {},
  triggerSolarEvent: () => {},
  updateMetrics: () => {},
  updateDebrisStats: () => {},
  checkMissions: () => {},
  endGame: () => {},
  resetGame: () => {},
};

// UI actions
const uiActions = {
  selectOrbit: (orbit: OrbitLayer | null) => {},
  toggleInsurance: () => {},
  setViewMode: (mode: '2D' | '3D') => {},
  toggleEventLog: () => {},
  openMissionDetails: (missionId: MissionId) => {},
};
```

### API Contracts

No external API calls required. All game logic runs client-side.

---

## Verification Approach

### Testing Strategy

#### Unit Tests
- **Collision detection**: Test all edge cases (same layer, different layers, exact threshold)
- **Position generation**: Verify positions within layer bounds
- **Budget calculations**: Test launch costs, insurance, payouts
- **Mission logic**: Test each mission's completion condition
- **Satellite aging**: Test expiration timing

#### Integration Tests
- **Full turn simulation**: Execute complete turn and verify state changes
- **Multi-turn scenarios**: Test cascading effects over multiple turns
- **Mission completion paths**: Verify mission unlock and completion
- **Edge cases**: Zero budget, max debris, all satellites destroyed

#### E2E Tests
- **Complete game playthrough**: Start to finish simulation
- **UI interactions**: Button clicks, orbit selection, insurance toggle
- **Save/load**: Persist and restore game state

### Manual Verification Steps

1. **Launch satellites** into each orbit (LEO, MEO, GEO)
2. **Verify collision detection** by launching multiple satellites in same orbit
3. **Test insurance system** by insuring satellites and observing payouts
4. **Trigger solar event** and verify debris reduction
5. **Complete missions** and verify checkmark display
6. **Reach max debris** and verify game end
7. **Test budget constraints** by attempting to launch without funds
8. **Verify LEO expiration** after 20 turns
9. **Check charts update** with each turn
10. **Test responsive layout** on different screen sizes

### Lint and Type Check Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm run test
npm run test:coverage

# Build verification
npm run build
npm run preview
```

### Success Criteria

- ✅ All unit tests pass
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Code coverage >80%
- ✅ Build completes without errors
- ✅ Game playable start to finish
- ✅ All missions achievable
- ✅ UI responsive on mobile and desktop
- ✅ Performance: 60fps with 100+ objects

---

## Satellite Revenue Economics

The game implements a **difficulty-based revenue system** where income generation varies based on the chosen difficulty level. Unlike individual satellite revenue, the game provides periodic budget income that represents aggregate satellite operations revenue.

### Revenue Model by Difficulty

#### Easy Mode
- **Starting Budget**: $300M
- **Revenue**: $10M every 10 turns
- **Expected Income**: ~$100M over 100 turns
- **Strategy**: Aggressive expansion possible, can afford multiple GEO satellites and DRVs
- **Use Case**: Learning the game mechanics without budget pressure

#### Normal Mode (Recommended)
- **Starting Budget**: $200M
- **Revenue**: $5M every 20 turns
- **Expected Income**: ~$25M over 100 turns
- **Strategy**: Balanced approach required, must plan expensive launches around income timing
- **Use Case**: Standard gameplay experience with meaningful resource decisions

#### Hard Mode
- **Starting Budget**: $150M
- **Revenue**: None
- **Expected Income**: $0
- **Strategy**: Every launch must be justified, insurance becomes critical, focus on high-value missions
- **Use Case**: Expert players who want to optimize every decision

#### Challenge Mode
- **Starting Budget**: $100M
- **Revenue**: None
- **Budget Drain**: -$2M per turn
- **Total Drain**: -$200M over 100 turns (if game lasts that long)
- **Strategy**: Speed-run approach, complete high-scoring missions quickly, avoid prolonged gameplay
- **Use Case**: Time-based challenge for experienced players

### Economic Strategy Implications

**Income Timing (Easy/Normal)**:
- Plan expensive launches (GEO satellites $5M, DRVs $4M-$17.5M) immediately after receiving income
- Track turns until next income payment in the UI
- Build a reserve budget for emergency DRV deployments during debris crises

**No-Income Strategy (Hard/Challenge)**:
- Prioritize missions with highest score-to-cost ratios
- Insurance becomes more valuable as you cannot afford satellite losses
- Focus on LEO satellites ($2M) to maximize satellite count
- Deploy DRVs only when absolutely necessary to prevent cascades
- In Challenge mode, aim to complete the game before turn 50 to minimize drain impact

**Budget Tracking**:
- Display current budget prominently
- Show "Next Income" countdown on Easy/Normal difficulties
- Warning indicators when budget drops below critical thresholds ($20M, $10M, $5M)
- Projected budget graph showing income vs. expenditure trends

---

## UI Wireframes and Screens

### 1. Enhanced Control Panel with Debris Removal

```
┌─────────────────────────────────────────────┐
│  LAUNCH CONTROLS                            │
├─────────────────────────────────────────────┤
│                                             │
│  Launch Type:                               │
│  ● Satellite    ○ Debris Removal Vehicle   │
│                                             │
│  Orbit Layer:                               │
│  ○ LEO    ● MEO    ○ GEO                    │
│                                             │
│  Insurance: ☑                               │
│  Cost: $3,000,000 + $500,000 insurance     │
│                                             │
│  ┌──────────────┐                          │
│  │    LAUNCH    │                          │
│  └──────────────┘                          │
│                                             │
│  Budget: $45,000,000                       │
└─────────────────────────────────────────────┘
```

### 2. DRV Launch Configuration

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

### 3. Enhanced Status Display with Debris Types

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
│                                             │
│  Step: 25 / 100                            │
└─────────────────────────────────────────────┘
```

### 4. DRV Visualization on Orbit Display

**Visual Representation**:

```
Orbital Display Key:
┌─────────────────────────────────────────────┐
│                                             │
│   ⬤  Satellites (GPS/Weather/Comms)        │
│   ⬟  DRVs (Pentagon/Shield shape)          │
│      - Cooperative: Blue/Cyan              │
│      - Uncooperative: Orange/Red           │
│   ·  Debris                                │
│      - Cooperative: Gray dots              │
│      - Uncooperative: Red dots             │
│                                             │
│   Animation: DRVs show "capture effect"    │
│              when removing debris           │
│                                             │
└─────────────────────────────────────────────┘
```

**Orbital Layout Example**:
```
       GEO (outer ring)
         ⬟ ·· ⬤ · ⬟
      
       MEO (middle ring)
       ⬤ · ⬟ ·· ⬤ ··
      
       LEO (inner ring)
      ⬤ ··· ⬟ · ⬤ ·
      
      🌍 Earth
```

### 5. Enhanced Charts - Debris Removal Tracking

```
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

### 6. Mission Panel with Debris Removal Missions

```
┌─────────────────────────────────────────────┐
│  MISSIONS                                   │
├─────────────────────────────────────────────┤
│                                             │
│  ☐ Debris Cleaner                          │
│     Launch 2 debris removal vehicles       │
│     Progress: 1/2                          │
│                                             │
│  ☐ Clean Sweep                             │
│     Remove 50 debris pieces total          │
│     Progress: 34/50                        │
│                                             │
│  ☐ Risk Reduction                          │
│     Reduce debris from 200+ to below 100   │
│     Progress: 156/200 → < 100              │
│                                             │
│  ✓ GPS Priority (COMPLETED)                │
│                                             │
│  ✓ Multi-Layer Network (COMPLETED)         │
└─────────────────────────────────────────────┘
```

### 7. Debris Type Breakdown Visualization

```
┌─────────────────────────────────────────────┐
│  DEBRIS BREAKDOWN                           │
├─────────────────────────────────────────────┤
│                                             │
│      Cooperative: 109 (70%)                │
│      ┌──────────────────────────┐          │
│      │████████████████████████  │          │
│      └──────────────────────────┘          │
│                                             │
│      Uncooperative: 47 (30%)               │
│      ┌──────────────────────────┐          │
│      │██████████                │          │
│      └──────────────────────────┘          │
│                                             │
│  Pie Chart:                                │
│       ╭─────╮                              │
│      ╱       ╲                             │
│     │  70%    │30%                         │
│      ╲       ╱                             │
│       ╰─────╯                              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Game Missions

The game includes 18 missions total (13 original + 5 new debris removal missions). At game start, 3 missions are randomly selected for the player to complete.

### Original Missions (13)

1. **GPS_Priority**: Launch 3 GPS satellites
2. **Weather_Watch**: Launch 2 weather satellites
3. **Comms_Network**: Launch 3 communications satellites
4. **Multi_Layer**: Launch satellites in all three orbital layers
5. **Insurance_Master**: Insure 5 satellites
6. **Budget_Management**: Maintain budget above $20M for 10 turns
7. **Risk_Avoidance**: Keep debris count below 50 for 20 turns
8. **Survivor**: Have 10 satellites active simultaneously
9. **Diverse_Portfolio**: Launch 2 of each satellite type
10. **LEO_Expert**: Launch 5 LEO satellites
11. **GEO_Master**: Launch 3 GEO satellites
12. **Cascade_Prevention**: Reach 30 turns without triggering cascade
13. **Long_Term**: Survive 50 turns

### New Debris Removal Missions (5)

14. **Debris_Cleaner**: Launch 2 debris removal vehicles (any type)
15. **Clean_Sweep**: Remove 50 total debris pieces using DRVs
16. **Risk_Reduction**: Reduce debris from 200+ to below 100 using DRVs within 10 turns
17. **Cooperative_Focus**: Remove 30 cooperative debris pieces
18. **Challenge_Mode**: Launch 1 uncooperative DRV and successfully remove 10 debris with it

These missions integrate seamlessly with the existing mission system and provide strategic objectives that encourage players to use debris removal vehicles as part of their overall strategy.

---

## Implementation Plan

Given the **HARD** complexity, breaking down into concrete milestones:

### Milestone 1: Core Game Engine (1-2 weeks)
**Files**: `game/engine/`, `store/slices/gameSlice.ts`, `game/types.ts`

**Tasks**:
- [ ] Set up TypeScript types and interfaces (including DRV and DebrisType)
- [ ] Implement position generation
- [ ] Implement collision detection algorithm (with debris typing)
- [ ] Create game state reducer (including DRVs)
- [ ] Implement debris removal logic (DRV operations)
- [ ] Write unit tests for collision detection
- [ ] Write unit tests for debris removal mechanics
- [ ] Implement turn processing logic (with DRV processing)

**Verification**: Unit tests pass, can simulate turns with DRVs programmatically

---

### Milestone 2: Economic System (3-4 days)
**Files**: `store/slices/economySlice.ts`, `game/engine/simulation.ts`

**Tasks**:
- [ ] Implement budget tracking
- [ ] Add launch cost deduction (satellites and DRVs)
- [ ] Implement insurance system (purchase + payout)
- [ ] Add DRV cost configuration and validation
- [ ] Add budget validation (for both satellites and DRVs)
- [ ] Write tests for economic calculations (including DRV costs)

**Verification**: Can launch satellites and DRVs with budget constraints, insurance payouts work

---

### Milestone 3: Basic Visualization (1 week)
**Files**: `components/GameBoard/`, `components/ControlPanel/`, `components/StatsPanel/`

**Tasks**:
- [ ] Create Canvas-based orbital visualization
- [ ] Render concentric orbit circles
- [ ] Display satellites as sprites
- [ ] Display DRVs as pentagon/shield sprites (with color coding)
- [ ] Display debris as particles (with type variants: gray/red)
- [ ] Add launch type selector (satellite vs DRV)
- [ ] Add orbit selector buttons
- [ ] Add DRV configuration selector
- [ ] Add turn advance button
- [ ] Display budget and metrics (including DRV stats)
- [ ] Add debris type breakdown visualization

**Verification**: Visual game playable with basic UI, can launch both satellites and DRVs

---

### Milestone 4: Mission System (4-5 days)
**Files**: `store/slices/missionsSlice.ts`, `game/engine/missions.ts`, `components/MissionPanel/`

**Tasks**:
- [ ] Implement all 13 original mission checks
- [ ] Implement 5 new debris removal mission checks
- [ ] Create mission selection logic (random 3 from pool of 18)
- [ ] Build mission display UI
- [ ] Add mission progress tracking (including DRV-related progress)
- [ ] Write tests for mission completion (including new missions)
- [ ] Display mission status in UI

**Verification**: All 18 missions can be completed and tracked

---

### Milestone 5: Random Events & Polish (3-4 days)
**Files**: `game/engine/events.ts`, `components/EventLog/`

**Tasks**:
- [ ] Implement solar storm event
- [ ] Add cascade detection
- [ ] Create event log component
- [ ] Add collision animations
- [ ] Implement sound effects
- [ ] Add risk level indicators

**Verification**: Events trigger correctly, UI feedback clear

---

### Milestone 6: Data Visualization (3-4 days)
**Files**: `components/Charts/`, `store/slices/metricsSlice.ts`

**Tasks**:
- [ ] Implement debris time series chart
- [ ] Implement satellite count chart
- [ ] Implement debris removal over time chart
- [ ] Add debris type breakdown chart/visualization
- [ ] Add real-time chart updates
- [ ] Display risk trend indicator
- [ ] Show budget projection

**Verification**: Charts display correctly and update each turn, debris removal tracking visible

---

### Milestone 7: Game Flow & UX (4-5 days)
**Files**: `App.tsx`, `components/`, `hooks/`

**Tasks**:
- [ ] Add game start screen
- [ ] Implement game over screen with score
- [ ] Add tutorial/instructions modal
- [ ] Implement save/load state
- [ ] Add undo last turn
- [ ] Polish animations and transitions
- [ ] Add responsive layout

**Verification**: Complete game flow from start to end

---

### Milestone 8: Testing & Optimization (3-4 days)
**Files**: All test files, performance optimizations

**Tasks**:
- [ ] Write integration tests
- [ ] Add E2E tests
- [ ] Performance profiling
- [ ] Optimize collision detection
- [ ] Add Web Worker for physics
- [ ] Final bug fixes
- [ ] Cross-browser testing

**Verification**: All tests pass, performance benchmarks met

---

## Estimated Timeline

**Total**: 6-8 weeks for fully-featured game

**Breakdown**:
- Core Engine: 1-2 weeks
- Economic System: 3-4 days
- Basic Visualization: 1 week
- Mission System: 4-5 days
- Events & Polish: 3-4 days
- Data Visualization: 3-4 days
- Game Flow & UX: 4-5 days
- Testing & Optimization: 3-4 days

---

## Risk Assessment

### Technical Risks

1. **Performance with 100+ objects**
   - **Mitigation**: Spatial partitioning, Web Workers, RAF optimization

2. **Mobile responsiveness**
   - **Mitigation**: Touch-optimized controls, responsive breakpoints

3. **Game balance**
   - **Mitigation**: Playtesting, adjustable difficulty constants

4. **Browser compatibility**
   - **Mitigation**: Canvas API widely supported, polyfills if needed

### Project Risks

1. **Scope creep**
   - **Mitigation**: Stick to milestones, defer nice-to-haves

2. **Time estimation**
   - **Mitigation**: Buffer time in estimates, prioritize MVP

---

## Success Metrics

- ✅ Game is playable and engaging
- ✅ All 18 missions achievable (13 original + 5 debris removal)
- ✅ DRVs function correctly and provide strategic value
- ✅ Debris removal mechanics balanced and intuitive
- ✅ Debris types (cooperative/uncooperative) tracked accurately
- ✅ Performance >60fps (with satellites and DRVs)
- ✅ Mobile responsive
- ✅ Code coverage >80%
- ✅ Zero critical bugs
- ✅ Positive playtester feedback

---

**Specification Created**: December 18, 2025  
**Source**: kessler.ipynb (Cell #4a)  
**Recommended**: Proceed with implementation following milestone plan
