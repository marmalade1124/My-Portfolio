import { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ResumeModal } from '@/components/ui/ResumeModal';
import { GridContainer } from '@/components/layout/GridContainer';

export function ResumeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="resume" className="py-24 border-b border-zinc-200">
      <GridContainer>
        <SectionHeading number="05" title="Resume" />

        <div className="mt-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group w-full py-8 border-y border-zinc-200 flex items-center justify-between hover:bg-zinc-50 transition-colors focus:outline-none"
          >
            <span className="font-display text-xl md:text-3xl uppercase tracking-tight text-black group-hover:text-zinc-600 transition-colors">
              View & download my resume
            </span>
            <ArrowUpRight className="w-8 h-8 text-black group-hover:text-zinc-600 transition-colors" />
          </button>

          <div className="mt-4 flex justify-end">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-black transition-colors"
            >
              Or download directly <Download className="w-3 h-3" />
            </a>
          </div>
        </div>

        <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </GridContainer>
    </section>
  );
}
