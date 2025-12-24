# Phase 1 Implementation Spec: Core Interactive Inputs

## Overview

This spec focuses on **5 high-priority interactive inputs** that enhance gameplay without overwhelming players. Each input integrates with existing wireframes and components.

**Scope**: Phase 1 only (QoL + strategic depth)  
**Complexity**: Medium  
**Timeline**: Single implementation phase

---

## Selected Inputs

| # | Input | Category | Priority | Wireframe Integration |
|---|-------|----------|----------|----------------------|
| 1 | Game Speed Selector | Time Control | HIGH | New control bar component |
| 2 | Insurance Tier Selector | Budget | HIGH | Replace `control-panel-satellite.html` checkbox |
| 3 | DRV Target Priority | DRV Config | HIGH | Extend `control-panel-drv.html` |
| 4 | Satellite Purpose Selector | Satellite Config | HIGH | Extend `control-panel-satellite.html` |
| 5 | Budget Difficulty Modifier | Budget | MEDIUM | Game setup screen (new) |

---

## 1. Game Speed Selector

### Purpose
Control simulation pacing for different play preferences (QoL enhancement)

### UI Design

**Location**: New control bar above or below main game board

**Component**: `GameSpeedControl.tsx`

```
┌─────────────────────────────────────────┐
│  ⏸ Pause  │  ▶ Normal  │  ⏩ Fast (2s)  │
└─────────────────────────────────────────┘
```

**States**:
- **Paused** (⏸) - No auto-advance, player must click "Next Turn"
- **Normal** (▶) - Current behavior: click to advance (default)
- **Fast** (⏩) - Auto-advance every 2 seconds

**Auto-Pause Triggers** (Fast mode only):
- Any collision occurs
- Risk level changes
- Budget drops below 20%
- Mission completed

### Data Model

```typescript
// Add to uiSlice.ts
interface UIState {
  gameSpeed: 'paused' | 'normal' | 'fast';
  autoPauseOnCollision: boolean;    // default: true
  autoPauseOnRiskChange: boolean;   // default: true
  autoPauseOnBudgetLow: boolean;    // default: true
  autoPauseOnMission: boolean;      // default: true
}
```

### Implementation

**New File**: `src/components/TimeControl/GameSpeedControl.tsx`

```typescript
export function GameSpeedControl() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const dispatch = useAppDispatch();
  
  return (
    <div className="flex gap-2 p-2 bg-slate-800 rounded">
      <Button 
        active={speed === 'paused'}
        onClick={() => dispatch(setGameSpeed('paused'))}
      >
        ⏸ Pause
      </Button>
      <Button 
        active={speed === 'normal'}
        onClick={() => dispatch(setGameSpeed('normal'))}
      >
        ▶ Normal
      </Button>
      <Button 
        active={speed === 'fast'}
        onClick={() => dispatch(setGameSpeed('fast'))}
      >
        ⏩ Fast
      </Button>
    </div>
  );
}
```

**Hook**: `src/hooks/useGameSpeed.ts`

```typescript
export function useGameSpeed() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const shouldPause = useAppSelector(selectShouldAutoPause);
  
  useEffect(() => {
    if (speed !== 'fast') return;
    
    const interval = setInterval(() => {
      if (shouldPause) {
        dispatch(setGameSpeed('paused'));
        return;
      }
      dispatch(advanceTurn());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [speed, shouldPause]);
}
```

### Integration Points
- **App.tsx**: Add `<GameSpeedControl />` near turn counter
- **gameSlice.ts**: Check auto-pause triggers after turn processing
- **uiSlice.ts**: Add speed state and pause trigger settings

### Verification
- [ ] Clicking Pause stops auto-advance
- [ ] Fast mode auto-advances every 2 seconds
- [ ] Collision triggers auto-pause in Fast mode
- [ ] Manual turn button still works in Paused mode
- [ ] Speed persists across turns

---

## 2. Insurance Tier Selector

### Purpose
Deepen risk management with coverage levels (not just on/off)

### UI Design

**Location**: `control-panel-satellite.html` - replaces existing checkbox

**Component**: `InsuranceTierSelector.tsx`

**Before** (current):
```
┌────────────────────────────┐
│ ☑ Insurance                │
│ Cost: $3M + $500K insurance│
└────────────────────────────┘
```

