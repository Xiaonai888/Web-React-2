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

export default function useFastVideoCreate() {
  const [creatingVideo, setCreatingVideo] = useState(false)

  const createFastVideo = async (payload) => {
    const token = getAuthToken()

    if (!token) {
      throw new Error('Please log in before saving a video.')
    }

    try {
      setCreatingVideo(true)

      const response = await fetch(`${API_BASE_URL}/api/fast/videos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save video.')
      }

      return data
    } finally {
      setCreatingVideo(false)
    }
  }

  return {
    createFastVideo,
    creatingVideo,
  }
}
