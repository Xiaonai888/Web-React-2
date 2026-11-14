import { getDisplayLanguageId } from '../../utils/displayLanguage'

const TEXT = {
  km: { title: 'គណនីដែលបានចងចាំ', active: 'កំពុងប្រើ', add: 'ប្រើគណនីផ្សេង', remove: 'ដកចេញពីបញ្ជី', empty: 'មិនទាន់មានគណនីដែលបានចងចាំ' },
  en: { title: 'Remembered accounts', active: 'Active', add: 'Use another account', remove: 'Remove from list', empty: 'No remembered accounts yet' },
  zh: { title: '已记住的账号', active: '当前账号', add: '使用其他账号', remove: '从列表中移除', empty: '暂无已记住的账号' },
  ja: { title: '保存したアカウント', active: '使用中', add: '別のアカウントを使う', remove: '一覧から削除', empty: '保存されたアカウントはありません' },
  ko: { title: '기억된 계정', active: '사용 중', add: '다른 계정 사용', remove: '목록에서 삭제', empty: '기억된 계정이 없습니다' },
}

export default function ReaderAccountChooser({ accounts = [], activeUserId = '', onChoose, onRemove, onAdd, disabled = false }) {
  const labels = TEXT[getDisplayLanguageId()] || TEXT.en
  const items = Array.isArray(accounts) ? accounts : []

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e9e7ee] bg-white dark:border-white/10 dark:bg-[#171923]">
      <h2 className="px-4 pt-4 text-[15px] font-bold text-[#111827] dark:text-white">{labels.title}</h2>
      {items.length === 0 ? (
        <p className="px-4 py-5 text-[13px] text-[#6b7280] dark:text-white/60">{labels.empty}</p>
      ) : items.map((account) => {
        const isActive = String(account.id) === String(activeUserId)
        return (
          <div key={account.id} className="flex items-center gap-2 border-b border-[#f0eef4] px-3 py-2.5 last:border-b-0 dark:border-white/10">
            <button type="button" disabled={disabled || isActive || typeof onChoose !== 'function'} onClick={() => onChoose(account)} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left disabled:opacity-70">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-sm font-bold text-white">
                {account.avatarUrl ? <img src={account.avatarUrl} alt="" className="h-full w-full object-cover" /> : (account.name || account.username || 'R').slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[#111827] dark:text-white">{account.name || account.username}</span>
                <span className="block truncate text-[12px] text-[#7b8190] dark:text-white/60">{isActive ? labels.active : account.username ? `@${account.username}` : ''}</span>
              </span>
              {isActive ? <span className="text-[15px] text-[#111827] dark:text-white" aria-label={labels.active}>✓</span> : null}
            </button>
            {typeof onRemove === 'function' && !isActive ? (
              <button type="button" disabled={disabled} onClick={() => onRemove(account)} aria-label={labels.remove} className="rounded-lg px-2 py-2 text-[18px] text-[#8c93a2] hover:bg-[#f5f4f8] dark:hover:bg-white/10">×</button>
            ) : null}
          </div>
        )
      })}
      {typeof onAdd === 'function' ? (
        <button type="button" disabled={disabled} onClick={onAdd} className="w-full border-t border-[#f0eef4] px-4 py-3.5 text-left text-[13px] font-semibold text-[#111827] disabled:opacity-60 dark:border-white/10 dark:text-white">+ {labels.add}</button>
      ) : null}
    </section>
  )
}
