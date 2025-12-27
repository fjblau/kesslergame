import type { Middleware } from '@reduxjs/toolkit';
import {
  advanceTurn,
  launchSatellite,
  launchDRV,
  processDRVOperations,
  processCollisions,
  spendBudget,
  addBudget,
  initializeGame,
} from '../slices/gameSlice';
import { calculateScore, resetScore } from '../slices/scoreSlice';

export const scoreMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (initializeGame.match(action)) {
    store.dispatch(resetScore());
  } else if (
    advanceTurn.match(action) ||
    launchSatellite.match(action) ||
    launchDRV.match(action) ||
    processDRVOperations.match(action) ||
    processCollisions.match(action) ||
    spendBudget.match(action) ||
    addBudget.match(action)
  ) {
    const state = store.getState();
    store.dispatch(calculateScore(state.game));
  }

  return result;
};
