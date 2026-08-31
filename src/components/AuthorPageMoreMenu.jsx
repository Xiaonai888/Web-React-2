import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorPageMoreMenu', {
  en: {
    authorPage: 'Author Page',
    pageOptions: 'Page options',
    reportPage: 'Report Page',
    helpPage: 'Help {{name}}',
    checking: 'Checking...',
    unblock: 'Unblock',
    block: 'Block',
    searchThisPage: 'Search this Page',
    inviteFriends: 'Invite friends',
    sharePage: 'Share Page',
    pageLinkTitle: "{{name}}'s Page link",
    pageLinkDescription: 'Share this personalized Shadow Page link.',
    copyLink: 'Copy link',
    cancel: 'Cancel',
    pleaseWait: 'Please wait...',
    unblockTitle: 'Unblock {{name}}?',
    blockTitle: 'Block {{name}}?',
    unblockDescription: 'This will unblock both the Author Page and its Reader account.',
    blockDescription: 'This will block both the Author Page and its Reader account, including direct messages between both accounts.',
    pageLinkCopied: 'Page link copied.',
    unableShare: 'Unable to share this page.',
    searchPrompt: 'Search {{name}}',
    found: 'Found "{{query}}".',
    noResult: 'No result found for "{{query}}".',
    followTitle: 'Follow {{name}} on Shadow',
    followText: 'Come follow {{name}} on Shadow.',
    viewText: 'View {{name}} on Shadow.',
    failedUnblock: 'Failed to unblock Author Page',
    failedBlock: 'Failed to block Author Page',
    blocked: '{{name}} blocked.',
    unblocked: '{{name}} unblocked.',
  },
  km: {
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    pageOptions: 'ជម្រើសទំព័រ',
    reportPage: 'រាយការណ៍ទំព័រ',
    helpPage: 'ជួយ {{name}}',
    checking: 'កំពុងពិនិត្យ...',
    unblock: 'ដោះប្លុក',
    block: 'ប្លុក',
    searchThisPage: 'ស្វែងរកក្នុងទំព័រនេះ',
    inviteFriends: 'អញ្ជើញមិត្តភក្តិ',
    sharePage: 'ចែករំលែកទំព័រ',
    pageLinkTitle: 'តំណទំព័ររបស់ {{name}}',
    pageLinkDescription: 'ចែករំលែកតំណ Shadow Page ផ្ទាល់ខ្លួននេះ។',
    copyLink: 'ចម្លងតំណ',
    cancel: 'បោះបង់',
    pleaseWait: 'សូមរង់ចាំ...',
    unblockTitle: 'ដោះប្លុក {{name}}?',
    blockTitle: 'ប្លុក {{name}}?',
    unblockDescription: 'វានឹងដោះប្លុកទាំង Author Page និងគណនី Reader របស់វា។',
    blockDescription: 'វានឹងប្លុកទាំង Author Page និងគណនី Reader របស់វា រួមទាំងសារផ្ទាល់រវាងគណនីទាំងពីរ។',
    pageLinkCopied: 'បានចម្លងតំណទំព័រ។',
    unableShare: 'មិនអាចចែករំលែកទំព័រនេះបានទេ។',
    searchPrompt: 'ស្វែងរក {{name}}',
    found: 'រកឃើញ "{{query}}"។',
    noResult: 'រកមិនឃើញលទ្ធផលសម្រាប់ "{{query}}" ទេ។',
    followTitle: 'តាមដាន {{name}} នៅលើ Shadow',
    followText: 'មកតាមដាន {{name}} នៅលើ Shadow។',
    viewText: 'មើល {{name}} នៅលើ Shadow។',
    failedUnblock: 'មិនអាចដោះប្លុក Author Page បានទេ',
    failedBlock: 'មិនអាចប្លុក Author Page បានទេ',
    blocked: 'បានប្លុក {{name}}។',
    unblocked: 'បានដោះប្លុក {{name}}។',
  },
  zh: {
    authorPage: '作者主页',
    pageOptions: '主页选项',
    reportPage: '举报主页',
    helpPage: '支持 {{name}}',
    checking: '检查中...',
    unblock: '取消屏蔽',
    block: '屏蔽',
    searchThisPage: '搜索此主页',
    inviteFriends: '邀请朋友',
    sharePage: '分享主页',
    pageLinkTitle: '{{name}} 的主页链接',
    pageLinkDescription: '分享这个个性化的 Shadow 主页链接。',
    copyLink: '复制链接',
    cancel: '取消',
    pleaseWait: '请稍候...',
    unblockTitle: '取消屏蔽 {{name}}？',
    blockTitle: '屏蔽 {{name}}？',
    unblockDescription: '这将同时取消屏蔽作者主页及其读者账户。',
    blockDescription: '这将同时屏蔽作者主页及其读者账户，包括两个账户之间的私信。',
    pageLinkCopied: '主页链接已复制。',
    unableShare: '无法分享此主页。',
    searchPrompt: '搜索 {{name}}',
    found: '找到“{{query}}”。',
    noResult: '未找到“{{query}}”的结果。',
    followTitle: '在 Shadow 上关注 {{name}}',
    followText: '来 Shadow 关注 {{name}}。',
    viewText: '在 Shadow 上查看 {{name}}。',
    failedUnblock: '无法取消屏蔽作者主页',
    failedBlock: '无法屏蔽作者主页',
    blocked: '已屏蔽 {{name}}。',
    unblocked: '已取消屏蔽 {{name}}。',
  },
  ja: {
    authorPage: '作者ページ',
    pageOptions: 'ページオプション',
    reportPage: 'ページを報告',
    helpPage: '{{name}} を応援',
    checking: '確認中...',
    unblock: 'ブロック解除',
    block: 'ブロック',
    searchThisPage: 'このページを検索',
    inviteFriends: '友達を招待',
    sharePage: 'ページを共有',
    pageLinkTitle: '{{name}} のページリンク',
    pageLinkDescription: 'このパーソナライズされた Shadow ページリンクを共有します。',
    copyLink: 'リンクをコピー',
    cancel: 'キャンセル',
    pleaseWait: 'お待ちください...',
    unblockTitle: '{{name}} のブロックを解除しますか？',
    blockTitle: '{{name}} をブロックしますか？',
    unblockDescription: '作者ページとその Reader アカウントの両方のブロックを解除します。',
    blockDescription: '作者ページとその Reader アカウントの両方をブロックし、両アカウント間のダイレクトメッセージも対象になります。',
    pageLinkCopied: 'ページリンクをコピーしました。',
    unableShare: 'このページを共有できませんでした。',
    searchPrompt: '{{name}} を検索',
    found: '「{{query}}」が見つかりました。',
    noResult: '「{{query}}」の結果が見つかりませんでした。',
    followTitle: 'Shadow で {{name}} をフォロー',
    followText: 'Shadow で {{name}} をフォローしましょう。',
    viewText: 'Shadow で {{name}} を表示します。',
    failedUnblock: '作者ページのブロック解除に失敗しました',
    failedBlock: '作者ページのブロックに失敗しました',
    blocked: '{{name}} をブロックしました。',
    unblocked: '{{name}} のブロックを解除しました。',
  },
  ko: {
    authorPage: '작가 페이지',
    pageOptions: '페이지 옵션',
    reportPage: '페이지 신고',
    helpPage: '{{name}} 응원하기',
    checking: '확인 중...',
    unblock: '차단 해제',
    block: '차단',
    searchThisPage: '이 페이지 검색',
    inviteFriends: '친구 초대',
    sharePage: '페이지 공유',
    pageLinkTitle: '{{name}}의 페이지 링크',
    pageLinkDescription: '이 맞춤형 Shadow 페이지 링크를 공유하세요.',
    copyLink: '링크 복사',
    cancel: '취소',
    pleaseWait: '잠시만 기다려 주세요...',
    unblockTitle: '{{name}} 차단을 해제할까요?',
    blockTitle: '{{name}}을(를) 차단할까요?',
    unblockDescription: '작가 페이지와 해당 Reader 계정의 차단을 모두 해제합니다.',
    blockDescription: '작가 페이지와 해당 Reader 계정을 모두 차단하며 두 계정 간의 다이렉트 메시지도 포함됩니다.',
    pageLinkCopied: '페이지 링크를 복사했습니다.',
    unableShare: '이 페이지를 공유할 수 없습니다.',
    searchPrompt: '{{name}} 검색',
    found: '"{{query}}"을(를) 찾았습니다.',
    noResult: '"{{query}}"에 대한 결과를 찾지 못했습니다.',
    followTitle: 'Shadow에서 {{name}} 팔로우',
    followText: 'Shadow에서 {{name}}을(를) 팔로우하세요.',
    viewText: 'Shadow에서 {{name}}을(를) 확인하세요.',
    failedUnblock: '작가 페이지 차단 해제에 실패했습니다',
    failedBlock: '작가 페이지 차단에 실패했습니다',
    blocked: '{{name}}을(를) 차단했습니다.',
    unblocked: '{{name}} 차단을 해제했습니다.',
  },
})


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

