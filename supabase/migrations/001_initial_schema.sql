-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clubs
create table clubs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique default substr(md5(random()::text), 0, 9),
  logo_url text,
  created_at timestamptz default now()
);

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  xp integer default 0,
  level integer generated always as (floor(sqrt(xp::float / 100))::integer) stored,
  ace_coins integer default 0,
  club_id uuid references clubs(id),
  birth_year integer,
  created_at timestamptz default now()
);

-- User roles
create table user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  role text check (role in ('admin', 'coach', 'player')) not null,
  club_id uuid references clubs(id),
  unique(user_id, role, club_id)
);

-- has_role function
create or replace function has_role(user_id uuid, check_role text)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from user_roles
    where user_roles.user_id = $1 and user_roles.role = $2
  );
$$;

-- Sessions
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  date timestamptz not null,
  coach_id uuid references profiles(id),
  club_id uuid references clubs(id),
  training_group_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- Attendance
create table session_attendance (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  player_id uuid references profiles(id),
  status text check (status in ('present', 'absent', 'late', 'excused')) default 'absent',
  marked_by uuid references profiles(id),
  marked_at timestamptz default now(),
  unique(session_id, player_id)
);

-- Evaluations (MDE)
create table evaluations (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  player_id uuid references profiles(id),
  coach_id uuid references profiles(id),
  motivation integer check (motivation between 1 and 5),
  development integer check (development between 1 and 5),
  engagement integer check (engagement between 1 and 5),
  notes text,
  created_at timestamptz default now(),
  unique(session_id, player_id)
);

-- Player skills
create table player_skills (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references profiles(id),
  coach_id uuid references profiles(id),
  forehand integer check (forehand between 1 and 10) default 5,
  backhand integer check (backhand between 1 and 10) default 5,
  serve integer check (serve between 1 and 10) default 5,
  volley integer check (volley between 1 and 10) default 5,
  footwork integer check (footwork between 1 and 10) default 5,
  fitness integer check (fitness between 1 and 10) default 5,
  assessed_at timestamptz default now(),
  unique(player_id, coach_id)
);

-- Skill goals
create table player_skill_goals (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references profiles(id),
  coach_id uuid references profiles(id),
  forehand_target integer,
  backhand_target integer,
  serve_target integer,
  volley_target integer,
  footwork_target integer,
  fitness_target integer,
  target_date date,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Training groups
create table training_groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  coach_id uuid references profiles(id),
  club_id uuid references clubs(id),
  day_of_week integer check (day_of_week between 0 and 6),
  start_time time,
  end_time time,
  max_players integer default 10,
  created_at timestamptz default now()
);

-- Group members
create table group_members (
  group_id uuid references training_groups(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  primary key (group_id, player_id)
);

-- Challenges
create table challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text check (type in ('daily', 'weekly', 'monthly', 'special')) default 'daily',
  category text check (category in ('attendance', 'skill', 'streak', 'social')) default 'skill',
  target_value integer default 1,
  xp_reward integer default 50,
  coin_reward integer default 10,
  icon text default 'target',
  active boolean default true,
  created_at timestamptz default now()
);

-- Player challenges
create table player_challenges (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references profiles(id),
  challenge_id uuid references challenges(id),
  current_value integer default 0,
  completed_at timestamptz,
  expires_at timestamptz,
  unique(player_id, challenge_id)
);

-- Badges
create table badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon text not null,
  color text default 'emerald',
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')) default 'common'
);

-- Player badges
create table player_badges (
  player_id uuid references profiles(id),
  badge_id uuid references badges(id),
  earned_at timestamptz default now(),
  primary key (player_id, badge_id)
);

-- Streaks
create table player_streaks (
  player_id uuid primary key references profiles(id),
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  streak_multiplier numeric(3,2) default 1.0
);

-- Leaderboard
create table leaderboard_entries (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references profiles(id),
  club_id uuid references clubs(id),
  period_type text check (period_type in ('weekly', 'monthly', 'alltime')),
  period_start date,
  xp_earned integer default 0,
  rank integer,
  updated_at timestamptz default now()
);

-- Pro Shop items
create table items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category text check (category in ('equipment', 'accessories', 'cosmetics')),
  price integer not null,
  icon text,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')) default 'common',
  active boolean default true
);

-- Player inventory
create table player_inventory (
  player_id uuid references profiles(id),
  item_id uuid references items(id),
  purchased_at timestamptz default now(),
  primary key (player_id, item_id)
);

-- H2H Challenges
create table h2h_challenges (
  id uuid primary key default uuid_generate_v4(),
  challenger_id uuid references profiles(id),
  opponent_id uuid references profiles(id),
  type text not null,
  stake_coins integer default 0,
  status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
  winner_id uuid references profiles(id),
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Messages
create table messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references profiles(id),
  recipient_id uuid references profiles(id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table clubs enable row level security;
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table sessions enable row level security;
alter table session_attendance enable row level security;
alter table evaluations enable row level security;
alter table player_skills enable row level security;
alter table player_skill_goals enable row level security;
alter table training_groups enable row level security;
alter table group_members enable row level security;
alter table challenges enable row level security;
alter table player_challenges enable row level security;
alter table badges enable row level security;
alter table player_badges enable row level security;
alter table player_streaks enable row level security;
alter table leaderboard_entries enable row level security;
alter table items enable row level security;
alter table player_inventory enable row level security;
alter table h2h_challenges enable row level security;
alter table messages enable row level security;
