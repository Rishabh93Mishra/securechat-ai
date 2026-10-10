-- SecureChat AI production database
create table if not exists public.documents (
  id text primary key,
  name text not null,
  content text not null,
  "ownerId" text not null,
  "isPublic" boolean not null default false,
  "createdAt" timestamptz not null default now()
);

alter table public.documents enable row level security;
