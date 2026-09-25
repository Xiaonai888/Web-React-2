import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { describeReaderLoadFailure } from '../utils/readerLoadDiagnosis'
import CommentsModal from '../components/story-detail/CommentsModal'
import EchoShareSheetV2Connected from '../components/social/EchoShareSheetV2Connected'
import EchoV2Count from '../components/social/EchoV2Count'
import ReactionAction from '../components/social/reactions/ReactionAction'
import { getReactionMeta } from '../components/social/reactions/reactionConfig'
import AdvertisementPopup from '../components/AdvertisementPopup'
import GiftPopup from '../components/reader/GiftPopup'
import OfflineDownloadMenuItem from '../components/reader/OfflineDownloadMenuItem'
import { loadOfflineReaderFallback } from '../utils/offlineReaderFallback'
import { rememberViewedEpisode } from '../utils/offlineViewedEpisode'
import ChatStoryReader from '../components/chat-story/ChatStoryReader'
import ChatStoryEpisodeListDrawer from '../components/chat-story/ChatStoryEpisodeListDrawer'
import StoryTranslateButton from '../components/reader/StoryTranslateButton'
import useReadingProgressSync from '../hooks/useReadingProgressSync'
import useContinuousEpisodeReader from '../hooks/useContinuousEpisodeReader'
import { loadReaderEpisodeCache, saveReaderEpisodeCache } from '../utils/readerEpisodeCache'
import useEpisodeTranslation from '../hooks/useEpisodeTranslation'
import ReportModal from '../components/ReportModal'
import RichEpisodeContent, {
  episodeContentToPlainText,
} from '../components/reader/RichEpisodeContent'
import { trackSectionQualifiedRead } from '../services/storySectionRankTracking'
import GoogleAdBanner from '../components/ads/GoogleAdBanner'
import {
  isRewardedEpisodeUnlockReady,
  runRewardedEpisodeUnlock,
} from '../services/rewardedAds'

registerTranslationNamespace('readerPage', {
  "en": {
    "toBeContinued": "to be continued",
    "pageOf": "Page {{current}} / {{total}}",
    "youtubeVideo": "YouTube Video",
    "openVideo": "Open {{title}}",
    "hideVideo": "Hide {{title}}",
    "watchOnYouTube": "Watch on YouTube",
    "noMangaPages": "No manga pages found.",
    "mangaEpisode": "Manga episode",
    "mangaPageAlt": "{{title}} — Page {{page}}",
    "mangaPagePartAlt": "{{title}} — Page {{page}}, Part {{part}}",
    "like": "Like",
    "gift": "Gift",
    "hotComments": "Hot comments",
    "viewComment_one": "View {{count}} comment",
    "viewComment_other": "View {{count}} comments",
    "writeComment": "Write a comment",
    "reader": "Reader",
    "reactionUpdateFailed": "Failed to update reaction",
    "reactionFailed": "Episode reaction failed",
    "oneEpisode": "1 Episode",
    "nextEpisodes": "Next {{count}} Eps",
    "premium": "Premium",
    "premiumDiscount": "Enjoy 10% off every episode you unlock.",
    "unlockThisEpisode": "to unlock this Ep.",
    "unlockEpisodes": "to unlock {{count}} Eps.",
    "unlockAllEpisodes": "to unlock all Eps.",
    "discountOff": "{{count}}% OFF",
    "comingSoon": "Coming soon",
    "topUpBonus": "FIRST TOP-UP $10+ BONUS!",
    "topUpBonusDetail": "1 Free Book Pass + 3 reading vouchers",
    "instantAccess": "Instant Access",
    "freeAccess": "Free Access",
    "myDiamonds": "My Diamonds:",
    "autoUnlockInfo": "Auto unlock info",
    "autoUnlockHelp": "Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.",
    "autoUnlock": "Auto unlock",
    "unlocking": "Unlocking...",
    "freeUnlockWait": "Free unlocks are available 7 days after release.",
    "coinsRemaining": "Coins — {{count}} remaining",
    "coinsUnavailable": "Coins — Unable to load",
    "accessDays": "Access lasts {{count}} days.",
    "availableLater": "Available later",
    "access": "Access",
    "notEnough": "Not enough",
    "vouchersRemaining": "Vouchers — {{count}} remaining",
    "vouchersUnavailable": "Vouchers — Unable to load",
    "permanentUnlockEpisode": "Permanent unlock for this episode.",
    "moreFreeMethods": "More free methods",
    "watchAdUnlock": "Watch Ad to Unlock Episode",
    "adUsage": "Unlock this episode • {{used}}/{{limit}} used today",
    "limitReached": "Limit reached",
    "watch": "Watch",
    "storyCardComing": "Story Card — Coming soon",
    "sameStoryPermanent": "Permanent unlock for same story only.",
    "coinsVouchers": "Coins & Vouchers",
    "dontMissOut": "Don’t Miss Out",
    "diamondsAwait": "Diamonds Await!",
    "continueReading": "Continue reading?",
    "subscribeFollow": "Subscribe to follow new episodes",
    "subscribe": "Subscribe",
    "subscribed": "Subscribed",
    "newEpisodesFirst": "You will see new episodes first",
    "showSubscribePopup": "Show subscribe popup",
    "closeSubscribePopup": "Close subscribe popup",
    "subscribeStory": "Subscribe to this story",
    "prev": "Prev",
    "next": "Next",
    "episode": "Episode",
    "comments": "Comments",
    "settings": "Settings",
    "progress": "Progress",
    "adultWarningTitle": "18+ Content Warning",
    "adultWarningText": "This episode may contain mature themes, including violence, strong language, sexual or suggestive content, or other sensitive material. Please continue at your own discretion.",
    "continueReadingButton": "Continue Reading",
    "goBack": "Go Back",
    "untitledStory": "Untitled Story",
    "completed": "Completed",
    "new": "New",
    "ongoing": "Ongoing",
    "byAuthor": "by {{author}}",
    "episodesStatus": "{{count}} Episodes, {{status}}",
    "closeEpisodeList": "Close episode list",
    "reverseEpisodeOrder": "Reverse episode order",
    "reverse": "Reverse",
    "episodeNumber": "Episode {{number}}",
    "closeFontList": "Close font list",
    "searchFont": "Search Font",
    "khmerFonts": "Khmer Fonts",
    "otherFonts": "Other Fonts",
    "noFonts": "No fonts found",
    "cancelReset": "Cancel reset",
    "resetTitle": "Reset reading settings?",
    "resetDescription": "This will restore font size, font style, page color, brightness, line spacing, and auto scroll to default.",
    "cancel": "Cancel",
    "reset": "Reset",
    "readingPreferences": "Reading Preferences",
    "manualTap": "Manual Tap",
    "autoTap": "Auto Tap",
    "autoTapSpeed": "Auto Tap Speed",
    "autoTapHelp": "Shows one message at a time automatically",
    "manualTapHelp": "Tap the reading area to show one message at a time.",
    "slow": "Slow",
    "fast": "Fast",
    "verySlow": "Very slow",
    "normal": "Normal",
    "veryFast": "Very fast",
    "moreSetting": "More Setting",
    "backReaderSettings": "Back to reader settings",
    "closeReaderSettings": "Close reader settings",
    "paging": "Paging",
    "scrolling": "Scrolling",
    "autoScroll": "Auto Scroll",
    "scrollingOnly": "Available only in Scrolling mode",
    "turnOff": "Turn Off",
    "turnOn": "Turn On",
    "resetSettings": "Reset Settings",
    "brightness": "Brightness",
    "fontSpacing": "Font & Spacing",
    "fontSize": "Font Size",
    "decreaseFontSize": "Decrease font size",
    "increaseFontSize": "Increase font size",
    "lineSpacing": "Line Spacing",
    "decreaseLineSpacing": "Decrease line spacing",
    "increaseLineSpacing": "Increase line spacing",
    "pageColor": "Page Color",
    "fontStyle": "Font Style",
    "white": "White",
    "paper": "Paper",
    "sepia": "Sepia",
    "dark": "Dark",
    "openTaskCenter": "Open Task Center",
    "adultConfirmRequired": "Confirm the adult-content warning to continue.",
    "adRequired": "Advertisement required before this episode.",
    "untitledEpisode": "Untitled Episode",
    "backToStory": "Back to story",
    "readerSettings": "Reader settings",
    "episodeList": "Episode list",
    "moreOptions": "More options",
    "report": "Report",
    "copyLink": "Copy link",
    "echo": "Echo",
    "pauseAutoScroll": "Pause Auto Scroll",
    "copyThisLink": "Copy this link:",
    "episodeListNotFound": "Episode list not found",
    "episodeNotFound": "Episode not found",
    "cannotConnectServer": "Cannot connect to server. Please try again later.",
    "unlockStatusFailed": "Failed to check unlock status",
    "notEnoughCoins": "Not enough Coins.",
    "cannotConnectBackend": "Cannot connect to backend.",
    "notEnoughVouchers": "Not enough Vouchers.",
    "rewardedUnavailable": "Rewarded ad is unavailable right now.",
    "unlockFailed": "Failed to unlock episode",
    "unlockCoinsFailed": "Failed to unlock episode with Coins",
    "unlockVouchersFailed": "Failed to unlock episode with Vouchers",
    "readMinutes": "Read {{count}} minutes",
    "daysHours": "{{days}} days {{hours}} hours",
    "hoursMinutes": "{{hours}} hours {{minutes}} minutes",
    "minutes": "{{minutes}} minutes",
    "failedLoadEpisode": "Failed to load episode",
    "invalidReadingLink": "Invalid reading link. Please open the episode from its story page.",
    "offlineAccessExpired": "Offline access to this episode has expired. Connect to the internet to renew access.",
    "adClosedIncomplete": "Ad closed before completion. This episode is still locked."
  },
  "km": {
    "toBeContinued": "នៅមានបន្ត",
    "pageOf": "ទំព័រ {{current}} / {{total}}",
    "youtubeVideo": "វីដេអូ YouTube",
    "openVideo": "បើក {{title}}",
    "hideVideo": "បិទ {{title}}",
    "watchOnYouTube": "មើលនៅលើ YouTube",
    "noMangaPages": "រកមិនឃើញទំព័រ Manga។",
    "mangaEpisode": "ភាគ Manga",
    "mangaPageAlt": "{{title}} — ទំព័រ {{page}}",
    "mangaPagePartAlt": "{{title}} — ទំព័រ {{page}}, ផ្នែក {{part}}",
    "like": "ចូលចិត្ត",
    "gift": "អំណោយ",
    "hotComments": "មតិកំពុងពេញនិយម",
    "viewComment_one": "មើលមតិ {{count}}",
    "viewComment_other": "មើលមតិ {{count}}",
    "writeComment": "សរសេរមតិ",
    "reader": "អ្នកអាន",
    "reactionUpdateFailed": "មិនអាច Update Reaction បាន",
    "reactionFailed": "Reaction ភាគនេះបរាជ័យ",
    "oneEpisode": "1 ភាគ",
    "nextEpisodes": "{{count}} ភាគបន្ទាប់",
    "premium": "Premium",
    "premiumDiscount": "ទទួលបានបញ្ចុះតម្លៃ 10% រាល់ភាគដែលអ្នកដោះសោ។",
    "unlockThisEpisode": "ដើម្បីដោះសោភាគនេះ",
    "unlockEpisodes": "ដើម្បីដោះសោ {{count}} ភាគ",
    "unlockAllEpisodes": "ដើម្បីដោះសោភាគទាំងអស់",
    "discountOff": "បញ្ចុះ {{count}}%",
    "comingSoon": "នឹងមកដល់ឆាប់ៗ",
    "topUpBonus": "បញ្ចូលលុយ $10+ លើកដំបូង ទទួល BONUS!",
    "topUpBonusDetail": "Book Pass ឥតគិតថ្លៃ 1 + Reading Voucher 3",
    "instantAccess": "ដោះសោភ្លាមៗ",
    "freeAccess": "ដោះសោឥតគិតថ្លៃ",
    "myDiamonds": "Diamonds របស់ខ្ញុំ៖",
    "autoUnlockInfo": "ព័ត៌មាន Auto Unlock",
    "autoUnlockHelp": "Auto Unlock ប្រើតែ Diamonds ប៉ុណ្ណោះ។ Coins, Vouchers ឬ Story Cards មិនត្រូវបានប្រើទេ។",
    "autoUnlock": "Auto Unlock",
    "unlocking": "កំពុងដោះសោ...",
    "freeUnlockWait": "ការដោះសោឥតគិតថ្លៃអាចប្រើបានក្រោយចេញផ្សាយ 7 ថ្ងៃ។",
    "coinsRemaining": "Coins — នៅសល់ {{count}}",
    "coinsUnavailable": "Coins — មិនអាចទាញទិន្នន័យបាន",
    "accessDays": "អាចអានបាន {{count}} ថ្ងៃ។",
    "availableLater": "អាចប្រើពេលក្រោយ",
    "access": "ប្រើ",
    "notEnough": "មិនគ្រប់",
    "vouchersRemaining": "Vouchers — នៅសល់ {{count}}",
    "vouchersUnavailable": "Vouchers — មិនអាចទាញទិន្នន័យបាន",
    "permanentUnlockEpisode": "ដោះសោភាគនេះជាអចិន្ត្រៃយ៍។",
    "moreFreeMethods": "វិធីឥតគិតថ្លៃផ្សេងទៀត",
    "watchAdUnlock": "មើលពាណិជ្ជកម្មដើម្បីដោះសោភាគ",
    "adUsage": "ដោះសោភាគនេះ • បានប្រើ {{used}}/{{limit}} ថ្ងៃនេះ",
    "limitReached": "ដល់កំណត់ហើយ",
    "watch": "មើល",
    "storyCardComing": "Story Card — នឹងមកដល់ឆាប់ៗ",
    "sameStoryPermanent": "ដោះសោជាអចិន្ត្រៃយ៍សម្រាប់រឿងដដែលប៉ុណ្ណោះ។",
    "coinsVouchers": "Coins និង Vouchers",
    "dontMissOut": "កុំឱ្យខកខាន",
    "diamondsAwait": "Diamonds កំពុងរង់ចាំ!",
    "continueReading": "បន្តអាន?",
    "subscribeFollow": "Subscribe ដើម្បីតាមដានភាគថ្មី",
    "subscribe": "Subscribe",
    "subscribed": "បាន Subscribe",
    "newEpisodesFirst": "អ្នកនឹងឃើញភាគថ្មីមុនគេ",
    "showSubscribePopup": "បង្ហាញផ្ទាំង Subscribe",
    "closeSubscribePopup": "បិទផ្ទាំង Subscribe",
    "subscribeStory": "Subscribe រឿងនេះ",
    "prev": "មុន",
    "next": "បន្ទាប់",
    "episode": "ភាគ",
    "comments": "មតិ",
    "settings": "ការកំណត់",
    "progress": "វឌ្ឍនភាព",
    "adultWarningTitle": "ការព្រមានមាតិកា 18+",
    "adultWarningText": "ភាគនេះអាចមានមាតិកាសម្រាប់មនុស្សពេញវ័យ ដូចជា អំពើហិង្សា ពាក្យសម្តីខ្លាំង មាតិកាផ្លូវភេទ ឬមាតិកាប្រកាន់អារម្មណ៍ផ្សេងៗ។ សូមបន្តអានដោយការសម្រេចចិត្តរបស់អ្នក។",
    "continueReadingButton": "បន្តអាន",
    "goBack": "ត្រឡប់ក្រោយ",
    "untitledStory": "រឿងគ្មានចំណងជើង",
    "completed": "បានបញ្ចប់",
    "new": "ថ្មី",
    "ongoing": "កំពុងបន្ត",
    "byAuthor": "ដោយ {{author}}",
    "episodesStatus": "{{count}} ភាគ, {{status}}",
    "closeEpisodeList": "បិទបញ្ជីភាគ",
    "reverseEpisodeOrder": "ប្ដូរលំដាប់ភាគ",
    "reverse": "ប្ដូរលំដាប់",
    "episodeNumber": "ភាគ {{number}}",
    "closeFontList": "បិទបញ្ជី Font",
    "searchFont": "ស្វែងរក Font",
    "khmerFonts": "Font ខ្មែរ",
    "otherFonts": "Font ផ្សេងៗ",
    "noFonts": "រកមិនឃើញ Font",
    "cancelReset": "បោះបង់ Reset",
    "resetTitle": "Reset ការកំណត់ការអាន?",
    "resetDescription": "វានឹងស្ដារ Font size, Font style, Page color, Brightness, Line spacing និង Auto scroll ទៅតម្លៃដើម។",
    "cancel": "បោះបង់",
    "reset": "Reset",
    "readingPreferences": "ជម្រើសការអាន",
    "manualTap": "ចុចដោយដៃ",
    "autoTap": "ចុចស្វ័យប្រវត្តិ",
    "autoTapSpeed": "ល្បឿន Auto Tap",
    "autoTapHelp": "បង្ហាញសារម្តងមួយដោយស្វ័យប្រវត្តិ",
    "manualTapHelp": "ចុចតំបន់អាន ដើម្បីបង្ហាញសារម្តងមួយ។",
    "slow": "យឺត",
    "fast": "លឿន",
    "verySlow": "យឺតខ្លាំង",
    "normal": "ធម្មតា",
    "veryFast": "លឿនខ្លាំង",
    "moreSetting": "ការកំណត់បន្ថែម",
    "backReaderSettings": "ត្រឡប់ទៅការកំណត់ការអាន",
    "closeReaderSettings": "បិទការកំណត់ការអាន",
    "paging": "ប្ដូរទំព័រ",
    "scrolling": "អូសចុះឡើង",
    "autoScroll": "អូសស្វ័យប្រវត្តិ",
    "scrollingOnly": "អាចប្រើបានតែក្នុងរបៀប Scrolling",
    "turnOff": "បិទ",
    "turnOn": "បើក",
    "resetSettings": "Reset ការកំណត់",
    "brightness": "ពន្លឺ",
    "fontSpacing": "Font និងចន្លោះ",
    "fontSize": "ទំហំ Font",
    "decreaseFontSize": "បន្ថយទំហំ Font",
    "increaseFontSize": "បង្កើនទំហំ Font",
    "lineSpacing": "ចន្លោះបន្ទាត់",
    "decreaseLineSpacing": "បន្ថយចន្លោះបន្ទាត់",
    "increaseLineSpacing": "បង្កើនចន្លោះបន្ទាត់",
    "pageColor": "ពណ៌ក្រដាស",
    "fontStyle": "រចនាប័ទ្ម Font",
    "white": "ស",
    "paper": "ក្រដាស",
    "sepia": "Sepia",
    "dark": "ងងឹត",
    "openTaskCenter": "បើក Task Center",
    "adultConfirmRequired": "សូមបញ្ជាក់ការព្រមានមាតិកាមនុស្សពេញវ័យដើម្បីបន្ត។",
    "adRequired": "ត្រូវមើលពាណិជ្ជកម្មមុនពេលអានភាគនេះ។",
    "untitledEpisode": "ភាគគ្មានចំណងជើង",
    "backToStory": "ត្រឡប់ទៅរឿង",
    "readerSettings": "ការកំណត់អ្នកអាន",
    "episodeList": "បញ្ជីភាគ",
    "moreOptions": "ជម្រើសបន្ថែម",
    "report": "រាយការណ៍",
    "copyLink": "ចម្លង Link",
    "echo": "Echo",
    "pauseAutoScroll": "ផ្អាក Auto Scroll",
    "copyThisLink": "ចម្លង Link នេះ៖",
    "episodeListNotFound": "រកមិនឃើញបញ្ជីភាគ",
    "episodeNotFound": "រកមិនឃើញភាគ",
    "cannotConnectServer": "មិនអាចភ្ជាប់ទៅ Server បាន។ សូមព្យាយាមម្តងទៀត។",
    "unlockStatusFailed": "មិនអាចពិនិត្យស្ថានភាពដោះសោបាន",
    "notEnoughCoins": "Coins មិនគ្រប់។",
    "cannotConnectBackend": "មិនអាចភ្ជាប់ទៅ Backend បាន។",
    "notEnoughVouchers": "Vouchers មិនគ្រប់។",
    "rewardedUnavailable": "Rewarded Ad មិនអាចប្រើបាននៅពេលនេះ។",
    "unlockFailed": "មិនអាចដោះសោភាគបាន",
    "unlockCoinsFailed": "មិនអាចដោះសោភាគដោយ Coins បាន",
    "unlockVouchersFailed": "មិនអាចដោះសោភាគដោយ Vouchers បាន",
    "readMinutes": "អាន {{count}} នាទី",
    "daysHours": "{{days}} ថ្ងៃ {{hours}} ម៉ោង",
    "hoursMinutes": "{{hours}} ម៉ោង {{minutes}} នាទី",
    "minutes": "{{minutes}} នាទី",
    "failedLoadEpisode": "មិនអាច Load ភាគបាន",
    "invalidReadingLink": "Link សម្រាប់អានមិនត្រឹមត្រូវ។ សូមបើកភាគនេះពីទំព័ររឿង។",
    "offlineAccessExpired": "សិទ្ធិអានភាគនេះពេល Offline បានផុតកំណត់ហើយ។ សូមភ្ជាប់អ៊ីនធឺណិត ដើម្បីបន្តសិទ្ធិអាន។",
    "adClosedIncomplete": "ពាណិជ្ជកម្មត្រូវបានបិទមុនពេលចប់។ ភាគនេះនៅតែ Locked។"
  },
  "zh": {
    "toBeContinued": "未完待续",
    "pageOf": "第 {{current}} / {{total}} 页",
    "youtubeVideo": "YouTube 视频",
    "openVideo": "打开 {{title}}",
    "hideVideo": "收起 {{title}}",
    "watchOnYouTube": "在 YouTube 上观看",
    "noMangaPages": "未找到漫画页面。",
    "mangaEpisode": "漫画章节",
    "mangaPageAlt": "{{title}} — 第 {{page}} 页",
    "mangaPagePartAlt": "{{title}} — 第 {{page}} 页，第 {{part}} 部分",
    "like": "喜欢",
    "gift": "礼物",
    "hotComments": "热门评论",
    "viewComment_one": "查看 {{count}} 条评论",
    "viewComment_other": "查看 {{count}} 条评论",
    "writeComment": "写评论",
    "reader": "读者",
    "reactionUpdateFailed": "更新互动失败",
    "reactionFailed": "章节互动失败",
    "oneEpisode": "1 章",
    "nextEpisodes": "接下来 {{count}} 章",
    "premium": "Premium",
    "premiumDiscount": "每次解锁章节可享 10% 优惠。",
    "unlockThisEpisode": "解锁本章",
    "unlockEpisodes": "解锁 {{count}} 章",
    "unlockAllEpisodes": "解锁全部章节",
    "discountOff": "优惠 {{count}}%",
    "comingSoon": "即将推出",
    "topUpBonus": "首次充值 $10+ 奖励！",
    "topUpBonusDetail": "1 张免费 Book Pass + 3 张阅读券",
    "instantAccess": "立即解锁",
    "freeAccess": "免费解锁",
    "myDiamonds": "我的 Diamonds：",
    "autoUnlockInfo": "自动解锁信息",
    "autoUnlockHelp": "自动解锁仅使用 Diamonds。Coins、Vouchers 或 Story Cards 不会被使用。",
    "autoUnlock": "自动解锁",
    "unlocking": "正在解锁...",
    "freeUnlockWait": "免费解锁在发布 7 天后可用。",
    "coinsRemaining": "Coins — 剩余 {{count}}",
    "coinsUnavailable": "Coins — 无法加载",
    "accessDays": "可阅读 {{count}} 天。",
    "availableLater": "稍后可用",
    "access": "使用",
    "notEnough": "不足",
    "vouchersRemaining": "Vouchers — 剩余 {{count}}",
    "vouchersUnavailable": "Vouchers — 无法加载",
    "permanentUnlockEpisode": "永久解锁本章。",
    "moreFreeMethods": "更多免费方式",
    "watchAdUnlock": "观看广告解锁章节",
    "adUsage": "解锁本章 • 今日已使用 {{used}}/{{limit}}",
    "limitReached": "已达上限",
    "watch": "观看",
    "storyCardComing": "Story Card — 即将推出",
    "sameStoryPermanent": "仅永久解锁同一故事。",
    "coinsVouchers": "Coins 与 Vouchers",
    "dontMissOut": "不要错过",
    "diamondsAwait": "Diamonds 等你领取！",
    "continueReading": "继续阅读？",
    "subscribeFollow": "订阅以追踪新章节",
    "subscribe": "订阅",
    "subscribed": "已订阅",
    "newEpisodesFirst": "你将优先看到新章节",
    "showSubscribePopup": "显示订阅提示",
    "closeSubscribePopup": "关闭订阅提示",
    "subscribeStory": "订阅此故事",
    "prev": "上一章",
    "next": "下一章",
    "episode": "章节",
    "comments": "评论",
    "settings": "设置",
    "progress": "进度",
    "adultWarningTitle": "18+ 内容警告",
    "adultWarningText": "本章节可能包含成人主题，包括暴力、强烈语言、性或暗示性内容，或其他敏感素材。请自行判断是否继续。",
    "continueReadingButton": "继续阅读",
    "goBack": "返回",
    "untitledStory": "无标题故事",
    "completed": "已完结",
    "new": "新作",
    "ongoing": "连载中",
    "byAuthor": "作者：{{author}}",
    "episodesStatus": "{{count}} 章，{{status}}",
    "closeEpisodeList": "关闭章节列表",
    "reverseEpisodeOrder": "反转章节顺序",
    "reverse": "反转",
    "episodeNumber": "第 {{number}} 章",
    "closeFontList": "关闭字体列表",
    "searchFont": "搜索字体",
    "khmerFonts": "高棉字体",
    "otherFonts": "其他字体",
    "noFonts": "未找到字体",
    "cancelReset": "取消重置",
    "resetTitle": "重置阅读设置？",
    "resetDescription": "这将把字体大小、字体样式、页面颜色、亮度、行距和自动滚动恢复为默认值。",
    "cancel": "取消",
    "reset": "重置",
    "readingPreferences": "阅读偏好",
    "manualTap": "手动点击",
    "autoTap": "自动点击",
    "autoTapSpeed": "自动点击速度",
    "autoTapHelp": "自动逐条显示消息",
    "manualTapHelp": "点击阅读区域，一次显示一条消息。",
    "slow": "慢",
    "fast": "快",
    "verySlow": "很慢",
    "normal": "正常",
    "veryFast": "很快",
    "moreSetting": "更多设置",
    "backReaderSettings": "返回阅读设置",
    "closeReaderSettings": "关闭阅读设置",
    "paging": "翻页",
    "scrolling": "滚动",
    "autoScroll": "自动滚动",
    "scrollingOnly": "仅在滚动模式下可用",
    "turnOff": "关闭",
    "turnOn": "开启",
    "resetSettings": "重置设置",
    "brightness": "亮度",
    "fontSpacing": "字体与间距",
    "fontSize": "字体大小",
    "decreaseFontSize": "减小字体",
    "increaseFontSize": "增大字体",
    "lineSpacing": "行距",
    "decreaseLineSpacing": "减小行距",
    "increaseLineSpacing": "增大行距",
    "pageColor": "页面颜色",
    "fontStyle": "字体样式",
    "white": "白色",
    "paper": "纸张",
    "sepia": "棕褐色",
    "dark": "深色",
    "openTaskCenter": "打开任务中心",
    "adultConfirmRequired": "请确认成人内容警告后继续。",
    "adRequired": "阅读本章前需要先观看广告。",
    "untitledEpisode": "无标题章节",
    "backToStory": "返回故事",
    "readerSettings": "阅读设置",
    "episodeList": "章节列表",
    "moreOptions": "更多选项",
    "report": "举报",
    "copyLink": "复制链接",
    "echo": "Echo",
    "pauseAutoScroll": "暂停自动滚动",
    "copyThisLink": "复制此链接：",
    "episodeListNotFound": "未找到章节列表",
    "episodeNotFound": "未找到章节",
    "cannotConnectServer": "无法连接服务器，请稍后重试。",
    "unlockStatusFailed": "检查解锁状态失败",
    "notEnoughCoins": "Coins 不足。",
    "cannotConnectBackend": "无法连接 Backend。",
    "notEnoughVouchers": "Vouchers 不足。",
    "rewardedUnavailable": "奖励广告暂时不可用。",
    "unlockFailed": "解锁章节失败",
    "unlockCoinsFailed": "使用 Coins 解锁章节失败",
    "unlockVouchersFailed": "使用 Vouchers 解锁章节失败",
    "readMinutes": "阅读 {{count}} 分钟",
    "daysHours": "{{days}} 天 {{hours}} 小时",
    "hoursMinutes": "{{hours}} 小时 {{minutes}} 分钟",
    "minutes": "{{minutes}} 分钟",
    "failedLoadEpisode": "加载章节失败",
    "invalidReadingLink": "阅读链接无效。请从故事页面打开此章节。",
    "offlineAccessExpired": "此章节的离线阅读权限已过期。请连接网络以续期。",
    "adClosedIncomplete": "广告未播放完成就被关闭，本章节仍处于锁定状态。"
  },
  "ja": {
    "toBeContinued": "つづく",
    "pageOf": "{{current}} / {{total}} ページ",
    "youtubeVideo": "YouTube 動画",
    "openVideo": "{{title}} を開く",
    "hideVideo": "{{title}} を閉じる",
    "watchOnYouTube": "YouTube で見る",
    "noMangaPages": "マンガページが見つかりません。",
    "mangaEpisode": "マンガエピソード",
    "mangaPageAlt": "{{title}} — {{page}} ページ",
    "mangaPagePartAlt": "{{title}} — {{page}} ページ、パート {{part}}",
    "like": "いいね",
    "gift": "ギフト",
    "hotComments": "人気コメント",
    "viewComment_one": "コメント {{count}} 件を見る",
    "viewComment_other": "コメント {{count}} 件を見る",
    "writeComment": "コメントを書く",
    "reader": "読者",
    "reactionUpdateFailed": "リアクションを更新できませんでした",
    "reactionFailed": "エピソードのリアクションに失敗しました",
    "oneEpisode": "1 話",
    "nextEpisodes": "次の {{count}} 話",
    "premium": "Premium",
    "premiumDiscount": "エピソードのアンロックが毎回 10% オフになります。",
    "unlockThisEpisode": "この話をアンロック",
    "unlockEpisodes": "{{count}} 話をアンロック",
    "unlockAllEpisodes": "全話をアンロック",
    "discountOff": "{{count}}% OFF",
    "comingSoon": "近日公開",
    "topUpBonus": "初回 $10+ チャージ BONUS!",
    "topUpBonusDetail": "無料 Book Pass 1枚 + Reading Voucher 3枚",
    "instantAccess": "今すぐアンロック",
    "freeAccess": "無料アンロック",
    "myDiamonds": "マイ Diamonds：",
    "autoUnlockInfo": "自動アンロック情報",
    "autoUnlockHelp": "自動アンロックは Diamonds のみ使用します。Coins、Vouchers、Story Cards は使用されません。",
    "autoUnlock": "自動アンロック",
    "unlocking": "アンロック中...",
    "freeUnlockWait": "無料アンロックは公開から7日後に利用できます。",
    "coinsRemaining": "Coins — 残り {{count}}",
    "coinsUnavailable": "Coins — 読み込めません",
    "accessDays": "{{count}} 日間読めます。",
    "availableLater": "後で利用可能",
    "access": "利用",
    "notEnough": "不足",
    "vouchersRemaining": "Vouchers — 残り {{count}}",
    "vouchersUnavailable": "Vouchers — 読み込めません",
    "permanentUnlockEpisode": "この話を永久アンロック。",
    "moreFreeMethods": "ほかの無料方法",
    "watchAdUnlock": "広告を見てエピソードをアンロック",
    "adUsage": "この話をアンロック • 本日 {{used}}/{{limit}} 使用",
    "limitReached": "上限に達しました",
    "watch": "見る",
    "storyCardComing": "Story Card — 近日公開",
    "sameStoryPermanent": "同じストーリーのみ永久アンロック。",
    "coinsVouchers": "Coins & Vouchers",
    "dontMissOut": "お見逃しなく",
    "diamondsAwait": "Diamonds が待っています！",
    "continueReading": "続きを読む？",
    "subscribeFollow": "購読して新しいエピソードを追跡",
    "subscribe": "購読",
    "subscribed": "購読済み",
    "newEpisodesFirst": "新しいエピソードを優先表示します",
    "showSubscribePopup": "購読ポップアップを表示",
    "closeSubscribePopup": "購読ポップアップを閉じる",
    "subscribeStory": "このストーリーを購読",
    "prev": "前へ",
    "next": "次へ",
    "episode": "エピソード",
    "comments": "コメント",
    "settings": "設定",
    "progress": "進行状況",
    "adultWarningTitle": "18+ コンテンツ警告",
    "adultWarningText": "このエピソードには、暴力、強い言葉、性的または示唆的な内容、その他のセンシティブな素材など、成人向けテーマが含まれる場合があります。ご自身の判断で続行してください。",
    "continueReadingButton": "続きを読む",
    "goBack": "戻る",
    "untitledStory": "無題のストーリー",
    "completed": "完結",
    "new": "新着",
    "ongoing": "連載中",
    "byAuthor": "{{author}} 作",
    "episodesStatus": "{{count}} 話・{{status}}",
    "closeEpisodeList": "エピソード一覧を閉じる",
    "reverseEpisodeOrder": "エピソード順を反転",
    "reverse": "反転",
    "episodeNumber": "エピソード {{number}}",
    "closeFontList": "フォント一覧を閉じる",
    "searchFont": "フォントを検索",
    "khmerFonts": "クメールフォント",
    "otherFonts": "その他のフォント",
    "noFonts": "フォントが見つかりません",
    "cancelReset": "リセットをキャンセル",
    "resetTitle": "読書設定をリセットしますか？",
    "resetDescription": "フォントサイズ、フォントスタイル、ページカラー、明るさ、行間、自動スクロールを初期設定に戻します。",
    "cancel": "キャンセル",
    "reset": "リセット",
    "readingPreferences": "読書設定",
    "manualTap": "手動タップ",
    "autoTap": "自動タップ",
    "autoTapSpeed": "自動タップ速度",
    "autoTapHelp": "メッセージを1つずつ自動表示します",
    "manualTapHelp": "読書エリアをタップして、メッセージを1つずつ表示します。",
    "slow": "遅い",
    "fast": "速い",
    "verySlow": "とても遅い",
    "normal": "標準",
    "veryFast": "とても速い",
    "moreSetting": "詳細設定",
    "backReaderSettings": "読書設定に戻る",
    "closeReaderSettings": "読書設定を閉じる",
    "paging": "ページ送り",
    "scrolling": "スクロール",
    "autoScroll": "自動スクロール",
    "scrollingOnly": "スクロールモードでのみ利用できます",
    "turnOff": "オフ",
    "turnOn": "オン",
    "resetSettings": "設定をリセット",
    "brightness": "明るさ",
    "fontSpacing": "フォントと間隔",
    "fontSize": "フォントサイズ",
    "decreaseFontSize": "フォントを小さくする",
    "increaseFontSize": "フォントを大きくする",
    "lineSpacing": "行間",
    "decreaseLineSpacing": "行間を狭くする",
    "increaseLineSpacing": "行間を広くする",
    "pageColor": "ページカラー",
    "fontStyle": "フォントスタイル",
    "white": "白",
    "paper": "紙",
    "sepia": "セピア",
    "dark": "ダーク",
    "openTaskCenter": "タスクセンターを開く",
    "adultConfirmRequired": "成人向けコンテンツの警告を確認して続行してください。",
    "adRequired": "このエピソードを読む前に広告の視聴が必要です。",
    "untitledEpisode": "無題のエピソード",
    "backToStory": "ストーリーに戻る",
    "readerSettings": "読書設定",
    "episodeList": "エピソード一覧",
    "moreOptions": "その他のオプション",
    "report": "報告",
    "copyLink": "リンクをコピー",
    "echo": "Echo",
    "pauseAutoScroll": "自動スクロールを一時停止",
    "copyThisLink": "このリンクをコピー：",
    "episodeListNotFound": "エピソード一覧が見つかりません",
    "episodeNotFound": "エピソードが見つかりません",
    "cannotConnectServer": "サーバーに接続できません。後でもう一度お試しください。",
    "unlockStatusFailed": "アンロック状態を確認できませんでした",
    "notEnoughCoins": "Coins が足りません。",
    "cannotConnectBackend": "Backend に接続できません。",
    "notEnoughVouchers": "Vouchers が足りません。",
    "rewardedUnavailable": "リワード広告は現在利用できません。",
    "unlockFailed": "エピソードをアンロックできませんでした",
    "unlockCoinsFailed": "Coins でエピソードをアンロックできませんでした",
    "unlockVouchersFailed": "Vouchers でエピソードをアンロックできませんでした",
    "readMinutes": "{{count}} 分読む",
    "daysHours": "{{days}} 日 {{hours}} 時間",
    "hoursMinutes": "{{hours}} 時間 {{minutes}} 分",
    "minutes": "{{minutes}} 分",
    "failedLoadEpisode": "エピソードを読み込めませんでした",
    "invalidReadingLink": "読書リンクが無効です。ストーリーページからこのエピソードを開いてください。",
    "offlineAccessExpired": "このエピソードのオフライン閲覧期限が切れました。インターネットに接続してアクセスを更新してください。",
    "adClosedIncomplete": "広告が完了前に閉じられました。このエピソードはまだロックされています。"
  },
  "ko": {
    "toBeContinued": "계속됩니다",
    "pageOf": "{{current}} / {{total}} 페이지",
    "youtubeVideo": "YouTube 동영상",
    "openVideo": "{{title}} 열기",
    "hideVideo": "{{title}} 닫기",
    "watchOnYouTube": "YouTube에서 보기",
    "noMangaPages": "만화 페이지를 찾을 수 없습니다.",
    "mangaEpisode": "만화 에피소드",
    "mangaPageAlt": "{{title}} — {{page}} 페이지",
    "mangaPagePartAlt": "{{title}} — {{page}} 페이지, 파트 {{part}}",
    "like": "좋아요",
    "gift": "선물",
    "hotComments": "인기 댓글",
    "viewComment_one": "댓글 {{count}}개 보기",
    "viewComment_other": "댓글 {{count}}개 보기",
    "writeComment": "댓글 작성",
    "reader": "독자",
    "reactionUpdateFailed": "반응을 업데이트하지 못했습니다",
    "reactionFailed": "에피소드 반응에 실패했습니다",
    "oneEpisode": "1화",
    "nextEpisodes": "다음 {{count}}화",
    "premium": "Premium",
    "premiumDiscount": "에피소드를 잠금 해제할 때마다 10% 할인됩니다.",
    "unlockThisEpisode": "이 에피소드 잠금 해제",
    "unlockEpisodes": "{{count}}화 잠금 해제",
    "unlockAllEpisodes": "전체 에피소드 잠금 해제",
    "discountOff": "{{count}}% 할인",
    "comingSoon": "곧 출시",
    "topUpBonus": "첫 $10+ 충전 BONUS!",
    "topUpBonusDetail": "무료 Book Pass 1개 + Reading Voucher 3개",
    "instantAccess": "즉시 잠금 해제",
    "freeAccess": "무료 잠금 해제",
    "myDiamonds": "내 Diamonds:",
    "autoUnlockInfo": "자동 잠금 해제 정보",
    "autoUnlockHelp": "자동 잠금 해제는 Diamonds만 사용합니다. Coins, Vouchers, Story Cards는 사용되지 않습니다.",
    "autoUnlock": "자동 잠금 해제",
    "unlocking": "잠금 해제 중...",
    "freeUnlockWait": "무료 잠금 해제는 공개 7일 후 이용할 수 있습니다.",
    "coinsRemaining": "Coins — {{count}} 남음",
    "coinsUnavailable": "Coins — 불러올 수 없음",
    "accessDays": "{{count}}일 동안 읽을 수 있습니다.",
    "availableLater": "나중에 이용 가능",
    "access": "이용",
    "notEnough": "부족",
    "vouchersRemaining": "Vouchers — {{count}} 남음",
    "vouchersUnavailable": "Vouchers — 불러올 수 없음",
    "permanentUnlockEpisode": "이 에피소드를 영구 잠금 해제합니다.",
    "moreFreeMethods": "다른 무료 방법",
    "watchAdUnlock": "광고를 보고 에피소드 잠금 해제",
    "adUsage": "이 에피소드 잠금 해제 • 오늘 {{used}}/{{limit}} 사용",
    "limitReached": "한도 도달",
    "watch": "보기",
    "storyCardComing": "Story Card — 곧 출시",
    "sameStoryPermanent": "같은 스토리에서만 영구 잠금 해제됩니다.",
    "coinsVouchers": "Coins & Vouchers",
    "dontMissOut": "놓치지 마세요",
    "diamondsAwait": "Diamonds가 기다리고 있어요!",
    "continueReading": "계속 읽을까요?",
    "subscribeFollow": "구독하고 새 에피소드 팔로우",
    "subscribe": "구독",
    "subscribed": "구독 중",
    "newEpisodesFirst": "새 에피소드를 먼저 볼 수 있습니다",
    "showSubscribePopup": "구독 팝업 표시",
    "closeSubscribePopup": "구독 팝업 닫기",
    "subscribeStory": "이 스토리 구독",
    "prev": "이전",
    "next": "다음",
    "episode": "에피소드",
    "comments": "댓글",
    "settings": "설정",
    "progress": "진행률",
    "adultWarningTitle": "18+ 콘텐츠 경고",
    "adultWarningText": "이 에피소드에는 폭력, 강한 언어, 성적이거나 암시적인 내용 또는 기타 민감한 소재 등 성인 주제가 포함될 수 있습니다. 계속 여부는 직접 판단해 주세요.",
    "continueReadingButton": "계속 읽기",
    "goBack": "뒤로 가기",
    "untitledStory": "제목 없는 스토리",
    "completed": "완결",
    "new": "신규",
    "ongoing": "연재 중",
    "byAuthor": "{{author}} 작품",
    "episodesStatus": "{{count}}화, {{status}}",
    "closeEpisodeList": "에피소드 목록 닫기",
    "reverseEpisodeOrder": "에피소드 순서 반전",
    "reverse": "반전",
    "episodeNumber": "에피소드 {{number}}",
    "closeFontList": "폰트 목록 닫기",
    "searchFont": "폰트 검색",
    "khmerFonts": "크메르 폰트",
    "otherFonts": "기타 폰트",
    "noFonts": "폰트를 찾을 수 없습니다",
    "cancelReset": "초기화 취소",
    "resetTitle": "읽기 설정을 초기화할까요?",
    "resetDescription": "폰트 크기, 폰트 스타일, 페이지 색상, 밝기, 줄 간격 및 자동 스크롤을 기본값으로 되돌립니다.",
    "cancel": "취소",
    "reset": "초기화",
    "readingPreferences": "읽기 환경설정",
    "manualTap": "수동 탭",
    "autoTap": "자동 탭",
    "autoTapSpeed": "자동 탭 속도",
    "autoTapHelp": "메시지를 하나씩 자동으로 표시합니다",
    "manualTapHelp": "읽기 영역을 탭하면 메시지를 하나씩 표시합니다.",
    "slow": "느림",
    "fast": "빠름",
    "verySlow": "매우 느림",
    "normal": "보통",
    "veryFast": "매우 빠름",
    "moreSetting": "추가 설정",
    "backReaderSettings": "읽기 설정으로 돌아가기",
    "closeReaderSettings": "읽기 설정 닫기",
    "paging": "페이지 넘김",
    "scrolling": "스크롤",
    "autoScroll": "자동 스크롤",
    "scrollingOnly": "스크롤 모드에서만 사용할 수 있습니다",
    "turnOff": "끄기",
    "turnOn": "켜기",
    "resetSettings": "설정 초기화",
    "brightness": "밝기",
    "fontSpacing": "폰트 및 간격",
    "fontSize": "폰트 크기",
    "decreaseFontSize": "폰트 크기 줄이기",
    "increaseFontSize": "폰트 크기 늘리기",
    "lineSpacing": "줄 간격",
    "decreaseLineSpacing": "줄 간격 줄이기",
    "increaseLineSpacing": "줄 간격 늘리기",
    "pageColor": "페이지 색상",
    "fontStyle": "폰트 스타일",
    "white": "흰색",
    "paper": "종이",
    "sepia": "세피아",
    "dark": "다크",
    "openTaskCenter": "Task Center 열기",
    "adultConfirmRequired": "계속하려면 성인 콘텐츠 경고를 확인하세요.",
    "adRequired": "이 에피소드를 읽기 전에 광고 시청이 필요합니다.",
    "untitledEpisode": "제목 없는 에피소드",
    "backToStory": "스토리로 돌아가기",
    "readerSettings": "읽기 설정",
    "episodeList": "에피소드 목록",
    "moreOptions": "더보기",
    "report": "신고",
    "copyLink": "링크 복사",
    "echo": "Echo",
    "pauseAutoScroll": "자동 스크롤 일시정지",
    "copyThisLink": "이 링크 복사:",
    "episodeListNotFound": "에피소드 목록을 찾을 수 없습니다",
    "episodeNotFound": "에피소드를 찾을 수 없습니다",
    "cannotConnectServer": "서버에 연결할 수 없습니다. 잠시 후 다시 시도하세요.",
    "unlockStatusFailed": "잠금 해제 상태를 확인하지 못했습니다",
    "notEnoughCoins": "Coins가 부족합니다.",
    "cannotConnectBackend": "Backend에 연결할 수 없습니다.",
    "notEnoughVouchers": "Vouchers가 부족합니다.",
    "rewardedUnavailable": "리워드 광고를 지금 사용할 수 없습니다.",
    "unlockFailed": "에피소드 잠금 해제에 실패했습니다",
    "unlockCoinsFailed": "Coins로 에피소드 잠금 해제에 실패했습니다",
    "unlockVouchersFailed": "Vouchers로 에피소드 잠금 해제에 실패했습니다",
    "readMinutes": "{{count}}분 읽기",
    "daysHours": "{{days}}일 {{hours}}시간",
    "hoursMinutes": "{{hours}}시간 {{minutes}}분",
    "minutes": "{{minutes}}분",
    "failedLoadEpisode": "에피소드를 불러오지 못했습니다",
    "invalidReadingLink": "읽기 링크가 올바르지 않습니다. 스토리 페이지에서 이 에피소드를 열어 주세요.",
    "offlineAccessExpired": "이 에피소드의 오프라인 읽기 권한이 만료되었습니다. 인터넷에 연결하여 권한을 갱신하세요.",
    "adClosedIncomplete": "광고가 완료되기 전에 닫혔습니다. 이 에피소드는 아직 잠겨 있습니다."
  }
})

