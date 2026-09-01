import {
  Check,
  ChevronLeft,
  LoaderCircle,
  Search,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { searchChatUsers } from '../../services/chatApi'
import { createGroupChat } from '../../services/chatGroupApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatGroupCreateSheet', {
  en: {
    reader: 'Reader',
    searchFailed: 'Failed to search people',
    maxPeople: 'A group can have up to 100 people including you',
    chooseTwo: 'Choose at least 2 people',
    groupNameRequired: 'Group name is required',
    createFailed: 'Failed to create group',
    newGroup: 'New group',
    groupDetails: 'Group details',
    peopleCapacity: '{{count}}/100 people',
    peopleCount: '{{count}} people',
    addPeople: 'Add people',
    addPeopleHelp: 'Search for readers and choose at least 2 people. Your group can have up to 100 people including you.',
    searchPlaceholder: 'Search readers by name or @username',
    noReaders: 'No readers found',
    tryAnother: 'Try another name or username.',
    next: 'Next',
    groupName: 'Group name',
    groupNamePlaceholder: 'Enter a group name',
    creating: 'Creating...',
    createGroup: 'Create group',
  },
  km: {
    reader: 'អ្នកអាន',
    searchFailed: 'មិនអាចស្វែងរកមនុស្សបានទេ',
    maxPeople: 'ក្រុមអាចមានសមាជិករហូតដល់ 100 នាក់ រួមទាំងអ្នក',
    chooseTwo: 'ជ្រើសរើសយ៉ាងហោចណាស់ 2 នាក់',
    groupNameRequired: 'ត្រូវបញ្ចូលឈ្មោះក្រុម',
    createFailed: 'មិនអាចបង្កើតក្រុមបានទេ',
    newGroup: 'ក្រុមថ្មី',
    groupDetails: 'ព័ត៌មានក្រុម',
    peopleCapacity: '{{count}}/100 នាក់',
    peopleCount: '{{count}} នាក់',
    addPeople: 'បន្ថែមមនុស្ស',
    addPeopleHelp: 'ស្វែងរកអ្នកអាន ហើយជ្រើសរើសយ៉ាងហោចណាស់ 2 នាក់។ ក្រុមអាចមានសមាជិករហូតដល់ 100 នាក់ រួមទាំងអ្នក។',
    searchPlaceholder: 'ស្វែងរកអ្នកអានតាមឈ្មោះ ឬ @username',
    noReaders: 'រកមិនឃើញអ្នកអាន',
    tryAnother: 'សាកល្បងឈ្មោះ ឬ username ផ្សេង។',
    next: 'បន្ទាប់',
    groupName: 'ឈ្មោះក្រុម',
    groupNamePlaceholder: 'បញ្ចូលឈ្មោះក្រុម',
    creating: 'កំពុងបង្កើត...',
    createGroup: 'បង្កើតក្រុម',
  },
  zh: {
    reader: '读者',
    searchFailed: '无法搜索用户',
    maxPeople: '群聊最多可有 100 人，包括你自己',
    chooseTwo: '请至少选择 2 人',
    groupNameRequired: '请输入群聊名称',
    createFailed: '无法创建群聊',
    newGroup: '新建群聊',
    groupDetails: '群聊详情',
    peopleCapacity: '{{count}}/100 人',
    peopleCount: '{{count}} 人',
    addPeople: '添加成员',
    addPeopleHelp: '搜索读者并至少选择 2 人。群聊最多可有 100 人，包括你自己。',
    searchPlaceholder: '按姓名或 @username 搜索读者',
    noReaders: '未找到读者',
    tryAnother: '请尝试其他姓名或用户名。',
    next: '下一步',
    groupName: '群聊名称',
    groupNamePlaceholder: '输入群聊名称',
    creating: '创建中...',
    createGroup: '创建群聊',
  },
  ja: {
    reader: '読者',
    searchFailed: 'ユーザーを検索できませんでした',
    maxPeople: 'グループはあなたを含め最大100人まで参加できます',
    chooseTwo: '2人以上選択してください',
    groupNameRequired: 'グループ名を入力してください',
    createFailed: 'グループを作成できませんでした',
    newGroup: '新しいグループ',
    groupDetails: 'グループ詳細',
    peopleCapacity: '{{count}}/100人',
    peopleCount: '{{count}}人',
    addPeople: 'メンバーを追加',
    addPeopleHelp: '読者を検索して2人以上選択してください。グループはあなたを含め最大100人まで参加できます。',
    searchPlaceholder: '名前または @username で読者を検索',
    noReaders: '読者が見つかりません',
    tryAnother: '別の名前またはユーザー名をお試しください。',
    next: '次へ',
    groupName: 'グループ名',
    groupNamePlaceholder: 'グループ名を入力',
    creating: '作成中...',
    createGroup: 'グループを作成',
  },
  ko: {
    reader: '독자',
    searchFailed: '사용자를 검색하지 못했습니다',
    maxPeople: '그룹은 본인을 포함해 최대 100명까지 참여할 수 있습니다',
    chooseTwo: '최소 2명을 선택하세요',
    groupNameRequired: '그룹 이름을 입력하세요',
    createFailed: '그룹을 만들지 못했습니다',
    newGroup: '새 그룹',
    groupDetails: '그룹 정보',
    peopleCapacity: '{{count}}/100명',
    peopleCount: '{{count}}명',
    addPeople: '사람 추가',
    addPeopleHelp: '독자를 검색하고 최소 2명을 선택하세요. 그룹은 본인을 포함해 최대 100명까지 참여할 수 있습니다.',
    searchPlaceholder: '이름 또는 @username으로 독자 검색',
    noReaders: '독자를 찾을 수 없습니다',
    tryAnother: '다른 이름이나 사용자 이름을 입력해 보세요.',
    next: '다음',
    groupName: '그룹 이름',
    groupNamePlaceholder: '그룹 이름 입력',
    creating: '만드는 중...',
    createGroup: '그룹 만들기',
  },
})