**After** (Phase 1):
```
┌─────────────────────────────────────────┐
│ Insurance:                              │
│ ○ None ($0)                             │
│ ● Basic ($500K) → Pays $1M on collision│
│ ○ Premium ($1M) → Pays $2.5M           │
│                                         │
│ Total Cost: $3,500,000                 │
└─────────────────────────────────────────┘
```

### Data Model

```typescript
// Update types.ts
type InsuranceTier = 'none' | 'basic' | 'premium';

// Update Satellite interface
interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;  // CHANGED from boolean 'insured'
}

// Add to constants.ts
const INSURANCE_CONFIG = {
  none: { cost: 0, payout: 0 },
  basic: { cost: 500_000, payout: 1_000_000 },
  premium: { cost: 1_000_000, payout: 2_500_000 },
};
```

### Implementation

**New File**: `src/components/ControlPanel/InsuranceTierSelector.tsx`

```typescript
interface Props {
  selected: InsuranceTier;
  onChange: (tier: InsuranceTier) => void;
}

export function InsuranceTierSelector({ selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Insurance:</label>
      
      {(['none', 'basic', 'premium'] as InsuranceTier[]).map(tier => {
        const config = INSURANCE_CONFIG[tier];
        return (
          <RadioOption
            key={tier}
            checked={selected === tier}
            onChange={() => onChange(tier)}
            label={`${tier} ($${(config.cost / 1e6).toFixed(1)}M)`}
            description={config.payout > 0 
              ? `Pays $${(config.payout / 1e6).toFixed(1)}M on collision`
              : 'No coverage'
            }
          />
        );
      })}
    </div>
  );
}
```

**Update**: `src/components/ControlPanel/ControlPanel.tsx`

```typescript
const [insuranceTier, setInsuranceTier] = useState<InsuranceTier>('basic');

// Replace <InsuranceToggle /> with:
<InsuranceTierSelector 
  selected={insuranceTier}
  onChange={setInsuranceTier}
/>

// Update launch cost calculation
const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
const totalCost = launchCost + insuranceCost;
```

**Update**: `src/game/engine/collision.ts`

```typescript
function processInsurancePayout(satellite: Satellite): number {
  const config = INSURANCE_CONFIG[satellite.insuranceTier];
  return config.payout;
}
```

### Migration Strategy

**Backward Compatibility**:
```typescript
// When loading old save files with boolean 'insured'
function migrateSatellite(old: any): Satellite {
  return {
    ...old,
    insuranceTier: old.insured ? 'basic' : 'none',
  };
}
```

### Integration Points
- **ControlPanel.tsx**: Replace InsuranceToggle component
- **collision.ts**: Update payout calculation
- **gameSlice.ts**: Use insuranceTier in launchSatellite action
- **types.ts**: Update Satellite interface

### Verification
- [ ] Selecting "None" costs $0, no payout
- [ ] Selecting "Basic" costs $500K, pays $1M
- [ ] Selecting "Premium" costs $1M, pays $2.5M
- [ ] Total cost updates dynamically
- [ ] Collision triggers correct payout amount
- [ ] Old save files migrate correctly

---

## 3. DRV Target Priority

### Purpose
Make DRV choice more tactical by controlling debris targeting

### UI Design

**Location**: `control-panel-drv.html` - add after DRV Type selection

**Component**: `DRVTargetPriority.tsx`

**Before** (current):
```
┌──────────────────────────────────────┐
│ DRV Type:                            │
│ ● Cooperative  ○ Uncooperative       │
│                                      │
│ Cost: $10M                           │
│ Removes: 2-3 debris/turn (85%)       │
│ Active: 10 turns                     │
└──────────────────────────────────────┘
```

**After** (Phase 1):
```
┌──────────────────────────────────────┐
│ DRV Type:                            │
│ ● Cooperative  ○ Uncooperative       │
│                                      │
│ Target Priority:                     │
│ ● Auto (70% coop / 30% uncoop)       │
│ ○ Cooperative Focus (90% / 10%)      │
│ ○ Uncooperative Focus (10% / 90%)    │
│                                      │
│ Cost: $10M                           │
│ Removes: 2-3 debris/turn (85%)       │
│ Active: 10 turns                     │
└──────────────────────────────────────┘
```

### Data Model

