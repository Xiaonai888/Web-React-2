import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { storyDetailErrorReport } from './storyDetailError'

registerTranslationNamespace('storyDetailDiagnostic', {
  en: {
    source: 'Source', responsible: 'Action by', code: 'Error code', status: 'HTTP status', reference: 'Reference ID',
    BACKEND: 'Backend', DATABASE: 'Database', REQUEST: 'Request', ACCESS: 'Access restriction', CONTENT: 'Content availability', UNKNOWN: 'Not confirmed',
    ADMIN: 'Admin / technical team', READER: 'Reader', NONE: 'No technical fix required',
    system: 'A system error occurred. Please try again later or send the error details to support.',
    unknown: 'The cause is not confirmed. Send the error details to support for investigation.',
    connection: 'The connection failed. Check your internet connection and try again. If it persists, contact support.',
    invalidLink: 'This story link is invalid. Open the story again from the list.',
    notFound: 'This story is no longer available or is not published.',
    restricted: 'Access to this story is restricted.', login: 'Please sign in again to continue.',
    rateLimit: 'Too many requests. Please wait and try again.',
    copy: 'Copy error details', copied: 'Copied', copyFailed: 'Copy manually from the field below.',
  },
  km: {
    source: 'ប្រភពបញ្ហា', responsible: 'អ្នកដោះស្រាយ', code: 'កូដកំហុស', status: 'ស្ថានភាព HTTP', reference: 'លេខយោង',
    BACKEND: 'Backend', DATABASE: 'មូលដ្ឋានទិន្នន័យ', REQUEST: 'សំណើ', ACCESS: 'ការរឹតត្បិតសិទ្ធិ', CONTENT: 'ស្ថានភាពរឿង', UNKNOWN: 'មិនទាន់បញ្ជាក់',
    ADMIN: 'Admin / ក្រុមបច្ចេកទេស', READER: 'អ្នកអាន', NONE: 'មិនត្រូវការកែបច្ចេកទេស',
    system: 'ប្រព័ន្ធមានបញ្ហា។ សូមសាកល្បងម្តងទៀតនៅពេលក្រោយ ឬផ្ញើព័ត៌មានកំហុសទៅក្រុមជំនួយ។',
    unknown: 'មិនទាន់បញ្ជាក់មូលហេតុ។ សូមផ្ញើព័ត៌មានកំហុសទៅក្រុមជំនួយដើម្បីពិនិត្យ។',
    connection: 'មិនអាចភ្ជាប់បាន។ សូមពិនិត្យអ៊ីនធឺណិត ហើយសាកម្តងទៀត។ បើនៅតែមានបញ្ហា សូមទាក់ទងក្រុមជំនួយ។',
    invalidLink: 'តំណរឿងមិនត្រឹមត្រូវ។ សូមបើករឿងម្តងទៀតពីបញ្ជីរឿង។',
    notFound: 'រឿងនេះមិនអាចចូលមើលបានទៀត ឬមិនទាន់បានបោះពុម្ព។',
    restricted: 'រឿងនេះមានការរឹតត្បិតសិទ្ធិចូលមើល។', login: 'សូមចូលគណនីម្តងទៀតដើម្បីបន្ត។',
    rateLimit: 'មានសំណើច្រើនពេក។ សូមរង់ចាំហើយសាកម្តងទៀត។',
    copy: 'ចម្លងព័ត៌មានកំហុស', copied: 'បានចម្លង', copyFailed: 'សូមចម្លងដោយផ្ទាល់ពីប្រអប់ខាងក្រោម។',
  },
  zh: {
    source: '问题来源', responsible: '处理方', code: '错误代码', status: 'HTTP 状态', reference: '参考编号',
    BACKEND: '后端', DATABASE: '数据库', REQUEST: '请求', ACCESS: '访问限制', CONTENT: '内容状态', UNKNOWN: '尚未确认',
    ADMIN: '管理员 / 技术团队', READER: '读者', NONE: '无需技术修复',
    system: '系统发生错误。请稍后重试，或将错误详情发送给客服。',
    unknown: '原因尚未确认。请将错误详情发送给客服以便排查。',
    connection: '连接失败。请检查网络后重试。如果问题持续，请联系客服。',
    invalidLink: '作品链接无效。请从列表重新打开作品。', notFound: '该作品已不可用或尚未发布。',
    restricted: '该作品存在访问限制。', login: '请重新登录后继续。', rateLimit: '请求过多，请稍后重试。',
    copy: '复制错误详情', copied: '已复制', copyFailed: '请从下方文本框手动复制。',
  },
  ja: {
    source: '問題の発生元', responsible: '対応者', code: 'エラーコード', status: 'HTTP ステータス', reference: '参照 ID',
    BACKEND: 'バックエンド', DATABASE: 'データベース', REQUEST: 'リクエスト', ACCESS: 'アクセス制限', CONTENT: '作品の公開状況', UNKNOWN: '未確認',
    ADMIN: '管理者 / 技術チーム', READER: '読者', NONE: '技術的な修正は不要',
    system: 'システムエラーが発生しました。後でもう一度試すか、エラー詳細をサポートに送信してください。',
    unknown: '原因は未確認です。調査のためエラー詳細をサポートに送信してください。',
    connection: '接続できませんでした。インターネット接続を確認して再試行してください。解決しない場合はサポートにお問い合わせください。',
    invalidLink: '作品リンクが無効です。一覧から作品を開き直してください。', notFound: 'この作品は利用できないか、未公開です。',
    restricted: 'この作品へのアクセスは制限されています。', login: '続行するには再ログインしてください。', rateLimit: 'リクエストが多すぎます。しばらくしてから再試行してください。',
    copy: 'エラー詳細をコピー', copied: 'コピーしました', copyFailed: '下の欄から手動でコピーしてください。',
  },
  ko: {
    source: '문제 발생 원인', responsible: '처리 담당', code: '오류 코드', status: 'HTTP 상태', reference: '참조 ID',
    BACKEND: '백엔드', DATABASE: '데이터베이스', REQUEST: '요청', ACCESS: '접근 제한', CONTENT: '작품 공개 상태', UNKNOWN: '미확인',
    ADMIN: '관리자 / 기술팀', READER: '독자', NONE: '기술적 수정 불필요',
    system: '시스템 오류가 발생했습니다. 나중에 다시 시도하거나 오류 상세 정보를 고객지원에 보내 주세요.',
    unknown: '원인이 확인되지 않았습니다. 조사를 위해 오류 상세 정보를 고객지원에 보내 주세요.',
    connection: '연결에 실패했습니다. 인터넷 연결을 확인한 후 다시 시도하세요. 문제가 계속되면 고객지원에 문의하세요.',
    invalidLink: '작품 링크가 올바르지 않습니다. 목록에서 작품을 다시 열어 주세요.', notFound: '이 작품은 이용할 수 없거나 아직 공개되지 않았습니다.',
    restricted: '이 작품에 대한 접근이 제한되어 있습니다.', login: '계속하려면 다시 로그인해 주세요.', rateLimit: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.',
    copy: '오류 상세 복사', copied: '복사됨', copyFailed: '아래 입력란에서 직접 복사해 주세요.',
  },
})

