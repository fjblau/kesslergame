import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setOrbitalSpeedLEO, setOrbitalSpeedMEO, setOrbitalSpeedGEO } from '../../store/slices/gameSlice';

export function OrbitalSpeedSettings() {
  const orbitalSpeedLEO = useAppSelector(state => state.game.orbitalSpeedLEO);
  const orbitalSpeedMEO = useAppSelector(state => state.game.orbitalSpeedMEO);
  const orbitalSpeedGEO = useAppSelector(state => state.game.orbitalSpeedGEO);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Orbital Speed Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">LEO Speed: {orbitalSpeedLEO.toFixed(1)}</label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.1"
            value={orbitalSpeedLEO}
            onChange={(e) => dispatch(setOrbitalSpeedLEO(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">MEO Speed: {orbitalSpeedMEO.toFixed(1)}</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={orbitalSpeedMEO}
            onChange={(e) => dispatch(setOrbitalSpeedMEO(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">GEO Speed: {orbitalSpeedGEO.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.1"
            value={orbitalSpeedGEO}
            onChange={(e) => dispatch(setOrbitalSpeedGEO(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
