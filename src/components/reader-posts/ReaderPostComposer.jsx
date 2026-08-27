import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPostComposer', {
  en: {
    reader: 'Reader',
    shareThoughts: 'Share your thoughts...',
    addImage: 'Add an image',
    imageComingSoon: 'Image posting is coming soon. Text posts are available now.',
  },
  km: {
    reader: 'អ្នកអាន',
    shareThoughts: 'ចែករំលែកគំនិតរបស់អ្នក...',
    addImage: 'បន្ថែមរូបភាព',
    imageComingSoon: 'ការបង្ហោះរូបភាពនឹងមកដល់ឆាប់ៗនេះ។ ឥឡូវនេះអាចបង្ហោះអត្ថបទបាន។',
  },
  zh: {
    reader: '读者',
    shareThoughts: '分享你的想法...',
    addImage: '添加图片',
    imageComingSoon: '图片发布功能即将推出。目前可以发布文字内容。',
  },
  ja: {
    reader: '読者',
    shareThoughts: 'あなたの考えを共有...',
    addImage: '画像を追加',
    imageComingSoon: '画像投稿は近日公開予定です。現在はテキスト投稿を利用できます。',
  },
  ko: {
    reader: '독자',
    shareThoughts: '생각을 공유해 보세요...',
    addImage: '이미지 추가',
    imageComingSoon: '이미지 게시 기능은 곧 제공됩니다. 현재는 텍스트 게시물을 작성할 수 있습니다.',
  },
})

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function ReaderAvatar({ user, fallbackName }) {
  const name = user?.name || fallbackName
  const avatarUrl =
    user?.avatar_url || ''

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-semibold text-white">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function ReaderPostComposer() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const [
    comingSoonVisible,
    setComingSoonVisible,
  ] = useState(false)

  useEffect(() => {
    if (!comingSoonVisible) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        setComingSoonVisible(false)
      },
      2400
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [comingSoonVisible])

  function openComposer() {
    if (!getAuthToken()) {
      navigate('/login')
      return
    }

    navigate('/reader/post/create')
  }

  return (
    <section className="relative bg-white px-3 py-3 sm:rounded-[12px]">
      <div className="flex items-center gap-3">
        <ReaderAvatar
          user={user}
          fallbackName={t('readerPostComposer.reader')}
        />

        <button
          type="button"
          onClick={openComposer}
          className="h-10 min-w-0 flex-1 rounded-full border border-[#d7dbe2] bg-white px-4 text-left text-[14px] font-normal text-[#4b5563] active:bg-gray-50"
        >
          {t('readerPostComposer.shareThoughts')}
        </button>

        <button
          type="button"
          onClick={() =>
            setComingSoonVisible(true)
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4b5563] active:bg-gray-100"
          aria-label={t('readerPostComposer.addImage')}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect
              x="3.5"
              y="4"
              width="17"
              height="16"
              rx="2.5"
            />
            <circle
              cx="9"
              cy="9"
              r="1.5"
            />
            <path d="m5.5 17 4.2-4.2 3.1 3.1 2.1-2.1 3.6 3.2" />
          </svg>
        </button>
      </div>

      {comingSoonVisible ? (
        <div
          role="status"
          className="absolute right-3 top-[58px] z-30 max-w-[250px] rounded-[12px] bg-[#111827] px-3 py-2 text-[11px] font-normal leading-4 text-white shadow-lg"
        >
          {t('readerPostComposer.imageComingSoon')}
        </div>
      ) : null}
    </section>
  )
}
