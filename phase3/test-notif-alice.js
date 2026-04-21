import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'alice@example.com',
  password: 'password'
})

if (loginError) {
  console.error('Login error:', loginError)
  process.exit(1)
}

console.log('User connecté:', loginData.user.id)

const { data, error } = await supabase
  .from('notifications')
  .select('*')

if (error) console.error('Erreur:', error)
console.log('Notifications:', data)
