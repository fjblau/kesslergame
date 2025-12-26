# Technical Specification: Refactor Event Log

## Task Difficulty Assessment
**Difficulty: Medium**

This task requires:
- Adding timestamp tracking to events (data model changes)
- Implementing missing event dispatches in game logic
- Refactoring UI layout to move EventLog component
- Updating event display format
- No architectural changes, but touches multiple files across state, UI, and game engine

## Technical Context

### Language & Framework
- **Language**: TypeScript/React
- **State Management**: Redux Toolkit
- **UI Framework**: React with Tailwind CSS
- **Build Tool**: Vite

### Key Dependencies
- `@reduxjs/toolkit` - State management
- `react` - UI components
- `tailwindcss` - Styling

### Project Structure
```
kessler-game/
├── src/
│   ├── game/
│   │   ├── types.ts               # Core type definitions
│   │   ├── constants.ts           # Game constants
│   │   └── engine/
│   │       ├── collision.ts       # Collision detection logic
│   │       ├── debrisRemoval.ts   # DRV operations
│   │       └── events.ts          # Solar storm logic
│   ├── store/
│   │   ├── slices/
│   │   │   ├── gameSlice.ts       # Main game state
│   │   │   ├── eventSlice.ts      # Event logging state
│   │   │   ├── missionsSlice.ts   # Mission tracking
│   │   │   └── uiSlice.ts         # UI preferences
│   │   └── index.ts
│   ├── components/
│   │   ├── EventLog/
│   │   │   ├── EventLog.tsx       # Event log container
│   │   │   └── EventItem.tsx      # Individual event display
│   │   ├── ControlPanel/
│   │   ├── StatsPanel/
│   │   └── ...
│   ├── hooks/
│   │   └── useGameSpeed.ts        # Game loop hook
│   └── App.tsx                    # Main app layout
├── package.json
└── tsconfig.json
```

## Current State Analysis

### Event System
**Location**: `src/store/slices/eventSlice.ts`

**Current Event Structure** (types.ts:126-132):
```typescript
interface GameEvent {
  id: string;
  type: EventType;
  turn: number;        // Only turn number, no day/time info
  message: string;
  details?: Record<string, unknown>;
}

type EventType = 
  | 'satellite-launch'   // ✓ Implemented (eventSlice.ts:69-76)
  | 'drv-launch'         // ✓ Implemented (eventSlice.ts:78-85)
  | 'collision'          // ✗ NOT dispatched
  | 'debris-removal'     // ✗ NOT dispatched
  | 'mission-complete'   // ✓ Implemented (eventSlice.ts:87-94)
  | 'drv-expired'        // ✗ NOT dispatched
  | 'solar-storm';       // ✓ Implemented (useGameSpeed.ts:73-78)
```

**Event Storage**:
- Events added via `unshift()` (newest first) at eventSlice.ts:34
- Max 200 events retained (eventSlice.ts:14, 36-38)
- Selector: `selectAllEvents` returns full array (eventSlice.ts:101)

**Helper Function**:
```typescript
// eventSlice.ts:20-39
const addEventToState = (
  state: EventsState,
  type: EventType,
  turn: number,
  message: string,
  details?: Record<string, unknown>
)
```

### Time Tracking
**Location**: `src/store/slices/gameSlice.ts`

**Current Time Model**:
```typescript
interface GameState {
  step: number;        // Turn counter
  days: number;        // Day counter (incremented every 1s at useGameSpeed.ts:41-46)
  // ...
}
```

- `incrementDays` action exists at gameSlice.ts:100-102
- Events currently only reference `turn`, not `days`
- Days increment independently via setInterval in useGameSpeed.ts

### UI Layout
**Locations**: `src/App.tsx`, `src/components/EventLog/*.tsx`

**Current Layout** (App.tsx:29-78):
- EventLog is on separate "Events" tab (App.tsx:64-68)
- Full-width component with `max-w-4xl` (EventLog.tsx:9)
- Shows "Turn X" + message (EventItem.tsx:23-24)
- Color-coded border/background by event type (EventItem.tsx:7-15)
- Max height `max-h-[600px]` (EventLog.tsx:14)

**Current Launch Tab Layout** (App.tsx:31-46):
```
┌──────────────────────────────────────────────────┐
│  ControlPanel (420px) │ OrbitViz │ StatsPanel (420px) │
│                       │ SpeedCtrl│                    │
└──────────────────────────────────────────────────┘
```

