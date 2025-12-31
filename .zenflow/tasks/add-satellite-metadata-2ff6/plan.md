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

**Completed**: Created comprehensive technical specification at `.zenflow/tasks/add-satellite-metadata-2ff6/spec.md`

**Assessment**: Medium complexity
- Requires data conversion (CSV → TypeScript)
- Type system extensions
- State management updates across multiple slices
- Event logging updates in multiple locations
- Pool management for unique satellite assignment

---

### [ ] Step: Convert CSV Data to TypeScript

**Objective**: Convert the satellites.csv file into a TypeScript data structure.

**Tasks**:
1. Parse the CSV file and convert to TypeScript array
2. Create `src/game/data/satelliteMetadata.ts` with:
   - `SatelliteMetadata` interface
   - Exported array of all satellite metadata
3. Verify type alignment (CSV types match SatelliteType enum)

**Verification**:
- TypeScript compilation succeeds
- Data structure matches spec
- All 197 satellites properly converted

---

### [ ] Step: Update Type Definitions and State

**Objective**: Extend type system to support satellite metadata and pool management.

**Tasks**:
1. Update `src/game/types.ts`:
   - Add optional `metadata` field to `Satellite` interface
   - Add `SatelliteMetadata` interface (if not in data file)
   - Add `availableSatellitePool` to `GameState` interface
2. Verify no TypeScript errors introduced

**Verification**:
- `npm run lint` passes
- TypeScript compilation succeeds

---

### [ ] Step: Implement Satellite Pool Management

**Objective**: Add pool initialization and management in game state.

**Tasks**:
1. Update `src/store/slices/gameSlice.ts`:
   - Import satellite metadata
   - Add `availableSatellitePool` to `initialState`
   - Update `initializeGame` to reset pool from full metadata
   - Update `resetGame` to reset pool from full metadata
2. Modify `launchSatellite` reducer:
   - Filter pool by satellite `purpose` type
   - Randomly select one satellite from filtered pool
   - Assign metadata to new satellite
   - Remove selected satellite from pool
   - Handle case where pool is empty (optional metadata)

**Verification**:
- `npm run lint` passes
- Game initializes without errors
- Satellites receive unique metadata on launch

---

### [ ] Step: Update Event Logging - Launch Events

**Objective**: Include satellite metadata in launch event messages.

**Tasks**:
1. Update `src/store/slices/eventSlice.ts`:
   - Modify `launchSatellite` event case to include metadata in message
   - Format: `"Launched GPS satellite 'QZSS-2' (Japan, 4000 kg) in MEO orbit"`
   - Add metadata to event details object

**Verification**:
- Launch events show satellite metadata
- Events display correctly in UI

---

### [ ] Step: Update Event Logging - Collisions, Captures, Graveyard

**Objective**: Include satellite metadata in all satellite-related events.

**Tasks**:
1. Update `src/hooks/useGameSpeed.ts`:
   - **Collision events** (line ~94-100):
     - Look up satellites involved using `collision.objectIds`
     - Include satellite metadata in collision messages
     - Add metadata to event details
   - **Debris removal events** (line ~76-84):
     - When satellites are captured/removed, include their metadata
     - Update message format
   - **Graveyard move events** (currently missing):
     - Add event logging for `recentGraveyardMoves`
     - Include satellite metadata in messages
     - Format: `"GeoTug moved 'GOES-16' (USA, 2857 kg) to graveyard orbit"`

**Verification**:
- All event types include satellite metadata when applicable
- Event messages are clear and informative
- No duplicate or missing events

---

### [ ] Step: Testing and Verification

**Objective**: Comprehensive testing of satellite metadata feature.

**Tasks**:
1. Manual testing:
   - Launch satellites of each type (Weather, Comms, GPS)
   - Verify unique metadata assigned
   - Verify no duplicate satellites used
   - Verify pool resets on game restart
   - Test pool exhaustion (launch 26+ Weather satellites)
2. Check all event types:
   - Launch events
   - Collision events involving satellites
   - Capture events (cooperative DRV)
   - Graveyard move events
3. Run linting and build:
   - `npm run lint`
   - `npm run build`

**Verification**:
- All satellites receive unique metadata
- Pool management works correctly
- All events log metadata appropriately
- No TypeScript or lint errors
- Build succeeds

---

### [ ] Step: Documentation and Report

**Objective**: Document implementation and results.

**Tasks**:
1. Create `{@artifacts_path}/report.md`:
   - Summary of what was implemented
   - Testing approach and results
   - Any challenges or edge cases encountered
   - Known limitations or future enhancements

**Verification**:
- Report accurately reflects implementation
- All deliverables completed
