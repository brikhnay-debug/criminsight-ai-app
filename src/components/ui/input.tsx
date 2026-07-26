import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          'h-11 w-full rounded-xl border bg-white/70 px-4 text-sm text-ink-primary placeholder:text-ink-muted backdrop-blur-sm transition-colors duration-250',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          error ? 'border-danger' : 'border-slate-200',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
