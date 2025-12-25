import type { 
  OrbitLayer, 
  InsuranceTier, 
  DRVTargetPriority,
  SatelliteType,
  BudgetDifficulty
} from './types';

export const LAUNCH_COSTS: Record<OrbitLayer, number> = {
  LEO: 2_000_000,
  MEO: 3_000_000,
  GEO: 5_000_000,
};

export const INSURANCE_CONFIG: Record<InsuranceTier, { cost: number; payout: number }> = {
  none: { cost: 0, payout: 0 },
  basic: { cost: 500_000, payout: 1_000_000 },
  premium: { cost: 1_000_000, payout: 2_500_000 },
};

export const DRV_CONFIG = {
  costs: {
    LEO: { cooperative: 4_000_000, uncooperative: 8_000_000 },
    MEO: { cooperative: 6_000_000, uncooperative: 12_000_000 },
    GEO: { cooperative: 10_000_000, uncooperative: 20_000_000 },
  },
  capacity: {
    cooperative: [2, 3] as [number, number],
    uncooperative: [1, 2] as [number, number],
  },
  successRate: {
    cooperative: 0.85,
    uncooperative: 0.60,
  },
  duration: {
    cooperative: 10,
    uncooperative: 8,
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

export const BUDGET_DIFFICULTY_CONFIG: Record<BudgetDifficulty, {
  startingBudget: number;
  incomeAmount: number;
  incomeInterval: number;
  drainAmount: number;
  label: string;
  description: string;
}> = {
  easy: {
    startingBudget: 150_000_000,
    incomeAmount: 10_000_000,
    incomeInterval: 10,
    drainAmount: 0,
    label: 'Easy',
    description: 'Generous budget with regular income',
  },
  normal: {
    startingBudget: 100_000_000,
    incomeAmount: 5_000_000,
    incomeInterval: 20,
    drainAmount: 0,
    label: 'Normal',
    description: 'Balanced challenge (recommended)',
  },
  hard: {
    startingBudget: 75_000_000,
    incomeAmount: 0,
    incomeInterval: 0,
    drainAmount: 0,
    label: 'Hard',
    description: 'Limited budget, no income',
  },
  challenge: {
    startingBudget: 50_000_000,
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
};

export const COLLISION_THRESHOLDS: Record<OrbitLayer, number> = {
  LEO: 10,
  MEO: 15,
  GEO: 20,
};

export const DEBRIS_PER_COLLISION = 5;
export const DEBRIS_TYPE_DISTRIBUTION = { cooperative: 0.70, uncooperative: 0.30 };
export const MAX_STEPS = 100;
export const LEO_LIFETIME = 20;

export const SOLAR_STORM_PROBABILITY = 0.10;
export const SOLAR_STORM_LEO_REMOVAL_RATE = 0.30;
