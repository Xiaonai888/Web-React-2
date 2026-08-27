import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthorPageShareSheet from '../components/AuthorPageShareSheet'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('episodeEchoes', {
  en: {
    justNow: 'Just now',
    minuteShort: '{{count}}m',
    hourShort: '{{count}}h',
    dayShort: '{{count}}d',
    reader: 'Reader',
    public: 'Public',
    followers: 'Followers',
    closeReaders: 'Close readers',
    onlyMe: 'Only me',
    story: 'Story',
    untitledStory: 'Untitled story',
    episodeNumber: 'Episode {{number}}:',
    episode: 'Episode',
    shadowAuthor: 'Shadow Author',
    echo: 'echo',
    echoes: 'echoes',
    copyEpisodeLink: 'Copy episode link',
    sharedWithoutMessage: 'Shared this episode without a message.',
    openOriginalEpisode: 'Open original episode',
    echoedTo: 'Echoed to {{destination}}',
    read: 'Read',
    share: 'Share',
    copied: 'Episode link copied.',
    copyThisLink: 'Copy this link:',
    shadowEpisode: 'Shadow episode',
    loadFailed: 'Failed to load echoes',
    backendUnavailable: 'Cannot connect to backend.',
    goBack: 'Go back',
    title: 'Readers who echoed this',
    shareEpisode: 'Share episode',
    tryAgain: 'Try again',
    loading: 'Loading...',
    loadMoreReaders: 'Load more readers',
    noEchoes: 'No echoes yet',
    emptyText: 'Be the first reader to share this episode with the Shadow community.',
    returnEpisode: 'Return to episode',
  },
  km: {
    justNow: 'ឥឡូវនេះ',
    minuteShort: '{{count}}នាទី',
    hourShort: '{{count}}ម៉ោង',
    dayShort: '{{count}}ថ្ងៃ',
    reader: 'អ្នកអាន',
    public: 'សាធារណៈ',
    followers: 'អ្នកតាមដាន',
    closeReaders: 'អ្នកអានជិតស្និទ្ធ',
    onlyMe: 'តែខ្ញុំ',
    story: 'រឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    episodeNumber: 'ភាគ {{number}}:',
    episode: 'ភាគ',
    shadowAuthor: 'អ្នកនិពន្ធ Shadow',
    echo: 'Echo',
    echoes: 'Echo',
    copyEpisodeLink: 'ចម្លង Link ភាគ',
    sharedWithoutMessage: 'បានចែករំលែកភាគនេះដោយគ្មានសារ។',
    openOriginalEpisode: 'បើកភាគដើម',
    echoedTo: 'Echo ទៅ {{destination}}',
    read: 'អាន',
    share: 'ចែករំលែក',
    copied: 'បានចម្លង Link ភាគ។',
    copyThisLink: 'ចម្លង Link នេះ៖',
    shadowEpisode: 'ភាគ Shadow',
    loadFailed: 'មិនអាចផ្ទុក Echo បានទេ',
    backendUnavailable: 'មិនអាចភ្ជាប់ទៅ Server បានទេ។',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'អ្នកអានដែលបាន Echo ភាគនេះ',
    shareEpisode: 'ចែករំលែកភាគ',
    tryAgain: 'សាកម្តងទៀត',
    loading: 'កំពុងផ្ទុក...',
    loadMoreReaders: 'ផ្ទុកអ្នកអានបន្ថែម',
    noEchoes: 'មិនទាន់មាន Echo ទេ',
    emptyText: 'ក្លាយជាអ្នកអានដំបូងដែលចែករំលែកភាគនេះទៅកាន់សហគមន៍ Shadow។',
    returnEpisode: 'ត្រឡប់ទៅភាគ',
  },
  zh: {
    justNow: '刚刚',
    minuteShort: '{{count}}分钟',
    hourShort: '{{count}}小时',
    dayShort: '{{count}}天',
    reader: '读者',
    public: '公开',
    followers: '关注者',
    closeReaders: '亲密读者',
    onlyMe: '仅自己',
    story: '故事',
    untitledStory: '无标题故事',
    episodeNumber: '第 {{number}} 集：',
    episode: '集',
    shadowAuthor: 'Shadow 作者',
    echo: '转发',
    echoes: '转发',
    copyEpisodeLink: '复制剧集链接',
    sharedWithoutMessage: '分享了这一集，但没有附加消息。',
    openOriginalEpisode: '打开原始剧集',
    echoedTo: '转发到 {{destination}}',
    read: '阅读',
    share: '分享',
    copied: '剧集链接已复制。',
    copyThisLink: '复制此链接：',
    shadowEpisode: 'Shadow 剧集',
    loadFailed: '无法加载转发',
    backendUnavailable: '无法连接到服务器。',
    goBack: '返回',
    title: '转发此剧集的读者',
    shareEpisode: '分享剧集',
    tryAgain: '重试',
    loading: '加载中...',
    loadMoreReaders: '加载更多读者',
    noEchoes: '还没有转发',
    emptyText: '成为第一个将这一集分享到 Shadow 社区的读者。',
    returnEpisode: '返回剧集',
  },
  ja: {
    justNow: 'たった今',
    minuteShort: '{{count}}分',
    hourShort: '{{count}}時間',
    dayShort: '{{count}}日',
    reader: '読者',
    public: '公開',
    followers: 'フォロワー',
    closeReaders: '親しい読者',
    onlyMe: '自分のみ',
    story: 'ストーリー',
    untitledStory: '無題のストーリー',
    episodeNumber: 'エピソード {{number}}：',
    episode: 'エピソード',
    shadowAuthor: 'Shadow 作者',
    echo: 'エコー',
    echoes: 'エコー',
    copyEpisodeLink: 'エピソードのリンクをコピー',
    sharedWithoutMessage: 'メッセージなしでこのエピソードを共有しました。',
    openOriginalEpisode: '元のエピソードを開く',
    echoedTo: '{{destination}} にエコー',
    read: '読む',
    share: '共有',
    copied: 'エピソードのリンクをコピーしました。',
    copyThisLink: 'このリンクをコピー：',
    shadowEpisode: 'Shadow エピソード',
    loadFailed: 'エコーを読み込めませんでした',
    backendUnavailable: 'サーバーに接続できません。',
    goBack: '戻る',
    title: 'このエピソードをエコーした読者',
    shareEpisode: 'エピソードを共有',
    tryAgain: 'もう一度試す',
    loading: '読み込み中...',
    loadMoreReaders: 'さらに読者を読み込む',
    noEchoes: 'まだエコーはありません',
    emptyText: 'このエピソードを Shadow コミュニティに共有する最初の読者になりましょう。',
    returnEpisode: 'エピソードに戻る',
  },
  ko: {
    justNow: '방금',
    minuteShort: '{{count}}분',
    hourShort: '{{count}}시간',
    dayShort: '{{count}}일',
    reader: '독자',
    public: '전체 공개',
    followers: '팔로워',
    closeReaders: '친한 독자',
    onlyMe: '나만 보기',
    story: '스토리',
    untitledStory: '제목 없는 스토리',
    episodeNumber: '에피소드 {{number}}:',
    episode: '에피소드',
    shadowAuthor: 'Shadow 작가',
    echo: '에코',
    echoes: '에코',
    copyEpisodeLink: '에피소드 링크 복사',
    sharedWithoutMessage: '메시지 없이 이 에피소드를 공유했습니다.',
    openOriginalEpisode: '원본 에피소드 열기',
    echoedTo: '{{destination}}에 에코됨',
    read: '읽기',
    share: '공유',
    copied: '에피소드 링크를 복사했습니다.',
    copyThisLink: '이 링크 복사:',
    shadowEpisode: 'Shadow 에피소드',
    loadFailed: '에코를 불러오지 못했습니다',
    backendUnavailable: '서버에 연결할 수 없습니다.',
    goBack: '뒤로 가기',
    title: '이 에피소드를 에코한 독자',
    shareEpisode: '에피소드 공유',
    tryAgain: '다시 시도',
    loading: '불러오는 중...',
    loadMoreReaders: '독자 더 불러오기',
    noEchoes: '아직 에코가 없습니다',
    emptyText: '이 에피소드를 Shadow 커뮤니티에 공유하는 첫 번째 독자가 되어 보세요.',
    returnEpisode: '에피소드로 돌아가기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const LANGUAGE_LOCALES = {
  km: 'km-KH',
  en: 'en-GB',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDate(value, language, t) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  )

  if (seconds < 60) {
    return t('episodeEchoes.justNow')
  }

  if (seconds < 3600) {
    return t('episodeEchoes.minuteShort', {
      count: Math.floor(seconds / 60),
    })
  }

  if (seconds < 86400) {
    return t('episodeEchoes.hourShort', {
      count: Math.floor(seconds / 3600),
    })
  }

  if (seconds < 604800) {
    return t('episodeEchoes.dayShort', {
      count: Math.floor(seconds / 86400),
    })
  }

  return date.toLocaleDateString(
    LANGUAGE_LOCALES[language] ||
      LANGUAGE_LOCALES.en,
    {
      day: '2-digit',
      month: 'short',
      year:
        date.getFullYear() ===
        new Date().getFullYear()
          ? undefined
          : 'numeric',
    }
  )
}

function Avatar({
  user,
  fallbackName,
  size = 'h-12 w-12',
}) {
  const name =
    user?.name ||
    user?.username ||
    fallbackName
  const avatar = user?.avatar_url || ''

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} rounded-full object-cover ring-1 ring-black/5`}
      />
    )
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-[#17131f] text-[15px] font-black text-white`}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function AudienceBadge({ audience }) {
  const { t } = useDisplayTranslation()
  const items = {
    public: [
      'fa-solid fa-earth-americas',
      t('episodeEchoes.public'),
    ],
    followers: [
      'fa-solid fa-user-check',
      t('episodeEchoes.followers'),
    ],
    'close-readers': [
      'fa-solid fa-star',
      t('episodeEchoes.closeReaders'),
    ],
    'only-me': [
      'fa-solid fa-lock',
      t('episodeEchoes.onlyMe'),
    ],
  }
  const [icon, label] =
    items[audience] || items.public

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1edf9] px-2.5 py-1 text-[10px] font-bold text-[#7658a6]">
      <i className={`${icon} text-[9px]`} />
      {label}
    </span>
  )
}

