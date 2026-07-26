import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'CrimInsight AI — Study Smarter with AI',
    template: '%s | CrimInsight AI',
  },
  description:
    'An AI-powered study assistant for criminology students. Summarize research, analyze case studies, generate quizzes, and master criminology theories faster.',
  keywords: [
    'criminology',
    'AI study assistant',
    'criminology theories',
    'case study analysis',
    'study tools for students',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    title: 'CrimInsight AI — Study Smarter with AI',
    description:
      'An AI-powered study assistant for criminology students.',
    siteName: 'CrimInsight AI',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-surface font-sans text-ink-primary">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
