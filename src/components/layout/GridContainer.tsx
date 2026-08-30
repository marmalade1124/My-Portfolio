import { cn } from '@/lib/cn';
import { forwardRef, type ReactNode } from 'react';

interface GridContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'nav';
}

export const GridContainer = forwardRef<HTMLElement, GridContainerProps>(
  ({ children, className, as: Component = 'div' }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn('mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16', className)}
      >
        {children}
      </Component>
    );
  }
);

GridContainer.displayName = 'GridContainer';
