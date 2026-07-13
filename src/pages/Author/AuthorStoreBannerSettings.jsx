import { useEffect, useRef, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function AuthorStoreBannerSettings({ onBack }) {
  const fileInputRef = useRef(null)
  const [authorPage, setAuthorPage] = useState(null)
  const [bannerUrl, setBannerUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadAuthorPage() {
      const token = getAuthToken()

      if (!token) {
        if (!ignore) {
          setMessage('Please login first.')
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false || !data.author_page) {
          throw new Error(data.message || 'Author page not found')
        }

        if (!ignore) {
          const page = data.author_page
          const currentBanner = page.profile_details?.store_banner_url || ''
          setAuthorPage(page)
          setBannerUrl(currentBanner)
          setPreviewUrl(currentBanner)
        }
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load Store Banner')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAuthorPage()

    return () => {
      ignore = true
    }
  }, [])

  function handleSelectFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Banner image must be 5MB or smaller.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setSelectedFile(file)
      setPreviewUrl(String(reader.result || ''))
      setMessage('')
    }

    reader.readAsDataURL(file)
  }

  async function uploadBanner(file, token) {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', 'author_store_banner')

    const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to upload banner')
    }

    return data.image_url || data.imageUrl || ''
  }

  async function saveBanner() {
    const token = getAuthToken()

    if (!token || !authorPage) {
      setMessage('Please login again.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const nextBannerUrl = selectedFile
        ? await uploadBanner(selectedFile, token)
        : previewUrl

      const nextProfileDetails = {
        ...(authorPage.profile_details || {}),
        store_banner_url: nextBannerUrl || '',
      }

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: authorPage.page_name || '',
          page_username: authorPage.page_username || '',
          bio: authorPage.bio || '',
          profile_details: nextProfileDetails,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save Store Banner')
      }

      const updatedPage = data.author_page || {
        ...authorPage,
        profile_details: nextProfileDetails,
      }

      setAuthorPage(updatedPage)
      setBannerUrl(nextBannerUrl || '')
      setPreviewUrl(nextBannerUrl || '')
      setSelectedFile(null)
      localStorage.setItem('shadow_author_page', JSON.stringify(updatedPage))
      window.dispatchEvent(new Event('shadow_author_store_banner_updated'))
      setMessage(nextBannerUrl ? 'Store Banner saved.' : 'Store Banner removed.')
    } catch (error) {
      setMessage(error.message || 'Failed to save Store Banner')
    } finally {
      setSaving(false)
    }
  }

  function removeBanner() {
    setSelectedFile(null)
    setPreviewUrl('')
    setMessage('Press Save to remove this banner.')
  }

  const changed =
    Boolean(selectedFile) ||
    String(previewUrl || '') !== String(bannerUrl || '')

  return (
    <section className="space-y-4">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold text-[#111827] ring-1 ring-black/5"
        >
          {message}
        </button>
      ) : null}

      <section className="overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h2 className="text-[16px] font-black text-[#111827]">Store Banner</h2>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
          Upload a 16:9 banner for the top of your Author Store.
        </p>

        <div className="mt-4 aspect-video overflow-hidden rounded-[18px] bg-[#f3f4f6] ring-1 ring-black/5">
          {loading ? (
            <div className="flex h-full items-center justify-center text-[12px] font-bold text-[#8b93a1]">
              Loading banner...
            </div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Store banner preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-[#9ca3af]">
              <i className="fa-regular fa-image text-[28px]" />
              <span className="mt-2 text-[12px] font-bold">No Store Banner</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelectFile}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || saving}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#111827] text-[13px] font-black text-white active:scale-[0.98] disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-[13px]" />
          {previewUrl ? 'Change Banner' : 'Upload Banner'}
        </button>

        {previewUrl ? (
          <button
            type="button"
            onClick={removeBanner}
            disabled={saving}
            className="mt-3 h-11 w-full rounded-[14px] bg-[#fff1f2] text-[13px] font-black text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-50"
          >
            Remove Banner
          </button>
        ) : null}
      </section>

      <button
        type="button"
        onClick={saveBanner}
        disabled={loading || saving || !changed}
        className="h-12 w-full rounded-[16px] bg-[#111827] text-[13px] font-black text-white active:scale-[0.98] disabled:bg-[#d1d5db]"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="h-11 w-full rounded-[14px] bg-white text-[13px] font-black text-[#111827] ring-1 ring-black/10 active:scale-[0.98]"
      >
        Back to Settings
      </button>
    </section>
  )
}
