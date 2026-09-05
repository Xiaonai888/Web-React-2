import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageEditDetails', {
  "en": {
    "close": "Close",
    "back": "Back",
    "save": "Save",
    "book": "Book",
    "public": "Public",
    "reviewsOn": "Reviews: On",
    "reviewsOff": "Reviews: Off",
    "priceHidden": "Price hidden",
    "phoneNumber": "Phone number",
    "socialMedia": "Social media",
    "address": "Address",
    "hours": "Hours",
    "telegram": "Telegram",
    "dailyHours": "Daily hours",
    "dailyHoursHelp": "Set specific opening hours for your page.",
    "temporarilyClosed": "Temporarily closed",
    "temporarilyClosedHelp": "Use this if your page is not available for a short time.",
    "permanentlyClosed": "Permanently closed",
    "permanentlyClosedHelp": "Use this if this page is no longer active.",
    "alwaysOpen": "Always open",
    "alwaysOpenHelp": "Use this if readers can contact or view your page anytime.",
    "notApplicable": "Not applicable",
    "notApplicableHelp": "Use this if opening hours do not apply to your page.",
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "mondayShort": "M",
    "tuesdayShort": "Tu",
    "wednesdayShort": "W",
    "thursdayShort": "Th",
    "fridayShort": "F",
    "saturdayShort": "Sa",
    "sundayShort": "Su",
    "closed": "Closed",
    "open24": "Open 24 hours",
    "everyday": "Everyday",
    "monFri": "Mon–Fri",
    "satSun": "Sat–Sun",
    "openRange": "Open {{range}}: {{hours}}",
    "everydayHours": "Everyday: {{hours}}",
    "socialTitle": "Social media",
    "socialAdd": "Add",
    "socialLinksTitle": "Social media links on your Page",
    "selectPlatform": "Select platform",
    "addLink": "Add link",
    "editLink": "Edit link",
    "usernameOrLink": "Username or link",
    "socialPlaceholder": "@username or https://...",
    "remove": "Remove",
    "noSocialLinks": "No social media links yet",
    "dragClose": "Drag to close",
    "basicPrice": "Basic",
    "standardPrice": "Standard",
    "premiumPrice": "Premium",
    "exclusivePrice": "Exclusive",
    "hidePrice": "Do not show price",
    "hidePriceHelp": "Hide price range from your public page",
    "editPrice": "Edit price",
    "reviews": "Reviews",
    "reviewsQuestion": "Let readers leave reviews on your Author Page?",
    "reviewsHelp": "Reviews help readers decide whether to follow your page and read your works. You can turn this off anytime.",
    "allowReviews": "Allow reviews",
    "editHours": "Edit hours",
    "open": "Open",
    "removeHours": "Remove hours",
    "addMore": "Add more",
    "setTime": "Set time",
    "cancel": "Cancel",
    "set": "Set",
    "selectHours": "Select hours",
    "leaveHoursTitle": "Leave without saving hours?",
    "leaveHoursHelp": "Your hours changes are not saved yet. If you leave now, they will not be shown on your Author Page.",
    "leave": "Leave",
    "keepEditing": "Keep editing",
    "editFacebook": "Edit Facebook Page",
    "facebookPage": "Facebook Page",
    "changeImage": "Change image",
    "pageName": "Page name",
    "pageLink": "Page link",
    "facebookNameExample": "Example: Alpha Centauri",
    "facebookImageHelp": "The image is optional. If you do not add one, your author logo will be shown.",
    "intro": "Intro",
    "pinnedDetails": "Pinned details",
    "pinnedHelp": "Choose up to 5 details to feature near the top of your page.",
    "closeCoverOptions": "Close cover options",
    "seeCover": "See cover",
    "uploadCover": "Upload cover",
    "chooseCover": "Choose cover",
    "authorPageNotFound": "Author page not found",
    "loadAuthorFailed": "Failed to load author page",
    "loginAgain": "Please login again before saving contact info.",
    "saveContactFailed": "Failed to save contact info",
    "saved": "Saved.",
    "coverPreviewUpdated": "Cover updated for preview. Backend image save can be connected later.",
    "logoPreviewUpdated": "Logo updated for preview. Backend image save can be connected later.",
    "facebookImageUpdated": "Facebook Page image updated.",
    "pageNameTooShort": "Page name must be at least 2 characters.",
    "pageUsernameTooShort": "Page username must be at least 3 characters.",
    "updateAuthorFailed": "Failed to update author page",
    "editPageSaved": "Edit Page saved.",
    "saveEditPageFailed": "Failed to save Edit Page",
    "editPage": "Edit Page",
    "uploadLogo": "Upload logo",
    "bio": "Bio",
    "bioAdd": "Add a short intro for readers",
    "onePublicDetail": "Add one short public detail",
    "details": "Details",
    "on": "On",
    "off": "Off",
    "reviewsVisible": "Readers can leave reviews on your page",
    "reviewsHidden": "Reviews are hidden from your page",
    "priceVisible": "Price range shown on your public page",
    "priceNotShown": "Price range will not be shown",
    "addAddress": "Add address",
    "addOpeningHours": "Add opening hours",
    "links": "Links",
    "website": "Website",
    "addWebsite": "Add website link",
    "addFacebookLink": "Add Facebook Page link",
    "contactInfo": "Contact info",
    "addSocial": "Add social media or public handle",
    "emailAddress": "Email address",
    "shownPublic": "Shown on your public page",
    "addEmail": "Add email address",
    "addPhone": "Add phone number",
    "messenger": "Messenger",
    "addMessenger": "Add Messenger name or link",
    "addTelegram": "Add Telegram link",
    "noCover": "No cover photo yet.",
    "chooseCoverSoon": "Choose cover is coming soon.",
    "editBio": "Edit bio",
    "bioPlaceholder": "Tell readers about your page.",
    "bioUpdated": "Bio updated. Press Save to keep it on backend.",
    "editAddress": "Edit address",
    "publicAddress": "Add your public address",
    "editWebsite": "Edit website",
    "websiteUrl": "Website URL",
    "editEmail": "Edit email",
    "editPhone": "Edit phone",
    "editMessenger": "Edit Messenger",
    "messengerPlaceholder": "Messenger name or link",
    "editTelegram": "Edit Telegram",
    "websiteLabelDefault": "Shadow website"
  },
  "km": {
    "close": "បិទ",
    "back": "ត្រឡប់ក្រោយ",
    "save": "រក្សាទុក",
    "book": "សៀវភៅ",
    "public": "សាធារណៈ",
    "reviewsOn": "Reviews: បើក",
    "reviewsOff": "Reviews: បិទ",
    "priceHidden": "លាក់តម្លៃ",
    "phoneNumber": "លេខទូរស័ព្ទ",
    "socialMedia": "បណ្ដាញសង្គម",
    "address": "អាសយដ្ឋាន",
    "hours": "ម៉ោងបើក",
    "telegram": "Telegram",
    "dailyHours": "ម៉ោងប្រចាំថ្ងៃ",
    "dailyHoursHelp": "កំណត់ម៉ោងបើកជាក់លាក់សម្រាប់ទំព័ររបស់អ្នក។",
    "temporarilyClosed": "បិទជាបណ្ដោះអាសន្ន",
    "temporarilyClosedHelp": "ប្រើជម្រើសនេះ ប្រសិនបើទំព័ររបស់អ្នកមិនអាចប្រើបានក្នុងរយៈពេលខ្លី។",
    "permanentlyClosed": "បិទជាអចិន្ត្រៃយ៍",
    "permanentlyClosedHelp": "ប្រើជម្រើសនេះ ប្រសិនបើទំព័រនេះលែងសកម្ម។",
    "alwaysOpen": "បើកជានិច្ច",
    "alwaysOpenHelp": "ប្រើជម្រើសនេះ ប្រសិនបើអ្នកអានអាចទាក់ទង ឬមើលទំព័ររបស់អ្នកគ្រប់ពេល។",
    "notApplicable": "មិនអនុវត្ត",
    "notApplicableHelp": "ប្រើជម្រើសនេះ ប្រសិនបើម៉ោងបើកមិនពាក់ព័ន្ធនឹងទំព័ររបស់អ្នក។",
    "monday": "ចន្ទ",
    "tuesday": "អង្គារ",
    "wednesday": "ពុធ",
    "thursday": "ព្រហស្បតិ៍",
    "friday": "សុក្រ",
    "saturday": "សៅរ៍",
    "sunday": "អាទិត្យ",
    "mondayShort": "ច",
    "tuesdayShort": "អ",
    "wednesdayShort": "ព",
    "thursdayShort": "ព្រ",
    "fridayShort": "សុ",
    "saturdayShort": "សៅ",
    "sundayShort": "អា",
    "closed": "បិទ",
    "open24": "បើក 24 ម៉ោង",
    "everyday": "រាល់ថ្ងៃ",
    "monFri": "ចន្ទ–សុក្រ",
    "satSun": "សៅរ៍–អាទិត្យ",
    "openRange": "បើក {{range}}: {{hours}}",
    "everydayHours": "រាល់ថ្ងៃ: {{hours}}",
    "socialTitle": "បណ្ដាញសង្គម",
    "socialAdd": "បន្ថែម",
    "socialLinksTitle": "តំណបណ្ដាញសង្គមនៅលើទំព័ររបស់អ្នក",
    "selectPlatform": "ជ្រើសរើសបណ្ដាញ",
    "addLink": "បន្ថែមតំណ",
    "editLink": "កែតំណ",
    "usernameOrLink": "ឈ្មោះអ្នកប្រើ ឬតំណ",
    "socialPlaceholder": "@username ឬ https://...",
    "remove": "លុប",
    "noSocialLinks": "មិនទាន់មានតំណបណ្ដាញសង្គម",
    "dragClose": "អូសចុះដើម្បីបិទ",
    "basicPrice": "មូលដ្ឋាន",
    "standardPrice": "ស្តង់ដារ",
    "premiumPrice": "Premium",
    "exclusivePrice": "Exclusive",
    "hidePrice": "កុំបង្ហាញតម្លៃ",
    "hidePriceHelp": "លាក់ជួរតម្លៃពីទំព័រសាធារណៈរបស់អ្នក",
    "editPrice": "កែតម្លៃ",
    "reviews": "Reviews",
    "reviewsQuestion": "អនុញ្ញាតឱ្យអ្នកអានសរសេរ Review លើទំព័រអ្នកនិពន្ធរបស់អ្នកទេ?",
    "reviewsHelp": "Review ជួយអ្នកអានសម្រេចថាតើគួរ Follow ទំព័រ និងអានស្នាដៃរបស់អ្នក។ អ្នកអាចបិទវាបានគ្រប់ពេល។",
    "allowReviews": "អនុញ្ញាត Reviews",
    "editHours": "កែម៉ោងបើក",
    "open": "បើក",
    "removeHours": "លុបម៉ោង",
    "addMore": "បន្ថែមទៀត",
    "setTime": "កំណត់ម៉ោង",
    "cancel": "បោះបង់",
    "set": "កំណត់",
    "selectHours": "ជ្រើសម៉ោង",
    "leaveHoursTitle": "ចាកចេញដោយមិនរក្សាទុកម៉ោង?",
    "leaveHoursHelp": "ការកែម៉ោងរបស់អ្នកមិនទាន់បានរក្សាទុកទេ។ ប្រសិនបើចាកចេញឥឡូវ វានឹងមិនបង្ហាញលើទំព័រអ្នកនិពន្ធរបស់អ្នកទេ។",
    "leave": "ចាកចេញ",
    "keepEditing": "បន្តកែ",
    "editFacebook": "កែ Facebook Page",
    "facebookPage": "Facebook Page",
    "changeImage": "ប្តូររូបភាព",
    "pageName": "ឈ្មោះទំព័រ",
    "pageLink": "តំណទំព័រ",
    "facebookNameExample": "ឧទាហរណ៍៖ Alpha Centauri",
    "facebookImageHelp": "រូបភាពមិនមែនជាកាតព្វកិច្ចទេ។ ប្រសិនបើអ្នកមិនបន្ថែម វានឹងប្រើ Logo អ្នកនិពន្ធរបស់អ្នក។",
    "intro": "ការណែនាំ",
    "pinnedDetails": "ព័ត៌មានដែល Pin",
    "pinnedHelp": "ជ្រើសរើសព័ត៌មានរហូតដល់ 5 ដើម្បីបង្ហាញនៅផ្នែកខាងលើទំព័រ។",
    "closeCoverOptions": "បិទជម្រើស Cover",
    "seeCover": "មើល Cover",
    "uploadCover": "បង្ហោះ Cover",
    "chooseCover": "ជ្រើស Cover",
    "authorPageNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "loadAuthorFailed": "មិនអាចផ្ទុកទំព័រអ្នកនិពន្ធបានទេ",
    "loginAgain": "សូមចូលគណនីម្តងទៀត មុនរក្សាទុកព័ត៌មានទំនាក់ទំនង។",
    "saveContactFailed": "មិនអាចរក្សាទុកព័ត៌មានទំនាក់ទំនងបានទេ",
    "saved": "បានរក្សាទុក។",
    "coverPreviewUpdated": "បានកែ Cover សម្រាប់ Preview។ ការរក្សាទុករូបទៅ Backend អាចភ្ជាប់នៅពេលក្រោយ។",
    "logoPreviewUpdated": "បានកែ Logo សម្រាប់ Preview។ ការរក្សាទុករូបទៅ Backend អាចភ្ជាប់នៅពេលក្រោយ។",
    "facebookImageUpdated": "បានកែរូប Facebook Page។",
    "pageNameTooShort": "ឈ្មោះទំព័រត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ។",
    "pageUsernameTooShort": "ឈ្មោះអ្នកប្រើទំព័រត្រូវមានយ៉ាងហោចណាស់ 3 តួអក្សរ។",
    "updateAuthorFailed": "មិនអាចកែទំព័រអ្នកនិពន្ធបានទេ",
    "editPageSaved": "បានរក្សាទុក Edit Page។",
    "saveEditPageFailed": "មិនអាចរក្សាទុក Edit Page បានទេ",
    "editPage": "កែទំព័រ",
    "uploadLogo": "បង្ហោះ Logo",
    "bio": "Bio",
    "bioAdd": "បន្ថែមការណែនាំខ្លីសម្រាប់អ្នកអាន",
    "onePublicDetail": "បន្ថែមព័ត៌មានសាធារណៈខ្លីមួយ",
    "details": "ព័ត៌មានលម្អិត",
    "on": "បើក",
    "off": "បិទ",
    "reviewsVisible": "អ្នកអានអាចសរសេរ Review លើទំព័ររបស់អ្នក",
    "reviewsHidden": "Reviews ត្រូវបានលាក់ពីទំព័ររបស់អ្នក",
    "priceVisible": "ជួរតម្លៃបង្ហាញលើទំព័រសាធារណៈ",
    "priceNotShown": "ជួរតម្លៃនឹងមិនត្រូវបង្ហាញ",
    "addAddress": "បន្ថែមអាសយដ្ឋាន",
    "addOpeningHours": "បន្ថែមម៉ោងបើក",
    "links": "តំណ",
    "website": "Website",
    "addWebsite": "បន្ថែមតំណ Website",
    "addFacebookLink": "បន្ថែមតំណ Facebook Page",
    "contactInfo": "ព័ត៌មានទំនាក់ទំនង",
    "addSocial": "បន្ថែមបណ្ដាញសង្គម ឬ Public handle",
    "emailAddress": "អ៊ីមែល",
    "shownPublic": "បង្ហាញលើទំព័រសាធារណៈ",
    "addEmail": "បន្ថែមអ៊ីមែល",
    "addPhone": "បន្ថែមលេខទូរស័ព្ទ",
    "messenger": "Messenger",
    "addMessenger": "បន្ថែមឈ្មោះ ឬតំណ Messenger",
    "addTelegram": "បន្ថែមតំណ Telegram",
    "noCover": "មិនទាន់មានរូប Cover ទេ។",
    "chooseCoverSoon": "មុខងារ Choose cover នឹងមកដល់ឆាប់ៗ។",
    "editBio": "កែ Bio",
    "bioPlaceholder": "ប្រាប់អ្នកអានអំពីទំព័ររបស់អ្នក។",
    "bioUpdated": "បានកែ Bio។ ចុច Save ដើម្បីរក្សាទុកទៅ Backend។",
    "editAddress": "កែអាសយដ្ឋាន",
    "publicAddress": "បន្ថែមអាសយដ្ឋានសាធារណៈរបស់អ្នក",
    "editWebsite": "កែ Website",
    "websiteUrl": "URL Website",
    "editEmail": "កែអ៊ីមែល",
    "editPhone": "កែលេខទូរស័ព្ទ",
    "editMessenger": "កែ Messenger",
    "messengerPlaceholder": "ឈ្មោះ ឬតំណ Messenger",
    "editTelegram": "កែ Telegram",
    "websiteLabelDefault": "Shadow website"
  },
  "zh": {
    "close": "关闭",
    "back": "返回",
    "save": "保存",
    "book": "书籍",
    "public": "公开",
    "reviewsOn": "评论：开启",
    "reviewsOff": "评论：关闭",
    "priceHidden": "隐藏价格",
    "phoneNumber": "电话号码",
    "socialMedia": "社交媒体",
    "address": "地址",
    "hours": "营业时间",
    "telegram": "Telegram",
    "dailyHours": "每日营业时间",
    "dailyHoursHelp": "为你的页面设置具体营业时间。",
    "temporarilyClosed": "暂时关闭",
    "temporarilyClosedHelp": "如果页面短期不可用，请使用此选项。",
    "permanentlyClosed": "永久关闭",
    "permanentlyClosedHelp": "如果此页面不再使用，请选择此项。",
    "alwaysOpen": "始终开放",
    "alwaysOpenHelp": "如果读者随时都能联系或查看你的页面，请选择此项。",
    "notApplicable": "不适用",
    "notApplicableHelp": "如果营业时间不适用于你的页面，请选择此项。",
    "monday": "星期一",
    "tuesday": "星期二",
    "wednesday": "星期三",
    "thursday": "星期四",
    "friday": "星期五",
    "saturday": "星期六",
    "sunday": "星期日",
    "mondayShort": "一",
    "tuesdayShort": "二",
    "wednesdayShort": "三",
    "thursdayShort": "四",
    "fridayShort": "五",
    "saturdayShort": "六",
    "sundayShort": "日",
    "closed": "已关闭",
    "open24": "24 小时开放",
    "everyday": "每天",
    "monFri": "周一–周五",
    "satSun": "周六–周日",
    "openRange": "{{range}} 开放：{{hours}}",
    "everydayHours": "每天：{{hours}}",
    "socialTitle": "社交媒体",
    "socialAdd": "添加",
    "socialLinksTitle": "页面上的社交媒体链接",
    "selectPlatform": "选择平台",
    "addLink": "添加链接",
    "editLink": "编辑链接",
    "usernameOrLink": "用户名或链接",
    "socialPlaceholder": "@username or https://...",
    "remove": "移除",
    "noSocialLinks": "暂无社交媒体链接",
    "dragClose": "向下拖动关闭",
    "basicPrice": "基础",
    "standardPrice": "标准",
    "premiumPrice": "高级",
    "exclusivePrice": "专属",
    "hidePrice": "不显示价格",
    "hidePriceHelp": "从公开页面隐藏价格范围",
    "editPrice": "编辑价格",
    "reviews": "评论",
    "reviewsQuestion": "允许读者在作者页面留下评论吗？",
    "reviewsHelp": "评论可以帮助读者决定是否关注你的页面并阅读作品。你可以随时关闭。",
    "allowReviews": "允许评论",
    "editHours": "编辑营业时间",
    "open": "开放",
    "removeHours": "移除时间",
    "addMore": "添加更多",
    "setTime": "设置时间",
    "cancel": "取消",
    "set": "设置",
    "selectHours": "选择营业时间",
    "leaveHoursTitle": "不保存营业时间就离开？",
    "leaveHoursHelp": "营业时间的更改尚未保存。如果现在离开，将不会显示在作者页面。",
    "leave": "离开",
    "keepEditing": "继续编辑",
    "editFacebook": "编辑 Facebook 页面",
    "facebookPage": "Facebook Page",
    "changeImage": "更换图片",
    "pageName": "页面名称",
    "pageLink": "页面链接",
    "facebookNameExample": "示例：Alpha Centauri",
    "facebookImageHelp": "图片可选。如果不添加，将显示作者 Logo。",
    "intro": "简介",
    "pinnedDetails": "置顶信息",
    "pinnedHelp": "最多选择 5 项信息显示在页面顶部。",
    "closeCoverOptions": "关闭封面选项",
    "seeCover": "查看封面",
    "uploadCover": "上传封面",
    "chooseCover": "选择封面",
    "authorPageNotFound": "未找到作者页面",
    "loadAuthorFailed": "无法加载作者页面",
    "loginAgain": "保存联系信息前请重新登录。",
    "saveContactFailed": "无法保存联系信息",
    "saved": "已保存。",
    "coverPreviewUpdated": "封面预览已更新。后端图片保存可稍后连接。",
    "logoPreviewUpdated": "Logo 预览已更新。后端图片保存可稍后连接。",
    "facebookImageUpdated": "Facebook 页面图片已更新。",
    "pageNameTooShort": "页面名称至少需要 2 个字符。",
    "pageUsernameTooShort": "页面用户名至少需要 3 个字符。",
    "updateAuthorFailed": "无法更新作者页面",
    "editPageSaved": "页面编辑已保存。",
    "saveEditPageFailed": "无法保存页面编辑",
    "editPage": "编辑页面",
    "uploadLogo": "上传 Logo",
    "bio": "简介",
    "bioAdd": "为读者添加简短介绍",
    "onePublicDetail": "添加一项简短公开信息",
    "details": "详细信息",
    "on": "开启",
    "off": "关闭",
    "reviewsVisible": "读者可以在你的页面留下评论",
    "reviewsHidden": "评论已从页面隐藏",
    "priceVisible": "公开页面显示价格范围",
    "priceNotShown": "不会显示价格范围",
    "addAddress": "添加地址",
    "addOpeningHours": "添加营业时间",
    "links": "链接",
    "website": "网站",
    "addWebsite": "添加网站链接",
    "addFacebookLink": "添加 Facebook 页面链接",
    "contactInfo": "联系信息",
    "addSocial": "添加社交媒体或公开账号",
    "emailAddress": "邮箱地址",
    "shownPublic": "显示在公开页面",
    "addEmail": "添加邮箱地址",
    "addPhone": "添加电话号码",
    "messenger": "Messenger",
    "addMessenger": "添加 Messenger 名称或链接",
    "addTelegram": "添加 Telegram 链接",
    "noCover": "还没有封面图片。",
    "chooseCoverSoon": "选择封面功能即将推出。",
    "editBio": "编辑简介",
    "bioPlaceholder": "向读者介绍你的页面。",
    "bioUpdated": "简介已更新。点击保存以写入后端。",
    "editAddress": "编辑地址",
    "publicAddress": "添加公开地址",
    "editWebsite": "编辑网站",
    "websiteUrl": "网站 URL",
    "editEmail": "编辑邮箱",
    "editPhone": "编辑电话",
    "editMessenger": "编辑 Messenger",
    "messengerPlaceholder": "Messenger name or link",
    "editTelegram": "编辑 Telegram",
    "websiteLabelDefault": "Shadow website"
  },
  "ja": {
    "close": "閉じる",
    "back": "戻る",
    "save": "保存",
    "book": "本",
    "public": "公開",
    "reviewsOn": "レビュー：オン",
    "reviewsOff": "レビュー：オフ",
    "priceHidden": "価格を非表示",
    "phoneNumber": "電話番号",
    "socialMedia": "ソーシャルメディア",
    "address": "住所",
    "hours": "営業時間",
    "telegram": "Telegram",
    "dailyHours": "毎日の営業時間",
    "dailyHoursHelp": "ページの営業時間を設定します。",
    "temporarilyClosed": "一時休業",
    "temporarilyClosedHelp": "ページを短期間利用できない場合に使用します。",
    "permanentlyClosed": "閉業",
    "permanentlyClosedHelp": "このページを今後使用しない場合に使用します。",
    "alwaysOpen": "常時営業",
    "alwaysOpenHelp": "読者がいつでも連絡・閲覧できる場合に使用します。",
    "notApplicable": "該当なし",
    "notApplicableHelp": "営業時間がページに該当しない場合に使用します。",
    "monday": "月曜日",
    "tuesday": "火曜日",
    "wednesday": "水曜日",
    "thursday": "木曜日",
    "friday": "金曜日",
    "saturday": "土曜日",
    "sunday": "日曜日",
    "mondayShort": "月",
    "tuesdayShort": "火",
    "wednesdayShort": "水",
    "thursdayShort": "木",
    "fridayShort": "金",
    "saturdayShort": "土",
    "sundayShort": "日",
    "closed": "休業",
    "open24": "24時間営業",
    "everyday": "毎日",
    "monFri": "月–金",
    "satSun": "土–日",
    "openRange": "{{range}} 営業：{{hours}}",
    "everydayHours": "毎日：{{hours}}",
    "socialTitle": "ソーシャルメディア",
    "socialAdd": "追加",
    "socialLinksTitle": "ページのソーシャルメディアリンク",
    "selectPlatform": "プラットフォームを選択",
    "addLink": "リンクを追加",
    "editLink": "リンクを編集",
    "usernameOrLink": "ユーザー名またはリンク",
    "socialPlaceholder": "@username or https://...",
    "remove": "削除",
    "noSocialLinks": "ソーシャルメディアリンクはまだありません",
    "dragClose": "下にドラッグして閉じる",
    "basicPrice": "ベーシック",
    "standardPrice": "スタンダード",
    "premiumPrice": "プレミアム",
    "exclusivePrice": "エクスクルーシブ",
    "hidePrice": "価格を表示しない",
    "hidePriceHelp": "公開ページで価格帯を非表示にします",
    "editPrice": "価格を編集",
    "reviews": "レビュー",
    "reviewsQuestion": "作者ページで読者のレビューを許可しますか？",
    "reviewsHelp": "レビューは、読者がページをフォローして作品を読むか判断するのに役立ちます。いつでもオフにできます。",
    "allowReviews": "レビューを許可",
    "editHours": "営業時間を編集",
    "open": "営業",
    "removeHours": "時間を削除",
    "addMore": "追加",
    "setTime": "時間を設定",
    "cancel": "キャンセル",
    "set": "設定",
    "selectHours": "営業時間を選択",
    "leaveHoursTitle": "営業時間を保存せずに退出しますか？",
    "leaveHoursHelp": "営業時間の変更はまだ保存されていません。今退出すると作者ページに表示されません。",
    "leave": "退出",
    "keepEditing": "編集を続ける",
    "editFacebook": "Facebook ページを編集",
    "facebookPage": "Facebook Page",
    "changeImage": "画像を変更",
    "pageName": "ページ名",
    "pageLink": "ページリンク",
    "facebookNameExample": "例：Alpha Centauri",
    "facebookImageHelp": "画像は任意です。追加しない場合は作者ロゴが表示されます。",
    "intro": "紹介",
    "pinnedDetails": "固定情報",
    "pinnedHelp": "ページ上部に表示する情報を最大5件選択します。",
    "closeCoverOptions": "カバーオプションを閉じる",
    "seeCover": "カバーを見る",
    "uploadCover": "カバーをアップロード",
    "chooseCover": "カバーを選択",
    "authorPageNotFound": "作者ページが見つかりません",
    "loadAuthorFailed": "作者ページを読み込めませんでした",
    "loginAgain": "連絡先情報を保存する前に再度ログインしてください。",
    "saveContactFailed": "連絡先情報を保存できませんでした",
    "saved": "保存しました。",
    "coverPreviewUpdated": "カバーのプレビューを更新しました。バックエンド保存は後で接続できます。",
    "logoPreviewUpdated": "ロゴのプレビューを更新しました。バックエンド保存は後で接続できます。",
    "facebookImageUpdated": "Facebook ページ画像を更新しました。",
    "pageNameTooShort": "ページ名は2文字以上にしてください。",
    "pageUsernameTooShort": "ページユーザー名は3文字以上にしてください。",
    "updateAuthorFailed": "作者ページを更新できませんでした",
    "editPageSaved": "ページ編集を保存しました。",
    "saveEditPageFailed": "ページ編集を保存できませんでした",
    "editPage": "ページを編集",
    "uploadLogo": "ロゴをアップロード",
    "bio": "自己紹介",
    "bioAdd": "読者向けの短い紹介を追加",
    "onePublicDetail": "公開情報を1つ追加",
    "details": "詳細",
    "on": "オン",
    "off": "オフ",
    "reviewsVisible": "読者はページにレビューを残せます",
    "reviewsHidden": "レビューはページで非表示です",
    "priceVisible": "公開ページに価格帯を表示",
    "priceNotShown": "価格帯は表示されません",
    "addAddress": "住所を追加",
    "addOpeningHours": "営業時間を追加",
    "links": "リンク",
    "website": "ウェブサイト",
    "addWebsite": "ウェブサイトリンクを追加",
    "addFacebookLink": "Facebook ページリンクを追加",
    "contactInfo": "連絡先情報",
    "addSocial": "ソーシャルメディアまたは公開アカウントを追加",
    "emailAddress": "メールアドレス",
    "shownPublic": "公開ページに表示",
    "addEmail": "メールアドレスを追加",
    "addPhone": "電話番号を追加",
    "messenger": "Messenger",
    "addMessenger": "Messenger 名またはリンクを追加",
    "addTelegram": "Telegram リンクを追加",
    "noCover": "カバー写真はまだありません。",
    "chooseCoverSoon": "カバー選択機能は近日追加予定です。",
    "editBio": "自己紹介を編集",
    "bioPlaceholder": "ページについて読者に紹介してください。",
    "bioUpdated": "自己紹介を更新しました。保存を押してバックエンドに反映してください。",
    "editAddress": "住所を編集",
    "publicAddress": "公開住所を追加",
    "editWebsite": "ウェブサイトを編集",
    "websiteUrl": "ウェブサイト URL",
    "editEmail": "メールを編集",
    "editPhone": "電話番号を編集",
    "editMessenger": "Messenger を編集",
    "messengerPlaceholder": "Messenger name or link",
    "editTelegram": "Telegram を編集",
    "websiteLabelDefault": "Shadow website"
  },
  "ko": {
    "close": "닫기",
    "back": "뒤로",
    "save": "저장",
    "book": "책",
    "public": "공개",
    "reviewsOn": "리뷰: 켜짐",
    "reviewsOff": "리뷰: 꺼짐",
    "priceHidden": "가격 숨김",
    "phoneNumber": "전화번호",
    "socialMedia": "소셜 미디어",
    "address": "주소",
    "hours": "영업시간",
    "telegram": "Telegram",
    "dailyHours": "일일 영업시간",
    "dailyHoursHelp": "페이지의 구체적인 영업시간을 설정하세요.",
    "temporarilyClosed": "임시 휴업",
    "temporarilyClosedHelp": "페이지를 잠시 사용할 수 없을 때 사용하세요.",
    "permanentlyClosed": "영구 폐쇄",
    "permanentlyClosedHelp": "이 페이지가 더 이상 활성화되지 않을 때 사용하세요.",
    "alwaysOpen": "항상 영업",
    "alwaysOpenHelp": "독자가 언제든지 연락하거나 페이지를 볼 수 있을 때 사용하세요.",
    "notApplicable": "해당 없음",
    "notApplicableHelp": "영업시간이 페이지에 적용되지 않을 때 사용하세요.",
    "monday": "월요일",
    "tuesday": "화요일",
    "wednesday": "수요일",
    "thursday": "목요일",
    "friday": "금요일",
    "saturday": "토요일",
    "sunday": "일요일",
    "mondayShort": "월",
    "tuesdayShort": "화",
    "wednesdayShort": "수",
    "thursdayShort": "목",
    "fridayShort": "금",
    "saturdayShort": "토",
    "sundayShort": "일",
    "closed": "휴무",
    "open24": "24시간 영업",
    "everyday": "매일",
    "monFri": "월–금",
    "satSun": "토–일",
    "openRange": "{{range}} 영업: {{hours}}",
    "everydayHours": "매일: {{hours}}",
    "socialTitle": "소셜 미디어",
    "socialAdd": "추가",
    "socialLinksTitle": "페이지의 소셜 미디어 링크",
    "selectPlatform": "플랫폼 선택",
    "addLink": "링크 추가",
    "editLink": "링크 편집",
    "usernameOrLink": "사용자 이름 또는 링크",
    "socialPlaceholder": "@username or https://...",
    "remove": "삭제",
    "noSocialLinks": "아직 소셜 미디어 링크가 없습니다",
    "dragClose": "아래로 드래그해 닫기",
    "basicPrice": "기본",
    "standardPrice": "표준",
    "premiumPrice": "프리미엄",
    "exclusivePrice": "익스클루시브",
    "hidePrice": "가격 표시 안 함",
    "hidePriceHelp": "공개 페이지에서 가격 범위를 숨깁니다",
    "editPrice": "가격 편집",
    "reviews": "리뷰",
    "reviewsQuestion": "독자가 작가 페이지에 리뷰를 남기도록 허용할까요?",
    "reviewsHelp": "리뷰는 독자가 페이지를 팔로우하고 작품을 읽을지 결정하는 데 도움이 됩니다. 언제든 끌 수 있습니다.",
    "allowReviews": "리뷰 허용",
    "editHours": "영업시간 편집",
    "open": "영업",
    "removeHours": "시간 삭제",
    "addMore": "추가",
    "setTime": "시간 설정",
    "cancel": "취소",
    "set": "설정",
    "selectHours": "영업시간 선택",
    "leaveHoursTitle": "영업시간을 저장하지 않고 나갈까요?",
    "leaveHoursHelp": "영업시간 변경사항이 아직 저장되지 않았습니다. 지금 나가면 작가 페이지에 표시되지 않습니다.",
    "leave": "나가기",
    "keepEditing": "계속 편집",
    "editFacebook": "Facebook 페이지 편집",
    "facebookPage": "Facebook Page",
    "changeImage": "이미지 변경",
    "pageName": "페이지 이름",
    "pageLink": "페이지 링크",
    "facebookNameExample": "예: Alpha Centauri",
    "facebookImageHelp": "이미지는 선택 사항입니다. 추가하지 않으면 작가 로고가 표시됩니다.",
    "intro": "소개",
    "pinnedDetails": "고정 정보",
    "pinnedHelp": "페이지 상단에 표시할 정보를 최대 5개 선택하세요.",
    "closeCoverOptions": "커버 옵션 닫기",
    "seeCover": "커버 보기",
    "uploadCover": "커버 업로드",
    "chooseCover": "커버 선택",
    "authorPageNotFound": "작가 페이지를 찾을 수 없습니다",
    "loadAuthorFailed": "작가 페이지를 불러오지 못했습니다",
    "loginAgain": "연락처 정보를 저장하기 전에 다시 로그인해 주세요.",
    "saveContactFailed": "연락처 정보를 저장하지 못했습니다",
    "saved": "저장되었습니다.",
    "coverPreviewUpdated": "커버 미리보기가 업데이트되었습니다. 백엔드 이미지 저장은 나중에 연결할 수 있습니다.",
    "logoPreviewUpdated": "로고 미리보기가 업데이트되었습니다. 백엔드 이미지 저장은 나중에 연결할 수 있습니다.",
    "facebookImageUpdated": "Facebook 페이지 이미지가 업데이트되었습니다.",
    "pageNameTooShort": "페이지 이름은 2자 이상이어야 합니다.",
    "pageUsernameTooShort": "페이지 사용자 이름은 3자 이상이어야 합니다.",
    "updateAuthorFailed": "작가 페이지를 업데이트하지 못했습니다",
    "editPageSaved": "페이지 편집이 저장되었습니다.",
    "saveEditPageFailed": "페이지 편집을 저장하지 못했습니다",
    "editPage": "페이지 편집",
    "uploadLogo": "로고 업로드",
    "bio": "소개",
    "bioAdd": "독자를 위한 짧은 소개 추가",
    "onePublicDetail": "짧은 공개 정보 하나 추가",
    "details": "세부 정보",
    "on": "켜짐",
    "off": "꺼짐",
    "reviewsVisible": "독자가 페이지에 리뷰를 남길 수 있습니다",
    "reviewsHidden": "리뷰가 페이지에서 숨겨져 있습니다",
    "priceVisible": "공개 페이지에 가격 범위 표시",
    "priceNotShown": "가격 범위가 표시되지 않습니다",
    "addAddress": "주소 추가",
    "addOpeningHours": "영업시간 추가",
    "links": "링크",
    "website": "웹사이트",
    "addWebsite": "웹사이트 링크 추가",
    "addFacebookLink": "Facebook 페이지 링크 추가",
    "contactInfo": "연락처 정보",
    "addSocial": "소셜 미디어 또는 공개 계정 추가",
    "emailAddress": "이메일 주소",
    "shownPublic": "공개 페이지에 표시",
    "addEmail": "이메일 주소 추가",
    "addPhone": "전화번호 추가",
    "messenger": "Messenger",
    "addMessenger": "Messenger 이름 또는 링크 추가",
    "addTelegram": "Telegram 링크 추가",
    "noCover": "아직 커버 사진이 없습니다.",
    "chooseCoverSoon": "커버 선택 기능은 곧 제공됩니다.",
    "editBio": "소개 편집",
    "bioPlaceholder": "독자에게 페이지를 소개하세요.",
    "bioUpdated": "소개가 업데이트되었습니다. 저장을 눌러 백엔드에 반영하세요.",
    "editAddress": "주소 편집",
    "publicAddress": "공개 주소 추가",
    "editWebsite": "웹사이트 편집",
    "websiteUrl": "웹사이트 URL",
    "editEmail": "이메일 편집",
    "editPhone": "전화번호 편집",
    "editMessenger": "Messenger 편집",
    "messengerPlaceholder": "Messenger name or link",
    "editTelegram": "Telegram 편집",
    "websiteLabelDefault": "Shadow website"
  }
})

