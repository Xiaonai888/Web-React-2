import { useEffect, useState } from 'react'
import { Archive, ChevronRight, Clapperboard, FolderOpen, ListVideo, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import { getStudioMeSummary } from '../../services/shadowStudioMeApi'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('shadowStudioMe', {
  en: { me: 'Me', studio: 'Shadow Studio', total: 'Total Videos', long: 'Long', short: 'Short', library: 'Library', librarySub: 'Browse your videos', playlists: 'Playlists', playlistsSub: 'Organize video collections', archive: 'Archive', archiveSub: 'Keep videos out of your library', trash: 'Trash', trashSub: 'Recover deleted videos within 30 days', loadError: 'Unable to load video totals', retry: 'Retry' },
  km: { me: 'Me', studio: 'Shadow Studio', total: 'វីដេអូសរុប', long: 'វីដេអូវែង', short: 'វីដេអូខ្លី', library: 'បណ្ណាល័យ', librarySub: 'រកមើលវីដេអូរបស់អ្នក', playlists: 'Playlists', playlistsSub: 'រៀបចំក្រុមវីដេអូ', archive: 'Archive', archiveSub: 'រក្សាវីដេអូទុកដោយលាក់ពីបណ្ណាល័យ', trash: 'ធុងសម្រាម', trashSub: 'ស្តារវីដេអូដែលបានលុបក្នុងរយៈពេល ៣០ ថ្ងៃ', loadError: 'មិនអាចទាញចំនួនវីដេអូបាន', retry: 'សាកល្បងម្ដងទៀត' },
  zh: { me: '我的', studio: 'Shadow Studio', total: '视频总数', long: '长视频', short: '短视频', library: '视频库', librarySub: '浏览您的视频', playlists: '播放列表', playlistsSub: '整理视频合集', archive: '归档', archiveSub: '从视频库中隐藏视频', trash: '回收站', trashSub: '30 天内恢复已删除视频', loadError: '无法加载视频统计', retry: '重试' },
  ja: { me: 'マイページ', studio: 'Shadow Studio', total: '動画の合計', long: '長編', short: 'ショート', library: 'ライブラリ', librarySub: '動画を閲覧', playlists: 'プレイリスト', playlistsSub: '動画を整理', archive: 'アーカイブ', archiveSub: 'ライブラリから動画を非表示', trash: 'ゴミ箱', trashSub: '30 日以内に動画を復元', loadError: '動画数を取得できません', retry: '再試行' },
  ko: { me: '내 정보', studio: 'Shadow Studio', total: '전체 동영상', long: '긴 동영상', short: '쇼츠', library: '라이브러리', librarySub: '내 동영상 보기', playlists: '재생목록', playlistsSub: '동영상 모음 정리', archive: '보관함', archiveSub: '라이브러리에서 동영상 숨기기', trash: '휴지통', trashSub: '30일 이내에 삭제한 동영상 복구', loadError: '동영상 수를 불러오지 못했습니다', retry: '다시 시도' },
})

const MENU = [
  { key: 'library', Icon: FolderOpen, path: '/author/reel/studio/library' },
  { key: 'playlists', Icon: ListVideo, path: '/author/reel/studio/playlists' },
  { key: 'archive', Icon: Archive, path: '/author/reel/studio/archive' },
  { key: 'trash', Icon: Trash2, path: '/author/reel/studio/trash' },
]

export default function AuthorStudioMePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [totals, setTotals] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getStudioMeSummary({ signal: controller.signal, force: refresh > 0 })
      .then(result => { if (!controller.signal.aborted) setTotals(result) })
      .catch(() => { if (!controller.signal.aborted) setError(t('shadowStudioMe.loadError')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [refresh, t])

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-28 text-[var(--shadow-text-primary)]">
    <div className="mx-auto max-w-4xl px-4 pt-2 sm:px-6">
      <section className="mb-6 grid grid-cols-3 divide-x divide-[var(--shadow-border)] rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-2 py-5 shadow-sm" aria-label={t('shadowStudioMe.total')}>
        {[
          ['total', Clapperboard],
          ['long', Clapperboard],
          ['short', Clapperboard],
        ].map(([key, Icon]) => <div className="flex min-w-0 flex-col items-center gap-1 px-1 text-center" key={key}>
          <Icon size={17} className="text-[var(--shadow-accent)]" aria-hidden="true" />
          <span className="text-xl font-extrabold tabular-nums sm:text-2xl">{loading && !totals ? '…' : totals?.[key] ?? '—'}</span>
          <span className="text-[11px] text-[var(--shadow-text-secondary)] sm:text-xs">{t(`shadowStudioMe.${key}`)}</span>
        </div>)}
      </section>
      {error ? <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs text-[var(--shadow-danger)]" role="alert"><span>{error}</span><button type="button" onClick={() => setRefresh(n => n + 1)} className="shrink-0 rounded-lg bg-[var(--shadow-accent)] px-3 py-2 font-semibold text-[var(--shadow-accent-text)]">{t('shadowStudioMe.retry')}</button></div> : null}
      <nav aria-label={t('shadowStudioMe.me')} className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
        {MENU.map(({ key, Icon, path }, index) => <button type="button" key={key} onClick={() => navigate(path)} className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[var(--shadow-bg-soft)] active:bg-[var(--shadow-bg-soft)] ${index ? 'border-t border-[var(--shadow-border)]' : ''}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"><Icon size={20} strokeWidth={1.8} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{t(`shadowStudioMe.${key}`)}</span><span className="mt-0.5 block text-[11px] text-[var(--shadow-text-secondary)]">{t(`shadowStudioMe.${key}Sub`)}</span></span>
          <ChevronRight size={17} className="shrink-0 text-[var(--shadow-text-tertiary)]" aria-hidden="true" />
        </button>)}
      </nav>
    </div>
    <ShadowStudioFooter activeTab="me" enabledTabs={['dashboard', 'content', 'analytics', 'me']} onTabChange={tab => {
      if (tab === 'dashboard') navigate('/author/reel/studio/dashboard')
      if (tab === 'content') navigate('/author/reel/studio')
    }} />
  </main>
}
