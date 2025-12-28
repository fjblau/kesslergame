# Technical Specification: Risk-Based Game Speed

## Task Complexity
**Medium** - Moderate implementation touching multiple components following established patterns

## Technical Context
- **Language**: TypeScript
- **Framework**: React 19 with Redux Toolkit
- **UI**: Tailwind CSS
- **Build**: Vite
- **Linting**: ESLint
- **Testing**: No test framework found in project

## Current Implementation Analysis

### Game Speed System
The game currently has a fixed interval-based speed system (`kessler-game/src/hooks/useGameSpeed.ts:67`):
- **Normal speed**: 4000ms per turn
- **Fast speed**: 2000ms per turn
- **Paused**: No progression

### Risk Level System
Already exists (`kessler-game/src/game/engine/risk.ts`):
- **LOW**: < 150 debris
- **MEDIUM**: 150-300 debris  
- **CRITICAL**: > 300 debris

### Configuration Page
Located at `kessler-game/src/App.tsx:70-79`, contains sliders for:
- Collision settings
- Orbital speed settings
- Solar storm settings
- DRV settings

All configuration settings follow a consistent pattern with localStorage persistence.

## Requirements Interpretation

The task asks to make game speed **risk-based**, where:
- **LOW risk** → current speed (baseline, multiplier = 1.0)
- **MEDIUM risk** → slower (more time to react, multiplier > 1.0)
- **CRITICAL risk** → even slower (most time to react, multiplier > 1.0, higher than MEDIUM)

**Note**: "Slower" means longer intervals between turns, giving players more time to observe and react to the game state.

## Implementation Approach

### 1. Data Model Changes

**File**: `kessler-game/src/game/types.ts`

Add risk-based speed multipliers to `GameState` interface:
```typescript
interface GameState {
  // ... existing fields
  riskSpeedMultipliers: {
    LOW: number;
    MEDIUM: number;
    CRITICAL: number;
  };
}
```

**File**: `kessler-game/src/game/constants.ts`

Add default multiplier constants:
```typescript
export const RISK_SPEED_MULTIPLIERS = {
  LOW: 1.0,      // Baseline speed (4s normal, 2s fast)
  MEDIUM: 1.5,   // 50% slower (6s normal, 3s fast)
  CRITICAL: 2.0, // 100% slower (8s normal, 4s fast)
};
```

**Rationale**: LOW is fixed at 1.0x as the baseline. MEDIUM and CRITICAL use higher multipliers to slow the game, giving players more time to react in dangerous situations.

### 2. State Management Changes

**File**: `kessler-game/src/store/slices/gameSlice.ts`

#### Add localStorage Load Function (insert after line 88)
```typescript
function loadRiskSpeedSettings() {
  try {
    const low = localStorage.getItem('riskSpeedMultiplierLOW');
    const medium = localStorage.getItem('riskSpeedMultiplierMEDIUM');
    const critical = localStorage.getItem('riskSpeedMultiplierCRITICAL');
    return {
      LOW: low ? parseFloat(low) : RISK_SPEED_MULTIPLIERS.LOW,
      MEDIUM: medium ? parseFloat(medium) : RISK_SPEED_MULTIPLIERS.MEDIUM,
      CRITICAL: critical ? parseFloat(critical) : RISK_SPEED_MULTIPLIERS.CRITICAL,
    };
  } catch {
    return {
      LOW: RISK_SPEED_MULTIPLIERS.LOW,
      MEDIUM: RISK_SPEED_MULTIPLIERS.MEDIUM,
      CRITICAL: RISK_SPEED_MULTIPLIERS.CRITICAL,
    };
  }
}
```

#### Load Settings on Initialization (after line 93)
```typescript
const savedRiskSpeedSettings = loadRiskSpeedSettings();
```

#### Add to Initial State (in initialState object)
```typescript
riskSpeedMultipliers: {
  LOW: savedRiskSpeedSettings.LOW,
  MEDIUM: savedRiskSpeedSettings.MEDIUM,
  CRITICAL: savedRiskSpeedSettings.CRITICAL,
},
```

