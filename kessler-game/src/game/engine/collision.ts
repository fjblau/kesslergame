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

const ORBIT_RADII = {
  LEO: { inner: 60, outer: 140 },
  MEO: { inner: 140, outer: 240 },
  GEO: { inner: 240, outer: 350 },
};

interface PolarCoordinates {
  angle: number;
  radius: number;
}

function toPolarCoordinates(obj: GameObject): PolarCoordinates {
  const { x, y, layer } = obj;
  const angle = (x / 100) * 360;
  
  const [yMin, yMax] = LAYER_BOUNDS[layer];
  const normalizedY = (y - yMin) / (yMax - yMin);
  const { inner, outer } = ORBIT_RADII[layer];
  const radius = inner + normalizedY * (outer - inner);
  
  return { angle, radius };
}

function normalizeAngleDiff(diff: number): number {
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return Math.abs(diff);
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
    const radiusThreshold = COLLISION_THRESHOLDS.radiusPixels[layer];
    const angleThreshold = COLLISION_THRESHOLDS.angleDegrees;

    for (let i = 0; i < objectsInLayer.length; i++) {
      for (let j = i + 1; j < objectsInLayer.length; j++) {
        const obj1 = objectsInLayer[i];
        const obj2 = objectsInLayer[j];

        const polar1 = toPolarCoordinates(obj1);
        const polar2 = toPolarCoordinates(obj2);

        const angleDiff = normalizeAngleDiff(polar1.angle - polar2.angle);
        const radiusDiff = Math.abs(polar1.radius - polar2.radius);

        if (angleDiff < angleThreshold && radiusDiff < radiusThreshold) {
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
