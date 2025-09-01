-- Secure password_reset_otps: enable RLS and deny all direct access
-- 1) Enable RLS on the table
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- 2) Drop any existing policies that might allow access
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'password_reset_otps' AND policyname = 'Service role can manage OTPs'
  ) THEN
    EXECUTE 'DROP POLICY "Service role can manage OTPs" ON public.password_reset_otps';
  END IF;
END $$;

-- 3) Create explicit deny-by-default policies (service role bypasses RLS)
-- Deny SELECT
CREATE POLICY "No direct SELECT on OTPs"
ON public.password_reset_otps
FOR SELECT
USING (false);

-- Deny INSERT
CREATE POLICY "No direct INSERT on OTPs"
ON public.password_reset_otps
FOR INSERT
WITH CHECK (false);

-- Deny UPDATE
CREATE POLICY "No direct UPDATE on OTPs"
ON public.password_reset_otps
FOR UPDATE
USING (false)
WITH CHECK (false);

-- Deny DELETE
CREATE POLICY "No direct DELETE on OTPs"
ON public.password_reset_otps
FOR DELETE
USING (false);

-- 4) Document intent
COMMENT ON TABLE public.password_reset_otps IS 'Stores short-lived password reset OTPs. RLS is enabled and all direct access is denied. Access only via Edge Functions using the service role key.';