#### Add Reducer Actions (in reducers section, following existing pattern)
Three separate actions for each risk level:
```typescript
setRiskSpeedMultiplierLOW: (state, action: PayloadAction<number>) => {
  state.riskSpeedMultipliers.LOW = action.payload;
  try {
    localStorage.setItem('riskSpeedMultiplierLOW', action.payload.toString());
  } catch {
    // Ignore localStorage errors
  }
},

setRiskSpeedMultiplierMEDIUM: (state, action: PayloadAction<number>) => {
  state.riskSpeedMultipliers.MEDIUM = action.payload;
  try {
    localStorage.setItem('riskSpeedMultiplierMEDIUM', action.payload.toString());
  } catch {
    // Ignore localStorage errors
  }
},

setRiskSpeedMultiplierCRITICAL: (state, action: PayloadAction<number>) => {
  state.riskSpeedMultipliers.CRITICAL = action.payload;
  try {
    localStorage.setItem('riskSpeedMultiplierCRITICAL', action.payload.toString());
  } catch {
    // Ignore localStorage errors
  }
},
```

#### Export Actions
```typescript
export const { 
  // ... existing exports
  setRiskSpeedMultiplierLOW,
  setRiskSpeedMultiplierMEDIUM,
  setRiskSpeedMultiplierCRITICAL,
} = gameSlice.actions;
```

### 3. Game Logic Changes

**File**: `kessler-game/src/hooks/useGameSpeed.ts`

#### Import RiskLevel type (add to line 3 imports)
```typescript
import type { RiskLevel } from '../game/types';
```

#### Modify Interval Calculation (replace line 67)

**Before**:
```typescript
const intervalDuration = speed === 'fast' ? 2000 : 4000;
```

**After**:
```typescript
const baseInterval = speed === 'fast' ? 2000 : 4000;
const multiplier = gameState.riskSpeedMultipliers[riskLevel];
const intervalDuration = Math.round(baseInterval * multiplier);
```

**Note**: `Math.round()` ensures we get an integer millisecond value.

#### Update useEffect Dependencies (line 141)

**Before**:
```typescript
}, [speed, budget, autoPauseBudgetLow, dispatch]);
```

**After**:
```typescript
}, [speed, budget, autoPauseBudgetLow, gameState.riskSpeedMultipliers, riskLevel, dispatch]);
```

**Note**: Added `gameState.riskSpeedMultipliers` and `riskLevel` to dependencies since we're now using them.

### 4. UI Changes

**New File**: `kessler-game/src/components/Configuration/RiskBasedSpeedSettings.tsx`

Create component following the pattern of `OrbitalSpeedSettings.tsx`:

```typescript
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  setRiskSpeedMultiplierLOW,
  setRiskSpeedMultiplierMEDIUM,
  setRiskSpeedMultiplierCRITICAL
} from '../../store/slices/gameSlice';

export function RiskBasedSpeedSettings() {
  const multipliers = useAppSelector(state => state.game.riskSpeedMultipliers);
  const dispatch = useAppDispatch();

  const calculateInterval = (baseInterval: number, multiplier: number) => {
    return (baseInterval * multiplier) / 1000;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Risk-Based Game Speed</h2>
      <p className="text-sm text-gray-400 mb-4">
        Control how fast the game progresses at different risk levels. Higher multipliers = slower game speed = more time to react.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            LOW Risk: {multipliers.LOW.toFixed(2)}x 
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.LOW).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.LOW).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="1.0"
            step="0.1"
            value={multipliers.LOW}
            onChange={(e) => dispatch(setRiskSpeedMultiplierLOW(Number(e.target.value)))}
            className="flex-1"
            disabled
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            MEDIUM Risk: {multipliers.MEDIUM.toFixed(2)}x
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.MEDIUM).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.MEDIUM).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={multipliers.MEDIUM}
            onChange={(e) => dispatch(setRiskSpeedMultiplierMEDIUM(Number(e.target.value)))}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            CRITICAL Risk: {multipliers.CRITICAL.toFixed(2)}x
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.CRITICAL).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.CRITICAL).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={multipliers.CRITICAL}
            onChange={(e) => dispatch(setRiskSpeedMultiplierCRITICAL(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
```

**Design Decisions**:
- LOW multiplier is fixed at 1.0x (disabled slider) as the baseline
- MEDIUM and CRITICAL range from 1.0x to 3.0x (slower only, not faster)
- Display calculated interval times for both Normal and Fast speeds to help users understand impact
- Follow existing component styling patterns

**File**: `kessler-game/src/App.tsx`

