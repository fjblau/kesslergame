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

  const [launchType, setLaunchType] = useState<'satellite' | 'drv' | 'geotug' | 'refueling'>('satellite');
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
    } else if (launchType === 'refueling') {
      return DRV_CONFIG.costs[selectedOrbit]['refueling'];
    } else {
      return DRV_CONFIG.costs['GEO']['geotug'];
    }
  };

  const getLaunchTypeCost = (type: 'satellite' | 'drv' | 'geotug' | 'refueling') => {
    if (type === 'satellite') {
      const baseCost = LAUNCH_COSTS[selectedOrbit];
      const purposeDiscount = satellitePurpose === 'Random' ? SATELLITE_PURPOSE_CONFIG.Random.discount : 0;
      const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
      return baseCost * (1 - purposeDiscount) + insuranceCost;
    } else if (type === 'drv') {
      const baseCost = DRV_CONFIG.costs[selectedOrbit][drvType];
      return baseCost;
    } else if (type === 'refueling') {
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
    } else if (launchType === 'refueling') {
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
      <div className="bg-slate-800 border-2 border-slate-600 rounded-xl px-6 pt-1 pb-6 w-full h-[1100px] flex flex-col">
        <div className="mt-[17px]" style={{ marginBottom: 'calc(1.5rem - 27px)' }}>
          <h2 className="text-xl font-bold text-blue-300 mb-4 pb-3 border-b-2 border-slate-700 uppercase tracking-wide">Launch Controls</h2>
        </div>

        <div className="space-y-2 mb-6">
        <label className="text-base font-medium text-gray-300">Launch Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(['satellite', 'drv', 'refueling', 'geotug'] as const).map(type => (
            <button
              key={type}
              onClick={() => setLaunchType(type)}
              className={`py-[7px] px-3 rounded-xl font-medium transition-colors text-base flex flex-col items-center ${
                launchType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <span>{type === 'satellite' ? 'Satellite' : type === 'drv' ? 'DRV' : type === 'refueling' ? 'Refueling' : 'GEO Tug'}</span>
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
              className={`flex-1 py-[7px] px-6 rounded-xl font-medium transition-colors text-lg ${
                (launchType === 'geotug' ? 'GEO' : selectedOrbit) === orbit
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
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
              <label className="text-base font-medium text-gray-300">DRV Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['cooperative', 'uncooperative'] as DRVType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setDrvType(type)}
                    className={`py-[7px] px-3 rounded-xl font-medium capitalize transition-colors text-base ${
                      drvType === type
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : launchType === 'refueling' ? (
          <div className="space-y-2">
            <label className="text-base font-medium text-gray-300">Refueling Vehicle Configuration</label>
            <div className="bg-slate-700/50 rounded-xl p-4 text-gray-400 text-sm">
              Refueling vehicles extend the operational lifespan of satellites and DRVs by resetting their age to zero.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-base font-medium text-gray-300">GEO Tug Configuration</label>
            <div className="bg-slate-700/50 rounded-xl p-4 text-gray-400 text-sm">
              GEO Tugs transport end-of-life satellites to graveyard orbit, preventing them from becoming debris.
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-700" style={{ marginTop: launchType === 'drv' ? '5px' : '0' }}>
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
          className={`w-full py-[11px] px-6 rounded-xl font-bold uppercase tracking-wide transition-all mt-[30px] text-lg ${
            canAfford
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canAfford ? (launchType === 'satellite' ? 'Launch Satellite' : launchType === 'drv' ? 'Launch DRV' : launchType === 'refueling' ? 'Launch Refueling Vehicle' : 'Launch GEO Tug') : 'Insufficient Budget'}
        </button>
      </div>
    </div>
    <div className="text-sm text-gray-500 mt-2">Version: v{__APP_VERSION__}</div>
    </>
  );
}
