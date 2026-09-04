import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageEmptyState,
  PageHeader,
  PageLoadingState,
  PageShell,
  SurfaceCard,
} from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

const translations = {
  en: {
    title: 'Spin',
    back: 'Go back',
    normal: 'Normal Spin',
    shadow: 'Shadow Spin',
    wheelName: 'Wheel name',
    wheelNamePlaceholder: 'My lucky wheel',
    saved: 'Saved',
    save: 'Save',
    saving: 'Saving...',
    savedWheels: 'Saved wheels',
    history: 'History',
    download: 'Download',
    downloadResult: 'Download result',
    noResultDownload: 'Spin once before downloading a result.',
    fairTitle: 'Fair random',
    fairBody: '{{count}} entries • equal chance {{chance}} each',
    noRepeat: 'No repeat',
    noRepeatHelp: 'A winner will be skipped until the round resets.',
    resetRound: 'Reset round',
    background: 'Wheel background',
    backgroundHelp: 'JPG, PNG or WebP • max 2 MB • replacing deletes the old R2 image.',
    uploadBackground: 'Add background',
    replaceBackground: 'Replace background',
    removeBackground: 'Remove',
    spinNow: 'SPIN',
    spinning: 'Spinning...',
    needTwoEntries: 'Add at least 2 entries to spin.',
    addEntries: 'Add entries',
    entriesCount: '{{count}} / 50',
    manual: 'Manual',
    reader: 'Reader',
    author: 'Author',
    book: 'Book',
    manualHelp: 'Add a name without a profile image.',
    manualPlaceholder: 'Enter a name',
    add: 'Add',
    searchReader: 'Search readers',
    searchAuthor: 'Search authors',
    searchBook: 'Search books',
    searchPlaceholder: 'Type at least 2 characters...',
    searchHint: 'Search starts after 2 characters • max 20 results.',
    searching: 'Searching...',
    searchFailed: 'Search failed. Try again.',
    noSearchResults: 'No matching results.',
    added: 'Added',
    entryExists: 'This Shadow item is already in the wheel.',
    entryLimit: 'The wheel can contain up to 50 entries.',
    entryAdded: 'Added to the wheel.',
    removeEntry: 'Remove entry',
    entries: 'Entries',
    emptyEntriesTitle: 'Build your wheel',
    emptyEntriesBody: 'Use Manual, Reader, Author or Book to add entries.',
    prizePool: 'Prize pool',
    prizeOptional: 'Optional',
    prizeHelp: 'Shadow Spin can choose one prize fairly from the enabled prize pool.',
    diamond: 'Diamond',
    coin: 'Coin',
    voucher: 'Voucher',
    amount: 'Amount',
    customGifts: 'Custom gifts',
    customCount: '{{count}} / 10',
    customHelp: 'Add gifts one at a time. Each gift needs a name and image.',
    newGift: 'New gift',
    editGift: 'Edit gift',
    giftName: 'Gift name',
    giftNamePlaceholder: 'Example: Special book',
    giftImage: 'Gift image',
    chooseImage: 'Choose image',
    changeImage: 'Change image',
    saveGift: 'Save gift',
    updateGift: 'Update gift',
    cancel: 'Cancel',
    giftLimit: 'You can add up to 10 custom gifts.',
    imageTooLarge: 'Image must be 2 MB or smaller.',
    imageType: 'Use JPG, PNG or WebP.',
    giftNeedsImage: 'Choose an image for this gift.',
    uploadFailed: 'Image upload failed.',
    deleting: 'Deleting...',
    winner: 'Winner',
    prize: 'Prize',
    noPrize: 'No prize',
    keep: 'Keep',
    removeWinner: 'Remove winner',
    spinAgain: 'Spin again',
    resultSaved: 'Result saved to history.',
    resultNotSaved: 'The spin worked, but history could not be saved.',
    saveLogin: 'Sign in to save wheels, history and R2 images.',
    savedSuccess: 'Wheel saved.',
    saveFailed: 'Could not save the wheel.',
    saveNeedsEntries: 'Add at least 2 entries before saving.',
    savedLimit: 'You can save up to 10 wheels.',
    load: 'Load',
    delete: 'Delete',
    current: 'Current',
    savedEmpty: 'No saved wheels yet.',
    savedLimitHelp: 'Up to 10 saved wheels per account.',
    historyEmpty: 'No spin results yet.',
    historyHelp: 'Keeps the latest 50 results for up to 30 days.',
    clearHistory: 'Clear history',
    clearHistoryConfirm: 'Clear all spin history?',
    deleteWheelConfirm: 'Delete this saved wheel?',
    deleteGiftConfirm: 'Delete this custom gift and its R2 image?',
    deleteBackgroundConfirm: 'Delete this background image?',
    deleteFailed: 'Delete failed.',
    close: 'Close',
    newWheel: 'New wheel',
    loadedWheel: 'Saved wheel loaded.',
    downloadReady: 'Result image downloaded.',
    shadowPrizeEmpty: 'No prize selected',
    builtInPrizeNote: 'These are prize labels for the spin result. They do not automatically change wallet balances.',
    recentWinners: 'Recent winners',
    viewAll: 'View all',
    selected: 'Selected',
    sourceReader: 'Reader',
    sourceAuthor: 'Author',
    sourceBook: 'Book',
    sourceManual: 'Manual',
    loadingSaved: 'Loading saved wheels...',
    loadingHistory: 'Loading history...',
    backgroundUploaded: 'Background updated.',
    backgroundRemoved: 'Background removed.',
    giftSaved: 'Gift saved.',
    giftRemoved: 'Gift removed.',
    signIn: 'Sign in',
    wheelReady: 'Ready to spin',
    playfulHint: 'Pick names, readers, authors or books and let Shadow choose.',
    activePrizeCount: '{{count}} prizes active',
    entriesSection: 'Your wheel',
    removeBlocked: 'This winner is already excluded for the current No Repeat round.',
    unexpected: 'Something went wrong.',
  },
  km: {
    title: 'បង្វិល',
    back: 'ត្រឡប់ក្រោយ',
    normal: 'បង្វិលធម្មតា',
    shadow: 'Shadow Spin',
    wheelName: 'ឈ្មោះកង់',
    wheelNamePlaceholder: 'កង់សំណាងរបស់ខ្ញុំ',
    saved: 'បានរក្សាទុក',
    save: 'រក្សាទុក',
    saving: 'កំពុងរក្សាទុក...',
    savedWheels: 'កង់ដែលបានរក្សាទុក',
    history: 'ប្រវត្តិ',
    download: 'ទាញយក',
    downloadResult: 'ទាញយកលទ្ធផល',
    noResultDownload: 'បង្វិលយ៉ាងហោចណាស់ម្តងសិន មុនទាញយកលទ្ធផល។',
    fairTitle: 'Random ស្មើគ្នា',
    fairBody: '{{count}} នាក់ • ឱកាសស្មើ {{chance}} ម្នាក់',
    noRepeat: 'មិនឲ្យឈ្នះដដែល',
    noRepeatHelp: 'អ្នកឈ្នះនឹងត្រូវរំលងរហូតដល់ Reset ជុំថ្មី។',
    resetRound: 'Reset ជុំ',
    background: 'ផ្ទៃខាងក្រោយកង់',
    backgroundHelp: 'JPG, PNG ឬ WebP • អតិបរមា 2 MB • Replace នឹងលុបរូបចាស់ពី R2។',
    uploadBackground: 'ដាក់ Background',
    replaceBackground: 'ប្តូរ Background',
    removeBackground: 'លុប',
    spinNow: 'បង្វិល',
    spinning: 'កំពុងបង្វិល...',
    needTwoEntries: 'ដាក់អ្នកចូលរួមយ៉ាងហោចណាស់ 2 ទើបអាចបង្វិលបាន។',
    addEntries: 'បន្ថែមអ្នកចូលរួម',
    entriesCount: '{{count}} / 50',
    manual: 'ឈ្មោះធម្មតា',
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    book: 'សៀវភៅ',
    manualHelp: 'ដាក់ឈ្មោះដោយដៃ មិនចាំបាច់មានរូប Profile។',
    manualPlaceholder: 'បញ្ចូលឈ្មោះ',
    add: 'បន្ថែម',
    searchReader: 'ស្វែងរកអ្នកអាន',
    searchAuthor: 'ស្វែងរកអ្នកនិពន្ធ',
    searchBook: 'ស្វែងរកសៀវភៅ',
    searchPlaceholder: 'វាយយ៉ាងតិច 2 តួអក្សរ...',
    searchHint: 'ចាប់ផ្តើម Search ក្រោយ 2 តួអក្សរ • បង្ហាញអតិបរមា 20។',
    searching: 'កំពុងស្វែងរក...',
    searchFailed: 'Search មានបញ្ហា។ សាកម្តងទៀត។',
    noSearchResults: 'រកមិនឃើញលទ្ធផល។',
    added: 'បានបន្ថែម',
    entryExists: 'របស់ Shadow នេះមានក្នុងកង់រួចហើយ។',
    entryLimit: 'កង់អាចមានអ្នកចូលរួមអតិបរមា 50។',
    entryAdded: 'បានបន្ថែមចូលកង់។',
    removeEntry: 'ដកចេញពីកង់',
    entries: 'អ្នកចូលរួម',
    emptyEntriesTitle: 'បង្កើតកង់របស់អ្នក',
    emptyEntriesBody: 'ប្រើ ឈ្មោះធម្មតា អ្នកអាន អ្នកនិពន្ធ ឬសៀវភៅ ដើម្បីបន្ថែម។',
    prizePool: 'កន្លែងរង្វាន់',
    prizeOptional: 'មិនបង្ខំ',
    prizeHelp: 'Shadow Spin អាច Random រង្វាន់មួយស្មើៗគ្នាពីរង្វាន់ដែលអ្នកបានបើក។',
    diamond: 'ពេជ្រ',
    coin: 'កាក់',
    voucher: 'Voucher',
    amount: 'ចំនួន',
    customGifts: 'រង្វាន់ផ្ទាល់ខ្លួន',
    customCount: '{{count}} / 10',
    customHelp: 'បន្ថែមម្តងមួយ។ រង្វាន់មួយត្រូវមានឈ្មោះ និងរូបភាព។',
    newGift: 'រង្វាន់ថ្មី',
    editGift: 'កែរង្វាន់',
    giftName: 'ឈ្មោះរង្វាន់',
    giftNamePlaceholder: 'ឧ. សៀវភៅពិសេស',
    giftImage: 'រូបរង្វាន់',
    chooseImage: 'ជ្រើសរូប',
    changeImage: 'ប្តូររូប',
    saveGift: 'រក្សារង្វាន់',
    updateGift: 'កែប្រែរង្វាន់',
    cancel: 'បោះបង់',
    giftLimit: 'អាចដាក់ Custom Gift អតិបរមា 10។',
    imageTooLarge: 'រូបភាពត្រូវតែ 2 MB ឬតូចជាងនេះ។',
    imageType: 'ប្រើតែ JPG, PNG ឬ WebP។',
    giftNeedsImage: 'សូមជ្រើសរូបសម្រាប់រង្វាន់នេះ។',
    uploadFailed: 'Upload រូបភាពមិនបាន។',
    deleting: 'កំពុងលុប...',
    winner: 'អ្នកឈ្នះ',
    prize: 'រង្វាន់',
    noPrize: 'គ្មានរង្វាន់',
    keep: 'រក្សាទុក',
    removeWinner: 'ដកអ្នកឈ្នះចេញ',
    spinAgain: 'បង្វិលម្ដងទៀត',
    resultSaved: 'បានរក្សាលទ្ធផលក្នុងប្រវត្តិ។',
    resultNotSaved: 'បង្វិលបាន ប៉ុន្តែមិនអាចរក្សាប្រវត្តិបាន។',
    saveLogin: 'ត្រូវ Login ដើម្បី Save កង់ ប្រវត្តិ និងរូប R2។',
    savedSuccess: 'បានរក្សាទុកកង់។',
    saveFailed: 'មិនអាចរក្សាទុកកង់បាន។',
    saveNeedsEntries: 'ដាក់អ្នកចូលរួមយ៉ាងហោចណាស់ 2 មុន Save។',
    savedLimit: 'អាចរក្សាទុកកង់អតិបរមា 10។',
    load: 'បើក',
    delete: 'លុប',
    current: 'កំពុងប្រើ',
    savedEmpty: 'មិនទាន់មានកង់ដែលបាន Save។',
    savedLimitHelp: 'Account មួយ Save កង់បានអតិបរមា 10។',
    historyEmpty: 'មិនទាន់មានលទ្ធផល Spin។',
    historyHelp: 'រក្សា 50 លទ្ធផលចុងក្រោយ និងអតិបរមា 30 ថ្ងៃ។',
    clearHistory: 'លុបប្រវត្តិទាំងអស់',
    clearHistoryConfirm: 'ចង់លុបប្រវត្តិ Spin ទាំងអស់មែនទេ?',
    deleteWheelConfirm: 'ចង់លុបកង់ដែលបាន Save នេះមែនទេ?',
    deleteGiftConfirm: 'ចង់លុប Custom Gift និងរូប R2 របស់វាមែនទេ?',
    deleteBackgroundConfirm: 'ចង់លុប Background នេះមែនទេ?',
    deleteFailed: 'លុបមិនបាន។',
    close: 'បិទ',
    newWheel: 'កង់ថ្មី',
    loadedWheel: 'បានបើកកង់ដែល Save រួច។',
    downloadReady: 'បានទាញយករូបលទ្ធផល។',
    shadowPrizeEmpty: 'មិនបានជ្រើសរង្វាន់',
    builtInPrizeNote: 'ពេជ្រ កាក់ និង Voucher នៅទីនេះជាស្លាករង្វាន់សម្រាប់លទ្ធផល Spin ប៉ុណ្ណោះ មិនបូក Wallet ដោយស្វ័យប្រវត្តិទេ។',
    recentWinners: 'អ្នកឈ្នះថ្មីៗ',
    viewAll: 'មើលទាំងអស់',
    selected: 'បានជ្រើស',
    sourceReader: 'អ្នកអាន',
    sourceAuthor: 'អ្នកនិពន្ធ',
    sourceBook: 'សៀវភៅ',
    sourceManual: 'ឈ្មោះធម្មតា',
    loadingSaved: 'កំពុងផ្ទុកកង់ដែលបាន Save...',
    loadingHistory: 'កំពុងផ្ទុកប្រវត្តិ...',
    backgroundUploaded: 'បានកែ Background។',
    backgroundRemoved: 'បានលុប Background។',
    giftSaved: 'បានរក្សារង្វាន់។',
    giftRemoved: 'បានលុបរង្វាន់។',
    signIn: 'ចូលគណនី',
    wheelReady: 'ត្រៀមបង្វិល',
    playfulHint: 'ជ្រើសឈ្មោះ អ្នកអាន អ្នកនិពន្ធ ឬសៀវភៅ ហើយឲ្យ Shadow ជ្រើសអ្នកឈ្នះ។',
    activePrizeCount: 'រង្វាន់សកម្ម {{count}}',
    entriesSection: 'កង់របស់អ្នក',
    removeBlocked: 'អ្នកឈ្នះនេះត្រូវបានរំលងរួចក្នុងជុំ No Repeat បច្ចុប្បន្ន។',
    unexpected: 'មានបញ្ហាអ្វីមួយកើតឡើង។',
  },
  zh: {
    title: '转盘',
    back: '返回',
    normal: '普通转盘',
    shadow: 'Shadow Spin',
    wheelName: '转盘名称',
    wheelNamePlaceholder: '我的幸运转盘',
    saved: '已保存',
    save: '保存',
    saving: '保存中...',
    savedWheels: '已保存转盘',
    history: '历史记录',
    download: '下载',
    downloadResult: '下载结果',
    noResultDownload: '请先转动一次再下载结果。',
    fairTitle: '公平随机',
    fairBody: '{{count}} 个选项 • 每个 {{chance}} 概率',
    noRepeat: '不重复',
    noRepeatHelp: '本轮已中奖者会被跳过，直到重置。',
    resetRound: '重置本轮',
    background: '转盘背景',
    backgroundHelp: 'JPG、PNG 或 WebP • 最大 2 MB • 替换时会删除旧 R2 图片。',
    uploadBackground: '添加背景',
    replaceBackground: '替换背景',
    removeBackground: '删除',
    spinNow: '开始',
    spinning: '转动中...',
    needTwoEntries: '至少添加 2 个选项才能转动。',
    addEntries: '添加选项',
    entriesCount: '{{count}} / 50',
    manual: '手动',
    reader: '读者',
    author: '作者',
    book: '书籍',
    manualHelp: '手动添加名称，无需头像。',
    manualPlaceholder: '输入名称',
    add: '添加',
    searchReader: '搜索读者',
    searchAuthor: '搜索作者',
    searchBook: '搜索书籍',
    searchPlaceholder: '至少输入 2 个字符...',
    searchHint: '输入 2 个字符后搜索 • 最多 20 条结果。',
    searching: '搜索中...',
    searchFailed: '搜索失败，请重试。',
    noSearchResults: '没有匹配结果。',
    added: '已添加',
    entryExists: '此 Shadow 项目已在转盘中。',
    entryLimit: '转盘最多可有 50 个选项。',
    entryAdded: '已添加到转盘。',
    removeEntry: '移除选项',
    entries: '选项',
    emptyEntriesTitle: '创建你的转盘',
    emptyEntriesBody: '通过手动、读者、作者或书籍添加选项。',
    prizePool: '奖品池',
    prizeOptional: '可选',
    prizeHelp: 'Shadow Spin 会从已启用奖品中公平随机选择一个。',
    diamond: '钻石',
    coin: '金币',
    voucher: '兑换券',
    amount: '数量',
    customGifts: '自定义奖品',
    customCount: '{{count}} / 10',
    customHelp: '每次添加一个，每个奖品需要名称和图片。',
    newGift: '新奖品',
    editGift: '编辑奖品',
    giftName: '奖品名称',
    giftNamePlaceholder: '例如：特别书籍',
    giftImage: '奖品图片',
    chooseImage: '选择图片',
    changeImage: '更换图片',
    saveGift: '保存奖品',
    updateGift: '更新奖品',
    cancel: '取消',
    giftLimit: '最多可添加 10 个自定义奖品。',
    imageTooLarge: '图片必须小于或等于 2 MB。',
    imageType: '仅支持 JPG、PNG 或 WebP。',
    giftNeedsImage: '请选择奖品图片。',
    uploadFailed: '图片上传失败。',
    deleting: '删除中...',
    winner: '获胜者',
    prize: '奖品',
    noPrize: '无奖品',
    keep: '保留',
    removeWinner: '移除获胜者',
    spinAgain: '再转一次',
    resultSaved: '结果已保存到历史记录。',
    resultNotSaved: '转盘成功，但历史记录未保存。',
    saveLogin: '登录后才能保存转盘、历史记录和 R2 图片。',
    savedSuccess: '转盘已保存。',
    saveFailed: '无法保存转盘。',
    saveNeedsEntries: '保存前至少添加 2 个选项。',
    savedLimit: '最多保存 10 个转盘。',
    load: '加载',
    delete: '删除',
    current: '当前',
    savedEmpty: '还没有保存的转盘。',
    savedLimitHelp: '每个账号最多保存 10 个转盘。',
    historyEmpty: '还没有转盘结果。',
    historyHelp: '最多保留最近 50 条结果和 30 天。',
    clearHistory: '清空历史',
    clearHistoryConfirm: '确定清空所有转盘历史吗？',
    deleteWheelConfirm: '确定删除这个已保存转盘吗？',
    deleteGiftConfirm: '确定删除此自定义奖品及其 R2 图片吗？',
    deleteBackgroundConfirm: '确定删除此背景图片吗？',
    deleteFailed: '删除失败。',
    close: '关闭',
    newWheel: '新转盘',
    loadedWheel: '已加载保存的转盘。',
    downloadReady: '结果图片已下载。',
    shadowPrizeEmpty: '未选择奖品',
    builtInPrizeNote: '钻石、金币和兑换券在这里仅作为转盘结果标签，不会自动修改钱包余额。',
    recentWinners: '最近获胜者',
    viewAll: '查看全部',
    selected: '已选择',
    sourceReader: '读者',
    sourceAuthor: '作者',
    sourceBook: '书籍',
    sourceManual: '手动',
    loadingSaved: '正在加载已保存转盘...',
    loadingHistory: '正在加载历史记录...',
    backgroundUploaded: '背景已更新。',
    backgroundRemoved: '背景已删除。',
    giftSaved: '奖品已保存。',
    giftRemoved: '奖品已删除。',
    signIn: '登录',
    wheelReady: '准备转动',
    playfulHint: '选择名称、读者、作者或书籍，让 Shadow 来决定。',
    activePrizeCount: '{{count}} 个奖品已启用',
    entriesSection: '你的转盘',
    removeBlocked: '此获胜者已在当前不重复轮次中被排除。',
    unexpected: '出现了问题。',
  },
  ja: {
    title: 'スピン',
    back: '戻る',
    normal: 'ノーマルスピン',
    shadow: 'Shadow Spin',
    wheelName: 'ホイール名',
    wheelNamePlaceholder: 'ラッキーホイール',
    saved: '保存済み',
    save: '保存',
    saving: '保存中...',
    savedWheels: '保存したホイール',
    history: '履歴',
    download: 'ダウンロード',
    downloadResult: '結果をダウンロード',
    noResultDownload: '結果をダウンロードする前に一度スピンしてください。',
    fairTitle: '公平なランダム',
    fairBody: '{{count}} 件 • 各 {{chance}}',
    noRepeat: '重複なし',
    noRepeatHelp: '当選者はラウンドをリセットするまで除外されます。',
    resetRound: 'ラウンドをリセット',
    background: 'ホイール背景',
    backgroundHelp: 'JPG、PNG、WebP • 最大 2 MB • 置換すると古い R2 画像を削除します。',
    uploadBackground: '背景を追加',
    replaceBackground: '背景を変更',
    removeBackground: '削除',
    spinNow: 'スピン',
    spinning: 'スピン中...',
    needTwoEntries: 'スピンには少なくとも 2 件必要です。',
    addEntries: 'エントリーを追加',
    entriesCount: '{{count}} / 50',
    manual: '手動',
    reader: '読者',
    author: '作者',
    book: '本',
    manualHelp: 'プロフィール画像なしで名前を追加します。',
    manualPlaceholder: '名前を入力',
    add: '追加',
    searchReader: '読者を検索',
    searchAuthor: '作者を検索',
    searchBook: '本を検索',
    searchPlaceholder: '2文字以上入力...',
    searchHint: '2文字から検索 • 最大20件。',
    searching: '検索中...',
    searchFailed: '検索に失敗しました。',
    noSearchResults: '結果がありません。',
    added: '追加済み',
    entryExists: 'この Shadow 項目はすでにホイールにあります。',
    entryLimit: '最大 50 件まで追加できます。',
    entryAdded: 'ホイールに追加しました。',
    removeEntry: '削除',
    entries: 'エントリー',
    emptyEntriesTitle: 'ホイールを作成',
    emptyEntriesBody: '手動、読者、作者、本から追加できます。',
    prizePool: '賞品プール',
    prizeOptional: '任意',
    prizeHelp: '有効な賞品から公平に1つ選びます。',
    diamond: 'ダイヤモンド',
    coin: 'コイン',
    voucher: 'バウチャー',
    amount: '数量',
    customGifts: 'カスタム賞品',
    customCount: '{{count}} / 10',
    customHelp: '1つずつ追加します。名前と画像が必要です。',
    newGift: '新しい賞品',
    editGift: '賞品を編集',
    giftName: '賞品名',
    giftNamePlaceholder: '例：特別な本',
    giftImage: '賞品画像',
    chooseImage: '画像を選択',
    changeImage: '画像を変更',
    saveGift: '賞品を保存',
    updateGift: '賞品を更新',
    cancel: 'キャンセル',
    giftLimit: 'カスタム賞品は最大10個です。',
    imageTooLarge: '画像は 2 MB 以下にしてください。',
    imageType: 'JPG、PNG、WebP を使用してください。',
    giftNeedsImage: '賞品画像を選んでください。',
    uploadFailed: '画像をアップロードできませんでした。',
    deleting: '削除中...',
    winner: '当選者',
    prize: '賞品',
    noPrize: '賞品なし',
    keep: '残す',
    removeWinner: '当選者を削除',
    spinAgain: 'もう一度スピン',
    resultSaved: '結果を履歴に保存しました。',
    resultNotSaved: 'スピンは成功しましたが履歴を保存できませんでした。',
    saveLogin: 'ホイール、履歴、R2画像の保存にはログインが必要です。',
    savedSuccess: 'ホイールを保存しました。',
    saveFailed: 'ホイールを保存できませんでした。',
    saveNeedsEntries: '保存前に2件以上追加してください。',
    savedLimit: '保存できるホイールは最大10個です。',
    load: '読み込む',
    delete: '削除',
    current: '現在',
    savedEmpty: '保存したホイールはありません。',
    savedLimitHelp: '1アカウントにつき最大10個保存できます。',
    historyEmpty: 'スピン結果はまだありません。',
    historyHelp: '最新50件を最大30日間保存します。',
    clearHistory: '履歴を消去',
    clearHistoryConfirm: 'すべてのスピン履歴を消去しますか？',
    deleteWheelConfirm: 'この保存済みホイールを削除しますか？',
    deleteGiftConfirm: 'このカスタム賞品と R2 画像を削除しますか？',
    deleteBackgroundConfirm: 'この背景画像を削除しますか？',
    deleteFailed: '削除できませんでした。',
    close: '閉じる',
    newWheel: '新しいホイール',
    loadedWheel: '保存したホイールを読み込みました。',
    downloadReady: '結果画像をダウンロードしました。',
    shadowPrizeEmpty: '賞品未選択',
    builtInPrizeNote: 'ダイヤモンド、コイン、バウチャーは結果表示用ラベルです。ウォレット残高は自動変更されません。',
    recentWinners: '最近の当選者',
    viewAll: 'すべて見る',
    selected: '選択済み',
    sourceReader: '読者',
    sourceAuthor: '作者',
    sourceBook: '本',
    sourceManual: '手動',
    loadingSaved: '保存したホイールを読み込み中...',
    loadingHistory: '履歴を読み込み中...',
    backgroundUploaded: '背景を更新しました。',
    backgroundRemoved: '背景を削除しました。',
    giftSaved: '賞品を保存しました。',
    giftRemoved: '賞品を削除しました。',
    signIn: 'ログイン',
    wheelReady: 'スピン準備完了',
    playfulHint: '名前、読者、作者、本を選び、Shadow に選んでもらいましょう。',
    activePrizeCount: '有効な賞品 {{count}} 件',
    entriesSection: 'あなたのホイール',
    removeBlocked: 'この当選者は現在の重複なしラウンドですでに除外されています。',
    unexpected: '問題が発生しました。',
  },
  ko: {
    title: '스핀',
    back: '뒤로 가기',
    normal: '일반 스핀',
    shadow: 'Shadow Spin',
    wheelName: '휠 이름',
    wheelNamePlaceholder: '나의 행운 휠',
    saved: '저장됨',
    save: '저장',
    saving: '저장 중...',
    savedWheels: '저장된 휠',
    history: '기록',
    download: '다운로드',
    downloadResult: '결과 다운로드',
    noResultDownload: '결과를 다운로드하기 전에 한 번 돌려 주세요.',
    fairTitle: '공정한 랜덤',
    fairBody: '{{count}}개 • 각각 {{chance}} 확률',
    noRepeat: '중복 없음',
    noRepeatHelp: '당첨자는 라운드를 초기화할 때까지 제외됩니다.',
    resetRound: '라운드 초기화',
    background: '휠 배경',
    backgroundHelp: 'JPG, PNG 또는 WebP • 최대 2 MB • 교체 시 기존 R2 이미지가 삭제됩니다.',
    uploadBackground: '배경 추가',
    replaceBackground: '배경 교체',
    removeBackground: '삭제',
    spinNow: '돌리기',
    spinning: '돌리는 중...',
    needTwoEntries: '최소 2개 항목을 추가해야 돌릴 수 있습니다.',
    addEntries: '항목 추가',
    entriesCount: '{{count}} / 50',
    manual: '직접 입력',
    reader: '독자',
    author: '작가',
    book: '책',
    manualHelp: '프로필 이미지 없이 이름을 추가합니다.',
    manualPlaceholder: '이름 입력',
    add: '추가',
    searchReader: '독자 검색',
    searchAuthor: '작가 검색',
    searchBook: '책 검색',
    searchPlaceholder: '2자 이상 입력...',
    searchHint: '2자부터 검색 • 최대 20개 결과.',
    searching: '검색 중...',
    searchFailed: '검색에 실패했습니다.',
    noSearchResults: '검색 결과가 없습니다.',
    added: '추가됨',
    entryExists: '이 Shadow 항목은 이미 휠에 있습니다.',
    entryLimit: '휠에는 최대 50개 항목을 넣을 수 있습니다.',
    entryAdded: '휠에 추가했습니다.',
    removeEntry: '항목 삭제',
    entries: '항목',
    emptyEntriesTitle: '휠 만들기',
    emptyEntriesBody: '직접 입력, 독자, 작가 또는 책에서 추가하세요.',
    prizePool: '상품 풀',
    prizeOptional: '선택 사항',
    prizeHelp: '활성화된 상품 중 하나를 공정하게 무작위 선택합니다.',
    diamond: '다이아몬드',
    coin: '코인',
    voucher: '바우처',
    amount: '수량',
    customGifts: '커스텀 상품',
    customCount: '{{count}} / 10',
    customHelp: '한 번에 하나씩 추가합니다. 이름과 이미지가 필요합니다.',
    newGift: '새 상품',
    editGift: '상품 편집',
    giftName: '상품 이름',
    giftNamePlaceholder: '예: 특별한 책',
    giftImage: '상품 이미지',
    chooseImage: '이미지 선택',
    changeImage: '이미지 변경',
    saveGift: '상품 저장',
    updateGift: '상품 업데이트',
    cancel: '취소',
    giftLimit: '커스텀 상품은 최대 10개입니다.',
    imageTooLarge: '이미지는 2 MB 이하여야 합니다.',
    imageType: 'JPG, PNG 또는 WebP를 사용하세요.',
    giftNeedsImage: '상품 이미지를 선택하세요.',
    uploadFailed: '이미지 업로드에 실패했습니다.',
    deleting: '삭제 중...',
    winner: '당첨자',
    prize: '상품',
    noPrize: '상품 없음',
    keep: '유지',
    removeWinner: '당첨자 제거',
    spinAgain: '다시 돌리기',
    resultSaved: '결과를 기록에 저장했습니다.',
    resultNotSaved: '스핀은 성공했지만 기록을 저장하지 못했습니다.',
    saveLogin: '휠, 기록, R2 이미지를 저장하려면 로그인하세요.',
    savedSuccess: '휠을 저장했습니다.',
    saveFailed: '휠을 저장하지 못했습니다.',
    saveNeedsEntries: '저장하기 전에 최소 2개 항목을 추가하세요.',
    savedLimit: '최대 10개의 휠을 저장할 수 있습니다.',
    load: '불러오기',
    delete: '삭제',
    current: '현재',
    savedEmpty: '저장된 휠이 없습니다.',
    savedLimitHelp: '계정당 최대 10개의 휠을 저장할 수 있습니다.',
    historyEmpty: '아직 스핀 결과가 없습니다.',
    historyHelp: '최근 50개 결과를 최대 30일간 보관합니다.',
    clearHistory: '기록 지우기',
    clearHistoryConfirm: '모든 스핀 기록을 지울까요?',
    deleteWheelConfirm: '이 저장된 휠을 삭제할까요?',
    deleteGiftConfirm: '이 커스텀 상품과 R2 이미지를 삭제할까요?',
    deleteBackgroundConfirm: '이 배경 이미지를 삭제할까요?',
    deleteFailed: '삭제에 실패했습니다.',
    close: '닫기',
    newWheel: '새 휠',
    loadedWheel: '저장된 휠을 불러왔습니다.',
    downloadReady: '결과 이미지를 다운로드했습니다.',
    shadowPrizeEmpty: '선택된 상품 없음',
    builtInPrizeNote: '다이아몬드, 코인, 바우처는 스핀 결과용 라벨이며 지갑 잔액을 자동 변경하지 않습니다.',
    recentWinners: '최근 당첨자',
    viewAll: '전체 보기',
    selected: '선택됨',
    sourceReader: '독자',
    sourceAuthor: '작가',
    sourceBook: '책',
    sourceManual: '직접 입력',
    loadingSaved: '저장된 휠 불러오는 중...',
    loadingHistory: '기록 불러오는 중...',
    backgroundUploaded: '배경을 업데이트했습니다.',
    backgroundRemoved: '배경을 삭제했습니다.',
    giftSaved: '상품을 저장했습니다.',
    giftRemoved: '상품을 삭제했습니다.',
    signIn: '로그인',
    wheelReady: '돌릴 준비 완료',
    playfulHint: '이름, 독자, 작가 또는 책을 선택하고 Shadow에게 맡겨 보세요.',
    activePrizeCount: '활성 상품 {{count}}개',
    entriesSection: '나의 휠',
    removeBlocked: '이 당첨자는 현재 중복 없음 라운드에서 이미 제외되었습니다.',
    unexpected: '문제가 발생했습니다.',
  },
}

