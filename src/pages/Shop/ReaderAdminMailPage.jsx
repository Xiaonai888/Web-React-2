import { useNavigate } from 'react-router-dom'
import { PageShell, PageHeader, PageEmptyState } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerAdminMailPage', {
  en: {
    title: 'Mail to Admin',
    comingSoon: 'Coming Soon',
    description: 'You will be able to message Shadow Admin directly here soon.',
    back: 'Go back',
  },
  km: {
    title: 'សារទៅកាន់ Admin',
    comingSoon: 'នឹងមកដល់ឆាប់ៗនេះ',
    description: 'អ្នកនឹងអាចផ្ញើសារទៅកាន់ Shadow Admin ដោយផ្ទាល់នៅទីនេះក្នុងពេលឆាប់ៗនេះ។',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '联系管理员',
    comingSoon: '即将推出',
    description: '您很快就可以在这里直接向 Shadow Admin 发送消息。',
    back: '返回',
  },
  ja: {
    title: '管理者へのメール',
    comingSoon: '近日公開',
    description: 'まもなくここから Shadow Admin に直接メッセージを送れるようになります。',
    back: '戻る',
  },
  ko: {
    title: '관리자에게 메일',
    comingSoon: '곧 출시됩니다',
    description: '곧 여기에서 Shadow Admin에게 직접 메시지를 보낼 수 있습니다.',
    back: '뒤로 가기',
  },
})

export default function ReaderAdminMailPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <PageShell className="pb-20">
      <PageHeader
        title={t('readerAdminMailPage.title')}
        onBack={() => navigate(-1)}
        backLabel={t('readerAdminMailPage.back')}
      />
      <main className="mx-auto w-full max-w-[960px] px-4 py-10">
        <PageEmptyState
          icon={<i className="far fa-envelope text-[23px] text-[var(--shadow-text-primary)]" />}
          title={t('readerAdminMailPage.comingSoon')}
          body={t('readerAdminMailPage.description')}
        />
      </main>
    </PageShell>
  )
}