const DISPLAY_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function getReaderLocale() {
  return DISPLAY_LOCALES[getDisplayLanguageId()] || 'en-US'
}

const STORY_TRANSLATION_ENABLED = false

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const IOS_READER = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const IOS_MANIFEST_PREFIX = 'shadow_reader_episode_manifest_v2:'
const IOS_MANIFEST_TTL_MS = 10 * 60 * 1000
const iosEpisodeRequests = new Map()

function iosPrivateScope() {
  const token = getReaderToken()
  if (!token) return ''
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `reader-${(hash >>> 0).toString(36)}`
}

function iosManifestKey(storyId) {
  return `${IOS_MANIFEST_PREFIX}${encodeURIComponent(String(storyId))}`
}

function iosEligibleManifest(data) {
  return data?.ok !== false && data?.story_is_adult === false &&
    Array.isArray(data.episodes) && !data.episodes.some((item) => item?.is_adult)
}

function readIOSManifest(storyId) {
  if (!IOS_READER) return null
  try {
    const entry = JSON.parse(sessionStorage.getItem(iosManifestKey(storyId)) || 'null')
    if (entry?.savedAt > 0 && Date.now() - entry.savedAt <= IOS_MANIFEST_TTL_MS && iosEligibleManifest(entry.data)) {
      return entry.data
    }
  } catch {}
  return null
}

function saveIOSManifest(storyId, data) {
  if (!IOS_READER || !iosEligibleManifest(data)) return
  try {
    sessionStorage.setItem(iosManifestKey(storyId), JSON.stringify({ data, savedAt: Date.now() }))
  } catch {}
}

function iosCacheResponse(data, cacheState) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'X-Shadow-Reader-Cache': cacheState },
  })
}

async function saveIOSEpisode(storyId, episodeId, data, manifest) {
  const item = manifest?.episodes?.find((entry) => String(entry.id) === String(episodeId))
  const privateAccess = data?.cache_access?.private_access === true
  if (!IOS_READER || !item || typeof item.is_locked !== 'boolean' ||
    privateAccess !== item.is_locked || item.is_adult || !iosEligibleManifest(manifest) ||
    data?.ok !== true || data?.locked === true || !data.episode ||
    String(data.episode.id) !== String(episodeId) ||
    data.story?.is_adult === true || data.episode.is_adult === true) return
  const scope = privateAccess ? iosPrivateScope() : 'public'
  if (!scope) return
  const storyType = String(data.story?.story_type || data.episode?.story_type || 'novel').toLowerCase()
  if (!['novel', 'chat_story', 'manga'].includes(storyType)) return
  await saveReaderEpisodeCache({
    storyType, storyId, episodeId, data, updatedAt: item.updated_at,
    privateAccess, scope, accessExpiresAt: data.cache_access?.expires_at || null,
  })
}

async function fetchIOSEpisode(storyId, episodeId, manifest, nativeFetch) {
  const item = manifest?.episodes?.find((entry) => String(entry.id) === String(episodeId))
  if (!IOS_READER || !iosEligibleManifest(manifest) || !item ||
    item.is_adult || typeof item.is_locked !== 'boolean') return nativeFetch()
  if (!item.is_locked && !item.is_free_published) return nativeFetch()
  const privateAccess = item.is_locked
  const scope = privateAccess ? iosPrivateScope() : 'public'
  if (scope) {
    for (const storyType of ['novel', 'chat_story', 'manga']) {
      try {
        const data = await loadReaderEpisodeCache({
          storyType, storyId, episodeId, expectedUpdatedAt: item.updated_at,
          privateAccess, scope,
        })
        if (data?.ok === true && data?.locked !== true && data?.episode &&
          String(data.episode.id) === String(episodeId) &&
          data.cache_access?.private_access === privateAccess &&
          data.story?.is_adult !== true && data.episode?.is_adult !== true) {
          return iosCacheResponse(data, privateAccess ? 'EPISODE-PRIVATE-HIT' : 'EPISODE-PUBLIC-HIT')
        }
      } catch {}
    }
  }
  const requestKey = `${scope}:${storyId}:${episodeId}`
  if (iosEpisodeRequests.has(requestKey)) return (await iosEpisodeRequests.get(requestKey)).clone()
  const pending = Promise.resolve().then(nativeFetch)
  iosEpisodeRequests.set(requestKey, pending)
  try {
    const response = await pending
    if (response.ok) {
      response.clone().json()
        .then((data) => saveIOSEpisode(storyId, episodeId, data, manifest))
        .catch(() => {})
    }
    return response.clone()
  } finally {
    iosEpisodeRequests.delete(requestKey)
  }
}

const READING_ACTIVITY_GRACE_MS = 45000
const READING_PROGRESS_STEP_SECONDS = 30

function normalizeReadingMission(mission = null) {
  if (!mission?.id) return null

  const targetMinutes = Math.max(1, Number(mission.target_minutes || 1))
  const targetSeconds = Math.max(
    60,
    Number(mission.target_seconds || targetMinutes * 60)
  )
  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(0, Number(mission.active_seconds || 0))
  )
  const completed =
    Boolean(mission.completed || mission.completed_at) ||
    activeSeconds >= targetSeconds
  const claimed = Boolean(mission.claimed || mission.claimed_at)

  return {
    ...mission,
    is_active: mission.is_active !== false,
    target_minutes: targetMinutes,
    target_seconds: targetSeconds,
    active_seconds: activeSeconds,
    completed,
    claimed,
    claimable: Boolean(mission.claimable) || (completed && !claimed),
    reward_coins: Number(mission.reward_coins || 0),
  }
}

function readingMissionMatchesStory(mission, storyId) {
  const link = String(mission?.story_link || '').trim()
  const cleanStoryId = String(storyId || '').trim()

  if (!cleanStoryId) return false
  if (!link) return true

  return link.includes(cleanStoryId)
}

function pickReadingMission(missions, storyId) {
  const list = Array.isArray(missions)
    ? missions.map(normalizeReadingMission).filter(Boolean)
    : []

  const available = list.filter(
    (mission) => mission.is_active && !mission.claimed
  )

  const specificMission = available.find((mission) => {
    const link = String(mission.story_link || '').trim()

    return link && readingMissionMatchesStory(mission, storyId)
  })

  if (specificMission) {
    return {
      ...specificMission,
      reward_type: 'mission',
      mission_scope: 'specific',
    }
  }

  const anyStoryMission = available.find(
    (mission) => !String(mission.story_link || '').trim()
  )

  if (anyStoryMission) {
    return {
      ...anyStoryMission,
      reward_type: 'mission',
      mission_scope: 'global',
    }
  }

  return null
}

function buildDailyReadingTarget(readingReward = null) {
  if (!readingReward) return null

  const milestones = Array.isArray(readingReward.milestones)
    ? readingReward.milestones
    : []

  const nextIndex = milestones.findIndex(
    (milestone) => !milestone.claimed
  )

  if (nextIndex < 0) return null

  const nextMilestone = milestones[nextIndex]
  const previousMilestoneSeconds =
    nextIndex > 0
      ? Number(milestones[nextIndex - 1]?.seconds || 0)
      : 0

  const milestoneSeconds = Number(nextMilestone.seconds || 0)
  const targetSeconds = Math.max(
    1,
    milestoneSeconds - previousMilestoneSeconds
  )

  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(
      0,
      Number(readingReward.active_seconds || 0) -
        previousMilestoneSeconds
    )
  )

  return {
    id: `daily-${readingReward.reward_date}-${milestoneSeconds}`,
    reward_type: 'daily',
    title: getDisplayText('readerPage.readMinutes', { count: formatNumber(nextMilestone.minutes) }),
    reward_coins: Number(nextMilestone.coins || 0),
    target_seconds: targetSeconds,
    active_seconds: activeSeconds,
    completed: Boolean(nextMilestone.completed),
    claimable: Boolean(nextMilestone.claimable),
    claimed: Boolean(nextMilestone.claimed),
    milestone_seconds: milestoneSeconds,
  }
}

function resolveReadingTarget({
  missions,
  readingReward,
  storyId,
}) {
  return (
    pickReadingMission(missions, storyId) ||
    buildDailyReadingTarget(readingReward) ||
    null
  )
}

function isUsableRouteId(value) {
  const text = String(value ?? '').trim()
  return Boolean(text && text !== 'undefined' && text !== 'null')
}

function shouldShowToBeContinued(story, episodes, episode) {
  if (String(story?.story_status || '').trim().toLowerCase() === 'completed') return false
  const currentNumber = Number(episode?.episode_number || 0)
  if (currentNumber <= 0) return false
  return !(episodes || []).some((item) =>
    String(item?.status || 'published').toLowerCase() === 'published' &&
    Number(item?.episode_number || 0) > currentNumber
  )
}

function ToBeContinued({ theme }) {
  const { t } = useDisplayTranslation()

  return (
    <div className={`px-4 pb-8 pt-3 text-center ${theme.card}`}>
      <div className={`text-[15px] font-medium tracking-[0.08em] ${theme.muted}`}>{t('readerPage.toBeContinued')}</div>
      <div className="mx-auto mt-4 flex max-w-[260px] items-center gap-3">
        <span className={`h-px flex-1 border-t ${theme.border}`} />
        <span className="text-[15px]">❤️</span>
        <span className={`h-px flex-1 border-t ${theme.border}`} />
      </div>
    </div>
  )
}

const REVIEW_READ_PROGRESS_PERCENT = 85
const PAGING_LINES_PER_PAGE = 20

const PAGING_CHARACTERS_PER_LINE = {
  compact: 42,
  normal: 39,
  comfort: 36,
}

const READER_THEMES = {
  white: {
    name: 'White',
    page: 'bg-[#FFFFFF]',
    card: 'bg-[#FFFFFF]',
    text: 'text-[#24201b]',
    muted: 'text-[#8a8175]',
    soft: 'bg-[#f3f4f6]',
    border: 'border-[#e5e7eb]',
    button: 'bg-[#111827] text-white',
    ghost: 'bg-white/85 text-[#111827] ring-1 ring-black/5',
    swatch: 'bg-white',
    flash: 'bg-white/45',
  },
  paper: {
    name: 'Paper',
    page: 'bg-[#efe7d8]',
    card: 'bg-[#fbf3e3]',
    text: 'text-[#2c241d]',
    muted: 'text-[#8a7460]',
    soft: 'bg-[#eadcc8]',
    border: 'border-[#e5d3bb]',
    button: 'bg-[#3b2f25] text-white',
    ghost: 'bg-[#fff8ed] text-[#3b2f25] ring-1 ring-[#dec8ae]',
    swatch: 'bg-[#fbf3e3]',
    flash: 'bg-white/35',
  },
  sepia: {
    name: 'Sepia',
    page: 'bg-[#e6d7b8]',
    card: 'bg-[#f1e2bf]',
    text: 'text-[#332719]',
    muted: 'text-[#7c6544]',
    soft: 'bg-[#dfcda7]',
    border: 'border-[#d1bc91]',
    button: 'bg-[#3b2f25] text-white',
    ghost: 'bg-[#f8edcf] text-[#3b2f25] ring-1 ring-[#c8b180]',
    swatch: 'bg-[#e5d6ad]',
    flash: 'bg-white/30',
  },
  dark: {
    name: 'Dark',
    page: 'bg-[#0f172a]',
    card: 'bg-[#111827]',
    text: 'text-[#e5e7eb]',
    muted: 'text-[#9ca3af]',
    soft: 'bg-[#1f2937]',
    border: 'border-[#263244]',
    button: 'bg-white text-[#111827]',
    ghost: 'bg-[#1f2937] text-white ring-1 ring-white/10',
    swatch: 'bg-[#050505]',
    flash: 'bg-white/10',
  },
}

const FONT_SIZE_LEVELS = [15, 17, 19, 21, 23]
const DEFAULT_FONT_SIZE_INDEX = 1

const FONT_OPTIONS = [
  {
    key: 'noto-sans-khmer',
    label: 'Noto Sans Khmer',
    group: 'Khmer Fonts',
    family: '"Noto Sans Khmer", "Khmer OS Content", system-ui, sans-serif',
  },
    {
    key: 'khmer-os-fasthand',
  label: 'Khmer OS Fasthand',
  group: 'Khmer Fonts',
  family: '"Khmer OS Fasthand", "Noto Sans Khmer", serif',
},
  {
    key: 'khmer-os-content',
    label: 'Khmer OS Content',
    group: 'Khmer Fonts',
    family: '"Khmer OS Content", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'khmer-os-battambang',
    label: 'Khmer OS Battambang',
    group: 'Khmer Fonts',
    family: '"Khmer OS Battambang", "Battambang", "Noto Sans Khmer", serif',
  },
  {
    key: 'battambang',
    label: 'Battambang',
    group: 'Khmer Fonts',
    family: '"Battambang", "Khmer OS Battambang", "Noto Sans Khmer", serif',
  },
  {
    key: 'kantumruy-pro',
    label: 'Kantumruy Pro',
    group: 'Khmer Fonts',
    family: '"Kantumruy Pro", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'siemreap',
    label: 'Siemreap',
    group: 'Khmer Fonts',
    family: '"Siemreap", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'hanuman',
    label: 'Hanuman',
    group: 'Khmer Fonts',
    family: '"Hanuman", "Noto Sans Khmer", serif',
  },
  {
    key: 'preahvihear',
    label: 'Preahvihear',
    group: 'Khmer Fonts',
    family: '"Preahvihear", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'content',
    label: 'Content',
    group: 'Khmer Fonts',
    family: '"Content", "Khmer OS Content", "Noto Sans Khmer", serif',
  },
  {
    key: 'metal',
    label: 'Metal',
    group: 'Khmer Fonts',
    family: '"Metal", "Noto Sans Khmer", serif',
  },
  {
    key: 'moulpali',
    label: 'Moulpali',
    group: 'Khmer Fonts',
    family: '"Moulpali", "Noto Sans Khmer", serif',
  },
  {
    key: 'dangrek',
    label: 'Dangrek',
    group: 'Khmer Fonts',
    family: '"Dangrek", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'system',
    label: 'System',
    group: 'Other Fonts',
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    key: 'sans-serif',
    label: 'Sans Serif',
    group: 'Other Fonts',
    family: 'Arial, Helvetica, system-ui, sans-serif',
  },
  {
    key: 'serif',
    label: 'Serif',
    group: 'Other Fonts',
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    key: 'inter',
    label: 'Inter',
    group: 'Other Fonts',
    family: '"Inter", system-ui, sans-serif',
  },
  {
    key: 'roboto',
    label: 'Roboto',
    group: 'Other Fonts',
    family: '"Roboto", Arial, sans-serif',
  },
  {
    key: 'merriweather',
    label: 'Merriweather',
    group: 'Other Fonts',
    family: '"Merriweather", Georgia, serif',
  },
  {
    key: 'lora',
    label: 'Lora',
    group: 'Other Fonts',
    family: '"Lora", Georgia, serif',
  },
  {
    key: 'georgia',
    label: 'Georgia',
    group: 'Other Fonts',
    family: 'Georgia, serif',
  },
]

