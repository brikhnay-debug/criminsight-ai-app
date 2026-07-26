export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-1 py-1.5"
      role="status"
      aria-label="CrimInsight AI is typing"
    >
      <span
        className="h-2 w-2 animate-pulse-dot rounded-full bg-primary"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-2 w-2 animate-pulse-dot rounded-full bg-primary"
        style={{ animationDelay: '200ms' }}
      />
      <span
        className="h-2 w-2 animate-pulse-dot rounded-full bg-primary"
        style={{ animationDelay: '400ms' }}
      />
    </div>
  );
}
