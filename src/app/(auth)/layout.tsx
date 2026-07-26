import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      {/* Decorative branding panel — desktop only */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-primary p-12 text-white lg:flex">
        <div
          className="bg-blob left-[-15%] top-[-15%] h-80 w-80 bg-white/20"
          aria-hidden="true"
        />
        <div
          className="bg-blob bottom-[-20%] right-[-10%] h-96 w-96 bg-white/10"
          aria-hidden="true"
        />

        <Link href="/" className="relative z-10 font-display text-xl font-bold">
          CrimInsight AI
        </Link>

        <div className="relative z-10 max-w-sm">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Study criminology smarter, not harder.
          </h2>
          <p className="mt-4 text-white/80">
            AI-powered summaries, case analysis, and quizzes built for
            criminology students.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} CrimInsight AI
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-hero px-6 py-12">
        <div
          className="bg-blob left-[10%] top-[10%] h-72 w-72 bg-primary-light lg:hidden"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
