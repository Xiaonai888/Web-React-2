import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerProfileOptions', {
  en: {
    close: 'Close profile options',
    restrict: 'Restrict',
    block: 'Block',
    report: 'Report',
    about: 'About this reader',
    activity: 'See shared activity',
    hideStory: 'Hide your story',
    removeFollower: 'Remove follower',
    copyLink: 'Copy profile URL',
    shareProfile: 'Share this profile',
    qrCode: 'QR code',
  },
  km: {
    close: 'បិទជម្រើសប្រវត្តិរូប',
    restrict: 'ដាក់កម្រិត',
    block: 'ទប់ស្កាត់',
    report: 'រាយការណ៍',
    about: 'អំពីអ្នកអាននេះ',
    activity: 'មើលសកម្មភាពរួមគ្នា',
    hideStory: 'លាក់រឿងរបស់អ្នក',
    removeFollower: 'ដកអ្នកតាមដានចេញ',
    copyLink: 'ចម្លង URL ប្រវត្តិរូប',
    shareProfile: 'ចែករំលែកប្រវត្តិរូបនេះ',
    qrCode: 'QR code',
  },
  zh: {
    close: '关闭个人资料选项',
    restrict: '限制',
    block: '屏蔽',
    report: '举报',
    about: '关于此读者',
    activity: '查看共同活动',
    hideStory: '对其隐藏你的故事',
    removeFollower: '移除关注者',
    copyLink: '复制个人资料链接',
    shareProfile: '分享此个人资料',
    qrCode: '二维码',
  },
  ja: {
    close: 'プロフィールオプションを閉じる',
    restrict: '制限する',
    block: 'ブロック',
    report: '報告',
    about: 'この読者について',
    activity: '共通のアクティビティを見る',
    hideStory: 'ストーリーを非表示にする',
    removeFollower: 'フォロワーを削除',
    copyLink: 'プロフィールURLをコピー',
    shareProfile: 'このプロフィールを共有',
    qrCode: 'QRコード',
  },
  ko: {
    close: '프로필 옵션 닫기',
    restrict: '제한',
    block: '차단',
    report: '신고',
    about: '이 독자 정보',
    activity: '공유 활동 보기',
    hideStory: '내 스토리 숨기기',
    removeFollower: '팔로워 삭제',
    copyLink: '프로필 URL 복사',
    shareProfile: '이 프로필 공유',
    qrCode: 'QR 코드',
  },
})

const OPTIONS = [
  { key: 'restrict', labelKey: 'restrict' },
  { key: 'block', labelKey: 'block' },
  { key: 'report', labelKey: 'report', danger: true },
  { key: 'about', labelKey: 'about' },
  { key: 'activity', labelKey: 'activity' },
  { key: 'hide-story', labelKey: 'hideStory' },
  { key: 'remove-follower', labelKey: 'removeFollower' },
  { key: 'copy-link', labelKey: 'copyLink' },
  { key: 'share-profile', labelKey: 'shareProfile' },
  { key: 'qr-code', labelKey: 'qrCode' },
]

export default function ReaderProfileOptionsSheet({
  open,
  onClose,
  onSelect,
}) {
  const { t } = useDisplayTranslation()
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })
  const [dragOffset, setDragOffset] =
    useState(0)
  const [dragging, setDragging] =
    useState(false)

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    document.body.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  function resetDrag() {
    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      lastY: 0,
      startTime: 0,
    }
    setDragging(false)
    setDragOffset(0)
  }

  function startDrag(event) {
    if (!event.isPrimary) return
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
    }

    setDragging(true)
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  function moveDrag(event) {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    drag.lastY = event.clientY

    setDragOffset(
      Math.min(
        Math.max(
          0,
          event.clientY - drag.startY
        ),
        window.innerHeight * 0.55
      )
    )
  }

  function endDrag(event) {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    drag.lastY = event.clientY

    const distance = Math.max(
      0,
      drag.lastY - drag.startY
    )
    const elapsed = Math.max(
      1,
      performance.now() -
        drag.startTime
    )
    const velocity =
      distance / elapsed

    if (
      distance >= 70 ||
      (distance >= 28 &&
        velocity >= 0.55)
    ) {
      resetDrag()
      onClose()
      return
    }

    resetDrag()
  }

  function cancelDrag(event) {
    if (
      dragRef.current.pointerId !==
      event.pointerId
    ) {
      return
    }

    resetDrag()
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
        aria-label={t('readerProfileOptions.close')}
      />

      <section
        className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:mb-4 sm:max-w-[560px] sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={cancelDrag}
          onLostPointerCapture={
            cancelDrag
          }
          className="flex h-14 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </div>

        <div className="max-h-[calc(88vh-56px)] overflow-y-auto px-5 pb-[calc(22px+env(safe-area-inset-bottom))]">
          {OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() =>
                onSelect?.(option.key)
              }
              className={`flex min-h-16 w-full items-center text-left text-[17px] font-normal active:bg-[var(--shadow-bg-hover)] ${
                option.danger
                  ? 'text-[#dc2626]'
                  : 'text-[#111827]'
              }`}
            >
              {t(`readerProfileOptions.${option.labelKey}`)}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
