# Technical Specification: Orbit Visualization Canvas

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Canvas-based 2D rendering requires careful coordinate mapping
- Multiple sprite components with different visual representations
- State synchronization with Redux store
- Responsive layout and positioning calculations
- Moderate complexity with clear requirements and reference wireframe
- No complex algorithms beyond coordinate transformations

---

## Technical Context

### Language & Framework
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4

### Existing Dependencies (No New Additions Required)
All required dependencies are already in `package.json`:
- react, react-dom, react-redux
- @reduxjs/toolkit
- typescript
- tailwindcss

### Reference Materials
- **Wireframe**: `/wireframes/orbit-visualization.html`
- **Data Types**: `src/game/types.ts`
- **Constants**: `src/game/constants.ts`
- **Redux State**: `src/store/slices/gameSlice.ts`

---

## Implementation Approach

### Architecture Pattern

**Component Hierarchy**:
```
OrbitVisualization (Container)
├── Canvas rendering layer (LEO/MEO/GEO orbits + Earth)
├── SatelliteSprite[] (positioned absolutely)
├── DebrisParticle[] (positioned absolutely)
└── DRVSprite[] (positioned absolutely)
```

### Rendering Strategy

**Hybrid Approach**: CSS-based positioning with SVG/Emoji sprites
- **Orbits & Earth**: CSS divs with border-radius (concentric circles)
- **Sprites**: Absolutely positioned React components
- **Coordinates**: Transform game state (x, y, layer) to pixel positions

**Why Not Canvas API?**:
- React components offer better state management
- Easier to add hover effects and interactions later
- Simpler animations with CSS transitions
- Reference wireframe uses CSS approach

### Coordinate System

**Game State Coordinates**:
- `x`: 0-100 (angular position in degrees mapped to 0-100)
- `y`: Layer-specific altitude (LEO: 0-50, MEO: 50-100, GEO: 100-150)
- `layer`: 'LEO' | 'MEO' | 'GEO'

**Visual Mapping**:
```typescript
// Center point: (300, 300) for 600x600 canvas
// LEO radius: 100px (200px diameter)
// MEO radius: 175px (350px diameter)
// GEO radius: 250px (500px diameter)

const ORBIT_RADII = {
  LEO: { inner: 40, outer: 100 },
  MEO: { inner: 100, outer: 175 },
  GEO: { inner: 175, outer: 250 },
};

function mapToPixels(entity: { x: number; y: number; layer: OrbitLayer }) {
  const centerX = 300;
  const centerY = 300;
  const { inner, outer } = ORBIT_RADII[entity.layer];
  
  // Map y (altitude) to radius
  const [yMin, yMax] = LAYER_BOUNDS[entity.layer];
  const normalizedY = (entity.y - yMin) / (yMax - yMin);
  const radius = inner + normalizedY * (outer - inner);
  
  // Map x (position) to angle
  const angle = (entity.x / 100) * 2 * Math.PI;
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
```

### Visual Design (From Wireframe)

**Color Scheme**:
- Background: `#0a0a1a` (dark space)
- Earth: Blue gradient with glow
- Orbit rings: `rgba(83, 168, 255, 0.3)` (semi-transparent blue)
- Orbit labels: `#53a8ff` (light blue)

