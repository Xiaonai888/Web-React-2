import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ReportModal({
  open,
  reportType,
  targetId,
  targetTitle = '',
  onClose,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!open || !reportType || !targetId) return

    const returnTo = `${location.pathname}${location.search}${location.hash}`

    onClose?.()

    navigate(
      `/report/${encodeURIComponent(reportType)}/${encodeURIComponent(targetId)}`,
      {
        state: {
          targetTitle,
          sourceUrl: window.location.href,
          returnTo,
        },
      }
    )
  }, [
    location.hash,
    location.pathname,
    location.search,
    navigate,
    onClose,
    open,
    reportType,
    targetId,
    targetTitle,
  ])

  return null
}
