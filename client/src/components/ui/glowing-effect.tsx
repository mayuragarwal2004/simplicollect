import { useEffect, useRef } from "react";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
}

export function GlowingEffect({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
}: GlowingEffectProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !glowRef.current) return;

    const glow = glowRef.current;
    const glowInner = glow.querySelector("[data-glow-animation]") as HTMLElement;

    if (!glowInner) return;

    const rect = glow.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(glow);
    const radius = Number(computedStyle.borderRadius.replace("px", ""));
    const glowBlur = spread;
    const glowOpacity = 0.2;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const normalizedDistance = distance / maxDistance;

      if (normalizedDistance < inactiveZone) {
        glowInner.style.opacity = "0";
        return;
      }

      const dx = (x - rect.left - centerX) / proximity;
      const dy = (y - rect.top - centerY) / proximity;

      glowInner.style.transform = `translate(${dx}px, ${dy}px)`;
      glowInner.style.opacity = (1 - normalizedDistance).toString();
    };

    const onMouseLeave = () => {
      glowInner.style.opacity = "0";
      glowInner.style.transform = "translate(0, 0)";
    };

    if (glow) {
      glow.addEventListener("mousemove", onMouseMove);
      glow.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      if (glow) {
        glow.removeEventListener("mousemove", onMouseMove);
        glow.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [disabled, glow, inactiveZone, proximity, spread]);

  return (
    <div ref={glowRef} className="absolute inset-0">
      <div
        data-glow-animation
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 100%)",
          opacity: 0,
        }}
      />
    </div>
  );
} 