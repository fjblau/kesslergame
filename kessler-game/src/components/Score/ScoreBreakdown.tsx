import type { ScoreState } from '../../game/types';
import { SCORE_CONFIG } from '../../game/scoring';

interface ScoreBreakdownProps {
  scoreState: ScoreState;
  onClose: () => void;
}

interface ScoreCategoryProps {
  label: string;
  score: number;
  description: string;
  icon: string;
  color: string;
}

function ScoreCategory({ label, score, description, icon, color }: ScoreCategoryProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-deep-space-300 border-none hover:bg-slate-750 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className={`font-semibold ${color}`}>{label}</div>
          <div className="text-xs text-gray-400 mt-1">{description}</div>
        </div>
      </div>
      <div className={`text-xl font-bold ${color}`}>
        +{score.toLocaleString()}
      </div>
    </div>
  );
}

export function ScoreBreakdown({ scoreState, onClose }: ScoreBreakdownProps) {
  const categories: ScoreCategoryProps[] = [
    {
      label: 'Satellites',
      score: scoreState.satelliteLaunchScore,
      description: `${SCORE_CONFIG.SATELLITE_LAUNCH.BASE} points per satellite + layer bonuses`,
      icon: '🛰️',
      color: 'text-cyber-cyan-500',
    },
    {
      label: 'Debris Removal',
      score: scoreState.debrisRemovalScore,
      description: `${SCORE_CONFIG.DEBRIS_REMOVAL.COOPERATIVE} pts cooperative, ${SCORE_CONFIG.DEBRIS_REMOVAL.UNCOOPERATIVE} pts uncooperative`,
      icon: '🧹',
      color: 'text-green-400',
    },
    {
      label: 'Satellites Recovered',
      score: scoreState.satelliteRecoveryScore,
      description: `${SCORE_CONFIG.SATELLITE_RECOVERY} points per recovered satellite (${scoreState.satellitesRecovered} total)`,
      icon: '♻️',
      color: 'text-cyan-400',
    },
    {
      label: 'Budget Management',
      score: scoreState.budgetManagementScore,
      description: `${SCORE_CONFIG.BUDGET_MULTIPLIER} points per $1M remaining`,
      icon: '💰',
      color: 'text-yellow-400',
    },
    {
      label: 'Survival',
      score: scoreState.survivalScore,
      description: `${SCORE_CONFIG.SURVIVAL.BASE} points per day with late-game multipliers`,
      icon: '⏱️',
      color: 'text-electric-green-500',
    },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="max-w-2xl w-full bg-slate-900 border-2 border-deep-space-50 border-none p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Score Breakdown</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold px-3 py-1 hover:bg-deep-space-300 rounded transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {categories.map((category) => (
            <ScoreCategory key={category.label} {...category} />
          ))}
        </div>

        <div className="border-t-2 border-deep-space-50 pt-4 mt-4">
          <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-none">
            <span className="text-xl font-bold text-white">Total Score</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {scoreState.totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyber-cyan-600 hover:bg-cyber-cyan-500 text-white font-semibold border-none transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