#### Import Component (add to imports around line 15)
```typescript
import { RiskBasedSpeedSettings } from './components/Configuration/RiskBasedSpeedSettings';
```

#### Add to Configuration Tab (insert after line 76, before `<DRVSettings />`)
```typescript
<RiskBasedSpeedSettings />
```

### 5. Files Summary

#### Files to Create (1)
- `kessler-game/src/components/Configuration/RiskBasedSpeedSettings.tsx`

#### Files to Modify (5)
- `kessler-game/src/game/types.ts` - Add `riskSpeedMultipliers` to `GameState`
- `kessler-game/src/game/constants.ts` - Add `RISK_SPEED_MULTIPLIERS` constant
- `kessler-game/src/store/slices/gameSlice.ts` - Add load function, initial state, reducers, exports
- `kessler-game/src/hooks/useGameSpeed.ts` - Apply risk-based multipliers, update dependencies
- `kessler-game/src/App.tsx` - Import and add configuration component

## Verification Approach

### Manual Testing
1. **Initial State**: Start game and verify default multipliers (1.0x, 1.5x, 2.0x) are loaded
2. **Configuration UI**: Navigate to Configuration tab and verify:
   - Three sliders visible for risk-based speed
   - LOW slider is disabled and fixed at 1.0x
   - MEDIUM and CRITICAL sliders work (1.0x - 3.0x range)
   - Calculated interval times display correctly
3. **Speed Behavior**: Play game and observe speed changes as risk level changes:
   - Start with LOW risk (< 150 debris) - verify baseline speed (4s normal, 2s fast)
   - Increase debris to MEDIUM (150-300) - verify slower speed (6s normal, 3s fast with default 1.5x)
   - Increase debris to CRITICAL (> 300) - verify even slower speed (8s normal, 4s fast with default 2.0x)
4. **Slider Configuration**: Adjust MEDIUM to 2.5x and CRITICAL to 3.0x, verify speeds change accordingly
5. **localStorage Persistence**: 
   - Adjust multipliers
   - Refresh page
   - Verify settings persist across page reloads
6. **Game Reset**: Click Reset button, verify multipliers remain unchanged (persist across game sessions)
7. **Interaction Testing**: Test with normal/fast speed controls to ensure multipliers apply correctly

### Linting
```bash
cd kessler-game
npm run lint
```

### Build
```bash
cd kessler-game
npm run build
```

## Edge Cases & Considerations

1. **Multiplier Bounds**: 
   - LOW fixed at 1.0x (no adjustment)
   - MEDIUM and CRITICAL constrained to 1.0x - 3.0x
   - Prevents extreme speeds that could break gameplay
   
2. **localStorage Persistence**: 
   - Settings persist across game sessions (not reset on game reset)
   - Consistent with other configuration settings (collision, orbital speed, etc.)
   - Try-catch blocks handle localStorage failures gracefully
   
3. **Integer Intervals**: 
   - Use `Math.round()` to ensure integer millisecond values
   - Prevents potential timing precision issues
   
4. **useEffect Dependencies**: 
   - Properly include `riskLevel` and `gameState.riskSpeedMultipliers`
   - Ensures interval recalculates when risk level or multipliers change
   
5. **UI Feedback**: 
   - Display calculated interval times (e.g., "Normal: 6.0s, Fast: 3.0s")
   - Helps users understand the actual impact of their settings
   
6. **Auto-Pause Interaction**: 
   - Risk-based speed works with existing auto-pause features
   - Speed adjustment doesn't interfere with pause state

7. **TypeScript Type Safety**:
   - Import `RiskLevel` type where needed
   - Properly type all actions and state

## Success Criteria

- [x] Specification completed with all implementation details
- [ ] Configuration page has three sliders for risk-based speed multipliers
- [ ] LOW multiplier is fixed at 1.0x (baseline)
- [ ] MEDIUM and CRITICAL multipliers are configurable (1.0x - 3.0x)
- [ ] Game speed adjusts automatically based on current risk level
- [ ] Multipliers persist in localStorage across page reloads
- [ ] Multipliers persist across game resets (like other settings)
- [ ] Calculated interval times display in UI
- [ ] No TypeScript errors or linting issues
- [ ] Build succeeds without errors
- [ ] Game remains playable and responsive at all multiplier settings
