# Technical Specification: Task 14.5 - Adjust Total Score Frame

## Task Complexity
**Easy** - Straightforward UI repositioning with minimal logic changes.

## Technical Context
- **Language**: TypeScript/React
- **Framework**: React with Redux for state management
- **Styling**: Tailwind CSS
- **Dependencies**: Existing React components and Redux selectors

## Current Architecture

### Current Score Display Location
The `ScoreDisplay` component is currently rendered in `StatsPanel.tsx` at line 94, positioned below the Risk Level and above the Step counter in the Orbital Status panel.

**Current structure (StatsPanel.tsx:94)**:
```tsx
<ScoreDisplay />
```

### Current Title Frame Location
The title frame is in `App.tsx` at lines 94-98, centered in a header element:
```tsx
<header className="text-center mb-8">
  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
    Space Debris Removal
  </h1>
</header>
```

## Implementation Approach

### 1. Modify App.tsx Header
- Import `ScoreDisplay` component
- Change header layout from centered to flex with space-between
- Position title on the left
- Position ScoreDisplay on the right (flush right)
- Ensure proper vertical alignment

### 2. Remove ScoreDisplay from StatsPanel
- Remove the `<ScoreDisplay />` component from StatsPanel.tsx (line 94)
- Remove the import statement for ScoreDisplay (line 3)
- Adjust spacing/layout if needed after removal

### 3. Adjust ScoreDisplay Styling (if needed)
- Review `ScoreDisplay.tsx` to ensure it looks appropriate in the header context
- May need to adjust sizing or padding to fit better in the title frame

## Files to Modify

1. **kessler-game/src/App.tsx**
   - Add import for `ScoreDisplay` component
   - Modify header section (lines 94-98) to use flex layout
   - Add ScoreDisplay component aligned to the right

2. **kessler-game/src/components/StatsPanel/StatsPanel.tsx**
   - Remove ScoreDisplay import (line 3)
   - Remove `<ScoreDisplay />` component (line 94)

3. **kessler-game/src/components/Score/ScoreDisplay.tsx** (optional)
   - May need minor styling adjustments to fit header context
   - Review after implementation to ensure it looks good

## Data Model / API / Interface Changes
**None required** - This is purely a UI repositioning task with no changes to data structures, APIs, or interfaces.

## Verification Approach

1. **Visual Verification**
   - Run the development server: `npm run dev`
   - Verify the Total Score appears in the header next to "Space Debris Removal" title
   - Verify it's flush right
   - Verify it's properly aligned vertically with the title
   - Verify the score breakdown modal still works when clicking on the score
   - Verify the StatsPanel no longer shows the Total Score

2. **Functional Testing**
   - Click on the Total Score in the header to ensure the breakdown modal opens
   - Verify all score categories display correctly in the modal
   - Verify the score updates correctly as game progresses

3. **Build & Lint**
   - Run type checking: `npm run typecheck` (if available)
   - Run linting: `npm run lint` (if available)
   - Ensure no errors or warnings

## Implementation Notes
- The header is already inside a `max-w-[2350px]` container, so the flush right alignment will be relative to that container
- Need to ensure proper responsiveness on different screen sizes
- The ScoreDisplay component has interactive elements (click to view breakdown), so ensure accessibility is maintained
