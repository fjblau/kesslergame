import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { SatelliteSprite } from './SatelliteSprite';
import { DebrisParticle } from './DebrisParticle';
import { DRVSprite } from './DRVSprite';
import { LaunchAnimation } from './LaunchAnimation';
import { CollisionEffect } from './CollisionEffect';
import { SolarStormEffect } from './SolarStormEffect';
import { CascadeWarning } from './CascadeWarning';
import { DaysCounter } from '../TimeControl/DaysCounter';
import { SatellitesCounter } from '../TimeControl/SatellitesCounter';
import { DRVsCounter } from '../TimeControl/DRVsCounter';
import { mapToPixels } from './utils';
import { clearOldCollisions, clearCascadeFlag } from '../../store/slices/gameSlice';
import { playCascadeWarning } from '../../utils/audio';

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
  const cascadeTriggered = useAppSelector(state => state.game.cascadeTriggered);
  const lastCascadeTurn = useAppSelector(state => state.game.lastCascadeTurn);
  const events = useAppSelector(state => state.events.events);
  const days = useAppSelector(state => state.game.days);
  const orbitalSpeeds = useAppSelector(state => ({
    LEO: state.game.orbitalSpeedLEO,
    MEO: state.game.orbitalSpeedMEO,
    GEO: state.game.orbitalSpeedGEO,
  }));

  const prevSatelliteIds = useRef<Set<string>>(new Set());
  const prevDRVIds = useRef<Set<string>>(new Set());
  const cascadeShownForTurn = useRef<number | undefined>(undefined);
  const solarStormShownForEvent = useRef<string | undefined>(undefined);
  const [launchingSatellites, setLaunchingSatellites] = useState<Set<string>>(new Set());
  const [launchingDRVs, setLaunchingDRVs] = useState<Set<string>>(new Set());
  const [activeTrails, setActiveTrails] = useState<LaunchingEntity[]>([]);
  const [completedCollisions, setCompletedCollisions] = useState<Set<string>>(new Set());
  const [showSolarStorm, setShowSolarStorm] = useState<boolean>(false);
  const [solarStormKey, setSolarStormKey] = useState<number>(0);
  const [showCascadeWarning, setShowCascadeWarning] = useState<boolean>(false);

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

  useEffect(() => {
    const latestEvent = events.find(event => event.type === 'solar-storm');
    if (latestEvent && solarStormShownForEvent.current !== latestEvent.id) {
      solarStormShownForEvent.current = latestEvent.id;
      requestAnimationFrame(() => {
        setShowSolarStorm(true);
        setSolarStormKey(prev => prev + 1);
      });
    }
  }, [events]);

  const handleSolarStormComplete = () => {
    setShowSolarStorm(false);
  };

  useEffect(() => {
    if (cascadeTriggered && !showCascadeWarning && lastCascadeTurn !== undefined) {
      if (cascadeShownForTurn.current !== lastCascadeTurn) {
        cascadeShownForTurn.current = lastCascadeTurn;
        requestAnimationFrame(() => {
          setShowCascadeWarning(true);
          playCascadeWarning();
        });
      }
    }
  }, [cascadeTriggered, showCascadeWarning, lastCascadeTurn]);

  const handleCascadeWarningComplete = useCallback(() => {
    dispatch(clearCascadeFlag());
    setShowCascadeWarning(false);
  }, [dispatch]);

  return (
    <div className="relative w-[1000px] h-[1000px] flex items-center justify-center bg-slate-900 border-2 border-slate-600 rounded-xl">
      {/* Days Counter */}
      <div className="absolute top-4 right-4 z-10">
        <DaysCounter />
      </div>

      {/* Satellites Counter */}
      <div className="absolute bottom-4 left-4 z-10">
        <SatellitesCounter />
      </div>

      {/* DRVs Counter */}
      <div className="absolute bottom-4 right-4 z-10">
        <DRVsCounter />
      </div>

      {/* Orbit Layer Breakdown */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-1.5">
          <div className="flex gap-6 justify-center text-sm">
            <span className="text-gray-400">LEO: <span className="text-blue-400 font-semibold">{satellites.filter(s => s.layer === 'LEO').length}</span></span>
            <span className="text-gray-400">MEO: <span className="text-blue-400 font-semibold">{satellites.filter(s => s.layer === 'MEO').length}</span></span>
            <span className="text-gray-400">GEO: <span className="text-blue-400 font-semibold">{satellites.filter(s => s.layer === 'GEO').length}</span></span>
          </div>
        </div>
      </div>

      {/* GEO orbit */}
      <div style={{ position: 'absolute', width: '875px', height: '875px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          GEO
        </div>
      </div>
      
      {/* MEO orbit */}
      <div style={{ position: 'absolute', width: '730px', height: '730px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          MEO
        </div>
      </div>
      
      {/* LEO orbit */}
      <div style={{ position: 'absolute', width: '512px', height: '512px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translate(-50%, 0)', fontSize: '12px', fontWeight: 600, color: '#60a5fa', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '4px' }}>
          LEO
        </div>
      </div>
      
      {/* Earth */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '125px', height: '125px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}>
        🌍
      </div>

      {/* Collision effects */}
      {activeCollisionEvents.map(collision => {
        const { x, y } = mapToPixels(collision, days, orbitalSpeeds);
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
        const { x, y } = mapToPixels(satellite, days, orbitalSpeeds);
        const isLaunching = launchingSatellites.has(satellite.id);
        const isCaptured = debrisRemovalVehicles.some(drv => drv.capturedDebrisId === satellite.id);
        return <SatelliteSprite key={satellite.id} satellite={satellite} x={x} y={y} isLaunching={isLaunching} isCaptured={isCaptured} />;
      })}

      {/* Debris */}
      {debris.map(debrisItem => {
        const { x, y } = mapToPixels(debrisItem, days, orbitalSpeeds);
        return <DebrisParticle key={debrisItem.id} debris={debrisItem} x={x} y={y} />;
      })}

      {/* DRVs */}
      {debrisRemovalVehicles.map(drv => {
        const { x, y } = mapToPixels(drv, days, orbitalSpeeds);
        const isLaunching = launchingDRVs.has(drv.id);
        return <DRVSprite key={drv.id} drv={drv} x={x} y={y} isLaunching={isLaunching} />;
      })}

      {/* Solar Storm Effect */}
      {showSolarStorm && <SolarStormEffect key={solarStormKey} onComplete={handleSolarStormComplete} />}

      {/* Cascade Warning */}
      {showCascadeWarning && <CascadeWarning onComplete={handleCascadeWarningComplete} />}
    </div>
  );
}
