# Technical Specification: Modify Game Over Modal

## Task Overview
Redesign the Game Over Modal to use a two-column layout with increased screen width to accommodate the new Feedback content without making the modal too tall.

## Complexity Assessment
**Medium** - This task involves:
- UI restructuring with multiple content sections
- Responsive design considerations
- Proper visual hierarchy and spacing
- Testing across different viewport sizes

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **State Management**: Redux Toolkit

### Current Implementation
- **File**: `kessler-game/src/components/GameOver/GameOverModal.tsx`
- **Current Width**: `max-w-2xl` (672px)
- **Layout**: Single column vertical layout
- **Overflow**: Uses `overflow-y-auto` on container

### Content Sections
1. **Header**: Game Over title and reason
2. **Score Card**: Final score with grade and breakdown
3. **Statistics**: Final game statistics (turns, budget, debris, satellites)
4. **Feedback Form**: New section with 4 questions (causing height issue)
5. **Certificate Button**: Download certificate CTA
6. **Action Buttons**: View Analytics and Play Again

## Implementation Approach

### Layout Restructuring

#### New Container Width
- Change from `max-w-2xl` (672px) to `max-w-6xl` (1152px)
- Maintain responsive padding and spacing

#### Two-Column Grid Layout
Use Tailwind's grid system to create a responsive two-column layout:
- **Left Column**: Game performance data
  - Final Score card with breakdown
  - Final Statistics
  - Certificate download button
  
- **Right Column**: User interaction elements
  - Feedback form (entire section)
  
- **Full Width Sections**:
  - Game Over header (top)
  - Action buttons (bottom)

#### Responsive Behavior
- **Desktop (lg+)**: Two-column layout with grid
- **Tablet/Mobile**: Stack vertically (single column)

### Visual Design Considerations
- Maintain consistent spacing between sections
- Ensure both columns have similar visual weight
- Keep existing color scheme and styling
- Preserve all functionality and interactions

## Files to Modify

### Primary Changes
1. **`kessler-game/src/components/GameOver/GameOverModal.tsx`**
   - Update container max-width from `max-w-2xl` to `max-w-6xl`
   - Restructure content sections into grid layout
   - Add responsive grid classes for two-column layout
   - Reorganize component sections into left/right columns
   - Move action buttons to full-width bottom section

## Data Model / API Changes
None required - this is purely a UI/layout change.

## Verification Approach

### Manual Testing
1. **Visual Testing**:
   - Launch the game and complete a game session
   - Verify modal appears correctly on game over
   - Check both columns are properly aligned
   - Test feedback form interaction
   - Verify certificate download works
   - Test Play Again and View Analytics buttons

2. **Responsive Testing**:
   - Test on desktop viewport (1920px, 1440px, 1280px)
   - Test on tablet viewport (768px)
   - Test on mobile viewport (375px, 414px)
   - Verify graceful stacking on smaller screens

3. **Content Overflow**:
   - Verify no content is cut off
   - Check that modal height is reasonable
   - Ensure scroll behavior works if needed

### Automated Testing
- Run existing linter: `npm run lint`
- Run type checking: `npm run build` (includes tsc -b)

## Implementation Steps

1. Update modal container width and add grid layout
2. Restructure header section to span full width
3. Create left column with score and statistics
4. Create right column with feedback form
5. Ensure action buttons span full width at bottom
6. Test responsive behavior
7. Verify all interactions still work
8. Run linter and type checker

## Risks and Considerations

### Design Balance
- Need to ensure visual hierarchy remains clear
- Both columns should feel balanced in content weight
- May need to adjust spacing to prevent one column looking empty

### Responsive Breakpoints
- Need to determine best breakpoint for column stacking
- Likely use `lg:` breakpoint (1024px) for two-column layout

### User Experience
- Modal should not feel too wide on ultra-wide monitors
- Content should remain centered and readable
- Maintain accessibility for all interactive elements
