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

### Project Structure
- Main application located in `kessler-game/` subdirectory
- React source files in `kessler-game/src/`
- Existing `kessler-game/src/components/ui/` directory with reusable components

### Available npm Scripts
- `npm run dev` - Development server
- `npm run build` - TypeScript compilation and production build
- `npm run lint` - ESLint code quality checks

### Current Architecture
- Single-page application with conditional rendering (setup screen vs game screen)
- Setup screen shown when `gameStarted = false` (`kessler-game/src/App.tsx:19-20`)
- Game view shown when `gameStarted = true` with all gameplay components
- Components organized by feature (Setup, ControlPanel, Charts, GameBoard, etc.)
- Tailwind CSS for styling with some inline styles in `App.tsx:37, 42`
- Already uses rounded corners (`rounded-lg`) in most components
- Already has button hover states and selected states with color changes

## Requirements Analysis

### 1. Multi-Tab Window
Transform the current single-page game layout into a tabbed interface with **two tabs**:
- **Tab 1: Launch** - Orbital visualization, control panel, stats, and game speed controls
- **Tab 2: Analytics** - Three charts showing debris count, satellite count, and debris removal over time

**Important:** The Setup screen remains as a pre-game screen (shown before `gameStarted = true`). It is NOT a tab in the game interface.

### 2. Rounded Corners
Ensure all content boxes use consistent rounded corners:
- Already implemented in most components using Tailwind's `rounded-lg` (8px)
- `OrbitVisualization.tsx:13` already uses `borderRadius: '8px'` (equivalent to `rounded-lg`)
- Need to verify consistency across all components
- Update any remaining inline border styles to use Tailwind classes

### 3. Helvetica Font
Apply Helvetica font family across the application:
- Add font configuration to Tailwind config with proper fallback chain
- Fallback: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`
- Apply to body element via Tailwind utilities in `index.css`

### 4. Button Styling
Ensure all buttons have:
- Rounded corners (already implemented with `rounded-lg`)
- Selected state color changes (already implemented in most places)
- Consistent styling across all buttons

## Implementation Approach

### 1. Create Tab Component
Create a new reusable tab component in the existing `ui/` directory (`kessler-game/src/components/ui/Tabs.tsx`) that handles:
- Tab header navigation with clean, rounded design
- Active tab state management (local useState)
- Tab content rendering (conditional rendering for performance optimization)
- Styling consistent with the app's design language
- TypeScript interfaces for type safety

### 2. Restructure App.tsx
Modify `kessler-game/src/App.tsx` to:
- Integrate the Tabs component after game starts (`gameStarted = true`)
- Add tab state management (useState for active tab)
- Distribute components across **two tabs**:
  - **Launch Tab**: `OrbitVisualization`, `ControlPanel`, `StatsPanel`, `GameSpeedControl`
  - **Analytics Tab**: `DebrisChart`, `SatelliteChart`, `DebrisRemovalChart`
- Keep `GameSetupScreen` as pre-game screen (unchanged behavior)
- Convert inline styles (`App.tsx:37, 42`) to Tailwind classes
- Maintain game state and Redux integration

### 3. Update Font Configuration
- Modify `kessler-game/tailwind.config.js` to add Helvetica font family to `theme.extend.fontFamily`
- Include fallback chain: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`
- Update `kessler-game/src/index.css` to apply the font using Tailwind's font utility class

### 4. Audit and Update Styling
- Convert inline styles in `App.tsx:37, 42` to Tailwind classes
- Verify `OrbitVisualization.tsx:13` rounded corners (currently `borderRadius: '8px'` is consistent)
- Verify `ControlPanel.tsx:58` rounded corners (already using inline `borderRadius: '8px'`)
- Ensure all containers use consistent `rounded-lg` class
- Verify button styling consistency across all components

## Source Code Changes

### New Files
- `kessler-game/src/components/ui/Tabs.tsx` - Reusable tab component with TypeScript interfaces

### Modified Files
1. **kessler-game/src/App.tsx**
   - Add tab state management (`useState` for active tab)
   - Integrate Tabs component in game view
   - Reorganize component layout into two tab panels (Launch, Analytics)
   - Convert inline styles at lines 37, 42 to Tailwind classes
   - Keep setup screen as initial view (no changes to setup flow)

2. **kessler-game/tailwind.config.js**
   - Add Helvetica font to `theme.extend.fontFamily`
   - Font stack: `['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']`

3. **kessler-game/src/index.css**
   - Update body to use Helvetica font via Tailwind's font utility

4. **Optional optimizations** (if time permits):
   - `kessler-game/src/components/ControlPanel/ControlPanel.tsx:58` - Convert inline border style to Tailwind
   - `kessler-game/src/components/GameBoard/OrbitVisualization.tsx:13` - Convert inline border to Tailwind (already consistent at 8px)

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
   - Verify two tabs (Launch, Analytics) render correctly after game starts
   - Click between Launch and Analytics tabs
   - Confirm active tab highlighting works
   - Ensure tab content switches correctly
   - Verify setup screen still appears before game starts (unchanged)

2. **Font Application**
   - Inspect browser DevTools to verify Helvetica is applied
   - Check computed font-family in Elements panel
   - Verify text renders with clean, professional appearance

3. **Rounded Corners**
   - Visually inspect all content boxes for consistent 8px border-radius
   - Verify OrbitVisualization, ControlPanel, Charts all use rounded corners
   - Check tab component itself has rounded corners

4. **Button States**
   - Test button hover states (color transitions)
   - Verify selected button color changes (blue-600 active state)
   - Check disabled button states (greyed out with cursor-not-allowed)

### Build & Lint Testing
All commands run from `kessler-game/` directory:
1. `npm run build` - Ensure TypeScript compilation succeeds with no errors
2. `npm run lint` - Verify ESLint passes with no warnings
3. `npm run dev` - Test in development mode with hot reload

### Functional Testing
1. **Pre-game Flow**
   - Verify setup screen appears on initial load
   - Configure game difficulty
   - Click "Start Game" button
   - Confirm transition to tabbed game interface

2. **Launch Tab**
   - Launch satellites from different orbits (LEO, MEO, GEO)
   - Launch DRVs with different configurations
   - Verify orbital visualization updates in real-time
   - Check stats panel shows current counts
   - Test game speed controls (pause, 1x, 2x, 5x)

3. **Analytics Tab**
   - Switch to Analytics tab
   - Verify all three charts render (Debris, Satellite, Debris Removal)
   - Confirm charts show historical data from gameplay
   - Check chart tooltips and interactivity

4. **State Persistence**
   - Navigate between tabs multiple times
   - Verify game state persists (satellites, debris, budget)
   - Ensure charts in Analytics tab reflect actions from Launch tab

## Design Considerations

### Tab Persistence
- Active tab state is local component state (not persisted to Redux)
- Default to "Launch" tab on game start
- Tab selection persists during gameplay
- Tab state resets when returning to setup screen (new game)

### Responsive Design
- Tabs optimized for desktop viewport (800px+ width)
- Mobile responsiveness can be addressed in future iterations
- Minimum viable width: 1024px for comfortable viewing

### Performance
- **Conditional rendering** used for tab content (only active tab rendered to DOM)
- Improves performance compared to CSS hiding (especially for OrbitVisualization and Charts)
- Reduces memory footprint during gameplay
- Game state maintained in Redux regardless of active tab

## Risk Assessment
**Low Risk** - Changes are primarily presentational and don't affect game logic or state management. Existing components can be reused with minimal modifications.
