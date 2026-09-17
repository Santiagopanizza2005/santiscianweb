-- Ejecutá este archivo una vez en Supabase: SQL Editor > New query.
-- Agrega clasificación a las solicitudes que ya existen.

alter table public.contact_requests
  add column if not exists status text not null default 'new';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_requests_status_check'
      and conrelid = 'public.contact_requests'::regclass
  ) then
    alter table public.contact_requests
      add constraint contact_requests_status_check
      check (status in ('new', 'contacted', 'qualified', 'won', 'discarded'));
  end if;
end $$;

create index if not exists contact_requests_status_created_at_idx
  on public.contact_requests (status, created_at desc);
