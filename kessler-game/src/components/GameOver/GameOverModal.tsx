import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { initializeGame } from '../../store/slices/gameSlice';
import { initializeMissions } from '../../store/slices/missionsSlice';
import { MAX_DEBRIS_LIMIT } from '../../game/constants';

export function GameOverModal() {
  const dispatch = useAppDispatch();
  const { budget, step, maxSteps, debris, satellites, debrisRemovalVehicles, budgetDifficulty } = useAppSelector(state => state.game);
  const [isVisible, setIsVisible] = useState(true);

  const getGameOverReason = () => {
    if (budget < 0) {
      return 'Budget Depleted! You ran out of funds.';
    }
    if (step >= maxSteps) {
      return "Time's Up! You reached the maximum turn limit.";
    }
    if (debris.length > MAX_DEBRIS_LIMIT) {
      return 'Debris Cascade! Too much space debris accumulated.';
    }
    return 'Game Over';
  };

  const totalDebrisRemoved = debrisRemovalVehicles.reduce(
    (sum, drv) => sum + drv.debrisRemoved,
    0
  );

  const handlePlayAgain = () => {
    dispatch(initializeGame(budgetDifficulty));
    dispatch(initializeMissions(3));
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50">
      <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-2xl">
        <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Game Over
        </h1>
        
        <p className="text-center text-xl text-gray-300 mb-8">
          {getGameOverReason()}
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Final Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Turns Survived</p>
              <p className="text-2xl font-bold text-white">{step} / {maxSteps}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Final Budget</p>
              <p className={`text-2xl font-bold ${budget < 0 ? 'text-red-400' : 'text-green-400'}`}>
                ${budget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Debris</p>
              <p className={`text-2xl font-bold ${debris.length > MAX_DEBRIS_LIMIT ? 'text-red-400' : 'text-yellow-400'}`}>
                {debris.length} pieces
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Satellites Launched</p>
              <p className="text-2xl font-bold text-blue-400">{satellites.length}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-sm">Debris Removed</p>
              <p className="text-2xl font-bold text-purple-400">{totalDebrisRemoved} pieces</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 py-4 px-8 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-xl uppercase tracking-wide transition-all shadow-lg hover:shadow-xl"
          >
            View Analytics
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-xl uppercase tracking-wide transition-all shadow-lg hover:shadow-xl"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