registerTranslationNamespace('spinPage', translations)

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_ENTRIES = 50
const MAX_CUSTOM_GIFTS = 10
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const SEARCH_LIMIT = 20
const SEARCH_DELAY_MS = 400
const SPIN_DURATION_MS = 5600
const WHEEL_COLORS = [
  '#8b5cf6',
  '#f472b6',
  '#60a5fa',
  '#fbbf24',
  '#34d399',
  '#fb7185',
  '#a78bfa',
  '#22d3ee',
]
const DEFAULT_REWARDS = {
  diamond: { enabled: false, amount: 100 },
  coin: { enabled: false, amount: 1000 },
  voucher: { enabled: false, amount: 1 },
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function storeRenewedReaderToken(response) {
  const renewed = response.headers.get('X-Reader-Token')
  if (!renewed) return

  sessionStorage.setItem('shadow_reader_token', renewed)

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', renewed)
  }
}

async function apiRequest(path, options = {}) {
  const token = getReaderToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })

  storeRenewedReaderToken(response)

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || 'Request failed')
    error.code = data.code || ''
    error.status = response.status
    throw error
  }

  return data
}

function createLocalId(prefix = 'entry') {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getRandomIndex(length) {
  if (length <= 1) return 0

  if (globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1)
    const range = 0x100000000
    const limit = Math.floor(range / length) * length
    let value = range

    while (value >= limit) {
      globalThis.crypto.getRandomValues(buffer)
      value = buffer[0]
    }

    return value % length
  }

  return Math.floor(Math.random() * length)
}

