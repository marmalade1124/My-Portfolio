import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { PERSONAL } from '@/lib/data';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const salamatRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftAccentRef = useRef<HTMLDivElement>(null);
  const rightAccentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        titleRef.current,
        { yPercent: 20, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0 }
      )
        .fromTo(
          salamatRef.current,
          { x: -15, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8 },
          '-=0.7'
        )
        .fromTo(
          portraitRef.current,
          { y: 35, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
          '-=0.8'
        )
        .fromTo(
          [leftAccentRef.current, rightAccentRef.current, statusRef.current],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          '-=0.5'
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-[95vh] bg-transparent border-b border-zinc-200 flex flex-col justify-between pt-6 pb-8 overflow-visible select-none"
    >
      {/* Top Status Bar (Layer z-30) */}
      <div
        ref={statusRef}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between z-30"
      >
        <StatusBadge status={PERSONAL.status} />
        <div className="font-mono text-xs text-zinc-400 hidden sm:flex items-center gap-2">
          <span>{PERSONAL.location}</span>
          <span>·</span>
          <span>{PERSONAL.timezone}</span>
        </div>
      </div>

      {/* Center Editorial Poster Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 my-auto flex items-center justify-center min-h-[580px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[820px] overflow-visible"
      >
        {/* Layer 1: Giant RAZIEL & SALAMAT in Montserrat Typography (Z-2) */}
        <div className="absolute top-2 sm:top-4 md:top-6 left-0 right-0 w-full z-[2] pointer-events-none">
          <div className="w-full flex flex-col items-start px-2 sm:px-6 md:px-8">
            {/* RAZIEL: Bold Geometric Montserrat */}
            <h1
              ref={titleRef}
              className="w-full font-['Montserrat',sans-serif] font-extrabold uppercase leading-[0.80] text-black flex justify-between items-center tracking-[-0.03em] text-[21vw] sm:text-[19vw] md:text-[18vw] lg:text-[16vw]"
            >
              <span>R</span>
              <span>A</span>
              <span>Z</span>
              <span>I</span>
              <span>E</span>
              <span>L</span>
            </h1>

            {/* SALAMAT: Clean Geometric Montserrat flush under R/A */}
            <div
              ref={salamatRef}
              className="mt-0.5 sm:mt-1 md:mt-1.5 pl-2 sm:pl-4 md:pl-6 font-['Montserrat',sans-serif] font-normal uppercase tracking-[0.08em] text-black text-2xl sm:text-4xl md:text-5xl lg:text-[3.8rem] leading-tight"
            >
              SALAMAT
            </div>
          </div>
        </div>

        {/* Layer 2: Cutout Portrait Seated in Center (Z-10 — Sits between Back SVG at Z-5 and Front SVG at Z-15) */}
        <div
          ref={portraitRef}
          className="relative z-10 w-[94%] sm:w-[82%] md:w-[72%] lg:w-[64%] xl:w-[60%] max-w-[760px] mt-8 sm:mt-4 pointer-events-none flex items-center justify-center"
        >
          <img
            src="/portrait.png"
            alt="Raziel Salamat"
            className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.08)]"
            fetchPriority="high"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Layer 3: Left Accent — "Concept to Creation" (Z-20) */}
        <div
          ref={leftAccentRef}
          className="absolute top-[48%] sm:top-[50%] md:top-[52%] -translate-y-1/2 left-2 sm:left-6 md:left-10 lg:left-12 z-20"
        >
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.6rem] font-normal text-black tracking-tight leading-[0.94]">
              Concept
            </span>
            <span className="font-serif text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.6rem] font-normal text-black tracking-tight leading-[0.94] pl-0.5">
              to Creation
            </span>
          </div>
        </div>

        {/* Layer 4: Right Accent — Equal Width Matched "COMPUTER ENGINEER" (Z-20) */}
        <div
          ref={rightAccentRef}
          className="absolute bottom-6 sm:bottom-12 md:bottom-16 right-2 sm:right-6 md:right-10 lg:right-12 z-20"
        >
          <div className="inline-flex flex-col items-start w-fit">
            <h2 className="w-full font-['Plus_Jakarta_Sans','Metropolis',sans-serif] text-[0.95rem] sm:text-[1.1rem] md:text-[1.22rem] lg:text-[1.32rem] font-extrabold uppercase tracking-[0.04em] text-black leading-tight flex justify-between">
              <span>C</span><span>O</span><span>M</span><span>P</span><span>U</span><span>T</span><span>E</span><span>R</span><span>&nbsp;</span><span>E</span><span>N</span><span>G</span><span>I</span><span>N</span><span>E</span><span>E</span><span>R</span>
            </h2>
            <p className="w-full font-['Plus_Jakarta_Sans','Metropolis',sans-serif] text-[0.72rem] sm:text-[0.82rem] md:text-[0.9rem] lg:text-[0.98rem] text-zinc-800 font-normal mt-0.5 whitespace-nowrap leading-tight text-left">
              Full Stack Software - CAD Designer
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Subtle Scroll Indicator */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between text-[11px] font-mono text-zinc-400 z-10">
        <span>[001] — HERO INDEX</span>
        <span className="animate-pulse">SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
}
