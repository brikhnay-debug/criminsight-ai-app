import Link from 'next/link';
import type { Metadata } from 'next';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignupPage() {
  return (
    <div className="glass-panel animate-fade-in p-8">
      <h1 className="font-display text-2xl font-bold text-ink-primary">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Start studying criminology with AI, free.
      </p>

      <div className="mt-6">
        <SignupForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
