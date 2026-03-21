import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

type Animation = "fade-up" | "fade-in" | "scale-in" | "fade-left" | "fade-right";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  /** Stagger index for sequential reveal (delay = staggerIndex * 100ms) */
  staggerIndex?: number;
  /** Custom delay in ms (overrides staggerIndex) */
  delay?: number;
  /** Transition duration in ms */
  duration?: number;
  className?: string;
}

const ANIMATION_CLASS: Record<Animation, string> = {
  "fade-up":    "sr-fade-up",
  "fade-in":    "sr-fade-in",
  "scale-in":   "sr-scale-in",
  "fade-left":  "sr-fade-left",
  "fade-right": "sr-fade-right",
};

export function ScrollReveal({
  children,
  animation = "fade-up",
  staggerIndex = 0,
  delay,
  duration = 600,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("sr-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delayMs = delay ?? staggerIndex * 100;
  const style: CSSProperties = {
    transitionDelay: `${delayMs}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <div
      ref={ref}
      className={`${ANIMATION_CLASS[animation]} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
