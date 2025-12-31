# Technical Specification: Variable Solar Flares

## Task Complexity: Medium

This task requires moderate complexity with multiple interconnected changes across the game engine, state management, and UI components. It involves adding a classification system, updating debris removal logic, and enhancing event logging.

---

## Technical Context

- **Language**: TypeScript
- **Framework**: React with Redux Toolkit
- **Architecture**: Redux slice pattern with game engine modules
- **Key Dependencies**: 
  - `@reduxjs/toolkit` for state management
  - React hooks for UI interaction
  - Game engine modules for event processing

---

## Current Implementation

### Solar Storm System
Currently, solar storms are implemented with:
- Fixed probability check via `checkSolarStorm()` in `src/game/engine/events.ts`
- Fixed removal rate of 30% (`SOLAR_STORM_LEO_REMOVAL_RATE`) applied to all LEO debris
- Simple event logging showing debris count removed
- Configuration through `SolarStormSettings.tsx` (probability slider only)

### Key Files
- `src/game/engine/events.ts` - Solar storm logic
- `src/game/constants.ts` - Configuration constants
- `src/store/slices/gameSlice.ts` - Game state management
- `src/game/types.ts` - Type definitions
- `src/hooks/useGameSpeed.ts` - Game loop and event triggering
- `src/components/Configuration/SolarStormSettings.tsx` - UI settings

---

## Implementation Approach

### 1. Solar Flare Classification System

**Create new type definitions** (`src/game/types.ts`):
```typescript
export type SolarFlareClass = 'A' | 'B' | 'C' | 'M' | 'X';

export interface SolarFlareEvent {
  class: SolarFlareClass;
  intensity: number; // 1-9 for A-M, can exceed 9 for X
  xRayFlux: number; // W/m² - scientific measurement
  debrisRemovalRate: number; // calculated impact
  affectedLayers: OrbitLayer[];
}
```

**Classification Mapping**:
- A-class: 10⁻⁸ to 10⁻⁷ W/m² → ~5% debris removal, LEO only
- B-class: 10⁻⁷ to 10⁻⁶ W/m² → ~10% debris removal, LEO only
- C-class: 10⁻⁶ to 10⁻⁵ W/m² → ~20% debris removal, LEO only
- M-class: 10⁻⁵ to 10⁻⁴ W/m² → ~35% debris removal, LEO + minor MEO effect (5%)
- X-class: 10⁻⁴+ W/m² → ~50%+ debris removal (scales with intensity), LEO + MEO (20%) + minor GEO (5%)

### 2. Solar Flare Generation

**Update `src/game/engine/events.ts`**:
- Replace simple probability check with flare generation
- Add `generateSolarFlare()` function that:
  - Uses weighted random distribution (B most common, X least common)
  - Generates intensity within class range
  - Calculates debris removal rate based on class/intensity
  - Returns `SolarFlareEvent` object

**Distribution weights** (for realism):
- A-class: 5% (rare in gameplay)
- B-class: 35%
- C-class: 35%
- M-class: 20%
- X-class: 5%

### 3. Multi-Layer Debris Removal

**Enhance `processSolarStorm()` function**:
```typescript
export function processSolarStorm(
  debris: Debris[], 
  flareEvent: SolarFlareEvent
): {
  removedDebris: Map<OrbitLayer, Debris[]>;
  remainingDebris: Debris[];
}
```

- Process each affected orbit layer based on flare class
- Apply different removal rates per layer
- Track removed debris by layer for detailed logging

### 4. Enhanced Event Logging

**Update event details** in `useGameSpeed.ts`:
- Include flare classification (e.g., "M5 solar flare")
- Show X-ray flux value (scientific accuracy)
- Display per-layer debris removal counts
- Add practical impact description

Example message format:
```
"☀️ M5 Solar Flare detected! Cleared 45 debris from LEO, 3 from MEO"
```

Event details should include:
```typescript
{
  flareClass: 'M',
  intensity: 5,
  xRayFlux: 5.2e-5,
  debrisRemoved: {
    LEO: 45,
    MEO: 3
  },
  totalRemoved: 48
}
```

### 5. State Management Updates

**GameState interface** (`src/game/types.ts`):
- Add `lastSolarFlare?: SolarFlareEvent` to track recent flare
- Consider adding `solarFlareHistory` for analytics (optional)

**Update `triggerSolarStorm` action** (`gameSlice.ts`):
- Generate flare event first
- Pass to updated `processSolarStorm()`
- Store flare details in state
- Update debris array with multi-layer removal

