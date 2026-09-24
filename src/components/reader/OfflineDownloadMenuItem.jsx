import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { downloadOfflineEpisode } from '../../utils/offlineEpisodeDownload'

registerTranslationNamespace('offlineDownloadMenu', {
  en: { save: 'Download this episode', saving: 'Downloading…', progress: '{{done}}/{{total}} images', saved: 'Downloaded. Offline reader coming soon.', failed: 'Download failed', login: 'Please sign in again.' },
  km: { save: 'ទាញយកភាគនេះ', saving: 'កំពុងទាញយក…', progress: 'រូបភាព {{done}}/{{total}}', saved: 'បានទាញយករួច។ មុខងារអាន Offline នឹងមានឆាប់ៗ។', failed: 'ទាញយកមិនជោគជ័យ', login: 'សូមចូលគណនីម្ដងទៀត។' },
  zh: { save: '下载此章节', saving: '正在下载…', progress: '{{done}}/{{total}} 张图片', saved: '已下载。离线阅读功能即将推出。', failed: '下载失败', login: '请重新登录。' },
  ja: { save: 'この話をダウンロード', saving: 'ダウンロード中…', progress: '画像 {{done}}/{{total}}', saved: '保存しました。オフライン閲覧は近日対応予定です。', failed: 'ダウンロードに失敗しました', login: '再度ログインしてください。' },
  ko: { save: '이 회차 다운로드', saving: '다운로드 중…', progress: '이미지 {{done}}/{{total}}', saved: '저장했습니다. 오프라인 읽기는 곧 지원됩니다.', failed: '다운로드 실패', login: '다시 로그인해 주세요.' },
})

function currentAccountId() {
  const storage = localStorage.getItem('shadow_reader_token') ? localStorage : sessionStorage
  try {
    const user = JSON.parse(storage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || '').trim()
  } catch {
    return ''
  }
}

export default function OfflineDownloadMenuItem({ storyId, episodeId, theme, disabled = false }) {
  const { t } = useDisplayTranslation()
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    setStatus('idle')
    setProgress(null)
    return () => controllerRef.current?.abort()
  }, [storyId, episodeId])

  async function handleDownload() {
    if (disabled || status === 'saving') return
    const accountId = currentAccountId()
    if (!accountId) {
      setStatus('login')
      return
    }
    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('saving')
    setProgress(null)
    try {
      await downloadOfflineEpisode({
        accountId,
        storyId,
        episodeId,
        allowedAccess: ['free', 'permanent'],
        signal: controller.signal,
        onProgress: ({ completed, total }) => setProgress({ completed, total }),
      })
      if (!controller.signal.aborted) setStatus('saved')
    } catch {
      if (!controller.signal.aborted) setStatus('failed')
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }

  return (
    <div className="border-t border-[var(--shadow-border)]">
      <button
        type="button"
        disabled={disabled || status === 'saving'}
        onClick={handleDownload}
        className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-[12px] font-semibold ${theme.text} disabled:opacity-50`}
      >
        <i className="fa-solid fa-download w-4 text-center" aria-hidden="true" />
        <span>{t(`offlineDownloadMenu.${status === 'saving' ? 'saving' : 'save'}`)}</span>
      </button>
      {status !== 'idle' && (
        <p role="status" className={`px-3 pb-2 text-[11px] leading-4 ${theme.muted}`}>
          {status === 'saving' && progress?.total > 0
            ? t('offlineDownloadMenu.progress', { done: progress.completed, total: progress.total })
            : status === 'saving'
              ? t('offlineDownloadMenu.saving')
              : t(`offlineDownloadMenu.${status}`)}
        </p>
      )}
    </div>
  )
}