function buildWheelGradient(entries) {
  if (!entries.length) {
    return 'conic-gradient(#8b5cf6 0deg 60deg, #f472b6 60deg 120deg, #60a5fa 120deg 180deg, #fbbf24 180deg 240deg, #34d399 240deg 300deg, #a78bfa 300deg 360deg)'
  }

  const segment = 360 / entries.length

  return `conic-gradient(${entries
    .map((_, index) => {
      const start = index * segment
      const end = start + segment
      return `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${start}deg ${end}deg`
    })
    .join(', ')})`
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value || 0))
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

function validateImage(file, t) {
  if (!file) return ''

  if (file.size > MAX_IMAGE_BYTES) {
    return t('spinPage.imageTooLarge')
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return t('spinPage.imageType')
  }

  return ''
}

function prizeLabel(prize, t) {
  if (!prize) return t('spinPage.noPrize')

  if (prize.type === 'diamond') {
    return `${formatNumber(prize.amount)} ${t('spinPage.diamond')}`
  }

  if (prize.type === 'coin') {
    return `${formatNumber(prize.amount)} ${t('spinPage.coin')}`
  }

  if (prize.type === 'voucher') {
    return `${formatNumber(prize.amount)} ${t('spinPage.voucher')}`
  }

  return prize.name || t('spinPage.noPrize')
}

