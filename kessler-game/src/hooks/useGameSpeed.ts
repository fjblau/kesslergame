import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn, decommissionExpiredDRVs, triggerSolarStorm, incrementDays, processCollisions } from '../store/slices/gameSlice';
import { setGameSpeed } from '../store/slices/uiSlice';
import { updateMissionProgress, notifyMissionComplete, selectActiveMissions } from '../store/slices/missionsSlice';
import { addEvent } from '../store/slices/eventSlice';
import { checkSolarStorm } from '../game/engine/events';

export function useGameSpeed() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const budget = useAppSelector(state => state.game.budget);
  const riskLevel = useAppSelector(state => state.game.riskLevel);
  const gameState = useAppSelector(state => state.game);
  const missions = useAppSelector(selectActiveMissions);
  const autoPauseBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const dispatch = useAppDispatch();
  const previousRiskLevel = useRef(riskLevel);
  const previousMissionCompletionStatus = useRef(new Map<string, boolean>());

  useEffect(() => {
    if (autoPauseOnRiskChange && riskLevel !== previousRiskLevel.current) {
      dispatch(setGameSpeed('paused'));
    }
    previousRiskLevel.current = riskLevel;
  }, [riskLevel, autoPauseOnRiskChange, dispatch]);

  useEffect(() => {
    missions.forEach(mission => {
      const wasCompleted = previousMissionCompletionStatus.current.get(mission.id);
      if (mission.completed && !wasCompleted && mission.completedAt !== undefined) {
        dispatch(notifyMissionComplete({ title: mission.title, turn: mission.completedAt }));
      }
      previousMissionCompletionStatus.current.set(mission.id, mission.completed);
    });
  }, [missions, dispatch]);

  useEffect(() => {
    if (speed === 'paused') return;

    const daysInterval = setInterval(() => {
      dispatch(incrementDays());
    }, 1000);

    return () => clearInterval(daysInterval);
  }, [speed, dispatch]);

  useEffect(() => {
    console.log('[useGameSpeed] Speed changed to:', speed);
    
    if (speed === 'paused') {
      console.log('[useGameSpeed] Game is paused, not running loop');
      return;
    }

    const shouldPause = autoPauseBudgetLow && budget < 20_000_000;

    if (shouldPause) {
      console.log('[useGameSpeed] Auto-pausing due to low budget');
      dispatch(setGameSpeed('paused'));
      return;
    }

    const intervalDuration = speed === 'fast' ? 2000 : 4000;
    console.log('[useGameSpeed] Starting game loop with interval:', intervalDuration);

    const interval = setInterval(() => {
      console.log('[useGameSpeed] ⭐⭐⭐ GAME LOOP TICK ⭐⭐⭐');
      console.log('[useGameSpeed] TEST 1');
      console.log('[useGameSpeed] TEST 2');
      console.log('[useGameSpeed] TEST 3');
      dispatch(advanceTurn());
      console.log('[useGameSpeed] TEST 4');
      dispatch(processCollisions());
      console.log('[useGameSpeed] TEST 5');

      if (checkSolarStorm()) {
        const leoDebrisCountBefore = gameState.debris.filter(d => d.layer === 'LEO').length;
        dispatch(triggerSolarStorm());
        const leoDebrisCountAfter = gameState.debris.filter(d => d.layer === 'LEO').length;
        const removedCount = leoDebrisCountBefore - leoDebrisCountAfter;
        
        dispatch(addEvent({
          type: 'solar-storm',
          turn: gameState.step + 1,
          message: `☀️ Solar storm cleared ${removedCount} debris from LEO!`,
          details: { debrisRemoved: removedCount }
        }));
      }

      dispatch(updateMissionProgress(gameState));
      dispatch(decommissionExpiredDRVs());
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [speed, budget, autoPauseBudgetLow, gameState, dispatch]);
}
