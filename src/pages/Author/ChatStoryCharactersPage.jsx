import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryCharacters', {
  "en": {
    "mainCharacters": "Main Characters",
    "main": "Main",
    "mainDescription": "The central characters who drive the story.",
    "majorSupportingCharacters": "Major Supporting Characters",
    "majorSupport": "Major Support",
    "majorDescription": "Important characters who stay close to the main cast and appear often.",
    "minorSupportingCharacters": "Minor Supporting Characters",
    "minorSupport": "Minor Support",
    "minorDescription": "Characters who help the story move forward but appear less often.",
    "backgroundCharacters": "Background Characters",
    "background": "Background",
    "backgroundDescription": "Occasional or unnamed roles such as guards, staff, doctors or classmates.",
    "failedUploadCharacterImage": "Failed to upload character image",
    "dragDownToClose": "Drag down to close",
    "gotIt": "Got it",
    "chooseLeadCharacter": "Choose Lead Character",
    "leadHelp": "The Lead Character uses the main chat style and appears on the right side.",
    "leadCharacter": "Lead Character",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "mainChatRight": "Main chat style · Right side",
    "change": "Change",
    "addPhoto": "Add Photo",
    "uploadFromDevice": "Upload from device",
    "shadowGallery": "Shadow gallery",
    "chooseProfileImage": "Choose a profile image for this character.",
    "loadingGallery": "Loading gallery...",
    "galleryCouldNotLoad": "Gallery could not load",
    "tryAgain": "Try again",
    "noImagesGallery": "No images in this gallery yet",
    "noImagesGalleryHelp": "Add active image URLs to the Chat Story avatar gallery in Supabase.",
    "all": "All",
    "characterAvatar": "Character avatar",
    "character": "Character",
    "replaceProfileImage": "Replace profile image",
    "enterNickname": "Enter character nickname",
    "editProfile": "Edit Profile",
    "addCharacter": "Add character",
    "saving": "Saving...",
    "save": "Save",
    "unnamedCharacter": "Unnamed character",
    "unnamedRole": "Unnamed role",
    "leadUsed": "Lead · Used",
    "usedInEpisode": "Used in episode",
    "notUsed": "Not used",
    "usedCount": "{{used}}/{{total}} used",
    "aboutGroup": "About {{group}}",
    "failedLoadCharacters": "Failed to load characters",
    "leadMustBeUsed": "Lead Character must be used in this episode.",
    "addMainFirst": "Add a Main Character first.",
    "leadChanged": "Lead Character changed. Press Save to apply.",
    "chooseImageFile": "Please choose an image file.",
    "profileImageTooLarge": "Profile image must be 2 MB or smaller.",
    "failedLoadShadowGallery": "Failed to load Shadow gallery",
    "cannotConnectBackend": "Cannot connect to backend.",
    "failedLoadGallery": "Failed to load gallery",
    "deleteCharacterQuestion": "Delete this character?",
    "characterDeleted": "Character deleted. Press Save to update the database.",
    "enterNicknameRequired": "Please enter a nickname.",
    "failedSaveCharacter": "Failed to save character",
    "characterUpdated": "Character updated.",
    "characterAdded": "Character added.",
    "couldNotSave": "Couldn’t save changes.",
    "chooseAtLeast2": "Choose at least 2 characters for this episode.",
    "chooseAtLeast1Main": "Choose at least 1 Main Character for this episode.",
    "failedSaveCharacters": "Failed to save characters",
    "saved": "Saved",
    "goBack": "Go back",
    "buildYourCast": "Build Your Cast",
    "loadingCharacters": "Loading characters...",
    "storyInfo": "Story Info",
    "characters": "Characters",
    "chat": "Chat",
    "publish": "Publish"
  },
  "km": {
    "mainCharacters": "តួអង្គសំខាន់",
    "main": "សំខាន់",
    "mainDescription": "តួអង្គកណ្ដាលដែលដឹកនាំសាច់រឿង។",
    "majorSupportingCharacters": "តួអង្គរងសំខាន់",
    "majorSupport": "តួរងសំខាន់",
    "majorDescription": "តួអង្គសំខាន់ដែលនៅជិតតួឯក និងបង្ហាញខ្លួនញឹកញាប់។",
    "minorSupportingCharacters": "តួអង្គរង",
    "minorSupport": "តួរង",
    "minorDescription": "តួអង្គដែលជួយឱ្យសាច់រឿងបន្តទៅមុខ ប៉ុន្តែបង្ហាញខ្លួនតិចជាង។",
    "backgroundCharacters": "តួអង្គផ្ទៃខាងក្រោយ",
    "background": "ផ្ទៃខាងក្រោយ",
    "backgroundDescription": "តួនាទីម្តងម្កាល ឬគ្មានឈ្មោះ ដូចជា អ្នកយាម បុគ្គលិក ពេទ្យ ឬមិត្តរួមថ្នាក់។",
    "failedUploadCharacterImage": "មិនអាច Upload រូបតួអង្គបានទេ",
    "dragDownToClose": "អូសចុះក្រោមដើម្បីបិទ",
    "gotIt": "យល់ហើយ",
    "chooseLeadCharacter": "ជ្រើសតួឯក",
    "leadHelp": "តួឯកប្រើរចនាប័ទ្ម Chat សំខាន់ ហើយបង្ហាញនៅខាងស្តាំ។",
    "leadCharacter": "តួឯក",
    "cancel": "បោះបង់",
    "confirm": "បញ្ជាក់",
    "mainChatRight": "Chat សំខាន់ · ខាងស្តាំ",
    "change": "ប្តូរ",
    "addPhoto": "បន្ថែមរូប",
    "uploadFromDevice": "Upload ពីឧបករណ៍",
    "shadowGallery": "Shadow Gallery",
    "chooseProfileImage": "ជ្រើសរូប Profile សម្រាប់តួអង្គនេះ។",
    "loadingGallery": "កំពុងផ្ទុក Gallery...",
    "galleryCouldNotLoad": "មិនអាចផ្ទុក Gallery បានទេ",
    "tryAgain": "ព្យាយាមម្តងទៀត",
    "noImagesGallery": "មិនទាន់មានរូបក្នុង Gallery នេះទេ",
    "noImagesGalleryHelp": "បន្ថែម Image URL ដែល active ទៅ Chat Story avatar gallery ក្នុង Supabase។",
    "all": "ទាំងអស់",
    "characterAvatar": "រូបតួអង្គ",
    "character": "តួអង្គ",
    "replaceProfileImage": "ប្តូររូប Profile",
    "enterNickname": "បញ្ចូលឈ្មោះហៅក្រៅតួអង្គ",
    "editProfile": "កែ Profile",
    "addCharacter": "បន្ថែមតួអង្គ",
    "saving": "កំពុងរក្សាទុក...",
    "save": "រក្សាទុក",
    "unnamedCharacter": "តួអង្គគ្មានឈ្មោះ",
    "unnamedRole": "តួនាទីគ្មានឈ្មោះ",
    "leadUsed": "តួឯក · បានប្រើ",
    "usedInEpisode": "បានប្រើក្នុងភាគ",
    "notUsed": "មិនបានប្រើ",
    "usedCount": "បានប្រើ {{used}}/{{total}}",
    "aboutGroup": "អំពី {{group}}",
    "failedLoadCharacters": "មិនអាចផ្ទុកតួអង្គបានទេ",
    "leadMustBeUsed": "តួឯកត្រូវតែត្រូវបានប្រើក្នុងភាគនេះ។",
    "addMainFirst": "សូមបន្ថែមតួអង្គសំខាន់ជាមុន។",
    "leadChanged": "បានប្តូរតួឯក។ ចុច រក្សាទុក ដើម្បីអនុវត្ត។",
    "chooseImageFile": "សូមជ្រើសឯកសាររូបភាព។",
    "profileImageTooLarge": "រូប Profile ត្រូវមានទំហំ 2 MB ឬតូចជាងនេះ។",
    "failedLoadShadowGallery": "មិនអាចផ្ទុក Shadow Gallery បានទេ",
    "cannotConnectBackend": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។",
    "failedLoadGallery": "មិនអាចផ្ទុក Gallery បានទេ",
    "deleteCharacterQuestion": "លុបតួអង្គនេះ?",
    "characterDeleted": "បានលុបតួអង្គ។ ចុច រក្សាទុក ដើម្បីធ្វើបច្ចុប្បន្នភាព Database។",
    "enterNicknameRequired": "សូមបញ្ចូលឈ្មោះហៅក្រៅ។",
    "failedSaveCharacter": "មិនអាចរក្សាទុកតួអង្គបានទេ",
    "characterUpdated": "បានកែតួអង្គ។",
    "characterAdded": "បានបន្ថែមតួអង្គ។",
    "couldNotSave": "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ។",
    "chooseAtLeast2": "សូមជ្រើសយ៉ាងហោចណាស់ 2 តួអង្គសម្រាប់ភាគនេះ។",
    "chooseAtLeast1Main": "សូមជ្រើសយ៉ាងហោចណាស់ 1 តួអង្គសំខាន់សម្រាប់ភាគនេះ។",
    "failedSaveCharacters": "មិនអាចរក្សាទុកតួអង្គបានទេ",
    "saved": "បានរក្សាទុក",
    "goBack": "ត្រឡប់ក្រោយ",
    "buildYourCast": "បង្កើតក្រុមតួអង្គ",
    "loadingCharacters": "កំពុងផ្ទុកតួអង្គ...",
    "storyInfo": "ព័ត៌មានរឿង",
    "characters": "តួអង្គ",
    "chat": "Chat",
    "publish": "Publish"
  },
  "zh": {
    "mainCharacters": "主要角色",
    "main": "主要",
    "mainDescription": "推动故事发展的核心角色。",
    "majorSupportingCharacters": "重要配角",
    "majorSupport": "重要配角",
    "majorDescription": "与主角关系紧密并经常出现的重要角色。",
    "minorSupportingCharacters": "次要配角",
    "minorSupport": "次要配角",
    "minorDescription": "帮助推动故事但出现频率较低的角色。",
    "backgroundCharacters": "背景角色",
    "background": "背景",
    "backgroundDescription": "偶尔出现或无名的角色，例如守卫、职员、医生或同学。",
    "failedUploadCharacterImage": "无法上传角色图片",
    "dragDownToClose": "向下拖动以关闭",
    "gotIt": "知道了",
    "chooseLeadCharacter": "选择主角",
    "leadHelp": "主角使用主要聊天样式并显示在右侧。",
    "leadCharacter": "主角",
    "cancel": "取消",
    "confirm": "确认",
    "mainChatRight": "主要聊天样式 · 右侧",
    "change": "更改",
    "addPhoto": "添加图片",
    "uploadFromDevice": "从设备上传",
    "shadowGallery": "Shadow Gallery",
    "chooseProfileImage": "为此角色选择头像。",
    "loadingGallery": "正在加载图库...",
    "galleryCouldNotLoad": "无法加载图库",
    "tryAgain": "重试",
    "noImagesGallery": "图库中暂无图片",
    "noImagesGalleryHelp": "在 Supabase 的 Chat Story 头像图库中添加有效图片 URL。",
    "all": "全部",
    "characterAvatar": "角色头像",
    "character": "角色",
    "replaceProfileImage": "更换头像",
    "enterNickname": "输入角色昵称",
    "editProfile": "编辑资料",
    "addCharacter": "添加角色",
    "saving": "保存中...",
    "save": "保存",
    "unnamedCharacter": "未命名角色",
    "unnamedRole": "未命名角色",
    "leadUsed": "主角 · 已使用",
    "usedInEpisode": "已在章节中使用",
    "notUsed": "未使用",
    "usedCount": "已使用 {{used}}/{{total}}",
    "aboutGroup": "关于 {{group}}",
    "failedLoadCharacters": "无法加载角色",
    "leadMustBeUsed": "本章节必须使用主角。",
    "addMainFirst": "请先添加一个主要角色。",
    "leadChanged": "主角已更改。点击“保存”以应用。",
    "chooseImageFile": "请选择图片文件。",
    "profileImageTooLarge": "头像必须小于或等于 2 MB。",
    "failedLoadShadowGallery": "无法加载 Shadow Gallery",
    "cannotConnectBackend": "无法连接后端。",
    "failedLoadGallery": "无法加载图库",
    "deleteCharacterQuestion": "删除此角色？",
    "characterDeleted": "角色已删除。点击“保存”以更新数据库。",
    "enterNicknameRequired": "请输入昵称。",
    "failedSaveCharacter": "无法保存角色",
    "characterUpdated": "角色已更新。",
    "characterAdded": "角色已添加。",
    "couldNotSave": "无法保存更改。",
    "chooseAtLeast2": "本章节请至少选择 2 个角色。",
    "chooseAtLeast1Main": "本章节请至少选择 1 个主要角色。",
    "failedSaveCharacters": "无法保存角色",
    "saved": "已保存",
    "goBack": "返回",
    "buildYourCast": "创建角色阵容",
    "loadingCharacters": "正在加载角色...",
    "storyInfo": "故事信息",
    "characters": "角色",
    "chat": "聊天",
    "publish": "发布"
  },
  "ja": {
    "mainCharacters": "メインキャラクター",
    "main": "メイン",
    "mainDescription": "物語を動かす中心的なキャラクター。",
    "majorSupportingCharacters": "主要サポートキャラクター",
    "majorSupport": "主要サポート",
    "majorDescription": "メインキャストの近くにいて頻繁に登場する重要なキャラクター。",
    "minorSupportingCharacters": "サポートキャラクター",
    "minorSupport": "サポート",
    "minorDescription": "物語を進める手助けをするが登場頻度は低いキャラクター。",
    "backgroundCharacters": "背景キャラクター",
    "background": "背景",
    "backgroundDescription": "警備員、スタッフ、医師、同級生など、時々登場する名前のない役。",
    "failedUploadCharacterImage": "キャラクター画像をアップロードできませんでした",
    "dragDownToClose": "下にドラッグして閉じる",
    "gotIt": "了解",
    "chooseLeadCharacter": "主人公を選択",
    "leadHelp": "主人公はメインチャットのスタイルを使い、右側に表示されます。",
    "leadCharacter": "主人公",
    "cancel": "キャンセル",
    "confirm": "確認",
    "mainChatRight": "メインチャット · 右側",
    "change": "変更",
    "addPhoto": "写真を追加",
    "uploadFromDevice": "端末からアップロード",
    "shadowGallery": "Shadow Gallery",
    "chooseProfileImage": "このキャラクターのプロフィール画像を選択してください。",
    "loadingGallery": "ギャラリーを読み込み中...",
    "galleryCouldNotLoad": "ギャラリーを読み込めませんでした",
    "tryAgain": "再試行",
    "noImagesGallery": "このギャラリーにはまだ画像がありません",
    "noImagesGalleryHelp": "Supabase の Chat Story アバターギャラリーに有効な画像 URL を追加してください。",
    "all": "すべて",
    "characterAvatar": "キャラクター画像",
    "character": "キャラクター",
    "replaceProfileImage": "プロフィール画像を変更",
    "enterNickname": "キャラクターのニックネームを入力",
    "editProfile": "プロフィールを編集",
    "addCharacter": "キャラクターを追加",
    "saving": "保存中...",
    "save": "保存",
    "unnamedCharacter": "名前なしキャラクター",
    "unnamedRole": "名前なしの役",
    "leadUsed": "主人公 · 使用済み",
    "usedInEpisode": "エピソードで使用済み",
    "notUsed": "未使用",
    "usedCount": "{{used}}/{{total}} 使用済み",
    "aboutGroup": "{{group}} について",
    "failedLoadCharacters": "キャラクターを読み込めませんでした",
    "leadMustBeUsed": "このエピソードでは主人公を使用する必要があります。",
    "addMainFirst": "最初にメインキャラクターを追加してください。",
    "leadChanged": "主人公を変更しました。「保存」を押して適用してください。",
    "chooseImageFile": "画像ファイルを選択してください。",
    "profileImageTooLarge": "プロフィール画像は 2 MB 以下にしてください。",
    "failedLoadShadowGallery": "Shadow Gallery を読み込めませんでした",
    "cannotConnectBackend": "バックエンドに接続できません。",
    "failedLoadGallery": "ギャラリーを読み込めませんでした",
    "deleteCharacterQuestion": "このキャラクターを削除しますか？",
    "characterDeleted": "キャラクターを削除しました。「保存」を押してデータベースを更新してください。",
    "enterNicknameRequired": "ニックネームを入力してください。",
    "failedSaveCharacter": "キャラクターを保存できませんでした",
    "characterUpdated": "キャラクターを更新しました。",
    "characterAdded": "キャラクターを追加しました。",
    "couldNotSave": "変更を保存できませんでした。",
    "chooseAtLeast2": "このエピソードには少なくとも2人のキャラクターを選択してください。",
    "chooseAtLeast1Main": "このエピソードには少なくとも1人のメインキャラクターを選択してください。",
    "failedSaveCharacters": "キャラクターを保存できませんでした",
    "saved": "保存しました",
    "goBack": "戻る",
    "buildYourCast": "キャストを作成",
    "loadingCharacters": "キャラクターを読み込み中...",
    "storyInfo": "ストーリー情報",
    "characters": "キャラクター",
    "chat": "チャット",
    "publish": "公開"
  },
  "ko": {
    "mainCharacters": "주요 캐릭터",
    "main": "주요",
    "mainDescription": "이야기를 이끄는 중심 캐릭터입니다.",
    "majorSupportingCharacters": "주요 조연 캐릭터",
    "majorSupport": "주요 조연",
    "majorDescription": "주요 캐릭터와 가깝게 지내며 자주 등장하는 중요한 캐릭터입니다.",
    "minorSupportingCharacters": "조연 캐릭터",
    "minorSupport": "조연",
    "minorDescription": "이야기를 진행시키지만 등장 빈도가 낮은 캐릭터입니다.",
    "backgroundCharacters": "배경 캐릭터",
    "background": "배경",
    "backgroundDescription": "경비원, 직원, 의사, 반 친구처럼 가끔 등장하거나 이름 없는 역할입니다.",
    "failedUploadCharacterImage": "캐릭터 이미지를 업로드하지 못했습니다",
    "dragDownToClose": "아래로 드래그하여 닫기",
    "gotIt": "확인",
    "chooseLeadCharacter": "주인공 선택",
    "leadHelp": "주인공은 기본 채팅 스타일을 사용하며 오른쪽에 표시됩니다.",
    "leadCharacter": "주인공",
    "cancel": "취소",
    "confirm": "확인",
    "mainChatRight": "메인 채팅 스타일 · 오른쪽",
    "change": "변경",
    "addPhoto": "사진 추가",
    "uploadFromDevice": "기기에서 업로드",
    "shadowGallery": "Shadow Gallery",
    "chooseProfileImage": "이 캐릭터의 프로필 이미지를 선택하세요.",
    "loadingGallery": "갤러리 불러오는 중...",
    "galleryCouldNotLoad": "갤러리를 불러오지 못했습니다",
    "tryAgain": "다시 시도",
    "noImagesGallery": "이 갤러리에 아직 이미지가 없습니다",
    "noImagesGalleryHelp": "Supabase의 Chat Story 아바타 갤러리에 활성 이미지 URL을 추가하세요.",
    "all": "전체",
    "characterAvatar": "캐릭터 아바타",
    "character": "캐릭터",
    "replaceProfileImage": "프로필 이미지 변경",
    "enterNickname": "캐릭터 닉네임 입력",
    "editProfile": "프로필 편집",
    "addCharacter": "캐릭터 추가",
    "saving": "저장 중...",
    "save": "저장",
    "unnamedCharacter": "이름 없는 캐릭터",
    "unnamedRole": "이름 없는 역할",
    "leadUsed": "주인공 · 사용됨",
    "usedInEpisode": "에피소드에서 사용됨",
    "notUsed": "사용 안 함",
    "usedCount": "{{used}}/{{total}} 사용됨",
    "aboutGroup": "{{group}} 정보",
    "failedLoadCharacters": "캐릭터를 불러오지 못했습니다",
    "leadMustBeUsed": "이 에피소드에는 주인공을 사용해야 합니다.",
    "addMainFirst": "먼저 주요 캐릭터를 추가하세요.",
    "leadChanged": "주인공이 변경되었습니다. 저장을 눌러 적용하세요.",
    "chooseImageFile": "이미지 파일을 선택해 주세요.",
    "profileImageTooLarge": "프로필 이미지는 2 MB 이하여야 합니다.",
    "failedLoadShadowGallery": "Shadow Gallery를 불러오지 못했습니다",
    "cannotConnectBackend": "백엔드에 연결할 수 없습니다.",
    "failedLoadGallery": "갤러리를 불러오지 못했습니다",
    "deleteCharacterQuestion": "이 캐릭터를 삭제할까요?",
    "characterDeleted": "캐릭터가 삭제되었습니다. 저장을 눌러 데이터베이스를 업데이트하세요.",
    "enterNicknameRequired": "닉네임을 입력해 주세요.",
    "failedSaveCharacter": "캐릭터를 저장하지 못했습니다",
    "characterUpdated": "캐릭터가 업데이트되었습니다.",
    "characterAdded": "캐릭터가 추가되었습니다.",
    "couldNotSave": "변경 사항을 저장하지 못했습니다.",
    "chooseAtLeast2": "이 에피소드에 최소 2명의 캐릭터를 선택하세요.",
    "chooseAtLeast1Main": "이 에피소드에 최소 1명의 주요 캐릭터를 선택하세요.",
    "failedSaveCharacters": "캐릭터를 저장하지 못했습니다",
    "saved": "저장됨",
    "goBack": "뒤로 가기",
    "buildYourCast": "캐릭터 구성",
    "loadingCharacters": "캐릭터 불러오는 중...",
    "storyInfo": "스토리 정보",
    "characters": "캐릭터",
    "chat": "채팅",
    "publish": "게시"
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')


function getRoleGroupTitle(group) {
  if (group?.key === 'major') return getDisplayText('chatStoryCharacters.majorSupportingCharacters')
  if (group?.key === 'minor') return getDisplayText('chatStoryCharacters.minorSupportingCharacters')
  if (group?.key === 'background') return getDisplayText('chatStoryCharacters.backgroundCharacters')
  return getDisplayText('chatStoryCharacters.mainCharacters')
}

function getRoleGroupShortTitle(group) {
  if (group?.key === 'major') return getDisplayText('chatStoryCharacters.majorSupport')
  if (group?.key === 'minor') return getDisplayText('chatStoryCharacters.minorSupport')
  if (group?.key === 'background') return getDisplayText('chatStoryCharacters.background')
  return getDisplayText('chatStoryCharacters.main')
}

function getRoleGroupDescription(group) {
  if (group?.key === 'major') return getDisplayText('chatStoryCharacters.majorDescription')
  if (group?.key === 'minor') return getDisplayText('chatStoryCharacters.minorDescription')
  if (group?.key === 'background') return getDisplayText('chatStoryCharacters.backgroundDescription')
  return getDisplayText('chatStoryCharacters.mainDescription')
}

function formatDisplayNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId()).format(Number(value || 0))
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds`)
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function readResponsePayload(response) {
  const rawText = await response.text()

  if (!rawText) {
    return {
      data: {},
      rawText: '',
    }
  }

  try {
    return {
      data: JSON.parse(rawText),
      rawText,
    }
  } catch {
    return {
      data: {},
      rawText,
    }
  }
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = String(dataUrl).split(',')
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], fileName, { type: mime })
}

async function uploadCharacterImage(token, imageDataUrl, storyId, index) {
  if (!String(imageDataUrl || '').startsWith('data:image/')) return imageDataUrl || null

  const formData = new FormData()
  formData.append('image', dataUrlToFile(imageDataUrl, `chat-character-${storyId}-${index + 1}-${Date.now()}.jpg`))
  formData.append('folder', 'chat_story_character')

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
    60000
  )

  const { data, rawText } = await readResponsePayload(response)

  if (!response.ok || data.ok === false) {
    const serverMessage =
      data.message ||
      data.error ||
      rawText.slice(0, 500) ||
      getDisplayText('chatStoryCharacters.failedUploadCharacterImage')

    throw new Error(`Image upload failed (${response.status}): ${serverMessage}`)
  }

  return data.image_url || data.imageUrl || null
}


const ROLE_GROUPS = [
  {
    key: 'main',
    title: 'Main Characters',
    shortTitle: 'Main',
    description: 'The central characters who drive the story.',
    accent: '#7C3AED',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #7C3AED 12%)',
    border: '#D8B4FE',
    icon: 'fa-solid fa-crown',
  },
  {
    key: 'major',
    title: 'Major Supporting Characters',
    shortTitle: 'Major Support',
    description: 'Important characters who stay close to the main cast and appear often.',
    accent: '#F97316',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #F97316 12%)',
    border: '#FED7AA',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'minor',
    title: 'Minor Supporting Characters',
    shortTitle: 'Minor Support',
    description: 'Characters who help the story move forward but appear less often.',
    accent: '#0F9F7A',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #0F9F7A 12%)',
    border: '#A7F3D0',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'background',
    title: 'Background Characters',
    shortTitle: 'Background',
    description: 'Occasional or unnamed roles such as guards, staff, doctors or classmates.',
    accent: '#64748B',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #64748B 12%)',
    border: '#CBD5E1',
    icon: 'fa-solid fa-users',
  },
]

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function mapCharacter(character) {
  return {
    id: character.id,
    group: character.role_group,
    image: character.avatar_url || '',
    nickname: character.nickname || '',
    avatarSource: character.avatar_source || 'device',
    isLead: character.is_lead === true,
    chatSide: character.is_lead === true ? 'right' : 'left',
    gender: character.gender || '',
    birthday: character.birthday || '',
    heightCm: character.height_cm || '',
    occupation: character.occupation || '',
    personality: character.personality || '',
    relationship: character.relationship || '',
    bio: character.bio || '',
  }
}

function normalizeLeadCharacters(value) {
  const mainCharacters = value.filter(
    (character) => character.group === 'main'
  )

  const currentLead =
    mainCharacters.find((character) => character.isLead) ||
    mainCharacters[0] ||
    null

  return value.map((character) => {
    const isLead =
      character.group === 'main' &&
      character.id === currentLead?.id

    return {
      ...character,
      isLead,
      chatSide: isLead ? 'right' : 'left',
    }
  })
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${active ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'}`}>
        {number}
      </div>
      <div className={`line-clamp-1 text-[10px] font-extrabold ${active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'}`}>
        {title}
      </div>
    </div>
  )
}

