import { useState, useEffect } from 'react';
import { getHighScores, clearHighScores, type HighScore } from '../../utils/highScores';

export function HighScoresPanel() {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadScores = async () => {
      const scores = await getHighScores();
      if (mounted) {
        setHighScores(scores);
        setLoading(false);
      }
    };
    loadScores();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClearScores = async () => {
    if (window.confirm('Are you sure you want to clear all high scores? This cannot be undone.')) {
      await clearHighScores();
      const scores = await getHighScores();
      setHighScores(scores);
    }
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'S': return 'from-yellow-400 to-orange-400';
      case 'A': return 'from-green-400 to-teal-400';
      case 'B': return 'from-blue-400 to-cyan-400';
      case 'C': return 'from-purple-400 to-pink-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'normal': return 'text-blue-400';
      case 'hard': return 'text-orange-400';
      case 'challenge': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRankMedal = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold text-blue-400 mb-2">High Scores</h2>
          <p className="text-gray-400">Top 10 scores from all completed games</p>
        </div>
        {highScores.length > 0 && (
          <button
            onClick={handleClearScores}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all"
          >
            Clear All Scores
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Loading High Scores...</h3>
        </div>
      ) : highScores.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No High Scores Yet</h3>
          <p className="text-gray-400">Complete a game to see your score here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {highScores.map((score, index) => (
            <div
              key={index}
              className={`bg-slate-800 border ${
                index < 3 ? 'border-yellow-500/50' : 'border-slate-700'
              } rounded-xl p-6 hover:bg-slate-750 transition-all ${
                index < 3 ? 'shadow-lg shadow-yellow-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-3xl font-bold text-gray-400 min-w-[60px]">
                    {getRankMedal(index + 1)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold text-white">{score.playerName}</h3>
                      <span className={`text-2xl font-bold bg-gradient-to-r ${getGradeColor(score.grade)} bg-clip-text text-transparent`}>
                        {score.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>
                        Difficulty: <span className={`font-semibold ${getDifficultyColor(score.difficulty)}`}>
                          {score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                        </span>
                      </span>
                      <span>•</span>
                      <span>Turns: {score.turnsSurvived}</span>
                      <span>•</span>
                      <span>{new Date(score.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-4xl font-bold bg-gradient-to-r ${getGradeColor(score.grade)} bg-clip-text text-transparent`}>
                    {score.score.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Grade Thresholds</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              S
            </div>
            <div className="text-sm text-gray-400 mt-1">10,000+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              A
            </div>
            <div className="text-sm text-gray-400 mt-1">7,500+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              B
            </div>
            <div className="text-sm text-gray-400 mt-1">5,000+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              C
            </div>
            <div className="text-sm text-gray-400 mt-1">2,500+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
              D
            </div>
            <div className="text-sm text-gray-400 mt-1">&lt; 2,500</div>
          </div>
        </div>
      </div>
    </div>
  );
}
