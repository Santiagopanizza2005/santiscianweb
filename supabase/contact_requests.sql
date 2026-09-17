-- Ejecutá este archivo completo en Supabase: SQL Editor > New query.
-- Las solicitudes se escriben únicamente desde la ruta segura de esta web.

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  company text not null check (char_length(company) between 1 and 160),
  budget text not null check (budget in ('1000-2500', '2500-4000', '4000-6000', '6000-10000', '10000-20000', '20000+')),
  contact_method text not null check (contact_method in ('email', 'whatsapp')),
  contact_value text not null check (char_length(contact_value) between 1 and 160),
  message text not null check (char_length(message) between 1 and 3000),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'won', 'discarded')),
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

create index if not exists contact_requests_status_created_at_idx
  on public.contact_requests (status, created_at desc);

-- Nadie puede leer ni insertar desde el navegador. La clave secreta usada por
-- el endpoint del servidor omite RLS y nunca se envía al cliente.
alter table public.contact_requests enable row level security;

revoke all on table public.contact_requests from anon, authenticated;
grant all on table public.contact_requests to service_role;
