-- AI Studio MVP: per-user cloud projects and reusable story assets.
-- Review and apply only in the intended Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.studio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  project_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_projects enable row level security;

create policy "Users can read their own studio projects"
  on public.studio_projects for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own studio projects"
  on public.studio_projects for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own studio projects"
  on public.studio_projects for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own studio projects"
  on public.studio_projects for delete to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists studio_projects_user_updated_idx
  on public.studio_projects (user_id, updated_at desc);

-- Cloud sync/Auth UI is not yet wired in the MVP frontend.
-- Never add a Supabase service_role or secret key to the client bundle.
