# Technical Specification: Scoring System

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Requires integration with existing Redux state management
- Multiple scoring metrics need real-time calculation
- UI components need to be added in multiple views
- Score calculation logic has moderate complexity
- Needs to hook into existing game events
- No major architectural changes required

---

## Technical Context

### Language and Framework
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18

### Existing Architecture
- **Store Structure**: Redux slices (game, ui, missions, events)
- **Game Loop**: Turn-based with `advanceTurn` action in gameSlice
- **Game Events**: Tracked via eventSlice (satellite-launch, drv-launch, collision, debris-removal, etc.)
- **Game State**: Centralized in GameState interface (types.ts:78-110)

### Current Game Metrics
The game already tracks:
- Satellites launched (via satellite array)
- DRVs launched (via debrisRemovalVehicles array)
- Debris removed (via drv.debrisRemoved counter)
- Budget (via budget field)
- Days survived (via days field)
- Turns/Steps (via step field)

---

## Implementation Approach

### Scoring Formula Design

The scoring system will calculate points from five categories:

#### 1. **Satellite Launch Score**
- **Base Points**: 100 points per satellite currently active
- **Layer Bonus**: 
  - LEO: +0 points
  - MEO: +50 points
  - GEO: +100 points
- **Purpose Bonus**: All satellite types contribute equally
- **Total**: Sum of all active satellites with layer bonuses

#### 2. **Debris Removal Score**
- **Points per Debris**: 50 points per debris piece removed
- **Type Bonus**:
  - Cooperative debris: base points (50)
  - Uncooperative debris: +25 bonus (total 75 points)
- **Total**: Accumulated across all DRVs throughout the game

#### 3. **Satellite Recovery Score**
- **Points per Recovered Satellite**: 200 points
- **Tracking**: Count satellites removed by cooperative DRVs (distinct from debris removal)
- **Total**: Track separately via game events or DRV stats

#### 4. **Budget Management Score**
- **Formula**: `(currentBudget / 1,000,000) * 10`
- **Example**: $50M budget = 500 points
- **Scaling**: Linear scaling, 10 points per million dollars
- **Negative Budget**: 0 points if budget < 0

#### 5. **Survival Score**
- **Base**: 50 points per day survived
- **Late Game Bonus**: Multiplier increases after day 500
  - Days 0-500: 1x multiplier
  - Days 501-750: 1.5x multiplier
  - Days 751+: 2x multiplier
- **Total**: `days * 50 * multiplier`

#### **Overall Score Formula**
```typescript
totalScore = satelliteLaunchScore 
           + debrisRemovalScore 
           + satelliteRecoveryScore 
           + budgetManagementScore 
           + survivalScore
```

### Score Categories Breakdown
Each category will be tracked and displayed separately for transparency:
- **Satellite Launches**: Active satellites with layer bonuses
- **Debris Removed**: Total debris pieces removed with type bonuses
- **Satellites Recovered**: Dead/EOL satellites captured by cooperative DRVs
- **Budget Management**: Current budget converted to points
- **Days Survived**: Time survived with late-game bonuses

---

## Source Code Structure Changes

### 1. Type Definitions (types.ts)

**Add new interface**:
```typescript
export interface ScoreState {
  totalScore: number;
  satelliteLaunchScore: number;
  debrisRemovalScore: number;
  satelliteRecoveryScore: number;
  budgetManagementScore: number;
  survivalScore: number;
  satellitesRecovered: number;
  scoreHistory: ScoreHistoryEntry[];
}

export interface ScoreHistoryEntry {
  turn: number;
  totalScore: number;
}
```

### 2. New Score Slice (store/slices/scoreSlice.ts)

**Create new Redux slice**:
- State: ScoreState
- Reducers:
  - `calculateScore`: Recalculates all score components based on current game state
  - `incrementSatellitesRecovered`: Increment counter when DRV recovers a satellite
  - `resetScore`: Reset score state when game restarts
- Selectors:
  - `selectTotalScore`
  - `selectScoreBreakdown`

### 3. Store Configuration (store/index.ts)

**Add score reducer**:
```typescript
import scoreReducer from './slices/scoreSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    missions: missionsReducer,
    events: eventsReducer,
    score: scoreReducer, // NEW
  },
});
```

### 4. Game Slice Integration (store/slices/gameSlice.ts)

**Hook score calculation into game actions**:
- `advanceTurn`: Dispatch `calculateScore` after turn advancement
- `launchSatellite`: Trigger score update
- `launchDRV`: Trigger score update
- `processDRVOperations`: Track satellite recoveries, trigger score update
- `processCollisions`: Trigger score update (affects satellite count)
- `spendBudget` / `addBudget`: Trigger score update

### 5. Score Calculation Utility (game/scoring.ts)

**Create pure calculation functions**:
```typescript
export function calculateSatelliteLaunchScore(satellites: Satellite[]): number
export function calculateDebrisRemovalScore(drvs: DebrisRemovalVehicle[]): number
export function calculateSatelliteRecoveryScore(satellitesRecovered: number): number
export function calculateBudgetManagementScore(budget: number): number
export function calculateSurvivalScore(days: number): number
export function calculateTotalScore(components: ScoreComponents): number
```

