import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerSettings', {
  "en": {
    "title": "Settings",
    "backToProfile": "Back to profile",
    "logout": "Log out",
    "comingSoon": "{{title}} is coming soon.",
    "groups": {
      "account": "Your account",
      "activity": "Your activity",
      "interaction": "How readers interact with you",
      "appSupport": "App and support"
    },
    "items": {
      "edit-profile": {
        "title": "Edit profile",
        "subtitle": "Update your name, photo, bio, and profile links."
      },
      "account-security": {
        "title": "Account & security",
        "subtitle": "Password, email, and account access."
      },
      "privacy": {
        "title": "Privacy",
        "subtitle": "Control who can see your reader space."
      },
      "blocked-readers": {
        "title": "Blocked readers",
        "subtitle": "Review readers you have blocked."
      },
      "saved-posts": {
        "title": "Saved posts",
        "subtitle": "View posts you saved for later."
      },
      "my-comments": {
        "title": "My comments",
        "subtitle": "Review your comments and replies."
      },
      "notifications": {
        "title": "Notifications",
        "subtitle": "See updates from readers, authors, and stories."
      },
      "reading-history": {
        "title": "Reading history",
        "subtitle": "Find stories and episodes you viewed."
      },
      "echo-sharing": {
        "title": "Echo and sharing",
        "subtitle": "Manage echoed posts and sharing activity."
      },
      "messages-replies": {
        "title": "Messages and replies",
        "subtitle": "Control who can contact and reply to you."
      },
      "tags-mentions": {
        "title": "Tags and mentions",
        "subtitle": "Choose who can tag or mention you."
      },
      "comment-settings": {
        "title": "Comment settings",
        "subtitle": "Manage comments on your reader posts."
      },
      "hidden-words": {
        "title": "Hidden words",
        "subtitle": "Hide words and phrases you do not want to see."
      },
      "restricted-readers": {
        "title": "Restricted readers",
        "subtitle": "Review readers with limited interaction."
      },
      "language": {
        "title": "Language",
        "subtitle": "Choose your app and reading language."
      },
      "accessibility": {
        "title": "Accessibility",
        "subtitle": "Adjust reading and display assistance."
      },
      "help-center": {
        "title": "Help Center",
        "subtitle": "Find answers and guides for using Shadow."
      },
      "feedback-support": {
        "title": "Feedback & Support",
        "subtitle": "Send feedback or request help."
      },
      "about-shadow": {
        "title": "About Shadow",
        "subtitle": "Learn more about Shadow and its purpose."
      }
    }
  },
  "km": {
    "title": "ការកំណត់",
    "backToProfile": "ត្រឡប់ទៅ Profile",
    "logout": "ចាកចេញ",
    "comingSoon": "{{title}} នឹងមកដល់ឆាប់ៗនេះ។",
    "groups": {
      "account": "គណនីរបស់អ្នក",
      "activity": "សកម្មភាពរបស់អ្នក",
      "interaction": "របៀបដែលអ្នកអានធ្វើអន្តរកម្មជាមួយអ្នក",
      "appSupport": "កម្មវិធី និងជំនួយ"
    },
    "items": {
      "edit-profile": {
        "title": "កែ Profile",
        "subtitle": "កែឈ្មោះ រូបថត Bio និង Profile links របស់អ្នក។"
      },
      "account-security": {
        "title": "គណនី និងសុវត្ថិភាព",
        "subtitle": "Password, Email និងការចូលប្រើគណនី។"
      },
      "privacy": {
        "title": "ឯកជនភាព",
        "subtitle": "គ្រប់គ្រងអ្នកដែលអាចមើលឃើញ Reader space របស់អ្នក។"
      },
      "blocked-readers": {
        "title": "អ្នកអានដែលបាន Block",
        "subtitle": "ពិនិត្យអ្នកអានដែលអ្នកបាន Block។"
      },
      "saved-posts": {
        "title": "Posts ដែលបានរក្សាទុក",
        "subtitle": "មើល Posts ដែលអ្នកបានរក្សាទុកសម្រាប់ពេលក្រោយ។"
      },
      "my-comments": {
        "title": "មតិយោបល់របស់ខ្ញុំ",
        "subtitle": "ពិនិត្យមតិយោបល់ និងការឆ្លើយតបរបស់អ្នក។"
      },
      "notifications": {
        "title": "ការជូនដំណឹង",
        "subtitle": "មើល Update ពីអ្នកអាន អ្នកនិពន្ធ និងរឿង។"
      },
      "reading-history": {
        "title": "ប្រវត្តិការអាន",
        "subtitle": "រករឿង និងភាគដែលអ្នកបានមើល។"
      },
      "echo-sharing": {
        "title": "Echo និងការចែករំលែក",
        "subtitle": "គ្រប់គ្រង Posts ដែលបាន Echo និងសកម្មភាពចែករំលែក។"
      },
      "messages-replies": {
        "title": "សារ និងការឆ្លើយតប",
        "subtitle": "គ្រប់គ្រងអ្នកដែលអាចទាក់ទង និងឆ្លើយតបទៅអ្នក។"
      },
      "tags-mentions": {
        "title": "Tags និង Mentions",
        "subtitle": "ជ្រើសរើសអ្នកដែលអាច Tag ឬ Mention អ្នក។"
      },
      "comment-settings": {
        "title": "ការកំណត់មតិយោបល់",
        "subtitle": "គ្រប់គ្រងមតិយោបល់លើ Reader posts របស់អ្នក។"
      },
      "hidden-words": {
        "title": "ពាក្យដែលបានលាក់",
        "subtitle": "លាក់ពាក្យ និងឃ្លាដែលអ្នកមិនចង់ឃើញ។"
      },
      "restricted-readers": {
        "title": "អ្នកអានដែលបានដាក់កម្រិត",
        "subtitle": "ពិនិត្យអ្នកអានដែលមានអន្តរកម្មកំណត់។"
      },
      "language": {
        "title": "ភាសា",
        "subtitle": "ជ្រើសរើសភាសាកម្មវិធី និងភាសាអាន។"
      },
      "accessibility": {
        "title": "ភាពងាយស្រួលប្រើប្រាស់",
        "subtitle": "កែការជួយអាន និងការបង្ហាញ។"
      },
      "help-center": {
        "title": "មជ្ឈមណ្ឌលជំនួយ",
        "subtitle": "រកចម្លើយ និងការណែនាំសម្រាប់ការប្រើ Shadow។"
      },
      "feedback-support": {
        "title": "មតិកែលម្អ និងជំនួយ",
        "subtitle": "ផ្ញើមតិកែលម្អ ឬស្នើសុំជំនួយ។"
      },
      "about-shadow": {
        "title": "អំពី Shadow",
        "subtitle": "ស្វែងយល់បន្ថែមអំពី Shadow និងគោលបំណងរបស់វា។"
      }
    }
  },
  "zh": {
    "title": "设置",
    "backToProfile": "返回个人资料",
    "logout": "退出登录",
    "comingSoon": "{{title}} 即将推出。",
    "groups": {
      "account": "你的账号",
      "activity": "你的活动",
      "interaction": "读者与你的互动",
      "appSupport": "应用与支持"
    },
    "items": {
      "edit-profile": {
        "title": "编辑个人资料",
        "subtitle": "更新姓名、头像、简介和个人资料链接。"
      },
      "account-security": {
        "title": "账号与安全",
        "subtitle": "管理密码、邮箱和账号访问。"
      },
      "privacy": {
        "title": "隐私",
        "subtitle": "控制谁可以查看你的读者空间。"
      },
      "blocked-readers": {
        "title": "已屏蔽读者",
        "subtitle": "查看你已屏蔽的读者。"
      },
      "saved-posts": {
        "title": "已保存帖子",
        "subtitle": "查看你保存以便稍后阅读的帖子。"
      },
      "my-comments": {
        "title": "我的评论",
        "subtitle": "查看你的评论和回复。"
      },
      "notifications": {
        "title": "通知",
        "subtitle": "查看来自读者、作者和故事的更新。"
      },
      "reading-history": {
        "title": "阅读历史",
        "subtitle": "查找你浏览过的故事和章节。"
      },
      "echo-sharing": {
        "title": "Echo 与分享",
        "subtitle": "管理 Echo 帖子和分享活动。"
      },
      "messages-replies": {
        "title": "消息与回复",
        "subtitle": "控制谁可以联系或回复你。"
      },
      "tags-mentions": {
        "title": "标签与提及",
        "subtitle": "选择谁可以标记或提及你。"
      },
      "comment-settings": {
        "title": "评论设置",
        "subtitle": "管理读者帖子上的评论。"
      },
      "hidden-words": {
        "title": "隐藏词语",
        "subtitle": "隐藏你不想看到的词语和短语。"
      },
      "restricted-readers": {
        "title": "受限读者",
        "subtitle": "查看互动受限的读者。"
      },
      "language": {
        "title": "语言",
        "subtitle": "选择应用和阅读语言。"
      },
      "accessibility": {
        "title": "辅助功能",
        "subtitle": "调整阅读和显示辅助功能。"
      },
      "help-center": {
        "title": "帮助中心",
        "subtitle": "查找使用 Shadow 的答案和指南。"
      },
      "feedback-support": {
        "title": "反馈与支持",
        "subtitle": "发送反馈或请求帮助。"
      },
      "about-shadow": {
        "title": "关于 Shadow",
        "subtitle": "进一步了解 Shadow 及其用途。"
      }
    }
  },
  "ja": {
    "title": "設定",
    "backToProfile": "プロフィールに戻る",
    "logout": "ログアウト",
    "comingSoon": "{{title}} は近日公開予定です。",
    "groups": {
      "account": "アカウント",
      "activity": "アクティビティ",
      "interaction": "読者とのやり取り",
      "appSupport": "アプリとサポート"
    },
    "items": {
      "edit-profile": {
        "title": "プロフィールを編集",
        "subtitle": "名前、写真、自己紹介、プロフィールリンクを更新します。"
      },
      "account-security": {
        "title": "アカウントとセキュリティ",
        "subtitle": "パスワード、メール、アカウントアクセスを管理します。"
      },
      "privacy": {
        "title": "プライバシー",
        "subtitle": "読者スペースを見られる相手を管理します。"
      },
      "blocked-readers": {
        "title": "ブロックした読者",
        "subtitle": "ブロックした読者を確認します。"
      },
      "saved-posts": {
        "title": "保存した投稿",
        "subtitle": "後で見るために保存した投稿を表示します。"
      },
      "my-comments": {
        "title": "自分のコメント",
        "subtitle": "自分のコメントと返信を確認します。"
      },
      "notifications": {
        "title": "通知",
        "subtitle": "読者、作者、ストーリーからの更新を確認します。"
      },
      "reading-history": {
        "title": "閲覧履歴",
        "subtitle": "閲覧したストーリーやエピソードを探します。"
      },
      "echo-sharing": {
        "title": "Echo と共有",
        "subtitle": "Echo した投稿と共有アクティビティを管理します。"
      },
      "messages-replies": {
        "title": "メッセージと返信",
        "subtitle": "連絡や返信ができる相手を管理します。"
      },
      "tags-mentions": {
        "title": "タグとメンション",
        "subtitle": "タグ付けやメンションできる相手を選びます。"
      },
      "comment-settings": {
        "title": "コメント設定",
        "subtitle": "読者投稿へのコメントを管理します。"
      },
      "hidden-words": {
        "title": "非表示ワード",
        "subtitle": "見たくない単語やフレーズを非表示にします。"
      },
      "restricted-readers": {
        "title": "制限した読者",
        "subtitle": "交流を制限した読者を確認します。"
      },
      "language": {
        "title": "言語",
        "subtitle": "アプリと読書の言語を選びます。"
      },
      "accessibility": {
        "title": "アクセシビリティ",
        "subtitle": "読書と表示の補助機能を調整します。"
      },
      "help-center": {
        "title": "ヘルプセンター",
        "subtitle": "Shadow の使い方に関する回答やガイドを探します。"
      },
      "feedback-support": {
        "title": "フィードバックとサポート",
        "subtitle": "フィードバックを送るか、サポートを依頼します。"
      },
      "about-shadow": {
        "title": "Shadow について",
        "subtitle": "Shadow とその目的について詳しく知ることができます。"
      }
    }
  },
  "ko": {
    "title": "설정",
    "backToProfile": "프로필로 돌아가기",
    "logout": "로그아웃",
    "comingSoon": "{{title}} 기능은 곧 제공됩니다.",
    "groups": {
      "account": "내 계정",
      "activity": "내 활동",
      "interaction": "독자와의 상호작용",
      "appSupport": "앱 및 지원"
    },
    "items": {
      "edit-profile": {
        "title": "프로필 수정",
        "subtitle": "이름, 사진, 소개 및 프로필 링크를 업데이트합니다."
      },
      "account-security": {
        "title": "계정 및 보안",
        "subtitle": "비밀번호, 이메일 및 계정 접근을 관리합니다."
      },
      "privacy": {
        "title": "개인정보",
        "subtitle": "내 독자 공간을 볼 수 있는 사람을 관리합니다."
      },
      "blocked-readers": {
        "title": "차단한 독자",
        "subtitle": "차단한 독자를 확인합니다."
      },
      "saved-posts": {
        "title": "저장한 게시물",
        "subtitle": "나중에 보기 위해 저장한 게시물을 확인합니다."
      },
      "my-comments": {
        "title": "내 댓글",
        "subtitle": "내 댓글과 답글을 확인합니다."
      },
      "notifications": {
        "title": "알림",
        "subtitle": "독자, 작가 및 스토리의 업데이트를 확인합니다."
      },
      "reading-history": {
        "title": "읽기 기록",
        "subtitle": "본 스토리와 에피소드를 찾아봅니다."
      },
      "echo-sharing": {
        "title": "Echo 및 공유",
        "subtitle": "Echo한 게시물과 공유 활동을 관리합니다."
      },
      "messages-replies": {
        "title": "메시지 및 답글",
        "subtitle": "연락하거나 답글을 보낼 수 있는 사람을 관리합니다."
      },
      "tags-mentions": {
        "title": "태그 및 멘션",
        "subtitle": "나를 태그하거나 언급할 수 있는 사람을 선택합니다."
      },
      "comment-settings": {
        "title": "댓글 설정",
        "subtitle": "독자 게시물의 댓글을 관리합니다."
      },
      "hidden-words": {
        "title": "숨긴 단어",
        "subtitle": "보고 싶지 않은 단어나 문구를 숨깁니다."
      },
      "restricted-readers": {
        "title": "제한된 독자",
        "subtitle": "상호작용이 제한된 독자를 확인합니다."
      },
      "language": {
        "title": "언어",
        "subtitle": "앱 및 읽기 언어를 선택합니다."
      },
      "accessibility": {
        "title": "접근성",
        "subtitle": "읽기 및 화면 보조 기능을 조정합니다."
      },
      "help-center": {
        "title": "도움말 센터",
        "subtitle": "Shadow 사용에 관한 답변과 안내를 확인합니다."
      },
      "feedback-support": {
        "title": "피드백 및 지원",
        "subtitle": "피드백을 보내거나 도움을 요청합니다."
      },
      "about-shadow": {
        "title": "Shadow 정보",
        "subtitle": "Shadow와 그 목적에 대해 자세히 알아봅니다."
      }
    }
  }
})

