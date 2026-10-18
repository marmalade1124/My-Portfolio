import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';

export const DOCUMENTS = {
  resume: { title: 'Resume', description: 'A two-page, text-based resume focused on CAD design, project experience, and education.', pages: 2, size: '123 KB', url: '/resume.pdf', filename: 'Raziel_Salamat_Resume.pdf', width: 612, height: 792 },
  portfolio: { title: 'Portfolio PDF', description: 'A landscape collection of engineering, software, and creative work, with dedicated TwentyFour and 3.14 pages.', pages: 15, size: '22.9 MB', url: '/portfolio.pdf', filename: 'Raziel_Salamat_Portfolio.pdf', width: 1920, height: 1080 },
} as const;
export type DocumentKind = keyof typeof DOCUMENTS;

function PagePreview({ kind, index }: { kind: DocumentKind; index: number }) {
  const [failed, setFailed] = useState(false);
  const item = DOCUMENTS[kind];
  return failed ? <p role="status" className="p-8 bg-white text-zinc-700">Page {index + 1} preview could not load. <a href={item.url} className="underline">Open the PDF instead ↗</a></p> : (
    <img src={`/${kind}-preview-${String(index + 1).padStart(2, '0')}.jpg`} alt={`${item.title} — page ${index + 1} of ${item.pages}`} width={item.width} height={item.height} loading={index === 0 ? 'eager' : 'lazy'} onError={() => setFailed(true)} className="block w-full h-auto bg-white shadow-sm" />
  );
}

export function ResumeModal({ document: kind, onClose }: { document: DocumentKind | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!kind) return;
    const opener = window.document.activeElement as HTMLElement | null;
    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex="0"]') ?? []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && window.document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && window.document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [kind, onClose]);
  if (!kind) return null;
  const item = DOCUMENTS[kind];
  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${item.title} viewer`} className="fixed inset-0 z-[100] bg-white flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 sm:px-6 py-4">
        <span className="font-display font-semibold">{item.title}</span>
        <div className="flex items-center gap-4">
          <a href={item.url} download={item.filename} className="flex items-center gap-2 text-sm py-2"><Download size={16} />Download</a>
          <button ref={closeRef} onClick={onClose} className="flex items-center gap-2 text-sm py-2" aria-label={`Close ${item.title.toLowerCase()} viewer`}><X size={18} />Close</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-zinc-100 p-4 sm:p-8" tabIndex={0} aria-label={`${item.title} pages`}>
        <div className={`mx-auto space-y-4 ${kind === 'resume' ? 'max-w-3xl' : 'max-w-6xl'}`}>
          {Array.from({ length: item.pages }, (_, index) => <PagePreview key={`${kind}-${index}`} kind={kind} index={index} />)}
        </div>
      </div>
    </div>, window.document.body,
  );
}
