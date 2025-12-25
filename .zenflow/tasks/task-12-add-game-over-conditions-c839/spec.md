# Technical Specification: Game Over Conditions

## Task Difficulty Assessment

**Complexity Level**: **Easy**

**Reasoning**:
- Straightforward implementation of game over logic
- Simple state flag addition to existing Redux slice
- Basic conditional checks on existing state values
- UI component follows existing patterns (similar to GameSetupScreen)
- No complex algorithms or edge cases
- Clear acceptance criteria

---

## Technical Context

### Language & Dependencies
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18

### Existing Components to Reference
- `src/components/Setup/GameSetupScreen.tsx` - Full-screen modal-like overlay pattern
- `src/store/slices/gameSlice.ts` - Game state management
- `src/game/constants.ts` - Game constants

---

## Implementation Approach

### 1. Add Game Over Constant
Add `MAX_DEBRIS_LIMIT` constant to `src/game/constants.ts`:
```typescript
export const MAX_DEBRIS_LIMIT = 500;
```

### 2. Update GameState Type
Add `gameOver` flag to `GameState` interface in `src/game/types.ts`:
```typescript
export interface GameState {
  // ... existing fields
  gameOver: boolean;
}
```

### 3. Update Game Slice
Modify `src/store/slices/gameSlice.ts`:
- Add `gameOver: false` to `initialState`
- Import `MAX_DEBRIS_LIMIT` from constants
- Add `checkGameOver` reducer to check:
  - budget < 0
  - step >= maxSteps (100)
  - debris.length > MAX_DEBRIS_LIMIT (500)
- Call `checkGameOver` in `advanceTurn`, `processCollisions`, and `spendBudget` reducers

### 4. Create GameOverModal Component
Create `src/components/GameOver/GameOverModal.tsx`:
- Full-screen overlay (similar to GameSetupScreen)
- Display game over reason (budget depleted, max steps reached, or debris cascade)
- Show final stats:
  - Total turns survived
  - Final budget
  - Total debris count
  - Total satellites launched
  - Total debris removed
- "Play Again" button to reset game (dispatch `initializeGame`)
- Use Tailwind CSS for styling (dark theme, gradient text)

### 5. Integrate Modal in App
Update `src/App.tsx`:
- Select `gameOver` from Redux state
- Conditionally render `GameOverModal` when `gameOver === true`
- Modal should overlay the game board

---

## Source Code Structure

### New Files
- `src/components/GameOver/GameOverModal.tsx` - Game over modal component

### Modified Files
- `src/game/constants.ts` - Add MAX_DEBRIS_LIMIT constant
- `src/game/types.ts` - Add gameOver flag to GameState
- `src/store/slices/gameSlice.ts` - Add gameOver logic and reducer
- `src/App.tsx` - Integrate GameOverModal

---

## Data Model Changes

### GameState Interface (types.ts)
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
  riskLevel: RiskLevel;
  gameOver: boolean; // NEW
}
```

### Constants (constants.ts)
```typescript
export const MAX_DEBRIS_LIMIT = 500; // NEW
```

---

## Game Over Conditions

The game ends when ANY of these conditions are met:

1. **Budget Depleted**: `budget < 0`
2. **Max Steps Reached**: `step >= maxSteps` (maxSteps = 100)
3. **Debris Cascade**: `debris.length > MAX_DEBRIS_LIMIT` (MAX_DEBRIS_LIMIT = 500)

---

## Verification Approach

### Manual Testing
1. Start a new game
2. Test budget depletion:
   - Launch expensive satellites without income until budget < 0
   - Verify game over modal appears with correct reason
3. Test max steps:
   - Use game speed to advance to turn 100
   - Verify game over modal appears with correct reason
4. Test debris cascade:
   - Let collisions create debris without removal until > 500
   - Verify game over modal appears with correct reason
5. Verify "Play Again" button resets the game properly

### Automated Testing
- Run `npm run lint` to ensure code quality
- Run `npm run build` to ensure TypeScript compilation succeeds

### Stats Verification
- Ensure all displayed stats match the final game state
- Verify stats formatting (currency, numbers)

---

## UI/UX Considerations

### Modal Design
- Full-screen dark overlay to block interaction with game
- Centered card with game over message
- Large, clear typography for game over reason
- Stats displayed in a readable grid/list format
- Prominent "Play Again" button
- Visual hierarchy: Reason → Stats → Action button
- Consistent with existing dark theme (slate/blue/purple colors)

### Game Over Reasons Display
- Budget depleted: "Budget Depleted! You ran out of funds."
- Max steps: "Time's Up! You reached the maximum turn limit."
- Debris cascade: "Debris Cascade! Too much space debris accumulated."

### Stats Format
- **Turns Survived**: X / 100
- **Final Budget**: $XX,XXX,XXX (formatted with commas)
- **Total Debris**: XXX pieces
- **Satellites Launched**: XX
- **Debris Removed**: XXX pieces

---

## Edge Cases

1. Multiple game over conditions met simultaneously: Display the first condition detected
2. Game over on turn 0: Should still show stats (all zeros)
3. Negative budget after insurance payout: Should trigger game over
4. Exactly maxSteps (not greater): Should trigger game over

---

## Performance Considerations

- Game over check is O(1) operation (simple comparisons)
- No impact on game performance
- Modal renders only when gameOver is true

---

## Future Enhancements (Out of Scope)

- High score tracking
- Game over statistics history
- Different endings based on performance
- Achievements/badges
- Social sharing
