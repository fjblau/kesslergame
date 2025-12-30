import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GameState, OrbitLayer, SatelliteType, InsuranceTier, DRVType, DRVTargetPriority, BudgetDifficulty, DebrisRemovalVehicle, ExpiredDRVInfo, DebrisRemovalInfo, GraveyardMoveInfo } from '../../game/types';
import { BUDGET_DIFFICULTY_CONFIG, MAX_STEPS, LAYER_BOUNDS, DRV_CONFIG, MAX_DEBRIS_LIMIT, ORBITAL_SPEEDS, CASCADE_THRESHOLD, RISK_SPEED_MULTIPLIERS, SATELLITE_REVENUE, OBJECT_RADII, CAPTURE_RADIUS_MULTIPLIER } from '../../game/constants';
import { detectCollisions, generateDebrisFromCollision, calculateTotalPayout } from '../../game/engine/collision';
import { processDRVRemoval, processCooperativeDRVOperations, moveCooperativeDRV, processGeoTugOperations } from '../../game/engine/debrisRemoval';
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

function getEntitySpeedVariation(id: string, layer: OrbitLayer, orbitalSpeeds: { LEO: number; MEO: number; GEO: number; GRAVEYARD: number }): number {
  const baseSpeed = orbitalSpeeds[layer];
  const hash = hashId(id);
  const multiplier = 0.7 + (hash % 600) / 1000;
  return baseSpeed * multiplier;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

function loadCollisionSettings() {
  try {
    const angle = localStorage.getItem('collisionAngleThreshold');
    const radius = localStorage.getItem('collisionRadiusMultiplier');
    const debrisPerCollision = localStorage.getItem('debrisPerCollision');
    return {
      angle: angle ? parseFloat(angle) : 5,
      radius: radius ? parseFloat(radius) : 0.5,
      debrisPerCollision: debrisPerCollision ? parseFloat(debrisPerCollision) : 5,
    };
  } catch {
    return { angle: 5, radius: 0.5, debrisPerCollision: 5 };
  }
}

function loadOrbitalSpeedSettings() {
  try {
    const leo = localStorage.getItem('orbitalSpeedLEO');
    const meo = localStorage.getItem('orbitalSpeedMEO');
    const geo = localStorage.getItem('orbitalSpeedGEO');
    return {
      leo: leo ? parseFloat(leo) : ORBITAL_SPEEDS.LEO,
      meo: meo ? parseFloat(meo) : ORBITAL_SPEEDS.MEO,
      geo: geo ? parseFloat(geo) : ORBITAL_SPEEDS.GEO,
    };
  } catch {
    return { 
      leo: ORBITAL_SPEEDS.LEO,
      meo: ORBITAL_SPEEDS.MEO,
      geo: ORBITAL_SPEEDS.GEO,
    };
  }
}

function loadSolarStormSettings() {
  try {
    const probability = localStorage.getItem('solarStormProbability');
    return probability ? parseFloat(probability) : 0.10;
  } catch {
    return 0.10;
  }
}

function loadDRVSettings() {
  try {
    const capacityMin = localStorage.getItem('drvUncooperativeCapacityMin');
    const capacityMax = localStorage.getItem('drvUncooperativeCapacityMax');
    const successRate = localStorage.getItem('drvUncooperativeSuccessRate');
    return {
      capacityMin: capacityMin ? parseFloat(capacityMin) : DRV_CONFIG.capacity.uncooperative[0],
      capacityMax: capacityMax ? parseFloat(capacityMax) : DRV_CONFIG.capacity.uncooperative[1],
      successRate: successRate ? parseFloat(successRate) : DRV_CONFIG.successRate.uncooperative,
    };
  } catch {
    return {
      capacityMin: DRV_CONFIG.capacity.uncooperative[0],
      capacityMax: DRV_CONFIG.capacity.uncooperative[1],
      successRate: DRV_CONFIG.successRate.uncooperative,
    };
  }
}

function loadRiskSpeedSettings() {
  try {
    const low = localStorage.getItem('riskSpeedMultiplierLOW');
    const medium = localStorage.getItem('riskSpeedMultiplierMEDIUM');
    const critical = localStorage.getItem('riskSpeedMultiplierCRITICAL');
    return {
      LOW: low ? parseFloat(low) : RISK_SPEED_MULTIPLIERS.LOW,
      MEDIUM: medium ? parseFloat(medium) : RISK_SPEED_MULTIPLIERS.MEDIUM,
      CRITICAL: critical ? parseFloat(critical) : RISK_SPEED_MULTIPLIERS.CRITICAL,
    };
  } catch {
    return {
      LOW: RISK_SPEED_MULTIPLIERS.LOW,
      MEDIUM: RISK_SPEED_MULTIPLIERS.MEDIUM,
      CRITICAL: RISK_SPEED_MULTIPLIERS.CRITICAL,
    };
  }
}

function loadSoundSettings() {
  try {
    const enabled = localStorage.getItem('soundEnabled');
    return enabled !== null ? enabled === 'true' : true;
  } catch {
    return true;
  }
}

function loadDRVDecommissionTime() {
  try {
    const time = localStorage.getItem('drvDecommissionTime');
    return time ? parseInt(time) : DRV_CONFIG.duration.cooperative;
  } catch {
    return DRV_CONFIG.duration.cooperative;
  }
}

const savedCollisionSettings = loadCollisionSettings();
const savedOrbitalSpeedSettings = loadOrbitalSpeedSettings();
const savedSolarStormSettings = loadSolarStormSettings();
const savedDRVSettings = loadDRVSettings();
const savedRiskSpeedSettings = loadRiskSpeedSettings();
const savedSoundEnabled = loadSoundSettings();
const savedDRVDecommissionTime = loadDRVDecommissionTime();

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
  collisionAngleThreshold: savedCollisionSettings.angle,
  collisionRadiusMultiplier: savedCollisionSettings.radius,
  debrisPerCollision: savedCollisionSettings.debrisPerCollision,
  orbitalSpeedLEO: savedOrbitalSpeedSettings.leo,
  orbitalSpeedMEO: savedOrbitalSpeedSettings.meo,
  orbitalSpeedGEO: savedOrbitalSpeedSettings.geo,
  orbitalSpeedGRAVEYARD: ORBITAL_SPEEDS.GRAVEYARD,
  solarStormProbability: savedSolarStormSettings,
  drvUncooperativeCapacityMin: savedDRVSettings.capacityMin,
  drvUncooperativeCapacityMax: savedDRVSettings.capacityMax,
  drvUncooperativeSuccessRate: savedDRVSettings.successRate,
  recentCollisions: [],
  recentlyExpiredDRVs: [],
  recentDebrisRemovals: [],
  recentGraveyardMoves: [],
  cascadeTriggered: false,
  lastCascadeTurn: undefined,
  totalCascades: 0,
  satellitesRecovered: 0,
  riskSpeedMultipliers: {
    LOW: savedRiskSpeedSettings.LOW,
    MEDIUM: savedRiskSpeedSettings.MEDIUM,
    CRITICAL: savedRiskSpeedSettings.CRITICAL,
  },
  soundEnabled: savedSoundEnabled,
  drvDecommissionTime: savedDRVDecommissionTime,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, action: PayloadAction<BudgetDifficulty>) => {
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
        history: state?.history || [],
        riskLevel: 'LOW',
        gameOver: false,
        recentCollisions: [],
        recentlyExpiredDRVs: [],
        recentDebrisRemovals: [],
        cascadeTriggered: false,
        lastCascadeTurn: undefined,
        totalCascades: 0,
        satellitesRecovered: 0,
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
      state.recentlyExpiredDRVs = [];
      state.recentDebrisRemovals = [];
      state.cascadeTriggered = false;
      state.lastCascadeTurn = undefined;
      state.totalCascades = 0;
      state.satellitesRecovered = 0;
    },

    launchSatellite: {
      reducer: (state, action: PayloadAction<{
        orbit: OrbitLayer;
        insuranceTier: InsuranceTier;
        purpose: SatelliteType;
        turn: number;
        day: number;
      }>) => {
        const { orbit, insuranceTier, purpose } = action.payload;
        const satellite = {
          id: generateId(),
          ...randomPositionInLayer(orbit),
          layer: orbit,
          purpose,
          age: 0,
          insuranceTier,
          radius: OBJECT_RADII.satellite,
          captureRadius: OBJECT_RADII.satellite * CAPTURE_RADIUS_MULTIPLIER,
        };
        state.satellites.push(satellite);
      },
      prepare: (payload: {
        orbit: OrbitLayer;
        insuranceTier: InsuranceTier;
        purpose: SatelliteType;
        turn?: number;
        day?: number;
      }) => ({
        payload: { 
          ...payload, 
          turn: payload.turn ?? 0,
          day: payload.day ?? 0
        }
      })
    },

    launchDRV: {
      reducer: (state, action: PayloadAction<{
        orbit: OrbitLayer;
        drvType: DRVType;
        targetPriority: DRVTargetPriority;
        turn: number;
        day: number;
      }>) => {
        const { orbit, drvType, targetPriority } = action.payload;
        const [minCapacity, maxCapacity] = drvType === 'uncooperative' 
          ? [state.drvUncooperativeCapacityMin, state.drvUncooperativeCapacityMax]
          : DRV_CONFIG.capacity[drvType];
        const successRate = drvType === 'uncooperative'
          ? state.drvUncooperativeSuccessRate
          : DRV_CONFIG.successRate[drvType];
        const drv = {
          id: generateId(),
          ...randomPositionInLayer(orbit),
          layer: orbit,
          removalType: drvType,
          targetPriority,
          age: 0,
          maxAge: state.drvDecommissionTime,
          capacity: Math.floor(Math.random() * (maxCapacity - minCapacity + 1)) + minCapacity,
          successRate,
          debrisRemoved: 0,
          radius: OBJECT_RADII.drv,
          captureRadius: OBJECT_RADII.drv * CAPTURE_RADIUS_MULTIPLIER,
        };
        state.debrisRemovalVehicles.push(drv);
      },
      prepare: (payload: {
        orbit: OrbitLayer;
        drvType: DRVType;
        targetPriority: DRVTargetPriority;
        turn?: number;
        day?: number;
      }) => ({
        payload: { 
          ...payload, 
          turn: payload.turn ?? 0,
          day: payload.day ?? 0
        }
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
      const removalEvents: DebrisRemovalInfo[] = [];
      const graveyardMoves: GraveyardMoveInfo[] = [];

      activeDRVs.forEach(drv => {
        if (drv.removalType === 'cooperative') {
          const result = processCooperativeDRVOperations(drv, state.debris, state.satellites, state.debrisRemovalVehicles);
          
          const totalRemoved = result.removedDebrisIds.length + result.removedSatelliteIds.length;
          drv.debrisRemoved += totalRemoved;
          
          drv.targetDebrisId = result.newTargetId;
          drv.capturedDebrisId = result.capturedObjectId;
          drv.captureOrbitsRemaining = result.captureOrbitsRemaining;
          drv.targetingTurnsRemaining = result.targetingTurnsRemaining;
          
          if (result.removedSatelliteIds.length > 0) {
            state.satellitesRecovered += result.removedSatelliteIds.length;
          }
          
          if (totalRemoved > 0) {
            const removedDebris = state.debris.filter(d => result.removedDebrisIds.includes(d.id));
            removedDebris.forEach(debris => {
              removalEvents.push({
                drvId: drv.id,
                drvType: drv.removalType,
                layer: drv.layer,
                debrisType: debris.type,
                count: 1,
              });
            });
          }
          
          state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
          if (result.removedSatelliteIds.length > 0) {
            console.log(`[GameSlice] Filtering satellites, before: ${state.satellites.length}, removing: ${result.removedSatelliteIds}`);
          }
          state.satellites = state.satellites.filter(s => !result.removedSatelliteIds.includes(s.id));
          if (result.removedSatelliteIds.length > 0) {
            console.log(`[GameSlice] Filtered satellites, after: ${state.satellites.length}`);
          }
        } else if (drv.removalType === 'geotug') {
          const result = processGeoTugOperations(drv, state.satellites, state.debrisRemovalVehicles);
          
          drv.targetDebrisId = result.newTargetId;
          drv.capturedDebrisId = result.capturedSatelliteId;
          drv.captureOrbitsRemaining = result.captureOrbitsRemaining;
          drv.targetingTurnsRemaining = result.targetingTurnsRemaining;
          
          if (result.movedSatelliteId) {
            const satellite = state.satellites.find(s => s.id === result.movedSatelliteId);
            if (satellite) {
              graveyardMoves.push({
                satelliteId: satellite.id,
                tugId: drv.id,
                purpose: satellite.purpose,
              });
              satellite.layer = 'GRAVEYARD';
              satellite.inGraveyard = true;
              satellite.y = 175;
            }
          }
          
          if (result.shouldDecommission) {
            drv.age = drv.maxAge;
            drv.targetDebrisId = undefined;
            drv.capturedDebrisId = undefined;
            drv.captureOrbitsRemaining = undefined;
          }
        } else {
          const result = processDRVRemoval(drv, state.debris);
          
          drv.debrisRemoved += result.removedDebrisIds.length;
          
          if (result.removedDebrisIds.length > 0) {
            const removedDebris = state.debris.filter(d => result.removedDebrisIds.includes(d.id));
            removedDebris.forEach(debris => {
              removalEvents.push({
                drvId: drv.id,
                drvType: drv.removalType,
                layer: drv.layer,
                debrisType: debris.type,
                count: 1,
              });
            });
          }
          
          state.debris = state.debris.filter(d => !result.removedDebrisIds.includes(d.id));
        }
      });

      state.recentDebrisRemovals = removalEvents;
      state.recentGraveyardMoves = graveyardMoves;
      state.riskLevel = calculateRiskLevel(state.debris.length);
    },

    advanceTurn: (state) => {
      state.step += 1;

      if (state.step === 1) {
        state.history = [];
      }

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
      
      const orbitalSpeeds = {
        LEO: state.orbitalSpeedLEO,
        MEO: state.orbitalSpeedMEO,
        GEO: state.orbitalSpeedGEO,
        GRAVEYARD: state.orbitalSpeedGRAVEYARD,
      };
      
      state.satellites.forEach(sat => {
        sat.age++;
        if (!capturedObjectIds.has(sat.id)) {
          const speed = getEntitySpeedVariation(sat.id, sat.layer, orbitalSpeeds);
          sat.x = (sat.x + speed) % 100;
        }
      });
      state.debrisRemovalVehicles.forEach(drv => {
        drv.age++;
        if (drv.removalType === 'uncooperative') {
          const speed = getEntitySpeedVariation(drv.id, drv.layer, orbitalSpeeds);
          drv.x = (drv.x + speed) % 100;
        } else if (drv.removalType === 'geotug') {
          const targetSatellite = state.satellites.find(s => s.id === drv.targetDebrisId);
          const newPosition = moveCooperativeDRV(drv, targetSatellite);
          drv.x = newPosition.x;
          drv.y = newPosition.y;
        } else {
          const speed = getEntitySpeedVariation(drv.id, drv.layer, orbitalSpeeds);
          drv.x = (drv.x + speed) % 100;
        }
      });
      
      state.debris.forEach(deb => {
        if (!capturedObjectIds.has(deb.id)) {
          const speed = getEntitySpeedVariation(deb.id, deb.layer, orbitalSpeeds);
          deb.x = (deb.x + speed) % 100;
        }
      });

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

    addSatelliteRevenue: (state) => {
      const satelliteRevenue = state.satellites.reduce((total, sat) => {
        return total + SATELLITE_REVENUE[sat.purpose];
      }, 0);

      if (satelliteRevenue > 0) {
        state.budget += satelliteRevenue;
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

      if (collisions.length >= CASCADE_THRESHOLD) {
        state.cascadeTriggered = true;
        state.lastCascadeTurn = state.step;
        state.totalCascades += 1;
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
          objectIds: [obj1.id, obj2.id],
        });

        const debris = generateDebrisFromCollision(collisionX, collisionY, layer, generateId, state.debrisPerCollision);
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
      const expired: ExpiredDRVInfo[] = [];
      
      state.debrisRemovalVehicles.forEach(drv => {
        const hasActiveTarget = drv.targetDebrisId !== undefined;
        const hasCapturedObject = drv.capturedDebrisId !== undefined;
        const shouldKeepActive = hasActiveTarget || hasCapturedObject;
        
        if (drv.age >= drv.maxAge && !shouldKeepActive) {
          expired.push({
            id: drv.id,
            type: drv.removalType,
            layer: drv.layer,
            debrisRemoved: drv.debrisRemoved,
          });
        } else {
          remaining.push(drv);
        }
      });
      
      state.debrisRemovalVehicles = remaining;
      state.recentlyExpiredDRVs = expired;

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
      try {
        localStorage.setItem('collisionAngleThreshold', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setCollisionRadiusMultiplier: (state, action: PayloadAction<number>) => {
      state.collisionRadiusMultiplier = action.payload;
      try {
        localStorage.setItem('collisionRadiusMultiplier', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setDebrisPerCollision: (state, action: PayloadAction<number>) => {
      state.debrisPerCollision = action.payload;
      try {
        localStorage.setItem('debrisPerCollision', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setOrbitalSpeedLEO: (state, action: PayloadAction<number>) => {
      state.orbitalSpeedLEO = action.payload;
      try {
        localStorage.setItem('orbitalSpeedLEO', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setOrbitalSpeedMEO: (state, action: PayloadAction<number>) => {
      state.orbitalSpeedMEO = action.payload;
      try {
        localStorage.setItem('orbitalSpeedMEO', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setOrbitalSpeedGEO: (state, action: PayloadAction<number>) => {
      state.orbitalSpeedGEO = action.payload;
      try {
        localStorage.setItem('orbitalSpeedGEO', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setSolarStormProbability: (state, action: PayloadAction<number>) => {
      state.solarStormProbability = action.payload;
      try {
        localStorage.setItem('solarStormProbability', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setDRVUncooperativeCapacityMin: (state, action: PayloadAction<number>) => {
      state.drvUncooperativeCapacityMin = action.payload;
      try {
        localStorage.setItem('drvUncooperativeCapacityMin', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setDRVUncooperativeCapacityMax: (state, action: PayloadAction<number>) => {
      state.drvUncooperativeCapacityMax = action.payload;
      try {
        localStorage.setItem('drvUncooperativeCapacityMax', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setDRVUncooperativeSuccessRate: (state, action: PayloadAction<number>) => {
      state.drvUncooperativeSuccessRate = action.payload;
      try {
        localStorage.setItem('drvUncooperativeSuccessRate', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    clearCascadeFlag: (state) => {
      state.cascadeTriggered = false;
    },

    setRiskSpeedMultiplierLOW: (state, action: PayloadAction<number>) => {
      state.riskSpeedMultipliers.LOW = action.payload;
      try {
        localStorage.setItem('riskSpeedMultiplierLOW', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setRiskSpeedMultiplierMEDIUM: (state, action: PayloadAction<number>) => {
      state.riskSpeedMultipliers.MEDIUM = action.payload;
      try {
        localStorage.setItem('riskSpeedMultiplierMEDIUM', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setRiskSpeedMultiplierCRITICAL: (state, action: PayloadAction<number>) => {
      state.riskSpeedMultipliers.CRITICAL = action.payload;
      try {
        localStorage.setItem('riskSpeedMultiplierCRITICAL', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
      try {
        localStorage.setItem('soundEnabled', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
    },

    setDRVDecommissionTime: (state, action: PayloadAction<number>) => {
      state.drvDecommissionTime = action.payload;
      try {
        localStorage.setItem('drvDecommissionTime', action.payload.toString());
      } catch {
        // Ignore localStorage errors
      }
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
  addSatelliteRevenue,
  processCollisions,
  decommissionExpiredDRVs,
  triggerSolarStorm,
  checkGameOver,
  clearOldCollisions,
  setCollisionAngleThreshold,
  setCollisionRadiusMultiplier,
  setDebrisPerCollision,
  setOrbitalSpeedLEO,
  setOrbitalSpeedMEO,
  setOrbitalSpeedGEO,
  setSolarStormProbability,
  setDRVUncooperativeCapacityMin,
  setDRVUncooperativeCapacityMax,
  setDRVUncooperativeSuccessRate,
  clearCascadeFlag,
  setRiskSpeedMultiplierLOW,
  setRiskSpeedMultiplierMEDIUM,
  setRiskSpeedMultiplierCRITICAL,
  setSoundEnabled,
  setDRVDecommissionTime,
} = gameSlice.actions;

export default gameSlice.reducer;
