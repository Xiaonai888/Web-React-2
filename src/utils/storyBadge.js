export function getStoryBadge(story) {
  const status = String(story?.story_status || '').trim().toLowerCase()
  if (story?.is_completed === true || status === 'completed') return 'end'
  const totalEpisodes = Number(story?.total_episodes || 0)
  if (totalEpisodes === 1) return 'new'
  if (totalEpisodes >= 2) return 'up'
  return null
}