```typescript
// Add to types.ts
type DRVTargetPriority = 'auto' | 'cooperative-focus' | 'uncooperative-focus';

// Update DebrisRemovalVehicle interface
interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  removalType: DRVType;
  targetPriority: DRVTargetPriority;  // NEW
  age: number;
  maxAge: number;
  capacity: number;
  successRate: number;
  debrisRemoved: number;
}

// Add to constants.ts
const DRV_PRIORITY_CONFIG = {
  'auto': { 
    cooperativeChance: 0.70, 
    costModifier: 1.0,
    description: '70% cooperative / 30% uncooperative'
  },
  'cooperative-focus': { 
    cooperativeChance: 0.90, 
    costModifier: 0.90,  // 10% discount
    description: '90% cooperative / 10% uncooperative'
  },
  'uncooperative-focus': { 
    cooperativeChance: 0.10, 
    costModifier: 1.20,  // 20% premium
    description: '10% cooperative / 90% uncooperative'
  },
};
```

### Implementation

**New File**: `src/components/DRVPanel/DRVTargetPriority.tsx`

```typescript
interface Props {
  selected: DRVTargetPriority;
  onChange: (priority: DRVTargetPriority) => void;
}

export function DRVTargetPriority({ selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Target Priority:</label>
      
      {(Object.keys(DRV_PRIORITY_CONFIG) as DRVTargetPriority[]).map(priority => {
        const config = DRV_PRIORITY_CONFIG[priority];
        return (
          <RadioOption
            key={priority}
            checked={selected === priority}
            onChange={() => onChange(priority)}
            label={priority.replace('-', ' ')}
            description={config.description}
          />
        );
      })}
    </div>
  );
}
```

**Update**: `src/game/engine/debrisRemoval.ts`

```typescript
function selectDebrisTarget(
  drv: DebrisRemovalVehicle, 
  debris: Debris[]
): Debris | null {
  const sameLayer = debris.filter(d => d.layer === drv.layer);
  if (sameLayer.length === 0) return null;
  
  const config = DRV_PRIORITY_CONFIG[drv.targetPriority];
  const targetCooperative = Math.random() < config.cooperativeChance;
  
  // Filter by priority
  const preferred = sameLayer.filter(d => 
    targetCooperative ? d.type === 'cooperative' : d.type === 'uncooperative'
  );
  
  // Fallback to any type if no preferred targets
  const candidates = preferred.length > 0 ? preferred : sameLayer;
  
  // Random selection from candidates
  return candidates[Math.floor(Math.random() * candidates.length)];
}
```

**Update**: `src/components/ControlPanel/ControlPanel.tsx`

```typescript
const [drvPriority, setDrvPriority] = useState<DRVTargetPriority>('auto');

// Calculate DRV cost with priority modifier
const baseCost = DRV_CONFIG.costs[selectedOrbit][drvType];
const priorityModifier = DRV_PRIORITY_CONFIG[drvPriority].costModifier;
const totalCost = baseCost * priorityModifier;
```

### Integration Points
- **control-panel-drv.html**: Add priority selector UI
- **ControlPanel.tsx**: Add priority state, update cost calculation
- **debrisRemoval.ts**: Use priority in target selection logic
- **gameSlice.ts**: Include priority in launchDebrisRemovalVehicle action

### Verification
- [ ] Auto priority targets 70/30 mix
- [ ] Cooperative focus targets cooperative debris 90% of time
- [ ] Uncooperative focus targets uncooperative 90% of time
- [ ] Cooperative focus reduces cost by 10%
- [ ] Uncooperative focus increases cost by 20%
- [ ] Priority persists across turns

---

## 4. Satellite Purpose Selector

### Purpose
Give players control over satellite type for mission targeting

### UI Design

**Location**: `control-panel-satellite.html` - add after Orbit Layer

**Component**: `SatellitePurposeSelector.tsx`

**Before** (current):
```
┌────────────────────────────┐
│ Orbit Layer:               │
│ ○ LEO  ● MEO  ○ GEO        │
└────────────────────────────┘
```

**After** (Phase 1):
```
┌────────────────────────────┐
│ Orbit Layer:               │
│ ○ LEO  ● MEO  ○ GEO        │
│                            │
│ Satellite Type:            │
│ ☁️ Weather  ● 📡 Comms     │
│ 🛰️ GPS  ○ 🎲 Random (-10%) │
└────────────────────────────┘
```

### Data Model

