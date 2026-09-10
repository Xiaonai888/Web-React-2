import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryEditor', {
  "en": {
    "failedUploadCharacterImage": "Failed to upload character image",
    "failedUploadChatImage": "Failed to upload Chat Story image",
    "missingImageUrl": "Image uploaded but image URL was missing",
    "character": "Character",
    "unnamed": "Unnamed",
    "unnamedCharacter": "Unnamed character",
    "editCharacterProfileImage": "Edit character profile image",
    "editProfile": "Edit Profile",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "aside": "ASIDE",
    "editAside": "Edit aside",
    "chatStory": "Chat Story",
    "editImage": "Edit image",
    "toBeContinued": "to be continued",
    "authorsNote": "Author’s Note",
    "deleteAuthorsNote": "Delete author’s note",
    "editMessage": "Edit message",
    "above": "Above",
    "below": "Below",
    "modify": "Modify",
    "onRight": "On Right",
    "up": "Up",
    "down": "Down",
    "delete": "Delete",
    "chooseCharacterImage": "Choose character image",
    "newCharacter": "New character",
    "enterCharacterName": "Enter character name",
    "randomMale": "Random Male Character",
    "randomFemale": "Random Female Character",
    "saving": "Saving...",
    "dragDownToClose": "Drag down to close",
    "more": "More",
    "uploadAudio": "Upload Audio",
    "done": "Done",
    "editAuthorsNote": "Edit Author’s Note",
    "addAuthorsNote": "Add Author’s Note",
    "writeShortNote": "Write a short note for your readers.",
    "closeAuthorsNote": "Close author’s note",
    "authorNotePlaceholder": "Thank your readers, share a short update, or leave a message...",
    "saveAuthorsNote": "Save Author’s Note",
    "maximumAudio": "Maximum 1 minute · 5 MB",
    "closeAudioUpload": "Close audio upload",
    "removeSelectedAudio": "Remove selected audio",
    "dropAudioHere": "Drop audio here",
    "dropAudioHereOrChoose": "Drop audio here or choose from device",
    "audioFormats": "MP3, M4A, AAC, WAV or WebM",
    "chooseAnotherAudio": "Choose another audio",
    "episode1": "Episode 1",
    "newEpisode": "New Episode",
    "failedLoadCharacters": "Failed to load characters",
    "cannotConnectBackend": "Cannot connect to backend.",
    "failedLoadEpisode": "Failed to load Chat Story episode",
    "notChatStoryEpisode": "This episode is not a Chat Story episode",
    "episode": "Episode",
    "finishCurrentEdit": "Finish or cancel the current edit first.",
    "messageUpdated": "Message updated.",
    "chooseImageFile": "Please choose an image file.",
    "profileImageTooLarge": "Profile image must be 2 MB or smaller.",
    "failedLoadCharacterImages": "Failed to load character images",
    "noFemaleImages": "No female character images were found.",
    "noMaleImages": "No male character images were found.",
    "failedChooseRandom": "Failed to choose random character",
    "enterCharacterRequired": "Please enter a character name.",
    "female": "Female",
    "male": "Male",
    "failedAddCharacter": "Failed to add character",
    "characterSavedMissing": "Character was saved but could not be loaded",
    "characterAdded": "Character added.",
    "authorNoteUpdated": "Author’s Note updated.",
    "authorNoteSaved": "Author’s Note saved.",
    "chooseAudioTypes": "Choose MP3, M4A, AAC, WAV or WebM audio.",
    "audioTooLarge": "Audio must be 5 MB or smaller.",
    "audioDuration": "Audio must be between 1 second and 1 minute.",
    "audioUnreadable": "This audio file cannot be read.",
    "audioInfoUnreadable": "Audio information could not be read. Try another file.",
    "imageTooLarge": "Image must be 8 MB or smaller.",
    "imageAdded": "Image added.",
    "failedUploadImage": "Failed to upload image",
    "chooseSchedule": "Please choose schedule date and time.",
    "failedPublishEpisode": "Failed to publish episode",
    "enterEpisodeTitleRequired": "Please enter an episode title.",
    "addOneMessage": "Add at least one Chat or ASIDE message.",
    "failedSaveEpisode": "Failed to save Chat Story episode",
    "episodeSavedMissingId": "Episode saved but episode id was missing",
    "episodeTitle": "Episode Title",
    "episodeTitleHelp": "Tap here to add or edit the episode title.",
    "chooseSpeaker": "Choose Speaker",
    "chooseSpeakerHelp": "Choose a character for Chat. Choose ASIDE for narration.",
    "addCharacter": "Add Character",
    "addCharacterHelp": "Create another character when your story needs one.",
    "writeMessage": "Write a Message",
    "writeMessageHelp": "Type and send a message. Tap a sent message to modify, move, or delete it.",
    "moreTools": "More Tools",
    "moreToolsHelp": "Open Audio and Author’s Note tools here.",
    "saveAndPublish": "Save and Publish",
    "savePublishHelp": "Tap Next to save the episode and open Publish settings.",
    "enterEpisodeTitle": "Enter episode title",
    "ok": "OK",
    "goBack": "Go back",
    "messageCount": "{{count}} message",
    "messagesCount": "{{count}} messages",
    "wordCount": "{{count}} word",
    "wordsCount": "{{count}} words",
    "savedIn": "Saved in {{time}}",
    "storyInfo": "Story Info",
    "characters": "Characters",
    "chat": "Chat",
    "publish": "Publish",
    "loadingCharacters": "Loading characters...",
    "startConversation": "Start your conversation",
    "startConversationHelp": "Choose one character below to write their message. Tap the same character again to deselect it and write narration without an avatar.",
    "next": "Next",
    "modifyMessage": "Modify message",
    "insertAbove": "Insert above selected message",
    "insertBelow": "Insert below selected message",
    "modifyMessagePrefix": "Modify message:",
    "asidePrefix": "ASIDE:",
    "messageSymbols": "Message symbols",
    "comingSoon": "Coming soon",
    "emojiComingSoon": "Emoji coming soon",
    "sendMessage": "Send message",
    "addImage": "Add image"
  },
  "km": {
    "failedUploadCharacterImage": "មិនអាច Upload រូបតួអង្គបានទេ",
    "failedUploadChatImage": "មិនអាច Upload រូប Chat Story បានទេ",
    "missingImageUrl": "បាន Upload រូប ប៉ុន្តែមិនទទួលបាន Image URL",
    "character": "តួអង្គ",
    "unnamed": "គ្មានឈ្មោះ",
    "unnamedCharacter": "តួអង្គគ្មានឈ្មោះ",
    "editCharacterProfileImage": "កែរូប Profile តួអង្គ",
    "editProfile": "កែ Profile",
    "cancel": "បោះបង់",
    "confirm": "បញ្ជាក់",
    "aside": "ASIDE",
    "editAside": "កែ ASIDE",
    "chatStory": "Chat Story",
    "editImage": "កែរូបភាព",
    "toBeContinued": "មានបន្ត",
    "authorsNote": "កំណត់ចំណាំអ្នកនិពន្ធ",
    "deleteAuthorsNote": "លុបកំណត់ចំណាំអ្នកនិពន្ធ",
    "editMessage": "កែសារ",
    "above": "ខាងលើ",
    "below": "ខាងក្រោម",
    "modify": "កែប្រែ",
    "onRight": "ទៅខាងស្តាំ",
    "up": "ឡើង",
    "down": "ចុះ",
    "delete": "លុប",
    "chooseCharacterImage": "ជ្រើសរូបតួអង្គ",
    "newCharacter": "តួអង្គថ្មី",
    "enterCharacterName": "បញ្ចូលឈ្មោះតួអង្គ",
    "randomMale": "តួប្រុសចៃដន្យ",
    "randomFemale": "តួស្រីចៃដន្យ",
    "saving": "កំពុងរក្សាទុក...",
    "dragDownToClose": "អូសចុះក្រោមដើម្បីបិទ",
    "more": "បន្ថែម",
    "uploadAudio": "Upload សំឡេង",
    "done": "រួចរាល់",
    "editAuthorsNote": "កែកំណត់ចំណាំអ្នកនិពន្ធ",
    "addAuthorsNote": "បន្ថែមកំណត់ចំណាំអ្នកនិពន្ធ",
    "writeShortNote": "សរសេរកំណត់ចំណាំខ្លីសម្រាប់អ្នកអាន។",
    "closeAuthorsNote": "បិទកំណត់ចំណាំអ្នកនិពន្ធ",
    "authorNotePlaceholder": "អរគុណអ្នកអាន ចែករំលែកព័ត៌មានខ្លី ឬទុកសារ...",
    "saveAuthorsNote": "រក្សាទុកកំណត់ចំណាំអ្នកនិពន្ធ",
    "maximumAudio": "អតិបរមា 1 នាទី · 5 MB",
    "closeAudioUpload": "បិទការបញ្ចូលសំឡេង",
    "removeSelectedAudio": "ដកសំឡេងដែលបានជ្រើស",
    "dropAudioHere": "ទម្លាក់សំឡេងនៅទីនេះ",
    "dropAudioHereOrChoose": "ទម្លាក់សំឡេងនៅទីនេះ ឬជ្រើសពីឧបករណ៍",
    "audioFormats": "MP3, M4A, AAC, WAV ឬ WebM",
    "chooseAnotherAudio": "ជ្រើសសំឡេងផ្សេង",
    "episode1": "ភាគ 1",
    "newEpisode": "ភាគថ្មី",
    "failedLoadCharacters": "មិនអាចផ្ទុកតួអង្គបានទេ",
    "cannotConnectBackend": "មិនអាចភ្ជាប់ទៅ Backend បានទេ។",
    "failedLoadEpisode": "មិនអាចផ្ទុកភាគ Chat Story បានទេ",
    "notChatStoryEpisode": "ភាគនេះមិនមែនជា Chat Story ទេ",
    "episode": "ភាគ",
    "finishCurrentEdit": "សូមបញ្ចប់ ឬបោះបង់ការកែបច្ចុប្បន្នជាមុន។",
    "messageUpdated": "បានកែសារ។",
    "chooseImageFile": "សូមជ្រើសឯកសាររូបភាព។",
    "profileImageTooLarge": "រូប Profile ត្រូវមានទំហំ 2 MB ឬតូចជាងនេះ។",
    "failedLoadCharacterImages": "មិនអាចផ្ទុករូបតួអង្គបានទេ",
    "noFemaleImages": "រកមិនឃើញរូបតួស្រីទេ។",
    "noMaleImages": "រកមិនឃើញរូបតួប្រុសទេ។",
    "failedChooseRandom": "មិនអាចជ្រើសតួអង្គចៃដន្យបានទេ",
    "enterCharacterRequired": "សូមបញ្ចូលឈ្មោះតួអង្គ។",
    "female": "ស្រី",
    "male": "ប្រុស",
    "failedAddCharacter": "មិនអាចបន្ថែមតួអង្គបានទេ",
    "characterSavedMissing": "បានរក្សាទុកតួអង្គ ប៉ុន្តែមិនអាចផ្ទុកវាបានទេ",
    "characterAdded": "បានបន្ថែមតួអង្គ។",
    "authorNoteUpdated": "បានកែកំណត់ចំណាំអ្នកនិពន្ធ។",
    "authorNoteSaved": "បានរក្សាទុកកំណត់ចំណាំអ្នកនិពន្ធ។",
    "chooseAudioTypes": "សូមជ្រើសសំឡេង MP3, M4A, AAC, WAV ឬ WebM។",
    "audioTooLarge": "សំឡេងត្រូវមានទំហំ 5 MB ឬតូចជាងនេះ។",
    "audioDuration": "សំឡេងត្រូវមានរយៈពេលពី 1 វិនាទី ដល់ 1 នាទី។",
    "audioUnreadable": "មិនអាចអានឯកសារសំឡេងនេះបានទេ។",
    "audioInfoUnreadable": "មិនអាចអានព័ត៌មានសំឡេងបានទេ។ សូមសាកឯកសារផ្សេង។",
    "imageTooLarge": "រូបភាពត្រូវមានទំហំ 8 MB ឬតូចជាងនេះ។",
    "imageAdded": "បានបន្ថែមរូបភាព។",
    "failedUploadImage": "មិនអាច Upload រូបភាពបានទេ",
    "chooseSchedule": "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងកំណត់ពេល។",
    "failedPublishEpisode": "មិនអាច Publish ភាគបានទេ",
    "enterEpisodeTitleRequired": "សូមបញ្ចូលចំណងជើងភាគ។",
    "addOneMessage": "សូមបន្ថែមយ៉ាងហោចណាស់ 1 សារ Chat ឬ ASIDE។",
    "failedSaveEpisode": "មិនអាចរក្សាទុកភាគ Chat Story បានទេ",
    "episodeSavedMissingId": "បានរក្សាទុកភាគ ប៉ុន្តែមិនទទួលបាន Episode ID",
    "episodeTitle": "ចំណងជើងភាគ",
    "episodeTitleHelp": "ចុចទីនេះដើម្បីបន្ថែម ឬកែចំណងជើងភាគ។",
    "chooseSpeaker": "ជ្រើសអ្នកនិយាយ",
    "chooseSpeakerHelp": "ជ្រើសតួអង្គសម្រាប់ Chat។ ជ្រើស ASIDE សម្រាប់ការរៀបរាប់។",
    "addCharacter": "បន្ថែមតួអង្គ",
    "addCharacterHelp": "បង្កើតតួអង្គថ្មីនៅពេលរឿងរបស់អ្នកត្រូវការ។",
    "writeMessage": "សរសេរសារ",
    "writeMessageHelp": "វាយ និងផ្ញើសារ។ ចុចសារដែលបានផ្ញើ ដើម្បីកែ ផ្លាស់ទី ឬលុប។",
    "moreTools": "ឧបករណ៍បន្ថែម",
    "moreToolsHelp": "បើកឧបករណ៍សំឡេង និងកំណត់ចំណាំអ្នកនិពន្ធនៅទីនេះ។",
    "saveAndPublish": "រក្សាទុក និង Publish",
    "savePublishHelp": "ចុច បន្ទាប់ ដើម្បីរក្សាទុកភាគ និងបើកការកំណត់ Publish។",
    "enterEpisodeTitle": "បញ្ចូលចំណងជើងភាគ",
    "ok": "យល់ព្រម",
    "goBack": "ត្រឡប់ក្រោយ",
    "messageCount": "{{count}} សារ",
    "messagesCount": "{{count}} សារ",
    "wordCount": "{{count}} ពាក្យ",
    "wordsCount": "{{count}} ពាក្យ",
    "savedIn": "រក្សាទុកក្នុង {{time}}",
    "storyInfo": "ព័ត៌មានរឿង",
    "characters": "តួអង្គ",
    "chat": "Chat",
    "publish": "Publish",
    "loadingCharacters": "កំពុងផ្ទុកតួអង្គ...",
    "startConversation": "ចាប់ផ្តើមការសន្ទនា",
    "startConversationHelp": "ជ្រើសតួអង្គមួយខាងក្រោមដើម្បីសរសេរសារ។ ចុចតួអង្គដដែលម្តងទៀត ដើម្បីឈប់ជ្រើស ហើយសរសេរការរៀបរាប់ដោយគ្មាន Avatar។",
    "next": "បន្ទាប់",
    "modifyMessage": "កែសារ",
    "insertAbove": "បញ្ចូលខាងលើសារដែលបានជ្រើស",
    "insertBelow": "បញ្ចូលខាងក្រោមសារដែលបានជ្រើស",
    "modifyMessagePrefix": "កែសារ៖",
    "asidePrefix": "ASIDE៖",
    "messageSymbols": "និមិត្តសញ្ញាសារ",
    "comingSoon": "មកដល់ឆាប់ៗនេះ",
    "emojiComingSoon": "Emoji នឹងមកដល់ឆាប់ៗនេះ",
    "sendMessage": "ផ្ញើសារ",
    "addImage": "បន្ថែមរូបភាព"
  },
  "zh": {
    "failedUploadCharacterImage": "无法上传角色图片",
    "failedUploadChatImage": "无法上传 Chat Story 图片",
    "missingImageUrl": "图片已上传，但未返回图片 URL",
    "character": "角色",
    "unnamed": "未命名",
    "unnamedCharacter": "未命名角色",
    "editCharacterProfileImage": "编辑角色头像",
    "editProfile": "编辑资料",
    "cancel": "取消",
    "confirm": "确认",
    "aside": "旁白",
    "editAside": "编辑旁白",
    "chatStory": "Chat Story",
    "editImage": "编辑图片",
    "toBeContinued": "未完待续",
    "authorsNote": "作者的话",
    "deleteAuthorsNote": "删除作者的话",
    "editMessage": "编辑消息",
    "above": "上方",
    "below": "下方",
    "modify": "修改",
    "onRight": "移到右侧",
    "up": "上移",
    "down": "下移",
    "delete": "删除",
    "chooseCharacterImage": "选择角色图片",
    "newCharacter": "新角色",
    "enterCharacterName": "输入角色名称",
    "randomMale": "随机男性角色",
    "randomFemale": "随机女性角色",
    "saving": "保存中...",
    "dragDownToClose": "向下拖动以关闭",
    "more": "更多",
    "uploadAudio": "上传音频",
    "done": "完成",
    "editAuthorsNote": "编辑作者的话",
    "addAuthorsNote": "添加作者的话",
    "writeShortNote": "给读者写一段简短的话。",
    "closeAuthorsNote": "关闭作者的话",
    "authorNotePlaceholder": "感谢读者、分享简短更新或留言...",
    "saveAuthorsNote": "保存作者的话",
    "maximumAudio": "最长 1 分钟 · 5 MB",
    "closeAudioUpload": "关闭音频上传",
    "removeSelectedAudio": "移除所选音频",
    "dropAudioHere": "将音频拖到这里",
    "dropAudioHereOrChoose": "将音频拖到这里或从设备选择",
    "audioFormats": "MP3、M4A、AAC、WAV 或 WebM",
    "chooseAnotherAudio": "选择其他音频",
    "episode1": "第 1 章",
    "newEpisode": "新章节",
    "failedLoadCharacters": "无法加载角色",
    "cannotConnectBackend": "无法连接后端。",
    "failedLoadEpisode": "无法加载 Chat Story 章节",
    "notChatStoryEpisode": "此章节不是 Chat Story 章节",
    "episode": "章节",
    "finishCurrentEdit": "请先完成或取消当前编辑。",
    "messageUpdated": "消息已更新。",
    "chooseImageFile": "请选择图片文件。",
    "profileImageTooLarge": "头像必须小于或等于 2 MB。",
    "failedLoadCharacterImages": "无法加载角色图片",
    "noFemaleImages": "未找到女性角色图片。",
    "noMaleImages": "未找到男性角色图片。",
    "failedChooseRandom": "无法随机选择角色",
    "enterCharacterRequired": "请输入角色名称。",
    "female": "女性",
    "male": "男性",
    "failedAddCharacter": "无法添加角色",
    "characterSavedMissing": "角色已保存，但无法重新加载",
    "characterAdded": "角色已添加。",
    "authorNoteUpdated": "作者的话已更新。",
    "authorNoteSaved": "作者的话已保存。",
    "chooseAudioTypes": "请选择 MP3、M4A、AAC、WAV 或 WebM 音频。",
    "audioTooLarge": "音频必须小于或等于 5 MB。",
    "audioDuration": "音频时长必须在 1 秒到 1 分钟之间。",
    "audioUnreadable": "无法读取此音频文件。",
    "audioInfoUnreadable": "无法读取音频信息。请尝试其他文件。",
    "imageTooLarge": "图片必须小于或等于 8 MB。",
    "imageAdded": "图片已添加。",
    "failedUploadImage": "无法上传图片",
    "chooseSchedule": "请选择定时日期和时间。",
    "failedPublishEpisode": "无法发布章节",
    "enterEpisodeTitleRequired": "请输入章节标题。",
    "addOneMessage": "请至少添加一条聊天消息或旁白。",
    "failedSaveEpisode": "无法保存 Chat Story 章节",
    "episodeSavedMissingId": "章节已保存，但缺少章节 ID",
    "episodeTitle": "章节标题",
    "episodeTitleHelp": "点击这里添加或编辑章节标题。",
    "chooseSpeaker": "选择发言角色",
    "chooseSpeakerHelp": "选择角色用于聊天，选择旁白用于叙述。",
    "addCharacter": "添加角色",
    "addCharacterHelp": "故事需要时创建新角色。",
    "writeMessage": "写消息",
    "writeMessageHelp": "输入并发送消息。点击已发送消息可修改、移动或删除。",
    "moreTools": "更多工具",
    "moreToolsHelp": "在这里打开音频和作者的话工具。",
    "saveAndPublish": "保存并发布",
    "savePublishHelp": "点击“下一步”保存章节并打开发布设置。",
    "enterEpisodeTitle": "输入章节标题",
    "ok": "确定",
    "goBack": "返回",
    "messageCount": "{{count}} 条消息",
    "messagesCount": "{{count}} 条消息",
    "wordCount": "{{count}} 字",
    "wordsCount": "{{count}} 字",
    "savedIn": "保存于 {{time}}",
    "storyInfo": "故事信息",
    "characters": "角色",
    "chat": "聊天",
    "publish": "发布",
    "loadingCharacters": "正在加载角色...",
    "startConversation": "开始对话",
    "startConversationHelp": "选择下方一个角色来写消息。再次点击同一角色可取消选择，并以无头像的方式写旁白。",
    "next": "下一步",
    "modifyMessage": "修改消息",
    "insertAbove": "在所选消息上方插入",
    "insertBelow": "在所选消息下方插入",
    "modifyMessagePrefix": "修改消息：",
    "asidePrefix": "旁白：",
    "messageSymbols": "消息符号",
    "comingSoon": "即将推出",
    "emojiComingSoon": "Emoji 即将推出",
    "sendMessage": "发送消息",
    "addImage": "添加图片"
  },
  "ja": {
    "failedUploadCharacterImage": "キャラクター画像をアップロードできませんでした",
    "failedUploadChatImage": "Chat Story 画像をアップロードできませんでした",
    "missingImageUrl": "画像はアップロードされましたが、画像 URL がありません",
    "character": "キャラクター",
    "unnamed": "名前なし",
    "unnamedCharacter": "名前なしキャラクター",
    "editCharacterProfileImage": "キャラクター画像を編集",
    "editProfile": "プロフィールを編集",
    "cancel": "キャンセル",
    "confirm": "確認",
    "aside": "ナレーション",
    "editAside": "ナレーションを編集",
    "chatStory": "Chat Story",
    "editImage": "画像を編集",
    "toBeContinued": "つづく",
    "authorsNote": "作者ノート",
    "deleteAuthorsNote": "作者ノートを削除",
    "editMessage": "メッセージを編集",
    "above": "上",
    "below": "下",
    "modify": "編集",
    "onRight": "右へ",
    "up": "上へ",
    "down": "下へ",
    "delete": "削除",
    "chooseCharacterImage": "キャラクター画像を選択",
    "newCharacter": "新しいキャラクター",
    "enterCharacterName": "キャラクター名を入力",
    "randomMale": "男性キャラクターをランダム選択",
    "randomFemale": "女性キャラクターをランダム選択",
    "saving": "保存中...",
    "dragDownToClose": "下にドラッグして閉じる",
    "more": "その他",
    "uploadAudio": "音声をアップロード",
    "done": "完了",
    "editAuthorsNote": "作者ノートを編集",
    "addAuthorsNote": "作者ノートを追加",
    "writeShortNote": "読者への短いメッセージを書きましょう。",
    "closeAuthorsNote": "作者ノートを閉じる",
    "authorNotePlaceholder": "読者への感謝、短い更新、メッセージなどを入力...",
    "saveAuthorsNote": "作者ノートを保存",
    "maximumAudio": "最大 1 分 · 5 MB",
    "closeAudioUpload": "音声アップロードを閉じる",
    "removeSelectedAudio": "選択した音声を削除",
    "dropAudioHere": "ここに音声をドロップ",
    "dropAudioHereOrChoose": "ここに音声をドロップするか端末から選択",
    "audioFormats": "MP3、M4A、AAC、WAV、WebM",
    "chooseAnotherAudio": "別の音声を選択",
    "episode1": "エピソード 1",
    "newEpisode": "新しいエピソード",
    "failedLoadCharacters": "キャラクターを読み込めませんでした",
    "cannotConnectBackend": "バックエンドに接続できません。",
    "failedLoadEpisode": "Chat Story エピソードを読み込めませんでした",
    "notChatStoryEpisode": "このエピソードは Chat Story ではありません",
    "episode": "エピソード",
    "finishCurrentEdit": "現在の編集を完了またはキャンセルしてください。",
    "messageUpdated": "メッセージを更新しました。",
    "chooseImageFile": "画像ファイルを選択してください。",
    "profileImageTooLarge": "プロフィール画像は 2 MB 以下にしてください。",
    "failedLoadCharacterImages": "キャラクター画像を読み込めませんでした",
    "noFemaleImages": "女性キャラクター画像が見つかりませんでした。",
    "noMaleImages": "男性キャラクター画像が見つかりませんでした。",
    "failedChooseRandom": "ランダムなキャラクターを選べませんでした",
    "enterCharacterRequired": "キャラクター名を入力してください。",
    "female": "女性",
    "male": "男性",
    "failedAddCharacter": "キャラクターを追加できませんでした",
    "characterSavedMissing": "キャラクターは保存されましたが読み込めませんでした",
    "characterAdded": "キャラクターを追加しました。",
    "authorNoteUpdated": "作者ノートを更新しました。",
    "authorNoteSaved": "作者ノートを保存しました。",
    "chooseAudioTypes": "MP3、M4A、AAC、WAV、WebM の音声を選択してください。",
    "audioTooLarge": "音声は 5 MB 以下にしてください。",
    "audioDuration": "音声は1秒から1分の長さにしてください。",
    "audioUnreadable": "この音声ファイルを読み込めません。",
    "audioInfoUnreadable": "音声情報を読み込めません。別のファイルを試してください。",
    "imageTooLarge": "画像は 8 MB 以下にしてください。",
    "imageAdded": "画像を追加しました。",
    "failedUploadImage": "画像をアップロードできませんでした",
    "chooseSchedule": "予約日時を選択してください。",
    "failedPublishEpisode": "エピソードを公開できませんでした",
    "enterEpisodeTitleRequired": "エピソードタイトルを入力してください。",
    "addOneMessage": "Chat またはナレーションを1件以上追加してください。",
    "failedSaveEpisode": "Chat Story エピソードを保存できませんでした",
    "episodeSavedMissingId": "エピソードは保存されましたが ID がありません",
    "episodeTitle": "エピソードタイトル",
    "episodeTitleHelp": "ここをタップしてエピソードタイトルを追加または編集します。",
    "chooseSpeaker": "話者を選択",
    "chooseSpeakerHelp": "Chat 用のキャラクターを選択します。ナレーションには ASIDE を選択します。",
    "addCharacter": "キャラクターを追加",
    "addCharacterHelp": "物語に必要なとき、新しいキャラクターを作成します。",
    "writeMessage": "メッセージを書く",
    "writeMessageHelp": "メッセージを入力して送信します。送信済みメッセージをタップすると編集・移動・削除できます。",
    "moreTools": "その他のツール",
    "moreToolsHelp": "音声と作者ノートのツールをここから開きます。",
    "saveAndPublish": "保存して公開",
    "savePublishHelp": "「次へ」をタップしてエピソードを保存し、公開設定を開きます。",
    "enterEpisodeTitle": "エピソードタイトルを入力",
    "ok": "OK",
    "goBack": "戻る",
    "messageCount": "{{count}} 件のメッセージ",
    "messagesCount": "{{count}} 件のメッセージ",
    "wordCount": "{{count}} 語",
    "wordsCount": "{{count}} 語",
    "savedIn": "{{time}} で保存",
    "storyInfo": "ストーリー情報",
    "characters": "キャラクター",
    "chat": "チャット",
    "publish": "公開",
    "loadingCharacters": "キャラクターを読み込み中...",
    "startConversation": "会話を始める",
    "startConversationHelp": "下のキャラクターを1人選んでメッセージを書きます。同じキャラクターをもう一度タップすると選択を解除し、アバターなしのナレーションを書けます。",
    "next": "次へ",
    "modifyMessage": "メッセージを編集",
    "insertAbove": "選択したメッセージの上に挿入",
    "insertBelow": "選択したメッセージの下に挿入",
    "modifyMessagePrefix": "メッセージを編集：",
    "asidePrefix": "ナレーション：",
    "messageSymbols": "メッセージ記号",
    "comingSoon": "近日公開",
    "emojiComingSoon": "絵文字は近日公開",
    "sendMessage": "メッセージを送信",
    "addImage": "画像を追加"
  },
  "ko": {
    "failedUploadCharacterImage": "캐릭터 이미지를 업로드하지 못했습니다",
    "failedUploadChatImage": "Chat Story 이미지를 업로드하지 못했습니다",
    "missingImageUrl": "이미지는 업로드되었지만 이미지 URL이 없습니다",
    "character": "캐릭터",
    "unnamed": "이름 없음",
    "unnamedCharacter": "이름 없는 캐릭터",
    "editCharacterProfileImage": "캐릭터 프로필 이미지 편집",
    "editProfile": "프로필 편집",
    "cancel": "취소",
    "confirm": "확인",
    "aside": "나레이션",
    "editAside": "나레이션 편집",
    "chatStory": "Chat Story",
    "editImage": "이미지 편집",
    "toBeContinued": "계속",
    "authorsNote": "작가 노트",
    "deleteAuthorsNote": "작가 노트 삭제",
    "editMessage": "메시지 편집",
    "above": "위",
    "below": "아래",
    "modify": "수정",
    "onRight": "오른쪽으로",
    "up": "위로",
    "down": "아래로",
    "delete": "삭제",
    "chooseCharacterImage": "캐릭터 이미지 선택",
    "newCharacter": "새 캐릭터",
    "enterCharacterName": "캐릭터 이름 입력",
    "randomMale": "남성 캐릭터 무작위 선택",
    "randomFemale": "여성 캐릭터 무작위 선택",
    "saving": "저장 중...",
    "dragDownToClose": "아래로 드래그하여 닫기",
    "more": "더보기",
    "uploadAudio": "오디오 업로드",
    "done": "완료",
    "editAuthorsNote": "작가 노트 편집",
    "addAuthorsNote": "작가 노트 추가",
    "writeShortNote": "독자를 위한 짧은 메모를 작성하세요.",
    "closeAuthorsNote": "작가 노트 닫기",
    "authorNotePlaceholder": "독자에게 감사하거나 짧은 업데이트 또는 메시지를 남겨 보세요...",
    "saveAuthorsNote": "작가 노트 저장",
    "maximumAudio": "최대 1분 · 5 MB",
    "closeAudioUpload": "오디오 업로드 닫기",
    "removeSelectedAudio": "선택한 오디오 제거",
    "dropAudioHere": "여기에 오디오 놓기",
    "dropAudioHereOrChoose": "여기에 오디오를 놓거나 기기에서 선택",
    "audioFormats": "MP3, M4A, AAC, WAV 또는 WebM",
    "chooseAnotherAudio": "다른 오디오 선택",
    "episode1": "에피소드 1",
    "newEpisode": "새 에피소드",
    "failedLoadCharacters": "캐릭터를 불러오지 못했습니다",
    "cannotConnectBackend": "백엔드에 연결할 수 없습니다.",
    "failedLoadEpisode": "Chat Story 에피소드를 불러오지 못했습니다",
    "notChatStoryEpisode": "이 에피소드는 Chat Story 에피소드가 아닙니다",
    "episode": "에피소드",
    "finishCurrentEdit": "현재 편집을 먼저 완료하거나 취소해 주세요.",
    "messageUpdated": "메시지가 업데이트되었습니다.",
    "chooseImageFile": "이미지 파일을 선택해 주세요.",
    "profileImageTooLarge": "프로필 이미지는 2 MB 이하여야 합니다.",
    "failedLoadCharacterImages": "캐릭터 이미지를 불러오지 못했습니다",
    "noFemaleImages": "여성 캐릭터 이미지를 찾지 못했습니다.",
    "noMaleImages": "남성 캐릭터 이미지를 찾지 못했습니다.",
    "failedChooseRandom": "무작위 캐릭터를 선택하지 못했습니다",
    "enterCharacterRequired": "캐릭터 이름을 입력해 주세요.",
    "female": "여성",
    "male": "남성",
    "failedAddCharacter": "캐릭터를 추가하지 못했습니다",
    "characterSavedMissing": "캐릭터는 저장되었지만 불러오지 못했습니다",
    "characterAdded": "캐릭터가 추가되었습니다.",
    "authorNoteUpdated": "작가 노트가 업데이트되었습니다.",
    "authorNoteSaved": "작가 노트가 저장되었습니다.",
    "chooseAudioTypes": "MP3, M4A, AAC, WAV 또는 WebM 오디오를 선택해 주세요.",
    "audioTooLarge": "오디오는 5 MB 이하여야 합니다.",
    "audioDuration": "오디오는 1초에서 1분 사이여야 합니다.",
    "audioUnreadable": "이 오디오 파일을 읽을 수 없습니다.",
    "audioInfoUnreadable": "오디오 정보를 읽을 수 없습니다. 다른 파일을 시도해 주세요.",
    "imageTooLarge": "이미지는 8 MB 이하여야 합니다.",
    "imageAdded": "이미지가 추가되었습니다.",
    "failedUploadImage": "이미지를 업로드하지 못했습니다",
    "chooseSchedule": "예약 날짜와 시간을 선택해 주세요.",
    "failedPublishEpisode": "에피소드를 게시하지 못했습니다",
    "enterEpisodeTitleRequired": "에피소드 제목을 입력해 주세요.",
    "addOneMessage": "Chat 또는 나레이션 메시지를 최소 1개 추가하세요.",
    "failedSaveEpisode": "Chat Story 에피소드를 저장하지 못했습니다",
    "episodeSavedMissingId": "에피소드는 저장되었지만 ID가 없습니다",
    "episodeTitle": "에피소드 제목",
    "episodeTitleHelp": "여기를 눌러 에피소드 제목을 추가하거나 편집합니다.",
    "chooseSpeaker": "화자 선택",
    "chooseSpeakerHelp": "Chat에는 캐릭터를 선택하고, 나레이션에는 ASIDE를 선택하세요.",
    "addCharacter": "캐릭터 추가",
    "addCharacterHelp": "스토리에 필요할 때 새 캐릭터를 만드세요.",
    "writeMessage": "메시지 작성",
    "writeMessageHelp": "메시지를 입력하고 전송하세요. 보낸 메시지를 누르면 수정, 이동 또는 삭제할 수 있습니다.",
    "moreTools": "추가 도구",
    "moreToolsHelp": "오디오와 작가 노트 도구를 여기에서 엽니다.",
    "saveAndPublish": "저장 및 게시",
    "savePublishHelp": "다음을 눌러 에피소드를 저장하고 게시 설정을 여세요.",
    "enterEpisodeTitle": "에피소드 제목 입력",
    "ok": "확인",
    "goBack": "뒤로 가기",
    "messageCount": "메시지 {{count}}개",
    "messagesCount": "메시지 {{count}}개",
    "wordCount": "{{count}}단어",
    "wordsCount": "{{count}}단어",
    "savedIn": "{{time}}에 저장",
    "storyInfo": "스토리 정보",
    "characters": "캐릭터",
    "chat": "채팅",
    "publish": "게시",
    "loadingCharacters": "캐릭터 불러오는 중...",
    "startConversation": "대화를 시작하세요",
    "startConversationHelp": "아래에서 캐릭터 한 명을 선택해 메시지를 작성하세요. 같은 캐릭터를 다시 누르면 선택이 해제되고 아바타 없는 나레이션을 작성할 수 있습니다.",
    "next": "다음",
    "modifyMessage": "메시지 수정",
    "insertAbove": "선택한 메시지 위에 삽입",
    "insertBelow": "선택한 메시지 아래에 삽입",
    "modifyMessagePrefix": "메시지 수정:",
    "asidePrefix": "나레이션:",
    "messageSymbols": "메시지 기호",
    "comingSoon": "곧 출시",
    "emojiComingSoon": "이모지는 곧 제공됩니다",
    "sendMessage": "메시지 보내기",
    "addImage": "이미지 추가"
  }
})

