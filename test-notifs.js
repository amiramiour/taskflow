import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// LOGIN
const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'alice@example.com',
  password: 'password'
})

if (loginError) {
  console.error('Login error:', loginError)
  process.exit(1)
}

// 🔥 IMPORTANT : récupérer session
const session = loginData.session

// 🔥 FORCER le token dans le client
supabase.auth.setSession({
  access_token: session.access_token,
  refresh_token: session.refresh_token
})

// DEBUG
const { data: userData } = await supabase.auth.getUser()
console.log('User connecté:', userData.user.id)

// REQUÊTE
const { data, error } = await supabase
  .from('notifications')
  .select('*')

console.log('Notifications:', data)