import { ArrowLeft, BarChart3, CircleHelp, Clock3, Eye, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'

registerTranslationNamespace('shadowStudioStats', {
  en: {
    dashboard: 'Dashboard', analytics: 'Video analytics', ranking: 'Top recent videos', channel: 'Channel analytics',
    last30: 'Last 30 days', views: 'Views', watchTime: 'Watch time (hours)', latest: 'Latest published content',
    published: 'Published {{age}} ago', noVideos: 'No published long videos found.', loading: 'Loading Studio data...',
    retry: 'Retry', unable: 'Unable to load this information.', likes: 'Likes', comments: 'Comments',
    rankByViews: 'Ranking by views', ctr: 'Thumbnail click-through rate', average: 'Average view duration',
    insufficient: 'Data is not available yet', sourceMissing: 'This metric needs a Shadow analytics API.',
    overview: 'Overview', reach: 'Reach', engagement: 'Engagement', audience: 'Audience', lifetime: 'Lifetime',
    sincePublished: 'Views since published', traffic: 'How viewers found this video', retention: 'Audience retention',
    realtime: 'Realtime', last48: 'Views · Last 48 hours', noChart: 'Timeline data is not available yet.',
    topSources: 'Top traffic sources', compare: 'Comparing views of the 10 most recent long videos at the same age',
    recentNotRanked: 'Recent videos (ranking unavailable)', sameAgeUnavailable: 'Same-age view history is required to calculate rankings.',
    ageWindow: 'First {{age}}', partial: 'Some older videos were not loaded.', longNotice: 'YouTube Shorts links are excluded. Accurate video-type metadata is still needed.',
    back: 'Back', videoMissing: 'This video was not found in your recent published videos.',
    notMeasured: 'Not measured', viewDetails: 'Open video analytics', graphPending: 'Graph data pending',
  },
  km: {
    dashboard: 'ផ្ទាំងគ្រប់គ្រង', analytics: 'វិភាគវីដេអូ', ranking: 'វីដេអូថ្មីៗតាមចំនួនមើល', channel: 'ស្ថិតិ Channel',
    last30: '៣០ ថ្ងៃចុងក្រោយ', views: 'ចំនួនមើល', watchTime: 'ម៉ោងមើល', latest: 'វីដេអូដែលផ្សាយថ្មីៗ',
    published: 'បានផ្សាយ {{age}} មុន', noVideos: 'រកមិនឃើញវីដេអូវែងដែលបានផ្សាយទេ។', loading: 'កំពុងទាញទិន្នន័យ Studio...',
    retry: 'ព្យាយាមម្ដងទៀត', unable: 'មិនអាចទាញទិន្នន័យនេះបានទេ។', likes: 'ចូលចិត្ត', comments: 'មតិ',
    rankByViews: 'ចំណាត់ថ្នាក់តាម Views', ctr: 'អត្រាចុចរូប Thumbnail', average: 'រយៈពេលមើលមធ្យម',
    insufficient: 'មិនទាន់មានទិន្នន័យ', sourceMissing: 'ស្ថិតិនេះត្រូវការភ្ជាប់ Analytics API របស់ Shadow។',
    overview: 'ទិដ្ឋភាពទូទៅ', reach: 'ការឈានដល់', engagement: 'ការចូលរួម', audience: 'អ្នកទស្សនា', lifetime: 'សរុបរហូតមកដល់ពេលនេះ',
    sincePublished: 'Views តាំងពីបានផ្សាយ', traffic: 'ប្រភពអ្នកមើលវីដេអូនេះ', retention: 'ការរក្សាអ្នកមើល',
    realtime: 'ពេលជាក់ស្តែង', last48: 'Views · ៤៨ ម៉ោងចុងក្រោយ', noChart: 'មិនទាន់មានទិន្នន័យក្រាហ្វតាមពេលវេលា។',
    topSources: 'ប្រភព Views ច្រើនជាងគេ', compare: 'ប្រៀបធៀបវីដេអូវែងថ្មីៗ ១០ តាមអាយុវីដេអូស្មើគ្នា',
    recentNotRanked: 'វីដេអូថ្មីៗ (មិនទាន់អាចរៀប Ranking)', sameAgeUnavailable: 'ត្រូវការប្រវត្តិ Views តាមអាយុវីដេអូ ដើម្បីគណនាចំណាត់ថ្នាក់។',
    ageWindow: 'រយៈពេលដំបូង {{age}}', partial: 'វីដេអូចាស់ខ្លះមិនទាន់បានទាញមកទេ។', longNotice: 'បានដក Link Shorts ចេញ។ ត្រូវការទិន្នន័យប្រភេទវីដេអូ ដើម្បីចាត់ថ្នាក់ឱ្យត្រឹមត្រូវ ១០០%។',
    back: 'ត្រឡប់ក្រោយ', videoMissing: 'រកមិនឃើញវីដេអូនេះក្នុងបញ្ជីវីដេអូថ្មីៗរបស់អ្នកទេ។',
    notMeasured: 'មិនទាន់វាស់វែង', viewDetails: 'បើកទំព័រវិភាគវីដេអូ', graphPending: 'ក្រាហ្វកំពុងរង់ចាំទិន្នន័យ',
  },
  zh: {
    dashboard: '控制面板', analytics: '视频分析', ranking: '近期热门视频', channel: '频道数据', last30: '最近30天',
    views: '观看量', watchTime: '观看时长（小时）', latest: '最新发布内容', published: '发布于 {{age}} 前',
    noVideos: '没有找到已发布的长视频。', loading: '正在加载数据...', retry: '重试', unable: '无法加载数据。',
    likes: '点赞', comments: '评论', rankByViews: '观看量排名', ctr: '缩略图点击率', average: '平均观看时长',
    insufficient: '暂无数据', sourceMissing: '此指标需要 Shadow 数据分析接口。', overview: '概览', reach: '覆盖',
    engagement: '互动', audience: '观众', lifetime: '累计', sincePublished: '发布以来的观看量', traffic: '观众来源',
    retention: '观众留存', realtime: '实时', last48: '过去48小时观看量', noChart: '暂无时间序列数据。',
    topSources: '主要流量来源', compare: '按相同发布时长比较最近10个长视频', recentNotRanked: '近期视频（暂无法排名）',
    sameAgeUnavailable: '排名需要同一发布时长的历史观看量。', ageWindow: '前 {{age}}', partial: '部分旧视频尚未加载。',
    longNotice: '已排除 Shorts 链接，精确识别仍需视频类型元数据。', back: '返回', videoMissing: '近期视频列表中未找到该视频。',
    notMeasured: '未统计', viewDetails: '打开视频分析', graphPending: '等待图表数据',
  },
  ja: {
    dashboard: 'ダッシュボード', analytics: '動画分析', ranking: '最近の人気動画', channel: 'チャンネル分析',
    last30: '過去30日間', views: '視聴回数', watchTime: '総再生時間（時間）', latest: '最近公開した動画',
    published: '{{age}}前に公開', noVideos: '公開中の長編動画がありません。', loading: 'データを読み込み中...',
    retry: '再試行', unable: 'データを読み込めません。', likes: '高評価', comments: 'コメント',
    rankByViews: '視聴回数ランキング', ctr: 'サムネイルのクリック率', average: '平均視聴時間',
    insufficient: 'データなし', sourceMissing: 'Shadow の分析 API が必要です。', overview: '概要', reach: 'リーチ',
    engagement: 'エンゲージメント', audience: '視聴者', lifetime: '累計', sincePublished: '公開以降の視聴回数',
    traffic: '流入元', retention: '視聴維持率', realtime: 'リアルタイム', last48: '過去48時間の視聴回数',
    noChart: '時系列データがありません。', topSources: '主な流入元', compare: '最近10本の長編動画を同じ公開後時間で比較',
    recentNotRanked: '最近の動画（順位は未計算）', sameAgeUnavailable: 'ランキングには同じ経過時間の視聴履歴が必要です。',
    ageWindow: '公開後 {{age}}', partial: '古い動画の一部は未取得です。', longNotice: 'Shorts リンクを除外しました。正確な分類には動画タイプの情報が必要です。',
    back: '戻る', videoMissing: '最近の公開動画に見つかりません。', notMeasured: '未計測',
    viewDetails: '動画分析を開く', graphPending: 'グラフデータ待ち',
  },
  ko: {
    dashboard: '대시보드', analytics: '동영상 분석', ranking: '최근 인기 동영상', channel: '채널 분석',
    last30: '최근 30일', views: '조회수', watchTime: '시청 시간(시간)', latest: '최근 게시된 콘텐츠',
    published: '{{age}} 전에 게시됨', noVideos: '게시된 긴 동영상이 없습니다.', loading: '데이터를 불러오는 중...',
    retry: '다시 시도', unable: '데이터를 불러오지 못했습니다.', likes: '좋아요', comments: '댓글',
    rankByViews: '조회수 순위', ctr: '미리보기 이미지 클릭률', average: '평균 시청 시간',
    insufficient: '데이터 없음', sourceMissing: 'Shadow 분석 API가 필요합니다.', overview: '개요', reach: '도달',
    engagement: '참여도', audience: '시청자', lifetime: '전체', sincePublished: '게시 이후 조회수', traffic: '유입 경로',
    retention: '시청 지속 시간', realtime: '실시간', last48: '최근 48시간 조회수', noChart: '시계열 데이터가 없습니다.',
    topSources: '주요 유입 경로', compare: '최근 긴 동영상 10개를 동일한 게시 후 시간으로 비교',
    recentNotRanked: '최근 동영상(순위 미지원)', sameAgeUnavailable: '순위 계산에는 동일 기간 조회 기록이 필요합니다.',
    ageWindow: '게시 후 {{age}}', partial: '이전 동영상 일부는 아직 불러오지 않았습니다.',
    longNotice: 'Shorts 링크는 제외했습니다. 정확한 구분을 위해 동영상 유형 정보가 필요합니다.',
    back: '뒤로', videoMissing: '최근 게시 동영상에서 찾을 수 없습니다.', notMeasured: '측정되지 않음',
    viewDetails: '동영상 분석 열기', graphPending: '차트 데이터 대기 중',
  },
})

export function StudioFrame({ children }) {
  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-base,var(--shadow-bg-surface))] pb-[calc(104px+env(safe-area-inset-bottom,0px))] text-[var(--shadow-text-primary)]">
    <div className="mx-auto w-full max-w-[900px] space-y-6 px-4 py-6 sm:px-6">{children}</div>
  </main>
}

