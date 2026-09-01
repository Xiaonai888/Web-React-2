import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageShareSheet from '../AuthorPageShareSheet'
import EchoShareSheetV2Connected from '../social/EchoShareSheetV2Connected'
import ReactionAction from '../social/reactions/ReactionAction'
import ReactionSummary from '../social/reactions/ReactionSummary'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPhotoViewer', {
  "en": {
    "reader": "Reader",
    "failedUpdatePhoto": "Failed to update photo",
    "captionSaved": "Caption saved.",
    "captionRemoved": "Caption removed.",
    "failedSaveCaption": "Failed to save caption.",
    "altSaved": "Alt text saved.",
    "altRemoved": "Alt text removed.",
    "failedSaveAlt": "Failed to save alt text.",
    "postNeedsContent": "This post needs text or a photo. Delete the post instead.",
    "failedDeletePhoto": "Failed to delete photo",
    "photoDeleted": "Photo deleted.",
    "couldNotDownload": "Could not download photo",
    "photoSaved": "Photo saved.",
    "photoOpened": "Photo opened for saving.",
    "position": "{{current}} of {{total}}",
    "commentsCount": "{{count}} comments",
    "sharesCount": "{{count}} shares",
    "like": "Like",
    "comment": "Comment",
    "share": "Share",
    "editCaption": "Edit caption",
    "deletePhoto": "Delete photo",
    "saveToPhone": "Save to phone",
    "shareExternal": "Share external",
    "reportPhoto": "Report photo",
    "editAltText": "Edit alt text",
    "photoNumber": "Photo {{number}}",
    "captionPlaceholder": "Write a caption for this photo...",
    "cancel": "Cancel",
    "saving": "Saving...",
    "save": "Save",
    "altDescription": "Describe what is shown in this photo for accessibility.",
    "altPlaceholder": "Describe this photo...",
    "deleteTitle": "Delete this photo?",
    "deleteDescription": "This photo will be removed from this Reader post.",
    "deleting": "Deleting...",
    "delete": "Delete",
    "sharePhoto": "Share Photo",
    "photoShareText": "View {{name}}'s photo on Shadow.",
    "photoLinkCopied": "Photo link copied.",
    "readerPost": "Reader post",
    "readerPostLabel": "reader post",
    "readerPhoto": "{{name}} photo"
  },
  "km": {
    "reader": "អ្នកអាន",
    "failedUpdatePhoto": "មិនអាចអាប់ដេតរូបបានទេ",
    "captionSaved": "បានរក្សាទុក Caption។",
    "captionRemoved": "បានលុប Caption។",
    "failedSaveCaption": "មិនអាចរក្សាទុក Caption បានទេ។",
    "altSaved": "បានរក្សាទុក Alt text។",
    "altRemoved": "បានលុប Alt text។",
    "failedSaveAlt": "មិនអាចរក្សាទុក Alt text បានទេ។",
    "postNeedsContent": "ប្រកាសនេះត្រូវមានអត្ថបទ ឬរូបមួយ។ សូមលុបប្រកាសជំនួសវិញ។",
    "failedDeletePhoto": "មិនអាចលុបរូបបានទេ",
    "photoDeleted": "បានលុបរូប។",
    "couldNotDownload": "មិនអាចទាញយករូបបានទេ",
    "photoSaved": "បានរក្សាទុករូប។",
    "photoOpened": "បានបើករូបសម្រាប់រក្សាទុក។",
    "position": "{{current}} ក្នុង {{total}}",
    "commentsCount": "{{count}} មតិយោបល់",
    "sharesCount": "{{count}} ចែករំលែក",
    "like": "ចូលចិត្ត",
    "comment": "មតិយោបល់",
    "share": "ចែករំលែក",
    "editCaption": "កែ Caption",
    "deletePhoto": "លុបរូប",
    "saveToPhone": "រក្សាទុកក្នុងទូរស័ព្ទ",
    "shareExternal": "ចែករំលែកទៅខាងក្រៅ",
    "reportPhoto": "រាយការណ៍រូប",
    "editAltText": "កែ Alt text",
    "photoNumber": "រូបទី {{number}}",
    "captionPlaceholder": "សរសេរ Caption សម្រាប់រូបនេះ...",
    "cancel": "បោះបង់",
    "saving": "កំពុងរក្សាទុក...",
    "save": "រក្សាទុក",
    "altDescription": "ពិពណ៌នាអ្វីដែលមានក្នុងរូបនេះសម្រាប់ភាពងាយស្រួលប្រើប្រាស់។",
    "altPlaceholder": "ពិពណ៌នារូបនេះ...",
    "deleteTitle": "លុបរូបនេះ?",
    "deleteDescription": "រូបនេះនឹងត្រូវដកចេញពីប្រកាសអ្នកអាននេះ។",
    "deleting": "កំពុងលុប...",
    "delete": "លុប",
    "sharePhoto": "ចែករំលែករូប",
    "photoShareText": "មើលរូបរបស់ {{name}} នៅលើ Shadow។",
    "photoLinkCopied": "បានចម្លងតំណរូប។",
    "readerPost": "ប្រកាសអ្នកអាន",
    "readerPostLabel": "ប្រកាសអ្នកអាន",
    "readerPhoto": "រូបរបស់ {{name}}"
  },
  "zh": {
    "reader": "读者",
    "failedUpdatePhoto": "无法更新照片",
    "captionSaved": "说明已保存。",
    "captionRemoved": "说明已移除。",
    "failedSaveCaption": "无法保存说明。",
    "altSaved": "替代文本已保存。",
    "altRemoved": "替代文本已移除。",
    "failedSaveAlt": "无法保存替代文本。",
    "postNeedsContent": "此帖子需要文字或照片，请改为删除帖子。",
    "failedDeletePhoto": "无法删除照片",
    "photoDeleted": "照片已删除。",
    "couldNotDownload": "无法下载照片",
    "photoSaved": "照片已保存。",
    "photoOpened": "照片已打开以便保存。",
    "position": "{{current}} / {{total}}",
    "commentsCount": "{{count}} 条评论",
    "sharesCount": "{{count}} 次分享",
    "like": "赞",
    "comment": "评论",
    "share": "分享",
    "editCaption": "编辑说明",
    "deletePhoto": "删除照片",
    "saveToPhone": "保存到手机",
    "shareExternal": "外部分享",
    "reportPhoto": "举报照片",
    "editAltText": "编辑替代文本",
    "photoNumber": "照片 {{number}}",
    "captionPlaceholder": "为这张照片写说明...",
    "cancel": "取消",
    "saving": "保存中...",
    "save": "保存",
    "altDescription": "描述照片中显示的内容，以提升无障碍体验。",
    "altPlaceholder": "描述这张照片...",
    "deleteTitle": "删除这张照片？",
    "deleteDescription": "这张照片将从此读者帖子中移除。",
    "deleting": "删除中...",
    "delete": "删除",
    "sharePhoto": "分享照片",
    "photoShareText": "在 Shadow 上查看 {{name}} 的照片。",
    "photoLinkCopied": "照片链接已复制。",
    "readerPost": "读者帖子",
    "readerPostLabel": "读者帖子",
    "readerPhoto": "{{name}} 的照片"
  },
  "ja": {
    "reader": "読者",
    "failedUpdatePhoto": "写真を更新できませんでした",
    "captionSaved": "キャプションを保存しました。",
    "captionRemoved": "キャプションを削除しました。",
    "failedSaveCaption": "キャプションを保存できませんでした。",
    "altSaved": "代替テキストを保存しました。",
    "altRemoved": "代替テキストを削除しました。",
    "failedSaveAlt": "代替テキストを保存できませんでした。",
    "postNeedsContent": "この投稿にはテキストまたは写真が必要です。代わりに投稿を削除してください。",
    "failedDeletePhoto": "写真を削除できませんでした",
    "photoDeleted": "写真を削除しました。",
    "couldNotDownload": "写真をダウンロードできませんでした",
    "photoSaved": "写真を保存しました。",
    "photoOpened": "保存するため写真を開きました。",
    "position": "{{current}} / {{total}}",
    "commentsCount": "コメント {{count}}件",
    "sharesCount": "シェア {{count}}件",
    "like": "いいね",
    "comment": "コメント",
    "share": "シェア",
    "editCaption": "キャプションを編集",
    "deletePhoto": "写真を削除",
    "saveToPhone": "端末に保存",
    "shareExternal": "外部にシェア",
    "reportPhoto": "写真を報告",
    "editAltText": "代替テキストを編集",
    "photoNumber": "写真 {{number}}",
    "captionPlaceholder": "この写真のキャプションを書く...",
    "cancel": "キャンセル",
    "saving": "保存中...",
    "save": "保存",
    "altDescription": "アクセシビリティのため、この写真に写っている内容を説明してください。",
    "altPlaceholder": "この写真を説明...",
    "deleteTitle": "この写真を削除しますか？",
    "deleteDescription": "この写真は読者投稿から削除されます。",
    "deleting": "削除中...",
    "delete": "削除",
    "sharePhoto": "写真をシェア",
    "photoShareText": "Shadowで{{name}}の写真を見る。",
    "photoLinkCopied": "写真のリンクをコピーしました。",
    "readerPost": "読者投稿",
    "readerPostLabel": "読者投稿",
    "readerPhoto": "{{name}}の写真"
  },
  "ko": {
    "reader": "독자",
    "failedUpdatePhoto": "사진을 업데이트하지 못했습니다",
    "captionSaved": "캡션을 저장했습니다.",
    "captionRemoved": "캡션을 삭제했습니다.",
    "failedSaveCaption": "캡션을 저장하지 못했습니다.",
    "altSaved": "대체 텍스트를 저장했습니다.",
    "altRemoved": "대체 텍스트를 삭제했습니다.",
    "failedSaveAlt": "대체 텍스트를 저장하지 못했습니다.",
    "postNeedsContent": "이 게시물에는 텍스트나 사진이 필요합니다. 대신 게시물을 삭제하세요.",
    "failedDeletePhoto": "사진을 삭제하지 못했습니다",
    "photoDeleted": "사진을 삭제했습니다.",
    "couldNotDownload": "사진을 다운로드하지 못했습니다",
    "photoSaved": "사진을 저장했습니다.",
    "photoOpened": "저장할 수 있도록 사진을 열었습니다.",
    "position": "{{current}} / {{total}}",
    "commentsCount": "댓글 {{count}}개",
    "sharesCount": "공유 {{count}}회",
    "like": "좋아요",
    "comment": "댓글",
    "share": "공유",
    "editCaption": "캡션 수정",
    "deletePhoto": "사진 삭제",
    "saveToPhone": "휴대폰에 저장",
    "shareExternal": "외부 공유",
    "reportPhoto": "사진 신고",
    "editAltText": "대체 텍스트 수정",
    "photoNumber": "사진 {{number}}",
    "captionPlaceholder": "이 사진의 캡션을 작성하세요...",
    "cancel": "취소",
    "saving": "저장 중...",
    "save": "저장",
    "altDescription": "접근성을 위해 이 사진에 보이는 내용을 설명하세요.",
    "altPlaceholder": "이 사진을 설명하세요...",
    "deleteTitle": "이 사진을 삭제할까요?",
    "deleteDescription": "이 사진은 독자 게시물에서 삭제됩니다.",
    "deleting": "삭제 중...",
    "delete": "삭제",
    "sharePhoto": "사진 공유",
    "photoShareText": "Shadow에서 {{name}}의 사진을 확인하세요.",
    "photoLinkCopied": "사진 링크를 복사했습니다.",
    "readerPost": "독자 게시물",
    "readerPostLabel": "독자 게시물",
    "readerPhoto": "{{name}}의 사진"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_PHOTO_CAPTION_LENGTH = 2000
const MAX_PHOTO_ALT_TEXT_LENGTH = 500

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatPhotoViewerDateTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId() || 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getVisibilityIcon(value) {
  if (value === 'only_me' || value === 'private') {
    return 'fa-solid fa-lock'
  }

  if (value === 'friends') {
    return 'fa-solid fa-user-group'
  }

  if (value === 'followers') {
    return 'fa-solid fa-users'
  }

  if (value === 'friends_and_followers') {
    return 'fa-solid fa-user-group'
  }

  return 'fa-solid fa-earth-americas'
}

function buildPhotoMetadata(photos, metadata, selectedIndex, field, value) {
  const byUrl = new Map(
    metadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  return photos.map((url, index) => {
    const existing =
      byUrl.get(String(url)) ||
      metadata[index] ||
      {}

    return {
      url,
      caption:
        field === 'caption' && index === selectedIndex
          ? value
          : String(existing.caption || ''),
      alt_text:
        field === 'alt_text' && index === selectedIndex
          ? value
          : String(existing.alt_text ?? existing.alt ?? ''),
    }
  })
}

export default function ReaderAuthorStylePhotoViewer({
  open,
  post,
  imageUrls,
  selectedPhotoIndex = 0,
  isOwner = false,
  reactionType = null,
  reactionCount = 0,
  reactionSummary = [],
  reactionBusy = false,
  commentCount = 0,
  shareCount = 0,
  routePhotoMode = false,
  onReact,
  onComment,
  onUpdated,
  onShareCountChange,
  onClose,
}) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [controlsVisible, setControlsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [captionEditorOpen, setCaptionEditorOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionSaving, setCaptionSaving] = useState(false)
  const [altEditorOpen, setAltEditorOpen] = useState(false)
  const [altText, setAltText] = useState('')
  const [altSaving, setAltSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [externalShareOpen, setExternalShareOpen] = useState(false)
  const [echoOpen, setEchoOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const user = post?.user || {}

  const photos = useMemo(
    () =>
      (Array.isArray(imageUrls) ? imageUrls : post?.image_urls || [])
        .filter((url) => typeof url === 'string' && url.trim())
        .slice(0, 5),
    [imageUrls, post?.image_urls]
  )

  const safeIndex = photos.length
    ? Math.min(
        photos.length - 1,
        Math.max(
          0,
          Number.isFinite(Number(activeIndex))
            ? Math.floor(Number(activeIndex))
            : 0
        )
      )
    : 0

  const selectedPhotoUrl = photos[safeIndex] || ''

  const photoMetadata = Array.isArray(post?.photo_metadata)
    ? post.photo_metadata
    : []

  const selectedMetadata =
    photoMetadata.find(
      (item) =>
        String(item?.url || '') ===
        String(selectedPhotoUrl || '')
    ) ||
    photoMetadata[safeIndex] ||
    {}

  const selectedCaption = String(
    selectedMetadata?.caption || ''
  )

  const selectedAltText = String(
    selectedMetadata?.alt_text ??
      selectedMetadata?.alt ??
      ''
  )

  const readerName =
    user?.name ||
    user?.username ||
    t('readerPhotoViewer.reader')

  const readerUsername = String(
    user?.username || ''
  ).trim()

  const readerAvatarUrl =
    user?.avatar_url || ''

  const firstLetter =
    readerName
      .trim()
      .slice(0, 1)
      .toUpperCase() || 'R'

  const viewerDate = formatPhotoViewerDateTime(
    post?.created_at
  )

  const visibilityIcon = getVisibilityIcon(
    post?.visibility || 'public'
  )

  const readerPostShareUrl =
    `${window.location.origin}/reader/post/${encodeURIComponent(
      post?.id || ''
    )}`

  useEffect(() => {
    if (!open) return

    setActiveIndex(
      Math.max(
        0,
        Number.isFinite(Number(selectedPhotoIndex))
          ? Math.floor(Number(selectedPhotoIndex))
          : 0
      )
    )
    setControlsVisible(true)
    setMenuOpen(false)
    setCaptionEditorOpen(false)
    setAltEditorOpen(false)
    setDeleteConfirmOpen(false)
    setActionMessage('')
    setExternalShareOpen(false)
    setEchoOpen(false)
  }, [open, selectedPhotoIndex, post?.id])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key !== 'Escape') {
        return
      }

      if (externalShareOpen || echoOpen) {
        return
      }

      if (altEditorOpen) {
        if (!altSaving) {
          setAltEditorOpen(false)
        }
        return
      }

      if (captionEditorOpen) {
        if (!captionSaving) {
          setCaptionEditorOpen(false)
        }
        return
      }

      if (deleteConfirmOpen) {
        if (!deleteBusy) {
          setDeleteConfirmOpen(false)
        }
        return
      }

      if (menuOpen) {
        setMenuOpen(false)
        return
      }

      onClose?.()
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.body.style.overflow =
        previousOverflow
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [
    altEditorOpen,
    altSaving,
    captionEditorOpen,
    captionSaving,
    deleteBusy,
    deleteConfirmOpen,
    echoOpen,
    externalShareOpen,
    menuOpen,
    onClose,
    open,
  ])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setActionMessage(''),
      1800
    )

    return () =>
      window.clearTimeout(timer)
  }, [actionMessage])

  if (!open || !selectedPhotoUrl) {
    return null
  }

  function openReaderProfile() {
    if (!readerUsername) {
      return
    }

    navigate(
      `/profile?username=${encodeURIComponent(
        readerUsername
      )}`
    )
  }

  function openCaptionEditor(event) {
    event?.stopPropagation()

    if (!isOwner) {
      return
    }

    setCaption(selectedCaption)
    setMenuOpen(false)
    setCaptionEditorOpen(true)
  }

  function openAltEditor(event) {
    event?.stopPropagation()

    if (!isOwner) {
      return
    }

    setAltText(selectedAltText)
    setMenuOpen(false)
    setAltEditorOpen(true)
  }

  async function updatePhotoMetadata(
    field,
    value
  ) {
    if (
      !isOwner ||
      !post?.id ||
      !selectedPhotoUrl
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    const nextMetadata =
      buildPhotoMetadata(
        photos,
        photoMetadata,
        safeIndex,
        field,
        value
      )

    const response = await fetch(
      `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(
        post.id
      )}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_metadata: nextMetadata,
        }),
      }
    )

    const data = await response
      .json()
      .catch(() => ({}))

    if (
      !response.ok ||
      data.ok === false
    ) {
      throw new Error(
        data.message ||
          t('readerPhotoViewer.failedUpdatePhoto')
      )
    }

    onUpdated?.(
      data.post || {
        ...post,
        photo_metadata: nextMetadata,
      }
    )
  }

  async function saveCaption(event) {
    event?.stopPropagation()

    if (
      captionSaving ||
      !isOwner
    ) {
      return
    }

    const nextCaption =
      caption
        .slice(
          0,
          MAX_PHOTO_CAPTION_LENGTH
        )
        .trim()

    try {
      setCaptionSaving(true)

      await updatePhotoMetadata(
        'caption',
        nextCaption
      )

      setCaptionEditorOpen(false)
      setActionMessage(
        nextCaption
          ? t('readerPhotoViewer.captionSaved')
          : t('readerPhotoViewer.captionRemoved')
      )
    } catch (error) {
      setActionMessage(
        error.message ||
          t('readerPhotoViewer.failedSaveCaption')
      )
    } finally {
      setCaptionSaving(false)
    }
  }

  async function saveAltText(event) {
    event?.stopPropagation()

    if (
      altSaving ||
      !isOwner
    ) {
      return
    }

    const nextAltText =
      altText
        .slice(
          0,
          MAX_PHOTO_ALT_TEXT_LENGTH
        )
        .trim()

    try {
      setAltSaving(true)

      await updatePhotoMetadata(
        'alt_text',
        nextAltText
      )

      setAltEditorOpen(false)
      setActionMessage(
        nextAltText
          ? t('readerPhotoViewer.altSaved')
          : t('readerPhotoViewer.altRemoved')
      )
    } catch (error) {
      setActionMessage(
        error.message ||
          t('readerPhotoViewer.failedSaveAlt')
      )
    } finally {
      setAltSaving(false)
    }
  }

  async function deleteSelectedPhoto(
    event
  ) {
    event?.stopPropagation()

    if (
      !isOwner ||
      deleteBusy ||
      !post?.id
    ) {
      return
    }

    const remainingPhotos =
      photos.filter(
        (_, index) =>
          index !== safeIndex
      )

    const currentContent =
      String(post?.content || '').trim()

    if (
      !remainingPhotos.length &&
      !currentContent
    ) {
      setDeleteConfirmOpen(false)
      setActionMessage(
        t('readerPhotoViewer.postNeedsContent')
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setDeleteConfirmOpen(false)
      onClose?.()
      navigate('/login')
      return
    }

    try {
      setDeleteBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(
          post.id
        )}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: currentContent,
            image_urls:
              remainingPhotos,
          }),
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('readerPhotoViewer.failedDeletePhoto')
        )
      }

      const updatedPost =
        data.post || {
          ...post,
          content: currentContent,
          image_urls:
            remainingPhotos,
        }

      onUpdated?.(updatedPost)
      setDeleteConfirmOpen(false)
      setMenuOpen(false)

      if (!remainingPhotos.length) {
        if (routePhotoMode) {
          navigate(
            `/reader/post/${encodeURIComponent(
              post.id
            )}`,
            {
              replace: true,
            }
          )
        }

        onClose?.()
        return
      }

      const nextIndex =
        Math.min(
          safeIndex,
          remainingPhotos.length - 1
        )

      setActiveIndex(nextIndex)
      setActionMessage(
        t('readerPhotoViewer.photoDeleted')
      )

      if (routePhotoMode) {
        navigate(
          `/reader/post/${encodeURIComponent(
            post.id
          )}?photo=${nextIndex}`,
          {
            replace: true,
          }
        )
      }
    } catch (error) {
      setDeleteConfirmOpen(false)
      setActionMessage(
        error.message ||
          t('readerPhotoViewer.failedDeletePhoto')
      )
    } finally {
      setDeleteBusy(false)
    }
  }

  async function saveSelectedPhoto(
    event
  ) {
    event?.stopPropagation()

    if (!selectedPhotoUrl) {
      return
    }

    try {
      const response = await fetch(
        selectedPhotoUrl,
        {
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        throw new Error(
          t('readerPhotoViewer.couldNotDownload')
        )
      }

      const blob =
        await response.blob()

      const objectUrl =
        URL.createObjectURL(blob)

      const extension =
        String(blob.type || '')
          .split('/')[1]
          ?.split(';')[0]
          ?.replace('jpeg', 'jpg') ||
        'jpg'

      const link =
        document.createElement('a')

      link.href = objectUrl
      link.download =
        `shadow-reader-photo-${post.id}-${safeIndex + 1}.${extension}`

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.setTimeout(
        () =>
          URL.revokeObjectURL(
            objectUrl
          ),
        1000
      )

      setMenuOpen(false)
      setActionMessage(
        t('readerPhotoViewer.photoSaved')
      )
    } catch {
      const link =
        document.createElement('a')

      link.href =
        selectedPhotoUrl
      link.target = '_blank'
      link.rel =
        'noopener noreferrer'
      link.download =
        `shadow-reader-photo-${post.id}-${safeIndex + 1}`

      document.body.appendChild(link)
      link.click()
      link.remove()

      setMenuOpen(false)
      setActionMessage(
        t('readerPhotoViewer.photoOpened')
      )
    }
  }

  function reportSelectedPhoto(
    event
  ) {
    event?.stopPropagation()

    if (
      isOwner ||
      !post?.id
    ) {
      return
    }

    setMenuOpen(false)

    navigate(
      `/report/reader_post/${encodeURIComponent(
        post.id
      )}`,
      {
        state: {
          reportContext: 'photo',
          targetTitle:
            `${readerName} photo`,
          sourceUrl:
            selectedPhotoUrl,
          returnTo:
            `/reader/post/${encodeURIComponent(
              post.id
            )}?photo=${safeIndex}`,
        },
      }
    )
  }

  function openEchoShare(event) {
    event?.stopPropagation()
    setEchoOpen(true)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[150000] bg-black"
        onClick={() => {
          if (
            captionEditorOpen ||
            altEditorOpen
          ) {
            return
          }

          if (deleteConfirmOpen) {
            if (!deleteBusy) {
              setDeleteConfirmOpen(false)
            }
            return
          }

          if (menuOpen) {
            setMenuOpen(false)
            return
          }

          setControlsVisible(
            (current) => !current
          )
        }}
      >
        {controlsVisible ? (
          <div
            className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/90 via-black/65 to-transparent pb-10 pt-[max(8px,env(safe-area-inset-top))]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="relative flex h-12 items-center justify-between px-3">
              <button
                type="button"
                onClick={() =>
                  onClose?.()
                }
                className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
                aria-label="Close fullscreen photo"
              >
                <i className="fa-solid fa-xmark text-[22px]" />
              </button>

              {photos.length > 1 ? (
                <div className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-white">
                  {t('readerPhotoViewer.position', {
                    current: safeIndex + 1,
                    total: photos.length,
                  })}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
                aria-label="Photo options"
              >
                <i className="fa-solid fa-ellipsis text-[19px]" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden">
          <img
            src={selectedPhotoUrl}
            alt={selectedAltText}
            loading="eager"
            decoding="async"
            draggable="false"
            className="max-h-[100dvh] max-w-full select-none object-contain"
          />
        </div>

        {controlsVisible &&
        !menuOpen &&
        !captionEditorOpen &&
        !altEditorOpen &&
        !deleteConfirmOpen ? (
          <div
            className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-14"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto max-w-[620px]">
              <button
                type="button"
                onClick={
                  openReaderProfile
                }
                className="flex w-full items-center gap-3 px-4 pb-3 text-left active:opacity-70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-[15px] font-semibold text-white ring-1 ring-white/20">
                  {readerAvatarUrl ? (
                    <img
                      src={
                        readerAvatarUrl
                      }
                      alt={readerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </span>

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-white">
                    {readerName}
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
                    <span>
                      {viewerDate}
                    </span>

                    <span>·</span>

                    <i
                      className={`${visibilityIcon} text-[10px]`}
                    />
                  </div>
                </div>
              </button>

              <div className="flex items-center justify-between border-b border-white/15 px-4 pb-2 text-[11px] text-white/75">
                <ReactionSummary
                  summary={
                    reactionSummary
                  }
                  likeCount={
                    reactionCount
                  }
                  myReaction={
                    reactionType
                  }
                />

                <div className="flex items-center gap-4">
                  <span>
                    {t('readerPhotoViewer.commentsCount', {
                      count: Number(commentCount || 0),
                    })}
                  </span>

                  <span>
                    {t('readerPhotoViewer.sharesCount', {
                      count: Number(shareCount || 0),
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
                <ReactionAction
                  reactionType={
                    reactionType
                  }
                  count={
                    reactionCount
                  }
                  busy={
                    reactionBusy
                  }
                  onReact={
                    onReact
                  }
                  showCount={false}
                  idleLabel={t('readerPhotoViewer.like')}
                  idleIcon={
                    <>
                      <i className="fa-regular fa-heart text-[20px]" />
                      <span className="text-[14px] font-medium">
                        {t('readerPhotoViewer.like')}
                      </span>
                    </>
                  }
                  className="flex-1 justify-center"
                  buttonClassName="h-12 min-w-[88px] justify-center gap-2 text-white [&>i]:!text-[20px] [&>img]:!h-5 [&>img]:!w-5"
                />

                <button
                  type="button"
                  onClick={() =>
                    onComment?.()
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
                >
                  <i className="fa-regular fa-comment text-[20px]" />
                  <span>
                    {t('readerPhotoViewer.comment')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    openEchoShare
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
                >
                  <img
                    src="/assets/Icons/echo.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain brightness-0 invert"
                  />
                  <span>
                    {t('readerPhotoViewer.share')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {controlsVisible &&
        selectedCaption &&
        !menuOpen &&
        !captionEditorOpen &&
        !altEditorOpen &&
        !deleteConfirmOpen ? (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] left-0 right-0 z-20 px-5 text-center">
            <p className="mx-auto max-w-[720px] whitespace-pre-wrap break-words text-[13px] leading-5 text-white">
              {selectedCaption}
            </p>
          </div>
        ) : null}

        {actionMessage ? (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+94px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--shadow-bg-elevated)] px-4 py-2 text-[12px] font-medium text-[var(--shadow-text-primary)] shadow-xl">
            {actionMessage}
          </div>
        ) : null}

        {menuOpen ? (
          <div
            className="absolute inset-0 z-40 flex items-end bg-black/35"
            onClick={(event) => {
              event.stopPropagation()
              setMenuOpen(false)
            }}
          >
            <div
              className="w-full bg-[var(--shadow-bg-elevated)] px-2 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {isOwner ? (
                <button
                  type="button"
                  onClick={
                    openCaptionEditor
                  }
                  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                    <i className="fa-solid fa-pencil text-[19px]" />
                  </span>
                  <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.editCaption')}
                  </span>
                </button>
              ) : null}

              {isOwner ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setMenuOpen(false)
                    setDeleteConfirmOpen(
                      true
                    )
                  }}
                  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                    <i className="fa-regular fa-trash-can text-[20px]" />
                  </span>
                  <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.deletePhoto')}
                  </span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={
                  saveSelectedPhoto
                }
                className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
              >
                <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3v11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                  {t('readerPhotoViewer.saveToPhone')}
                </span>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setMenuOpen(false)
                  setExternalShareOpen(
                    true
                  )
                }}
                className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
              >
                <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                  <i className="fa-solid fa-share text-[19px]" />
                </span>
                <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                  {t('readerPhotoViewer.shareExternal')}
                </span>
              </button>

              {!isOwner ? (
                <button
                  type="button"
                  onClick={
                    reportSelectedPhoto
                  }
                  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                    <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-current">
                      <i className="fa-solid fa-question text-[10px]" />
                    </span>
                  </span>

                  <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.reportPhoto')}
                  </span>
                </button>
              ) : null}

              {isOwner ? (
                <button
                  type="button"
                  onClick={
                    openAltEditor
                  }
                  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-[5px] border-2 border-[var(--shadow-border-strong)] text-[14px] font-semibold text-[var(--shadow-text-secondary)]">
                      A
                    </span>
                  </span>
                  <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.editAltText')}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {captionEditorOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!captionSaving) {
                setCaptionEditorOpen(
                  false
                )
              }
            }}
          >
            <div
              className="w-full rounded-t-[22px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.editCaption')}
                  </div>
                  <div className="mt-1 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
                    {t('readerPhotoViewer.photoNumber', {
                      number: safeIndex + 1,
                    })}
                  </div>
                </div>

                <span className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                  {caption.length} /{' '}
                  {
                    MAX_PHOTO_CAPTION_LENGTH
                  }
                </span>
              </div>

              <textarea
                autoFocus
                value={caption}
                maxLength={
                  MAX_PHOTO_CAPTION_LENGTH
                }
                onChange={(event) =>
                  setCaption(
                    event.target.value.slice(
                      0,
                      MAX_PHOTO_CAPTION_LENGTH
                    )
                  )
                }
                placeholder={t('readerPhotoViewer.captionPlaceholder')}
                className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3.5 py-3 text-[14px] font-normal leading-5 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]"
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={
                    captionSaving
                  }
                  onClick={() =>
                    setCaptionEditorOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50"
                >
                  {t('readerPhotoViewer.cancel')}
                </button>

                <button
                  type="button"
                  disabled={
                    captionSaving
                  }
                  onClick={
                    saveCaption
                  }
                  className="h-11 flex-1 rounded-full bg-[var(--shadow-text-primary)] text-[14px] font-semibold text-[var(--shadow-bg-surface)] disabled:opacity-50"
                >
                  {captionSaving
                    ? t('readerPhotoViewer.saving')
                    : t('readerPhotoViewer.save')}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {altEditorOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!altSaving) {
                setAltEditorOpen(false)
              }
            }}
          >
            <div
              className="w-full rounded-t-[22px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                    {t('readerPhotoViewer.editAltText')}
                  </div>
                  <p className="mt-1 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                    {t('readerPhotoViewer.altDescription')}
                  </p>
                </div>

                <span className="shrink-0 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                  {altText.length} /{' '}
                  {
                    MAX_PHOTO_ALT_TEXT_LENGTH
                  }
                </span>
              </div>

              <textarea
                autoFocus
                value={altText}
                maxLength={
                  MAX_PHOTO_ALT_TEXT_LENGTH
                }
                onChange={(event) =>
                  setAltText(
                    event.target.value.slice(
                      0,
                      MAX_PHOTO_ALT_TEXT_LENGTH
                    )
                  )
                }
                placeholder={t('readerPhotoViewer.altPlaceholder')}
                className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3.5 py-3 text-[14px] font-normal leading-5 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]"
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={altSaving}
                  onClick={() =>
                    setAltEditorOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50"
                >
                  {t('readerPhotoViewer.cancel')}
                </button>

                <button
                  type="button"
                  disabled={altSaving}
                  onClick={
                    saveAltText
                  }
                  className="h-11 flex-1 rounded-full bg-[var(--shadow-text-primary)] text-[14px] font-semibold text-[var(--shadow-bg-surface)] disabled:opacity-50"
                >
                  {altSaving
                    ? t('readerPhotoViewer.saving')
                    : t('readerPhotoViewer.save')}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {deleteConfirmOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!deleteBusy) {
                setDeleteConfirmOpen(
                  false
                )
              }
            }}
          >
            <div
              className="w-full rounded-t-[22px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

              <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                {t('readerPhotoViewer.deleteTitle')}
              </div>

              <p className="mt-1.5 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                {t('readerPhotoViewer.deleteDescription')}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() =>
                    setDeleteConfirmOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50"
                >
                  {t('readerPhotoViewer.cancel')}
                </button>

                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={
                    deleteSelectedPhoto
                  }
                  className="h-11 flex-1 rounded-full bg-[#e5484d] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {deleteBusy
                    ? t('readerPhotoViewer.deleting')
                    : t('readerPhotoViewer.delete')}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AuthorPageShareSheet
        open={externalShareOpen}
        pageName={t('readerPhotoViewer.readerPhoto', { name: readerName })}
        pageLink={selectedPhotoUrl}
        sheetTitle={t('readerPhotoViewer.sharePhoto')}
        shareText={t('readerPhotoViewer.photoShareText', { name: readerName })}
        zClassName="z-[150100]"
        onClose={() =>
          setExternalShareOpen(false)
        }
        onCopied={() =>
          setActionMessage(
            t('readerPhotoViewer.photoLinkCopied')
          )
        }
      />

      <EchoShareSheetV2Connected
        open={echoOpen}
        sourceType="reader_post"
        sourceId={post?.id}
        sourceName={readerName}
        sourceAvatarUrl={
          readerAvatarUrl
        }
        sourceContent={
          post?.content ||
          t('readerPhotoViewer.readerPost')
        }
        sourceImageUrl={
          selectedPhotoUrl ||
          photos[0] ||
          ''
        }
        sourceLabel={t('readerPhotoViewer.readerPostLabel')}
        shareUrl={
          readerPostShareUrl
        }
        onClose={() =>
          setEchoOpen(false)
        }
        onEchoed={(
          nextEcho,
          nextTotal
        ) => {
          const total = Math.max(
            0,
            Number(
              nextTotal ??
                (nextEcho
                  ? Number(
                      shareCount || 0
                    ) + 1
                  : shareCount)
            )
          )

          onShareCountChange?.(
            total,
            nextEcho
          )
        }}
      />
    </>
  )
}
