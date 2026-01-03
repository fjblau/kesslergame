import type { Satellite, GameState } from './types';

export const SCORE_CONFIG = {
  SATELLITE_LAUNCH: {
    BASE: 100,
    LAYER_BONUS: {
      LEO: 0,
      MEO: 50,
      GEO: 100,
      GRAVEYARD: 0,
    },
  },
  DEBRIS_REMOVAL: {
    COOPERATIVE: 50,
    UNCOOPERATIVE: 75,
  },
  SATELLITE_RECOVERY: 200,
  BUDGET_MULTIPLIER: 10,
  SURVIVAL: {
    BASE: 50,
    MULTIPLIERS: [
      { threshold: 0, multiplier: 1 },
      { threshold: 501, multiplier: 1.5 },
      { threshold: 751, multiplier: 2 },
    ],
  },
};

export const SCORE_GRADES = {
  S: 50000,
  A: 30000,
  B: 15000,
  C: 5000,
  D: 0,
};

export function calculateSatelliteLaunchScore(satellites: Satellite[]): number {
  return satellites.reduce((total, satellite) => {
    const baseScore = SCORE_CONFIG.SATELLITE_LAUNCH.BASE;
    const layerBonus = SCORE_CONFIG.SATELLITE_LAUNCH.LAYER_BONUS[satellite.layer];
    return total + baseScore + layerBonus;
  }, 0);
}

export function calculateDebrisRemovalScore(gameState: GameState): number {
  const cooperativeScore = gameState.totalCooperativeDebrisRemoved * SCORE_CONFIG.DEBRIS_REMOVAL.COOPERATIVE;
  const uncooperativeScore = gameState.totalUncooperativeDebrisRemoved * SCORE_CONFIG.DEBRIS_REMOVAL.UNCOOPERATIVE;
  return cooperativeScore + uncooperativeScore;
}

export function calculateSatelliteRecoveryScore(satellitesRecovered: number): number {
  return satellitesRecovered * SCORE_CONFIG.SATELLITE_RECOVERY;
}

export function calculateBudgetManagementScore(budget: number): number {
  if (budget < 0) return 0;
  return (budget / 1_000_000) * SCORE_CONFIG.BUDGET_MULTIPLIER;
}

export function calculateSurvivalScore(days: number): number {
  const multiplier = SCORE_CONFIG.SURVIVAL.MULTIPLIERS
    .slice()
    .reverse()
    .find(m => days >= m.threshold)?.multiplier ?? 1;
  return days * SCORE_CONFIG.SURVIVAL.BASE * multiplier;
}

export interface ScoreComponents {
  satelliteLaunchScore: number;
  debrisRemovalScore: number;
  satelliteRecoveryScore: number;
  budgetManagementScore: number;
  survivalScore: number;
}

export function calculateTotalScore(components: ScoreComponents): number {
  return (
    components.satelliteLaunchScore +
    components.debrisRemovalScore +
    components.satelliteRecoveryScore +
    components.budgetManagementScore +
    components.survivalScore
  );
}
