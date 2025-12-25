import { useAppSelector } from '../../store/hooks';
import { SatelliteSprite } from './SatelliteSprite';
import { DebrisParticle } from './DebrisParticle';
import { DRVSprite } from './DRVSprite';
import { mapToPixels } from './utils';

export function OrbitVisualization() {
  const satellites = useAppSelector(state => state.game.satellites);
  const debris = useAppSelector(state => state.game.debris);
  const debrisRemovalVehicles = useAppSelector(state => state.game.debrisRemovalVehicles);

  return (
    <div style={{ position: 'relative', width: '600px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      {/* GEO orbit */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -32px)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          GEO
        </div>
      </div>
      
      {/* MEO orbit */}
      <div style={{ position: 'absolute', width: '350px', height: '350px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -32px)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          MEO
        </div>
      </div>
      
      {/* LEO orbit */}
      <div style={{ position: 'absolute', width: '200px', height: '200px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -32px)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          LEO
        </div>
      </div>
      
      {/* Earth */}
      <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">
        🌍
      </div>

      {/* Satellites */}
      {satellites.map(satellite => {
        const { x, y } = mapToPixels(satellite);
        return <SatelliteSprite key={satellite.id} satellite={satellite} x={x} y={y} />;
      })}

      {/* Debris */}
      {debris.map(debrisItem => {
        const { x, y } = mapToPixels(debrisItem);
        return <DebrisParticle key={debrisItem.id} debris={debrisItem} x={x} y={y} />;
      })}

      {/* DRVs */}
      {debrisRemovalVehicles.map(drv => {
        const { x, y } = mapToPixels(drv);
        return <DRVSprite key={drv.id} drv={drv} x={x} y={y} />;
      })}
    </div>
  );
}
