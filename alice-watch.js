import 'dotenv/config'
import { signIn } from './auth.js'
import { subscribeToProject } from './realtime.js'

const PROJECT_ID = process.env.PROJECT_ID || 'VOTRE-PROJECT-ID'

const { user } = await signIn('alice@example.com', 'password')
console.log(`✅ Connecté en tant que ${user.email}`)
console.log(`👀 Surveillance du projet ${PROJECT_ID}...`)

const cleanup = subscribeToProject(PROJECT_ID, {
  onTaskCreated: (task) => console.log('✅ Nouvelle tâche:', task),
  onTaskUpdated: (newTask, oldTask) => console.log('🔄 Tâche mise à jour:', { old: oldTask.status, new: newTask.status }),
  onTaskDeleted: (task) => console.log('🗑️ Tâche supprimée:', task),
  onCommentAdded: (comment) => console.log('💬 Nouveau commentaire:', comment),
  onPresenceChange: (users) => console.log('👥 Utilisateurs en ligne:', users.map(u => u.username)),
})

process.on('SIGINT', () => {
  console.log('\nDéconnexion...')
  cleanup()
  process.exit(0)
})
