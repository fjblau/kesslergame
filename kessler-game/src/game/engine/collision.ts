import type { Satellite, Debris, OrbitLayer } from '../types';
import { INSURANCE_CONFIG, COLLISION_THRESHOLDS } from '../constants';

export function calculateInsurancePayout(satellite: Satellite): number {
  return INSURANCE_CONFIG[satellite.insuranceTier].payout;
}

export function calculateTotalPayout(destroyedSatellites: Satellite[]): number {
  return destroyedSatellites.reduce((total, sat) => {
    return total + calculateInsurancePayout(sat);
  }, 0);
}

type GameObject = Satellite | Debris;

export interface CollisionPair {
  obj1: GameObject;
  obj2: GameObject;
  layer: OrbitLayer;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function detectCollisions(
  satellites: Satellite[],
  debris: Debris[]
): CollisionPair[] {
  const collisions: CollisionPair[] = [];
  const allObjects: GameObject[] = [...satellites, ...debris];

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const threshold = COLLISION_THRESHOLDS[layer];

    for (let i = 0; i < objectsInLayer.length; i++) {
      for (let j = i + 1; j < objectsInLayer.length; j++) {
        const obj1 = objectsInLayer[i];
        const obj2 = objectsInLayer[j];

        const distance = calculateDistance(obj1.x, obj1.y, obj2.x, obj2.y);

        if (distance < threshold) {
          collisions.push({ obj1, obj2, layer });
        }
      }
    }
  }

  return collisions;
}
