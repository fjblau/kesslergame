# Technical Specification: Add Animation to Orbit Visualization

## Complexity Assessment
**Medium** - This task requires:
- Integration of a new animation library (Framer Motion)
- Multiple animation types with coordinated timing
- State coordination between Redux store and animations
- Handling of dynamic entity creation/removal
- Performance considerations for potentially 100+ animated elements

## Technical Context

### Stack
- **Language**: TypeScript
- **Framework**: React 19.2.0
- **State Management**: Redux Toolkit 2.11.2
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Vite 7.2.4
- **New Dependency**: Framer Motion (to be installed)

### Current Architecture
The OrbitVisualization component (`src/components/GameBoard/OrbitVisualization.tsx`) currently:
- Renders static orbit circles (LEO, MEO, GEO) at fixed radii (140px, 240px, 350px)
- Uses absolute positioning for all sprites
- Reads entity positions from Redux store (x: 0-100, y: layer-specific bounds)
- Maps game coordinates to pixel coordinates via `mapToPixels()` utility
- Renders three sprite types: SatelliteSprite, DebrisParticle, DRVSprite

### Reference Implementation
The wireframe at `wireframes/orbit-visualization-animation.html` demonstrates:
1. **Orbital rotation**: Objects continuously rotate around orbit circles based on layer-specific speeds
2. **Launch animations**: Entities animate from Earth center to target orbit (1.5s, ease-out-cubic)
3. **Collision effects**: Expanding red circle + white flash (0.5s duration)
4. **Solar storm effects**: Yellow overlay with radiating beams (2s duration)
5. **DRV targeting**: Visual tracking lines between DRVs and debris

## Implementation Approach

### Animation Strategy
Use Framer Motion's declarative API to:
1. **Orbital motion**: Continuously rotate entities based on their x-coordinate (0-100 maps to 0-360°)
2. **Launch animations**: Animate opacity and position from Earth center to calculated orbit position
3. **Collision flashes**: Render temporary animation components that scale/fade out
4. **Event-driven triggers**: Listen to Redux events for collision/launch/storm events

### Key Design Decisions

#### 1. Coordinate System Transformation
- **Current**: Game uses cartesian (x, y) where x ∈ [0,100] represents angle, y ∈ layer bounds represents radius
- **Animation**: Convert x to rotation angle (x/100 * 360°), keep radial positioning from mapToPixels
- **Rotation**: Use CSS transform rotate() via Framer Motion's `animate` prop

#### 2. Animation Triggering
- **Orbital rotation**: Use `animate` prop with continuous rotation based on x-coordinate changes
- **Launch events**: Detect new entities by tracking IDs, trigger `initial` + `animate` sequence
- **Collisions**: Subscribe to Redux events, render temporary `<CollisionEffect>` components
- **Solar storms**: Similar event-driven temporary components

#### 3. Performance Optimization
- Use `layoutId` for smooth transitions when entities change layers
- Leverage Framer Motion's hardware acceleration for transforms
- Limit collision effect count with cleanup after animation completes
- Use `React.memo` for sprite components to prevent unnecessary re-renders

## Source Code Structure Changes

### Files to Modify
1. **`kessler-game/package.json`**
   - Add `framer-motion` dependency

2. **`kessler-game/src/components/GameBoard/OrbitVisualization.tsx`**
   - Wrap with AnimatePresence for exit animations
   - Add collision/storm effect state management
   - Subscribe to game events for triggering effects

3. **`kessler-game/src/components/GameBoard/SatelliteSprite.tsx`**
   - Convert div to `motion.div`
   - Add rotation animation based on satellite.x
   - Add launch animation on mount for new satellites
   - Add smooth transitions on position changes

4. **`kessler-game/src/components/GameBoard/DebrisParticle.tsx`**
   - Convert to `motion.div`
   - Add rotation animation
   - Add spawn animation (fade + scale in)

5. **`kessler-game/src/components/GameBoard/DRVSprite.tsx`**
   - Convert to `motion.div`
   - Add rotation animation
   - Add launch animation

### Files to Create
1. **`kessler-game/src/components/GameBoard/CollisionEffect.tsx`**
   - Renders expanding circle with flash
   - Auto-removes after 0.5s animation
   - Props: x, y coordinates

2. **`kessler-game/src/components/GameBoard/LaunchAnimation.tsx`**
   - Overlays on entities during launch
   - Dashed trail from center to target
   - Props: startPos, targetPos, duration, onComplete

