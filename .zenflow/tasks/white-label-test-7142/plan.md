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
<!-- chat-id: a20866f7-c817-4899-9b50-247b6339144d -->

✅ **Completed**: Technical specification created at `spec.md`
- **Complexity**: Medium
- **Approach**: Multi-tenant configuration system using environment variables
- **Implementation time**: 8-12 hours estimated

---

### [ ] Step 1: Setup Brand Configuration Infrastructure

Create the foundational brand configuration system:

1. Create `src/config/brands/index.ts` with TypeScript interfaces
2. Create `src/config/brands/default.ts` with current branding values
3. Create `src/config/brands/customer-a.ts` as example white-label configuration
4. Create `src/config/brand.ts` as runtime brand selector
5. Update `.env.example` to document `VITE_BRAND_ID` variable

**Verification**: 
- TypeScript compilation succeeds
- Brand interfaces properly define all required properties

---

### [ ] Step 2: Organize Brand Assets

Reorganize assets into brand-specific folders:

1. Create directory structure: `src/assets/brands/default/` and `src/assets/brands/customer-a/`
2. Move `space-logo.png` to `src/assets/brands/default/logo.png`
3. Add example customer logo to `src/assets/brands/customer-a/logo.png`
4. Update asset paths in brand configurations

**Verification**:
- Assets load correctly in development mode
- No broken image references

---

### [ ] Step 3: Implement Dynamic Theming

Update Tailwind and CSS to support dynamic brand colors:

1. Modify `tailwind.config.js` to generate CSS custom properties from brand colors
2. Update `src/index.css` (or main stylesheet) with CSS custom property definitions
3. Create utility to inject brand colors as CSS variables at runtime

**Verification**:
- Default brand colors render correctly
- CSS variables are accessible in browser DevTools

---

### [ ] Step 4: Migrate Core Components to Brand System

Update certificate generation and key UI components:

1. Update `src/utils/certificate.ts` to use brand configuration for logo and text
2. Update `index.html` to use brand title (via Vite plugin if needed)
3. Update main App component to reference brand configuration
4. Migrate 5-10 high-impact components to use brand colors via CSS custom properties

**Verification**:
- Certificate generates with correct logo
- Page title displays brand name
- Components render with brand colors

---

### [ ] Step 5: Comprehensive Component Migration

Migrate remaining components to brand system:

1. Identify and update remaining components using hardcoded colors (40+ files)
2. Replace color class references with semantic CSS custom properties
3. Update any hardcoded text to use brand configuration
4. Ensure all icon/asset references use brand system

**Verification**:
- All components render correctly with default brand
- No hardcoded brand-specific values remain in components

---

### [ ] Step 6: Testing and Validation

Comprehensive testing of white-label system:

1. Test build with `VITE_BRAND_ID=default`
2. Test build with `VITE_BRAND_ID=customer-a`
3. Run test suite: `npm run test`
4. Run linter: `npm run lint`
5. Visual regression testing across both brands
6. Test certificate generation with both brands
7. Verify no console errors in either configuration

**Verification**:
- All tests pass
- No linting errors
- Both brands render correctly
- No visual regressions in default brand

---

### [ ] Step 7: Documentation and Completion

Document the white-label system:

1. Update README with instructions for creating new brands
2. Add comments to brand configuration files
3. Create `report.md` with:
   - Implementation summary
   - Testing results
   - Usage instructions for customers
   - Known limitations or future enhancements
