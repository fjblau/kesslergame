import { useAppSelector } from '../../store/hooks';

export function SatellitesCounter() {
  const satellites = useAppSelector(state => state.game.satellites);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{satellites.length}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">Satellites</div>
      </div>
    </div>
  );
}
