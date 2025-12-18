# Technical Specification: UI Wireframe Mockups for Kessler Simulation Game

## Task Difficulty Assessment

**Complexity Level**: **EASY**

**Reasoning**:
- Straightforward design documentation task
- No code implementation required
- Clear requirements from existing spec
- Standard wireframing approach using HTML/CSS
- Well-defined component structure already documented

---

## Technical Context

### Source Material
- **Game Spec**: `spec.md` - Full technical specification of the React game
- **Game Report**: `report.md` - Detailed analysis of game mechanics
- **Source Notebook**: `kessler.ipynb` - Python implementation reference

### Target Deliverables
- **Format**: HTML-based interactive wireframes
- **Style**: Low-fidelity grayscale mockups
- **Technology**: Pure HTML + inline CSS (no build step)
- **Output**: Single HTML file per screen for easy viewing

---

## Implementation Approach

### Wireframe Screens to Create

Based on the spec.md component structure, create wireframes for:

1. **Main Game Screen** (`game-main.html`)
   - Complete layout with all panels integrated
   - Shows spatial relationship between components
   - Primary gameplay view

2. **Start Screen** (`game-start.html`)
   - Welcome message
   - Mission selection preview
   - New game button
   - Tutorial/help option

3. **Game Over Screen** (`game-over.html`)
   - Final statistics
   - Mission completion status
   - Score summary
   - Restart option

4. **Component Detail Views**:
   - **Orbital Visualization Detail** (`component-orbit.html`)
   - **Control Panel Detail** (`component-controls.html`)
   - **Mission Panel Detail** (`component-missions.html`)
   - **Metrics Panel Detail** (`component-metrics.html`)
   - **Event Log Detail** (`component-events.html`)

### Wireframe Design Principles

- **Grayscale only**: Use shades of gray to indicate hierarchy
- **Box model**: Clear rectangular sections for components
- **Label annotations**: Text labels for interactive elements
- **Placeholder content**: Realistic but generic data
- **Dimensions**: Target 1920x1080 desktop layout
- **Grid-based**: Use consistent spacing (8px grid system)
- **Typography**: Single sans-serif font, size hierarchy only
- **No graphics**: Use boxes/circles to represent visual elements

---

## File Structure

```
.zenflow/tasks/create-wireframe-mockups-of-ui-e3dc/
├── wireframes/
│   ├── game-main.html              # Primary gameplay screen
│   ├── game-start.html             # Initial landing screen
│   ├── game-over.html              # End game summary
│   ├── component-orbit.html        # Orbital visualization detail
│   ├── component-controls.html     # Control panel detail
│   ├── component-missions.html     # Mission panel detail
│   ├── component-metrics.html      # Charts/metrics detail
│   ├── component-events.html       # Event log detail
│   └── index.html                  # Navigation index for all wireframes
└── spec.md                         # This file
```

---

## Screen Specifications

### 1. Main Game Screen Layout

**Dimensions**: 1920x1080px

**Layout Grid**:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Budget | Debris | Satellites | Risk | Turn         │ 100px
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│   Orbital           │   Mission Panel                      │
│   Visualization     │   (3 active missions)                │
│                      │                                      │
│   800x600px         │   400px width                        │
│                      │                                      │
│                      ├──────────────────────────────────────┤
│                      │   Metrics Charts                     │
│                      │   - Debris over time                 │
│                      │   - Satellites over time             │
├──────────────────────┤   400x200px                          │
│   Control Panel      │                                      │
│   - Orbit selector   ├──────────────────────────────────────┤
│   - Insurance toggle │   Event Log                          │
│   - Launch button    │   (Recent 5 events)                  │
│   800x200px          │   400x180px                          │
└──────────────────────┴──────────────────────────────────────┘
```

**Key Elements**:
- Top status bar: Budget ($100M), Debris count, Active satellites, Risk level, Turn counter
- Left primary: Orbital visualization with 3 concentric circles (LEO/MEO/GEO)
- Right top: Mission cards with progress indicators
- Right middle: Line charts for metrics
- Right bottom: Scrollable event log
- Bottom left: Launch controls

---

### 2. Start Screen

**Key Elements**:
- Title: "Kessler Syndrome Simulation"
- Subtitle: Brief game description
- Mission preview: "3 random missions will be selected"
- New Game button (primary CTA)
- Tutorial button (secondary)
- Settings icon (top right)

**Layout**: Centered card design, 600x800px content area

---

### 3. Game Over Screen

**Key Elements**:
- Game result header: "Mission Complete" or "Kessler Event Triggered"
- Final statistics table:
  - Turns survived
  - Total satellites launched
  - Final debris count
  - Budget remaining
  - Missions completed (X/3)
- Mission completion list with checkmarks
- Score calculation breakdown
- "Play Again" and "Share Results" buttons

**Layout**: Centered modal overlay, 800x900px

---

### 4. Component Detail Wireframes

#### Orbital Visualization
- Circular canvas area (800x600px)
- Concentric orbit rings labeled LEO/MEO/GEO
- Satellite icons (circles with labels)
- Debris particles (small dots)
- Legend showing symbol meanings
- Collision animation indicator area

#### Control Panel
- Orbit selector: 3 radio buttons (LEO/MEO/GEO)
- Cost display per orbit
- Insurance checkbox with cost ($500K)
- Launch button (disabled when insufficient funds)
- Skip turn button
- Budget warning indicator

#### Mission Panel
- 3 mission cards stacked vertically
- Each card shows:
  - Mission name
  - Description
  - Progress bar
  - Completion status (checkmark or pending)

#### Metrics Panel
- Two line charts stacked:
  - Debris count over time (red line)
  - Active satellites over time (blue line)
- X-axis: Turn number
- Y-axis: Count
- Current values labeled

#### Event Log
- Chronological list (newest first)
- Each entry shows:
  - Turn number
  - Event type icon
  - Event description
  - Color coding (collision=red, launch=blue, event=yellow)
- Scrollable container (last 10 events visible)

---

## Data Model (UI State)

### Sample Data for Wireframes

```typescript
// Status bar data
const statusData = {
  budget: 94000000,
  debrisCount: 127,
  satelliteCount: 8,
  riskLevel: 'MEDIUM',
  currentTurn: 15,
  maxTurns: 100
};

