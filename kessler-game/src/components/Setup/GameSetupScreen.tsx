import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initializeGame } from '../../store/slices/gameSlice';
import type { BudgetDifficulty } from '../../game/types';
import { BudgetDifficultySettings } from './BudgetDifficultySettings';

interface GameSetupScreenProps {
  onStart: () => void;
}

export function GameSetupScreen({ onStart }: GameSetupScreenProps) {
  const [difficulty, setDifficulty] = useState<BudgetDifficulty>('normal');
  const dispatch = useAppDispatch();

  const handleStart = () => {
    dispatch(initializeGame(difficulty));
    onStart();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Kessler Simulation
        </h1>
        <p className="text-center text-gray-400 mb-8">Space Debris Management Game</p>

        <BudgetDifficultySettings selected={difficulty} onChange={setDifficulty} />

        <button
          onClick={handleStart}
          className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold text-lg uppercase tracking-wide transition-all shadow-lg hover:shadow-xl"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
