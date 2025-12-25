import { SOLAR_STORM_PROBABILITY, SOLAR_STORM_LEO_REMOVAL_RATE } from '../constants';
import type { Debris } from '../types';

export function checkSolarStorm(): boolean {
  return Math.random() < SOLAR_STORM_PROBABILITY;
}

export function processSolarStorm(debris: Debris[]): {
  removedDebris: Debris[];
  remainingDebris: Debris[];
} {
  const leoDebris = debris.filter(d => d.layer === 'LEO');
  const nonLeoDebris = debris.filter(d => d.layer !== 'LEO');
  
  const removalCount = Math.floor(leoDebris.length * SOLAR_STORM_LEO_REMOVAL_RATE);
  
  const shuffled = [...leoDebris].sort(() => Math.random() - 0.5);
  const removedDebris = shuffled.slice(0, removalCount);
  const remainingLeoDebris = shuffled.slice(removalCount);
  
  return {
    removedDebris,
    remainingDebris: [...nonLeoDebris, ...remainingLeoDebris]
  };
}
