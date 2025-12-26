# Technical Specification: Collision Cascade Detection

## Task Difficulty Assessment

**Complexity Level**: **EASY**

**Reasoning**:
- Simple extension of existing collision detection system
- Straightforward state management additions
- Follows established patterns in codebase
- Visual/audio warnings reuse existing component patterns
- Mission tracking follows existing mission system

---

## Technical Context

### Language and Framework
- **Language**: TypeScript
- **Framework**: React 18.x with Redux Toolkit
- **State Management**: Redux Toolkit (already configured)
- **Animation**: Framer Motion (already in use)
- **Styling**: Tailwind CSS

### Dependencies
All required dependencies are already present:
- `@reduxjs/toolkit`: State management
- `react-redux`: React bindings for Redux
- `framer-motion`: Animation library for visual effects

---

## Implementation Approach

### Overview
Extend the existing collision detection system to track the number of collisions per turn and trigger a "cascade event" when 3 or more simultaneous collisions occur. Add visual/audio warnings and mission tracking.

### Architecture

#### 1. Collision Counting
The existing `processCollisions` reducer in `gameSlice.ts` already:
- Detects collisions using `detectCollisions()` from `collision.ts`
- Returns an array of `CollisionPair[]`
- Processes all collisions in a single turn

**Change**: Track the count of collisions and set a cascade flag when count >= 3.

#### 2. State Management Extension
**File**: `kessler-game/src/game/types.ts`

Add to `GameState` interface:
```typescript
cascadeTriggered: boolean;
lastCascadeTurn?: number;
totalCascades: number;
```

**File**: `kessler-game/src/store/slices/gameSlice.ts`

Update `initialState`:
```typescript
cascadeTriggered: false,
lastCascadeTurn: undefined,
totalCascades: 0,
```

Modify `processCollisions` reducer:
```typescript
processCollisions: (state) => {
  const collisions = detectCollisions(...);
  
  // Detect cascade (3+ collisions)
  if (collisions.length >= 3) {
    state.cascadeTriggered = true;
    state.lastCascadeTurn = state.step;
    state.totalCascades += 1;
  }
  
  // ... existing collision processing logic
}
```

Add reducer to clear cascade flag:
```typescript
clearCascadeFlag: (state) => {
  state.cascadeTriggered = false;
}
```

#### 3. Visual Warning
**File**: `kessler-game/src/components/GameBoard/CascadeWarning.tsx` (new)

Create a visual warning component similar to `CollisionEffect.tsx`:
```typescript
interface CascadeWarningProps {
  onComplete: () => void;
}

export function CascadeWarning({ onComplete }: CascadeWarningProps) {
  // Display prominent warning overlay
  // Red pulsing border effect
  // "CASCADE EVENT!" text
  // Auto-dismiss after 3 seconds
}
```

**File**: `kessler-game/src/components/GameBoard/OrbitVisualization.tsx` (modify)

Add cascade warning display when `cascadeTriggered` is true.

#### 4. Audio Warning
**File**: `kessler-game/src/utils/audio.ts` (new)

Create simple audio utility:
```typescript
export function playCascadeWarning() {
  // Use Web Audio API to generate alert tone
  // Or play pre-loaded audio file
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 440; // A4 note
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}
```

Trigger in `OrbitVisualization.tsx` when cascade is detected.

#### 5. Mission Tracking
**File**: `kessler-game/src/game/missions.ts`

Add new mission definition:
```typescript
{
  id: 'no-cascades',
  title: 'Cascade Prevention',
  description: 'Complete the game without triggering any cascade events (3+ collisions in one turn)',
  category: 'state',
  target: 1,
  trackingType: 'boolean',
}
```

**File**: `kessler-game/src/store/slices/missionsSlice.ts`

Add to `updateMissionProgress`:
```typescript
case 'no-cascades':
  if (gameState.totalCascades > 0) {
    mission.failed = true;
  } else {
    mission.currentProgress = gameState.gameOver && gameState.totalCascades === 0 ? 1 : 0;
    if (mission.currentProgress >= 1) {
      mission.completed = true;
      mission.completedAt = gameState.step;
    }
  }
  break;
```

---

## Source Code Structure Changes

### New Files
1. `kessler-game/src/components/GameBoard/CascadeWarning.tsx` - Visual warning component
2. `kessler-game/src/utils/audio.ts` - Audio utility functions

### Modified Files
1. `kessler-game/src/game/types.ts` - Add cascade fields to `GameState`
2. `kessler-game/src/store/slices/gameSlice.ts` - Cascade detection and tracking
3. `kessler-game/src/components/GameBoard/OrbitVisualization.tsx` - Display cascade warning
4. `kessler-game/src/game/missions.ts` - Add "No Cascades" mission
5. `kessler-game/src/store/slices/missionsSlice.ts` - Mission tracking logic
6. `kessler-game/src/game/constants.ts` - Optional: Add CASCADE_THRESHOLD constant

---

## Data Model Changes

### GameState Interface Extension
```typescript
export interface GameState {
  // ... existing fields
  cascadeTriggered: boolean;        // Flag indicating if cascade occurred this turn
  lastCascadeTurn?: number;         // Turn number when last cascade occurred
  totalCascades: number;            // Total count of cascades in game
}
```

