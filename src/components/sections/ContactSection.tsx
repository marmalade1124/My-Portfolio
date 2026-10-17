import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CopyEmail } from '@/components/ui/CopyEmail';
import { GridContainer } from '@/components/layout/GridContainer';
import { PERSONAL } from '@/lib/data';

const SOCIAL_LINKS = [
  { name: 'GitHub', url: PERSONAL.socials.github },
  { name: 'LinkedIn', url: PERSONAL.socials.linkedin },
] as const;

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.contact-title-line > span', {
        yPercent: 110, duration: 0.85, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-title', start: 'top 90%', once: true },
      });
      gsap.from('.contact-signature', {
        y: 20, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-signature', start: 'top 95%', once: true },
      });
    });
    return () => media.revert();
  }, { scope: sectionRef });
  return (
    <section ref={sectionRef} id="contact" className="contact-finale py-24">
      <GridContainer>
        <SectionHeading number="06" title="Contact" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="contact-title" aria-label="Let’s make something real.">
              <span className="contact-title-line" aria-hidden="true"><span>Let’s make</span></span>
              <span className="contact-title-line" aria-hidden="true"><span><em>something real.</em></span></span>
            </h2>
            <p className="font-sans text-sm text-zinc-600 max-w-md mb-8 leading-relaxed">
              Currently open for new opportunities. Whether you have a question or just want to connect, feel free to reach out.
            </p>

            <CopyEmail email={PERSONAL.email} />
          </div>

          <div className="flex flex-col items-start lg:items-end justify-end gap-4 mt-12 lg:mt-0">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2 block">
              Socials
            </span>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-black hover:text-zinc-500 transition-colors border-b border-transparent hover:border-zinc-300 pb-0.5"
              >
                {social.name} <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
        <div className="contact-signature" aria-hidden="true"><span>RAZIEL</span><span>SALAMAT / CONCEPT TO CREATION</span></div>
      </GridContainer>
    </section>
  );
}
