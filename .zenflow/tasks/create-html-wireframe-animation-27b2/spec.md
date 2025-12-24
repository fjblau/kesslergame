# Technical Specification: HTML Wireframe Animation of Orbital Simulation

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- Straightforward HTML/CSS/JavaScript implementation (no framework required)
- Canvas animation with moderate complexity (orbital mechanics visualization)
- Multiple animated entities (satellites, debris, DRVs) with different behaviors
- Collision detection visualization requires careful timing
- Event sequence choreography for realistic gameplay simulation
- No complex state management or backend integration needed

---

## Technical Context

### Source Material
- **Existing Spec**: `spec.md` - Full React game specification with detailed game mechanics
- **Report**: `report.md` - Analysis of Kessler simulation notebook
- **Notebook**: `kessler.ipynb` - Original Python simulation with game logic

### Reference Components
From the existing spec, the target visualization includes:
- **OrbitVisualization**: Canvas rendering of orbital layers
- **SatelliteSprite**: Satellite rendering with types (GPS, Comms, Weather)
- **DRVSprite**: Debris Removal Vehicle rendering
- **DebrisParticle**: Debris rendering with type variants

### Target Technology Stack

#### Core Technologies
- **HTML5**: Structure and Canvas element
- **CSS3**: Styling, animations, and transitions
- **Vanilla JavaScript**: Animation logic and simulation
- **Canvas API**: 2D graphics rendering

#### No Dependencies Required
- Pure browser-based implementation
- No build tools or package managers
- Self-contained single HTML file

---

## Implementation Approach

### Animation Scenario

**Simulated Gameplay Sequence** (approximately 30-45 seconds):

1. **Initial State** (0-2s)
   - Display empty orbital visualization with 3 layers (LEO, MEO, GEO)
   - Show UI elements: budget, step counter, risk level

2. **Early Game** (2-10s)
   - Launch 2-3 satellites into different orbits
   - Show launch animations with trajectory paths
   - Update budget and counters

3. **DRV Deployment** (10-15s)
   - Launch a Debris Removal Vehicle into LEO
   - Animate DRV moving and removing debris
   - Show debris count decreasing

4. **Collision Event** (15-20s)
   - Two satellites get too close
   - Collision animation with explosion effect
   - Generate 5 debris pieces scattering
   - Show insurance payout notification

5. **Risk Escalation** (20-25s)
   - Risk level increases from LOW to MEDIUM
   - Visual risk indicator changes color
   - More debris accumulates

6. **Solar Storm Event** (25-30s)
   - Solar storm animation effect
   - LEO debris particles fade out (30% removed)
   - Event notification appears

7. **End State** (30-45s)
   - Continue orbital motion
   - Display final statistics
   - Loop or reset to beginning

### Visual Design Approach

**Wireframe Style**:
- Minimalist, schematic aesthetic
- Black/white/gray base colors with accent colors for states
- Clear labels and annotations
- Simple geometric shapes (circles, squares, triangles)
- Dotted/dashed lines for orbits and trajectories

