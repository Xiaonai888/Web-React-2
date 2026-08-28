export function PageShell({ children, className = '' }) {
  return (
    <div className={`app-page min-h-screen ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle = '',
  onBack,
  backLabel = '',
  right = null,
  className = '',
}) {
  return (
    <header className={`app-nav sticky top-0 z-40 border-b ${className}`}>
      <div className="mx-auto flex min-h-14 w-full max-w-[960px] items-center gap-3 px-4 py-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={backLabel}
          >
            <i className="fas fa-chevron-left text-[15px]" />
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <h1 className="app-title truncate text-[18px] font-extrabold">
            {title}
          </h1>

          {subtitle ? (
            <p className="app-muted mt-0.5 truncate text-[11px]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  )
}

export function SurfaceCard({
  children,
  as: Component = 'section',
  className = '',
}) {
  return (
    <Component className={`app-card rounded-[18px] border ${className}`}>
      {children}
    </Component>
  )
}

export function PageLoadingState({
  label = '',
  rows = 3,
  className = '',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-elevated)]"
        />
      ))}

      {label ? (
        <div className="text-center text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          {label}
        </div>
      ) : null}
    </div>
  )
}

export function PageErrorState({
  title,
  body = '',
  actionLabel = '',
  onAction,
  className = '',
}) {
  return (
    <SurfaceCard className={`p-6 text-center ${className}`}>
      <div className="text-[15px] font-extrabold text-red-500 dark:text-red-300">
        {title}
      </div>

      {body ? (
        <p className="app-muted mx-auto mt-2 max-w-[320px] text-[12px] leading-5">
          {body}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[12px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
        >
          {actionLabel}
        </button>
      ) : null}
    </SurfaceCard>
  )
}

export function PageEmptyState({
  title,
  body = '',
  icon = null,
  actionLabel = '',
  onAction,
  className = '',
}) {
  return (
    <SurfaceCard className={`p-7 text-center ${className}`}>
      {icon ? (
        <div className="app-elevated mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </div>
      ) : null}

      <div className="app-title text-[17px] font-extrabold">
        {title}
      </div>

      {body ? (
        <p className="app-muted mx-auto mt-2 max-w-[320px] text-[12px] leading-5">
          {body}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[12px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-95"
        >
          {actionLabel}
        </button>
      ) : null}
    </SurfaceCard>
  )
}

export function FilterChip({
  selected = false,
  children,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition active:scale-95 ${
        selected
          ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
