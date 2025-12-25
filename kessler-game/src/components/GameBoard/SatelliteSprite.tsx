import { motion } from 'framer-motion';
import type { Satellite } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG } from '../../game/constants';

interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
}

export function SatelliteSprite({ satellite, x, y }: SatelliteSpriteProps) {
  const icon = SATELLITE_PURPOSE_CONFIG[satellite.purpose].icon;
  const rotation = (satellite.x / 100) * 360;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color: '#60a5fa',
        fontSize: '20px',
      }}
      animate={{
        x: '-50%',
        y: '-50%',
        rotate: rotation,
      }}
      transition={{
        rotate: { duration: 0.5, ease: 'linear' },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
      title={`${satellite.purpose} Satellite (${satellite.layer})`}
    >
      {icon}
    </motion.div>
  );
}
