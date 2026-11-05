import { Link } from 'react-router-dom'

const iconBox = 'flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] dark:text-white'

export default function MenuRow({ icon, customIcon = null, title, subtitle, to, onClick, danger = false, dark = false, divider = false, extra = null }) {
  const body = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={
            dark
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f6b800]'
              : danger
                ? 'flex h-9 w-9 shrink-0 items-center justify-center text-[#e5484d]'
                : iconBox
          }
        >
          {customIcon || <i className={`${icon} text-[14px]`} />}
        </div>
        <div className="min-w-0">
          <div
            className={`line-clamp-1 text-[13.5px] font-normal ${
  dark ? 'text-white' : danger ? 'text-[#e5484d]' : 'text-[#111827] dark:text-white'
}`}
          >
            {title}
          </div>
          {subtitle ? (
            <div className={`mt-0.5 line-clamp-1 text-[11.5px] ${dark ? 'text-white/55' : 'text-[#8d94a1] dark:text-white/50'}`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
  {extra}
  <i className={`fa-solid fa-chevron-right text-[11px] ${dark ? 'text-white/45' : 'text-[#c6c9d1] dark:text-white/35'}`} />
</div>
      {divider ? (
        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#f1f1f1] dark:bg-white/10" />
      ) : null}
    </>
  )

  const className = `relative flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99] ${
    dark ? 'bg-[#171923]' : 'dark:bg-[#171923]'
  }`

  return to ? <Link to={to} className={className}>{body}</Link> : <button type="button" onClick={onClick} className={className}>{body}</button>
}

