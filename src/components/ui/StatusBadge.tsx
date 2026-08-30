import { cn } from '@/lib/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-900 opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-900" />
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        {status}
      </span>
    </div>
  );
}
