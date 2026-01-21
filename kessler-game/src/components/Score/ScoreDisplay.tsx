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
        className="p-4 bg-slate-900/50 border-none border border-deep-space-50 cursor-pointer hover:bg-slate-900/70 transition-all"
        onClick={() => setShowBreakdown(true)}
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl text-gray-400">Turns Remaining: </span>
          <span className="text-4xl font-bold text-cyber-cyan-500">{turnsRemaining}</span>
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
