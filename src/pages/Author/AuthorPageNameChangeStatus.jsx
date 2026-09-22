import { useEffect, useState } from 'react'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('authorNameChangeStatus', {
  en: {
    free: '{{remaining}} of your first 3 name changes remaining.',
    wait: 'You can change your Page name again on {{date}}.',
    ready: 'You can change your Page name now. After 3 changes, a 14-day wait applies.',
    unavailable: 'Name-change availability could not be checked. The limit still applies when saving.',
  },
  km: {
    free: 'នៅសល់សិទ្ធិប្តូរឈ្មោះដោយមិនចាំបាច់រង់ចាំ {{remaining}} ដង ក្នុងចំណោម ៣ ដងដំបូង។',
    wait: 'អ្នកអាចប្តូរឈ្មោះទំព័រម្តងទៀតនៅថ្ងៃទី {{date}}។',
    ready: 'អ្នកអាចប្តូរឈ្មោះទំព័របានឥឡូវនេះ។ ក្រោយប្តូរ ៣ ដង ត្រូវរង់ចាំ ១៤ ថ្ងៃរវាងការប្តូរម្តងៗ។',
    unavailable: 'មិនអាចពិនិត្យសិទ្ធិប្តូរឈ្មោះបានទេ។ ប្រព័ន្ធនៅតែអនុវត្តកំណត់ពេលពេលរក្សាទុក។',
  },
  zh: {
    free: '前 3 次无需等待的名称更改还剩 {{remaining}} 次。',
    wait: '您可以在 {{date}} 再次更改主页名称。',
    ready: '您现在可以更改主页名称。前 3 次后，每次更改须间隔 14 天。',
    unavailable: '无法查询名称更改时间。保存时仍会执行限制。',
  },
  ja: {
    free: '待機なしで変更できる最初の3回のうち、残り{{remaining}}回です。',
    wait: '{{date}} 以降、ページ名を再度変更できます。',
    ready: '現在ページ名を変更できます。3回変更した後は、変更の間に14日間必要です。',
    unavailable: '変更可能日時を確認できませんでした。保存時の制限は引き続き適用されます。',
  },
  ko: {
    free: '대기 없이 변경할 수 있는 최초 3회 중 {{remaining}}회가 남았습니다.',
    wait: '{{date}}에 페이지 이름을 다시 변경할 수 있습니다.',
    ready: '지금 페이지 이름을 변경할 수 있습니다. 3회 변경 후에는 변경 사이에 14일이 필요합니다.',
    unavailable: '이름 변경 가능 시점을 확인할 수 없습니다. 저장할 때 제한은 계속 적용됩니다.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const DATE_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

export default function AuthorPageNameChangeStatus({ pageUsername }) {
  const { t } = useDisplayTranslation()
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    if (!pageUsername) return () => controller.abort()
    setStatus(null)

    async function load() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/transparency`, { signal: controller.signal })
        if (!response.ok) throw new Error('Request failed')
        const data = await response.json()
        const count = data.name_change_count
        if (data.ok !== true || !Number.isInteger(count) || count < 0 || !Array.isArray(data.name_changes)) throw new Error('Invalid response')
        const nextAllowedAt = count >= 3 ? Date.parse(data.name_changes[0]?.changed_at) + 14 * 86400000 : null
        if (count >= 3 && !Number.isFinite(nextAllowedAt)) throw new Error('Invalid change date')
        if (!controller.signal.aborted) setStatus({ count, nextAllowedAt })
      } catch {
        if (!controller.signal.aborted) setStatus({ unavailable: true })
      }
    }

    load()
    return () => controller.abort()
  }, [pageUsername])

  if (!pageUsername || !status) return null

  const language = getDisplayLanguageId()
  const date = status.nextAllowedAt && status.nextAllowedAt > Date.now()
    ? new Intl.DateTimeFormat(DATE_LOCALES[language] || 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(status.nextAllowedAt))
    : null
  const message = status.unavailable
    ? t('authorNameChangeStatus.unavailable')
    : status.count < 3
      ? t('authorNameChangeStatus.free', { remaining: 3 - status.count })
      : date
        ? t('authorNameChangeStatus.wait', { date })
        : t('authorNameChangeStatus.ready')

  return <p className="mt-1.5 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{message}</p>
}
