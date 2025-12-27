# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: 1c917a65-1780-4295-8248-c052376917bc -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step 1: Core Scoring Logic
<!-- chat-id: 6996e84e-5d27-475d-8a01-c566eba28d34 -->

Create the scoring calculation functions and type definitions.

- Add ScoreState interface to `src/game/types.ts`
- Create `src/game/scoring.ts` with all scoring calculation functions:
  - `calculateSatelliteLaunchScore()`
  - `calculateDebrisRemovalScore()`
  - `calculateSatelliteRecoveryScore()`
  - `calculateBudgetManagementScore()`
  - `calculateSurvivalScore()`
  - `calculateTotalScore()`
- Add SCORE_CONFIG constants

**Verification**: TypeScript compilation succeeds, lint passes

---

### [ ] Step 2: Redux Score Slice

Create and integrate the score state management.

- Create `src/store/slices/scoreSlice.ts` with reducers and selectors
- Add score reducer to `src/store/index.ts`
- Implement actions: `calculateScore`, `incrementSatellitesRecovered`, `resetScore`

**Verification**: Store compiles without errors, Redux DevTools shows score state

---

### [ ] Step 3: Track Satellite Recoveries

Modify DRV operations to track satellite recoveries separately.

- Update `src/game/engine/debrisRemoval.ts` to expose satellite removal counts
- Modify `processDRVOperations` in `src/store/slices/gameSlice.ts` to increment satellitesRecovered
- Add satellitesRecovered field to ScoreState

**Verification**: Satellite recoveries increment separately from debris removal

---

### [ ] Step 4: Hook Score Updates into Game Loop

Integrate score calculation into game actions.

- Add `calculateScore()` dispatches in gameSlice reducers:
  - `advanceTurn`
  - `launchSatellite`
  - `launchDRV`
  - `processDRVOperations`
  - `processCollisions`
  - `spendBudget` / `addBudget`
- Add `resetScore()` call in `initializeGame`

**Verification**: Score updates in Redux DevTools when actions are dispatched

---

### [ ] Step 5: Score Display Component

Create UI component for compact score display.

- Create `src/components/Score/ScoreDisplay.tsx` - compact score widget
- Create `src/components/Score/ScoreBreakdown.tsx` - detailed breakdown modal
- Style components with Tailwind CSS matching existing design

**Verification**: Components render without errors in isolation

---

### [ ] Step 6: Integrate Score into StatsPanel

Add score display to the game UI.

- Modify `src/components/StatsPanel/StatsPanel.tsx` to include ScoreDisplay
- Position score below risk level display
- Ensure responsive layout

**Verification**: Score displays correctly in game, updates in real-time

---

### [ ] Step 7: Enhance GameOver Modal

Add final score display to game over screen.

- Modify `src/components/GameOver/GameOverModal.tsx`
- Add total score display with prominent styling
- Add score breakdown by category
- Optional: Add grade/rank based on score

**Verification**: Final score shows correctly when game ends

---

### [ ] Step 8: Testing and Polish

Test the complete scoring system and fix any issues.

- Run `npm run lint` and fix any errors
- Run `npm run build` and ensure TypeScript compilation succeeds
- Manual testing checklist:
  - Launch satellites → score increases
  - Remove debris → debris removal score increases
  - Recover satellites → satellite recovery score increases
  - Budget changes → budget score updates
  - Advance turns → survival score increases
  - Game over → final score displays
- Adjust scoring weights if needed for balance

**Verification**: All linting/build checks pass, manual testing confirms all scoring features work

---

### [ ] Step 9: Final Report

Write completion report documenting the implementation.

- Create `{@artifacts_path}/report.md` describing:
  - What was implemented
  - How the solution was tested
  - Any challenges encountered
  - Scoring weights and formula used
