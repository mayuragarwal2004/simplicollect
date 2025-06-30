"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface SparkleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  sparkleColor?: string;
  glowColor?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export const SparkleButton = ({
  children,
  className,
  sparkleColor = "#fff",
  glowColor = "rgb(14 165 233)", // sky-500
  ...props
}: SparkleButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Create sparkle effect
  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newSparkle = {
        id: Date.now(),
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        scale: Math.random() * 0.6 + 0.4,
        opacity: 1
      };

      setSparkles(prev => [...prev, newSparkle]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 1000);
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-xl px-8 py-4 font-bold",
        "bg-gradient-to-r from-sky-500 to-blue-600",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]",
        "active:scale-95",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-50 blur-xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 50%)`,
          opacity: isHovered ? 0.3 : 0
        }}
      />

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              transform: `scale(${sparkle.scale})`
            }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{
              opacity: [1, 0],
              scale: [0, 1],
              y: [0, -50],
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0L12.2451 7.75491L20 10L12.2451 12.2451L10 20L7.75491 12.2451L0 10L7.75491 7.75491L10 0Z"
                fill={sparkleColor}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Button content */}
      <div className="relative z-10">{children}</div>

      {/* Shine effect */}
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          background: "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
          backgroundSize: "200% 200%",
          transform: isHovered ? "translateX(100%)" : "translateX(-100%)"
        }}
      />
    </motion.button>
  );
}; 