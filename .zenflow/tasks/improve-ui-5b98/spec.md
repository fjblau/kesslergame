# Technical Specification: UI Improvements

## Task Complexity
**Medium** - Requires restructuring the main application layout to support tabs, updating styling consistently across components, and adding custom font configuration.

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **State Management**: Redux Toolkit 2.11.2
- **Charts**: Recharts 3.6.0

### Current Architecture
- Single-page application with conditional rendering (setup screen vs game screen)
- Components organized by feature (Setup, ControlPanel, Charts, GameBoard, etc.)
- Tailwind CSS for styling with some inline styles
- Already uses rounded corners (`rounded-lg`) in many components
- Already has button hover states and selected states with color changes

## Requirements Analysis

### 1. Multi-Tab Window
Transform the current single-page game layout into a tabbed interface with three tabs:
- **Tab 1: Setup** - Game configuration and difficulty settings
- **Tab 2: Orbital Visualization/Launch** - Orbital visualization, control panel, and stats
- **Tab 3: Analytics/Charts** - Three charts showing debris count, satellite count, and debris removal over time

### 2. Rounded Corners
Ensure all content boxes use consistent rounded corners:
- Already implemented in most components using Tailwind's `rounded-lg`
- Need to verify consistency across all components
- Update any remaining rectangular borders to use `rounded-lg` or `rounded-xl`

### 3. Calibri Font
Apply Calibri font family across the application:
- Add font configuration to Tailwind config
- Add fallback fonts (system fonts) for compatibility
- Apply to body element in index.css

### 4. Button Styling
Ensure all buttons have:
- Rounded corners (already implemented with `rounded-lg`)
- Selected state color changes (already implemented in most places)
- Consistent styling across all buttons

## Implementation Approach

### 1. Create Tab Component
Create a new reusable tab component (`src/components/ui/Tabs.tsx`) that handles:
- Tab header navigation
- Active tab state
- Tab content rendering
- Styling consistent with the app's design language

### 2. Restructure App.tsx
Modify `src/components/App.tsx` to:
- Integrate the tab component
- Reorganize the layout to show tabs after game start
- Distribute components across three tabs:
  - **Setup Tab**: `GameSetupScreen` and `BudgetDifficultySettings`
  - **Launch Tab**: `OrbitVisualization`, `ControlPanel`, `StatsPanel`, `GameSpeedControl`
  - **Analytics Tab**: `DebrisChart`, `SatelliteChart`, `DebrisRemovalChart`
- Maintain game state and Redux integration

### 3. Update Font Configuration
- Modify `tailwind.config.js` to add Calibri font family
- Update `src/index.css` to apply the font to the body element
- Add web-safe fallbacks

### 4. Audit and Update Styling
- Review all components for consistent rounded corners
- Ensure all containers use `rounded-lg` or `rounded-xl`
- Verify button styling consistency
- Update any inline styles to use Tailwind classes where possible

## Source Code Changes

### New Files
- `src/components/ui/Tabs.tsx` - Reusable tab component with TypeScript interfaces

### Modified Files
1. **src/App.tsx**
   - Add tab state management
   - Integrate Tabs component
   - Reorganize component layout into three tab panels
   - Keep setup screen as initial view, show tabs after game starts

2. **tailwind.config.js**
   - Add Calibri font to theme.extend.fontFamily
   - Include system font fallbacks

3. **src/index.css**
   - Update body font-family to use Calibri from Tailwind config

4. **Component styling audits** (if needed):
   - `src/components/GameBoard/OrbitVisualization.tsx` - Convert inline styles to use consistent border-radius
   - `src/components/ControlPanel/ControlPanel.tsx` - Verify rounded corners
   - Any other components with inconsistent styling

## Data Model Changes
No changes to the Redux store or game state are required. All changes are UI/presentation layer only.

## API/Interface Changes

### New TypeScript Interfaces
```typescript
// In Tabs.tsx
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}
```

## Verification Approach

### Visual Testing
1. **Tab Navigation**
   - Verify tabs render correctly
   - Click through all three tabs
   - Confirm active tab highlighting works
   - Ensure tab content switches correctly

2. **Font Application**
   - Inspect browser DevTools to verify Calibri is applied
   - Check fallback font behavior if Calibri unavailable

3. **Rounded Corners**
   - Visually inspect all content boxes
   - Verify consistent border-radius across components

4. **Button States**
   - Test button hover states
   - Verify selected button color changes
   - Check disabled button states

### Build & Lint Testing
1. Run `npm run build` to ensure TypeScript compilation succeeds
2. Run `npm run lint` to verify code quality
3. Test in development mode with `npm run dev`

### Functional Testing
1. Start game from setup screen
2. Navigate between tabs without losing game state
3. Launch satellites and DRVs from Launch tab
4. Verify charts update in Analytics tab
5. Ensure game speed controls work across tabs

## Design Considerations

### Tab Persistence
- Active tab state will be local component state (not persisted to Redux)
- Tab state resets when returning to setup screen (new game)

### Responsive Design
- Tabs will work on desktop viewport (800px+)
- Mobile responsiveness can be addressed in future iterations

### Performance
- All tab content will be rendered but hidden using CSS
- No performance impact expected given small component tree

## Risk Assessment
**Low Risk** - Changes are primarily presentational and don't affect game logic or state management. Existing components can be reused with minimal modifications.