import { ImageSourceSheet } from './ChatStoryCharactersPage'
import { PublishSettingsSheet } from './EpisodeEditorPage'
import { SuccessModal } from './PublishEpisodePage'
import ChatStoryEditorGuide from '../../components/chat-story/ChatStoryEditorGuide'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')


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
  if (!String(imageDataUrl || '').startsWith('data:image/')) {
    return imageDataUrl || null
  }

  const formData = new FormData()

  formData.append(
    'image',
    dataUrlToFile(
      imageDataUrl,
      `chat-character-${storyId}-${index + 1}-${Date.now()}.jpg`
    )
  )

  formData.append('folder', 'chat_story_character')

  const response = await fetch(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('chatStoryEditor.failedUploadCharacterImage'))
  }

  return data.image_url || data.imageUrl || null
}

async function uploadEpisodeImage(token, file) {
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', 'chat_story_episode')

  const response = await fetch(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || getDisplayText('chatStoryEditor.failedUploadChatImage')
    )
  }

  const imageUrl =
    data.image_url ||
    data.imageUrl ||
    ''

  if (!imageUrl) {
    throw new Error(
      getDisplayText('chatStoryEditor.missingImageUrl')
    )
  }

  return imageUrl
}

function mapCharacter(character) {
  const group = character.role_group || 'background'

  return {
    id: character.id,
    nickname: character.nickname || '',
    image: character.avatar_url || '',
    group,
    avatarSource: character.avatar_source || 'device',
isLead: character.is_lead === true,
chatSide:
  character.chat_side ||
  (group === 'main' ? 'right' : 'left'),
gender: character.gender || '',
    birthday: character.birthday || '',
    heightCm: character.height_cm || '',
    occupation: character.occupation || '',
    personality: character.personality || '',
    relationship: character.relationship || '',
    bio: character.bio || '',
  }
}

