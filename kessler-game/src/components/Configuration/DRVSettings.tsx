import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setDRVUncooperativeCapacityMin, setDRVUncooperativeCapacityMax, setDRVUncooperativeSuccessRate } from '../../store/slices/gameSlice';

export function DRVSettings() {
  const capacityMin = useAppSelector(state => state.game.drvUncooperativeCapacityMin);
  const capacityMax = useAppSelector(state => state.game.drvUncooperativeCapacityMax);
  const successRate = useAppSelector(state => state.game.drvUncooperativeSuccessRate);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Uncooperative DRV Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">
            Capacity Min: {capacityMin}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={capacityMin}
            onChange={(e) => dispatch(setDRVUncooperativeCapacityMin(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">
            Capacity Max: {capacityMax}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={capacityMax}
            onChange={(e) => dispatch(setDRVUncooperativeCapacityMax(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">
            Success Rate: {(successRate * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={successRate}
            onChange={(e) => dispatch(setDRVUncooperativeSuccessRate(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
