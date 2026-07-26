import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name as string | undefined;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-ink-primary">
        Welcome back{fullName ? `, ${fullName}` : ''} 👋
      </h1>
      <p className="mt-1 text-ink-secondary">
        You&apos;re securely logged in. Study tools (Ask AI, Research
        Summary, Quiz Generator, and more) will appear here as we build
        them out in the steps that follow.
      </p>

      <div className="glass-panel mt-6 p-6">
        <h2 className="font-display text-lg font-semibold text-ink-primary">Account</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <dt className="text-ink-secondary">Email</dt>
            <dd className="font-medium text-ink-primary">{user?.email}</dd>
          </div>
          <div className="flex justify-between pt-2">
            <dt className="text-ink-secondary">User ID</dt>
            <dd className="font-mono text-xs text-ink-muted">{user?.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
