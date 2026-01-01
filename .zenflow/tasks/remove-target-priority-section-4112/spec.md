# Technical Specification: Remove Target Priority Section

## Task Difficulty Assessment

**Complexity Level**: **EASY**

**Reasoning**:
- Straightforward code removal task
- No complex logic changes required
- Target Priority is not used in actual game engine logic
- Well-contained changes to specific files
- Simple type and constant cleanup
- Documentation updates are clear and minimal

---

## Technical Context

### Background
The Target Priority feature was designed when DRVs could have mixed targeting capabilities (e.g., 70% cooperative / 30% uncooperative). However, the game has evolved to launch Cooperative and Uncooperative DRVs independently as separate types. Since each DRV type inherently targets its matching debris type, the Target Priority section is now obsolete.

### Language & Framework
- **Language**: TypeScript 5.x
- **Framework**: React 18.x
- **State Management**: Redux Toolkit
- **Build Tool**: Vite

---

## Implementation Approach

### Objective
Remove all Target Priority related code, types, constants, and UI components since DRVs are now launched independently as either Cooperative or Uncooperative types.

### Analysis

#### Current State
The Target Priority feature consists of:
1. **UI Component**: `DRVTargetPriority.tsx` - Radio selector for priority options
2. **Type Definition**: `DRVTargetPriority` type in `types.ts`
3. **Configuration**: `DRV_PRIORITY_CONFIG` constant in `constants.ts`
4. **State Field**: `targetPriority` field on `DebrisRemovalVehicle` interface
5. **Cost Calculation**: Priority modifier affects DRV launch costs
6. **Documentation**: References in `App.tsx`, `README.md`

#### Why It's Obsolete
- DRVs are now launched as specific types (cooperative/uncooperative)
- Each DRV type inherently targets only its matching debris type
- The `cooperativeChance` config field is never actually used in game logic
- The cost modifier was the only functional aspect, but it's unnecessary complexity

---

## Source Code Structure Changes

### Files to Delete
1. **`kessler-game/src/components/DRVPanel/DRVTargetPriority.tsx`** (38 lines)
   - Entire component can be removed

### Files to Modify

#### 1. **`kessler-game/src/game/types.ts`**
   - **Line 7**: Remove `DRVTargetPriority` type definition
   - **Line 50**: Remove `targetPriority` field from `DebrisRemovalVehicle` interface

#### 2. **`kessler-game/src/game/constants.ts`**
   - **Lines 1-8**: Remove `DRVTargetPriority` from imports
   - **Lines 47-67**: Remove entire `DRV_PRIORITY_CONFIG` constant export

#### 3. **`kessler-game/src/components/ControlPanel/ControlPanel.tsx`**
   - **Line 6**: Remove `DRVTargetPriority` from type imports
   - **Line 7**: Remove `DRV_PRIORITY_CONFIG` from constant imports
   - **Line 11**: Remove import of `DRVTargetPriority` component
   - **Line 28**: Remove `drvPriority` state variable
   - **Lines 38-39**: Remove priority modifier from cost calculation
   - **Lines 52-54**: Remove priority modifier from getLaunchTypeCost
   - **Line 77**: Remove `targetPriority: drvPriority` from launchDRV call
   - **Line 80**: Remove `targetPriority: 'auto'` from geotug launchDRV call
   - **Line 105**: Remove `drvPriority` from useCallback dependencies
   - **Line 182**: Remove `<DRVTargetPrioritySelector>` component usage

#### 4. **`kessler-game/src/store/slices/gameSlice.ts`**
   - **Line 3**: Remove `DRVTargetPriority` from type imports
   - **Line 322**: Remove `targetPriority` from action payload type
   - **Line 326**: Remove `targetPriority` destructuring
   - **Line 338**: Remove `targetPriority` from DRV object creation
   - **Line 352**: Remove `targetPriority` from prepare payload type
   - Update action calls to no longer require/pass targetPriority

#### 5. **`kessler-game/src/App.tsx`**
   - **Lines 258-273**: Remove "Target Priority Strategies" documentation section
   - This is in the DRV documentation section within the Documentation tab

#### 6. **`kessler-game/README.md`**
   - **Lines 15-17**: Remove "DRV Target Priority" feature description

---

## Data Model / API / Interface Changes

### Type Removals
```typescript
// REMOVE this type entirely
export type DRVTargetPriority = 'auto' | 'cooperative-focus' | 'uncooperative-focus';
```

### Interface Changes
```typescript
// DebrisRemovalVehicle interface - REMOVE targetPriority field
export interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  removalType: DRVType;
  targetPriority: DRVTargetPriority;  // ← REMOVE THIS LINE
  age: number;
  maxAge: number;
  // ... rest remains
}
```

### Constant Removals
```typescript
// REMOVE this entire constant export
export const DRV_PRIORITY_CONFIG: Record<DRVTargetPriority, { 
  cooperativeChance: number; 
  costModifier: number;
  description: string 
}> = { /* ... */ };
```

### Redux Action Changes
```typescript
// launchDRV action payload - REMOVE targetPriority field
{
  orbit: OrbitLayer;
  drvType: DRVType;
  targetPriority: DRVTargetPriority;  // ← REMOVE THIS LINE
  turn: number;
  day: number;
}
```

---

## Verification Approach

### 1. Type Checking
```bash
cd kessler-game
npm run typecheck
```
- Verify no TypeScript errors
- Confirm all references to `DRVTargetPriority` are removed

### 2. Build Verification
```bash
npm run build
```
- Ensure clean build with no errors
- Confirm no unused imports warnings

### 3. Lint Check
```bash
npm run lint
```
- Verify code quality standards
- Check for any orphaned imports

### 4. Manual Testing
1. Start the development server
2. Navigate to Launch tab
3. Verify DRV launch section:
   - Should only show "DRV Type" selector (Cooperative/Uncooperative)
   - No "Target Priority" section should appear
   - Cost calculation should work correctly without priority modifier
4. Launch both Cooperative and Uncooperative DRVs
5. Verify they function correctly
6. Check Documentation tab for updated DRV documentation

### 5. Functionality Verification
- Launch Cooperative DRV → Should only target cooperative debris
- Launch Uncooperative DRV → Should only target uncooperative debris
- Verify costs match base costs without modifiers:
  - Cooperative LEO: $4M, MEO: $6M, GEO: $10M
  - Uncooperative LEO: $7M, MEO: $10.5M, GEO: $17.5M

---

## Risk Assessment

### Low Risk Areas
- UI component removal - self-contained
- Type and constant cleanup - compile-time checked
- Documentation updates - no functional impact

### Validation Required
- Redux action payload changes - ensure all call sites updated
- Cost calculation - verify no unintended price changes
- DRV launch functionality - confirm no regressions

### Migration Notes
- No data migration needed (this is a UI-only feature)
- Existing save states not affected (targetPriority field just ignored)
- No backward compatibility concerns

---

## Success Criteria

✅ All TypeScript compilation succeeds with no errors  
✅ No references to `DRVTargetPriority` remain in codebase  
✅ DRV launch UI shows only "DRV Type" selector  
✅ DRV costs reflect base prices without priority modifiers  
✅ Documentation updated to remove Target Priority references  
✅ All tests pass (if applicable)  
✅ Clean lint output with no warnings  
✅ Build succeeds without errors