**Sprites**:
- **Satellites**: Blue circle `⬤` (#60a5fa) - 20px font size
- **DRVs**: Pentagon `⬟` (cooperative: #34d399 green, uncooperative: #fb923c orange) - 20px
- **Debris**: Dots `•` or `••` (cooperative: #9ca3af gray, uncooperative: #ef4444 red) - 12px

**Earth**:
- 80px diameter circle
- Emoji: 🌍
- Box shadow for glow effect

---

## Source Code Structure

### New Files to Create

```
kessler-game/src/components/GameBoard/
├── OrbitVisualization.tsx      # Main container (600x600px)
├── SatelliteSprite.tsx          # Satellite rendering with purpose icon
├── DebrisParticle.tsx           # Debris dots (cooperative/uncooperative)
└── DRVSprite.tsx                # DRV pentagon shapes
```

### File-by-File Breakdown

#### 1. `OrbitVisualization.tsx`
**Purpose**: Main visualization container
**Responsibilities**:
- Connect to Redux store (satellites, debris, DRVs)
- Render 3 concentric orbit circles with labels
- Render Earth in center
- Map all entities to pixel coordinates
- Render sprite components at calculated positions

**Key Implementation**:
```typescript
export function OrbitVisualization() {
  const satellites = useAppSelector(state => state.game.satellites);
  const debris = useAppSelector(state => state.game.debris);
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  
  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center">
      {/* GEO orbit */}
      <div className="absolute w-[500px] h-[500px] border-2 border-blue-400/30 rounded-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 
                        text-xs font-semibold text-blue-400 bg-slate-950/80 px-2 py-1 rounded">
          GEO
        </div>
      </div>
      
      {/* MEO orbit */}
      <div className="absolute w-[350px] h-[350px] border-2 border-blue-400/30 rounded-full">
        {/* Label */}
      </div>
      
      {/* LEO orbit */}
      <div className="absolute w-[200px] h-[200px] border-2 border-blue-400/30 rounded-full">
        {/* Label */}
      </div>
      
      {/* Earth */}
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800
                      flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">
        🌍
      </div>
      
      {/* Satellites */}
      {satellites.map(sat => {
        const pos = mapToPixels(sat);
        return <SatelliteSprite key={sat.id} satellite={sat} x={pos.x} y={pos.y} />;
      })}
      
      {/* Debris */}
      {debris.map(d => {
        const pos = mapToPixels(d);
        return <DebrisParticle key={d.id} debris={d} x={pos.x} y={pos.y} />;
      })}
      
      {/* DRVs */}
      {drvs.map(drv => {
        const pos = mapToPixels(drv);
        return <DRVSprite key={drv.id} drv={drv} x={pos.x} y={pos.y} />;
      })}
    </div>
  );
}
```

#### 2. `SatelliteSprite.tsx`
**Purpose**: Render individual satellite
**Props**:
```typescript
interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
}
```
**Visual**: 
- Display purpose icon from `SATELLITE_PURPOSE_CONFIG` (☁️📡🛰️)
- Blue color (#60a5fa)
- Pulse animation (optional)

#### 3. `DebrisParticle.tsx`
**Purpose**: Render debris particles
**Props**:
```typescript
interface DebrisParticleProps {
  debris: Debris;
  x: number;
  y: number;
}
```
**Visual**:
- Cooperative: Gray dots `•` (#9ca3af)
- Uncooperative: Red dots `••` (#ef4444)
- Smaller font size (12px)

#### 4. `DRVSprite.tsx`
**Purpose**: Render debris removal vehicles
**Props**:
```typescript
interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
}
```
**Visual**:
- Pentagon shape: `⬟`
- Cooperative: Green (#34d399)
- Uncooperative: Orange (#fb923c)

---

## Data Model / API / Interface Changes

### No Changes Required
All necessary types already exist in `src/game/types.ts`:
- `Satellite` (with `purpose` field)
- `Debris` (with `type` field)
- `DebrisRemovalVehicle` (with `removalType` field)
- `OrbitLayer`
- `SatelliteType`
- `DebrisType`
- `DRVType`

### Redux State Access
Components will use existing Redux hooks:
```typescript
import { useAppSelector } from '../../store/hooks';

const satellites = useAppSelector(state => state.game.satellites);
const debris = useAppSelector(state => state.game.debris);
const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
```

---

## Integration Points

### App.tsx Integration
The `OrbitVisualization` component should be added to `App.tsx` to replace the placeholder "Game Stats" section:

```typescript
// Replace this section in App.tsx (lines 40-73)
<div className="lg:col-span-2">
  <OrbitVisualization />
</div>
```

---

## Verification Approach

### Manual Testing
1. **Visual Verification**:
   - Compare with wireframe (`wireframes/orbit-visualization.html`)
   - Check orbit circles are concentric and properly sized
   - Verify Earth is centered with correct styling
   - Confirm labels are positioned correctly

2. **State Integration**:
   - Launch satellites → should appear in correct orbit
   - Launch DRVs → should appear as pentagons
   - Wait for collisions → debris should appear

3. **Sprite Rendering**:
   - Satellites show correct purpose icons (☁️📡🛰️)
   - Debris shows correct colors (blue/red)
   - DRVs show correct colors (green/orange)

4. **Responsive Behavior**:
   - Components update when state changes
   - No performance issues with 20+ entities

### Linting & Type Checking
```bash
npm run lint
npm run build  # TypeScript type checking via tsc -b
```

### Test Cases (Manual)
- [ ] Empty state: Only orbits and Earth visible
- [ ] 1 satellite in each orbit: Positioned correctly
- [ ] Multiple debris particles: Colors correct
- [ ] DRVs in different orbits: Pentagons visible
- [ ] State updates: React to Redux changes immediately

---

## Performance Considerations

### Expected Load
- Max satellites: ~20
- Max debris: ~100
- Max DRVs: ~10
- **Total entities**: ~130 sprites

### Optimization Strategy
- Use `React.memo` for sprite components (optional, only if needed)
- Absolute positioning (no layout recalculation)
- CSS transforms for smooth animations
- No canvas re-rendering overhead

### Potential Bottlenecks
None expected for this task. React can easily handle 130 components with simple rendering.

---

## Future Enhancements (Out of Scope)

These are NOT part of this task but noted for future reference:
- Animated orbits (rotation)
- Collision animations (flash effect)
- DRV "capture effect" when removing debris
- Click handlers for entity selection
- Zoom/pan controls
- Trail effects for moving objects

---

## Definition of Done

Task is complete when:
- ✅ All 4 component files created
- ✅ OrbitVisualization renders 3 orbits + Earth
- ✅ Satellites render with correct purpose icons
- ✅ Debris renders with correct cooperative/uncooperative colors
- ✅ DRVs render as pentagons with correct colors
- ✅ Components update when Redux state changes
- ✅ No TypeScript errors (`npm run build` passes)
- ✅ No ESLint errors (`npm run lint` passes)
- ✅ Visual appearance matches wireframe reference