### 6. UI Enhancements (Optional)

**Event display** (`src/components/EventLog/EventItem.tsx`):
- Color-code events by flare class severity
- Show expanded details on hover/click
- Display scientific data in tooltip

**Solar Storm Settings** (if time permits):
- Add distribution weight sliders for testing
- Show last flare statistics

---

## Source Code Structure

### Files to Modify
1. **`src/game/types.ts`**
   - Add `SolarFlareClass` type
   - Add `SolarFlareEvent` interface
   - Update `GameState` interface
   - Update `GameEvent` details type

2. **`src/game/constants.ts`**
   - Replace `SOLAR_STORM_LEO_REMOVAL_RATE` with class-based configuration
   - Add `SOLAR_FLARE_CONFIG` object with removal rates per class/layer
   - Add `SOLAR_FLARE_DISTRIBUTION` weights

3. **`src/game/engine/events.ts`**
   - Add `generateSolarFlare(): SolarFlareEvent`
   - Update `processSolarStorm()` signature and implementation
   - Remove or keep `checkSolarStorm()` (use for probability)

4. **`src/store/slices/gameSlice.ts`**
   - Update `triggerSolarStorm` reducer
   - Add state field for last flare
   - Pass flare event to processing function

5. **`src/hooks/useGameSpeed.ts`**
   - Update solar storm trigger logic
   - Enhance event logging with flare details
   - Format message with class and multi-layer removal

### Files to Create
None - all changes are modifications to existing files.

---

## Data Model Changes

### New Types
- `SolarFlareClass`: Union type for flare classifications
- `SolarFlareEvent`: Complete flare event data structure

### Modified Interfaces
- `GameState`: Add optional `lastSolarFlare` field
- `GameEvent.details`: Extend to include detailed flare information

### New Constants
```typescript
SOLAR_FLARE_CONFIG: Record<SolarFlareClass, {
  xRayFluxRange: [number, number];
  intensityRange: [number, number];
  baseRemovalRate: Record<OrbitLayer, number>;
  weight: number;
}>
```

---

## Verification Approach

### Testing Strategy

1. **Unit Testing** (manual/console verification):
   - Generate 100 random flares, verify distribution matches weights
   - Test each flare class produces expected removal rates
   - Verify multi-layer debris removal works correctly
   - Check X-class flares can exceed intensity 9

2. **Integration Testing** (in-game):
   - Run game for multiple turns, observe varied flare events
   - Verify event log shows correct classifications
   - Confirm debris counts decrease appropriately per layer
   - Check edge cases (no LEO debris, high-intensity X flares)

3. **Code Quality**:
   - Run `npm run lint` (check package.json for exact command)
   - Run `npm run typecheck` or `tsc --noEmit`
   - Verify no console errors during gameplay

4. **User Experience**:
   - Solar storms feel varied and impactful
   - Event messages are clear and informative
   - Scientific accuracy is maintained (flux values realistic)

### Success Criteria
- ✅ Multiple flare classes appear during gameplay
- ✅ Different classes have visibly different impacts
- ✅ Event log shows detailed classification and multi-layer removal
- ✅ Higher classes affect multiple orbit layers appropriately
- ✅ No TypeScript errors or runtime warnings
- ✅ Existing game mechanics remain unaffected

---

## Risk Assessment

### Low Risk
- Adding new types (isolated change)
- Enhancing constants (backward compatible)
- Event logging improvements (display only)

### Medium Risk
- Modifying `processSolarStorm()` signature (touches game loop)
- Multi-layer debris removal (could affect game balance)
- State management changes (must maintain Redux patterns)

### Mitigation
- Maintain existing function signatures where possible
- Test thoroughly with different flare intensities
- Keep default behavior similar to current 30% LEO removal for C-class
- Use careful array filtering to avoid performance issues

---

## Implementation Notes

1. **Logarithmic Scale**: Flare classes increase by 10× in power. Debris removal should feel meaningful but not exponential (balance over realism).

2. **Probability Unchanged**: Keep existing solar storm probability system. Only the *type* of storm varies, not frequency.

3. **Performance**: Multi-layer filtering should be efficient. Consider combining filters rather than multiple passes.

4. **Extensibility**: Design allows future enhancements like:
   - DRV effectiveness boost during storms
   - Satellite temporary malfunction
   - Mission objectives tied to specific flare classes

5. **Scientific Accuracy**: X-ray flux values should match real-world ranges while being readable in UI (use scientific notation in details, simple class in main message).
