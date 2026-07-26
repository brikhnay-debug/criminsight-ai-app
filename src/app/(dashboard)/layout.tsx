import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: middleware already redirects signed-out users away
  // from these routes, but we never trust that alone for protected data.
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single();

  return (
    <DashboardShell
      user={{
        email: user.email ?? '',
        fullName:
          profile?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? 'Student',
        plan: profile?.plan ?? 'free',
      }}
    >
      {children}
    </DashboardShell>
  );
}
