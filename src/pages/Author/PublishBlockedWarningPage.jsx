import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('publishBlockedWarning', {
  "en": {
    "restrictedContent": "restricted content",
    "publishingBlocked": "Publishing Blocked",
    "title": "Your episode can’t be published yet",
    "intro": "This episode contains restricted content. Please remove or rewrite the words below before publishing again.",
    "issueSummary": "Issue Summary",
    "issueHelp": "The strongest issue is shown here. The words are grouped below for faster editing.",
    "mainIssue": "Main Issue",
    "restrictedWords": "Restricted Words",
    "totalMatches": "Total Matches",
    "copiedAll": "Copied All Words",
    "copyAll": "Copy All Words",
    "wordsTitle": "Restricted words",
    "wordsHelp": "Each word is shown once with its match count.",
    "tip": "Tip: Use Copy All Words, then paste the list somewhere safe. Search each word inside your episode editor and rewrite it.",
    "backEdit": "Back to Edit Episode",
    "storyManager": "Story Manager",
    "low": "Low",
    "medium": "Medium",
    "high": "High"
  },
  "km": {
    "restrictedContent": "មាតិកាដែលបានកំណត់",
    "publishingBlocked": "ការបោះពុម្ពត្រូវបានរារាំង",
    "title": "ភាគរបស់អ្នកមិនទាន់អាចបោះពុម្ពបានទេ",
    "intro": "ភាគនេះមានមាតិកាដែលត្រូវបានកំណត់។ សូមលុប ឬសរសេរពាក្យខាងក្រោមឡើងវិញ មុនពេលព្យាយាមបោះពុម្ពម្តងទៀត។",
    "issueSummary": "សង្ខេបបញ្ហា",
    "issueHelp": "បញ្ហាខ្លាំងបំផុតត្រូវបានបង្ហាញនៅទីនេះ។ ពាក្យត្រូវបានរៀបជាក្រុមខាងក្រោម ដើម្បីឱ្យកែបានលឿន។",
    "mainIssue": "បញ្ហាសំខាន់",
    "restrictedWords": "ពាក្យដែលបានកំណត់",
    "totalMatches": "ចំនួនត្រូវគ្នាសរុប",
    "copiedAll": "បានចម្លងពាក្យទាំងអស់",
    "copyAll": "ចម្លងពាក្យទាំងអស់",
    "wordsTitle": "ពាក្យដែលបានកំណត់",
    "wordsHelp": "ពាក្យនីមួយៗបង្ហាញតែម្តង ជាមួយចំនួនដែលរកឃើញ។",
    "tip": "គន្លឹះ៖ ប្រើ ចម្លងពាក្យទាំងអស់ រួចបិទភ្ជាប់បញ្ជីទុកកន្លែងមានសុវត្ថិភាព។ ស្វែងរកពាក្យនីមួយៗក្នុង Episode Editor ហើយសរសេរឡើងវិញ។",
    "backEdit": "ត្រឡប់ទៅកែភាគ",
    "storyManager": "គ្រប់គ្រងរឿង",
    "low": "ទាប",
    "medium": "មធ្យម",
    "high": "ខ្ពស់"
  },
  "zh": {
    "restrictedContent": "受限内容",
    "publishingBlocked": "发布被阻止",
    "title": "你的章节暂时无法发布",
    "intro": "此章节包含受限内容。请删除或改写下方词语，然后再次发布。",
    "issueSummary": "问题摘要",
    "issueHelp": "这里显示最严重的问题，相关词语已在下方分组，方便快速修改。",
    "mainIssue": "主要问题",
    "restrictedWords": "受限词语",
    "totalMatches": "匹配总数",
    "copiedAll": "已复制全部词语",
    "copyAll": "复制全部词语",
    "wordsTitle": "受限词语",
    "wordsHelp": "每个词只显示一次，并标注匹配次数。",
    "tip": "提示：先复制全部词语并将列表保存到安全位置，再在章节编辑器中逐个搜索并改写。",
    "backEdit": "返回编辑章节",
    "storyManager": "故事管理",
    "low": "低",
    "medium": "中",
    "high": "高"
  },
  "ja": {
    "restrictedContent": "制限されたコンテンツ",
    "publishingBlocked": "公開がブロックされました",
    "title": "このエピソードはまだ公開できません",
    "intro": "このエピソードには制限されたコンテンツが含まれています。再公開する前に、下の単語を削除または書き換えてください。",
    "issueSummary": "問題の概要",
    "issueHelp": "最も重要な問題を表示しています。下に単語をまとめているので、すばやく修正できます。",
    "mainIssue": "主な問題",
    "restrictedWords": "制限ワード",
    "totalMatches": "一致総数",
    "copiedAll": "すべてコピーしました",
    "copyAll": "すべてのワードをコピー",
    "wordsTitle": "制限ワード",
    "wordsHelp": "各ワードは一致回数とともに1回だけ表示されます。",
    "tip": "ヒント：すべてのワードをコピーして安全な場所に保存し、エピソードエディターで各ワードを検索して書き換えてください。",
    "backEdit": "エピソード編集に戻る",
    "storyManager": "ストーリー管理",
    "low": "低",
    "medium": "中",
    "high": "高"
  },
  "ko": {
    "restrictedContent": "제한된 콘텐츠",
    "publishingBlocked": "게시가 차단되었습니다",
    "title": "아직 이 에피소드를 게시할 수 없습니다",
    "intro": "이 에피소드에는 제한된 콘텐츠가 포함되어 있습니다. 다시 게시하기 전에 아래 단어를 삭제하거나 수정해 주세요.",
    "issueSummary": "문제 요약",
    "issueHelp": "가장 중요한 문제가 여기에 표시됩니다. 빠르게 수정할 수 있도록 아래에 단어를 모았습니다.",
    "mainIssue": "주요 문제",
    "restrictedWords": "제한 단어",
    "totalMatches": "총 일치 수",
    "copiedAll": "모든 단어를 복사했습니다",
    "copyAll": "모든 단어 복사",
    "wordsTitle": "제한 단어",
    "wordsHelp": "각 단어는 일치 횟수와 함께 한 번만 표시됩니다.",
    "tip": "팁: 모든 단어를 복사해 안전한 곳에 저장한 뒤 에피소드 편집기에서 각 단어를 검색해 수정하세요.",
    "backEdit": "에피소드 편집으로 돌아가기",
    "storyManager": "스토리 관리",
    "low": "낮음",
    "medium": "보통",
    "high": "높음"
  }
})


