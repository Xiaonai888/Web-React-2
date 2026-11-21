const COPY = {
  en: { title: 'Books and Editions', hint: 'All books in this record must belong to the same story.', book: 'Volume', standard: 'Standard', limited: 'Limited', price: 'Price', quota: 'Quota', disabled: 'Not offered', none: 'No book details yet.' },
  km: { title: 'សៀវភៅ និងប្រភេទ', hint: 'សៀវភៅទាំងអស់ក្នុង Record នេះត្រូវជារឿងតែមួយ។', book: 'ក្បាល', standard: 'ធម្មតា', limited: 'មានកំណត់', price: 'តម្លៃ', quota: 'កូតា', disabled: 'មិនដាក់លក់', none: 'មិនទាន់មានព័ត៌មានសៀវភៅ។' },
  zh: { title: '书籍与版本', hint: '此记录中的所有书籍必须属于同一故事。', book: '分册', standard: '普通版', limited: '限量版', price: '价格', quota: '限额', disabled: '不提供', none: '暂无书籍信息。' },
  ja: { title: '書籍とエディション', hint: 'この記録内の書籍はすべて同じ作品に属する必要があります。', book: '巻', standard: '通常版', limited: '限定版', price: '価格', quota: '上限', disabled: '提供なし', none: '書籍情報はありません。' },
  ko: { title: '도서 및 에디션', hint: '이 기록의 모든 도서는 같은 작품에 속해야 합니다.', book: '권', standard: '일반판', limited: '한정판', price: '가격', quota: '수량 한도', disabled: '제공 안 함', none: '도서 정보가 없습니다.' },
}

function formatUsd(value) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? `$${amount.toFixed(2)}` : '—'
}

function EditionRow({ title, edition, t }) {
  if (edition?.enabled !== true) return null
  const quota = Number(edition.quota)
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#eeeeee] py-3 text-[12px]">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#292929]">{title}</p>
        <p className="mt-1 text-[#777]">{t.quota}: {Number.isFinite(quota) ? Math.max(0, quota).toLocaleString('en-US') : '—'}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-[#888]">{t.price}</p>
        <p className="mt-0.5 text-[13px] font-bold text-[#222]">{formatUsd(edition.price_usd)}</p>
      </div>
    </div>
  )
}

export default function AuthorPreOrderRecordBookList({ books = [], language = 'en' }) {
  const t = COPY[language] || COPY.en
  const items = Array.isArray(books) ? books : []
  return (
    <section className="rounded-[17px] border border-[#e7e7e7] bg-white p-4">
      <h2 className="text-[15px] font-bold text-[#1b1b1b]">{t.title}</h2>
      <p className="mt-1 text-[11px] leading-5 text-[#797979]">{t.hint}</p>
      {items.length ? (
        <div className="mt-4 space-y-3">
          {items.map((book, index) => (
            <article key={book.id || index} className="rounded-[13px] border border-[#ededed] p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-[108px] w-[77px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-[#f5f5f5]">
                  {book.cover_url ? <img src={book.cover_url} alt="" className="max-h-full max-w-full object-contain" loading="lazy" /> : <span className="text-[10px] text-[#aaa]">{t.book}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-[#888]">{t.book} {index + 1}</p>
                  <p className="mt-1 break-words text-[14px] font-bold leading-5 text-[#202020]">{book.title || '—'}</p>
                  <p className="mt-2 text-[11px] text-[#777]">{[book.editions?.standard?.enabled && t.standard, book.editions?.limited?.enabled && t.limited].filter(Boolean).join(' · ') || t.disabled}</p>
                </div>
              </div>
              <div className="mt-3">
                <EditionRow title={t.standard} edition={book.editions?.standard} t={t} />
                <EditionRow title={t.limited} edition={book.editions?.limited} t={t} />
              </div>
            </article>
          ))}
        </div>
      ) : <p className="mt-4 text-[12px] text-[#777]">{t.none}</p>}
    </section>
  )
}
