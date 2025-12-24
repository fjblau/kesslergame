# Follow-Up Tasks for Kessler Simulation

## Critical - Core Game Logic (Must Fix)

### Task 1: Implement Collision Detection System
**Description**: Add collision detection between satellites/debris with layer-specific thresholds  
**Scope**: 
- Detect collisions within each orbital layer (LEO/MEO/GEO)
- Generate debris on collision (5 pieces, 70/30 cooperative/uncooperative split)
- Destroy colliding satellites
- Trigger insurance payouts
- Update game state

**Files**: 
- `src/game/engine/collision.ts` (extend existing)
- `src/store/slices/gameSlice.ts` (add processCollisions action)

**Complexity**: Medium

---

### Task 2: Implement DRV Debris Removal Execution
**Description**: Make DRVs actually remove debris each turn based on capacity and success rate  
**Scope**:
- Execute removal for each active DRV per turn
- Use target priority to select debris (from existing `selectDebrisTarget`)
- Check success rate with `attemptDebrisRemoval`
- Update DRV `debrisRemoved` counter
- Remove debris from game state

**Files**:
- `src/game/engine/debrisRemoval.ts` (extend existing)
- `src/store/slices/gameSlice.ts` (add processDRVOperations action)

**Complexity**: Easy

---

### Task 3: Implement Satellite Lifecycle (LEO Expiration)
**Description**: Remove LEO satellites after 20 turns, other layers have no expiration  
**Scope**:
- Check satellite age each turn
- Remove LEO satellites where age >= LEO_LIFETIME (20)
- MEO/GEO satellites never expire

**Files**:
- `src/store/slices/gameSlice.ts` (add to advanceTurn logic)

**Complexity**: Easy

---

### Task 4: Implement DRV Decommissioning
**Description**: Convert expired DRVs to debris after maxAge reached  
**Scope**:
- Check DRV age each turn
- Remove DRVs where age >= maxAge
- Create debris at DRV position (cooperative type)

**Files**:
- `src/store/slices/gameSlice.ts` (add decommissionExpiredDRVs action)

**Complexity**: Easy

---

## High Priority - Visualization

### Task 5: Create Orbit Visualization Canvas
**Description**: Build 2D concentric orbit visualization with satellites/debris/DRVs  
**Scope**:
- Canvas component with LEO/MEO/GEO layers (concentric circles)
- Render satellites with purpose icons (☁️📡🛰️)
- Render debris (cooperative: blue dots, uncooperative: red dots)
- Render DRVs (pentagon shapes)
- Update on state changes

**Files**:
- `src/components/GameBoard/OrbitVisualization.tsx` (new)
- `src/components/GameBoard/SatelliteSprite.tsx` (new)
- `src/components/GameBoard/DebrisParticle.tsx` (new)
- `src/components/GameBoard/DRVSprite.tsx` (new)

**Complexity**: Medium

**Reference**: `wireframes/orbit-visualization.html`

---

### Task 6: Create Stats Display Panel
**Description**: Real-time stats showing satellites, debris breakdown, DRVs, risk level  
**Scope**:
- Active satellites count
- Total debris (with cooperative/uncooperative breakdown)
- Active DRVs count
- Total debris removed
- Risk level indicator (LOW/MEDIUM/CRITICAL)

**Files**:
- `src/components/StatsPanel/StatsPanel.tsx` (new)
- `src/components/StatsPanel/DebrisBreakdown.tsx` (new)

**Complexity**: Easy

**Reference**: `wireframes/status-display.html`, `wireframes/debris-breakdown.html`

---

### Task 7: Create Metrics Charts (Debris & Removal Over Time)
**Description**: Line charts tracking debris count and removal over turns  
**Scope**:
- Debris count history chart
- Satellite count history chart  
- Debris removed cumulative chart
- Use Recharts library

**Files**:
- `src/components/Charts/DebrisChart.tsx` (new)
- `src/components/Charts/SatelliteChart.tsx` (new)
- `src/components/Charts/DebrisRemovalChart.tsx` (new)
- Install: `npm install recharts`

**Complexity**: Easy

**Reference**: `wireframes/debris-removal-chart.html`

---

## Medium Priority - Game Features

### Task 8: Implement Risk Level Calculation
**Description**: Calculate and display risk level based on debris count  
**Scope**:
- LOW: <150 debris
- MEDIUM: 150-300 debris
- CRITICAL: >300 debris
- Auto-pause on risk change (if enabled in UI settings)

**Files**:
- `src/game/engine/risk.ts` (new)
- `src/store/slices/gameSlice.ts` (add riskLevel to state)

**Complexity**: Easy

---

### Task 9: Add Mission System
**Description**: Implement 3-5 missions from spec with progress tracking  
**Scope**:
- Select 3 random missions at game start (from 13 available)
- Track progress each turn
- Show completion status
- Examples: "Launch 3 GPS by turn 20", "Maintain LOW risk for 10 turns"

**Files**:
- `src/game/missions.ts` (new - mission definitions)
- `src/store/slices/missionsSlice.ts` (new)
- `src/components/MissionPanel/MissionPanel.tsx` (new)
- `src/components/MissionPanel/MissionCard.tsx` (new)

