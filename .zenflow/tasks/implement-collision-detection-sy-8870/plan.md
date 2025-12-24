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

### [x] Step: Implement Collision Detection Functions
<!-- chat-id: 139dabe3-6638-4074-931d-a25e88266a96 -->

Implement core collision detection logic in `src/game/engine/collision.ts`:
- Add `detectCollisions()` function to check distance between objects
- Implement layer-based filtering and threshold comparison
- Return collision pairs for processing

**Verification**: TypeScript compilation passes, no type errors

---

### [ ] Step: Implement Debris Generation Logic

Extend `src/game/engine/collision.ts` with debris generation:
- Add `generateDebrisFromCollision()` function
- Generate 5 debris pieces per collision at satellite position
- Implement 70/30 cooperative/uncooperative type distribution
- Ensure debris stays within layer bounds

**Verification**: TypeScript compilation passes, bounds logic is correct

---

### [ ] Step: Add processCollisions Redux Action

Update `src/store/slices/gameSlice.ts`:
- Add `processCollisions` reducer action
- Integrate collision detection and debris generation functions
- Remove destroyed satellites from state
- Add generated debris to state
- Calculate and add insurance payouts to budget
- Export action in actions list

**Verification**: Redux state updates correctly, no mutations outside reducer

---

### [ ] Step: Verification and Testing

Run build and lint checks, perform manual testing:
1. Run `npm run build` - ensure clean build
2. Run `npm run lint` - ensure no linting errors
3. Start dev server and test collision scenarios
4. Verify edge cases (multiple collisions, boundary conditions)
5. Write completion report to `{@artifacts_path}/report.md`

**Report includes**: What was implemented, testing approach, challenges encountered
