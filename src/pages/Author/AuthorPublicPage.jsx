import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import AuthorPostsSection from '../../components/AuthorPostsSection'
import AuthorPublicStoreSection from '../../components/AuthorPublicStoreSection'
import AuthorStoreTab from '../../components/AuthorStoreTab'
import ReaderAuthorMessageRequestModal from '../../components/chat/ReaderAuthorMessageRequestModal'
import AuthorSocialMediaPopup from '../../components/Author/AuthorSocialMediaPopup'
import Cropper from 'react-easy-crop'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPublicPage', {
  en: {
    authorPage: 'Author Page',
    reader: 'Reader',
    untitledStory: 'Untitled Story',
    story: 'Story',
    episodesShort: '{{count}} eps',
    notFoundTitle: 'Author page not found',
    notFoundText: 'This author page may be unavailable or the username is incorrect.',
    goBack: 'Go Back',
    cropProfilePhoto: 'Crop Profile Photo',
    cropCoverPhoto: 'Crop Cover Photo',
    cropHelp: 'Drag and zoom to fit your author page image.',
    closeCropEditor: 'Close crop editor',
    zoom: 'Zoom',
    cancel: 'Cancel',
    saving: 'Saving...',
    saveCrop: 'Save Crop',
    closeFollowSettings: 'Close follow settings',
    seeFirst: 'See first',
    muteUpdates: 'Mute updates',
    unfollowing: 'Unfollowing...',
    unfollowAuthor: 'Unfollow {{name}}',
    closeSwitcher: 'Close switcher',
    notification: '{{count}} notification',
    notifications: '{{count}} notifications',
    manageAccount: 'Manage Account',
    closeAuthorMenu: 'Close author menu',
    authorMenu: 'Author Menu',
    switchProfile: 'Switch Profile',
    finance: 'Finance',
    settings: 'Settings',
    closeProfileSwitcher: 'Close profile switcher',
    authorPageLabel: 'Author page',
    switchingTo: 'Switching to',
    closeCoverOptions: 'Close cover options',
    seeCover: 'See cover',
    uploadCover: 'Upload cover',
    chooseCover: 'Choose cover',
    noBio: 'This author has not added a bio yet.',
    alwaysOpen: 'Always open',
    temporarilyClosed: 'Temporarily closed',
    permanentlyClosed: 'Permanently closed',
    closed: 'Closed',
    hoursAvailable: 'Hours available',
    open24Hours: 'Open 24 hours',
    openEveryday: 'Open · Everyday {{hours}}',
    openWeekdays: 'Open · Mon–Fri {{hours}}',
    openWeekend: 'Open · Sat–Sun {{hours}}',
    openDay: 'Open · {{day}} {{hours}}',
    hoursVary: 'Hours vary by day',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    failedUploadImage: 'Failed to upload image',
    failedSaveProfileImage: 'Failed to save author profile image',
    authorPageNotFound: 'Author page not found',
    failedLoadReviews: 'Failed to load reviews',
    failedSaveReview: 'Failed to save review',
    failedRemoveReview: 'Failed to remove review',
    failedUpdateFollow: 'Failed to update follow',
    comingSoon: '{{label}} is coming soon.',
    seeFirstUnavailable: 'See first is not available yet.',
    muteUnavailable: 'Mute updates is not available yet.',
    dashboard: 'Dashboard',
    advertise: 'Advertise',
    following: 'Following',
    follow: 'Follow',
    message: 'Message',
    selectImage: 'Please select an image file',
    adjustPhoto: 'Please adjust the photo first',
    failedSaveImage: 'Failed to save image',
    uploadingSlide: 'Uploading slide to Cloudflare...',
    slideUploaded: 'Slide uploaded.',
    failedUploadSlide: 'Failed to upload slide',
    noCoverPhoto: 'No cover photo yet.',
    reviews: 'Reviews',
    reviewSettingsText: 'Reviews help readers decide whether your page is worth following. You can turn reviews off anytime. Existing reviews will be hidden from your page until you turn them on again.',
    allowReviews: 'Allow reviews on this page',
    save: 'Save',
    backToReviews: 'Back to reviews',
    aboutReviewScore: 'About review score',
    recommendSummary: '{{percent}}% recommend ({{count}} Reviews)',
    reviewScoreInfo: 'This score is based on reader reviews for this author page. Readers can choose whether they recommend the page and leave a public review. The percentage shows how many active reviews recommend it.',
    noReviewsYet: 'No reviews yet.',
    howReviewsWork: 'How Shadow reviews work',
    reportReview: 'Report review',
    reportReviewComingSoon: 'Report review is coming soon.',
    editReview: 'Edit review',
    deleteReview: 'Delete review',
    deleteReviewConfirm: 'Delete your review? This cannot be undone.',
    reviewRemoved: 'Review deleted.',
    copyReviewLink: 'Copy link',
    reviewLinkCopied: 'Review link copied.',
    closeReviews: 'Close reviews',
    edit: 'Edit',
    recentReviews: 'Recent reviews',
    seeAll: 'See all',
    yes: 'Yes',
    no: 'No',
    reviewPrompt: 'What would you like to say about {{name}}?',
    public: 'Public',
    reviewMinimum: '{{count}} / 25 · Reviews must be at least 25 characters',
    discardReview: 'Discard review?',
    discardReviewText: 'Reviews help other readers understand this page. Are you sure you want to discard your draft?',
    discard: 'Discard',
    keepWriting: 'Keep Writing',
    allowReadersReviewQuestion: 'Allow readers to view and write reviews on your page?',
    recommends: 'recommends',
    doesNotRecommend: "doesn't recommend",
    basedOnReaderReviews: 'Based on {{count}} reader reviews',
    loading: 'Loading...',
    recommendedPercent: '{{percent}}% recommended',
    basedOnOpinions: 'Based on the opinions of {{count}} people',
    messageAuthor: 'Message {{name}}',
    doYouRecommend: 'Do you recommend {{name}}?',
    like: 'Like',
    comment: 'Comment',
    echo: 'Echo',
    reviewPlaceholder: 'Your review',
    sharing: 'Sharing...',
    share: 'Share',
    reviewTooShort: 'Review must be at least 25 characters.',
    loadingReviews: 'Loading reviews...',
    socialMedia: 'Social media',
    back: 'Back',
    openCart: 'Open cart',
    authorPageOptions: 'Author Page options',
    editPage: 'Edit page',
    pageOptions: 'Page options',
    switchReaderAccount: 'Switch to Reader account',
    works: 'Works',
    followers: 'Followers',
    posts: 'Posts',
    addToStory: 'Add to story',
    details: 'Details',
    book: 'Book',
    links: 'Links',
    website: 'Website',
    facebookPage: 'Facebook Page',
    facebookComingSoon: 'Facebook Page link will be available after update.',
    contactInfo: 'Contact info',
    store: 'Store',
    noWorksYet: 'No works yet',
    noWorksText: 'Published novels, chat stories, and manga will appear here.',
    reviewSettingsSaved: 'Review settings saved.',
  },
  km: {
    authorPage: 'ទំព័រអ្នកនិពន្ធ',
    reader: 'អ្នកអាន',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    story: 'រឿង',
    episodesShort: '{{count}} ភាគ',
    notFoundTitle: 'រកមិនឃើញទំព័រអ្នកនិពន្ធ',
    notFoundText: 'ទំព័រអ្នកនិពន្ធនេះអាចមិនមាន ឬ Username មិនត្រឹមត្រូវ។',
    goBack: 'ត្រឡប់ក្រោយ',
    cropProfilePhoto: 'កាត់រូប Profile',
    cropCoverPhoto: 'កាត់រូប Cover',
    cropHelp: 'អូស និងពង្រីក ដើម្បីកំណត់រូបទំព័រអ្នកនិពន្ធ។',
    closeCropEditor: 'បិទកម្មវិធីកាត់រូប',
    zoom: 'ពង្រីក',
    cancel: 'បោះបង់',
    saving: 'កំពុងរក្សាទុក...',
    saveCrop: 'រក្សាទុករូបកាត់',
    closeFollowSettings: 'បិទការកំណត់ Follow',
    seeFirst: 'មើលមុនគេ',
    muteUpdates: 'បិទសំឡេង Update',
    unfollowing: 'កំពុងឈប់ Follow...',
    unfollowAuthor: 'ឈប់ Follow {{name}}',
    closeSwitcher: 'បិទការប្តូរ Profile',
    notification: '{{count}} ការជូនដំណឹង',
    notifications: '{{count}} ការជូនដំណឹង',
    manageAccount: 'គ្រប់គ្រងគណនី',
    closeAuthorMenu: 'បិទ Menu អ្នកនិពន្ធ',
    authorMenu: 'Menu អ្នកនិពន្ធ',
    switchProfile: 'ប្តូរ Profile',
    finance: 'ហិរញ្ញវត្ថុ',
    settings: 'ការកំណត់',
    closeProfileSwitcher: 'បិទការប្តូរ Profile',
    authorPageLabel: 'ទំព័រអ្នកនិពន្ធ',
    switchingTo: 'កំពុងប្តូរទៅ',
    closeCoverOptions: 'បិទជម្រើស Cover',
    seeCover: 'មើល Cover',
    uploadCover: 'Upload Cover',
    chooseCover: 'ជ្រើស Cover',
    noBio: 'អ្នកនិពន្ធនេះមិនទាន់បន្ថែម Bio ទេ។',
    alwaysOpen: 'បើកជានិច្ច',
    temporarilyClosed: 'បិទបណ្តោះអាសន្ន',
    permanentlyClosed: 'បិទជាអចិន្ត្រៃយ៍',
    closed: 'បិទ',
    hoursAvailable: 'មានម៉ោងបើក',
    open24Hours: 'បើក 24 ម៉ោង',
    openEveryday: 'បើក · រាល់ថ្ងៃ {{hours}}',
    openWeekdays: 'បើក · ចន្ទ–សុក្រ {{hours}}',
    openWeekend: 'បើក · សៅរ៍–អាទិត្យ {{hours}}',
    openDay: 'បើក · {{day}} {{hours}}',
    hoursVary: 'ម៉ោងបើកខុសគ្នាតាមថ្ងៃ',
    monday: 'ចន្ទ',
    tuesday: 'អង្គារ',
    wednesday: 'ពុធ',
    thursday: 'ព្រហស្បតិ៍',
    friday: 'សុក្រ',
    saturday: 'សៅរ៍',
    sunday: 'អាទិត្យ',
    failedUploadImage: 'មិនអាច Upload រូបបាន',
    failedSaveProfileImage: 'មិនអាចរក្សាទុករូបទំព័រអ្នកនិពន្ធបាន',
    authorPageNotFound: 'រកមិនឃើញទំព័រអ្នកនិពន្ធ',
    failedLoadReviews: 'មិនអាចផ្ទុក Review បាន',
    failedSaveReview: 'មិនអាចរក្សាទុក Review បាន',
    failedRemoveReview: 'មិនអាចលុប Review បាន',
    failedUpdateFollow: 'មិនអាច Update Follow បាន',
    comingSoon: '{{label}} នឹងមកដល់ឆាប់ៗនេះ។',
    seeFirstUnavailable: 'មុខងារ See first មិនទាន់មានទេ។',
    muteUnavailable: 'មុខងារ Mute updates មិនទាន់មានទេ។',
    dashboard: 'Dashboard',
    advertise: 'ផ្សព្វផ្សាយ',
    following: 'កំពុង Follow',
    follow: 'Follow',
    message: 'សារ',
    selectImage: 'សូមជ្រើសរើសឯកសាររូបភាព',
    adjustPhoto: 'សូមកែតម្រូវរូបជាមុន',
    failedSaveImage: 'មិនអាចរក្សាទុករូបបាន',
    uploadingSlide: 'កំពុង Upload Slide ទៅ Cloudflare...',
    slideUploaded: 'បាន Upload Slide។',
    failedUploadSlide: 'មិនអាច Upload Slide បាន',
    noCoverPhoto: 'មិនទាន់មានរូប Cover ទេ។',
    reviews: 'Review',
    reviewSettingsText: 'Review ជួយអ្នកអានសម្រេចចិត្តថាគួរ Follow ទំព័ររបស់អ្នកឬអត់។ អ្នកអាចបិទ Review បានគ្រប់ពេល ហើយ Review ចាស់នឹងត្រូវលាក់រហូតដល់បើកវិញ។',
    allowReviews: 'អនុញ្ញាត Review លើទំព័រនេះ',
    save: 'រក្សាទុក',
    backToReviews: 'ត្រឡប់ទៅ Review',
    aboutReviewScore: 'អំពីពិន្ទុ Review',
    recommendSummary: '{{percent}}% ណែនាំ ({{count}} Review)',
    reviewScoreInfo: 'ពិន្ទុនេះផ្អែកលើ Review របស់អ្នកអានសម្រាប់ទំព័រអ្នកនិពន្ធនេះ។ អ្នកអានអាចជ្រើសថាណែនាំទំព័រ ឬទុក Review សាធារណៈ។ ភាគរយបង្ហាញចំនួន Review សកម្មដែលណែនាំទំព័រ។',
    noReviewsYet: 'មិនទាន់មាន Review ទេ។',
    howReviewsWork: 'របៀបដែល Shadow Review ដំណើរការ',
    reportReview: 'រាយការណ៍ Review',
    reportReviewComingSoon: 'មុខងារ Report Review នឹងមកដល់ឆាប់ៗនេះ។',
    editReview: 'កែ Review',
    deleteReview: 'លុប Review',
    deleteReviewConfirm: 'លុប Review របស់អ្នកមែនទេ? មិនអាចត្រឡប់វិញបានទេ។',
    reviewRemoved: 'បានលុប Review។',
    copyReviewLink: 'ចម្លង Link Review',
    reviewLinkCopied: 'បានចម្លង Link Review។',
    closeReviews: 'បិទ Review',
    edit: 'កែ',
    recentReviews: 'Review ថ្មីៗ',
    seeAll: 'មើលទាំងអស់',
    yes: 'បាទ/ចាស',
    no: 'ទេ',
    reviewPrompt: 'តើអ្នកចង់និយាយអ្វីអំពី {{name}}?',
    public: 'សាធារណៈ',
    reviewMinimum: '{{count}} / 25 · Review ត្រូវមានយ៉ាងតិច 25 តួអក្សរ',
    discardReview: 'បោះបង់ Review?',
    discardReviewText: 'Review ជួយអ្នកអានផ្សេងយល់ពីទំព័រនេះ។ តើអ្នកប្រាកដថាចង់បោះបង់អត្ថបទព្រាងទេ?',
    discard: 'បោះបង់',
    keepWriting: 'បន្តសរសេរ',
    allowReadersReviewQuestion: 'អនុញ្ញាតឱ្យអ្នកអានមើល និងសរសេរ Review លើទំព័ររបស់អ្នក?',
    recommends: 'ណែនាំ',
    doesNotRecommend: 'មិនណែនាំ',
    basedOnReaderReviews: 'ផ្អែកលើ Review របស់អ្នកអាន {{count}}',
    loading: 'កំពុងផ្ទុក...',
    recommendedPercent: '{{percent}}% ណែនាំ',
    basedOnOpinions: 'ផ្អែកលើមតិរបស់មនុស្ស {{count}} នាក់',
    messageAuthor: 'ផ្ញើសារ {{name}}',
    doYouRecommend: 'តើអ្នកណែនាំ {{name}} ទេ?',
    like: 'ចូលចិត្ត',
    comment: 'មតិយោបល់',
    echo: 'Echo',
    reviewPlaceholder: 'Review របស់អ្នក',
    sharing: 'កំពុងចែករំលែក...',
    share: 'ចែករំលែក',
    reviewTooShort: 'Review ត្រូវមានយ៉ាងតិច 25 តួអក្សរ។',
    loadingReviews: 'កំពុងផ្ទុក Review...',
    socialMedia: 'បណ្ដាញសង្គម',
    back: 'ត្រឡប់ក្រោយ',
    openCart: 'បើកកន្ត្រក',
    authorPageOptions: 'ជម្រើសទំព័រអ្នកនិពន្ធ',
    editPage: 'កែទំព័រ',
    pageOptions: 'ជម្រើសទំព័រ',
    switchReaderAccount: 'ប្តូរទៅគណនីអ្នកអាន',
    works: 'ស្នាដៃ',
    followers: 'អ្នក Follow',
    posts: 'Post',
    addToStory: 'បន្ថែមទៅ Story',
    details: 'ព័ត៌មានលម្អិត',
    book: 'សៀវភៅ',
    links: 'Link',
    website: 'វេបសាយ',
    facebookPage: 'Facebook Page',
    facebookComingSoon: 'Link Facebook Page នឹងមានបន្ទាប់ពី Update។',
    contactInfo: 'ព័ត៌មានទំនាក់ទំនង',
    store: 'Store',
    noWorksYet: 'មិនទាន់មានស្នាដៃ',
    noWorksText: 'Novel, Chat Story និង Manga ដែលបាន Publish នឹងបង្ហាញនៅទីនេះ។',
    reviewSettingsSaved: 'បានរក្សាទុកការកំណត់ Review។',
  },
  zh: {
    authorPage: '作者主页',
    reader: '读者',
    untitledStory: '无标题故事',
    story: '故事',
    episodesShort: '{{count}} 集',
    notFoundTitle: '未找到作者主页',
    notFoundText: '此作者主页可能不可用，或用户名不正确。',
    goBack: '返回',
    cropProfilePhoto: '裁剪头像',
    cropCoverPhoto: '裁剪封面',
    cropHelp: '拖动并缩放以适配作者主页图片。',
    closeCropEditor: '关闭裁剪编辑器',
    zoom: '缩放',
    cancel: '取消',
    saving: '保存中...',
    saveCrop: '保存裁剪',
    closeFollowSettings: '关闭关注设置',
    seeFirst: '优先查看',
    muteUpdates: '静音更新',
    unfollowing: '正在取消关注...',
    unfollowAuthor: '取消关注 {{name}}',
    closeSwitcher: '关闭账号切换',
    notification: '{{count}} 条通知',
    notifications: '{{count}} 条通知',
    manageAccount: '管理账号',
    closeAuthorMenu: '关闭作者菜单',
    authorMenu: '作者菜单',
    switchProfile: '切换个人资料',
    finance: '财务',
    settings: '设置',
    closeProfileSwitcher: '关闭个人资料切换',
    authorPageLabel: '作者主页',
    switchingTo: '正在切换到',
    closeCoverOptions: '关闭封面选项',
    seeCover: '查看封面',
    uploadCover: '上传封面',
    chooseCover: '选择封面',
    noBio: '该作者尚未添加简介。',
    alwaysOpen: '始终营业',
    temporarilyClosed: '暂时关闭',
    permanentlyClosed: '永久关闭',
    closed: '已关闭',
    hoursAvailable: '有营业时间',
    open24Hours: '24 小时营业',
    openEveryday: '营业 · 每天 {{hours}}',
    openWeekdays: '营业 · 周一至周五 {{hours}}',
    openWeekend: '营业 · 周六至周日 {{hours}}',
    openDay: '营业 · {{day}} {{hours}}',
    hoursVary: '营业时间因日期而异',
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
    failedUploadImage: '图片上传失败',
    failedSaveProfileImage: '保存作者主页图片失败',
    authorPageNotFound: '未找到作者主页',
    failedLoadReviews: '加载评价失败',
    failedSaveReview: '保存评价失败',
    failedRemoveReview: '删除评价失败',
    failedUpdateFollow: '更新关注状态失败',
    comingSoon: '{{label}} 即将推出。',
    seeFirstUnavailable: '优先查看功能暂不可用。',
    muteUnavailable: '静音更新功能暂不可用。',
    dashboard: '控制面板',
    advertise: '推广',
    following: '已关注',
    follow: '关注',
    message: '消息',
    selectImage: '请选择图片文件',
    adjustPhoto: '请先调整照片',
    failedSaveImage: '保存图片失败',
    uploadingSlide: '正在上传幻灯片到 Cloudflare...',
    slideUploaded: '幻灯片已上传。',
    failedUploadSlide: '上传幻灯片失败',
    noCoverPhoto: '暂无封面图片。',
    reviews: '评价',
    reviewSettingsText: '评价可帮助读者判断是否值得关注你的主页。你可以随时关闭评价，已有评价会隐藏，直到再次开启。',
    allowReviews: '允许此主页显示评价',
    save: '保存',
    backToReviews: '返回评价',
    aboutReviewScore: '关于评价分数',
    recommendSummary: '{{percent}}% 推荐（{{count}} 条评价）',
    reviewScoreInfo: '此分数基于读者对该作者主页的评价。读者可以选择是否推荐该主页并留下公开评价。百分比表示推荐该主页的有效评价比例。',
    noReviewsYet: '暂无评价。',
    howReviewsWork: 'Shadow 评价的工作方式',
    reportReview: '举报评价',
    reportReviewComingSoon: '举报评价功能即将推出。',
    editReview: '编辑评价',
    deleteReview: '删除评价',
    deleteReviewConfirm: '删除你的评价？此操作无法撤销。',
    reviewRemoved: '评价已删除。',
    copyReviewLink: '复制评价链接',
    reviewLinkCopied: '评价链接已复制。',
    closeReviews: '关闭评价',
    edit: '编辑',
    recentReviews: '近期评价',
    seeAll: '查看全部',
    yes: '是',
    no: '否',
    reviewPrompt: '你想对 {{name}} 说些什么？',
    public: '公开',
    reviewMinimum: '{{count}} / 25 · 评价至少需要 25 个字符',
    discardReview: '放弃评价？',
    discardReviewText: '评价可以帮助其他读者了解此主页。确定要放弃草稿吗？',
    discard: '放弃',
    keepWriting: '继续编辑',
    allowReadersReviewQuestion: '允许读者查看并在你的主页上撰写评价？',
    recommends: '推荐',
    doesNotRecommend: '不推荐',
    basedOnReaderReviews: '基于 {{count}} 条读者评价',
    loading: '加载中...',
    recommendedPercent: '{{percent}}% 推荐',
    basedOnOpinions: '基于 {{count}} 人的意见',
    messageAuthor: '给 {{name}} 发消息',
    doYouRecommend: '你推荐 {{name}} 吗？',
    like: '赞',
    comment: '评论',
    echo: 'Echo',
    reviewPlaceholder: '你的评价',
    sharing: '正在分享...',
    share: '分享',
    reviewTooShort: '评价至少需要 25 个字符。',
    loadingReviews: '正在加载评价...',
    socialMedia: '社交媒体',
    back: '返回',
    openCart: '打开购物车',
    authorPageOptions: '作者主页选项',
    editPage: '编辑主页',
    pageOptions: '主页选项',
    switchReaderAccount: '切换到读者账号',
    works: '作品',
    followers: '关注者',
    posts: '帖子',
    addToStory: '添加到故事',
    details: '详情',
    book: '图书',
    links: '链接',
    website: '网站',
    facebookPage: 'Facebook Page',
    facebookComingSoon: 'Facebook Page 链接将在更新后提供。',
    contactInfo: '联系信息',
    store: '商店',
    noWorksYet: '暂无作品',
    noWorksText: '已发布的小说、Chat Story 和 Manga 会显示在这里。',
    reviewSettingsSaved: '评价设置已保存。',
  },
  ja: {
    authorPage: '作者ページ',
    reader: '読者',
    untitledStory: '無題のストーリー',
    story: 'ストーリー',
    episodesShort: '{{count}}話',
    notFoundTitle: '作者ページが見つかりません',
    notFoundText: 'この作者ページは利用できないか、ユーザー名が正しくない可能性があります。',
    goBack: '戻る',
    cropProfilePhoto: 'プロフィール写真を切り抜く',
    cropCoverPhoto: 'カバー写真を切り抜く',
    cropHelp: 'ドラッグとズームで作者ページ画像を調整します。',
    closeCropEditor: '切り抜きエディターを閉じる',
    zoom: 'ズーム',
    cancel: 'キャンセル',
    saving: '保存中...',
    saveCrop: '切り抜きを保存',
    closeFollowSettings: 'フォロー設定を閉じる',
    seeFirst: '優先表示',
    muteUpdates: '更新をミュート',
    unfollowing: 'フォロー解除中...',
    unfollowAuthor: '{{name}} のフォローを解除',
    closeSwitcher: '切り替え画面を閉じる',
    notification: '{{count}} 件の通知',
    notifications: '{{count}} 件の通知',
    manageAccount: 'アカウント管理',
    closeAuthorMenu: '作者メニューを閉じる',
    authorMenu: '作者メニュー',
    switchProfile: 'プロフィール切替',
    finance: '収益',
    settings: '設定',
    closeProfileSwitcher: 'プロフィール切替を閉じる',
    authorPageLabel: '作者ページ',
    switchingTo: '切り替え中',
    closeCoverOptions: 'カバーオプションを閉じる',
    seeCover: 'カバーを見る',
    uploadCover: 'カバーをアップロード',
    chooseCover: 'カバーを選択',
    noBio: 'この作者はまだ紹介文を追加していません。',
    alwaysOpen: '常時営業',
    temporarilyClosed: '一時休業',
    permanentlyClosed: '閉業',
    closed: '休業',
    hoursAvailable: '営業時間あり',
    open24Hours: '24時間営業',
    openEveryday: '営業 · 毎日 {{hours}}',
    openWeekdays: '営業 · 月〜金 {{hours}}',
    openWeekend: '営業 · 土〜日 {{hours}}',
    openDay: '営業 · {{day}} {{hours}}',
    hoursVary: '曜日によって営業時間が異なります',
    monday: '月曜日',
    tuesday: '火曜日',
    wednesday: '水曜日',
    thursday: '木曜日',
    friday: '金曜日',
    saturday: '土曜日',
    sunday: '日曜日',
    failedUploadImage: '画像のアップロードに失敗しました',
    failedSaveProfileImage: '作者ページ画像の保存に失敗しました',
    authorPageNotFound: '作者ページが見つかりません',
    failedLoadReviews: 'レビューを読み込めませんでした',
    failedSaveReview: 'レビューを保存できませんでした',
    failedRemoveReview: 'レビューを削除できませんでした',
    failedUpdateFollow: 'フォロー状態を更新できませんでした',
    comingSoon: '{{label}} は近日公開予定です。',
    seeFirstUnavailable: '優先表示はまだ利用できません。',
    muteUnavailable: '更新のミュートはまだ利用できません。',
    dashboard: 'ダッシュボード',
    advertise: '広告',
    following: 'フォロー中',
    follow: 'フォロー',
    message: 'メッセージ',
    selectImage: '画像ファイルを選択してください',
    adjustPhoto: '先に写真を調整してください',
    failedSaveImage: '画像を保存できませんでした',
    uploadingSlide: 'スライドを Cloudflare にアップロード中...',
    slideUploaded: 'スライドをアップロードしました。',
    failedUploadSlide: 'スライドをアップロードできませんでした',
    noCoverPhoto: 'カバー写真はまだありません。',
    reviews: 'レビュー',
    reviewSettingsText: 'レビューは読者がこのページをフォローする価値があるか判断する助けになります。レビューはいつでもオフにでき、再度オンにするまで既存レビューは非表示になります。',
    allowReviews: 'このページでレビューを許可',
    save: '保存',
    backToReviews: 'レビューに戻る',
    aboutReviewScore: 'レビュー評価について',
    recommendSummary: '{{percent}}% が推奨（{{count}}件のレビュー）',
    reviewScoreInfo: 'この評価は作者ページに対する読者レビューに基づきます。読者はページを勧めるか選択し、公開レビューを残せます。割合は有効なレビューのうち推奨した割合を示します。',
    noReviewsYet: 'レビューはまだありません。',
    howReviewsWork: 'Shadow レビューの仕組み',
    reportReview: 'レビューを報告',
    reportReviewComingSoon: 'レビュー報告機能は近日公開予定です。',
    editReview: 'レビューを編集',
    deleteReview: 'レビューを削除',
    deleteReviewConfirm: 'レビューを削除しますか？この操作は元に戻せません。',
    reviewRemoved: 'レビューを削除しました。',
    copyReviewLink: 'レビューリンクをコピー',
    reviewLinkCopied: 'レビューリンクをコピーしました。',
    closeReviews: 'レビューを閉じる',
    edit: '編集',
    recentReviews: '最近のレビュー',
    seeAll: 'すべて見る',
    yes: 'はい',
    no: 'いいえ',
    reviewPrompt: '{{name}} についてどう思いますか？',
    public: '公開',
    reviewMinimum: '{{count}} / 25 · レビューは25文字以上必要です',
    discardReview: 'レビューを破棄しますか？',
    discardReviewText: 'レビューは他の読者がこのページを理解する助けになります。下書きを破棄してもよろしいですか？',
    discard: '破棄',
    keepWriting: '書き続ける',
    allowReadersReviewQuestion: '読者がこのページのレビューを閲覧・投稿できるようにしますか？',
    recommends: 'おすすめしています',
    doesNotRecommend: 'おすすめしていません',
    basedOnReaderReviews: '{{count}}件の読者レビューに基づく',
    loading: '読み込み中...',
    recommendedPercent: '{{percent}}% がおすすめ',
    basedOnOpinions: '{{count}}人の意見に基づく',
    messageAuthor: '{{name}} にメッセージ',
    doYouRecommend: '{{name}} をおすすめしますか？',
    like: 'いいね',
    comment: 'コメント',
    echo: 'Echo',
    reviewPlaceholder: 'レビューを入力',
    sharing: '共有中...',
    share: '共有',
    reviewTooShort: 'レビューは25文字以上必要です。',
    loadingReviews: 'レビューを読み込み中...',
    socialMedia: 'ソーシャルメディア',
    back: '戻る',
    openCart: 'カートを開く',
    authorPageOptions: '作者ページのオプション',
    editPage: 'ページを編集',
    pageOptions: 'ページオプション',
    switchReaderAccount: '読者アカウントに切り替え',
    works: '作品',
    followers: 'フォロワー',
    posts: '投稿',
    addToStory: 'ストーリーに追加',
    details: '詳細',
    book: '本',
    links: 'リンク',
    website: 'ウェブサイト',
    facebookPage: 'Facebook Page',
    facebookComingSoon: 'Facebook Page のリンクは更新後に利用できます。',
    contactInfo: '連絡先',
    store: 'ストア',
    noWorksYet: '作品はまだありません',
    noWorksText: '公開した小説、Chat Story、Manga がここに表示されます。',
    reviewSettingsSaved: 'レビュー設定を保存しました。',
  },
  ko: {
    authorPage: '작가 페이지',
    reader: '독자',
    untitledStory: '제목 없는 스토리',
    story: '스토리',
    episodesShort: '{{count}}화',
    notFoundTitle: '작가 페이지를 찾을 수 없습니다',
    notFoundText: '이 작가 페이지를 사용할 수 없거나 사용자 이름이 올바르지 않을 수 있습니다.',
    goBack: '뒤로 가기',
    cropProfilePhoto: '프로필 사진 자르기',
    cropCoverPhoto: '커버 사진 자르기',
    cropHelp: '드래그하고 확대하여 작가 페이지 이미지를 맞추세요.',
    closeCropEditor: '자르기 편집기 닫기',
    zoom: '확대',
    cancel: '취소',
    saving: '저장 중...',
    saveCrop: '자르기 저장',
    closeFollowSettings: '팔로우 설정 닫기',
    seeFirst: '먼저 보기',
    muteUpdates: '업데이트 알림 끄기',
    unfollowing: '팔로우 해제 중...',
    unfollowAuthor: '{{name}} 팔로우 해제',
    closeSwitcher: '프로필 전환 닫기',
    notification: '알림 {{count}}개',
    notifications: '알림 {{count}}개',
    manageAccount: '계정 관리',
    closeAuthorMenu: '작가 메뉴 닫기',
    authorMenu: '작가 메뉴',
    switchProfile: '프로필 전환',
    finance: '재정',
    settings: '설정',
    closeProfileSwitcher: '프로필 전환 닫기',
    authorPageLabel: '작가 페이지',
    switchingTo: '전환 중',
    closeCoverOptions: '커버 옵션 닫기',
    seeCover: '커버 보기',
    uploadCover: '커버 업로드',
    chooseCover: '커버 선택',
    noBio: '이 작가는 아직 소개를 추가하지 않았습니다.',
    alwaysOpen: '항상 영업',
    temporarilyClosed: '임시 휴업',
    permanentlyClosed: '영구 폐업',
    closed: '휴무',
    hoursAvailable: '영업시간 있음',
    open24Hours: '24시간 영업',
    openEveryday: '영업 · 매일 {{hours}}',
    openWeekdays: '영업 · 월–금 {{hours}}',
    openWeekend: '영업 · 토–일 {{hours}}',
    openDay: '영업 · {{day}} {{hours}}',
    hoursVary: '요일마다 영업시간이 다릅니다',
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
    failedUploadImage: '이미지를 업로드하지 못했습니다',
    failedSaveProfileImage: '작가 페이지 이미지를 저장하지 못했습니다',
    authorPageNotFound: '작가 페이지를 찾을 수 없습니다',
    failedLoadReviews: '리뷰를 불러오지 못했습니다',
    failedSaveReview: '리뷰를 저장하지 못했습니다',
    failedRemoveReview: '리뷰를 삭제하지 못했습니다',
    failedUpdateFollow: '팔로우 상태를 업데이트하지 못했습니다',
    comingSoon: '{{label}} 기능은 곧 제공됩니다.',
    seeFirstUnavailable: '먼저 보기 기능은 아직 사용할 수 없습니다.',
    muteUnavailable: '업데이트 알림 끄기 기능은 아직 사용할 수 없습니다.',
    dashboard: '대시보드',
    advertise: '광고',
    following: '팔로우 중',
    follow: '팔로우',
    message: '메시지',
    selectImage: '이미지 파일을 선택하세요',
    adjustPhoto: '먼저 사진을 조정하세요',
    failedSaveImage: '이미지를 저장하지 못했습니다',
    uploadingSlide: '슬라이드를 Cloudflare에 업로드 중...',
    slideUploaded: '슬라이드를 업로드했습니다.',
    failedUploadSlide: '슬라이드를 업로드하지 못했습니다',
    noCoverPhoto: '커버 사진이 아직 없습니다.',
    reviews: '리뷰',
    reviewSettingsText: '리뷰는 독자가 이 페이지를 팔로우할 가치가 있는지 판단하는 데 도움을 줍니다. 리뷰는 언제든 끌 수 있으며 다시 켤 때까지 기존 리뷰는 숨겨집니다.',
    allowReviews: '이 페이지에서 리뷰 허용',
    save: '저장',
    backToReviews: '리뷰로 돌아가기',
    aboutReviewScore: '리뷰 점수 정보',
    recommendSummary: '{{percent}}% 추천 (리뷰 {{count}}개)',
    reviewScoreInfo: '이 점수는 이 작가 페이지에 대한 독자 리뷰를 기반으로 합니다. 독자는 페이지 추천 여부를 선택하고 공개 리뷰를 남길 수 있습니다. 비율은 활성 리뷰 중 페이지를 추천한 비율을 나타냅니다.',
    noReviewsYet: '아직 리뷰가 없습니다.',
    howReviewsWork: 'Shadow 리뷰 작동 방식',
    reportReview: '리뷰 신고',
    reportReviewComingSoon: '리뷰 신고 기능은 곧 제공됩니다.',
    editReview: '리뷰 수정',
    deleteReview: '리뷰 삭제',
    deleteReviewConfirm: '리뷰를 삭제할까요? 이 작업은 되돌릴 수 없습니다.',
    reviewRemoved: '리뷰를 삭제했습니다.',
    copyReviewLink: '리뷰 링크 복사',
    reviewLinkCopied: '리뷰 링크를 복사했습니다.',
    closeReviews: '리뷰 닫기',
    edit: '편집',
    recentReviews: '최근 리뷰',
    seeAll: '전체 보기',
    yes: '예',
    no: '아니요',
    reviewPrompt: '{{name}}에 대해 무엇을 말하고 싶으신가요?',
    public: '공개',
    reviewMinimum: '{{count}} / 25 · 리뷰는 최소 25자여야 합니다',
    discardReview: '리뷰를 버릴까요?',
    discardReviewText: '리뷰는 다른 독자가 이 페이지를 이해하는 데 도움을 줍니다. 초안을 버리시겠습니까?',
    discard: '버리기',
    keepWriting: '계속 작성',
    allowReadersReviewQuestion: '독자가 이 페이지의 리뷰를 보고 작성하도록 허용할까요?',
    recommends: '추천함',
    doesNotRecommend: '추천하지 않음',
    basedOnReaderReviews: '독자 리뷰 {{count}}개 기준',
    loading: '불러오는 중...',
    recommendedPercent: '{{percent}}% 추천',
    basedOnOpinions: '{{count}}명의 의견을 기준으로 함',
    messageAuthor: '{{name}}에게 메시지',
    doYouRecommend: '{{name}}을(를) 추천하시나요?',
    like: '좋아요',
    comment: '댓글',
    echo: 'Echo',
    reviewPlaceholder: '리뷰를 입력하세요',
    sharing: '공유 중...',
    share: '공유',
    reviewTooShort: '리뷰는 최소 25자여야 합니다.',
    loadingReviews: '리뷰 불러오는 중...',
    socialMedia: '소셜 미디어',
    back: '뒤로',
    openCart: '장바구니 열기',
    authorPageOptions: '작가 페이지 옵션',
    editPage: '페이지 편집',
    pageOptions: '페이지 옵션',
    switchReaderAccount: '독자 계정으로 전환',
    works: '작품',
    followers: '팔로워',
    posts: '게시물',
    addToStory: '스토리에 추가',
    details: '상세 정보',
    book: '책',
    links: '링크',
    website: '웹사이트',
    facebookPage: 'Facebook Page',
    facebookComingSoon: 'Facebook Page 링크는 업데이트 후 제공됩니다.',
    contactInfo: '연락처',
    store: '스토어',
    noWorksYet: '아직 작품이 없습니다',
    noWorksText: '게시된 소설, Chat Story, Manga가 여기에 표시됩니다.',
    reviewSettingsSaved: '리뷰 설정을 저장했습니다.',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const tabs = ['Posts', 'Works', 'Store']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredReaderUser() {
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

function getStoredAuthorProfileDetails() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page_profile_details') || '{}') || {}
  } catch {
    return {}
  }
}

