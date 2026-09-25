import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreAvailableWithdrawal', {
  en: { available: 'Available for Withdrawal' },
  km: { available: 'ប្រាក់ដែលអាចដកបាន' },
  zh: { available: '可提现金额' },
  ja: { available: '出金可能額' },
  ko: { available: '출금 가능 금액' },
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

export default function AuthorStoreAvailableWithdrawalCard({ StatCard, formatMoney }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
    if (!token) return undefined
    const controller = new AbortController()

    async function loadBalance() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/author-store/me/income`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        if (!response.ok) return
        const data = await response.json()
        const amount = data?.summary?.available_balance
        if (data?.ok !== false && amount !== null && amount !== undefined && Number.isFinite(Number(amount)) && Number(amount) >= 0 && !controller.signal.aborted) {
          setBalance(Number(amount))
        }
      } catch {
        if (!controller.signal.aborted) setBalance(null)
      }
    }

    loadBalance()
    return () => controller.abort()
  }, [])

  return (
    <button type="button" onClick={() => navigate('/author/page/store/withdrawal-details')} className="block w-full min-w-0 text-left">
      <StatCard label={t('authorStoreAvailableWithdrawal.available')} value={balance === null ? '—' : formatMoney(balance)} icon="fa-wallet" />
    </button>
  )
}
