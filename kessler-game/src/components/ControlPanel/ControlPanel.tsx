import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { launchSatellite, launchDRV, spendBudget, advanceTurn, decommissionExpiredDRVs, triggerSolarStorm } from '../../store/slices/gameSlice';
import { updateMissionProgress, trackDRVLaunch } from '../../store/slices/missionsSlice';
import { addEvent } from '../../store/slices/eventSlice';
import type { OrbitLayer, SatelliteType, InsuranceTier, DRVType } from '../../game/types';
import { LAUNCH_COSTS, INSURANCE_CONFIG, DRV_CONFIG, SATELLITE_PURPOSE_CONFIG, BUDGET_DIFFICULTY_CONFIG } from '../../game/constants';
import { checkSolarStorm } from '../../game/engine/events';
import { InsuranceTierSelector } from './InsuranceTierSelector';
import { SatellitePurposeSelector } from '../SatelliteConfig/SatellitePurposeSelector';
import { BudgetGauge } from './BudgetGauge';
import { useStore } from 'react-redux';
import type { RootState } from '../../store';


export function ControlPanel() {
  const dispatch = useAppDispatch();
  const store = useStore();
  const budget = useAppSelector(state => state.game.budget);
  const budgetDifficulty = useAppSelector(state => state.game.budgetDifficulty);

  const [launchType, setLaunchType] = useState<'satellite' | 'drv' | 'geotug' | 'servicing'>('satellite');
  const [selectedOrbit, setSelectedOrbit] = useState<OrbitLayer>('LEO');
  const [insuranceTier, setInsuranceTier] = useState<InsuranceTier>('basic');
  const [satellitePurpose, setSatellitePurpose] = useState<SatelliteType | 'Random'>('Random');
  const [drvType, setDrvType] = useState<DRVType>('cooperative');

  const calculateCost = () => {
    if (launchType === 'satellite') {
      const baseCost = LAUNCH_COSTS[selectedOrbit];
      const purposeDiscount = satellitePurpose === 'Random' ? SATELLITE_PURPOSE_CONFIG.Random.discount : 0;
      const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
      return baseCost * (1 - purposeDiscount) + insuranceCost;
    } else if (launchType === 'drv') {
      const baseCost = DRV_CONFIG.costs[selectedOrbit][drvType];
      return baseCost;
    } else if (launchType === 'servicing') {
      return DRV_CONFIG.costs[selectedOrbit]['refueling'];
    } else {
      return DRV_CONFIG.costs['GEO']['geotug'];
    }
  };

  const getLaunchTypeCost = (type: 'satellite' | 'drv' | 'geotug' | 'servicing') => {
    if (type === 'satellite') {
      const baseCost = LAUNCH_COSTS[selectedOrbit];
      const purposeDiscount = satellitePurpose === 'Random' ? SATELLITE_PURPOSE_CONFIG.Random.discount : 0;
      const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
      return baseCost * (1 - purposeDiscount) + insuranceCost;
    } else if (type === 'drv') {
      const baseCost = DRV_CONFIG.costs[selectedOrbit][drvType];
      return baseCost;
    } else if (type === 'servicing') {
      return DRV_CONFIG.costs[selectedOrbit]['refueling'];
    } else {
      return DRV_CONFIG.costs['GEO']['geotug'];
    }
  };

  const totalCost = calculateCost();
  const canAfford = budget >= totalCost;

  const handleLaunch = useCallback(() => {
    if (!canAfford) return;

    const gameState = (store.getState() as RootState).game;

    dispatch(spendBudget(totalCost));

    if (launchType === 'satellite') {
      const purpose = satellitePurpose === 'Random'
        ? (['Weather', 'Comms', 'GPS'] as SatelliteType[])[Math.floor(Math.random() * 3)]
        : satellitePurpose;

      dispatch(launchSatellite({ orbit: selectedOrbit, insuranceTier, purpose, day: gameState.days }));
    } else if (launchType === 'drv') {
      dispatch(launchDRV({ orbit: selectedOrbit, drvType, day: gameState.days }));
      dispatch(trackDRVLaunch());
    } else if (launchType === 'servicing') {
      dispatch(launchDRV({ orbit: selectedOrbit, drvType: 'refueling', day: gameState.days }));
      dispatch(trackDRVLaunch());
    } else {
      dispatch(launchDRV({ orbit: 'GEO', drvType: 'geotug', day: gameState.days }));
      dispatch(trackDRVLaunch());
    }

    dispatch(advanceTurn());

    if (checkSolarStorm(gameState.solarStormProbability)) {
      const leoDebrisCountBefore = gameState.debris.filter(d => d.layer === 'LEO').length;
      dispatch(triggerSolarStorm());
      
      const updatedGameState = (store.getState() as RootState).game;
      const leoDebrisCountAfter = updatedGameState.debris.filter(d => d.layer === 'LEO').length;
      const removedCount = leoDebrisCountBefore - leoDebrisCountAfter;
      
      dispatch(addEvent({
        type: 'solar-storm',
        turn: gameState.step + 1,
        day: gameState.days,
        message: `☀️ Solar storm cleared ${removedCount} debris from LEO!`,
        details: { debrisRemoved: removedCount }
      }));
    }

    dispatch(updateMissionProgress(gameState));
    dispatch(decommissionExpiredDRVs());
  }, [canAfford, store, dispatch, totalCost, launchType, satellitePurpose, selectedOrbit, insuranceTier, drvType]);

  return (
    <>
      <div className="bg-deep-space-300 border-2 border-cyber-cyan-800 px-6 pt-1 pb-6 w-full h-[1100px] flex flex-col">
        <div className="mt-[17px]" style={{ marginBottom: 'calc(1.5rem - 27px)' }}>
          <h2 className="text-xl font-bold text-cyber-cyan-500 mb-4 pb-3 border-b-2 border-deep-space-50 uppercase tracking-wide">Launch Controls</h2>
        </div>

        <div className="space-y-2 mb-6">
        <label className="text-base font-medium text-gray-300">Launch Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(['satellite', 'drv', 'servicing', 'geotug'] as const).map(type => (
            <button
              key={type}
              onClick={() => setLaunchType(type)}
              className={`py-[7px] px-3 border-2 font-medium transition-all text-base flex flex-col items-center ${
                launchType === type
                  ? 'bg-cyber-cyan-600 text-deep-space-500 border-cyber-cyan-400'
                  : 'bg-deep-space-100 text-gray-300 border-deep-space-50 hover:bg-deep-space-50 hover:border-cyber-cyan-700'
              }`}
            >
              <span>{type === 'satellite' ? 'Satellite' : type === 'drv' ? 'Active Debris Removal' : type === 'servicing' ? <><span style={{ color: '#67e8f9' }}>⬟</span> Servicing</> : <><span style={{ color: '#a855f7' }}>⬟</span> GEO Tug</>}</span>
              <span className="text-xs opacity-75 mt-1">
                ${(getLaunchTypeCost(type) / 1e6).toFixed(1)}M
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <label className="text-base font-medium text-gray-300">Orbit Layer{launchType === 'geotug' ? ' (Fixed to GEO)' : ''}</label>
        <div className="flex gap-3">
          {(['LEO', 'MEO', 'GEO'] as OrbitLayer[]).map(orbit => (
            <button
              key={orbit}
              onClick={() => setSelectedOrbit(orbit)}
              disabled={launchType === 'geotug'}
              className={`flex-1 py-[7px] px-6 border-2 font-medium transition-all text-lg ${
                (launchType === 'geotug' ? 'GEO' : selectedOrbit) === orbit
                  ? 'bg-cyber-cyan-600 text-deep-space-500 border-cyber-cyan-400'
                  : 'bg-deep-space-100 text-gray-300 border-deep-space-50 hover:bg-deep-space-50 hover:border-cyber-cyan-700'
              } ${launchType === 'geotug' ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {orbit}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {launchType === 'satellite' ? (
          <>
            <SatellitePurposeSelector selected={satellitePurpose} onChange={setSatellitePurpose} />
            <InsuranceTierSelector selected={insuranceTier} onChange={setInsuranceTier} />
          </>
        ) : launchType === 'drv' ? (
          <>
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-300">ADR Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['cooperative', 'uncooperative'] as DRVType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setDrvType(type)}
                    className={`py-[7px] px-3 border-2 font-medium capitalize transition-all text-base ${
                      drvType === type
                        ? 'bg-cyber-cyan-600 text-white'
                        : 'bg-deep-space-100 text-gray-300 hover:bg-deep-space-50'
                    }`}
                    style={{
                      boxShadow: drvType === type
                        ? 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)'
                        : '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (drvType !== type) {
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (drvType !== type) {
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
                    }}
                    onMouseUp={(e) => {
                      if (drvType !== type) {
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
                      }
                    }}
                  >
                    <span style={{ color: type === 'cooperative' ? '#34d399' : '#fb923c' }}>⬟</span> {type}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : launchType === 'servicing' ? (
          <div className="space-y-2">
            <label className="text-base font-medium text-gray-300">Servicing Vehicle Configuration</label>
            <div className="bg-deep-space-100/50 border-2 p-4 text-gray-400 text-sm">
              Servicing vehicles extend the operational lifespan of satellites and ADRs by resetting their age to zero.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-base font-medium text-gray-300">GEO Tug Configuration</label>
            <div className="bg-deep-space-100/50 border-2 p-4 text-gray-400 text-sm">
              GEO Tugs transport end-of-life satellites to graveyard orbit, preventing them from becoming debris.
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-deep-space-50" style={{ marginTop: launchType === 'drv' ? '5px' : '0' }}>
        <div className="flex justify-between text-base mb-[2px]">
          <span className="text-gray-400">Total Cost:</span>
          <span className="font-bold text-yellow-400">${(totalCost / 1e6).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between text-base mb-3">
          <span className="text-gray-400">Budget:</span>
          <span className={`font-bold ${budget >= totalCost ? 'text-green-400' : 'text-red-400'}`}>
            ${(budget / 1e6).toFixed(1)}M
          </span>
        </div>
        <BudgetGauge budget={budget} maxBudget={BUDGET_DIFFICULTY_CONFIG[budgetDifficulty].startingBudget} />
        <button
          onClick={handleLaunch}
          disabled={!canAfford}
          className={`w-full py-[11px] px-6 border-2 font-bold uppercase tracking-wide transition-all mt-[30px] text-lg ${
            canAfford
              ? 'bg-electric-green-600 hover:bg-electric-green-500 border-electric-green-400 text-deep-space-500'
              : 'bg-deep-space-100 text-slate-500 border-deep-space-50 cursor-not-allowed'
          }`}
          style={{
            boxShadow: canAfford
              ? '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (canAfford) {
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (canAfford) {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
            }
          }}
          onMouseDown={(e) => {
            if (canAfford) {
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
            }
          }}
          onMouseUp={(e) => {
            if (canAfford) {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
            }
          }}
        >
          {canAfford ? (launchType === 'satellite' ? 'Launch Satellite' : launchType === 'drv' ? 'Launch ADR' : launchType === 'servicing' ? 'Launch Servicing Vehicle' : 'Launch GEO Tug') : 'Insufficient Budget'}
        </button>
      </div>
    </div>
    <div className="text-sm text-gray-500 mt-2">Version: v{__APP_VERSION__}</div>
    </>
  );
}