function getAuthorCartCount() {
  try {
    const cartItems = JSON.parse(localStorage.getItem('shadow_author_cart_items') || '[]')

    if (!Array.isArray(cartItems)) return 0

    return cartItems.reduce((total, item) => total + Number(item.quantity || 1), 0)
  } catch {
    return 0
  }
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

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPublicPage.failedUploadImage'))
  }

  return data.image_url || data.imageUrl
}

async function saveAuthorProfileImages({ token, avatarUrl = '', coverUrl = '', slideUrls = null }) {
  const body = {
    avatar_url: avatarUrl,
    cover_url: coverUrl,
  }

  if (Array.isArray(slideUrls)) {
    body.slide_urls = slideUrls
  }

  const response = await fetch(`${API_BASE_URL}/api/authors/profile-images`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPublicPage.failedSaveProfileImage'))
  }

  return data.author_page || null
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: number >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: number >= 1000 ? 1 : 0,
  }).format(number)
}

function getCompactHoursText(details = {}) {
  const type = String(details?.hours_type || '').trim()
  const text = String(details?.hours || '').trim()

  if (!text || type === 'not_applicable') return ''
  if (type === 'always_open' || /^always open$/i.test(text)) return getDisplayText('authorPublicPage.alwaysOpen')
  if (type === 'temporarily_closed' || /^temporarily closed$/i.test(text)) return getDisplayText('authorPublicPage.temporarilyClosed')
  if (type === 'permanently_closed' || /^permanently closed$/i.test(text)) return getDisplayText('authorPublicPage.permanentlyClosed')
  if (/^closed$/i.test(text)) return getDisplayText('authorPublicPage.closed')

  const oneLine = text.replace(/\s+/g, ' ').trim()

  if (!text.includes('\n')) {
    if (/^everyday:\s*/i.test(oneLine)) {
      return oneLine.replace(/^everyday:\s*/i, 'Open · Everyday ')
    }

    if (/^open\s+/i.test(oneLine)) {
      return oneLine.replace(/^open\s+([^:]+):\s*/i, 'Open · $1 ')
    }

    return oneLine
  }

  const dayOrder = [
    ['monday', 'Monday', 0],
    ['tuesday', 'Tuesday', 1],
    ['wednesday', 'Wednesday', 2],
    ['thursday', 'Thursday', 3],
    ['friday', 'Friday', 4],
    ['saturday', 'Saturday', 5],
    ['sunday', 'Sunday', 6],
  ]

  const dayMap = new Map(dayOrder.map(([key, label, index]) => [label.toLowerCase(), { key, label, index }]))

  const entries = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([A-Za-z]+):\s*(.+)$/)
      if (!match) return null

      const day = dayMap.get(match[1].toLowerCase())
      if (!day) return null

      return {
        ...day,
        hours: match[2].trim(),
      }
    })
    .filter(Boolean)

  if (!entries.length) return getDisplayText('authorPublicPage.hoursAvailable')

  const openEntries = entries.filter((item) => !/^closed$/i.test(item.hours))

  if (!openEntries.length) return getDisplayText('authorPublicPage.closed')

  const uniqueHours = [...new Set(openEntries.map((item) => item.hours))]
  const openIndexes = openEntries.map((item) => item.index).sort((a, b) => a - b)

  if (uniqueHours.length === 1) {
    const hours = uniqueHours[0]
    const indexesText = openIndexes.join(',')

    if (indexesText === '0,1,2,3,4,5,6') {
      if (/open 24 hours/i.test(hours)) return getDisplayText('authorPublicPage.open24Hours')
      return getDisplayText('authorPublicPage.openEveryday', { hours })
    }

    if (indexesText === '0,1,2,3,4') {
      return getDisplayText('authorPublicPage.openWeekdays', { hours })
    }

    if (indexesText === '5,6') {
      return getDisplayText('authorPublicPage.openWeekend', { hours })
    }

    if (openEntries.length === 1) {
      return getDisplayText('authorPublicPage.openDay', { day: getDisplayText(`authorPublicPage.${openEntries[0].key}`), hours })
    }
  }

  return getDisplayText('authorPublicPage.hoursVary')
}

