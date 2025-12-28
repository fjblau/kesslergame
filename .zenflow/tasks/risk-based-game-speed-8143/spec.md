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
The game currently has a fixed interval-based speed system (`useGameSpeed.ts:67`):
- **Normal speed**: 4000ms per turn
- **Fast speed**: 2000ms per turn
- **Paused**: No progression

### Risk Level System
Already exists (`game/engine/risk.ts`):
- **LOW**: < 150 debris
- **MEDIUM**: 150-300 debris  
- **CRITICAL**: > 300 debris

### Configuration Page
Located at `App.tsx:70-79`, contains sliders for:
- Collision settings
- Orbital speed settings
- Solar storm settings
- DRV settings

## Requirements Interpretation

The task asks to make game speed **risk-based**, where:
- **LOW risk** → current speed (baseline, multiplier = 1.0)
- **MEDIUM risk** → slower (more time to react, multiplier > 1.0)
- **CRITICAL risk** → even slower (most time to react, multiplier > 1.0, higher than MEDIUM)

**Note**: "Slower" means longer intervals between turns, giving players more time to observe and react to the game state.

## Implementation Approach

### 1. Data Model Changes

Add risk-based speed multipliers to `GameState` in `game/types.ts`:
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

Add to constants in `game/constants.ts`:
```typescript
export const RISK_SPEED_MULTIPLIERS = {
  LOW: 1.0,      // Current speed (baseline)
  MEDIUM: 1.5,   // 50% slower (6s normal, 3s fast)
  CRITICAL: 2.0, // 100% slower (8s normal, 4s fast)
};
```

### 2. Game Logic Changes

**File**: `hooks/useGameSpeed.ts`
- Modify line 67 to apply risk-based multiplier
- Calculate effective interval: `baseInterval * multiplier`
- Use current `riskLevel` from state to select appropriate multiplier

**Before**:
```typescript
const intervalDuration = speed === 'fast' ? 2000 : 4000;
```

**After**:
```typescript
const baseInterval = speed === 'fast' ? 2000 : 4000;
const multiplier = gameState.riskSpeedMultipliers[riskLevel];
const intervalDuration = baseInterval * multiplier;
```

### 3. State Management Changes

**File**: `store/slices/gameSlice.ts`
- Add `riskSpeedMultipliers` to initial state
- Create reducer actions:
  - `setRiskSpeedMultiplier(payload: { riskLevel: RiskLevel; multiplier: number })`

### 4. UI Changes

**New File**: `components/Configuration/RiskBasedSpeedSettings.tsx`
- Create component following pattern of `OrbitalSpeedSettings.tsx`
- Three sliders for LOW, MEDIUM, CRITICAL multipliers
- Range: 0.5x (faster) to 3.0x (slower)
- Display current multiplier value and resulting interval time

**File**: `App.tsx`
- Import and add `<RiskBasedSpeedSettings />` to Configuration tab (line 73-78)

### 5. Files to Create
- `src/components/Configuration/RiskBasedSpeedSettings.tsx`

### 6. Files to Modify
- `src/game/types.ts` - Add multipliers to GameState
- `src/game/constants.ts` - Add default multiplier constants
- `src/store/slices/gameSlice.ts` - Add state and reducers
- `src/hooks/useGameSpeed.ts` - Apply risk-based multipliers
- `src/App.tsx` - Add new configuration component

## Verification Approach

### Manual Testing
1. Start game and verify initial speed behavior
2. Navigate to Configuration tab and verify sliders appear
3. Adjust risk speed multipliers and verify they persist in state
4. Play game and observe speed changes as debris count changes risk levels:
   - Start with LOW risk (< 150 debris) - verify baseline speed
   - Increase debris to MEDIUM (150-300) - verify slower speed
   - Increase debris to CRITICAL (> 300) - verify even slower speed
5. Test interaction with normal/fast speed controls
6. Verify sliders work correctly (values update, constraints enforced)

### Linting
Run `npm run lint` to ensure code quality

### Build
Run `npm run build` to verify TypeScript compilation

## Edge Cases & Considerations

1. **Multiplier bounds**: Constrain slider values (0.5 - 3.0) to prevent extreme speeds
2. **State persistence**: Multipliers should persist during game session
3. **Reset behavior**: Verify multipliers reset to defaults on game reset
4. **UI feedback**: Display calculated interval times to help users understand impact
5. **Auto-pause interaction**: Risk-based speed should work with auto-pause features

## Success Criteria

- [ ] Configuration page has three sliders for risk-based speed multipliers
- [ ] Game speed adjusts automatically based on current risk level
- [ ] Multipliers are configurable and persist during game session
- [ ] No TypeScript errors or linting issues
- [ ] Build succeeds without errors
- [ ] Game remains playable and responsive at all multiplier settings