**Target Layout**:
```
┌──────────────────────────────────────────────────┐
│  ControlPanel (420px) │ OrbitViz │ StatsPanel (420px) │
│                       │ SpeedCtrl│ EventLog           │
└──────────────────────────────────────────────────┘
```

## Implementation Approach

### 1. Update Event Data Model

**File**: `src/game/types.ts` (line 126-132)

Add timestamp fields to `GameEvent`:
```typescript
interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  day: number;           // NEW: Day when event occurred
  timestamp: number;     // NEW: Milliseconds within the day (0-86399999)
  message: string;
  details?: Record<string, unknown>;
}
```

**Timestamp Calculation**:
- Use `Date.now() % 86400000` for realistic milliseconds within day
- Alternative: Use `turn * constant` for deterministic sequential values
- **Recommendation**: Use `Date.now() % 86400000` for realistic timestamps

### 2. Update Event State Management

**File**: `src/store/slices/eventSlice.ts`

Changes needed:
1. Update `addEventToState` signature to accept `day` parameter (line 20-39)
2. Calculate `timestamp` using `Date.now() % 86400000`
3. Update `addEvent` reducer payload type to include `day` (line 45-58)
4. Update extraReducers to pass current day from game state:
   - `launchSatellite` handler (line 69-76)
   - `launchDRV` handler (line 78-85)
   - `notifyMissionComplete` handler (line 87-94)

**Note**: The extraReducers don't have direct access to game state. We need to pass `day` through the action payload in `launchSatellite`, `launchDRV` actions.

### 3. Update Game Actions to Include Day

**File**: `src/store/slices/gameSlice.ts`

Update action payloads to include `day`:

1. **launchSatellite** (line 125-151):
   - Add `day` to payload type
   - Update prepare function to include `state.days`

2. **launchDRV** (line 153-184):
   - Add `day` to payload type
   - Update prepare function to include `state.days`

**File**: `src/store/slices/missionsSlice.ts`

3. **notifyMissionComplete**:
   - Add `day` to payload type
   - Update callers to pass current day

### 4. Add Missing Event Dispatches

**File**: `src/store/slices/gameSlice.ts`

#### A. Collision Events (processCollisions reducer, line 307-391)
Add after line 384 (after `state.recentCollisions.push(...collisionEvents)`):

```typescript
import { addEvent } from './eventSlice';

// In processCollisions, after processing collisions:
for (const collision of collisions) {
  const { obj1, obj2, layer } = collision;
  const isSat1 = 'purpose' in obj1;
  const isSat2 = 'purpose' in obj2;
  const obj1Type = isSat1 ? 'satellite' : ('removalType' in obj1 ? 'DRV' : 'debris');
  const obj2Type = isSat2 ? 'satellite' : ('removalType' in obj2 ? 'DRV' : 'debris');
  
  dispatch(addEvent({
    type: 'collision',
    turn: state.step,
    day: state.days,
    message: `Collision in ${layer}: ${obj1Type} ↔ ${obj2Type}`,
    details: { layer, obj1Type, obj2Type, debrisGenerated: DEBRIS_PER_COLLISION }
  }));
}
```

**Issue**: Reducers cannot dispatch actions directly. Need to handle this differently - either:
- Move event dispatching to `useGameSpeed.ts` after `processCollisions()`
- Use middleware/listener
- Return collision data and dispatch in caller

**Solution**: Add collision tracking to state, then dispatch events in `useGameSpeed.ts`

#### B. DRV Expired Events (decommissionExpiredDRVs reducer, line 393-413)
Similar issue - need to track expired DRVs and dispatch from `useGameSpeed.ts`

#### C. Debris Removal Events (processDRVOperations reducer, line 197-221)
Track debris removal counts and dispatch from `useGameSpeed.ts`

**Alternative Approach**: Use Redux Toolkit's listener middleware or handle event dispatching in `useGameSpeed.ts` hook after each game action.

### 5. Update Event Display Components

**File**: `src/components/EventLog/EventItem.tsx`

Update display format (line 23-24):
```typescript
// Change from:
<div className={`text-xs font-mono ${colors.text} font-semibold min-w-[60px]`}>
  Turn {event.turn}
</div>

// To:
<div className={`text-xs font-mono ${colors.text} font-semibold min-w-[90px]`}>
  D{event.day} • {formatTimestamp(event.timestamp)}
</div>
```

Add timestamp formatting helper:
```typescript
function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}
```

Make layout more compact for sidebar:
- Reduce padding
- Adjust text sizes if needed

**File**: `src/components/EventLog/EventLog.tsx`

