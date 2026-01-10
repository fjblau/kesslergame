import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState, GameSpeed } from '../../game/types';

const loadTutorialCompleted = (): boolean => {
  try {
    const saved = localStorage.getItem('tutorialCompleted');
    return saved === 'true';
  } catch {
    return false;
  }
};

const saveTutorialCompleted = (completed: boolean): void => {
  try {
    localStorage.setItem('tutorialCompleted', completed.toString());
  } catch {
    // Ignore localStorage errors
  }
};

const initialState: UIState = {
  gameSpeed: 'normal',
  autoPauseOnCollision: true,
  autoPauseOnRiskChange: false,
  autoPauseOnBudgetLow: true,
  autoPauseOnMission: true,
  tutorialActive: false,
  tutorialStep: 0,
  tutorialCompleted: loadTutorialCompleted(),
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGameSpeed: (state, action: PayloadAction<GameSpeed>) => {
      state.gameSpeed = action.payload;
    },

    toggleAutoPause: (state, action: PayloadAction<keyof Omit<UIState, 'gameSpeed' | 'tutorialActive' | 'tutorialStep' | 'tutorialCompleted'>>) => {
      state[action.payload] = !state[action.payload];
    },

    startTutorial: (state) => {
      state.tutorialActive = true;
      state.tutorialStep = 0;
    },

    nextTutorialStep: (state) => {
      state.tutorialStep += 1;
    },

    previousTutorialStep: (state) => {
      if (state.tutorialStep > 0) {
        state.tutorialStep -= 1;
      }
    },

    skipTutorial: (state) => {
      state.tutorialActive = false;
      state.tutorialCompleted = true;
      saveTutorialCompleted(true);
    },

    completeTutorial: (state) => {
      state.tutorialActive = false;
      state.tutorialCompleted = true;
      saveTutorialCompleted(true);
    },
  },
});

export const { 
  setGameSpeed, 
  toggleAutoPause, 
  startTutorial, 
  nextTutorialStep, 
  previousTutorialStep, 
  skipTutorial, 
  completeTutorial 
} = uiSlice.actions;

export default uiSlice.reducer;
