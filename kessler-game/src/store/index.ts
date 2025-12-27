import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import missionsReducer from './slices/missionsSlice';
import eventsReducer from './slices/eventSlice';
import scoreReducer from './slices/scoreSlice';
import { scoreMiddleware } from './middleware/scoreMiddleware';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    missions: missionsReducer,
    events: eventsReducer,
    score: scoreReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(scoreMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
