# Technical Specification: User Feedback Feature

## Task Complexity
**Medium** - This involves creating a new API endpoint, updating UI components, and integrating with an existing database, but follows well-established patterns in the codebase.

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **Frontend**: React 19 with Redux Toolkit for state management
- **Styling**: TailwindCSS 4.1
- **Backend**: Vercel Serverless Functions
- **Database**: Upstash Redis (already configured)
- **Build Tool**: Vite

### Existing Dependencies
- `@upstash/redis`: ^1.36.0 (already installed)
- `@vercel/node`: ^5.5.16 (already installed)
- React, Redux Toolkit, TailwindCSS (already installed)

## Implementation Approach

### 1. Data Model
Create a feedback interface that captures:
- Player name (from game state)
- Enjoyment rating (1-5)
- Learning rating (1-5)
- User category (Student, Educator, Professional, Retired, Other)
- Comments (text)
- Timestamp
- Game context (score, grade, difficulty, turns survived)

### 2. API Endpoint
Create `/api/feedback.ts` following the existing pattern from `high-scores.ts` and `plays.ts`:
- POST endpoint to save feedback
- Store in Upstash Redis using a list (similar to plays)
- Include CORS headers for client access
- Validate input data
- Optional: GET endpoint for retrieving feedback (admin use)

### 3. Client-Side Utility
Create `/utils/feedback.ts` to handle feedback submission:
- Function to POST feedback data to the API
- Error handling and retry logic
- Follow patterns from existing `highScores.ts` and `plays.ts` utilities

### 4. UI Component Updates
Modify `GameOverModal.tsx` to include feedback form:
- Add feedback form section between statistics and action buttons
- Use TailwindCSS styling consistent with existing modal design
- Form fields:
  - **Q1**: Radio buttons or star rating for enjoyment (1-5)
  - **Q2**: Radio buttons or star rating for learning (1-5)
  - **Q3**: Dropdown/select for user category
  - **Q4**: Textarea for comments
- Submit button for feedback (optional)
- Form should be collapsible or optional (don't block "Play Again" or "View Analytics")
- Show success/error message after submission

### 5. User Experience Decisions
- **Optional submission**: Users can skip feedback and still play again or view analytics
- **Inline form**: Feedback form appears as a section within the Game Over modal
- **Single submission**: Prevent duplicate submissions per game session
- **Visual feedback**: Show success message after submission

## Source Code Structure

### Files to Create
1. **`kessler-game/api/feedback.ts`**
   - Vercel serverless function
   - POST handler to save feedback
   - Optional GET handler for admin retrieval

2. **`kessler-game/src/utils/feedback.ts`**
   - Client utility to submit feedback
   - TypeScript interface for feedback data
   - Error handling

### Files to Modify
1. **`kessler-game/src/components/GameOver/GameOverModal.tsx`**
   - Add feedback form UI
   - Integrate feedback submission
   - Handle form state and validation

## Data Model Details

### Feedback Interface
```typescript
interface Feedback {
  playerName: string;
  enjoymentRating: 1 | 2 | 3 | 4 | 5;
  learningRating: 1 | 2 | 3 | 4 | 5;
  userCategory: 'Student' | 'Educator' | 'Professional' | 'Retired' | 'Other';
  comments: string;
  timestamp: string;
  gameContext: {
    score: number;
    grade: string;
    difficulty: string;
    turnsSurvived: number;
  };
}
```

### Redis Storage
- **Key**: `feedback` (list)
- **Operation**: `LPUSH` to add new feedback
- **Limit**: Store up to 10,000 feedback entries (configurable)
- **Trim**: Use `LTRIM` to maintain size limit

## API Interface

### POST /api/feedback
**Request Body:**
```json
{
  "playerName": "string",
  "enjoymentRating": 1-5,
  "learningRating": 1-5,
  "userCategory": "Student|Educator|Professional|Retired|Other",
  "comments": "string",
  "timestamp": "ISO8601 string",
  "gameContext": {
    "score": "number",
    "grade": "string",
    "difficulty": "string",
    "turnsSurvived": "number"
  }
}
```

**Response:**
- Success: `201 Created` with `{ success: true }`
- Error: `400 Bad Request` or `500 Internal Server Error`

## Verification Approach

### 1. Type Checking
```bash
npm run build
```
- Ensure TypeScript compilation succeeds
- No type errors in new or modified files

### 2. Linting
```bash
npm run lint
```
- Ensure ESLint passes for all modified files

### 3. Manual Testing
- Launch game and reach Game Over screen
- Fill out feedback form with various inputs
- Verify submission success message
- Test with empty fields (comments optional)
- Test required field validation
- Verify feedback is stored in Upstash
- Test that users can skip feedback and still use other buttons

### 4. Edge Cases
- Test with missing playerName
- Test with invalid rating values
- Test network failures during submission
- Test duplicate submission prevention

## Implementation Notes

### Design Consistency
- Match existing modal styling (dark theme, gradient accents)
- Use existing color scheme (slate, purple, blue gradients)
- Follow button styling patterns from existing modal
- Use similar spacing and typography

### Form Validation
- Ratings must be 1-5
- User category must be one of the predefined options
- Comments are optional (can be empty string)
- PlayerName comes from game state (already validated)

### Error Handling
- Network errors: Show user-friendly message
- Validation errors: Show inline field errors
- Server errors: Log to console, show generic error message
- Don't block game flow on feedback failure
