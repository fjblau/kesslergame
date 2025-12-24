# Technical Specification: DRV Debris Removal Execution

## Overview
Implement the core DRV (Debris Removal Vehicle) debris removal execution logic that processes each active DRV per turn, allowing them to remove debris from the game state based on their capacity and success rate.

## Technical Context

### Language & Dependencies
- **Language**: TypeScript
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Existing Utilities**:
  - `selectDebrisTarget()` - already implemented in `debrisRemoval.ts`
  - `attemptDebrisRemoval()` - already implemented in `debrisRemoval.ts`

### Project Structure
```
kessler-game/src/
├── game/
│   ├── types.ts                 # TypeScript interfaces and types
│   ├── constants.ts             # Game configuration constants
│   └── engine/
│       ├── debrisRemoval.ts     # DRV logic (to be extended)
│       └── collision.ts         # Collision processing
└── store/
    └── slices/
        └── gameSlice.ts         # Redux game state slice (to be extended)
```

## Data Model

### Existing Types (from `types.ts`)

```typescript
export interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;              // LEO, MEO, or GEO
  removalType: DRVType;           // 'cooperative' | 'uncooperative'
  targetPriority: DRVTargetPriority; // 'auto' | 'cooperative-focus' | 'uncooperative-focus'
  age: number;                    // Current age in turns
  maxAge: number;                 // Lifetime duration (10 for cooperative, 8 for uncooperative)
  capacity: number;               // Max debris removable (2-3 for cooperative, 1-2 for uncooperative)
  successRate: number;            // Removal success rate (0.85 for cooperative, 0.60 for uncooperative)
  debrisRemoved: number;          // Counter of successfully removed debris
}

export interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;               // 'cooperative' | 'uncooperative'
}

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
}
```

## Implementation Approach

### 1. Extend `debrisRemoval.ts`

Create a new function `processDRVRemoval()` that:
- Takes a DRV and the current debris array
- Returns an object containing:
  - `removedDebrisIds`: array of debris IDs that were removed
  - `attemptsCount`: number of removal attempts made
  
**Algorithm**:
1. Loop up to `drv.capacity` times
2. For each iteration:
   - Call `selectDebrisTarget(drv, debris)` to get target debris
   - If no target found, break loop
   - Call `attemptDebrisRemoval(drv)` to check if removal succeeds
   - If successful, add debris ID to removal list
   - Filter out selected debris from available debris for next iteration
3. Return results

**Function Signature**:
```typescript
export function processDRVRemoval(
  drv: DebrisRemovalVehicle, 
  debris: Debris[]
): {
  removedDebrisIds: string[];
  attemptsCount: number;
}
```

### 2. Add Redux Action to `gameSlice.ts`

Create a new reducer `processDRVOperations` that:
- Processes all active DRVs in the game state
- Filters out expired DRVs (age >= maxAge)
- For each active DRV:
  - Call `processDRVRemoval(drv, state.debris)`
  - Update `drv.debrisRemoved` counter
  - Remove debris from `state.debris` array
  
**Integration Point**:
- Call this reducer from within the existing `advanceTurn` reducer
- Should be called AFTER aging DRVs but BEFORE other operations

**Reducer Logic**:
```typescript
processDRVOperations: (state) => {
  // Filter active DRVs (age < maxAge)
  const activeDRVs = state.debrisRemovalVehicles.filter(drv => drv.age < drv.maxAge);
  
  // Process each DRV
  activeDRVs.forEach(drv => {
    const result = processDRVRemoval(drv, state.debris);
    
    // Update DRV counter
    drv.debrisRemoved += result.removedDebrisIds.length;
    
    // Remove debris from state
    state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
  });
}
```

### 3. Integrate with `advanceTurn`

Modify the existing `advanceTurn` reducer to call `processDRVOperations`:

```typescript
advanceTurn: (state) => {
  state.step += 1;

  // Budget processing (existing)
  if (state.budgetDrainAmount > 0) {
    state.budget -= state.budgetDrainAmount;
  }
  if (state.budgetIncomeInterval > 0 && state.step >= state.nextIncomeAt) {
    state.budget += state.budgetIncomeAmount;
    state.nextIncomeAt += state.budgetIncomeInterval;
  }

  // Age entities (existing)
  state.satellites.forEach(sat => sat.age++);
  state.debrisRemovalVehicles.forEach(drv => drv.age++);
  
  // NEW: Process DRV removal operations
  gameSlice.caseReducers.processDRVOperations(state);
}
```

## Source Code Changes

### Files to Modify

1. **`kessler-game/src/game/engine/debrisRemoval.ts`**
   - Add `processDRVRemoval()` function
   - Import existing `selectDebrisTarget` and `attemptDebrisRemoval`

2. **`kessler-game/src/store/slices/gameSlice.ts`**
   - Import `processDRVRemoval` from `debrisRemoval.ts`
   - Add `processDRVOperations` reducer
   - Modify `advanceTurn` to call `processDRVOperations`
   - Export `processDRVOperations` action (if needed independently)

### No New Files Required
All changes extend existing files.

## Verification Approach

### Unit Testing Strategy
Since this is an easy complexity task, verification will focus on:

1. **Manual Testing**:
   - Launch DRVs with different types and configurations
   - Observe debris removal over multiple turns
   - Verify `debrisRemoved` counter increments correctly
   - Verify debris is actually removed from game state
   - Check that DRV capacity limits are respected

2. **Type Checking**:
   - Run TypeScript compiler to ensure type safety
   - Verify no type errors introduced

3. **Lint Checks**:
   - Run project's linter to ensure code quality
   - Follow existing code style conventions

### Test Scenarios
- **Scenario 1**: DRV with capacity 3 in layer with 5+ debris pieces
  - Expected: Up to 3 debris removed (based on success rate)
  
- **Scenario 2**: DRV with capacity 2 in layer with 1 debris
  - Expected: 0-1 debris removed (limited by availability)
  
- **Scenario 3**: DRV reaches maxAge
  - Expected: Should not process in subsequent turns

- **Scenario 4**: Multiple DRVs in same layer
  - Expected: Each processes independently, debris pool decreases

## Edge Cases & Considerations

1. **No debris in layer**: `selectDebrisTarget` returns null, DRV does nothing
2. **Expired DRVs**: Filter by `age < maxAge` before processing
3. **Success rate**: Some attempts will fail (randomized)
4. **Capacity limits**: DRV stops after capacity attempts, even if debris remains
5. **Multiple DRVs**: Process sequentially; later DRVs see reduced debris pool
6. **State mutation**: Using Redux Toolkit's Immer, so direct mutation is safe

## Implementation Complexity
**Easy** - Straightforward implementation using existing utilities, minimal edge cases, clear requirements.

## Success Criteria
- [ ] DRVs remove debris each turn based on capacity
- [ ] Success rate is properly applied via `attemptDebrisRemoval`
- [ ] `debrisRemoved` counter increments correctly
- [ ] Debris is removed from game state
- [ ] Expired DRVs (age >= maxAge) do not process
- [ ] No TypeScript errors
- [ ] Code follows project conventions
