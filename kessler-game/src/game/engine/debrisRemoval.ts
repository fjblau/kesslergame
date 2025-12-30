import type { DebrisRemovalVehicle, Debris, Satellite, OrbitLayer } from '../types';
import { ORBITAL_SPEEDS } from '../constants';

const ORBITS_TO_HOLD = 2;
const ORBITS_TO_TARGET = 1;

type CapturableObject = Debris | Satellite;

export function isWithinCaptureRange(
  drv: DebrisRemovalVehicle,
  target: CapturableObject
): boolean {
  const dx = target.x - drv.x;
  const dxWrapped = dx > 50 ? dx - 100 : (dx < -50 ? dx + 100 : dx);
  const dy = target.y - drv.y;
  
  const distanceSquared = dxWrapped * dxWrapped + dy * dy;
  
  const captureDistance = 15;
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
  satellites: Satellite[],
  allDRVs?: DebrisRemovalVehicle[]
): CapturableObject | null {
  const alreadyTargetedIds = new Set<string>();
  if (allDRVs) {
    allDRVs.forEach(otherDrv => {
      if (otherDrv.id !== drv.id) {
        if (otherDrv.targetDebrisId) alreadyTargetedIds.add(otherDrv.targetDebrisId);
        if (otherDrv.capturedDebrisId) alreadyTargetedIds.add(otherDrv.capturedDebrisId);
      }
    });
  }
  
  const satellitesInLayer = satellites.filter(s => 
    s.layer === drv.layer && 
    !s.inGraveyard && 
    !alreadyTargetedIds.has(s.id)
  );
  const debrisInLayer = debris.filter(d => 
    d.layer === drv.layer && 
    d.type === 'cooperative' &&
    !alreadyTargetedIds.has(d.id)
  );
  
  const allTargets: CapturableObject[] = [
    ...satellitesInLayer,
    ...debrisInLayer
  ];
  
  if (allTargets.length === 0) return null;
  return allTargets[Math.floor(Math.random() * allTargets.length)];
}

export function selectGeoTugTarget(
  drv: DebrisRemovalVehicle,
  satellites: Satellite[],
  allDRVs?: DebrisRemovalVehicle[]
): Satellite | null {
  const alreadyTargetedIds = new Set<string>();
  if (allDRVs) {
    allDRVs.forEach(otherDrv => {
      if (otherDrv.id !== drv.id) {
        if (otherDrv.targetDebrisId) alreadyTargetedIds.add(otherDrv.targetDebrisId);
        if (otherDrv.capturedDebrisId) alreadyTargetedIds.add(otherDrv.capturedDebrisId);
      }
    });
  }
  
  const satellitesInGEO = satellites.filter(s => 
    s.layer === 'GEO' && 
    !s.inGraveyard &&
    !alreadyTargetedIds.has(s.id)
  );
  
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
  
  const maxXAdjustment = 3.0;
  const maxYAdjustment = 8.0;
  
  const xAdjustment = Math.abs(dxWrapped) < 0.1 
    ? 0 
    : Math.sign(dxWrapped) * Math.min(Math.abs(dxWrapped) * 1.0, maxXAdjustment);
  
  const yAdjustment = Math.abs(dy) < 0.5 
    ? 0 
    : Math.sign(dy) * Math.min(Math.abs(dy) * 1.5, maxYAdjustment);
  
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
  satellites: Satellite[],
  allDRVs?: DebrisRemovalVehicle[]
): {
  removedDebrisIds: string[];
  removedSatelliteIds: string[];
  newTargetId: string | undefined;
  capturedObjectId: string | undefined;
  captureOrbitsRemaining: number | undefined;
  targetingTurnsRemaining: number | undefined;
} {
  const removedDebrisIds: string[] = [];
  const removedSatelliteIds: string[] = [];
  
  if (drv.capturedDebrisId) {
    const capturedDebris = debris.find(d => d.id === drv.capturedDebrisId);
    const capturedSatellite = satellites.find(s => s.id === drv.capturedDebrisId);
    const capturedObject = capturedDebris || capturedSatellite;
    
    if (!capturedObject) {
      return {
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: undefined,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined
      };
    }
    
    const orbitsRemaining = (drv.captureOrbitsRemaining ?? ORBITS_TO_HOLD) - 1;
    
    if (orbitsRemaining < 0) {
      if (capturedSatellite) {
        removedSatelliteIds.push(capturedSatellite.id);
      } else if (capturedDebris) {
        const success = attemptDebrisRemoval(drv);
        if (success) {
          removedDebrisIds.push(capturedDebris.id);
        }
      }
      
      return {
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: undefined,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined
      };
    }
    
    return {
      removedDebrisIds,
      removedSatelliteIds,
      newTargetId: undefined,
      capturedObjectId: drv.capturedDebrisId,
      captureOrbitsRemaining: orbitsRemaining,
      targetingTurnsRemaining: undefined
    };
  }
  
  if (drv.targetDebrisId) {
    const currentDebris = debris.find(d => d.id === drv.targetDebrisId);
    const currentSatellite = satellites.find(s => s.id === drv.targetDebrisId);
    const currentTarget = currentDebris || currentSatellite;
    
    if (!currentTarget) {
      const newTarget = selectTarget(drv, debris, satellites, allDRVs);
      return { 
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: newTarget?.id,
        capturedObjectId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined
      };
    }
    
    const turnsRemaining = (drv.targetingTurnsRemaining ?? ORBITS_TO_TARGET) - 1;
    
    if (turnsRemaining <= 0) {
      return {
        removedDebrisIds,
        removedSatelliteIds,
        newTargetId: undefined,
        capturedObjectId: currentTarget.id,
        captureOrbitsRemaining: ORBITS_TO_HOLD,
        targetingTurnsRemaining: undefined
      };
    }
    
    return {
      removedDebrisIds,
      removedSatelliteIds,
      newTargetId: drv.targetDebrisId,
      capturedObjectId: undefined,
      captureOrbitsRemaining: undefined,
      targetingTurnsRemaining: turnsRemaining
    };
  }
  
  const newTarget = selectTarget(drv, debris, satellites, allDRVs);
  return {
    removedDebrisIds,
    removedSatelliteIds,
    newTargetId: newTarget?.id,
    capturedObjectId: undefined,
    captureOrbitsRemaining: undefined,
    targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined
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
    
    const dx = target.x - drv.x;
    const dxWrapped = dx > 50 ? dx - 100 : (dx < -50 ? dx + 100 : dx);
    
    let speedMultiplier = 3.0;
    if (Math.abs(dxWrapped) < 3) {
      speedMultiplier = 0.5;
    } else if (dxWrapped < -5) {
      speedMultiplier = -2.0;
    }
    
    newX = (drv.x + baseSpeed * speedMultiplier + adjustments.xAdjustment) % 100;
    if (newX < 0) newX += 100;
    
    newY = drv.y + adjustments.yAdjustment;
  }
  
  return { x: newX, y: newY };
}

