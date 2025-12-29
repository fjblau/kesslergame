# Technical Specification: Add Launch Sound Effect

## Task Difficulty
**Easy** - Straightforward implementation following existing patterns in the codebase.

## Technical Context
- **Language**: TypeScript, React
- **Framework**: Vite + React 19
- **Existing Audio System**: `src/utils/audio.ts` with synthesized sound (`playCascadeWarning`)
- **Launch Button**: `src/components/ControlPanel/ControlPanel.tsx:173-183`
- **Launch Handler**: `handleLaunch` function at `ControlPanel.tsx:45`

## Implementation Approach

### 1. Asset Management
- Create `kessler-game/public/audio/` directory for audio files
- Copy `/Users/frankblau/Downloads/smallExplosion.mp3` → `kessler-game/public/audio/smallExplosion.mp3`
- Vite serves `public/` files at root URL, accessible via `/audio/smallExplosion.mp3`

### 2. Extensible Audio System
Extend `src/utils/audio.ts` to support both synthesized and file-based audio:

```typescript
// Existing: playCascadeWarning() - synthesized sound

// New: Generic audio player
type SoundEffect = 'launch' | 'cascade';

const SOUND_FILES: Record<SoundEffect, string> = {
  launch: '/audio/smallExplosion.mp3',
  cascade: 'synthesized', // Keep existing cascade warning
};

export function playSound(effect: SoundEffect) {
  const soundPath = SOUND_FILES[effect];
  
  if (soundPath === 'synthesized') {
    playCascadeWarning();
    return;
  }
  
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Default volume
    audio.play().catch(() => {
      // Silently fail if audio playback is blocked
    });
  } catch {
    // Ignore errors (browser compatibility, file not found, etc.)
  }
}

// Backward compatibility wrapper
export { playCascadeWarning };
```

### 3. Integration Points
- **ControlPanel.tsx**: Call `playSound('launch')` in `handleLaunch` function (line 45)
- Import: `import { playSound } from '../../utils/audio';`
- Placement: After successful launch action dispatch, before `advanceTurn()`

## Source Code Structure Changes

### Files to Create
- `kessler-game/public/audio/` (directory)
- `kessler-game/public/audio/smallExplosion.mp3` (copy from Downloads)

### Files to Modify
1. **`src/utils/audio.ts`**
   - Add `SoundEffect` type
   - Add `SOUND_FILES` mapping
   - Add `playSound()` function
   - Keep existing `playCascadeWarning()` for backward compatibility

2. **`src/components/ControlPanel/ControlPanel.tsx`**
   - Import `playSound` from `utils/audio`
   - Add `playSound('launch')` call in `handleLaunch` function

## Data Model / API / Interface Changes

### New Type Definition
```typescript
type SoundEffect = 'launch' | 'cascade';
```

### New Public Function
```typescript
export function playSound(effect: SoundEffect): void
```

## Verification Approach

### Manual Testing
1. Run development server: `npm run dev`
2. Start game and configure satellite/DRV launch
3. Click "Launch" button
4. Verify smallExplosion.mp3 plays
5. Test in different scenarios:
   - Satellite launch
   - DRV launch
   - Multiple rapid launches (audio shouldn't stack poorly)

### Code Quality
1. Run linter: `npm run lint`
2. Run type checker: `npm run build` (includes `tsc -b`)
3. Verify no console errors in browser

### Browser Compatibility
- Test in Chrome/Firefox (Web Audio API support)
- Verify graceful fallback if audio blocked by browser

## Extensibility Considerations

The `SoundEffect` type and `SOUND_FILES` mapping make it trivial to add new sound effects:
1. Add audio file to `public/audio/`
2. Add new key to `SoundEffect` type
3. Add mapping in `SOUND_FILES`
4. Call `playSound('new-effect')` anywhere in the app

Future sounds could include:
- Collision events
- Game over
- Mission completion
- Solar storm
- Budget warnings

## Dependencies
- No new npm packages required
- Uses browser-native `Audio` API
- Vite handles static asset serving

## Risk Assessment
**Low Risk**
- Non-breaking change (additive only)
- Graceful error handling prevents crashes
- Optional feature (game playable without sound)
- Small file size impact (~50-100KB for mp3)
