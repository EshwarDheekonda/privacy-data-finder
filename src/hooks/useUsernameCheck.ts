import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUsernameCheck = (username: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    const checkUsername = async () => {
      setIsChecking(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle();

        if (error) {
          setError('Failed to check username availability');
          setIsAvailable(null);
        } else {
          setIsAvailable(!data);
        }
      } catch (err) {
        setError('Failed to check username availability');
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [username]);

  return { isChecking, isAvailable, error };
};