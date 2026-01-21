# Technical Specification: White-Label Configuration System

## Task Assessment

**Complexity**: Medium

**Rationale**: This task involves implementing a theming and branding system that needs to:
- Support multiple brand configurations (default + customer-specific)
- Handle both compile-time (Tailwind colors) and runtime (logos, text) customization
- Maintain backward compatibility with existing code
- Ensure clean separation between default and white-label configurations
- Avoid breaking the generic version

## Technical Context

### Current Architecture

- **Language**: TypeScript
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18
- **State Management**: Redux Toolkit 2.11.2
- **Key Dependencies**: react-router-dom, jsPDF (certificate generation)

### Existing Branding Elements

1. **Color Palette** (defined in `tailwind.config.js`):
   - `cyber-cyan`: Primary accent color (blues)
   - `electric-green`: Success/positive actions
   - `neon-orange`: Warnings/alerts
   - `deep-space`: Background colors (dark theme)

2. **Assets** (located in `kessler-game/src/assets/` and `kessler-game/public/`):
   - `space-logo.png`: Used in certificate generation
   - `mission-patch.jpeg`: Mission graphics
   - `vite.svg`: Favicon

3. **Branding Text**:
   - Application title: "kessler-game"
   - Certificate text: "Space Debris Management Program"
   - Various UI labels and content

## Implementation Approach

### Strategy: Multi-Tenant Configuration System

Use environment variables to select the active brand configuration at build time, combined with a centralized configuration module that provides theme values throughout the application.

### Why This Approach?

1. **Clean Separation**: Each brand has its own configuration file
2. **No Code Changes**: Generic version remains untouched
3. **Type Safety**: TypeScript ensures all required brand properties are defined
4. **Vite Integration**: Leverages Vite's environment variable system
5. **Tailwind Compatibility**: Uses CSS custom properties for dynamic theming
6. **Build Optimization**: Tree-shaking removes unused brand configurations

### Architecture Overview

```
kessler-game/
├── src/
│   ├── config/
│   │   ├── brands/
│   │   │   ├── default.ts       # Default/generic brand
│   │   │   ├── customer-a.ts    # Example customer brand
│   │   │   └── index.ts         # Brand type definitions
│   │   └── brand.ts             # Runtime brand selector
│   ├── assets/
│   │   ├── brands/
│   │   │   ├── default/
│   │   │   │   └── logo.png
│   │   │   └── customer-a/
│   │   │       └── logo.png
│   └── ...
├── .env.example                 # Documents VITE_BRAND_ID
├── .env.local                   # Local override (git-ignored)
└── ...
```

## Source Code Structure Changes

### New Files

1. **`src/config/brands/index.ts`**
   - TypeScript interfaces defining brand configuration schema
   - `BrandConfig` interface with all customizable properties
   - Export type for type safety

2. **`src/config/brands/default.ts`**
   - Default brand configuration (current branding)
   - Defines all colors, text, assets for generic version

3. **`src/config/brands/customer-a.ts`** (example)
   - Customer-specific brand configuration
   - Demonstrates white-label customization

4. **`src/config/brand.ts`**
   - Runtime brand selector using `import.meta.env.VITE_BRAND_ID`
   - Exports single `brand` object used throughout app
   - Provides type-safe access to current brand config

5. **`src/assets/brands/default/logo.png`**
   - Default logo relocated to brand-specific folder

6. **`src/assets/brands/customer-a/logo.png`** (example)
   - Customer logo for white-label demo

### Modified Files

1. **`tailwind.config.js`**
   - Add CSS custom property generation for dynamic color themes
   - Maintain existing color scale structure
   - Map brand colors to CSS variables

2. **`src/index.css`** (or main CSS file)
   - Define CSS custom properties for brand colors
   - Set default values from active brand config

3. **`src/utils/certificate.ts`**
   - Replace hardcoded logo import with dynamic brand logo
   - Replace hardcoded text with brand configuration values
   - Update color values to use brand colors

4. **`index.html`**
   - Update title to use dynamic value (via Vite HTML transform plugin)
   - Update favicon reference to brand-specific asset

5. **`.env.example`**
   - Add `VITE_BRAND_ID=default` documentation
   - Document available brand IDs

6. **`.gitignore`**
   - Ensure `.env.local` is ignored (already standard)

7. **Files using hardcoded colors** (40+ files identified):
   - Update color class references to use semantic names
   - Ensure colors work with CSS custom properties
   - Maintain existing functionality

## Data Model / API / Interface Changes

### BrandConfig Interface

