import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playCollision } from '../../utils/audio';

interface CollisionEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function CollisionEffect({ x, y, onComplete }: CollisionEffectProps) {
  useEffect(() => {
    playCollision();
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none' }}>
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 5, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '3px solid #ef4444',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
