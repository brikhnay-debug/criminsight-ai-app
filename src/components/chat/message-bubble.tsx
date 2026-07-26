'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Check, Copy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TypingIndicator } from './typing-indicator';
import type { ChatMessage } from '@/types';

export function MessageBubble({
  message,
  isStreamingPlaceholder,
}: {
  message: ChatMessage;
  isStreamingPlaceholder?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const showTypingDots = isStreamingPlaceholder && message.content.length === 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in insecure contexts — fail silently,
      // the button simply won't show the "copied" confirmation.
    }
  };

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-slate-200 text-ink-secondary' : 'bg-gradient-primary text-white'
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          'group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:max-w-[75%]',
          isUser
            ? 'rounded-br-sm bg-gradient-primary text-white'
            : 'rounded-bl-sm border border-white/40 bg-white/70 text-ink-primary backdrop-blur-xl'
        )}
      >
        {showTypingDots ? (
          <TypingIndicator />
        ) : isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose-crim prose-sm break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}

        {!isUser && message.content.length > 0 && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy message'}
            className="absolute -bottom-3 right-2 rounded-lg border border-slate-200 bg-white p-1.5 text-ink-muted opacity-0 shadow-sm transition-opacity duration-250 hover:text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:opacity-100"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
