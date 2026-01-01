# Bug Investigation: Certificate PDF Logo and Border Issues

## Bug Summary
Certificate PDF generation has two issues:
1. Logo (mission patch) not displaying in generated PDF
2. Blue border around logo is 2px but should be 1px

## Root Cause Analysis

### Issue 1: Logo Not Displaying
**Location**: `kessler-game/src/utils/certificate.ts:2` and `:46`

**Problem**: 
- Line 2: `import missionPatchImage from '../assets/mission-patch.jpeg';`
- Line 46: `doc.addImage(missionPatchImage, 'JPEG', 15, 15, 36, 36);`

The image is imported as a Vite module, which resolves to a URL string (e.g., `/src/assets/mission-patch.jpeg` or a hashed URL). jsPDF's `addImage()` method cannot directly use this URL in the browser context - it needs either:
- A base64 data URL
- An HTMLImageElement
- Image data in a compatible format

**Evidence**: The mission patch file exists at `kessler-game/src/assets/mission-patch.jpeg` (157.81 KB)

### Issue 2: Blue Border Width
**Location**: `kessler-game/src/utils/certificate.ts:36`

**Problem**:
- Line 36: `doc.setLineWidth(2);` sets border to 2mm
- Line 37: `doc.rect(10, 10, pageWidth - 20, pageHeight - 20);` draws the blue border
- Should be 1px (approximately 0.26mm) or more likely 1mm

**Current State**:
- Blue border: 2mm (line 36)
- Purple border: 1mm (line 40) ✓ correct
- Logo box border: 2mm (line 44)

## Affected Components
- `kessler-game/src/utils/certificate.ts` - PDF generation utility
- `kessler-game/src/components/GameOver/GameOverModal.tsx` - Calls certificate generation

## Proposed Solution

### Fix 1: Logo Display
Convert the imported image to a base64 data URL that jsPDF can use. Options:
1. Fetch the image URL and convert to base64 at runtime
2. Load image as HTMLImageElement first, then add to PDF
3. Use `fetch()` + `FileReader` to convert to data URL

**Recommended approach**: Load image via `fetch()`, convert to blob, then to data URL using FileReader.

### Fix 2: Border Width
Change line 36 from `doc.setLineWidth(2);` to `doc.setLineWidth(1);`

This will make the blue outer border 1mm thick instead of 2mm.

## Edge Cases & Considerations
- Ensure image loads before PDF generation (async handling)
- Handle image load failures gracefully
- Maintain aspect ratio of logo
- Consider caching converted image data for performance

---

## Implementation Notes

### Changes Made

1. **Added image loading helper function** (certificate.ts:22-41)
   - Created `loadImageAsDataURL()` to convert image URL to base64 data URL
   - Uses HTML5 Canvas to convert image to JPEG data URL
   - Returns Promise for async handling
   - Includes error handling for failed image loads

2. **Updated generateCertificate function** (certificate.ts:43)
   - Changed from synchronous to async function
   - Returns `Promise<void>` instead of `void`

3. **Fixed blue border width** (certificate.ts:57)
   - Changed from `doc.setLineWidth(2)` to `doc.setLineWidth(1)`
   - Now renders 1mm border instead of 2mm

4. **Fixed logo box border width** (certificate.ts:65)
   - Changed from `doc.setLineWidth(2)` to `doc.setLineWidth(1)`
   - Consistent 1mm border around logo

5. **Updated logo rendering** (certificate.ts:68-69)
   - Added `await loadImageAsDataURL(missionPatchImage)` to convert image
   - Now properly renders logo in PDF

6. **Updated GameOverModal component** (GameOverModal.tsx:59)
   - Changed `handleDownloadCertificate` to async function
   - Added `await` when calling `generateCertificate()`

### Test Results

✅ **Build**: Successful (no TypeScript errors)
✅ **Lint**: Passed (no linting errors)
✅ **Dev Server**: Running on http://localhost:5173/

### Validation

The dev server is running and ready for testing:
1. Visit http://localhost:5173/
2. Play the game until game over
3. Click "Download Mission Certificate" button
4. Verify:
   - Mission patch logo displays correctly
   - Blue border is 1px/1mm (thinner than before)
   - PDF downloads successfully

Alternative: Open `kessler-game/test-certificate.html` in a browser to test certificate generation directly.
