-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- contacts table
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  email text,
  linkedin text,
  company text,
  company_domain text,
  role text,
  tags text[] default '{}',
  company_industry text,
  company_country text,
  company_description text,
  company_logo_url text,
  created_at timestamptz default now()
);

-- interactions table
create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  contact_id uuid references contacts(id) on delete cascade,
  date date not null,
  type text not null,
  notes text,
  next_steps text,
  created_at timestamptz default now()
);

-- quick_notes table
create table if not exists quick_notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  text text not null,
  contact_id uuid references contacts(id) on delete set null,
  created_at timestamptz default now()
);
