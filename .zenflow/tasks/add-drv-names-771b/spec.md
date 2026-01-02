# Technical Specification: Add DRV Names and Metadata

## Task Complexity Assessment
**Difficulty**: Medium

This task involves:
- Importing and parsing CSV data
- Creating a new metadata structure for DRVs
- Mapping CSV capture types to game DRV types
- Modifying DRV launch logic to attach metadata
- Updating event logging to display names and metadata
- Ensuring proper display on both Game Page and Analytics Page

## Technical Context

**Language**: TypeScript/React
**Framework**: React + Redux Toolkit
**Build Tool**: Vite
**UI Library**: TailwindCSS

**Key Dependencies**:
- React 18+
- Redux Toolkit for state management
- TypeScript for type safety

## Current Architecture

### DRV System
- **Types**: `DebrisRemovalVehicle` interface in `src/game/types.ts:43-60`
- **Launch Action**: `launchDRV` reducer in `src/store/slices/gameSlice.ts:320-359`
- **Event Logging**: DRV launch events created in `src/store/slices/eventSlice.ts:67-76`

### Event Display System
- **Game Page**: `EventLog.tsx` displays `event.message` only
- **Analytics Page**: `DetailedEventLog.tsx` displays `event.message` + `event.details` as key-value pairs in `EventItem.tsx:40-54`

### CSV Data Structure
The source file `/Users/frankblau/Downloads/space_debris_vehicles.csv` contains:
- `vehicle_name`: Display name (e.g., "ELSA-d Servicer")
- `organization`: Operator (e.g., "Astroscale")
- `capture_type`: Either "cooperative" or "non-cooperative"
- `capture_system`: Technical description
- `icon_suggestion`: Visual description

### Type Mapping Challenge
- **CSV**: Uses "cooperative" and "non-cooperative"
- **Game**: Uses DRVType = "cooperative" | "uncooperative" | "geotug"
- **Solution**: Map "non-cooperative" → "uncooperative", handle "geotug" separately

## Implementation Approach

### 1. Create DRV Metadata Structure

**File**: `src/game/drvMetadata.ts` (new file)

Follow the pattern from `satelliteMetadata.ts`:
- Define `DRVMetadata` interface matching CSV structure
- Create typed metadata array from CSV data
- Create metadata pool arrays by DRV type (cooperative/uncooperative)
- Export selection function to randomly select metadata by type

### 2. Update Type Definitions

**File**: `src/game/types.ts`

Add optional metadata field to `DebrisRemovalVehicle` interface:
```typescript
export interface DebrisRemovalVehicle {
  // ... existing fields
  metadata?: {
    name: string;
    organization: string;
    capture_system: string;
    icon_suggestion: string;
  };
}
```

### 3. Modify DRV Launch Logic

**File**: `src/store/slices/gameSlice.ts`

In the `launchDRV` reducer (line 320-359):
- Import DRV metadata selection function
- Select appropriate metadata based on `drvType` ("cooperative" or "uncooperative")
- For "geotug" type, use a default/generic metadata or none
- Attach metadata to DRV object using spread operator pattern

### 4. Update Event Logging

**File**: `src/store/slices/eventSlice.ts`

Modify the `launchDRV` case in extraReducers (line 67-76):
- Import the gameSlice action to access DRV metadata
- Update message to include DRV name: `"Deployed {name} ({drvType}) to {orbit} orbit"`
- Expand details object to include all metadata fields as separate keys

### 5. Improve Event Display (Optional Enhancement)

**File**: `src/components/EventLog/EventItem.tsx`

The current implementation (lines 40-54) already displays details as key-value pairs when `showDetails={true}`. This should work correctly for the new metadata fields, but may need styling improvements for better readability of longer text fields.

Consider:
- Better formatting for multi-word field names (replace underscores with spaces, capitalize)
- Line wrapping for long text fields like `capture_system`
- Maintaining consistent column layout

## Data Model Changes

### New Interface: DRVMetadata
```typescript
export interface DRVMetadata {
  vehicle_name: string;
  organization: string;
  capture_type: 'cooperative' | 'non-cooperative';
  capture_system: string;
  icon_suggestion: string;
}
```

### Modified Interface: DebrisRemovalVehicle
Add optional metadata field containing name, organization, capture_system, and icon_suggestion.

## Source Code Structure Changes

### New Files
1. `src/game/drvMetadata.ts` - DRV metadata definitions and selection logic
2. `kessler-game/public/data/space_debris_vehicles.csv` - CSV data file (copied from Downloads)

### Modified Files
1. `src/game/types.ts` - Add metadata field to DebrisRemovalVehicle interface
2. `src/store/slices/gameSlice.ts` - Import metadata, attach to DRV on launch
3. `src/store/slices/eventSlice.ts` - Update DRV launch event message and details
4. `src/components/EventLog/EventItem.tsx` (optional) - Improve details display formatting

## Verification Approach

### Manual Testing
1. **Start the development server**: `npm run dev`
2. **Launch a cooperative DRV**: Verify name appears in event log on Game Page
3. **Launch an uncooperative DRV**: Verify name appears in event log
4. **Switch to Analytics tab**: Verify all metadata fields (name, organization, capture_system, icon_suggestion) display as rows
5. **Launch multiple DRVs**: Verify different vehicles are selected randomly
6. **Launch a geotug**: Verify it still works (even without specific metadata)

### Type Checking
Run TypeScript compiler to verify type safety:
```bash
npm run typecheck
```

### Linting
Ensure code follows project standards:
```bash
npm run lint
```

### Edge Cases to Test
- Launching multiple DRVs of the same type should show different names (random selection)
- Geotug launches should not crash (handle missing metadata gracefully)
- Event log should handle long text in metadata fields without breaking layout
- Switching between tabs should preserve event history

## Risk Assessment

**Low Risk Areas**:
- Adding metadata to DRV objects (non-breaking additive change)
- Updating event messages (cosmetic change)

**Medium Risk Areas**:
- CSV parsing and data import (potential for format errors)
- Type mapping between CSV and game types (need careful handling)
- Event details display with longer text fields (UI layout concerns)

## Open Questions
None - Requirements are clear and implementation path is straightforward.
