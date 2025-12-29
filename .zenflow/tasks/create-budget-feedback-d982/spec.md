# Technical Specification: Budget Feedback Gauge

## Task Complexity
**Medium** - Requires creating a new visual component with conditional styling, integrating it into the existing layout, and modifying an existing component for consistent button heights.

## Technical Context

### Technology Stack
- **Language**: TypeScript
- **Framework**: React 19.2.0
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Relevant Files
- `kessler-game/src/components/ControlPanel/ControlPanel.tsx` - Main control panel where budget is displayed
- `kessler-game/src/components/SatelliteConfig/SatellitePurposeSelector.tsx` - Satellite type selector with buttons
- `kessler-game/src/game/constants.ts` - Budget difficulty configurations and cost constants
- `kessler-game/src/game/types.ts` - Type definitions including GameState with budget

### Current Implementation
1. **Budget Display** (ControlPanel.tsx:167-171):
   - Shows "Budget:" label with amount in millions
   - Color coded: green if can afford launch, red if cannot
   - Located in bottom section before Launch button

2. **Satellite Type Buttons** (SatellitePurposeSelector.tsx:15-43):
   - 2x2 grid layout with 4 options (Weather, Comms, GPS, Random)
   - Variable height because "Random" option includes discount text
   - Uses Tailwind with padding `p-4` and dynamic border/background colors

## Implementation Approach

### 1. Create Budget Gauge Component
Create a new component `BudgetGauge.tsx` in the ControlPanel directory that:
- Accepts budget amount as prop
- Calculates percentage filled based on starting budget (context-aware)
- Displays horizontal rectangular gauge with:
  - Background bar (empty state)
  - Filled portion representing current budget
  - Color coding based on budget level
- Uses Tailwind classes for styling consistent with existing design

### 2. Budget Color Thresholds
Implement color coding based on budget ranges:
- **Green** (healthy): Budget ≥ $50M
- **Yellow** (warning): Budget between $20M - $50M
- **Red** (critical): Budget < $20M

These thresholds are based on typical launch costs:
- LEO satellite: $2M + insurance
- MEO satellite: $3M + insurance
- GEO satellite: $5M + insurance
- DRV costs range from $4M to $17.5M

### 3. Integrate Gauge into ControlPanel
Modify `ControlPanel.tsx`:
- Import new BudgetGauge component
- Insert gauge between Budget display (line 167-171) and Launch button (line 172-182)
- Maintain proper spacing with existing Tailwind utilities
- Pass current budget as prop

### 4. Standardize Satellite Type Button Heights
Modify `SatellitePurposeSelector.tsx`:
- Add fixed height or min-height to button containers
- Ensure discount text doesn't affect button height
- Use Tailwind flexbox utilities to vertically center content
- Maintain responsive 2x2 grid layout

## Source Code Structure Changes

### New Files
- `kessler-game/src/components/ControlPanel/BudgetGauge.tsx` - New gauge component

### Modified Files
- `kessler-game/src/components/ControlPanel/ControlPanel.tsx` - Integrate gauge component
- `kessler-game/src/components/SatelliteConfig/SatellitePurposeSelector.tsx` - Standardize button heights

## Data Model / API / Interface Changes

### New Component Interface
```typescript
interface BudgetGaugeProps {
  budget: number;
  maxBudget?: number; // Optional, defaults to starting budget based on difficulty
}
```

No changes to Redux state, game logic, or existing APIs required.

## Verification Approach

### Manual Testing
1. Launch development server: `npm run dev`
2. Verify budget gauge appears below "Budget:" label and above "Launch" button
3. Test color transitions:
   - Start game with high budget (should be green)
   - Launch expensive items to reduce budget to $30M (should be yellow)
   - Reduce budget below $20M (should be red)
4. Verify gauge fills proportionally to budget amount
5. Check Satellite Type buttons are uniform height across all 4 options

### Code Quality
1. Run TypeScript compiler: `npm run build` (includes `tsc -b`)
2. Run linter: `npm run lint`
3. Verify no TypeScript errors or linting issues

### Visual Consistency
1. Ensure gauge styling matches existing UI theme (slate/blue color palette)
2. Verify proper spacing and alignment in control panel
3. Test that layout doesn't break at different panel sizes
4. Confirm button height changes don't affect layout or user experience

## Design Decisions

### Gauge Design
- **Horizontal rectangular** shape for better space efficiency in vertical control panel
- **Solid fill** rather than segments for smooth visual feedback
- **Height**: ~20-30px to be visible but not dominate the UI
- **Rounded corners** to match existing button/panel styling
- **Border** to define gauge boundaries clearly

### Color Coding Rationale
- Thresholds chosen based on realistic gameplay costs
- $50M allows ~10-25 satellite launches or 1-5 DRV launches
- $20M allows ~4-10 satellite launches, creates urgency
- Below $20M is critical as options become very limited

### Button Height Standardization
- Set min-height to accommodate largest content (Random with discount text)
- Use flexbox column layout inside buttons to maintain vertical centering
- Preserve all existing functionality and visual states