3. **`kessler-game/src/components/GameBoard/SolarStormEffect.tsx`**
   - Full-screen yellow overlay with pulsing opacity
   - Radiating beams from center
   - Props: onComplete

## Data Model / API Changes

### Redux Store Additions
No schema changes needed, but will utilize existing events:

```typescript
// From types.ts - EventType already includes:
type EventType = 
  | 'collision'         // Trigger CollisionEffect
  | 'satellite-launch'  // Trigger LaunchAnimation
  | 'drv-launch'        // Trigger LaunchAnimation
  | 'solar-storm'       // Trigger SolarStormEffect
  | ...
```

### New Component Props

```typescript
// CollisionEffect.tsx
interface CollisionEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

// LaunchAnimation.tsx
interface LaunchAnimationProps {
  entityId: string;
  targetLayer: OrbitLayer;
  targetAngle: number;
  onComplete: () => void;
}

// SolarStormEffect.tsx
interface SolarStormEffectProps {
  onComplete: () => void;
}
```

## Animation Specifications

### 1. Orbital Rotation
```typescript
// Rotation speed based on layer (from wireframe constants)
const ORBIT_SPEEDS = {
  LEO: Math.PI / 5,    // ~36°/s at 1fps in wireframe
  MEO: Math.PI / 7.5,  // ~24°/s
  GEO: Math.PI / 10,   // ~18°/s
};

// Framer Motion config
animate={{
  rotate: (entity.x / 100) * 360
}}
transition={{
  duration: 0.5,
  ease: "linear"
}}
```

### 2. Launch Animation
```typescript
initial={{
  x: centerX,
  y: centerY,
  opacity: 0,
  scale: 0.5
}}
animate={{
  x: targetX,
  y: targetY,
  opacity: 1,
  scale: 1
}}
transition={{
  duration: 1.5,
  ease: [0.33, 1, 0.68, 1] // cubic-bezier easeOutCubic
}}
```

### 3. Collision Flash
```typescript
// Expanding circle
animate={{
  scale: [1, 5],
  opacity: [1, 0]
}}
transition={{
  duration: 0.5,
  ease: "easeOut"
}}

// Center flash
animate={{
  opacity: [1, 0],
  scale: [1, 2]
}}
transition={{
  duration: 0.3
}}
```

### 4. Debris Spawn
```typescript
initial={{
  scale: 0,
  opacity: 0
}}
animate={{
  scale: 1,
  opacity: 1
}}
transition={{
  duration: 0.3,
  ease: "easeOut"
}}
```

## Verification Approach

### Manual Testing
1. **Launch satellites** → Verify smooth animation from center to orbit
2. **Wait for orbital rotation** → Verify satellites/debris/DRVs rotate at layer-specific speeds
3. **Trigger collision** → Verify flash effect appears at collision point
4. **Launch DRVs** → Verify launch animation similar to satellites
5. **Spawn debris** → Verify debris appears with scale/fade-in effect
6. **Multi-entity stress test** → Launch 20+ satellites across layers, verify smooth performance
7. **Solar storm event** → Verify full-screen effect (if implemented)

### Build Verification
```bash
cd kessler-game
npm install framer-motion
npm run build  # Verify no TypeScript errors
npm run lint   # Verify code style
```

### Performance Checks
- Monitor frame rate with 50+ entities
- Verify no jank during simultaneous launches/collisions
- Check animation cleanup (no memory leaks from unmounted effects)

## Implementation Risks & Mitigations

### Risk 1: Performance degradation with 100+ entities
**Mitigation**: 
- Use `will-change: transform` CSS hint
- Leverage Framer Motion's `useReducedMotion` hook
- Implement animation quality settings if needed

### Risk 2: Collision events not captured properly
**Mitigation**:
- Hook into Redux middleware or use `useSelector` with custom equality check
- Maintain event queue in component state with useEffect cleanup

### Risk 3: Launch animation timing conflicts with game loop
**Mitigation**:
- Separate animation state from game state
- Use onComplete callbacks to synchronize state updates

### Risk 4: Coordinate system mismatch between game and visual rotation
**Mitigation**:
- Thoroughly test mapToPixels with rotation transform
- Validate that x-coordinate changes produce expected angular movement

## Dependencies
- **New**: `framer-motion` (latest stable, ~40kb gzipped)
- **Existing**: All current dependencies maintained

## Timeline Estimate
- Framer Motion integration: 1 hour
- Sprite rotation animations: 2 hours  
- Launch animations: 2 hours
- Collision effects: 1 hour
- Testing & refinement: 2 hours
- **Total**: ~8 hours
