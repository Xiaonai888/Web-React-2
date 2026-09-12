import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyComposer', {
  en: {
    close: "Close",
    save: "Save",
    createStory: "Create story",
    chooseDevice: "Choose from your device",
    selectMedia: "Select one photo or one video.",
    photos: "Photos",
    videos: "Videos",
    back: "Back",
    more: "More",
    writeAlt: "Write alt text",
    text: "Text",
    mention: "Mention",
    link: "Link",
    public: "Public",
    share: "Share",
    sharing: "Sharing {{count}}%",
    discardTitle: "Discard story?",
    discardBody: "You'll lose this story and any changes you've made to it.",
    keepEditing: "Keep editing",
    discardStory: "Discard story",
    writeText: "Write text",
    describeStory: "Describe this story",
    chooseFile: "Choose a JPG, PNG, WebP, MP4, or MOV file.",
    photoSize: "Photo must be 5 MB or smaller.",
    videoSize: "Video must be 30 MB or smaller.",
    videoLength: "Video must be 60 seconds or shorter.",
    invalidVideo: "Could not validate video duration.",
    invalidLink: "Enter a valid link.",
    readDuration: "Could not read video duration.",
    readVideo: "Could not read this video file.",
    shareFailed: "Failed to share story",
    networkError: "Network error while sharing story",
    uploadTimeout: "Story upload took too long. Please try again.",
    saveDetailsFailed: "Failed to save story details",
  },
  km: {
    close: "បិទ",
    save: "រក្សាទុក",
    createStory: "បង្កើត Story",
    chooseDevice: "ជ្រើសពីឧបករណ៍របស់អ្នក",
    selectMedia: "ជ្រើសរូបភាពមួយ ឬវីដេអូមួយ។",
    photos: "រូបភាព",
    videos: "វីដេអូ",
    back: "ត្រឡប់ក្រោយ",
    more: "បន្ថែម",
    writeAlt: "សរសេរ Alt text",
    text: "អក្សរ",
    mention: "Mention",
    link: "Link",
    public: "សាធារណៈ",
    share: "ចែករំលែក",
    sharing: "កំពុងចែករំលែក {{count}}%",
    discardTitle: "បោះបង់ Story?",
    discardBody: "អ្នកនឹងបាត់ Story នេះ និងការកែប្រែទាំងអស់។",
    keepEditing: "បន្តកែ",
    discardStory: "បោះបង់ Story",
    writeText: "សរសេរអក្សរ",
    describeStory: "ពិពណ៌នា Story នេះ",
    chooseFile: "ជ្រើសឯកសារ JPG, PNG, WebP, MP4 ឬ MOV។",
    photoSize: "រូបភាពត្រូវមានទំហំ 5 MB ឬតិចជាងនេះ។",
    videoSize: "វីដេអូត្រូវមានទំហំ 30 MB ឬតិចជាងនេះ។",
    videoLength: "វីដេអូត្រូវមានរយៈពេល 60 វិនាទី ឬខ្លីជាងនេះ។",
    invalidVideo: "មិនអាចពិនិត្យរយៈពេលវីដេអូបានទេ។",
    invalidLink: "សូមបញ្ចូល Link ត្រឹមត្រូវ។",
    readDuration: "មិនអាចអានរយៈពេលវីដេអូបានទេ។",
    readVideo: "មិនអាចអានឯកសារវីដេអូនេះបានទេ។",
    shareFailed: "មិនអាចចែករំលែក Story បានទេ",
    networkError: "បញ្ហាបណ្តាញពេលចែករំលែក Story",
    uploadTimeout: "Upload Story យូរពេក។ សូមព្យាយាមម្តងទៀត។",
    saveDetailsFailed: "មិនអាចរក្សាទុកព័ត៌មាន Story បានទេ",
  },
  zh: {
    close: "关闭",
    save: "保存",
    createStory: "创建 Story",
    chooseDevice: "从设备中选择",
    selectMedia: "选择一张图片或一个视频。",
    photos: "图片",
    videos: "视频",
    back: "返回",
    more: "更多",
    writeAlt: "填写替代文字",
    text: "文字",
    mention: "提及",
    link: "链接",
    public: "公开",
    share: "分享",
    sharing: "正在分享 {{count}}%",
    discardTitle: "放弃 Story？",
    discardBody: "你将失去此 Story 以及所有更改。",
    keepEditing: "继续编辑",
    discardStory: "放弃 Story",
    writeText: "输入文字",
    describeStory: "描述此 Story",
    chooseFile: "请选择 JPG、PNG、WebP、MP4 或 MOV 文件。",
    photoSize: "图片必须不超过 5 MB。",
    videoSize: "视频必须不超过 30 MB。",
    videoLength: "视频必须为 60 秒或更短。",
    invalidVideo: "无法验证视频时长。",
    invalidLink: "请输入有效链接。",
    readDuration: "无法读取视频时长。",
    readVideo: "无法读取此视频文件。",
    shareFailed: "无法分享 Story",
    networkError: "分享 Story 时发生网络错误",
    uploadTimeout: "Story 上传时间过长，请重试。",
    saveDetailsFailed: "无法保存 Story 详情",
  },
  ja: {
    close: "閉じる",
    save: "保存",
    createStory: "Storyを作成",
    chooseDevice: "端末から選択",
    selectMedia: "写真1枚または動画1本を選択してください。",
    photos: "写真",
    videos: "動画",
    back: "戻る",
    more: "その他",
    writeAlt: "代替テキストを書く",
    text: "テキスト",
    mention: "メンション",
    link: "リンク",
    public: "公開",
    share: "シェア",
    sharing: "共有中 {{count}}%",
    discardTitle: "Storyを破棄しますか？",
    discardBody: "このStoryと変更内容は失われます。",
    keepEditing: "編集を続ける",
    discardStory: "Storyを破棄",
    writeText: "テキストを入力",
    describeStory: "このStoryを説明",
    chooseFile: "JPG、PNG、WebP、MP4、MOVファイルを選択してください。",
    photoSize: "写真は5 MB以下にしてください。",
    videoSize: "動画は30 MB以下にしてください。",
    videoLength: "動画は60秒以内にしてください。",
    invalidVideo: "動画の長さを確認できませんでした。",
    invalidLink: "有効なリンクを入力してください。",
    readDuration: "動画の長さを読み取れませんでした。",
    readVideo: "この動画ファイルを読み取れませんでした。",
    shareFailed: "Storyを共有できませんでした",
    networkError: "Story共有中にネットワークエラーが発生しました",
    uploadTimeout: "Storyのアップロードに時間がかかりすぎました。もう一度お試しください。",
    saveDetailsFailed: "Storyの詳細を保存できませんでした",
  },
  ko: {
    close: "닫기",
    save: "저장",
    createStory: "Story 만들기",
    chooseDevice: "기기에서 선택",
    selectMedia: "사진 한 장 또는 동영상 하나를 선택하세요.",
    photos: "사진",
    videos: "동영상",
    back: "뒤로",
    more: "더 보기",
    writeAlt: "대체 텍스트 작성",
    text: "텍스트",
    mention: "멘션",
    link: "링크",
    public: "공개",
    share: "공유",
    sharing: "공유 중 {{count}}%",
    discardTitle: "Story를 삭제할까요?",
    discardBody: "이 Story와 변경 내용이 모두 사라집니다.",
    keepEditing: "계속 편집",
    discardStory: "Story 삭제",
    writeText: "텍스트 입력",
    describeStory: "이 Story 설명",
    chooseFile: "JPG, PNG, WebP, MP4 또는 MOV 파일을 선택하세요.",
    photoSize: "사진은 5 MB 이하여야 합니다.",
    videoSize: "동영상은 30 MB 이하여야 합니다.",
    videoLength: "동영상은 60초 이하여야 합니다.",
    invalidVideo: "동영상 길이를 확인할 수 없습니다.",
    invalidLink: "올바른 링크를 입력하세요.",
    readDuration: "동영상 길이를 읽을 수 없습니다.",
    readVideo: "이 동영상 파일을 읽을 수 없습니다.",
    shareFailed: "Story를 공유하지 못했습니다",
    networkError: "Story 공유 중 네트워크 오류가 발생했습니다",
    uploadTimeout: "Story 업로드 시간이 너무 오래 걸립니다. 다시 시도하세요.",
    saveDetailsFailed: "Story 세부정보를 저장하지 못했습니다",
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime'])
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 30 * 1024 * 1024
const MAX_VIDEO_DURATION_SECONDS = 60

const MODE_CONFIG = {
  reader: {
    apiPath: '/api/reader-stories/me',
    returnPath: '/discover',
  },
  author: {
    apiPath: '/api/author-stories/me',
    returnPath: '/author/page',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)

    function cleanup() {
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(objectUrl)
    }

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const duration = Number(video.duration || 0)
      cleanup()

      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error(getDisplayText('storyComposer.readDuration')))
        return
      }

      resolve(duration)
    }

    video.onerror = () => {
      cleanup()
      reject(new Error(getDisplayText('storyComposer.readVideo')))
    }

    video.src = objectUrl
  })
}

