import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('dailyGiftRewardPopup', {
  en: {
    surpriseGot: 'Surprise! You’ve got',
    voucher: 'Voucher',
    openedGift: 'Opened Gift',
    claim: 'Claim',
  },
  km: {
    surpriseGot: 'ភ្ញាក់ផ្អើល! អ្នកទទួលបាន',
    voucher: 'Voucher',
    openedGift: 'អំណោយដែលបានបើក',
    claim: 'ទទួល',
  },
  zh: {
    surpriseGot: '惊喜！你获得了',
    voucher: 'Voucher',
    openedGift: '已打开的礼物',
    claim: '领取',
  },
  ja: {
    surpriseGot: 'サプライズ！獲得しました',
    voucher: 'Voucher',
    openedGift: '開いたギフト',
    claim: '受け取る',
  },
  ko: {
    surpriseGot: '서프라이즈! 획득했습니다',
    voucher: 'Voucher',
    openedGift: '열린 선물',
    claim: '받기',
  },
})

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function CoinIcon({ className = 'h-5 w-5' }) {
  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt="Shadow Coin"
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

export default function DailyGiftRewardPopup({ reward, onClose }) {
  const { t } = useDisplayTranslation()

  if (!reward) return null

  const coins = Number(reward.coins ?? reward.gems ?? 0)
  const vouchers = Number(reward.vouchers || 0)

  return (
    <div className="fixed inset-0 z-[100001] flex flex-col items-center justify-center bg-black/65 px-6">
      <style>{`
        @keyframes dailyGiftRewardPop {
          0% { transform: scale(.45); opacity: 0; }
          62% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes dailyGiftOpen {
          0% { transform: scale(.55) translateY(18px); opacity: 0; }
          65% { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes dailyGiftGlow {
          0%, 100% { transform: scale(.9); opacity: .55; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes dailyGiftCoinOne {
          0% { transform: translate(0, 22px) scale(.45) rotate(0deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-36px, -58px) scale(1.05) rotate(-28deg); opacity: 0; }
        }

        @keyframes dailyGiftCoinTwo {
          0% { transform: translate(0, 20px) scale(.45) rotate(0deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(38px, -62px) scale(1.05) rotate(30deg); opacity: 0; }
        }

        @keyframes dailyGiftFirework {
          0% { transform: scale(.2); opacity: 0; }
          28% { opacity: 1; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        .dailyGiftRewardPop {
          animation: dailyGiftRewardPop .7s cubic-bezier(.22,1,.36,1) both;
        }

        .dailyGiftOpen {
          animation: dailyGiftOpen .85s cubic-bezier(.22,1,.36,1) both;
        }

        .dailyGiftGlow {
          animation: dailyGiftGlow 1.7s ease-in-out infinite;
        }

        .dailyGiftCoinOne {
          animation: dailyGiftCoinOne 1.35s ease-out infinite;
        }

        .dailyGiftCoinTwo {
          animation: dailyGiftCoinTwo 1.35s ease-out .15s infinite;
        }

        .dailyGiftFirework {
          position: absolute;
          width: 92px;
          height: 92px;
          border-radius: 999px;
          background:
            repeating-conic-gradient(
              rgba(255,220,70,.95) 0deg 4deg,
              transparent 4deg 18deg
            );
          filter: drop-shadow(0 0 12px rgba(255,205,55,.8));
          mix-blend-mode: screen;
          animation: dailyGiftFirework 2.8s ease-out both;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="dailyGiftFirework left-[10%] top-[17%]" />
        <span
          className="dailyGiftFirework right-[10%] top-[18%]"
          style={{ animationDelay: '.35s' }}
        />
        <span
          className="dailyGiftFirework left-1/2 top-[10%]"
          style={{ animationDelay: '.65s' }}
        />

        <CoinIcon className="dailyGiftCoinOne absolute left-[18%] top-[30%] h-9 w-9" />
        <CoinIcon className="dailyGiftCoinTwo absolute right-[19%] top-[29%] h-8 w-8" />

        <span className="absolute left-[16%] top-[38%] h-2 w-2 animate-ping rounded-full bg-[#F6B800]" />
        <span className="absolute right-[18%] top-[42%] h-2 w-2 animate-ping rounded-full bg-white" />
        <span className="absolute left-[35%] top-[24%] h-1.5 w-1.5 animate-pulse rounded-full bg-[#fff1a8]" />
        <span className="absolute right-[35%] bottom-[28%] h-1.5 w-1.5 animate-pulse rounded-full bg-[#fff1a8]" />
        <span className="absolute left-[22%] bottom-[34%] h-2 w-2 animate-bounce rounded-full bg-[#ff3f62]" />
        <span className="absolute right-[23%] bottom-[35%] h-2 w-2 animate-bounce rounded-full bg-[#F6B800]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center text-center">
        <h3 className="text-[25px] font-black leading-8 text-[#ffcc32] drop-shadow-[0_3px_0_rgba(108,65,0,0.35)]">
          {t('dailyGiftRewardPopup.surpriseGot')}
        </h3>

        <div className="dailyGiftRewardPop mt-3 flex items-center justify-center gap-5">
          <div className="flex items-center gap-2">
            <CoinIcon className="h-10 w-10" />
            <span className="text-[28px] font-bold leading-none text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
              +{formatNumber(coins)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src="/assets/Icons/Voucher.svg"
              alt={t('dailyGiftRewardPopup.voucher')}
              className="h-[46px] w-[64px] object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
            />
            <span className="text-[28px] font-bold leading-none text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
              +{formatNumber(vouchers)}
            </span>
          </div>
        </div>

        <div className="relative mt-5 flex h-[245px] w-full items-center justify-center">
          <span className="dailyGiftGlow absolute h-[220px] w-[220px] rounded-full bg-[#ffbd28]/35 blur-3xl" />
          <span className="absolute h-[270px] w-[270px] rounded-full bg-[radial-gradient(circle,rgba(255,230,115,0.35)_0%,rgba(255,184,0,0.12)_42%,rgba(255,184,0,0)_70%)]" />

          <img
            src="/assets/Task%20Center/gift-open.png?v=1"
            alt={t('dailyGiftRewardPopup.openedGift')}
            className="dailyGiftOpen relative z-10 h-[230px] w-[300px] object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.38)]"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 flex h-12 w-[260px] items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_12px_26px_rgba(255,63,98,0.34)] active:scale-[0.98]"
        >
          {t('dailyGiftRewardPopup.claim')}
        </button>
      </div>
    </div>
  )
}
