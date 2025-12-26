import { motion } from 'framer-motion';
import type { DebrisRemovalVehicle } from '../../game/types';

interface DRVSpriteProps {
  drv: DebrisRemovalVehicle;
  x: number;
  y: number;
  isLaunching?: boolean;
}

export function DRVSprite({ drv, x, y, isLaunching = false }: DRVSpriteProps) {
  const isCooperative = drv.removalType === 'cooperative';
  const color = isCooperative ? '#34d399' : '#fb923c';
  const rotation = (drv.x / 100) * 360;
  
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
        left: { duration: 0.5, ease: 'linear' },
        top: { duration: 0.5, ease: 'linear' },
        rotate: { duration: 0.5, ease: 'linear' },
        x: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        y: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0 },
        scale: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0.5, ease: 'linear' },
        opacity: isLaunching ? { duration: 1.5, ease: [0.33, 1, 0.68, 1] } : { duration: 0.5, ease: 'linear' },
      }}
      title={`${drv.removalType} DRV (${drv.layer})`}
    >
      ⬟
    </motion.div>
  );
}
