import { useAppSelector } from '../../store/hooks';

export function DebrisRemovedCounter() {
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const totalDebrisRemoved = drvs.reduce((sum, drv) => sum + drv.debrisRemoved, 0);

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none px-3 py-1.5 w-[180px] min-h-[80px]">
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan-500">{totalDebrisRemoved}</div>
        <div className="text-sm text-gray-400 uppercase tracking-wide">Debris Removed</div>
      </div>
    </div>
  );
}
