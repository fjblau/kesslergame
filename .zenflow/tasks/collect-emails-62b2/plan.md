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
<!-- chat-id: 019bdb62-582f-48f9-a263-3dfd9a14dd37 -->

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

### [x] Step: Implementation
<!-- chat-id: 5730b9e3-5d64-4fb5-b9a7-c133f91abdf0 -->

✅ COMPLETED

QR Code certificate retrieval system has been successfully implemented and all critical review issues fixed:

**Initial Implementation:**
1. ✅ Installed dependencies (qrcode, react-router-dom, uuid)
2. ✅ Created API endpoints for certificate storage and retrieval
3. ✅ Implemented QR code generation and display components
4. ✅ Added certificate retrieval page with routing
5. ✅ Updated GameOverModal with QR code option
6. ✅ All linting checks passed
7. ✅ Build successful

**Critical Fixes Applied:**
1. ✅ Fixed routing architecture - certificate route now accessible externally
2. ✅ Fixed Redis connection pattern - consistent with existing endpoints
3. ✅ Added error UI feedback - users now see save failures
4. ✅ Enhanced input validation - comprehensive field checking
5. ✅ Restricted CORS in production - origin-based instead of wildcard
6. ✅ Created .env.example - documented environment variables

The implementation follows the QR code specification and provides:
- Certificate storage in Redis with 90-day TTL
- QR code generation for mobile-friendly retrieval
- Dual download options (immediate + QR code for later)
- Certificate retrieval page at /certificate/:id route
- Production-ready with proper error handling and security

See reports:
- Implementation: `{@artifacts_path}/implementation-report.md`
- Code fixes: `{@artifacts_path}/fixes-report.md`
