# Technical Specification: Getting Started Tutorial

## Task Difficulty Assessment

**Complexity Level**: **Medium**

**Reasoning**:
- Requires new UI component (modal/overlay tutorial system)
- Need to track tutorial state (first-time user vs returning user)
- Multiple tutorial steps with interactive elements
- Integration with existing game state and UI patterns
- Moderate complexity, but follows established patterns in the codebase

---

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Animation**: Framer Motion 12.23.26
- **Testing**: Vitest 4.0.16 + React Testing Library 16.3.1

### Project Structure
```
kessler-game/
├── src/
│   ├── components/
│   │   ├── Setup/              # Game setup screen
│   │   ├── GameOver/           # GameOverModal (modal pattern reference)
│   │   ├── ControlPanel/       # Launch controls
│   │   ├── GameBoard/          # Orbit visualization
│   │   └── ui/                 # Reusable UI components
│   ├── store/
│   │   └── slices/
│   │       ├── gameSlice.ts    # Core game state
│   │       └── uiSlice.ts      # UI state (for tutorial state)
│   ├── App.tsx                 # Main app component
│   └── game/
│       ├── types.ts            # TypeScript types
│       └── constants.ts        # Game constants
```

### Existing Patterns
1. **Modal Overlays**: The game uses full-screen modals (see `GameOverModal.tsx`) with:
   - Fixed positioning with backdrop (`fixed inset-0 bg-black bg-opacity-90`)
   - Centered content container
   - Gradient styling for headings
   - Consistent button styling

2. **State Management**: Redux slices with TypeScript interfaces
   - `gameSlice.ts` for game state
   - `uiSlice.ts` for UI-specific state (game speed, etc.)

3. **LocalStorage**: Used for persisting user preferences and high scores
   - See collision settings, orbital speed settings in `gameSlice.ts`

4. **Animation**: Framer Motion is available for transitions

---

## Implementation Approach

### User Experience Flow
1. **New User Detection**: 
   - Check localStorage for `tutorialCompleted` flag
   - If not present, show tutorial after game setup screen

2. **Tutorial Steps** (5 steps total):
   - **Step 1: Welcome** - Game overview and goals
   - **Step 2: Game Interface** - Explain main UI sections (Control Panel, Orbit Visualization, Stats Panel)
   - **Step 3: Launching Assets** - How to launch satellites and ADR vehicles
   - **Step 4: Game Management** - Time controls, monitoring debris, budget management
   - **Step 5: Resources** - Where to find help (Documentation, Analytics, Configuration tabs)

3. **Tutorial Controls**:
   - "Next" button to advance
   - "Skip Tutorial" button on all steps
   - "Previous" button (after step 1)
   - Progress indicator showing current step (1/5, 2/5, etc.)

4. **Completion**:
   - On completion or skip, set `tutorialCompleted: true` in localStorage
   - Close tutorial modal and allow user to play

### Tutorial Content Strategy
- **Concise**: Each step should have 2-3 key points
- **Visual**: Highlight relevant UI areas (optional - could use positioning/arrows)
- **Goals-oriented**: Focus on "what you need to know to succeed"
- **Non-blocking**: Easy to skip or dismiss

### Component Architecture

**New Components to Create**:
```
src/components/Tutorial/
├── TutorialModal.tsx          # Main tutorial container
├── TutorialStep.tsx           # Individual step renderer
├── TutorialProgress.tsx       # Progress indicator (1/5, 2/5, etc.)
└── tutorialContent.ts         # Tutorial step content definitions
```

**State Management**:
```typescript
// Add to uiSlice.ts
interface UIState {
  // ... existing state
  tutorialActive: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;
}
```

---

## Source Code Structure

### Files to Create

#### 1. `src/components/Tutorial/TutorialModal.tsx`
**Purpose**: Main tutorial modal component
**Responsibilities**:
- Render tutorial overlay
- Handle step navigation (next, previous, skip)
- Manage tutorial completion
- Integrate with Redux state

