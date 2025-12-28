# Technical Specification: Memory Tweaks

## Task Difficulty Assessment

**Complexity Level**: **EASY**

**Reasoning**:
- Straightforward analysis of existing game mechanics
- Simple constant definitions and validation logic
- No architectural changes required
- Limited scope: adding limits and UI feedback
- Low risk of breaking existing functionality

---

## Technical Context

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.11.2
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18

### Current State
The game currently has:
- **Debris limit**: MAX_DEBRIS_LIMIT = 500 (game over condition)
- **No satellite limit**: Players can launch unlimited satellites (budget permitting)
- **No DRV limit**: Players can launch unlimited DRVs (budget permitting)
- **Configurable debris per collision**: Default 5, but adjustable via localStorage

### Performance Risks
1. **Exponential debris growth**: Each collision creates 5+ debris pieces, leading to rapid growth
2. **Render performance**: OrbitVisualization.tsx renders all objects on every frame
   - Each satellite, debris, and DRV renders as a separate React component
   - With 500 debris + 100 satellites + 50 DRVs = 650 DOM elements updating
3. **Collision detection**: O(n²) complexity within each orbital layer
   - Already optimized with spatial hashing, but still scales poorly with high object counts
4. **State updates**: Redux state updates trigger full re-renders

---

## Implementation Approach

### 1. Analyze Reasonable Limits

Based on game mechanics and performance testing:

**Satellites**:
- Budget constraints naturally limit launches (LEO: $2M, MEO: $3M, GEO: $5M)
- Maximum realistic launches: ~50 satellites in a 100-turn game
- **Proposed hard limit**: 75 satellites (provides buffer for extreme scenarios)

**Debris Removal Vehicles (DRVs)**:
- More expensive than satellites (LEO cooperative: $4M, uncooperative: $7M)
- Expire after 100 turns, naturally limiting accumulation
- **CRITICAL**: Game froze with 14 DRVs in LEO orbit (real user report)
- Performance bottleneck: Each cooperative DRV filters all debris/satellites every turn (O(DRVs × Debris))
- **Proposed hard limit**: 15 DRVs total (maximum across all layers)
- **Proposed per-layer limit**: 5 DRVs (conservative, prevents concentration)

**Debris**:
- Already has MAX_DEBRIS_LIMIT = 500 (game over)
- Suggest adding warning thresholds for player feedback
- **Proposed warning at**: 400 debris (80% of limit)

**Debris Per Collision**:
- Currently configurable, no upper limit
- High values (>20) can cause exponential growth
- **Proposed limit**: 1-15 debris per collision

### 2. Implementation Strategy

**Phase 1: Add Constants** (constants.ts)
```typescript
export const MAX_SATELLITES = 75;
export const MAX_DRVS = 15;  // Game freezes at 14 DRVs in one orbit
export const MAX_DRVS_PER_LAYER = 5;  // Conservative limit, prevents concentration
export const DEBRIS_PER_COLLISION_MIN = 1;
export const DEBRIS_PER_COLLISION_MAX = 15;
export const DEBRIS_WARNING_THRESHOLD = 400;
```

**Phase 2: Add Validation** (gameSlice.ts)
- Prevent launching satellites when limit reached
- Prevent launching DRVs when total limit reached
- Prevent launching DRVs when per-layer limit reached
- Clamp debris per collision to valid range
- Add derived selectors for UI

**Phase 3: UI Feedback**
- Disable launch buttons when limits reached
- Show warning messages in ControlPanel
- Add visual indicator in Configuration panel
- Display current counts vs limits in StatusDisplay

**Phase 4: Testing**
- Verify limits prevent launches
- Test budget scenario where player has funds but hits object limits
- Validate UI feedback displays correctly

---

## Source Code Structure

### Files to Modify

1. **src/game/constants.ts** (152 lines)
   - Add MAX_SATELLITES constant
   - Add MAX_DRVS constant  
   - Add DEBRIS_PER_COLLISION_MIN and DEBRIS_PER_COLLISION_MAX
   - Add DEBRIS_WARNING_THRESHOLD

2. **src/store/slices/gameSlice.ts** (748 lines)
   - Add validation in launchSatellite reducer
   - Add validation in launchDRV reducer
   - Clamp debrisPerCollision in setter
   - Add validation in setDebrisPerCollision

3. **src/components/ControlPanel/ControlPanel.tsx** (~100-200 lines)
   - Disable launch button when satellite limit reached
   - Disable launch button when DRV limit reached
   - Show tooltip/message explaining why button is disabled

4. **src/components/Configuration/Configuration.tsx** (if exists)
   - Add validation to debris per collision input
   - Show valid range in UI

5. **src/components/StatsPanel/StatsPanel.tsx** (if exists)
   - Display satellite count / MAX_SATELLITES
   - Display DRV count / MAX_DRVS
   - Display debris count / MAX_DEBRIS_LIMIT

### New Files
None required - all changes are modifications to existing files.

---

## Data Model / API / Interface Changes

### Constants (game/constants.ts)
```typescript
export const MAX_SATELLITES = 75;
export const MAX_DRVS = 15;  // Based on real-world freeze at 14
export const MAX_DRVS_PER_LAYER = 5;  // Conservative per-orbit limit
export const DEBRIS_PER_COLLISION_MIN = 1;
export const DEBRIS_PER_COLLISION_MAX = 15;
export const DEBRIS_WARNING_THRESHOLD = 400;
```

