import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_URL_SUPABASE as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_API_KEY_SUPABASE as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
