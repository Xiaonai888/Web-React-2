import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('reactionPage', {
  en: {
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
    loadFailed: 'Failed to load story',
    goBack: 'Go back',
    title: 'Reaction',
    subtitle: 'Animated story reactions',
    storyCover: 'Story cover',
    story: 'Story',
    loadingStory: 'Loading story...',
    untitledStory: 'Untitled Story',
    author: 'Author',
    reacted: 'You reacted {{reaction}}',
    chooseReaction: 'Choose your reaction',
    removeReaction: 'Remove {{reaction}} reaction',
    addReaction: 'Add {{reaction}} reaction',
    storyPage: 'Story Page',
    done: 'Done',
  },
  km: {
    love: 'ស្រឡាញ់',
    haha: 'សើច',
    wow: 'ភ្ញាក់ផ្អើល',
    sad: 'សោកសៅ',
    angry: 'ខឹង',
    support: 'គាំទ្រ',
    touched: 'រំភើបចិត្ត',
    loadFailed: 'មិនអាចផ្ទុករឿងបានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'ប្រតិកម្ម',
    subtitle: 'ប្រតិកម្មមានចលនាសម្រាប់រឿង',
    storyCover: 'គម្របរឿង',
    story: 'រឿង',
    loadingStory: 'កំពុងផ្ទុករឿង...',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    author: 'អ្នកនិពន្ធ',
    reacted: 'អ្នកបានប្រតិកម្ម {{reaction}}',
    chooseReaction: 'ជ្រើសរើសប្រតិកម្មរបស់អ្នក',
    removeReaction: 'ដកប្រតិកម្ម {{reaction}}',
    addReaction: 'បន្ថែមប្រតិកម្ម {{reaction}}',
    storyPage: 'ទំព័ររឿង',
    done: 'រួចរាល់',
  },
  zh: {
    love: '喜欢',
    haha: '哈哈',
    wow: '惊讶',
    sad: '难过',
    angry: '生气',
    support: '支持',
    touched: '感动',
    loadFailed: '无法加载故事',
    goBack: '返回',
    title: '表情反应',
    subtitle: '动态故事表情反应',
    storyCover: '故事封面',
    story: '故事',
    loadingStory: '正在加载故事...',
    untitledStory: '无标题故事',
    author: '作者',
    reacted: '你选择了 {{reaction}}',
    chooseReaction: '选择你的反应',
    removeReaction: '移除 {{reaction}} 反应',
    addReaction: '添加 {{reaction}} 反应',
    storyPage: '故事页面',
    done: '完成',
  },
  ja: {
    love: 'ラブ',
    haha: '笑い',
    wow: 'びっくり',
    sad: '悲しい',
    angry: '怒り',
    support: '応援',
    touched: '感動',
    loadFailed: 'ストーリーを読み込めませんでした',
    goBack: '戻る',
    title: 'リアクション',
    subtitle: 'アニメーション付きストーリーリアクション',
    storyCover: 'ストーリーの表紙',
    story: 'ストーリー',
    loadingStory: 'ストーリーを読み込み中...',
    untitledStory: '無題のストーリー',
    author: '作者',
    reacted: '{{reaction}}でリアクションしました',
    chooseReaction: 'リアクションを選択',
    removeReaction: '{{reaction}}のリアクションを削除',
    addReaction: '{{reaction}}のリアクションを追加',
    storyPage: 'ストーリーページ',
    done: '完了',
  },
  ko: {
    love: '좋아요',
    haha: '웃겨요',
    wow: '놀라워요',
    sad: '슬퍼요',
    angry: '화나요',
    support: '응원해요',
    touched: '감동이에요',
    loadFailed: '스토리를 불러오지 못했습니다',
    goBack: '뒤로 가기',
    title: '반응',
    subtitle: '애니메이션 스토리 반응',
    storyCover: '스토리 표지',
    story: '스토리',
    loadingStory: '스토리를 불러오는 중...',
    untitledStory: '제목 없는 스토리',
    author: '작가',
    reacted: '{{reaction}} 반응을 남겼습니다',
    chooseReaction: '반응을 선택하세요',
    removeReaction: '{{reaction}} 반응 삭제',
    addReaction: '{{reaction}} 반응 추가',
    storyPage: '스토리 페이지',
    done: '완료',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTIONS = [
  {
    type: 'love',
    label: 'Love',
    src: '/assets/React/1%20React_Love.svg',
    bg: '#fff0f4',
    text: '#ff2f5f',
  },
  {
    type: 'haha',
    label: 'Haha',
    src: '/assets/React/2%20React_Haha.svg',
    bg: '#fff7d8',
    text: '#f59e0b',
  },
  {
    type: 'wow',
    label: 'Wow',
    src: '/assets/React/3%20React_Wow.svg',
    bg: '#fff7d8',
    text: '#f59e0b',
  },
  {
    type: 'sad',
    label: 'Sad',
    src: '/assets/React/4%20React_Sad.svg',
    bg: '#eaf4ff',
    text: '#3b82f6',
  },
  {
    type: 'angry',
    label: 'Angry',
    src: '/assets/React/5%20React_Angry.svg',
    bg: '#fff1e8',
    text: '#ef4444',
  },
  {
    type: 'support',
    label: 'Support',
    src: '/assets/React/6%20React_Support.svg',
    bg: '#edfdf3',
    text: '#16a34a',
  },
  {
    type: 'touched',
    label: 'Touched',
    src: '/assets/React/7%20React_Touched.svg',
    bg: '#f5f0ff',
    text: '#8b5cf6',
  },
]

function getStorageKey(storyId) {
  return `shadow_story_basic_reaction_${storyId}`
}

function readReaction(storyId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(storyId)) || 'null')
  } catch {
    return null
  }
}