function normalizeAuthor(page, pageUsername, myPage = null, forceOwner = false) {
  const author = page || {}

    const viewerOwnsPage = Boolean(
    (myPage?.id &&
      author.id &&
      myPage.id === author.id) ||
      (myPage?.page_username &&
        author.page_username &&
        myPage.page_username ===
          author.page_username)
  )

  return {
    id: author.id || '',
    user_id: author.user_id || '',
    page_name: author.page_name || author.name || getDisplayText('authorPublicPage.authorPage'),
    page_username: author.page_username || author.username || pageUsername || 'author',
    page_slug: author.page_slug || author.page_username || pageUsername || 'author',
    bio: author.bio || getDisplayText('authorPublicPage.noBio'),
    avatar_url: author.avatar_url || author.profile_image_url || '',
    cover_url: author.cover_url || author.banner_url || '',
    slide_urls: Array.isArray(author.slide_urls) ? author.slide_urls : [],
profile_details: author.profile_details || {},
works_count: Number(author.total_stories || author.works_count || 0),
    followers_count: Number(author.total_followers || author.followers_count || 0),
    fans_count: Number(author.total_fans || author.fans_count || 0),
    likes_count: Number(author.total_likes || author.likes_count || 0),
    is_following: Boolean(author.is_following),
    works: Array.isArray(author.works) ? author.works : [],
    created_at: author.created_at || '',
    updated_at: author.updated_at || '',
        viewer_owns_page:
      Boolean(forceOwner) ||
      viewerOwnsPage,
    is_owner: Boolean(forceOwner),
  }
}

async function fetchPublicAuthorPage(pageUsername) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPublicPage.authorPageNotFound'))
  }

  const authorPage = data.author_page || data.author || data.page || null

  return authorPage
    ? {
        ...authorPage,
        is_following: Boolean(data.is_following),
        total_followers: Number(data.total_followers ?? authorPage.total_followers ?? 0),
        works: Array.isArray(data.works)
  ? data.works
  : Array.isArray(data.stories)
    ? data.stories
    : Array.isArray(data.author_stories)
      ? data.author_stories
      : Array.isArray(authorPage.works)
        ? authorPage.works
        : Array.isArray(authorPage.stories)
          ? authorPage.stories
          : [],
      }
    : null
}

async function fetchMyAuthorPage() {
  const token = getAuthToken()

  if (!token) return null

  const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    return null
  }

  const authorPage = data.author_page || null

if (!authorPage) return null

return {
  ...authorPage,
  works: Array.isArray(data.works)
    ? data.works
    : Array.isArray(data.stories)
      ? data.stories
      : Array.isArray(data.author_stories)
        ? data.author_stories
        : Array.isArray(authorPage.works)
          ? authorPage.works
          : Array.isArray(authorPage.stories)
            ? authorPage.stories
            : [],
}
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[18px] font-black leading-tight text-[var(--shadow-text-primary)] sm:text-[20px]">
        {formatCompactNumber(value)}
      </div>
      <div className="mt-0.5 text-[12px] font-semibold text-[var(--shadow-text-secondary)] sm:text-[13px]">
        {label}
      </div>
    </div>
  )
}