export function processGeoTugOperations(
  drv: DebrisRemovalVehicle,
  satellites: Satellite[],
  allDRVs?: DebrisRemovalVehicle[]
): {
  movedSatelliteId: string | undefined;
  newTargetId: string | undefined;
  capturedSatelliteId: string | undefined;
  captureOrbitsRemaining: number | undefined;
  targetingTurnsRemaining: number | undefined;
  shouldDecommission: boolean;
} {
  if (drv.capturedDebrisId) {
    const capturedSatellite = satellites.find(s => s.id === drv.capturedDebrisId);
    
    if (!capturedSatellite) {
      return {
        movedSatelliteId: undefined,
        newTargetId: undefined,
        capturedSatelliteId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined,
        shouldDecommission: false
      };
    }
    
    const orbitsRemaining = (drv.captureOrbitsRemaining ?? ORBITS_TO_HOLD) - 1;
    
    if (orbitsRemaining < 0) {
      return {
        movedSatelliteId: capturedSatellite.id,
        newTargetId: undefined,
        capturedSatelliteId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: undefined,
        shouldDecommission: true
      };
    }
    
    return {
      movedSatelliteId: undefined,
      newTargetId: undefined,
      capturedSatelliteId: drv.capturedDebrisId,
      captureOrbitsRemaining: orbitsRemaining,
      targetingTurnsRemaining: undefined,
      shouldDecommission: false
    };
  }
  
  if (drv.targetDebrisId) {
    const currentSatellite = satellites.find(s => s.id === drv.targetDebrisId);
    
    if (!currentSatellite) {
      const newTarget = selectGeoTugTarget(drv, satellites, allDRVs);
      return {
        movedSatelliteId: undefined,
        newTargetId: newTarget?.id,
        capturedSatelliteId: undefined,
        captureOrbitsRemaining: undefined,
        targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined,
        shouldDecommission: false
      };
    }
    
    const turnsRemaining = (drv.targetingTurnsRemaining ?? ORBITS_TO_TARGET) - 1;
    
    if (turnsRemaining <= 0) {
      return {
        movedSatelliteId: undefined,
        newTargetId: undefined,
        capturedSatelliteId: currentSatellite.id,
        captureOrbitsRemaining: ORBITS_TO_HOLD,
        targetingTurnsRemaining: undefined,
        shouldDecommission: false
      };
    }
    
    return {
      movedSatelliteId: undefined,
      newTargetId: drv.targetDebrisId,
      capturedSatelliteId: undefined,
      captureOrbitsRemaining: undefined,
      targetingTurnsRemaining: turnsRemaining,
      shouldDecommission: false
    };
  }
  
  const newTarget = selectGeoTugTarget(drv, satellites, allDRVs);
  return {
    movedSatelliteId: undefined,
    newTargetId: newTarget?.id,
    capturedSatelliteId: undefined,
    captureOrbitsRemaining: undefined,
    targetingTurnsRemaining: newTarget ? ORBITS_TO_TARGET : undefined,
    shouldDecommission: false
  };
}
