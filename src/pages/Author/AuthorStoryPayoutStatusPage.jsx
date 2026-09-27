import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLoadingState, PageErrorState } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoryPayoutStatus', {
  en: { title: 'Payout Status', back: 'Back', subtitle: 'Earnings from paid story unlocks only', loading: 'Loading payout status...', error: 'Could not load payout status.', retry: 'Try again', unpaid: 'Unpaid story earnings', eligible: 'Eligible for payout', minimum: 'Minimum payout', carry: 'Carry forward', carryBody: 'Your earnings stay in your balance and carry into future months until eligible earnings reach $10.', ready: 'Ready for payout', readyBody: 'Your eligible balance has reached the minimum. Shadow handles the transfer manually; no withdrawal request is needed.', scheduled: 'Pending transfer', scheduledBody: 'Your payout is queued for manual transfer by Shadow.', awaitingReceipt: 'Transfer recorded · receipt pending', awaitingReceiptBody: 'Shadow has recorded a completed transfer and is confirming the bank receipt. Do not request another transfer.', missing: 'Bank details needed', missingBody: 'Please add your payment details so Shadow can process a payout when it is ready.', paid: 'Paid', paidBody: 'This payout has been recorded as paid.', bankConnected: 'Payment details added', bankMissing: 'No payment details', bankHelp: 'Saving payment details does not verify your bank account.', addBank: 'Add Bank / Bank QR', changeBank: 'Change payment details', latest: 'Latest payout', month: 'Month', amount: 'Amount', noPayout: 'No payout has been created yet.', note: 'Diamond gifts and Author Store earnings are not included in this balance.', refresh: 'Refresh', pending: 'Not yet eligible', unavailable: 'No earnings yet' },
  km: { title: 'ស្ថានភាពទទួលប្រាក់', back: 'ត្រឡប់ក្រោយ', subtitle: 'ចំណូលពីការដោះសោរឿងដោយ Diamond ប៉ុណ្ណោះ', loading: 'កំពុងផ្ទុកស្ថានភាព...', error: 'មិនអាចផ្ទុកស្ថានភាពទទួលប្រាក់បានទេ។', retry: 'សាកម្ដងទៀត', unpaid: 'ចំណូលរឿងមិនទាន់បើក', eligible: 'ប្រាក់គ្រប់លក្ខខណ្ឌ', minimum: 'កម្រិតទទួលប្រាក់', carry: 'បូកបន្តទៅខែបន្ទាប់', carryBody: 'ប្រាក់របស់អ្នកនឹងរក្សាទុក និងបូកបន្តទៅខែក្រោយ រហូតដល់ចំណូលដែលគ្រប់លក្ខខណ្ឌមាន $10។', ready: 'ត្រៀមទទួលប្រាក់', readyBody: 'ប្រាក់របស់អ្នកគ្រប់កម្រិតហើយ។ Shadow នឹងផ្ទេរប្រាក់ដោយផ្ទាល់ មិនចាំបាច់ស្នើដកប្រាក់ទេ។', scheduled: 'កំពុងរង់ចាំផ្ទេរប្រាក់', scheduledBody: 'ប្រាក់របស់អ្នកកំពុងរង់ចាំ Shadow ផ្ទេរដោយផ្ទាល់។', awaitingReceipt: 'បានកត់ត្រាការផ្ទេរ · រង់ចាំបង្កាន់ដៃ', awaitingReceiptBody: 'Shadow បានកត់ត្រាការផ្ទេរប្រាក់រួច និងកំពុងផ្ទៀងផ្ទាត់បង្កាន់ដៃធនាគារ។ មិនចាំបាច់ស្នើឱ្យផ្ទេរម្តងទៀតទេ។', missing: 'ត្រូវបន្ថែមព័ត៌មានធនាគារ', missingBody: 'សូមបន្ថែមព័ត៌មានទទួលប្រាក់ ដើម្បីឱ្យ Shadow អាចដំណើរការពេលប្រាក់គ្រប់លក្ខខណ្ឌ។', paid: 'បានបើកប្រាក់', paidBody: 'ការបើកប្រាក់នេះត្រូវបានកត់ត្រាថាបានបង់រួច។', bankConnected: 'បានបន្ថែមព័ត៌មានទទួលប្រាក់', bankMissing: 'មិនទាន់មានព័ត៌មានទទួលប្រាក់', bankHelp: 'ការរក្សាទុកព័ត៌មានមិនមានន័យថាធនាគារបានផ្ទៀងផ្ទាត់រួចទេ។', addBank: 'បន្ថែមធនាគារ / Bank QR', changeBank: 'កែព័ត៌មានទទួលប្រាក់', latest: 'ការបើកប្រាក់ចុងក្រោយ', month: 'ខែ', amount: 'ចំនួនទឹកប្រាក់', noPayout: 'មិនទាន់មានការបង្កើត Payout ទេ។', note: 'សមតុល្យនេះមិនរាប់បញ្ចូលកាដូ Diamond និងចំណូល Author Store ទេ។', refresh: 'ផ្ទុកឡើងវិញ', pending: 'មិនទាន់គ្រប់លក្ខខណ្ឌ', unavailable: 'មិនទាន់មានចំណូល' },
  zh: { title: '付款状态', back: '返回', subtitle: '仅包含付费故事解锁收入', loading: '正在加载付款状态...', error: '无法加载付款状态。', retry: '重试', unpaid: '未支付的故事收入', eligible: '符合付款条件的金额', minimum: '最低付款金额', carry: '结转至下月', carryBody: '收入将保留并结转，直到符合条件的金额达到 $10。', ready: '可以付款', readyBody: '金额已达到最低标准。Shadow 将手动转账，无需申请提现。', scheduled: '等待转账', scheduledBody: 'Shadow 正在安排手动转账。', awaitingReceipt: '转账已登记 · 待确认凭证', awaitingReceiptBody: 'Shadow 已登记完成的转账，正在核验银行凭证。请勿再次请求转账。', missing: '需要收款信息', missingBody: '请添加收款信息，以便达到条件后处理付款。', paid: '已付款', paidBody: '这笔付款已记录为支付完成。', bankConnected: '已添加收款信息', bankMissing: '尚无收款信息', bankHelp: '保存收款信息不代表银行已验证。', addBank: '添加银行 / 银行二维码', changeBank: '更改收款信息', latest: '最近一次付款', month: '月份', amount: '金额', noPayout: '尚未生成付款记录。', note: '此余额不含 Diamond 礼物和 Author Store 收入。', refresh: '刷新', pending: '尚未达到条件', unavailable: '暂无收入' },
  ja: { title: '支払い状況', back: '戻る', subtitle: '有料ストーリー解放の収益のみ', loading: '支払い状況を読み込み中...', error: '支払い状況を読み込めませんでした。', retry: '再試行', unpaid: '未払いのストーリー収益', eligible: '支払い対象額', minimum: '最低支払い額', carry: '翌月へ繰り越し', carryBody: '支払い対象額が $10 に達するまで、収益は翌月以降へ繰り越されます。', ready: '支払い準備完了', readyBody: '最低金額に達しました。Shadow が手動で送金します。出金申請は不要です。', scheduled: '送金待ち', scheduledBody: 'Shadow による手動送金を待っています。', awaitingReceipt: '送金記録済み · 明細確認待ち', awaitingReceiptBody: 'Shadow は送金を記録し、銀行の振込明細を確認中です。再送金を依頼しないでください。', missing: '振込先情報が必要です', missingBody: '支払いのために振込先情報を登録してください。', paid: '支払い済み', paidBody: 'この支払いは完了として記録されています。', bankConnected: '振込先情報を登録済み', bankMissing: '振込先情報がありません', bankHelp: '情報の登録は銀行による確認を意味しません。', addBank: '銀行 / 銀行QRを登録', changeBank: '振込先情報を変更', latest: '直近の支払い', month: '月', amount: '金額', noPayout: '支払い記録はまだありません。', note: 'Diamond ギフトと Author Store の収益はこの残高に含まれません。', refresh: '更新', pending: 'まだ支払い対象外', unavailable: '収益はまだありません' },
  ko: { title: '지급 상태', back: '뒤로', subtitle: '유료 스토리 잠금 해제 수익만 포함', loading: '지급 상태를 불러오는 중...', error: '지급 상태를 불러올 수 없습니다.', retry: '다시 시도', unpaid: '미지급 스토리 수익', eligible: '지급 대상 금액', minimum: '최소 지급 금액', carry: '다음 달로 이월', carryBody: '지급 대상 수익이 $10에 도달할 때까지 다음 달로 이월됩니다.', ready: '지급 준비 완료', readyBody: '최소 금액에 도달했습니다. Shadow가 수동으로 송금하므로 출금 신청은 필요하지 않습니다.', scheduled: '송금 대기', scheduledBody: 'Shadow의 수동 송금을 기다리고 있습니다.', awaitingReceipt: '송금 기록 완료 · 영수증 확인 중', awaitingReceiptBody: 'Shadow가 완료된 송금을 기록했으며 은행 영수증을 확인하고 있습니다. 재송금을 요청하지 마세요.', missing: '계좌 정보 필요', missingBody: '지급을 위해 수령 정보를 등록해 주세요.', paid: '지급 완료', paidBody: '이 지급은 완료로 기록되었습니다.', bankConnected: '수령 정보 등록됨', bankMissing: '수령 정보 없음', bankHelp: '정보 등록은 은행의 인증을 의미하지 않습니다.', addBank: '은행 / 은행 QR 등록', changeBank: '수령 정보 변경', latest: '최근 지급 내역', month: '월', amount: '금액', noPayout: '생성된 지급 내역이 없습니다.', note: 'Diamond 선물 및 Author Store 수익은 이 잔액에 포함되지 않습니다.', refresh: '새로고침', pending: '아직 지급 대상 아님', unavailable: '아직 수익 없음' },
})

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const money = (value) => `$${Math.max(0, Number(value) || 0).toFixed(2)}`
const paperGrid = {
  backgroundImage: 'linear-gradient(rgba(115,89,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(115,89,145,0.035) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
}

