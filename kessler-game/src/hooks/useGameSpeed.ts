import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn, decommissionExpiredDRVs, triggerSolarStorm, incrementDays, processCollisions, processDRVOperations, addSatelliteRevenue } from '../store/slices/gameSlice';
import { setGameSpeed } from '../store/slices/uiSlice';
import { updateMissionProgress, notifyMissionComplete, selectActiveMissions } from '../store/slices/missionsSlice';
import { addEvent } from '../store/slices/eventSlice';
import { checkSolarStorm } from '../game/engine/events';
import { useStore } from 'react-redux';
import type { RootState } from '../store';

export function useGameSpeed() {
  const store = useStore();
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const budget = useAppSelector(state => state.game.budget);
  const riskLevel = useAppSelector(state => state.game.riskLevel);
  const riskSpeedMultipliers = useAppSelector(state => state.game.riskSpeedMultipliers);
  const days = useAppSelector(state => state.game.days);
  const missions = useAppSelector(selectActiveMissions);
  const autoPauseBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const dispatch = useAppDispatch();
  const previousRiskLevel = useRef(riskLevel);
  const previousMissionCompletionStatus = useRef(new Map<string, boolean>());
  const loggedCollisionIds = useRef(new Set<string>());
  const loggedExpiredDRVIds = useRef(new Set<string>());

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
        dispatch(notifyMissionComplete({ title: mission.title, turn: mission.completedAt, day: days }));
      }
      previousMissionCompletionStatus.current.set(mission.id, mission.completed);
    });
  }, [missions, dispatch, days]);

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

    const baseInterval = speed === 'fast' ? 2000 : 4000;
    const multiplier = riskSpeedMultipliers[riskLevel];
    const intervalDuration = Math.round(baseInterval * multiplier);

    const interval = setInterval(() => {
      dispatch(advanceTurn());
      dispatch(processDRVOperations());

      const currentState = (store.getState() as RootState).game;

      currentState.recentDebrisRemovals.forEach(removal => {
        dispatch(addEvent({
          type: 'debris-removal',
          turn: currentState.step,
          day: currentState.days,
          message: `${removal.drvType === 'cooperative' ? 'Cooperative' : 'Uncooperative'} DRV removed ${removal.debrisType} debris in ${removal.layer} orbit`,
          details: { drvType: removal.drvType, debrisType: removal.debrisType, layer: removal.layer }
        }));
      });

      dispatch(processCollisions());
      dispatch(addSatelliteRevenue());

      setTimeout(() => {
        const updatedState = (store.getState() as RootState).game;
        updatedState.recentCollisions.forEach(collision => {
          if (!loggedCollisionIds.current.has(collision.id)) {
            loggedCollisionIds.current.add(collision.id);
            dispatch(addEvent({
              type: 'collision',
              turn: updatedState.step,
              day: updatedState.days,
              message: `Collision detected in ${collision.layer} orbit - debris created`,
              details: { layer: collision.layer, objectIds: collision.objectIds }
            }));
          }
        });
      }, 10);

      if (checkSolarStorm(currentState.solarStormProbability)) {
        const leoDebrisCountBefore = currentState.debris.filter(d => d.layer === 'LEO').length;
        dispatch(triggerSolarStorm());
        setTimeout(() => {
          const afterStormState = (store.getState() as RootState).game;
          const leoDebrisCountAfter = afterStormState.debris.filter(d => d.layer === 'LEO').length;
          const removedCount = leoDebrisCountBefore - leoDebrisCountAfter;
          
          dispatch(addEvent({
            type: 'solar-storm',
            turn: afterStormState.step,
            day: afterStormState.days,
            message: `☀️ Solar storm cleared ${removedCount} debris from LEO!`,
            details: { debrisRemoved: removedCount }
          }));
        }, 10);
      }

      dispatch(updateMissionProgress(currentState));
      dispatch(decommissionExpiredDRVs());

      setTimeout(() => {
        const updatedState = (store.getState() as RootState).game;
        updatedState.recentlyExpiredDRVs.forEach(expiredDRV => {
          if (!loggedExpiredDRVIds.current.has(expiredDRV.id)) {
            loggedExpiredDRVIds.current.add(expiredDRV.id);
            dispatch(addEvent({
              type: 'drv-expired',
              turn: updatedState.step,
              day: updatedState.days,
              message: `${expiredDRV.type === 'cooperative' ? 'Cooperative' : 'Uncooperative'} DRV expired in ${expiredDRV.layer} orbit (removed ${expiredDRV.debrisRemoved} debris, created 1 debris)`,
              details: { type: expiredDRV.type, layer: expiredDRV.layer, debrisRemoved: expiredDRV.debrisRemoved }
            }));
          }
        });
      }, 10);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [speed, budget, autoPauseBudgetLow, riskSpeedMultipliers, riskLevel, dispatch, store]);
}
