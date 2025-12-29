# Configuration Page Layout Update

## Changes Made

Modified the configuration page in `kessler-game/src/App.tsx:89` to display settings in a 3-column grid layout instead of a single column.

### Specific Changes:
- Changed layout from `max-w-4xl mx-auto space-y-6` (single column, vertical stacking)
- To `w-[80%] mx-auto grid grid-cols-3 gap-6` (3-column grid layout)
- Width expanded to 80% of the container as requested
- Settings components now displayed in 3 columns:
  - CollisionSettings
  - OrbitalSpeedSettings
  - SolarStormSettings
  - RiskBasedSpeedSettings
  - DRVSettings

## Result
The configuration page now displays settings in 3 columns across 80% of the available width, providing better space utilization and easier comparison of different settings.
