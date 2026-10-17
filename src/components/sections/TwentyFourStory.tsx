import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GridContainer } from '@/components/layout/GridContainer';
import { PROJECTS } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const project = PROJECTS.find((item) => item.id === 'twentyfour')!;
const STEPS = [
  { title: 'Capture the moment.', text: 'A QR invitation. A camera in your browser. A limited roll that makes every shot count.', image: project.images![1], alt: 'TwentyFour public demo camera with a sample wedding scene' },
  { title: 'Enjoy the anticipation.', text: 'Put the phone down. The photos stay sealed until the event’s scheduled reveal.', image: project.images![2], alt: 'TwentyFour demo roll showing the album reveal countdown' },
  { title: 'Relive it together.', text: 'After the reveal, everyone’s perspectives come together in one shared album.' },
];

export function TwentyFourStory() {
  const sectionRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const frames = gsap.utils.toArray<HTMLElement>('.product-frame', sectionRef.current!);
      frames.forEach((frame) => {
        gsap.from(frame.querySelector('.product-screen'), {
          y: 40, opacity: 0, rotation: -2, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="twentyfour-story" className="product-story" aria-labelledby="twentyfour-title">
      <GridContainer>
        <div className="product-heading">
          <div><p className="cinema-eyebrow">A closer look / TwentyFour</p><h2 id="twentyfour-title">A little camera.<br /><em>A shared story.</em></h2></div>
          <p>From the first shot to the final reveal.<br />A walkthrough of the guest experience.</p>
        </div>
        <p className="product-scroll-hint">Swipe or scroll to follow the story →</p>
        <div className="product-frames" role="region" aria-label="TwentyFour guest experience, three steps" tabIndex={0}>
          {STEPS.map((step, index) => (
            <figure key={step.title} className="product-frame">
              <div className="product-screen">
                {step.image ? <img src={step.image} alt={step.alt} width={390} height={844} loading="lazy" /> : (
                  <div className="product-album">
                    <span className="product-album-label">THE WAIT IS OVER</span>
                    <div className="product-prints" aria-hidden="true">
                      <img src="/projects/twentyfour-sample-party.jpg" alt="" width={300} height={400} loading="lazy" />
                      <img src="/projects/twentyfour-sample-wedding.jpg" alt="" width={300} height={400} loading="lazy" />
                    </div>
                    <p>Every perspective.<br /><em>One shared album.</em></p>
                    <span className="product-album-label">SHARED ALBUM / FLOW ILLUSTRATION</span>
                  </div>
                )}
              </div>
              <figcaption>
                <span className="product-step">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="product-footnote"><p>Camera and countdown: actual demo screens. Album: sample imagery illustrating the reveal.</p><a className="cinema-link" href={`${project.liveUrl}demo`} target="_blank" rel="noopener noreferrer">Try TwentyFour ↗</a></div>
      </GridContainer>
    </section>
  );
}
