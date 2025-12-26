import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface SolarStormEffectProps {
  onComplete: () => void;
}

export function SolarStormEffect({ onComplete }: SolarStormEffectProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const centerX = 400;
  const centerY = 400;
  const beamCount = 5;
  const beams = Array.from({ length: beamCount }, (_, i) => i);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '800px',
        height: '800px',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.3, 0] }}
        transition={{
          duration: 2,
          times: [0, 0.25, 0.75, 1],
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#fbbf24',
        }}
      />

      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {beams.map((i) => {
          const baseAngle = (i * Math.PI * 2) / beamCount;
          const cosAngle = Math.cos(baseAngle);
          const sinAngle = Math.sin(baseAngle);

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 2,
                times: [0, 0.25, 0.75, 1],
              }}
            >
              <line
                x1={centerX + cosAngle * 40}
                y1={centerY + sinAngle * 40}
                x2={centerX + cosAngle * 240}
                y2={centerY + sinAngle * 240}
                stroke="#fbbf24"
                strokeWidth="3"
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