### Constants Addition
```typescript
export const CASCADE_THRESHOLD = 3; // Number of collisions to trigger cascade
```

---

## Implementation Steps

### Step 1: Extend Type Definitions
1. Add cascade-related fields to `GameState` interface in `types.ts`
2. Add `CASCADE_THRESHOLD` constant to `constants.ts`

### Step 2: Update Game State Management
1. Update `initialState` in `gameSlice.ts` with cascade fields
2. Modify `processCollisions` reducer to detect cascades
3. Add `clearCascadeFlag` reducer
4. Export new action

### Step 3: Create Visual Warning Component
1. Create `CascadeWarning.tsx` component
2. Implement pulsing/flashing animation with Framer Motion
3. Add prominent "CASCADE EVENT!" text
4. Auto-dismiss after duration

### Step 4: Add Audio Warning
1. Create `audio.ts` utility file
2. Implement `playCascadeWarning()` function using Web Audio API
3. Keep it simple (no external audio files needed)

### Step 5: Integrate Warning Display
1. Modify `OrbitVisualization.tsx` to detect cascade flag
2. Render `CascadeWarning` component when triggered
3. Play audio warning on cascade detection
4. Clear cascade flag after warning display

### Step 6: Add Mission Tracking
1. Add "No Cascades" mission definition to `missions.ts`
2. Update mission progress logic in `missionsSlice.ts`
3. Mark mission as failed if any cascade occurs
4. Mark mission as completed if game ends with no cascades

### Step 7: Update Reset Logic
1. Ensure cascade fields are reset in `resetGame` reducer
2. Ensure cascade fields are reset in `initializeGame` reducer

---

## Verification Approach

### Unit Tests
Test collision counting logic:
```typescript
describe('Cascade Detection', () => {
  it('should trigger cascade when 3+ collisions occur', () => {
    // Setup state with objects positioned for multiple collisions
    // Process collisions
    // Assert cascadeTriggered is true
  });

  it('should not trigger cascade when <3 collisions occur', () => {
    // Setup state with objects for 2 collisions
    // Process collisions
    // Assert cascadeTriggered is false
  });

  it('should increment totalCascades counter', () => {
    // Trigger cascade multiple times
    // Assert totalCascades increments correctly
  });
});
```

### Manual Testing Checklist
1. ✓ Launch multiple satellites in same layer close together
2. ✓ Wait for 3+ simultaneous collisions
3. ✓ Verify cascade warning appears visually
4. ✓ Verify audio warning plays (if implemented)
5. ✓ Verify cascade flag is set in Redux DevTools
6. ✓ Verify "No Cascades" mission tracking works
7. ✓ Trigger cascade and verify mission fails
8. ✓ Complete game without cascade and verify mission completes
9. ✓ Verify cascade state resets on game reset
10. ✓ Test with collision threshold adjustments

### Integration Testing
1. Test cascade detection with different collision scenarios
2. Test cascade warning dismissal and flag clearing
3. Test mission tracking across multiple game sessions
4. Verify performance with many objects (no slowdown from cascade checks)

### Lint and Type Check
Run existing commands:
- `npm run lint` - ESLint validation
- `npm run typecheck` - TypeScript compilation check

---

## Edge Cases and Considerations

### Edge Cases
1. **Exactly 3 collisions**: Should trigger cascade
2. **Cascade already triggered**: Don't increment counter multiple times per turn
3. **Game reset**: Clear all cascade state
4. **Mission completion timing**: "No Cascades" mission completes only at game end
5. **Collision settings**: Cascade detection respects custom collision thresholds

### Performance
- Collision counting is O(1) after collision detection
- No performance impact (just checking array length)
- Warning display is lightweight (single component render)

### User Experience
- Warning should be noticeable but not annoying
- Auto-dismiss prevents permanent UI clutter
- Audio can be optional/toggleable if desired
- Cascade counter visible in stats panel (optional enhancement)

---

## Future Enhancements (Out of Scope)

1. Cascade severity levels (3-5, 6-10, 11+)
2. Cascade multiplier for debris generation
3. Cascade statistics in game-over screen
4. Achievement/badge for avoiding cascades
5. Visual chain-reaction animation
6. Configurable cascade threshold

---

## Success Criteria

### Minimum Viable Product (MVP)
- ✓ Cascade detection triggers at 3+ collisions
- ✓ `cascadeTriggered` flag added to game state
- ✓ Visual warning displays on cascade
- ✓ "No Cascades" mission tracks correctly
- ✓ State resets properly on game restart

### Nice-to-Have
- ✓ Audio warning plays on cascade
- ✓ Cascade count visible in UI
- ✓ Enhanced visual effects for cascade

### Definition of Done
1. All type definitions updated
2. Cascade detection implemented and tested
3. Visual warning component created and integrated
4. Audio warning implemented (basic)
5. Mission tracking functional
6. All tests pass (lint, typecheck, unit tests)
7. Manual testing checklist completed
8. No regressions in existing functionality
