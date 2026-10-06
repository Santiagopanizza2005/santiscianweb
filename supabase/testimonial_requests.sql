-- Ejecutar en Supabase SQL Editor para habilitar el envío de testimonios.
create table if not exists public.testimonial_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 1 and 160),
  rating smallint not null check (rating between 1 and 5),
  description text not null check (char_length(description) between 1 and 2960),
  created_at timestamptz not null default now()
);

alter table public.testimonial_requests enable row level security;
revoke all on table public.testimonial_requests from anon, authenticated;
grant all on table public.testimonial_requests to service_role;
