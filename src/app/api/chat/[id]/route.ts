import { createClient } from '@/lib/supabase/server';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('id, title')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (conversationError || !conversation) {
    return json({ error: 'Conversation not found.' }, 404);
  }

  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Failed to load messages:', messagesError);
    return json({ error: 'Could not load this conversation.' }, 500);
  }

  return json({ conversation, messages: messages ?? [] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to delete conversation:', error);
    return json({ error: 'Could not delete this conversation.' }, 500);
  }

  return json({ success: true });
}
