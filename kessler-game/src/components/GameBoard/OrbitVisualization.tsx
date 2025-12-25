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
    <div style={{ position: 'relative', width: '800px', height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', border: '2px solid #475569', borderRadius: '8px' }}>
      {/* GEO orbit */}
      <div style={{ position: 'absolute', width: '700px', height: '700px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          GEO
        </div>
      </div>
      
      {/* MEO orbit */}
      <div style={{ position: 'absolute', width: '480px', height: '480px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          MEO
        </div>
      </div>
      
      {/* LEO orbit */}
      <div style={{ position: 'absolute', width: '280px', height: '280px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          LEO
        </div>
      </div>
      
      {/* Earth */}
      <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}>
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
