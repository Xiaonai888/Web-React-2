import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorPagePhotoViewer', {
  en: {
    close: 'Close photo',
    options: 'Photo options',
    position: '1 of 1',
    cover: 'Cover photo',
    profile: 'Profile photo',
    share: 'Share',
    copyLink: 'Copy photo link',
    openOriginal: 'Open original photo',
    linkCopied: 'Link copied',
    shareFailed: 'Unable to share photo',
    copyFailed: 'Unable to copy link',
  },
  km: {
    close: 'បិទរូបភាព',
    options: 'ជម្រើសរូបភាព',
    position: '១ ក្នុង ១',
    cover: 'រូប Cover',
    profile: 'រូប Profile',
    share: 'ចែករំលែក',
    copyLink: 'ចម្លងតំណរូបភាព',
    openOriginal: 'បើករូបដើម',
    linkCopied: 'បានចម្លងតំណ',
    shareFailed: 'មិនអាចចែករំលែករូបបានទេ',
    copyFailed: 'មិនអាចចម្លងតំណបានទេ',
  },
  zh: {
    close: '关闭照片',
    options: '照片选项',
    position: '1 / 1',
    cover: '封面照片',
    profile: '头像',
    share: '分享',
    copyLink: '复制照片链接',
    openOriginal: '打开原始照片',
    linkCopied: '链接已复制',
    shareFailed: '无法分享照片',
    copyFailed: '无法复制链接',
  },
  ja: {
    close: '写真を閉じる',
    options: '写真のオプション',
    position: '1 / 1',
    cover: 'カバー写真',
    profile: 'プロフィール写真',
    share: '共有',
    copyLink: '写真のリンクをコピー',
    openOriginal: '元の写真を開く',
    linkCopied: 'リンクをコピーしました',
    shareFailed: '写真を共有できません',
    copyFailed: 'リンクをコピーできません',
  },
  ko: {
    close: '사진 닫기',
    options: '사진 옵션',
    position: '1 / 1',
    cover: '커버 사진',
    profile: '프로필 사진',
    share: '공유',
    copyLink: '사진 링크 복사',
    openOriginal: '원본 사진 열기',
    linkCopied: '링크를 복사했습니다',
    shareFailed: '사진을 공유할 수 없습니다',
    copyFailed: '링크를 복사할 수 없습니다',
  },
})

export default function AuthorPagePhotoViewer({
  open = false,
  src = '',
  kind = 'cover',
  authorName = '',
  avatarUrl = '',
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const [controlsVisible, setControlsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const label = kind === 'profile' ? t('authorPagePhotoViewer.profile') : t('authorPagePhotoViewer.cover')

  useEffect(() => {
    if (!open) return undefined
    setControlsVisible(true)
    setMenuOpen(false)
    setActionMessage('')
  }, [open, src])

  useEffect(() => {
    if (!open) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (menuOpen) setMenuOpen(false)
        else onClose?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, menuOpen, onClose])

  useEffect(() => {
    if (!actionMessage) return undefined
    const timeout = window.setTimeout(() => setActionMessage(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [actionMessage])

  async function copyLink() {
    setMenuOpen(false)
    try {
      await navigator.clipboard.writeText(src)
      setActionMessage(t('authorPagePhotoViewer.linkCopied'))
    } catch {
      setActionMessage(t('authorPagePhotoViewer.copyFailed'))
    }
  }

  async function sharePhoto() {
    setMenuOpen(false)
    try {
      if (navigator.share) {
        await navigator.share({ title: authorName || label, url: src })
      } else {
        await navigator.clipboard.writeText(src)
        setActionMessage(t('authorPagePhotoViewer.linkCopied'))
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setActionMessage(t('authorPagePhotoViewer.shareFailed'))
      }
    }
  }

  if (!open || !src) return null

  return (
    <div
      className="fixed inset-0 z-[150000] overflow-hidden bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={() => {
        if (menuOpen) setMenuOpen(false)
        else setControlsVisible((current) => !current)
      }}
    >
      <div className="absolute inset-0 flex h-[100dvh] w-full items-center justify-center">
        <img
          src={src}
          alt={`${authorName || label} - ${label}`}
          draggable="false"
          className="max-h-[100dvh] max-w-full select-none object-contain"
        />
      </div>

      {controlsVisible ? (
        <header
          className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/90 via-black/60 to-transparent pb-8 pt-[max(8px,env(safe-area-inset-top))]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex h-12 items-center justify-between px-3">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('authorPagePhotoViewer.close')}
              className="flex h-10 w-10 items-center justify-center active:opacity-60"
            >
              <i className="fa-solid fa-xmark text-[22px]" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold">
              {t('authorPagePhotoViewer.position')}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('authorPagePhotoViewer.options')}
              className="flex h-10 w-10 items-center justify-center active:opacity-60"
            >
              <i className="fa-solid fa-ellipsis text-[19px]" />
            </button>
          </div>
        </header>
      ) : null}

      {controlsVisible ? (
        <footer
          className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto max-w-[620px]">
            <div className="flex items-center gap-3 px-4 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[15px] font-semibold">{(authorName || 'A').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold">{authorName}</div>
                <div className="mt-0.5 text-[11px] text-white/70">{label}</div>
              </div>
            </div>
            <div className="border-t border-white/20 px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-1">
              <button
                type="button"
                onClick={sharePhoto}
                className="flex h-12 w-full items-center justify-center gap-2 text-[14px] font-medium active:bg-white/10"
              >
                <i className="fa-solid fa-share text-[19px]" />
                <span>{t('authorPagePhotoViewer.share')}</span>
              </button>
            </div>
          </div>
        </footer>
      ) : null}

      {actionMessage ? (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black shadow-xl">
          {actionMessage}
        </div>
      ) : null}

      {menuOpen ? (
        <div
          className="absolute inset-0 z-40 flex items-end bg-black/50"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen(false)
          }}
        >
          <div
            className="w-full rounded-t-[22px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 text-[var(--shadow-text-primary)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={copyLink}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-solid fa-link w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.copyLink')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                window.open(src, '_blank', 'noopener,noreferrer')
              }}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-regular fa-image w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.openOriginal')}</span>
            </button>
            <button
              type="button"
              onClick={sharePhoto}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-solid fa-share w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.share')}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
