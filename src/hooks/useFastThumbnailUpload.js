import { useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function useFastThumbnailUpload() {
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const uploadThumbnail = async (file) => {
    if (!file) return ''

    const token = getAuthToken()

    if (!token) {
      throw new Error('Please log in before uploading a thumbnail.')
    }

    const formData = new FormData()
    formData.append('thumbnail', file)

    try {
      setUploadingThumbnail(true)

      const response = await fetch(`${API_BASE_URL}/api/fast/upload-thumbnail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to upload thumbnail.')
      }

      const thumbnailUrl = data.thumbnailUrl || data.thumbnail_url || ''

      if (!thumbnailUrl) {
        throw new Error('Thumbnail uploaded but no URL was returned.')
      }

      return thumbnailUrl
    } finally {
      setUploadingThumbnail(false)
    }
  }

  return {
    uploadThumbnail,
    uploadingThumbnail,
  }
}