function GroupAvatar({ user, size = 'h-12 w-12' }) {
  const [failed, setFailed] = useState(false)
  const name =
    user?.name ||
    user?.username ||
    'Reader'
  const letter =
    String(name)
      .trim()
      .charAt(0)
      .toUpperCase() || 'R'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-bold text-white`}
    >
      {user?.avatar_url && !failed ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

function normalizeReader(user) {
  if (
    !user ||
    user.result_type === 'author' ||
    user.author_page_id
  ) {
    return null
  }

  const id =
    user.user_id ||
    user.id

  if (!id) return null

  return {
    id: String(id),
    name:
      user.name ||
      user.username ||
      '',
    username:
      user.username || '',
    avatar_url:
      user.avatar_url || null,
  }
}

export default function ChatGroupCreateSheet({
  open,
  onClose,
  onCreated,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const searchRequestRef = useRef(0)
  const [step, setStep] = useState('members')
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState('')
  const [searchLoading, setSearchLoading] =
    useState(false)
  const [creating, setCreating] =
    useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      searchRequestRef.current += 1
      setStep('members')
      setQuery('')
      setUsers([])
      setSelected([])
      setGroupName('')
      setSearchLoading(false)
      setCreating(false)
      setError('')
      return undefined
    }

    const previousOverflow =
      document.body.style.overflow
    const previousTouchAction =
      document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow =
        previousOverflow
      document.body.style.touchAction =
        previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open || step !== 'members') {
      return undefined
    }

    const searchText = String(query || '')
      .trim()
      .replace(/^@+/, '')

    if (searchText.length < 2) {
      searchRequestRef.current += 1
      setUsers([])
      setSearchLoading(false)
      setError('')
      return undefined
    }

    const requestId =
      searchRequestRef.current + 1
    searchRequestRef.current = requestId

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setSearchLoading(true)
          setError('')

          const data = await searchChatUsers(
            searchText,
            20
          )

          if (
            searchRequestRef.current !==
            requestId
          ) {
            return
          }

          const seen = new Set()
          const readers = (
            Array.isArray(data.users)
              ? data.users
              : []
          )
            .map(normalizeReader)
            .filter(Boolean)
            .filter((user) => {
              if (seen.has(user.id)) {
                return false
              }

              seen.add(user.id)
              return true
            })

          setUsers(readers)
        } catch (searchError) {
          if (
            searchRequestRef.current !==
            requestId
          ) {
            return
          }

          if (searchError.status === 401) {
            onClose?.()
            navigate('/login')
            return
          }

          setUsers([])
          setError(
            searchError.message ||
              t('chatGroupCreateSheet.searchFailed')
          )
        } finally {
          if (
            searchRequestRef.current ===
            requestId
          ) {
            setSearchLoading(false)
          }
        }
      },
      300
    )

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    navigate,
    onClose,
    open,
    query,
    step,
  ])

  const selectedIds = useMemo(
    () =>
      new Set(
        selected.map((user) =>
          String(user.id)
        )
      ),
    [selected]
  )

  const toggleUser = (user) => {
    if (!user?.id || creating) return

    const id = String(user.id)

    if (selectedIds.has(id)) {
      setSelected((current) =>
        current.filter(
          (item) =>
            String(item.id) !== id
        )
      )
      setError('')
      return
    }

    if (selected.length >= 99) {
      setError(
        t('chatGroupCreateSheet.maxPeople')
      )
      return
    }

    setSelected((current) => [
      ...current,
      user,
    ])
    setError('')
  }

  const goToName = () => {
    if (selected.length < 2) {
      setError(
        t('chatGroupCreateSheet.chooseTwo')
      )
      return
    }

    setError('')
    setStep('name')
  }

  const createGroup = async () => {
    if (creating) return

    const safeName = String(
      groupName || ''
    ).trim()

    if (!safeName) {
      setError(t('chatGroupCreateSheet.groupNameRequired'))
      return
    }

    if (selected.length < 2) {
      setStep('members')
      setError(
        t('chatGroupCreateSheet.chooseTwo')
      )
      return
    }

    setCreating(true)
    setError('')

    try {
      const data = await createGroupChat({
        name: safeName,
        memberUserIds: selected.map(
          (user) => user.id
        ),
      })

      const conversationId =
        data?.conversation?.id

      window.dispatchEvent(
        new CustomEvent(
          'shadow-chat-updated'
        )
      )

      onCreated?.(
        data?.conversation || null
      )
      onClose?.()

      if (conversationId) {
        navigate(
          `/chat/${conversationId}`
        )
      }
    } catch (createError) {
      if (createError.status === 401) {
        onClose?.()
        navigate('/login')
        return
      }

      setError(
        createError.message ||
          t('chatGroupCreateSheet.createFailed')
      )
    } finally {
      setCreating(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[330] flex items-end justify-center md:items-center md:px-4">
      <button
        type="button"
        aria-label="Close group chat"
        onClick={() => {
          if (!creating) {
            onClose?.()
          }
        }}
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-2xl md:max-w-[480px] md:rounded-[26px] md:pb-4">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

        <div className="flex min-h-[68px] items-center gap-3 border-b border-[var(--shadow-border)] px-4 md:px-5">
          {step === 'name' ? (
            <button
              type="button"
              onClick={() => {
                if (!creating) {
                  setError('')
                  setStep('members')
                }
              }}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              <UsersRound size={21} />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {step === 'members'
                ? t('chatGroupCreateSheet.newGroup')
                : t('chatGroupCreateSheet.groupDetails')}
            </h2>
            <p className="mt-0.5 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
              {step === 'members'
                ? t('chatGroupCreateSheet.peopleCapacity', { count: selected.length + 1 })
                : t('chatGroupCreateSheet.peopleCount', { count: selected.length + 1 })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!creating) {
                onClose?.()
              }
            }}
            disabled={creating}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] active:scale-90 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-3 rounded-[14px] bg-[#fff0f1] px-4 py-3 text-left text-[11px] font-semibold text-[#c7353d] dark:bg-[#7f1d1d]/25 dark:text-[#fca5a5] md:mx-5"
          >
            {error}
          </button>
        ) : null}

        {step === 'members' ? (
          <>
            {selected.length ? (
              <div className="shadow-chat-scroll flex gap-3 overflow-x-auto border-b border-[var(--shadow-border)] px-4 py-3 md:px-5">
                {selected.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() =>
                      toggleUser(user)
                    }
                    className="flex w-[64px] shrink-0 flex-col items-center"
                  >
                    <span className="relative">
                      <GroupAvatar
                        user={user}
                        size="h-12 w-12"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[#111827] text-white">
                        <X size={10} strokeWidth={3} />
                      </span>
                    </span>
                    <span className="mt-1.5 w-full truncate text-center text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                      {user.name || t('chatGroupCreateSheet.reader')}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="relative px-4 pt-3 md:px-5">
              <Search
                size={19}
                className="pointer-events-none absolute left-8 top-[37px] -translate-y-1/2 text-[var(--shadow-text-secondary)] md:left-9"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value.slice(
                      0,
                      50
                    )
                  )
                }
                placeholder={t('chatGroupCreateSheet.searchPlaceholder')}
                className="h-[48px] w-full rounded-full border border-transparent bg-[var(--shadow-input-bg)] pl-12 pr-4 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-placeholder)] focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
              />
            </div>

            <div className="min-h-[250px] flex-1 overflow-y-auto px-3 pb-2 pt-2 md:px-4">
              {searchLoading ? (
                <div className="flex min-h-[230px] items-center justify-center text-[#7c3aed]">
                  <LoaderCircle
                    size={27}
                    className="animate-spin"
                  />
                </div>
              ) : query
                  .trim()
                  .replace(/^@+/, '')
                  .length < 2 ? (
                <div className="flex min-h-[230px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                    <UserPlus size={26} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('chatGroupCreateSheet.addPeople')}
                  </div>
                  <div className="mt-1 max-w-[300px] text-[11px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                    {t('chatGroupCreateSheet.addPeopleHelp')}
                  </div>
                </div>
              ) : users.length ? (
                <div className="space-y-1 py-1">
                  {users.map((user) => {
                    const checked =
                      selectedIds.has(
                        String(user.id)
                      )

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                          toggleUser(user)
                        }
                        className="flex w-full items-center gap-3 rounded-[16px] px-2 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
                      >
                        <GroupAvatar
                          user={user}
                        />

                        <span className="min-w-0 flex-1">
                          <strong className="block truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
                            {user.name || t('chatGroupCreateSheet.reader')}
                          </strong>
                          <span className="mt-0.5 block truncate text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                            {user.username
                              ? `@${user.username}`
                              : t('chatGroupCreateSheet.reader')}
                          </span>
                        </span>

                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            checked
                              ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                              : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-transparent'
                          }`}
                        >
                          <Check
                            size={15}
                            strokeWidth={3}
                          />
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-[230px] flex-col items-center justify-center px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-input-bg)] text-[var(--shadow-text-secondary)]">
                    <Search size={25} />
                  </span>
                  <div className="mt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('chatGroupCreateSheet.noReaders')}
                  </div>
                  <div className="mt-1 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                    {t('chatGroupCreateSheet.tryAnother')}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--shadow-border)] px-4 pt-3 md:px-5">
              <button
                type="button"
                onClick={goToName}
                disabled={
                  selected.length < 2
                }
                className="h-12 w-full rounded-[15px] bg-[#7c3aed] text-[14px] font-semibold text-white transition active:scale-[0.99] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
              >
                {t('chatGroupCreateSheet.next')}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col px-4 py-5 md:px-5">
            <div className="flex flex-col items-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                <UsersRound size={36} />
              </span>

              <div className="mt-4 text-center text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('chatGroupCreateSheet.peopleCount', { count: selected.length + 1 })}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="shadow-group-name"
                className="mb-2 block text-[12px] font-semibold text-[var(--shadow-text-secondary)]"
              >
                {t('chatGroupCreateSheet.groupName')}
              </label>
              <input
                id="shadow-group-name"
                autoFocus
                value={groupName}
                onChange={(event) =>
                  setGroupName(
                    event.target.value.slice(
                      0,
                      60
                    )
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !creating
                  ) {
                    createGroup()
                  }
                }}
                placeholder={t('chatGroupCreateSheet.groupNamePlaceholder')}
                className="h-[50px] w-full rounded-[15px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-placeholder)] focus:border-[#b8a1ee]"
              />
              <div className="mt-1.5 text-right text-[10px] font-normal text-[var(--shadow-text-tertiary)]">
                {groupName.length}/60
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={createGroup}
                disabled={
                  creating ||
                  !groupName.trim()
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-[#7c3aed] text-[14px] font-semibold text-white transition active:scale-[0.99] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
              >
                {creating ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <UsersRound size={19} />
                )}
                {creating
                  ? t('chatGroupCreateSheet.creating')
                  : t('chatGroupCreateSheet.createGroup')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
