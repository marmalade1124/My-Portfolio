import { SKILLS } from '@/lib/data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GridContainer } from '@/components/layout/GridContainer';

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 border-b border-zinc-200">
      <GridContainer>
        <SectionHeading number="04" title="Skills & Tools" />

        <div className="mt-12 flex flex-col border-t border-zinc-200">
          {SKILLS.map((category) => (
            <div key={category.label} className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8 border-b border-zinc-200">
              <div className="lg:col-span-3 flex items-start">
                <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mt-2">
                  {category.label}
                </h3>
              </div>

              <div className="lg:col-span-9 flex flex-wrap gap-3">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="border border-zinc-200 text-black text-sm px-3 py-1 font-mono hover:bg-zinc-50 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GridContainer>
    </section>
  );
}