function BottomSheet({ open, onClose, children, hideHandle = false }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const startDrag = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    dragYRef.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextY = Math.max(0, event.clientY - startYRef.current)
    dragYRef.current = nextY
    setDragY(nextY)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false
    const shouldClose = dragYRef.current >= 90
    dragYRef.current = 0
    setDragY(0)

    if (shouldClose) onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[180] flex items-end bg-black/45"
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {hideHandle ? (
  <button
    type="button"
    onPointerDown={startDrag}
    onPointerMove={moveDrag}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    className="absolute inset-x-0 top-0 z-10 h-14 touch-none cursor-grab bg-transparent outline-none active:cursor-grabbing"
    aria-label={getDisplayText('chatStoryCharacters.dragDownToClose')}
  />
) : (
  <button
    type="button"
    onPointerDown={startDrag}
    onPointerMove={moveDrag}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    className="mx-auto mb-3 flex h-7 w-20 touch-none items-center justify-center"
    aria-label={getDisplayText('chatStoryCharacters.dragDownToClose')}
  >
    <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
  </button>
)}

        {children}
      </div>
    </div>
  )
}

function HelpSheet({ group, onClose }) {
  return (
    <BottomSheet open={Boolean(group)} onClose={onClose}>
      {group ? (
        <>
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: group.soft, color: group.accent }}
            >
              <i className={`${group.icon} text-[15px]`} />
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{getRoleGroupTitle(group)}</h2>
              <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{getRoleGroupDescription(group)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-extrabold text-white active:scale-[0.99]"
          >
            {getDisplayText('chatStoryCharacters.gotIt')}
          </button>
        </>
      ) : null}
    </BottomSheet>
  )
}

