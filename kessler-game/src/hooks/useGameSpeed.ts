import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { advanceTurn, decommissionExpiredDRVs, expireSatellites, triggerSolarStorm, incrementDays, processCollisions, processDRVOperations, addSatelliteRevenue, checkGameOver, setCollisionPauseCooldown, setBudgetPauseCooldown } from '../store/slices/gameSlice';
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
  const gameOver = useAppSelector(state => state.game.gameOver);
  const riskLevel = useAppSelector(state => state.game.riskLevel);
  const riskSpeedMultipliers = useAppSelector(state => state.game.riskSpeedMultipliers);
  const days = useAppSelector(state => state.game.days);
  const missions = useAppSelector(selectActiveMissions);
  const autoPauseBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const autoPauseOnCollision = useAppSelector(state => state.ui.autoPauseOnCollision);
  const collisionPauseCooldown = useAppSelector(state => state.game.collisionPauseCooldown);
  const budgetPauseCooldown = useAppSelector(state => state.game.budgetPauseCooldown);
  const dispatch = useAppDispatch();
  const previousRiskLevel = useRef(riskLevel);
  const previousMissionCompletionStatus = useRef(new Map<string, boolean>());
  const loggedCollisionIds = useRef(new Set<string>());
  const loggedExpiredDRVIds = useRef(new Set<string>());
  const loggedLaunchedSatelliteIds = useRef(new Set<string>());

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
    if (speed === 'paused' || gameOver) return;

    const daysInterval = setInterval(() => {
      dispatch(incrementDays());
    }, 1000);

    return () => clearInterval(daysInterval);
  }, [speed, gameOver, dispatch]);

  useEffect(() => {
    if (speed === 'paused' || gameOver) {
      return;
    }

    const shouldPause = autoPauseBudgetLow && budget < 20_000_000 && budgetPauseCooldown === 0;

    if (shouldPause) {
      const currentState = (store.getState() as RootState).game;
      dispatch(setGameSpeed('paused'));
      dispatch(setBudgetPauseCooldown(4));
      dispatch(addEvent({
        type: 'collision',
        turn: currentState.step,
        day: currentState.days,
        message: '⚠️ Budget critically low! Game paused. Unpause to let satellites generate income, or disable "Auto-Pause on Low Budget" in Configuration.',
        details: { autoPause: true, reason: 'budget' }
      }));
      return;
    }

    const baseInterval = speed === 'fast' ? 2000 : 4000;
    const multiplier = riskSpeedMultipliers[riskLevel];
    const intervalDuration = Math.round(baseInterval * multiplier);

    const interval = setInterval(() => {
      dispatch(processDRVOperations());
      dispatch(advanceTurn());

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

      currentState.recentSatelliteCaptures.forEach(capture => {
        let message = `Cooperative DRV captured ${capture.satellite.purpose} satellite in ${capture.layer} orbit`;
        
        if (capture.satellite.metadata) {
          message = `Cooperative DRV captured '${capture.satellite.metadata.name}' (${capture.satellite.metadata.country}, ${capture.satellite.metadata.weight_kg} kg, ${capture.satellite.metadata.launch_vehicle} from ${capture.satellite.metadata.launch_site}) in ${capture.layer} orbit`;
        }
        
        dispatch(addEvent({
          type: 'debris-removal',
          turn: currentState.step,
          day: currentState.days,
          message,
          details: {
            drvId: capture.drvId,
            drvType: capture.drvType,
            layer: capture.layer,
            satelliteId: capture.satellite.id,
            purpose: capture.satellite.purpose,
            ...(capture.satellite.metadata && {
              name: capture.satellite.metadata.name,
              country: capture.satellite.metadata.country,
              weight_kg: capture.satellite.metadata.weight_kg,
              launch_vehicle: capture.satellite.metadata.launch_vehicle,
              launch_site: capture.satellite.metadata.launch_site,
            })
          }
        }));
      });

      currentState.recentGraveyardMoves.forEach(move => {
        const satellite = currentState.satellites.find(s => s.id === move.satelliteId);
        let message = `GeoTug moved ${move.purpose} satellite to graveyard orbit`;
        
        if (satellite?.metadata) {
          message = `GeoTug moved '${satellite.metadata.name}' (${satellite.metadata.country}, ${satellite.metadata.weight_kg} kg, ${satellite.metadata.launch_vehicle} from ${satellite.metadata.launch_site}) to graveyard orbit`;
        }
        
        dispatch(addEvent({
          type: 'satellite-graveyard',
          turn: currentState.step,
          day: currentState.days,
          message,
          details: {
            satelliteId: move.satelliteId,
            tugId: move.tugId,
            purpose: move.purpose,
            ...(satellite?.metadata && {
              name: satellite.metadata.name,
              country: satellite.metadata.country,
              weight_kg: satellite.metadata.weight_kg,
              launch_vehicle: satellite.metadata.launch_vehicle,
              launch_site: satellite.metadata.launch_site,
            })
          }
        }));
      });

      currentState.recentRefuelings.forEach(refueling => {
        const targetType = refueling.targetType === 'satellite' ? 'satellite' : 'DRV';
        const target = refueling.targetType === 'satellite' 
          ? currentState.satellites.find(s => s.id === refueling.targetId)
          : currentState.debrisRemovalVehicles.find(d => d.id === refueling.targetId);
        
        let message = `Refueling vehicle refueled ${targetType} in ${refueling.layer} orbit`;
        
        if (refueling.targetType === 'satellite' && target && 'purpose' in target && target.metadata) {
          message = `Refueling vehicle refueled '${target.metadata.name}' (${target.metadata.country}) in ${refueling.layer} orbit`;
        }
        
        dispatch(addEvent({
          type: 'debris-removal',
          turn: currentState.step,
          day: currentState.days,
          message,
          details: {
            refuelingVehicleId: refueling.refuelingVehicleId,
            targetId: refueling.targetId,
            targetType: refueling.targetType,
            layer: refueling.layer,
            previousAge: refueling.previousAge,
            newAge: refueling.newAge,
          }
        }));
      });

      currentState.recentlyLaunchedSatellites.forEach(launchedInfo => {
        if (!loggedLaunchedSatelliteIds.current.has(launchedInfo.satellite.id)) {
          loggedLaunchedSatelliteIds.current.add(launchedInfo.satellite.id);
          const sat = launchedInfo.satellite;
          let message = `Launched ${sat.purpose} satellite in ${sat.layer} orbit`;
          
          if (sat.metadata) {
            message = `Launched ${sat.purpose} satellite '${sat.metadata.name}' (${sat.metadata.country}, ${sat.metadata.weight_kg} kg, ${sat.metadata.launch_vehicle} from ${sat.metadata.launch_site}) in ${sat.layer} orbit`;
          }
          
          dispatch(addEvent({
            type: 'satellite-launch',
            turn: launchedInfo.turn,
            day: launchedInfo.day,
            message,
            details: { 
              orbit: sat.layer, 
              purpose: sat.purpose, 
              insuranceTier: sat.insuranceTier,
              ...(sat.metadata && {
                name: sat.metadata.name,
                country: sat.metadata.country,
                weight_kg: sat.metadata.weight_kg,
                launch_vehicle: sat.metadata.launch_vehicle,
                launch_site: sat.metadata.launch_site,
              })
            }
          }));
        }
      });

      dispatch(processCollisions());
      dispatch(addSatelliteRevenue());

      setTimeout(() => {
        const updatedState = (store.getState() as RootState).game;
        
        updatedState.recentCollisions.forEach(collision => {
          if (!loggedCollisionIds.current.has(collision.id)) {
            loggedCollisionIds.current.add(collision.id);
            
            const involvedSatellites = updatedState.satellites.filter(s => collision.objectIds.includes(s.id));
            let message = `Collision detected in ${collision.layer} orbit - debris created`;
            const satelliteMetadata: Array<{ name: string; country: string; weight_kg: number; launch_vehicle: string; launch_site: string; }> = [];
            
            if (involvedSatellites.length > 0) {
              const satelliteNames = involvedSatellites
                .map(s => s.metadata ? `'${s.metadata.name}' (${s.metadata.country})` : `${s.purpose} satellite`)
                .join(' and ');
              message = `Collision in ${collision.layer} orbit involving ${satelliteNames} - debris created`;
              
              involvedSatellites.forEach(s => {
                if (s.metadata) {
                  satelliteMetadata.push({
                    name: s.metadata.name,
                    country: s.metadata.country,
                    weight_kg: s.metadata.weight_kg,
                    launch_vehicle: s.metadata.launch_vehicle,
                    launch_site: s.metadata.launch_site,
                  });
                }
              });
            }
            
            dispatch(addEvent({
              type: 'collision',
              turn: updatedState.step,
              day: updatedState.days,
              message,
              details: { 
                layer: collision.layer, 
                objectIds: collision.objectIds,
                ...(satelliteMetadata.length > 0 && { satelliteMetadata })
              }
            }));
          }
        });

        if (autoPauseOnCollision && updatedState.recentCollisions.length > 0 && !updatedState.gameOver && updatedState.collisionPauseCooldown === 0) {
          dispatch(setGameSpeed('paused'));
          dispatch(setCollisionPauseCooldown(2));
          dispatch(addEvent({
            type: 'collision',
            turn: updatedState.step,
            day: updatedState.days,
            message: '⏸️ Game paused due to collision. Launch DRVs to mitigate debris, then resume when ready.',
            details: { autoPause: true }
          }));
          clearInterval(interval);
          return;
        }

        if (autoPauseBudgetLow && updatedState.budget < 20_000_000 && !updatedState.gameOver && updatedState.budgetPauseCooldown === 0) {
          dispatch(setGameSpeed('paused'));
          dispatch(setBudgetPauseCooldown(4));
          dispatch(addEvent({
            type: 'collision',
            turn: updatedState.step,
            day: updatedState.days,
            message: '⚠️ Budget critically low! Game paused. Unpause to let satellites generate income, or disable "Auto-Pause on Low Budget" in Configuration.',
            details: { autoPause: true, reason: 'budget' }
          }));
          clearInterval(interval);
        }
      }, 10);

      if (checkSolarStorm(currentState.solarStormProbability)) {
        const debrisCountsByLayer: Record<string, number> = {
          LEO: currentState.debris.filter(d => d.layer === 'LEO').length,
          MEO: currentState.debris.filter(d => d.layer === 'MEO').length,
          GEO: currentState.debris.filter(d => d.layer === 'GEO').length,
        };
        
        dispatch(triggerSolarStorm());
        
        setTimeout(() => {
          const afterStormState = (store.getState() as RootState).game;
          const flareEvent = afterStormState.lastSolarFlare;
          
          if (!flareEvent) return;
          
          const debrisRemoved: Record<string, number> = {};
          let totalRemoved = 0;
          
          flareEvent.affectedLayers.forEach(layer => {
            const afterCount = afterStormState.debris.filter(d => d.layer === layer).length;
            const removed = debrisCountsByLayer[layer] - afterCount;
            if (removed > 0) {
              debrisRemoved[layer] = removed;
              totalRemoved += removed;
            }
          });
          
          const layerMessages = Object.entries(debrisRemoved)
            .map(([layer, count]) => `${count} from ${layer}`)
            .join(', ');
          
          const flareClassification = `${flareEvent.class}${flareEvent.intensity.toFixed(1)}`;
          const clearanceText = totalRemoved > 0 ? `Cleared ${layerMessages}` : 'No Debris Cleared';
          const message = `☀️ ${flareClassification} Solar Flare detected! ${clearanceText}`;
          
          dispatch(addEvent({
            type: 'solar-storm',
            turn: afterStormState.step,
            day: afterStormState.days,
            message,
            details: {
              flareClass: flareEvent.class,
              intensity: flareEvent.intensity,
              xRayFlux: flareEvent.xRayFlux,
              debrisRemoved,
              totalRemoved,
            }
          }));
        }, 10);
      }

      dispatch(updateMissionProgress(currentState));
      dispatch(expireSatellites());
      dispatch(decommissionExpiredDRVs());
      dispatch(checkGameOver());

      setTimeout(() => {
        const updatedState = (store.getState() as RootState).game;
        
        const expiredSatelliteCount = updatedState.satellitesExpired - (currentState.satellitesExpired || 0);
        if (expiredSatelliteCount > 0) {
          dispatch(addEvent({
            type: 'satellite-expired',
            turn: updatedState.step,
            day: updatedState.days,
            message: `${expiredSatelliteCount} satellite${expiredSatelliteCount > 1 ? 's' : ''} expired and de-orbited`,
            details: { expiredCount: expiredSatelliteCount }
          }));
        }
        
        updatedState.recentlyExpiredDRVs.forEach(expiredDRV => {
          if (!loggedExpiredDRVIds.current.has(expiredDRV.id)) {
            loggedExpiredDRVIds.current.add(expiredDRV.id);
            const drvTypeName = expiredDRV.type === 'cooperative' ? 'Cooperative' : 
                               expiredDRV.type === 'refueling' ? 'Refueling' :
                               expiredDRV.type === 'geotug' ? 'GeoTug' : 'Uncooperative';
            dispatch(addEvent({
              type: 'drv-expired',
              turn: updatedState.step,
              day: updatedState.days,
              message: `${drvTypeName} DRV decommissioned in ${expiredDRV.layer} orbit (removed ${expiredDRV.debrisRemoved} debris)`,
              details: { type: expiredDRV.type, layer: expiredDRV.layer, debrisRemoved: expiredDRV.debrisRemoved }
            }));
          }
        });
      }, 10);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [speed, gameOver, budget, autoPauseBudgetLow, autoPauseOnCollision, collisionPauseCooldown, budgetPauseCooldown, riskSpeedMultipliers, riskLevel, dispatch, store]);
}
