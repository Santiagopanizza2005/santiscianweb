-- Ejecutar una vez en el SQL Editor de Supabase.
-- Antes del primer registro definí BOOTSTRAP_ACCESS_TOKEN en el entorno de la app.
create table if not exists public.access_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (char_length(token_hash) = 64),
  role text not null default 'member' check (role in ('admin', 'member')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  used_by uuid unique references auth.users(id) on delete set null,
  check ((used_at is null and used_by is null) or (used_at is not null and used_by is not null))
);
create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  access_token_id uuid unique references public.access_tokens(id) on delete set null,
  email text not null unique,
  role text not null default 'member' check (role in ('admin', 'member')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now()
);
create index if not exists app_users_status_created_at_idx on public.app_users (status, created_at desc);
alter table public.access_tokens enable row level security;
alter table public.app_users enable row level security;
revoke all on table public.access_tokens from anon, authenticated;
revoke all on table public.app_users from anon, authenticated;
