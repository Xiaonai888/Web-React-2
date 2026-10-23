import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'


registerTranslationNamespace('salesReportsSettings', {
  "en": {
    "menuTitle": "Sales Reports",
    "menuSubtitle": "Sync monthly Book and PDF sales to Google Sheets.",
    "notSynced": "Not synced yet",
    "statusConnected": "Google Sheet is connected",
    "statusLoading": "Loading connection...",
    "statusError": "Connection needs attention",
    "statusMissing": "No Google Sheet connected",
    "helpTitle": "How to Use Sales Reports",
    "helpGuideTitle": "Sales Reports Guide",
    "helpIntro": "Learn how to connect Google Sheets and sync your monthly Book and PDF sales reports.",
    "helpBack": "Back to Sales Reports",
    "helpEditor": "Editor access is required. Without it, Shadow cannot create or update your reports.",
    "helpTrouble": "Having trouble connecting? Check the Google Sheet link, confirm that the Sheet is shared with the Shadow email, and make sure the permission is set to Editor.",
    "copyright": "All rights reserved by Shadow.",
    "step1title": "Create a Google Sheet",
    "step1body": "Create a new Google Sheet for receiving your sales reports from Shadow. You may use any spreadsheet name.",
    "step2title": "Share the Sheet with Shadow",
    "step2body": "Open Share in Google Sheets, enter the Shadow email shown on the Sales Reports page, and set the permission to Editor.",
    "step3title": "Copy the Google Sheet Link",
    "step3body": "Copy the Google Sheet link and paste it into the Google Sheet link field.",
    "step4title": "Connect the Google Sheet",
    "step4body": "Tap Connect Google Sheet. Shadow will verify that the link is valid and that it has permission to edit the Sheet.",
    "step5title": "Sync Your Reports",
    "step5body": "After the connection is successful, tap Sync Now to send your sales data to Google Sheets.",
    "step6title": "What Shadow Creates",
    "step6body": "Shadow creates one tab for each month, keeps Monthly Summary updated, and updates orders, cancellations, and refunds without duplicate rows.",
    "step7title": "Disconnecting Google Sheet",
    "step7body": "Disconnecting stops future report syncing. Existing data in your Google Sheet will not be deleted.",
    "pageSubtitle": "Monthly Google Sheet sales reports.",
    "back": "Back",
    "openGuide": "Open Sales Reports guide",
    "sheetTitle": "Google Sheets",
    "serverNotConfigured": "Sales Reports is not configured on the server.",
    "stepShare": "Step 1 — Share your Sheet",
    "shareHelp": "Create one Google Spreadsheet and share it with this Shadow account as Editor.",
    "emailLoading": "Loading Shadow Google email...",
    "copyEmail": "Copy Shadow email",
    "stepPaste": "Step 2 — Paste Google Sheet link",
    "connecting": "Connecting...",
    "connectTest": "Connect & Test",
    "reconnectTest": "Reconnect & Test",
    "sheet": "Sheet",
    "lastSync": "Last Sync",
    "syncing": "Syncing...",
    "syncNow": "Sync now",
    "openSheet": "Open Sheet",
    "disconnecting": "Disconnecting...",
    "disconnect": "Disconnect Google Sheet",
    "disclaimer": "Shadow creates one tab for each paid month and keeps Monthly Summary updated. Disconnecting does not delete existing Google Sheet data.",
    "enterLink": "Please paste your Google Sheet link.",
    "invalidLink": "Please enter a valid Google Sheets link.",
    "copied": "Shadow Google email copied.",
    "copyFailed": "Copy failed. Please copy the email manually.",
    "connectedMessage": "Google Sheet connected. Tap Sync now to send this month’s sales.",
    "connectFailed": "Failed to connect Google Sheet.",
    "loadFailed": "Failed to load Sales Reports settings.",
    "syncFailed": "Failed to sync Sales Reports.",
    "disconnectFailed": "Failed to disconnect Google Sheet.",
    "disconnectedMessage": "Google Sheet disconnected. Existing Sheet data was not deleted.",
    "syncResult": "Sync complete: {{appended}} new, {{updated}} updated, {{moved}} moved, {{removed}} removed.",
    "refresh": "Refresh connection",
    "refreshing": "Refreshing...",
    "refreshFailed": "Failed to refresh Sales Reports.",
    "syncErrorHelp": "You can retry Sync or reconnect the Sheet.",
    "otherStatus": "Not connected"
  },
  "km": {
    "menuTitle": "របាយការណ៍លក់",
    "menuSubtitle": "ធ្វើសមកាលកម្មការលក់សៀវភៅ និង PDF ប្រចាំខែទៅ Google Sheets។",
    "notSynced": "មិនទាន់ធ្វើសមកាលកម្ម",
    "statusConnected": "បានភ្ជាប់ Google Sheet",
    "statusLoading": "កំពុងផ្ទុកការភ្ជាប់...",
    "statusError": "ការភ្ជាប់ត្រូវការការពិនិត្យ",
    "statusMissing": "មិនទាន់ភ្ជាប់ Google Sheet",
    "helpTitle": "របៀបប្រើរបាយការណ៍លក់",
    "helpGuideTitle": "ការណែនាំរបាយការណ៍លក់",
    "helpIntro": "ស្វែងយល់ពីរបៀបភ្ជាប់ Google Sheets និងធ្វើសមកាលកម្មរបាយការណ៍លក់សៀវភៅ និង PDF ប្រចាំខែ។",
    "helpBack": "ត្រឡប់ទៅរបាយការណ៍លក់",
    "helpEditor": "ត្រូវផ្តល់សិទ្ធិ Editor ដើម្បីឱ្យ Shadow អាចបង្កើត និងកែប្រែរបាយការណ៍បាន។",
    "helpTrouble": "បើភ្ជាប់មិនបាន សូមពិនិត្យតំណ Google Sheet អ៊ីមែល Shadow និងសិទ្ធិ Editor។",
    "copyright": "រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ Shadow។",
    "step1title": "បង្កើត Google Sheet",
    "step1body": "បង្កើត Google Sheet ថ្មីសម្រាប់ទទួលរបាយការណ៍លក់ពី Shadow។ អ្នកអាចដាក់ឈ្មោះបានតាមចិត្ត។",
    "step2title": "ចែករំលែក Sheet ជាមួយ Shadow",
    "step2body": "បើក Share ក្នុង Google Sheets បញ្ចូលអ៊ីមែល Shadow ដែលបង្ហាញលើទំព័រ ហើយជ្រើសសិទ្ធិ Editor។",
    "step3title": "ចម្លងតំណ Google Sheet",
    "step3body": "ចម្លងតំណ Google Sheet រួចបិទភ្ជាប់ក្នុងប្រអប់តំណ។",
    "step4title": "ភ្ជាប់ Google Sheet",
    "step4body": "ចុច Connect Google Sheet ដើម្បីផ្ទៀងផ្ទាត់តំណ និងសិទ្ធិកែប្រែរបស់ Shadow។",
    "step5title": "ធ្វើសមកាលកម្មរបាយការណ៍",
    "step5body": "ក្រោយភ្ជាប់ជោគជ័យ ចុច Sync now ដើម្បីផ្ញើទិន្នន័យលក់ទៅ Google Sheets។",
    "step6title": "អ្វីដែល Shadow បង្កើត",
    "step6body": "Shadow បង្កើត Tab ប្រចាំខែ និងធ្វើបច្ចុប្បន្នភាព Monthly Summary ការបញ្ជាទិញ ការលុប និងការសងប្រាក់ ដោយមិនស្ទួនជួរ។",
    "step7title": "ផ្តាច់ការភ្ជាប់ Google Sheet",
    "step7body": "ការផ្តាច់នឹងបញ្ឈប់ការធ្វើសមកាលកម្មបន្ទាប់ ប៉ុន្តែមិនលុបទិន្នន័យក្នុង Sheet ចាស់ទេ។",
    "pageSubtitle": "របាយការណ៍លក់ប្រចាំខែតាម Google Sheets។",
    "back": "ត្រឡប់ក្រោយ",
    "openGuide": "បើកការណែនាំរបាយការណ៍លក់",
    "sheetTitle": "Google Sheets",
    "serverNotConfigured": "Server មិនទាន់កំណត់ Sales Reports។",
    "stepShare": "ជំហានទី ១ — ចែករំលែក Sheet",
    "shareHelp": "បង្កើត Google Spreadsheet ហើយចែករំលែកទៅគណនី Shadow នេះដោយផ្តល់សិទ្ធិ Editor។",
    "emailLoading": "កំពុងផ្ទុកអ៊ីមែល Shadow...",
    "copyEmail": "ចម្លងអ៊ីមែល Shadow",
    "stepPaste": "ជំហានទី ២ — បិទភ្ជាប់តំណ Google Sheet",
    "connecting": "កំពុងភ្ជាប់...",
    "connectTest": "ភ្ជាប់ និងសាកល្បង",
    "reconnectTest": "ភ្ជាប់ឡើងវិញ និងសាកល្បង",
    "sheet": "Sheet",
    "lastSync": "សមកាលកម្មចុងក្រោយ",
    "syncing": "កំពុងសមកាលកម្ម...",
    "syncNow": "សមកាលកម្មឥឡូវ",
    "openSheet": "បើក Sheet",
    "disconnecting": "កំពុងផ្តាច់...",
    "disconnect": "ផ្តាច់ Google Sheet",
    "disclaimer": "Shadow បង្កើត Tab សម្រាប់ខែនីមួយៗដែលបានបង់ប្រាក់ និងធ្វើបច្ចុប្បន្នភាព Monthly Summary។ ការផ្តាច់មិនលុបទិន្នន័យចាស់ទេ។",
    "enterLink": "សូមបិទភ្ជាប់តំណ Google Sheet។",
    "invalidLink": "សូមបញ្ចូលតំណ Google Sheets ដែលត្រឹមត្រូវ។",
    "copied": "បានចម្លងអ៊ីមែល Shadow។",
    "copyFailed": "មិនអាចចម្លងបាន។ សូមចម្លងអ៊ីមែលដោយផ្ទាល់។",
    "connectedMessage": "បានភ្ជាប់ Google Sheet។ ចុច Sync now ដើម្បីផ្ញើការលក់ខែនេះ។",
    "connectFailed": "ភ្ជាប់ Google Sheet បរាជ័យ។",
    "loadFailed": "ផ្ទុកការកំណត់របាយការណ៍លក់បរាជ័យ។",
    "syncFailed": "ធ្វើសមកាលកម្មរបាយការណ៍លក់បរាជ័យ។",
    "disconnectFailed": "ផ្តាច់ Google Sheet បរាជ័យ។",
    "disconnectedMessage": "បានផ្តាច់ Google Sheet។ ទិន្នន័យក្នុង Sheet ចាស់មិនត្រូវបានលុបទេ។",
    "syncResult": "ធ្វើសមកាលកម្មរួច៖ ថ្មី {{appended}}, កែប្រែ {{updated}}, ផ្លាស់ទី {{moved}}, លុប {{removed}}។",
    "refresh": "ផ្ទុកការភ្ជាប់ឡើងវិញ",
    "refreshing": "កំពុងផ្ទុកឡើងវិញ...",
    "refreshFailed": "ផ្ទុករបាយការណ៍លក់ឡើងវិញបរាជ័យ។",
    "syncErrorHelp": "អ្នកអាចសាកល្បង Sync ឡើងវិញ ឬភ្ជាប់ Sheet ឡើងវិញ។",
    "otherStatus": "មិនទាន់ភ្ជាប់"
  },
  "zh": {
    "menuTitle": "销售报表",
    "menuSubtitle": "将每月图书和 PDF 销售同步至 Google Sheets。",
    "notSynced": "尚未同步",
    "statusConnected": "Google Sheet 已连接",
    "statusLoading": "正在加载连接...",
    "statusError": "连接需要检查",
    "statusMissing": "尚未连接 Google Sheet",
    "helpTitle": "如何使用销售报表",
    "helpGuideTitle": "销售报表指南",
    "helpIntro": "了解如何连接 Google Sheets 并同步每月图书与 PDF 销售报表。",
    "helpBack": "返回销售报表",
    "helpEditor": "需要 Editor 权限，否则 Shadow 无法创建或更新报表。",
    "helpTrouble": "无法连接？请检查 Google Sheet 链接、Shadow 邮箱及 Editor 权限。",
    "copyright": "Shadow 版权所有。",
    "step1title": "创建 Google Sheet",
    "step1body": "新建一个 Google Sheet 来接收 Shadow 销售报表，名称可自定。",
    "step2title": "与 Shadow 共享",
    "step2body": "打开 Google Sheets 的共享，输入页面显示的 Shadow 邮箱并授予 Editor 权限。",
    "step3title": "复制链接",
    "step3body": "复制 Google Sheet 链接并粘贴到输入框。",
    "step4title": "连接 Google Sheet",
    "step4body": "点击连接，Shadow 将验证链接及编辑权限。",
    "step5title": "同步报表",
    "step5body": "连接成功后点击立即同步，将销售数据发送至 Google Sheets。",
    "step6title": "Shadow 创建的内容",
    "step6body": "Shadow 按月创建标签页，更新月度汇总、订单、取消与退款，不会产生重复行。",
    "step7title": "断开连接",
    "step7body": "断开后停止后续同步，但不会删除 Google Sheet 中的现有数据。",
    "pageSubtitle": "Google Sheets 月度销售报表。",
    "back": "返回",
    "openGuide": "打开销售报表指南",
    "sheetTitle": "Google Sheets",
    "serverNotConfigured": "服务器尚未配置销售报表。",
    "stepShare": "第 1 步 — 共享表格",
    "shareHelp": "创建 Google Spreadsheet 并授予此 Shadow 账号 Editor 权限。",
    "emailLoading": "正在加载 Shadow 邮箱...",
    "copyEmail": "复制 Shadow 邮箱",
    "stepPaste": "第 2 步 — 粘贴 Google Sheet 链接",
    "connecting": "连接中...",
    "connectTest": "连接并测试",
    "reconnectTest": "重新连接并测试",
    "sheet": "表格",
    "lastSync": "上次同步",
    "syncing": "同步中...",
    "syncNow": "立即同步",
    "openSheet": "打开表格",
    "disconnecting": "断开中...",
    "disconnect": "断开 Google Sheet",
    "disclaimer": "Shadow 为每个付费月份创建标签页并更新月度汇总。断开连接不会删除现有数据。",
    "enterLink": "请粘贴 Google Sheet 链接。",
    "invalidLink": "请输入有效的 Google Sheets 链接。",
    "copied": "Shadow 邮箱已复制。",
    "copyFailed": "复制失败，请手动复制。",
    "connectedMessage": "Google Sheet 已连接。点击立即同步以发送本月销售数据。",
    "connectFailed": "连接 Google Sheet 失败。",
    "loadFailed": "加载销售报表设置失败。",
    "syncFailed": "同步销售报表失败。",
    "disconnectFailed": "断开 Google Sheet 失败。",
    "disconnectedMessage": "Google Sheet 已断开，现有数据未被删除。",
    "syncResult": "同步完成：新增 {{appended}}，更新 {{updated}}，移动 {{moved}}，删除 {{removed}}。",
    "refresh": "刷新连接",
    "refreshing": "刷新中...",
    "refreshFailed": "刷新销售报表失败。",
    "syncErrorHelp": "可重试同步或重新连接表格。",
    "otherStatus": "未连接"
  },
  "ja": {
    "menuTitle": "売上レポート",
    "menuSubtitle": "毎月の書籍と PDF の売上を Google Sheets に同期します。",
    "notSynced": "未同期",
    "statusConnected": "Google Sheet に接続済み",
    "statusLoading": "接続を読み込み中...",
    "statusError": "接続の確認が必要です",
    "statusMissing": "Google Sheet は未接続です",
    "helpTitle": "売上レポートの使い方",
    "helpGuideTitle": "売上レポートガイド",
    "helpIntro": "Google Sheets の接続と毎月の書籍・PDF 売上の同期方法を説明します。",
    "helpBack": "売上レポートに戻る",
    "helpEditor": "Editor 権限が必要です。権限がないと Shadow はレポートを更新できません。",
    "helpTrouble": "接続できない場合はリンク、Shadow のメール、Editor 権限を確認してください。",
    "copyright": "© Shadow. All rights reserved.",
    "step1title": "Google Sheet を作成",
    "step1body": "Shadow の売上レポートを受け取る Google Sheet を作成します。名前は自由です。",
    "step2title": "Shadow と共有",
    "step2body": "共有画面で Shadow のメールアドレスを追加し、Editor 権限を設定します。",
    "step3title": "リンクをコピー",
    "step3body": "Google Sheet のリンクをコピーし、入力欄に貼り付けます。",
    "step4title": "Google Sheet に接続",
    "step4body": "接続ボタンを押し、リンクと編集権限を確認します。",
    "step5title": "レポートを同期",
    "step5body": "接続できたら今すぐ同期を押して売上データを送信します。",
    "step6title": "Shadow が作成する内容",
    "step6body": "月別タブと月次集計を更新し、注文・キャンセル・返金を重複行なしで反映します。",
    "step7title": "接続を解除",
    "step7body": "今後の同期は停止しますが、既存の Google Sheet データは削除されません。",
    "pageSubtitle": "Google Sheets の月次売上レポート。",
    "back": "戻る",
    "openGuide": "売上レポートガイドを開く",
    "sheetTitle": "Google Sheets",
    "serverNotConfigured": "サーバーで売上レポートが設定されていません。",
    "stepShare": "ステップ 1 — シートを共有",
    "shareHelp": "Google Spreadsheet を作成し、Shadow に Editor 権限を付与してください。",
    "emailLoading": "Shadow のメールを読み込み中...",
    "copyEmail": "Shadow のメールをコピー",
    "stepPaste": "ステップ 2 — Google Sheet のリンクを貼る",
    "connecting": "接続中...",
    "connectTest": "接続して確認",
    "reconnectTest": "再接続して確認",
    "sheet": "シート",
    "lastSync": "最終同期",
    "syncing": "同期中...",
    "syncNow": "今すぐ同期",
    "openSheet": "シートを開く",
    "disconnecting": "解除中...",
    "disconnect": "Google Sheet の接続を解除",
    "disclaimer": "Shadow は支払いがあった月ごとにタブを作成し、月次集計を更新します。解除してもデータは削除されません。",
    "enterLink": "Google Sheet のリンクを貼ってください。",
    "invalidLink": "有効な Google Sheets のリンクを入力してください。",
    "copied": "Shadow のメールをコピーしました。",
    "copyFailed": "コピーに失敗しました。手動でコピーしてください。",
    "connectedMessage": "Google Sheet を接続しました。今すぐ同期で今月の売上を送信できます。",
    "connectFailed": "Google Sheet に接続できませんでした。",
    "loadFailed": "売上レポートの設定を読み込めませんでした。",
    "syncFailed": "売上レポートの同期に失敗しました。",
    "disconnectFailed": "接続解除に失敗しました。",
    "disconnectedMessage": "接続を解除しました。既存のシートデータは保持されます。",
    "syncResult": "同期完了：追加 {{appended}}、更新 {{updated}}、移動 {{moved}}、削除 {{removed}}。",
    "refresh": "接続を更新",
    "refreshing": "更新中...",
    "refreshFailed": "レポートの更新に失敗しました。",
    "syncErrorHelp": "同期を再試行するか、シートを再接続してください。",
    "otherStatus": "未接続"
  },
  "ko": {
    "menuTitle": "판매 보고서",
    "menuSubtitle": "월별 도서 및 PDF 판매를 Google Sheets와 동기화합니다.",
    "notSynced": "아직 동기화되지 않음",
    "statusConnected": "Google Sheet 연결됨",
    "statusLoading": "연결 불러오는 중...",
    "statusError": "연결 확인 필요",
    "statusMissing": "연결된 Google Sheet 없음",
    "helpTitle": "판매 보고서 사용 방법",
    "helpGuideTitle": "판매 보고서 안내",
    "helpIntro": "Google Sheets 연결 및 월별 도서와 PDF 판매 동기화 방법을 알아보세요.",
    "helpBack": "판매 보고서로 돌아가기",
    "helpEditor": "Editor 권한이 필요합니다. 권한이 없으면 Shadow에서 보고서를 수정할 수 없습니다.",
    "helpTrouble": "연결이 안 되면 링크, Shadow 이메일, Editor 권한을 확인하세요.",
    "copyright": "Shadow. All rights reserved.",
    "step1title": "Google Sheet 만들기",
    "step1body": "Shadow 판매 보고서를 받을 새 Google Sheet를 만드세요. 이름은 자유롭게 정할 수 있습니다.",
    "step2title": "Shadow와 공유",
    "step2body": "공유에서 화면의 Shadow 이메일을 추가하고 Editor 권한을 부여하세요.",
    "step3title": "링크 복사",
    "step3body": "Google Sheet 링크를 복사해 입력란에 붙여넣으세요.",
    "step4title": "Google Sheet 연결",
    "step4body": "연결 버튼을 눌러 링크와 수정 권한을 확인하세요.",
    "step5title": "보고서 동기화",
    "step5body": "연결 후 지금 동기화를 눌러 판매 데이터를 전송하세요.",
    "step6title": "Shadow에서 생성하는 내용",
    "step6body": "월별 탭과 월간 요약을 업데이트하고 주문, 취소, 환불을 중복 없이 반영합니다.",
    "step7title": "연결 해제",
    "step7body": "향후 동기화를 중지하지만 기존 Sheet 데이터는 삭제하지 않습니다.",
    "pageSubtitle": "Google Sheets 월별 판매 보고서.",
    "back": "뒤로",
    "openGuide": "판매 보고서 안내 열기",
    "sheetTitle": "Google Sheets",
    "serverNotConfigured": "서버에 판매 보고서가 설정되지 않았습니다.",
    "stepShare": "1단계 — 시트 공유",
    "shareHelp": "Google Spreadsheet를 만들고 Shadow에 Editor 권한을 주세요.",
    "emailLoading": "Shadow 이메일 불러오는 중...",
    "copyEmail": "Shadow 이메일 복사",
    "stepPaste": "2단계 — Google Sheet 링크 붙여넣기",
    "connecting": "연결 중...",
    "connectTest": "연결 및 테스트",
    "reconnectTest": "다시 연결 및 테스트",
    "sheet": "시트",
    "lastSync": "마지막 동기화",
    "syncing": "동기화 중...",
    "syncNow": "지금 동기화",
    "openSheet": "시트 열기",
    "disconnecting": "연결 해제 중...",
    "disconnect": "Google Sheet 연결 해제",
    "disclaimer": "Shadow는 결제된 월마다 탭을 만들고 월간 요약을 업데이트합니다. 연결을 해제해도 기존 데이터는 삭제되지 않습니다.",
    "enterLink": "Google Sheet 링크를 붙여넣으세요.",
    "invalidLink": "올바른 Google Sheets 링크를 입력하세요.",
    "copied": "Shadow 이메일을 복사했습니다.",
    "copyFailed": "복사에 실패했습니다. 직접 복사하세요.",
    "connectedMessage": "Google Sheet가 연결되었습니다. 지금 동기화를 눌러 이번 달 데이터를 전송하세요.",
    "connectFailed": "Google Sheet 연결에 실패했습니다.",
    "loadFailed": "판매 보고서 설정을 불러오지 못했습니다.",
    "syncFailed": "판매 보고서 동기화에 실패했습니다.",
    "disconnectFailed": "Google Sheet 연결 해제에 실패했습니다.",
    "disconnectedMessage": "Google Sheet 연결이 해제되었습니다. 기존 데이터는 삭제되지 않았습니다.",
    "syncResult": "동기화 완료: 신규 {{appended}}, 수정 {{updated}}, 이동 {{moved}}, 삭제 {{removed}}.",
    "refresh": "연결 새로고침",
    "refreshing": "새로고침 중...",
    "refreshFailed": "판매 보고서 새로고침 실패.",
    "syncErrorHelp": "동기화를 다시 시도하거나 시트를 다시 연결하세요.",
    "otherStatus": "연결 안 됨"
  }
})

