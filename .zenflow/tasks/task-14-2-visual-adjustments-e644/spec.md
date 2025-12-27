# Technical Specification: Fix Orbit Centering

## Task Difficulty: Easy

This is a straightforward visual alignment fix involving CSS positioning and coordinate system corrections.

## Problem Statement

The satellite and DRV orbits are no longer centered on the Earth icon in the orbit visualization. This is a coordinate system misalignment issue.

## Technical Context

- **Language**: TypeScript/React
- **Framework**: React with Framer Motion for animations
- **UI Library**: Tailwind CSS
- **Key Files**:
  - `kessler-game/src/components/GameBoard/OrbitVisualization.tsx` - Main visualization component
  - `kessler-game/src/components/GameBoard/utils.ts` - Position mapping utilities
  - `kessler-game/src/components/GameBoard/SatelliteSprite.tsx` - Satellite rendering
  - `kessler-game/src/components/GameBoard/DRVSprite.tsx` - DRV rendering

## Root Cause Analysis

The misalignment occurs due to inconsistent center point definitions:

1. **Earth Icon**: The Earth div at `OrbitVisualization.tsx:166` uses `position: 'absolute'` without explicit `top`/`left` positioning, causing it to default to an incorrect position rather than being centered.

2. **Coordinate System**: The `mapToPixels` function at `utils.ts:33-34` uses hardcoded values `centerX = 400` and `centerY = 400`, but the visualization container is `1000px × 1000px`, so the actual center should be at `500px, 500px`.

3. **Launch Animations**: Both `SatelliteSprite.tsx:31-32` and `DRVSprite.tsx:31-32` use the old center coordinates `left: 400, top: 400` for the launch animation starting position.

4. **Orbit Circles**: The orbit circles are correctly centered using `top: '50%', left: '50%', transform: 'translate(-50%, -50%)'`, which is why they appear correctly positioned.

## Implementation Approach

### Changes Required

#### 1. Fix Earth Icon Positioning (`OrbitVisualization.tsx:166`)

Add explicit centering CSS to the Earth div:
```typescript
style={{ 
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '125px', 
  height: '125px', 
  borderRadius: '50%', 
  // ... rest of styles
}}
```

#### 2. Update Center Coordinates (`utils.ts:33-34`)

Change the hardcoded center values from 400 to 500:
```typescript
const centerX = 500;
const centerY = 500;
```

#### 3. Update Launch Animation Start Position (`SatelliteSprite.tsx:31-32`)

Update the initial launch position:
```typescript
initial={isLaunching ? {
  left: 500,
  top: 500,
  // ... rest of initial values
} : false}
```

#### 4. Update Launch Animation Start Position (`DRVSprite.tsx:31-32`)

Update the initial launch position:
```typescript
initial={isLaunching ? {
  left: 500,
  top: 500,
  // ... rest of initial values
} : false}
```

## Source Code Structure Changes

**Files to Modify**:
- `kessler-game/src/components/GameBoard/OrbitVisualization.tsx` - Add Earth centering styles
- `kessler-game/src/components/GameBoard/utils.ts` - Update center coordinates
- `kessler-game/src/components/GameBoard/SatelliteSprite.tsx` - Update launch start position
- `kessler-game/src/components/GameBoard/DRVSprite.tsx` - Update launch start position

**No new files needed.**

## Data Model / API / Interface Changes

None. This is purely a visual/rendering fix with no changes to data structures or APIs.

## Verification Approach

### Manual Verification
1. Start the development server
2. Launch the game
3. Verify that:
   - The Earth icon is centered in the visualization
   - The three orbit rings (LEO, MEO, GEO) are concentric circles centered on the Earth
   - Satellites and DRVs orbit around the centered Earth icon
   - Launch animations start from the Earth center and move outward to their target orbits

### Testing Commands
- **Dev Server**: Check `package.json` for dev script (likely `npm run dev` or similar)
- **Lint**: Check for `npm run lint` or `eslint` command
- **Type Check**: Check for `npm run typecheck` or `tsc --noEmit`

### Expected Behavior
After the fix, all orbit circles, satellites, DRVs, and the Earth icon should share the same center point at coordinates (500, 500) in the 1000×1000 pixel visualization container.
