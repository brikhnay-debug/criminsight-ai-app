export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero px-6">
      <div
        className="bg-blob left-[-10%] top-[-10%] h-96 w-96 bg-primary-light"
        aria-hidden="true"
      />
      <div
        className="bg-blob bottom-[-10%] right-[-10%] h-96 w-96 bg-primary"
        aria-hidden="true"
      />

      <div className="glass-panel relative z-10 max-w-lg px-8 py-10 text-center animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-ink-primary">
          CrimInsight AI
        </h1>
        <p className="mt-3 text-ink-secondary">
          Project scaffold complete. The full landing page, authentication,
          and dashboard experience are built in the steps that follow.
        </p>
      </div>
    </main>
  );
}
