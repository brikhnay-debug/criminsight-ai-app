import Link from 'next/link';
import type { Metadata } from 'next';
import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <div className="glass-panel animate-fade-in p-8">
      <h1 className="font-display text-2xl font-bold text-ink-primary">
        Forgot your password?
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <div className="mt-6">
        <ResetPasswordForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Remembered your password?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
