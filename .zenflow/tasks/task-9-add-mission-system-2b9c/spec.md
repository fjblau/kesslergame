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
  failed: boolean; // true when turnLimit exceeded without completion
  completedAt?: number; // turn number when completed
}

export interface MissionsState {
  availableMissions: MissionDefinition[]; // All 13 missions
  activeMissions: MissionDefinition[]; // 3 unique randomly selected at game start
  trackingData: {
    consecutiveLowRiskTurns: number;
    consecutiveBudgetAbove50M: number;
    hasReachedDebris200: boolean; // for Risk Reduction mission
    layersWithSatellites: OrbitLayer[]; // Redux can't serialize Set, use array
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
  // Shuffle and select 3 UNIQUE missions (no duplicates)
  // Initialize with currentProgress: 0, completed: false, failed: false
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
  // Select 3 unique random missions, reset tracking data

- updateMissionProgress(state, action: PayloadAction<GameState>)
  // Called each turn, updates all active mission progress
  // Checks completion criteria
  // Updates tracking data (consecutive counters, thresholds, etc.)
  // Marks missions as failed when turnLimit exceeded without completion
  // Triggers autoPauseOnMission when any mission completes

- checkMissionCompletion(state)
  // Mark missions as completed when criteria met
  // Mark missions as failed when turnLimit exceeded
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
  const { title, description, currentProgress, target, completed, failed, completedAt, turnLimit } = mission;
  const progressPercent = Math.min((currentProgress / target) * 100, 100);
  const currentTurn = useAppSelector(state => state.game.step);
  
  // Determine border color: green (completed), red (failed), yellow (in-progress)
  const borderColor = completed ? 'border-green-500' : failed ? 'border-red-500' : 'border-yellow-400';
  
  return (
    <div className={`bg-slate-700 border-l-4 ${borderColor} rounded-lg p-4 transition-all hover:translate-x-1`}>
      {/* Checkbox + Title */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-sm ${
          completed 
            ? 'bg-green-500 border-green-500 text-slate-800' 
            : failed
            ? 'bg-red-500 border-red-500 text-slate-800'
            : 'border-gray-500 text-gray-500'
        }`}>
          {completed ? '✓' : failed ? '✗' : '☐'}
        </div>
        <h3 className={`text-base font-semibold ${
          completed ? 'text-gray-400 line-through' : failed ? 'text-red-400 line-through' : 'text-white'
        }`}>
          {title}
        </h3>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-400 ml-8 mb-2">{description}</p>
      
      {/* Completion/Failure Message */}
      {completed && completedAt && (
        <div className="text-xs text-green-400 ml-8 font-semibold">
          ✓ Completed on turn {completedAt}
        </div>
      )}
      {failed && (
        <div className="text-xs text-red-400 ml-8 font-semibold">
          ✗ Failed (time limit exceeded)
        </div>
      )}
      
      {/* Progress (only if not completed and not failed) */}
      {!completed && !failed && (
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
- Border-left color coding (yellow = active, green = completed, red = failed)
- Checkbox: ✓ (completed), ✗ (failed), ☐ (in progress)
- Line-through title when complete or failed
- Completion turn display for completed missions
- Failure message for failed missions
- Progress bar with gradient (yellow theme) for active missions
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

#### B. Game Initialization (`src/components/Setup/GameSetupScreen.tsx`)
```typescript
// In the handleStart function, after initializeGame:
const handleStart = () => {
  dispatch(initializeGame(difficulty));
  dispatch(initializeMissions(3)); // Select 3 unique random missions
  onStart();
};
```

#### C. Turn Advancement Integration

**Location 1**: `src/hooks/useGameSpeed.ts` (automatic turn advancement)
```typescript
// After line 34: dispatch(advanceTurn());
dispatch(advanceTurn());
dispatch(updateMissionProgress(getState().game)); // ADD THIS
dispatch(processDRVOperations());
// ... rest of logic
```

**Location 2**: `src/components/ControlPanel/ControlPanel.tsx` (manual turn advancement)
```typescript
// After line 53 where satellite/DRV launches, in the turn advancement logic:
dispatch(advanceTurn());
dispatch(updateMissionProgress(/* pass current game state */)); // ADD THIS
dispatch(processDRVOperations());
// ... rest of logic
```

**Note**: Since `updateMissionProgress` needs the full `GameState`, use `useAppSelector(state => state.game)` to get current state before dispatching.

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
  failed: boolean; // true when turnLimit exceeded without completion
  completedAt?: number;
}

export interface MissionsState {
  availableMissions: MissionDefinition[];
  activeMissions: MissionDefinition[];
  trackingData: {
    consecutiveLowRiskTurns: number;
    consecutiveBudgetAbove50M: number;
    hasReachedDebris200: boolean;
    layersWithSatellites: OrbitLayer[]; // Array for Redux serialization
    totalDRVsLaunched: number; // Track DRVs including decommissioned ones
  };
}
```

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

### Mission-Specific Tracking & Progress Calculation

#### 1. Launch Count Missions (Cumulative)

**GPS Priority** - Launch 3 GPS satellites by turn 20
- **Progress**: `gameState.satellites.filter(s => s.purpose === 'GPS').length`
- **Display**: "2/3 GPS satellites"
- **Complete**: `currentProgress >= 3 && gameState.step <= 20`
- **Fail**: `gameState.step > 20 && !completed`

**Weather Network** - Launch 4 Weather satellites by turn 30
- **Progress**: `gameState.satellites.filter(s => s.purpose === 'Weather').length`
- **Display**: "3/4 Weather satellites"
- **Complete**: `currentProgress >= 4 && gameState.step <= 30`

**Communications Hub** - Launch 5 Comms satellites by turn 40
- **Progress**: `gameState.satellites.filter(s => s.purpose === 'Comms').length`
- **Display**: "1/5 Comms satellites"
- **Complete**: `currentProgress >= 5 && gameState.step <= 40`

**Debris Response Team** - Launch 3 DRVs by turn 25
- **Progress**: Total DRVs ever launched (active + decommissioned)
- **Display**: "2/3 DRVs launched"
- **Complete**: `currentProgress >= 3 && gameState.step <= 25`
- **Note**: Since gameState only tracks active DRVs, add `totalDRVsLaunched` to MissionsState.trackingData

#### 2. Removal/Cleanup Missions (Cumulative)

**Debris Cleaner** - Launch 2 DRVs (no time limit)
- **Progress**: Total DRVs ever launched
- **Display**: "1/2 DRVs launched"
- **Complete**: `currentProgress >= 2`

**Clean Sweep** - Remove 50 debris by turn 50
- **Progress**: `gameState.debrisRemovalVehicles.reduce((sum, drv) => sum + drv.debrisRemoved, 0)`
- **Display**: "34/50 debris removed"
- **Complete**: `currentProgress >= 50 && gameState.step <= 50`

**Orbital Hygiene** - Remove 100 debris by turn 80
- **Progress**: Same as Clean Sweep
- **Display**: "72/100 debris removed"
- **Complete**: `currentProgress >= 100 && gameState.step <= 80`

#### 3. State Threshold Missions (Threshold/Snapshot)

**Risk Reduction** - Reduce debris from 200+ to <100
- **Progress**: When `hasReachedDebris200 === true`, show current debris count; else show "Waiting for 200+ debris"
- **Display**: "156/200 → <100" or "Debris: 89 (threshold reached!)"
- **Complete**: `trackingData.hasReachedDebris200 === true && gameState.debris.length < 100`
- **Tracking**: Set `hasReachedDebris200 = true` when `debris.length >= 200`

**Safe Skies** - Maintain LOW risk for 10 consecutive turns
- **Progress**: `trackingData.consecutiveLowRiskTurns`
- **Display**: "7/10 consecutive LOW risk turns"
- **Complete**: `currentProgress >= 10`
- **Tracking**: Increment if `riskLevel === 'LOW'`, reset to 0 otherwise

**Satellite Fleet** - Have 15+ satellites simultaneously
- **Progress**: `gameState.satellites.length`
- **Display**: "12/15 active satellites"
- **Complete**: `currentProgress >= 15`
- **Note**: Snapshot check each turn

#### 4. Multi-Layer Missions (Boolean/Count)

**Multi-Layer Network** - Satellites in all 3 layers
- **Progress**: Number of unique layers with satellites
- **Display**: "2/3 orbital layers" (LEO, MEO covered; need GEO)
- **Complete**: `currentProgress >= 3`
- **Tracking**: 
  ```typescript
  const layers = [...new Set(gameState.satellites.map(s => s.layer))];
  trackingData.layersWithSatellites = layers;
  currentProgress = layers.length;
  ```

**Full Coverage** - 2+ satellites in each layer simultaneously
- **Progress**: Count of layers with 2+ satellites
- **Display**: "2/3 layers covered" or "LEO: 3, MEO: 2, GEO: 0 → 2/3"
- **Complete**: `currentProgress >= 3`
- **Calculation**:
  ```typescript
  const layerCounts = { LEO: 0, MEO: 0, GEO: 0 };
  gameState.satellites.forEach(s => layerCounts[s.layer]++);
  currentProgress = Object.values(layerCounts).filter(count => count >= 2).length;
  ```

#### 5. Economic Missions (Consecutive)

**Budget Mastery** - Budget above 50M for 15 consecutive turns
- **Progress**: `trackingData.consecutiveBudgetAbove50M`
- **Display**: "12/15 consecutive turns above 50M"
- **Complete**: `currentProgress >= 15`
- **Tracking**: Increment if `budget >= 50_000_000`, reset to 0 otherwise

### Turn-by-Turn Update Flow

```
1. Game advances turn (gameSlice.advanceTurn)
2. Game state updates (satellites age, DRVs operate, collisions, etc.)
3. Mission system observes updated game state (via updateMissionProgress)
4. updateMissionProgress reducer:
   a. For each active mission (not completed and not failed):
      - Read relevant game state fields
      - Calculate new currentProgress based on tracking type
      - Update tracking data (consecutive counters, flags, thresholds)
      - Check completion criteria
      - If met: mark completed, record completedAt
      - If turnLimit exceeded: mark failed
      - If just completed: trigger autoPauseOnMission (if enabled)
5. UI re-renders with updated mission data
```

### autoPauseOnMission Integration

The `UIState` already includes `autoPauseOnMission: boolean` (`types.ts:72`). This feature should pause the game when **any mission completes**.

**Implementation**:
1. In `missionsSlice.updateMissionProgress`, detect when a mission transitions from incomplete to completed
2. Return a flag indicating "mission just completed"
3. In the component that dispatches `updateMissionProgress`, check this flag:
   ```typescript
   const result = dispatch(updateMissionProgress(gameState));
   const autoPause = useAppSelector(state => state.ui.autoPauseOnMission);
   
   if (result.payload.missionCompleted && autoPause) {
     dispatch(setGameSpeed('paused'));
   }
   ```

**Alternative**: Use Redux middleware to listen for mission completion and auto-pause

---

## Verification Approach

### 1. Type Checking
```bash
npm run build
# This runs: tsc -b && vite build
```

For faster type-check only (no build):
```bash
npx tsc -b
```

### 2. Linting
```bash
npm run lint
```

### 3. Manual Testing Checklist

#### Mission Initialization
- [ ] Game starts with 3 unique random missions selected
- [ ] Each run selects different missions (test multiple times)
- [ ] All missions start with `currentProgress: 0`, `completed: false`, `failed: false`

#### UI Rendering
- [ ] Mission tab appears between Analytics and Documentation
- [ ] Mission panel matches design (dark slate, blue header, proper spacing)
- [ ] Mission cards display correctly (title, description, progress)
- [ ] Completed missions: green border, checkmark, line-through, completion turn
- [ ] Failed missions: red border, X mark, line-through, failure message
- [ ] Active missions: yellow border, progress bar, turn limit indicator
- [ ] Progress bars update smoothly with gradient

#### Progress Tracking (Test at least 3 mission types)
- [ ] **Launch missions**: Launch GPS satellites, verify counter increments
- [ ] **Removal missions**: Launch DRVs, verify debris removal tracking
- [ ] **Consecutive missions**: Maintain LOW risk, verify counter increments/resets
- [ ] Turn limits respected (mission fails if not completed in time)
- [ ] Failed missions display red border and failure message

#### Edge Cases
- [ ] Mission completes exactly on turn limit (should complete, not fail)
- [ ] Mission exceeds turn limit by 1 turn (should fail)
- [ ] Multiple missions complete on same turn
- [ ] Consecutive counter resets when condition breaks
- [ ] Threshold missions (e.g., Risk Reduction) only complete after crossing initial threshold
- [ ] autoPauseOnMission triggers when enabled and mission completes

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
   - 3 unique random missions selected at game start
   - Progress tracked accurately each turn
   - Completion and failure status displayed correctly
   - Turn limits enforced (missions fail when exceeded)
   - autoPauseOnMission works when mission completes

2. **UI/UX**
   - Mission tab positioned between Analytics and Documentation
   - Visual design matches wireframe and existing panels
   - Progress bars animate smoothly
   - Three distinct states: active (yellow), completed (green), failed (red)
   - Completion turn displayed for successful missions
   - Failure message displayed for failed missions

3. **Code Quality**
   - TypeScript compiles without errors
   - ESLint passes without warnings
   - Follows existing code conventions
   - Proper Redux Toolkit patterns

4. **Integration**
   - No disruption to existing game mechanics
   - State updates in sync with game loop
   - No performance degradation
   - Mission progress updates trigger after each turn

---

## Implementation Notes

### Important Considerations

1. **DRV Tracking**: The `GameState` only tracks active DRVs in `debrisRemovalVehicles` array. To track total DRVs launched (including decommissioned), maintain `totalDRVsLaunched` in `MissionsState.trackingData`. Increment this when `launchDRV` is dispatched.

2. **Game Loop Integration**: The mission progress update must happen AFTER all game state updates (satellites aging, DRV operations, collisions) to ensure accurate progress calculation.

3. **Redux Serialization**: Avoid `Set`, `Map`, `Date` objects in state. Use arrays and numbers instead. Convert to specialized types in selectors if needed.

4. **autoPauseOnMission**: Check if `updateMissionProgress` can return payload with completion flag, or use middleware to detect mission completion events.

5. **Turn Limit Edge Case**: A mission that completes ON the exact turn limit (e.g., turn 20/20) should be marked as completed, NOT failed. Only fail if `currentTurn > turnLimit`.

---

## Next Steps (Implementation Phase)

1. Create mission definitions (`missions.ts`) with all 13 missions
2. Add mission types to `types.ts`
3. Implement Redux slice (`missionsSlice.ts`) with all reducers and selectors
4. Build UI components (`MissionPanel.tsx`, `MissionCard.tsx`)
5. Integrate with store (`index.ts`)
6. Add mission initialization to `GameSetupScreen.tsx`
7. Add mission updates to `useGameSpeed.ts` and `ControlPanel.tsx`
8. Add Missions tab to `App.tsx`
9. Run type checking and linting
10. Test all mission types and edge cases
11. Write implementation report
