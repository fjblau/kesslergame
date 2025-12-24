import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn } from '../store/slices/gameSlice';
import { setGameSpeed } from '../store/slices/uiSlice';

export function useGameSpeed() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const budget = useAppSelector(state => state.game.budget);
  const autoPauseBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (speed !== 'fast') return;

    const shouldPause = autoPauseBudgetLow && budget < 20_000_000;

    if (shouldPause) {
      dispatch(setGameSpeed('paused'));
      return;
    }

    const interval = setInterval(() => {
      dispatch(advanceTurn());
    }, 2000);

    return () => clearInterval(interval);
  }, [speed, budget, autoPauseBudgetLow, dispatch]);
}
