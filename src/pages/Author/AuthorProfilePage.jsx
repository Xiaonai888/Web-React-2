import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import { fetchMyAuthorPageCached } from '../../services/myAuthorPageClientCache.js'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorProfile', {
  en: {
    myIncome: 'My Income', incomeSubtitle: 'Earnings and payout details', quest: 'Quest', questSubtitle: 'Tasks and creator rewards', authorBenefits: 'Author Benefits', benefitsSubtitle: 'Creator programs and support', commentProtection: 'Comment Protection', protectionSubtitle: 'Blocked words and hidden comments', trash: 'Trash', trashSubtitle: 'Restore deleted stories within 30 days', closeProfileSwitcher: 'Close profile switcher', authorPage: 'Author Page', notification: '{{count}} notification', notifications: '{{count}} notifications', manageAccount: 'Manage Account', notificationsLabel: 'Notifications', settings: 'Settings', switchProfile: 'Switch Profile', openDiamondHistory: 'Open Diamond history', diamond: 'Diamond', openIncomeRecords: 'Open income records', earned: 'Earned', openGiftHistory: 'Open Gift history', gift: 'Gift', author: 'Author', reader: 'Reader', failedProfile: 'Failed to load author profile', failedSummary: 'Failed to load author summary', cannotConnect: 'Cannot connect to backend.'
  },
  km: {
    myIncome: 'ចំណូលរបស់ខ្ញុំ', incomeSubtitle: 'ចំណូល និងព័ត៌មានដកប្រាក់', quest: 'បេសកកម្ម', questSubtitle: 'ភារកិច្ច និងរង្វាន់អ្នកបង្កើត', authorBenefits: 'អត្ថប្រយោជន៍អ្នកនិពន្ធ', benefitsSubtitle: 'កម្មវិធី និងការគាំទ្រអ្នកបង្កើត', commentProtection: 'ការពារមតិយោបល់', protectionSubtitle: 'ពាក្យដែលបានបិទ និងមតិដែលបានលាក់', trash: 'ធុងសំរាម', trashSubtitle: 'ស្ដាររឿងដែលបានលុបក្នុងរយៈពេល 30 ថ្ងៃ', closeProfileSwitcher: 'បិទការប្ដូរប្រវត្តិរូប', authorPage: 'ទំព័រអ្នកនិពន្ធ', notification: '{{count}} ការជូនដំណឹង', notifications: '{{count}} ការជូនដំណឹង', manageAccount: 'គ្រប់គ្រងគណនី', notificationsLabel: 'ការជូនដំណឹង', settings: 'ការកំណត់', switchProfile: 'ប្ដូរប្រវត្តិរូប', openDiamondHistory: 'បើកប្រវត្តិ Diamond', diamond: 'Diamond', openIncomeRecords: 'បើកកំណត់ត្រាចំណូល', earned: 'ចំណូល', openGiftHistory: 'បើកប្រវត្តិអំណោយ', gift: 'អំណោយ', author: 'អ្នកនិពន្ធ', reader: 'អ្នកអាន', failedProfile: 'ផ្ទុកប្រវត្តិរូបអ្នកនិពន្ធមិនបាន', failedSummary: 'ផ្ទុកសង្ខេបអ្នកនិពន្ធមិនបាន', cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បាន។'
  },
  zh: {
    myIncome: '我的收入', incomeSubtitle: '收益与提现详情', quest: '任务', questSubtitle: '任务与创作者奖励', authorBenefits: '作者权益', benefitsSubtitle: '创作者计划与支持', commentProtection: '评论保护', protectionSubtitle: '屏蔽词与隐藏评论', trash: '回收站', trashSubtitle: '30 天内恢复已删除故事', closeProfileSwitcher: '关闭身份切换', authorPage: '作者主页', notification: '{{count}} 条通知', notifications: '{{count}} 条通知', manageAccount: '管理账户', notificationsLabel: '通知', settings: '设置', switchProfile: '切换身份', openDiamondHistory: '打开钻石记录', diamond: '钻石', openIncomeRecords: '打开收入记录', earned: '已赚取', openGiftHistory: '打开礼物记录', gift: '礼物', author: '作者', reader: '读者', failedProfile: '加载作者资料失败', failedSummary: '加载作者摘要失败', cannotConnect: '无法连接后端。'
  },
  ja: {
    myIncome: '収益', incomeSubtitle: '収益と支払いの詳細', quest: 'クエスト', questSubtitle: 'タスクとクリエイター報酬', authorBenefits: '作者特典', benefitsSubtitle: 'クリエイタープログラムとサポート', commentProtection: 'コメント保護', protectionSubtitle: 'ブロックした単語と非表示コメント', trash: 'ゴミ箱', trashSubtitle: '削除した作品を30日以内に復元', closeProfileSwitcher: 'プロフィール切り替えを閉じる', authorPage: '作者ページ', notification: '{{count}} 件の通知', notifications: '{{count}} 件の通知', manageAccount: 'アカウント管理', notificationsLabel: '通知', settings: '設定', switchProfile: 'プロフィール切り替え', openDiamondHistory: 'ダイヤ履歴を開く', diamond: 'ダイヤ', openIncomeRecords: '収益記録を開く', earned: '収益', openGiftHistory: 'ギフト履歴を開く', gift: 'ギフト', author: '作者', reader: '読者', failedProfile: '作者プロフィールの読み込みに失敗しました', failedSummary: '作者サマリーの読み込みに失敗しました', cannotConnect: 'バックエンドに接続できません。'
  },
  ko: {
    myIncome: '내 수익', incomeSubtitle: '수익 및 지급 상세', quest: '퀘스트', questSubtitle: '과제 및 크리에이터 보상', authorBenefits: '작가 혜택', benefitsSubtitle: '크리에이터 프로그램 및 지원', commentProtection: '댓글 보호', protectionSubtitle: '차단 단어 및 숨긴 댓글', trash: '휴지통', trashSubtitle: '삭제한 작품을 30일 이내 복원', closeProfileSwitcher: '프로필 전환 닫기', authorPage: '작가 페이지', notification: '알림 {{count}}개', notifications: '알림 {{count}}개', manageAccount: '계정 관리', notificationsLabel: '알림', settings: '설정', switchProfile: '프로필 전환', openDiamondHistory: '다이아 기록 열기', diamond: '다이아', openIncomeRecords: '수익 기록 열기', earned: '수익', openGiftHistory: '선물 기록 열기', gift: '선물', author: '작가', reader: '독자', failedProfile: '작가 프로필을 불러오지 못했습니다', failedSummary: '작가 요약을 불러오지 못했습니다', cannotConnect: '백엔드에 연결할 수 없습니다.'
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const PREVIEW_PROFILE = {
  page_name: 'Dara',
  page_username: 'dara-preview',
  avatar_url: '/assets/Icons/shadow-icon-192.png',
}

const PREVIEW_SUMMARY = {
  income: {
    today_diamonds: 24,
    this_month_usd: 18.5,
  },
  gifts: {
    total_received: 12,
  },
}

const MENU_ITEMS = [
  {
    icon: 'fa-solid fa-chart-line',
    titleKey: 'myIncome',
    subtitleKey: 'incomeSubtitle',
    path: '/author/income',
  },
  {
    icon: 'fa-solid fa-gift',
    titleKey: 'quest',
    subtitleKey: 'questSubtitle',
    path: '/author/quest',
  },
  {
    icon: 'fa-solid fa-crown',
    titleKey: 'authorBenefits',
    subtitleKey: 'benefitsSubtitle',
    path: '/author/benefits',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    titleKey: 'commentProtection',
    subtitleKey: 'protectionSubtitle',
    path: '/author/comment-protection',
  },
  {
    icon: 'fa-regular fa-trash-can',
    titleKey: 'trash',
    subtitleKey: 'trashSubtitle',
    path: '/author/trash',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredReaderUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function HeaderIcon({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
    >
      <i className={`${icon} text-[18px]`} />
    </button>
  )
}

function SummaryItem({ value, label }) {
  return (
    <div className="min-w-0 px-2 text-center">
      <div className="truncate text-[15px] font-extrabold text-[var(--shadow-text-primary)]">{value}</div>
      <div className="mt-1 truncate text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">{label}</div>
    </div>
  )
}

function MenuRow({ item, divider, onClick }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
          <i className={`${item.icon} text-[14px]`} />
        </div>

        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-normal text-[var(--shadow-text-primary)]">{t(`authorProfile.${item.titleKey}`)}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[var(--shadow-text-tertiary)]">{t(`authorProfile.${item.subtitleKey}`)}</div>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />

      {divider ? (
        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[var(--shadow-border)]" />
      ) : null}
    </button>
  )
}

function LoadingProfile() {
  return (
    <div className="animate-pulse px-3 pb-4 pt-1">
      <div className="flex justify-end gap-2">
        <div className="h-9 w-9 rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="h-9 w-9 rounded-full bg-[var(--shadow-bg-soft)]" />
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="h-[72px] w-[72px] rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="flex-1">
          <div className="h-5 w-28 rounded-full bg-[var(--shadow-bg-soft)]" />
          <div className="mt-2 h-3 w-20 rounded-full bg-[var(--shadow-bg-soft)]" />
        </div>
      </div>

      <div className="mt-5 h-12 rounded-[12px] bg-[var(--shadow-bg-soft)]" />
    </div>
  )
}

function ProfileSwitcherSheet({
  open,
  onClose,
  displayName,
  avatarUrl,
  avatarLetter,
  authorPage,
  authorNotificationCount,
  onOwnAccount,
  onAuthorPage,
  onManageAccount,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  const pageName = authorPage?.page_name || authorPage?.name || t('authorProfile.authorPage')
  const pageLogo = authorPage?.avatar_url || authorPage?.profile_image_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'

  return (
    <div className="fixed inset-0 z-[130]">
      <button
        type="button"
        aria-label={t('authorProfile.closeProfileSwitcher')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-1/2 md:right-auto md:top-20 md:w-[380px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)] md:hidden" />

        <div className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
          <button
            type="button"
            onClick={onOwnAccount}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{avatarLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{displayName}</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
          </button>

          <button
            type="button"
            onClick={onAuthorPage}
            className="flex w-full items-center justify-between gap-3 border-t border-[var(--shadow-border)] px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                {pageLogo ? (
                  <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{pageLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{pageName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span>{t(Number(authorNotificationCount) === 1 ? 'authorProfile.notification' : 'authorProfile.notifications', { count: authorNotificationCount })}</span>
                </div>
              </div>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]">
              <i className="fa-solid fa-check text-[10px]" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onManageAccount}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-[0.99]"
        >
          {t('authorProfile.manageAccount')}
        </button>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img
            src="/assets/Icons/Logo Shadow 2.svg"
            alt=""
            className="h-10 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  )
}

export default function AuthorProfilePage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const storedAuthorPage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
    } catch {
      return null
    }
  }, [])
  const storedReaderUser = useMemo(() => getStoredReaderUser(), [])
  const [authorPage, setAuthorPage] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_PROFILE : storedAuthorPage
  )
  const [summary, setSummary] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_SUMMARY : null
  )
  const [loading, setLoading] = useState(!AUTHOR_PREVIEW_ENABLED)
  const [error, setError] = useState('')
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('settings-popup-open', profileSwitcherOpen)

    return () => {
      document.body.classList.remove('settings-popup-open')
    }
  }, [profileSwitcherOpen])

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadProfile() {
      if (AUTHOR_PREVIEW_ENABLED) return

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [profileData, incomeResponse] =
          await Promise.all([
            fetchMyAuthorPageCached({
              apiBaseUrl: API_BASE_URL,
              token,
              signal: controller.signal,
            }),
            fetch(
              `${API_BASE_URL}/api/authors/me/income`,
              {
                headers,
                cache: 'no-store',
                signal: controller.signal,
              }
            ),
          ])

        const incomeData = await incomeResponse
          .json()
          .catch(() => ({}))

        if (!profileData.author_page) {
          throw new Error(
            profileData.message ||
              getDisplayText('authorProfile.failedProfile')
          )
        }

        if (!incomeResponse.ok || incomeData.ok === false) {
          throw new Error(
            incomeData.message ||
              getDisplayText('authorProfile.failedSummary')
          )
        }

        if (!ignore) {
          setAuthorPage(profileData.author_page)
          setSummary(incomeData)
        }
      } catch (loadError) {
        if (
          loadError?.name !== 'AbortError' &&
          !ignore
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? getDisplayText('authorProfile.cannotConnect')
              : loadError.message ||
                  getDisplayText('authorProfile.failedProfile')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate])

  const authorName = authorPage?.page_name || t('authorProfile.author')
  const avatarUrl = authorPage?.avatar_url || ''
  const avatarLetter = authorName.charAt(0).toUpperCase()
  const pageUsername = authorPage?.page_username || ''
  const publicPagePath = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '/author/page'
  const readerName = storedReaderUser?.name || storedReaderUser?.username || t('authorProfile.reader')
  const readerAvatarUrl = storedReaderUser?.avatar_url || storedReaderUser?.avatarUrl || ''
  const readerAvatarLetter = readerName.charAt(0).toUpperCase() || 'R'
  const authorNotificationCount = Number(
    authorPage?.notification_count || authorPage?.unread_count || 0
  )

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[100px]">
      <ProfileSwitcherSheet
        open={profileSwitcherOpen}
        onClose={() => setProfileSwitcherOpen(false)}
        displayName={readerName}
        avatarUrl={readerAvatarUrl}
        avatarLetter={readerAvatarLetter}
        authorPage={authorPage}
        authorNotificationCount={authorNotificationCount}
        onOwnAccount={() => {
          setProfileSwitcherOpen(false)
          navigate('/profile')
        }}
        onAuthorPage={() => setProfileSwitcherOpen(false)}
        onManageAccount={() => {
          setProfileSwitcherOpen(false)
          navigate('/settings')
        }}
      />

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="px-3 pb-4 pt-1">
          {loading ? <LoadingProfile /> : null}

          {!loading ? (
            <>
              <div className="flex justify-end gap-2">
                <HeaderIcon
                  label={t('authorProfile.notificationsLabel')}
                  icon="fa-regular fa-envelope"
                  onClick={() => navigate('/author/page/notifications')}
                />
                <HeaderIcon
                  label={t('authorProfile.settings')}
                  icon="fa-solid fa-gear"
                  onClick={() => navigate('/author/page-settings')}
                />
              </div>

              <div className="mt-3 flex w-full items-center gap-4 text-left">
                <button
                  type="button"
                  onClick={() => navigate(publicPagePath)}
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white active:scale-[0.99]"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={authorName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[26px] font-extrabold">{avatarLetter}</span>
                  )}
                </button>

                <div className="min-w-0 flex-1 pt-1.5">
                  <button
                    type="button"
                    onClick={() => navigate(publicPagePath)}
                    className="block max-w-full text-left active:scale-[0.99]"
                  >
                    <h1 className="line-clamp-1 text-[21px] font-extrabold tracking-tight text-[var(--shadow-text-primary)]">
                      {authorName}
                    </h1>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSwitcherOpen(true)}
                    className="mt-1 flex items-center gap-1.5 text-[12px] font-normal text-[var(--shadow-text-tertiary)] active:scale-[0.99]"
                  >
                    <span>{t('authorProfile.switchProfile')}</span>
                    <i className="fa-solid fa-chevron-down text-[9px]" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--shadow-border)] px-2 py-1">
                <button
  type="button"
  onClick={() => navigate('/author/diamonds')}
  className="min-w-0 active:scale-[0.98]"
  aria-label={t('authorProfile.openDiamondHistory')}
