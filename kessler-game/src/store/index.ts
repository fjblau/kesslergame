import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import missionsReducer from './slices/missionsSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    missions: missionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
