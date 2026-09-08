import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageOptions', {
  "en": {
    "back": "Back",
    "pageSettings": "Page Settings",
    "manage": "Manage",
    "basicPageInfo": "Basic Page Info",
    "pageStatus": "Page status",
    "activityLog": "Activity log",
    "share": "Share",
    "sharePage": "Share Page",
    "copyPageLink": "Copy Page link",
    "view": "View",
    "viewAsReader": "View as reader",
    "trash": "Trash",
    "pageLinkCopied": "Page link copied.",
    "shareCancelled": "Share cancelled.",
    "authorPage": "Author Page",
    "pageStatusSoon": "Page status is coming soon.",
    "activityLogSoon": "Activity log is coming soon."
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "pageSettings": "ការកំណត់ទំព័រ",
    "manage": "គ្រប់គ្រង",
    "basicPageInfo": "ព័ត៌មានមូលដ្ឋានទំព័រ",
    "pageStatus": "ស្ថានភាពទំព័រ",
    "activityLog": "កំណត់ត្រាសកម្មភាព",
    "share": "ចែករំលែក",
    "sharePage": "ចែករំលែកទំព័រ",
    "copyPageLink": "ចម្លងតំណទំព័រ",
    "view": "មើល",
    "viewAsReader": "មើលជាអ្នកអាន",
    "trash": "ធុងសំរាម",
    "pageLinkCopied": "បានចម្លងតំណទំព័រ។",
    "shareCancelled": "បានបោះបង់ការចែករំលែក។",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "pageStatusSoon": "ស្ថានភាពទំព័រនឹងមានឆាប់ៗនេះ។",
    "activityLogSoon": "កំណត់ត្រាសកម្មភាពនឹងមានឆាប់ៗនេះ។"
  },
  "zh": {
    "back": "返回",
    "pageSettings": "主页设置",
    "manage": "管理",
    "basicPageInfo": "基本主页信息",
    "pageStatus": "主页状态",
    "activityLog": "活动记录",
    "share": "分享",
    "sharePage": "分享主页",
    "copyPageLink": "复制主页链接",
    "view": "查看",
    "viewAsReader": "以读者身份查看",
    "trash": "回收站",
    "pageLinkCopied": "主页链接已复制。",
    "shareCancelled": "已取消分享。",
    "authorPage": "作者主页",
    "pageStatusSoon": "主页状态功能即将推出。",
    "activityLogSoon": "活动记录功能即将推出。"
  },
  "ja": {
    "back": "戻る",
    "pageSettings": "ページ設定",
    "manage": "管理",
    "basicPageInfo": "基本ページ情報",
    "pageStatus": "ページ状態",
    "activityLog": "アクティビティログ",
    "share": "共有",
    "sharePage": "ページを共有",
    "copyPageLink": "ページリンクをコピー",
    "view": "表示",
    "viewAsReader": "読者として表示",
    "trash": "ゴミ箱",
    "pageLinkCopied": "ページリンクをコピーしました。",
    "shareCancelled": "共有をキャンセルしました。",
    "authorPage": "著者ページ",
    "pageStatusSoon": "ページ状態は近日公開予定です。",
    "activityLogSoon": "アクティビティログは近日公開予定です。"
  },
  "ko": {
    "back": "뒤로",
    "pageSettings": "페이지 설정",
    "manage": "관리",
    "basicPageInfo": "기본 페이지 정보",
    "pageStatus": "페이지 상태",
    "activityLog": "활동 기록",
    "share": "공유",
    "sharePage": "페이지 공유",
    "copyPageLink": "페이지 링크 복사",
    "view": "보기",
    "viewAsReader": "독자로 보기",
    "trash": "휴지통",
    "pageLinkCopied": "페이지 링크를 복사했습니다.",
    "shareCancelled": "공유를 취소했습니다.",
    "authorPage": "작가 페이지",
    "pageStatusSoon": "페이지 상태 기능이 곧 제공됩니다.",
    "activityLogSoon": "활동 기록 기능이 곧 제공됩니다."
  }
})


function getStoredAuthorPage() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
  } catch {
    return null
  }
}

function ToolRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-2.5 text-left active:bg-[var(--shadow-bg-soft)]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[15px] font-normal`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[var(--shadow-text-primary)]">{label}</span>
      </span>
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 className="px-1 pt-5 text-[17px] font-semibold text-[var(--shadow-text-primary)]">{children}</h2>
}

export default function AuthorPageOptionsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [message, setMessage] = useState('')
  const authorPage = useMemo(() => getStoredAuthorPage(), [])
const pageUsername = authorPage?.page_username || ''

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}, [])

function copyPageLink() {
    const path = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
    const link = `${window.location.origin}${path}`

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link)
      setMessage(t('authorPageOptions.pageLinkCopied'))
      return
    }

    setMessage(link)
  }

  async function sharePage() {
    const path = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
    const link = `${window.location.origin}${path}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: authorPage?.page_name || t('authorPageOptions.authorPage'),
          url: link,
        })
      } catch {
        setMessage(t('authorPageOptions.shareCancelled'))
      }
      return
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link)
      setMessage(t('authorPageOptions.pageLinkCopied'))
      return
    }

    setMessage(link)
  }

  function viewAsReader() {
    if (pageUsername) {
      navigate(`/author/page/${pageUsername}`)
      return
    }

    navigate('/author/page')
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageOptions.back')}
          >
            <i className="fa-solid fa-chevron-left text-[22px]" />
          </button>

          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPageOptions.pageSettings')}</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-8">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-4 w-full rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[13px] font-normal text-[var(--shadow-text-primary)]"
          >
            {message}
          </button>
        ) : null}

        <SectionTitle>{t('authorPageOptions.manage')}</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-pen-to-square" label={t('authorPageOptions.basicPageInfo')} onClick={() => navigate('/author/edit-page?from=settings')} />
          <ToolRow icon="fa-regular fa-circle-check" label={t('authorPageOptions.pageStatus')} onClick={() => setMessage(t('authorPageOptions.pageStatusSoon'))} />
          <ToolRow icon="fa-regular fa-rectangle-list" label={t('authorPageOptions.activityLog')} onClick={() => setMessage(t('authorPageOptions.activityLogSoon'))} />
        </div>

        <SectionTitle>{t('authorPageOptions.share')}</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-paper-plane" label={t('authorPageOptions.sharePage')} onClick={sharePage} />
          <ToolRow icon="fa-regular fa-copy" label={t('authorPageOptions.copyPageLink')} onClick={copyPageLink} />
        </div>

        <SectionTitle>{t('authorPageOptions.view')}</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-eye" label={t('authorPageOptions.viewAsReader')} onClick={viewAsReader} />
        </div>

        <SectionTitle>{t('authorPageOptions.trash')}</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow
            icon="fa-regular fa-trash-can"
            label={t('authorPageOptions.trash')}
            onClick={() => navigate('/author/trash')}
          />
        </div>
      </main>
    </div>
  )
}