function MenuRow({ icon, label, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-4 border-b border-[var(--shadow-border)] px-5 py-4 text-left active:bg-[var(--shadow-bg-hover)] disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center ${
          danger ? 'text-[#e5484d]' : 'text-[var(--shadow-text-primary)]'
        }`}
      >
        <i className={`${icon} text-[20px]`} />
      </span>
      <span
        className={`min-w-0 flex-1 text-[16px] font-normal ${
          danger ? 'text-[#e5484d]' : 'text-[var(--shadow-text-primary)]'
        }`}
      >
        {label}
      </span>
      <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

export default function AuthorPageMoreMenu({
  open,
  author,
  onClose,
  onReport,
  onHelp,
  onMessage,
}) {
  const { t } = useDisplayTranslation()
  const [blockStatusLoading, setBlockStatusLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false)
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockError, setBlockError] = useState('')

  const pageName = author?.page_name || t('authorPageMoreMenu.authorPage')
  const pageUsername = author?.page_username || ''
  const pageUrl = `${window.location.origin}${window.location.pathname}`

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open || !pageUsername || author?.is_owner) return undefined

    const token = getAuthToken()

    if (!token) {
      setBlocked(false)
      setBlockStatusLoading(false)
      return undefined
    }

    const controller = new AbortController()

    async function loadBlockStatus() {
      try {
        setBlockStatusLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load block status')
        }

        setBlocked(Boolean(data.block_status?.is_blocked))
      } catch (error) {
        if (error?.name !== 'AbortError') {
          setBlocked(false)
        }
      } finally {
        if (!controller.signal.aborted) {
          setBlockStatusLoading(false)
        }
      }
    }

    loadBlockStatus()

    return () => controller.abort()
  }, [open, pageUsername, author?.is_owner])

  if (!open || author?.is_owner) return null

  const showMessage = (text) => {
    onMessage?.(text)
  }

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      showMessage(t('authorPageMoreMenu.pageLinkCopied'))
    } catch {
      showMessage(pageUrl)
    }

    onClose()
  }

  const sharePage = async (invite = false) => {
    const shareData = {
      title: invite ? t('authorPageMoreMenu.followTitle', { name: pageName }) : pageName,
      text: invite
        ? t('authorPageMoreMenu.followText', { name: pageName })
        : t('authorPageMoreMenu.viewText', { name: pageName }),
      url: pageUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        onClose()
        return
      }

      await navigator.clipboard.writeText(pageUrl)
      showMessage(t('authorPageMoreMenu.pageLinkCopied'))
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showMessage(t('authorPageMoreMenu.unableShare'))
      }
    }

    onClose()
  }

  const searchThisPage = () => {
    const query = window.prompt(t('authorPageMoreMenu.searchPrompt', { name: pageName }))

    if (!query?.trim()) return

    const normalizedQuery = query.trim().toLowerCase()
    onClose()

    window.setTimeout(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      )
      let matchedElement = null

      while (walker.nextNode()) {
        const node = walker.currentNode
        const parent = node.parentElement

        if (
          !parent ||
          parent.closest('[data-author-page-more-menu]') ||
          ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)
        ) {
          continue
        }

        if (String(node.nodeValue || '').toLowerCase().includes(normalizedQuery)) {
          matchedElement = parent
          break
        }
      }

      if (matchedElement) {
        matchedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        showMessage(t('authorPageMoreMenu.found', { query: query.trim() }))
        return
      }

      showMessage(t('authorPageMoreMenu.noResult', { query: query.trim() }))
    }, 120)
  }

  const openBlockConfirmation = () => {
    const token = getAuthToken()

    if (!token) {
      onClose()
      window.location.assign('/login')
      return
    }

    setBlockError('')
    setBlockConfirmOpen(true)
  }

  const handleBlockAction = async () => {
    const token = getAuthToken()

    if (!token) {
      setBlockConfirmOpen(false)
      onClose()
      window.location.assign('/login')
      return
    }

    if (!pageUsername || blockLoading) return

    try {
      setBlockLoading(true)
      setBlockError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block`,
        {
          method: blocked ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (blocked
              ? t('authorPageMoreMenu.failedUnblock')
              : t('authorPageMoreMenu.failedBlock'))
        )
      }

      const nextBlocked = Boolean(data.block_status?.is_blocked)
      setBlocked(nextBlocked)
      setBlockConfirmOpen(false)
      showMessage(
        data.message ||
          (nextBlocked
            ? t('authorPageMoreMenu.blocked', { name: pageName })
            : t('authorPageMoreMenu.unblocked', { name: pageName }))
      )
      onClose()

      if (nextBlocked) {
        window.setTimeout(() => {
          window.location.assign('/discover')
        }, 350)
      }
    } catch (error) {
      setBlockError(
        error.message ||
          (blocked
            ? t('authorPageMoreMenu.failedUnblock')
            : t('authorPageMoreMenu.failedBlock'))
      )
    } finally {
      setBlockLoading(false)
    }
  }

  return (
    <div
      data-author-page-more-menu
      className="fixed inset-0 z-[245] flex items-end justify-center bg-black/40 md:items-center md:px-4"
    >
      <button
        type="button"
        aria-label="Close Author Page options"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[26px] bg-[var(--shadow-bg-soft)] pb-6 shadow-2xl md:max-w-[520px] md:rounded-[26px]">
        <div className="sticky top-0 z-10 bg-[var(--shadow-bg-surface)] px-5 pb-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-text-tertiary)]" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[20px] font-bold text-[var(--shadow-text-primary)]">
                {pageName}
              </h2>
              <p className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('authorPageMoreMenu.pageOptions')}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[15px]" />
            </button>
          </div>
        </div>

        <div className="mt-2 bg-[var(--shadow-bg-surface)]">
          <MenuRow
            icon="fa-regular fa-flag"
            label={t('authorPageMoreMenu.reportPage')}
            onClick={() => {
              onClose()
              onReport()
            }}
          />
          <MenuRow
            icon="fa-regular fa-heart"
            label={t('authorPageMoreMenu.helpPage', { name: pageName })}
            onClick={() => {
              onClose()
              onHelp()
            }}
          />
          {!author?.is_owner ? (
            <MenuRow
              icon={blocked ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}
              label={
                blockStatusLoading
                  ? t('authorPageMoreMenu.checking')
                  : blocked
                    ? t('authorPageMoreMenu.unblock')
                    : t('authorPageMoreMenu.block')
              }
              onClick={openBlockConfirmation}
              disabled={blockStatusLoading}
              danger={!blocked}
            />
          ) : null}
          <MenuRow
            icon="fa-solid fa-magnifying-glass"
            label={t('authorPageMoreMenu.searchThisPage')}
            onClick={searchThisPage}
          />
          <MenuRow
            icon="fa-regular fa-address-book"
            label={t('authorPageMoreMenu.inviteFriends')}
            onClick={() => sharePage(true)}
          />
          <MenuRow
            icon="fa-solid fa-share"
            label={t('authorPageMoreMenu.sharePage')}
            onClick={() => sharePage(false)}
          />
        </div>

        <div className="mt-3 bg-[var(--shadow-bg-surface)] px-5 py-5">
          <h3 className="line-clamp-1 text-[18px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorPageMoreMenu.pageLinkTitle', { name: pageName })}
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorPageMoreMenu.pageLinkDescription')}
          </p>

          <div className="mt-4 break-all text-[14px] font-medium leading-5 text-[var(--shadow-text-primary)]">
            {pageUrl}
          </div>

          <button
            type="button"
            onClick={copyPageLink}
            className="mt-4 h-12 w-full rounded-[12px] bg-[var(--shadow-bg-soft)] text-[16px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
          >
            {t('authorPageMoreMenu.copyLink')}
          </button>
        </div>
      </section>

      {blockConfirmOpen ? (
        <div className="fixed inset-0 z-[270] flex items-end justify-center bg-black/45 px-0 md:items-center md:px-4">
          <button
            type="button"
            aria-label="Close block confirmation"
            onClick={() => {
              if (!blockLoading) setBlockConfirmOpen(false)
            }}
            className="absolute inset-0"
          />

          <section className="relative w-full rounded-t-[26px] bg-[var(--shadow-bg-surface)] px-5 pb-6 pt-4 shadow-2xl md:max-w-[420px] md:rounded-[26px]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[var(--shadow-text-tertiary)]" />

            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                blocked
                  ? 'bg-[var(--shadow-bg-soft)] text-[#229a45]'
                  : 'bg-[var(--shadow-bg-soft)] text-[#e5484d]'
              }`}
            >
              <i
                className={`fa-solid ${
                  blocked ? 'fa-user-check' : 'fa-user-slash'
                } text-[22px]`}
              />
            </div>

            <h2 className="mt-4 text-center text-[19px] font-bold text-[var(--shadow-text-primary)]">
              {blocked
                ? t('authorPageMoreMenu.unblockTitle', { name: pageName })
                : t('authorPageMoreMenu.blockTitle', { name: pageName })}
            </h2>

            <p className="mt-2 text-center text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
              {blocked
                ? t('authorPageMoreMenu.unblockDescription')
                : t('authorPageMoreMenu.blockDescription')}
            </p>

            {blockError ? (
              <div className="mt-4 rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[12px] font-semibold leading-5 text-[#e5484d]">
                {blockError}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBlockConfirmOpen(false)}
                disabled={blockLoading}
                className="h-12 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[14px] font-semibold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-60"
              >
                {t('authorPageMoreMenu.cancel')}
              </button>

              <button
                type="button"
                onClick={handleBlockAction}
                disabled={blockLoading}
                className={`h-12 rounded-[12px] text-[14px] font-semibold text-white active:scale-[0.99] disabled:opacity-60 ${
                  blocked ? 'bg-[#229a45]' : 'bg-[#e5484d]'
                }`}
              >
                {blockLoading
                  ? t('authorPageMoreMenu.pleaseWait')
                  : blocked
                    ? t('authorPageMoreMenu.unblock')
                    : t('authorPageMoreMenu.block')}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
