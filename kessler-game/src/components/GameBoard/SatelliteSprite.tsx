import { motion } from 'framer-motion';
import type { Satellite } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG } from '../../game/constants';

interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
  isLaunching?: boolean;
}

export function SatelliteSprite({ satellite, x, y, isLaunching = false }: SatelliteSpriteProps) {
  const icon = SATELLITE_PURPOSE_CONFIG[satellite.purpose].icon;
  const rotation = (satellite.x / 100) * 360;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color: '#60a5fa',
        fontSize: '20px',
      }}
      initial={isLaunching ? {
        left: 400,
        top: 400,
        x: '-50%',
        y: '-50%',
        scale: 0.5,
        opacity: 0,
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
        left: { duration: 0.5, ease: 'linear' },
        top: { duration: 0.5, ease: 'linear' },
        rotate: { duration: 0.5, ease: 'linear' },
        x: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        y: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        scale: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0.5, ease: 'linear' },
        opacity: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0.5, ease: 'linear' },
      }}
      title={`${satellite.purpose} Satellite (${satellite.layer})`}
    >
      {icon}
    </motion.div>
  );
}
