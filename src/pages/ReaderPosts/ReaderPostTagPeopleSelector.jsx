import { useEffect, useRef, useState } from 'react'
import { AtSign, Plus, UserRound, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPostTagPeople', {
  en: {
    title: 'Tag readers', hint: 'Enter an exact @username to add a reader to this post.',
    placeholder: '@username', add: 'Add', adding: 'Finding...', remove: 'Remove tag',
    invalid: 'Enter a valid username (3–30 letters, numbers or underscores).',
    notFound: 'Reader not found.', own: 'You cannot tag yourself.',
    duplicate: 'This reader is already selected.', limit: 'You can tag up to 20 readers.',
    failed: 'Unable to find this reader. Try again.', signIn: 'Sign in again to tag readers.',
    note: 'Tags may require the reader’s approval or be unavailable due to their privacy settings.',
  },
  km: {
    title: 'Tag អ្នកអាន', hint: 'បញ្ចូល @username ពិតប្រាកដ ដើម្បី Tag អ្នកអានក្នុង Post នេះ។',
    placeholder: '@username', add: 'បន្ថែម', adding: 'កំពុងស្វែងរក...', remove: 'លុប Tag',
    invalid: 'បញ្ចូល Username ត្រឹមត្រូវ (៣–៣០ តួអក្សរ អង់គ្លេស លេខ ឬ _ )។',
    notFound: 'រកមិនឃើញអ្នកអាន។', own: 'អ្នកមិនអាច Tag ខ្លួនឯងបានទេ។',
    duplicate: 'បានជ្រើសអ្នកអាននេះរួចហើយ។', limit: 'អាច Tag បានអតិបរមា ២០ នាក់។',
    failed: 'មិនអាចស្វែងរកអ្នកអាននេះបានទេ។ សូមព្យាយាមម្ដងទៀត។', signIn: 'សូមចូលគណនីឡើងវិញដើម្បី Tag។',
    note: 'Tag អាចត្រូវការការអនុម័តពីអ្នកអាន ឬមិនអនុញ្ញាតតាម Privacy Settings របស់គេ។',
  },
  zh: {
    title: '标记读者', hint: '输入准确的 @用户名，将读者标记到这篇帖子中。',
    placeholder: '@用户名', add: '添加', adding: '正在查找...', remove: '移除标记',
    invalid: '请输入有效的用户名（3–30 个字母、数字或下划线）。',
    notFound: '找不到此读者。', own: '不能标记自己。', duplicate: '已选择该读者。',
    limit: '最多标记 20 位读者。', failed: '无法查找此读者，请重试。', signIn: '请重新登录以标记读者。',
    note: '根据读者的隐私设置，标记可能需要批准或无法生效。',
  },
  ja: {
    title: '読者をタグ付け', hint: '正確な @ユーザー名を入力して投稿にタグ付けします。',
    placeholder: '@ユーザー名', add: '追加', adding: '検索中...', remove: 'タグを削除',
    invalid: '有効なユーザー名を入力してください（英数字または _、3〜30文字）。',
    notFound: '読者が見つかりません。', own: '自分自身はタグ付けできません。',
    duplicate: 'この読者は選択済みです。', limit: 'タグ付けは20人までです。',
    failed: '読者を検索できませんでした。再試行してください。', signIn: 'タグ付けするには再ログインしてください。',
    note: '読者のプライバシー設定により、承認が必要かタグ付けできない場合があります。',
  },
  ko: {
    title: '독자 태그', hint: '정확한 @사용자 이름을 입력하여 게시물에 독자를 태그하세요.',
    placeholder: '@사용자 이름', add: '추가', adding: '검색 중...', remove: '태그 제거',
    invalid: '올바른 사용자 이름을 입력하세요(영문, 숫자, _ 포함 3~30자).',
    notFound: '독자를 찾을 수 없습니다.', own: '자신을 태그할 수 없습니다.',
    duplicate: '이미 선택한 독자입니다.', limit: '최대 20명까지 태그할 수 있습니다.',
    failed: '독자를 찾지 못했습니다. 다시 시도하세요.', signIn: '독자를 태그하려면 다시 로그인하세요.',
    note: '태그는 독자의 개인정보 설정에 따라 승인이 필요하거나 허용되지 않을 수 있습니다.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const MAX_TAGS = 20

function readerToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function currentReaderId() {
  try {
    const user = JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || '').toLowerCase()
  } catch {
    return ''
  }
}

export default function ReaderPostTagPeopleSelector({ selected = [], onChange, disabled = false }) {
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`readerPostTagPeople.${key}`)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef(null)
  const mountedRef = useRef(true)
  const people = Array.isArray(selected) ? selected : []
  const full = people.length >= MAX_TAGS

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      requestRef.current?.abort()
    }
  }, [])

  async function addReader(event) {
    event.preventDefault()
    if (disabled || loading || full) return
    const clean = username.trim().replace(/^@+/, '')
    if (!/^[A-Za-z0-9_]{3,30}$/.test(clean)) {
      setError(tr('invalid'))
      return
    }
    const token = readerToken()
    if (!token) {
      setError(tr('signIn'))
      return
    }
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(clean)}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: controller.signal,
      })
      if (response.status === 401) throw new Error('signIn')
      if (response.status === 404) throw new Error('notFound')
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !data.user?.id) throw new Error('failed')
      if (String(data.user.id).toLowerCase() === currentReaderId()) throw new Error('own')
      if (people.some((person) => String(person.id).toLowerCase() === String(data.user.id).toLowerCase())) {
        throw new Error('duplicate')
      }
      if (!mountedRef.current || controller.signal.aborted) return
      onChange?.([...people, {
        id: String(data.user.id),
        name: String(data.user.name || data.user.username || ''),
        username: String(data.user.username || ''),
        avatar_url: data.user.avatar_url || null,
      }])
      setUsername('')
    } catch (reason) {
      if (!mountedRef.current || controller.signal.aborted) return
      setError(tr(['invalid', 'notFound', 'own', 'duplicate', 'signIn'].includes(reason.message) ? reason.message : 'failed'))
    } finally {
      if (mountedRef.current && !controller.signal.aborted) setLoading(false)
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  function removeReader(id) {
    if (disabled || loading) return
    onChange?.(people.filter((person) => String(person.id) !== String(id)))
    setError('')
  }

  return (
    <section className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[var(--shadow-text-primary)]">
      <div className="flex items-center gap-2">
        <AtSign size={19} strokeWidth={1.8} />
        <h2 className="text-[14px] font-semibold">{tr('title')}</h2>
        <span className="ml-auto text-[12px] text-[var(--shadow-text-secondary)]">{people.length}/{MAX_TAGS}</span>
      </div>
      <p className="mt-2 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('hint')}</p>
      <form className="mt-3 flex gap-2" onSubmit={addReader}>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={username}
          onChange={(event) => { setUsername(event.target.value.slice(0, 31)); setError('') }}
          disabled={disabled || loading || full}
          placeholder={tr('placeholder')}
          aria-label={tr('hint')}
          className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] px-3 text-[14px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)] focus:border-[var(--shadow-text-secondary)] disabled:opacity-50"
        />
        <button type="submit" disabled={disabled || loading || full || !username.trim()} className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--shadow-text-primary)] px-3 text-[13px] font-semibold text-[var(--shadow-bg-page)] disabled:opacity-40">
          {loading ? <UserRound size={16} strokeWidth={1.8} /> : <Plus size={16} strokeWidth={1.8} />}
          {loading ? tr('adding') : tr('add')}
        </button>
      </form>
      {error && <p role="alert" className="mt-2 text-[12px] text-red-600 dark:text-red-400">{error}</p>}
      {full && <p role="status" className="mt-2 text-[12px] text-[var(--shadow-text-secondary)]">{tr('limit')}</p>}
      {people.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {people.map((person) => (
            <span key={person.id} className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] py-1 pl-1 pr-1.5 text-[12px]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
                {person.avatar_url ? <img src={person.avatar_url} alt="" className="h-full w-full object-cover" /> : <UserRound size={15} strokeWidth={1.8} />}
              </span>
              <span className="max-w-[170px] truncate">@{person.username || person.name}</span>
              <button type="button" disabled={disabled || loading} onClick={() => removeReader(person.id)} aria-label={`${tr('remove')}: ${person.username || person.name}`} className="rounded-full p-1 active:bg-[var(--shadow-bg-hover)] disabled:opacity-40">
                <X size={15} strokeWidth={1.8} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{tr('note')}</p>
    </section>
  )
}
