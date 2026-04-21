import 'dotenv/config'
import { supabaseAdmin } from '../client.js'
import { signIn } from '../auth.js'
import { getProjectTasks } from '../tasks.js'

const PROJECT_ID = process.env.PROJECT_ID || null

console.log('\n=== Validation Phase 3 ===\n')

// ✅ 2. Uploadthing keys
const hasUT = !!(process.env.UPLOADTHING_TOKEN && process.env.UPLOADTHING_SECRET)
console.log(`${hasUT ? '✅' : '❌'} Uploadthing keys in .env: ${hasUT ? 'OK' : 'MISSING'}`)

// ✅ 3. file_url column exists in tasks
const { data: columns, error: colError } = await supabaseAdmin
  .from('information_schema.columns')
  .select('column_name')
  .eq('table_schema', 'public')
  .eq('table_name', 'tasks')

if (colError) {
  // fallback: try inserting a null file_url
  const { error: insertError } = await supabaseAdmin
    .from('tasks')
    .select('file_url, file_name')
    .limit(1)
  const hasFileUrl = !insertError
  console.log(`${hasFileUrl ? '✅' : '❌'} Column file_url in tasks: ${hasFileUrl ? 'OK' : insertError?.message}`)
} else {
  const cols = columns.map(c => c.column_name)
  const hasFileUrl = cols.includes('file_url')
  const hasFileName = cols.includes('file_name')
  console.log(`${hasFileUrl ? '✅' : '❌'} Column file_url in tasks: ${hasFileUrl ? 'OK' : 'MISSING — run ALTER TABLE'}`)
  console.log(`${hasFileName ? '✅' : '❌'} Column file_name in tasks: ${hasFileName ? 'OK' : 'MISSING — run ALTER TABLE'}`)
}

// ✅ 1. getProjectTasks() with profiles + comment count
if (!PROJECT_ID) {
  console.log('⚠️  getProjectTasks: skipped — set PROJECT_ID env var')
} else {
  try {
    await signIn('alice@example.com', 'alice')
    const tasks = await getProjectTasks(PROJECT_ID)
    const hasAssignedProfile = tasks.some(t => t.assigned_profile !== undefined)
    const hasCreator = tasks.some(t => t.creator !== undefined)
    const hasCommentCount = tasks.some(t => t.comments !== undefined)
    console.log(`${hasAssignedProfile ? '✅' : '⚠️ '} getProjectTasks → assigned_profile join: ${hasAssignedProfile ? 'OK' : 'no assigned tasks to verify'}`)
    console.log(`${hasCreator ? '✅' : '⚠️ '} getProjectTasks → creator join: ${hasCreator ? 'OK' : 'no tasks with creator to verify'}`)
    console.log(`${hasCommentCount ? '✅' : '⚠️ '} getProjectTasks → comments(count): ${hasCommentCount ? 'OK' : 'no tasks to verify'}`)
    console.log(`   → ${tasks.length} tâche(s) trouvée(s) dans le projet`)
    if (tasks.length > 0) {
      console.log('   Exemple:', JSON.stringify(tasks[0], null, 2).split('\n').slice(0, 12).join('\n') + '\n   ...')
    }
  } catch (e) {
    console.log(`❌ getProjectTasks: ${e.message}`)
  }
}

console.log('\n--- Items à tester manuellement ---')
console.log('☐ Alice reçoit en temps réel les créations de Bob (< 500ms)')
console.log('  → Terminal 1: PROJECT_ID=<uuid> node alice-watch.js')
console.log('  → Terminal 2: PROJECT_ID=<uuid> node bob-actions.js')
console.log('☐ Changements de statut instantanés  (même commande)')
console.log('☐ Présence affiche les 2 utilisateurs (lancer les 2 scripts en même temps)\n')

process.exit(0)
