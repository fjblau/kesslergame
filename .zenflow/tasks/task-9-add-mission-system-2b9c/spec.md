# Technical Specification: Mission System

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Requires new Redux slice with moderate state complexity
- Mission progress tracking logic needs integration with existing game state
- Random mission selection at game start
- 13 predefined missions with varying completion criteria
- UI components following existing patterns (StatsPanel, Charts)
- Progress bar and visual feedback implementation
- No complex algorithms, mostly state tracking and UI rendering

---

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Existing Codebase Architecture
- **Store Structure**: 
  - `gameSlice` - Core game state (satellites, debris, DRVs, budget, history)
  - `uiSlice` - UI preferences (game speed, auto-pause settings)
- **Component Patterns**: 
  - Panel components (StatsPanel, ControlPanel) use dark theme with slate colors
  - Tabs component handles navigation between Launch, Analytics, and Documentation
  - Consistent typography with uppercase headers, tracking-wide, and blue accents
- **Color Scheme**:
  - Background: `bg-slate-800`
  - Borders: `border-slate-700`
  - Text: blue accents (`text-blue-300`, `text-blue-400`)
  - Success: green (`text-green-400`, `text-green-500`)
  - Warning: yellow (`text-yellow-400`)
  - Critical: red (`text-red-400`)

---

## Mission Definitions

### 13 Available Missions

Missions are categorized by tracking type:

#### 1. Launch Count Missions
- **GPS Priority**: Launch 3 GPS satellites by turn 20
- **Weather Network**: Launch 4 Weather satellites by turn 30
- **Communications Hub**: Launch 5 Comms satellites by turn 40
- **Debris Response Team**: Launch 3 debris removal vehicles by turn 25

#### 2. Removal/Cleanup Missions
- **Debris Cleaner**: Launch 2 debris removal vehicles (any turn)
- **Clean Sweep**: Remove 50 debris pieces total by turn 50
- **Orbital Hygiene**: Remove 100 debris pieces total by turn 80

#### 3. State Threshold Missions
- **Risk Reduction**: Reduce debris count from 200+ to below 100 (at any point)
- **Safe Skies**: Maintain LOW risk level for 10 consecutive turns
- **Satellite Fleet**: Have 15+ active satellites at once

#### 4. Multi-Layer Missions
- **Multi-Layer Network**: Launch satellites in all three orbital layers (LEO, MEO, GEO)
- **Full Coverage**: Have at least 2 satellites in each orbital layer simultaneously

#### 5. Economic Missions
- **Budget Mastery**: Maintain budget above 50M for 15 consecutive turns

### Mission Data Structure

```typescript
export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  category: 'launch' | 'removal' | 'state' | 'multi-layer' | 'economic';
  
  // Completion criteria
  target: number;
  currentProgress: number;
  turnLimit?: number; // undefined means no time limit
  
  // Tracking type
  trackingType: 'cumulative' | 'threshold' | 'consecutive' | 'snapshot' | 'boolean';
  
  // For threshold missions (e.g., "reduce from X to below Y")
  startThreshold?: number;
  
  // Status
  completed: boolean;
  completedAt?: number; // turn number when completed
}

export interface MissionsState {
  availableMissions: MissionDefinition[]; // All 13 missions
  activeMissions: MissionDefinition[]; // 3 randomly selected at game start
  trackingData: {
    consecutiveLowRiskTurns: number;
    consecutiveBudgetAbove50M: number;
    hasReachedDebris200: boolean; // for Risk Reduction mission
    layersWithSatellites: Set<OrbitLayer>; // for Multi-Layer Network
  };
}
```

---

## Implementation Approach

### 1. Mission Definitions (`src/game/missions.ts`)

**Purpose**: Centralized mission configuration

```typescript
export const MISSION_DEFINITIONS: Omit<MissionDefinition, 'currentProgress' | 'completed' | 'completedAt'>[] = [
  {
    id: 'gps-priority',
    title: 'GPS Priority',
    description: 'Launch 3 GPS satellites by turn 20',
    category: 'launch',
    target: 3,
    turnLimit: 20,
    trackingType: 'cumulative',
  },
  // ... 12 more missions
];

export function selectRandomMissions(count: number = 3): MissionDefinition[] {
  // Shuffle and select 3 missions
  // Initialize with currentProgress: 0, completed: false
}

export function createMissionTrackingData(): MissionsState['trackingData'] {
  // Initialize tracking data structure
}
```

