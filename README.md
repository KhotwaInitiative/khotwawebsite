# Khotwa Next.js App

This app uses Supabase only for registration data and CV uploads.

## Environment

Create `.env` in `khotwa-next/`:

```dotenv
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_KEY="<publishable-anon-key>"
SUPABASE_SECRET_KEY="<service-role-secret-key>"
```

## Supabase Setup

1. Create storage bucket: `cv-uploads` (public).
2. Run:

```bash
npm run setup:supabase
```

3. Copy SQL output and execute it in Supabase SQL Editor.

## Run

```bash
npm install
npm run dev
```

## Notes

- API route: `app/api/register/route.ts`
- Storage bucket: `cv_uploads`
- Table: `public.registrations`
- Server uses `SUPABASE_SECRET_KEY`; keep it private.
