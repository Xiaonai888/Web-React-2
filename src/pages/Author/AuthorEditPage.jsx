import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorEditPage', {
  "en": {
    "notFound": "Author page not found",
    "loadFailed": "Failed to load author page",
    "nameTooShort": "Page name must be at least 2 characters.",
    "usernameTooShort": "Page username must be at least 3 characters.",
    "updateFailed": "Failed to update author page",
    "updated": "Author page updated.",
    "basicInfo": "Basic Page Info",
    "saving": "Saving",
    "save": "Save",
    "intro": "{editText('intro')}",
    "pageName": "Page name",
    "pageNamePlaceholder": "Your public page name",
    "pageUsername": "Page username",
    "usernameHelp": "{editText('usernameHelp')}",
    "bio": "Bio",
    "bioPlaceholder": "Tell readers about your author page.",
    "back": "Back"
  },
  "km": {
    "notFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "loadFailed": "មិនអាចផ្ទុកទំព័រអ្នកនិពន្ធបានទេ",
    "nameTooShort": "ឈ្មោះទំព័រត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ។",
    "usernameTooShort": "ឈ្មោះអ្នកប្រើទំព័រត្រូវមានយ៉ាងហោចណាស់ 3 តួអក្សរ។",
    "updateFailed": "មិនអាចកែប្រែទំព័រអ្នកនិពន្ធបានទេ",
    "updated": "បានកែប្រែទំព័រអ្នកនិពន្ធ។",
    "basicInfo": "ព័ត៌មានមូលដ្ឋានទំព័រ",
    "saving": "កំពុងរក្សាទុក",
    "save": "រក្សាទុក",
    "intro": "កែឈ្មោះទំព័រ ឈ្មោះអ្នកប្រើ និងជីវប្រវត្តិខ្លីរបស់អ្នក។",
    "pageName": "ឈ្មោះទំព័រ",
    "pageNamePlaceholder": "ឈ្មោះទំព័រសាធារណៈរបស់អ្នក",
    "pageUsername": "ឈ្មោះអ្នកប្រើទំព័រ",
    "usernameHelp": "ប្រើតែអក្សរអង់គ្លេសតូច លេខ និងសញ្ញា underscore ប៉ុណ្ណោះ។",
    "bio": "ជីវប្រវត្តិ",
    "bioPlaceholder": "ប្រាប់អ្នកអានអំពីទំព័រអ្នកនិពន្ធរបស់អ្នក។",
    "back": "ត្រឡប់ក្រោយ"
  },
  "zh": {
    "notFound": "未找到作者页面",
    "loadFailed": "无法加载作者页面",
    "nameTooShort": "页面名称至少需要 2 个字符。",
    "usernameTooShort": "页面用户名至少需要 3 个字符。",
    "updateFailed": "无法更新作者页面",
    "updated": "作者页面已更新。",
    "basicInfo": "页面基本信息",
    "saving": "正在保存",
    "save": "保存",
    "intro": "更新页面名称、用户名和简短简介。",
    "pageName": "页面名称",
    "pageNamePlaceholder": "你的公开页面名称",
    "pageUsername": "页面用户名",
    "usernameHelp": "仅使用小写英文字母、数字和下划线。",
    "bio": "简介",
    "bioPlaceholder": "向读者介绍你的作者页面。",
    "back": "返回"
  },
  "ja": {
    "notFound": "作者ページが見つかりません",
    "loadFailed": "作者ページを読み込めませんでした",
    "nameTooShort": "ページ名は2文字以上にしてください。",
    "usernameTooShort": "ページユーザー名は3文字以上にしてください。",
    "updateFailed": "作者ページを更新できませんでした",
    "updated": "作者ページを更新しました。",
    "basicInfo": "ページ基本情報",
    "saving": "保存中",
    "save": "保存",
    "intro": "ページ名、ユーザー名、短い自己紹介を更新します。",
    "pageName": "ページ名",
    "pageNamePlaceholder": "公開ページ名",
    "pageUsername": "ページユーザー名",
    "usernameHelp": "小文字の英字、数字、アンダースコアのみ使用できます。",
    "bio": "自己紹介",
    "bioPlaceholder": "作者ページについて読者に紹介してください。",
    "back": "戻る"
  },
  "ko": {
    "notFound": "작가 페이지를 찾을 수 없습니다",
    "loadFailed": "작가 페이지를 불러오지 못했습니다",
    "nameTooShort": "페이지 이름은 2자 이상이어야 합니다.",
    "usernameTooShort": "페이지 사용자 이름은 3자 이상이어야 합니다.",
    "updateFailed": "작가 페이지를 업데이트하지 못했습니다",
    "updated": "작가 페이지가 업데이트되었습니다.",
    "basicInfo": "페이지 기본 정보",
    "saving": "저장 중",
    "save": "저장",
    "intro": "페이지 이름, 사용자 이름, 짧은 소개를 업데이트하세요.",
    "pageName": "페이지 이름",
    "pageNamePlaceholder": "공개 페이지 이름",
    "pageUsername": "페이지 사용자 이름",
    "usernameHelp": "소문자 영문자, 숫자, 밑줄만 사용하세요.",
    "bio": "소개",
    "bioPlaceholder": "독자에게 작가 페이지를 소개하세요.",
    "back": "뒤로"
  }
})

