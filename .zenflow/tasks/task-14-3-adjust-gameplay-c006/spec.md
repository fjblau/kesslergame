# Technical Specification: Remove Event Log Truncation

## Difficulty
**Easy** - Simple logic removal, no architectural changes needed.

## Context
- Language: TypeScript/React
- Framework: Redux Toolkit
- File: `kessler-game/src/store/slices/eventSlice.ts`

## Problem
Event log currently truncates at 200 events, limiting visibility into full gameplay history.

## Solution
Remove the `MAX_EVENTS` limit and truncation logic from the event slice. Events will accumulate until a new game is initialized (which already clears the events array).

## Changes Required

### Files Modified
- `kessler-game/src/store/slices/eventSlice.ts`
  - Remove `MAX_EVENTS` constant (line 14)
  - Remove truncation logic from `addEventToState` function (lines 39-41)

## Verification
- Manual testing: Start game, generate many events, verify all appear in Event Log
- Verify new game start clears events (existing behavior)