function SourceCard({
  story,
  episode,
  author,
  total,
  onOpen,
}) {
  const { language, t } =
    useDisplayTranslation()
  const cover =
    episode?.cover_url ||
    story?.cover_url ||
    story?.landscape_thumbnail_url ||
    ''
  const echoCount = Number(total || 0)

  return (
    <section className="border-b border-[#ece8f3] bg-white px-4 pb-5 pt-3">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-start gap-3 text-left active:scale-[0.995]"
      >
        <div className="h-[78px] w-[58px] shrink-0 overflow-hidden rounded-[12px] bg-[#eeeaf5] ring-1 ring-black/5">
          {cover ? (
            <img
              src={cover}
              alt={
                story?.title ||
                t('episodeEchoes.story')
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#9b91aa]">
              <i className="fa-regular fa-bookmark text-[20px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="line-clamp-1 text-[15px] font-black text-[#17131f]">
            {story?.title ||
              t('episodeEchoes.untitledStory')}
          </div>
          <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-[#766f80]">
            {episode?.episode_number
              ? `${t(
                  'episodeEchoes.episodeNumber',
                  {
                    number:
                      episode.episode_number,
                  }
                )} `
              : ''}
            {episode?.title ||
              t('episodeEchoes.episode')}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#9b93a5]">
            <span>
              {author?.page_name ||
                author?.name ||
                t(
                  'episodeEchoes.shadowAuthor'
                )}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#c8c1d1]" />
            <span>
              {echoCount.toLocaleString(
                LANGUAGE_LOCALES[language] ||
                  LANGUAGE_LOCALES.en
              )}{' '}
              {echoCount === 1
                ? t('episodeEchoes.echo')
                : t('episodeEchoes.echoes')}
            </span>
          </div>
        </div>

        <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[#a79fb2]" />
      </button>
    </section>
  )
}

function EchoCard({
  echo,
  onOpenEpisode,
  onShare,
  onCopy,
}) {
  const { language, t } =
    useDisplayTranslation()
  const user = echo?.user || {}
  const name =
    user.name ||
    user.username ||
    t('episodeEchoes.reader')
  const profileLink = `/profile?username=${encodeURIComponent(
    user.username || ''
  )}`
  const shareCount = Math.max(
    1,
    Number(echo?.share_count || 1)
  )
  const destination = String(
    echo.destination || 'feed'
  ).replaceAll('-', ' ')

  return (
    <article className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(45,35,64,0.06)] ring-1 ring-[#ebe6f2]">
      <div className="flex items-start gap-3">
        <Link
          to={profileLink}
          className="shrink-0 cursor-pointer transition hover:opacity-80 active:opacity-70"
        >
          <Avatar
            user={user}
            fallbackName={t(
              'episodeEchoes.reader'
            )}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={profileLink}
              className="min-w-0 cursor-pointer text-left transition hover:opacity-80 active:opacity-70"
            >
              <div className="line-clamp-1 text-[15px] font-black text-[#17131f]">
                {name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px] font-semibold text-[#9b93a5]">
                <span>
                  {formatDate(
                    echo.updated_at ||
                      echo.created_at,
                    language,
                    t
                  )}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#cbc4d4]" />
                <AudienceBadge
                  audience={echo.audience}
                />
                {shareCount > 1 ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#cbc4d4]" />
                    <span>
                      {shareCount}{' '}
                      {t(
                        'episodeEchoes.echoes'
                      )}
                    </span>
                  </>
                ) : null}
              </div>
            </Link>

            <button
              type="button"
              onClick={onCopy}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8f879a] active:bg-[#f5f2f9]"
              aria-label={t(
                'episodeEchoes.copyEpisodeLink'
              )}
            >
              <i className="fa-solid fa-ellipsis text-[13px]" />
            </button>
          </div>
        </div>
      </div>

      {echo.echo_text ? (
        <p className="mt-4 whitespace-pre-wrap break-words text-[14px] font-medium leading-6 text-[#38313f]">
          {echo.echo_text}
        </p>
      ) : (
        <p className="mt-4 text-[13px] font-semibold italic text-[#9a92a4]">
          {t(
            'episodeEchoes.sharedWithoutMessage'
          )}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-[17px] bg-[#f7f4fa] ring-1 ring-[#ebe6f2]">
        <button
          type="button"
          onClick={onOpenEpisode}
          className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[#f0ebf6]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#17131f] text-white">
            <i className="fa-solid fa-book-open text-[14px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[12px] font-black text-[#17131f]">
              {t(
                'episodeEchoes.openOriginalEpisode'
              )}
            </div>
            <div className="mt-0.5 line-clamp-1 text-[10.5px] font-semibold text-[#91889b]">
              {t('episodeEchoes.echoedTo', {
                destination,
              })}
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-[10px] text-[#a79fb2]" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0ecf4] pt-3">
        <button
          type="button"
          onClick={onOpenEpisode}
          className="flex h-10 items-center justify-center gap-2 rounded-[13px] text-[12px] font-bold text-[#5e5568] active:bg-[#f5f2f8]"
        >
          <i className="fa-regular fa-bookmark text-[13px]" />
          {t('episodeEchoes.read')}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-10 items-center justify-center gap-2 rounded-[13px] text-[12px] font-bold text-[#7658a6] active:bg-[#f1edf9]"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-[12px]" />
          {t('episodeEchoes.share')}
        </button>
      </div>
    </article>
  )
}

function mergeEchoes(current, incoming) {
  const items = [...current]
  const indexById = new Map(
    items.map((item, index) => [
      String(item?.id || ''),
      index,
    ])
  )

  incoming.forEach((item) => {
    const id = String(item?.id || '')
    if (!id) return

    const existingIndex =
      indexById.get(id)

    if (existingIndex === undefined) {
      indexById.set(id, items.length)
      items.push(item)
      return
    }

    items[existingIndex] = item
  })

  return items
}

export default function EpisodeEchoesPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } =
    useParams()
  const { t } = useDisplayTranslation()
  const [story, setStory] = useState(null)
  const [episode, setEpisode] =
    useState(null)
  const [author, setAuthor] =
    useState(null)
  const [echoes, setEchoes] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [loading, setLoading] =
    useState(true)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [message, setMessage] =
    useState('')
  const [notice, setNotice] = useState('')
  const [shareOpen, setShareOpen] =
    useState(false)

  const episodeLink = `${window.location.origin}/story/${storyId}/episode/${episodeId}`

  const copyEpisodeLink = async () => {
    try {
      await navigator.clipboard.writeText(
        episodeLink
      )
      setNotice(t('episodeEchoes.copied'))
    } catch {
      window.prompt(
        t('episodeEchoes.copyThisLink'),
        episodeLink
      )
    }
  }

  const shareEpisode = async () => {
    const title =
      episode?.title ||
      story?.title ||
      t('episodeEchoes.shadowEpisode')

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: episodeLink,
        })
        return
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
      }
    }

    await copyEpisodeLink()
  }

  const loadEchoes = async (
    nextPage,
    append = false
  ) => {
    if (!episodeId) return

    append
      ? setLoadingMore(true)
      : setLoading(true)
    setMessage('')

    try {
      const token = getReaderToken()
      const response = await fetch(
        `${API_BASE_URL}/api/echo-v2/source/episode/${encodeURIComponent(
          episodeId
        )}?page=${nextPage}&limit=20`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          cache: 'no-store',
        }
      )
      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('episodeEchoes.loadFailed')
        )
      }

      const source = data.source || {}
      const nextStory = source.story || null
      const nextEpisode =
        source.episode || null
      const nextAuthor =
        source.owner || null
      const nextEchoes = Array.isArray(
        data.echoes
      )
        ? data.echoes
        : []

      setStory(nextStory)
      setEpisode(nextEpisode)
      setAuthor(nextAuthor)
      setTotal(
        Math.max(
          0,
          Number(
            data.echo_count ??
              data.total ??
              0
          )
        )
      )
      setPage(
        Math.max(
          1,
          Number(data.page || nextPage)
        )
      )
      setHasMore(Boolean(data.has_more))
      setEchoes((current) =>
        append
          ? mergeEchoes(
              current,
              nextEchoes
            )
          : nextEchoes
      )
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? t(
              'episodeEchoes.backendUnavailable'
            )
          : error.message ||
              t(
                'episodeEchoes.loadFailed'
              )
      )
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!episodeId) return
    setEchoes([])
    setStory(null)
    setEpisode(null)
    setAuthor(null)
    setTotal(0)
    setPage(1)
    setHasMore(false)
    loadEchoes(1)
  }, [episodeId])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(
      () => setNotice(''),
      2200
    )
    return () =>
      window.clearTimeout(timer)
  }, [notice])

  return (
    <main className="min-h-screen bg-[#f6f3f9] pb-[calc(24px+env(safe-area-inset-bottom))] text-[#17131f]">
      <header className="sticky top-0 z-40 border-b border-[#ece8f3] bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[44px_1fr_44px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f5f2f8]"
            aria-label={t(
              'episodeEchoes.goBack'
            )}
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[19px] font-bold">
              {t('episodeEchoes.title')}
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              setShareOpen(true)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7658a6] active:bg-[#f1edf9]"
            aria-label={t(
              'episodeEchoes.shareEpisode'
            )}
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-[18px]" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl">
        {!loading && episode ? (
          <SourceCard
            story={story}
            episode={episode}
            author={author}
            total={total}
            onOpen={() =>
              navigate(
                `/story/${storyId}/episode/${episodeId}`
              )
            }
          />
        ) : null}

        {notice ? (
          <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-[#17131f] px-4 py-2 text-[11px] font-bold text-white shadow-xl">
            {notice}
          </div>
        ) : null}

        <section className="px-3 py-4 sm:px-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[22px] bg-white p-4 ring-1 ring-[#ebe6f2]"
                >
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#eeeaf3]" />
                    <div className="flex-1 pt-1">
                      <div className="h-3 w-32 rounded-full bg-[#eeeaf3]" />
                      <div className="mt-3 h-2.5 w-20 rounded-full bg-[#f2eef6]" />
                    </div>
                  </div>
                  <div className="mt-5 h-3 w-full rounded-full bg-[#eeeaf3]" />
                  <div className="mt-2 h-3 w-4/5 rounded-full bg-[#f2eef6]" />
                  <div className="mt-4 h-16 rounded-[16px] bg-[#f5f2f8]" />
                </div>
              ))}
            </div>
          ) : message ? (
            <div className="rounded-[22px] bg-white px-5 py-12 text-center ring-1 ring-[#ebe6f2]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f1] text-[#e5484d]">
                <i className="fa-solid fa-triangle-exclamation text-[21px]" />
              </div>
              <p className="mt-4 text-[13px] font-bold text-[#665d70]">
                {message}
              </p>
              <button
                type="button"
                onClick={() =>
                  loadEchoes(1)
                }
                className="mt-5 h-11 rounded-full bg-[#17131f] px-6 text-[12px] font-black text-white active:scale-95"
              >
                {t(
                  'episodeEchoes.tryAgain'
                )}
              </button>
            </div>
          ) : echoes.length ? (
            <div className="space-y-3">
              {echoes.map((echo) => (
                <EchoCard
                  key={echo.id}
                  echo={echo}
                  onOpenEpisode={() =>
                    navigate(
                      `/story/${storyId}/episode/${episodeId}`
                    )
                  }
                  onShare={shareEpisode}
                  onCopy={copyEpisodeLink}
                />
              ))}

              {hasMore ? (
                <button
                  type="button"
                  onClick={() =>
                    loadEchoes(
                      page + 1,
                      true
                    )
                  }
                  disabled={loadingMore}
                  className="h-12 w-full rounded-[16px] bg-white text-[12px] font-black text-[#7658a6] ring-1 ring-[#e7e0ef] active:scale-[0.995] disabled:opacity-60"
                >
                  {loadingMore
                    ? t(
                        'episodeEchoes.loading'
                      )
                    : t(
                        'episodeEchoes.loadMoreReaders'
                      )}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[22px] bg-white px-5 py-16 text-center ring-1 ring-[#ebe6f2]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1edf9] text-[#7658a6]">
                <i className="fa-solid fa-rotate text-[23px]" />
              </div>
              <h2 className="mt-4 text-[16px] font-black">
                {t(
                  'episodeEchoes.noEchoes'
                )}
              </h2>
              <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-semibold leading-5 text-[#958d9f]">
                {t(
                  'episodeEchoes.emptyText'
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/story/${storyId}/episode/${episodeId}`
                  )
                }
                className="mt-6 h-11 rounded-full bg-[#17131f] px-6 text-[12px] font-black text-white active:scale-95"
              >
                {t(
                  'episodeEchoes.returnEpisode'
                )}
              </button>
            </div>
          )}
        </section>
      </div>

      <AuthorPageShareSheet
        open={shareOpen}
        pageName={
          episode?.title ||
          story?.title ||
          t(
            'episodeEchoes.shadowEpisode'
          )
        }
        pageLink={episodeLink}
        onClose={() =>
          setShareOpen(false)
        }
        onCopied={() =>
          setNotice(
            t('episodeEchoes.copied')
          )
        }
      />
    </main>
  )
}
