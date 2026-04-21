import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Client public
const SUPABASE_URL = process.env.SUPABASE_URL.replace(/\/$/, '')

export const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Client admin (backend only)
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)