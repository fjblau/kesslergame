import type { RiskLevel } from '../types';

export function calculateRiskLevel(debrisCount: number, satelliteCount: number): RiskLevel {
  if (debrisCount === 0) {
    return 'LOW';
  }
  
  if (satelliteCount === 0) {
    return 'CRITICAL';
  }
  
  const ratio = debrisCount / satelliteCount;
  
  if (ratio < 5) {
    return 'MEDIUM';
  } else {
    return 'CRITICAL';
  }
}