```typescript
// Already exists in types.ts, just need to make it selectable
type SatelliteType = 'Weather' | 'Comms' | 'GPS';

// Add to constants.ts
const SATELLITE_PURPOSE_CONFIG = {
  Weather: { icon: '☁️', discount: 0 },
  Comms: { icon: '📡', discount: 0 },
  GPS: { icon: '🛰️', discount: 0 },
  Random: { icon: '🎲', discount: 0.10 },  // 10% discount
};
```

### Implementation

**New File**: `src/components/SatelliteConfig/SatellitePurposeSelector.tsx`

```typescript
interface Props {
  selected: SatelliteType | 'Random';
  onChange: (purpose: SatelliteType | 'Random') => void;
}

export function SatellitePurposeSelector({ selected, onChange }: Props) {
  const options: (SatelliteType | 'Random')[] = ['Weather', 'Comms', 'GPS', 'Random'];
  
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Satellite Type:</label>
      
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => {
          const config = SATELLITE_PURPOSE_CONFIG[option];
          return (
            <RadioButton
              key={option}
              checked={selected === option}
              onChange={() => onChange(option)}
            >
              <span className="text-xl">{config.icon}</span>
              <span className="ml-2">{option}</span>
              {config.discount > 0 && (
                <span className="text-green-400 text-xs ml-1">
                  (-{(config.discount * 100).toFixed(0)}%)
                </span>
              )}
            </RadioButton>
          );
        })}
      </div>
    </div>
  );
}
```

**Update**: `src/components/ControlPanel/ControlPanel.tsx`

```typescript
const [satellitePurpose, setSatellitePurpose] = useState<SatelliteType | 'Random'>('Random');

// Calculate satellite cost with purpose discount
const baseCost = CONFIG.launch_cost[selectedOrbit];
const purposeDiscount = satellitePurpose === 'Random' 
  ? SATELLITE_PURPOSE_CONFIG.Random.discount 
  : 0;
const totalCost = baseCost * (1 - purposeDiscount) + insuranceCost;

// When launching
const finalPurpose = satellitePurpose === 'Random'
  ? (['Weather', 'Comms', 'GPS'] as SatelliteType[])[Math.floor(Math.random() * 3)]
  : satellitePurpose;

dispatch(launchSatellite({ 
  orbit: selectedOrbit, 
  insuranceTier,
  purpose: finalPurpose 
}));
```

**Update**: `src/store/slices/gameSlice.ts`

```typescript
// launchSatellite action now accepts purpose
interface LaunchSatellitePayload {
  orbit: OrbitLayer;
  insuranceTier: InsuranceTier;
  purpose: SatelliteType;  // NEW - no longer random
}

launchSatellite: (state, action: PayloadAction<LaunchSatellitePayload>) => {
  const { orbit, insuranceTier, purpose } = action.payload;
  
  // Create satellite with specified purpose (not random)
  const satellite: Satellite = {
    id: generateId(),
    ...randomPositionInLayer(orbit),
    layer: orbit,
    purpose,  // Use provided purpose
    age: 0,
    insuranceTier,
  };
  
  state.satellites.push(satellite);
}
```

### Integration Points
- **ControlPanel.tsx**: Add purpose selector, pass to launch action
- **gameSlice.ts**: Accept purpose parameter (remove random selection)
- **control-panel-satellite.html**: Add purpose selection UI

### Verification
- [ ] Can select Weather, Comms, GPS, or Random
- [ ] Random gives 10% discount
- [ ] Specific purpose costs standard price
- [ ] Random still randomizes at launch time
- [ ] Specific purpose launches exact type
- [ ] Mission tracking works with selected purposes

---

## 5. Budget Difficulty Modifier

### Purpose
Add replayability with different starting conditions

### UI Design

**Location**: New game setup screen (before game starts)

**Component**: `BudgetDifficultySettings.tsx`

```
┌─────────────────────────────────────────────┐
│          New Game Setup                     │
├─────────────────────────────────────────────┤
│                                             │
│ Budget Difficulty:                          │
│                                             │
│ ○ Easy                                      │
│   Starting: $150M                           │
│   Income: +$10M every 10 turns              │
│                                             │
│ ● Normal (Recommended)                      │
│   Starting: $100M                           │
│   Income: +$5M every 20 turns               │
│                                             │
│ ○ Hard                                      │
│   Starting: $75M                            │
│   Income: None                              │
│                                             │
│ ○ Challenge                                 │
│   Starting: $50M                            │
│   Drain: -$2M per turn                      │
│                                             │
│         [Start Game]                        │
└─────────────────────────────────────────────┘
```

