import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Debris } from '../../game/types';
import { useAppSelector } from '../../store/hooks';
import { getEntitySpeedMultiplier } from './utils';

interface DebrisParticleProps {
  debris: Debris;
  x: number;
  y: number;
}

export const DebrisParticle = memo(function DebrisParticle({ debris, x, y }: DebrisParticleProps) {
  const isCooperative = debris.type === 'cooperative';
  const color = isCooperative ? '#9ca3af' : '#ef4444';
  const symbol = isCooperative ? '•' : '••';
  const days = useAppSelector(state => state.game.days);
  const orbitalSpeed = useAppSelector(state => {
    switch (debris.layer) {
      case 'LEO': return state.game.orbitalSpeedLEO;
      case 'MEO': return state.game.orbitalSpeedMEO;
      case 'GEO': return state.game.orbitalSpeedGEO;
      case 'GRAVEYARD': return state.game.orbitalSpeedGRAVEYARD;
    }
  });
  const baseAngle = (debris.x / 100) * 360;
  const speedMultiplier = getEntitySpeedMultiplier(debris.id);
  const rotation = baseAngle + (days * orbitalSpeed * speedMultiplier * 3.6);
  
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
});
