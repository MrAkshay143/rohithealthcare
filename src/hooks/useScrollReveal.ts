import { useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Returns a `reveal(delay?)` function that produces a ref callback.
 * Attach it to any HTML/SVG element: `ref={reveal(100)}`.
 * Each element animates only once when it enters the viewport.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const reveal = useCallback((delay: number = 0) => {
    return (el: HTMLElement | null) => {
      if (!el || el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (delay > 0) el.style.transitionDelay = `${delay}ms`;
      observerRef.current?.observe(el);
    };
  }, []);

  return reveal;
}
