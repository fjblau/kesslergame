import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setGameSpeed } from '../../store/slices/uiSlice';
import { resetGame, setCollisionAngleThreshold, setCollisionRadiusMultiplier } from '../../store/slices/gameSlice';
import { initializeMissions } from '../../store/slices/missionsSlice';
import { clearEvents } from '../../store/slices/eventSlice';
import type { GameSpeed } from '../../game/types';

export function GameSpeedControl() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const angleThreshold = useAppSelector(state => state.game.collisionAngleThreshold);
  const radiusMultiplier = useAppSelector(state => state.game.collisionRadiusMultiplier);
  const dispatch = useAppDispatch();

  const speeds: { value: GameSpeed; label: string; icon: string }[] = [
    { value: 'paused', label: 'Pause', icon: '⏸' },
    { value: 'normal', label: 'Normal', icon: '▶' },
    { value: 'fast', label: 'Fast (2s)', icon: '⏩' },
  ];

  const handleReset = () => {
    dispatch(setGameSpeed('paused'));
    dispatch(resetGame());
    dispatch(initializeMissions(3));
    dispatch(clearEvents());
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-xl font-medium transition-colors bg-red-600 text-white hover:bg-red-500"
        >
          <span className="mr-2">🔄</span>
          Reset
        </button>
        {speeds.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => dispatch(setGameSpeed(value))}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              speed === value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300 w-32">Angle: {angleThreshold}°</label>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={angleThreshold}
            onChange={(e) => dispatch(setCollisionAngleThreshold(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300 w-32">Radius: {radiusMultiplier.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={radiusMultiplier}
            onChange={(e) => dispatch(setCollisionRadiusMultiplier(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
