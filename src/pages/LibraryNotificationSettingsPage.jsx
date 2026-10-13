import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, BookOpen, MessagesSquare, Images } from 'lucide-react'
import { PageShell, PageHeader, SurfaceCard } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { getOfflineReaderAccountId } from '../utils/offlineReaderContent'
import { isReaderOffline } from '../utils/readerOfflineControl'

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
    loading: 'Loading settings...',
    loadFailed: 'Could not load notification settings. Try again.',
    saveFailed: 'Could not save your changes. Please try again.',
    signIn: 'Log in to manage notifications.',
    offline: 'Internet connection required to change these settings.',
    retry: 'Try again',
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
    loading: 'កំពុងផ្ទុកការកំណត់...',
    loadFailed: 'មិនអាចផ្ទុកការកំណត់បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    saveFailed: 'មិនអាចរក្សាទុកការកែប្រែបានទេ។ សូមព្យាយាមម្ដងទៀត។',
    signIn: 'សូមចូលគណនីដើម្បីគ្រប់គ្រងការជូនដំណឹង។',
    offline: 'ត្រូវការអ៊ីនធឺណិតដើម្បីកែការកំណត់នេះ។',
    retry: 'ព្យាយាមម្ដងទៀត',
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
    loading: '正在加载设置...',
    loadFailed: '无法加载通知设置，请重试。',
    saveFailed: '无法保存更改，请重试。',
    signIn: '请登录以管理通知。',
    offline: '需要连接互联网才能更改设置。',
    retry: '重试',
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
    loading: '設定を読み込み中...',
    loadFailed: '通知設定を読み込めませんでした。再試行してください。',
    saveFailed: '変更を保存できませんでした。再試行してください。',
    signIn: '通知を管理するにはログインしてください。',
    offline: '設定の変更にはインターネット接続が必要です。',
    retry: '再試行',
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
    loading: '설정을 불러오는 중...',
    loadFailed: '알림 설정을 불러올 수 없습니다. 다시 시도하세요.',
    saveFailed: '변경 사항을 저장할 수 없습니다. 다시 시도하세요.',
    signIn: '알림을 관리하려면 로그인하세요.',
    offline: '설정을 변경하려면 인터넷 연결이 필요합니다.',
    retry: '다시 시도',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SETTINGS_URL = `${API_BASE_URL}/api/reader/library/notification-settings`

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

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

function normalizePreferences(value) {
  return {
    master: value?.master !== false,
    novel: value?.novel !== false,
    chat_story: value?.chat_story !== false,
    manga: value?.manga !== false,
  }
}

function validatePreferences(value) {
  return Boolean(value && typeof value === 'object' &&
    Object.keys(DEFAULT_PREFERENCES).every((key) => typeof value[key] === 'boolean'))
}

