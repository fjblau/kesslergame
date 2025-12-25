# Technical Specification: Metrics Charts

## Overview
Add line charts tracking debris count, satellite count, and cumulative debris removal over time using the Recharts library. This feature allows players to visualize game metrics trends without removing any existing functionality.

**Complexity**: Easy

---

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **Framework**: React 19.2.0
- **State Management**: Redux Toolkit (@reduxjs/toolkit 2.11.2)
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Dependencies to Add
- **recharts**: ^3.6.0 (will be installed via npm)

### Project Structure
```
kessler-game/
├── src/
│   ├── components/
│   │   ├── Charts/ (NEW)
│   │   │   ├── DebrisChart.tsx (NEW)
│   │   │   ├── SatelliteChart.tsx (NEW)
│   │   │   └── DebrisRemovalChart.tsx (NEW)
│   │   ├── ControlPanel/
│   │   └── ...
│   ├── store/
│   │   └── slices/
│   │       └── gameSlice.ts (MODIFY)
│   ├── game/
│   │   └── types.ts (MODIFY)
│   └── App.tsx (MODIFY)
```

---

## Implementation Approach

### 1. Data Model Changes

**Modify `src/game/types.ts`:**
- Add history tracking interface to store metrics per turn:
```typescript
export interface TurnHistory {
  turn: number;
  debrisCount: number;
  satelliteCount: number;
  debrisRemoved: number; // cumulative total debris removed by all DRVs since game start
  activeDRVCount: number; // number of active DRVs at this turn
}
```
- Add `history: TurnHistory[]` to `GameState` interface (after line 53)

**Modify `src/store/slices/gameSlice.ts`:**
- Add `history: []` to `initialState` object (line 18)
- Add `history: []` to the return object in `initializeGame` reducer (line 38)
- Update `advanceTurn` reducer to record metrics **at the END**, after all state updates (budget changes, aging, filtering):
  - Calculate `debrisRemoved`: Sum of `debrisRemoved` field from all DRVs (this is the cumulative total since game start)
  - Calculate `activeDRVCount`: Count of DRVs where `age < maxAge`
  - Push new entry to `state.history` array with current metrics
- **History Recording Formula**:
  ```typescript
  const totalDebrisRemoved = state.debrisRemovalVehicles.reduce(
    (sum, drv) => sum + drv.debrisRemoved, 
    0
  );
  const activeDRVs = state.debrisRemovalVehicles.filter(
    drv => drv.age < drv.maxAge
  ).length;
  
  state.history.push({
    turn: state.step,
    debrisCount: state.debris.length,
    satelliteCount: state.satellites.length,
    debrisRemoved: totalDebrisRemoved,
    activeDRVCount: activeDRVs,
  });
  ```

### 2. Chart Components

Create three new React components in `src/components/Charts/` using **named exports**:

**DebrisChart.tsx:**
- Display debris count over time
- Use Recharts `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`
- Line color: `#ef4444` (Tailwind red-500) or `#f87171` (red-400)
- X-axis: Turn number
- Y-axis: Debris count

**SatelliteChart.tsx:**
- Display satellite count over time
- Line color: `#34d399` (Tailwind emerald-400) or `#10b981` (emerald-500)
- X-axis: Turn number
- Y-axis: Satellite count

**DebrisRemovalChart.tsx:**
- Display cumulative debris removed over time
- Line color: `#4ade80` (Tailwind green-400) matching wireframe
- X-axis: Turn number
- Y-axis: Cumulative debris removed
- Include stats panel below chart:
  - **Total Removed**: Latest `debrisRemoved` value from history
  - **Active DRVs**: Latest `activeDRVCount` value from history
  - **Avg. per Turn**: `totalDebrisRemoved / currentTurn` (rounded to 1 decimal)

### 3. Component Design

All charts will follow this pattern:
```typescript
interface ChartProps {
  data: TurnHistory[];
}

export function DebrisChart({ data }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-300 mb-4">
          Chart Title
        </h2>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No data yet. Start playing to see metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-blue-300 mb-4">
        Chart Title
      </h2>
      <div role="img" aria-label="Chart title description">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            {/* Chart configuration */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

**Styling approach:**
- Use existing Tailwind CSS classes to match app theme
- Dark background (`bg-slate-800`)
- Border styling (`border-slate-700`)
- Blue headings (`text-blue-300`)
- Chart height: 300px (matching wireframe)

**Empty State Handling:**
- When `data.length === 0`, display message: "No data yet. Start playing to see metrics."
- Empty state div has same height as chart (`h-[300px]`) for consistent layout

**Accessibility:**
- Wrap chart in `<div role="img" aria-label="...">` for screen readers
- Example labels:
  - DebrisChart: `aria-label="Debris count over time chart"`
  - SatelliteChart: `aria-label="Satellite count over time chart"`
  - DebrisRemovalChart: `aria-label="Cumulative debris removed over time chart"`

### 4. Integration

**Modify `src/App.tsx`:**
- Import chart components: `import { DebrisChart, SatelliteChart, DebrisRemovalChart } from './components/Charts/...';`
- Read `history` from Redux state: `const history = useAppSelector(state => state.game.history);`
- Add charts section below the existing Game Stats panel in the `lg:col-span-2` div
- Use grid layout for charts: `<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">`

