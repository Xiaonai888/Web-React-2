import { useEffect, useRef, useState } from 'react'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('professionalEpisodeActionSheet', {
  en: {
    untitledEpisode: "Untitled Episode",
    editEpisode: "Edit Episode",
    publishEpisode: "Publish Episode",
    moveToDraft: "Move to Draft",
    deleteEpisode: "Delete Episode",
    episodeActions: "Episode actions",
    closeEpisodeActions: "Close episode actions",
  },
  km: {
    untitledEpisode: "ភាគគ្មានចំណងជើង",
    editEpisode: "កែភាគ",
    publishEpisode: "បោះផ្សាយភាគ",
    moveToDraft: "ផ្លាស់ទៅព្រាង",
    deleteEpisode: "លុបភាគ",
    episodeActions: "សកម្មភាពភាគ",
    closeEpisodeActions: "បិទសកម្មភាពភាគ",
  },
  zh: {
    untitledEpisode: "未命名章节",
    editEpisode: "编辑章节",
    publishEpisode: "发布章节",
    moveToDraft: "移至草稿",
    deleteEpisode: "删除章节",
    episodeActions: "章节操作",
    closeEpisodeActions: "关闭章节操作",
  },
  ja: {
    untitledEpisode: "無題のエピソード",
    editEpisode: "エピソードを編集",
    publishEpisode: "エピソードを公開",
    moveToDraft: "下書きに移動",
    deleteEpisode: "エピソードを削除",
    episodeActions: "エピソード操作",
    closeEpisodeActions: "エピソード操作を閉じる",
  },
  ko: {
    untitledEpisode: "제목 없는 에피소드",
    editEpisode: "에피소드 편집",
    publishEpisode: "에피소드 게시",
    moveToDraft: "초안으로 이동",
    deleteEpisode: "에피소드 삭제",
    episodeActions: "에피소드 작업",
    closeEpisodeActions: "에피소드 작업 닫기",
  },
})


function ActionButton({ icon, label, onClick, disabled, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] font-normal transition active:bg-[var(--shadow-bg-hover)] disabled:opacity-50 ${
        danger ? 'text-[#e5484d] active:bg-[var(--shadow-bg-hover)]' : 'text-[var(--shadow-text-primary)]'
      }`}
    >
      <i className={`${icon} w-5 text-center text-[13px] font-normal`} />
      <span className="font-normal">{label}</span>
    </button>
  )
}

function ActionContent({
  episode,
  busy,
  onEdit,
  onPublish,
  onMoveToDraft,
  onDelete,
  desktop = false,
}) {
  const isPublished =
    String(episode.status || '').toLowerCase() === 'published'

  return (
    <div className={desktop ? 'p-2' : 'px-3 pb-2'}>
      <div
        className={`${
          desktop
            ? 'px-3 pb-2 pt-1 text-[13px]'
            : 'px-1 pb-3 text-[15px]'
        } line-clamp-1 font-normal text-[var(--shadow-text-primary)]`}
      >
        {episode.title || getDisplayText('professionalEpisodeActionSheet.untitledEpisode')}
      </div>

      <div className="space-y-0.5">
        <ActionButton
          icon="fa-regular fa-pen-to-square"
          label={getDisplayText('professionalEpisodeActionSheet.editEpisode')}
          disabled={busy}
          onClick={() => onEdit(episode)}
        />

        <ActionButton
          icon="fa-regular fa-circle-up"
          label={getDisplayText('professionalEpisodeActionSheet.publishEpisode')}
          disabled={busy}
          onClick={() => onPublish(episode)}
        />

        {isPublished ? (
          <ActionButton
            icon="fa-regular fa-file-lines"
            label={getDisplayText('professionalEpisodeActionSheet.moveToDraft')}
            disabled={busy}
            onClick={() => onMoveToDraft(episode)}
          />
        ) : null}

        <ActionButton
          icon="fa-regular fa-trash-can"
          label={getDisplayText('professionalEpisodeActionSheet.deleteEpisode')}
          disabled={busy}
          danger
          onClick={() => onDelete(episode)}
        />
      </div>
    </div>
  )
}

export default function ProfessionalEpisodeActionSheet({
  episode,
  open,
  onClose,
  onEdit,
  onPublish,
  onMoveToDraft,
  onDelete,
  busy,
}) {
  useDisplayTranslation()
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [position, setPosition] = useState({ top: 72, left: 16 })
  const dragStartRef = useRef(0)
  const dragYRef = useRef(0)
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!open) return
    dragYRef.current = 0
    setDragY(0)
    setDragging(false)
  }, [open])

  useEffect(() => {
    if (!open || !episode?.__menuAnchor) return undefined

    const updatePosition = () => {
      const anchor = episode.__menuAnchor
      const width = popoverRef.current?.offsetWidth || 248
      const height = popoverRef.current?.offsetHeight || 230
      const gap = 8
      const maxLeft = Math.max(12, window.innerWidth - width - 12)
      const left = Math.min(maxLeft, Math.max(12, anchor.right - width))
      let top = anchor.bottom + gap

      if (top + height > window.innerHeight - 12) {
        top = Math.max(12, anchor.top - height - gap)
      }

      setPosition({ top, left })
    }

    const frame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
    }
  }, [episode, open])

  if (!open || !episode) return null

  const handleDragStart = (event) => {
    dragStartRef.current = event.clientY
    dragYRef.current = 0
    setDragY(0)
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!dragging) return
    const nextY = Math.max(0, event.clientY - dragStartRef.current)
    dragYRef.current = nextY
    setDragY(nextY)
  }

  const handleDragEnd = () => {
    if (!dragging) return
    setDragging(false)

    if (dragYRef.current >= 80) {
      onClose()
      return
    }

    dragYRef.current = 0
    setDragY(0)
  }

  return (
    <div
      className="fixed inset-0 z-[150]"
      role="dialog"
      aria-modal="true"
      aria-label={getDisplayText('professionalEpisodeActionSheet.episodeActions')}
    >
      <button
        type="button"
        aria-label={getDisplayText('professionalEpisodeActionSheet.closeEpisodeActions')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35 md:bg-transparent"
      />

      <section
        className={`absolute inset-x-0 bottom-0 rounded-t-[20px] bg-[var(--shadow-bg-surface)] pb-[max(14px,env(safe-area-inset-bottom))] pt-2 shadow-2xl md:hidden ${
          dragging ? '' : 'transition-transform duration-200 ease-out'
        }`}
        style={{ transform: `translateY(${dragY}px)` }}
      >
        <div
          className="touch-none pb-3 pt-0.5"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="mx-auto h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)]" />
        </div>

        <ActionContent
          episode={episode}
          busy={busy}
          onEdit={onEdit}
          onPublish={onPublish}
          onMoveToDraft={onMoveToDraft}
          onDelete={onDelete}
        />
      </section>

      <section
        ref={popoverRef}
        className="fixed hidden w-[248px] overflow-hidden rounded-[12px] bg-[var(--shadow-bg-surface)] shadow-[0_14px_38px_rgba(17,24,39,0.18)] ring-1 ring-[var(--shadow-border)] md:block"
        style={{ top: position.top, left: position.left }}
      >
        <ActionContent
          episode={episode}
          busy={busy}
          onEdit={onEdit}
          onPublish={onPublish}
          onMoveToDraft={onMoveToDraft}
          onDelete={onDelete}
          desktop
        />
      </section>
    </div>
  )
}