function writePreferences(accountId, preferences) {
  const key = storageKey(accountId)
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(preferences))
  } catch {}
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
            ? 'bg-[#111827] 
            : 'bg-[#D1D6DE] 
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white  transition-all duration-300 ${
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

  const [reloadVersion, setReloadVersion] = useState(0)
  const [stored, setStored] = useState(() => ({
    accountId,
    preferences: readPreferences(accountId),
    loading: true,
    saving: false,
    loadError: '',
    saveError: '',
  }))
  const savingRef = useRef(false)
  const saveAbortRef = useRef(null)
  const activeAccountRef = useRef(accountId)
  activeAccountRef.current = accountId

  const currentAccount = stored.accountId === accountId
  const preferences = currentAccount
    ? stored.preferences
    : readPreferences(accountId)
  const loading = !currentAccount || stored.loading
  const saving = currentAccount && stored.saving
  const loadError = currentAccount ? stored.loadError : ''
  const saveError = currentAccount ? stored.saveError : ''
  const controlsDisabled = loading || saving || Boolean(loadError) || !accountId

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    saveAbortRef.current?.abort()
    saveAbortRef.current = null
    savingRef.current = false

    setStored({
      accountId,
      preferences: readPreferences(accountId),
      loading: true,
      saving: false,
      loadError: '',
      saveError: '',
    })

    async function loadPreferences() {
      const token = getReaderToken()
      const initialError = !accountId || !token
        ? 'signIn'
        : isReaderOffline()
          ? 'offline'
          : ''

      if (initialError) {
        if (active) {
          setStored((state) => ({
            ...state,
            loading: false,
            loadError: initialError,
          }))
        }
        return
      }

      try {
        const response = await fetch(SETTINGS_URL, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !validatePreferences(data.preferences)) {
          throw new Error('loadFailed')
        }
        if (!active || activeAccountRef.current !== accountId) return

        const loaded = normalizePreferences(data.preferences)
        writePreferences(accountId, loaded)
        setStored({
          accountId,
          preferences: loaded,
          loading: false,
          saving: false,
          loadError: '',
          saveError: '',
        })
      } catch {
        if (!active || controller.signal.aborted || activeAccountRef.current !== accountId) return
        setStored((state) => ({
          ...state,
          loading: false,
          loadError: 'loadFailed',
        }))
      }
    }

    void loadPreferences()
    return () => {
      active = false
      controller.abort()
      saveAbortRef.current?.abort()
      saveAbortRef.current = null
    }
  }, [accountId, reloadVersion])

  const updatePreference = async (preference) => {
    if (!Object.hasOwn(DEFAULT_PREFERENCES, preference)) return
    if (controlsDisabled || savingRef.current) return
    if (preference !== 'master' && !preferences.master) return

    const token = getReaderToken()
    if (!token || isReaderOffline()) {
      setStored((state) => ({
        ...state,
        saveError: token ? 'offline' : 'signIn',
      }))
      return
    }

    const previous = { ...preferences }
    const next = {
      ...previous,
      [preference]: !previous[preference],
    }
    const controller = new AbortController()
    saveAbortRef.current = controller
    savingRef.current = true
    setStored((state) => ({
      ...state,
      preferences: next,
      saving: true,
      saveError: '',
    }))

    try {
      const response = await fetch(SETTINGS_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(next),
        cache: 'no-store',
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !validatePreferences(data.preferences)) {
        throw new Error('saveFailed')
      }
      if (controller.signal.aborted || activeAccountRef.current !== accountId) return

      const saved = normalizePreferences(data.preferences)
      writePreferences(accountId, saved)
      setStored((state) => ({
        ...state,
        preferences: saved,
        saving: false,
        saveError: '',
      }))
    } catch {
      if (controller.signal.aborted || activeAccountRef.current !== accountId) return
      setStored((state) => ({
        ...state,
        preferences: previous,
        saving: false,
        saveError: 'saveFailed',
      }))
    } finally {
      if (saveAbortRef.current === controller) {
        saveAbortRef.current = null
        savingRef.current = false
      }
    }
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
            disabled={controlsDisabled}
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
                disabled={controlsDisabled || !preferences.master}
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

        {loading ? (
          <p className="mt-4 px-1 text-[12px] text-[var(--shadow-text-secondary)]">
            {t('libraryEpisodeNotificationSettings.loading')}
          </p>
        ) : null}

        {loadError || saveError ? (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/20"
          >
            <p className="min-w-0 text-[12px] leading-5 text-red-600 dark:text-red-300">
              {t(`libraryEpisodeNotificationSettings.${loadError || saveError}`)}
            </p>
            {loadError ? (
              <button
                type="button"
                onClick={() => setReloadVersion((value) => value + 1)}
                className="shrink-0 rounded-full border border-red-300 px-3 py-1.5 text-[11px] font-semibold text-red-700 dark:border-red-700 dark:text-red-300"
              >
                {t('libraryEpisodeNotificationSettings.retry')}
              </button>
            ) : null}
          </div>
        ) : null}
      </main>
    </PageShell>
  )
}
