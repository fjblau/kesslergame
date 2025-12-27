import { useAppSelector } from '../../store/hooks';

export function SatellitesCounter() {
  const satellites = useAppSelector(state => state.game.satellites);
  
  const leoCount = satellites.filter(s => s.layer === 'LEO').length;
  const meoCount = satellites.filter(s => s.layer === 'MEO').length;
  const geoCount = satellites.filter(s => s.layer === 'GEO').length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{satellites.length}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Satellites</div>
        <div className="flex gap-3 justify-center text-xs">
          <span className="text-gray-400">LEO: <span className="text-blue-400 font-semibold">{leoCount}</span></span>
          <span className="text-gray-400">MEO: <span className="text-blue-400 font-semibold">{meoCount}</span></span>
          <span className="text-gray-400">GEO: <span className="text-blue-400 font-semibold">{geoCount}</span></span>
        </div>
      </div>
    </div>
  );
}