**Key Features**:
- Full-screen modal similar to `GameOverModal`
- Step navigation controls
- Progress indicator
- Backdrop click to close (with confirmation)

#### 2. `src/components/Tutorial/TutorialStep.tsx`
**Purpose**: Render individual tutorial step content
**Props**:
```typescript
interface TutorialStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  content: React.ReactNode;
}
```

#### 3. `src/components/Tutorial/TutorialProgress.tsx`
**Purpose**: Visual progress indicator
**Display**: Simple text or progress bar showing "Step X of Y"

#### 4. `src/components/Tutorial/tutorialContent.ts`
**Purpose**: Define all tutorial step content
**Structure**:
```typescript
export interface TutorialStepContent {
  title: string;
  points: string[];
  emoji?: string;
}

export const TUTORIAL_STEPS: TutorialStepContent[] = [
  // Step 1: Welcome
  // Step 2: Game Interface
  // Step 3: Launching Assets
  // Step 4: Game Management
  // Step 5: Resources
];
```

### Files to Modify

#### 1. `src/store/slices/uiSlice.ts`
**Changes**:
- Add tutorial state properties
- Add actions: `startTutorial()`, `nextTutorialStep()`, `previousTutorialStep()`, `skipTutorial()`, `completeTutorial()`
- Load/save tutorial completion status from localStorage

#### 2. `src/App.tsx`
**Changes**:
- Import and conditionally render `<TutorialModal />`
- Show tutorial after game setup screen (when `gameStarted === true` and `!tutorialCompleted`)

#### 3. `src/game/types.ts` (if needed)
**Changes**:
- Add tutorial-related type definitions if not covered in UIState

---

## Data Model / Interface Changes

### New TypeScript Interfaces

```typescript
// Tutorial step content
export interface TutorialStepContent {
  title: string;
  description: string;
  points: string[];
  emoji?: string;
}

// UI State additions (in uiSlice.ts)
interface UIState {
  // ... existing properties
  tutorialActive: boolean;
  tutorialStep: number;        // Current step (0-indexed)
  tutorialCompleted: boolean;  // Loaded from localStorage
}

// Actions
export interface TutorialActions {
  startTutorial: () => void;
  nextTutorialStep: () => void;
  previousTutorialStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
}
```

### LocalStorage Keys
- `tutorialCompleted`: `'true' | 'false'` - Whether user has completed/skipped tutorial

---

## Tutorial Content Outline

### Step 1: Welcome
**Title**: Welcome to Space Debris Removal!
**Content**:
- 🎯 **Goal**: Manage Earth's orbital space by launching satellites and removing debris
- ⚠️ **Challenge**: Prevent Kessler Syndrome - a catastrophic debris cascade
- 📊 **Success Criteria**: Maximize score through smart satellite launches, debris cleanup, and budget management
- ⏱️ **Duration**: Survive as long as possible (max 100 turns)

### Step 2: Game Interface
**Title**: Understanding the Game Interface
**Content**:
- 🎮 **Control Panel** (Left): Launch satellites and Active Debris Removal (ADR) vehicles
- 🌍 **Orbit Visualization** (Center): Watch objects orbit Earth in real-time across 4 layers (LEO/MEO/GEO/GRAVEYARD)
- 📈 **Stats Panel** (Right): Monitor budget, debris count, collision risk, and event log
- 📑 **Navigation Tabs**: Access Analytics, Missions, Configuration, and Documentation

### Step 3: Launching Assets
**Title**: How to Launch Satellites & ADR Vehicles
**Content**:
- 🛰️ **Satellites**: Choose purpose (Weather/Comms/GPS), orbit (LEO/MEO/GEO), and insurance level
  - Generate revenue every turn based on type
  - Different launch costs and lifespans per orbit
