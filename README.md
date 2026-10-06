# Santiscianweb

Sitio público de Santi Scian. **Repositorio separado** del panel admin (`santiwebadmin`).

## Stack

- Next.js 16 (App Router)
- React 19
- Supabase (para el formulario de contacto)

## Variables de entorno

```
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_PUBLISHABLE_KEY=
```

> No se usa `BOOTSTRAP_ACCESS_TOKEN` acá. Eso es solo del admin.

## Scripts

```bash
npm install
npm run dev      # dev server en http://localhost:3000
npm run build
npm run start
```

## Deploy

Conectar el repo a Vercel, cargar las env vars y asignar `santiscian.com`.

> El panel admin vive en otro repo (`santiwebadmin`) y se sirve en otro subdominio (`romayodin.santiscian.com`). Comparten la misma base de datos de Supabase.
