import { Fragment } from 'react';
import { EDUCATION, LEADERSHIP } from '@/lib/data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Divider } from '@/components/ui/Divider';
import { GridContainer } from '@/components/layout/GridContainer';

export function EducationSection() {
  return (
    <section id="education" className="py-24 border-b border-zinc-200">
      <GridContainer>
        <SectionHeading number="03" title="Education & Leadership" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Education Column */}
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-6">
              [ ACADEMIC DEGREES ]
            </h3>

            <div className="flex flex-col">
              {EDUCATION.map((edu, index) => (
                <Fragment key={edu.id}>
                  <div className="py-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                      <h4 className="text-base md:text-lg font-display uppercase font-semibold text-black tracking-tight">
                        {edu.degree}
                      </h4>
                      <span className="font-mono text-xs text-zinc-600 sm:max-w-[160px] sm:text-right">
                        {edu.period}
                      </span>
                    </div>
                    <span className="text-zinc-600 text-sm font-medium mt-1">
                      {edu.school}
                    </span>
                    {edu.details && (
                      <p className="text-sm text-zinc-600 font-sans mt-2 leading-relaxed">
                        {edu.details}
                      </p>
                    )}
                  </div>
                  {index < EDUCATION.length - 1 && <Divider dashed />}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Leadership & Activities Column */}
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-6">
              [ LEADERSHIP & ROLES ]
            </h3>

            <div className="flex flex-col">
              {LEADERSHIP.map((lead, index) => (
                <Fragment key={lead.id}>
                  <div className="py-6 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
                      <h4 className="text-base md:text-lg font-display uppercase font-semibold text-black tracking-tight">
                        {lead.role}
                      </h4>
                      <span className="font-mono text-xs text-zinc-600 sm:max-w-[160px] sm:text-right">
                        {lead.period}
                      </span>
                    </div>
                    <span className="text-zinc-600 text-sm font-medium mt-1">
                      {lead.org}
                    </span>
                    {lead.details && (
                      <p className="text-sm text-zinc-600 font-sans mt-2 leading-relaxed">
                        {lead.details}
                      </p>
                    )}
                  </div>
                  {index < LEADERSHIP.length - 1 && <Divider dashed />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </GridContainer>
    </section>
  );
}
