import type { SatelliteMetadata } from './satelliteMetadata';

export type OrbitLayer = 'LEO' | 'MEO' | 'GEO' | 'GRAVEYARD';
export type SatelliteType = 'Weather' | 'Comms' | 'GPS';
export type InsuranceTier = 'none' | 'basic' | 'premium';
export type DRVType = 'cooperative' | 'uncooperative' | 'geotug';
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
  inGraveyard?: boolean;
  radius: number;
  captureRadius?: number;
  metadata?: {
    name: string;
    country: string;
    weight_kg: number;
    launch_vehicle: string;
    launch_site: string;
  };
}

export interface Debris {
  id: string;
  x: number;
  y: number;
  layer: OrbitLayer;
  type: DebrisType;
  radius: number;
  captureRadius?: number;
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
  targetDebrisId?: string;
  capturedDebrisId?: string;
  captureOrbitsRemaining?: number;
  targetingTurnsRemaining?: number;
  radius: number;
  captureRadius?: number;
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
  objectIds: string[];
}

export interface ExpiredDRVInfo {
  id: string;
  type: DRVType;
  layer: OrbitLayer;
  debrisRemoved: number;
}

export interface DebrisRemovalInfo {
  drvId: string;
  drvType: DRVType;
  layer: OrbitLayer;
  debrisType: DebrisType;
  count: number;
}

export interface GraveyardMoveInfo {
  satelliteId: string;
  tugId: string;
  purpose: SatelliteType;
}

export interface LaunchedSatelliteInfo {
  satellite: Satellite;
  turn: number;
  day: number;
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
  recentlyExpiredDRVs: ExpiredDRVInfo[];
  recentDebrisRemovals: DebrisRemovalInfo[];
  recentGraveyardMoves: GraveyardMoveInfo[];
  recentlyLaunchedSatellites: LaunchedSatelliteInfo[];
  collisionAngleThreshold: number;
  collisionRadiusMultiplier: number;
  debrisPerCollision: number;
  orbitalSpeedLEO: number;
  orbitalSpeedMEO: number;
  orbitalSpeedGEO: number;
  orbitalSpeedGRAVEYARD: number;
  solarStormProbability: number;
  drvUncooperativeCapacityMin: number;
  drvUncooperativeCapacityMax: number;
  drvUncooperativeSuccessRate: number;
  cascadeTriggered: boolean;
  lastCascadeTurn?: number;
  totalCascades: number;
  satellitesRecovered: number;
  riskSpeedMultipliers: {
    LOW: number;
    MEDIUM: number;
    CRITICAL: number;
  };
  soundEnabled: boolean;
  drvDecommissionTime: number;
  availableSatellitePool: SatelliteMetadata[];
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

export type EventType = 'satellite-launch' | 'drv-launch' | 'collision' | 'debris-removal' | 'mission-complete' | 'drv-expired' | 'solar-storm' | 'satellite-graveyard' | 'geotug-decommission';

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  day: number;
  timestamp: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface EventsState {
  events: GameEvent[];
}

export interface ScoreState {
  totalScore: number;
  satelliteLaunchScore: number;
  debrisRemovalScore: number;
  satelliteRecoveryScore: number;
  budgetManagementScore: number;
  survivalScore: number;
  satellitesRecovered: number;
  scoreHistory: ScoreHistoryEntry[];
}

export interface ScoreHistoryEntry {
  turn: number;
  totalScore: number;
}
