import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = (email: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      setEmailExists(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);
      setError(null);

      try {
        // Try to sign up with a dummy password to check if email exists
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'dummy-check-12345',
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (signUpError?.message.includes('already registered') || 
            signUpError?.message.includes('already taken') ||
            signUpError?.message.includes('User already registered')) {
          setEmailExists(true);
        } else {
          setEmailExists(false);
        }
      } catch (err) {
        setError('Failed to check email availability');
        setEmailExists(null);
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 800);
    return () => clearTimeout(debounceTimer);
  }, [email]);

  return { isChecking, emailExists, error };
};