function countWords(value) {
  const text = String(value || '').trim()
  if (!text) return 0

  if (typeof Intl?.Segmenter === 'function') {
    return [...new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text)]
      .filter((item) => item.isWordLike).length
  }

  return text.split(/\s+/u).filter(Boolean).length
}

const MESSAGE_SYMBOLS = ['(...)', '—', '…', '?!', '♡', '✦', '☁', '「」', '♪']
const MAX_AUDIO_SIZE_BYTES = 5 * 1024 * 1024
const MAX_AUDIO_DURATION_SECONDS = 60
const MIN_AUDIO_DURATION_SECONDS = 1
const AUDIO_ACCEPT =
  'audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/x-wav,audio/webm,.mp3,.m4a,.aac,.wav,.webm'
function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Step({ number, title, active, done }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
          active
            ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
            : done
              ? 'bg-[#eafaf2] text-[#16803c]'
              : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
        }`}
      >
        {done ? <i className="fa-solid fa-check text-[10px]" /> : number}
      </div>
      <div
        className={`line-clamp-1 text-[10px] font-extrabold ${
          active ? 'text-[var(--shadow-text-primary)]' : done ? 'text-[#16803c]' : 'text-[var(--shadow-text-tertiary)]'
        }`}
      >
        {title}
      </div>
    </div>
  )
}

function CharacterAvatar({ character, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[52px] shrink-0 rounded-[10px] py-1 text-center transition active:scale-[0.97] ${
  selected ? 'bg-[var(--shadow-bg-hover)]' : 'bg-transparent'
}`}
      aria-pressed={selected}
    >
      <span
        className={`relative mx-auto flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] transition ${
          selected
            ? 'ring-[3px] ring-[#7c3aed] ring-offset-1 ring-offset-[var(--shadow-bg-surface)]'
            : 'ring-1 ring-inset ring-[var(--shadow-border)]'
        }`}
      >
        {character.image ? (
          <img
            src={character.image}
            alt={character.nickname || getDisplayText('chatStoryEditor.character')}
            className="h-full w-full object-cover"
          />
        ) : (
          <i className="fa-solid fa-user text-[18px] text-[#9b87c9]" />
        )}

        
      </span>

      <span
        className={`mt-1 block truncate text-[8.5px] font-semibold ${
  selected ? 'text-[#7c3aed]' : 'text-[var(--shadow-text-secondary)]'
}`}
      >
        {character.nickname || getDisplayText('chatStoryEditor.unnamed')}
      </span>
    </button>
  )
}

function CharacterQuickPopup({
  character,
  onClose,
  onConfirm,
  onEditProfile,
}) {
  if (!character) return null

  return (
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[360px] rounded-[28px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onEditProfile}
            className="relative active:scale-[0.98]"
            aria-label={getDisplayText('chatStoryEditor.editCharacterProfileImage')}
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
              {character.image ? (
                <img
                  src={character.image}
                  alt={character.nickname || getDisplayText('chatStoryEditor.character')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-[#9b87c9]" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onEditProfile}
          className="mt-7 flex h-14 w-full items-center justify-between rounded-full bg-[var(--shadow-bg-soft)] px-5 text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
        >
          <span className="min-w-0 flex-1 truncate text-center text-[16px] font-medium">
            {character.nickname || getDisplayText('chatStoryEditor.unnamedCharacter')}
          </span>

          <i className="fa-regular fa-pen-to-square ml-3 shrink-0 text-[17px] text-[var(--shadow-text-tertiary)]" />
        </button>

        <button
          type="button"
          onClick={onEditProfile}
          className="mx-auto mt-5 flex items-center justify-center gap-2 px-4 py-2 text-[14px] font-medium text-[#7c3aed] active:opacity-60"
        >
          {getDisplayText('chatStoryEditor.editProfile')}
          <i className="fa-solid fa-angles-right text-[10px]" />
        </button>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-secondary)] active:scale-[0.98]"
          >
            {getDisplayText('chatStoryEditor.cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98]"
          >
            {getDisplayText('chatStoryEditor.confirm')}
          </button>
        </div>
      </section>
    </div>
  )
}

function AsideAvatar({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[52px] shrink-0 rounded-[10px] py-1 text-center transition active:scale-[0.97] ${
  active ? 'bg-[var(--shadow-bg-hover)]' : 'bg-transparent'
}`}
      aria-pressed={active}
    >
      <span
        className={`relative mx-auto flex h-[40px] w-[40px] items-center justify-center rounded-full transition ${
  active
    ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed] ring-[3px] ring-inset ring-[#7c3aed]'
    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] ring-1 ring-inset ring-[var(--shadow-border)]'
}`}
      >
        <i className="fa-solid fa-align-left text-[14px]" />
      </span>

      <span
        className={`mt-1 block truncate text-[8.5px] font-semibold ${
  active ? 'text-[#7c3aed]' : 'text-[var(--shadow-text-secondary)]'
}`}
      >
        {getDisplayText('chatStoryEditor.aside')}
      </span>
    </button>
  )
}

function AsideMessage({
  message,
  active,
  onEdit,
  onElementRef,
}) {
  return (
    <div
      ref={(node) => onElementRef(message.id, node)}
      data-message-id={message.id}
      className="group mx-auto flex max-w-[88%] items-center justify-center gap-2 py-2"
    >
      <div
        className={`min-w-0 max-w-[calc(100%-34px)] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-center text-[13px] leading-6 text-[var(--shadow-text-secondary)] ${
  active
  ? 'ring-1 ring-[#f59e0b]'
  : ''
}`}
      >
        {message.text}
      </div>

      <button
        type="button"
        onClick={() => onEdit(message.id)}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
          active
            ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
            : 'text-[var(--shadow-text-disabled)] active:bg-[var(--shadow-bg-soft)]'
        }`}
        aria-label={getDisplayText('chatStoryEditor.editAside')}
      >
        <ToolbarIcon name="modify" className="h-[12px] w-[12px]" />
      </button>
    </div>
  )
}

function EditorImageMessage({
  message,
  character,
  right,
  active,
  onEdit,
  onElementRef,
}) {
  const imageUrl =
    message.imageUrl ||
    message.image_url ||
    ''

  const imageContent = (
    <div
      className={`max-w-[76%] overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)] ${
        active
          ? 'ring-2 ring-[#f59e0b]'
          : 'ring-1 ring-[var(--shadow-border)]'
      }`}
    >
      <img
        src={imageUrl}
        alt={getDisplayText('chatStoryEditor.chatStory')}
        className="block max-h-[360px] w-full object-contain"
      />
    </div>
  )

  if (!message.characterId) {
    return (
      <div
        ref={(node) =>
          onElementRef(message.id, node)
        }
        data-message-id={message.id}
        className="mx-auto flex max-w-[88%] items-center justify-center gap-2 py-2"
      >
        {imageContent}

        <button
          type="button"
          onClick={() => onEdit(message.id)}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
            active
              ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
              : 'text-[var(--shadow-text-disabled)] active:bg-[var(--shadow-bg-soft)]'
          }`}
          aria-label={getDisplayText('chatStoryEditor.editImage')}
        >
          <ToolbarIcon
            name="modify"
            className="h-[12px] w-[12px]"
          />
        </button>
      </div>
    )
  }

  const avatar = (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
      {character?.image ? (
        <img
          src={character.image}
          alt={
            character.nickname ||
            getDisplayText('chatStoryEditor.character')
          }
          className="h-full w-full object-cover"
        />
      ) : (
        <i className="fa-solid fa-user text-[16px] text-[#9b87c9]" />
      )}
    </span>
  )

  return (
    <div
      ref={(node) =>
        onElementRef(message.id, node)
      }
      data-message-id={message.id}
      className={`flex items-end gap-2 py-2 ${
        right
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      {!right ? avatar : null}

      {imageContent}

      {right ? avatar : null}

      <button
        type="button"
        onClick={() => onEdit(message.id)}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
          active
            ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
            : 'text-[var(--shadow-text-disabled)] active:bg-[var(--shadow-bg-soft)]'
        }`}
        aria-label={getDisplayText('chatStoryEditor.editImage')}
      >
        <ToolbarIcon
          name="modify"
          className="h-[12px] w-[12px]"
        />
      </button>
    </div>
  )
}

function AuthorNoteMessage({ message, onDelete }) {
  return (
    <section className="mx-auto mt-8 max-w-[560px] pb-3">
      <div className="mb-4 text-center">
        <div className="text-[11px] tracking-[0.18em] text-[#8a7d96]">
          {getDisplayText('chatStoryEditor.toBeContinued')}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 px-6">
          <span className="h-px flex-1 bg-[var(--shadow-border)]" />
          <span className="text-[12px] text-[#ef4444]">♥</span>
          <span className="h-px flex-1 bg-[var(--shadow-border)]" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[16px] border border-[#e5d8ff] bg-gradient-to-br from-[var(--shadow-bg-soft)] to-[var(--shadow-bg-elevated)] px-4 py-4 shadow-[0_6px_18px_rgba(124,58,237,0.06)]">
        <span className="absolute right-4 top-3 text-[17px] text-[#c4a7ff]">
          ✦
        </span>

        <span className="absolute right-8 top-7 text-[10px] text-[#d9c8ff]">
          ✦
        </span>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <i className="fa-solid fa-pen text-[11px]" />
            </span>

            <h3 className="text-[13px] font-bold text-[#6d42db]">
              {getDisplayText('chatStoryEditor.authorsNote')}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#a89ab8] active:bg-[var(--shadow-bg-surface)] active:text-[#dc2626]"
            aria-label={getDisplayText('chatStoryEditor.deleteAuthorsNote')}
          >
            <i className="fa-regular fa-trash-can text-[10px]" />
          </button>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-6 text-[var(--shadow-text-secondary)]">
          {message.text}
        </p>
      </div>
    </section>
  )
}

function isSingleEmoji(value) {
  const text = String(value || '').trim()
  if (!text || !/[\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(text)) return false
  const parts = typeof Intl?.Segmenter === 'function'
    ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)]
    : Array.from(text)
  return parts.length === 1
}

function ChatMessage({
  message,
  character,
  right,
  active,
  onEdit,
  onElementRef,
}) {

  const singleEmoji = isSingleEmoji(message.text)
const bubbleClass = singleEmoji
  ? 'bg-transparent px-1 py-1 text-[64px] leading-none'
  : right
    ? 'rounded-[20px] rounded-br-[7px] bg-[var(--shadow-bg-elevated)] px-4 py-3 text-[13px] leading-6 text-[var(--shadow-text-primary)]'
    : 'rounded-[20px] rounded-bl-[7px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] leading-6 text-[var(--shadow-text-primary)] shadow-sm'
  const editButton = (
    <button
      type="button"
      onClick={() => onEdit(message.id)}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
        active
          ? 'bg-[var(--shadow-bg-soft)] text-[#7c3aed]'
          : 'text-[var(--shadow-text-disabled)] active:bg-[var(--shadow-bg-soft)]'
      }`}
      aria-label={getDisplayText('chatStoryEditor.editMessage')}
    >
      <ToolbarIcon name="modify" className="h-[12px] w-[12px]" />
    </button>
  )

  return (
    <div
      ref={(node) => onElementRef(message.id, node)}
      data-message-id={message.id}
      className={`flex items-end gap-2 py-2 ${
        right ? 'justify-end' : 'justify-start'
      }`}
    >
      {!right ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {character?.image ? (
            <img
              src={character.image}
              alt={character.nickname || getDisplayText('chatStoryEditor.character')}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[13px] text-[#9b87c9]" />
          )}
        </span>
      ) : null}

      <div
        className={`min-w-0 max-w-[82%] text-left ${
  right ? 'items-end' : 'items-start'
}`}
      >
        <div className="mb-1 px-1 text-[9.5px] font-extrabold text-[var(--shadow-text-tertiary)]">
          {character?.nickname || getDisplayText('chatStoryEditor.character')}
        </div>

        <div className="flex items-center gap-1.5">
          {right ? editButton : null}

          <div
  className={`min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] ${
    singleEmoji
      ? 'bg-transparent px-1 py-1 text-[64px] leading-none'
      : right
        ? 'rounded-[20px] rounded-br-[7px] bg-[var(--shadow-bg-elevated)] px-4 py-3 text-[13px] leading-6 text-[var(--shadow-text-primary)]'
        : 'rounded-[20px] rounded-bl-[7px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] leading-6 text-[var(--shadow-text-primary)] shadow-sm'
  } ${
    active
      ? 'ring-1 ring-[#f59e0b]'
      : !right && !singleEmoji
        ? 'ring-1 ring-[var(--shadow-border)]'
        : ''
  }`}
>
  {message.text}
</div>

          {!right ? editButton : null}
        </div>
      </div>

      {right ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {character?.image ? (
            <img
              src={character.image}
              alt={character.nickname || getDisplayText('chatStoryEditor.character')}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[13px] text-[#9b87c9]" />
          )}
        </span>
      ) : null}
    </div>
  )
}

function ToolbarIcon({ name, className = 'h-[19px] w-[19px]' }) {
  const iconClass = className

  if (name === 'above') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M4 6h11" />
        <path d="M4 12h8" />
        <path d="M4 18h6" />
        <path d="M19 18V7" />
        <path d="m15.5 10.5 3.5-3.5 3.5 3.5" />
      </svg>
    )
  }

  if (name === 'below') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M4 6h6" />
        <path d="M4 12h8" />
        <path d="M4 18h11" />
        <path d="M19 6v11" />
        <path d="m15.5 13.5 3.5 3.5 3.5-3.5" />
      </svg>
    )
  }

  if (name === 'modify') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    )
  }

  if (name === 'right') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <circle cx="9" cy="7" r="3" />
        <path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20" />
        <path d="M18 8v6" />
        <path d="M15 11h6" />
      </svg>
    )
  }

  if (name === 'up') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="m5 12 7-7 7 7" />
        <path d="m5 19 7-7 7 7" />
      </svg>
    )
  }

  if (name === 'down') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="m5 5 7 7 7-7" />
        <path d="m5 12 7 7 7-7" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

