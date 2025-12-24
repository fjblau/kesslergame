# Technical Specification: Enhanced User Inputs for Kessler Simulation Game

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Builds on existing game architecture and UI patterns
- Requires UI/UX enhancements to existing components
- Some new state management for advanced inputs
- Moderate complexity for validation and interactive controls
- No major architectural changes needed

---

## Technical Context

### Current State
**Language**: TypeScript + React  
**Framework**: React 18.x  
**State Management**: Redux Toolkit (as per existing spec)  
**UI Library**: Tailwind CSS  
**Existing Inputs**:
- Launch Type selector (Satellite vs DRV)
- Orbit Layer selector (LEO, MEO, GEO)
- Insurance toggle (satellites only)
- DRV Type selector (Cooperative vs Uncooperative)
- Turn advancement button

### Dependencies
No new major dependencies required. Will use existing tech stack:
- React hooks for interactive controls
- Redux Toolkit for state management
- Tailwind CSS for styling
- Existing component patterns from wireframes

---

## Implementation Approach

### Design Philosophy
Enhance player agency and strategic depth through interactive inputs that:
1. **Provide meaningful choices** with trade-offs
2. **Enable tactical planning** beyond single-turn decisions
3. **Add depth without complexity** (intuitive controls)
4. **Maintain game balance** (no "win button")
5. **Support different playstyles** (aggressive, defensive, balanced)

### Categories of New Inputs

1. **Budget Management Inputs**
2. **Time/Turn Control Inputs**
3. **Advanced Orbit Selection Inputs**
4. **Enhanced DRV Configuration Inputs**
5. **Mission & Strategy Inputs**
6. **Satellite Configuration Inputs**

---

## Proposed User Inputs

### 1. Budget Management Inputs

#### 1.1 **Budget Allocation Slider**
**Purpose**: Pre-allocate budget across different activities at game start or mid-game

**UI Component**: Multi-segment slider with 3 zones
- **Satellites** (default: 50%)
- **Debris Removal** (default: 30%)
- **Emergency Reserve** (default: 20%)

**Behavior**:
- Visual feedback when attempting launch without sufficient allocation
- Warning when reserve drops below 10%
- Rebalancing allowed every 10 turns or when reserve depleted

**State**:
```typescript
interface BudgetAllocation {
  satellites: number;      // Percentage (0-100)
  debrisRemoval: number;   // Percentage (0-100)
  reserve: number;         // Percentage (0-100)
  lastModified: number;    // Turn number
}
```

**Game Impact**: Forces strategic planning, prevents overspending in one category

---

#### 1.2 **Insurance Tier Selector**
**Purpose**: Choose insurance coverage level (not just on/off)

**UI Component**: Radio buttons or dropdown
- **None** - $0 (no payout)
- **Basic** - $500K (pays $1M on collision, current default)
- **Premium** - $1M (pays $2.5M on collision)
- **Full Coverage** - $2M (pays $5M + replacement satellite launch)

**Behavior**:
- Only available for satellites
- Premium tiers unlock after turn 20
- Discounts for insuring 5+ satellites simultaneously

**State**: Update existing `Satellite.insured` from `boolean` to:
```typescript
type InsuranceTier = 'none' | 'basic' | 'premium' | 'full';

interface Satellite {
  // ... existing fields
  insuranceTier: InsuranceTier;
  insuranceValue: number;
}
```

**Game Impact**: Risk management strategy, high-value satellite protection

---

#### 1.3 **Budget Difficulty Modifier**
**Purpose**: Set starting budget and income difficulty at game start

**UI Component**: Dropdown in game setup screen
- **Easy** - $150M starting, +$10M every 10 turns
- **Normal** - $100M starting, +$5M every 20 turns (current)
- **Hard** - $75M starting, no income
- **Challenge** - $50M starting, -$2M per turn (budget drain)

**State**: Add to `GameState`:
```typescript
interface GameState {
  // ... existing fields
  budgetDifficulty: 'easy' | 'normal' | 'hard' | 'challenge';
  budgetIncome: number;
  nextIncomeAt: number;
}
```

**Game Impact**: Replayability, different strategic approaches, player skill expression

---

### 2. Time/Turn Control Inputs

#### 2.1 **Game Speed Selector**
**Purpose**: Control simulation speed for different play preferences