function sourceLabel(type, t) {
  if (type === 'reader') return t('spinPage.sourceReader')
  if (type === 'author') return t('spinPage.sourceAuthor')
  if (type === 'book') return t('spinPage.sourceBook')
  return t('spinPage.sourceManual')
}

function useSpinSearch(type, query, t) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const keyword = String(query || '').trim()

    if (keyword.length < 2) {
      setItems([])
      setLoading(false)
      setError('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          q: keyword,
          type,
          limit: String(SEARCH_LIMIT),
        })
        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}/api/discover-search?${params.toString()}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('spinPage.searchFailed'))
        }

        setItems(Array.isArray(data.results) ? data.results.slice(0, SEARCH_LIMIT) : [])
      } catch (searchError) {
        if (searchError.name === 'AbortError') return
        setItems([])
        setError(searchError.message || t('spinPage.searchFailed'))
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, SEARCH_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, t, type])

  return { items, loading, error }
}

function Avatar({ src, name, square = false, size = 46 }) {
  const initial =
    String(name || 'S')
      .trim()
      .slice(0, 1)
      .toUpperCase() || 'S'

  return (
    <div
      className={`app-elevated flex shrink-0 items-center justify-center overflow-hidden font-black ${
        square ? 'rounded-[12px]' : 'rounded-full'
      }`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-[12px] text-violet-600">{initial}</span>
      )}
    </div>
  )
}

function MiniButton({ children, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[11px] px-3 py-2 text-[11px] font-extrabold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 ${
        danger
          ? 'bg-red-500/10 text-red-500'
          : 'app-elevated text-[var(--shadow-text-primary)]'
      }`}
    >
      {children}
    </button>
  )
}

function Modal({ open, title, onClose, children, right = null, closeLabel }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('mobile-popup-open')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('mobile-popup-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="app-overlay fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label={closeLabel}
      />
      <div className="app-card relative z-10 max-h-[88vh] w-full max-w-[620px] overflow-hidden rounded-t-[26px] border shadow-2xl sm:rounded-[26px]">
        <div className="app-border flex items-center gap-3 border-b px-4 py-3.5">
          <h2 className="app-title min-w-0 flex-1 truncate text-[16px] font-black">
            {title}
          </h2>
          {right}
          <button
            type="button"
            onClick={onClose}
            className="app-elevated flex h-9 w-9 items-center justify-center rounded-full"
            aria-label={closeLabel}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>
        <div className="max-h-[calc(88vh-62px)] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}

function SearchBlock({
  icon,
  title,
  query,
  setQuery,
  search,
  type,
  entries,
  onAdd,
  disabled,
  t,
}) {
  const placeholder =
    type === 'readers'
      ? t('spinPage.searchReader')
      : type === 'pages'
        ? t('spinPage.searchAuthor')
        : t('spinPage.searchBook')

  function normalizeResult(item) {
    if (type === 'readers') {
      return {
        id: createLocalId('reader'),
        source_type: 'reader',
        source_id: String(item.id || ''),
        name: item.name || item.username || t('spinPage.reader'),
        secondary: item.username ? `@${item.username}` : '',
        image_url: item.avatar_url || null,
      }
    }

    if (type === 'pages') {
      return {
        id: createLocalId('author'),
        source_type: 'author',
        source_id: String(item.id || ''),
        name: item.page_name || item.page_username || t('spinPage.author'),
        secondary: item.page_username ? `@${item.page_username}` : '',
        image_url: item.avatar_url || null,
      }
    }

    return {
      id: createLocalId('book'),
      source_type: 'book',
      source_id: String(item.id || ''),
      name: item.title || t('spinPage.book'),
      secondary:
        item.author_page?.page_name ||
        item.author_page?.page_username ||
        '',
      image_url: item.cover_url || null,
    }
  }

  return (
    <SurfaceCard className="overflow-hidden p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-violet-500/10 text-violet-600">
          <i className={`${icon} text-[15px]`} />
        </div>
        <div>
          <h3 className="app-title text-[14px] font-black">{title}</h3>
          <p className="app-muted mt-0.5 text-[10.5px]">{t('spinPage.searchHint')}</p>
        </div>
      </div>

      <div className="relative mt-4">
        <i className="fa-solid fa-magnifying-glass app-tertiary absolute left-3 top-1/2 -translate-y-1/2 text-[12px]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
          placeholder={t('spinPage.searchPlaceholder')}
          className="app-input w-full rounded-[13px] border py-3 pl-9 pr-10 text-[12px] outline-none transition focus:border-violet-500"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="app-tertiary absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={t('spinPage.close')}
          >
            <i className="fa-solid fa-circle-xmark text-[13px]" />
          </button>
        ) : null}
      </div>

      {query.trim().length >= 2 ? (
        <div className="mt-3 max-h-[310px] overflow-y-auto rounded-[14px] border border-[var(--shadow-border)]">
          {search.loading ? (
            <div className="app-muted flex items-center justify-center gap-2 px-3 py-6 text-[11px]">
              <i className="fa-solid fa-spinner animate-spin" />
              {t('spinPage.searching')}
            </div>
          ) : search.error ? (
            <div className="px-3 py-6 text-center text-[11px] font-semibold text-red-500">
              {t('spinPage.searchFailed')}
            </div>
          ) : search.items.length ? (
            <div className="divide-y divide-[var(--shadow-border)]">
              {search.items.map((item) => {
                const entry = normalizeResult(item)
                const isBook = entry.source_type === 'book'
                const alreadyAdded = entries.some(
                  (savedEntry) =>
                    savedEntry.source_type === entry.source_type &&
                    savedEntry.source_id &&
                    savedEntry.source_id === entry.source_id
                )

                return (
                  <div
                    key={`${type}-${item.id}`}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <Avatar
                      src={entry.image_url}
                      name={entry.name}
                      square={isBook}
                      size={44}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="app-title line-clamp-1 text-[12px] font-extrabold">
                        {entry.name}
                      </div>
                      {entry.secondary ? (
                        <div className="app-muted mt-0.5 truncate text-[10px]">
                          {entry.secondary}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => onAdd(entry)}
                      disabled={alreadyAdded || disabled}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        alreadyAdded
                          ? 'app-elevated app-muted'
                          : 'bg-violet-600 text-white active:scale-95'
                      }`}
                    >
                      {alreadyAdded ? t('spinPage.added') : t('spinPage.add')}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="app-muted px-3 py-6 text-center text-[11px]">
              {t('spinPage.noSearchResults')}
            </div>
          )}
        </div>
      ) : null}
    </SurfaceCard>
  )
}

