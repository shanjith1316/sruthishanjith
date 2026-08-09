import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  )
}

export const supabase = createClient(url || 'http://localhost', anon || 'anon')

export const EVENTS_TABLE = 'events'
export const EVENTS_BUCKET = 'event-images'
