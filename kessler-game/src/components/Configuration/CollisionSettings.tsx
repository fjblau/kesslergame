import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCollisionAngleThreshold, setCollisionRadiusMultiplier } from '../../store/slices/gameSlice';

export function CollisionSettings() {
  const angleThreshold = useAppSelector(state => state.game.collisionAngleThreshold);
  const radiusMultiplier = useAppSelector(state => state.game.collisionRadiusMultiplier);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Collision Detection Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">Angle Threshold: {angleThreshold}°</label>
          <input
            type="range"
            min="1"
            max="60"
            step="1"
            value={angleThreshold}
            onChange={(e) => dispatch(setCollisionAngleThreshold(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 w-40">Radius Multiplier: {radiusMultiplier.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={radiusMultiplier}
            onChange={(e) => dispatch(setCollisionRadiusMultiplier(Number(e.target.value)))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
