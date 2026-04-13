-- Seed data for ACECOURT demo

-- Insert sample clubs
insert into clubs (name, invite_code) values
  ('Aarhus Tennis Club', 'ATC2024'),
  ('Copenhagen Tennis Center', 'CTC2024'),
  ('Odense Racket Club', 'ORC2024');

-- Note: In a real scenario, users would be created through auth.users
-- These are placeholder profiles that would reference actual auth users
-- For demo purposes, you would need to create auth users first

-- Insert badges
insert into badges (name, description, icon, color, rarity) values
  ('First Session', 'Attended your first training session', 'Trophy', 'emerald', 'common'),
  ('10-Day Streak', 'Maintained a 10-day training streak', 'Flame', 'orange', 'rare'),
  ('MDE Master', 'Achieved outstanding MDE scores', 'Star', 'yellow', 'epic'),
  ('Ace Serve', 'Reached level 10 serve skill', 'Zap', 'blue', 'rare'),
  ('Club Champion', 'Top of the leaderboard', 'Crown', 'gold', 'legendary'),
  ('Century Club', 'Completed 100 sessions', 'Medal', 'emerald', 'epic'),
  ('Consistent Player', 'No absences in a month', 'Shield', 'blue', 'rare');

-- Insert challenges
insert into challenges (title, description, type, category, target_value, xp_reward, coin_reward, icon) values
  ('Daily Forehand', 'Hit 50 forehands in practice', 'daily', 'skill', 50, 100, 20, 'Target'),
  ('Weekly Warrior', 'Attend 3 sessions this week', 'weekly', 'attendance', 3, 250, 50, 'Calendar'),
  ('Level Up', 'Reach level 15', 'monthly', 'skill', 15, 1000, 200, 'Medal'),
  ('Consistency Streak', 'Maintain a 7-day streak', 'special', 'streak', 7, 500, 100, 'Flame');

-- Insert pro shop items
insert into items (name, description, category, price, icon, rarity) values
  ('Pro Tennis Racket', 'High-performance carbon fiber racket', 'equipment', 500, 'Zap', 'legendary'),
  ('Performance Grip', 'Enhanced grip tape for better control', 'accessories', 50, 'Hand', 'common'),
  ('Premium Tennis Shoes', 'Professional-grade tennis shoes', 'equipment', 300, 'Shoe', 'epic'),
  ('Golden Ace Avatar', 'Exclusive golden avatar border', 'cosmetics', 100, 'Sparkles', 'epic'),
  ('Tennis Balls (12-pack)', 'Official tournament balls', 'equipment', 80, 'Circle', 'common'),
  ('Wristband Set', 'Stylish performance wristbands', 'accessories', 40, 'Zap', 'common'),
  ('Vibrant Court Backdrop', 'Exclusive profile background', 'cosmetics', 75, 'Image', 'rare'),
  ('Champion Jersey', 'Limited edition jersey', 'equipment', 150, 'Shirt', 'rare');
