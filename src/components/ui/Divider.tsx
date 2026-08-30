import { cn } from '@/lib/cn';

interface DividerProps {
  className?: string;
  dashed?: boolean;
}

export function Divider({ className, dashed = false }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-0 border-b border-zinc-200',
        dashed && 'border-dashed',
        className
      )}
    />
  );
}
