# Technical Specification: Collision Detection System

## Task Assessment
**Complexity**: Medium

**Rationale**: 
- Involves spatial calculations (distance-based collision detection)
- Multiple state mutations (satellites, debris, budget)
- Integration with existing systems (insurance payouts, layer-based logic)
- Requires careful handling of game state consistency
- No complex algorithms but requires attention to edge cases

## Technical Context

### Language & Framework
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Build Tool**: Vite 7.2.4
- **Type Checking**: TypeScript strict mode

### Existing Dependencies
- No external libraries needed for collision detection
- Uses existing types and constants from the game module
- Integrates with Redux Toolkit's immer-based state management

### Codebase Architecture
The project follows a clear separation of concerns:
- **`src/game/types.ts`**: TypeScript interfaces and types
- **`src/game/constants.ts`**: Game configuration and constants
- **`src/game/engine/`**: Pure functions for game logic
- **`src/store/slices/`**: Redux state management with actions

Pattern observed:
1. Engine functions are pure and side-effect free
2. Redux actions call engine functions and mutate state
3. All game entities have id, x, y, and layer properties

## Implementation Approach

### 1. Collision Detection Algorithm

**Strategy**: Layer-based distance checking with configurable thresholds

For each orbital layer (LEO/MEO/GEO):
1. Filter satellites and debris by layer
2. For each pair of objects in the same layer:
   - Calculate Euclidean distance: `sqrt((x2-x1)² + (y2-y1)²)`
   - Compare against `COLLISION_THRESHOLDS[layer]`
   - If distance < threshold, record collision

**Why this approach**:
- Simple and performant for game-scale entity counts
- Layer-based filtering reduces comparison complexity
- Matches existing game architecture (layer-specific bounds and thresholds)
- Threshold values already defined in constants

### 2. Collision Processing Flow

```
processCollisions(state) → {
  1. Detect all collisions
  2. For each collision:
     a. Generate 5 debris pieces at collision location
     b. Assign debris types (70% cooperative, 30% uncooperative)
     c. Mark satellites as destroyed
     d. Calculate insurance payouts
  3. Update game state:
     - Remove destroyed satellites
     - Add generated debris
     - Add insurance payout to budget
}
```

### 3. Debris Generation

**Location**: Use destroyed satellite's position as base
- Add small random offset to simulate scatter effect
- Ensure debris stays within layer bounds

**Type Distribution**: 
- 70% cooperative (easier to remove)
- 30% uncooperative (harder to remove)
- Use random selection for each debris piece

## Source Code Changes

### Files to Modify

#### 1. `src/game/engine/collision.ts`
**Current state**: Contains only insurance payout calculation functions
**Changes needed**: Add collision detection and debris generation functions

New exports:
- `detectCollisions(satellites, debris, layer)`: Returns collision pairs
- `generateDebrisFromCollision(satellite, debris)`: Returns array of new debris
- `processCollisionResults(collisions, satellites, debris)`: Returns destruction/generation data

**Rationale**: Keep collision logic pure and testable in engine module

#### 2. `src/store/slices/gameSlice.ts`
**Current state**: Has basic game actions (launch, budget, turn advance)
**Changes needed**: Add `processCollisions` action

New reducer:
```typescript
processCollisions: (state) => {
  // Detect collisions using engine functions
  // Generate debris
  // Remove destroyed satellites
  // Add insurance payouts to budget
}
```

**Integration point**: Should be called during `advanceTurn` or as separate action

### Files Unchanged
- `src/game/types.ts`: All required types already exist
- `src/game/constants.ts`: All required constants already defined
- `src/game/engine/debrisRemoval.ts`: Independent functionality

## Data Model / API / Interface Changes

### No New Types Required
All necessary types already exist:
- `Satellite`: Has id, x, y, layer, insuranceTier
- `Debris`: Has id, x, y, layer, type
- `GameState`: Has satellites, debris, budget arrays

### State Mutations
The `processCollisions` action will:
1. **Mutate `state.satellites`**: Filter out destroyed satellites
2. **Mutate `state.debris`**: Push new debris pieces
3. **Mutate `state.budget`**: Add insurance payouts

### Constants Usage
- `COLLISION_THRESHOLDS`: Distance threshold per layer
- `DEBRIS_PER_COLLISION`: Number of debris pieces (5)
- `DEBRIS_TYPE_DISTRIBUTION`: cooperative (0.70) / uncooperative (0.30)
- `LAYER_BOUNDS`: Ensure debris stays within layer boundaries

## Verification Approach

### Build & Type Checking
```bash
npm run build    # TypeScript compilation + Vite build
npm run lint     # ESLint validation
```

### Manual Testing
Since no test framework is configured:
1. Start dev server: `npm run dev`
2. Launch satellites in different layers
3. Position satellites close together (may require UI manipulation)
4. Advance turns and observe:
   - Collisions detected when satellites are within threshold
   - Debris generated (5 pieces per collision)
   - Satellites removed from state
   - Budget increased by insurance payout
   - Debris appears in correct layer

### Edge Cases to Verify
- Multiple simultaneous collisions
- Collisions with no insurance (payout = 0)
- Collisions at layer boundaries
- Debris generation doesn't exceed layer bounds
- Empty satellite/debris arrays
- Single satellite/debris (no collisions possible)

## Implementation Considerations

### Performance
- Collision detection is O(n²) per layer
- Acceptable for game scale (typically < 100 objects per layer)
- Layer-based filtering reduces comparison space

### Precision
- Using Euclidean distance (standard collision detection)
- No need for continuous collision detection (discrete turn-based game)

### Randomness
- Debris type assignment uses `Math.random()`
- Position offset uses `Math.random()` with bounds checking
- Consistent with existing codebase patterns (see `debrisRemoval.ts`)

### State Consistency
- Redux Toolkit uses immer for immutable updates
- Safe to use array methods like `push`, `filter` in reducers
- All ID generation uses existing `generateId()` helper

## Integration Points

### Existing Systems
1. **Insurance System**: Uses existing `calculateInsurancePayout()` and `calculateTotalPayout()` from collision.ts
2. **Layer Management**: Respects `LAYER_BOUNDS` for debris positioning
3. **Game Flow**: Integrates with `advanceTurn` action
4. **UI Auto-Pause**: UI already has `autoPauseOnCollision` flag (types.ts:58)

### Future Extensibility
- Collision detection function is reusable for satellite-satellite, satellite-debris, debris-debris
- Debris generation logic can be extended for different collision types
- Threshold configuration allows game balance tuning

## Risk Assessment

### Low Risk
- Pure functions are easy to test and debug
- Redux Toolkit handles state immutability
- All required types and constants already exist
- No external dependencies

### Medium Risk
- Collision detection logic must be thoroughly tested for edge cases
- Debris positioning must stay within layer bounds
- Multiple simultaneous collisions must be handled correctly

### Mitigation
- Implement bounds checking for debris positions
- Use clear variable names and comments
- Test with extreme cases (many satellites, all in same position)
- Verify insurance payout calculations are correct

## Success Criteria

1. ✅ Collisions detected when objects are within threshold distance
2. ✅ Each collision generates exactly 5 debris pieces
3. ✅ Debris type distribution is approximately 70/30 (cooperative/uncooperative)
4. ✅ Colliding satellites are removed from state
5. ✅ Insurance payouts are added to budget
6. ✅ Debris stays within correct layer bounds
7. ✅ Code passes TypeScript compilation and ESLint checks
8. ✅ No runtime errors in dev environment
