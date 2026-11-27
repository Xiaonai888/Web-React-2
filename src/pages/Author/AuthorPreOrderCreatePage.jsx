import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CalendarDays, ImagePlus, Plus, Trash2, UploadCloud, X } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  AUTHOR_PRE_ORDER_MAX_BOOKS, authorPreOrderText, emptyPreOrderBook, emptyPreOrderCampaign,
  formatKhDateTimeInput, validatePreOrderCampaign,
} from '../../utils/authorPreOrderRules'
import {
  fetchAuthorPreOrder, publishAuthorPreOrder, saveAuthorPreOrderDraft,
  uploadAuthorPreOrderImage, verifyAuthorPreOrderAccess,
} from '../../services/authorPreOrder.service'
import AuthorPreOrderDeliverySection from '../../components/author/preorder/AuthorPreOrderDeliverySection'
import ShadowAiAuthorRequirements from '../../components/shadow-ai/ShadowAiAuthorRequirements'
import {
  fetchAuthorPreOrderDeliveryCompanies,
  findUnavailablePreOrderDeliveryKeys,
} from '../../services/authorPreOrderDelivery.service'

const FIELD = 'w-full min-w-0 rounded-[12px] border border-[#dedede] bg-white px-3.5 py-3 text-[13px] text-[#202020] outline-none placeholder:text-[#a0a0a0] focus:border-[#b1b1b1]'
const CARD = 'rounded-[18px] border border-[#e9e9e9] bg-white p-4'

function Field({ label, value, onChange, type = 'text', placeholder = '', required = false, multiline = false, maxLength, min, step }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[12px] font-semibold text-[#272727]">{label} {required ? <span className="text-[#d53b32]">*</span> : null}</span>
      {multiline ? <textarea value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} rows={3} className={`${FIELD} resize-y`} /> : (
        <input type={type} value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} min={min} step={step} className={FIELD} />
      )}
    </label>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className={CARD}>
      <h2 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold text-[#181818]"><Icon size={20} className="text-[#494949]" />{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-[13px] font-semibold text-[#252525]">{label}</span>
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="h-4 w-4 accent-[#e2ae00]" />
    </label>
  )
}

function ImageField({ label, preview, hint, onChoose, onRemove, chooseLabel, changeLabel, removeLabel }) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-[#333]">{label}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-[#cdcdcd] bg-[#fafafa] p-3 text-center">
        {preview ? <img src={preview} alt={label} className="max-h-[240px] w-full object-contain" /> : <div className="flex min-h-[136px] flex-col items-center justify-center gap-2 text-[#888]"><ImagePlus size={32} /><span className="text-[12px]">{label}</span></div>}
        <span className="mt-3 flex items-center gap-2 rounded-full border border-[#ddd] bg-white px-4 py-2 text-[12px] font-semibold text-[#333]"><UploadCloud size={15} />{preview ? changeLabel : chooseLabel}</span>
        <input type="file" accept="image/*" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) onChoose(file); event.target.value = '' }} />
      </label>
      {hint ? <p className="mt-1.5 text-[11px] leading-5 text-[#878787]">{hint}</p> : null}
      {preview ? <button type="button" onClick={onRemove} className="mt-2 flex items-center gap-1 text-[11px] text-[#777]"><X size={13} />{removeLabel}</button> : null}
    </div>
  )
}

function EditionFields({ label, value, onChange, text }) {
  return (
    <div className="rounded-[13px] bg-[#f7f7f7] p-3">
      <Toggle checked={Boolean(value.enabled)} onChange={enabled => onChange({ ...value, enabled })} label={label} />
      {value.enabled ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label={text('price')} type="number" min="0.01" step="0.01" required value={value.price_usd} onChange={price_usd => onChange({ ...value, price_usd })} placeholder="0.00" />
          <Field label={text('quota')} type="number" min="1" step="1" required value={value.quota} onChange={quota => onChange({ ...value, quota })} placeholder="0" />
        </div>
      ) : null}
    </div>
  )
}

function normalizeLoadedCampaign(data) {
  const base = emptyPreOrderCampaign()
  const books = Array.isArray(data?.books) ? data.books.map(book => ({
    ...emptyPreOrderBook(),
    ...book,
    editions: {
      standard: { enabled: true, price_usd: '', quota: '', ...book.editions?.standard },
      limited: { enabled: false, price_usd: '', quota: '', ...book.editions?.limited },
    },
  })) : base.books
  return {
    ...base, ...data, books: books.length ? books : base.books,
    open_at: formatKhDateTimeInput(data?.open_at),
    close_at: formatKhDateTimeInput(data?.close_at),
    expected_ship_at: formatKhDateTimeInput(data?.expected_ship_at),
    delivery_company_keys: Array.isArray(data?.delivery_company_keys) ? data.delivery_company_keys : base.delivery_company_keys,
  }
}

