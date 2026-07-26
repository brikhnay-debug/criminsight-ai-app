import Link from 'next/link';
import type { Metadata } from 'next';
import { LoginForm } from './login-form';
import { Alert } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Log In',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string; reset?: string };
}) {
  return (
    <div className="glass-panel animate-fade-in p-8">
      <h1 className="font-display text-2xl font-bold text-ink-primary">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Log in to continue studying with CrimInsight AI.
      </p>

      {searchParams.reset === 'success' && (
        <div className="mt-4">
          <Alert variant="success">
            Your password has been updated. Log in with your new password.
          </Alert>
        </div>
      )}

      <div className="mt-6">
        <LoginForm redirectTo={searchParams.redirectTo} callbackError={searchParams.error} />
      </div>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
