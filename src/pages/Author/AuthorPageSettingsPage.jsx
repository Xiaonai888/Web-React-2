import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageSettings', {
  "en": {
    "pleaseLogin": "Please login first",
    "loadCategoriesFailed": "Failed to load categories",
    "createCategoryFailed": "Failed to create category",
    "updateCategoryFailed": "Failed to update category",
    "deleteCategoryFailed": "Failed to delete category",
    "saveOrderFailed": "Failed to save category order",
    "loadDeliveryFailed": "Failed to load delivery settings",
    "updateDeliveryFailed": "Failed to update delivery settings",
    "loadTelegramFailed": "Failed to load Telegram settings",
    "createTelegramFailed": "Failed to create Telegram connect link",
    "unlinkTelegramFailed": "Failed to unlink Telegram group",
    "deliverySaved": "Delivery fees saved.",
    "saveDeliveryFailed": "Failed to save delivery fees.",
    "categoryOrderSaved": "Category order saved.",
    "deleteCategoryConfirm": "Delete \"{{name}}\" category?",
    "telegramLinkMissing": "Telegram connect link was created, but the link was missing.",
    "openTelegramFailed": "Failed to open Telegram connect link.",
    "telegramUnlinked": "Telegram group unlinked. You can connect a new group now.",
    "back": "Back",
    "storeBanner": "Store Banner",
    "telegramBot": "Telegram Bot",
    "salesReports": "Sales Reports",
    "categoryManagement": "Category Management",
    "deliveryCompany": "Delivery Company",
    "settings": "Settings",
    "createCustomCategory": "Create custom category",
    "customCategoryHelp": "You can create up to 5 custom categories.",
    "categoryName": "Category name",
    "categoryLimit": "Custom category limit reached",
    "add": "Add",
    "categoryLimitHelp": "Custom category limit reached. Delete one custom category before creating a new one.",
    "categories": "Categories",
    "saveOrder": "Save order",
    "loadingCategories": "Loading categories...",
    "system": "System",
    "hidden": "Hidden",
    "soldOut": "Sold out",
    "save": "Save",
    "cancel": "Cancel",
    "show": "Show",
    "hide": "Hide",
    "edit": "Edit",
    "delete": "Delete",
    "deliveryFees": "Delivery fees",
    "deliveryFeesHelp": "These fees will be added to checkout total.",
    "jntHelp": "J&T Express delivery for printed books.",
    "vetHelp": "Virak Buntham Express delivery option.",
    "deliveryFee": "Delivery fee",
    "saving": "Saving...",
    "saveDelivery": "Save delivery fees",
    "receiveTelegram": "Receive Telegram Notifications",
    "receiveTelegramHelp": "Link this author page to one Telegram group for order approval alerts. You can change groups only after unlinking the current one.",
    "linkedGroup": "Linked group",
    "telegramGroup": "Telegram group",
    "groupId": "Group ID: {{id}}",
    "linkedAt": "Linked: {{date}}",
    "oneGroupHelp": "This author page can use only one Telegram group. To connect another group, unlink this group first.",
    "unlinking": "Unlinking...",
    "unlinkGroup": "Unlink group",
    "howConnect": "How to connect",
    "telegramStep1": "Tap Connect Telegram Group.",
    "telegramStep2": "Telegram will open and ask you to choose a group.",
    "telegramStep3": "Add @{{bot}} to that group.",
    "telegramStep4": "The bot will confirm when the group is linked.",
    "openingTelegram": "Opening Telegram...",
    "loading": "Loading...",
    "connectTelegram": "Connect Telegram Group",
    "storeBannerHelp": "Upload, change, or remove your store banner.",
    "categoryManagementHelp": "Categories, hidden sections, and order.",
    "deliveryCompanyHelp": "J&T fee, VET fee, and checkout delivery.",
    "paymentAlerts": "Payment Alerts",
    "salesReportsHelp": "Sync monthly Book and PDF sales to Google Sheets."
  },
  "km": {
    "pleaseLogin": "សូមចូលគណនីជាមុន",
    "loadCategoriesFailed": "មិនអាចផ្ទុកប្រភេទបានទេ",
    "createCategoryFailed": "មិនអាចបង្កើតប្រភេទបានទេ",
    "updateCategoryFailed": "មិនអាចកែប្រភេទបានទេ",
    "deleteCategoryFailed": "មិនអាចលុបប្រភេទបានទេ",
    "saveOrderFailed": "មិនអាចរក្សាទុកលំដាប់ប្រភេទបានទេ",
    "loadDeliveryFailed": "មិនអាចផ្ទុកការកំណត់ដឹកជញ្ជូនបានទេ",
    "updateDeliveryFailed": "មិនអាចកែការកំណត់ដឹកជញ្ជូនបានទេ",
    "loadTelegramFailed": "មិនអាចផ្ទុកការកំណត់ Telegram បានទេ",
    "createTelegramFailed": "មិនអាចបង្កើតតំណភ្ជាប់ Telegram បានទេ",
    "unlinkTelegramFailed": "មិនអាចផ្តាច់ក្រុម Telegram បានទេ",
    "deliverySaved": "បានរក្សាទុកថ្លៃដឹកជញ្ជូន។",
    "saveDeliveryFailed": "មិនអាចរក្សាទុកថ្លៃដឹកជញ្ជូនបានទេ។",
    "categoryOrderSaved": "បានរក្សាទុកលំដាប់ប្រភេទ។",
    "deleteCategoryConfirm": "លុបប្រភេទ \"{{name}}\" មែនទេ?",
    "telegramLinkMissing": "បានបង្កើតតំណ Telegram ប៉ុន្តែរកមិនឃើញតំណ។",
    "openTelegramFailed": "មិនអាចបើកតំណ Telegram បានទេ។",
    "telegramUnlinked": "បានផ្តាច់ក្រុម Telegram។ ឥឡូវអ្នកអាចភ្ជាប់ក្រុមថ្មីបាន។",
    "back": "ត្រឡប់ក្រោយ",
    "storeBanner": "Banner ហាង",
    "telegramBot": "Telegram Bot",
    "salesReports": "របាយការណ៍លក់",
    "categoryManagement": "គ្រប់គ្រងប្រភេទ",
    "deliveryCompany": "ក្រុមហ៊ុនដឹកជញ្ជូន",
    "settings": "ការកំណត់",
    "createCustomCategory": "បង្កើតប្រភេទផ្ទាល់ខ្លួន",
    "customCategoryHelp": "អ្នកអាចបង្កើតប្រភេទផ្ទាល់ខ្លួនបានរហូតដល់ 5។",
    "categoryName": "ឈ្មោះប្រភេទ",
    "categoryLimit": "ដល់កំណត់ប្រភេទផ្ទាល់ខ្លួន",
    "add": "បន្ថែម",
    "categoryLimitHelp": "ដល់កំណត់ប្រភេទផ្ទាល់ខ្លួន។ សូមលុបមួយសិន មុនបង្កើតថ្មី។",
    "categories": "ប្រភេទ",
    "saveOrder": "រក្សាទុកលំដាប់",
    "loadingCategories": "កំពុងផ្ទុកប្រភេទ...",
    "system": "ប្រព័ន្ធ",
    "hidden": "លាក់",
    "soldOut": "អស់ពីស្តុក",
    "save": "រក្សាទុក",
    "cancel": "បោះបង់",
    "show": "បង្ហាញ",
    "hide": "លាក់",
    "edit": "កែ",
    "delete": "លុប",
    "deliveryFees": "ថ្លៃដឹកជញ្ជូន",
    "deliveryFeesHelp": "ថ្លៃទាំងនេះនឹងបន្ថែមទៅចំនួនសរុបពេល Checkout។",
    "jntHelp": "J&T Express សម្រាប់ដឹកសៀវភៅបោះពុម្ព។",
    "vetHelp": "ជម្រើសដឹកជញ្ជូន Virak Buntham Express។",
    "deliveryFee": "ថ្លៃដឹកជញ្ជូន",
    "saving": "កំពុងរក្សាទុក...",
    "saveDelivery": "រក្សាទុកថ្លៃដឹកជញ្ជូន",
    "receiveTelegram": "ទទួលការជូនដំណឹង Telegram",
    "receiveTelegramHelp": "ភ្ជាប់ទំព័រអ្នកនិពន្ធនេះទៅក្រុម Telegram មួយ សម្រាប់ការជូនដំណឹងអនុម័តការបញ្ជាទិញ។ អ្នកអាចប្តូរក្រុមបាន បន្ទាប់ពីផ្តាច់ក្រុមបច្ចុប្បន្ន។",
    "linkedGroup": "ក្រុមដែលបានភ្ជាប់",
    "telegramGroup": "ក្រុម Telegram",
    "groupId": "Group ID: {{id}}",
    "linkedAt": "បានភ្ជាប់៖ {{date}}",
    "oneGroupHelp": "ទំព័រអ្នកនិពន្ធនេះអាចប្រើក្រុម Telegram តែមួយ។ ដើម្បីភ្ជាប់ក្រុមផ្សេង សូមផ្តាច់ក្រុមនេះជាមុន។",
    "unlinking": "កំពុងផ្តាច់...",
    "unlinkGroup": "ផ្តាច់ក្រុម",
    "howConnect": "របៀបភ្ជាប់",
    "telegramStep1": "ចុច Connect Telegram Group។",
    "telegramStep2": "Telegram នឹងបើក ហើយឱ្យអ្នកជ្រើសក្រុម។",
    "telegramStep3": "បន្ថែម @{{bot}} ទៅក្នុងក្រុមនោះ។",
    "telegramStep4": "Bot នឹងបញ្ជាក់ពេលភ្ជាប់ក្រុមរួច។",
    "openingTelegram": "កំពុងបើក Telegram...",
    "loading": "កំពុងផ្ទុក...",
    "connectTelegram": "ភ្ជាប់ក្រុម Telegram",
    "storeBannerHelp": "បង្ហោះ ប្តូរ ឬលុប Banner ហាងរបស់អ្នក។",
    "categoryManagementHelp": "ប្រភេទ ផ្នែកលាក់ និងលំដាប់។",
    "deliveryCompanyHelp": "ថ្លៃ J&T ថ្លៃ VET និងការដឹកជញ្ជូនពេល Checkout។",
    "paymentAlerts": "ការជូនដំណឹងការទូទាត់",
    "salesReportsHelp": "Sync ការលក់ Book និង PDF ប្រចាំខែទៅ Google Sheets។"
  },
  "zh": {
    "pleaseLogin": "请先登录",
    "loadCategoriesFailed": "无法加载分类",
    "createCategoryFailed": "无法创建分类",
    "updateCategoryFailed": "无法更新分类",
    "deleteCategoryFailed": "无法删除分类",
    "saveOrderFailed": "无法保存分类顺序",
    "loadDeliveryFailed": "无法加载配送设置",
    "updateDeliveryFailed": "无法更新配送设置",
    "loadTelegramFailed": "无法加载 Telegram 设置",
    "createTelegramFailed": "无法创建 Telegram 连接链接",
    "unlinkTelegramFailed": "无法解绑 Telegram 群组",
    "deliverySaved": "配送费用已保存。",
    "saveDeliveryFailed": "无法保存配送费用。",
    "categoryOrderSaved": "分类顺序已保存。",
    "deleteCategoryConfirm": "删除“{{name}}”分类？",
    "telegramLinkMissing": "Telegram 连接链接已创建，但链接缺失。",
    "openTelegramFailed": "无法打开 Telegram 连接链接。",
    "telegramUnlinked": "Telegram 群组已解绑，现在可以连接新群组。",
    "back": "返回",
    "storeBanner": "商店横幅",
    "telegramBot": "Telegram 机器人",
    "salesReports": "销售报告",
    "categoryManagement": "分类管理",
    "deliveryCompany": "配送公司",
    "settings": "设置",
    "createCustomCategory": "创建自定义分类",
    "customCategoryHelp": "最多可创建 5 个自定义分类。",
    "categoryName": "分类名称",
    "categoryLimit": "已达到自定义分类上限",
    "add": "添加",
    "categoryLimitHelp": "已达到自定义分类上限。请先删除一个分类再创建新的。",
    "categories": "分类",
    "saveOrder": "保存顺序",
    "loadingCategories": "正在加载分类...",
    "system": "系统",
    "hidden": "已隐藏",
    "soldOut": "已售罄",
    "save": "保存",
    "cancel": "取消",
    "show": "显示",
    "hide": "隐藏",
    "edit": "编辑",
    "delete": "删除",
    "deliveryFees": "配送费用",
    "deliveryFeesHelp": "这些费用会添加到结账总额。",
    "jntHelp": "J&T Express 纸质书配送。",
    "vetHelp": "Virak Buntham Express 配送选项。",
    "deliveryFee": "配送费",
    "saving": "正在保存...",
    "saveDelivery": "保存配送费用",
    "receiveTelegram": "接收 Telegram 通知",
    "receiveTelegramHelp": "将此作者页面连接到一个 Telegram 群组，用于接收订单审批提醒。只有解绑当前群组后才能更换群组。",
    "linkedGroup": "已连接群组",
    "telegramGroup": "Telegram 群组",
    "groupId": "群组 ID：{{id}}",
    "linkedAt": "连接时间：{{date}}",
    "oneGroupHelp": "此作者页面只能使用一个 Telegram 群组。若要连接其他群组，请先解绑当前群组。",
    "unlinking": "正在解绑...",
    "unlinkGroup": "解绑群组",
    "howConnect": "如何连接",
    "telegramStep1": "点击“连接 Telegram 群组”。",
    "telegramStep2": "Telegram 会打开并让你选择一个群组。",
    "telegramStep3": "将 @{{bot}} 添加到该群组。",
    "telegramStep4": "群组连接成功后，机器人会确认。",
    "openingTelegram": "正在打开 Telegram...",
    "loading": "加载中...",
    "connectTelegram": "连接 Telegram 群组",
    "storeBannerHelp": "上传、更换或移除商店横幅。",
    "categoryManagementHelp": "管理分类、隐藏区块和顺序。",
    "deliveryCompanyHelp": "J&T 费用、VET 费用和结账配送。",
    "paymentAlerts": "付款提醒",
    "salesReportsHelp": "将每月 Book 和 PDF 销售同步到 Google Sheets。"
  },
  "ja": {
    "pleaseLogin": "先にログインしてください",
    "loadCategoriesFailed": "カテゴリを読み込めませんでした",
    "createCategoryFailed": "カテゴリを作成できませんでした",
    "updateCategoryFailed": "カテゴリを更新できませんでした",
    "deleteCategoryFailed": "カテゴリを削除できませんでした",
    "saveOrderFailed": "カテゴリ順を保存できませんでした",
    "loadDeliveryFailed": "配送設定を読み込めませんでした",
    "updateDeliveryFailed": "配送設定を更新できませんでした",
    "loadTelegramFailed": "Telegram 設定を読み込めませんでした",
    "createTelegramFailed": "Telegram 接続リンクを作成できませんでした",
    "unlinkTelegramFailed": "Telegram グループを解除できませんでした",
    "deliverySaved": "配送料を保存しました。",
    "saveDeliveryFailed": "配送料を保存できませんでした。",
    "categoryOrderSaved": "カテゴリ順を保存しました。",
    "deleteCategoryConfirm": "「{{name}}」カテゴリを削除しますか？",
    "telegramLinkMissing": "Telegram 接続リンクを作成しましたが、リンクが見つかりません。",
    "openTelegramFailed": "Telegram 接続リンクを開けませんでした。",
    "telegramUnlinked": "Telegram グループの連携を解除しました。新しいグループを接続できます。",
    "back": "戻る",
    "storeBanner": "ストアバナー",
    "telegramBot": "Telegram Bot",
    "salesReports": "売上レポート",
    "categoryManagement": "カテゴリ管理",
    "deliveryCompany": "配送会社",
    "settings": "設定",
    "createCustomCategory": "カスタムカテゴリを作成",
    "customCategoryHelp": "カスタムカテゴリは最大5個まで作成できます。",
    "categoryName": "カテゴリ名",
    "categoryLimit": "カスタムカテゴリの上限に達しました",
    "add": "追加",
    "categoryLimitHelp": "カスタムカテゴリの上限に達しました。新規作成する前に1つ削除してください。",
    "categories": "カテゴリ",
    "saveOrder": "順序を保存",
    "loadingCategories": "カテゴリを読み込み中...",
    "system": "システム",
    "hidden": "非表示",
    "soldOut": "売り切れ",
    "save": "保存",
    "cancel": "キャンセル",
    "show": "表示",
    "hide": "非表示",
    "edit": "編集",
    "delete": "削除",
    "deliveryFees": "配送料",
    "deliveryFeesHelp": "これらの料金はチェックアウト合計に追加されます。",
    "jntHelp": "J&T Express の紙の本配送。",
    "vetHelp": "Virak Buntham Express の配送オプション。",
    "deliveryFee": "配送料",
    "saving": "保存中...",
    "saveDelivery": "配送料を保存",
    "receiveTelegram": "Telegram 通知を受け取る",
    "receiveTelegramHelp": "この作者ページを1つの Telegram グループに接続して、注文承認通知を受け取ります。現在のグループを解除した後にのみ変更できます。",
    "linkedGroup": "接続済みグループ",
    "telegramGroup": "Telegram グループ",
    "groupId": "グループ ID: {{id}}",
    "linkedAt": "接続: {{date}}",
    "oneGroupHelp": "この作者ページで使用できる Telegram グループは1つだけです。別のグループを接続するには、先にこのグループを解除してください。",
    "unlinking": "解除中...",
    "unlinkGroup": "グループを解除",
    "howConnect": "接続方法",
    "telegramStep1": "「Telegram グループを接続」をタップします。",
    "telegramStep2": "Telegram が開き、グループを選択します。",
    "telegramStep3": "@{{bot}} をそのグループに追加します。",
    "telegramStep4": "グループが接続されると Bot が確認します。",
    "openingTelegram": "Telegram を開いています...",
    "loading": "読み込み中...",
    "connectTelegram": "Telegram グループを接続",
    "storeBannerHelp": "ストアバナーをアップロード、変更、削除します。",
    "categoryManagementHelp": "カテゴリ、非表示セクション、順序を管理します。",
    "deliveryCompanyHelp": "J&T 料金、VET 料金、チェックアウト配送。",
    "paymentAlerts": "支払い通知",
    "salesReportsHelp": "月ごとの Book と PDF の売上を Google Sheets に同期します。"
  },
  "ko": {
    "pleaseLogin": "먼저 로그인해 주세요",
    "loadCategoriesFailed": "카테고리를 불러오지 못했습니다",
    "createCategoryFailed": "카테고리를 만들지 못했습니다",
    "updateCategoryFailed": "카테고리를 업데이트하지 못했습니다",
    "deleteCategoryFailed": "카테고리를 삭제하지 못했습니다",
    "saveOrderFailed": "카테고리 순서를 저장하지 못했습니다",
    "loadDeliveryFailed": "배송 설정을 불러오지 못했습니다",
    "updateDeliveryFailed": "배송 설정을 업데이트하지 못했습니다",
    "loadTelegramFailed": "Telegram 설정을 불러오지 못했습니다",
    "createTelegramFailed": "Telegram 연결 링크를 만들지 못했습니다",
    "unlinkTelegramFailed": "Telegram 그룹 연결을 해제하지 못했습니다",
    "deliverySaved": "배송비가 저장되었습니다.",
    "saveDeliveryFailed": "배송비를 저장하지 못했습니다.",
    "categoryOrderSaved": "카테고리 순서가 저장되었습니다.",
    "deleteCategoryConfirm": "\"{{name}}\" 카테고리를 삭제할까요?",
    "telegramLinkMissing": "Telegram 연결 링크가 생성되었지만 링크가 없습니다.",
    "openTelegramFailed": "Telegram 연결 링크를 열지 못했습니다.",
    "telegramUnlinked": "Telegram 그룹 연결이 해제되었습니다. 이제 새 그룹을 연결할 수 있습니다.",
    "back": "뒤로",
    "storeBanner": "스토어 배너",
    "telegramBot": "Telegram 봇",
    "salesReports": "판매 보고서",
    "categoryManagement": "카테고리 관리",
    "deliveryCompany": "배송 회사",
    "settings": "설정",
    "createCustomCategory": "사용자 지정 카테고리 만들기",
    "customCategoryHelp": "사용자 지정 카테고리는 최대 5개까지 만들 수 있습니다.",
    "categoryName": "카테고리 이름",
    "categoryLimit": "사용자 지정 카테고리 한도에 도달했습니다",
    "add": "추가",
    "categoryLimitHelp": "사용자 지정 카테고리 한도에 도달했습니다. 새로 만들기 전에 하나를 삭제하세요.",
    "categories": "카테고리",
    "saveOrder": "순서 저장",
    "loadingCategories": "카테고리 불러오는 중...",
    "system": "시스템",
    "hidden": "숨김",
    "soldOut": "품절",
    "save": "저장",
    "cancel": "취소",
    "show": "표시",
    "hide": "숨기기",
    "edit": "편집",
    "delete": "삭제",
    "deliveryFees": "배송비",
    "deliveryFeesHelp": "이 요금은 결제 총액에 추가됩니다.",
    "jntHelp": "J&T Express 인쇄본 배송.",
    "vetHelp": "Virak Buntham Express 배송 옵션.",
    "deliveryFee": "배송비",
    "saving": "저장 중...",
    "saveDelivery": "배송비 저장",
    "receiveTelegram": "Telegram 알림 받기",
    "receiveTelegramHelp": "이 작가 페이지를 하나의 Telegram 그룹에 연결하여 주문 승인 알림을 받습니다. 현재 그룹을 연결 해제한 뒤에만 다른 그룹으로 변경할 수 있습니다.",
    "linkedGroup": "연결된 그룹",
    "telegramGroup": "Telegram 그룹",
    "groupId": "그룹 ID: {{id}}",
    "linkedAt": "연결됨: {{date}}",
    "oneGroupHelp": "이 작가 페이지는 Telegram 그룹 하나만 사용할 수 있습니다. 다른 그룹을 연결하려면 먼저 현재 그룹의 연결을 해제하세요.",
    "unlinking": "연결 해제 중...",
    "unlinkGroup": "그룹 연결 해제",
    "howConnect": "연결 방법",
    "telegramStep1": "Telegram 그룹 연결을 누르세요.",
    "telegramStep2": "Telegram이 열리면 그룹을 선택하세요.",
    "telegramStep3": "@{{bot}}을 해당 그룹에 추가하세요.",
    "telegramStep4": "그룹이 연결되면 봇이 확인합니다.",
    "openingTelegram": "Telegram 여는 중...",
    "loading": "로딩 중...",
    "connectTelegram": "Telegram 그룹 연결",
    "storeBannerHelp": "스토어 배너를 업로드, 변경 또는 제거하세요.",
    "categoryManagementHelp": "카테고리, 숨김 섹션 및 순서를 관리합니다.",
    "deliveryCompanyHelp": "J&T 수수료, VET 수수료 및 결제 배송.",
    "paymentAlerts": "결제 알림",
    "salesReportsHelp": "월별 Book 및 PDF 판매를 Google Sheets에 동기화합니다."
  }
})