function AuthorWorkCard({ work, onOpen }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-3 rounded-[20px] bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99]"
    >
      <div className="h-[108px] w-[78px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-elevated)]">
        {work.cover_url ? (
          <img
            src={work.cover_url}
            alt={work.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-bookmark text-[22px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-[var(--shadow-text-primary)]">
          {work.title || t('authorPublicPage.untitledStory')}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[var(--shadow-text-secondary)]">
          <span>{work.main_genre || t('authorPublicPage.story')}</span>
          <span>•</span>
          <span>{t('authorPublicPage.episodesShort', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(Number(work.total_episodes || 0)) })}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
          <span>
            <i className="fa-regular fa-eye mr-1" />
            {formatCompactNumber(work.total_views)}
          </span>
          <span>
            <i className="fa-regular fa-heart mr-1" />
            {formatCompactNumber(work.total_likes)}
          </span>
          <span>
            <i className="fa-regular fa-comment mr-1" />
            {formatCompactNumber(work.total_comments)}
          </span>
        </div>
      </div>
    </button>
  )
}


function EmptyPanel({ title, text }) {
  return (
    <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-7 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-file-lines text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
        {text}
      </p>
    </div>
  )
}

function AuthorNotFound({ onBack }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-soft)] px-4 py-10">
      <div className="mx-auto max-w-[420px] rounded-full bg-[var(--shadow-bg-surface)] p-7 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
          <i className="fa-regular fa-user text-[24px]" />
        </div>
        <h1 className="text-[20px] font-black text-[var(--shadow-text-primary)]">{t('authorPublicPage.notFoundTitle')}</h1>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
          {t('authorPublicPage.notFoundText')}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 h-11 w-full rounded-full bg-[#111827] text-[14px] font-black text-white"
        >
          {t('authorPublicPage.goBack')}
        </button>
      </div>
    </div>
  )
}

