import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CopyEmailProps {
  email: string;
  className?: string;
}

export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      <a
        href={`mailto:${email}`}
        className="break-all font-display text-2xl md:text-3xl font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
      >
        {email}
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 border border-zinc-200 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
        aria-label={copied ? 'Copied' : 'Copy email'}
      >
        {copied ? (
          <>
            <Check size={12} />
            Copied
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
