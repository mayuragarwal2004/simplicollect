import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WavyBackgroundProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
}

export function WavyBackground({
  children,
  className = '',
  colors = ['#818cf8', '#c084fc', '#22d3ee'],
}: WavyBackgroundProps) {
  const paths = [
    'M0 0L50 10C100 20 150 20 200 10C250 0 300 0 350 10C400 20 450 20 500 10L500 0L0 0Z',
    'M0 0L50 15C100 30 150 30 200 15C250 0 300 0 350 15C400 30 450 30 500 15L500 0L0 0Z',
    'M0 0L50 5C100 10 150 10 200 5C250 0 300 0 350 5C400 10 450 10 500 5L500 0L0 0Z',
  ];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute w-full h-[1000px] inset-0">
          {paths.map((path, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                transform: `translateY(${i * 10}px)`,
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg
                className="w-full absolute h-full"
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
                style={{
                  transform: `scaleX(3) translateX(${i * 5}%)`,
                }}
              >
                <path
                  d={path}
                  fill={colors[i]}
                  fillOpacity={0.1}
                />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
} 