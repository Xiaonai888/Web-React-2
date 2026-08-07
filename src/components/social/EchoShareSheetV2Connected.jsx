import SocialEchoShareSheetV2 from './SocialEchoShareSheetV2'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

async function submitEchoV2({
  sourceType,
  sourceId,
  echoText,
  destination,
  audience,
  selectedReaderIds,
}) {
  const token = getReaderToken()

  if (!token) {
    throw new Error('Please log in before echoing.')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/echo-v2`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_type: sourceType,
        source_id: sourceId,
        echo_text: echoText,
        destination,
        audience,
        selected_reader_ids: selectedReaderIds,
      }),
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || 'Failed to echo content'
    )
  }

  return data
}

export default function EchoShareSheetV2Connected(
  props
) {
  return (
    <SocialEchoShareSheetV2
      {...props}
      onSubmit={submitEchoV2}
    />
  )
}
