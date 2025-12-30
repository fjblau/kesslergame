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
}

export const DRVSprite = memo(function DRVSprite({ drv, x, y, isLaunching = false }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const isGeoTug = drv.removalType === 'geotug';
  const hasCapturedObject = drv.capturedDebrisId !== undefined;
  const color = hasCapturedObject ? '#ef4444' : (isGeoTug ? '#a855f7' : (isCooperative ? '#34d399' : '#fb923c'));
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
  
  const offset = hasCapturedObject ? 2 : 0;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color,
        fontSize: '16px',
        filter: hasCapturedObject ? 'drop-shadow(0 0 8px #ef4444)' : 'none',
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
        left: x + offset,
        top: y + offset,
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
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </motion.div>
  );
});
