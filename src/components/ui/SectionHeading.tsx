import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  number: string;
  title: string;
  className?: string;
}

export function SectionHeading({ number, title, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex items-baseline gap-4 pb-6 border-b border-zinc-200', className)}>
      <span className="font-mono text-xs text-zinc-400">({number})</span>
      <h2 className="font-display text-xs uppercase tracking-[0.12em] font-medium text-zinc-900">
        {title}
      </h2>
    </div>
  );
}