function Tape({ className = '' }) {
  return <span aria-hidden="true" className={`pointer-events-none absolute h-5 w-14 rounded-[4px] border border-[#e5c9ee] bg-[#eadcff]/80 shadow-sm ${className}`} />
}

function Sparkles({ className = '' }) {
  return <div aria-hidden="true" className={`pointer-events-none select-none text-[12px] tracking-[7px] ${className}`}><span className="text-[#f4a5c6]">♥</span><span className="text-[#e6b654]">★</span><span className="text-[#9a78d5]">✦</span></div>
}

function IconBubble({ icon, tone = 'purple', size = 'normal' }) {
  const tones = {
    purple: 'border-[#d9c9ee] bg-[#eee6ff] text-[#7d5ab2]',
    pink: 'border-[#f0c9db] bg-[#ffe6f0] text-[#dc6796]',
    gold: 'border-[#ecd6a1] bg-[#fff2cd] text-[#bd8518]',
    blue: 'border-[#cedaf1] bg-[#e8efff] text-[#5f78bd]',
  }

  return <span className={`flex shrink-0 items-center justify-center rounded-[20px] border ${tones[tone] || tones.purple} ${size === 'large' ? 'h-14 w-14 text-[22px]' : 'h-11 w-11 text-[16px]'}`}><i className={icon} /></span>
}

