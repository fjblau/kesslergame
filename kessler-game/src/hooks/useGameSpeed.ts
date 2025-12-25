import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn, decommissionExpiredDRVs } from '../store/slices/gameSlice';
import { setGameSpeed } from '../store/slices/uiSlice';

export function useGameSpeed() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const budget = useAppSelector(state => state.game.budget);
  const riskLevel = useAppSelector(state => state.game.riskLevel);
  const autoPauseBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const dispatch = useAppDispatch();
  const previousRiskLevel = useRef(riskLevel);

  useEffect(() => {
    if (autoPauseOnRiskChange && riskLevel !== previousRiskLevel.current) {
      dispatch(setGameSpeed('paused'));
    }
    previousRiskLevel.current = riskLevel;
  }, [riskLevel, autoPauseOnRiskChange, dispatch]);

  useEffect(() => {
    if (speed !== 'fast') return;

    const shouldPause = autoPauseBudgetLow && budget < 20_000_000;

    if (shouldPause) {
      dispatch(setGameSpeed('paused'));
      return;
    }

    const interval = setInterval(() => {
      dispatch(advanceTurn());
      dispatch(decommissionExpiredDRVs());
    }, 2000);

    return () => clearInterval(interval);
  }, [speed, budget, autoPauseBudgetLow, dispatch]);
}
