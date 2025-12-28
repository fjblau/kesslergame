import type { RiskLevel } from '../types';

export function calculateRiskLevel(debrisCount: number, satelliteCount: number): RiskLevel {
  if (satelliteCount === 0) {
    return debrisCount === 0 ? 'LOW' : 'CRITICAL';
  }
  
  const ratio = debrisCount / satelliteCount;
  
  if (ratio < 2) {
    return 'LOW';
  } else if (ratio < 5) {
    return 'MEDIUM';
  } else {
    return 'CRITICAL';
  }
}
