-- Drop password_reset_otps table and related functions
DROP TABLE IF EXISTS public.password_reset_otps CASCADE;

DROP FUNCTION IF EXISTS public.cleanup_expired_otps() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_cleanup_expired_otps() CASCADE;