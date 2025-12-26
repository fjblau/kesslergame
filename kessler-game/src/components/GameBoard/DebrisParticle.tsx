import { motion } from 'framer-motion';
import type { Debris } from '../../game/types';
import { ORBITAL_SPEEDS } from '../../game/constants';
import { useAppSelector } from '../../store/hooks';

interface DebrisParticleProps {
  debris: Debris;
  x: number;
  y: number;
}

export function DebrisParticle({ debris, x, y }: DebrisParticleProps) {
  const isCooperative = debris.type === 'cooperative';
  const color = isCooperative ? '#9ca3af' : '#ef4444';
  const symbol = isCooperative ? '•' : '••';
  const days = useAppSelector(state => state.game.days);
  const baseAngle = (debris.x / 100) * 360;
  const rotation = baseAngle + (days * ORBITAL_SPEEDS[debris.layer] * 3.6);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color,
        fontSize: '12px',
      }}
      initial={{
        left: x,
        top: y,
        x: '-50%',
        y: '-50%',
        scale: 0,
        opacity: 0,
        rotate: rotation,
      }}
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
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.3, ease: 'easeOut' },
        rotate: { duration: 1, ease: 'linear' },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
      title={`${debris.type} Debris (${debris.layer})`}
    >
      {symbol}
    </motion.div>
  );
}
