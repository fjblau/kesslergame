import type { OrbitLayer } from '../../game/types';
import { LAYER_BOUNDS } from '../../game/constants';

const ORBIT_RADII = {
  LEO: { inner: 60, outer: 205 },
  MEO: { inner: 205, outer: 292 },
  GEO: { inner: 292, outer: 350 },
};

interface EntityPosition {
  x: number;
  y: number;
  layer: OrbitLayer;
  id?: string;
}

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getEntitySpeedMultiplier(id?: string): number {
  if (!id) return 1;
  const hash = hashId(id);
  return 0.7 + (hash % 600) / 1000;
}

export function mapToPixels(entity: EntityPosition, days: number = 0, orbitalSpeeds?: { LEO: number; MEO: number; GEO: number }) {
  const centerX = 500;
  const centerY = 500;
  const { inner, outer } = ORBIT_RADII[entity.layer];
  
  const [yMin, yMax] = LAYER_BOUNDS[entity.layer];
  const normalizedY = (entity.y - yMin) / (yMax - yMin);
  const baseRadius = inner + normalizedY * (outer - inner);
  
  const speedMultiplier = getEntitySpeedMultiplier(entity.id);
  const baseAngle = (entity.x / 100) * 2 * Math.PI;
  const orbitalSpeed = orbitalSpeeds ? orbitalSpeeds[entity.layer] : 0;
  const rotationFromDays = (days * orbitalSpeed * speedMultiplier * 3.6) * (Math.PI / 180);
  const angle = baseAngle + rotationFromDays;
  
  const eccentricity = 0.05 + (normalizedY * 0.1);
  const radius = baseRadius * (1 + eccentricity * Math.cos(angle * 2));
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
