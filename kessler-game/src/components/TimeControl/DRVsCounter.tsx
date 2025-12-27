import { useAppSelector } from '../../store/hooks';

export function DRVsCounter() {
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const activeDRVs = drvs.filter(drv => drv.age < drv.maxAge).length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{activeDRVs}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">DRVs</div>
      </div>
    </div>
  );
}
