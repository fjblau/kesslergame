import { useAppSelector } from '../../store/hooks';
import { selectActiveMissions } from '../../store/slices/missionsSlice';
import { MissionCard } from './MissionCard';

export function MissionPanel() {
  const missions = useAppSelector(selectActiveMissions);
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-deep-space-300 border-4 border-cyber-cyan-800 p-6 shadow-depth-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,217,255,0.05) 100%)',
        }}></div>
        {/* Phillips screw heads */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gray-600 shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <div className="absolute w-2 h-[1px] bg-gray-800"></div>
          <div className="absolute w-[1px] h-2 bg-gray-800"></div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-600 shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <div className="absolute w-2 h-[1px] bg-gray-800"></div>
          <div className="absolute w-[1px] h-2 bg-gray-800"></div>
        </div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gray-600 shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <div className="absolute w-2 h-[1px] bg-gray-800"></div>
          <div className="absolute w-[1px] h-2 bg-gray-800"></div>
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gray-600 shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <div className="absolute w-2 h-[1px] bg-gray-800"></div>
          <div className="absolute w-[1px] h-2 bg-gray-800"></div>
        </div>
        <div className="relative z-10">
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
    </div>
  );
}