**UI Component**: Speed control buttons
- **⏸ Pause** - Stop auto-advance
- **▶ Normal** - 1 turn per click (current)
- **⏩ Fast** - Auto-advance every 2 seconds
- **⏭ Auto** - Auto-advance until collision or budget warning

**Behavior**:
- Fast/Auto modes allow override with manual input
- Auto pauses on: collision, risk level change, mission completion, budget < 20%

**State**: Add to `uiSlice`:
```typescript
interface UIState {
  // ... existing fields
  gameSpeed: 'paused' | 'normal' | 'fast' | 'auto';
  autoPauseTriggers: {
    collisions: boolean;
    riskChange: boolean;
    budgetWarning: boolean;
    missionComplete: boolean;
  };
}
```

**Game Impact**: Quality of life, different pacing preferences, "watch the chaos" mode

---

#### 2.2 **Turn Scheduler**
**Purpose**: Schedule launches in advance for future turns

**UI Component**: Timeline with turn numbers (current + next 5 turns)
- Drag-and-drop or click to schedule launches
- Shows scheduled actions with icons
- Can cancel/modify upcoming turns

**Behavior**:
- Max 5 turns ahead
- Validation on scheduled turn (still check budget)
- Visual indicator of scheduled action on main control panel

**State**: Add to `gameSlice`:
```typescript
interface ScheduledAction {
  turn: number;
  action: LaunchAction;
  id: string;
}

interface GameState {
  // ... existing fields
  scheduledActions: ScheduledAction[];
}
```

**Game Impact**: Strategic planning, "set it and forget it" for routine launches

---

#### 2.3 **Time Warp Mode**
**Purpose**: Jump ahead N turns with no launches (accelerated skip)

**UI Component**: Button with input spinner (1-10 turns)
- "Skip N Turns" button
- Number input (default: 5)
- Shows projection of debris/collision risk

**Behavior**:
- Simulates N turns without player action
- Shows estimated outcome before confirming
- Counts toward "Skip Steps" mission

**State**: No new state, uses existing simulation logic

**Game Impact**: Mid-game recovery, waiting for DRVs to clear debris, mission strategy

---

### 3. Advanced Orbit Selection Inputs

#### 3.1 **Custom Orbit Altitude Slider**
**Purpose**: Fine-tune orbital altitude within layer (not just LEO/MEO/GEO)

**UI Component**: Slider within selected layer
- LEO: 0-50km → 10 increments (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50)
- MEO: 50-100km → 10 increments
- GEO: 100-150km → 10 increments

**Behavior**:
- Affects collision probability (closer satellites = higher risk)
- Shown as sub-layer in orbit visualization
- Cost increases by 2% per increment above minimum

**State**: Update `Satellite` and `Debris`:
```typescript
interface Satellite {
  // ... existing fields
  altitude: number;  // Precise altitude within layer
}
```

**Game Impact**: Risk optimization, crowded orbit avoidance, precision strategy

---

#### 3.2 **Orbit Priority Queue**
**Purpose**: Set preference order for orbit selection when launching

**UI Component**: Draggable list of three orbit types
- Default: [LEO, MEO, GEO]
- Player can reorder: e.g., [GEO, MEO, LEO] for risk-averse

**Behavior**:
- Hotkey "Q" launches to next preferred orbit with budget
- Shows next-in-queue orbit with highlighted button
- Updates dynamically based on debris risk per layer

**State**: Add to `uiSlice`:
```typescript
interface UIState {
  // ... existing fields
  orbitPriority: OrbitLayer[];
  quickLaunchEnabled: boolean;
}
```

**Game Impact**: Faster gameplay, preferred orbit strategy, muscle memory

---

#### 3.3 **Multi-Orbit Launch**
**Purpose**: Launch to multiple orbits in a single turn (batch launch)

**UI Component**: Checkbox list + Launch All button
- Select multiple orbits: ☑ LEO ($2M) ☑ MEO ($3M) ☐ GEO
- Shows total cost
- Single "Launch to All Selected" button

**Behavior**:
- Launches one satellite per selected orbit
- All-or-nothing (cancels if insufficient budget for any)
- Option to add insurance to all

**State**: Extends existing launch action to support arrays:
```typescript
interface BatchLaunchAction {
  type: 'batch-launch';
  orbits: OrbitLayer[];
  insured: boolean;
}
```

