'use client';

import { useEffect, useRef } from 'react';
import { History, Sparkles } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'Explain Routine Activity Theory in simple terms',
  'Summarize the key ideas of Strain Theory',
  'Generate 5 quiz questions on Social Disorganization Theory',
  'Draft interview questions for a juvenile offender case study',
];

export function ChatWindow({
  className,
  onOpenHistory,
}: {
  className?: string;
  onOpenHistory?: () => void;
}) {
  const { messages, isStreaming, isLoadingMessages, error, sendMessage, clearError } =
    useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className={cn('glass-panel flex flex-1 flex-col overflow-hidden', className)}>
      {/* Mobile header with history toggle */}
      <div className="flex items-center justify-between border-b border-white/40 px-4 py-3 lg:hidden">
        <span className="font-display text-sm font-semibold text-ink-primary">Ask AI</span>
        <button
          type="button"
          onClick={onOpenHistory}
          aria-label="View past conversations"
          className="rounded-lg p-2 text-ink-secondary hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <History className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Message log */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with CrimInsight AI"
        className="flex-1 space-y-5 overflow-y-auto px-4 py-6 lg:px-6"
      >
        {isLoadingMessages && (
          <div className="space-y-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        )}

        {!isLoadingMessages && messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white"
              aria-hidden="true"
            >
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-semibold text-ink-primary">
              Ask your AI study assistant anything
            </h2>
            <p className="mt-1 max-w-sm text-sm text-ink-secondary">
              Explain a theory, analyze a case study, summarize a paper, generate
              interview questions, or build a quiz — just ask.
            </p>
            <div className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-xl border border-white/50 bg-white/60 px-3 py-2.5 text-left text-xs text-ink-secondary transition-colors hover:border-primary/30 hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isLoadingMessages &&
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreamingPlaceholder={
                isStreaming && index === messages.length - 1 && message.role === 'assistant'
              }
            />
          ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-white/40 p-3 lg:p-4">
        {error && (
          <div className="mb-2 flex items-start gap-2">
            <div className="flex-1">
              <Alert variant="error">{error}</Alert>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="mt-1 shrink-0 text-xs font-medium text-ink-muted hover:text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Dismiss
            </button>
          </div>
        )}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
        <p className="mt-2 text-center text-xs text-ink-muted">
          CrimInsight AI can make mistakes. Verify important facts and citations.
        </p>
      </div>
    </div>
  );
}