**Complexity**: Medium

**Reference**: `wireframes/mission-panel.html`

---

### Task 10: Add Event Log
**Description**: Display game events (launches, collisions, debris removal, missions)  
**Scope**:
- Log major events with timestamp (turn number)
- Scrollable event feed
- Color-coded by type (green: launch, red: collision, blue: removal)

**Files**:
- `src/components/EventLog/EventLog.tsx` (new)
- `src/components/EventLog/EventItem.tsx` (new)
- `src/store/slices/eventSlice.ts` (new)

**Complexity**: Easy

---

### Task 11: Implement Random Events (Solar Storms)
**Description**: 10% chance per turn to clear 30% of LEO debris  
**Scope**:
- Check each turn for solar event (10% chance)
- Remove 30% of LEO debris randomly
- Log event in event log
- Visual indicator/animation

**Files**:
- `src/game/engine/events.ts` (new)
- `src/store/slices/gameSlice.ts` (add triggerSolarEvent)

**Complexity**: Easy

---

### Task 12: Add Game Over Conditions
**Description**: End game on budget depletion, max steps, or cascade threshold  
**Scope**:
- Game over if budget < 0
- Game over if step >= maxSteps (100)
- Game over if debris > MAX_DEBRIS_LIMIT (500)
- Show game over modal with stats

**Files**:
- `src/components/GameOver/GameOverModal.tsx` (new)
- `src/store/slices/gameSlice.ts` (add gameOver flag)

**Complexity**: Easy

---

## Nice to Have - Polish & UX

### Task 13: Add Collision Cascade Detection
**Description**: Detect when 3+ simultaneous collisions occur (cascade event)  
**Scope**:
- Track number of collisions per turn
- Trigger cascade flag if count >= 3
- Visual/audio warning
- Mission tracking ("No Cascades" mission)

**Files**:
- `src/game/engine/collision.ts` (extend)
- `src/store/slices/gameSlice.ts` (add cascadeTriggered flag)

**Complexity**: Easy

---

### Task 14: Add Animation to Orbit Visualization
**Description**: Animate satellite/debris/DRV movement around orbits  
**Scope**:
- Rotate objects around orbit circles
- Collision flash effects
- Launch animations
- Use Framer Motion

**Files**:
- `src/components/GameBoard/OrbitVisualization.tsx` (update)
- Install: `npm install framer-motion`

**Complexity**: Medium

**Reference**: `wireframes/orbit-visualization-animation.html`

---

### Task 15: Add Save/Load Game State
**Description**: Persist game state to localStorage for resume  
**Scope**:
- Save button to export state
- Load saved games on startup
- Multiple save slots

**Files**:
- `src/utils/saveGame.ts` (new)
- `src/store/middleware/persistence.ts` (new)

**Complexity**: Easy

---

### Task 16: Add Keyboard Shortcuts
**Description**: Hotkeys for common actions  
**Scope**:
- Space: advance turn / toggle pause
- 1/2/3: select LEO/MEO/GEO
- S/D: satellite/DRV launch type
- P: toggle pause

**Files**:
- `src/hooks/useKeyboardShortcuts.ts` (new)

**Complexity**: Easy

---

### Task 17: Add Tutorial/Help System
**Description**: Onboarding for first-time players  
**Scope**:
- Highlight key UI elements with tooltips
- Step-by-step guide for first launch
- Help modal with rules

**Files**:
- `src/components/Tutorial/TutorialOverlay.tsx` (new)
- `src/components/Help/HelpModal.tsx` (new)

**Complexity**: Medium

---

### Task 18: Add Sound Effects
**Description**: Audio feedback for actions and events  
**Scope**:
- Launch sound
- Collision impact
- Debris removal
- Mission complete chime
- Background ambient space music (optional toggle)

**Files**:
- `src/hooks/useSoundEffects.ts` (new)
- `src/assets/sounds/` (audio files)

**Complexity**: Easy

---

## Future Enhancements (Phase 2+ Inputs)

### Task 19: Implement Budget Allocation Slider
**Description**: Phase 2 input - pre-allocate budget across satellites/DRV/reserve  
**Reference**: `spec.md` section 1.1

---

### Task 20: Implement Turn Scheduler
**Description**: Phase 2 input - schedule launches 5 turns ahead  
**Reference**: `spec.md` section 2.2

---

### Task 21: Implement Custom Orbit Altitude
**Description**: Phase 3 input - fine-tune altitude within layers  
**Reference**: `spec.md` section 3.1

---

### Task 22: Implement DRV Fleet Manager
**Description**: Phase 2 input - manage active DRVs with boost/decommission  
**Reference**: `spec.md` section 4.3

---

### Task 23: Add More DRV Types
**Description**: Phase 3 input - Heavy-Duty, Precision, Bulk Sweeper variants  
**Reference**: `spec.md` section 4.4

---

## Task Priority Summary

**Critical (Must Fix)**: Tasks 1-4 - Core game logic  
**High Priority**: Tasks 5-7 - Visualization  
**Medium Priority**: Tasks 8-12 - Game features  
**Nice to Have**: Tasks 13-18 - Polish & UX  
**Future**: Tasks 19-23 - Phase 2+ inputs