export default function AuthorPreOrderCreatePage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { language } = useDisplayTranslation()
  const text = key => authorPreOrderText(language, key)
  const [campaign, setCampaign] = useState(emptyPreOrderCampaign)
  const [recordId, setRecordId] = useState(campaignId || '')
  const [savedInstruction, setSavedInstruction] = useState(null)
  const [access, setAccess] = useState('checking')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [retry, setRetry] = useState(0)
  const [imagePreviews, setImagePreviews] = useState({})
  const fileRef = useRef(new Map())
  const urlRef = useRef(new Map())

  useEffect(() => {
    let mounted = true
    setAccess('checking')
    verifyAuthorPreOrderAccess().then(async () => {
      if (!campaignId) return null
      return fetchAuthorPreOrder(campaignId)
    }).then(data => {
      if (!mounted) return
      if (data) setCampaign(normalizeLoadedCampaign(data))
setSavedInstruction(data ? String(data.buyer_note_instruction || '') : null)
      setAccess('allowed')
    }).catch(err => {
      if (!mounted) return
      setError(err.message || text('verifyFailed'))
      setAccess('denied')
    })
    return () => { mounted = false }
  }, [campaignId, retry])

  useEffect(() => () => {
    for (const url of urlRef.current.values()) URL.revokeObjectURL(url)
    urlRef.current.clear()
  }, [])

  function patch(data) {
    setCampaign(current => ({ ...current, ...data }))
    setError('')
    setSuccess('')
  }

  function updateBook(clientId, changes) {
    setCampaign(current => ({ ...current, books: current.books.map(book => book.client_id === clientId ? { ...book, ...changes } : book) }))
    setError('')
  }

  function chooseImage(key, file) {
    const type = String(file?.type || '')
    if (!type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setError(text('uploadFailed'))
      return
    }
    const previous = urlRef.current.get(key)
    if (previous) URL.revokeObjectURL(previous)
    const preview = URL.createObjectURL(file)
    urlRef.current.set(key, preview)
    fileRef.current.set(key, file)
    setImagePreviews(current => ({ ...current, [key]: preview }))
    setError('')
  }

  function removeImage(key) {
    const previous = urlRef.current.get(key)
    if (previous) URL.revokeObjectURL(previous)
    urlRef.current.delete(key)
    fileRef.current.delete(key)
    setImagePreviews(current => { const next = { ...current }; delete next[key]; return next })
    if (key === 'banner') patch({ banner_url: '' })
    else setCampaign(current => ({ ...current, books: current.books.map(book => book.client_id === key ? { ...book, cover_url: '' } : book) }))
  }

  async function uploadPendingImages(current) {
    let result = { ...current, books: current.books.map(book => ({ ...book })) }
    const files = [...fileRef.current.entries()]
    for (const [key, file] of files) {
      const url = await uploadAuthorPreOrderImage(file, { slot: key === 'banner' ? 'banner' : 'book' })
      if (key === 'banner') result.banner_url = url
      else result.books = result.books.map(book => book.client_id === key ? { ...book, cover_url: url } : book)
      fileRef.current.delete(key)
      setCampaign(previous => key === 'banner' ? { ...previous, banner_url: url } : { ...previous, books: previous.books.map(book => book.client_id === key ? { ...book, cover_url: url } : book) })
    }
    return result
  }

  async function save(publish = false) {
    if (busy || access !== 'allowed') return
    setError('')
    setSuccess('')
    if (publish) {
      const invalid = validatePreOrderCampaign(campaign)
      if (invalid) {
        setError(text(invalid))
        return
      }
      if (!campaign.banner_url && !fileRef.current.has('banner')) {
        setError(text('uploadCover'))
        return
      }
    }
    setBusy(true)
    try {
      const selectedKeys = Array.isArray(campaign.delivery_company_keys)
        ? [...new Set(campaign.delivery_company_keys)]
        : []
      if (selectedKeys.length) {
        const companies = await fetchAuthorPreOrderDeliveryCompanies()
        const missingKeys = findUnavailablePreOrderDeliveryKeys(selectedKeys, companies)
        if (missingKeys.length) {
          const explanation = language === 'km'
            ? 'ក្រុមហ៊ុនដឹកជញ្ជូនដែលបានជ្រើសមិនមាន ឬលែងសកម្ម។ សូមផ្ទុកបញ្ជីឡើងវិញហើយជ្រើសម្ដងទៀត'
            : 'Some selected delivery companies are no longer active. Refresh the list and select again'
          throw new Error(`${explanation}: ${missingKeys.join(', ')}`)
        }
      }
      const ready = await uploadPendingImages(campaign)
      const saved = await saveAuthorPreOrderDraft(ready, { id: recordId })
      setRecordId(saved.id)
      setSavedInstruction(String(saved.buyer_note_instruction || ''))
      setCampaign(current => ({ ...current, id: saved.id }))
      if (publish) {
        await publishAuthorPreOrder(saved.id)
        setSuccess(text('published'))
        navigate('/author/page/pre-order', { replace: true })
      } else {
        setSuccess(text('draftSaved'))
        if (!recordId) navigate(`/author/page/pre-order/${encodeURIComponent(saved.id)}/edit`, { replace: true })
      }
    } catch (err) {
      setError(err.code === 'PRE_ORDER_NOT_READY' ? text('noBackend') : err.message || text(publish ? 'publishFailed' : 'saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  const setEdition = (book, edition, next) => updateBook(book.client_id, { editions: { ...book.editions, [edition]: next } })
  const firstBook = campaign.books[0]
  const primaryPrice = firstBook?.editions?.standard?.enabled ? firstBook.editions.standard.price_usd : firstBook?.editions?.limited?.price_usd

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(102px+env(safe-area-inset-bottom))] text-[#171717]">
      <div className="mx-auto max-w-[720px] px-4 pt-3 sm:px-6">
        <header className="mb-4 flex h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/author/page/pre-order')} aria-label={text('back')} className="flex h-10 w-9 items-center justify-center rounded-full hover:bg-[#f4f4f4]"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[19px] font-bold">{campaignId ? text('editTitle') : text('createTitle')}</h1>
        </header>
        {access === 'checking' ? <p className="py-16 text-center text-[13px] text-[#777]">{text('loading')}</p> : access === 'denied' ? (
          <div className="rounded-xl bg-[#f6f6f6] p-5 text-center text-[13px] text-[#555]">
            <p>{error || text('accessDenied')}</p>
            <button type="button" className="mt-3 rounded-full border border-[#ccc] px-4 py-2" onClick={() => { setRetry(value => value + 1); setError('') }}>{text('retry')}</button>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageField label={text('uploadCover')} hint={text('uploadHint')} preview={imagePreviews.banner || campaign.banner_url} onChoose={file => chooseImage('banner', file)} onRemove={() => removeImage('banner')} chooseLabel={text('chooseFile')} changeLabel={text('changeImage')} removeLabel={text('removeImage')} />
            <Section icon={BookOpen} title={text('information')}>
              <Field label={text('campaignTitle')} required value={campaign.title} onChange={title => patch({ title })} placeholder={text('campaignTitleHint')} maxLength={160} />
              <Field label={text('shortDescription')} required multiline value={campaign.description} onChange={description => patch({ description })} placeholder={text('descriptionHint')} maxLength={500} />
              <Field label={text('genre')} required value={campaign.genre} onChange={genre => patch({ genre })} placeholder={text('genresHint')} maxLength={160} />
              <Field label={`${text('authorNote')} (${text('optional')})`} multiline value={campaign.author_note} onChange={author_note => patch({ author_note })} placeholder={text('authorNoteHint')} maxLength={500} />
            </Section>
            <Section icon={CalendarDays} title={text('schedule')}>
              <Field label={text('openDate')} required type="datetime-local" value={campaign.open_at} onChange={open_at => patch({ open_at })} />
              <Field label={text('closeDate')} required type="datetime-local" value={campaign.close_at} onChange={close_at => patch({ close_at })} />
              <Field label={text('releaseDate')} required type="datetime-local" value={campaign.expected_ship_at} onChange={expected_ship_at => patch({ expected_ship_at })} />
            </Section>
            <Section icon={BookOpen} title={text('books')}>
              {campaign.books.map((book, index) => (
                <div key={book.client_id} className="space-y-3 rounded-[14px] border border-[#e7e7e7] p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-bold">{text('book')} {index + 1}</h3>
                    {campaign.books.length > 1 ? <button type="button" aria-label={text('removeBook')} onClick={() => { removeImage(book.client_id); setCampaign(current => ({ ...current, books: current.books.filter(item => item.client_id !== book.client_id) })) }} className="text-[#777]"><Trash2 size={17} /></button> : null}
                  </div>
                  <ImageField label={text('uploadBookCover')} hint={text('uploadHint')} preview={imagePreviews[book.client_id] || book.cover_url} onChoose={file => chooseImage(book.client_id, file)} onRemove={() => removeImage(book.client_id)} chooseLabel={text('chooseFile')} changeLabel={text('changeImage')} removeLabel={text('removeImage')} />
                  <Field label={text('bookTitle')} required value={book.title} onChange={title => updateBook(book.client_id, { title })} maxLength={180} />
                  <p className="text-[12px] font-bold">{text('editions')}</p>
                  <EditionFields label={text('standard')} value={book.editions.standard} onChange={next => setEdition(book, 'standard', next)} text={text} />
                  <EditionFields label={text('limited')} value={book.editions.limited} onChange={next => setEdition(book, 'limited', next)} text={text} />
                </div>
              ))}
              {campaign.books.length < AUTHOR_PRE_ORDER_MAX_BOOKS ? (
                <button type="button" onClick={() => patch({ books: [...campaign.books, emptyPreOrderBook()] })} className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#c9c9c9] py-3 text-[12px] font-semibold"><Plus size={16} />{text('addBook')}</button>
              ) : null}
            </Section>
            <Section icon={BookOpen} title={text('signature')}>
              <Toggle label={text('signedCopies')} checked={campaign.signature_enabled} onChange={signature_enabled => patch({ signature_enabled })} />
              {campaign.signature_enabled ? <>
                <Field label={text('signatureFee')} type="number" min="0" step="0.01" value={campaign.signature_fee_usd} onChange={signature_fee_usd => patch({ signature_fee_usd })} />
                <Field label={text('signatureNote')} multiline value={campaign.signature_note} onChange={signature_note => patch({ signature_note })} placeholder={text('signHint')} maxLength={200} />
              </> : null}
            </Section>
            <Section icon={UploadCloud} title={text('delivery')}>
              <AuthorPreOrderDeliverySection
                selectedKeys={campaign.delivery_company_keys}
                onChange={delivery_company_keys => patch({ delivery_company_keys })}
                disabled={busy}
              />
              <Field label={`${text('deliveryNote')} (${text('optional')})`} multiline value={campaign.delivery_note} onChange={delivery_note => patch({ delivery_note })} placeholder={text('deliveryHint')} maxLength={300} />
              <Field label={`${text('buyerNote')} (${text('optional')})`} multiline value={campaign.buyer_note_instruction} onChange={buyer_note_instruction => patch({ buyer_note_instruction })} placeholder={text('buyerHint')} maxLength={300} />
            <ShadowAiAuthorRequirements campaignId={recordId} instruction={campaign.buyer_note_instruction} savedInstruction={savedInstruction} disabled={busy || !recordId} />
            </Section>
            <Section icon={BookOpen} title={text('preview')}>
              {campaign.banner_url || imagePreviews.banner ? <img alt="" src={imagePreviews.banner || campaign.banner_url} className="max-h-[280px] w-full rounded-xl bg-[#f7f7f7] object-contain" /> : <div className="flex h-[100px] items-center justify-center rounded-xl bg-[#f7f7f7] text-[12px] text-[#999]">{text('emptyPreview')}</div>}
              <p className="text-[15px] font-bold">{campaign.title || text('campaignTitle')}</p>
              <p className="whitespace-pre-wrap text-[12px] text-[#717171]">{campaign.description}</p>
              <div className="flex items-center justify-between rounded-xl bg-[#f6f6f6] px-3 py-3 text-[12px]">
                <span>{campaign.books.length} {campaign.books.length === 1 ? text('book') : text('books')}</span>
                <span className="font-bold">{primaryPrice ? `$${Number(primaryPrice).toFixed(2)}` : '—'}</span>
              </div>
            </Section>
            {error ? <p role="alert" className="rounded-xl bg-[#fff0ed] px-4 py-3 text-[12px] text-[#943325]">{error}</p> : null}
            {success ? <p role="status" className="rounded-xl bg-[#f1f7f1] px-4 py-3 text-[12px] text-[#306834]">{success}</p> : null}
          </div>
        )}
      </div>
      {access === 'allowed' ? <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ebebeb] bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-[688px] gap-3">
          <button type="button" disabled={busy} onClick={() => save(false)} className="min-w-0 flex-1 rounded-[13px] border border-[#dadada] bg-[#f7f7f7] px-3 py-3 text-[13px] font-bold text-[#222] disabled:opacity-50">{busy ? text('saving') : text('saveDraft')}</button>
          <button type="button" disabled={busy} onClick={() => save(true)} className="min-w-0 flex-1 rounded-[13px] bg-[#ffcc28] px-3 py-3 text-[13px] font-bold text-[#161616] disabled:opacity-50">{busy ? text('saving') : text('publish')}</button>
        </div>
      </div> : null}
    </main>
  )
}
