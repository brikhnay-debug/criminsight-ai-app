import type { Metadata } from 'next';
import { UpdatePasswordForm } from './update-password-form';

export const metadata: Metadata = {
  title: 'Set New Password',
};

export default function UpdatePasswordPage() {
  return (
    <div className="glass-panel animate-fade-in p-8">
      <h1 className="font-display text-2xl font-bold text-ink-primary">
        Set a new password
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Choose a new password for your account.
      </p>

      <div className="mt-6">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
