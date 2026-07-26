-- ─────────────────────────────────────────────────────────────
-- CrimInsight AI — Migration 0002: Chat (Ask AI)
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.conversations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null default 'New Chat',
  context_type  text not null default 'general'
                  check (context_type in ('general', 'document', 'theory', 'case')),
  context_id    uuid,
  created_at    timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Users manage their own conversations"
  on public.conversations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists conversations_user_id_idx
  on public.conversations(user_id, created_at desc);

create table if not exists public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- A message is only visible/writable if its parent conversation belongs
-- to the requesting user — chat_messages has no user_id column itself.
create policy "Users manage messages in their own conversations"
  on public.chat_messages for all
  using (
    exists (
      select 1 from public.conversations c
      where c.id = chat_messages.conversation_id
      and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = chat_messages.conversation_id
      and c.user_id = auth.uid()
    )
  );

create index if not exists chat_messages_conversation_id_idx
  on public.chat_messages(conversation_id, created_at asc);
