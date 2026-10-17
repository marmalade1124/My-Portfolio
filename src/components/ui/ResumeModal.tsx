import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ResumeModal({ isOpen, onClose, className }: ResumeModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('fixed inset-0 z-50 bg-white', className)}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Resume
            </span>
            <div className="flex items-center gap-4">
              <a
                href="/resume.pdf"
                download="Portfolio_Resume_OCT.pdf"
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Download size={12} />
                Download
              </a>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
                aria-label="Close resume viewer"
              >
                <X size={14} />
                Close
              </button>
            </div>
          </div>

          <div className="h-[calc(100dvh-57px)] overflow-auto bg-zinc-100 p-4 sm:p-8" tabIndex={0} aria-label="October portfolio resume pages">
            <div className="mx-auto max-w-6xl space-y-4">
              {Array.from({ length: 13 }, (_, index) => (
                <img
                  key={index}
                  src={`/resume-preview-${String(index + 1).padStart(2, '0')}.jpg`}
                  alt={`October portfolio resume — page ${index + 1} of 13`}
                  width={1800}
                  height={1013}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="block w-full h-auto bg-white shadow-sm"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
