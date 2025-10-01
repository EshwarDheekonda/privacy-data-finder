-- Create password_reset_otps table for OTP verification
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'signup',
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Enable RLS
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting OTPs (public access for sending OTPs)
CREATE POLICY "Allow public insert for OTP" ON public.password_reset_otps
  FOR INSERT WITH CHECK (true);

-- Create policy for selecting OTPs (public access for verification)
CREATE POLICY "Allow public select for OTP verification" ON public.password_reset_otps
  FOR SELECT USING (true);

-- Create policy for updating OTPs (public access for marking as used)
CREATE POLICY "Allow public update for OTP" ON public.password_reset_otps
  FOR UPDATE USING (true);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);
CREATE INDEX idx_password_reset_otps_expires_at ON public.password_reset_otps(expires_at);

-- Function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_reset_otps
  WHERE expires_at < NOW();
END;
$$;

-- Create a scheduled cleanup trigger (runs on insert)
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_otps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Clean up expired OTPs on each insert
  PERFORM public.cleanup_expired_otps();
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_on_insert
  AFTER INSERT ON public.password_reset_otps
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_cleanup_expired_otps();