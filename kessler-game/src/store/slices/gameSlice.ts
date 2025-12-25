import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameState, OrbitLayer, SatelliteType, InsuranceTier, DRVType, DRVTargetPriority, BudgetDifficulty, DebrisRemovalVehicle } from '../../game/types';
import { BUDGET_DIFFICULTY_CONFIG, MAX_STEPS, LAYER_BOUNDS, DRV_CONFIG, LEO_LIFETIME } from '../../game/constants';
import { detectCollisions, generateDebrisFromCollision, calculateTotalPayout } from '../../game/engine/collision';
import { processDRVRemoval } from '../../game/engine/debrisRemoval';

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

    processDRVOperations: (state) => {
      const activeDRVs = state.debrisRemovalVehicles.filter(drv => drv.age < drv.maxAge);

      activeDRVs.forEach(drv => {
        const result = processDRVRemoval(drv, state.debris);

        drv.debrisRemoved += result.removedDebrisIds.length;

        state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
      });
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

      state.satellites = state.satellites.filter(
        sat => sat.layer !== 'LEO' || sat.age < LEO_LIFETIME
      );
    },

    processCollisions: (state) => {
      const collisions = detectCollisions(state.satellites, state.debris);

      if (collisions.length === 0) {
        return;
      }

      const destroyedSatelliteIds = new Set<string>();
      const newDebris = [];

      for (const collision of collisions) {
        const { obj1, obj2, layer } = collision;

        const isSat1 = 'purpose' in obj1;
        const isSat2 = 'purpose' in obj2;

        if (isSat1) {
          destroyedSatelliteIds.add(obj1.id);
        }
        if (isSat2) {
          destroyedSatelliteIds.add(obj2.id);
        }

        const collisionX = (obj1.x + obj2.x) / 2;
        const collisionY = (obj1.y + obj2.y) / 2;

        const debris = generateDebrisFromCollision(collisionX, collisionY, layer, generateId);
        newDebris.push(...debris);
      }

      const destroyedSatellites = state.satellites.filter(sat => 
        destroyedSatelliteIds.has(sat.id)
      );

      const insurancePayout = calculateTotalPayout(destroyedSatellites);

      state.satellites = state.satellites.filter(sat => 
        !destroyedSatelliteIds.has(sat.id)
      );

      state.debris.push(...newDebris);

      state.budget += insurancePayout;
    },

    decommissionExpiredDRVs: (state) => {
      const remaining: DebrisRemovalVehicle[] = [];
      
      state.debrisRemovalVehicles.forEach(drv => {
        if (drv.age >= drv.maxAge) {
          state.debris.push({
            id: generateId(),
            x: drv.x,
            y: drv.y,
            layer: drv.layer,
            type: 'cooperative',
          });
        } else {
          remaining.push(drv);
        }
      });
      
      state.debrisRemovalVehicles = remaining;
    },
  },
});

export const {
  initializeGame,
  launchSatellite,
  launchDRV,
  spendBudget,
  addBudget,
  processDRVOperations,
  advanceTurn,
  processCollisions,
  decommissionExpiredDRVs,
} = gameSlice.actions;

export default gameSlice.reducer;
