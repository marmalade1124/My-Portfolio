import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { GridContainer } from './GridContainer';
import { PERSONAL, NAV_LINKS } from '@/lib/data';
import { cn } from '@/lib/cn';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll position to trigger transition between top banner and sidebar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for sidebar indicator
  useEffect(() => {
    const sectionIds = ['hero', 'work', 'experience', 'education', 'skills', 'resume', 'contact'];
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isSectionActive = (href: string) => {
    const target = href.replace('#', '');
    return activeSection === target;
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER BANNER (Visible at very top, fades on scroll) */}
      {/* ========================================================= */}
      <motion.header
        initial={false}
        animate={
          scrolled
            ? { y: -50, opacity: 0, pointerEvents: 'none' }
            : { y: 0, opacity: 1, pointerEvents: 'auto' }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 bg-transparent border-b border-zinc-200/40 hidden md:block"
      >
        <GridContainer className="flex items-center justify-between py-4">
          {/* Logo / Name */}
          <a
            href="#"
            className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-black hover:text-zinc-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Raziel Salamat
          </a>

          {/* Desktop Top Nav */}
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 hover:text-black transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </GridContainer>
      </motion.header>

      {/* Mobile Sticky Navbar */}
      <div
        className={cn(
          'md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-3 flex items-center justify-between',
          scrolled
            ? 'bg-[#faf9f6]/90 backdrop-blur-md border-b border-zinc-200 shadow-xs'
            : 'bg-transparent'
        )}
      >
        <a
          href="#"
          className="font-display text-xs font-bold uppercase tracking-[0.12em] text-black"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {scrolled ? 'RS' : 'Raziel Salamat'}
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 top-0 bg-[#faf9f6] z-50 flex flex-col justify-between p-8"
          >
            <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
              <span className="font-['Space_Grotesk',sans-serif] text-2xl font-bold tracking-tight">RS</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-black cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col items-start gap-6 my-auto">
              {NAV_LINKS.map((link, idx) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex flex-col items-start gap-0.5 text-left cursor-pointer group"
                >
                  <span className="font-mono text-[10px] text-zinc-400 font-medium">
                    ({String(idx + 1).padStart(2, '0')})
                  </span>
                  <span className="font-display text-2xl font-bold uppercase tracking-tight text-black group-hover:text-zinc-600 transition-colors">
                    {link.label}
                  </span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-6 pt-6 border-t border-zinc-200">
              <a
                href={PERSONAL.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider text-black flex items-center gap-2"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider text-black flex items-center gap-2"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. FLOATING LEFT SIDEBAR (Slides in when scrolled down)   */}
      {/* ========================================================= */}
      <motion.aside
        initial={false}
        animate={
          scrolled
            ? { x: 0, opacity: 1, pointerEvents: 'auto' }
            : { x: -100, opacity: 0, pointerEvents: 'none' }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col justify-between items-center w-20 lg:w-24 py-6 border-r border-zinc-200 bg-[#faf9f6]/92 backdrop-blur-md select-none shadow-xs"
      >
        {/* Top: Monogram RS */}
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          animate={scrolled ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="group flex flex-col items-center cursor-pointer"
          title="Back to Top"
        >
          <span className="font-['Space_Grotesk',sans-serif] text-2xl lg:text-3xl font-bold tracking-tight text-black group-hover:text-zinc-600 transition-colors">
            RS
          </span>
        </motion.a>

        {/* Middle: Numbered Navigation Links matching Top Banner */}
        <nav className="flex flex-col items-center gap-5 my-auto">
          {NAV_LINKS.map((link, idx) => {
            const active = isSectionActive(link.href);
            const num = String(idx + 1).padStart(2, '0');

            return (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                animate={scrolled ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ duration: 0.35, delay: 0.08 + idx * 0.04 }}
                className="group flex flex-col items-center cursor-pointer text-center relative"
              >
                <span className="font-mono text-[9px] text-zinc-400 font-medium tracking-widest block transition-colors group-hover:text-black">
                  {num}
                </span>
                <span
                  className={cn(
                    'font-mono text-[10px] lg:text-[11px] font-bold uppercase tracking-wider transition-colors mt-0.5',
                    active ? 'text-black font-extrabold' : 'text-zinc-500 group-hover:text-black'
                  )}
                >
                  {link.label}
                </span>

                {/* Active Indicator Underline */}
                <div
                  className={cn(
                    'h-[2px] w-5 mt-1 transition-all duration-300',
                    active
                      ? 'bg-black opacity-100 scale-x-100'
                      : 'bg-transparent opacity-0 scale-x-0 group-hover:bg-zinc-300 group-hover:opacity-100 group-hover:scale-x-75'
                  )}
                />
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Section: Vertical Name + Social Icons */}
        <div className="flex flex-col items-center gap-4">
          {/* Vertical Rotated Name */}
          <div className="py-2 flex items-center justify-center">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-400 whitespace-nowrap select-none"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Raziel Salamat
            </span>
          </div>

          {/* Social Icons (GitHub & LinkedIn only, NO Dribbble) */}
          <div className="flex flex-col items-center gap-3 pt-2 border-t border-zinc-200/80 w-full">
            <a
              href={PERSONAL.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-black hover:text-zinc-500 transition-colors"
              title="GitHub"
              aria-label="GitHub Profile"
            >
              <Github size={16} />
            </a>
            <a
              href={PERSONAL.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-black hover:text-zinc-500 transition-colors"
              title="LinkedIn"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
