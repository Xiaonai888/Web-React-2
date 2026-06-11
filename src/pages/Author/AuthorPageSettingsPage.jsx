import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCategoryForUi(category) {
  return {
    id: category.id,
    name: category.name || '',
    sortOrder: Number(category.sort_order || 0),
    isDefault: Boolean(category.is_default),
    isHidden: Boolean(category.is_hidden),
  }
}

function withSystemCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : []
  const hasSoldOut = safeCategories.some((category) => category.name === 'Sold out')

  if (hasSoldOut) return safeCategories

  return [
    ...safeCategories,
    {
      id: 'system-sold-out',
      name: 'Sold out',
      sortOrder: safeCategories.length,
      isDefault: true,
      isHidden: false,
    },
  ]
}

async function fetchMyCategories() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load categories')
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}

async function createStoreCategory(name) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create category')
  }

  return data.category ? formatCategoryForUi(data.category) : null
}

async function updateStoreCategory(categoryId, updates) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update category')
  }

  return data.category ? formatCategoryForUi(data.category) : null
}

async function deleteStoreCategory(categoryId) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to delete category')
  }

  return data
}

async function reorderStoreCategories(categoryIds) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ category_ids: categoryIds }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to save category order')
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}

async function fetchTelegramSettings() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load Telegram settings')
  }

  return data.telegram_settings || {}
}

