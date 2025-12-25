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
          const length = 200;
          const x1 = centerX + Math.cos(baseAngle) * 40;
          const y1 = centerY + Math.sin(baseAngle) * 40;
          const x2 = centerX + Math.cos(baseAngle) * (40 + length);
          const y2 = centerY + Math.sin(baseAngle) * (40 + length);

          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#fbbf24"
              strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                x2: [x1 + Math.cos(baseAngle) * 100, x2, x2, x1 + Math.cos(baseAngle) * 100],
                y2: [y1 + Math.sin(baseAngle) * 100, y2, y2, y1 + Math.sin(baseAngle) * 100],
              }}
              transition={{
                duration: 2,
                times: [0, 0.25, 0.75, 1],
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
