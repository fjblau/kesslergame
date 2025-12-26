import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn, decommissionExpiredDRVs, triggerSolarStorm, incrementDays, processCollisions, processDRVOperations } from '../store/slices/gameSlice';
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
  const loggedCollisionIds = useRef(new Set<string>());

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
    if (speed === 'paused') {
      return;
    }

    const shouldPause = autoPauseBudgetLow && budget < 20_000_000;

    if (shouldPause) {
      dispatch(setGameSpeed('paused'));
      return;
    }

    const intervalDuration = speed === 'fast' ? 2000 : 4000;

    const interval = setInterval(() => {
      dispatch(advanceTurn());
      dispatch(processDRVOperations());

      gameState.recentDebrisRemovals.forEach(removal => {
        dispatch(addEvent({
          type: 'debris-removal',
          turn: gameState.step + 1,
          day: gameState.days,
          message: `${removal.drvType === 'cooperative' ? 'Cooperative' : 'Uncooperative'} DRV removed ${removal.debrisType} debris in ${removal.layer} orbit`,
          details: { drvType: removal.drvType, debrisType: removal.debrisType, layer: removal.layer }
        }));
      });

      dispatch(processCollisions());

      gameState.recentCollisions.forEach(collision => {
        if (!loggedCollisionIds.current.has(collision.id)) {
          loggedCollisionIds.current.add(collision.id);
          dispatch(addEvent({
            type: 'collision',
            turn: gameState.step + 1,
            day: gameState.days,
            message: `Collision detected in ${collision.layer} orbit`,
            details: { layer: collision.layer, objectIds: collision.objectIds }
          }));
        }
      });

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

      gameState.recentlyExpiredDRVs.forEach(expiredDRV => {
        dispatch(addEvent({
          type: 'drv-expired',
          turn: gameState.step + 1,
          day: gameState.days,
          message: `${expiredDRV.type === 'cooperative' ? 'Cooperative' : 'Uncooperative'} DRV expired in ${expiredDRV.layer} orbit (removed ${expiredDRV.debrisRemoved} debris)`,
          details: { type: expiredDRV.type, layer: expiredDRV.layer, debrisRemoved: expiredDRV.debrisRemoved }
        }));
      });
    }, intervalDuration);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, budget, autoPauseBudgetLow, dispatch]);
}
