import PublicPostDetailView from '../social/posts/PublicPostDetailView'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getDisplayLanguageId,
  getDisplayText,
  useDisplayTranslation,
} from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ImageDropZone from '../common/ImageDropZone'
import ReaderPostOptionsSheet, {
  ReaderPostDeleteConfirmSheet,
} from './ReaderPostOptionsSheet'
import ReaderPostCommentsModal from './ReaderPostCommentsModal'
import ReaderPostCommentsSection from './ReaderPostCommentsSection'
import ReaderAuthorStylePhotoViewer from './ReaderAuthorStylePhotoViewer'
import EchoShareSheetV2Connected from '../social/EchoShareSheetV2Connected'
import ReactionAction from '../social/reactions/ReactionAction'
import ReactionSummary from '../social/reactions/ReactionSummary'
import {
  ProfessionalSinglePostImage,
} from '../common/ProfessionalPostContent'
import ReaderDiscoverPostText from './ReaderDiscoverPostText'
import {
  deleteSavedPostBySource,
  fetchSavedPostStatus,
  saveSavedPost,
} from '../../services/savedPostsApi'


registerTranslationNamespace('readerPostCard', {
  "en": {
    "failedLoadImage": "Failed to load image",
    "couldNotPrepareImage": "Could not prepare this image",
    "photoTooLargeAfterCompression": "Photo is still too large after compression. Selected: {{selected}} / Limit: {{limit}}.",
    "pleaseLoginFirst": "Please login first",
    "failedUploadPhoto": "Failed to upload photo",
    "uploadNoImageUrl": "Upload completed without an image URL",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m",
    "hoursAgo": "{{count}}h",
    "daysAgo": "{{count}}d",
    "reader": "Reader",
    "openPhotoFullscreen": "Open photo fullscreen",
    "openPhotoNumber": "Open photo {{count}}",
    "readerPost": "Reader Post",
    "readerPostLower": "reader post",
    "sharedContent": "Shared content",
    "story": "Story",
    "episode": "Episode",
    "episodeNumber": "Episode {{count}}",
    "shadowMall": "Shadow Mall",
    "promotion": "Promotion",
    "shadowMallPromotion": "Shadow Mall promotion",
    "authorPage": "Author Page",
    "authorPost": "Author post",
    "post": "Post",
    "removePhoto": "Remove photo",
    "failedUpdateReaction": "Failed to update reaction",
    "onlyImageFiles": "Only image files can be uploaded.",
    "maxPhotos": "You can add up to {{count}} photos per post.",
    "preparingPhotos": "Preparing photos...",
    "photosTooLarge": "Photos are too large. Selected: {{selected}} / Limit: {{limit}}.",
    "couldNotUploadPhotos": "Could not upload these photos.",
    "postTextOrImageRequired": "Post text or image is required.",
    "failedUpdatePost": "Failed to update post",
    "failedDeletePost": "Failed to delete post",
    "legacyEchoEdit": "Delete this old Echo and Echo it again to edit it as a normal post.",
    "failedSaveCaption": "Failed to save caption",
    "captionSaved": "Caption saved.",
    "captionRemoved": "Caption removed.",
    "failedSaveAltText": "Failed to save alt text",
    "altTextSaved": "Alt text saved.",
    "altTextRemoved": "Alt text removed.",
    "postNeedsContentDeleteInstead": "This post needs text or a photo. Delete the post instead.",
    "failedDeletePhoto": "Failed to delete photo",
    "photoDeleted": "Photo deleted.",
    "couldNotDownloadPhoto": "Could not download photo",
    "photoSaved": "Photo saved.",
    "photoOpenedForSaving": "Photo opened for saving.",
    "readerPhoto": "{{name}} photo",
    "photoLinkCopied": "Photo link copied.",
    "failedFollowReader": "Failed to follow reader",
    "removedFromSaved": "Removed from saved.",
    "postSaved": "Post saved.",
    "failedUpdateSavedPost": "Failed to update saved post.",
    "like": "Like",
    "echo": "Echo",
    "follow": "Follow",
    "edited": "Edited",
    "postOptions": "Post options",
    "commentsCount": "{{count}} comments",
    "echoesCount": "{{count}} echoes",
    "sharesCount": "{{count}} shares",
    "comment": "Comment",
    "share": "Share",
    "closeFullscreenPhoto": "Close fullscreen photo",
    "photoOptions": "Photo options",
    "editCaption": "Edit caption",
    "deletePhoto": "Delete photo",
    "saveToPhone": "Save to phone",
    "shareExternal": "Share external",
    "editAltText": "Edit alt text",
    "altTextHelp": "Describe what is shown in this photo for accessibility.",
    "describePhotoPlaceholder": "Describe this photo...",
    "cancel": "Cancel",
    "saving": "Saving...",
    "save": "Save",
    "photoNumber": "Photo {{count}}",
    "captionPlaceholder": "Write a caption for this photo...",
    "deleteThisPhoto": "Delete this photo?",
    "photoDeleteDescription": "This photo will be removed from this Reader post.",
    "deleting": "Deleting...",
    "onlyImagesAllowed": "Only images are allowed, with a maximum of {{count}} photos.",
    "dropPhotosHere": "Drop photos here",
    "closeEditor": "Close editor",
    "editReaderPost": "Edit Reader Post",
    "uploading": "Uploading",
    "onlyMe": "Only me",
    "friends": "Friends",
    "followers": "Followers",
    "public": "Public",
    "shareThoughts": "Share your thoughts...",
    "openGallery": "Open Gallery",
    "photosCount": "{{count}} photos",
    "gallery": "Gallery",
    "delete": "Delete"
  },
  "km": {
    "failedLoadImage": "មិនអាចផ្ទុករូបភាពបានទេ",
    "couldNotPrepareImage": "មិនអាចរៀបចំរូបភាពនេះបានទេ",
    "photoTooLargeAfterCompression": "រូបភាពនៅតែធំពេកបន្ទាប់ពីបង្ហាប់។ បានជ្រើស: {{selected}} / កំណត់: {{limit}}។",
    "pleaseLoginFirst": "សូមចូលគណនីជាមុន",
    "failedUploadPhoto": "មិនអាច Upload រូបភាពបានទេ",
    "uploadNoImageUrl": "Upload រួច ប៉ុន្តែមិនទទួលបាន Image URL",
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទី",
    "hoursAgo": "{{count}} ម៉ោង",
    "daysAgo": "{{count}} ថ្ងៃ",
    "reader": "អ្នកអាន",
    "openPhotoFullscreen": "បើករូបភាពពេញអេក្រង់",
    "openPhotoNumber": "បើករូបភាពទី {{count}}",
    "readerPost": "Reader Post",
    "readerPostLower": "Reader post",
    "sharedContent": "មាតិកាដែលបានចែករំលែក",
    "story": "រឿង",
    "episode": "ភាគ",
    "episodeNumber": "ភាគ {{count}}",
    "shadowMall": "Shadow Mall",
    "promotion": "ប្រម៉ូសិន",
    "shadowMallPromotion": "ប្រម៉ូសិន Shadow Mall",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "authorPost": "Post អ្នកនិពន្ធ",
    "post": "Post",
    "removePhoto": "ដករូបភាព",
    "failedUpdateReaction": "មិនអាច Update Reaction បានទេ",
    "onlyImageFiles": "អាច Upload បានតែឯកសាររូបភាពប៉ុណ្ណោះ។",
    "maxPhotos": "អ្នកអាចបន្ថែមរូបបានអតិបរមា {{count}} សន្លឹកក្នុងមួយ Post។",
    "preparingPhotos": "កំពុងរៀបចំរូបភាព...",
    "photosTooLarge": "រូបភាពធំពេក។ បានជ្រើស: {{selected}} / កំណត់: {{limit}}។",
    "couldNotUploadPhotos": "មិនអាច Upload រូបភាពទាំងនេះបានទេ។",
    "postTextOrImageRequired": "Post ត្រូវមានអត្ថបទ ឬរូបភាព។",
    "failedUpdatePost": "មិនអាច Update Post បានទេ",
    "failedDeletePost": "មិនអាចលុប Post បានទេ",
    "legacyEchoEdit": "សូមលុប Echo ចាស់នេះ ហើយ Echo ម្តងទៀត ដើម្បីកែវាជា Post ធម្មតា។",
    "failedSaveCaption": "មិនអាចរក្សាទុក Caption បានទេ",
    "captionSaved": "បានរក្សាទុក Caption។",
    "captionRemoved": "បានដក Caption។",
    "failedSaveAltText": "មិនអាចរក្សាទុក Alt text បានទេ",
    "altTextSaved": "បានរក្សាទុក Alt text។",
    "altTextRemoved": "បានដក Alt text។",
    "postNeedsContentDeleteInstead": "Post នេះត្រូវមានអត្ថបទ ឬរូបភាព។ សូមលុប Post ជំនួសវិញ។",
    "failedDeletePhoto": "មិនអាចលុបរូបភាពបានទេ",
    "photoDeleted": "បានលុបរូបភាព។",
    "couldNotDownloadPhoto": "មិនអាចទាញយករូបភាពបានទេ",
    "photoSaved": "បានរក្សាទុករូបភាព។",
    "photoOpenedForSaving": "បានបើករូបភាពសម្រាប់រក្សាទុក។",
    "readerPhoto": "រូបភាពរបស់ {{name}}",
    "photoLinkCopied": "បានចម្លង Link រូបភាព។",
    "failedFollowReader": "មិនអាច Follow អ្នកអានបានទេ",
    "removedFromSaved": "បានដកចេញពី Saved។",
    "postSaved": "បានរក្សាទុក Post។",
    "failedUpdateSavedPost": "មិនអាច Update Saved Post បានទេ។",
    "like": "ចូលចិត្ត",
    "echo": "Echo",
    "follow": "Follow",
    "edited": "បានកែ",
    "postOptions": "ជម្រើស Post",
    "commentsCount": "មតិយោបល់ {{count}}",
    "echoesCount": "Echo {{count}}",
    "sharesCount": "ចែករំលែក {{count}}",
    "comment": "មតិយោបល់",
    "share": "ចែករំលែក",
    "closeFullscreenPhoto": "បិទរូបភាពពេញអេក្រង់",
    "photoOptions": "ជម្រើសរូបភាព",
    "editCaption": "កែ Caption",
    "deletePhoto": "លុបរូបភាព",
    "saveToPhone": "រក្សាទុកក្នុងទូរស័ព្ទ",
    "shareExternal": "ចែករំលែកខាងក្រៅ",
    "editAltText": "កែ Alt text",
    "altTextHelp": "ពិពណ៌នាអ្វីដែលមានក្នុងរូបភាពនេះសម្រាប់ Accessibility។",
    "describePhotoPlaceholder": "ពិពណ៌នារូបភាពនេះ...",
    "cancel": "បោះបង់",
    "saving": "កំពុងរក្សាទុក...",
    "save": "រក្សាទុក",
    "photoNumber": "រូបភាពទី {{count}}",
    "captionPlaceholder": "សរសេរ Caption សម្រាប់រូបភាពនេះ...",
    "deleteThisPhoto": "លុបរូបភាពនេះ?",
    "photoDeleteDescription": "រូបភាពនេះនឹងត្រូវដកចេញពី Reader post នេះ។",
    "deleting": "កំពុងលុប...",
    "onlyImagesAllowed": "អនុញ្ញាតតែរូបភាព និងអតិបរមា {{count}} សន្លឹក។",
    "dropPhotosHere": "ទម្លាក់រូបភាពនៅទីនេះ",
    "closeEditor": "បិទ Editor",
    "editReaderPost": "កែ Reader Post",
    "uploading": "កំពុង Upload",
    "onlyMe": "ខ្ញុំប៉ុណ្ណោះ",
    "friends": "មិត្តភក្តិ",
    "followers": "អ្នក Follow",
    "public": "សាធារណៈ",
    "shareThoughts": "ចែករំលែកគំនិតរបស់អ្នក...",
    "openGallery": "បើក Gallery",
    "photosCount": "រូប {{count}} សន្លឹក",
    "gallery": "Gallery",
    "delete": "លុប"
  },
  "zh": {
    "failedLoadImage": "无法加载图片",
    "couldNotPrepareImage": "无法处理此图片",
    "photoTooLargeAfterCompression": "图片压缩后仍然过大。已选择：{{selected}} / 限制：{{limit}}。",
    "pleaseLoginFirst": "请先登录",
    "failedUploadPhoto": "图片上传失败",
    "uploadNoImageUrl": "上传完成，但未返回图片 URL",
    "justNow": "刚刚",
    "minutesAgo": "{{count}} 分钟",
    "hoursAgo": "{{count}} 小时",
    "daysAgo": "{{count}} 天",
    "reader": "读者",
    "openPhotoFullscreen": "全屏打开图片",
    "openPhotoNumber": "打开第 {{count}} 张图片",
    "readerPost": "读者帖子",
    "readerPostLower": "读者帖子",
    "sharedContent": "分享的内容",
    "story": "故事",
    "episode": "章节",
    "episodeNumber": "第 {{count}} 章",
    "shadowMall": "Shadow Mall",
    "promotion": "推广",
    "shadowMallPromotion": "Shadow Mall 推广",
    "authorPage": "作者主页",
    "authorPost": "作者帖子",
    "post": "帖子",
    "removePhoto": "移除图片",
    "failedUpdateReaction": "无法更新反应",
    "onlyImageFiles": "只能上传图片文件。",
    "maxPhotos": "每篇帖子最多可添加 {{count}} 张图片。",
    "preparingPhotos": "正在处理图片...",
    "photosTooLarge": "图片过大。已选择：{{selected}} / 限制：{{limit}}。",
    "couldNotUploadPhotos": "无法上传这些图片。",
    "postTextOrImageRequired": "帖子需要文字或图片。",
    "failedUpdatePost": "无法更新帖子",
    "failedDeletePost": "无法删除帖子",
    "legacyEchoEdit": "请删除这个旧 Echo，然后重新 Echo，才能像普通帖子一样编辑。",
    "failedSaveCaption": "无法保存说明文字",
    "captionSaved": "说明文字已保存。",
    "captionRemoved": "说明文字已移除。",
    "failedSaveAltText": "无法保存替代文本",
    "altTextSaved": "替代文本已保存。",
    "altTextRemoved": "替代文本已移除。",
    "postNeedsContentDeleteInstead": "帖子需要文字或图片。请改为删除帖子。",
    "failedDeletePhoto": "无法删除图片",
    "photoDeleted": "图片已删除。",
    "couldNotDownloadPhoto": "无法下载图片",
    "photoSaved": "图片已保存。",
    "photoOpenedForSaving": "图片已打开，可进行保存。",
    "readerPhoto": "{{name}} 的图片",
    "photoLinkCopied": "图片链接已复制。",
    "failedFollowReader": "无法关注读者",
    "removedFromSaved": "已从收藏中移除。",
    "postSaved": "帖子已收藏。",
    "failedUpdateSavedPost": "无法更新收藏状态。",
    "like": "赞",
    "echo": "Echo",
    "follow": "关注",
    "edited": "已编辑",
    "postOptions": "帖子选项",
    "commentsCount": "{{count}} 条评论",
    "echoesCount": "{{count}} 个 Echo",
    "sharesCount": "{{count}} 次分享",
    "comment": "评论",
    "share": "分享",
    "closeFullscreenPhoto": "关闭全屏图片",
    "photoOptions": "图片选项",
    "editCaption": "编辑说明文字",
    "deletePhoto": "删除图片",
    "saveToPhone": "保存到手机",
    "shareExternal": "外部分享",
    "editAltText": "编辑替代文本",
    "altTextHelp": "为无障碍功能描述此图片中显示的内容。",
    "describePhotoPlaceholder": "描述这张图片...",
    "cancel": "取消",
    "saving": "保存中...",
    "save": "保存",
    "photoNumber": "图片 {{count}}",
    "captionPlaceholder": "为这张图片写说明文字...",
    "deleteThisPhoto": "删除这张图片？",
    "photoDeleteDescription": "此图片将从这篇读者帖子中移除。",
    "deleting": "删除中...",
    "onlyImagesAllowed": "仅允许图片，最多 {{count}} 张。",
    "dropPhotosHere": "将图片拖放到这里",
    "closeEditor": "关闭编辑器",
    "editReaderPost": "编辑读者帖子",
    "uploading": "上传中",
    "onlyMe": "仅自己",
    "friends": "好友",
    "followers": "关注者",
    "public": "公开",
    "shareThoughts": "分享你的想法...",
    "openGallery": "打开相册",
    "photosCount": "{{count}} 张图片",
    "gallery": "相册",
    "delete": "删除"
  },
  "ja": {
    "failedLoadImage": "画像を読み込めませんでした",
    "couldNotPrepareImage": "この画像を処理できませんでした",
    "photoTooLargeAfterCompression": "圧縮後も画像サイズが大きすぎます。選択：{{selected}} / 上限：{{limit}}。",
    "pleaseLoginFirst": "先にログインしてください",
    "failedUploadPhoto": "画像をアップロードできませんでした",
    "uploadNoImageUrl": "アップロードは完了しましたが、画像 URL が返されませんでした",
    "justNow": "たった今",
    "minutesAgo": "{{count}}分",
    "hoursAgo": "{{count}}時間",
    "daysAgo": "{{count}}日",
    "reader": "読者",
    "openPhotoFullscreen": "画像を全画面で開く",
    "openPhotoNumber": "画像 {{count}} を開く",
    "readerPost": "読者投稿",
    "readerPostLower": "読者投稿",
    "sharedContent": "共有コンテンツ",
    "story": "ストーリー",
    "episode": "エピソード",
    "episodeNumber": "エピソード {{count}}",
    "shadowMall": "Shadow Mall",
    "promotion": "プロモーション",
    "shadowMallPromotion": "Shadow Mall プロモーション",
    "authorPage": "作者ページ",
    "authorPost": "作者投稿",
    "post": "投稿",
    "removePhoto": "画像を削除",
    "failedUpdateReaction": "リアクションを更新できませんでした",
    "onlyImageFiles": "画像ファイルのみアップロードできます。",
    "maxPhotos": "1つの投稿に最大 {{count}} 枚の画像を追加できます。",
    "preparingPhotos": "画像を準備中...",
    "photosTooLarge": "画像サイズが大きすぎます。選択：{{selected}} / 上限：{{limit}}。",
    "couldNotUploadPhotos": "これらの画像をアップロードできませんでした。",
    "postTextOrImageRequired": "投稿にはテキストまたは画像が必要です。",
    "failedUpdatePost": "投稿を更新できませんでした",
    "failedDeletePost": "投稿を削除できませんでした",
    "legacyEchoEdit": "この古い Echo を削除してから再度 Echo すると、通常の投稿として編集できます。",
    "failedSaveCaption": "キャプションを保存できませんでした",
    "captionSaved": "キャプションを保存しました。",
    "captionRemoved": "キャプションを削除しました。",
    "failedSaveAltText": "代替テキストを保存できませんでした",
    "altTextSaved": "代替テキストを保存しました。",
    "altTextRemoved": "代替テキストを削除しました。",
    "postNeedsContentDeleteInstead": "投稿にはテキストまたは画像が必要です。代わりに投稿を削除してください。",
    "failedDeletePhoto": "画像を削除できませんでした",
    "photoDeleted": "画像を削除しました。",
    "couldNotDownloadPhoto": "画像をダウンロードできませんでした",
    "photoSaved": "画像を保存しました。",
    "photoOpenedForSaving": "保存用に画像を開きました。",
    "readerPhoto": "{{name}} の画像",
    "photoLinkCopied": "画像リンクをコピーしました。",
    "failedFollowReader": "読者をフォローできませんでした",
    "removedFromSaved": "保存済みから削除しました。",
    "postSaved": "投稿を保存しました。",
    "failedUpdateSavedPost": "保存済み投稿を更新できませんでした。",
    "like": "いいね",
    "echo": "Echo",
    "follow": "フォロー",
    "edited": "編集済み",
    "postOptions": "投稿オプション",
    "commentsCount": "コメント {{count}} 件",
    "echoesCount": "Echo {{count}} 件",
    "sharesCount": "シェア {{count}} 件",
    "comment": "コメント",
    "share": "シェア",
    "closeFullscreenPhoto": "全画面画像を閉じる",
    "photoOptions": "画像オプション",
    "editCaption": "キャプションを編集",
    "deletePhoto": "画像を削除",
    "saveToPhone": "端末に保存",
    "shareExternal": "外部に共有",
    "editAltText": "代替テキストを編集",
    "altTextHelp": "アクセシビリティのため、この画像に写っている内容を説明してください。",
    "describePhotoPlaceholder": "この画像を説明...",
    "cancel": "キャンセル",
    "saving": "保存中...",
    "save": "保存",
    "photoNumber": "画像 {{count}}",
    "captionPlaceholder": "この画像のキャプションを書く...",
    "deleteThisPhoto": "この画像を削除しますか？",
    "photoDeleteDescription": "この画像は読者投稿から削除されます。",
    "deleting": "削除中...",
    "onlyImagesAllowed": "画像のみ許可されています。最大 {{count}} 枚です。",
    "dropPhotosHere": "ここに画像をドロップ",
    "closeEditor": "エディターを閉じる",
    "editReaderPost": "読者投稿を編集",
    "uploading": "アップロード中",
    "onlyMe": "自分のみ",
    "friends": "友達",
    "followers": "フォロワー",
    "public": "公開",
    "shareThoughts": "あなたの考えを共有...",
    "openGallery": "ギャラリーを開く",
    "photosCount": "{{count}}枚の画像",
    "gallery": "ギャラリー",
    "delete": "削除"
  },
  "ko": {
    "failedLoadImage": "이미지를 불러오지 못했습니다",
    "couldNotPrepareImage": "이 이미지를 처리할 수 없습니다",
    "photoTooLargeAfterCompression": "압축 후에도 이미지가 너무 큽니다. 선택: {{selected}} / 제한: {{limit}}.",
    "pleaseLoginFirst": "먼저 로그인해 주세요",
    "failedUploadPhoto": "이미지를 업로드하지 못했습니다",
    "uploadNoImageUrl": "업로드는 완료되었지만 이미지 URL이 없습니다",
    "justNow": "방금",
    "minutesAgo": "{{count}}분",
    "hoursAgo": "{{count}}시간",
    "daysAgo": "{{count}}일",
    "reader": "독자",
    "openPhotoFullscreen": "사진 전체 화면으로 열기",
    "openPhotoNumber": "사진 {{count}} 열기",
    "readerPost": "독자 게시물",
    "readerPostLower": "독자 게시물",
    "sharedContent": "공유 콘텐츠",
    "story": "스토리",
    "episode": "에피소드",
    "episodeNumber": "에피소드 {{count}}",
    "shadowMall": "Shadow Mall",
    "promotion": "프로모션",
    "shadowMallPromotion": "Shadow Mall 프로모션",
    "authorPage": "작가 페이지",
    "authorPost": "작가 게시물",
    "post": "게시물",
    "removePhoto": "사진 삭제",
    "failedUpdateReaction": "반응을 업데이트하지 못했습니다",
    "onlyImageFiles": "이미지 파일만 업로드할 수 있습니다.",
    "maxPhotos": "게시물당 최대 {{count}}장의 이미지를 추가할 수 있습니다.",
    "preparingPhotos": "이미지 준비 중...",
    "photosTooLarge": "이미지가 너무 큽니다. 선택: {{selected}} / 제한: {{limit}}.",
    "couldNotUploadPhotos": "이 이미지들을 업로드하지 못했습니다.",
    "postTextOrImageRequired": "게시물에는 텍스트나 이미지가 필요합니다.",
    "failedUpdatePost": "게시물을 업데이트하지 못했습니다",
    "failedDeletePost": "게시물을 삭제하지 못했습니다",
    "legacyEchoEdit": "이 오래된 Echo를 삭제한 뒤 다시 Echo하면 일반 게시물처럼 편집할 수 있습니다.",
    "failedSaveCaption": "캡션을 저장하지 못했습니다",
    "captionSaved": "캡션을 저장했습니다.",
    "captionRemoved": "캡션을 삭제했습니다.",
    "failedSaveAltText": "대체 텍스트를 저장하지 못했습니다",
    "altTextSaved": "대체 텍스트를 저장했습니다.",
    "altTextRemoved": "대체 텍스트를 삭제했습니다.",
    "postNeedsContentDeleteInstead": "게시물에는 텍스트나 사진이 필요합니다. 대신 게시물을 삭제해 주세요.",
    "failedDeletePhoto": "사진을 삭제하지 못했습니다",
    "photoDeleted": "사진이 삭제되었습니다.",
    "couldNotDownloadPhoto": "사진을 다운로드하지 못했습니다",
    "photoSaved": "사진이 저장되었습니다.",
    "photoOpenedForSaving": "저장을 위해 사진을 열었습니다.",
    "readerPhoto": "{{name}}님의 사진",
    "photoLinkCopied": "사진 링크가 복사되었습니다.",
    "failedFollowReader": "독자를 팔로우하지 못했습니다",
    "removedFromSaved": "저장됨에서 삭제했습니다.",
    "postSaved": "게시물을 저장했습니다.",
    "failedUpdateSavedPost": "저장된 게시물을 업데이트하지 못했습니다.",
    "like": "좋아요",
    "echo": "Echo",
    "follow": "팔로우",
    "edited": "수정됨",
    "postOptions": "게시물 옵션",
    "commentsCount": "댓글 {{count}}개",
    "echoesCount": "Echo {{count}}개",
    "sharesCount": "공유 {{count}}회",
    "comment": "댓글",
    "share": "공유",
    "closeFullscreenPhoto": "전체 화면 사진 닫기",
    "photoOptions": "사진 옵션",
    "editCaption": "캡션 편집",
    "deletePhoto": "사진 삭제",
    "saveToPhone": "휴대폰에 저장",
    "shareExternal": "외부 공유",
    "editAltText": "대체 텍스트 편집",
    "altTextHelp": "접근성을 위해 이 사진에 무엇이 보이는지 설명해 주세요.",
    "describePhotoPlaceholder": "이 사진을 설명하세요...",
    "cancel": "취소",
    "saving": "저장 중...",
    "save": "저장",
    "photoNumber": "사진 {{count}}",
    "captionPlaceholder": "이 사진의 캡션을 작성하세요...",
    "deleteThisPhoto": "이 사진을 삭제할까요?",
    "photoDeleteDescription": "이 사진은 독자 게시물에서 제거됩니다.",
    "deleting": "삭제 중...",
    "onlyImagesAllowed": "이미지만 허용되며 최대 {{count}}장입니다.",
    "dropPhotosHere": "여기에 사진을 놓으세요",
    "closeEditor": "편집기 닫기",
    "editReaderPost": "독자 게시물 편집",
    "uploading": "업로드 중",
    "onlyMe": "나만 보기",
    "friends": "친구",
    "followers": "팔로워",
    "public": "전체 공개",
    "shareThoughts": "생각을 공유해 보세요...",
    "openGallery": "갤러리 열기",
    "photosCount": "사진 {{count}}장",
    "gallery": "갤러리",
    "delete": "삭제"
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_POST_LENGTH = 10000
const MAX_POST_PHOTOS = 5
const MAX_PHOTO_CAPTION_LENGTH = 2000
const MAX_PHOTO_ALT_TEXT_LENGTH = 500
const MAX_POST_IMAGE_BYTES = 800 * 1024
const HARD_MAX_IMAGE_BYTES = 220 * 1024
const MAX_IMAGE_WIDTH = 1080
const MAX_IMAGE_HEIGHT = 1350
const TARGET_IMAGE_BYTES = 150 * 1024
const LEGACY_PHOTO_VIEWER_ENABLED = false
const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function formatBytes(bytes) {
  const value = Number(bytes || 0)

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return '0KB'
  }

  if (value >= 1024 * 1024) {
    return `${(
      value /
      1024 /
      1024
    ).toFixed(1)}MB`
  }

  return `${Math.max(
    1,
    Math.round(value / 1024)
  )}KB`
}

function loadImageFromFile(file) {
  return new Promise(
    (resolve, reject) => {
      const image = new Image()
      const url =
        URL.createObjectURL(file)

      image.onload = () => {
        URL.revokeObjectURL(url)
        resolve(image)
      }

      image.onerror = () => {
        URL.revokeObjectURL(url)
        reject(
          new Error(
            getDisplayText('readerPostCard.failedLoadImage')
          )
        )
      }

      image.src = url
    }
  )
}

function canvasToBlob(
  canvas,
  type,
  quality
) {
  return new Promise((resolve) =>
    canvas.toBlob(
      resolve,
      type,
      quality
    )
  )
}

async function compressImageFile(file) {
  if (
    !file?.type?.startsWith(
      'image/'
    )
  ) {
    return null
  }

  const image =
    await loadImageFromFile(file)
  const scale = Math.min(
    1,
    MAX_IMAGE_WIDTH / image.width,
    MAX_IMAGE_HEIGHT / image.height
  )
  let width = Math.max(
    1,
    Math.round(image.width * scale)
  )
  let height = Math.max(
    1,
    Math.round(image.height * scale)
  )
  let quality = 0.82
  let blob = null

  for (
    let attempt = 0;
    attempt < 10;
    attempt += 1
  ) {
    const canvas =
      document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context =
      canvas.getContext('2d')

    if (!context) {
      throw new Error(
        getDisplayText('readerPostCard.couldNotPrepareImage')
      )
    }

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    )

    blob = await canvasToBlob(
      canvas,
      'image/webp',
      quality
    )

    if (
      blob &&
      blob.size <=
        TARGET_IMAGE_BYTES
    ) {
      break
    }

    if (
      blob &&
      blob.size <=
        HARD_MAX_IMAGE_BYTES &&
      quality <= 0.68
    ) {
      break
    }

    if (quality > 0.62) {
      quality = Math.max(
        0.62,
        quality - 0.07
      )
    } else {
      width = Math.max(
        1,
        Math.round(width * 0.9)
      )
      height = Math.max(
        1,
        Math.round(height * 0.9)
      )
    }
  }

  if (!blob) return file

  if (
    blob.size >
    HARD_MAX_IMAGE_BYTES
  ) {
    throw new Error(
      getDisplayText(
        'readerPostCard.photoTooLargeAfterCompression',
        {
          selected: formatBytes(blob.size),
          limit: formatBytes(
            HARD_MAX_IMAGE_BYTES
          ),
        }
      )
    )
  }

  return new File(
    [blob],
    file.name.replace(
      /\.[^.]+$/,
      '.webp'
    ),
    {
      type: 'image/webp',
      lastModified: Date.now(),
    }
  )
}

async function uploadReaderPostImage(
  file
) {
  const token = getAuthToken()

  if (!token) {
    throw new Error(
      getDisplayText('readerPostCard.pleaseLoginFirst')
    )
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append(
    'folder',
    'reader_post_image'
  )

  const response = await fetch(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      body: formData,
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
        getDisplayText('readerPostCard.failedUploadPhoto')
    )
  }

  const imageUrl =
    data.image_url ||
    data.imageUrl ||
    ''

  if (!imageUrl) {
    throw new Error(
      getDisplayText('readerPostCard.uploadNoImageUrl')
    )
  }

  return imageUrl
}

const POST_TOKEN_PATTERN = /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN = /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN = /^#[\p{L}\p{N}\p{M}_]+$/u
function renderPostTextWithLinks(text) {
  return String(text || '').split(POST_TOKEN_PATTERN).map((part, index) => {
    if (POST_URL_ONLY_PATTERN.test(part)) return <a key={`${part}-${index}`} href={part} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="break-all text-[#1877f2]">{part}</a>
    if (POST_HASHTAG_ONLY_PATTERN.test(part)) return <a key={`${part}-${index}`} href={`/discover/search?q=${encodeURIComponent(part)}&type=posts`} onClick={(e) => e.stopPropagation()} className="text-[#1877f2]">{part}</a>
    return part
  })
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

function formatPostTime(value) {
  const timestamp =
    new Date(value || 0).getTime()

  if (!timestamp) {
    return getDisplayText(
      'readerPostCard.justNow'
    )
  }

  const difference = Math.max(
    0,
    Date.now() - timestamp
  )
  const minutes = Math.floor(
    difference / 60000
  )
  const hours = Math.floor(
    minutes / 60
  )
  const days = Math.floor(
    hours / 24
  )

  if (minutes < 1) {
    return getDisplayText(
      'readerPostCard.justNow'
    )
  }
  if (minutes < 60) {
    return getDisplayText(
      'readerPostCard.minutesAgo',
      { count: minutes }
    )
  }
  if (hours < 24) {
    return getDisplayText(
      'readerPostCard.hoursAgo',
      { count: hours }
    )
  }
  if (days < 7) {
    return getDisplayText(
      'readerPostCard.daysAgo',
      { count: days }
    )
  }

  const language =
    getDisplayLanguageId()

  return new Intl.DateTimeFormat(
    DISPLAY_LOCALES[language] ||
      DISPLAY_LOCALES.en,
    {
      month: 'short',
      day: 'numeric',
      year:
        new Date().getFullYear() !==
        new Date(timestamp).getFullYear()
          ? 'numeric'
          : undefined,
    }
  ).format(new Date(timestamp))
}

function getVisibilityIcon(value) {
  if (
    value === 'only_me' ||
    value === 'private'
  ) {
    return 'fa-solid fa-lock'
  }

  if (value === 'friends') {
    return 'fa-solid fa-user-group'
  }

  if (value === 'followers') {
    return 'fa-solid fa-users'
  }

  return 'fa-solid fa-earth-americas'
}

function ReaderAvatar({ user }) {
  const name = user?.name || getDisplayText('readerPostCard.reader')

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] dark:bg-[#f8fafc] dark:text-[#0d0f16] text-[14px] font-semibold text-white">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

function ReaderPostImages({
  imageUrls,
  photoMetadata,
  onImageClick,
  photoPostView = false,
  selectedPhotoIndex = 0,
}) {
  const images = Array.isArray(
    imageUrls
  )
    ? imageUrls
        .filter(
          (url) =>
            typeof url === 'string' &&
            url.trim()
        )
        .slice(0, 5)
    : []

  if (!images.length) {
    return null
  }

  const metadata = Array.isArray(
    photoMetadata
  )
    ? photoMetadata
    : []

  function getPhotoAltText(
    imageUrl,
    index
  ) {
    const item =
      metadata.find(
        (entry) =>
          String(entry?.url || '') ===
          String(imageUrl || '')
      ) ||
      metadata[index] ||
      {}

    return String(
      item?.alt_text ??
        item?.alt ??
        ''
    )
  }

  const safeSelectedIndex = Math.min(
    images.length - 1,
    Math.max(
      0,
      Number.isFinite(
        Number(selectedPhotoIndex)
      )
        ? Math.floor(
            Number(selectedPhotoIndex)
          )
        : 0
    )
  )

  if (photoPostView) {
    const selectedImage =
      images[safeSelectedIndex]

    return (
      <button
        type="button"
        onClick={() =>
          onImageClick?.(
            safeSelectedIndex
          )
        }
        className="block w-full bg-[#f3f4f6] dark:bg-[#202331]"
        aria-label={getDisplayText('readerPostCard.openPhotoFullscreen')}
      >
        <img
          src={selectedImage}
          alt={getPhotoAltText(
            selectedImage,
            safeSelectedIndex
          )}
          loading="eager"
          decoding="async"
          className="max-h-[72dvh] min-h-[260px] w-full object-contain"
        />
      </button>
    )
  }

  if (images.length === 1) {
    return (
      <ProfessionalSinglePostImage
        src={images[0]}
        alt={getPhotoAltText(
          images[0],
          0
        )}
        onClick={
          onImageClick
            ? () => onImageClick(0)
            : undefined
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1 overflow-hidden bg-white dark:bg-[#171923]">
      {images.map(
        (imageUrl, index) => {
          const isWideLastImage =
            images.length % 2 === 1 &&
            index ===
              images.length - 1

          return (
            <button
              type="button"
              key={`${imageUrl}-${index}`}
              onClick={() =>
                onImageClick?.(index)
              }
              className={
                isWideLastImage
                  ? 'col-span-2 aspect-[2/1] bg-[#f3f4f6] dark:bg-[#202331]'
                  : 'aspect-square bg-[#f3f4f6] dark:bg-[#202331]'
              }
              aria-label={getDisplayText(
                'readerPostCard.openPhotoNumber',
                { count: index + 1 }
              )}
            >
              <img
                src={imageUrl}
                alt={getPhotoAltText(
                  imageUrl,
                  index
                )}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          )
        }
      )}
    </div>
  )
}

function EchoPostPreviewImages({
  imageUrls,
  alt = '',
}) {
  const images = Array.isArray(
    imageUrls
  )
    ? imageUrls
        .filter(
          (url) =>
            typeof url === 'string' &&
            url.trim()
        )
        .slice(0, 5)
    : []

  if (!images.length) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-[#f3f4f6] dark:bg-[#202331] text-[#98a2b3] dark:text-white/40">
        <i className="fa-regular fa-image text-[28px]" />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="min-h-0 overflow-hidden bg-[#f3f4f6] dark:bg-[#202331]">
        <img
          src={images[0]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid min-h-0 grid-cols-2 gap-[2px] bg-white dark:bg-[#171923]">
        {images.map((imageUrl) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full min-h-0 w-full object-cover"
          />
        ))}
      </div>
    )
  }

  if (images.length === 3) {
    return (
      <div className="grid min-h-0 grid-cols-2 gap-[2px] bg-white dark:bg-[#171923]">
        <img
          src={images[0]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full min-h-0 w-full object-cover"
        />

        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {images.slice(1).map(
            (imageUrl) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-full min-h-0 w-full object-cover"
              />
            )
          )}
        </div>
      </div>
    )
  }

  const visibleImages = images.slice(0, 4)
  const hiddenCount = Math.max(
    0,
    images.length - 4
  )

  return (
    <div className="grid min-h-0 grid-cols-2 grid-rows-2 gap-[2px] bg-white dark:bg-[#171923]">
      {visibleImages.map(
        (imageUrl, index) => (
          <div
            key={imageUrl}
            className="relative min-h-0 overflow-hidden"
          >
            <img
              src={imageUrl}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-full min-h-0 w-full object-cover"
            />

            {index === 3 &&
            hiddenCount > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[22px] font-semibold text-white">
                +{hiddenCount}
              </div>
            ) : null}
          </div>
        )
      )}
    </div>
  )
}




function ReaderEchoMenuItem({
  icon,
  title,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left active:bg-black/[0.04] dark:active:bg-white/[0.06]"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center ${
          danger
            ? 'text-[#e5484d]'
            : 'text-[#111827] dark:text-[#f8fafc]'
        }`}
      >
        <i className={`${icon} text-[17px]`} />
      </span>

      <span
        className={`text-[14px] font-normal ${
          danger
            ? 'text-[#e5484d]'
            : 'text-[#111827] dark:text-[#f8fafc]'
        }`}
      >
        {title}
      </span>
    </button>
  )
}

function resolveReaderPostEchoSource(
  post,
  user
) {
  const source = post?.source || {}
  const sourceType = String(
  post?.source_type || post?.echo_type || source?.type ||
  (post?.source_episode?.id ? 'episode' :
    post?.source_story?.id ? 'story' : '')
)
  .trim().toLowerCase()
  .replaceAll('-', '_')
  const sourceId = String(
    post?.source_id ||
      source?.id ||
      ''
  ).trim()

  const useOriginalSource =
    Boolean(post?.is_echo) &&
    Boolean(sourceType) &&
    Boolean(sourceId)

  if (!useOriginalSource) {
    const username = String(
      user?.username || ''
    ).trim()

    return {
      type: 'reader_post',
      id: post?.id,
      name:
        user?.name ||
        username ||
        getDisplayText('readerPostCard.reader'),
      avatarUrl:
        user?.avatar_url || '',
      content:
        post?.content ||
        getDisplayText('readerPostCard.readerPost'),
      imageUrl:
        Array.isArray(
          post?.image_urls
        )
          ? post.image_urls[0] || ''
          : '',
      label: getDisplayText('readerPostCard.readerPostLower'),
      shareUrl:
        `${window.location.origin}${
          username
            ? `/profile?username=${encodeURIComponent(
                username
              )}`
            : '/profile'
        }#reader-post-${post?.id || ''}`,
    }
  }

  const owner =
    source?.owner ||
    post?.source_author_post
      ?.author_page ||
    post?.source_reader_post?.user ||
    post?.source_story?.author_page ||
    {}

  const sourceName =
    source?.name ||
    post?.source_story?.title ||
    post?.source_episode?.title ||
    owner?.page_name ||
    owner?.name ||
    getDisplayText('readerPostCard.sharedContent')

  const sourcePath = String(
    post?.source_url ||
      source?.url ||
      ''
  ).trim()

  const shareUrl = sourcePath
    ? /^https?:\/\//i.test(sourcePath)
      ? sourcePath
      : `${window.location.origin}${sourcePath}`
    : window.location.href

  return {
    type: sourceType,
    id: sourceId,
    name: sourceName,
    avatarUrl:
      owner?.avatar_url ||
      owner?.profile_image_url ||
      '',
    content:
      source?.content ||
      post?.source_episode?.title ||
      post?.source_author_post
        ?.content ||
      post?.source_reader_post
        ?.content ||
      sourceName,
    imageUrl:
      source?.image_url ||
      source?.image_urls?.[0] ||
      post?.source_story
        ?.landscape_thumbnail_url ||
      post?.source_story?.cover_url ||
      post?.source_episode?.cover_url ||
      post?.source_author_post
        ?.image_urls?.[0] ||
      post?.source_reader_post
        ?.image_urls?.[0] ||
      '',
    label:
      source?.label ||
      (sourceType === 'reader_post'
        ? getDisplayText(
            'readerPostCard.readerPostLower'
          )
        : sourceType === 'author_post'
          ? getDisplayText(
              'readerPostCard.authorPost'
            )
          : sourceType === 'story'
            ? getDisplayText(
                'readerPostCard.story'
              )
            : sourceType === 'episode'
              ? getDisplayText(
                  'readerPostCard.episode'
                )
              : sourceType.replaceAll(
                  '_',
                  ' '
                )),
    shareUrl,
  }
}

function ReaderEchoSourceBlock({ post }) {
  const navigate = useNavigate()
  const location = useLocation()
  useDisplayTranslation()
  const source = post?.source || {}
  const story = post?.source_story || {}
  const episode = post?.source_episode || {}
  const readerPost =
    post?.source_reader_post || {}
  const authorPost =
    post?.source_author_post || {}
  const sourceType = String(
  post?.source_type || post?.echo_type || source?.type ||
  (post?.source_episode?.id ? 'episode' :
    post?.source_story?.id ? 'story' : '')
)
  .trim().toLowerCase()
  .replaceAll('-', '_')
  const sourceOwner =
    source?.owner ||
    readerPost?.user ||
    authorPost?.author_page ||
    story?.author_page ||
    {}
  const sourceUrl =
    post?.source_url ||
    source?.url ||
    (sourceType === 'episode' &&
    story?.id &&
    episode?.id
      ? `/story/${story.id}/episode/${episode.id}`
      : sourceType === 'story' && story?.id
        ? `/story/${story.id}`
        : sourceType === 'reader_post' &&
            readerPost?.id
          ? readerPost?.user?.username
            ? `/profile?username=${encodeURIComponent(
                readerPost.user.username
              )}#reader-post-${readerPost.id}`
            : `/profile#reader-post-${readerPost.id}`
          : sourceType === 'author_post' &&
              authorPost?.author_page?.page_username
            ? `/author/page/${encodeURIComponent(
                authorPost.author_page
                  .page_username
              )}?post=${encodeURIComponent(
                authorPost.id || ''
              )}`
            : '')

  function openSource() {
    if (sourceUrl) {
      navigate(sourceUrl)
    }
  }

  function handleKeyDown(event) {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      openSource()
    }
  }

  if (
    sourceType === 'story' ||
    sourceType === 'episode'
  ) {
    const imageCandidates = [
      ...(Array.isArray(source?.image_urls)
        ? source.image_urls
        : []),
      source?.image_url,
      story?.landscape_thumbnail_url,
      story?.cover_url,
      episode?.cover_url,
    ].filter(Boolean)
    const coverUrl = imageCandidates[0] || ''
    const sourceLabel =
      sourceType === 'episode'
        ? getDisplayText(
            'readerPostCard.episode'
          )
        : getDisplayText(
            'readerPostCard.story'
          )
    const placeholderIcon =
      sourceType === 'episode'
        ? 'fa-solid fa-book-open-reader'
        : 'fa-solid fa-book-open'
    const sourceTitle =
      story?.title ||
      source?.name ||
      getDisplayText('readerPostCard.story')
    const sourceSummary =
      sourceType === 'episode'
        ? episode?.title ||
          source?.content ||
          getDisplayText(
            'readerPostCard.episodeNumber',
            {
              count: Number(
                episode?.episode_number || 0
              ),
            }
          )
        : sourceOwner?.page_name ||
          sourceOwner?.name ||
          story?.main_genre ||
          getDisplayText('readerPostCard.story')
    const sourceDetail =
      sourceType === 'episode'
        ? sourceOwner?.page_name ||
          story?.main_genre ||
          ''
        : story?.main_genre || ''

    return (
      <button
        type="button"
        onClick={openSource}
        disabled={!sourceUrl}
        className="mx-4 mb-4 block w-[calc(100%-2rem)] overflow-hidden rounded-[10px] bg-[#f7f7fa] dark:bg-[#1c1f2b] text-left ring-1 ring-black/10 dark:ring-white/10 active:scale-[0.995] disabled:cursor-default"
      >
        {coverUrl ? (
          <div className="aspect-video w-full overflow-hidden bg-[#eceef2] dark:bg-[#1c1f2b]">
            <img
              src={coverUrl}
              alt={sourceTitle}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-[#111827] via-[#312e81] to-[#7c3aed]">
            <i
              className={`${placeholderIcon} text-[30px] text-white/90`}
            />
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3] dark:text-white/40">
              {sourceLabel}
            </div>

            <div className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-[#111827] dark:text-[#f8fafc]">
              {sourceTitle}
            </div>

            {sourceSummary ? (
              <div className="mt-1 line-clamp-2 text-[12px] font-normal leading-5 text-[#667085] dark:text-white/60">
                {sourceSummary}
              </div>
            ) : null}

            {sourceDetail &&
            sourceDetail !== sourceSummary ? (
              <div className="mt-1 text-[11px] font-normal text-[#98a2b3] dark:text-white/40">
                {sourceDetail}
              </div>
            ) : null}
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#171923] text-[#111827] dark:text-[#f8fafc] shadow-sm ring-1 ring-black/5 dark:ring-white/10">
            <i className="fa-solid fa-chevron-right text-[12px]" />
          </div>
        </div>
      </button>
    )
  }

  if (
    sourceType ===
    'shadow_mall_promotion'
  ) {
    const promotion =
      source?.promotion || {}
    const imageUrl =
      promotion.image_url ||
      source?.image_url ||
      source?.image_urls?.[0] ||
      ''
    const sponsor =
      promotion.sponsor ||
      source?.owner?.name ||
      source?.name ||
      getDisplayText('readerPostCard.shadowMall')
    const title =
      promotion.title ||
      source?.name ||
      getDisplayText('readerPostCard.promotion')
    const description =
      promotion.description ||
      source?.content ||
      ''

    return (
      <button
        type="button"
        onClick={openSource}
        disabled={!sourceUrl}
        className="mx-4 mb-4 block w-[calc(100%-2rem)] overflow-hidden rounded-[10px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#171923] text-left active:scale-[0.995] disabled:cursor-default"
      >
        {imageUrl ? (
          <div className="aspect-video w-full overflow-hidden bg-[#f3f4f6] dark:bg-[#202331]">
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b5cf6]">
            {getDisplayText('readerPostCard.shadowMallPromotion')}
          </div>

          <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-[#667085] dark:text-white/60">
            {sponsor}
          </div>

          <div className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-[#111827] dark:text-[#f8fafc]">
            {title}
          </div>

          {description ? (
            <p className="mt-2 line-clamp-3 text-[12px] font-normal leading-5 text-[#667085] dark:text-white/60">
              {description}
            </p>
          ) : null}
        </div>
      </button>
    )
  }

  const previewUser =
    sourceType === 'author_post'
      ? {
          name:
            authorPost?.author_page
              ?.page_name ||
            source?.name ||
            getDisplayText('readerPostCard.authorPage'),
          avatar_url:
            authorPost?.author_page
              ?.avatar_url ||
            authorPost?.author_page
              ?.profile_image_url ||
            authorPost?.author_page
              ?.profile_picture_url ||
            authorPost?.author_page
              ?.page_avatar_url ||
            '',
        }
      : {
          name:
            readerPost?.user?.name ||
            readerPost?.user?.username ||
            source?.name ||
            getDisplayText('readerPostCard.reader'),
          avatar_url:
            readerPost?.user
              ?.avatar_url || '',
        }

  const previewTime =
    sourceType === 'author_post'
      ? authorPost?.created_at ||
        source?.created_at ||
        ''
      : readerPost?.created_at ||
        readerPost?.publish_at ||
        source?.created_at ||
        ''

  const previewVisibility =
    sourceType === 'author_post'
      ? 'public'
      : readerPost?.visibility || 'public'

  const previewText = String(
    sourceType === 'author_post'
      ? authorPost?.content ||
          source?.content ||
          ''
      : readerPost?.content ||
          source?.content ||
          ''
  ).trim()

  const previewImages =
    sourceType === 'author_post'
      ? Array.isArray(
          authorPost?.image_urls
        )
        ? authorPost.image_urls
        : Array.isArray(source?.image_urls)
          ? source.image_urls
          : source?.image_url
            ? [source.image_url]
            : []
      : Array.isArray(
          readerPost?.image_urls
        )
        ? readerPost.image_urls
        : Array.isArray(source?.image_urls)
          ? source.image_urls
          : source?.image_url
            ? [source.image_url]
            : []

  return (
    <div
      role="button"
      tabIndex={sourceUrl ? 0 : -1}
      onClick={openSource}
      onKeyDown={handleKeyDown}
      className="mx-4 mb-4 grid aspect-square w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[10px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#171923] text-left active:scale-[0.995]"
    >
      <div className="min-w-0 bg-white dark:bg-[#171923]">
        <div className="flex items-start gap-2.5 px-3.5 pb-2.5 pt-3.5">
          <ReaderAvatar user={previewUser} />

          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[14px] font-semibold text-[#111827] dark:text-[#f8fafc]">
              {previewUser.name || getDisplayText('readerPostCard.post')}
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400 dark:text-white/40">
              <span>
                {formatPostTime(previewTime)}
              </span>
              <span>·</span>
              <i
                className={`${getVisibilityIcon(previewVisibility)} text-[10px]`}
              />
            </div>
          </div>
        </div>

        {previewText ? (
          <div className="px-3.5 pb-3">
            <p className="line-clamp-3 whitespace-pre-wrap break-words text-[14px] font-normal leading-5 text-[#111827] dark:text-[#f8fafc]">
              {renderPostTextWithLinks(
                previewText
              )}
            </p>
          </div>
        ) : null}
      </div>

      <EchoPostPreviewImages
        imageUrls={previewImages}
        alt={previewUser.name || getDisplayText('readerPostCard.post')}
      />
    </div>
  )
}



function EditorAvatar({ user }) {
  const name = user?.name || getDisplayText('readerPostCard.reader')

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] dark:bg-[#202331] ring-1 ring-black/5 dark:ring-white/10">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-[16px] font-semibold text-[#111827] dark:text-[#f8fafc]">
          {name
            .slice(0, 1)
            .toUpperCase()}
        </span>
      )}
    </span>
  )
}

function EditImagePreview({
  imageUrls,
  onRemove,
}) {
  if (!imageUrls.length) {
    return null
  }

  if (imageUrls.length === 1) {
    return (
      <div className="mx-[-16px] mt-4 bg-white dark:bg-[#171923]">
        <div className="relative flex min-h-[260px] items-center justify-center bg-white dark:bg-[#171923]">
          <img
            src={imageUrls[0]}
            alt=""
            className="max-h-[560px] w-full object-contain"
          />

          <button
            type="button"
            onClick={() =>
              onRemove(imageUrls[0])
            }
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
            aria-label={getDisplayText('readerPostCard.removePhoto')}
          >
            <i className="fa-solid fa-xmark text-[12px]" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden rounded-[16px]">
      {imageUrls.map(
        (imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            className="relative aspect-square bg-[#f3f4f6] dark:bg-[#202331]"
          >
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                onRemove(imageUrl)
              }
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white"
              aria-label={getDisplayText('readerPostCard.removePhoto')}
            >
              <i className="fa-solid fa-xmark text-[11px]" />
            </button>
          </div>
        )
      )}
    </div>
  )
}

function StandardReaderPostCard({
  onFullPostClose,
  post,
  onUpdated,
  onDeleted,
  onHidden,
  onFollowChanged,
  fullPostView = false,
  photoPostView = false,
  selectedPhotoIndex = 0,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, t } = useDisplayTranslation()
  const reactionMessageTimerRef =
    useRef(null)
  const editFileInputRef =
    useRef(null)
  const profileNavigationLockRef =
    useRef(false)

  const storedUser = useMemo(
    () => getStoredUser(),
    []
  )

  const [menuOpen, setMenuOpen] =
    useState(false)
  const [deleteOpen, setDeleteOpen] =
    useState(false)
  const [editorOpen, setEditorOpen] =
    useState(false)
  const [commentOpen, setCommentOpen] =
    useState(false)
  const [echoOpen, setEchoOpen] =
    useState(false)
  const [content, setContent] =
    useState(post?.content || '')
  const [
    editImageUrls,
    setEditImageUrls,
  ] = useState([])
  const [
    uploadingImages,
    setUploadingImages,
  ] = useState(false)
  const [saving, setSaving] =
    useState(false)
  const [deleting, setDeleting] =
    useState(false)
  const [message, setMessage] =
    useState('')
  
  const [
    reactionBusy,
    setReactionBusy,
  ] = useState(false)
  const [
    reactionType,
    setReactionType,
  ] = useState(
    post?.my_reaction || null
  )
  const [
    reactionCount,
    setReactionCount,
  ] = useState(
    Number(post?.like_count || 0)
  )
  const [
    reactionSummary,
    setReactionSummary,
  ] = useState(
    Array.isArray(post?.reaction_summary)
      ? post.reaction_summary
      : []
  )
  const [
    reactionMessage,
    setReactionMessage,
  ] = useState('')
  const [commentCount, setCommentCount] =
    useState(Number(post?.comment_count || 0))
  const [echoCount, setEchoCount] =
    useState(Number(post?.echo_count || 0))
  const [isSaved, setIsSaved] =
  useState(Boolean(post?.is_saved))
  const [saveBusy, setSaveBusy] =
    useState(false)
  const [followBusy, setFollowBusy] =
    useState(false)
  const [
    fullscreenPhotoOpen,
    setFullscreenPhotoOpen,
  ] = useState(false)
  const [
  fullscreenPhotoIndex,
  setFullscreenPhotoIndex,
] = useState(0)
  const [
    fullscreenControlsVisible,
    setFullscreenControlsVisible,
  ] = useState(true)
  const [
    fullscreenPhotoMenuOpen,
    setFullscreenPhotoMenuOpen,
  ] = useState(false)
  const [
    photoActionMessage,
    setPhotoActionMessage,
  ] = useState('')
  const [
    photoDeleteConfirmOpen,
    setPhotoDeleteConfirmOpen,
  ] = useState(false)
  const [
    photoDeleteBusy,
    setPhotoDeleteBusy,
  ] = useState(false)
  const [
    photoCaptionEditorOpen,
    setPhotoCaptionEditorOpen,
  ] = useState(false)
  const [
    photoCaption,
    setPhotoCaption,
  ] = useState('')
  const [
    photoCaptionSaving,
    setPhotoCaptionSaving,
  ] = useState(false)
  const [
    photoAltEditorOpen,
    setPhotoAltEditorOpen,
  ] = useState(false)
  const [
    photoAltText,
    setPhotoAltText,
  ] = useState('')
  const [
    photoAltSaving,
    setPhotoAltSaving,
  ] = useState(false)

  const user = post?.user || {}
  const isOwner =
    Boolean(post?.is_owner) ||
    String(storedUser?.id || '') ===
      String(post?.user_id || '')
  const isDiscoverView =
    window.location.pathname === '/discover'
  const isFollowing =
    Boolean(user?.is_following)
  const showFollow =
    isDiscoverView &&
    !isOwner &&
    !isFollowing &&
    Boolean(user?.username)
  const isEchoPost =
    Boolean(post?.is_echo)
  const isLegacyEcho =
    isEchoPost &&
    !post?.reader_post_id
  const reactionStateLoaded =
  Boolean(post?.reaction_state_loaded)
const savedStateLoaded =
  Boolean(post?.saved_state_loaded)
const echoStateLoaded =
  Boolean(post?.echo_state_loaded)

  const postText = String(
    post?.content || ''
  )
  const imageUrls =
    Array.isArray(
      post?.image_urls
    )
      ? post.image_urls
          .filter(
            (url) =>
              typeof url === 'string' &&
              url.trim()
          )
          .slice(0, 5)
      : []
  const activePhotoIndex =
  photoPostView
    ? selectedPhotoIndex
    : fullscreenPhotoIndex

const safeSelectedPhotoIndex =
  imageUrls.length
    ? Math.min(
        imageUrls.length - 1,
        Math.max(
          0,
          Number.isFinite(
            Number(activePhotoIndex)
          )
            ? Math.floor(
                Number(activePhotoIndex)
              )
            : 0
        )
      )
    : 0
  const selectedPhotoUrl =
    imageUrls[
      safeSelectedPhotoIndex
    ] || ''
  const photoMetadata =
    Array.isArray(
      post?.photo_metadata
    )
      ? post.photo_metadata
      : []
  const selectedPhotoMetadata =
    photoMetadata.find(
      (item) =>
        String(item?.url || '') ===
        String(selectedPhotoUrl || '')
    ) ||
    photoMetadata[
      safeSelectedPhotoIndex
    ] ||
    {}
  const selectedPhotoCaption =
    String(
      selectedPhotoMetadata?.caption ||
        ''
    )
  const selectedPhotoAltText =
    String(
      selectedPhotoMetadata?.alt_text ??
        selectedPhotoMetadata?.alt ??
        ''
    )

  useEffect(() => {
  if (!photoPostView || !selectedPhotoUrl) return

  setFullscreenPhotoIndex(safeSelectedPhotoIndex)
  setFullscreenPhotoOpen(true)
}, [
  photoPostView,
  safeSelectedPhotoIndex,
  selectedPhotoUrl,
])

  const echoShareSource = useMemo(
    () =>
      resolveReaderPostEchoSource(
        post,
        user
      ),
    [language, post, user]
  )

  const editRemainingPhotos =
    MAX_POST_PHOTOS -
    editImageUrls.length
  const canSaveEdit = Boolean(
    isEchoPost ||
      content.trim() ||
      editImageUrls.length
  )

  useEffect(() => {
    setReactionCount(
      Number(post?.like_count || 0)
    )
  }, [post?.like_count])

  useEffect(() => {
    setReactionSummary(
      Array.isArray(post?.reaction_summary)
        ? post.reaction_summary
        : []
    )
  }, [post?.reaction_summary])

  useEffect(() => {
    setReactionType(
      post?.my_reaction || null
    )
  }, [post?.my_reaction])

  useEffect(() => {
    setCommentCount(
      Number(post?.comment_count || 0)
    )
  }, [post?.comment_count])


  useEffect(() => {
    if (
      echoStateLoaded ||
      !echoShareSource.type ||
      !echoShareSource.id
    ) {
      setEchoCount(
        Number(post?.echo_count || 0)
      )
    }
  }, [
    echoShareSource.id,
    echoShareSource.type,
    echoStateLoaded,
    post?.echo_count,
  ])

  useEffect(() => {
    const sourceType = String(
      echoShareSource.type || ''
    )
      .trim()
      .toLowerCase()
    const sourceId = String(
      echoShareSource.id || ''
    ).trim()

    if (!sourceType || !sourceId) {
      return undefined
    }

    const controller =
      new AbortController()
    const token = getAuthToken()
    let ignore = false

    async function loadSourceEchoCount() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/echo-v2/source/${encodeURIComponent(
            sourceType
          )}/${encodeURIComponent(
            sourceId
          )}?page=1&limit=1`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          ignore ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        setEchoCount(
          Math.max(
            0,
            Number(
              data.echo_count ??
                data.total ??
                0
            )
          )
        )
      } catch (error) {
        if (
          error?.name !== 'AbortError'
        ) {
          return
        }
      }
    }

    function handleEchoV2Updated(event) {
      const detail = event?.detail || {}

      if (
        String(
          detail.sourceType || ''
        )
          .trim()
          .toLowerCase() === sourceType &&
        String(
          detail.sourceId || ''
        ).trim() === sourceId
      ) {
        setEchoCount(
          Math.max(
            0,
            Number(
              detail.echoCount || 0
            )
          )
        )
      }
    }

    window.addEventListener(
      'shadow:echo-v2-updated',
      handleEchoV2Updated
    )

    if (!echoStateLoaded) {
      loadSourceEchoCount()
    }

    return () => {
      ignore = true
      controller.abort()
      window.removeEventListener(
        'shadow:echo-v2-updated',
        handleEchoV2Updated
      )
    }
  }, [
    echoShareSource.id,
    echoShareSource.type,
    echoStateLoaded,
  ])

  useEffect(() => {
    if (savedStateLoaded) {
      setIsSaved(Boolean(post?.is_saved))
      return undefined
    }

    const token = getAuthToken()
    const controller = new AbortController()
    let ignore = false

    if (!post?.id || !token) {
      setIsSaved(false)
      return undefined
    }

    fetchSavedPostStatus(
      'reader_post',
      post.id,
      controller.signal
    )
      .then((data) => {
        if (!ignore) {
          setIsSaved(Boolean(data.saved))
        }
      })
      .catch((error) => {
        if (
          !ignore &&
          error?.name !== 'AbortError'
        ) {
          setIsSaved(false)
        }
      })

    return () => {
      ignore = true
      controller.abort()
    }
  }, [
    post?.id,
    post?.is_saved,
    savedStateLoaded,
  ])

  useEffect(() => {
    if (reactionStateLoaded) {
      return undefined
    }

    let ignore = false
    const token = getAuthToken()
    const controller = new AbortController()

    if (!post?.id || !token) {
      return undefined
    }

    async function loadReactionStatus() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(post.id)}/reaction`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          ignore ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        setReactionType(
          data.my_reaction || null
        )
        setReactionCount(
          Number(data.like_count || 0)
        )
        setReactionSummary(
          Array.isArray(data.reaction_summary)
            ? data.reaction_summary
            : []
        )
      } catch (error) {
        if (error?.name !== 'AbortError') {
          return
        }
      }
    }

    loadReactionStatus()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [
    post?.id,
    reactionStateLoaded,
  ])

  useEffect(() => {
    return () => {
      if (
        reactionMessageTimerRef.current
      ) {
        window.clearTimeout(
          reactionMessageTimerRef.current
        )
      }
    }
  }, [])

  useEffect(() => {
    if (
      !LEGACY_PHOTO_VIEWER_ENABLED ||
      !fullscreenPhotoOpen
    ) {
      return undefined
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    function handleKeyDown(event) {
      if (event.key !== 'Escape') {
        return
      }

      if (photoAltEditorOpen) {
        if (!photoAltSaving) {
          setPhotoAltEditorOpen(false)
        }
        return
      }

      if (photoCaptionEditorOpen) {
        if (!photoCaptionSaving) {
          setPhotoCaptionEditorOpen(false)
        }
        return
      }

      if (photoDeleteConfirmOpen) {
        if (!photoDeleteBusy) {
          setPhotoDeleteConfirmOpen(false)
        }
        return
      }

      if (fullscreenPhotoMenuOpen) {
        setFullscreenPhotoMenuOpen(false)
        return
      }

      setFullscreenPhotoOpen(false)
      setFullscreenControlsVisible(true)
      setFullscreenPhotoMenuOpen(false)
      setPhotoDeleteConfirmOpen(false)
      setPhotoActionMessage('')
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
    fullscreenPhotoOpen,
    fullscreenPhotoMenuOpen,
    photoAltEditorOpen,
    photoAltSaving,
    photoCaptionEditorOpen,
    photoCaptionSaving,
    photoDeleteConfirmOpen,
    photoDeleteBusy,
  ])

  useEffect(() => {
    if (!photoActionMessage) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setPhotoActionMessage(''),
      1800
    )

    return () =>
      window.clearTimeout(timer)
  }, [photoActionMessage])

  function showReactionMessage(text) {
    setReactionMessage(text)

    if (
      reactionMessageTimerRef.current
    ) {
      window.clearTimeout(
        reactionMessageTimerRef.current
      )
    }

    reactionMessageTimerRef.current =
      window.setTimeout(() => {
        setReactionMessage('')
      }, 1800)
  }

  async function updateReaction(
    nextReactionType
  ) {
    if (!post?.id || reactionBusy) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showReactionMessage(
        t('readerPostCard.pleaseLoginFirst')
      )
      return
    }

    try {
      setReactionBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(post.id)}/reaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            reaction_type:
              nextReactionType,
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
            t('readerPostCard.failedUpdateReaction')
        )
      }

      const nextType = data.reacted
        ? data.reaction_type ||
          nextReactionType
        : null
      const nextCount = Number(
        data.like_count || 0
      )

      setReactionType(nextType)
      setReactionCount(nextCount)
      setReactionSummary(
        Array.isArray(data.reaction_summary)
          ? data.reaction_summary
          : []
      )

      onUpdated?.({
        ...post,
        like_count: nextCount,
        my_reaction: nextType,
        reaction_summary:
          Array.isArray(
            data.reaction_summary
          )
            ? data.reaction_summary
            : [],
      })
    } catch (error) {
      showReactionMessage(
        error.message ||
          t('readerPostCard.failedUpdateReaction')
      )
    } finally {
      setReactionBusy(false)
    }
  }

  async function handlePickEditImages(
    fileList
  ) {
    const files = Array.from(
      fileList || []
    )
    const imageFiles =
      files.filter((file) =>
        file?.type?.startsWith(
          'image/'
        )
      )

    if (!imageFiles.length) {
      setMessage(
        t('readerPostCard.onlyImageFiles')
      )
      return
    }

    if (
      imageFiles.length >
      editRemainingPhotos
    ) {
      setMessage(
        t('readerPostCard.maxPhotos', {
          count: MAX_POST_PHOTOS,
        })
      )
      return
    }

    try {
      setUploadingImages(true)
      setMessage(
        t('readerPostCard.preparingPhotos')
      )

      const compressedFiles = []

      for (const file of imageFiles) {
        const compressedFile =
          await compressImageFile(file)

        if (compressedFile) {
          compressedFiles.push(
            compressedFile
          )
        }
      }

      const validFiles = compressedFiles
      const totalSize =
        validFiles.reduce(
          (sum, file) =>
            sum +
            Number(file.size || 0),
          0
        )

      if (
        totalSize >
        MAX_POST_IMAGE_BYTES
      ) {
        throw new Error(
          t('readerPostCard.photosTooLarge', {
            selected: formatBytes(totalSize),
            limit: formatBytes(
              MAX_POST_IMAGE_BYTES
            ),
          })
        )
      }

      const uploadedUrls = []

      for (const file of validFiles) {
        const imageUrl =
          await uploadReaderPostImage(
            file
          )
        uploadedUrls.push(
          imageUrl
        )
      }

      setEditImageUrls(
        (current) => [
          ...current,
          ...uploadedUrls,
        ].slice(0, MAX_POST_PHOTOS)
      )
      setMessage('')
    } catch (error) {
      setMessage(
        error.message ||
          t('readerPostCard.couldNotUploadPhotos')
      )
    } finally {
      setUploadingImages(false)
    }
  }

  function removeEditImage(imageUrl) {
    setEditImageUrls((current) =>
      current.filter(
        (item) =>
          item !== imageUrl
      )
    )
    setMessage('')
  }

  async function updatePost() {
    const text = content.trim()

    if (!canSaveEdit) {
      setMessage(
        t('readerPostCard.postTextOrImageRequired')
      )
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(post.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content: text,
            image_urls:
              editImageUrls,
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
            t('readerPostCard.failedUpdatePost')
        )
      }

      if (data.post) {
        onUpdated?.(data.post)
      }

      setEditorOpen(false)
      setMenuOpen(false)
    } catch (error) {
      setMessage(
        error.message ||
          t('readerPostCard.failedUpdatePost')
      )
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    try {
      setDeleting(true)

      const endpoint =
        isLegacyEcho && post?.echo_id
          ? `${API_BASE_URL}/api/echoes/${encodeURIComponent(
              post.echo_id
            )}`
          : `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(
              post.id
            )}`

      const response = await fetch(
        endpoint,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
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
            t('readerPostCard.failedDeletePost')
        )
      }

      onDeleted?.(post.id)
      setDeleteOpen(false)
    } catch (error) {
      window.alert(
        error.message ||
          t('readerPostCard.failedDeletePost')
      )
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  function openEditor() {
    if (isLegacyEcho) {
      window.alert(
        t('readerPostCard.legacyEchoEdit')
      )
      setMenuOpen(false)
      return
    }

    setContent(post.content || '')
    setEditImageUrls(
      Array.isArray(
        post.image_urls
      )
        ? post.image_urls
            .filter(
              (url) =>
                typeof url ===
                  'string' &&
                url.trim()
            )
            .slice(
              0,
              MAX_POST_PHOTOS
            )
        : []
    )
    setMessage('')
    setMenuOpen(false)
    setEditorOpen(true)
  }

  function hidePost() {
    onHidden?.(post.id)
    setMenuOpen(false)
  }

  function openFullPost() {
  if (
    !isDiscoverView ||
    !post?.id
  ) {
    return
  }

  navigate(
    `/reader/post/${encodeURIComponent(
      post.id
    )}`,
    {
      state: {
        backgroundLocation: location,
      },
    }
  )
}

  

  function handlePostImageClick(index) {
  const photoIndex = Math.max(
    0,
    Number.isFinite(Number(index))
      ? Math.floor(Number(index))
      : 0
  )

  setFullscreenPhotoIndex(photoIndex)
  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoDeleteConfirmOpen(false)
  setPhotoCaptionEditorOpen(false)
  setPhotoAltEditorOpen(false)
  setPhotoActionMessage('')
  setFullscreenPhotoOpen(true)
}

  function openPhotoCaptionEditor(event) {
    event?.stopPropagation()

    if (!isOwner || !selectedPhotoUrl) {
      return
    }

    setPhotoCaption(
      selectedPhotoCaption
    )
    setFullscreenPhotoMenuOpen(false)
    setPhotoCaptionEditorOpen(true)
  }

  async function savePhotoCaption(event) {
    event?.stopPropagation()

    if (
      !isOwner ||
      !selectedPhotoUrl ||
      photoCaptionSaving
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      setPhotoCaptionEditorOpen(false)
      setFullscreenPhotoOpen(false)
      navigate('/login')
      return
    }

    const nextCaption =
      photoCaption
        .slice(
          0,
          MAX_PHOTO_CAPTION_LENGTH
        )
        .trim()

    const metadataByUrl = new Map(
      photoMetadata
        .filter(
          (item) =>
            item &&
            typeof item === 'object'
        )
        .map((item) => [
          String(item.url || ''),
          item,
        ])
    )

    const nextPhotoMetadata =
      imageUrls.map((url, index) => {
        const existing =
          metadataByUrl.get(
            String(url)
          ) ||
          photoMetadata[index] ||
          {}

        return {
          url,
          caption:
            index ===
            safeSelectedPhotoIndex
              ? nextCaption
              : String(
                  existing.caption ||
                    ''
                ),
          alt_text: String(
            existing.alt_text ??
              existing.alt ??
              ''
          ),
        }
      })

    try {
      setPhotoCaptionSaving(true)

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
            photo_metadata:
              nextPhotoMetadata,
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
            t('readerPostCard.failedSaveCaption')
        )
      }

      if (data.post) {
        onUpdated?.(data.post)
      } else {
        onUpdated?.({
          ...post,
          photo_metadata:
            nextPhotoMetadata,
        })
      }

      setPhotoCaptionEditorOpen(false)
      setPhotoActionMessage(
        nextCaption
          ? t('readerPostCard.captionSaved')
          : t('readerPostCard.captionRemoved')
      )
    } catch (error) {
      setPhotoActionMessage(
        error.message ||
          t('readerPostCard.failedSaveCaption')
      )
    } finally {
      setPhotoCaptionSaving(false)
    }
  }

  function openPhotoAltEditor(event) {
    event?.stopPropagation()

    if (!isOwner || !selectedPhotoUrl) {
      return
    }

    setPhotoAltText(
      selectedPhotoAltText
    )
    setFullscreenPhotoMenuOpen(false)
    setPhotoAltEditorOpen(true)
  }

  async function savePhotoAltText(event) {
    event?.stopPropagation()

    if (
      !isOwner ||
      !selectedPhotoUrl ||
      photoAltSaving
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      setPhotoAltEditorOpen(false)
      setFullscreenPhotoOpen(false)
      navigate('/login')
      return
    }

    const nextAltText =
      photoAltText
        .slice(
          0,
          MAX_PHOTO_ALT_TEXT_LENGTH
        )
        .trim()

    const metadataByUrl = new Map(
      photoMetadata
        .filter(
          (item) =>
            item &&
            typeof item === 'object'
        )
        .map((item) => [
          String(item.url || ''),
          item,
        ])
    )

    const nextPhotoMetadata =
      imageUrls.map((url, index) => {
        const existing =
          metadataByUrl.get(
            String(url)
          ) ||
          photoMetadata[index] ||
          {}

        return {
          url,
          caption: String(
            existing.caption || ''
          ),
          alt_text:
            index ===
            safeSelectedPhotoIndex
              ? nextAltText
              : String(
                  existing.alt_text ??
                    existing.alt ??
                    ''
                ),
        }
      })

    try {
      setPhotoAltSaving(true)

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
            photo_metadata:
              nextPhotoMetadata,
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
            t('readerPostCard.failedSaveAltText')
        )
      }

      if (data.post) {
        onUpdated?.(data.post)
      } else {
        onUpdated?.({
          ...post,
          photo_metadata:
            nextPhotoMetadata,
        })
      }

      setPhotoAltEditorOpen(false)
      setPhotoActionMessage(
        nextAltText
          ? t('readerPostCard.altTextSaved')
          : t('readerPostCard.altTextRemoved')
      )
    } catch (error) {
      setPhotoActionMessage(
        error.message ||
          t('readerPostCard.failedSaveAltText')
      )
    } finally {
      setPhotoAltSaving(false)
    }
  }

  async function deleteSelectedPhoto(event) {
    event?.stopPropagation()

    if (
      !isOwner ||
      !selectedPhotoUrl ||
      photoDeleteBusy
    ) {
      return
    }

    const remainingImageUrls =
      imageUrls.filter(
        (_, index) =>
          index !== safeSelectedPhotoIndex
      )
    const currentContent = String(
      post?.content || ''
    ).trim()

    if (
      !remainingImageUrls.length &&
      !currentContent
    ) {
      setPhotoDeleteConfirmOpen(false)
      setFullscreenPhotoMenuOpen(false)
      setPhotoActionMessage(
        t('readerPostCard.postNeedsContentDeleteInstead')
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setPhotoDeleteConfirmOpen(false)
      setFullscreenPhotoMenuOpen(false)
      setFullscreenPhotoOpen(false)
      navigate('/login')
      return
    }

    try {
      setPhotoDeleteBusy(true)

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
              remainingImageUrls,
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
            t('readerPostCard.failedDeletePhoto')
        )
      }

      const updatedPost =
        data.post || {
          ...post,
          content: currentContent,
          image_urls:
            remainingImageUrls,
        }

      onUpdated?.(updatedPost)
      setPhotoDeleteConfirmOpen(false)
      setFullscreenPhotoMenuOpen(false)

      if (!remainingImageUrls.length) {
        setFullscreenPhotoOpen(false)
        setFullscreenControlsVisible(true)
        setPhotoActionMessage('')

        if (photoPostView) {
          navigate(
            `/reader/post/${encodeURIComponent(
              post.id
            )}`,
            {
              replace: true,
            }
          )
        }

        return
      }

      const nextPhotoIndex =
        Math.min(
          safeSelectedPhotoIndex,
          remainingImageUrls.length - 1
        )

      setPhotoActionMessage(
        t('readerPostCard.photoDeleted')
      )

      if (photoPostView) {
        navigate(
          `/reader/post/${encodeURIComponent(
            post.id
          )}?photo=${nextPhotoIndex}`,
          {
            replace: true,
          }
        )
      } else {
        setFullscreenPhotoIndex(
          nextPhotoIndex
        )
      }
    } catch (error) {
      setPhotoDeleteConfirmOpen(false)
      setFullscreenPhotoMenuOpen(false)
      setPhotoActionMessage(
        error.message ||
          t('readerPostCard.failedDeletePhoto')
      )
    } finally {
      setPhotoDeleteBusy(false)
    }
  }

  async function saveSelectedPhoto(event) {
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
          t('readerPostCard.couldNotDownloadPhoto')
        )
      }

      const blob = await response.blob()
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
        `shadow-reader-photo-${post.id}-${safeSelectedPhotoIndex + 1}.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.setTimeout(
        () => URL.revokeObjectURL(objectUrl),
        1000
      )

      setFullscreenPhotoMenuOpen(false)
      setPhotoActionMessage(
        t('readerPostCard.photoSaved')
      )
    } catch {
      const link =
        document.createElement('a')

      link.href = selectedPhotoUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.download =
        `shadow-reader-photo-${post.id}-${safeSelectedPhotoIndex + 1}`
      document.body.appendChild(link)
      link.click()
      link.remove()

      setFullscreenPhotoMenuOpen(false)
      setPhotoActionMessage(
        t('readerPostCard.photoOpenedForSaving')
      )
    }
  }

  async function shareSelectedPhoto(event) {
    event?.stopPropagation()

    if (!selectedPhotoUrl) {
      return
    }

    const shareData = {
      title:
        t('readerPostCard.readerPhoto', {
          name:
            user?.name ||
            t('readerPostCard.reader'),
        }),
      url: selectedPhotoUrl,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setFullscreenPhotoMenuOpen(false)
        return
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
      }
    }

    if (
      navigator.clipboard?.writeText
    ) {
      try {
        await navigator.clipboard.writeText(
          selectedPhotoUrl
        )
        setFullscreenPhotoMenuOpen(false)
        setPhotoActionMessage(
          t('readerPostCard.photoLinkCopied')
        )
        return
      } catch {
        return
      }
    }

    window.open(
      selectedPhotoUrl,
      '_blank',
      'noopener,noreferrer'
    )
    setFullscreenPhotoMenuOpen(false)
  }

  function viewReaderProfile(event) {
    event?.stopPropagation()

    const username = String(
      user?.username || ''
    ).trim()

    setMenuOpen(false)

    if (
      !username ||
      profileNavigationLockRef.current
    ) {
      return
    }

    const currentProfileUsername =
      location.pathname === '/profile'
        ? String(
            new URLSearchParams(
              location.search
            ).get('username') ||
              storedUser?.username ||
              ''
          )
            .trim()
            .replace(/^@+/, '')
            .toLowerCase()
        : ''

    const targetUsername = username
      .replace(/^@+/, '')
      .toLowerCase()

    if (
      currentProfileUsername &&
      currentProfileUsername ===
        targetUsername
    ) {
      return
    }

    profileNavigationLockRef.current =
      true

    const returnTo =
      `${location.pathname}${location.search}${location.hash}`

    navigate(
      `/profile?username=${encodeURIComponent(
        username
      )}`,
      {
        state: {
          returnTo,
          profilePreview: user,
        },
      }
    )

    window.setTimeout(() => {
      profileNavigationLockRef.current =
        false
    }, 600)
  }

  async function followReaderFromPost(event) {
    event?.stopPropagation()
    if (
      followBusy ||
      isOwner ||
      isFollowing ||
      !user?.username
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setFollowBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(
          user.username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
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
            t('readerPostCard.failedFollowReader')
        )
      }

      onFollowChanged?.(
        post.user_id,
        true
      )
    } catch (error) {
      showReactionMessage(
        error.message ||
          t('readerPostCard.failedFollowReader')
      )
    } finally {
      setFollowBusy(false)
    }
  }

  async function toggleSavedPost() {
    if (!post?.id || saveBusy) return

    if (!getAuthToken()) {
      setMenuOpen(false)
      navigate('/login')
      return
    }

    try {
      setSaveBusy(true)

      if (isSaved) {
        await deleteSavedPostBySource(
          'reader_post',
          post.id
        )

        setIsSaved(false)
        showReactionMessage(
          t('readerPostCard.removedFromSaved')
        )
      } else {
        await saveSavedPost({
          source_type: 'reader_post',
          source_id: String(post.id),
          source_url:
            `${window.location.pathname}${window.location.search}` +
            `#reader-post-${post.id}`,
          snapshot_data: {
            content: post.content || '',
            author_name:
              user?.name || getDisplayText('readerPostCard.reader'),
            username:
              user?.username || '',
            avatar_url:
              user?.avatar_url || '',
          },
          original_created_at:
            post.created_at || null,
        })

        setIsSaved(true)
        showReactionMessage(t('readerPostCard.postSaved'))
      }

      setMenuOpen(false)
    } catch (error) {
      showReactionMessage(
        error.message ||
          t('readerPostCard.failedUpdateSavedPost')
      )
    } finally {
      setSaveBusy(false)
    }
  }

  return (
    <>


      {fullPostView && !photoPostView ? (
  <PublicPostDetailView
    pageName={
      user?.name ||
      user?.username ||
      getDisplayText('readerPostCard.reader')
    }
    pageAvatarUrl={
      user?.avatar_url || ''
    }
    authorName={
      user?.name ||
      user?.username ||
      getDisplayText('readerPostCard.reader')
    }
    authorAvatarUrl={
      user?.avatar_url || ''
    }
    createdAt={post.created_at}
    visibility={
      post.visibility || 'public'
    }
    isEdited={Boolean(post.is_edited)}
    content={
      postText ? (
        <span>
          {renderPostTextWithLinks(
            postText
          )}
        </span>
      ) : null
    }
    sourcePreview={
      isEchoPost ? (
        <ReaderEchoSourceBlock
          post={post}
        />
      ) : null
    }
    media={
      !isEchoPost ? (
        <ReaderPostImages
          imageUrls={imageUrls}
          photoMetadata={
            photoMetadata
          }
          onImageClick={
            handlePostImageClick
          }
        />
      ) : null
    }
    reactionControl={
      <div className="inline-flex items-center gap-2">
        <ReactionAction
          reactionType={
            reactionType
          }
          count={reactionCount}
          busy={reactionBusy}
          onReact={updateReaction}
          showCount={false}
          idleLabel="Like"
          buttonClassName="text-[#65676b] dark:text-white/60"
        />

        <button
          type="button"
          onClick={() =>
            updateReaction(
              reactionType || 'love'
            )
          }
          disabled={reactionBusy}
          className="text-[14px] font-normal text-[#65676b] dark:text-white/60 disabled:opacity-60"
        >
          {t('readerPostCard.like')}
        </button>
      </div>
    }
    echoControl={
      <button
        type="button"
        onClick={() =>
          setEchoOpen(true)
        }
        className="inline-flex items-center gap-2 text-[14px] font-normal text-[#65676b] dark:text-white/60 active:opacity-70"
      >
        <img
          src="/assets/Icons/echo.svg"
          alt=""
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain opacity-70 dark:brightness-0 dark:invert"
        />
        <span>{t('readerPostCard.echo')}</span>
      </button>
    }
    reactionSummary={reactionSummary}
myReaction={reactionType}
likeCount={reactionCount}
    commentCount={commentCount}
    echoCount={echoCount}
    comments={
      <ReaderPostCommentsSection
        postId={post.id}
        postOwnerId={post.user_id}
        commentsPermission={
          post.comments_permission
        }
        commentCount={commentCount}
        onTotalChange={(nextTotal) => {
          setCommentCount(nextTotal)
          onUpdated?.({
            ...post,
            comment_count: nextTotal,
          })
        }}
      />
    }
    onClose={
      onFullPostClose ||
      (() => {
        if (
          window.history.length > 1
        ) {
          navigate(-1)
          return
        }

        navigate('/discover', {
          replace: true,
        })
      })
    }
    onSearch={() =>
      navigate(
        `/discover/search?q=${encodeURIComponent(
          user?.username ||
            user?.name ||
            ''
        )}&type=posts`
      )
    }
    onOpenProfile={
      viewReaderProfile
    }
    onOptions={() =>
      setMenuOpen(true)
    }
    onComment={() =>
      document
        .getElementById(
          'reader-post-comment-input'
        )
        ?.focus()
    }
    onOpenReactions={() =>
      navigate(
        `/interactions/reader_post/${encodeURIComponent(
          post.id
        )}/likes`,
        {
          state: {
            sourceName:
              user?.name ||
              user?.username ||
              t('readerPostCard.readerPost'),
          },
        }
      )
    }
    onOpenComments={() =>
      document
        .getElementById(
          'reader-post-comment-input'
        )
        ?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        })
    }
    onOpenEchoes={() => {
      const sourceType =
        String(
          echoShareSource.type ||
            'reader_post'
        )
          .trim()
          .toLowerCase()
      const sourceId =
        String(
          echoShareSource.id ||
            post.id ||
            ''
        ).trim()

      if (
        !sourceType ||
        !sourceId
      ) {
        return
      }

      navigate(
        `/interactions/${encodeURIComponent(
          sourceType
        )}/${encodeURIComponent(
          sourceId
        )}/echoes`,
        {
          state: {
            sourceName:
              echoShareSource.name ||
              user?.name ||
              t('readerPostCard.readerPost'),
          },
        }
      )
    }}
  />
) : (

      <article
        id={`reader-post-${post.id}`}
        className="bg-white dark:bg-[#171923] sm:rounded-[12px]"
      >
        <div
          onClick={
            isDiscoverView
              ? openFullPost
              : undefined
          }
          className={`flex items-start gap-2 px-4 pb-3 pt-4 ${
            isDiscoverView
              ? 'cursor-pointer'
              : ''
          }`}
        >
  <button
    type="button"
    onClick={viewReaderProfile}
    className="shrink-0 rounded-full active:opacity-70"
  >
    <ReaderAvatar user={user} />
  </button>

  <div className="min-w-0 flex-1">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div
          className={
            isDiscoverView
              ? 'flex flex-wrap items-baseline gap-x-1'
              : ''
          }
        >
          <button
            type="button"
            onClick={viewReaderProfile}
            className={
              isDiscoverView
                ? 'max-w-full whitespace-normal break-words text-left text-[14px] font-semibold leading-5 text-[#111827] dark:text-[#f8fafc] active:opacity-70'
                : 'block max-w-full truncate text-left text-[14px] font-semibold text-[#111827] dark:text-[#f8fafc] active:opacity-70'
            }
          >
            {user.name || getDisplayText('readerPostCard.reader')}
          </button>

          {showFollow ? (
            <>
              <span className="text-[14px] font-normal text-[#65676b] dark:text-white/60">
                ·
              </span>

              <button
                type="button"
                disabled={followBusy}
                onClick={followReaderFromPost}
                className="text-[14px] font-semibold text-[#0866ff] active:opacity-70 disabled:opacity-50"
              >
                {t('readerPostCard.follow')}
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400 dark:text-white/40">
          <span>
            {formatPostTime(
              post.created_at
            )}
          </span>

          {post.is_edited ? (
            <>
              <span>·</span>
              <span>{t('readerPostCard.edited')}</span>
            </>
          ) : null}

          <span>·</span>

          <i
            className={`${getVisibilityIcon(
              post.visibility
            )} text-[10px]`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          setMenuOpen(true)
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 dark:text-white/40 active:bg-gray-100 dark:active:bg-[#242836]"
        aria-label={t('readerPostCard.postOptions')}
      >
        <i className="fa-solid fa-ellipsis text-[14px]" />
      </button>
    </div>
  </div>
</div>

        {postText ? (
          <div className="px-4 pb-4">
            {photoPostView ? (
              <ReaderDiscoverPostText
                text={postText}
                renderText={
                  renderPostTextWithLinks
                }
                className="text-[14px] font-normal leading-6 text-[#111827] dark:text-[#f8fafc]"
              />
            ) : fullPostView ? (
              <p className="whitespace-pre-wrap break-words text-[14px] font-normal leading-6 text-[#111827] dark:text-[#f8fafc]">
                {renderPostTextWithLinks(
                  postText
                )}
              </p>
            ) : isDiscoverView ? (
              <ReaderDiscoverPostText
                text={postText}
                renderText={
                  renderPostTextWithLinks
                }
                className="text-[14px] font-normal leading-6 text-[#111827] dark:text-[#f8fafc]"
              />
            ) : (
              <ReaderDiscoverPostText
  text={postText}
  renderText={renderPostTextWithLinks}
  className="text-[14px] font-normal leading-6 text-[#111827] dark:text-[#f8fafc]"
/>
            )}
          </div>
        ) : null}
        {isEchoPost ? (
          <ReaderEchoSourceBlock
            post={post}
          />
        ) : null}

        {!isEchoPost ? (
          <ReaderPostImages
            imageUrls={imageUrls}
            photoMetadata={
              photoMetadata
            }
            onImageClick={
              handlePostImageClick
            }
            photoPostView={
              photoPostView
            }
            selectedPhotoIndex={
              selectedPhotoIndex
            }
          />
        ) : null}

        {isEchoPost ? (
  <div className="mt-2 px-4 pb-1">
    <div className="flex items-center justify-between pb-2 text-[12px] text-[#65676b] dark:text-white/60">
      <button
        type="button"
        onClick={() =>
          navigate(
            `/interactions/reader_post/${post.id}/likes`,
            {
              state: {
                sourceName:
                  user?.name ||
                  t('readerPostCard.readerPost'),
              },
            }
          )
        }
        className="flex items-center active:opacity-60"
      >
        <ReactionSummary
          summary={reactionSummary}
          likeCount={reactionCount}
          myReaction={reactionType}
        />
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setCommentOpen(true)}
          className="active:opacity-60"
        >
          {t('readerPostCard.commentsCount', {
          count: formatCompactNumber(commentCount),
        })}
        </button>

        <span>
          {t('readerPostCard.echoesCount', {
          count: formatCompactNumber(echoCount),
        })}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b] dark:text-white/60">
      <div className="flex items-center justify-center py-2">
        <ReactionAction
          reactionType={reactionType}
          count={reactionCount}
          busy={reactionBusy}
          onReact={updateReaction}
          showCount={false}
          idleLabel="Like"
          buttonClassName="gap-2 after:content-[attr(aria-label)] [&>i]:!text-[18px] [&>img]:!h-[18px] [&>img]:!w-[18px]"
        />
      </div>

      <button
        type="button"
        onClick={() => setCommentOpen(true)}
        className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
      >
        <i className="fa-regular fa-comment text-[18px]" />
        <span>{t('readerPostCard.comment')}</span>
      </button>

      <button
        type="button"
        onClick={() => setEchoOpen(true)}
        className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
      >
        <img
          src="/assets/Icons/echo.svg"
          alt=""
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain opacity-75 dark:brightness-0 dark:invert"
        />
        <span>{t('readerPostCard.echo')}</span>
      </button>
    </div>
  </div>
) : (
  <div className="mt-2 px-4 pb-1">
  <div className="flex items-center justify-between pb-2 text-[12px] text-[#65676b] dark:text-white/60">
    <button
      type="button"
      onClick={() =>
        navigate(
          `/interactions/reader_post/${post.id}/likes`,
          {
            state: {
              sourceName:
                user?.name ||
                t('readerPostCard.readerPost'),
            },
          }
        )
      }
      className="flex items-center active:opacity-60"
    >
      <ReactionSummary
        summary={reactionSummary}
        likeCount={reactionCount}
        myReaction={reactionType}
      />
    </button>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setCommentOpen(true)}
        className="active:opacity-60"
      >
        {t('readerPostCard.commentsCount', {
          count: formatCompactNumber(commentCount),
        })}
      </button>

      <span>
        {t('readerPostCard.echoesCount', {
          count: formatCompactNumber(echoCount),
        })}
      </span>
    </div>
  </div>

  <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b] dark:text-white/60">
    <div className="flex items-center justify-center py-2">
      <ReactionAction
        reactionType={reactionType}
        count={reactionCount}
        busy={reactionBusy}
        onReact={updateReaction}
        showCount={false}
        idleLabel="Like"
        buttonClassName="gap-2 after:content-[attr(aria-label)] [&>i]:!text-[18px] [&>img]:!h-[18px] [&>img]:!w-[18px]"
      />
    </div>

    <button
      type="button"
      onClick={() => setCommentOpen(true)}
      className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
    >
      <i className="fa-regular fa-comment text-[18px]" />
      <span>{t('readerPostCard.comment')}</span>
    </button>

    <button
      type="button"
      onClick={() => setEchoOpen(true)}
      className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
    >
      <img
        src="/assets/Icons/echo.svg"
        alt=""
        aria-hidden="true"
        className="h-[18px] w-[18px] object-contain opacity-75 dark:brightness-0 dark:invert"
      />
      <span>{t('readerPostCard.echo')}</span>
    </button>
  </div>
</div>

)}
            </article>
      )}

      <ReaderAuthorStylePhotoViewer
        open={
          fullscreenPhotoOpen &&
          imageUrls.length > 0
        }
        post={post}
        imageUrls={imageUrls}
        selectedPhotoIndex={
          safeSelectedPhotoIndex
        }
        isOwner={isOwner}
        reactionType={reactionType}
        reactionCount={reactionCount}
        reactionSummary={reactionSummary}
        reactionBusy={reactionBusy}
        commentCount={commentCount}
        shareCount={echoCount}
        routePhotoMode={photoPostView}
        onReact={updateReaction}
        onUpdated={onUpdated}
        onShareCountChange={(total) => {
          setEchoCount(total)

          if (!isEchoPost) {
            onUpdated?.({
              ...post,
              echo_count: total,
            })
          }
        }}
        onComment={() => {
          setFullscreenPhotoOpen(false)
          setCommentOpen(true)
        }}
        onClose={() => {
  if (location.state?.backgroundLocation?.pathname === '/discover') {
    navigate(-1)
    return
  }

  setFullscreenPhotoOpen(false)
  setFullscreenControlsVisible(true)

  if (photoPostView) onFullPostClose?.()
}}
      />

      {LEGACY_PHOTO_VIEWER_ENABLED &&
      fullscreenPhotoOpen &&
      imageUrls.length ? (
        <div
          className="fixed inset-0 z-[1000000] bg-black"
          onClick={() => {
            if (
              photoAltEditorOpen ||
              photoCaptionEditorOpen
            ) {
              return
            }

            if (photoDeleteConfirmOpen) {
              if (!photoDeleteBusy) {
                setPhotoDeleteConfirmOpen(
                  false
                )
              }
              return
            }

            if (fullscreenPhotoMenuOpen) {
              setFullscreenPhotoMenuOpen(false)
              return
            }

            setFullscreenControlsVisible(
              (current) => !current
            )
          }}
        >
          {fullscreenControlsVisible ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setFullscreenPhotoOpen(false)
                  setFullscreenControlsVisible(true)
                  setFullscreenPhotoMenuOpen(false)
                  setPhotoDeleteConfirmOpen(false)
                  setPhotoCaptionEditorOpen(false)
                  setPhotoAltEditorOpen(false)
                  setPhotoActionMessage('')
                }}
                className="absolute left-4 top-[max(16px,env(safe-area-inset-top))] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition-opacity active:bg-black/75"
                aria-label={t('readerPostCard.closeFullscreenPhoto')}
              >
                <i className="fa-solid fa-xmark text-[20px]" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setFullscreenPhotoMenuOpen(
                    true
                  )
                }}
                className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition-opacity active:bg-black/75"
                aria-label={t('readerPostCard.photoOptions')}
              >
                <i className="fa-solid fa-ellipsis text-[18px]" />
              </button>
            </>
          ) : null}

          <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden">
            <img
              src={selectedPhotoUrl}
              alt={selectedPhotoAltText}
              loading="eager"
              decoding="async"
              className="max-h-[100dvh] max-w-full select-none object-contain"
              draggable="false"
            />
          </div>

          {fullscreenControlsVisible &&
!fullscreenPhotoMenuOpen &&
!photoCaptionEditorOpen &&
!photoAltEditorOpen &&
!photoDeleteConfirmOpen ? (
  <div
    className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-8"
    onClick={(event) =>
      event.stopPropagation()
    }
  >
    <div className="mx-auto flex max-w-[620px] items-center justify-between px-5 pb-1 text-[11px] font-normal text-white/70">
      <ReactionSummary
  summary={reactionSummary}
  likeCount={reactionCount}
  myReaction={reactionType}
/>

<span>
  {t('readerPostCard.commentsCount', {
          count: formatCompactNumber(commentCount),
        })}
</span>

      <span>
        {t('readerPostCard.sharesCount', {
          count: formatCompactNumber(
            echoCount
          ),
        })}
      </span>
    </div>

    <div className="mx-auto flex max-w-[620px] items-center border-t border-white/15 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
      <ReactionAction
        reactionType={reactionType}
        count={reactionCount}
        busy={reactionBusy}
        onReact={updateReaction}
        showCount={false}
        idleLabel="Like"
        className="flex-1 justify-center"
        buttonClassName="h-12 min-w-[88px] justify-center gap-2 text-white after:content-[attr(aria-label)] after:text-[14px] after:font-medium [&>i]:!text-[20px] [&>img]:!h-5 [&>img]:!w-5"
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()

          setFullscreenPhotoOpen(
            false
          )
          setFullscreenControlsVisible(
            true
          )
          setFullscreenPhotoMenuOpen(
            false
          )
          setCommentOpen(true)
        }}
        className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
      >
        <i className="fa-regular fa-comment text-[20px]" />
        <span>{t('readerPostCard.comment')}</span>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()

          setFullscreenPhotoOpen(
            false
          )
          setFullscreenControlsVisible(
            true
          )
          setFullscreenPhotoMenuOpen(
            false
          )
          setEchoOpen(true)
        }}
        className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
      >
        <i className="fa-solid fa-share text-[19px]" />
        <span>{t('readerPostCard.share')}</span>
      </button>
    </div>
  </div>
) : null}

          {fullscreenControlsVisible &&
          selectedPhotoCaption &&
          !fullscreenPhotoMenuOpen &&
          !photoCaptionEditorOpen &&
          !photoAltEditorOpen &&
          !photoDeleteConfirmOpen ? (
            <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] left-0 right-0 z-20 px-5 text-center">
              <p className="mx-auto max-w-[720px] whitespace-pre-wrap break-words text-[13px] font-normal leading-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {selectedPhotoCaption}
              </p>
            </div>
          ) : null}

          {photoActionMessage ? (
            <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+94px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 dark:bg-[#202331]/95 px-4 py-2 text-[12px] font-medium text-[#111827] dark:text-[#f8fafc] shadow-xl">
              {photoActionMessage}
            </div>
          ) : null}

          {fullscreenPhotoMenuOpen ? (
            <div
              className="absolute inset-0 z-40 flex items-end bg-black/35"
              onClick={(event) => {
                event.stopPropagation()
                setFullscreenPhotoMenuOpen(
                  false
                )
              }}
            >
              <div
                className="w-full rounded-t-[22px] bg-white dark:bg-[#171923] px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#d1d5db] dark:bg-white/25" />

                {isOwner ? (
  <button
    type="button"
    onClick={
      openPhotoCaptionEditor
    }
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6] dark:active:bg-[#242836]"
  >
    <span className="flex h-9 w-9 items-center justify-center text-[#4b5563] dark:text-white/60">
      <i className="fa-solid fa-pencil text-[19px]" />
    </span>

    <span className="text-[15px] font-normal text-[#111827] dark:text-[#f8fafc]">
      {t('readerPostCard.editCaption')}
    </span>
  </button>
) : null}

{isOwner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()

      setFullscreenPhotoMenuOpen(
        false
      )
      setPhotoDeleteConfirmOpen(
        true
      )
    }}
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6] dark:active:bg-[#242836]"
  >
    <span className="flex h-9 w-9 items-center justify-center text-[#4b5563] dark:text-white/60">
      <i className="fa-regular fa-trash-can text-[20px]" />
    </span>

    <span className="text-[15px] font-normal text-[#111827] dark:text-[#f8fafc]">
      {t('readerPostCard.deletePhoto')}
    </span>
  </button>
) : null}

