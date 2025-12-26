import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface CascadeWarningProps {
  onComplete: () => void;
}

export function CascadeWarning({ onComplete }: CascadeWarningProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <motion.div
        animate={{ 
          boxShadow: [
            'inset 0 0 0 8px rgba(239, 68, 68, 0)',
            'inset 0 0 0 8px rgba(239, 68, 68, 0.8)',
            'inset 0 0 0 8px rgba(239, 68, 68, 0)',
          ]
        }}
        transition={{ 
          duration: 0.8,
          repeat: 3,
          ease: 'easeInOut'
        }}
        className="w-full h-full"
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-red-600/90 px-8 py-4 rounded-lg shadow-2xl"
        >
          <motion.h2
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 0.5,
              repeat: 5,
              ease: 'easeInOut'
            }}
            className="text-4xl font-bold text-white text-center"
          >
            ⚠️ CASCADE EVENT! ⚠️
          </motion.h2>
          <p className="text-white text-center mt-2">
            Multiple simultaneous collisions detected
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