```typescript
interface BrandConfig {
  id: string;
  name: string;
  
  // Colors (Tailwind scale format)
  colors: {
    primary: ColorScale;      // Maps to cyber-cyan
    success: ColorScale;       // Maps to electric-green
    warning: ColorScale;       // Maps to neon-orange
    background: ColorScale;    // Maps to deep-space
  };
  
  // Assets
  assets: {
    logo: string;              // Path to logo image
    favicon: string;           // Path to favicon
    certificateLogo: string;   // Logo for PDF certificates
  };
  
  // Text branding
  text: {
    appName: string;
    appTitle: string;
    certificateTitle: string;
    organizationName: string;
  };
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}
```

### Environment Variables

```bash
# Brand Selection
VITE_BRAND_ID=default|customer-a|customer-b

# Redis configuration (existing, unchanged)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Build-Time vs Runtime Considerations

- **Build-Time**: Brand selection, Tailwind color generation, asset bundling
- **Runtime**: Accessing brand configuration, dynamic text rendering
- **Hybrid**: CSS custom properties set at build time, applied at runtime

## Verification Approach

### 1. Development Testing

```bash
# Test default brand
npm run dev

# Test customer brand
VITE_BRAND_ID=customer-a npm run dev
```

### 2. Build Testing

```bash
# Build with default brand
npm run build

# Build with customer brand
VITE_BRAND_ID=customer-a npm run build

# Preview builds
npm run preview
```

### 3. Visual Verification Checklist

- [ ] Logo appears correctly in all locations
- [ ] All UI colors match brand configuration
- [ ] Certificate PDF uses correct logo and colors
- [ ] Favicon displays correctly in browser tab
- [ ] App title matches brand name
- [ ] No console errors or warnings
- [ ] Color contrast maintains accessibility

### 4. Component Testing

Test components using brand configuration:
- Certificate generation with custom logo
- Header/navigation with brand colors
- Buttons and interactive elements
- Charts and visualizations
- Modal dialogs and overlays

### 5. Automated Tests

Update existing tests to:
- Mock brand configuration
- Test with multiple brand configs
- Ensure brand switching doesn't break functionality

Run test suite:
```bash
npm run test
```

### 6. Linting

```bash
npm run lint
```

### 7. Type Checking

```bash
npm run build  # Includes TypeScript checking
```

## Migration Strategy

### Phase 1: Setup Infrastructure
- Create brand configuration structure
- Define TypeScript interfaces
- Add default brand configuration (mirror current setup)

### Phase 2: Integrate Brand System
- Update Tailwind config for CSS custom properties
- Create brand selector module
- Add environment variable support

### Phase 3: Migrate Components
- Update color references to use CSS variables
- Replace hardcoded text with brand config
- Update asset imports to use brand assets

### Phase 4: Testing & Validation
- Test default brand (should match current appearance)
- Create example customer brand
- Validate no regressions

## Risk Mitigation

### Risk 1: Breaking Existing Functionality
**Mitigation**: 
- Default brand exactly mirrors current configuration
- Incremental migration with testing at each step
- Keep existing color classes as fallbacks initially

### Risk 2: Build Complexity
**Mitigation**:
- Leverage Vite's native environment variable handling
- Minimal build configuration changes
- Clear documentation for build process

### Risk 3: Tailwind Purging Issues
**Mitigation**:
- Use CSS custom properties (never purged)
- Safelist brand-related classes if needed
- Test production builds thoroughly

### Risk 4: Type Safety Loss
**Mitigation**:
- Strong TypeScript interfaces
- Centralized brand access point
- Compile-time brand validation

## Future Enhancements

1. **Runtime Brand Switching**: Allow brand changes without rebuild (for multi-tenant SaaS)
2. **Brand Management UI**: Admin interface to create/edit brand configurations
3. **Advanced Theming**: Font families, spacing scales, border radius variations
4. **Component Variants**: Brand-specific component behaviors
5. **A/B Testing**: Compare different brand configurations
6. **Brand Validation**: Automated accessibility and contrast checking

## Dependencies

No new npm dependencies required. Uses existing:
- Vite's environment variable system
- TailwindCSS CSS custom properties
- TypeScript for type safety

## Estimated Implementation Time

- **Setup & Infrastructure**: 2-3 hours
- **Component Migration**: 4-6 hours
- **Testing & Refinement**: 2-3 hours
- **Total**: 8-12 hours

## Success Criteria

1. ✅ Default brand matches current appearance exactly
2. ✅ Can build with different brands using environment variable
3. ✅ No code duplication between brands
4. ✅ Type-safe brand configuration
5. ✅ All existing tests pass
6. ✅ No visual regressions in default brand
7. ✅ Customer brand displays custom logo and colors
8. ✅ Documentation for adding new brands
