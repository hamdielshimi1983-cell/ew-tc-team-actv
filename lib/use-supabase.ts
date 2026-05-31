import { getSupabaseClient } from './supabase-client';

export function useSupabase() {
  return getSupabaseClient();
}
