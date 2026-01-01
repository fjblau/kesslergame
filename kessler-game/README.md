# Kessler Simulation - Phase 1 Interactive Inputs

Modular React + TypeScript implementation of 5 core interactive inputs for the Kessler space debris simulation game.

## Features Implemented

### 1. **Game Speed Selector**
- ⏸ Pause / ▶ Normal / ⏩ Fast (2s auto-advance)
- Auto-pause triggers on budget warnings

### 2. **Insurance Tier Selector**
- None ($0) / Basic ($500K → $1M payout) / Premium ($1M → $2.5M payout)
- Integrated cost calculation

### 3. **Satellite Purpose Selector**
- Weather ☁️ / Comms 📡 / GPS 🛰️ / Random 🎲 (-10% discount)
- Player-controlled vs random selection

### 4. **Budget Difficulty Modifier**
- Easy ($150M, +$10M/10 turns)
- Normal ($100M, +$5M/20 turns)
- Hard ($75M, no income)
- Challenge ($50M, -$2M/turn drain)

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
