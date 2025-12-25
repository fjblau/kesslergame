# Technical Specification: Risk Level Calculation

## Task Overview
Implement a risk level calculation system based on debris count that automatically categorizes the orbital environment into LOW, MEDIUM, or CRITICAL risk levels. The system will also support auto-pausing the game when risk levels change, if enabled in UI settings.

## Technical Context

### Language & Framework
- **TypeScript 5.9.3**: Strongly typed JavaScript with strict mode enabled
- **React 19.2.0**: UI framework using functional components and hooks
- **Redux Toolkit 2.11.2**: State management with slices pattern
- **Vite 7.2.4**: Build tool and development server

### Project Structure
- **State Management**: Redux slices in `src/store/slices/`
- **Game Engine**: Pure functions in `src/game/engine/`
- **Type Definitions**: Centralized in `src/game/types.ts`
- **Game Logic Flow**: Turn-based with actions dispatched in sequence

### Existing Patterns
1. **Engine Modules**: Pure functions that perform calculations (e.g., `collision.ts`, `debrisRemoval.ts`)
2. **State Updates**: Redux reducers handle all state mutations in `gameSlice.ts`
3. **Auto-Pause Pattern**: Implemented in `useGameSpeed.ts` hook - checks conditions and dispatches `setGameSpeed('paused')`
4. **Type Safety**: All interfaces defined in `types.ts`, imported where needed

## Requirements

### Risk Level Thresholds
- **LOW**: debris count < 150
- **MEDIUM**: 150 ≤ debris count ≤ 300
- **CRITICAL**: debris count > 300

### Auto-Pause Behavior
- Pause game automatically when risk level changes
- Only trigger if `autoPauseOnRiskChange` is `true` in UI settings
- The `autoPauseOnRiskChange` field already exists in `UIState` (line 68 of `types.ts`)

## Implementation Approach

### 1. Create Risk Type Definition
Add a new type to `src/game/types.ts`:
```typescript
export type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';
```

### 2. Create Risk Calculation Engine Module
Create `src/game/engine/risk.ts` with a pure function:
```typescript
export function calculateRiskLevel(debrisCount: number): RiskLevel
```

This follows the existing pattern of engine modules (e.g., `collision.ts`, `debrisRemoval.ts`) being pure calculation functions.

### 3. Update GameState Interface
Add `riskLevel` field to `GameState` interface in `src/game/types.ts`:
```typescript
export interface GameState {
  // ... existing fields
  riskLevel: RiskLevel;
}
```

### 4. Update Game Slice
Modify `src/store/slices/gameSlice.ts`:
- Import the `calculateRiskLevel` function and `RiskLevel` type
- Add `riskLevel: 'LOW'` to `initialState`
- Create a new reducer `updateRiskLevel` that:
  - Calculates the new risk level based on `state.debris.length`
  - Updates `state.riskLevel`
- Export the new action

### 5. Integrate Risk Updates into Game Loop
The risk level should be updated after any action that changes debris count:
- After `processCollisions` (adds debris)
- After `processDRVOperations` (removes debris)
- After `decommissionExpiredDRVs` (adds debris from expired DRVs)

However, looking at the existing code, these are called separately from components. The best approach is to:
- Call `updateRiskLevel` from the components/hooks after debris-changing operations
- OR add risk level calculation directly into the reducers that change debris

**Decision**: Calculate risk level in each reducer that modifies debris to ensure it's always in sync.

### 6. Implement Auto-Pause on Risk Change
Two approaches:
1. **In reducer (not recommended)**: Redux best practice discourages dispatching actions from reducers
2. **In hook/component (recommended)**: Check for risk level changes in a hook similar to `useGameSpeed.ts`

**Recommended approach**: Create or modify existing game loop hook to:
- Track previous risk level
- Detect when risk level changes
- Check if `autoPauseOnRiskChange` is enabled
- Dispatch `setGameSpeed('paused')` if conditions are met

Looking at the codebase, `useGameSpeed.ts` already handles auto-pause for budget. We can extend this pattern or create a separate effect.

## Source Code Changes

### Files to Create
1. **`kessler-game/src/game/engine/risk.ts`** (new)
   - Export `calculateRiskLevel` function
   - Pure function with no dependencies

### Files to Modify
1. **`kessler-game/src/game/types.ts`**
   - Add `RiskLevel` type export
   - Add `riskLevel: RiskLevel` field to `GameState` interface

2. **`kessler-game/src/store/slices/gameSlice.ts`**
   - Import `calculateRiskLevel` and `RiskLevel`
   - Add `riskLevel: 'LOW'` to `initialState`
   - Update risk level in relevant reducers:
     - `processCollisions` - after debris is added
     - `processDRVOperations` - after debris is removed
     - `decommissionExpiredDRVs` - after debris is added

3. **`kessler-game/src/hooks/useGameSpeed.ts`** (or create new hook)
   - Add risk level change detection
   - Implement auto-pause logic when `autoPauseOnRiskChange` is true and risk level changes

## Data Model Changes

### GameState Interface
```typescript
export interface GameState {
  step: number;
  maxSteps: number;
  satellites: Satellite[];
  debris: Debris[];
  debrisRemovalVehicles: DebrisRemovalVehicle[];
  budget: number;
  budgetDifficulty: BudgetDifficulty;
  budgetIncomeAmount: number;
  budgetIncomeInterval: number;
  budgetDrainAmount: number;
  nextIncomeAt: number;
  history: TurnHistory[];
  riskLevel: RiskLevel;  // NEW FIELD
}
```

### New Type
```typescript
export type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';
```

## Verification Approach

### 1. Type Checking
Run TypeScript compiler:
```bash
npm run build
```
Expected: No type errors

### 2. Linting
Run ESLint:
```bash
npm run lint
```
Expected: No linting errors

### 3. Manual Testing
Test scenarios:
1. **Initial state**: Verify riskLevel starts as 'LOW'
2. **Add debris to 150**: Should transition to 'MEDIUM'
3. **Add debris to 301**: Should transition to 'CRITICAL'
4. **Remove debris below 150**: Should transition to 'LOW'
5. **Auto-pause enabled**: Risk change should pause game
6. **Auto-pause disabled**: Risk change should NOT pause game

### 4. Edge Cases
- Exactly 150 debris: Should be 'MEDIUM'
- Exactly 300 debris: Should be 'MEDIUM'
- Exactly 301 debris: Should be 'CRITICAL'
- 0 debris: Should be 'LOW'

## Complexity Assessment
**Difficulty: Easy**

Rationale:
- Straightforward implementation following established patterns
- Clear requirements with no ambiguity
- Pure function with simple conditional logic
- State integration follows existing Redux patterns
- Auto-pause pattern already exists in codebase
- No complex edge cases or architectural decisions
- Well-defined interfaces and types

## Implementation Notes

1. **Pure Functions**: Keep `calculateRiskLevel` pure for testability
2. **State Consistency**: Always update risk level when debris count changes
3. **Performance**: Risk calculation is O(1) - simple comparison
4. **Type Safety**: Leverage TypeScript's type system for RiskLevel
5. **Reducer Pattern**: Keep reducers pure, side effects (auto-pause) in hooks