**Game Impact**: Balanced deployment mission, rapid expansion, time saving

---

### 4. Enhanced DRV Configuration Inputs

#### 4.1 **DRV Target Priority**
**Purpose**: Choose which debris type to prioritize

**UI Component**: Radio buttons when launching DRV
- **Auto** (default) - 70/30 mix per natural distribution
- **Cooperative Focus** - 90% cooperative, 10% uncooperative
- **Uncooperative Focus** - 90% uncooperative, 10% cooperative
- **Balanced** - 50/50 split

**Behavior**:
- Affects which debris gets removed first
- Cooperative-focused DRVs are 10% cheaper
- Uncooperative-focused are 20% more expensive

**State**: Update `DebrisRemovalVehicle`:
```typescript
interface DebrisRemovalVehicle {
  // ... existing fields
  targetPriority: 'auto' | 'cooperative' | 'uncooperative' | 'balanced';
}
```

**Game Impact**: Tactical debris management, mission optimization

---

#### 4.2 **DRV Duration Extension**
**Purpose**: Pay extra to extend DRV operational lifetime

**UI Component**: Checkbox at launch
- **Standard Duration** (default)
- **+5 Turns** (+25% cost)
- **+10 Turns** (+50% cost)

**Behavior**:
- Available for both cooperative and uncooperative DRVs
- Extension locked in at launch
- Shows extended lifetime in DRV stats

**State**: `DebrisRemovalVehicle.maxAge` already supports this, just add launch UI

**Game Impact**: Long-term debris management, cost-benefit trade-off

---

#### 4.3 **DRV Fleet Management Panel**
**Purpose**: View and manage all active DRVs in one interface

**UI Component**: Expandable panel showing DRV list
- Each DRV shows: Layer, Type, Age, Removed count, Turns left
- Actions: **Early Decommission** (refund 50%), **Boost** (+2 turns for $1M)

**Behavior**:
- Early decommission saves future operating costs (none currently, but could add)
- Boost extends lifetime mid-mission
- Sortable by layer, age, effectiveness

**State**: Actions dispatch to `gameSlice`:
```typescript
const gameActions = {
  // ... existing
  decommissionDRV: (drvId: string) => {},
  boostDRV: (drvId: string, extraTurns: number) => {},
};
```

**Game Impact**: Active fleet management, resource optimization, tactical flexibility

---

#### 4.4 **DRV Type Variants**
**Purpose**: Additional DRV specializations beyond cooperative/uncooperative

**UI Component**: Dropdown with 4+ types
- **Cooperative** (existing) - 2-3 debris/turn, 85% success, 10 turns, $4-10M
- **Uncooperative** (existing) - 1-2 debris/turn, 60% success, 8 turns, $8-20M
- **Heavy-Duty** (new) - 4-5 debris/turn, 75% success, 6 turns, $12-25M
- **Precision** (new) - 1 debris/turn, 95% success, 15 turns, $6-15M
- **Bulk Sweeper** (new) - 3-4 debris/turn, 70% success, 5 turns, $5-12M

**Behavior**:
- Each type has unique cost/benefit profile
- Unlocked after certain missions or turn milestones
- Some types more effective in specific orbits (e.g., Heavy-Duty best in LEO)

**State**: Extend `DRVType`:
```typescript
type DRVType = 'cooperative' | 'uncooperative' | 'heavy-duty' | 'precision' | 'bulk-sweeper';
```

**Game Impact**: Deeper strategy, situational optimization, progression unlocks

---

### 5. Mission & Strategy Inputs

#### 5.1 **Mission Selector at Game Start**
**Purpose**: Choose which missions to activate instead of random selection

**UI Component**: Mission checklist (select 3-5 from 13 available)
- Shows all missions with descriptions
- Difficulty indicator (★☆☆ to ★★★)
- Can reroll for +$10M cost

**Behavior**:
- Default: Random 3 missions (current)
- Player can pick 3 for -$10M starting budget
- Custom mode: Pick 5 for -$20M

**State**: Update `GameState.activeMissions` selection logic

**Game Impact**: Strategy customization, skill-based challenges, replayability

---

#### 5.2 **Risk Tolerance Slider**
**Purpose**: Set automated risk response behavior

