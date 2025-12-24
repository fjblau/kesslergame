import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIState, GameSpeed } from '../../game/types';

const initialState: UIState = {
  gameSpeed: 'normal',
  autoPauseOnCollision: true,
  autoPauseOnRiskChange: true,
  autoPauseOnBudgetLow: true,
  autoPauseOnMission: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGameSpeed: (state, action: PayloadAction<GameSpeed>) => {
      state.gameSpeed = action.payload;
    },

    toggleAutoPause: (state, action: PayloadAction<keyof Omit<UIState, 'gameSpeed'>>) => {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { setGameSpeed, toggleAutoPause } = uiSlice.actions;

export default uiSlice.reducer;
