import { API_BASE_URL, getAuthToken } from '../config/api'
import { uploadMediaWithFallback } from '../utils/uploadMediaWithFallback'
import { prepareDeliveryCompanyLogoImage } from '../utils/deliveryCompanyLogoImage'

export const CUSTOM_DELIVERY_LOGO_UPLOAD_CATEGORY = 'author_store_delivery_logo'

export async function uploadCustomDeliveryCompanyLogo(preparedFile, { signal, onProgress } = {}) {
  const token = getAuthToken()
  if (!token) throw new Error('Please sign in before uploading a logo.')
  if (!preparedFile || !['image/webp', 'image/jpeg'].includes(preparedFile.type) || preparedFile.size <= 0) {
    throw new Error('Prepare a company logo before uploading it.')
  }

  const result = await uploadMediaWithFallback({
    file: preparedFile,
    category: CUSTOM_DELIVERY_LOGO_UPLOAD_CATEGORY,
    token,
    apiBaseUrl: API_BASE_URL,
    signal,
    onProgress,
  })

  if (getAuthToken() !== token) {
    throw new Error('Account changed while uploading the company logo.')
  }

  const imageUrl = String(result?.image_url ?? result?.imageUrl ?? '').trim()
  try {
    const url = new URL(imageUrl)
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error()
  } catch {
    throw new Error('Logo upload finished without a valid secure image URL.')
  }
  return imageUrl
}

export { prepareDeliveryCompanyLogoImage }
