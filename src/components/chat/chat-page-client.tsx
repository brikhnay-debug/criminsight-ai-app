'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ConversationList } from './conversation-list';
import { ChatWindow } from './chat-window';

export function ChatPageClient() {
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-9rem)] gap-4 lg:h-[calc(100vh-6rem)]">
      <ConversationList className="hidden lg:flex" />

      {mobileHistoryOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setMobileHistoryOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute left-0 top-0 flex h-full w-72 animate-fade-in flex-col border-r border-white/40 bg-white/90 p-3 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Conversation history"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-ink-primary">History</span>
              <button
                type="button"
                onClick={() => setMobileHistoryOpen(false)}
                aria-label="Close history"
                className="rounded p-1 text-ink-secondary hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ConversationList
              className="h-full w-full flex-1"
              onNavigate={() => setMobileHistoryOpen(false)}
            />
          </div>
        </div>
      )}

      <ChatWindow className="min-w-0" onOpenHistory={() => setMobileHistoryOpen(true)} />
    </div>
  );
}
