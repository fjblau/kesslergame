# Investigation: Turn off sound when paused

## Bug Summary
When the game is paused (gameSpeed === 'paused'), the background music and sound effects continue to play. They should be muted/paused while the game is paused.

## Root Cause Analysis
The audio system in `kessler-game/src/utils/audio.ts` doesn't monitor the game pause state. Currently:
- Background music starts playing when the game begins (`App.tsx:40`)
- Background music only stops when the game is over (`App.tsx:42`)
- There's no integration between the pause state and the audio system
- Sound effects can still trigger even when the game is paused

The game pause is controlled by:
- `gameSpeed` state in `uiSlice` which can be 'paused' | 'normal' | 'fast'
- `useGameSpeed.ts` hook checks for paused state and prevents game loop from running (lines 45, 55)
- But there's no audio pause/resume logic tied to this state change

## Affected Components
1. **kessler-game/src/utils/audio.ts**: Audio utility functions
   - Contains `playBackgroundMusic()`, `stopBackgroundMusic()`, and various sound effect functions
   - Has `soundEnabled` flag for enabling/disabling all sounds
   - Currently no pause/resume functionality

2. **kessler-game/src/App.tsx**: Main app component
   - Starts background music when game starts (line 40)
   - Stops all sounds when game is over (line 42)
   - Needs to pause/resume audio based on gameSpeed state

## Proposed Solution

### 1. Add Pause/Resume Functions to audio.ts
- Add `pauseAllAudio()` function to pause background music without resetting currentTime
- Add `resumeAllAudio()` function to resume background music from where it was paused
- Add `isPaused` flag to track audio pause state
- Modify sound effect functions to respect the pause state (don't play new sounds when paused)

### 2. Update App.tsx
- Add a useEffect that watches the `gameSpeed` state from the Redux store
- When gameSpeed changes to 'paused', call `pauseAllAudio()`
- When gameSpeed changes from 'paused' to 'normal' or 'fast', call `resumeAllAudio()`
- Ensure this respects the `soundEnabled` setting (don't resume if sound is disabled)

### 3. Implementation Details
**audio.ts changes:**
```typescript
let audioPaused = false;

export function pauseAllAudio() {
  audioPaused = true;
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

export function resumeAllAudio() {
  audioPaused = false;
  if (backgroundMusic && soundEnabled) {
    backgroundMusic.play().catch(() => {});
  }
}

export function getAudioPaused(): boolean {
  return audioPaused;
}
```

Then modify all sound effect functions to check `audioPaused` before playing.

**App.tsx changes:**
Add a useEffect to monitor gameSpeed:
```typescript
const gameSpeed = useAppSelector(state => state.ui.gameSpeed);

useEffect(() => {
  if (gameSpeed === 'paused') {
    pauseAllAudio();
  } else if (gameStarted && !gameOver) {
    resumeAllAudio();
  }
}, [gameSpeed, gameStarted, gameOver]);
```

## Edge Cases and Considerations
1. **Sound disabled via settings**: Resume should only play if `soundEnabled` is true
2. **Game over state**: Should continue to stop all sounds regardless of pause state
3. **Multiple pause/unpause cycles**: Audio should properly resume from where it was paused
4. **Sound effects during pause**: Should not play any sound effects when paused
5. **Background music state**: Need to track whether background music is supposed to be playing

## Testing Plan
1. Start game and verify background music plays
2. Pause game and verify all audio stops
3. Unpause game and verify background music resumes from where it left off
4. Pause game, trigger events that would normally play sounds, verify no sounds play
5. Disable sound in settings, unpause, verify no sounds play
6. Enable sound while paused, unpause, verify sounds resume
