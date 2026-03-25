import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' },
    );

    pendingRef.current.forEach((el) => observerRef.current!.observe(el));
    pendingRef.current = [];

    return () => observerRef.current?.disconnect();
  }, []);

  const reveal = useCallback((delay: number = 0) => {
    return (el: HTMLElement | null) => {
      if (!el || el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (delay > 0) el.style.transitionDelay = `${delay}ms`;

      if (observerRef.current) {
        observerRef.current.observe(el);
      } else {
        pendingRef.current.push(el);
      }

      // Safety net: force-reveal quickly if IntersectionObserver misses
      setTimeout(() => {
        if (el && !el.classList.contains('revealed')) {
          el.classList.add('revealed');
        }
      }, 800 + delay);
    };
  }, []);

  return reveal;
}