const LINE_SPACING_OPTIONS = {
  compact: {
    label: 'Compact',
    className: 'leading-[1.85]',
  },
  normal: {
    label: 'Normal',
    className: 'leading-[2.05]',
  },
  comfort: {
    label: 'Comfort',
    className: 'leading-[2.25]',
  },
}

const AUTO_SCROLL_SPEEDS = [
  {
    label: 'Very slow',
    value: 0.35,
  },
  {
    label: 'Slow',
    value: 0.55,
  },
  {
    label: 'Normal',
    value: 0.8,
  },
  {
    label: 'Fast',
    value: 1.1,
  },
  {
    label: 'Very fast',
    value: 1.45,
  },
]

const CHAT_STORY_AUTO_TAP_SPEEDS = [
  { label: 'Very slow', delay: 5000 },
  { label: 'Slow', delay: 3000 },
  { label: 'Normal', delay: 2000 },
  { label: 'Fast', delay: 1500 },
  { label: 'Very fast', delay: 1000 },
]

const DEFAULT_CHAT_STORY_AUTO_TAP_SPEED = 2

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getReaderLocale())
}

function formatNumber(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(getReaderLocale()).format(Number.isFinite(number) ? number : 0)
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return formatNumber(0)

  try {
    return new Intl.NumberFormat(getReaderLocale(), {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(number)
  } catch {
    return formatNumber(number)
  }
}

function formatUnlockDateTime(value) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(getReaderLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatWaitSeconds(value) {
  const total = Math.max(0, Number(value || 0))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)

  if (days > 0) return getDisplayText('readerPage.daysHours', { days: formatNumber(days), hours: formatNumber(hours) })
  if (hours > 0) return getDisplayText('readerPage.hoursMinutes', { hours: formatNumber(hours), minutes: formatNumber(minutes) })
  return getDisplayText('readerPage.minutes', { minutes: formatNumber(minutes) })
}

function splitParagraphs(content) {
  const text = String(content || '').trim()

  if (!text) return []

  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((item) => item.trim())
    .filter(Boolean)

  return paragraphs.length ? paragraphs : [text]
}

function getPagingKey(storyId, episodeId) {
  return `shadow_reader_page_${storyId}_${episodeId}`
}

function getTextSegments(text) {
  const value = String(text || '')

  if (!value) return []

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('km', { granularity: 'word' })
      return Array.from(segmenter.segment(value), (item) => item.segment).filter(Boolean)
    } catch {
    }
  }

  return value.match(/\s+|[^\s]+/gu) || []
}

function getSegmentLength(value) {
  return Array.from(String(value || '')).length
}

function createPagingPages(content, lineSpacing, fontSizePx) {
  const paragraphs = splitParagraphs(episodeContentToPlainText(content))
  const baseCharactersPerLine = PAGING_CHARACTERS_PER_LINE[lineSpacing] || PAGING_CHARACTERS_PER_LINE.comfort
  const charactersPerLine = Math.max(18, Math.floor((baseCharactersPerLine * 17) / Math.max(15, Number(fontSizePx || 17))))
  const pages = []
  let currentPage = []
  let currentLine = ''

  const pushPage = () => {
    if (!currentPage.length) return
    pages.push(currentPage)
    currentPage = []
  }

  const pushLine = () => {
    currentPage.push(currentLine.trimEnd())
    currentLine = ''

    if (currentPage.length >= PAGING_LINES_PER_PAGE) {
      pushPage()
    }
  }

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const segments = getTextSegments(paragraph)

    segments.forEach((segment) => {
      const isSpace = /^\s+$/u.test(segment)
      const nextSegment = isSpace ? ' ' : segment
      const nextLine = currentLine ? `${currentLine}${nextSegment}` : nextSegment.trimStart()

      if (!currentLine) {
        currentLine = nextLine
        return
      }

      if (getSegmentLength(nextLine) > charactersPerLine) {
        pushLine()
        currentLine = nextSegment.trimStart()
        return
      }

      currentLine = nextLine
    })

    if (currentLine) pushLine()

    if (paragraphIndex < paragraphs.length - 1) {
      currentPage.push('')
      if (currentPage.length >= PAGING_LINES_PER_PAGE) pushPage()
    }
  })

  if (currentLine) pushLine()
  if (currentPage.length) pushPage()

  return pages.length ? pages : [[]]
}

function getReviewReadKey(storyId) {
  return `shadow_review_read_episodes_${storyId}`
}

function getReviewReadEpisodes(storyId) {
  if (!storyId) return []

  try {
    const parsed = JSON.parse(localStorage.getItem(getReviewReadKey(storyId)) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizePagingParagraphs(lines) {
  const paragraphs = []
  let current = ''

  ;(lines || []).forEach((line) => {
    const value = String(line || '').trim()

    if (!value) {
      if (current.trim()) {
        paragraphs.push(current.trim())
        current = ''
      }
      return
    }

    current = current ? `${current} ${value}` : value
  })

  if (current.trim()) paragraphs.push(current.trim())

  return paragraphs
}

function saveReviewReadEpisode(storyId, episodeId) {
  if (!storyId || !episodeId) return

  const current = getReviewReadEpisodes(storyId)
  const exists = current.some((id) => String(id) === String(episodeId))

  if (exists) return

  localStorage.setItem(getReviewReadKey(storyId), JSON.stringify([...current, episodeId]))
}

function getInitialFontSizeIndex() {
  const savedIndex = Number(localStorage.getItem('reader_font_size_index'))

  if (Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < FONT_SIZE_LEVELS.length) {
    return savedIndex
  }

  const oldValue = localStorage.getItem('reader_font_size')

  if (oldValue === 'small') return 0
  if (oldValue === 'large') return 2

  return DEFAULT_FONT_SIZE_INDEX
}

function YouTubeEpisodeCard({ videoId, title, theme }) {
  const { t } = useDisplayTranslation()
  const [expanded, setExpanded] = useState(false)
  const safeVideoId = String(videoId || '').trim()

  if (!/^[A-Za-z0-9_-]{11}$/.test(safeVideoId)) return null

  const label = String(title || '').trim() || t('readerPage.youtubeVideo')

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={`mt-7 flex w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-left active:scale-[0.995] ${theme.border} ${theme.soft}`}
        aria-label={t('readerPage.openVideo', { title: label })}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.card}`}>
          <i className={`fa-solid fa-play text-[11px] ${theme.text}`} />
        </span>

        <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${theme.text}`}>
          {label}
        </span>

        <i className={`fa-solid fa-chevron-down shrink-0 text-[10px] ${theme.muted}`} />
      </button>
    )
  }

  return (
    <div className={`mt-7 overflow-hidden rounded-[14px] border ${theme.border}`}>
      <button
        type="button"
        onClick={() => setExpanded(false)}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${theme.soft}`}
        aria-label={t('readerPage.hideVideo', { title: label })}
      >
        <span className={`min-w-0 flex-1 truncate text-[13px] font-medium ${theme.text}`}>
          {label}
        </span>

        <i className={`fa-solid fa-chevron-up shrink-0 text-[10px] ${theme.muted}`} />
      </button>

      <div className="aspect-video w-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${safeVideoId}`}
          title={label}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>

      <a
  href={`https://www.youtube.com/watch?v=${safeVideoId}`}
  target="_blank"
  rel="noopener noreferrer"
  className={`block px-4 py-3 text-center text-[12px] font-medium ${theme.muted}`}
>
  {t('readerPage.watchOnYouTube')}
</a>
      
    </div>
  )
}


function ReadingText({ content, fontSizePx, fontFamily, lineSpacing, theme }) {
  return (
    <RichEpisodeContent
      content={content}
      fontSizePx={fontSizePx}
      fontFamily={fontFamily}
      lineSpacing={lineSpacing}
      theme={theme}
    />
  )
}

