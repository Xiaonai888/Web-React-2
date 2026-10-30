import { BookOpen, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  authorCampaignContentKey, authorCampaignMoney, authorCampaignStatusKey,
  formatAuthorCampaignAmount, safeAuthorCampaignImage,
} from '../../utils/authorAdsCampaignPresentation'

const ICONS = { post: ImageIcon, story: BookOpen, product: FileText, otherType: BookOpen }

export default function AuthorAdsCampaignCard({ campaign, onManage, disabled = false }) {
  const { t } = useDisplayTranslation()
  const tr = (key, values) => t(`authorAdsCampaignDetail.${key}`, values)
  if (!campaign) return null

  const contentKey = authorCampaignContentKey(campaign)
  const Icon = ICONS[contentKey]
  const amount = authorCampaignMoney(campaign)
  const image = safeAuthorCampaignImage(campaign.contentImage || campaign.content_image_url)
  const title = String(campaign.contentTitle || campaign.content_title || '').trim() || tr('published')
  const status = campaign.deviceDraft ? 'draft' : authorCampaignStatusKey(campaign)
  const unit = amount.unit

  return (
    <article className="rounded-2xl border border-[#ebe6f4] bg-white p-4 shadow-[0_5px_16px_rgba(65,44,103,0.04)] dark:border-white/10 dark:bg-[#251f31]">
      <div className="flex gap-3">
        <div className="flex h-[88px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f1edfa] dark:bg-[#3a304b]">
          {image ? <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
            : <Icon size={28} className="text-[#7653c9]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f0e8ff] px-2.5 py-1 text-[11px] font-semibold text-[#623bbd] dark:bg-[#46335e] dark:text-[#dccbff]">
              {tr(status)}
            </span>
            <span className="text-[11px] text-[#8a819c] dark:text-[#c1b6d2]">{tr(contentKey)}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-[#21182d] dark:text-white">{title}</h3>
          <p className="mt-2 text-xs text-[#777087] dark:text-[#c7bdd2]">
            {tr('budget')}: <span className="font-semibold">{amount.valid || campaign.deviceDraft
              ? formatAuthorCampaignAmount(amount.budget, unit) : tr('notAvailable')}</span>
          </p>
        </div>
      </div>
      {!campaign.deviceDraft && amount.valid && (
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#faf8ff] p-3 dark:bg-[#30283e]">
          <p className="text-xs text-[#7c738d] dark:text-[#bfb3cd]">{tr('spent')}
            <span className="mt-1 block font-semibold text-[#21182d] dark:text-white">{formatAuthorCampaignAmount(amount.spent, unit)}</span>
          </p>
          <p className="text-xs text-[#7c738d] dark:text-[#bfb3cd]">{tr('remaining')}
            <span className="mt-1 block font-semibold text-[#21182d] dark:text-white">{formatAuthorCampaignAmount(amount.remaining, unit)}</span>
          </p>
        </div>
      )}
      {typeof onManage === 'function' && (
        <button type="button" disabled={disabled} onClick={() => onManage(campaign)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f1eaff] px-4 py-3 text-sm font-semibold text-[#6335d7] disabled:opacity-50 dark:bg-[#42325b] dark:text-[#decfff]">
          {tr('manage')} <ChevronRight size={16} />
        </button>
      )}
    </article>
  )
}
