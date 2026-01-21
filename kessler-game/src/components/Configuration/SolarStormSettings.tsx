import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSolarStormProbability } from '../../store/slices/gameSlice';

export function SolarStormSettings() {
  const solarStormProbability = useAppSelector(state => state.game.solarStormProbability);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Solar Storm Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">
            Probability: {(solarStormProbability * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={solarStormProbability}
            onChange={(e) => dispatch(setSolarStormProbability(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
