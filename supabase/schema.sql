-- K-POP Formation Viewer Database Schema

-- Artists table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#808080',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  youtube_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Formation data table (container for formations)
CREATE TABLE formation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  contributor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Formations table
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_data_id UUID NOT NULL REFERENCES formation_data(id) ON DELETE CASCADE,
  time REAL NOT NULL,
  name TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Positions table
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  x REAL NOT NULL,
  y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_members_artist_id ON members(artist_id);
CREATE INDEX idx_videos_artist_id ON videos(artist_id);
CREATE INDEX idx_formation_data_video_id ON formation_data(video_id);
CREATE INDEX idx_formations_formation_data_id ON formations(formation_data_id);
CREATE INDEX idx_formations_time ON formations(time);
CREATE INDEX idx_positions_formation_id ON positions(formation_id);
CREATE INDEX idx_positions_member_id ON positions(member_id);

-- Enable Row Level Security (RLS) - for now, allow all reads
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access
CREATE POLICY "Allow public read" ON artists FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON formation_data FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON formations FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON positions FOR SELECT USING (true);

-- Policies: Allow public insert (for Phase 2 - anonymous submissions)
CREATE POLICY "Allow public insert" ON artists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON formation_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON formations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON positions FOR INSERT WITH CHECK (true);

-- Policies: Allow public update
CREATE POLICY "Allow public update" ON artists FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON members FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON videos FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON formation_data FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON formations FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON positions FOR UPDATE USING (true);

-- Policies: Allow public delete
CREATE POLICY "Allow public delete" ON artists FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON members FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON videos FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON formation_data FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON formations FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON positions FOR DELETE USING (true);