function saveReaction(storyId, data) {
  localStorage.setItem(getStorageKey(storyId), JSON.stringify(data))
}

function removeReaction(storyId) {
  localStorage.removeItem(getStorageKey(storyId))
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(/\.0$/, '')}M`
  }
  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(/\.0$/, '')}K`
  }

  return String(number)
}

function getReactionDisplayLabel(reaction, t) {
  if (!reaction?.type) return ''
  return t(`reactionPage.${reaction.type}`)
}

export default function ReactionPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const { t } = useDisplayTranslation()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [localCount, setLocalCount] = useState(0)
  const [activePop, setActivePop] = useState('')

  const baseCount = useMemo(() => {
    return Number(
      story?.like_count ||
        story?.likes_count ||
        story?.reaction_count ||
        0
    )
  }, [story])

  const totalReactions = baseCount + localCount
  const activeReaction =
    REACTIONS.find((item) => item.type === selectedReaction) || null

  useEffect(() => {
    const saved = readReaction(storyId)

    if (saved?.reaction_type) {
      setSelectedReaction(saved.reaction_type)
      setLocalCount(1)
    } else {
      setSelectedReaction(null)
      setLocalCount(0)
    }
  }, [storyId])

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/public/stories/${storyId}`
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || t('reactionPage.loadFailed')
          )
        }

        if (!ignore) setStory(data.story || null)
      } catch (error) {
        if (!ignore) {
          setMessage(
            error.message || t('reactionPage.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [storyId])

  const handleSelectReaction = (reaction) => {
    if (selectedReaction === reaction.type) {
      removeReaction(storyId)
      setSelectedReaction(null)
      setLocalCount(0)
      setActivePop('')
      return
    }

    saveReaction(storyId, {
      reaction_type: reaction.type,
      reaction_label: reaction.label,
      story_id: storyId,
      created_at: new Date().toISOString(),
    })

    setSelectedReaction(reaction.type)
    setLocalCount(1)
    setActivePop(reaction.type)

    window.setTimeout(() => {
      setActivePop('')
    }, 650)
  }

  return (
    <main className="app-page min-h-screen pb-10 text-[#111827] dark:text-[var(--shadow-text-primary)]">
      <style>
        {`
          @keyframes shadowReactionPop {
            0% { transform: translateY(8px) scale(0.65) rotate(-10deg); opacity: 0; }
            45% { transform: translateY(-9px) scale(1.22) rotate(5deg); opacity: 1; }
            70% { transform: translateY(1px) scale(0.96) rotate(-2deg); opacity: 1; }
            100% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
          }

          @keyframes shadowReactionFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-5px) scale(1.05); }
          }

          @keyframes shadowReactionGlow {
            0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.45; }
            100% { transform: translate(-50%, -50%) scale(1.9); opacity: 0; }
          }

          .shadow-reaction-pop {
            animation: shadowReactionPop 520ms cubic-bezier(.2,.8,.2,1) both;
          }

          .shadow-reaction-float {
            animation: shadowReactionFloat 1.8s ease-in-out infinite;
          }

          .shadow-reaction-button:hover .shadow-reaction-icon {
            transform: translateY(-8px) scale(1.22);
          }

          .shadow-reaction-glow::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 42px;
            height: 42px;
            border-radius: 9999px;
            background: currentColor;
            animation: shadowReactionGlow 620ms ease-out both;
            pointer-events: none;
          }
        `}
      </style>

      <header className="sticky top-0 z-30 border-b border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]"
            aria-label={t('reactionPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-black dark:text-[var(--shadow-text-primary)]">
              {t('reactionPage.title')}
            </h1>
            <p className="text-[11.5px] font-semibold text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
              {t('reactionPage.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[560px] px-4 pt-5">
        {message ? (
          <div className="mb-4 rounded-[20px] bg-white px-4 py-3 text-[12px] font-bold text-[#667085] shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-secondary)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
            {message}
          </div>
        ) : null}

        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
          <div className="flex gap-3">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#eef1f5] dark:bg-[var(--shadow-bg-elevated)]">
              {story?.cover_url ? (
                <img
                  src={story.cover_url}
                  alt={
                    story.title ||
                    t('reactionPage.storyCover')
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]">
                  <i className="fa-regular fa-bookmark text-[22px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-black uppercase tracking-[0.08em] text-[#f6a800]">
                {t('reactionPage.story')}
              </div>
              <h2 className="mt-1 line-clamp-2 text-[18px] font-black leading-6 dark:text-[var(--shadow-text-primary)]">
                {loading
                  ? t('reactionPage.loadingStory')
                  : story?.title ||
                    t('reactionPage.untitledStory')}
              </h2>
              <p className="mt-2 line-clamp-1 text-[12px] font-bold text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
                {story?.author_page?.page_name ||
                  story?.authorPage?.page_name ||
                  story?.author?.page_name ||
                  story?.author_name ||
                  t('reactionPage.author')}
              </p>
              <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]">
                {story?.main_genre ||
                  t('reactionPage.story')}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[26px] bg-[#f8f8fb] p-5 text-center dark:bg-[var(--shadow-bg-elevated)]">
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
              style={{
                backgroundColor:
                  activeReaction?.bg || undefined,
                color:
                  activeReaction?.text || undefined,
              }}
            >
              {activeReaction ? (
                <img
                  src={activeReaction.src}
                  alt={getReactionDisplayLabel(
                    activeReaction,
                    t
                  )}
                  className={`h-16 w-16 object-contain ${
                    activePop === activeReaction.type
                      ? 'shadow-reaction-pop'
                      : 'shadow-reaction-float'
                  }`}
                />
              ) : (
                <i className="fa-regular fa-face-smile text-[34px] text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]" />
              )}
            </div>

            <div className="mt-4 text-[24px] font-black dark:text-[var(--shadow-text-primary)]">
              {formatNumber(totalReactions)}
            </div>
            <div className="mt-1 text-[12px] font-bold text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
              {activeReaction
                ? t('reactionPage.reacted', {
                    reaction:
                      getReactionDisplayLabel(
                        activeReaction,
                        t
                      ),
                  })
                : t('reactionPage.chooseReaction')}
            </div>

            <div className="mt-5 flex justify-center">
              <div className="flex max-w-full gap-2 overflow-x-auto rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-none dark:ring-white/10">
                {REACTIONS.map((reaction) => {
                  const isActive =
                    selectedReaction === reaction.type
                  const isPopping =
                    activePop === reaction.type
                  const displayLabel =
                    getReactionDisplayLabel(
                      reaction,
                      t
                    )

                  return (
                    <button
                      key={reaction.type}
                      type="button"
                      onClick={() =>
                        handleSelectReaction(reaction)
                      }
                      disabled={loading}
                      className={`shadow-reaction-button relative flex h-[54px] w-[50px] shrink-0 flex-col items-center justify-center rounded-full transition duration-200 active:scale-95 disabled:opacity-60 ${
                        isActive
                          ? 'scale-110 shadow-sm ring-2 ring-white dark:ring-white/25'
                          : 'hover:bg-[#f8f8fb] dark:hover:bg-[var(--shadow-bg-hover)]'
                      } ${
                        isPopping
                          ? 'shadow-reaction-glow'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? reaction.bg
                          : 'transparent',
                        color: reaction.text,
                      }}
                      aria-label={t(
                        isActive
                          ? 'reactionPage.removeReaction'
                          : 'reactionPage.addReaction',
                        {
                          reaction: displayLabel,
                        }
                      )}
                    >
                      <img
                        src={reaction.src}
                        alt=""
                        className={`shadow-reaction-icon h-8 w-8 object-contain transition duration-200 ${
                          isPopping
                            ? 'shadow-reaction-pop'
                            : ''
                        }`}
                      />
                      <span
                        className={`mt-0.5 text-[9px] font-black ${
                          isActive
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      >
                        {displayLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/story/${storyId}`)
              }
              className="flex h-12 items-center justify-center rounded-full border border-[#eceaf2] bg-white text-[13px] font-black text-[#111827] active:scale-95 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]"
            >
              {t('reactionPage.storyPage')}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-95 dark:bg-[#7c3aed]"
            >
              {t('reactionPage.done')}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