Adjust for sidebar placement:
- Remove `max-w-4xl mx-auto` (line 9)
- Reduce max height to `max-h-[400px]` (line 14)
- Keep newest-first ordering (already implemented via unshift)

### 6. Refactor UI Layout

**File**: `src/App.tsx`

**Current structure** (line 29-78):
- Launch tab: 3-column layout with ControlPanel, OrbitViz/SpeedControl, StatsPanel
- Events tab: Full-width EventLog

**Changes needed**:

1. Move EventLog from Events tab to Launch tab (line 34-46):
```typescript
{
  id: 'launch',
  label: 'Launch',
  content: (
    <div className="flex gap-6 justify-center items-start">
      <div className="w-[420px]">
        <ControlPanel />
      </div>
      <div className="flex flex-col gap-6">
        <OrbitVisualization />
        <GameSpeedControl />
      </div>
      <div className="w-[420px] flex flex-col gap-6">
        <StatsPanel />
        <EventLog />  {/* NEW: Add EventLog here */}
      </div>
    </div>
  ),
}
```

2. Update Events tab (line 64-68):
   - **Option A**: Remove the tab entirely
   - **Option B**: Show full event history with search/filter
   - **Option C**: Repurpose for event analytics
   - **Recommendation**: Keep tab but show full scrollable history without 200-event limit in display

### 7. Update Solar Storm Event Dispatch

**File**: `src/hooks/useGameSpeed.ts` (line 73-78)

Update to include `day`:
```typescript
dispatch(addEvent({
  type: 'solar-storm',
  turn: gameState.step + 1,
  day: gameState.days,  // NEW
  message: `☀️ Solar storm cleared ${removedCount} debris from LEO!`,
  details: { debrisRemoved: removedCount }
}));
```

### 8. Handle Event Dispatching from Game Loop

**File**: `src/hooks/useGameSpeed.ts`

Since reducers cannot dispatch actions, we need to:

1. Add state tracking for events that occurred during turn
2. After `processCollisions()`, `processDRVOperations()`, `decommissionExpiredDRVs()`, check state for new events
3. Dispatch corresponding event log entries

**Alternative**: Modify game reducers to return event data, then dispatch from hook.

**Simplest Approach**: 
- For collisions: Check `recentCollisions` length change and dispatch events
- For DRV operations: Track debris count change
- For DRV expiry: Track DRV count and expired DRVs

## Data Model Changes

### GameEvent Interface
```typescript
// Before (types.ts:126-132)
interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  message: string;
  details?: Record<string, unknown>;
}

// After
interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  day: number;           // NEW
  timestamp: number;     // NEW: milliseconds within day
  message: string;
  details?: Record<string, unknown>;
}
```

### Event Payload Updates
All `addEvent` calls must include `day` parameter:
```typescript
dispatch(addEvent({
  type: 'collision',
  turn: state.step,
  day: state.days,        // NEW
  message: 'Collision in LEO orbit',
  details: { layer: 'LEO', objects: ['sat-123', 'debris-456'] }
}))
```

## Source Code Structure Changes

### Files to Modify

1. **src/game/types.ts** (Line 126-132)
   - Add `day` and `timestamp` fields to `GameEvent` interface

2. **src/store/slices/eventSlice.ts**
   - Update `addEventToState` signature to accept `day` and calculate `timestamp` (line 20-39)
   - Update `addEvent` payload type to include `day` (line 45-58)
   - Update extraReducers to pass day from action payload (line 69-94)

3. **src/store/slices/gameSlice.ts**
   - Update `launchSatellite` prepare function to include `day` (line 143-151)
   - Update `launchDRV` prepare function to include `day` (line 176-184)
   - Add collision event tracking/dispatching logic
   - Add DRV expiry event tracking logic
   - Export any needed data for event dispatching

4. **src/store/slices/missionsSlice.ts**
   - Update `notifyMissionComplete` action to include `day` parameter
   - Update callers to pass current day

5. **src/hooks/useGameSpeed.ts**
   - Update solar storm event dispatch to include `day` (line 73-78)
   - Add event dispatching for collisions, DRV operations, DRV expiry
   - Track state changes to determine when to dispatch events

6. **src/components/EventLog/EventItem.tsx**
   - Update to display `day` + `timestamp` instead of turn (line 23-24)
   - Add timestamp formatting function
   - Adjust layout for compactness

7. **src/components/EventLog/EventLog.tsx**
   - Remove `max-w-4xl mx-auto` styling (line 9)
   - Adjust max-height to `max-h-[400px]` (line 14)

