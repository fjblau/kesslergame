# Quick change

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

This is a quick change workflow for small or straightforward tasks where all requirements are clear from the task description.

### Your Approach

1. Proceed directly with implementation
2. Make reasonable assumptions when details are unclear
3. Do not ask clarifying questions unless absolutely blocked
4. Focus on getting the task done efficiently

This workflow also works for experiments when the feature is bigger but you don't care about implementation details.

If blocked or uncertain on a critical decision, ask the user for direction.

---

## Workflow Steps

### [x] Step: Implementation
<!-- chat-id: cbce7a9f-a3fe-42fa-8762-0c611847a0df -->

Implement the task directly based on the task description.

1. Make reasonable assumptions for any unclear details
2. Implement the required changes in the codebase
3. Add and run relevant tests and linters if applicable
4. Perform basic manual verification if applicable

Save a brief summary of what was done to `{@artifacts_path}/report.md` if significant changes were made.

**COMPLETED**: Updated documentation across spec.md, report.md, and kessler-game/README.md to reflect:
- Four orbital layers (added GRAVEYARD)
- Four DRV types (added GeoTug and Refueling)
- Three-tier insurance system
- Solar flare classification (A, B, C, M, X)
- Orbit-specific satellite lifespans
- Updated DRV costs and capabilities
- Max debris limit changed to 250
- Comprehensive report saved to artifacts/report.md
