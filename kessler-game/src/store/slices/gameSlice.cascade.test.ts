import { describe, it, expect, beforeEach, vi } from 'vitest';
import gameReducer, { processCollisions, checkGameOver } from './gameSlice';
import type { GameState, Satellite, Debris } from '../../game/types';
import { SATELLITE_METADATA } from '../../game/satelliteMetadata';
import * as collisionModule from '../../game/engine/collision';

describe('Cascade Behavior Tests', () => {
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
      debrisPerCollision: 5,
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
      severeCascadeTriggered: false,
      consecutiveCascadeTurns: 0,
      gameOverReason: undefined,
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

  describe('Severe Cascade Detection (12+ collisions)', () => {
    it('should detect severe cascade with exactly 12 collisions', () => {
      const satellites: Satellite[] = Array.from({ length: 12 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 12 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.severeCascadeTriggered).toBe(true);
      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('severe-cascade');
      expect(result.cascadeTriggered).toBe(true);
      expect(result.totalCascades).toBe(1);
    });

    it('should detect severe cascade with 15 collisions', () => {
      const satellites: Satellite[] = Array.from({ length: 15 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 15 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.severeCascadeTriggered).toBe(true);
      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('severe-cascade');
    });

    it('should NOT trigger severe cascade with 11 collisions', () => {
      const satellites: Satellite[] = Array.from({ length: 11 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 11 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.severeCascadeTriggered).toBe(false);
      expect(result.gameOver).toBe(false);
      expect(result.gameOverReason).toBeUndefined();
      expect(result.cascadeTriggered).toBe(true);
      expect(result.totalCascades).toBe(1);
    });

    it('should NOT generate debris when severe cascade occurs', () => {
      const satellites: Satellite[] = Array.from({ length: 12 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 12 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const initialDebrisCount = debris.length;
      const result = gameReducer(state, processCollisions());

      expect(result.debris.length).toBe(initialDebrisCount);
    });
  });

  describe('Consecutive Cascade Tracking', () => {
    it('should increment consecutiveCascadeTurns on cascade', () => {
      const satellites: Satellite[] = Array.from({ length: 3 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 3 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      let state = { ...initialState, satellites, debris };
      state = gameReducer(state, processCollisions());

      expect(state.consecutiveCascadeTurns).toBe(1);

      state = gameReducer(state, processCollisions());
      expect(state.consecutiveCascadeTurns).toBe(2);

      state = gameReducer(state, processCollisions());
      expect(state.consecutiveCascadeTurns).toBe(3);
    });

    it('should reset consecutiveCascadeTurns when no collisions occur', () => {
      const satellites: Satellite[] = Array.from({ length: 3 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 3 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      let state = { ...initialState, satellites, debris, consecutiveCascadeTurns: 2 };
      
      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue([]);
      state = gameReducer(state, processCollisions());

      expect(state.consecutiveCascadeTurns).toBe(0);
    });

    it('should reset consecutiveCascadeTurns when collisions below cascade threshold', () => {
      const satellites: Satellite[] = Array.from({ length: 2 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 2 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris, consecutiveCascadeTurns: 2 };
      const result = gameReducer(state, processCollisions());

      expect(result.consecutiveCascadeTurns).toBe(0);
    });
  });

  describe('Game Over Reason Assignment', () => {
    it('should set gameOverReason to severe-cascade when severe cascade occurs', () => {
      const satellites: Satellite[] = Array.from({ length: 12 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 12 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.gameOverReason).toBe('severe-cascade');
    });

    it('should set gameOverReason to budget when budget is negative', () => {
      const state = { ...initialState, budget: -1000 };
      const result = gameReducer(state, checkGameOver());

      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('budget');
    });

    it('should set gameOverReason to max-turns when max steps reached', () => {
      const state = { ...initialState, step: 100, maxSteps: 100 };
      const result = gameReducer(state, checkGameOver());

      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('max-turns');
    });

    it('should set gameOverReason to debris-limit when debris exceeds limit', () => {
      const debris: Debris[] = Array.from({ length: 251 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + (i % 20) * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const state = { ...initialState, debris };
      const result = gameReducer(state, checkGameOver());

      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('debris-limit');
    });

    it('should prioritize severe-cascade over other game-over reasons', () => {
      const satellites: Satellite[] = Array.from({ length: 12 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 251 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + (i % 20) * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris, budget: -1000 };
      const result = gameReducer(state, processCollisions());

      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('severe-cascade');
    });

    it('should not overwrite existing gameOverReason', () => {
      const state = { 
        ...initialState, 
        gameOver: true, 
        gameOverReason: 'severe-cascade' as const,
        budget: -1000 
      };
      const result = gameReducer(state, checkGameOver());

      expect(result.gameOver).toBe(true);
      expect(result.gameOverReason).toBe('severe-cascade');
    });
  });

  describe('Moderate Cascade Behavior (3-11 collisions)', () => {
    it('should trigger cascade flag with 3 collisions', () => {
      const satellites: Satellite[] = Array.from({ length: 3 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 3 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.cascadeTriggered).toBe(true);
      expect(result.severeCascadeTriggered).toBe(false);
      expect(result.gameOver).toBe(false);
      expect(result.totalCascades).toBe(1);
      expect(result.lastCascadeTurn).toBe(0);
    });

    it('should generate debris for moderate cascades', () => {
      const satellites: Satellite[] = Array.from({ length: 5 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 5 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris, debrisPerCollision: 5 };
      const initialDebrisCount = debris.length;
      const result = gameReducer(state, processCollisions());

      expect(result.debris.length).toBeGreaterThan(initialDebrisCount);
      expect(result.debris.length).toBe(initialDebrisCount + (5 * 5));
    });
  });

  describe('Edge Cases', () => {
    it('should handle exactly CASCADE_THRESHOLD collisions', () => {
      const satellites: Satellite[] = Array.from({ length: 3 }, (_, i) => ({
        id: `sat-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        purpose: 'Comms' as const,
        age: 5,
        maxAge: 20,
        insuranceTier: 'none' as const,
        inGraveyard: false,
        radius: 0.6,
        captureRadius: 0.9,
      }));

      const debris: Debris[] = Array.from({ length: 3 }, (_, i) => ({
        id: `debris-${i}`,
        x: 10 + i * 5,
        y: 10,
        layer: 'LEO' as const,
        type: 'uncooperative' as const,
        radius: 0.4,
        captureRadius: 0.6,
      }));

      const collisions = satellites.map((sat, i) => ({
        obj1: sat,
        obj2: debris[i],
        layer: 'LEO' as const,
      }));

      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue(collisions);

      const state = { ...initialState, satellites, debris };
      const result = gameReducer(state, processCollisions());

      expect(result.cascadeTriggered).toBe(true);
      expect(result.severeCascadeTriggered).toBe(false);
      expect(result.gameOver).toBe(false);
    });

    it('should handle zero collisions gracefully', () => {
      vi.spyOn(collisionModule, 'detectCollisions').mockReturnValue([]);

      const state = { ...initialState, consecutiveCascadeTurns: 5 };
      const result = gameReducer(state, processCollisions());

      expect(result.cascadeTriggered).toBe(false);
      expect(result.severeCascadeTriggered).toBe(false);
      expect(result.consecutiveCascadeTurns).toBe(0);
      expect(result.gameOver).toBe(false);
    });
  });
});
