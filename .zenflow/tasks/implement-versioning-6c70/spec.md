# Technical Specification: Display App Version in UI

## Task Complexity
**Difficulty**: Easy

This is a straightforward implementation with minimal complexity:
- Simple Vite configuration update
- Basic TypeScript declaration
- Minor UI component modification

## Technical Context

### Technology Stack
- **Build Tool**: Vite 7.2.4
- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **UI Styling**: Tailwind CSS 4.1.18
- **Project Structure**: Standard React SPA in `kessler-game/` directory

### Current State
- `package.json` version: `0.0.0` (line 4 in `kessler-game/package.json`)
- `vite.config.ts` exists with basic React and Tailwind plugins
- No `src/vite-env.d.ts` file exists yet (needs to be created)
- Application has a StatsPanel component that displays orbital status and game statistics

## Implementation Approach

### 1. Vite Configuration Update
**File**: `kessler-game/vite.config.ts`

Add version import and define global constant:
- Import `version` from `./package.json`
- Add `define` configuration to expose `__APP_VERSION__` as a global constant
- Use `JSON.stringify()` to properly format the version string for code injection

### 2. TypeScript Declaration
**File**: `kessler-game/src/vite-env.d.ts` (create new)

Create TypeScript declaration file with:
- Vite client type reference
- Global constant declaration for `__APP_VERSION__`

### 3. UI Integration
**File**: `kessler-game/src/components/StatsPanel/StatsPanel.tsx`

The StatsPanel is the most appropriate location because:
- Already displays system/orbital status information
- Located in the main game view (right panel)
- Has a consistent design pattern for displaying metadata
- Currently shows "Step: X / Y" at the bottom - version can be added below this

Implementation:
- Add version display at the bottom of the StatsPanel
- Format as `v{__APP_VERSION__}` 
- Style consistently with existing text (gray, small)
- Use the same styling pattern as the "Step" display

## Source Code Structure Changes

### Files to Modify
1. **`kessler-game/vite.config.ts`** (exists)
   - Add version import
   - Add define block for global constant

2. **`kessler-game/src/vite-env.d.ts`** (create)
   - Add Vite type reference
   - Declare `__APP_VERSION__` constant

3. **`kessler-game/src/components/StatsPanel/StatsPanel.tsx`** (exists)
   - Add version display element at bottom of panel

### Files to Keep Unchanged
- `kessler-game/package.json` - version remains `0.0.0` for now
- All other source files

## Data Model / API / Interface Changes

### Global Constants
- **`__APP_VERSION__`**: string
  - Injected at build time by Vite
  - Contains version from package.json
  - Available globally in TypeScript code

### Component Props
No new props or interfaces required - version is accessed via global constant.

## Verification Approach

### Build Verification
```bash
cd kessler-game
npm run build
```
- Should complete without errors
- No TypeScript compilation errors related to `__APP_VERSION__`

### Type Checking
```bash
cd kessler-game
npx tsc -b --noEmit
```
- Verify TypeScript recognizes `__APP_VERSION__` constant
- No type errors

### Linting
```bash
cd kessler-game
npm run lint
```
- Ensure code follows project ESLint standards

### Manual Testing
1. Start development server: `npm run dev`
2. Navigate to the game UI
3. Locate the StatsPanel in the right panel
4. Verify version display at bottom shows "v0.0.0"
5. Update `package.json` version to "1.0.0"
6. Restart dev server
7. Verify version display updates to "v1.0.0"

### Visual Verification Points
- Version text is visible and readable
- Styling is consistent with other panel text
- Version is positioned appropriately (bottom of StatsPanel)
- Text color is muted/gray to indicate metadata
- Format follows "v{version}" pattern

## Edge Cases & Considerations

### Minimal Edge Cases
- **Missing version in package.json**: Current version is already present (0.0.0)
- **Build-time injection**: Version is injected at build/dev time, so changes require restart
- **TypeScript strict mode**: Declaration ensures type safety

### Design Decisions
- **Location**: StatsPanel chosen over footer/settings for visibility and contextual relevance
- **Format**: "v" prefix is conventional for version displays
- **Styling**: Muted gray consistent with other metadata displays in the panel

## Success Criteria
- ✅ Version displays in UI (StatsPanel component)
- ✅ Version reads from `package.json` dynamically
- ✅ No TypeScript errors for `__APP_VERSION__`
- ✅ Build completes successfully
- ✅ Linting passes
- ✅ Version updates when `package.json` changes (after restart)
