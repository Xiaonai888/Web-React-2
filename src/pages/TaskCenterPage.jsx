import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import DailyGiftRewardPopup from '../components/DailyGiftRewardPopup'

registerTranslationNamespace('taskCenterPage', {
  "en": {
    "dailyCheckIn": "Daily Check-in",
    "dailyCheckInSubtitle": "Open Task Center and collect today’s reward.",
    "claim": "Claim",
    "go": "Go",
    "claimed": "Claimed",
    "day": "Day {{day}}",
    "tapToClaimReward": "Tap to claim reward",
    "gift": "Gift",
    "tap": "Tap",
    "done": "Done",
    "claiming": "Claiming...",
    "notReady": "Not Ready",
    "dailyMissionReward": "Daily Mission Reward",
    "premiumTimesTwo": "Premium ×2",
    "completeAllDailyMissions": "Complete all daily missions to earn 1 Vote.",
    "vote": "Vote",
    "votes": "Votes",
    "missions": "Missions",
    "ready": "Ready",
    "inProgress": "In progress",
    "claimPlus": "Claim +{{count}}",
    "readNow": "Read now",
    "coinsEarned": "{{count}} Coins Earned",
    "readAndEarn": "Read & Earn",
    "readRewardHelp": "Read any story today and collect coins at each time goal.",
    "readMinutes": "Read {{count}} minutes",
    "readingSubtitle": "Keep reading longer to earn more coins.",
    "progressMinutes": "{{progress}}/{{target}} min",
    "full": "Full",
    "rewardChest": "Reward Chest",
    "surpriseGot": "Surprise! You’ve got",
    "openedRewardChest": "Opened Reward Chest",
    "pleaseLoginAgain": "Please log in again",
    "loadDailyVoteFailed": "Failed to load Daily Vote reward",
    "loadTaskCenterFailed": "Failed to load Task Center",
    "couldNotLoadRewards": "Could not load rewards",
    "updateReminderFailed": "Failed to update reminder",
    "reminderOn": "Check-in reminder set for 7:00 AM",
    "reminderOff": "Check-in reminder turned off",
    "pleaseLoginAgainClaimCoins": "Please log in again to claim coins",
    "rewardNotAvailable": "Reward is not available yet",
    "coinsAddedWallet": "Coins added to your wallet",
    "nextChestIn": "Next chest in {{time}}",
    "chestNotReady": "Chest is not ready yet",
    "claimChestFailed": "Failed to claim reward chest",
    "noReadingReward": "No reading reward available",
    "coinsAdded": "+{{count}} coins added",
    "readingRewardClaimFailed": "Failed to claim reading reward",
    "readingMissionUnavailable": "Reading mission reward is not available",
    "readingMissionClaimFailed": "Failed to claim reading mission reward",
    "dailyVoteUnavailable": "Daily Vote reward is not available",
    "dailyVoteClaimed": "Daily Vote reward claimed",
    "dailyVoteClaimFailed": "Failed to claim Daily Vote reward",
    "rewardAddedWallet": "Reward added to your wallet",
    "voucher": "Voucher",
    "openedGift": "Opened Gift",
    "closeCheckInRules": "Close check-in rules",
    "checkInRules": "Check-in Rules",
    "checkInRulesBody1": "Check in every day to keep your streak and collect rewards. If you miss a day, your streak will reset.",
    "premiumAutoClaim": "Premium readers can auto-claim daily rewards.",
    "gotIt": "Got it",
    "taskCenterCover": "Task Center Cover",
    "goBack": "Go back",
    "taskCenter": "Task Center",
    "more": "More",
    "myCoins": "My Coins",
    "myDiamonds": "My Diamonds",
    "coinsUnlockHelp": "Use Coins to unlock and read any stories on Shadow.",
    "dayStreak": "{{count}}-Day Streak",
    "reminder": "Reminder",
    "moreRewards": "More Rewards",
    "notes": "Notes:",
    "noteFraud": "Shadow may suspend or restrict users who are involved in fraud, abuse, or violations of the rules.",
    "noteEvents": "All events are organized, promoted, and managed by Shadow only. Shadow reserves the right to make the final decision on all event-related matters.",
    "noteContact": "If you have any questions, please contact us via",
    "minuteMarker": "{{count}}m"
  },
  "km": {
    "dailyCheckIn": "ចូលប្រចាំថ្ងៃ",
    "dailyCheckInSubtitle": "បើក Task Center ហើយទទួលរង្វាន់ថ្ងៃនេះ។",
    "claim": "ទទួល",
    "go": "ទៅ",
    "claimed": "បានទទួល",
    "day": "ថ្ងៃទី {{day}}",
    "tapToClaimReward": "ចុចដើម្បីទទួលរង្វាន់",
    "gift": "អំណោយ",
    "tap": "ចុច",
    "done": "រួចរាល់",
    "claiming": "កំពុងទទួល...",
    "notReady": "មិនទាន់រួចរាល់",
    "dailyMissionReward": "រង្វាន់បេសកកម្មប្រចាំថ្ងៃ",
    "premiumTimesTwo": "Premium ×2",
    "completeAllDailyMissions": "បំពេញបេសកកម្មប្រចាំថ្ងៃទាំងអស់ ដើម្បីទទួល Vote 1។",
    "vote": "Vote",
    "votes": "Votes",
    "missions": "បេសកកម្ម",
    "ready": "រួចរាល់",
    "inProgress": "កំពុងដំណើរការ",
    "claimPlus": "ទទួល +{{count}}",
    "readNow": "អានឥឡូវនេះ",
    "coinsEarned": "រកបាន {{count}} Coins",
    "readAndEarn": "អាន និងរក Coins",
    "readRewardHelp": "អានរឿងណាមួយថ្ងៃនេះ ហើយប្រមូល Coins នៅរាល់គោលដៅពេលវេលា។",
    "readMinutes": "អាន {{count}} នាទី",
    "readingSubtitle": "បន្តអានឱ្យបានយូរ ដើម្បីរក Coins បន្ថែម។",
    "progressMinutes": "{{progress}}/{{target}} នាទី",
    "full": "ពេញ",
    "rewardChest": "ប្រអប់រង្វាន់",
    "surpriseGot": "ភ្ញាក់ផ្អើល! អ្នកទទួលបាន",
    "openedRewardChest": "ប្រអប់រង្វាន់ដែលបានបើក",
    "pleaseLoginAgain": "សូម Login ម្តងទៀត",
    "loadDailyVoteFailed": "មិនអាចផ្ទុករង្វាន់ Daily Vote បានទេ",
    "loadTaskCenterFailed": "មិនអាចផ្ទុក Task Center បានទេ",
    "couldNotLoadRewards": "មិនអាចផ្ទុករង្វាន់បានទេ",
    "updateReminderFailed": "មិនអាច Update ការរំលឹកបានទេ",
    "reminderOn": "បានកំណត់ការរំលឹក Check-in ម៉ោង 7:00 ព្រឹក",
    "reminderOff": "បានបិទការរំលឹក Check-in",
    "pleaseLoginAgainClaimCoins": "សូម Login ម្តងទៀតដើម្បីទទួល Coins",
    "rewardNotAvailable": "រង្វាន់មិនទាន់អាចទទួលបានទេ",
    "coinsAddedWallet": "បានបន្ថែម Coins ទៅ Wallet របស់អ្នក",
    "nextChestIn": "ប្រអប់បន្ទាប់ក្នុង {{time}}",
    "chestNotReady": "ប្រអប់មិនទាន់រួចរាល់ទេ",
    "claimChestFailed": "មិនអាចទទួលរង្វាន់ពីប្រអប់បានទេ",
    "noReadingReward": "មិនមានរង្វាន់ការអានដែលអាចទទួលបានទេ",
    "coinsAdded": "បានបន្ថែម +{{count}} Coins",
    "readingRewardClaimFailed": "មិនអាចទទួលរង្វាន់ការអានបានទេ",
    "readingMissionUnavailable": "រង្វាន់បេសកកម្មអានមិនទាន់អាចទទួលបានទេ",
    "readingMissionClaimFailed": "មិនអាចទទួលរង្វាន់បេសកកម្មអានបានទេ",
    "dailyVoteUnavailable": "រង្វាន់ Daily Vote មិនទាន់អាចទទួលបានទេ",
    "dailyVoteClaimed": "បានទទួលរង្វាន់ Daily Vote",
    "dailyVoteClaimFailed": "មិនអាចទទួលរង្វាន់ Daily Vote បានទេ",
    "rewardAddedWallet": "បានបន្ថែមរង្វាន់ទៅ Wallet របស់អ្នក",
    "voucher": "Voucher",
    "openedGift": "អំណោយដែលបានបើក",
    "closeCheckInRules": "បិទច្បាប់ Check-in",
    "checkInRules": "ច្បាប់ Check-in",
    "checkInRulesBody1": "Check-in រាល់ថ្ងៃដើម្បីរក្សា Streak និងទទួលរង្វាន់។ បើខកខានមួយថ្ងៃ Streak នឹងចាប់ផ្តើមឡើងវិញ។",
    "premiumAutoClaim": "អ្នកអាន Premium អាចទទួលរង្វាន់ប្រចាំថ្ងៃដោយស្វ័យប្រវត្តិ។",
    "gotIt": "យល់ហើយ",
    "taskCenterCover": "រូប Task Center",
    "goBack": "ត្រឡប់ក្រោយ",
    "taskCenter": "Task Center",
    "more": "បន្ថែម",
    "myCoins": "Coins របស់ខ្ញុំ",
    "myDiamonds": "Diamonds របស់ខ្ញុំ",
    "coinsUnlockHelp": "ប្រើ Coins ដើម្បី Unlock និងអានរឿងណាមួយនៅលើ Shadow។",
    "dayStreak": "Streak {{count}} ថ្ងៃ",
    "reminder": "រំលឹក",
    "moreRewards": "រង្វាន់បន្ថែម",
    "notes": "ចំណាំ៖",
    "noteFraud": "Shadow អាចផ្អាក ឬដាក់កម្រិតអ្នកប្រើដែលពាក់ព័ន្ធនឹងការក្លែងបន្លំ ការបំពាន ឬការរំលោភច្បាប់។",
    "noteEvents": "Event ទាំងអស់ត្រូវបានរៀបចំ ផ្សព្វផ្សាយ និងគ្រប់គ្រងដោយ Shadow តែប៉ុណ្ណោះ។ Shadow រក្សាសិទ្ធិក្នុងការសម្រេចចុងក្រោយលើបញ្ហាទាំងអស់ដែលពាក់ព័ន្ធនឹង Event។",
    "noteContact": "បើអ្នកមានសំណួរ សូមទាក់ទងមកយើងតាម",
    "minuteMarker": "{{count}}ន"
  },
  "zh": {
    "dailyCheckIn": "每日签到",
    "dailyCheckInSubtitle": "打开任务中心并领取今天的奖励。",
    "claim": "领取",
    "go": "前往",
    "claimed": "已领取",
    "day": "第 {{day}} 天",
    "tapToClaimReward": "点击领取奖励",
    "gift": "礼物",
    "tap": "点击",
    "done": "完成",
    "claiming": "领取中...",
    "notReady": "尚未就绪",
    "dailyMissionReward": "每日任务奖励",
    "premiumTimesTwo": "Premium ×2",
    "completeAllDailyMissions": "完成所有每日任务即可获得 1 个 Vote。",
    "vote": "Vote",
    "votes": "Votes",
    "missions": "任务",
    "ready": "可领取",
    "inProgress": "进行中",
    "claimPlus": "领取 +{{count}}",
    "readNow": "立即阅读",
    "coinsEarned": "已赚取 {{count}} Coins",
    "readAndEarn": "阅读赚 Coins",
    "readRewardHelp": "今天阅读任意故事，在每个时间目标处领取 Coins。",
    "readMinutes": "阅读 {{count}} 分钟",
    "readingSubtitle": "继续阅读更长时间以获得更多 Coins。",
    "progressMinutes": "{{progress}}/{{target}} 分钟",
    "full": "已满",
    "rewardChest": "奖励宝箱",
    "surpriseGot": "惊喜！你获得了",
    "openedRewardChest": "已打开的奖励宝箱",
    "pleaseLoginAgain": "请重新登录",
    "loadDailyVoteFailed": "无法加载 Daily Vote 奖励",
    "loadTaskCenterFailed": "无法加载任务中心",
    "couldNotLoadRewards": "无法加载奖励",
    "updateReminderFailed": "无法更新提醒",
    "reminderOn": "签到提醒已设置为早上 7:00",
    "reminderOff": "签到提醒已关闭",
    "pleaseLoginAgainClaimCoins": "请重新登录以领取 Coins",
    "rewardNotAvailable": "奖励暂不可领取",
    "coinsAddedWallet": "Coins 已添加到你的钱包",
    "nextChestIn": "下一个宝箱将在 {{time}} 后出现",
    "chestNotReady": "宝箱尚未就绪",
    "claimChestFailed": "领取宝箱奖励失败",
    "noReadingReward": "暂无可领取的阅读奖励",
    "coinsAdded": "已添加 +{{count}} Coins",
    "readingRewardClaimFailed": "领取阅读奖励失败",
    "readingMissionUnavailable": "阅读任务奖励暂不可领取",
    "readingMissionClaimFailed": "领取阅读任务奖励失败",
    "dailyVoteUnavailable": "Daily Vote 奖励暂不可领取",
    "dailyVoteClaimed": "已领取 Daily Vote 奖励",
    "dailyVoteClaimFailed": "领取 Daily Vote 奖励失败",
    "rewardAddedWallet": "奖励已添加到你的钱包",
    "voucher": "Voucher",
    "openedGift": "已打开的礼物",
    "closeCheckInRules": "关闭签到规则",
    "checkInRules": "签到规则",
    "checkInRulesBody1": "每天签到以保持连续签到并领取奖励。如果漏签一天，连续签到将重置。",
    "premiumAutoClaim": "Premium 读者可自动领取每日奖励。",
    "gotIt": "知道了",
    "taskCenterCover": "任务中心封面",
    "goBack": "返回",
    "taskCenter": "任务中心",
    "more": "更多",
    "myCoins": "我的 Coins",
    "myDiamonds": "我的 Diamonds",
    "coinsUnlockHelp": "使用 Coins 解锁并阅读 Shadow 上的任意故事。",
    "dayStreak": "连续 {{count}} 天",
    "reminder": "提醒",
    "moreRewards": "更多奖励",
    "notes": "注意：",
    "noteFraud": "Shadow 可能暂停或限制涉及欺诈、滥用或违反规则的用户。",
    "noteEvents": "所有活动仅由 Shadow 组织、推广和管理。Shadow 保留对所有活动相关事项作出最终决定的权利。",
    "noteContact": "如有任何问题，请通过以下方式联系我们",
    "minuteMarker": "{{count}}分"
  },
  "ja": {
    "dailyCheckIn": "デイリーチェックイン",
    "dailyCheckInSubtitle": "Task Center を開いて今日の報酬を受け取りましょう。",
    "claim": "受け取る",
    "go": "移動",
    "claimed": "受取済み",
    "day": "{{day}}日目",
    "tapToClaimReward": "タップして報酬を受け取る",
    "gift": "ギフト",
    "tap": "タップ",
    "done": "完了",
    "claiming": "受取中...",
    "notReady": "未達成",
    "dailyMissionReward": "デイリーミッション報酬",
    "premiumTimesTwo": "Premium ×2",
    "completeAllDailyMissions": "すべてのデイリーミッションを完了すると Vote を1つ獲得できます。",
    "vote": "Vote",
    "votes": "Votes",
    "missions": "ミッション",
    "ready": "受取可能",
    "inProgress": "進行中",
    "claimPlus": "+{{count}} を受け取る",
    "readNow": "今すぐ読む",
    "coinsEarned": "{{count}} Coins 獲得",
    "readAndEarn": "読んで Coins を獲得",
    "readRewardHelp": "今日どれかのストーリーを読み、各時間目標で Coins を受け取りましょう。",
    "readMinutes": "{{count}}分読む",
    "readingSubtitle": "さらに長く読んで、より多くの Coins を獲得しましょう。",
    "progressMinutes": "{{progress}}/{{target}} 分",
    "full": "満杯",
    "rewardChest": "報酬チェスト",
    "surpriseGot": "サプライズ！獲得しました",
    "openedRewardChest": "開いた報酬チェスト",
    "pleaseLoginAgain": "もう一度ログインしてください",
    "loadDailyVoteFailed": "Daily Vote 報酬を読み込めませんでした",
    "loadTaskCenterFailed": "Task Center を読み込めませんでした",
    "couldNotLoadRewards": "報酬を読み込めませんでした",
    "updateReminderFailed": "リマインダーを更新できませんでした",
    "reminderOn": "チェックイン通知を午前7:00に設定しました",
    "reminderOff": "チェックイン通知をオフにしました",
    "pleaseLoginAgainClaimCoins": "Coins を受け取るには再度ログインしてください",
    "rewardNotAvailable": "報酬はまだ受け取れません",
    "coinsAddedWallet": "Coins をウォレットに追加しました",
    "nextChestIn": "次のチェストまで {{time}}",
    "chestNotReady": "チェストはまだ準備できていません",
    "claimChestFailed": "チェスト報酬を受け取れませんでした",
    "noReadingReward": "受け取れる読書報酬はありません",
    "coinsAdded": "+{{count}} Coins を追加しました",
    "readingRewardClaimFailed": "読書報酬を受け取れませんでした",
    "readingMissionUnavailable": "読書ミッション報酬はまだ受け取れません",
    "readingMissionClaimFailed": "読書ミッション報酬を受け取れませんでした",
    "dailyVoteUnavailable": "Daily Vote 報酬はまだ受け取れません",
    "dailyVoteClaimed": "Daily Vote 報酬を受け取りました",
    "dailyVoteClaimFailed": "Daily Vote 報酬を受け取れませんでした",
    "rewardAddedWallet": "報酬をウォレットに追加しました",
    "voucher": "Voucher",
    "openedGift": "開いたギフト",
    "closeCheckInRules": "チェックインルールを閉じる",
    "checkInRules": "チェックインルール",
    "checkInRulesBody1": "毎日チェックインして連続記録を維持し、報酬を受け取りましょう。1日逃すと連続記録はリセットされます。",
    "premiumAutoClaim": "Premium 読者はデイリー報酬を自動受取できます。",
    "gotIt": "わかりました",
    "taskCenterCover": "Task Center カバー",
    "goBack": "戻る",
    "taskCenter": "Task Center",
    "more": "その他",
    "myCoins": "マイ Coins",
    "myDiamonds": "マイ Diamonds",
    "coinsUnlockHelp": "Coins を使って Shadow のストーリーをアンロックして読めます。",
    "dayStreak": "{{count}}日連続",
    "reminder": "リマインダー",
    "moreRewards": "その他の報酬",
    "notes": "注意：",
    "noteFraud": "詐欺、不正利用、ルール違反に関与したユーザーは、Shadow により停止または制限される場合があります。",
    "noteEvents": "すべてのイベントは Shadow のみが企画、宣伝、管理します。イベントに関するすべての事項について、Shadow が最終決定権を有します。",
    "noteContact": "ご質問がある場合は、こちらからお問い合わせください",
    "minuteMarker": "{{count}}分"
  },
  "ko": {
    "dailyCheckIn": "일일 체크인",
    "dailyCheckInSubtitle": "Task Center를 열고 오늘의 보상을 받으세요.",
    "claim": "받기",
    "go": "이동",
    "claimed": "받음",
    "day": "{{day}}일차",
    "tapToClaimReward": "탭하여 보상 받기",
    "gift": "선물",
    "tap": "탭",
    "done": "완료",
    "claiming": "받는 중...",
    "notReady": "아직 준비되지 않음",
    "dailyMissionReward": "일일 미션 보상",
    "premiumTimesTwo": "Premium ×2",
    "completeAllDailyMissions": "모든 일일 미션을 완료하면 Vote 1개를 받을 수 있습니다.",
    "vote": "Vote",
    "votes": "Votes",
    "missions": "미션",
    "ready": "받기 가능",
    "inProgress": "진행 중",
    "claimPlus": "+{{count}} 받기",
    "readNow": "지금 읽기",
    "coinsEarned": "{{count}} Coins 획득",
    "readAndEarn": "읽고 Coins 받기",
    "readRewardHelp": "오늘 아무 스토리나 읽고 각 시간 목표마다 Coins를 받으세요.",
    "readMinutes": "{{count}}분 읽기",
    "readingSubtitle": "더 오래 읽고 더 많은 Coins를 획득하세요.",
    "progressMinutes": "{{progress}}/{{target}}분",
    "full": "가득 참",
    "rewardChest": "보상 상자",
    "surpriseGot": "서프라이즈! 획득했습니다",
    "openedRewardChest": "열린 보상 상자",
    "pleaseLoginAgain": "다시 로그인해 주세요",
    "loadDailyVoteFailed": "Daily Vote 보상을 불러오지 못했습니다",
    "loadTaskCenterFailed": "Task Center를 불러오지 못했습니다",
    "couldNotLoadRewards": "보상을 불러오지 못했습니다",
    "updateReminderFailed": "알림을 업데이트하지 못했습니다",
    "reminderOn": "체크인 알림을 오전 7:00으로 설정했습니다",
    "reminderOff": "체크인 알림을 껐습니다",
    "pleaseLoginAgainClaimCoins": "Coins를 받으려면 다시 로그인해 주세요",
    "rewardNotAvailable": "보상을 아직 받을 수 없습니다",
    "coinsAddedWallet": "Coins가 지갑에 추가되었습니다",
    "nextChestIn": "다음 상자까지 {{time}}",
    "chestNotReady": "상자가 아직 준비되지 않았습니다",
    "claimChestFailed": "보상 상자를 받지 못했습니다",
    "noReadingReward": "받을 수 있는 읽기 보상이 없습니다",
    "coinsAdded": "+{{count}} Coins가 추가되었습니다",
    "readingRewardClaimFailed": "읽기 보상을 받지 못했습니다",
    "readingMissionUnavailable": "읽기 미션 보상을 아직 받을 수 없습니다",
    "readingMissionClaimFailed": "읽기 미션 보상을 받지 못했습니다",
    "dailyVoteUnavailable": "Daily Vote 보상을 아직 받을 수 없습니다",
    "dailyVoteClaimed": "Daily Vote 보상을 받았습니다",
    "dailyVoteClaimFailed": "Daily Vote 보상을 받지 못했습니다",
    "rewardAddedWallet": "보상이 지갑에 추가되었습니다",
    "voucher": "Voucher",
    "openedGift": "열린 선물",
    "closeCheckInRules": "체크인 규칙 닫기",
    "checkInRules": "체크인 규칙",
    "checkInRulesBody1": "매일 체크인하여 연속 기록을 유지하고 보상을 받으세요. 하루를 놓치면 연속 기록이 초기화됩니다.",
    "premiumAutoClaim": "Premium 독자는 일일 보상을 자동으로 받을 수 있습니다.",
    "gotIt": "확인",
    "taskCenterCover": "Task Center 커버",
    "goBack": "뒤로 가기",
    "taskCenter": "Task Center",
    "more": "더보기",
    "myCoins": "내 Coins",
    "myDiamonds": "내 Diamonds",
    "coinsUnlockHelp": "Coins를 사용해 Shadow의 모든 스토리를 잠금 해제하고 읽을 수 있습니다.",
    "dayStreak": "{{count}}일 연속",
    "reminder": "알림",
    "moreRewards": "추가 보상",
    "notes": "참고:",
    "noteFraud": "사기, 악용 또는 규칙 위반에 연루된 사용자는 Shadow에 의해 정지되거나 제한될 수 있습니다.",
    "noteEvents": "모든 이벤트는 Shadow에서만 기획, 홍보 및 관리합니다. 이벤트 관련 모든 사항에 대한 최종 결정권은 Shadow에 있습니다.",
    "noteContact": "문의 사항이 있으면 다음을 통해 연락해 주세요",
    "minuteMarker": "{{count}}분"
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CHEST_COOLDOWN_MS = 4 * 60 * 60 * 1000
const CHEST_MAX_STORAGE = 2

const SMART_REFRESH_CHECK_INTERVAL_MS = 60 * 1000
const SMART_REFRESH_MAX_CHECKS = 3
const SMART_REFRESH_COOLDOWN_MS = 60 * 60 * 1000
const ACTIVE_READING_MISSION_KEY = 'shadow_active_reading_mission'


const fallbackRewards = [
  { day: 1, gems: 50, coins: 50, vouchers: 0, gift: false, story_cards: 0 },
  { day: 2, gems: 100, coins: 100, vouchers: 0, gift: false, story_cards: 0 },
  { day: 3, gems: 150, coins: 150, vouchers: 0, gift: false, story_cards: 0 },
  { day: 4, gems: 200, coins: 200, vouchers: 0, gift: false, story_cards: 0 },
  { day: 5, gems: 250, coins: 250, vouchers: 0, gift: false, story_cards: 0 },
  { day: 6, gems: 300, coins: 300, vouchers: 0, gift: false, story_cards: 0 },
  { day: 7, gems: 0, coins: 0, vouchers: 1, gift: true, story_cards: 0 },
]

const moreRewards = [
  {
    id: 'daily-check-in',
    title: 'Daily Check-in',
    subtitle: 'Open Task Center and collect today’s reward.',
    reward: 50,
    action: 'Claim',
    status: 'claim',
    icon: 'fa-calendar-check',
  },
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('shadow_reader_user') || localStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function clearReaderSession() {
  localStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_user')
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function normalizeTaskLink(link) {
  const value = String(link || '').trim()

  if (!value) return '/discover'

  try {
    const url = new URL(value)

    return `${url.pathname}${url.search || ''}${url.hash || ''}` || '/discover'
  } catch {
    return value.startsWith('/') ? value : '/discover'
  }
}

function normalizeReadingMission(mission = {}, index = 0) {
  const targetMinutes = Math.max(1, Number(mission.target_minutes || 1))
  const targetSeconds = Math.max(60, Number(mission.target_seconds || targetMinutes * 60))
  const activeSeconds = Math.min(targetSeconds, Math.max(0, Number(mission.active_seconds || 0)))
  const completed = Boolean(mission.completed) || activeSeconds >= targetSeconds
  const claimed = Boolean(mission.claimed || mission.claimed_at)

  return {
    id: mission.id || `legacy-reading-task-${index}`,
    is_active: Boolean(mission.is_active),
    title: mission.title || `Read ${targetMinutes} minutes`,
    subtitle: mission.subtitle || 'Keep reading longer to earn more coins.',
    reward_coins: Number(mission.reward_coins || 0),
    target_minutes: targetMinutes,
    target_seconds: targetSeconds,
    story_link: mission.story_link || '',
    button_text: mission.button_text || 'Go',
    sort_order: Number(mission.sort_order || index),
    active_seconds: activeSeconds,
    active_minutes: Math.floor(activeSeconds / 60),
    completed,
    claimed,
    claimable: Boolean(mission.claimable) || (completed && !claimed),
    completed_at: mission.completed_at || null,
    claimed_at: mission.claimed_at || null,
  }
}

function normalizeReadingMissionList(list = []) {
  return Array.isArray(list)
    ? list.slice(0, 2).map((mission, index) => normalizeReadingMission(mission, index))
    : []
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getLiveChest(chest) {
  if (!chest) {
    return {
      available_chests: 0,
      max_chests: CHEST_MAX_STORAGE,
      is_full: false,
      next_chest_at: null,
      ms_until_next: 0,
    }
  }

  const maxChests = Number(chest.max_chests || CHEST_MAX_STORAGE)
  const baseAvailable = Math.min(maxChests, Math.max(0, Number(chest.available_chests || 0)))

  if (baseAvailable >= maxChests) {
    return {
      ...chest,
      available_chests: maxChests,
      is_full: true,
      next_chest_at: null,
      ms_until_next: 0,
    }
  }

  if (!chest.next_chest_at) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: baseAvailable >= maxChests,
      ms_until_next: Number(chest.ms_until_next || 0),
    }
  }

  const nowMs = Date.now()
  const nextMs = new Date(chest.next_chest_at).getTime()

  if (!Number.isFinite(nextMs)) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: false,
      ms_until_next: Number(chest.ms_until_next || 0),
    }
  }

  if (nowMs < nextMs) {
    return {
      ...chest,
      available_chests: baseAvailable,
      is_full: false,
      ms_until_next: nextMs - nowMs,
    }
  }

  const gained = 1 + Math.floor((nowMs - nextMs) / CHEST_COOLDOWN_MS)
  const liveAvailable = Math.min(maxChests, baseAvailable + gained)
  const isFull = liveAvailable >= maxChests
  const liveNextMs = isFull ? null : nextMs + gained * CHEST_COOLDOWN_MS

  return {
    ...chest,
    available_chests: liveAvailable,
    is_full: isFull,
    next_chest_at: liveNextMs ? new Date(liveNextMs).toISOString() : null,
    ms_until_next: liveNextMs ? Math.max(0, liveNextMs - nowMs) : 0,
  }
}

function CoinIcon({ className = 'h-5 w-5' }) {
  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt="Shadow Coin"
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

function DiamondIcon({ className = 'h-5 w-5' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

function RewardButton({ children, disabled = false, tone = 'dark', onClick }) {
  const styles = {
    dark: 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]',
    gold: 'bg-[#ff3f62] text-white',
    soft: 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]',
    outline: 'bg-[#ff3f62] text-white',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[96px] shrink-0 whitespace-nowrap h-10 rounded-full px-5 text-[12px] font-black leading-none shadow-sm active:scale-[0.98] disabled:cursor-not-allowed ${styles[tone] || styles.dark}`}
    >
      {children}
    </button>
  )
}

function BalanceBox({ label, value, type, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-center gap-3 px-5 py-4 text-left active:scale-[0.99]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {type === 'diamond' ? <DiamondIcon className="h-6 w-6" /> : <CoinIcon className="h-7 w-7" />}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
          <span>{label}</span>
          <i className="fa-solid fa-chevron-right text-[9px] text-[var(--shadow-text-secondary)]" />
        </div>
        <div className="mt-1 text-[24px] font-bold leading-none text-[#ff3f62]">{formatNumber(value)}</div>
      </div>
    </button>
  )
}

function DayReward({ reward, currentDay, claimedToday, onClaim, claiming }) {
  const { t } = useDisplayTranslation()
  const isPast = reward.day < currentDay
  const isToday = reward.day === currentDay
  const isClaimed = isPast || (isToday && claimedToday)
  const canTap = isToday && !claimedToday && !claiming
  const isGift = Boolean(reward.gift || Number(reward.vouchers || 0) > 0 || Number(reward.story_cards || 0) > 0)
  const label = isClaimed ? t('taskCenterPage.claimed') : t('taskCenterPage.day', { day: reward.day })

  return (
    <button
      type="button"
      onClick={canTap ? onClaim : undefined}
      disabled={!canTap}
      className={`min-w-0 text-center active:scale-95 ${canTap ? 'cursor-pointer' : 'cursor-default'}`}
      aria-label={canTap ? t('taskCenterPage.tapToClaimReward') : label}
    >
      <div className={`mx-auto flex h-7 w-7 items-center justify-center sm:h-9 sm:w-9 ${isClaimed ? 'opacity-55' : ''}`}>
        {isGift ? (
          <img
            src="/assets/Icons/Gift.svg"
            alt={t('taskCenterPage.gift')}
            className="h-6 w-6 object-contain sm:h-8 sm:w-8"
          />
        ) : (
          <CoinIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        )}
      </div>

      <div className="mt-1 text-[10px] font-black text-[var(--shadow-text-primary)] sm:mt-2 sm:text-[11px]">
        {isGift ? t('taskCenterPage.gift') : reward.coins || reward.gems}
      </div>

      <div className={`mt-1 text-[10px] font-bold ${canTap ? 'text-[#d97706] dark:text-amber-300' : isClaimed ? 'text-[#f59e0b] dark:text-amber-300' : 'text-[var(--shadow-text-tertiary)]'}`}>
        {canTap ? t('taskCenterPage.tap') : label}
      </div>
    </button>
  )
}

function ProgressLine({ progress = 0, target = 1 }) {
  const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0

  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
        <div className="h-full rounded-full bg-[#F6B800]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
        {progress}/{target}
      </div>
    </div>
  )
}

function TaskRow({ task, onCheckIn, claimedToday }) {
  const { t } = useDisplayTranslation()
  const isCheckIn = task.id === 'daily-check-in'
  const alreadyDone = isCheckIn && claimedToday
  const title = isCheckIn ? t('taskCenterPage.dailyCheckIn') : task.title
  const subtitle = isCheckIn ? t('taskCenterPage.dailyCheckInSubtitle') : task.subtitle
  const buttonText = alreadyDone ? t('taskCenterPage.done') : isCheckIn ? t('taskCenterPage.claim') : task.action
  const buttonTone = alreadyDone ? 'soft' : task.status === 'claim' ? 'gold' : 'outline'
  const iconWrapClass = isCheckIn
    ? 'bg-[#fff3df] text-[#ff9f1c] ring-1 ring-[#ff9f1c]/15 dark:bg-orange-500/10 dark:text-orange-300'
    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]'
  
  return (
    <div className="flex gap-3 border-b border-[var(--shadow-border)] py-4 last:border-b-0">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrapClass}`}>
        <i className={`fa-solid ${task.icon} text-[15px]`} />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[var(--shadow-text-primary)]">{title}</h3>
            <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">{subtitle}</p>

            <div className="mt-2 flex items-center gap-1 text-[12px] font-black text-[#d97706] dark:text-amber-300">
              <CoinIcon className="h-4 w-4" />
              <span>+{task.reward}</span>
            </div>
          </div>

          <RewardButton
            tone={buttonTone}
            disabled={alreadyDone}
            onClick={isCheckIn ? onCheckIn : undefined}
          >
            {buttonText}
          </RewardButton>
        </div>

        {task.progress !== undefined ? <ProgressLine progress={task.progress} target={task.target} /> : null}
      </div>
    </div>
   )
}

function DailyVoteRewardCard({ reward, claiming = false, onClaim }) {
  const { t } = useDisplayTranslation()

  if (!reward) return null

  const completedMissions = Math.max(
    0,
    Number(reward.completed_missions || 0)
  )

  const totalMissions = Math.max(
    1,
    Number(reward.total_missions || 1)
  )

  const progress = Math.min(totalMissions, completedMissions)
  const progressPercent = Math.min(
    100,
    Math.round((progress / totalMissions) * 100)
  )

  const rewardVotes = Math.max(
    1,
    Number(reward.reward_votes || 1)
  )

  const claimed = Boolean(reward.claimed)
  const claimable = Boolean(reward.claimable)

  const buttonText = claiming
    ? t('taskCenterPage.claiming')
    : claimed
      ? t('taskCenterPage.done')
      : claimable
        ? t('taskCenterPage.claim')
        : t('taskCenterPage.notReady')

  const buttonTone = claimed || !claimable
    ? 'soft'
    : 'gold'

  return (
    <div className="flex gap-3 border-b border-[var(--shadow-border)] py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[#ff3f62] ring-1 ring-[#ff3f62]/10 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/15">
  <i className="fa-solid fa-ticket text-[15px]" />
</div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] font-black leading-5 text-[var(--shadow-text-primary)]">
                {t('taskCenterPage.dailyMissionReward')}
              </h3>

              <span className="rounded-full bg-[#fff4d8] px-2 py-0.5 text-[9px] font-black text-[#b7791f] dark:bg-amber-500/10 dark:text-amber-300">
                {t('taskCenterPage.premiumTimesTwo')}
              </span>
            </div>

            <p className="mt-1 text-[11px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">
              {t('taskCenterPage.completeAllDailyMissions')}
            </p>

            <div className="mt-2 flex items-center gap-1 text-[12px] font-black text-[#d97706] dark:text-amber-300">
  <img
    src="/assets/Icons/Voucher.svg"
    alt=""
    className="h-4 w-4 shrink-0 object-contain"
    loading="lazy"
    decoding="async"
  />

  <span>
    +{rewardVotes}{' '}
    {rewardVotes > 1 ? t('taskCenterPage.votes') : t('taskCenterPage.vote')}
  </span>
</div>
          </div>

          <RewardButton
            tone={buttonTone}
            disabled={claiming || claimed || !claimable}
            onClick={onClaim}
          >
            {buttonText}
          </RewardButton>
        </div>

        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
            <div
              className={`h-full rounded-full ${
  claimed
    ? 'bg-[#22C55E]'
    : 'bg-[#F6B800]'
}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between gap-2 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
            <span>
              {progress}/{totalMissions} {t('taskCenterPage.missions')}
            </span>

            {claimed ? (
              <span className="font-black text-[#22C55E]">
                {t('taskCenterPage.claimed')}
              </span>
            ) : claimable ? (
              <span className="font-black text-[#2563EB] dark:text-blue-300">
  {t('taskCenterPage.ready')}
</span>
            ) : (
              <span>{t('taskCenterPage.inProgress')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


function ReadingRewardCard({ readingReward, onRead, onClaim, claiming }) {
  const { t } = useDisplayTranslation()
  const fallbackMilestones = [
    { seconds: 60, minutes: 1, coins: 5, completed: false, claimed: false, claimable: false },
    { seconds: 300, minutes: 5, coins: 5, completed: false, claimed: false, claimable: false },
    { seconds: 600, minutes: 10, coins: 10, completed: false, claimed: false, claimable: false },
    { seconds: 1200, minutes: 20, coins: 15, completed: false, claimed: false, claimable: false },
    { seconds: 1800, minutes: 30, coins: 15, completed: false, claimed: false, claimable: false },
  ]

  const activeSeconds = Number(readingReward?.active_seconds || 0)
  const targetSeconds = Number(readingReward?.target_seconds || 1800)
  const earnedCoins = Number(readingReward?.total_earned_coins || 0)
  const claimableCoins = Number(readingReward?.claimable_coins || 0)
  const milestones = readingReward?.milestones?.length ? readingReward.milestones : fallbackMilestones
  const progressPercent = targetSeconds > 0 ? Math.min(100, (activeSeconds / targetSeconds) * 100) : 0
  const buttonText = claimableCoins > 0 ? t('taskCenterPage.claimPlus', { count: claimableCoins }) : readingReward?.done_today ? t('taskCenterPage.done') : t('taskCenterPage.readNow')

  return (
    <div className="border-b border-[var(--shadow-border)] py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[#ff3f62] ring-1 ring-[#ff3f62]/10 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/15">
          <i className="fa-solid fa-book-open-reader text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] font-black leading-5 text-[var(--shadow-text-primary)]">
                {t('taskCenterPage.coinsEarned', { count: formatNumber(earnedCoins) })}
              </h3>
              <p className="mt-1 text-[13px] font-black leading-5 text-[var(--shadow-text-primary)]">{t('taskCenterPage.readAndEarn')}</p>
              <p className="mt-1 text-[11px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">
                {t('taskCenterPage.readRewardHelp')}
              </p>
            </div>

            <RewardButton
              tone={claimableCoins > 0 ? 'gold' : readingReward?.done_today ? 'soft' : 'outline'}
              disabled={claiming || Boolean(readingReward?.done_today)}
              onClick={claimableCoins > 0 ? onClaim : onRead}
            >
              {claiming ? t('taskCenterPage.claiming') : buttonText}
            </RewardButton>
          </div>

          <div className="mt-4">
            <div className="relative h-2 rounded-full bg-[var(--shadow-bg-soft)]">
              <div className="h-full rounded-full bg-[#ffd58a]" style={{ width: `${progressPercent}%` }} />

              {milestones.map((item) => {
                const left = targetSeconds > 0 ? Math.min(100, (Number(item.seconds || 0) / targetSeconds) * 100) : 0

                return (
                  <span
                    key={item.seconds}
                    className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white dark:ring-[var(--shadow-bg-surface)] ${
                      item.claimed ? 'bg-[#ff3f62]' : item.completed ? 'bg-[#ffb800]' : 'bg-[#dbe1ea] dark:bg-slate-600'
                    }`}
                    style={{ left: `${left}%` }}
                  />
                )
              })}
            </div>

            <div className="relative mt-2 h-4">
              {milestones.map((item) => {
                const left = targetSeconds > 0 ? Math.min(100, (Number(item.seconds || 0) / targetSeconds) * 100) : 0

                return (
                  <span
                    key={item.seconds}
                    className="absolute -translate-x-1/2 text-[10px] font-bold text-[var(--shadow-text-secondary)]"
                    style={{ left: `${left}%` }}
                  >
                    {t('taskCenterPage.minuteMarker', { count: item.minutes })}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminReadingMissionCard({ task, claimingMissionId = '', onGo, onClaim }) {
  const { t } = useDisplayTranslation()

  if (!task?.is_active) return null

  const targetMinutes = Math.max(1, Number(task.target_minutes || 1))
  const targetSeconds = Math.max(60, Number(task.target_seconds || targetMinutes * 60))
  const activeSeconds = Math.min(targetSeconds, Number(task.active_seconds || 0))
  const progressMinutes = Math.min(targetMinutes, Math.floor(activeSeconds / 60))
  const percent = targetSeconds > 0 ? Math.min(100, (activeSeconds / targetSeconds) * 100) : 0
  const rewardCoins = Number(task.reward_coins || 0)
  const claimed = Boolean(task.claimed)
  const claimable = Boolean(task.claimable)
  const claiming = claimingMissionId === task.id
  const fallbackTitle = `Read ${targetMinutes} minutes`
  const displayTitle = !task.title || task.title === fallbackTitle
    ? t('taskCenterPage.readMinutes', { count: targetMinutes })
    : task.title
  const displaySubtitle = !task.subtitle || task.subtitle === 'Keep reading longer to earn more coins.'
    ? t('taskCenterPage.readingSubtitle')
    : task.subtitle
  const fallbackButton = task.button_text || 'Go'
  const buttonText = claimed
    ? t('taskCenterPage.done')
    : claimable
      ? t('taskCenterPage.claimPlus', { count: formatNumber(rewardCoins) })
      : fallbackButton === 'Go'
        ? t('taskCenterPage.go')
        : fallbackButton
  const buttonTone = claimed ? 'soft' : 'gold'

  return (
    <div className="flex gap-3 border-b border-[var(--shadow-border)] py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1ecff] text-[#7c3aed] ring-1 ring-[#7c3aed]/15 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/15">
        <i className={`${claimable ? 'fa-solid fa-coins' : 'fa-regular fa-clock'} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[var(--shadow-text-primary)]">
              {displayTitle}
            </h3>

            <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">
              {displaySubtitle}
            </p>

            <div className="mt-2 flex items-center gap-1 text-[12px] font-black text-[#d97706] dark:text-amber-300">
              <CoinIcon className="h-4 w-4" />
              <span>+{formatNumber(rewardCoins)}</span>
            </div>
          </div>

          <RewardButton
            tone={buttonTone}
            disabled={claiming || claimed}
            onClick={claimable ? () => onClaim(task) : () => onGo(task)}
          >
            {claiming ? t('taskCenterPage.claiming') : buttonText}
          </RewardButton>
        </div>

        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
            <div className={`h-full rounded-full ${claimed ? 'bg-[#22C55E]' : 'bg-[#F6B800]'}`} style={{ width: `${percent}%` }} />
          </div>

          <div className="mt-1 flex items-center justify-between gap-2 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
            <span>{t('taskCenterPage.progressMinutes', { progress: progressMinutes, target: targetMinutes })}</span>
            {claimed ? <span className="font-black text-[#22C55E]">{t('taskCenterPage.claimed')}</span> : claimable ? <span className="font-black text-[#d97706] dark:text-amber-300">{t('taskCenterPage.ready')}</span> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingRewardChest({ chest, onClick, claiming }) {
  const { t } = useDisplayTranslation()
  const availableChests = Number(chest?.available_chests || 0)
  const isReady = availableChests > 0
  const isFull = Boolean(chest?.is_full)
  const label = isFull ? t('taskCenterPage.full') : availableChests > 1 ? `x${availableChests}` : t('taskCenterPage.ready')
  const timeText = formatDuration(chest?.ms_until_next || 0)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[106px] z-[80] mx-auto h-[116px] max-w-[760px]">
      <button
        type="button"
        onClick={onClick}
        disabled={claiming}
        className={`pointer-events-auto absolute bottom-0 right-2 flex h-[112px] w-[112px] items-end justify-center active:scale-95 disabled:opacity-70 sm:right-4 ${
          isReady ? 'shadowChestReady' : 'opacity-90'
        }`}
        aria-label={t('taskCenterPage.rewardChest')}
      >
        <span className={`absolute bottom-1 h-16 w-16 rounded-full ${isReady ? 'bg-[#ffb800]/30 blur-xl' : 'bg-black/10 blur-lg'}`} />

        <img
          src="/assets/Task%20Center/Chest/chest-closed.png?v=2"
          alt={t('taskCenterPage.rewardChest')}
          className="relative z-10 h-[92px] w-[104px] object-contain drop-shadow-[0_12px_18px_rgba(17,24,39,0.22)]"
        />

        {isReady ? (
          <span className="absolute bottom-0 right-2 z-20 rounded-full bg-gradient-to-r from-[#ff3f62] to-[#ff8a00] px-3 py-1 text-[12px] font-black text-white shadow-[0_8px_18px_rgba(255,63,98,0.25)]">
            {label}
          </span>
        ) : null}

        {!isReady && Number(chest?.ms_until_next || 0) > 0 ? (
  <span className="absolute bottom-0 right-2 z-20 rounded-full bg-gradient-to-r from-[#ff3f62] to-[#ff8a00] px-3 py-1 text-[12px] font-black text-white shadow-[0_8px_18px_rgba(255,63,98,0.25)]">
    {timeText}
  </span>
) : null}
        
      </button>
    </div>
  )
}

function RewardChestPopup({ reward, onClaim }) {
  const { t } = useDisplayTranslation()

  if (!reward) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/65 px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <CoinIcon className="shadowCoinBurst shadowCoinBurstOne absolute left-[18%] top-[30%] h-9 w-9" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstTwo absolute right-[19%] top-[28%] h-8 w-8" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstThree absolute left-[26%] bottom-[31%] h-7 w-7" />
        <CoinIcon className="shadowCoinBurst shadowCoinBurstFour absolute right-[27%] bottom-[32%] h-7 w-7" />
        <span className="absolute left-[17%] top-[40%] h-2 w-2 animate-ping rounded-full bg-[#F6B800]" />
        <span className="absolute right-[18%] top-[43%] h-2 w-2 animate-ping rounded-full bg-white" />
        <span className="absolute left-[42%] top-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-[#fff1a8]" />
        <span className="absolute right-[40%] bottom-[28%] h-1.5 w-1.5 animate-pulse rounded-full bg-[#fff1a8]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[390px] flex-col items-center text-center">
        <h3 className="text-[22px] font-bold leading-7 text-[#ffcc32] drop-shadow-[0_3px_0_rgba(108,65,0,0.35)]">
  {t('taskCenterPage.surpriseGot')}
</h3>

        <div className="shadowRewardPop mt-3 flex items-center justify-center gap-2">
          <CoinIcon className="h-12 w-12" />
          <span className="text-[40px] font-bold leading-none text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
  +{formatNumber(reward.coins)}
</span>
        </div>

        <div className="relative mt-5 flex h-[235px] w-full items-center justify-center">
          <span className="shadowPopupGlow absolute h-[210px] w-[210px] rounded-full bg-[#ffbd28]/35 blur-3xl" />
          <span className="absolute h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(255,230,115,0.35)_0%,rgba(255,184,0,0.12)_42%,rgba(255,184,0,0)_70%)]" />

          <img
            src="/assets/Task%20Center/Chest/chest-open.png?v=3"
            alt={t('taskCenterPage.openedRewardChest')}
            className="shadowChestOpen relative z-10 h-[220px] w-[300px] object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.38)]"
          />
        </div>

        <button
          type="button"
          onClick={onClaim}
          className="mt-5 flex h-12 w-[260px] items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_12px_26px_rgba(255,63,98,0.34)] active:scale-[0.98]"
        >
          {t('taskCenterPage.claim')}
        </button>
      </div>
    </div>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [wallet, setWallet] = useState({ coins: 0, diamonds: 0, vouchers: 0 })
  const [checkIn, setCheckIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')
  const [showCheckInRules, setShowCheckInRules] = useState(false)
  const [giftReward, setGiftReward] = useState(null)
  const [rewardChest, setRewardChest] = useState(null)
  const [chestReward, setChestReward] = useState(null)
  const [chestClaiming, setChestClaiming] = useState(false)
  const [readingReward, setReadingReward] = useState(null)
  const [readingClaiming, setReadingClaiming] = useState(false)
  const [dailyVoteReward, setDailyVoteReward] = useState(null)
  const [voteClaiming, setVoteClaiming] = useState(false)
  const [chestTick, setChestTick] = useState(Date.now())
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderLoading, setReminderLoading] = useState(false)
  const [taskCoverUrl, setTaskCoverUrl] = useState('')
  const [readingMissions, setReadingMissions] = useState([])
  const [missionClaimingId, setMissionClaimingId] = useState('')
  const [scrolledPastCover, setScrolledPastCover] = useState(false)
  const coverRef = useRef(null)
  const smartRefreshVersionRef = useRef('')
  const smartRefreshTimerRef = useRef(null)
  const smartRefreshChecksRef = useRef(0)
  const smartRefreshCooldownUntilRef = useRef(0)
  const loadTaskCenterRef = useRef(null)
  const token = getReaderToken()
  const storedUser = getStoredUser()
  const isLoggedIn = Boolean(token)
  const tier = String(storedUser?.reader_tier || storedUser?.subscription_tier || storedUser?.role || 'free').toLowerCase()
  const isPremium = tier === 'premium' || tier === 'vip'

  const fallbackCheckIn = useMemo(() => ({
    current_day: 1,
    claimed_today: false,
    streak_count: 0,
    premium_auto_claim: isPremium,
    rewards: fallbackRewards,
  }), [isPremium])

  const currentCheckIn = checkIn || fallbackCheckIn
  const rewards = currentCheckIn.rewards || fallbackRewards
  const currentDay = Math.min(Math.max(Number(currentCheckIn.current_day || 1), 1), 7)
  const claimedToday = Boolean(currentCheckIn.claimed_today)
  const streakCount = Number(currentCheckIn.streak_count || (claimedToday ? currentDay : Math.max(currentDay - 1, 0)))
  const coverImageUrl = taskCoverUrl || '/assets/Task%20Center/Task%20background%202.webp'
  const liveRewardChest = useMemo(() => {
    chestTick
    return getLiveChest(rewardChest)
  }, [rewardChest, chestTick])

  async function loadTaskCover() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/task-center/public`)
      const data = await response.json().catch(() => ({}))

      if (response.ok && data.ok) {
        setTaskCoverUrl(data.settings?.cover_url || '')
      }
    } catch {
      setTaskCoverUrl('')
    }
  }

  async function refreshDailyVoteReward() {
    if (!token) {
      setDailyVoteReward(null)
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/daily-vote-reward`,
        {
          headers: getHeaders(),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('taskCenterPage.loadDailyVoteFailed'))
      }

      setDailyVoteReward(data.daily_vote_reward || null)
    } catch (error) {
      console.error('LOAD DAILY VOTE REWARD ERROR:', error)
      setDailyVoteReward(null)
    }
  }

  async function loadTaskCenter(options = {}) {
  const silent = Boolean(options.silent)

  if (!token) {
    if (!silent) setLoading(false)
    setWallet({ coins: 0, diamonds: 0, vouchers: 0 })
    setCheckIn(null)
    setRewardChest(null)
    setReadingReward(null)
    setReadingMissions([])
    setDailyVoteReward(null)
    return
  }

  try {
    if (!silent) setLoading(true)
    setMessage('')

    const response = await fetch(`${API_BASE_URL}/api/tasks/overview`, {
      headers: getHeaders(),
    })

    const data = await response.json().catch(() => ({}))

    if (response.status === 401 || response.status === 403) {
      clearReaderSession()
      setToast(t('taskCenterPage.pleaseLoginAgain'))
      navigate('/login')
      return
    }

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || t('taskCenterPage.loadTaskCenterFailed'))
    }

    if (data.wallet) {
      setWallet({
        coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? 0),
        diamonds: Number(data.wallet.diamond_balance ?? 0),
        vouchers: Number(data.wallet.voucher_balance ?? 0),
      })
    }

    setCheckIn(data.check_in || null)
    setRewardChest(data.chest || null)
    setReadingReward(data.reading_reward || null)
    setReadingMissions(normalizeReadingMissionList(data.missions))
    setDailyVoteReward(data.daily_vote_reward || null)
  } catch (error) {
    console.error('LOAD TASK CENTER OVERVIEW ERROR:', error)
    setToast(t('taskCenterPage.couldNotLoadRewards'))
  } finally {
    if (!silent) setLoading(false)
  }
}


  async function fetchTaskCenterVersion() {
  const response = await fetch(`${API_BASE_URL}/api/task-center/public/version`, {
    cache: 'no-store',
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to check task center version')
  }

  return String(data.version || '')
}

function clearSmartRefreshTimer() {
  if (smartRefreshTimerRef.current) {
    window.clearInterval(smartRefreshTimerRef.current)
    smartRefreshTimerRef.current = null
  }
}

async function checkTaskCenterVersion({ refreshOnChange = false } = {}) {
  if (document.visibilityState !== 'visible') return false

  const nextVersion = await fetchTaskCenterVersion().catch(() => '')

  if (!nextVersion) return false

  const previousVersion = smartRefreshVersionRef.current

  if (!previousVersion) {
    smartRefreshVersionRef.current = nextVersion
    return false
  }

  if (nextVersion !== previousVersion) {
    smartRefreshVersionRef.current = nextVersion

    if (refreshOnChange) {
      await Promise.allSettled([
        loadTaskCenterRef.current?.({ silent: true }),
        loadTaskCover(),
      ])
    }

    return true
  }

  return false
}

function startSmartRefreshCycle() {
  return
}

  async function loadReminderSetting() {
    if (!isLoggedIn) {
      setReminderEnabled(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mails/daily-checkin-reminder`, {
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.ok) {
        setReminderEnabled(Boolean(data.enabled))
      }
    } catch {
      setReminderEnabled(false)
    }
  }

  async function toggleReminder() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (reminderLoading) return

    try {
      setReminderLoading(true)
      setMessage('')

      const nextEnabled = !reminderEnabled

      const response = await fetch(`${API_BASE_URL}/api/mails/daily-checkin-reminder`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ enabled: nextEnabled }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('taskCenterPage.updateReminderFailed'))
      }

      setReminderEnabled(Boolean(data.enabled))
      setToast(data.enabled ? t('taskCenterPage.reminderOn') : t('taskCenterPage.reminderOff'))
    } catch (error) {
      setToast(error.message || t('taskCenterPage.updateReminderFailed'))
    } finally {
      setReminderLoading(false)
    }
  }

  async function claimToday() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (claiming || claimedToday) return

    try {
      setClaiming(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/tasks/check-in/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgainClaimCoins'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('taskCenterPage.rewardNotAvailable'))
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      setCheckIn(data.check_in || { ...currentCheckIn, claimed_today: true })
      await refreshDailyVoteReward()

      const rewardCoins = Number(
        data.reward?.coins ??
          data.reward?.gems ??
          data.history_item?.amount_coins ??
          data.history_item?.amount_gems ??
          0
      )
      const rewardVouchers = Number(
        data.reward?.vouchers ??
          data.history_item?.amount_vouchers ??
          0
      )
      const storyCards = Number(
        data.reward?.story_cards ??
          data.history_item?.story_cards ??
          0
      )
      const isGiftReward = Boolean(
        data.reward?.gift ||
          rewardVouchers > 0 ||
          storyCards > 0
      )

      if (isGiftReward) {
        setGiftReward({
          coins: rewardCoins,
          vouchers: rewardVouchers,
        })
      } else {
        setToast(data.message || t('taskCenterPage.coinsAddedWallet'))
      }
    } catch (error) {
      setToast(error.message || t('taskCenterPage.rewardNotAvailable'))
    } finally {
      setClaiming(false)
    }
  }

  async function claimRewardChest() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    const liveChest = getLiveChest(rewardChest)
    const availableChests = Number(liveChest.available_chests || 0)

    if (availableChests < 1) {
      const waitText = liveChest.ms_until_next > 0 ? t('taskCenterPage.nextChestIn', { time: formatDuration(liveChest.ms_until_next) }) : t('taskCenterPage.chestNotReady')
      setToast(waitText)
      return
    }

    if (chestClaiming) return

    try {
      setChestClaiming(true)

      const response = await fetch(`${API_BASE_URL}/api/tasks/reward-chest/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        if (data.chest) setRewardChest(data.chest)
        throw new Error(data.message || t('taskCenterPage.chestNotReady'))
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      if (data.chest) {
        setRewardChest(data.chest)
        setChestTick(Date.now())
      }

      setChestReward({
        coins: Number(data.reward?.coins ?? data.reward?.gems ?? data.history_item?.amount_coins ?? data.history_item?.amount_gems ?? 0),
      })
    } catch (error) {
      setToast(error.message || t('taskCenterPage.claimChestFailed'))
       } finally {
      setChestClaiming(false)
    }
  }

  async function claimReadingReward() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (readingClaiming) return

    try {
      setReadingClaiming(true)

      const response = await fetch(`${API_BASE_URL}/api/tasks/reading-reward/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('taskCenterPage.noReadingReward'))
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      if (data.reading_reward) {
        setReadingReward(data.reading_reward)
      }

      await refreshDailyVoteReward()

      setToast(t('taskCenterPage.coinsAdded', { count: formatNumber(data.reward?.coins || data.reward?.gems || 0) }))
    } catch (error) {
      setToast(error.message || t('taskCenterPage.readingRewardClaimFailed'))
    } finally {
      setReadingClaiming(false)
    }
  }

  function goToReadingMission(mission) {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    const targetPath = normalizeTaskLink(mission?.story_link)
    const normalizedMission = normalizeReadingMission(mission)

try {
  sessionStorage.setItem(ACTIVE_READING_MISSION_KEY, JSON.stringify(normalizedMission))
} catch {
}

navigate(targetPath, {
  state: {
    fromTaskCenter: true,
    returnTo: '/tasks',
    taskMissionId: normalizedMission?.id,
    taskMission: normalizedMission,
  },
})
  }

  async function claimReadingMissionReward(mission) {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!mission?.id || missionClaimingId) return

    try {
      setMissionClaimingId(mission.id)

      const response = await fetch(`${API_BASE_URL}/api/tasks/reading-missions/${mission.id}/claim`, {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('taskCenterPage.readingMissionUnavailable'))
      }

      if (data.wallet) {
        setWallet({
          coins: Number(data.wallet.coin_balance ?? data.wallet.gem_balance ?? wallet.coins ?? 0),
          diamonds: Number(data.wallet.diamond_balance ?? wallet.diamonds ?? 0),
          vouchers: Number(data.wallet.voucher_balance ?? wallet.vouchers ?? 0),
        })
      }

      if (Array.isArray(data.missions)) {
        setReadingMissions(normalizeReadingMissionList(data.missions))
      } else if (data.mission) {
        setReadingMissions((current) =>
          current.map((item, index) =>
            item.id === data.mission.id
              ? normalizeReadingMission(data.mission, index)
              : item
          )
        )
      }

      await refreshDailyVoteReward()

      setToast(t('taskCenterPage.coinsAdded', { count: formatNumber(data.reward?.coins || data.reward?.gems || 0) }))
    } catch (error) {
      setToast(error.message || t('taskCenterPage.readingMissionClaimFailed'))
    } finally {
      setMissionClaimingId('')
    }
  }

  async function claimDailyVoteReward() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (voteClaiming || !dailyVoteReward?.claimable) return

    try {
      setVoteClaiming(true)

      const response = await fetch(
        `${API_BASE_URL}/api/tasks/daily-vote-reward/claim`,
        {
          method: 'POST',
          headers: getHeaders(),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        setToast(t('taskCenterPage.pleaseLoginAgain'))
        navigate('/login')
        return
      }

      if (!response.ok || data.ok === false) {
        if (data.daily_vote_reward) {
          setDailyVoteReward(data.daily_vote_reward)
        }

        throw new Error(data.message || t('taskCenterPage.dailyVoteUnavailable'))
      }

      if (data.daily_vote_reward) {
        setDailyVoteReward(data.daily_vote_reward)
      } else {
        await refreshDailyVoteReward()
      }

      setToast(data.message || t('taskCenterPage.dailyVoteClaimed'))
    } catch (error) {
      setToast(error.message || t('taskCenterPage.dailyVoteClaimFailed'))
    } finally {
      setVoteClaiming(false)
    }
  }

  useEffect(() => {
    loadTaskCover()
    loadTaskCenter()
    loadReminderSetting()
  }, [])

  useEffect(() => {
    loadTaskCenterRef.current = loadTaskCenter
  })

  useEffect(() => {
    if (!isLoggedIn) return undefined

    let cancelled = false

    checkTaskCenterVersion({ refreshOnChange: false }).finally(() => {
      if (!cancelled) startSmartRefreshCycle()
    })

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTaskCenterVersion({ refreshOnChange: true }).finally(() => {
          startSmartRefreshCycle()
        })
        return
      }

      clearSmartRefreshTimer()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearSmartRefreshTimer()
    }
  }, [isLoggedIn])

 useEffect(() => {
  const shouldLock = Boolean(chestReward || giftReward)

  if (!shouldLock) return undefined

  const previousBodyOverflow = document.body.style.overflow
  const previousHtmlOverflow = document.documentElement.style.overflow

  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
  }
}, [chestReward, giftReward])

  useEffect(() => {
    if (!toast) return undefined

    const timer = window.setTimeout(() => {
      setToast('')
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
  const timer = window.setInterval(() => setChestTick(Date.now()), 1000)

  return () => window.clearInterval(timer)
}, [])

  useEffect(() => {
    function handleScroll() {
      const coverHeight = coverRef.current?.offsetHeight || 220
      setScrolledPastCover(window.scrollY > coverHeight - 56)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <style>
        {`
          @keyframes shadowToast {
            0% { opacity: 0; transform: translate(-50%, 12px) scale(0.98); }
            12% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            82% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            100% { opacity: 0; transform: translate(-50%, 12px) scale(0.98); }
          }

          @keyframes shadowChestReady {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            8% { transform: translateY(-14px) rotate(0deg); }
            15% { transform: translateY(-14px) rotate(-8deg); }
            22% { transform: translateY(-14px) rotate(8deg); }
            29% { transform: translateY(-14px) rotate(-7deg); }
            36% { transform: translateY(-14px) rotate(7deg); }
            43% { transform: translateY(-14px) rotate(-4deg); }
            50% { transform: translateY(-14px) rotate(4deg); }
            58% { transform: translateY(-14px) rotate(0deg); }
            72% { transform: translateY(0) rotate(0deg); }
          }

          @keyframes shadowChestOpen {
            0% { opacity: 0; transform: scale(0.82) translateY(16px); }
            55% { opacity: 1; transform: scale(1.08) translateY(-4px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }

          @keyframes shadowCoinBurstOne {
            0% { opacity: 0; transform: translate(36px, 72px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(-24px, -56px) scale(1) rotate(-28deg); }
          }

          @keyframes shadowCoinBurstTwo {
            0% { opacity: 0; transform: translate(-36px, 72px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(26px, -54px) scale(1) rotate(28deg); }
          }

          @keyframes shadowCoinBurstThree {
            0% { opacity: 0; transform: translate(40px, -10px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(-32px, 36px) scale(0.9) rotate(22deg); }
          }

          @keyframes shadowCoinBurstFour {
            0% { opacity: 0; transform: translate(-40px, -10px) scale(0.4) rotate(0deg); }
            20% { opacity: 1; }
            100% { opacity: 0; transform: translate(32px, 36px) scale(0.9) rotate(-22deg); }
          }

          .shadowChestReady {
            animation: shadowChestReady 2.4s ease-in-out infinite;
            transform-origin: 50% 78%;
            will-change: transform;
          }

          .shadowChestOpen {
            animation: shadowChestOpen 0.48s ease-out both;
          }

          @keyframes shadowPopupGlow {
  0% { opacity: 0.55; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.08); }
}

@keyframes shadowRewardPop {
  0% { opacity: 0; transform: scale(0.72) translateY(10px); }
  65% { opacity: 1; transform: scale(1.12) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.shadowPopupGlow {
  animation: shadowPopupGlow 1.15s ease-in-out infinite alternate;
}

.shadowRewardPop {
  animation: shadowRewardPop 0.42s ease-out both;
}

@keyframes shadowGiftOpen {
  0% { opacity: 0; transform: scale(0.78) translateY(18px); }
  55% { opacity: 1; transform: scale(1.08) translateY(-5px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.shadowGiftOpen {
  animation: shadowGiftOpen 0.5s ease-out both;
}

@keyframes shadowFirework {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  14% {
    opacity: 1;
    transform: scale(0.65);
  }
  55% {
    opacity: 0.95;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.28);
  }
}

.shadowFirework {
  position: absolute;
  height: 92px;
  width: 92px;
  border-radius: 9999px;
  background:
    radial-gradient(circle, rgba(255,255,255,0.98) 0 3px, transparent 4px),
    repeating-conic-gradient(
      from 0deg,
      rgba(255,220,70,0.95) 0deg 4deg,
      transparent 4deg 18deg
    );
  filter: drop-shadow(0 0 12px rgba(255,205,55,0.8));
  mix-blend-mode: screen;
  animation: shadowFirework 2.8s ease-out both;
}

.shadowFireworkLeft {
  left: 10%;
  top: 17%;
  animation-delay: 0.05s;
}

.shadowFireworkRight {
  right: 10%;
  top: 18%;
  animation-delay: 0.35s;
}

.shadowFireworkTop {
  left: 50%;
  top: 10%;
  transform-origin: center;
  animation-delay: 0.65s;
}

          .shadowCoinBurst {
            animation-duration: 1.25s;
            animation-timing-function: ease-out;
            animation-iteration-count: infinite;
          }

          .shadowCoinBurstOne { animation-name: shadowCoinBurstOne; }
          .shadowCoinBurstTwo { animation-name: shadowCoinBurstTwo; animation-delay: 0.12s; }
          .shadowCoinBurstThree { animation-name: shadowCoinBurstThree; animation-delay: 0.2s; }
          .shadowCoinBurstFour { animation-name: shadowCoinBurstFour; animation-delay: 0.28s; }
        `}
      </style>

      {chestReward ? (
        <RewardChestPopup
          reward={chestReward}
          onClaim={() => {
            setChestReward(null)
            setToast(t('taskCenterPage.rewardAddedWallet'))
            setChestTick(Date.now())
            loadTaskCenter()
          }}
        />
      ) : null}

      {giftReward ? (
  <DailyGiftRewardPopup
    reward={giftReward}
    onClose={() => {
      setGiftReward(null)
      setToast(t('taskCenterPage.rewardAddedWallet'))
    }}
  />
) : null}

      {showCheckInRules ? (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45 px-6">
          <button
            type="button"
            aria-label={t('taskCenterPage.closeCheckInRules')}
            className="absolute inset-0"
            onClick={() => setShowCheckInRules(false)}
          />

          <div className="relative w-full max-w-[340px] rounded-[26px] bg-[var(--shadow-bg-elevated)] px-6 py-7 text-center shadow-[0_18px_50px_rgba(17,24,39,0.22)] ring-1 ring-[var(--shadow-border)]">
            <h3 className="text-[20px] font-black leading-7 text-[var(--shadow-text-primary)]">
              {t('taskCenterPage.checkInRules')}
            </h3>

            <p className="mt-4 text-[14px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
              {t('taskCenterPage.checkInRulesBody1')}
            </p>

            <p className="mt-3 text-[13px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {t('taskCenterPage.premiumAutoClaim')}
            </p>

            <button
              type="button"
              onClick={() => setShowCheckInRules(false)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#ff3f62] text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,63,98,0.24)] active:scale-[0.98]"
            >
              {t('taskCenterPage.gotIt')}
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className="fixed bottom-[92px] left-1/2 z-[9999] max-w-[320px] rounded-full bg-black/55 px-4 py-2.5 text-center text-[12px] font-normal text-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md"
          style={{ animation: 'shadowToast 2.2s ease forwards' }}
        >
          {toast}
        </div>
      ) : null}

      <FloatingRewardChest
        chest={liveRewardChest}
        claiming={chestClaiming}
        onClick={claimRewardChest}
      />

      <main className="mx-auto max-w-[760px] bg-[var(--shadow-bg-page)] pt-0">
        <div ref={coverRef} className="relative aspect-[16/9] overflow-hidden bg-[#ff6f86]">
          <img
            src={coverImageUrl}
            alt={t('taskCenterPage.taskCenterCover')}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/20" />

          <header
            className={`fixed left-1/2 top-0 z-50 flex h-14 w-full max-w-[760px] -translate-x-1/2 items-center justify-between px-4 transition-all duration-200 ${
              scrolledPastCover
                ? 'border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] text-[var(--shadow-text-primary)] shadow-sm backdrop-blur'
                : 'bg-transparent text-white'
            }`}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`flex h-9 w-9 items-center justify-center rounded-full active:scale-95 ${
                scrolledPastCover ? 'bg-transparent text-[var(--shadow-text-primary)]' : 'bg-white/20 text-white shadow-sm'
              }`}
              aria-label={t('taskCenterPage.goBack')}
            >
              <i className="fa-solid fa-chevron-left text-[14px]" />
            </button>

            <h1 className={`text-[16px] font-bold ${scrolledPastCover ? 'text-[var(--shadow-text-primary)]' : 'text-white drop-shadow'}`}>
              {t('taskCenterPage.taskCenter')}
            </h1>

            <button
              type="button"
              className={`flex h-9 w-9 items-center justify-center rounded-full active:scale-95 ${
                scrolledPastCover ? 'bg-transparent text-[var(--shadow-text-primary)]' : 'bg-white/20 text-white shadow-sm'
              }`}
              aria-label={t('taskCenterPage.more')}
            >
              <i className="fa-solid fa-ellipsis text-[16px]" />
            </button>
          </header>

          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#f5f3fa] via-[#f5f3fa]/75 to-transparent dark:from-[#111318] dark:via-[#111318]/75" />
        </div>

        <section className="relative z-20 -mt-11">
          <div className="overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-[0_-6px_22px_rgba(17,24,39,0.08)] ring-1 ring-[var(--shadow-border)] backdrop-blur">
            <div className="grid grid-cols-2">
              <BalanceBox
                label={t('taskCenterPage.myCoins')}
                value={wallet.coins}
                type="coin"
                onClick={() => navigate('/tasks/history')}
              />
              <BalanceBox
                label={t('taskCenterPage.myDiamonds')}
                value={wallet.diamonds}
                type="diamond"
                onClick={() => navigate('/shop', { state: { activeTab: 'Purchase', returnTo: '/tasks' } })}
              />
            </div>

            <div className="bg-[var(--shadow-bg-surface)] px-5 pb-4 pt-0">
              <p className="text-[12px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                {t('taskCenterPage.coinsUnlockHelp')}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-1.5 bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[17px] font-bold leading-6 text-[var(--shadow-text-primary)]">
                  {t('taskCenterPage.dayStreak', { count: streakCount || 0 })}
                </h2>

                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center bg-transparent text-[var(--shadow-text-tertiary)] active:scale-95"
                  aria-label={t('taskCenterPage.checkInRules')}
                  onClick={() => setShowCheckInRules(true)}
                >
                  <i className="fa-regular fa-circle-question text-[15px]" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="group flex shrink-0 items-center gap-2 bg-transparent text-[12px] font-semibold text-[var(--shadow-text-secondary)] active:scale-95 disabled:opacity-60"
              aria-label={t('taskCenterPage.reminder')}
              aria-pressed={reminderEnabled}
              disabled={reminderLoading}
              onClick={toggleReminder}
            >
              <span>{t('taskCenterPage.reminder')}</span>
              <span
                className={`relative h-[22px] w-[42px] rounded-full p-[2px] transition-all duration-300 ${
                  reminderEnabled
                    ? 'bg-[#F6B800] shadow-[0_0_0_4px_rgba(246,184,0,0.14),inset_0_1px_2px_rgba(255,255,255,0.35)]'
                    : 'bg-[#d1d5db] shadow-inner dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_2px_7px_rgba(17,24,39,0.22)] transition-all duration-300 ${
                    reminderEnabled ? 'left-[22px]' : 'left-[2px]'
                  }`}
                />
              </span>
            </button>
          </div>

          {message ? (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-4 w-full rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[var(--shadow-text-primary)]"
            >
              {message}
            </button>
          ) : null}

          <div className="mt-4 grid grid-cols-7 gap-1 pb-1 sm:gap-3">
            {rewards.map((reward) => (
              <DayReward
                key={reward.day}
                reward={reward}
                currentDay={currentDay}
                claimedToday={claimedToday}
                onClaim={claimToday}
                claiming={claiming}
              />
            ))}
          </div>
        </section>

        <section className="mt-1.5 bg-[var(--shadow-bg-surface)] p-5">
          <div className="flex items-center justify-between gap-3">
  <div>
    <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
      {t('taskCenterPage.moreRewards')}
    </h2>
  </div>
</div>

<DailyVoteRewardCard
  reward={dailyVoteReward}
  claiming={voteClaiming}
  onClaim={claimDailyVoteReward}
/>

<div className="mt-2">
            {moreRewards.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                claimedToday={claimedToday}
                onCheckIn={claimToday}
              />
            ))}

            {readingMissions
              .filter((mission) => mission?.is_active)
              .map((mission) => (
                <AdminReadingMissionCard
                  key={mission.id}
                  task={mission}
                  claimingMissionId={missionClaimingId}
                  onGo={goToReadingMission}
                  onClaim={claimReadingMissionReward}
                />
              ))}

            <ReadingRewardCard
              readingReward={readingReward}
              claiming={readingClaiming}
              onRead={() => navigate('/')}
              onClaim={claimReadingReward}
            />
          </div>
        </section>

        <section className="mt-1.5 bg-[var(--shadow-bg-surface)] px-5 py-5">
  <h3 className="text-[16px] font-black leading-6 text-[var(--shadow-text-primary)]">
    {t('taskCenterPage.notes')}
  </h3>

  <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] font-semibold leading-6 text-[var(--shadow-text-primary)]">
    <li>
      {t('taskCenterPage.noteFraud')}
    </li>

    <li>
      {t('taskCenterPage.noteEvents')}
    </li>

    <li>
      {t('taskCenterPage.noteContact')}{' '}
      <a
        href="https://web.facebook.com/AlphaCentauri12226/"
        target="_blank"
        rel="noreferrer"
        className="font-black text-[#1877F2] underline decoration-[#1877F2]/40 underline-offset-2"
      >
        “ប្រលោមលោកស្នេហា”
      </a>
      .
    </li>
  </ol>
</section>
      </main>
    </div>
  )
}