function editText(key, options) {
  return getDisplayText(`authorEditPage.${key}`, options)
}

import {
  fetchMyAuthorPageCached,
  invalidateMyAuthorPageClientCache,
} from '../../services/myAuthorPageClientCache.js'
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

function normalizeUsername(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
}

export default function AuthorEditPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSettings = new URLSearchParams(location.search).get('from') === 'settings'
  const returnTo =
  location.state?.returnTo ||
  (fromSettings ? '/author/page-options' : '/author/page-settings')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')
  const redirectTimerRef = useRef(null)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadAuthorPage() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const data = await fetchMyAuthorPageCached({
          apiBaseUrl: API_BASE_URL,
          token,
          signal: controller.signal,
        })

        if (
          !data.has_author_page ||
          !data.author_page
        ) {
          throw new Error(editText('notFound'))
        }

        if (ignore) return

        setPageName(data.author_page.page_name || '')
        setPageUsername(data.author_page.page_username || '')
        setBio(data.author_page.bio || '')
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !ignore
        ) {
          setMessage(
            error.message || editText('loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAuthorPage()

    return () => {
      ignore = true
      controller.abort()

      if (redirectTimerRef.current) {
        window.clearTimeout(
          redirectTimerRef.current
        )
      }
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()

    const token = getAuthToken()
    const nextPageName = pageName.trim()
    const nextPageUsername = normalizeUsername(pageUsername)
    const nextBio = bio.trim()

    if (!token) {
      navigate('/login')
      return
    }

    if (nextPageName.length < 2) {
      setMessage(editText('nameTooShort'))
      return
    }

    if (nextPageUsername.length < 3) {
      setMessage(editText('usernameTooShort'))
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: nextPageName,
          page_username: nextPageUsername,
          bio: nextBio,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || editText('updateFailed'))
      }

      invalidateMyAuthorPageClientCache()

      if (data.author_page) {
        localStorage.setItem(
          'shadow_author_page',
          JSON.stringify(data.author_page)
        )
      }

      setMessage(editText('updated'))

      if (redirectTimerRef.current) {
        window.clearTimeout(
          redirectTimerRef.current
        )
      }

      redirectTimerRef.current =
        window.setTimeout(() => {
          navigate(returnTo, { replace: true })
        }, 700)
    } catch (error) {
      setMessage(error.message || editText('updateFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)]">
<div className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
  <div className="mx-auto flex h-12 max-w-[680px] items-center justify-between px-4">
    <button
      type="button"
      onClick={() => navigate(returnTo, { replace: true })}
      aria-label={editText('back')}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
    >
      <i className="fa-solid fa-chevron-left text-[13px]" />
    </button>

    <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{editText('basicInfo')}</div>

    <button
      type="submit"
      form="basic-page-info-form"
      disabled={loading || saving}
      className="h-9 rounded-full bg-[var(--shadow-bg-soft)] px-4 text-[12px] font-semibold text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
    >
      {saving ? editText('saving') : editText('save')}
    </button>
  </div>
</div>

<main className="mx-auto max-w-[680px] bg-[var(--shadow-bg-surface)] px-6 pb-10 pt-5">
  <form id="basic-page-info-form" onSubmit={handleSubmit} className="space-y-5">
    <div>
      <h1 className="text-[18px] font-semibold text-[var(--shadow-text-primary)]">{editText('basicInfo')}</h1>
      <p className="mt-1 text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
        {editText('intro')}
      </p>
    </div>

    {message ? (
      <div className="rounded-[12px] bg-[#fff7ed] px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412]">
        {message}
      </div>
    ) : null}

    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{editText('pageName')}</label>
        <input
          value={pageName}
          onChange={(event) => setPageName(event.target.value)}
          disabled={loading || saving}
          placeholder={editText('pageNamePlaceholder')}
          className="h-11 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#111827] disabled:bg-[var(--shadow-bg-soft)]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{editText('pageUsername')}</label>
        <div className="flex h-11 items-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 focus-within:border-[#111827]">
          <span className="shrink-0 text-[14px] font-normal text-[var(--shadow-text-tertiary)]">@</span>
          <input
            value={pageUsername}
            onChange={(event) => setPageUsername(normalizeUsername(event.target.value))}
            disabled={loading || saving}
            placeholder="page_username"
            className="h-full min-w-0 flex-1 bg-transparent pl-1 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none disabled:bg-transparent"
          />
        </div>
        <p className="mt-1.5 text-[11.5px] font-normal leading-4 text-[var(--shadow-text-tertiary)]">
          {editText('usernameHelp')}
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{editText('bio')}</label>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          disabled={loading || saving}
          maxLength={240}
          placeholder={editText('bioPlaceholder')}
          className="min-h-[116px] w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[#111827] disabled:bg-[var(--shadow-bg-soft)]"
        />
        <div className="mt-1.5 text-right text-[11px] font-normal text-[var(--shadow-text-tertiary)]">{bio.length}/240</div>
      </div>
    </div>

   
  </form>
</main>
    </div>
  )
}
