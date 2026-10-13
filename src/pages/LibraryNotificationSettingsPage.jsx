import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, BookOpen, MessagesSquare, Images } from 'lucide-react'
import { PageShell, PageHeader, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { getOfflineReaderAccountId } from '../utils/offlineReaderContent'

registerTranslationNamespace('libraryEpisodeNotificationSettings', {
  en: {
    title: 'Notification',
    back: 'Back to Manage Library',
    all: 'All Notifications',
    allDescription: 'Receive new-episode notifications for all subscribed stories.',
    categories: 'Story Types',
    novel: 'Novel',
    novelDescription: 'New episodes from subscribed novels.',
    chat: 'Chat Story',
    chatDescription: 'New episodes from subscribed chat stories.',
    manga: 'Manga',
    mangaDescription: 'New episodes from subscribed manga.',
    disabledDescription: 'Turn on All Notifications to manage each story type.',
  },
  km: {
    title: 'ការជូនដំណឹង',
    back: 'ត្រឡប់ទៅគ្រប់គ្រង Library',
    all: 'ការជូនដំណឹងទាំងអស់',
    allDescription: 'ទទួលការជូនដំណឹងពេលរឿងដែលបានតាមដានចេញភាគថ្មី។',
    categories: 'ប្រភេទរឿង',
    novel: 'Novel',
    novelDescription: 'ភាគថ្មីពីប្រលោមលោកដែលបានតាមដាន។',
    chat: 'Chat Story',
    chatDescription: 'ភាគថ្មីពី Chat Story ដែលបានតាមដាន។',
    manga: 'Manga',
    mangaDescription: 'ភាគថ្មីពី Manga ដែលបានតាមដាន។',
    disabledDescription: 'បើកការជូនដំណឹងទាំងអស់ ដើម្បីកំណត់តាមប្រភេទរឿង។',
  },
  zh: {
    title: '通知',
    back: '返回管理书库',
    all: '所有通知',
    allDescription: '接收所有已订阅作品的新章节通知。',
    categories: '作品类型',
    novel: '小说',
    novelDescription: '接收已订阅小说的新章节通知。',
    chat: 'Chat Story',
    chatDescription: '接收已订阅聊天故事的新章节通知。',
    manga: 'Manga',
    mangaDescription: '接收已订阅漫画的新章节通知。',
    disabledDescription: '开启所有通知后才能设置各类型。',
  },
  ja: {
    title: '通知',
    back: 'ライブラリ管理に戻る',
    all: 'すべての通知',
    allDescription: '購読中の作品の新着エピソードを通知します。',
    categories: '作品の種類',
    novel: '小説',
    novelDescription: '購読中の小説の新着エピソードを通知します。',
    chat: 'Chat Story',
    chatDescription: '購読中のチャットストーリーの更新通知。',
    manga: 'Manga',
    mangaDescription: '購読中のマンガの新着エピソードを通知します。',
    disabledDescription: '種類別の設定にはすべての通知を有効にしてください。',
  },
  ko: {
    title: '알림',
    back: '라이브러리 관리로 돌아가기',
    all: '모든 알림',
    allDescription: '구독 중인 작품의 새 에피소드 알림을 받습니다.',
    categories: '작품 유형',
    novel: '소설',
    novelDescription: '구독 중인 소설의 새 에피소드 알림.',
    chat: 'Chat Story',
    chatDescription: '구독 중인 채팅 스토리의 새 에피소드 알림.',
    manga: 'Manga',
    mangaDescription: '구독 중인 만화의 새 에피소드 알림.',
    disabledDescription: '유형별 설정을 사용하려면 모든 알림을 켜세요.',
  },
})

const STORAGE_PREFIX = 'shadow_reader_library_episode_notifications_v1'
const DEFAULT_PREFERENCES = {
  master: true,
  novel: true,
  chat_story: true,
  manga: true,
}

const STORY_TYPES = [
  {
    key: 'novel',
    label: 'novel',
    description: 'novelDescription',
    Icon: BookOpen,
    background: '#E7F0FF',
    color: '#2885E9',
  },
  {
    key: 'chat_story',
    label: 'chat',
    description: 'chatDescription',
    Icon: MessagesSquare,
    background: '#FFF1E5',
    color: '#E08A34',
  },
  {
    key: 'manga',
    label: 'manga',
    description: 'mangaDescription',
    Icon: Images,
    background: '#EDE8FF',
    color: '#8358DC',
  },
]

function storageKey(accountId) {
  return accountId
    ? `${STORAGE_PREFIX}:${encodeURIComponent(String(accountId))}`
    : ''
}

function readPreferences(accountId) {
  const key = storageKey(accountId)
  if (!key) return { ...DEFAULT_PREFERENCES }

  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null')
    if (!saved || typeof saved !== 'object') return { ...DEFAULT_PREFERENCES }

    return {
      master: typeof saved.master === 'boolean' ? saved.master : true,
      novel: typeof saved.novel === 'boolean' ? saved.novel : true,
      chat_story: typeof saved.chat_story === 'boolean' ? saved.chat_story : true,
      manga: typeof saved.manga === 'boolean' ? saved.manga : true,
    }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function NotificationSwitch({ checked, disabled = false, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
          checked
            ? 'bg-[#111827] shadow-[0_6px_16px_rgba(17,24,39,0.28)]'
            : 'bg-[#D1D6DE] shadow-inner'
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
            checked ? 'left-[26px]' : 'left-1'
          }`}
        />
      </span>
    </button>
  )
}

export default function LibraryNotificationSettingsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const accountId = getOfflineReaderAccountId()
  const source = new URLSearchParams(location.search).get('source') === 'me'
    ? '?source=me'
    : ''

  const [stored, setStored] = useState(() => ({
    accountId,
    preferences: readPreferences(accountId),
  }))

  const preferences = stored.accountId === accountId
    ? stored.preferences
    : readPreferences(accountId)

  const updatePreference = (preference) => {
    if (preference !== 'master' && !preferences.master) return

    const next = {
      ...preferences,
      [preference]: !preferences[preference],
    }

    const key = storageKey(accountId)
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
    }

    setStored({ accountId, preferences: next })
  }

  return (
    <PageShell className="pb-[88px]">
      <PageHeader
        title={t('libraryEpisodeNotificationSettings.title')}
        onBack={() => navigate(`/library/manage${source}`)}
        backLabel={t('libraryEpisodeNotificationSettings.back')}
      />

      <main className="mx-auto w-full max-w-[640px] px-4 py-5 sm:px-5">
        <SurfaceCard className="flex items-center gap-3 px-4 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F0EAFF] text-[#7040D8]">
            <Bell size={20} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
              {t('libraryEpisodeNotificationSettings.all')}
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
              {t('libraryEpisodeNotificationSettings.allDescription')}
            </p>
          </div>

          <NotificationSwitch
            checked={preferences.master}
            label={t('libraryEpisodeNotificationSettings.all')}
            onChange={() => updatePreference('master')}
          />
        </SurfaceCard>

        <h2 className="mb-3 mt-7 px-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          {t('libraryEpisodeNotificationSettings.categories')}
        </h2>

        <SurfaceCard className="divide-y divide-[var(--shadow-border)] overflow-hidden px-4">
          {STORY_TYPES.map(({ key, label, description, Icon, background, color }) => (
            <div key={key} className="flex items-center gap-3 py-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                style={{ backgroundColor: background, color }}
              >
                <Icon size={20} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                  {t(`libraryEpisodeNotificationSettings.${label}`)}
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
                  {t(`libraryEpisodeNotificationSettings.${description}`)}
                </p>
              </div>

              <NotificationSwitch
                checked={preferences[key]}
                disabled={!preferences.master}
                label={t(`libraryEpisodeNotificationSettings.${label}`)}
                onChange={() => updatePreference(key)}
              />
            </div>
          ))}
        </SurfaceCard>

        {!preferences.master ? (
          <p className="mt-3 px-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('libraryEpisodeNotificationSettings.disabledDescription')}
          </p>
        ) : null}
      </main>
    </PageShell>
  )
}