>
  <SummaryItem value={formatNumber(summary?.income?.today_diamonds)} label={t('authorProfile.diamond')} />
</button>

                <button
                  type="button"
                  onClick={() => navigate('/author/earnings')}
                  className="min-w-0 active:scale-[0.98]"
                  aria-label={t('authorProfile.openIncomeRecords')}
                >
                  <SummaryItem value={formatMoney(summary?.income?.this_month_usd)} label={t('authorProfile.earned')} />
                </button>

                <button
  type="button"
  onClick={() => navigate('/author/gifts')}
  className="min-w-0 active:scale-[0.98]"
  aria-label={t('authorProfile.openGiftHistory')}
>
  <SummaryItem value={formatNumber(summary?.gifts?.total_received)} label={t('authorProfile.gift')} />
</button>
              </div>
            </>
          ) : null}
        </section>

        {error ? (
          <div className="mb-3 rounded-[14px] bg-[#fff1f2] px-4 py-3 text-[12px] text-[#e5484d]">
            {error}
          </div>
        ) : null}

        <section className="mt-2 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)]">
          {MENU_ITEMS.map((item, index) => (
            <MenuRow
              key={item.path}
              item={item}
              divider={index < MENU_ITEMS.length - 1}
              onClick={() =>
                navigate(`${item.path}?from=profile`, {
                  state: { returnTo: '/author/profile' },
                })
              }
            />
          ))}
        </section>
      </main>

      <AuthorStudioBottomNav />
    </div>
  )
}
