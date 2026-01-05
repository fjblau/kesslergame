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
<!-- chat-id: 5661d1bf-15b9-41d8-b778-d9a4b65d0573 -->

**Complexity**: Medium

Technical specification created at `.zenflow/tasks/user-feedback-9346/spec.md`

---

### [x] Step: Create Feedback TypeScript Types and Utility
<!-- chat-id: 70356381-8f91-47fa-a133-e2ba2d7cf314 -->

Create the client-side feedback interface and utility function:
- Define `Feedback` interface in `kessler-game/src/utils/feedback.ts`
- Implement `submitFeedback()` function following patterns from `highScores.ts` and `plays.ts`
- Include proper error handling and TypeScript types

**Verification**: TypeScript compilation passes (`npm run build`)

---

### [x] Step: Create Feedback API Endpoint
<!-- chat-id: eda199a7-abf0-4d34-8b5e-24099974e00c -->

Create the serverless API endpoint:
- Create `kessler-game/api/feedback.ts` following the pattern from `high-scores.ts` and `plays.ts`
- Implement POST handler to save feedback to Upstash Redis
- Add CORS headers and input validation
- Store feedback in a Redis list with size limit

**Verification**: TypeScript compilation passes, endpoint structure matches existing API files

---

### [x] Step: Update Game Over Modal UI
<!-- chat-id: 8902d71e-3ad9-41cb-95e8-4c46cb0bb359 -->

Modify the Game Over modal to include feedback form:
- Add feedback form section in `GameOverModal.tsx`
- Implement form fields for all 4 questions (enjoyment rating, learning rating, user category, comments)
- Add submit button and success/error messaging
- Ensure form is optional and doesn't block game flow
- Style consistently with existing modal design

**Verification**: Visual inspection, TypeScript compilation, ESLint passes

---

### [x] Step: Test and Verify
<!-- chat-id: 2f55333b-04c5-407a-972b-cd9e88c99fab -->

Run verification steps:
- Run `npm run build` to check TypeScript compilation
- Run `npm run lint` to check code style
- Manual testing of feedback submission
- Test edge cases (empty fields, network errors, duplicate submissions)
- Verify feedback is stored in Upstash

**Verification**: All tests pass, feedback successfully saved to database

---

### [ ] Step: Create Implementation Report

Write completion report to `.zenflow/tasks/user-feedback-9346/report.md`:
- What was implemented
- How the solution was tested
- Any challenges encountered
