import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { launchSatellite, launchDRV, spendBudget, advanceTurn, decommissionExpiredDRVs, triggerSolarStorm } from '../../store/slices/gameSlice';
import { updateMissionProgress, trackDRVLaunch } from '../../store/slices/missionsSlice';
import { addEvent } from '../../store/slices/eventSlice';
import type { OrbitLayer, SatelliteType, InsuranceTier, DRVType, DRVTargetPriority } from '../../game/types';
import { LAUNCH_COSTS, INSURANCE_CONFIG, DRV_CONFIG, DRV_PRIORITY_CONFIG, SATELLITE_PURPOSE_CONFIG } from '../../game/constants';
import { checkSolarStorm } from '../../game/engine/events';
import { InsuranceTierSelector } from './InsuranceTierSelector';
import { SatellitePurposeSelector } from '../SatelliteConfig/SatellitePurposeSelector';
import { DRVTargetPriority as DRVTargetPrioritySelector } from '../DRVPanel/DRVTargetPriority';

export function ControlPanel() {
  const dispatch = useAppDispatch();
  const budget = useAppSelector(state => state.game.budget);
  const step = useAppSelector(state => state.game.step);
  const gameState = useAppSelector(state => state.game);

  const [launchType, setLaunchType] = useState<'satellite' | 'drv'>('satellite');
  const [selectedOrbit, setSelectedOrbit] = useState<OrbitLayer>('LEO');
  const [insuranceTier, setInsuranceTier] = useState<InsuranceTier>('basic');
  const [satellitePurpose, setSatellitePurpose] = useState<SatelliteType | 'Random'>('Random');
  const [drvType, setDrvType] = useState<DRVType>('cooperative');
  const [drvPriority, setDrvPriority] = useState<DRVTargetPriority>('auto');

  const calculateCost = () => {
    if (launchType === 'satellite') {
      const baseCost = LAUNCH_COSTS[selectedOrbit];
      const purposeDiscount = satellitePurpose === 'Random' ? SATELLITE_PURPOSE_CONFIG.Random.discount : 0;
      const insuranceCost = INSURANCE_CONFIG[insuranceTier].cost;
      return baseCost * (1 - purposeDiscount) + insuranceCost;
    } else {
      const baseCost = DRV_CONFIG.costs[selectedOrbit][drvType];
      const priorityModifier = DRV_PRIORITY_CONFIG[drvPriority].costModifier;
      return baseCost * priorityModifier;
    }
  };

  const totalCost = calculateCost();
  const canAfford = budget >= totalCost;

  const handleLaunch = () => {
    if (!canAfford) return;

    dispatch(spendBudget(totalCost));

    if (launchType === 'satellite') {
      const purpose = satellitePurpose === 'Random'
        ? (['Weather', 'Comms', 'GPS'] as SatelliteType[])[Math.floor(Math.random() * 3)]
        : satellitePurpose;

      dispatch(launchSatellite({ orbit: selectedOrbit, insuranceTier, purpose }));
    } else {
      dispatch(launchDRV({ orbit: selectedOrbit, drvType, targetPriority: drvPriority }));
      dispatch(trackDRVLaunch());
    }

    dispatch(advanceTurn());

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
  };

  return (
    <div className="border-2 border-slate-600 rounded-xl p-6 space-y-6 w-full max-w-md">
      <div>
        <h2 className="text-xl font-bold text-blue-300 mb-4">Launch Controls</h2>
        <div className="text-sm text-gray-400">Turn: {step}</div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Launch Type</label>
        <div className="flex gap-3">
          {(['satellite', 'drv'] as const).map(type => (
            <button
              key={type}
              onClick={() => setLaunchType(type)}
              className={`flex-1 py-2 px-6 rounded-xl font-medium transition-colors ${
                launchType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {type === 'satellite' ? 'Satellite' : 'DRV'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Orbit Layer</label>
        <div className="flex gap-3">
          {(['LEO', 'MEO', 'GEO'] as OrbitLayer[]).map(orbit => (
            <button
              key={orbit}
              onClick={() => setSelectedOrbit(orbit)}
              className={`flex-1 py-2 px-6 rounded-xl font-medium transition-colors ${
                selectedOrbit === orbit
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {orbit}
            </button>
          ))}
        </div>
      </div>

      {launchType === 'satellite' ? (
        <>
          <SatellitePurposeSelector selected={satellitePurpose} onChange={setSatellitePurpose} />
          <InsuranceTierSelector selected={insuranceTier} onChange={setInsuranceTier} />
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">DRV Type</label>
            <div className="flex gap-3">
              {(['cooperative', 'uncooperative'] as DRVType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDrvType(type)}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium capitalize transition-colors ${
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
          <DRVTargetPrioritySelector selected={drvPriority} onChange={setDrvPriority} />
        </>
      )}

      <div className="pt-4 border-t border-slate-700 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Cost:</span>
          <span className="font-bold text-yellow-400">${(totalCost / 1e6).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Budget:</span>
          <span className={`font-bold ${budget >= totalCost ? 'text-green-400' : 'text-red-400'}`}>
            ${(budget / 1e6).toFixed(1)}M
          </span>
        </div>
        <button
          onClick={handleLaunch}
          disabled={!canAfford}
          className={`w-full py-3 px-6 rounded-xl font-bold uppercase tracking-wide transition-all ${
            canAfford
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canAfford ? 'Launch' : 'Insufficient Budget'}
        </button>
      </div>
    </div>
  );
}
