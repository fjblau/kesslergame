import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleAutoPause } from '../../store/slices/uiSlice';

export function AutoPauseSettings() {
  const autoPauseOnCollision = useAppSelector(state => state.ui.autoPauseOnCollision);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const autoPauseOnBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnMission = useAppSelector(state => state.ui.autoPauseOnMission);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Auto-Pause Settings</h2>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnCollision}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnCollision'))}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Collision</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when collision detected (allows DRV launch for mitigation)</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnRiskChange}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnRiskChange'))}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Risk Change</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when risk level changes</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnBudgetLow}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnBudgetLow'))}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Low Budget</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when budget falls below $20M</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnMission}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnMission'))}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Mission</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when mission status changes</p>
      </div>
    </div>
  );
}
