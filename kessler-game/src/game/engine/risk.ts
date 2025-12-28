import type { RiskLevel } from '../types';

export function calculateRiskLevel(debrisCount: number): RiskLevel {
  if (debrisCount === 0) {
    return 'LOW';
  } else if (debrisCount <= 20) {
    return 'MEDIUM';
  } else {
    return 'CRITICAL';
  }
}
