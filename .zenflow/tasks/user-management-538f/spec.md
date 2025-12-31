# Technical Specification: User Management

## Difficulty Assessment
**Easy** - Straightforward implementation involving UI updates and state management extensions.

## Technical Context

### Language & Framework
- **Frontend**: React 19.2.0 with TypeScript
- **State Management**: Redux Toolkit (@reduxjs/toolkit 2.11.2)
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18

### Dependencies
No new dependencies required. The feature will use existing libraries.

## Implementation Approach

### Overview
Add user name collection to the game setup flow to enable personalized features like certificates and player-specific tracking. The implementation follows the existing Redux patterns in the codebase.

### User Flow
1. User opens the game and sees the **GameSetupScreen**
2. User enters their name in a text input field
3. User selects difficulty level (existing functionality)
4. User clicks "Start Game"
5. Username is stored in Redux game state and persisted throughout the game session
6. Username can be accessed by any component (e.g., GameOverModal, future certificate generation)

### Design Decisions

#### Storage Location
- **Primary storage**: Redux `gameSlice` state
- **Persistence**: Optional localStorage for returning players (nice-to-have)
- **Type**: Simple string field (no complex user object needed at this stage)

#### Validation
- **Required field**: Username must not be empty before starting game
- **Length limits**: 1-50 characters
- **Character set**: Allow alphanumeric and basic punctuation (no strict validation needed)
- **Default**: Empty string (user must enter name)

#### UI/UX Considerations
- Input field positioned above difficulty selection in GameSetupScreen
- Clear label "Player Name" or "Your Name"
- "Start Game" button disabled until valid name is entered
- Consistent styling with existing TailwindCSS design

## Source Code Structure Changes

### Files to Modify

#### 1. `/kessler-game/src/game/types.ts`
- Add `playerName` field to `GameState` interface
```typescript
export interface GameState {
  // ... existing fields
  playerName: string;
  // ... rest of fields
}
```

#### 2. `/kessler-game/src/store/slices/gameSlice.ts`
- Add `playerName: ''` to `initialState`
- Update `initializeGame` reducer to accept and store player name
- Update `resetGame` reducer to preserve or clear player name (preserve for replay)

#### 3. `/kessler-game/src/components/Setup/GameSetupScreen.tsx`
- Add `playerName` state with `useState`
- Add input field for player name
- Pass player name to `initializeGame` action
- Disable "Start Game" button when name is invalid
- Add basic validation

### Files to Review (No Changes Expected)
- `/kessler-game/src/components/GameOver/GameOverModal.tsx` - Can access playerName from store for future certificate generation
- `/kessler-game/src/store/slices/scoreSlice.ts` - Could be extended later to associate scores with players

## Data Model Changes

### GameState Interface
```typescript
export interface GameState {
  // ... existing fields ...
  playerName: string; // NEW: Player's name for certificates and personalization
}
```

### initializeGame Action Payload
**Before:**
```typescript
initializeGame: (state, action: PayloadAction<BudgetDifficulty>)
```

**After:**
```typescript
initializeGame: (state, action: PayloadAction<{
  difficulty: BudgetDifficulty;
  playerName: string;
}>)
```

## API / Interface Changes

### Redux Actions
- **Modified**: `initializeGame` - now accepts object with difficulty and playerName
- **No breaking changes**: Component calling pattern updates are local to GameSetupScreen

## Verification Approach

### Manual Testing
1. **Empty name validation**: Verify "Start Game" button is disabled when name field is empty
2. **Name persistence**: Enter name, start game, verify name is in Redux state
3. **Game restart**: Click "Play Again", verify name is preserved in setup screen
4. **Whitespace handling**: Test name with leading/trailing spaces (should be trimmed)
5. **Length limits**: Test very long names (50+ chars)

### Code Quality
1. Run TypeScript compiler: `npm run build` in kessler-game directory
2. Run ESLint: `npm run lint` in kessler-game directory (if dependencies installed)
3. Check Redux DevTools to verify state updates

### Accessibility
- Input field should have proper label (implicit or explicit)
- Keyboard navigation should work (tab through fields, Enter to submit)
- Focus management (auto-focus on name field when screen loads)

## Future Extensions (Out of Scope)
- Certificate generation with player name
- Score leaderboard with player names
- Player profile persistence across sessions
- Multi-player support
- Username uniqueness validation
- User authentication

## Implementation Notes
- Keep changes minimal and focused on name collection
- Follow existing code patterns (Redux Toolkit slice patterns, component structure)
- Use existing TailwindCSS classes for consistent styling
- No new npm packages needed
- TypeScript strict mode compliance required
