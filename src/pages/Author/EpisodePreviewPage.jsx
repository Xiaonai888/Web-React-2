import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('episodePreviewPage', {
  en: {
    published: 'Published', scheduled: 'Scheduled', draft: 'Draft', ready: 'Ready',
    noContent: 'No episode content found.', missingEpisodeId: 'Missing episode id. Please go back and save the episode again.',
    failedLoadStory: 'Failed to load story', failedLoadEpisode: 'Failed to load episode', cannotConnect: 'Cannot connect to backend. Please check deployment.', failedLoadPreview: 'Failed to load preview',
    goBack: 'Go back', preview: 'Preview', publish: 'Publish', loadingPreview: 'Loading preview...', untitledEpisode: 'Untitled Episode',
    charactersCount: '{{count}} characters', status: 'Status', episode: 'Episode', episodeShort: 'EP', characters: 'Characters', visibility: 'Visibility', normal: 'Normal',
    scheduledAt: 'Scheduled: {{date}}', publishedAt: 'Published: {{date}}', readerPreview: 'Reader Preview', storyManager: 'Story Manager', publishSettings: 'Publish Settings',
  },
  km: {
    published: 'បានបោះពុម្ព', scheduled: 'បានកំណត់ពេល', draft: 'ព្រាង', ready: 'រួចរាល់',
    noContent: 'មិនមានខ្លឹមសារភាគទេ។', missingEpisodeId: 'បាត់លេខសម្គាល់ភាគ។ សូមត្រឡប់ក្រោយ ហើយរក្សាទុកភាគម្តងទៀត។',
    failedLoadStory: 'មិនអាចផ្ទុករឿងបានទេ', failedLoadEpisode: 'មិនអាចផ្ទុកភាគបានទេ', cannotConnect: 'មិនអាចភ្ជាប់ទៅ backend បានទេ។ សូមពិនិត្យ deployment។', failedLoadPreview: 'មិនអាចផ្ទុកការមើលជាមុនបានទេ',
    goBack: 'ត្រឡប់ក្រោយ', preview: 'មើលជាមុន', publish: 'បោះពុម្ព', loadingPreview: 'កំពុងផ្ទុកការមើលជាមុន...', untitledEpisode: 'ភាគគ្មានចំណងជើង',
    charactersCount: '{{count}} តួអក្សរ', status: 'ស្ថានភាព', episode: 'ភាគ', episodeShort: 'ភាគ', characters: 'តួអក្សរ', visibility: 'ការបង្ហាញ', normal: 'ធម្មតា',
    scheduledAt: 'បានកំណត់ពេល៖ {{date}}', publishedAt: 'បានបោះពុម្ព៖ {{date}}', readerPreview: 'ការមើលជាមុនសម្រាប់អ្នកអាន', storyManager: 'គ្រប់គ្រងរឿង', publishSettings: 'ការកំណត់បោះពុម្ព',
  },
  zh: {
    published: '已发布', scheduled: '已排期', draft: '草稿', ready: '就绪',
    noContent: '未找到章节内容。', missingEpisodeId: '缺少章节 ID。请返回并重新保存章节。',
    failedLoadStory: '无法加载故事', failedLoadEpisode: '无法加载章节', cannotConnect: '无法连接后端。请检查部署。', failedLoadPreview: '无法加载预览',
    goBack: '返回', preview: '预览', publish: '发布', loadingPreview: '正在加载预览...', untitledEpisode: '未命名章节',
    charactersCount: '{{count}} 个字符', status: '状态', episode: '章节', episodeShort: '章节', characters: '字符数', visibility: '可见性', normal: '普通',
    scheduledAt: '已排期：{{date}}', publishedAt: '已发布：{{date}}', readerPreview: '读者预览', storyManager: '故事管理', publishSettings: '发布设置',
  },
  ja: {
    published: '公開済み', scheduled: '公開予約', draft: '下書き', ready: '準備完了',
    noContent: 'エピソード本文がありません。', missingEpisodeId: 'エピソード ID がありません。戻ってエピソードをもう一度保存してください。',
    failedLoadStory: 'ストーリーを読み込めませんでした', failedLoadEpisode: 'エピソードを読み込めませんでした', cannotConnect: 'バックエンドに接続できません。デプロイを確認してください。', failedLoadPreview: 'プレビューを読み込めませんでした',
    goBack: '戻る', preview: 'プレビュー', publish: '公開', loadingPreview: 'プレビューを読み込み中...', untitledEpisode: '無題のエピソード',
    charactersCount: '{{count}} 文字', status: 'ステータス', episode: 'エピソード', episodeShort: '話', characters: '文字数', visibility: '公開範囲', normal: '通常',
    scheduledAt: '公開予約：{{date}}', publishedAt: '公開済み：{{date}}', readerPreview: '読者プレビュー', storyManager: 'ストーリー管理', publishSettings: '公開設定',
  },
  ko: {
    published: '게시됨', scheduled: '예약됨', draft: '초안', ready: '준비 완료',
    noContent: '에피소드 내용이 없습니다.', missingEpisodeId: '에피소드 ID가 없습니다. 돌아가서 에피소드를 다시 저장해 주세요.',
    failedLoadStory: '스토리를 불러오지 못했습니다', failedLoadEpisode: '에피소드를 불러오지 못했습니다', cannotConnect: '백엔드에 연결할 수 없습니다. 배포 상태를 확인해 주세요.', failedLoadPreview: '미리보기를 불러오지 못했습니다',
    goBack: '뒤로 가기', preview: '미리보기', publish: '게시', loadingPreview: '미리보기를 불러오는 중...', untitledEpisode: '제목 없는 에피소드',
    charactersCount: '{{count}}자', status: '상태', episode: '에피소드', episodeShort: '화', characters: '문자 수', visibility: '공개 범위', normal: '일반',
    scheduledAt: '예약됨: {{date}}', publishedAt: '게시됨: {{date}}', readerPreview: '독자 미리보기', storyManager: '스토리 관리', publishSettings: '게시 설정',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function StatusBadge({ status }) {
  const { t } = useDisplayTranslation()
  const normalized = String(status || 'draft').toLowerCase()

  const classes = {
    published: 'bg-[#ecfdf3] text-[#16803c]',
    scheduled: 'bg-[#eff6ff] text-[#0b5cff]',
    draft: 'bg-[#f2f4f7] text-[#667085]',
    ready: 'bg-[#fff7df] text-[#a56a00]',
  }

  const labels = {
    published: t('episodePreviewPage.published'),
    scheduled: t('episodePreviewPage.scheduled'),
    draft: t('episodePreviewPage.draft'),
    ready: t('episodePreviewPage.ready'),
  }

  return (
    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${classes[normalized] || classes.draft}`}>
      {labels[normalized] || t('episodePreviewPage.draft')}
    </span>
  )
}

function ReadingText({ content }) {
  const { t } = useDisplayTranslation()
  const paragraphs = useMemo(() => {
    return String(content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [content])

  if (!paragraphs.length) {
    return (
      <p className="text-[14px] font-semibold leading-8 text-[var(--shadow-text-secondary)]">
        {t('episodePreviewPage.noContent')}
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line text-[16px] leading-9 text-[var(--shadow-text-primary)]">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export default function EpisodePreviewPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const displayLanguage = getDisplayLanguageId()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()

  const episodeId = searchParams.get('episodeId') || searchParams.get('episode_id')

  const [story, setStory] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPreview() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (!episodeId) {
        setLoading(false)
        setMessage(t('episodePreviewPage.missingEpisodeId'))
        return
      }

      try {
        const [storyResponse, episodeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/${episodeId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodeData = await episodeResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || t('episodePreviewPage.failedLoadStory'))
        }

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || t('episodePreviewPage.failedLoadEpisode'))
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisode(episodeData.episode || null)
      } catch (error) {
        if (ignore) return

        setMessage(
          error.message === 'Failed to fetch'
            ? t('episodePreviewPage.cannotConnect')
            : error.message || t('episodePreviewPage.failedLoadPreview')
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPreview()

    return () => {
      ignore = true
    }
  }, [episodeId, navigate, storyId, t])

  const previewCover = episode?.cover_url || story?.cover_url || ''

  const scheduledText = episode?.scheduled_at
    ? new Date(episode.scheduled_at).toLocaleString(displayLanguage)
    : ''

  const publishedText = episode?.published_at
    ? new Date(episode.published_at).toLocaleString(displayLanguage)
    : ''

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[110px]">
      <header className="sticky top-0 z-50 bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('episodePreviewPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{t('episodePreviewPage.preview')}</h1>

          <button
            type="button"
            onClick={() => navigate(`/author/story/${storyId}/episode/publish?episodeId=${episodeId || ''}`)}
            className="rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
          >
            {t('episodePreviewPage.publish')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {loading ? (
          <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border-strong)] border-t-[var(--shadow-text-primary)]" />
            <div className="text-[13px] font-bold text-[var(--shadow-text-secondary)]">{t('episodePreviewPage.loadingPreview')}</div>
          </section>
        ) : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && episode ? (
          <>
            <section className="overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="relative bg-[#111827]">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  {previewCover ? (
                    <img
                      src={previewCover}
                      alt={episode.title}
                      className="h-full w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/50">
                      <i className="fa-regular fa-image text-[34px]" />
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={episode.status} />

                    {episode.is_adult ? (
                      <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                        18+
                      </span>
                    ) : null}

                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                      {t('episodePreviewPage.episodeShort')} {episode.episode_number || 1}
                    </span>
                  </div>

                  <h2 className="text-[24px] font-extrabold leading-8 text-white">
                    {episode.title || t('episodePreviewPage.untitledEpisode')}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold text-white/75">
                    {story?.title ? <span>{story.title}</span> : null}
                    <span>{t('episodePreviewPage.charactersCount', { count: Number(episode.character_count || 0).toLocaleString(displayLanguage) })}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--shadow-border)] p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">{t('episodePreviewPage.status')}</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)] capitalize">{t(`episodePreviewPage.${String(episode.status || 'draft').toLowerCase()}`)}</div>
                  </div>

                  <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">{t('episodePreviewPage.episode')}</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">{t('episodePreviewPage.episodeShort')} {episode.episode_number || 1}</div>
                  </div>

                  <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">{t('episodePreviewPage.characters')}</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
                      {Number(episode.character_count || 0).toLocaleString(displayLanguage)}
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">{t('episodePreviewPage.visibility')}</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
                      {episode.is_adult ? '18+' : t('episodePreviewPage.normal')}
                    </div>
                  </div>
                </div>

                {scheduledText || publishedText ? (
                  <div className="mt-3 rounded-[16px] bg-[#f5f8ff] px-4 py-3 text-[12px] font-bold leading-5 text-[#0b5cff]">
                    {scheduledText ? t('episodePreviewPage.scheduledAt', { date: scheduledText }) : null}
                    {publishedText ? t('episodePreviewPage.publishedAt', { date: publishedText }) : null}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-4 rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-6 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="mb-6 border-b border-[var(--shadow-border)] pb-4">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[var(--shadow-text-tertiary)]">
                  {t('episodePreviewPage.readerPreview')}
                </div>
                <h3 className="mt-2 text-[22px] font-extrabold leading-8 text-[var(--shadow-text-primary)]">
                  {episode.title}
                </h3>
              </div>

              <ReadingText content={episode.content} />
            </section>

            <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
              <button
                type="button"
                onClick={() => navigate(`/author/story/${storyId}/manage`)}
                className="flex h-14 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-extrabold text-[var(--shadow-text-primary)] shadow-sm active:scale-[0.99]"
              >
                {t('episodePreviewPage.storyManager')}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/author/story/${storyId}/episode/publish?episodeId=${episodeId || ''}&first=${episode.episode_number === 1 ? '1' : '0'}`)}
                className="flex h-14 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[14px] font-extrabold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99]"
              >
                {t('episodePreviewPage.publishSettings')}
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
