import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initializeGame } from '../../store/slices/gameSlice';
import { initializeMissions } from '../../store/slices/missionsSlice';
import type { BudgetDifficulty } from '../../game/types';
import { BudgetDifficultySettings } from './BudgetDifficultySettings';
import { TutorialModal } from '../Tutorial/TutorialModal';
import { logPlay } from '../../utils/plays';

interface GameSetupScreenProps {
  onStart: () => void;
}

export function GameSetupScreen({ onStart }: GameSetupScreenProps) {
  const [difficulty, setDifficulty] = useState<BudgetDifficulty>('normal');
  const [playerName, setPlayerName] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const dispatch = useAppDispatch();

  const isNameValid = playerName.trim().length > 0 && playerName.trim().length <= 50;

  const handleStart = () => {
    const trimmedName = playerName.trim();
    dispatch(initializeGame({ difficulty, playerName: trimmedName }));
    dispatch(initializeMissions(3));
    logPlay(trimmedName);
    onStart();
  };

  const handleOpenTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const handleNextStep = () => {
    setTutorialStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setTutorialStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pl-16">
      <div className="max-w-3xl w-full bg-deep-space-300 border-2 border-cyber-cyan-800 p-10 shadow-cyber-lg">
        <h1 className="text-6xl font-bold text-center mb-3 text-cyber-cyan-500" style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}>
          Space Debris Removal
        </h1>
        <p className="text-center text-gray-400 mb-10 text-lg">Space Debris Management Game</p>

        <div className="mb-8">
          <label htmlFor="playerName" className="block text-lg font-semibold text-gray-200 mb-3">
            Player Name
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            autoFocus
            className="w-full px-4 py-3 bg-deep-space-100 border-2 border-deep-space-50 text-white placeholder-gray-400 focus:outline-none focus:border-cyber-cyan-500"
          />
          {playerName.length > 0 && !isNameValid && (
            <p className="mt-2 text-sm text-red-400">Name must be between 1 and 50 characters</p>
          )}
        </div>

        <BudgetDifficultySettings selected={difficulty} onChange={setDifficulty} />

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleOpenTutorial}
            className="flex-1 py-4 px-8 bg-deep-space-100 border-2 border-deep-space-50 hover:bg-deep-space-50 hover:border-electric-green-700 text-white font-bold text-xl uppercase tracking-wide transition-all shadow-depth hover:shadow-green"
          >
            How to Play
          </button>
          <button
            onClick={handleStart}
            disabled={!isNameValid}
            className="flex-1 py-4 px-8 bg-cyber-cyan-600 border-2 border-cyber-cyan-400 hover:bg-cyber-cyan-500 text-deep-space-500 font-bold text-xl uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyber-cyan-600 shadow-cyber"
          >
            Start Game
          </button>
        </div>
      </div>

      {showTutorial && (
        <TutorialModal
          currentStep={tutorialStep}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          onClose={handleCloseTutorial}
        />
      )}
    </div>
  );
}
