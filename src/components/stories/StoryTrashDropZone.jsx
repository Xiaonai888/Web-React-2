import { getDisplayText } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTrashDropZone', {
  en: { drag: 'Drag here to delete', release: 'Release to delete' },
  km: { drag: 'អូសមកទីនេះដើម្បីលុប', release: 'លែងម្រាមដើម្បីលុប' },
  zh: { drag: '拖到这里删除', release: '松开即可删除' },
  ja: { drag: 'ここにドラッグして削除', release: '指を離して削除' },
  ko: { drag: '여기로 끌어 삭제', release: '놓으면 삭제됩니다' },
})

export function isPointOverStoryTrashDropZone(clientX, clientY, node) {
  if (!node || !Number.isFinite(clientX) || !Number.isFinite(clientY)) return false
  const bounds = node.getBoundingClientRect()
  return bounds.width > 0 && bounds.height > 0 &&
    clientX >= bounds.left && clientX <= bounds.right &&
    clientY >= bounds.top && clientY <= bounds.bottom
}

export default function StoryTrashDropZone({ visible = false, isOver = false, zoneRef = null }) {
  if (!visible) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] text-white"
      aria-hidden="true"
    >
      <div
        className="mx-auto flex min-h-[170px] w-full max-w-[680px] items-center justify-center bg-gradient-to-t from-black via-black/95 to-black/80 px-4 pt-4"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div
          ref={zoneRef}
          data-story-trash-drop-zone="true"
          className="flex min-h-[142px] w-[190px] flex-col items-center justify-center gap-2 rounded-[26px]"
        >
          <span
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none ${isOver ? 'bg-[#E52E3D] text-white' : 'bg-white text-[#1B1B1B]'}`}
          >
            <svg
              width="39"
              height="39"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6.5 9.5h11l-.85 10.2a1.5 1.5 0 0 1-1.5 1.3h-6.3a1.5 1.5 0 0 1-1.5-1.3L6.5 9.5Z" />
              <path d="M10 12.5v5.3M14 12.5v5.3" />
              <g
                className="transition-transform duration-200 ease-out motion-reduce:transition-none"
                style={{ transformOrigin: '7px 7px', transform: isOver ? 'translateY(-2.5px) rotate(-25deg)' : 'none' }}
              >
                <path d="M4.5 7.5h15" />
                <path d="M9.5 7.3V5.7c0-.6.5-1 1.1-1h2.8c.6 0 1.1.4 1.1 1v1.6" />
              </g>
            </svg>
          </span>
          <span className={`text-center text-[12px] font-medium leading-5 transition-colors duration-200 ${isOver ? 'text-[#FF6875]' : 'text-white'}`}>
            {getDisplayText(isOver ? 'storyTrashDropZone.release' : 'storyTrashDropZone.drag')}
          </span>
        </div>
      </div>
    </div>
  )
}
