import { memo } from 'react';
import { motion } from 'framer-motion';
import type { DebrisRemovalVehicle } from '../../game/types';
import { useAppSelector } from '../../store/hooks';
import { getEntitySpeedMultiplier } from './utils';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
  isLaunching?: boolean;
  capturedSatelliteIcon?: string;
}

export const DRVSprite = memo(function DRVSprite({ drv, x, y, isLaunching = false, capturedSatelliteIcon }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const isGeoTug = drv.removalType === 'geotug';
  const isRefueling = drv.removalType === 'refueling';
  const hasCapturedObject = drv.capturedDebrisId !== undefined;
  const color = isRefueling 
    ? '#67e8f9' 
    : hasCapturedObject 
      ? '#ef4444' 
      : (isGeoTug ? '#a855f7' : (isCooperative ? '#34d399' : '#fb923c'));
  const isAging = drv.age > drv.maxAge * 0.5;
  const days = useAppSelector(state => state.game.days);
  const orbitalSpeed = useAppSelector(state => {
    switch (drv.layer) {
      case 'LEO': return state.game.orbitalSpeedLEO;
      case 'MEO': return state.game.orbitalSpeedMEO;
      case 'GEO': return state.game.orbitalSpeedGEO;
      case 'GRAVEYARD': return state.game.orbitalSpeedGRAVEYARD;
    }
  });
  const baseAngle = (drv.x / 100) * 360;
  const speedMultiplier = getEntitySpeedMultiplier(drv.id);
  const rotation = baseAngle + (days * orbitalSpeed * speedMultiplier * 3.6);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color,
        fontSize: '16px',
        filter: hasCapturedObject ? (isRefueling ? 'drop-shadow(0 0 6px rgba(103, 232, 249, 0.5))' : 'drop-shadow(0 0 8px #ef4444)') : 'none',
      }}
      initial={isLaunching ? {
        left: 500,
        top: 500,
        x: '-50%',
        y: '-50%',
        scale: 0.8,
        opacity: 1,
        rotate: 0,
      } : false}
      animate={{
        left: x,
        top: y,
        x: '-50%',
        y: '-50%',
        scale: 1,
        opacity: 1,
        rotate: rotation,
      }}
      transition={{
        left: isLaunching ? { duration: 4, ease: [0.2, 0.8, 0.4, 1] } : { duration: 1, ease: 'linear' },
        top: isLaunching ? { duration: 4, ease: [0.2, 0.8, 0.4, 1] } : { duration: 1, ease: 'linear' },
        rotate: { duration: 1, ease: 'linear' },
        scale: isLaunching ? { duration: 4, ease: [0.2, 0.8, 0.4, 1] } : { duration: 1, ease: 'linear' },
        opacity: { duration: 0.3 },
      }}
      title={hasCapturedObject ? `${drv.removalType} DRV (${drv.layer}) - WITH CAPTURED SATELLITE` : `${drv.removalType} DRV (${drv.layer}) - Age: ${drv.age}/${drv.maxAge}`}
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {capturedSatelliteIcon ? (
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <span>⬟</span>
            <span style={{ fontSize: '14px' }}>{capturedSatelliteIcon}</span>
            {isRefueling && (
              <span style={{ fontSize: '12px', marginLeft: '-2px' }}>🔧</span>
            )}
          </span>
        ) : (
          '⬟'
        )}
        {isAging && !isGeoTug && !isRefueling && (
          <span style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '22px',
            height: '22px',
            border: '2px solid #fbbf24',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
        )}
      </span>
    </motion.div>
  );
});
