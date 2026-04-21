import 'dotenv/config'
import { signIn } from '../auth.js'
import { getProjectTasks } from '../tasks.js'

const PROJECT_ID = '523c5e57-edec-486d-a1f4-846628fe0dee'

await signIn('alice@example.com', 'alice')
console.log('✅ Connecté en tant que alice\n')

const tasks = await getProjectTasks(PROJECT_ID)
console.log(`📋 ${tasks.length} tâche(s) trouvée(s)\n`)

tasks.slice(0, 3).forEach(t => {
  console.log(`— ${t.title}`)
  console.log(`  status: ${t.status} | priority: ${t.priority}`)
  console.log(`  assigned_to: ${t.assigned_profile?.username ?? 'non assigné'}`)
  console.log(`  created_by: ${t.creator?.username}`)
  console.log(`  comments: ${t.comments?.[0]?.count ?? 0}`)
  console.log()
})
