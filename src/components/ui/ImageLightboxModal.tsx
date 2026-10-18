import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Maximize2, Play } from 'lucide-react';
import { type Project } from '@/lib/data';

interface ImageLightboxModalProps {
  sharedImageId?: string;
  project: Project | null;
  currentImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (index: number) => void;
}

export function ImageLightboxModal({
  sharedImageId,
  project,
  currentImageIndex,
  isOpen,
  onClose,
  onSelectImage,
}: ImageLightboxModalProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const images = project?.images || (project?.coverImage ? [project.coverImage] : []);
  const captions = project?.imageCaptions || [];
  const currentImage = images[currentImageIndex] || '';
  const currentCaption = captions[currentImageIndex] || project?.title || '';

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    onSelectImage((currentImageIndex + 1) % images.length);
  }, [images.length, currentImageIndex, onSelectImage]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    onSelectImage((currentImageIndex - 1 + images.length) % images.length);
  }, [images.length, currentImageIndex, onSelectImage]);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLButtonElement>('[aria-label="Close modal"]')?.focus({ preventScroll: true });
    return () => opener?.focus({ preventScroll: true });
  }, [isOpen]);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <motion.div layoutRoot ref={dialogRef} role="dialog" aria-modal="true" aria-label={project.title + ' gallery'} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="relative z-10 w-full max-w-6xl max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden"
          >
            {/* Modal Top Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800 bg-black/60 text-white">
              <div className="flex min-w-0 w-full sm:w-auto sm:flex-1 items-center gap-3 font-mono text-xs">
                <span className="px-2 py-0.5 bg-white text-black font-semibold uppercase tracking-wider">
                  ({project.num})
                </span>
                <span className="min-w-0 truncate font-['Montserrat',sans-serif] font-bold text-sm uppercase tracking-tight">
                  {project.title}
                </span>
                <span className="hidden sm:inline text-zinc-500">/</span>
                <span className="hidden sm:inline text-zinc-400 uppercase tracking-widest text-[11px]">
                  {project.category}
                </span>
              </div>

              <div className="flex w-full sm:w-auto shrink-0 items-center justify-between sm:justify-start gap-3">
                {images.length > 1 && (
                  <span className="font-mono text-xs text-zinc-400 tracking-wider">
                    {String(currentImageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </span>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider bg-zinc-900 hover:bg-white hover:text-black text-white border border-zinc-700 transition-colors"
                  >
                    <span>{project.liveLabel ?? 'Live Demo'}</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider bg-zinc-900 hover:bg-white hover:text-black text-white border border-zinc-700 transition-colors"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Watch Stream</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 min-h-[320px] max-h-[68vh] bg-zinc-950/80 flex items-center justify-center p-4 sm:p-8 overflow-hidden group">
              <motion.img
                key={currentImage}
                layoutId={!reduceMotion && currentImageIndex === 0 ? sharedImageId : undefined}
                initial={{ opacity: sharedImageId ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', duration: reduceMotion ? 0 : 0.5, bounce: 0 }}
                src={currentImage}
                alt={currentCaption}
                className="max-h-[62vh] max-w-full object-contain shadow-2xl border border-zinc-800/80"
              />

              {/* Prev/Next Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-white hover:text-black text-white border border-zinc-700 backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-white hover:text-black text-white border border-zinc-700 backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Bar: Caption & Thumbnails */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-3.5 border-t border-zinc-800 bg-zinc-900/90 text-zinc-300">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Maximize2 size={13} className="text-zinc-500 shrink-0" />
                <span className="text-zinc-400 font-medium">{currentCaption}</span>
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex items-center gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => onSelectImage(idx)}
                      className={`relative w-12 h-8 border overflow-hidden transition-all cursor-pointer ${
                        idx === currentImageIndex
                          ? 'border-white scale-105 shadow-md ring-1 ring-white'
                          : 'border-zinc-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
