import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameState, OrbitLayer, SatelliteType, InsuranceTier, DRVType, DRVTargetPriority, BudgetDifficulty, DebrisRemovalVehicle } from '../../game/types';
import { BUDGET_DIFFICULTY_CONFIG, MAX_STEPS, LAYER_BOUNDS, DRV_CONFIG, LEO_LIFETIME, MAX_DEBRIS_LIMIT, ORBITAL_SPEEDS } from '../../game/constants';
import { detectCollisions, generateDebrisFromCollision, calculateTotalPayout } from '../../game/engine/collision';
import { processDRVRemoval, processCooperativeDRVOperations, moveCooperativeDRV } from '../../game/engine/debrisRemoval';
import { calculateRiskLevel } from '../../game/engine/risk';
import { processSolarStorm } from '../../game/engine/events';

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getEntitySpeedVariation(id: string, layer: OrbitLayer): number {
  const baseSpeed = ORBITAL_SPEEDS[layer];
  const hash = hashId(id);
  const multiplier = 0.7 + (hash % 600) / 1000;
  return baseSpeed * multiplier;
}

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
  days: 0,
  satellites: [],
  debris: [],
  debrisRemovalVehicles: [],
  budget: BUDGET_DIFFICULTY_CONFIG.normal.startingBudget,
  budgetDifficulty: 'normal',
  budgetIncomeAmount: BUDGET_DIFFICULTY_CONFIG.normal.incomeAmount,
  budgetIncomeInterval: BUDGET_DIFFICULTY_CONFIG.normal.incomeInterval,
  budgetDrainAmount: BUDGET_DIFFICULTY_CONFIG.normal.drainAmount,
  nextIncomeAt: BUDGET_DIFFICULTY_CONFIG.normal.incomeInterval,
  history: [],
  riskLevel: 'LOW',
  gameOver: false,
  collisionAngleThreshold: 15,
  collisionRadiusMultiplier: 1,
  recentCollisions: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (_state, action: PayloadAction<BudgetDifficulty>) => {
      const config = BUDGET_DIFFICULTY_CONFIG[action.payload];
      return {
        ...initialState,
        days: 0,
        budget: config.startingBudget,
        budgetDifficulty: action.payload,
        budgetIncomeAmount: config.incomeAmount,
        budgetIncomeInterval: config.incomeInterval,
        budgetDrainAmount: config.drainAmount,
        nextIncomeAt: config.incomeInterval,
        history: [],
        riskLevel: 'LOW',
        gameOver: false,
        recentCollisions: [],
      };
    },

    incrementDays: (state) => {
      state.days += 1;
    },

    resetGame: (state) => {
      const config = BUDGET_DIFFICULTY_CONFIG[state.budgetDifficulty];
      state.step = 0;
      state.days = 0;
      state.satellites = [];
      state.debris = [];
      state.debrisRemovalVehicles = [];
      state.budget = config.startingBudget;
      state.budgetIncomeAmount = config.incomeAmount;
      state.budgetIncomeInterval = config.incomeInterval;
      state.budgetDrainAmount = config.drainAmount;
      state.nextIncomeAt = config.incomeInterval;
      state.history = [];
      state.riskLevel = 'LOW';
      state.gameOver = false;
      state.recentCollisions = [];
    },

    launchSatellite: {
      reducer: (state, action: PayloadAction<{
        orbit: OrbitLayer;
        insuranceTier: InsuranceTier;
        purpose: SatelliteType;
        turn: number;
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
      prepare: (payload: {
        orbit: OrbitLayer;
        insuranceTier: InsuranceTier;
        purpose: SatelliteType;
        turn?: number;
      }) => ({
        payload: { ...payload, turn: payload.turn ?? 0 }
      })
    },

    launchDRV: {
      reducer: (state, action: PayloadAction<{
        orbit: OrbitLayer;
        drvType: DRVType;
        targetPriority: DRVTargetPriority;
        turn: number;
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
      prepare: (payload: {
        orbit: OrbitLayer;
        drvType: DRVType;
        targetPriority: DRVTargetPriority;
        turn?: number;
      }) => ({
        payload: { ...payload, turn: payload.turn ?? 0 }
      })
    },

    spendBudget: (state, action: PayloadAction<number>) => {
      state.budget -= action.payload;
      if (state.budget < 0 || state.step >= state.maxSteps || state.debris.length > MAX_DEBRIS_LIMIT) {
        state.gameOver = true;
      }
    },

    addBudget: (state, action: PayloadAction<number>) => {
      state.budget += action.payload;
    },

    processDRVOperations: (state) => {
      const activeDRVs = state.debrisRemovalVehicles.filter(drv => drv.age < drv.maxAge);

      activeDRVs.forEach(drv => {
        if (drv.removalType === 'cooperative') {
          const result = processCooperativeDRVOperations(drv, state.debris, state.satellites);
          
          drv.debrisRemoved += result.removedDebrisIds.length + result.removedSatelliteIds.length;
          drv.targetDebrisId = result.newTargetId;
          drv.capturedDebrisId = result.capturedObjectId;
          drv.captureOrbitsRemaining = result.captureOrbitsRemaining;
          
          state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
          state.satellites = state.satellites.filter(s => !result.removedSatelliteIds.includes(s.id));
        } else {
          const result = processDRVRemoval(drv, state.debris);
          
          drv.debrisRemoved += result.removedDebrisIds.length;
          
          state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
        }
      });

      state.riskLevel = calculateRiskLevel(state.debris.length);
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

      const capturedObjectIds = new Set(
        state.debrisRemovalVehicles
          .filter(drv => drv.capturedDebrisId)
          .map(drv => drv.capturedDebrisId)
      );
      
      state.satellites.forEach(sat => {
        sat.age++;
        if (!capturedObjectIds.has(sat.id)) {
          const speed = getEntitySpeedVariation(sat.id, sat.layer);
          sat.x = (sat.x + speed) % 100;
        }
      });
      state.debrisRemovalVehicles.forEach(drv => {
        drv.age++;
        if (drv.removalType === 'uncooperative') {
          const speed = getEntitySpeedVariation(drv.id, drv.layer);
          drv.x = (drv.x + speed) % 100;
        } else {
          const targetDebris = state.debris.find(d => d.id === drv.targetDebrisId);
          const targetSatellite = state.satellites.find(s => s.id === drv.targetDebrisId);
          const target = targetDebris || targetSatellite;
          const newPosition = moveCooperativeDRV(drv, target);
          drv.x = newPosition.x;
          drv.y = newPosition.y;
          
          if (drv.capturedDebrisId) {
            const capturedDebris = state.debris.find(d => d.id === drv.capturedDebrisId);
            const capturedSatellite = state.satellites.find(s => s.id === drv.capturedDebrisId);
            if (capturedDebris) {
              capturedDebris.x = drv.x;
              capturedDebris.y = drv.y;
            } else if (capturedSatellite) {
              capturedSatellite.x = drv.x;
              capturedSatellite.y = drv.y;
            }
          }
        }
      });
      
      state.debris.forEach(deb => {
        if (!capturedObjectIds.has(deb.id)) {
          const speed = getEntitySpeedVariation(deb.id, deb.layer);
          deb.x = (deb.x + speed) % 100;
        }
      });

      state.satellites = state.satellites.filter(
        sat => sat.layer !== 'LEO' || sat.age < LEO_LIFETIME
      );

      const totalDebrisRemoved = state.debrisRemovalVehicles.reduce(
        (sum, drv) => sum + drv.debrisRemoved,
        0
      );
      const activeDRVs = state.debrisRemovalVehicles.filter(
        drv => drv.age < drv.maxAge
      ).length;

      state.history.push({
        turn: state.step,
        debrisCount: state.debris.length,
        satelliteCount: state.satellites.length,
        debrisRemoved: totalDebrisRemoved,
        activeDRVCount: activeDRVs,
      });

      if (state.budget < 0 || state.step >= state.maxSteps || state.debris.length > MAX_DEBRIS_LIMIT) {
        state.gameOver = true;
      }
    },

    processCollisions: (state) => {
      const collisions = detectCollisions(
        state.satellites, 
        state.debris,
        state.collisionAngleThreshold,
        state.collisionRadiusMultiplier,
        state.debrisRemovalVehicles
      );

      if (collisions.length === 0) {
        return;
      }

      const destroyedSatelliteIds = new Set<string>();
      const destroyedDRVIds = new Set<string>();
      const newDebris = [];
      const collisionEvents = [];

      for (const collision of collisions) {
        const { obj1, obj2, layer } = collision;

        const isSat1 = 'purpose' in obj1;
        const isSat2 = 'purpose' in obj2;
        const isDRV1 = 'removalType' in obj1;
        const isDRV2 = 'removalType' in obj2;

        if (isSat1) {
          destroyedSatelliteIds.add(obj1.id);
        } else if (isDRV1) {
          destroyedDRVIds.add(obj1.id);
        }
        
        if (isSat2) {
          destroyedSatelliteIds.add(obj2.id);
        } else if (isDRV2) {
          destroyedDRVIds.add(obj2.id);
        }

        const collisionX = (obj1.x + obj2.x) / 2;
        const collisionY = (obj1.y + obj2.y) / 2;

        collisionEvents.push({
          id: generateId(),
          x: collisionX,
          y: collisionY,
          layer,
          timestamp: Date.now(),
        });

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

      state.debrisRemovalVehicles = state.debrisRemovalVehicles.filter(drv =>
        !destroyedDRVIds.has(drv.id)
      );

      state.debris.push(...newDebris);

      state.budget += insurancePayout;

      state.recentCollisions.push(...collisionEvents);

      state.riskLevel = calculateRiskLevel(state.debris.length);

      if (state.budget < 0 || state.step >= state.maxSteps || state.debris.length > MAX_DEBRIS_LIMIT) {
        state.gameOver = true;
      }
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

      state.riskLevel = calculateRiskLevel(state.debris.length);
    },

    triggerSolarStorm: (state) => {
      const result = processSolarStorm(state.debris);
      state.debris = result.remainingDebris;
      state.riskLevel = calculateRiskLevel(state.debris.length);
    },

    checkGameOver: (state) => {
      if (state.budget < 0 || state.step >= state.maxSteps || state.debris.length > MAX_DEBRIS_LIMIT) {
        state.gameOver = true;
      }
    },

    clearOldCollisions: (state) => {
      const now = Date.now();
      state.recentCollisions = state.recentCollisions.filter(
        collision => now - collision.timestamp < 1000
      );
    },

    setCollisionAngleThreshold: (state, action: PayloadAction<number>) => {
      state.collisionAngleThreshold = action.payload;
    },

    setCollisionRadiusMultiplier: (state, action: PayloadAction<number>) => {
      state.collisionRadiusMultiplier = action.payload;
    },
  },
});

export const {
  initializeGame,
  incrementDays,
  resetGame,
  launchSatellite,
  launchDRV,
  spendBudget,
  addBudget,
  processDRVOperations,
  advanceTurn,
  processCollisions,
  decommissionExpiredDRVs,
  triggerSolarStorm,
  checkGameOver,
  clearOldCollisions,
  setCollisionAngleThreshold,
  setCollisionRadiusMultiplier,
} = gameSlice.actions;

export default gameSlice.reducer;
