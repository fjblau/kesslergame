import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ScoreState, GameState } from '../../game/types';
import {
  calculateSatelliteLaunchScore,
  calculateDebrisRemovalScore,
  calculateSatelliteRecoveryScore,
  calculateBudgetManagementScore,
  calculateSurvivalScore,
  calculateTotalScore,
} from '../../game/scoring';

const initialState: ScoreState = {
  totalScore: 0,
  satelliteLaunchScore: 0,
  debrisRemovalScore: 0,
  satelliteRecoveryScore: 0,
  budgetManagementScore: 0,
  survivalScore: 0,
  satellitesRecovered: 0,
  scoreHistory: [],
};

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    calculateScore: (state, action: PayloadAction<GameState>) => {
      const gameState = action.payload;
      
      state.satelliteLaunchScore = calculateSatelliteLaunchScore(gameState.satellites);
      state.debrisRemovalScore = calculateDebrisRemovalScore(gameState.debrisRemovalVehicles);
      state.satelliteRecoveryScore = calculateSatelliteRecoveryScore(gameState.satellitesRecovered);
      state.satellitesRecovered = gameState.satellitesRecovered;
      state.budgetManagementScore = calculateBudgetManagementScore(gameState.budget);
      state.survivalScore = calculateSurvivalScore(gameState.days);
      
      state.totalScore = calculateTotalScore({
        satelliteLaunchScore: state.satelliteLaunchScore,
        debrisRemovalScore: state.debrisRemovalScore,
        satelliteRecoveryScore: state.satelliteRecoveryScore,
        budgetManagementScore: state.budgetManagementScore,
        survivalScore: state.survivalScore,
      });
      
      if (gameState.step > 0) {
        const lastHistoryEntry = state.scoreHistory[state.scoreHistory.length - 1];
        if (!lastHistoryEntry || lastHistoryEntry.turn !== gameState.step) {
          state.scoreHistory.push({
            turn: gameState.step,
            totalScore: state.totalScore,
          });
        }
      }
    },
    
    incrementSatellitesRecovered: (state, action: PayloadAction<number>) => {
      state.satellitesRecovered += action.payload;
    },
    
    resetScore: () => initialState,
  },
});

export const { calculateScore, incrementSatellitesRecovered, resetScore } = scoreSlice.actions;

export const selectScore = (state: { score: ScoreState }) => state.score;
export const selectTotalScore = (state: { score: ScoreState }) => state.score.totalScore;
export const selectScoreBreakdown = (state: { score: ScoreState }) => ({
  satelliteLaunchScore: state.score.satelliteLaunchScore,
  debrisRemovalScore: state.score.debrisRemovalScore,
  satelliteRecoveryScore: state.score.satelliteRecoveryScore,
  budgetManagementScore: state.score.budgetManagementScore,
  survivalScore: state.score.survivalScore,
});
export const selectScoreHistory = (state: { score: ScoreState }) => state.score.scoreHistory;

export default scoreSlice.reducer;
