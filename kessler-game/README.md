# Kessler Simulation - Space Debris Management Game

Modular React + TypeScript implementation of a comprehensive Kessler space debris simulation game with advanced debris removal and satellite management systems.

## Features Implemented

### 1. **Four Orbital Layers**
- **LEO** (Low Earth Orbit): $2M launch cost, 20-turn lifespan
- **MEO** (Medium Earth Orbit): $3M launch cost, 40-turn lifespan
- **GEO** (Geostationary Orbit): $5M launch cost, 60-turn lifespan
- **GRAVEYARD** (Disposal Orbit): End-of-life satellite parking orbit (moved by GeoTug)

### 2. **Debris Removal Vehicles (4 Types)**
- **Cooperative DRV**: Removes 2-3 debris/turn, 85% success rate, $2M-$5M
- **Uncooperative DRV**: Removes 6-9 debris/turn, 90% success rate, $3.5M-$8.75M
- **GeoTug**: Moves satellites to GRAVEYARD orbit, 100% success rate, $25M
- **Refueling Vehicle**: Extends satellite/DRV lifespan by 50%, 95% success rate, $1.5M-$3.75M

### 3. **Insurance Tier Selector**
- None ($0) / Basic ($500K → $1M payout) / Premium ($1M → $2.5M payout)
- Integrated cost calculation and payout tracking

### 4. **Satellite Purpose Selector**
- Weather ☁️ ($100K/turn revenue) / Comms 📡 ($150K/turn) / GPS 🛰️ ($200K/turn) / Random 🎲 (-10% discount)
- Player-controlled vs random selection with revenue generation

### 5. **Budget Difficulty Modifier**
- Easy ($300M, +$10M/10 turns)
- Normal ($200M, +$5M/20 turns)
- Hard ($150M, no income)
- Challenge ($100M, -$2M/turn drain)

### 6. **Solar Flare System**
- 10% chance per turn with 5 intensity classes (A, B, C, M, X)
- Class A removes ~5% LEO debris (most common)
- Class X removes ~50% LEO + ~20% MEO + ~5% GEO debris (very rare)

### 7. **Game Speed Control**
- ⏸ Pause / ▶ Normal / ⏩ Fast (2s auto-advance)
- Auto-pause triggers on collisions, budget warnings, and risk changes

## Project Structure

```
src/
├── components/
│   ├── ControlPanel/           # Main launch controls
│   ├── DRVPanel/               # DRV configuration
│   ├── SatelliteConfig/        # Satellite options
│   ├── Setup/                  # Game setup screen
│   ├── TimeControl/            # Speed controls
│   └── ui/                     # Reusable UI components
├── game/
│   ├── engine/                 # Game logic (collision, debris removal)
│   ├── constants.ts            # Configuration values
│   └── types.ts                # TypeScript interfaces
├── hooks/                      # Custom React hooks
└── store/                      # Redux state management
    └── slices/                 # Game & UI state slices
```

## Run the Application

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
```

## Code Quality

- ✅ TypeScript strict mode
- ✅ Modular component architecture
- ✅ Type-safe Redux Toolkit
- ✅ Tailwind CSS styling
- ✅ All files < 200 lines (concise & focused)

## Next Steps

Phase 2 & 3 inputs can be added by extending existing patterns in:
- New selector components in `/components`
- Game logic in `/game/engine`
- State management in `/store/slices`
