import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowGallery', {
  "en": {
    "failedLoadGallery": "Failed to load Shadow Gallery",
    "cannotConnectBackend": "Cannot connect to backend.",
    "back": "Back",
    "shadowGallery": "Shadow Gallery",
    "tryAgain": "Try again",
    "noFolders": "No gallery folders are available.",
    "galleryImage": "Gallery image",
    "noImages": "No images are available in this folder."
  },
  "km": {
    "failedLoadGallery": "មិនអាចផ្ទុក Shadow Gallery បានទេ",
    "cannotConnectBackend": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។",
    "back": "ត្រឡប់ក្រោយ",
    "shadowGallery": "Shadow Gallery",
    "tryAgain": "ព្យាយាមម្តងទៀត",
    "noFolders": "មិនមាន Folder Gallery ទេ។",
    "galleryImage": "រូបភាព Gallery",
    "noImages": "មិនមានរូបភាពក្នុង Folder នេះទេ។"
  },
  "zh": {
    "failedLoadGallery": "无法加载 Shadow Gallery",
    "cannotConnectBackend": "无法连接后端。",
    "back": "返回",
    "shadowGallery": "Shadow Gallery",
    "tryAgain": "重试",
    "noFolders": "暂无图库文件夹。",
    "galleryImage": "图库图片",
    "noImages": "此文件夹中暂无图片。"
  },
  "ja": {
    "failedLoadGallery": "Shadow Gallery を読み込めませんでした",
    "cannotConnectBackend": "バックエンドに接続できません。",
    "back": "戻る",
    "shadowGallery": "Shadow Gallery",
    "tryAgain": "再試行",
    "noFolders": "ギャラリーフォルダーがありません。",
    "galleryImage": "ギャラリー画像",
    "noImages": "このフォルダーには画像がありません。"
  },
  "ko": {
    "failedLoadGallery": "Shadow Gallery를 불러오지 못했습니다",
    "cannotConnectBackend": "백엔드에 연결할 수 없습니다.",
    "back": "뒤로 가기",
    "shadowGallery": "Shadow Gallery",
    "tryAgain": "다시 시도",
    "noFolders": "갤러리 폴더가 없습니다.",
    "galleryImage": "갤러리 이미지",
    "noImages": "이 폴더에 이미지가 없습니다."
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function ShadowGalleryPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const [folders, setFolders] = useState([])
  const [images, setImages] = useState([])
  const [activeFolderId, setActiveFolderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const activeFolder = useMemo(
    () => folders.find((folder) => folder.id === activeFolderId) || null,
    [activeFolderId, folders]
  )

  const visibleImages = useMemo(() => {
    if (!activeFolderId) return []

    return images.filter(
      (image) => image.folder_id === activeFolderId
    )
  }, [activeFolderId, images])

  useEffect(() => {
    async function loadGallery() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/stories/chat/avatar-gallery?limit=200`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('shadowGallery.failedLoadGallery'))
        }

        setFolders(Array.isArray(data.folders) ? data.folders : [])
        setImages(Array.isArray(data.images) ? data.images : [])
      } catch (loadError) {
        setError(
          loadError.message === 'Failed to fetch'
            ? getDisplayText('shadowGallery.cannotConnectBackend')
            : loadError.message || getDisplayText('shadowGallery.failedLoadGallery')
        )
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [navigate])

  const handleBack = () => {
  if (activeFolderId) {
    setActiveFolderId('')
    return
  }

  const returnTo = searchParams.get('return')

  if (returnTo) {
    navigate(returnTo, { replace: true })
    return
  }

  navigate(-1)
}

  const selectImage = (image) => {
  sessionStorage.setItem(
    'shadow_gallery_selected_image',
    JSON.stringify({
      origin: searchParams.get('origin') || '',
      imageUrl: image.image_url || '',
      folderId: image.folder_id || '',
      title: image.title || '',
      storyId,
      selectedAt: Date.now(),
    })
  )

  const returnTo = searchParams.get('return')

    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('shadowGallery.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1
  className={`flex-1 pr-10 text-center text-[17px] text-[var(--shadow-text-primary)] ${
    activeFolder ? 'font-bold' : 'font-extrabold'
  }`}
>
  {activeFolder?.name || getDisplayText('shadowGallery.shadowGallery')}
</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-square animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
                <div className="mx-auto mt-3 h-3 w-24 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <i className="fa-regular fa-images text-[24px]" />
            </span>

            <p className="mt-4 max-w-[280px] text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 h-11 rounded-full bg-[#7c3aed] px-7 text-[13px] font-medium text-white"
            >
              {getDisplayText('shadowGallery.tryAgain')}
            </button>
          </div>
        ) : null}

        {!loading && !error && !activeFolder ? (
          <>
            {folders.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7">
                {folders.map((folder) => {
                  const firstImage = images.find(
                    (image) => image.folder_id === folder.id
                  )

                  const coverImage =
                    folder.cover_image_url ||
                    firstImage?.image_url ||
                    ''

                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setActiveFolderId(folder.id)}
                      className="min-w-0 text-center active:scale-[0.98]"
                    >
                      <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)]">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={folder.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[44px]">
                            {folder.icon || '📁'}
                          </span>
                        )}
                      </span>

                      <span className="mt-3 block truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
                        {folder.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <i className="fa-regular fa-folder-open text-[35px] text-[var(--shadow-text-disabled)]" />
                <p className="mt-4 text-[13px] text-[var(--shadow-text-secondary)]">
                  {getDisplayText('shadowGallery.noFolders')}
                </p>
              </div>
            )}
          </>
        ) : null}

        {!loading && !error && activeFolder ? (
          <>
            {visibleImages.length ? (
              <div className="grid grid-cols-3 gap-2.5">
                {visibleImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => selectImage(image)}
                    className="aspect-square overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)] active:scale-[0.97]"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || image.title || getDisplayText('shadowGallery.galleryImage')}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <i className="fa-regular fa-images text-[35px] text-[var(--shadow-text-disabled)]" />
                <p className="mt-4 text-[13px] text-[var(--shadow-text-secondary)]">
                  {getDisplayText('shadowGallery.noImages')}
                </p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
