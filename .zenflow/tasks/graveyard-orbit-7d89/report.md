# Graveyard Orbit Implementation Report

## Summary
Successfully implemented a complete GEO TUG system that moves end-of-life satellites from GEO orbit to a new GRAVEYARD orbit. Added visual representation, functional logic for targeting, capturing, and moving satellites, and event logging.

## Changes Made

### 1. Type System Updates (types.ts)
- Added 'GRAVEYARD' to OrbitLayer type
- Added 'geotug' to DRVType  
- Added `inGraveyard?: boolean` flag to Satellite interface
- Added new event types: 'satellite-graveyard', 'geotug-decommission'
- Added GraveyardMoveInfo interface for tracking satellite movements
- Added recentGraveyardMoves to GameState

### 2. Constants Updates (constants.ts)
- Added GRAVEYARD to LAUNCH_COSTS (value: 0)
- Added geotug costs to DRV_CONFIG ($50M for all orbits)
- Added geotug capacity: [1, 1] (single satellite at a time)
- Added geotug success rate: 1.0 (100%)
- Added geotug duration: 999 (effectively permanent until decommission)
- Added GRAVEYARD to LAYER_BOUNDS: [150, 200]
- Added GRAVEYARD to ORBITAL_SPEEDS: 2.2
- Added GRAVEYARD to COLLISION_THRESHOLDS: 70

### 3. Visual Representation Updates
**OrbitVisualization.tsx:**
- Added GRAVEYARD orbit ring at 950px diameter
- Reduced other orbits: GEO (800px), MEO (650px), LEO (450px)
- Reduced Earth icon to 100px
- Adjusted background tint to 95% to align with GRAVEYARD edge
- Added GRAVEYARD orbital speed support
- Filter out graveyard satellites from launch animations

**utils.ts, collision.ts:**
- Updated ORBIT_RADII to include GRAVEYARD: inner 400px, outer 475px
- Updated mapToPixels to support GRAVEYARD orbital speed

**LaunchAnimation.tsx:**
- Added GRAVEYARD radius (475px) and color (purple #a855f7)

**Sprite Components:**
- Updated DRVSprite with purple color (#a855f7) for GEO TUG
- Added GRAVEYARD orbital speed support to all sprite components (DRV, Satellite, Debris)

### 4. Game Logic (debrisRemoval.ts, gameSlice.ts)
**debrisRemoval.ts:**
- Updated selectTarget to exclude satellites with inGraveyard flag
- Added selectGeoTugTarget function (targets only GEO satellites)
- Added processGeoTugOperations function:
  - Targets GEO satellites only
  - Captures satellites using same mechanism as cooperative DRVs
  - Moves captured satellites to GRAVEYARD after 2 orbits
  - Sets shouldDecommission flag after moving satellite

**gameSlice.ts:**
- Added processGeoTugOperations import
- Added orbitalSpeedGRAVEYARD to state
- Updated DRV processing to handle 'geotug' type
- When satellite is moved to graveyard:
  - Sets layer to 'GRAVEYARD'
  - Sets inGraveyard flag to true
  - Sets y position to 175 (middle of graveyard layer)
  - Tracks move in recentGraveyardMoves array
- Decommissions GEO TUG after moving satellite (age = maxAge)
- Updated movement logic for GEO TUG (uses same cooperative DRV movement)

### 5. Collision Updates (collision.ts)
- Updated detectCollisions to filter out satellites with inGraveyard flag
- Added GRAVEYARD to layers array for collision detection
- Updated ORBIT_RADII to match new sizes

### 6. Control Panel (ControlPanel.tsx)
- Added 'geotug' as third launch type option (purple "GEO TUG" button)
- Resized all launch type buttons (smaller padding, gap, font)
- Force orbit selection to GEO when GEO TUG is selected (disabled orbit buttons)
- Updated cost calculation to use DRV_CONFIG for geotug ($50M)
- Updated handleLaunch to dispatch launchDRV with geotug type
- Added GEO TUG configuration panel with description

### 7. Event System (EventItem.tsx, gameSlice.ts)
- Added event colors for 'satellite-graveyard' (purple) and 'geotug-decommission' (gray)
- Added recentGraveyardMoves tracking in GameState
- GEO TUG operations populate graveyardMoves array for event logging

### 8. Scoring (scoring.ts)
- Added GRAVEYARD to SATELLITE_LAUNCH.LAYER_BONUS (value: 0)

## Behavior
1. **Launching GEO TUG**: Costs $50M, launches into GEO orbit with purple color
2. **Targeting**: Automatically targets satellites in GEO orbit only (excludes graveyard satellites)
3. **Capturing**: Uses same capture mechanism as cooperative DRVs with sound effects
4. **Moving to Graveyard**: After holding satellite for 2 orbits, moves it to GRAVEYARD layer
5. **Decommissioning**: GEO TUG automatically decommissions itself after moving a satellite
6. **Graveyard Satellites**: 
   - Cannot be captured by any DRV
   - Cannot collide with other objects
   - Remain in graveyard orbit for remainder of game
   - Visible on visualization but non-interactive

## Verification
- Linter: ✓ Passed with no errors
- Build: ✓ Passed TypeScript compilation and Vite build successfully
- All TypeScript type errors resolved
- All sprite components updated for GRAVEYARD support