function settingsText(key, options) {
  return getDisplayText(`authorPageSettings.${key}`, options)
}

import { SalesReportsSettingsPage } from './SalesReportsSettings'
import AuthorStoreBannerSettings from './AuthorStoreBannerSettings'
import {
  connectSalesReports,
  disconnectSalesReports,
  fetchSalesReportsSettings,
  syncSalesReports,
} from './authorStoreSalesReportsApi'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCategoryForUi(category) {
  return {
    id: category.id,
    name: category.name || '',
    sortOrder: Number(category.sort_order || 0),
    isDefault: Boolean(category.is_default),
    isHidden: Boolean(category.is_hidden),
  }
}

function withSystemCategories(categories) {
  const safeCategories = Array.isArray(categories) ? categories : []
  const hasSoldOut = safeCategories.some((category) => category.name === 'Sold out')

  if (hasSoldOut) return safeCategories

  return [
    ...safeCategories,
    {
      id: 'system-sold-out',
      name: 'Sold out',
      sortOrder: safeCategories.length,
      isDefault: true,
      isHidden: false,
    },
  ]
}

async function fetchMyCategories() {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('loadCategoriesFailed'))
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}

async function createStoreCategory(name) {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('createCategoryFailed'))
  }

  return data.category ? formatCategoryForUi(data.category) : null
}

