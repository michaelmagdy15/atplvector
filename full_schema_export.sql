-- ATPL Vector Full Schema Export
-- Generated for project migration

-- Enable Extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  status text check (status in ('ANONYMOUS', 'SIGNED_UP', 'PENDING_APPROVAL', 'FREE_TRIAL', 'TRIAL_EXPIRED', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'BANNED', 'DEMO_PREVIEW', 'DEMO_EXPIRED')),
  is_approved boolean default false,
  is_admin boolean default false,
  study_seconds bigint default 0,
  demo_start_date timestamptz,
  trial_start_date timestamptz,
  trial_subjects text[] default array['090', '040'],
  created_at timestamptz default now()
);

-- 2. Subscriptions Table
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan text,
  status text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 3. Flashcards Table
create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  subject_id text,
  front text,
  back text,
  created_at timestamptz default now()
);

-- 4. Access Codes Table
create table if not exists public.access_codes (
  code text primary key,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now() not null,
  is_used boolean default false,
  used_by_user uuid references auth.users(id),
  used_at timestamptz
);

-- 5. Testimonials Table
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  user_name text,
  user_role text,
  text text,
  rating integer check (rating >= 1 and rating <= 5),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- === Row Level Security (RLS) ===

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.flashcards enable row level security;
alter table public.access_codes enable row level security;
alter table public.testimonials enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can update all profiles" on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Subscriptions Policies
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Admins can manage all subscriptions" on public.subscriptions for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Flashcards Policies
create policy "Users can manage own flashcards" on public.flashcards for all using (auth.uid() = user_id);

-- Access Codes Policies
create policy "Admins can view all codes" on public.access_codes for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can create codes" on public.access_codes for insert with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can update codes" on public.access_codes for update using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Public can read available codes" on public.access_codes for select using (is_used = false);
create policy "Users can claim codes" on public.access_codes for update using (is_used = false) with check (is_used = true and used_by_user = auth.uid());

-- Testimonials Policies
create policy "Testimonials are viewable by everyone when approved" on public.testimonials for select using (status = 'approved');
create policy "Users can insert testimonials" on public.testimonials for insert with check (auth.uid() = user_id);
create policy "Admins can manage all testimonials" on public.testimonials for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- === Automated Profile Creation Trigger ===
-- Creates a profile entry whenever a new user signs up

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, status)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'SIGNED_UP');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
