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
  LEO: { inner: 60, outer: 205 },
  MEO: { inner: 205, outer: 292 },
  GEO: { inner: 292, outer: 350 },
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
  debris: Debris[],
  angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,
  radiusMultiplier: number = 1
): CollisionPair[] {
  const collisions: CollisionPair[] = [];
  const allObjects: GameObject[] = [...satellites, ...debris];

  console.log(`[Collision Detection] Checking ${satellites.length} satellites, ${debris.length} debris`);
  console.log(`[Collision Detection] Thresholds: angle=${angleThresholdDegrees}°, radiusMultiplier=${radiusMultiplier}`);

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const radiusThreshold = COLLISION_THRESHOLDS.radiusPixels[layer] * radiusMultiplier;
    const angleThreshold = angleThresholdDegrees;

    console.log(`[${layer}] ${objectsInLayer.length} objects, radiusThreshold=${radiusThreshold.toFixed(1)}px, angleThreshold=${angleThreshold}°`);

    for (let i = 0; i < objectsInLayer.length; i++) {
      for (let j = i + 1; j < objectsInLayer.length; j++) {
        const obj1 = objectsInLayer[i];
        const obj2 = objectsInLayer[j];

        const polar1 = toPolarCoordinates(obj1);
        const polar2 = toPolarCoordinates(obj2);

        const angleDiff = normalizeAngleDiff(polar1.angle - polar2.angle);
        const radiusDiff = Math.abs(polar1.radius - polar2.radius);

        if (i === 0 && j === 1) {
          console.log(`[${layer}] Sample pair: angleDiff=${angleDiff.toFixed(1)}° (< ${angleThreshold}?), radiusDiff=${radiusDiff.toFixed(1)}px (< ${radiusThreshold.toFixed(1)}?)`);
        }

        if (angleDiff < angleThreshold && radiusDiff < radiusThreshold) {
          console.log(`[COLLISION] ${layer}: angleDiff=${angleDiff.toFixed(1)}°, radiusDiff=${radiusDiff.toFixed(1)}px`);
          collisions.push({ obj1, obj2, layer });
        }
      }
    }
  }

  console.log(`[Collision Detection] Found ${collisions.length} collisions`);
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
