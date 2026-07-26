import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
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
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary"
          aria-hidden="true"
        >
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">404</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-primary px-5 text-sm font-medium text-white shadow-glass-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
