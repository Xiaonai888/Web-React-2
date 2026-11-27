import { useShadowLocalGuideText } from './shadowLocalGuideText'
export default function ShadowLocalAuthorGuide({needsReview=false}){
  const t=useShadowLocalGuideText()
  return <section className="app-soft app-border space-y-2 rounded-xl border p-3 text-[12px]" aria-label={t('authorHeading')}>
    <h4 className="app-title font-bold">{t('authorHeading')}</h4>
    <p className="app-muted">{t('authorHint')}</p>
    <p className="app-title font-medium">{t('example')}</p>
    <div className="app-card app-border space-y-1 rounded-lg border p-2" lang="km"><p>ត្រូវការ Telegram សម្រាប់ Limited</p><p>ត្រូវការ អាសយដ្ឋានលម្អិត សម្រាប់ ក្រៅភ្នំពេញ</p></div>
    <div className="app-card app-border space-y-1 rounded-lg border p-2" lang="en"><p>require second phone</p><p>require english signature name for signed</p></div>
    {needsReview&&<p role="alert" className="app-warning">{t('reviewHint')}</p>}
    <p className="app-muted">{t('privacy')}</p>
  </section>
}
