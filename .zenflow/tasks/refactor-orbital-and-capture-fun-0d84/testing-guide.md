# Manual Testing Guide - Collision Detection Refactor

## Overview
This guide provides a systematic approach to testing the refactored Euclidean collision detection system.

## Current Configuration
- **Satellite radius**: 8 units
- **Debris radius**: 6 units
- **DRV radius**: 10 units
- **Capture radius multiplier**: 1.5×

## Access the Game
The development server is running at: **http://localhost:5173/**

---

## Testing Checklist

### ✅ Basic Functionality

#### 1. Game Startup
- [ ] Game loads without console errors
- [ ] No TypeScript/React errors in the browser console (F12 → Console)
- [ ] Initial UI renders correctly
- [ ] Settings load from localStorage (if previously saved)

#### 2. Satellite Launches
Test launching satellites in all orbit layers:

- [ ] **LEO Layer**: Launch a satellite → Verify it appears in LEO orbit
- [ ] **MEO Layer**: Launch a satellite → Verify it appears in MEO orbit
- [ ] **GEO Layer**: Launch a satellite → Verify it appears in GEO orbit
- [ ] Check that satellites rotate at different speeds based on orbital layer
- [ ] Verify budget decreases by the correct amount for each launch

---

### ✅ Collision Detection

#### 3. Collision Timing and Visual Overlap
- [ ] Launch 3-5 satellites in LEO with similar angles
- [ ] Observe collisions occur when objects **visually overlap**
- [ ] Check that collision timing feels consistent (not too early/late)
- [ ] Verify debris is generated from each collision

#### 4. Collision at Small Orbital Radii (LEO)
- [ ] Launch multiple satellites in LEO very close together
- [ ] Verify collision detection is reliable at small orbital radii
- [ ] Check that objects need to actually touch/overlap to collide

#### 5. Collision at Large Orbital Radii (GEO)
- [ ] Launch multiple satellites in GEO close together
- [ ] Verify collision detection is consistent with LEO
- [ ] Physical overlap should match collision timing

#### 6. X-Axis Wraparound (0°/360° Boundary)
**Critical Test**: Previous angular collision had issues at this boundary

- [ ] Launch satellite A at ~355° angle
- [ ] Launch satellite B at ~5° angle (same orbit layer)
- [ ] Wait for objects to approach each other across the 0°/360° boundary
- [ ] Verify collision occurs when they visually overlap
- [ ] Check that there are no "ghost misses" where objects pass through each other

#### 7. Multi-Layer Collision Safety
- [ ] Launch satellites in different orbital layers at same angle
- [ ] Verify objects in different layers **do NOT** collide with each other
- [ ] Only objects in the same orbital layer should collide

---

### ✅ Debris Removal Vehicle (DRV) Functionality

#### 8. Cooperative DRV Capture
- [ ] Launch satellites to create some debris (via collisions)
- [ ] Launch a **Cooperative DRV** in the same layer as debris
- [ ] Verify DRV approaches and captures cooperative debris
- [ ] Check that capture occurs when DRV gets close enough to debris
- [ ] Confirm debris is removed when DRV completes its mission

#### 9. Uncooperative DRV Removal
- [ ] Launch an **Uncooperative DRV** in a layer with uncooperative debris
- [ ] Verify DRV approaches and removes uncooperative debris
- [ ] Check that removal timing is appropriate

#### 10. Geotug Operations
- [ ] Launch a **Geotug** in GEO layer
- [ ] Verify Geotug can capture a satellite
- [ ] Check that Geotug moves satellite to graveyard orbit
- [ ] Confirm satellite is successfully transferred

---

### ✅ Game Balance and Performance

#### 11. Insurance Payouts
- [ ] Launch satellite with insurance
- [ ] Let it collide with debris
- [ ] Verify insurance payout is credited to budget
- [ ] Check payout amount matches insurance tier

#### 12. Performance with Many Objects
- [ ] Launch 20-30 satellites across different layers
- [ ] Create multiple collisions to generate 50+ debris pieces
- [ ] Check that game remains smooth (no lag or stuttering)
- [ ] Monitor browser console for performance warnings
- [ ] Verify frame rate stays acceptable

#### 13. Game Over Conditions
- [ ] Play until budget depletes to $0
- [ ] Verify game over state is triggered correctly
- [ ] Check that no errors occur after game over

---

### ✅ Console Verification

#### 14. Browser Console Checks
Open browser console (F12 → Console) and verify:

- [ ] No red errors on game load
- [ ] No errors during satellite launches
- [ ] No errors during collisions
- [ ] No errors during DRV operations
- [ ] No infinite loops or excessive re-renders

---

## Tuning Recommendations

If you notice any issues during testing, consider these adjustments:

### If Collisions Feel Too Frequent
```typescript
// In src/game/constants.ts
export const OBJECT_RADII = {
  satellite: 6,  // Reduce from 8
  debris: 4,     // Reduce from 6
  drv: 8,        // Reduce from 10
};
```

### If Collisions Feel Too Rare
```typescript
// In src/game/constants.ts
export const OBJECT_RADII = {
  satellite: 10, // Increase from 8
  debris: 8,     // Increase from 6
  drv: 12,       // Increase from 10
};
```

### If DRV Capture Feels Too Hard
```typescript
// In src/game/constants.ts
export const CAPTURE_RADIUS_MULTIPLIER = 2.0; // Increase from 1.5
```

### If DRV Capture Feels Too Easy
```typescript
// In src/game/constants.ts
export const CAPTURE_RADIUS_MULTIPLIER = 1.2; // Decrease from 1.5
```

---

## Expected Outcomes

### What Should Work
✅ Collisions occur based on visual overlap, not arbitrary angular thresholds
✅ Collision behavior is consistent at all orbital radii (LEO, MEO, GEO)
✅ No collision detection failures at the 0°/360° boundary
✅ DRVs can reliably capture debris using the new radius-based detection
✅ Game performance is smooth with 100+ objects
✅ No console errors or warnings

### What Changed from Before
- **Old**: Collisions detected by angle difference + radial shell distance
- **New**: Collisions detected by Euclidean distance between centers
- **Benefit**: Scale-independent, more accurate, simpler logic

---

## Report Your Findings

After testing, please note:

1. **What worked well**: List features that behaved correctly
2. **What needs tuning**: Any radius values that feel off
3. **Bugs found**: Any errors or unexpected behavior
4. **Performance**: How the game ran with many objects
5. **Overall feel**: Does collision detection feel fair and accurate?

Share your testing results so we can finalize the tuning and mark this step complete!
