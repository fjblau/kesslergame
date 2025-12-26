import type { DebrisRemovalVehicle, Debris } from '../types';
import { DRV_PRIORITY_CONFIG } from '../constants';

export function selectDebrisTarget(
  drv: DebrisRemovalVehicle,
  debris: Debris[]
): Debris | null {
  const sameLayer = debris.filter(d => 
    d.layer === drv.layer && 
    'type' in d && 
    !('removalType' in d)
  );
  if (sameLayer.length === 0) return null;

  const config = DRV_PRIORITY_CONFIG[drv.targetPriority];
  const targetCooperative = Math.random() < config.cooperativeChance;

  const preferred = sameLayer.filter(d =>
    targetCooperative ? d.type === 'cooperative' : d.type === 'uncooperative'
  );

  const candidates = preferred.length > 0 ? preferred : sameLayer;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function attemptDebrisRemoval(drv: DebrisRemovalVehicle): boolean {
  return Math.random() < drv.successRate;
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