function CropImageModal({
  open,
  image,
  mode,
  crop,
  zoom,
  croppedAreaPixels,
  saving,
  message,
  messageVisible,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  const isAvatar = mode === 'avatar'

  return (
   <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 px-0 pb-[72px] md:items-center md:px-4 md:pb-0">
      <div className="mx-auto flex min-h-0 w-full max-w-[560px] items-end justify-center md:items-center">
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
                {isAvatar ? t('authorPublicPage.cropProfilePhoto') : t('authorPublicPage.cropCoverPhoto')}
              </h2>
              <p className="mt-1 text-[11.5px] leading-4 text-[var(--shadow-text-secondary)]">
                {t('authorPublicPage.cropHelp')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={t('authorPublicPage.closeCropEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          {message ? (
            <div
              className={`mb-3 rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-medium text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] transition-all duration-300 ${
                messageVisible ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className={`${isAvatar ? 'h-[min(78vw,360px)] max-h-[360px] min-h-[260px]' : 'h-[min(58vw,300px)] max-h-[300px] min-h-[220px]'} relative mx-auto w-full overflow-hidden rounded-[22px] bg-[#111827]`}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={isAvatar ? 1 : 16 / 7}
              cropShape={isAvatar ? 'round' : 'rect'}
              showGrid={false}
              restrictPosition={false}
              objectFit="contain"
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              <span>{t('authorPublicPage.zoom')}</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-full accent-[#111827]"
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]"
            >
              {t('authorPublicPage.cancel')}
            </button>
            <button
              type="button"
              onClick={() => onSave(croppedAreaPixels)}
              disabled={saving}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? t('authorPublicPage.saving') : t('authorPublicPage.saveCrop')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FollowSettingsSheet({ open, author, loading, onClose, onSeeFirst, onMute, onUnfollow }) {
  const { t } = useDisplayTranslation()
  const [dragY, setDragY] = useState(0)
  const dragStartYRef = useRef(null)
  const dragCurrentYRef = useRef(0)

  if (!open || !author) return null

  function handleDragStart(event) {
    dragStartYRef.current = event.clientY
    dragCurrentYRef.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handleDragMove(event) {
    if (dragStartYRef.current === null) return
    const nextDragY = Math.max(0, event.clientY - dragStartYRef.current)
    dragCurrentYRef.current = nextDragY
    setDragY(nextDragY)
  }

  function handleDragEnd() {
    const shouldClose = dragCurrentYRef.current >= 80
    dragStartYRef.current = null
    dragCurrentYRef.current = 0
    setDragY(0)
    if (shouldClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/35 md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label={t('authorPublicPage.closeFollowSettings')}
      />

      <div
        className="relative w-full overflow-hidden rounded-t-[24px] bg-[var(--shadow-bg-surface)] pb-5 shadow-2xl md:max-w-[420px] md:rounded-[24px]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragStartYRef.current === null ? 'transform 180ms ease-out' : 'none',
        }}
      >
        <div
          className="cursor-grab touch-none select-none px-4 pb-2 pt-3 active:cursor-grabbing"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d1d5db]" />
        </div>

        <div className="px-5 pb-4 pt-1">
          <div className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{author.page_name}</div>
          <div className="mt-1 text-[12px] font-normal text-[var(--shadow-text-secondary)]">@{author.page_username}</div>
        </div>

        <div className="border-t border-[var(--shadow-border)]">
          <button
            type="button"
            onClick={onSeeFirst}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-star text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.seeFirst')}</span>
          </button>

          <button
            type="button"
            onClick={onMute}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-bell-slash text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.muteUpdates')}</span>
          </button>

          <button
            type="button"
            onClick={onUnfollow}
            disabled={loading}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[var(--shadow-bg-hover)] disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
              <i className="fa-solid fa-user-minus text-[14px]" />
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
              {loading ? t('authorPublicPage.unfollowing') : t('authorPublicPage.unfollowAuthor', { name: author.page_name })}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}


function AuthorPageSwitcherSheet({ open, onClose, author, readerUser, readerNotificationCount, onPage, onOwnAccount, onManageAccount }) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  const pageName = author?.page_name || t('authorPublicPage.authorPage')
  const pageLogo = author?.avatar_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'
  const readerName = readerUser?.name || t('authorPublicPage.reader')
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'
  const showReaderBadge = Number(readerNotificationCount || 0) > 0

  return (
    <div className="fixed inset-0 z-[230]">
      <button type="button" aria-label={t('authorPublicPage.closeSwitcher')} onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-1/2 md:right-auto md:top-20 md:w-[380px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-elevated)]" />

        <div className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
          <button type="button" onClick={onPage} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                {pageLogo ? (
                  <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{pageLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{pageName}</div>
              </div>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
              <i className="fa-solid fa-check text-[10px]" />
            </span>
          </button>

          <button type="button" onClick={onOwnAccount} className="flex w-full items-center justify-between gap-3 border-t border-[var(--shadow-border)] px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white">
                {readerAvatar ? (
                  <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{readerLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{readerName}</div>
                {showReaderBadge ? (
  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
    <span>{t(Number(readerNotificationCount) === 1 ? 'authorPublicPage.notification' : 'authorPublicPage.notifications', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(Number(readerNotificationCount)) })}</span>
  </div>
) : null}
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
          </button>
        </div>

        <button type="button" onClick={onManageAccount} className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-[0.99]">
          {t('authorPublicPage.manageAccount')}
        </button>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
        </div>
      </div>
    </div>
  )
}

function AuthorOwnerMenuSheet({
  open,
  onClose,
  author,
  readerUser,
  readerNotificationCount,
  onPage,
  onOwnAccount,
  onManageAccount,
  onOpenFinance,
  onOpenStoreSetting,
}) {
  
  const { t } = useDisplayTranslation()
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)

  if (!open) return null

  const pageName = author?.page_name || t('authorPublicPage.authorPage')
  const pageLogo = author?.avatar_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'
  const readerName = readerUser?.name || t('authorPublicPage.reader')
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'
  const showReaderBadge = Number(readerNotificationCount || 0) > 0

  return (
    <div className="fixed inset-0 z-[235]">
      <button
        type="button"
        aria-label={t('authorPublicPage.closeAuthorMenu')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <aside className="absolute bottom-0 left-0 top-0 w-[84vw] max-w-[390px] overflow-y-auto bg-[var(--shadow-bg-surface)] px-4 pb-8 pt-4 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorPublicPage.authorMenu')}</h2>
        </div>

        <div className="bg-[var(--shadow-bg-surface)] px-0 py-3">
          <button
            type="button"
            onClick={() => setProfileSwitcherOpen(true)}
            className="flex w-full items-center gap-3 text-left active:scale-[0.99]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
              {pageLogo ? (
                <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[20px] font-extrabold">{pageLetter}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-black text-[var(--shadow-text-primary)]">{pageName}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('authorPublicPage.switchProfile')}
              </div>
            </div>
          </button>
        </div>

        

<div className="mt-5 space-y-1">
  <button
    type="button"
    onClick={onOpenFinance}
    className="flex w-full items-center gap-3 px-0 py-2.5 text-left active:opacity-70"
  >
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
      <i className="fa-solid fa-wallet text-[17px]" />
    </span>

    <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
      {t('authorPublicPage.finance')}
    </span>
  </button>

  <button
  type="button"
  onClick={onOpenStoreSetting}
  className="flex w-full items-center gap-3 px-0 py-2.5 text-left active:opacity-70"
>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
      <i className="fa-solid fa-gear text-[17px]" />
    </span>

    <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
      {t('authorPublicPage.settings')}
    </span>
  </button>
</div>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
        </div>
      </aside>

      {profileSwitcherOpen ? (
        <div className="fixed inset-0 z-[260] flex items-end justify-center bg-black/35 px-0 pb-0 md:items-center md:px-4 md:pb-0">
          <button
            type="button"
            aria-label={t('authorPublicPage.closeProfileSwitcher')}
            onClick={() => setProfileSwitcherOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative w-full overflow-hidden rounded-t-[26px] bg-[var(--shadow-bg-surface)] px-4 pb-6 pt-3 shadow-2xl md:max-w-[390px] md:rounded-[26px]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

            <div className="overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setProfileSwitcherOpen(false)
                  onPage?.()
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                    {pageLogo ? (
                      <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[18px] font-extrabold">{pageLetter}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-black text-[var(--shadow-text-primary)]">{pageName}</div>
                    <div className="mt-0.5 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorPublicPage.authorPageLabel')}</div>
                  </div>
                </div>

                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
                  <i className="fa-solid fa-check text-[10px]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileSwitcherOpen(false)
                  onOwnAccount?.()
                }}
                className="flex w-full items-center justify-between gap-3 border-t border-[var(--shadow-border)] px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                    {readerAvatar ? (
                      <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[18px] font-extrabold">{readerLetter}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-black text-[var(--shadow-text-primary)]">{readerName}</div>
                    {showReaderBadge ? (
  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
    <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
    <span>{t(Number(readerNotificationCount) === 1 ? 'authorPublicPage.notification' : 'authorPublicPage.notifications', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(Number(readerNotificationCount)) })}</span>
  </div>
) : null}
                  </div>
                </div>

                <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-disabled)]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileSwitcherOpen(false)
                onManageAccount?.()
              }}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-[0.99]"
            >
              {t('authorPublicPage.manageAccount')}
            </button>

            <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
              <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SwitchingAccountScreen({ open, name, avatarUrl, avatarLetter }) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] flex min-h-screen flex-col items-center justify-center bg-[var(--shadow-bg-surface)]">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--shadow-border)] border-t-[#111827] animate-spin" />
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[20px] font-bold">{avatarLetter}</span>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="text-[16px] font-medium text-[var(--shadow-text-primary)]">{t('authorPublicPage.switchingTo')}</div>
          <div className="mt-1 text-[17px] font-bold text-[var(--shadow-text-primary)]">{name}</div>
        </div>
      </div>

      <div className="pointer-events-none mb-8 flex h-14 w-36 items-center justify-center">
        <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-11 w-auto object-contain opacity-95" />
      </div>
    </div>
  )
}
function CoverOptionsSheet({ open, savingSlide, onClose, onSeeCover, onUploadCover, onChooseCover }) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[240]">
      <button type="button" aria-label={t('authorPublicPage.closeCoverOptions')} onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#9ca3af]" />

        <div className="space-y-1">
          <button type="button" onClick={onSeeCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-image text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.seeCover')}</span>
          </button>

          <button type="button" onClick={onUploadCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.uploadCover')}</span>
          </button>

          <button type="button" onClick={onChooseCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[var(--shadow-bg-soft)]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-folder-open text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.chooseCover')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorPublicPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()

  const [author, setAuthor] = useState(null)
  const [activeTab, setActiveTab] = useState(
  tabs.includes(location.state?.activeTab) ? location.state.activeTab : 'Posts'
)
  const [tabsFrozen, setTabsFrozen] = useState(false)
  const [readerCartCount, setReaderCartCount] = useState(() => getAuthorCartCount())
  const [readerNotificationCount, setReaderNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ownerResolved, setOwnerResolved] = useState(false)
  const [pageError, setPageError] = useState('')
  const [message, setMessage] = useState('')
  const [messageVisible, setMessageVisible] = useState(false)
  const [reviewSummary, setReviewSummary] = useState({
  total_count: 0,
  recommend_count: 0,
  recommend_percent: 0,
})
  const [myReview, setMyReview] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewItems, setReviewItems] = useState([])
  const [reviewsOverviewOpen, setReviewsOverviewOpen] = useState(false)
  const reviewsOverviewDragStartRef = useRef(null)
  const reviewsOverviewDragCurrentRef = useRef(0)
  const [reviewsOverviewDragY, setReviewsOverviewDragY] = useState(0)
  const [reviewsListOpen, setReviewsListOpen] = useState(false)
  const [reviewInfoOpen, setReviewInfoOpen] = useState(false)
  const [reviewOptionsOpen, setReviewOptionsOpen] = useState(false)
  const [selectedReviewOption, setSelectedReviewOption] = useState(null)
  const [reviewSettingsOpen, setReviewSettingsOpen] = useState(false)
  const [allowReviewsDraft, setAllowReviewsDraft] = useState(true)
  const [allowReviewsSaved, setAllowReviewsSaved] = useState(true)
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
  const [savingReview, setSavingReview] = useState(false)
  const [reviewDraftText, setReviewDraftText] = useState('')
  const [reviewDraftRecommended, setReviewDraftRecommended] = useState(true)
  const [reviewDraftError, setReviewDraftError] = useState('')
  const [reviewDiscardOpen, setReviewDiscardOpen] = useState(false)
  const reviewPopupOpen =
    reviewsOverviewOpen ||
    reviewsListOpen ||
    reviewInfoOpen ||
    reviewOptionsOpen ||
    reviewSettingsOpen ||
    reviewSheetOpen ||
    reviewDiscardOpen
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropMode, setCropMode] = useState('avatar')
  const [rawImage, setRawImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [savingImage, setSavingImage] = useState(false)
  const [savingSlide, setSavingSlide] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followSettingsOpen, setFollowSettingsOpen] = useState(false)
  const [authorPostsCount, setAuthorPostsCount] = useState(0)
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false)
  const [authorMenuOpen, setAuthorMenuOpen] = useState(false)
  const [messageRequestOpen, setMessageRequestOpen] = useState(false)
  const [socialMediaOpen, setSocialMediaOpen] = useState(false)
  const [switchingToReader, setSwitchingToReader] = useState(false)
  const readerUser = getStoredReaderUser()
  const readerName = readerUser?.name || t('authorPublicPage.reader')
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'
  const [coverOptionsOpen, setCoverOptionsOpen] = useState(false)
  const [readerHeaderSolid, setReaderHeaderSolid] = useState(false)
  const [readerHeaderTitle, setReaderHeaderTitle] = useState(false)
  const coverRef = useRef(null)
  const profileRef = useRef(null)
  const tabsRef = useRef(null)
  const databaseProfileDetails = author?.profile_details || {}
  const storedProfileDetails = getStoredAuthorProfileDetails()
  const profileDetails = author?.is_owner
  ? { ...storedProfileDetails, ...databaseProfileDetails }
  : databaseProfileDetails
  
const socialLinks = Array.isArray(profileDetails.social_links) ? profileDetails.social_links : []
const legacySocialUrls = String(profileDetails.social_media || '').match(/https?:\/\/[^\s]+/gi) || []
const firstSocial = socialLinks[0]
const firstValue = String(firstSocial?.display_name || firstSocial?.value || '').trim()
const socialBase = firstSocial ? (!/^https?:\/\//i.test(firstValue) ? firstValue.replace(/^@/, '') : String(firstSocial.platform || t('authorPublicPage.socialMedia')).replace(/^./, (c) => c.toUpperCase())) : legacySocialUrls[0]?.includes('facebook.com') ? 'Facebook' : legacySocialUrls.length ? t('authorPublicPage.socialMedia') : ''
const socialCount = socialLinks.length || legacySocialUrls.length
const socialPreview = socialBase ? `${socialBase}${socialCount > 1 ? ` + ${socialCount - 1}` : ''}` : ''

  useEffect(() => {
    if (!message) {
      setMessageVisible(false)
      return undefined
    }

    setMessageVisible(true)

    const fadeTimer = window.setTimeout(() => {
      setMessageVisible(false)
    }, 2200)

    const clearTimer = window.setTimeout(() => {
      setMessage('')
    }, 2500)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(clearTimer)
    }
  }, [message])

  function handleSwitchToReaderAccount() {
  setPageSwitcherOpen(false)
  setSwitchingToReader(true)

  window.setTimeout(() => {
    navigate('/me')
  }, 800)
}

  function handleAuthorFooterComingSoon(label) {
  setMessage(getDisplayText('authorPublicPage.comingSoon', { label }))
}
  useEffect(() => {
  if (!followSettingsOpen) return undefined

  const scrollY = window.scrollY
  const previousHtmlOverflow = document.documentElement.style.overflow
  const previousOverflow = document.body.style.overflow
  const previousPosition = document.body.style.position
  const previousTop = document.body.style.top
  const previousWidth = document.body.style.width

  document.body.classList.add('mobile-popup-open')
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'

  return () => {
    document.body.classList.remove('mobile-popup-open')
    document.documentElement.style.overflow = previousHtmlOverflow
    document.body.style.overflow = previousOverflow
    document.body.style.position = previousPosition
    document.body.style.top = previousTop
    document.body.style.width = previousWidth
    window.scrollTo(0, scrollY)
  }
}, [followSettingsOpen])


useEffect(() => {
  if (!reviewPopupOpen) return undefined

  const scrollY = window.scrollY
  const previousHtmlOverflow = document.documentElement.style.overflow
  const previousOverflow = document.body.style.overflow
  const previousPosition = document.body.style.position
  const previousTop = document.body.style.top
  const previousWidth = document.body.style.width

  document.body.classList.add('mobile-popup-open')
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'

  return () => {
    document.body.classList.remove('mobile-popup-open')
    document.documentElement.style.overflow = previousHtmlOverflow
    document.body.style.overflow = previousOverflow
    document.body.style.position = previousPosition
    document.body.style.top = previousTop
    document.body.style.width = previousWidth
    window.scrollTo(0, scrollY)
  }
}, [reviewPopupOpen])

  


useEffect(() => {
  if (sessionStorage.getItem('shadow_open_author_menu') !== '1') return
  if (!ownerResolved) return

  sessionStorage.removeItem('shadow_open_author_menu')

  if (author?.is_owner) {
    setAuthorMenuOpen(true)
  }
}, [ownerResolved, author?.is_owner])
  
  useEffect(() => {
  if (!authorMenuOpen) return undefined

  const previousOverflow = document.body.style.overflow
  const previousTouchAction = document.body.style.touchAction

  document.body.style.overflow = 'hidden'
  document.body.style.touchAction = 'none'

  return () => {
    document.body.style.overflow = previousOverflow
    document.body.style.touchAction = previousTouchAction
  }
}, [authorMenuOpen])

  useEffect(() => {
    function syncAuthorCartCount() {
      setReaderCartCount(getAuthorCartCount())
    }

    syncAuthorCartCount()

    window.addEventListener('storage', syncAuthorCartCount)
window.addEventListener('shadow-author-cart-updated', syncAuthorCartCount)

return () => {
  window.removeEventListener('storage', syncAuthorCartCount)
  window.removeEventListener('shadow-author-cart-updated', syncAuthorCartCount)
}
}, [])

useEffect(() => {
  if (!ownerResolved || !author?.is_owner) {
    setReaderNotificationCount(0)
    return
  }

  const token = getAuthToken()

  if (!token) {
    setReaderNotificationCount(0)
    return
  }

  let ignore = false

  async function loadReaderNotificationCount() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false || ignore) return

      setReaderNotificationCount(
  Math.max(0, Number(data.unread_count || 0))
)
    } catch {}
  }

  loadReaderNotificationCount()

  return () => {
    ignore = true
  }
}, [
  ownerResolved,
  author?.is_owner,
  pageSwitcherOpen,
  authorMenuOpen,
])


  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  async function loadAuthor() {
    try {
      setLoading(true)
      setOwnerResolved(false)
      setPageError('')
      setAuthor(null)

      if (!pageUsername) {
        const myPage = await fetchMyAuthorPage()

        if (!myPage) {
          throw new Error(getDisplayText('authorPublicPage.authorPageNotFound'))
        }

        setAuthor(normalizeAuthor(myPage, myPage.page_username, myPage, true))
        localStorage.setItem('shadow_author_page', JSON.stringify(myPage))
        setOwnerResolved(true)
        setLoading(false)
        return
      }

      const publicPage = await fetchPublicAuthorPage(pageUsername)
      setAuthor(normalizeAuthor(publicPage, pageUsername, null, false))
      setLoading(false)

      const myPage = await fetchMyAuthorPage().catch(() => null)
      setAuthor(normalizeAuthor(publicPage, pageUsername, myPage))
      setOwnerResolved(true)
    } catch (loadError) {
      setAuthor(null)
      setOwnerResolved(true)
      setPageError(loadError.message || getDisplayText('authorPublicPage.authorPageNotFound'))
      setLoading(false)
    }
  }

  async function loadAuthorReviews(username) {
  if (!username) return

  try {
    setReviewLoading(true)
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorPublicPage.failedLoadReviews'))
    }

    setReviewSummary(data.summary || {
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    })
    setMyReview(data.my_review || null)
    setReviewItems(Array.isArray(data.reviews) ? data.reviews : [])
  } catch {
    setReviewSummary({
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    })
    setMyReview(null)
    setReviewItems([])
  } finally {
    setReviewLoading(false)
  }
}


  useEffect(() => {
    const username = author?.page_username || pageUsername

    if (!username || loading) return

    loadAuthorReviews(username)
  }, [author?.page_username, pageUsername, loading])

  useEffect(() => {
    loadAuthor()
  }, [pageUsername])


function handleOpenReviewsOverview() {
  setReviewsOverviewOpen(true)
  setReviewsOverviewDragY(0)
}

function handleCloseReviewsOverview() {
  reviewsOverviewDragStartRef.current = null
  reviewsOverviewDragCurrentRef.current = 0
  setReviewsOverviewDragY(0)
  setReviewsOverviewOpen(false)
}

function handleReviewsOverviewPointerDown(event) {
  reviewsOverviewDragStartRef.current = event.clientY
  reviewsOverviewDragCurrentRef.current = 0
  setReviewsOverviewDragY(0)
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleReviewsOverviewPointerMove(event) {
  if (reviewsOverviewDragStartRef.current === null) return

  const nextY = Math.max(0, event.clientY - reviewsOverviewDragStartRef.current)
  reviewsOverviewDragCurrentRef.current = nextY
  setReviewsOverviewDragY(nextY)
}

function handleReviewsOverviewPointerEnd() {
  if (reviewsOverviewDragStartRef.current === null) return

  const shouldClose = reviewsOverviewDragCurrentRef.current > 90

  reviewsOverviewDragStartRef.current = null
  reviewsOverviewDragCurrentRef.current = 0

  if (shouldClose) {
    handleCloseReviewsOverview()
    return
  }

  setReviewsOverviewDragY(0)
}

function handleOpenReviewSheet(isRecommended = true) {
  const token = getAuthToken()

    if (
    displayAuthor.is_owner ||
    displayAuthor.viewer_owns_page
  ) return

  if (!token) {
    navigate('/login')
    return
  }

  setReviewDraftRecommended(Boolean(isRecommended))
  setReviewDraftText(myReview?.review_text || '')
  setReviewDraftError('')
  setReviewDiscardOpen(false)
  setReviewSheetOpen(true)
}

function handleCloseReviewSheet() {
  const originalText = String(myReview?.review_text || '')
  const hasDraftChanges =
    reviewDraftText !== originalText &&
    (reviewDraftText.trim().length > 0 || originalText.trim().length > 0)

  if (hasDraftChanges && !savingReview) {
    setReviewDiscardOpen(true)
    return
  }

  setReviewSheetOpen(false)
  setReviewDraftError('')
}

function handleDiscardReviewDraft() {
  setReviewDiscardOpen(false)
  setReviewSheetOpen(false)
  setReviewDraftText('')
  setReviewDraftError('')
}

async function handleSaveReview() {
  const token = getAuthToken()
  const username = author?.page_username || pageUsername
  const reviewText = reviewDraftText.trim()

  if (!token) {
    navigate('/login')
    return
  }

   if (
    !username ||
    displayAuthor.is_owner ||
    displayAuthor.viewer_owns_page ||
    savingReview
  ) return

  if (reviewText.length < 25) {
    setReviewDraftError(getDisplayText('authorPublicPage.reviewTooShort'))
    return
  }

  try {
    setSavingReview(true)
    setReviewDraftError('')
    setMessage('')

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_recommended: reviewDraftRecommended,
        review_text: reviewText,
      }),
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorPublicPage.failedSaveReview'))
    }

    await loadAuthorReviews(username)
    setReviewOptionsOpen(false)
    setSelectedReviewOption(null)
    setReviewSheetOpen(false)
    setReviewDraftText('')
    setReviewDraftError('')
    setMessage(getDisplayText('authorPublicPage.reviewRemoved'))
  } catch (error) {
    setReviewDraftError(error.message || getDisplayText('authorPublicPage.failedSaveReview'))
  } finally {
    setSavingReview(false)
  }
}




async function handleRemoveReview() {
  const token = getAuthToken()
  const username = author?.page_username || pageUsername

  if (!token) {
    navigate('/login')
    return
  }

    if (
    !username ||
    !myReview ||
    displayAuthor.viewer_owns_page ||
    savingReview
  ) return

  try {
    setSavingReview(true)
    setReviewDraftError('')
    setMessage('')

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorPublicPage.failedRemoveReview'))
    }

    await loadAuthorReviews(username)
    setReviewSheetOpen(false)
    setReviewDraftText('')
    setReviewDraftError('')
  } catch (error) {
    setReviewDraftError(error.message || getDisplayText('authorPublicPage.failedRemoveReview'))
  } finally {
    setSavingReview(false)
  }
}



  async function handleToggleFollow() {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (!author?.page_username || author.is_owner || followLoading) return

  const nextFollowing = !author.is_following
  const previousAuthor = author

  setFollowLoading(true)
  setMessage('')
  setAuthor((current) => ({
    ...current,
    is_following: nextFollowing,
    followers_count: Math.max(0, Number(current.followers_count || 0) + (nextFollowing ? 1 : -1)),
  }))

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(author.page_username)}/follow`, {
      method: nextFollowing ? 'POST' : 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorPublicPage.failedUpdateFollow'))
    }

    setAuthor((current) => ({
      ...current,
      is_following: Boolean(data.is_following ?? nextFollowing),
      followers_count: Number(data.total_followers ?? current.followers_count ?? 0),
    }))
  } catch (error) {
    setAuthor(previousAuthor)
    setMessage(error.message || getDisplayText('authorPublicPage.failedUpdateFollow'))
  } finally {
    setFollowLoading(false)
  }
}

  function handleOpenFollowSettings() {
  if (!author?.is_following || author?.is_owner) return
  setFollowSettingsOpen(true)
}

function handleSeeFirst() {
  setFollowSettingsOpen(false)
  setMessage(getDisplayText('authorPublicPage.seeFirstUnavailable'))
}

function handleMuteUpdates() {
  setFollowSettingsOpen(false)
  setMessage(getDisplayText('authorPublicPage.muteUnavailable'))
}

async function handleUnfollowFromSettings() {
  setFollowSettingsOpen(false)
  await handleToggleFollow()
}
  
function handleOpenMessage() {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

    if (
    !author?.id ||
    author?.is_owner ||
    author?.viewer_owns_page
  ) return

  setMessageRequestOpen(true)
}
  
  const actionButtons = useMemo(() => {
  if (!ownerResolved || !author) {
    return []
  }

  if (author.is_owner) {
    return [
      {
        label: t('authorPublicPage.dashboard'),
        icon: 'fa-chart-simple',
        type: 'primary',
        onClick: () =>
          navigate('/author/page/dashboard'),
      },
      {
        label: t('authorPublicPage.advertise'),
        icon: 'fa-bullhorn',
        type: 'secondary',
        onClick: () =>
          setMessage(
            getDisplayText('authorPublicPage.comingSoon', { label: t('authorPublicPage.advertise') })
          ),
      },
    ]
  }

  const followButton =
    author.is_following
      ? {
          label: t('authorPublicPage.following'),
          icon: 'fa-user-check',
          type: 'primary',
          onClick:
            handleOpenFollowSettings,
          disabled: followLoading,
        }
      : {
          label: t('authorPublicPage.follow'),
          icon: 'fa-user-plus',
          type: 'primary',
          onClick: handleToggleFollow,
          disabled: followLoading,
        }

  if (author.viewer_owns_page) {
    return [followButton]
  }

  return [
    followButton,
    {
      label: t('authorPublicPage.message'),
      icon: 'fa-comment',
      type: 'secondary',
      onClick: handleOpenMessage,
    },
  ]
}, [
  ownerResolved,
  author?.id,
  author?.is_owner,
  author?.viewer_owns_page,
  author?.is_following,
  followLoading,
  navigate,
  t,
])

  function openCropEditor(mode) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = () => {
      const file = input.files?.[0]

      if (!file) return

      if (!file.type.startsWith('image/')) {
        setMessage(getDisplayText('authorPublicPage.selectImage'))
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        setCropMode(mode)
        setRawImage(String(reader.result || ''))
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setMessage('')
        setCropModalOpen(true)
      }

      reader.readAsDataURL(file)
    }

    input.click()
  }

  async function handleSaveCrop(pixels) {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!rawImage || !pixels) {
      setMessage(getDisplayText('authorPublicPage.adjustPhoto'))
      return
    }

    try {
      setSavingImage(true)
      setMessage('')

      const croppedImage = await getCroppedImage(rawImage, pixels)
      const imageUrl = await uploadImageToStorage({
  token,
  imageDataUrl: croppedImage,
  folder: cropMode === 'avatar' ? 'author_page_avatar' : 'author_page_cover',
  fileName: `author-${cropMode}-${Date.now()}.jpg`,
})

      const updatedAuthorPage = await saveAuthorProfileImages({
        token,
        avatarUrl: cropMode === 'avatar' ? imageUrl : '',
        coverUrl: cropMode === 'cover' ? imageUrl : '',
      })

      if (updatedAuthorPage) {
        localStorage.setItem('shadow_author_page', JSON.stringify(updatedAuthorPage))
        setAuthor((current) => normalizeAuthor(updatedAuthorPage, current?.page_username || pageUsername, updatedAuthorPage, true))
      }

      setCropModalOpen(false)
      setRawImage('')
      setCroppedAreaPixels(null)
    } catch (error) {
      setMessage(error.message || getDisplayText('authorPublicPage.failedSaveImage'))
    } finally {
      setSavingImage(false)
    }
  }

  function handleUploadSlide() {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (savingSlide) return

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = () => {
    const file = input.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage(getDisplayText('authorPublicPage.selectImage'))
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      try {
        setSavingSlide(true)
        setMessage(getDisplayText('authorPublicPage.uploadingSlide'))

        const imageUrl = await uploadImageToStorage({
          token,
          imageDataUrl: String(reader.result || ''),
          folder: 'author_page_slide',
          fileName: `author-slide-${Date.now()}.jpg`,
        })

        const currentSlides = Array.isArray(author?.slide_urls) ? author.slide_urls : []
        const nextSlides = [imageUrl, ...currentSlides].filter(Boolean).slice(0, 5)

        const updatedAuthorPage = await saveAuthorProfileImages({
          token,
          slideUrls: nextSlides,
        })

        if (updatedAuthorPage) {
          localStorage.setItem('shadow_author_page', JSON.stringify(updatedAuthorPage))
          setAuthor((current) => normalizeAuthor(updatedAuthorPage, current?.page_username || pageUsername, updatedAuthorPage, true))
        }

        setMessage(getDisplayText('authorPublicPage.slideUploaded'))
      } catch (error) {
        setMessage(error.message || getDisplayText('authorPublicPage.failedUploadSlide'))
      } finally {
        setSavingSlide(false)
      }
    }

    reader.readAsDataURL(file)
  }

  input.click()
}


  function handleReaderBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  useEffect(() => {
    if (!ownerResolved || author?.is_owner) {
      setReaderHeaderSolid(false)
      setReaderHeaderTitle(false)
      setTabsFrozen(false)
      return undefined
    }

    function syncReaderHeader() {
      const coverBottom = coverRef.current?.getBoundingClientRect().bottom ?? 0
      const profileBottom = profileRef.current?.getBoundingClientRect().bottom ?? 0
      const tabsTop = tabsRef.current?.getBoundingClientRect().top ?? 999

      setReaderHeaderSolid(coverBottom <= 54)
      setReaderHeaderTitle(profileBottom <= 58)
      setTabsFrozen(tabsTop <= 55)
    }

    syncReaderHeader()
    window.addEventListener('scroll', syncReaderHeader, { passive: true })

    return () => window.removeEventListener('scroll', syncReaderHeader)
  }, [ownerResolved, author?.id, author?.is_owner])

 useEffect(() => {
  function handleTabsStickyState() {
    const tabsElement = document.getElementById('author-page-tabs')
    if (!tabsElement) return

    const rect = tabsElement.getBoundingClientRect()
    const freezeTop = !ownerResolved || author?.is_owner ? 0 : 54

    setTabsFrozen(rect.top <= freezeTop && window.scrollY > 20)
  }

  handleTabsStickyState()
  window.addEventListener('scroll', handleTabsStickyState, { passive: true })
  window.addEventListener('resize', handleTabsStickyState)

  return () => {
    window.removeEventListener('scroll', handleTabsStickyState)
    window.removeEventListener('resize', handleTabsStickyState)
  }
}, [ownerResolved, author?.is_owner])
  

if (!loading && pageError) {
  return <AuthorNotFound onBack={handleReaderBack} />
}

  const displayAuthor = author || {
    page_name: t('authorPublicPage.loading'),
    page_username: pageUsername || 'author',
    bio: '',
    avatar_url: '',
    cover_url: '',
    works_count: 0,
    followers_count: 0,
    fans_count: 0,
    likes_count: 0,
    viewer_owns_page: false,
    is_owner: false,
  }

  const authorWorks = Array.isArray(author?.works)
  ? author.works
  : Array.isArray(author?.stories)
    ? author.stories
    : Array.isArray(displayAuthor?.works)
      ? displayAuthor.works
      : []

function ReviewStarIcon({ className = 'h-[31px] w-[31px]' }) {
  return (
    <svg
      className={`${className} shrink-0 text-[var(--shadow-text-primary)]`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.95c.2 0 .37.11 .46.29l2.18 4.42c.07.15.22.26.38.28l4.88.71c.41.06.57.56.28.85l-3.53 3.44c-.12.12-.18.29-.15.46l.83 4.86c.07.41-.36.72-.73.53l-4.36-2.29c-.15-.08-.33-.08-.48 0L7.4 19.79c-.37.19-.8-.12-.73-.53l.83-4.86c.03-.17-.03-.34-.15-.46L3.82 10.5c-.29-.29-.13-.79.28-.85l4.88-.71c.16-.02.31-.13.38-.28l2.18-4.42c.09-.18.26-.29.46-.29z" />
    </svg>
  )
}

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-soft)] pb-10">

      <ReaderAuthorMessageRequestModal
        open={messageRequestOpen}
        author={displayAuthor}
        onClose={() => setMessageRequestOpen(false)}
      />

      <AuthorSocialMediaPopup
  open={socialMediaOpen}
  links={profileDetails.social_links}
  legacyValue={profileDetails.social_media}
  isOwner={displayAuthor.is_owner}
  onClose={() => setSocialMediaOpen(false)}
  onEdit={() => navigate('/author/page/edit?section=contact&modal=social')}
/>

      <CropImageModal
        open={cropModalOpen}
        image={rawImage}
        mode={cropMode}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        saving={savingImage}
        message={message}
        messageVisible={messageVisible}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onClose={() => setCropModalOpen(false)}
        onSave={handleSaveCrop}
      />

      <FollowSettingsSheet
  open={followSettingsOpen}
  author={displayAuthor}
  loading={followLoading}
  onClose={() => setFollowSettingsOpen(false)}
  onSeeFirst={handleSeeFirst}
  onMute={handleMuteUpdates}
  onUnfollow={handleUnfollowFromSettings}
/>

      <AuthorPageSwitcherSheet
        readerNotificationCount={readerNotificationCount}
  open={pageSwitcherOpen}
  author={displayAuthor}
  readerUser={readerUser}
  onClose={() => setPageSwitcherOpen(false)}
  onPage={() => setPageSwitcherOpen(false)}
  onOwnAccount={handleSwitchToReaderAccount}
  onManageAccount={() => {
    setPageSwitcherOpen(false)
    navigate('/settings')
  }}
/>

      <AuthorOwnerMenuSheet
        readerNotificationCount={readerNotificationCount}
  open={authorMenuOpen}
  author={displayAuthor}
  readerUser={readerUser}
  onClose={() => setAuthorMenuOpen(false)}
  onPage={() => setAuthorMenuOpen(false)}
  onOwnAccount={() => {
    setAuthorMenuOpen(false)
    handleSwitchToReaderAccount()
  }}
  onManageAccount={() => {
    setAuthorMenuOpen(false)
    navigate('/settings')
  }}
 onOpenFinance={() => {
  setAuthorMenuOpen(false)
  navigate('/author/page/finance')
}}
onOpenStoreSetting={() => {
  setAuthorMenuOpen(false)
  navigate('/author/page-settings')
}}
/>

      <SwitchingAccountScreen
  open={switchingToReader}
  name={readerName}
  avatarUrl={readerAvatar}
  avatarLetter={readerLetter}
/>

      <CoverOptionsSheet
  open={coverOptionsOpen}
  savingSlide={savingSlide}
  onClose={() => setCoverOptionsOpen(false)}
  onSeeCover={() => {
    setCoverOptionsOpen(false)
    if (displayAuthor.cover_url) {
      window.open(displayAuthor.cover_url, '_blank', 'noopener,noreferrer')
    } else {
      setMessage(getDisplayText('authorPublicPage.noCoverPhoto'))
    }
  }}
  onUploadCover={() => {
    setCoverOptionsOpen(false)
    openCropEditor('cover')
  }}
 onChooseCover={() => {
  setCoverOptionsOpen(false)
  handleUploadSlide()
}}
/>

      {reviewSettingsOpen ? (
  <div className="fixed inset-0 z-[290] bg-[var(--shadow-bg-surface)]">
    <header className="flex h-[52px] items-center justify-center border-b border-[var(--shadow-border)] px-4">
      <button
        type="button"
        onClick={() => setReviewSettingsOpen(false)}
        className="absolute left-3 flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-70"
        aria-label={t('authorPublicPage.closeReviews')}
      >
        <i className="fa-solid fa-xmark text-[18px]" />
      </button>

      <h1 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('authorPublicPage.reviews')}</h1>
    </header>

    <main className="px-4 pt-8">
      <h2 className="text-[17px] font-normal leading-6 text-[var(--shadow-text-primary)]">
        {t('authorPublicPage.allowReadersReviewQuestion')}
      </h2>

      <p className="mt-2 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
        {t('authorPublicPage.reviewSettingsText')}
      </p>

      <label className="mt-8 flex items-center justify-between gap-4">
        <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {t('authorPublicPage.allowReviews')}
        </span>

        <input
          type="checkbox"
          checked={allowReviewsDraft}
          onChange={(event) => setAllowReviewsDraft(event.target.checked)}
          className="h-5 w-5 accent-[#111827]"
        />
      </label>
    </main>

    <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
      <button
        type="button"
        disabled={allowReviewsDraft === allowReviewsSaved}
        onClick={() => {
          setAllowReviewsSaved(allowReviewsDraft)
          setReviewSettingsOpen(false)
          setMessage(getDisplayText('authorPublicPage.reviewSettingsSaved'))
        }}
        className="h-12 w-full rounded-[10px] bg-[#111827] text-[14px] font-medium text-white active:scale-[0.99] disabled:bg-[#e2e5ea] disabled:text-[#a5adba]"
      >
        {t('authorPublicPage.save')}
      </button>
    </div>
  </div>
) : null}

      {reviewsListOpen ? (
  <div className="fixed inset-0 z-[280] bg-[var(--shadow-bg-soft)]">
    <header className="sticky top-0 z-10 flex h-[54px] items-center border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3">
      <button
        type="button"
        onClick={() => setReviewsListOpen(false)}
        className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-70"
        aria-label={t('authorPublicPage.backToReviews')}
      >
        <i className="fa-solid fa-chevron-left text-[20px]" />
      </button>

      <h1 className="ml-2 text-[22px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.reviews')}</h1>
    </header>

    <main className="pb-8">
      <div className="flex items-center gap-2 bg-[var(--shadow-bg-surface)] px-4 py-3 text-[16px] font-bold leading-6 text-[var(--shadow-text-primary)]">
        <span>{t('authorPublicPage.recommendSummary', { percent: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.recommend_percent || 0), count: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.total_count || 0) })}</span>
        <button
          type="button"
          onClick={() => setReviewInfoOpen(true)}
          className="flex h-6 w-6 items-center justify-center text-[var(--shadow-text-secondary)] active:opacity-70"
          aria-label={t('authorPublicPage.aboutReviewScore')}
        >
          <i className="fa-solid fa-circle-info text-[15px]" />
        </button>
      </div>

      {!displayAuthor.is_owner && !displayAuthor.viewer_owns_page ? (
        <section className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-2">
          <div className="rounded-[12px] bg-[var(--shadow-bg-soft)] px-4 py-4">
            <div className="text-center text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorPublicPage.doYouRecommend', { name: displayAuthor.page_name })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOpenReviewSheet(true)}
                className="h-11 rounded-[10px] bg-[var(--shadow-bg-elevated)] text-[16px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('authorPublicPage.yes')}
              </button>

              <button
                type="button"
                onClick={() => handleOpenReviewSheet(false)}
                className="h-11 rounded-[10px] bg-[var(--shadow-bg-elevated)] text-[16px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('authorPublicPage.no')}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <div className="space-y-2 pt-2">
        {reviewItems.length ? (
          reviewItems.map((review) => {
            const reviewer = review.reviewer || review.user || review.reader || {}
            const name = review.reviewer_name || reviewer.name || review.name || t('authorPublicPage.reader')
            const avatarUrl = review.reviewer_avatar_url || reviewer.avatar_url || review.avatar_url || ''
            const text = review.review_text || review.text || ''
            const recommended = review.is_recommended !== false
            const dateText = review.created_at
              ? new Date(review.created_at).toLocaleDateString(getDisplayLanguageId(), { month: 'short', day: 'numeric' })
              : ''

            return (
              <article
                key={review.id || `${name}-${text}`}
                className="bg-[var(--shadow-bg-surface)] px-4 py-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)] text-[16px] font-bold text-[var(--shadow-text-primary)]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      String(name || 'R').slice(0, 1).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[16px] leading-6 text-[var(--shadow-text-primary)]">
                          <span className="font-bold">{name}</span>
                          <span className="ml-2 font-normal text-[var(--shadow-text-secondary)]">
                            {recommended ? t('authorPublicPage.recommends') : t('authorPublicPage.doesNotRecommend')}
                          </span>
                        </div>

                        <div className="text-[15px] font-bold leading-5 text-[var(--shadow-text-primary)]">
                          {displayAuthor.page_name}
                        </div>

                        {dateText ? (
                          <div className="mt-0.5 text-[13px] font-normal text-[var(--shadow-text-secondary)]">
                            {dateText} · <i className="fa-solid fa-earth-asia text-[12px]" />
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewOption(review)
                          setReviewOptionsOpen(true)
                        }}
                        className="flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)] active:opacity-70"
                        aria-label={t('authorPublicPage.pageOptions')}
                      >
                        <i className="fa-solid fa-ellipsis text-[16px]" />
                      </button>
                    </div>

                    {text ? (
                      <p className="mt-3 whitespace-pre-line text-[17px] font-normal leading-7 text-[var(--shadow-text-primary)]">
                        {text}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b] dark:text-white/60">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
                  >
                    <i className="fa-regular fa-heart text-[18px]" />
                    <span>{t('authorPublicPage.like')}</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
                  >
                    <i className="fa-regular fa-comment text-[18px]" />
                    <span>{t('authorPublicPage.comment')}</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] dark:active:bg-[#242836]"
                  >
                    <img
                      src="/assets/Icons/echo.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-[18px] w-[18px] object-contain opacity-75 dark:brightness-0 dark:invert"
                    />
                    <span>{t('authorPublicPage.echo')}</span>
                  </button>
                </div>
              </article>
            )
          })
        ) : (
          <div className="bg-[var(--shadow-bg-surface)] px-4 py-8 text-[14px] font-medium text-[var(--shadow-text-secondary)]">
            {t('authorPublicPage.noReviewsYet')}
          </div>
        )}
      </div>
    </main>

    {reviewInfoOpen ? (
      <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/35">
        <button
          type="button"
          aria-label={t('authorPublicPage.closeReviews')}
          onClick={() => setReviewInfoOpen(false)}
          className="absolute inset-0"
        />

        <div className="relative w-full rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-6 pt-3 shadow-2xl md:max-w-[420px] md:rounded-[18px]">
          <div className="mx-auto mb-5 h-1 w-11 rounded-full bg-[#9ca3af]" />

          <div className="text-center text-[16px] font-bold text-[var(--shadow-text-primary)]">
            {reviewSummary.recommend_percent || 0}%
          </div>

          <p className="mt-1 text-center text-[12px] font-normal text-[var(--shadow-text-secondary)]">
            {t('authorPublicPage.basedOnReaderReviews', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.total_count || 0) })}
          </p>

          <div className="mt-5 border-t border-[var(--shadow-border)] pt-4">
            <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('authorPublicPage.howReviewsWork')}</h2>
            <p className="mt-2 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {t('authorPublicPage.reviewScoreInfo')}
            </p>
          </div>
        </div>
      </div>
    ) : null}

    {reviewOptionsOpen ? (
      <div className="fixed inset-0 z-[310] flex items-end justify-center bg-black/35">
        <button
          type="button"
          aria-label={t('authorPublicPage.closeReviews')}
          onClick={() => setReviewOptionsOpen(false)}
          className="absolute inset-0"
        />

        <div className="relative w-full rounded-t-[18px] bg-[var(--shadow-bg-surface)] px-4 pb-6 pt-3 shadow-2xl md:max-w-[420px] md:rounded-[18px]">
          <div className="mx-auto mb-4 h-1 w-11 rounded-full bg-[#9ca3af]" />

          {selectedReviewOption?.is_mine ? (
            <>
              <button
                type="button"
                onClick={() => {
                  const review = selectedReviewOption
                  setReviewOptionsOpen(false)
                  handleOpenReviewSheet(review?.is_recommended !== false)
                }}
                className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[var(--shadow-text-primary)] active:opacity-70"
              >
                <i className="fa-regular fa-pen-to-square w-6 text-center text-[17px]" />
                {t('authorPublicPage.editReview')}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(t('authorPublicPage.deleteReviewConfirm'))) return
                  await handleRemoveReview()
                }}
                className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[#dc2626] active:opacity-70"
              >
                <i className="fa-regular fa-trash-can w-6 text-center text-[17px]" />
                {t('authorPublicPage.deleteReview')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                const reviewId = selectedReviewOption?.id || ''
                if (!reviewId) return

                setReviewOptionsOpen(false)
                navigate(`/report/comment/${encodeURIComponent(reviewId)}`, {
                  state: {
                    targetTitle: `${t('authorPublicPage.reviews')} · ${displayAuthor.page_name}`,
                    sourceUrl: window.location.href,
                    returnTo: `${location.pathname}${location.search}${location.hash}`,
                  },
                })
              }}
              className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[var(--shadow-text-primary)] active:opacity-70"
            >
              <i className="fa-regular fa-flag w-6 text-center text-[17px]" />
              {t('authorPublicPage.reportReview')}
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              const reviewId = selectedReviewOption?.id || ''
              const link = `${window.location.origin}${window.location.pathname}${reviewId ? `?review=${reviewId}` : ''}`

              try {
                await navigator.clipboard.writeText(link)
                setMessage(getDisplayText('authorPublicPage.reviewLinkCopied'))
              } catch {
                setMessage(link)
              }

              setReviewOptionsOpen(false)
            }}
            className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[var(--shadow-text-primary)] active:opacity-70"
          >
            <i className="fa-regular fa-copy w-6 text-center text-[17px]" />
            {t('authorPublicPage.copyReviewLink')}
          </button>

          <button
            type="button"
            onClick={() => setReviewOptionsOpen(false)}
            className="mt-2 h-11 w-full rounded-[10px] bg-[var(--shadow-bg-soft)] text-[15px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
          >
            {t('authorPublicPage.cancel')}
          </button>
        </div>
      </div>
    ) : null}
  </div>
) : null}


      {reviewsOverviewOpen ? (
  <div className="fixed inset-0 z-[250] flex items-end justify-center bg-black/45">
  <button
    type="button"
    aria-label={t('authorPublicPage.closeReviews')}
    onClick={handleCloseReviewsOverview}
    className="absolute inset-0"
  />

  <div
    className="relative max-h-[86vh] w-full overflow-y-auto rounded-t-[26px] bg-[var(--shadow-bg-soft)] px-4 pb-5 pt-0 shadow-2xl md:max-w-[520px] md:rounded-[26px]"
    style={{
      transform: `translateY(${reviewsOverviewDragY}px)`,
      transition: reviewsOverviewDragY ? 'none' : 'transform 180ms ease',
    }}
  >
    <div
      role="button"
      tabIndex={0}
      onPointerDown={handleReviewsOverviewPointerDown}
      onPointerMove={handleReviewsOverviewPointerMove}
      onPointerUp={handleReviewsOverviewPointerEnd}
      onPointerCancel={handleReviewsOverviewPointerEnd}
      className="mx-auto mb-2 flex h-10 w-24 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
    >
      <div className="h-1.5 w-14 rounded-full bg-[#9ca3af]" />
    </div>

      <section className="rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorPublicPage.reviews')}</h2>
          {displayAuthor.is_owner ? (
            <button
              type="button"
              onClick={() => {
  setAllowReviewsDraft(allowReviewsSaved)
  setReviewSettingsOpen(true)
}}
              className="text-[14px] font-medium text-[var(--shadow-text-secondary)] active:opacity-70"
            >
              {t('authorPublicPage.edit')}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <ReviewStarIcon />
          <div>
            <div className="text-[15px] font-normal leading-5 text-[var(--shadow-text-primary)]">
              {reviewLoading ? t('authorPublicPage.loading') : t('authorPublicPage.recommendedPercent', { percent: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.recommend_percent || 0) })}
            </div>
            <div className="text-[15px] font-normal leading-5 text-[var(--shadow-text-primary)]">
              {t('authorPublicPage.basedOnOpinions', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.total_count || 0) })}
            </div>
          </div>
        </div>

        {!displayAuthor.is_owner &&
!displayAuthor.viewer_owns_page ? (
          <button
            type="button"
            onClick={handleOpenMessage}
            className="mt-5 flex h-10 w-full items-center justify-center rounded-[9px] bg-[var(--shadow-bg-elevated)] text-[15px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
          >
            <i className="fa-brands fa-facebook-messenger mr-2 text-[15px]" />
            {t('authorPublicPage.messageAuthor', { name: displayAuthor.page_name })}
          </button>
        ) : null}
      </section>

      <section className="mt-4 rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
  <h3 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorPublicPage.recentReviews')}</h3>
  <button
    type="button"
    onClick={() => setReviewsListOpen(true)}
    className="text-[14px] font-medium text-[var(--shadow-text-secondary)] active:opacity-70"
  >
    {t('authorPublicPage.seeAll')}
  </button>
</div>

        {!displayAuthor.is_owner &&
!displayAuthor.viewer_owns_page ? (
          <div className="mb-4 rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3">
            <div className="text-[16px] font-normal leading-6 text-[var(--shadow-text-primary)]">
              {t('authorPublicPage.doYouRecommend', { name: displayAuthor.page_name })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOpenReviewSheet(true)}
                className="h-9 rounded-[9px] bg-[var(--shadow-bg-elevated)] text-[15px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('authorPublicPage.yes')}
              </button>

              <button
                type="button"
                onClick={() => handleOpenReviewSheet(false)}
                className="h-9 rounded-[9px] bg-[var(--shadow-bg-elevated)] text-[15px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('authorPublicPage.no')}
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {reviewItems.length ? (
            reviewItems.slice(0, 2).map((review) => {
              const reviewer = review.reviewer || review.user || review.reader || {}
              const name = review.reviewer_name || reviewer.name || review.name || t('authorPublicPage.reader')
              const avatarUrl = review.reviewer_avatar_url || reviewer.avatar_url || review.avatar_url || ''
              const text = review.review_text || review.text || ''
              const recommended = review.is_recommended !== false

              return (
                <div key={review.id || `${name}-${text}`} className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)] text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      String(name || 'R').slice(0, 1).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] leading-5 text-[var(--shadow-text-primary)]">
                      <span className="font-medium">{name}</span>{' '}
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] align-middle text-white">
                        <i className="fa-solid fa-star text-[9px]" />
                      </span>{' '}
                      <span className="font-normal text-[var(--shadow-text-primary)]">
                        {recommended ? t('authorPublicPage.recommends') : t('authorPublicPage.doesNotRecommend')}
                      </span>
                    </div>

                    {text ? (
                      <p className="line-clamp-2 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                        {text}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-3 text-[14px] font-medium text-[var(--shadow-text-secondary)]">
              {t('authorPublicPage.noReviewsYet')}
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
) : null}

{reviewSheetOpen ? (
  <div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/55 px-8">
    <button
      type="button"
      aria-label={t('authorPublicPage.closeReviews')}
      onClick={handleCloseReviewSheet}
      className="absolute inset-0"
    />

    <div className="relative w-full max-w-[500px] rounded-[14px] bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-7 shadow-2xl">
      <h2 className="mx-auto max-w-[380px] text-center text-[18px] font-normal leading-6 text-[var(--shadow-text-primary)]">
        {t('authorPublicPage.reviewPrompt', { name: displayAuthor.page_name })}
      </h2>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-[9px] bg-[var(--shadow-bg-elevated)] px-4 py-2 text-[14px] font-medium text-[var(--shadow-text-primary)]">
          <i className="fa-solid fa-globe text-[12px]" />
          {t('authorPublicPage.public')}
          <i className="fa-solid fa-caret-down text-[11px]" />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-bold text-white">
          {readerAvatar ? (
            <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
          ) : (
            readerLetter
          )}
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            value={reviewDraftText}
            onChange={(event) => {
              setReviewDraftText(event.target.value)
              if (reviewDraftError) setReviewDraftError('')
            }}
            placeholder={t('authorPublicPage.reviewPlaceholder')}
            className="h-[390px] w-full resize-none rounded-[14px] border border-[#cfd4dc] bg-[var(--shadow-bg-surface)] px-3 py-3 text-[20px] font-normal leading-7 text-[var(--shadow-text-primary)] outline-none focus:border-[#2563eb]"
          />

          <div className="mt-2 text-[13px] font-normal">
            <span className={reviewDraftText.trim().length < 25 ? 'text-[#e5484d]' : 'text-[var(--shadow-text-secondary)]'}>
              {t('authorPublicPage.reviewMinimum', { count: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewDraftText.trim().length) })}
            </span>
          </div>

          {reviewDraftError ? (
            <div className="mt-2 text-[13px] font-medium text-[#e5484d]">
              {reviewDraftError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={savingReview || reviewDraftText.trim().length < 25}
          onClick={handleSaveReview}
          className="h-12 rounded-[10px] bg-[#111827] text-[17px] font-medium text-white active:scale-[0.99] disabled:bg-[#e2e5ea] disabled:text-[#a5adba]"
        >
          {savingReview ? t('authorPublicPage.sharing') : t('authorPublicPage.share')}
        </button>

        <button
          type="button"
          onClick={handleCloseReviewSheet}
          className="h-12 rounded-[10px] bg-[var(--shadow-bg-elevated)] text-[17px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
        >
          {t('authorPublicPage.cancel')}
        </button>
      </div>

      {reviewDiscardOpen ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[14px] bg-black/45 px-8">
          <div className="w-full rounded-[8px] bg-[var(--shadow-bg-surface)] px-6 py-5 shadow-2xl">
            <h3 className="text-[17px] font-normal text-[var(--shadow-text-primary)]">{t('authorPublicPage.discardReview')}</h3>
            <p className="mt-3 text-[18px] font-normal leading-7 text-[var(--shadow-text-secondary)]">
              {t('authorPublicPage.discardReviewText')}
            </p>

            <div className="mt-6 flex justify-end gap-6">
              <button
                type="button"
                onClick={handleDiscardReviewDraft}
                className="text-[16px] font-normal text-[var(--shadow-text-secondary)] active:opacity-70"
              >
                {t('authorPublicPage.discard')}
              </button>

              <button
                type="button"
                onClick={() => setReviewDiscardOpen(false)}
                className="text-[16px] font-normal text-[#2563eb] active:opacity-70"
              >
                {t('authorPublicPage.keepWriting')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
) : null}



      {ownerResolved && !displayAuthor.is_owner ? (
 <header className={`fixed left-0 right-0 top-0 z-[120] transition ${
  readerHeaderSolid ? 'bg-[var(--shadow-bg-surface)] shadow-sm' : 'bg-transparent'
}`}>
  <div className="mx-auto flex h-[54px] max-w-[980px] items-center justify-between px-3">
   <button
  type="button"
  onClick={handleReaderBack}
  className={`flex h-10 w-10 items-center justify-center rounded-full ${
    readerHeaderSolid ? 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
  }`}
  aria-label={t('authorPublicPage.back')}
>
  <i className="fa-solid fa-chevron-left text-[15px]" />
</button>
    <div className={`min-w-0 flex-1 px-3 text-center text-[15px] font-semibold text-[var(--shadow-text-primary)] transition ${
      readerHeaderTitle ? 'opacity-100' : 'opacity-0'
    }`}>
      <span className="line-clamp-1">{displayAuthor.page_name}</span>
    </div>
<div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() => navigate('/author/cart', { state: { from: location.pathname + location.search + location.hash } })}
    className={`flex h-10 w-10 items-center justify-center rounded-full ${
      readerHeaderSolid ? 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
    }`}
    aria-label={t('authorPublicPage.openCart')}
  >
    <span className="relative flex h-10 w-10 items-center justify-center">
  <i className="fa-solid fa-cart-shopping text-[15px]" />
  {readerCartCount > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-none text-white">
      {readerCartCount > 99 ? '99+' : readerCartCount}
    </span>
  ) : null}
</span>
  </button>

 <button
  type="button"
  onClick={() => navigate(`/author/page/${displayAuthor?.page_username || pageUsername}/options`)}
  className={`flex h-10 w-10 items-center justify-center rounded-full ${
    readerHeaderSolid ? 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
  }`}
  aria-label={t('authorPublicPage.authorPageOptions')}
>
  <i className="fa-solid fa-ellipsis text-[17px]" />
</button>
        </div>
  </div>
</header>
) : null}
      
      <main className="mx-auto max-w-[980px]">
        {message && !cropModalOpen ? (
          <div
            className={`pointer-events-none fixed left-1/2 top-5 z-[400] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 transition-all duration-300 ${
              messageVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            <div className="rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] font-medium leading-5 text-[var(--shadow-text-primary)] shadow-[0_8px_30px_rgba(15,23,42,0.18)] ring-1 ring-[var(--shadow-border)]">
              {message}
            </div>
          </div>
        ) : null}

        <section className="overflow-hidden bg-[var(--shadow-bg-surface)]">
          <div
  role="button"
  tabIndex={0}
  onClick={() => {
    if (displayAuthor.is_owner) setCoverOptionsOpen(true)
  }}
  onKeyDown={(event) => {
    if (displayAuthor.is_owner && (event.key === 'Enter' || event.key === ' ')) {
      setCoverOptionsOpen(true)
    }
  }}
  ref={coverRef}
className="relative h-[210px] cursor-pointer bg-[#111827] sm:h-[280px]"
>
  {displayAuthor.cover_url ? (
    <img
      src={displayAuthor.cover_url}
      alt={displayAuthor.page_name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
  )}
   <div className="absolute inset-0 bg-black/15" />     

    {displayAuthor.is_owner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setAuthorMenuOpen(true)
    }}
    className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] active:scale-95"
    aria-label={t('authorPublicPage.authorMenu')}
  >
    <i className="fa-solid fa-bars text-[18px]" />
  </button>
) : null}        

   {displayAuthor.is_owner ? (
  <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        navigate('/author/page/edit?section=cover')
      }}
      className="flex h-9 w-9 items-center justify-center text-white drop-shadow active:scale-95"
      aria-label={t('authorPublicPage.editPage')}
    >
      <i className="fa-solid fa-pen text-[14px]" />
    </button>

    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        navigate('/author/page-options')
      }}
      className="flex h-9 w-9 items-center justify-center text-white drop-shadow active:scale-95"
      aria-label={t('authorPublicPage.pageOptions')}
    >
      <i className="fa-solid fa-ellipsis text-[16px]" />
    </button>
  </div>
) : null}
            
  {displayAuthor.is_owner ? (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        setCoverOptionsOpen(true)
      }}
      className="absolute bottom-5 right-3 flex h-11 w-11 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] active:scale-95"
    >
      <i className="fa-solid fa-camera text-[22px]" />
    </button>
  ) : null}
