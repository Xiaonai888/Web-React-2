import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('socialInteractionUsersPage', {
  en: {
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
    episode: 'Episode',
    story: 'Story',
    authorPost: 'Author post',
    readerPost: 'Reader post',
    shadowMallPromotion: 'Shadow Mall promotion',
    reader: 'Reader',
    content: 'Content',
    followers: 'Followers',
    friends: 'Friends',
    closeReaders: 'Close readers',
    onlyMe: 'Only me',
    public: 'Public',
    justNow: 'Just now',
    minutes: '{{count}}m',
    hours: '{{count}}h',
    days: '{{count}}d',
    openProfile: 'Open {{name}} profile',
    echoesCount: '{{count}} echoes',
    openEchoedPost: 'Open echoed post',
    echoedThis: 'Echoed this',
    reactionOne: '{{count}} reaction',
    reactionsMany: '{{count}} reactions',
    commentOne: '{{count}} comment',
    commentsMany: '{{count}} comments',
    echoOne: '{{count}} echo',
    echoesMany: '{{count}} echoes',
    readersWhoEchoed: 'Readers who echoed this',
    peopleWhoReacted: 'People who reacted',
    unavailable: 'This interaction page is not available.',
    loadFailed: 'Failed to load people',
    cannotConnect: 'Cannot connect to backend.',
    all: 'All',
    goBack: 'Go back',
    reactionTotalOne: '{{count}} reaction',
    reactionTotalMany: '{{count}} reactions',
    echoTotalOne: '{{count}} Echo',
    echoTotalMany: '{{count}} Echoes',
    tryAgain: 'Try again',
    loading: 'Loading...',
    loadMore: 'Load more',
    noEchoes: 'No echoes yet',
    noReactions: 'No reactions yet',
    firstEcho: 'Be the first to echo this.',
    firstReact: 'Be the first to react to this post.',
  },
  km: {
    love: 'ស្រឡាញ់',
    haha: 'ហាហា',
    wow: 'ភ្ញាក់ផ្អើល',
    sad: 'សោកសៅ',
    angry: 'ខឹង',
    support: 'គាំទ្រ',
    touched: 'រំភើបចិត្ត',
    episode: 'ភាគ',
    story: 'រឿង',
    authorPost: 'Post របស់អ្នកនិពន្ធ',
    readerPost: 'Post របស់អ្នកអាន',
    shadowMallPromotion: 'ការផ្សព្វផ្សាយ Shadow Mall',
    reader: 'អ្នកអាន',
    content: 'ខ្លឹមសារ',
    followers: 'អ្នកតាមដាន',
    friends: 'មិត្តភក្តិ',
    closeReaders: 'អ្នកអានជិតស្និទ្ធ',
    onlyMe: 'ខ្ញុំតែប៉ុណ្ណោះ',
    public: 'សាធារណៈ',
    justNow: 'មុននេះបន្តិច',
    minutes: '{{count}} នាទី',
    hours: '{{count}} ម៉ោង',
    days: '{{count}} ថ្ងៃ',
    openProfile: 'បើក Profile របស់ {{name}}',
    echoesCount: '{{count}} Echoes',
    openEchoedPost: 'បើក Post ដែលបាន Echo',
    echoedThis: 'បាន Echo វា',
    reactionOne: '{{count}} Reaction',
    reactionsMany: '{{count}} Reactions',
    commentOne: '{{count}} មតិយោបល់',
    commentsMany: '{{count}} មតិយោបល់',
    echoOne: '{{count}} Echo',
    echoesMany: '{{count}} Echoes',
    readersWhoEchoed: 'អ្នកអានដែលបាន Echo',
    peopleWhoReacted: 'អ្នកដែលបាន React',
    unavailable: 'ទំព័រអន្តរកម្មនេះមិនអាចប្រើបានទេ។',
    loadFailed: 'មិនអាចផ្ទុកអ្នកប្រើបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។',
    all: 'ទាំងអស់',
    goBack: 'ត្រឡប់ក្រោយ',
    reactionTotalOne: '{{count}} Reaction',
    reactionTotalMany: '{{count}} Reactions',
    echoTotalOne: '{{count}} Echo',
    echoTotalMany: '{{count}} Echoes',
    tryAgain: 'សាកម្តងទៀត',
    loading: 'កំពុងផ្ទុក...',
    loadMore: 'ផ្ទុកបន្ថែម',
    noEchoes: 'មិនទាន់មាន Echo',
    noReactions: 'មិនទាន់មាន Reaction',
    firstEcho: 'ក្លាយជាអ្នកដំបូងដែល Echo វា។',
    firstReact: 'ក្លាយជាអ្នកដំបូងដែល React ទៅ Post នេះ។',
  },
  zh: {
    love: '喜欢',
    haha: '哈哈',
    wow: '惊讶',
    sad: '难过',
    angry: '生气',
    support: '支持',
    touched: '感动',
    episode: '章节',
    story: '故事',
    authorPost: '作者帖子',
    readerPost: '读者帖子',
    shadowMallPromotion: 'Shadow Mall 推广',
    reader: '读者',
    content: '内容',
    followers: '关注者',
    friends: '朋友',
    closeReaders: '亲密读者',
    onlyMe: '仅自己',
    public: '公开',
    justNow: '刚刚',
    minutes: '{{count}} 分钟',
    hours: '{{count}} 小时',
    days: '{{count}} 天',
    openProfile: '打开 {{name}} 的个人资料',
    echoesCount: '{{count}} 次 Echo',
    openEchoedPost: '打开 Echo 的帖子',
    echoedThis: 'Echo 了此内容',
    reactionOne: '{{count}} 个 Reaction',
    reactionsMany: '{{count}} 个 Reactions',
    commentOne: '{{count}} 条评论',
    commentsMany: '{{count}} 条评论',
    echoOne: '{{count}} 次 Echo',
    echoesMany: '{{count}} 次 Echo',
    readersWhoEchoed: 'Echo 此内容的读者',
    peopleWhoReacted: '做出 Reaction 的人',
    unavailable: '此互动页面不可用。',
    loadFailed: '无法加载用户',
    cannotConnect: '无法连接 Backend。',
    all: '全部',
    goBack: '返回',
    reactionTotalOne: '{{count}} 个 Reaction',
    reactionTotalMany: '{{count}} 个 Reactions',
    echoTotalOne: '{{count}} 次 Echo',
    echoTotalMany: '{{count}} 次 Echo',
    tryAgain: '重试',
    loading: '加载中...',
    loadMore: '加载更多',
    noEchoes: '暂无 Echo',
    noReactions: '暂无 Reaction',
    firstEcho: '成为第一个 Echo 此内容的人。',
    firstReact: '成为第一个对该帖子做出 Reaction 的人。',
  },
  ja: {
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
    episode: 'エピソード',
    story: 'ストーリー',
    authorPost: '作者の投稿',
    readerPost: '読者の投稿',
    shadowMallPromotion: 'Shadow Mall プロモーション',
    reader: '読者',
    content: 'コンテンツ',
    followers: 'フォロワー',
    friends: '友達',
    closeReaders: '親しい読者',
    onlyMe: '自分のみ',
    public: '公開',
    justNow: 'たった今',
    minutes: '{{count}}分',
    hours: '{{count}}時間',
    days: '{{count}}日',
    openProfile: '{{name}} のプロフィールを開く',
    echoesCount: '{{count}} Echo',
    openEchoedPost: 'Echo された投稿を開く',
    echoedThis: 'これを Echo しました',
    reactionOne: '{{count}} Reaction',
    reactionsMany: '{{count}} Reactions',
    commentOne: '{{count}} コメント',
    commentsMany: '{{count}} コメント',
    echoOne: '{{count}} Echo',
    echoesMany: '{{count}} Echo',
    readersWhoEchoed: 'Echo した読者',
    peopleWhoReacted: 'Reaction した人',
    unavailable: 'このインタラクションページは利用できません。',
    loadFailed: 'ユーザーを読み込めませんでした',
    cannotConnect: 'Backend に接続できません。',
    all: 'すべて',
    goBack: '戻る',
    reactionTotalOne: '{{count}} Reaction',
    reactionTotalMany: '{{count}} Reactions',
    echoTotalOne: '{{count}} Echo',
    echoTotalMany: '{{count}} Echo',
    tryAgain: '再試行',
    loading: '読み込み中...',
    loadMore: 'さらに読み込む',
    noEchoes: 'Echo はまだありません',
    noReactions: 'Reaction はまだありません',
    firstEcho: '最初に Echo してみましょう。',
    firstReact: '最初にこの投稿へ Reaction してみましょう。',
  },
  ko: {
    love: '좋아요',
    haha: '하하',
    wow: '놀라워요',
    sad: '슬퍼요',
    angry: '화나요',
    support: '응원해요',
    touched: '감동이에요',
    episode: '에피소드',
    story: '스토리',
    authorPost: '작가 게시물',
    readerPost: '독자 게시물',
    shadowMallPromotion: 'Shadow Mall 프로모션',
    reader: '독자',
    content: '콘텐츠',
    followers: '팔로워',
    friends: '친구',
    closeReaders: '친한 독자',
    onlyMe: '나만 보기',
    public: '공개',
    justNow: '방금',
    minutes: '{{count}}분',
    hours: '{{count}}시간',
    days: '{{count}}일',
    openProfile: '{{name}} 프로필 열기',
    echoesCount: '{{count}} Echo',
    openEchoedPost: 'Echo된 게시물 열기',
    echoedThis: '이 콘텐츠를 Echo했습니다',
    reactionOne: '{{count}} Reaction',
    reactionsMany: '{{count}} Reactions',
    commentOne: '{{count}} 댓글',
    commentsMany: '{{count}} 댓글',
    echoOne: '{{count}} Echo',
    echoesMany: '{{count}} Echo',
    readersWhoEchoed: 'Echo한 독자',
    peopleWhoReacted: 'Reaction한 사람',
    unavailable: '이 상호작용 페이지를 사용할 수 없습니다.',
    loadFailed: '사용자를 불러오지 못했습니다',
    cannotConnect: 'Backend에 연결할 수 없습니다.',
    all: '전체',
    goBack: '뒤로 가기',
    reactionTotalOne: '{{count}} Reaction',
    reactionTotalMany: '{{count}} Reactions',
    echoTotalOne: '{{count}} Echo',
    echoTotalMany: '{{count}} Echo',
    tryAgain: '다시 시도',
    loading: '불러오는 중...',
    loadMore: '더 불러오기',
    noEchoes: '아직 Echo가 없습니다',
    noReactions: '아직 Reaction이 없습니다',
    firstEcho: '첫 번째로 Echo해 보세요.',
    firstReact: '이 게시물에 첫 Reaction을 남겨보세요.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTION_META = {
  love: { label: 'Love', src: '/assets/React/Love.svg' },
  haha: { label: 'Haha', src: '/assets/React/Haha.svg' },
  wow: { label: 'Wow', src: '/assets/React/Wow.svg' },
  sad: { label: 'Sad', src: '/assets/React/Sad.svg' },
  angry: { label: 'Angry', src: '/assets/React/Angry.svg' },
  support: { label: 'Support', src: '/assets/React/Support.svg' },
  touched: { label: 'Touched', src: '/assets/React/Touched.svg' },
}

const REACTION_LABEL_KEYS = {
  love: 'love',
  haha: 'haha',
  wow: 'wow',
  sad: 'sad',
  angry: 'angry',
  support: 'support',
  touched: 'touched',
}

const SOURCE_LABELS = {
  episode: 'Episode',
  story: 'Story',
  author_post: 'Author post',
  reader_post: 'Reader post',
  shadow_mall_promotion: 'Shadow Mall promotion',
}

const SOURCE_LABEL_KEYS = {
  episode: 'episode',
  story: 'story',
  author_post: 'authorPost',
  reader_post: 'readerPost',
  shadow_mall_promotion: 'shadowMallPromotion',
}

const DISPLAY_LOCALES = {
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

function normalizeSourceType(value) {
  const type = String(value || '')
    .trim()
    .toLowerCase()
    .replaceAll('-', '_')

  return SOURCE_LABELS[type] ? type : ''
}

function normalizeInteractionType(value) {
  const type = String(value || '').trim().toLowerCase()

  if (type === 'like' || type === 'likes' || type === 'reaction' || type === 'reactions') {
    return 'like'
  }

  if (type === 'echo' || type === 'echoes' || type === 'share' || type === 'shares') {
    return 'echo'
  }

  return ''
}

function buildEndpoint(sourceType, interactionType, sourceId) {
  const id = encodeURIComponent(sourceId)

  if (interactionType === 'echo' && sourceType) {
    return `/api/echo-v2/source/${encodeURIComponent(sourceType)}/${id}`
  }

  if (sourceType === 'episode' && interactionType === 'like') {
    return `/api/reactions/episode/${id}`
  }

  if (sourceType === 'story' && interactionType === 'like') {
    return `/api/reactions/story/${id}/users`
  }

  if (sourceType === 'author_post' && interactionType === 'like') {
    return `/api/authors/page/posts/${id}/reactions`
  }

  if (sourceType === 'reader_post' && interactionType === 'like') {
    return `/api/reader-posts/${id}/reactions`
  }

  return ''
}

function normalizeUser(value, fallbackId = '') {
  const user = value || {}

  return {
    id: user.id || user.user_id || fallbackId,
    name: user.name || user.display_name || user.username || 'Reader',
    username: user.username || '',
    avatar_url: user.avatar_url || user.avatar || user.photo_url || '',
  }
}

function normalizeItem(item, interactionType) {
  const user = normalizeUser(
    item?.user || item?.reader || item?.profile || item,
    item?.user_id || ''
  )

  return {
    id:
      item?.id ||
      item?.echo_id ||
      `${user.id}-${item?.updated_at || item?.created_at || item?.reaction_type || interactionType}`,
    user,
    reaction_type: String(
      item?.reaction_type ||
        item?.type ||
        'love'
    ).toLowerCase(),
    created_at:
      item?.updated_at ||
      item?.created_at ||
      '',
    share_count: Math.max(
      1,
      Number(
        item?.share_count ||
          item?.echo_count ||
          1
      )
    ),
    content: String(
      item?.content ||
        item?.echo_text ||
        ''
    ).trim(),
    visibility:
      item?.audience ||
      item?.visibility ||
      'public',
    destination:
      item?.destination ||
      'feed',
    like_count: Number(
      item?.like_count || 0
    ),
    comment_count: Number(
      item?.comment_count || 0
    ),
    echo_count: Number(
      item?.echo_count || 0
    ),
    reader_post_id:
      item?.reader_post_id ||
      '',
    source:
      item?.source || null,
  }
}

function extractItems(data, interactionType) {
  const source =
    data?.reactions ||
    data?.echoes ||
    data?.users ||
    data?.items ||
    data?.results ||
    []

  return Array.isArray(source)
    ? source.map((item) => normalizeItem(item, interactionType))
    : []
}

function mergeUnique(current, incoming) {
  const result = []
  const seen = new Set()

  for (const item of [...current, ...incoming]) {
    const key = String(item?.id || `${item?.user?.id}-${item?.created_at}`)

    if (!key || seen.has(key)) continue

    seen.add(key)
    result.push(item)
  }

  return result
}

function formatInteractionTime(value, language, t) {
  const date = value ? new Date(value) : null

  if (!date || Number.isNaN(date.getTime())) return ''

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  )

  if (seconds < 60) return t('socialInteractionUsersPage.justNow')
  if (seconds < 3600) {
    return t('socialInteractionUsersPage.minutes', {
      count: Math.floor(seconds / 60),
    })
  }
  if (seconds < 86400) {
    return t('socialInteractionUsersPage.hours', {
      count: Math.floor(seconds / 3600),
    })
  }
  if (seconds < 604800) {
    return t('socialInteractionUsersPage.days', {
      count: Math.floor(seconds / 86400),
    })
  }

  return date.toLocaleDateString(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en,
    {
      day: '2-digit',
      month: 'short',
      year:
        date.getFullYear() === new Date().getFullYear()
          ? undefined
          : 'numeric',
    }
  )
}

function getDisplayUserName(user, t) {
  return user.name === 'Reader'
    ? t('socialInteractionUsersPage.reader')
    : user.name
}

function getDisplaySourceLabel(sourceType, fallback, t) {
  const key = SOURCE_LABEL_KEYS[sourceType]

  return key
    ? t(`socialInteractionUsersPage.${key}`)
    : fallback
}

function getDisplayReactionLabel(type, fallback, t) {
  const key = REACTION_LABEL_KEYS[type]

  return key
    ? t(`socialInteractionUsersPage.${key}`)
    : fallback
}

function Avatar({ user }) {
  const { t } = useDisplayTranslation()
  const displayName = getDisplayUserName(user, t)

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={displayName}
        className="h-12 w-12 rounded-full object-cover ring-1 ring-black/5"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[15px] font-bold text-white">
      {displayName.slice(0, 1).toUpperCase()}
    </div>
  )
}

function EchoSourcePreview({
  source,
  onOpen,
}) {
  const { t } = useDisplayTranslation()

  if (!source) return null

  const imageUrl =
    source.image_url ||
    source.image_urls?.[0] ||
    ''

  const ownerName =
    source.owner?.page_name ||
    source.owner?.name ||
    source.owner?.username ||
    ''

  const label =
    SOURCE_LABELS[source.type] ||
    source.label ||
    'Content'
  const displayLabel =
    SOURCE_LABELS[source.type]
      ? getDisplaySourceLabel(
          source.type,
          label,
          t
        )
      : label === 'Content'
        ? t('socialInteractionUsersPage.content')
        : label

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[16px] border border-[#e5e7eb] bg-white p-3 text-left active:bg-[#f8fafc]"
    >
      <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f3f4f6]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <i className="fa-regular fa-image text-[20px] text-[#98a2b3]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold text-[#111827]">
          {source.name || displayLabel}
        </div>

        <div className="mt-1 truncate text-[11px] font-medium text-[#98a2b3]">
          {displayLabel}
          {ownerName
            ? ` · ${ownerName}`
            : ''}
        </div>

        {source.content ? (
          <div className="mt-1 line-clamp-1 text-[12px] text-[#667085]">
            {source.content}
          </div>
        ) : null}
      </div>

      <i className="fa-solid fa-chevron-right text-[11px] text-[#c1c7d0]" />
    </button>
  )
}