function Wheel({
  entries,
  rotation,
  isSpinning,
  onSpin,
  backgroundUrl,
  t,
}) {
  const gradient = useMemo(() => buildWheelGradient(entries), [entries])
  const labelEntries = entries.length <= 18 ? entries : []

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-violet-500/15 bg-[radial-gradient(circle_at_top,#ede9fe_0%,#fdf4ff_45%,var(--shadow-bg-surface)_100%)] p-4 sm:p-7 dark:bg-[radial-gradient(circle_at_top,#34245f_0%,#20172f_48%,var(--shadow-bg-surface)_100%)]"
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(rgba(45,20,75,.32),rgba(45,20,75,.22)), url("${backgroundUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="pointer-events-none absolute left-[8%] top-[8%] text-violet-400/70">
        <i className="fa-solid fa-star text-[15px]" />
      </div>
      <div className="pointer-events-none absolute right-[10%] top-[16%] text-pink-400/70">
        <i className="fa-solid fa-heart text-[14px]" />
      </div>
      <div className="pointer-events-none absolute bottom-[12%] left-[12%] text-amber-400/80">
        <i className="fa-solid fa-sparkles text-[14px]" />
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[470px] p-5 sm:p-8">
        <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2">
          <div className="relative">
            <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-violet-700 drop-shadow-lg" />
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-amber-300 ring-4 ring-violet-700" />
          </div>
        </div>

        <div
          className="relative h-full w-full overflow-hidden rounded-full border-[9px] border-white/90 shadow-[0_20px_55px_rgba(91,33,182,0.28)] ring-4 ring-violet-300/40 dark:border-[#2b2440]"
          style={{
            background: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12,0.72,0.05,1)`
              : 'none',
          }}
        >
          <div className="pointer-events-none absolute inset-[2%] rounded-full border border-white/45" />
          {labelEntries.map((entry, index) => {
            const segment = 360 / entries.length
            const center = index * segment + segment / 2
            const angle = ((center - 90) * Math.PI) / 180
            const radius = entries.length <= 8 ? 34 : entries.length <= 12 ? 36 : 38
            const x = 50 + Math.cos(angle) * radius
            const y = 50 + Math.sin(angle) * radius
            const showImage = Boolean(entry.image_url) && entries.length <= 12

            return (
              <div
                key={entry.id}
                className="pointer-events-none absolute z-10 flex max-w-[78px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.65)]"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {showImage ? (
                  <div className="mb-1 h-8 w-8 overflow-hidden rounded-full border-2 border-white/90 bg-white shadow">
                    <img
                      src={entry.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <span className="line-clamp-2 text-[9px] font-black leading-3 sm:text-[10px]">
                  {entry.name}
                </span>
              </div>
            )
          })}

          <div className="absolute inset-[36%] rounded-full bg-white/95 shadow-xl ring-4 ring-white/40 dark:bg-[#251d38]" />
        </div>

        <button
          type="button"
          onClick={onSpin}
          disabled={isSpinning || entries.length < 2}
          className="absolute left-1/2 top-1/2 z-20 flex h-[94px] w-[94px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 px-2 text-center text-[13px] font-black text-white shadow-[0_12px_30px_rgba(126,34,206,.45)] ring-[7px] ring-white/35 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-[108px] sm:w-[108px] sm:text-[14px]"
        >
          {isSpinning ? (
            <span className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-wand-magic-sparkles animate-pulse" />
              {t('spinPage.spinning')}
            </span>
          ) : (
            <span className="flex flex-col items-center gap-1">
              <i className="fa-solid fa-star text-amber-200" />
              {t('spinPage.spinNow')}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

function PrizeCard({ type, config, onChange, t, disabled }) {
  const meta = {
    diamond: {
      label: t('spinPage.diamond'),
      icon: 'fa-solid fa-gem',
      box: 'bg-cyan-500/10 text-cyan-500',
    },
    coin: {
      label: t('spinPage.coin'),
      icon: 'fa-solid fa-coins',
      box: 'bg-amber-500/10 text-amber-500',
    },
    voucher: {
      label: t('spinPage.voucher'),
      icon: 'fa-solid fa-ticket',
      box: 'bg-pink-500/10 text-pink-500',
    },
  }[type]

  return (
    <div
      className={`rounded-[16px] border p-3 transition ${
        config.enabled
          ? 'border-violet-500/35 bg-violet-500/5'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${meta.box}`}>
          <i className={`${meta.icon} text-[14px]`} />
        </div>
        <div className="app-title min-w-0 flex-1 text-[12px] font-black">
          {meta.label}
        </div>
        <input
          type="checkbox"
          checked={config.enabled}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              ...config,
              enabled: event.target.checked,
            })
          }
          className="h-4 w-4"
          aria-label={meta.label}
        />
      </div>

      <label className="app-muted mt-3 block text-[10px] font-bold">
        {t('spinPage.amount')}
      </label>
      <input
        type="number"
        min="1"
        max="1000000000"
        value={config.amount}
        disabled={!config.enabled || disabled}
        onChange={(event) =>
          onChange({
            ...config,
            amount: Math.max(1, Math.round(Number(event.target.value || 1))),
          })
        }
        className="app-input mt-1 w-full rounded-[11px] border px-3 py-2 text-[12px] font-bold outline-none focus:border-violet-500 disabled:opacity-50"
      />
    </div>
  )
}

function HistoryRow({ item, t, onDelete = null }) {
  const winner = item?.winner || {}
  const prize = item?.prize || null

  return (
    <div className="flex items-center gap-3 py-2.5">
      <Avatar
        src={winner.image_url}
        name={winner.name}
        square={winner.source_type === 'book'}
        size={42}
      />
      <div className="min-w-0 flex-1">
        <div className="app-title truncate text-[12px] font-extrabold">
          {winner.name || t('spinPage.winner')}
        </div>
        <div className="app-muted mt-0.5 truncate text-[10px]">
          {prize ? prizeLabel(prize, t) : t('spinPage.noPrize')} •{' '}
          {formatDate(item.created_at)}
        </div>
      </div>
      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 active:bg-red-500/10"
          aria-label={t('spinPage.delete')}
        >
          <i className="fa-regular fa-trash-can text-[12px]" />
        </button>
      ) : null}
    </div>
  )
}

function runCelebration(mode) {
  const layer = document.createElement('div')
  layer.style.position = 'fixed'
  layer.style.inset = '0'
  layer.style.pointerEvents = 'none'
  layer.style.zIndex = '120'
  layer.style.overflow = 'hidden'
  document.body.appendChild(layer)

  const shadowPieces = ['💎', '✨', '⭐', '💜', '🎉']
  const normalPieces = ['🎉', '⭐', '✨', '🎊', '💜']
  const pieces = mode === 'shadow' ? shadowPieces : normalPieces

  for (let index = 0; index < 30; index += 1) {
    const piece = document.createElement('span')
    piece.textContent = pieces[index % pieces.length]
    piece.style.position = 'absolute'
    piece.style.left = `${3 + ((index * 37) % 94)}%`
    piece.style.top = '-8%'
    piece.style.fontSize = `${14 + (index % 4) * 5}px`
    layer.appendChild(piece)

    piece.animate(
      [
        {
          transform: `translate3d(0,-20px,0) rotate(0deg)`,
          opacity: 0,
        },
        {
          opacity: 1,
          offset: 0.08,
        },
        {
          transform: `translate3d(${(index % 2 ? 1 : -1) * (35 + (index % 5) * 12)}px,108vh,0) rotate(${540 + index * 23}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1800 + (index % 7) * 130,
        delay: (index % 10) * 45,
        easing: 'cubic-bezier(.2,.7,.2,1)',
        fill: 'forwards',
      }
    )
  }

  window.setTimeout(() => layer.remove(), 3200)
}

export default function SpinPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const spinTimerRef = useRef(null)
  const backgroundInputRef = useRef(null)
  const giftInputRef = useRef(null)

  const [mode, setMode] = useState('normal')
  const [wheelTitle, setWheelTitle] = useState('')
  const [currentWheelId, setCurrentWheelId] = useState(null)
  const [entries, setEntries] = useState([])
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerResult, setWinnerResult] = useState(null)
  const [noRepeat, setNoRepeat] = useState(false)
  const [blockedIds, setBlockedIds] = useState([])
  const [manualName, setManualName] = useState('')
  const [readerQuery, setReaderQuery] = useState('')
  const [authorQuery, setAuthorQuery] = useState('')
  const [bookQuery, setBookQuery] = useState('')
  const [rewardConfig, setRewardConfig] = useState(DEFAULT_REWARDS)
  const [customGifts, setCustomGifts] = useState([])
  const [giftForm, setGiftForm] = useState(null)
  const [giftName, setGiftName] = useState('')
  const [giftFile, setGiftFile] = useState(null)
  const [giftPreview, setGiftPreview] = useState('')
  const [backgroundUrl, setBackgroundUrl] = useState('')
  const [backgroundBusy, setBackgroundBusy] = useState(false)
  const [giftBusy, setGiftBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedWheels, setSavedWheels] = useState([])
  const [savedLoading, setSavedLoading] = useState(false)
  const [savedError, setSavedError] = useState('')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [toast, setToast] = useState('')

  const readerSearch = useSpinSearch('readers', readerQuery, t)
  const authorSearch = useSpinSearch('pages', authorQuery, t)
  const bookSearch = useSpinSearch('stories', bookQuery, t)

  const activePrizes = useMemo(() => {
    const builtIns = Object.entries(rewardConfig)
      .filter(([, config]) => config.enabled && Number(config.amount) > 0)
      .map(([type, config]) => ({
        id: `built-in-${type}`,
        type,
        name:
          type === 'diamond'
            ? t('spinPage.diamond')
            : type === 'coin'
              ? t('spinPage.coin')
              : t('spinPage.voucher'),
        amount: Number(config.amount),
        image_url: null,
      }))

    return [...builtIns, ...customGifts]
  }, [customGifts, rewardConfig, t])

  const chanceText = entries.length ? `${(100 / entries.length).toFixed(entries.length > 20 ? 2 : 1)}%` : '0%'

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current)
      }

      if (giftPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(giftPreview)
      }
    }
  }, [giftPreview])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!getReaderToken()) return
    void loadSavedWheels()
    void loadHistory()
  }, [])

  async function loadSavedWheels() {
    if (!getReaderToken()) return

    try {
      setSavedLoading(true)
      setSavedError('')
      const data = await apiRequest('/api/spin/wheels?limit=10')
      setSavedWheels(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      setSavedError(error.message || t('spinPage.unexpected'))
    } finally {
      setSavedLoading(false)
    }
  }

  async function loadHistory() {
    if (!getReaderToken()) return

    try {
      setHistoryLoading(true)
      setHistoryError('')
      const data = await apiRequest('/api/spin/results?limit=50')
      setHistory(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      setHistoryError(error.message || t('spinPage.unexpected'))
    } finally {
      setHistoryLoading(false)
    }
  }

  function addEntry(entry) {
    if (isSpinning) return

    if (entries.length >= MAX_ENTRIES) {
      setToast(t('spinPage.entryLimit'))
      return
    }

    if (
      entry.source_type !== 'manual' &&
      entry.source_id &&
      entries.some(
        (item) =>
          item.source_type === entry.source_type &&
          item.source_id === entry.source_id
      )
    ) {
      setToast(t('spinPage.entryExists'))
      return
    }

    setEntries((current) => [...current, entry])
    setToast(t('spinPage.entryAdded'))
  }

  function addManualEntry() {
    const name = manualName.trim()
    if (!name) return

    addEntry({
      id: createLocalId('manual'),
      source_type: 'manual',
      source_id: null,
      name: name.slice(0, 120),
      secondary: '',
      image_url: null,
    })
    setManualName('')
  }

  function removeEntry(entryId) {
    if (isSpinning) return
    setEntries((current) => current.filter((entry) => entry.id !== entryId))
    setBlockedIds((current) => current.filter((id) => id !== entryId))

    if (winnerResult?.winner?.id === entryId) {
      setWinnerResult(null)
    }
  }

  function changeMode(nextMode) {
    if (isSpinning) return
    setMode(nextMode)
    setWinnerResult(null)
  }

  function pickWinnerAndPrize() {
    let candidates = noRepeat
      ? entries.filter((entry) => !blockedIds.includes(entry.id))
      : entries

    if (!candidates.length) {
      candidates = entries
      setBlockedIds([])
    }

    const winner = candidates[getRandomIndex(candidates.length)]
    const prize =
      mode === 'shadow' && activePrizes.length
        ? activePrizes[getRandomIndex(activePrizes.length)]
        : null

    return { winner, prize }
  }

  function spin() {
    if (isSpinning || entries.length < 2) {
      if (entries.length < 2) setToast(t('spinPage.needTwoEntries'))
      return
    }

    if (spinTimerRef.current) {
      window.clearTimeout(spinTimerRef.current)
    }

    const { winner, prize } = pickWinnerAndPrize()
    const winnerIndex = entries.findIndex((entry) => entry.id === winner.id)
    const segment = 360 / entries.length
    const selectedCenter = winnerIndex * segment + segment / 2

    setWinnerResult(null)
    setIsSpinning(true)
    setRotation((current) => {
      const normalized = ((current % 360) + 360) % 360
      const target = (360 - selectedCenter + 360) % 360
      const correction = (target - normalized + 360) % 360
      return current + 7 * 360 + correction
    })

    spinTimerRef.current = window.setTimeout(() => {
      const createdAt = new Date().toISOString()
      const result = {
        winner,
        prize,
        created_at: createdAt,
      }

      setWinnerResult(result)
      setIsSpinning(false)

      if (noRepeat) {
        setBlockedIds((current) =>
          current.includes(winner.id) ? current : [...current, winner.id]
        )
      }

      runCelebration(mode)
      void persistResult(result)
    }, SPIN_DURATION_MS)
  }

  async function persistResult(result) {
    if (!getReaderToken()) return

    try {
      const data = await apiRequest('/api/spin/results', {
        method: 'POST',
        body: JSON.stringify({
          wheel_id: currentWheelId,
          wheel_title: wheelTitle.trim() || t('spinPage.title'),
          mode,
          winner: result.winner,
          prize: result.prize,
        }),
      })

      if (data.item) {
        setHistory((current) => [
          data.item,
          ...current.filter((item) => item.id !== data.item.id),
        ].slice(0, 50))
      }
    } catch {
      setToast(t('spinPage.resultNotSaved'))
    }
  }

  function getWheelPayload() {
    return {
      title: wheelTitle.trim() || t('spinPage.title'),
      mode,
      entries,
      prizes: mode === 'shadow' ? activePrizes : [],
      background_url: backgroundUrl || null,
      options: {
        no_repeat: noRepeat,
      },
    }
  }

  async function saveWheel() {
    if (entries.length < 2) {
      setToast(t('spinPage.saveNeedsEntries'))
      return
    }

    if (!getReaderToken()) {
      setToast(t('spinPage.saveLogin'))
      return
    }

    try {
      setSaving(true)
      const data = await apiRequest(
        currentWheelId ? `/api/spin/wheels/${currentWheelId}` : '/api/spin/wheels',
        {
          method: currentWheelId ? 'PUT' : 'POST',
          body: JSON.stringify(getWheelPayload()),
        }
      )

      if (data.item) {
        setCurrentWheelId(data.item.id)
        setWheelTitle(data.item.title || '')
        setSavedWheels((current) => {
          const rest = current.filter((item) => item.id !== data.item.id)
          return [data.item, ...rest].slice(0, 10)
        })
      }

      setToast(t('spinPage.savedSuccess'))
    } catch (error) {
      setToast(
        error.code === 'SPIN_WHEEL_LIMIT'
          ? t('spinPage.savedLimit')
          : error.message || t('spinPage.saveFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  function loadWheel(item) {
    setCurrentWheelId(item.id)
    setWheelTitle(item.title || '')
    setMode(item.mode === 'shadow' ? 'shadow' : 'normal')
    setEntries(Array.isArray(item.entries) ? item.entries : [])
    setBackgroundUrl(item.background_url || '')
    setNoRepeat(Boolean(item.options?.no_repeat))
    setBlockedIds([])
    setWinnerResult(null)
    setRotation(0)

    const nextRewards = {
      diamond: { ...DEFAULT_REWARDS.diamond },
      coin: { ...DEFAULT_REWARDS.coin },
      voucher: { ...DEFAULT_REWARDS.voucher },
    }
    const nextCustom = []

    for (const prize of Array.isArray(item.prizes) ? item.prizes : []) {
      if (['diamond', 'coin', 'voucher'].includes(prize.type)) {
        nextRewards[prize.type] = {
          enabled: true,
          amount: Math.max(1, Number(prize.amount || 1)),
        }
      } else if (prize.type === 'custom') {
        nextCustom.push(prize)
      }
    }

    setRewardConfig(nextRewards)
    setCustomGifts(nextCustom.slice(0, MAX_CUSTOM_GIFTS))
    setShowSaved(false)
    setToast(t('spinPage.loadedWheel'))
  }

  function resetToNewWheel() {
    setCurrentWheelId(null)
    setWheelTitle('')
    setMode('normal')
    setEntries([])
    setBackgroundUrl('')
    setNoRepeat(false)
    setBlockedIds([])
    setWinnerResult(null)
    setRotation(0)
    setRewardConfig(DEFAULT_REWARDS)
    setCustomGifts([])
    closeGiftForm()
    setShowSaved(false)
  }

  async function deleteSavedWheel(item) {
    if (!window.confirm(t('spinPage.deleteWheelConfirm'))) return

    try {
      await apiRequest(`/api/spin/wheels/${item.id}`, {
        method: 'DELETE',
      })

      setSavedWheels((current) => current.filter((wheel) => wheel.id !== item.id))

      if (currentWheelId === item.id) {
        resetToNewWheel()
      }
    } catch (error) {
      setToast(error.message || t('spinPage.deleteFailed'))
    }
  }

  function openNewGift() {
    if (customGifts.length >= MAX_CUSTOM_GIFTS) {
      setToast(t('spinPage.giftLimit'))
      return
    }

    closeGiftForm()
    setGiftForm({ mode: 'new', id: null, old_url: '' })
    setGiftName('')
  }

  function openEditGift(gift) {
    closeGiftForm()
    setGiftForm({
      mode: 'edit',
      id: gift.id,
      old_url: gift.image_url || '',
    })
    setGiftName(gift.name || '')
    setGiftPreview(gift.image_url || '')
  }

  function closeGiftForm() {
    if (giftPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(giftPreview)
    }
    setGiftForm(null)
    setGiftName('')
    setGiftFile(null)
    setGiftPreview('')
    if (giftInputRef.current) giftInputRef.current.value = ''
  }

  function chooseGiftFile(file) {
    const validation = validateImage(file, t)

    if (validation) {
      setToast(validation)
      return
    }

    if (giftPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(giftPreview)
    }

    setGiftFile(file)
    setGiftPreview(file ? URL.createObjectURL(file) : giftForm?.old_url || '')
  }

  async function uploadMedia(file, kind, oldUrl = '') {
    if (!getReaderToken()) {
      throw new Error(t('spinPage.saveLogin'))
    }

    const form = new FormData()
    form.append('image', file)
    form.append('kind', kind)
    if (oldUrl) form.append('old_url', oldUrl)

    const data = await apiRequest('/api/spin/media', {
      method: 'POST',
      body: form,
    })

    return data.image_url || data.imageUrl || ''
  }

  async function saveGift() {
    const name = giftName.trim()
    if (!name || !giftForm) return

    if (giftForm.mode === 'new' && !giftFile) {
      setToast(t('spinPage.giftNeedsImage'))
      return
    }

    try {
      setGiftBusy(true)
      let imageUrl = giftForm.old_url || ''

      if (giftFile) {
        imageUrl = await uploadMedia(giftFile, 'gift', giftForm.old_url)
      }

      const gift = {
        id: giftForm.id || createLocalId('gift'),
        type: 'custom',
        name: name.slice(0, 120),
        amount: 0,
        image_url: imageUrl || null,
      }

      setCustomGifts((current) => {
        if (giftForm.mode === 'edit') {
          return current.map((item) => (item.id === gift.id ? gift : item))
        }

        return [...current, gift].slice(0, MAX_CUSTOM_GIFTS)
      })

      closeGiftForm()
      setToast(t('spinPage.giftSaved'))
    } catch (error) {
      setToast(error.message || t('spinPage.uploadFailed'))
    } finally {
      setGiftBusy(false)
    }
  }

  async function deleteGift(gift) {
    if (!window.confirm(t('spinPage.deleteGiftConfirm'))) return

    try {
      if (gift.image_url) {
        await apiRequest('/api/spin/media', {
          method: 'DELETE',
          body: JSON.stringify({ url: gift.image_url }),
        })
      }

      setCustomGifts((current) => current.filter((item) => item.id !== gift.id))
      if (giftForm?.id === gift.id) closeGiftForm()
      setToast(t('spinPage.giftRemoved'))
    } catch (error) {
      setToast(error.message || t('spinPage.deleteFailed'))
    }
  }

  async function chooseBackground(file) {
    const validation = validateImage(file, t)
    if (validation) {
      setToast(validation)
      return
    }

    if (!file) return

    try {
      setBackgroundBusy(true)
      const url = await uploadMedia(file, 'background', backgroundUrl)
      setBackgroundUrl(url)
      setToast(t('spinPage.backgroundUploaded'))
    } catch (error) {
      setToast(error.message || t('spinPage.uploadFailed'))
    } finally {
      setBackgroundBusy(false)
      if (backgroundInputRef.current) backgroundInputRef.current.value = ''
    }
  }

  async function removeBackground() {
    if (!backgroundUrl || !window.confirm(t('spinPage.deleteBackgroundConfirm'))) return

    try {
      setBackgroundBusy(true)
      await apiRequest('/api/spin/media', {
        method: 'DELETE',
        body: JSON.stringify({ url: backgroundUrl }),
      })
      setBackgroundUrl('')
      setToast(t('spinPage.backgroundRemoved'))
    } catch (error) {
      setToast(error.message || t('spinPage.deleteFailed'))
    } finally {
      setBackgroundBusy(false)
    }
  }

  async function deleteHistoryItem(item) {
    try {
      await apiRequest(`/api/spin/results/${item.id}`, {
        method: 'DELETE',
      })
      setHistory((current) => current.filter((row) => row.id !== item.id))
    } catch (error) {
      setToast(error.message || t('spinPage.deleteFailed'))
    }
  }

  async function clearHistory() {
    if (!window.confirm(t('spinPage.clearHistoryConfirm'))) return

    try {
      await apiRequest('/api/spin/results', {
        method: 'DELETE',
      })
      setHistory([])
    } catch (error) {
      setToast(error.message || t('spinPage.deleteFailed'))
    }
  }

  function removeWinner() {
    if (!winnerResult?.winner) return
    removeEntry(winnerResult.winner.id)
    setWinnerResult(null)
  }

  function downloadWinnerResult() {
    if (!winnerResult?.winner) {
      setToast(t('spinPage.noResultDownload'))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 700
    const context = canvas.getContext('2d')

    if (!context) return

    const gradient = context.createLinearGradient(0, 0, 1200, 700)
    gradient.addColorStop(0, '#6d28d9')
    gradient.addColorStop(0.52, '#a855f7')
    gradient.addColorStop(1, '#ec4899')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = 'rgba(255,255,255,.10)'
    for (let index = 0; index < 18; index += 1) {
      context.beginPath()
      context.arc(
        70 + ((index * 139) % 1080),
        60 + ((index * 97) % 580),
        6 + (index % 4) * 5,
        0,
        Math.PI * 2
      )
      context.fill()
    }

    context.fillStyle = '#ffffff'
    context.font = '700 34px "Noto Sans Khmer", sans-serif'
    context.fillText(mode === 'shadow' ? 'SHADOW SPIN' : 'NORMAL SPIN', 80, 105)

    context.font = '800 38px "Noto Sans Khmer", sans-serif'
    context.fillText(t('spinPage.winner'), 80, 215)

    context.font = '900 76px "Noto Sans Khmer", sans-serif'
    const winnerName = String(winnerResult.winner.name || t('spinPage.winner')).slice(0, 34)
    context.fillText(winnerName, 80, 320)

    context.fillStyle = 'rgba(255,255,255,.88)'
    context.font = '700 30px "Noto Sans Khmer", sans-serif'
    context.fillText(
      `${t('spinPage.prize')}: ${prizeLabel(winnerResult.prize, t)}`,
      80,
      405
    )

    context.fillStyle = 'rgba(255,255,255,.72)'
    context.font = '600 24px "Noto Sans Khmer", sans-serif'
    context.fillText(
      wheelTitle.trim() || t('spinPage.title'),
      80,
      495
    )
    context.fillText(formatDate(winnerResult.created_at), 80, 540)

    context.fillStyle = '#ffffff'
    context.font = '900 38px "Noto Sans Khmer", sans-serif'
    context.fillText('SHADOW', 930, 620)

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `shadow-spin-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setToast(t('spinPage.downloadReady'))
    }, 'image/png')
  }

  return (
    <PageShell className="pb-12">
      <PageHeader
        title={t('spinPage.title')}
        onBack={() => navigate(-1)}
        backLabel={t('spinPage.back')}
        right={
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="app-elevated flex h-9 w-9 items-center justify-center rounded-full"
            aria-label={t('spinPage.history')}
          >
            <i className="fa-solid fa-clock-rotate-left text-[13px]" />
          </button>
        }
      />

      <main className="mx-auto w-full max-w-[1100px] px-3 py-4 sm:px-4 sm:py-5">
        <section className="relative mb-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500 p-4 text-white shadow-[0_16px_40px_rgba(124,58,237,.22)] sm:p-5">
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white/15 ring-1 ring-white/25">
              <i className="fa-solid fa-cat text-[21px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[18px] font-black">{t('spinPage.wheelReady')}</div>
              <div className="mt-1 max-w-[620px] text-[11px] leading-5 text-white/80">
                {t('spinPage.playfulHint')}
              </div>
            </div>
            {currentWheelId ? (
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold ring-1 ring-white/20">
                {t('spinPage.saved')}
              </span>
            ) : null}
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-1 rounded-[15px] bg-black/10 p-1">
            <button
              type="button"
              onClick={() => changeMode('normal')}
              disabled={isSpinning}
              className={`rounded-[11px] px-3 py-2.5 text-[11px] font-black transition ${
                mode === 'normal'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-white/75'
              }`}
            >
              <i className="fa-solid fa-dharmachakra mr-1.5" />
              {t('spinPage.normal')}
            </button>
            <button
              type="button"
              onClick={() => changeMode('shadow')}
              disabled={isSpinning}
              className={`rounded-[11px] px-3 py-2.5 text-[11px] font-black transition ${
                mode === 'shadow'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-white/75'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-1.5" />
              {t('spinPage.shadow')}
            </button>
          </div>
        </section>

        <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="app-card flex min-w-0 items-center gap-3 rounded-[16px] border px-3.5 py-3">
            <i className="fa-solid fa-pen app-tertiary text-[12px]" />
            <span className="app-muted hidden text-[11px] font-bold sm:inline">
              {t('spinPage.wheelName')}
            </span>
            <input
              value={wheelTitle}
              onChange={(event) => setWheelTitle(event.target.value.slice(0, 80))}
              disabled={isSpinning}
              placeholder={t('spinPage.wheelNamePlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[12px] font-extrabold text-[var(--shadow-text-primary)] outline-none"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setShowSaved(true)
                void loadSavedWheels()
              }}
              className="app-card rounded-[14px] border px-3 py-2.5 text-[10px] font-extrabold active:scale-95"
            >
              <i className="fa-solid fa-folder-open mr-1.5 text-violet-500" />
              {t('spinPage.savedWheels')}
            </button>
            <button
              type="button"
              onClick={saveWheel}
              disabled={saving || isSpinning}
              className="rounded-[14px] bg-violet-600 px-3 py-2.5 text-[10px] font-extrabold text-white shadow-sm active:scale-95 disabled:opacity-55"
            >
              <i className={`fa-solid ${saving ? 'fa-spinner animate-spin' : 'fa-floppy-disk'} mr-1.5`} />
              {saving ? t('spinPage.saving') : t('spinPage.save')}
            </button>
            <button
              type="button"
              onClick={downloadWinnerResult}
              className="app-card rounded-[14px] border px-3 py-2.5 text-[10px] font-extrabold active:scale-95"
            >
              <i className="fa-solid fa-download mr-1.5 text-pink-500" />
              {t('spinPage.download')}
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.14fr)_minmax(330px,.86fr)]">
          <div className="space-y-4">
            <SurfaceCard className="p-3 sm:p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="app-title text-[14px] font-black">
                    {t('spinPage.entriesSection')}
                  </div>
                  <div className="app-muted mt-0.5 text-[10.5px]">
                    {t('spinPage.fairBody', {
                      count: entries.length,
                      chance: chanceText,
                    })}
                  </div>
                </div>

                <label className="app-elevated flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold">
                  <input
                    type="checkbox"
                    checked={noRepeat}
                    onChange={(event) => {
                      setNoRepeat(event.target.checked)
                      setBlockedIds([])
                    }}
                    disabled={isSpinning}
                    className="h-3.5 w-3.5"
                  />
                  {t('spinPage.noRepeat')}
                </label>

                {blockedIds.length ? (
                  <button
                    type="button"
                    onClick={() => setBlockedIds([])}
                    disabled={isSpinning}
                    className="rounded-full bg-violet-500/10 px-3 py-2 text-[10px] font-extrabold text-violet-600"
                  >
                    {t('spinPage.resetRound')} ({blockedIds.length})
                  </button>
                ) : null}
              </div>

              <Wheel
                entries={entries}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={spin}
                backgroundUrl={backgroundUrl}
                t={t}
              />

              {entries.length < 2 ? (
                <div className="mt-3 rounded-[12px] bg-amber-500/10 px-3 py-2.5 text-center text-[10.5px] font-bold text-amber-600 dark:text-amber-300">
                  {t('spinPage.needTwoEntries')}
                </div>
              ) : null}
            </SurfaceCard>

            <SurfaceCard className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-fuchsia-500/10 text-fuchsia-500">
                  <i className="fa-regular fa-image text-[15px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="app-title text-[13px] font-black">
                    {t('spinPage.background')}
                  </div>
                  <div className="app-muted mt-1 text-[10px] leading-4">
                    {t('spinPage.backgroundHelp')}
                  </div>
                </div>
              </div>

              {backgroundUrl ? (
                <div className="mt-3 overflow-hidden rounded-[15px] border border-[var(--shadow-border)]">
                  <img
                    src={backgroundUrl}
                    alt=""
                    className="h-28 w-full object-cover"
                  />
                </div>
              ) : null}

              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => void chooseBackground(event.target.files?.[0])}
              />

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => backgroundInputRef.current?.click()}
                  disabled={backgroundBusy || isSpinning}
                  className="flex-1 rounded-[12px] bg-violet-600 px-3 py-2.5 text-[11px] font-extrabold text-white active:scale-[0.98] disabled:opacity-55"
                >
                  <i className={`fa-solid ${backgroundBusy ? 'fa-spinner animate-spin' : 'fa-image'} mr-1.5`} />
                  {backgroundUrl
                    ? t('spinPage.replaceBackground')
                    : t('spinPage.uploadBackground')}
                </button>
                {backgroundUrl ? (
                  <button
                    type="button"
                    onClick={() => void removeBackground()}
                    disabled={backgroundBusy || isSpinning}
                    className="rounded-[12px] bg-red-500/10 px-4 py-2.5 text-[11px] font-extrabold text-red-500 disabled:opacity-50"
                  >
                    {t('spinPage.removeBackground')}
                  </button>
                ) : null}
              </div>
            </SurfaceCard>

            <section>
              <div className="mb-3 flex items-end justify-between gap-3 px-1">
                <div>
                  <h2 className="app-title text-[16px] font-black">
                    {t('spinPage.addEntries')}
                  </h2>
                  <p className="app-muted mt-1 text-[10.5px]">
                    {t('spinPage.entriesCount', { count: entries.length })}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <SurfaceCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-amber-500/10 text-amber-500">
                      <i className="fa-solid fa-keyboard text-[15px]" />
                    </div>
                    <div>
                      <h3 className="app-title text-[14px] font-black">
                        {t('spinPage.manual')}
                      </h3>
                      <p className="app-muted mt-0.5 text-[10.5px]">
                        {t('spinPage.manualHelp')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      value={manualName}
                      onChange={(event) => setManualName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') addManualEntry()
                      }}
                      disabled={isSpinning || entries.length >= MAX_ENTRIES}
                      placeholder={t('spinPage.manualPlaceholder')}
                      maxLength={120}
                      className="app-input min-w-0 flex-1 rounded-[13px] border px-3 py-3 text-[12px] outline-none focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={addManualEntry}
                      disabled={!manualName.trim() || isSpinning || entries.length >= MAX_ENTRIES}
                      className="rounded-[13px] bg-violet-600 px-4 py-3 text-[11px] font-extrabold text-white active:scale-95 disabled:opacity-45"
                    >
                      {t('spinPage.add')}
                    </button>
                  </div>
                </SurfaceCard>

                <SearchBlock
                  icon="fa-solid fa-user"
                  title={t('spinPage.reader')}
                  query={readerQuery}
                  setQuery={setReaderQuery}
                  search={readerSearch}
                  type="readers"
                  entries={entries}
                  onAdd={addEntry}
                  disabled={isSpinning || entries.length >= MAX_ENTRIES}
                  t={t}
                />

                <SearchBlock
                  icon="fa-solid fa-feather-pointed"
                  title={t('spinPage.author')}
                  query={authorQuery}
                  setQuery={setAuthorQuery}
                  search={authorSearch}
                  type="pages"
                  entries={entries}
                  onAdd={addEntry}
                  disabled={isSpinning || entries.length >= MAX_ENTRIES}
                  t={t}
                />

                <SearchBlock
                  icon="fa-solid fa-book-open"
                  title={t('spinPage.book')}
                  query={bookQuery}
                  setQuery={setBookQuery}
                  search={bookSearch}
                  type="stories"
                  entries={entries}
                  onAdd={addEntry}
                  disabled={isSpinning || entries.length >= MAX_ENTRIES}
                  t={t}
                />
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <SurfaceCard className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <h2 className="app-title text-[14px] font-black">
                    {t('spinPage.entries')}
                  </h2>
                  <div className="app-muted mt-0.5 text-[10px]">
                    {t('spinPage.entriesCount', { count: entries.length })}
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-violet-600">
                  <i className="fa-solid fa-users text-[13px]" />
                </div>
              </div>

              {entries.length ? (
                <div className="max-h-[430px] divide-y divide-[var(--shadow-border)] overflow-y-auto border-t border-[var(--shadow-border)]">
                  {entries.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="app-muted w-5 shrink-0 text-center text-[9px] font-bold">
                        {index + 1}
                      </div>
                      <Avatar
                        src={entry.image_url}
                        name={entry.name}
                        square={entry.source_type === 'book'}
                        size={39}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="app-title truncate text-[11.5px] font-extrabold">
                          {entry.name}
                        </div>
                        <div className="app-muted mt-0.5 flex items-center gap-1.5 truncate text-[9.5px]">
                          <span>{sourceLabel(entry.source_type, t)}</span>
                          {entry.secondary ? <span>• {entry.secondary}</span> : null}
                          {blockedIds.includes(entry.id) ? (
                            <span className="ml-1 rounded-full bg-fuchsia-500/10 px-1.5 py-0.5 text-[8px] font-black text-fuchsia-500">
                              {t('spinPage.noRepeat')}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        disabled={isSpinning}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-500 active:bg-red-500/10 disabled:opacity-40"
                        aria-label={t('spinPage.removeEntry')}
                      >
                        <i className="fa-solid fa-xmark text-[12px]" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-t border-[var(--shadow-border)] p-3">
                  <PageEmptyState
                    title={t('spinPage.emptyEntriesTitle')}
                    body={t('spinPage.emptyEntriesBody')}
                    className="border-0 shadow-none"
                    icon={<i className="fa-solid fa-dharmachakra text-violet-500" />}
                  />
                </div>
              )}
            </SurfaceCard>

            {mode === 'shadow' ? (
              <SurfaceCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-sm">
                    <i className="fa-solid fa-gift text-[17px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="app-title text-[14px] font-black">
                        {t('spinPage.prizePool')}
                      </h2>
                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-extrabold text-violet-600">
                        {t('spinPage.prizeOptional')}
                      </span>
                    </div>
                    <div className="app-muted mt-1 text-[10px] leading-4">
                      {t('spinPage.prizeHelp')}
                    </div>
                    <div className="mt-1 text-[9.5px] font-bold text-fuchsia-500">
                      {t('spinPage.activePrizeCount', { count: activePrizes.length })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                  {['diamond', 'coin', 'voucher'].map((type) => (
                    <PrizeCard
                      key={type}
                      type={type}
                      config={rewardConfig[type]}
                      onChange={(next) =>
                        setRewardConfig((current) => ({
                          ...current,
                          [type]: next,
                        }))
                      }
                      t={t}
                      disabled={isSpinning}
                    />
                  ))}
                </div>

                <div className="mt-3 rounded-[12px] bg-amber-500/10 px-3 py-2.5 text-[9.5px] leading-4 text-amber-700 dark:text-amber-300">
                  {t('spinPage.builtInPrizeNote')}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="app-title text-[12px] font-black">
                      {t('spinPage.customGifts')}
                    </div>
                    <div className="app-muted mt-0.5 text-[9.5px]">
                      {t('spinPage.customCount', { count: customGifts.length })}
                    </div>
                  </div>
                  {!giftForm ? (
                    <button
                      type="button"
                      onClick={openNewGift}
                      disabled={customGifts.length >= MAX_CUSTOM_GIFTS || isSpinning}
                      className="rounded-full bg-violet-600 px-3 py-2 text-[10px] font-extrabold text-white active:scale-95 disabled:opacity-45"
                    >
                      <i className="fa-solid fa-plus mr-1" />
                      {t('spinPage.newGift')}
                    </button>
                  ) : null}
                </div>

                <p className="app-muted mt-2 text-[9.5px] leading-4">
                  {t('spinPage.customHelp')}
                </p>

                {customGifts.length ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {customGifts.map((gift) => (
                      <div
                        key={gift.id}
                        className="overflow-hidden rounded-[14px] border border-[var(--shadow-border)]"
                      >
                        <div className="aspect-[1.35/1] bg-[var(--shadow-bg-elevated)]">
                          {gift.image_url ? (
                            <img
                              src={gift.image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-2.5">
                          <div className="app-title truncate text-[10.5px] font-extrabold">
                            {gift.name}
                          </div>
                          <div className="mt-2 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditGift(gift)}
                              disabled={isSpinning}
                              className="app-elevated flex-1 rounded-[9px] py-1.5 text-[9px] font-extrabold"
                            >
                              {t('spinPage.editGift')}
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteGift(gift)}
                              disabled={isSpinning}
                              className="rounded-[9px] bg-red-500/10 px-2.5 py-1.5 text-[9px] font-extrabold text-red-500"
                            >
                              <i className="fa-regular fa-trash-can" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {giftForm ? (
                  <div className="mt-4 rounded-[16px] border border-violet-500/25 bg-violet-500/5 p-3">
                    <div className="app-title text-[12px] font-black">
                      {giftForm.mode === 'edit'
                        ? t('spinPage.editGift')
                        : t('spinPage.newGift')}
                    </div>

                    <label className="app-muted mt-3 block text-[9.5px] font-bold">
                      {t('spinPage.giftName')}
                    </label>
                    <input
                      value={giftName}
                      onChange={(event) => setGiftName(event.target.value.slice(0, 120))}
                      placeholder={t('spinPage.giftNamePlaceholder')}
                      className="app-input mt-1 w-full rounded-[11px] border px-3 py-2.5 text-[11px] outline-none focus:border-violet-500"
                    />

                    <label className="app-muted mt-3 block text-[9.5px] font-bold">
                      {t('spinPage.giftImage')}
                    </label>

                    {giftPreview ? (
                      <div className="mt-2 aspect-[1.8/1] overflow-hidden rounded-[12px] border border-[var(--shadow-border)]">
                        <img
                          src={giftPreview}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <input
                      ref={giftInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => chooseGiftFile(event.target.files?.[0])}
                    />

                    <button
                      type="button"
                      onClick={() => giftInputRef.current?.click()}
                      disabled={giftBusy}
                      className="app-elevated mt-2 w-full rounded-[11px] px-3 py-2.5 text-[10px] font-extrabold"
                    >
                      <i className="fa-regular fa-image mr-1.5" />
                      {giftPreview
                        ? t('spinPage.changeImage')
                        : t('spinPage.chooseImage')}
                    </button>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={closeGiftForm}
                        disabled={giftBusy}
                        className="app-elevated rounded-[11px] px-3 py-2.5 text-[10px] font-extrabold"
                      >
                        {t('spinPage.cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={() => void saveGift()}
                        disabled={giftBusy || !giftName.trim()}
                        className="rounded-[11px] bg-violet-600 px-3 py-2.5 text-[10px] font-extrabold text-white disabled:opacity-45"
                      >
                        {giftBusy ? (
                          <i className="fa-solid fa-spinner mr-1.5 animate-spin" />
                        ) : null}
                        {giftForm.mode === 'edit'
                          ? t('spinPage.updateGift')
                          : t('spinPage.saveGift')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </SurfaceCard>
            ) : null}

            <SurfaceCard className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="app-title text-[13px] font-black">
                    {t('spinPage.recentWinners')}
                  </h2>
                  <div className="app-muted mt-0.5 text-[9.5px]">
                    {t('spinPage.historyHelp')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowHistory(true)
                    void loadHistory()
                  }}
                  className="text-[10px] font-extrabold text-violet-600"
                >
                  {t('spinPage.viewAll')}
                </button>
              </div>

              {history.slice(0, 3).length ? (
                <div className="mt-2 divide-y divide-[var(--shadow-border)]">
                  {history.slice(0, 3).map((item) => (
                    <HistoryRow key={item.id} item={item} t={t} />
                  ))}
                </div>
              ) : (
                <div className="app-muted mt-4 rounded-[13px] bg-[var(--shadow-bg-soft)] px-3 py-5 text-center text-[10px]">
                  {t('spinPage.historyEmpty')}
                </div>
              )}
            </SurfaceCard>
          </div>
        </div>
      </main>

      <Modal
        open={Boolean(winnerResult)}
        title={t('spinPage.winner')}
        onClose={() => setWinnerResult(null)}
        closeLabel={t('spinPage.close')}
      >
        {winnerResult ? (
          <div className="text-center">
            <div className="relative mx-auto w-fit">
              <div className="absolute -inset-5 rounded-full bg-violet-500/15 blur-xl" />
              <Avatar
                src={winnerResult.winner.image_url}
                name={winnerResult.winner.name}
                square={winnerResult.winner.source_type === 'book'}
                size={96}
              />
              <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg">
                <i className="fa-solid fa-crown text-[14px]" />
              </div>
            </div>

            <div className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-500">
              {sourceLabel(winnerResult.winner.source_type, t)}
            </div>
            <div className="app-title mt-1 text-[25px] font-black">
              {winnerResult.winner.name}
            </div>
            {winnerResult.winner.secondary ? (
              <div className="app-muted mt-1 text-[11px]">
                {winnerResult.winner.secondary}
              </div>
            ) : null}

            <div className="mx-auto mt-5 max-w-[360px] rounded-[18px] bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-4 ring-1 ring-violet-500/15">
              <div className="app-muted text-[10px] font-bold">
                {t('spinPage.prize')}
              </div>

              {winnerResult.prize?.image_url ? (
                <img
                  src={winnerResult.prize.image_url}
                  alt=""
                  className="mx-auto mt-2 h-16 w-16 rounded-[14px] object-cover shadow"
                />
              ) : (
                <div className="mx-auto mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
                  <i
                    className={`fa-solid ${
                      winnerResult.prize?.type === 'diamond'
                        ? 'fa-gem'
                        : winnerResult.prize?.type === 'coin'
                          ? 'fa-coins'
                          : winnerResult.prize?.type === 'voucher'
                            ? 'fa-ticket'
                            : 'fa-star'
                    }`}
                  />
                </div>
              )}

              <div className="app-title mt-2 text-[15px] font-black">
                {prizeLabel(winnerResult.prize, t)}
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWinnerResult(null)}
                className="app-elevated rounded-[13px] px-4 py-3 text-[11px] font-extrabold"
              >
                {t('spinPage.keep')}
              </button>
              <button
                type="button"
                onClick={removeWinner}
                className="rounded-[13px] bg-red-500/10 px-4 py-3 text-[11px] font-extrabold text-red-500"
              >
                {t('spinPage.removeWinner')}
              </button>
              <button
                type="button"
                onClick={downloadWinnerResult}
                className="app-elevated rounded-[13px] px-4 py-3 text-[11px] font-extrabold"
              >
                <i className="fa-solid fa-download mr-1.5" />
                {t('spinPage.downloadResult')}
              </button>
              <button
                type="button"
                onClick={spin}
                disabled={entries.length < 2}
                className="rounded-[13px] bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-3 text-[11px] font-extrabold text-white disabled:opacity-45"
              >
                <i className="fa-solid fa-rotate mr-1.5" />
                {t('spinPage.spinAgain')}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={showSaved}
        title={t('spinPage.savedWheels')}
        onClose={() => setShowSaved(false)}
        closeLabel={t('spinPage.close')}
        right={
          <button
            type="button"
            onClick={resetToNewWheel}
            className="rounded-full bg-violet-600 px-3 py-2 text-[10px] font-extrabold text-white"
          >
            <i className="fa-solid fa-plus mr-1" />
            {t('spinPage.newWheel')}
          </button>
        }
      >
        <div className="app-muted mb-3 text-[10px]">{t('spinPage.savedLimitHelp')}</div>

        {savedLoading ? (
          <PageLoadingState label={t('spinPage.loadingSaved')} rows={3} />
        ) : savedError ? (
          <div className="rounded-[14px] bg-red-500/10 p-4 text-center text-[11px] font-bold text-red-500">
            {savedError}
          </div>
        ) : savedWheels.length ? (
          <div className="space-y-2">
            {savedWheels.map((item) => (
              <div
                key={item.id}
                className={`rounded-[16px] border p-3 ${
                  currentWheelId === item.id
                    ? 'border-violet-500/40 bg-violet-500/5'
                    : 'border-[var(--shadow-border)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-violet-500/10 text-violet-600">
                    <i className="fa-solid fa-dharmachakra text-[14px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="app-title truncate text-[12px] font-black">
                      {item.title}
                    </div>
                    <div className="app-muted mt-0.5 text-[9.5px]">
                      {item.mode === 'shadow'
                        ? t('spinPage.shadow')
                        : t('spinPage.normal')}{' '}
                      • {t('spinPage.entriesCount', { count: item.entries?.length || 0 })}
                    </div>
                  </div>
                  {currentWheelId === item.id ? (
                    <span className="rounded-full bg-violet-600 px-2 py-1 text-[8px] font-black text-white">
                      {t('spinPage.current')}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <MiniButton onClick={() => loadWheel(item)}>
                    {t('spinPage.load')}
                  </MiniButton>
                  <MiniButton danger onClick={() => void deleteSavedWheel(item)}>
                    {t('spinPage.delete')}
                  </MiniButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="app-muted rounded-[14px] bg-[var(--shadow-bg-soft)] p-8 text-center text-[11px]">
            {t('spinPage.savedEmpty')}
          </div>
        )}
      </Modal>

      <Modal
        open={showHistory}
        title={t('spinPage.history')}
        onClose={() => setShowHistory(false)}
        closeLabel={t('spinPage.close')}
        right={
          history.length ? (
            <button
              type="button"
              onClick={() => void clearHistory()}
              className="rounded-full bg-red-500/10 px-3 py-2 text-[9.5px] font-extrabold text-red-500"
            >
              {t('spinPage.clearHistory')}
            </button>
          ) : null
        }
      >
        <div className="app-muted mb-3 text-[10px]">{t('spinPage.historyHelp')}</div>

        {historyLoading ? (
          <PageLoadingState label={t('spinPage.loadingHistory')} rows={4} />
        ) : historyError ? (
          <div className="rounded-[14px] bg-red-500/10 p-4 text-center text-[11px] font-bold text-red-500">
            {historyError}
          </div>
        ) : history.length ? (
          <div className="divide-y divide-[var(--shadow-border)]">
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                t={t}
                onDelete={deleteHistoryItem}
              />
            ))}
          </div>
        ) : (
          <div className="app-muted rounded-[14px] bg-[var(--shadow-bg-soft)] p-8 text-center text-[11px]">
            {t('spinPage.historyEmpty')}
          </div>
        )}
      </Modal>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[130] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 rounded-[14px] bg-[#171923] px-4 py-3 text-center text-[11px] font-bold text-white shadow-2xl dark:bg-white dark:text-[#171923]">
          {toast}
        </div>
      ) : null}
    </PageShell>
  )
}
