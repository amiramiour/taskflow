// import { supabaseAdmin } from '../client.js'

// const { data: tasks } = await supabaseAdmin.from('tasks').select('*')
// console.log('Tasks ADMIN:', tasks?.length)
import { supabase } from '../client.js'
import { signIn, signOut } from '../auth.js'
// Test 1 : sans auth → tout vide
const { data: noAuth } = await supabase.from('tasks').select('*')
console.log('Sans auth:', noAuth?.length, '(attendu: 0)')
// Test 2 : Alice voit ses tâches
await signIn('alice@example.com', 'alice')
const { data: tasks } = await supabase.from('tasks').select('*')
console.log('Tasks Alice:', tasks?.length)
// Test 3 : Alice ne peut pas modifier la tâche de Bob
const { data: bobTask } = await supabase
.from('tasks').select('id').eq('assigned_to', '26d5e0db-0065-4399-af37-cce3b0404cbf').single()
const { error } = await supabase
.from('tasks').update({ title: 'Hacked' }).eq('id', bobTask?.id)
console.log('Modif refusée:', error?.message ?? '⚠ ERREUR : accès accordé !')
await signOut()