function MangaEpisodePages({
  pages = [],
  title = '',
}) {
  const { t } = useDisplayTranslation()
  const mangaTitle = String(title || '').trim() || t('readerPage.mangaEpisode')

  const orderedPages = useMemo(() => {
    return (Array.isArray(pages) ? pages : [])
      .filter(
        (page) =>
          page?.image_url ||
          (
            Array.isArray(page?.parts) &&
            page.parts.some((part) => part?.image_url)
          )
      )
      .sort(
        (first, second) =>
          Number(first?.sort_order || 0) -
          Number(second?.sort_order || 0)
      )
  }, [pages])

  if (!orderedPages.length) {
    return (
      <p className="px-4 pb-6 text-[15px] font-semibold text-[#8a8175]">
        {t('readerPage.noMangaPages')}
      </p>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-white text-[0px] leading-none">
      
      {orderedPages.map((page, pageIndex) => {
        const orderedParts = (
          Array.isArray(page?.parts) ? page.parts : []
        )
          .filter((part) => part?.image_url)
          .sort(
            (first, second) =>
              Number(first?.part_index || 0) -
              Number(second?.part_index || 0)
          )

        const images = orderedParts.length
          ? orderedParts
          : [
              {
                id: page.id,
                image_url: page.image_url,
                width: page.width,
                height: page.height,
                part_index: 0,
              },
            ]

        return (
          <div
            key={page.id || page.image_url || `page-${pageIndex}`}
            className="block w-full overflow-hidden leading-none"
            data-manga-page={pageIndex + 1}
          >
            {images.map((image, partIndex) => {
              const width = Number(image.width || 0)
              const height = Number(image.height || 0)

              return (
                <img
                  key={
                    image.id ||
                    `${image.image_url}-${pageIndex}-${partIndex}`
                  }
                  src={image.image_url}
                  alt={
                    images.length > 1
                      ? t('readerPage.mangaPagePartAlt', { title: mangaTitle, page: formatNumber(pageIndex + 1), part: formatNumber(partIndex + 1) })
                      : t('readerPage.mangaPageAlt', { title: mangaTitle, page: formatNumber(pageIndex + 1) })
                  }
                  width={width > 0 ? width : undefined}
                  height={height > 0 ? height : undefined}
                  loading={
                    pageIndex === 0 && partIndex === 0
                      ? 'eager'
                      : 'lazy'
                  }
                  decoding="async"
                  draggable={false}
                  style={
                    partIndex > 0
                      ? { marginTop: '-1px' }
                      : undefined
                  }
                  className="m-0 block h-auto w-full border-0 p-0 align-top"
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function PagingReadingText({ pages, pageIndex, setPageIndex, fontSizePx, fontFamily, lineSpacing, theme, onReadingActivity }) {
  const { t } = useDisplayTranslation()
  const [flashDirection, setFlashDirection] = useState('')
  const flashTimerRef = useRef(null)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const lineHeightClass = LINE_SPACING_OPTIONS[lineSpacing]?.className || LINE_SPACING_OPTIONS.comfort.className
  const totalPages = Math.max(1, pages.length)
  const safePageIndex = Math.min(Math.max(0, pageIndex), totalPages - 1)
  const currentPage = pages[safePageIndex] || []
  const currentParagraphs = normalizePagingParagraphs(currentPage)
  const canGoPrevious = safePageIndex > 0
  const canGoNext = safePageIndex < totalPages - 1
  const pointerStartXRef = useRef(0)
  const pointerEndXRef = useRef(0)

  const showFlash = (direction) => {
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current)
    setFlashDirection(direction)
    flashTimerRef.current = window.setTimeout(() => setFlashDirection(''), 260)
  }

  const goPrevious = () => {
    if (!canGoPrevious) return
    onReadingActivity?.()
    showFlash('left')
    setPageIndex((current) => Math.max(0, current - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePointerStart = (event) => {
  pointerStartXRef.current = event.clientX || event.touches?.[0]?.clientX || 0
  pointerEndXRef.current = pointerStartXRef.current
}

const handlePointerMove = (event) => {
  pointerEndXRef.current = event.clientX || event.touches?.[0]?.clientX || pointerEndXRef.current
}

const handlePointerEnd = () => {
  const distance = pointerEndXRef.current - pointerStartXRef.current

  if (Math.abs(distance) > 55) {
    if (distance < 0) {
      goNext()
    } else {
      goPrevious()
    }
  }

  pointerStartXRef.current = 0
  pointerEndXRef.current = 0
}

  const goNext = () => {
    if (!canGoNext) return
    onReadingActivity?.()
    showFlash('right')
    setPageIndex((current) => Math.min(totalPages - 1, current + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTap = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left

    if (x < rect.width * 0.42) {
      goPrevious()
      return
    }

    if (x > rect.width * 0.58) {
      goNext()
    }
  }

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches?.[0]?.clientX || 0
    touchStartYRef.current = event.touches?.[0]?.clientY || 0
  }

  const handleTouchEnd = (event) => {
    const endX = event.changedTouches?.[0]?.clientX || 0
    const endY = event.changedTouches?.[0]?.clientY || 0
    const diffX = endX - touchStartXRef.current
    const diffY = endY - touchStartYRef.current

    if (Math.abs(diffX) < 45 || Math.abs(diffX) < Math.abs(diffY) * 1.25) return

    if (diffX < 0) goNext()
    if (diffX > 0) goPrevious()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <span className={`${theme.soft} ${theme.muted} rounded-full px-4 py-2 text-[12px] font-black`}>
          {t('readerPage.pageOf', { current: formatNumber(safePageIndex + 1), total: formatNumber(totalPages) })}
        </span>
      </div>

      <div
  className="relative min-h-[68vh] select-none"
  onMouseDown={handlePointerStart}
  onMouseMove={handlePointerMove}
  onMouseUp={handlePointerEnd}
  onTouchStart={handlePointerStart}
  onTouchMove={handlePointerMove}
  onTouchEnd={handlePointerEnd}
>
        {flashDirection ? (
          <div
            className={`pointer-events-none absolute bottom-0 top-0 z-20 flex w-[34%] items-center justify-center ${theme.flash || 'bg-white/45'} backdrop-blur-[1px] transition-opacity duration-300 ${
              flashDirection === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <i className={`fa-solid ${flashDirection === 'left' ? 'fa-chevron-left' : 'fa-chevron-right'} text-[28px] ${theme.muted}`} />
          </div>
        ) : null}

        <div className="relative z-0">
         {currentParagraphs.map((paragraph, index) => (
  <p
    key={`${safePageIndex}-${index}-${paragraph.slice(0, 16)}`}
    className={`${theme.text} ${lineHeightClass} whitespace-pre-wrap tracking-[0.003em] [overflow-wrap:normal] [word-break:normal]`}
    style={{
      fontFamily,
      fontSize: `${fontSizePx}px`,
      lineBreak: 'auto',
    }}
  >
    {paragraph}
  </p>
))}
        </div>
      </div>
    </div>
  )
}

function GiftLineIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4.8 10h14.4v10H4.8V10Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M3.8 7.2h16.4V10H3.8V7.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 7.2V20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M12 7.2H9.3c-1.8 0-2.9-.7-2.9-1.9 0-1 .8-1.8 1.9-1.8 1.5 0 2.6 1.2 3.7 3.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.2h2.7c1.8 0 2.9-.7 2.9-1.9 0-1-.8-1.8-1.9-1.8-1.5 0-2.6 1.2-3.7 3.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReaderEndPanel({
  story,
  episode,
  onOpenComments,
  onOpenGift,
  active = true,
  commentSummary = null,
  theme = READER_THEMES.white,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const episodeId = episode?.id || episode?.episode_id || ''

  const initialLikeCount = Number(
    episode?.total_likes ||
    episode?.like_count ||
    episode?.likes_count ||
    0
  )

  const [reactionType, setReactionType] =
    useState(null)
  const [likeCount, setLikeCount] =
    useState(initialLikeCount)
  const [likeBusy, setLikeBusy] =
    useState(false)

  const giftCount = Number(
    story?.total_gifts ||
    story?.gift_count ||
    story?.gifts_count ||
    episode?.total_gifts ||
    episode?.gift_count ||
    episode?.gifts_count ||
    0
  )

  const fallbackCommentCount = Number(
    episode?.total_comments ||
    episode?.comment_count ||
    episode?.comments_count ||
    0
  )

  useEffect(() => {
    let ignore = false

    setReactionType(null)
    setLikeCount(initialLikeCount)

    async function loadReactionStatus() {
      if (!active || !episodeId) return

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reactions/episode/${episodeId}/status`,
          {
            headers: readerAuthHeaders(),
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false ||
          ignore
        ) {
          return
        }

        setReactionType(
          data.reaction_type || null
        )
        setLikeCount(
          Math.max(
            0,
            Number(data.total_likes || 0)
          )
        )
      } catch {
      }
    }

    loadReactionStatus()

    return () => {
      ignore = true
    }
  }, [active, episodeId, initialLikeCount])

  async function handleEpisodeReaction(
    nextReactionType
  ) {
    if (!episodeId || likeBusy) return

    if (!getReaderToken()) {
      navigate('/login', {
        state: {
          returnTo:
            window.location.pathname,
        },
      })
      return
    }

    const previousType = reactionType
    const previousCount = likeCount
    const sameReaction =
      previousType === nextReactionType

    setLikeBusy(true)
    setReactionType(
      sameReaction
        ? null
        : nextReactionType
    )
    setLikeCount(
      Math.max(
        0,
        previousCount +
          (sameReaction
            ? -1
            : previousType
              ? 0
              : 1)
      )
    )

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reactions/episode/${episodeId}/toggle`,
        {
          method: 'POST',
          headers: {
            ...readerAuthHeaders(),
            'Content-Type':
              'application/json',
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
            t('readerPage.reactionUpdateFailed')
        )
      }

      setReactionType(
        data.liked
          ? data.reaction_type ||
              nextReactionType
          : null
      )
      setLikeCount(
        Math.max(
          0,
          Number(data.total_likes || 0)
        )
      )
   } catch (error) {
  window.alert(error?.message || t('readerPage.reactionFailed'))
  setReactionType(previousType)
  setLikeCount(previousCount)
} finally {
  setLikeBusy(false)
}
  }

  const commentSummaryMatchesEpisode =
    active &&
    String(commentSummary?.episodeId || '') ===
      String(episodeId)

  const hotComment = commentSummaryMatchesEpisode
    ? commentSummary?.hotComment || null
    : null

  const hotCommentTotal = commentSummaryMatchesEpisode
    ? Math.max(0, Number(commentSummary?.total || 0))
    : fallbackCommentCount

  const commentCount = commentSummaryMatchesEpisode
    ? hotCommentTotal
    : fallbackCommentCount
  const replies = Array.isArray(hotComment?.replies) ? hotComment.replies : []
  const replyCount = replies.length
  const hotLikes = Number(hotComment?.likes || hotComment?.like_count || 0)
  const hotUser = hotComment?.user || {}
  const hotName = hotUser.name || hotComment?.name || t('readerPage.reader')
  const hotAvatar = hotUser.avatar_url || hotComment?.avatar_url || ''
  const activeEpisodeReaction =
    getReactionMeta(reactionType)

  return (
    <article className={`mt-8 ${theme.card} px-4 pb-8 pt-2`}>
      <div className={`grid grid-cols-2 border-b ${theme.border} pb-5`}>
       <div className="flex flex-col items-center justify-center gap-1">
  <ReactionAction
  reactionType={reactionType}
  count={likeCount}
  busy={likeBusy}
  disabled={!episodeId}
  onReact={handleEpisodeReaction}
  showCount={false}
  idleLabel={t('readerPage.like')}
  idleIcon={
  <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="none">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
  buttonClassName="relative h-[44px] w-[44px] justify-center [&>img]:!h-[32px] [&>img]:!w-[32px] [&>i]:!text-[28px]"
/>

<span
  className={`pointer-events-none relative -top-[10px] w-[74px] text-center text-[13px] font-normal leading-none ${theme.text}`}
    style={{
      color: activeEpisodeReaction?.text || undefined,
    }}
  >
    {activeEpisodeReaction?.label ||
      t('readerPage.like')}
  </span>

  <button
    type="button"
    onClick={() => {
      const targetStoryId =
        story?.id || story?.story_id

      if (
        !targetStoryId ||
        !episodeId
      ) {
        return
      }

      navigate(
        `/story/${targetStoryId}/episode/${episodeId}/reactions`
      )
    }}
    disabled={!episodeId}
    className={`text-[11px] font-normal ${theme.muted} transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed`}
    style={{
      color: activeEpisodeReaction?.text || undefined,
    }}
  >
    {formatCompactNumber(likeCount)}
  </button>
</div>

        <button type="button" onClick={onOpenGift} className="flex flex-col items-center justify-center gap-1 active:scale-95">
  <img src="/assets/Icons/Gift%203.svg" alt="" className="h-[26px] w-[26px] object-contain" />
  <span className={`text-[13px] font-normal ${theme.text}`}>{t('readerPage.gift')}</span>
  <span className={`text-[11px] font-normal ${theme.muted}`}>{formatCompactNumber(giftCount)}</span>
</button>

</div>

      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`text-[18px] font-bold ${theme.text}`}>{t('readerPage.hotComments')}</h3>

          <button
            type="button"
            onClick={onOpenComments}
            className={`flex items-center gap-1 text-[13px] font-normal ${theme.muted} active:scale-95`}
          >
            <span>
              {t(commentCount === 1 ? 'readerPage.viewComment_one' : 'readerPage.viewComment_other', { count: formatCompactNumber(commentCount) })}
            </span>
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </button>
        </div>

        {hotComment ? (
          <button
            type="button"
            onClick={onOpenComments}
            className="mb-4 flex w-full gap-3 text-left active:scale-[0.995]"
          >
            {hotAvatar ? (
              <img
                src={hotAvatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[13px] font-bold text-white">
                {hotName.slice(0, 1).toUpperCase()}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className={`block text-[13px] font-bold ${theme.muted}`}>
                {hotName}
              </span>

              <span className={`mt-1 line-clamp-3 block whitespace-pre-wrap break-words text-[14px] font-normal leading-6 ${theme.text}`}>
                {hotComment.text}
              </span>

              <span className={`mt-2 flex items-center gap-5 text-[12px] font-normal ${theme.muted}`}>
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-comment text-[13px]" />
                  {formatCompactNumber(replyCount)}
                </span>

                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-heart text-[13px]" />
                  {formatCompactNumber(hotLikes)}
                </span>
              </span>
            </span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={onOpenComments}
          className={`flex w-full items-center gap-3 rounded-full border ${theme.border} ${theme.card} px-4 py-3 text-left active:scale-[0.995]`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.soft} ${theme.muted}`}>
            <i className="fa-regular fa-comment text-[15px]" />
          </span>

          <span className={`min-w-0 flex-1 text-[13px] font-normal ${theme.muted}`}>
            {t('readerPage.writeComment')}
          </span>
        </button>
      </div>
    </article>
  )
}

function LockedEpisodeCard({
  story,
  episode,
  wallet,
  coinAccess,
  voucherAccess,
  adAccess,
  rewardedAdsEnabled,
  packageOptions,
  autoUnlock,
  setAutoUnlock,
  unlocking,
  onPurchase,
  onUnlock,
  onCoinUnlock,
  onVoucherUnlock,
  onRewardedUnlock,
  inline = false,
}) {
  const { t } = useDisplayTranslation()
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const [showAutoHint, setShowAutoHint] = useState(false)
  const [activeTab, setActiveTab] = useState('instant')
  const [freeAccessView, setFreeAccessView] = useState('wallet')
  const [waitNotice, setWaitNotice] = useState(false)
const showWaitNotice = () => {
  setWaitNotice(true)
  window.setTimeout(() => setWaitNotice(false), 2500)
}
  const backgroundImage = episode?.cover_url || story?.cover_url || ''
  const coinBalance = Number(wallet?.coin_balance ?? wallet?.gem_balance ?? 0)
  const voucherBalance = Number(wallet?.voucher_balance || 0)
  const walletLoaded = Boolean(wallet)
  const coinRequired = Number(coinAccess?.amount || 0)
  const voucherRequired = Number(voucherAccess?.amount || 0)
  const coinCanAccess = Boolean(coinAccess?.available) && (coinRequired <= 0 || coinBalance >= coinRequired)
  const voucherCanAccess = Boolean(voucherAccess?.available) && (voucherRequired <= 0 || voucherBalance >= voucherRequired)
  const coinWaitRequired = Number(coinAccess?.wait_seconds || 0) > 0
  const voucherWaitRequired = Number(voucherAccess?.wait_seconds || 0) > 0
  const adDailyLimit = Math.max(1, Number(adAccess?.daily_limit || 5))
  const adUsedToday = Math.max(0, Number(adAccess?.used_today || 0))
  const adRemainingToday = Math.max(0, Number(adAccess?.remaining_today ?? adDailyLimit - adUsedToday))
  const adCanAccess = rewardedAdsEnabled && Boolean(adAccess?.available) && adRemainingToday > 0

  const singleOption =
    packageOptions.find((option) => option.key === 'single') || {
      key: 'single',
      label: '1 Episode',
      price: 10,
      requested_count: 1,
      enabled: true,
    }

  const multiPackagePriority = ['all_released', 'next50', 'next30', 'next10']
  const bestMultiOption = multiPackagePriority
    .map((key) => packageOptions.find((option) => option.key === key && option.enabled))
    .find(Boolean)

  const displayMultiOption =
    bestMultiOption || {
      key: 'next10',
      label: 'Next 10 Eps',
      price: 90,
      original_price: 100,
      discount_percent: 10,
      requested_count: 10,
      enabled: true,
    }

  const goPurchase = () => {
    onPurchase?.()
  }

  const handlePackageClick = (option) => {
    if (!option || unlocking || !option.enabled) return

    const price = Number(option.price || 0)
    if (diamondBalance < price) {
  goPurchase()
  return
}

    onUnlock(option.key)
  }

  const AccessTab = ({ active, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-11 flex-1 text-[13px] font-semibold transition ${
        active ? 'text-[#111827]' : 'text-[#A7ADBA]'
      }`}
    >
      {children}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-[76%] -translate-x-1/2 rounded-full bg-[#D6A300]" />
      ) : null}
    </button>
  )

  const PremiumRow = () => (
    <button
      type="button"
      onClick={goPurchase}
      className="flex min-h-[54px] w-full items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 text-left active:scale-[0.995]"
    >
      <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-tl-[11px] rounded-br-[11px] bg-[#111827] px-2.5 text-[11px] font-black italic text-white shadow-sm">
        <img
          src="/assets/Icons/Crown.svg"
          alt=""
          className="h-3.5 w-3.5 object-contain"
          loading="lazy"
          decoding="async"
        />
        {t('readerPage.premium')}
      </span>

      <span className="min-w-0 flex-1 text-[12px] font-semibold leading-4 text-[#8D94A1]">
        {t('readerPage.premiumDiscount')}
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#9CA3AF]" />
    </button>
  )

  const FreeAccessOption = ({ icon, title, subtitle, buttonText, disabled, onClick }) => (
    <div className="flex min-h-[72px] items-center gap-3 rounded-[16px] border border-[#E5E7EB] bg-white px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
  {icon}
</span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-[#111827]">{title}</span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-[#667085]">{subtitle}</span>
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[11px] font-black text-white disabled:bg-[#D1D5DB] disabled:text-white"
      >
        {buttonText}
      </button>
    </div>
  )

  const PackageButton = ({ option, primary = false }) => {
    if (!option) return null

    const price = Number(option.price || 0)
    const originalPrice = Number(option.original_price || 0)
    const discount = Number(
  option.total_discount_percent ??
    option.discount_percent ??
    0
)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)
    const needsTopUp = isMultiPackage && diamondBalance < price

    if (primary) {
      return (
        <button
  type="button"
  onClick={() => handlePackageClick(option)}
  disabled={unlocking || !option.enabled}
          className="flex min-h-[78px] w-full items-center justify-center bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
        >
          <span className="flex items-center justify-center gap-2 text-[16px] font-medium text-[#4B5563]">
            <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
            <span className="font-semibold text-[#111827]">
  {formatNumber(price)}
</span>

{originalPrice > price ? (
  <span className="text-[12px] text-[#A0A6B0] line-through">
    {formatNumber(originalPrice)}
  </span>
) : null}

<span>{t('readerPage.unlockThisEpisode')}</span>
          </span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => handlePackageClick(option)}
        disabled={unlocking || !option.enabled}
        className="relative flex min-h-[86px] w-full items-center justify-center overflow-hidden border-t border-[#E5E7EB] bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
      >
        {discount > 0 ? (
          <span className="absolute right-[42px] top-[12px] rounded-tl-[14px] rounded-br-[14px] bg-[#FF4D6D] px-4 py-1.5 text-[11px] font-black leading-none text-white">
            {t('readerPage.discountOff', { count: formatNumber(discount) })}
          </span>
        ) : null}

        <span className="flex items-center justify-center gap-1.5 text-[16px] font-medium text-[#4B5563]">
          <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
          <span className="text-[#111827]">{formatNumber(price)}</span>
          {originalPrice > price ? (
            <span className="ml-1 text-[12px] text-[#A0A6B0] line-through">
              {formatNumber(originalPrice)}
            </span>
          ) : null}
          <span>{requestedCount > 0 ? t('readerPage.unlockEpisodes', { count: formatNumber(requestedCount) }) : t('readerPage.unlockAllEpisodes')}</span>
        </span>
      </button>
    )
  }

  return (
    <div
      className={
        inline
          ? 'relative min-h-[680px] overflow-hidden bg-[#111827]'
          : 'fixed inset-x-0 bottom-0 top-[64px] z-[40] overflow-hidden px-0 pb-0'
      }
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[1px]"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div
        className={
          inline
            ? 'relative z-10 flex min-h-[680px] items-end justify-center'
            : 'relative z-10 flex h-full items-end justify-center md:items-center'
        }
      >
        <div className="w-full pb-[env(safe-area-inset-bottom)] md:max-w-[520px] md:pb-0">
          <button
            type="button"
            onClick={() => window.alert(t('readerPage.comingSoon'))}
            className="relative mx-auto mb-5 flex h-[56px] w-[calc(100%-24px)] items-center overflow-visible rounded-[16px] bg-gradient-to-r from-[#343842]/70 via-[#565C68]/70 to-[#343842]/70 pl-5 pr-[150px] text-left shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-[1px] active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black italic leading-5 text-[#FFE36E]">
                {t('readerPage.topUpBonus')}
              </div>

              <div className="mt-0.5 truncate text-[11.5px] font-bold leading-4 text-white/90">
                {t('readerPage.topUpBonusDetail')}
              </div>
            </div>

            <img
              src="/assets/Icons/Manga%20girl.png"
              alt=""
              className="pointer-events-none absolute -right-0 -top-[36px] h-[107px] w-[137px] object-contain"
              loading="eager"
              decoding="async"
            />
          </button>

          <section
            className={
              inline
                ? 'min-h-[340px] w-full rounded-t-[26px] bg-white pb-5 pt-0 shadow-[0_-18px_50px_rgba(0,0,0,0.18)]'
                : 'max-h-[58vh] min-h-[340px] w-full overflow-y-auto rounded-t-[26px] bg-white pb-5 pt-0 shadow-[0_-18px_50px_rgba(0,0,0,0.18)] md:rounded-[26px]'
            }
          >
            <div className="border-b border-[#E5E7EB] px-4 pt-2">
              <div className="flex">
                <AccessTab active={activeTab === 'instant'} onClick={() => setActiveTab('instant')}>
                  {t('readerPage.instantAccess')}
                </AccessTab>

                <AccessTab active={activeTab === 'free'} onClick={() => setActiveTab('free')}>
                  {t('readerPage.freeAccess')}
                </AccessTab>
              </div>
            </div>

            {activeTab === 'instant' ? (
              <>
                <PremiumRow />

                <div className="overflow-hidden border-b border-[#E5E7EB]">
                  <PackageButton option={singleOption} primary />
                  <PackageButton option={displayMultiOption} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 px-5">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
                    <span>{t('readerPage.myDiamonds')}</span>
                    <span className="font-black text-[#667085]">{formatNumber(diamondBalance)}</span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAutoHint((value) => !value)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D6DAE2] bg-white text-[11px] font-black text-[#A0A6B0] shadow-sm active:scale-95"
                      aria-label={t('readerPage.autoUnlockInfo')}
                    >
                      ?
                    </button>

                    {showAutoHint ? (
                      <button
                        type="button"
                        onClick={() => setShowAutoHint(false)}
                        className="absolute bottom-10 right-0 z-20 w-[260px] rounded-[16px] bg-[#111827] px-4 py-3 text-left text-[11px] font-bold leading-5 text-white shadow-xl"
                      >
                        {t('readerPage.autoUnlockHelp')}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setAutoUnlock((value) => !value)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[12px] font-bold text-[#9CA3AF]">
                        {t('readerPage.autoUnlock')}
                      </span>

                      <span className={`relative h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
                        autoUnlock
                          ? 'bg-[#111827] shadow-[0_6px_16px_rgba(17,24,39,0.28)]'
                          : 'bg-[#D1D6DE] shadow-inner'
                      }`}>
                        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
                          autoUnlock ? 'left-[26px]' : 'left-1'
                        }`} />
                      </span>
                    </button>
                  </div>
                </div>

                {unlocking ? (
                  <div className="mt-5 text-center text-[12px] font-black text-[#8D94A1]">
                    {t('readerPage.unlocking')}
                  </div>
                ) : null}
              </>
            ) : (
       <div className="space-y-2.5 px-3 py-4">
         {waitNotice ? (
  <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2 text-[11px] font-bold text-white shadow-xl">
    {t('readerPage.freeUnlockWait')}
  </div>
) : null}
  {freeAccessView === 'wallet' ? (
    <>
      <FreeAccessOption
        icon={
  <img
    src="/assets/Icons/Shadow Coin.svg"
    alt=""
    className="mx-auto h-7 w-7 object-contain"
    loading="lazy"
    decoding="async"
  />
}
        title={walletLoaded ? t('readerPage.coinsRemaining', { count: formatNumber(coinBalance) }) : t('readerPage.coinsUnavailable')}
        subtitle={t('readerPage.accessDays', { count: formatNumber(Number(coinAccess?.access_days || 7)) })}
        buttonText={coinWaitRequired ? t('readerPage.availableLater') : coinCanAccess ? t('readerPage.access') : t('readerPage.notEnough')}
        disabled={unlocking || (!coinWaitRequired && !coinCanAccess)}
        onClick={coinWaitRequired ? showWaitNotice : onCoinUnlock}
      />

      <FreeAccessOption
        icon={
  <img
    src="/assets/Icons/Voucher.svg"
    alt=""
    className="h-7 w-7 object-contain"
    loading="lazy"
    decoding="async"
  />
}
        title={walletLoaded ? t('readerPage.vouchersRemaining', { count: formatNumber(voucherBalance) }) : t('readerPage.vouchersUnavailable')}
        subtitle={t('readerPage.permanentUnlockEpisode')}
        buttonText={voucherWaitRequired ? t('readerPage.availableLater') : voucherCanAccess ? t('readerPage.access') : t('readerPage.notEnough')}
        disabled={unlocking || (!voucherWaitRequired && !voucherCanAccess)}
        onClick={voucherWaitRequired ? showWaitNotice : onVoucherUnlock}
      />

      <button
        type="button"
        onClick={() => setFreeAccessView('more')}
        className="mx-auto flex items-center gap-1 px-2 pt-1 text-[12px] font-normal text-[#8D94A1] active:text-[#111827]"
      >
        <span>{t('readerPage.moreFreeMethods')}</span>
        <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </>
  ) : (
    <>
      {rewardedAdsEnabled ? (
  <FreeAccessOption
    icon={<i className="fa-solid fa-play text-[15px] text-[#0B5CFF]" />}
    title={t('readerPage.watchAdUnlock')}
    subtitle={t('readerPage.adUsage', { used: formatNumber(adUsedToday), limit: formatNumber(adDailyLimit) })}
    buttonText={adRemainingToday <= 0 ? t('readerPage.limitReached') : t('readerPage.watch')}
    disabled={unlocking || !adCanAccess}
    onClick={onRewardedUnlock}
  />
) : null}

      <FreeAccessOption
        icon={<i className="fa-regular fa-address-card text-[17px] text-[#111827]" />}
        title={t('readerPage.storyCardComing')}
        subtitle={t('readerPage.sameStoryPermanent')}
        buttonText={t('readerPage.access')}
        disabled
      />

      <button
        type="button"
        onClick={() => setFreeAccessView('wallet')}
        className="mx-auto flex items-center gap-1 px-2 pt-1 text-[12px] font-normal text-[#8D94A1] active:text-[#111827]"
      >
        <span>{t('readerPage.coinsVouchers')}</span>
        <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </>
  )}
</div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function ContinuousLockedEpisodeCard({
  story,
  episode,
  wallet,
  adAccess,
  rewardedAdsEnabled,
  packageOptions,
  autoUnlock,
  setAutoUnlock,
  unlocking,
  onPurchase,
  onUnlock,
  onRewardedUnlock,
}) {
  const { t } = useDisplayTranslation()
  const diamondBalance = Number(wallet?.diamond_balance || 0)
const [diamondBoxIndex, setDiamondBoxIndex] = useState(0)
const [showAutoHint, setShowAutoHint] = useState(false)
  const backgroundImage = episode?.cover_url || story?.cover_url || ''
  const adDailyLimit = Math.max(1, Number(adAccess?.daily_limit || 5))
  const adUsedToday = Math.max(0, Number(adAccess?.used_today || 0))
  const adRemainingToday = Math.max(
    0,
    Number(adAccess?.remaining_today ?? adDailyLimit - adUsedToday)
  )
  const adCanAccess =
    rewardedAdsEnabled &&
    Boolean(adAccess?.available) &&
    adRemainingToday > 0

  const diamondBoxSources = [
  '/assets/Icons/Diamond box 2.png',
  '/assets/Icons/Diamond%20box%202.png',
  '/assets/Icons/Diamond box.png',
  '/assets/Icons/Diamond.svg',
]

  const singleOption =
    packageOptions.find((option) => option.key === 'single') || {
      key: 'single',
      label: '1 Episode',
      price: 10,
      requested_count: 1,
      enabled: true,
    }

  const multiPackagePriority = ['all_released', 'next50', 'next30', 'next10']
  const bestMultiOption = multiPackagePriority
    .map((key) => packageOptions.find((option) => option.key === key && option.enabled))
    .find(Boolean)

  const displayMultiOption =
    bestMultiOption || {
      key: 'next10',
      label: 'Next 10 Eps',
      price: 90,
      original_price: 100,
      discount_percent: 10,
      requested_count: 10,
      enabled: true,
    }

  const goPurchase = () => {
  onPurchase?.()
}

  const handlePackageClick = (option) => {
    if (!option || unlocking || !option.enabled) return

    const price = Number(option.price || 0)
    if (diamondBalance < price) {
  goPurchase()
  return
}

    onUnlock(option.key)
  }

  const PackageButton = ({ option, primary = false }) => {
    if (!option) return null

    const price = Number(option.price || 0)
    const originalPrice = Number(option.original_price || 0)
    const discount = Number(
  option.total_discount_percent ??
    option.discount_percent ??
    0
)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)
    const needsTopUp = isMultiPackage && diamondBalance < price

    if (primary) {
      return (
        <button
  type="button"
  onClick={() => handlePackageClick(option)}
  disabled={unlocking || !option.enabled}
          className="flex min-h-[78px] w-full items-center justify-center bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
        >
          <span className="flex items-center justify-center gap-2 text-[16px] font-medium text-[#4B5563]">
  <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
  <span className="font-semibold text-[#111827]">
  {formatNumber(price)}
</span>

{originalPrice > price ? (
  <span className="text-[12px] text-[#A0A6B0] line-through">
    {formatNumber(originalPrice)}
  </span>
) : null}

<span>{t('readerPage.unlockThisEpisode')}</span>
</span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => handlePackageClick(option)}
        disabled={unlocking || !option.enabled}
        className="relative flex min-h-[86px] w-full items-center justify-center overflow-hidden border-t border-[#E5E7EB] bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
      >
        {discount > 0 ? (
      <span className="absolute right-[42px] top-[12px] rounded-tl-[14px] rounded-br-[14px] bg-[#FF4D6D] px-4 py-1.5 text-[11px] font-black leading-none text-white">
  {t('readerPage.discountOff', { count: formatNumber(discount) })}
</span>
        ) : null}

        <span className="flex items-center justify-center gap-1.5 text-[16px] font-medium text-[#4B5563]">
  <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
  <span className="text-[#111827]">{formatNumber(price)}</span>
          {originalPrice > price ? (
            <span className="ml-1 text-[12px] text-[#A0A6B0] line-through">
              {formatNumber(originalPrice)}
            </span>
          ) : null}
          <span>{requestedCount > 0 ? t('readerPage.unlockEpisodes', { count: formatNumber(requestedCount) }) : t('readerPage.unlockAllEpisodes')}</span>
        </span>

        
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-[64px] z-[40] overflow-hidden px-0 pb-0">
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[1px]"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-end justify-center md:items-center">
        <div className="w-full pb-[env(safe-area-inset-bottom)] md:max-w-[520px] md:pb-0">
        <button
          type="button"
          onClick={() => window.alert(t('readerPage.comingSoon'))}
          className="mx-auto mb-5 flex h-[56px] w-[calc(100%-24px)] items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#343842]/70 via-[#565C68]/70 to-[#343842]/70 px-3 py-1 text-left shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-[1px]"
        >
          <span className="-mb-0 -mt-3 -ml-1 flex h-[78px] w-[78px] shrink-0 items-end justify-center overflow-visible">
            <img
             src="/assets/Icons/Diamond%20box.png?v=box-new-1"
              alt=""
              className="h-full w-full object-contain"
              loading="eager"
              decoding="async"
              onError={() => {
                setDiamondBoxIndex((current) => Math.min(current + 1, diamondBoxSources.length - 1))
              }}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-black italic leading-5 text-white">
              {t('readerPage.dontMissOut')}
            </div>

            <div className="mt-0.5 flex items-baseline gap-1 leading-4">
              <span className="text-[15px] font-black italic text-[#FFE36E]">{formatNumber(330)}</span>
              <span className="text-[11px] font-medium italic text-white/90">{t('readerPage.diamondsAwait')}</span>
            </div>
          </div>

          <i className="fa-solid fa-chevron-right shrink-0 text-[18px] text-white/70" />
        </button>

        <section className="max-h-[58vh] w-full overflow-y-auto rounded-t-[26px] bg-white pb-5 pt-4 shadow-[0_-18px_50px_rgba(0,0,0,0.18)] md:rounded-[26px]">
          <div className="px-5 text-center">
            <h2 className="text-[16px] font-semibold text-[#4B5563]">
  {t('readerPage.continueReading')}
</h2>
          </div>

          <div className="mt-5 overflow-hidden border-y border-[#E5E7EB]">
            <PackageButton option={singleOption} primary />
            <PackageButton option={displayMultiOption} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 px-5">
  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
    <span>{t('readerPage.myDiamonds')}</span>
    <span className="font-black text-[#667085]">{formatNumber(diamondBalance)}</span>
  </div>

  <div className="relative flex items-center gap-2">
    <button
      type="button"
      onClick={() => setShowAutoHint((value) => !value)}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D6DAE2] bg-white text-[11px] font-black text-[#A0A6B0] shadow-sm active:scale-95"
      aria-label={t('readerPage.autoUnlockInfo')}
    >
      ?
    </button>

    {showAutoHint ? (
      <button
        type="button"
        onClick={() => setShowAutoHint(false)}
        className="absolute bottom-10 right-0 z-20 w-[260px] rounded-[16px] bg-[#111827] px-4 py-3 text-left text-[11px] font-bold leading-5 text-white shadow-xl"
      >
        {t('readerPage.autoUnlockHelp')}
      </button>
    ) : null}

    <button
      type="button"
      onClick={() => setAutoUnlock((value) => !value)}
      className="flex items-center gap-2"
    >
      <span className="text-[12px] font-bold text-[#9CA3AF]">
  {t('readerPage.autoUnlock')}
</span>

      <span className={`relative h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
        autoUnlock
          ? 'bg-[#111827] shadow-[0_6px_16px_rgba(17,24,39,0.28)]'
          : 'bg-[#D1D6DE] shadow-inner'
      }`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
          autoUnlock ? 'left-[26px]' : 'left-1'
        }`} />
      </span>
    </button>
  </div>
</div>

          {rewardedAdsEnabled ? (
            <div className="mt-4 px-5">
              <button
                type="button"
                onClick={onRewardedUnlock}
                disabled={unlocking || !adCanAccess}
                className="flex min-h-[58px] w-full items-center justify-between gap-3 rounded-[16px] border border-[#E5E7EB] bg-white px-4 py-3 text-left active:scale-[0.99] disabled:opacity-55"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                    <i className="fa-solid fa-play text-[14px] text-[#0B5CFF]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[#111827]">
                      {t('readerPage.watchAdUnlock')}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-[#667085]">
                      {t('readerPage.adUsage', { used: formatNumber(adUsedToday), limit: formatNumber(adDailyLimit) })}
                    </span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-[#111827] px-4 py-2 text-[11px] font-black text-white">
                  {adRemainingToday <= 0 ? t('readerPage.limitReached') : t('readerPage.watch')}
                </span>
              </button>
            </div>
          ) : null}

          {unlocking ? (
            <div className="mt-5 text-center text-[12px] font-black text-[#8D94A1]">
              {t('readerPage.unlocking')}
            </div>
          ) : null}
        </section>
        </div>
      </div>
    </div>
  )
}

function ReaderIconButton({ icon, label, onClick, className = '', disabled = false }) {

  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 shadow-none ring-0 outline-none transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SettingsLineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
      <path
        d="M8.5 4.5h7L20 12l-4.5 7h-7L4 12l4.5-7Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  )
}

function ProgressLineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" aria-hidden="true">
      <path d="M4 7h9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M17 7h3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="15" cy="7" r="2.2" stroke="currentColor" strokeWidth="2.1" />

      <path d="M4 17h3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M11 17h9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="9" cy="17" r="2.2" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  )
}

function ScrollSubscribePopup({ visible, storyId, readingProgress, subscribed, onSubscribe, onClose, theme = READER_THEMES.white }) {
  const { t } = useDisplayTranslation()
  const [expandedByUser, setExpandedByUser] = useState(false)
  const [actionState, setActionState] = useState('idle')
  const dismissTimerRef = useRef(null)
  const shouldCollapse = Number(readingProgress || 0) >= 85
  const collapsed =
    shouldCollapse &&
    !expandedByUser &&
    actionState === 'idle'

  useEffect(() => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }

    if (!visible) {
      setExpandedByUser(false)
      setActionState('idle')
      return
    }

    if (Number(readingProgress || 0) < 85) {
      setExpandedByUser(false)
    }
  }, [visible, readingProgress])

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        window.clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  const dismissAfterAnimation = (state, delay) => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
    }

    setActionState(state)

    dismissTimerRef.current = window.setTimeout(() => {
      onClose?.()
      setActionState('idle')
      dismissTimerRef.current = null
    }, delay)
  }

  const handleClose = () => {
    if (actionState !== 'idle') return
    dismissAfterAnimation('closing', 280)
  }

  const handleSubscribe = async () => {
    if (actionState !== 'idle') return

    const success = await onSubscribe?.()

    if (!success) return

    setExpandedByUser(true)
    dismissAfterAnimation('success', 1200)
  }

  if (!visible || !storyId || (subscribed && actionState === 'idle')) return null

  const bannerMotionClass =
    actionState === 'success'
      ? 'shadowSubscribeSuccess'
      : actionState === 'closing'
        ? 'shadowSubscribeClose'
        : ''

  if (collapsed) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-[calc(50vh+310px)] z-[96] -translate-y-1/2 px-3">
        <div className="pointer-events-auto ml-auto flex h-[62px] w-[calc(100vw-24px)] max-w-[430px] translate-x-[calc(100%-30px)] items-center gap-2 rounded-full bg-[#FFFFFF] px-3 shadow-[0_12px_34px_rgba(17,24,39,0.20)] transition-transform duration-300 ease-out">
          <button
            type="button"
            onClick={handleSubscribe}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95"
            aria-label={t('readerPage.showSubscribePopup')}
          >
            <i className="fa-regular fa-heart text-[13px] text-[#98a2b3]" />
          </button>

          <img
            src="/assets/Icons/Logo%20Shadow%203.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-[10px] object-contain"
            loading="lazy"
            decoding="async"
          />

          <div className="min-w-0 flex-1 text-[13px] font-bold leading-4 text-[#24201b]">
            {t('readerPage.subscribeFollow')}
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#ff3b5f] px-4 text-[12px] font-bold text-white active:scale-95"
          >
            <i className="fa-regular fa-heart text-[14px]" />
            <span>{t('readerPage.subscribe')}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes shadowSubscribeSuccess {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          18% {
            transform: translateY(-2px) scale(1.015);
            box-shadow: 0 14px 38px rgba(255, 59, 95, 0.22);
          }

          68% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
        }

        @keyframes shadowSubscribeClose {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateX(16px) scale(0.98);
          }
        }

        @keyframes shadowSubscribeButtonPop {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(0.92);
          }

          58% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes shadowSubscribeHeartFly {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35) rotate(0deg);
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--heart-x)),
                calc(-50% + var(--heart-y))
              )
              scale(0.92)
              rotate(var(--heart-r));
          }
        }

        .shadowSubscribeSuccess {
          animation:
            shadowSubscribeSuccess
            1.2s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowSubscribeClose {
          animation:
            shadowSubscribeClose
            .28s
            ease-out
            both;
        }

        .shadowSubscribeButtonPop {
          animation:
            shadowSubscribeButtonPop
            .52s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowSubscribeHeart {
          animation:
            shadowSubscribeHeartFly
            .86s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-x-0 top-[calc(50vh+310px)] z-[96] -translate-y-1/2 px-3">
        <div
          className={`pointer-events-auto mx-auto flex h-[62px] max-w-[430px] items-center gap-2 rounded-full bg-[#FFFFFF] px-3 shadow-[0_12px_34px_rgba(17,24,39,0.20)] ${bannerMotionClass}`}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={actionState !== 'idle'}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95 disabled:pointer-events-none"
            aria-label={t('readerPage.closeSubscribePopup')}
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>

          <img
            src="/assets/Icons/Logo%20Shadow%203.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-[10px] object-contain"
            loading="lazy"
            decoding="async"
          />

          <div className="min-w-0 flex-1 text-[13px] font-bold leading-4 text-[#24201b]">
            {actionState === 'success'
              ? t('readerPage.newEpisodesFirst')
              : t('readerPage.subscribeFollow')}
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={actionState !== 'idle'}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 overflow-visible rounded-full bg-[#ff3b5f] px-4 text-[12px] font-bold text-white active:scale-95 disabled:pointer-events-none ${
              actionState === 'success'
                ? 'shadowSubscribeButtonPop'
                : ''
            }`}
          >
            {actionState === 'success' ? (
              <>
                <i className="fa-solid fa-check text-[13px]" />
                <span>{t('readerPage.subscribed')}</span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[10px] text-[#ff3b5f]"
                  style={{
                    '--heart-x': '-34px',
                    '--heart-y': '-34px',
                    '--heart-r': '-18deg',
                    animationDelay: '20ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[8px] text-[#ff7891]"
                  style={{
                    '--heart-x': '-13px',
                    '--heart-y': '-44px',
                    '--heart-r': '14deg',
                    animationDelay: '90ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[9px] text-[#ff3b5f]"
                  style={{
                    '--heart-x': '18px',
                    '--heart-y': '-41px',
                    '--heart-r': '-10deg',
                    animationDelay: '150ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[7px] text-[#ff9aab]"
                  style={{
                    '--heart-x': '36px',
                    '--heart-y': '-27px',
                    '--heart-r': '20deg',
                    animationDelay: '220ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>
              </>
            ) : (
              <>
                <i className="fa-regular fa-heart text-[14px]" />
                <span>{t('readerPage.subscribe')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}


function ReaderBottomActionBar({
  visible,
  theme,
  subscribed,
  onSubscribe,
  story,
  episode,
  commentTotal: commentTotalOverride,
  readingProgress,
  previousEpisode,
  nextEpisode,
  onPrevious,
  onNext,
  showSubscribeOnDoubleTap,
  onOpenChapters,
  onOpenComments,
  onOpenSettings,
}) {
  const { t } = useDisplayTranslation()
  const [progressOpen, setProgressOpen] = useState(false)
  const [sideSubscribeState, setSideSubscribeState] = useState('idle')
  const sideSubscribeTimerRef = useRef(null)
  const safeProgress = Math.max(0, Math.min(100, Math.round(Number(readingProgress || 0))))
  const storyId = story?.id || story?.story_id || episode?.story_id || ''

  const fallbackCommentTotal = Number(
  episode?.total_comments ||
  episode?.comment_count ||
  episode?.comments_count ||
  0
)

  const commentTotal =
    commentTotalOverride === null ||
    commentTotalOverride === undefined
      ? fallbackCommentTotal
      : Math.max(
          0,
          Number(commentTotalOverride || 0)
        )

  useEffect(() => {
    if (sideSubscribeTimerRef.current) {
      window.clearTimeout(sideSubscribeTimerRef.current)
      sideSubscribeTimerRef.current = null
    }

    setSideSubscribeState('idle')

  }, [storyId])

  const handleSubscribeClick = async () => {
    if (sideSubscribeState !== 'idle') return

    const success = await onSubscribe?.()

    if (!success) return

    setSideSubscribeState('success')
  }

  useEffect(() => {
    return () => {
      if (sideSubscribeTimerRef.current) {
        window.clearTimeout(sideSubscribeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setProgressOpen(false)
  }, [episode?.id, episode?.episode_id])

  const commentBadge = commentTotal > 0 ? formatCompactNumber(commentTotal) : ''

  const FooterTab = ({ icon, iconNode, label, badge, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[54px] flex-1 flex-col items-center justify-center gap-1 active:scale-95"
    >
      <span className={`relative flex h-5 items-center justify-center ${theme.text}`}>
        {iconNode || <i className={`${icon} text-[16px]`} />}

        {badge ? (
          <span className={`absolute left-[20px] top-[-5px] text-[9px] font-normal ${theme.muted}`}>
            {badge}
          </span>
        ) : null}
      </span>

      <span className={`text-[11px] font-normal leading-none ${theme.muted}`}>
        {label}
      </span>
    </button>
  )

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-[95] px-0 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out md:bottom-4 md:px-4 ${
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+16px)]'
      }`}
    >
      <style>{`
  @keyframes shadowSideSubscribePop {
    0% { transform: scale(1); }
    28% { transform: scale(.91); }
    60% { transform: scale(1.07); }
    100% { transform: scale(1); }
  }

  @keyframes shadowSideSubscribeHide {
    0% { opacity: 1; transform: translateX(0) scale(1); }
    100% { opacity: 0; transform: translateX(22px) scale(.82); }
  }

  @keyframes shadowSideHeartFly {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(.3) rotate(0deg);
    }

    22% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform:
        translate(
          calc(-50% + var(--side-heart-x)),
          calc(-50% + var(--side-heart-y))
        )
        scale(.9)
        rotate(var(--side-heart-r));
    }
  }

  .shadowSideSubscribePop {
    animation:
      shadowSideSubscribePop
      .5s
      cubic-bezier(.22, 1, .36, 1)
      both;
  }

  .shadowSideSubscribeHide {
    animation:
      shadowSideSubscribeHide
      .28s
      ease-out
      both;
  }

  .shadowSideHeart {
    animation:
      shadowSideHeartFly
      .72s
      cubic-bezier(.22, 1, .36, 1)
      both;
  }
`}</style>

      {visible && showSubscribeOnDoubleTap && storyId && !subscribed ? (
        <button
  type="button"
  onClick={handleSubscribeClick}
  disabled={sideSubscribeState !== 'idle'}
  aria-label={t('readerPage.subscribeStory')}
  className={`pointer-events-auto absolute right-[-7px] z-[2] flex h-[58px] min-w-[84px] flex-col items-center justify-center overflow-visible rounded-l-[28px] rounded-r-none px-4 text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-colors duration-200 active:scale-95 disabled:pointer-events-none md:right-[-2px] ${
    sideSubscribeState === 'idle'
      ? 'bg-black/60'
      : 'bg-[#ff3b5f]'
  } ${
    sideSubscribeState === 'success'
      ? 'shadowSideSubscribePop'
      : sideSubscribeState === 'hiding'
        ? 'shadowSideSubscribeHide'
        : ''
  } ${progressOpen ? 'bottom-[132px]' : 'bottom-[84px]'}`}
>
  {sideSubscribeState === 'idle' ? (
    <>
      <i className="fa-regular fa-heart text-[20px]" />
      <span className="mt-1 text-[11px] font-normal leading-none">
        {t('readerPage.subscribe')}
      </span>
    </>
  ) : (
    <>
      <i className="fa-solid fa-heart text-[20px]" />
      <span className="mt-1 text-[10px] font-semibold leading-none">
        {t('readerPage.subscribed')}
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[9px] text-[#ff3b5f]"
        style={{
          '--side-heart-x': '-24px',
          '--side-heart-y': '-36px',
          '--side-heart-r': '-16deg',
          animationDelay: '20ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[7px] text-[#ff7891]"
        style={{
          '--side-heart-x': '0px',
          '--side-heart-y': '-43px',
          '--side-heart-r': '10deg',
          animationDelay: '90ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[8px] text-[#ff9aab]"
        style={{
          '--side-heart-x': '23px',
          '--side-heart-y': '-33px',
          '--side-heart-r': '18deg',
          animationDelay: '150ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>
    </>
  )}
</button>

      ) : null}

      <div className={`pointer-events-auto mx-auto max-w-3xl ${theme.card} md:rounded-[18px] md:border ${theme.border}`}>
        {progressOpen ? (
          <div className={`grid h-[48px] grid-cols-[58px_1fr_58px] items-center gap-3 border-b ${theme.border} px-4`}>
            {previousEpisode ? (
              <button
                type="button"
                onClick={onPrevious}
                className={`flex flex-col items-center justify-center gap-0.5 ${theme.muted} active:scale-95`}
              >
                <i className={`fa-solid fa-chevron-left text-[17px] ${theme.text}`} />
                <span className="text-[10px] font-normal leading-none">{t('readerPage.prev')}</span>
              </button>
            ) : (
              <div className="h-10 w-[58px]" />
            )}

            <div />

            {nextEpisode ? (
              <button
                type="button"
                onClick={onNext}
                className={`flex flex-col items-center justify-center gap-0.5 ${theme.muted} active:scale-95`}
              >
                <i className={`fa-solid fa-chevron-right text-[17px] ${theme.text}`} />
                <span className="text-[10px] font-normal leading-none">{t('readerPage.next')}</span>
              </button>
            ) : (
              <div className="h-10 w-[58px]" />
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-4 px-1 py-1">
          <FooterTab
            icon="fa-solid fa-list-ul"
            label={t('readerPage.episode')}
            onClick={onOpenChapters}
          />

          <FooterTab
            icon="fa-regular fa-comment"
            label={t('readerPage.comments')}
            badge={commentBadge}
            onClick={onOpenComments}
          />

          <FooterTab
            iconNode={<SettingsLineIcon />}
            label={t('readerPage.settings')}
            onClick={onOpenSettings}
          />

          <FooterTab
            iconNode={
              progressOpen ? (
                <i className="fa-solid fa-chevron-down text-[17px]" />
              ) : (
                <ProgressLineIcon />
              )
            }
            label={t('readerPage.progress')}
            badge={`${formatNumber(safeProgress)}%`}
            onClick={() => setProgressOpen((value) => !value)}
          />
        </div>
      </div>
    </div>
  )
}

function LoadingCard({ theme = READER_THEMES.white }) {
  return (
    <section className="px-1 pb-10 pt-2">
      <div className="animate-pulse">
        <div className={`mb-7 border-b ${theme.border} pb-6`}>
          <div className={`h-5 w-28 rounded-full ${theme.soft}`} />
          <div className={`mt-3 h-3 w-36 rounded-full ${theme.soft}`} />
        </div>

        <div className="space-y-4">
          <div className={`h-4 w-full rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[92%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[96%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[78%] rounded-full ${theme.soft}`} />

          <div className="h-3" />

          <div className={`h-4 w-full rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[88%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[94%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[70%] rounded-full ${theme.soft}`} />

          <div className="h-3" />

          <div className={`h-4 w-[98%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[84%] rounded-full ${theme.soft}`} />
          <div className={`h-4 w-[91%] rounded-full ${theme.soft}`} />
        </div>
      </div>
    </section>
  )
}


function AdultWarningModal({ open, onCancel, onContinue, theme = READER_THEMES.white }) {
  const { t } = useDisplayTranslation()
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adult-warning-title"
    >
      <div className={`w-full max-w-[380px] rounded-[26px] ${theme.card} px-6 pb-6 pt-7 text-center shadow-2xl`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f2] text-[#FE526E]">
          <i className="fa-solid fa-triangle-exclamation text-[26px]" />
        </div>

        <h2
          id="adult-warning-title"
          className={`mt-4 text-[20px] font-bold ${theme.text}`}
        >
          {t('readerPage.adultWarningTitle')}
        </h2>

        <p className={`mt-3 text-[13px] font-normal leading-6 ${theme.muted}`}>
          {t('readerPage.adultWarningText')}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="h-12 w-full rounded-full bg-[#FE526E] text-[14px] font-medium text-white transition active:scale-[0.98]"
          >
            {t('readerPage.continueReadingButton')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={`h-12 w-full rounded-full border ${theme.border} ${theme.card} text-[14px] font-medium ${theme.text} transition active:scale-[0.98]`}
          >
            {t('readerPage.goBack')}
          </button>
        </div>
      </div>
    </div>
  )
}

function EpisodeListDrawer({ open, onClose, story, episodes, currentEpisodeId, storyId, navigate, theme }) {
  const { t } = useDisplayTranslation()
  const [newestFirst, setNewestFirst] = useState(false)
  useEffect(() => {
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.style.overflow = open ? 'hidden' : ''
  return () => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, [open])

  if (!open) return null

  const sortedEpisodes = [...episodes].sort((a, b) => {
    const first = Number(a.episode_number || 0)
    const second = Number(b.episode_number || 0)
    return newestFirst ? second - first : first - second
  })

  const readEpisodeIds = getReviewReadEpisodes(storyId).map((id) => String(id))
  const cover = story?.cover_url || story?.thumbnail_url || story?.image_url || ''
  const title = story?.title || story?.name || t('readerPage.untitledStory')
  const authorName =
  story?.author_page?.page_name ||
  story?.authorPage?.page_name ||
  story?.author_name ||
  story?.author?.name ||
  story?.page_name ||
  ''

  const rawStatus = String(story?.status || story?.publication_status || '').toLowerCase()
  const statusText =
    rawStatus.includes('complete') || rawStatus.includes('completed')
      ? t('readerPage.completed')
      : rawStatus.includes('new')
        ? t('readerPage.new')
        : t('readerPage.ongoing')

  return (
    <div className="fixed inset-0 z-[140]">
      <button
        type="button"
        aria-label={t('readerPage.closeEpisodeList')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section
          className={`absolute bottom-0 left-0 top-0 flex w-[77vw] max-w-[360px] flex-col overflow-hidden ${theme.card} shadow-2xl transition-transform duration-300 ease-out`}

      >
        <div className={`shrink-0 border-b ${theme.border} ${theme.card}`}>
          <div className="flex items-center gap-3 px-4 py-5">
            {cover ? (
              <img
  src={cover}
  alt=""
  className="h-[66px] w-[50px] shrink-0 rounded-[7px] object-cover"
  loading="lazy"
  decoding="async"
/>
            ) : (
              <div className={`h-[66px] w-[50px] shrink-0 rounded-[7px] ${theme.soft}`} />
            )}

            <div className="min-w-0 flex-1">
  <h3 className={`line-clamp-3 break-words text-[18px] font-bold leading-[1.65] ${theme.text}`}>
    {title}
  </h3>

  {authorName ? (
    <p className={`mt-1 line-clamp-1 text-[11.5px] font-normal leading-5 ${theme.muted}`}>
      {t('readerPage.byAuthor', { author: authorName })}
    </p>
  ) : null}
</div>
          </div>

          <div className={`flex h-14 items-center justify-between border-t ${theme.border} px-4`}>
            <div className={`text-[15px] font-semibold ${theme.text}`}>
              {t('readerPage.episodesStatus', { count: formatNumber(episodes.length), status: statusText })}
            </div>

            <button
              type="button"
              onClick={() => setNewestFirst((current) => !current)}
              className="flex h-9 w-9 items-center justify-center active:scale-95"
              aria-label={t('readerPage.reverseEpisodeOrder')}
            >
              <img src="/assets/Icons/Revers.svg" alt={t('readerPage.reverse')} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-5">
          {sortedEpisodes.map((item) => {
            const active = String(item.id) === String(currentEpisodeId)
            const read = readEpisodeIds.includes(String(item.id))
            const locked = Boolean(
              item.is_locked ||
              item.locked ||
              item.access_locked ||
              item.requires_unlock ||
              item.is_premium ||
              item.lock_type
            )

const titleColor = active ? theme.text : theme.muted

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/story/${storyId}/episode/${item.id}`, {
                    state: {
                      storyPreview: story,
                      episodePreview: item,
                      returnSource: location.state?.returnSource || 'readerEpisodeList',
                    },
                  })
                }}
                className={`relative flex min-h-[64px] w-full items-center gap-3 px-5 text-left transition active:scale-[0.995] ${
  active ? theme.soft : 'bg-transparent'
}`}
              >
                <span className={`line-clamp-1 min-w-0 flex-1 text-[16px] font-semibold ${titleColor}`}>
  {item.title || t('readerPage.episodeNumber', { number: formatNumber(item.episode_number || '') })}
</span>

{locked ? (
  <i className={`fa-solid fa-lock shrink-0 text-[12px] ${theme.muted}`} />
) : null}

               
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SettingSection({ title, children, theme = READER_THEMES.white }) {
  return (
    <section className={`border-t ${theme.border} px-2 py-3 first:border-t-0`}>
      <h3 className={`mb-3 text-[14px] font-bold ${theme.text}`}>{title}</h3>
      {children}
    </section>
  )
}

function ChoiceButton({ active, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[16px] px-3 py-3 text-[12px] font-extrabold transition active:scale-[0.98] ${
        active ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function FontSelectDrawer({ open, onClose, selectedFontKey, onSelect, theme = READER_THEMES.white }) {
  const { t } = useDisplayTranslation()
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    document.documentElement.style.overflow = open ? 'hidden' : ''

    if (open) setSearch('')

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const normalizedSearch = search.trim().toLowerCase()

  const groups = FONT_OPTIONS.reduce((result, font) => {
    const searchableText = `${font.label} ${font.group}`.toLowerCase()

    if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
      return result
    }

    if (!result[font.group]) result[font.group] = []
    result[font.group].push(font)
    return result
  }, {})

  const hasFonts = Object.keys(groups).length > 0

  return (
    <div className="fixed inset-0 z-[170]">
      <button
        type="button"
        aria-label={t('readerPage.closeFontList')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className={`absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-hidden rounded-t-[30px] ${theme.card} shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[420px] md:rounded-[26px]`}>
        <div className={`shrink-0 ${theme.card} px-4 pb-3 pt-4`}>
          <div className={`flex h-12 items-center rounded-full ${theme.soft} px-4`}>
            <i className={`fa-solid fa-magnifying-glass mr-3 ${theme.muted}`} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('readerPage.searchFont')}
              className={`min-w-0 flex-1 bg-transparent text-[14px] ${theme.text} outline-none placeholder:opacity-60`}
            />
          </div>
        </div>

        <div className="max-h-[66vh] overflow-y-auto px-4 pb-4">
          {hasFonts ? (
            Object.entries(groups).map(([group, fonts]) => (
              <section key={group} className="mb-5 last:mb-0">
                <h3 className={`mb-2 text-[12px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>
                  {group === 'Khmer Fonts' ? t('readerPage.khmerFonts') : group === 'Other Fonts' ? t('readerPage.otherFonts') : group}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {fonts.map((font) => {
                    const active = font.key === selectedFontKey

                    return (
                      <button
                        key={font.key}
                        type="button"
                        onClick={() => {
                          onSelect(font.key)
                          onClose()
                        }}
                        className={`flex h-[76px] items-center justify-center rounded-[12px] px-3 text-center text-[14px] font-bold transition active:scale-[0.98] ${
                          active
                            ? `border-2 border-[#FE526E] ${theme.soft} text-[#FE526E]`
                            : `border border-transparent ${theme.soft} ${theme.text}`
                        }`}
                      >
                        <span
                          className="line-clamp-2"
                          style={{
                            fontFamily: font.family,
                            fontWeight: 700,
                          }}
                        >
                          {font.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className={`flex h-28 items-center justify-center text-[13px] font-semibold ${theme.muted}`}>
              {t('readerPage.noFonts')}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ResetSettingsModal({ open, onCancel, onConfirm, theme = READER_THEMES.white }) {
  const { t } = useDisplayTranslation()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button type="button" aria-label={t('readerPage.cancelReset')} onClick={onCancel} className="absolute inset-0" />

      <section className={`relative w-full max-w-[430px] rounded-[30px] ${theme.card} p-5 text-center shadow-2xl`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-solid fa-rotate-left text-[24px]" />
        </div>

        <h2 className={`mt-4 text-[20px] font-black ${theme.text}`}>{t('readerPage.resetTitle')}</h2>
        <p className={`mt-2 text-[13px] font-semibold leading-6 ${theme.muted}`}>
          {t('readerPage.resetDescription')}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`h-12 rounded-full border ${theme.border} ${theme.card} text-[13px] font-extrabold ${theme.text}`}
          >
            {t('readerPage.cancel')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#e5484d] text-[13px] font-extrabold text-white"
          >
            {t('readerPage.reset')}
          </button>
        </div>
      </section>
    </div>
  )
}

function ChatStoryReadingPreferences({
  readMode,
  setReadMode,
  autoTapSpeed,
  setAutoTapSpeed,
  theme = READER_THEMES.white,
}) {
  const { t } = useDisplayTranslation()
  const selectedSpeed =
    CHAT_STORY_AUTO_TAP_SPEEDS[
      autoTapSpeed
    ] ||
    CHAT_STORY_AUTO_TAP_SPEEDS[
      DEFAULT_CHAT_STORY_AUTO_TAP_SPEED
    ]

  return (
    <SettingSection title={t('readerPage.readingPreferences')} theme={theme}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            setReadMode('manual')
          }
          className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
            readMode === 'manual'
              ? theme.button
              : `${theme.soft} ${theme.text}`
          }`}
        >
          {t('readerPage.manualTap')}
        </button>

        <button
          type="button"
          onClick={() =>
            setReadMode('auto')
          }
          className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
            readMode === 'auto'
              ? theme.button
              : `${theme.soft} ${theme.text}`
          }`}
        >
          {t('readerPage.autoTap')}
        </button>
      </div>

      {readMode === 'auto' ? (
        <div className={`mt-5 rounded-[22px] ${theme.soft} p-3`}>
          <div className="mb-3">
            <h4 className={`text-[13px] font-bold ${theme.text}`}>
              {t('readerPage.autoTapSpeed')}
            </h4>

            <p className={`mt-0.5 text-[11px] font-bold ${theme.muted}`}>
              {t('readerPage.autoTapHelp')}
            </p>
          </div>

          <div className={`mb-2 text-center text-[12px] font-black ${theme.muted}`}>
            {t(`readerPage.${['verySlow', 'slow', 'normal', 'fast', 'veryFast'][autoTapSpeed] || 'normal'}`)}
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/assets/Icons/Turtle.svg"
              alt={t('readerPage.slow')}
              className="h-6 w-6 shrink-0"
            />

            <input
              type="range"
              min="0"
              max={
                CHAT_STORY_AUTO_TAP_SPEEDS.length -
                1
              }
              step="1"
              value={autoTapSpeed}
              onChange={(event) =>
                setAutoTapSpeed(
                  Number(event.target.value)
                )
              }
              className="w-full accent-[#111827]"
            />

            <img
              src="/assets/Icons/Rabbit.svg"
              alt={t('readerPage.fast')}
              className="h-6 w-6 shrink-0"
            />
          </div>
        </div>
      ) : (
        <div className={`mt-5 rounded-[18px] ${theme.soft} px-4 py-4 text-[11px] font-medium leading-5 ${theme.muted}`}>
          {t('readerPage.manualTapHelp')}
        </div>
      )}
    </SettingSection>
  )
}

function ReaderSettingsDrawer({
  open,
  onClose,
  isChatStory,
  chatStoryReadMode,
  setChatStoryReadMode,
  chatStoryAutoTapSpeed,
  setChatStoryAutoTapSpeed,
  themeName,
  setThemeName,
  fontSizeIndex,
  setFontSizeIndex,
  fontKey,
  setFontKey,
  selectedFont,
  brightness,
  setBrightness,
  lineSpacing,
  setLineSpacing,
  readingMode,
  setReadingMode,
  autoScrollEnabled,
  setAutoScrollEnabled,
  autoScrollSpeed,
  setAutoScrollSpeed,
  onOpenFontList,
  onOpenReset,
}) {
  const { t } = useDisplayTranslation()
  const readerTheme = READER_THEMES[themeName] || READER_THEMES.white
  const fontSizePx = FONT_SIZE_LEVELS[fontSizeIndex] || FONT_SIZE_LEVELS[DEFAULT_FONT_SIZE_INDEX]
  const lineSpacingOrder = ['compact', 'normal', 'comfort']
  const lineSpacingValues = {
    compact: '1.3',
    normal: '1.5',
    comfort: '1.8',
  }
  const lineSpacingIndex = Math.max(0, lineSpacingOrder.indexOf(lineSpacing))
  const lineSpacingValue = lineSpacingValues[lineSpacing] || lineSpacingValues.comfort
  const [moreSettingsOpen, setMoreSettingsOpen] = useState(false)

  const decreaseFont = () => {
    setFontSizeIndex((current) => Math.max(0, current - 1))
  }

  const increaseFont = () => {
    setFontSizeIndex((current) => Math.min(FONT_SIZE_LEVELS.length - 1, current + 1))
  }

  const decreaseLineSpacing = () => {
    setLineSpacing(lineSpacingOrder[Math.max(0, lineSpacingIndex - 1)] || 'compact')
  }

  const increaseLineSpacing = () => {
    setLineSpacing(lineSpacingOrder[Math.min(lineSpacingOrder.length - 1, lineSpacingIndex + 1)] || 'comfort')
  }

  const dragStartYRef = useRef(0)
const dragCurrentYRef = useRef(0)

const handleDragStart = (event) => {
  dragStartYRef.current = event.touches?.[0]?.clientY || event.clientY || 0
  dragCurrentYRef.current = dragStartYRef.current
}

const handleDragMove = (event) => {
  dragCurrentYRef.current = event.touches?.[0]?.clientY || event.clientY || dragCurrentYRef.current
}

const handleDragEnd = () => {
  if (dragCurrentYRef.current - dragStartYRef.current > 70) {
    onClose()
  }

  dragStartYRef.current = 0
  dragCurrentYRef.current = 0
}

  const handleAutoScrollToggle = () => {
    setAutoScrollEnabled((current) => {
      const next = !current
      if (next) onClose()
      return next
    })
  }

  if (!open) return null

  if (moreSettingsOpen) {
    return (
      <div className={`fixed inset-0 z-[146] ${readerTheme.page}`}>
        <div className={`sticky top-0 z-10 flex h-14 items-center justify-between border-b ${readerTheme.border} ${readerTheme.card} px-4`}>
          <button
  type="button"
  onClick={() => setMoreSettingsOpen(false)}
  className={`flex h-10 w-10 items-center justify-center bg-transparent ${readerTheme.text} active:scale-95`}
  aria-label={t('readerPage.backReaderSettings')}
>
  <i className="fa-solid fa-chevron-left text-[14px]" />
</button>

          <h2 className={`text-[15px] font-bold ${readerTheme.text}`}>{t('readerPage.moreSetting')}</h2>

          <button
  type="button"
  onClick={onClose}
  className={`flex h-10 w-10 items-center justify-center bg-transparent ${readerTheme.text} active:scale-95`}
  aria-label={t('readerPage.closeReaderSettings')}
>
  <i className="fa-solid fa-xmark text-[15px]" />
</button>
        </div>

        <div className="mx-auto max-w-[520px] px-4 py-5">
          {isChatStory ? (
            <ChatStoryReadingPreferences
              readMode={chatStoryReadMode}
              setReadMode={setChatStoryReadMode}
              autoTapSpeed={chatStoryAutoTapSpeed}
              setAutoTapSpeed={setChatStoryAutoTapSpeed}
              theme={readerTheme}
            />
          ) : (
            <SettingSection title={t('readerPage.readingPreferences')} theme={readerTheme}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReadingMode('paging')
                    setAutoScrollEnabled(false)
                  }}
                  className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
                    readingMode === 'paging'
                      ? readerTheme.button
                      : `${readerTheme.soft} ${readerTheme.text}`
                  }`}
                >
                  {t('readerPage.paging')}
                </button>

                <button
                  type="button"
                  onClick={() => setReadingMode('scroll')}
                  className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
                    readingMode === 'scroll'
                      ? readerTheme.button
                      : `${readerTheme.soft} ${readerTheme.text}`
                  }`}
                >
                  {t('readerPage.scrolling')}
                </button>
              </div>

              {readingMode === 'scroll' ? (
                <div className={`mt-5 rounded-[22px] ${readerTheme.soft} p-3`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className={`text-[13px] font-bold ${readerTheme.text}`}>
                        {t('readerPage.autoScroll')}
                      </h4>
                      <p className={`mt-0.5 text-[11px] font-bold ${readerTheme.muted}`}>
                        {t('readerPage.scrollingOnly')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoScrollToggle}
                      className={`h-9 rounded-full px-4 text-[11px] font-normal active:scale-[0.995] ${
                        autoScrollEnabled
                          ? 'bg-[#e5484d] text-white'
                          : 'bg-[#111827] text-white'
                      }`}
                    >
                      {autoScrollEnabled ? t('readerPage.turnOff') : t('readerPage.turnOn')}
                    </button>
                  </div>

                  <div>
                    <div className={`mb-2 flex items-center justify-center text-[12px] font-black ${readerTheme.muted}`}>
                      {t(`readerPage.${['verySlow', 'slow', 'normal', 'fast', 'veryFast'][autoScrollSpeed] || 'slow'}`)}
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/Icons/Turtle.svg"
                        alt={t('readerPage.slow')}
                        className="h-6 w-6 shrink-0"
                      />

                      <input
                        type="range"
                        min="0"
                        max={AUTO_SCROLL_SPEEDS.length - 1}
                        step="1"
                        value={autoScrollSpeed}
                        onChange={(event) =>
                          setAutoScrollSpeed(Number(event.target.value))
                        }
                        className="w-full accent-[#111827]"
                      />

                      <img
                        src="/assets/Icons/Rabbit.svg"
                        alt={t('readerPage.fast')}
                        className="h-6 w-6 shrink-0"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </SettingSection>
          )}

          <section className="px-2 pt-1">
            <button
              type="button"
              onClick={onOpenReset}
              className="h-12 w-full rounded-full border border-[#f0b8b8] bg-[#fff1f1] text-[13px] font-normal text-[#e5484d] active:scale-[0.99]"
            >
              {t('readerPage.resetSettings')}
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[145]">
      <button
        type="button"
        aria-label={t('readerPage.closeReaderSettings')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

     <section
  className={`absolute bottom-0 left-0 right-0 rounded-t-[30px] ${readerTheme.card} shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[420px] md:rounded-[26px]`}
  onTouchStart={handleDragStart}
  onTouchMove={handleDragMove}
  onTouchEnd={handleDragEnd}
  onMouseDown={handleDragStart}
  onMouseMove={handleDragMove}
  onMouseUp={handleDragEnd}
>

        <div className="px-3 pt-2 pb-6">
          <SettingSection title={t('readerPage.brightness')} theme={readerTheme}>
            <div className="flex items-center gap-3">
              <i className={`fa-regular fa-sun text-[18px] ${readerTheme.text}`} />
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                className="w-full accent-[#111827]"
              />
              <span className={`w-10 text-right text-[12px] font-extrabold ${readerTheme.muted}`}>{formatNumber(brightness)}%</span>
            </div>
          </SettingSection>

          <SettingSection title={t('readerPage.fontSpacing')} theme={readerTheme}>
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-[20px] ${readerTheme.soft} p-2.5`}>
                <div className={`mb-2 text-[11px] font-black ${readerTheme.muted}`}>{t('readerPage.fontSize')}</div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseFont}
                    disabled={fontSizeIndex <= 0}
                    className={`flex h-10 items-center justify-center rounded-[15px] ${readerTheme.card} text-[13px] font-bold ${readerTheme.text} active:scale-[0.98] disabled:opacity-40`}
                    aria-label={t('readerPage.decreaseFontSize')}
                  >
                    A<sup className="-mt-2 text-[10px]">−</sup>
                  </button>

                  <div className={`min-w-[34px] text-center text-[12px] font-bold ${readerTheme.muted}`}>
  {formatNumber(fontSizePx)}
</div>

                  <button
                    type="button"
                    onClick={increaseFont}
                    disabled={fontSizeIndex >= FONT_SIZE_LEVELS.length - 1}
                    className={`flex h-10 items-center justify-center rounded-[15px] ${readerTheme.card} text-[14px] font-black ${readerTheme.text} active:scale-[0.98] disabled:opacity-40`}
                    aria-label={t('readerPage.increaseFontSize')}
                  >
                    A<sup className="-mt-2 text-[10px]">+</sup>
                  </button>
                </div>
              </div>

              <div className={`rounded-[20px] ${readerTheme.soft} p-2.5`}>
                <div className={`mb-2 text-[11px] font-black ${readerTheme.muted}`}>{t('readerPage.lineSpacing')}</div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseLineSpacing}
                    disabled={lineSpacingIndex <= 0}
                    className={`flex h-10 items-center justify-center rounded-[15px] ${readerTheme.card} ${readerTheme.text} active:scale-[0.98] disabled:opacity-40`}
                    aria-label={t('readerPage.decreaseLineSpacing')}
                  >
                    <i className="fa-solid fa-text-height text-[12px]" />
                   <i className="fa-solid fa-plus ml-1 text-[9px]" />
                  </button>

                  <div className={`min-w-[34px] text-center text-[12px] font-bold ${readerTheme.muted}`}>
  {formatNumber(lineSpacingValue)}
</div>

                  <button
                    type="button"
                    onClick={increaseLineSpacing}
                    disabled={lineSpacingIndex >= lineSpacingOrder.length - 1}
                    className={`flex h-10 items-center justify-center rounded-[15px] ${readerTheme.card} ${readerTheme.text} active:scale-[0.98] disabled:opacity-40`}
                    aria-label={t('readerPage.increaseLineSpacing')}
                  >
                    <i className="fa-solid fa-text-height text-[13px]" />
                    <i className="fa-solid fa-plus ml-1 text-[9px]" />
                  </button>
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection title={t('readerPage.pageColor')} theme={readerTheme}>
<div className="grid grid-cols-4 gap-2">
  {Object.entries(READER_THEMES).map(([key, item]) => (
    <button
      key={key}
      type="button"
      onClick={() => setThemeName(key)}
      className="flex items-center justify-center rounded-[12px] bg-transparent p-0 active:scale-[0.98]"
      aria-label={t(`readerPage.${key}`)}
    >
      <span
        className={`block h-9 w-full rounded-[12px] ${item.swatch} ${
          themeName === key
            ? 'ring-2 ring-[#f6c343]'
            : 'ring-0'
        }`}
      />
    </button>
  ))}
</div>
          </SettingSection>

          <SettingSection title={t('readerPage.fontStyle')} theme={readerTheme}>
            <button
              type="button"
              onClick={onOpenFontList}
              className={`flex h-14 w-full items-center justify-between rounded-[18px] ${readerTheme.soft} px-4 text-left active:scale-[0.995]`}
            >
              <span
  className={`line-clamp-1 text-[14px] font-bold ${readerTheme.text}`}
  style={{
    fontFamily: selectedFont.family,
    fontWeight: 700,
  }}
>
  {selectedFont.label}
</span>
              <i className={`fa-solid fa-chevron-right text-[12px] ${readerTheme.muted}`} />
            </button>
          </SettingSection>

         <section className="px-2 py-3 text-center">
  <button
  type="button"
  onClick={() => setMoreSettingsOpen(true)}
  className={`text-[13px] font-normal ${readerTheme.muted} active:scale-[0.98]`}
>
  {t('readerPage.moreSetting')}
</button>
</section>

          {moreSettingsOpen ? (
            <>
              <SettingSection title={t('readerPage.readingPreferences')} theme={readerTheme}>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setReadingMode('paging')
                  setAutoScrollEnabled(false)
                }}
                className={`h-12 rounded-[16px] text-[13px] font-black active:scale-[0.98] ${
                  readingMode === 'paging' ? readerTheme.button : `${readerTheme.soft} ${readerTheme.text}`
                }`}
              >
                {t('readerPage.paging')}
              </button>

              <button
                type="button"
                onClick={() => setReadingMode('scroll')}
                className={`h-12 rounded-[16px] text-[13px] font-black active:scale-[0.98] ${
                  readingMode === 'scroll' ? readerTheme.button : `${readerTheme.soft} ${readerTheme.text}`
                }`}
              >
                {t('readerPage.scrolling')}
              </button>
            </div>

            {readingMode === 'scroll' ? (
              <div className={`mt-5 rounded-[22px] ${readerTheme.soft} p-3`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className={`text-[13px] font-black ${readerTheme.text}`}>{t('readerPage.autoScroll')}</h4>
                    <p className={`mt-0.5 text-[11px] font-bold ${readerTheme.muted}`}>
                      {t('readerPage.scrollingOnly')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoScrollToggle}
                    className={`h-9 rounded-full px-4 text-[11px] font-black active:scale-[0.995] ${
                      autoScrollEnabled ? 'bg-[#e5484d] text-white' : 'bg-[#111827] text-white'
                    }`}
                  >
                    {autoScrollEnabled ? t('readerPage.turnOff') : t('readerPage.turnOn')}
                  </button>
                </div>

                <div>
                  <div className={`mb-2 flex items-center justify-center text-[12px] font-black ${readerTheme.muted}`}>
  {t(`readerPage.${['verySlow', 'slow', 'normal', 'fast', 'veryFast'][autoScrollSpeed] || 'slow'}`)}
</div>

<div className="flex items-center gap-3">
  <img src="/assets/Icons/Turtle.svg" alt={t('readerPage.slow')} className="h-6 w-6 shrink-0" />

  <input
    type="range"
    min="0"
    max={AUTO_SCROLL_SPEEDS.length - 1}
    step="1"
    value={autoScrollSpeed}
    onChange={(event) => setAutoScrollSpeed(Number(event.target.value))}
    className="w-full accent-[#111827]"
  />

  <img src="/assets/Icons/Rabbit.svg" alt={t('readerPage.fast')} className="h-6 w-6 shrink-0" />
</div>
                </div>
              </div>
            ) : null}
          </SettingSection>

              <section className="px-2 pt-1">
            <button
              type="button"
              onClick={onOpenReset}
              className="h-12 w-full rounded-full border border-[#f0b8b8] bg-[#fff1f1] text-[13px] font-black text-[#e5484d] active:scale-[0.99]"
            >
              {t('readerPage.resetSettings')}
            </button>
          </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function WebcomicReadingMissionCoin({
  visible,
  target,
  rewardAnimation,
  onClick,
}) {
  const { t } = useDisplayTranslation()
  if (!target && !rewardAnimation) return null

  const targetSeconds = Math.max(
    1,
    Number(target?.target_seconds || 1)
  )

  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(0, Number(target?.active_seconds || 0))
  )

  const progress =
    targetSeconds > 0
      ? activeSeconds / targetSeconds
      : 0

  const showingReward = Boolean(rewardAnimation)

  const ringRadius = 24
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - progress)

  return (
    <>
      <style>{`
        @keyframes shadowReadingCoinExit {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }

          20% {
            transform: translateY(-6px) rotate(-9deg) scale(1.06);
          }

          42% {
            transform: translateY(1px) rotate(8deg) scale(.98);
          }

          62% {
            transform: translateY(-3px) rotate(-5deg) scale(1.03);
          }

          78% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(.96);
          }

          100% {
            opacity: 0;
            transform: translateY(2px) rotate(0deg) scale(.68);
          }
        }

        @keyframes shadowReadingRewardEnter {
          0% {
            opacity: 0;
            transform: scale(.55) rotate(-7deg);
          }

          58% {
            opacity: 1;
            transform: scale(1.13) rotate(3deg);
          }

          78% {
            transform: scale(.97) rotate(-1deg);
          }

          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes shadowReadingNumberDrop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(.7);
          }

          58% {
            opacity: 1;
            transform: translateY(3px) scale(1.1);
          }

          78% {
            transform: translateY(-2px) scale(.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowReadingWhiteFlash {
          0% {
            opacity: 0;
            transform: scale(.82);
          }

          34% {
            opacity: .95;
            transform: scale(1.05);
          }

          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }

        @keyframes shadowReadingSparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }

          40% {
            opacity: 1;
            transform: scale(1.25);
          }

          100% {
            opacity: 0;
            transform: scale(.25);
          }
        }

        .shadowReadingCoinExit {
          animation:
            shadowReadingCoinExit
            .52s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowReadingRewardEnter {
          animation:
            shadowReadingRewardEnter
            .5s
            cubic-bezier(.22, 1, .36, 1)
            .34s
            both;
        }

        .shadowReadingNumberDrop {
          animation:
            shadowReadingNumberDrop
            .5s
            cubic-bezier(.22, 1, .36, 1)
            .52s
            both;
        }

        .shadowReadingWhiteFlash {
          animation:
            shadowReadingWhiteFlash
            .82s
            ease-out
            .38s
            both;
        }

        .shadowReadingSparkle {
          animation:
            shadowReadingSparkle
            .72s
            ease-out
            both;
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        aria-label={t('readerPage.openTaskCenter')}
        className={`fixed right-3 top-[74px] z-[92] flex h-[56px] w-[56px] items-center justify-center transition-all duration-300 active:scale-95 ${
          visible || showingReward
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-5 opacity-0'
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-[#8D939A] shadow-[0_8px_20px_rgba(17,24,39,0.22)]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >

          <circle
            cx="28"
            cy="28"
            r={ringRadius}
            fill="none"
            stroke="#D95A5A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={showingReward ? 0 : ringOffset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>

        {showingReward ? (
          <span
            key={rewardAnimation.key}
            className="absolute inset-0"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <img
                src="/assets/Icons/Shadow%20Coin.svg"
                alt=""
                className="shadowReadingCoinExit h-[38px] w-[38px] object-contain"
              />
            </span>

            <span className="shadowReadingWhiteFlash absolute -inset-1 rounded-full border-[3px] border-white shadow-[0_0_16px_rgba(255,255,255,0.92)]" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="shadowReadingRewardEnter relative flex h-[40px] w-[40px] items-center justify-center">
                <img
                  src="/assets/Icons/Shadow%20Coin%202.svg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />

                <span className="shadowReadingNumberDrop relative z-10 text-[17px] font-bold leading-none tracking-[-0.02em] text-white drop-shadow-[0_2px_2px_rgba(120,48,0,0.38)] [font-variant-numeric:tabular-nums]">
                  {formatNumber(rewardAnimation.coins)}
                </span>
              </span>
            </span>

            <span
              className="shadowReadingSparkle absolute -left-0.5 top-1 h-2 w-2 rounded-full bg-white"
              style={{ animationDelay: '.45s' }}
            />

            <span
              className="shadowReadingSparkle absolute right-0 top-2 h-2.5 w-2.5 rounded-full bg-[#FFD66B]"
              style={{ animationDelay: '.52s' }}
            />

            <span
              className="shadowReadingSparkle absolute bottom-1 left-2 h-1.5 w-1.5 rounded-full bg-[#FFE9A6]"
              style={{ animationDelay: '.59s' }}
            />

            <span
              className="shadowReadingSparkle absolute bottom-0 right-2 h-2 w-2 rounded-full bg-white"
              style={{ animationDelay: '.65s' }}
            />
          </span>
        ) : (
          <span className="relative z-10 flex h-[38px] w-[38px] items-center justify-center">
            <img
              src="/assets/Icons/Shadow%20Coin.svg"
              alt="Shadow Coin"
              className="h-[38px] w-[38px] object-contain"
            />
          </span>
        )}
      </button>
    </>
  )
}

function MangaEpisodeHeader({
  story,
  episode,
  theme,
  fontFamily,
  isFirstEpisode,
}) {
  const { t } = useDisplayTranslation()
  const [expanded, setExpanded] = useState(false)
  const genre = String(story?.main_genre || '').trim()
  const description = String(
    story?.description || ''
  ).trim()

  return (
    <div>
      {isFirstEpisode ? (
        <>
          <h1
            className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}
            style={{ fontFamily }}
          >
            {story?.title || t('readerPage.untitledStory')}
          </h1>

          {genre ? (
            <div
              className={`mt-2 text-[15px] font-medium ${theme.muted}`}
            >
              {genre}
            </div>
          ) : null}

          {description ? (
            <button
              type="button"
              onClick={() =>
                setExpanded((value) => !value)
              }
              className="mt-5 flex w-full items-end gap-3 text-left"
            >
              <p
                className={`min-w-0 flex-1 text-[15px] font-normal leading-7 ${theme.muted} ${
                  expanded ? '' : 'line-clamp-3'
                }`}
              >
                {description}
              </p>

              <i
                className={`fa-solid fa-chevron-${
                  expanded ? 'up' : 'down'
                } mb-2 shrink-0 text-[12px] ${theme.muted}`}
              />
            </button>
          ) : null}
        </>
      ) : null}

      <div
        className={`text-center ${
          isFirstEpisode ? 'mt-10' : 'mt-1'
        }`}
      >
        <h2
          className={`text-[18px] font-bold leading-7 ${theme.text}`}
          style={{ fontFamily }}
        >
          {episode?.title ||
            t('readerPage.episodeNumber', { number: formatNumber(episode?.episode_number || 1) })}
        </h2>
      </div>
    </div>
  )
}

function ContinuousEpisodeBlock({
  entry,
  index,
  active,
  contentOverride,
  theme,
  story,
  commentSummary,
  fontSizePx,
  fontFamily,
  lineSpacing,
  onRegister,
  onOpenComments,
  onOpenGift,
  onReachLocked,
  adultAccepted,
  showToBeContinued,
  isFirstEpisode,
}) {
  const { t } = useDisplayTranslation()
  const episode = entry?.episode || {}
  const isManga =
    String(
      story?.story_type ||
      episode?.story_type ||
      ''
    )
      .trim()
      .toLowerCase() === 'manga'

  const lockedSectionRef = useRef(null)
  const lockedOpenedRef = useRef(false)
  const adultBlocked = Boolean(
    episode?.is_adult && !adultAccepted
  )
  const adBlocked = Boolean(
    entry?.gate?.ad_policy?.show_read_ad &&
      entry?.gate?.advertisement?.image_url &&
      !entry?.adFinished
  )

  useEffect(() => {
    lockedOpenedRef.current = false
  }, [entry?.id])

  useEffect(() => {
    if (!entry?.locked || !lockedSectionRef.current) return undefined

    const node = lockedSectionRef.current
    const observer = new IntersectionObserver(
      ([result]) => {
        if (!result?.isIntersecting || lockedOpenedRef.current) return

        lockedOpenedRef.current = true
        onReachLocked?.(entry)
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [entry, onReachLocked])

  return (
    <section
      ref={(node) => {
        lockedSectionRef.current = node
        onRegister(entry.id, node)
      }}
      data-episode-id={entry.id}
      className={index > 0 && !entry.locked ? `border-t ${theme.border}` : ''}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: entry.locked ? '1px' : '900px',
      }}
    >
      {adultBlocked ? (
        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>
          <div className="text-center">
            <i className={`fa-solid fa-triangle-exclamation text-[26px] ${theme.muted}`} />
            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>
              {t('readerPage.adultConfirmRequired')}
            </p>
          </div>
        </div>
      ) : entry.locked ? (
        <div className="h-px w-full" aria-hidden="true" />
      ) : adBlocked ? (
        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>
          <div className="text-center">
            <i className={`fa-solid fa-play-circle text-[26px] ${theme.muted}`} />
            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>
              {t('readerPage.adRequired')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <section
  className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}
>
  {isManga ? (
  <>
    <div className="px-4 pb-5 pt-5 sm:px-8 sm:pt-8">
      <MangaEpisodeHeader
  story={story}
  episode={episode}
  theme={theme}
  fontFamily={fontFamily}
  isFirstEpisode={isFirstEpisode}
/>
    </div>

    <MangaEpisodePages
      pages={episode.pages}
      title={episode.title}
    />
  </>
) : (
  <>
    <div className="px-4 pb-5 pt-5 sm:px-8 sm:pt-8">
      <div className="mb-7">
        <h1
          className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}
          style={{ fontFamily }}
        >
          {episode.title || t('readerPage.untitledEpisode')}
        </h1>
      </div>
    </div>

    <article className="px-4 pb-5 sm:px-8 sm:pb-8">
      <ReadingText
  content={
    active && contentOverride != null
      ? contentOverride
      : episode.content
  }
  fontSizePx={fontSizePx}
        fontFamily={fontFamily}
        lineSpacing={lineSpacing}
        theme={theme}
      />

      <YouTubeEpisodeCard
  videoId={episode.youtube_video_id}
  title={episode.youtube_title}
  theme={theme}
/>
      
    </article>
  </>
)}
</section>

          {showToBeContinued ? <ToBeContinued theme={theme} /> : null}

{active ? (
  <div className="my-6 px-4">
    <GoogleAdBanner
  slot={import.meta.env.VITE_ADSENSE_READER_SLOT}
  placement="readerEnd"
/>
  </div>
) : null}

          <ReaderEndPanel
            story={story}
            episode={episode}
            active={active}
            commentSummary={commentSummary}
            onOpenComments={() => onOpenComments(episode)}
            onOpenGift={onOpenGift}
            theme={theme}
          />
        </>
      )}

      <div
        className={`h-px w-full ${active ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
    </section>
  )
}

export default function ReaderPage() {
  const { t } = useDisplayTranslation()
  const SHOW_READER_COVER = false
  const SHOW_READER_INFO = false
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId, episodeId: routeEpisodeId } = useParams()
  const [activeEpisodeId, setActiveEpisodeId] = useState(routeEpisodeId)
  const episodeId = activeEpisodeId || routeEpisodeId
  const expectedLocked = Boolean(location.state?.expectedLocked)
  const expectedStory = location.state?.storyPreview || null
  const expectedEpisode = location.state?.episodePreview || null
  const hasExpectedLockedPreview =
    expectedLocked &&
    Boolean(expectedEpisode)
  const autoScrollFrameRef = useRef(null)
  const qualifiedViewSentRef = useRef(false)
  const readingProgressRef = useRef(0)
  const lastReadingActivityRef = useRef(0)
  const readingActivityReadyAtRef = useRef(0)
  const previousReadingPageRef = useRef(null)
  const readingHeartbeatBusyRef = useRef(false)
  const weeklyReadingTrackedEpisodeRef = useRef('')
  const activeReadingTargetRef = useRef(null)
  const rewardAnimationTimerRef = useRef(null)
  const offlineReaderReleaseRef = useRef(null)
  const pendingViewedEpisodeRef = useRef(new Map())
  const [offlineAccessExpiresAt, setOfflineAccessExpiresAt] = useState(0)
  const [offlineAccessExpired, setOfflineAccessExpired] = useState(false)

  const [story, setStory] = useState(expectedStory)
  const [episode, setEpisode] = useState(expectedEpisode)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(!hasExpectedLockedPreview)
  const [message, setMessage] = useState('')
  const [lockedEpisode, setLockedEpisode] = useState(hasExpectedLockedPreview)
  const [continuousLockedEntry, setContinuousLockedEntry] = useState(null)
  const [unlockWallet, setUnlockWallet] = useState(null)
  const [unlockCoinAccess, setUnlockCoinAccess] = useState(null)
  const [unlockVoucherAccess, setUnlockVoucherAccess] = useState(null)
  const [unlockAdAccess, setUnlockAdAccess] = useState(null)
  const [rewardedAdsEnabled, setRewardedAdsEnabled] = useState(false)
  const [unlockPackageOptions, setUnlockPackageOptions] = useState([])
  const unlockStatusCacheRef = useRef(new Map())
  const unlockStatusRequestRef = useRef(new Map())

    useEffect(() => {
    const recheckOnReconnect = () => {
      if (offlineReaderReleaseRef.current && Number(episode?.episode_number || 0) > 5) window.location.reload()
    }
    window.addEventListener('online', recheckOnReconnect)
    return () => window.removeEventListener('online', recheckOnReconnect)
  }, [episode?.episode_number])
  
  useEffect(() => {
    if (!offlineAccessExpiresAt) return undefined

    const expireOfflineAccess = () => {
      if (Date.now() < offlineAccessExpiresAt) return
      offlineReaderReleaseRef.current?.()
      offlineReaderReleaseRef.current = null
      pendingViewedEpisodeRef.current.clear()
      setOfflineAccessExpiresAt(0)
      setOfflineAccessExpired(true)
      setStory(null)
      setEpisode(null)
      setEpisodes([])
      setLockedEpisode(true)
      setContinuousLockedEntry(null)
      setReaderAdPolicy(null)
      setReaderAdvertisement(null)
      setReaderAdFinished(false)
      setReaderGateReady(false)
      setAdultAccepted(false)
      setMessage(t('readerPage.offlineAccessExpired'))
    }

    const interval = window.setInterval(expireOfflineAccess, 1000)
    window.addEventListener('focus', expireOfflineAccess)
    document.addEventListener('visibilitychange', expireOfflineAccess)
    expireOfflineAccess()
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', expireOfflineAccess)
      document.removeEventListener('visibilitychange', expireOfflineAccess)
    }
  }, [offlineAccessExpiresAt, t])
  

  useEffect(() => {
  let ignore = false

  isRewardedEpisodeUnlockReady()
    .then((enabled) => {
      if (!ignore) setRewardedAdsEnabled(Boolean(enabled))
    })
    .catch(() => {
      if (!ignore) setRewardedAdsEnabled(false)
    })

  return () => {
    ignore = true
  }
}, [])

  const [unlockAutoUnlock, setUnlockAutoUnlock] = useState(false)
  const [unlockAutoHintOpen, setUnlockAutoHintOpen] = useState(false)
  const [unlockingEpisode, setUnlockingEpisode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(getInitialFontSizeIndex)
  const [fontKey, setFontKey] = useState(() => localStorage.getItem('reader_font_key') || 'noto-sans-khmer')
  const [themeName, setThemeName] = useState(
  () => localStorage.getItem('reader_theme') || 'white'
)
const [brightness, setBrightness] = useState(() => {
  const saved = Number(localStorage.getItem('reader_brightness'))
  return saved >= 60 && saved <= 100 ? saved : 100
})
  const [lineSpacing, setLineSpacing] = useState(() => localStorage.getItem('reader_line_spacing') || 'comfort')
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('reader_reading_mode') || 'scroll')
  const [autoScrollEnabled, setAutoScrollEnabled] =
  useState(false)

const [autoScrollSpeed, setAutoScrollSpeed] =
  useState(() =>
    Number(
      localStorage.getItem(
        'reader_auto_scroll_speed'
      ) || 1
    )
  )

const [
  chatStoryReadMode,
  setChatStoryReadMode,
] = useState(() =>
  localStorage.getItem(
    'chat_story_read_mode'
  ) === 'auto'
    ? 'auto'
    : 'manual'
)

const [
  chatStoryAutoTapSpeed,
  setChatStoryAutoTapSpeed,
] = useState(() => {
  const savedSpeed = Number(
    localStorage.getItem(
      'chat_story_auto_tap_speed'
    )
  )

  return Number.isInteger(savedSpeed) &&
    savedSpeed >= 0 &&
    savedSpeed <
      CHAT_STORY_AUTO_TAP_SPEEDS.length
    ? savedSpeed
    : DEFAULT_CHAT_STORY_AUTO_TAP_SPEED
})

const [adultWarningOpen, setAdultWarningOpen] =
  useState(false)
  const [adultAccepted, setAdultAccepted] = useState(false)
  const [adultConsentGranted, setAdultConsentGranted] = useState(false)
  const adultConsentGrantedRef = useRef(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [readerMoreOpen, setReaderMoreOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [fontSelectOpen, setFontSelectOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [episodeListOpen, setEpisodeListOpen] = useState(false)
  const [echoShareOpen, setEchoShareOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeReadingTarget, setActiveReadingTarget] = useState(null)
  const [readingRewardAnimation, setReadingRewardAnimation] = useState(null)
  const [readingRewardReloadKey, setReadingRewardReloadKey] = useState(0)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [reviewProgressSaved, setReviewProgressSaved] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentEpisode, setCommentEpisode] = useState(null)
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)
  const [chatStoryComplete, setChatStoryComplete] = useState(false)

useEffect(() => {
  const reopenKey = sessionStorage.getItem(
    'shadow_reopen_episode_comments'
  )

  if (reopenKey !== `${storyId}:${episodeId}`) return

  sessionStorage.removeItem('shadow_reopen_episode_comments')
  setCommentsOpen(true)
}, [storyId, episodeId])

useEffect(() => {
  if (sessionStorage.getItem('shadow_reopen_gift_popup') !== '1') return

  sessionStorage.removeItem('shadow_reopen_gift_popup')
  setGiftPopupOpen(true)
}, [])

  useEffect(() => {
  setChatStoryComplete(false)
}, [episodeId])
  
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [activeCommentSummary, setActiveCommentSummary] = useState({
    episodeId: '',
    hotComment: null,
    total: null,
  })
  const [bottomActionsVisible, setBottomActionsVisible] = useState(false)
  const [readerHeaderVisible, setReaderHeaderVisible] = useState(false)
  const [readerDoubleTapVisible, setReaderDoubleTapVisible] = useState(false)
  const [scrollSubscribePopupVisible, setScrollSubscribePopupVisible] = useState(false)
  const [scrollSubscribeDismissed, setScrollSubscribeDismissed] = useState(false)
const [subscribed, setSubscribed] = useState(false)
const [savingSubscribe, setSavingSubscribe] = useState(false)
  const [readerAdPolicy, setReaderAdPolicy] = useState(null)
  const [readerAdvertisement, setReaderAdvertisement] = useState(null)
  const [readerAdFinished, setReaderAdFinished] = useState(false)
  const [readerGateReady, setReaderGateReady] = useState(false)
  const lastScrollYRef = useRef(0)
  const lastReaderTapRef = useRef(0)

  useEffect(() => {
    activeReadingTargetRef.current = activeReadingTarget
  }, [activeReadingTarget])

  useEffect(() => {
    adultConsentGrantedRef.current = false
    setAdultConsentGranted(false)
  }, [storyId])

  const theme =
  READER_THEMES[themeName] ||
  READER_THEMES.white

const activeFont =
  FONT_OPTIONS.find(
    (font) => font.key === fontKey
  ) || FONT_OPTIONS[0]

const fontSizePx =
  FONT_SIZE_LEVELS[fontSizeIndex] ||
  FONT_SIZE_LEVELS[DEFAULT_FONT_SIZE_INDEX]

const brightnessOpacity = Math.max(
  0,
  Math.min(0.35, (100 - brightness) / 125)
)

const storyType = String(
  story?.story_type ||
  episode?.story_type ||
  ''
)
  .trim()
  .toLowerCase()

const isMangaStory = storyType === 'manga'

const isChatStory = useMemo(() => {
  if (storyType === 'chat_story') return true

  try {
    return (
      JSON.parse(String(episode?.content || ''))?.format ===
      'shadow_chat_story_v1'
    )
  } catch {
    return false
  }
}, [episode?.content, storyType])
useEffect(() => {
  if (isChatStory) {
    setAutoScrollEnabled(false)
  }
}, [isChatStory])
const effectiveReadingMode =
  isMangaStory || isChatStory
    ? 'scroll'
    : readingMode

const {
  activeLanguage: storyTranslationLanguage,
  displayContent: storyDisplayContent,
  loading: storyTranslationLoading,
  errorCode: storyTranslationErrorCode,
  translateTo: translateStoryTo,
} = useEpisodeTranslation({
  episodeId,
  content: episode?.content || '',
})

const pagingPages = useMemo(() => {
  if (isMangaStory || isChatStory) return []

  return createPagingPages(
  storyDisplayContent,
  lineSpacing,
  fontSizePx
)
}, [
  storyDisplayContent,
  fontSizePx,
  isChatStory,
  isMangaStory,
  lineSpacing,
])

  useReadingProgressSync({
  storyId,
  episodeId,
  readingPercent: readingProgress,
  enabled: Boolean(episode?.id) && String(episode.id) === String(episodeId) && !loading && !lockedEpisode && adultAccepted,
})

useEffect(() => {
  if (!storyId || !episode || loading || lockedEpisode || !adultAccepted) return
  void trackSectionQualifiedRead(storyId)
}, [adultAccepted, episode, loading, lockedEpisode, storyId])

  useEffect(() => {
    let ignore = false

    const targetEpisodeId = String(
      episodeId || ''
    ).trim()

    const fallbackTotal = Number(
      episode?.total_comments ||
      episode?.comment_count ||
      episode?.comments_count ||
      0
    )

    if (
      !targetEpisodeId ||
      loading ||
      lockedEpisode ||
      !adultAccepted
    ) {
      setActiveCommentSummary({
        episodeId: targetEpisodeId,
        hotComment: null,
        total: fallbackTotal,
      })
      return undefined
    }

    async function loadActiveCommentSummary() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/episode/${targetEpisodeId}?page=1&limit=20&sort=top`,
          {
            headers: readerAuthHeaders(),
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false ||
          ignore
        ) {
          return
        }

        const comments = Array.isArray(data.comments)
          ? data.comments
          : []

        const sorted = [...comments].sort(
          (first, second) => {
            const firstReplies = Array.isArray(first.replies)
              ? first.replies.length
              : 0
            const secondReplies = Array.isArray(second.replies)
              ? second.replies.length
              : 0
            const firstLikes = Number(
              first.likes || first.like_count || 0
            )
            const secondLikes = Number(
              second.likes || second.like_count || 0
            )

            return (
              secondReplies - firstReplies ||
              secondLikes - firstLikes
            )
          }
        )

        const total = Number(
          data.total ??
          data.total_comments ??
          data.count ??
          comments.length
        )

        setActiveCommentSummary({
          episodeId: targetEpisodeId,
          hotComment: sorted[0] || null,
          total: Number.isFinite(total)
            ? Math.max(0, total)
            : fallbackTotal,
        })
      } catch {
        if (!ignore) {
          setActiveCommentSummary({
            episodeId: targetEpisodeId,
            hotComment: null,
            total: fallbackTotal,
          })
        }
      }
    }

    loadActiveCommentSummary()

    return () => {
      ignore = true
    }
  }, [
    adultAccepted,
    commentRefreshKey,
    episodeId,
    loading,
    lockedEpisode,
  ])


useEffect(() => {
  let ignore = false

  async function loadSubscriptionStatus() {
    const token = getReaderToken()

    if (!token || !storyId) {
      setSubscribed(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/status/${storyId}`, {
  headers: readerAuthHeaders(),
  cache: 'no-store',
})
const data = await response.json().catch(() => ({}))

if (!response.ok || data.ok === false) throw new Error()
const isSubscribed = data.subscribed === true || data.subscribed === 1 || data.subscribed === 'true'
if (!ignore) setSubscribed(isSubscribed)
    } catch {
      if (!ignore) setSubscribed(false)
    }
  }

  loadSubscriptionStatus()

  return () => {
    ignore = true
  }
}, [storyId])

const handleSubscribe = async () => {
  const token = getReaderToken()

  if (!token) {
    navigate('/login')
    return false
  }

  if (subscribed) return true
  if (savingSubscribe) return false

  setSavingSubscribe(true)

  try {
    const response = await fetch(`${API_BASE_URL}/api/reader/subscriptions/${storyId}`, {
      method: 'POST',
      headers: readerAuthHeaders(),
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) throw new Error()

    setSubscribed(true)
    setScrollSubscribePopupVisible(false)
    setScrollSubscribeDismissed(true)
    return true
  } catch {
    return false
  } finally {
    setSavingSubscribe(false)
  }
}

  useEffect(() => {
    localStorage.setItem('reader_font_size_index', String(fontSizeIndex))
    localStorage.setItem('reader_font_size', fontSizeIndex <= 0 ? 'small' : fontSizeIndex >= 2 ? 'large' : 'normal')
  }, [fontSizeIndex])

useEffect(() => {
  setScrollSubscribePopupVisible(false)
  setScrollSubscribeDismissed(false)
}, [storyId, episodeId])

  useEffect(() => {
    localStorage.setItem('reader_font_key', fontKey)
  }, [fontKey])

  useEffect(() => {
    localStorage.setItem('reader_theme', themeName)
  }, [themeName])

  useEffect(() => {
    localStorage.setItem('reader_brightness', String(brightness))
  }, [brightness])

  useEffect(() => {
    localStorage.setItem('reader_line_spacing', lineSpacing)
  }, [lineSpacing])

  useEffect(() => {
    localStorage.setItem('reader_reading_mode', readingMode)
  }, [readingMode])

  useEffect(() => {
    localStorage.setItem('reader_auto_scroll_speed', String(autoScrollSpeed))
  }, [autoScrollSpeed])

      useEffect(() => {
  localStorage.setItem(
    'chat_story_read_mode',
    chatStoryReadMode
  )
}, [chatStoryReadMode])

useEffect(() => {
  localStorage.setItem(
    'chat_story_auto_tap_speed',
    String(chatStoryAutoTapSpeed)
  )
}, [chatStoryAutoTapSpeed])

  const handleReaderDoubleTap = (event) => {
    const target = event.target

    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[data-ignore-reader-tap="true"]')
    ) {
      return
    }

    const now = Date.now()
    const difference = now - lastReaderTapRef.current

    if (difference > 0 && difference < 320) {
      const nextVisible = !bottomActionsVisible

      setReaderHeaderVisible(nextVisible)
      setBottomActionsVisible(nextVisible)
      setReaderDoubleTapVisible(nextVisible)
     setScrollSubscribePopupVisible(false)

      lastReaderTapRef.current = 0
      return
    }

    lastReaderTapRef.current = now
  }

  useEffect(() => {
  if (effectiveReadingMode !== 'paging') return

  const savedPage = Number(
    localStorage.getItem(
      getPagingKey(storyId, episodeId)
    ) || 0
  )

  setCurrentPageIndex(
    Number.isFinite(savedPage) &&
    savedPage >= 0
      ? savedPage
      : 0
  )
}, [
  effectiveReadingMode,
  episodeId,
  storyId,
])

  useEffect(() => {
  if (effectiveReadingMode !== 'paging') return

  const maxPageIndex = Math.max(
    0,
    pagingPages.length - 1
  )

  setCurrentPageIndex((current) =>
    Math.min(
      Math.max(0, current),
      maxPageIndex
    )
  )
}, [
  effectiveReadingMode,
  pagingPages.length,
])

 useEffect(() => {
  if (effectiveReadingMode !== 'paging') return

  localStorage.setItem(
    getPagingKey(storyId, episodeId),
    String(currentPageIndex)
  )

  const totalPages = Math.max(
    1,
    pagingPages.length
  )

  const progress = Math.min(
    100,
    Math.max(
      0,
      ((currentPageIndex + 1) /
        totalPages) *
        100
    )
  )

  setReadingProgress(progress)
  readingProgressRef.current = progress
}, [
  currentPageIndex,
  effectiveReadingMode,
  episodeId,
  pagingPages.length,
  storyId,
])

  async function fetchUnlockStatus(targetEpisodeId, force = false) {
  const key = `${storyId}:${targetEpisodeId}`
  const cached = unlockStatusCacheRef.current.get(key)

  if (!force && cached && Date.now() - cached.savedAt < 30000) {
    return cached.data
  }

  if (!force && unlockStatusRequestRef.current.has(key)) {
    return unlockStatusRequestRef.current.get(key)
  }

  const request = fetch(
    `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/status`,
    {
      headers: readerAuthHeaders(),
      cache: 'no-store',
    }
  ).then(async (response) => {
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || t('readerPage.unlockStatusFailed'))
    }

    unlockStatusCacheRef.current.set(key, {
      data,
      savedAt: Date.now(),
    })

    return data
  })

  unlockStatusRequestRef.current.set(key, request)

  try {
    return await request
  } finally {
    unlockStatusRequestRef.current.delete(key)
  }
}

async function loadReaderAdStatus(targetEpisodeId = episodeId) {
  if (!isUsableRouteId(storyId) || !isUsableRouteId(targetEpisodeId)) {
    return { ad_policy: null, advertisement: null }
  }

  try {
    const data = await fetchUnlockStatus(targetEpisodeId)

    return {
      ad_policy: data?.ad_policy || null,
      advertisement: data?.advertisement || null,
    }
  } catch {
    return {
      ad_policy: null,
      advertisement: null,
    }
  }
}

async function loadContinuousEpisode(targetEpisode) {
  const targetId = String(
    targetEpisode?.id || targetEpisode?.episode_id || ''
  ).trim()

  if (!targetId) return null

  const fetchNext = () => fetch(
    `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${targetId}`,
    { headers: readerAuthHeaders(), cache: 'no-store' }
  )
  const manifest = readIOSManifest(storyId)
  const response = manifest
    ? await fetchIOSEpisode(storyId, targetId, manifest, fetchNext)
    : await fetchNext()

  const data = await response.json().catch(() => ({}))

  if (
    response.status === 423 ||
    data.code === 'EPISODE_LOCKED'
  ) {
    const unlockStatus = await fetchUnlockStatus(
      targetId
    ).catch(() => ({}))

    return {
      id: targetId,
      episode: data.episode || targetEpisode,
      locked: true,
      unlockStatus,
      gate: null,
      adFinished: true,
    }
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || t('readerPage.failedLoadEpisode'))
  }

  let gateVerified = true
  const gate = await loadReaderAdStatus(targetId).catch(() => {
    gateVerified = false
    return { ad_policy: null, advertisement: null }
  })
  const requiresAd = Boolean(
    gate?.ad_policy?.show_read_ad &&
      gate?.advertisement?.image_url
  )

  if (gateVerified && navigator.onLine !== false && response.ok && data.ok === true &&
    data.locked === false && !response.headers.get('X-Shadow-Reader-Cache')) {
    const cacheKey = `${storyId}:${targetId}`
    if (requiresAd) {
      pendingViewedEpisodeRef.current.set(cacheKey, data)
      if (pendingViewedEpisodeRef.current.size > 20) {
        pendingViewedEpisodeRef.current.delete(pendingViewedEpisodeRef.current.keys().next().value)
      }
    } else {
      rememberViewedEpisode({
        storyId, episodeId: targetId,
        storyType: String(data.story?.story_type || data.episode?.story_type || 'novel').toLowerCase(),
        response: data,
      }).catch(() => {})
    }
  }

  return {
    id: targetId,
    episode: data.episode || targetEpisode,
    locked: false,
    gate,
    adFinished: !requiresAd,
  }
}

const continuousReader = useContinuousEpisodeReader({
  enabled: !isChatStory && effectiveReadingMode === 'scroll',
  storyId,
  activeEpisodeId: episodeId,
  episodes,
  loadEpisode: loadContinuousEpisode,
  onActiveEntry: (entry) => {
    if (offlineAccessExpired || !entry?.episode) return

    setActiveEpisodeId(String(entry.id))
    setEpisode(entry.episode)
    setLockedEpisode(Boolean(entry.locked))
    setReadingProgress(0)
    readingProgressRef.current = 0
    qualifiedViewSentRef.current = false
    setReviewProgressSaved(false)
    setReaderAdPolicy(entry.gate?.ad_policy || null)
    setReaderAdvertisement(entry.gate?.advertisement || null)
    setReaderAdFinished(Boolean(entry.adFinished))
    setReaderGateReady(true)
    setReaderMoreOpen(false)
    setCommentEpisode(null)

    if (
      entry.locked &&
      Object.prototype.hasOwnProperty.call(entry, 'unlockStatus')
    ) {
      setContinuousLockedEntry(entry)
    } else if (!entry.locked) {
      setContinuousLockedEntry(null)
    }

    if (entry.locked) {
      const unlock = entry.unlockStatus || {}

      setUnlockWallet(unlock.wallet || null)
      setUnlockCoinAccess(
        unlock.coin_access || unlock.gem_access || null
      )
      setUnlockVoucherAccess(unlock.voucher_access || null)
      setUnlockAdAccess(unlock.ad_access || null)
      setUnlockPackageOptions(
        Array.isArray(unlock.package_options)
          ? unlock.package_options
          : []
      )
      setUnlockAutoUnlock(
        Boolean(unlock.wallet?.auto_unlock)
      )

      if (!unlock.wallet) {
        loadLockedUnlockStatus(entry.id).catch(() => {})
      }
    }

    if (entry.episode.is_adult && !adultConsentGrantedRef.current) {
      setAdultAccepted(false)
      setAdultWarningOpen(true)
    } else {
      setAdultAccepted(true)
      setAdultWarningOpen(false)
    }
  },
})

useEffect(() => {
    let ignore = false

    async function showOfflineFallback() {
      const offline = await loadOfflineReaderFallback({ storyId, episodeId: routeEpisodeId }).catch(() => null)
      if (!offline) return false
      if (ignore) {
        offline.release()
        return true
      }
      const grant = offline.payload.cache_access
      const temporary = grant?.private_access === true && String(grant.access_type || '').toLowerCase() === 'temporary'
      const expiresAt = temporary ? Date.parse(grant.expires_at) : 0
      if (temporary && (!Number.isFinite(expiresAt) || expiresAt <= Date.now())) {
        offline.release()
        return false
      }
      offlineReaderReleaseRef.current?.()
      offlineReaderReleaseRef.current = offline.release
      pendingViewedEpisodeRef.current.clear()
      setOfflineAccessExpiresAt(expiresAt)
      setStory(offline.payload.story)
      setEpisode(offline.payload.episode)
      setEpisodes(offline.episodes)
      setLockedEpisode(false)
      setReaderAdPolicy(null)
      setReaderAdvertisement(null)
      setReaderAdFinished(true)
      setReadingProgress(0)
      setReaderGateReady(true)
      setAdultAccepted(true)
      setAdultWarningOpen(false)
      setMessage('')
      setLoading(false)
      continuousReader.setInitialEntry({
        id: routeEpisodeId,
        episode: offline.payload.episode,
        locked: false,
        gate: null,
        adFinished: true,
      })
      window.scrollTo({ top: 0, behavior: 'auto' })
      return true
    }

    async function loadReader() {
      offlineReaderReleaseRef.current?.()
      offlineReaderReleaseRef.current = null
      pendingViewedEpisodeRef.current.clear()
      setOfflineAccessExpiresAt(0)
      setOfflineAccessExpired(false)
      setContinuousLockedEntry(null)
      setActiveEpisodeId(routeEpisodeId)
      setLoading(!hasExpectedLockedPreview)
      setMessage('')
      setAutoScrollEnabled(false)
      setReaderAdvertisement(null)
      setReaderAdFinished(false)
      setReaderGateReady(hasExpectedLockedPreview)
      setLockedEpisode(hasExpectedLockedPreview)

      if (hasExpectedLockedPreview) {
        setStory(expectedStory)
        setEpisode(expectedEpisode)
      }

      if (!isUsableRouteId(storyId) || !isUsableRouteId(routeEpisodeId)) {
        setLoading(false)
        setReaderGateReady(true)
        setMessage(t('readerPage.invalidReadingLink'))
        return
      }

      if (!getReaderToken()) {
        navigate('/login', {
          state: {
            returnTo: `/story/${storyId}/episode/${routeEpisodeId}`,
          },
        })
        return
      }

      if (navigator.onLine === false && await showOfflineFallback()) return

      const readTrace = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        onlineReported: navigator.onLine,
        serviceWorker: navigator.serviceWorker?.controller?.scriptURL || 'none',
        requests: {},
      }
      const savedIOSManifest = readIOSManifest(storyId)
      const iosManifest = savedIOSManifest?.episodes?.some((item) =>
        String(item.id) === String(routeEpisodeId)) ? savedIOSManifest : null
      const observedFetch = async (name, url) => {
        const started = Date.now()
        try {
          const nativeFetch = () => fetch(url, {
            headers: readerAuthHeaders(),
            cache: 'no-store',
          })
          const response = iosManifest && name === 'list'
            ? iosCacheResponse(iosManifest, 'MANIFEST-HIT')
            : iosManifest && name === 'episode'
              ? await fetchIOSEpisode(storyId, routeEpisodeId, iosManifest, nativeFetch)
              : await nativeFetch()
          readTrace.requests[name] = {
            outcome: 'HTTP_RESPONSE_RECEIVED',
            status: response.status,
            statusText: response.statusText,
            responseType: response.type,
            redirected: response.redirected,
            readerCache: response.headers.get('X-Shadow-Reader-Cache') || 'none/not exposed',
            requestId: response.headers.get('X-Request-Id') || response.headers.get('X-Shadow-Request-Id') || 'not exposed',
            elapsedMs: Date.now() - started,
          }
          return response
        } catch (error) {
          readTrace.requests[name] = {
            outcome: 'FETCH_REJECTED_NO_HTTP_RESPONSE',
            errorName: String(error?.name || 'Error'),
            errorMessage: String(error?.message || error),
            elapsedMs: Date.now() - started,
          }
          throw error
        }
      }

      try {
        const requests = await Promise.allSettled([
          observedFetch('episode', `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${routeEpisodeId}`),
          observedFetch('list', `${API_BASE_URL}/api/public/stories/${storyId}/episodes`),
        ])
        if (requests[0].status === 'rejected') throw requests[0].reason
        if (requests[1].status === 'rejected') throw requests[1].reason
        const episodeResponse = requests[0].value
        const episodesResponse = requests[1].value
        const episodeData = await episodeResponse.json().catch((error) => {
          readTrace.requests.episode.jsonError = String(error?.message || error)
          throw error
        })
        const episodesData = await episodesResponse.json().catch((error) => {
          readTrace.requests.list.jsonError = String(error?.message || error)
          throw error
        })
        readTrace.requests.episode.backendCode = String(episodeData?.code || 'none').slice(0, 100)
        readTrace.requests.list.backendCode = String(episodesData?.code || 'none').slice(0, 100)
        readTrace.requests.episode.backendOk = episodeData?.ok === false ? false : 'not false'
        readTrace.requests.list.backendOk = episodesData?.ok === false ? false : 'not false'

if (episodeData.code === 'ADULT_RESTRICTED' || episodesData.code === 'ADULT_RESTRICTED') {
  navigate(`/story/${storyId}`, { replace: true })
  return
}

if (!episodesResponse.ok || episodesData.ok === false) {
          throw Object.assign(new Error(episodesData.message || t('readerPage.episodeListNotFound')), { status: episodesResponse.status, code: episodesData.code })
  
        }

        const nextEpisodes = episodesData.episodes || []
        if (IOS_READER) {
          saveIOSManifest(storyId, episodesData)
          if (!iosManifest && episodeResponse.ok && episodeData.ok === true) {
            saveIOSEpisode(storyId, routeEpisodeId, episodeData, episodesData).catch(() => {})
          }
        }

        if (
          episodeResponse.status === 423 ||
          episodeData.code === 'EPISODE_LOCKED'
        ) {
          if (ignore) return

          setStory(episodeData.story || null)
          setEpisode(episodeData.episode || null)
          setEpisodes(nextEpisodes)
          setLockedEpisode(true)
          setReaderAdPolicy(null)
          setReaderAdvertisement(null)
          setReaderAdFinished(true)
          setReadingProgress(0)
          setReaderGateReady(true)

          try {
            await loadLockedUnlockStatus(routeEpisodeId)
          } catch {
            setUnlockWallet(null)
            setUnlockCoinAccess(null)
            setUnlockVoucherAccess(null)
            setUnlockAdAccess(null)
            setUnlockPackageOptions([])
          }

          continuousReader.setInitialEntry({
            id: routeEpisodeId,
            episode: episodeData.episode,
            locked: true,
            gate: null,
            adFinished: true,
          })

          window.scrollTo({ top: 0, behavior: 'auto' })
          return
        }

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw Object.assign(new Error(episodeData.message || t('readerPage.episodeNotFound')), { status: episodeResponse.status, code: episodeData.code })
          
        }

        let gateVerified = true
        const nextReaderAdStatus = await loadReaderAdStatus(
          routeEpisodeId
        ).catch(() => {
          gateVerified = false
          return { ad_policy: null, advertisement: null }
        })

        if (ignore) return

        const requiresAd = Boolean(
          nextReaderAdStatus.ad_policy?.show_read_ad &&
            nextReaderAdStatus.advertisement?.image_url
        )

        if (gateVerified && navigator.onLine !== false && episodeData.locked === false &&
          !episodeResponse.headers.get('X-Shadow-Reader-Cache')) {
          const cacheKey = `${storyId}:${routeEpisodeId}`
          if (requiresAd) {
            pendingViewedEpisodeRef.current.set(cacheKey, episodeData)
          } else {
            rememberViewedEpisode({
              storyId, episodeId: routeEpisodeId,
              storyType: String(episodeData.story?.story_type || episodeData.episode?.story_type || 'novel').toLowerCase(),
              response: episodeData,
            }).catch(() => {})
          }
        }

        setStory(episodeData.story || null)
        setEpisode(episodeData.episode || null)
        setEpisodes(nextEpisodes)
        setLockedEpisode(false)
        setReaderAdPolicy(nextReaderAdStatus.ad_policy)
        setReaderAdvertisement(nextReaderAdStatus.advertisement)
        setReaderAdFinished(!requiresAd)
        setReadingProgress(0)
        setReaderGateReady(true)

        continuousReader.setInitialEntry({
          id: routeEpisodeId,
          episode: episodeData.episode,
          locked: false,
          gate: nextReaderAdStatus,
          adFinished: !requiresAd,
        })

        if (episodeData.episode?.is_adult && !adultConsentGrantedRef.current) {
          setAdultAccepted(false)
          setAdultWarningOpen(true)
        } else {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }

        window.scrollTo({ top: 0, behavior: 'auto' })
      } catch (error) {
        if (ignore) return
        const requestResults = Object.values(readTrace.requests)
        const hasServerDenial = requestResults.some((result) =>
          Number(result.status) >= 400 || result.backendOk === false
        )
        const connectionLost = requestResults.some((result) =>
          result.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE'
        )
        if (!hasServerDenial && (navigator.onLine === false || connectionLost)) {
          if (await showOfflineFallback()) return
          if (ignore) return
        }
        readTrace.originalError = {
          name: String(error?.name || 'Error'),
          message: String(error?.message || error),
          status: Number(error?.status) || 'not available',
          backendCode: String(error?.code || 'not available'),
        }
        const report = () => {
          const checks = readTrace.requests
          const failed = Object.entries(checks).filter(([, result]) =>
            result.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE' ||
            result.jsonError ||
            (Number(result.status) >= 400 && result.backendCode !== 'ADULT_RESTRICTED') ||
            result.backendOk === false
          )
          let finding = 'The failure stage is not determined by the collected results.'
          if (failed.some(([, result]) => result.jsonError)) {
            finding = 'The API returned a response, but its JSON body could not be parsed. Check the endpoint response/content type.'
          } else if (failed.some(([, result]) => Number(result.status) >= 500)) {
            finding = 'The API returned HTTP 5xx. Check Shadow backend, middleware and upstream/proxy logs for the matching time.'
          } else if (failed.some(([, result]) => Number(result.status) === 429)) {
            finding = 'The API returned HTTP 429. Check Shadow rate limits, security middleware and edge/proxy limits.'
          } else if (failed.some(([, result]) => [401, 403].includes(Number(result.status)))) {
            finding = 'The API returned HTTP 401/403. Check login/session validation, access rules and security middleware.'
          } else if (failed.some(([, result]) => Number(result.status) === 404)) {
            finding = 'The API returned HTTP 404. Check the route and episode/story identifiers.'
          } else if (failed.some(([, result]) => result.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE')) {
            const frontend = readTrace.probes?.frontend
            const backend = readTrace.probes?.backend
            if (frontend?.status === 200 && backend?.status === 200) {
              finding = 'Frontend and Backend health both responded, but an authenticated reading request failed before an HTTP response was exposed. Inspect request-specific CORS/preflight, auth, browser/Service Worker and security logs. The exact cause is not established.'
            } else if (frontend?.status === 200 && backend?.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE') {
              finding = 'Frontend responded but the independent Backend health request failed. Backend reachability, cross-origin access or the device-to-Backend path is suspect; the exact cause is not established.'
            } else if (frontend?.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE' && backend?.outcome === 'FETCH_REJECTED_NO_HTTP_RESPONSE') {
              finding = 'Both independent Frontend and Backend probes failed on this device. Network, DNS, browser restrictions or both services may be involved; the exact cause is not established.'
            } else {
              finding = 'Browser fetch failed before an HTTP response was exposed. Inspect independent probes below. Possible causes include CORS/preflight, browser/Service Worker handling, network transport or a blocked request. The exact cause is not established.'
            }
          } else if (failed.some(([, result]) => result.backendOk === false)) {
            finding = 'Shadow API replied with ok=false; inspect backendCode and the matching backend log.'
          }
          return [
            'SHADOW READER DIAGNOSTIC — TEMPORARY',
            `Finding: ${finding}`,
            `Captured at UTC: ${readTrace.timestamp}`,
            `Original browser error: ${readTrace.originalError.name}: ${readTrace.originalError.message}`,
            `Original HTTP status: ${readTrace.originalError.status}; backend code: ${readTrace.originalError.backendCode}`,
            `Browser reports online: ${readTrace.onlineReported}; Service Worker: ${readTrace.serviceWorker}`,
            `Device/browser: ${readTrace.userAgent}`,
            `Episode request: ${JSON.stringify(checks.episode || 'not started')}`,
            `Episode-list request: ${JSON.stringify(checks.list || 'not started')}`,
            `Independent probes: ${JSON.stringify(readTrace.probes || 'running...')}`,
            'No bearer token, personal account data or private episode content is included.',
          ].join('\n')
        }
        setMessage(report())
        const probe = async (url) => {
          const controller = new AbortController()
          const timeout = window.setTimeout(() => controller.abort(), 8000)
          const started = Date.now()
          try {
            const response = await fetch(url, {
              cache: 'no-store',
              signal: controller.signal,
            })
            return { outcome: 'HTTP_RESPONSE_RECEIVED', status: response.status, elapsedMs: Date.now() - started }
          } catch (probeError) {
            return { outcome: 'FETCH_REJECTED_NO_HTTP_RESPONSE', name: String(probeError?.name || 'Error'), message: String(probeError?.message || probeError), elapsedMs: Date.now() - started }
          } finally {
            window.clearTimeout(timeout)
          }
        }
        void Promise.all([
          probe('/app-version.json'),
          probe(`${API_BASE_URL}/health/maintenance`),
        ]).then(([frontend, backend]) => {
          readTrace.probes = { frontend, backend }
          if (!ignore) setMessage(report())
          console.error('SHADOW_READER_DIAGNOSTIC', readTrace)
        }).catch((probeError) => {
          readTrace.probes = { unexpectedError: String(probeError?.message || probeError) }
          if (!ignore) setMessage(report())
          console.error('SHADOW_READER_DIAGNOSTIC', readTrace)
        })
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadReader()

    return () => {
      ignore = true
      offlineReaderReleaseRef.current?.()
      offlineReaderReleaseRef.current = null
      pendingViewedEpisodeRef.current.clear()
    }
  }, [
    continuousReader.setInitialEntry,
    expectedEpisode,
    expectedStory,
    hasExpectedLockedPreview,
    navigate,
    routeEpisodeId,
    storyId,
  ])

  useEffect(() => {
    if (effectiveReadingMode === 'paging') return undefined

    const updateProgress = () => {
      const section = continuousReader.getSectionNode(episodeId)

      if (section) {
        const rect = section.getBoundingClientRect()
        const sectionTop = window.scrollY + rect.top
        const sectionHeight = Math.max(1, section.offsetHeight)
        const visibleOffset =
          window.scrollY + window.innerHeight * 0.35 - sectionTop
        const progress = Math.min(
          100,
          Math.max(0, (visibleOffset / sectionHeight) * 100)
        )

        setReadingProgress(progress)
        readingProgressRef.current = progress
        return
      }

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        scrollHeight > 0
          ? Math.min(
              100,
              Math.max(0, (scrollTop / scrollHeight) * 100)
            )
          : 100

      setReadingProgress(progress)
      readingProgressRef.current = progress
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, {
      passive: true,
    })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [
    continuousReader.entries.length,
    continuousReader.getSectionNode,
    effectiveReadingMode,
    episodeId,
  ])

    useEffect(() => {
    if (
      !storyId ||
      !episodeId ||
      !episode ||
      loading ||
      lockedEpisode ||
      !adultAccepted ||
      !getReaderToken() ||
      qualifiedViewSentRef.current
    ) {
      return undefined
    }

    qualifiedViewSentRef.current = true

    const characterCount = Number(
      episode.character_count || episode.content?.length || 0
    )
    const isShortEpisode =
      characterCount > 0 && characterCount < 3000
    const requiredSeconds = isShortEpisode ? 10 : 20
    const requiredProgress = isShortEpisode ? 60 : 20

    let activeSeconds = 0
    let qualifiedTimer = null
    let qualifiedRequestBusy = false
    let cancelled = false

    async function requestView(mode) {
      const response = await fetch(
        `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${episodeId}/view`,
        {
          method: 'POST',
          headers: {
            ...readerAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mode }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to count view')
      }

      console.log('VIEW FLOW:', mode, data.view)

      return data.view || {}
    }

    function startQualifiedViewRule() {
      qualifiedTimer = window.setInterval(async () => {
        if (
          cancelled ||
          qualifiedRequestBusy ||
          document.visibilityState !== 'visible'
        ) {
          return
        }

        activeSeconds += 1

        if (
          activeSeconds < requiredSeconds ||
          readingProgressRef.current < requiredProgress
        ) {
          return
        }

        qualifiedRequestBusy = true
        window.clearInterval(qualifiedTimer)
        qualifiedTimer = null

        try {
          const result = await requestView('qualified')

          if (
            !cancelled &&
            !result.counted &&
            result.reason !== 'cooldown'
          ) {
            qualifiedViewSentRef.current = false
          }
        } catch (error) {
          if (!cancelled) {
            qualifiedViewSentRef.current = false
            console.error('VIEW FLOW ERROR:', error)
          }
        }
      }, 1000)
    }

    async function beginViewFlow() {
      try {
        const result = await requestView('fast')

        if (cancelled) return

        if (
          result.counted ||
          result.reason === 'fast_cooldown'
        ) {
          return
        }

        if (
          result.reason === 'qualified_view_required' ||
          result.requires_qualified_view === true
        ) {
          startQualifiedViewRule()
          return
        }

        qualifiedViewSentRef.current = false
      } catch (error) {
        if (!cancelled) {
          qualifiedViewSentRef.current = false
          console.error('VIEW FLOW ERROR:', error)
        }
      }
    }

    beginViewFlow()

    return () => {
      cancelled = true

      if (qualifiedTimer) {
        window.clearInterval(qualifiedTimer)
      }
    }
  }, [
    adultAccepted,
    episode,
    episodeId,
    loading,
    lockedEpisode,
    storyId,
  ])


  useEffect(() => {
    let cancelled = false

    async function loadReadingTarget() {
      if (!storyId || lockedEpisode || !adultAccepted) {
        return
      }

      try {
        const [missionsResponse, dailyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tasks/reading-missions`, {
            headers: readerAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/tasks/reading-reward`, {
            headers: readerAuthHeaders(),
          }),
        ])

        const missionsData = await missionsResponse.json().catch(() => ({}))
        const dailyData = await dailyResponse.json().catch(() => ({}))

        if (cancelled) return

        const missions =
          missionsResponse.ok && missionsData.ok !== false
            ? missionsData.missions || []
            : []

        const readingReward =
          dailyResponse.ok && dailyData.ok !== false
            ? dailyData.reading_reward || null
            : null

        const nextTarget = resolveReadingTarget({
          missions,
          readingReward,
          storyId,
        })

        setActiveReadingTarget(nextTarget)
      } catch {
        if (!cancelled) setActiveReadingTarget(null)
      }
    }

    loadReadingTarget()

    return () => {
      cancelled = true
    }
  }, [
    adultAccepted,
    lockedEpisode,
    readingRewardReloadKey,
    storyId,
  ])


  useEffect(() => {
    if (!storyId || !episodeId || loading || lockedEpisode || !adultAccepted) {
      return undefined
    }

    readingActivityReadyAtRef.current = Date.now() + 1000

    const markReadingActivity = () => {
      if (Date.now() < readingActivityReadyAtRef.current) return
      lastReadingActivityRef.current = Date.now()
    }

    const handleKeyDown = (event) => {
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'ArrowLeft',
          'ArrowRight',
          'PageDown',
          'PageUp',
          ' ',
        ].includes(event.key)
      ) {
        markReadingActivity()
      }
    }

    window.addEventListener('scroll', markReadingActivity, { passive: true })
    window.addEventListener('wheel', markReadingActivity, { passive: true })
    window.addEventListener('touchmove', markReadingActivity, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', markReadingActivity)
      window.removeEventListener('wheel', markReadingActivity)
      window.removeEventListener('touchmove', markReadingActivity)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [adultAccepted, episodeId, loading, lockedEpisode, storyId])

  useEffect(() => {
  lastReadingActivityRef.current = 0
  readingActivityReadyAtRef.current = Date.now() + 1000
  previousReadingPageRef.current = null
  readingHeartbeatBusyRef.current = false
  weeklyReadingTrackedEpisodeRef.current = ''
  setReadingRewardAnimation(null)
}, [episodeId, storyId])

  useEffect(() => {
    activeReadingTargetRef.current = null
    setActiveReadingTarget(null)
  }, [storyId])

  useEffect(() => {
    if (previousReadingPageRef.current === null) {
      previousReadingPageRef.current = currentPageIndex
      return
    }

    if (previousReadingPageRef.current !== currentPageIndex) {
      lastReadingActivityRef.current = Date.now()
    }

    previousReadingPageRef.current = currentPageIndex
  }, [currentPageIndex])

  useEffect(() => {
    return () => {
      if (rewardAnimationTimerRef.current) {
        window.clearTimeout(rewardAnimationTimerRef.current)
      }
    }
  }, [])

  
  useEffect(() => {
  if (!storyId || !episodeId || !episode || loading || lockedEpisode || !adultAccepted || !getReaderToken()) {
    return undefined
  }

  const timer = window.setInterval(async () => {
    if (readingHeartbeatBusyRef.current || document.visibilityState !== 'visible') return

    const recentlyActive =
      Date.now() - lastReadingActivityRef.current <= READING_ACTIVITY_GRACE_MS

    if (!recentlyActive && !autoScrollEnabled) return

    readingHeartbeatBusyRef.current = true

    try {
      const progressResponse = await fetch(
        `${API_BASE_URL}/api/tasks/reading-session/progress`,
        {
          method: 'POST',
          headers: {
            ...readerAuthHeaders(),
            'Content-Type': 'application/json',
          },
         body: JSON.stringify({
  story_id: storyId,
  episode_id: episodeId,
  seconds: READING_PROGRESS_STEP_SECONDS,
  reading_percent:
    weeklyReadingTrackedEpisodeRef.current === String(episodeId)
      ? 0
      : readingProgressRef.current,
}),
        }
      )

      const progressData = await progressResponse.json().catch(() => ({}))

      if (!progressResponse.ok || progressData.ok === false) return
      if (progressData.weekly_reading) {
  weeklyReadingTrackedEpisodeRef.current = String(episodeId)
}

      const missionIds = Array.isArray(progressData.claimable?.mission_ids)
        ? progressData.claimable.mission_ids.filter(Boolean)
        : []

      const dailyCoins = Math.max(
        0,
        Number(progressData.claimable?.daily_coins || 0)
      )

      let totalClaimedCoins = 0
      let needsReload = false

      if (dailyCoins > 0) {
        const dailyClaimResponse = await fetch(
          `${API_BASE_URL}/api/tasks/reading-reward/claim`,
          {
            method: 'POST',
            headers: {
              ...readerAuthHeaders(),
              'Content-Type': 'application/json',
            },
          }
        )

        const dailyClaimData = await dailyClaimResponse.json().catch(() => ({}))

        if (dailyClaimResponse.ok && dailyClaimData.ok !== false) {
          totalClaimedCoins += Math.max(
            0,
            Number(
              dailyClaimData.reward?.coins ||
                dailyClaimData.reward?.gems ||
                dailyCoins
            )
          )
        } else {
          needsReload = true
        }
      }

      for (const missionId of missionIds) {
        const missionClaimResponse = await fetch(
          `${API_BASE_URL}/api/tasks/reading-missions/${missionId}/claim`,
          {
            method: 'POST',
            headers: {
              ...readerAuthHeaders(),
              'Content-Type': 'application/json',
            },
          }
        )

        const missionClaimData = await missionClaimResponse.json().catch(() => ({}))

        if (missionClaimResponse.ok && missionClaimData.ok !== false) {
          totalClaimedCoins += Math.max(
            0,
            Number(
              missionClaimData.reward?.coins ||
                missionClaimData.reward?.gems ||
                0
            )
          )
        } else {
          needsReload = true
        }
      }

      if (totalClaimedCoins > 0) {
        activeReadingTargetRef.current = null
        setActiveReadingTarget(null)
        showReadingRewardAnimation(totalClaimedCoins)
        return
      }

      const nextTarget = resolveReadingTarget({
        missions: progressData.missions || [],
        readingReward: progressData.reading_reward || null,
        storyId,
      })

      activeReadingTargetRef.current = nextTarget
      setActiveReadingTarget(nextTarget)

      if (needsReload) {
        setReadingRewardReloadKey((value) => value + 1)
      }
    } finally {
      readingHeartbeatBusyRef.current = false
    }
  }, READING_PROGRESS_STEP_SECONDS * 1000)

  return () => {
    window.clearInterval(timer)
  }
}, [
  adultAccepted,
  autoScrollEnabled,
  episode,
  episodeId,
  loading,
  lockedEpisode,
  storyId,
])
      


useEffect(() => {
  setReaderHeaderVisible(Boolean(lockedEpisode))
  setBottomActionsVisible(false)
  lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop

  const handleActionBarVisibility = () => {
    if (lockedEpisode) {
  setReaderHeaderVisible(true)
  return
}
  const currentScrollY = window.scrollY || document.documentElement.scrollTop
  const previousScrollY = lastScrollYRef.current
  const difference = currentScrollY - previousScrollY
  const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const scrolledPercent = Math.min(100, Math.max(0, (currentScrollY / scrollHeight) * 100))

  if (Math.abs(difference) < 8) return

  setReaderHeaderVisible(false)
  setBottomActionsVisible(false)
  setReaderDoubleTapVisible(false)

  const shouldShowSubscribe =
    !subscribed &&
    !scrollSubscribeDismissed &&
    currentScrollY > 30 &&
    (difference < 0 || (difference > 0 && scrolledPercent >= 70))

  if (shouldShowSubscribe) {
    setScrollSubscribePopupVisible(true)
  }

  lastScrollYRef.current = Math.max(0, currentScrollY)
}

  window.addEventListener('scroll', handleActionBarVisibility, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleActionBarVisibility)
  }
}, [episodeId, lockedEpisode, scrollSubscribeDismissed, subscribed])

  useEffect(() => {
    if (!storyId || !episodeId || reviewProgressSaved) return

    if (readingProgress >= REVIEW_READ_PROGRESS_PERCENT) {
      saveReviewReadEpisode(storyId, episodeId)
      setReviewProgressSaved(true)
    }
  }, [episodeId, readingProgress, reviewProgressSaved, storyId])

  useEffect(() => {
    if (autoScrollFrameRef.current) {
      cancelAnimationFrame(autoScrollFrameRef.current)
      autoScrollFrameRef.current = null
    }

    if (
  isChatStory ||
  effectiveReadingMode !== 'scroll' ||
  !autoScrollEnabled ||
  loading ||
  settingsOpen ||
  fontSelectOpen ||
  resetOpen ||
  episodeListOpen ||
  !adultAccepted
) {
  return undefined
}

    const scrollStep = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

      if (scrollHeight <= 0 || window.scrollY >= scrollHeight - 4) {
        setAutoScrollEnabled(false)
        return
      }

      window.scrollBy({
        top: AUTO_SCROLL_SPEEDS[autoScrollSpeed]?.value || AUTO_SCROLL_SPEEDS[1].value,
        behavior: 'auto',
      })

      autoScrollFrameRef.current = requestAnimationFrame(scrollStep)
    }

    autoScrollFrameRef.current = requestAnimationFrame(scrollStep)

    return () => {
      if (autoScrollFrameRef.current) {
        cancelAnimationFrame(autoScrollFrameRef.current)
        autoScrollFrameRef.current = null
      }
    }
  }, [
  adultAccepted,
  autoScrollEnabled,
  autoScrollSpeed,
  effectiveReadingMode,
  episodeListOpen,
  fontSelectOpen,
  isChatStory,
  loading,
  resetOpen,
  settingsOpen,
])

  const sortedReaderEpisodes = useMemo(() => {
    return [...(Array.isArray(episodes) ? episodes : [])].sort(
      (first, second) => {
        const firstNumber = Number(first?.episode_number || 0)
        const secondNumber = Number(second?.episode_number || 0)

        if (firstNumber !== secondNumber) {
          return firstNumber - secondNumber
        }

        return String(first?.id || '').localeCompare(
          String(second?.id || '')
        )
      }
    )
  }, [episodes])

  const firstReaderEpisodeId =
    sortedReaderEpisodes[0]?.id || null

  const currentReaderEpisodeIndex = sortedReaderEpisodes.findIndex(
    (item) => String(item.id) === String(episodeId)
  )

  const previousEpisode =
    currentReaderEpisodeIndex > 0
      ? sortedReaderEpisodes[currentReaderEpisodeIndex - 1]
      : null

  const nextEpisode =
    currentReaderEpisodeIndex >= 0 &&
    currentReaderEpisodeIndex < sortedReaderEpisodes.length - 1
      ? sortedReaderEpisodes[currentReaderEpisodeIndex + 1]
      : null

  const openReaderEpisode = async (targetEpisode) => {
    if (!targetEpisode) return

    if (effectiveReadingMode === 'scroll') {
      await continuousReader.scrollToEpisode(targetEpisode)
      return
    }

    navigate(`/story/${storyId}/episode/${targetEpisode.id}`, {
      replace: true,
      state: {
        storyPreview: story,
        episodePreview: targetEpisode,
        returnSource: location.state?.returnSource,
      },
    })
  }

  const cover = episode?.cover_url || story?.cover_url || ''
  const publishedDate = formatDate(episode?.published_at)
  const characterCount = Number(
    episode?.character_count || episode?.content?.length || 0
  )
  const isLastReadingPage =
    effectiveReadingMode !== 'paging' ||
    currentPageIndex >= Math.max(0, pagingPages.length - 1)

const handleReaderCopyLink = async () => {
  const link = window.location.href

  try {
    await navigator.clipboard.writeText(link)
  } catch {
    window.prompt(t('readerPage.copyThisLink'), link)
  }

  setReaderMoreOpen(false)
}

const handleReaderReport = () => {
  setReaderMoreOpen(false)
  setReportOpen(true)
}
const handleReaderEcho = () => {
  setReaderMoreOpen(false)
  setEchoShareOpen(true)
}

  const handlePrevious = () => {
    openReaderEpisode(previousEpisode)
  }

  const handleNext = () => {
    openReaderEpisode(nextEpisode)
  }

const handleOpenPurchasePage = (
  targetEpisodeId = episodeId
) => {
  navigate('/shop', {
    state: {
      activeTab: 'Purchase',
      from: `/story/${storyId}/episode/${targetEpisodeId}`,
    },
  })
}

async function loadLockedUnlockStatus(
  targetEpisodeId = episodeId,
  force = false
) {
  if (!storyId || !targetEpisodeId) return null

  const data = await fetchUnlockStatus(
    targetEpisodeId,
    force
  )

  setUnlockWallet(data.wallet || null)
  setUnlockCoinAccess(
    data.coin_access || data.gem_access || null
  )
  setUnlockVoucherAccess(data.voucher_access || null)
  setUnlockAdAccess(data.ad_access || null)
  setUnlockAutoUnlock(
    Boolean(data.wallet?.auto_unlock)
  )
  setUnlockPackageOptions(
    Array.isArray(data.package_options)
      ? data.package_options
      : []
  )

  return data
}

async function handleLockedCoinUnlock(
  targetEpisodeId = episodeId,
  targetWallet = unlockWallet,
  targetCoinAccess = unlockCoinAccess
) {
  if (!targetCoinAccess?.available) return

  const coinBalance = Number(
    targetWallet?.coin_balance ??
      targetWallet?.gem_balance ??
      0
  )
  const price = Number(targetCoinAccess?.amount || 0)

  if (coinBalance < price) {
    setMessage(t('readerPage.notEnoughCoins'))
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/gem`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          t('readerPage.unlockCoinsFailed')
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? t('readerPage.cannotConnectBackend')
        : error.message ||
            t('readerPage.unlockCoinsFailed')
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

async function handleLockedVoucherUnlock(
  targetEpisodeId = episodeId,
  targetWallet = unlockWallet,
  targetVoucherAccess = unlockVoucherAccess
) {
  if (!targetVoucherAccess?.available) return

  const voucherBalance = Number(
    targetWallet?.voucher_balance || 0
  )
  const price = Number(targetVoucherAccess?.amount || 0)

  if (voucherBalance < price) {
    setMessage(t('readerPage.notEnoughVouchers'))
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/voucher`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          t('readerPage.unlockVouchersFailed')
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? t('readerPage.cannotConnectBackend')
        : error.message ||
            t('readerPage.unlockVouchersFailed')
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

async function handleLockedRewardedUnlock(
  targetEpisodeId = episodeId
) {
  if (
    !rewardedAdsEnabled ||
    !targetEpisodeId ||
    unlockingEpisode
  ) {
    return
  }

  try {
    setUnlockingEpisode(true)
    setMessage('')

    await runRewardedEpisodeUnlock({
      storyId,
      episodeId: targetEpisodeId,
    })

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    if (error?.code === 'AD_DAILY_LIMIT_REACHED') {
      await loadLockedUnlockStatus(
        targetEpisodeId,
        true
      ).catch(() => {})
    }

    setMessage(
      error?.code === 'REWARDED_AD_CANCELLED'
        ? t('readerPage.adClosedIncomplete')
        : error?.message ||
            t('readerPage.rewardedUnavailable')
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

async function handleLockedDiamondUnlock(
  packageKey,
  targetEpisodeId = episodeId,
  targetPackageOptions = unlockPackageOptions,
  targetWallet = unlockWallet
) {
  const options = Array.isArray(targetPackageOptions)
    ? targetPackageOptions
    : []
  const option = options.find(
    (item) => item.key === packageKey
  )
  const diamondBalance = Number(
    targetWallet?.diamond_balance || 0
  )
  const price = Number(option?.price || 0)

  if (!option?.enabled) return

  if (diamondBalance < price) {
    handleOpenPurchasePage(targetEpisodeId)
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/package`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_key: packageKey,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      if (data.code === 'INSUFFICIENT_DIAMONDS') {
        navigate('/shop/mall/purchase', {
          state: {
            returnTo: `/story/${storyId}/episode/${targetEpisodeId}`,
          },
        })
        return
      }

      throw new Error(
        data.message || t('readerPage.unlockFailed')
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? t('readerPage.cannotConnectBackend')
        : error.message ||
            t('readerPage.unlockFailed')
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

  const handleResetSettings = () => {
    setFontSizeIndex(DEFAULT_FONT_SIZE_INDEX)
    setFontKey('noto-sans-khmer')
    setThemeName('white')
    setBrightness(100)
    setLineSpacing('comfort')
    setReadingMode('scroll')
    setAutoScrollEnabled(false)
    setAutoScrollSpeed(1)
    setChatStoryReadMode('manual')
    setChatStoryAutoTapSpeed(
    DEFAULT_CHAT_STORY_AUTO_TAP_SPEED
)
setResetOpen(false)
  }


  const handleCommentChanged = () => {
    setCommentRefreshKey((value) => value + 1)
  }

function showReadingRewardAnimation(coins) {
  const rewardCoins = Math.max(0, Number(coins || 0))

  if (rewardCoins <= 0) return

  setReaderHeaderVisible(true)
  setBottomActionsVisible(true)
  setReaderDoubleTapVisible(true)
  setScrollSubscribePopupVisible(false)

  setReadingRewardAnimation({
    key: Date.now(),
    coins: rewardCoins,
  })

  if (rewardAnimationTimerRef.current) {
    window.clearTimeout(rewardAnimationTimerRef.current)
  }

  rewardAnimationTimerRef.current = window.setTimeout(() => {
    setReadingRewardAnimation(null)
    setReadingRewardReloadKey((value) => value + 1)
  }, 1700)
}

const shouldShowReaderAd = readerGateReady && episode && adultAccepted && !lockedEpisode && readerAdPolicy?.show_read_ad
const shouldBlockReaderContent = shouldShowReaderAd && !readerAdFinished

const openContinuousLockedEpisode = (lockedEntry) => {
  const targetId = String(
    lockedEntry?.id || lockedEntry?.episode?.id || ''
  ).trim()

  if (!targetId || !lockedEntry?.episode) return

  setContinuousLockedEntry(lockedEntry)

  const unlock = lockedEntry.unlockStatus || {}
  const nextPath = `/story/${storyId}/episode/${targetId}`

  setActiveEpisodeId(targetId)
  setEpisode(lockedEntry.episode)
  setLockedEpisode(true)
  setReadingProgress(0)
  readingProgressRef.current = 0
  setReaderAdPolicy(null)
  setReaderAdvertisement(null)
  setReaderAdFinished(true)
  setReaderGateReady(true)
  setReaderMoreOpen(false)
  setBottomActionsVisible(false)
  setReaderDoubleTapVisible(false)
  setScrollSubscribePopupVisible(false)
  setCommentEpisode(null)
  setUnlockWallet(unlock.wallet || null)
  setUnlockCoinAccess(
    unlock.coin_access || unlock.gem_access || null
  )
  setUnlockVoucherAccess(unlock.voucher_access || null)
  setUnlockAdAccess(unlock.ad_access || null)
  setUnlockPackageOptions(
    Array.isArray(unlock.package_options)
      ? unlock.package_options
      : []
  )
  setUnlockAutoUnlock(Boolean(unlock.wallet?.auto_unlock))

  if (window.location.pathname !== nextPath) {
    window.history.replaceState(
      window.history.state,
      '',
      nextPath
    )
  }

  if (!unlock.wallet) {
    loadLockedUnlockStatus(targetId).catch(() => {})
  }
}

const showFullLockedEpisode = Boolean(
  lockedEpisode && episode && !continuousLockedEntry
)
const showContinuousLockedEpisode = Boolean(
  continuousLockedEntry?.episode
)
const lockedHeaderActive =
  showFullLockedEpisode || showContinuousLockedEpisode
const activeCommentsEpisode = commentEpisode || episode

const canTranslateStory =
  STORY_TRANSLATION_ENABLED &&
  !lockedHeaderActive &&
  !isMangaStory &&
  !isChatStory &&
  adultAccepted &&
  !shouldBlockReaderContent &&
  Boolean(String(episode?.content || '').trim())

const readerControlsVisible =
  readerHeaderVisible &&
  bottomActionsVisible &&
  !lockedEpisode &&
  !loading &&
  adultAccepted &&
  Boolean(episode) &&
  !shouldBlockReaderContent &&
  !echoShareOpen &&
  !settingsOpen &&
  !fontSelectOpen &&
  !resetOpen &&
  !episodeListOpen &&
  !commentsOpen

  const showReadingRewardCoin =
  Boolean(readingRewardAnimation) ||
  Boolean(
    activeReadingTarget?.id &&
    !lockedEpisode &&
    !loading &&
    adultAccepted &&
    episode &&
    !shouldBlockReaderContent &&
    !echoShareOpen &&
    !settingsOpen &&
    !fontSelectOpen &&
    !resetOpen &&
    !episodeListOpen &&
    !commentsOpen
  )


return (
  <div className={`reader-page min-h-screen ${theme.page} pb-[110px]`}>
    {brightnessOpacity > 0 ? (
      <div className="pointer-events-none fixed inset-0 z-[140] bg-black"
        style={{ opacity: brightnessOpacity }} />
    ) : null}
      

      {!isChatStory &&
effectiveReadingMode === 'scroll' &&
autoScrollEnabled ? (
        <button
          type="button"
          onClick={() => setAutoScrollEnabled(false)}
          className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-[12px] font-black text-white shadow-2xl active:scale-95"
        >
          <i className="fa-solid fa-pause text-[11px]" />
          {t('readerPage.pauseAutoScroll')}
        </button>
      ) : null}

      {!lockedHeaderActive && !isChatStory ? (
  <div className="fixed left-0 right-0 top-0 z-[70] h-1 bg-black/5">
    <div
      className="h-full bg-[#0b5cff] transition-all duration-150"
      style={{ width: `${readingProgress}%` }}
    />
  </div>
) : null}

      <AdultWarningModal
        open={adultWarningOpen}
        theme={theme}
        onCancel={() => navigate(`/story/${storyId}`, { replace: true })}
        onContinue={() => {
          adultConsentGrantedRef.current = true
          setAdultConsentGranted(true)
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }}
      />

      <ResetSettingsModal
        open={resetOpen}
        theme={theme}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleResetSettings}
      />

      <FontSelectDrawer
        open={fontSelectOpen}
        theme={theme}
        onClose={() => setFontSelectOpen(false)}
        selectedFontKey={fontKey}
        onSelect={setFontKey}
      />

      <ReaderSettingsDrawer
  open={settingsOpen}
  onClose={() => setSettingsOpen(false)}
  isChatStory={isChatStory}
  chatStoryReadMode={
    chatStoryReadMode
  }
  setChatStoryReadMode={
    setChatStoryReadMode
  }
  chatStoryAutoTapSpeed={
    chatStoryAutoTapSpeed
  }
  setChatStoryAutoTapSpeed={
    setChatStoryAutoTapSpeed
  }
  themeName={themeName}
        setThemeName={setThemeName}
        fontSizeIndex={fontSizeIndex}
        setFontSizeIndex={setFontSizeIndex}
        fontKey={fontKey}
        setFontKey={setFontKey}
        selectedFont={activeFont}
        brightness={brightness}
        setBrightness={setBrightness}
        lineSpacing={lineSpacing}
        setLineSpacing={setLineSpacing}
        readingMode={effectiveReadingMode}
        setReadingMode={(nextMode) => {
  if (
    !isMangaStory &&
    !isChatStory
  ) {
    setReadingMode(nextMode)
  }
}}
        autoScrollEnabled={autoScrollEnabled}
        setAutoScrollEnabled={setAutoScrollEnabled}
        autoScrollSpeed={autoScrollSpeed}
        setAutoScrollSpeed={setAutoScrollSpeed}
        onOpenFontList={() => setFontSelectOpen(true)}
        onOpenReset={() => setResetOpen(true)}
      />

      {isChatStory ? (
  <ChatStoryEpisodeListDrawer
    open={episodeListOpen}
    onClose={() => setEpisodeListOpen(false)}
    story={story}
    episodes={episodes}
    currentEpisodeId={episodeId}
    storyId={storyId}
    navigate={(to, options = {}) =>
      navigate(to, {
        ...options,
        replace: true,
      })
    }
  />
) : (
  <EpisodeListDrawer
    open={episodeListOpen}
    onClose={() => setEpisodeListOpen(false)}
    story={story}
    episodes={episodes}
    currentEpisodeId={episodeId}
    storyId={storyId}
    navigate={(to, options = {}) =>
      navigate(to, {
        ...options,
        replace: true,
      })
    }
    theme={theme}
  />
)}

      <ReportModal
  open={reportOpen}
  reportType="story"
  targetId={story?.id || storyId}
  targetTitle={story?.title}
  onClose={() => setReportOpen(false)}
/>

      <EchoShareSheetV2Connected
  open={echoShareOpen}
  sourceType="episode"
  sourceId={episode?.id || episodeId}
  sourceName={story?.title || t('readerPage.untitledStory')}
  sourceAvatarUrl={
    story?.author_page?.avatar_url ||
    story?.author?.avatar_url ||
    story?.cover_url ||
    ''
  }
  sourceContent={episode?.title || t('readerPage.untitledEpisode')}
  sourceImageUrl={
    episode?.cover_url ||
    story?.landscape_thumbnail_url ||
    story?.cover_url ||
    ''
  }
  sourceLabel="episode"
  endpoint={
    episode?.id || episodeId
      ? `${API_BASE_URL}/api/echoes/episode/${encodeURIComponent(
          episode?.id || episodeId
        )}`
      : ''
  }
  shareUrl={`${window.location.origin}/story/${
    story?.id || storyId
  }/episode/${episode?.id || episodeId}`}
  onClose={() => setEchoShareOpen(false)}
/>
      <CommentsModal
  open={commentsOpen}
  story={story}
  targetType="episode"
  targetId={activeCommentsEpisode?.id || episodeId}
  episodes={episodes}
  title={
    activeCommentsEpisode?.title ||
    story?.title ||
    t('readerPage.comments')
  }
  onClose={() => {
    setCommentsOpen(false)
    setCommentEpisode(null)
  }}
  onCommentChanged={handleCommentChanged}
  key={`${storyId}-${activeCommentsEpisode?.id || episodeId}`}
/>

      <GiftPopup
  open={giftPopupOpen}
  storyId={storyId}
  onClose={() => setGiftPopupOpen(false)}
  onOpenGuide={() => {
    sessionStorage.setItem('shadow_reopen_gift_popup', '1')
    navigate('/gift-guide')
  }}
  onOpenTopFans={() => {
    setGiftPopupOpen(false)
    navigate(`/story/${storyId}/top-fans`, {
      state: {
        storyPreview: story,
        from: `/story/${storyId}/episode/${episodeId}`,
      },
    })
  }}
/>
      {shouldShowReaderAd && !readerAdFinished ? (
  <AdvertisementPopup
  placement="freeUnlock"
  blocking
  advertisementOverride={readerAdvertisement}
  key={`freeUnlock-${storyId}-${episodeId}`}
  onFinish={() => {
    setReaderAdFinished(true)
    continuousReader.markAdFinished(episodeId)
    const cacheKey = `${storyId}:${episodeId}`
    const viewed = pendingViewedEpisodeRef.current.get(cacheKey)
    if (viewed) {
      pendingViewedEpisodeRef.current.delete(cacheKey)
      rememberViewedEpisode({
        storyId, episodeId,
        storyType: String(viewed.story?.story_type || viewed.episode?.story_type || 'novel').toLowerCase(),
        response: viewed,
      }).catch(() => {})
    }
  }}
/>
) : null}

     {shouldBlockReaderContent ? (
  <div className="fixed inset-0 z-[2147483646] bg-black" />
) : null}

<ScrollSubscribePopup
  visible={scrollSubscribePopupVisible}
  theme={theme}
  storyId={storyId}
  readingProgress={readingProgress}
  subscribed={subscribed}
  onSubscribe={handleSubscribe}
  onClose={() => {
    setScrollSubscribePopupVisible(false)
    setScrollSubscribeDismissed(true)
  }}
/>
      
     <ReaderBottomActionBar
  visible={bottomActionsVisible && !lockedEpisode && !echoShareOpen && !settingsOpen && !fontSelectOpen && !resetOpen && !episodeListOpen && !commentsOpen && adultAccepted && !loading && Boolean(episode) && !shouldBlockReaderContent}
  theme={theme}
  subscribed={subscribed}
  onSubscribe={handleSubscribe}
  story={story}
  episode={episode}
  commentTotal={
    String(activeCommentSummary?.episodeId || '') ===
    String(episodeId)
      ? activeCommentSummary?.total
      : null
  }
  readingProgress={readingProgress}
  previousEpisode={previousEpisode}
  nextEpisode={nextEpisode}
  onPrevious={() => openReaderEpisode(previousEpisode)}
  onNext={() => openReaderEpisode(nextEpisode)}
  showSubscribeOnDoubleTap={readerDoubleTapVisible}
  onOpenChapters={() => setEpisodeListOpen(true)}
  onOpenComments={() => {
    setCommentEpisode(episode)
    setCommentsOpen(true)
  }}
  onOpenSettings={() => setSettingsOpen(true)}
/>

<WebcomicReadingMissionCoin
  visible={showReadingRewardCoin}
  target={activeReadingTarget}
  rewardAnimation={readingRewardAnimation}
  onClick={() => navigate('/tasks')}
/>

      <header
  className={`${isChatStory || readerHeaderVisible ? 'translate-y-0' : '-translate-y-full'} fixed left-0 right-0 top-0 z-50 border-b px-4 py-3 transition-transform duration-300 ease-out ${
    lockedHeaderActive
  ? 'border-[#111111] bg-[#111111]'
  : `${theme.border} ${theme.card}`
  }`}
>
  <div className="mx-auto flex max-w-3xl items-center justify-between">
    <ReaderIconButton
      icon="fa-solid fa-chevron-left"
      label={t('readerPage.backToStory')}
      onClick={() => {
  const returnTo = location.state?.returnTo

  if (returnTo) {
    navigate(returnTo, { replace: true })
    return
  }

  const returnSource = location.state?.returnSource

  if (window.history.length > 1) {
  navigate(-1)
  return
}

navigate(`/story/${storyId}`, { replace: true })
}}
className={lockedHeaderActive ? '!text-white' : theme.text}
    />

    <div className="min-w-0 flex-1 px-3 text-center">
  {lockedHeaderActive ? (
    <h1 className="line-clamp-1 text-[14.5px] font-extrabold text-white">
      {continuousLockedEntry?.episode?.title ||
        episode?.title ||
        t('readerPage.untitledEpisode')}
    </h1>
  ) : (
    <h1 className={`line-clamp-1 text-[14.5px] font-extrabold ${theme.text}`}>
      {isChatStory
  ? episode?.title || t('readerPage.untitledEpisode')
  : story?.title || t('readerPage.reader')}
    </h1>
  )}
</div>

    <div className="flex items-center">
  {!lockedHeaderActive ? (
    <>
      {isChatStory ? (
        <>
          <ReaderIconButton
            icon="fa-solid fa-gear"
            label={t('readerPage.readerSettings')}
            onClick={() => setSettingsOpen(true)}
            className={theme.text}
          />

          <ReaderIconButton
  icon="fa-solid fa-list-ul"
  label={t('readerPage.episodeList')}
  onClick={() => setEpisodeListOpen(true)}
  className={theme.text}
/>
        </>
      ) : null}

            {canTranslateStory ? (
        <StoryTranslateButton
          activeLanguage={storyTranslationLanguage}
          loading={storyTranslationLoading}
          errorCode={storyTranslationErrorCode}
          onSelectLanguage={async (language) => {
            setReaderMoreOpen(false)
            return translateStoryTo(language)
          }}
        />
      ) : null}

      <div className="relative">
        <ReaderIconButton
          icon="fa-solid fa-ellipsis-vertical"
          label={t('readerPage.moreOptions')}
          onClick={() => setReaderMoreOpen((value) => !value)}
          className={theme.text}
        />

            {readerMoreOpen ? (
  <div className={`absolute right-0 top-10 z-[80] w-[158px] overflow-hidden rounded-[8px] border ${theme.border} ${theme.card} shadow-[0_12px_30px_rgba(17,24,39,0.16)]`}>
    <OfflineDownloadMenuItem
      storyId={storyId}
      episodeId={episodeId}
      theme={theme}
      disabled={loading || lockedEpisode || !adultAccepted || !episode || shouldBlockReaderContent}
    />
    <button
      type="button"
      onClick={handleReaderReport}
              className={`flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold ${theme.text} active:opacity-80`}
            >
              <i className={`fa-regular fa-flag w-4 text-center text-[14px] ${theme.muted}`} />
              <span>{t('readerPage.report')}</span>
            </button>

            <button
              type="button"
              onClick={handleReaderCopyLink}
              className={`flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold ${theme.text} active:opacity-80`}
            >
              <i className={`fa-solid fa-link w-4 text-center text-[14px] ${theme.muted}`} />
              <span>{t('readerPage.copyLink')}</span>
            </button>

            <button
              type="button"
              onClick={handleReaderEcho}
              className={`flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold ${theme.text} active:opacity-80`}
            >
              <i className={`fa-solid fa-rotate w-4 text-center text-[14px] ${theme.muted}`} />
              <span>{t('readerPage.echo')}</span>
            </button>
          </div>
        ) : null}
      </div>
    </>
  ) : (
    <span className="block h-10 w-10" aria-hidden="true" />
  )}
</div>
  </div>
</header>

      <main
  onClick={isChatStory ? undefined : handleReaderDoubleTap}
  className={`mx-auto max-w-3xl ${theme.card} px-0 pb-[92px] pt-[50px] sm:px-4`}
>
        {loading ? <LoadingCard theme={theme} /> : null}

        {message ? (
          <section className="whitespace-pre-wrap break-words rounded-[18px] bg-[#fff1f1] px-4 py-3 font-mono text-[12px] leading-5 text-[#e5484d] dark:bg-[#2d1f29] dark:text-[#ffb4b4]">
            {message}
          </section>
        ) : null}

        {!loading && showFullLockedEpisode ? (
  <LockedEpisodeCard
  story={story}
  episode={episode}
  wallet={unlockWallet}
  coinAccess={unlockCoinAccess}
  voucherAccess={unlockVoucherAccess}
  adAccess={unlockAdAccess}
  rewardedAdsEnabled={rewardedAdsEnabled}
  packageOptions={unlockPackageOptions}
  autoUnlock={unlockAutoUnlock}
  setAutoUnlock={setUnlockAutoUnlock}
  showAutoHint={unlockAutoHintOpen}
  setShowAutoHint={setUnlockAutoHintOpen}
  unlocking={unlockingEpisode}
onPurchase={handleOpenPurchasePage}
onUnlock={handleLockedDiamondUnlock}
  onCoinUnlock={handleLockedCoinUnlock}
  onVoucherUnlock={handleLockedVoucherUnlock}
    onRewardedUnlock={() =>
  handleLockedRewardedUnlock(episodeId)
}
/>
) : null}

        {!loading && showContinuousLockedEpisode ? (
          <ContinuousLockedEpisodeCard
            story={story}
            episode={continuousLockedEntry.episode}
            wallet={
              continuousLockedEntry.unlockStatus?.wallet ||
              unlockWallet
            }
            adAccess={
              unlockAdAccess ||
              continuousLockedEntry.unlockStatus?.ad_access
            }
            rewardedAdsEnabled={rewardedAdsEnabled}
            packageOptions={
              Array.isArray(
                continuousLockedEntry.unlockStatus?.package_options
              )
                ? continuousLockedEntry.unlockStatus.package_options
                : unlockPackageOptions
            }
            autoUnlock={unlockAutoUnlock}
            setAutoUnlock={setUnlockAutoUnlock}
            unlocking={unlockingEpisode}
            onPurchase={() =>
              handleOpenPurchasePage(continuousLockedEntry.id)
            }
            onUnlock={(packageKey) =>
              handleLockedDiamondUnlock(
                packageKey,
                continuousLockedEntry.id,
                Array.isArray(
                  continuousLockedEntry.unlockStatus?.package_options
                )
                  ? continuousLockedEntry.unlockStatus.package_options
                  : unlockPackageOptions,
                continuousLockedEntry.unlockStatus?.wallet ||
                  unlockWallet
              )
            }
            onRewardedUnlock={() =>
              handleLockedRewardedUnlock(
                continuousLockedEntry.id
              )
            }
          />
        ) : null}

        {!loading &&
isChatStory &&
episode &&
adultAccepted &&
!lockedEpisode &&
!shouldBlockReaderContent ? (
  <>
    <section
      className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}
    >
      <ChatStoryReader
  content={episode.content}
  readMode={chatStoryReadMode}
  autoTapDelay={
    CHAT_STORY_AUTO_TAP_SPEEDS[
      chatStoryAutoTapSpeed
    ]?.delay ||
    CHAT_STORY_AUTO_TAP_SPEEDS[
      DEFAULT_CHAT_STORY_AUTO_TAP_SPEED
    ].delay
  }
  autoTapPaused={
    settingsOpen ||
    fontSelectOpen ||
    resetOpen ||
    episodeListOpen ||
    readerMoreOpen ||
    commentsOpen ||
    giftPopupOpen
  }
  onProgress={(percent) => {
          setReadingProgress(percent)
          readingProgressRef.current = percent
          lastReadingActivityRef.current = Date.now()
        }}
        onComplete={() => setChatStoryComplete(true)}
      />
    </section>

    {chatStoryComplete ? (
      <>
        {shouldShowToBeContinued(story, episodes, episode) ? (
          <ToBeContinued theme={theme} />
        ) : null}

        <ReaderEndPanel
          story={story}
          episode={episode}
          commentSummary={activeCommentSummary}
          onOpenComments={() => {
            setCommentEpisode(episode)
            setCommentsOpen(true)
          }}
          onOpenGift={() => setGiftPopupOpen(true)}
          theme={theme}
        />
      </>
    ) : null}
  </>
) : null}

{!loading &&
!isChatStory &&
!showFullLockedEpisode &&
!showContinuousLockedEpisode &&
!offlineAccessExpired &&
effectiveReadingMode === 'scroll' ? (
          <div>
            {continuousReader.entries.map((entry, index) => (
              <ContinuousEpisodeBlock
  key={entry.id}
  entry={entry}
  index={index}
  active={String(entry.id) === String(episodeId)}
  contentOverride={
    String(entry.id) === String(episodeId)
      ? storyDisplayContent
      : null
  }
  theme={theme}
                story={story}
                commentSummary={
                  String(entry.id) === String(episodeId)
                    ? activeCommentSummary
                    : null
                }
                isFirstEpisode={
  Boolean(firstReaderEpisodeId) &&
  String(entry.id) === String(firstReaderEpisodeId)
}
                showToBeContinued={shouldShowToBeContinued(story, episodes, entry.episode)}
                fontSizePx={fontSizePx}
                fontFamily={activeFont.family}
                lineSpacing={lineSpacing}
                onRegister={continuousReader.registerSection}
                onOpenComments={(targetEpisode) => {
                  setCommentEpisode(targetEpisode)
                  setCommentsOpen(true)
                }}
                onOpenGift={() => setGiftPopupOpen(true)}
                adultAccepted={adultConsentGranted}
                onReachLocked={openContinuousLockedEpisode}
              />
            ))}
          </div>
        ) : null}

        {!loading &&
!isChatStory &&
effectiveReadingMode === 'paging' &&
episode &&
adultAccepted &&
!lockedEpisode &&
!shouldBlockReaderContent ? (
          <>
            <section className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}>
              {SHOW_READER_COVER && cover ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111827]">
                  <img src={cover} alt={episode.title} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-[24px] font-extrabold leading-8 text-white sm:text-[30px] sm:leading-10">
                      {episode.title || t('readerPage.untitledEpisode')}
                    </h2>

                    {story?.title ? (
                      <div className="mt-1 text-[12px] font-bold text-white/75">
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="px-4 py-5 sm:p-8">
                {SHOW_READER_COVER && !cover ? (
                  <div className={`mb-7 border-b ${theme.border} pb-6`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`${theme.soft} ${theme.muted} rounded-full px-3 py-1.5 text-[11px] font-extrabold`}>
                        EP {episode.episode_number || 1}
                      </span>

                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className={`text-[26px] font-extrabold leading-10 ${theme.text}`}>
                      {episode.title || t('readerPage.untitledEpisode')}
                    </h2>

                    {story?.title ? (
                      <div className={`mt-1 text-[12px] font-bold ${theme.muted}`}>
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {SHOW_READER_INFO ? (
                  <div className={`mb-7 grid grid-cols-2 gap-2 rounded-[22px] ${theme.soft} p-3 sm:grid-cols-4`}>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Episode</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>EP {episode.episode_number || 1}</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Length</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{characterCount.toLocaleString()} chars</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Mode</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{READER_THEMES[themeName]?.name || themeName}</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Published</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{publishedDate || 'New'}</div>
                    </div>
                  </div>
                ) : null}

<div className="mb-7">
  <h1
       className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}
    style={{ fontFamily: activeFont.family }}
  >
    {episode.title || t('readerPage.untitledEpisode')}
  </h1>
</div>

                <article>
                  {effectiveReadingMode === 'paging' ? (
  <PagingReadingText
    pages={pagingPages}
    pageIndex={currentPageIndex}
    setPageIndex={setCurrentPageIndex}
    fontSizePx={fontSizePx}
    fontFamily={activeFont.family}
    lineSpacing={lineSpacing}
    theme={theme}
    onReadingActivity={() => {
      lastReadingActivityRef.current = Date.now()
    }}
  />
) : (
<ReadingText
  content={storyDisplayContent}
  fontSizePx={fontSizePx}
  fontFamily={activeFont.family}
    lineSpacing={lineSpacing}
    theme={theme}
  />
)}

                  {isLastReadingPage ? (
  <YouTubeEpisodeCard
    videoId={episode.youtube_video_id}
    title={episode.youtube_title}
    theme={theme}
  />
) : null}
                  
                </article>
              </div>
            </section>

            {isLastReadingPage ? (
              <>
                {shouldShowToBeContinued(story, episodes, episode) ? (
                  <ToBeContinued theme={theme} />
                ) : null}

                <ReaderEndPanel
                  story={story}
                  episode={episode}
                  commentSummary={activeCommentSummary}
                  onOpenComments={() => {
                    setCommentEpisode(episode)
                    setCommentsOpen(true)
                  }}
                  onOpenGift={() => setGiftPopupOpen(true)}
                  theme={theme}
                />
              </>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
