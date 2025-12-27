import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectScore, selectTotalScore } from '../../store/slices/scoreSlice';
import { ScoreBreakdown } from './ScoreBreakdown';

export function ScoreDisplay() {
  const totalScore = useAppSelector(selectTotalScore);
  const scoreState = useAppSelector(selectScore);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <>
      <div 
        className="p-4 bg-slate-900/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-900/70 transition-colors"
        onClick={() => setShowBreakdown(true)}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl text-gray-400">Total Score:  </span>
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {totalScore.toLocaleString()}
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
