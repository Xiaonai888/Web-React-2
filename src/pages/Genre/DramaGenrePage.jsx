import SharedGenrePage from './SharedGenrePage'

export default function DramaGenrePage({ embedded = false }) {
  return <SharedGenrePage genreSlug="drama" embedded={embedded} />
}
