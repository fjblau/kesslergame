# Technical Specification: Dynamic Frame for Orbital Visualization

## Difficulty Assessment
**Medium** - Requires state management, component refactoring, and careful styling adjustments across multiple components.

## Technical Context
- **Language**: TypeScript/React
- **Framework**: React with Redux Toolkit (state management)
- **Styling**: TailwindCSS
- **Key Components**:
  - `StatsPanel.tsx` - Contains Risk Level calculation and display
  - `OrbitVisualization.tsx` - Main orbital visualization frame
  - Counter components: `DebrisRemovedCounter.tsx`, `DaysCounter.tsx`, `SatellitesCounter.tsx`, `DRVsCounter.tsx`

## Current Implementation Analysis

### Risk Level Calculation
- **Authoritative source**: `game/engine/risk.ts` (used by Redux state)
  - **LOW**: < 150 debris
  - **MEDIUM**: 150-300 debris
  - **CRITICAL**: > 300 debris
- **StatsPanel local calculation** (StatsPanel.tsx:12-20) - currently inconsistent:
  - **LOW**: < 50 debris → Green (`text-green-400`)
  - **MEDIUM**: 50-99 debris → Yellow/Orange (`text-yellow-400`)
  - **CRITICAL**: ≥ 100 debris → Red (`text-red-400`)
- **Note**: Redux state's `riskLevel` field uses the authoritative calculation from `risk.ts` and is updated automatically during game progression

### Orbital Visualization Frame
- Located in `OrbitVisualization.tsx:146`
- Current border: `border-2 border-slate-600` (2px, static slate color)
- Size: 1000x1000px

### Counter Components
- All 4 counters share similar structure but vary in actual rendered size
- Current styling: `border border-slate-700` (1px border)
- Positioned at corners of OrbitVisualization: `top-4 left-4`, `top-4 right-4`, `bottom-4 left-4`, `bottom-4 right-4`
- No fixed width/height specified - size determined by content

## Implementation Approach

### 1. Centralize Risk Level Logic
Create a shared utility function or hook to access risk level across components:
- **Option A**: Store risk level in Redux state (GameState already has `riskLevel: RiskLevel` field at `types.ts:92`)
- **Option B**: Create a shared utility function/hook that calculates risk level from debris count

**Chosen approach**: Use existing `riskLevel` from Redux state (GameState already tracks this).

### 2. Dynamic Border Color for OrbitVisualization
Update `OrbitVisualization.tsx` to:
- Read `riskLevel` from Redux state
- Map risk level to border color:
  - **LOW** → `border-green-500` (Tailwind green)
  - **MEDIUM** → `border-orange-500` (Tailwind orange)
  - **CRITICAL** → `border-red-500` (Tailwind red)
- Change border width from `border-2` to `border-[3px]` (custom 3px border)

### 3. Standardize Counter Component Sizes
Update all 4 counter components to have consistent dimensions:
- Add fixed `w-[180px]` class for consistent width
- Add `min-h-[80px]` for consistent minimum height
- This ensures uniform appearance regardless of content length

## Files to Modify

1. **`kessler-game/src/components/GameBoard/OrbitVisualization.tsx`**
   - Import `useAppSelector` hook (already imported)
   - Read `riskLevel` from Redux state
   - Create helper function to map risk level to border color
   - Update className on main container div (line 146) to use dynamic border color and 3px width

2. **`kessler-game/src/components/TimeControl/DebrisRemovedCounter.tsx`**
   - Add `w-[180px]` and `min-h-[80px]` to container div (line 8)

3. **`kessler-game/src/components/TimeControl/DaysCounter.tsx`**
   - Add `w-[180px]` and `min-h-[80px]` to container div (line 7)

4. **`kessler-game/src/components/TimeControl/SatellitesCounter.tsx`**
   - Add `w-[180px]` and `min-h-[80px]` to container div (line 7)

5. **`kessler-game/src/components/TimeControl/DRVsCounter.tsx`**
   - Add `w-[180px]` and `min-h-[80px]` to container div (line 8)

## Data Model Changes
No data model changes required - `riskLevel` already exists in GameState.

## Interface Changes
No new interfaces required.

## Verification Approach

### Manual Testing
1. Start the game and observe the Orbital Visualization frame border
2. Initial state (low debris) should show **green** 3px border
3. Launch satellites and observe debris accumulation
4. Verify border changes to **orange** when debris reaches 50-99
5. Verify border changes to **red** when debris reaches 100+
6. Check that all 4 counter frames (Debris Removed, Days, Satellites, DRVs) are the same size

### Visual Verification Points
- [ ] Orbital Visualization border is 3 pixels wide
- [ ] Border color is green when Risk Level is LOW
- [ ] Border color is orange when Risk Level is MEDIUM  
- [ ] Border color is red when Risk Level is CRITICAL
- [ ] All 4 counter frames have identical dimensions
- [ ] Counter frames remain properly positioned in corners

### Code Quality
- [ ] Run TypeScript type checking: `npm run typecheck` (if available)
- [ ] Run linter: `npm run lint` (if available)
- [ ] Verify no console errors in browser

## Implementation Notes

### Border Color Mapping
```typescript
const getBorderColorClass = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case 'LOW': return 'border-green-500';
    case 'MEDIUM': return 'border-orange-500';
    case 'CRITICAL': return 'border-red-500';
  }
};
```

### Counter Size Standardization
All counters should use:
```tsx
<div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 w-[180px] min-h-[80px]">
```

## Potential Risks & Considerations
- **Risk**: Border color change might be too subtle in dark theme
  - **Mitigation**: Using 500 shade for better visibility
- **Risk**: Fixed counter width might cause text overflow with large numbers
  - **Mitigation**: 180px should accommodate typical game values; numbers naturally shrink with larger digits
- **Risk**: riskLevel might not be updated in Redux state
  - **Mitigation**: Verify Redux slice updates riskLevel based on debris count
