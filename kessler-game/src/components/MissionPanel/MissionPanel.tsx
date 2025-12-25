import { useAppSelector } from '../../store/hooks';
import { selectActiveMissions } from '../../store/slices/missionsSlice';
import { MissionCard } from './MissionCard';

export function MissionPanel() {
  const missions = useAppSelector(selectActiveMissions);
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-300 mb-5 pb-3 border-b-2 border-slate-700 uppercase tracking-wide">
          Missions
        </h2>
        <div className="space-y-4">
          {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </div>
  );
}
