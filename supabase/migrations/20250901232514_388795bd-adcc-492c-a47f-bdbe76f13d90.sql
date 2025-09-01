-- Add purpose column to distinguish between different OTP types
ALTER TABLE public.password_reset_otps 
ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'password_reset';

-- Add check constraint for valid purposes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'password_reset_otps_purpose_check'
    ) THEN
        ALTER TABLE public.password_reset_otps 
        ADD CONSTRAINT password_reset_otps_purpose_check 
        CHECK (purpose IN ('password_reset', 'signup_verification'));
    END IF;
END $$;