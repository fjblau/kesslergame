import { describe, it, expect } from 'vitest';
import { selectRefuelingTarget, processRefuelingOperations } from './debrisRemoval';
import type { Satellite, DebrisRemovalVehicle, OrbitLayer } from '../types';

const createMockSatellite = (
  id: string,
  layer: OrbitLayer,
  age: number,
  maxAge: number,
  inGraveyard = false
): Satellite => ({
  id,
  x: 100,
  y: 100,
  layer,
  purpose: 'Comms',
  age,
  maxAge,
  insuranceTier: 'basic',
  inGraveyard,
  radius: 5,
  captureRadius: 10,
});

const createMockDRV = (
  id: string,
  layer: OrbitLayer,
  removalType: 'cooperative' | 'uncooperative' | 'geotug' | 'refueling',
  age: number,
  maxAge: number,
  targetDebrisId?: string,
  capturedDebrisId?: string
): DebrisRemovalVehicle => ({
  id,
  x: 100,
  y: 100,
  layer,
  removalType,
  age,
  maxAge,
  capacity: 2,
  successRate: 0.95,
  debrisRemoved: 0,
  radius: 5,
  captureRadius: 10,
  targetDebrisId,
  capturedDebrisId,
});

describe('selectRefuelingTarget', () => {
  it('should return null when no satellites or DRVs need refueling', () => {
    const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const satellites = [
      createMockSatellite('sat1', 'LEO', 5, 20),
      createMockSatellite('sat2', 'LEO', 8, 20),
    ];
    const drvs = [drv];

    const result = selectRefuelingTarget(drv, satellites, drvs);
    expect(result).toBeNull();
  });

  it('should select a satellite that is over 50% aged', () => {
    const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const satellites = [
      createMockSatellite('sat1', 'LEO', 5, 20),
      createMockSatellite('sat2', 'LEO', 12, 20),
    ];
    const drvs = [drv];

    const result = selectRefuelingTarget(drv, satellites, drvs);
    expect(result).toBeDefined();
    expect(result?.id).toBe('sat2');
  });

  it('should select a DRV that is over 50% aged', () => {
    const refuelingDrv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const agingDrv = createMockDRV('drv2', 'LEO', 'cooperative', 8, 10);
    const satellites: Satellite[] = [];
    const drvs = [refuelingDrv, agingDrv];

    const result = selectRefuelingTarget(refuelingDrv, satellites, drvs);
    expect(result).toBeDefined();
    expect(result?.id).toBe('drv2');
  });

  it('should not select satellites in different orbits', () => {
    const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const satellites = [
      createMockSatellite('sat1', 'MEO', 12, 20),
      createMockSatellite('sat2', 'GEO', 35, 60),
    ];
    const drvs = [drv];

    const result = selectRefuelingTarget(drv, satellites, drvs);
    expect(result).toBeNull();
  });

  it('should not select graveyard satellites', () => {
    const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const satellites = [
      createMockSatellite('sat1', 'LEO', 12, 20, true),
    ];
    const drvs = [drv];

    const result = selectRefuelingTarget(drv, satellites, drvs);
    expect(result).toBeNull();
  });

  it('should not select refueling DRVs as targets', () => {
    const refuelingDrv1 = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const refuelingDrv2 = createMockDRV('drv2', 'LEO', 'refueling', 10, 15);
    const satellites: Satellite[] = [];
    const drvs = [refuelingDrv1, refuelingDrv2];

    const result = selectRefuelingTarget(refuelingDrv1, satellites, drvs);
    expect(result).toBeNull();
  });

  it('should not select already targeted objects', () => {
    const refuelingDrv1 = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const refuelingDrv2 = createMockDRV('drv2', 'LEO', 'refueling', 0, 15, 'sat1');
    const satellites = [
      createMockSatellite('sat1', 'LEO', 12, 20),
      createMockSatellite('sat2', 'LEO', 13, 20),
    ];
    const drvs = [refuelingDrv1, refuelingDrv2];

    const result = selectRefuelingTarget(refuelingDrv1, satellites, drvs, drvs);
    expect(result).toBeDefined();
    expect(result?.id).toBe('sat2');
  });

  it('should not select already captured objects', () => {
    const refuelingDrv1 = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
    const refuelingDrv2 = createMockDRV('drv2', 'LEO', 'refueling', 0, 15, undefined, 'sat1');
    const satellites = [
      createMockSatellite('sat1', 'LEO', 12, 20),
      createMockSatellite('sat2', 'LEO', 13, 20),
    ];
    const drvs = [refuelingDrv1, refuelingDrv2];

    const result = selectRefuelingTarget(refuelingDrv1, satellites, drvs, drvs);
    expect(result).toBeDefined();
    expect(result?.id).toBe('sat2');
  });
});

