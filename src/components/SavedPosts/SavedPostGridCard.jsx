import { Clapperboard, Heart, MoreHorizontal } from 'lucide-react'
import ReactionSummary from '../social/reactions/ReactionSummary'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('savedPostGridCard', {
  en: { echo: 'Echo', options: 'Saved post options', unavailable: 'Original unavailable', reactions: 'Reactions' },
  km: { echo: 'Echo', options: 'ជម្រើស Post ដែលបានរក្សាទុក', unavailable: 'មិនអាចបើក Post ដើម', reactions: 'Reaction' },
  zh: { echo: 'Echo', options: '已保存帖子选项', unavailable: '原帖不可用', reactions: '互动' },
  ja: { echo: 'Echo', options: '保存済み投稿のオプション', unavailable: '元の投稿は利用できません', reactions: 'リアクション' },
  ko: { echo: 'Echo', options: '저장한 게시물 옵션', unavailable: '원본 게시물 없음', reactions: '반응' },
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
    if (host === 'youtu.be' || host.endsWith('.youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || ''
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      return url.searchParams.get('v') || url.pathname.match(/\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/)?.[1] || ''
    }
  } catch {
    return ''
  }
  return ''
}

function formatCount(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export default function SavedPostGridCard({ item, onOpen, onMenu, onEcho }) {
  const { t } = useDisplayTranslation()
  const snapshot = item?.snapshot_data || {}
  const info = item?.card_data || null
  const isReel = item?.source_type === 'fast_video'
  const author = info?.name || (isReel ? '' : firstText(snapshot, [
    'page_name', 'author_name', 'reader_name', 'user_name', 'creator_name', 'name',
  ]))
  const avatar = info?.avatar_url || (isReel ? '' : firstText(snapshot, [
    'page_avatar_url', 'author_avatar_url', 'avatar_url', 'profile_image_url',
  ]))
  const title = info?.title || firstText(snapshot, ['title', 'post_title', 'headline'])
  const body = info?.content || firstText(snapshot, ['content', 'description', 'caption', 'text', 'message'])
  const videoUrl = firstText(snapshot, ['video_url', 'youtube_url', 'youtube_link'])
  const isVideo = isReel || Boolean(videoUrl) || snapshot?.media_type === 'video'
  const youtube = youtubeId(videoUrl)
  const cover = info?.image_url || firstImage(snapshot) || (isVideo && youtube ? `https://img.youtube.com/vi/${youtube}/hqdefault.jpg` : '')
  const caption = title && title !== author && body ? `${title}\n${body}` : body || (title !== author ? title : '')
  const likeCount = info?.like_count == null ? null : Math.max(0, Number(info.like_count) || 0)
  const reactionSummary = Array.isArray(info?.reaction_summary) ? info.reaction_summary : []
  const unavailable = item?.status === 'unavailable'
  const open = () => onOpen?.(item)

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-[#e9e9ec] bg-white dark:border-white/10 dark:bg-[#171923]">
      <div className="relative aspect-[4/5] overflow-hidden bg-white dark:bg-[#171923]">
        <button type="button" onClick={open} className="absolute inset-0 block h-full w-full text-left">
          {cover ? (
            <img src={cover} alt={title || author || ''} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="block h-full w-full bg-white px-3 pb-3 pt-[56px] dark:bg-[#171923]">
              <span className="line-clamp-[10] whitespace-pre-line break-words text-[12px] leading-[19px] text-[#22252c] dark:text-white/90">
                {body || title || ''}
              </span>
            </span>
          )}
        </button>

        {cover ? <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/65 to-transparent" /> : null}
        <div className="absolute inset-x-2 top-2 flex items-center gap-1.5">
          <button type="button" onClick={open} className={`flex min-w-0 flex-1 items-center gap-1.5 text-left ${cover ? 'text-white' : 'text-[#111827] dark:text-white'}`}>
            {avatar || author ? (
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[11px] font-bold text-[#6d4aff] ${cover ? 'ring-1 ring-white/80' : 'ring-1 ring-black/10 dark:ring-white/15'}`}>
                {avatar ? <img src={avatar} alt="" loading="lazy" className="h-full w-full object-cover" /> : author.slice(0, 1).toUpperCase()}
              </span>
            ) : <span className="h-7 w-7 shrink-0 rounded-full border border-[#ececf1] bg-white dark:border-white/10 dark:bg-white/10" />}
            <span className="min-w-0 truncate text-[11px] font-bold">{author}</span>
          </button>
          <button type="button" onClick={() => onMenu?.(item)} aria-label={t('savedPostGridCard.options')} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cover ? 'bg-black/30 text-white' : 'bg-white text-[#6b7280] dark:bg-white/10 dark:text-white/75'}`}>
            <MoreHorizontal size={16} strokeWidth={2} />
          </button>
        </div>

        {isVideo ? (
          <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/45 p-1 text-white">
            <Clapperboard size={16} strokeWidth={2.1} />
          </div>
        ) : null}
        {unavailable ? (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-center text-[10px] font-semibold text-white">
            {t('savedPostGridCard.unavailable')}
          </div>
        ) : null}
      </div>

      {cover && caption ? (
        <button type="button" onClick={open} className="min-h-[57px] w-full bg-white px-2.5 pb-1 pt-2 text-left dark:bg-[#171923]">
          <span className="line-clamp-2 whitespace-pre-line break-words text-[12px] font-medium leading-[19px] text-[#1f2937] dark:text-white/85">
            {caption}
          </span>
        </button>
      ) : null}

      <div className="mt-auto flex min-h-9 items-center justify-between gap-1.5 bg-white px-2.5 pb-1 pt-1 dark:bg-[#171923]">
        <div className="min-w-0 flex-1" aria-label={t('savedPostGridCard.reactions')}>
          {isReel ? (
            likeCount !== null ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#65676b] dark:text-white/65">
                <Heart size={16} strokeWidth={2} className="text-[#ff4566]" />
                <span>{formatCount(likeCount)}</span>
              </span>
            ) : null
          ) : likeCount !== null && reactionSummary.length > 0 ? (
            <ReactionSummary
              summary={reactionSummary}
              likeCount={likeCount}
              iconClassName="h-4 w-4"
              textClassName="ml-1 truncate text-[11px] text-[#65676b] dark:text-white/65"
            />
          ) : likeCount !== null && likeCount > 0 ? (
            <span className="text-[11px] text-[#65676b] dark:text-white/65">{formatCount(likeCount)}</span>
          ) : null}
        </div>
        <button type="button" onClick={() => onEcho?.(item)} disabled={!onEcho || unavailable || !info} aria-label={t('savedPostGridCard.echo')} className="flex h-7 w-7 shrink-0 items-center justify-center text-[#6b7280] active:scale-95 disabled:opacity-30 dark:text-white/70">
          <img src="/assets/Icons/echo.svg" alt="" aria-hidden="true" className="h-[17px] w-[17px] object-contain opacity-75 dark:brightness-0 dark:invert" />
        </button>
      </div>
    </article>
  )
}