### 2. Redux Slice (`src/store/slices/missionsSlice.ts`)

**Purpose**: State management for mission progress

```typescript
// Key reducers:
- initializeMissions(state, action: PayloadAction<number>) 
  // Select 3 random missions, reset tracking data

- updateMissionProgress(state, action: PayloadAction<GameState>)
  // Called each turn, updates all active mission progress
  // Checks completion criteria
  // Updates tracking data (consecutive counters, thresholds, etc.)

- checkMissionCompletion(state)
  // Mark missions as completed when criteria met
  // Record completion turn

// Selectors:
- selectActiveMissions
- selectCompletedMissions  
- selectIncompleteMissions
- selectMissionById
```

**Progress Tracking Logic**:

The `updateMissionProgress` reducer will:
1. Receive current `GameState` as payload
2. For each active mission, update `currentProgress` based on:
   - **Cumulative**: Count satellites by type, total debris removed
   - **Threshold**: Check if value crossed threshold
   - **Consecutive**: Increment/reset counter based on condition
   - **Snapshot**: Check current state (e.g., satellite count >= 15)
   - **Boolean**: Check if condition ever met (e.g., has satellites in all layers)
3. Check `turnLimit` if specified
4. Mark as `completed` when criteria met

### 3. Mission Panel Component (`src/components/MissionPanel/MissionPanel.tsx`)

**Purpose**: Container for mission cards

```typescript
export function MissionPanel() {
  const missions = useAppSelector(selectActiveMissions);
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-300 mb-5 pb-3 border-b-2 border-slate-700 uppercase tracking-wide">
          Missions
        </h2>
        <div className="space-y-4">
          {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Styling**: Match StatsPanel design with dark slate background, blue headers, border styling

### 4. Mission Card Component (`src/components/MissionPanel/MissionCard.tsx`)

**Purpose**: Individual mission display with progress

```typescript
interface MissionCardProps {
  mission: MissionDefinition;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { title, description, currentProgress, target, completed, turnLimit } = mission;
  const progressPercent = Math.min((currentProgress / target) * 100, 100);
  const currentTurn = useAppSelector(state => state.game.step);
  
  // Determine border color: yellow (in-progress), green (completed)
  const borderColor = completed ? 'border-green-500' : 'border-yellow-400';
  
  return (
    <div className={`bg-slate-700 border-l-4 ${borderColor} rounded-lg p-4 transition-all hover:translate-x-1`}>
      {/* Checkbox + Title */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-sm ${
          completed 
            ? 'bg-green-500 border-green-500 text-slate-800' 
            : 'border-gray-500 text-gray-500'
        }`}>
          {completed ? '✓' : '☐'}
        </div>
        <h3 className={`text-base font-semibold ${
          completed ? 'text-gray-400 line-through' : 'text-white'
        }`}>
          {title}
        </h3>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-400 ml-8 mb-2">{description}</p>
      
      {/* Progress (only if not completed) */}
      {!completed && (
        <>
          <div className="text-xs text-yellow-400 font-semibold ml-8">
            Progress: {currentProgress}/{target}
            {turnLimit && ` (Turn ${currentTurn}/${turnLimit})`}
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full ml-8 mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

**Design Elements**:
- Border-left color coding (yellow = active, green = completed)
- Checkbox with checkmark when complete
- Line-through title when complete
- Progress bar with gradient (yellow theme)
- Hover effect (translate-x)
- Turn limit indicator if applicable

### 5. Integration Points

#### A. Store Configuration (`src/store/index.ts`)
```typescript
import missionsReducer from './slices/missionsSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    missions: missionsReducer, // ADD THIS
  },
});
```

#### B. Game Initialization (`GameSetupScreen` or `gameSlice`)
```typescript
// When game starts, dispatch initializeMissions
dispatch(initializeMissions(3)); // Select 3 random missions
```

#### C. Turn Advancement Hook
```typescript
// In gameSlice's advanceTurn reducer, or via middleware
// After updating game state, trigger mission progress update

