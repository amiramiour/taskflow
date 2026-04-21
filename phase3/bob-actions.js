import 'dotenv/config'
import { signIn } from '../auth.js'
import { createTask, updateTaskStatus, addComment } from '../tasks.js'

const PROJECT_ID = process.env.PROJECT_ID || 'VOTRE-PROJECT-ID'

const { user } = await signIn('bob@example.com', 'bob')
console.log(`✅ Connecté en tant que ${user.email}`)

const task = await createTask(PROJECT_ID, {
  title: 'Implémenter le Realtime',
  priority: 'high',
  assigned_to: user.id,
})
console.log('Tâche créée:', task.id, task.title)

await new Promise((r) => setTimeout(r, 1000))

const updated = await updateTaskStatus(task.id, 'in_progress')
console.log('Statut mis à jour:', updated.status)

await new Promise((r) => setTimeout(r, 1000))

const comment = await addComment(task.id, 'Je commence maintenant !')
console.log('Commentaire ajouté:', comment.content)