- 🚀 **ADR Vehicles**: Deploy cleanup vehicles to remove debris
  - **Cooperative ADR**: Standard debris removal (2-3 pieces/turn)
  - **Uncooperative ADR**: High-capacity removal (6-9 pieces/turn)
  - **GeoTug**: Move satellites to GRAVEYARD orbit
  - **Servicing Vehicle**: Extend satellite/ADR lifespan by 50%

### Step 4: Game Management
**Title**: Managing Your Space Operations
**Content**:
- ⏸️ **Time Controls**: Pause, Normal speed, or Fast forward (2s auto-advance)
- 🎯 **Monitor Debris**: Watch debris levels - deploy ADR vehicles before cascade threshold (250 pieces)
- 💰 **Budget Management**: Track income from satellites vs costs of launches and ADR operations
- ⚡ **Random Events**: Solar storms can remove debris or damage satellites

### Step 5: Resources & Tips
**Title**: Where to Find Help
**Content**:
- 📖 **Documentation Tab**: Detailed guides on satellites, ADR vehicles, scoring, and game mechanics
- 📊 **Analytics Tab**: Charts tracking debris, satellites, and removal operations over time
- 🎯 **Missions Tab**: Complete objectives for bonus points and achievements
- ⚙️ **Configuration Tab**: Customize game difficulty and mechanics
- 💡 **Pro Tip**: Start with a few satellites to generate revenue, then deploy ADR vehicles proactively to manage debris before it cascades!

---

## Verification Approach

### Manual Testing
1. **First-time User Flow**:
   - Clear browser localStorage
   - Start new game
   - Verify tutorial appears after setup screen
   - Navigate through all 5 steps
   - Verify completion saves to localStorage

2. **Returning User Flow**:
   - With `tutorialCompleted=true` in localStorage
   - Start new game
   - Verify tutorial does NOT appear

3. **Skip Functionality**:
   - Start tutorial
   - Click "Skip Tutorial" on any step
   - Verify tutorial closes and marks as completed

4. **Navigation**:
   - Test "Next" button on each step
   - Test "Previous" button (should be disabled on step 1)
   - Test progress indicator updates correctly

### Automated Testing
```bash
npm run test
```

**Test Cases**:
- `TutorialModal.test.tsx`:
  - Renders correctly on first step
  - Navigation buttons work correctly
  - Skip button marks tutorial as completed
  - Previous button disabled on first step
  - Next button advances steps
  - Completion on last step saves to localStorage

### Code Quality
```bash
npm run lint      # ESLint checks
npm run build     # TypeScript compilation
```

**Quality Checks**:
- No TypeScript errors
- No ESLint warnings
- Consistent styling with existing components
- Accessibility (keyboard navigation, ARIA labels)

---

## Implementation Considerations

### Design Decisions
1. **Modal vs Inline**: Using modal overlay (like GameOverModal) for better focus and consistency
2. **When to Show**: After game setup screen (not before) so user has context
3. **Persistence**: LocalStorage for simplicity (matches existing pattern)
4. **Content Length**: 5 concise steps to avoid overwhelming users
5. **Skippable**: Always allow users to skip - respect user agency

### Edge Cases
- User closes browser during tutorial → Tutorial state persisted in localStorage
- User clicks outside modal → Require explicit "Skip" or "Next" action
- User returns after skipping → Tutorial doesn't reappear (completed=true)
- Tutorial reset mechanism → Could add to Configuration tab or clear localStorage manually

### Accessibility
- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus management when modal opens/closes
- Clear visual hierarchy and contrast

### Performance
- Minimal impact (single modal component)
- No animations that could cause lag
- LocalStorage reads are synchronous but fast

---

## Future Enhancements (Out of Scope)
- Interactive tutorial with game simulation
- Video walkthrough option
- "Replay Tutorial" option in Settings/Configuration
- Contextual tooltips on first interaction with UI elements
- Multi-language support
- Different tutorial tracks for different difficulty levels
