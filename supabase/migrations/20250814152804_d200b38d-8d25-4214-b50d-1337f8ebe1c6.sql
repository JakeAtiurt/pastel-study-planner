-- Enable Row Level Security on schedules table
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read and write schedules for now
-- In a real app, you'd want to restrict this to authenticated users
CREATE POLICY "Allow all operations on schedules" 
ON public.schedules 
FOR ALL 
USING (true) 
WITH CHECK (true);