function PaperCard({ children, className = '' }) {
  return <section className={`relative overflow-hidden rounded-[28px] border border-[#ddcfeb] bg-[var(--shadow-bg-surface)] shadow-[0_12px_30px_rgba(86,61,118,0.07)] ${className}`} style={paperGrid}>{children}</section>
}

function MiniStat({ label, value, tone, icon }) {
  const tones = {
    pink: 'border-[#efc9dc] bg-[#fff2f7]',
    purple: 'border-[#d7c8ee] bg-[#f7f2ff]',
  }

  return (
    <div className={`flex min-h-[92px] items-center gap-3 rounded-[22px] border p-3.5 ${tones[tone] || tones.purple}`}>
      <IconBubble icon={icon} tone={tone} />
      <div className="min-w-0">
        <div className="text-[11px] font-bold leading-4 text-[#846e9b]">{label}</div>
        <div className="mt-1 text-[20px] font-black tracking-[-0.03em] text-[#37156f] tabular-nums">{value}</div>
      </div>
    </div>
  )
}

export default function AuthorStoryPayoutStatusPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((current) => current + 1), [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
        if (!token) {
          navigate('/login', { replace: true })
          return
        }
        const response = await fetch(`${API_URL}/api/authors/me/story-payout-status`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store',
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok || !result.ok) throw new Error(result.message || t('authorStoryPayoutStatus.error'))
        if (!cancelled) setData(result)
      } catch (caught) {
        if (!cancelled && caught.name !== 'AbortError') setError(t('authorStoryPayoutStatus.error'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [navigate, t, version])

  const balance = data?.balance || {}
  const payment = data?.payment_method || {}
  const latest = data?.latest_payout
  const connected = Boolean(payment.connected)
  const status = data?.status || 'carry_forward'
  const statusKey = status === 'awaiting_receipt' ? 'awaitingReceipt' : status === 'scheduled' ? 'scheduled' : status === 'missing_payment_method' || status === 'needs_payment_details' ? 'missing' : status === 'ready' ? 'ready' : 'carry'
  const methodName = payment.bank_name || payment.display_name || payment.method_type || ''
  const paymentPath = '/author/payment-method?back=%2Fauthor%2Fpayout-status'
  const minimum = Math.max(10, Number(balance.minimum_payout_usd) || 10)
  const progress = Math.min(100, Math.round((Math.max(0, Number(balance.ready_usd) || 0) / minimum) * 100))
  const statusIcon = statusKey === 'ready' ? 'fa-solid fa-circle-check' : statusKey === 'scheduled' ? 'fa-solid fa-paper-plane' : statusKey === 'awaitingReceipt' ? 'fa-solid fa-receipt' : statusKey === 'missing' ? 'fa-solid fa-triangle-exclamation' : 'fa-regular fa-calendar'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbf8ff_0%,#f7f2fb_46%,#fbf8ff_100%)] pb-20">
      <header className="sticky top-0 z-30 border-b border-[#eadff1] bg-[#fffdfb]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('/author/income')} aria-label={t('authorStoryPayoutStatus.back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e3d5ed] bg-white text-[#7b59a7] shadow-[0_4px_12px_rgba(87,62,116,0.08)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[12px]" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-[18px] font-black tracking-[-0.03em] text-[#35166d]">{t('authorStoryPayoutStatus.title')} <span className="text-[#ef75a9]">♥</span></h1>
            <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-[0.08em] text-[#9b8cab]">{t('authorStoryPayoutStatus.subtitle')}</p>
          </div>
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e4d7ee] bg-white text-[#7650aa] shadow-[0_4px_12px_rgba(87,62,116,0.08)]"><i className="fa-solid fa-circle-info text-[14px]" /></span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[760px] gap-4 px-4 py-5">
        {loading ? <PageLoadingState label={t('authorStoryPayoutStatus.loading')} /> : null}
        {!loading && error ? <PageErrorState title={error} actionLabel={t('authorStoryPayoutStatus.retry')} onAction={refresh} /> : null}

        {!loading && !error && data ? (
          <>
            <PaperCard className="p-4 sm:p-5">
              <Tape className="-right-3 top-4 rotate-[8deg]" />
              <Sparkles className="absolute right-5 top-14 opacity-80" />
              <div className="absolute bottom-0 left-0 top-0 hidden w-7 sm:block" aria-hidden="true">
                <span className="absolute left-2 top-16 h-3 w-6 rounded-full border-2 border-[#d3a77a] bg-[#fff7ee]" />
                <span className="absolute left-2 top-[108px] h-3 w-6 rounded-full border-2 border-[#d3a77a] bg-[#fff7ee]" />
                <span className="absolute left-2 top-[152px] h-3 w-6 rounded-full border-2 border-[#d3a77a] bg-[#fff7ee]" />
                <span className="absolute left-2 top-[196px] h-3 w-6 rounded-full border-2 border-[#d3a77a] bg-[#fff7ee]" />
              </div>

              <div className="relative sm:pl-5">
                <div className="inline-flex rounded-[13px] border border-[#bba1e7] bg-[linear-gradient(90deg,#8e68cf_0%,#a679df_100%)] px-4 py-2 text-[12px] font-black text-white shadow-[0_6px_14px_rgba(111,77,161,0.18)]"><span className="mr-1.5 text-[#ffe38a]">★</span>{t('authorStoryPayoutStatus.unpaid')}</div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_210px] sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <IconBubble icon="fa-solid fa-gem" tone="blue" size="large" />
                      <div className="text-[42px] font-black leading-none tracking-[-0.05em] text-[#37156f] tabular-nums">{money(balance.unpaid_usd)}</div>
                    </div>
                    <p className="mt-4 max-w-[430px] text-[12px] font-semibold leading-6 text-[#6f5e84]">{t('authorStoryPayoutStatus.note')}</p>
                  </div>

                  <div className="relative flex min-h-[150px] items-center justify-center rounded-[26px] border border-dashed border-[#dac8ec] bg-[linear-gradient(145deg,#fff4fa_0%,#f0e8ff_100%)]">
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#e1d2ed] bg-white/80 text-[30px] text-[#8a63bd] shadow-sm"><i className="fa-solid fa-book-open" /></div>
                      <div className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#a18caf]">Artwork</div>
                    </div>
                    <span className="absolute left-4 top-4 text-[#ee8eb7]">♥</span><span className="absolute right-5 top-6 text-[#e7b04e]">★</span><span className="absolute bottom-4 right-7 text-[#9b78d2]">✦</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat label={t('authorStoryPayoutStatus.eligible')} value={money(balance.ready_usd)} tone="pink" icon="fa-solid fa-gem" />
                  <MiniStat label={t('authorStoryPayoutStatus.minimum')} value={money(minimum)} tone="purple" icon="fa-solid fa-crown" />
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full border border-[#e6d9ef] bg-[#f5eff9]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#ee8ab7_0%,#9b72d0_100%)] transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
              </div>
            </PaperCard>

            <PaperCard className="p-4 sm:p-5">
              <Tape className="-right-4 top-3 rotate-[8deg]" />
              <div className="flex items-start gap-3">
                <IconBubble icon={statusIcon} tone="purple" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#35166d]">{t(`authorStoryPayoutStatus.${statusKey}`)}</h2>
                  <p className="mt-1.5 text-[11.5px] font-semibold leading-6 text-[#746285]">{t(`authorStoryPayoutStatus.${statusKey}Body`)}</p>
                </div>
                <div aria-hidden="true" className="hidden h-16 w-20 shrink-0 items-center justify-center rounded-[24px] border border-dashed border-[#ddcdee] bg-[#f5edff] text-[24px] text-[#a27bd0] sm:flex"><i className="fa-solid fa-star" /></div>
              </div>
            </PaperCard>

            <PaperCard className="p-4 sm:p-5">
              <Tape className="-left-3 bottom-3 -rotate-[8deg]" />
              <div className="flex items-start gap-3">
                <IconBubble icon={connected ? 'fa-solid fa-wallet' : 'fa-solid fa-circle-exclamation'} tone="pink" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#35166d]">{t(`authorStoryPayoutStatus.${connected ? 'bankConnected' : 'bankMissing'}`)}</h2>
                      {connected ? <p className="mt-1 text-[14px] font-black text-[#35166d]">{methodName}</p> : null}
                    </div>
                    <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${connected ? 'bg-[#eee4ff] text-[#855db8]' : 'bg-[#fff0f4] text-[#dc688d]'}`}><i className={connected ? 'fa-solid fa-check' : 'fa-solid fa-exclamation'} /></span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[132px_1fr] sm:items-center">
                    <div className="flex min-h-[128px] items-center justify-center rounded-[22px] border border-[#e2d5ec] bg-[#fbf7ff] p-2">
                      {payment.qr_image_url ? <img src={payment.qr_image_url} alt="Bank QR" className="max-h-[112px] max-w-full rounded-[15px] object-contain" /> : <div className="text-center text-[#9474b8]"><i className="fa-solid fa-qrcode text-[38px]" /><div className="mt-2 text-[9px] font-black uppercase tracking-[0.08em]">QR</div></div>}
                    </div>
                    <div className="rounded-[22px] border border-dashed border-[#d8c5eb] bg-[#faf5ff] p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9a70d1] text-[11px] text-white"><i className="fa-solid fa-check" /></span>
                        <div>
                          <div className="text-[12px] font-black text-[#47217b]">{connected ? t('authorStoryPayoutStatus.bankConnected') : t('authorStoryPayoutStatus.bankMissing')}</div>
                          <p className="mt-1.5 text-[11px] font-semibold leading-5 text-[#79678c]">{t('authorStoryPayoutStatus.bankHelp')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={() => navigate(paymentPath)} className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#d9b7e9] bg-[linear-gradient(90deg,#fff1f8_0%,#f2e8ff_100%)] px-4 text-[12.5px] font-black text-[#6f45a3] shadow-[0_7px_18px_rgba(104,73,143,0.08)] transition active:scale-[0.99]">
                    <i className="fa-solid fa-credit-card text-[11px]" />
                    {t(`authorStoryPayoutStatus.${connected ? 'changeBank' : 'addBank'}`)}
                    <i className="fa-solid fa-chevron-right ml-auto text-[9px]" />
                  </button>
                </div>
              </div>
            </PaperCard>

            <PaperCard className="p-4 sm:p-5">
              <Tape className="-right-4 top-3 rotate-[7deg]" />
              <div className="flex items-start gap-3">
                <IconBubble icon="fa-solid fa-receipt" tone="purple" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#35166d]">{t('authorStoryPayoutStatus.latest')}</h2>
                  {latest ? (
                    <div className="mt-3 grid gap-2">
                      <div className="rounded-[18px] border border-[#e3d7ec] bg-[#faf7fd] px-3.5 py-3"><div className="text-[10px] font-bold text-[#8b789c]">{t('authorStoryPayoutStatus.month')}</div><div className="mt-1 text-[13px] font-black text-[#3c1d70]">{latest.payout_month}</div></div>
                      <div className="rounded-[18px] border border-[#efd0df] bg-[#fff5f9] px-3.5 py-3"><div className="text-[10px] font-bold text-[#8b789c]">{t('authorStoryPayoutStatus.amount')}</div><div className="mt-1 text-[20px] font-black text-[#3c1d70] tabular-nums">{money(latest.net_payout_usd)}</div></div>
                      <p className="text-[10.5px] font-bold leading-5 text-[#806b91]">{t(`authorStoryPayoutStatus.${latest.status === 'paid' ? 'paid' : latest.status === 'awaiting_receipt' ? 'awaitingReceipt' : latest.status === 'scheduled' ? 'scheduled' : latest.status === 'missing_payment_method' ? 'missing' : 'pending'}`)}</p>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between gap-4 rounded-[22px] border border-dashed border-[#dfd0eb] bg-[#fbf7ff] p-4">
                      <p className="text-[11.5px] font-semibold leading-5 text-[#77658a]">{t('authorStoryPayoutStatus.noPayout')}</p>
                      <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#f1e8ff] text-[22px] text-[#956dc6]"><i className="fa-regular fa-calendar" /></div>
                    </div>
                  )}
                </div>
              </div>
            </PaperCard>
          </>
        ) : null}
      </main>
    </div>
  )
}
