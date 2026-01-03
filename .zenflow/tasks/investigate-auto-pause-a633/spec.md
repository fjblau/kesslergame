# Technical Specification: Auto-Pause on Collision

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- The infrastructure already exists (UIState has `autoPauseOnCollision`, pause system works)
- The `autoPauseOnCollision` setting is declared but NOT actually implemented in the game loop
- Requires modification to the game loop in `useGameSpeed.ts` to detect collisions and pause
- Need to add UI configuration toggle for the setting
- DRV/Satellite launching while paused should already work (ControlPanel doesn't check game speed)
- No major architectural changes required
- Some edge cases to consider (collision detection timing, user experience flow)

---

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18

### Current Architecture
The game uses Redux Toolkit for state management with the following relevant slices:
- **gameSlice** - Core game state (satellites, debris, collisions, DRVs)
- **uiSlice** - UI state (gameSpeed, autoPause settings)

### Game Loop
The game loop is managed by `useGameSpeed.ts` which:
1. Runs at intervals based on game speed (normal: 4000ms, fast: 2000ms)
2. Processes DRV operations
3. Advances turn
4. Processes collisions
5. Checks for auto-pause conditions (currently only budget and risk level)

---

## Current State Analysis

### What Exists
1. **UIState.autoPauseOnCollision** (uiSlice.ts:7) - Defaults to `true` but is NOT used anywhere
2. **gameSlice.recentCollisions** - Array of collision events from the current turn
3. **gameSlice.processCollisions** - Action that detects and processes collisions
4. **uiSlice.setGameSpeed** - Action to change game speed (including 'paused')
5. **Auto-pause for other conditions**: Budget low, risk level change (both implemented)

### What's Missing
1. **Collision detection in game loop** - `autoPauseOnCollision` is never checked in `useGameSpeed.ts`
2. **UI toggle for the setting** - No configuration component to enable/disable auto-pause on collision
3. **Documentation** - Feature is not documented in the app

---

## Implementation Approach

### Core Changes

#### 1. Implement Auto-Pause Logic in Game Loop
**File**: `kessler-game/src/hooks/useGameSpeed.ts`

**Changes**:
- Add `autoPauseOnCollision` to the hook's state selectors
- Add `recentCollisions` to track when collisions occur
- After `dispatch(processCollisions())` (line 176), check if collisions occurred
- If `autoPauseOnCollision` is enabled AND collisions occurred, pause the game
- Use a `useEffect` or add logic after collision processing to trigger pause

**Implementation Strategy**:
```typescript
// Add to selectors around line 20
const autoPauseOnCollision = useAppSelector(state => state.ui.autoPauseOnCollision);

// After processCollisions() is called, check for new collisions
// Add logic after line 176 in the interval callback:
setTimeout(() => {
  const updatedState = (store.getState() as RootState).game;
  if (autoPauseOnCollision && updatedState.recentCollisions.length > 0) {
    dispatch(setGameSpeed('paused'));
    clearInterval(interval);
    return;
  }
}, 10);
```

#### 2. Add UI Configuration Toggle
**File**: `kessler-game/src/components/Configuration/GeneralSettings.tsx`

**Changes**:
- Add a checkbox/toggle for "Auto-Pause on Collision"
- Use `useAppSelector` to read current value
- Use `dispatch(toggleAutoPause('autoPauseOnCollision'))` to toggle

**UI Design**:
```tsx
<div className="flex items-center gap-4">
  <label className="text-sm text-gray-300 flex items-center gap-2">
    <input
      type="checkbox"
      checked={autoPauseOnCollision}
      onChange={() => dispatch(toggleAutoPause('autoPauseOnCollision'))}
      className="..."
    />
    Auto-Pause on Collision
  </label>
  <span className="text-xs text-gray-400">
    Pause the game when a collision is detected (allows DRV launch for mitigation)
  </span>
</div>
```

#### 3. Verify DRV Launching While Paused
**File**: `kessler-game/src/components/ControlPanel/ControlPanel.tsx`

**Verification**:
- Ensure the launch functions (launchSatellite, launchDRV) don't check for game speed
- They should work regardless of pause state (current implementation likely already supports this)
- If blocked, remove any game speed checks from the ControlPanel

#### 4. Update Documentation (Optional)
**File**: `kessler-game/src/App.tsx` (Documentation tab)

Add explanation of the auto-pause feature in the Configuration or How to Play section.

---

## Source Code Structure

### Files to Modify

```
kessler-game/src/
├── hooks/
│   └── useGameSpeed.ts                    # [MODIFY] Add auto-pause on collision logic
├── components/
│   └── Configuration/
│       └── GeneralSettings.tsx            # [MODIFY] Add UI toggle for auto-pause
└── App.tsx                                # [OPTIONAL] Update documentation
```

### Files to Review (No Changes Expected)

```
kessler-game/src/
├── store/
│   └── slices/
│       ├── uiSlice.ts                     # [VERIFY] toggleAutoPause action exists
│       └── gameSlice.ts                   # [VERIFY] processCollisions works correctly
└── components/
    └── ControlPanel/
        └── ControlPanel.tsx               # [VERIFY] Launches work while paused
```

---

## Data Model / API / Interface Changes

### No Type Changes Required

All necessary types already exist:

```typescript
// game/types.ts (already exists)
export interface UIState {
  gameSpeed: GameSpeed;
  autoPauseOnCollision: boolean;  // ✓ Already defined
  autoPauseOnRiskChange: boolean;
  autoPauseOnBudgetLow: boolean;
  autoPauseOnMission: boolean;
}

export interface GameState {
  recentCollisions: CollisionEvent[];  // ✓ Already defined
  // ... other fields
}

// uiSlice.ts (already exists)
toggleAutoPause: (state, action: PayloadAction<keyof Omit<UIState, 'gameSpeed'>>) => {
  state[action.payload] = !state[action.payload];  // ✓ Already works for autoPauseOnCollision
}
```

No changes to types, interfaces, or Redux actions are needed.

---

## Edge Cases & Considerations

### 1. Timing of Collision Detection
- Collisions are processed after `processCollisions()` is dispatched
- We need to check for collisions in the **next tick** using `setTimeout` (following the pattern used for collision logging)
- This ensures the Redux state has been updated with new collisions

### 2. User Experience Flow
When auto-pause on collision is enabled:
1. Collision occurs
2. Game pauses automatically
3. User sees collision in event log
4. User can launch DRV to mitigate debris
5. User manually resumes game when ready

### 3. Multiple Collisions
- If multiple collisions occur in a single turn, pause once
- Don't spam pause/unpause
- `recentCollisions.length > 0` is sufficient check

### 4. Game Over State
- Don't pause if game is over
- Add check: `if (!updatedState.gameOver && autoPauseOnCollision && ...)`

### 5. Interval Cleanup
- When pausing due to collision, clear the interval to prevent further execution
- Follow pattern used for budget pause (lines 180-183)

---

## Verification Approach

### Manual Testing

#### Test Case 1: Auto-Pause Enabled
1. Start new game
2. Launch satellites in same orbit
3. Wait for collision
4. **Expected**: Game pauses, collision logged in event log
5. Launch DRV while paused
6. **Expected**: DRV launches successfully
7. Resume game
8. **Expected**: Game continues normally

#### Test Case 2: Auto-Pause Disabled
1. Start new game
2. Go to Configuration tab
3. Disable "Auto-Pause on Collision"
4. Launch satellites in same orbit
5. Wait for collision
6. **Expected**: Game does NOT pause, collision logged

#### Test Case 3: Edge Cases
1. Verify pause happens only once per collision batch
2. Verify game doesn't pause if already paused
3. Verify game doesn't pause if game over
4. Verify satellite launches also work while paused

### Build & Lint Verification

Run the following commands to ensure code quality:

```bash
cd kessler-game
npm run lint       # Check for linting errors
npm run build      # Verify TypeScript compilation
```

---

## Implementation Checklist

### Phase 1: Core Implementation
- [ ] Add `autoPauseOnCollision` selector to `useGameSpeed.ts`
- [ ] Add collision detection after `processCollisions()` with proper timing
- [ ] Implement pause logic with interval cleanup
- [ ] Test manually with collision scenarios

### Phase 2: UI Configuration
- [ ] Add toggle to `GeneralSettings.tsx`
- [ ] Import required hooks and actions
- [ ] Style the toggle to match existing settings
- [ ] Test toggle functionality

### Phase 3: Verification
- [ ] Verify DRV/satellite launches work while paused
- [ ] Run lint and build commands
- [ ] Test all test cases listed above
- [ ] Verify no regressions in existing auto-pause features

### Phase 4: Documentation (Optional)
- [ ] Add feature explanation to Documentation tab
- [ ] Update any relevant tooltips or help text

---

## Success Criteria

The implementation is successful when:

1. ✅ Auto-pause on collision is actually implemented (not just declared)
2. ✅ When enabled, game pauses immediately when collision detected
3. ✅ User can launch DRVs (and satellites) while paused due to collision
4. ✅ User can manually resume game after collision
5. ✅ UI toggle allows user to enable/disable the feature
6. ✅ Feature respects game over state (doesn't pause when game is over)
7. ✅ No linting errors
8. ✅ TypeScript compiles successfully
9. ✅ Existing auto-pause features (budget, risk) still work correctly

---

## Risks & Mitigation

### Risk 1: Performance Impact
**Risk**: Checking collisions every interval could impact performance
**Mitigation**: We're only checking the length of `recentCollisions` array, which is O(1) and negligible

### Risk 2: User Confusion
**Risk**: Users might not understand why game paused
**Mitigation**: 
- Event log shows collision immediately before pause
- Clear UI toggle with helpful description
- Default to enabled (current behavior)

### Risk 3: Interval Cleanup Issues
**Risk**: Failed to clean up intervals could cause memory leaks
**Mitigation**: Follow exact pattern used in budget pause (lines 180-183) which works correctly

---

## Future Enhancements (Out of Scope)

These are NOT part of this task but could be considered later:

1. **Notification System**: Show toast/modal when auto-pause triggers
2. **Sound Effect**: Play alert sound on collision + pause
3. **Auto-Resume**: Option to auto-resume after X seconds
4. **Collision Replay**: Visual replay of collision when paused
5. **Settings Persistence**: Save auto-pause preferences to localStorage
6. **Granular Control**: Separate toggles for satellite vs debris collisions
