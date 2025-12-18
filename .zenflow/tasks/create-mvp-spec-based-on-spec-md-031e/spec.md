# MVP Technical Specification: Kessler Simulation Game

## Task Difficulty Assessment

**Complexity Level**: **MEDIUM**

**Reasoning**:
- MVP strips down to core game loop only
- Simplified collision detection
- Basic visualization without complex animations
- Single mission type to start
- Minimal state management complexity
- Focus on functional prototype over polish

---

## MVP Philosophy

This specification defines a **Minimum Viable Product** that:
- ✅ Demonstrates core gameplay loop (launch → collision → debris)
- ✅ Shows Kessler Syndrome cascade effect
- ✅ Provides basic player decisions (which orbit to launch into)
- ✅ Delivers win/loss conditions
- ❌ Excludes: Complex missions, insurance, events, animations, sound, advanced UI

**Development Timeline**: 2-3 days for functional prototype

---

## Technical Context

### Technology Stack

#### Core (Minimal)
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **State Management**: React Context (no Redux needed for MVP)
- **Build Tool**: Vite

#### Visualization (Simple)
- **2D Graphics**: HTML5 Canvas API (no libraries)
- **Styling**: CSS Modules or plain CSS (no Tailwind)

#### Supporting
- **Testing**: Vitest (unit tests only)
- **Linting**: ESLint + TypeScript

### Dependencies
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.6.0",
  "vite": "^6.0.0"
}
```

### Dev Dependencies
```json
{
  "vitest": "^2.0.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "eslint": "^9.0.0",
  "typescript-eslint": "^8.0.0"
}
```

---

## Implementation Approach

### MVP Game Loop (Simplified)

**Turn Execution Flow**:
```
1. Player selects orbit (LEO/MEO/GEO)
2. Deduct launch cost from budget
3. Create satellite at random position in selected orbit
4. Detect collisions (O(n²) within each layer)
5. Resolve collisions (create debris, destroy satellites)
6. Update turn counter
7. Check end conditions:
   - Win: 20 satellites launched AND debris < 100
   - Loss: Budget exhausted OR debris > 300
8. Advance to next turn
```

**Removed from Full Spec**:
- ❌ Insurance system
- ❌ Mission system (use simple win/loss only)
- ❌ Random events (solar storms)
- ❌ Satellite aging/expiration
- ❌ Satellite types (Weather/Comms/GPS)
- ❌ Complex metrics tracking

### State Structure (Minimal)

```typescript
interface GameState {
  // Simulation
  turn: number;
  gameOver: boolean;
  won: boolean;
  
  // Economy
  budget: number;
  
  // Assets
  satellites: Satellite[];
  debris: Debris[];
  
  // Metrics (for display only)
  totalLaunched: number;
  totalCollisions: number;
}

interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
}

interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
}

type OrbitLayer = 'LEO' | 'MEO' | 'GEO';
```

### Collision Detection (Simple)

```typescript
function detectCollisions(satellites: Satellite[]): Collision[] {
  const collisions: Collision[] = [];
  const byLayer = groupByLayer(satellites);
  
  for (const layer of ['LEO', 'MEO', 'GEO']) {
    const sats = byLayer[layer] || [];
    const threshold = COLLISION_THRESHOLDS[layer];
    
    // Simple O(n²) check - no optimization needed for MVP
    for (let i = 0; i < sats.length; i++) {
      for (let j = i + 1; j < sats.length; j++) {
        const dx = sats[i].x - sats[j].x;
        const dy = sats[i].y - sats[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < threshold) {
          collisions.push({ sat1: sats[i], sat2: sats[j] });
        }
      }
    }
  }
  
  return collisions;
}
```

---

## Source Code Structure

### MVP Files (Minimal Set)

```
src/
├── main.tsx                          # App entry point
├── App.tsx                           # Root component
├── App.css                           # Basic styles
├── context/
│   └── GameContext.tsx               # Game state (Context API)
├── components/
│   ├── GameBoard.tsx                 # Main game visualization
│   ├── ControlPanel.tsx              # Launch buttons + stats
│   └── GameOver.tsx                  # Win/loss screen
├── game/
│   ├── constants.ts                  # Game configuration
│   ├── types.ts                      # TypeScript types
│   ├── collision.ts                  # Collision detection
│   └── engine.ts                     # Core game logic
└── utils/
    └── random.ts                     # Position generation

