-- Enable RLS on all tables
alter table profiles enable row level security;
alter table clubs enable row level security;
alter table user_roles enable row level security;
alter table sessions enable row level security;
alter table session_attendance enable row level security;
alter table evaluations enable row level security;
alter table player_skills enable row level security;
alter table challenges enable row level security;
alter table player_challenges enable row level security;
alter table leaderboard_entries enable row level security;
alter table items enable row level security;
alter table player_inventory enable row level security;

-- ===== Profiles RLS =====
-- Users can read own profile
create policy profiles_select_own
  on profiles for select
  using (auth.uid() = id);

-- Coaches and admins can read club members
create policy profiles_select_club_members
  on profiles for select
  using (
    exists (
      select 1 from user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.club_id = profiles.club_id
      and user_roles.role in ('coach', 'admin')
    )
  );

-- Users can update own profile
create policy profiles_update_own
  on profiles for update
  using (auth.uid() = id);

-- ===== Clubs RLS =====
-- Club members can read their own club
create policy clubs_select_members
  on clubs for select
  using (
    exists (
      select 1 from profiles
      where profiles.club_id = clubs.id
      and profiles.id = auth.uid()
    )
  );

-- ===== User Roles RLS =====
-- Users can read own roles
create policy user_roles_select_own
  on user_roles for select
  using (user_id = auth.uid());

-- Admins can read/manage roles in their club
create policy user_roles_manage_club
  on user_roles for all
  using (
    exists (
      select 1 from user_roles ur
      where ur.user_id = auth.uid()
      and ur.role = 'admin'
      and ur.club_id = user_roles.club_id
    )
  );

-- ===== Sessions RLS =====
-- Coaches can read/update sessions they created
create policy sessions_coach_own
  on sessions for all
  using (coach_id = auth.uid());

-- Club members can read sessions in their club
create policy sessions_select_club
  on sessions for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.club_id = sessions.club_id
    )
  );

-- ===== Session Attendance RLS =====
-- Coaches can manage attendance in their sessions
create policy session_attendance_coach
  on session_attendance for all
  using (
    exists (
      select 1 from sessions
      where sessions.id = session_attendance.session_id
      and sessions.coach_id = auth.uid()
    )
  );

-- Players can read own attendance
create policy session_attendance_select_own
  on session_attendance for select
  using (player_id = auth.uid());

-- ===== Evaluations RLS =====
-- Coaches can manage evaluations they created
create policy evaluations_coach
  on evaluations for all
  using (coach_id = auth.uid());

-- Players can read own evaluations
create policy evaluations_select_own
  on evaluations for select
  using (player_id = auth.uid());

-- ===== Player Skills RLS =====
-- Players can read own skills
create policy player_skills_select_own
  on player_skills for select
  using (player_id = auth.uid());

-- Coaches can create/update skills for players in their club
create policy player_skills_coach
  on player_skills for all
  using (
    exists (
      select 1 from profiles p
      where p.id = player_id
      and p.club_id = (
        select club_id from profiles
        where id = auth.uid()
        and exists (
          select 1 from user_roles
          where user_id = auth.uid()
          and role = 'coach'
        )
      )
    )
  );

-- ===== Challenges RLS =====
-- All authenticated users can read challenges
create policy challenges_select_all
  on challenges for select
  using (auth.role() = 'authenticated');

-- ===== Player Challenges RLS =====
-- Players can read/update own challenges
create policy player_challenges_own
  on player_challenges for all
  using (player_id = auth.uid());

-- Coaches can update player challenges
create policy player_challenges_coach
  on player_challenges for update
  using (
    exists (
      select 1 from profiles p
      where p.id = player_id
      and p.club_id = (
        select club_id from profiles
        where id = auth.uid()
        and exists (
          select 1 from user_roles
          where user_id = auth.uid()
          and role = 'coach'
        )
      )
    )
  );

-- ===== Leaderboard RLS =====
-- Club members can read leaderboard
create policy leaderboard_select_club
  on leaderboard_entries for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.club_id = leaderboard_entries.club_id
    )
  );

-- ===== Items (Pro Shop) RLS =====
-- All authenticated can read items
create policy items_select_all
  on items for select
  using (auth.role() = 'authenticated');

-- ===== Player Inventory RLS =====
-- Players can read own inventory
create policy player_inventory_select_own
  on player_inventory for select
  using (player_id = auth.uid());

-- System can insert purchases
create policy player_inventory_insert
  on player_inventory for insert
  with check (auth.uid() = player_id);
