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

### [x] Step: Install Framer Motion
<!-- chat-id: f5e3d939-d0c6-43ef-87bf-a0006a97fdd6 -->

Install framer-motion package as a dependency.

**Verification**: Check package.json includes framer-motion dependency

---

### [x] Step: Create Animation Effect Components
<!-- chat-id: 4c75fc30-951a-4c3c-a8a9-6c6636dfc7ad -->

Create new components for visual effects:
1. `CollisionEffect.tsx` - Expanding circle + flash effect
2. `LaunchAnimation.tsx` - Trail from Earth to target orbit
3. `SolarStormEffect.tsx` - Full-screen storm overlay

**Verification**: Components compile without errors, accept correct props

---

### [x] Step: Add Orbital Rotation to Sprite Components
<!-- chat-id: 68cfbfb3-2792-43b6-aab8-eeb94fc70efb -->

Update sprite components to use Framer Motion:
1. Convert `SatelliteSprite.tsx` to use `motion.div` with rotation
2. Convert `DebrisParticle.tsx` to use `motion.div` with rotation
3. Convert `DRVSprite.tsx` to use `motion.div` with rotation

Each sprite should rotate based on entity's x-coordinate (x/100 * 360°).

**Verification**: Entities visibly rotate around orbits when x-coordinate changes

---

### [ ] Step: Add Launch Animations

Implement launch animation sequence:
1. Detect newly launched entities by tracking IDs
2. Apply initial state (center position, scale 0.5, opacity 0)
3. Animate to target orbit position over 1.5s with ease-out-cubic

**Verification**: New satellites/DRVs smoothly animate from Earth to orbit

---

### [ ] Step: Integrate Collision Flash Effects

Add collision effect rendering:
1. Subscribe to collision events from Redux store
2. Render `CollisionEffect` component at collision coordinates
3. Auto-remove effect after animation completes

**Verification**: Collision events trigger visible flash animation

---

### [ ] Step: Add Debris Spawn Animation

Implement spawn animation for debris:
1. Apply initial state (scale 0, opacity 0)
2. Animate to normal state with 0.3s ease-out

**Verification**: New debris pieces fade/scale in smoothly

---

### [ ] Step: Integrate Solar Storm Effect (Optional)

If solar storm events are triggerable:
1. Subscribe to solar-storm events
2. Render `SolarStormEffect` overlay
3. Remove after animation completes

**Verification**: Solar storm events trigger full-screen effect

---

### [ ] Step: Testing and Performance Verification

1. Run build and lint commands
2. Manual testing:
   - Launch multiple satellites across all layers
   - Verify smooth rotation at different speeds per layer
   - Trigger collisions, verify flash effects
   - Test with 50+ entities for performance
3. Write report to `{@artifacts_path}/report.md`

**Verification**: Build passes, no lint errors, animations perform smoothly
