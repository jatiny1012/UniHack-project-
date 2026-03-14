-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users / Households
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  suburb TEXT NOT NULL DEFAULT 'Footscray',
  postcode TEXT NOT NULL DEFAULT '3011',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  approximate_location TEXT,
  household_size INTEGER DEFAULT 1,
  languages TEXT[] DEFAULT '{"English"}',
  raw_capabilities_text TEXT,
  raw_needs_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Structured capabilities (parsed by NLP)
CREATE TABLE capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  detail TEXT
);

-- Structured needs (parsed by NLP)
CREATE TABLE needs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  detail TEXT,
  priority INTEGER DEFAULT 2
);

-- AI-generated resilience clusters
CREATE TABLE clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  suburb TEXT NOT NULL,
  resilience_score REAL DEFAULT 0,
  gaps JSONB DEFAULT '[]',
  explanation TEXT,
  status TEXT DEFAULT 'peace',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cluster membership
CREATE TABLE cluster_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_id UUID REFERENCES clusters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(cluster_id, user_id)
);

-- Crisis events
CREATE TABLE crisis_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'watch',
  affected_postcodes TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Check-ins during crisis
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  cluster_id UUID,
  crisis_event_id UUID REFERENCES crisis_events(id),
  status TEXT NOT NULL,
  message TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable realtime on checkins
ALTER PUBLICATION supabase_realtime ADD TABLE checkins;

-- Row Level Security (allow all for hackathon speed)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on capabilities" ON capabilities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on needs" ON needs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on clusters" ON clusters FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE cluster_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on cluster_members" ON cluster_members FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on crisis_events" ON crisis_events FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on checkins" ON checkins FOR ALL USING (true) WITH CHECK (true);
