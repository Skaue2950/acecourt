-- Create club_invitations table
create table club_invitations (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid not null references clubs(id) on delete cascade,
  email text not null,
  role text not null check (role in ('coach', 'player')),
  invited_by uuid not null references profiles(id) on delete cascade,
  token text unique default substr(md5(random()::text || clock_timestamp()::text), 0, 33),
  accepted_at timestamptz,
  expires_at timestamptz default now() + interval '7 days',
  created_at timestamptz default now(),
  unique(club_id, email)
);

-- Enable RLS
alter table club_invitations enable row level security;

-- Admins can manage invitations
create policy club_invitations_admin
  on club_invitations for all
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
      and club_id = club_invitations.club_id
    )
  );

-- Users can view invitations sent to them
create policy club_invitations_select_own
  on club_invitations for select
  using (email = (select email from auth.users where id = auth.uid()));

-- Create trigger function for auto-join on signup
create or replace function handle_invitation_signup()
returns trigger language plpgsql security definer as $$
declare
  inv record;
begin
  -- Check if there's a pending invitation for this email
  select * into inv from club_invitations
  where email = new.email and accepted_at is null and expires_at > now()
  limit 1;

  if found then
    -- Create profile with club
    insert into profiles (id, full_name, club_id, xp, level, ace_coins)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      inv.club_id,
      0,
      1,
      0
    )
    on conflict (id) do update set club_id = inv.club_id;

    -- Assign role
    insert into user_roles (user_id, role, club_id)
    values (new.id, inv.role, inv.club_id)
    on conflict do nothing;

    -- Mark invitation as accepted
    update club_invitations set accepted_at = now() where id = inv.id;
  else
    -- Regular signup - create profile without club
    insert into profiles (id, full_name, xp, level, ace_coins)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      0,
      1,
      0
    )
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

-- Create trigger for auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_invitation_signup();
