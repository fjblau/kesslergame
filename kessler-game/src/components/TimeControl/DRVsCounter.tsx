import { useAppSelector } from '../../store/hooks';

export function DRVsCounter() {
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const activeDRVs = drvs.filter(drv => drv.age < drv.maxAge).length;

  return (
    <div className="bg-deep-space-300 border border-deep-space-50 border-none px-3 py-1.5 w-[180px] min-h-[80px]">
      <div className="text-center">
        <div className="text-3xl font-bold text-cyber-cyan-500">{activeDRVs}</div>
        <div className="text-sm text-gray-400 uppercase tracking-wide">ADRs</div>
      </div>
    </div>
  );
}
