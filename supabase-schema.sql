-- Create schedules table for saving schedule layouts
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  nodes JSONB NOT NULL,
  settings JSONB NOT NULL DEFAULT '{
    "startTime": 8,
    "endTime": 18,
    "timeFontSize": 12,
    "timeHeight": 60
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - adjust based on your auth needs)
CREATE POLICY "Enable all operations for schedules" ON schedules
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS schedules_updated_at_idx ON schedules(updated_at DESC);
CREATE INDEX IF NOT EXISTS schedules_name_idx ON schedules(name);