Total: ~12 files
```

### Configuration Files

```
.
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .eslintrc.json
```

**Note**: No Tailwind, no complex build setup, no test config initially.

---

## Data Model / API / Interface Changes

### Game Constants (Simplified)

```typescript
export const GAME_CONFIG = {
  // Economy
  STARTING_BUDGET: 50_000_000,  // $50M (reduced from $100M)
  LAUNCH_COSTS: {
    LEO: 2_000_000,  // $2M
    MEO: 3_000_000,  // $3M
    GEO: 5_000_000,  // $5M
  },
  
  // Simulation
  DEBRIS_PER_COLLISION: 5,
  
  // Win/Loss Conditions
  WIN_SATELLITE_COUNT: 20,
  WIN_MAX_DEBRIS: 100,
  LOSS_MAX_DEBRIS: 300,
  
  // Collision thresholds
  COLLISION_THRESHOLDS: {
    LEO: 15,   // More forgiving than full spec
    MEO: 20,
    GEO: 25,
  },
  
  // Layer bounds
  LAYER_BOUNDS: {
    LEO: { yMin: 0, yMax: 50 },
    MEO: { yMin: 50, yMax: 100 },
    GEO: { yMin: 100, yMax: 150 },
  },
  
  // Canvas
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 400,
};
```

### Game Actions (Context API)

```typescript
interface GameContextType {
  state: GameState;
  actions: {
    launchSatellite: (orbit: OrbitLayer) => void;
    resetGame: () => void;
  };
}
```

---

## Component Specifications

### 1. GameBoard.tsx

**Purpose**: Render satellites and debris on canvas

**Features**:
- Draw three horizontal orbital layers (colored bands)
- Render satellites as colored circles (blue=LEO, green=MEO, orange=GEO)
- Render debris as small gray dots
- No animations (static rendering after each turn)

**Size**: ~100 lines

---

### 2. ControlPanel.tsx

**Purpose**: Player controls and game info

**Features**:
- Three launch buttons (LEO $2M / MEO $3M / GEO $5M)
- Display current budget
- Display current turn
- Display satellite count
- Display debris count
- Disable buttons when budget insufficient
- Show game over message

**Size**: ~80 lines

---

### 3. GameOver.tsx

**Purpose**: End game screen

**Features**:
- Show win/loss message
- Display final stats (satellites launched, collisions, debris)
- Reset button

**Size**: ~50 lines

---

## Verification Approach

### Testing Strategy (Minimal)

#### Unit Tests (Core Logic Only)
- **Collision detection**: Test edge cases
- **Position generation**: Verify bounds
- **Budget calculations**: Test affordability checks

**Target**: 5-10 unit tests covering critical paths

#### Manual Testing
1. Launch satellites into each orbit
2. Verify collisions create debris
3. Test budget depletion → game over
4. Test debris > 300 → loss
5. Test 20 satellites + low debris → win
6. Test reset functionality

### Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Tests (if time permits)
npm run test

# Build
npm run build
```

### Success Criteria (MVP)

- ✅ Can launch satellites into three orbits
- ✅ Collisions detected and create debris
- ✅ Budget system works correctly
- ✅ Win condition achievable (20 sats, <100 debris)
- ✅ Loss condition works (300+ debris or $0)
- ✅ Game resets properly
- ✅ No TypeScript errors
- ✅ No major bugs preventing gameplay

---

## MVP Feature Exclusions

The following features from the full spec are **NOT** included in MVP:

### Excluded Systems
- ❌ **Insurance system** - Adds complexity without core value
- ❌ **Mission system** - Use simple win/loss instead
- ❌ **Satellite types** (Weather/Comms/GPS) - All satellites are generic
- ❌ **Random events** (solar storms) - Deterministic gameplay only
- ❌ **Satellite aging/expiration** - Satellites persist forever
- ❌ **Historical charts** - Display current counts only
- ❌ **Event log** - No turn history

### Excluded UI/UX
- ❌ **Animations** - Instant state updates
- ❌ **Sound effects** - Silent game
- ❌ **Advanced styling** - Basic CSS only
- ❌ **Responsive design** - Desktop only (600x400 canvas)
- ❌ **Save/load** - No persistence
- ❌ **Undo/redo** - No turn reversal