function LeadCharacterSheet({
  open,
  characters,
  selectedId,
  onSelect,
  onClose,
  onConfirm,
}) {
  return (
    <BottomSheet open={open} onClose={onClose} hideHandle>
  <div className="pt-3 pb-1">
        <h2 className="text-center text-[18px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('chatStoryCharacters.chooseLeadCharacter')}
        </h2>

        <p className="mx-auto mt-2 max-w-[310px] text-center text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('chatStoryCharacters.leadHelp')}
        </p>

        <div className="mt-5 grid max-h-[48vh] grid-cols-2 gap-3 overflow-y-auto pb-2">
          {characters.map((character) => {
            const selected = selectedId === character.id

            return (
              <button
                key={character.id}
                type="button"
                onClick={() => onSelect(character.id)}
                className={`relative flex min-h-[130px] flex-col items-center justify-center overflow-hidden rounded-[20px] px-3 py-4 text-center active:scale-[0.98] ${
  selected
    ? 'border-2 border-[#7c3aed] bg-[var(--shadow-bg-soft)]'
    : 'border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]'
}`}
              >
                {selected ? (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#7c3aed] text-white">
                    <i className="fa-solid fa-check text-[9px]" />
                  </span>
                ) : null}

                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.nickname || getDisplayText('chatStoryCharacters.character')}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-[24px] text-[#9b87c9]" />
                  )}
                </span>

                <span className="mt-3 line-clamp-1 w-full text-[12px] font-bold text-[var(--shadow-text-primary)]">
                  {character.nickname || getDisplayText('chatStoryCharacters.unnamedCharacter')}
                </span>

                {selected ? (
                  <span className="mt-1 text-[9px] font-bold text-[#7c3aed]">
                    {getDisplayText('chatStoryCharacters.leadCharacter')}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-secondary)] active:scale-[0.98]"
          >
            {getDisplayText('chatStoryCharacters.cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!selectedId}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white active:scale-[0.98] disabled:opacity-45"
          >
            {getDisplayText('chatStoryCharacters.confirm')}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}

function LeadCharacterPanel({ character, onChange }) {
  if (!character) return null

  return (
    <section className="-mx-[2px] mt-4 w-[calc(100%+4px)] rounded-[20px] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.035)]">
      <div className="flex items-center gap-3">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
          {character.image ? (
            <img
              src={character.image}
              alt={character.nickname || getDisplayText('chatStoryCharacters.leadCharacter')}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[21px] text-[#9b87c9]" />
          )}

          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[#7c3aed] text-white">
            <i className="fa-solid fa-crown text-[7px]" />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-[#7c3aed]">
            {getDisplayText('chatStoryCharacters.leadCharacter')}
          </div>

          <div className="mt-1 truncate text-[14px] font-bold text-[var(--shadow-text-primary)]">
            {character.nickname || getDisplayText('chatStoryCharacters.unnamedCharacter')}
          </div>

          <div className="mt-1 text-[10px] text-[var(--shadow-text-tertiary)]">
            {getDisplayText('chatStoryCharacters.mainChatRight')}
          </div>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[var(--shadow-bg-soft)] px-4 text-[11px] font-bold text-[#7c3aed] active:scale-[0.97]"
        >
          {getDisplayText('chatStoryCharacters.change')}
          <i className="fa-solid fa-chevron-right text-[8px]" />
        </button>
      </div>
    </section>
  )
}

export function ImageSourceSheet({
  open,
  onClose,
  onDevice,
  onShadowGallery,
}) {
  return (
    <BottomSheet open={open} onClose={onClose} hideHandle>
      <div className="pt-5">
        <h2 className="text-center text-[20px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('chatStoryCharacters.addPhoto')}
        </h2>

        <div className="mt-8 grid min-h-[175px] grid-cols-2 items-start gap-8 px-4">
          <button
            type="button"
            onClick={onDevice}
            className="flex flex-col items-center justify-center text-center active:scale-[0.97]"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <img
                src="/assets/Icons/Local%20image.svg"
                alt=""
                className="h-9 w-9 object-contain"
              />
            </span>

            <span className="mt-4 text-[14px] font-medium text-[var(--shadow-text-primary)]">
              {getDisplayText('chatStoryCharacters.uploadFromDevice')}
            </span>
          </button>

          <button
            type="button"
            onClick={onShadowGallery}
            className="flex flex-col items-center justify-center text-center active:scale-[0.97]"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <img
                src="/assets/Icons/Shadow%20image.svg"
                alt=""
                className="h-9 w-9 object-contain"
              />
            </span>

            <span className="mt-4 text-[14px] font-medium text-[var(--shadow-text-primary)]">
              {getDisplayText('chatStoryCharacters.shadowGallery')}
            </span>
          </button>
        </div>

        <div className="-mx-4 h-3 bg-[var(--shadow-bg-hover)]" />

        <button
          type="button"
          onClick={onClose}
          className="-mx-4 flex h-16 w-[calc(100%+2rem)] items-center justify-center bg-[var(--shadow-bg-surface)] text-[15px] font-medium text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
        >
          {getDisplayText('chatStoryCharacters.cancel')}
        </button>
      </div>
    </BottomSheet>
  )
}


function GallerySheet({
  open,
  loading,
  error,
  images,
  categories,
  selectedCategory,
  onCategoryChange,
  onSelect,
  onRetry,
  onClose,
}) {
  if (!open) return null

  const visibleImages =
    selectedCategory === 'All'
      ? images
      : images.filter((item) => item.category === selectedCategory)

  return (
    <div className="fixed inset-0 z-[185] flex items-end bg-black/45" onClick={onClose}>
      <div
        className="max-h-[86vh] w-full overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] pb-[calc(18px+env(safe-area-inset-bottom))] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('chatStoryCharacters.shadowGallery')}</h2>
              <p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{getDisplayText('chatStoryCharacters.chooseProfileImage')}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>
        </div>

        {categories.length ? (
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {['All', ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold ${
                  selectedCategory === category
                    ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                }`}
              >
                {category === 'All' ? getDisplayText('chatStoryCharacters.all') : category}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-2 max-h-[62vh] overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <i className="fa-solid fa-spinner fa-spin text-[24px] text-[#7c3aed]" />
              <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-secondary)]">{getDisplayText('chatStoryCharacters.loadingGallery')}</div>
            </div>
          ) : error ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f2] text-[#e11d48]">
                <i className="fa-solid fa-triangle-exclamation text-[20px]" />
              </span>
              <div className="mt-3 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('chatStoryCharacters.galleryCouldNotLoad')}</div>
              <div className="mt-1 max-w-[280px] text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{error}</div>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[11px] font-extrabold text-[var(--shadow-bg-surface)]"
              >
                {getDisplayText('chatStoryCharacters.tryAgain')}
              </button>
            </div>
          ) : visibleImages.length ? (
            <div className="grid grid-cols-3 gap-3 pt-2 sm:grid-cols-4 md:grid-cols-5">
              {visibleImages.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)] text-left shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-[0.98]"
                >
                  <div className="aspect-square overflow-hidden bg-[var(--shadow-bg-soft)]">
                    <img
                      src={item.image_url}
                      alt={item.alt_text || item.title || getDisplayText('chatStoryCharacters.characterAvatar')}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="line-clamp-1 px-2 py-2 text-[9.5px] font-bold text-[var(--shadow-text-secondary)]">
                    {item.title || item.category || getDisplayText('chatStoryCharacters.character')}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
                <i className="fa-regular fa-images text-[21px]" />
              </span>
              <div className="mt-3 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{getDisplayText('chatStoryCharacters.noImagesGallery')}</div>
              <div className="mt-1 max-w-[290px] text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
                {getDisplayText('chatStoryCharacters.noImagesGalleryHelp')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CharacterEditor({
  open,
  group,
  image,
  nickname,
  editing,
  onNicknameChange,
  onChangeImage,
  onEditProfile,
  onClose,
  saving,
  onSave,
}) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open || !group) return null

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[340px] rounded-[28px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onChangeImage}
            className="relative active:scale-[0.98]"
            aria-label={getDisplayText('chatStoryCharacters.replaceProfileImage')}
          >
            <span
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-1 ring-[var(--shadow-border)]"
              style={{ backgroundColor: group.soft }}
            >
              {image ? (
                <img
                  src={image}
                  alt={nickname || getDisplayText('chatStoryCharacters.character')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-white" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <div className="relative mt-7">
          <input
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            maxLength={40}
            placeholder={getDisplayText('chatStoryCharacters.enterNickname')}
            className="h-14 w-full rounded-full bg-[var(--shadow-bg-soft)] px-12 text-center text-[16px] font-medium text-[var(--shadow-text-primary)] outline-none focus:ring-2 focus:ring-[#9362ef]/25"
          />

          <i className="fa-regular fa-pen-to-square pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[17px] text-[var(--shadow-text-tertiary)]" />
        </div>

        {editing ? (
          <button
            type="button"
            onClick={onEditProfile}
            className="mx-auto mt-5 flex items-center justify-center gap-1.5 px-4 py-2 text-[14px] font-medium text-[#7c3aed] active:opacity-60"
          >
            {getDisplayText('chatStoryCharacters.editProfile')}
            <i className="fa-solid fa-angles-right text-[10px]" />
          </button>
        ) : null}

        <div className={`${editing ? 'mt-5' : 'mt-7'} grid grid-cols-2 gap-3`}>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-secondary)] active:scale-[0.98] disabled:opacity-60"
          >
            {getDisplayText('chatStoryCharacters.cancel')}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? getDisplayText('chatStoryCharacters.saving') : getDisplayText('chatStoryCharacters.confirm')}
          </button>
        </div>
      </section>
    </div>
  )
}

function CharacterCard({
  character,
  index,
  group,
  selected,
  locked,
  onToggle,
  onEdit,
  onEditProfile,
}) {
  return (
    <div
      className={`relative flex h-[194px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-surface)] px-3 shadow-[0_3px_12px_rgba(15,23,42,0.035)] ${
        selected
          ? 'ring-2 ring-[#7c3aed]/35'
          : 'opacity-70 ring-1 ring-[var(--shadow-border)]'
      }`}
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full flex-col items-center justify-center active:scale-[0.98]"
      >
        <span
          className="absolute left-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-[8px] px-1.5 text-[10px] font-extrabold"
          style={{
            backgroundColor: group.soft,
            color: group.accent,
          }}
        >
          {index + 1}
        </span>

        <span
          className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full"
          style={{
            backgroundColor: group.soft,
          }}
        >
          {character.image ? (
            <img
              src={character.image}
              alt={
                character.nickname ||
                getRoleGroupShortTitle(group)
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[27px] text-white" />
          )}
        </span>

        <span className="mt-3 line-clamp-1 w-full text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
          {character.nickname ||
            getDisplayText('chatStoryCharacters.unnamedRole')}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        aria-pressed={selected}
        className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full ${
          selected
            ? 'bg-[#7c3aed] text-white'
            : 'border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-transparent'
        } disabled:cursor-default`}
      >
        <i className="fa-solid fa-check text-[10px]" />
      </button>

      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        className={`mt-2 rounded-full px-3 py-1 text-[9px] font-bold ${
          selected
            ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
            : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
        } disabled:cursor-default`}
      >
        {locked
          ? getDisplayText('chatStoryCharacters.leadUsed')
          : selected
            ? getDisplayText('chatStoryCharacters.usedInEpisode')
            : getDisplayText('chatStoryCharacters.notUsed')}
      </button>

      <button
        type="button"
        onClick={onEditProfile}
        className="mt-1 text-[9px] font-medium text-[var(--shadow-text-tertiary)] active:text-[var(--shadow-text-secondary)]"
      >
        {getDisplayText('chatStoryCharacters.editProfile')}{' '}
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}

function AddCharacterCard({ group, onClick }) {
  return (
    <button
  type="button"
  onClick={onClick}
  className="flex h-[168px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-surface)] px-3 text-center shadow-[0_3px_12px_rgba(15,23,42,0.035)] active:scale-[0.98]"
>
      <span
        className="flex h-[66px] w-[66px] items-center justify-center rounded-full"
        style={{ backgroundColor: group.soft, color: group.accent }}
      >
        <i className="fa-solid fa-plus text-[22px]" />
      </span>
      <span className="mt-3 text-[11px] font-normal" style={{ color: group.accent }}>
        {getDisplayText('chatStoryCharacters.addCharacter')}
      </span>
    </button>
  )
}

function RoleSection({
  group,
  characters,
  selectedCharacterIdSet,
  onHelp,
  onAdd,
  onEdit,
  onEditProfile,
  onToggle,
}) {
  const usedCount = characters.filter(
    (character) =>
      selectedCharacterIdSet.has(
        String(character.id)
      )
  ).length

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: group.soft,
              color: group.accent,
            }}
          >
            <i
              className={`${group.icon} text-[11px]`}
            />
          </span>

          <h2 className="line-clamp-1 text-[15px] font-bold text-[var(--shadow-text-primary)]">
            {getRoleGroupTitle(group)}
          </h2>

          <button
            type="button"
            onClick={onHelp}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--shadow-border-strong)] text-[10px] font-extrabold text-[var(--shadow-text-secondary)]"
            aria-label={getDisplayText('chatStoryCharacters.aboutGroup', { group: getRoleGroupTitle(group) })}
          >
            ?
          </button>
        </div>

        <span className="shrink-0 text-[10px] font-bold text-[var(--shadow-text-tertiary)]">
          {getDisplayText('chatStoryCharacters.usedCount', { used: formatDisplayNumber(usedCount), total: formatDisplayNumber(characters.length) })}
        </span>
      </div>

      <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-3">
        {characters.map(
          (character, index) => {
            const selected =
              selectedCharacterIdSet.has(
                String(character.id)
              )

            return (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                group={group}
                selected={selected}
                locked={
                  character.isLead === true
                }
                onToggle={() =>
                  onToggle(character)
                }
                onEdit={() =>
                  onEdit(character)
                }
                onEditProfile={() =>
                  onEditProfile(character)
                }
              />
            )
          }
        )}

        <AddCharacterCard
          group={group}
          onClick={onAdd}
        />
      </div>
    </section>
  )
}

export default function ChatStoryCharactersPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const startNewEpisode =
  searchParams.get('new') === '1'
  const requestedReturnTo = searchParams.get('returnTo')
const storyManagerPath = `/author/story/${storyId}/manage`

const returnTo =
  requestedReturnTo === '/author/stories' ||
  requestedReturnTo === '/author/dashboard' ||
  requestedReturnTo === storyManagerPath
    ? requestedReturnTo
    : storyManagerPath
const castStorageKey =
  `chat_story_episode_cast_${storyId || 'unknown'}_new`
const fileInputRef = useRef(null)
const [characters, setCharacters] = useState([])
const [
  selectedCharacterIds,
  setSelectedCharacterIds,
] = useState([])
  const [helpGroup, setHelpGroup] = useState(null)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [activeGroupKey, setActiveGroupKey] = useState('')
  const [editingId, setEditingId] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [nickname, setNickname] = useState('')
  const [toast, setToast] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarSource, setAvatarSource] = useState('device')
  const [characterGroup, setCharacterGroup] = useState('main')
  const [chatSide, setChatSide] = useState('right')
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryError, setGalleryError] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryCategories, setGalleryCategories] = useState([])
  const [leadSheetOpen, setLeadSheetOpen] = useState(false)
  const [leadDraftId, setLeadDraftId] = useState('')

  useEffect(() => {
    async function loadCharacters() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (!storyId) {
        setPageLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/chat/characters`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('chatStoryCharacters.failedLoadCharacters'))
        }

        const normalizedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

setCharacters(normalizedCharacters)

let restoredCharacterIds = []
let hasSavedCast = false

try {
  const savedCast =
    sessionStorage.getItem(
      castStorageKey
    )

  const parsedCast = savedCast
    ? JSON.parse(savedCast)
    : null

  const candidateIds =
    Array.isArray(parsedCast)
      ? parsedCast
      : Array.isArray(
            parsedCast?.characterIds
          )
        ? parsedCast.characterIds
        : null

  hasSavedCast =
    Array.isArray(candidateIds)

  const validCharacterIds =
    new Set(
      normalizedCharacters.map(
        (character) =>
          String(character.id)
      )
    )

  restoredCharacterIds =
    Array.isArray(candidateIds)
      ? [
          ...new Set(
            candidateIds
              .map((id) => String(id))
              .filter((id) =>
                validCharacterIds.has(id)
              )
          ),
        ]
      : []
} catch {
  sessionStorage.removeItem(
    castStorageKey
  )
}

if (!hasSavedCast) {
  restoredCharacterIds =
    normalizedCharacters.map(
      (character) =>
        String(character.id)
    )
}

const savedLeadCharacter =
  normalizedCharacters.find(
    (character) =>
      character.isLead === true
  )

if (
  savedLeadCharacter &&
  !restoredCharacterIds.includes(
    String(savedLeadCharacter.id)
  )
) {
  restoredCharacterIds.push(
    String(savedLeadCharacter.id)
  )
}

setSelectedCharacterIds(
  restoredCharacterIds
)
      } catch (error) {
        showToast(error.message || getDisplayText('chatStoryCharacters.failedLoadCharacters'))
      } finally {
        setPageLoading(false)
      }
    }

    loadCharacters()
  }, [castStorageKey, navigate, storyId])

  useEffect(() => {
  if (!storyId) return

  const draftKey = `shadow_gallery_character_draft_${storyId}`
  const draftRaw = sessionStorage.getItem(draftKey)

  if (!draftRaw) return

  try {
    const draft = JSON.parse(draftRaw)
    const expired =
      !draft.createdAt ||
      Date.now() - Number(draft.createdAt) > 30 * 60 * 1000

    if (expired) {
      sessionStorage.removeItem(draftKey)
      return
    }

    const selectedRaw = sessionStorage.getItem(
      'shadow_gallery_selected_image'
    )

    let selected = null

    if (selectedRaw) {
      const parsedSelected = JSON.parse(selectedRaw)

      if (String(parsedSelected.storyId || '') === String(storyId)) {
        selected = parsedSelected
      }
    }

    const restoredGroup =
      draft.characterGroup ||
      draft.activeGroupKey ||
      'main'

    setActiveGroupKey(restoredGroup)
    setCharacterGroup(restoredGroup)
    setEditingId(draft.editingId || '')
    setNickname(draft.nickname || '')
    setSelectedImage(
      selected?.imageUrl || draft.selectedImage || ''
    )
    setAvatarSource(
      selected?.imageUrl
        ? 'shadow_gallery'
        : draft.avatarSource || 'device'
    )
    setChatSide(
      draft.chatSide ||
      (restoredGroup === 'main' ? 'right' : 'left')
    )
    if (selected?.imageUrl) {
  setSourceOpen(false)
  setEditorOpen(true)
} else if (draft.origin === 'cast-photo') {
  setEditorOpen(false)
  setSourceOpen(true)
} else {
  setSourceOpen(false)
  setEditorOpen(false)
}

sessionStorage.removeItem(draftKey)

    if (selected) {
      sessionStorage.removeItem(
        'shadow_gallery_selected_image'
      )
    }
  } catch {
    sessionStorage.removeItem(draftKey)
    sessionStorage.removeItem(
      'shadow_gallery_selected_image'
    )
  }
}, [storyId])

  const activeGroup = ROLE_GROUPS.find((group) => group.key === characterGroup || group.key === activeGroupKey) || null

  const groupedCharacters = useMemo(() => {
    return ROLE_GROUPS.reduce((result, group) => {
      result[group.key] = characters.filter((character) => character.group === group.key)
      return result
    }, {})
  }, [characters])

  const leadCharacter =
  characters.find(
    (character) =>
      character.group === 'main' &&
      character.isLead
  ) ||
  groupedCharacters.main[0] ||
  null

const selectedCharacterIdSet =
  useMemo(
    () =>
      new Set(
        selectedCharacterIds.map(
          (id) => String(id)
        )
      ),
    [selectedCharacterIds]
  )

const selectedCharacters =
  characters.filter(
    (character) =>
      selectedCharacterIdSet.has(
        String(character.id)
      )
  )

const selectedMainCharacters =
  selectedCharacters.filter(
    (character) =>
      character.group === 'main'
  )

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(
      () => setToast(''),
      2200
    )
  }

  useEffect(() => {
    if (!storyId || pageLoading) {
      return
    }

    sessionStorage.setItem(
      castStorageKey,
      JSON.stringify({
        characterIds:
          selectedCharacterIds,
        updatedAt:
          new Date().toISOString(),
      })
    )
  }, [
    castStorageKey,
    pageLoading,
    selectedCharacterIds,
    storyId,
  ])

  const toggleEpisodeCharacter = (
    character
  ) => {
    const characterId =
      String(character.id)

    if (
      character.isLead === true &&
      selectedCharacterIdSet.has(
        characterId
      )
    ) {
      showToast(
        getDisplayText('chatStoryCharacters.leadMustBeUsed')
      )
      return
    }

    setSelectedCharacterIds(
      (current) => {
        const nextIds =
          new Set(
            current.map(
              (id) => String(id)
            )
          )

        if (nextIds.has(characterId)) {
          nextIds.delete(characterId)
        } else {
          nextIds.add(characterId)
        }

        return [...nextIds]
      }
    )
  }

  const openLeadCharacterSheet = () => {
    if (!groupedCharacters.main.length) {
      showToast(
        getDisplayText('chatStoryCharacters.addMainFirst')
      )
      return
    }

    setLeadDraftId(
      leadCharacter?.id ||
        groupedCharacters.main[0]?.id ||
        ''
    )

    setLeadSheetOpen(true)
  }

  const confirmLeadCharacter = () => {
    if (!leadDraftId) return

    setCharacters((current) =>
      normalizeLeadCharacters(
        current.map((character) => ({
          ...character,
          isLead:
            character.group === 'main' &&
            String(character.id) ===
              String(leadDraftId),
        }))
      )
    )

    setSelectedCharacterIds(
      (current) => {
        const nextIds =
          new Set(
            current.map(
              (id) => String(id)
            )
          )

        nextIds.add(
          String(leadDraftId)
        )

        return [...nextIds]
      }
    )

    setLeadSheetOpen(false)
    showToast(
      getDisplayText('chatStoryCharacters.leadChanged')
    )
  }

  const openAddCharacter = (groupKey) => {
    setActiveGroupKey(groupKey)
    setCharacterGroup(groupKey)
    setEditingId('')
    setSelectedImage('')
    setNickname('')
    setAvatarSource('device')
    setChatSide(groupKey === 'main' ? 'right' : 'left')
    setSourceOpen(true)
  }

  const openEditCharacter = (character) => {
    setActiveGroupKey(character.group)
    setCharacterGroup(character.group)
    setEditingId(character.id)
    setSelectedImage(character.image || '')
    setNickname(character.nickname || '')
    setAvatarSource(character.avatarSource || 'device')
    setChatSide(character.chatSide || (character.group === 'main' ? 'right' : 'left'))
    setEditorOpen(true)
  }

  const openImageSourceFromEditor = () => {
    setEditorOpen(false)
    setSourceOpen(true)
  }

  const chooseDeviceImage = () => {
    setSourceOpen(false)
    setAvatarSource('device')
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      if (editingId || nickname) setEditorOpen(true)
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast(getDisplayText('chatStoryCharacters.chooseImageFile'))
      if (editingId || nickname) setEditorOpen(true)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
  showToast(getDisplayText('chatStoryCharacters.profileImageTooLarge'))
  if (editingId || nickname) setEditorOpen(true)
  return
}

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(String(reader.result || ''))
      setAvatarSource('device')
      setEditorOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const loadShadowGallery = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setGalleryLoading(true)
      setGalleryError('')

      const response = await fetch(`${API_BASE_URL}/api/stories/chat/avatar-gallery?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('chatStoryCharacters.failedLoadShadowGallery'))
      }

      setGalleryImages(data.images || [])
      setGalleryCategories(data.categories || [])
    } catch (error) {
      setGalleryError(error.message === 'Failed to fetch' ? getDisplayText('chatStoryCharacters.cannotConnectBackend') : error.message || getDisplayText('chatStoryCharacters.failedLoadGallery'))
    } finally {
      setGalleryLoading(false)
    }
  }

  const openShadowGallery = () => {
  if (!storyId) return

  const origin = 'cast-photo'
const returnUrl = new URL(
  window.location.href
)
const returnPath =
  returnUrl.pathname +
  returnUrl.search +
  returnUrl.hash

  sessionStorage.removeItem('shadow_gallery_selected_image')

  sessionStorage.setItem(
    `shadow_gallery_character_draft_${storyId}`,
    JSON.stringify({
      origin,
      returnPath,
      activeGroupKey,
      characterGroup,
      editingId,
      selectedImage,
      nickname,
      avatarSource,
      chatSide,
      createdAt: Date.now(),
    })
  )

  setSourceOpen(false)

  navigate(
    `/author/story/${storyId}/chat/shadow-gallery` +
      `?origin=${encodeURIComponent(origin)}` +
      `&return=${encodeURIComponent(returnPath)}`
  )
}

  const selectGalleryImage = (item) => {
    setSelectedImage(item.image_url || '')
    setAvatarSource('shadow_gallery')
    setGalleryOpen(false)
    setEditorOpen(true)
  }

  const deleteCharacter = () => {
    if (!editingId) return
    const confirmed = window.confirm(getDisplayText('chatStoryCharacters.deleteCharacterQuestion'))
    if (!confirmed) return

    setCharacters((current) =>
      normalizeLeadCharacters(
        current.filter((character) => character.id !== editingId)
      )
    )
    setEditorOpen(false)
    setEditingId('')
    showToast(getDisplayText('chatStoryCharacters.characterDeleted'))
  }

  const saveCharacter = async () => {
  const selectedGroup = ROLE_GROUPS.find((group) => group.key === characterGroup)
  if (!selectedGroup) return

  const cleanNickname = nickname.trim()

  if (characterGroup !== 'background' && !cleanNickname) {
    showToast(getDisplayText('chatStoryCharacters.enterNicknameRequired'))
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const wasEditing = Boolean(editingId)
  const nextCharacter = {
    group: characterGroup,
    image: selectedImage,
    nickname: cleanNickname,
    avatarSource,
    chatSide,
  }

  const nextCharacters = normalizeLeadCharacters(
  editingId
    ? characters.map((character) =>
        character.id === editingId
          ? { ...character, ...nextCharacter }
          : character
      )
    : [
        ...characters,
        {
          id: makeId(),
          isLead: false,
          ...nextCharacter,
        },
      ]
)

  try {
    setSaving(true)

    const uploadedCharacters = []

    for (let index = 0; index < nextCharacters.length; index += 1) {
      const character = nextCharacters[index]
      const avatarUrl = await uploadCharacterImage(
        token,
        character.image,
        storyId,
        index
      )

      uploadedCharacters.push({
        id: character.id,
        role_group: character.group,
        nickname: character.nickname || null,
        avatar_url: avatarUrl,
        avatar_source: character.avatarSource || 'device',
        is_lead: character.isLead === true,
        chat_side: character.isLead === true ? 'right' : 'left',
        gender: character.gender || null,
        birthday: character.birthday || null,
        height_cm: character.heightCm === '' ? null : character.heightCm,
        occupation: character.occupation || null,
        personality: character.personality || null,
        relationship: character.relationship || null,
        bio: character.bio || null,
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characters: uploadedCharacters }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('chatStoryCharacters.failedSaveCharacter'))
    }

    const savedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

const previousCharacterIds =
  new Set(
    characters.map(
      (character) =>
        String(character.id)
    )
  )

const addedCharacter =
  wasEditing
    ? null
    : savedCharacters.find(
        (character) =>
          !previousCharacterIds.has(
            String(character.id)
          )
      ) || null

setCharacters(savedCharacters)

setSelectedCharacterIds(
  (current) => {
    const validCharacterIds =
      new Set(
        savedCharacters.map(
          (character) =>
            String(character.id)
        )
      )

    const nextIds =
      new Set(
        current
          .map((id) => String(id))
          .filter((id) =>
            validCharacterIds.has(id)
          )
      )

    if (addedCharacter) {
      nextIds.add(
        String(addedCharacter.id)
      )
    }

    const currentLead =
      savedCharacters.find(
        (character) =>
          character.isLead === true
      )

    if (currentLead) {
      nextIds.add(
        String(currentLead.id)
      )
    }

    return [...nextIds]
  }
)

setActiveGroupKey(characterGroup)
setEditorOpen(false)
setEditingId('')
showToast(
  wasEditing
    ? getDisplayText('chatStoryCharacters.characterUpdated')
    : getDisplayText('chatStoryCharacters.characterAdded')
)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('chatStoryCharacters.cannotConnectBackend')
        : error.message || getDisplayText('chatStoryCharacters.couldNotSave')
    )
  } finally {
    setSaving(false)
  }
}

  const handleSavePage = async () => {
    if (saving || pageLoading) return

    if (selectedCharacters.length < 2) {
  showToast(
    getDisplayText('chatStoryCharacters.chooseAtLeast2')
  )
  return
}

if (
  selectedMainCharacters.length < 1
) {
  showToast(
    getDisplayText('chatStoryCharacters.chooseAtLeast1Main')
  )
  return
}

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const normalizedCharacters =
        normalizeLeadCharacters(characters)

      const uploadedCharacters = []

      for (
        let index = 0;
        index < normalizedCharacters.length;
        index += 1
      ) {
        const character = normalizedCharacters[index]

        const avatarUrl = await uploadCharacterImage(
          token,
          character.image,
          storyId,
          index
        )

        uploadedCharacters.push({
          id: character.id,
          role_group: character.group,
          nickname: character.nickname || null,
          avatar_url: avatarUrl,
          avatar_source: character.avatarSource || 'device',
          is_lead: character.isLead === true,
          chat_side: character.isLead === true ? 'right' : 'left',
          gender: character.gender || null,
          birthday: character.birthday || null,
          height_cm:
            character.heightCm === ''
              ? null
              : character.heightCm,
          occupation: character.occupation || null,
          personality: character.personality || null,
          relationship: character.relationship || null,
          bio: character.bio || null,
        })
      }

      const endpoint =
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters`

      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            characters: uploadedCharacters,
          }),
        },
        45000
      )

      const { data, rawText } =
        await readResponsePayload(response)

      if (!response.ok || data.ok === false) {
        const serverMessage =
          data.message ||
          data.error ||
          rawText.slice(0, 700) ||
          getDisplayText('chatStoryCharacters.failedSaveCharacters')

        throw new Error(serverMessage)
      }

      const savedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

const validCharacterIds =
  new Set(
    savedCharacters.map(
      (character) =>
        String(character.id)
    )
  )

const nextSelectedIds = [
  ...new Set(
    selectedCharacterIds
      .map((id) => String(id))
      .filter((id) =>
        validCharacterIds.has(id)
      )
  ),
]

const savedLeadCharacter =
  savedCharacters.find(
    (character) =>
      character.isLead === true
  )

if (
  savedLeadCharacter &&
  !nextSelectedIds.includes(
    String(savedLeadCharacter.id)
  )
) {
  nextSelectedIds.push(
    String(savedLeadCharacter.id)
  )
}

setCharacters(savedCharacters)
setSelectedCharacterIds(
  nextSelectedIds
)

sessionStorage.setItem(
  castStorageKey,
  JSON.stringify({
    characterIds:
      nextSelectedIds,
    updatedAt:
      new Date().toISOString(),
  })
)

showToast(getDisplayText('chatStoryCharacters.saved'))

window.setTimeout(() => {
  const params = new URLSearchParams({ returnTo })
  if (startNewEpisode) {
    params.set('new', '1')
    params.set('first', '0')
  }
  navigate(`/author/story/${storyId}/chat/editor?${params.toString()}`, { replace: true })
}, 500)
    } catch (error) {
      console.error(
        'SAVE CHAT STORY CHARACTERS ERROR:',
        error
      )

      showToast(
        error instanceof Error
          ? error.message
          : getDisplayText('chatStoryCharacters.failedSaveCharacters')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-soft)] pb-[120px]">
      

      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[76px] z-[220] mx-auto max-w-[320px] rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-center text-[12px] font-normal text-[var(--shadow-text-secondary)] shadow-[0_6px_24px_rgba(15,23,42,0.12)] ring-1 ring-[var(--shadow-border)]"
        >
          {toast}
        </button>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <HelpSheet group={helpGroup} onClose={() => setHelpGroup(null)} />

      <LeadCharacterSheet
  open={leadSheetOpen}
  characters={groupedCharacters.main}
  selectedId={leadDraftId}
  onSelect={setLeadDraftId}
  onClose={() => setLeadSheetOpen(false)}
  onConfirm={confirmLeadCharacter}
/>

      <ImageSourceSheet
        open={sourceOpen}
        onClose={() => setSourceOpen(false)}
        onDevice={chooseDeviceImage}
        onShadowGallery={openShadowGallery}
      />

      

      <CharacterEditor
        open={editorOpen}
        group={activeGroup}
        image={selectedImage}
        nickname={nickname}
        roleGroup={characterGroup}
        chatSide={chatSide}
        editing={Boolean(editingId)}
        onNicknameChange={setNickname}
        onRoleGroupChange={(value) => {
          setCharacterGroup(value)
          if (!editingId) setChatSide(value === 'main' ? 'right' : 'left')
        }}
        onChatSideChange={setChatSide}
        onChangeImage={openImageSourceFromEditor}
        onEditProfile={() => {
          if (!editingId) return

          setEditorOpen(false)

          const profilePath =
  `/author/story/${storyId}/chat/characters/${editingId}/profile`

navigate(
  startNewEpisode
    ? `${profilePath}?new=1`
    : profilePath
)
        }}
        onDelete={deleteCharacter}
        onClose={() => setEditorOpen(false)}
        saving={saving}
        onSave={saveCharacter}
      />

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
  if (window.history.state?.idx > 0) {
    navigate(-1)
    return
  }

  navigate(returnTo, { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('chatStoryCharacters.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 text-center">
  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
    {getDisplayText('chatStoryCharacters.buildYourCast')}
  </h1>
</div>

          <button
  type="button"
  onClick={handleSavePage}
  aria-disabled={saving || pageLoading}
  className={`h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95 ${
    saving || pageLoading ? 'opacity-60' : ''
  }`}
>
  {saving ? getDisplayText('chatStoryCharacters.saving') : getDisplayText('chatStoryCharacters.save')}
</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {pageLoading ? (
          <div className="mb-4 rounded-[18px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-center text-[12px] font-bold text-[var(--shadow-text-secondary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
            {getDisplayText('chatStoryCharacters.loadingCharacters')}
          </div>
        ) : null}

        <section className="hidden rounded-[20px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)] sm:block">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title={getDisplayText('chatStoryCharacters.storyInfo')} />
            <Step number="2" title={getDisplayText('chatStoryCharacters.characters')} active />
            <Step number="3" title={getDisplayText('chatStoryCharacters.chat')} />
            <Step number="4" title={getDisplayText('chatStoryCharacters.publish')} />
          </div>
        </section>

        <LeadCharacterPanel
  character={leadCharacter}
  onChange={openLeadCharacterSheet}
/>

        {ROLE_GROUPS.map((group) => (
  <RoleSection
    key={group.key}
    group={group}
    characters={
      groupedCharacters[group.key]
    }
    selectedCharacterIdSet={
      selectedCharacterIdSet
    }
    onHelp={() =>
      setHelpGroup(group)
    }
    onAdd={() =>
      openAddCharacter(group.key)
    }
    onEdit={openEditCharacter}
    onToggle={
      toggleEpisodeCharacter
    }
    onEditProfile={(character) => {
      const profilePath =
        `/author/story/${storyId}/chat/characters/${character.id}/profile`

      navigate(
        startNewEpisode
          ? `${profilePath}?new=1`
          : profilePath
      )
    }}
  />
))}
      </main>
    </div>
  )
}
