# Technical Specification: 3D Look for Orbit Visualization

## Task Difficulty
**Easy** - Straightforward CSS styling changes using Tailwind utility classes and inline styles.

## Technical Context
- **Language**: TypeScript/React
- **Styling**: Tailwind CSS v3.x
- **Component**: `OrbitVisualization.tsx` (main visualization frame)
- **Related Components**: 
  - Counter components (DaysCounter, SatellitesCounter, etc.)
  - GameSpeedControl buttons
  - ControlPanel buttons

## Current State Analysis

### Orbit Visualization Frame (Line 219)
```tsx
<div className={`relative w-[1000px] h-[1000px] flex items-center justify-center bg-slate-900 border-[3px] ${getBorderColorClass(riskLevel)} rounded-xl overflow-hidden`}>
```
- Current border: `border-[3px]` with dynamic color based on risk level
- Border radius: `rounded-xl` (0.75rem)
- No 3D effects currently applied

### Counter Boxes (Example: DaysCounter Line 7)
```tsx
<div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 w-[180px] min-h-[80px]">
```
- Simple flat design with single border
- No 3D effects

### Buttons (Example: GameSpeedControl Lines 48-61)
```tsx
<button className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
  speed === value
    ? 'bg-blue-600 text-white shadow-lg'
    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
}`}>
```
- Flat design with basic hover states
- Active state has `shadow-lg` but no 3D appearance

## Implementation Approach

### 1. Orbit Visualization Frame - 3D Inset Look
**Goal**: Make the frame thicker and add a 3D inset (recessed) appearance

**Changes**:
- Increase border thickness from `border-[3px]` to `border-[6px]` or `border-[8px]`
- Add inset shadow using `box-shadow` to create depth
- Apply inner shadow to make frame appear recessed into the page
- Maintain dynamic border color based on risk level

**CSS Technique**:
- Use inline `style` prop for custom `box-shadow` combining:
  - Inner shadow (inset) for recessed effect
  - Multiple shadow layers for depth
- Example: `box-shadow: inset 0 4px 8px rgba(0,0,0,0.4), inset 0 -4px 8px rgba(255,255,255,0.1)`

### 2. Buttons - 3D Raised Look
**Goal**: Make buttons appear raised/embossed with tactile 3D appearance

**Changes Required in Multiple Files**:
- `GameSpeedControl.tsx` - Speed control buttons (Pause, Play, Fast, Reset, New Game)
- `ControlPanel.tsx` - Launch type buttons, orbit buttons, purpose selectors, insurance buttons, main launch button
- `SatellitePurposeSelector.tsx` - Purpose selection buttons
- Other components with button elements

**CSS Technique**:
- Add outer shadows to simulate elevation
- Use subtle gradient backgrounds for depth
- Apply different states:
  - **Default**: Raised appearance with top highlight and bottom shadow
  - **Hover**: Slightly more elevated
  - **Active/Selected**: Pressed/recessed appearance (inverted shadows)
  - **Disabled**: Flattened appearance

**Shadow Strategy**:
- Default (raised): `box-shadow: 0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
- Hover (more elevated): `box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
- Active (pressed): `box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)`

### 3. Counter Boxes - 3D Look (Optional Enhancement)
**Goal**: Apply subtle 3D effects to counter displays for consistency

**Changes**:
- Add subtle raised effect to counter boxes
- Maintain readability while adding depth

## Files to Modify

### Primary Changes
1. **`kessler-game/src/components/GameBoard/OrbitVisualization.tsx`**
   - Line ~219: Update main visualization frame border and add 3D inset styling

### Secondary Changes (Buttons)
2. **`kessler-game/src/components/TimeControl/GameSpeedControl.tsx`**
   - Lines ~33-47: New Game and Reset buttons
   - Lines ~48-61: Speed control buttons (Pause, Play, Fast)

3. **`kessler-game/src/components/ControlPanel/ControlPanel.tsx`**
   - Lines ~120-136: Launch type selector buttons
   - Lines ~142-156: Orbit layer buttons
   - Lines ~170-182: DRV type buttons
   - Lines ~215-225: Main launch button

4. **`kessler-game/src/components/SatellitePurposeSelector.tsx`**
   - Purpose selection buttons

5. **`kessler-game/src/components/ControlPanel/InsuranceTierSelector.tsx`**
   - Insurance tier buttons

### Tertiary Changes (Counter Boxes - Optional)
6. **`kessler-game/src/components/TimeControl/DaysCounter.tsx`**
7. **`kessler-game/src/components/TimeControl/SatellitesCounter.tsx`**
8. **`kessler-game/src/components/TimeControl/DRVsCounter.tsx`**
9. **`kessler-game/src/components/TimeControl/DebrisRemovedCounter.tsx`**

## Data Model / API Changes
**None** - This is purely a visual/styling change with no logic or state modifications.

## Verification Approach

### Manual Verification
1. **Visual Inspection**:
   - Start the development server: `npm run dev`
   - Verify orbit visualization frame has thicker border and inset appearance
   - Check all buttons have 3D raised appearance
   - Test button hover and active states
   - Verify different risk levels (LOW, MEDIUM, CRITICAL) maintain colored borders with 3D effect

2. **Interaction Testing**:
   - Click buttons to ensure 3D pressed effect works
   - Hover over buttons to see elevation change
   - Verify disabled buttons appear flattened
   - Test across different game states (paused, playing, fast)

3. **Accessibility**:
   - Ensure sufficient contrast is maintained
   - Verify button states are visually distinct
   - Check that 3D effects don't interfere with readability

### Automated Verification
1. **Build Test**: `npm run build` - Ensure no TypeScript errors
2. **Lint**: `npm run lint` - Ensure code quality standards are met
3. **Type Check**: `npm run typecheck` (if available) - Verify type safety

## Design Considerations

### Color Preservation
- Maintain existing color scheme
- Preserve dynamic border colors based on risk level
- Keep button state colors (blue for active, slate for inactive, etc.)

### Performance
- Use CSS properties that don't trigger layout recalculation
- `box-shadow` is GPU-accelerated and performant
- No negative impact expected

### Accessibility
- Ensure 3D effects enhance, not hinder, usability
- Maintain WCAG contrast ratios
- Keep focus states visible

### Browser Compatibility
- `box-shadow` is widely supported
- Tailwind CSS classes are cross-browser compatible
- No special polyfills or fallbacks needed

## Implementation Notes

### Border Thickness Decision
- Recommendation: Use `border-[6px]` for noticeable but not overwhelming thickness
- Alternative: `border-[8px]` for more pronounced framing effect
- Can be adjusted based on visual preference during implementation

### Shadow Intensity
- Start with moderate shadow values
- Adjust opacity and spread based on visual testing
- Maintain consistency across all 3D elements

### Transition Effects
- Add smooth transitions for hover/active states
- Use `transition-all duration-200` or similar for professional feel
- Avoid jarring state changes

## Success Criteria
✅ Orbit visualization frame has visibly thicker border (6-8px)  
✅ Frame has clear 3D inset/recessed appearance  
✅ All buttons have 3D raised appearance  
✅ Button hover states show increased elevation  
✅ Button active/pressed states show recessed appearance  
✅ All existing functionality remains intact  
✅ No TypeScript, lint, or build errors  
✅ Visual consistency across all UI elements