### Excluded Technical
- ❌ **Redux/Zustand** - React Context sufficient
- ❌ **Chart libraries** - No charts in MVP
- ❌ **Animation libraries** - No animations
- ❌ **CSS frameworks** - Plain CSS
- ❌ **E2E tests** - Manual testing only

---

## Post-MVP Roadmap (Phase 2+)

After MVP validation, add features in this order:

### Phase 2: Core Polish (1-2 days)
- Add basic animations (satellite launch, collision flash)
- Add simple charts (debris/satellite over time)
- Improve visual design
- Add responsive layout

### Phase 3: Strategic Depth (2-3 days)
- Implement mission system (3-5 simple missions)
- Add insurance mechanic
- Add satellite types (Weather/Comms/GPS)

### Phase 4: Engagement (1-2 days)
- Add solar storm events
- Add sound effects
- Add save/load
- Add difficulty levels

### Phase 5: Production Ready (2-3 days)
- Comprehensive testing
- Performance optimization
- Advanced missions
- Leaderboard/scoring

---

## Implementation Plan

### Day 1: Core Engine
1. Set up Vite + React + TypeScript project
2. Implement game constants and types
3. Implement collision detection logic
4. Implement core game engine (turn processing)
5. Write unit tests for engine

### Day 2: UI Components
1. Create GameContext with state management
2. Build GameBoard canvas rendering
3. Build ControlPanel with launch buttons
4. Wire up game loop to UI
5. Test end-to-end gameplay

### Day 3: Polish & Testing
1. Add GameOver screen
2. Implement win/loss conditions
3. Add visual polish (colors, spacing)
4. Manual testing and bug fixes
5. Build and deploy

---

## Key Simplifications vs Full Spec

| Full Spec Feature | MVP Approach | Rationale |
|------------------|--------------|-----------|
| Redux Toolkit state | React Context | Simpler for MVP scale |
| 13 missions | Win/loss only | Validate core gameplay first |
| Insurance system | Removed | Not core to Kessler concept |
| Solar storms | Removed | Adds RNG complexity |
| LEO expiration | Removed | Simplified mechanics |
| 3 satellite types | 1 generic type | Less state to manage |
| Recharts library | No charts | Reduce dependencies |
| Framer Motion | No animations | Faster development |
| Tailwind CSS | Plain CSS | No build complexity |
| Sound effects | Silent | Not critical for MVP |
| Event log | Current state only | Less UI clutter |

---

## Risk Assessment

### Technical Risks
- **Canvas rendering performance**: Mitigated by low object count in MVP
- **Collision detection O(n²)**: Acceptable for <50 satellites
- **TypeScript learning curve**: Mitigated by simple types

### Scope Risks
- **Feature creep**: Strict MVP boundary defined
- **Over-engineering**: Using simplest tools (Context vs Redux)

### Validation Risks
- **Gameplay too simple**: Post-MVP can add missions
- **Visual appeal low**: Acceptable for MVP validation

---

## Success Metrics

### Technical Metrics
- ✅ Build time < 10 seconds
- ✅ Page load < 2 seconds
- ✅ 60 FPS canvas rendering
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors

### Gameplay Metrics
- ✅ Win condition achievable in 20-30 turns
- ✅ Loss condition triggered by bad strategy
- ✅ Collision cascade observable
- ✅ Player choices feel meaningful

### Development Metrics
- ✅ Total LOC < 1000
- ✅ Development time < 3 days
- ✅ No external game libraries
- ✅ Simple deployment (static site)

---

## Conclusion

This MVP specification provides a **clear, achievable path** to building a functional Kessler Syndrome game in 2-3 days. By stripping away non-essential features from the full specification, we can:

1. **Validate core gameplay** - Is the collision/debris mechanic fun?
2. **Test technical approach** - Does React + Canvas work well?
3. **Gather feedback early** - What features do users want most?
4. **Iterate rapidly** - Add Phase 2+ features based on validation

The MVP maintains the **essence** of the full game (launch satellites, avoid collisions, manage Kessler cascade) while cutting everything that doesn't directly serve that core loop.
