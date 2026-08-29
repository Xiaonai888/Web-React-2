import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import ReaderProfilePostsPanel from '../components/reader-posts/ReaderProfilePostsPanel'
import ReaderPostComposer from '../components/reader-posts/ReaderPostComposer'
import ReaderDiscoverPeoplePanel from '../components/reader-profile/ReaderDiscoverPeoplePanel'
import ReaderProfileOptionsSheet from '../components/reader-profile/ReaderProfileOptionsSheet'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import ReaderReaderMessageRequestModal from '../components/chat/ReaderReaderMessageRequestModal'
import { getDisplayText, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('profilePage', {
  en: {
    editProfilePhoto: 'Edit Profile Photo',
    editProfilePhotoHelp: 'Upload, crop, then save your reader profile photo.',
    closeEditor: 'Close editor',
    zoom: 'Zoom',
    saveCrop: 'Save Crop',
    uploadPhotoHelp: 'Tap upload to choose a photo. Your old photo will stay until you press Save.',
    profilePreview: 'Profile preview',
    previewReady: 'Preview ready',
    uploadPhoto: 'Upload Photo',
    cancel: 'Cancel',
    saving: 'Saving...',
    save: 'Save',
    editProfile: 'Edit Profile',
    editProfileHelp: 'Update your reader profile information.',
    closeProfileEditor: 'Close profile editor',
    changeProfilePhoto: 'Change Profile Photo',
    changeProfilePhotoHelp: 'Upload and crop a new photo.',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Your display name',
    displayNameHint: 'You can change display name once every 2 weeks.',
    username: 'Username',
    usernamePlaceholder: 'username',
    usernameHint: 'You can change username once every 1 week.',
    workJob: 'Work / Job',
    workPlaceholder: 'Author and accountant',
    bio: 'Bio',
    bioPlaceholder: 'Turn the impossible into reality.',
    location: 'Location',
    locationPlaceholder: 'Based in KPS',
    addLink: 'Add link',
    website: 'Website',
    otherLink: 'Other Link',
    removeLink: 'Remove link',
    linkPlaceholder: 'https://example.com',
    saveChanges: 'Save Changes',
    readerName: 'Reader Name',
    addWorkJob: 'Add your work / job',
    addBio: 'Add your bio',
    addLocation: 'Add your location',
    posts: 'Posts',
    followers: 'Followers',
    following: 'Following',
    editProfileButton: 'Edit profile',
    shareProfile: 'Share profile',
    discoverPeople: 'Discover people',
    pleaseWait: 'Please wait...',
    follow: 'Follow',
    message: 'Message',
    all: 'All',
    reels: 'Reels',
    photo: 'Photo',
    comingSoon: '{{item}} is coming soon.',
    profileStillLoading: 'Profile is still loading.',
    profileUrlCopied: 'Profile URL copied.',
    selectImage: 'Please select an image file',
    adjustPhotoFirst: 'Please adjust the photo first',
    cropFailed: 'Failed to crop photo',
    uploadCropFirst: 'Please upload and crop a profile photo first',
    updatePhotoFailed: 'Failed to update profile photo',
    displayNameRequired: 'Display name is required',
    updateProfileFailed: 'Failed to update profile',
    updateFollowFailed: 'Failed to update follow',
    uploadImageFailed: 'Failed to upload image',
    fetchProfileFailed: 'Failed to fetch profile',
    goBack: 'Go back',
    profileMenu: 'Profile menu',
    readerProfileOptions: 'Reader profile options',
    editProfilePhotoAria: 'Edit profile photo',
    addStory: 'Add story',
    restrict: 'Restrict',
    block: 'Block',
    report: 'Report',
    aboutReader: 'About this reader',
    sharedActivity: 'See shared activity',
    hideStory: 'Hide your story',
    removeFollower: 'Remove follower',
    qrCode: 'QR code',
  },
  km: {
    editProfilePhoto: 'កែរូបប្រវត្តិរូប',
    editProfilePhotoHelp: 'Upload រូប កាត់រូប ហើយរក្សាទុករូបប្រវត្តិរូបអ្នកអានរបស់អ្នក។',
    closeEditor: 'បិទកម្មវិធីកែ',
    zoom: 'ពង្រីក',
    saveCrop: 'រក្សាទុកការកាត់',
    uploadPhotoHelp: 'ចុច Upload ដើម្បីជ្រើសរើសរូប។ រូបចាស់នឹងនៅដដែលរហូតដល់អ្នកចុច Save។',
    profilePreview: 'មើលរូបប្រវត្តិរូបជាមុន',
    previewReady: 'រូបមើលជាមុនរួចរាល់',
    uploadPhoto: 'Upload រូប',
    cancel: 'បោះបង់',
    saving: 'កំពុងរក្សាទុក...',
    save: 'រក្សាទុក',
    editProfile: 'កែប្រវត្តិរូប',
    editProfileHelp: 'កែព័ត៌មានប្រវត្តិរូបអ្នកអានរបស់អ្នក។',
    closeProfileEditor: 'បិទការកែប្រវត្តិរូប',
    changeProfilePhoto: 'ប្តូររូបប្រវត្តិរូប',
    changeProfilePhotoHelp: 'Upload និងកាត់រូបថ្មី។',
    displayName: 'ឈ្មោះបង្ហាញ',
    displayNamePlaceholder: 'ឈ្មោះបង្ហាញរបស់អ្នក',
    displayNameHint: 'អ្នកអាចប្តូរឈ្មោះបង្ហាញបានម្តងរៀងរាល់ 2 សប្តាហ៍។',
    username: 'Username',
    usernamePlaceholder: 'username',
    usernameHint: 'អ្នកអាចប្តូរ username បានម្តងរៀងរាល់ 1 សប្តាហ៍។',
    workJob: 'ការងារ / មុខរបរ',
    workPlaceholder: 'អ្នកនិពន្ធ និងគណនេយ្យករ',
    bio: 'ប្រវត្តិខ្លី',
    bioPlaceholder: 'ធ្វើឱ្យអ្វីដែលមិនអាចទៅរួចក្លាយជាការពិត។',
    location: 'ទីតាំង',
    locationPlaceholder: 'រស់នៅ KPS',
    addLink: 'បន្ថែម Link',
    website: 'វេបសាយ',
    otherLink: 'Link ផ្សេង',
    removeLink: 'លុប Link',
    linkPlaceholder: 'https://example.com',
    saveChanges: 'រក្សាទុកការកែប្រែ',
    readerName: 'ឈ្មោះអ្នកអាន',
    addWorkJob: 'បន្ថែមការងារ / មុខរបរ',
    addBio: 'បន្ថែមប្រវត្តិខ្លី',
    addLocation: 'បន្ថែមទីតាំង',
    posts: 'Post',
    followers: 'អ្នក Follow',
    following: 'កំពុង Follow',
    editProfileButton: 'កែប្រវត្តិរូប',
    shareProfile: 'ចែករំលែកប្រវត្តិរូប',
    discoverPeople: 'ស្វែងរកមនុស្ស',
    pleaseWait: 'សូមរង់ចាំ...',
    follow: 'Follow',
    message: 'សារ',
    all: 'ទាំងអស់',
    reels: 'Reels',
    photo: 'រូបភាព',
    comingSoon: '{{item}} នឹងមកដល់ឆាប់ៗនេះ។',
    profileStillLoading: 'ប្រវត្តិរូបកំពុងផ្ទុកនៅឡើយ។',
    profileUrlCopied: 'បានចម្លង URL ប្រវត្តិរូប។',
    selectImage: 'សូមជ្រើសរើសឯកសាររូបភាព',
    adjustPhotoFirst: 'សូមកែតម្រូវរូបជាមុន',
    cropFailed: 'មិនអាចកាត់រូបបានទេ',
    uploadCropFirst: 'សូម Upload និងកាត់រូបប្រវត្តិរូបជាមុន',
    updatePhotoFailed: 'មិនអាច Update រូបប្រវត្តិរូបបានទេ',
    displayNameRequired: 'ត្រូវបញ្ចូលឈ្មោះបង្ហាញ',
    updateProfileFailed: 'មិនអាច Update ប្រវត្តិរូបបានទេ',
    updateFollowFailed: 'មិនអាច Update ការ Follow បានទេ',
    uploadImageFailed: 'មិនអាច Upload រូបបានទេ',
    fetchProfileFailed: 'មិនអាចទាញយកប្រវត្តិរូបបានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    profileMenu: 'Menu ប្រវត្តិរូប',
    readerProfileOptions: 'ជម្រើសប្រវត្តិរូបអ្នកអាន',
    editProfilePhotoAria: 'កែរូបប្រវត្តិរូប',
    addStory: 'បន្ថែមរឿង',
    restrict: 'ដាក់កម្រិត',
    block: 'ទប់ស្កាត់',
    report: 'រាយការណ៍',
    aboutReader: 'អំពីអ្នកអាននេះ',
    sharedActivity: 'មើលសកម្មភាពរួមគ្នា',
    hideStory: 'លាក់រឿងរបស់អ្នក',
    removeFollower: 'ដកអ្នក Follow ចេញ',
    qrCode: 'QR code',
  },
  zh: {
    editProfilePhoto: '编辑头像',
    editProfilePhotoHelp: '上传、裁剪并保存你的读者头像。',
    closeEditor: '关闭编辑器',
    zoom: '缩放',
    saveCrop: '保存裁剪',
    uploadPhotoHelp: '点击上传选择照片。按下保存前，旧照片会继续保留。',
    profilePreview: '头像预览',
    previewReady: '预览已准备好',
    uploadPhoto: '上传照片',
    cancel: '取消',
    saving: '正在保存...',
    save: '保存',
    editProfile: '编辑个人资料',
    editProfileHelp: '更新你的读者个人资料信息。',
    closeProfileEditor: '关闭个人资料编辑器',
    changeProfilePhoto: '更换头像',
    changeProfilePhotoHelp: '上传并裁剪新照片。',
    displayName: '显示名称',
    displayNamePlaceholder: '你的显示名称',
    displayNameHint: '显示名称每 2 周可更改一次。',
    username: '用户名',
    usernamePlaceholder: 'username',
    usernameHint: '用户名每 1 周可更改一次。',
    workJob: '工作 / 职业',
    workPlaceholder: '作者和会计',
    bio: '简介',
    bioPlaceholder: '把不可能变成现实。',
    location: '位置',
    locationPlaceholder: '位于 KPS',
    addLink: '添加链接',
    website: '网站',
    otherLink: '其他链接',
    removeLink: '移除链接',
    linkPlaceholder: 'https://example.com',
    saveChanges: '保存更改',
    readerName: '读者名称',
    addWorkJob: '添加工作 / 职业',
    addBio: '添加简介',
    addLocation: '添加位置',
    posts: '帖子',
    followers: '关注者',
    following: '已关注',
    editProfileButton: '编辑个人资料',
    shareProfile: '分享个人资料',
    discoverPeople: '发现用户',
    pleaseWait: '请稍候...',
    follow: '关注',
    message: '消息',
    all: '全部',
    reels: 'Reels',
    photo: '照片',
    comingSoon: '{{item}} 即将推出。',
    profileStillLoading: '个人资料仍在加载。',
    profileUrlCopied: '个人资料链接已复制。',
    selectImage: '请选择图片文件',
    adjustPhotoFirst: '请先调整照片',
    cropFailed: '裁剪照片失败',
    uploadCropFirst: '请先上传并裁剪头像',
    updatePhotoFailed: '更新头像失败',
    displayNameRequired: '显示名称为必填项',
    updateProfileFailed: '更新个人资料失败',
    updateFollowFailed: '更新关注状态失败',
    uploadImageFailed: '上传图片失败',
    fetchProfileFailed: '获取个人资料失败',
    goBack: '返回',
    profileMenu: '个人资料菜单',
    readerProfileOptions: '读者个人资料选项',
    editProfilePhotoAria: '编辑头像',
    addStory: '添加故事',
    restrict: '限制',
    block: '屏蔽',
    report: '举报',
    aboutReader: '关于此读者',
    sharedActivity: '查看共同活动',
    hideStory: '隐藏你的故事',
    removeFollower: '移除关注者',
    qrCode: '二维码',
  },
  ja: {
    editProfilePhoto: 'プロフィール写真を編集',
    editProfilePhotoHelp: '写真をアップロードして切り抜き、読者プロフィール写真を保存します。',
    closeEditor: 'エディターを閉じる',
    zoom: 'ズーム',
    saveCrop: '切り抜きを保存',
    uploadPhotoHelp: 'アップロードをタップして写真を選択します。保存するまで以前の写真は残ります。',
    profilePreview: 'プロフィールプレビュー',
    previewReady: 'プレビュー準備完了',
    uploadPhoto: '写真をアップロード',
    cancel: 'キャンセル',
    saving: '保存中...',
    save: '保存',
    editProfile: 'プロフィールを編集',
    editProfileHelp: '読者プロフィール情報を更新します。',
    closeProfileEditor: 'プロフィール編集を閉じる',
    changeProfilePhoto: 'プロフィール写真を変更',
    changeProfilePhotoHelp: '新しい写真をアップロードして切り抜きます。',
    displayName: '表示名',
    displayNamePlaceholder: '表示名',
    displayNameHint: '表示名は2週間に1回変更できます。',
    username: 'ユーザー名',
    usernamePlaceholder: 'username',
    usernameHint: 'ユーザー名は1週間に1回変更できます。',
    workJob: '仕事 / 職業',
    workPlaceholder: '作家と会計士',
    bio: '自己紹介',
    bioPlaceholder: '不可能を現実に変える。',
    location: '所在地',
    locationPlaceholder: 'KPS在住',
    addLink: 'リンクを追加',
    website: 'ウェブサイト',
    otherLink: 'その他のリンク',
    removeLink: 'リンクを削除',
    linkPlaceholder: 'https://example.com',
    saveChanges: '変更を保存',
    readerName: '読者名',
    addWorkJob: '仕事 / 職業を追加',
    addBio: '自己紹介を追加',
    addLocation: '所在地を追加',
    posts: '投稿',
    followers: 'フォロワー',
    following: 'フォロー中',
    editProfileButton: 'プロフィールを編集',
    shareProfile: 'プロフィールを共有',
    discoverPeople: 'ユーザーを見つける',
    pleaseWait: 'お待ちください...',
    follow: 'フォロー',
    message: 'メッセージ',
    all: 'すべて',
    reels: 'リール',
    photo: '写真',
    comingSoon: '{{item}} は近日公開予定です。',
    profileStillLoading: 'プロフィールを読み込み中です。',
    profileUrlCopied: 'プロフィールURLをコピーしました。',
    selectImage: '画像ファイルを選択してください',
    adjustPhotoFirst: '先に写真を調整してください',
    cropFailed: '写真の切り抜きに失敗しました',
    uploadCropFirst: '先にプロフィール写真をアップロードして切り抜いてください',
    updatePhotoFailed: 'プロフィール写真の更新に失敗しました',
    displayNameRequired: '表示名は必須です',
    updateProfileFailed: 'プロフィールの更新に失敗しました',
    updateFollowFailed: 'フォロー状態の更新に失敗しました',
    uploadImageFailed: '画像のアップロードに失敗しました',
    fetchProfileFailed: 'プロフィールの取得に失敗しました',
    goBack: '戻る',
    profileMenu: 'プロフィールメニュー',
    readerProfileOptions: '読者プロフィールオプション',
    editProfilePhotoAria: 'プロフィール写真を編集',
    addStory: 'ストーリーを追加',
    restrict: '制限する',
    block: 'ブロック',
    report: '報告',
    aboutReader: 'この読者について',
    sharedActivity: '共通のアクティビティを見る',
    hideStory: 'ストーリーを非表示にする',
    removeFollower: 'フォロワーを削除',
    qrCode: 'QRコード',
  },
  ko: {
    editProfilePhoto: '프로필 사진 편집',
    editProfilePhotoHelp: '사진을 업로드하고 자른 뒤 독자 프로필 사진을 저장하세요.',
    closeEditor: '편집기 닫기',
    zoom: '확대',
    saveCrop: '자르기 저장',
    uploadPhotoHelp: '업로드를 눌러 사진을 선택하세요. 저장하기 전까지 기존 사진이 유지됩니다.',
    profilePreview: '프로필 미리보기',
    previewReady: '미리보기 준비 완료',
    uploadPhoto: '사진 업로드',
    cancel: '취소',
    saving: '저장 중...',
    save: '저장',
    editProfile: '프로필 편집',
    editProfileHelp: '독자 프로필 정보를 업데이트하세요.',
    closeProfileEditor: '프로필 편집기 닫기',
    changeProfilePhoto: '프로필 사진 변경',
    changeProfilePhotoHelp: '새 사진을 업로드하고 잘라주세요.',
    displayName: '표시 이름',
    displayNamePlaceholder: '표시 이름',
    displayNameHint: '표시 이름은 2주에 한 번 변경할 수 있습니다.',
    username: '사용자 이름',
    usernamePlaceholder: 'username',
    usernameHint: '사용자 이름은 1주에 한 번 변경할 수 있습니다.',
    workJob: '직업 / 업무',
    workPlaceholder: '작가 및 회계사',
    bio: '소개',
    bioPlaceholder: '불가능을 현실로 바꾸세요.',
    location: '위치',
    locationPlaceholder: 'KPS 거주',
    addLink: '링크 추가',
    website: '웹사이트',
    otherLink: '기타 링크',
    removeLink: '링크 삭제',
    linkPlaceholder: 'https://example.com',
    saveChanges: '변경 사항 저장',
    readerName: '독자 이름',
    addWorkJob: '직업 / 업무 추가',
    addBio: '소개 추가',
    addLocation: '위치 추가',
    posts: '게시물',
    followers: '팔로워',
    following: '팔로잉',
    editProfileButton: '프로필 편집',
    shareProfile: '프로필 공유',
    discoverPeople: '사람 찾기',
    pleaseWait: '잠시만 기다려 주세요...',
    follow: '팔로우',
    message: '메시지',
    all: '전체',
    reels: '릴스',
    photo: '사진',
    comingSoon: '{{item}} 기능은 곧 제공됩니다.',
    profileStillLoading: '프로필을 아직 불러오는 중입니다.',
    profileUrlCopied: '프로필 URL을 복사했습니다.',
    selectImage: '이미지 파일을 선택해 주세요',
    adjustPhotoFirst: '먼저 사진을 조정해 주세요',
    cropFailed: '사진 자르기에 실패했습니다',
    uploadCropFirst: '먼저 프로필 사진을 업로드하고 잘라주세요',
    updatePhotoFailed: '프로필 사진 업데이트에 실패했습니다',
    displayNameRequired: '표시 이름은 필수입니다',
    updateProfileFailed: '프로필 업데이트에 실패했습니다',
    updateFollowFailed: '팔로우 상태 업데이트에 실패했습니다',
    uploadImageFailed: '이미지 업로드에 실패했습니다',
    fetchProfileFailed: '프로필을 불러오지 못했습니다',
    goBack: '뒤로 가기',
    profileMenu: '프로필 메뉴',
    readerProfileOptions: '독자 프로필 옵션',
    editProfilePhotoAria: '프로필 사진 편집',
    addStory: '스토리 추가',
    restrict: '제한',
    block: '차단',
    report: '신고',
    aboutReader: '이 독자 정보',
    sharedActivity: '공유 활동 보기',
    hideStory: '내 스토리 숨기기',
    removeFollower: '팔로워 삭제',
    qrCode: 'QR 코드',
  },
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

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function saveAuthToken(token) {
  if (!token) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', token)
    return
  }

  sessionStorage.setItem('shadow_reader_token', token)
}


function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    array[index] = binary.charCodeAt(index)
  }

  return new File([array], fileName, { type: mime })
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  if (!imageDataUrl || String(imageDataUrl).startsWith('http')) {
    return imageDataUrl || null
  }

  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('profilePage.uploadImageFailed'))
  }

  return data.image_url || data.imageUrl
}

