import { Component, lazy, Suspense } from 'react'
const RomanceGenrePage = lazy(() => import('./RomanceGenrePage'))
const FantasyGenrePage = lazy(() => import('./FantasyGenrePage'))
const ActionGenrePage = lazy(() => import('./ActionGenrePage'))
const ComedyGenrePage = lazy(() => import('./ComedyGenrePage'))
const AdventureGenrePage = lazy(() => import('./AdventureGenrePage'))
const SchoolLifeGenrePage = lazy(() => import('./SchoolLifeGenrePage'))
const HistoricalGenrePage = lazy(() => import('./HistoricalGenrePage'))
const MysteryGenrePage = lazy(() => import('./MysteryGenrePage'))
const HorrorGenrePage = lazy(() => import('./HorrorGenrePage'))
const LGBTQGenrePage = lazy(() => import('./LGBTQGenrePage'))
const SciFiGenrePage = lazy(() => import('./SciFiGenrePage'))
const DramaGenrePage = lazy(() => import('./DramaGenrePage'))
const ThrillerGenrePage = lazy(() => import('./ThrillerGenrePage'))
const SystemGenrePage = lazy(() => import('./SystemGenrePage'))
const IsekaiGenrePage = lazy(() => import('./IsekaiGenrePage'))
const SupernaturalGenrePage = lazy(() => import('./SupernaturalGenrePage'))
const MartialArtsGenrePage = lazy(() => import('./MartialArtsGenrePage'))
const RevengeGenrePage = lazy(() => import('./RevengeGenrePage'))
const CEOGenrePage = lazy(() => import('./CEOGenrePage'))
const SlowBurnGenrePage = lazy(() => import('./SlowBurnGenrePage'))
const EnemiesToLoversGenrePage = lazy(() => import('./EnemiesToLoversGenrePage'))
const TimeTravelGenrePage = lazy(() => import('./TimeTravelGenrePage'))
const StrongFemaleLeadGenrePage = lazy(() => import('./StrongFemaleLeadGenrePage'))
const HiddenIdentityGenrePage = lazy(() => import('./HiddenIdentityGenrePage'))
const RoyaltyGenrePage = lazy(() => import('./RoyaltyGenrePage'))
const MagicGenrePage = lazy(() => import('./MagicGenrePage'))
const SecondChanceGenrePage = lazy(() => import('./SecondChanceGenrePage'))
const ColdMaleLeadGenrePage = lazy(() => import('./ColdMaleLeadGenrePage'))
const BLGenrePage = lazy(() => import('./BLGenrePage'))
const GLGenrePage = lazy(() => import('./GLGenrePage'))

const GENRE_COMPONENTS = {
  romance: RomanceGenrePage,
  fantasy: FantasyGenrePage,
  action: ActionGenrePage,
  comedy: ComedyGenrePage,
  adventure: AdventureGenrePage,
  'school-life': SchoolLifeGenrePage,
  historical: HistoricalGenrePage,
  mystery: MysteryGenrePage,
  horror: HorrorGenrePage,
  lgbtq: LGBTQGenrePage,
  'lgbtq+': LGBTQGenrePage,
  'sci-fi': SciFiGenrePage,
  scifi: SciFiGenrePage,
  drama: DramaGenrePage,
  thriller: ThrillerGenrePage,
  system: SystemGenrePage,
  isekai: IsekaiGenrePage,
  supernatural: SupernaturalGenrePage,
  'martial-arts': MartialArtsGenrePage,
  revenge: RevengeGenrePage,
  ceo: CEOGenrePage,
  'slow-burn': SlowBurnGenrePage,
  'enemies-to-lovers': EnemiesToLoversGenrePage,
  'time-travel': TimeTravelGenrePage,
  'strong-female-lead': StrongFemaleLeadGenrePage,
  'hidden-identity': HiddenIdentityGenrePage,
  royalty: RoyaltyGenrePage,
  magic: MagicGenrePage,
  'second-chance': SecondChanceGenrePage,
  'cold-male-lead': ColdMaleLeadGenrePage,
  bl: BLGenrePage,
  gl: GLGenrePage,
}

class GenreErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
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

function GenreLoading() {
  return (
    <div className="flex min-h-[360px] items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-[#F6B800]" />

        <p className="mt-3 text-[12px] font-medium text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  )
}

export default function EmbeddedGenreRouter({ genreSlug }) {
  const GenreComponent = GENRE_COMPONENTS[genreSlug]

  if (!GenreComponent) {
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
    <>
      <style>{`
        /*
          Keep the old genre UI,
          but hide its independent page header.
        */
        .embedded-old-genre > div {
          min-height: 0 !important;
          padding-bottom: 24px !important;
        }

        .embedded-old-genre > div > header:first-child {
          display: none !important;
        }

        .embedded-old-genre > div > main {
          padding-top: 16px !important;
        }
      `}</style>

      <div className="embedded-old-genre">
  <GenreErrorBoundary key={genreSlug}>
    <Suspense fallback={<GenreLoading />}>
      <GenreComponent />
    </Suspense>
  </GenreErrorBoundary>
</div>
    </>
  )
}
