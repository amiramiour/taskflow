import { supabaseAdmin } from './client.js'

const { data: tasks } = await supabaseAdmin.from('tasks').select('*')
console.log('Tasks ADMIN:', tasks?.length)