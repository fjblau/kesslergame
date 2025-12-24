import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
