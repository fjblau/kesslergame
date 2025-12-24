import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameState, OrbitLayer, SatelliteType, InsuranceTier, DRVType, DRVTargetPriority, BudgetDifficulty } from '../../game/types';
import { BUDGET_DIFFICULTY_CONFIG, MAX_STEPS, LAYER_BOUNDS, DRV_CONFIG } from '../../game/constants';

const generateId = () => Math.random().toString(36).substring(2, 11);

const randomPositionInLayer = (layer: OrbitLayer) => {
  const [yMin, yMax] = LAYER_BOUNDS[layer];
  return {
    x: Math.random() * 100,
    y: yMin + Math.random() * (yMax - yMin),
  };
};

const initialState: GameState = {
  step: 0,
  maxSteps: MAX_STEPS,
  satellites: [],
  debris: [],
  debrisRemovalVehicles: [],
  budget: BUDGET_DIFFICULTY_CONFIG.normal.startingBudget,
  budgetDifficulty: 'normal',
  budgetIncomeAmount: BUDGET_DIFFICULTY_CONFIG.normal.incomeAmount,
  budgetIncomeInterval: BUDGET_DIFFICULTY_CONFIG.normal.incomeInterval,
  budgetDrainAmount: BUDGET_DIFFICULTY_CONFIG.normal.drainAmount,
  nextIncomeAt: BUDGET_DIFFICULTY_CONFIG.normal.incomeInterval,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (_state, action: PayloadAction<BudgetDifficulty>) => {
      const config = BUDGET_DIFFICULTY_CONFIG[action.payload];
      return {
        ...initialState,
        budget: config.startingBudget,
        budgetDifficulty: action.payload,
        budgetIncomeAmount: config.incomeAmount,
        budgetIncomeInterval: config.incomeInterval,
        budgetDrainAmount: config.drainAmount,
        nextIncomeAt: config.incomeInterval,
      };
    },

    launchSatellite: (state, action: PayloadAction<{
      orbit: OrbitLayer;
      insuranceTier: InsuranceTier;
      purpose: SatelliteType;
    }>) => {
      const { orbit, insuranceTier, purpose } = action.payload;
      const satellite = {
        id: generateId(),
        ...randomPositionInLayer(orbit),
        layer: orbit,
        purpose,
        age: 0,
        insuranceTier,
      };
      state.satellites.push(satellite);
    },

    launchDRV: (state, action: PayloadAction<{
      orbit: OrbitLayer;
      drvType: DRVType;
      targetPriority: DRVTargetPriority;
    }>) => {
      const { orbit, drvType, targetPriority } = action.payload;
      const [minCapacity, maxCapacity] = DRV_CONFIG.capacity[drvType];
      const drv = {
        id: generateId(),
        ...randomPositionInLayer(orbit),
        layer: orbit,
        removalType: drvType,
        targetPriority,
        age: 0,
        maxAge: DRV_CONFIG.duration[drvType],
        capacity: Math.floor(Math.random() * (maxCapacity - minCapacity + 1)) + minCapacity,
        successRate: DRV_CONFIG.successRate[drvType],
        debrisRemoved: 0,
      };
      state.debrisRemovalVehicles.push(drv);
    },

    spendBudget: (state, action: PayloadAction<number>) => {
      state.budget -= action.payload;
    },

    addBudget: (state, action: PayloadAction<number>) => {
      state.budget += action.payload;
    },

    advanceTurn: (state) => {
      state.step += 1;

      if (state.budgetDrainAmount > 0) {
        state.budget -= state.budgetDrainAmount;
      }

      if (state.budgetIncomeInterval > 0 && state.step >= state.nextIncomeAt) {
        state.budget += state.budgetIncomeAmount;
        state.nextIncomeAt += state.budgetIncomeInterval;
      }

      state.satellites.forEach(sat => sat.age++);
      state.debrisRemovalVehicles.forEach(drv => drv.age++);
    },
  },
});

export const {
  initializeGame,
  launchSatellite,
  launchDRV,
  spendBudget,
  addBudget,
  advanceTurn,
} = gameSlice.actions;

export default gameSlice.reducer;