function detailsText(key, options) {
  return getDisplayText(`authorPageEditDetails.${key}`, options)
}

import {
  fetchMyAuthorPageCached,
  invalidateMyAuthorPageClientCache,
} from '../../services/myAuthorPageClientCache.js'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DETAILS_STORAGE_KEY = 'shadow_author_page_profile_details'

const DEFAULT_DETAILS = {
  pinned_details: 'Book · $$',
  pinned_detail_keys: ['book', 'price'],
  price_range: '$$',
  reviews_enabled: true,
  website_label: 'Shadow website',
  website_url: 'https://www.shadowerabook.site/',
  facebook_page_name: '',
  facebook_page_url: '',
  facebook_page_image_url: '',
  social_media: '',
  social_links: [],
  email: '',
  phone: '',
  messenger: '',
  telegram: '',
  address: '',
  hours: '',
  hours_type: 'always_open',
  hours_schedule: null,
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readStoredDetails() {
  try {
    return {
      ...DEFAULT_DETAILS,
      ...(JSON.parse(localStorage.getItem(DETAILS_STORAGE_KEY) || '{}') || {}),
    }
  } catch {
    return DEFAULT_DETAILS
  }
}

function writeStoredDetails(nextDetails) {
  localStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(nextDetails))
}

function normalizeUsername(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
}

