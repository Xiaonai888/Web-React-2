import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Database, Download } from 'lucide-react'
import { PageShell, PageHeader, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('manageLibraryPage', {
  en: {
    title: 'Manage Library', cache: 'Cache', downloads: 'Offline Downloads',
    back: 'Back to Library', pendingCache: 'Cache settings will be added in the next step.',
    pendingDownloads: 'Offline download management will be added in a later step.',
  },
  km: {
    title: 'គ្រប់គ្រង Library', cache: 'Cache', downloads: 'ការទាញយក Offline',
    back: 'ត្រឡប់ទៅ Library', pendingCache: 'ការកំណត់ Cache នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
    pendingDownloads: 'ការគ្រប់គ្រងការទាញយក Offline នឹងត្រូវបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
  },
  zh: {
    title: '管理书库', cache: '缓存', downloads: '离线下载',
    back: '返回书库', pendingCache: '缓存设置将在下一步添加。',
    pendingDownloads: '离线下载管理将在后续步骤中添加。',
  },
  ja: {
    title: 'ライブラリ管理', cache: 'キャッシュ', downloads: 'オフラインダウンロード',
    back: 'ライブラリに戻る', pendingCache: 'キャッシュ設定は次の段階で追加されます。',
    pendingDownloads: 'オフラインダウンロード管理は今後追加されます。',
  },
  ko: {
    title: '라이브러리 관리', cache: '캐시', downloads: '오프라인 다운로드',
    back: '라이브러리로 돌아가기', pendingCache: '캐시 설정은 다음 단계에서 추가됩니다.',
    pendingDownloads: '오프라인 다운로드 관리는 이후 단계에서 추가됩니다.',
  },
})

const items = [
  { id: 'cache', key: 'cache', Icon: Database },
  { id: 'offline-downloads', key: 'downloads', Icon: Download },
]

export default function ManageLibraryPage() {
  const navigate = useNavigate()
  const { section } = useParams()
  const { t } = useDisplayTranslation()
  const selected = items.find((item) => item.id === section)

  return (
    <PageShell className="pb-[88px]">
      <PageHeader
        title={selected ? t(`manageLibraryPage.${selected.key}`) : t('manageLibraryPage.title')}
        onBack={() => navigate(selected ? '/library/manage' : '/library')}
        backLabel={t('manageLibraryPage.back')}
      />
      <main className="mx-auto w-full max-w-[640px] px-4 py-5 sm:px-5">
        {selected ? (
          <SurfaceCard className="p-5">
            <p className="text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t(`manageLibraryPage.${selected.id === 'cache' ? 'pendingCache' : 'pendingDownloads'}`)}
            </p>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="divide-y divide-[var(--shadow-border)] overflow-hidden">
            {items.map(({ id, key, Icon }) => (
              <Link
                key={id}
                to={`/library/manage/${id}`}
                className="flex min-h-[72px] items-center gap-3 px-4 py-4 active:bg-[var(--shadow-bg-hover)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[#8B5CF6]">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                  {t(`manageLibraryPage.${key}`)}
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
