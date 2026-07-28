import SharedGenrePage from './SharedGenrePage'

export default function SystemGenrePage({ embedded = false }) {
  return <SharedGenrePage genreSlug="system" embedded={embedded} />
}
