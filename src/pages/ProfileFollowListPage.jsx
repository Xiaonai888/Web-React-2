import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('profileFollowListPage', {
  en: {
    noFollowersYet: 'No followers yet',
    notFollowingAnyoneYet: 'Not following anyone yet',
    followersEmptyText: 'When people follow this reader, they will appear here.',
    followingEmptyText: 'Accounts this reader follows will appear here.',
    following: 'Following',
    followBack: 'Follow back',
    follow: 'Follow',
    authorAccount: 'Author account',
    readerAccount: 'Reader account',
    suggestedAuthor: 'Suggested author',
    suggestedReader: 'Suggested reader',
    hideSuggestion: 'Hide suggestion',
    closeAuthorMenu: 'Close author menu',
    messageAuthor: 'Message Author',
    muteUpdates: 'Mute updates',
    unfollowing: 'Unfollowing...',
    unfollowAuthor: 'Unfollow {{name}}',
    reportPage: 'Report Page',
    noFollowedAuthorsYet: 'No followed authors yet',
    followedAuthorsEmptyText: 'Author pages you follow will appear here.',
    followerOne: '{{count}} follower',
    followersMany: '{{count}} followers',
    works: '{{count}} works',
    authorActions: 'Author actions',
    popular: 'Popular',
    mostUpdated: 'Most Updated',
    recent: 'Recent',
    followedAuthorsCount: '{{count}} followed authors',
    followers: 'Followers',
    followedAuthors: 'Followed Authors',
    failedLoadFollowers: 'Failed to load followers',
    failedLoadFollowing: 'Failed to load following',
    failedLoadFollowedAuthors: 'Failed to load followed authors',
    failedUpdateFollow: 'Failed to update follow',
    failedUnfollowAuthor: 'Failed to unfollow author',
    goBack: 'Go back',
    readerConnections: 'Reader connections',
    searchAuthors: 'Search authors',
    searchReaders: 'Search readers',
    messageUnavailable: 'Message Author is not available yet.',
    muteUnavailable: 'Mute updates is not available yet.',
    reportUnavailable: 'Report Page is not available yet.',
    oldest: 'Oldest',
    readersCount: '{{count}} readers',
    reverseOrder: 'Reverse order',
    reverse: 'Reverse',
    readersYouMayKnow: 'Readers you may know',
    discoverCommunity: 'Discover readers and authors from the Shadow community.',
  },
  km: {
    noFollowersYet: 'មិនទាន់មានអ្នកតាមដាន',
    notFollowingAnyoneYet: 'មិនទាន់តាមដានអ្នកណា',
    followersEmptyText: 'ពេលមានអ្នកតាមដានអ្នកអាននេះ ពួកគេនឹងបង្ហាញនៅទីនេះ។',
    followingEmptyText: 'គណនីដែលអ្នកអាននេះតាមដាន នឹងបង្ហាញនៅទីនេះ។',
    following: 'កំពុងតាមដាន',
    followBack: 'តាមដានតប',
    follow: 'តាមដាន',
    authorAccount: 'គណនីអ្នកនិពន្ធ',
    readerAccount: 'គណនីអ្នកអាន',
    suggestedAuthor: 'អ្នកនិពន្ធដែលណែនាំ',
    suggestedReader: 'អ្នកអានដែលណែនាំ',
    hideSuggestion: 'លាក់ការណែនាំ',
    closeAuthorMenu: 'បិទម៉ឺនុយអ្នកនិពន្ធ',
    messageAuthor: 'ផ្ញើសារទៅអ្នកនិពន្ធ',
    muteUpdates: 'បិទសំឡេង Update',
    unfollowing: 'កំពុងឈប់តាមដាន...',
    unfollowAuthor: 'ឈប់តាមដាន {{name}}',
    reportPage: 'រាយការណ៍ Page',
    noFollowedAuthorsYet: 'មិនទាន់មានអ្នកនិពន្ធដែលបានតាមដាន',
    followedAuthorsEmptyText: 'Author Page ដែលអ្នកតាមដាននឹងបង្ហាញនៅទីនេះ។',
    followerOne: '{{count}} អ្នកតាមដាន',
    followersMany: '{{count}} អ្នកតាមដាន',
    works: '{{count}} ស្នាដៃ',
    authorActions: 'សកម្មភាពអ្នកនិពន្ធ',
    popular: 'ពេញនិយម',
    mostUpdated: 'Update ច្រើនបំផុត',
    recent: 'ថ្មីៗ',
    followedAuthorsCount: '{{count}} អ្នកនិពន្ធដែលបានតាមដាន',
    followers: 'អ្នកតាមដាន',
    followedAuthors: 'អ្នកនិពន្ធដែលបានតាមដាន',
    failedLoadFollowers: 'មិនអាចផ្ទុកអ្នកតាមដានបានទេ',
    failedLoadFollowing: 'មិនអាចផ្ទុកអ្នកដែលកំពុងតាមដានបានទេ',
    failedLoadFollowedAuthors: 'មិនអាចផ្ទុកអ្នកនិពន្ធដែលបានតាមដានបានទេ',
    failedUpdateFollow: 'មិនអាច Update ការតាមដានបានទេ',
    failedUnfollowAuthor: 'មិនអាចឈប់តាមដានអ្នកនិពន្ធបានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    readerConnections: 'ទំនាក់ទំនងអ្នកអាន',
    searchAuthors: 'ស្វែងរកអ្នកនិពន្ធ',
    searchReaders: 'ស្វែងរកអ្នកអាន',
    messageUnavailable: 'មុខងារផ្ញើសារទៅអ្នកនិពន្ធមិនទាន់អាចប្រើបានទេ។',
    muteUnavailable: 'មុខងារបិទសំឡេង Update មិនទាន់អាចប្រើបានទេ។',
    reportUnavailable: 'មុខងាររាយការណ៍ Page មិនទាន់អាចប្រើបានទេ។',
    oldest: 'ចាស់បំផុត',
    readersCount: '{{count}} អ្នកអាន',
    reverseOrder: 'បញ្ច្រាសលំដាប់',
    reverse: 'បញ្ច្រាស',
    readersYouMayKnow: 'អ្នកអានដែលអ្នកអាចស្គាល់',
    discoverCommunity: 'ស្វែងរកអ្នកអាន និងអ្នកនិពន្ធពីសហគមន៍ Shadow។',
  },
  zh: {
    noFollowersYet: '暂无关注者',
    notFollowingAnyoneYet: '尚未关注任何人',
    followersEmptyText: '当有人关注这位读者时，他们会显示在这里。',
    followingEmptyText: '这位读者关注的账号会显示在这里。',
    following: '已关注',
    followBack: '回关',
    follow: '关注',
    authorAccount: '作者账号',
    readerAccount: '读者账号',
    suggestedAuthor: '推荐作者',
    suggestedReader: '推荐读者',
    hideSuggestion: '隐藏推荐',
    closeAuthorMenu: '关闭作者菜单',
    messageAuthor: '联系作者',
    muteUpdates: '静音更新',
    unfollowing: '正在取消关注...',
    unfollowAuthor: '取消关注 {{name}}',
    reportPage: '举报页面',
    noFollowedAuthorsYet: '暂无关注的作者',
    followedAuthorsEmptyText: '你关注的 Author Page 会显示在这里。',
    followerOne: '{{count}} 位关注者',
    followersMany: '{{count}} 位关注者',
    works: '{{count}} 部作品',
    authorActions: '作者操作',
    popular: '热门',
    mostUpdated: '更新最多',
    recent: '最近',
    followedAuthorsCount: '已关注 {{count}} 位作者',
    followers: '关注者',
    followedAuthors: '关注的作者',
    failedLoadFollowers: '无法加载关注者',
    failedLoadFollowing: '无法加载关注列表',
    failedLoadFollowedAuthors: '无法加载关注的作者',
    failedUpdateFollow: '无法更新关注状态',
    failedUnfollowAuthor: '无法取消关注作者',
    goBack: '返回',
    readerConnections: '读者关系',
    searchAuthors: '搜索作者',
    searchReaders: '搜索读者',
    messageUnavailable: '联系作者功能暂不可用。',
    muteUnavailable: '静音更新功能暂不可用。',
    reportUnavailable: '举报页面功能暂不可用。',
    oldest: '最早',
    readersCount: '{{count}} 位读者',
    reverseOrder: '反转顺序',
    reverse: '反转',
    readersYouMayKnow: '你可能认识的读者',
    discoverCommunity: '发现 Shadow 社区中的读者和作者。',
  },
  ja: {
    noFollowersYet: 'フォロワーはまだいません',
    notFollowingAnyoneYet: 'まだ誰もフォローしていません',
    followersEmptyText: 'この読者をフォローする人がここに表示されます。',
    followingEmptyText: 'この読者がフォローしているアカウントがここに表示されます。',
    following: 'フォロー中',
    followBack: 'フォローバック',
    follow: 'フォロー',
    authorAccount: '作者アカウント',
    readerAccount: '読者アカウント',
    suggestedAuthor: 'おすすめ作者',
    suggestedReader: 'おすすめ読者',
    hideSuggestion: 'おすすめを非表示',
    closeAuthorMenu: '作者メニューを閉じる',
    messageAuthor: '作者にメッセージ',
    muteUpdates: '更新をミュート',
    unfollowing: 'フォロー解除中...',
    unfollowAuthor: '{{name}} のフォローを解除',
    reportPage: 'ページを報告',
    noFollowedAuthorsYet: 'フォロー中の作者はまだいません',
    followedAuthorsEmptyText: 'フォローした Author Page がここに表示されます。',
    followerOne: '{{count}} フォロワー',
    followersMany: '{{count}} フォロワー',
    works: '{{count}} 作品',
    authorActions: '作者アクション',
    popular: '人気',
    mostUpdated: '更新が多い順',
    recent: '最近',
    followedAuthorsCount: 'フォロー中の作者 {{count}} 人',
    followers: 'フォロワー',
    followedAuthors: 'フォロー中の作者',
    failedLoadFollowers: 'フォロワーを読み込めませんでした',
    failedLoadFollowing: 'フォロー中を読み込めませんでした',
    failedLoadFollowedAuthors: 'フォロー中の作者を読み込めませんでした',
    failedUpdateFollow: 'フォロー状態を更新できませんでした',
    failedUnfollowAuthor: '作者のフォローを解除できませんでした',
    goBack: '戻る',
    readerConnections: '読者のつながり',
    searchAuthors: '作者を検索',
    searchReaders: '読者を検索',
    messageUnavailable: '作者へのメッセージ機能はまだ利用できません。',
    muteUnavailable: '更新ミュート機能はまだ利用できません。',
    reportUnavailable: 'ページ報告機能はまだ利用できません。',
    oldest: '古い順',
    readersCount: '{{count}} 人の読者',
    reverseOrder: '順序を反転',
    reverse: '反転',
    readersYouMayKnow: '知り合いかもしれない読者',
    discoverCommunity: 'Shadow コミュニティの読者や作者を見つけましょう。',
  },
  ko: {
    noFollowersYet: '아직 팔로워가 없습니다',
    notFollowingAnyoneYet: '아직 아무도 팔로우하지 않습니다',
    followersEmptyText: '이 독자를 팔로우하는 사람이 여기에 표시됩니다.',
    followingEmptyText: '이 독자가 팔로우하는 계정이 여기에 표시됩니다.',
    following: '팔로잉',
    followBack: '맞팔로우',
    follow: '팔로우',
    authorAccount: '작가 계정',
    readerAccount: '독자 계정',
    suggestedAuthor: '추천 작가',
    suggestedReader: '추천 독자',
    hideSuggestion: '추천 숨기기',
    closeAuthorMenu: '작가 메뉴 닫기',
    messageAuthor: '작가에게 메시지',
    muteUpdates: '업데이트 알림 끄기',
    unfollowing: '팔로우 취소 중...',
    unfollowAuthor: '{{name}} 팔로우 취소',
    reportPage: '페이지 신고',
    noFollowedAuthorsYet: '아직 팔로우한 작가가 없습니다',
    followedAuthorsEmptyText: '팔로우한 Author Page가 여기에 표시됩니다.',
    followerOne: '팔로워 {{count}}명',
    followersMany: '팔로워 {{count}}명',
    works: '작품 {{count}}개',
    authorActions: '작가 작업',
    popular: '인기',
    mostUpdated: '업데이트 많은 순',
    recent: '최근',
    followedAuthorsCount: '팔로우한 작가 {{count}}명',
    followers: '팔로워',
    followedAuthors: '팔로우한 작가',
    failedLoadFollowers: '팔로워를 불러오지 못했습니다',
    failedLoadFollowing: '팔로잉 목록을 불러오지 못했습니다',
    failedLoadFollowedAuthors: '팔로우한 작가를 불러오지 못했습니다',
    failedUpdateFollow: '팔로우 상태를 업데이트하지 못했습니다',
    failedUnfollowAuthor: '작가 팔로우를 취소하지 못했습니다',
    goBack: '뒤로 가기',
    readerConnections: '독자 연결',
    searchAuthors: '작가 검색',
    searchReaders: '독자 검색',
    messageUnavailable: '작가에게 메시지 기능은 아직 사용할 수 없습니다.',
    muteUnavailable: '업데이트 알림 끄기 기능은 아직 사용할 수 없습니다.',
    reportUnavailable: '페이지 신고 기능은 아직 사용할 수 없습니다.',
    oldest: '오래된 순',
    readersCount: '독자 {{count}}명',
    reverseOrder: '순서 뒤집기',
    reverse: '뒤집기',
    readersYouMayKnow: '알 수도 있는 독자',
    discoverCommunity: 'Shadow 커뮤니티의 독자와 작가를 찾아보세요.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function Avatar({ item }) {
  const name = item?.name || item?.username || item?.page_name || item?.page_username || 'U'
  const imageUrl = item?.avatar_url || ''

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[16px] font-black text-white ring-1 ring-black/5">
      {imageUrl ? <img src={imageUrl} alt={name} className="h-full w-full object-cover" /> : String(name).slice(0, 1).toUpperCase()}
    </div>
  )
}

function EmptyState({ type }) {
  const { t } = useDisplayTranslation()
  const isFollowers = type === 'followers'

  return (
    <section className="px-4 py-6">
      <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] px-5 py-8 text-center ring-1 ring-[var(--shadow-border)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff8df] text-[#d49a00] dark:bg-[#f6b800]/10 dark:text-[#f6d56b] ring-1 ring-[#f6d56b]/50">
          <i className="fa-regular fa-user text-[24px]" />
        </div>
        <h2 className="mt-4 text-[17px] font-black text-[var(--shadow-text-primary)]">
          {isFollowers
            ? t('profileFollowListPage.noFollowersYet')
            : t('profileFollowListPage.notFollowingAnyoneYet')}
        </h2>
        <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
          {isFollowers
            ? t('profileFollowListPage.followersEmptyText')
            : t('profileFollowListPage.followingEmptyText')}
        </p>
      </div>
    </section>
  )
}

function UserRow({ user, type, isOwnList, onOpen, onToggleFollow }) {
  const { t } = useDisplayTranslation()
  const [loading, setLoading] = useState(false)
  const isFollowing = Boolean(user.is_following)
  const isFollowBack = isOwnList && type === 'followers' && Boolean(user.is_followed_by) && !isFollowing
  const label = isFollowing
    ? t('profileFollowListPage.following')
    : isFollowBack
      ? t('profileFollowListPage.followBack')
      : t('profileFollowListPage.follow')

  const handleClick = async (event) => {
    event.stopPropagation()
    if (loading) return
    try {
      setLoading(true)
      await onToggleFollow(user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={() => onOpen(user)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-[var(--shadow-bg-hover)]">
      <Avatar item={user} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[var(--shadow-text-primary)]">{user.name || user.username}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">@{user.username}</div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          {user.bio || (user.is_author
            ? t('profileFollowListPage.authorAccount')
            : t('profileFollowListPage.readerAccount'))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`h-9 min-w-[96px] rounded-full px-4 text-[12px] font-black active:scale-[0.98] disabled:opacity-60 ${
          isFollowing ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]' : isFollowBack ? 'bg-[#fff8df] text-[#9a6b00] ring-1 ring-[#f6b800]/45 dark:bg-[#f6b800]/10 dark:text-[#f6d56b]' : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
        }`}
      >
        {loading ? '...' : label}
      </button>
    </button>
  )
}

function SuggestedRow({ user, onHide, onOpen, onToggleFollow }) {
  const { t } = useDisplayTranslation()
  const [loading, setLoading] = useState(false)

  const handleFollow = async (event) => {
    event.stopPropagation()
    if (loading) return
    try {
      setLoading(true)
      await onToggleFollow(user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={() => onOpen(user)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-[var(--shadow-bg-hover)]">
      <Avatar item={user} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[var(--shadow-text-primary)]">{user.name || user.username}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">@{user.username}</div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          {user.is_author
            ? t('profileFollowListPage.suggestedAuthor')
            : t('profileFollowListPage.suggestedReader')}
        </div>
      </div>
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        className="h-9 min-w-[86px] rounded-full bg-[#111827] px-4 text-[12px] font-black text-white transition active:scale-[0.98] disabled:opacity-60 dark:bg-white dark:text-[#111827]"
      >
        {loading ? '...' : t('profileFollowListPage.follow')}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onHide(user.id)
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] transition active:bg-[var(--shadow-bg-hover)]"
        aria-label={t('profileFollowListPage.hideSuggestion')}
      >
        <i className="fa-solid fa-xmark text-[13px]" />
      </button>
    </button>
  )
}

function AuthorActionSheet({ author, loading, onClose, onMessage, onMute, onUnfollow, onReport }) {
  const { t } = useDisplayTranslation()

  if (!author) return null

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/35">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label={t('profileFollowListPage.closeAuthorMenu')} />
      <div className="relative w-full overflow-hidden rounded-t-[24px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-2xl md:max-w-[560px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        <div className="flex items-center gap-3 px-5 py-4">
          <Avatar item={author} />
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[15px] font-black text-[var(--shadow-text-primary)]">{author.page_name}</div>
            <div className="line-clamp-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">@{author.page_username}</div>
          </div>
        </div>
        <div className="border-t border-[var(--shadow-border)]">
          <button type="button" onClick={onMessage} className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-[var(--shadow-bg-hover)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"><i className="fa-regular fa-comment text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('profileFollowListPage.messageAuthor')}</span>
          </button>
          <button type="button" onClick={onMute} className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-[var(--shadow-bg-hover)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"><i className="fa-regular fa-bell-slash text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('profileFollowListPage.muteUpdates')}</span>
          </button>
          <button type="button" onClick={onUnfollow} disabled={loading} className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-[#e5484d]/10 disabled:opacity-60">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] dark:bg-[#e5484d]/10"><i className="fa-solid fa-user-minus text-[14px]" /></span>
            <span className="text-[15px] font-bold text-[#e5484d]">
              {loading
                ? t('profileFollowListPage.unfollowing')
                : t('profileFollowListPage.unfollowAuthor', {
                    name: author.page_name,
                  })}
            </span>
          </button>
          <button type="button" onClick={onReport} className="flex w-full items-center gap-3 px-5 py-4 text-left transition active:bg-[#f6b800]/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8df] text-[#9a6b00] dark:bg-[#f6b800]/10 dark:text-[#f6d56b]"><i className="fa-regular fa-flag text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[#9a6b00] dark:text-[#f6d56b]">{t('profileFollowListPage.reportPage')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function FollowedAuthorsEmpty() {
  const { t } = useDisplayTranslation()

  return (
    <section className="px-4 py-8">
      <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] px-5 py-10 text-center ring-1 ring-[var(--shadow-border)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff8df] text-[#d49a00] dark:bg-[#f6b800]/10 dark:text-[#f6d56b] ring-1 ring-[#f6d56b]/50">
          <i className="fa-solid fa-feather-pointed text-[23px]" />
        </div>
        <h2 className="mt-4 text-[17px] font-black text-[var(--shadow-text-primary)]">{t('profileFollowListPage.noFollowedAuthorsYet')}</h2>
        <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">{t('profileFollowListPage.followedAuthorsEmptyText')}</p>
      </div>
    </section>
  )
}

function FollowedAuthorRow({ author, onOpen, onMenu }) {
  const { t } = useDisplayTranslation()
  const followerCount = Number(author.total_followers || 0)
  const worksCount = Number(author.total_stories || 0)

  return (
    <button type="button" onClick={() => onOpen(author)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-[var(--shadow-bg-hover)]">
      <Avatar item={author} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[var(--shadow-text-primary)]">{author.page_name}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
          @{author.page_username} · {t(
            followerCount === 1
              ? 'profileFollowListPage.followerOne'
              : 'profileFollowListPage.followersMany',
            {
              count: followerCount.toLocaleString(),
            }
          )}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          {t('profileFollowListPage.works', {
            count: worksCount.toLocaleString(),
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onMenu(author)
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] transition active:bg-[var(--shadow-bg-hover)]"
        aria-label={t('profileFollowListPage.authorActions')}
      >
        <i className="fa-solid fa-ellipsis text-[16px]" />
      </button>
    </button>
  )
}

function FollowedAuthorsTab({ authors, total, sort, loading, message, selectedAuthor, actionLoading, onSortChange, onOpenAuthor, onOpenMenu, onCloseMenu, onMessage, onMute, onUnfollow, onReport }) {
  const { t } = useDisplayTranslation()
  const sortLabel =
    sort === 'popular'
      ? t('profileFollowListPage.popular')
      : sort === 'updated'
        ? t('profileFollowListPage.mostUpdated')
        : t('profileFollowListPage.recent')

  return (
    <section>
      <div className="flex items-center justify-between border-b border-[var(--shadow-border)] px-4 py-3">
        <div>
          <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{sortLabel}</div>
          <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
            {t('profileFollowListPage.followedAuthorsCount', {
              count: Number(total || 0).toLocaleString(),
            })}
          </div>
        </div>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="h-9 rounded-full bg-[var(--shadow-bg-soft)] px-3 text-[12px] font-black text-[var(--shadow-text-primary)] outline-none">
          <option value="recent">{t('profileFollowListPage.recent')}</option>
          <option value="popular">{t('profileFollowListPage.popular')}</option>
          <option value="updated">{t('profileFollowListPage.mostUpdated')}</option>
        </select>
      </div>
      {message ? <div className="mx-4 mt-4 rounded-[16px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-[#e5484d]/10">{message}</div> : null}
      {loading ? (
        <div className="space-y-3 px-4 py-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              </div>
            </div>
          ))}
        </div>
      ) : authors.length ? (
        <div className="divide-y divide-[var(--shadow-border)]">
          {authors.map((author) => (
            <FollowedAuthorRow key={author.id} author={author} onOpen={onOpenAuthor} onMenu={onOpenMenu} />
          ))}
        </div>
      ) : (
        <FollowedAuthorsEmpty />
      )}
      <AuthorActionSheet author={selectedAuthor} loading={actionLoading} onClose={onCloseMenu} onMessage={onMessage} onMute={onMute} onUnfollow={onUnfollow} onReport={onReport} />
    </section>
  )
}

export default function ProfileFollowListPage() {
  const navigate = useNavigate()
  const { username, listType } = useParams()
  const { t } = useDisplayTranslation()
  const storedUser = getStoredUser()
  const [users, setUsers] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [hiddenSuggestionIds, setHiddenSuggestionIds] = useState([])
  const [followedAuthors, setFollowedAuthors] = useState([])
  const [followedAuthorsTotal, setFollowedAuthorsTotal] = useState(0)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState('desc')
  const [authorSort, setAuthorSort] = useState('recent')
  const [loading, setLoading] = useState(true)
  const [authorsLoading, setAuthorsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [authorMessage, setAuthorMessage] = useState('')

  const safeType = listType === 'following' ? 'following' : listType === 'followed-authors' ? 'followed-authors' : 'followers'
  const isAuthorTab = safeType === 'followed-authors'
  const isOwnList = String(storedUser?.username || '').toLowerCase() === String(username || '').toLowerCase()

  const tabs = [
    { key: 'followers', labelKey: 'followers' },
    { key: 'following', labelKey: 'following' },
    { key: 'followed-authors', labelKey: 'followedAuthors' },
  ]

  const visibleUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const list = keyword
      ? users.filter((user) => {
          return String(user.name || '').toLowerCase().includes(keyword) || String(user.username || '').toLowerCase().includes(keyword) || String(user.bio || '').toLowerCase().includes(keyword)
        })
      : users

    return order === 'asc' ? [...list].reverse() : list
  }, [order, query, users])

  const visibleSuggestions = useMemo(() => {
    const hidden = new Set(hiddenSuggestionIds)
    return suggestedUsers.filter((user) => !hidden.has(user.id)).slice(0, 8)
  }, [hiddenSuggestionIds, suggestedUsers])

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (safeType === 'followed-authors') {
        setUsers([])
        setMessage('')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setMessage('')
        const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username || '')}/${safeType}?page=1&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              (safeType === 'following'
                ? t('profileFollowListPage.failedLoadFollowing')
                : t('profileFollowListPage.failedLoadFollowers'))
          )
        }
        if (!ignore) setUsers(Array.isArray(data.users) ? data.users : [])
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(
            error.message ||
              (safeType === 'following'
                ? t('profileFollowListPage.failedLoadFollowing')
                : t('profileFollowListPage.failedLoadFollowers'))
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [navigate, safeType, username])

  useEffect(() => {
    let ignore = false

    async function loadSuggestions() {
      const token = getAuthToken()
      if (!token || safeType === 'followed-authors') return

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/suggestions?page=1&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) return
        if (!ignore) {
          const alreadyShown = new Set(users.map((user) => user.id))
          const suggestions = (Array.isArray(data.users) ? data.users : []).filter((user) => user.id !== storedUser?.id).filter((user) => !alreadyShown.has(user.id))
          setSuggestedUsers(suggestions)
        }
      } catch {
        if (!ignore) setSuggestedUsers([])
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [safeType, storedUser?.id, users])

  useEffect(() => {
    let ignore = false

    async function loadFollowedAuthors() {
      const token = getAuthToken()
      if (!token || safeType !== 'followed-authors') return

      try {
        setAuthorsLoading(true)
        setAuthorMessage('')
        const params = new URLSearchParams({ page: '1', limit: '50', sort: authorSort })
        if (query.trim()) params.set('q', query.trim())
        const response = await fetch(`${API_BASE_URL}/api/authors/following?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) throw new Error(data.message || t('profileFollowListPage.failedLoadFollowedAuthors'))
        if (!ignore) {
          setFollowedAuthors(Array.isArray(data.author_pages) ? data.author_pages : [])
          setFollowedAuthorsTotal(Number(data.total || 0))
        }
      } catch (error) {
        if (!ignore) {
          setFollowedAuthors([])
          setFollowedAuthorsTotal(0)
          setAuthorMessage(error.message || t('profileFollowListPage.failedLoadFollowedAuthors'))
        }
      } finally {
        if (!ignore) setAuthorsLoading(false)
      }
    }

    loadFollowedAuthors()

    return () => {
      ignore = true
    }
  }, [authorSort, query, safeType])

  const handleBackToProfile = () => {
    navigate('/profile', { replace: true })
  }

  const handleOpenUser = (user) => {
    if (!user?.username) return
    if (String(user.username).toLowerCase() === String(storedUser?.username || '').toLowerCase()) {
      navigate('/profile')
      return
    }
    navigate(`/profile/${user.username}/followers`)
  }

  const handleOpenAuthor = (author) => {
    if (!author?.page_username) return
    navigate(`/author/page/${author.page_username}`)
  }

  const handleTabChange = (nextType) => {
    if (nextType === safeType) return
    setQuery('')
    navigate(`/profile/${username}/${nextType}`, { replace: true })
  }

  const handleToggleFollow = async (targetUser) => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login')
      return
    }
    const currentlyFollowing = Boolean(targetUser.is_following)
    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(targetUser.username)}/follow`, {
      method: currentlyFollowing ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || t('profileFollowListPage.failedUpdateFollow'))
    const updateUser = (user) => user.id === targetUser.id ? { ...user, is_following: !currentlyFollowing, can_follow_back: false } : user
    setUsers((current) => current.map(updateUser))
    setSuggestedUsers((current) => current.map(updateUser))
  }

  const handleUnfollowAuthor = async () => {
    const token = getAuthToken()
    if (!token || !selectedAuthor?.page_username) return

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(selectedAuthor.page_username)}/follow`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || t('profileFollowListPage.failedUnfollowAuthor'))
      setFollowedAuthors((current) => current.filter((author) => author.id !== selectedAuthor.id))
      setFollowedAuthorsTotal((current) => Math.max(0, Number(current || 0) - 1))
      setSelectedAuthor(null)
    } catch (error) {
      setAuthorMessage(error.message || t('profileFollowListPage.failedUnfollowAuthor'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleComingSoon = (text) => {
    setSelectedAuthor(null)
    setAuthorMessage(text)
  }

  return (
    <div className="app-page min-h-screen pb-[92px]">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <main className="mx-auto min-h-screen w-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] md:max-w-[560px] md:border-x md:border-[var(--shadow-border)]">
        <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <button type="button" onClick={handleBackToProfile} className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]" aria-label={t('profileFollowListPage.goBack')}>
              <i className="fas fa-chevron-left text-[16px]" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-1 text-[17px] font-black text-[var(--shadow-text-primary)]">@{username}</h1>
              <p className="mt-0.5 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{t('profileFollowListPage.readerConnections')}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-[var(--shadow-border)] text-center text-[12px] font-black text-[var(--shadow-text-primary)]">
  {tabs.map((tab) => (
    <button
      key={tab.key}
      type="button"
      onClick={() => handleTabChange(tab.key)}
      className={`relative py-3 transition ${
        safeType === tab.key ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
      }`}
    >
      <span className="line-clamp-1">{t(`profileFollowListPage.${tab.labelKey}`)}</span>
      {safeType === tab.key ? (
        <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#f6b800]" />
      ) : null}
    </button>
  ))}
</div>
          <div className="px-4 pb-3">
            <div className="flex h-11 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4">
              <i className="fas fa-search text-[13px] text-[var(--shadow-text-secondary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={isAuthorTab
                  ? t('profileFollowListPage.searchAuthors')
                  : t('profileFollowListPage.searchReaders')}
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
              />
            </div>
          </div>
        </header>

        {isAuthorTab ? (
          <FollowedAuthorsTab
            authors={followedAuthors}
            total={followedAuthorsTotal}
            sort={authorSort}
            loading={authorsLoading}
            message={authorMessage}
            selectedAuthor={selectedAuthor}
            actionLoading={actionLoading}
            onSortChange={setAuthorSort}
            onOpenAuthor={handleOpenAuthor}
            onOpenMenu={setSelectedAuthor}
            onCloseMenu={() => setSelectedAuthor(null)}
            onMessage={() => handleComingSoon(t('profileFollowListPage.messageUnavailable'))}
            onMute={() => handleComingSoon(t('profileFollowListPage.muteUnavailable'))}
            onUnfollow={handleUnfollowAuthor}
            onReport={() => handleComingSoon(t('profileFollowListPage.reportUnavailable'))}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[var(--shadow-border)] px-4 py-3">
              <div>
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">
                  {order === 'desc'
                    ? t('profileFollowListPage.recent')
                    : t('profileFollowListPage.oldest')}
                </div>
                <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('profileFollowListPage.readersCount', {
                    count: visibleUsers.length,
                  })}
                </div>
              </div>
              <button type="button" onClick={() => setOrder((current) => (current === 'desc' ? 'asc' : 'desc'))} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]" aria-label={t('profileFollowListPage.reverseOrder')}>
                <img
  src="/assets/Icons/Revers.svg"
  alt={t('profileFollowListPage.reverse')}
  className="h-4 w-4 dark:invert"
/>
              </button>
            </div>
            {message ? <button type="button" onClick={() => setMessage('')} className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d] dark:bg-[#e5484d]/10">{message}</button> : null}
            {loading ? (
              <div className="space-y-3 px-4 py-5">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                      <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {visibleUsers.length ? (
                  <div className="divide-y divide-[var(--shadow-border)]">
                    {visibleUsers.map((user) => (
                      <UserRow key={user.id} user={user} type={safeType} isOwnList={isOwnList} onOpen={handleOpenUser} onToggleFollow={handleToggleFollow} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type={safeType} />
                )}
                <section className="border-t border-[var(--shadow-border)] py-5">
                  <div className="px-4 pb-3">
                    <div className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('profileFollowListPage.readersYouMayKnow')}</div>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">{t('profileFollowListPage.discoverCommunity')}</p>
                  </div>
                  {visibleSuggestions.length ? (
                    <div className="divide-y divide-[var(--shadow-border)]">
                      {visibleSuggestions.map((user) => (
                        <SuggestedRow key={user.id} user={user} onOpen={handleOpenUser} onToggleFollow={handleToggleFollow} onHide={(id) => setHiddenSuggestionIds((current) => [...current, id])} />
                      ))}
                    </div>
                  ) : null}
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
