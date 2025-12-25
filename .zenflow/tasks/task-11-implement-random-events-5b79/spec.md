# Technical Specification: Random Events (Solar Storms)

## Task Difficulty Assessment

**Complexity Level**: **Easy**

**Reasoning**:
- Straightforward implementation with clear requirements
- Simple probability check (10% chance)
- Basic array manipulation for debris removal
- Event logging already established in the codebase
- No complex UI components needed (uses existing event log system)
- Well-defined scope with minimal edge cases

---

## Technical Context

### Language & Dependencies
- **Language**: TypeScript 5.x
- **Framework**: React 18.x with Redux Toolkit
- **Existing Systems**: Event logging (`eventSlice`), game state management (`gameSlice`)
- **No New Dependencies**: Implementation uses existing libraries

### Current Architecture
- **State Management**: Redux Toolkit with slice-based architecture
- **Event System**: Centralized event logging via `eventSlice.ts`
- **Game Loop**: Turn-based system triggered by `advanceTurn()` action
- **Data Model**: Debris stored as array in `GameState.debris`

---

## Implementation Approach

### 1. Core Functionality

#### Random Event Detection
Create a new engine module `src/game/engine/events.ts` with:
- `checkSolarStorm()`: Returns boolean (10% probability)
- `processSolarStorm()`: Removes 30% of LEO debris randomly

#### Event Processing Flow
Solar storm check should be integrated into the turn advancement sequence:
1. Player launches satellite/DRV OR fast mode auto-advances
2. `advanceTurn()` is dispatched
3. **NEW**: Solar storm check occurs
4. If triggered, remove 30% of LEO debris
5. Log event to event system
6. Continue with existing game logic (collisions, DRV operations, etc.)

### 2. Data Model Changes

#### Add New Event Type
**File**: `src/game/types.ts`

```typescript
export type EventType = 
  | 'satellite-launch' 
  | 'drv-launch' 
  | 'collision' 
  | 'debris-removal' 
  | 'mission-complete' 
  | 'drv-expired'
  | 'solar-storm';  // NEW
```

#### Add Solar Storm Constant
**File**: `src/game/constants.ts`

```typescript
export const SOLAR_STORM_PROBABILITY = 0.10;
export const SOLAR_STORM_LEO_REMOVAL_RATE = 0.30;
```

### 3. Source Code Structure

#### New Files

**`src/game/engine/events.ts`**
```typescript
import { SOLAR_STORM_PROBABILITY, SOLAR_STORM_LEO_REMOVAL_RATE } from '../constants';
import type { Debris } from '../types';

export function checkSolarStorm(): boolean {
  return Math.random() < SOLAR_STORM_PROBABILITY;
}

export function processSolarStorm(debris: Debris[]): {
  removedDebris: Debris[];
  remainingDebris: Debris[];
} {
  const leoDebris = debris.filter(d => d.layer === 'LEO');
  const nonLeoDebris = debris.filter(d => d.layer !== 'LEO');
  
  const removalCount = Math.floor(leoDebris.length * SOLAR_STORM_LEO_REMOVAL_RATE);
  
  // Shuffle LEO debris and split
  const shuffled = [...leoDebris].sort(() => Math.random() - 0.5);
  const removedDebris = shuffled.slice(0, removalCount);
  const remainingLeoDebris = shuffled.slice(removalCount);
  
  return {
    removedDebris,
    remainingDebris: [...nonLeoDebris, ...remainingLeoDebris]
  };
}
```

#### Modified Files

**`src/store/slices/gameSlice.ts`**
- Add new reducer: `triggerSolarStorm`
- Import event functions from `src/game/engine/events.ts`

```typescript
triggerSolarStorm: (state) => {
  const result = processSolarStorm(state.debris);
  state.debris = result.remainingDebris;
  state.riskLevel = calculateRiskLevel(state.debris.length);
}
```

**`src/components/EventLog/EventItem.tsx`**
- Add color mapping for 'solar-storm' event type

```typescript
const eventColorMap = {
  // ... existing mappings
  'solar-storm': { 
    border: 'border-orange-500', 
    bg: 'bg-orange-500/10', 
    text: 'text-orange-400' 
  },
};
```

### 4. Integration Points

#### Dispatch Solar Storm from Game Loop
The solar storm should be triggered automatically during turn processing. Two integration points:

**Option A: Hook into ControlPanel.tsx `handleLaunch()`**
```typescript
// After advanceTurn()
if (checkSolarStorm()) {
  dispatch(triggerSolarStorm());
  dispatch(addEvent({
    type: 'solar-storm',
    turn: state.game.step,
    message: `☀️ Solar storm cleared ${removedCount} debris from LEO!`,
    details: { debrisRemoved: removedCount }
  }));
}
```

