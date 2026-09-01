import { useEffect, useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('giftPopup', {
  "en": {
    "candy": "Candy",
    "flower": "Flower",
    "coffee": "Coffee",
    "magicPen": "Magic Pen",
    "goldBook": "Gold Book",
    "shadowStar": "Shadow Star",
    "authorCrown": "Author Crown",
    "rocket": "Rocket",
    "failedWallet": "Failed to load wallet.",
    "loginFirst": "Please log in before sending a gift.",
    "storyMissing": "Story information is missing.",
    "failedSend": "Failed to send gift.",
    "sentSupport": "{{gift}} sent · +{{points}} support points",
    "sendGift": "Send a Gift",
    "supportDesc": "Your support gives the author more motivation to keep writing.",
    "monthlyGifts": "Monthly Gifts -",
    "topFans": "Top Fans",
    "sending": "Sending...",
    "gift": "Gift"
  },
  "km": {
    "candy": "ស្ករគ្រាប់",
    "flower": "ផ្កា",
    "coffee": "កាហ្វេ",
    "magicPen": "ប៊ិចវេទមន្ត",
    "goldBook": "សៀវភៅមាស",
    "shadowStar": "ផ្កាយ Shadow",
    "authorCrown": "មកុដអ្នកនិពន្ធ",
    "rocket": "រ៉ុក្កែត",
    "failedWallet": "មិនអាចផ្ទុកកាបូបបានទេ។",
    "loginFirst": "សូមចូលគណនីមុនពេលផ្ញើអំណោយ។",
    "storyMissing": "មិនមានព័ត៌មានរឿង។",
    "failedSend": "មិនអាចផ្ញើអំណោយបានទេ។",
    "sentSupport": "បានផ្ញើ {{gift}} · +{{points}} ពិន្ទុគាំទ្រ",
    "sendGift": "ផ្ញើអំណោយ",
    "supportDesc": "ការគាំទ្ររបស់អ្នកជួយលើកទឹកចិត្តអ្នកនិពន្ធឱ្យបន្តសរសេរ។",
    "monthlyGifts": "អំណោយប្រចាំខែ -",
    "topFans": "អ្នកគាំទ្រកំពូល",
    "sending": "កំពុងផ្ញើ...",
    "gift": "ផ្ញើ"
  },
  "zh": {
    "candy": "糖果",
    "flower": "鲜花",
    "coffee": "咖啡",
    "magicPen": "魔法笔",
    "goldBook": "金书",
    "shadowStar": "Shadow 星星",
    "authorCrown": "作者皇冠",
    "rocket": "火箭",
    "failedWallet": "无法加载钱包。",
    "loginFirst": "发送礼物前请先登录。",
    "storyMissing": "缺少故事信息。",
    "failedSend": "无法发送礼物。",
    "sentSupport": "已发送 {{gift}} · +{{points}} 支持点",
    "sendGift": "发送礼物",
    "supportDesc": "你的支持会给作者更多继续创作的动力。",
    "monthlyGifts": "本月礼物 -",
    "topFans": "顶级粉丝",
    "sending": "发送中...",
    "gift": "赠送"
  },
  "ja": {
    "candy": "キャンディ",
    "flower": "花",
    "coffee": "コーヒー",
    "magicPen": "魔法のペン",
    "goldBook": "ゴールドブック",
    "shadowStar": "Shadow スター",
    "authorCrown": "作者クラウン",
    "rocket": "ロケット",
    "failedWallet": "ウォレットを読み込めませんでした。",
    "loginFirst": "ギフトを送る前にログインしてください。",
    "storyMissing": "作品情報がありません。",
    "failedSend": "ギフトを送信できませんでした。",
    "sentSupport": "{{gift}}を送信 · +{{points}} サポートポイント",
    "sendGift": "ギフトを送る",
    "supportDesc": "あなたの応援が作者の執筆の励みになります。",
    "monthlyGifts": "今月のギフト -",
    "topFans": "トップファン",
    "sending": "送信中...",
    "gift": "送る"
  },
  "ko": {
    "candy": "캔디",
    "flower": "꽃",
    "coffee": "커피",
    "magicPen": "마법 펜",
    "goldBook": "골드 북",
    "shadowStar": "Shadow 스타",
    "authorCrown": "작가 왕관",
    "rocket": "로켓",
    "failedWallet": "지갑을 불러오지 못했습니다.",
    "loginFirst": "선물을 보내기 전에 로그인하세요.",
    "storyMissing": "스토리 정보가 없습니다.",
    "failedSend": "선물을 보내지 못했습니다.",
    "sentSupport": "{{gift}} 전송 · +{{points}} 응원 포인트",
    "sendGift": "선물 보내기",
    "supportDesc": "여러분의 응원이 작가가 계속 글을 쓰는 힘이 됩니다.",
    "monthlyGifts": "이번 달 선물 -",
    "topFans": "톱 팬",
    "sending": "보내는 중...",
    "gift": "선물"
  }
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const GIFT_ITEMS = [
  { key: 'candy', nameKey: 'candy', currency: 'coin', price: 10, points: 1, image: '/assets/Gift/Candy.png' },
  { key: 'flower', nameKey: 'flower', currency: 'coin', price: 100, points: 3, image: '/assets/Gift/Flower.png' },
  { key: 'coffee', nameKey: 'coffee', currency: 'diamond', price: 1, points: 5, image: '/assets/Gift/Coffee.png' },
  { key: 'magic_pen', nameKey: 'magicPen', currency: 'diamond', price: 3, points: 10, image: '/assets/Gift/Magic Pen.png' },
  { key: 'gold_book', nameKey: 'goldBook', currency: 'diamond', price: 10, points: 20, image: '/assets/Gift/Gold Book.png' },
  { key: 'star', nameKey: 'shadowStar', currency: 'diamond', price: 30, points: 35, image: '/assets/Gift/Star.png' },
  { key: 'crown', nameKey: 'authorCrown', currency: 'diamond', price: 100, points: 60, image: '/assets/Gift/Crown.png' },
  { key: 'rocket', nameKey: 'rocket', currency: 'diamond', price: 300, points: 100, image: '/assets/Gift/Rocket.png' },
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId() || 'en')
}

export default function GiftPopup({
  open,
  storyId,
  onClose,
  onOpenGuide,
  onOpenTopFans,
  onGiftSent,
}) {
  const { t } = useDisplayTranslation()
  const [selectedKey, setSelectedKey] = useState('candy')
  const [quantity, setQuantity] = useState(1)
  const [wallet, setWallet] = useState({ coin_balance: 0, diamond_balance: 0 })
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const dragStartYRef = useRef(null)
  const dragLastYRef = useRef(0)
  const dragStartedAtRef = useRef(0)
  const closeTimerRef = useRef(null)

  const selectedGift = GIFT_ITEMS.find((item) => item.key === selectedKey) || GIFT_ITEMS[0]

  useEffect(() => {
    if (!open) {
      setDragOffset(0)
      setDragging(false)
      dragStartYRef.current = null
      return undefined
    }

    const scrollY = window.scrollY
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width
    const previousOverflow = document.body.style.overflow

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }

      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      document.body.style.overflow = previousOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    let ignore = false

    async function loadWallet() {
      const token = getReaderToken()
      setFeedback('')

      if (!token) {
        setWallet({ coin_balance: 0, diamond_balance: 0 })
        return
      }

      setLoadingWallet(true)

      try {
        const response = await fetch(`${API_BASE_URL}/api/purchase/wallet`, {
          headers: readerAuthHeaders(),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('giftPopup.failedWallet'))
        }

        if (!ignore) {
          setWallet({
            coin_balance: Number(data.wallet?.coin_balance ?? data.wallet?.gem_balance ?? 0),
            diamond_balance: Number(data.wallet?.diamond_balance || 0),
          })
        }
      } catch (error) {
        if (!ignore) setFeedback(error.message || t('giftPopup.failedWallet'))
      } finally {
        if (!ignore) setLoadingWallet(false)
      }
    }

    loadWallet()

    return () => {
      ignore = true
    }
  }, [open])

  const beginDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target.closest('button, a, input, select, textarea')) return

    dragStartYRef.current = event.clientY
    dragLastYRef.current = event.clientY
    dragStartedAtRef.current = performance.now()
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    if (dragStartYRef.current === null) return

    const distance = Math.max(0, event.clientY - dragStartYRef.current)
    dragLastYRef.current = event.clientY
    setDragOffset(Math.min(distance, window.innerHeight))
  }

  const finishDrag = (event) => {
    if (dragStartYRef.current === null) return

    const endY = Number.isFinite(event?.clientY) ? event.clientY : dragLastYRef.current
    const distance = Math.max(0, endY - dragStartYRef.current)
    const elapsed = Math.max(1, performance.now() - dragStartedAtRef.current)
    const velocity = distance / elapsed
    const shouldClose = distance >= 95 || velocity >= 0.65

    dragStartYRef.current = null
    dragLastYRef.current = 0
    dragStartedAtRef.current = 0
    setDragging(false)

    if (shouldClose) {
      setDragOffset(window.innerHeight)
      closeTimerRef.current = window.setTimeout(() => {
        setDragOffset(0)
        onClose?.()
      }, 180)
      return
    }

    setDragOffset(0)
  }

  const cancelDrag = () => {
    dragStartYRef.current = null
    dragLastYRef.current = 0
    dragStartedAtRef.current = 0
    setDragging(false)
    setDragOffset(0)
  }

  const handleSendGift = async () => {
    if (sending) return

    if (!getReaderToken()) {
      setFeedback(t('giftPopup.loginFirst'))
      return
    }

    if (!storyId || String(storyId) === 'undefined' || String(storyId) === 'null') {
      setFeedback(t('giftPopup.storyMissing'))
      return
    }

    setSending(true)
    setFeedback('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/gifts/stories/${storyId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...readerAuthHeaders(),
        },
        body: JSON.stringify({
          gift_key: selectedGift.key,
          quantity,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('giftPopup.failedSend'))
      }

      setWallet({
        coin_balance: Number(data.wallet?.coin_balance ?? data.wallet?.gem_balance ?? 0),
        diamond_balance: Number(data.wallet?.diamond_balance || 0),
      })

      const points = Number(data.gift?.support_points || selectedGift.points * quantity)
      setFeedback(t('giftPopup.sentSupport', { gift: t(`giftPopup.${selectedGift.nameKey}`), points: formatNumber(points) }))
      onGiftSent?.(data)
    } catch (error) {
      setFeedback(error.message || t('giftPopup.failedSend'))
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[190] flex items-end justify-center bg-black/45 sm:items-center">
      <button
        type="button"
        aria-label="Close gift popup"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section
        className="relative w-full max-w-[480px] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-2xl will-change-transform sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <div
          className="cursor-grab select-none px-4 pb-3 pt-4 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
          onPointerCancel={cancelDrag}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[18px] font-bold text-[var(--shadow-text-primary)]">{t('giftPopup.sendGift')}</h2>
              <p className="mt-0.5 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
                {t('giftPopup.supportDesc')}
              </p>
            </div>

            <button
              type="button"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[11px] font-bold text-white active:scale-95"
              onClick={onOpenGuide}
              aria-label="Gift guide"
            >
              ?
            </button>
          </div>
        </div>

        <div className="mx-4 rounded-[10px] bg-[#fff1f5] px-3 py-3 dark:bg-[#ff3b5f]/10">
          <div className="flex items-center justify-between text-[13px] font-normal text-[var(--shadow-text-tertiary)]">
            <span>{t('giftPopup.monthlyGifts')}</span>

            <button
              type="button"
              onClick={onOpenTopFans}
              className="flex items-center gap-1 active:scale-95"
            >
              <span>{t('giftPopup.topFans')}</span>
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 px-4 py-4">
          {GIFT_ITEMS.map((gift) => {
            const active = selectedKey === gift.key
            const icon = gift.currency === 'coin'
              ? '/assets/Icons/Shadow Coin.svg'
              : '/assets/Icons/Diamond.svg'

            return (
              <button
                key={gift.key}
                type="button"
                onClick={() => {
                  setSelectedKey(gift.key)
                  setFeedback('')
                }}
                className={`rounded-[18px] border px-2 py-3 text-center active:scale-95 ${
                  active ? 'border-[#ff3b5f] bg-[#fff1f5] dark:bg-[#ff3b5f]/10' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]'
                }`}
              >
                <img src={gift.image} alt="" className="mx-auto h-14 w-14 object-contain" />
                <span className="mt-1 block truncate text-[11px] font-normal text-[var(--shadow-text-primary)]">
                  {t(`giftPopup.${gift.nameKey}`)}
                </span>
                <span className="mt-1 flex items-center justify-center gap-1 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                  <img src={icon} alt="" className="h-3.5 w-3.5 object-contain" />
                  {formatNumber(gift.price)}
                </span>
              </button>
            )
          })}
        </div>

        {feedback ? (
          <div className="px-4 pb-1 text-center text-[11px] font-medium text-[var(--shadow-text-secondary)]">
            {feedback}
          </div>
        ) : null}

        <div className="flex items-center gap-3 px-4 pb-3 pt-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              <img src="/assets/Icons/Shadow Coin.svg" alt="" className="h-4 w-4 object-contain" />
              {loadingWallet ? '...' : formatNumber(wallet.coin_balance)}
            </span>

            <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              <img src="/assets/Icons/Diamond.svg" alt="" className="h-4 w-4 object-contain" />
              {loadingWallet ? '...' : formatNumber(wallet.diamond_balance)}
            </span>
          </div>

          <div className="flex h-9 shrink-0 -translate-y-1.5 overflow-hidden rounded-full border border-[#ffb3c0] bg-[var(--shadow-bg-surface)]">
            <div className="relative h-9 w-[64px] shrink-0 bg-[var(--shadow-bg-surface)]">
              <select
                value={quantity}
                onChange={(event) => {
                  setQuantity(Number(event.target.value))
                  setFeedback('')
                }}
                className="h-9 w-full appearance-none border-0 bg-transparent pl-5 pr-7 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none"
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>

              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[var(--shadow-text-tertiary)]" />
            </div>

            <button
              type="button"
              onClick={handleSendGift}
              disabled={sending || loadingWallet}
              className="h-9 bg-[#ff3b5f] px-5 text-[12px] font-bold text-white active:scale-95 disabled:bg-[#ff9aaa]"
            >
              {sending ? t('giftPopup.sending') : t('giftPopup.gift')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