</div>

          <div ref={profileRef} className="relative px-4 pb-5 sm:px-6">
            <div className="pointer-events-none absolute -top-[14px] left-0 right-0 h-[36px] rounded-t-[16px] bg-[var(--shadow-bg-surface)]" />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="relative -mt-[42px] h-[92px] w-[92px] shrink-0 rounded-full border-[3px] border-white bg-[var(--shadow-bg-soft)] shadow-sm sm:-mt-[52px] sm:h-[112px] sm:w-[112px]">
                  {displayAuthor.avatar_url ? (
                    <img
                      src={displayAuthor.avatar_url}
                      alt={displayAuthor.page_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[42px] font-black text-[var(--shadow-text-tertiary)]">
                      {displayAuthor.page_name.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  {displayAuthor.is_owner ? (
                    <button
                      type="button"
                      onClick={() => openCropEditor('avatar')}
                      className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-sm active:scale-95 sm:h-8 sm:w-8"
                    >
                      <i className="fa-solid fa-camera text-[11px]" />
                    </button>
                  ) : null}
                </div>

               <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {loading ? (
                        <div className="h-8 w-52 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                      ) : (
                        <h1 className="line-clamp-1 text-[18px] font-bold leading-tight tracking-tight text-[var(--shadow-text-primary)] sm:text-[22px]">
                          {displayAuthor.page_name}
                        </h1>
                      )}

                      
                    </div>

                   {displayAuthor.is_owner ? (
  <button
    type="button"
    onClick={() => setPageSwitcherOpen(true)}
    className="relative mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] transition active:scale-95"
    aria-label={t('authorPublicPage.switchReaderAccount')}
  >
    <i className="fa-solid fa-chevron-down text-[12px]" />
    {readerNotificationCount > 0 ? (
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white" />
    ) : null}
  </button>
) : null}
                  </div>

                  <div className="-mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[var(--shadow-text-primary)] sm:text-[12px]">
                    <span>
                      <strong>{formatCompactNumber(displayAuthor.works_count)}</strong>{' '}
                      <span className="text-[var(--shadow-text-secondary)]">{t('authorPublicPage.works')}</span>
                    </span>
                   <button
  type="button"
  onClick={() => {
    if (displayAuthor.page_username) {
      navigate(`/author/page/${displayAuthor.page_username}/followers`)
    }
  }}
  className="-mx-1 rounded-md px-1.5 py-1 text-left cursor-pointer active:bg-[var(--shadow-bg-soft)] active:opacity-70"
>
  <strong>{formatCompactNumber(displayAuthor.followers_count || displayAuthor.fans_count)}</strong>{' '}
  <span className="text-[var(--shadow-text-secondary)]">{t('authorPublicPage.followers')}</span>
</button>
                    <span>
                      <strong>{formatCompactNumber(authorPostsCount)}</strong>{' '}
                      <span className="text-[var(--shadow-text-secondary)]">{t('authorPublicPage.posts')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mt-4 h-4 w-full max-w-[420px] animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              ) : displayAuthor.bio ? (
                <p className="mt-4 line-clamp-2 max-w-[620px] text-[13px] font-medium leading-6 text-[var(--shadow-text-secondary)] sm:text-[14px]">
                  {displayAuthor.bio}
                </p>
              ) : null}

    {ownerResolved ? (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          {actionButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              onClick={button.onClick}
              disabled={button.disabled}
              className={`h-10 flex-1 rounded-[12px] text-[13px] font-normal transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                button.type === 'primary'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
              }`}
            >
              <i className={`fa-solid ${button.icon} mr-2 text-[12px]`} />
              {button.disabled ? t('authorPublicPage.loading') : button.label}
            </button>
          ))}
        </div>

        {displayAuthor.is_owner ? (
          <button
            type="button"
            onClick={() => navigate('/author/page/story/create')}
            className="flex h-10 w-full items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
          >
            <img
              src="/assets/Icons/Add Story.svg"
              alt=""
              className="mr-2 h-4 w-4 object-contain"
            />
            {t('authorPublicPage.addToStory')}
          </button>
        ) : null}
      </div>
    ) : null}
            </div>
          </div>

        </section>

       <section
  id="author-page-tabs"
  ref={tabsRef}
  className={`sticky z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] ${
    !ownerResolved || displayAuthor.is_owner ? 'top-0' : 'top-[54px]'
  } ${tabsFrozen ? 'shadow-sm' : ''}`}
>
  <div className="mx-auto h-[50px] max-w-[980px] px-4">
  <div className="flex h-full items-center justify-start gap-2">
    {tabs.map((tab) => {
      const active = activeTab === tab

      return (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-[13px] font-medium leading-none transition-colors ${
            active
              ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
              : 'bg-transparent text-[var(--shadow-text-tertiary)]'
          }`}
        >
          {tab}
        </button>
      )
    })}
   </div>
</div>
</section>

        <section className="min-h-[calc(100vh-50px)] bg-[var(--shadow-bg-surface)] px-4 pb-24 pt-4 sm:px-6">
         {activeTab === 'Posts' ? (
  <div className="space-y-5 pb-4">
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPublicPage.details')}</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=details')} className="flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

     <div className="space-y-4 text-[14px] font-normal text-[var(--shadow-text-primary)]">
  <button
    type="button"
    onClick={handleOpenReviewsOverview}
    className="flex w-full items-center gap-4 text-left active:opacity-70"
  >
    <ReviewStarIcon className="h-[31px] w-[31px]" />
    <span>
      {reviewLoading
        ? t('authorPublicPage.loadingReviews')
        : t('authorPublicPage.recommendSummary', { percent: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.recommend_percent || 0), count: new Intl.NumberFormat(getDisplayLanguageId()).format(reviewSummary.total_count || 0) })}
    </span>
  </button>

  <div className="flex items-center gap-4">
    <svg
      className="h-[26px] w-8 shrink-0 text-[var(--shadow-text-primary)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.8 4.5h8.7c1.25 0 2.25 1 2.25 2.25v12.75H7.2c-1.05 0-1.9-.85-1.9-1.9V5c0-.28.22-.5.5-.5z" />
      <path d="M7.2 19.5c-1.05 0-1.9-.85-1.9-1.9s.85-1.9 1.9-1.9h9.55" />
      <path d="M8.3 7.25h5.65" />
      <path d="M8.3 10.15h4.4" />
    </svg>
    <span>{profileDetails.price_range ? `${t('authorPublicPage.book')} · ${profileDetails.price_range}` : t('authorPublicPage.book')}</span>
  </div>

  {profileDetails.address ? (
    <div className="flex items-start gap-4">
      <span className="flex w-8 shrink-0 items-center justify-center pt-0.5 text-[var(--shadow-text-primary)]" aria-hidden="true">
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21s6-5.35 6-11a6 6 0 0 0-12 0c0 5.65 6 11 6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
</span>
      <span className="whitespace-pre-wrap break-words leading-5">
        {profileDetails.address}
      </span>
    </div>
  ) : null}

  {getCompactHoursText(profileDetails) ? (
  <div className="flex items-center gap-4">
    <span className="flex w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
      <i className="fa-regular fa-clock text-[16px]" />
    </span>
    <span className="line-clamp-1 break-words leading-5">
      {getCompactHoursText(profileDetails)}
    </span>
  </div>
) : null}
</div>
    </section>

   

    {profileDetails.website_url ? (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPublicPage.links')}</h2>
      {displayAuthor.is_owner ? (
        <button type="button" onClick={() => navigate('/author/page/edit?section=links')} className="flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95">
          <i className="fa-solid fa-pen text-[14px]" />
        </button>
      ) : null}
    </div>

    <a
      href={
        String(profileDetails.website_url).startsWith('http://') ||
        String(profileDetails.website_url).startsWith('https://')
          ? profileDetails.website_url
          : `https://${profileDetails.website_url}`
      }
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center gap-4 text-left text-[14px] font-normal text-[var(--shadow-text-primary)] active:opacity-70"
    >
      <span className="flex w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
  <i className="fa-solid fa-link text-[13px]" />
</span>

      <span>{profileDetails.website_label || t('authorPublicPage.website')}</span>
    </a>
  </section>
) : null}
    
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPublicPage.facebookPage')}</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=facebook')} className="flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          const value = String(profileDetails.facebook_page_url || '').trim()

          if (!value) {
            if (displayAuthor.is_owner) navigate('/author/page/edit?section=facebook')
            else setMessage(getDisplayText('authorPublicPage.facebookComingSoon'))
            return
          }

          const url = /^https?:\/\//i.test(value) ? value : `https://${value}`
          window.open(url, '_blank', 'noopener,noreferrer')
        }}
        className="flex w-full items-center gap-4 text-left active:scale-[0.99]"
      >
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {(profileDetails.facebook_page_image_url || displayAuthor.avatar_url) ? (
            <img
              src={profileDetails.facebook_page_image_url || displayAuthor.avatar_url}
              alt={profileDetails.facebook_page_name || displayAuthor.page_name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[14px] font-normal text-[var(--shadow-text-primary)]">
            {profileDetails.facebook_page_name || displayAuthor.page_name}
          </div>
          <div className="mt-0.5 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
            {t('authorPublicPage.facebookPage')}
          </div>
        </div>
      </button>
    </section>

    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPublicPage.contactInfo')}</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=contact')} className="flex h-8 w-8 items-center justify-center text-[var(--shadow-text-secondary)] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

      <div className="space-y-4 text-[14px] font-normal text-[var(--shadow-text-primary)]">
  {socialPreview ? (
  <button type="button" onClick={() => setSocialMediaOpen(true)} className="flex w-full items-center gap-4 text-left">
    <i className="fa-solid fa-at w-8 text-center text-[18px]" />
    <span>{socialPreview}</span>
  </button>
) : null}

  {profileDetails.phone ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[var(--shadow-text-primary)]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M7.2 4.6l2.25-.55c.45-.11.92.11 1.11.53l1.02 2.26c.17.38.08.82-.22 1.11L10.05 9.2c.86 1.86 2.38 3.38 4.24 4.24l1.25-1.31c.29-.3.73-.39 1.11-.22l2.26 1.02c.42.19.64.66.53 1.11l-.55 2.25c-.12.5-.57.86-1.08.86C11.72 17.15 6.35 11.78 6.35 5.69c0-.51.35-.96.85-1.09z" />
</svg>
      <span>{profileDetails.phone}</span>
    </div>
  ) : null}

  {profileDetails.email ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[var(--shadow-text-primary)]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M4.8 6.7h14.4c.55 0 1 .45 1 1v9.1c0 .55-.45 1-1 1H4.8c-.55 0-1-.45-1-1V7.7c0-.55.45-1 1-1z" />
  <path d="M4.2 7.3l7.8 6.1 7.8-6.1" />
</svg>
      <span>{profileDetails.email}</span>
    </div>
  ) : null}

  

  {profileDetails.telegram ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[var(--shadow-text-primary)]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M20.2 4.8L4.6 10.85c-.58.22-.56 1.05.03 1.24l4.15 1.31 1.6 4.92c.19.58.96.69 1.31.19l2.29-3.25 4.2 3.08c.52.38 1.26.08 1.37-.55l2.1-11.85c.12-.69-.78-1.39-1.45-1.14z" />
  <path d="M8.95 13.35l6.95-4.55" />
  <path d="M10.38 18.15l.22-4.22 8.95-8.33" />
</svg>
      <span>{profileDetails.telegram}</span>
    </div>
  ) : null}
</div>
    </section>

    <AuthorPostsSection
      author={displayAuthor}
      onCountChange={setAuthorPostsCount}
      onMessage={setMessage}
    />
  </div>
) : null}

          {activeTab === 'Works' ? (
            authorWorks.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {authorWorks.map((work) => (
                  <AuthorWorkCard
                    key={work.id}
                    work={work}
                    onOpen={() => navigate(`/story/${work.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyPanel
                title={t('authorPublicPage.noWorksYet')}
                text={t('authorPublicPage.noWorksText')}
              />
            )
          ) : null}

        {activeTab === 'Store' ? (
  <AuthorStoreTab
  author={displayAuthor}
  cartCount={readerCartCount}
  onCartCountChange={setReaderCartCount}
  onMessage={setMessage}
/>
) : null}
          
        </section>
      </main>
      {ownerResolved && displayAuthor.is_owner ? (
        <AuthorPageFooter active="Page" onComingSoon={handleAuthorFooterComingSoon} />
      ) : null}
    </div>
  )
}
