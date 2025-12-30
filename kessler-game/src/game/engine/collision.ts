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
  LEO: { inner: 50, outer: 225 },
  MEO: { inner: 225, outer: 325 },
  GEO: { inner: 325, outer: 400 },
  GRAVEYARD: { inner: 400, outer: 475 },
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
  
  const activeSatellites = satellites.filter(s => !capturedObjectIds.has(s.id) && s.age >= 3 && !s.inGraveyard);
  const activeDebris = debris.filter(d => !capturedObjectIds.has(d.id));
  
  const allObjects: GameObject[] = [...activeSatellites, ...activeDebris];

  const layers: OrbitLayer[] = ['LEO', 'MEO', 'GEO', 'GRAVEYARD'];

  for (const layer of layers) {
    const objectsInLayer = allObjects.filter(obj => obj.layer === layer);
    const drvsInLayer = drvs.filter(drv => drv.layer === layer);
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
    
    for (const drv of drvsInLayer) {
      const drvPolar = toPolarCoordinates(drv);
      const bucketIndex = getBucketIndex(drvPolar.angle, bucketSize);
      const adjacentBuckets = getAdjacentBucketIndices(bucketIndex, bucketCount);
      
      for (const adjIndex of adjacentBuckets) {
        const bucket = spatialGrid.get(adjIndex);
        if (!bucket) continue;
        
        for (const obj of bucket.objects) {
          const objPolar = toPolarCoordinates(obj);
          const angleDiff = normalizeAngleDiff(drvPolar.angle - objPolar.angle);
          const radiusDiff = Math.abs(drvPolar.radius - objPolar.radius);
          
          if (angleDiff < angleThreshold && radiusDiff < radiusThreshold) {
            collisions.push({ obj1: drv, obj2: obj, layer });
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
