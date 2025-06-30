"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

export const ParticleTrails = ({
  className = "",
  quantity = 50,
  particleSize = 2,
  particleColor = "rgb(14 165 233 / 0.2)", // sky-500 with low opacity
  maxSpeed = 0.5,
  trailLength = 20,
}: {
  className?: string;
  quantity?: number;
  particleSize?: number;
  particleColor?: string;
  maxSpeed?: number;
  trailLength?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });

    const newParticles = Array.from({ length: quantity }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: Math.random(),
    }));

    setParticles(newParticles);
  }, [quantity]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current) return;

    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          // Calculate direction based on mouse position
          const dx = (mouseX.get() - particle.x) * 0.01;
          const dy = (mouseY.get() - particle.y) * 0.01;

          // Update position with boundaries
          let newX = particle.x + dx * maxSpeed;
          let newY = particle.y + dy * maxSpeed;

          // Wrap around edges
          if (newX < 0) newX = dimensions.width;
          if (newX > dimensions.width) newX = 0;
          if (newY < 0) newY = dimensions.height;
          if (newY > dimensions.height) newY = 0;

          // Update opacity for twinkling effect
          const newOpacity = Math.sin(Date.now() * 0.001 + particle.id) * 0.5 + 0.5;

          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: newOpacity,
          };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, maxSpeed, mouseX, mouseY]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <svg width="100%" height="100%">
        {particles.map((particle, index) => (
          <g key={particle.id}>
            {/* Trail effect */}
            <motion.line
              x1={particle.x}
              y1={particle.y}
              x2={particle.x - (mouseX.get() - particle.x) * 0.1}
              y2={particle.y - (mouseY.get() - particle.y) * 0.1}
              stroke={particleColor}
              strokeWidth={particleSize / 2}
              strokeOpacity={particle.opacity * 0.5}
              initial={false}
            />
            {/* Particle */}
            <motion.circle
              cx={particle.x}
              cy={particle.y}
              r={particleSize}
              fill={particleColor}
              opacity={particle.opacity}
              initial={false}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}; 