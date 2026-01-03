import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { initializeGame } from '../../store/slices/gameSlice';
import { initializeMissions } from '../../store/slices/missionsSlice';
import { MAX_DEBRIS_LIMIT } from '../../game/constants';
import { SCORE_GRADES } from '../../game/scoring';
import { selectScore } from '../../store/slices/scoreSlice';
import { generateCertificate } from '../../utils/certificate';
import { saveHighScore } from '../../utils/highScores';

interface GameOverModalProps {
  onViewAnalytics?: () => void;
}

export function GameOverModal({ onViewAnalytics }: GameOverModalProps) {
  const dispatch = useAppDispatch();
  const { budget, step, maxSteps, debris, satellites, debrisRemovalVehicles, budgetDifficulty, playerName } = useAppSelector(state => state.game);
  const scoreState = useAppSelector(selectScore);
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

  const getScoreGrade = (score: number): { grade: string; color: string } => {
    if (score >= SCORE_GRADES.S) return { grade: 'S', color: 'from-yellow-400 to-orange-400' };
    if (score >= SCORE_GRADES.A) return { grade: 'A', color: 'from-green-400 to-teal-400' };
    if (score >= SCORE_GRADES.B) return { grade: 'B', color: 'from-blue-400 to-cyan-400' };
    if (score >= SCORE_GRADES.C) return { grade: 'C', color: 'from-purple-400 to-pink-400' };
    return { grade: 'D', color: 'from-gray-400 to-slate-400' };
  };

  const { grade, color } = getScoreGrade(scoreState.totalScore);

  const totalDebrisRemoved = debrisRemovalVehicles.reduce(
    (sum, drv) => sum + drv.debrisRemoved,
    0
  );

  useEffect(() => {
    saveHighScore({
      playerName,
      score: scoreState.totalScore,
      grade,
      date: new Date().toISOString(),
      difficulty: budgetDifficulty,
      turnsSurvived: step,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAgain = () => {
    dispatch(initializeGame({ difficulty: budgetDifficulty, playerName }));
    dispatch(initializeMissions(3));
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    onViewAnalytics?.();
  };

  const handleDownloadCertificate = async () => {
    await generateCertificate({
      playerName,
      finalScore: scoreState.totalScore,
      grade,
      turnsSurvived: step,
      maxTurns: maxSteps,
      finalBudget: budget,
      satellitesLaunched: satellites.length,
      debrisRemoved: totalDebrisRemoved,
      totalDebris: debris.length,
      difficulty: budgetDifficulty,
      satelliteLaunchScore: scoreState.satelliteLaunchScore,
      debrisRemovalScore: scoreState.debrisRemovalScore,
      satelliteRecoveryScore: scoreState.satelliteRecoveryScore,
      budgetManagementScore: scoreState.budgetManagementScore,
      survivalScore: scoreState.survivalScore,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-2xl my-8">
        <h1 className="text-5xl font-bold text-center mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Game Over
        </h1>
        
        <p className="text-center text-xl text-gray-300 mb-8">
          {getGameOverReason()}
        </p>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Final Score</h2>
              <p className="text-gray-300 text-sm">Grade: <span className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{grade}</span></p>
            </div>
            <div className="text-right">
              <p className={`text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {scoreState.totalScore.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">points</p>
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                <span>🛰️</span> Satellites
              </span>
              <span className="text-blue-400 font-semibold">+{scoreState.satelliteLaunchScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                <span>🧹</span> Debris Removal
              </span>
              <span className="text-green-400 font-semibold">+{scoreState.debrisRemovalScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                <span>♻️</span> Satellites Recovered ({scoreState.satellitesRecovered})
              </span>
              <span className="text-cyan-400 font-semibold">+{scoreState.satelliteRecoveryScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                <span>💰</span> Budget Management
              </span>
              <span className="text-yellow-400 font-semibold">+{scoreState.budgetManagementScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm flex items-center gap-2">
                <span>⏱️</span> Survival
              </span>
              <span className="text-purple-400 font-semibold">+{scoreState.survivalScore.toLocaleString()}</span>
            </div>
          </div>
        </div>

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

        <div className="mb-4">
          <button
            onClick={handleDownloadCertificate}
            className="w-full py-4 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xl uppercase tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>📄</span>
            Download Mission Certificate
          </button>
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