**Option B: Hook into useGameSpeed.ts interval** (for fast mode)
```typescript
// Inside the setInterval callback
if (checkSolarStorm()) {
  // ... same dispatch logic
}
```

**Recommendation**: Implement in both locations to ensure consistency between manual and fast mode.

### 5. Visual Indicators

#### Event Log Entry
- **Color**: Orange theme (matches space/sun aesthetic)
- **Icon**: ☀️ emoji in message
- **Border**: Orange border-left indicator
- **Background**: Subtle orange glow

#### No Additional Animation Required
- Event log entry provides sufficient visual feedback
- Debris count will update automatically in StatsPanel
- OrbitVisualization will reflect debris removal automatically

---

## Verification Approach

### Unit Tests
Create `src/game/engine/events.test.ts`:

```typescript
describe('Solar Storm Events', () => {
  test('checkSolarStorm returns boolean', () => {
    const result = checkSolarStorm();
    expect(typeof result).toBe('boolean');
  });

  test('processSolarStorm removes ~30% of LEO debris', () => {
    const debris = [
      ...Array(100).fill(null).map((_, i) => ({
        id: `leo-${i}`,
        layer: 'LEO',
        x: 0,
        y: 0,
        type: 'cooperative'
      })),
      ...Array(50).fill(null).map((_, i) => ({
        id: `meo-${i}`,
        layer: 'MEO',
        x: 0,
        y: 0,
        type: 'cooperative'
      }))
    ];

    const result = processSolarStorm(debris);
    
    // Should remove ~30 LEO debris
    expect(result.removedDebris.length).toBeGreaterThanOrEqual(28);
    expect(result.removedDebris.length).toBeLessThanOrEqual(32);
    
    // Should keep all MEO debris
    expect(result.remainingDebris.filter(d => d.layer === 'MEO').length).toBe(50);
  });
});
```

### Integration Testing
1. **Manual Play Testing**:
   - Launch satellites/DRVs repeatedly
   - Verify solar storms occur roughly 10% of turns
   - Check event log displays storm events with correct formatting
   - Confirm LEO debris count decreases appropriately

2. **Redux DevTools Verification**:
   - Monitor `triggerSolarStorm` action dispatch
   - Verify state updates correctly remove debris
   - Check event is added to `events.events` array

3. **Visual Verification**:
   - Orange event entry appears in Event Log
   - Debris count in StatsPanel decreases
   - OrbitVisualization shows fewer LEO particles

### Edge Cases
- **No LEO debris**: Solar storm should not crash (removes 0 debris)
- **Single LEO debris**: Should handle fractional removal (0 debris removed since 0.3 < 1)
- **Rapid fire storms**: Multiple storms in sequence should work correctly

### Performance Check
- Ensure shuffle/slice operations don't cause lag with 100+ debris
- Verify no memory leaks from event accumulation (MAX_EVENTS = 200 cap exists)

---

## Implementation Checklist

- [ ] Add `SOLAR_STORM_PROBABILITY` and `SOLAR_STORM_LEO_REMOVAL_RATE` constants
- [ ] Add `'solar-storm'` to `EventType` union
- [ ] Create `src/game/engine/events.ts` with `checkSolarStorm()` and `processSolarStorm()`
- [ ] Add `triggerSolarStorm` reducer to `gameSlice.ts`
- [ ] Export `triggerSolarStorm` action from `gameSlice.ts`
- [ ] Add solar storm color mapping to `EventItem.tsx`
- [ ] Integrate solar storm check in `ControlPanel.tsx` `handleLaunch()`
- [ ] Integrate solar storm check in `useGameSpeed.ts` interval
- [ ] Dispatch `addEvent` with solar storm details after triggering
- [ ] Write unit tests for event functions
- [ ] Manual testing (20+ turns to verify ~10% occurrence)
- [ ] Verify event log displays correctly with orange styling

---

## Success Criteria

✅ Solar storms occur approximately 10% of turns (verified over 50+ turns)  
✅ Each storm removes 30% of LEO debris (±2% for rounding)  
✅ MEO and GEO debris unaffected by solar storms  
✅ Event log displays orange-themed solar storm entries  
✅ Message includes emoji and debris removal count  
✅ No crashes when no LEO debris exists  
✅ Risk level updates correctly after debris removal  
✅ Unit tests pass with >80% coverage of new code
