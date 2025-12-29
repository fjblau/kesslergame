# Documentation Update Report

## Task: Update Documentation to Reflect New Economics of Satellite Revenue

### Summary

Updated all documentation files to comprehensively explain the **dual-revenue system** consisting of per-satellite per-turn revenue plus difficulty-based bonus income.

### Changes Made

#### 1. App.tsx (In-Game Documentation Tab)
- Updated "Budget Management" section to "Budget Management & Revenue"
- Added **Satellite Revenue (Per Turn)** section explaining per-satellite income:
  - Weather: $100,000 per turn
  - Communications: $150,000 per turn
  - GPS: $200,000 per turn
  - Example calculation showing total revenue from mixed fleet
- Added **Bonus Income (Difficulty-Based)** section:
  - Easy Mode: $10M bonus every 10 turns
  - Normal Mode: $5M bonus every 20 turns
  - Hard Mode: No bonus income
  - Challenge Mode: No bonus income + $2M drain per turn
- Updated strategy tips to emphasize satellite fleet as primary revenue source

#### 2. spec.md (Technical Specification)
- Added `SATELLITE_REVENUE` constant defining per-turn revenue by satellite type
- Updated `BUDGET_DIFFICULTY_CONFIG` to clarify that `incomeAmount`/`incomeInterval` are bonus income (not primary)
- Rewrote "Satellite Revenue Economics" section as comprehensive dual-revenue documentation:
  - **Per-Turn Satellite Revenue (Primary)**: Detailed breakdown with examples and ROI calculations
  - **Difficulty-Based Bonus Income (Secondary)**: Full comparison of all difficulty modes
  - **Economic Strategy Implications**: Separate strategies for satellite portfolio, bonus timing, and revenue-only modes
  - Added key insight about satellites as revenue engines

#### 3. report.md (Game Analysis Document)
- Updated "Resource Management & Satellite Revenue" section with dual-revenue model
- Added **Per-Turn Satellite Revenue** as primary income source with examples
- Added **Difficulty-Based Bonus Income** as secondary source
- Updated economic strategy guidance to emphasize satellite protection and revenue building

### Documentation Coverage

The updated documentation now provides:

1. **Player-facing documentation**: Clear explanation of how both revenue sources work (per-satellite + bonus)
2. **Developer documentation**: Technical specifications with constants and implementation details
3. **Strategy guidance**: Comprehensive tips for:
   - Satellite portfolio optimization (GPS first for maximum revenue)
   - Bonus income timing in Easy/Normal modes
   - Revenue-only strategies for Hard/Challenge modes
   - ROI calculations for different satellite types
   - Insurance strategies to protect revenue streams

### Revenue System Structure

**Primary Income: Per-Satellite Per-Turn Revenue**
- Weather: $100K/turn
- Comms: $150K/turn  
- GPS: $200K/turn
- Total depends on fleet composition

**Secondary Income: Difficulty-Based Bonus**
- Easy: $10M every 10 turns
- Normal: $5M every 20 turns
- Hard: None
- Challenge: None (-$2M drain instead)

### Files Modified
- `kessler-game/src/App.tsx`
- `spec.md`
- `report.md`

### Verification

All documentation is internally consistent and accurately reflects the implementation from the "Change Game Economics" task:
- Satellite revenue constants: `SATELLITE_REVENUE` (Weather: 100K, Comms: 150K, GPS: 200K)
- Bonus income system: `BUDGET_DIFFICULTY_CONFIG` 
- Revenue calculation occurs in `advanceTurn` reducer
