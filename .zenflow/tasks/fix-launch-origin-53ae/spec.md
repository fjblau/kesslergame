# Technical Specification: Fix Launch Origin

## Task Difficulty
**Easy** - Single line change to correct coordinate calculation

## Technical Context
- **Language**: JavaScript (embedded in HTML)
- **File**: `orbit-visualization-animation.html`
- **Framework**: Vanilla JavaScript with HTML5 Canvas
- **Dependencies**: None

## Problem Analysis

### Current Behavior
Launch animations (satellites and DRVs) appear to originate from the bottom of the screen rather than from the Earth object.

### Root Cause
In the `LaunchAnimation` class constructor (line 457), the starting Y coordinate is set to:
```javascript
this.startY = centerY + 280;
```

This places the launch origin 280 pixels below the canvas center, which is far below the Earth object.

### Earth Object Position
The Earth is drawn at:
- **Center**: `(centerX, centerY)` - which is `(400, 300)` for an 800x600 canvas
- **Radius**: 30 pixels
- **Bottom edge**: `centerY + 30` = 330 pixels from top

### Launch Origin Position
Currently launches start at:
- **X**: `centerX` = 400 (correct - horizontally aligned with Earth)
- **Y**: `centerY + 280` = 580 (incorrect - 250 pixels below Earth's bottom edge)

## Solution

### Implementation Approach
Change the `startY` value in the `LaunchAnimation` constructor to originate from the Earth's surface instead of an arbitrary point below the screen.

**Target location**: `orbit-visualization-animation.html:457`

**Change**:
```javascript
// Current
this.startY = centerY + 280;

// Fixed
this.startY = centerY + 30;
```

This will make launches start from the bottom edge of the Earth object (centerY + earthRadius).

### Why This Works
- Earth radius = 30 pixels (defined in `drawEarth()` function at line 643)
- Earth center = `(centerX, centerY)`
- Earth's bottom edge = `centerY + 30`
- Launches will now visually originate from the Earth's surface

## Files Modified
- `orbit-visualization-animation.html` - Line 457 in `LaunchAnimation` constructor

## Data Model / API Changes
None - this is a visual coordinate correction only.

## Verification Approach

### Manual Verification
1. Open `orbit-visualization-animation.html` in a web browser
2. Observe the launch animations when satellites and DRVs are deployed
3. Verify that launch trails now originate from the Earth object (blue circle at center)
4. Confirm launches appear at timestamps: 2s, 3.5s, 5s, 6.5s, 8s, 10s

### Expected Visual Behavior
- Launch animation trail should start from the bottom edge of the blue Earth circle
- The dashed line trail should connect Earth to the target orbit
- No visual artifacts or misalignment

### Testing
- No automated tests required (pure visual change)
- No lint/typecheck needed (HTML file with embedded JavaScript)
- Manual visual inspection is sufficient

## Risk Assessment
**Very Low Risk**
- Single coordinate value change
- No logic changes
- No dependencies affected
- Easy to revert if needed
- Purely cosmetic fix
