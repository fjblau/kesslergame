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
<!-- chat-id: ce3f0c33-4a63-4abb-bc3e-cf185583c3f8 -->

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

### [x] Step: Create GameBoard directory and coordinate mapping utility
<!-- chat-id: 20712e8f-5a74-4396-a87b-96a03a67f2c7 -->

Create the GameBoard component directory and implement the coordinate transformation utility function.

**Tasks**:
- Create directory: `src/components/GameBoard/`
- Implement `mapToPixels()` helper function in OrbitVisualization.tsx
- Define orbit radii constants

**Verification**:
- TypeScript compiles without errors
- Coordinate mapping logic matches spec

---

### [ ] Step: Implement OrbitVisualization container component

Build the main visualization container with orbits and Earth.

**Tasks**:
- Create `OrbitVisualization.tsx`
- Connect to Redux store (satellites, debris, DRVs)
- Render 3 concentric orbit circles (LEO/MEO/GEO)
- Render orbit labels
- Render Earth in center
- Apply styling per wireframe

**Verification**:
- Component renders without errors
- Visual matches wireframe (orbits, Earth, labels)
- No console errors

---

### [ ] Step: Implement SatelliteSprite component

Create the satellite rendering component with purpose icons.

**Tasks**:
- Create `SatelliteSprite.tsx`
- Accept props: `satellite`, `x`, `y`
- Render purpose icon from SATELLITE_PURPOSE_CONFIG
- Apply absolute positioning
- Style with blue color (#60a5fa)

**Verification**:
- Satellites render at correct positions
- Purpose icons (☁️📡🛰️) display correctly
- TypeScript types are correct

---

### [ ] Step: Implement DebrisParticle component

Create the debris rendering component with cooperative/uncooperative variants.

**Tasks**:
- Create `DebrisParticle.tsx`
- Accept props: `debris`, `x`, `y`
- Conditional rendering based on debris.type
- Cooperative: gray dots (#9ca3af)
- Uncooperative: red dots (#ef4444)
- Apply smaller font size (12px)

**Verification**:
- Debris renders with correct colors
- Type differentiation works
- Positioning is accurate

---

### [ ] Step: Implement DRVSprite component

Create the DRV rendering component with pentagon shapes.

**Tasks**:
- Create `DRVSprite.tsx`
- Accept props: `drv`, `x`, `y`
- Render pentagon symbol: ⬟
- Conditional color based on removalType
- Cooperative: green (#34d399)
- Uncooperative: orange (#fb923c)

**Verification**:
- DRVs render as pentagons
- Colors match type correctly
- Positioning works

---

### [ ] Step: Integrate sprites into OrbitVisualization

Add sprite rendering to the main visualization component.

**Tasks**:
- Import all sprite components
- Map satellites array to SatelliteSprite components
- Map debris array to DebrisParticle components
- Map DRVs array to DRVSprite components
- Apply coordinate transformation to each entity

**Verification**:
- All entities render correctly
- State updates trigger re-renders
- No duplicate keys warning

---

### [ ] Step: Integrate OrbitVisualization into App.tsx

Add the visualization to the main app layout.

**Tasks**:
- Import OrbitVisualization in App.tsx
- Replace placeholder stats section (lines 40-73)
- Test with actual game state

**Verification**:
- Component appears in app
- Layout looks correct
- No breaking changes to existing features

---

### [ ] Step: Final verification and testing

Run linters, type checking, and manual testing.

**Tasks**:
- Run `npm run lint` and fix any issues
- Run `npm run build` for TypeScript type checking
- Manual testing:
  - Launch satellites → appear in correct orbits
  - Launch DRVs → render as pentagons
  - Trigger collisions → debris appears
  - Verify all sprite types render correctly
- Compare final output with wireframe
- Write completion report to `{@artifacts_path}/report.md`

**Verification**:
- ✅ All 4 component files created
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Visual matches wireframe
- ✅ State updates work correctly
