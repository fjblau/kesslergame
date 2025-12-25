import { OrbitLayer } from '../../game/types';
import { LAYER_BOUNDS } from '../../game/constants';

const ORBIT_RADII = {
  LEO: { inner: 40, outer: 100 },
  MEO: { inner: 100, outer: 175 },
  GEO: { inner: 175, outer: 250 },
};

interface EntityPosition {
  x: number;
  y: number;
  layer: OrbitLayer;
}

function mapToPixels(entity: EntityPosition) {
  const centerX = 300;
  const centerY = 300;
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

export function OrbitVisualization() {
  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center bg-slate-950">
      <div className="text-blue-400">Orbit Visualization Canvas</div>
    </div>
  );
}