function uploadStory({ apiPath, file, textOverlay, token, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const formData = new FormData()

    formData.append('media', file)
    formData.append('caption', textOverlay.trim())
    formData.append('allow_messages', 'true')

    request.open('POST', `${API_BASE_URL}${apiPath}`)
    request.setRequestHeader('Authorization', `Bearer ${token}`)
    request.timeout = 180000

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)))
    }

    request.onload = () => {
      let data = {}

      try {
        data = JSON.parse(request.responseText || '{}')
      } catch {
        data = {}
      }

      if (request.status >= 200 && request.status < 300 && data.ok !== false) {
        onProgress(100)
        resolve(data.story || null)
        return
      }

      reject(new Error(data.message || getDisplayText('storyComposer.shareFailed')))
    }

    request.onerror = () => reject(new Error(getDisplayText('storyComposer.networkError')))
    request.ontimeout = () => reject(new Error(getDisplayText('storyComposer.uploadTimeout')))
    request.send(formData)
  })
}

async function saveStoryExtras({
  apiPath,
  storyId,
  token,
  textOverlay,
  altText,
  mentionUsername,
  linkUrl,
}) {
  const response = await fetch(
    `${API_BASE_URL}${apiPath}/${encodeURIComponent(storyId)}/extras`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text_overlay: textOverlay.trim(),
        alt_text: altText.trim(),
        mention_username: mentionUsername.trim(),
        link_url: linkUrl.trim(),
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('storyComposer.saveDetailsFailed'))
  }
}

