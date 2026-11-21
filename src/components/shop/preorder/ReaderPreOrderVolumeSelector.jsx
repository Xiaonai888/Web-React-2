import {
  readerPreOrderVolumes,
  readerPreOrderVolumeChoices,
  readerPreOrderUpdateVolumeSelection,
  readerPreOrderVolumeEstimate,
} from '../../../utils/readerPreOrderVolumeSelection'
import { readerPreOrderMoney } from '../../../utils/readerPreOrderUi'

const TEXT = {
  km: { title: 'ជ្រើសសៀវភៅក្នុងរឿងនេះ', tip: 'ជ្រើសភាគ និងប្រភេទសៀវភៅដែលចង់កក់', none: 'មិនជ្រើស', standard: 'ធម្មតា', limited: 'មានកំណត់', sold: 'អស់ស្តុក', remain: 'នៅសល់', qty: 'ចំនួន', volumes: 'សៀវភៅដែលបានជ្រើស', copies: 'ក្បាល', subtotal: 'តម្លៃសៀវភៅប៉ាន់ស្មាន', notice: 'តម្លៃប៉ាន់ស្មាន មិនទាន់រួមថ្លៃដឹកជញ្ជូន និងហត្ថលេខា។ តម្លៃពិតត្រូវពិនិត្យពី Server។' },
  en: { title: 'Choose volumes', tip: 'Choose books and editions from this story', none: 'Not selected', standard: 'Standard', limited: 'Limited', sold: 'Sold out', remain: 'Available', qty: 'Copies', volumes: 'Selected volumes', copies: 'copies', subtotal: 'Estimated book subtotal', notice: 'Estimate only, excluding delivery and signatures. The server will confirm the final price.' },
  zh: { title: '选择分册', tip: '从本作品中选择书籍和版本', none: '不选择', standard: '普通版', limited: '限定版', sold: '售罄', remain: '可用', qty: '数量', volumes: '已选分册', copies: '本', subtotal: '图书小计估算', notice: '仅为估算，不含配送及签名费用，最终金额由服务器确认。' },
  ja: { title: '巻を選択', tip: 'この作品から本と版を選択', none: '選択しない', standard: '通常版', limited: '限定版', sold: '売り切れ', remain: '残り', qty: '冊数', volumes: '選択した巻', copies: '冊', subtotal: '書籍小計（概算）', notice: '概算のみ。送料・サイン料は別途、最終金額はサーバーが確認します。' },
  ko: { title: '권 선택', tip: '이 작품의 도서와 판형을 선택하세요', none: '선택 안 함', standard: '일반판', limited: '한정판', sold: '품절', remain: '잔여', qty: '수량', volumes: '선택한 권', copies: '권', subtotal: '예상 도서 소계', notice: '배송비와 사인 비용을 제외한 예상 금액이며 최종 금액은 서버에서 확인합니다.' },
}

const BUTTON = 'flex h-9 w-9 items-center justify-center rounded-lg border border-[#dedede] text-[17px] font-bold disabled:cursor-not-allowed disabled:opacity-30'

export default function ReaderPreOrderVolumeSelector({ record, value = [], onChange, disabled = false, language = 'km' }) {
  const t = TEXT[language] || TEXT.en
  const books = readerPreOrderVolumes(record)
  const items = Array.isArray(value) ? value : []
  const estimate = readerPreOrderVolumeEstimate(record, items)

  function update(bookId, edition, quantity) {
    if (disabled || typeof onChange !== 'function') return
    onChange(readerPreOrderUpdateVolumeSelection(record, items, bookId, edition, quantity))
  }

  return (
    <section className="rounded-[16px] border border-[#e7e7e7] bg-white p-4 text-[#222]">
      <h2 className="text-[15px] font-bold">{t.title}</h2>
      <p className="mt-1 text-[12px] text-[#777]">{t.tip}</p>
      <div className="mt-4 space-y-3">
        {books.map((book, index) => {
          const current = items.find(line => String(line.book_id).toLowerCase() === book.id.toLowerCase())
          const chosen = current?.edition || ''
          const choices = readerPreOrderVolumeChoices(book)
          const selected = choices.find(choice => choice.edition === chosen)
          const quantity = Number(current?.quantity || 1)
          return (
            <div key={book.id} className="rounded-xl border border-[#e8e8e8] p-3">
              <div className="flex items-center gap-3">
                {book.cover_url ? <img alt="" src={book.cover_url} loading="lazy" className="h-[88px] w-[63px] shrink-0 rounded-lg object-cover" /> : <div className="flex h-[88px] w-[63px] shrink-0 items-center justify-center rounded-lg bg-[#f1f1f1] text-[12px] text-[#999]">{index + 1}</div>}
                <div className="min-w-0 flex-1">
                  <p className="break-words text-[13px] font-bold">{book.title || `Volume ${index + 1}`}</p>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-2 text-[12px] text-[#777]">
                      <input type="radio" name={`volume-${book.id}`} checked={!chosen} disabled={disabled} onChange={() => update(book.id, '', 0)} className="accent-[#cfa200]" />
                      {t.none}
                    </label>
                    {choices.map(choice => (
                      <label key={choice.edition} className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="flex min-w-0 items-center gap-2">
                          <input type="radio" name={`volume-${book.id}`} checked={chosen === choice.edition} disabled={disabled || !choice.enabled} onChange={() => update(book.id, choice.edition, 1)} className="accent-[#cfa200]" />
                          <span className={choice.enabled ? 'font-medium' : 'text-[#aaa]'}>{t[choice.edition]}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-semibold">{readerPreOrderMoney(choice.price_usd)}</span>
                          <span className="text-[10px] text-[#888]">{choice.enabled ? `${t.remain}: ${choice.available}` : t.sold}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {selected?.enabled ? (
                <div className="mt-3 flex items-center justify-between border-t border-[#eee] pt-3">
                  <span className="text-[12px] font-medium">{t.qty}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" className={BUTTON} disabled={disabled || quantity <= 1} onClick={() => update(book.id, chosen, quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span className="min-w-5 text-center text-[13px] font-bold">{quantity}</span>
                    <button type="button" className={BUTTON} disabled={disabled || quantity >= Math.min(99, selected.available)} onClick={() => update(book.id, chosen, quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="mt-4 space-y-2 border-t border-[#eee] pt-4">
        <div className="flex items-center justify-between gap-3 text-[12px]"><span>{t.volumes}</span><strong>{items.length} · {estimate.total_copies} {t.copies}</strong></div>
        <div className="flex items-center justify-between gap-3 text-[14px] font-bold"><span>{t.subtotal}</span><span>{readerPreOrderMoney(estimate.subtotal_usd)}</span></div>
        <p className="text-[11px] leading-5 text-[#888]">{t.notice}</p>
      </div>
    </section>
  )
}