const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
}

function normalizeMatches(value) {
  if (!Array.isArray(value)) return []

  const grouped = new Map()

  value.forEach((item) => {
    const word = String(item?.word || '').trim()
    if (!word) return

    const key = word.toLowerCase()
    const count = Number(item?.count || item?.matched_count || 1)

    if (grouped.has(key)) {
      const oldItem = grouped.get(key)
      grouped.set(key, {
        ...oldItem,
        count: oldItem.count + count,
      })
      return
    }

    grouped.set(key, {
      id: item?.id || `${word}-${item?.category || 'custom'}`,
      word,
      category: String(item?.category || 'custom').trim().toLowerCase(),
      severity: String(item?.severity || 'medium').trim().toLowerCase(),
      count,
    })
  })

  return Array.from(grouped.values())
}

function getMainIssue(matches) {
  if (!matches.length) {
    return {
      category: getDisplayText('publishBlockedWarning.restrictedContent'),
      severity: 'medium',
    }
  }

  return [...matches].sort((a, b) => {
    const severityDiff = (severityRank[b.severity] || 2) - (severityRank[a.severity] || 2)
    if (severityDiff !== 0) return severityDiff
    return b.count - a.count
  })[0]
}

function IssueBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#fee2e2] px-3 py-1 text-[11px] font-black uppercase tracking-[0.35px] text-[#b91c1c]">
      {children}
    </span>
  )
}

