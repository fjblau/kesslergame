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

### [x] Step: Convert CSV Data to TypeScript
<!-- chat-id: 1157cd17-ef16-42a5-9a59-e75faf361191 -->

**Objective**: Convert the satellites.csv file into a TypeScript data structure.

**Tasks**:
1. Convert CSV file to TypeScript array (manually or programmatically)
2. Create `kessler-game/src/game/satelliteMetadata.ts` with:
   - `SatelliteMetadata` interface (6 fields: name, country, type, weight_kg, launch_vehicle, launch_site)
   - Exported array of all satellite metadata (794 satellites total)
3. Verify type alignment (CSV types match SatelliteType enum: "Weather", "Comms", "GPS")

**Verification**:
- TypeScript compilation succeeds
- Data structure matches spec
- All 794 satellites properly converted (234 Weather, 322 Comms, 238 GPS)
- All 6 metadata fields present for each satellite

---

### [x] Step: Update Type Definitions and State
<!-- chat-id: 750ea9e0-1ced-4db6-8f68-19e899ad1c04 -->

**Objective**: Extend type system to support satellite metadata and pool management.

**Tasks**:
1. Update `kessler-game/src/game/types.ts`:
   - Add optional `metadata` field to `Satellite` interface (with 5 fields: name, country, weight_kg, launch_vehicle, launch_site)
   - Add `SatelliteMetadata` interface (if not in data file) with all 6 fields
   - Add `availableSatellitePool` to `GameState` interface
2. Verify no TypeScript errors introduced

**Verification**:
- `npm run lint` passes
- TypeScript compilation succeeds

---

### [x] Step: Implement Satellite Pool Management
<!-- chat-id: 52b094b3-b27c-4429-a035-35c6cc56af84 -->

**Objective**: Add pool initialization and management in game state.

**Tasks**:
1. Update `kessler-game/src/store/slices/gameSlice.ts`:
   - Import satellite metadata from `../game/satelliteMetadata`
   - Add `availableSatellitePool` to `initialState` constant (initialized with full metadata array)
   - Note: `initializeGame` spreads `initialState`, so pool auto-resets on game init
   - Update `resetGame` to explicitly reset `state.availableSatellitePool` from full metadata
2. Modify `launchSatellite` reducer:
   - Filter `state.availableSatellitePool` by satellite `purpose` type
   - Randomly select one satellite from filtered pool
   - Assign metadata to new satellite object
   - Remove selected satellite from `state.availableSatellitePool`
   - Handle case where pool is empty for that type (launch without metadata)

**Verification**:
- `npm run lint` passes
- Game initializes without errors
- Satellites receive unique metadata on launch

---

### [x] Step: Update Event Logging - Launch Events
<!-- chat-id: df541ac9-f645-49c9-a4c8-419d23acca17 -->

**Objective**: Include satellite metadata in launch event messages.

**Tasks**:
1. Update `kessler-game/src/store/slices/eventSlice.ts`:
   - Modify `launchSatellite` event case to include metadata in message
   - Format: `"Launched GPS satellite 'QZSS-2' (Japan, 4000 kg, H-IIA from Tanegashima) in MEO orbit"`
   - Alternative shorter format if too long: Include name/country/weight in message, full metadata in details
   - Add all metadata fields to event details object

**Verification**:
- Launch events show satellite metadata
- Events display correctly in UI

---

### [ ] Step: Update Event Logging - Collisions, Captures, Graveyard

**Objective**: Include satellite metadata in all satellite-related events.

**Tasks**:
1. Update `kessler-game/src/hooks/useGameSpeed.ts`:
   - **Collision events** (line ~94-100):
     - Look up satellites involved using `collision.objectIds`
     - Include satellite metadata in collision messages (name, country, weight, vehicle/site)
     - Add all metadata fields to event details
   - **Debris removal events** (line ~76-84):
     - When satellites are captured/removed, include their metadata
     - Update message format with extended metadata
   - **Graveyard move events** (currently missing):
     - Add event logging for `recentGraveyardMoves`
     - Include satellite metadata in messages
     - Format: `"GeoTug moved 'GOES-16' (USA, 2857 kg, Atlas V from Cape Canaveral) to graveyard orbit"`
     - Or shorter format if messages too verbose

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
   - Verify unique metadata assigned (all 6 fields populated)
   - Verify no duplicate satellites used
   - Verify pool resets on game restart
   - Test pool exhaustion (launch 234+ Weather satellites to exhaust Weather pool)
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
