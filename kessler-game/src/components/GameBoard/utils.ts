import type { OrbitLayer } from '../../game/types';
import { LAYER_BOUNDS, ORBITAL_SPEEDS } from '../../game/constants';

const ORBIT_RADII = {
  LEO: { inner: 60, outer: 140 },
  MEO: { inner: 140, outer: 240 },
  GEO: { inner: 240, outer: 350 },
};

interface EntityPosition {
  x: number;
  y: number;
  layer: OrbitLayer;
}

export function mapToPixels(entity: EntityPosition, days: number = 0) {
  const centerX = 400;
  const centerY = 400;
  const { inner, outer } = ORBIT_RADII[entity.layer];
  
  const [yMin, yMax] = LAYER_BOUNDS[entity.layer];
  const normalizedY = (entity.y - yMin) / (yMax - yMin);
  const radius = inner + normalizedY * (outer - inner);
  
  const baseAngle = (entity.x / 100) * 2 * Math.PI;
  const rotationFromDays = (days * ORBITAL_SPEEDS[entity.layer] * 3.6) * (Math.PI / 180);
  const angle = baseAngle + rotationFromDays;
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
