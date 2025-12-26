import { motion } from 'framer-motion';
import type { DebrisRemovalVehicle } from '../../game/types';
import { ORBITAL_SPEEDS } from '../../game/constants';
import { useAppSelector } from '../../store/hooks';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
  isLaunching?: boolean;
}

export function DRVSprite({ drv, x, y, isLaunching = false }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const color = isCooperative ? '#34d399' : '#fb923c';
  const days = useAppSelector(state => state.game.days);
  const baseAngle = (drv.x / 100) * 360;
  const rotation = baseAngle + (days * ORBITAL_SPEEDS[drv.layer] * 3.6);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        color,
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
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </motion.div>
  );
}
