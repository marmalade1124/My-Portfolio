import { useEffect, useCallback } from 'react';
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

  return (
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
                download
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

          {/* Resume content */}
          <div className="flex items-center justify-center h-[calc(100vh-57px)] overflow-auto p-8">
            <img
              src="/resume.pdf"
              alt="Resume - Raziel Salamat"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'flex flex-col items-center gap-4 text-zinc-400';
                fallback.innerHTML = '<span class="font-mono text-sm">Resume file not found</span><span class="font-mono text-xs">Drop resume.pdf into /public/</span>';
                target.parentNode?.appendChild(fallback);
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