async function deleteCreatedStory({ apiPath, storyId, token }) {
  await fetch(`${API_BASE_URL}${apiPath}/${encodeURIComponent(storyId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null)
}

function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/45">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label={getDisplayText('storyComposer.close')} />
      <section
        className="relative z-10 w-full max-w-[680px] rounded-t-[24px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 text-[var(--shadow-text-primary)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />
        {children}
      </section>
    </div>
  )
}

function EditorSheet({ title, value, placeholder, maxLength, multiline = false, onSave, onClose }) {
  const [draft, setDraft] = useState(value)

  return (
    <BottomSheet onClose={onClose}>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-bold">{title}</h2>
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-full bg-[var(--shadow-text-primary)] px-5 py-2 text-[12px] font-bold text-[var(--shadow-bg-surface)]"
        >
          {getDisplayText('storyComposer.save')}
        </button>
      </div>

      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          rows={5}
          placeholder={placeholder}
          className="mt-5 min-h-[130px] w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] leading-6 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] focus:border-[var(--shadow-border-strong)]"
        />
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="mt-5 h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] focus:border-[var(--shadow-border-strong)]"
        />
      )}

      <div className="mt-2 text-right text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
        {draft.length}/{maxLength}
      </div>
    </BottomSheet>
  )
}

function ToolButton({ icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 text-white">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active ? 'bg-white text-black' : 'bg-black/55 text-white'
        }`}
      >
        <i className={`${icon} text-[19px]`} />
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  )
}

