import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell, PageHeader, SurfaceCard, PageLoadingState, PageErrorState } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoryPayoutStatus', {
  en: { title: 'Payout Status', back: 'Back', subtitle: 'Earnings from paid story unlocks only', loading: 'Loading payout status...', error: 'Could not load payout status.', retry: 'Try again', unpaid: 'Unpaid story earnings', eligible: 'Eligible for payout', minimum: 'Minimum payout', carry: 'Carry forward', carryBody: 'Your earnings stay in your balance and carry into future months until eligible earnings reach $10.', ready: 'Ready for payout', readyBody: 'Your eligible balance has reached the minimum. Shadow handles the transfer manually; no withdrawal request is needed.', scheduled: 'Pending transfer', scheduledBody: 'Your payout is queued for manual transfer by Shadow.', missing: 'Bank details needed', missingBody: 'Please add your payment details so Shadow can process a payout when it is ready.', paid: 'Paid', paidBody: 'This payout has been recorded as paid.', bankConnected: 'Payment details added', bankMissing: 'No payment details', bankHelp: 'Saving payment details does not verify your bank account.', addBank: 'Add Bank / Bank QR', changeBank: 'Change payment details', latest: 'Latest payout', month: 'Month', amount: 'Amount', noPayout: 'No payout has been created yet.', note: 'Diamond gifts and Author Store earnings are not included in this balance.', refresh: 'Refresh', pending: 'Not yet eligible', unavailable: 'No earnings yet' },
  km: { title: 'ស្ថានភាពទទួលប្រាក់', back: 'ត្រឡប់ក្រោយ', subtitle: 'ចំណូលពីការដោះសោរឿងដោយ Diamond ប៉ុណ្ណោះ', loading: 'កំពុងផ្ទុកស្ថានភាព...', error: 'មិនអាចផ្ទុកស្ថានភាពទទួលប្រាក់បានទេ។', retry: 'សាកម្ដងទៀត', unpaid: 'ចំណូលរឿងមិនទាន់បើក', eligible: 'ប្រាក់គ្រប់លក្ខខណ្ឌ', minimum: 'កម្រិតទទួលប្រាក់', carry: 'បូកបន្តទៅខែបន្ទាប់', carryBody: 'ប្រាក់របស់អ្នកនឹងរក្សាទុក និងបូកបន្តទៅខែក្រោយ រហូតដល់ចំណូលដែលគ្រប់លក្ខខណ្ឌមាន $10។', ready: 'ត្រៀមទទួលប្រាក់', readyBody: 'ប្រាក់របស់អ្នកគ្រប់កម្រិតហើយ។ Shadow នឹងផ្ទេរប្រាក់ដោយផ្ទាល់ មិនចាំបាច់ស្នើដកប្រាក់ទេ។', scheduled: 'កំពុងរង់ចាំផ្ទេរប្រាក់', scheduledBody: 'ប្រាក់របស់អ្នកកំពុងរង់ចាំ Shadow ផ្ទេរដោយផ្ទាល់។', missing: 'ត្រូវបន្ថែមព័ត៌មានធនាគារ', missingBody: 'សូមបន្ថែមព័ត៌មានទទួលប្រាក់ ដើម្បីឱ្យ Shadow អាចដំណើរការពេលប្រាក់គ្រប់លក្ខខណ្ឌ។', paid: 'បានបើកប្រាក់', paidBody: 'ការបើកប្រាក់នេះត្រូវបានកត់ត្រាថាបានបង់រួច។', bankConnected: 'បានបន្ថែមព័ត៌មានទទួលប្រាក់', bankMissing: 'មិនទាន់មានព័ត៌មានទទួលប្រាក់', bankHelp: 'ការរក្សាទុកព័ត៌មានមិនមានន័យថាធនាគារបានផ្ទៀងផ្ទាត់រួចទេ។', addBank: 'បន្ថែមធនាគារ / Bank QR', changeBank: 'កែព័ត៌មានទទួលប្រាក់', latest: 'ការបើកប្រាក់ចុងក្រោយ', month: 'ខែ', amount: 'ចំនួនទឹកប្រាក់', noPayout: 'មិនទាន់មានការបង្កើត Payout ទេ។', note: 'សមតុល្យនេះមិនរាប់បញ្ចូលកាដូ Diamond និងចំណូល Author Store ទេ។', refresh: 'ផ្ទុកឡើងវិញ', pending: 'មិនទាន់គ្រប់លក្ខខណ្ឌ', unavailable: 'មិនទាន់មានចំណូល' },
  zh: { title: '付款状态', back: '返回', subtitle: '仅包含付费故事解锁收入', loading: '正在加载付款状态...', error: '无法加载付款状态。', retry: '重试', unpaid: '未支付的故事收入', eligible: '符合付款条件的金额', minimum: '最低付款金额', carry: '结转至下月', carryBody: '收入将保留并结转，直到符合条件的金额达到 $10。', ready: '可以付款', readyBody: '金额已达到最低标准。Shadow 将手动转账，无需申请提现。', scheduled: '等待转账', scheduledBody: 'Shadow 正在安排手动转账。', missing: '需要收款信息', missingBody: '请添加收款信息，以便达到条件后处理付款。', paid: '已付款', paidBody: '这笔付款已记录为支付完成。', bankConnected: '已添加收款信息', bankMissing: '尚无收款信息', bankHelp: '保存收款信息不代表银行已验证。', addBank: '添加银行 / 银行二维码', changeBank: '更改收款信息', latest: '最近一次付款', month: '月份', amount: '金额', noPayout: '尚未生成付款记录。', note: '此余额不含 Diamond 礼物和 Author Store 收入。', refresh: '刷新', pending: '尚未达到条件', unavailable: '暂无收入' },
  ja: { title: '支払い状況', back: '戻る', subtitle: '有料ストーリー解放の収益のみ', loading: '支払い状況を読み込み中...', error: '支払い状況を読み込めませんでした。', retry: '再試行', unpaid: '未払いのストーリー収益', eligible: '支払い対象額', minimum: '最低支払い額', carry: '翌月へ繰り越し', carryBody: '支払い対象額が $10 に達するまで、収益は翌月以降へ繰り越されます。', ready: '支払い準備完了', readyBody: '最低金額に達しました。Shadow が手動で送金します。出金申請は不要です。', scheduled: '送金待ち', scheduledBody: 'Shadow による手動送金を待っています。', missing: '振込先情報が必要です', missingBody: '支払いのために振込先情報を登録してください。', paid: '支払い済み', paidBody: 'この支払いは完了として記録されています。', bankConnected: '振込先情報を登録済み', bankMissing: '振込先情報がありません', bankHelp: '情報の登録は銀行による確認を意味しません。', addBank: '銀行 / 銀行QRを登録', changeBank: '振込先情報を変更', latest: '直近の支払い', month: '月', amount: '金額', noPayout: '支払い記録はまだありません。', note: 'Diamond ギフトと Author Store の収益はこの残高に含まれません。', refresh: '更新', pending: 'まだ支払い対象外', unavailable: '収益はまだありません' },
  ko: { title: '지급 상태', back: '뒤로', subtitle: '유료 스토리 잠금 해제 수익만 포함', loading: '지급 상태를 불러오는 중...', error: '지급 상태를 불러올 수 없습니다.', retry: '다시 시도', unpaid: '미지급 스토리 수익', eligible: '지급 대상 금액', minimum: '최소 지급 금액', carry: '다음 달로 이월', carryBody: '지급 대상 수익이 $10에 도달할 때까지 다음 달로 이월됩니다.', ready: '지급 준비 완료', readyBody: '최소 금액에 도달했습니다. Shadow가 수동으로 송금하므로 출금 신청은 필요하지 않습니다.', scheduled: '송금 대기', scheduledBody: 'Shadow의 수동 송금을 기다리고 있습니다.', missing: '계좌 정보 필요', missingBody: '지급을 위해 수령 정보를 등록해 주세요.', paid: '지급 완료', paidBody: '이 지급은 완료로 기록되었습니다.', bankConnected: '수령 정보 등록됨', bankMissing: '수령 정보 없음', bankHelp: '정보 등록은 은행의 인증을 의미하지 않습니다.', addBank: '은행 / 은행 QR 등록', changeBank: '수령 정보 변경', latest: '최근 지급 내역', month: '월', amount: '금액', noPayout: '생성된 지급 내역이 없습니다.', note: 'Diamond 선물 및 Author Store 수익은 이 잔액에 포함되지 않습니다.', refresh: '새로고침', pending: '아직 지급 대상 아님', unavailable: '아직 수익 없음' },
})

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const money = (value) => `$${Math.max(0, Number(value) || 0).toFixed(2)}`

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
    return () => { cancelled = true; controller.abort() }
  }, [navigate, t, version])

  const balance = data?.balance || {}
  const payment = data?.payment_method || {}
  const latest = data?.latest_payout
  const connected = Boolean(payment.connected)
  const status = data?.status || 'carry_forward'
  const statusKey = status === 'scheduled' ? 'scheduled' : status === 'missing_payment_method' || status === 'needs_payment_details' ? 'missing' : status === 'ready' ? 'ready' : 'carry'
  const methodName = payment.bank_name || payment.display_name || payment.method_type || ''
  const paymentPath = '/author/payment-method?back=%2Fauthor%2Fpayout-status'
  const minimum = Math.max(10, Number(balance.minimum_payout_usd) || 10)
  const progress = Math.min(100, Math.round((Math.max(0, Number(balance.ready_usd) || 0) / minimum) * 100))

  return (
    <PageShell className="pb-20">
      <PageHeader title={t('authorStoryPayoutStatus.title')} subtitle={t('authorStoryPayoutStatus.subtitle')} onBack={() => navigate('/author/income')} backLabel={t('authorStoryPayoutStatus.back')} right={<button type="button" onClick={refresh} className="app-muted rounded-full px-3 py-2 text-xs font-bold">{t('authorStoryPayoutStatus.refresh')}</button>} />
      <main className="mx-auto grid max-w-[760px] gap-4 px-4 py-5">
        {loading ? <PageLoadingState label={t('authorStoryPayoutStatus.loading')} /> : null}
        {!loading && error ? <PageErrorState title={error} actionLabel={t('authorStoryPayoutStatus.retry')} onAction={refresh} /> : null}
        {!loading && !error && data ? <>
          <SurfaceCard className="space-y-4 p-5">
            <div className="flex items-center gap-3"><span className="app-elevated flex h-11 w-11 items-center justify-center rounded-full text-xl" aria-hidden="true">💎</span><div><div className="app-muted text-xs font-semibold">{t('authorStoryPayoutStatus.unpaid')}</div><div className="app-title text-3xl font-black tabular-nums">{money(balance.unpaid_usd)}</div></div></div>
            <div className="grid grid-cols-2 gap-3"><div className="app-soft rounded-2xl p-3"><div className="app-muted text-[11px]">{t('authorStoryPayoutStatus.eligible')}</div><div className="app-title mt-1 text-lg font-bold tabular-nums">{money(balance.ready_usd)}</div></div><div className="app-soft rounded-2xl p-3"><div className="app-muted text-[11px]">{t('authorStoryPayoutStatus.minimum')}</div><div className="app-title mt-1 text-lg font-bold tabular-nums">{money(minimum)}</div></div></div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]"><div className="h-full rounded-full bg-purple-500" style={{ width: `${progress}%` }} /></div>
            <p className="app-muted text-xs leading-5">{t('authorStoryPayoutStatus.note')}</p>
          </SurfaceCard>
          <SurfaceCard className="space-y-2 p-5"><h2 className="app-title text-base font-black">{t(`authorStoryPayoutStatus.${statusKey}`)}</h2><p className="app-muted text-xs leading-6">{t(`authorStoryPayoutStatus.${statusKey}Body`)}</p></SurfaceCard>
          <SurfaceCard className="space-y-3 p-5"><div className="flex items-center justify-between gap-3"><h2 className="app-title text-base font-black">{t(`authorStoryPayoutStatus.${connected ? 'bankConnected' : 'bankMissing'}`)}</h2><span className="text-xl" aria-hidden="true">{connected ? '✓' : '⌁'}</span></div>{connected ? <p className="app-title text-sm font-semibold">{methodName}</p> : null}{payment.qr_image_url ? <img src={payment.qr_image_url} alt="Bank QR" className="max-h-32 max-w-32 rounded-xl object-contain" /> : null}<p className="app-muted text-xs leading-5">{t('authorStoryPayoutStatus.bankHelp')}</p><button type="button" onClick={() => navigate(paymentPath)} className="w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-black text-white">{t(`authorStoryPayoutStatus.${connected ? 'changeBank' : 'addBank'}`)}</button></SurfaceCard>
          <SurfaceCard className="space-y-2 p-5"><h2 className="app-title text-base font-black">{t('authorStoryPayoutStatus.latest')}</h2>{latest ? <><p className="app-muted text-xs">{t('authorStoryPayoutStatus.month')}: {latest.payout_month}</p><p className="app-title text-xl font-black tabular-nums">{t('authorStoryPayoutStatus.amount')}: {money(latest.net_payout_usd)}</p><p className="app-muted text-xs">{t(`authorStoryPayoutStatus.${latest.status === 'paid' ? 'paid' : latest.status === 'scheduled' ? 'scheduled' : latest.status === 'missing_payment_method' ? 'missing' : 'pending'}`)}</p></> : <p className="app-muted text-xs">{t('authorStoryPayoutStatus.noPayout')}</p>}</SurfaceCard>
        </> : null}
      </main>
    </PageShell>
  )
}
