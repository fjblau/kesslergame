import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setGameSpeed } from '../../store/slices/uiSlice';
import type { GameSpeed } from '../../game/types';

export function GameSpeedControl() {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const dispatch = useAppDispatch();

  const speeds: { value: GameSpeed; label: string; icon: string }[] = [
    { value: 'paused', label: 'Pause', icon: '⏸' },
    { value: 'normal', label: 'Normal', icon: '▶' },
    { value: 'fast', label: 'Fast (2s)', icon: '⏩' },
  ];

  return (
    <div className="flex gap-2 bg-slate-800 border border-slate-700 rounded-lg p-2">
      {speeds.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => dispatch(setGameSpeed(value))}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            speed === value
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