### Data Model

```typescript
// Add to types.ts
type BudgetDifficulty = 'easy' | 'normal' | 'hard' | 'challenge';

// Add to GameState
interface GameState {
  // ... existing fields
  budgetDifficulty: BudgetDifficulty;
  budgetIncomeAmount: number;
  budgetIncomeInterval: number;
  budgetDrainAmount: number;
  nextIncomeAt: number;
}

// Add to constants.ts
const BUDGET_DIFFICULTY_CONFIG = {
  easy: {
    startingBudget: 150_000_000,
    incomeAmount: 10_000_000,
    incomeInterval: 10,
    drainAmount: 0,
    label: 'Easy',
    description: 'Generous budget with regular income',
  },
  normal: {
    startingBudget: 100_000_000,
    incomeAmount: 5_000_000,
    incomeInterval: 20,
    drainAmount: 0,
    label: 'Normal',
    description: 'Balanced challenge (recommended)',
  },
  hard: {
    startingBudget: 75_000_000,
    incomeAmount: 0,
    incomeInterval: 0,
    drainAmount: 0,
    label: 'Hard',
    description: 'Limited budget, no income',
  },
  challenge: {
    startingBudget: 50_000_000,
    incomeAmount: 0,
    incomeInterval: 0,
    drainAmount: 2_000_000,
    label: 'Challenge',
    description: 'Tight budget with drain per turn',
  },
};
```

### Implementation

**New File**: `src/components/Setup/BudgetDifficultySettings.tsx`

```typescript
interface Props {
  selected: BudgetDifficulty;
  onChange: (difficulty: BudgetDifficulty) => void;
}

export function BudgetDifficultySettings({ selected, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Budget Difficulty</h3>
      
      {(Object.keys(BUDGET_DIFFICULTY_CONFIG) as BudgetDifficulty[]).map(diff => {
        const config = BUDGET_DIFFICULTY_CONFIG[diff];
        return (
          <DifficultyOption
            key={diff}
            selected={selected === diff}
            onChange={() => onChange(diff)}
            label={config.label}
            description={config.description}
            details={
              <>
                <div>Starting: ${(config.startingBudget / 1e6).toFixed(0)}M</div>
                {config.incomeAmount > 0 && (
                  <div>Income: +${(config.incomeAmount / 1e6).toFixed(0)}M every {config.incomeInterval} turns</div>
                )}
                {config.drainAmount > 0 && (
                  <div className="text-red-400">Drain: -${(config.drainAmount / 1e6).toFixed(0)}M per turn</div>
                )}
                {config.incomeAmount === 0 && config.drainAmount === 0 && (
                  <div>Income: None</div>
                )}
              </>
            }
          />
        );
      })}
    </div>
  );
}
```

**New File**: `src/components/Setup/GameSetupScreen.tsx`

```typescript
export function GameSetupScreen({ onStart }: { onStart: () => void }) {
  const [difficulty, setDifficulty] = useState<BudgetDifficulty>('normal');
  const dispatch = useAppDispatch();
  
  const handleStart = () => {
    dispatch(initializeGame(difficulty));
    onStart();
  };
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">New Game Setup</h1>
      
      <BudgetDifficultySettings 
        selected={difficulty}
        onChange={setDifficulty}
      />
      
      <button 
        onClick={handleStart}
        className="mt-8 w-full py-3 bg-blue-600 rounded-lg"
      >
        Start Game
      </button>
    </div>
  );
}
```

**Update**: `src/store/slices/gameSlice.ts`

```typescript
// Add difficulty parameter to initialization
initializeGame: (state, action: PayloadAction<BudgetDifficulty>) => {
  const difficulty = action.payload;
  const config = BUDGET_DIFFICULTY_CONFIG[difficulty];
  
  return {
    ...initialState,
    budget: config.startingBudget,
    budgetDifficulty: difficulty,
    budgetIncomeAmount: config.incomeAmount,
    budgetIncomeInterval: config.incomeInterval,
    budgetDrainAmount: config.drainAmount,
    nextIncomeAt: config.incomeInterval,
  };
},

// Process budget changes each turn
advanceTurn: (state) => {
  state.step += 1;
  
  // Process budget drain
  if (state.budgetDrainAmount > 0) {
    state.budget -= state.budgetDrainAmount;
  }
  
  // Process budget income
  if (state.budgetIncomeInterval > 0 && state.step >= state.nextIncomeAt) {
    state.budget += state.budgetIncomeAmount;
    state.nextIncomeAt += state.budgetIncomeInterval;
  }
  
  // ... rest of turn logic
},
```

