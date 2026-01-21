# Technical Specification: Game Visual Redesign

## Difficulty Assessment
**Medium** - This task requires systematic updates across many components, careful CSS/Tailwind configuration, and design consistency. While not architecturally complex, it requires attention to detail and comprehensive testing.

---

## Technical Context

### Stack
- **Framework**: React 19.2.0 with TypeScript
- **Styling**: Tailwind CSS v4.1.18
- **Build Tool**: Vite 7.2.4
- **Animation**: Framer Motion 12.23.26

### Current Design System
The application currently uses a typical "Claude-generated" aesthetic:
- **Colors**: Slate backgrounds (slate-900/800/700), blue-purple gradient accents
- **Shapes**: Rounded corners everywhere (rounded-lg, rounded-xl)
- **Buttons**: Gradient backgrounds (blue-600 to purple-600), rounded-xl
- **Typography**: Calibri font family, gradient text effects for headings
- **Common patterns**: Heavy use of rounded corners, blue-purple color scheme, soft shadows

---

## Implementation Approach

### Design Philosophy
Create a distinctive, technical/industrial aesthetic that:
1. Uses **square/minimal borders** (0-2px border-radius max)
2. Adopts a **different techy color palette** (cyber-tech theme)
3. Maintains readability and usability
4. Prepares for white-labeling via CSS variables

### Proposed Color Scheme: Cyber-Tech
Replace blue-purple with a cyber-tech palette:

