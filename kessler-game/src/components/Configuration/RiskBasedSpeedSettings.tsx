import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  setRiskSpeedMultiplierLOW,
  setRiskSpeedMultiplierMEDIUM,
  setRiskSpeedMultiplierCRITICAL
} from '../../store/slices/gameSlice';

export function RiskBasedSpeedSettings() {
  const multipliers = useAppSelector(state => state.game.riskSpeedMultipliers);
  const dispatch = useAppDispatch();

  const calculateInterval = (baseInterval: number, multiplier: number) => {
    return (baseInterval * multiplier) / 1000;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Risk-Based Game Speed</h2>
      <p className="text-sm text-gray-400 mb-4">
        Control how fast the game progresses at different risk levels. Higher multipliers = slower game speed = more time to react.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            LOW Risk: {multipliers.LOW.toFixed(2)}x 
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.LOW).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.LOW).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="1.0"
            step="0.1"
            value={multipliers.LOW}
            onChange={(e) => dispatch(setRiskSpeedMultiplierLOW(Number(e.target.value)))}
            className="flex-1"
            disabled
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            MEDIUM Risk: {multipliers.MEDIUM.toFixed(2)}x
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.MEDIUM).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.MEDIUM).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={multipliers.MEDIUM}
            onChange={(e) => dispatch(setRiskSpeedMultiplierMEDIUM(Number(e.target.value)))}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-60">
            CRITICAL Risk: {multipliers.CRITICAL.toFixed(2)}x
            <span className="text-gray-500 ml-2">
              (Normal: {calculateInterval(4000, multipliers.CRITICAL).toFixed(1)}s, Fast: {calculateInterval(2000, multipliers.CRITICAL).toFixed(1)}s)
            </span>
          </label>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={multipliers.CRITICAL}
            onChange={(e) => dispatch(setRiskSpeedMultiplierCRITICAL(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
