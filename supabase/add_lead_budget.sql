-- Ejecutá este archivo una vez en Supabase: SQL Editor > New query.
-- Agrega una columna de presupuesto y conserva los datos de los leads existentes.

alter table public.contact_requests
  add column if not exists budget text;

-- Mueve el presupuesto de los mensajes que se guardaron antes de crear esta columna.
update public.contact_requests
set
  budget = coalesce(
    budget,
    nullif(substring(message from 'Presupuesto estimado: ([^\\n]+)'), ''),
    'No indicado'
  ),
  message = regexp_replace(message, '^Presupuesto estimado: [^\\n]+\\n\\n?', '');

update public.contact_requests
set budget = 'No indicado'
where budget is null or btrim(budget) = '';

alter table public.contact_requests
  alter column budget set default 'No indicado',
  alter column budget set not null;

