import { useAppSelector } from '../../store/hooks';

export function SatellitesCounter() {
  const satellites = useAppSelector(state => state.game.satellites);

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none px-3 py-1.5 w-[180px] min-h-[80px]">
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan-500">{satellites.length}</div>
        <div className="text-sm text-gray-400 uppercase tracking-wide">Satellites</div>
      </div>
    </div>
  );
}
