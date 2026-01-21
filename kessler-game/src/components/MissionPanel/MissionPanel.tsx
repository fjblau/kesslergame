import { useAppSelector } from '../../store/hooks';
import { selectActiveMissions } from '../../store/slices/missionsSlice';
import { MissionCard } from './MissionCard';

export function MissionPanel() {
  const missions = useAppSelector(selectActiveMissions);
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-deep-space-300 border border-deep-space-50 border-none p-6">
        <h2 className="text-xl font-bold text-cyber-cyan-400 mb-5 pb-3 border-b-2 border-deep-space-50 uppercase tracking-wide">
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
