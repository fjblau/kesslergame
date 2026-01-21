import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleAutoPause } from '../../store/slices/uiSlice';

export function AutoPauseSettings() {
  const autoPauseOnCollision = useAppSelector(state => state.ui.autoPauseOnCollision);
  const autoPauseOnRiskChange = useAppSelector(state => state.ui.autoPauseOnRiskChange);
  const autoPauseOnBudgetLow = useAppSelector(state => state.ui.autoPauseOnBudgetLow);
  const autoPauseOnMission = useAppSelector(state => state.ui.autoPauseOnMission);
  const autoPauseOnCascade = useAppSelector(state => state.ui.autoPauseOnCascade);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Auto-Pause Settings</h2>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnCascade}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnCascade'))}
            className="w-4 h-4 rounded bg-deep-space-100 border-deep-space-50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Cascade</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when collision cascade detected (3+ simultaneous collisions). Severe cascades (12+) always end the game.</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnCollision}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnCollision'))}
            className="w-4 h-4 rounded bg-deep-space-100 border-deep-space-50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Collision</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when any collision detected (allows DRV launch for mitigation)</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnRiskChange}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnRiskChange'))}
            className="w-4 h-4 rounded bg-deep-space-100 border-deep-space-50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Risk Change</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when risk level changes</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnBudgetLow}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnBudgetLow'))}
            className="w-4 h-4 rounded bg-deep-space-100 border-deep-space-50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Low Budget</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when budget falls below $20M. Note: You can disable this setting or unpause to continue playing.</p>

        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPauseOnMission}
            onChange={() => dispatch(toggleAutoPause('autoPauseOnMission'))}
            className="w-4 h-4 rounded bg-deep-space-100 border-deep-space-50 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span>Auto-Pause on Mission</span>
        </label>
        <p className="text-xs text-gray-400 ml-6">Pause when mission status changes</p>
      </div>
    </div>
  );
}
