import { useAppSelector } from '../../store/hooks';

export function DebrisRemovedCounter() {
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const totalDebrisRemoved = drvs.reduce((sum, drv) => sum + drv.debrisRemoved, 0);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{totalDebrisRemoved}</div>
        <div className="text-sm text-gray-400 uppercase tracking-wide">Debris Removed</div>
      </div>
    </div>
  );
}
