create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- Personal Information
  name_ar text not null,
  name_en text not null,
  birthdate date not null,
  gender text not null,
  email text not null,
  phone_number text not null,
  -- Academic Information
  university text not null,
  major text not null,
  uni_id text not null,
  graduation_year text not null,
  linkedin text not null,
  -- Concerns & Preferences
  interests text not null,
  skills_projects text not null,
  experience_volunteer text not null,
  free_space text,
  cv_path text not null,
  cv_url text not null,
  -- Company & Job Preferences (serialized as "1-item\n2-item\n3-item")
  companies_order text not null,
  job_titles_order text not null,
  constraint registrations_uni_id_unique unique (uni_id)
);

alter table public.registrations enable row level security;

create policy "Allow service role full access"
on public.registrations
as permissive
for all
to service_role
using (true)
with check (true);
