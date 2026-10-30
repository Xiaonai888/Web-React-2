import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Pencil, Play, Pause, RotateCcw, Send, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  availableAuthorCampaignActions, authorCampaignMoney,
  isAuthorCampaignExpired, isAuthorCampaignId,
} from '../../utils/authorAdsCampaignPresentation'
import {
  deleteAuthorAdDraft, getAuthorAdCampaign, submitAuthorAdForReview,
  transitionAuthorAdCampaign,
} from '../../services/authorAdsApi'

const ACTIONS = {
  submit: { icon: Send, text: 'submit' },
  start: { icon: Play, text: 'start' },
  pause: { icon: Pause, text: 'pause' },
  resume: { icon: RotateCcw, text: 'resume' },
  delete: { icon: Trash2, text: 'delete' },
  edit: { icon: Pencil, text: 'edit' },
}

const RATE_CODES = new Set([
  'AUTHOR_ADS_RATE_LIMITED', 'AUTHOR_ADS_IP_RATE_LIMITED',
  'AUTHOR_ADS_READ_RATE_LIMITED', 'AUTHOR_ADS_LIFECYCLE_ACCOUNT_RATE_LIMITED',
  'AUTHOR_ADS_LIFECYCLE_IP_RATE_LIMITED',
])

const DELIVERY_CODES = new Set([
  'AUTHOR_ADS_DELIVERY_NOT_READY', 'AUTHOR_ADS_BOOK_DELIVERY_NOT_READY',
  'AUTHOR_AD_LIFECYCLE_SQL_REQUIRED', 'AUTHOR_AD_DIAMOND_START_SQL_REQUIRED',
])

const FUNDING_CODES = new Set([
  'AUTHOR_AD_FUNDING_UNVERIFIED', 'INVALID_AUTHOR_AD_FUNDING',
  'INVALID_AUTHOR_AD_DIAMOND_FUNDING',
])

const BLOCKED_CODES = new Set([
  'DRAFT_LOCKED', 'AUTHOR_AD_TRANSITION_DENIED', 'AUTHOR_AD_DIAMOND_START_DENIED',
  'CONTENT_NOT_AVAILABLE', 'AUTHOR_AD_LIFECYCLE_SQL_REQUIRED',
  'INVALID_AUTHOR_AD_DIAMOND_START',
])

const FRESHNESS_FIELDS = [
  'id', 'status', 'reviewStatus', 'fundingType', 'paymentRequired',
  'budgetDiamonds', 'budgetUsd', 'fundedDiamonds', 'fundedUsd',
  'spentDiamonds', 'spentUsd', 'refundedDiamonds', 'refundedUsd',
  'remainingDiamonds', 'startAt', 'endAt', 'contentId', 'updatedAt',
]

function campaignChanged(previous, current) {
  if (!previous || !current) return true
  return FRESHNESS_FIELDS.some(field => previous[field] !== current[field])
}

function errorKey(error) {
  if (error?.code === 'AUTH_REQUIRED' || error?.status === 401) return 'authRequired'
  if (RATE_CODES.has(error?.code) || error?.status === 429) return 'rateLimited'
  if (DELIVERY_CODES.has(error?.code)) return 'deliveryUnavailable'
  if (FUNDING_CODES.has(error?.code)) return 'fundingUnknown'
  if (error?.code === 'AUTHOR_AD_CAMPAIGN_NOT_FOUND' || error?.code === 'CAMPAIGN_NOT_FOUND' || error?.status === 404) return 'missing'
  if (BLOCKED_CODES.has(error?.code)) return 'blocked'
  return 'actionFailed'
}

