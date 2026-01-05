# Technical Specification: Log User Activity

## Difficulty Assessment
**Complexity**: Easy

This is a straightforward feature following an established pattern in the codebase. The high scores system already implements the exact same architecture (Upstash KV + API endpoint + client utility), which we'll replicate for logging plays.

---

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **Frontend**: React 19.2.0 with Redux Toolkit
- **Backend**: Vercel Serverless Functions
- **Database**: Upstash Redis (KV store)

### Dependencies
- `@upstash/redis`: ^1.36.0 (already installed)
- `@vercel/node`: ^5.5.16 (already installed)

### Environment Variables
Uses the same Upstash Redis credentials as high scores:
- `UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL`
- `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN`

---

## Implementation Approach

### Architecture Pattern
Follow the existing high scores implementation pattern:
1. **API Endpoint**: Vercel serverless function (`kessler-game/api/plays.ts`)
2. **Client Utility**: Frontend helper functions (`kessler-game/src/utils/plays.ts`)
3. **Integration Point**: Call from game initialization in Redux slice

### Data Model

#### Play Record
```typescript
interface PlayRecord {
  playerName: string;
  date: string;  // ISO 8601 format
}
```

### Storage Strategy
Unlike high scores which use a sorted set (ZSET) for ranking, plays will use a **list** data structure:
- **Database**: upstash-kv-orange-umbrella (Upstash Redis instance name in dashboard)
- **Key**: `"plays"` (the Redis key within the instance)
- **Operation**: `LPUSH` (add to beginning of list)
- **Retrieval**: `LRANGE` (get most recent plays)
- **Limit**: Optionally implement a maximum (e.g., keep last 1000 plays)

**Note**: The database name is configured via environment variables (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`). No code changes needed for the database name - the existing credentials already connect to upstash-kv-orange-umbrella.

### Development vs Production
- **Development**: Use localStorage (key: `"kessler-plays"`)
- **Production**: Use Upstash Redis via API endpoint

---

## Source Code Changes

### New Files

#### 1. `kessler-game/api/plays.ts`
Vercel serverless function to handle play logging.

**Endpoints**:
- `POST /api/plays` - Log a new play
  - Request body: `{ playerName: string, date: string }`
  - Response: `{ success: true }`
- `GET /api/plays` - Retrieve play records (optional, for future analytics)
  - Query params: `?limit=100` (default 100, max 1000)
  - Response: `PlayRecord[]`

**Features**:
- CORS headers for client access
- Redis connection with fallback to legacy env vars
- Error handling
- Optional list size limiting (trim to max 1000 entries)

#### 2. `kessler-game/src/utils/plays.ts`
Client-side utility functions.

**Note**: Using `plays.ts` for consistency with simple, descriptive naming. The existing `highScores.ts` uses camelCase, but `plays` is a simple plural noun that reads well in lowercase.

**Functions**:
- `logPlay(playerName: string): Promise<void>` - Log a play with current timestamp
- `getPlays(limit?: number): Promise<PlayRecord[]>` - Retrieve play records (optional)

**Features**:
- Development mode uses localStorage
- Production mode uses API endpoint
- Automatic date generation (ISO 8601)
- Error handling with console logging

### Modified Files

#### 1. `kessler-game/src/components/Setup/GameSetupScreen.tsx`
Add play logging when the game starts.

**Changes**:
- Import `logPlay` from `../../utils/plays`
- Call `logPlay(playerName.trim())` in `handleStart` function after dispatching actions
- Fire-and-forget pattern (async, non-blocking)

**Integration Pattern Comparison**:
- **High Scores**: Saved at game end in `GameOverModal.tsx` (async, fire-and-forget)
- **Plays**: Logged at game start in `GameSetupScreen.tsx` (async, fire-and-forget)
- **Both**: Called from React components (NOT reducers - reducers must be pure functions)

---

## Data Model / API / Interface Changes

### Type Definitions
```typescript
// kessler-game/api/plays.ts & kessler-game/src/utils/plays.ts
export interface PlayRecord {
  playerName: string;
  date: string;
}
```

### API Endpoints
- **POST** `/api/plays` - Create play record
- **GET** `/api/plays?limit=100` - Retrieve play records (optional)

### Redux State
No changes to Redux state required. Play logging is a side effect.

---

## Verification Approach

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to game setup screen
3. Enter player name and start a new game
4. **Development**: Check localStorage for `kessler-plays` entry
5. **Production**: Check Upstash dashboard for `plays` list entries

### Testing Checklist
- [ ] Play record is logged when game starts
- [ ] Player name is correctly stored
- [ ] Date is in ISO 8601 format
- [ ] Development mode uses localStorage
- [ ] Production mode uses Upstash KV
- [ ] API endpoint handles CORS correctly
- [ ] Error handling works (database unavailable)
- [ ] List doesn't grow unbounded (if limit implemented)

### Build & Lint
```bash
npm run build
npm run lint
```

### Production Verification
1. Deploy to Vercel
2. Start a game with test player name
3. Check Upstash Console:
   - Navigate to upstash-kv-orange-umbrella database
   - Run command: `LRANGE plays 0 10`
   - Verify play records are stored correctly

---

## Implementation Notes

### Key Considerations
1. **Non-blocking**: Play logging should not block game initialization
2. **Fire-and-forget**: If logging fails, game should still start
3. **Privacy**: Only store player name and date (no IP addresses or identifying info)
4. **Storage limit**: Consider implementing max list size to prevent unbounded growth

### Error Handling
- Log errors to console but don't surface to user
- Game should always start even if play logging fails
- Return gracefully if database is unavailable

### Future Enhancements
- Analytics dashboard to view play statistics
- Player activity trends
- Most active players
- Play count by date/time