const GROUP_KEYS = ['account', 'activity', 'interaction', 'appSupport']

const SETTINGS_GROUPS = [
  {
    title: 'Your account',
    items: [
      {
        key: 'edit-profile',
        title: 'Edit profile',
        subtitle: 'Update your name, photo, bio, and profile links.',
        icon: 'fa-regular fa-user',
        route: '/profile/edit',
      },
      {
        key: 'account-security',
        title: 'Account & security',
        subtitle: 'Password, email, and account access.',
        icon: 'fa-solid fa-shield-halved',
        route: '/profile/settings/account-security',
      },
      {
        key: 'privacy',
        title: 'Privacy',
        subtitle: 'Control who can see your reader space.',
        icon: 'fa-solid fa-lock',
      },
      {
        key: 'blocked-readers',
        title: 'Blocked readers',
        subtitle: 'Review readers you have blocked.',
        icon: 'fa-solid fa-ban',
      },
    ],
  },
  {
    title: 'Your activity',
    items: [
      {
        key: 'saved-posts',
        title: 'Saved posts',
        subtitle: 'View posts you saved for later.',
        icon: 'fa-regular fa-bookmark',
        route: '/saved-posts',
      },
      {
        key: 'my-comments',
        title: 'My comments',
        subtitle: 'Review your comments and replies.',
        icon: 'fa-regular fa-comment',
        route: '/comments',
      },
      {
        key: 'notifications',
        title: 'Notifications',
        subtitle: 'See updates from readers, authors, and stories.',
        icon: 'fa-regular fa-bell',
        route: '/notifications',
      },
      {
        key: 'reading-history',
        title: 'Reading history',
        subtitle: 'Find stories and episodes you viewed.',
        icon: 'fa-solid fa-clock-rotate-left',
      },
      {
        key: 'echo-sharing',
        title: 'Echo and sharing',
        subtitle: 'Manage echoed posts and sharing activity.',
        icon: 'fa-solid fa-arrows-rotate',
      },
    ],
  },
  {
    title: 'How readers interact with you',
    items: [
      {
        key: 'messages-replies',
        title: 'Messages and replies',
        subtitle: 'Control who can contact and reply to you.',
        icon: 'fa-regular fa-message',
      },
      {
        key: 'tags-mentions',
        title: 'Tags and mentions',
        subtitle: 'Choose who can tag or mention you.',
        icon: 'fa-solid fa-at',
      },
      {
        key: 'comment-settings',
        title: 'Comment settings',
        subtitle: 'Manage comments on your reader posts.',
        icon: 'fa-regular fa-comments',
      },
      {
        key: 'hidden-words',
        title: 'Hidden words',
        subtitle: 'Hide words and phrases you do not want to see.',
        icon: 'fa-solid fa-eye-slash',
      },
      {
        key: 'restricted-readers',
        title: 'Restricted readers',
        subtitle: 'Review readers with limited interaction.',
        icon: 'fa-solid fa-user-shield',
      },
    ],
  },
  {
    title: 'App and support',
    items: [
      {
        key: 'language',
        title: 'Language',
        subtitle: 'Choose your app and reading language.',
        icon: 'fa-solid fa-language',
      },
      {
        key: 'accessibility',
        title: 'Accessibility',
        subtitle: 'Adjust reading and display assistance.',
        icon: 'fa-solid fa-universal-access',
      },
      {
        key: 'help-center',
        title: 'Help Center',
        subtitle: 'Find answers and guides for using Shadow.',
        icon: 'fa-regular fa-circle-question',
        route: '/help',
      },
      {
        key: 'feedback-support',
        title: 'Feedback & Support',
        subtitle: 'Send feedback or request help.',
        icon: 'fa-regular fa-paper-plane',
        route: '/feedback',
      },
      {
        key: 'about-shadow',
        title: 'About Shadow',
        subtitle: 'Learn more about Shadow and its purpose.',
        icon: 'fa-solid fa-circle-info',
        route: '/about',
      },
    ],
  },
]

