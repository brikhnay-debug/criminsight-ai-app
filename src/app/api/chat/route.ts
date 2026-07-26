import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGeminiModel } from '@/lib/gemini/client';
import { SYSTEM_PROMPT } from '@/lib/gemini/prompts';
import { chatMessageSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to list conversations:', error);
    return json({ error: 'Could not load your conversations.' }, 500);
  }

  return json({ conversations: data ?? [] });
}

export async function POST(request: NextRequest) {
  let supabase;
  let userId: string;

  try {
    supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return json({ error: 'Unauthorized' }, 401);
    }
    userId = user.id;
  } catch (err) {
    console.error('Auth check failed:', err);
    return json({ error: 'Could not verify your session. Please log in again.' }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid message.' },
      400
    );
  }

  const { message } = parsed.data;
  let conversationId: string;

  // Resolve an existing conversation (verifying ownership) or create one.
  if (parsed.data.conversationId) {
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', parsed.data.conversationId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existing) {
      return json({ error: 'That conversation could not be found.' }, 404);
    }
    conversationId = parsed.data.conversationId;
  } else {
    const title = message.length > 48 ? `${message.slice(0, 48)}…` : message;
    const { data: created, error: createError } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title, context_type: 'general' })
      .select('id')
      .single();

    if (createError || !created) {
      console.error('Failed to create conversation:', createError);
      return json({ error: 'Could not start a new conversation.' }, 500);
    }
    conversationId = created.id as string;
  }

  // Load recent history for context (oldest first).
  const { data: history, error: historyError } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20);

  if (historyError) {
    console.error('Failed to load history:', historyError);
    return json({ error: 'Could not load conversation history.' }, 500);
  }

  // Persist the user's message before calling the model.
  const { error: insertUserError } = await supabase.from('chat_messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: message,
  });

  if (insertUserError) {
    console.error('Failed to save user message:', insertUserError);
    return json({ error: 'Could not save your message.' }, 500);
  }

  // Kick off the Gemini streaming request.
  let geminiStream: AsyncIterable<{ text: () => string }>;
  try {
    const model = getGeminiModel(SYSTEM_PROMPT);
    const chat = model.startChat({
      history: (history ?? []).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessageStream(message);
    geminiStream = result.stream;
  } catch (err) {
    console.error('Gemini request failed:', err);
    return json(
      {
        error:
          'The AI assistant is temporarily unavailable. Please try again in a moment.',
      },
      502
    );
  }

  const encoder = new TextEncoder();
  let fullText = '';
  const conversationIdForClosure = conversationId;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text();
          if (text) {
            fullText += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        if (fullText.trim().length > 0) {
          const { error: insertAssistantError } = await supabase
            .from('chat_messages')
            .insert({
              conversation_id: conversationIdForClosure,
              role: 'assistant',
              content: fullText,
            });
          if (insertAssistantError) {
            console.error('Failed to save assistant message:', insertAssistantError);
          }
        }
      } catch (err) {
        console.error('Streaming error:', err);
        const fallback =
          '\n\n_[The response was interrupted. Please try asking again.]_';
        controller.enqueue(encoder.encode(fallback));

        if (fullText.trim().length > 0) {
          await supabase
            .from('chat_messages')
            .insert({
              conversation_id: conversationIdForClosure,
              role: 'assistant',
              content: fullText + fallback,
            })
            .then(
              () => {},
              () => {}
            );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Conversation-Id': conversationId,
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
