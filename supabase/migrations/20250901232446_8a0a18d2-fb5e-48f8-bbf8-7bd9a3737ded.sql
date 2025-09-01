-- Rename password_reset_otps table to verification_otps to make it more generic
ALTER TABLE public.password_reset_otps RENAME TO verification_otps;

-- Add purpose column to distinguish between different OTP types
ALTER TABLE public.verification_otps 
ADD COLUMN purpose text NOT NULL DEFAULT 'password_reset';

-- Add check constraint for valid purposes
ALTER TABLE public.verification_otps 
ADD CONSTRAINT verification_otps_purpose_check 
CHECK (purpose IN ('password_reset', 'signup_verification'));

-- Update existing records to have the correct purpose
UPDATE public.verification_otps 
SET purpose = 'password_reset' 
WHERE purpose = 'password_reset';

-- Update the cleanup function to work with new table name
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM public.verification_otps 
  WHERE expires_at < now() OR is_used = true;
END;
$function$;

-- Update the trigger function name to be more generic
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_otps()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM public.cleanup_expired_otps();
  RETURN NEW;
END;
$function$;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS cleanup_expired_otps_trigger ON public.password_reset_otps;

-- Create new trigger on the renamed table
CREATE TRIGGER cleanup_expired_otps_trigger
    AFTER INSERT ON public.verification_otps
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_cleanup_expired_otps();

-- Update RLS policies for the new table name (rename policies)
DROP POLICY IF EXISTS "No direct DELETE on OTPs" ON public.password_reset_otps;
DROP POLICY IF EXISTS "No direct INSERT on OTPs" ON public.password_reset_otps;
DROP POLICY IF EXISTS "No direct SELECT on OTPs" ON public.password_reset_otps;
DROP POLICY IF EXISTS "No direct UPDATE on OTPs" ON public.password_reset_otps;

-- Create RLS policies for the renamed table
CREATE POLICY "No direct DELETE on OTPs" 
ON public.verification_otps 
FOR DELETE 
USING (false);

CREATE POLICY "No direct INSERT on OTPs" 
ON public.verification_otps 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "No direct SELECT on OTPs" 
ON public.verification_otps 
FOR SELECT 
USING (false);

CREATE POLICY "No direct UPDATE on OTPs" 
ON public.verification_otps 
FOR UPDATE 
USING (false) 
WITH CHECK (false);