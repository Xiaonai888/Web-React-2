import { Clapperboard, MoreHorizontal } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('savedPostGridCard', {
  en: { echo: 'Echo', options: 'Saved post options', unavailable: 'Original unavailable', empty: 'Preview unavailable', reactions: 'Reactions' },
  km: { echo: 'Echo', options: 'ជម្រើស Post ដែលបានរក្សាទុក', unavailable: 'មិនអាចបើក Post ដើម', empty: 'មិនមាន Preview', reactions: 'Reaction' },
  zh: { echo: 'Echo', options: '已保存帖子选项', unavailable: '原帖不可用', empty: '暂无预览', reactions: '互动' },
  ja: { echo: 'Echo', options: '保存済み投稿のオプション', unavailable: '元の投稿は利用できません', empty: 'プレビューなし', reactions: 'リアクション' },
  ko: { echo: 'Echo', options: '저장한 게시물 옵션', unavailable: '원본 게시물 없음', empty: '미리보기 없음', reactions: '반응' },
})

function firstText(source, keys) {
  for (const key of keys) {
    const value = source?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function firstImage(snapshot) {
  for (const key of ['image_urls', 'images', 'media_urls', 'photos']) {
    const entries = snapshot?.[key]
    if (!Array.isArray(entries)) continue
    for (const entry of entries) {
      const value = typeof entry === 'string' ? entry : entry?.url || entry?.image_url || entry?.src
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return firstText(snapshot, ['image_url', 'cover_url', 'thumbnail_url', 'banner_url'])
}

function youtubeId(value) {
  const source = String(value || '').trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(source)) return source
  try {
    const url = new URL(source)
    const host = url.hostname.toLowerCase()
    if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || ''
    }
    if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com')) {
      return url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/)?.[1] || ''
    }
  } catch {
    return ''
  }
  return ''
}

function getReactionTotal(item, snapshot) {
  const candidates = [
    item?.reaction_count,
    item?.total_reactions,
    snapshot?.reaction_count,
    snapshot?.total_reactions,
    snapshot?.reactions_count,
    snapshot?.reaction_counts?.total,
    snapshot?.like_count,
  ]
  for (const value of candidates) {
    if (value === null || value === undefined || value === '') continue
    const number = Number(value)
    if (Number.isFinite(number) && number >= 0) return number
  }
  return null
}

function formatCount(value) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export default function SavedPostGridCard({ item, onOpen, onMenu, onEcho }) {
  const { t } = useDisplayTranslation()
  const snapshot = item?.snapshot_data || {}
  const author = firstText(snapshot, [
    'author_name', 'page_name', 'reader_name', 'user_name', 'creator_name', 'name',
  ]) || firstText(snapshot?.creator, ['page_name', 'name']) || 'Shadow'
  const avatar = firstText(snapshot, [
    'avatar_url', 'author_avatar_url', 'page_avatar_url', 'profile_image_url',
  ]) || firstText(snapshot?.creator, ['avatar_url'])
  const title = firstText(snapshot, ['title', 'post_title', 'headline'])
  const body = firstText(snapshot, ['content', 'description', 'caption', 'text', 'message'])
  const videoUrl = firstText(snapshot, ['video_url', 'youtube_url', 'youtube_link'])
  const video = item?.source_type === 'fast_video' || Boolean(videoUrl) || snapshot?.media_type === 'video'
  const id = youtubeId(videoUrl)
  const cover = firstImage(snapshot) || (video && id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '')
  const reactions = getReactionTotal(item, snapshot)
  const unavailable = item?.status === 'unavailable'
  const caption = title && title !== author && body ? `${title}\n${body}` : body || (title !== author ? title : '')
  const open = () => onOpen?.(item)

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-black/10 dark:bg-[#171923] dark:ring-white/10">
      <div className={`relative aspect-[4/5] overflow-hidden ${cover ? 'bg-[#e8e8ed] dark:bg-[#222531]' : 'bg-white dark:bg-[#171923]'}`}>
        <button type="button" onClick={open} className="absolute inset-0 block h-full w-full text-left">
          {cover ? (
            <img src={cover} alt={title || author} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="block h-full w-full px-3 pb-3 pt-[58px]">
              <span className="line-clamp-[9] whitespace-pre-line break-words text-[12px] leading-[19px] text-[#22252c] dark:text-white/85">
                {body || title || t('savedPostGridCard.empty')}
              </span>
            </span>
          )}
        </button>

        {cover ? <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/65 to-transparent" /> : null}

        <div className="absolute inset-x-2 top-2 flex items-center gap-1.5">
          <button type="button" onClick={open} className={`flex min-w-0 flex-1 items-center gap-1.5 text-left ${cover ? 'text-white' : 'text-[#111827] dark:text-white'}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eeeafd] text-[11px] font-bold text-[#6d4aff] ${cover ? 'ring-1 ring-white/80' : 'ring-1 ring-black/5 dark:ring-white/10'}`}>
              {avatar ? <img src={avatar} alt="" loading="lazy" className="h-full w-full object-cover" /> : author.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 truncate text-[11px] font-bold drop-shadow-sm">{author}</span>
          </button>
          <button type="button" onClick={() => onMenu?.(item)} aria-label={t('savedPostGridCard.options')} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cover ? 'bg-black/30 text-white' : 'bg-[#f3f3f6] text-[#6b7280] dark:bg-white/10 dark:text-white/75'}`}>
            <MoreHorizontal size={17} strokeWidth={2} />
          </button>
        </div>

        {video ? (
          <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/45 p-1 text-white">
            <Clapperboard size={17} strokeWidth={2.1} />
          </div>
        ) : null}
        {unavailable ? (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-center text-[10px] font-semibold text-white">
            {t('savedPostGridCard.unavailable')}
          </div>
        ) : null}
      </div>

      {cover ? (
        <button type="button" onClick={open} className="min-h-[57px] w-full px-2.5 pb-1 pt-2 text-left">
          <span className="line-clamp-2 whitespace-pre-line break-words text-[12px] font-medium leading-[19px] text-[#1f2937] dark:text-white/85">
            {caption || title || t('savedPostGridCard.empty')}
          </span>
        </button>
      ) : null}

      <div className="mt-auto flex min-h-10 items-center justify-between gap-2 px-2.5 pb-1.5 pt-1.5">
        <div className="flex min-w-0 items-center gap-1" aria-label={t('savedPostGridCard.reactions')}>
          <span className="flex items-center -space-x-1 text-[15px] leading-none" aria-hidden="true">
            <span>👍</span><span>❤️</span><span>🥰</span>
          </span>
          {reactions !== null ? <span className="ml-1 truncate text-[11px] text-[#6b7280] dark:text-white/65">{formatCount(reactions)}</span> : null}
        </div>
        <button type="button" onClick={() => onEcho ? onEcho(item) : open()} aria-label={t('savedPostGridCard.echo')} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:scale-95 dark:text-white/70">
          <img src="/assets/Icons/echo.svg" alt="" aria-hidden="true" className="h-[23px] w-[23px] object-contain opacity-70 dark:brightness-0 dark:invert" />
        </button>
      </div>
    </article>
  )
}
