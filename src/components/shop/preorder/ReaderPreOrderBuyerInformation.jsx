const COPY = {
  en: {
    title: 'Buyer information', hint: 'Details for the author to prepare and deliver your books.',
    name: 'Full name', phone: 'Phone number', address: 'Delivery address', province: 'Province / city',
    telegram: 'Telegram (optional)', facebook: 'Facebook link (optional)',
    signature: 'Name to write on the signed copy', note: 'Note for the author (optional)',
    required: 'Required', privacy: 'Preview only. This form does not place an order or charge you.',
  },
  km: {
    title: 'ព័ត៌មានអ្នកទិញ', hint: 'ព័ត៌មានសម្រាប់អ្នកនិពន្ធរៀបចំ និងដឹកជញ្ជូនសៀវភៅ។',
    name: 'ឈ្មោះអ្នកទិញ', phone: 'លេខទូរស័ព្ទ', address: 'អាសយដ្ឋានដឹកជញ្ជូន', province: 'ខេត្ត / ក្រុង',
    telegram: 'Telegram (មិនបង្ខំ)', facebook: 'Facebook Link (មិនបង្ខំ)',
    signature: 'ឈ្មោះដែលចង់ឱ្យអ្នកនិពន្ធសរសេរលើសៀវភៅ', note: 'សារទៅអ្នកនិពន្ធ (មិនបង្ខំ)',
    required: 'ចាំបាច់', privacy: 'នេះគ្រាន់តែជាការមើលព័ត៌មានមុនកក់ មិនបង្កើត Order ឬកាត់ប្រាក់ទេ។',
  },
  zh: {
    title: '买家信息', hint: '供作者准备并配送书籍的信息。',
    name: '收件人姓名', phone: '电话号码', address: '收货地址', province: '省份 / 城市',
    telegram: 'Telegram（选填）', facebook: 'Facebook 链接（选填）',
    signature: '签名本上要写的名字', note: '给作者的留言（选填）',
    required: '必填', privacy: '仅供预览，不会下单或扣款。',
  },
  ja: {
    title: '購入者情報', hint: '著者が本を準備・配送するための情報です。',
    name: '氏名', phone: '電話番号', address: '配送先住所', province: '都道府県 / 市区町村',
    telegram: 'Telegram（任意）', facebook: 'Facebook リンク（任意）',
    signature: 'サイン本に書いてほしい名前', note: '著者へのメッセージ（任意）',
    required: '必須', privacy: 'プレビューのみです。注文・決済は行われません。',
  },
  ko: {
    title: '구매자 정보', hint: '작가가 도서를 준비하고 배송하는 데 필요한 정보입니다.',
    name: '받는 사람 이름', phone: '전화번호', address: '배송 주소', province: '지역 / 도시',
    telegram: 'Telegram (선택)', facebook: 'Facebook 링크 (선택)',
    signature: '사인본에 적을 이름', note: '작가에게 전할 메모 (선택)',
    required: '필수', privacy: '미리보기 전용입니다. 주문이나 결제는 진행되지 않습니다.',
  },
}

const INPUT = 'w-full min-w-0 rounded-xl border border-[#dedede] bg-white px-3.5 py-3 text-[13px] text-[#242424] outline-none focus:border-[#c7a024] disabled:opacity-60'

function BuyerField({ label, required = false, multiline = false, value, onChange, disabled, maxLength, type = 'text', autoComplete = 'off', placeholder = '' }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12px] font-semibold text-[#303030]">
        {label} {required ? <span className="text-[#c84f43]">*</span> : null}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          maxLength={maxLength}
          value={value || ''}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`${INPUT} resize-y`}
        />
      ) : (
        <input
          type={type}
          maxLength={maxLength}
          autoComplete={autoComplete}
          value={value || ''}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={INPUT}
        />
      )}
    </label>
  )
}

export default function ReaderPreOrderBuyerInformation({
  value = {},
  onChange,
  signatureRequested = false,
  disabled = false,
  language = 'km',
}) {
  const t = COPY[language] || COPY.en
  const buyer = value?.buyer || {}
  const updateBuyer = (key, text) => {
    if (typeof onChange === 'function' && !disabled) {
      onChange({ ...value, buyer: { ...buyer, [key]: text } })
    }
  }
  const updateField = (key, text) => {
    if (typeof onChange === 'function' && !disabled) {
      onChange({ ...value, [key]: text })
    }
  }

  return (
    <section className="rounded-[16px] border border-[#e9e9e9] bg-white p-4 text-[#222]">
      <h2 className="text-[15px] font-bold">{t.title}</h2>
      <p className="mt-1 text-[11px] leading-5 text-[#777]">{t.hint}</p>
      <div className="mt-4 space-y-3.5">
        <BuyerField label={t.name} required value={buyer.name} onChange={text => updateBuyer('name', text)} disabled={disabled} maxLength={160} autoComplete="name" />
        <BuyerField label={t.phone} required type="tel" value={buyer.phone_number} onChange={text => updateBuyer('phone_number', text)} disabled={disabled} maxLength={28} autoComplete="tel" placeholder="+855..." />
        <BuyerField label={t.province} value={buyer.province_city} onChange={text => updateBuyer('province_city', text)} disabled={disabled} maxLength={120} autoComplete="address-level1" />
        <BuyerField label={t.address} required multiline value={buyer.delivery_address} onChange={text => updateBuyer('delivery_address', text)} disabled={disabled} maxLength={800} autoComplete="street-address" />
        <BuyerField label={t.telegram} value={buyer.telegram_username} onChange={text => updateBuyer('telegram_username', text)} disabled={disabled} maxLength={250} placeholder="@username" />
        <BuyerField label={t.facebook} type="url" value={buyer.facebook_link} onChange={text => updateBuyer('facebook_link', text)} disabled={disabled} maxLength={500} placeholder="https://www.facebook.com/..." />
        {signatureRequested ? (
          <BuyerField label={t.signature} required value={value.signature_name} onChange={text => updateField('signature_name', text)} disabled={disabled} maxLength={160} />
        ) : null}
        <BuyerField label={t.note} multiline value={value.buyer_note} onChange={text => updateField('buyer_note', text)} disabled={disabled} maxLength={1000} />
      </div>
      <p className="mt-4 border-t border-[#f0f0f0] pt-3 text-[11px] leading-5 text-[#888]">{t.privacy}</p>
    </section>
  )
}