function getSearchSection(search) {
  const value = new URLSearchParams(search).get('section')
  return value || 'top'
}

function getPinnedDetailOptions(details) {
  return [
    {
      key: 'book',
      icon: 'fa-solid fa-book',
      title: detailsText('book'),
      text: detailsText('public'),
      display: detailsText('book'),
    },
    {
      key: 'reviews',
      icon: 'fa-regular fa-star',
      title: details.reviews_enabled ? detailsText('reviewsOn') : detailsText('reviewsOff'),
      text: detailsText('public'),
      display: details.reviews_enabled ? detailsText('reviewsOn') : '',
    },
    {
      key: 'price',
      icon: 'fa-solid fa-dollar-sign',
      title: details.price_range || detailsText('priceHidden'),
      text: detailsText('public'),
      display: details.price_range || '',
    },
    {
      key: 'phone',
      icon: 'fa-solid fa-phone',
      title: details.phone || detailsText('phoneNumber'),
      text: detailsText('public'),
      display: details.phone || '',
    },
    {
      key: 'social',
      icon: 'fa-solid fa-at',
      title: getSocialMediaSummary(details.social_links, details.social_media) || detailsText('socialMedia'),
      text: detailsText('public'),
      display: getSocialMediaSummary(details.social_links, details.social_media),
    },
    {
      key: 'address',
      icon: 'fa-solid fa-location-dot',
      title: details.address || detailsText('address'),
      text: detailsText('public'),
      display: details.address || '',
    },
    {
      key: 'hours',
      icon: 'fa-regular fa-clock',
      title: details.hours || detailsText('hours'),
      text: detailsText('public'),
      display: details.hours || '',
    },
    {
      key: 'telegram',
      icon: 'fa-brands fa-telegram',
      title: details.telegram || detailsText('telegram'),
      text: detailsText('public'),
      display: details.telegram || '',
    },
  ]
}

