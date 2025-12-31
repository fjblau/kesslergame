import type { 
  OrbitLayer, 
  InsuranceTier, 
  DRVTargetPriority,
  SatelliteType,
  BudgetDifficulty,
  SolarFlareClass
} from './types';

export const LAUNCH_COSTS: Record<OrbitLayer, number> = {
  LEO: 2_000_000,
  MEO: 3_000_000,
  GEO: 5_000_000,
  GRAVEYARD: 0,
};

export const INSURANCE_CONFIG: Record<InsuranceTier, { cost: number; payout: number }> = {
  none: { cost: 0, payout: 0 },
  basic: { cost: 500_000, payout: 1_000_000 },
  premium: { cost: 1_000_000, payout: 2_500_000 },
};

export const DRV_CONFIG = {
  costs: {
    LEO: { cooperative: 4_000_000, uncooperative: 7_000_000, geotug: 50_000_000 },
    MEO: { cooperative: 6_000_000, uncooperative: 10_500_000, geotug: 50_000_000 },
    GEO: { cooperative: 10_000_000, uncooperative: 17_500_000, geotug: 50_000_000 },
    GRAVEYARD: { cooperative: 0, uncooperative: 0, geotug: 0 },
  },
  capacity: {
    cooperative: [2, 3] as [number, number],
    uncooperative: [6, 9] as [number, number],
    geotug: [1, 1] as [number, number],
  },
  successRate: {
    cooperative: 0.85,
    uncooperative: 0.90,
    geotug: 1.0,
  },
  duration: {
    cooperative: 10,
    uncooperative: 10,
    geotug: 999,
  },
};

export const DRV_PRIORITY_CONFIG: Record<DRVTargetPriority, { 
  cooperativeChance: number; 
  costModifier: number;
  description: string 
}> = {
  'auto': { 
    cooperativeChance: 0.70, 
    costModifier: 1.0,
    description: '70% cooperative / 30% uncooperative'
  },
  'cooperative-focus': { 
    cooperativeChance: 0.90, 
    costModifier: 0.90,
    description: '90% cooperative / 10% uncooperative'
  },
  'uncooperative-focus': { 
    cooperativeChance: 0.10, 
    costModifier: 1.20,
    description: '10% cooperative / 90% uncooperative'
  },
};

export const SATELLITE_PURPOSE_CONFIG: Record<SatelliteType | 'Random', { 
  icon: string; 
  discount: number 
}> = {
  Weather: { icon: '☁️', discount: 0 },
  Comms: { icon: '📡', discount: 0 },
  GPS: { icon: '🛰️', discount: 0 },
  Random: { icon: '🎲', discount: 0.10 },
};

export const SATELLITE_REVENUE: Record<SatelliteType, number> = {
  Weather: 100_000,
  Comms: 150_000,
  GPS: 200_000,
};

export const BUDGET_DIFFICULTY_CONFIG: Record<BudgetDifficulty, {
  startingBudget: number;
  incomeAmount: number;
  incomeInterval: number;
  drainAmount: number;
  label: string;
  description: string;
}> = {
  easy: {
    startingBudget: 300_000_000,
    incomeAmount: 10_000_000,
    incomeInterval: 10,
    drainAmount: 0,
    label: 'Easy',
    description: 'Generous budget with regular income',
  },
  normal: {
    startingBudget: 200_000_000,
    incomeAmount: 5_000_000,
    incomeInterval: 20,
    drainAmount: 0,
    label: 'Normal',
    description: 'Balanced challenge (recommended)',
  },
  hard: {
    startingBudget: 150_000_000,
    incomeAmount: 0,
    incomeInterval: 0,
    drainAmount: 0,
    label: 'Hard',
    description: 'Limited budget, no income',
  },
  challenge: {
    startingBudget: 100_000_000,
    incomeAmount: 0,
    incomeInterval: 0,
    drainAmount: 2_000_000,
    label: 'Challenge',
    description: 'Tight budget with drain per turn',
  },
};

export const LAYER_BOUNDS: Record<OrbitLayer, [number, number]> = {
  LEO: [0, 50],
  MEO: [50, 100],
  GEO: [100, 150],
  GRAVEYARD: [150, 200],
};

export const COLLISION_THRESHOLDS = {
  angleDegrees: 15,
  radiusPixels: {
    LEO: 40,
    MEO: 50,
    GEO: 60,
    GRAVEYARD: 70,
  },
};

export const OBJECT_RADII = {
  satellite: 0.6,
  debris: 0.4,
  drv: 0.7,
};

export const CAPTURE_RADIUS_MULTIPLIER = 1.5;

export const DEBRIS_PER_COLLISION = 5;
export const DEBRIS_TYPE_DISTRIBUTION = { cooperative: 0.70, uncooperative: 0.30 };
export const MAX_STEPS = 100;
export const LEO_LIFETIME = 20;

export const SOLAR_STORM_PROBABILITY = 0.10;
export const SOLAR_STORM_LEO_REMOVAL_RATE = 0.30;
export const MAX_DEBRIS_LIMIT = 500;

export const SOLAR_FLARE_CONFIG: Record<SolarFlareClass, {
  xRayFluxRange: [number, number];
  intensityRange: [number, number];
  baseRemovalRate: Record<OrbitLayer, number>;
  weight: number;
}> = {
  A: {
    xRayFluxRange: [1e-8, 1e-7],
    intensityRange: [1, 9],
    baseRemovalRate: {
      LEO: 0.05,
      MEO: 0,
      GEO: 0,
      GRAVEYARD: 0,
    },
    weight: 0.05,
  },
  B: {
    xRayFluxRange: [1e-7, 1e-6],
    intensityRange: [1, 9],
    baseRemovalRate: {
      LEO: 0.10,
      MEO: 0,
      GEO: 0,
      GRAVEYARD: 0,
    },
    weight: 0.35,
  },
  C: {
    xRayFluxRange: [1e-6, 1e-5],
    intensityRange: [1, 9],
    baseRemovalRate: {
      LEO: 0.20,
      MEO: 0,
      GEO: 0,
      GRAVEYARD: 0,
    },
    weight: 0.35,
  },
  M: {
    xRayFluxRange: [1e-5, 1e-4],
    intensityRange: [1, 9],
    baseRemovalRate: {
      LEO: 0.35,
      MEO: 0.05,
      GEO: 0,
      GRAVEYARD: 0,
    },
    weight: 0.20,
  },
  X: {
    xRayFluxRange: [1e-4, 1e-3],
    intensityRange: [1, 20],
    baseRemovalRate: {
      LEO: 0.50,
      MEO: 0.20,
      GEO: 0.05,
      GRAVEYARD: 0,
    },
    weight: 0.05,
  },
};

export const ORBITAL_SPEEDS: Record<OrbitLayer, number> = {
  LEO: 6.4,
  MEO: 4,
  GEO: 2.4,
  GRAVEYARD: 2.2,
};

export const CASCADE_THRESHOLD = 3;

export const RISK_SPEED_MULTIPLIERS = {
  LOW: 1.0,
  MEDIUM: 1.5,
  CRITICAL: 2.0,
};
