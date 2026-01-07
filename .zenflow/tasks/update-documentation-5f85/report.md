# Documentation Update Report

## Summary

Updated documentation to reflect recent changes in terminology and gameplay mechanics for the Kessler Simulation game.

## Major Changes Implemented

### 1. **Four Orbital Layers (was 3)**
- Added **GRAVEYARD** orbit (150-200km range)
- Updated all type definitions to include `GRAVEYARD` in `OrbitLayer`
- Satellites in GRAVEYARD have 999-turn lifespan (effectively permanent)
- Orbital speed: 2.2 km/s
- No direct launch cost (satellites moved here by GeoTug)

### 2. **Four ADR (Active Debris Removal) Types (was 2 DRV types)**
**Terminology Change**: DRV → ADR (Active Debris Removal), Refueling → Servicing

**NEW: GeoTug**
- Cost: $25M (all orbits)
- Purpose: Moves satellites to GRAVEYARD orbit
- Success rate: 100%
- Duration: Permanent (999 turns)

**NEW: Servicing Vehicle** (formerly Refueling)
- Cost: $1.5M (LEO) to $3.75M (GEO)
- Purpose: Extends satellite/ADR lifespan by 50%
- Success rate: 95%
- Duration: 15 turns

**UPDATED: Cooperative ADR** (formerly Cooperative DRV)
- Cost: $2M (LEO) to $5M (GEO) [was $4M-$10M]
- Capacity: 2-3 debris/turn [unchanged]
- Success rate: 85% [unchanged]
- Duration: 10 turns [unchanged]

**UPDATED: Uncooperative ADR** (formerly Uncooperative DRV)
- Cost: $3.5M (LEO) to $8.75M (GEO) [was $8M-$20M]
- Capacity: 6-9 debris/turn [was 1-2]
- Success rate: 90% [was 60%]
- Duration: 10 turns [was 8]

### 3. **Insurance System Enhancement**
Changed from single-tier to three-tier system:
- **None**: $0 cost, $0 payout
- **Basic**: $500K cost, $1M payout
- **Premium**: $1M cost, $2.5M payout

Updated type from `boolean insured` to `InsuranceTier` enum

### 4. **Solar Flare Classification System**
Replaced simple "solar storm" with detailed 5-class system:
- **Class A**: Removes ~5% LEO debris (most common, 5% weight)
- **Class B**: Removes ~10% LEO debris (common, 35% weight)
- **Class C**: Removes ~20% LEO debris (moderate, 35% weight)
- **Class M**: Removes ~35% LEO + ~5% MEO debris (rare, 20% weight)
- **Class X**: Removes ~50% LEO + ~20% MEO + ~5% GEO debris (very rare, 5% weight)

Each class has specific X-ray flux ranges and intensity values

### 5. **Satellite Lifespan by Orbit**
Added orbit-specific lifespans:
- LEO: 20 turns
- MEO: 40 turns
- GEO: 60 turns
- GRAVEYARD: 999 turns (permanent)

### 6. **Orbital Speeds**
Added orbital speed parameters:
- LEO: 6.4 km/s
- MEO: 4.0 km/s
- GEO: 2.4 km/s
- GRAVEYARD: 2.2 km/s

### 7. **Max Debris Limit**
Changed from 500 to **250**

### 8. **Enhanced Object Properties**
All game objects (Satellite, Debris, DRV) now include:
- `radius`: Physical size for collision detection
- `captureRadius`: Proximity range for DRV capture operations
- `metadata`: Detailed information (name, country, organization, etc.)

## Files Updated

### spec.md
- Updated all type definitions (OrbitLayer, DRVType, InsuranceTier, SolarFlareClass)
- Updated Satellite, Debris, and DebrisRemovalVehicle interfaces
- Updated DRV_CONFIG with new costs, capacities, and success rates
- Added comprehensive DRV type descriptions
- Updated GameConfig interface
- Updated collision detection algorithm to include GRAVEYARD
- Updated LaunchAction interface
- Updated mission descriptions
- Updated UI component descriptions

### report.md
- Updated "Three Orbital Layers" to "Four Orbital Layers" with GRAVEYARD details
- Added satellite lifespan and orbital speeds to each layer
- Updated DRV costs and capabilities
- Updated insurance tier information
- Replaced "Solar Storms" with detailed "Solar Flares" classification
- Updated max_debris_limit to 250
- Added satellite_lifespan and orbital_speeds to configuration

### kessler-game/README.md
- Completely restructured features section
- Added "Four Orbital Layers" section
- Added "Debris Removal Vehicles (4 Types)" section with full details
- Updated insurance tiers description
- Added satellite revenue information
- Updated budget difficulty values
- Added "Solar Flare System" section
- Updated game speed control description

## Terminology Changes

| Old Term | New Term | Notes |
|----------|----------|-------|
| DRV (Debris Removal Vehicle) | ADR (Active Debris Removal) | Industry-standard terminology |
| Refueling Vehicle | Servicing Vehicle | More accurate description |
| `insured: boolean` | `insuranceTier: InsuranceTier` | More flexible insurance system |
| Solar Storm | Solar Flare (Class A-X) | Detailed classification system |
| 3 orbital layers | 4 orbital layers | Added GRAVEYARD |
| 2 DRV types | 4 ADR types | Added GeoTug and Servicing |
| LEO lifetime | Satellite lifespan | Orbit-specific values |
| `DRVType` | `ADRType` | Type definition update |
| `DebrisRemovalVehicle` | `ActiveDebrisRemovalVehicle` | Interface update |

## Verification

All updates maintain consistency across:
- Type definitions in spec.md
- Game configuration in report.md
- Feature descriptions in README.md
- TypeScript implementation files (types.ts, constants.ts)

The documentation now accurately reflects the current implementation state of the Kessler Simulation game.
