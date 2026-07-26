import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'error' | 'success';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  const isError = variant === 'error';

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm backdrop-blur-sm',
        isError
          ? 'border-danger/30 bg-danger-light/70 text-red-800'
          : 'border-success/30 bg-success-light/70 text-green-800',
        className
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}
