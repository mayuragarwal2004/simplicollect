import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Spotlight({ children, className = '' }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;

      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
    };

    divRef.current?.addEventListener('mousemove', handleMouseMove);
    return () => {
      divRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={divRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
} 