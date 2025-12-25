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
      title={`${debris.type} Debris (${debris.layer})`}
    >
      {symbol}
    </motion.div>
  );
}
