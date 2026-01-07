import { motion } from 'framer-motion';

interface RefuelingEffectProps {
  x: number;
  y: number;
}

export default function RefuelingEffect({ x, y }: RefuelingEffectProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <motion.div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #22d3ee',
          position: 'relative',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        🔧
      </motion.div>
    </motion.div>
  );
}