function makePinnedDetailsText(details, keys) {
  const options = getPinnedDetailOptions(details)
  return keys
    .map((key) => options.find((option) => option.key === key)?.display)
    .filter(Boolean)
    .join(' · ')
}

function makePinnedDetailsStorageText(details, keys) {
  const socialSummary = getSocialMediaSummary(details.social_links, details.social_media)
  const displayMap = {
    book: 'Book',
    reviews: details.reviews_enabled ? 'Reviews: On' : '',
    price: details.price_range || '',
    phone: details.phone || '',
    social: socialSummary,
    address: details.address || '',
    hours: details.hours || '',
    telegram: details.telegram || '',
  }

  return keys
    .map((key) => displayMap[key])
    .filter(Boolean)
    .join(' · ')
}

const HOUR_TYPES = [
  {
    value: 'daily_hours',
    titleKey: 'dailyHours',
    textKey: 'dailyHoursHelp',
  },
  {
    value: 'temporarily_closed',
    titleKey: 'temporarilyClosed',
    textKey: 'temporarilyClosedHelp',
  },
  {
    value: 'permanently_closed',
    titleKey: 'permanentlyClosed',
    textKey: 'permanentlyClosedHelp',
  },
  {
    value: 'always_open',
    titleKey: 'alwaysOpen',
    textKey: 'alwaysOpenHelp',
  },
  {
    value: 'not_applicable',
    titleKey: 'notApplicable',
    textKey: 'notApplicableHelp',
  },
]

const WEEK_DAYS = [
  { key: 'monday', shortKey: 'mondayShort', labelKey: 'monday' },
  { key: 'tuesday', shortKey: 'tuesdayShort', labelKey: 'tuesday' },
  { key: 'wednesday', shortKey: 'wednesdayShort', labelKey: 'wednesday' },
  { key: 'thursday', shortKey: 'thursdayShort', labelKey: 'thursday' },
  { key: 'friday', shortKey: 'fridayShort', labelKey: 'friday' },
  { key: 'saturday', shortKey: 'saturdayShort', labelKey: 'saturday' },
  { key: 'sunday', shortKey: 'sundayShort', labelKey: 'sunday' },
]

function makeDefaultHoursSchedule() {
  return WEEK_DAYS.reduce((result, day) => {
    result[day.key] = {
      closed: true,
      open_24_hours: false,
      ranges: [{ open: '', close: '' }],
    }
    return result
  }, {})
}

function getHoursTypeLabel(type) {
  return detailsText(HOUR_TYPES.find((item) => item.value === type)?.titleKey || 'alwaysOpen')
}

function normalizeHoursType(value) {
  return HOUR_TYPES.some((item) => item.value === value) ? value : 'always_open'
}

function normalizeHoursSchedule(value) {
  const base = makeDefaultHoursSchedule()
  const source = value && typeof value === 'object' ? value : {}

  WEEK_DAYS.forEach((day) => {
    const current = source[day.key] || {}
    const ranges = Array.isArray(current.ranges) && current.ranges.length
      ? current.ranges.map((range) => ({
          open: String(range.open || ''),
          close: String(range.close || ''),
        }))
      : [{ open: '', close: '' }]

    base[day.key] = {
      closed: current.closed !== false,
      open_24_hours: Boolean(current.open_24_hours),
      ranges,
    }
  })

  return base
}

function summarizeDayHours(dayData) {
  if (!dayData) return detailsText('closed')
  if (dayData.open_24_hours) return detailsText('open24')
  if (dayData.closed) return detailsText('closed')

  const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : []
  const validRanges = ranges.filter((range) => range.open && range.close)

  if (!validRanges.length) return detailsText('closed')

  return validRanges.map((range) => `${range.open} – ${range.close}`).join(', ')
}

function summarizeHours(type, schedule) {
  if (type === 'always_open') return detailsText('alwaysOpen')
  if (type === 'temporarily_closed') return detailsText('temporarilyClosed')
  if (type === 'permanently_closed') return detailsText('permanentlyClosed')
  if (type === 'not_applicable') return ''
  if (type !== 'daily_hours') return detailsText('alwaysOpen')

  const dayShortLabels = {
    monday: detailsText('mondayShort'),
    tuesday: detailsText('tuesdayShort'),
    wednesday: detailsText('wednesdayShort'),
    thursday: detailsText('thursdayShort'),
    friday: detailsText('fridayShort'),
    saturday: detailsText('saturdayShort'),
    sunday: detailsText('sundayShort'),
  }

  const openDays = WEEK_DAYS.map((day, index) => {
    const text = summarizeDayHours(schedule?.[day.key])

    return {
      ...day,
      index,
      text,
      isOpen: text !== detailsText('closed'),
    }
  }).filter((day) => day.isOpen)

  if (!openDays.length) return detailsText('closed')

  const firstHours = openDays[0].text
  const allSevenDaysOpen = openDays.length === 7
  const allSameHours = openDays.every((day) => day.text === firstHours)

  if (allSevenDaysOpen && allSameHours) {
    return detailsText('everydayHours', { hours: firstHours })
  }

  const groups = []

  openDays.forEach((day) => {
    const lastGroup = groups[groups.length - 1]

    if (
      lastGroup &&
      lastGroup.text === day.text &&
      lastGroup.endIndex + 1 === day.index
    ) {
      lastGroup.endIndex = day.index
      return
    }

    groups.push({
      startIndex: day.index,
      endIndex: day.index,
      text: day.text,
    })
  })

  function getDayRangeLabel(startIndex, endIndex) {
    const startDay = WEEK_DAYS[startIndex]
    const endDay = WEEK_DAYS[endIndex]

    if (startIndex === 0 && endIndex === 6) return detailsText('everyday')
    if (startIndex === 0 && endIndex === 4) return detailsText('monFri')
    if (startIndex === 5 && endIndex === 6) return detailsText('satSun')

    if (startIndex === endIndex) {
      return detailsText(startDay.labelKey)
    }

    return `${dayShortLabels[startDay.key]}–${dayShortLabels[endDay.key]}`
  }

  return groups
    .map((group) => {
      const label = getDayRangeLabel(group.startIndex, group.endIndex)

      if (label === detailsText('everyday')) {
        return detailsText('everydayHours', { hours: group.text })
      }

      return detailsText('openRange', { range: label, hours: group.text })
    })
    .join('\n')
}


function summarizeDayHoursStorage(dayData) {
  if (!dayData) return 'Closed'
  if (dayData.open_24_hours) return 'Open 24 hours'
  if (dayData.closed) return 'Closed'

  const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : []
  const validRanges = ranges.filter((range) => range.open && range.close)

  if (!validRanges.length) return 'Closed'

  return validRanges.map((range) => `${range.open} – ${range.close}`).join(', ')
}

function summarizeHoursStorage(type, schedule) {
  if (type === 'always_open') return 'Always open'
  if (type === 'temporarily_closed') return 'Temporarily closed'
  if (type === 'permanently_closed') return 'Permanently closed'
  if (type === 'not_applicable') return ''
  if (type !== 'daily_hours') return 'Always open'

  const dayShortLabels = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  }

  const openDays = WEEK_DAYS.map((day, index) => {
    const text = summarizeDayHoursStorage(schedule?.[day.key])

    return {
      ...day,
      index,
      text,
      isOpen: text !== 'Closed',
    }
  }).filter((day) => day.isOpen)

  if (!openDays.length) return 'Closed'

  const firstHours = openDays[0].text
  const allSevenDaysOpen = openDays.length === 7
  const allSameHours = openDays.every((day) => day.text === firstHours)

  if (allSevenDaysOpen && allSameHours) {
    return `Everyday: ${firstHours}`
  }

  const groups = []

  openDays.forEach((day) => {
    const lastGroup = groups[groups.length - 1]

    if (
      lastGroup &&
      lastGroup.text === day.text &&
      lastGroup.endIndex + 1 === day.index
    ) {
      lastGroup.endIndex = day.index
      return
    }

    groups.push({
      startIndex: day.index,
      endIndex: day.index,
      text: day.text,
    })
  })

  function getDayRangeLabel(startIndex, endIndex) {
    const startDay = WEEK_DAYS[startIndex]
    const endDay = WEEK_DAYS[endIndex]

    if (startIndex === 0 && endIndex === 6) return 'Everyday'
    if (startIndex === 0 && endIndex === 4) return 'Mon–Fri'
    if (startIndex === 5 && endIndex === 6) return 'Sat–Sun'

    if (startIndex === endIndex) {
      const labels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      }
      return labels[startDay.key]
    }

    return `${dayShortLabels[startDay.key]}–${dayShortLabels[endDay.key]}`
  }

  return groups
    .map((group) => {
      const label = getDayRangeLabel(group.startIndex, group.endIndex)

      if (label === 'Everyday') {
        return `Everyday: ${group.text}`
      }

      return `Open ${label}: ${group.text}`
    })
    .join('\n')
}


function makeTimeOptions() {
  const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

  return { hours, minutes, periods: ['AM', 'PM'] }
}

function FieldRow({ icon, title, value, placeholder, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 py-2 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[15px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-normal leading-5 text-[var(--shadow-text-primary)]">{title}</span>
        <span className={`mt-0.5 block whitespace-pre-wrap break-words text-[11px] font-normal leading-4 ${value ? 'text-[var(--shadow-text-secondary)]' : 'text-[var(--shadow-text-tertiary)]'}`}>
          {value || placeholder}
        </span>
      </span>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)]">
        <i className="fa-solid fa-pen text-[12px]" />
      </span>
    </button>
  )
}

function SectionBlock({ id, title, children, sectionRef }) {
  return (
    <section ref={sectionRef} id={id} className="scroll-mt-20">
      <div className="mb-1">
        <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">{title}</h2>
      </div>
      <div className="space-y-0">{children}</div>
    </section>
  )
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[260] bg-[var(--shadow-bg-surface)]">
      <header className="sticky top-0 z-10 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-12 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]"
            aria-label={detailsText('close')}
          >
            <i className="fa-solid fa-xmark text-[18px] text-[var(--shadow-text-primary)]" />
          </button>

          <h2 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{title}</h2>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-24 pt-5">{children}</main>
    </div>
  )
}

function TextEditModal({ open, title, label, value, multiline, placeholder, maxLength, onClose, onSave }) {
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    if (open) setDraft(value || '')
  }, [open, value])

  if (!open) return null

  const canSave = draft.trim() !== String(value || '').trim()

  return (
    <ModalShell title={title} onClose={onClose}>
      <label className="mb-1.5 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">{label}</label>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-h-[128px] w-full rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
        />
      ) : (
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
        />
      )}

      {maxLength ? (
        <div className="mt-2 text-right text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
          {draft.length}/{maxLength}
        </div>
      ) : null}

     <div className="fixed bottom-0 left-0 right-0 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
  <button
    type="button"
    disabled={!canSave}
    onClick={() => onSave(draft.trim())}
    className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
  >{detailsText('save')}</button>