<button
  type="button"
  onClick={saveSelectedPhoto}
  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6] dark:active:bg-[#242836]"
>
  <span className="flex h-9 w-9 items-center justify-center text-[#4b5563] dark:text-white/60">
    <i className="fa-solid fa-arrow-down text-[19px]" />
  </span>

  <span className="text-[15px] font-normal text-[#111827] dark:text-[#f8fafc]">
    {t('readerPostCard.saveToPhone')}
  </span>
</button>

<button
  type="button"
  onClick={shareSelectedPhoto}
  className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6] dark:active:bg-[#242836]"
>
  <span className="flex h-9 w-9 items-center justify-center text-[#4b5563] dark:text-white/60">
    <i className="fa-solid fa-share text-[19px]" />
  </span>

  <span className="text-[15px] font-normal text-[#111827] dark:text-[#f8fafc]">
    {t('readerPostCard.shareExternal')}
  </span>
</button>

{isOwner ? (
  <button
    type="button"
    onClick={
      openPhotoAltEditor
    }
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6] dark:active:bg-[#242836]"
  >
    <span className="flex h-9 w-9 items-center justify-center">
      <span className="flex h-6 w-6 items-center justify-center rounded-[5px] border-2 border-[#6b7280] dark:border-white/40 text-[14px] font-semibold leading-none text-[#4b5563] dark:text-white/60">
        A
      </span>
    </span>

    <span className="text-[15px] font-normal text-[#111827] dark:text-[#f8fafc]">
      {t('readerPostCard.editAltText')}
    </span>
  </button>
) : null}

              </div>
            </div>
          ) : null}

          {photoAltEditorOpen ? (
            <div
              className="absolute inset-0 z-50 flex items-end bg-black/45"
              onClick={(event) => {
                event.stopPropagation()

                if (!photoAltSaving) {
                  setPhotoAltEditorOpen(
                    false
                  )
                }
              }}
            >
              <div
                className="w-full rounded-t-[22px] bg-white dark:bg-[#171923] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db] dark:bg-white/25" />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[16px] font-semibold text-[#111827] dark:text-[#f8fafc]">
                      {t('readerPostCard.editAltText')}
                    </div>
                    <p className="mt-1 text-[12px] font-normal leading-5 text-[#667085] dark:text-white/60">
                      {t('readerPostCard.altTextHelp')}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-normal text-[#98a2b3] dark:text-white/40">
                    {photoAltText.length} / {MAX_PHOTO_ALT_TEXT_LENGTH}
                  </span>
                </div>

                <textarea
                  autoFocus
                  value={photoAltText}
                  maxLength={
                    MAX_PHOTO_ALT_TEXT_LENGTH
                  }
                  onChange={(event) =>
                    setPhotoAltText(
                      event.target.value.slice(
                        0,
                        MAX_PHOTO_ALT_TEXT_LENGTH
                      )
                    )
                  }
                  placeholder={t('readerPostCard.describePhotoPlaceholder')}
                  className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] dark:border-white/10 bg-[#f9fafb] dark:bg-[#171923] px-3.5 py-3 text-[14px] font-normal leading-5 text-[#111827] dark:text-[#f8fafc] outline-none focus:border-[#111827] dark:focus:border-white/50"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    disabled={photoAltSaving}
                    onClick={() =>
                      setPhotoAltEditorOpen(
                        false
                      )
                    }
                    className="h-11 flex-1 rounded-full bg-[#eef0f4] dark:bg-[#202331] text-[14px] font-semibold text-[#111827] dark:text-[#f8fafc] disabled:opacity-50"
                  >
                    {t('readerPostCard.cancel')}
                  </button>

                  <button
                    type="button"
                    disabled={photoAltSaving}
                    onClick={savePhotoAltText}
                    className="h-11 flex-1 rounded-full bg-[#111827] dark:bg-[#f8fafc] dark:text-[#0d0f16] text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {photoAltSaving
                      ? t('readerPostCard.saving')
                      : t('readerPostCard.save')}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {photoCaptionEditorOpen ? (
            <div
              className="absolute inset-0 z-50 flex items-end bg-black/45"
              onClick={(event) => {
                event.stopPropagation()

                if (!photoCaptionSaving) {
                  setPhotoCaptionEditorOpen(
                    false
                  )
                }
              }}
            >
              <div
                className="w-full rounded-t-[22px] bg-white dark:bg-[#171923] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db] dark:bg-white/25" />

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-semibold text-[#111827] dark:text-[#f8fafc]">
                      {t('readerPostCard.editCaption')}
                    </div>
                    <div className="mt-1 text-[12px] font-normal text-[#98a2b3] dark:text-white/40">
                      {t('readerPostCard.photoNumber', {
                        count:
                          safeSelectedPhotoIndex + 1,
                      })}
                    </div>
                  </div>

                  <span className="text-[11px] font-normal text-[#98a2b3] dark:text-white/40">
                    {photoCaption.length} / {MAX_PHOTO_CAPTION_LENGTH}
                  </span>
                </div>

                <textarea
                  autoFocus
                  value={photoCaption}
                  maxLength={
                    MAX_PHOTO_CAPTION_LENGTH
                  }
                  onChange={(event) =>
                    setPhotoCaption(
                      event.target.value.slice(
                        0,
                        MAX_PHOTO_CAPTION_LENGTH
                      )
                    )
                  }
                  placeholder={t('readerPostCard.captionPlaceholder')}
                  className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] dark:border-white/10 bg-[#f9fafb] dark:bg-[#171923] px-3.5 py-3 text-[14px] font-normal leading-5 text-[#111827] dark:text-[#f8fafc] outline-none focus:border-[#111827] dark:focus:border-white/50"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    disabled={
                      photoCaptionSaving
                    }
                    onClick={() =>
                      setPhotoCaptionEditorOpen(
                        false
                      )
                    }
                    className="h-11 flex-1 rounded-full bg-[#eef0f4] dark:bg-[#202331] text-[14px] font-semibold text-[#111827] dark:text-[#f8fafc] disabled:opacity-50"
                  >
                    {t('readerPostCard.cancel')}
                  </button>

                  <button
                    type="button"
                    disabled={
                      photoCaptionSaving
                    }
                    onClick={savePhotoCaption}
                    className="h-11 flex-1 rounded-full bg-[#111827] dark:bg-[#f8fafc] dark:text-[#0d0f16] text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {photoCaptionSaving
                      ? t('readerPostCard.saving')
                      : t('readerPostCard.save')}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {photoDeleteConfirmOpen ? (
            <div
              className="absolute inset-0 z-50 flex items-end bg-black/45"
              onClick={(event) => {
                event.stopPropagation()

                if (!photoDeleteBusy) {
                  setPhotoDeleteConfirmOpen(
                    false
                  )
                }
              }}
            >
              <div
                className="w-full rounded-t-[22px] bg-white dark:bg-[#171923] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db] dark:bg-white/25" />

                <div className="text-[16px] font-semibold text-[#111827] dark:text-[#f8fafc]">
                  {t('readerPostCard.deleteThisPhoto')}
                </div>

                <p className="mt-1.5 text-[13px] font-normal leading-5 text-[#667085] dark:text-white/60">
                  {t('readerPostCard.photoDeleteDescription')}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    disabled={photoDeleteBusy}
                    onClick={() =>
                      setPhotoDeleteConfirmOpen(
                        false
                      )
                    }
                    className="h-11 flex-1 rounded-full bg-[#eef0f4] dark:bg-[#202331] text-[14px] font-semibold text-[#111827] dark:text-[#f8fafc] disabled:opacity-50"
                  >
                    {t('readerPostCard.cancel')}
                  </button>

                  <button
                    type="button"
                    disabled={photoDeleteBusy}
                    onClick={deleteSelectedPhoto}
                    className="h-11 flex-1 rounded-full bg-[#e5484d] text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {photoDeleteBusy
                      ? t('readerPostCard.deleting')
                      : t('readerPostCard.delete')}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {reactionMessage ? (
        <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] dark:bg-[#f8fafc] dark:text-[#0d0f16] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
          {reactionMessage}
        </div>
      ) : null}

      <ReaderPostCommentsModal
        open={commentOpen}
        postId={post.id}
        postName={
          user?.name ||
          user?.username ||
          t('readerPostCard.readerPost')
        }
        echoSourceType={
          echoShareSource.type
        }
        echoSourceId={
          echoShareSource.id
        }
        echoSourceName={
          echoShareSource.name
        }
        postOwnerId={post.user_id}
        commentsPermission={
          post.comments_permission
        }
        reactionCount={reactionCount}
        commentCount={commentCount}
        echoCount={echoCount}
        onClose={() => setCommentOpen(false)}
        onTotalChange={(nextTotal) => {
          setCommentCount(nextTotal)
          onUpdated?.({
            ...post,
            comment_count: nextTotal,
          })
        }}
      />

      <EchoShareSheetV2Connected
        open={echoOpen}
        sourceType={
          echoShareSource.type
        }
        sourceId={
          echoShareSource.id
        }
        sourceName={
          echoShareSource.name
        }
        sourceAvatarUrl={
          echoShareSource.avatarUrl
        }
        sourceContent={
          echoShareSource.content
        }
        sourceImageUrl={
          echoShareSource.imageUrl
        }
        sourceLabel={
          echoShareSource.label
        }
        shareUrl={
          echoShareSource.shareUrl
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
                  ? echoCount + 1
                  : echoCount)
            )
          )

          setEchoCount(total)

          if (!isEchoPost) {
            onUpdated?.({
              ...post,
              echo_count: total,
            })
          }
        }}
      />

      <ReaderPostOptionsSheet
        open={menuOpen}
        post={post}
        isOwner={isOwner}
        onClose={() =>
          setMenuOpen(false)
        }
        onEdit={openEditor}
        onDelete={() => {
          setMenuOpen(false)
          setDeleteOpen(true)
        }}
        onHide={hidePost}
        onViewProfile={
          viewReaderProfile
        }
        isSaved={isSaved}
        onSave={toggleSavedPost}
        onMessage={(text) =>
          window.alert(text)
        }
      />

      <ReaderPostDeleteConfirmSheet
        open={deleteOpen}
        deleting={deleting}
        onCancel={() =>
          setDeleteOpen(false)
        }
        onConfirm={deletePost}
      />

      {editorOpen ? (
        <>
          <input
            ref={editFileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={
              saving ||
              uploadingImages ||
              editRemainingPhotos <= 0
            }
            className="hidden"
            onChange={(event) => {
              handlePickEditImages(
                event.target.files
              )
              event.target.value = ''
            }}
          />

          <ImageDropZone
            onFiles={
              handlePickEditImages
            }
            onRejectedFiles={() =>
              setMessage(
                t('readerPostCard.onlyImagesAllowed', {
                  count: MAX_POST_PHOTOS,
                })
              )
            }
            disabled={
              saving ||
              uploadingImages ||
              editRemainingPhotos <= 0
            }
            multiple
            maxFiles={Math.max(
              1,
              editRemainingPhotos
            )}
            accept="image/*"
            className="fixed inset-0 z-[200000] overflow-y-auto bg-white dark:bg-[#0d0f16]"
            label={t('readerPostCard.dropPhotosHere')}
          >
            <header className="sticky top-0 z-20 border-b border-[#eef0f4] dark:border-white/10 bg-white dark:bg-[#171923]">
              <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between px-4">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !saving &&
                      !uploadingImages
                    ) {
                      setEditorOpen(false)
                    }
                  }}
                  disabled={
                    saving ||
                    uploadingImages
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] dark:text-[#f8fafc] active:bg-[#f3f4f6] dark:active:bg-[#242836] disabled:opacity-50"
                  aria-label={t('readerPostCard.closeEditor')}
                >
                  <i className="fa-solid fa-xmark text-[22px]" />
                </button>

                <div className="line-clamp-1 px-2 text-center text-[16px] font-semibold text-[#111827] dark:text-[#f8fafc]">
                  {t('readerPostCard.editReaderPost')}
                </div>

                <button
                  type="button"
                  onClick={updatePost}
                  disabled={
                    saving ||
                    uploadingImages ||
                    !canSaveEdit
                  }
                  className="h-9 rounded-full bg-[#111827] dark:bg-[#f8fafc] dark:text-[#0d0f16] px-4 text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] dark:disabled:bg-white/10 disabled:text-[#9ca3af] dark:disabled:text-white/30"
                >
                  {saving
                    ? t('readerPostCard.saving')
                    : uploadingImages
                      ? t('readerPostCard.uploading')
                      : t('readerPostCard.save')}
                </button>
              </div>
            </header>

            <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[620px] flex-col bg-white dark:bg-[#0d0f16]">
              <div className="flex-1 px-4 pt-5">
                <div className="mb-5 flex items-center gap-3">
                  <EditorAvatar
                    user={user}
                  />

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-semibold text-[#111827] dark:text-[#f8fafc]">
                      {user?.name ||
                        getDisplayText('readerPostCard.reader')}
                    </div>

                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#eef0f4] dark:bg-[#202331] px-2.5 py-1 text-[11px] font-normal text-[#374151] dark:text-white/60">
                      <i
                        className={`${getVisibilityIcon(
                          post.visibility
                        )} text-[10px]`}
                      />
                      {post.visibility ===
                      'only_me'
                        ? t('readerPostCard.onlyMe')
                        : post.visibility ===
                            'friends'
                          ? t('readerPostCard.friends')
                          : post.visibility ===
                              'followers'
                            ? t('readerPostCard.followers')
                            : t('readerPostCard.public')}
                    </div>
                  </div>
                </div>

                <textarea
                  autoFocus
                  value={content}
                  maxLength={
                    MAX_POST_LENGTH
                  }
                  onChange={(event) =>
                    setContent(
                      event.target.value.slice(
                        0,
                        MAX_POST_LENGTH
                      )
                    )
                  }
                  placeholder={t('readerPostCard.shareThoughts')}
                  className="min-h-[210px] w-full resize-none border-0 bg-white dark:bg-[#171923] p-0 text-[16px] font-normal leading-6 text-[#111827] dark:text-[#f8fafc] outline-none placeholder:text-[#9ca3af] dark:placeholder:text-white/40"
                />

                <EditImagePreview
                  imageUrls={
                    editImageUrls
                  }
                  onRemove={
                    removeEditImage
                  }
                />

                {message ? (
                  <div className="mt-3 rounded-[12px] bg-[#fff7ed] dark:bg-amber-500/10 px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412] dark:text-amber-300">
                    {message}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[#eef0f4] dark:border-white/10 bg-white dark:bg-[#171923] px-4 py-4">
                <div
                  className={`mb-3 text-right text-[11px] font-normal ${
                    content.length >=
                    MAX_POST_LENGTH
                      ? 'text-[#dc2626]'
                      : content.length >=
                          MAX_POST_LENGTH -
                            500
                        ? 'text-[#d97706]'
                        : 'text-[#9ca3af] dark:text-white/40'
                  }`}
                >
                  {content.length.toLocaleString()}{' '}
                  /{' '}
                  {MAX_POST_LENGTH.toLocaleString()}
                </div>

                <button
                  type="button"
                  disabled={
                    saving ||
                    uploadingImages ||
                    editRemainingPhotos <= 0
                  }
                  onClick={() =>
                    editFileInputRef.current?.click()
                  }
                  className="flex h-[82px] w-[112px] flex-col items-center justify-center gap-2 rounded-[18px] border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#171923] text-[#111827] dark:text-[#f8fafc] shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={t('readerPostCard.openGallery')}
                >
                  <svg
                    className="h-[27px] w-[27px]"
                    viewBox="0 0 22 26"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="16"
                      height="20"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="7.5"
                      cy="8.8"
                      r="1.45"
                      fill="currentColor"
                    />
                    <path
                      d="M5 18.8l4-4.3 3 3.2 2.2-2.4 3 3.5H5z"
                      fill="currentColor"
                    />
                  </svg>

                  <span className="text-[14px] font-normal">
                    {uploadingImages
                      ? t('readerPostCard.uploading')
                      : editRemainingPhotos <=
                          0
                        ? t('readerPostCard.photosCount', { count: MAX_POST_PHOTOS })
                        : t('readerPostCard.gallery')}
                  </span>
                </button>
              </div>
            </main>
          </ImageDropZone>
        </>
      ) : null}
    </>
  )
}


export default function ReaderPostCard(
  props
) {
  return (
    <StandardReaderPostCard
      {...props}
    />
  )
}

