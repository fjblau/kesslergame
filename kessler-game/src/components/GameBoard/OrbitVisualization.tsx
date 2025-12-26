import { useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { SatelliteSprite } from './SatelliteSprite';
import { DebrisParticle } from './DebrisParticle';
import { DRVSprite } from './DRVSprite';
import { LaunchAnimation } from './LaunchAnimation';
import { CollisionEffect } from './CollisionEffect';
import { mapToPixels } from './utils';
import { clearOldCollisions } from '../../store/slices/gameSlice';

interface LaunchingEntity {
  id: string;
  layer: 'LEO' | 'MEO' | 'GEO';
  angle: number;
}

export function OrbitVisualization() {
  const dispatch = useAppDispatch();
  const satellites = useAppSelector(state => state.game.satellites);
  const debris = useAppSelector(state => state.game.debris);
  const debrisRemovalVehicles = useAppSelector(state => state.game.debrisRemovalVehicles);
  const recentCollisions = useAppSelector(state => state.game.recentCollisions);

  const prevSatelliteIds = useRef<Set<string>>(new Set());
  const prevDRVIds = useRef<Set<string>>(new Set());
  const [launchingSatellites, setLaunchingSatellites] = useState<Set<string>>(new Set());
  const [launchingDRVs, setLaunchingDRVs] = useState<Set<string>>(new Set());
  const [activeTrails, setActiveTrails] = useState<LaunchingEntity[]>([]);
  const [completedCollisions, setCompletedCollisions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentSatelliteIds = new Set(satellites.map(s => s.id));
    const currentDRVIds = new Set(debrisRemovalVehicles.map(d => d.id));

    const newSatelliteIds = new Set<string>();
    const newDRVIds = new Set<string>();
    const newTrails: LaunchingEntity[] = [];

    satellites.forEach(satellite => {
      if (!prevSatelliteIds.current.has(satellite.id)) {
        newSatelliteIds.add(satellite.id);
        const angle = (satellite.x / 100) * 2 * Math.PI;
        newTrails.push({ id: satellite.id, layer: satellite.layer, angle });
      }
    });

    debrisRemovalVehicles.forEach(drv => {
      if (!prevDRVIds.current.has(drv.id)) {
        newDRVIds.add(drv.id);
        const angle = (drv.x / 100) * 2 * Math.PI;
        newTrails.push({ id: drv.id, layer: drv.layer, angle });
      }
    });

    prevSatelliteIds.current = currentSatelliteIds;
    prevDRVIds.current = currentDRVIds;

    if (newSatelliteIds.size > 0 || newDRVIds.size > 0) {
      requestAnimationFrame(() => {
        setLaunchingSatellites(newSatelliteIds);
        setLaunchingDRVs(newDRVIds);
        setActiveTrails(newTrails);

        setTimeout(() => {
          setLaunchingSatellites(new Set());
          setLaunchingDRVs(new Set());
        }, 1500);
      });
    }
  }, [satellites, debrisRemovalVehicles]);

  const handleTrailComplete = (id: string) => {
    setActiveTrails(prev => prev.filter(trail => trail.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(clearOldCollisions());
    }, 100);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleCollisionComplete = (id: string) => {
    setCompletedCollisions(prev => new Set([...prev, id]));
  };

  const activeCollisionEvents = recentCollisions.filter(
    collision => !completedCollisions.has(collision.id)
  );

  return (
    <div className="relative w-[800px] h-[800px] flex items-center justify-center bg-slate-900 border-2 border-slate-600 rounded-xl">
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

      {/* Collision effects */}
      {activeCollisionEvents.map(collision => {
        const { x, y } = mapToPixels(collision);
        return (
          <CollisionEffect
            key={collision.id}
            x={x}
            y={y}
            onComplete={() => handleCollisionComplete(collision.id)}
          />
        );
      })}

      {/* Launch trails */}
      {activeTrails.map(trail => (
        <LaunchAnimation
          key={trail.id}
          targetLayer={trail.layer}
          targetAngle={trail.angle}
          onComplete={() => handleTrailComplete(trail.id)}
        />
      ))}

      {/* Satellites */}
      {satellites.map(satellite => {
        const { x, y } = mapToPixels(satellite);
        const isLaunching = launchingSatellites.has(satellite.id);
        return <SatelliteSprite key={satellite.id} satellite={satellite} x={x} y={y} isLaunching={isLaunching} />;
      })}

      {/* Debris */}
      {debris.map(debrisItem => {
        const { x, y } = mapToPixels(debrisItem);
        return <DebrisParticle key={debrisItem.id} debris={debrisItem} x={x} y={y} />;
      })}

      {/* DRVs */}
      {debrisRemovalVehicles.map(drv => {
        const { x, y } = mapToPixels(drv);
        const isLaunching = launchingDRVs.has(drv.id);
        return <DRVSprite key={drv.id} drv={drv} x={x} y={y} isLaunching={isLaunching} />;
      })}
    </div>
  );
}
