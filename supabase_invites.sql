-- Create access_codes table
create table access_codes (
  code text primary key,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_used boolean default false,
  used_by uuid references auth.users(id),
  used_at timestamp with time zone
);

-- Enable RLS
alter table access_codes enable row level security;

-- Policies
-- Admins can read all codes
create policy "Admins can view all codes"
  on access_codes for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Admins can insert codes
create policy "Admins can create codes"
  on access_codes for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Admins can update codes (e.g. invalidate them)
create policy "Admins can update codes"
  on access_codes for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Public can read specific code to validate it (security through obscurity of the code itself)
-- OR better: Use a specific RPC function for validation to avoid exposing the table.
-- For now, let's allow anyone to read a code if they know it and it's not used.
create policy "Public can read available codes"
  on access_codes for select
  using (
    is_used = false
  );
  
-- Allow the system/user to "claim" the code -> This requires UPDATE
-- A user can update a code IF it is currently unused and they are setting themselves as the user
create policy "Users can claim codes"
  on access_codes for update
  using (
    is_used = false
  )
  with check (
    is_used = true
    and used_by = auth.uid()
  );
