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
  const [title, setTitle] = useState('Author Store')
  const [subtitle, setSubtitle] = useState('Books, PDFs & Special Releases')
  const [buttonText, setButtonText] = useState('Shop Now →')

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
const details = page.profile_details || {}
const currentBanner = details.store_banner_url || ''

setAuthorPage(page)
setBannerUrl(currentBanner)
setPreviewUrl(currentBanner)
setTitle(details.store_banner_title || 'Author Store')
setSubtitle(details.store_banner_subtitle || 'Books, PDFs & Special Releases')
setButtonText(details.store_banner_button_text || 'Shop Now →')
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
  store_banner_title: title.trim(),
  store_banner_subtitle: subtitle.trim(),
  store_banner_button_text: buttonText.trim(),
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

  const savedDetails = authorPage?.profile_details || {}

const changed =
  Boolean(selectedFile) ||
  String(previewUrl || '') !== String(bannerUrl || '') ||
  title !== (savedDetails.store_banner_title || 'Author Store') ||
  subtitle !== (savedDetails.store_banner_subtitle || 'Books, PDFs & Special Releases') ||
  buttonText !== (savedDetails.store_banner_button_text || 'Shop Now →')

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

        <div className="relative mt-4 aspect-video overflow-hidden rounded-[18px] bg-[#f3f4f6] ring-1 ring-black/5">
  {loading ? (
    <div className="flex h-full items-center justify-center text-[12px] font-bold text-[#8b93a1]">
      Loading banner...
    </div>
  ) : previewUrl ? (
    <>
      <img src={previewUrl} alt="Store banner preview" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/55 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex w-[58%] flex-col justify-center px-4">
        <h3 className="text-[18px] font-black leading-tight text-[#6d28d9]">
          {title || 'Author Store'}
        </h3>
        <p className="mt-1 whitespace-pre-line text-[11px] font-semibold leading-4 text-[#111827]">
          {subtitle || 'Books, PDFs & Special Releases'}
        </p>
        <span className="mt-3 w-fit rounded-[9px] bg-black px-4 py-2 text-[10px] font-bold text-white">
          {buttonText || 'Shop Now →'}
        </span>
      </div>
    </>
  ) : (
    <div className="flex h-full flex-col items-center justify-center text-[#9ca3af]">
      <i className="fa-regular fa-image text-[28px]" />
      <span className="mt-2 text-[12px] font-bold">No Store Banner</span>
    </div>
  )}
</div>

<div className="mt-4 space-y-3">
  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]">
      Banner title
    </label>
    <input
      type="text"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      maxLength={40}
      placeholder="Author Store"
      className="h-11 w-full rounded-[14px] border border-[#d9e1ec] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]">
      Description
    </label>
    <textarea
      value={subtitle}
      onChange={(event) => setSubtitle(event.target.value)}
      maxLength={100}
      rows={3}
      placeholder="Books, PDFs & Special Releases"
      className="w-full resize-none rounded-[14px] border border-[#d9e1ec] bg-white px-3 py-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]">
      Button text
    </label>
    <input
      type="text"
      value={buttonText}
      onChange={(event) => setButtonText(event.target.value)}
      maxLength={24}
      placeholder="Shop Now →"
      className="h-11 w-full rounded-[14px] border border-[#d9e1ec] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>
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
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#111827] text-[13px] font-normal text-white active:scale-[0.98] disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-[13px]" />
          {previewUrl ? 'Change Banner' : 'Upload Banner'}
        </button>

        {previewUrl ? (
          <button
            type="button"
            onClick={removeBanner}
            disabled={saving}
            className="mt-3 h-11 w-full rounded-[14px] bg-[#fff1f2] text-[13px] font-normal text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-50"
          >
            Remove Banner
          </button>
        ) : null}
      </section>

      <button
        type="button"
        onClick={saveBanner}
        disabled={loading || saving || !changed}
        className="h-12 w-full rounded-[16px] bg-[#111827] text-[13px] font-normal text-white active:scale-[0.98] disabled:bg-[#d1d5db]"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>

      
    </section>
  )
}
