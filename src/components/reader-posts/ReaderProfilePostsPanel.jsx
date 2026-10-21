import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderPostCard from './ReaderPostCard'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerProfilePosts', {
  en: {
    setupTitle: 'Build your reader space',
    completed: '{{count}} of 4 completed',
    nameTitle: 'Add your reader name',
    nameDescription: 'Choose how readers will know you.',
    addName: 'Add name',
    editName: 'Edit name',
    avatarTitle: 'Add a profile photo',
    avatarDescription: 'Help people recognize your profile.',
    addPhoto: 'Add photo',
    changePhoto: 'Change photo',
    bioTitle: 'Write your bio',
    bioDescription: 'Tell readers a little about yourself.',
    addBio: 'Add bio',
    editBio: 'Edit bio',
    followingTitle: 'Find your reading circle',
    followingDescription: 'Follow readers and authors you enjoy.',
    explorePeople: 'Explore people',
    findMore: 'Find more',
    loadFailed: 'Failed to load posts',
    noPosts: 'No posts yet',
    ownEmpty: 'Share your first thought and it will appear here.',
    otherEmpty: 'This reader has not shared any posts yet.',
    createPost: 'Create a post',
  },
  km: {
    setupTitle: 'បង្កើតកន្លែងអ្នកអានរបស់អ្នក',
    completed: 'បានបញ្ចប់ {{count}} ក្នុងចំណោម 4',
    nameTitle: 'បន្ថែមឈ្មោះអ្នកអាន',
    nameDescription: 'ជ្រើសឈ្មោះដែលអ្នកអានផ្សេងទៀតនឹងស្គាល់អ្នក។',
    addName: 'បន្ថែមឈ្មោះ',
    editName: 'កែឈ្មោះ',
    avatarTitle: 'បន្ថែមរូបប្រវត្តិរូប',
    avatarDescription: 'ជួយឱ្យអ្នកដទៃងាយស្គាល់ប្រវត្តិរូបរបស់អ្នក។',
    addPhoto: 'បន្ថែមរូប',
    changePhoto: 'ប្តូររូប',
    bioTitle: 'សរសេរជីវប្រវត្តិខ្លី',
    bioDescription: 'ប្រាប់អ្នកអានបន្តិចអំពីខ្លួនអ្នក។',
    addBio: 'បន្ថែមជីវប្រវត្តិ',
    editBio: 'កែជីវប្រវត្តិ',
    followingTitle: 'ស្វែងរកសហគមន៍អានរបស់អ្នក',
    followingDescription: 'តាមដានអ្នកអាន និងអ្នកនិពន្ធដែលអ្នកចូលចិត្ត។',
    explorePeople: 'ស្វែងរកអ្នកអាន',
    findMore: 'ស្វែងរកបន្ថែម',
    loadFailed: 'មិនអាចផ្ទុក Post បានទេ',
    noPosts: 'មិនទាន់មាន Post',
    ownEmpty: 'ចែករំលែកគំនិតដំបូងរបស់អ្នក ហើយវានឹងបង្ហាញនៅទីនេះ។',
    otherEmpty: 'អ្នកអាននេះមិនទាន់បានចែករំលែក Post ទេ។',
    createPost: 'បង្កើត Post',
  },
  zh: {
    setupTitle: '完善你的读者空间',
    completed: '已完成 {{count}} / 4',
    nameTitle: '添加读者名称',
    nameDescription: '选择其他读者认识你的方式。',
    addName: '添加名称',
    editName: '编辑名称',
    avatarTitle: '添加个人头像',
    avatarDescription: '帮助其他人识别你的个人资料。',
    addPhoto: '添加照片',
    changePhoto: '更换照片',
    bioTitle: '填写简介',
    bioDescription: '向读者简单介绍一下自己。',
    addBio: '添加简介',
    editBio: '编辑简介',
    followingTitle: '寻找你的阅读圈',
    followingDescription: '关注你喜欢的读者和作者。',
    explorePeople: '发现用户',
    findMore: '查看更多',
    loadFailed: '无法加载帖子',
    noPosts: '暂无帖子',
    ownEmpty: '分享你的第一个想法，它会显示在这里。',
    otherEmpty: '该读者还没有分享任何帖子。',
    createPost: '创建帖子',
  },
  ja: {
    setupTitle: '読者スペースを完成させる',
    completed: '4 件中 {{count}} 件完了',
    nameTitle: '読者名を追加',
    nameDescription: '他の読者に表示する名前を選びます。',
    addName: '名前を追加',
    editName: '名前を編集',
    avatarTitle: 'プロフィール写真を追加',
    avatarDescription: 'プロフィールを見つけやすくします。',
    addPhoto: '写真を追加',
    changePhoto: '写真を変更',
    bioTitle: '自己紹介を書く',
    bioDescription: '読者に自分のことを少し紹介しましょう。',
    addBio: '自己紹介を追加',
    editBio: '自己紹介を編集',
    followingTitle: '読書仲間を見つける',
    followingDescription: '好きな読者や作者をフォローしましょう。',
    explorePeople: '読者を探す',
    findMore: 'もっと探す',
    loadFailed: '投稿を読み込めませんでした',
    noPosts: 'まだ投稿はありません',
    ownEmpty: '最初の投稿を共有すると、ここに表示されます。',
    otherEmpty: 'この読者はまだ投稿していません。',
    createPost: '投稿を作成',
  },
  ko: {
    setupTitle: '독자 공간 완성하기',
    completed: '4개 중 {{count}}개 완료',
    nameTitle: '독자 이름 추가',
    nameDescription: '다른 독자에게 표시될 이름을 선택하세요.',
    addName: '이름 추가',
    editName: '이름 수정',
    avatarTitle: '프로필 사진 추가',
    avatarDescription: '사람들이 내 프로필을 쉽게 알아볼 수 있게 하세요.',
    addPhoto: '사진 추가',
    changePhoto: '사진 변경',
    bioTitle: '소개 작성',
    bioDescription: '독자들에게 자신을 간단히 소개하세요.',
    addBio: '소개 추가',
    editBio: '소개 수정',
    followingTitle: '독서 친구 찾기',
    followingDescription: '좋아하는 독자와 작가를 팔로우하세요.',
    explorePeople: '사람 찾기',
    findMore: '더 찾기',
    loadFailed: '게시물을 불러오지 못했습니다',
    noPosts: '아직 게시물이 없습니다',
    ownEmpty: '첫 생각을 공유하면 여기에 표시됩니다.',
    otherEmpty: '이 독자는 아직 게시물을 공유하지 않았습니다.',
    createPost: '게시물 만들기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function ReaderProfileSetupSection({
  user,
  onEditAvatar,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const items = [
    {
      key: 'name',
      complete: Boolean(
        String(user?.name || '').trim()
      ),
      icon: 'fa-regular fa-user',
      title: t('readerProfilePosts.nameTitle'),
      description: t('readerProfilePosts.nameDescription'),
      pendingLabel: t('readerProfilePosts.addName'),
      completeLabel: t('readerProfilePosts.editName'),
      action: () =>
        navigate('/profile/edit'),
    },
    {
      key: 'avatar',
      complete: Boolean(
        user?.avatar_url
      ),
      icon:
        'fa-regular fa-circle-user',
      title: t('readerProfilePosts.avatarTitle'),
      description: t('readerProfilePosts.avatarDescription'),
      pendingLabel: t('readerProfilePosts.addPhoto'),
      completeLabel: t('readerProfilePosts.changePhoto'),
      action: () => {
        if (onEditAvatar) {
          onEditAvatar()
          return
        }

        navigate('/profile/edit')
      },
    },
    {
      key: 'bio',
      complete: Boolean(
        String(user?.bio || '').trim()
      ),
      icon: 'fa-regular fa-comment',
      title: t('readerProfilePosts.bioTitle'),
      description: t('readerProfilePosts.bioDescription'),
      pendingLabel: t('readerProfilePosts.addBio'),
      completeLabel: t('readerProfilePosts.editBio'),
      action: () =>
        navigate('/profile/edit'),
    },
    {
      key: 'following',
      complete:
        Number(
          user?.following_count || 0
        ) > 0,
      icon:
        'fa-solid fa-user-group',
      title: t('readerProfilePosts.followingTitle'),
      description: t('readerProfilePosts.followingDescription'),
      pendingLabel: t('readerProfilePosts.explorePeople'),
      completeLabel: t('readerProfilePosts.findMore'),
      action: () =>
        navigate(
          '/profile/discover-people'
        ),
    },
  ]

  const completedCount =
    items.filter(
      (item) => item.complete
    ).length

  return (
    <section className="mt-3 bg-[var(--shadow-bg-surface)] px-4 pb-7 pt-5 md:rounded-[24px]">
      <div className="mb-4">
        <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">
          {t('readerProfilePosts.setupTitle')}
        </h2>

        <div className="mt-1 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          <span className="font-semibold text-[var(--shadow-text-primary)]">
            {t('readerProfilePosts.completed', {
              count: completedCount,
            })}
          </span>
        </div>
      </div>

      <div className="share-profile-scroll flex snap-x gap-3 overflow-x-auto pb-3 pr-4">
        {items.map((item) => (
          <article
            key={item.key}
            className="flex min-h-[250px] w-[218px] shrink-0 snap-start flex-col items-center rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-5 text-center shadow-[0_12px_30px_rgba(76,29,149,0.09)]"
          >
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[#7c3aed] text-[#7c3aed]">
              <i
                className={`${item.icon} text-[25px]`}
              />

              {item.complete ? (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[#16a36a] text-white shadow-sm">
                  <i className="fa-solid fa-check text-[12px]" />
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-[15px] font-semibold leading-5 text-[var(--shadow-text-primary)]">
              {item.title}
            </h3>

            <p className="mt-1 min-h-[40px] text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {item.description}
            </p>

            <button
              type="button"
              onClick={item.action}
              className={`mt-auto min-h-10 rounded-[12px] px-5 text-[13px] font-normal transition active:scale-[0.98] ${
                item.complete
                  ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
                  : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_18px_rgba(124,58,237,0.24)]'
              }`}
            >
              {item.complete
                ? item.completeLabel
                : item.pendingLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReaderProfileOwnPostsPanel({
  username = '',
  isOwnProfile = true,
  profileUser = null,
  onEditAvatar,
  onCountChange,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [posts, setPosts] =
    useState([])
  const [loading, setLoading] =
    useState(true)
  const [message, setMessage] =
    useState('')

  useEffect(() => {
    let alive = true

    async function loadPosts() {
      const token = getAuthToken()
      const safeUsername = String(
        username || ''
      )
        .trim()
        .replace(/^@+/, '')

      if (!token) {
        navigate('/login')
        return
      }

      if (
        !isOwnProfile &&
        !safeUsername
      ) {
        setPosts([])
        onCountChange?.(0)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const endpoint = isOwnProfile
          ? `${API_BASE_URL}/api/reader-posts/me?limit=30`
          : `${API_BASE_URL}/api/reader-posts/user/${encodeURIComponent(
              safeUsername
            )}?limit=30`

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
              t('readerProfilePosts.loadFailed')
          )
        }

        if (!alive) return

        const nextPosts =
          Array.isArray(data.posts)
            ? data.posts
            : []

        setPosts(nextPosts)
        onCountChange?.(
          nextPosts.length
        )
      } catch (error) {
        if (!alive) return

        setPosts([])
        onCountChange?.(0)
        setMessage(
          error.message ||
            t('readerProfilePosts.loadFailed')
        )
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      alive = false
    }
  }, [
    isOwnProfile,
    navigate,
    onCountChange,
    t,
    username,
  ])

  function updatePost(nextPost) {
    if (!nextPost?.id) return

    setPosts((current) =>
      current.map((post) =>
        post.id === nextPost.id
          ? nextPost
          : post
      )
    )
  }

  function removePost(postId) {
    setPosts((current) => {
      const nextPosts =
        current.filter(
          (post) =>
            post.id !== postId
        )

      onCountChange?.(
        nextPosts.length
      )

      return nextPosts
    })
  }

  if (loading) {
    return (
      <section className="mt-2 space-y-1 bg-[var(--shadow-bg-soft)] py-1 sm:space-y-1.5 sm:bg-transparent sm:px-0 sm:py-0 md:mt-3">
        <div className="h-[140px] animate-pulse bg-[var(--shadow-bg-surface)] sm:rounded-[12px]" />
        <div className="h-[140px] animate-pulse bg-[var(--shadow-bg-surface)] sm:rounded-[12px]" />
      </section>
    )
  }

  if (message) {
    return (
      <section className="mt-2 bg-[var(--shadow-bg-surface)] px-5 py-8 text-center md:mt-3 md:rounded-[24px]">
        <div className="text-[13px] font-normal text-[#e5484d]">
          {message}
        </div>
      </section>
    )
  }

  if (!posts.length) {
    return (
      <>
        <section className="mt-2 bg-[var(--shadow-bg-surface)] px-5 py-10 text-center md:mt-3 md:rounded-[24px]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
            <i className="fa-regular fa-pen-to-square text-[18px]" />
          </div>

          <h2 className="mt-3 text-[15px] font-semibold text-[var(--shadow-text-primary)]">
            {t('readerProfilePosts.noPosts')}
          </h2>

          <p className="mx-auto mt-1 max-w-[280px] text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {isOwnProfile
              ? t('readerProfilePosts.ownEmpty')
              : t('readerProfilePosts.otherEmpty')}
          </p>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/reader/post/create'
                )
              }
              className="mt-5 h-10 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(124,58,237,0.24)]"
            >
              {t('readerProfilePosts.createPost')}
            </button>
          ) : null}
        </section>

        {isOwnProfile ? (
          <ReaderProfileSetupSection
            user={profileUser}
            onEditAvatar={
              onEditAvatar
            }
          />
        ) : null}
      </>
    )
  }

  return (
    <>
      <section className="mt-2 space-y-1 bg-[var(--shadow-bg-soft)] py-1 sm:space-y-1.5 sm:bg-transparent sm:px-0 sm:py-0 md:mt-3">
        {posts.map((post) => (
          <ReaderPostCard
            key={post.id}
            post={post}
            onUpdated={updatePost}
            onDeleted={removePost}
            onHidden={removePost}
          />
        ))}
      </section>

      {isOwnProfile ? (
        <ReaderProfileSetupSection
          user={profileUser}
          onEditAvatar={
            onEditAvatar
          }
        />
      ) : null}
    </>
  )
}

registerTranslationNamespace('readerProfileTagged', {
  en: { posts: 'Posts', tagged: 'Tagged posts', empty: 'No approved tagged posts yet.', loading: 'Loading tagged posts...', error: 'Could not load tagged posts.', more: 'Load more', retry: 'Try again', open: 'View post', photo: 'Photo post' },
  km: { posts: 'Post', tagged: 'Post ដែលគេ Tag អ្នក', empty: 'មិនទាន់មាន Post ដែលបានអនុម័ត Tag ទេ។', loading: 'កំពុងផ្ទុក Post ដែលបាន Tag...', error: 'មិនអាចផ្ទុក Post ដែលបាន Tag បានទេ។', more: 'បង្ហាញបន្ថែម', retry: 'ព្យាយាមម្តងទៀត', open: 'មើល Post', photo: 'Post រូបភាព' },
  zh: { posts: '帖子', tagged: '被标记的帖子', empty: '暂无已批准的标记帖子。', loading: '正在加载标记帖子...', error: '无法加载标记帖子。', more: '加载更多', retry: '重试', open: '查看帖子', photo: '图片帖子' },
  ja: { posts: '投稿', tagged: 'タグ付けされた投稿', empty: '承認済みのタグ付き投稿はありません。', loading: 'タグ付き投稿を読み込み中...', error: 'タグ付き投稿を読み込めません。', more: 'さらに表示', retry: '再試行', open: '投稿を見る', photo: '写真の投稿' },
  ko: { posts: '게시물', tagged: '태그된 게시물', empty: '승인된 태그 게시물이 없습니다.', loading: '태그된 게시물을 불러오는 중...', error: '태그된 게시물을 불러올 수 없습니다.', more: '더 보기', retry: '다시 시도', open: '게시물 보기', photo: '사진 게시물' },
})

function ReaderProfileTaggedPostsPanel() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`readerProfileTagged.${key}`)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function loadFirstPage() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/tags-mentions/approved?page=1`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !Array.isArray(data.posts)) throw new Error('LOAD_FAILED')
        if (!controller.signal.aborted) {
          setPosts(data.posts)
          setHasMore(Boolean(data.has_more))
          setPage(1)
        }
      } catch {
        if (!controller.signal.aborted) setError(tr('error'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadFirstPage()
    return () => controller.abort()
  }, [retryKey, navigate])

  async function loadMore() {
    if (loading || loadingMore || !hasMore) return
    setLoadingMore(true)
    setError('')
    try {
      const nextPage = page + 1
      const response = await fetch(`${API_BASE_URL}/api/users/me/tags-mentions/approved?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        cache: 'no-store',
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !Array.isArray(data.posts)) throw new Error('LOAD_FAILED')
      setPosts((current) => {
        const existing = new Set(current.map((post) => post.id))
        return [...current, ...data.posts.filter((post) => !existing.has(post.id))]
      })
      setPage(nextPage)
      setHasMore(Boolean(data.has_more))
    } catch {
      setError(tr('error'))
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="mt-2 space-y-3 px-4 py-4 sm:px-0" aria-label={tr('tagged')}>
      {loading && <p role="status" className="text-center text-[13px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p>}
      {error && <div role="alert" className="rounded-xl bg-[var(--shadow-bg-surface)] p-4 text-[13px] text-[var(--shadow-text-primary)]"><p>{error}</p><button type="button" onClick={() => setRetryKey((current) => current + 1)} className="mt-2 font-semibold underline">{tr('retry')}</button></div>}
      {!loading && !error && !posts.length && <p className="rounded-xl bg-[var(--shadow-bg-surface)] p-6 text-center text-[13px] text-[var(--shadow-text-secondary)]">{tr('empty')}</p>}
      {posts.map((post) => (
        <article key={post.id} className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[var(--shadow-text-primary)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
              {post.user?.avatar_url ? <img src={post.user.avatar_url} alt="" className="h-full w-full object-cover" /> : <span>{String(post.user?.name || '?').charAt(0)}</span>}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">{post.user?.name || post.user?.username || ''}</p>
              {post.user?.username && <p className="truncate text-[12px] text-[var(--shadow-text-secondary)]">@{post.user.username}</p>}
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-6">{post.content || tr('photo')}</p>
          {post.image_url && <img src={post.image_url} alt="" loading="lazy" className="mt-3 max-h-[280px] w-full rounded-xl object-contain" />}
          <button type="button" onClick={() => navigate(`/reader/post/${encodeURIComponent(post.id)}`)} className="mt-3 min-h-10 w-full rounded-xl bg-[var(--shadow-bg-soft)] px-4 text-[13px] font-medium active:bg-[var(--shadow-bg-hover)]">{tr('open')}</button>
        </article>
      ))}
      {hasMore && !loading && <button type="button" onClick={loadMore} disabled={loadingMore} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] font-semibold disabled:opacity-50">{loadingMore ? tr('loading') : tr('more')}</button>}
    </section>
  )
}

export default function ReaderProfilePostsPanel(props) {
  const { t } = useDisplayTranslation()
  const [tab, setTab] = useState('posts')
  if (props.isOwnProfile === false) return <ReaderProfileOwnPostsPanel {...props} />

  return (
    <>
      <div role="tablist" className="mt-3 flex gap-2 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-2">
        <button type="button" role="tab" aria-selected={tab === 'posts'} onClick={() => setTab('posts')} className={`min-h-10 flex-1 rounded-xl px-3 text-[13px] font-semibold ${tab === 'posts' ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'text-[var(--shadow-text-secondary)]'}`}>{t('readerProfileTagged.posts')}</button>
        <button type="button" role="tab" aria-selected={tab === 'tagged'} onClick={() => setTab('tagged')} className={`min-h-10 flex-1 rounded-xl px-3 text-[13px] font-semibold ${tab === 'tagged' ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'text-[var(--shadow-text-secondary)]'}`}>{t('readerProfileTagged.tagged')}</button>
      </div>
      {tab === 'posts' ? <ReaderProfileOwnPostsPanel {...props} /> : <ReaderProfileTaggedPostsPanel />}
    </>
  )
}
