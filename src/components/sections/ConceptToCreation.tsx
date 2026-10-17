import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROJECTS } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { id: 'cad-enclosure', label: 'The concept', title: 'Give an idea\na shape.', detail: 'Start with the parts. Explore the fit. Make the thinking visible.', note: 'Electronics enclosure / CAD concept' },
  { id: 'twentyfour', label: 'The creation', title: 'Make it\nwork for people.', detail: 'From a shared idea to a camera in every guest’s pocket. This is TwentyFour.', note: 'TwentyFour / Mobile web application' },
  { id: 'media-mutya-bts', label: 'The connection', title: 'Find the story\nworth telling.', detail: 'Behind every system, a person. Behind every frame, a different perspective.', note: 'Mutya ng UMTC / Behind the scenes' },
].map((chapter) => ({ ...chapter, project: PROJECTS.find((project) => project.id === chapter.id)! }));

export function ConceptToCreation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current!;
      const scenes = gsap.utils.toArray<HTMLElement>('.cinema-scene', section);
      section.classList.add('cinema-enabled');
      gsap.set(scenes.slice(1), { autoAlpha: 0, yPercent: 8 });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
      scenes.forEach((scene, index) => {
        timeline.fromTo(scene.querySelector('img'), { scale: 1.08 }, { scale: 1, duration: 1.2 }, index * 1.5);
        if (index > 0) {
          const at = index * 1.5 - 0.3;
          timeline.to(scenes[index - 1]!, { autoAlpha: 0, yPercent: -8, duration: 0.3 }, at)
            .to(scene, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, at);
        }
      });
      timeline.fromTo('.cinema-progress', { scaleX: 0 }, { scaleX: 1, duration: timeline.duration() }, 0);
      return () => section.classList.remove('cinema-enabled');
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="concept-to-creation" className="cinema" aria-label="Concept to creation — a story in three chapters">
      <div className="cinema-stage">
        <div className="cinema-topline">
          <span>CONCEPT TO CREATION / A SELECTED PERSPECTIVE</span>
          <a href="#work" className="cinema-link">Explore the projects ↗</a>
        </div>
        <div className="cinema-scenes">
          {CHAPTERS.map((chapter, index) => (
            <article key={chapter.id} className="cinema-scene">
              <div className="cinema-copy">
                <p className="cinema-eyebrow">0{index + 1} / {chapter.label}</p>
                <h2>{chapter.title}</h2>
                <p className="cinema-detail">{chapter.detail}</p>
              </div>
              <figure className={`cinema-visual cinema-visual-${chapter.project.tag}`}>
                <div className="cinema-image">
                  <img src={chapter.project.coverImage} alt={chapter.project.imageCaptions?.[0] ?? chapter.project.title} width={1600} height={1000} loading="lazy" />
                </div>
                <figcaption>{chapter.note}<span>0{index + 1} / 03</span></figcaption>
              </figure>
            </article>
          ))}
        </div>
        <div className="cinema-bottomline"><span>DESIGN. BUILD. CONNECT.</span><span className="cinema-scroll-hint">SCROLL TO CHANGE THE SCENE ↓</span></div>
        <div className="cinema-track" aria-hidden="true"><div className="cinema-progress" /></div>
      </div>
    </section>
  );
}
