import { useAppSelector } from '../../store/hooks';

export function DaysCounter() {
  const days = useAppSelector(state => state.game.days);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-400">{days}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">Days</div>
      </div>
    </div>
  );
}
