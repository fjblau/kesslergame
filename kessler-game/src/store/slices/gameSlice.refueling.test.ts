import { describe, it, expect, beforeEach } from 'vitest';
import gameReducer, { 
  launchSatellite, 
  launchDRV, 
  processDRVOperations, 
  expireSatellites 
} from './gameSlice';
import type { GameState } from '../../game/types';
import { SATELLITE_LIFESPAN } from '../../game/constants';
import { SATELLITE_METADATA } from '../../game/satelliteMetadata';

describe('Refueling Vehicle Integration Tests', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      step: 0,
      maxSteps: 1000,
      days: 0,
      playerName: 'Test Player',
      satellites: [],
      debris: [],
      debrisRemovalVehicles: [],
      budget: 50_000_000,
      budgetDifficulty: 'normal',
      budgetIncomeAmount: 5_000_000,
      budgetIncomeInterval: 30,
      budgetDrainAmount: 1_000_000,
      nextIncomeAt: 30,
      history: [],
      riskLevel: 'LOW',
      gameOver: false,
      recentCollisions: [],
      recentlyExpiredDRVs: [],
      recentlyExpiredSatellites: [],
      recentDebrisRemovals: [],
      recentSatelliteCaptures: [],
      recentGraveyardMoves: [],
      recentlyLaunchedSatellites: [],
      recentRefuelings: [],
      satellitesExpired: 0,
      collisionAngleThreshold: 45,
      collisionRadiusMultiplier: 1.5,
      debrisPerCollision: 3,
      orbitalSpeedLEO: 7.8,
      orbitalSpeedMEO: 3.9,
      orbitalSpeedGEO: 3.1,
      orbitalSpeedGRAVEYARD: 3.0,
      solarStormProbability: 0.01,
      drvUncooperativeCapacityMin: 6,
      drvUncooperativeCapacityMax: 9,
      drvUncooperativeSuccessRate: 0.90,
      cascadeTriggered: false,
      totalCascades: 0,
      satellitesRecovered: 0,
      riskSpeedMultipliers: {
        LOW: 1,
        MEDIUM: 1.5,
        CRITICAL: 2,
      },
      soundEnabled: true,
      drvDecommissionTime: 15,
      availableSatellitePool: [...SATELLITE_METADATA],
      collisionPauseCooldown: 0,
      budgetPauseCooldown: 0,
      totalCooperativeDebrisRemoved: 0,
      totalUncooperativeDebrisRemoved: 0,
    };
  });

  describe('Satellite Lifespan System', () => {
    it('should set correct maxAge for LEO satellites', () => {
      const state = gameReducer(initialState, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      expect(state.satellites).toHaveLength(1);
      expect(state.satellites[0].maxAge).toBe(SATELLITE_LIFESPAN.LEO);
      expect(state.satellites[0].maxAge).toBe(20);
    });

    it('should set correct maxAge for MEO satellites', () => {
      const state = gameReducer(initialState, launchSatellite({
        orbit: 'MEO',
        purpose: 'GPS',
        insuranceTier: 'premium',
      }));

      expect(state.satellites[0].maxAge).toBe(SATELLITE_LIFESPAN.MEO);
      expect(state.satellites[0].maxAge).toBe(40);
    });

    it('should set correct maxAge for GEO satellites', () => {
      const state = gameReducer(initialState, launchSatellite({
        orbit: 'GEO',
        purpose: 'Weather',
        insuranceTier: 'none',
      }));

      expect(state.satellites[0].maxAge).toBe(SATELLITE_LIFESPAN.GEO);
      expect(state.satellites[0].maxAge).toBe(60);
    });

    it('should expire satellites when they reach maxAge', () => {
      let state = gameReducer(initialState, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 20}))
      };
      state = gameReducer(state, expireSatellites());

      expect(state.satellites).toHaveLength(0);
      expect(state.satellitesExpired).toBe(1);
    });

    it('should not expire satellites below maxAge', () => {
      let state = gameReducer(initialState, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 19}))
      };
      state = gameReducer(state, expireSatellites());

      expect(state.satellites).toHaveLength(1);
      expect(state.satellitesExpired).toBe(0);
    });

    it('should not expire satellites captured by a DRV', () => {
      let state = gameReducer(initialState, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      const satelliteId = state.satellites[0].id;
      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 20}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = {
        ...state,
        debrisRemovalVehicles: state.debrisRemovalVehicles.map(drv => ({
          ...drv,
          capturedDebrisId: satelliteId,
          captureOrbitsRemaining: 2
        }))
      };

      state = gameReducer(state, expireSatellites());

      expect(state.satellites).toHaveLength(1);
      expect(state.satellitesExpired).toBe(0);
    });

    it('should not expire satellites being refueled even if age >= maxAge', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      const satelliteId = state.satellites[0].id;
      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 20}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());

      state = gameReducer(state, processDRVOperations());

      expect(state.debrisRemovalVehicles[0].capturedDebrisId).toBe(satelliteId);

      state = gameReducer(state, expireSatellites());

      expect(state.satellites).toHaveLength(1);
      expect(state.satellitesExpired).toBe(0);

      state = gameReducer(state, processDRVOperations());
      state = gameReducer(state, processDRVOperations());
      state = gameReducer(state, processDRVOperations());

      expect(state.satellites[0].age).toBe(0);
    });
  });

  describe('Refueling Vehicle Operations', () => {
    it('should launch refueling DRV with correct configuration', () => {
      const state = gameReducer(initialState, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      expect(state.debrisRemovalVehicles).toHaveLength(1);
      const drv = state.debrisRemovalVehicles[0];
      expect(drv.removalType).toBe('refueling');
      expect(drv.layer).toBe('LEO');
      expect(drv.maxAge).toBe(15);
      expect(drv.successRate).toBe(0.95);
    });

    it('should target satellites needing refueling', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      const satelliteId = state.satellites[0].id;
      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 12}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());

      const drv = state.debrisRemovalVehicles[0];
      expect(drv.targetDebrisId).toBe(satelliteId);
      expect(drv.targetingTurnsRemaining).toBe(1);
    });

    it('should complete full refueling cycle', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      const satelliteId = state.satellites[0].id;
      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 15}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].targetDebrisId).toBe(satelliteId);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].capturedDebrisId).toBe(satelliteId);
      expect(state.debrisRemovalVehicles[0].captureOrbitsRemaining).toBe(3);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].capturedDebrisId).toBe(satelliteId);
      expect(state.debrisRemovalVehicles[0].captureOrbitsRemaining).toBe(2);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].capturedDebrisId).toBe(satelliteId);
      expect(state.debrisRemovalVehicles[0].captureOrbitsRemaining).toBe(1);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].capturedDebrisId).toBeUndefined();
      expect(state.satellites[0].age).toBe(0);
      expect(state.recentRefuelings).toHaveLength(1);
      expect(state.recentRefuelings[0].targetId).toBe(satelliteId);
      expect(state.recentRefuelings[0].previousAge).toBe(15);
      expect(state.recentRefuelings[0].newAge).toBe(0);
    });

    it('should refuel DRVs as well as satellites', () => {
      let state = initialState;

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'cooperative',
      }));

      const cooperativeDrvId = state.debrisRemovalVehicles[0].id;
      state = {
        ...state,
        debrisRemovalVehicles: state.debrisRemovalVehicles.map(d => ({...d, age: 8}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[1].targetDebrisId).toBe(cooperativeDrvId);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[1].capturedDebrisId).toBe(cooperativeDrvId);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[1].capturedDebrisId).toBe(cooperativeDrvId);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[1].capturedDebrisId).toBe(cooperativeDrvId);

      state = gameReducer(state, processDRVOperations());
      expect(state.debrisRemovalVehicles[0].age).toBe(0);
      expect(state.recentRefuelings).toHaveLength(1);
      expect(state.recentRefuelings[0].targetType).toBe('drv');
    });

    it('should not target satellites below 50% lifespan', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 5}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());

      const drv = state.debrisRemovalVehicles[0];
      expect(drv.targetDebrisId).toBeUndefined();
    });

    it('should not target satellites in different orbits', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'MEO',
        purpose: 'GPS',
        insuranceTier: 'basic',
      }));

      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 25}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());

      const drv = state.debrisRemovalVehicles[0];
      expect(drv.targetDebrisId).toBeUndefined();
    });

    it('should not target graveyard satellites', () => {
      let state = initialState;

      state = gameReducer(state, launchSatellite({
        orbit: 'LEO',
        purpose: 'Comms',
        insuranceTier: 'basic',
      }));

      state = {
        ...state,
        satellites: state.satellites.map(s => ({...s, age: 15, inGraveyard: true}))
      };

      state = gameReducer(state, launchDRV({
        orbit: 'LEO',
        drvType: 'refueling',
      }));

      state = gameReducer(state, processDRVOperations());

      const drv = state.debrisRemovalVehicles[0];
      expect(drv.targetDebrisId).toBeUndefined();
    });
  });
});
