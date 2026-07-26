'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd forward to an error-tracking
    // service (e.g. Sentry) — logged here so it's never silently lost.
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero px-6">
      <div
        className="bg-blob left-[-10%] top-[-10%] h-96 w-96 bg-primary-light"
        aria-hidden="true"
      />
      <div
        className="bg-blob bottom-[-10%] right-[-10%] h-96 w-96 bg-primary"
        aria-hidden="true"
      />

      <div className="glass-panel relative z-10 max-w-md p-8 text-center animate-fade-in">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-light text-danger"
          aria-hidden="true"
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-ink-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          An unexpected error occurred. You can try again, or head back to the
          dashboard.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => reset()}>
            Try again
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-primary px-5 text-sm font-medium text-white shadow-glass-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
