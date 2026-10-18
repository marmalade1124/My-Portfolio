import { useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ResumeModal, DOCUMENTS, type DocumentKind } from '@/components/ui/ResumeModal';
import { GridContainer } from '@/components/layout/GridContainer';

export function ResumeSection() {
  const [document, setDocument] = useState<DocumentKind | null>(null);
  return (
    <section id="resume" className="py-24 border-b border-zinc-200">
      <GridContainer>
        <SectionHeading number="05" title="Resume & Portfolio" />
        <p className="mt-6 text-base text-zinc-600 max-w-2xl leading-relaxed">Choose a concise overview of my CAD experience or explore the visual portfolio, including TwentyFour and PiColor 3.14. Currently studying Computer Engineering; expected graduation 2027.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(Object.keys(DOCUMENTS) as DocumentKind[]).map((kind) => {
            const item = DOCUMENTS[kind];
            return (
              <div key={kind} className="border border-zinc-300 p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-base text-zinc-600 leading-relaxed">{item.description}</p>
                <p className="mt-4 font-mono text-xs text-zinc-600">PDF · {item.pages} pages · {item.size}</p>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <button onClick={() => setDocument(kind)} className="portfolio-action portfolio-action-primary">View {item.title.toLowerCase()} <ArrowUpRight size={16} /></button>
                  <a href={item.url} download={item.filename} className="inline-flex items-center gap-2 py-3 text-sm underline underline-offset-4"><Download size={16} />Download {item.title.toLowerCase()}</a>
                </div>
              </div>
            );
          })}
        </div>
      </GridContainer>
      <ResumeModal document={document} onClose={() => setDocument(null)} />
    </section>
  );
}
