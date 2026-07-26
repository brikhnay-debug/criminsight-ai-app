import type { Metadata } from 'next';
import { ChatPageClient } from '@/components/chat/chat-page-client';

export const metadata: Metadata = {
  title: 'Ask AI',
};

export default function ChatPage() {
  return <ChatPageClient />;
}