**Primary Colors:**
- **Accent**: Cyan (#00d9ff, #00b8d4) - primary interactive elements
- **Secondary**: Electric Green (#00ff88, #00cc6a) - success states, highlights
- **Warning**: Neon Orange (#ff6b35, #ff4500) - alerts, danger states

**Backgrounds:**
- **Dark Base**: Near-black (#0a0e1a, #151922) - darker than slate-900
- **Surface**: Dark blue-gray (#1a1f2e, #252b3d) - card backgrounds
- **Elevated**: Slightly lighter (#2d3548, #363d52) - hover states

**Borders & Accents:**
- **Primary Border**: Cyan-tinted gray (#1e3a52, #2a4a62)
- **Highlight Border**: Bright cyan (#00d9ff)
- **Muted**: Dark gray (#3a4556)

### Shape System
- **Buttons**: Remove all rounded corners → `rounded-none` or `rounded-sm` (2px max)
- **Cards/Panels**: Square corners → `rounded-none` or minimal `rounded-sm`
- **Inputs**: Square → `rounded-none`
- **Badges/Tags**: Can keep slight rounding (2-4px) for differentiation

### Typography
- Keep Calibri but add more technical alternatives
- Replace gradient text with solid colors or subtle glows
- Add more weight variation for hierarchy

---

## Files to Modify

### Configuration Files
1. **`kessler-game/tailwind.config.js`**
   - Extend theme with custom color palette
   - Override default border radius values
   - Add custom utilities for the new design system

2. **`kessler-game/src/index.css`**
   - Add CSS custom properties for theming (white-label foundation)
   - Define global color variables
   - Update base styles to use new variables
   - Add utility classes for the new design

### Component Files (Systematic Updates)
The following component categories need updates:

**High Priority (Visual Impact):**
- `src/components/Setup/GameSetupScreen.tsx` - Main entry point
- `src/components/ui/Tabs.tsx` - Core navigation UI
- `src/components/ControlPanel/*.tsx` - Primary interaction area
- `src/components/GameBoard/*.tsx` - Visual focal point
- `src/App.tsx` - Main layout and structure

**Medium Priority:**
- `src/components/TimeControl/*.tsx` - Control buttons
- `src/components/MissionPanel/*.tsx` - Cards and panels
- `src/components/EventLog/*.tsx` - List components
- `src/components/Charts/*.tsx` - Data visualization
- `src/components/StatsPanel/*.tsx` - Information displays

**Lower Priority:**
- `src/components/Configuration/*.tsx` - Settings screens
- `src/components/Tutorial/*.tsx` - Tutorial modals
- `src/components/GameOver/*.tsx` - End game screens
- `src/components/Certificate/*.tsx` - Certificate display

### Strategy for Updates

**Phase 1: Foundation**
1. Update `tailwind.config.js` with new theme
2. Update `index.css` with CSS variables
3. Create design tokens document (reference)

**Phase 2: Core UI Components**
1. Update base button styles
2. Update card/panel containers
3. Update form inputs
4. Update tabs component

**Phase 3: Systematic Component Updates**
Use find-replace patterns to update:
- `rounded-xl` → `rounded-none`
- `rounded-lg` → `rounded-none`
- `bg-blue-600` → `bg-cyan-600`
- `bg-purple-600` → `bg-green-500`
- `from-blue-400 to-purple-400` → solid colors or new gradient
- `border-slate-*` → `border-gray-*` with custom values
- Remove gradient text effects or replace with solid + glow

**Phase 4: Polish & Refinement**
1. Update shadows for square aesthetic
2. Adjust hover states
3. Fine-tune spacing and typography
4. Test visual consistency

---

## Data Model Changes
**None** - This is purely a visual/styling update. No changes to game logic, state management, or data structures.

---

## API/Interface Changes
**None** - Component interfaces remain unchanged. This is a CSS/styling-only modification.

---

## Verification Approach

### Manual Verification
1. **Visual inspection of all screens:**
   - Game setup screen
   - Main game board (all tabs)
   - Configuration panels
   - Game over modal
   - Tutorial screens

2. **Check consistency:**
   - All buttons should be square
   - Color palette should be consistent (no stray blue-purple)
   - No rounded corners on primary UI elements
   - Typography hierarchy clear and readable

3. **Interaction testing:**
   - Hover states work correctly
   - Active states are visible
   - Focus states for accessibility
   - Animations still work with new styles

### Automated Verification
1. **Lint check**: `npm run lint`
2. **Type check**: `tsc -b`
3. **Build verification**: `npm run build`
4. **Test suite**: `npm run test` (ensure no component tests break)

### Browser Testing
- Test in Chrome/Firefox/Safari
- Verify visual consistency across browsers
- Check responsive behavior

---

## White-Label Foundation

To enable easy white-labeling later, we'll use CSS custom properties in `index.css`:

```css
:root {
  /* Brand colors - easy to override */
  --color-primary: #00d9ff;
  --color-primary-dark: #00b8d4;
  --color-secondary: #00ff88;
  --color-secondary-dark: #00cc6a;
  --color-accent: #ff6b35;
  
  /* Background layers */
  --color-bg-base: #0a0e1a;
  --color-bg-surface: #1a1f2e;
  --color-bg-elevated: #2d3548;
  
  /* Borders */
  --color-border-default: #1e3a52;
  --color-border-highlight: var(--color-primary);
  
  /* Text */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
}
```

Companies can override these variables to apply their brand colors without modifying component code.

---

## Risk Mitigation

### Potential Issues
1. **Visual regressions**: Square corners might affect component sizing
   - *Mitigation*: Test each component after changes, adjust spacing as needed

2. **Accessibility**: New color palette must maintain contrast ratios
   - *Mitigation*: Verify WCAG AA compliance for text on backgrounds

3. **Animation compatibility**: Framer Motion animations might need adjustment
   - *Mitigation*: Test all animated components (launch animations, collisions, etc.)

4. **Gradient removal**: Some visual hierarchy might be lost
   - *Mitigation*: Use shadows, borders, and color variations for depth

### Rollback Plan
- Changes are isolated to styling only
- Git commit after each major phase for easy rollback
- No data or logic changes means minimal risk

---

## Success Criteria

✅ **Visual distinctiveness**: Game no longer looks like typical Claude-generated React app  
✅ **Square aesthetic**: All primary UI elements have square/minimal corners  
✅ **New color scheme**: Cyan/green cyber-tech palette consistently applied  
✅ **No broken functionality**: All game features work as before  
✅ **Build success**: `npm run build` completes without errors  
✅ **Tests pass**: `npm run test` shows no regressions  
✅ **White-label ready**: CSS variables in place for easy customization  

---

## Estimated Effort
- Configuration & setup: 30 minutes
- Core component updates: 2-3 hours
- Systematic updates across all components: 2-3 hours
- Testing & refinement: 1-2 hours
- **Total**: 5-8 hours of focused work
