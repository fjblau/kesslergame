import type { Satellite, Debris, DebrisRemovalVehicle, OrbitLayer } from '../types';
import { 
  INSURANCE_CONFIG, 
  COLLISION_THRESHOLDS, 
  DEBRIS_PER_COLLISION,
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

type GameObject = Satellite | Debris | DebrisRemovalVehicle;

export interface CollisionPair {
  obj1: GameObject;
  obj2: GameObject;
  layer: OrbitLayer;
}

const ORBIT_RADII = {
  LEO: { inner: 62.5, outer: 256 },
  MEO: { inner: 256, outer: 365 },
  GEO: { inner: 365, outer: 437.5 },
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

function getBucketIndex(angle: number, bucketSize: number): number {
  return Math.floor(angle / bucketSize);
}

function getAdjacentBucketIndices(
  bucketIndex: number,
  bucketCount: number
): number[] {
  const prev = (bucketIndex - 1 + bucketCount) % bucketCount;
  const next = (bucketIndex + 1) % bucketCount;
  return [prev, bucketIndex, next];
}

interface SpatialBucket {
  objects: GameObject[];
}

function createSpatialHashGrid(
  objects: GameObject[],
  bucketSize: number
): Map<number, SpatialBucket> {
  const grid = new Map<number, SpatialBucket>();
  
  for (const obj of objects) {
    const polar = toPolarCoordinates(obj);
    const bucketIndex = getBucketIndex(polar.angle, bucketSize);
    
    if (!grid.has(bucketIndex)) {
      grid.set(bucketIndex, { objects: [] });
    }
    grid.get(bucketIndex)!.objects.push(obj);
  }
  
  return grid;
}

export function detectCollisions(
  satellites: Satellite[],
  debris: Debris[],
  angleThresholdDegrees: number = COLLISION_THRESHOLDS.angleDegrees,
  radiusMultiplier: number = 1,
  drvs: DebrisRemovalVehicle[] = []
): CollisionPair[] {
  const collisions: CollisionPair[] = [];
  
  const capturedObjectIds = new Set(
    drvs.filter(drv => drv.capturedDebrisId).map(drv => drv.capturedDebrisId)
  );
  
  const activeSatellites = satellites.filter(s => !capturedObjectIds.has(s.id) && s.age >= 3);
  const activeDebris = debris.filter(d => !capturedObjectIds.has(d.id));
  
  const allObjects: GameObject[] = [...activeSatellites, ...activeDebris, ...drvs];

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const radiusThreshold = COLLISION_THRESHOLDS.radiusPixels[layer] * radiusMultiplier;
    const angleThreshold = angleThresholdDegrees;

    const bucketSize = Math.max(angleThreshold * 2, 10);
    const bucketCount = Math.ceil(360 / bucketSize);
    const spatialGrid = createSpatialHashGrid(objectsInLayer, bucketSize);
    
    const checkedPairs = new Set<string>();
    
    for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex++) {
      const bucket = spatialGrid.get(bucketIndex);
      if (!bucket || bucket.objects.length === 0) continue;
      
      const adjacentBuckets = getAdjacentBucketIndices(bucketIndex, bucketCount);
      const nearbyObjects: GameObject[] = [];
      
      for (const adjIndex of adjacentBuckets) {
        const adjBucket = spatialGrid.get(adjIndex);
        if (adjBucket) {
          nearbyObjects.push(...adjBucket.objects);
        }
      }
      
      for (let i = 0; i < nearbyObjects.length; i++) {
        for (let j = i + 1; j < nearbyObjects.length; j++) {
          const obj1 = nearbyObjects[i];
          const obj2 = nearbyObjects[j];
          
          const pairKey = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
          if (checkedPairs.has(pairKey)) continue;
          checkedPairs.add(pairKey);

          const isDRV1 = 'removalType' in obj1;
          const isDRV2 = 'removalType' in obj2;
          if (isDRV1 && isDRV2) continue;

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
  }

  return collisions;
}

function clampToLayer(value: number, layer: OrbitLayer): number {
  const [min, max] = LAYER_BOUNDS[layer];
  return Math.max(min, Math.min(max, value));
}

export function generateDebrisFromCollision(
  x: number,
  y: number,
  layer: OrbitLayer,
  generateId: () => string,
  debrisPerCollision: number = DEBRIS_PER_COLLISION
): Debris[] {
  const debris: Debris[] = [];
  const offsetRange = 5;

  for (let i = 0; i < debrisPerCollision; i++) {
    const xOffset = (Math.random() - 0.5) * offsetRange * 2;
    const yOffset = (Math.random() - 0.5) * offsetRange * 2;

    debris.push({
      id: generateId(),
      x: clampToLayer(x + xOffset, layer),
      y: clampToLayer(y + yOffset, layer),
      layer,
      type: 'uncooperative',
    });
  }

  return debris;
}