</div>
    </ModalShell>
  )
}

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
  { key: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram' },
  { key: 'tiktok', label: 'TikTok', icon: 'fa-brands fa-tiktok' },
  { key: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube' },
  { key: 'threads', label: 'Threads', icon: 'fa-solid fa-at' },
  { key: 'x', label: 'X', icon: 'fa-brands fa-x-twitter' },
  { key: 'snapchat', label: 'Snapchat', icon: 'fa-brands fa-snapchat' },
  { key: 'twitch', label: 'Twitch', icon: 'fa-brands fa-twitch' },
  { key: 'line', label: 'LINE', icon: 'fa-brands fa-line' },
  { key: 'wechat', label: 'WeChat', icon: 'fa-brands fa-weixin' },
  { key: 'kik', label: 'Kik', icon: 'fa-solid fa-comment-dots' },
  { key: 'pinterest', label: 'Pinterest', icon: 'fa-brands fa-pinterest-p' },
  { key: 'tumblr', label: 'Tumblr', icon: 'fa-brands fa-tumblr' },
  { key: 'soundcloud', label: 'SoundCloud', icon: 'fa-brands fa-soundcloud' },
]

const SOCIAL_TEXT = {
  "en": {
    "title": "Social media",
    "add": "Add",
    "linksTitle": "Social media links on your Page",
    "selectPlatform": "Select platform",
    "addLink": "Add link",
    "editLink": "Edit link",
    "inputLabel": "Username or link",
    "inputPlaceholder": "@username or https://...",
    "remove": "Remove",
    "save": "Save",
    "empty": "No social media links yet"
  },
  "km": {
    "title": "បណ្ដាញសង្គម",
    "add": "បន្ថែម",
    "linksTitle": "តំណបណ្ដាញសង្គមនៅលើទំព័ររបស់អ្នក",
    "selectPlatform": "ជ្រើសរើសបណ្ដាញ",
    "addLink": "បន្ថែមតំណ",
    "editLink": "កែតំណ",
    "inputLabel": "ឈ្មោះអ្នកប្រើ ឬតំណ",
    "inputPlaceholder": "@username ឬ https://...",
    "remove": "លុប",
    "save": "រក្សាទុក",
    "empty": "មិនទាន់មានតំណបណ្ដាញសង្គម"
  },
  "zh": {
    "title": "社交媒体",
    "add": "添加",
    "linksTitle": "页面上的社交媒体链接",
    "selectPlatform": "选择平台",
    "addLink": "添加链接",
    "editLink": "编辑链接",
    "inputLabel": "用户名或链接",
    "inputPlaceholder": "@username or https://...",
    "remove": "移除",
    "save": "保存",
    "empty": "暂无社交媒体链接"
  },
  "ja": {
    "title": "ソーシャルメディア",
    "add": "追加",
    "linksTitle": "ページのソーシャルメディアリンク",
    "selectPlatform": "プラットフォームを選択",
    "addLink": "リンクを追加",
    "editLink": "リンクを編集",
    "inputLabel": "ユーザー名またはリンク",
    "inputPlaceholder": "@username or https://...",
    "remove": "削除",
    "save": "保存",
    "empty": "ソーシャルメディアリンクはまだありません"
  },
  "ko": {
    "title": "소셜 미디어",
    "add": "추가",
    "linksTitle": "페이지의 소셜 미디어 링크",
    "selectPlatform": "플랫폼 선택",
    "addLink": "링크 추가",
    "editLink": "링크 편집",
    "inputLabel": "사용자 이름 또는 링크",
    "inputPlaceholder": "@username or https://...",
    "remove": "삭제",
    "save": "저장",
    "empty": "아직 소셜 미디어 링크가 없습니다"
  }
}

function getSocialLanguage() {
  const language = getDisplayLanguageId()
  return ['km', 'en', 'zh', 'ja', 'ko'].includes(language) ? language : 'en'
}

function socialText(key) {
  const lang = getSocialLanguage()
  return SOCIAL_TEXT[lang]?.[key] || SOCIAL_TEXT.en[key] || key
}

function getSocialPlatform(key) {
  return SOCIAL_PLATFORMS.find((item) => item.key === key) || SOCIAL_PLATFORMS[0]
}

function createSocialLinkId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `social-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function cleanSocialHandle(value) {
  return String(value || '').trim().replace(/^@+/, '')
}

function buildSocialUrl(platform, value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  const handle = cleanSocialHandle(raw)

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/${handle}`
    case 'instagram':
      return `https://www.instagram.com/${handle}/`
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`
    case 'youtube':
      return `https://www.youtube.com/@${handle}`
    case 'threads':
      return `https://www.threads.net/@${handle}`
    case 'x':
      return `https://x.com/${handle}`
    case 'snapchat':
      return `https://www.snapchat.com/add/${handle}`
    case 'twitch':
      return `https://www.twitch.tv/${handle}`
    case 'line':
      return `https://line.me/R/ti/p/@${handle}`
    case 'wechat':
      return ''
    case 'kik':
      return `https://kik.me/${handle}`
    case 'pinterest':
      return `https://www.pinterest.com/${handle}/`
    case 'tumblr':
      return `https://${handle}.tumblr.com`
    case 'soundcloud':
      return `https://soundcloud.com/${handle}`
    default:
      return raw
  }
}

function detectSocialPlatform(url) {
  const value = String(url || '').toLowerCase()
  if (value.includes('facebook.com') || value.includes('fb.com')) return 'facebook'
  if (value.includes('instagram.com')) return 'instagram'
  if (value.includes('tiktok.com')) return 'tiktok'
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube'
  if (value.includes('threads.net')) return 'threads'
  if (value.includes('x.com') || value.includes('twitter.com')) return 'x'
  if (value.includes('snapchat.com')) return 'snapchat'
  if (value.includes('twitch.tv')) return 'twitch'
  if (value.includes('line.me')) return 'line'
  if (value.includes('wechat.com') || value.includes('weixin.qq.com')) return 'wechat'
  if (value.includes('kik.me')) return 'kik'
  if (value.includes('pinterest.com') || value.includes('pin.it')) return 'pinterest'
  if (value.includes('tumblr.com')) return 'tumblr'
  if (value.includes('soundcloud.com')) return 'soundcloud'
  return 'facebook'
}

function normalizeSocialLinks(value) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => item && typeof item === 'object' && item.platform)
    .map((item, index) => {
      const platform = String(item.platform || 'facebook')
      const rawValue = String(item.value || item.url || item.display_name || '').trim()
      return {
        id: String(item.id || `social-${index}`),
        platform,
        value: rawValue,
        display_name: String(item.display_name || rawValue).trim(),
        url: String(item.url || buildSocialUrl(platform, rawValue)).trim(),
      }
    })
    .filter((item) => item.value || item.display_name || item.url)
}

function extractLegacySocialLinks(value) {
  const raw = String(value || '')
  const urls = raw.match(/https?:\/\/[^\s]+/gi) || []

  return urls.map((url, index) => {
    const platform = detectSocialPlatform(url)
    return {
      id: `legacy-social-${index}`,
      platform,
      value: url,
      display_name: url,
      url,
    }
  })
}

function getSocialMediaSummary(value, legacyValue = '') {
  const links = normalizeSocialLinks(value)
  if (!links.length) return String(legacyValue || '').trim()

  const first = links[0]
  const platform = getSocialPlatform(first.platform)
  const primary = first.display_name || first.value || platform.label
  return `${primary}${links.length > 1 ? ` + ${links.length - 1}` : ''}`
}

