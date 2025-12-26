import type { MissionDefinition, MissionsState } from './types';

export const MISSION_DEFINITIONS: Omit<MissionDefinition, 'currentProgress' | 'completed' | 'failed' | 'completedAt'>[] = [
  {
    id: 'gps-priority',
    title: 'GPS Priority',
    description: 'Launch 3 GPS satellites by turn 20',
    category: 'launch',
    target: 3,
    turnLimit: 20,
    trackingType: 'cumulative',
  },
  {
    id: 'weather-network',
    title: 'Weather Network',
    description: 'Launch 4 Weather satellites by turn 30',
    category: 'launch',
    target: 4,
    turnLimit: 30,
    trackingType: 'cumulative',
  },
  {
    id: 'communications-hub',
    title: 'Communications Hub',
    description: 'Launch 5 Comms satellites by turn 40',
    category: 'launch',
    target: 5,
    turnLimit: 40,
    trackingType: 'cumulative',
  },
  {
    id: 'debris-response-team',
    title: 'Debris Response Team',
    description: 'Launch 3 debris removal vehicles by turn 25',
    category: 'launch',
    target: 3,
    turnLimit: 25,
    trackingType: 'cumulative',
  },
  {
    id: 'debris-cleaner',
    title: 'Debris Cleaner',
    description: 'Launch 2 debris removal vehicles',
    category: 'removal',
    target: 2,
    trackingType: 'cumulative',
  },
  {
    id: 'clean-sweep',
    title: 'Clean Sweep',
    description: 'Remove 50 debris pieces total by turn 50',
    category: 'removal',
    target: 50,
    turnLimit: 50,
    trackingType: 'cumulative',
  },
  {
    id: 'orbital-hygiene',
    title: 'Orbital Hygiene',
    description: 'Remove 100 debris pieces total by turn 80',
    category: 'removal',
    target: 100,
    turnLimit: 80,
    trackingType: 'cumulative',
  },
  {
    id: 'risk-reduction',
    title: 'Risk Reduction',
    description: 'Reduce debris count from 200+ to below 100',
    category: 'state',
    target: 100,
    startThreshold: 200,
    trackingType: 'threshold',
  },
  {
    id: 'safe-skies',
    title: 'Safe Skies',
    description: 'Maintain LOW risk level for 10 consecutive turns',
    category: 'state',
    target: 10,
    trackingType: 'consecutive',
  },
  {
    id: 'satellite-fleet',
    title: 'Satellite Fleet',
    description: 'Have 15+ active satellites at once',
    category: 'state',
    target: 15,
    trackingType: 'snapshot',
  },
  {
    id: 'multi-layer-network',
    title: 'Multi-Layer Network',
    description: 'Launch satellites in all three orbital layers (LEO, MEO, GEO)',
    category: 'multi-layer',
    target: 3,
    trackingType: 'boolean',
  },
  {
    id: 'full-coverage',
    title: 'Full Coverage',
    description: 'Have at least 2 satellites in each orbital layer simultaneously',
    category: 'multi-layer',
    target: 1,
    trackingType: 'snapshot',
  },
  {
    id: 'budget-mastery',
    title: 'Budget Mastery',
    description: 'Maintain budget above 50M for 15 consecutive turns',
    category: 'economic',
    target: 15,
    trackingType: 'consecutive',
  },
  {
    id: 'no-cascades',
    title: 'Cascade Prevention',
    description: 'Complete the game without triggering any cascade events (3+ collisions in one turn)',
    category: 'state',
    target: 1,
    trackingType: 'boolean',
  },
];

export function selectRandomMissions(count: number = 3): MissionDefinition[] {
  const shuffled = [...MISSION_DEFINITIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  
  return selected.map(mission => ({
    ...mission,
    currentProgress: 0,
    completed: false,
    failed: false,
  }));
}

export function createMissionTrackingData(): MissionsState['trackingData'] {
  return {
    consecutiveLowRiskTurns: 0,
    consecutiveBudgetAbove50M: 0,
    hasReachedDebris200: false,
    layersWithSatellites: [],
    totalDRVsLaunched: 0,
  };
}