function clearReaderSession() {
  localStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_user')
}

function ReaderSettingsIcon({ name }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.7',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-[21px] w-[21px]',
    'aria-hidden': true,
  }

  switch (name) {
    case 'edit-profile':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="7" r="4" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </svg>
      )

    case 'account-security':
      return (
        <svg {...commonProps}>
          <path d="M12 3 20 6v5.5c0 4.8-3.2 8.1-8 9.5-4.8-1.4-8-4.7-8-9.5V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )

    case 'privacy':
      return (
        <svg {...commonProps}>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      )

    case 'blocked-readers':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m5.7 5.7 12.6 12.6" />
        </svg>
      )

    case 'saved-posts':
      return (
        <svg {...commonProps}>
          <path d="M6 3.5h12v17l-6-4-6 4v-17Z" />
        </svg>
      )

    case 'my-comments':
      return (
        <svg {...commonProps}>
          <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.5-.7L4 20l1.4-4A7.5 7.5 0 1 1 20 11.5Z" />
        </svg>
      )

    case 'notifications':
      return (
        <svg {...commonProps}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M10 20h4" />
        </svg>
      )

    case 'reading-history':
      return (
        <svg {...commonProps}>
          <path d="M4 5v5h5" />
          <path d="M5.5 16a8 8 0 1 0-.8-8" />
          <path d="M12 7v5l3 2" />
        </svg>
      )

    case 'echo-sharing':
      return (
        <svg {...commonProps}>
          <path d="m17 3 4 4-4 4" />
          <path d="M3 7h18" />
          <path d="m7 21-4-4 4-4" />
          <path d="M21 17H3" />
        </svg>
      )

    case 'messages-replies':
      return (
        <svg {...commonProps}>
          <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-5a9 9 0 1 1 18-5Z" />
          <path d="M8 12h8" />
        </svg>
      )

    case 'tags-mentions':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
        </svg>
      )

    case 'comment-settings':
      return (
        <svg {...commonProps}>
          <path d="M19 15a7 7 0 0 0-7-9H8a6 6 0 0 0-4 10.5L3 20l4-1.5A7 7 0 0 0 12 20" />
          <circle cx="18" cy="18" r="3" />
          <path d="M18 16.7v2.6M16.7 18h2.6" />
        </svg>
      )

    case 'hidden-words':
      return (
        <svg {...commonProps}>
          <path d="M3 3 21 21" />
          <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
          <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9 8 9 8a17.4 17.4 0 0 1-2 3.1" />
          <path d="M6.6 6.6C4.3 8.3 3 12 3 12s3.5 8 9 8a9.8 9.8 0 0 0 4-.9" />
        </svg>
      )

    case 'restricted-readers':
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="7" r="3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M17 12v6" />
          <path d="M14 15h6" />
        </svg>
      )

    case 'language':
      return (
        <svg {...commonProps}>
          <path d="M4 5h10" />
          <path d="M9 3v2" />
          <path d="M6 9c1.8 2.8 4.2 4.7 7 6" />
          <path d="M13 7c-1.5 4-4.2 7.2-8 9" />
          <path d="m15 20 3-8 3 8" />
          <path d="M16 17h4" />
        </svg>
      )

    case 'accessibility':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="4" r="2" />
          <path d="M5 8h14" />
          <path d="M12 6v7" />
          <path d="m8 21 4-8 4 8" />
        </svg>
      )

    case 'help-center':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.1c-.9.5-1.3 1-1.3 1.9" />
          <path d="M12 17h.01" />
        </svg>
      )

    case 'feedback-support':
      return (
        <svg {...commonProps}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="m22 2-11 11" />
        </svg>
      )

    case 'about-shadow':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6" />
          <path d="M12 7h.01" />
        </svg>
      )

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