function formatDateTime(value, missing) {
  if (!value) return missing

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return missing

  return date.toLocaleString(getDisplayLanguageId())
}

function getStatusStyle(status) {
  if (status === 'connected') {
    return 'bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]'
  }

  if (status === 'error') {
    return 'bg-[#fff1f2] text-[#be123c] ring-[#fecdd3]'
  }

  return 'bg-[#f3f4f6] text-[#6b7280] ring-[#e5e7eb]'
}

function SalesReportsStatus({ integration }) {
  const { t } = useDisplayTranslation()
  const status = integration?.connection_status || 'not connected'
  const label = status === 'connected'
    ? t('salesReportsSettings.statusConnected')
    : status === 'error' ? t('salesReportsSettings.statusError')
      : status === 'disconnected' || status === 'not connected' ? t('salesReportsSettings.otherStatus')
        : status.replaceAll('_', ' ')

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-[10px] font-black uppercase tracking-[0.08em] ring-1 ${getStatusStyle(status)}`}
    >
      {label}
    </span>
  )
}

export function SalesReportsSettingsMenuItem({ onOpen }) {
  const { t } = useDisplayTranslation()
  return (
    <>
      <div className="mx-4 h-px bg-[#eef0f4]" />

      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
      >
        <span className="min-w-0">
          <span className="block text-[14px] font-black text-[#111827]">
            {t('salesReportsSettings.menuTitle')}
          </span>
          <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
            {t('salesReportsSettings.menuSubtitle')}
          </span>
        </span>

        <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
      </button>
    </>
  )
}


const SALES_REPORTS_HELP_STEPS = [
  { number: '1', titleKey: 'step1title', bodyKey: 'step1body' },
  { number: '2', titleKey: 'step2title', bodyKey: 'step2body' },
  { number: '3', titleKey: 'step3title', bodyKey: 'step3body' },
  { number: '4', titleKey: 'step4title', bodyKey: 'step4body' },
  { number: '5', titleKey: 'step5title', bodyKey: 'step5body' },
  { number: '6', titleKey: 'step6title', bodyKey: 'step6body' },
  { number: '7', titleKey: 'step7title', bodyKey: 'step7body' },
]

function SalesReportsHelpSection({ number, title, children }) {
  return (
    <section className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ecfdf3] text-[12px] font-bold text-[#16a34a]">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">{title}</h2>
          <div className="mt-2 text-[13px] font-normal leading-6 text-[#667085]">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

function SalesReportsHelpPage({ onBack }) {
  const { t } = useDisplayTranslation()
  return (
    <main className="fixed inset-0 z-[1000] overflow-y-auto bg-[#f7f7f9]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:opacity-60"
            aria-label={t('salesReportsSettings.helpBack')}
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[17px] font-bold text-[#111827]">
            {t('salesReportsSettings.helpTitle')}
          </h1>

          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl pb-10">
        <section className="bg-white px-4 pb-5 pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf3] text-[#16a34a]">
            <i className="fa-solid fa-file-excel text-[19px]" />
          </div>

          <h2 className="mt-3 text-[18px] font-bold text-[#111827]">
            {t('salesReportsSettings.helpGuideTitle')}
          </h2>

          <p className="mx-auto mt-1 max-w-[420px] text-[13px] font-normal leading-5 text-[#98a2b3]">
            {t('salesReportsSettings.helpIntro')}
          </p>
        </section>

        <div className="mt-3 bg-white">
          {SALES_REPORTS_HELP_STEPS.map((step) => (
            <SalesReportsHelpSection
              key={step.number}
              number={step.number}
              title={t(`salesReportsSettings.${step.titleKey}`)}
            >
              <p>{t(`salesReportsSettings.${step.bodyKey}`)}</p>

              {step.number === '2' ? (
                <p className="mt-2 font-medium text-[#475467]">
                  {t('salesReportsSettings.helpEditor')}
                </p>
              ) : null}
            </SalesReportsHelpSection>
          ))}
        </div>

        <div className="mx-4 mt-4 rounded-[16px] bg-[#ecfdf3] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info mt-0.5 text-[14px] text-[#16a34a]" />

            <p className="text-[12px] font-normal leading-5 text-[#667085]">
              {t('salesReportsSettings.helpTrouble')}
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] font-normal text-[#b0b7c3]">
          {t('salesReportsSettings.copyright')}
        </p>
      </div>
    </main>
  )
}

function getSafeGoogleSheetUrl(value) {
  try {
    const url = new URL(String(value || '').trim())
    if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com') return ''
    if (!/^\/spreadsheets\/d\/[a-zA-Z0-9_-]{20,}(?:\/|$)/.test(url.pathname)) return ''
    return url.href
  } catch {
    return ''
  }
}

export function SalesReportsSettingsPage({
  open,
  onBack,
  fetchSettings,
  connectSheet,
  syncSheet,
  disconnectSheet,
}) {
  const { t } = useDisplayTranslation()
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('')
  const [integration, setIntegration] = useState(null)
  const [editorEmail, setEditorEmail] = useState('')
  const [configured, setConfigured] = useState(true)
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [showHelp, setShowHelp] = useState(false)
  const apiRef = useRef({ fetchSettings, connectSheet, syncSheet, disconnectSheet })
  apiRef.current = { fetchSettings, connectSheet, syncSheet, disconnectSheet }
  const activeRef = useRef(false)
  const requestIdRef = useRef(0)
  const actionRef = useRef('')
  const viewSessionRef = useRef(0)

  const connected = integration?.connection_status === 'connected'
  const canSync = configured && Boolean(integration?.spreadsheet_url) &&
    ['connected', 'error'].includes(integration?.connection_status)
  const googleSheetUrl = getSafeGoogleSheetUrl(integration?.spreadsheet_url)
  const actionLocked = loading || connecting || syncing || disconnecting

  const statusText = useMemo(() => {
    if (loading) return t('salesReportsSettings.statusLoading')
    if (connected) return t('salesReportsSettings.statusConnected')
    if (integration?.connection_status === 'error') {
      return integration?.last_sync_error || t('salesReportsSettings.statusError')
    }
    return t('salesReportsSettings.statusMissing')
  }, [connected, integration, loading, t])

  const applySettings = (data) => {
    const nextIntegration = data?.sales_reports || null
    setConfigured(data?.configured !== false)
    setEditorEmail(data?.editor_email || '')
    setIntegration(nextIntegration)
    setSpreadsheetUrl(nextIntegration?.spreadsheet_url || '')
  }

  useEffect(() => {
    viewSessionRef.current += 1
    activeRef.current = Boolean(open)
    if (!open) {
      requestIdRef.current += 1
      setShowHelp(false)
      return undefined
    }

    const id = ++requestIdRef.current
    setLoading(true)
    setMessage('')
    Promise.resolve()
      .then(() => apiRef.current.fetchSettings())
      .then((data) => {
        if (activeRef.current && requestIdRef.current === id) applySettings(data)
      })
      .catch((error) => {
        if (activeRef.current && requestIdRef.current === id) {
          setMessageType('error')
          setMessage(error?.message || t('salesReportsSettings.loadFailed'))
        }
      })
      .finally(() => {
        if (activeRef.current && requestIdRef.current === id) setLoading(false)
      })

    return () => {
      requestIdRef.current += 1
    }
  }, [open])

  const showResult = (kind, value) => {
    if (!activeRef.current) return
    setMessageType(kind)
    setMessage(value)
  }

  const isCurrentView = (session) => activeRef.current && viewSessionRef.current === session

  const executeAction = async (name, operation) => {
    if (!activeRef.current || actionRef.current || loading) return
    const session = viewSessionRef.current
    actionRef.current = name
    requestIdRef.current += 1
    const setters = {
      connecting: setConnecting,
      syncing: setSyncing,
      disconnecting: setDisconnecting,
    }
    setters[name]?.(true)
    setMessage('')
    try {
      await operation(session)
    } finally {
      actionRef.current = ''
      setters[name]?.(false)
    }
  }

  const handleCopyEmail = async () => {
    if (!editorEmail) return
    try {
      await navigator.clipboard.writeText(editorEmail)
      showResult('success', t('salesReportsSettings.copied'))
    } catch {
      showResult('error', t('salesReportsSettings.copyFailed'))
    }
  }

  const handleRefresh = async () => {
    await executeAction('connecting', async (session) => {
      try {
        const data = await apiRef.current.fetchSettings()
        if (isCurrentView(session)) {
          applySettings(data)
          showResult('success', t('salesReportsSettings.refresh'))
        }
      } catch (error) {
        if (isCurrentView(session)) showResult('error', error?.message || t('salesReportsSettings.refreshFailed'))
      }
    })
  }

  const handleConnect = async () => {
    if (actionRef.current || actionLocked) return
    const url = spreadsheetUrl.trim()
    if (!url) {
      showResult('error', t('salesReportsSettings.enterLink'))
      return
    }
    if (!getSafeGoogleSheetUrl(url)) {
      showResult('error', t('salesReportsSettings.invalidLink'))
      return
    }
    await executeAction('connecting', async (session) => {
      try {
        const data = await apiRef.current.connectSheet(url)
        if (!isCurrentView(session)) return
        const nextIntegration = data?.sales_reports || null
        setIntegration(nextIntegration)
        if (nextIntegration?.spreadsheet_url) setSpreadsheetUrl(nextIntegration.spreadsheet_url)
        showResult('success', t('salesReportsSettings.connectedMessage'))
      } catch (error) {
        if (isCurrentView(session)) showResult('error', error?.message || t('salesReportsSettings.connectFailed'))
      }
    })
  }

  const handleSync = async () => {
    if (!canSync || actionRef.current || actionLocked) return
    await executeAction('syncing', async (session) => {
      try {
        const data = await apiRef.current.syncSheet()
        if (!isCurrentView(session)) return
        const sync = data?.sync || {}
        try {
          const latest = await apiRef.current.fetchSettings()
          if (isCurrentView(session)) applySettings(latest)
        } catch {}
        if (isCurrentView(session)) showResult('success', t('salesReportsSettings.syncResult', {
          appended: Number(sync.appended || 0),
          updated: Number(sync.updated || 0),
          moved: Number(sync.moved || 0),
          removed: Number(sync.removed || 0),
        }))
      } catch (error) {
        if (isCurrentView(session)) {
          setIntegration((current) => current ? {
            ...current,
            connection_status: 'error',
            last_sync_error: error?.message || t('salesReportsSettings.syncFailed'),
          } : current)
        }
        if (isCurrentView(session)) showResult('error', error?.message || t('salesReportsSettings.syncFailed'))
      }
    })
  }

  const handleDisconnect = async () => {
    if (actionRef.current || actionLocked) return
    await executeAction('disconnecting', async (session) => {
      try {
        const data = await apiRef.current.disconnectSheet()
        if (!isCurrentView(session)) return
        setIntegration((current) => data?.sales_reports || {
          ...current,
          connection_status: 'disconnected',
          last_sync_error: null,
        })
        showResult('success', t('salesReportsSettings.disconnectedMessage'))
      } catch (error) {
        if (isCurrentView(session)) showResult('error', error?.message || t('salesReportsSettings.disconnectFailed'))
      }
    })
  }

  const handleOpenSheet = () => {
    if (googleSheetUrl) window.open(googleSheetUrl, '_blank', 'noopener,noreferrer')
  }

  if (!open) return null

  if (showHelp) {
    return <SalesReportsHelpPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#f7f5fb]">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <button
            type="button"
            onClick={onBack}
            disabled={actionLocked}
            className="flex h-10 w-8 shrink-0 items-center justify-start text-[#111827] active:opacity-60"
            aria-label={t('salesReportsSettings.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-[18px] font-black leading-5 text-[#111827]">
              {t('salesReportsSettings.menuTitle')}
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#8b93a1]">
              {t('salesReportsSettings.pageSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={actionLocked}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center text-[#667085] active:opacity-60 disabled:opacity-40"
            aria-label={t('salesReportsSettings.refresh')}
          >
            <i className={`fa-solid fa-rotate-right text-[15px] ${connecting ? 'fa-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            disabled={actionLocked}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center text-[#667085] active:opacity-60"
            aria-label={t('salesReportsSettings.openGuide')}
          >
            <i className="fa-regular fa-circle-question text-[17px]" />
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-56px)] overflow-y-auto px-4 pb-28 pt-4">
        <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-br from-[#ede9fe] via-[#f5f3ff] to-white px-4 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-sm ring-1 ring-black/5">
                <i className="fa-solid fa-file-excel text-[27px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[17px] font-black text-[#111827]">
                    {t('salesReportsSettings.sheetTitle')}
                  </h2>
                  <SalesReportsStatus integration={integration} />
                </div>

                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6b7280]">
                  {statusText}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {!configured ? (
              <div className="rounded-2xl bg-[#fff7ed] px-4 py-3 text-[12px] font-bold leading-5 text-[#9a3412] ring-1 ring-[#fed7aa]">
                {t('salesReportsSettings.serverNotConfigured')}
              </div>
            ) : null}

            {message ? (
              <button
                type="button"
                onClick={() => setMessage('')}
                className={`w-full rounded-2xl px-4 py-3 text-left text-[12px] font-bold leading-5 ring-1 ${
                  messageType === 'error'
                    ? 'bg-[#fff1f2] text-[#be123c] ring-[#fecdd3]'
                    : 'bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]'
                }`}
              >
                {message}
              </button>
            ) : null}

            <div className="rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
              <div className="text-[12px] font-black text-[#111827]">
                {t('salesReportsSettings.stepShare')}
              </div>

              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6b7280]">
                {t('salesReportsSettings.shareHelp')}
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-[#e5e7eb]">
                <div className="min-w-0 flex-1 break-all text-[12px] font-black text-[#374151]">
                  {editorEmail || t('salesReportsSettings.emailLoading')}
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={t('salesReportsSettings.copyEmail')}
                  disabled={!editorEmail}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f0f8] text-[#6f4cff] active:scale-95 disabled:opacity-40"
                >
                  <i className="fa-regular fa-copy text-[13px]" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-black text-[#111827]">
                {t('salesReportsSettings.stepPaste')}
              </label>

              <input
                type="url"
                value={spreadsheetUrl}
                onChange={(event) => setSpreadsheetUrl(event.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                disabled={actionLocked}
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e1ec] bg-white px-4 text-[12px] font-bold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 disabled:bg-[#f3f4f6]"
              />
            </div>

            <button
              type="button"
              onClick={handleConnect}
              disabled={actionLocked || !configured || !spreadsheetUrl.trim()}
              className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[#aeb6c4]"
            >
              {connecting ? t('salesReportsSettings.connecting') : connected ? t('salesReportsSettings.reconnectTest') : t('salesReportsSettings.connectTest')}
            </button>

            {integration?.connection_status === 'error' ? (
              <p className="text-[11px] font-semibold text-[#be123c]">{t('salesReportsSettings.syncErrorHelp')}</p>
            ) : null}

            {integration ? (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-black/5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
                      {t('salesReportsSettings.sheet')}
                    </div>
                    <div className="mt-1 truncate text-[12px] font-black text-[#111827]">
                      {integration.sheet_name || 'Monthly Summary'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
                      {t('salesReportsSettings.lastSync')}
                    </div>
                    <div className="mt-1 text-[12px] font-black text-[#111827]">
                      {formatDateTime(integration.last_synced_at, t('salesReportsSettings.notSynced'))}
                    </div>
                  </div>
                </div>

                {integration.last_sync_error ? (
                  <div className="mt-3 rounded-2xl bg-[#fff1f2] px-3 py-2 text-[11px] font-bold leading-5 text-[#be123c]">
                    {integration.last_sync_error}
                  </div>
                ) : null}
              </div>
            ) : null}

            {canSync ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={actionLocked}
                  className="h-12 rounded-full bg-[#7c5cff] text-[12px] font-black text-white active:scale-[0.98] disabled:opacity-50"
                >
                  {syncing ? t('salesReportsSettings.syncing') : t('salesReportsSettings.syncNow')}
                </button>

                <button
                  type="button"
                  onClick={handleOpenSheet}
                  disabled={!googleSheetUrl || actionLocked}
                  className="h-12 rounded-full bg-[#ecfdf5] text-[12px] font-black text-[#047857] ring-1 ring-[#a7f3d0] active:scale-[0.98] disabled:opacity-50"
                >
                  {t('salesReportsSettings.openSheet')}
                </button>
              </div>
            ) : null}

            {integration && integration.connection_status !== 'disconnected' ? (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={actionLocked}
                className="h-11 w-full rounded-full bg-[#fff1f2] text-[12px] font-black text-[#be123c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-50"
              >
                {disconnecting ? t('salesReportsSettings.disconnecting') : t('salesReportsSettings.disconnect')}
              </button>
            ) : null}

            <div className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[11px] font-semibold leading-5 text-[#6b7280]">
              {t('salesReportsSettings.disclaimer')}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
