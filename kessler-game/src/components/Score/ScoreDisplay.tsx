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
          <span className="text-gray-400">Total Score:  </span>
          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {totalScore.toLocaleString()}
          </span>
          <button
            className="text-xs text-blue-400 hover:text-blue-300 underline"
            onClick={(e) => {
              e.stopPropagation();
              setShowBreakdown(true);
            }}
          >
            View Breakdown
          </button>
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
