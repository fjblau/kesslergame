import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setDRVDecommissionTime } from '../../store/slices/gameSlice';

export function GeneralSettings() {
  const drvDecommissionTime = useAppSelector(state => state.game.drvDecommissionTime);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">
            DRV Decommission Time: {drvDecommissionTime} turns
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="1"
            value={drvDecommissionTime}
            onChange={(e) => dispatch(setDRVDecommissionTime(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