// Mission data
const missionData = [
  {
    id: 'gps_3_by_20',
    name: 'GPS Priority',
    description: 'Launch 3 GPS satellites by turn 20',
    progress: 67, // percentage
    completed: false
  },
  {
    id: 'low_risk_10x',
    name: '10x Low Risk',
    description: 'Maintain LOW risk for 10 consecutive turns',
    progress: 30,
    completed: false
  },
  {
    id: 'all_3_layers',
    name: 'All Layers',
    description: 'Launch into all orbital layers',
    progress: 100,
    completed: true
  }
];

// Event log data
const eventLog = [
  { turn: 15, type: 'launch', message: 'Launched GPS satellite to MEO (insured)' },
  { turn: 14, type: 'collision', message: 'Collision detected! 2 satellites destroyed, 10 debris created' },
  { turn: 14, type: 'insurance', message: 'Insurance payout: $1,000,000' },
  { turn: 13, type: 'event', message: 'Solar storm reduced LEO debris by 30%' },
  { turn: 12, type: 'skip', message: 'Turn skipped - no launch' }
];

// Orbital objects
const satellites = [
  { x: 45, y: 25, layer: 'LEO', type: 'GPS', age: 5, insured: true },
  { x: 70, y: 65, layer: 'MEO', type: 'Comms', age: 12, insured: false },
  // ... more satellites
];

const debris = [
  { x: 30, y: 20, layer: 'LEO' },
  { x: 55, y: 80, layer: 'MEO' },
  // ... more debris
];
```

---

## Visual Design Standards

### Color Palette (Grayscale)
- **Background**: #FFFFFF (white)
- **Surface**: #F5F5F5 (light gray)
- **Border**: #CCCCCC (medium gray)
- **Text Primary**: #333333 (dark gray)
- **Text Secondary**: #666666 (medium dark gray)
- **Disabled**: #999999 (light medium gray)
- **Accent**: #000000 (black for emphasis)

### Typography Scale
- **H1 (Page title)**: 32px, bold
- **H2 (Section title)**: 24px, bold
- **H3 (Card title)**: 18px, bold
- **Body**: 14px, normal
- **Small**: 12px, normal
- **Tiny (labels)**: 10px, normal

### Spacing System (8px grid)
- **XXS**: 4px (tight)
- **XS**: 8px (compact)
- **SM**: 16px (cozy)
- **MD**: 24px (comfortable)
- **LG**: 32px (spacious)
- **XL**: 48px (loose)

### Component Standards
- **Border radius**: 4px (subtle rounded corners)
- **Border width**: 1px (standard)
- **Button height**: 40px (clickable area)
- **Input height**: 36px
- **Card padding**: 16px
- **Page margin**: 24px

---

## Annotations and Labels

Each wireframe should include:
- **Component names** in square brackets [Component Name]
- **Dimensions** for major areas (WxH)
- **Interaction hints** for buttons/controls
- **Data placeholders** showing sample values
- **State indicators** (active, disabled, selected)

Example annotation:
```
[Button: Launch Satellite]
- Hover: darken background
- Click: dispatch launch action
- Disabled when: budget < launch cost
- Shows loading spinner during turn processing
```

---

## Verification Approach

### Checklist for Each Wireframe

- [ ] All screen dimensions are specified
- [ ] Component hierarchy is clear
- [ ] Interactive elements are labeled
- [ ] Sample data is realistic
- [ ] Annotations explain behavior
- [ ] Layout is responsive-ready (grid-based)
- [ ] Typography scale is consistent
- [ ] Spacing follows 8px grid
- [ ] File opens in browser without errors
- [ ] Navigation index links work

### Review Criteria

1. **Completeness**: All screens from spec are covered
2. **Clarity**: Layout is immediately understandable
3. **Consistency**: Design patterns are reused across screens
4. **Feasibility**: Designs are implementable in React
5. **Usability**: Information hierarchy is logical

---

## Success Criteria

- ✅ 9 HTML wireframe files created
- ✅ Index page for navigation between wireframes
- ✅ All major components from spec.md are visualized
- ✅ Annotations explain interactions and states
- ✅ Layouts match described grid structure
- ✅ Wireframes are viewable in any modern browser
- ✅ No external dependencies (pure HTML/CSS)