async function fetchPublicUserProfile(username) {
  const token = getAuthToken()

  if (!token || !username) return null

  const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username)}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('profilePage.fetchProfileFailed'))
  }

  return data.user || null
}


function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL('image/jpeg', 0.92)
}

function DropdownMenu({ items, align = 'right' }) {
  return (
    <div
      className={`absolute top-9 z-40 w-44 overflow-hidden rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_18px_40px_rgba(17,24,39,0.14)] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`flex w-full items-center px-4 py-3 text-left text-[13px] font-bold transition hover:bg-[var(--shadow-bg-hover)] ${
            item === 'Delete' || item === 'Report' || item === 'Block'
              ? 'text-[#e5484d]'
              : 'text-[var(--shadow-text-primary)]'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[15px] font-extrabold leading-none text-[var(--shadow-text-primary)]">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-primary)]">{label}</div>
    </div>
  )
}



const PROFILE_LINK_OPTIONS = [
  { type: 'website', label: 'Website', icon: 'fas fa-globe' },
  { type: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { type: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
  { type: 'telegram', label: 'Telegram', icon: 'fab fa-telegram-plane' },
  { type: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
  { type: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
  { type: 'x', label: 'X', icon: 'fab fa-twitter' },
  { type: 'link', label: 'Other Link', icon: 'fas fa-link' },
]

function getProfileLinkIcon(type) {
  return PROFILE_LINK_OPTIONS.find((item) => item.type === type)?.icon || 'fas fa-link'
}

function normalizeProfileLinkUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function getProfileOptionLabel(action, t) {
  const keys = {
    restrict: 'restrict',
    block: 'block',
    report: 'report',
    about: 'aboutReader',
    activity: 'sharedActivity',
    'hide-story': 'hideStory',
    'remove-follower': 'removeFollower',
    'qr-code': 'qrCode',
  }
  const key = keys[action]
  return key ? t(`profilePage.${key}`) : String(action || '').replaceAll('-', ' ')
}

function AvatarImage({ profile, sizeClass = 'h-[92px] w-[92px] md:h-[96px] md:w-[96px]' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[34px] font-extrabold text-white ${sizeClass}`}>
      {profile.avatarUrl ? (
        <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
      ) : (
        profile.avatarLetter
      )}
    </div>
  )
}

function AvatarCropModal({
  open,
  profile,
  image,
  preview,
  crop,
  zoom,
  croppedAreaPixels,
  loading,
  message,
  onFileChange,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onSaveCrop,
  onSaveProfile,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] overflow-y-auto bg-black/50 px-4 pb-[150px] pt-4">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] items-start justify-center">
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.editProfilePhoto')}</h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('profilePage.editProfilePhotoHelp')}</p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={t('profilePage.closeEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
              {message}
            </div>
          ) : null}

          {image ? (
            <>
              <div className="relative mx-auto h-[min(78vw,360px)] max-h-[360px] min-h-[260px] w-full overflow-hidden rounded-[22px] bg-[#111827]">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  restrictPosition={false}
                  objectFit="contain"
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                  <span>{t('profilePage.zoom')}</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(event) => onZoomChange(Number(event.target.value))}
                  className="w-full accent-[var(--shadow-accent)]"
                />
              </div>

              <button
                type="button"
                onClick={() => onSaveCrop(croppedAreaPixels)}
                className="mt-4 h-12 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
              >
                {t('profilePage.saveCrop')}
              </button>
            </>
          ) : (
            <div className="rounded-[22px] bg-[var(--shadow-bg-elevated)] p-5 text-center ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto mb-4 flex justify-center">
                <AvatarImage profile={{ ...profile, avatarUrl: preview || profile.avatarUrl }} sizeClass="h-[116px] w-[116px] text-[40px]" />
              </div>

              <p className="mx-auto max-w-[280px] text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
                {t('profilePage.uploadPhotoHelp')}
              </p>
            </div>
          )}

          {preview && !image ? (
            <div className="mt-4 rounded-[22px] bg-[var(--shadow-bg-elevated)] p-4 text-center ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto h-[116px] w-[116px] overflow-hidden rounded-full bg-[#111827] ring-2 ring-[#f6b800]">
                <img src={preview} alt={t('profilePage.profilePreview')} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-secondary)]">{t('profilePage.previewReady')}</div>
            </div>
          ) : null}

          <label className="mt-4 flex h-12 cursor-pointer items-center justify-center rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]">
            <i className="fa-regular fa-image mr-2 text-[14px]" />
            {t('profilePage.uploadPhoto')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                onFileChange(event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="h-12 rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-60"
            >
              {t('profilePage.cancel')}
            </button>

            <button
              type="button"
              onClick={onSaveProfile}
              disabled={loading || !preview}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99] disabled:bg-[var(--shadow-text-disabled)]"
            >
              {loading ? t('profilePage.saving') : t('profilePage.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditProfileModal({
  open,
  profile,
  form,
  loading,
  message,
  onChange,
  onClose,
  onOpenAvatar,
  onSave,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] overflow-y-auto bg-black/50 px-4 pb-[150px] pt-4">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] items-start justify-center">
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.editProfile')}</h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('profilePage.editProfileHelp')}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={t('profilePage.closeProfileEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
              {message}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onOpenAvatar}
            className="mb-5 flex w-full items-center gap-4 rounded-[22px] bg-[var(--shadow-bg-elevated)] p-4 text-left ring-1 ring-[var(--shadow-border)] active:scale-[0.99]"
          >
            <AvatarImage profile={profile} sizeClass="h-[70px] w-[70px] text-[28px]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.changeProfilePhoto')}</div>
              <div className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('profilePage.changeProfilePhotoHelp')}</div>
            </div>
            <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
          </button>

          <div className="space-y-4">
            <div>
  <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.displayName')}</label>
  <input
    value={form.name}
    onChange={(event) => onChange('name', event.target.value)}
    className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
    placeholder={t('profilePage.displayNamePlaceholder')}
  />
  <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{t('profilePage.displayNameHint')}</div>
</div>

<div>
  <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.username')}</label>
  <input
    value={form.username}
    onChange={(event) => onChange('username', event.target.value)}
    className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
    placeholder={t('profilePage.usernamePlaceholder')}
  />
  <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{t('profilePage.usernameHint')}</div>
</div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.workJob')}</label>
              <input
                value={form.work}
                onChange={(event) => onChange('work', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('profilePage.workPlaceholder')}
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.bio')}</label>
              <textarea
                value={form.bio}
                onChange={(event) => onChange('bio', event.target.value)}
                className="min-h-[96px] w-full resize-none rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 py-3 text-[14px] leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('profilePage.bioPlaceholder')}
                maxLength={180}
              />
              <div className="mt-1 text-right text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{form.bio.length}/180</div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.location')}</label>
              <input
                value={form.location}
                onChange={(event) => onChange('location', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('profilePage.locationPlaceholder')}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('profilePage.addLink')}</label>
                <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{(form.social_links || []).length}/5</div>
              </div>
            
              <div className="space-y-2">
                {(form.social_links || []).map((link, index) => (
                  <div key={index} className="rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] p-3">
                    <div className="mb-2 flex gap-2">
                      <select
                        value={link.type || 'link'}
                        onChange={(event) =>
                          onChange(
                            'social_links',
                            (form.social_links || []).map((item, itemIndex) =>
                              itemIndex === index ? { ...item, type: event.target.value } : item
                            )
                          )
                        }
                        className="h-10 w-[130px] rounded-[12px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-3 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none"
                      >
                        {PROFILE_LINK_OPTIONS.map((option) => (
                          <option key={option.type} value={option.type}>
                            {option.type === 'website' ? t('profilePage.website') : option.type === 'link' ? t('profilePage.otherLink') : option.label}
                          </option>
                        ))}
                      </select>
            
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            'social_links',
                            (form.social_links || []).filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="ml-auto h-10 w-10 rounded-full bg-[var(--shadow-bg-surface)] text-[#e5484d] ring-1 ring-[var(--shadow-border-strong)]"
                        aria-label={t('profilePage.removeLink')}
                      >
                        <i className="fa-solid fa-trash text-[12px]" />
                      </button>
                    </div>
            
                    <input
                      value={link.url}
                      onChange={(event) =>
                        onChange(
                          'social_links',
                          (form.social_links || []).map((item, itemIndex) =>
                            itemIndex === index ? { ...item, url: event.target.value } : item
                          )
                        )
                      }
                      className="h-11 w-full rounded-[14px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-4 text-[13px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)]"
                      placeholder={t('profilePage.linkPlaceholder')}
                    />
                  </div>
                ))}
              </div>
            
              {(form.social_links || []).length < 5 ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange('social_links', [...(form.social_links || []), { type: 'website', url: '' }])
                  }
                  className="mt-3 h-11 w-full rounded-[14px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)]"
                >
                  <i className="fa-solid fa-plus mr-2 text-[12px]" />
                  {t('profilePage.addLink')}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-60"
            >
              {t('profilePage.cancel')}
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99] disabled:bg-[var(--shadow-text-disabled)]"
            >
              {loading ? t('profilePage.saving') : t('profilePage.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



export default function ProfilePage() {
  const navigate = useNavigate()
  const { t, language } = useDisplayTranslation()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const storedUser = useMemo(() => getStoredUser(), [])
  const requestedUsername = String(searchParams.get('username') || '').replace(/^@+/, '')
  const isOwnProfile =
    !requestedUsername ||
    requestedUsername.toLowerCase() === String(storedUser?.username || '').toLowerCase()
  const navigationPreview = useMemo(() => {
    const preview = location.state?.profilePreview

    if (!preview || isOwnProfile) {
      return null
    }

    const previewUsername = String(preview?.username || '')
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()
    const targetUsername = String(requestedUsername || '')
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    return previewUsername && previewUsername === targetUsername
      ? preview
      : null
  }, [isOwnProfile, location.state, requestedUsername])
  const [profileOptionsOpen, setProfileOptionsOpen] = useState(false)
  const [messageRequestOpen, setMessageRequestOpen] = useState(false)
  const [readerPostCount, setReaderPostCount] = useState(0)
  const [profileTabMessage, setProfileTabMessage] = useState('')
  const [discoverPeopleOpen, setDiscoverPeopleOpen] = useState(false)
  const [user, setUser] = useState(() =>
    isOwnProfile ? storedUser : navigationPreview
  )
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [rawAvatarImage, setRawAvatarImage] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [followLoading, setFollowLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
    social_links: Array.isArray(user?.social_links)
      ? user.social_links
          .map((item) => ({
            type: item?.type || 'link',
            url: item?.url || '',
          }))
          .slice(0, 5)
      : [],
  })

    const viewedUser = useMemo(() => {
    const targetUsername = String(
      isOwnProfile ? storedUser?.username || '' : requestedUsername
    )
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    const loadedUsername = String(user?.username || '')
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    if (!targetUsername) return null
    if (loadedUsername === targetUsername) return user

    return isOwnProfile ? storedUser : null
  }, [isOwnProfile, requestedUsername, storedUser, user])


  const profilePostsUsername = isOwnProfile
    ? String(user?.username || storedUser?.username || '').replace(/^@+/, '')
    : requestedUsername

  function showProfileTabComingSoon(label) {
    setProfileTabMessage(t('profilePage.comingSoon', { item: label }))
    window.setTimeout(() => setProfileTabMessage(''), 2200)
  }

  function handleSuggestionFollowed() {
    setUser((current) => {
      if (!current) return current

      const nextUser = {
        ...current,
        following_count: Number(current.following_count || 0) + 1,
      }

      saveStoredUser(nextUser)
      return nextUser
    })
  }

  useEffect(() => {
    let ignore = false
    const targetUsername = String(
      requestedUsername || storedUser?.username || ''
    ).replace(/^@+/, '')

    setReaderPostCount(0)
    setProfileOptionsOpen(false)
    setMessageRequestOpen(false)
    setDiscoverPeopleOpen(false)
    setProfileTabMessage('')
    setAvatarModalOpen(false)
    setEditProfileOpen(false)
    setRawAvatarImage('')
    setAvatarPreview('')

    if (isOwnProfile) {
      setUser(storedUser || null)
    } else {
      setUser(navigationPreview)
    }

    async function loadProfileStats() {
      if (!targetUsername) return

      try {
        const freshUser = await fetchPublicUserProfile(targetUsername)

        if (ignore || !freshUser) return

        const returnedUsername = String(freshUser.username || '')
          .trim()
          .replace(/^@+/, '')
          .toLowerCase()

        if (returnedUsername !== targetUsername.toLowerCase()) {
          throw new Error('Profile mismatch')
        }

        if (isOwnProfile) {
          saveStoredUser(freshUser)
        }

        setUser(freshUser)
      } catch (error) {
        if (ignore) return

        console.error('Fetch reader profile stats error:', error)

        if (!isOwnProfile && !navigationPreview) {
          setUser(null)
        }
      }
    }

    loadProfileStats()

    return () => {
      ignore = true
    }
  }, [
    isOwnProfile,
    navigationPreview,
    requestedUsername,
    storedUser?.username,
  ])

  const profile = useMemo(() => {
    const fallbackUsername = isOwnProfile
      ? String(storedUser?.username || '').replace(/^@+/, '')
      : requestedUsername

    return {
      name: viewedUser?.name || t('profilePage.readerName'),
      username: viewedUser?.username || fallbackUsername || 'username',
      avatarLetter: (viewedUser?.name || 'R').charAt(0).toUpperCase(),
      avatarUrl:
        (isOwnProfile ? avatarPreview : '') ||
        viewedUser?.avatar_url ||
        '',
      posts: viewedUser ? String(readerPostCount) : '0',
      followers: String(viewedUser?.followers_count || 0),
      following: String(viewedUser?.following_count || 0),
      bioTitle: viewedUser?.work || t('profilePage.addWorkJob'),
      bio: viewedUser?.bio || t('profilePage.addBio'),
      location: viewedUser?.location || t('profilePage.addLocation'),
      isPremium: Boolean(viewedUser?.is_premium),
      socialLinks: Array.isArray(viewedUser?.social_links)
        ? viewedUser.social_links.filter((item) => item?.url).slice(0, 5)
        : [],
    }
  }, [
    avatarPreview,
    isOwnProfile,
    language,
    readerPostCount,
    requestedUsername,
    storedUser?.username,
    viewedUser,
  ])


async function handleProfileFollow() {
  if (isOwnProfile || !profile.username || followLoading) return

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const wasFollowing = Boolean(user?.is_following)

  try {
    setFollowLoading(true)
    setProfileTabMessage('')

    const response = await fetch(
      `${API_BASE_URL}/api/users/${encodeURIComponent(profile.username)}/follow`,
      {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || t('profilePage.updateFollowFailed'))
    }

    setUser((current) => {
      if (!current) return current

      return {
        ...current,
        is_following: Boolean(data.is_following),
        followers_count: Number(data.followers_count || 0),
      }
    })

    const currentUser = getStoredUser()

    if (currentUser) {
      const changed = Boolean(data.is_following) !== wasFollowing
      const difference = changed ? (data.is_following ? 1 : -1) : 0

      saveStoredUser({
        ...currentUser,
        following_count: Math.max(
          0,
          Number(currentUser.following_count || 0) + difference
        ),
      })
    }
  } catch (error) {
    setProfileTabMessage(error.message || t('profilePage.updateFollowFailed'))
    window.setTimeout(() => setProfileTabMessage(''), 2200)
  } finally {
    setFollowLoading(false)
  }
}


  function handleOpenReaderMessage() {
  if (isOwnProfile) return

  const targetReady =
    user?.id &&
    String(user?.username || '').toLowerCase() ===
      requestedUsername.toLowerCase()

  if (!targetReady) {
    setProfileTabMessage(t('profilePage.profileStillLoading'))
    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  setMessageRequestOpen(true)
}
  
async function handleOtherProfileOption(action) {
  if (isOwnProfile) return

  const profileUrl = `${window.location.origin}/profile?username=${encodeURIComponent(profile.username)}`

  setProfileOptionsOpen(false)

  if (action === 'copy-link') {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setProfileTabMessage(t('profilePage.profileUrlCopied'))
    } catch {
      setProfileTabMessage(profileUrl)
    }

    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  if (action === 'share-profile') {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          url: profileUrl,
        })
        return
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl)
      setProfileTabMessage(t('profilePage.profileUrlCopied'))
    } catch {
      setProfileTabMessage(profileUrl)
    }

    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  setProfileTabMessage(
    t('profilePage.comingSoon', { item: getProfileOptionLabel(action, t) })
  )

  window.setTimeout(
    () => setProfileTabMessage(''),
    2200
  )
}
  

  const handleCropComplete = useCallback((_, croppedPixels) => {
    if (!isOwnProfile) return
    setCroppedAreaPixels(croppedPixels)
  }, [isOwnProfile])

  const openAvatarEditor = () => {
    if (!isOwnProfile) return

    setAvatarMessage('')
    setAvatarPreview('')
    setRawAvatarImage('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setAvatarModalOpen(true)
  }

  const openEditProfile = () => {
    if (!isOwnProfile) return

    setProfileMessage('')
    setEditForm({
  name: user?.name || '',
  username: user?.username || '',
  bio: user?.bio || '',
  work: user?.work || '',
  location: user?.location || '',
  social_links: Array.isArray(user?.social_links) ? user.social_links.map((item) => ({ type: item?.type || 'link', url: item?.url || '' })).slice(0, 5) : [],
})
    setEditProfileOpen(true)
  }

  const handleAvatarFileChange = (file) => {
    if (!isOwnProfile || !file) return

    if (!file.type.startsWith('image/')) {
      setAvatarMessage(t('profilePage.selectImage'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setRawAvatarImage(String(reader.result || ''))
      setAvatarPreview('')
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setAvatarMessage('')
    }

    reader.readAsDataURL(file)
  }

  const handleSaveAvatarCrop = async (pixels) => {
    if (!isOwnProfile) return

    if (!rawAvatarImage || !pixels) {
      setAvatarMessage(t('profilePage.adjustPhotoFirst'))
      return
    }

    try {
      const cropped = await getCroppedImage(rawAvatarImage, pixels)
      setAvatarPreview(cropped)
      setRawAvatarImage('')
      setAvatarMessage('')
    } catch {
      setAvatarMessage(t('profilePage.cropFailed'))
    }
  }

  const handleSaveProfileAvatar = async () => {
    if (!isOwnProfile) return

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!avatarPreview) {
      setAvatarMessage(t('profilePage.uploadCropFirst'))
      return
    }

    try {
      setSavingAvatar(true)
      setAvatarMessage('')

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: avatarPreview,
        folder: 'reader-profiles',
        fileName: `reader-profile-${Date.now()}.jpg`,
      })

      const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: imageUrl,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('profilePage.updatePhotoFailed'))
      }

      saveStoredUser(data.user)
      setUser(data.user)
      setAvatarPreview('')
      setRawAvatarImage('')
      setAvatarModalOpen(false)
    } catch (error) {
      setAvatarMessage(error.message || t('profilePage.updatePhotoFailed'))
    } finally {
      setSavingAvatar(false)
    }
  }

  const handleSaveProfileInfo = async () => {
    if (!isOwnProfile) return

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!editForm.name.trim()) {
      setProfileMessage(t('profilePage.displayNameRequired'))
      return
    }

    try {
      setSavingProfile(true)
      setProfileMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  name: editForm.name,
  username: editForm.username,
  bio: editForm.bio,
  work: editForm.work,
  location: editForm.location,
  social_links: (editForm.social_links || [])
  .map((item) => ({ type: item.type || 'link', url: normalizeProfileLinkUrl(item.url) }))
  .filter((item) => item.url)
  .slice(0, 5),      
}),
})

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('profilePage.updateProfileFailed'))
      }

      saveStoredUser(data.user)
      if (data.token) saveAuthToken(data.token)
      setUser(data.user)
      setEditProfileOpen(false)
    } catch (error) {
      setProfileMessage(error.message || t('profilePage.updateProfileFailed'))
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelAvatarEdit = () => {
    setAvatarModalOpen(false)
    setRawAvatarImage('')
    setAvatarPreview('')
    setAvatarMessage('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  function handleProfileBack() {
    const returnTo =
      typeof location.state?.returnTo === 'string' &&
      location.state.returnTo.startsWith('/')
        ? location.state.returnTo
        : ''

    if (returnTo) {
      if (
        location.key !== 'default' &&
        window.history.length > 1
      ) {
        navigate(-1)
        return
      }

      navigate(returnTo, { replace: true })
      return
    }

    if (isOwnProfile) {
      navigate('/me', { replace: true })
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/discover', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <AvatarCropModal
        open={isOwnProfile && avatarModalOpen}
        profile={profile}
        image={rawAvatarImage}
        preview={avatarPreview}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        loading={savingAvatar}
        message={avatarMessage}
        onFileChange={handleAvatarFileChange}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onCancel={handleCancelAvatarEdit}
        onSaveCrop={handleSaveAvatarCrop}
        onSaveProfile={handleSaveProfileAvatar}
      />

      <EditProfileModal
        open={isOwnProfile && editProfileOpen}
        profile={profile}
        form={editForm}
        loading={savingProfile}
        message={profileMessage}
        onChange={(field, value) => setEditForm((current) => ({ ...current, [field]: value }))}
        onClose={() => setEditProfileOpen(false)}
        onOpenAvatar={() => {
          setEditProfileOpen(false)
          openAvatarEditor()
        }}
        onSave={handleSaveProfileInfo}
      />

      <ReaderReaderMessageRequestModal
        open={!isOwnProfile && messageRequestOpen}
        reader={user}
        onClose={() => setMessageRequestOpen(false)}
      />

      <main className="mx-auto min-h-screen w-full bg-[var(--shadow-bg-surface)] md:max-w-[560px] md:py-4">
        <div className="overflow-hidden bg-[var(--shadow-bg-surface)] md:rounded-[24px] md:border md:border-[var(--shadow-border)] md:shadow-sm">
          <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
               <button
  type="button"
  onClick={handleProfileBack}
  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
  aria-label={t('profilePage.goBack')}
>
  <i className="fas fa-chevron-left text-[16px]" />
</button>

                <div className="min-w-0 text-[15px] font-extrabold text-[var(--shadow-text-primary)]">
                  @{profile.username}
                </div>
              </div>

              <div className="relative">
                {isOwnProfile ? (
                  <button
  type="button"
  onClick={() => navigate('/profile/settings')}
  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
  aria-label={t('profilePage.profileMenu')}
>
                    <i className="fa-solid fa-bars text-[17px]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setProfileOptionsOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
                    aria-label={t('profilePage.readerProfileOptions')}
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-[16px]" />
                  </button>
                )}
              </div>
            </div>
          </header>

          <section className="px-4 pb-4 pt-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
  {isOwnProfile ? (
    <button
      type="button"
      onClick={openAvatarEditor}
      className="rounded-full active:scale-[0.98]"
      aria-label={t('profilePage.editProfilePhotoAria')}
    >
      <AvatarImage profile={profile} />
    </button>
  ) : (
    <AvatarImage profile={profile} />
  )}

  {isOwnProfile ? (
    <button
      type="button"
      onClick={() => navigate('/reader/story/create')}
      className="absolute -bottom-1 -right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)] shadow-sm active:scale-90"
      aria-label={t('profilePage.addStory')}
    >
      <i className="fa-solid fa-plus text-[12px]" />
    </button>
  ) : null}
</div>

              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
                    {profile.name}
                  </h1>
                  {profile.isPremium ? <i className="fas fa-crown text-[14px] text-[#f6b800]" /> : null}
                </div>

                <div className="grid grid-cols-3 gap-1">
  <StatItem value={profile.posts} label={t('profilePage.posts')} />
  <button
    type="button"
    onClick={() => navigate(`/profile/${profile.username}/followers`)}
    className="rounded-[12px] active:scale-[0.98]"
  >
    <StatItem value={profile.followers} label={t('profilePage.followers')} />
  </button>
  <button
    type="button"
    onClick={() => navigate(`/profile/${profile.username}/following`)}
    className="rounded-[12px] active:scale-[0.98]"
  >
    <StatItem value={profile.following} label={t('profilePage.following')} />
  </button>
</div>
              </div>
            </div>

            <div className="mt-4 text-[12px] leading-5 text-[var(--shadow-text-primary)]">
              <div className="font-bold">{profile.bioTitle}</div>
              <div>{profile.bio}</div>
              <div>{profile.location}</div>
            </div>

            {profile.socialLinks.length ? (
  <div className="mt-3 flex items-center gap-2 text-[var(--shadow-text-primary)]">
    {profile.socialLinks.map((link, index) => (
      <a
        key={`${link.type}-${index}`}
        href={normalizeProfileLinkUrl(link.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[11px] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
      >
        <i className={getProfileLinkIcon(link.type)} />
      </a>
    ))}
  </div>
) : null}

            {isOwnProfile ? (
  <div className="mt-4 flex items-center gap-2">
    <button
      type="button"
      onClick={() => navigate('/profile/edit')}
      className="h-10 flex-1 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
    >
      {t('profilePage.editProfileButton')}
    </button>

   <button
  type="button"
  onClick={() => navigate('/profile/share')}
  className="h-10 flex-1 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
>
  {t('profilePage.shareProfile')}
</button>

    <button
  type="button"
  onClick={() => setDiscoverPeopleOpen((current) => !current)}
  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
  aria-label={t('profilePage.discoverPeople')}
  aria-expanded={discoverPeopleOpen}
>
  <i className="fa-solid fa-user-plus text-[14px]" />
</button>
  </div>
) : (
  <div className="mt-4 grid grid-cols-2 gap-2">
    <button
      type="button"
      onClick={handleProfileFollow}
      disabled={followLoading}
      aria-pressed={Boolean(user?.is_following)}
      className="h-10 rounded-[14px] bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] transition active:scale-[0.98] disabled:opacity-60"
    >
      {followLoading ? t('profilePage.pleaseWait') : user?.is_following ? t('profilePage.following') : t('profilePage.follow')}
    </button>
    <button
      type="button"
      onClick={handleOpenReaderMessage}
      className="h-10 rounded-[14px] border border-[var(--shadow-border-strong)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
    >
      {t('profilePage.message')}
    </button>
  </div>
)}


           {isOwnProfile ? (
  <ReaderDiscoverPeoplePanel
    open={discoverPeopleOpen}
    profileUsername={profile.username}
    onFollowed={handleSuggestionFollowed}
  />
) : null}
</section>
          

          <section className="sticky top-[58px] z-20 border-y border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
  <div className="flex items-center gap-1.5 px-4 py-2.5 text-[12px]">
    <button className="rounded-full bg-[var(--shadow-bg-hover)] px-4 py-2 font-semibold text-[var(--shadow-text-primary)]">
      {t('profilePage.all')}
    </button>

    <button
      type="button"
      onClick={() => showProfileTabComingSoon(t('profilePage.reels'))}
      className="rounded-full px-4 py-2 font-normal text-[var(--shadow-text-secondary)]"
    >
      {t('profilePage.reels')}
    </button>

    <button
      type="button"
      onClick={() => showProfileTabComingSoon(t('profilePage.photo'))}
      className="rounded-full px-4 py-2 font-normal text-[var(--shadow-text-secondary)]"
    >
      {t('profilePage.photo')}
    </button>
  </div>

  {profileTabMessage ? (
    <div className="absolute left-4 top-[54px] z-30 rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 py-2 text-[11px] font-normal text-[var(--shadow-text-primary)] shadow-lg">
      {profileTabMessage}
    </div>
  ) : null}
</section>
        </div>

        {isOwnProfile ? (
          <div className="mt-2 md:mt-3">
            <ReaderPostComposer />
          </div>
        ) : null}

        <ReaderProfilePostsPanel
  key={profilePostsUsername || 'reader-profile'}
  username={profilePostsUsername}
  isOwnProfile={isOwnProfile}
  profileUser={user}
  onEditAvatar={isOwnProfile ? openAvatarEditor : undefined}
  onCountChange={setReaderPostCount}
/>

<ReaderProfileOptionsSheet
  open={
    !isOwnProfile &&
    profileOptionsOpen
  }
  onClose={() =>
    setProfileOptionsOpen(false)
  }
  onSelect={
    handleOtherProfileOption
  }
/>
</main>
      {isOwnProfile ? (
  <ReaderProfileFooter
    avatarUrl={profile.avatarUrl}
    profileName={profile.name}
  />
) : null}

    </div>
  )
}
