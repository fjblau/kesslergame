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
<!-- chat-id: 6f02d58f-c629-46ca-b504-bf4cf3b078c9 -->

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

### [x] Step: Phase 1 Implementation

Implement the 5 core interactive inputs according to `phase1-spec.md`.

**Inputs to Implement**:
1. Game Speed Selector (Time Control)
2. Insurance Tier Selector (Budget Management)
3. DRV Target Priority (DRV Configuration)
4. Satellite Purpose Selector (Satellite Config)
5. Budget Difficulty Modifier (Game Setup)

**Implementation Order**:
1. Data model updates (types, constants, slices)
2. Core components (Insurance, Purpose, DRV Priority)
3. Game logic updates (collision, debris removal, launch actions)
4. UI controls (Game Speed)
5. Setup screen (Budget Difficulty)
6. Integration & testing

**Deliverables**:
- 11 new files
- 8 modified files
- All tests passing
- Manual verification complete
- Report written to `{@artifacts_path}/report.md`
