import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerHiddenWords', {
  en: {
    title: 'Hidden words', back: 'Back to settings', eyebrow: 'Your reading comfort',
    heading: 'Choose what to blur', description: 'Words and phrases you add will be blurred in Reader and Author posts you view. Tap the blur to reveal the text.',
    addTitle: 'Add a word or phrase', addHelp: 'Matching ignores letter case. Your original posts are not changed.',
    placeholder: 'Enter a word or phrase', add: 'Add word', listTitle: 'Your hidden words',
    listHelp: 'Manage the words you would rather reveal yourself.', search: 'Search hidden words',
    newest: 'Newest', oldest: 'Oldest', az: 'A–Z', limit: '{{count}} / {{limit}}',
    noWords: 'No hidden words yet', noWordsHelp: 'Add a word above to get started.',
    noResults: 'No matching words', duplicate: 'This word or phrase is already in your list.',
    tooLong: 'A word or phrase can have up to 120 characters.', full: 'You have reached the 200-word limit.',
    saved: 'Word added.', removed: 'Word removed.', remove: 'Remove {{word}}',
    confirmRemove: 'Remove “{{word}}” from your hidden words?',
    sampleTitle: 'Spoiler preview', sampleHelp: 'Tap the blurred word to reveal it. This preview does not edit any post.',
    sampleBefore: 'This post mentions', sampleAfter: 'today.', sampleWord: 'a hidden word',
    reveal: 'Reveal hidden word', hideAgain: 'Blur word again',
    signIn: 'Sign in to manage hidden words.', missingAccount: 'Your reader account could not be identified. Please sign in again.',
    storageError: 'Could not save changes on this device.', deviceOnly: 'Currently saved on this device only. Account sync and post blurring will be connected next.'
  },
  km: {
    title: 'ពាក្យដែលបានលាក់', back: 'ត្រឡប់ទៅការកំណត់', eyebrow: 'ការអានតាមចំណូលចិត្ត',
    heading: 'ជ្រើសពាក្យដែលត្រូវព្រាល', description: 'ពាក្យ និងឃ្លាដែលអ្នកកំណត់ នឹងត្រូវព្រាលក្នុង Reader Post និង Author Post ដែលអ្នកមើល។ ចុចលើកន្លែងព្រាលដើម្បីមើលអត្ថបទ។',
    addTitle: 'បន្ថែមពាក្យ ឬឃ្លា', addHelp: 'មិនប្រកាន់អក្សរធំតូច ហើយមិនកែប្រែ Post ដើមទេ។',
    placeholder: 'បញ្ចូលពាក្យ ឬឃ្លា', add: 'បន្ថែម', listTitle: 'ពាក្យដែលអ្នកបានលាក់',
    listHelp: 'គ្រប់គ្រងពាក្យដែលអ្នកចង់ចុចបង្ហាញដោយខ្លួនឯង។', search: 'ស្វែងរកពាក្យ',
    newest: 'ថ្មីបំផុត', oldest: 'ចាស់បំផុត', az: 'ក–អ', limit: '{{count}} / {{limit}}',
    noWords: 'មិនទាន់មានពាក្យដែលលាក់', noWordsHelp: 'បន្ថែមពាក្យនៅខាងលើដើម្បីចាប់ផ្តើម។',
    noResults: 'រកមិនឃើញពាក្យដែលត្រូវគ្នា', duplicate: 'ពាក្យ ឬឃ្លានេះមានរួចហើយ។',
    tooLong: 'ពាក្យ ឬឃ្លាមួយអាចមានអតិបរមា ១២០ តួអក្សរ។', full: 'បានដល់កំណត់ ២០០ ពាក្យ។',
    saved: 'បានបន្ថែមពាក្យ។', removed: 'បានលុបពាក្យ។', remove: 'លុប {{word}}',
    confirmRemove: 'លុប “{{word}}” ចេញពីបញ្ជី?',
    sampleTitle: 'សាកល្បងការព្រាល', sampleHelp: 'ចុចលើពាក្យព្រាលដើម្បីបង្ហាញ។ ការសាកល្បងនេះមិនកែ Post ណាមួយឡើយ។',
    sampleBefore: 'Post នេះនិយាយពី', sampleAfter: 'នៅថ្ងៃនេះ។', sampleWord: 'ពាក្យលាក់',
    reveal: 'បង្ហាញពាក្យ', hideAgain: 'ព្រាលពាក្យម្តងទៀត',
    signIn: 'សូមចូលគណនីដើម្បីគ្រប់គ្រងពាក្យ។', missingAccount: 'មិនអាចសម្គាល់គណនីអ្នកអានបានទេ។ សូមចូលគណនីឡើងវិញ។',
    storageError: 'មិនអាចរក្សាទុកនៅលើឧបករណ៍នេះបានទេ។', deviceOnly: 'បច្ចុប្បន្នរក្សាទុកតែនៅលើឧបករណ៍នេះ។ ការភ្ជាប់គណនី និងការព្រាលលើ Post នឹងធ្វើនៅជំហានបន្ទាប់។'
  },
  zh: {
    title: '隐藏词语', back: '返回设置', eyebrow: '舒适阅读', heading: '选择需要模糊的内容',
    description: '你添加的词语或短语将在你查看的读者和作者帖子中模糊显示。点击即可查看原文。',
    addTitle: '添加词语或短语', addHelp: '不区分大小写，不修改原始帖子。', placeholder: '输入词语或短语', add: '添加',
    listTitle: '你的隐藏词语', listHelp: '管理你想自行决定是否查看的词语。', search: '搜索隐藏词语',
    newest: '最新', oldest: '最早', az: 'A–Z', limit: '{{count}} / {{limit}}',
    noWords: '尚无隐藏词语', noWordsHelp: '在上方添加词语以开始。', noResults: '没有匹配的词语',
    duplicate: '该词语或短语已存在。', tooLong: '最多120个字符。', full: '已达到200个词语的上限。',
    saved: '已添加词语。', removed: '已删除词语。', remove: '删除{{word}}', confirmRemove: '删除“{{word}}”？',
    sampleTitle: '模糊预览', sampleHelp: '点击模糊文字查看。预览不会修改帖子。', sampleBefore: '这篇帖子提到', sampleAfter: '。', sampleWord: '隐藏词语',
    reveal: '显示隐藏词语', hideAgain: '再次模糊', signIn: '请先登录。',
    missingAccount: '无法识别你的账号，请重新登录。', storageError: '无法在此设备保存更改。',
    deviceOnly: '目前仅保存在本设备。账号同步和帖子模糊将在下一步连接。'
  },
  ja: {
    title: '非表示ワード', back: '設定に戻る', eyebrow: '快適な閲覧', heading: 'ぼかす言葉を選択',
    description: '追加した単語やフレーズは、閲覧する読者・作者の投稿内でぼかされます。タップすると表示されます。',
    addTitle: '単語やフレーズを追加', addHelp: '大文字小文字は区別せず、元の投稿は変更しません。', placeholder: '単語やフレーズ', add: '追加',
    listTitle: '非表示ワード一覧', listHelp: '必要なときだけ表示したい言葉を管理します。', search: 'ワードを検索',
    newest: '新しい順', oldest: '古い順', az: 'A–Z', limit: '{{count}} / {{limit}}',
    noWords: 'まだ登録されていません', noWordsHelp: '上から言葉を追加してください。', noResults: '一致するワードはありません',
    duplicate: 'すでに登録されています。', tooLong: '最大120文字です。', full: '200件の上限に達しました。',
    saved: '追加しました。', removed: '削除しました。', remove: '{{word}}を削除', confirmRemove: '「{{word}}」を削除しますか？',
    sampleTitle: 'ぼかしプレビュー', sampleHelp: 'ぼかした言葉をタップすると表示します。投稿は変更されません。', sampleBefore: 'この投稿では', sampleAfter: 'について話しています。', sampleWord: '非表示ワード',
    reveal: 'ワードを表示', hideAgain: '再びぼかす', signIn: 'ログインしてください。',
    missingAccount: 'アカウントを確認できません。再ログインしてください。', storageError: 'この端末に保存できませんでした。',
    deviceOnly: '現在はこの端末にのみ保存されます。アカウント同期と投稿のぼかし表示は次の段階で接続します。'
  },
  ko: {
    title: '숨김 단어', back: '설정으로 돌아가기', eyebrow: '편안한 읽기', heading: '흐리게 표시할 단어 선택',
    description: '등록한 단어나 문구는 내가 보는 독자 및 작가 게시물에서 흐리게 표시됩니다. 탭하면 표시됩니다.',
    addTitle: '단어 또는 문구 추가', addHelp: '대소문자를 구분하지 않으며 원본 게시물은 변경하지 않습니다.', placeholder: '단어나 문구 입력', add: '추가',
    listTitle: '내 숨김 단어', listHelp: '원할 때만 확인하고 싶은 단어를 관리하세요.', search: '숨김 단어 검색',
    newest: '최신순', oldest: '오래된순', az: '가나다순', limit: '{{count}} / {{limit}}',
    noWords: '숨김 단어가 없습니다', noWordsHelp: '위에서 단어를 추가하세요.', noResults: '검색 결과가 없습니다',
    duplicate: '이미 등록된 단어입니다.', tooLong: '최대 120자까지 입력할 수 있습니다.', full: '200개 제한에 도달했습니다.',
    saved: '단어를 추가했습니다.', removed: '단어를 삭제했습니다.', remove: '{{word}} 삭제', confirmRemove: '“{{word}}”을 삭제할까요?',
    sampleTitle: '흐림 미리보기', sampleHelp: '흐린 단어를 누르면 표시됩니다. 게시물은 변경되지 않습니다.', sampleBefore: '이 게시물은', sampleAfter: '에 관한 글입니다.', sampleWord: '숨김 단어',
    reveal: '단어 보기', hideAgain: '다시 흐리게', signIn: '먼저 로그인하세요.',
    missingAccount: '계정을 확인할 수 없습니다. 다시 로그인하세요.', storageError: '이 기기에 변경 사항을 저장할 수 없습니다.',
    deviceOnly: '현재 이 기기에만 저장됩니다. 계정 동기화와 게시물 흐림 처리는 다음 단계에서 연결됩니다.'
  }
})

