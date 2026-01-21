import { useAppSelector } from '../../store/hooks';
import type { MissionDefinition } from '../../game/types';

interface MissionCardProps {
  mission: MissionDefinition;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { title, description, currentProgress, target, completed, failed, completedAt, turnLimit } = mission;
  const currentTurn = useAppSelector(state => state.game.step);
  
  const progressPercent = Math.min((currentProgress / target) * 100, 100);
  
  const borderColor = completed ? 'border-green-500' : failed ? 'border-red-500' : 'border-yellow-400';
  
  return (
    <div className={`bg-deep-space-100 border-l-4 ${borderColor} p-4 transition-all hover:translate-x-1 shadow-depth`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-sm ${
          completed 
            ? 'bg-green-500 border-green-500 text-slate-800' 
            : failed
            ? 'bg-red-500 border-red-500 text-slate-800'
            : 'border-gray-500 text-gray-500'
        }`}>
          {completed ? '✓' : failed ? '✗' : '☐'}
        </div>
        <h3 className={`text-base font-semibold ${
          completed ? 'text-gray-400 line-through' : failed ? 'text-red-400 line-through' : 'text-white'
        }`}>
          {title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-400 ml-8 mb-2">{description}</p>
      
      {completed && completedAt && (
        <div className="text-xs text-green-400 ml-8 font-semibold">
          ✓ Completed on turn {completedAt}
        </div>
      )}
      {failed && (
        <div className="text-xs text-red-400 ml-8 font-semibold">
          ✗ Failed (time limit exceeded)
        </div>
      )}
      
      {!completed && !failed && (
        <>
          <div className="text-xs text-yellow-400 font-semibold ml-8">
            Progress: {currentProgress}/{target}
            {turnLimit && ` (Turn ${currentTurn}/${turnLimit})`}
          </div>
          <div className="h-1.5 bg-deep-space-300 rounded-full ml-8 mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
