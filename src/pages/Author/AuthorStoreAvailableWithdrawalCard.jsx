import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { fetchAuthorStoreResource, readAuthorStoreResourceCache } from '../../utils/authorStoreResourceCache'

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

function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

function getStoreAccountId() {
  const reader = readStoredJson('shadow_reader_user') || {}
  const author = readStoredJson('shadow_author_page') || {}
  const userId = String(reader.user_id || reader.id || author.user_id || '').trim()
  const pageId = String(author.author_page_id || author.id || '').trim()
  return userId ? `${userId}:${pageId}` : pageId ? `author-page:${pageId}` : ''
}

function validBalance(value) {
  if (value === null || value === undefined || value === '') return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

export default function AuthorStoreAvailableWithdrawalCard({ StatCard, formatMoney }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const accountId = getStoreAccountId()
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  const cached = accountId && token
    ? readAuthorStoreResourceCache({ accountId, resource: 'withdrawal' })
    : null
  const [snapshot, setSnapshot] = useState(() => ({
    accountId,
    token,
    balance: cached?.exists ? validBalance(cached.data) : null,
  }))
  const balance = token && snapshot.accountId === accountId && snapshot.token === token
    ? snapshot.balance
    : cached?.exists ? validBalance(cached.data) : null

  useEffect(() => {
    if (!token) return undefined
    let disposed = false

    const fetcher = async () => {
      const response = await fetch(`${API_BASE_URL}/api/author-store/me/income?summary_only=1`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load balance')
      const amount = validBalance(data?.summary?.available_balance)
      if (amount === null) throw new Error('Invalid withdrawal balance')
      return amount
    }

    async function loadBalance() {
      try {
        const result = accountId
          ? await fetchAuthorStoreResource({ accountId, resource: 'withdrawal', fetcher })
          : { data: await fetcher() }
        if (!disposed && !result.obsolete) {
          setSnapshot({ accountId, token, balance: validBalance(result.data) })
        }
      } catch {
      }
    }

    void loadBalance()
    return () => { disposed = true }
  }, [accountId, token])

  return (
    <button type="button" onClick={() => navigate('/author/page/store/withdrawal-details')} className="block w-full min-w-0 text-left">
      <StatCard label={`${t('authorStoreAvailableWithdrawal.available')} >`} value={balance === null ? '—' : formatMoney(balance)} icon="fa-wallet" />
    </button>
  )
}
