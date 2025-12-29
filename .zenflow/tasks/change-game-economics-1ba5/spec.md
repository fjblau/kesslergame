# Technical Specification: Satellite Revenue System

## Task Difficulty
**Medium** - Requires integration with existing game economics, balance considerations, and UI updates

## Overview
Implement a revenue generation system where satellites generate income every turn they remain in orbit. Each satellite type (Weather, Comms, GPS) will have a specific revenue amount that is added to the budget during each turn advancement.

## Technical Context
- **Language**: TypeScript/React
- **Framework**: Redux Toolkit for state management
- **Key Technologies**: React, Redux, Vite
- **Architecture**: Redux slices pattern with middleware for side effects

## Current System Analysis

### Budget System
- Budget is tracked in `GameState.budget`
- Current income system uses `budgetIncomeAmount` and `budgetIncomeInterval` (interval-based income)
- Budget drain exists via `budgetDrainAmount` (per-turn deduction)
- Budget changes occur in `advanceTurn` reducer (gameSlice.ts:367-455)

### Satellite System
- Satellite types: `Weather`, `Comms`, `GPS` (types.ts:2)
- Satellites tracked in `GameState.satellites` array
- Each satellite has `purpose: SatelliteType` property
- Satellites age each turn and move around orbit

### Turn Processing Flow
1. `advanceTurn` is called from `useGameSpeed` hook
2. Budget drain is applied (line 374-376)
3. Interval-based income is added (line 378-381)
4. Satellites age and move (line 395-401)
5. Turn history is recorded

## Implementation Approach

### 1. Define Satellite Revenue Constants
Add a new constant in `constants.ts` defining revenue per satellite type:
```typescript
export const SATELLITE_REVENUE: Record<SatelliteType, number> = {
  Weather: 100_000,
  Comms: 150_000,
  GPS: 200_000,
};
```

**Revenue Balancing Rationale:**
- Current interval income (normal): 5M every 20 turns = 250K per turn
- 10 satellites would generate 1.5M-2M per turn (if mixed types)
- Launch costs: LEO 2M, MEO 3M, GEO 5M
- This creates positive ROI after 10-30 turns depending on satellite type and orbit
- Revenue should incentivize satellite deployment while maintaining budget tension

### 2. Modify Turn Advancement Logic
Update `advanceTurn` reducer in `gameSlice.ts` to:
1. Count satellites by type
2. Calculate total revenue
3. Add revenue to budget
4. Track revenue in game state (for potential UI display)

Add after budget drain and before interval-based income (around line 377):
```typescript
// Calculate satellite revenue
const satelliteRevenue = state.satellites.reduce((total, sat) => {
  return total + SATELLITE_REVENUE[sat.purpose];
}, 0);

if (satelliteRevenue > 0) {
  state.budget += satelliteRevenue;
}
```

### 3. Optional: Track Revenue Metrics
Consider adding to `GameState` (types.ts):
```typescript
lastSatelliteRevenue?: number;  // For UI display
totalSatelliteRevenue?: number; // For score/stats tracking
```

### 4. Event Logging Integration
The existing event system should automatically capture budget changes through the scoreMiddleware. Consider adding explicit satellite revenue events if detailed tracking is needed.

## Files to Modify

### Primary Changes
1. **`kessler-game/src/game/constants.ts`**
   - Add `SATELLITE_REVENUE` constant

2. **`kessler-game/src/store/slices/gameSlice.ts`**
   - Import `SATELLITE_REVENUE` constant
   - Modify `advanceTurn` reducer to calculate and add satellite revenue

### Optional Changes (if tracking revenue metrics)
3. **`kessler-game/src/game/types.ts`**
   - Add `lastSatelliteRevenue` and `totalSatelliteRevenue` to `GameState` interface

4. **`kessler-game/src/components/StatsPanel/StatsPanel.tsx`**
   - Display satellite revenue information

## Data Model Changes

### Constants (constants.ts)
```typescript
export const SATELLITE_REVENUE: Record<SatelliteType, number> = {
  Weather: 100_000,
  Comms: 150_000,
  GPS: 200_000,
};
```

### State (types.ts) - Optional
```typescript
export interface GameState {
  // ... existing fields
  lastSatelliteRevenue?: number;
  totalSatelliteRevenue?: number;
}
```

## Game Balance Considerations

### Revenue Amounts
- **Weather**: $100K/turn (lowest utility satellites)
- **Comms**: $150K/turn (medium value)
- **GPS**: $200K/turn (highest value)

### Economic Impact
- Existing normal mode: 200M starting budget, 5M every 20 turns
- With satellite revenue: Incentivizes early satellite launches
- ROI calculations:
  - LEO Weather (2M cost): 20 turns to break even
  - MEO Comms (3M cost): 20 turns to break even
  - GEO GPS (5M cost): 25 turns to break even
- Insurance costs (500K-1M) extend payback period
- Creates strategic decision: quick ROI vs. insurance protection

### Difficulty Scaling
Current implementation applies equally to all difficulty levels. Future enhancement could scale revenue by difficulty:
- Easy: 1.5x multiplier
- Normal: 1.0x multiplier
- Hard: 0.75x multiplier
- Challenge: 0.5x multiplier

## Verification Approach

### Manual Testing
1. Start a new game
2. Launch satellites of different types
3. Advance several turns
4. Verify budget increases by expected amounts:
   - 1 Weather sat: +100K per turn
   - 1 Comms sat: +150K per turn
   - 1 GPS sat: +200K per turn
   - Multiple satellites: sum of individual revenues
5. Verify revenue stops when satellite is destroyed in collision
6. Test across different difficulty levels

### Code Quality
1. Run TypeScript compiler: `npm run build`
2. Run linter: `npm run lint` (if available)
3. Verify no console errors in browser

### Edge Cases to Test
- Zero satellites (no revenue)
- Mixed satellite types (correct sum)
- Satellite destruction mid-game (revenue decreases)
- Game initialization (no errors with new fields)
- Multiple difficulty levels

## Implementation Notes

### Why This Approach
1. **Minimal changes**: Leverages existing budget and turn systems
2. **Consistent with patterns**: Uses same constant/reducer pattern as existing costs
3. **Performance**: O(n) calculation per turn is negligible for expected satellite counts
4. **Extensible**: Easy to add difficulty multipliers, revenue bonuses, etc. later

### Alternative Approaches Considered
1. **Per-orbit revenue**: Different revenue based on orbit layer - Rejected: Adds complexity without clear gameplay benefit
2. **Age-based revenue degradation**: Older satellites earn less - Rejected: Scope creep, complicates balancing
3. **Separate revenue action**: New Redux action for revenue - Rejected: Unnecessary abstraction

## Risks and Mitigations

### Risk: Revenue amounts may unbalance game
**Mitigation**: Start with conservative values, easy to adjust constants later

### Risk: Breaks existing game balance
**Mitigation**: Thoroughly test all difficulty modes, adjust difficulty configs if needed

### Risk: Performance impact with many satellites
**Mitigation**: Simple O(n) iteration is fast; can optimize if needed

## Success Criteria
1. ✓ Satellites generate revenue per turn based on type
2. ✓ Revenue is added to budget during turn advancement
3. ✓ Revenue constants are defined in constants.ts
4. ✓ No TypeScript errors
5. ✓ No runtime errors
6. ✓ Game remains balanced and playable
7. ✓ Manual testing confirms correct revenue calculation
