import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../../i18n'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPostInsights', {
  en: {
    title: 'Post details',
    goBack: 'Go back',
    managePost: 'Manage post',
    moreOptions: 'More options',
    public: 'Public',
    moreDetails: 'More details',
    basicDetails: 'Basic details',
    viewPost: 'View post',
    loading: 'Loading post insights...',
    loadFailed: 'Could not load insights',
    cannotConnect: 'Cannot connect to backend.',
    failedToLoad: 'Failed to load post insights',
    photoPost: 'Photo post',
    posted: 'Posted {{date}}',
    views: 'Views',
    viewers: 'Viewers',
    engagement: 'Engagement',
    netFollows: 'Net Follows',
    clicks: 'Clicks',
    saves: 'Saves',
    viewsOverTime: 'Views over time',
    viewsOverTimeSub: 'Cumulative views recorded for this post.',
    noViews: 'No views yet',
    noViewsSub: 'Views will appear after readers open this post.',
    totalPostViews: 'Total post views',
    lifetime: 'Lifetime',
    actionsReadersTook: 'Actions readers took on this post.',
    reactions: 'Reactions',
    comments: 'Comments',
    shares: 'Shares',
    reactionBreakdown: 'Reaction breakdown',
    audience: 'Audience',
    audienceSub: 'Unique viewers grouped by whether they followed your Author Page when the view was recorded.',
    followers: 'Followers',
    nonFollowers: 'Non-followers',
    viewersLabel: '{{count}} viewers',
    howFound: 'How people found this post',
    howFoundSub: 'Traffic sources recorded when readers opened the post.',
    noTraffic: 'No traffic source data yet.',
    feed: 'Feed',
    suggested: 'Suggested',
    followerFeed: 'Follower feed',
    authorPage: 'Author page',
    discover: 'Discover',
    search: 'Search',
    sharedLink: 'Shared link',
    notification: 'Notification',
    direct: 'Direct',
    other: 'Other',
    performance: 'Performance',
    performanceSub: 'Compared with your recent posts at the same age.',
    aboveTypical: 'Above typical',
    typical: 'Typical',
    belowTypical: 'Below typical',
    currentPost: 'Current post',
    typicalPost: 'Typical post',
    previousPosts: 'Based on {{count}} previous posts',
    betterThanTypical: '{{percent}}% better than typical',
    lowerThanTypical: '{{percent}}% below typical',
    demographics: 'Audience demographics',
    demographicsSub: 'Based on registered viewers only. Shown when at least 5 profiles are available.',
    age: 'Age',
    gender: 'Gender',
    under18: 'Under 18',
    age18_24: '18–24',
    age25_34: '25–34',
    age35_44: '35–44',
    age45_54: '45–54',
    age55Plus: '55+',
    female: 'Female',
    male: 'Male',
    custom: 'Custom',
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
  },
  km: {
    title: 'ព័ត៌មានប្រកាស',
    goBack: 'ត្រឡប់ក្រោយ',
    managePost: 'គ្រប់គ្រងប្រកាស',
    moreOptions: 'ជម្រើសបន្ថែម',
    public: 'សាធារណៈ',
    moreDetails: 'ព័ត៌មានបន្ថែម',
    basicDetails: 'ព័ត៌មានមូលដ្ឋាន',
    viewPost: 'មើលប្រកាស',
    loading: 'កំពុងផ្ទុកស្ថិតិប្រកាស...',
    loadFailed: 'មិនអាចផ្ទុកស្ថិតិបាន',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បាន។',
    failedToLoad: 'បរាជ័យក្នុងការផ្ទុកស្ថិតិប្រកាស',
    photoPost: 'ប្រកាសរូបភាព',
    posted: 'បានបង្ហោះ {{date}}',
    views: 'ការមើល',
    viewers: 'អ្នកមើល',
    engagement: 'អន្តរកម្ម',
    netFollows: 'អ្នក Follow ពីប្រកាស',
    clicks: 'ការចុច Link',
    saves: 'ការរក្សាទុក',
    viewsOverTime: 'ការមើលតាមពេលវេលា',
    viewsOverTimeSub: 'ចំនួនមើលសរុបដែលបានកត់ត្រាសម្រាប់ប្រកាសនេះ។',
    noViews: 'មិនទាន់មានការមើល',
    noViewsSub: 'ការមើលនឹងបង្ហាញនៅពេលអ្នកអានបើកប្រកាសនេះ។',
    totalPostViews: 'ការមើលប្រកាសសរុប',
    lifetime: 'សរុបទាំងអស់',
    actionsReadersTook: 'សកម្មភាពដែលអ្នកអានបានធ្វើលើប្រកាសនេះ។',
    reactions: 'Reaction',
    comments: 'មតិយោបល់',
    shares: 'ការចែករំលែក',
    reactionBreakdown: 'ប្រភេទ Reaction',
    audience: 'ទស្សនិកជន',
    audienceSub: 'អ្នកមើលមិនស្ទួន បែងចែកតាមស្ថានភាព Follow នៅពេលបានកត់ការមើល។',
    followers: 'អ្នក Follow',
    nonFollowers: 'មិនទាន់ Follow',
    viewersLabel: 'អ្នកមើល {{count}} នាក់',
    howFound: 'របៀបដែលមនុស្សរកឃើញប្រកាសនេះ',
    howFoundSub: 'ប្រភព Traffic ដែលបានកត់ត្រាពេលអ្នកអានបើកប្រកាស។',
    noTraffic: 'មិនទាន់មានទិន្នន័យប្រភព Traffic។',
    feed: 'Feed',
    suggested: 'បានណែនាំ',
    followerFeed: 'Follower Feed',
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    discover: 'Discover',
    search: 'Search',
    sharedLink: 'Link ចែករំលែក',
    notification: 'Notification',
    direct: 'Direct',
    other: 'ផ្សេងៗ',
    performance: 'ប្រសិទ្ធភាពប្រកាស',
    performanceSub: 'ប្រៀបធៀបជាមួយប្រកាសថ្មីៗរបស់អ្នកនៅអាយុកាលប្រកាសដូចគ្នា។',
    aboveTypical: 'ល្អជាងធម្មតា',
    typical: 'កម្រិតធម្មតា',
    belowTypical: 'ទាបជាងធម្មតា',
    currentPost: 'ប្រកាសនេះ',
    typicalPost: 'ប្រកាសធម្មតា',
    previousPosts: 'ផ្អែកលើប្រកាសមុន {{count}}',
    betterThanTypical: 'ល្អជាងធម្មតា {{percent}}%',
    lowerThanTypical: 'ទាបជាងធម្មតា {{percent}}%',
    demographics: 'ព័ត៌មានទស្សនិកជន',
    demographicsSub: 'ផ្អែកលើអ្នកមើលដែលមានគណនីប៉ុណ្ណោះ។ បង្ហាញនៅពេលមាន Profile យ៉ាងតិច 5។',
    age: 'អាយុ',
    gender: 'ភេទ',
    under18: 'ក្រោម 18',
    age18_24: '18–24',
    age25_34: '25–34',
    age35_44: '35–44',
    age45_54: '45–54',
    age55Plus: '55+',
    female: 'ស្រី',
    male: 'ប្រុស',
    custom: 'ផ្សេងៗ',
    love: 'ស្រឡាញ់',
    haha: 'សើច',
    wow: 'ភ្ញាក់ផ្អើល',
    sad: 'សោកសៅ',
    angry: 'ខឹង',
    support: 'គាំទ្រ',
    touched: 'រំភើប',
  },
  zh: {
    title: '帖子详情',
    goBack: '返回',
    managePost: '管理帖子',
    moreOptions: '更多选项',
    public: '公开',
    moreDetails: '更多详情',
    basicDetails: '基本详情',
    viewPost: '查看帖子',
    loading: '正在加载帖子数据...',
    loadFailed: '无法加载数据',
    cannotConnect: '无法连接后端。',
    failedToLoad: '加载帖子数据失败',
    photoPost: '图片帖子',
    posted: '发布于 {{date}}',
    views: '浏览量',
    viewers: '浏览人数',
    engagement: '互动',
    netFollows: '新增关注',
    clicks: '链接点击',
    saves: '收藏',
    viewsOverTime: '浏览趋势',
    viewsOverTimeSub: '此帖累计记录的浏览量。',
    noViews: '暂无浏览',
    noViewsSub: '读者打开此帖后会显示浏览数据。',
    totalPostViews: '帖子总浏览量',
    lifetime: '全部时间',
    actionsReadersTook: '读者对该帖子执行的操作。',
    reactions: '反应',
    comments: '评论',
    shares: '分享',
    reactionBreakdown: '反应明细',
    audience: '受众',
    audienceSub: '按浏览发生时是否关注作者主页来统计独立浏览者。',
    followers: '关注者',
    nonFollowers: '未关注者',
    viewersLabel: '{{count}} 位浏览者',
    howFound: '用户如何找到此帖',
    howFoundSub: '读者打开帖子时记录的流量来源。',
    noTraffic: '暂无流量来源数据。',
    feed: '信息流',
    suggested: '推荐',
    followerFeed: '关注信息流',
    authorPage: '作者主页',
    discover: '发现',
    search: '搜索',
    sharedLink: '分享链接',
    notification: '通知',
    direct: '直接访问',
    other: '其他',
    performance: '帖子表现',
    performanceSub: '与同发布时间阶段的近期帖子进行比较。',
    aboveTypical: '高于平常',
    typical: '正常水平',
    belowTypical: '低于平常',
    currentPost: '当前帖子',
    typicalPost: '典型帖子',
    previousPosts: '基于之前 {{count}} 个帖子',
    betterThanTypical: '比平常高 {{percent}}%',
    lowerThanTypical: '比平常低 {{percent}}%',
    demographics: '受众人口统计',
    demographicsSub: '仅基于已注册浏览者。至少有 5 个可用资料时显示。',
    age: '年龄',
    gender: '性别',
    under18: '18岁以下',
    age18_24: '18–24',
    age25_34: '25–34',
    age35_44: '35–44',
    age45_54: '45–54',
    age55Plus: '55+',
    female: '女性',
    male: '男性',
    custom: '其他',
    love: '喜欢',
    haha: '哈哈',
    wow: '惊讶',
    sad: '难过',
    angry: '生气',
    support: '支持',
    touched: '感动',
  },
  ja: {
    title: '投稿の詳細',
    goBack: '戻る',
    managePost: '投稿を管理',
    moreOptions: 'その他のオプション',
    public: '公開',
    moreDetails: '詳細を見る',
    basicDetails: '基本情報',
    viewPost: '投稿を見る',
    loading: '投稿インサイトを読み込み中...',
    loadFailed: 'インサイトを読み込めません',
    cannotConnect: 'バックエンドに接続できません。',
    failedToLoad: '投稿インサイトの読み込みに失敗しました',
    photoPost: '写真投稿',
    posted: '{{date}} に投稿',
    views: '表示回数',
    viewers: '閲覧者',
    engagement: 'エンゲージメント',
    netFollows: '新規フォロー',
    clicks: 'リンククリック',
    saves: '保存',
    viewsOverTime: '表示回数の推移',
    viewsOverTimeSub: 'この投稿で記録された累積表示回数です。',
    noViews: 'まだ表示がありません',
    noViewsSub: '読者が投稿を開くと表示回数が記録されます。',
    totalPostViews: '投稿の総表示回数',
    lifetime: '全期間',
    actionsReadersTook: '読者がこの投稿で行ったアクションです。',
    reactions: 'リアクション',
    comments: 'コメント',
    shares: 'シェア',
    reactionBreakdown: 'リアクション内訳',
    audience: 'オーディエンス',
    audienceSub: '閲覧時点で作者ページをフォローしていたかでユニーク閲覧者を分類します。',
    followers: 'フォロワー',
    nonFollowers: '非フォロワー',
    viewersLabel: '{{count}} 人の閲覧者',
    howFound: 'この投稿の流入元',
    howFoundSub: '読者が投稿を開いた際に記録された流入元です。',
    noTraffic: '流入元データはまだありません。',
    feed: 'フィード',
    suggested: 'おすすめ',
    followerFeed: 'フォロワーフィード',
    authorPage: '作者ページ',
    discover: 'Discover',
    search: '検索',
    sharedLink: '共有リンク',
    notification: '通知',
    direct: '直接',
    other: 'その他',
    performance: '投稿パフォーマンス',
    performanceSub: '同じ公開後経過時間の最近の投稿と比較します。',
    aboveTypical: '通常より上',
    typical: '通常',
    belowTypical: '通常より下',
    currentPost: '現在の投稿',
    typicalPost: '通常の投稿',
    previousPosts: '過去 {{count}} 件の投稿を基準',
    betterThanTypical: '通常より {{percent}}% 高い',
    lowerThanTypical: '通常より {{percent}}% 低い',
    demographics: 'オーディエンス属性',
    demographicsSub: '登録済み閲覧者のみを対象に、5件以上のプロフィールがある場合に表示します。',
    age: '年齢',
    gender: '性別',
    under18: '18歳未満',
    age18_24: '18–24',
    age25_34: '25–34',
    age35_44: '35–44',
    age45_54: '45–54',
    age55Plus: '55+',
    female: '女性',
    male: '男性',
    custom: 'その他',
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
  },
  ko: {
    title: '게시물 상세',
    goBack: '뒤로',
    managePost: '게시물 관리',
    moreOptions: '더보기',
    public: '공개',
    moreDetails: '상세 정보',
    basicDetails: '기본 정보',
    viewPost: '게시물 보기',
    loading: '게시물 인사이트를 불러오는 중...',
    loadFailed: '인사이트를 불러올 수 없습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다.',
    failedToLoad: '게시물 인사이트를 불러오지 못했습니다',
    photoPost: '사진 게시물',
    posted: '{{date}} 게시',
    views: '조회수',
    viewers: '조회자',
    engagement: '참여',
    netFollows: '신규 팔로우',
    clicks: '링크 클릭',
    saves: '저장',
    viewsOverTime: '시간별 조회수',
    viewsOverTimeSub: '이 게시물에 기록된 누적 조회수입니다.',
    noViews: '아직 조회수가 없습니다',
    noViewsSub: '독자가 이 게시물을 열면 조회수가 표시됩니다.',
    totalPostViews: '총 게시물 조회수',
    lifetime: '전체 기간',
    actionsReadersTook: '독자가 이 게시물에서 수행한 행동입니다.',
    reactions: '반응',
    comments: '댓글',
    shares: '공유',
    reactionBreakdown: '반응 상세',
    audience: '오디언스',
    audienceSub: '조회 시점의 작가 페이지 팔로우 여부로 순 조회자를 구분합니다.',
    followers: '팔로워',
    nonFollowers: '비팔로워',
    viewersLabel: '조회자 {{count}}명',
    howFound: '게시물을 찾은 경로',
    howFoundSub: '독자가 게시물을 열 때 기록된 트래픽 소스입니다.',
    noTraffic: '아직 트래픽 소스 데이터가 없습니다.',
    feed: '피드',
    suggested: '추천',
    followerFeed: '팔로워 피드',
    authorPage: '작가 페이지',
    discover: 'Discover',
    search: '검색',
    sharedLink: '공유 링크',
    notification: '알림',
    direct: '직접',
    other: '기타',
    performance: '게시물 성과',
    performanceSub: '같은 게시 경과 시간의 최근 게시물과 비교합니다.',
    aboveTypical: '평소보다 높음',
    typical: '평소 수준',
    belowTypical: '평소보다 낮음',
    currentPost: '현재 게시물',
    typicalPost: '평소 게시물',
    previousPosts: '이전 게시물 {{count}}개 기준',
    betterThanTypical: '평소보다 {{percent}}% 높음',
    lowerThanTypical: '평소보다 {{percent}}% 낮음',
    demographics: '오디언스 인구 통계',
    demographicsSub: '가입된 조회자만 기준으로 하며 프로필이 5개 이상일 때 표시됩니다.',
    age: '연령',
    gender: '성별',
    under18: '18세 미만',
    age18_24: '18–24',
    age25_34: '25–34',
    age35_44: '35–44',
    age45_54: '45–54',
    age55Plus: '55+',
    female: '여성',
    male: '남성',
    custom: '기타',
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SOURCE_KEYS = {
  feed: 'feed',
  suggested: 'suggested',
  follower_feed: 'followerFeed',
  author_page: 'authorPage',
  discover: 'discover',
  search: 'search',
  share: 'sharedLink',
  notification: 'notification',
  direct: 'direct',
  other: 'other',
}

const REACTION_KEYS = {
  love: 'love',
  haha: 'haha',
  wow: 'wow',
  sad: 'sad',
  angry: 'angry',
  support: 'support',
  touched: 'touched',
}

const REACTION_ICONS = {
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
  support: '💜',
  touched: '🥹',
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[var(--shadow-text-primary)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f1ff] text-[#6d4aff] dark:bg-[#2b2542]">
          <i className={`${icon} text-[12px]`} />
        </span>
      </div>
      <div className="mt-4 text-[25px] font-bold tracking-[-0.02em]">
        {Number(value || 0).toLocaleString()}
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <div className="px-4 pb-3 pt-4 sm:px-5">
        <h2 className="text-[15px] font-bold">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ViewsChart({ timeline = [], t, locale }) {
  const chart = useMemo(() => {
    const items = Array.isArray(timeline)
      ? timeline.filter((item) => item?.time)
      : []

    if (!items.length) {
      return { path: '', points: [] }
    }

    const width = 600
    const height = 190
    const paddingX = 12
    const paddingY = 18
    const max = Math.max(
      1,
      ...items.map((item) =>
        Number(item.cumulative_views || 0)
      )
    )
    const usableWidth = width - paddingX * 2
    const usableHeight = height - paddingY * 2
    const divisor = Math.max(1, items.length - 1)

    const points = items.map((item, index) => {
      const x =
        paddingX + (index / divisor) * usableWidth
      const y =
        height -
        paddingY -
        (Number(item.cumulative_views || 0) / max) *
          usableHeight

      return {
        x,
        y,
        value: Number(item.cumulative_views || 0),
        time: item.time,
      }
    })

    return {
      path: points
        .map(
          (point, index) =>
            `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        )
        .join(' '),
      points,
    }
  }, [timeline])

  const formatDateTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  if (!chart.points.length) {
    return (
      <div className="flex h-[220px] items-center justify-center px-6 text-center">
        <div>
          <div className="text-[14px] font-semibold">
            {t('authorPostInsights.noViews')}
          </div>
          <div className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">
            {t('authorPostInsights.noViewsSub')}
          </div>
        </div>
      </div>
    )
  }

  const first = chart.points[0]
  const last = chart.points[chart.points.length - 1]

  return (
    <div className="px-4 pb-4 sm:px-5">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="text-[26px] font-bold tracking-[-0.02em]">
            {Number(last?.value || 0).toLocaleString(locale)}
          </div>
          <div className="text-[11px] text-[var(--shadow-text-secondary)]">
            {t('authorPostInsights.totalPostViews')}
          </div>
        </div>
        <div className="text-right text-[10px] text-[var(--shadow-text-tertiary)]">
          {t('authorPostInsights.lifetime')}
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-[var(--shadow-bg-elevated)] px-2 py-3">
        <svg
          viewBox="0 0 600 190"
          className="h-[190px] w-full"
          role="img"
          aria-label={t('authorPostInsights.viewsOverTime')}
        >
          <line x1="12" y1="172" x2="588" y2="172" stroke="var(--shadow-border)" strokeWidth="1" />
          <line x1="12" y1="95" x2="588" y2="95" stroke="var(--shadow-border)" strokeWidth="1" />
          <line x1="12" y1="18" x2="588" y2="18" stroke="var(--shadow-border)" strokeWidth="1" />
          <path
            d={chart.path}
            fill="none"
            stroke="#6d4aff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chart.points.map((point, index) => (
            <circle
              key={`${point.time}-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === chart.points.length - 1 ? 5 : 3}
              fill="var(--shadow-bg-surface)"
              stroke="#6d4aff"
              strokeWidth="3"
            />
          ))}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-[var(--shadow-text-tertiary)]">
        <span>{formatDateTime(first?.time)}</span>
        <span>{formatDateTime(last?.time)}</span>
      </div>
    </div>
  )
}

function AudienceBar({ audience, t, locale }) {
  const followerPercentage = Math.max(
    0,
    Math.min(
      100,
      Number(audience?.follower_percentage || 0)
    )
  )
  const nonFollowerPercentage = Math.max(
    0,
    Math.min(
      100,
      Number(audience?.non_follower_percentage || 0)
    )
  )

  return (
    <div className="px-4 pb-5 sm:px-5">
      <div className="flex h-3 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
        <div
          className="h-full bg-[#6d4aff]"
          style={{ width: `${followerPercentage}%` }}
        />
        <div
          className="h-full bg-[#b7a9ff]"
          style={{ width: `${nonFollowerPercentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] bg-[var(--shadow-bg-elevated)] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#6d4aff]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6d4aff]" />
            {t('authorPostInsights.followers')}
          </div>
          <div className="mt-2 text-[20px] font-bold">
            {followerPercentage.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">
            {t('authorPostInsights.viewersLabel', {
              count: Number(
                audience?.followers || 0
              ).toLocaleString(locale),
            })}
          </div>
        </div>

        <div className="rounded-[14px] bg-[var(--shadow-bg-elevated)] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#7b6bc7]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#b7a9ff]" />
            {t('authorPostInsights.nonFollowers')}
          </div>
          <div className="mt-2 text-[20px] font-bold">
            {nonFollowerPercentage.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">
            {t('authorPostInsights.viewersLabel', {
              count: Number(
                audience?.non_followers || 0
              ).toLocaleString(locale),
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficList({ traffic = [], t, locale }) {
  if (!traffic.length) {
    return (
      <div className="px-5 pb-6 pt-2 text-[12px] text-[var(--shadow-text-secondary)]">
        {t('authorPostInsights.noTraffic')}
      </div>
    )
  }

  return (
    <div className="divide-y divide-[var(--shadow-border)] px-4 pb-2 sm:px-5">
      {traffic.map((item) => {
        const percentage = Math.max(
          0,
          Math.min(100, Number(item.percentage || 0))
        )
        const sourceKey =
          SOURCE_KEYS[item.source] || 'other'

        return (
          <div key={item.source} className="py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 text-[12px] font-medium">
                {t(`authorPostInsights.${sourceKey}`)}
              </div>
              <div className="shrink-0 text-[11px] text-[var(--shadow-text-secondary)]">
                {Number(item.views || 0).toLocaleString(locale)} ·{' '}
                {percentage.toFixed(1)}%
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
              <div
                className="h-full rounded-full bg-[#6d4aff]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ReactionBreakdown({
  reactions = {},
  t,
  locale,
}) {
  const items = Object.entries(reactions)
    .filter(([, count]) => Number(count || 0) > 0)
    .sort(
      (a, b) =>
        Number(b[1] || 0) - Number(a[1] || 0)
    )

  if (!items.length) return null

  return (
    <div className="border-t border-[var(--shadow-border)] px-4 py-3 sm:px-5">
      <div className="mb-2 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
        {t('authorPostInsights.reactionBreakdown')}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(([type, count]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 rounded-full bg-[var(--shadow-bg-elevated)] px-3 py-1.5 text-[11px]"
          >
            <span>{REACTION_ICONS[type] || '•'}</span>
            <span>
              {t(
                `authorPostInsights.${
                  REACTION_KEYS[type] || type
                }`
              )}
            </span>
            <strong className="font-semibold">
              {Number(count || 0).toLocaleString(locale)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}


const AGE_LABEL_KEYS = {
  under_18: 'under18',
  '18_24': 'age18_24',
  '25_34': 'age25_34',
  '35_44': 'age35_44',
  '45_54': 'age45_54',
  '55_plus': 'age55Plus',
}

const GENDER_LABEL_KEYS = {
  female: 'female',
  male: 'male',
  custom: 'custom',
}

function PerformanceSection({ performance, t, locale }) {
  if (!performance?.available) return null

  const statusKey =
    performance.status === 'above_typical'
      ? 'aboveTypical'
      : performance.status === 'below_typical'
        ? 'belowTypical'
        : 'typical'

  const percent = Number(performance.percent_vs_typical)
  const hasPercent = Number.isFinite(percent)
  const absolutePercent = hasPercent
    ? Math.abs(percent).toLocaleString(locale, {
        maximumFractionDigits: 1,
      })
    : ''

  const comparisonText =
    hasPercent && percent > 0
      ? t('authorPostInsights.betterThanTypical', {
          percent: absolutePercent,
        })
      : hasPercent && percent < 0
        ? t('authorPostInsights.lowerThanTypical', {
            percent: absolutePercent,
          })
        : t(`authorPostInsights.${statusKey}`)

  return (
    <Section
      title={t('authorPostInsights.performance')}
      subtitle={t('authorPostInsights.performanceSub')}
    >
      <div className="border-t border-[var(--shadow-border)] px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 rounded-[14px] bg-[var(--shadow-bg-elevated)] p-3.5">
          <div>
            <div className="text-[12px] font-semibold">
              {t(`authorPostInsights.${statusKey}`)}
            </div>
            <div className="mt-1 text-[10.5px] text-[var(--shadow-text-secondary)]">
              {comparisonText}
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f1ff] text-[#6d4aff] dark:bg-[#2b2542]">
            <i className="fa-solid fa-chart-line text-[13px]" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[14px] border border-[var(--shadow-border)] p-3">
            <div className="text-[10.5px] text-[var(--shadow-text-secondary)]">
              {t('authorPostInsights.currentPost')}
            </div>
            <div className="mt-1.5 text-[22px] font-bold">
              {Number(performance.current_views || 0).toLocaleString(locale)}
            </div>
          </div>
          <div className="rounded-[14px] border border-[var(--shadow-border)] p-3">
            <div className="text-[10.5px] text-[var(--shadow-text-secondary)]">
              {t('authorPostInsights.typicalPost')}
            </div>
            <div className="mt-1.5 text-[22px] font-bold">
              {Number(performance.typical_views || 0).toLocaleString(locale)}
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-[var(--shadow-text-tertiary)]">
          {t('authorPostInsights.previousPosts', {
            count: Number(performance.sample_size || 0).toLocaleString(locale),
          })}
        </div>
      </div>
    </Section>
  )
}

function BreakdownList({ title, groups, labels, t, locale }) {
  if (!Array.isArray(groups) || !groups.length) return null

  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold">{title}</div>
      <div className="space-y-3">
        {groups.map((item) => {
          const percentage = Math.max(
            0,
            Math.min(100, Number(item.percentage || 0))
          )
          const labelKey = labels[item.key]

          return (
            <div key={item.key}>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span>
                  {labelKey
                    ? t(`authorPostInsights.${labelKey}`)
                    : item.key}
                </span>
                <span className="text-[var(--shadow-text-secondary)]">
                  {Number(item.count || 0).toLocaleString(locale)} ·{' '}
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
                <div
                  className="h-full rounded-full bg-[#6d4aff]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DemographicsSection({ demographics, t, locale }) {
  if (!demographics?.available) return null

  const ageGroups =
    demographics?.age?.available
      ? demographics.age.groups
      : []
  const genderGroups =
    demographics?.gender?.available
      ? demographics.gender.groups
      : []

  if (!ageGroups.length && !genderGroups.length) return null

  return (
    <Section
      title={t('authorPostInsights.demographics')}
      subtitle={t('authorPostInsights.demographicsSub')}
    >
      <div className="grid gap-5 border-t border-[var(--shadow-border)] px-4 py-4 sm:grid-cols-2 sm:px-5">
        <BreakdownList
          title={t('authorPostInsights.age')}
          groups={ageGroups}
          labels={AGE_LABEL_KEYS}
          t={t}
          locale={locale}
        />
        <BreakdownList
          title={t('authorPostInsights.gender')}
          groups={genderGroups}
          labels={GENDER_LABEL_KEYS}
          t={t}
          locale={locale}
        />
      </div>
    </Section>
  )
}

export default function AuthorPostInsightsPage() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const { language, t } = useDisplayTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false)

  const locale =
    {
      km: 'km-KH',
      en: 'en-US',
      zh: 'zh-CN',
      ja: 'ja-JP',
      ko: 'ko-KR',
    }[language] || 'en-US'

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function loadInsights() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
            postId || ''
          )}/insights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(
            result.message ||
              t('authorPostInsights.failedToLoad')
          )
        }

        if (!ignore) {
          setData(result)
        }
      } catch (loadError) {
        if (
          !ignore &&
          loadError?.name !== 'AbortError'
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? t(
                  'authorPostInsights.cannotConnect'
                )
              : loadError.message ||
                  t(
                    'authorPostInsights.failedToLoad'
                  )
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInsights()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, postId, t])

  useEffect(() => {
    if (!moreDetailsOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [moreDetailsOpen])

  const post = data?.post || {}
  const overview = data?.overview || {}
  const engagement = data?.engagement || {}
  const audience = data?.audience || {}
  const firstImage = Array.isArray(post.image_urls)
    ? post.image_urls.find(Boolean)
    : ''

  const formatDateTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-3xl grid-cols-[44px_1fr_88px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('authorPostInsights.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="truncate text-center text-[16px] font-bold">
            {t('authorPostInsights.title')}
          </h1>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/author/page/posts')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('authorPostInsights.managePost')}
            >
              <span className="relative block h-[22px] w-[24px]" aria-hidden="true">
                <span className="absolute left-[2px] top-[3px] h-[17px] w-[13px] rounded-[3px] border-2 border-[var(--shadow-text-primary)]" />
                <span className="absolute right-[1px] top-0 h-[17px] w-[13px] rounded-[3px] border-2 border-[var(--shadow-text-primary)] bg-[var(--shadow-nav-bg)]" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMoreDetailsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('authorPostInsights.moreOptions')}
            >
              <i className="fa-solid fa-ellipsis text-[18px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 pb-12 pt-3 sm:px-5">
        {loading ? (
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[#6d4aff]" />
            <div className="mt-3 text-[12px] text-[var(--shadow-text-secondary)]">
              {t('authorPostInsights.loading')}
            </div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[18px] border border-[#ffd8dc] bg-[var(--shadow-bg-surface)] px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f2] text-[#e5484d] dark:bg-[#3a2025]">
              <i className="fa-solid fa-circle-exclamation text-[16px]" />
            </div>
            <div className="mt-3 text-[14px] font-semibold">
              {t('authorPostInsights.loadFailed')}
            </div>
            <div className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
              {error}
            </div>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <div className="space-y-3">
            <section className="px-1 pb-2 pt-2 sm:pt-3">
              <button
                type="button"
                onClick={() =>
                  post?.id &&
                  navigate(
                    `/author/post/${encodeURIComponent(post.id)}`
                  )
                }
                className="mx-auto block w-full max-w-[292px] overflow-hidden rounded-[18px] bg-[var(--shadow-bg-surface)] text-left shadow-[0_4px_18px_rgba(17,24,39,0.12)] ring-1 ring-[var(--shadow-border)] active:scale-[0.995]"
              >
                {firstImage ? (
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--shadow-bg-elevated)]">
                    <img
                      src={firstImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[250px] items-center justify-center bg-[var(--shadow-bg-elevated)] px-6 text-center">
                    <div>
                      <i className="fa-regular fa-file-lines text-[28px] text-[#6d4aff]" />
                      <div className="mt-4 line-clamp-6 whitespace-pre-wrap text-[15px] font-semibold leading-6">
                        {post.content ||
                          t('authorPostInsights.photoPost')}
                      </div>
                    </div>
                  </div>
                )}

                {firstImage && post.content ? (
                  <div className="px-4 py-3">
                    <div className="line-clamp-3 whitespace-pre-wrap text-[14px] font-medium leading-6">
                      {post.content}
                    </div>
                  </div>
                ) : null}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-[var(--shadow-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-earth-americas text-[12px]" />
                  <span>{t('authorPostInsights.public')}</span>
                </span>
                <span>·</span>
                <span>{formatDateTime(post.created_at)}</span>
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setMoreDetailsOpen(true)}
                  className="rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-4 py-2 text-[12px] font-medium active:bg-[var(--shadow-bg-hover)]"
                >
                  {t('authorPostInsights.moreDetails')}
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              <MetricCard
                icon="fa-regular fa-eye"
                label={t('authorPostInsights.views')}
                value={overview.views}
              />
              <MetricCard
                icon="fa-regular fa-user"
                label={t(
                  'authorPostInsights.viewers'
                )}
                value={overview.viewers}
              />
              <MetricCard
                icon="fa-solid fa-chart-simple"
                label={t(
                  'authorPostInsights.engagement'
                )}
                value={overview.engagement}
              />
              <MetricCard
                icon="fa-solid fa-user-plus"
                label={t(
                  'authorPostInsights.netFollows'
                )}
                value={overview.net_follows}
              />
              <MetricCard
                icon="fa-solid fa-arrow-pointer"
                label={t(
                  'authorPostInsights.clicks'
                )}
                value={engagement.clicks}
              />
              <MetricCard
                icon="fa-regular fa-bookmark"
                label={t(
                  'authorPostInsights.saves'
                )}
                value={engagement.saves}
              />
            </section>

            <Section
              title={t(
                'authorPostInsights.viewsOverTime'
              )}
              subtitle={t(
                'authorPostInsights.viewsOverTimeSub'
              )}
            >
              <ViewsChart
                timeline={data.views_timeline}
                t={t}
                locale={locale}
              />
            </Section>

            <PerformanceSection
              performance={data.performance}
              t={t}
              locale={locale}
            />

            <Section
              title={t(
                'authorPostInsights.engagement'
              )}
              subtitle={t(
                'authorPostInsights.actionsReadersTook'
              )}
            >
              <div className="grid grid-cols-2 divide-x divide-y divide-[var(--shadow-border)] border-t border-[var(--shadow-border)] sm:grid-cols-5 sm:divide-y-0">
                {[
                  [
                    engagement.reactions,
                    t(
                      'authorPostInsights.reactions'
                    ),
                  ],
                  [
                    engagement.comments,
                    t(
                      'authorPostInsights.comments'
                    ),
                  ],
                  [
                    engagement.shares,
                    t('authorPostInsights.shares'),
                  ],
                  [
                    engagement.saves,
                    t('authorPostInsights.saves'),
                  ],
                  [
                    engagement.clicks,
                    t('authorPostInsights.clicks'),
                  ],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="px-3 py-4 text-center"
                  >
                    <div className="text-[20px] font-bold">
                      {Number(
                        value || 0
                      ).toLocaleString(locale)}
                    </div>
                    <div className="mt-1 text-[10.5px] text-[var(--shadow-text-secondary)]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <ReactionBreakdown
                reactions={
                  engagement.reaction_by_type
                }
                t={t}
                locale={locale}
              />
            </Section>

            <Section
              title={t('authorPostInsights.audience')}
              subtitle={t(
                'authorPostInsights.audienceSub'
              )}
            >
              <AudienceBar
                audience={audience}
                t={t}
                locale={locale}
              />
            </Section>

            <DemographicsSection
              demographics={data.demographics}
              t={t}
              locale={locale}
            />

            <Section
              title={t('authorPostInsights.howFound')}
              subtitle={t(
                'authorPostInsights.howFoundSub'
              )}
            >
              <TrafficList
                traffic={data.traffic}
                t={t}
                locale={locale}
              />
            </Section>
          </div>
        ) : null}
      </main>

      {moreDetailsOpen ? (
        <div className="fixed inset-0 z-[120]">
          <button
            type="button"
            aria-label={t('authorPostInsights.goBack')}
            onClick={() => setMoreDetailsOpen(false)}
            className="absolute inset-0 bg-black/45"
          />

          <section className="absolute bottom-0 left-1/2 w-full max-w-[560px] -translate-x-1/2 rounded-t-[28px] border border-b-0 border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] pb-[max(22px,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />

            <div className="px-4 pb-2 pt-4 text-center">
              <h2 className="text-[17px] font-bold">
                {t('authorPostInsights.moreDetails')}
              </h2>
            </div>

            <div className="px-4 pb-4 pt-2">
              <div className="overflow-hidden rounded-[16px] bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]">
                <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
                  <div className="text-[15px] font-bold">
                    {t('authorPostInsights.basicDetails')}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMoreDetailsOpen(false)
                      if (post?.id) {
                        navigate(
                          `/author/post/${encodeURIComponent(post.id)}`
                        )
                      }
                    }}
                    className="text-[13px] font-semibold text-[#1877f2] active:opacity-60"
                  >
                    {t('authorPostInsights.viewPost')}
                  </button>
                </div>

                <div className="flex items-start gap-3 px-4 pb-4">
                  <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[var(--shadow-bg-elevated)]">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <i className="fa-regular fa-file-lines text-[18px] text-[var(--shadow-text-secondary)]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 whitespace-pre-wrap text-[13px] font-medium leading-5">
                      {post.content ||
                        t('authorPostInsights.photoPost')}
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">
                      {formatDateTime(post.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
