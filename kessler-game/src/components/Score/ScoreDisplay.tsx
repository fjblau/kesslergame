import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectScore, selectTotalScore } from '../../store/slices/scoreSlice';
import { ScoreBreakdown } from './ScoreBreakdown';

export function ScoreDisplay() {
  const totalScore = useAppSelector(selectTotalScore);
  const scoreState = useAppSelector(selectScore);
  const step = useAppSelector(state => state.game.step);
  const maxSteps = useAppSelector(state => state.game.maxSteps);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const turnsRemaining = maxSteps - step;

  return (
    <>
      <div 
        className="p-4 bg-slate-900/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-900/70 transition-colors"
        onClick={() => setShowBreakdown(true)}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl text-gray-400">Turns Remaining: </span>
          <span className="text-4xl font-bold text-blue-400">{turnsRemaining}</span>
          <span className="text-4xl text-gray-400 ml-8">Total Score:  </span>
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {Math.round(totalScore).toLocaleString()}
          </span>
        </div>
      </div>

      {showBreakdown && (
        <ScoreBreakdown 
          scoreState={scoreState}
          onClose={() => setShowBreakdown(false)}
        />
      )}
    </>
  );
}
