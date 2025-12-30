import type { Satellite, Debris, DebrisRemovalVehicle, OrbitLayer } from '../types';
import { 
  INSURANCE_CONFIG, 
  DEBRIS_PER_COLLISION,
  LAYER_BOUNDS,
  OBJECT_RADII,
  CAPTURE_RADIUS_MULTIPLIER
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

function areObjectsColliding(obj1: GameObject, obj2: GameObject): boolean {
  const r1 = obj1.captureRadius ?? obj1.radius;
  const r2 = obj2.captureRadius ?? obj2.radius;
  const captureDistance = r1 + r2;
  const captureDistanceSquared = captureDistance * captureDistance;
  
  let dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  
  if (dx > 50) dx -= 100;
  else if (dx < -50) dx += 100;
  
  const distanceSquared = dx * dx + dy * dy;
  
  return distanceSquared <= captureDistanceSquared;
}

function getBucketIndex(x: number, bucketSize: number): number {
  return Math.floor(x / bucketSize);
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
    const bucketIndex = getBucketIndex(obj.x, bucketSize);
    
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
  angleThresholdDegrees: number = 0,
  radiusMultiplier: number = 1,
  drvs: DebrisRemovalVehicle[] = []
): CollisionPair[] {
  void angleThresholdDegrees;
  void radiusMultiplier;
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

    const bucketSize = 10;
    const bucketCount = Math.ceil(100 / bucketSize);
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

          if (areObjectsColliding(obj1, obj2)) {
            collisions.push({ obj1, obj2, layer });
          }
        }
      }
    }
    
    for (const drv of drvsInLayer) {
      const bucketIndex = getBucketIndex(drv.x, bucketSize);
      const adjacentBuckets = getAdjacentBucketIndices(bucketIndex, bucketCount);
      
      for (const adjIndex of adjacentBuckets) {
        const bucket = spatialGrid.get(adjIndex);
        if (!bucket) continue;
        
        for (const obj of bucket.objects) {
          if (areObjectsColliding(drv, obj)) {
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
      radius: OBJECT_RADII.debris,
      captureRadius: OBJECT_RADII.debris * CAPTURE_RADIUS_MULTIPLIER,
    });
  }

  return debris;
}
