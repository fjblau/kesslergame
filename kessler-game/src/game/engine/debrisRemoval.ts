import type { DebrisRemovalVehicle, Debris } from '../types';

const CAPTURE_DISTANCE_THRESHOLD = 3;
const NAVIGATION_SPEED = 2;

export function selectDebrisTarget(
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

export function attemptDebrisRemoval(drv: DebrisRemovalVehicle): boolean {
  return Math.random() < drv.successRate;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = Math.min(Math.abs(x1 - x2), 100 - Math.abs(x1 - x2));
  const dy = Math.abs(y1 - y2);
  return Math.sqrt(dx * dx + dy * dy);
}

export function navigateTowardsTarget(
  drv: DebrisRemovalVehicle,
  target: Debris
): { x: number; y: number } {
  const dx = target.x - drv.x;
  const wrappedDx = dx > 50 ? dx - 100 : dx < -50 ? dx + 100 : dx;
  const dy = target.y - drv.y;
  
  const distance = Math.sqrt(wrappedDx * wrappedDx + dy * dy);
  
  if (distance < 0.1) {
    return { x: drv.x, y: drv.y };
  }
  
  const moveX = (wrappedDx / distance) * NAVIGATION_SPEED;
  const moveY = (dy / distance) * NAVIGATION_SPEED;
  
  let newX = drv.x + moveX;
  if (newX < 0) newX += 100;
  if (newX >= 100) newX -= 100;
  
  const newY = Math.max(0, Math.min(100, drv.y + moveY));
  
  return { x: newX, y: newY };
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
  debris: Debris[]
): {
  removedDebrisIds: string[];
  newTargetId: string | undefined;
} {
  const removedDebrisIds: string[] = [];
  
  const currentTarget = debris.find(d => d.id === drv.targetDebrisId);
  
  if (!currentTarget) {
    const newTarget = selectDebrisTarget(drv, debris);
    return { 
      removedDebrisIds, 
      newTargetId: newTarget?.id 
    };
  }
  
  const distance = calculateDistance(drv.x, drv.y, currentTarget.x, currentTarget.y);
  
  if (distance < CAPTURE_DISTANCE_THRESHOLD) {
    const success = attemptDebrisRemoval(drv);
    
    if (success) {
      removedDebrisIds.push(currentTarget.id);
    }
    
    const remainingDebris = debris.filter(d => d.id !== currentTarget.id);
    const nextTarget = selectDebrisTarget(drv, remainingDebris);
    
    return {
      removedDebrisIds,
      newTargetId: nextTarget?.id
    };
  }
  
  return {
    removedDebrisIds,
    newTargetId: drv.targetDebrisId
  };
}
