'use client';

import { useEffect } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';

export function ConversationList({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const {
    conversations,
    activeConversationId,
    isLoadingConversations,
    loadConversations,
    selectConversation,
    startNewChat,
    deleteConversation,
  } = useChatStore();

  useEffect(() => {
    loadConversations();
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'glass-panel flex w-72 shrink-0 flex-col overflow-hidden p-3',
        className
      )}
    >
      <button
        type="button"
        onClick={() => {
          startNewChat();
          onNavigate?.();
        }}
        className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-white shadow-glass-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Chat
      </button>

      <div className="flex-1 space-y-1 overflow-y-auto" aria-label="Past conversations">
        {isLoadingConversations && (
          <div className="space-y-2 px-1" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-200/60" />
            ))}
          </div>
        )}

        {!isLoadingConversations && conversations.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-ink-secondary">
            No conversations yet. Ask your first question!
          </p>
        )}

        {!isLoadingConversations &&
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                'group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors',
                activeConversationId === conversation.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-ink-secondary hover:bg-primary-50 hover:text-primary'
              )}
            >
              <button
                type="button"
                onClick={() => {
                  selectConversation(conversation.id);
                  onNavigate?.();
                }}
                aria-current={
                  activeConversationId === conversation.id ? 'page' : undefined
                }
                className="flex flex-1 items-center gap-2 truncate text-left focus-visible:outline-none"
              >
                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{conversation.title}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteConversation(conversation.id)}
                aria-label={`Delete conversation: ${conversation.title}`}
                className="shrink-0 rounded p-1 opacity-0 hover:bg-danger-light hover:text-danger focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
