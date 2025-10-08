import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CounterContextType {
  count: number;
  incrementCounter: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

const INITIAL_COUNT = 127438; // Base count to start from

interface CounterProviderProps {
  children: ReactNode;
}

export const CounterProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [count, setCount] = useState<number>(INITIAL_COUNT);

  // Fetch initial count from database and set up real-time updates
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      try {
        // Fetch total count from searches table
        const { count: dbCount, error } = await supabase
          .from('searches')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching search count:', error);
        } else if (dbCount !== null) {
          // Add database count to initial count
          setCount(INITIAL_COUNT + dbCount);
        }

        // Set up real-time subscription for new searches
        const channel = supabase
          .channel('search-counter-updates')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'searches'
            },
            (payload) => {
              console.log('New search detected:', payload);
              setCount(prevCount => prevCount + 1);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up counter:', error);
      }
    };

    fetchAndSubscribe();
  }, []);

  const incrementCounter = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <CounterContext.Provider value={{ count, incrementCounter }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = (): CounterContextType => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};