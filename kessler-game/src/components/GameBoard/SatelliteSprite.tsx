import { motion } from 'framer-motion';
import type { Satellite } from '../../game/types';
import { SATELLITE_PURPOSE_CONFIG, ORBITAL_SPEEDS } from '../../game/constants';
import { useAppSelector } from '../../store/hooks';

interface SatelliteSpriteProps {
  satellite: Satellite;
  x: number;
  y: number;
  isLaunching?: boolean;
}

export function SatelliteSprite({ satellite, x, y, isLaunching = false }: SatelliteSpriteProps) {
  const icon = SATELLITE_PURPOSE_CONFIG[satellite.purpose].icon;
  const days = useAppSelector(state => state.game.days);
  const baseAngle = (satellite.x / 100) * 360;
  const rotation = baseAngle + (days * ORBITAL_SPEEDS[satellite.layer] * 3.6);
  
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
        left: { duration: 1, ease: 'linear' },
        top: { duration: 1, ease: 'linear' },
        rotate: { duration: 1, ease: 'linear' },
        x: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        y: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        scale: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 1, ease: 'linear' },
        opacity: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 1, ease: 'linear' },
      }}
      title={`${satellite.purpose} Satellite (${satellite.layer})`}
    >
      {icon}
    </motion.div>
  );
}