**UI Component**: Slider with 3 zones
- **Conservative** - Auto-pause on MEDIUM risk
- **Moderate** (default) - Auto-pause on CRITICAL risk
- **Aggressive** - Never auto-pause

**Behavior**:
- Works with Auto game speed
- Shows warning notification but respects setting
- Can override manually during pause

**State**: Add to `uiSlice`:
```typescript
interface UIState {
  // ... existing fields
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}
```

**Game Impact**: Playstyle customization, beginner-friendly safeguards

---

#### 5.3 **Strategy Templates**
**Purpose**: Pre-configured settings for different playstyles

**UI Component**: Dropdown at game start
- **Aggressive Expansion** - Favors satellite launches, low insurance
- **Debris Management** - Favors DRVs, high reserve budget
- **Balanced** (default) - Current settings
- **Risk Minimization** - High insurance, conservative risk tolerance, GEO priority

**Behavior**:
- Sets budget allocation, orbit priority, insurance default, risk tolerance
- Player can modify individual settings after selecting template
- Templates unlock after completing specific missions

**State**: Presets for existing configuration states

**Game Impact**: Onboarding, playstyle discovery, expert optimization

---

### 6. Satellite Configuration Inputs

#### 6.1 **Satellite Purpose Selector**
**Purpose**: Choose satellite type at launch (currently random)

**UI Component**: Dropdown or icon buttons
- **Weather** ☁️
- **Communications** 📡
- **GPS** 🛰️
- **Random** 🎲 (current behavior, slight discount)

**Behavior**:
- Random: -$200K discount
- Specific purpose: Standard cost
- Affects mission progress (e.g., "Launch 3 GPS satellites")

**State**: Make `Satellite.purpose` player-controlled instead of random

**Game Impact**: Mission targeting, strategic satellite composition

---

#### 6.2 **Satellite Hardening Option**
**Purpose**: Increase collision resistance at extra cost

**UI Component**: Checkbox at launch
- **Standard** (default)
- **Hardened** (+$1M, 25% chance to survive collision as debris instead of destruction)

**Behavior**:
- Hardened satellites convert to debris on collision instead of being destroyed
- Debris retains position and layer
- Rare but valuable for high-priority satellites

**State**: Update `Satellite`:
```typescript
interface Satellite {
  // ... existing fields
  hardened: boolean;
  survivalChance: number;
}
```

**Game Impact**: High-value asset protection, cost-benefit analysis

---

#### 6.3 **Satellite Lifetime Extension**
**Purpose**: Extend LEO satellite lifetime beyond 20 turns

**UI Component**: Number input at launch (only for LEO)
- **Standard**: 20 turns
- **Extended**: +5 turns per $500K
- **Max**: +15 turns (+$1.5M)

**Behavior**:
- Only applies to LEO satellites
- Shows extended lifetime in satellite tooltip
- Counts toward "Natural Retirement" mission

**State**: `Satellite.age` and expiration logic already support this

**Game Impact**: Long-term LEO deployment, mission strategy

---

## Data Model Changes

### New Interfaces

```typescript
// Budget management
interface BudgetAllocation {
  satellites: number;
  debrisRemoval: number;
  reserve: number;
  lastModified: number;
}

// Turn scheduling
interface ScheduledAction {
  turn: number;
  action: LaunchAction;
  id: string;
}

// DRV fleet management
interface DRVManagementAction {
  type: 'decommission' | 'boost';
  drvId: string;
  extraTurns?: number;
}

// Strategy templates
interface StrategyTemplate {
  name: string;
  budgetAllocation: BudgetAllocation;
  orbitPriority: OrbitLayer[];
  insuranceDefault: InsuranceTier;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}
```

### Updated Interfaces

```typescript
interface GameState {
  // ... existing fields
  
  // Budget inputs
  budgetAllocation: BudgetAllocation;
  budgetDifficulty: 'easy' | 'normal' | 'hard' | 'challenge';
  budgetIncome: number;
  nextIncomeAt: number;
  
  // Turn control
  scheduledActions: ScheduledAction[];
}

interface UIState {
  // ... existing fields
  
  // Time control
  gameSpeed: 'paused' | 'normal' | 'fast' | 'auto';
  autoPauseTriggers: {
    collisions: boolean;
    riskChange: boolean;
    budgetWarning: boolean;
    missionComplete: boolean;
  };
  
  // Orbit selection
  orbitPriority: OrbitLayer[];
  quickLaunchEnabled: boolean;
  
  // Mission & strategy
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface Satellite {
  // ... existing fields
  altitude: number;
  insuranceTier: InsuranceTier;
  insuranceValue: number;
  hardened: boolean;
  survivalChance: number;
  extendedLifetime: number;
}

interface DebrisRemovalVehicle {
  // ... existing fields
  targetPriority: 'auto' | 'cooperative' | 'uncooperative' | 'balanced';
  boosted: boolean;
  boostTurns: number;
}
```

