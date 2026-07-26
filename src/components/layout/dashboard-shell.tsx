'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Menu, MessageSquare, X } from 'lucide-react';
import { logout } from '@/app/auth/actions';

interface DashboardUser {
  email: string;
  fullName: string;
  plan: string;
}

interface DashboardShellProps {
  user: DashboardUser;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'Ask AI', icon: MessageSquare },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/40 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/dashboard" className="font-display text-lg font-bold text-primary">
          CrimInsight AI
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-ink-primary hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="fixed hidden h-screen w-64 flex-col border-r border-white/40 bg-white/50 backdrop-blur-xl lg:flex">
          <SidebarContent user={user} />
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="absolute left-0 top-0 h-full w-72 border-r border-white/40 bg-white/90 backdrop-blur-xl animate-fade-in"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="min-h-screen w-full flex-1 px-4 py-8 lg:ml-64 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  user,
  onNavigate,
}: {
  user: DashboardUser;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <Link href="/dashboard" className="font-display text-xl font-bold text-primary">
          CrimInsight AI
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-primary-50 hover:text-primary"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/40 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-primary">{user.fullName}</p>
            <p className="truncate text-xs text-ink-secondary">{user.email}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
            {user.plan}
          </span>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-danger-light hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
