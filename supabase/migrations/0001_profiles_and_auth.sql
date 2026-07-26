-- ─────────────────────────────────────────────────────────────
-- CrimInsight AI — Migration 0001: Profiles & Auth
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- ─────────────────────────────────────────────────────────────

-- Profiles table extends auth.users with app-specific fields.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  university    text,
  study_level   text check (study_level in ('undergrad', 'masters', 'phd')),
  plan          text not null default 'free' check (plan in ('free', 'pro')),
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No insert/delete policy for regular users — profile rows are created
-- exclusively by the trigger below (security definer) and deleted via
-- the "on delete cascade" from auth.users.

-- ─────────────────────────────────────────────────────────────
-- Auto-create a profile row whenever a new auth user is created.
-- full_name and study_level come from the signUp() options.data
-- payload set in src/app/auth/actions.ts.
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, study_level)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'study_level'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
