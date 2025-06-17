import { motion, HTMLMotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg' | 'sm';
  glowColor?: string;
  asChild?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = 'default', size = 'default', glowColor = '#0EA5E9', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    return (
      <Comp
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Size variants
          size === 'default' && "h-10 px-4 py-2",
          size === 'sm' && "h-9 px-3",
          size === 'lg' && "h-11 px-8",
          
          // Color variants
          variant === 'default' && [
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "before:absolute before:inset-0 before:-z-10 before:rounded-lg",
            `before:bg-[${glowColor}] before:blur-xl before:opacity-0`,
            "hover:before:opacity-20",
          ],
          variant === 'outline' && [
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            "before:absolute before:inset-0 before:-z-10 before:rounded-lg",
            `before:bg-[${glowColor}] before:blur-xl before:opacity-0`,
            "hover:before:opacity-10",
          ],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
); 