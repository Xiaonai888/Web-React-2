import {
  Check, Copy, CornerUpLeft, Flag, Forward, Info, LoaderCircle,
  Pencil, Pin, PinOff, Trash2,
} from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

export default function SharedMessageActionMenu({
  state,
  isPinned,
  busy,
  onClose,
  onAction,
  allowInteractions = true,
  allowedActions,
  labels,
}) {
  const { t } = useDisplayTranslation()
  if (!state?.message) return null

  const label = (key, translationKey = key) => labels?.[key] ?? t(`chatRoomPage.${translationKey}`)
  const message = state.message
  const pin = [isPinned ? 'unpin' : 'pin', isPinned ? PinOff : Pin, label(isPinned ? 'unpin' : 'pin')]
  const actions = message.is_mine
    ? [
        ['reply', CornerUpLeft, label('reply')],
        ['edit', Pencil, label('edit')],
        pin,
        ['copy', Copy, label('copy', 'copyText')],
        ['forward', Forward, label('forward')],
        ['delete', Trash2, label('delete')],
        ['select', Check, label('select')],
        ['info', Info, label('info', 'messageInfo')],
      ]
    : [
        ['reply', CornerUpLeft, label('reply')],
        pin,
        ['copy', Copy, label('copy', 'copyText')],
        ['forward', Forward, label('forward')],
        ['select', Check, label('select')],
        ['report', Flag, label('report')],
      ]
  const visibleActions = actions.filter(([key]) =>
    (allowInteractions || !['reply', 'edit', 'forward', 'pin', 'unpin'].includes(key)) &&
    (!Array.isArray(allowedActions) || allowedActions.includes(key))
  )

  return (
    <>
      <button
        type="button"
        aria-label={label('close', 'closeMessageMenu')}
        onClick={onClose}
        className="fixed inset-0 z-[102]"
      />
      <div
        className="fixed z-[103] w-[228px] overflow-hidden rounded-[18px] border border-[#e9e7ef] bg-white p-1.5 shadow-[0_20px_50px_rgba(17,24,39,0.22)]"
        style={{ left: state.x, top: state.y }}
      >
        {visibleActions.map(([key, Icon, title]) => {
          const destructive = key === 'delete' || key === 'report'
          return (
            <button
              key={key}
              type="button"
              onClick={() => onAction(key, message)}
              disabled={Boolean(busy)}
              className={`flex h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[12px] font-extrabold transition disabled:opacity-45 ${destructive ? 'text-[#c7353d] hover:bg-[#fff1f1]' : 'text-[#282832] hover:bg-[#f6f4f9]'}`}
            >
              {busy === key ? <LoaderCircle size={16} className="animate-spin" /> : <Icon size={16} />}
              {title}
            </button>
          )
        })}
      </div>
    </>
  )
}
