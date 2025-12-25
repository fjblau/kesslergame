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
- **recharts**: ^2.15.0 (will be installed via npm)

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
  debrisRemoved: number; // cumulative
}
```
- Add `history: TurnHistory[]` to `GameState` interface

**Modify `src/store/slices/gameSlice.ts`:**
- Initialize `history: []` in `initialState`
- Update `advanceTurn` reducer to record metrics at each turn
- Calculate cumulative debris removed from all DRVs
- Reset history in `initializeGame` reducer

### 2. Chart Components

Create three new React components in `src/components/Charts/`:

**DebrisChart.tsx:**
- Display debris count over time
- Use Recharts `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`
- Red/orange color scheme matching wireframe theme
- X-axis: Turn number
- Y-axis: Debris count

**SatelliteChart.tsx:**
- Display satellite count over time
- Green color scheme
- X-axis: Turn number
- Y-axis: Satellite count

**DebrisRemovalChart.tsx:**
- Display cumulative debris removed over time
- Green gradient (matching wireframe: `#34d399` to `#4ade80`)
- X-axis: Turn number
- Y-axis: Cumulative debris removed
- Include stats panel below chart:
  - Total Removed
  - Active DRVs
  - Avg. per Turn

### 3. Component Design

All charts will follow this pattern:
```typescript
interface ChartProps {
  data: TurnHistory[];
}

export function DebrisChart({ data }: ChartProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-blue-300 mb-4">
        Chart Title
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Chart configuration */}
        </LineChart>
      </ResponsiveContainer>
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

### 4. Integration

**Modify `src/App.tsx`:**
- Import chart components
- Read `history` from Redux state
- Add charts to the UI in a new grid section
- Place charts below existing Game Stats panel
- Use responsive grid layout (2 columns on large screens)

**Layout structure:**
```
Header
├── Game Speed Control
└── Grid (3 columns on large screens)
    ├── Column 1: Control Panel
    └── Column 2-3:
        ├── Game Stats (existing)
        └── Charts Section (NEW)
            ├── DebrisChart
            ├── SatelliteChart
            └── DebrisRemovalChart
```

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
2. **History Recording**: Store current metrics in `history` array:
   - `turn`: `state.step`
   - `debrisCount`: `state.debris.length`
   - `satelliteCount`: `state.satellites.length`
   - `debrisRemoved`: Sum of `debrisRemoved` from all DRVs (cumulative)
3. **Chart Rendering**: Charts read `history` from Redux state via selectors
4. **Reactivity**: Charts automatically update when state changes

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
2. **Performance**: History array grows with turns. Consider limiting to last N turns if performance becomes an issue (not necessary for initial implementation).
3. **Recharts Configuration**: Use default Recharts theming with custom colors matching the app theme.
4. **TypeScript**: All components are fully typed with no `any` types.
5. **Accessibility**: Charts should have proper labels for screen readers.

---

## Success Criteria

- ✅ Three chart components created and rendering
- ✅ History tracking implemented in Redux state
- ✅ Charts display accurate real-time data
- ✅ Visual design matches app theme and wireframe
- ✅ No existing functionality broken
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Build completes successfully
