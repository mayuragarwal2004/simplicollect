import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ReactNode, forwardRef } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  glowColor?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glowColor = '#0EA5E9', ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-xl p-6 group transition-all duration-300",
          "bg-gradient-to-br from-white/10 to-white/5",
          "backdrop-blur-xl border border-white/10",
          "hover:border-white/20 hover:from-white/15 hover:to-white/5",
          "before:absolute before:inset-0 before:-z-10",
          "before:rounded-xl before:bg-gradient-to-br",
          `before:from-${glowColor}/20 before:to-transparent`,
          "before:opacity-0 before:transition-opacity",
          "hover:before:opacity-100",
          className
        )}
        {...props}
      >
        <div style={{ transform: "translateZ(75px)" }}>
          {children}
        </div>
      </motion.div>
    );
  }
); 