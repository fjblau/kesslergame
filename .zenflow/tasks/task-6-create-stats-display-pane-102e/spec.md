# Technical Specification: Stats Display Panel

## Task Overview
Create a real-time statistics display panel showing orbital environment metrics including satellites, debris breakdown, DRVs, debris removed, and risk level.

**Complexity**: Easy

## Technical Context

### Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Dependencies
All required dependencies are already installed. No new packages needed.

## Implementation Approach

### Component Architecture
Following the existing codebase patterns:
- Functional components with hooks
- Redux for state management via `useAppSelector`
- Tailwind utility classes for styling
- Component folder structure: `src/components/[ComponentName]/[ComponentName].tsx`

### Design Reference
Two wireframe files provide visual guidance:
- `wireframes/status-display.html` - Overall stats panel layout
- `wireframes/debris-breakdown.html` - Debris breakdown visualization options (bars/pie chart)

**Note**: Implementation will use Tailwind classes instead of custom CSS, following existing component patterns in the codebase.

## Source Code Changes

### New Files

#### 1. `src/components/StatsPanel/StatsPanel.tsx`
Main stats display component showing:
- Active satellites count
- Active DRVs count
- Total debris with breakdown
- Total debris removed
- Risk level indicator
- Current step

**Data Sources** (from Redux state):
```typescript
state.game.satellites.length                    // Active satellites
state.game.debrisRemovalVehicles.length        // Active DRVs  
state.game.debris                              // For total & breakdown
state.game.debrisRemovalVehicles               // Sum debrisRemoved for total
state.game.step                                // Current step
```

**Risk Level Calculation**:
```typescript
type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

// Based on total debris count
totalDebris < 50:   LOW      (🟢 green)
50 <= total < 100:  MEDIUM   (🟡 yellow) 
total >= 100:       CRITICAL (🔴 red)
```

#### 2. `src/components/StatsPanel/DebrisBreakdown.tsx`
Reusable component for debris cooperative/uncooperative breakdown display.

**Props**:
```typescript
interface DebrisBreakdownProps {
  cooperative: number;
  uncooperative: number;
  total: number;
}
```

**Display**:
- Shows counts and percentages
- Visual indicators (could be simple list, bars, or styled based on wireframe)
- Matches parent panel styling

### Modified Files

#### `src/App.tsx`
Replace the existing simple stats display (lines 42-60) with the new `StatsPanel` component.

**Current code to replace**:
```typescript
<div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
  <h2 className="text-xl font-bold text-blue-300 mb-4">Game Stats</h2>
  <div className="grid grid-cols-2 gap-4 text-sm">
    {/* ... existing stat cards ... */}
  </div>
  {/* ... Phase 1 features section ... */}
</div>
```

**New code**:
```typescript
<StatsPanel />
```

Keep the "Phase 1 Features Implemented" section below the stats panel or integrate it appropriately.

## Data Model / Interface Changes

### New TypeScript Interfaces

```typescript
// src/components/StatsPanel/StatsPanel.tsx
interface RiskLevel {
  level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  color: string;
  emoji: string;
}
```

### State Calculations
No changes to Redux state structure needed. All data is derived from existing state:

1. **Active Satellites**: Direct count from `state.game.satellites`
2. **Active DRVs**: Count from `state.game.debrisRemovalVehicles` where `age < maxAge`
3. **Total Debris**: `state.game.debris.length`
4. **Cooperative Debris**: `state.game.debris.filter(d => d.type === 'cooperative').length`
5. **Uncooperative Debris**: `state.game.debris.filter(d => d.type === 'uncooperative').length`
6. **Debris Removed**: Sum of `debrisRemoved` from all DRVs: 
   ```typescript
   state.game.debrisRemovalVehicles.reduce((sum, drv) => sum + drv.debrisRemoved, 0)
   ```
7. **Risk Level**: Calculated based on total debris count thresholds

## Styling Approach

### Color Palette (from existing codebase)
- **Background**: `bg-slate-800`, `bg-slate-900`
- **Borders**: `border-slate-700`, `border-slate-600`
- **Text**: Primary: `text-blue-300`, Secondary: `text-gray-400`
- **Values**: 
  - Satellites: `text-green-400`
  - Debris: `text-red-400` / `text-yellow-400`
  - DRVs: `text-blue-400`
  - Removed: `text-green-500`

### Component Styling
- Panel: `bg-slate-800 border border-slate-700 rounded-lg p-6`
- Header: `text-xl font-bold text-blue-300 mb-4`
- Stat rows: Grid or flex layout with consistent spacing
- Risk badges: Inline with emoji and colored text

### Matching Wireframe Design
The wireframes show:
- Dark background panels (`#16213e` → map to `bg-slate-800`)
- Blue accents (`#53a8ff` → map to `text-blue-300/400`)
- Gold/yellow for debris total (`#ffd700` → map to `text-yellow-400`)
- Tree-style breakdown with `├─` and `└─` characters (optional, can simplify)

## Verification Approach

### Development Testing
1. **Visual verification**: Run `npm run dev` and check display matches wireframes
2. **Data accuracy**: 
   - Launch satellites → count increases
   - Launch DRVs → count increases  
   - DRVs remove debris → debris count decreases, removed count increases
   - Debris hits thresholds → risk level changes color
3. **Responsive behavior**: Check layout at different screen sizes

### Code Quality
1. **Lint**: Run `npm run lint` - ensure no errors
2. **Type check**: Run `tsc -b` - ensure no TypeScript errors
3. **Build**: Run `npm run build` - ensure successful production build

### Integration Testing
1. Verify StatsPanel integrates cleanly into App.tsx layout
2. Check that real-time updates work when game state changes
3. Confirm no performance issues with rapid state updates (fast game speed)

## Implementation Notes

### Simplifications from Wireframe
- No need for complex pie charts or progress bars (wireframe shows options)
- Can use simple text-based breakdown with styled indicators
- Focus on data accuracy and clean display over complex visualizations

### Edge Cases
1. **Zero debris**: Handle division by zero for percentages
2. **No DRVs**: Display "0" appropriately
3. **Large numbers**: Ensure counts display clearly (no overflow)

### Accessibility
- Use semantic HTML elements
- Ensure color is not the only indicator (use emoji + text for risk)
- Maintain sufficient color contrast

## Success Criteria
✅ StatsPanel component displays all required metrics  
✅ Real-time updates when game state changes  
✅ Risk level correctly calculated and color-coded  
✅ Debris breakdown shows cooperative/uncooperative split  
✅ Styling matches existing component patterns  
✅ No TypeScript errors  
✅ No lint errors  
✅ Successful production build  
✅ Integrates seamlessly into App.tsx