export default function StoryComposer({ mode }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const config = MODE_CONFIG[mode] || MODE_CONFIG.reader

  const [step, setStep] = useState('choose')
  const [mediaFile, setMediaFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [textOverlay, setTextOverlay] = useState('')
  const [altText, setAltText] = useState('')
  const [mentionUsername, setMentionUsername] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [sheet, setSheet] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!error) return undefined
    const timer = window.setTimeout(() => setError(''), 3500)
    return () => window.clearTimeout(timer)
  }, [error])

  function leaveComposer() {
    navigate(config.returnPath, { replace: true })
  }

  async function chooseMedia(file) {
    if (!file) return

    const isPhoto = PHOTO_TYPES.has(file.type)
    const isVideo = VIDEO_TYPES.has(file.type)

    if (!isPhoto && !isVideo) {
      setError(t('storyComposer.chooseFile'))
      return
    }

    if (isPhoto && file.size > MAX_PHOTO_BYTES) {
      setError(t('storyComposer.photoSize'))
      return
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError(t('storyComposer.videoSize'))
      return
    }

    if (isVideo) {
      try {
        const duration = await readVideoDuration(file)
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          setError(t('storyComposer.videoLength'))
          return
        }
      } catch (videoError) {
        setError(videoError.message || t('storyComposer.invalidVideo'))
        return
      }
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setMediaFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setTextOverlay('')
    setAltText('')
    setMentionUsername('')
    setLinkUrl('')
    setMoreOpen(false)
    setSheet('')
    setError('')
    setStep('edit')
  }

  function saveMention(value) {
    setMentionUsername(String(value || '').trim().replace(/^@+/, ''))
    setSheet('')
  }

  function saveLink(value) {
    const raw = String(value || '').trim()

    if (!raw) {
      setLinkUrl('')
      setSheet('')
      return
    }

    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

    try {
      const parsed = new URL(normalized)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
      setLinkUrl(parsed.toString())
      setSheet('')
    } catch {
      setError(t('storyComposer.invalidLink'))
    }
  }

  async function handleShare() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!mediaFile || sharing) return

    let createdStory = null

    try {
      setSharing(true)
      setUploadProgress(0)
      setError('')

      createdStory = await uploadStory({
        apiPath: config.apiPath,
        file: mediaFile,
        textOverlay,
        token,
        onProgress: setUploadProgress,
      })

      const hasExtras = Boolean(
        textOverlay.trim() ||
          altText.trim() ||
          mentionUsername.trim() ||
          linkUrl.trim()
      )

      if (hasExtras && createdStory?.id) {
        await saveStoryExtras({
          apiPath: config.apiPath,
          storyId: createdStory.id,
          token,
          textOverlay,
          altText,
          mentionUsername,
          linkUrl,
        })
      }

      navigate(config.returnPath, {
        replace: true,
        state: {
          storyShared: true,
          storyMode: mode,
        },
      })
    } catch (shareError) {
      if (createdStory?.id) {
        await deleteCreatedStory({
          apiPath: config.apiPath,
          storyId: createdStory.id,
          token,
        })
      }

      setError(shareError.message || t('storyComposer.shareFailed'))
    } finally {
      setSharing(false)
    }
  }

  const isVideo = mediaFile?.type?.startsWith('video/')
  const hasText = Boolean(textOverlay.trim())
  const hasMention = Boolean(mentionUsername.trim())
  const hasLink = Boolean(linkUrl.trim())

  if (step === 'choose') {
    return (
      <div className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
        <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)]">
          <div className="mx-auto grid h-[62px] max-w-[680px] grid-cols-[48px_1fr_48px] items-center px-2 pt-[env(safe-area-inset-top)]">
            <button
              type="button"
              onClick={leaveComposer}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[25px] active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('storyComposer.close')}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h1 className="text-center text-[18px] font-bold">{t('storyComposer.createStory')}</h1>
            <span />
          </div>
        </header>

        <main className="mx-auto max-w-[680px] px-4 py-6">
          <h2 className="text-[20px] font-bold">{t('storyComposer.chooseDevice')}</h2>
          <p className="mt-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('storyComposer.selectMedia')}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] px-4 active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] shadow-sm">
                <i className="fa-regular fa-image text-[24px]" />
              </span>
              <strong className="mt-4 text-[15px]">{t('storyComposer.photos')}</strong>
              <span className="mt-1 text-[10px] font-medium text-[var(--shadow-text-tertiary)]">JPG · PNG · WebP</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] px-4 active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] shadow-sm">
                <i className="fa-solid fa-video text-[22px]" />
              </span>
              <strong className="mt-4 text-[15px]">{t('storyComposer.videos')}</strong>
              <span className="mt-1 text-[10px] font-medium text-[var(--shadow-text-tertiary)]">MP4 · MOV</span>
            </button>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => chooseMedia(event.target.files?.[0] || null)}
          />

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime"
            className="hidden"
            onChange={(event) => chooseMedia(event.target.files?.[0] || null)}
          />
        </main>

        {error ? (
          <div className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-[520px] rounded-[14px] bg-[#111827] px-4 py-3 text-center text-[12px] font-semibold text-white shadow-xl">
            {error}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={previewUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <img src={previewUrl} alt={altText} className="h-full w-full object-contain" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setDiscardOpen(true)}
            disabled={sharing}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-[19px] backdrop-blur-md disabled:opacity-50"
            aria-label={t('storyComposer.back')}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              disabled={sharing}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-[20px] backdrop-blur-md disabled:opacity-50"
              aria-label={t('storyComposer.more')}
            >
              <i className="fa-solid fa-ellipsis" />
            </button>

            {moreOpen ? (
              <div className="absolute right-0 top-[50px] w-[190px] overflow-hidden rounded-[14px] bg-[#303033] py-1 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false)
                    setSheet('alt')
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold text-white active:bg-white/10"
                >
                  <i className="fa-solid fa-pen text-[13px]" />
                  {t('storyComposer.writeAlt')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {hasText ? (
        <button type="button" onClick={() => setSheet('text')} className="absolute inset-x-6 top-[40%] z-20 text-center">
          <span className="inline-block max-w-full break-words rounded-[12px] bg-black/40 px-4 py-2 text-[28px] font-bold leading-tight text-white shadow-lg backdrop-blur-sm">
            {textOverlay}
          </span>
        </button>
      ) : null}

      {hasMention ? (
        <button type="button" onClick={() => setSheet('mention')} className="absolute inset-x-0 bottom-[225px] z-20 flex justify-center px-5">
          <span className="max-w-full truncate rounded-full bg-white px-4 py-2 text-[14px] font-bold text-[#111827] shadow-lg">
            @{mentionUsername}
          </span>
        </button>
      ) : null}

      {hasLink ? (
        <button type="button" onClick={() => setSheet('link')} className="absolute inset-x-0 bottom-[178px] z-20 flex justify-center px-5">
          <span className="max-w-[85%] truncate rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#111827] shadow-lg">
            <i className="fa-solid fa-link mr-2" />
            {linkUrl.replace(/^https?:\/\//i, '')}
          </span>
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-[80px] z-30">
        <div className="mx-auto flex max-w-[680px] items-center justify-center gap-9 px-4">
          <ToolButton icon="fa-solid fa-font" label={t('storyComposer.text')} active={hasText} onClick={() => setSheet('text')} />
          <ToolButton icon="fa-solid fa-at" label={t('storyComposer.mention')} active={hasMention} onClick={() => setSheet('mention')} />
          <ToolButton icon="fa-solid fa-link" label={t('storyComposer.link')} active={hasLink} onClick={() => setSheet('link')} />
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-30 bg-black">
        <div className="mx-auto flex h-[80px] max-w-[680px] items-center justify-between gap-4 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#252527] px-4 py-2.5 text-[13px] font-semibold">
            <i className="fa-solid fa-earth-americas text-[12px]" />
            {t('storyComposer.public')}
          </div>

          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="min-w-[126px] rounded-[12px] bg-[#1877f2] px-6 py-3 text-[15px] font-bold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {sharing ? t('storyComposer.sharing', { count: uploadProgress }) : t('storyComposer.share')}
          </button>
        </div>
      </footer>

      {error ? (
        <div className="fixed inset-x-4 bottom-[170px] z-[150] mx-auto max-w-[520px] rounded-[14px] bg-white px-4 py-3 text-center text-[12px] font-semibold text-[#111827] shadow-xl">
          {error}
        </div>
      ) : null}

      {discardOpen ? (
        <BottomSheet onClose={() => setDiscardOpen(false)}>
          <h2 className="mt-4 text-[19px] font-bold">{t('storyComposer.discardTitle')}</h2>
          <p className="mt-1 text-[14px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('storyComposer.discardBody')}
          </p>

          <button
            type="button"
            onClick={() => setDiscardOpen(false)}
            className="mt-5 flex w-full items-center gap-4 rounded-[14px] px-2 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <i className="fa-solid fa-pen" />
            </span>
            <span className="text-[16px] font-semibold">{t('storyComposer.keepEditing')}</span>
          </button>

          <button
            type="button"
            onClick={leaveComposer}
            className="flex w-full items-center gap-4 rounded-[14px] px-2 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <i className="fa-solid fa-trash" />
            </span>
            <span className="text-[16px] font-semibold">{t('storyComposer.discardStory')}</span>
          </button>
        </BottomSheet>
      ) : null}

      {sheet === 'text' ? (
        <EditorSheet
          title={t('storyComposer.text')}
          value={textOverlay}
          placeholder={t('storyComposer.writeText')}
          maxLength={200}
          multiline
          onSave={(value) => {
            setTextOverlay(value)
            setSheet('')
          }}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'mention' ? (
        <EditorSheet
          title={t('storyComposer.mention')}
          value={mentionUsername ? `@${mentionUsername}` : ''}
          placeholder="@username"
          maxLength={81}
          onSave={saveMention}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'link' ? (
        <EditorSheet
          title={t('storyComposer.link')}
          value={linkUrl}
          placeholder="https://example.com"
          maxLength={2048}
          onSave={saveLink}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'alt' ? (
        <EditorSheet
          title={t('storyComposer.writeAlt')}
          value={altText}
          placeholder={t('storyComposer.describeStory')}
          maxLength={500}
          multiline
          onSave={(value) => {
            setAltText(value)
            setSheet('')
          }}
          onClose={() => setSheet('')}
        />
      ) : null}
    </div>
  )
}
