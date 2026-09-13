import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import AuthorCommentThreadSheet from '../../components/AuthorCommentThreadSheet'

registerTranslationNamespace('meCommentsPage', {
  en: {
    all: 'All',
    story: 'Story Comment',
    myComments: 'My Comments',
    replies: 'Replies',
    mentions: 'Mentions',
    readers: 'Readers',
    you: 'You',
    reader: 'Reader',
    author: 'Author',
    back: 'Back',
    comments: 'Comments',
    youCommented: 'You commented',
    someoneReplied: 'Someone replied',
    youWereMentioned: 'You were mentioned',
    commentActivity: 'Comment activity',
    failedLoadComments: 'Failed to load comments',
    noCommentsYet: 'No comments yet',
    noCommentActivity: 'No comment activity found.',
    loading: 'Loading...',
    loadMore: 'Load more',
  },
  km: {
    all: 'ទាំងអស់',
    story: 'មតិយោបល់រឿង',
    myComments: 'មតិយោបល់របស់ខ្ញុំ',
    replies: 'ការឆ្លើយតប',
    mentions: 'ការលើកឈ្មោះ',
    readers: 'អ្នកអាន',
    you: 'អ្នក',
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    back: 'ត្រឡប់ក្រោយ',
    comments: 'មតិយោបល់',
    youCommented: 'អ្នកបានបញ្ចេញមតិ',
    someoneReplied: 'មានអ្នកឆ្លើយតប',
    youWereMentioned: 'មានគេលើកឈ្មោះអ្នក',
    commentActivity: 'សកម្មភាពមតិយោបល់',
    failedLoadComments: 'មិនអាចផ្ទុកមតិយោបល់បាន',
    noCommentsYet: 'មិនទាន់មានមតិយោបល់',
    noCommentActivity: 'រកមិនឃើញសកម្មភាពមតិយោបល់។',
    loading: 'កំពុងផ្ទុក...',
    loadMore: 'ផ្ទុកបន្ថែម',
  },
  zh: {
    all: '全部',
    story: '作品评论',
    myComments: '我的评论',
    replies: '回复',
    mentions: '提及',
    readers: '读者',
    you: '你',
    reader: '读者',
    author: '作者',
    back: '返回',
    comments: '评论',
    youCommented: '你发表了评论',
    someoneReplied: '有人回复了你',
    youWereMentioned: '有人提到了你',
    commentActivity: '评论动态',
    failedLoadComments: '无法加载评论',
    noCommentsYet: '暂无评论',
    noCommentActivity: '未找到评论动态。',
    loading: '加载中...',
    loadMore: '加载更多',
  },
  ja: {
    all: 'すべて',
    story: '作品コメント',
    myComments: '自分のコメント',
    replies: '返信',
    mentions: 'メンション',
    readers: '読者',
    you: 'あなた',
    reader: '読者',
    author: '作者',
    back: '戻る',
    comments: 'コメント',
    youCommented: 'コメントしました',
    someoneReplied: '返信がありました',
    youWereMentioned: 'メンションされました',
    commentActivity: 'コメントアクティビティ',
    failedLoadComments: 'コメントを読み込めませんでした',
    noCommentsYet: 'コメントはまだありません',
    noCommentActivity: 'コメントアクティビティはありません。',
    loading: '読み込み中...',
    loadMore: 'さらに読み込む',
  },
  ko: {
    all: '전체',
    story: '작품 댓글',
    myComments: '내 댓글',
    replies: '답글',
    mentions: '멘션',
    readers: '독자',
    you: '나',
    reader: '독자',
    author: '작가',
    back: '뒤로 가기',
    comments: '댓글',
    youCommented: '댓글을 남겼습니다',
    someoneReplied: '누군가 답글을 남겼습니다',
    youWereMentioned: '회원님이 언급되었습니다',
    commentActivity: '댓글 활동',
    failedLoadComments: '댓글을 불러오지 못했습니다',
    noCommentsYet: '아직 댓글이 없습니다',
    noCommentActivity: '댓글 활동을 찾을 수 없습니다.',
    loading: '불러오는 중...',
    loadMore: '더 불러오기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const tabs = [
  { key: 'all' },
  { key: 'story', authorOnly: true },
  { key: 'mine' },
  { key: 'replies' },
  { key: 'mentions' },
]

const TAB_LABEL_KEYS = {
  all: 'all',
  story: 'story',
  mine: 'myComments',
  replies: 'replies',
  mentions: 'mentions',
}

const STORY_FILTERS = [
  { key: 'all', labelKey: 'all' },
  { key: 'readers', labelKey: 'readers' },
  { key: 'you', labelKey: 'you' },
]

const LANGUAGE_LOCALES = {
  en: 'en-US',
  km: 'km-KH',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatTime(value, language) {
  if (!value) return ''

  return new Date(value).toLocaleString(
    LANGUAGE_LOCALES[language] || 'en-US',
    {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

function getActivityTitle(item, t) {
  if (item.activity_type === 'mine') {
    return t('meCommentsPage.youCommented')
  }
  if (item.activity_type === 'reply') {
    return t('meCommentsPage.someoneReplied')
  }
  if (item.activity_type === 'mention') {
    return t('meCommentsPage.youWereMentioned')
  }

  return (
    item.title ||
    t('meCommentsPage.commentActivity')
  )
}

function getActivityText(item) {
  return item.text || item.message || ''
}

function getActivityStoryTitle(item) {
  return (
    item.story?.title ||
    item.story_title ||
    ''
  )
}

function getActivityUser(item) {
  return item.user || null
}

function getActivityUserName(item, t) {
  const user = getActivityUser(item)

  if (item.is_own_comment) {
    return (
      user?.name ||
      user?.username ||
      t('meCommentsPage.you')
    )
  }

  return (
    user?.name ||
    user?.username ||
    t('meCommentsPage.reader')
  )
}

function getActivityAvatar(item) {
  return (
    getActivityUser(item)?.avatar_url ||
    ''
  )
}

function getActivityAvatarLetter(item, t) {
  return String(
    getActivityUserName(item, t) ||
    'R'
  )
    .trim()
    .slice(0, 1)
    .toUpperCase()
}

function ActivityAvatar({ item, t }) {
  const avatar = getActivityAvatar(item)

  if (avatar) {
    return (
      <img
        src={avatar}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff7] text-[15px] font-black text-[#4b5563] dark:bg-white/10 dark:text-white/80">
      {getActivityAvatarLetter(item, t)}
    </div>
  )
}

export default function MeCommentsPage() {
  const { language, t } =
    useDisplayTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] =
    useState('all')
  const [storyFilter, setStoryFilter] =
    useState('all')
  const [
    selectedStoryComment,
    setSelectedStoryComment,
  ] = useState(null)
  const [hasAuthorPage, setHasAuthorPage] =
    useState(false)
  const [items, setItems] = useState([])
  const [counts, setCounts] = useState({})
  const [storyPage, setStoryPage] =
    useState(1)
  const [storyHasMore, setStoryHasMore] =
    useState(false)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] = useState('')

  const token = getReaderToken()

  useEffect(() => {
    if (!token) {
      navigate('/login', {
        replace: true,
      })
    }
  }, [navigate, token])

  useEffect(() => {
    let ignore = false

    async function checkAuthorPage() {
      if (!token) return

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/me/summary`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: 'no-store',
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (!ignore) {
          setHasAuthorPage(
            Boolean(
              response.ok &&
              data.ok !== false &&
              data.has_author_page &&
              data.author_page?.page_username
            )
          )
        }
      } catch {
        if (!ignore) {
          setHasAuthorPage(false)
        }
      }
    }

    checkAuthorPage()

    return () => {
      ignore = true
    }
  }, [token])

  const visibleTabs = useMemo(
    () =>
      tabs.filter(
        (tab) =>
          !tab.authorOnly ||
          hasAuthorPage
      ),
    [hasAuthorPage]
  )

  useEffect(() => {
    let ignore = false

    async function loadItems() {
      if (!token) return

      try {
        setLoading(true)
        setError('')

        const endpoint =
          activeTab === 'story'
            ? `${API_BASE_URL}/api/comments/me/activities?filter=story&page=1&limit=20`
            : `${API_BASE_URL}/api/comments/me/activities?filter=${activeTab}`

        const response = await fetch(
          endpoint,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
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
            t(
              'meCommentsPage.failedLoadComments'
            )
          )
        }

        if (ignore) return

        setItems(data.activities || [])
        setCounts(data.counts || {})

        if (activeTab === 'story') {
          setStoryPage(
            Number(data.page || 1)
          )
          setStoryHasMore(
            Boolean(data.has_more)
          )
        } else {
          setStoryPage(1)
          setStoryHasMore(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.message ||
            t(
              'meCommentsPage.failedLoadComments'
            )
          )
          setItems([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      ignore = true
    }
  }, [activeTab, token, t])

  const tabCounts = useMemo(
    () => ({
      all:
        activeTab === 'all'
          ? items.length
          : Number(counts.all || 0),
      mine:
        Number(counts.mine || 0),
      replies:
        Number(counts.replies || 0),
      mentions:
        Number(counts.mentions || 0),
    }),
    [
      activeTab,
      counts,
      items.length,
    ]
  )

  const visibleItems = useMemo(() => {
    if (activeTab !== 'story') {
      return items
    }

    if (storyFilter === 'readers') {
      return items.filter(
        (item) =>
          !item.is_own_comment
      )
    }

    if (storyFilter === 'you') {
      return items.filter(
        (item) =>
          Boolean(item.is_own_comment)
      )
    }

    return items
  }, [
    activeTab,
    items,
    storyFilter,
  ])

  async function openItem(item) {
    if (activeTab === 'story') {
      setSelectedStoryComment(item)
      return
    }

    if (
      activeTab === 'all' &&
      item.id &&
      !item.is_read
    ) {
      try {
        await fetch(
          `${API_BASE_URL}/api/notifications/${item.id}/read`,
          {
            method: 'PATCH',
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        setItems((current) =>
          current.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  is_read: true,
                }
              : row
          )
        )
      } catch {}
    }

    const link =
      item.link ||
      (
        item.story_id
          ? `/story/${item.story_id}`
          : ''
      )

    if (link) {
      navigate(link)
    }
  }

  async function loadMoreStoryComments() {
    if (
      activeTab !== 'story' ||
      loadingMore ||
      !storyHasMore
    ) {
      return
    }

    const nextPage = storyPage + 1

    try {
      setLoadingMore(true)

      const response = await fetch(
        `${API_BASE_URL}/api/comments/me/activities?filter=story&page=${nextPage}&limit=20`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
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
          t(
            'meCommentsPage.failedLoadComments'
          )
        )
      }

      const nextItems =
        data.activities || []

      setItems((current) => {
        const existingIds =
          new Set(
            current.map((row) =>
              String(row.id)
            )
          )

        return [
          ...current,
          ...nextItems.filter(
            (row) =>
              !existingIds.has(
                String(row.id)
              )
          ),
        ]
      })

      setStoryPage(
        Number(
          data.page || nextPage
        )
      )
      setStoryHasMore(
        Boolean(data.has_more)
      )
    } catch (err) {
      setError(
        err.message ||
        t(
          'meCommentsPage.failedLoadComments'
        )
      )
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="app-page min-h-screen bg-[#f7f7f9] pb-[96px] dark:bg-[#111318]">
      <header className="sticky top-0 z-30 border-b border-[#ececf0] bg-white/95 px-4 pb-3 pt-3 backdrop-blur dark:border-white/10 dark:bg-[#171923]/95">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f1f1f4] dark:text-white dark:active:bg-white/10"
            aria-label={t(
              'meCommentsPage.back'
            )}
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <h1 className="text-[20px] font-extrabold leading-tight text-[#111827] dark:text-white">
            {t(
              'meCommentsPage.comments'
            )}
          </h1>
        </div>

        <div className="mx-auto mt-3 flex max-w-3xl gap-1 overflow-x-auto border-b border-[#eeeeF2] [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 [&::-webkit-scrollbar]:hidden">
          {visibleTabs.map((tab) => {
            const active =
              activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)

                  if (
                    tab.key !==
                    'story'
                  ) {
                    setStoryFilter(
                      'all'
                    )
                  }
                }}
                className={`relative shrink-0 px-3.5 pb-3 pt-2 text-[12.5px] transition ${
                  active
                    ? 'font-extrabold text-[#111827] dark:text-white'
                    : 'font-semibold text-[#8b9099] dark:text-white/50'
                }`}
              >
                {t(
                  `meCommentsPage.${TAB_LABEL_KEYS[tab.key]}`
                )}

                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#111827] dark:bg-[#f6b800]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {activeTab === 'story' ? (
          <div className="mb-4 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STORY_FILTERS.map(
              (filter) => {
                const active =
                  storyFilter ===
                  filter.key

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() =>
                      setStoryFilter(
                        filter.key
                      )
                    }
                    className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                      active
                        ? 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
                        : 'bg-white text-[#777d87] ring-1 ring-black/5 dark:bg-[#171923] dark:text-white/55 dark:ring-white/10'
                    }`}
                  >
                    {t(
                      `meCommentsPage.${filter.labelKey}`
                    )}
                  </button>
                )
              }
            )}
          </div>
        ) : null}

        {error ? (
          <div className="mb-3 rounded-2xl bg-[#fff1f1] px-4 py-3 text-[13px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse gap-3 border-b border-[#f0f0f3] px-4 py-4 last:border-b-0 dark:border-white/10"
                >
                  <div className="h-11 w-11 shrink-0 rounded-full bg-[#f0f0f3] dark:bg-white/10" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3.5 w-1/3 rounded bg-[#f0f0f3] dark:bg-white/10" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-[#f0f0f3] dark:bg-white/10" />
                    <div className="mt-3 h-3.5 w-4/5 rounded bg-[#f0f0f3] dark:bg-white/10" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : visibleItems.length ? (
          <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            {visibleItems.map(
              (item) => {
                const isStory =
                  activeTab === 'story'
                const actorName =
                  getActivityUserName(
                    item,
                    t
                  )
                const storyTitle =
                  getActivityStoryTitle(
                    item
                  )

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      openItem(item)
                    }
                    className={`relative flex w-full items-start gap-3 border-b border-[#f0f0f3] px-4 py-4 text-left transition last:border-b-0 active:bg-[#f8f8fa] dark:border-white/10 dark:active:bg-white/5 ${
                      isStory &&
                      !item.is_read
                        ? 'bg-[#fffdf4] dark:bg-[#f6b800]/[0.06]'
                        : ''
                    }`}
                  >
                    <ActivityAvatar
                      item={item}
                      t={t}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="min-w-0 truncate text-[14px] font-extrabold text-[#17191d] dark:text-white">
                          {isStory
                            ? actorName
                            : getActivityTitle(
                                item,
                                t
                              )}
                        </span>

                        {isStory ? (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${
                              item.is_own_comment
                                ? 'bg-[#ede9fe] text-[#6d28d9] dark:bg-violet-500/15 dark:text-violet-300'
                                : 'bg-[#eaf4ff] text-[#2673c9] dark:bg-blue-500/15 dark:text-blue-300'
                            }`}
                          >
                            {t(
                              item.is_own_comment
                                ? 'meCommentsPage.author'
                                : 'meCommentsPage.reader'
                            )}
                          </span>
                        ) : null}
                      </div>

                      {storyTitle ? (
                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#8a9099] dark:text-white/45">
                          <i className="fa-regular fa-bookmark shrink-0 text-[10px]" />
                          <span className="truncate">
                            {storyTitle}
                          </span>
                        </div>
                      ) : null}

                      <p className="mt-2 line-clamp-3 text-[13px] font-medium leading-5.5 text-[#4f555f] dark:text-white/70">
                        {getActivityText(
                          item
                        )}
                      </p>

                      <div className="mt-2 text-[10.5px] font-semibold text-[#a0a5ad] dark:text-white/35">
                        {formatTime(
                          item.created_at,
                          language
                        )}
                      </div>
                    </div>

                    {isStory &&
                    !item.is_read ? (
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f6b800]" />
                    ) : (
                      <i className="fa-solid fa-chevron-right mt-1.5 shrink-0 text-[9px] text-[#c2c6cc] dark:text-white/25" />
                    )}
                  </button>
                )
              }
            )}

            {activeTab === 'story' &&
            storyHasMore ? (
              <div className="border-t border-[#f0f0f3] px-4 py-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={
                    loadMoreStoryComments
                  }
                  disabled={
                    loadingMore
                  }
                  className="h-10 w-full rounded-full bg-[#f5f5f7] text-[12px] font-extrabold text-[#4b5058] active:scale-[0.99] disabled:opacity-60 dark:bg-white/10 dark:text-white/75"
                >
                  {loadingMore
                    ? t(
                        'meCommentsPage.loading'
                      )
                    : t(
                        'meCommentsPage.loadMore'
                      )}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-8 rounded-[20px] bg-white px-6 py-10 text-center ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f2f6] text-[#747a84] dark:bg-white/10 dark:text-white/60">
              <i className="far fa-comment-dots text-[19px]" />
            </div>
            <h2 className="mt-4 text-[16px] font-extrabold text-[#111827] dark:text-white">
              {t(
                'meCommentsPage.noCommentsYet'
              )}
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[#969ba4] dark:text-white/45">
              {t(
                'meCommentsPage.noCommentActivity'
              )}
            </p>
          </div>
        )}
      </main>

      <AuthorCommentThreadSheet
        item={selectedStoryComment}
        onClose={() =>
          setSelectedStoryComment(null)
        }
        onRead={(commentId) => {
          setItems((current) =>
            current.map((row) =>
              String(row.id) ===
              String(commentId)
                ? {
                    ...row,
                    is_read: true,
                  }
                : row
            )
          )
          setSelectedStoryComment(
            (current) =>
              current &&
              String(current.id) ===
                String(commentId)
                ? {
                    ...current,
                    is_read: true,
                  }
                : current
          )
        }}
      />
    </div>
  )
}
