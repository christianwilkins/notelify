import { supabase } from '../utils/supabaseClient';
import { AuthResponse } from '../types/Auth';

export async function signInAnonymously(): Promise<AuthResponse> {
  const { user, session, error } = await supabase.auth.signInAnonymously({});

  if (error) {
    console.error('Error signing in anonymously:', error.message);
    return { error };
  }

  console.log('Anonymous user signed in', user);
  console.log('Session:', session);
  return { user, session };
}