async function updateStoreCategory(categoryId, updates) {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('updateCategoryFailed'))
  }

  return data.category ? formatCategoryForUi(data.category) : null
}

async function deleteStoreCategory(categoryId) {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('deleteCategoryFailed'))
  }

  return data
}

async function reorderStoreCategories(categoryIds) {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/categories/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ category_ids: categoryIds }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('saveOrderFailed'))
  }

  return Array.isArray(data.categories) ? data.categories.map(formatCategoryForUi) : []
}


async function fetchDeliverySettings() {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/delivery-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('loadDeliveryFailed'))
  }

  return data.delivery_settings || []
}

async function updateDeliverySettings(deliverySettings) {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/delivery-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ delivery_settings: deliverySettings }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('updateDeliveryFailed'))
  }

  return data.delivery_settings || []
}


async function fetchTelegramSettings() {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('loadTelegramFailed'))
  }

  return data.telegram_settings || {}
}

async function createTelegramConnectLink() {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/connect-link`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('createTelegramFailed'))
  }

  return data
}

async function unlinkTelegramGroup() {
  const token = getAuthToken()

  if (!token) throw new Error(settingsText('pleaseLogin'))

  const response = await fetch(`${API_BASE_URL}/api/author-store/me/telegram-settings/unlink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || settingsText('unlinkTelegramFailed'))
  }

  return data.telegram_settings || {}
}