**Layout structure:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Column 1: Control Panel */}
  <div className="lg:col-span-1">
    <ControlPanel />
  </div>

  {/* Columns 2-3: Stats & Charts */}
  <div className="lg:col-span-2 space-y-6">
    {/* Existing Game Stats panel */}
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      {/* ... existing content ... */}
    </div>

    {/* NEW: Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <DebrisChart data={history} />
      <SatelliteChart data={history} />
      <DebrisRemovalChart data={history} />
    </div>
  </div>
</div>
```

**Responsive behavior:**
- Mobile (< lg): All charts stack vertically (1 column)
- Large screens (lg): Charts display in 2 columns
- Extra large screens (xl): Charts display in 3 columns (side-by-side)

---

## Source Code Changes

### Files to Create
1. `kessler-game/src/components/Charts/DebrisChart.tsx`
2. `kessler-game/src/components/Charts/SatelliteChart.tsx`
3. `kessler-game/src/components/Charts/DebrisRemovalChart.tsx`

### Files to Modify
1. `kessler-game/src/game/types.ts` - Add `TurnHistory` interface and update `GameState`
2. `kessler-game/src/store/slices/gameSlice.ts` - Add history tracking logic
3. `kessler-game/src/App.tsx` - Integrate chart components

### Dependencies
1. Install: `npm install recharts` (in `kessler-game/` directory)

---

## Data Flow

1. **Turn Advancement**: When `advanceTurn` action is dispatched
2. **State Updates**: Reducer processes budget changes, aging, and filtering (lines 109-125 in gameSlice.ts)
3. **History Recording** (at END of `advanceTurn` reducer, after all state updates):
   - `turn`: Current `state.step` value
   - `debrisCount`: Current `state.debris.length`
   - `satelliteCount`: Current `state.satellites.length`
   - `debrisRemoved`: Sum of `debrisRemoved` field from all DRVs (this is cumulative since game start, as each DRV tracks its own total)
   - `activeDRVCount`: Count of DRVs where `age < maxAge`
4. **Chart Rendering**: Charts read `history` array from Redux state via `useAppSelector`
5. **Reactivity**: Charts automatically re-render when `state.game.history` changes

**Key Formula:**
```typescript
debrisRemoved = state.debrisRemovalVehicles.reduce((sum, drv) => sum + drv.debrisRemoved, 0)
```
This works because each DRV's `debrisRemoved` field is incremented in `processDRVOperations` and never reset, making it a running total.

---

## Verification Approach

### Testing Steps
1. **Manual Verification**:
   - Start game
   - Launch satellites and DRVs
   - Advance several turns
   - Verify charts display correctly
   - Verify charts update in real-time
   - Verify DebrisRemovalChart stats are accurate

2. **Visual Verification**:
   - Charts match wireframe design
   - Colors match dark theme
   - Responsive layout works on different screen sizes
   - Data points are visible and interactive (tooltips)

3. **Build & Lint**:
   - Run `npm run build` - should complete without errors
   - Run `npm run lint` - should pass without errors

### Edge Cases to Test
- Game with no history (turn 0)
- Game with minimal data (1-2 turns)
- Long game (100+ turns)
- Game where all satellites are destroyed
- Game where no debris is removed

---

## Design Reference

**Wireframe**: `wireframes/debris-removal-chart.html`

**Key design elements:**
- Dark theme (`#1a1a2e` background, `#16213e` panels)
- Blue accents (`#53a8ff`, `#0f3460`)
- Green gradient for removal chart (`#34d399` → `#4ade80`)
- 300px chart height
- Stats panel with centered values
- Clean, modern styling with shadows and borders

**Chart styling from wireframe:**
- Gradient stroke for line
- Circular data points with border
- Grid lines for readability
- Axis labels and values
- Title text above chart
- Stats boxes below with large values

---

## Implementation Notes

1. **No Breaking Changes**: All changes are additive. Existing functionality remains intact.
2. **Performance**: History array grows with turns. For initial implementation, no limit is needed. Consider limiting to last 500 turns if performance becomes an issue (unlikely for games under 1000 turns).
3. **Recharts Configuration**: Use Recharts 3.x with default theming and custom colors matching the app theme. Recharts 3.x is compatible with React 19.
4. **TypeScript**: All components are fully typed with no `any` types.
5. **Accessibility**: Charts must have proper ARIA labels for screen readers (see Component Design section).
6. **Export Pattern**: Use named exports for all chart components to maintain consistency with existing codebase patterns (e.g., `export function DebrisChart(...)`).

---

## Success Criteria

- ✅ Three chart components created and rendering
- ✅ History tracking implemented in Redux state
- ✅ Charts display accurate real-time data
- ✅ Visual design matches app theme and wireframe
- ✅ Empty state handled gracefully
- ✅ Accessibility labels implemented
- ✅ No existing functionality broken
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Build completes successfully

---

## Specification Review Resolutions

All issues from the technical specification review have been addressed:

### Critical Issues ✅
1. ✅ **Recharts version updated** to `^3.6.0` (compatible with React 19)
2. ✅ **Cumulative debris calculation clarified**: Sum of `debrisRemoved` field from all DRVs
3. ✅ **History recording timing specified**: At END of `advanceTurn`, after all state updates
4. ✅ **DebrisRemovalChart data source fixed**: Added `activeDRVCount` to `TurnHistory` interface

### Moderate Issues ✅
5. ✅ **Grid layout specified**: `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6`
6. ✅ **Empty state handling added**: Display message when `data.length === 0`
7. ✅ **Accessibility guidance added**: ARIA labels with specific examples
8. ✅ **initialState updates clarified**: Explicit line numbers and locations specified

### Minor Suggestions ✅
9. ✅ **Color scheme specified**: Hex codes provided for each chart
10. ✅ **Performance threshold added**: 500 turns recommended as future limit
11. ✅ **Export pattern specified**: Named exports for all components
