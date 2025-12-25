import type { OrbitLayer } from '../../game/types';
import { LAYER_BOUNDS } from '../../game/constants';

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

export function mapToPixels(entity: EntityPosition) {
  const centerX = 400;
  const centerY = 400;
  const { inner, outer } = ORBIT_RADII[entity.layer];
  
  const [yMin, yMax] = LAYER_BOUNDS[entity.layer];
  const normalizedY = (entity.y - yMin) / (yMax - yMin);
  const radius = inner + normalizedY * (outer - inner);
  
  const angle = (entity.x / 100) * 2 * Math.PI;
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}
