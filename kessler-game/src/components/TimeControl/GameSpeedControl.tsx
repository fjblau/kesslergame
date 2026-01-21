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
    <div className="flex gap-3 bg-deep-space-300 border-2 border-deep-space-50 p-3 shadow-depth">
      <button
        onClick={onNewGame}
        className="flex-1 py-2 border-none font-medium transition-all bg-deep-space-100 text-white hover:bg-deep-space-50"
        title="Return to start screen"
        style={{
          boxShadow: '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.95), 0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)'}
        onMouseDown={(e) => e.currentTarget.style.boxShadow = 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 2px 6px rgba(0,0,0,0.6)'}
        onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)'}
      >
        <span className="mr-2">🏠</span>
        New Game
      </button>
      <button
        onClick={handleReset}
        className="flex-1 py-2 border-none font-medium transition-all bg-red-500 text-white hover:bg-red-400"
        style={{
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.5), 0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 40px rgba(239, 68, 68, 0.6), 0 10px 20px rgba(0,0,0,0.95), 0 6px 12px rgba(0,0,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.5), 0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'}
        onMouseDown={(e) => e.currentTarget.style.boxShadow = 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 2px 6px rgba(0,0,0,0.6)'}
        onMouseUp={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.5), 0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'}
      >
        <span className="mr-2">🔄</span>
        Reset
      </button>
      {speeds.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => dispatch(setGameSpeed(value))}
          className={`flex-1 py-2 border-2 font-medium transition-all ${
            speed === value
              ? 'bg-cyber-cyan-600 text-deep-space-500 border-cyber-cyan-400'
              : 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-cyber-cyan-900 hover:text-white hover:border-cyber-cyan-600'
          }`}
          style={{
            boxShadow: speed === value
              ? '0 0 30px rgba(0, 217, 255, 0.5), inset 0 4px 12px rgba(0,0,0,0.8), inset 0 2px 6px rgba(0,0,0,0.6)'
              : '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)'
          }}
          onMouseEnter={(e) => {
            if (speed !== value) {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.95), 0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (speed !== value) {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)';
            }
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 2px 6px rgba(0,0,0,0.6)';
          }}
          onMouseUp={(e) => {
            if (speed !== value) {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.9), 0 4px 8px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)';
            }
          }}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
