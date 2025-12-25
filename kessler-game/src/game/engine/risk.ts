import type { RiskLevel } from '../types';

export function calculateRiskLevel(debrisCount: number): RiskLevel {
  if (debrisCount < 150) {
    return 'LOW';
  } else if (debrisCount <= 300) {
    return 'MEDIUM';
  } else {
    return 'CRITICAL';
  }
}
