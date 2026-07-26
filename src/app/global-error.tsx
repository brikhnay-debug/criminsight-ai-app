'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, sans-serif',
            padding: 24,
            textAlign: 'center',
            background: '#F8FAFC',
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#475569', marginBottom: 20 }}>
              A critical error occurred while loading CrimInsight AI. Please
              try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                background: '#2563EB',
                color: 'white',
                padding: '10px 22px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