async function createTelegramConnectLink() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/connect-link`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to create Telegram connect link')
  }

  return data
}

async function unlinkTelegramGroup() {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/unlink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to unlink Telegram group')
  }

  return data.telegram_settings || {}
}

function ToolRow({ icon, label, subtext, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-2.5 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[18px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[#111827]">{label}</span>
        {subtext ? (
          <span className="mt-0.5 block text-[11px] font-normal text-[#8b93a1]">
            {subtext}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorPageSettingsPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [settingsView, setSettingsView] = useState('home')

  const [storeCategories, setStoreCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState('')

  const [telegramBotUsername, setTelegramBotUsername] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [telegramChatTitle, setTelegramChatTitle] = useState('')
  const [telegramLinkedAt, setTelegramLinkedAt] = useState('')
  const [telegramConnecting, setTelegramConnecting] = useState(false)
  const [telegramUnlinking, setTelegramUnlinking] = useState(false)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramMessage, setTelegramMessage] = useState('')

  const customCategoryCount = storeCategories.filter((category) => !category.isDefault).length
  const canCreateCustomCategory = customCategoryCount < 5

  useEffect(() => {
    let ignore = false

    async function loadTelegramSettings() {
      try {
        setTelegramLoading(true)

        const settings = await fetchTelegramSettings()

        if (!ignore) {
          setTelegramBotUsername(settings.bot_username || '')
          setTelegramChatId(settings.chat_id || '')
          setTelegramChatTitle(settings.chat_title || '')
          setTelegramLinkedAt(settings.linked_at || '')
        }
      } catch {
      } finally {
        if (!ignore) setTelegramLoading(false)
      }
    }

    loadTelegramSettings()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadCategories() {
      try {
        setCategoryLoading(true)
        setCategoryError('')

        const categories = await fetchMyCategories()

        if (!ignore) {
          setStoreCategories(categories)
        }
      } catch (error) {
        if (!ignore) {
          setCategoryError(error.message || 'Failed to load categories')
        }
      } finally {
        if (!ignore) setCategoryLoading(false)
      }
    }

    loadCategories()

    return () => {
      ignore = true
    }
  }, [])

  async function addCategory() {
    const name = newCategory.trim()

    if (!name || categorySaving || !canCreateCustomCategory) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const category = await createStoreCategory(name)

      if (category) {
        setStoreCategories((current) => [...current, category])
      }

      setNewCategory('')
    } catch (error) {
      setCategoryError(error.message || 'Failed to create category')
    } finally {
      setCategorySaving(false)
    }
  }

  function startEditCategory(category) {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  function cancelEditCategory() {
    setEditingCategoryId('')
    setEditingCategoryName('')
  }

  async function saveEditCategory(category) {
    const name = editingCategoryName.trim()

    if (!name || categorySaving || category.isDefault) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const updated = await updateStoreCategory(category.id, { name })

      if (updated) {
        setStoreCategories((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )
      }

      cancelEditCategory()
    } catch (error) {
      setCategoryError(error.message || 'Failed to update category')
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleDeleteCategory(category) {
    if (category.isDefault || categorySaving) return

    const confirmed = window.confirm(`Delete "${category.name}" category?`)
    if (!confirmed) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      await deleteStoreCategory(category.id)

      setStoreCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (error) {
      setCategoryError(error.message || 'Failed to delete category')
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleToggleHideCategory(category) {
    if (categorySaving) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const updated = await updateStoreCategory(category.id, {
        is_hidden: !category.isHidden,
      })

      if (updated) {
        setStoreCategories((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    } catch (error) {
      setCategoryError(error.message || 'Failed to update category')
    } finally {
      setCategorySaving(false)
    }
  }

  function moveCategory(index, direction) {
    setStoreCategories((current) => {
      const next = [...current]
      const targetIndex = index + direction

      if (targetIndex < 0 || targetIndex >= next.length) return current

      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)

      return next
    })
  }

  async function saveCategoryOrder() {
    try {
      setCategorySaving(true)
      setCategoryError('')

      const ids = storeCategories
        .filter((category) => !String(category.id).startsWith('system-'))
        .map((category) => category.id)

      const categories = await reorderStoreCategories(ids)

      setStoreCategories(categories)
      setMessage('Category order saved.')
      setSettingsView('home')
    } catch (error) {
      setCategoryError(error.message || 'Failed to save category order')
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleCreateTelegramConnectLink() {
    try {
      setTelegramConnecting(true)
      setTelegramMessage('')

      const data = await createTelegramConnectLink()
      const settings = data.telegram_settings || {}
      const connectUrl = data.telegram_connect?.connect_url || ''

      setTelegramBotUsername(settings.bot_username || telegramBotUsername)
      setTelegramChatId(settings.chat_id || telegramChatId)
      setTelegramChatTitle(settings.chat_title || telegramChatTitle)
      setTelegramLinkedAt(settings.linked_at || telegramLinkedAt)

      if (connectUrl) {
        window.location.href = connectUrl
        return
      }

      setTelegramMessage('Telegram connect link was created, but the link was missing.')
    } catch (error) {
      setTelegramMessage(error.message || 'Failed to open Telegram connect link.')
    } finally {
      setTelegramConnecting(false)
    }
  }

  async function handleUnlinkTelegramGroup() {
    try {
      setTelegramUnlinking(true)
      setTelegramMessage('')

      const settings = await unlinkTelegramGroup()

      setTelegramBotUsername(settings.bot_username || telegramBotUsername)
      setTelegramChatId(settings.chat_id || '')
      setTelegramChatTitle(settings.chat_title || '')
      setTelegramLinkedAt(settings.linked_at || '')
      setTelegramMessage('Telegram group unlinked. You can connect a new group now.')
    } catch (error) {
      setTelegramMessage(error.message || 'Failed to unlink Telegram group.')
    } finally {
      setTelegramUnlinking(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => {
              if (settingsView !== 'home') {
                setSettingsView('home')
                return
              }

              navigate(-1)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <h1 className="text-[16px] font-semibold text-[#111827]">
            {settingsView === 'telegram'
              ? 'Telegram Bot'
              : settingsView === 'categories'
                ? 'Category Management'
                : 'Page Settings'}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 py-4">
        {settingsView === 'categories' ? (
          <section className="space-y-4">
            <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-black text-[#111827]">
                    Create custom category
                  </h2>
                  <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                    You can create up to 5 custom categories.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#111827]">
                  {customCategoryCount}/5
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder={canCreateCustomCategory ? 'Category name' : 'Custom category limit reached'}
                  disabled={!canCreateCustomCategory}
                  className="h-11 min-w-0 flex-1 rounded-2xl border border-[#d9e1ec] bg-white px-3 text-[13px] font-bold text-[#111827] outline-none focus:border-[#111827] disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={addCategory}
                  disabled={categorySaving || !newCategory.trim() || !canCreateCustomCategory}
                  className="h-11 shrink-0 rounded-2xl bg-[#111827] px-4 text-[12px] font-black text-white disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              {!canCreateCustomCategory ? (
                <p className="mt-2 text-[11px] font-bold text-[#e5484d]">
                  Custom category limit reached. Delete one custom category before creating a new one.
                </p>
              ) : null}
            </section>

            <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[16px] font-black text-[#111827]">Categories</h2>

                <button
                  type="button"
                  onClick={saveCategoryOrder}
                  disabled={categorySaving || !storeCategories.length}
                  className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
                >
                  Save order
                </button>
              </div>

              {categoryError ? (
                <button
                  type="button"
                  onClick={() => setCategoryError('')}
                  className="mb-3 w-full rounded-2xl bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
                >
                  {categoryError}
                </button>
              ) : null}

              {categoryLoading ? (
                <div className="rounded-2xl bg-[#f8fafc] p-6 text-center text-[12px] font-bold text-[#8b93a1] ring-1 ring-black/5">
                  Loading categories...
                </div>
              ) : (
                <div className="space-y-2">
                  {withSystemCategories(storeCategories).map((category, index, list) => {
                    const editing = editingCategoryId === category.id
                    const isSystem = String(category.id).startsWith('system-')
                    const canEdit = !category.isDefault && !isSystem
                    const menuOpen = openCategoryMenuId === category.id

                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl bg-[#f8fafc] px-3 py-3 ring-1 ring-black/5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            {editing ? (
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(event) => setEditingCategoryName(event.target.value)}
                                className="h-10 w-full rounded-xl border border-[#d9e1ec] bg-white px-3 text-[13px] font-black text-[#111827] outline-none focus:border-[#111827]"
                              />
                            ) : (
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="truncate text-[13px] font-black text-[#111827]">
                                  {category.name}
                                </span>

                                {category.isDefault || isSystem ? (
                                  <span className="shrink-0 rounded-full bg-[#eef3f8] px-2 py-0.5 text-[9px] font-black text-[#42526b]">
                                    System
                                  </span>
                                ) : null}

                                {category.isHidden ? (
                                  <span className="shrink-0 rounded-full bg-[#fff1f2] px-2 py-0.5 text-[9px] font-black text-[#b91c1c]">
                                    Hidden
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>

                          {editing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEditCategory(category)}
                                disabled={categorySaving}
                                className="h-9 rounded-xl bg-[#111827] px-3 text-[11px] font-black text-white disabled:opacity-50"
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditCategory}
                                className="h-9 rounded-xl bg-white px-3 text-[11px] font-black text-[#111827] ring-1 ring-black/10"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => moveCategory(index, -1)}
                                disabled={index === 0 || categorySaving}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#111827] ring-1 ring-black/10 disabled:opacity-30"
                              >
                                <i className="fa-solid fa-arrow-up text-[11px]" />
                              </button>

                              <button
                                type="button"
                                onClick={() => moveCategory(index, 1)}
                                disabled={index === list.length - 1 || categorySaving}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#111827] ring-1 ring-black/10 disabled:opacity-30"
                              >
                                <i className="fa-solid fa-arrow-down text-[11px]" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleHideCategory(category)}
                                disabled={categorySaving || isSystem}
                                className="h-9 rounded-xl bg-white px-3 text-[11px] font-black text-[#111827] ring-1 ring-black/10 disabled:opacity-40"
                              >
                                {category.isHidden ? 'Show' : 'Hide'}
                              </button>

                              {canEdit ? (
                                <button
                                  type="button"
                                  onClick={() => startEditCategory(category)}
                                  className="h-9 rounded-xl bg-white px-3 text-[11px] font-black text-[#111827] ring-1 ring-black/10"
                                >
                                  Edit
                                </button>
                              ) : null}

                              {canEdit ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(category)}
                                  disabled={categorySaving}
                                  className="h-9 rounded-xl bg-[#fff1f1] px-3 text-[11px] font-black text-[#e5484d] disabled:opacity-40"
                                >
                                  Delete
                                </button>
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </section>
        ) : settingsView === 'telegram' ? (
          <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
            <div className="bg-gradient-to-br from-[#dff6ff] via-[#eefaff] to-white px-4 py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#229ed9] shadow-sm ring-1 ring-black/5">
                <i className="fa-brands fa-telegram text-[30px]" />
              </div>

              <h2 className="mt-3 text-[17px] font-black text-[#111827]">
                Receive Telegram Notifications
              </h2>

              <p className="mx-auto mt-1 max-w-[380px] text-[12px] font-semibold leading-5 text-[#6b7280]">
                Link this author page to one Telegram group for order approval alerts.
                You can change groups only after unlinking the current one.
              </p>
            </div>

            <div className="space-y-4 p-4">
              {telegramMessage ? (
                <button
                  type="button"
                  onClick={() => setTelegramMessage('')}
                  className="w-full rounded-2xl bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold text-[#111827] ring-1 ring-black/5"
                >
                  {telegramMessage}
                </button>
              ) : null}

              {telegramChatId ? (
                <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f7ff] text-[#229ed9] ring-1 ring-[#229ed9]/20">
                      <i className="fa-brands fa-telegram text-[22px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8b93a1]">
                        Linked group
                      </div>

                      <div className="mt-1 truncate text-[16px] font-black text-[#111827]">
                        {telegramChatTitle || 'Telegram group'}
                      </div>

                      <div className="mt-1 text-[12px] font-bold text-[#6b7280]">
                        Group ID: {telegramChatId}
                      </div>

                      {telegramLinkedAt ? (
                        <div className="mt-1 text-[11px] font-semibold text-[#8b93a1]">
                          Linked: {new Date(telegramLinkedAt).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#f8fafc] px-4 py-3 text-[12px] font-semibold leading-5 text-[#6b7280]">
                    This author page can use only one Telegram group. To connect another group,
                    unlink this group first.
                  </div>

                  <button
                    type="button"
                    onClick={handleUnlinkTelegramGroup}
                    disabled={telegramUnlinking || telegramLoading}
                    className="mt-4 h-12 w-full rounded-full bg-[#fff1f2] text-[13px] font-black text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-60"
                  >
                    {telegramUnlinking ? 'Unlinking...' : 'Unlink group'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-dashed border-[#b8c2d6] bg-white p-4">
                    <div className="text-[12px] font-black text-[#111827]">
                      How to connect
                    </div>

                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12px] font-semibold leading-5 text-[#6b7280]">
                      <li>Tap Connect Telegram Group.</li>
                      <li>Telegram will open and ask you to choose a group.</li>
                      <li>Add @{telegramBotUsername || 'ShadowAuthorStoreNotifyBot'} to that group.</li>
                      <li>The bot will confirm when the group is linked.</li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateTelegramConnectLink}
                    disabled={telegramConnecting || telegramLoading}
                    className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[#aeb6c4]"
                  >
                    {telegramConnecting
                      ? 'Opening Telegram...'
                      : telegramLoading
                        ? 'Loading...'
                        : 'Connect Telegram Group'}
                  </button>
                </>
              )}
            </div>
          </section>
        ) : (
          <>
            {message ? (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="mb-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
              >
                {message}
              </button>
            ) : null}

            <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
              <ToolRow
                icon="fa-solid fa-layer-group"
                label="Category Management"
                subtext="Categories, hidden sections, and order."
                onClick={() => setSettingsView('categories')}
              />

              <ToolRow
                icon="fa-solid fa-truck-fast"
                label="Delivery Company"
                subtext="J&T fee, VET fee, and checkout delivery."
                onClick={() => setMessage('Coming soon.')}
              />
            </section>

            <div className="mt-6 px-1 text-[18px] font-semibold text-[#b6b6bd]">
              Payment Alerts
            </div>

            <section className="mt-3 overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-black/5">
              <ToolRow
                icon="fa-regular fa-paper-plane"
                label="Telegram Bot"
                subtext=""
                onClick={() => setSettingsView('telegram')}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