### 6. UI Components

#### A. ScoreDisplay Component (components/Score/ScoreDisplay.tsx)
- **Location**: StatsPanel (right sidebar on Launch tab)
- **Purpose**: Compact score display showing total and breakdown
- **Features**:
  - Total score prominently displayed
  - Expandable/collapsible breakdown of categories
  - Color-coded by category
  - Tooltip showing calculation details

#### B. ScoreBreakdown Component (components/Score/ScoreBreakdown.tsx)
- **Purpose**: Detailed score breakdown modal/panel
- **Features**:
  - Table showing each category with points
  - Calculation formula displayed for each
  - Historical score trend (if space permits)

#### C. GameOverModal Enhancement (components/GameOver/GameOverModal.tsx)
- **Modification**: Add final score display
- **Features**:
  - Large, prominent total score
  - Breakdown by category
  - Rank/grade based on score ranges (S/A/B/C/D)

### 7. Score Display Locations

**Primary Display** (Always Visible):
- StatsPanel (Launch tab, right sidebar)
- Position: Below risk level, above step counter
- Format: "Score: 12,345" with icon

**Detailed Display** (On Demand):
- New "Score" tab in main tabs (optional)
- GameOver modal (final score with breakdown)
- Analytics tab (score history chart)

---

## Data Model Changes

### GameState Interface
No changes needed - existing fields already track required metrics.

### New ScoreState Interface
```typescript
interface ScoreState {
  totalScore: number;
  satelliteLaunchScore: number;
  debrisRemovalScore: number;
  satelliteRecoveryScore: number;
  budgetManagementScore: number;
  survivalScore: number;
  satellitesRecovered: number;
  scoreHistory: ScoreHistoryEntry[];
}
```

### Tracking Satellite Recoveries
**Challenge**: Currently, cooperative DRVs remove both debris and end-of-life satellites, but the system doesn't distinguish between them in the `debrisRemoved` counter.

**Solution**: 
- Check `processCooperativeDRVOperations` in debrisRemoval.ts
- Track `removedSatelliteIds` separately from `removedDebrisIds`
- Add `satellitesRecovered` counter to DRV state or score state
- Increment when satellites are captured/removed

---

## API/Interface Changes

### ScoreSlice Actions
```typescript
calculateScore(state: RootState): void
incrementSatellitesRecovered(count: number): void
resetScore(): void
```

### ScoreSlice Selectors
```typescript
selectTotalScore(state: RootState): number
selectScoreBreakdown(state: RootState): ScoreBreakdown
selectScoreHistory(state: RootState): ScoreHistoryEntry[]
```

---

## Verification Approach

### Testing Strategy

#### 1. Unit Tests
- **Score Calculation Functions**: Test each scoring function with various inputs
  - `calculateSatelliteLaunchScore`: Test with different satellite counts/layers
  - `calculateDebrisRemovalScore`: Test with various debris removal counts
  - `calculateBudgetManagementScore`: Test with positive/negative/zero budgets
  - `calculateSurvivalScore`: Test with different day counts and multipliers

#### 2. Integration Tests
- **Redux Integration**: Test score slice reducers and selectors
- **Game Loop Integration**: Verify score updates on each game action
- **State Consistency**: Ensure score recalculates correctly after state changes

#### 3. Manual Testing Checklist
- [ ] Launch satellite → verify score increases
- [ ] Launch DRV → no immediate score change (correct)
- [ ] DRV removes debris → verify debris removal score increases
- [ ] DRV recovers satellite → verify satellite recovery score increases
- [ ] Budget changes → verify budget management score updates
- [ ] Advance turn → verify survival score increases
- [ ] Game over → verify final score displays correctly
- [ ] Score breakdown → all categories sum to total
- [ ] Score updates in real-time without lag

#### 4. Linting and Type Checking
```bash
npm run lint
npm run build  # TypeScript compilation check
```

### Success Criteria
- ✅ Score displays prominently in game UI
- ✅ Score updates in real-time as events occur
- ✅ All five scoring categories contribute correctly
- ✅ Score breakdown is accurate and transparent
- ✅ GameOver modal shows final score with breakdown
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Score persists correctly across turn advances

---

## Implementation Challenges and Solutions

### Challenge 1: Distinguishing Satellite Recoveries from Debris Removal
**Problem**: Cooperative DRVs remove both satellites and debris, but only one counter exists.

**Solution**: 
- Modify `processCooperativeDRVOperations` to return separate counts
- Track `satellitesRecovered` in ScoreState
- Increment in `processDRVOperations` reducer when satellites are removed

### Challenge 2: Real-time Score Updates
**Problem**: Score needs to update across multiple game actions without manual triggers.

