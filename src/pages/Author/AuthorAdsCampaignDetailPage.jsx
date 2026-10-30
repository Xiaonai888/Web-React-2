import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, CalendarClock, Gem, Image as ImageIcon,
  Loader2, RefreshCw,
} from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  authorCampaignContentKey,
  authorCampaignMoney,
  authorCampaignStatusKey,
  describeAuthorCampaignAudience,
  formatAuthorCampaignAmount,
  isAuthorCampaignId,
  safeAuthorCampaignImage,
} from '../../utils/authorAdsCampaignPresentation'
import { getAuthorAdCampaign } from '../../services/authorAdsApi'
import AuthorAdsCampaignActionPanel from '../../components/authorAds/AuthorAdsCampaignActionPanel'

const CAMPAIGNS_PATH = '/author/page/ads/boost-content?tab=campaigns'
const CARD_CLASS = 'rounded-2xl border border-[#eae5f2] bg-white p-4 dark:border-white/10 dark:bg-[#251f31]'

function DataRow({ title, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-1 border-b border-[#efebf4] py-3 last:border-0 dark:border-white/10">
      <dt className="text-xs font-medium text-[#81798e] dark:text-[#c3b9d0]">{title}</dt>
      <dd className="max-w-full break-words text-right text-sm font-semibold text-[#21182d] dark:text-white">{children}</dd>
    </div>
  )
}

function formatDate(value, fallback) {
  if (!value) return fallback
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return fallback
  return new Date(timestamp).toLocaleString(undefined, {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function identifyLoadError(error) {
  if (error?.code === 'AUTH_REQUIRED' || error?.status === 401) return 'authRequired'
  if (error?.code === 'CAMPAIGN_NOT_FOUND' ||
    (error?.status === 404 && error?.code !== 'AUTHOR_ADS_NOT_CONFIGURED')) return 'missing'
  return 'unavailable'
}

export default function AuthorAdsCampaignDetailPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { t } = useDisplayTranslation()
  const tr = (key, options) => t(`authorAdsCampaignDetail.${key}`, options)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [imageFailed, setImageFailed] = useState('')

  useEffect(() => {
    setCampaign(null)
    setImageFailed('')
    if (!isAuthorCampaignId(campaignId)) {
      setError('invalid')
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    setError('')

    getAuthorAdCampaign(campaignId, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return
        if (!result || String(result.id).toLowerCase() !== String(campaignId).toLowerCase()) {
          setError('unavailable')
          return
        }
        setCampaign(result)
      })
      .catch(cause => {
        if (!controller.signal.aborted) setError(identifyLoadError(cause))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [campaignId, reload])

  const goBack = useCallback(() => navigate(CAMPAIGNS_PATH), [navigate])
  const refresh = () => setReload(value => value + 1)
  const onCampaignUpdated = updated => {
    if (!updated || String(updated.id) !== String(campaignId)) return
    setCampaign(updated)
    setError('')
    setImageFailed('')
  }

  const money = authorCampaignMoney(campaign)
  const status = authorCampaignStatusKey(campaign)
  const kind = authorCampaignContentKey(campaign)
  const image = safeAuthorCampaignImage(campaign?.contentImage)
  const canShowImage = image && imageFailed !== image
  const showMoney = money.valid
  const unavailable = tr('notAvailable')

  return (
    <main className="min-h-[100dvh] bg-[#f9f7ff] pb-20 text-[#21182d] dark:bg-[#14111d] dark:text-white">
      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-5 sm:px-6">
        <header className="flex items-center gap-3">
          <button type="button" onClick={goBack} aria-label={tr('back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#21182d] dark:bg-[#31273f] dark:text-white">
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold">{tr('title')}</h1>
          </div>
          <button type="button" disabled={loading || !isAuthorCampaignId(campaignId)}
            onClick={refresh} aria-label={tr('reload')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6335d7] disabled:opacity-50 dark:bg-[#31273f] dark:text-[#dbc8ff]">
            <RefreshCw size={19} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {loading && (
          <div role="status" className={`${CARD_CLASS} flex items-center justify-center gap-2 py-12 text-sm text-[#81798e]`}>
            <Loader2 size={19} className="animate-spin" />{tr('loading')}
          </div>
        )}

        {!loading && error && (
          <div role="alert" className={`${CARD_CLASS} space-y-3`}>
            <p className="text-sm text-[#b15b3a] dark:text-[#ffb9a1]">{tr(error)}</p>
            {error !== 'invalid' && (
              <button type="button" onClick={refresh}
                className="rounded-lg bg-[#eee7ff] px-4 py-2 text-sm font-semibold text-[#6335d7]">
                {tr('reload')}
              </button>
            )}
          </div>
        )}

        {!loading && !error && !campaign && (
          <div role="status" className={CARD_CLASS}>{tr('unavailable')}</div>
        )}

        {!loading && !error && campaign && (
          <>
            <section className={CARD_CLASS}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f0e8ff] px-2.5 py-1 text-xs font-semibold text-[#613ac8] dark:bg-[#42325b] dark:text-[#decfff]">
                  {tr(status)}
                </span>
                <span className="text-xs text-[#898195] dark:text-[#c5bacd]">{tr(kind)}</span>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex h-[128px] w-[98px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0eafa] dark:bg-[#392d4a]">
                  {canShowImage
                    ? <img src={image} alt="" loading="lazy" onError={() => setImageFailed(image)} className="h-full w-full object-cover" />
                    : kind === 'post' ? <ImageIcon size={28} /> : <BookOpen size={28} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-4 text-base font-bold leading-6">{campaign.contentTitle || tr('published')}</h2>
                  {campaign.status === 'draft' && (
                    <p className="mt-2 text-xs leading-5 text-[#817990] dark:text-[#c1b6cf]">{tr('draftHint')}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              {[
                [tr('budget'), showMoney ? formatAuthorCampaignAmount(money.budget, money.unit) : unavailable],
                [tr('spent'), showMoney ? formatAuthorCampaignAmount(money.spent, money.unit) : unavailable],
                [tr('remaining'), showMoney ? formatAuthorCampaignAmount(money.remaining, money.unit) : unavailable],
                [tr('funding'), campaign.fundingType === 'diamonds' ? tr('fundingDiamonds')
                  : campaign.fundingType === 'usd' ? tr('fundingUsd')
                    : campaign.fundingType === 'unfunded' ? tr('unfunded') : tr('fundingUnknown')],
              ].map(([label, value]) => (
                <div key={label} className={CARD_CLASS}>
                  <p className="text-xs text-[#817990] dark:text-[#c5b9d2]">{label}</p>
                  <p className="mt-2 break-words text-lg font-bold tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <section className={CARD_CLASS}>
              <h2 className="mb-1 flex items-center gap-2 text-sm font-bold">
                <CalendarClock size={17} />{tr('title')}
              </h2>
              <dl>
                <DataRow title={tr('objective')}>{String(campaign.goal || unavailable)}</DataRow>
                <DataRow title={tr('audience')}>{describeAuthorCampaignAudience(campaign, t)}</DataRow>
                <DataRow title={tr('duration')}>
                  {Number.isInteger(Number(campaign.durationDays)) && Number(campaign.durationDays) > 0
                    ? tr('days', { count: campaign.durationDays }) : unavailable}
                </DataRow>
                <DataRow title={tr('review')}>
                  {String(campaign.reviewStatus || unavailable).replaceAll('_', ' ')}
                </DataRow>
                <DataRow title={tr('created')}>{formatDate(campaign.createdAt, unavailable)}</DataRow>
                <DataRow title={tr('startDate')}>{formatDate(campaign.startAt, unavailable)}</DataRow>
                <DataRow title={tr('endDate')}>{formatDate(campaign.endAt, unavailable)}</DataRow>
              </dl>
              {campaign.reviewReason && (
                <p className="mt-3 rounded-xl bg-[#fff5e9] p-3 text-xs text-[#a25c2e] dark:bg-[#4b3629] dark:text-[#ffcea2]">
                  {campaign.reviewReason}
                </p>
              )}
              <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-[#817990] dark:text-[#c5b9d2]">
                <Gem size={15} className="mt-0.5 shrink-0" />{tr('moneyHint')}
              </p>
            </section>

            <AuthorAdsCampaignActionPanel
              key={campaign.id}
              campaign={campaign}
              onUpdated={onCampaignUpdated}
              onDeleted={() => navigate(CAMPAIGNS_PATH, { replace: true })}
            />
          </>
        )}
      </div>
    </main>
  )
}
