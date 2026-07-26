export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
