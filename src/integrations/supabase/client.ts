import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase configuration - uses environment variables with fallback to existing values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://nozkxrartxphvlznpwhk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vemt4cmFydHhwaHZsem5wd2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0ODM1OTQsImV4cCI6MjA3MTA1OTU5NH0.eLBjHHMrFlvD3HxSA058VO2C0Y1cWBUETHql96wD3XA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});