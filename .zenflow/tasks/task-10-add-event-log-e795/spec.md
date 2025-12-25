# Technical Specification: Event Log

## Task Complexity Assessment

**Complexity: Easy**

This is a straightforward feature implementation that involves:
- Creating a new Redux slice for event management
- Building simple display components
- Integrating event dispatching into existing actions
- Adding a new tab to the existing tab system

No complex algorithms, edge cases, or architectural changes required.

---

## Technical Context

### Language & Dependencies
- **Language**: TypeScript
- **Framework**: React 19
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Existing Architecture
- Component-based architecture with feature-based folder structure
- Redux slices for domain separation (game, missions, ui)
- Tab-based navigation using custom `Tabs` component
- Turn-based game system with `step` (turn number) as timestamp
- Consistent color coding: green (success), red (danger/collision), blue (info/removal), yellow (in-progress)

---

## Implementation Approach

### 1. Event Data Model

Create a new event system that tracks major game events with timestamps:

**Event Types**:
- `satellite-launch`: When a satellite is launched
- `drv-launch`: When a DRV is launched  
- `collision`: When objects collide
- `debris-removal`: When debris is removed by DRVs
- `mission-complete`: When a mission is completed
- `drv-expired`: When a DRV expires and becomes debris

**Event Interface**:
```typescript
export type EventType = 'satellite-launch' | 'drv-launch' | 'collision' | 'debris-removal' | 'mission-complete' | 'drv-expired';

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  message: string;
  details?: Record<string, unknown>;
}
```

### 2. Redux State Management

Create `eventSlice.ts` following existing Redux patterns:
- State: Array of `GameEvent` objects
- Actions:
  - `addEvent`: Add a new event to the log
  - `clearEvents`: Clear all events (for game reset)
- Selectors:
  - `selectAllEvents`: Get all events (ordered by turn DESC)
  - `selectRecentEvents`: Get last N events

### 3. Event Integration

Dispatch events from existing Redux actions by modifying:
- `gameSlice.ts`:
  - `launchSatellite`: Dispatch satellite-launch event
  - `launchDRV`: Dispatch drv-launch event
  - `processCollisions`: Dispatch collision event for each collision
  - `processDRVOperations`: Dispatch debris-removal events
  - `decommissionExpiredDRVs`: Dispatch drv-expired events
  - `initializeGame`: Clear events on game reset

- `missionsSlice.ts`:
  - `updateMissionProgress`: Dispatch mission-complete event when mission completes

### 4. UI Components

**Component Structure**:
```
src/components/EventLog/
  ├── EventLog.tsx      # Main container component
  └── EventItem.tsx     # Individual event display component
```

**EventLog Component**:
- Container with header "Event Log"
- Scrollable list (max-height with overflow)
- Display events in reverse chronological order (newest first)
- Empty state message when no events
- Consistent styling with MissionPanel

**EventItem Component**:
- Display turn number as timestamp
- Display event message
- Color-coded by event type:
  - Green: `satellite-launch`, `drv-launch`
  - Red: `collision`
  - Blue: `debris-removal`
  - Yellow: `mission-complete`
  - Gray: `drv-expired`
- Border accent color matching event type
- Compact, readable design

### 5. Tab Integration

Add "Events" tab between "Missions" and "Documentation" in `App.tsx`:
- Insert new tab object in tabs array at index 3
- Tab id: `'events'`
- Tab label: `'Events'`
- Tab content: `<EventLog />`

---

## Source Code Structure Changes

### New Files

1. **`src/store/slices/eventSlice.ts`**
   - Event state interface
   - Event slice with reducers and actions
   - Selectors for event queries

2. **`src/components/EventLog/EventLog.tsx`**
   - Main event log container component
   - Uses Redux to fetch events
   - Scrollable event list display

3. **`src/components/EventLog/EventItem.tsx`**
   - Individual event item component
   - Color-coded event display
   - Turn number and message

### Modified Files

1. **`src/store/index.ts`**
   - Import and add event reducer to store

2. **`src/store/slices/gameSlice.ts`**
   - Import `addEvent` action
   - Dispatch events in: `launchSatellite`, `launchDRV`, `processCollisions`, `processDRVOperations`, `decommissionExpiredDRVs`, `initializeGame`

3. **`src/store/slices/missionsSlice.ts`**
   - Import `addEvent` action
   - Dispatch mission-complete events in `updateMissionProgress`

4. **`src/App.tsx`**
   - Import `EventLog` component
   - Add "Events" tab to tabs array

5. **`src/game/types.ts`**
   - Add `EventType` type
   - Add `GameEvent` interface
   - Add `EventsState` interface

---

## Data Model / API / Interface Changes

### New Types (in `types.ts`)

```typescript
export type EventType = 'satellite-launch' | 'drv-launch' | 'collision' | 'debris-removal' | 'mission-complete' | 'drv-expired';

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface EventsState {
  events: GameEvent[];
}
```

### Redux Store Shape

```typescript
{
  game: GameState,
  ui: UIState,
  missions: MissionsState,
  events: EventsState  // NEW
}
```

---

## Verification Approach

### Development Verification

1. **Visual Testing**:
   - Launch the app and play a few turns
   - Verify events appear in the Events tab
   - Check color coding is correct for each event type
   - Test scrolling with many events
   - Verify empty state displays when no events

2. **Event Coverage**:
   - Launch satellites → green event appears
   - Launch DRVs → green event appears
   - Trigger collisions → red event appears
   - Wait for debris removal → blue event appears
   - Complete a mission → yellow event appears
   - Wait for DRV to expire → gray event appears

3. **Integration Testing**:
   - Start new game → events should clear
   - Switch between tabs → Events tab should maintain state
   - Events should persist during gameplay

### Code Quality

Run existing project linters and type checker:
```bash
npm run lint
npm run build  # This runs tsc -b for type checking
```

### Manual Testing Checklist

- [ ] Events tab appears between Missions and Documentation
- [ ] Events display in reverse chronological order
- [ ] Event colors match specification
- [ ] Scroll works when many events exist
- [ ] Empty state shows when no events
- [ ] All event types are tracked correctly
- [ ] Events clear on game reset
- [ ] No console errors or warnings
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes

---

## Implementation Notes

### Message Format Examples

- **Satellite Launch**: `"Launched GPS satellite in LEO orbit"`
- **DRV Launch**: `"Deployed cooperative DRV to MEO orbit"`
- **Collision**: `"Collision detected in GEO! 2 objects destroyed, 15 debris generated"`
- **Debris Removal**: `"DRV removed 3 debris pieces from LEO"`
- **Mission Complete**: `"Mission completed: GPS Priority Network"`
- **DRV Expired**: `"DRV expired in MEO, became debris"`

### Event Details (Optional)

Store additional metadata in `details` field for potential future use:
- Satellite: `{ orbit, purpose, insuranceTier }`
- DRV: `{ orbit, drvType, targetPriority }`
- Collision: `{ objectCount, debrisGenerated, insurancePayout }`
- Debris removal: `{ count, orbit }`
- Mission: `{ missionId, title }`

### Performance Considerations

- Limit events array to last 100-200 events to prevent memory issues
- Consider adding event pruning in `addEvent` reducer
- Use `key={event.id}` for efficient React rendering

### Styling Consistency

Follow existing patterns from `MissionPanel` and `MissionCard`:
- Dark slate background (`bg-slate-800`)
- Border styling (`border-slate-700`)
- Consistent spacing and rounded corners
- Hover effects for interactivity
- Responsive text sizing