function MessageToolbarAction({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[clamp(42px,11vw,48px)] shrink-0 flex-col items-center justify-center gap-1 rounded-[6px] px-0 py-1.5 text-white active:bg-[var(--shadow-bg-surface)]/10"
    >
      <ToolbarIcon name={icon} />

      <span className="whitespace-nowrap text-[8px] font-normal">
        {label}
      </span>
    </button>
  )
}

function MessageEditToolbar({
  message,
  position,
  isLead,
  canMoveUp,
  canMoveDown,
  onAbove,
  onBelow,
  onModify,
  onMakeLead,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  if (
    !message ||
    !position ||
    message.type === 'author_note'
  ) {
    return null
  }

  const canMakeLead =
    message.type === 'chat' &&
    !isLead

  return (
    <div
  data-message-toolbar="true"
  className="fixed left-1/2 z-[205] max-w-[calc(100vw-16px)] -translate-x-1/2"
  style={{
    top: `${position.top}px`,
  }}
>
      <div className="inline-flex min-h-[64px] w-max max-w-full items-stretch gap-[3px] rounded-[8px] bg-[#303033] px-2 py-1.5">
        <MessageToolbarAction
          icon="above"
          label={getDisplayText('chatStoryEditor.above')}
          onClick={onAbove}
        />

        <MessageToolbarAction
          icon="below"
          label={getDisplayText('chatStoryEditor.below')}
          onClick={onBelow}
        />

        {message.type !== 'image' ? (
  <MessageToolbarAction
    icon="modify"
    label={getDisplayText('chatStoryEditor.modify')}
    onClick={onModify}
  />
) : null}
        {canMakeLead ? (
          <MessageToolbarAction
            icon="right"
            label={getDisplayText('chatStoryEditor.onRight')}
            onClick={onMakeLead}
          />
        ) : null}

        {canMoveUp ? (
          <MessageToolbarAction
            icon="up"
            label={getDisplayText('chatStoryEditor.up')}
            onClick={onMoveUp}
          />
        ) : null}

        {canMoveDown ? (
          <MessageToolbarAction
            icon="down"
            label={getDisplayText('chatStoryEditor.down')}
            onClick={onMoveDown}
          />
        ) : null}

        <MessageToolbarAction
          icon="delete"
          label={getDisplayText('chatStoryEditor.delete')}
          onClick={onDelete}
        />
      </div>
    </div>
  )
}


function AddCharacterPopup({
  open,
  name,
  image,
  saving,
  randomLoading,
  onNameChange,
  onChooseImage,
  onRandomMale,
  onRandomFemale,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[340px] rounded-[28px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onChooseImage}
            disabled={saving}
            className="relative active:scale-[0.98] disabled:opacity-60"
            aria-label={getDisplayText('chatStoryEditor.chooseCharacterImage')}
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
              {image ? (
                <img
                  src={image}
                  alt={name || getDisplayText('chatStoryEditor.newCharacter')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-[#9b87c9]" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <div className="relative mt-7">
          <input
            autoFocus
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            maxLength={40}
            placeholder={getDisplayText('chatStoryEditor.enterCharacterName')}
            disabled={saving}
            className="h-14 w-full rounded-full bg-[var(--shadow-bg-soft)] px-12 text-center text-[15px] font-medium text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] focus:ring-2 focus:ring-[#9362ef]/25 disabled:opacity-60"
          />

          <i className="fa-regular fa-pen-to-square pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[16px] text-[var(--shadow-text-tertiary)]" />
        </div>

        <div className="mt-5 space-y-1">
          <button
            type="button"
            onClick={onRandomMale}
            disabled={saving || randomLoading}
            className="flex h-11 w-full items-center justify-center text-[13px] font-medium text-[#7c3aed] active:opacity-60 disabled:opacity-45"
          >
            {randomLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-[14px]" />
            ) : (
              getDisplayText('chatStoryEditor.randomMale')
            )}
          </button>

          <button
            type="button"
            onClick={onRandomFemale}
            disabled={saving || randomLoading}
            className="flex h-11 w-full items-center justify-center text-[13px] font-medium text-[#7c3aed] active:opacity-60 disabled:opacity-45"
          >
            {randomLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-[14px]" />
            ) : (
              getDisplayText('chatStoryEditor.randomFemale')
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-secondary)] active:scale-[0.98] disabled:opacity-60"
          >
            {getDisplayText('chatStoryEditor.cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving || !name.trim()}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? getDisplayText('chatStoryEditor.saving') : getDisplayText('chatStoryEditor.confirm')}
          </button>
        </div>
      </section>
    </div>
  )
}

function MorePopup({
  open,
  onClose,
  onUploadAudio,
  onAuthorNote,
  hasAuthorNote,
}) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement

    const previousBodyOverflow =
      body.style.overflow
    const previousBodyPosition =
      body.style.position
    const previousBodyTop =
      body.style.top
    const previousBodyWidth =
      body.style.width
    const previousHtmlOverflow =
      html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    setDragY(0)
    dragYRef.current = 0
    draggingRef.current = false

    return () => {
      body.style.overflow =
        previousBodyOverflow
      body.style.position =
        previousBodyPosition
      body.style.top =
        previousBodyTop
      body.style.width =
        previousBodyWidth
      html.style.overflow =
        previousHtmlOverflow

      window.scrollTo(0, scrollY)
    }
  }, [open])

  const startDrag = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    dragYRef.current = 0
    setDragY(0)

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextY = Math.max(
      0,
      event.clientY - startYRef.current
    )

    dragYRef.current = nextY
    setDragY(nextY)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    const shouldClose =
      dragYRef.current >= 90

    dragYRef.current = 0

    if (shouldClose) {
      onClose()
      return
    }

    setDragY(0)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[240] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="w-full rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label={getDisplayText('chatStoryEditor.dragDownToClose')}
        >
          <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </button>

        <h2 className="mt-1 text-center text-[16px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('chatStoryEditor.more')}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onUploadAudio}
            className="flex min-h-[126px] flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] px-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <i className="fa-solid fa-microphone text-[22px]" />
            </span>

            <span className="mt-3 text-[12px] font-medium text-[var(--shadow-text-primary)]">
              {getDisplayText('chatStoryEditor.uploadAudio')}
            </span>
          </button>

          <button
            type="button"
            onClick={onAuthorNote}
            className="flex min-h-[126px] flex-col items-center justify-center rounded-[20px] bg-[var(--shadow-bg-soft)] px-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <i className="fa-regular fa-comment-dots text-[22px]" />
            </span>

            <span className="mt-3 text-[12px] font-medium text-[var(--shadow-text-primary)]">
              {hasAuthorNote
                ? getDisplayText('chatStoryEditor.editAuthorsNote')
                : getDisplayText('chatStoryEditor.addAuthorsNote')}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white"
        >
          {getDisplayText('chatStoryEditor.done')}
        </button>
      </section>
    </div>
  )
}


function AuthorNoteSheet({ open, value, onChange, onClose, onSave }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    dragYRef.current = 0

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
      className="fixed inset-0 z-[250] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="w-full rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-[calc(22px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label={getDisplayText('chatStoryEditor.dragDownToClose')}
        >
          <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </button>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
              {getDisplayText('chatStoryEditor.authorsNote')}
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
              {getDisplayText('chatStoryEditor.writeShortNote')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
            aria-label={getDisplayText('chatStoryEditor.closeAuthorsNote')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-5 rounded-[16px] border border-[#e5d8ff] bg-[var(--shadow-bg-soft)] px-4 py-3 focus-within:border-[#9b6cf3] focus-within:ring-2 focus-within:ring-[#9b6cf3]/15">
          <textarea
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={600}
            rows={7}
            placeholder={getDisplayText('chatStoryEditor.authorNotePlaceholder')}
            className="min-h-[170px] max-h-[260px] w-full resize-none overflow-y-auto bg-transparent text-[13px] leading-6 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
          />

          <div className="mt-2 text-right text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
            {value.length} / 600
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim()}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {getDisplayText('chatStoryEditor.saveAuthorsNote')}
        </button>
      </section>
    </div>
  )
}

function AudioUploadSheet({
  open,
  file,
  previewUrl,
  duration,
  onChoose,
  onDropFile,
  onClose,
  onClear,
}) {
  const [dragY, setDragY] = useState(0)
  const [dropActive, setDropActive] = useState(false)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)
  const dragDepthRef = useRef(0)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    setDropActive(false)
    dragYRef.current = 0
    dragDepthRef.current = 0

    const preventFileNavigation = (event) => {
      const types = Array.from(event.dataTransfer?.types || [])
      if (types.includes('Files')) event.preventDefault()
    }

    window.addEventListener('dragover', preventFileNavigation)
    window.addEventListener('drop', preventFileNavigation)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('dragover', preventFileNavigation)
      window.removeEventListener('drop', preventFileNavigation)
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

  const getDroppedFile = (dataTransfer) => {
    const directFile = dataTransfer?.files?.[0]
    if (directFile) return directFile

    const fileItem = Array.from(dataTransfer?.items || []).find(
      (item) => item.kind === 'file'
    )

    return fileItem?.getAsFile?.() || null
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return

    dragDepthRef.current += 1
    setDropActive(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
    setDropActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) setDropActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = 0
    setDropActive(false)

    const droppedFile = getDroppedFile(event.dataTransfer)
    if (droppedFile) onDropFile(droppedFile)
  }

  if (!open) return null

  const sizeMb = file ? (file.size / (1024 * 1024)).toFixed(2) : '0.00'
  const roundedDuration = Math.max(0, Math.round(duration || 0))
  const durationText = `${Math.floor(roundedDuration / 60)}:${String(
    roundedDuration % 60
  ).padStart(2, '0')}`

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end bg-black/45"
      onClick={onClose}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <section
        className="w-full rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label={getDisplayText('chatStoryEditor.dragDownToClose')}
        >
          <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </button>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
              {getDisplayText('chatStoryEditor.uploadAudio')}
            </h2>
            <p className="mt-1 text-[10.5px] text-[var(--shadow-text-secondary)]">
              {getDisplayText('chatStoryEditor.maximumAudio')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
            aria-label={getDisplayText('chatStoryEditor.closeAudioUpload')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        {file && previewUrl ? (
          <div className="mt-5 rounded-[18px] border border-[#e5d8ff] bg-[var(--shadow-bg-soft)] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
                <i className="fa-solid fa-music text-[16px]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-semibold text-[var(--shadow-text-primary)]">
                  {file.name}
                </div>
                <div className="mt-1 text-[10.5px] text-[var(--shadow-text-secondary)]">
                  {durationText} · {sizeMb} MB
                </div>
              </div>

              <button
                type="button"
                onClick={onClear}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-tertiary)] ring-1 ring-[var(--shadow-border)]"
                aria-label={getDisplayText('chatStoryEditor.removeSelectedAudio')}
              >
                <i className="fa-solid fa-xmark text-[11px]" />
              </button>
            </div>

            <audio
              controls
              preload="metadata"
              src={previewUrl}
              className="mt-4 h-10 w-full"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onChoose}
            className={`mt-5 flex min-h-[170px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed px-5 text-center transition active:scale-[0.99] ${
              dropActive
                ? 'border-[#7c3aed] bg-[var(--shadow-bg-soft)] ring-2 ring-[#7c3aed]/15'
                : 'border-[#cdbbff] bg-[var(--shadow-bg-soft)]'
            }`}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[#7c3aed] transition ${
                dropActive ? 'scale-105 bg-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-soft)]'
              }`}
            >
              <i className="fa-solid fa-upload text-[19px]" />
            </span>

            <span className="mt-3 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
              {dropActive
                ? getDisplayText('chatStoryEditor.dropAudioHere')
                : getDisplayText('chatStoryEditor.dropAudioHereOrChoose')}
            </span>

            <span className="mt-1 text-[10.5px] leading-5 text-[var(--shadow-text-secondary)]">
              {getDisplayText('chatStoryEditor.audioFormats')}
            </span>
          </button>
        )}

        {file ? (
          <button
            type="button"
            onClick={onChoose}
            className="mt-4 h-11 w-full rounded-full bg-[var(--shadow-bg-soft)] text-[12px] font-medium text-[var(--shadow-text-secondary)]"
          >
            {getDisplayText('chatStoryEditor.chooseAnotherAudio')}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white"
        >
          {getDisplayText('chatStoryEditor.done')}
        </button>
      </section>
    </div>
  )
}

export default function ChatStoryEditorPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const shouldScrollToEndRef = useRef(false)
  const messageElementsRef = useRef(new Map())
  const messageToolbarAutoScrollRef = useRef('')
  const composerRef = useRef(null)
  const audioInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const characterImageInputRef = useRef(null)
  const messagesRef = useRef([])
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const restoredEditorDraftRef = useRef(false)
  const restoredDraftCharactersRef = useRef(false)
  const [characters, setCharacters] = useState([])
  const [messages, setMessages] = useState([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
  const [profilePopupCharacter, setProfilePopupCharacter] = useState(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [titlePopupOpen, setTitlePopupOpen] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [episodeId, setEpisodeId] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [composerFocused, setComposerFocused] = useState(false)
  const [addPopupOpen, setAddPopupOpen] = useState(false)
  const [imageSourceOpen, setImageSourceOpen] = useState(false)
  const [newCharacterName, setNewCharacterName] = useState('')
  const [newCharacterImage, setNewCharacterImage] = useState('')
  const [newCharacterAvatarSource, setNewCharacterAvatarSource] =
    useState('device')
  const [newCharacterGender, setNewCharacterGender] = useState('')
  const [randomAvatarLoading, setRandomAvatarLoading] = useState(false)
  const [addCharacterSaving, setAddCharacterSaving] = useState(false)
  const [morePopupOpen, setMorePopupOpen] = useState(false)
  const [authorNoteOpen, setAuthorNoteOpen] = useState(false)
  const [authorNoteDraft, setAuthorNoteDraft] = useState('')
  const [audioSheetOpen, setAudioSheetOpen] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [symbolPanelOpen, setSymbolPanelOpen] = useState(false)
  const [composerMode, setComposerMode] = useState('message')
  const [activeMessageId, setActiveMessageId] = useState('')
  const [messageToolbarPosition, setMessageToolbarPosition] =
    useState(null)
  const [messageEditMode, setMessageEditMode] = useState(null)
  const [episodeLeadCharacterId, setEpisodeLeadCharacterId] = useState('')
  const [savedSeconds, setSavedSeconds] = useState(0)
  const [draftHydrated, setDraftHydrated] = useState(false)
  const [publishSettingsOpen, setPublishSettingsOpen] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [episodeAdult, setEpisodeAdult] = useState(false)
  const [episodeFree, setEpisodeFree] = useState(true)
  const [successOpen, setSuccessOpen] = useState(false)
  const [publishedIsFirstEpisode, setPublishedIsFirstEpisode] = useState(false)
  const [publishedEpisodeNumber, setPublishedEpisodeNumber] = useState(null)
  const [guideOpen, setGuideOpen] = useState(false)

  useEffect(() => {
    const textarea = composerRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
    textarea.style.overflowY = textarea.scrollHeight > 96 ? 'auto' : 'hidden'
  }, [draft])

  const requestedEpisodeId =
  searchParams.get('episodeId') ||
  searchParams.get('episode_id') ||
  ''
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
const draftScope = startNewEpisode
  ? 'new'
  : requestedEpisodeId
    ? `episode_${requestedEpisodeId}`
    : 'new'
const storageKey =
  `chat_story_editor_draft_${storyId || 'unknown'}_${draftScope}`
const gallerySnapshotKey =
  `chat_story_editor_gallery_snapshot_${storyId || 'unknown'}_${draftScope}`
  const castStorageKey =
  `chat_story_episode_cast_${storyId || 'unknown'}_new`
  useEffect(() => {
  if (loading || titlePopupOpen) return

  if (localStorage.getItem('shadow_chat_editor_guide_v1') !== 'completed') {
    setGuideOpen(true)
  }
}, [loading, titlePopupOpen])

  const characterMap = useMemo(() => {
    return characters.reduce((result, character) => {
      result[character.id] = character
      return result
    }, {})
  }, [characters])

  const selectedCharacter = selectedCharacterId
    ? characterMap[selectedCharacterId] || null
    : null

  const defaultLeadCharacterId =
  characters.find(
    (character) => character.isLead
  )?.id ||
  characters.find(
    (character) =>
      character.chatSide === 'right'
  )?.id ||
  characters.find(
    (character) =>
      character.group === 'main'
  )?.id ||
  characters[0]?.id ||
  ''

const effectiveLeadCharacterId =
  episodeLeadCharacterId ||
  defaultLeadCharacterId

const activeMessage =
  messages.find(
    (message) =>
      message.id === activeMessageId
  ) || null

const storyMessages = messages.filter(
  (message) =>
    message.type !== 'author_note'
)

const activeStoryIndex =
  storyMessages.findIndex(
    (message) =>
      message.id === activeMessageId
  )

const activeMessageCharacter =
  activeMessage?.characterId
    ? characterMap[
        activeMessage.characterId
      ] || null
    : null

const activeMessageIsLead =
  activeMessage?.type === 'chat' &&
  activeMessage.characterId ===
    effectiveLeadCharacterId

const canMoveActiveMessageUp =
  activeStoryIndex > 0

const canMoveActiveMessageDown =
  activeStoryIndex >= 0 &&
  activeStoryIndex <
    storyMessages.length - 1


const registerMessageElement = (
  messageId,
  node
) => {
  if (node) {
    messageElementsRef.current.set(
      messageId,
      node
    )
    return
  }

  messageElementsRef.current.delete(
    messageId
  )
}

useEffect(() => {
  if (!activeMessageId) {
    setMessageToolbarPosition(null)
    return undefined
  }

  messageToolbarAutoScrollRef.current = ''
  let timeoutId = 0

  const updateToolbarPosition = () => {
    const element =
      messageElementsRef.current.get(
        activeMessageId
      )

    if (!element) {
      setMessageToolbarPosition(null)
      return
    }

    const rect =
      element.getBoundingClientRect()

    const toolbarHeight = 64
    const gap = 8
    const topSafeArea = 62
    const bottomSafeArea = 170
    const bottomLimit =
      window.innerHeight -
      bottomSafeArea
    const belowTop = rect.bottom + gap
    const aboveTop =
      rect.top - gap - toolbarHeight
    const canPlaceBelow =
      belowTop + toolbarHeight <=
      bottomLimit
    const canPlaceAbove =
      aboveTop >= topSafeArea

    if (
      !canPlaceBelow &&
      !canPlaceAbove &&
      messageToolbarAutoScrollRef.current !==
        activeMessageId
    ) {
      messageToolbarAutoScrollRef.current =
        activeMessageId

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      timeoutId = window.setTimeout(
        updateToolbarPosition,
        320
      )
      return
    }

    const top = canPlaceBelow
      ? belowTop
      : canPlaceAbove
        ? aboveTop
        : Math.max(
            topSafeArea,
            Math.min(
              belowTop,
              bottomLimit -
                toolbarHeight
            )
          )

    setMessageToolbarPosition({
      top,
      placement: canPlaceBelow
        ? 'below'
        : 'above',
    })
  }

  const frameId =
    window.requestAnimationFrame(
      updateToolbarPosition
    )

  window.addEventListener(
    'resize',
    updateToolbarPosition
  )
  window.addEventListener(
    'scroll',
    updateToolbarPosition,
    true
  )

  return () => {
    window.cancelAnimationFrame(frameId)
    window.clearTimeout(timeoutId)
    window.removeEventListener(
      'resize',
      updateToolbarPosition
    )
    window.removeEventListener(
      'scroll',
      updateToolbarPosition,
      true
    )
  }
}, [
  activeMessageId,
  activeMessageIsLead,
  canMoveActiveMessageDown,
  canMoveActiveMessageUp,
  messages,
])

  useEffect(() => {
  if (
    !episodeLeadCharacterId &&
    defaultLeadCharacterId
  ) {
    setEpisodeLeadCharacterId(
      defaultLeadCharacterId
    )
  }
}, [
  defaultLeadCharacterId,
  episodeLeadCharacterId,
])

  const wordCount = useMemo(() => {
  return messages
    .filter((message) => message.type !== 'author_note')
    .reduce((total, message) => total + countWords(message.text), 0)
}, [messages])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2300)
  }

  const openTitlePopup = () => {
  setTitleDraft(episodeTitle)
  setTitlePopupOpen(true)
}

const saveEpisodeTitle = () => {
  const cleanTitle = titleDraft.trim()
  if (!cleanTitle) return

  setEpisodeTitle(cleanTitle)
  setTitlePopupOpen(false)
}

useEffect(() => {
  if (!titlePopupOpen) return undefined

  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = previousOverflow
  }
}, [titlePopupOpen])

  useEffect(() => {
  messagesRef.current = messages
}, [messages])

useEffect(() => {
  undoStackRef.current = []
  redoStackRef.current = []
  setCanUndo(false)
  setCanRedo(false)
}, [requestedEpisodeId, startNewEpisode, storyId])

const commitMessages = (updater) => {
  const current = messagesRef.current
  const next = typeof updater === 'function' ? updater(current) : updater

  undoStackRef.current = [...undoStackRef.current.slice(-49), current]
  redoStackRef.current = []
  messagesRef.current = next

  setMessages(next)
  setCanUndo(true)
  setCanRedo(false)
}

const handleUndo = () => {
  if (!undoStackRef.current.length) return

  const previous = undoStackRef.current.at(-1)
  undoStackRef.current = undoStackRef.current.slice(0, -1)
  redoStackRef.current = [...redoStackRef.current.slice(-49), messagesRef.current]
  messagesRef.current = previous

  setMessages(previous)
  setCanUndo(undoStackRef.current.length > 0)
  setCanRedo(true)
}

const handleRedo = () => {
  if (!redoStackRef.current.length) return

  const next = redoStackRef.current.at(-1)
  redoStackRef.current = redoStackRef.current.slice(0, -1)
  undoStackRef.current = [...undoStackRef.current.slice(-49), messagesRef.current]
  messagesRef.current = next

  setMessages(next)
  setCanUndo(true)
  setCanRedo(redoStackRef.current.length > 0)
}

  useEffect(() => {
  setDraftHydrated(false)

    restoredEditorDraftRef.current = false
restoredDraftCharactersRef.current = false

  const restoreDraft = (parsed) => {
  const restoredMessages =
    Array.isArray(parsed.messages)
      ? parsed.messages
      : []

  const restoredCharacters =
    Array.isArray(parsed.characters)
      ? parsed.characters
          .map((character) =>
            character?.role_group
              ? mapCharacter(character)
              : character
          )
          .filter(
            (character) =>
              character?.id
          )
      : []

  const savedTitle = String(
    parsed.episodeTitle || ''
  ).trim()

  restoredEditorDraftRef.current =
    Boolean(
      restoredMessages.length ||
        restoredCharacters.length ||
        savedTitle ||
        parsed.episodeId
    )

  restoredDraftCharactersRef.current =
    restoredCharacters.length > 0

  messagesRef.current =
    restoredMessages

  setMessages(
    restoredMessages
  )

  if (restoredCharacters.length) {
    setCharacters(
      restoredCharacters
    )
  }

  setEpisodeTitle(
    savedTitle === 'Episode 1' ||
      savedTitle === 'New Episode'
      ? ''
      : savedTitle
  )

  setEpisodeId(
    parsed.episodeId || ''
  )

  setEpisodeLeadCharacterId(
    parsed.leadCharacterId || ''
  )
}

  const snapshotRaw =
    sessionStorage.getItem(
      gallerySnapshotKey
    )

  if (snapshotRaw) {
    try {
      restoreDraft(
        JSON.parse(snapshotRaw)
      )

      sessionStorage.removeItem(
        gallerySnapshotKey
      )

      setDraftHydrated(true)
      return
    } catch {
      sessionStorage.removeItem(
        gallerySnapshotKey
      )
    }
  }

  if (startNewEpisode) {
    localStorage.removeItem(storageKey)

    messagesRef.current = []
    setMessages([])
    setEpisodeTitle('')
    setEpisodeId('')
    setEpisodeLeadCharacterId('')
    setActiveMessageId('')
    setMessageEditMode(null)
    setDraftHydrated(true)
    return
  }

  const saved =
    localStorage.getItem(storageKey)

  if (saved) {
    try {
      restoreDraft(JSON.parse(saved))
    } catch {
      localStorage.removeItem(storageKey)
    }
  }

  setDraftHydrated(true)
}, [
  gallerySnapshotKey,
  startNewEpisode,
  storageKey,
])

  useEffect(() => {
  if (!draftHydrated) return

  const payload = JSON.stringify({
  episodeTitle,
  episodeId,
  leadCharacterId:
    effectiveLeadCharacterId,
  characters,
  messages,
  updatedAt:
    new Date().toISOString(),
})

  localStorage.setItem(
    storageKey,
    payload
  )

  setSavedSeconds(0)
}, [
  characters, 
  draftHydrated,
  effectiveLeadCharacterId,
  episodeId,
  episodeTitle,
  messages,
  storageKey,
])

useEffect(() => {
  const timer = window.setInterval(() => {
    setSavedSeconds((current) => current + 1)
  }, 1000)

  return () => window.clearInterval(timer)
}, [])

  useEffect(() => {
  if (!storyId) return

  const draftKey =
    `shadow_gallery_chat_editor_draft_${storyId}`

  const draftRaw = sessionStorage.getItem(draftKey)

  if (!draftRaw) return

  try {
    const draft = JSON.parse(draftRaw)

    const expired =
      !draft.createdAt ||
      Date.now() - Number(draft.createdAt) >
        30 * 60 * 1000

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

      if (
        String(parsedSelected.storyId || '') ===
          String(storyId) &&
        parsedSelected.origin === 'chat-editor'
      ) {
        selected = parsedSelected
      }
    }

    setNewCharacterName(draft.name || '')
    setNewCharacterGender(draft.gender || '')

    if (selected?.imageUrl) {
      setNewCharacterImage(selected.imageUrl)
      setNewCharacterAvatarSource('shadow_gallery')
      setImageSourceOpen(false)
      setAddPopupOpen(true)
    } else {
      setNewCharacterImage(draft.image || '')
      setNewCharacterAvatarSource(
        draft.avatarSource || 'device'
      )
      setAddPopupOpen(false)
      setImageSourceOpen(true)
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

useEffect(() => {
  async function loadCharacters() {
    const token = getAuthToken()

    if (!token) {
      setLoading(false)
      navigate('/login')
      return
    }

    if (
      requestedEpisodeId &&
      !startNewEpisode
    ) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || getDisplayText('chatStoryEditor.failedLoadCharacters')
        )
      }

      const libraryCharacters =
  (data.characters || []).map(
    mapCharacter
  )

let nextCharacters =
  libraryCharacters

if (
  startNewEpisode ||
  !requestedEpisodeId
) {
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
          : []

    const selectedIdSet =
      new Set(
        candidateIds.map(
          (id) => String(id)
        )
      )

    if (selectedIdSet.size) {
      nextCharacters =
        libraryCharacters.filter(
          (character) =>
            selectedIdSet.has(
              String(character.id)
            )
        )
    }
  } catch {
    sessionStorage.removeItem(
      castStorageKey
    )
  }
}

setCharacters(nextCharacters)
    } catch (error) {
      showToast(
        error.message === 'Failed to fetch'
          ? getDisplayText('chatStoryEditor.cannotConnectBackend')
          : error.message || getDisplayText('chatStoryEditor.failedLoadCharacters')
      )
    } finally {
      setLoading(false)
    }
  }

  if (storyId) {
    loadCharacters()
  } else {
    setLoading(false)
  }
}, [
  castStorageKey,
  navigate,
  requestedEpisodeId,
  startNewEpisode,
  storyId,
])

  useEffect(() => {
    async function loadRequestedEpisode() {
      if (!requestedEpisodeId || startNewEpisode) return

      const token = getAuthToken()
      if (!token) return

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/episodes/${requestedEpisodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('chatStoryEditor.failedLoadEpisode'))
        }

        const parsed = JSON.parse(String(data.episode?.content || ''))
        if (parsed?.format !== 'shadow_chat_story_v1') {
          throw new Error(getDisplayText('chatStoryEditor.notChatStoryEpisode'))
        }

        const parsedCharacters =
          Array.isArray(parsed.characters)
            ? parsed.characters
            : []

        const snapshotCharacters =
          parsedCharacters
            .map(mapCharacter)
            .filter(
              (character) =>
                character?.id
            )

        const savedLeadCharacterId =
          parsed.lead_character_id ||
          parsedCharacters.find(
            (character) =>
              character.is_lead === true
          )?.id ||
          parsedCharacters.find(
            (character) =>
              character.chat_side === 'right'
          )?.id ||
          ''

        const restoredMessages =
          (parsed.messages || []).map(
            (message) => ({
              id:
                message.id || makeId(),
              type:
                message.type === 'chat'
                  ? 'chat'
                  : message.type ===
                      'author_note'
                    ? 'author_note'
                    : message.type ===
                        'image'
                      ? 'image'
                      : 'aside',
              characterId:
                message.character_id ||
                null,
              text:
                message.text || '',
              imageUrl:
                message.image_url ||
                message.imageUrl ||
                '',
              createdAt:
                message.created_at ||
                new Date().toISOString(),
            })
          )

        setEpisodeId(
          data.episode.id
        )

        if (
          !restoredDraftCharactersRef.current
        ) {
          setCharacters(
            snapshotCharacters
          )
        }

        if (
          !restoredEditorDraftRef.current
        ) {
          setEpisodeTitle(
            data.episode.title ||
              parsed.episode_title ||
              getDisplayText('chatStoryEditor.episode')
          )

          setEpisodeLeadCharacterId(
            savedLeadCharacterId
          )

          messagesRef.current =
            restoredMessages

          setMessages(
            restoredMessages
          )
        }
      } catch (error) {
        showToast(
          error.message ||
            getDisplayText('chatStoryEditor.failedLoadEpisode')
        )
      } finally {
        setLoading(false)
      }
    }

    loadRequestedEpisode()
  }, [requestedEpisodeId, startNewEpisode, storyId])

  useEffect(() => {
  if (!shouldScrollToEndRef.current) {
    return
  }

  shouldScrollToEndRef.current = false

  messagesEndRef.current?.scrollIntoView({
    behavior: 'smooth',
  })
}, [messages])
  const toggleCharacter = (characterId) => {
  setSelectedCharacterId((current) =>
    current === characterId ? null : characterId
  )
}
  
  
const insertMessageSymbol = (symbol) => {
  setDraft((current) =>
    `${current}${current && !/\s$/.test(current) ? ' ' : ''}${symbol}`
  )
  setSymbolPanelOpen(false)
  setComposerFocused(true)
  window.setTimeout(() => composerRef.current?.focus(), 50)
}

const openMessageToolbar = (messageId) => {
  if (messageEditMode) {
    showToast(
      getDisplayText('chatStoryEditor.finishCurrentEdit')
    )
    return
  }

  setSymbolPanelOpen(false)

  setActiveMessageId((current) =>
    current === messageId
      ? ''
      : messageId
  )
}

useEffect(() => {
  if (!activeMessageId) {
    return undefined
  }

  const closeMessageToolbar = () => {
    setActiveMessageId('')
  }

  const handleOutsidePointerDown = (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    if (
      target.closest(
        '[data-message-toolbar="true"]'
      )
    ) {
      return
    }

    const messageElement =
      target.closest('[data-message-id]')

    if (
      messageElement?.dataset.messageId ===
      activeMessageId
    ) {
      return
    }

    closeMessageToolbar()
  }

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeMessageToolbar()
    }
  }

  document.addEventListener(
    'pointerdown',
    handleOutsidePointerDown
  )

  window.addEventListener(
    'keydown',
    handleEscapeKey
  )

  return () => {
    document.removeEventListener(
      'pointerdown',
      handleOutsidePointerDown
    )

    window.removeEventListener(
      'keydown',
      handleEscapeKey
    )
  }
}, [activeMessageId])

const cancelMessageEditMode = () => {
  setMessageEditMode(null)
  setActiveMessageId('')
  setDraft('')
  setSymbolPanelOpen(false)
  setComposerFocused(false)
}

const beginInsertMessage = (position) => {
  if (!activeMessage) return

  setMessageEditMode({
    type:
      position === 'above'
        ? 'insert_above'
        : 'insert_below',
    targetId: activeMessage.id,
  })

  setSelectedCharacterId(
    activeMessage.type === 'chat' ||
    activeMessage.type === 'image'
      ? activeMessage.characterId
      : null
  )

  setActiveMessageId('')
  setDraft('')
  setSymbolPanelOpen(false)
  setComposerFocused(true)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}

const beginModifyMessage = () => {
  if (!activeMessage) return

  setMessageEditMode({
    type: 'modify',
    targetId: activeMessage.id,
  })

  setSelectedCharacterId(
    activeMessage.type === 'chat'
      ? activeMessage.characterId
      : null
  )

  setDraft(activeMessage.text || '')
  setActiveMessageId('')
  setSymbolPanelOpen(false)
  setComposerFocused(true)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}

const makeActiveMessageLead = () => {
  if (
    activeMessage?.type !== 'chat' ||
    !activeMessage.characterId
  ) {
    return
  }

  setEpisodeLeadCharacterId(
    activeMessage.characterId
  )

  setActiveMessageId('')

  showToast(
    `${
      activeMessageCharacter?.nickname ||
      'Character'
    } is now Lead Chat.`
  )
}

const moveActiveMessage = (direction) => {
  if (!activeMessage) return

  commitMessages((current) => {
    const authorNote = current.find(
      (message) =>
        message.type === 'author_note'
    )

    const nextStoryMessages =
      current.filter(
        (message) =>
          message.type !== 'author_note'
      )

    const currentIndex =
      nextStoryMessages.findIndex(
        (message) =>
          message.id ===
          activeMessage.id
      )

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >=
        nextStoryMessages.length
    ) {
      return current
    }

    const nextMessages = [
      ...nextStoryMessages,
    ]

    ;[
      nextMessages[currentIndex],
      nextMessages[targetIndex],
    ] = [
      nextMessages[targetIndex],
      nextMessages[currentIndex],
    ]

    return authorNote
      ? [...nextMessages, authorNote]
      : nextMessages
  })
}

const sendMessage = () => {
  const text = draft.trim()
  if (!text) return

  if (
    messageEditMode?.type === 'modify'
  ) {
    commitMessages((current) =>
      current.map((message) =>
        message.id ===
        messageEditMode.targetId
          ? {
              ...message,
              text,
            }
          : message
      )
    )

    setDraft('')
    setMessageEditMode(null)
    setActiveMessageId('')
    setSymbolPanelOpen(false)

    showToast(getDisplayText('chatStoryEditor.messageUpdated'))
    return
  }

  const nextMessage = {
    id: makeId(),
    type: selectedCharacter
      ? 'chat'
      : 'aside',
    characterId:
      selectedCharacter?.id || null,
    text,
    createdAt:
      new Date().toISOString(),
  }

  const inserting =
    messageEditMode?.type ===
      'insert_above' ||
    messageEditMode?.type ===
      'insert_below'

  if (!inserting) {
    shouldScrollToEndRef.current = true
  }

  commitMessages((current) => {
    const authorNote = current.find(
      (message) =>
        message.type === 'author_note'
    )

    const nextStoryMessages =
      current.filter(
        (message) =>
          message.type !== 'author_note'
      )

    if (inserting) {
      const targetIndex =
        nextStoryMessages.findIndex(
          (message) =>
            message.id ===
            messageEditMode.targetId
        )

      const insertIndex =
        targetIndex < 0
          ? nextStoryMessages.length
          : messageEditMode.type ===
              'insert_above'
            ? targetIndex
            : targetIndex + 1

      nextStoryMessages.splice(
        insertIndex,
        0,
        nextMessage
      )
    } else {
      nextStoryMessages.push(nextMessage)
    }

    return authorNote
      ? [...nextStoryMessages, authorNote]
      : nextStoryMessages
  })

  setDraft('')
  setMessageEditMode(null)
  setActiveMessageId('')
  setSymbolPanelOpen(false)
}

const deleteMessage = (messageId) => {
  commitMessages((current) =>
    current.filter(
      (message) =>
        message.id !== messageId
    )
  )

  if (activeMessageId === messageId) {
    setActiveMessageId('')
  }

  if (
    messageEditMode?.targetId ===
    messageId
  ) {
    setMessageEditMode(null)
    setDraft('')
  }
}

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const openAddCharacterPopup = () => {
  setNewCharacterName('')
  setNewCharacterImage('')
  setNewCharacterAvatarSource('device')
  setNewCharacterGender('')
  sessionStorage.removeItem('shadow_gallery_selected_image')
  setAddPopupOpen(false)
  setImageSourceOpen(true)
}

const closeAddCharacterPopup = () => {
  if (addCharacterSaving) return
  setAddPopupOpen(false)
}

const chooseNewCharacterDeviceImage = () => {
  setImageSourceOpen(false)
  characterImageInputRef.current?.click()
}

const openNewCharacterShadowGallery = () => {
  if (!storyId) return

  const origin = 'chat-editor'
  const returnUrl =
    new URL(window.location.href)

  const returnPath =
    returnUrl.pathname +
    returnUrl.search +
    returnUrl.hash

  const editorSnapshot = {
  episodeTitle,
  episodeId,
  leadCharacterId:
    effectiveLeadCharacterId,
  characters,
  messages: messagesRef.current,
  updatedAt:
    new Date().toISOString(),
}

  localStorage.setItem(
    storageKey,
    JSON.stringify(editorSnapshot)
  )

  sessionStorage.setItem(
    gallerySnapshotKey,
    JSON.stringify(editorSnapshot)
  )

  sessionStorage.removeItem(
    'shadow_gallery_selected_image'
  )

  sessionStorage.setItem(
    `shadow_gallery_chat_editor_draft_${storyId}`,
    JSON.stringify({
      origin,
      returnPath,
      name: newCharacterName,
      image: newCharacterImage,
      avatarSource:
        newCharacterAvatarSource,
      gender: newCharacterGender,
      createdAt: Date.now(),
    })
  )

  setImageSourceOpen(false)

  navigate(
    `/author/story/${storyId}/chat/shadow-gallery` +
      `?origin=${encodeURIComponent(origin)}` +
      `&return=${encodeURIComponent(returnPath)}`
  )
}

const handleNewCharacterImageChange = (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) {
  setImageSourceOpen(true)
  return
}

  if (!file.type.startsWith('image/')) {
    showToast(getDisplayText('chatStoryEditor.chooseImageFile'))
    return
  }

  if (file.size > 2 * 1024 * 1024) {
  showToast(getDisplayText('chatStoryEditor.profileImageTooLarge'))
  return
}

  const reader = new FileReader()

  reader.onload = () => {
  setNewCharacterImage(String(reader.result || ''))
  setNewCharacterAvatarSource('device')
  setImageSourceOpen(false)
  setAddPopupOpen(true)
}

  reader.readAsDataURL(file)
}

const pickRandomCharacterAvatar = async (gender) => {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  try {
    setRandomAvatarLoading(true)

    const response = await fetch(
      `${API_BASE_URL}/api/stories/chat/avatar-gallery?limit=200`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('chatStoryEditor.failedLoadCharacterImages'))
    }

    const candidates = (data.images || []).filter((item) => {
      const text = [
        item.category,
        item.title,
        item.alt_text,
        item.gender,
        item.folder,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const isFemale =
        text.includes('female') ||
        text.includes('girl') ||
        text.includes('woman')

      const isMale =
        !isFemale &&
        (text.includes('male') ||
          text.includes('boy') ||
          text.includes('man'))

      return gender === 'female' ? isFemale : isMale
    })

    if (!candidates.length) {
      throw new Error(
        gender === 'female'
          ? getDisplayText('chatStoryEditor.noFemaleImages')
          : getDisplayText('chatStoryEditor.noMaleImages')
      )
    }

    const randomItem =
      candidates[Math.floor(Math.random() * candidates.length)]

    setNewCharacterImage(randomItem.image_url || '')
    setNewCharacterAvatarSource('shadow_gallery')
    setNewCharacterGender(gender)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('chatStoryEditor.cannotConnectBackend')
        : error.message || getDisplayText('chatStoryEditor.failedChooseRandom')
    )
  } finally {
    setRandomAvatarLoading(false)
  }
}

const handleAddConfirm = async () => {
  const cleanName =
    newCharacterName.trim()

  if (!cleanName) {
    showToast(
      getDisplayText('chatStoryEditor.enterCharacterRequired')
    )
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const newCharacterId =
    makeId()

  const newCharacter = {
    id: newCharacterId,
    nickname: cleanName,
    image: newCharacterImage,
    group: 'background',
    avatarSource:
      newCharacterAvatarSource,
    isLead: false,
    chatSide: 'left',
    gender: newCharacterGender,
    birthday: '',
    heightCm: '',
    occupation: '',
    personality: '',
    relationship: '',
    bio: '',
  }

  try {
    setAddCharacterSaving(true)

    const avatarUrl =
      await uploadCharacterImage(
        token,
        newCharacter.image,
        storyId,
        0
      )

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          characters: [
            {
              id:
                newCharacter.id,
              role_group:
                newCharacter.group,
              nickname:
                newCharacter.nickname ||
                null,
              avatar_url:
                avatarUrl,
              avatar_source:
                newCharacter.avatarSource ||
                'device',
              is_lead: false,
              chat_side: 'left',
              gender:
                newCharacter.gender === 'female'
                  ? 'Female'
                  : newCharacter.gender === 'male'
                    ? 'Male'
                    : newCharacter.gender ||
                      null,
              birthday: null,
              height_cm: null,
              occupation: null,
              personality: null,
              relationship: null,
              bio: null,
            },
          ],
        }),
      }
    )

    const data =
      await response
        .json()
        .catch(() => ({}))

    if (
      !response.ok ||
      data.ok === false
    ) {
      throw new Error(
        data.message ||
          getDisplayText('chatStoryEditor.failedAddCharacter')
      )
    }

    const savedCharacterRows =
      (data.characters || [])
        .filter(
          (character) =>
            character.role_group ===
              'background' &&
            String(
              character.nickname || ''
            ) === cleanName &&
            String(
              character.avatar_url || ''
            ) === String(
              avatarUrl || ''
            )
        )
        .sort(
          (first, second) =>
            new Date(
              second.created_at || 0
            ).getTime() -
            new Date(
              first.created_at || 0
            ).getTime()
        )

    const savedCharacterRow =
      savedCharacterRows[0] ||
      null

    const savedCharacter =
      savedCharacterRow
        ? mapCharacter(
            savedCharacterRow
          )
        : null

    if (!savedCharacter) {
      throw new Error(
        getDisplayText('chatStoryEditor.characterSavedMissing')
      )
    }

    setCharacters((current) => {
      const alreadyExists =
        current.some(
          (character) =>
            String(character.id) ===
            String(savedCharacter.id)
        )

      if (alreadyExists) {
        return current.map(
          (character) =>
            String(character.id) ===
            String(savedCharacter.id)
              ? savedCharacter
              : character
        )
      }

      return [
        ...current,
        savedCharacter,
      ]
    })

    if (
      startNewEpisode ||
      !requestedEpisodeId
    ) {
      const nextCharacterIds = [
        ...new Set([
          ...characters.map(
            (character) =>
              String(character.id)
          ),
          String(
            savedCharacter.id
          ),
        ]),
      ]

      sessionStorage.setItem(
        castStorageKey,
        JSON.stringify({
          characterIds:
            nextCharacterIds,
          updatedAt:
            new Date().toISOString(),
        })
      )
    }

    setAddPopupOpen(false)

    setSelectedCharacterId(
      savedCharacter.id
    )

    setComposerMode('message')

    setNewCharacterName('')
    setNewCharacterImage('')

    setNewCharacterAvatarSource(
      'device'
    )

    setNewCharacterGender('')

    showToast(
      getDisplayText('chatStoryEditor.characterAdded')
    )

    window.setTimeout(() => {
      composerRef.current?.focus()
    }, 50)
  } catch (error) {
    showToast(
      error.message ===
        'Failed to fetch'
        ? getDisplayText('chatStoryEditor.cannotConnectBackend')
        : error.message ||
            getDisplayText('chatStoryEditor.failedAddCharacter')
    )
  } finally {
    setAddCharacterSaving(false)
  }
}

  const handleAuthorNote = () => {
    const existingNote = messages.find(
      (message) => message.type === 'author_note'
    )

    setMorePopupOpen(false)
    setAuthorNoteDraft(existingNote?.text || '')
    setAuthorNoteOpen(true)
  }

  const closeAuthorNote = () => {
    setAuthorNoteOpen(false)
    setMorePopupOpen(true)
  }

  const saveAuthorNote = () => {
    const text = authorNoteDraft.trim()
    if (!text) return

    const existingNote = messages.find(
      (message) => message.type === 'author_note'
    )

    const nextNote = {
      id: existingNote?.id || makeId(),
      type: 'author_note',
      characterId: null,
      text,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
    }

    commitMessages((current) => [
      ...current.filter((message) => message.type !== 'author_note'),
      nextNote,
    ])

    setAuthorNoteOpen(false)
    setMorePopupOpen(true)
    showToast(existingNote ? getDisplayText('chatStoryEditor.authorNoteUpdated') : getDisplayText('chatStoryEditor.authorNoteSaved'))
  }

  const clearSelectedAudio = () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    setAudioFile(null)
    setAudioPreviewUrl('')
    setAudioDuration(0)
  }

  const openAudioSheet = () => {
    setMorePopupOpen(false)
    setAudioSheetOpen(true)
  }

  const closeAudioSheet = () => {
    setAudioSheetOpen(false)
    setMorePopupOpen(true)
  }

  const selectAudioFile = (file) => {
    if (!file) return

    const allowedAudio =
      file.type.startsWith('audio/') ||
      /\.(mp3|m4a|aac|wav|webm)$/i.test(file.name)

    if (!allowedAudio) {
      showToast(getDisplayText('chatStoryEditor.chooseAudioTypes'))
      return
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      showToast(getDisplayText('chatStoryEditor.audioTooLarge'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    let finished = false
    let timeoutId = 0

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      audio.removeEventListener('loadedmetadata', readDuration)
      audio.removeEventListener('durationchange', readDuration)
      audio.removeEventListener('canplay', readDuration)
      audio.removeEventListener('error', handleReadError)
      audio.removeAttribute('src')
      audio.load()
    }

    const fail = (message) => {
      if (finished) return
      finished = true
      cleanup()
      URL.revokeObjectURL(objectUrl)
      showToast(message)
    }

    const acceptFile = (durationValue) => {
      if (finished) return
      finished = true
      cleanup()

      if (
        durationValue < MIN_AUDIO_DURATION_SECONDS ||
        durationValue > MAX_AUDIO_DURATION_SECONDS
      ) {
        URL.revokeObjectURL(objectUrl)
        showToast(getDisplayText('chatStoryEditor.audioDuration'))
        return
      }

      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      setAudioFile(file)
      setAudioPreviewUrl(objectUrl)
      setAudioDuration(durationValue)
    }

    function readDuration() {
      const durationValue = Number(audio.duration)

      if (Number.isFinite(durationValue) && durationValue > 0) {
        acceptFile(durationValue)
        return
      }

      if (durationValue === Infinity && audio.seekable?.length) {
        const seekEnd = audio.seekable.end(audio.seekable.length - 1)
        if (Number.isFinite(seekEnd) && seekEnd > 0) {
          acceptFile(seekEnd)
        }
      }
    }

    function handleReadError() {
      fail(getDisplayText('chatStoryEditor.audioUnreadable'))
    }

    audio.preload = 'metadata'
    audio.addEventListener('loadedmetadata', readDuration)
    audio.addEventListener('durationchange', readDuration)
    audio.addEventListener('canplay', readDuration)
    audio.addEventListener('error', handleReadError)
    audio.src = objectUrl
    audio.load()

    timeoutId = window.setTimeout(() => {
      fail(getDisplayText('chatStoryEditor.audioInfoUnreadable'))
    }, 10000)
  }

  const handleAudioChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    selectAudioFile(file)
  }

  const handleImageChange = async (event) => {
  const file =
    event.target.files?.[0]

  event.target.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast(
      getDisplayText('chatStoryEditor.chooseImageFile')
    )
    return
  }

  if (file.size > 8 * 1024 * 1024) {
    showToast(
      getDisplayText('chatStoryEditor.imageTooLarge')
    )
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  try {
    setImageUploading(true)

    const imageUrl =
      await uploadEpisodeImage(
        token,
        file
      )

    const nextMessage = {
      id: makeId(),
      type: 'image',
      characterId:
        selectedCharacter?.id || null,
      text: '',
      imageUrl,
      createdAt:
        new Date().toISOString(),
    }

    const inserting =
      messageEditMode?.type ===
        'insert_above' ||
      messageEditMode?.type ===
        'insert_below'

    if (!inserting) {
      shouldScrollToEndRef.current = true
    }

    commitMessages((current) => {
      const authorNote = current.find(
        (message) =>
          message.type ===
          'author_note'
      )

      const nextStoryMessages =
        current.filter(
          (message) =>
            message.type !==
            'author_note'
        )

      if (inserting) {
        const targetIndex =
          nextStoryMessages.findIndex(
            (message) =>
              message.id ===
              messageEditMode.targetId
          )

        const insertIndex =
          targetIndex < 0
            ? nextStoryMessages.length
            : messageEditMode.type ===
                'insert_above'
              ? targetIndex
              : targetIndex + 1

        nextStoryMessages.splice(
          insertIndex,
          0,
          nextMessage
        )
      } else {
        nextStoryMessages.push(
          nextMessage
        )
      }

      return authorNote
        ? [
            ...nextStoryMessages,
            authorNote,
          ]
        : nextStoryMessages
    })

    setMessageEditMode(null)
    setActiveMessageId('')
    setSymbolPanelOpen(false)

    showToast(getDisplayText('chatStoryEditor.imageAdded'))
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('chatStoryEditor.cannotConnectBackend')
        : error.message ||
            getDisplayText('chatStoryEditor.failedUploadImage')
    )
  } finally {
    setImageUploading(false)
  }
}

  const handleSavePublishSettings = async () => {
  if (!episodeId || settingsSaving) return

  if (
    releaseOption === 'schedule' &&
    (!scheduleDate || !scheduleTime)
  ) {
    showToast(getDisplayText('chatStoryEditor.chooseSchedule'))
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const status =
    releaseOption === 'schedule'
      ? 'scheduled'
      : releaseOption === 'draft'
        ? 'draft'
        : 'published'

  const scheduledAt =
    releaseOption === 'schedule'
      ? new Date(
          `${scheduleDate}T${scheduleTime}:00`
        ).toISOString()
      : null

  try {
    setSettingsSaving(true)

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/chat/episodes/${episodeId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          scheduled_at: scheduledAt,
          is_adult: episodeAdult,
          is_free_published: episodeFree,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message || getDisplayText('chatStoryEditor.failedPublishEpisode')
      )
    }

    setPublishSettingsOpen(false)

    if (releaseOption === 'publish') {
      localStorage.removeItem(storageKey)
    }

    setSuccessOpen(true)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? getDisplayText('chatStoryEditor.cannotConnectBackend')
        : error.message || getDisplayText('chatStoryEditor.failedPublishEpisode')
    )
  } finally {
    setSettingsSaving(false)
  }
}

  const saveAndContinue = async () => {
    const cleanTitle = episodeTitle.trim()

    if (!cleanTitle) {
      showToast(getDisplayText('chatStoryEditor.enterEpisodeTitleRequired'))
      return
    }

    if (!messages.some((message) => message.type !== 'author_note')) {
  showToast(getDisplayText('chatStoryEditor.addOneMessage'))
  return
}

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/episodes/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            episode_id: startNewEpisode
  ? null
  : episodeId ||
    requestedEpisodeId ||
    null,
            title: cleanTitle,
            lead_character_id:
              effectiveLeadCharacterId ||
              null,
            character_ids: characters.map(
              (character) => character.id
            ),
            messages: messages.map((message) => ({
              id: message.id,
              type: message.type,
              character_id:
                message.characterId || null,
              text:
                message.text || '',
              image_url:
                message.type === 'image'
                  ? message.imageUrl ||
                    message.image_url ||
                    null
                  : null,
              created_at:
                message.createdAt || null,
            })),
            is_locked: true,
          }),
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('chatStoryEditor.failedSaveEpisode'))
      }

      const savedEpisode = data.episode || {}
      const savedEpisodeId = savedEpisode.id

      if (!savedEpisodeId) {
        throw new Error(getDisplayText('chatStoryEditor.episodeSavedMissingId'))
      }

      setEpisodeId(savedEpisodeId)
setPublishedIsFirstEpisode(
  Boolean(data.is_first_episode)
)

      if (
  startNewEpisode ||
  (
    !episodeId &&
    !requestedEpisodeId
  )
) {
  sessionStorage.removeItem(
    castStorageKey
  )
}
      
setPublishedEpisodeNumber(
  Number(
    savedEpisode.episode_number || 0
  ) || null
)

const savedDraftKey =
  `chat_story_editor_draft_${storyId || 'unknown'}_episode_${savedEpisodeId}`

localStorage.setItem(
  savedDraftKey,
  JSON.stringify({
    episodeTitle: cleanTitle,
    episodeId: savedEpisodeId,
    leadCharacterId:
      effectiveLeadCharacterId,
    characters,
    messages,
    updatedAt:
      new Date().toISOString(),
  })
)

if (startNewEpisode) {
  localStorage.removeItem(storageKey)

  const params = new URLSearchParams({
    episodeId: savedEpisodeId,
    returnTo,
  })

  navigate(
    `/author/story/${storyId}/chat/editor?${params.toString()}`,
    { replace: true }
  )
}

setPublishSettingsOpen(true)
    } catch (error) {
      showToast(
        error.message === 'Failed to fetch'
          ? getDisplayText('chatStoryEditor.cannotConnectBackend')
          : error.message || getDisplayText('chatStoryEditor.failedSaveEpisode')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
  <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-[170px]">
    <ChatStoryEditorGuide
      open={guideOpen}
      onClose={() => setGuideOpen(false)}
      steps={[
        {
          id: 'title',
          selector: '[data-guide="episode-title"]',
          title: getDisplayText('chatStoryEditor.episodeTitle'),
          description: getDisplayText('chatStoryEditor.episodeTitleHelp'),
        },
        {
          id: 'speaker',
          selector: '[data-guide="character-picker"]',
          title: getDisplayText('chatStoryEditor.chooseSpeaker'),
          description: getDisplayText('chatStoryEditor.chooseSpeakerHelp'),
        },
        {
          id: 'add-character',
          selector: '[data-guide="add-character"]',
          title: getDisplayText('chatStoryEditor.addCharacter'),
          description: getDisplayText('chatStoryEditor.addCharacterHelp'),
        },
        {
          id: 'message',
          selector: '[data-guide="message-composer"]',
          title: getDisplayText('chatStoryEditor.writeMessage'),
          description: getDisplayText('chatStoryEditor.writeMessageHelp'),
        },
        {
          id: 'more',
          selector: '[data-guide="more-menu"]',
          title: getDisplayText('chatStoryEditor.moreTools'),
          description: getDisplayText('chatStoryEditor.moreToolsHelp'),
        },
        {
          id: 'publish',
          selector: '[data-guide="next-publish"]',
          title: getDisplayText('chatStoryEditor.saveAndPublish'),
          description: getDisplayText('chatStoryEditor.savePublishHelp'),
        },
      ]}
    />
      <PublishSettingsSheet
        open={publishSettingsOpen}
        episodeTitle={episodeTitle}
        showStorySettings={false}
        genreOptions={[]}
        storyLanguage=""
        onStoryLanguageChange={() => {}}
        mainGenre=""
        onMainGenreChange={() => {}}
        storyTags={[]}
        onStoryTagsChange={() => {}}
        updateDays={[]}
        onToggleUpdateDay={() => {}}
        storyStatus="ongoing"
        onStoryStatusChange={() => {}}
        storyAdult={false}
        onStoryAdultChange={() => {}}
        episodeAdult={episodeAdult}
        onEpisodeAdultChange={setEpisodeAdult}
        episodeFree={episodeFree}
        onEpisodeFreeChange={setEpisodeFree}
        releaseOption={releaseOption}
        onReleaseOptionChange={setReleaseOption}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        scheduleTime={scheduleTime}
        onScheduleTimeChange={setScheduleTime}
        saving={settingsSaving}
        onClose={() => setPublishSettingsOpen(false)}
        onSave={handleSavePublishSettings}
        isChatStory
      />

      <SuccessModal
        open={successOpen}
        isManga={false}
        isChatStory
        isFirstEpisode={publishedIsFirstEpisode}
        releaseOption={releaseOption}
        episodeNumber={publishedEpisodeNumber}
        episodeTitle={episodeTitle}
        onStoryManager={() => {
          setSuccessOpen(false)
          navigate('/author/stories', { replace: true })

          window.setTimeout(() => {
            navigate(`/author/story/${storyId}/manage`)
          }, 0)
        }}
        onAddEpisode={() => {
  setSuccessOpen(false)
  localStorage.removeItem(storageKey)

  const params = new URLSearchParams({
    new: '1',
    returnTo,
  })

  navigate(
    `/author/story/${storyId}/chat/characters?${params.toString()}`,
    { replace: true }
  )
}}
      />

      <input
        ref={audioInputRef}
        type="file"
        accept={AUDIO_ACCEPT}
        onChange={handleAudioChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      <input
  ref={characterImageInputRef}
  type="file"
  accept="image/*"
  onChange={handleNewCharacterImageChange}
  className="hidden"
/>
      <ImageSourceSheet
  open={imageSourceOpen}
  onClose={() => setImageSourceOpen(false)}
  onDevice={chooseNewCharacterDeviceImage}
  onShadowGallery={openNewCharacterShadowGallery}
/>

      <AddCharacterPopup
  open={addPopupOpen}
  name={newCharacterName}
  image={newCharacterImage}
  saving={addCharacterSaving}
  randomLoading={randomAvatarLoading}
  onNameChange={setNewCharacterName}
  onChooseImage={() => {
  setAddPopupOpen(false)
  setImageSourceOpen(true)
}}
  onRandomMale={() => pickRandomCharacterAvatar('male')}
  onRandomFemale={() => pickRandomCharacterAvatar('female')}
  onClose={closeAddCharacterPopup}
  onConfirm={handleAddConfirm}
/>

      <CharacterQuickPopup
  character={profilePopupCharacter}
  onClose={() => setProfilePopupCharacter(null)}
  onConfirm={() => {
    if (!profilePopupCharacter) return

    setSelectedCharacterId(profilePopupCharacter.id)
    setComposerMode('message')
    setProfilePopupCharacter(null)
    setSymbolPanelOpen(false)

    window.setTimeout(() => {
      composerRef.current?.focus()
    }, 50)
  }}
  onEditProfile={() => {
  if (!profilePopupCharacter) return

  const characterId =
    profilePopupCharacter.id

  const returnPath =
    window.location.pathname +
    window.location.search +
    window.location.hash

  const profilePath =
    `/author/story/${storyId}/chat/characters/${characterId}/profile`

  setProfilePopupCharacter(null)

  navigate(
    `${profilePath}?returnTo=${encodeURIComponent(returnPath)}`
  )
}}
/>

      <MorePopup
        open={morePopupOpen}
        onClose={() => setMorePopupOpen(false)}
        onUploadAudio={openAudioSheet}
        onAuthorNote={handleAuthorNote}
        hasAuthorNote={messages.some(
          (message) => message.type === 'author_note'
        )}
      />

      <AuthorNoteSheet
        open={authorNoteOpen}
        value={authorNoteDraft}
        onChange={setAuthorNoteDraft}
        onClose={closeAuthorNote}
        onSave={saveAuthorNote}
      />

      <AudioUploadSheet
        open={audioSheetOpen}
        file={audioFile}
        previewUrl={audioPreviewUrl}
        duration={audioDuration}
        onChoose={() => audioInputRef.current?.click()}
        onDropFile={selectAudioFile}
        onClose={closeAudioSheet}
        onClear={clearSelectedAudio}
      />

      {titlePopupOpen ? (
  <div
    className="fixed inset-0 z-[250] flex items-center justify-center bg-black/55 px-4"
    onClick={() => setTitlePopupOpen(false)}
  >
    <section
      className="w-full max-w-[390px] rounded-[24px] bg-[var(--shadow-bg-surface)] px-5 pb-5 pt-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <h2 className="text-center text-[19px] font-bold text-[#7c3aed]">
        {getDisplayText('chatStoryEditor.enterEpisodeTitle')}
      </h2>

      <input
        autoFocus
        value={titleDraft}
        onChange={(event) => setTitleDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && titleDraft.trim()) {
            event.preventDefault()
            saveEpisodeTitle()
          }
        }}
        maxLength={80}
        placeholder={getDisplayText('chatStoryEditor.enterEpisodeTitle')}
        className="mt-6 h-14 w-full rounded-[6px] bg-[var(--shadow-bg-soft)] px-4 text-center text-[17px] font-medium text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] focus:ring-2 focus:ring-[#9362ef]/30"
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTitlePopupOpen(false)}
          className="h-12 text-[15px] font-bold text-[var(--shadow-text-primary)]"
        >
          {getDisplayText('chatStoryEditor.cancel')}
        </button>

        <button
          type="button"
          onClick={saveEpisodeTitle}
          disabled={!titleDraft.trim()}
          className="h-12 rounded-[8px] bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[15px] font-bold text-white disabled:bg-none disabled:bg-[var(--shadow-bg-soft)] disabled:text-[#d8cce6]"
        >
          {getDisplayText('chatStoryEditor.ok')}
        </button>
      </div>
    </section>
  </div>
) : null}
      
      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[78px] z-[300] mx-auto max-w-[320px] rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-center text-[12px] font-medium text-[var(--shadow-text-secondary)] shadow-[0_8px_28px_rgba(15,23,42,0.18)] ring-1 ring-[var(--shadow-border)]"
        >
          {toast}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-2 backdrop-blur">
  <div className="mx-auto flex max-w-5xl items-center gap-2">
    <button
      type="button"
      onClick={() => {
  const params = new URLSearchParams({ returnTo })
  if (startNewEpisode) params.set('new', '1')
  navigate(`/author/story/${storyId}/chat/characters?${params.toString()}`, {
    replace: true,
  })
}}
      className="flex h-10 w-7 shrink-0 items-center justify-start text-[var(--shadow-text-primary)] active:scale-95"
      aria-label={getDisplayText('chatStoryEditor.goBack')}
    >
      <i className="fa-solid fa-chevron-left text-[14px]" />
    </button>

    <div className="min-w-0 flex-1">
      <button
  type="button"
  data-guide="episode-title"
  onClick={openTitlePopup}
  className="flex max-w-full items-center gap-1.5 text-left active:opacity-70"
>
  <span className="max-w-[180px] truncate text-[15px] font-bold text-[var(--shadow-text-primary)]">
    {episodeTitle.trim() || getDisplayText('chatStoryEditor.enterEpisodeTitle')}
  </span>

  <span className="shrink-0 text-[var(--shadow-text-tertiary)]">
  <ToolbarIcon name="modify" className="h-[13px] w-[13px]" />
</span>
</button>

      <div className="mt-0.5 truncate text-[8.5px] font-medium text-[var(--shadow-text-tertiary)]">
        {getDisplayText(messages.length === 1 ? 'chatStoryEditor.messageCount' : 'chatStoryEditor.messagesCount', { count: formatDisplayNumber(messages.length) })} ·{' '}
        {getDisplayText(wordCount === 1 ? 'chatStoryEditor.wordCount' : 'chatStoryEditor.wordsCount', { count: formatDisplayNumber(wordCount) })} |{' '}
        {getDisplayText('chatStoryEditor.savedIn', { time: savedSeconds < 60 ? `${formatDisplayNumber(savedSeconds)}s` : `${formatDisplayNumber(Math.floor(savedSeconds / 60))}m` })}
      </div>
    </div>

    <button
  type="button"
  onClick={saveAndContinue}
  data-guide="next-publish"
      disabled={
  saving ||
  loading ||
  imageUploading ||
  !messages.some(
    (message) =>
      message.type !== 'author_note'
  )
}
      className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? getDisplayText('chatStoryEditor.saving') : getDisplayText('chatStoryEditor.next')}
    </button>
  </div>
</header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="hidden rounded-[20px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)] sm:block">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title={getDisplayText('chatStoryEditor.storyInfo')} done />
            <Step number="2" title={getDisplayText('chatStoryEditor.characters')} done />
            <Step number="3" title={getDisplayText('chatStoryEditor.chat')} active />
            <Step number="4" title={getDisplayText('chatStoryEditor.publish')} />
          </div>
        </section>

        <section className="mt-4 min-h-[calc(100vh-330px)] bg-[var(--shadow-bg-surface)] p-4">
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <i className="fa-solid fa-spinner fa-spin text-[24px] text-[#7c3aed]" />
              <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {getDisplayText('chatStoryEditor.loadingCharacters')}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
                <i className="fa-regular fa-comments text-[25px]" />
              </span>
              <h2 className="mt-4 text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
                {getDisplayText('chatStoryEditor.startConversation')}
              </h2>
              <p className="mt-2 max-w-[310px] text-[11.5px] leading-5 text-[var(--shadow-text-secondary)]">
                {getDisplayText('chatStoryEditor.startConversationHelp')}
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message) =>
  message.type === 'author_note' ? (
    <AuthorNoteMessage
      key={message.id}
      message={message}
      onDelete={deleteMessage}
    />
  ) : message.type === 'image' ? (
    <EditorImageMessage
      key={message.id}
      message={message}
      character={
        message.characterId
          ? characterMap[
              message.characterId
            ]
          : null
      }
      right={
        Boolean(
          message.characterId
        ) &&
        message.characterId ===
          effectiveLeadCharacterId
      }
      active={
        activeMessageId ===
        message.id
      }
      onEdit={
        openMessageToolbar
      }
      onElementRef={
        registerMessageElement
      }
    />
  ) : message.type === 'aside' ? (
    <AsideMessage
  key={message.id}
  message={message}
  active={
    activeMessageId === message.id
  }
  onEdit={openMessageToolbar}
  onElementRef={registerMessageElement}
/>
  ) : (
    <ChatMessage
  key={message.id}
  message={message}
  character={
    characterMap[
      message.characterId
    ]
  }
  right={
    message.characterId ===
    effectiveLeadCharacterId
  }
  active={
    activeMessageId === message.id
  }
  onEdit={openMessageToolbar}
  onElementRef={registerMessageElement}
/>
  )
)}
              <div ref={messagesEndRef} />
            </div>
          )}
        </section>
      </main>

<MessageEditToolbar
  message={activeMessage}
  position={messageToolbarPosition}
  isLead={activeMessageIsLead}
  canMoveUp={canMoveActiveMessageUp}
  canMoveDown={canMoveActiveMessageDown}
  onAbove={() =>
    beginInsertMessage('above')
  }
  onBelow={() =>
    beginInsertMessage('below')
  }
  onModify={beginModifyMessage}
  onMakeLead={makeActiveMessageLead}
  onMoveUp={() =>
    moveActiveMessage('up')
  }
  onMoveDown={() =>
    moveActiveMessage('down')
  }
  onDelete={() => {
    if (activeMessage?.id) {
      deleteMessage(activeMessage.id)
    }
  }}
/>

      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pb-[calc(8px+env(safe-area-inset-bottom))]">
  <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[var(--shadow-bg-surface)] to-transparent" />
        <div className="mx-auto max-w-5xl">
  {messageEditMode ? (
    <div className="flex items-center justify-between border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-2">
      <span className="text-[10.5px] font-medium text-[var(--shadow-text-secondary)]">
        {messageEditMode.type ===
        'modify'
          ? getDisplayText('chatStoryEditor.modifyMessage')
          : messageEditMode.type ===
              'insert_above'
            ? getDisplayText('chatStoryEditor.insertAbove')
            : getDisplayText('chatStoryEditor.insertBelow')}
      </span>

      <button
        type="button"
        onClick={cancelMessageEditMode}
        className="text-[10.5px] font-bold text-[#7c3aed]"
      >
        {getDisplayText('chatStoryEditor.cancel')}
      </button>
    </div>
  ) : null}

          <div className="grid grid-cols-[minmax(0,1fr)_40px_40px] items-start gap-x-0 pl-4 pr-2 pb-1 pt-2">
  <div data-guide="character-picker" className="relative min-w-0">
  <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div className="flex w-max gap-1.5 py-0.5">
      <AsideAvatar
        active={!selectedCharacterId}
        onClick={() => {
          setSelectedCharacterId(null)
          setComposerMode('message')
        }}
      />

      {characters.map((character) => (
        <CharacterAvatar
  key={character.id}
  character={character}
  selected={selectedCharacterId === character.id}
  onClick={() => {
  if (
    messageEditMode?.type ===
      'insert_above' ||
    messageEditMode?.type ===
      'insert_below'
  ) {
    setSelectedCharacterId(
      character.id
    )
  } else {
    toggleCharacter(character.id)
  }

  setComposerMode('message')
  setSymbolPanelOpen(false)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}}
/>
      ))}
    </div>
  </div>

  <div className="pointer-events-none absolute inset-y-0 -right-1.5 z-10 w-6 bg-gradient-to-r from-transparent via-[var(--shadow-bg-surface)] to-[var(--shadow-bg-surface)]" />
</div>

  <button
    type="button"
    onClick={openAddCharacterPopup}
    data-guide="add-character"
    className="relative z-20 w-10 py-0.5 text-center active:scale-[0.97]"
  >
    <span className="relative mx-auto flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)]">
  <i className="fa-regular fa-user text-[16px]" />
  <i className="fa-solid fa-plus absolute right-[3px] top-[3px] text-[7px]" />
</span>
    <span className="mt-1 block text-[8px] font-bold text-[var(--shadow-text-secondary)]">
      {getDisplayText('chatStoryEditor.addCharacter')}
    </span>
  </button>

  <button
    type="button"
    onClick={() => setMorePopupOpen(true)}
    data-guide="more-menu"
    className="w-10 text-center active:scale-[0.97]"
  >
    <span className="mx-auto flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)]">
  <i className="fa-solid fa-chevron-down text-[16px]" />
</span>
    <span className="mt-1 block text-[8px] font-bold text-[var(--shadow-text-secondary)]">
      {getDisplayText('chatStoryEditor.more')}
    </span>
  </button>
</div>

<div className="grid grid-cols-[minmax(0,1fr)_40px_40px] items-center gap-x-0 pl-4 pr-2">
  <div
  data-guide="message-composer"
  className="relative flex min-h-11 min-w-0 flex-1 items-center rounded-[10px] bg-[var(--shadow-bg-soft)] px-3 py-2 pr-12"
>
    <textarea
      ref={composerRef}
      value={draft}
      onFocus={() => setComposerFocused(true)}
      onBlur={() => {
        if (!draft.trim()) setComposerFocused(false)
      }}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={handleComposerKeyDown}
      rows={1}
      maxLength={2000}
      placeholder={
  messageEditMode?.type === 'modify'
    ? getDisplayText('chatStoryEditor.modifyMessagePrefix')
    : selectedCharacter
      ? `${selectedCharacter.nickname || getDisplayText('chatStoryEditor.character')}:`
      : getDisplayText('chatStoryEditor.asidePrefix')
}
      className="max-h-[96px] min-h-[20px] w-full resize-none overflow-y-hidden bg-transparent py-0 text-[12.5px] leading-5 text-[var(--shadow-text-primary)] outline-none placeholder:font-medium placeholder:text-[var(--shadow-text-secondary)]"
    />

    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setSymbolPanelOpen((current) => !current)}
      className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[7px] text-[12px] font-medium text-[var(--shadow-text-primary)] active:scale-95 ${
        symbolPanelOpen ? 'bg-[var(--shadow-bg-elevated)]' : 'bg-[var(--shadow-bg-hover)]'
      }`}
      aria-label={getDisplayText('chatStoryEditor.messageSymbols')}
      aria-pressed={symbolPanelOpen}
    >
      「」
    </button>
  </div>

  <button
  type="button"
  onClick={() => window.alert(getDisplayText('chatStoryEditor.comingSoon'))}
  className="flex h-11 w-10 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95"
  aria-label={getDisplayText('chatStoryEditor.emojiComingSoon')}
>
  <i className="fa-regular fa-face-smile text-[20px]" />
</button>

  {composerFocused || draft.trim() ? (
    <button
  type="button"
  onMouseDown={(event) => event.preventDefault()}
  onClick={sendMessage}
  disabled={!draft.trim()}
  className={`flex h-11 w-10 items-center justify-center transition active:scale-95 ${
    draft.trim() ? 'text-[#7c3aed]' : 'text-[var(--shadow-text-disabled)]'
  }`}
  aria-label={getDisplayText('chatStoryEditor.sendMessage')}
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
</button>
  ) : (
    <button
  type="button"
  onClick={() => {
    setSymbolPanelOpen(false)
    imageInputRef.current?.click()
  }}
  disabled={imageUploading}
  className="flex h-11 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95 disabled:opacity-50"
  aria-label={getDisplayText('chatStoryEditor.addImage')}
>
  <i
    className={`fa-solid ${
      imageUploading
        ? 'fa-spinner fa-spin'
        : 'fa-image'
    } text-[20px]`}
  />
</button>
  )}
</div>

          {symbolPanelOpen ? (
  <div className="flex w-full gap-1 px-2 pb-1 pt-2">
    {MESSAGE_SYMBOLS.map((symbol) => (
      <button
        key={symbol}
        type="button"
        onClick={() => insertMessageSymbol(symbol)}
        className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[var(--shadow-bg-soft)] text-[12px] font-normal text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-hover)]"
      >
        {symbol}
      </button>
    ))}
  </div>
) : null}
        </div>
      </div>
    </div>
  )
}