**Solution**:
- Create a middleware or use existing reducers to dispatch `calculateScore` after relevant actions
- Alternative: Calculate score on-the-fly in selectors (less performant but simpler)
- Recommended: Explicit `calculateScore()` calls in key reducers (advanceTurn, processDRVOperations, etc.)

### Challenge 3: Performance with Frequent Calculations
**Problem**: Recalculating score on every action could be expensive.

**Solution**:
- Use memoized selectors (createSelector from reselect)
- Only recalculate when relevant state changes (satellites, debris, budget, days)
- Score calculation is O(n) where n = satellites + DRVs, should be fast enough

### Challenge 4: UI Space Constraints
**Problem**: StatsPanel is already dense with information.

**Solution**:
- Add compact score display with collapsible breakdown
- Use icons and abbreviations to save space
- Consider moving detailed breakdown to a modal or separate tab

---

## Files to Create

1. **src/game/types.ts** (modify) - Add ScoreState interface
2. **src/game/scoring.ts** (new) - Score calculation functions
3. **src/store/slices/scoreSlice.ts** (new) - Redux slice for score state
4. **src/store/index.ts** (modify) - Add score reducer
5. **src/components/Score/ScoreDisplay.tsx** (new) - Compact score display
6. **src/components/Score/ScoreBreakdown.tsx** (new) - Detailed breakdown
7. **src/components/StatsPanel/StatsPanel.tsx** (modify) - Integrate ScoreDisplay
8. **src/components/GameOver/GameOverModal.tsx** (modify) - Add final score display
9. **src/store/slices/gameSlice.ts** (modify) - Hook score updates into game actions
10. **src/game/engine/debrisRemoval.ts** (modify) - Track satellite recoveries separately

---

## Constants and Configuration

### Score Weights (game/constants.ts or scoring.ts)
```typescript
export const SCORE_CONFIG = {
  SATELLITE_LAUNCH: {
    BASE: 100,
    LAYER_BONUS: {
      LEO: 0,
      MEO: 50,
      GEO: 100,
    },
  },
  DEBRIS_REMOVAL: {
    COOPERATIVE: 50,
    UNCOOPERATIVE: 75,
  },
  SATELLITE_RECOVERY: 200,
  BUDGET_MULTIPLIER: 10, // points per $1M
  SURVIVAL: {
    BASE: 50, // per day
    MULTIPLIERS: [
      { threshold: 0, multiplier: 1 },
      { threshold: 501, multiplier: 1.5 },
      { threshold: 751, multiplier: 2 },
    ],
  },
};
```

### Grade Thresholds (for GameOver display)
```typescript
export const SCORE_GRADES = {
  S: 50000,
  A: 30000,
  B: 15000,
  C: 5000,
  D: 0,
};
```

---

## Timeline Estimate

### Development Phases
1. **Phase 1 - Core Scoring Logic** (1-2 hours)
   - Create scoring.ts with calculation functions
   - Add ScoreState interface to types.ts
   - Write unit tests for scoring functions

2. **Phase 2 - Redux Integration** (1-2 hours)
   - Create scoreSlice.ts
   - Integrate into store
   - Hook calculateScore into game actions

3. **Phase 3 - UI Components** (2-3 hours)
   - Create ScoreDisplay component
   - Create ScoreBreakdown component
   - Integrate into StatsPanel

4. **Phase 4 - GameOver Enhancement** (30 minutes)
   - Add score display to GameOverModal
   - Add grade/rank system

5. **Phase 5 - Testing and Polish** (1-2 hours)
   - Manual testing
   - Fix bugs
   - Adjust scoring weights if needed
   - Lint and type check

**Total Estimated Time**: 5.5 - 9.5 hours

---

## Open Questions and Decisions

### 1. Should we track satellite recoveries separately?
**Decision**: Yes, track as separate metric since recovering satellites is more valuable than removing debris.

### 2. Should score history be stored?
**Decision**: Yes, store in `scoreHistory` array for potential analytics/chart display.

### 3. Where should detailed score breakdown be shown?
**Decision**: Primary compact display in StatsPanel, detailed breakdown accessible via modal or separate tab/section.

### 4. Should negative budget reduce score?
**Decision**: No penalty for negative budget, just 0 points for budget management category. Negative budget already triggers game over.

### 5. Should collisions affect score negatively?
**Decision**: No direct penalty. Collisions reduce satellite count (reducing satellite score) and increase debris (making cleanup harder). Indirect penalty is sufficient.

---

## Acceptance Criteria

- [x] Score calculation logic implemented with all 5 categories
- [x] ScoreState interface defined and integrated into Redux store
- [x] Score updates in real-time as game events occur
- [x] Compact score display visible in StatsPanel during gameplay
- [x] Detailed score breakdown available (modal or separate view)
- [x] Final score displayed in GameOverModal with category breakdown
- [x] Satellite recoveries tracked separately from debris removal
- [x] Score history tracked for potential analytics display
- [x] All TypeScript types properly defined
- [x] No linting errors
- [x] No TypeScript compilation errors
- [x] Score calculation is accurate and tested