### New Types

```typescript
type InsuranceTier = 'none' | 'basic' | 'premium' | 'full';
type DRVType = 'cooperative' | 'uncooperative' | 'heavy-duty' | 'precision' | 'bulk-sweeper';
type GameSpeed = 'paused' | 'normal' | 'fast' | 'auto';
type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
type BudgetDifficulty = 'easy' | 'normal' | 'hard' | 'challenge';
```

---

## Source Code Structure Changes

### New Components

```
src/components/
├── BudgetPanel/
│   ├── BudgetAllocationSlider.tsx       # Budget allocation interface
│   ├── InsuranceTierSelector.tsx        # Insurance tier selection
│   └── BudgetDifficultySettings.tsx     # Game setup budget difficulty
├── TimeControl/
│   ├── GameSpeedControl.tsx             # Speed selector
│   ├── TurnScheduler.tsx                # Schedule future turns
│   └── TimeWarpModal.tsx                # Skip N turns interface
├── OrbitControl/
│   ├── OrbitAltitudeSlider.tsx          # Fine-tune altitude
│   ├── OrbitPriorityQueue.tsx           # Preferred orbit order
│   └── MultiOrbitLauncher.tsx           # Batch launch UI
├── DRVPanel/
│   ├── DRVTargetPriority.tsx            # Debris priority selector
│   ├── DRVDurationExtension.tsx         # Lifetime extension
│   ├── DRVFleetManager.tsx              # Fleet management panel
│   └── DRVTypeSelector.tsx              # DRV variant selection
├── MissionPanel/
│   ├── MissionSetupSelector.tsx         # Choose missions at start
│   ├── RiskToleranceSlider.tsx          # Risk behavior settings
│   └── StrategyTemplates.tsx            # Pre-configured strategies
└── SatelliteConfig/
    ├── SatellitePurposeSelector.tsx     # Choose satellite type
    ├── SatelliteHardeningToggle.tsx     # Collision resistance
    └── LifetimeExtension.tsx            # LEO lifetime extension
```

### Updated Components

```
src/components/ControlPanel/
├── ControlPanel.tsx                      # Add new input sections
├── LaunchSelector.tsx                    # Support batch launch
└── InsuranceToggle.tsx                   # Replace with InsuranceTierSelector
```

### New Redux Actions

```typescript
// Budget actions
const budgetActions = {
  setBudgetAllocation: (allocation: BudgetAllocation) => {},
  setDifficulty: (difficulty: BudgetDifficulty) => {},
  processBudgetIncome: () => {},
};

// Time control actions
const timeActions = {
  setGameSpeed: (speed: GameSpeed) => {},
  scheduleAction: (action: ScheduledAction) => {},
  cancelScheduledAction: (actionId: string) => {},
  skipNTurns: (turns: number) => {},
};

// Orbit actions
const orbitActions = {
  setOrbitPriority: (priority: OrbitLayer[]) => {},
  launchMultiOrbit: (orbits: OrbitLayer[], insured: boolean) => {},
};

// DRV actions
const drvActions = {
  setDRVTargetPriority: (priority: string) => {},
  boostDRV: (drvId: string, turns: number) => {},
  decommissionDRV: (drvId: string) => {},
};

// Mission actions
const missionActions = {
  selectMissions: (missionIds: MissionId[]) => {},
  setRiskTolerance: (tolerance: RiskTolerance) => {},
  applyStrategyTemplate: (template: StrategyTemplate) => {},
};
```

---

## Verification Approach

### Unit Testing
- Test budget allocation validation (sum must equal 100%)
- Test turn scheduler conflict resolution
- Test insurance tier payout calculations
- Test DRV priority target selection
- Test multi-orbit launch budget validation

