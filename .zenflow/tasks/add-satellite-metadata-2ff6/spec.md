# Technical Specification: Add Satellite Metadata

## Complexity Assessment
**Difficulty**: Medium

This task requires:
- Data conversion and integration (CSV → TypeScript data structure)
- Extending existing type definitions and state management
- Modifying game logic to track and assign unique satellites
- Updating multiple event logging locations to include metadata
- Ensuring proper state management across game resets

## Technical Context

### Language & Framework
- **Language**: TypeScript
- **Framework**: React with Redux Toolkit
- **Build Tool**: Vite
- **State Management**: Redux Toolkit with slices

### Dependencies
No new dependencies required. Will use existing:
- `@reduxjs/toolkit` for state management
- React hooks for component integration

## Data Source Analysis

### CSV Structure (`satellites.csv`)
- **Location**: `/Users/frankblau/Downloads/satellites.csv`
- **Total records**: 794 satellites
- **Columns**: 
  - `name`: Satellite name (e.g., "Meteosat-11", "Starlink-1001", "GPS III SV01")
  - `country`: Country of origin (e.g., "Germany", "USA", "Japan", "China", "India")
  - `type`: Satellite type - "Weather", "Comms", or "GPS"
  - `weight_kg`: Weight in kilograms (numeric)
  - `launch_vehicle`: Launch vehicle name (e.g., "Falcon 9", "Ariane 5", "Long March 3B")
  - `launch_site`: Launch site location (e.g., "Cape Canaveral", "Kourou", "Xichang")

### Type Distribution
- **Weather**: 234 satellites
- **Comms**: 322 satellites  
- **GPS**: 238 satellites
- **Total**: 794 satellites

## Implementation Approach

### 1. Data Conversion & Storage

**Convert CSV to TypeScript data**:
- Manually convert the CSV file to a TypeScript data structure (or parse programmatically)
- Store as `kessler-game/src/game/satelliteMetadata.ts` (at project root, matching existing pattern)
- Export as a typed array with interface matching CSV structure

**Data Interface**:
```typescript
interface SatelliteMetadata {
  name: string;
  country: string;
  type: SatelliteType; // 'Weather' | 'Comms' | 'GPS'
  weight_kg: number;
  launch_vehicle: string;
  launch_site: string;
}
```

### 2. Type System Updates

**Extend Satellite Interface** (`src/game/types.ts`):
```typescript
export interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;
  inGraveyard?: boolean;
  radius: number;
  captureRadius?: number;
  // NEW FIELDS:
  metadata?: {
    name: string;
    country: string;
    weight_kg: number;
    launch_vehicle: string;
    launch_site: string;
  };
}
```

### 3. State Management Updates

**Extend GameState** (`src/game/types.ts`):
```typescript
export interface GameState {
  // ... existing fields
  availableSatellitePool: SatelliteMetadata[];  // Pool of unassigned satellites
}
```

**State Management Requirements**:
- Add `availableSatellitePool` to `initialState` constant in `gameSlice.ts`
- Since `initializeGame` spreads `initialState`, this automatically handles game initialization
- `resetGame` explicitly resets the pool from full metadata
- Remove assigned satellite from pool when launching
- Filter pool by satellite type when assigning

### 4. Game Logic Modifications

**File: `src/store/slices/gameSlice.ts`**

**Update `launchSatellite` reducer**:
- Before creating satellite, find matching metadata from pool
- Filter available satellites by the requested `purpose` type
- Randomly select one from the filtered list
- Remove selected satellite from `availableSatellitePool`
- Attach metadata to the satellite object
- Handle edge case: if pool exhausted for a type, allow launch without metadata

**Update `initializeGame` reducer**:
- Reset `availableSatellitePool` from full metadata list

**Update `resetGame` reducer**:
- Reset `availableSatellitePool` from full metadata list

### 5. Event Logging Updates

**Locations requiring metadata inclusion**:

1. **Satellite Launch** (`src/store/slices/eventSlice.ts`, line 68-76):
   - Update to include satellite name and country in message
   - Add metadata to event details

2. **Collision Events** (`src/hooks/useGameSpeed.ts`, line 94-100):
   - Find satellites involved in collision by checking `collision.objectIds`
   - Include satellite metadata in event message if satellite was involved
   - Update details object with satellite metadata

3. **Debris Removal/Capture** (`src/hooks/useGameSpeed.ts`, line 76-84):
   - When cooperative DRV captures satellites, include satellite metadata
   - Access satellite being removed to get metadata
   - Update event message format

4. **Graveyard Moves** (needs to be added):
   - Currently tracked in `state.recentGraveyardMoves` but not logged to events
   - Add event logging in `useGameSpeed.ts` after DRV operations
   - Include satellite metadata in graveyard move events

