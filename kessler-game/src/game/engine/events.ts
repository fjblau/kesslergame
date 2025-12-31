import { SOLAR_FLARE_CONFIG } from '../constants';
import type { Debris, SolarFlareEvent, SolarFlareClass, OrbitLayer } from '../types';

export function checkSolarStorm(probability: number): boolean {
  return Math.random() < probability;
}

export function generateSolarFlare(): SolarFlareEvent {
  const classes: SolarFlareClass[] = ['A', 'B', 'C', 'M', 'X'];
  const weights = classes.map(c => SOLAR_FLARE_CONFIG[c].weight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  let random = Math.random() * totalWeight;
  let selectedClass: SolarFlareClass = 'C';
  
  for (let i = 0; i < classes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      selectedClass = classes[i];
      break;
    }
  }
  
  const config = SOLAR_FLARE_CONFIG[selectedClass];
  const [minIntensity, maxIntensity] = config.intensityRange;
  const intensity = minIntensity + Math.random() * (maxIntensity - minIntensity);
  
  const [minFlux, maxFlux] = config.xRayFluxRange;
  const xRayFlux = minFlux * Math.pow(10, Math.random() * Math.log10(maxFlux / minFlux));
  
  const debrisRemovalRate: Record<OrbitLayer, number> = { ...config.baseRemovalRate };
  
  if (selectedClass === 'X' && intensity > 9) {
    const scaleFactor = intensity / 9;
    debrisRemovalRate.LEO = Math.min(0.70, config.baseRemovalRate.LEO * scaleFactor);
    debrisRemovalRate.MEO = Math.min(0.35, config.baseRemovalRate.MEO * scaleFactor);
    debrisRemovalRate.GEO = Math.min(0.15, config.baseRemovalRate.GEO * scaleFactor);
  }
  
  const affectedLayers: OrbitLayer[] = [];
  (Object.keys(debrisRemovalRate) as OrbitLayer[]).forEach(layer => {
    if (debrisRemovalRate[layer] > 0) {
      affectedLayers.push(layer);
    }
  });
  
  return {
    class: selectedClass,
    intensity: Math.round(intensity * 10) / 10,
    xRayFlux,
    debrisRemovalRate,
    affectedLayers,
  };
}

export function processSolarStorm(debris: Debris[], flareEvent: SolarFlareEvent): {
  removedDebris: Map<OrbitLayer, Debris[]>;
  remainingDebris: Debris[];
} {
  const removedDebris = new Map<OrbitLayer, Debris[]>();
  let remainingDebris = [...debris];
  
  for (const layer of flareEvent.affectedLayers) {
    const layerDebris = remainingDebris.filter(d => d.layer === layer);
    const otherDebris = remainingDebris.filter(d => d.layer !== layer);
    
    const removalRate = flareEvent.debrisRemovalRate[layer];
    const removalCount = Math.floor(layerDebris.length * removalRate);
    
    const shuffled = [...layerDebris].sort(() => Math.random() - 0.5);
    const removed = shuffled.slice(0, removalCount);
    const remaining = shuffled.slice(removalCount);
    
    removedDebris.set(layer, removed);
    remainingDebris = [...otherDebris, ...remaining];
  }
  
  return {
    removedDebris,
    remainingDebris,
  };
}
