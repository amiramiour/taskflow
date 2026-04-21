import { supabase } from './client.js'

export function subscribeToProject(projectId, callbacks) {
  const channel = supabase.channel(`project:${projectId}`)

  channel
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
      (payload) => callbacks.onTaskCreated?.(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
      (payload) => callbacks.onTaskUpdated?.(payload.new, payload.old)
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
      (payload) => callbacks.onTaskDeleted?.(payload.old)
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comments' },
      (payload) => callbacks.onCommentAdded?.(payload.new)
    )
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const users = Object.values(state).flat()
      callbacks.onPresenceChange?.(users)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await channel.track({
            username: user.email,
            online_at: new Date().toISOString(),
          })
        }
      }
    })

  return () => supabase.removeChannel(channel)
}