### 6. Event Message Formats

**Enhanced message examples** (with extended metadata):
- **Launch**: `"Launched GPS satellite 'QZSS-2' (Japan, 4000 kg, H-IIA from Tanegashima) in MEO orbit"`
- **Collision**: `"Collision in LEO orbit involving 'Starlink-1234' (USA, 260 kg, Falcon 9) - debris created"`
- **Capture**: `"Cooperative DRV captured satellite 'Meteosat-11' (Germany, 2100 kg, Ariane 5 from Kourou) in GEO orbit"`
- **Graveyard**: `"GeoTug moved 'GOES-16' (USA, 2857 kg, Atlas V from Cape Canaveral) to graveyard orbit"`

**Alternative shorter format** (if messages too long):
- **Launch**: `"Launched GPS satellite 'QZSS-2' (Japan, 4000 kg) in MEO orbit"`
- Include full metadata in `details` object only

## Source Code Changes

### Files to Create
1. **`kessler-game/src/game/satelliteMetadata.ts`**
   - TypeScript file with satellite metadata array (converted from CSV)
   - Exported constant and type definition
   - Note: File placed in `src/game/` to match existing structure (no `data/` subfolder)

### Files to Modify
1. **`src/game/types.ts`**
   - Add `metadata` field to `Satellite` interface
   - Add `SatelliteMetadata` interface
   - Add `availableSatellitePool` to `GameState`

2. **`src/store/slices/gameSlice.ts`**
   - Import satellite metadata
   - Initialize `availableSatellitePool` in initial state
   - Update `initializeGame` to reset pool
   - Update `resetGame` to reset pool
   - Modify `launchSatellite` reducer to assign metadata from pool

3. **`src/store/slices/eventSlice.ts`**
   - Update satellite launch event message to include metadata

4. **`src/hooks/useGameSpeed.ts`**
   - Update collision event logging to include satellite metadata
   - Update debris removal event logging to include satellite metadata
   - Add graveyard move event logging with satellite metadata

### Optional Display Updates
If time permits, update UI components to display satellite metadata:
- **EventItem.tsx**: Show metadata in event items
- **SatelliteSprite.tsx**: Show satellite name on hover

## Data Model Changes

### Before
```typescript
{
  id: "abc123",
  purpose: "Weather",
  layer: "GEO",
  // ... other fields
}
```

### After
```typescript
{
  id: "abc123",
  purpose: "Weather",
  layer: "GEO",
  metadata: {
    name: "Meteosat-11",
    country: "Germany",
    weight_kg: 2100,
    launch_vehicle: "Ariane 5",
    launch_site: "Kourou"
  },
  // ... other fields
}
```

## Edge Cases & Considerations

1. **Pool Exhaustion**: If all satellites of a type are used, allow launch without metadata (degraded mode)
2. **Backward Compatibility**: Metadata field is optional to support existing saves
3. **Game Reset**: Pool must fully reset on game initialization
4. **Type Mismatch**: Ensure CSV type values exactly match SatelliteType enum
5. **Random Selection**: When multiple satellites of same type available, select randomly

## Verification Approach

### Manual Testing
1. **Launch satellites** of each type and verify unique metadata is assigned
2. **Verify pool management**: Launch multiple satellites of same type, ensure no duplicates
3. **Verify event logs**: Check that all event types include satellite metadata
4. **Game reset**: Verify pool resets properly between games
5. **Pool exhaustion**: Launch 234+ Weather satellites to test pool exhaustion behavior (Weather has smallest pool)

### Event Verification Checklist
- [ ] Satellite launch events show metadata
- [ ] Collision events show metadata for destroyed satellites
- [ ] Debris removal events show metadata for captured satellites  
- [ ] Graveyard move events show metadata
- [ ] All metadata fields (name, country, weight) appear correctly

### Code Quality
- Run `npm run lint` to check for TypeScript/ESLint errors
- Run `npm run build` to verify build succeeds
- Ensure type safety throughout (no `any` types)

## Performance Considerations

- Satellite pool size is moderate (794 items total), minimal performance concerns
- Pool lookup by type is O(n) but n is manageable (max 322 for Comms)
- Random selection from filtered pool is O(n) where n ≤ 322
- Array operations (filter, splice) are acceptable for this dataset size
- Consider using Map/Set grouped by type if performance becomes an issue (unlikely given typical game length)

## Future Enhancements (Out of Scope)

- Display satellite metadata in UI tooltips
- Add satellite metadata filters in event log
- Export game statistics with satellite details
- Add satellite metadata to scoring system
