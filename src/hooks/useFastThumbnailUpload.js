import { useCallback, useEffect, useRef, useState } from 'react'
import { optimizeImageForUpload } from '../utils/imageUploadOptimizer'

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
  const activeUploadRef = useRef(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      activeUploadRef.current?.abort()
    }
  }, [])

  const uploadThumbnail = useCallback(async (file) => {
    if (!file) return ''
    if (activeUploadRef.current) throw new Error('A thumbnail is already uploading.')

    const token = getAuthToken()
    if (!token) throw new Error('Please log in before uploading a thumbnail.')

    const controller = new AbortController()
    activeUploadRef.current = controller
    if (mountedRef.current) setUploadingThumbnail(true)
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 120000)

    try {
      const optimized = await optimizeImageForUpload(file, {
        preset: 'thumbnail',
        signal: controller.signal,
      })
      if (!optimized?.file?.size || optimized.file.size > 5 * 1024 * 1024) {
        throw new Error('Thumbnail exceeds the 5 MB upload limit after compression.')
      }
      if (getAuthToken() !== token) throw new Error('Your account changed. Please try again.')

      const formData = new FormData()
      formData.append('thumbnail', optimized.file)
      const response = await fetch(`${API_BASE_URL}/api/fast/upload-thumbnail`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to upload thumbnail.')
      }
      const thumbnailUrl = String(data.thumbnailUrl || data.thumbnail_url || '').trim()
      try {
        const parsed = new URL(thumbnailUrl)
        if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error()
      } catch {
        throw new Error('Thumbnail uploaded but no valid image URL was returned.')
      }
      if (getAuthToken() !== token) throw new Error('Your account changed. Please try again.')
      return thumbnailUrl
    } catch (error) {
      if (timedOut) throw new Error('Thumbnail upload timed out. Please try again.')
      throw error
    } finally {
      clearTimeout(timeout)
      if (activeUploadRef.current === controller) activeUploadRef.current = null
      if (mountedRef.current) setUploadingThumbnail(false)
    }
  }, [])

  return { uploadThumbnail, uploadingThumbnail }
}
