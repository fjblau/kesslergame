import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setGameSpeed } from '../../store/slices/uiSlice';
import { resetGame } from '../../store/slices/gameSlice';
import { initializeMissions } from '../../store/slices/missionsSlice';
import { clearEvents } from '../../store/slices/eventSlice';
import { resetScore } from '../../store/slices/scoreSlice';
import type { GameSpeed } from '../../game/types';

interface GameSpeedControlProps {
  onNewGame: () => void;
}

export function GameSpeedControl({ onNewGame }: GameSpeedControlProps) {
  const speed = useAppSelector(state => state.ui.gameSpeed);
  const dispatch = useAppDispatch();

  const speeds: { value: GameSpeed; label: string; icon: string }[] = [
    { value: 'paused', label: 'Pause', icon: '⏸' },
    { value: 'normal', label: 'Play', icon: '▶' },
    { value: 'fast', label: 'Fast (2s)', icon: '⏩' },
  ];

  const handleReset = () => {
    dispatch(setGameSpeed('paused'));
    dispatch(resetGame());
    dispatch(resetScore());
    dispatch(initializeMissions(3));
    dispatch(clearEvents());
  };

  return (
    <div className="flex gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3">
      <button
        onClick={onNewGame}
        className="flex-1 py-2 rounded-xl font-medium transition-colors bg-slate-700 text-white hover:bg-slate-600"
        title="Return to start screen"
      >
        <span className="mr-2">🏠</span>
        New Game
      </button>
      <button
        onClick={handleReset}
        className="flex-1 py-2 rounded-xl font-medium transition-colors bg-red-600 text-white hover:bg-red-500"
      >
        <span className="mr-2">🔄</span>
        Reset
      </button>
      {speeds.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => dispatch(setGameSpeed(value))}
          className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
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
  );
}
