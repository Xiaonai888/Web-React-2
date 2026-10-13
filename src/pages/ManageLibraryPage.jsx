import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bell, ChevronRight, Database, Download, Trash2 } from 'lucide-react'
import { PageShell, PageHeader, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import LibraryNotificationSettingsPage from './LibraryNotificationSettingsPage'
import LibraryCacheSettings from '../components/library/LibraryCacheSettings'
import ReaderLibraryTrash from '../components/library/ReaderLibraryTrash'
import OfflineDownloadsPanel from '../components/library/OfflineDownloadsPanel'

registerTranslationNamespace('manageLibraryPage', {
  en: {
    title: 'Manage Library', notification: 'Notification', cache: 'Cache', downloads: 'Offline Downloads', trash: 'Trash',
    notificationDescription: 'New episodes from subscribed stories',
    cacheDescription: 'Manage storage', downloadsDescription: 'Manage downloaded stories', trashDescription: 'Restore removed stories within 30 days',
    back: 'Back to Library', pendingCache: 'Cache settings will be added in the next step.',
    pendingDownloads: 'Offline download management will be added in a later step.',
  },
  km: {
    title: 'គ្រប់គ្រង Library', notification: 'ការជូនដំណឹង', cache: 'Cache', downloads: 'ការទាញយក Offline', trash: 'ធុងសំរាម',
    notificationDescription: 'ទទួលដំណឹងពេលរឿងដែលបានតាមដានចេញភាគថ្មី',
    cacheDescription: 'គ្រប់គ្រងទំហំផ្ទុក', downloadsDescription: 'គ្រប់គ្រងរឿងដែលបានទាញយក', trashDescription: 'ស្ដាររឿងដែលបានដកចេញក្នុងរយៈពេល ៣០ ថ្ងៃ',
    back: 'ត្រឡប់ទៅ Library', pendingCache: 'ការកំណត់ Cache នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
    pendingDownloads: 'ការគ្រប់គ្រងការទាញយក Offline នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
  },
  zh: {
    title: '管理书库', notification: '通知', cache: '缓存', downloads: '离线下载', trash: '回收站',
    notificationDescription: '订阅作品的新章节通知',
    cacheDescription: '管理存储空间', downloadsDescription: '管理已下载的作品', trashDescription: '恢复30天内移除的作品',
    back: '返回书库', pendingCache: '缓存设置将在下一步添加。',
    pendingDownloads: '离线下载管理将在后续步骤中添加。',
  },
  ja: {
    title: 'ライブラリ管理', notification: '通知', cache: 'キャッシュ', downloads: 'オフラインダウンロード', trash: 'ゴミ箱',
    notificationDescription: '購読中の作品の新着エピソード通知',
    cacheDescription: '保存容量を管理', downloadsDescription: 'ダウンロードした作品を管理', trashDescription: '削除した作品を30日以内に復元',
    back: 'ライブラリに戻る', pendingCache: 'キャッシュ設定は次の段階で追加されます。',
    pendingDownloads: 'オフラインダウンロード管理は今後追加されます。',
  },
  ko: {
    title: '라이브러리 관리', notification: '알림', cache: '캐시', downloads: '오프라인 다운로드', trash: '휴지통',
    notificationDescription: '구독 중인 작품의 새 에피소드 알림',
    cacheDescription: '저장 공간 관리', downloadsDescription: '다운로드한 스토리 관리', trashDescription: '삭제한 작품을 30일 이내 복원',
    back: '라이브러리로 돌아가기', pendingCache: '캐시 설정은 다음 단계에서 추가됩니다.',
    pendingDownloads: '오프라인 다운로드 관리는 이후 단계에서 추가됩니다.',
  },
})

const items = [
  { id: 'notification', key: 'notification', Icon: Bell },
  { id: 'cache', key: 'cache', Icon: Database },
  { id: 'offline-downloads', key: 'downloads', Icon: Download },
  { id: 'trash', key: 'trash', Icon: Trash2 },
]

export default function ManageLibraryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const source = new URLSearchParams(location.search).get('source') === 'me' ? '?source=me' : ''
  const { section } = useParams()
  const { t } = useDisplayTranslation()
  const selected = items.find((item) => item.id === section)

  if (section === 'notification') {
    return <LibraryNotificationSettingsPage />
  }

  return (
    <PageShell className="pb-[88px]">
      <PageHeader
        title={selected ? t(`manageLibraryPage.${selected.key}`) : t('manageLibraryPage.title')}
        onBack={() => navigate((selected ? '/library/manage' : '/library') + source)}
        backLabel={t('manageLibraryPage.back')}
      />
      <main className="mx-auto w-full max-w-[640px] px-4 py-5 sm:px-5">
        {selected?.id === 'cache' ? (
          <LibraryCacheSettings />
        ) : selected?.id === 'trash' ? (
          <ReaderLibraryTrash />
        ) : selected?.id === 'offline-downloads' ? (
          <OfflineDownloadsPanel />
        ) : selected ? (
          <SurfaceCard className="p-5">
            <p className="text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('manageLibraryPage.pendingDownloads')}
            </p>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="divide-y divide-[var(--shadow-border)] overflow-hidden">
            {items.map(({ id, key, Icon }) => (
              <Link
                key={id}
                to={`/library/manage/${id}${source}`}
                className="flex min-h-[72px] items-center gap-3 px-4 py-4 active:bg-[var(--shadow-bg-hover)]"
              >
                <span className="flex w-5 shrink-0 items-center justify-center text-[#8B5CF6]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-[var(--shadow-text-primary)]">{t(`manageLibraryPage.${key}`)}</span>
                  <span className="mt-1 block text-[11px] text-[var(--shadow-text-secondary)]">{t(`manageLibraryPage.${key}Description`)}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-[var(--shadow-text-tertiary)]" aria-hidden="true" />
              </Link>
            ))}
          </SurfaceCard>
        )}
      </main>
    </PageShell>
  )
}
