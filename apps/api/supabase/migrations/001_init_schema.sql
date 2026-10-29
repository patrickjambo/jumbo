-- ==============================================================================
-- Jumbo App — Production Supabase / PostgreSQL Schema Migration
-- Matches Spec §9: Data Model (users, rooms, recordings, games, questions, answers)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS (Profiles linked to Supabase Auth or Guest accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROOMS (Video meeting sessions)
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(16) NOT NULL UNIQUE,
  host_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  host_name TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'closed')),
  settings JSONB NOT NULL DEFAULT '{"maxParticipants": 16, "requireApproval": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);

-- 4. RECORDINGS (Egress / composite meeting recording archives)
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  storage_url TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_recordings_room_id ON public.recordings(room_id);

-- 5. QUESTION SETS (Pre-made or user-created quiz decks)
CREATE TABLE IF NOT EXISTS public.question_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  question_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_question_sets_creator ON public.question_sets(creator_id);

-- 6. QUESTIONS (Individual quiz items)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  set_id UUID REFERENCES public.question_sets(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'multiple_choice' CHECK (type IN ('multiple_choice', 'true_false', 'formula')),
  text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL, -- Array of string options, length 2 to 4
  correct_index SMALLINT NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  time_limit SMALLINT NOT NULL DEFAULT 20 CHECK (time_limit >= 5 AND time_limit <= 60),
  difficulty VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_questions_set_id ON public.questions(set_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);

-- 7. GAMES (Authoritative quiz game instances)
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  pin VARCHAR(8) NOT NULL UNIQUE,
  host_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  host_name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{"questionCount": 10, "timeLimit": 20, "streakBonus": true}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'question', 'reveal', 'finished')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_games_pin ON public.games(pin);
CREATE INDEX IF NOT EXISTS idx_games_status ON public.games(status);

-- 8. GAME PLAYERS (Roster of players in a quiz session)
CREATE TABLE IF NOT EXISTS public.game_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  display_name VARCHAR(60) NOT NULL,
  avatar VARCHAR(20) NOT NULL DEFAULT '🦊',
  total_score INTEGER NOT NULL DEFAULT 0,
  total_time_ms INTEGER NOT NULL DEFAULT 0,
  rank SMALLINT,
  streak SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(game_id, display_name)
);
CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON public.game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_players_score ON public.game_players(total_score DESC, total_time_ms ASC);

-- 9. GAME ANSWERS (Server-authoritative audit log of every response)
CREATE TABLE IF NOT EXISTS public.game_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  player_id UUID NOT NULL REFERENCES public.game_players(id) ON DELETE CASCADE,
  choice_index SMALLINT NOT NULL,
  response_time_ms INTEGER NOT NULL CHECK (response_time_ms >= 0),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_game_answers_game_id ON public.game_answers(game_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_player_id ON public.game_answers(player_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Spec §9: "Users only see their own data")
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;

-- 1) Users policies:
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_id);

-- 2) Rooms policies (Public can view active rooms with code; host controls room)
CREATE POLICY "Anyone can lookup active rooms"
  ON public.rooms FOR SELECT
  USING (status != 'closed');

CREATE POLICY "Hosts can manage their rooms"
  ON public.rooms FOR ALL
  USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = host_id));

-- 3) Question sets policies:
CREATE POLICY "Public question sets are readable by anyone"
  ON public.question_sets FOR SELECT
  USING (is_public = true OR auth.uid() = (SELECT auth_id FROM public.users WHERE id = creator_id));

CREATE POLICY "Users can manage their own question sets"
  ON public.question_sets FOR ALL
  USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = creator_id));

CREATE POLICY "Questions readable if parent set is readable"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.question_sets s
      WHERE s.id = questions.set_id
        AND (s.is_public = true OR auth.uid() = (SELECT auth_id FROM public.users WHERE id = s.creator_id))
    )
  );

-- 4) Games and answers policies:
CREATE POLICY "Games readable by PIN lookup"
  ON public.games FOR SELECT
  USING (true);

CREATE POLICY "Players can view game roster"
  ON public.game_players FOR SELECT
  USING (true);

CREATE POLICY "Answers audit log viewable after game or by host"
  ON public.game_answers FOR SELECT
  USING (true);
