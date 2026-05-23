const DISPLAY_LANGUAGE_STORAGE_KEY = 'shadow_display_language'

const TEXT = {
  en: {
    settings: 'Settings',
    accountAndAppOptions: 'Account and app options',
    editProfile: 'Edit Profile',
    editProfileSub: 'Name, avatar, bio',
    accountSettings: 'Account Settings',
    accountSettingsSub: 'Password, privacy, security',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    themeSub: 'Switch between light and dark theme',
    language: 'Language',
    languageSub: 'Story and display language',
    storyLanguage: 'Story Language',
    displayLanguage: 'Display Language',
    storyLanguageHelp: 'Choose the language used inside your story.',
    displayLanguageHelp: 'Choose the language used for menus, buttons, and app text.',
    selected: 'Selected',
  },
  km: {
    settings: 'ការកំណត់',
    accountAndAppOptions: 'ជម្រើសគណនី និងកម្មវិធី',
    editProfile: 'កែប្រវត្តិរូប',
    editProfileSub: 'ឈ្មោះ រូបភាព និងជីវប្រវត្តិ',
    accountSettings: 'ការកំណត់គណនី',
    accountSettingsSub: 'ពាក្យសម្ងាត់ ឯកជនភាព សុវត្ថិភាព',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    themeSub: 'ប្ដូររវាងពណ៌ភ្លឺ និងពណ៌ងងឹត',
    language: 'ភាសា',
    languageSub: 'ភាសារឿង និងភាសាបង្ហាញ',
    storyLanguage: 'ភាសារឿង',
    displayLanguage: 'ភាសាបង្ហាញ',
    storyLanguageHelp: 'ជ្រើសភាសាដែលប្រើនៅក្នុងរឿង។',
    displayLanguageHelp: 'ជ្រើសភាសាសម្រាប់ menu, button និងអក្សរក្នុង app។',
    selected: 'បានជ្រើសរើស',
  },
  zh: {
    settings: '设置',
    accountAndAppOptions: '账号和应用选项',
    editProfile: '编辑资料',
    editProfileSub: '姓名、头像、简介',
    accountSettings: '账号设置',
    accountSettingsSub: '密码、隐私、安全',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    themeSub: '切换浅色和深色主题',
    language: '语言',
    languageSub: '故事和显示语言',
    storyLanguage: '故事语言',
    displayLanguage: '显示语言',
    storyLanguageHelp: '选择故事内容使用的语言。',
    displayLanguageHelp: '选择菜单、按钮和应用文字使用的语言。',
    selected: '已选择',
  },
  ja: {
    settings: '設定',
    accountAndAppOptions: 'アカウントとアプリの設定',
    editProfile: 'プロフィール編集',
    editProfileSub: '名前、アバター、自己紹介',
    accountSettings: 'アカウント設定',
    accountSettingsSub: 'パスワード、プライバシー、セキュリティ',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    themeSub: 'ライトとダークテーマを切り替えます',
    language: '言語',
    languageSub: 'ストーリーと表示言語',
    storyLanguage: 'ストーリー言語',
    displayLanguage: '表示言語',
    storyLanguageHelp: 'ストーリー内で使用する言語を選択します。',
    displayLanguageHelp: 'メニュー、ボタン、アプリ文字の言語を選択します。',
    selected: '選択済み',
  },
  ko: {
    settings: '설정',
    accountAndAppOptions: '계정 및 앱 옵션',
    editProfile: '프로필 수정',
    editProfileSub: '이름, 아바타, 소개',
    accountSettings: '계정 설정',
    accountSettingsSub: '비밀번호, 개인정보, 보안',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    themeSub: '라이트와 다크 테마 전환',
    language: '언어',
    languageSub: '스토리 및 표시 언어',
    storyLanguage: '스토리 언어',
    displayLanguage: '표시 언어',
    storyLanguageHelp: '스토리 안에서 사용할 언어를 선택하세요.',
    displayLanguageHelp: '메뉴, 버튼, 앱 텍스트에 사용할 언어를 선택하세요.',
    selected: '선택됨',
  },
}

export function getDisplayLanguageId() {
  return localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY) || 'en'
}

export function setDisplayLanguageId(languageId) {
  localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, languageId || 'en')
  window.dispatchEvent(new Event('shadow-display-language-change'))
}

export function getDisplayText(key) {
  const languageId = getDisplayLanguageId()
  return TEXT[languageId]?.[key] || TEXT.en[key] || key
}