### Integration Points
- **App.tsx**: Show GameSetupScreen before game starts
- **gameSlice.ts**: Initialize with difficulty, process income/drain
- **New route/screen**: GameSetupScreen component

### Verification
- [ ] Easy mode starts with $150M, gets $10M every 10 turns
- [ ] Normal mode starts with $100M, gets $5M every 20 turns
- [ ] Hard mode starts with $75M, no income
- [ ] Challenge mode starts with $50M, loses $2M per turn
- [ ] Budget updates correctly each turn
- [ ] Difficulty persists in save file

---

## Implementation Order

### Step 1: Data Model Updates
1. Update `types.ts` with new types
2. Update `constants.ts` with config objects
3. Update `gameSlice.ts` and `uiSlice.ts` with new state fields

### Step 2: Core Components (Satellite/DRV Controls)
4. Implement `InsuranceTierSelector` (replaces existing)
5. Implement `SatellitePurposeSelector` (new)
6. Implement `DRVTargetPriority` (new)
7. Update `ControlPanel.tsx` to use new components

### Step 3: Game Logic
8. Update `collision.ts` for insurance tier payouts
9. Update `debrisRemoval.ts` for target priority
10. Update `gameSlice.ts` launch actions

### Step 4: UI Controls
11. Implement `GameSpeedControl` component
12. Implement `useGameSpeed` hook
13. Add to main game UI

### Step 5: Setup Screen
14. Create `GameSetupScreen` component
15. Implement `BudgetDifficultySettings`
16. Update `App.tsx` routing

### Step 6: Integration & Testing
17. Test each input individually
18. Test input combinations
19. Test save/load with new fields
20. Visual polish and refinement

---

## Testing Checklist

### Unit Tests
- [ ] Insurance tier payout calculations
- [ ] DRV target selection with different priorities
- [ ] Budget income/drain processing
- [ ] Satellite purpose discount calculation
- [ ] Game speed state transitions

### Integration Tests
- [ ] Launch satellite with all insurance tiers
- [ ] Launch DRV with each target priority
- [ ] Auto-pause triggers in Fast mode
- [ ] Budget income triggers at correct turns
- [ ] Satellite purpose affects mission tracking

### UI Tests
- [ ] All selectors render correctly
- [ ] Cost updates when changing selections
- [ ] Game speed controls work
- [ ] Setup screen initializes game correctly

### Save/Load Tests
- [ ] Save game with Phase 1 inputs
- [ ] Load old saves (backward compatibility)
- [ ] All input states persist correctly

---

## Files Changed

### New Files (11)
```
src/components/TimeControl/GameSpeedControl.tsx
src/components/ControlPanel/InsuranceTierSelector.tsx
src/components/DRVPanel/DRVTargetPriority.tsx
src/components/SatelliteConfig/SatellitePurposeSelector.tsx
src/components/Setup/GameSetupScreen.tsx
src/components/Setup/BudgetDifficultySettings.tsx
src/hooks/useGameSpeed.ts
```

### Modified Files (8)
```
src/store/slices/gameSlice.ts        # Launch actions, budget processing
src/store/slices/uiSlice.ts          # Game speed state
src/game/engine/collision.ts         # Insurance payouts
src/game/engine/debrisRemoval.ts     # Target priority
src/components/ControlPanel/ControlPanel.tsx  # Integrate new selectors
src/game/types.ts                    # New types
src/game/constants.ts                # Config objects
src/App.tsx                          # Add setup screen, game speed control
```

---

## Success Criteria

### Player Experience
- Players can control game pacing without feeling rushed
- Insurance choices feel meaningful (not just on/off)
- DRV targeting enables tactical debris management
- Satellite purpose selection supports mission strategies
- Difficulty levels provide replayability

### Technical Quality
- All inputs work without bugs
- State management is clean and testable
- UI is responsive and intuitive
- Save/load works with new fields
- Performance is not impacted

### Balance
- No single input creates a "win button"
- Difficulty levels are challenging but fair
- Insurance tiers have clear trade-offs
- DRV priorities enable different strategies
