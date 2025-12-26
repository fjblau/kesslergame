import { useAppSelector } from '../../store/hooks';
import { DebrisBreakdown } from './DebrisBreakdown';

type RiskLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

interface RiskInfo {
  level: RiskLevel;
  color: string;
  emoji: string;
}

function calculateRiskLevel(totalDebris: number): RiskInfo {
  if (totalDebris < 50) {
    return { level: 'LOW', color: 'text-green-400', emoji: '🟢' };
  } else if (totalDebris < 100) {
    return { level: 'MEDIUM', color: 'text-yellow-400', emoji: '🟡' };
  } else {
    return { level: 'CRITICAL', color: 'text-red-400', emoji: '🔴' };
  }
}

export function StatsPanel() {
  const satellites = useAppSelector(state => state.game.satellites);
  const debris = useAppSelector(state => state.game.debris);
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const step = useAppSelector(state => state.game.step);
  const maxSteps = useAppSelector(state => state.game.maxSteps);

  const totalDebris = debris.length;
  const cooperativeDebris = debris.filter(d => d.type === 'cooperative').length;
  const uncooperativeDebris = debris.filter(d => d.type === 'uncooperative').length;
  const totalDebrisRemoved = drvs.reduce((sum, drv) => sum + drv.debrisRemoved, 0);
  const activeDRVs = drvs.filter(drv => drv.age < drv.maxAge).length;

  const risk = calculateRiskLevel(totalDebris);

  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-6 space-y-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-blue-300 mb-4 pb-3 border-b-2 border-slate-700 uppercase tracking-wide">
        Orbital Status
      </h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-gray-400">Active Satellites:</span>
          <span className="text-blue-400 font-semibold">{satellites.length}</span>
        </div>

        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-gray-400">Active DRVs:</span>
          <span className="text-blue-400 font-semibold">{activeDRVs}</span>
        </div>

        <DebrisBreakdown 
          cooperative={cooperativeDebris}
          uncooperative={uncooperativeDebris}
          total={totalDebris}
        />

        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-gray-400">Debris Removed:</span>
          <span className="text-green-500 font-bold">{totalDebrisRemoved}</span>
        </div>

        <div className="flex justify-between py-2 border-b border-slate-700/50">
          <span className="text-gray-400">Risk Level:</span>
          <span className={`${risk.color} font-semibold inline-flex items-center gap-1`}>
            <span>{risk.emoji}</span> {risk.level}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-400">Step:</span>
          <span className="text-gray-500">{step} / {maxSteps}</span>
        </div>
      </div>
    </div>
  );
}
