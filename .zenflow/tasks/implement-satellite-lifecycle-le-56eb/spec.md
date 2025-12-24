# Technical Specification: Satellite Lifecycle (LEO Expiration)

## Overview
Implement automatic expiration of LEO (Low Earth Orbit) satellites after 20 turns. MEO and GEO satellites do not expire.

## Complexity Assessment
**Easy** - This is a straightforward feature addition to existing logic.

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Framework**: React with Vite

### Dependencies
- `@reduxjs/toolkit` - for Redux state management
- Existing type definitions in `src/game/types.ts`
- Existing constants in `src/game/constants.ts`

## Current Architecture

### Satellite Data Structure
```typescript
interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer; // 'LEO' | 'MEO' | 'GEO'
  purpose: SatelliteType;
  age: number; // Already tracked, increments each turn
  insuranceTier: InsuranceTier;
}
```

### Existing Constants
- `LEO_LIFETIME = 20` (already defined in `src/game/constants.ts:130`)

### Current Turn Advancement Logic
The `advanceTurn` reducer in `gameSlice.ts` currently:
1. Increments step counter
2. Applies budget drain/income
3. Increments all satellite ages (line 106)
4. Increments all DRV ages (line 107)

## Implementation Approach

### Single File Modification
**File**: `kessler-game/src/store/slices/gameSlice.ts`

### Implementation Details

Add satellite expiration logic to the `advanceTurn` reducer after age increment:

```typescript
advanceTurn: (state) => {
  state.step += 1;

  // Existing budget logic...
  
  // Existing age increment
  state.satellites.forEach(sat => sat.age++);
  state.debrisRemovalVehicles.forEach(drv => drv.age++);
  
  // NEW: Remove expired LEO satellites
  state.satellites = state.satellites.filter(
    sat => sat.layer !== 'LEO' || sat.age < LEO_LIFETIME
  );
},
```

**Logic Explanation**:
- Filter keeps satellites where:
  - `sat.layer !== 'LEO'` (MEO/GEO always kept), OR
  - `sat.age < LEO_LIFETIME` (LEO kept if age < 20)
- LEO satellites with `age >= 20` are removed

### Import Addition
Add `LEO_LIFETIME` to the imports from constants:

```typescript
import { BUDGET_DIFFICULTY_CONFIG, MAX_STEPS, LAYER_BOUNDS, DRV_CONFIG, LEO_LIFETIME } from '../../game/constants';
```

## Source Code Structure Changes

### Modified Files
1. `kessler-game/src/store/slices/gameSlice.ts`
   - Add `LEO_LIFETIME` to imports (line 4)
   - Add satellite filtering logic to `advanceTurn` reducer (after line 107)

### No New Files Required

## Data Model / API / Interface Changes

**No changes required** - all necessary types and constants already exist.

## Verification Approach

### Manual Verification
1. Run the development server: `npm run dev`
2. Launch LEO satellites
3. Advance 20+ turns
4. Verify LEO satellites disappear after age reaches 20
5. Launch MEO/GEO satellites and verify they persist beyond 20 turns

### Build & Type Checking
1. Run TypeScript compiler: `npm run build`
2. Run linter: `npm run lint`
3. Ensure no type errors or lint warnings

### Edge Cases to Verify
- LEO satellites at age 19 should remain
- LEO satellites at age 20 should be removed
- MEO satellites at any age should remain
- GEO satellites at any age should remain
- Multiple satellites of different layers should be handled correctly

## Risk Assessment

**Low Risk** - This is a simple filter operation with:
- No new state additions
- No complex logic
- Well-defined behavior
- Existing constants and types

## Success Criteria

1. ✅ LEO satellites removed when `age >= 20`
2. ✅ MEO satellites never expire
3. ✅ GEO satellites never expire
4. ✅ No TypeScript errors
5. ✅ No linter errors
6. ✅ Manual testing confirms expected behavior
