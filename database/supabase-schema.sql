-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_plan TEXT DEFAULT 'free',
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Citations table
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  citation_number TEXT NOT NULL,
  journal TEXT NOT NULL,
  year TEXT,
  court TEXT,
  court_name TEXT,
  category TEXT,
  content TEXT,
  full_content TEXT,
  keywords TEXT[],
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active citations"
  ON public.citations FOR SELECT
  USING (status = 'active');

-- Indexes for search
CREATE INDEX citations_title_idx ON public.citations USING GIN(to_tsvector('english', title));
CREATE INDEX citations_content_idx ON public.citations USING GIN(to_tsvector('english', content));
CREATE INDEX citations_citation_number_idx ON public.citations(citation_number);
CREATE INDEX citations_journal_idx ON public.citations(journal);
CREATE INDEX citations_year_idx ON public.citations(year);

-- Statutes table
CREATE TABLE public.statutes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT,
  category TEXT,
  year TEXT,
  content TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.statutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active statutes"
  ON public.statutes FOR SELECT
  USING (status = 'active');

-- Search logs
CREATE TABLE public.search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  search_query TEXT,
  results_count INTEGER,
  searched_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- AI Chat history
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  citations TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_citations_updated_at
  BEFORE UPDATE ON public.citations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