export function StudioCard({ children, className = '' }) {
  return <section className={`rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ${className}`}>{children}</section>
}

export function StudioMetric({ label, value, subtitle, icon: Icon = BarChart3 }) {
  return <StudioCard className="min-w-0 space-y-2">
    <div className="flex items-center gap-2 text-xs text-[var(--shadow-text-secondary)]"><Icon size={15} />{label}</div>
    <div className="text-2xl font-bold tabular-nums">{formatStudioCount(value)}</div>
    {subtitle ? <p className="text-xs text-[var(--shadow-text-secondary)]">{subtitle}</p> : null}
  </StudioCard>
}

export function StudioThumbnail({ video, className = '' }) {
  return <div className={`relative shrink-0 overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)] ${className}`}>
    {video?.thumbnail_url ? <img src={video.thumbnail_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center"><Eye size={19} /></span>}
  </div>
}

export function StudioBackHeader({ title, onBack, video }) {
  const navigate = useNavigate()
  return <header className="flex min-w-0 items-center gap-3">
    <button type="button" onClick={onBack || (() => navigate(-1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-soft)]"><ArrowLeft size={22} /></button>
    {video ? <StudioThumbnail video={video} className="h-10 w-[68px]" /> : null}
    <h1 className="min-w-0 truncate text-lg font-bold">{title}</h1>
  </header>
}

export function StudioEmptyGraph({ title, subtitle }) {
  return <StudioCard className="space-y-4">
    <h3 className="font-semibold">{title}</h3>
    {subtitle ? <p className="text-xs text-[var(--shadow-text-secondary)]">{subtitle}</p> : null}
    <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--shadow-border)] text-center text-[var(--shadow-text-secondary)]">
      <BarChart3 size={25} strokeWidth={1.5} /><span className="px-3 text-xs">—</span>
    </div>
  </StudioCard>
}

export function StudioMissing({ children }) {
  return <div className="flex items-start gap-2 text-xs text-[var(--shadow-text-secondary)]"><CircleHelp size={15} className="mt-0.5 shrink-0" />{children}</div>
}

export function StudioRetry({ message, onRetry, label }) {
  return <StudioCard className="space-y-3 text-sm"><p role="alert" className="text-[var(--shadow-text-secondary)]">{message}</p><button onClick={onRetry} type="button" className="inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-4 py-2"><RefreshCw size={15}/>{label}</button></StudioCard>
}

export function formatStudioCount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value) : '—'
}

export function studioVideoAge(date) {
  const time = new Date(date).getTime()
  if (!Number.isFinite(time)) return '—'
  const minutes = Math.max(0, Math.floor((Date.now() - time) / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  if (days) return `${days}d ${hours}h`
  if (hours) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}

export function StudioTimeLabel({ children }) {
  return <p className="flex items-center gap-1 text-xs text-[var(--shadow-text-secondary)]"><Clock3 size={12}/>{children}</p>
}
