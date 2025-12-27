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
  const debris = useAppSelector(state => state.game.debris);
  const satellites = useAppSelector(state => state.game.satellites);
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const step = useAppSelector(state => state.game.step);
  const maxSteps = useAppSelector(state => state.game.maxSteps);

  const totalDebris = debris.length;
  const cooperativeDebris = debris.filter(d => d.type === 'cooperative').length;
  const uncooperativeDebris = debris.filter(d => d.type === 'uncooperative').length;

  const risk = calculateRiskLevel(totalDebris);

  const getLayerStats = (layer: 'LEO' | 'MEO' | 'GEO') => {
    const satelliteCount = satellites.filter(s => s.layer === layer).length;
    const cooperativeDRVs = drvs.filter(d => d.layer === layer && d.removalType === 'cooperative' && d.age < d.maxAge).length;
    const uncooperativeDRVs = drvs.filter(d => d.layer === layer && d.removalType === 'uncooperative' && d.age < d.maxAge).length;
    return { satelliteCount, cooperativeDRVs, uncooperativeDRVs };
  };

  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-5 space-y-4 w-full h-[534px]">
      <h2 className="text-xl font-bold text-blue-300 mb-3 pb-2 border-b-2 border-slate-700 uppercase tracking-wide">
        Orbital Status
      </h2>
      
      <div className="space-y-2 text-base">
        <DebrisBreakdown 
          cooperative={cooperativeDebris}
          uncooperative={uncooperativeDebris}
          total={totalDebris}
        />

        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-slate-900">
                <th className="py-2 px-3 text-left text-white font-semibold border-b border-slate-700">Orbit Layer</th>
                <th className="py-2 px-3 text-center text-white font-semibold border-b border-slate-700">Satellites</th>
                <th colSpan={2} className="py-1 px-3 text-center text-white font-semibold border-b border-slate-700">DRV</th>
              </tr>
              <tr className="bg-slate-900">
                <th className="border-b border-slate-700"></th>
                <th className="border-b border-slate-700"></th>
                <th className="py-1 px-2 text-center text-white text-sm font-medium border-b border-slate-700 border-l border-slate-700">Cooperative</th>
                <th className="py-1 px-2 text-center text-white text-sm font-medium border-b border-slate-700">Uncooperative</th>
              </tr>
            </thead>
            <tbody>
              {(['LEO', 'MEO', 'GEO'] as const).map((layer) => {
                const stats = getLayerStats(layer);
                return (
                  <tr key={layer} className="hover:bg-slate-700/30">
                    <td className="py-1 px-3 text-blue-400 font-semibold">{layer}</td>
                    <td className="py-1 px-3 text-center text-gray-300">{stats.satelliteCount}</td>
                    <td className="py-1 px-2 text-center text-gray-300 border-l border-slate-700">{stats.cooperativeDRVs}</td>
                    <td className="py-1 px-2 text-center text-gray-300">{stats.uncooperativeDRVs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
