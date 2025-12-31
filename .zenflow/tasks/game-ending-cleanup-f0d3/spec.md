# Technical Specification: Game Ending Cleanup

## Task Difficulty
**Medium**

This task involves refactoring game-ending logic to be consistent across the codebase and fixing tab navigation from the Game Over modal. It requires careful handling of state management and ensuring all game-ending scenarios work correctly.

## Technical Context

### Stack
- **Language**: TypeScript
- **Framework**: React 19.2.0
- **State Management**: Redux Toolkit (@reduxjs/toolkit 2.11.2)
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Key Files
- `kessler-game/src/store/slices/gameSlice.ts` - Game state and reducers
- `kessler-game/src/components/GameOver/GameOverModal.tsx` - Game Over UI
- `kessler-game/src/App.tsx` - Main app component with tabs
- `kessler-game/src/components/ui/Tabs.tsx` - Tabs component
- `kessler-game/src/game/constants.ts` - Game constants

## Problem Analysis

### Issue 1: Inconsistent Game Ending Logic

The game over condition `(budget < 0 || step >= maxSteps || debris.length > MAX_DEBRIS_LIMIT)` is duplicated in **4 different places** in `gameSlice.ts`:

1. **Line 327-329** - `spendBudget` reducer
2. **Line 502-504** - `advanceTurn` reducer  
3. **Line 599-601** - `processCollisions` reducer
4. **Line 637-640** - `checkGameOver` reducer

**Problems:**
- Code duplication violates DRY principle
- If game ending conditions change, must update 4 locations
- Inconsistent - some places set `gameOver` inline, one has dedicated function
- Risk of bugs if conditions get out of sync

### Issue 2: View Analytics Button Doesn't Work

In `GameOverModal.tsx` (line 148), the "View Analytics" button:
```tsx
<button onClick={handleClose}>View Analytics</button>
```

The `handleClose` function (lines 49-51) only hides the modal:
```tsx
const handleClose = () => {
  setIsVisible(false);
};
```

**Problems:**
- Button doesn't switch to Analytics tab as expected
- Tab state is managed locally in `Tabs.tsx` (line 15)
- No way for GameOverModal to communicate tab change to parent
- Poor UX - user expects to see analytics when clicking the button

## Implementation Approach

### 1. Consolidate Game Ending Logic

**Strategy**: Use the existing `checkGameOver` reducer as the single source of truth

**Changes to `gameSlice.ts`:**
1. Remove duplicate game over checks from:
   - `spendBudget` reducer (remove lines 327-329)
   - `advanceTurn` reducer (remove lines 502-504)
   - `processCollisions` reducer (remove lines 599-601)

2. Keep only the `checkGameOver` reducer (lines 637-640)

3. Update call sites to dispatch `checkGameOver` after operations that might end the game

**Impact**: This ensures game ending logic is consistent and maintainable in one place.

### 2. Fix View Analytics Button

**Strategy**: Lift tab state from `Tabs.tsx` to `App.tsx` to enable external control

**Changes to `App.tsx`:**
1. Add state for active tab:
   ```tsx
   const [activeTab, setActiveTab] = useState('launch');
   ```

2. Pass `activeTab` and `setActiveTab` to `Tabs` component as props

3. Pass `setActiveTab` to `GameOverModal` component so it can switch tabs

**Changes to `Tabs.tsx`:**
1. Accept `activeTab` and `onTabChange` as props instead of managing state internally
2. Update interface and component signature
3. Call `onTabChange` when tab is clicked

**Changes to `GameOverModal.tsx`:**
1. Accept `onViewAnalytics` prop (callback to switch to analytics tab)
2. Update `handleClose` to call the callback:
   ```tsx
   const handleClose = () => {
     setIsVisible(false);
     onViewAnalytics?.();
   };
   ```

## Source Code Structure Changes

### Files to Modify
1. **`kessler-game/src/store/slices/gameSlice.ts`**
   - Remove duplicate game over checks (3 locations)
   - Game ending logic remains only in `checkGameOver` reducer

2. **`kessler-game/src/App.tsx`**
   - Add `activeTab` state
   - Pass state and setter to `Tabs` component
   - Pass `setActiveTab` callback to `GameOverModal`
   - Add "Game Ending Conditions" section to documentation tab

3. **`kessler-game/src/components/ui/Tabs.tsx`**
   - Change from controlled to uncontrolled component
   - Accept `activeTab` and `onTabChange` props
   - Remove internal `useState`

4. **`kessler-game/src/components/GameOver/GameOverModal.tsx`**
   - Accept `onViewAnalytics` prop
   - Call callback when View Analytics button is clicked

### No New Files Required
All changes are modifications to existing files.

## Data Model / API / Interface Changes

### Tabs Component Interface
```tsx
// Before
interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

// After  
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

### GameOverModal Component Interface
```tsx
// Before
export function GameOverModal()

// After
export function GameOverModal({ onViewAnalytics }: { onViewAnalytics?: () => void })
```

### No Redux State Changes
No changes to Redux store schema required.

## Verification Approach

### Manual Testing
1. **Budget depletion scenario**:
   - Start game
   - Spend all budget
   - Verify Game Over modal appears
   - Click "View Analytics" → verify analytics tab opens

2. **Time limit scenario**:
   - Play game until turn 100
   - Verify Game Over modal appears
   - Click "View Analytics" → verify analytics tab opens

3. **Debris cascade scenario**:
   - Create collisions until debris > 500
   - Verify Game Over modal appears  
   - Click "View Analytics" → verify analytics tab opens

4. **Play Again functionality**:
   - From Game Over modal, click "Play Again"
   - Verify game restarts correctly
   - Verify Launch tab is active

### Automated Testing
- Run `npm run lint` - ensure no linting errors
- Run `npm run build` - ensure TypeScript compilation succeeds

### Code Review Checks
- Confirm game over condition exists in only one place (`checkGameOver`)
- Verify all game-ending paths eventually call `checkGameOver`
- Ensure tab state is properly lifted to App component
- Check that GameOverModal properly closes and switches tabs

## Edge Cases to Consider

1. **Multiple game over conditions simultaneously**: If budget goes negative AND debris exceeds limit in same turn, should still show one modal with correct message

2. **Rapid button clicking**: User clicks "View Analytics" multiple times - should handle gracefully

3. **Game restart from analytics tab**: After viewing analytics, clicking "Play Again" should return to Launch tab

4. **Tab state persistence**: When modal closes, tab state should be preserved if user doesn't click "View Analytics"

## Success Criteria

✅ Game ending logic is consolidated in single location  
✅ All three game-ending scenarios (budget, time, debris) trigger Game Over modal  
✅ View Analytics button switches to Analytics tab  
✅ Modal closes when View Analytics is clicked  
✅ Play Again button works correctly from Game Over modal  
✅ No TypeScript errors  
✅ No linting errors  
✅ Build succeeds
