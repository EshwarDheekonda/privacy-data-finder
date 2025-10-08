-- Create user_feedback table
CREATE TABLE public.user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Questions 1-3 (Required)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  ease_of_use TEXT NOT NULL,
  expectations_met TEXT NOT NULL,
  
  -- Questions 4-5 (Optional)
  improvements TEXT,
  feature_requests TEXT,
  
  -- Metadata
  user_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" 
ON public.user_feedback 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert feedback
CREATE POLICY "Anonymous users can insert feedback" 
ON public.user_feedback 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for efficient querying
CREATE INDEX idx_user_feedback_user_id ON public.user_feedback(user_id);
CREATE INDEX idx_user_feedback_created_at ON public.user_feedback(created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_feedback_updated_at
BEFORE UPDATE ON public.user_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();