8. **src/App.tsx**
   - Move `<EventLog />` from Events tab to Launch tab (line 42-44)
   - Position under StatsPanel in right column
   - Update Events tab content or keep for full history view

### Files to Create
None - all changes are modifications to existing files.

## Verification Approach

### Manual Testing Checklist
1. ✓ Start new game
2. ✓ Launch satellite → verify event appears with day/timestamp on main Launch tab
3. ✓ Launch DRV → verify event appears
4. ✓ Trigger/wait for collision → verify collision event logged
5. ✓ Wait for DRV to remove debris → verify debris-removal event logged
6. ✓ Wait for DRV expiry → verify drv-expired event logged
7. ✓ Check event ordering is chronological (newest first)
8. ✓ Verify EventLog visible on main Launch tab under Orbital Status
9. ✓ Verify formatting is compact and readable
10. ✓ Check that full event history is still accessible on Events tab

### Code Quality
Run project's lint and build commands:
```bash
cd kessler-game
npm run lint
npm run build
```

### Event Coverage Checklist
Verify all event types are dispatched:
- [x] satellite-launch (eventSlice.ts:69-76)
- [x] drv-launch (eventSlice.ts:78-85)
- [ ] collision (TO ADD)
- [ ] debris-removal (TO ADD)
- [x] mission-complete (eventSlice.ts:87-94)
- [ ] drv-expired (TO ADD)
- [x] solar-storm (useGameSpeed.ts:73-78)

## Implementation Strategy

### Phase 1: Data Model & Core Event System
1. Update `GameEvent` interface with `day` and `timestamp` fields
2. Update `addEventToState` to calculate timestamp
3. Update `addEvent` action payload type
4. Update existing event dispatches (satellite-launch, drv-launch, mission-complete, solar-storm)

### Phase 2: Missing Event Dispatches
1. Add collision event tracking in `useGameSpeed.ts`
2. Add DRV expiry event tracking in `useGameSpeed.ts`
3. Add debris removal event tracking in `useGameSpeed.ts`

### Phase 3: UI Updates
1. Update `EventItem.tsx` to show day + timestamp
2. Update `EventLog.tsx` for sidebar layout
3. Move EventLog to Launch tab in `App.tsx`
4. Update Events tab (optional: show full history)

### Phase 4: Testing & Refinement
1. Run manual tests
2. Run lint and build
3. Verify all event types appear correctly
4. Adjust styling/layout as needed

## Open Questions

1. **Timestamp calculation**: 
   - **Chosen**: Use `Date.now() % 86400000` for realistic timestamps
   - Alternative: Use turn-based sequential values

2. **Event ordering**: 
   - **Chosen**: Keep newest-first (current behavior)
   - Already implemented via unshift()

3. **Events tab**: 
   - **Recommendation**: Keep tab, show full scrollable history
   - Could add filters/search later
   - Provides access to events beyond visible sidebar limit

4. **Event dispatching from reducers**:
   - **Issue**: Reducers cannot dispatch actions
   - **Solution**: Handle event creation in `useGameSpeed.ts` hook by tracking state changes
   - Check collision count, DRV count, debris count changes

## Risk Assessment

**Low Risk**:
- Data model changes are additive (adding fields)
- UI changes are isolated to EventLog components and App layout
- Existing events will continue to work (backward compatible if defaults provided)

**Medium Risk**:
- Need to ensure all event dispatches include day from correct state
- Layout changes may affect responsive design
- Multiple files need coordinated updates
- Event dispatching from game loop requires careful state tracking

**Mitigation**:
- Add TypeScript strict checks for event payload (compile-time validation)
- Test layout on different screen sizes (manual verification)
- Incremental implementation: data model → existing events → new events → UI updates
- Add optional chaining for new fields during transition period

## Build & Lint Commands

```bash
# Development server
npm run dev

# Type checking & build
npm run build

# Linting
npm run lint
```

## Summary

This is a **medium complexity** task that requires:
- Type system updates (GameEvent interface)
- State management updates (event slice, game slice, missions slice)
- Game loop updates (useGameSpeed hook for event dispatching)
- UI component updates (EventItem, EventLog)
- Layout refactoring (App.tsx)

The main technical challenge is handling event dispatching from the game loop since Redux reducers cannot dispatch actions. The solution is to track state changes in `useGameSpeed.ts` and dispatch events accordingly.

Total files to modify: **8 files**
Total new files: **0 files**
Estimated implementation time: **2-3 hours**