// Option 1: Direct call in advanceTurn
advanceTurn: (state) => {
  // ... existing turn logic
  
  // At end, note: we'll dispatch updateMissionProgress separately
  // (Can't call across slices in same reducer)
}

// Option 2: Use middleware or component effect
// In a component/hook that watches for turn changes:
useEffect(() => {
  dispatch(updateMissionProgress(gameState));
}, [step]);
```

**Recommended Approach**: Use a `useGameLoop` hook or enhance `useGameSpeed` hook to dispatch `updateMissionProgress` after each turn.

#### D. Tab Integration (`src/App.tsx`)
```typescript
import { MissionPanel } from './components/MissionPanel/MissionPanel';

const tabs = [
  { id: 'launch', label: 'Launch', content: <LaunchContent /> },
  { id: 'analytics', label: 'Analytics', content: <AnalyticsContent /> },
  { id: 'missions', label: 'Missions', content: <MissionPanel /> }, // ADD THIS
  { id: 'documentation', label: 'Documentation', content: <DocsContent /> },
];
```

**Position**: Between Analytics and Documentation as specified

---

## Data Model Changes

### New Types (`src/game/types.ts`)

```typescript
export type MissionCategory = 'launch' | 'removal' | 'state' | 'multi-layer' | 'economic';
export type MissionTrackingType = 'cumulative' | 'threshold' | 'consecutive' | 'snapshot' | 'boolean';

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  target: number;
  currentProgress: number;
  turnLimit?: number;
  trackingType: MissionTrackingType;
  startThreshold?: number;
  completed: boolean;
  completedAt?: number;
}

export interface MissionsState {
  availableMissions: MissionDefinition[];
  activeMissions: MissionDefinition[];
  trackingData: {
    consecutiveLowRiskTurns: number;
    consecutiveBudgetAbove50M: number;
    hasReachedDebris200: boolean;
    layersWithSatellites: Set<string>; // Note: Redux doesn't serialize Set, convert to array
  };
}
```

**Note**: For Redux compatibility, `layersWithSatellites` should be stored as `string[]` and converted to `Set` in selectors.

### RootState Update

```typescript
// src/store/index.ts
export type RootState = ReturnType<typeof store.getState>;

// After integration, RootState will include:
// {
//   game: GameState,
//   ui: UIState,
//   missions: MissionsState
// }
```

---

## Progress Tracking Logic Details

### Mission-Specific Tracking

1. **GPS Priority** (Launch 3 GPS by turn 20)
   - Count GPS satellites in `gameState.satellites` where `purpose === 'GPS'`
   - Check `gameState.step <= 20`
   - Complete when count >= 3 AND within turn limit

2. **Clean Sweep** (Remove 50 debris total)
   - Track cumulative from `gameState.debrisRemovalVehicles.reduce((sum, drv) => sum + drv.debrisRemoved, 0)`
   - Complete when >= 50

3. **Safe Skies** (Maintain LOW risk for 10 turns)
   - Increment `trackingData.consecutiveLowRiskTurns` if `gameState.riskLevel === 'LOW'`
   - Reset to 0 if `riskLevel !== 'LOW'`
   - Complete when counter >= 10

4. **Risk Reduction** (Reduce from 200+ to <100)
   - First, detect when debris count >= 200, set `trackingData.hasReachedDebris200 = true`
   - Then, check if debris count < 100 AND `hasReachedDebris200 === true`
   - Complete when both conditions met

5. **Multi-Layer Network** (Satellites in all 3 layers)
   - Build set of layers: `new Set(gameState.satellites.map(s => s.layer))`
   - Complete when `set.size === 3`

6. **Budget Mastery** (50M+ for 15 turns)
   - Increment `trackingData.consecutiveBudgetAbove50M` if `gameState.budget >= 50_000_000`
   - Reset to 0 otherwise
   - Complete when counter >= 15

### Turn-by-Turn Update Flow

```
1. Game advances turn (gameSlice.advanceTurn)
2. Game state updates (satellites age, DRVs operate, collisions, etc.)
3. Mission system observes updated game state
4. updateMissionProgress reducer:
   a. For each active mission:
      - Read relevant game state fields
      - Calculate new currentProgress
      - Update tracking data (consecutive counters, flags)
      - Check completion criteria
      - Mark completed if met
