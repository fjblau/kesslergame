export type OrbitLayer = 'LEO' | 'MEO' | 'GEO';
export type SatelliteType = 'Weather' | 'Comms' | 'GPS';
export type InsuranceTier = 'none' | 'basic' | 'premium';
export type DRVType = 'cooperative' | 'uncooperative';
export type DRVTargetPriority = 'auto' | 'cooperative-focus' | 'uncooperative-focus';
export type DebrisType = 'cooperative' | 'uncooperative';
export type GameSpeed = 'paused' | 'normal' | 'fast';
export type BudgetDifficulty = 'easy' | 'normal' | 'hard' | 'challenge';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

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

export interface TurnHistory {
  turn: number;
  debrisCount: number;
  satelliteCount: number;
  debrisRemoved: number;
  activeDRVCount: number;
}

export interface CollisionEvent {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  timestamp: number;
}

export interface GameState {
  step: number;
  maxSteps: number;
  days: number;
  satellites: Satellite[];
  debris: Debris[];
  debrisRemovalVehicles: DebrisRemovalVehicle[];
  budget: number;
  budgetDifficulty: BudgetDifficulty;
  budgetIncomeAmount: number;
  budgetIncomeInterval: number;
  budgetDrainAmount: number;
  nextIncomeAt: number;
  history: TurnHistory[];
  riskLevel: RiskLevel;
  gameOver: boolean;
  recentCollisions: CollisionEvent[];
}

export interface UIState {
  gameSpeed: GameSpeed;
  autoPauseOnCollision: boolean;
  autoPauseOnRiskChange: boolean;
  autoPauseOnBudgetLow: boolean;
  autoPauseOnMission: boolean;
}

export type MissionCategory = 'launch' | 'removal' | 'state' | 'multi-layer' | 'economic';
export type MissionTrackingType = 'cumulative' | 'threshold' | 'consecutive' | 'snapshot' | 'boolean';

export interface MissionDefinition {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  target: number;
  currentProgress: number;
  turnLimit?: number;
  trackingType: MissionTrackingType;
  startThreshold?: number;
  completed: boolean;
  failed: boolean;
  completedAt?: number;
}

export interface MissionsState {
  availableMissions: MissionDefinition[];
  activeMissions: MissionDefinition[];
  trackingData: {
    consecutiveLowRiskTurns: number;
    consecutiveBudgetAbove50M: number;
    hasReachedDebris200: boolean;
    layersWithSatellites: OrbitLayer[];
    totalDRVsLaunched: number;
  };
}

export type EventType = 'satellite-launch' | 'drv-launch' | 'collision' | 'debris-removal' | 'mission-complete' | 'drv-expired' | 'solar-storm';

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface EventsState {
  events: GameEvent[];
}
