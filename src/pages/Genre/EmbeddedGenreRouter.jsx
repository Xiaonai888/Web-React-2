import { Component } from 'react'
import SharedGenrePage from './SharedGenrePage'

class GenreErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.hasError &&
      previousProps.genreSlug !== this.props.genreSlug
    ) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch(error) {
    console.error('Embedded genre render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[360px] items-center justify-center bg-white px-5">
          <div className="rounded-[22px] bg-gray-50 px-6 py-8 text-center">
            <p className="text-[13px] font-medium text-gray-500">
              Unable to open this genre.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-[12px] font-semibold text-white"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function EmbeddedGenreRouter({ genreSlug }) {
  const normalizedGenreSlug = String(genreSlug || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!normalizedGenreSlug) {
    return (
      <div className="flex min-h-[320px] items-center justify-center bg-white px-5">
        <div className="rounded-[22px] bg-gray-50 px-6 py-8 text-center">
          <p className="text-[13px] font-medium text-gray-500">
            This genre is not available yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <GenreErrorBoundary genreSlug={normalizedGenreSlug}>
      <SharedGenrePage
        key={normalizedGenreSlug}
        genreSlug={normalizedGenreSlug}
        embedded
      />
    </GenreErrorBoundary>
  )
}