function getEchoVisibilityMeta(value, t) {
  const visibility = String(value || 'public')
    .trim()
    .toLowerCase()

  if (visibility === 'followers') {
    return {
      label: t('socialInteractionUsersPage.followers'),
      icon: 'fa-user-group',
    }
  }

  if (visibility === 'friends') {
    return {
      label: t('socialInteractionUsersPage.friends'),
      icon: 'fa-user-group',
    }
  }

  if (
    visibility === 'close-readers' ||
    visibility === 'close_readers'
  ) {
    return {
      label: t('socialInteractionUsersPage.closeReaders'),
      icon: 'fa-star',
    }
  }

  if (
    visibility === 'only_me' ||
    visibility === 'private'
  ) {
    return {
      label: t('socialInteractionUsersPage.onlyMe'),
      icon: 'fa-lock',
    }
  }

  return {
    label: t('socialInteractionUsersPage.public'),
    icon: 'fa-earth-americas',
  }
}

function EchoPostCard({
  item,
  onOpenProfile,
  onOpenPost,
}) {
  const { language, t } = useDisplayTranslation()
  const time =
    formatInteractionTime(
      item.created_at,
      language,
      t
    )
  const visibility =
    getEchoVisibilityMeta(
      item.visibility,
      t
    )
  const canOpenProfile =
    Boolean(item.user?.username)
  const hasStats =
    item.like_count > 0 ||
    item.comment_count > 0 ||
    item.echo_count > 0
  const displayName = getDisplayUserName(item.user, t)

  return (
    <article className="border-b border-[#eef1f5] py-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onOpenProfile}
          disabled={!canOpenProfile}
          className="shrink-0 rounded-full disabled:cursor-default"
          aria-label={t('socialInteractionUsersPage.openProfile', {
            name: displayName,
          })}
        >
          <Avatar user={item.user} />
        </button>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenProfile}
            disabled={!canOpenProfile}
            className="block max-w-full truncate text-left text-[15px] font-semibold text-[#111827] disabled:cursor-default"
          >
            {displayName}
          </button>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#98a2b3]">
            {time ? <span>{time}</span> : null}
            {time ? <span>·</span> : null}
            <i
              className={`fa-solid ${visibility.icon} text-[10px]`}
            />
            <span>{visibility.label}</span>
            {item.share_count > 1 ? (
              <>
                <span>·</span>
                <span>
                  {t('socialInteractionUsersPage.echoesCount', {
                    count: item.share_count.toLocaleString(),
                  })}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPost}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#98a2b3] active:bg-[#f3f4f6]"
          aria-label={t('socialInteractionUsersPage.openEchoedPost')}
        >
          <i className="fa-solid fa-chevron-right text-[11px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenPost}
        className="mt-3 block w-full text-left"
      >
        {item.content ? (
          <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[#111827]">
            {item.content}
          </p>
        ) : (
          <p className="text-[13px] font-medium text-[#667085]">
            {t('socialInteractionUsersPage.echoedThis')}
          </p>
        )}
      </button>

      {hasStats ? (
        <div className="mt-3 flex items-center gap-3 border-t border-[#f2f4f7] pt-2.5 text-[11px] font-medium text-[#98a2b3]">
          {item.like_count > 0 ? (
            <span>
              {t(
                item.like_count === 1
                  ? 'socialInteractionUsersPage.reactionOne'
                  : 'socialInteractionUsersPage.reactionsMany',
                {
                  count: item.like_count.toLocaleString(),
                }
              )}
            </span>
          ) : null}

          {item.comment_count > 0 ? (
            <span>
              {t(
                item.comment_count === 1
                  ? 'socialInteractionUsersPage.commentOne'
                  : 'socialInteractionUsersPage.commentsMany',
                {
                  count: item.comment_count.toLocaleString(),
                }
              )}
            </span>
          ) : null}

          {item.echo_count > 0 ? (
            <span>
              {t(
                item.echo_count === 1
                  ? 'socialInteractionUsersPage.echoOne'
                  : 'socialInteractionUsersPage.echoesMany',
                {
                  count: item.echo_count.toLocaleString(),
                }
              )}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export default function SocialInteractionUsersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { t } = useDisplayTranslation()
  const sourceType = normalizeSourceType(params.sourceType)
  const interactionType = normalizeInteractionType(params.interactionType)
  const sourceId = String(params.sourceId || '').trim()
  const endpoint = useMemo(
    () => buildEndpoint(sourceType, interactionType, sourceId),
    [sourceId, sourceType, interactionType]
  )

  const [items, setItems] = useState([])
  const [source, setSource] = useState(null)
  const [counts, setCounts] = useState({})
  const [activeReaction, setActiveReaction] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [shareTotal, setShareTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')

  const title =
    interactionType === 'echo'
      ? t('socialInteractionUsersPage.readersWhoEchoed')
      : t('socialInteractionUsersPage.peopleWhoReacted')

  const sourceLabel = SOURCE_LABELS[sourceType] || 'Content'
  const displaySourceLabel =
    SOURCE_LABELS[sourceType]
      ? getDisplaySourceLabel(
          sourceType,
          sourceLabel,
          t
        )
      : t('socialInteractionUsersPage.content')
  const sourceName =
    location.state?.sourceName ||
    location.state?.title ||
    ''

  const loadPage = useCallback(
    async (nextPage, append = false) => {
      if (!endpoint) {
        setItems([])
        setLoading(false)
        setMessage(t('socialInteractionUsersPage.unavailable'))
        return
      }

      append ? setLoadingMore(true) : setLoading(true)
      setMessage('')

      try {
        const token = getReaderToken()
        const query =
          `?page=${nextPage}&limit=50`
        const response = await fetch(
          `${API_BASE_URL}${endpoint}${query}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            cache: 'no-store',
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              t('socialInteractionUsersPage.loadFailed')
          )
        }

        const nextItems = extractItems(data, interactionType)
        if (interactionType === 'echo') {
          setSource(
            data.source ||
              nextItems[0]?.source ||
              null
          )
        }
        const nextTotal = Math.max(
          0,
          Number(
            data.total ??
              data.count ??
              data.total_likes ??
              data.total_echoes ??
              nextItems.length
          )
        )

        setItems((current) =>
          append
            ? mergeUnique(current, nextItems)
            : nextItems
        )
        setCounts(
          data.counts && typeof data.counts === 'object'
            ? data.counts
            : {}
        )
        setPage(Math.max(1, Number(data.page || nextPage)))
        setTotal(nextTotal)
        setShareTotal(
          interactionType === 'echo'
            ? Math.max(
                nextTotal,
                Number(data.echo_count ?? nextTotal)
              )
            : nextTotal
        )
        setHasMore(
          typeof data.has_more === 'boolean'
            ? data.has_more
            : nextPage * 50 < nextTotal
        )
      } catch (error) {
        if (!append) setItems([])
        setMessage(
          error.message === 'Failed to fetch'
            ? t('socialInteractionUsersPage.cannotConnect')
            : error.message ||
                t('socialInteractionUsersPage.loadFailed')
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [endpoint, interactionType]
  )

  useEffect(() => {
    setItems([])
    setCounts({})
    setActiveReaction('all')
    setSource(null)
    setPage(1)
    setTotal(0)
    setShareTotal(0)
    setHasMore(false)
    loadPage(1)
  }, [loadPage])

  const reactionTabs = useMemo(() => {
    if (interactionType !== 'like') return []

    const available = Object.entries(REACTION_META)
      .filter(([type]) => Number(counts[type] || 0) > 0)
      .map(([type, meta]) => ({
        type,
        label: meta.label,
        src: meta.src,
        count: Number(counts[type] || 0),
      }))

    return [
      {
        type: 'all',
        label: 'All',
        src: '',
        count: total,
      },
      ...available,
    ]
  }, [counts, interactionType, total])

  const visibleItems = useMemo(() => {
    if (interactionType !== 'like' || activeReaction === 'all') {
      return items
    }

    return items.filter(
      (item) => item.reaction_type === activeReaction
    )
  }, [activeReaction, interactionType, items])

  const openProfile = (user) => {
    if (!user?.username) return

    navigate(
      `/profile?username=${encodeURIComponent(user.username)}`
    )
  }

  const openSourceUrl = (url) => {
    const value = String(url || '').trim()

    if (!value) return false

    if (/^https?:\/\//i.test(value)) {
      window.open(
        value,
        '_blank',
        'noopener,noreferrer'
      )
      return true
    }

    navigate(value)
    return true
  }

  const openEchoPost = (item) => {
    if (
      openSourceUrl(
        item?.source?.url
      )
    ) {
      return
    }

    const username = String(
      item?.user?.username || ''
    ).trim()
    const postId = String(
      item?.reader_post_id || ''
    ).trim()

    if (username && postId) {
      navigate(
        `/profile?username=${encodeURIComponent(username)}#reader-post-${encodeURIComponent(postId)}`
      )
      return
    }

    openProfile(item?.user)
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[44px_1fr_44px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label={t('socialInteractionUsersPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="min-w-0 text-center">
  <h1 className="truncate text-[17px] font-semibold text-[#111827]">
    {title}
  </h1>

  {interactionType !== 'echo' ? (
    <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#98a2b3]">
      {sourceName || displaySourceLabel}
    </p>
  ) : null}
</div>

          <div className="h-10 w-10" />
        </div>

        {reactionTabs.length > 1 ? (
          <div className="overflow-x-auto">
            <div className="mx-auto flex min-w-max max-w-3xl px-3">
              {reactionTabs.map((tab) => {
                const active = activeReaction === tab.type
                const tabLabel =
                  tab.type === 'all'
                    ? t('socialInteractionUsersPage.all')
                    : getDisplayReactionLabel(
                        tab.type,
                        tab.label,
                        t
                      )

                return (
                  <button
                    key={tab.type}
                    type="button"
                    onClick={() => setActiveReaction(tab.type)}
                    className={`relative flex h-14 items-center gap-1.5 px-3 text-[13px] font-semibold ${
                      active
                        ? 'text-[#111827]'
                        : 'text-[#98a2b3]'
                    }`}
                  >
                    {tab.src ? (
                      <img
                        src={tab.src}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : null}
                    <span>{tabLabel}</span>
                    <span>{tab.count.toLocaleString()}</span>
                    {active ? (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#111827] dark:bg-[#a78bfa]" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
     </header>

      {interactionType === 'echo' ? (
  <section className="mx-auto max-w-3xl px-4 pt-4">
    <EchoSourcePreview
      source={source}
      onOpen={() =>
        openSourceUrl(source?.url)
      }
    />
  </section>
) : null}

      {interactionType === 'like' ? (
  <section className="mx-auto max-w-3xl px-4 pb-1 pt-4">
    <div className="text-[15px] font-bold text-[#111827]">
      {t(
        total === 1
          ? 'socialInteractionUsersPage.reactionTotalOne'
          : 'socialInteractionUsersPage.reactionTotalMany',
        {
          count: total.toLocaleString(),
        }
      )}
    </div>
  </section>
) : null}

{interactionType === 'echo' ? (
  <section className="mx-auto max-w-3xl px-4 pb-1 pt-4">
    <div className="text-[15px] font-bold text-[#111827]">
  {t(
    shareTotal === 1
      ? 'socialInteractionUsersPage.echoTotalOne'
      : 'socialInteractionUsersPage.echoTotalMany',
    {
      count: shareTotal.toLocaleString(),
    }
  )}
</div>

  </section>
) : null}

<section className="mx-auto max-w-3xl px-4 py-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 py-3"
              >
                <div className="h-12 w-12 rounded-full bg-[#eef1f5]" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-36 rounded-full bg-[#eef1f5]" />
                  <div className="mt-2 h-3 w-24 rounded-full bg-[#f3f4f6]" />
                </div>
              </div>
            ))}
          </div>
        ) : message ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
              <i className="fa-solid fa-triangle-exclamation text-[21px]" />
            </div>
            <div className="mt-4 text-[14px] font-semibold text-[#667085]">
              {message}
            </div>
            <button
              type="button"
              onClick={() => loadPage(1)}
              className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-bold text-white active:scale-95 dark:bg-[#7c3aed]"
            >
              {t('socialInteractionUsersPage.tryAgain')}
            </button>
          </div>
        ) : visibleItems.length ? (
          <div>
            {visibleItems.map((item) => {
              if (interactionType === 'echo') {
                return (
                  <EchoPostCard
                    key={item.id}
                    item={item}
                    onOpenProfile={() =>
                      openProfile(item.user)
                    }
                    onOpenPost={() =>
                      openEchoPost(item)
                    }
                  />
                )
              }

              const meta =
                REACTION_META[item.reaction_type] ||
                REACTION_META.love
              const canOpenProfile =
                Boolean(item.user.username)
              const displayName =
                getDisplayUserName(item.user, t)
              const reactionLabel =
                getDisplayReactionLabel(
                  item.reaction_type,
                  meta.label,
                  t
                )

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    openProfile(item.user)
                  }
                  disabled={!canOpenProfile}
                  className="flex w-full items-center gap-3 border-b border-[#f2f4f7] py-3 text-left active:bg-[#f8fafc] disabled:cursor-default"
                >
                  <div className="relative shrink-0">
                    <Avatar user={item.user} />
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                      <img
                        src={meta.src}
                        alt={reactionLabel}
                        className="h-5 w-5 object-contain"
                      />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold">
                      {displayName}
                    </div>

                    {item.user.username ? (
                      <div className="mt-0.5 truncate text-[12px] font-medium text-[#98a2b3]">
                        @{item.user.username}
                      </div>
                    ) : null}
                  </div>

                  {canOpenProfile ? (
                    <i className="fa-solid fa-chevron-right text-[10px] text-[#c1c7d0]" />
                  ) : null}
                </button>
              )
            })}

            {hasMore ? (
              <button
                type="button"
                onClick={() => loadPage(page + 1, true)}
                disabled={loadingMore}
                className="mt-4 h-11 w-full rounded-full bg-[#f3f4f6] text-[13px] font-semibold text-[#111827] active:scale-[0.99] disabled:opacity-60"
              >
                {loadingMore
                  ? t('socialInteractionUsersPage.loading')
                  : t('socialInteractionUsersPage.loadMore')}
              </button>
            ) : null}

          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i
                className={`fa-solid ${
                  interactionType === 'echo'
                    ? 'fa-rotate'
                    : 'fa-heart'
                } text-[21px]`}
              />
            </div>
            <div className="mt-4 text-[16px] font-semibold">
  {interactionType === 'echo'
    ? t('socialInteractionUsersPage.noEchoes')
    : t('socialInteractionUsersPage.noReactions')}
</div>

<p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-5 text-[#98a2b3]">
  {interactionType === 'echo'
    ? t('socialInteractionUsersPage.firstEcho')
    : t('socialInteractionUsersPage.firstReact')}
</p>
          </div>
        )}
      </section>
    </main>
  )
}
