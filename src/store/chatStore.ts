import { create } from 'zustand';
import type { ChatMessage, ConversationSummary } from '@/types';

interface ChatState {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isStreaming: boolean;
  error: string | null;

  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  startNewChat: () => void;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isStreaming: false,
  error: null,

  clearError: () => set({ error: null }),

  loadConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await fetch('/api/chat');
      if (!res.ok) throw new Error('Failed to load conversations');
      const data = (await res.json()) as { conversations: ConversationSummary[] };
      set({ conversations: data.conversations, isLoadingConversations: false });
    } catch {
      set({
        isLoadingConversations: false,
        error: 'Could not load your past conversations.',
      });
    }
  },

  selectConversation: async (id: string) => {
    set({ isLoadingMessages: true, activeConversationId: id, error: null });
    try {
      const res = await fetch(`/api/chat/${id}`);
      if (!res.ok) throw new Error('Failed to load conversation');
      const data = (await res.json()) as {
        messages: { id: string; role: 'user' | 'assistant'; content: string }[];
      };
      set({
        messages: data.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
        isLoadingMessages: false,
      });
    } catch {
      set({ isLoadingMessages: false, error: 'Could not load that conversation.' });
    }
  },

  startNewChat: () => {
    set({ activeConversationId: null, messages: [], error: null });
  },

  deleteConversation: async (id: string) => {
    const previousConversations = get().conversations;
    const wasActive = get().activeConversationId === id;

    set({ conversations: previousConversations.filter((c) => c.id !== id) });
    if (wasActive) {
      set({ activeConversationId: null, messages: [] });
    }

    try {
      const res = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete conversation');
    } catch {
      // Roll back on failure.
      set({
        conversations: previousConversations,
        error: 'Could not delete that conversation. Please try again.',
      });
    }
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().isStreaming) return;

    const userMessage: ChatMessage = {
      id: `local-user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    const assistantMessageId = `local-assistant-${Date.now()}`;

    set((state) => ({
      messages: [
        ...state.messages,
        userMessage,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ],
      isStreaming: true,
      error: null,
    }));

    try {
      const activeConversationId = get().activeConversationId;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationId: activeConversationId ?? undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error ?? 'The assistant could not respond. Please try again.'
        );
      }

      const newConversationId = res.headers.get('X-Conversation-Id');
      const isNewConversation = !activeConversationId && !!newConversationId;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === assistantMessageId ? { ...m, content: accumulated } : m
          ),
        }));
      }

      set({ isStreaming: false });

      if (isNewConversation && newConversationId) {
        set({ activeConversationId: newConversationId });
        get().loadConversations();
      }
    } catch (err) {
      set((state) => ({
        isStreaming: false,
        error:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
        // Drop the empty assistant placeholder if nothing streamed back.
        messages: state.messages.filter(
          (m) => m.id !== assistantMessageId || m.content.length > 0
        ),
      }));
    }
  },
}));