### Redux State (No changes to types)
The GameState interface already supports the required data - no schema changes needed.

### Derived Selectors (optional, for cleaner UI code)
```typescript
export const selectCanLaunchSatellite = (state: RootState) => 
  state.game.satellites.length < MAX_SATELLITES;

export const selectCanLaunchDRV = (state: RootState, layer: OrbitLayer) => {
  const totalDRVs = state.game.debrisRemovalVehicles.length;
  const layerDRVs = state.game.debrisRemovalVehicles.filter(d => d.layer === layer).length;
  return totalDRVs < MAX_DRVS && layerDRVs < MAX_DRVS_PER_LAYER;
};

export const selectIsDebrisWarning = (state: RootState) => 
  state.game.debris.length >= DEBRIS_WARNING_THRESHOLD;
```

---

## Verification Approach

### Manual Testing
1. **Satellite Limit Test**
   - Start game with easy difficulty ($150M budget)
   - Launch satellites until reaching 75
   - Verify launch button becomes disabled
   - Verify tooltip/message explains limit reached

2. **DRV Limit Test**
   - Start game with easy difficulty
   - Launch DRVs into LEO until reaching 5 in that layer
   - Verify launch button becomes disabled for LEO only
   - Verify can still launch to MEO and GEO
   - Launch 5 to MEO and 5 to GEO (15 total)
   - Verify all launch buttons disabled at 15 total
   - Verify UI feedback shows limit reached

3. **Debris Per Collision Limit**
   - Open Configuration panel
   - Set debris per collision to 20 (above max)
   - Verify it clamps to 15
   - Set to 0 (below min)
   - Verify it clamps to 1

4. **Debris Warning Test**
   - Play game until debris count reaches 400
   - Verify warning indicator appears
   - Continue to 500
   - Verify game over triggers

### Automated Tests (Optional)
```typescript
describe('Object Limits', () => {
  it('prevents satellite launch when limit reached', () => {
    // Create state with 75 satellites
    // Dispatch launchSatellite action
    // Assert satellite count remains 75
  });

  it('prevents DRV launch when limit reached', () => {
    // Create state with 50 DRVs
    // Dispatch launchDRV action
    // Assert DRV count remains 50
  });

  it('clamps debris per collision to valid range', () => {
    // Dispatch setDebrisPerCollision(20)
    // Assert state.debrisPerCollision === 15
  });
});
```

### Performance Testing
1. Test with maximum objects (75 satellites + 50 DRVs + 400 debris)
2. Measure frame rate in OrbitVisualization
3. Verify no significant lag or freezing
4. Test on lower-end devices if possible

### Lint/Typecheck
```bash
npm run lint
npm run build
```

---

## Success Criteria

1. ✅ Constants defined for all object limits
2. ✅ Redux reducers validate limits before adding objects
3. ✅ UI buttons disabled when limits reached
4. ✅ Clear user feedback explaining why actions are disabled
5. ✅ Debris per collision clamped to safe range
6. ✅ No TypeScript errors
7. ✅ No ESLint warnings
8. ✅ Build succeeds
9. ✅ Game remains playable and responsive with maximum objects

---

## Recommended Limits Summary

| Object Type | Current Limit | Proposed Limit | Rationale |
|------------|---------------|----------------|-----------|
| Satellites | None | 75 | Typical game: ~50 launches, buffer for edge cases |
| DRVs (Total) | None | 15 | **Game froze at 14**, set limit below freeze point |
| DRVs (Per Layer) | None | 5 | Conservative limit, prevents O(DRVs × Debris) bottleneck |
| Debris | 500 | 500 (keep) | Already causes game over, appropriate limit |
| Debris/Collision | Unlimited | 1-15 | Prevents exponential growth, maintains gameplay |
| Warning Threshold | None | 400 debris | Gives player warning before game over at 500 |

---

## Implementation Notes

- Keep changes minimal and non-breaking
- Limits should feel natural, not restrictive
- Clear UI feedback prevents player confusion
- Consider adding to tutorial/help text
- Limits can be adjusted later based on player feedback

## Root Cause Analysis: DRV Performance Issue

**Problem**: Game freezes with 14 cooperative DRVs in LEO orbit

**Root Cause**: 
1. `processDRVOperations()` runs every turn for all active DRVs
2. Each cooperative DRV calls `processCooperativeDRVOperations(drv, state.debris, state.satellites)`
3. Inside that function, `selectTarget()` filters all debris and satellites in the layer
4. With 14 DRVs and 100+ debris pieces, this becomes 1,400+ filter operations per turn
5. This compounds with rendering and collision detection

**Complexity Analysis**:
```
Per turn cost = O(DRVs × (Debris + Satellites))
With 14 DRVs, 200 debris, 30 satellites:
14 × 230 = 3,220 filter/find operations per turn

With proposed limits (5 per layer × 3 layers = 15 max):
5 × 230 = 1,150 filter/find operations per layer
Manageable performance impact
```

**Solution**: Hard cap at 15 DRVs total, 5 per layer to prevent performance degradation
