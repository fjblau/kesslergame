import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Satellite } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG } from '../../game/constants';
import { useAppSelector } from '../../store/hooks';
import { getEntitySpeedMultiplier } from './utils';

interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
  isLaunching?: boolean;
  isCaptured?: boolean;
}

export const SatelliteSprite = memo(function SatelliteSprite({ satellite, x, y, isLaunching = false, isCaptured = false }: SatelliteSpriteProps) {
  const icon = SATELLITE_PURPOSE_CONFIG[satellite.purpose].icon;
  const days = useAppSelector(state => state.game.days);
  const orbitalSpeed = useAppSelector(state => {
    switch (satellite.layer) {
      case 'LEO': return state.game.orbitalSpeedLEO;
      case 'MEO': return state.game.orbitalSpeedMEO;
      case 'GEO': return state.game.orbitalSpeedGEO;
    }
  });
  const baseAngle = (satellite.x / 100) * 360;
  const speedMultiplier = getEntitySpeedMultiplier(satellite.id);
  const rotation = baseAngle + (days * orbitalSpeed * speedMultiplier * 3.6);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color: isCaptured ? '#ef4444' : '#60a5fa',
        fontSize: '20px',
        filter: isCaptured ? 'drop-shadow(0 0 8px #ef4444)' : 'none',
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
      title={isCaptured ? `${satellite.purpose} Satellite (${satellite.layer}) - CAPTURED` : `${satellite.purpose} Satellite (${satellite.layer})`}
    >
      <span style={{ 
        position: 'relative',
        display: 'inline-block',
      }}>
        {icon}
        {isCaptured && (
          <span style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            border: '2px solid #ef4444',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
        )}
      </span>
    </motion.div>
  );
});