describe('processRefuelingOperations', () => {
  describe('when DRV has no target', () => {
    it('should find and target a satellite needing refuel', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
      const satellites = [createMockSatellite('sat1', 'LEO', 12, 20)];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.newTargetId).toBe('sat1');
      expect(result.targetingTurnsRemaining).toBe(1);
      expect(result.capturedObjectId).toBeUndefined();
      expect(result.refueledSatelliteId).toBeUndefined();
    });

    it('should return undefined target when no objects need refueling', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15);
      const satellites = [createMockSatellite('sat1', 'LEO', 5, 20)];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.newTargetId).toBeUndefined();
      expect(result.targetingTurnsRemaining).toBeUndefined();
    });
  });

  describe('when DRV is targeting', () => {
    it('should capture target after targeting completes', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, 'sat1');
      drv.targetingTurnsRemaining = 1;
      const satellites = [createMockSatellite('sat1', 'LEO', 12, 20)];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.capturedObjectId).toBe('sat1');
      expect(result.captureOrbitsRemaining).toBe(3);
      expect(result.targetingTurnsRemaining).toBeUndefined();
      expect(result.newTargetId).toBeUndefined();
    });

    it('should continue targeting if not complete', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, 'sat1');
      drv.targetingTurnsRemaining = 2;
      const satellites = [createMockSatellite('sat1', 'LEO', 12, 20)];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.newTargetId).toBe('sat1');
      expect(result.targetingTurnsRemaining).toBe(1);
      expect(result.capturedObjectId).toBeUndefined();
    });

    it('should find new target if current target disappeared', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, 'sat1');
      drv.targetingTurnsRemaining = 1;
      const satellites = [createMockSatellite('sat2', 'LEO', 12, 20)];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.newTargetId).toBe('sat2');
      expect(result.targetingTurnsRemaining).toBe(1);
    });
  });

  describe('when DRV has captured an object', () => {
    it('should refuel satellite and release after refueling completes', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, undefined, 'sat1');
      drv.captureOrbitsRemaining = 1;
      const satellite = createMockSatellite('sat1', 'LEO', 12, 20);
      const satellites = [satellite];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.refueledSatelliteId).toBe('sat1');
      expect(result.capturedObjectId).toBeUndefined();
      expect(result.captureOrbitsRemaining).toBeUndefined();
      expect(satellite.age).toBe(0);
    });

    it('should refuel DRV and release after refueling completes', () => {
      const refuelingDrv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, undefined, 'drv2');
      refuelingDrv.captureOrbitsRemaining = 1;
      const targetDrv = createMockDRV('drv2', 'LEO', 'cooperative', 8, 10);
      const satellites: Satellite[] = [];
      const drvs = [refuelingDrv, targetDrv];

      const result = processRefuelingOperations(refuelingDrv, satellites, drvs, drvs);

      expect(result.refueledDRVId).toBe('drv2');
      expect(result.refueledSatelliteId).toBeUndefined();
      expect(result.capturedObjectId).toBeUndefined();
      expect(targetDrv.age).toBe(0);
    });

    it('should continue holding if refueling not complete', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, undefined, 'sat1');
      drv.captureOrbitsRemaining = 2;
      const satellite = createMockSatellite('sat1', 'LEO', 12, 20);
      const satellites = [satellite];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.capturedObjectId).toBe('sat1');
      expect(result.captureOrbitsRemaining).toBe(1);
      expect(result.refueledSatelliteId).toBeUndefined();
      expect(satellite.age).toBe(12);
    });

    it('should handle missing captured object gracefully', () => {
      const drv = createMockDRV('drv1', 'LEO', 'refueling', 0, 15, undefined, 'sat1');
      drv.captureOrbitsRemaining = 1;
      const satellites: Satellite[] = [];
      const drvs = [drv];

      const result = processRefuelingOperations(drv, satellites, drvs, drvs);

      expect(result.refueledSatelliteId).toBeUndefined();
      expect(result.refueledDRVId).toBeUndefined();
      expect(result.capturedObjectId).toBeUndefined();
    });
  });
});
