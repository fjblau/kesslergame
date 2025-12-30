import type { DebrisRemovalVehicle, Debris, Satellite, OrbitLayer } from '../types';
import { ORBITAL_SPEEDS } from '../constants';

const ORBITS_TO_HOLD = 2;

type CapturableObject = Debris | Satellite;

function isWithinCaptureRange(
  drv: DebrisRemovalVehicle,
  target: CapturableObject
): boolean {
  const dx = target.x - drv.x;
  const dxWrapped = dx > 50 ? dx - 100 : (dx < -50 ? dx + 100 : dx);
  const dy = target.y - drv.y;
  
  const distanceSquared = dxWrapped * dxWrapped + dy * dy;
  
  const drvCaptureRadius = drv.captureRadius ?? drv.radius;
  const targetCaptureRadius = target.captureRadius ?? target.radius;
  const captureDistance = drvCaptureRadius + targetCaptureRadius;
  const captureDistanceSquared = captureDistance * captureDistance;
  
  return distanceSquared <= captureDistanceSquared;
}

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
  return baseSpeed * multiplier * 0.01;
}

function selectDebrisTarget(
  drv: DebrisRemovalVehicle,
  debris: Debris[],
  preFilteredMatchingDebris?: Debris[]
): Debris | null {
  const matchingDebris = preFilteredMatchingDebris ?? debris.filter(d => 
    d.layer === drv.layer && 
    'type' in d && 
    !('removalType' in d) &&
    d.type === drv.removalType
  );
  
  if (matchingDebris.length === 0) return null;
  
  return matchingDebris[Math.floor(Math.random() * matchingDebris.length)];
}

export function selectTarget(
  drv: DebrisRemovalVehicle,
  debris: Debris[],
  satellites: Satellite[]
): CapturableObject | null {
  const satellitesInLayer = satellites.filter(s => s.layer === drv.layer && !s.inGraveyard);
  const debrisInLayer = debris.filter(d => d.layer === drv.layer && d.type === 'cooperative');
  
  const allTargets: CapturableObject[] = [
    ...satellitesInLayer,
    ...debrisInLayer
  ];
  
  if (allTargets.length === 0) return null;
  return allTargets[Math.floor(Math.random() * allTargets.length)];
}

export function selectGeoTugTarget(
  satellites: Satellite[]
): Satellite | null {
  const satellitesInGEO = satellites.filter(s => s.layer === 'GEO' && !s.inGraveyard);
  
  if (satellitesInGEO.length === 0) return null;
  return satellitesInGEO[Math.floor(Math.random() * satellitesInGEO.length)];
}

export function attemptDebrisRemoval(drv: DebrisRemovalVehicle): boolean {
  return Math.random() < drv.successRate;
}

export function calculateInterceptionAdjustment(
  drv: DebrisRemovalVehicle,
  target: CapturableObject
): { xAdjustment: number; yAdjustment: number } {
  const dx = target.x - drv.x;
  const dxWrapped = dx > 50 ? dx - 100 : (dx < -50 ? dx + 100 : dx);
  const dy = target.y - drv.y;
  
  const maxXAdjustment = 0.12;
  const maxYAdjustment = 3.5;
  
  const xAdjustment = Math.abs(dxWrapped) < 1 
    ? 0 
    : Math.sign(dxWrapped) * Math.min(Math.abs(dxWrapped) * 0.05, maxXAdjustment);
  
  const yAdjustment = Math.abs(dy) < 2 
    ? 0 
    : Math.sign(dy) * Math.min(Math.abs(dy) * 0.5, maxYAdjustment);
  
  return { xAdjustment, yAdjustment };
}

export function processDRVRemoval(
  drv: DebrisRemovalVehicle,
  debris: Debris[]
): {
  removedDebrisIds: string[];
  attemptsCount: number;
} {
  const removedDebrisIds: string[] = [];
  let attemptsCount = 0;
  
  let matchingDebris = debris.filter(d => 
    d.layer === drv.layer && 
    'type' in d && 
    !('removalType' in d) &&
    d.type === drv.removalType
  );

  for (let i = 0; i < drv.capacity; i++) {
    const target = selectDebrisTarget(drv, debris, matchingDebris);
    if (!target) break;

    attemptsCount++;
    const success = attemptDebrisRemoval(drv);

    if (success) {
      removedDebrisIds.push(target.id);
    }

    matchingDebris = matchingDebris.filter(d => d.id !== target.id);
  }

  return { removedDebrisIds, attemptsCount };
}

