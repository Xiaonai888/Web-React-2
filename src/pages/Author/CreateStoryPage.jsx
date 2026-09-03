import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import ImageDropZone from '../../components/common/ImageDropZone'
import {
  AdultHintPopup,
  GenreSheet,
  LanguageWheelPicker,
  SettingsToggle,
  TagSheet,
} from './EpisodeEditorPage'
import CompletedStoryConfirmModal from '../../components/author/CompletedStoryConfirmModal'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('createStory', {
  en: {
    closeCropEditor: 'Close crop editor', zoom: 'Zoom', cropTip: 'Tip: Drag inside the image to move. Use the Zoom slider if pinch does not work well on your phone browser.', cancel: 'Cancel', saveCrop: 'Save Crop', closeEditor: 'Close editor', save: 'Save', descriptionPlaceholder: 'Tell readers what makes your story worth opening.', titlePlaceholder: 'Add your story title', slideNumber: 'Slide {{count}}', oldSlideLoaded: 'Old slide loaded', tapEditCrop: 'Tap image to edit crop', active: 'Active', inactive: 'Inactive', failedUploadImage: 'Failed to upload image', failedLoadStory: 'Failed to load story', maxSlides: 'Maximum 5 slides allowed.', adjustImage: 'Please adjust the image first.', cropFailed: 'Could not save crop. Please try another image.', enterTitle: 'Please enter your story title.', addPortraitCover: 'Please add a portrait cover.', addSummary: 'Please add your story summary.', confirmRights: 'Please confirm the rights and author agreement.', descriptionTooLong: 'Description is too long. Maximum is 5000 characters.', loginFirst: 'Please login first.', updateFailed: 'Failed to update story', createFailed: 'Failed to create story', updatedMissingId: 'Story updated but story id was missing', createdMissingId: 'Story created but story id was missing', cannotConnect: 'Cannot connect to backend. Make sure backend is deployed.', cropMangaCover: 'Crop Manga Cover', cropBookCover: 'Crop Book Cover', cropLandscape: 'Crop Landscape Thumbnail', cropMangaSlide: 'Crop Manga Slide', cropStorySlide: 'Crop Story Slide', cropMangaCoverHelp: 'Drag the image to fit the vertical 2:3 manga cover.', cropBookCoverHelp: 'Drag the image to fit the vertical 2:3 book cover.', cropLandscapeHelp: 'Drag the image to fit the horizontal 16:9 thumbnail.', cropMangaSlideHelp: 'Drag the image to fit the 16:9 manga slide.', cropStorySlideHelp: 'Drag the image to fit the 16:9 story slide.', manga: 'manga', chatStory: 'chat story', novel: 'novel', updateManga: 'Update Manga', updateChatStory: 'Update Chat Story', updateNovel: 'Update Novel', createManga: 'Create Manga', createChatStory: 'Create Chat Story', createNovel: 'Create Novel', adultTitle: '18+ Story', adultDescription: 'Stories marked 18+ are hidden from readers under 18. Readers aged 18 or older can view and read them normally.', storyLanguage: 'Story Language', mangaTitle: 'Manga Title', storyTitle: 'Story Title', description: 'Description', needTitleHelp: 'Need help choosing a title?', getTitleIdeas: 'Get title ideas', needDescriptionHelp: 'Need help writing a description?', getIdeas: 'Get ideas', closeCoverMedia: 'Close cover and media', coverMedia: 'Cover & Media', mangaCover: 'Manga Cover', bookCover: 'Book Cover', portraitCover: 'Portrait Cover', dropCoverImage: 'Drop cover image here', portraitMangaCover: 'Portrait Manga Cover', portraitBookCover: 'Portrait Book Cover', replace: 'Replace', dropOrTapCover: 'Drop or Tap Cover', crop23: '2:3 crop', landscapeThumbnail: 'Landscape Thumbnail', dropThumbnailImage: 'Drop thumbnail image here', landscapeThumbnailAlt: 'Landscape Thumbnail', dropOrAddThumbnail: 'Drop or Add Thumbnail', crop169: '16:9 crop', mangaSlides: 'Manga Slides', storySlides: 'Story Slides', optionalCropPreview: 'Optional, 16:9 crop preview', add: '+ Add', dropSlideImage: 'Drop slide image here', dropOrAddMangaSlide: 'Drop or Add Manga Slide', dropOrAddStorySlide: 'Drop or Add Story Slide', mediaHelpManga: 'Portrait cover uses 2:3 crop. Landscape thumbnail and manga slides use 16:9 crop. Tap an image again to adjust crop.', mediaHelpStory: 'Portrait cover uses 2:3 crop. Landscape thumbnail and story slides use 16:9 crop. Tap an image again to adjust crop.', goBack: 'Go back', mangaInfo: 'Manga Info', storyInfo: 'Story Info', characters: 'Characters', chat: 'Chat', publish: 'Publish', firstMangaEpisode: 'First Manga Episode', firstEpisode: 'First Episode', loadingOldStory: 'Loading old story data...', cover: 'Cover', coverHelp: 'Add the portrait cover readers will see first.', addCover: 'Add cover', addMangaTitle: 'Add your manga title', addStoryTitle: 'Add your story title', chooseLanguage: 'Choose language', mainGenre: 'Main Genre', chooseGenre: 'Choose genre', tags: 'Tags', chooseTags: 'Choose up to 6 tags', updateDays: 'Update Days', storyStatus: 'Story Status', completed: 'Completed', toggleCompleted: 'Toggle completed story', aboutAdult: 'About 18+ story', toggleAdult: 'Toggle 18+ story', basicInfoNoteManga: 'This step only collects the basic information. After creating your manga, open Update Manga to complete the remaining details.', basicInfoNoteChat: 'This step only collects the basic information. After creating your chat story, open Update Chat Story to complete the remaining details.', basicInfoNoteNovel: 'This step only collects the basic information. After creating your novel, open Update Novel to complete the remaining details.', savingChanges: 'Saving Changes...', uploadingCreatingManga: 'Uploading & Creating Manga...', uploadingCreatingStory: 'Uploading & Creating Story...', saveChanges: 'Save Changes', createStory: 'Create Story', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'
  },
  km: {
    closeCropEditor: 'បិទកម្មវិធីកាត់រូប', zoom: 'ពង្រីក', cropTip: 'គន្លឹះ៖ អូសក្នុងរូបដើម្បីផ្លាស់ទី។ ប្រើស្លាយពង្រីក ប្រសិនបើ pinch មិនដំណើរការល្អលើទូរស័ព្ទ។', cancel: 'បោះបង់', saveCrop: 'រក្សាទុកការកាត់', closeEditor: 'បិទកម្មវិធីកែ', save: 'រក្សាទុក', descriptionPlaceholder: 'ប្រាប់អ្នកអានពីអ្វីដែលធ្វើឱ្យរឿងរបស់អ្នកគួរឱ្យចង់បើកអាន។', titlePlaceholder: 'បន្ថែមចំណងជើងរឿង', slideNumber: 'Slide {{count}}', oldSlideLoaded: 'បានផ្ទុក Slide ចាស់', tapEditCrop: 'ចុចរូបដើម្បីកែការកាត់', active: 'ដំណើរការ', inactive: 'មិនដំណើរការ', failedUploadImage: 'បញ្ចូលរូបមិនបាន', failedLoadStory: 'ផ្ទុករឿងមិនបាន', maxSlides: 'អាចដាក់បានអតិបរមា 5 Slide។', adjustImage: 'សូមកែសម្រួលរូបជាមុន។', cropFailed: 'រក្សាទុកការកាត់មិនបាន។ សូមសាករូបផ្សេង។', enterTitle: 'សូមបញ្ចូលចំណងជើងរឿង។', addPortraitCover: 'សូមបន្ថែម Cover បញ្ឈរ។', addSummary: 'សូមបន្ថែមសេចក្ដីសង្ខេបរឿង។', confirmRights: 'សូមបញ្ជាក់សិទ្ធិ និងកិច្ចព្រមព្រៀងអ្នកនិពន្ធ។', descriptionTooLong: 'សេចក្ដីពិពណ៌នាវែងពេក។ អតិបរមា 5000 តួអក្សរ។', loginFirst: 'សូម Login ជាមុន។', updateFailed: 'កែប្រែរឿងមិនបាន', createFailed: 'បង្កើតរឿងមិនបាន', updatedMissingId: 'បានកែរឿង ប៉ុន្តែរក story id មិនឃើញ', createdMissingId: 'បានបង្កើតរឿង ប៉ុន្តែរក story id មិនឃើញ', cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បាន។ សូមប្រាកដថា Backend បាន deploy។', cropMangaCover: 'កាត់ Manga Cover', cropBookCover: 'កាត់ Book Cover', cropLandscape: 'កាត់ Landscape Thumbnail', cropMangaSlide: 'កាត់ Manga Slide', cropStorySlide: 'កាត់ Story Slide', cropMangaCoverHelp: 'អូសរូបឱ្យសមនឹង Manga Cover បញ្ឈរ 2:3។', cropBookCoverHelp: 'អូសរូបឱ្យសមនឹង Book Cover បញ្ឈរ 2:3។', cropLandscapeHelp: 'អូសរូបឱ្យសមនឹង Thumbnail ផ្ដេក 16:9។', cropMangaSlideHelp: 'អូសរូបឱ្យសមនឹង Manga Slide 16:9។', cropStorySlideHelp: 'អូសរូបឱ្យសមនឹង Story Slide 16:9។', manga: 'Manga', chatStory: 'Chat Story', novel: 'Novel', updateManga: 'កែ Manga', updateChatStory: 'កែ Chat Story', updateNovel: 'កែ Novel', createManga: 'បង្កើត Manga', createChatStory: 'បង្កើត Chat Story', createNovel: 'បង្កើត Novel', adultTitle: 'រឿង 18+', adultDescription: 'រឿងដែលសម្គាល់ 18+ នឹងលាក់ពីអ្នកអានអាយុក្រោម 18 ឆ្នាំ។ អ្នកអានអាយុ 18 ឆ្នាំឡើងអាចមើល និងអានបានធម្មតា។', storyLanguage: 'ភាសារឿង', mangaTitle: 'ចំណងជើង Manga', storyTitle: 'ចំណងជើងរឿង', description: 'សេចក្ដីពិពណ៌នា', needTitleHelp: 'ត្រូវការជំនួយជ្រើសចំណងជើង?', getTitleIdeas: 'យកគំនិតចំណងជើង', needDescriptionHelp: 'ត្រូវការជំនួយសរសេរសេចក្ដីពិពណ៌នា?', getIdeas: 'យកគំនិត', closeCoverMedia: 'បិទ Cover និង Media', coverMedia: 'Cover និង Media', mangaCover: 'Manga Cover', bookCover: 'Book Cover', portraitCover: 'Cover បញ្ឈរ', dropCoverImage: 'ទម្លាក់រូប Cover នៅទីនេះ', portraitMangaCover: 'Manga Cover បញ្ឈរ', portraitBookCover: 'Book Cover បញ្ឈរ', replace: 'ប្ដូរ', dropOrTapCover: 'ទម្លាក់ ឬចុចដាក់ Cover', crop23: 'កាត់ 2:3', landscapeThumbnail: 'Thumbnail ផ្ដេក', dropThumbnailImage: 'ទម្លាក់រូប Thumbnail នៅទីនេះ', landscapeThumbnailAlt: 'Thumbnail ផ្ដេក', dropOrAddThumbnail: 'ទម្លាក់ ឬបន្ថែម Thumbnail', crop169: 'កាត់ 16:9', mangaSlides: 'Manga Slides', storySlides: 'Story Slides', optionalCropPreview: 'ស្រេចចិត្ត, មើលជាមុនការកាត់ 16:9', add: '+ បន្ថែម', dropSlideImage: 'ទម្លាក់រូប Slide នៅទីនេះ', dropOrAddMangaSlide: 'ទម្លាក់ ឬបន្ថែម Manga Slide', dropOrAddStorySlide: 'ទម្លាក់ ឬបន្ថែម Story Slide', mediaHelpManga: 'Cover បញ្ឈរប្រើ 2:3។ Thumbnail ផ្ដេក និង Manga Slides ប្រើ 16:9។ ចុចរូបម្ដងទៀតដើម្បីកែការកាត់។', mediaHelpStory: 'Cover បញ្ឈរប្រើ 2:3។ Thumbnail ផ្ដេក និង Story Slides ប្រើ 16:9។ ចុចរូបម្ដងទៀតដើម្បីកែការកាត់។', goBack: 'ត្រឡប់ក្រោយ', mangaInfo: 'ព័ត៌មាន Manga', storyInfo: 'ព័ត៌មានរឿង', characters: 'តួអង្គ', chat: 'Chat', publish: 'បោះពុម្ព', firstMangaEpisode: 'Manga Episode ដំបូង', firstEpisode: 'Episode ដំបូង', loadingOldStory: 'កំពុងផ្ទុកទិន្នន័យរឿងចាស់...', cover: 'Cover', coverHelp: 'បន្ថែម Cover បញ្ឈរដែលអ្នកអាននឹងឃើញមុនគេ។', addCover: 'បន្ថែម Cover', addMangaTitle: 'បន្ថែមចំណងជើង Manga', addStoryTitle: 'បន្ថែមចំណងជើងរឿង', chooseLanguage: 'ជ្រើសភាសា', mainGenre: 'ប្រភេទរឿងសំខាន់', chooseGenre: 'ជ្រើសប្រភេទរឿង', tags: 'Tags', chooseTags: 'ជ្រើសបានដល់ 6 Tags', updateDays: 'ថ្ងៃ Update', storyStatus: 'ស្ថានភាពរឿង', completed: 'បានបញ្ចប់', toggleCompleted: 'ប្ដូរស្ថានភាពរឿងបានបញ្ចប់', aboutAdult: 'អំពីរឿង 18+', toggleAdult: 'ប្ដូររឿង 18+', basicInfoNoteManga: 'ជំហាននេះប្រមូលតែព័ត៌មានមូលដ្ឋាន។ បន្ទាប់ពីបង្កើត Manga សូមបើក កែ Manga ដើម្បីបំពេញព័ត៌មានដែលនៅសល់។', basicInfoNoteChat: 'ជំហាននេះប្រមូលតែព័ត៌មានមូលដ្ឋាន។ បន្ទាប់ពីបង្កើត Chat Story សូមបើក កែ Chat Story ដើម្បីបំពេញព័ត៌មានដែលនៅសល់។', basicInfoNoteNovel: 'ជំហាននេះប្រមូលតែព័ត៌មានមូលដ្ឋាន។ បន្ទាប់ពីបង្កើត Novel សូមបើក កែ Novel ដើម្បីបំពេញព័ត៌មានដែលនៅសល់។', savingChanges: 'កំពុងរក្សាទុកការកែ...', uploadingCreatingManga: 'កំពុង Upload និងបង្កើត Manga...', uploadingCreatingStory: 'កំពុង Upload និងបង្កើត Story...', saveChanges: 'រក្សាទុកការកែ', createStory: 'បង្កើតរឿង', mon: 'ច', tue: 'អ', wed: 'ព', thu: 'ព្រ', fri: 'សុ', sat: 'ស', sun: 'អា'
  },
  zh: {
    closeCropEditor: '关闭裁剪编辑器', zoom: '缩放', cropTip: '提示：在图片内拖动可移动。若手机双指缩放不顺畅，请使用缩放滑块。', cancel: '取消', saveCrop: '保存裁剪', closeEditor: '关闭编辑器', save: '保存', descriptionPlaceholder: '告诉读者为什么你的故事值得点开。', titlePlaceholder: '添加故事标题', slideNumber: '幻灯片 {{count}}', oldSlideLoaded: '已载入旧幻灯片', tapEditCrop: '点击图片编辑裁剪', active: '启用', inactive: '停用', failedUploadImage: '图片上传失败', failedLoadStory: '加载故事失败', maxSlides: '最多允许 5 张幻灯片。', adjustImage: '请先调整图片。', cropFailed: '无法保存裁剪，请尝试其他图片。', enterTitle: '请输入故事标题。', addPortraitCover: '请添加竖版封面。', addSummary: '请添加故事简介。', confirmRights: '请确认版权与作者协议。', descriptionTooLong: '简介过长，最多 5000 个字符。', loginFirst: '请先登录。', updateFailed: '更新故事失败', createFailed: '创建故事失败', updatedMissingId: '故事已更新，但缺少故事 ID', createdMissingId: '故事已创建，但缺少故事 ID', cannotConnect: '无法连接后端，请确认后端已部署。', cropMangaCover: '裁剪漫画封面', cropBookCover: '裁剪书籍封面', cropLandscape: '裁剪横向缩略图', cropMangaSlide: '裁剪漫画幻灯片', cropStorySlide: '裁剪故事幻灯片', cropMangaCoverHelp: '拖动图片以适配 2:3 竖版漫画封面。', cropBookCoverHelp: '拖动图片以适配 2:3 竖版书籍封面。', cropLandscapeHelp: '拖动图片以适配 16:9 横向缩略图。', cropMangaSlideHelp: '拖动图片以适配 16:9 漫画幻灯片。', cropStorySlideHelp: '拖动图片以适配 16:9 故事幻灯片。', manga: '漫画', chatStory: '聊天故事', novel: '小说', updateManga: '更新漫画', updateChatStory: '更新聊天故事', updateNovel: '更新小说', createManga: '创建漫画', createChatStory: '创建聊天故事', createNovel: '创建小说', adultTitle: '18+ 故事', adultDescription: '标记为 18+ 的故事会对未满 18 岁的读者隐藏。18 岁及以上读者可以正常查看和阅读。', storyLanguage: '故事语言', mangaTitle: '漫画标题', storyTitle: '故事标题', description: '简介', needTitleHelp: '需要标题帮助？', getTitleIdeas: '获取标题灵感', needDescriptionHelp: '需要简介帮助？', getIdeas: '获取灵感', closeCoverMedia: '关闭封面与媒体', coverMedia: '封面与媒体', mangaCover: '漫画封面', bookCover: '书籍封面', portraitCover: '竖版封面', dropCoverImage: '将封面图片拖到这里', portraitMangaCover: '竖版漫画封面', portraitBookCover: '竖版书籍封面', replace: '替换', dropOrTapCover: '拖放或点击添加封面', crop23: '2:3 裁剪', landscapeThumbnail: '横向缩略图', dropThumbnailImage: '将缩略图拖到这里', landscapeThumbnailAlt: '横向缩略图', dropOrAddThumbnail: '拖放或添加缩略图', crop169: '16:9 裁剪', mangaSlides: '漫画幻灯片', storySlides: '故事幻灯片', optionalCropPreview: '可选，16:9 裁剪预览', add: '+ 添加', dropSlideImage: '将幻灯片图片拖到这里', dropOrAddMangaSlide: '拖放或添加漫画幻灯片', dropOrAddStorySlide: '拖放或添加故事幻灯片', mediaHelpManga: '竖版封面使用 2:3 裁剪。横向缩略图和漫画幻灯片使用 16:9。再次点击图片可调整裁剪。', mediaHelpStory: '竖版封面使用 2:3 裁剪。横向缩略图和故事幻灯片使用 16:9。再次点击图片可调整裁剪。', goBack: '返回', mangaInfo: '漫画信息', storyInfo: '故事信息', characters: '角色', chat: '聊天', publish: '发布', firstMangaEpisode: '第一话漫画', firstEpisode: '第一章', loadingOldStory: '正在加载旧故事数据...', cover: '封面', coverHelp: '添加读者最先看到的竖版封面。', addCover: '添加封面', addMangaTitle: '添加漫画标题', addStoryTitle: '添加故事标题', chooseLanguage: '选择语言', mainGenre: '主要类型', chooseGenre: '选择类型', tags: '标签', chooseTags: '最多选择 6 个标签', updateDays: '更新日', storyStatus: '故事状态', completed: '已完结', toggleCompleted: '切换完结状态', aboutAdult: '关于 18+ 故事', toggleAdult: '切换 18+ 故事', basicInfoNoteManga: '此步骤只收集基本信息。创建漫画后，请打开“更新漫画”完成其余信息。', basicInfoNoteChat: '此步骤只收集基本信息。创建聊天故事后，请打开“更新聊天故事”完成其余信息。', basicInfoNoteNovel: '此步骤只收集基本信息。创建小说后，请打开“更新小说”完成其余信息。', savingChanges: '正在保存更改...', uploadingCreatingManga: '正在上传并创建漫画...', uploadingCreatingStory: '正在上传并创建故事...', saveChanges: '保存更改', createStory: '创建故事', mon: '周一', tue: '周二', wed: '周三', thu: '周四', fri: '周五', sat: '周六', sun: '周日'
  },
  ja: {
    closeCropEditor: '切り抜きエディターを閉じる', zoom: 'ズーム', cropTip: 'ヒント：画像内をドラッグして移動できます。ピンチ操作がうまく動かない場合はズームスライダーを使ってください。', cancel: 'キャンセル', saveCrop: '切り抜きを保存', closeEditor: 'エディターを閉じる', save: '保存', descriptionPlaceholder: '読者が作品を開きたくなる魅力を伝えましょう。', titlePlaceholder: '作品タイトルを追加', slideNumber: 'スライド {{count}}', oldSlideLoaded: '以前のスライドを読み込みました', tapEditCrop: '画像をタップして切り抜きを編集', active: '有効', inactive: '無効', failedUploadImage: '画像のアップロードに失敗しました', failedLoadStory: '作品の読み込みに失敗しました', maxSlides: 'スライドは最大5枚です。', adjustImage: '先に画像を調整してください。', cropFailed: '切り抜きを保存できませんでした。別の画像をお試しください。', enterTitle: '作品タイトルを入力してください。', addPortraitCover: '縦型カバーを追加してください。', addSummary: '作品のあらすじを追加してください。', confirmRights: '権利と作者契約を確認してください。', descriptionTooLong: '説明が長すぎます。最大5000文字です。', loginFirst: '先にログインしてください。', updateFailed: '作品の更新に失敗しました', createFailed: '作品の作成に失敗しました', updatedMissingId: '作品は更新されましたが作品IDがありません', createdMissingId: '作品は作成されましたが作品IDがありません', cannotConnect: 'バックエンドに接続できません。デプロイ済みか確認してください。', cropMangaCover: '漫画カバーを切り抜く', cropBookCover: 'ブックカバーを切り抜く', cropLandscape: '横長サムネイルを切り抜く', cropMangaSlide: '漫画スライドを切り抜く', cropStorySlide: '作品スライドを切り抜く', cropMangaCoverHelp: '画像をドラッグして縦型2:3の漫画カバーに合わせてください。', cropBookCoverHelp: '画像をドラッグして縦型2:3のブックカバーに合わせてください。', cropLandscapeHelp: '画像をドラッグして横型16:9のサムネイルに合わせてください。', cropMangaSlideHelp: '画像をドラッグして16:9の漫画スライドに合わせてください。', cropStorySlideHelp: '画像をドラッグして16:9の作品スライドに合わせてください。', manga: '漫画', chatStory: 'チャットストーリー', novel: '小説', updateManga: '漫画を更新', updateChatStory: 'チャットストーリーを更新', updateNovel: '小説を更新', createManga: '漫画を作成', createChatStory: 'チャットストーリーを作成', createNovel: '小説を作成', adultTitle: '18+ 作品', adultDescription: '18+ に設定した作品は18歳未満の読者には表示されません。18歳以上の読者は通常どおり閲覧できます。', storyLanguage: '作品言語', mangaTitle: '漫画タイトル', storyTitle: '作品タイトル', description: '説明', needTitleHelp: 'タイトル選びのヒントが必要ですか？', getTitleIdeas: 'タイトル案を見る', needDescriptionHelp: '説明文のヒントが必要ですか？', getIdeas: 'アイデアを見る', closeCoverMedia: 'カバーとメディアを閉じる', coverMedia: 'カバーとメディア', mangaCover: '漫画カバー', bookCover: 'ブックカバー', portraitCover: '縦型カバー', dropCoverImage: 'カバー画像をここにドロップ', portraitMangaCover: '縦型漫画カバー', portraitBookCover: '縦型ブックカバー', replace: '置き換え', dropOrTapCover: 'ドロップまたはタップしてカバーを追加', crop23: '2:3 切り抜き', landscapeThumbnail: '横長サムネイル', dropThumbnailImage: 'サムネイル画像をここにドロップ', landscapeThumbnailAlt: '横長サムネイル', dropOrAddThumbnail: 'ドロップまたは追加', crop169: '16:9 切り抜き', mangaSlides: '漫画スライド', storySlides: '作品スライド', optionalCropPreview: '任意、16:9 切り抜きプレビュー', add: '+ 追加', dropSlideImage: 'スライド画像をここにドロップ', dropOrAddMangaSlide: '漫画スライドをドロップまたは追加', dropOrAddStorySlide: '作品スライドをドロップまたは追加', mediaHelpManga: '縦型カバーは2:3、横長サムネイルと漫画スライドは16:9です。画像をもう一度タップすると切り抜きを調整できます。', mediaHelpStory: '縦型カバーは2:3、横長サムネイルと作品スライドは16:9です。画像をもう一度タップすると切り抜きを調整できます。', goBack: '戻る', mangaInfo: '漫画情報', storyInfo: '作品情報', characters: 'キャラクター', chat: 'チャット', publish: '公開', firstMangaEpisode: '最初の漫画エピソード', firstEpisode: '最初のエピソード', loadingOldStory: '以前の作品データを読み込み中...', cover: 'カバー', coverHelp: '読者が最初に見る縦型カバーを追加します。', addCover: 'カバーを追加', addMangaTitle: '漫画タイトルを追加', addStoryTitle: '作品タイトルを追加', chooseLanguage: '言語を選択', mainGenre: 'メインジャンル', chooseGenre: 'ジャンルを選択', tags: 'タグ', chooseTags: '最大6個のタグを選択', updateDays: '更新日', storyStatus: '作品ステータス', completed: '完結', toggleCompleted: '完結状態を切り替える', aboutAdult: '18+ 作品について', toggleAdult: '18+ 作品を切り替える', basicInfoNoteManga: 'このステップでは基本情報のみを入力します。漫画を作成した後、「漫画を更新」を開いて残りの情報を完成してください。', basicInfoNoteChat: 'このステップでは基本情報のみを入力します。チャットストーリーを作成した後、「チャットストーリーを更新」を開いて残りの情報を完成してください。', basicInfoNoteNovel: 'このステップでは基本情報のみを入力します。小説を作成した後、「小説を更新」を開いて残りの情報を完成してください。', savingChanges: '変更を保存中...', uploadingCreatingManga: '漫画をアップロード・作成中...', uploadingCreatingStory: '作品をアップロード・作成中...', saveChanges: '変更を保存', createStory: '作品を作成', mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日'
  },
  ko: {
    closeCropEditor: '자르기 편집기 닫기', zoom: '확대', cropTip: '팁: 이미지 안을 드래그해 이동하세요. 핀치가 잘 작동하지 않으면 확대 슬라이더를 사용하세요.', cancel: '취소', saveCrop: '자르기 저장', closeEditor: '편집기 닫기', save: '저장', descriptionPlaceholder: '독자가 작품을 열어 보고 싶게 만드는 매력을 알려 주세요.', titlePlaceholder: '작품 제목 추가', slideNumber: '슬라이드 {{count}}', oldSlideLoaded: '기존 슬라이드 불러옴', tapEditCrop: '이미지를 눌러 자르기 편집', active: '활성', inactive: '비활성', failedUploadImage: '이미지 업로드에 실패했습니다', failedLoadStory: '작품을 불러오지 못했습니다', maxSlides: '슬라이드는 최대 5개까지 가능합니다.', adjustImage: '먼저 이미지를 조정해 주세요.', cropFailed: '자르기를 저장하지 못했습니다. 다른 이미지를 사용해 주세요.', enterTitle: '작품 제목을 입력해 주세요.', addPortraitCover: '세로형 커버를 추가해 주세요.', addSummary: '작품 설명을 추가해 주세요.', confirmRights: '권리와 작가 동의를 확인해 주세요.', descriptionTooLong: '설명이 너무 깁니다. 최대 5000자입니다.', loginFirst: '먼저 로그인해 주세요.', updateFailed: '작품 업데이트에 실패했습니다', createFailed: '작품 만들기에 실패했습니다', updatedMissingId: '작품은 업데이트되었지만 작품 ID가 없습니다', createdMissingId: '작품은 만들어졌지만 작품 ID가 없습니다', cannotConnect: '백엔드에 연결할 수 없습니다. 배포 상태를 확인해 주세요.', cropMangaCover: '만화 커버 자르기', cropBookCover: '책 커버 자르기', cropLandscape: '가로 썸네일 자르기', cropMangaSlide: '만화 슬라이드 자르기', cropStorySlide: '작품 슬라이드 자르기', cropMangaCoverHelp: '이미지를 드래그해 세로 2:3 만화 커버에 맞춰 주세요.', cropBookCoverHelp: '이미지를 드래그해 세로 2:3 책 커버에 맞춰 주세요.', cropLandscapeHelp: '이미지를 드래그해 가로 16:9 썸네일에 맞춰 주세요.', cropMangaSlideHelp: '이미지를 드래그해 16:9 만화 슬라이드에 맞춰 주세요.', cropStorySlideHelp: '이미지를 드래그해 16:9 작품 슬라이드에 맞춰 주세요.', manga: '만화', chatStory: '채팅 스토리', novel: '소설', updateManga: '만화 업데이트', updateChatStory: '채팅 스토리 업데이트', updateNovel: '소설 업데이트', createManga: '만화 만들기', createChatStory: '채팅 스토리 만들기', createNovel: '소설 만들기', adultTitle: '18+ 작품', adultDescription: '18+로 표시된 작품은 18세 미만 독자에게 숨겨집니다. 18세 이상 독자는 정상적으로 보고 읽을 수 있습니다.', storyLanguage: '작품 언어', mangaTitle: '만화 제목', storyTitle: '작품 제목', description: '설명', needTitleHelp: '제목을 고르는 데 도움이 필요하신가요?', getTitleIdeas: '제목 아이디어 보기', needDescriptionHelp: '설명을 쓰는 데 도움이 필요하신가요?', getIdeas: '아이디어 보기', closeCoverMedia: '커버와 미디어 닫기', coverMedia: '커버와 미디어', mangaCover: '만화 커버', bookCover: '책 커버', portraitCover: '세로 커버', dropCoverImage: '커버 이미지를 여기에 놓으세요', portraitMangaCover: '세로 만화 커버', portraitBookCover: '세로 책 커버', replace: '교체', dropOrTapCover: '커버를 놓거나 눌러 추가', crop23: '2:3 자르기', landscapeThumbnail: '가로 썸네일', dropThumbnailImage: '썸네일 이미지를 여기에 놓으세요', landscapeThumbnailAlt: '가로 썸네일', dropOrAddThumbnail: '썸네일 놓기 또는 추가', crop169: '16:9 자르기', mangaSlides: '만화 슬라이드', storySlides: '작품 슬라이드', optionalCropPreview: '선택, 16:9 자르기 미리보기', add: '+ 추가', dropSlideImage: '슬라이드 이미지를 여기에 놓으세요', dropOrAddMangaSlide: '만화 슬라이드 놓기 또는 추가', dropOrAddStorySlide: '작품 슬라이드 놓기 또는 추가', mediaHelpManga: '세로 커버는 2:3, 가로 썸네일과 만화 슬라이드는 16:9를 사용합니다. 이미지를 다시 누르면 자르기를 조정할 수 있습니다.', mediaHelpStory: '세로 커버는 2:3, 가로 썸네일과 작품 슬라이드는 16:9를 사용합니다. 이미지를 다시 누르면 자르기를 조정할 수 있습니다.', goBack: '뒤로', mangaInfo: '만화 정보', storyInfo: '작품 정보', characters: '캐릭터', chat: '채팅', publish: '공개', firstMangaEpisode: '첫 만화 에피소드', firstEpisode: '첫 에피소드', loadingOldStory: '기존 작품 데이터를 불러오는 중...', cover: '커버', coverHelp: '독자가 가장 먼저 보게 될 세로형 커버를 추가하세요.', addCover: '커버 추가', addMangaTitle: '만화 제목 추가', addStoryTitle: '작품 제목 추가', chooseLanguage: '언어 선택', mainGenre: '메인 장르', chooseGenre: '장르 선택', tags: '태그', chooseTags: '태그 최대 6개 선택', updateDays: '업데이트 요일', storyStatus: '작품 상태', completed: '완결', toggleCompleted: '완결 상태 전환', aboutAdult: '18+ 작품 안내', toggleAdult: '18+ 작품 전환', basicInfoNoteManga: '이 단계에서는 기본 정보만 입력합니다. 만화를 만든 후 “만화 업데이트”를 열어 나머지 정보를 완성하세요.', basicInfoNoteChat: '이 단계에서는 기본 정보만 입력합니다. 채팅 스토리를 만든 후 “채팅 스토리 업데이트”를 열어 나머지 정보를 완성하세요.', basicInfoNoteNovel: '이 단계에서는 기본 정보만 입력합니다. 소설을 만든 후 “소설 업데이트”를 열어 나머지 정보를 완성하세요.', savingChanges: '변경사항 저장 중...', uploadingCreatingManga: '만화 업로드 및 생성 중...', uploadingCreatingStory: '작품 업로드 및 생성 중...', saveChanges: '변경사항 저장', createStory: '작품 만들기', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일'
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const languages = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']
const fallbackGenres = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Comedy', 'Drama']
const tagOptions = [
  'CEO',
  'Slow Burn',
  'Enemies to Lovers',
  'Time Travel',
  'Revenge',
  'Strong Female Lead',
  'Hidden Identity',
  'Royalty',
  'Magic',
  'Supernatural',
  'Second Chance',
  'Cold Male Lead',
]
const updateDayOptions = [
  { value: 'Mon', labelKey: 'mon' },
  { value: 'Tue', labelKey: 'tue' },
  { value: 'Wed', labelKey: 'wed' },
  { value: 'Thu', labelKey: 'thu' },
  { value: 'Fri', labelKey: 'fri' },
  { value: 'Sat', labelKey: 'sat' },
  { value: 'Sun', labelKey: 'sun' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
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
  if (!imageDataUrl || String(imageDataUrl).startsWith('http')) return imageDataUrl || null

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
    throw new Error(data.message || getDisplayText('createStory.failedUploadImage'))
  }

  return data.image_url || data.imageUrl
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

  return canvas.toDataURL('image/jpeg', 0.9)
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
          active ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-bold ${active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'}`}>
        {title}
      </div>
    </div>
  )
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
      {children}
      {required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none transition focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
    />
  )
}

function SelectInput(props) {
  return (
    <div className="relative">
      <select
  {...props}
  className="h-12 w-full appearance-none rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 pr-10 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none transition focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
/>
      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--shadow-text-tertiary)]" />
    </div>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/10 px-6"
    >
      <div className="max-w-[360px] rounded-[18px] bg-[var(--shadow-bg-surface)] px-5 py-4 text-center text-[14px] font-bold leading-6 text-[var(--shadow-text-primary)] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

function CropImageModal({
  open,
  title,
  helper,
  image,
  crop,
  zoom,
  aspect,
  cropMode,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] overflow-y-auto bg-black/50 px-4 py-4">
      <div className="mx-auto flex min-h-full w-full max-w-[560px] items-center justify-center">
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{title}</h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-tertiary)]">{helper}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={t('createStory.closeCropEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <div
            className={`relative mx-auto overflow-hidden rounded-[20px] bg-[#111827] ${
              cropMode === 'cover'
                ? 'h-[72vh] max-h-[480px] min-h-[360px] w-[min(78vw,320px)]'
                : 'h-[52vw] max-h-[360px] min-h-[210px] w-full'
            }`}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
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
              <span>{t('createStory.zoom')}</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>

            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-full accent-[var(--shadow-text-primary)]"
            />
          </div>

          <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {t('createStory.cropTip')}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-bold text-[var(--shadow-text-primary)] active:scale-[0.99]"
            >
              {t('createStory.cancel')}
            </button>

            <button
              type="button"
              onClick={onSave}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-bold text-[var(--shadow-bg-surface)] active:scale-[0.99]"
            >
              {t('createStory.saveCrop')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



function StoryTextSheet({
  open,
  title,
  value,
  onChange,
  onClose,
  onSave,
  multiline = false,
  maxLength = 200,
  guideText = '',
  guideAction = '',
  onOpenGuide = null,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  const canSave = Boolean(value.trim()) && value.length <= maxLength


    return (
  <div
    className="fixed inset-0 z-[150] flex items-end justify-center bg-black/35"
    onClick={onClose}
  >
    <div className="w-full sm:max-w-5xl sm:px-4">
      <div
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:rounded-[12px] sm:px-5 sm:pb-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-full">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
              aria-label={t('createStory.closeEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>

            <h2 className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[var(--shadow-text-primary)]">
              {title}
            </h2>

            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="h-8 shrink-0 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-bold text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)]"
            >
              {t('createStory.save')}
            </button>
          </div>

          <div className="mt-4">
            {multiline ? (
              <>
                <textarea
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  maxLength={maxLength}
                  autoFocus
                  placeholder={t('createStory.descriptionPlaceholder')}
                  className="min-h-[190px] max-h-[42vh] w-full resize-none rounded-[10px] bg-[var(--shadow-input-bg)] px-3 py-3 text-[14px] leading-6 text-[var(--shadow-text-primary)] outline-none"
                />

                <div className="mt-2 text-right text-[11px] font-medium text-[var(--shadow-text-tertiary)]">
                  {value.length}/{maxLength}
                </div>
              </>
            ) : (
              <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                maxLength={maxLength}
                autoFocus
                placeholder={t('createStory.titlePlaceholder')}
                className="h-12 w-full rounded-[10px] bg-[var(--shadow-input-bg)] px-3 text-[14px] text-[var(--shadow-text-primary)] outline-none"
              />
            )}
          </div>

          {guideText && guideAction && onOpenGuide ? (
            <button
              type="button"
              onClick={onOpenGuide}
              className="mt-3 flex w-full items-center gap-2 rounded-[10px] px-2 py-2.5 text-left active:bg-[var(--shadow-input-bg)]"
            >
              <img
                src="/assets/Icons/Hint.svg"
                alt=""
                className="h-[16px] w-[16px] shrink-0 object-contain"
              />
              <span className="min-w-0 truncate text-[13px] text-[var(--shadow-text-secondary)]">
                {guideText}
              </span>
              <span className="ml-0.5 shrink-0 text-[13px] font-medium text-[#e5484d]">
                {guideAction}
              </span>
              <i className="fa-solid fa-chevron-right shrink-0 text-[9px] text-[#e5484d]" />
            </button>
          ) : null}
                </div>
      </div>
    </div>
  </div>
)
}







function getUpdateHintLabel(days) {
  if (!Array.isArray(days) || days.length === 0) return 'Irregular'
  if (days.length === 7) return 'Everyday'
  if (days.length === 1) return `Every ${days[0]}`
  if (days.length === 2) return days.join(', ')
  return `${days.length} days/week`
}

function toggleUpdateDay(currentDays, day) {
  if (currentDays.includes(day)) {
    return currentDays.filter((item) => item !== day)
  }

  return [...currentDays, day]
}

function SlideRow({ slide, index, onEdit, onDelete, onToggle }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-sm">
      <button
        type="button"
        onClick={() => onEdit(index)}
        className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#111827]"
      >
        <img
          src={slide.cropped}
          alt={`Slide ${index + 1}`}
          className="h-full w-full object-cover"
          draggable="false"
          onDragStart={(event) => event.preventDefault()}
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">{t('createStory.slideNumber', { count: index + 1 })}</div>
        <div className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">
          {slide.existing ? t('createStory.oldSlideLoaded') : t('createStory.tapEditCrop')}
        </div>
      </div>

      <button type="button" onClick={() => onToggle(index)} className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold ${slide.active ? 'bg-[#ecfdf3] text-[#16803c]' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'}`}>
        {slide.active ? t('createStory.active') : t('createStory.inactive')}
      </button>

      <button type="button" onClick={() => onDelete(index)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
        <i className="fa-solid fa-trash text-[12px]" />
      </button>
    </div>
  )
}

export default function CreateStoryPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editStoryId = searchParams.get('editStoryId')
  const isEditMode = Boolean(editStoryId)
  const returnToChatCharacters =
  searchParams.get('returnTo') ===
  'chat_characters'
  const typeFromUrl = String(searchParams.get('type') || 'novel').toLowerCase()
  const requestedStoryType = ['novel', 'manga', 'chat_story'].includes(typeFromUrl) ? typeFromUrl : 'novel'
  const [storyType, setStoryType] = useState(requestedStoryType)
  const isManga = storyType === 'manga'
  const isChatStory = storyType === 'chat_story'
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Khmer')
  const [genre, setGenre] = useState('Romance')
  const [storyStatus, setStoryStatus] = useState('New')
  const [unfinishedStoryStatus, setUnfinishedStoryStatus] = useState('New')
  const [genreOptions, setGenreOptions] = useState(fallbackGenres)
  const [genresLoading, setGenresLoading] = useState(false)
  const [tags, setTags] = useState([])
  const [updateDays, setUpdateDays] = useState([])
  const [description, setDescription] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const [originalAccepted, setOriginalAccepted] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  const [coverOriginal, setCoverOriginal] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [coverChanged, setCoverChanged] = useState(false)

  const [landscapeOriginal, setLandscapeOriginal] = useState('')
  const [landscapePreview, setLandscapePreview] = useState('')
  const [landscapeChanged, setLandscapeChanged] = useState(false)

  const [slides, setSlides] = useState([])

  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [adultHintOpen, setAdultHintOpen] = useState(false)
  const [completedConfirmOpen, setCompletedConfirmOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [titleOpen, setTitleOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftDescription, setDraftDescription] = useState('')

  const [cropOpen, setCropOpen] = useState(false)
  const [cropMode, setCropMode] = useState('cover')
  const [editingSlideIndex, setEditingSlideIndex] = useState(null)
  const [tempImage, setTempImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    if (isEditMode) return

    const saved = JSON.parse(localStorage.getItem('create_story_draft') || 'null')

    if (!saved || saved.storyType !== requestedStoryType) {
      localStorage.removeItem('create_story_draft')
      setStoryType(requestedStoryType)
      return
    }

    setStoryType(requestedStoryType)
    setTitle(saved.title || '')
    setLanguage(saved.language || 'Khmer')
    setGenre(saved.genre || 'Romance')
    const savedStoryStatus = saved.storyStatus || 'New'
    setStoryStatus(savedStoryStatus)
    setUnfinishedStoryStatus(savedStoryStatus === 'Completed' ? 'New' : savedStoryStatus)
    setTags(saved.tags || [])
    setDescription(saved.description || '')
    setIsAdult(!!saved.isAdult)
    setOriginalAccepted(!!saved.originalAccepted)
    setAgreementAccepted(!!saved.agreementAccepted)
  }, [isEditMode, requestedStoryType])

  useEffect(() => {
    async function fetchGenres() {
      try {
        setGenresLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/genres`)
        const data = await response.json()

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load genres')
        }

        const names = (data.genres || []).map((item) => item.name).filter(Boolean)

        if (names.length) {
          setGenreOptions(names)

          setGenre((current) => {
            if (current && names.includes(current)) return current
            return names[0]
          })
        }
      } catch (error) {
        console.error('Fetch genres error:', error)
        setGenreOptions(fallbackGenres)
      } finally {
        setGenresLoading(false)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    async function loadEditStory() {
      if (!editStoryId) return

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setPageLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/stories/${editStoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('createStory.failedLoadStory'))
        }

        const story = data.story || {}

        setStoryType(['novel', 'manga', 'chat_story'].includes(story.story_type) ? story.story_type : 'novel')
        setTitle(story.title || '')
        setLanguage(story.story_language || 'Khmer')
        setGenre(story.main_genre || 'Romance')
        const loadedStoryStatus = story.story_status || 'New'
        setStoryStatus(loadedStoryStatus)
        setUnfinishedStoryStatus(
          loadedStoryStatus === 'Completed'
            ? Number(story.total_episodes || 0) > 1
              ? 'Ongoing'
              : 'New'
            : loadedStoryStatus
        )
        setTags(Array.isArray(story.tags) ? story.tags : [])
        setUpdateDays(Array.isArray(story.update_days) ? story.update_days : [])
        setDescription(story.description || '')
        setIsAdult(Boolean(story.is_adult))
        setOriginalAccepted(true)
        setAgreementAccepted(true)
        setCoverOriginal(story.cover_url || '')
        setCoverPreview(story.cover_url || '')
        setCoverChanged(false)

        setLandscapeOriginal(story.landscape_thumbnail_url || '')
        setLandscapePreview(story.landscape_thumbnail_url || '')
        setLandscapeChanged(false)

        setSlides(
          (story.slides || []).map((slide, index) => ({
            id: slide.id || `${slide.image_url}-${index}`,
            original: slide.image_url,
            cropped: slide.image_url,
            active: slide.is_active !== false,
            existing: true,
            changed: false,
          }))
        )
      } catch (error) {
        setMessage(error.message || getDisplayText('createStory.failedLoadStory'))
      } finally {
        setPageLoading(false)
      }
    }

    loadEditStory()
  }, [editStoryId, navigate])

  const descriptionCount = description.length
  const basicInfoComplete = Boolean(coverPreview && title.trim() && description.trim())
  const canSave = isEditMode
    ? title.trim() &&
      genre &&
      originalAccepted &&
      agreementAccepted &&
      descriptionCount <= 5000 &&
      !loading &&
      !pageLoading
    : basicInfoComplete && descriptionCount <= 5000 && !loading && !pageLoading

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2400)
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const openCropper = ({ mode, image, slideIndex = null }) => {
    setCropMode(mode)
    setEditingSlideIndex(slideIndex)
    setTempImage(image)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCropOpen(true)
  }

  const handleCoverChange = (file) => {
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setCoverOriginal(imageUrl)
    setCoverChanged(true)
    openCropper({
      mode: 'cover',
      image: imageUrl,
    })
  }

  const handleEditCoverCrop = () => {
  if (!coverOriginal) return

  openCropper({
    mode: 'cover',
    image: coverOriginal,
  })
}

const handleLandscapeChange = (file) => {
  if (!file) return

  const imageUrl = URL.createObjectURL(file)

  setLandscapeOriginal(imageUrl)
  setLandscapeChanged(true)

  openCropper({
    mode: 'landscape',
    image: imageUrl,
  })
}

const handleEditLandscapeCrop = () => {
  if (!landscapeOriginal) return

  openCropper({
    mode: 'landscape',
    image: landscapeOriginal,
  })
}

const handleAddSlide = (file) => {
    if (!file) return

    if (slides.length >= 5) {
      showToast(t('createStory.maxSlides'))
      return
    }

    const imageUrl = URL.createObjectURL(file)
    openCropper({
      mode: 'slide',
      image: imageUrl,
      slideIndex: null,
    })
  }

  const handleEditSlideCrop = (index) => {
    const slide = slides[index]
    if (!slide?.original) return

    openCropper({
      mode: 'slide',
      image: slide.original,
      slideIndex: index,
    })
  }

  const handleSaveCrop = async () => {
    if (!tempImage || !croppedAreaPixels) {
      showToast(t('createStory.adjustImage'))
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempImage, croppedAreaPixels)

      if (cropMode === 'cover') {
  setCoverPreview(croppedImage)
  setCoverChanged(true)
  setCropOpen(false)
  return
}

if (cropMode === 'landscape') {
  setLandscapePreview(croppedImage)
  setLandscapeChanged(true)
  setCropOpen(false)
  return
}

if (cropMode === 'slide') {
        if (editingSlideIndex === null) {
          setSlides((current) => [
            ...current,
            {
              id: Date.now(),
              original: tempImage,
              cropped: croppedImage,
              active: true,
              existing: false,
              changed: true,
            },
          ])
        } else {
          setSlides((current) =>
            current.map((slide, index) =>
              index === editingSlideIndex
                ? {
                    ...slide,
                    cropped: croppedImage,
                    changed: true,
                  }
                : slide
            )
          )
        }

        setCropOpen(false)
      }
    } catch {
      showToast(t('createStory.cropFailed'))
    }
  }

  const handleDeleteSlide = (index) => {
    setSlides((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleToggleSlide = (index) => {
    setSlides((current) =>
      current.map((slide, itemIndex) => (itemIndex === index ? { ...slide, active: !slide.active } : slide))
    )
  }

  const uploadStoryImages = async (token) => {
    const coverUrl = coverPreview
      ? await uploadImageToStorage({
          token,
          imageDataUrl: coverChanged ? coverPreview : coverPreview,
          folder: 'story_cover',
          fileName: `story-cover-${Date.now()}.jpg`,
        })
      : null

    const landscapeThumbnailUrl = landscapePreview
      ? await uploadImageToStorage({
          token,
          imageDataUrl: landscapeChanged ? landscapePreview : landscapePreview,
          folder: 'story_landscape_thumbnail',
          fileName: `story-landscape-${Date.now()}.jpg`,
        })
      : null

    const uploadedSlides = []

    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index]

      const imageUrl = slide.changed
        ? await uploadImageToStorage({
            token,
            imageDataUrl: slide.cropped,
            folder: 'story_slide',
            fileName: `story-slide-${index + 1}-${Date.now()}.jpg`,
          })
        : slide.cropped

      uploadedSlides.push({
        image_url: imageUrl,
        sort_order: index,
        is_active: slide.active,
      })
    }

    return {
      coverUrl,
      landscapeThumbnailUrl,
      uploadedSlides,
    }
  }

  const handleSaveStory = async () => {
    setMessage('')

    if (!title.trim()) {
      setMessage(t('createStory.enterTitle'))
      return
    }

    if (!isEditMode && !coverPreview) {
      setMessage(t('createStory.addPortraitCover'))
      return
    }

    if (!isEditMode && !description.trim()) {
      setMessage(t('createStory.addSummary'))
      return
    }

    if (isEditMode && (!originalAccepted || !agreementAccepted)) {
      setMessage(t('createStory.confirmRights'))
      return
    }

    if (descriptionCount > 5000) {
      setMessage(t('createStory.descriptionTooLong'))
      return
    }

    const token = getAuthToken()

    if (!token) {
      setMessage(t('createStory.loginFirst'))
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const { coverUrl, landscapeThumbnailUrl, uploadedSlides } = await uploadStoryImages(token)

      const response = await fetch(
        isEditMode ? `${API_BASE_URL}/api/stories/${editStoryId}` : `${API_BASE_URL}/api/stories/create`,
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            story_type: storyType,
            story_language: language,
            main_genre: genre,
            story_status: storyStatus,
            tags,
            update_days: updateDays,
            description: description.trim() || null,
            is_adult: isAdult,
            cover_url: coverUrl,
            landscape_thumbnail_url: landscapeThumbnailUrl,
            slides: uploadedSlides,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t(isEditMode ? 'createStory.updateFailed' : 'createStory.createFailed'))
      }

      const storyId = data.story?.id || editStoryId

      if (!storyId) {
        throw new Error(t(isEditMode ? 'createStory.updatedMissingId' : 'createStory.createdMissingId'))
      }

      if (!isEditMode) {
  localStorage.removeItem('create_story_draft')

  const nextPath = isChatStory
    ? `/author/story/${storyId}/chat/characters`
    : `/author/story/${storyId}/episode/create?type=${storyType}`

  navigate(nextPath)
  return
}

if (
  isChatStory &&
  returnToChatCharacters
) {
  navigate(
    `/author/story/${storyId}/chat/characters`,
    { replace: true }
  )
  return
}

navigate('/author/dashboard')
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? t('createStory.cannotConnect')
          : error.message || t(isEditMode ? 'createStory.updateFailed' : 'createStory.createFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const cropAspect = cropMode === 'cover' ? 2 / 3 : 16 / 9

const cropTitle =
  cropMode === 'cover'
    ? t(isManga ? 'createStory.cropMangaCover' : 'createStory.cropBookCover')
    : cropMode === 'landscape'
      ? t('createStory.cropLandscape')
      : t(isManga ? 'createStory.cropMangaSlide' : 'createStory.cropStorySlide')

const cropHelper =
  cropMode === 'cover'
    ? t(isManga ? 'createStory.cropMangaCoverHelp' : 'createStory.cropBookCoverHelp')
    : cropMode === 'landscape'
      ? t('createStory.cropLandscapeHelp')
      : t(isManga ? 'createStory.cropMangaSlideHelp' : 'createStory.cropStorySlideHelp')

const storyAccentColor = isManga
  ? '#FE526E'
  : isChatStory
    ? '#7C4DEA'
    : '#111827'

return (
  <div
    className={`create-story-page min-h-screen ${
      isEditMode ? 'bg-[var(--shadow-bg-surface)] pb-0' : 'bg-[var(--shadow-bg-page)] pb-[110px]'
    } ${isManga ? 'manga-red-theme' : ''}`}
    style={{
      backgroundColor: isEditMode ? 'var(--shadow-bg-surface)' : 'var(--shadow-bg-page)',
backgroundImage: isEditMode
  ? 'none'
  : 'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--shadow-bg-page) 18%, transparent) 38%, color-mix(in srgb, var(--shadow-bg-page) 72%, transparent) 76%, var(--shadow-bg-page) 100%), linear-gradient(90deg, color-mix(in srgb, #F2EEFF 22%, var(--shadow-bg-page)) 0%, color-mix(in srgb, #FFF8E8 22%, var(--shadow-bg-page)) 100%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 270px, 100% 270px',
    }}
  >
    <style>{`
  .manga-red-theme button:not(:disabled)[class*="bg-[var(--shadow-text-primary)]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"],
  .manga-red-theme label[class*="bg-[var(--shadow-text-primary)]"] {
    background-color: #FE526E !important;
  }

  .manga-red-theme button[class*="text-[#0b5cff]"] {
    color: #FE526E !important;
  }

  .manga-red-theme
    button:not(:disabled)[class*="shadow-[0_14px_30px_rgba(17,24,39,0.25)]"] {
    box-shadow: 0 14px 30px rgba(254, 82, 110, 0.28) !important;
  }

  .create-story-page [class*="rounded-[24px]"],
  .create-story-page [class*="rounded-[22px]"],
  .create-story-page [class*="rounded-[20px]"],
  .create-story-page [class*="rounded-[18px]"],
  .create-story-page [class*="rounded-[16px]"] {
    border-radius: 12px !important;
  }

  .create-story-page [class*="ring-1"] {
    --tw-ring-shadow: 0 0 #0000 !important;
  }

  .create-story-page [class*="border-[#"],
  .create-story-page [class*="border-[var(--shadow-border"] {
    border-color: transparent !important;
  }
`}</style>
    <Toast message={toast} onClose={() => setToast('')} />
    <AdultHintPopup
  open={adultHintOpen}
  title={t('createStory.adultTitle')}
  description={t('createStory.adultDescription')}
  onClose={() => setAdultHintOpen(false)}
/>

<CompletedStoryConfirmModal
  open={completedConfirmOpen}
  storyType={storyType}
  onCancel={() =>
    setCompletedConfirmOpen(false)
  }
  onConfirm={() => {
    setUnfinishedStoryStatus(
      storyStatus === 'Completed'
        ? unfinishedStoryStatus
        : storyStatus
    )
    setStoryStatus('Completed')
    setCompletedConfirmOpen(false)
  }}
/>

      <CropImageModal
        open={cropOpen}
        title={cropTitle}
        helper={cropHelper}
        image={tempImage}
        crop={crop}
        zoom={zoom}
        aspect={cropAspect}
        cropMode={cropMode}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => setCropOpen(false)}
        onSave={handleSaveCrop}
      />

    <LanguageWheelPicker
        open={languageOpen}
        value={language}
        title={t('createStory.storyLanguage')}
        onClose={() => setLanguageOpen(false)}
        onSave={(value) => {
          setLanguage(value)
          setLanguageOpen(false)
        }}
      />

      <GenreSheet
        open={genreOpen}
        value={genre}
        options={genreOptions}
        loading={genresLoading}
        onClose={() => setGenreOpen(false)}
        onSave={(value) => {
          setGenre(value)
          setGenreOpen(false)
        }}
      />

      <TagSheet
        open={tagOpen}
        value={tags}
        onClose={() => setTagOpen(false)}
        onSave={(value) => {
          setTags(value)
          setTagOpen(false)
        }}
      />


      <StoryTextSheet
        open={titleOpen}
        title={t(isManga ? 'createStory.mangaTitle' : 'createStory.storyTitle')}
        value={draftTitle}
        onChange={setDraftTitle}
        onClose={() => setTitleOpen(false)}
        onSave={() => {
          setTitle(draftTitle.trim())
          setTitleOpen(false)
        }}
        guideText={t('createStory.needTitleHelp')}
        guideAction={t('createStory.getTitleIdeas')}
        onOpenGuide={() => {
          setTitleOpen(false)
          navigate('/author/story/title-guide')
        }}
      />

      <StoryTextSheet
        open={summaryOpen}
        title={t('createStory.description')}
        value={draftDescription}
        onChange={setDraftDescription}
        onClose={() => setSummaryOpen(false)}
        onSave={() => {
          setDescription(draftDescription.trim())
          setSummaryOpen(false)
        }}
        multiline
        maxLength={5000}
        guideText={t('createStory.needDescriptionHelp')}
        guideAction={t('createStory.getIdeas')}
        onOpenGuide={() => {
          setSummaryOpen(false)
          navigate('/author/story/description-guide')
        }}
      />

      {mediaOpen ? (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-[var(--shadow-bg-page)]">
          <header className="sticky top-0 z-20 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <button
                type="button"
                onClick={() => setMediaOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
                aria-label={t('createStory.closeCoverMedia')}
              >
                <i className="fa-solid fa-chevron-left text-[15px]" />
              </button>

              <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('createStory.coverMedia')}</h2>

              <button
  type="button"
  onClick={() => setMediaOpen(false)}
  className={`min-w-[52px] text-right text-[14px] font-bold ${
    isChatStory
      ? 'text-[#7c3aed]'
      : isManga
        ? 'text-[#e5484d]'
        : 'text-[#0b5cff]'
  }`}
>
  {t('createStory.save')}
</button>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-5">
            <section className="rounded-[12px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
              <FieldLabel required>{t(isManga ? 'createStory.mangaCover' : 'createStory.bookCover')}</FieldLabel>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[240px_1fr] sm:gap-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                  <div>
                    <div className="mb-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.portraitCover')}
                    </div>

                    <ImageDropZone
                      onFiles={(files) => handleCoverChange(files[0] || null)}
                      className="rounded-[18px]"
                      label={t('createStory.dropCoverImage')}
                    >
                      {coverPreview ? (
                        <div className="overflow-hidden rounded-[18px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)]">
                          <button
                            type="button"
                            onClick={handleEditCoverCrop}
                            className="block aspect-[2/3] w-full overflow-hidden bg-[var(--shadow-input-bg)]"
                          >
                            <img
                              src={coverPreview}
                              alt={t(isManga ? 'createStory.portraitMangaCover' : 'createStory.portraitBookCover')}
                              className="h-full w-full object-cover"
                              draggable="false"
                              onDragStart={(event) => event.preventDefault()}
                            />
                          </button>

                          <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-2">
                            <label className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[11px] font-bold text-[var(--shadow-bg-surface)] active:scale-95">
                              {t('createStory.replace')}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                  handleCoverChange(event.target.files?.[0] || null)
                                  event.target.value = ''
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)] text-center">
                          <div className="px-3">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
                              <i className="fa-solid fa-upload text-[14px]" />
                            </div>
                            <div className="mt-2 text-[12px] font-normal text-[var(--shadow-text-primary)]">{t('createStory.dropOrTapCover')}</div>
                            <div className="mt-1 text-[10.5px] text-[var(--shadow-text-tertiary)]">{t('createStory.crop23')}</div>
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              handleCoverChange(event.target.files?.[0] || null)
                              event.target.value = ''
                            }}
                          />
                        </label>
                      )}
                    </ImageDropZone>
                  </div>

                  <div>
                    <div className="mb-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.landscapeThumbnail')}
                    </div>

                    <ImageDropZone
                      onFiles={(files) => handleLandscapeChange(files[0] || null)}
                      className="rounded-[18px]"
                      label={t('createStory.dropThumbnailImage')}
                    >
                      {landscapePreview ? (
                        <div className="overflow-hidden rounded-[18px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)]">
                          <button
                            type="button"
                            onClick={handleEditLandscapeCrop}
                            className="block aspect-video w-full overflow-hidden bg-[var(--shadow-input-bg)]"
                          >
                            <img
                              src={landscapePreview}
                              alt={t('createStory.landscapeThumbnailAlt')}
                              className="h-full w-full object-cover"
                              draggable="false"
                              onDragStart={(event) => event.preventDefault()}
                            />
                          </button>

                          <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-2">
                            <label className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[11px] font-bold text-[var(--shadow-bg-surface)] active:scale-95">
                              {t('createStory.replace')}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                  handleLandscapeChange(event.target.files?.[0] || null)
                                  event.target.value = ''
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)] text-center">
                          <div className="px-3">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
                              <i className="fa-solid fa-image text-[14px]" />
                            </div>
                            <div className="mt-2 text-[12px] font-normal text-[var(--shadow-text-primary)]">{t('createStory.dropOrAddThumbnail')}</div>
                            <div className="mt-1 text-[10.5px] text-[var(--shadow-text-tertiary)]">{t('createStory.crop169')}</div>
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              handleLandscapeChange(event.target.files?.[0] || null)
                              event.target.value = ''
                            }}
                          />
                        </label>
                      )}
                    </ImageDropZone>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">{t(isManga ? 'createStory.mangaSlides' : 'createStory.storySlides')} ({slides.length}/5)</div>
                      <div className="mt-0.5 text-[11px] text-[var(--shadow-text-tertiary)]">{t('createStory.optionalCropPreview')}</div>
                    </div>

                    <label className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-normal ${
                      slides.length >= 5
  ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
  : isManga
    ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-white'
    : 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                    }`}>
                      {t('createStory.add')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={slides.length >= 5}
                        onChange={(event) => {
                          handleAddSlide(event.target.files?.[0] || null)
                          event.target.value = ''
                        }}
                      />
                    </label>
                  </div>

                  <ImageDropZone
                    onFiles={(files) => handleAddSlide(files[0] || null)}
                    disabled={slides.length >= 5}
                    className="rounded-[20px]"
                    label={t('createStory.dropSlideImage')}
                  >
                    {slides.length ? (
                      <div className="space-y-2">
                        {slides.map((slide, index) => (
                          <SlideRow
                            key={slide.id}
                            slide={slide}
                            index={index}
                            onEdit={handleEditSlideCrop}
                            onDelete={handleDeleteSlide}
                            onToggle={handleToggleSlide}
                          />
                        ))}
                      </div>
                    ) : (
                      <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)] text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
                          <i className="fa-solid fa-images text-[15px]" />
                        </div>
                        <div className="mt-3 text-[13px] font-bold text-[var(--shadow-text-primary)]">{t(isManga ? 'createStory.dropOrAddMangaSlide' : 'createStory.dropOrAddStorySlide')}</div>
                        <div className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">{t('createStory.crop169')}</div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            handleAddSlide(event.target.files?.[0] || null)
                            event.target.value = ''
                          }}
                        />
                      </label>
                    )}
                  </ImageDropZone>
                </div>
              </div>

              <div className="mt-3 rounded-[16px] bg-[var(--shadow-input-bg)] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
                {t(isManga ? 'createStory.mediaHelpManga' : 'createStory.mediaHelpStory')}
              </div>
            </section>
          </main>
        </div>
      ) : null}

      <header className={`sticky top-0 z-50 px-4 py-3 ${isEditMode ? 'bg-[var(--shadow-bg-surface)]' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (isChatStory && returnToChatCharacters) {
                navigate('/author/stories', { replace: true })
                return
              }

              navigate(-1)
            }}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('createStory.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
  {t(
    isEditMode
      ? isManga
        ? 'createStory.updateManga'
        : isChatStory
          ? 'createStory.updateChatStory'
          : 'createStory.updateNovel'
      : isManga
        ? 'createStory.createManga'
        : isChatStory
          ? 'createStory.createChatStory'
          : 'createStory.createNovel'
  )}
</h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className={`mx-auto max-w-5xl ${isEditMode ? 'px-0 pt-0 sm:px-4' : 'px-4 pt-4'}`}>
        {!isEditMode ? (
  <section className="hidden rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)] sm:block">
    <div className={`grid gap-2 ${isChatStory ? 'grid-cols-4' : 'grid-cols-3'}`}>
      <Step number="1" title={t(isManga ? 'createStory.mangaInfo' : 'createStory.storyInfo')} active />

      {isChatStory ? (
        <>
          <Step number="2" title={t('createStory.characters')} />
          <Step number="3" title={t('createStory.chat')} />
          <Step number="4" title={t('createStory.publish')} />
        </>
      ) : (
        <>
          <Step
            number="2"
            title={t(isManga ? 'createStory.firstMangaEpisode' : 'createStory.firstEpisode')}
          />
          <Step number="3" title={t('createStory.publish')} />
        </>
      )}
    </div>
  </section>
) : null}

        {pageLoading ? (
          <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
            <div className="text-[13px] font-bold text-[var(--shadow-text-secondary)]">{t('createStory.loadingOldStory')}</div>
          </section>
        ) : null}

        {message ? (
          <button type="button" onClick={() => setMessage('')} className="mt-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
            {message}
          </button>
        ) : null}

        {!pageLoading ? (
          <>
            {isEditMode ? (
              <div className="bg-[var(--shadow-bg-surface)]">
                <section className="bg-[var(--shadow-bg-surface)]">
                  <button
                    type="button"
                    onClick={() => setMediaOpen(true)}
                    className="flex min-h-[132px] w-full items-center gap-4 px-4 py-5 text-left active:bg-[var(--shadow-bg-page)]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">
                        {t('createStory.cover')} <span className="text-[#e5484d]">*</span>
                      </div>
                      <div className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
                        {t('createStory.coverHelp')}
                      </div>
                    </div>

                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt={t(isManga ? 'createStory.mangaCover' : 'createStory.bookCover')}
                        className="h-[96px] w-[64px] shrink-0 rounded-[8px] object-cover"
                      />
                    ) : (
                      <div className="flex h-[96px] w-[64px] shrink-0 flex-col items-center justify-center rounded-[8px] bg-[var(--shadow-input-bg)] text-[var(--shadow-text-disabled)]">
                        <i className="fa-solid fa-plus text-[22px]" />
                        <span className="mt-2 text-[9.5px]">{t('createStory.addCover')}</span>
                      </div>
                    )}

                    <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
                  </button>

                  <div className="mx-4 h-px bg-[var(--shadow-border)]" />

                  <button
                    type="button"
                    onClick={() => {
                      setDraftTitle(title)
                      setTitleOpen(true)
                    }}
                    className="flex min-h-[68px] w-full items-center gap-4 px-4 py-4 text-left active:bg-[var(--shadow-bg-page)]"
                  >
                    <div className="w-[108px] shrink-0 text-[13px] font-bold text-[var(--shadow-text-primary)]">
                      {t(isManga ? 'createStory.mangaTitle' : 'createStory.storyTitle')}{' '}
                      <span className="text-[#e5484d]">*</span>
                    </div>

                    <div
                      className={`min-w-0 flex-1 truncate text-right text-[12.5px] ${
                        title ? 'text-[var(--shadow-text-secondary)]' : 'text-[var(--shadow-text-disabled)]'
                      }`}
                    >
                      {title || t(isManga ? 'createStory.addMangaTitle' : 'createStory.addStoryTitle')}
                    </div>

                    <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
                  </button>

                  <div className="mx-4 h-px bg-[var(--shadow-border)]" />

                  <button
                    type="button"
                    onClick={() => {
                      setDraftDescription(description)
                      setSummaryOpen(true)
                    }}
                    className="flex min-h-[74px] w-full items-center gap-4 px-4 py-4 text-left active:bg-[var(--shadow-bg-page)]"
                  >
                    <div className="w-[108px] shrink-0 text-[13px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.description')} <span className="text-[#e5484d]">*</span>
                    </div>

                    <div
                      className={`min-w-0 flex-1 truncate text-right text-[12.5px] ${
                        description ? 'text-[var(--shadow-text-secondary)]' : 'text-[var(--shadow-text-disabled)]'
                      }`}
                    >
                      {description || t('createStory.descriptionPlaceholder')}
                    </div>

                    <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
                  </button>

                  <div className="px-4 pb-5">
                    <div className="mt-5">
                      <FieldLabel required>{t('createStory.storyLanguage')}</FieldLabel>

  <button
    type="button"
    onClick={() => setLanguageOpen(true)}
    className="flex h-12 w-full items-center rounded-[12px] bg-[var(--shadow-input-bg)] px-4 text-left"
  >
    <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--shadow-text-primary)]">
      {language || t('createStory.chooseLanguage')}
    </span>

                    <i className="fa-solid fa-chevron-right text-[10px] text-[var(--shadow-text-tertiary)]" />
                  </button>
                </div>

                  <div className="mt-4">
                    <FieldLabel required>{t('createStory.mainGenre')}</FieldLabel>
                    <button
                      type="button"
                      onClick={() => setGenreOpen(true)}
                      className="flex h-12 w-full items-center justify-between rounded-[12px] bg-[var(--shadow-input-bg)] px-4 text-left text-[13px] text-[var(--shadow-text-primary)]"
                    >
                      <span className="truncate">{genre || t('createStory.chooseGenre')}</span>
                      <i className="fa-solid fa-chevron-right text-[10px] text-[var(--shadow-text-tertiary)]" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <FieldLabel required>{t('createStory.tags')}</FieldLabel>
                    <button
                      type="button"
                      onClick={() => setTagOpen(true)}
                      className="flex min-h-12 w-full items-center rounded-[12px] bg-[var(--shadow-input-bg)] px-4 py-3 text-left"
                    >
                      <span
                        className={`min-w-0 flex-1 truncate text-[12.5px] ${
                          tags.length ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
                        }`}
                      >
                        {tags.length ? tags.join(', ') : t('createStory.chooseTags')}
                      </span>

                      <span className="ml-3 shrink-0 text-[10.5px] text-[var(--shadow-text-tertiary)]">
                        {tags.length}/6
                      </span>

                      <i className="fa-solid fa-chevron-right ml-2 shrink-0 text-[10px] text-[var(--shadow-text-tertiary)]" />
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="text-[12px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.updateDays')}
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {updateDayOptions.map((day) => {
                        const active = updateDays.includes(day.value)

                        return (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() =>
                              setUpdateDays((current) =>
                                toggleUpdateDay(current, day.value)
                              )
                            }
                            className={`h-9 rounded-[9px] text-[10.5px] transition active:scale-95 ${
                              active
                                ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                                : 'bg-[var(--shadow-input-bg)] text-[var(--shadow-text-tertiary)]'
                            }`}
                          >
                            {t(`createStory.${day.labelKey}`)}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-[12px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.storyStatus')}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 py-2">
                      <span className="text-[12px] text-[var(--shadow-text-secondary)]">
                        {t('createStory.completed')}
                      </span>

                      <SettingsToggle
                        checked={storyStatus === 'Completed'}
                        activeColor={storyAccentColor}
                        onClick={() => {
                          if (storyStatus === 'Completed') {
                            setStoryStatus(
                              unfinishedStoryStatus || 'Ongoing'
                            )
                            return
                          }

                          setCompletedConfirmOpen(true)
                        }}
                        label={t('createStory.toggleCompleted')}
                      />
                    </div>
                  </div>

                    <div className="mt-4 flex items-center justify-between gap-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[var(--shadow-text-primary)]">
                          {t('createStory.adultTitle')}
                        </span>

                        <button
                          type="button"
                          onClick={() => setAdultHintOpen(true)}
                          className="flex h-5 w-5 items-center justify-center text-[var(--shadow-text-tertiary)]"
                          aria-label={t('createStory.aboutAdult')}
                        >
                          <i className="fa-regular fa-circle-question text-[13px]" />
                        </button>
                      </div>

                      <SettingsToggle
                        checked={isAdult}
                        activeColor={storyAccentColor}
                        onClick={() =>
                          setIsAdult((value) => !value)
                        }
                        label={t('createStory.toggleAdult')}
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <section className="mt-6 overflow-hidden rounded-[12px] bg-[var(--shadow-bg-surface)] shadow-sm">
                <button
                  type="button"
                  onClick={() => setMediaOpen(true)}
                  className="flex min-h-[148px] w-full items-center gap-4 px-5 py-5 text-left active:bg-[var(--shadow-bg-page)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
                      {t('createStory.cover')} <span className="text-[#e5484d]">*</span>
                    </div>
                    <div className="mt-1 text-[11.5px] leading-5 text-[var(--shadow-text-tertiary)]">
                      {t('createStory.coverHelp')}
                    </div>
                  </div>

                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt={t(isManga ? 'createStory.mangaCover' : 'createStory.bookCover')}
                      className="h-[108px] w-[72px] shrink-0 rounded-[10px] object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-[108px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[10px] bg-[var(--shadow-input-bg)] text-[var(--shadow-text-disabled)]">
                      <i className="fa-solid fa-plus text-[24px]" />
                      <span className="mt-2 text-[10px] font-medium">{t('createStory.addCover')}</span>
                    </div>
                  )}

                  <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
                </button>

                <div className="mx-5 h-px bg-[var(--shadow-border)]" />

                <button
                  type="button"
                  onClick={() => {
                    setDraftTitle(title)
                    setTitleOpen(true)
                  }}
                  className="flex min-h-[72px] w-full items-center gap-4 px-5 py-4 text-left active:bg-[var(--shadow-bg-page)]"
                >
                  <div className="w-[112px] shrink-0 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('createStory.storyTitle')} <span className="text-[#e5484d]">*</span>
                  </div>

                  <div className={`min-w-0 flex-1 truncate text-right text-[13px] ${
                    title ? 'text-[var(--shadow-text-secondary)]' : 'text-[var(--shadow-text-disabled)]'
                  }`}>
                    {title || t('createStory.addStoryTitle')}
                  </div>

                  <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
                </button>

                <div className="mx-5 h-px bg-[var(--shadow-border)]" />

                <button
                  type="button"
                  onClick={() => {
                    setDraftDescription(description)
                    setSummaryOpen(true)
                  }}
                  className="flex min-h-[78px] w-full items-center gap-4 px-5 py-4 text-left active:bg-[var(--shadow-bg-page)]"
                >
                  <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    <span>{t('createStory.description')}</span>
                    <span className="text-[#e5484d]">*</span>
                  </div>

                  <div className={`min-w-0 flex-1 truncate text-right text-[13px] ${
                    description ? 'text-[var(--shadow-text-secondary)]' : 'text-[var(--shadow-text-disabled)]'
                  }`}>
                    {description || t('createStory.descriptionPlaceholder')}
                  </div>

                  <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
                </button>
              </section>
            )}

            {!isEditMode ? (
              <p className="mt-3 px-1 text-[11.5px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
                {t(
                  isManga
                    ? 'createStory.basicInfoNoteManga'
                    : isChatStory
                      ? 'createStory.basicInfoNoteChat'
                      : 'createStory.basicInfoNoteNovel'
                )}
              </p>
            ) : null}

            <section
              className={
                isEditMode
                  ? 'sticky bottom-0 z-20 bg-[var(--shadow-bg-surface)] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3'
                  : 'mt-5 pb-8'
              }
            >
              <button
                type="button"
                onClick={handleSaveStory}
                disabled={!canSave}
                className={`flex h-14 w-full items-center justify-center rounded-full text-[14px] font-bold active:scale-[0.99] ${
  !canSave
    ? 'cursor-not-allowed bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]'
    : isChatStory
      ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-white shadow-sm'
      : isManga
        ? 'bg-[var(--shadow-text-primary)] text-white'
        : 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
}`}
              >
                {loading
                  ? isEditMode
                    ? t('createStory.savingChanges')
                    : t(isManga ? 'createStory.uploadingCreatingManga' : 'createStory.uploadingCreatingStory')
                  : isEditMode
                    ? t('createStory.saveChanges')
                    : t('createStory.createStory')}
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
