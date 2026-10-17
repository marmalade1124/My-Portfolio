import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function useSectionReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const headings = containerRef.current!.querySelectorAll('section:not(#hero):not(#concept-to-creation):not(#contact) h2');
        headings.forEach((heading) => {
          gsap.fromTo(heading, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
          });
        });
      });
      return () => media.revert();
    },
    { scope: containerRef }
  );
}
