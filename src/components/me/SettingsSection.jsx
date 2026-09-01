import { Link } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('settingsSection', {
  en: {
    title: 'Settings',
    settingsPrivacy: 'Settings & Privacy',
    settingsPrivacySubtitle: 'Open language, privacy, reading preferences, and more.',
    notifications: 'Notifications',
    notificationsSubtitle: 'Check updates, alerts, and account-related notifications.',
    privacySafety: 'Privacy & Safety',
    privacySafetySubtitle: 'Manage your personal information and reader safety options.',
  },
  km: {
    title: 'ការកំណត់',
    settingsPrivacy: 'ការកំណត់ និងឯកជនភាព',
    settingsPrivacySubtitle: 'បើកការកំណត់ភាសា ឯកជនភាព ចំណូលចិត្តអាន និងផ្សេងៗទៀត។',
    notifications: 'ការជូនដំណឹង',
    notificationsSubtitle: 'ពិនិត្យអាប់ដេត ការជូនដំណឹង និងព័ត៌មានពាក់ព័ន្ធនឹងគណនី។',
    privacySafety: 'ឯកជនភាព និងសុវត្ថិភាព',
    privacySafetySubtitle: 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងជម្រើសសុវត្ថិភាពអ្នកអាន។',
  },
  zh: {
    title: '设置',
    settingsPrivacy: '设置与隐私',
    settingsPrivacySubtitle: '管理语言、隐私、阅读偏好等设置。',
    notifications: '通知',
    notificationsSubtitle: '查看更新、提醒和账户相关通知。',
    privacySafety: '隐私与安全',
    privacySafetySubtitle: '管理个人信息和读者安全选项。',
  },
  ja: {
    title: '設定',
    settingsPrivacy: '設定とプライバシー',
    settingsPrivacySubtitle: '言語、プライバシー、読書設定などを管理します。',
    notifications: '通知',
    notificationsSubtitle: '更新、アラート、アカウント関連の通知を確認します。',
    privacySafety: 'プライバシーと安全',
    privacySafetySubtitle: '個人情報と読者向け安全設定を管理します。',
  },
  ko: {
    title: '설정',
    settingsPrivacy: '설정 및 개인정보',
    settingsPrivacySubtitle: '언어, 개인정보, 읽기 환경설정 등을 관리합니다.',
    notifications: '알림',
    notificationsSubtitle: '업데이트, 알림 및 계정 관련 소식을 확인합니다.',
    privacySafety: '개인정보 및 안전',
    privacySafetySubtitle: '개인정보와 독자 안전 옵션을 관리합니다.',
  },
})

function SettingsRow({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-sm transition hover:bg-[var(--shadow-bg-hover)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--shadow-bg-soft)]">
          <span className="text-[17px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-[13px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--shadow-text-secondary)]">
            {subtitle}
          </p>
        </div>
      </div>
      <i className="fas fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]" />
    </Link>
  )
}

export default function SettingsSection() {
  const { t } = useDisplayTranslation()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
          {t('settingsSection.title')}
        </h2>
      </div>

      <div className="space-y-3">
        <SettingsRow
          to="/settings"
          icon="⚙️"
          title={t('settingsSection.settingsPrivacy')}
          subtitle={t('settingsSection.settingsPrivacySubtitle')}
        />
        <SettingsRow
          to="/settings"
          icon="🔔"
          title={t('settingsSection.notifications')}
          subtitle={t('settingsSection.notificationsSubtitle')}
        />
        <SettingsRow
          to="/settings"
          icon="🛡️"
          title={t('settingsSection.privacySafety')}
          subtitle={t('settingsSection.privacySafetySubtitle')}
        />
      </div>
    </>
  )
}