function ToolRow({ icon, label, subtext, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-2.5 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[18px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[var(--shadow-text-primary)]">{label}</span>
        {subtext ? (
          <span className="mt-0.5 block text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
            {subtext}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorPageSettingsPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [settingsView, setSettingsView] = useState('home')

  const [storeCategories, setStoreCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState('')

  const [telegramBotUsername, setTelegramBotUsername] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')
  const [telegramChatTitle, setTelegramChatTitle] = useState('')
  const [telegramLinkedAt, setTelegramLinkedAt] = useState('')
  const [telegramConnecting, setTelegramConnecting] = useState(false)
  const [telegramUnlinking, setTelegramUnlinking] = useState(false)
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramMessage, setTelegramMessage] = useState('')
  const [jtDeliveryFee, setJtDeliveryFee] = useState('2')
const [vetDeliveryFee, setVetDeliveryFee] = useState('2')
const [deliverySaving, setDeliverySaving] = useState(false)
const [deliveryLoading, setDeliveryLoading] = useState(false)
const [deliveryMessage, setDeliveryMessage] = useState('')

  const customCategoryCount = storeCategories.filter((category) => !category.isDefault).length
  const canCreateCustomCategory = customCategoryCount < 5

  useEffect(() => {
    let ignore = false

    async function loadTelegramSettings() {
      try {
        setTelegramLoading(true)

        const settings = await fetchTelegramSettings()

        if (!ignore) {
          setTelegramBotUsername(settings.bot_username || '')
          setTelegramChatId(settings.chat_id || '')
          setTelegramChatTitle(settings.chat_title || '')
          setTelegramLinkedAt(settings.linked_at || '')
        }
      } catch {
      } finally {
        if (!ignore) setTelegramLoading(false)
      }
    }

    loadTelegramSettings()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadCategories() {
      try {
        setCategoryLoading(true)
        setCategoryError('')

        const categories = await fetchMyCategories()

        if (!ignore) {
          setStoreCategories(categories)
        }
      } catch (error) {
        if (!ignore) {
          setCategoryError(error.message || settingsText('loadCategoriesFailed'))
        }
      } finally {
        if (!ignore) setCategoryLoading(false)
      }
    }

    loadCategories()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
  
    async function loadDeliverySettings() {
      try {
        setDeliveryLoading(true)
  
        const settings = await fetchDeliverySettings()
        const jnt = settings.find((item) => item.company_key === 'jnt')
        const vet = settings.find((item) => item.company_key === 'vet')
  
        if (!ignore) {
          setJtDeliveryFee(String(jnt?.fee_usd ?? 2))
          setVetDeliveryFee(String(vet?.fee_usd ?? 2))
        }
      } catch {
      } finally {
        if (!ignore) setDeliveryLoading(false)
      }
    }
  
    loadDeliverySettings()
  
    return () => {
      ignore = true
    }
  }, [])

  async function handleSaveDeliveryFees() {
    try {
      setDeliverySaving(true)
      setDeliveryMessage('')
  
      const settings = await updateDeliverySettings([
        { company_key: 'jnt', fee_usd: Number(jtDeliveryFee || 0) },
        { company_key: 'vet', fee_usd: Number(vetDeliveryFee || 0) },
      ])
  
      const jnt = settings.find((item) => item.company_key === 'jnt')
      const vet = settings.find((item) => item.company_key === 'vet')
  
      setJtDeliveryFee(String(jnt?.fee_usd ?? jtDeliveryFee))
      setVetDeliveryFee(String(vet?.fee_usd ?? vetDeliveryFee))
      setDeliveryMessage(settingsText('deliverySaved'))
    } catch (error) {
      setDeliveryMessage(error.message || settingsText('saveDeliveryFailed'))
    } finally {
      setDeliverySaving(false)
    }
  }

  async function addCategory() {
    const name = newCategory.trim()

    if (!name || categorySaving || !canCreateCustomCategory) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const category = await createStoreCategory(name)

      if (category) {
        setStoreCategories((current) => [...current, category])
      }

      setNewCategory('')
    } catch (error) {
      setCategoryError(error.message || settingsText('createCategoryFailed'))
    } finally {
      setCategorySaving(false)
    }
  }

  function startEditCategory(category) {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  function cancelEditCategory() {
    setEditingCategoryId('')
    setEditingCategoryName('')
  }

  async function saveEditCategory(category) {
    const name = editingCategoryName.trim()

   if (!name || categorySaving || category.name === 'Sold out') return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const updated = await updateStoreCategory(category.id, { name })

      if (updated) {
        setStoreCategories((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )
      }

      cancelEditCategory()
    } catch (error) {
      setCategoryError(error.message || settingsText('updateCategoryFailed'))
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleDeleteCategory(category) {
    if (category.isDefault || categorySaving) return

    const confirmed = window.confirm(settingsText('deleteCategoryConfirm', { name: category.name }))
    if (!confirmed) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      await deleteStoreCategory(category.id)

      setStoreCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (error) {
      setCategoryError(error.message || settingsText('deleteCategoryFailed'))
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleToggleHideCategory(category) {
    if (categorySaving) return

    try {
      setCategorySaving(true)
      setCategoryError('')

      const updated = await updateStoreCategory(category.id, {
        is_hidden: !category.isHidden,
      })

      if (updated) {
        setStoreCategories((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    } catch (error) {
      setCategoryError(error.message || settingsText('updateCategoryFailed'))
    } finally {
      setCategorySaving(false)
    }
  }

  function moveCategory(index, direction) {
    setStoreCategories((current) => {
      const next = [...current]
      const targetIndex = index + direction

      if (targetIndex < 0 || targetIndex >= next.length) return current

      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)

      return next
    })
  }

  async function saveCategoryOrder() {
    try {
      setCategorySaving(true)
      setCategoryError('')

      const ids = storeCategories
        .filter((category) => !String(category.id).startsWith('system-'))
        .map((category) => category.id)

      const categories = await reorderStoreCategories(ids)

      setStoreCategories(categories)
      setMessage(settingsText('categoryOrderSaved'))
      setSettingsView('home')
    } catch (error) {
      setCategoryError(error.message || settingsText('saveOrderFailed'))
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleCreateTelegramConnectLink() {
    try {
      setTelegramConnecting(true)
      setTelegramMessage('')

      const data = await createTelegramConnectLink()
      const settings = data.telegram_settings || {}
      const connectUrl = data.telegram_connect?.connect_url || ''

      setTelegramBotUsername(settings.bot_username || telegramBotUsername)
      setTelegramChatId(settings.chat_id || telegramChatId)
      setTelegramChatTitle(settings.chat_title || telegramChatTitle)
      setTelegramLinkedAt(settings.linked_at || telegramLinkedAt)

      if (connectUrl) {
        window.location.href = connectUrl
        return
      }

      setTelegramMessage(settingsText('telegramLinkMissing'))
    } catch (error) {
      setTelegramMessage(error.message || settingsText('openTelegramFailed'))
    } finally {
      setTelegramConnecting(false)
    }
  }

  async function handleUnlinkTelegramGroup() {
    try {
      setTelegramUnlinking(true)
      setTelegramMessage('')

      const settings = await unlinkTelegramGroup()

      setTelegramBotUsername(settings.bot_username || telegramBotUsername)
      setTelegramChatId(settings.chat_id || '')
      setTelegramChatTitle(settings.chat_title || '')
      setTelegramLinkedAt(settings.linked_at || '')
      setTelegramMessage(settingsText('telegramUnlinked'))
    } catch (error) {
      setTelegramMessage(error.message || settingsText('unlinkTelegramFailed'))
    } finally {
      setTelegramUnlinking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => {
              if (settingsView !== 'home') {
                setSettingsView('home')
                return
              }

              navigate(-1)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={settingsText('back')}
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
            {settingsView === 'banner'
  ? settingsText('storeBanner')
  : settingsView === 'telegram'
    ? settingsText('telegramBot')
              : settingsView === 'sales-reports'
                ? settingsText('salesReports')
                : settingsView === 'categories'
                  ? settingsText('categoryManagement')
                  : settingsView === 'delivery'
                    ? settingsText('deliveryCompany')
                    : settingsText('settings')}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 py-4">
        {settingsView === 'banner' ? (
  <AuthorStoreBannerSettings onBack={() => setSettingsView('home')} />
) : settingsView === 'categories' ? (
          <section className="space-y-4">
            <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">
                    {settingsText('createCustomCategory')}
                  </h2>
                  <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
                    {settingsText('customCategoryHelp')}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[var(--shadow-bg-hover)] px-3 py-1.5 text-[11px] font-black text-[var(--shadow-text-primary)]">
                  {customCategoryCount}/5
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder={canCreateCustomCategory ? settingsText('categoryName') : settingsText('categoryLimit')}
                  disabled={!canCreateCustomCategory}
                  className="h-11 min-w-0 flex-1 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[#111827] disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={addCategory}
                  disabled={categorySaving || !newCategory.trim() || !canCreateCustomCategory}
                  className="h-11 shrink-0 rounded-2xl bg-[#111827] px-4 text-[12px] font-black text-white disabled:opacity-40"
                >
                  {settingsText('add')}
                </button>
              </div>

              {!canCreateCustomCategory ? (
                <p className="mt-2 text-[11px] font-bold text-[#e5484d]">
                  {settingsText('categoryLimitHelp')}
                </p>
              ) : null}
            </section>

            <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{settingsText('categories')}</h2>

                <button
                  type="button"
                  onClick={saveCategoryOrder}
                  disabled={categorySaving || !storeCategories.length}
                  className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
                >
                  {settingsText('saveOrder')}
                </button>
              </div>

              {categoryError ? (
                <button
                  type="button"
                  onClick={() => setCategoryError('')}
                  className="mb-3 w-full rounded-2xl bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
                >
                  {categoryError}
                </button>
              ) : null}

              {categoryLoading ? (
                <div className="rounded-2xl bg-[var(--shadow-bg-soft)] p-6 text-center text-[12px] font-bold text-[var(--shadow-text-tertiary)] ring-1 ring-[var(--shadow-border)]">
                  {settingsText('loadingCategories')}
                </div>
              ) : (
                <div className="space-y-2">
                  {withSystemCategories(storeCategories).map((category, index, list) => {
                    const editing = editingCategoryId === category.id
                    const isSystem = String(category.id).startsWith('system-')
                    const canEdit = category.name !== 'Sold out' && !isSystem
                    const menuOpen = openCategoryMenuId === category.id

                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl bg-[var(--shadow-bg-soft)] px-3 py-3 ring-1 ring-[var(--shadow-border)]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            {editing ? (
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(event) => setEditingCategoryName(event.target.value)}
                                className="h-10 w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 text-[13px] font-black text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
                              />
                            ) : (
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="truncate text-[13px] font-black text-[var(--shadow-text-primary)]">
                                  {category.name === 'Sold out' ? settingsText('soldOut') : category.name}
                                </span>

                                {category.isDefault || isSystem ? (
                                  <span className="shrink-0 rounded-full bg-[var(--shadow-bg-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--shadow-text-secondary)]">
                                    {settingsText('system')}
                                  </span>
                                ) : null}

                                {category.isHidden ? (
                                  <span className="shrink-0 rounded-full bg-[#fff1f2] px-2 py-0.5 text-[9px] font-black text-[#b91c1c]">
                                    {settingsText('hidden')}
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>

                          {editing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEditCategory(category)}
                                disabled={categorySaving}
                                className="h-9 rounded-xl bg-[#111827] px-3 text-[11px] font-black text-white disabled:opacity-50"
                              >
                                {settingsText('save')}
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditCategory}
                                className="h-9 rounded-xl bg-[var(--shadow-bg-surface)] px-3 text-[11px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]"
                              >
                                {settingsText('cancel')}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => moveCategory(index, -1)}
                                disabled={index === 0 || categorySaving}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] disabled:opacity-30"
                              >
                                <i className="fa-solid fa-arrow-up text-[11px]" />
                              </button>

                              <button
                                type="button"
                                onClick={() => moveCategory(index, 1)}
                                disabled={index === list.length - 1 || categorySaving}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] disabled:opacity-30"
                              >
                                <i className="fa-solid fa-arrow-down text-[11px]" />
                              </button>
<div className="relative">
  <button
    type="button"
    onClick={() => setOpenCategoryMenuId(menuOpen ? '' : category.id)}
    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] active:scale-95"
  >
    <i className="fa-solid fa-ellipsis text-[12px]" />
  </button>

  {menuOpen ? (
    <div className="absolute right-0 top-10 z-30 w-32 overflow-hidden rounded-2xl bg-[var(--shadow-bg-surface)] py-1 shadow-xl ring-1 ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={() => {
          setOpenCategoryMenuId('')
          handleToggleHideCategory(category)
        }}
        disabled={categorySaving || isSystem}
        className="block w-full px-3 py-2 text-left text-[12px] font-black text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-soft)] disabled:opacity-40"
      >
        {category.isHidden ? settingsText('show') : settingsText('hide')}
      </button>

      {canEdit ? (
        <button
          type="button"
          onClick={() => {
            setOpenCategoryMenuId('')
            startEditCategory(category)
          }}
          className="block w-full px-3 py-2 text-left text-[12px] font-black text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-soft)]"
        >
          {settingsText('edit')}
        </button>
      ) : null}

      {canEdit ? (
        <button
          type="button"
          onClick={() => {
            setOpenCategoryMenuId('')
            handleDeleteCategory(category)
          }}
          disabled={categorySaving}
          className="block w-full px-3 py-2 text-left text-[12px] font-black text-[#e5484d] hover:bg-[#fff1f1] disabled:opacity-40"
        >
          {settingsText('delete')}
        </button>
      ) : null}
    </div>
  ) : null}
</div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </section>


      ) : settingsView === 'delivery' ? (
  <section className="space-y-4">
    <section className="overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="px-4 pb-2 pt-4">
        <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{settingsText('deliveryFees')}</h2>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
          {settingsText('deliveryFeesHelp')}
        </p>
      </div>

      {deliveryMessage ? (
        <button
          type="button"
          onClick={() => setDeliveryMessage('')}
          className="mx-4 mb-3 w-[calc(100%-2rem)] rounded-2xl bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]"
        >
          {deliveryMessage}
        </button>
      ) : null}

      <div className="px-4 py-4">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]">
            <span className="text-[14px] font-black text-[#ef4444]">J&T</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-black text-[var(--shadow-text-primary)]">J&T</h3>
                <p className="mt-0.5 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {settingsText('jntHelp')}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#fff4cc] px-3 py-1 text-[11px] font-black text-[var(--shadow-text-primary)]">
                ${Number(jtDeliveryFee || 0).toFixed(2)}
              </span>
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
                {settingsText('deliveryFee')}
              </label>
              <input
                type="number"
                value={jtDeliveryFee}
                onChange={(event) => setJtDeliveryFee(event.target.value)}
                placeholder="2.00"
                className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3.5 text-[14px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-[var(--shadow-bg-soft)]" />

      <div className="px-4 py-4">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]">
            <span className="text-[13px] font-black text-[#f97316]">VET</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-black text-[var(--shadow-text-primary)]">VET</h3>
                <p className="mt-0.5 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {settingsText('vetHelp')}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#fff4cc] px-3 py-1 text-[11px] font-black text-[var(--shadow-text-primary)]">
                ${Number(vetDeliveryFee || 0).toFixed(2)}
              </span>
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
                {settingsText('deliveryFee')}
              </label>
              <input
                type="number"
                value={vetDeliveryFee}
                onChange={(event) => setVetDeliveryFee(event.target.value)}
                placeholder="2.00"
                className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3.5 text-[14px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[#111827]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <button
      type="button"
      onClick={handleSaveDeliveryFees}
      disabled={deliverySaving || deliveryLoading}
      className="h-12 w-full rounded-2xl bg-[#111827] text-[13px] font-black text-white active:scale-[0.98] disabled:opacity-50"
    >
      {deliverySaving ? settingsText('saving') : settingsText('saveDelivery')}
    </button>
  </section>

      ) : settingsView === 'sales-reports' ? (
        <SalesReportsSettingsPage
          open={settingsView === 'sales-reports'}
          onBack={() => setSettingsView('home')}
          fetchSettings={fetchSalesReportsSettings}
          connectSheet={connectSalesReports}
          syncSheet={syncSalesReports}
          disconnectSheet={disconnectSalesReports}
        />
      ) : settingsView === 'telegram' ? (
          <section className="overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="bg-[var(--shadow-bg-soft)] px-4 py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--shadow-bg-surface)] text-[#229ed9] shadow-sm ring-1 ring-[var(--shadow-border)]">
                <i className="fa-brands fa-telegram text-[30px]" />
              </div>

              <h2 className="mt-3 text-[17px] font-black text-[var(--shadow-text-primary)]">
                {settingsText('receiveTelegram')}
              </h2>

              <p className="mx-auto mt-1 max-w-[380px] text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {settingsText('receiveTelegramHelp')}
              </p>
            </div>

            <div className="space-y-4 p-4">
              {telegramMessage ? (
                <button
                  type="button"
                  onClick={() => setTelegramMessage('')}
                  className="w-full rounded-2xl bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]"
                >
                  {telegramMessage}
                </button>
              ) : null}

              {telegramChatId ? (
                <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f7ff] text-[#229ed9] ring-1 ring-[#229ed9]/20">
                      <i className="fa-brands fa-telegram text-[22px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">
                        {settingsText('linkedGroup')}
                      </div>

                      <div className="mt-1 truncate text-[16px] font-black text-[var(--shadow-text-primary)]">
                        {telegramChatTitle || settingsText('telegramGroup')}
                      </div>

                      <div className="mt-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                        {settingsText('groupId', { id: telegramChatId })}
                      </div>

                      {telegramLinkedAt ? (
                        <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                          {settingsText('linkedAt', { date: new Date(telegramLinkedAt).toLocaleString(getDisplayLanguageId()) })}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[var(--shadow-bg-soft)] px-4 py-3 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {settingsText('oneGroupHelp')}
                  </div>

                  <button
                    type="button"
                    onClick={handleUnlinkTelegramGroup}
                    disabled={telegramUnlinking || telegramLoading}
                    className="mt-4 h-12 w-full rounded-full bg-[#fff1f2] text-[13px] font-black text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-60"
                  >
                    {telegramUnlinking ? settingsText('unlinking') : settingsText('unlinkGroup')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] p-4">
                    <div className="text-[12px] font-black text-[var(--shadow-text-primary)]">
                      {settingsText('howConnect')}
                    </div>

                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                      <li>{settingsText('telegramStep1')}</li>
                      <li>{settingsText('telegramStep2')}</li>
                      <li>{settingsText('telegramStep3', { bot: telegramBotUsername || 'ShadowAuthorStoreNotifyBot' })}</li>
                      <li>{settingsText('telegramStep4')}</li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateTelegramConnectLink}
                    disabled={telegramConnecting || telegramLoading}
                    className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[var(--shadow-border-strong)]"
                  >
                    {telegramConnecting
                      ? settingsText('openingTelegram')
                      : telegramLoading
                        ? settingsText('loading')
                        : settingsText('connectTelegram')}
                  </button>
                </>
              )}
            </div>
          </section>
        ) : (
          <>
            {message ? (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="mb-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
              >
                {message}
              </button>
            ) : null}

            <section className="overflow-hidden rounded-[26px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
  <ToolRow
    icon="fa-regular fa-image"
    label={settingsText('storeBanner')}
    subtext={settingsText('storeBannerHelp')}
    onClick={() => setSettingsView('banner')}
  />

  <div className="mx-3 h-px bg-[var(--shadow-bg-soft)]" />

  <ToolRow
    icon="fa-solid fa-layer-group"
    label={settingsText('categoryManagement')}
                subtext={settingsText('categoryManagementHelp')}
                onClick={() => setSettingsView('categories')}
              />

              <ToolRow
                icon="fa-solid fa-truck-fast"
                label={settingsText('deliveryCompany')}
                subtext={settingsText('deliveryCompanyHelp')}
                onClick={() => setSettingsView('delivery')}
              />
            </section>

            <div className="mt-6 px-1 text-[18px] font-semibold text-[var(--shadow-text-tertiary)]">
              {settingsText('paymentAlerts')}
            </div>

            <section className="mt-3 overflow-hidden rounded-[20px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">

              <ToolRow
                icon="fa-solid fa-file-excel"
                label={settingsText('salesReports')}
                subtext={settingsText('salesReportsHelp')}
                onClick={() => setSettingsView('sales-reports')}
              />

              <div className="mx-3 h-px bg-[var(--shadow-bg-soft)]" />

              <ToolRow
                icon="fa-regular fa-paper-plane"
                label={settingsText('telegramBot')}
                subtext=""
                onClick={() => setSettingsView('telegram')}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}
