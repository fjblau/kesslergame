import { motion } from 'framer-motion';
import type { Debris } from '../../game/types';

interface DebrisParticleProps {
  debris: Debris;
  x: number;
  y: number;
}

export function DebrisParticle({ debris, x, y }: DebrisParticleProps) {
  const isCooperative = debris.type === 'cooperative';
  const color = isCooperative ? '#9ca3af' : '#ef4444';
  const symbol = isCooperative ? '•' : '••';
  const rotation = (debris.x / 100) * 360;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        color,
        fontSize: '12px',
      }}
      initial={{
        x: '-50%',
        y: '-50%',
        scale: 0,
        opacity: 0,
        rotate: rotation,
      }}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: 1,
        opacity: 1,
        rotate: rotation,
      }}
      transition={{
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.3, ease: 'easeOut' },
        rotate: { duration: 0.5, ease: 'linear' },
        x: { duration: 0 },
        y: { duration: 0 },
      }}
      title={`${debris.type} Debris (${debris.layer})`}
    >
      {symbol}
    </motion.div>
  );
}
