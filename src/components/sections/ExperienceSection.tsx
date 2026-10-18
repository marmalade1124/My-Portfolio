import { Fragment } from 'react';
import { EXPERIENCE } from '@/lib/data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Divider } from '@/components/ui/Divider';
import { GridContainer } from '@/components/layout/GridContainer';

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 border-b border-zinc-200">
      <GridContainer>
        <SectionHeading number="02" title="Experience" />

        <div className="mt-12 flex flex-col">
          {EXPERIENCE.map((exp, index) => (
            <Fragment key={exp.id}>
              <div className="py-10 flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:w-1/3 flex flex-col shrink-0">
                  <h3 className="text-lg font-display uppercase font-semibold text-black tracking-wide">
                    {exp.role}
                  </h3>
                  <span className="text-zinc-600 font-medium text-sm mt-1">{exp.company}</span>
                  <span className="font-mono text-xs text-zinc-600 mt-2 block md:hidden">
                    {exp.period}
                  </span>
                </div>

                <div className="md:w-2/3 flex flex-col">
                  <div className="hidden md:flex justify-end mb-4">
                    <span className="font-mono text-xs text-zinc-600">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {exp.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-base text-zinc-600 font-sans leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-zinc-400"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {index < EXPERIENCE.length - 1 && <Divider dashed />}
            </Fragment>
          ))}
        </div>
      </GridContainer>
    </section>
  );
}
