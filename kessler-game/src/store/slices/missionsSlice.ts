import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MissionsState, GameState, OrbitLayer } from '../../game/types';
import { selectRandomMissions, createMissionTrackingData } from '../../game/missions';

const initialState: MissionsState = {
  availableMissions: [],
  activeMissions: [],
  trackingData: createMissionTrackingData(),
};

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    initializeMissions: (state, action: PayloadAction<number>) => {
      const count = action.payload;
      state.activeMissions = selectRandomMissions(count);
      state.trackingData = createMissionTrackingData();
    },

    updateMissionProgress: (state, action: PayloadAction<GameState>) => {
      const gameState = action.payload;
      
      state.activeMissions.forEach(mission => {
        if (mission.completed || mission.failed) return;

        switch (mission.id) {
          case 'gps-priority':
            mission.currentProgress = gameState.satellites.filter(s => s.purpose === 'GPS').length;
            break;

          case 'weather-network':
            mission.currentProgress = gameState.satellites.filter(s => s.purpose === 'Weather').length;
            break;

          case 'communications-hub':
            mission.currentProgress = gameState.satellites.filter(s => s.purpose === 'Comms').length;
            break;

          case 'debris-response-team':
            mission.currentProgress = state.trackingData.totalDRVsLaunched;
            break;

          case 'debris-cleaner':
            mission.currentProgress = state.trackingData.totalDRVsLaunched;
            break;

          case 'clean-sweep':
          case 'orbital-hygiene':
            mission.currentProgress = gameState.debrisRemovalVehicles.reduce(
              (sum, drv) => sum + drv.debrisRemoved,
              0
            );
            break;

          case 'risk-reduction': {
            if (gameState.debris.length >= 200) {
              state.trackingData.hasReachedDebris200 = true;
            }
            if (state.trackingData.hasReachedDebris200) {
              mission.currentProgress = gameState.debris.length;
              if (gameState.debris.length < 100) {
                mission.completed = true;
                mission.completedAt = gameState.step;
              }
            }
            break;
          }

          case 'safe-skies': {
            if (gameState.riskLevel === 'LOW') {
              state.trackingData.consecutiveLowRiskTurns++;
              mission.currentProgress = state.trackingData.consecutiveLowRiskTurns;
            } else {
              state.trackingData.consecutiveLowRiskTurns = 0;
              mission.currentProgress = 0;
            }
            break;
          }

          case 'satellite-fleet':
            mission.currentProgress = gameState.satellites.length;
            if (gameState.satellites.length >= 15) {
              mission.completed = true;
              mission.completedAt = gameState.step;
            }
            break;

          case 'multi-layer-network': {
            const layers = new Set(gameState.satellites.map(s => s.layer));
            const uniqueLayers = Array.from(layers) as OrbitLayer[];
            state.trackingData.layersWithSatellites = uniqueLayers;
            mission.currentProgress = uniqueLayers.length;
            if (uniqueLayers.length >= 3) {
              mission.completed = true;
              mission.completedAt = gameState.step;
            }
            break;
          }

          case 'full-coverage': {
            const leoCount = gameState.satellites.filter(s => s.layer === 'LEO').length;
            const meoCount = gameState.satellites.filter(s => s.layer === 'MEO').length;
            const geoCount = gameState.satellites.filter(s => s.layer === 'GEO').length;
            
            const hasFullCoverage = leoCount >= 2 && meoCount >= 2 && geoCount >= 2;
            mission.currentProgress = hasFullCoverage ? 1 : 0;
            
            if (hasFullCoverage) {
              mission.completed = true;
              mission.completedAt = gameState.step;
            }
            break;
          }

          case 'budget-mastery': {
            if (gameState.budget >= 50_000_000) {
              state.trackingData.consecutiveBudgetAbove50M++;
              mission.currentProgress = state.trackingData.consecutiveBudgetAbove50M;
            } else {
              state.trackingData.consecutiveBudgetAbove50M = 0;
              mission.currentProgress = 0;
            }
            break;
          }

          case 'no-cascades': {
            if (gameState.totalCascades > 0) {
              mission.failed = true;
              mission.currentProgress = 0;
            } else if (gameState.gameOver) {
              mission.currentProgress = 1;
              mission.completed = true;
              mission.completedAt = gameState.step;
            } else {
              mission.currentProgress = 0;
            }
            break;
          }
        }

        if (!mission.completed && mission.currentProgress >= mission.target) {
          mission.completed = true;
          mission.completedAt = gameState.step;
        }

        if (!mission.completed && mission.turnLimit && gameState.step > mission.turnLimit) {
          mission.failed = true;
        }
      });
    },

    trackDRVLaunch: (state) => {
      state.trackingData.totalDRVsLaunched++;
    },

    notifyMissionComplete: {
      reducer: () => {},
      prepare: (payload: { title: string; turn: number }) => ({ payload })
    },
  },
});

export const {
  initializeMissions,
  updateMissionProgress,
  trackDRVLaunch,
  notifyMissionComplete,
} = missionsSlice.actions;

export const selectActiveMissions = (state: { missions: MissionsState }) => state.missions.activeMissions;
export const selectCompletedMissions = (state: { missions: MissionsState }) => 
  state.missions.activeMissions.filter(m => m.completed);
export const selectIncompleteMissions = (state: { missions: MissionsState }) => 
  state.missions.activeMissions.filter(m => !m.completed && !m.failed);

export default missionsSlice.reducer;