const LIMIT = 200
const normalize = (value) => String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ')
const compareWord = (value) => normalize(value).toLocaleLowerCase()

function readerId() {
  try {
    const user = JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || user?.reader?.id || '').trim()
  } catch {
    return ''
  }
}

function readWords(key) {
  if (!key) return []
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(data)) return []
    return data.filter((item) => item && typeof item.word === 'string').slice(0, LIMIT)
  } catch {
    return []
  }
}

export default function ReaderHiddenWordsPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  const accountId = readerId()
  const storageKey = accountId ? `shadow_reader_hidden_words_draft_v1:${accountId}` : ''
  const [words, setWords] = useState(() => readWords(storageKey))
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    setWords(readWords(storageKey))
    const onStorage = (event) => {
      if (event.key === storageKey) setWords(readWords(storageKey))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  const shownWords = useMemo(() => {
    const query = compareWord(search)
    const filtered = words.filter((item) => compareWord(item.word).includes(query))
    return filtered.sort((a, b) => {
      if (sort === 'az') return a.word.localeCompare(b.word)
      const first = Number(a.created_at || 0)
      const second = Number(b.created_at || 0)
      return sort === 'oldest' ? first - second : second - first
    })
  }, [words, search, sort])

  const duplicate = words.some((item) => compareWord(item.word) === compareWord(input))
  const previewWord = words[0]?.word || t('readerHiddenWords.sampleWord')

  function persist(nextWords) {
    try {
      if (!storageKey) {
        setError(t('readerHiddenWords.missingAccount'))
        return false
      }
      localStorage.setItem(storageKey, JSON.stringify(nextWords))
      setWords(nextWords)
      setError('')
      return true
    } catch {
      setError(t('readerHiddenWords.storageError'))
      return false
    }
  }

  function addWord(event) {
    event.preventDefault()
    setMessage('')
    const word = normalize(input)
    if (!word) return
    if (word.length > 120) return setError(t('readerHiddenWords.tooLong'))
    if (duplicate) return setError(t('readerHiddenWords.duplicate'))
    if (words.length >= LIMIT) return setError(t('readerHiddenWords.full'))
    if (persist([{ id: crypto.randomUUID(), word, created_at: Date.now() }, ...words])) {
      setInput('')
      setRevealed(false)
      setMessage(t('readerHiddenWords.saved'))
    }
  }

  function removeWord(item) {
    if (!window.confirm(t('readerHiddenWords.confirmRemove', { word: item.word }))) return
    if (persist(words.filter((entry) => entry.id !== item.id))) {
      setMessage(t('readerHiddenWords.removed'))
      setRevealed(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(44px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button type="button" onClick={() => navigate(backPath)} aria-label={t('readerHiddenWords.back')} className="flex h-10 w-10 items-center justify-start text-[var(--shadow-text-primary)]">
            <i className="fa-solid fa-chevron-left text-[14px]" aria-hidden="true" />
          </button>
          <h1 className="text-[17px] font-semibold">{t('readerHiddenWords.title')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-eye-slash text-[19px]" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--shadow-text-tertiary)]">{t('readerHiddenWords.eyebrow')}</p>
              <h2 className="mt-1 text-[19px] font-semibold">{t('readerHiddenWords.heading')}</h2>
              <p className="mt-2 text-[12.5px] leading-6 text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.description')}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 py-2.5">
            <span className="text-[12px] text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.listTitle')}</span>
            <span className="text-[12px] font-semibold tabular-nums">{t('readerHiddenWords.limit', { count: words.length, limit: LIMIT })}</span>
          </div>
        </section>

        <form onSubmit={addWord} className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <label htmlFor="reader-hidden-word-input" className="text-[15px] font-semibold">{t('readerHiddenWords.addTitle')}</label>
          <p className="mb-3 mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.addHelp')}</p>
          <div className="flex gap-2">
            <input id="reader-hidden-word-input" value={input} onChange={(event) => { setInput(event.target.value); setError(''); setMessage('') }} maxLength={121} disabled={!storageKey || words.length >= LIMIT} placeholder={t('readerHiddenWords.placeholder')} className="h-11 min-w-0 flex-1 rounded-[13px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 text-[13px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)] focus:border-[var(--shadow-text-secondary)] disabled:opacity-50" />
            <button type="submit" disabled={!normalize(input) || !storageKey || words.length >= LIMIT} className="h-11 shrink-0 rounded-[13px] bg-[var(--shadow-text-primary)] px-4 text-[12px] font-semibold text-[var(--shadow-bg-surface)] disabled:opacity-40">{t('readerHiddenWords.add')}</button>
          </div>
          {error ? <p role="alert" className="mt-3 text-[12px] text-red-500">{error}</p> : null}
          {message ? <p role="status" className="mt-3 text-[12px] text-emerald-600">{message}</p> : null}
          {!storageKey ? <p role="alert" className="mt-3 text-[12px] text-red-500">{t('readerHiddenWords.missingAccount')}</p> : null}
        </form>

        <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-eye text-[16px] text-[var(--shadow-text-secondary)]" aria-hidden="true" />
            <h2 className="text-[15px] font-semibold">{t('readerHiddenWords.sampleTitle')}</h2>
          </div>
          <p className="mt-2 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.sampleHelp')}</p>
          <div className="mt-3 rounded-[14px] bg-[var(--shadow-bg-soft)] p-3 text-[13px] leading-7">
            {t('readerHiddenWords.sampleBefore')}{' '}
            <button type="button" onClick={() => setRevealed((current) => !current)} aria-label={t(revealed ? 'readerHiddenWords.hideAgain' : 'readerHiddenWords.reveal')} aria-pressed={revealed} className="inline-block max-w-full rounded-md bg-[var(--shadow-bg-elevated)] px-1.5 py-0.5 align-baseline outline-offset-2">
              <span className={revealed ? 'break-all' : 'inline-block select-none break-all blur-[5px]'}>{previewWord}</span>
            </button>{' '}{t('readerHiddenWords.sampleAfter')}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold">{t('readerHiddenWords.listTitle')}</h2>
          <p className="mb-3 mt-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.listHelp')}</p>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[var(--shadow-text-tertiary)]" aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('readerHiddenWords.search')} className="h-11 w-full rounded-[13px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pl-9 pr-3 text-[13px] outline-none placeholder:text-[var(--shadow-text-tertiary)]" />
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t('readerHiddenWords.listTitle')} className="h-11 rounded-[13px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-2 text-[12px] outline-none">
              <option value="newest">{t('readerHiddenWords.newest')}</option>
              <option value="oldest">{t('readerHiddenWords.oldest')}</option>
              <option value="az">{t('readerHiddenWords.az')}</option>
            </select>
          </div>
          <div className="mt-3 overflow-hidden rounded-[19px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            {shownWords.length ? shownWords.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-3.5 py-3 last:border-b-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
                  <i className="fa-regular fa-eye-slash text-[13px]" aria-hidden="true" />
                </div>
                <span className="min-w-0 flex-1 break-words text-[13px] font-medium">{item.word}</span>
                <button type="button" onClick={() => removeWord(item)} aria-label={t('readerHiddenWords.remove', { word: item.word })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]">
                  <i className="fa-regular fa-trash-can text-[13px]" aria-hidden="true" />
                </button>
              </div>
            )) : (
              <div className="px-4 py-9 text-center">
                <i className="fa-regular fa-eye-slash text-[22px] text-[var(--shadow-text-tertiary)]" aria-hidden="true" />
                <p className="mt-2 text-[13px] font-semibold">{t(search ? 'readerHiddenWords.noResults' : 'readerHiddenWords.noWords')}</p>
                {!search && <p className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerHiddenWords.noWordsHelp')}</p>}
              </div>
            )}
          </div>
        </section>
        <p className="px-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{t('readerHiddenWords.deviceOnly')}</p>
      </main>
    </div>
  )
}