function SettingsRow({ item, onOpen, t }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left transition active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
  <ReaderSettingsIcon name={item.key} />
</span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {t(`readerSettings.items.${item.key}.title`, { defaultValue: item.title })}
        </span>
        <span className="mt-1 block text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {t(`readerSettings.items.${item.key}.subtitle`, { defaultValue: item.subtitle })}
        </span>
      </span>

      <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

export default function ReaderSettingsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [message, setMessage] = useState('')
  const groups = useMemo(() => SETTINGS_GROUPS, [])

  function showComingSoon(item) {
  const title = t(`readerSettings.items.${item.key}.title`, { defaultValue: item.title })
  setMessage(t('readerSettings.comingSoon', { title, defaultValue: `${title} is coming soon.` }))
    window.clearTimeout(showComingSoon.timer)
    showComingSoon.timer = window.setTimeout(() => {
      setMessage('')
    }, 2200)
  }

  function handleOpen(item) {
    if (item.route) {
      navigate(item.route)
      return
    }

    showComingSoon(item)
  }

  function handleLogout() {
    clearReaderSession()
    navigate('/login', { replace: true })
  }

  return (
    <main className="app-page min-h-screen pb-[calc(28px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(new URLSearchParams(window.location.search).get('from') === 'me-settings' ? '/me?settings=1' : '/profile', { replace: true })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerSettings.backToProfile')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-[18px] font-semibold">
  {t('readerSettings.title')}
</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px]">
        {groups.map((group, groupIndex) => (
          <section
            key={t(`readerSettings.groups.${GROUP_KEYS[groupIndex]}`, { defaultValue: group.title })}
            className={groupIndex ? 'border-t-[8px] border-[var(--shadow-border)]' : ''}
          >
            <div className="px-5 pb-2 pt-5 text-[12.5px] font-medium text-[var(--shadow-text-secondary)]">
  {t(`readerSettings.groups.${GROUP_KEYS[groupIndex]}`, { defaultValue: group.title })}
</div>

            <div>
              {group.items.map((item) => (
                <SettingsRow
                  t={t}
                  key={item.key}
                  item={item}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="border-t-[8px] border-[var(--shadow-border)] px-4 py-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-14 w-full items-center gap-4 rounded-[14px] px-1 text-left text-[#dc2626] active:bg-[#dc2626]/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <i className="fa-solid fa-arrow-right-from-bracket text-[20px]" />
            </span>

            <span className="text-[16px] font-normal">
              {t('readerSettings.logout')}
            </span>
          </button>
        </section>
      </div>

      {message ? (
        <div className="fixed bottom-[calc(28px+env(safe-area-inset-bottom))] left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2.5 text-[12px] font-normal text-white shadow-xl">
          {message}
        </div>
      ) : null}
    </main>
  )
}