export default function StoryDetailErrorBlock({ diagnostic, onBack }) {
  const { t } = useDisplayTranslation()
  const [copyState, setCopyState] = useState('')
  const tr = (key) => t(`storyDetailDiagnostic.${key}`)
  const report = storyDetailErrorReport(diagnostic)

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(report)
      setCopyState('copied')
    } catch {
      setCopyState('copyFailed')
    }
  }

  return (
    <div className="app-card app-shadow mx-auto mt-5 max-w-4xl rounded-[26px] border p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] dark:bg-red-500/10 dark:text-red-400">
        <i className="fa-solid fa-triangle-exclamation text-[22px]" aria-hidden="true" />
      </div>
      <h2 className="app-title mt-4 text-[18px] font-extrabold">{t('storyDetailPage.cannotLoadStory')}</h2>
      <p className="app-muted mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6">
        {diagnostic ? tr(diagnostic.kind) : t('storyDetailPage.tryAgainLater')}
      </p>
      {diagnostic && (
        <>
          <dl className="app-soft mx-auto mt-4 max-w-md space-y-2 rounded-2xl p-4 text-left text-[12px]">
            {[
              [tr('source'), tr(diagnostic.source)],
              [tr('responsible'), tr(diagnostic.responsible)],
              [tr('code'), diagnostic.code],
              ...(diagnostic.status !== null ? [[tr('status'), diagnostic.status]] : []),
              ...(diagnostic.referenceId ? [[tr('reference'), diagnostic.referenceId]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <dt className="app-muted">{label}</dt>
                <dd className="app-title min-w-0 break-all font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={copyDetails} className="app-card mt-4 rounded-full border px-5 py-3 text-[13px] font-bold">
            <i className="fa-regular fa-copy mr-2" aria-hidden="true" />{tr('copy')}
          </button>
          {copyState && <p role="status" className="app-muted mt-2 text-[12px]">{tr(copyState)}</p>}
          {copyState === 'copyFailed' && <textarea aria-label={tr('copy')} readOnly value={report} onFocus={(event) => event.target.select()} className="app-input mt-2 min-h-[130px] w-full rounded-xl border p-2 text-left text-[12px]" />}
        </>
      )}
      <div>
        <button type="button" onClick={onBack} className="mt-5 h-12 rounded-full bg-[#111827] px-6 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]">
          {t('storyDetailPage.goBack')}
        </button>
      </div>
    </div>
  )
}