export default function AuthorAdsCampaignActionPanel({ campaign, onUpdated, onDeleted, disabled = false }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const tr = (key, values) => t(`authorAdsCampaignDetail.${key}`, values)
  const inFlight = useRef(false)
  const [working, setWorking] = useState('')
  const [notice, setNotice] = useState(null)
  const actions = availableAuthorCampaignActions(campaign)
  const isBusy = inFlight.current || Boolean(working) || disabled

  const confirmMessage = (action, current) => {
    if (action === 'start' && current.fundingType === 'unfunded') {
      const amount = authorCampaignMoney(current).budget
      return tr('confirmDiamondStart', { count: Math.round(amount).toLocaleString('en-US') })
    }
    return tr({
      submit: 'confirmSubmit', start: 'confirmStart', pause: 'confirmPause',
      resume: 'confirmResume', delete: 'confirmDelete',
    }[action])
  }

  const execute = async action => {
    if (inFlight.current || disabled || !isAuthorCampaignId(campaign?.id) || !actions.includes(action)) return
    if (action === 'edit') {
      navigate(`/author/page/ads/boost-editor?tab=campaigns&edit=${encodeURIComponent(campaign.id)}`)
      return
    }

    inFlight.current = true
    setWorking(action)
    setNotice(null)
    try {
      const current = await getAuthorAdCampaign(campaign.id)
      const allowed = availableAuthorCampaignActions(current).includes(action)
      if (campaignChanged(campaign, current) || !allowed) {
        onUpdated?.(current)
        setNotice({ type: 'error', key: 'blocked' })
        return
      }

      if (!window.confirm(confirmMessage(action, current))) return

      if (action === 'delete') {
        await deleteAuthorAdDraft(current.id)
        onDeleted?.(current.id)
        return
      }

      if (action === 'submit') {
        const updated = await submitAuthorAdForReview(current.id)
        onUpdated?.(updated)
        setNotice({ type: 'success', key: 'submitted' })
        return
      }

      const result = await transitionAuthorAdCampaign(current.id, action)
      onUpdated?.(result.campaign)
      setNotice(result.changed
        ? { type: 'success', key: { start: 'started', pause: 'pausedNotice', resume: 'resumed' }[action] }
        : { type: 'error', key: 'unchanged' })
    } catch (error) {
      setNotice({ type: 'error', key: errorKey(error) })
    } finally {
      inFlight.current = false
      setWorking('')
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-[#e9e3f3] bg-white p-4 dark:border-white/10 dark:bg-[#251f31]">
      <h2 className="text-sm font-bold">{tr('manage')}</h2>
      {campaign?.status === 'draft' && (
        <p className="text-xs leading-5 text-[#888196] dark:text-[#c5bbd2]">{tr('draftHint')}</p>
      )}
      {campaign?.status === 'paused' && isAuthorCampaignExpired(campaign) && (
        <p className="text-xs leading-5 text-[#aa5e2a]">{tr('reachedEnd')}</p>
      )}
      {campaign?.fundingType === 'usd' && (
        <p className="text-xs leading-5 text-[#888196]">{tr('legacyHint')}</p>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map(action => {
          const { icon: Icon, text } = ACTIONS[action]
          const destructive = action === 'delete'
          const primary = action === 'start' || action === 'submit' || action === 'resume'
          return (
            <button
              key={action}
              type="button"
              onClick={() => execute(action)}
              disabled={isBusy}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 ${destructive
                ? 'border border-[#f5d7d4] bg-[#fff3f1] text-[#ba4440] dark:bg-[#4a282c] dark:text-[#ffb6af]'
                : primary
                  ? 'bg-[#ffd43f] text-[#211800]'
                  : 'border border-[#e7e1f1] bg-[#f7f2ff] text-[#643dc2] dark:border-white/10 dark:bg-[#3c3151] dark:text-[#e0ccff]'}`}
            >
              {working === action ? <Loader2 size={17} className="animate-spin" /> : <Icon size={17} />}
              {working === action ? tr('processing') : tr(text)}
            </button>
          )
        })}
      </div>
      {actions.length === 0 && <p className="text-xs text-[#898395]">{tr('notAvailable')}</p>}
      {notice && (
        <p
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`flex items-start gap-2 rounded-xl p-3 text-sm ${notice.type === 'success'
            ? 'bg-[#edf8ef] text-[#286344] dark:bg-[#273d33] dark:text-[#a3e7b3]'
            : 'bg-[#fff2e7] text-[#a55420] dark:bg-[#493226] dark:text-[#ffca93]'}`}
        >
          {notice.type === 'success'
            ? <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
            : <AlertCircle className="mt-0.5 shrink-0" size={17} />}
          {tr(notice.key)}
        </p>
      )}
    </section>
  )
}
