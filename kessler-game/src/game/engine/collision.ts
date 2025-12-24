import type { Satellite, Debris, OrbitLayer, DebrisType } from '../types';
import { 
  INSURANCE_CONFIG, 
  COLLISION_THRESHOLDS, 
  DEBRIS_PER_COLLISION, 
  DEBRIS_TYPE_DISTRIBUTION,
  LAYER_BOUNDS 
} from '../constants';

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

function clampToLayer(value: number, layer: OrbitLayer): number {
  const [min, max] = LAYER_BOUNDS[layer];
  return Math.max(min, Math.min(max, value));
}

function generateDebrisType(): DebrisType {
  return Math.random() < DEBRIS_TYPE_DISTRIBUTION.cooperative 
    ? 'cooperative' 
    : 'uncooperative';
}

export function generateDebrisFromCollision(
  x: number,
  y: number,
  layer: OrbitLayer,
  generateId: () => string
): Debris[] {
  const debris: Debris[] = [];
  const offsetRange = 5;

  for (let i = 0; i < DEBRIS_PER_COLLISION; i++) {
    const xOffset = (Math.random() - 0.5) * offsetRange * 2;
    const yOffset = (Math.random() - 0.5) * offsetRange * 2;

    debris.push({
      id: generateId(),
      x: clampToLayer(x + xOffset, layer),
      y: clampToLayer(y + yOffset, layer),
      layer,
      type: generateDebrisType(),
    });
  }

  return debris;
}