**Color Coding**:
- **LEO**: Blue (#3B82F6)
- **MEO**: Green (#10B981)
- **GEO**: Orange (#F59E0B)
- **Satellites**: White outlines with fill
- **Debris**: Red particles (#EF4444)
- **DRVs**: Yellow/Gold (#FBBF24)
- **Risk Levels**: 
  - LOW: Green (#10B981)
  - MEDIUM: Yellow (#F59E0B)
  - CRITICAL: Red (#EF4444)

### Canvas Layout

**Dimensions**: 1200px × 800px

**Sections**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: KESSLER SIMULATION - ORBITAL VISUALIZATION          │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────┐ ┌────────────────────────────────┐   │
│ │                    │ │  Controls & Status:            │   │
│ │                    │ │  - Step: 12/100                │   │
│ │   Orbit Canvas     │ │  - Budget: $86M                │   │
│ │   (800×600)        │ │  - Satellites: 8               │   │
│ │                    │ │  - Debris: 23                  │   │
│ │   [LEO]            │ │  - DRVs: 1                     │   │
│ │   [MEO]            │ │  - Risk: MEDIUM ⚠️             │   │
│ │   [GEO]            │ │                                │   │
│ │                    │ │  Event Log:                    │   │
│ │                    │ │  [Recent events scroll here]   │   │
│ └────────────────────┘ └────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Legend: ○ Satellite | × Debris | ◆ DRV | ⚡ Event          │
└─────────────────────────────────────────────────────────────┘
```

### Animation Mechanics

**Orbital Motion**:
- All objects rotate around center at layer-specific speeds
- LEO: Fastest (1 revolution per 10 seconds)
- MEO: Medium (1 revolution per 15 seconds)
- GEO: Slowest (1 revolution per 20 seconds)

**Launch Animation**:
- Satellite appears at bottom of canvas
- Travels along curved trajectory to target orbit
- Takes ~1.5 seconds to reach orbit
- Leaves fading trail behind

**Collision Animation**:
- Flash effect at collision point
- Expanding circle ripple effect
- Both objects removed
- 5 debris pieces scatter outward
- Duration: ~0.5 seconds

**DRV Operation**:
- DRV moves toward nearest debris in its layer
- "Captures" debris (both fade together)
- Moves to next debris target
- Each capture takes ~1 second

**Solar Storm Effect**:
- Yellow/white overlay flashes across canvas
- Electrical arc effects
- LEO debris fade out gradually
- Duration: ~2 seconds

---

## Source Code Structure

### Single File Implementation

```
orbit-visualization-animation.html
├── HTML Structure
│   ├── Canvas element
│   ├── Status panel
│   └── Event log
├── CSS Styles (embedded in <style>)
│   ├── Layout and positioning
│   ├── Typography
│   └── Animation keyframes
└── JavaScript (embedded in <script>)
    ├── Canvas setup and rendering
    ├── Entity classes (Satellite, Debris, DRV)
    ├── Animation state machine
    ├── Collision detection (visual only)
    ├── Event sequencer
    └── UI update functions
```

### JavaScript Architecture

```javascript
// Entity Classes
class Satellite {
  constructor(layer, type, position, insured) { }
  update(deltaTime) { } // Update position
  draw(ctx) { } // Render on canvas
}

class Debris {
  constructor(layer, position, type) { }
  update(deltaTime) { }
  draw(ctx) { }
}

class DebrisRemovalVehicle {
  constructor(layer, position, type) { }
  update(deltaTime) { }
  draw(ctx) { }
  targetDebris(debrisList) { } // Find and move toward debris
}

// Animation State Machine
const animationSequence = [
  { time: 0, action: 'showInitialState' },
  { time: 2000, action: 'launchSatellite', params: { orbit: 'LEO', type: 'GPS' } },
  { time: 4000, action: 'launchSatellite', params: { orbit: 'MEO', type: 'Comms' } },
  { time: 6000, action: 'launchSatellite', params: { orbit: 'GEO', type: 'Weather' } },
  { time: 10000, action: 'launchDRV', params: { orbit: 'LEO', type: 'cooperative' } },
  { time: 15000, action: 'triggerCollision', params: { layer: 'MEO' } },
  { time: 20000, action: 'updateRisk', params: { level: 'MEDIUM' } },
  { time: 25000, action: 'triggerSolarStorm' },
  { time: 30000, action: 'showSummary' },
  { time: 45000, action: 'restart' }
];

// Main Animation Loop
function animate(timestamp) {
  // Clear canvas
  // Update all entities
  // Check for triggered events
  // Render all entities
  // Update UI
  // Request next frame
  requestAnimationFrame(animate);
}

// Event System
function triggerEvent(eventType, params) {
  switch(eventType) {
    case 'launch': launchAnimation(params); break;
    case 'collision': collisionAnimation(params); break;
    case 'solarStorm': solarStormAnimation(params); break;
    case 'drvCapture': drvCaptureAnimation(params); break;
  }
  logEvent(eventType, params);
}
```

---

## Data Model / API / Interface Changes

### No Backend/API Required

This is a purely frontend visualization with hardcoded animation sequence.

### Simplified Data Structures

```javascript
// Configuration
const ORBIT_CONFIG = {
  LEO: { 
    radius: 100, 
    color: '#3B82F6',
    speed: Math.PI / 5, // radians per second
    bounds: [80, 120]
  },
  MEO: { 
    radius: 180, 
    color: '#10B981',
    speed: Math.PI / 7.5,
    bounds: [160, 200]
  },
  GEO: { 
    radius: 260, 
    color: '#F59E0B',
    speed: Math.PI / 10,
    bounds: [240, 280]
  }
};

// State (simplified for animation)
const state = {
  step: 0,
  budget: 100000000,
  satellites: [],
  debris: [],
  drvs: [],
  riskLevel: 'LOW',
  eventLog: []
};

// Entity representation
const entity = {
  id: string,
  type: 'satellite' | 'debris' | 'drv',
  layer: 'LEO' | 'MEO' | 'GEO',
  angle: number, // position on orbit (radians)
  radius: number, // distance from center
  metadata: {
    purpose?: 'GPS' | 'Comms' | 'Weather',
    drvType?: 'cooperative' | 'uncooperative',
    debrisType?: 'cooperative' | 'uncooperative',
    insured?: boolean
  }
};
```

---

## Verification Approach

### Manual Testing

1. **Visual Verification**
   - [ ] Open HTML file in Chrome, Firefox, Safari
   - [ ] Verify all orbital layers render correctly
   - [ ] Confirm smooth animations (60 FPS target)
   - [ ] Check all UI elements are visible and updating

2. **Animation Sequence**
   - [ ] Verify satellites launch and enter correct orbits
   - [ ] Confirm DRV deploys and removes debris
   - [ ] Check collision animation triggers correctly
   - [ ] Verify solar storm effect displays properly
   - [ ] Confirm animation loops or restarts at end

3. **Timing Verification**
   - [ ] Verify events occur at correct timestamps
   - [ ] Check animation durations feel natural
   - [ ] Ensure no stuttering or performance issues

4. **Responsiveness**
   - [ ] Test on different screen sizes
   - [ ] Verify canvas scales appropriately
   - [ ] Check text remains readable

### Performance Testing

- Monitor frame rate using browser DevTools
- Target: 60 FPS consistently
- Max entities on screen: ~30-40 (satellites + debris + DRVs)

### Cross-Browser Compatibility

- **Chrome**: Primary target (latest version)
- **Firefox**: Secondary target
- **Safari**: Tertiary target
- **Edge**: Should work (Chromium-based)

---

## Implementation Constraints

### Simplifications vs. Full Game

This wireframe animation is NOT a playable game. It is a demonstration of:
- Visual design concepts
- Animation capabilities
- UI layout
- Game flow and pacing

**Not Included**:
- User interaction (no buttons, no player control)
- Real collision detection algorithm
- Complex game logic or rules
- Mission system
- Data persistence
- Sound effects (can be added as enhancement)

### Technical Constraints

- Single HTML file (self-contained)
- No external dependencies
- Maximum file size: ~200-300 KB (including embedded assets as data URIs if needed)
- Canvas 2D only (no WebGL)
- Compatible with modern browsers (ES6+)

---

## File Deliverable

**Output**: `orbit-visualization-animation.html`

**Location**: Project root directory

**Usage**: 
```bash
# Open in browser
open orbit-visualization-animation.html

# Or serve via local server
python -m http.server 8000
# Navigate to http://localhost:8000/orbit-visualization-animation.html
```

---

## Success Criteria

The implementation is successful if:

1. ✅ Animation runs smoothly without user interaction
2. ✅ All game mechanics are visually represented (launch, collision, DRV operation, solar storm)
3. ✅ UI elements update in sync with animation events
4. ✅ Visual style is clean, wireframe-like, and professional
5. ✅ Animation sequence tells a coherent gameplay story
6. ✅ File is self-contained and works offline
7. ✅ Compatible with modern browsers (Chrome, Firefox, Safari)
8. ✅ Performance is smooth (no lag or stuttering)

---

## Future Enhancements (Out of Scope)

If this wireframe is successful, potential next steps:
- Add user controls (play/pause, speed control, scrubber)
- Make it interactive (click to launch satellites)
- Add sound effects
- Create multiple scenario presets
- Export as video/GIF
- Integrate with full React game as intro sequence
