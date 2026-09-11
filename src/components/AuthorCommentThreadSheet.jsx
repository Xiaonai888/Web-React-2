export default function AuthorCommentThreadSheet({ item, onClose }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">
              Comment Thread
            </h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {item.story_title || 'Story Comment'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl leading-none text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            ×
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
              {item.text || item.title || ''}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
