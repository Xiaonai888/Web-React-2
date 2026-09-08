import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorPageShareSheet from '../../components/AuthorPageShareSheet'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorReaderPageOptions', {
  "en": {
    "back": "Back",
    "authorPage": "Author Page",
    "notFound": "Author page not found",
    "loadFailed": "Failed to load Author Page",
    "pageLinkCopied": "Page link copied.",
    "unableReport": "Unable to open Report Page.",
    "blockFailed": "Failed to block Author Page",
    "unblockFailed": "Failed to unblock Author Page",
    "blocked": "{{name}} blocked.",
    "unblocked": "{{name}} unblocked.",
    "loading": "Loading...",
    "reportPage": "Report Page",
    "help": "Help {{name}}",
    "checking": "Checking...",
    "unblock": "Unblock",
    "block": "Block",
    "searchThisPage": "Search this Page",
    "inviteFriends": "Invite friends",
    "sharePage": "Share Page",
    "pageLinkTitle": "{{name}}’s Page link",
    "shareDescription": "Share this personalized Shadow Page link.",
    "copyLink": "Copy link",
    "closeConfirmation": "Close block confirmation",
    "unblockTitle": "Unblock {{name}}?",
    "blockTitle": "Block {{name}}?",
    "unblockDescription": "This will unblock both the Author Page and its Reader account.",
    "blockDescription": "This will block both the Author Page and its Reader account, including direct messages between both accounts.",
    "cancel": "Cancel",
    "pleaseWait": "Please wait..."
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "notFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "loadFailed": "មិនអាចផ្ទុកទំព័រអ្នកនិពន្ធបាន",
    "pageLinkCopied": "បានចម្លងតំណទំព័រ។",
    "unableReport": "មិនអាចបើកទំព័ររាយការណ៍បាន។",
    "blockFailed": "មិនអាច Block ទំព័រអ្នកនិពន្ធបាន",
    "unblockFailed": "មិនអាច Unblock ទំព័រអ្នកនិពន្ធបាន",
    "blocked": "បាន Block {{name}}។",
    "unblocked": "បាន Unblock {{name}}។",
    "loading": "កំពុងផ្ទុក...",
    "reportPage": "រាយការណ៍ទំព័រ",
    "help": "ជួយ {{name}}",
    "checking": "កំពុងពិនិត្យ...",
    "unblock": "Unblock",
    "block": "Block",
    "searchThisPage": "ស្វែងរកក្នុងទំព័រនេះ",
    "inviteFriends": "អញ្ជើញមិត្តភក្តិ",
    "sharePage": "ចែករំលែកទំព័រ",
    "pageLinkTitle": "តំណទំព័ររបស់ {{name}}",
    "shareDescription": "ចែករំលែកតំណ Shadow Page ផ្ទាល់ខ្លួននេះ។",
    "copyLink": "ចម្លងតំណ",
    "closeConfirmation": "បិទការបញ្ជាក់ Block",
    "unblockTitle": "Unblock {{name}}?",
    "blockTitle": "Block {{name}}?",
    "unblockDescription": "វានឹង Unblock ទាំងទំព័រអ្នកនិពន្ធ និងគណនីអ្នកអានរបស់គេ។",
    "blockDescription": "វានឹង Block ទាំងទំព័រអ្នកនិពន្ធ និងគណនីអ្នកអាន រួមទាំងសារផ្ទាល់រវាងគណនីទាំងពីរ។",
    "cancel": "បោះបង់",
    "pleaseWait": "សូមរង់ចាំ..."
  },
  "zh": {
    "back": "返回",
    "authorPage": "作者主页",
    "notFound": "未找到作者主页",
    "loadFailed": "无法加载作者主页",
    "pageLinkCopied": "主页链接已复制。",
    "unableReport": "无法打开举报页面。",
    "blockFailed": "无法屏蔽作者主页",
    "unblockFailed": "无法取消屏蔽作者主页",
    "blocked": "已屏蔽 {{name}}。",
    "unblocked": "已取消屏蔽 {{name}}。",
    "loading": "加载中...",
    "reportPage": "举报主页",
    "help": "帮助 {{name}}",
    "checking": "检查中...",
    "unblock": "取消屏蔽",
    "block": "屏蔽",
    "searchThisPage": "搜索此主页",
    "inviteFriends": "邀请朋友",
    "sharePage": "分享主页",
    "pageLinkTitle": "{{name}} 的主页链接",
    "shareDescription": "分享这个个性化 Shadow 主页链接。",
    "copyLink": "复制链接",
    "closeConfirmation": "关闭屏蔽确认",
    "unblockTitle": "取消屏蔽 {{name}}？",
    "blockTitle": "屏蔽 {{name}}？",
    "unblockDescription": "这将同时取消屏蔽作者主页及其读者账号。",
    "blockDescription": "这将同时屏蔽作者主页及其读者账号，包括两个账号之间的私信。",
    "cancel": "取消",
    "pleaseWait": "请稍候..."
  },
  "ja": {
    "back": "戻る",
    "authorPage": "著者ページ",
    "notFound": "著者ページが見つかりません",
    "loadFailed": "著者ページを読み込めませんでした",
    "pageLinkCopied": "ページリンクをコピーしました。",
    "unableReport": "報告ページを開けません。",
    "blockFailed": "著者ページをブロックできませんでした",
    "unblockFailed": "著者ページのブロックを解除できませんでした",
    "blocked": "{{name}} をブロックしました。",
    "unblocked": "{{name}} のブロックを解除しました。",
    "loading": "読み込み中...",
    "reportPage": "ページを報告",
    "help": "{{name}} を応援",
    "checking": "確認中...",
    "unblock": "ブロック解除",
    "block": "ブロック",
    "searchThisPage": "このページを検索",
    "inviteFriends": "友達を招待",
    "sharePage": "ページを共有",
    "pageLinkTitle": "{{name}} のページリンク",
    "shareDescription": "この個人用 Shadow Page リンクを共有します。",
    "copyLink": "リンクをコピー",
    "closeConfirmation": "ブロック確認を閉じる",
    "unblockTitle": "{{name}} のブロックを解除しますか？",
    "blockTitle": "{{name}} をブロックしますか？",
    "unblockDescription": "著者ページとその読者アカウントの両方をブロック解除します。",
    "blockDescription": "著者ページと読者アカウントの両方をブロックし、両アカウント間のダイレクトメッセージも対象になります。",
    "cancel": "キャンセル",
    "pleaseWait": "お待ちください..."
  },
  "ko": {
    "back": "뒤로",
    "authorPage": "작가 페이지",
    "notFound": "작가 페이지를 찾을 수 없습니다",
    "loadFailed": "작가 페이지를 불러오지 못했습니다",
    "pageLinkCopied": "페이지 링크를 복사했습니다.",
    "unableReport": "신고 페이지를 열 수 없습니다.",
    "blockFailed": "작가 페이지를 차단하지 못했습니다",
    "unblockFailed": "작가 페이지 차단을 해제하지 못했습니다",
    "blocked": "{{name}}을(를) 차단했습니다.",
    "unblocked": "{{name}}의 차단을 해제했습니다.",
    "loading": "불러오는 중...",
    "reportPage": "페이지 신고",
    "help": "{{name}} 돕기",
    "checking": "확인 중...",
    "unblock": "차단 해제",
    "block": "차단",
    "searchThisPage": "이 페이지 검색",
    "inviteFriends": "친구 초대",
    "sharePage": "페이지 공유",
    "pageLinkTitle": "{{name}}의 페이지 링크",
    "shareDescription": "이 개인화된 Shadow Page 링크를 공유하세요.",
    "copyLink": "링크 복사",
    "closeConfirmation": "차단 확인 닫기",
    "unblockTitle": "{{name}} 차단을 해제할까요?",
    "blockTitle": "{{name}}을(를) 차단할까요?",
    "unblockDescription": "작가 페이지와 해당 독자 계정의 차단을 모두 해제합니다.",
    "blockDescription": "작가 페이지와 독자 계정을 모두 차단하며 두 계정 간의 다이렉트 메시지도 포함됩니다.",
    "cancel": "취소",
    "pleaseWait": "잠시 기다려 주세요..."
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function ActionRow({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[58px] w-full items-center gap-3 px-4 text-left active:bg-[var(--shadow-bg-soft)] disabled:opacity-55"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[18px]`} />
      </span>
      <span className="min-w-0 flex-1 text-[14px] font-normal text-[var(--shadow-text-primary)]">
        {label}
      </span>
    </button>
  )
}

export default function AuthorReaderPageOptionsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()
  const [authorPage, setAuthorPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [blocked, setBlocked] = useState(false)
  const [blockStatusLoading, setBlockStatusLoading] = useState(false)
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false)
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockError, setBlockError] = useState('')
  const [shareOpen, setShareOpen] = useState(false)

  const pageName = authorPage?.page_name || authorPage?.name || t('authorReaderPageOptions.authorPage')
  const pageId = authorPage?.id || ''
  const publicPath = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
  const pageLink = useMemo(() => `${window.location.origin}${publicPath}`, [publicPath])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setMessage('')

        const token = getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('authorReaderPageOptions.notFound'))
        }

        const page = data.author_page || data.author || data.page || null

        if (!page) throw new Error(getDisplayText('authorReaderPageOptions.notFound'))
        if (!ignore) setAuthorPage(page)

        if (token) {
          try {
            if (!ignore) setBlockStatusLoading(true)

            const statusResponse = await fetch(
              `${API_BASE_URL}/api/authors/page/${encodeURIComponent(page.page_username || pageUsername || '')}/block-status`,
              {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal,
              }
            )
            const statusData = await statusResponse.json().catch(() => ({}))

            if (statusResponse.ok && statusData.ok !== false && !ignore) {
              setBlocked(Boolean(statusData.block_status?.is_blocked))
            }
          } finally {
            if (!ignore) setBlockStatusLoading(false)
          }
        }
      } catch (error) {
        if (!ignore && error?.name !== 'AbortError') {
          setMessage(error.message || getDisplayText('authorReaderPageOptions.loadFailed'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [pageUsername])

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(pageLink)
      setMessage(t('authorReaderPageOptions.pageLinkCopied'))
    } catch {
      setMessage(pageLink)
    }
  }

  function searchThisPage() {
    navigate(`/author/page/${pageUsername}/search`)
  }

  function openReportPage() {
    if (!pageId) {
      setMessage(t('authorReaderPageOptions.unableReport'))
      return
    }

    navigate(`/report/author_page/${pageId}`, {
      state: {
        targetTitle: pageName,
        sourceUrl: pageLink,
        returnTo: `/author/page/${pageUsername}/options`,
      },
    })
  }

  function openBlockConfirmation() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    setBlockError('')
    setBlockConfirmOpen(true)
  }

  async function handleBlockAction() {
    const token = getAuthToken()
    const username = authorPage?.page_username || pageUsername

    if (!token) {
      setBlockConfirmOpen(false)
      navigate('/login')
      return
    }

    if (!username || blockLoading) return

    try {
      setBlockLoading(true)
      setBlockError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/block`,
        {
          method: blocked ? 'DELETE' : 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (blocked ? getDisplayText('authorReaderPageOptions.unblockFailed') : getDisplayText('authorReaderPageOptions.blockFailed'))
        )
      }

      const nextBlocked = Boolean(data.block_status?.is_blocked)
      setBlocked(nextBlocked)
      setBlockConfirmOpen(false)
      setMessage(
        data.message || (nextBlocked ? getDisplayText('authorReaderPageOptions.blocked', { name: pageName }) : getDisplayText('authorReaderPageOptions.unblocked', { name: pageName }))
      )

      if (nextBlocked) {
        window.setTimeout(() => navigate('/discover'), 350)
      }
    } catch (error) {
      setBlockError(
        error.message ||
          (blocked ? getDisplayText('authorReaderPageOptions.unblockFailed') : getDisplayText('authorReaderPageOptions.blockFailed'))
      )
    } finally {
      setBlockLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-8">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex min-h-[66px] max-w-[720px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorReaderPageOptions.back')}
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <div className="min-w-0 flex-1 px-1">
            <h1 className="truncate text-[17px] font-bold text-[var(--shadow-text-primary)]">
              {loading ? t('authorReaderPageOptions.loading') : pageName}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px]">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full border-b border-[var(--shadow-border)] bg-[#fff7d6] px-4 py-3 text-left text-[13px] font-normal text-[var(--shadow-text-primary)]"
          >
            {message}
          </button>
        ) : null}

        <section className="mt-2 bg-[var(--shadow-bg-surface)]">
          <ActionRow icon="fa-regular fa-flag" label={t('authorReaderPageOptions.reportPage')} onClick={openReportPage} />
          <ActionRow
  icon="fa-regular fa-heart"
  label={t('authorReaderPageOptions.help', { name: pageName })}
  onClick={() => navigate(`/author/page/${pageUsername}/help`)}
/>
          <ActionRow
            icon={blocked ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}
            label={blockStatusLoading ? t('authorReaderPageOptions.checking') : blocked ? t('authorReaderPageOptions.unblock') : t('authorReaderPageOptions.block')}
            onClick={openBlockConfirmation}
            disabled={blockStatusLoading}
          />
          <ActionRow
            icon="fa-solid fa-magnifying-glass"
            label={t('authorReaderPageOptions.searchThisPage')}
            onClick={searchThisPage}
          />
          <ActionRow
            icon="fa-regular fa-address-book"
            label={t('authorReaderPageOptions.inviteFriends')}
            onClick={() => navigate(`/author/page/${pageUsername}/invite`)}
          />
          <ActionRow
            icon="fa-solid fa-share"
            label={t('authorReaderPageOptions.sharePage')}
            onClick={() => setShareOpen(true)}
          />
        </section>

        <section className="mt-3 bg-[var(--shadow-bg-surface)] px-4 pb-5 pt-5">
          <h2 className="truncate text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorReaderPageOptions.pageLinkTitle', { name: pageName })}
          </h2>
          <p className="mt-1 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorReaderPageOptions.shareDescription')}
          </p>

          <p className="mt-4 break-all text-[14px] font-normal leading-5 text-[var(--shadow-text-primary)]">
            {pageLink}
          </p>

          <button
            type="button"
            onClick={copyPageLink}
            className="mt-4 h-11 w-full rounded-[10px] bg-[#e5e7eb] text-[15px] font-medium text-[var(--shadow-text-primary)] active:bg-[#d8dde5]"
          >
            {t('authorReaderPageOptions.copyLink')}
          </button>
        </section>
      </main>

      <AuthorPageShareSheet
        open={shareOpen}
        pageName={pageName}
        pageLink={pageLink}
        onClose={() => setShareOpen(false)}
        onCopied={(value) => setMessage(value || t('authorReaderPageOptions.pageLinkCopied'))}
      />

      {blockConfirmOpen ? (
        <div className="fixed inset-0 z-[270] flex items-end justify-center bg-black/45 md:items-center md:px-4">
          <button
            type="button"
            aria-label={t('authorReaderPageOptions.closeConfirmation')}
            onClick={() => {
              if (!blockLoading) setBlockConfirmOpen(false)
            }}
            className="absolute inset-0"
          />

          <section className="relative w-full rounded-t-[24px] bg-[var(--shadow-bg-surface)] px-5 pb-6 pt-5 shadow-2xl md:max-w-[420px] md:rounded-[24px]">
            <h2 className="text-center text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {blocked ? t('authorReaderPageOptions.unblockTitle', { name: pageName }) : t('authorReaderPageOptions.blockTitle', { name: pageName })}
            </h2>
            <p className="mt-2 text-center text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {blocked
                ? t('authorReaderPageOptions.unblockDescription')
                : t('authorReaderPageOptions.blockDescription')}
            </p>

            {blockError ? (
              <div className="mt-4 rounded-[10px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[12px] font-normal leading-5 text-[var(--shadow-text-primary)]">
                {blockError}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBlockConfirmOpen(false)}
                disabled={blockLoading}
                className="h-11 rounded-[10px] bg-[var(--shadow-bg-page)] text-[14px] font-medium text-[var(--shadow-text-primary)] disabled:opacity-60"
              >
                {t('authorReaderPageOptions.cancel')}
              </button>
              <button
                type="button"
                onClick={handleBlockAction}
                disabled={blockLoading}
                className="h-11 rounded-[10px] bg-[#111827] text-[14px] font-medium text-white disabled:opacity-60"
              >
                {blockLoading ? t('authorReaderPageOptions.pleaseWait') : blocked ? t('authorReaderPageOptions.unblock') : t('authorReaderPageOptions.block')}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
