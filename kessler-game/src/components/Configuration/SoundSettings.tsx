import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSoundEnabled } from '../../store/slices/gameSlice';

export function SoundSettings() {
  const soundEnabled = useAppSelector(state => state.game.soundEnabled);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Sound Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">Sound Effects:</label>
          <button
            onClick={() => dispatch(setSoundEnabled(!soundEnabled))}
            className={`px-4 py-2 border-none font-medium transition-colors ${
              soundEnabled
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
