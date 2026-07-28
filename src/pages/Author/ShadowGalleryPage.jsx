import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

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
          throw new Error(data.message || 'Failed to load Shadow Gallery')
        }

        setFolders(Array.isArray(data.folders) ? data.folders : [])
        setImages(Array.isArray(data.images) ? data.images : [])
      } catch (loadError) {
        setError(
          loadError.message === 'Failed to fetch'
            ? 'Cannot connect to backend.'
            : loadError.message || 'Failed to load Shadow Gallery'
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

    const returnTo = searchParams.get('return')

    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-transparent text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1
  className={`flex-1 pr-10 text-center text-[17px] text-[#111827] ${
    activeFolder ? 'font-bold' : 'font-extrabold'
  }`}
>
  {activeFolder?.name || 'Shadow Gallery'}
</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-square animate-pulse rounded-[18px] bg-[#f1f2f4]" />
                <div className="mx-auto mt-3 h-3 w-24 animate-pulse rounded-full bg-[#f1f2f4]" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f3ff] text-[#7c3aed]">
              <i className="fa-regular fa-images text-[24px]" />
            </span>

            <p className="mt-4 max-w-[280px] text-[13px] leading-6 text-[#667085]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 h-11 rounded-full bg-[#7c3aed] px-7 text-[13px] font-medium text-white"
            >
              Try again
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
                      <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[18px] bg-[#f4efff]">
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

                      <span className="mt-3 block truncate text-[14px] font-bold text-[#111827]">
                        {folder.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <i className="fa-regular fa-folder-open text-[35px] text-[#c5cad3]" />
                <p className="mt-4 text-[13px] text-[#667085]">
                  No gallery folders are available.
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
                    className="aspect-square overflow-hidden rounded-[12px] bg-[#f2f3f5] active:scale-[0.97]"
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || image.title || 'Gallery image'}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <i className="fa-regular fa-images text-[35px] text-[#c5cad3]" />
                <p className="mt-4 text-[13px] text-[#667085]">
                  No images are available in this folder.
                </p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