export default function PublishBlockedWarningPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()
  const { t } = useDisplayTranslation()
  const [copied, setCopied] = useState(false)

  const matches = useMemo(() => normalizeMatches(location.state?.blockedWords), [location.state])
  const episodeId = location.state?.episodeId || ''
  const editPath = episodeId
  ? `/author/story/${storyId}/episode/create?editEpisodeId=${episodeId}&fromPublishWarning=1`
  : `/author/story/${storyId}/episode/create?fromPublishWarning=1`

  const mainIssue = useMemo(() => getMainIssue(matches), [matches])
  const totalMatches = useMemo(() => matches.reduce((sum, item) => sum + item.count, 0), [matches])
  const allWordsText = useMemo(() => matches.map((item) => item.word).join('\n'), [matches])

  const copyAllWords = async () => {
    try {
      await navigator.clipboard.writeText(allWordsText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  if (!matches.length) {
    return <Navigate to={`/author/story/${storyId}/manage`} replace />
  }

  const severityKey = ['low', 'medium', 'high'].includes(mainIssue.severity)
    ? mainIssue.severity
    : 'medium'
  const severityText = t(`publishBlockedWarning.${severityKey}`)

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 py-6">
      <main className="mx-auto max-w-[760px]">
        <section className="overflow-hidden rounded-[28px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="border-b border-[#fee2e2] bg-[var(--shadow-bg-soft)] px-5 py-6 sm:px-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fee2e2] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.5px] text-[#b91c1c]">
              <i className="fa-solid fa-triangle-exclamation text-[12px]" />
              {t('publishBlockedWarning.publishingBlocked')}
            </div>

            <h1 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.04em] text-[var(--shadow-text-primary)] sm:text-[32px]">
              {t('publishBlockedWarning.title')}
            </h1>

            <p className="mt-3 text-[14px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
              {t('publishBlockedWarning.intro')}
            </p>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="rounded-[24px] border border-[#fecaca] bg-[var(--shadow-bg-soft)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c]">
                  <i className="fa-solid fa-ban text-[16px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('publishBlockedWarning.issueSummary')}</h2>
                  <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {t('publishBlockedWarning.issueHelp')}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[var(--shadow-text-tertiary)]">{t('publishBlockedWarning.mainIssue')}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <IssueBadge>{mainIssue.category}</IssueBadge>
                    <IssueBadge>{severityText}</IssueBadge>
                  </div>
                </div>

                <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[var(--shadow-text-tertiary)]">{t('publishBlockedWarning.restrictedWords')}</div>
                  <div className="mt-2 text-[24px] font-black leading-none text-[var(--shadow-text-primary)]">{matches.length}</div>
                </div>

                <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[var(--shadow-text-tertiary)]">{t('publishBlockedWarning.totalMatches')}</div>
                  <div className="mt-2 text-[24px] font-black leading-none text-[var(--shadow-text-primary)]">{totalMatches}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={copyAllWords}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--shadow-text-primary)] px-5 text-[14px] font-extrabold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(17,24,39,0.18)] active:scale-[0.99] sm:w-auto"
              >
                <i className="fa-regular fa-copy text-[13px]" />
                {copied
                  ? t('publishBlockedWarning.copiedAll')
                  : t('publishBlockedWarning.copyAll')}
              </button>
            </div>

            <section className="mt-5 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 ring-1 ring-[var(--shadow-border)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('publishBlockedWarning.wordsTitle')}</h2>
                  <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                    {t('publishBlockedWarning.wordsHelp')}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {matches.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[#fee2e2] bg-[var(--shadow-bg-soft)] px-3.5 py-2 text-[12.5px] font-extrabold text-[var(--shadow-text-primary)]"
                  >
                    <span>{item.word}</span>
                    <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[10.5px] font-black text-[#b91c1c]">
                      ×{item.count}
                    </span>
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-5 rounded-[20px] bg-[var(--shadow-bg-page)] px-4 py-3 text-[12.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {t('publishBlockedWarning.tip')}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
  navigate('/author/dashboard', { replace: true })
  window.setTimeout(() => {
    navigate(editPath)
  }, 0)
}}
                className="rounded-full bg-[var(--shadow-text-primary)] px-5 py-4 text-[14px] font-extrabold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99]"
              >
                {t('publishBlockedWarning.backEdit')}
              </button>

              <button
                type="button"
                onClick={() => {
  navigate('/author/dashboard', { replace: true })
  window.setTimeout(() => {
    navigate(`/author/story/${storyId}/manage`)
  }, 0)
}}
                className="rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-4 text-[14px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('publishBlockedWarning.storyManager')}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
