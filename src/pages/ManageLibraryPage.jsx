import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Database, Download, Trash2 } from 'lucide-react'
import { PageShell, PageHeader, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import LibraryCacheSettings from '../components/library/LibraryCacheSettings'
import ReaderLibraryTrash from '../components/library/ReaderLibraryTrash'

registerTranslationNamespace('manageLibraryPage', {
  en: {
    title: 'Manage Library', cache: 'Cache', downloads: 'Offline Downloads', trash: 'Trash',
    cacheDescription: 'Manage storage', downloadsDescription: 'Manage downloaded stories', trashDescription: 'Restore removed stories within 30 days',
    back: 'Back to Library', pendingCache: 'Cache settings will be added in the next step.',
    pendingDownloads: 'Offline download management will be added in a later step.',
  },
  km: {
    title: 'គ្រប់គ្រង Library', cache: 'Cache', downloads: 'ការទាញយក Offline', trash: 'ធុងសំរាម',
    cacheDescription: 'គ្រប់គ្រងទំហំផ្ទុក', downloadsDescription: 'គ្រប់គ្រងរឿងដែលបានទាញយក', trashDescription: 'ស្ដាររឿងដែលបានដកចេញក្នុងរយៈពេល ៣០ ថ្ងៃ',
    back: 'ត្រឡប់ទៅ Library', pendingCache: 'ការកំណត់ Cache នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
    pendingDownloads: 'ការគ្រប់គ្រងការទាញយក Offline នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
  },
  zh: {
    title: '管理书库', cache: '缓存', downloads: '离线下载', trash: '回收站',
    cacheDescription: '管理存储空间', downloadsDescription: '管理已下载的故事', trashDescription: '30天内恢复已移除的作品',
    back: '返回书库', pendingCache: '缓存设置将在下一步添加。',
    pendingDownloads: '离线下载管理将在后续步骤中添加。',
  },
  ja: {
    title: 'ライブラリ管理', cache: 'キャッシュ', downloads: 'オフラインダウンロード', trash: 'ゴミ箱',
    cacheDescription: '保存容量を管理', downloadsDescription: 'ダウンロードした作品を管理', trashDescription: '削除した作品を30日以内に復元',
    back: 'ライブラリに戻る', pendingCache: 'キャッシュ設定は次の段階で追加されます。',
    pendingDownloads: 'オフラインダウンロード管理は今後追加されます。',
  },
  ko: {
    title: '라이브러리 관리', cache: '캐시', downloads: '오프라인 다운로드', trash: '휴지통',
    cacheDescription: '저장 공간 관리', downloadsDescription: '다운로드한 스토리 관리', trashDescription: '삭제한 작품을 30일 이내 복원',
    back: '라이브러리로 돌아가기', pendingCache: '캐시 설정은 다음 단계에서 추가됩니다.',
    pendingDownloads: '오프라인 다운로드 관리는 이후 단계에서 추가됩니다.',
  },
})

const items = [
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
