import type { DebrisRemovalVehicle, Debris, Satellite, OrbitLayer } from '../types';
import { ORBITAL_SPEEDS } from '../constants';

const CAPTURE_DISTANCE_THRESHOLD = 12;
const ORBITS_TO_HOLD = 2;

type CapturableObject = Debris | Satellite;

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
  debris: Debris[]
): Debris | null {
  const matchingDebris = debris.filter(d => 
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
  const allTargets: CapturableObject[] = [
    ...satellites.filter(s => s.layer === drv.layer),
    ...debris.filter(d => d.layer === drv.layer && d.type === 'cooperative')
  ];
  
  console.log(`[DRV ${drv.id}] Selecting target in ${drv.layer}: ${satellites.filter(s => s.layer === drv.layer).length} satellites, ${debris.filter(d => d.layer === drv.layer && d.type === 'cooperative').length} cooperative debris`);
  
  if (allTargets.length === 0) return null;
  const selected = allTargets[Math.floor(Math.random() * allTargets.length)];
  console.log(`[DRV ${drv.id}] Selected target ${selected.id} at (${selected.x.toFixed(2)}, ${selected.y.toFixed(2)})`);
  return selected;
}

export function attemptDebrisRemoval(drv: DebrisRemovalVehicle): boolean {
  return Math.random() < drv.successRate;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = Math.min(Math.abs(x1 - x2), 100 - Math.abs(x1 - x2));
  const dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateInterceptionAdjustment(
  drv: DebrisRemovalVehicle,
  target: CapturableObject
): { xAdjustment: number; yAdjustment: number } {
  const dx = target.x - drv.x;
  const dxWrapped = dx > 50 ? dx - 100 : (dx < -50 ? dx + 100 : dx);
  const dy = target.y - drv.y;
  
  const maxXAdjustment = 0.05;
  const maxYAdjustment = 2.0;
  
  const xAdjustment = Math.abs(dxWrapped) < 1 
    ? 0 
    : Math.sign(dxWrapped) * Math.min(Math.abs(dxWrapped) * 0.02, maxXAdjustment);
  
  const yAdjustment = Math.abs(dy) < 2 
    ? 0 
    : Math.sign(dy) * Math.min(Math.abs(dy) * 0.3, maxYAdjustment);
  
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
  let availableDebris = [...debris];

  for (let i = 0; i < drv.capacity; i++) {
    const target = selectDebrisTarget(drv, availableDebris);
    if (!target) break;

    attemptsCount++;
    const success = attemptDebrisRemoval(drv);

    if (success) {
      removedDebrisIds.push(target.id);
    }

    availableDebris = availableDebris.filter(d => d.id !== target.id);
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
      const success = attemptDebrisRemoval(drv);
      
      if (success) {
        if (capturedDebris) {
          removedDebrisIds.push(capturedDebris.id);
        } else if (capturedSatellite) {
          removedSatelliteIds.push(capturedSatellite.id);
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
  
  const distance = calculateDistance(drv.x, drv.y, currentTarget.x, currentTarget.y);
  
  console.log(`[DRV ${drv.id}] Position: (${drv.x.toFixed(2)}, ${drv.y.toFixed(2)}), Target ${currentTarget.id}: (${currentTarget.x.toFixed(2)}, ${currentTarget.y.toFixed(2)}), Distance: ${distance.toFixed(2)}`);
  
  if (distance < CAPTURE_DISTANCE_THRESHOLD) {
    console.log(`[DRV ${drv.id}] 🎯 CAPTURING ${currentTarget.id}!`);
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
    const targetSpeed = getEntitySpeedVariation(target.id!, target.layer);
    const adjustments = calculateInterceptionAdjustment(drv, target);
    
    newX = (drv.x + baseSpeed + adjustments.xAdjustment) % 100;
    if (newX < 0) newX += 100;
    
    newY = drv.y + adjustments.yAdjustment;
    
    console.log(`[DRV ${drv.id}] Moving: DRV speed ${baseSpeed.toFixed(3)}, Target speed ${targetSpeed.toFixed(3)}, X adj ${adjustments.xAdjustment.toFixed(3)}, Y adj ${adjustments.yAdjustment.toFixed(3)}, New pos: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
  }
  
  return { x: newX, y: newY };
}