5. UI re-renders with updated mission data
```

---

## Verification Approach

### 1. Type Checking
```bash
npm run build
# or
tsc --noEmit
```

### 2. Linting
```bash
npm run lint
```

### 3. Manual Testing Checklist

#### Mission Initialization
- [ ] Game starts with 3 random missions selected
- [ ] Each run selects different missions (test multiple times)
- [ ] All missions start with `currentProgress: 0` and `completed: false`

#### UI Rendering
- [ ] Mission tab appears between Analytics and Documentation
- [ ] Mission panel matches design (dark slate, blue header, proper spacing)
- [ ] Mission cards display correctly (title, description, progress)
- [ ] Completed missions show checkmark and line-through
- [ ] Progress bars update smoothly
- [ ] Border colors: yellow (active), green (completed)

#### Progress Tracking (Test at least 3 mission types)
- [ ] **Launch missions**: Launch GPS satellites, verify counter increments
- [ ] **Removal missions**: Launch DRVs, verify debris removal tracking
- [ ] **Consecutive missions**: Maintain LOW risk, verify counter increments/resets
- [ ] Turn limits respected (mission fails if not completed in time)

#### Edge Cases
- [ ] Mission completes exactly on turn limit
- [ ] Multiple missions complete on same turn
- [ ] Consecutive counter resets when condition breaks
- [ ] Threshold missions (e.g., Risk Reduction) only complete after crossing initial threshold

### 4. Integration Testing

#### Redux State Flow
- [ ] `initializeMissions` properly selects and initializes 3 missions
- [ ] `updateMissionProgress` called each turn
- [ ] Mission state updates reflected in UI immediately
- [ ] No console errors or warnings

#### Store Integration
- [ ] `missionsReducer` added to store configuration
- [ ] `RootState` type includes `missions`
- [ ] `useAppSelector` works with mission selectors

---

## File Structure Summary

```
kessler-game/src/
├── game/
│   ├── missions.ts (NEW)          # Mission definitions, random selection logic
│   └── types.ts (MODIFIED)        # Add MissionDefinition, MissionsState types
├── store/
│   ├── index.ts (MODIFIED)        # Add missionsReducer to store
│   └── slices/
│       └── missionsSlice.ts (NEW) # Mission state management
├── components/
│   └── MissionPanel/
│       ├── MissionPanel.tsx (NEW) # Container component
│       └── MissionCard.tsx (NEW)  # Individual mission display
└── App.tsx (MODIFIED)             # Add Missions tab
```

---

## Dependencies

**No new dependencies required**. All functionality uses existing libraries:
- Redux Toolkit (state management)
- React (UI)
- TypeScript (types)
- Tailwind CSS (styling)

---

## Risk Assessment

### Low Risk
- Mission definitions are static data
- UI follows existing patterns (StatsPanel, Tabs)
- No complex algorithms or performance concerns

### Medium Risk
- Integration with game loop (turn advancement)
- Tracking consecutive states requires careful reset logic
- Mission progress calculations need thorough testing

### Mitigation
- Clear separation of concerns (missions.ts, missionsSlice.ts, components)
- Comprehensive manual testing checklist
- Type safety with TypeScript
- Follow existing code patterns

---

## Success Criteria

1. **Functionality**
   - 13 missions defined with diverse completion criteria
   - 3 random missions selected at game start
   - Progress tracked accurately each turn
   - Completion status displayed correctly

2. **UI/UX**
   - Mission tab positioned between Analytics and Documentation
   - Visual design matches wireframe and existing panels
   - Progress bars animate smoothly
   - Completed missions visually distinct (green border, checkmark)

3. **Code Quality**
   - TypeScript compiles without errors
   - ESLint passes without warnings
   - Follows existing code conventions
   - Proper Redux Toolkit patterns

4. **Integration**
   - No disruption to existing game mechanics
   - State updates in sync with game loop
   - No performance degradation

---

## Next Steps (Implementation Phase)

1. Create mission definitions (`missions.ts`)
2. Implement Redux slice (`missionsSlice.ts`)
3. Build UI components (`MissionPanel.tsx`, `MissionCard.tsx`)
4. Integrate with store and game loop
5. Add Missions tab to App.tsx
6. Test and verify all missions
7. Write implementation report
