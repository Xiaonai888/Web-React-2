import { useCallback, useEffect, useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { SurfaceCard } from '../common/PagePrimitives'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('readerLibraryTrash', {
  en: { info: 'Removed stories stay here for 30 days. Restore them to your Library before they expire.', all: 'All', novel: 'Novel', manga: 'Manga', chat_story: 'Chat Story', empty: 'No stories in Trash.', loading: 'Loading Trash…', failed: 'Could not load Trash. Try again.', restore: 'Restore', restoring: 'Restoring…', restored: 'Story restored to Library.', restoreFailed: 'Could not restore the story. Try again.', days: '{{count}} days left', today: 'Expires today', more: 'Show more', login: 'Log in to view your Trash.', retry: 'Retry' },
  km: { info: 'រឿងដែលដកចេញពី Library រក្សាទុកនៅទីនេះ ៣០ ថ្ងៃ។ អ្នកអាចស្ដារវិញមុនផុតកំណត់។', all: 'ទាំងអស់', novel: 'ប្រលោមលោក', manga: 'Manga', chat_story: 'Chat Story', empty: 'មិនមានរឿងក្នុងធុងសំរាមទេ។', loading: 'កំពុងផ្ទុកធុងសំរាម…', failed: 'មិនអាចផ្ទុកធុងសំរាមបានទេ។ សូមសាកល្បងម្ដងទៀត។', restore: 'ស្ដារវិញ', restoring: 'កំពុងស្ដារ…', restored: 'បានស្ដាររឿងទៅ Library វិញ។', restoreFailed: 'មិនអាចស្ដាររឿងបានទេ។ សូមសាកល្បងម្ដងទៀត។', days: 'នៅសល់ {{count}} ថ្ងៃ', today: 'ផុតកំណត់ថ្ងៃនេះ', more: 'បង្ហាញបន្ថែម', login: 'សូម Login ដើម្បីមើលធុងសំរាម។', retry: 'សាកម្តងទៀត' },
  zh: { info: '从书库移除的作品在此保留30天，请在到期前恢复。', all: '全部', novel: '小说', manga: '漫画', chat_story: '聊天故事', empty: '回收站暂无作品。', loading: '正在加载回收站…', failed: '无法加载回收站，请重试。', restore: '恢复', restoring: '正在恢复…', restored: '已恢复至书库。', restoreFailed: '恢复失败，请重试。', days: '剩余{{count}}天', today: '今天到期', more: '加载更多', login: '登录以查看回收站。', retry: '重试' },
  ja: { info: 'ライブラリから削除した作品は30日間ここに保存されます。期限前に復元してください。', all: 'すべて', novel: '小説', manga: 'マンガ', chat_story: 'チャットストーリー', empty: 'ゴミ箱に作品はありません。', loading: 'ゴミ箱を読み込み中…', failed: '読み込めませんでした。再試行してください。', restore: '復元', restoring: '復元中…', restored: 'ライブラリに復元しました。', restoreFailed: '復元できませんでした。再試行してください。', days: '残り{{count}}日', today: '本日まで', more: 'さらに表示', login: 'ログインしてゴミ箱を表示してください。', retry: '再試行' },
  ko: { info: '라이브러리에서 삭제한 작품은 30일 동안 보관됩니다. 만료 전에 복원하세요.', all: '전체', novel: '소설', manga: '만화', chat_story: '채팅 스토리', empty: '휴지통이 비어 있습니다.', loading: '휴지통 불러오는 중…', failed: '휴지통을 불러오지 못했습니다. 다시 시도하세요.', restore: '복원', restoring: '복원 중…', restored: '라이브러리로 복원했습니다.', restoreFailed: '복원하지 못했습니다. 다시 시도하세요.', days: '{{count}}일 남음', today: '오늘 만료', more: '더 보기', login: '로그인하여 휴지통을 확인하세요.', retry: '다시 시도' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const FILTERS = ['all', 'novel', 'manga', 'chat_story']

function readerToken() {
  try { return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || '' }
  catch { return '' }
}

export default function ReaderLibraryTrash() {
  const { t } = useDisplayTranslation()
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [nextOffset, setNextOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [restoring, setRestoring] = useState('')
  const token = readerToken()

  const loadPage = useCallback(async (offset = 0) => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/library/trash?offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.ok !== true) throw new Error('TRASH_LOAD_FAILED')
      setItems((previous) => offset === 0 ? (result.items || []) : [
        ...previous, ...(result.items || []).filter((item) => !previous.some((old) => old.story_id === item.story_id)),
      ])
      setNextOffset(Number(result.nextOffset) || 0)
      setHasMore(result.hasMore === true)
    } catch {
      setError('failed')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadPage(0) }, [loadPage])

  const restore = async (storyId) => {
    if (!token || restoring) return
    setRestoring(storyId)
    setStatus('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/library/trash/${encodeURIComponent(storyId)}/restore`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.ok !== true) throw new Error('TRASH_RESTORE_FAILED')
      setItems((previous) => previous.filter((item) => item.story_id !== storyId))
      setStatus('restored')
    } catch {
      setStatus('restoreFailed')
    } finally {
      setRestoring('')
    }
  }

  const visible = items.filter((item) => filter === 'all' || item.story_type === filter)
  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Trash2 size={20} className="mt-0.5 shrink-0 text-[#8B5CF6]" aria-hidden="true" />
          <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('readerLibraryTrash.info')}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group">
          {FILTERS.map((type) => (
            <button key={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)}
              className={`min-h-10 shrink-0 rounded-full border px-3 text-[12px] font-semibold ${filter === type ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white' : 'border-[var(--shadow-border)] text-[var(--shadow-text-secondary)]'}`}>
              {t(`readerLibraryTrash.${type}`)}
            </button>
          ))}
        </div>
      </SurfaceCard>
      {!token ? (
        <SurfaceCard className="p-5 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('readerLibraryTrash.login')}</SurfaceCard>
      ) : (
        <SurfaceCard className="divide-y divide-[var(--shadow-border)] overflow-hidden">
          {status && <p className="p-4 text-[12px] text-[var(--shadow-text-secondary)]" role="status">{t(`readerLibraryTrash.${status}`)}</p>}
          {visible.map((item) => {
            const expires = new Date(item.expires_at).getTime()
            const days = Number.isFinite(expires) ? Math.max(0, Math.ceil((expires - Date.now()) / 86400000)) : 0
            return (
              <div key={item.story_id} className="flex items-center gap-3 p-4">
                {item.story?.cover_url ? (
                  <img src={item.story.cover_url} alt="" loading="lazy" className="h-16 w-11 shrink-0 rounded-md bg-[var(--shadow-bg-soft)] object-cover" />
                ) : <div className="h-16 w-11 shrink-0 rounded-md bg-[var(--shadow-bg-soft)]" />}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[13px] font-semibold text-[var(--shadow-text-primary)]">{item.story?.title || '—'}</p>
                  <p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{t(`readerLibraryTrash.${item.story_type || 'novel'}`)}</p>
                  <p className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">{days ? t('readerLibraryTrash.days', { count: days }) : t('readerLibraryTrash.today')}</p>
                </div>
                <button type="button" disabled={Boolean(restoring) || loading} onClick={() => restore(item.story_id)}
                  className="flex min-h-10 shrink-0 items-center gap-1 rounded-xl border border-[var(--shadow-border)] px-3 text-[12px] font-semibold text-[#8B5CF6] disabled:opacity-50">
                  <RotateCcw size={14} aria-hidden="true" />{t(`readerLibraryTrash.${restoring === item.story_id ? 'restoring' : 'restore'}`)}
                </button>
              </div>
            )
          })}
          {!loading && !error && visible.length === 0 && <p className="p-6 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('readerLibraryTrash.empty')}</p>}
          {error && <div className="space-y-2 p-4 text-center"><p role="alert" className="text-[12px] text-red-600">{t('readerLibraryTrash.failed')}</p><button type="button" className="min-h-10 rounded-xl border border-[var(--shadow-border)] px-4 text-[12px]" onClick={() => loadPage(0)}>{t('readerLibraryTrash.retry')}</button></div>}
          {loading && <p className="p-4 text-center text-[12px] text-[var(--shadow-text-secondary)]" role="status">{t('readerLibraryTrash.loading')}</p>}
          {!error && hasMore && !loading && <button type="button" onClick={() => loadPage(nextOffset)} className="min-h-11 w-full text-[12px] font-semibold text-[#8B5CF6]">{t('readerLibraryTrash.more')}</button>}
        </SurfaceCard>
      )}
    </div>
  )
}