### Integration Testing
- Test scheduled actions execute on correct turns
- Test auto-pause triggers work with game speed
- Test budget difficulty modifiers affect game state
- Test strategy templates apply correct settings
- Test DRV boost extends lifetime correctly

### Manual Testing Checklist
1. ✅ Budget allocation prevents overspending
2. ✅ Turn scheduler shows correct upcoming actions
3. ✅ Game speed controls work as expected
4. ✅ Insurance tiers calculate correct payouts
5. ✅ Multi-orbit launch validates budget
6. ✅ DRV fleet manager shows accurate stats
7. ✅ Mission selector affects game start correctly
8. ✅ Risk tolerance auto-pauses appropriately
9. ✅ Satellite hardening survives collisions
10. ✅ Strategy templates load correct presets

### User Testing Focus
- **Clarity**: Are input labels and options clear?
- **Discoverability**: Can players find new inputs easily?
- **Balance**: Do inputs create interesting choices or dominant strategies?
- **Feedback**: Do inputs provide clear visual/numerical feedback?
- **Performance**: Do complex inputs (sliders, schedulers) lag?

---

## Priority Recommendations

### Phase 1 (High Priority - Core Enhancements)
1. **Game Speed Selector** - Major QoL improvement
2. **Insurance Tier Selector** - Deepens existing mechanic
3. **DRV Target Priority** - Makes DRV choice more meaningful
4. **Satellite Purpose Selector** - Player control over missions
5. **Budget Difficulty Modifier** - Replayability boost

### Phase 2 (Medium Priority - Strategic Depth)
1. **Budget Allocation Slider** - Strategic planning
2. **Turn Scheduler** - Advanced planning
3. **DRV Fleet Management** - Active resource management
4. **Multi-Orbit Launch** - Time saver, batch operations
5. **Risk Tolerance Slider** - Playstyle customization

### Phase 3 (Lower Priority - Advanced Features)
1. **Custom Orbit Altitude** - Fine-tuning enthusiasts
2. **DRV Duration Extension** - Niche optimization
3. **Satellite Hardening** - Edge case protection
4. **Strategy Templates** - Onboarding and discovery
5. **DRV Type Variants** - Late-game variety

### Optional (Nice-to-Have)
- Time Warp Mode (could be replaced by Fast/Auto speed)
- Orbit Priority Queue (niche use case)
- Satellite Lifetime Extension (LEO-specific, limited use)
- Mission Selector (removes randomness, might hurt replayability)

---

## Technical Risks & Mitigation

### Risk 1: UI Complexity Overwhelms Players
**Mitigation**: 
- Use progressive disclosure (advanced settings collapsed by default)
- Provide "Simple" and "Advanced" control modes toggle
- Tooltips and help text for all new inputs

### Risk 2: Too Many Inputs Slow Down Turns
**Mitigation**:
- Keep default values sensible for quick play
- Add keyboard shortcuts for common actions
- "Repeat Last Action" button for rapid launches

### Risk 3: Game Balance Disruption
**Mitigation**:
- Extensive playtesting with various input combinations
- Add analytics to track which strategies dominate
- Balance pass after implementation, not during

### Risk 4: State Management Bloat
**Mitigation**:
- Keep input state separate from core game state where possible
- Use local component state for UI-only settings
- Add state reset/default functions for game restart

---

## Success Metrics

### Player Engagement
- Average session length increases by 20%+
- Players complete more missions per game
- Replay rate increases (multiple games with different settings)

### Input Usage
- 70%+ of players adjust at least 3 new inputs per game
- Game speed controls used in 80%+ of games
- Budget allocation used in 50%+ of games

### Satisfaction
- Positive feedback on "depth vs complexity" balance
- Reduced requests for "auto-pilot" or "skip to end" features
- Increased strategic discussion in player communities

---

## Future Extensions

### Post-Launch Opportunities
1. **Input Presets** - Save and share favorite configurations
2. **Hotkey Customization** - Rebind controls for power users
3. **AI Advisor** - Suggests input values based on game state
4. **Multiplayer Inputs** - Turn timer, simultaneous launch bidding
5. **Modding Support** - Custom DRV types, insurance tiers, etc.

### Analytics to Collect
- Most/least used inputs
- Correlation between inputs and mission success
- Average time spent on input configuration vs gameplay
- Input combinations that lead to game over (balance issues)
