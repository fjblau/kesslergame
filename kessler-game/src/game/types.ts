export type OrbitLayer = 'LEO' | 'MEO' | 'GEO';
export type SatelliteType = 'Weather' | 'Comms' | 'GPS';
export type InsuranceTier = 'none' | 'basic' | 'premium';
export type DRVType = 'cooperative' | 'uncooperative';
export type DRVTargetPriority = 'auto' | 'cooperative-focus' | 'uncooperative-focus';
export type DebrisType = 'cooperative' | 'uncooperative';
export type GameSpeed = 'paused' | 'normal' | 'fast';
export type BudgetDifficulty = 'easy' | 'normal' | 'hard' | 'challenge';

export interface Satellite {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  purpose: SatelliteType;
  age: number;
  insuranceTier: InsuranceTier;
}

export interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;
}

export interface DebrisRemovalVehicle {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  removalType: DRVType;
  targetPriority: DRVTargetPriority;
  age: number;
  maxAge: number;
  capacity: number;
  successRate: number;
  debrisRemoved: number;
}

export interface GameState {
  step: number;
  maxSteps: number;
  satellites: Satellite[];
  debris: Debris[];
  debrisRemovalVehicles: DebrisRemovalVehicle[];
  budget: number;
  budgetDifficulty: BudgetDifficulty;
  budgetIncomeAmount: number;
  budgetIncomeInterval: number;
  budgetDrainAmount: number;
  nextIncomeAt: number;
}

export interface UIState {
  gameSpeed: GameSpeed;
  autoPauseOnCollision: boolean;
  autoPauseOnRiskChange: boolean;
  autoPauseOnBudgetLow: boolean;
  autoPauseOnMission: boolean;
}