export function processCooperativeDRVOperations(
  drv: DebrisRemovalVehicle,
  debris: Debris[],
  satellites: Satellite[]
): {
  removedDebrisIds: string[];
  removedSatelliteIds: string[];
  newTargetId: string | undefined;
  capturedObjectId: string | undefined;
  captureOrbitsRemaining: number | undefined;
} {
  const removedDebrisIds: string[] = [];
  const removedSatelliteIds: string[] = [];
  
  if (drv.capturedDebrisId) {
    const capturedDebris = debris.find(d => d.id === drv.capturedDebrisId);
    const capturedSatellite = satellites.find(s => s.id === drv.capturedDebrisId);
    const capturedObject = capturedDebris || capturedSatellite;
    
    if (!capturedObject) {
      const newTarget = selectTarget(drv, debris, satellites);
      return {
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: newTarget?.id,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined
      };
    }
    
    const orbitsRemaining = (drv.captureOrbitsRemaining ?? ORBITS_TO_HOLD) - 1;
    
    if (orbitsRemaining <= 0) {
      if (capturedSatellite) {
        removedSatelliteIds.push(capturedSatellite.id);
      } else if (capturedDebris) {
        const success = attemptDebrisRemoval(drv);
        if (success) {
          removedDebrisIds.push(capturedDebris.id);
        }
      }
      
      const remainingDebris = debris.filter(d => d.id !== capturedObject.id);
      const remainingSatellites = satellites.filter(s => s.id !== capturedObject.id);
      const nextTarget = selectTarget(drv, remainingDebris, remainingSatellites);
      
      return {
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: nextTarget?.id,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined
      };
    }
    
    return {
      removedDebrisIds,
      removedSatelliteIds,
      newTargetId: drv.targetDebrisId,
      capturedObjectId: drv.capturedDebrisId,
      captureOrbitsRemaining: orbitsRemaining
    };
  }
  
  const currentDebris = debris.find(d => d.id === drv.targetDebrisId);
  const currentSatellite = satellites.find(s => s.id === drv.targetDebrisId);
  const currentTarget = currentDebris || currentSatellite;
  
  if (!currentTarget) {
    const newTarget = selectTarget(drv, debris, satellites);
    return { 
      removedDebrisIds,
      removedSatelliteIds,
      newTargetId: newTarget?.id,
      capturedObjectId: undefined,
      captureOrbitsRemaining: undefined
    };
  }
  
  if (isWithinCaptureRange(drv, currentTarget)) {
    return {
      removedDebrisIds,
      removedSatelliteIds,
      newTargetId: drv.targetDebrisId,
      capturedObjectId: currentTarget.id,
      captureOrbitsRemaining: ORBITS_TO_HOLD
    };
  }
  
  return {
    removedDebrisIds,
    removedSatelliteIds,
    newTargetId: drv.targetDebrisId,
    capturedObjectId: undefined,
    captureOrbitsRemaining: undefined
  };
}

export function moveCooperativeDRV(
  drv: DebrisRemovalVehicle,
  target: CapturableObject | undefined
): { x: number; y: number } {
  const baseSpeed = getEntitySpeedVariation(drv.id, drv.layer);
  let newX = (drv.x + baseSpeed) % 100;
  let newY = drv.y;
  
  if (target && !drv.capturedDebrisId) {
    const adjustments = calculateInterceptionAdjustment(drv, target);
    
    newX = (drv.x + baseSpeed + adjustments.xAdjustment) % 100;
    if (newX < 0) newX += 100;
    
    newY = drv.y + adjustments.yAdjustment;
  }
  
  return { x: newX, y: newY };
}

export function processGeoTugOperations(
  drv: DebrisRemovalVehicle,
  satellites: Satellite[]
): {
  movedSatelliteId: string | undefined;
  newTargetId: string | undefined;
  capturedSatelliteId: string | undefined;
  captureOrbitsRemaining: number | undefined;
  shouldDecommission: boolean;
} {
  if (drv.capturedDebrisId) {
    const capturedSatellite = satellites.find(s => s.id === drv.capturedDebrisId);
    
    if (!capturedSatellite) {
      const newTarget = selectGeoTugTarget(satellites);
      return {
        movedSatelliteId: undefined,
        newTargetId: newTarget?.id,
        capturedSatelliteId: undefined,
        captureOrbitsRemaining: undefined,
        shouldDecommission: false
      };
    }
    
    const orbitsRemaining = (drv.captureOrbitsRemaining ?? ORBITS_TO_HOLD) - 1;
    
    if (orbitsRemaining <= 0) {
      return {
        movedSatelliteId: capturedSatellite.id,
        newTargetId: undefined,
        capturedSatelliteId: undefined,
        captureOrbitsRemaining: undefined,
        shouldDecommission: true
      };
    }
    
    return {
      movedSatelliteId: undefined,
      newTargetId: drv.targetDebrisId,
      capturedSatelliteId: drv.capturedDebrisId,
      captureOrbitsRemaining: orbitsRemaining,
      shouldDecommission: false
    };
  }
  
  const currentSatellite = satellites.find(s => s.id === drv.targetDebrisId);
  
  if (!currentSatellite) {
    const newTarget = selectGeoTugTarget(satellites);
    return {
      movedSatelliteId: undefined,
      newTargetId: newTarget?.id,
      capturedSatelliteId: undefined,
      captureOrbitsRemaining: undefined,
      shouldDecommission: false
    };
  }
  
  if (isWithinCaptureRange(drv, currentSatellite)) {
    return {
      movedSatelliteId: undefined,
      newTargetId: drv.targetDebrisId,
      capturedSatelliteId: currentSatellite.id,
      captureOrbitsRemaining: ORBITS_TO_HOLD,
      shouldDecommission: false
    };
  }
  
  return {
    movedSatelliteId: undefined,
    newTargetId: drv.targetDebrisId,
    capturedSatelliteId: undefined,
    captureOrbitsRemaining: undefined,
    shouldDecommission: false
  };
}