function SocialMediaModal({ open, value, legacyValue = '', onClose, onChange }) {
  const [screen, setScreen] = useState('list')
  const [chooserOpen, setChooserOpen] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('facebook')
  const [draft, setDraft] = useState('')
  const chooserDragStartRef = useRef(null)
  const chooserDragCurrentRef = useRef(0)
  const [chooserDragY, setChooserDragY] = useState(0)

  useEffect(() => {
    if (!open) return
    setScreen('list')
    setChooserOpen(false)
    setEditingId('')
    setSelectedPlatform('facebook')
    setDraft('')
    setChooserDragY(0)
  }, [open])

  useEffect(() => {
    if (chooserOpen) return
    chooserDragStartRef.current = null
    chooserDragCurrentRef.current = 0
    setChooserDragY(0)
  }, [chooserOpen])

  if (!open) return null

  const savedLinks = normalizeSocialLinks(value)
  const links = savedLinks.length ? savedLinks : extractLegacySocialLinks(legacyValue)
  const selected = getSocialPlatform(selectedPlatform)

  const closeChooser = () => {
    setChooserOpen(false)
    setChooserDragY(0)
  }

  const startAdd = (platformKey) => {
    setSelectedPlatform(platformKey)
    setEditingId('')
    setDraft('')
    closeChooser()
    setScreen('edit')
  }

  const startEdit = (item) => {
    setSelectedPlatform(item.platform)
    setEditingId(item.id)
    setDraft(item.value || item.url || item.display_name || '')
    closeChooser()
    setScreen('edit')
  }

  const closeEdit = () => {
    setScreen('list')
    setEditingId('')
    setDraft('')
  }

  const saveDraft = () => {
    const raw = draft.trim()
    if (!raw) return

    const nextItem = {
      id: editingId || createSocialLinkId(),
      platform: selectedPlatform,
      value: raw,
      display_name: /^https?:\/\//i.test(raw) ? raw : cleanSocialHandle(raw),
      url: buildSocialUrl(selectedPlatform, raw),
    }

    const nextLinks = editingId
      ? links.map((item) => (item.id === editingId ? nextItem : item))
      : [...links, nextItem]

    onChange(nextLinks)
    closeEdit()
  }

  const removeLink = () => {
    if (!editingId) return
    onChange(links.filter((item) => item.id !== editingId))
    closeEdit()
  }

  const handleChooserPointerStart = (event) => {
    chooserDragStartRef.current = event.clientY
    chooserDragCurrentRef.current = 0
  }

  const handleChooserPointerMove = (event) => {
    if (chooserDragStartRef.current === null) return
    const delta = Math.max(0, event.clientY - chooserDragStartRef.current)
    chooserDragCurrentRef.current = delta
    setChooserDragY(delta)
  }

  const handleChooserPointerEnd = () => {
    if (chooserDragStartRef.current === null) return
    const delta = chooserDragCurrentRef.current
    chooserDragStartRef.current = null
    chooserDragCurrentRef.current = 0

    if (delta > 90) {
      closeChooser()
      return
    }

    setChooserDragY(0)
  }

  if (screen === 'edit') {
    return (
      <div className="fixed inset-0 z-[90] bg-[var(--shadow-bg-surface)] dark:bg-[#18191c]">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] dark:bg-[#18191c] dark:text-white">
          <div className="relative flex h-14 shrink-0 items-center justify-center px-4">
            <button
              type="button"
              onClick={closeEdit}
              className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] dark:text-white"
              aria-label={detailsText('back')}
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>
            <h2 className="text-[16px] font-medium">
              {editingId ? socialText('editLink') : socialText('addLink')}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
            <div className="mb-6 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[28px] dark:bg-[#2a2b2f]">
                <i className={selected.icon} />
              </div>
              <div className="mt-3 text-[18px] font-normal">{selected.label}</div>
            </div>

            <label className="block">
              <span className="mb-2 block text-[13px] font-normal text-[var(--shadow-text-secondary)] dark:text-[var(--shadow-text-secondary)]">
                {socialText('inputLabel')}
              </span>
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={socialText('inputPlaceholder')}
                autoFocus
                className="h-11 w-full rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 text-[15px] font-normal outline-none placeholder:text-[var(--shadow-text-tertiary)] focus:bg-[var(--shadow-bg-surface)] focus:ring-1 focus:ring-[#1877f2] dark:bg-[#242526] dark:text-white"
              />
            </label>

            {editingId ? (
              <button
                type="button"
                onClick={removeLink}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--shadow-bg-soft)] text-[15px] font-normal text-[var(--shadow-text-primary)] dark:bg-[#3a3b3c] dark:text-white"
              >
                <i className="fa-solid fa-trash text-[14px]" />
                {socialText('remove')}
              </button>
            ) : null}
          </div>

          <div className="shrink-0 bg-[var(--shadow-bg-surface)] px-4 pb-5 pt-3 dark:bg-[#18191c]">
            <button
              type="button"
              onClick={saveDraft}
              disabled={!draft.trim()}
              className="h-11 w-full rounded-[14px] bg-[#1877f2] text-[15px] font-medium text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:disabled:bg-[#3a3b3c] dark:disabled:text-[var(--shadow-text-disabled)]"
            >
              {socialText('save')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[90] bg-[var(--shadow-bg-surface)] dark:bg-[#18191c]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] dark:bg-[#18191c] dark:text-white">
        <div className="relative flex h-14 shrink-0 items-center justify-center px-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] dark:text-white"
            aria-label={detailsText('close')}
          >
            <i className="fa-solid fa-xmark text-[20px]" />
          </button>
          <h2 className="text-[16px] font-medium">{socialText('title')}</h2>
        </div>

        <div className="shrink-0 px-4 pb-3 pt-2">
          <button
            type="button"
            onClick={() => setChooserOpen(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--shadow-bg-soft)] text-[16px] font-normal text-[var(--shadow-text-primary)] dark:bg-[#3a3b3c] dark:text-white"
          >
            <i className="fa-solid fa-plus text-[16px]" />
            {socialText('add')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <h3 className="mb-3 text-[16px] font-medium">{socialText('linksTitle')}</h3>

          {links.length ? (
            <div className="space-y-1">
              {links.map((item) => {
                const platform = getSocialPlatform(item.platform)
                return (
                  <div key={item.id} className="flex min-h-[64px] items-center gap-3 rounded-[14px] px-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[23px]">
                      <i className={platform.icon} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[15px] font-normal text-[var(--shadow-text-primary)] dark:text-white">
                        {item.display_name || item.value || platform.label}
                      </div>
                      <div className="mt-0.5 text-[13px] font-normal text-[var(--shadow-text-secondary)] dark:text-[var(--shadow-text-secondary)]">
                        {platform.label}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)] dark:text-[var(--shadow-text-secondary)]"
                      aria-label={`Edit ${platform.label}`}
                    >
                      <i className="fa-solid fa-pen text-[15px]" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-[14px] font-normal text-[var(--shadow-text-secondary)] dark:text-[var(--shadow-text-secondary)]">
              {socialText('empty')}
            </div>
          )}
        </div>
      </div>

      {chooserOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/30" onClick={closeChooser}>
          <div
            className="w-full rounded-t-[24px] bg-[var(--shadow-bg-surface)] px-4 pb-5 pt-2 text-[var(--shadow-text-primary)] shadow-2xl dark:bg-[#242526] dark:text-white"
            onClick={(event) => event.stopPropagation()}
            onPointerMove={handleChooserPointerMove}
            onPointerUp={handleChooserPointerEnd}
            onPointerCancel={handleChooserPointerEnd}
            style={{
              transform: `translateY(${chooserDragY}px)`,
              transition: chooserDragStartRef.current === null ? 'transform 180ms ease' : 'none',
            }}
          >
            <button
              type="button"
              onPointerDown={handleChooserPointerStart}
              className="flex w-full touch-none justify-center pb-2 pt-1"
              aria-label={detailsText('dragClose')}
            >
              <span className="h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)]" />
            </button>

            <div className="pb-3 text-center text-[16px] font-medium">
              {socialText('selectPlatform')}
            </div>

            <div className="max-h-[62dvh] overflow-y-auto pb-1">
              {SOCIAL_PLATFORMS.map((platform) => (
                <button
                  key={platform.key}
                  type="button"
                  onClick={() => startAdd(platform.key)}
                  className="flex min-h-[56px] w-full items-center gap-4 rounded-[14px] px-1 text-left active:bg-[var(--shadow-bg-hover)] dark:active:bg-[#3a3b3c]"
                >
                  <span className="flex h-9 w-9 items-center justify-center text-[23px]">
                    <i className={platform.icon} />
                  </span>
                  <span className="text-[15px] font-normal">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function PriceModal({ open, value, onClose, onSave }) {
  const [draft, setDraft] = useState(typeof value === 'string' ? value : '$$')

  useEffect(() => {
    if (open) setDraft(typeof value === 'string' ? value : '$$')
  }, [open, value])

  if (!open) return null

  const options = [
    { value: '$', title: '$', textKey: 'basicPrice' },
    { value: '$$', title: '$$', textKey: 'standardPrice' },
    { value: '$$$', title: '$$$', textKey: 'premiumPrice' },
    { value: '$$$$', title: '$$$$', textKey: 'exclusivePrice' },
    { value: '', titleKey: 'hidePrice', textKey: 'hidePriceHelp' },
  ]

  return (
    <ModalShell title={detailsText('editPrice')} onClose={onClose}>
      <div className="mx-auto w-full max-w-[520px] pt-2">
        <div className="space-y-1">
          {options.map((option) => {
            const active = draft === option.value

            return (
              <button
                key={option.value || 'hidden'}
                type="button"
                onClick={() => setDraft(option.value)}
                className="flex w-full items-center justify-between gap-4 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">{detailsText(option.titleKey)}</span>
                  <span className="mt-0.5 block text-[13px] font-normal text-[var(--shadow-text-secondary)]">{detailsText(option.textKey)}</span>
                </span>

                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#1877f2]' : 'border-[var(--shadow-border-strong)]'}`}>
                  {active ? <span className="h-4 w-4 rounded-full bg-[#1877f2]" /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white active:scale-[0.99]"
          >{detailsText('save')}</button>
        </div>
      </div>
    </ModalShell>
  )
}

function ReviewsModal({ open, value, onClose, onSave }) {
  const [draft, setDraft] = useState(Boolean(value))

  useEffect(() => {
    if (open) setDraft(Boolean(value))
  }, [open, value])

  if (!open) return null

  return (
    <ModalShell title={detailsText('reviews')} onClose={onClose}>
      <div className="mx-auto w-full max-w-[520px] pt-3">
        <h3 className="text-[20px] font-semibold leading-7 text-[var(--shadow-text-primary)] sm:text-[21px]">
          {detailsText('reviewsQuestion')}
        </h3>

        <p className="mt-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-secondary)] sm:text-[15px]">
          {detailsText('reviewsHelp')}
        </p>

        <button
          type="button"
          onClick={() => setDraft((current) => !current)}
          className="mt-7 flex w-full items-center justify-between gap-4 rounded-[14px] py-3 text-left active:bg-[var(--shadow-bg-soft)]"
        >
          <span className="text-[15px] font-normal text-[var(--shadow-text-primary)] sm:text-[16px]">{detailsText('allowReviews')}</span>
          <span className={`flex h-6 w-6 items-center justify-center rounded-[7px] ${draft ? 'bg-[#1877f2]' : 'border border-[var(--shadow-border-strong)]'}`}>
            {draft ? <i className="fa-solid fa-check text-[12px] text-white" /> : null}
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white active:scale-[0.99]"
          >{detailsText('save')}</button>
        </div>
      </div>
    </ModalShell>
  )
}

function HoursModal({ open, details, onClose, onSave }) {
  
  const currentType = normalizeHoursType(details?.hours_type)
  const currentSchedule = normalizeHoursSchedule(details?.hours_schedule)

  const [draftType, setDraftType] = useState(currentType)
  const [draftSchedule, setDraftSchedule] = useState(currentSchedule)
  const [selectOpen, setSelectOpen] = useState(false)
  const [editDayOpen, setEditDayOpen] = useState(false)
  const [activeDay, setActiveDay] = useState('monday')
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [timePicker, setTimePicker] = useState(null)
  const [timeDraft, setTimeDraft] = useState({ hour: '12', minute: '00', period: 'AM' })

  const timeOptions = useMemo(() => makeTimeOptions(), [])

  useEffect(() => {
    if (!open) return
    setDraftType(currentType)
    setDraftSchedule(currentSchedule)
    setSelectOpen(false)
    setEditDayOpen(false)
    setActiveDay('monday')
    setExitConfirmOpen(false)
    setTimePicker(null)
  }, [open, currentType, JSON.stringify(currentSchedule)])

  if (!open) return null

  const draftSummary = summarizeHours(draftType, draftSchedule)
  const currentSummary = summarizeHours(currentType, currentSchedule)
  const canSave =
  draftType !== currentType ||
  JSON.stringify(draftSchedule) !== JSON.stringify(currentSchedule) ||
  draftSummary !== currentSummary

  function handleRequestClose() {
    if (canSave) {
      setExitConfirmOpen(true)
      return
    }

    onClose()
  }

  

  function updateDay(dayKey, patch) {
    setDraftSchedule((current) => ({
      ...current,
      [dayKey]: {
        ...current[dayKey],
        ...patch,
      },
    }))
  }

  function updateRange(dayKey, index, patch) {
    setDraftSchedule((current) => {
      const dayData = current[dayKey] || { closed: true, open_24_hours: false, ranges: [{ open: '', close: '' }] }
      const ranges = Array.isArray(dayData.ranges) && dayData.ranges.length ? [...dayData.ranges] : [{ open: '', close: '' }]
      ranges[index] = {
        ...ranges[index],
        ...patch,
      }

      return {
        ...current,
        [dayKey]: {
          ...dayData,
          closed: false,
          open_24_hours: false,
          ranges,
        },
      }
    })
  }

  function removeRange(dayKey, index) {
    setDraftSchedule((current) => {
      const dayData = current[dayKey] || {
        closed: true,
        open_24_hours: false,
        ranges: [{ open: '', close: '' }],
      }

      const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : []
      const nextRanges = ranges.filter((_, rangeIndex) => rangeIndex !== index)

      return {
        ...current,
        [dayKey]: {
          ...dayData,
          ranges: nextRanges.length ? nextRanges : [{ open: '', close: '' }],
        },
      }
    })
  }

  function openTimePicker(field, rangeIndex = 0) {
    const value = draftSchedule?.[activeDay]?.ranges?.[rangeIndex]?.[field] || '12:00 AM'
    const match = String(value).match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)

    setTimeDraft({
      hour: match ? match[1].padStart(2, '0') : '12',
      minute: match ? match[2] : '00',
      period: match ? match[3].toUpperCase() : 'AM',
    })

    setTimePicker({ field, rangeIndex })
  }

  function saveTimePicker() {
    if (!timePicker) return

    updateRange(activeDay, timePicker.rangeIndex, {
      [timePicker.field]: `${timeDraft.hour}:${timeDraft.minute} ${timeDraft.period}`,
    })

    setTimePicker(null)
  }

  function handleTypeSelect(type) {
    setDraftType(type)
    setSelectOpen(false)

    if (type !== 'daily_hours') {
      setEditDayOpen(false)
    }
  }

  function handleSave() {
    setExitConfirmOpen(false)
    onSave({
      hours_type: draftType,
      hours_schedule: draftType === 'daily_hours' ? draftSchedule : null,
      hours: summarizeHoursStorage(draftType, draftSchedule),
    })
  }

  if (editDayOpen) {
    const dayData = draftSchedule[activeDay] || { closed: true, open_24_hours: false, ranges: [{ open: '', close: '' }] }
    const ranges = Array.isArray(dayData.ranges) && dayData.ranges.length ? dayData.ranges : [{ open: '', close: '' }]

    return (
      <ModalShell title={detailsText('editHours')} onClose={() => setEditDayOpen(false)}>
        <div className="mx-auto w-full max-w-[520px]">
          <div className="mb-5 grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day) => {
              const active = activeDay === day.key

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setActiveDay(day.key)}
                  className={`h-14 rounded-[12px] border text-[16px] font-medium ${
                    active
                      ? 'border-[#f5c542] bg-[#fff7d6] text-[var(--shadow-text-primary)]'
                      : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]'
                  }`}
                >
                  {detailsText(day.shortKey)}
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
  {ranges.map((range, index) => (
    <div key={index} className="space-y-3">
      <button
        type="button"
        disabled={dayData.closed || dayData.open_24_hours}
        onClick={() => openTimePicker('open', index)}
        className="flex h-[56px] w-full items-center rounded-[13px] border border-[var(--shadow-border)] px-4 text-left text-[15px] font-normal text-[var(--shadow-text-primary)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
      >
        {range.open || detailsText('open')}
      </button>

      <button
        type="button"
        disabled={dayData.closed || dayData.open_24_hours}
        onClick={() => openTimePicker('close', index)}
        className="flex h-[56px] w-full items-center rounded-[13px] border border-[var(--shadow-border)] px-4 text-left text-[15px] font-normal text-[var(--shadow-text-primary)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
      >
        {range.close || detailsText('close')}
      </button>

      {ranges.length > 1 ? (
        <button
          type="button"
          onClick={() => removeRange(activeDay, index)}
          className="flex h-10 w-full items-center justify-center rounded-[11px] bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
        >{detailsText('removeHours')}</button>
      ) : null}
    </div>
  ))}
</div>

          <div className="mt-6 space-y-5">
            <button
              type="button"
              onClick={() => updateDay(activeDay, { closed: !dayData.closed, open_24_hours: false, ranges: dayData.ranges || [{ open: '', close: '' }] })}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[18px] font-normal text-[var(--shadow-text-primary)]">{detailsText('closed')}</span>
              <span className={`relative flex h-8 w-14 items-center rounded-full p-1 shadow-inner transition ${dayData.closed ? 'bg-[#111827]' : 'bg-[var(--shadow-border-strong)]'}`}>
  <span className={`h-6 w-6 rounded-full bg-[var(--shadow-bg-surface)] shadow-[0_3px_8px_rgba(15,23,42,0.25)] ring-1 ring-[var(--shadow-border)] transition-transform duration-200 ${dayData.closed ? 'translate-x-6' : 'translate-x-0'}`} />
</span>
            </button>

            <button
              type="button"
              onClick={() => updateDay(activeDay, { open_24_hours: !dayData.open_24_hours, closed: false, ranges: [{ open: '', close: '' }] })}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[18px] font-normal text-[var(--shadow-text-primary)]">{detailsText('open24')}</span>
              <span className={`relative flex h-8 w-14 items-center rounded-full p-1 shadow-inner transition ${dayData.open_24_hours ? 'bg-[#111827]' : 'bg-[var(--shadow-border-strong)]'}`}>
  <span className={`h-6 w-6 rounded-full bg-[var(--shadow-bg-surface)] shadow-[0_3px_8px_rgba(15,23,42,0.25)] ring-1 ring-[var(--shadow-border)] transition-transform duration-200 ${dayData.open_24_hours ? 'translate-x-6' : 'translate-x-0'}`} />
</span>
            </button>
          </div>

         {ranges.length < 2 ? (
  <button
    type="button"
    disabled={dayData.closed || dayData.open_24_hours}
    onClick={() => updateDay(activeDay, { ranges: [...ranges, { open: '', close: '' }] })}
    className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-[11px] bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)] disabled:opacity-50"
  >
    <i className="fa-solid fa-plus text-[13px]" />{detailsText('addMore')}</button>
) : null}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
          <div className="mx-auto w-full max-w-[520px]">
            <button
              type="button"
              onClick={() => setEditDayOpen(false)}
              className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >{detailsText('save')}</button>
          </div>
        </div>

        {timePicker ? (
          <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/55 px-8">
            <div className="w-full max-w-[370px] rounded-[4px] bg-[var(--shadow-bg-surface)] px-6 pb-5 pt-6 shadow-2xl">
              <h3 className="text-[22px] font-normal text-[var(--shadow-text-primary)]">{detailsText('setTime')}</h3>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <select
                  value={timeDraft.hour}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, hour: event.target.value }))}
                  className="h-12 border-b border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-center text-[18px] outline-none"
                >
                  {timeOptions.hours.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={timeDraft.minute}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, minute: event.target.value }))}
                  className="h-12 border-b border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-center text-[18px] outline-none"
                >
                  {timeOptions.minutes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={timeDraft.period}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, period: event.target.value }))}
                  className="h-12 border-b border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-center text-[18px] outline-none"
                >
                  {timeOptions.periods.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="mt-10 flex justify-end gap-8">
                <button
                  type="button"
                  onClick={() => setTimePicker(null)}
                  className="text-[14px] font-semibold uppercase text-[var(--shadow-text-primary)]"
                >{detailsText('cancel')}</button>

                <button
                  type="button"
                  onClick={saveTimePicker}
                  className="text-[14px] font-semibold uppercase text-[var(--shadow-text-primary)]"
                >{detailsText('set')}</button>
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>
    )
  }

  return (
    <ModalShell title={detailsText('hours')} onClose={handleRequestClose}>
      <div className="mx-auto w-full max-w-[520px]">
        <button
  type="button"
  onClick={() => setSelectOpen(true)}
  className="flex h-[68px] w-full items-center justify-between rounded-[15px] border border-[var(--shadow-border)] px-4 text-left"
>
  <span>
    <span className="block text-[12px] font-normal text-[var(--shadow-text-secondary)]">{detailsText('selectHours')}</span>
    <span className="mt-0.5 block text-[16px] font-normal text-[var(--shadow-text-primary)]">
      {getHoursTypeLabel(draftType)}
    </span>
  </span>

  <i className="fa-solid fa-caret-down text-[14px] text-[var(--shadow-text-secondary)]" />
</button>

        {draftType === 'daily_hours' ? (
          <div className="mt-5 space-y-5">
            {WEEK_DAYS.map((day) => (
  <button
    key={day.key}
    type="button"
    onClick={() => {
      setActiveDay(day.key)
      setEditDayOpen(true)
    }}
    className="flex w-full items-center justify-between text-left"
  >
    <span>
      <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">{detailsText(day.labelKey)}</span>
      <span className="mt-0.5 block text-[13px] font-normal text-[var(--shadow-text-secondary)]">
        {summarizeDayHours(draftSchedule[day.key])}
      </span>
    </span>

    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)]">
  <i className="fa-solid fa-pen text-[12px]" />
</span>
  </button>
))}
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="h-11 w-full rounded-[12px] bg-[#111827] text-[14px] font-semibold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
          >{detailsText('save')}</button>
        </div>
      </div>

      {selectOpen ? (
        <div className="fixed inset-0 z-[300] bg-black/45" onClick={() => setSelectOpen(false)}>
          <div
  className="absolute bottom-0 left-1/2 w-full max-w-[560px] -translate-x-1/2 rounded-t-[26px] bg-[var(--shadow-bg-soft)] px-5 pb-7 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
  onClick={(event) => event.stopPropagation()}
>
            <div className="mx-auto mb-8 h-1.5 w-14 rounded-full bg-[var(--shadow-border-strong)]" />

            <h3 className="mb-4 text-center text-[17px] font-normal text-[var(--shadow-text-primary)]">{detailsText('selectHours')}</h3>

            <div className="rounded-[12px] bg-[var(--shadow-bg-surface)] py-2">
              {HOUR_TYPES.map((option) => (
                <button
  key={option.value}
  type="button"
  onClick={() => handleTypeSelect(option.value)}
  className="w-full px-4 py-[9px] text-left active:bg-[var(--shadow-bg-soft)]"
>
  <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">{detailsText(option.titleKey)}</span>
  <span className="mt-0.5 block text-[13px] font-normal leading-[18px] text-[var(--shadow-text-secondary)]">{detailsText(option.textKey)}</span>
</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

{exitConfirmOpen ? (
  <div className="fixed inset-0 z-[340] flex items-center justify-center bg-black/55 px-8">
    <div className="w-full max-w-[420px] rounded-[4px] bg-[var(--shadow-bg-surface)] px-6 py-5 shadow-2xl">
      <h3 className="text-[20px] font-normal text-[var(--shadow-text-primary)]">
        {detailsText('leaveHoursTitle')}
      </h3>

      <p className="mt-4 text-[16px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
        {detailsText('leaveHoursHelp')}
      </p>

      <div className="mt-8 flex justify-end gap-7">
        <button
          type="button"
          onClick={() => {
            setExitConfirmOpen(false)
            onClose()
          }}
          className="text-[14px] font-medium text-[#e5484d]"
        >{detailsText('leave')}</button>

        <button
          type="button"
          onClick={() => setExitConfirmOpen(false)}
          className="text-[14px] font-medium text-[#2563eb]"
        >{detailsText('keepEditing')}</button>
      </div>
    </div>
  </div>
) : null}
      
    </ModalShell>
  )
}

function FacebookPageModal({ open, name, url, imageUrl, fallbackImage, onClose, onSave, onUploadImage }) {
  const [draftName, setDraftName] = useState(name || '')
  const [draftUrl, setDraftUrl] = useState(url || '')

  useEffect(() => {
    if (open) {
      setDraftName(name || '')
      setDraftUrl(url || '')
    }
  }, [open, name, url])

  if (!open) return null

  const canSave =
    draftName.trim() !== String(name || '').trim() ||
    draftUrl.trim() !== String(url || '').trim()

  const displayImage = imageUrl || fallbackImage

  return (
    <ModalShell title={detailsText('editFacebook')} onClose={onClose}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {displayImage ? (
            <img src={displayImage} alt={draftName || detailsText('facebookPage')} className="h-full w-full object-cover" />
          ) : null}
        </span>

        <button
          type="button"
          onClick={onUploadImage}
          className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px] font-medium text-[var(--shadow-text-primary)] active:scale-95"
        >
          {detailsText('changeImage')}
        </button>
      </div>

      <label className="mb-1.5 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">{detailsText('pageName')}</label>
      <input
        value={draftName}
        onChange={(event) => setDraftName(event.target.value)}
        maxLength={80}
        placeholder={detailsText('facebookNameExample')}
        className="h-11 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
      />

      <label className="mb-1.5 mt-4 block text-[12px] font-normal text-[var(--shadow-text-secondary)]">{detailsText('pageLink')}</label>
      <input
        value={draftUrl}
        onChange={(event) => setDraftUrl(event.target.value)}
        maxLength={180}
        placeholder="https://facebook.com/yourpage"
        className="h-11 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
      />

      <p className="mt-2 text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
        {detailsText('facebookImageHelp')}
      </p>

      <div className="fixed bottom-0 left-0 right-0 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave({ name: draftName.trim(), url: draftUrl.trim() })}
          className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
        >{detailsText('save')}</button>
      </div>
    </ModalShell>
  )
}

function PinnedDetailsModal({ open, details, onClose, onSave }) {
  const options = getPinnedDetailOptions(details)
  const savedKeys = Array.isArray(details.pinned_detail_keys) ? details.pinned_detail_keys : ['book', 'price']
  const [selectedKeys, setSelectedKeys] = useState(savedKeys)

  useEffect(() => {
    if (open) setSelectedKeys(savedKeys)
  }, [open, details.pinned_detail_keys])

  if (!open) return null

  function toggleKey(key) {
    setSelectedKeys((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key)
      if (current.length >= 5) return current
      return [...current, key]
    })
  }

  return (
    <ModalShell title={detailsText('intro')} onClose={onClose}>
      <div className="mb-5">
        <h3 className="text-[18px] font-semibold text-[var(--shadow-text-primary)]">{detailsText('pinnedDetails')}</h3>
        <p className="mt-1 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {detailsText('pinnedHelp')}
        </p>
      </div>

      <div className="space-y-1">
        {options.map((option) => {
          const active = selectedKeys.includes(option.key)

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleKey(option.key)}
              className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
                <i className={`${option.icon} text-[22px]`} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">{detailsText(option.titleKey)}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
                  <i className="fa-solid fa-earth-asia text-[10px]" />
                  {option.text}
                </span>
              </span>

              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 ${active ? 'border-[#1877f2] bg-[#1877f2]' : 'border-[var(--shadow-border-strong)]'}`}>
                {active ? <i className="fa-solid fa-check text-[12px] text-white" /> : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          onClick={() => onSave(selectedKeys)}
          className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white"
        >{detailsText('save')}</button>
      </div>
    </ModalShell>
  )
}

function CoverOptionsSheet({ open, onClose, onSeeCover, onUploadCover, onChooseCover }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[250]">
      <button type="button" aria-label={detailsText('closeCoverOptions')} onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        <div className="space-y-1">
          <button type="button" onClick={onSeeCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-image text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{detailsText('seeCover')}</span>
          </button>

          <button type="button" onClick={onUploadCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{detailsText('uploadCover')}</span>
          </button>

          <button type="button" onClick={onChooseCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-images text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{detailsText('chooseCover')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorPageEditDetailsPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const sectionFromUrl = useMemo(() => getSearchSection(location.search), [location.search])
  const modalFromUrl = useMemo(() => new URLSearchParams(location.search).get('modal') || '', [location.search])
  const fileInputRef = useRef(null)
  const coverRef = useRef(null)
  const introRef = useRef(null)
  const detailsRef = useRef(null)
  const linksRef = useRef(null)
  const facebookRef = useRef(null)
const contactRef = useRef(null)

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}, [])

const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [details, setDetails] = useState(readStoredDetails)
  const [activeModal, setActiveModal] = useState('')
  const [imageMode, setImageMode] = useState('')
  const [coverOptionsOpen, setCoverOptionsOpen] = useState(false)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadAuthorPage() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const data = await fetchMyAuthorPageCached({
          apiBaseUrl: API_BASE_URL,
          token,
          signal: controller.signal,
        })

        if (
          !data.has_author_page ||
          !data.author_page
        ) {
          throw new Error(detailsText('authorPageNotFound'))
        }

        if (ignore) return

        setPageName(data.author_page.page_name || '')
        setPageUsername(data.author_page.page_username || '')
        setBio(data.author_page.bio || '')
        setAvatarUrl(data.author_page.avatar_url || '')
        setCoverUrl(data.author_page.cover_url || '')

        const databaseDetails =
          data.author_page.profile_details || {}
        const storedDetails = readStoredDetails()
        const nextDetails =
          Object.keys(databaseDetails).length
            ? {
                ...DEFAULT_DETAILS,
                ...databaseDetails,
              }
            : {
                ...DEFAULT_DETAILS,
                ...storedDetails,
              }

        setDetails(nextDetails)
        writeStoredDetails(nextDetails)

        localStorage.setItem(
          'shadow_author_page',
          JSON.stringify(data.author_page)
        )
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !ignore
        ) {
          setMessage(
            error.message || detailsText('loadAuthorFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAuthorPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate])

  useEffect(() => {
    const refs = {
      cover: coverRef,
      intro: introRef,
      details: detailsRef,
      links: linksRef,
      facebook: facebookRef,
      contact: contactRef,
    }

    const targetRef = refs[sectionFromUrl]

    if (!targetRef?.current) return undefined

    const timer = window.setTimeout(() => {
      targetRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 260)

    return () => window.clearTimeout(timer)
  }, [sectionFromUrl, loading])

  useEffect(() => {
  if (!loading && modalFromUrl === 'social') setActiveModal('social')
}, [modalFromUrl, loading])

 
async function updateDetails(patch) {
  const nextDetails = { ...details, ...patch }

  setDetails(nextDetails)
  writeStoredDetails(nextDetails)
  window.dispatchEvent(new Event('shadow_author_page_profile_details_updated'))

  const token = getAuthToken()
  if (!token) {
    setMessage(detailsText('loginAgain'))
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        page_name: pageName.trim(),
        page_username: normalizeUsername(pageUsername),
        bio: bio.trim(),
        profile_details: nextDetails,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || detailsText('saveContactFailed'))
    }

    invalidateMyAuthorPageClientCache()

    if (data.author_page) {
      localStorage.setItem(
        'shadow_author_page',
        JSON.stringify(data.author_page)
      )
    }

    setMessage(detailsText('saved'))
  } catch (error) {
    setMessage(error.message || detailsText('saveContactFailed'))
  }
}


  function openImagePicker(mode) {
    setImageMode(mode)
    fileInputRef.current?.click()
  }

  function handleImageFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()

    reader.onload = () => {
      const imageUrl = String(reader.result || '')

      if (imageMode === 'cover') {
        setCoverUrl(imageUrl)
        const currentPage = JSON.parse(localStorage.getItem('shadow_author_page') || '{}')
        localStorage.setItem('shadow_author_page', JSON.stringify({ ...currentPage, cover_url: imageUrl }))
        setMessage(detailsText('coverPreviewUpdated'))
      }

      if (imageMode === 'avatar') {
        setAvatarUrl(imageUrl)
        const currentPage = JSON.parse(localStorage.getItem('shadow_author_page') || '{}')
        localStorage.setItem('shadow_author_page', JSON.stringify({ ...currentPage, avatar_url: imageUrl }))
        setMessage(detailsText('logoPreviewUpdated'))
      }

      if (imageMode === 'facebook') {
        updateDetails({ facebook_page_image_url: imageUrl })
        setMessage(detailsText('facebookImageUpdated'))
      }

      setImageMode('')
    }

    reader.readAsDataURL(file)
  }

  async function handleSaveMainPage() {
    const token = getAuthToken()
    const nextPageName = pageName.trim()
    const nextPageUsername = normalizeUsername(pageUsername)
    const nextBio = bio.trim()

    if (!token) {
      navigate('/login')
      return
    }

    if (nextPageName.length < 2) {
      setMessage(detailsText('pageNameTooShort'))
      return
    }

    if (nextPageUsername.length < 3) {
      setMessage(detailsText('pageUsernameTooShort'))
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: nextPageName,
          page_username: nextPageUsername,
          bio: nextBio,
profile_details: details,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || detailsText('updateAuthorFailed'))
      }

      invalidateMyAuthorPageClientCache()

      if (data.author_page) {
        localStorage.setItem(
          'shadow_author_page',
          JSON.stringify({
            ...data.author_page,
            avatar_url:
              avatarUrl || data.author_page.avatar_url,
            cover_url:
              coverUrl || data.author_page.cover_url,
          })
        )
      }

      writeStoredDetails(details)
      setMessage(detailsText('editPageSaved'))
    } catch (error) {
      setMessage(error.message || detailsText('saveEditPageFailed'))
    } finally {
      setSaving(false)
    }
  }

  const displayCover = coverUrl
  const displayAvatar = avatarUrl
  const displayFacebookImage = details.facebook_page_image_url || displayAvatar
  const displayFacebookName = details.facebook_page_name || pageName || detailsText('facebookPage')

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-10">
      <header className="sticky top-0 z-40 bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-12 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={detailsText('back')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

         <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{detailsText('editPage')}</h1>
<div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-10">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[13px] font-normal text-[var(--shadow-text-primary)]"
          >
            {message}
          </button>
        ) : null}

        <section ref={coverRef} id="cover" className="scroll-mt-20">
          <div className="relative h-[165px] overflow-hidden rounded-t-[18px] bg-[#111827] sm:h-[190px]">
            {displayCover ? (
              <img src={displayCover} alt={pageName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
            )}

            <div className="absolute inset-0 bg-black/10" />

            <button
              type="button"
              onClick={() => setCoverOptionsOpen(true)}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] active:scale-95"
            >
              <i className="fa-solid fa-camera text-[16px]" />
            </button>
          </div>

          <div className="relative min-h-[72px] bg-[var(--shadow-bg-surface)]">
            <div className="absolute -top-11 left-5 h-[84px] w-[84px] rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[var(--shadow-bg-soft)] shadow-sm">
              {displayAvatar ? (
                <img src={displayAvatar} alt={pageName} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full text-[28px] font-bold text-[var(--shadow-text-tertiary)]">
                  {(pageName || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => openImagePicker('avatar')}
                className="absolute -bottom-0.5 right-0 flex h-7 w-7 items-center justify-center rounded-full border-[2px] border-[var(--shadow-bg-surface)] bg-[#111827] text-white active:scale-95"
                aria-label={detailsText('uploadLogo')}
              >
                <i className="fa-solid fa-camera text-[10px]" />
              </button>
            </div>
          </div>
        </section>

        <div className="mt-2 space-y-6">
          <SectionBlock id="intro" title={detailsText('intro')} sectionRef={introRef}>
            <FieldRow
              icon="fa-regular fa-hand"
              title={detailsText('bio')}
              value={bio}
              placeholder={detailsText('bioAdd')}
              onClick={() => setActiveModal('bio')}
            />
            <FieldRow
              icon="fa-regular fa-star"
              title={detailsText('pinnedDetails')}
              value={makePinnedDetailsText(details, details.pinned_detail_keys || ['book', 'price'])}
              placeholder={detailsText('onePublicDetail')}
              onClick={() => setActiveModal('pinned')}
            />
          </SectionBlock>

          <SectionBlock id="details" title={detailsText('details')} sectionRef={detailsRef}>
  <FieldRow
    icon="fa-regular fa-star"
    title={details.reviews_enabled ? detailsText('reviewsOn') : detailsText('reviewsOff')}
    value={details.reviews_enabled ? detailsText('reviewsVisible') : detailsText('reviewsHidden')}
    placeholder=""
    onClick={() => setActiveModal('reviews')}
  />
  <FieldRow
    icon="fa-solid fa-dollar-sign"
    title={details.price_range || detailsText('priceHidden')}
    value={details.price_range ? detailsText('priceVisible') : detailsText('priceNotShown')}
    placeholder=""
    onClick={() => setActiveModal('price')}
  />
  <FieldRow
  icon="fa-solid fa-location-dot"
  title={detailsText('address')}
  value={details.address}
  placeholder={detailsText('addAddress')}
  onClick={() => setActiveModal('address')}
/>
  <FieldRow
  icon="fa-regular fa-clock"
  title={detailsText('hours')}
  value={details.hours_type ? summarizeHours(normalizeHoursType(details.hours_type), normalizeHoursSchedule(details.hours_schedule)) : details.hours}
  placeholder={detailsText('addOpeningHours')}
  onClick={() => setActiveModal('hours')}
/>
</SectionBlock>

          <SectionBlock id="links" title={detailsText('links')} sectionRef={linksRef}>
            <FieldRow
              icon="fa-solid fa-link"
              title={
                details.website_label === 'Shadow website'
                  ? detailsText('websiteLabelDefault')
                  : details.website_label === 'Website'
                    ? detailsText('website')
                    : details.website_label || detailsText('website')
              }
              value={details.website_url}
              placeholder={detailsText('addWebsite')}
              onClick={() => setActiveModal('website')}
            />
          </SectionBlock>
<SectionBlock id="facebook" title={detailsText('facebookPage')} sectionRef={facebookRef}>
  <button
    type="button"
    onClick={() => setActiveModal('facebook')}
    className="flex w-full items-center gap-3 py-2.5 text-left active:bg-[var(--shadow-bg-hover)]"
  >
    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
      {displayFacebookImage ? (
        <img src={displayFacebookImage} alt={displayFacebookName} className="h-full w-full object-cover" />
      ) : null}
    </span>

    <span className="min-w-0 flex-1">
      <span className="line-clamp-1 block text-[13px] font-normal text-[var(--shadow-text-primary)]">{displayFacebookName}</span>
      <span className="mt-0.5 line-clamp-2 block text-[11px] font-normal text-[var(--shadow-text-secondary)]">
        {details.facebook_page_url || detailsText('addFacebookLink')}
      </span>
    </span>

    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)]">
      <i className="fa-solid fa-pen text-[12px]" />
    </span>
  </button>
</SectionBlock>

          <SectionBlock id="contact" title={detailsText('contactInfo')} sectionRef={contactRef}>
            <FieldRow
              icon="fa-solid fa-at"
              title={detailsText('socialMedia')}
              value={getSocialMediaSummary(details.social_links, details.social_media)}
              placeholder={detailsText('addSocial')}
              onClick={() => setActiveModal('social')}
            />
            <FieldRow
              icon="fa-regular fa-envelope"
              title={details.email || detailsText('emailAddress')}
              value={details.email ? detailsText('shownPublic') : ''}
              placeholder={detailsText('addEmail')}
              onClick={() => setActiveModal('email')}
            />
            <FieldRow
              icon="fa-solid fa-phone"
              title={details.phone || detailsText('phoneNumber')}
              value={details.phone ? detailsText('shownPublic') : ''}
              placeholder={detailsText('addPhone')}
              onClick={() => setActiveModal('phone')}
            />
            <FieldRow
              icon="fa-brands fa-facebook-messenger"
              title={details.messenger || detailsText('messenger')}
              value={details.messenger ? detailsText('shownPublic') : ''}
              placeholder={detailsText('addMessenger')}
              onClick={() => setActiveModal('messenger')}
            />

            <FieldRow
  icon="fa-brands fa-telegram"
  title={details.telegram || detailsText('telegram')}
  value={details.telegram ? detailsText('shownPublic') : ''}
  placeholder={detailsText('addTelegram')}
  onClick={() => setActiveModal('telegram')}
/>
          </SectionBlock>
        </div>
      </main>

      <CoverOptionsSheet
        open={coverOptionsOpen}
        onClose={() => setCoverOptionsOpen(false)}
        onSeeCover={() => {
          setCoverOptionsOpen(false)
          if (displayCover) window.open(displayCover, '_blank', 'noopener,noreferrer')
          else setMessage(detailsText('noCover'))
        }}
        onUploadCover={() => {
          setCoverOptionsOpen(false)
          openImagePicker('cover')
        }}
        onChooseCover={() => {
          setCoverOptionsOpen(false)
          setMessage(detailsText('chooseCoverSoon'))
        }}
      />

      <TextEditModal
        open={activeModal === 'bio'}
        title={detailsText('editBio')}
        label={detailsText('bio')}
        value={bio}
        multiline
        maxLength={240}
        placeholder={detailsText('bioPlaceholder')}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          setBio(value)
          setActiveModal('')
          setMessage(detailsText('bioUpdated'))
        }}
      />

      <PinnedDetailsModal
  open={activeModal === 'pinned'}
  details={details}
  onClose={() => setActiveModal('')}
  onSave={(keys) => {
    updateDetails({
      pinned_detail_keys: keys,
      pinned_details: makePinnedDetailsStorageText(details, keys),
    })
    setActiveModal('')
  }}
/>

      <PriceModal
        open={activeModal === 'price'}
        value={details.price_range}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          const nextDetails = { ...details, price_range: value }
updateDetails({
  price_range: value,
  pinned_details: makePinnedDetailsStorageText(nextDetails, nextDetails.pinned_detail_keys || ['book', 'price']),
})
          setActiveModal('')
        }}
      />

<TextEditModal
  open={activeModal === 'address'}
  title={detailsText('editAddress')}
  label={detailsText('address')}
  value={details.address}
  maxLength={180}
  placeholder={detailsText('publicAddress')}
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails({ address: value })
    setActiveModal('')
  }}
/>

<HoursModal
  open={activeModal === 'hours'}
  details={details}
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails(value)
    setActiveModal('')
  }}
/>

    
      
      <ReviewsModal
        open={activeModal === 'reviews'}
        value={details.reviews_enabled}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ reviews_enabled: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'website'}
        title={detailsText('editWebsite')}
        label={detailsText('websiteUrl')}
        value={details.website_url}
        maxLength={180}
        placeholder="https://example.com"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ website_url: value, website_label: value ? 'Website' : 'Shadow website' })
          setActiveModal('')
        }}
      />
      
<FacebookPageModal
  open={activeModal === 'facebook'}
  name={details.facebook_page_name}
  url={details.facebook_page_url}
  imageUrl={details.facebook_page_image_url}
  fallbackImage={displayAvatar}
  onClose={() => setActiveModal('')}
  onUploadImage={() => openImagePicker('facebook')}
  onSave={({ name, url }) => {
    updateDetails({
      facebook_page_name: name,
      facebook_page_url: url,
    })
    setActiveModal('')
  }}
/>
      
      <SocialMediaModal
        open={activeModal === 'social'}
        value={details.social_links}
        legacyValue={details.social_media}
        onClose={() => setActiveModal('')}
        onChange={(links) => updateDetails({ social_links: links })}
      />

      <TextEditModal
        open={activeModal === 'email'}
        title={detailsText('editEmail')}
        label={detailsText('emailAddress')}
        value={details.email}
        maxLength={120}
        placeholder="name@example.com"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ email: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'phone'}
        title={detailsText('editPhone')}
        label={detailsText('phoneNumber')}
        value={details.phone}
        maxLength={60}
        placeholder="+855 ..."
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ phone: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'messenger'}
        title={detailsText('editMessenger')}
        label={detailsText('messenger')}
        value={details.messenger}
        maxLength={140}
        placeholder={detailsText('messengerPlaceholder')}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ messenger: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
  open={activeModal === 'telegram'}
  title={detailsText('editTelegram')}
  label={detailsText('telegram')}
  value={details.telegram}
  maxLength={140}
  placeholder="https://t.me/yourname"
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails({ telegram: value })
    setActiveModal('')
  }}
/>
    </div>
  )
}
