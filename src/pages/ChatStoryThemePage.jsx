import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageShell,
  PageHeader,
  PageLoadingState,
  PageErrorState,
  PageEmptyState,
  FilterChip,
} from "../components/common/PagePrimitives";
import { useDisplayTranslation } from "../utils/displayLanguage";
import { registerTranslationNamespace } from "../i18n/registerTranslations";
import {
  CHAT_STORY_THEMES,
  CHAT_THEME_STYLES,
  CHAT_THEME_ACCENTS,
  CHAT_THEME_PHOTO_LIMIT,
  DEFAULT_CHAT_THEME,
  chatThemeToken,
  chatThemeStyle,
  resolveChatTheme,
  saveChatTheme,
  useChatStoryTheme,
  listChatThemeBackgrounds,
  listChatThemePhotos,
  uploadChatThemePhoto,
  deleteChatThemePhoto,
} from "../services/chatStoryThemes";

registerTranslationNamespace("chatStoryThemes", {
  en: {
    applyShort: "Apply",
    chooseStyle: "Choose a style",
    accentColor: "Accent color",
    customColor: "Custom color",
    solidColor: "Solid",
    gradientColor: "Gradient",
    doneColor: "Done",
    addColor: "Add color",
    removeColor: "Remove color",
    direction: "Direction",
    chooseColors: "Choose colors",
    styles: {"classic": "Classic", "soft": "Soft", "gradient": "Gradient", "night": "Night", "paper": "Paper", "outline": "Outline", "minimal": "Minimal", "neon": "Neon"},

    title: "Chat Theme",
    back: "Back",
    preview: "Live preview",
    colors: "Colors",
    shadow: "Shadow",
    photos: "My Photos",
    all: "All",
    soft: "Soft",
    gradient: "Gradients",
    dark: "Dark",
    apply: "Apply Theme",
    applied: "Applied",
    selected: "Selected",
    previewName: "Noah",
    previewIncoming: "Are you still awake?",
    previewOutgoing: "Just one more chapter.",
    loading: "Loading backgrounds…",
    retry: "Try again",
    loadMore: "Load 9 more",
    end: "All backgrounds loaded",
    shadowEmpty: "More scenes for your story",
    shadowEmptyBody:
      "Shadow backgrounds will appear here when they are available.",
    photosEmpty: "Make it feel like you",
    photosEmptyBody: "Choose a photo for your chat background.",
    upload: "Upload Photo",
    photoCount: "{{count}} / 10 photos",
    uploadHelp: "Up to 10 photos · 5 MB each",
    uploading: "Uploading {{percent}}%",
    preparing: "Preparing photo…",
    cancel: "Cancel",
    remove: "Delete photo",
    deleteQuestion: "Delete this photo?",
    deleteBody: "If this background is in use, Classic Violet will be applied.",
    deleting: "Deleting…",
    choosePalette: "Bubble colors",
    background: "Background {{number}}",
    selectTheme: "Preview {{name}}",
    imageFailed: "Image unavailable",
    signIn: "Sign in to manage backgrounds.",
    unavailable: "Backgrounds are not available yet. Colors are ready to use.",
    requestFailed: "Could not load backgrounds. Please try again.",
    limitReached: "You have 10 photos. Delete one before adding another.",
    tooLarge: "Choose a photo smaller than 5 MB.",
    invalidType: "Choose a JPEG, PNG, WebP, AVIF or HEIC photo.",
    invalidImage: "This photo could not be processed. Try another image.",
    uploadFailed: "The upload did not finish. Please try again.",
    deleteFailed: "The photo could not be deleted.",
    saveFailed: "Your theme could not be saved on this browser.",
    accountChanged: "Your account changed. Please reopen this page.",
    presets: {
      classicViolet: "Classic Violet",
      oceanMist: "Ocean Mist",
      peachGlow: "Peach Glow",
      sageGarden: "Sage Garden",
      roseQuartz: "Rose Quartz",
      lavenderCloud: "Lavender Cloud",
      mintBreeze: "Mint Breeze",
      skyBlue: "Sky Blue",
      honeyCream: "Honey Cream",
      cocoaMilk: "Cocoa Milk",
      cherryBlossom: "Cherry Blossom",
      lilacDawn: "Lilac Dawn",
      sunset: "Sunset",
      seaGlass: "Sea Glass",
      arctic: "Arctic",
      midnight: "Midnight",
      forestNight: "Forest Night",
      plumNight: "Plum Night",
      deepOcean: "Deep Ocean",
      graphite: "Graphite",
    },
  },
  km: {
    applyShort: "អនុវត្ត",
    chooseStyle: "ជ្រើសរចនាប័ទ្ម",
    accentColor: "ពណ៌ចម្បង",
    customColor: "ពណ៌ផ្ទាល់ខ្លួន",
    solidColor: "ពណ៌តែមួយ",
    gradientColor: "ពណ៌ចម្រុះ",
    doneColor: "រួចរាល់",
    addColor: "បន្ថែមពណ៌",
    removeColor: "ដកពណ៌",
    direction: "ទិសពណ៌",
    chooseColors: "ជ្រើសពណ៌",
    styles: {"classic": "បុរាណ", "soft": "ទន់ភ្លន់", "gradient": "ពណ៌ចម្រុះ", "night": "រាត្រី", "paper": "ក្រដាស", "outline": "ស៊ុម", "minimal": "សាមញ្ញ", "neon": "នីអុង"},

    title: "Theme ឆាត",
    back: "ត្រឡប់ក្រោយ",
    preview: "មើលគំរូ",
    colors: "ពណ៌",
    shadow: "Shadow",
    photos: "រូបខ្ញុំ",
    all: "ទាំងអស់",
    soft: "ស្រទន់",
    gradient: "ពណ៌ចម្រុះ",
    dark: "ងងឹត",
    apply: "ប្រើ Theme",
    applied: "បានប្រើ",
    selected: "បានជ្រើស",
    previewName: "ណូអា",
    previewIncoming: "អ្នកនៅភ្ញាក់ទៀតមែនទេ?",
    previewOutgoing: "សុំអានតែមួយភាគទៀត។",
    loading: "កំពុងផ្ទុកផ្ទៃក្រោយ…",
    retry: "ព្យាយាមម្ដងទៀត",
    loadMore: "ផ្ទុក៩រូបបន្ថែម",
    end: "បានផ្ទុកផ្ទៃក្រោយទាំងអស់",
    shadowEmpty: "ទិដ្ឋភាពថ្មីសម្រាប់រឿងអ្នក",
    shadowEmptyBody: "ផ្ទៃក្រោយរបស់ Shadow នឹងបង្ហាញនៅទីនេះពេលមាន។",
    photosEmpty: "ផ្ទៃក្រោយតាមចំណូលចិត្តអ្នក",
    photosEmptyBody: "ជ្រើសរូបផ្ទាល់ខ្លួនជាផ្ទៃក្រោយឆាត។",
    upload: "បញ្ចូលរូបភាព",
    photoCount: "{{count}} / 10 រូប",
    uploadHelp: "អតិបរមា១០រូប · ៥ MB ក្នុងមួយរូប",
    uploading: "កំពុងបញ្ចូល {{percent}}%",
    preparing: "កំពុងរៀបចំរូបភាព…",
    cancel: "បោះបង់",
    remove: "លុបរូប",
    deleteQuestion: "លុបរូបនេះមែនទេ?",
    deleteBody: "បើកំពុងប្រើរូបនេះ នឹងប្ដូរទៅពណ៌ស្វាយដើម។",
    deleting: "កំពុងលុប…",
    choosePalette: "ពណ៌ពពុះសារ",
    background: "ផ្ទៃក្រោយ {{number}}",
    selectTheme: "មើលគំរូ {{name}}",
    imageFailed: "មិនអាចបង្ហាញរូបបាន",
    signIn: "សូមចូលគណនីដើម្បីគ្រប់គ្រងផ្ទៃក្រោយ។",
    unavailable: "ផ្ទៃក្រោយមិនទាន់អាចប្រើបានទេ។ អ្នកអាចជ្រើសពណ៌បាន។",
    requestFailed: "មិនអាចផ្ទុកផ្ទៃក្រោយបានទេ។ សូមព្យាយាមម្ដងទៀត។",
    limitReached: "មាន១០រូបហើយ។ សូមលុបរូបមួយមុនបន្ថែមថ្មី។",
    tooLarge: "សូមជ្រើសរូបតូចជាង៥ MB។",
    invalidType: "សូមជ្រើសរូប JPEG, PNG, WebP, AVIF ឬ HEIC។",
    invalidImage: "មិនអាចរៀបចំរូបនេះបានទេ។ សូមជ្រើសរូបផ្សេង។",
    uploadFailed: "ការបញ្ចូលមិនបានសម្រេច។ សូមព្យាយាមម្ដងទៀត។",
    deleteFailed: "មិនអាចលុបរូបបានទេ។",
    saveFailed: "មិនអាចរក្សាទុក Theme ក្នុង Browser នេះបានទេ។",
    accountChanged: "គណនីបានផ្លាស់ប្ដូរ។ សូមបើកទំព័រនេះម្ដងទៀត។",
    presets: {
      classicViolet: "ស្វាយដើម",
      oceanMist: "អ័ព្ទសមុទ្រ",
      peachGlow: "ពន្លឺផ្លែប៉េស",
      sageGarden: "សួនបៃតង",
      roseQuartz: "ផ្កាកុលាប",
      lavenderCloud: "ពពកឡាវេនឌ័រ",
      mintBreeze: "ខ្យល់ជីអង្កាម",
      skyBlue: "មេឃខៀវ",
      honeyCream: "ទឹកឃ្មុំ",
      cocoaMilk: "ទឹកដោះកាកាវ",
      cherryBlossom: "ផ្កាសាគូរ៉ា",
      lilacDawn: "ព្រឹកពណ៌ស្វាយ",
      sunset: "ថ្ងៃលិច",
      seaGlass: "កញ្ចក់សមុទ្រ",
      arctic: "ទឹកកក",
      midnight: "ពាក់កណ្ដាលយប់",
      forestNight: "រាត្រីក្នុងព្រៃ",
      plumNight: "រាត្រីស្វាយ",
      deepOcean: "បាតសមុទ្រ",
      graphite: "ប្រផេះងងឹត",
    },
  },
  zh: {
    applyShort: "应用",
    chooseStyle: "选择样式",
    accentColor: "主题颜色",
    customColor: "自定义颜色",
    solidColor: "纯色",
    gradientColor: "渐变",
    doneColor: "完成",
    addColor: "添加颜色",
    removeColor: "移除颜色",
    direction: "方向",
    chooseColors: "选择颜色",
    styles: {"classic": "经典", "soft": "柔和", "gradient": "渐变", "night": "夜间", "paper": "纸张", "outline": "描边", "minimal": "极简", "neon": "霓虹"},

    title: "聊天主题",
    back: "返回",
    preview: "实时预览",
    colors: "颜色",
    shadow: "Shadow",
    photos: "我的照片",
    all: "全部",
    soft: "柔和",
    gradient: "渐变",
    dark: "深色",
    apply: "应用主题",
    applied: "已应用",
    selected: "已选择",
    previewName: "诺亚",
    previewIncoming: "你还没睡吗？",
    previewOutgoing: "再看一章就睡。",
    loading: "正在加载背景…",
    retry: "重试",
    loadMore: "再加载9张",
    end: "已加载全部背景",
    shadowEmpty: "故事的新场景",
    shadowEmptyBody: "Shadow 背景上线后将显示在这里。",
    photosEmpty: "打造你的专属背景",
    photosEmptyBody: "选择照片作为聊天背景。",
    upload: "上传照片",
    photoCount: "{{count}} / 10 张照片",
    uploadHelp: "最多10张 · 每张5 MB",
    uploading: "上传中 {{percent}}%",
    preparing: "正在准备照片…",
    cancel: "取消",
    remove: "删除照片",
    deleteQuestion: "删除这张照片？",
    deleteBody: "如果正在使用此背景，将改用经典紫。",
    deleting: "删除中…",
    choosePalette: "气泡颜色",
    background: "背景 {{number}}",
    selectTheme: "预览{{name}}",
    imageFailed: "图片不可用",
    signIn: "请登录以管理背景。",
    unavailable: "背景尚不可用，你仍可选择颜色主题。",
    requestFailed: "无法加载背景，请重试。",
    limitReached: "已有10张照片，请先删除一张。",
    tooLarge: "请选择小于5 MB的照片。",
    invalidType: "请选择 JPEG、PNG、WebP、AVIF 或 HEIC 照片。",
    invalidImage: "无法处理此照片，请更换图片。",
    uploadFailed: "上传未完成，请重试。",
    deleteFailed: "无法删除照片。",
    saveFailed: "无法在此浏览器中保存主题。",
    accountChanged: "账号已切换，请重新打开此页面。",
    presets: {
      classicViolet: "经典紫",
      oceanMist: "海洋薄雾",
      peachGlow: "蜜桃微光",
      sageGarden: "鼠尾草花园",
      roseQuartz: "玫瑰石英",
      lavenderCloud: "薰衣草云",
      mintBreeze: "薄荷微风",
      skyBlue: "天空蓝",
      honeyCream: "蜂蜜奶油",
      cocoaMilk: "可可牛奶",
      cherryBlossom: "樱花",
      lilacDawn: "丁香黎明",
      sunset: "日落",
      seaGlass: "海玻璃",
      arctic: "极地",
      midnight: "午夜",
      forestNight: "森林之夜",
      plumNight: "梅紫之夜",
      deepOcean: "深海",
      graphite: "石墨",
    },
  },
  ja: {
    applyShort: "適用",
    chooseStyle: "スタイルを選択",
    accentColor: "アクセントカラー",
    customColor: "カスタムカラー",
    solidColor: "単色",
    gradientColor: "グラデーション",
    doneColor: "完了",
    addColor: "色を追加",
    removeColor: "色を削除",
    direction: "方向",
    chooseColors: "色を選択",
    styles: {"classic": "クラシック", "soft": "ソフト", "gradient": "グラデーション", "night": "ナイト", "paper": "ペーパー", "outline": "アウトライン", "minimal": "ミニマル", "neon": "ネオン"},

    title: "チャットテーマ",
    back: "戻る",
    preview: "プレビュー",
    colors: "カラー",
    shadow: "Shadow",
    photos: "自分の写真",
    all: "すべて",
    soft: "ソフト",
    gradient: "グラデーション",
    dark: "ダーク",
    apply: "テーマを適用",
    applied: "適用済み",
    selected: "選択済み",
    previewName: "ノア",
    previewIncoming: "まだ起きてる？",
    previewOutgoing: "あと一話だけ。",
    loading: "背景を読み込み中…",
    retry: "再試行",
    loadMore: "さらに9枚読み込む",
    end: "すべての背景を表示しました",
    shadowEmpty: "物語に新しい景色を",
    shadowEmptyBody: "Shadowの背景は公開後にここへ表示されます。",
    photosEmpty: "自分らしい背景に",
    photosEmptyBody: "チャットの背景に写真を選びましょう。",
    upload: "写真をアップロード",
    photoCount: "{{count}} / 10枚",
    uploadHelp: "最大10枚 · 1枚5 MBまで",
    uploading: "アップロード中 {{percent}}%",
    preparing: "写真を準備中…",
    cancel: "キャンセル",
    remove: "写真を削除",
    deleteQuestion: "この写真を削除しますか？",
    deleteBody: "使用中の場合はクラシックバイオレットに戻ります。",
    deleting: "削除中…",
    choosePalette: "吹き出しの色",
    background: "背景 {{number}}",
    selectTheme: "{{name}}をプレビュー",
    imageFailed: "画像を表示できません",
    signIn: "背景を管理するにはログインしてください。",
    unavailable: "背景はまだ利用できません。カラーテーマは使えます。",
    requestFailed: "背景を読み込めませんでした。もう一度お試しください。",
    limitReached: "写真は10枚までです。先に1枚削除してください。",
    tooLarge: "5 MB未満の写真を選んでください。",
    invalidType: "JPEG、PNG、WebP、AVIF、HEICの写真を選んでください。",
    invalidImage: "この写真を処理できません。別の画像をお試しください。",
    uploadFailed: "アップロードが完了しませんでした。",
    deleteFailed: "写真を削除できませんでした。",
    saveFailed: "このブラウザーにテーマを保存できません。",
    accountChanged: "アカウントが変わりました。ページを開き直してください。",
    presets: {
      classicViolet: "クラシックバイオレット",
      oceanMist: "海の霧",
      peachGlow: "ピーチグロウ",
      sageGarden: "セージガーデン",
      roseQuartz: "ローズクォーツ",
      lavenderCloud: "ラベンダークラウド",
      mintBreeze: "ミントの風",
      skyBlue: "スカイブルー",
      honeyCream: "ハニークリーム",
      cocoaMilk: "ココアミルク",
      cherryBlossom: "桜",
      lilacDawn: "ライラックの夜明け",
      sunset: "夕焼け",
      seaGlass: "シーグラス",
      arctic: "北極",
      midnight: "真夜中",
      forestNight: "森の夜",
      plumNight: "プラムナイト",
      deepOcean: "深海",
      graphite: "グラファイト",
    },
  },
  ko: {
    applyShort: "적용",
    chooseStyle: "스타일 선택",
    accentColor: "강조 색상",
    customColor: "사용자 색상",
    solidColor: "단색",
    gradientColor: "그라데이션",
    doneColor: "완료",
    addColor: "색상 추가",
    removeColor: "색상 제거",
    direction: "방향",
    chooseColors: "색상 선택",
    styles: {"classic": "클래식", "soft": "소프트", "gradient": "그라데이션", "night": "나이트", "paper": "종이", "outline": "윤곽선", "minimal": "미니멀", "neon": "네온"},

    title: "채팅 테마",
    back: "뒤로",
    preview: "미리보기",
    colors: "색상",
    shadow: "Shadow",
    photos: "내 사진",
    all: "전체",
    soft: "부드러운",
    gradient: "그라데이션",
    dark: "어두운",
    apply: "테마 적용",
    applied: "적용됨",
    selected: "선택됨",
    previewName: "노아",
    previewIncoming: "아직 안 자?",
    previewOutgoing: "한 편만 더 읽을게.",
    loading: "배경을 불러오는 중…",
    retry: "다시 시도",
    loadMore: "9개 더 보기",
    end: "모든 배경을 불러왔습니다",
    shadowEmpty: "이야기에 새로운 풍경을",
    shadowEmptyBody: "Shadow 배경이 준비되면 여기에 표시됩니다.",
    photosEmpty: "나만의 배경으로",
    photosEmptyBody: "사진을 골라 채팅 배경으로 사용하세요.",
    upload: "사진 업로드",
    photoCount: "{{count}} / 10장",
    uploadHelp: "최대 10장 · 장당 5 MB",
    uploading: "업로드 중 {{percent}}%",
    preparing: "사진 준비 중…",
    cancel: "취소",
    remove: "사진 삭제",
    deleteQuestion: "이 사진을 삭제할까요?",
    deleteBody: "사용 중이라면 클래식 바이올렛으로 변경됩니다.",
    deleting: "삭제 중…",
    choosePalette: "말풍선 색상",
    background: "배경 {{number}}",
    selectTheme: "{{name}} 미리보기",
    imageFailed: "이미지를 표시할 수 없습니다",
    signIn: "배경을 관리하려면 로그인하세요.",
    unavailable:
      "배경은 아직 사용할 수 없습니다. 색상 테마는 사용할 수 있습니다.",
    requestFailed: "배경을 불러올 수 없습니다. 다시 시도하세요.",
    limitReached: "사진이 10장입니다. 먼저 한 장을 삭제하세요.",
    tooLarge: "5 MB 미만의 사진을 선택하세요.",
    invalidType: "JPEG, PNG, WebP, AVIF 또는 HEIC 사진을 선택하세요.",
    invalidImage: "사진을 처리할 수 없습니다. 다른 이미지를 선택하세요.",
    uploadFailed: "업로드하지 못했습니다. 다시 시도하세요.",
    deleteFailed: "사진을 삭제할 수 없습니다.",
    saveFailed: "이 브라우저에 테마를 저장할 수 없습니다.",
    accountChanged: "계정이 변경되었습니다. 페이지를 다시 여세요.",
    presets: {
      classicViolet: "클래식 바이올렛",
      oceanMist: "바다 안개",
      peachGlow: "피치 글로우",
      sageGarden: "세이지 가든",
      roseQuartz: "로즈 쿼츠",
      lavenderCloud: "라벤더 구름",
      mintBreeze: "민트 바람",
      skyBlue: "하늘색",
      honeyCream: "허니 크림",
      cocoaMilk: "코코아 밀크",
      cherryBlossom: "벚꽃",
      lilacDawn: "라일락 새벽",
      sunset: "노을",
      seaGlass: "바다 유리",
      arctic: "북극",
      midnight: "한밤중",
      forestNight: "숲의 밤",
      plumNight: "플럼 나이트",
      deepOcean: "깊은 바다",
      graphite: "그라파이트",
    },
  },
});

const ERROR_KEYS = new Set([
  "signIn",
  "unavailable",
  "requestFailed",
  "limitReached",
  "tooLarge",
  "invalidType",
  "invalidImage",
  "uploadFailed",
  "deleteFailed",
  "saveFailed",
  "accountChanged",
]);

function Icon({ name, size = 20 }) {
  const paths = {
    check: "m5 12 4 4L19 6",
    image: "M3 4h18v16H3z M3 16l5-5 5 5 3-3 5 5 M15 8h.01",
    palette:
      "M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7c-.6-.4-.3-1.3.4-1.3H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8z M7 10h.01 M10 6h.01 M15 7h.01",
    upload: "M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5",
    trash: "M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14 M10 10v7 M14 10v7",
    moon: "M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5 9 9 0 1 0 20.5 13.1z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.image} />
    </svg>
  );
}

function Preview({ selection, compact = false, t }) {
  const theme = resolveChatTheme(selection);
  return (
    <div
      className={`ct-preview theme-preserve ${compact ? "ct-preview-small" : ""}`}
      style={chatThemeStyle(theme)}
      aria-hidden={compact ? "true" : undefined}
    >
      <div className="ct-preview-content">
        {!compact ? (
          <div className="ct-preview-name" style={{ color: theme.muted }}>
            {t("chatStoryThemes.previewName")}
          </div>
        ) : null}
        <div
          className="ct-preview-in"
          style={{ backgroundColor: theme.incoming, color: theme.text, borderRadius: 'var(--cs-radius) var(--cs-radius) var(--cs-radius) var(--cs-corner)', border: 'var(--cs-bubble-border)', boxShadow: 'var(--cs-bubble-shadow)' }}
        >
          {t("chatStoryThemes.previewIncoming")}
        </div>
        <div
          className="ct-preview-out"
          style={{
            background: `linear-gradient(120deg, ${theme.outgoing}, ${theme.outgoingEnd})`,
            color: "var(--cs-outgoing-text)",
            borderRadius: "var(--cs-radius) var(--cs-radius) var(--cs-corner) var(--cs-radius)",
            border: "var(--cs-bubble-border)",
            boxShadow: "var(--cs-bubble-shadow)",
          }}
        >
          {t("chatStoryThemes.previewOutgoing")}
        </div>
      </div>
    </div>
  );
}

function themeName(selection, index, t) {
  const theme = resolveChatTheme(selection);
  if (theme.source === 'preset' && theme.gradientColors) return t('chatStoryThemes.gradientColor');
  if (theme.source === 'preset' && theme.accentColor && !CHAT_THEME_ACCENTS.some((accent) => accent.color.toLowerCase() === theme.accentColor.toLowerCase())) return theme.accentColor.toUpperCase();
  return theme.source === "preset"
    ? t(theme.nameKey)
    : theme.title || t("chatStoryThemes.background", { number: index + 1 });
}

function sameTheme(first, second) {
  return JSON.stringify(first) === JSON.stringify(second);
}

const PAGE_CSS = `
.chat-theme-page { background: var(--shadow-bg-surface); display: flex; flex-direction: column; height: 100vh; height: 100dvh; min-height: 0; overflow: hidden; }
.chat-theme-overlay { position: fixed; inset: 0; z-index: 147; }
.chat-theme-page > header { flex: none; padding-top: env(safe-area-inset-top, 0px); }
.ct-main { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.ct-inner { width: 100%; max-width: 900px; margin: auto; padding: 16px 16px 22px; }
.ct-label { display: block; color: var(--shadow-text-secondary); font-size: 12px; font-weight: 500; margin: 0 0 8px; }
.ct-preview { position: relative; border-radius: 20px; padding: 16px; overflow: hidden; min-height: 164px; }
.ct-preview-content { position: relative; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.ct-preview-name { font-size: 11px; font-weight: 600; margin-left: 4px; }
.ct-preview-in, .ct-preview-out { max-width: 83%; padding: 10px 13px; border-radius: 17px; font-size: 13px; line-height: 1.65; overflow-wrap: anywhere; }
.ct-preview-in { align-self: flex-start; border-bottom-left-radius: 5px; }
.ct-preview-out { align-self: flex-end; border-bottom-right-radius: 5px; }
.ct-preview-small { min-height: 0; aspect-ratio: 1.45; padding: 12px 9px; border-radius: 16px; display: flex; align-items: center; }
.ct-preview-small .ct-preview-content { width: 100%; gap: 8px; }
.ct-preview-small .ct-preview-in, .ct-preview-small .ct-preview-out { font-size: 9px; line-height: 1.6; padding: 6px 8px; max-width: 94%; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ct-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 17px 0 14px; border-bottom: 1px solid var(--shadow-border); }
.ct-tab { display: flex; align-items: center; justify-content: center; gap: 7px; min-width: 0; min-height: 48px; padding: 8px 2px; border: 0; border-bottom: 2px solid transparent; color: var(--shadow-text-secondary); background: transparent; font-size: 12px; font-weight: 500; }
.ct-tab[aria-selected="true"] { color: var(--shadow-text-primary); border-bottom-color: var(--shadow-text-primary); font-weight: 700; }
.ct-filters { display: flex; gap: 7px; padding-bottom: 16px; overflow-x: auto; }
.ct-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 11px; }
.ct-card { position: relative; min-width: 0; }
.ct-card-choice { display: block; padding: 0; border: 0; text-align: left; width: 100%; background: transparent; color: var(--shadow-text-primary); cursor: pointer; }
.ct-card-frame { position: relative; display: block; border-radius: 18px; border: 2px solid transparent; padding: 2px; }
.ct-card-choice[aria-pressed="true"] .ct-card-frame { border-color: var(--shadow-text-primary); }
.ct-card-name { display: block; font-size: 12px; font-weight: 500; margin-top: 6px; padding: 0 3px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.ct-check { position: absolute; right: 9px; top: 9px; display: grid; place-items: center; width: 23px; height: 23px; border-radius: 50%; color: var(--shadow-bg-surface); background: var(--shadow-text-primary); }
.ct-photo-image { display: block; width: 100%; height: 100%; object-fit: cover; }
.ct-photo-frame { aspect-ratio: 1.1; overflow: hidden; background: var(--shadow-bg-soft); border-radius: 15px; display: grid; place-items: center; color: var(--shadow-text-tertiary); }
.ct-delete { position: absolute; bottom: 33px; right: 9px; border: 0; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: var(--shadow-bg-surface); color: var(--shadow-text-primary); cursor: pointer; }
.ct-upload-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.ct-counter { font-size: 12px; color: var(--shadow-text-secondary); }
.ct-primary { border: 1px solid var(--shadow-text-primary); border-radius: 24px; background: var(--shadow-text-primary); color: var(--shadow-bg-surface); padding: 11px 21px; font-size: 12px; font-weight: 600; cursor: pointer; }
.ct-primary:disabled { opacity: .45; cursor: default; }
.ct-secondary { border: 1px solid var(--shadow-border); border-radius: 24px; background: var(--shadow-bg-surface); color: var(--shadow-text-primary); padding: 10px 17px; font-size: 12px; cursor: pointer; }
.ct-palette-row { display: flex; gap: 8px; overflow-x: auto; padding: 1px 0 14px; }
.ct-palette-option { flex: none; width: 32px; height: 32px; border: 2px solid transparent; border-radius: 50%; padding: 3px; background: transparent; }
.ct-palette-option[aria-pressed="true"] { border-color: var(--shadow-text-primary); }
.ct-palette-option span { display: block; width: 100%; height: 100%; border-radius: 50%; }
.ct-footer { flex: none; border-top: 1px solid var(--shadow-border); background: var(--shadow-bg-surface); padding-bottom: env(safe-area-inset-bottom, 0px); }
.ct-footer-inner { max-width: 900px; margin: auto; padding: 12px 16px; display: flex; gap: 15px; align-items: center; justify-content: space-between; }
.ct-footer-name { min-width: 0; font-size: 12px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ct-more { padding-top: 18px; text-align: center; }
.ct-end { color: var(--shadow-text-tertiary); font-size: 11px; text-align: center; margin: 18px 0 0; }
.ct-error { color: var(--shadow-danger); font-size: 12px; line-height: 1.7; margin: 10px 0; }
.ct-confirm { padding: 15px; border: 1px solid var(--shadow-border); background: var(--shadow-bg-soft); border-radius: 16px; margin: 14px 0; }
.ct-confirm p { font-size: 12px; line-height: 1.7; color: var(--shadow-text-secondary); margin: 6px 0 12px; }
.ct-confirm strong { font-size: 13px; color: var(--shadow-text-primary); }
.ct-confirm-buttons { display: flex; gap: 10px; justify-content: flex-end; }
.ct-progress { height: 5px; overflow: hidden; background: var(--shadow-bg-soft); border-radius: 5px; margin: 10px 0; }
.ct-progress span { display: block; height: 100%; background: var(--shadow-text-primary); transition: width .15s; }
.ct-progress-info { display: flex; justify-content: space-between; align-items: center; gap: 10px; color: var(--shadow-text-secondary); font-size: 12px; }
.chat-theme-page button:focus-visible { outline: 2px solid var(--shadow-text-primary); outline-offset: 3px; }

.ct-preview-heading { display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:9px; }
.ct-preview-heading .ct-label { margin:0;flex:none; }
.ct-selected-name { color:var(--shadow-text-primary);font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right; }
.ct-apply-text { border:0;background:transparent;color:var(--shadow-text-primary);font-size:14px;font-weight:700;padding:10px 0 10px 12px;cursor:pointer; }
.ct-apply-text:disabled { opacity:.4; }
.ct-style-heading { font-size:14px;font-weight:700;color:var(--shadow-text-primary);margin:4px 0 14px; }
.ct-footer { padding-top:10px; }
.ct-color-label { max-width:900px;margin:auto;padding:0 16px;color:var(--shadow-text-secondary);font-size:12px; }
.ct-color-dock { max-width:900px;margin:auto;display:flex;align-items:center;gap:12px;padding:8px 16px 12px; }
.ct-color-scroll { display:flex;align-items:center;gap:11px;overflow-x:auto;min-width:0;flex:1;padding:4px 2px;scrollbar-width:none;overscroll-behavior-x:contain; }
.ct-color-scroll::-webkit-scrollbar { display:none; }
.ct-color-swatch { flex:none;width:34px;height:34px;border:2px solid transparent;padding:3px;border-radius:50%;background:transparent; }
.ct-color-swatch[aria-pressed="true"] { border-color:var(--shadow-text-primary); }
.ct-color-swatch span { display:block;width:100%;height:100%;border-radius:50%; }
.ct-gradient-picker { flex:none;width:46px;height:42px;padding:4px 0 4px 12px;border:0;border-left:1px solid var(--shadow-border);background:transparent; }
.ct-gradient-picker span { display:block;width:32px;height:32px;border-radius:50%;background:conic-gradient(#ff4b70,#ffd438,#42df85,#27bcec,#8f5bff,#ff4b70); }
.ct-color-modes { display:flex;gap:10px;margin:22px 0 18px; }
.ct-gradient-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px; }
.ct-gradient-grid button { height:76px;border-radius:14px;border:2px solid transparent; }
.ct-gradient-grid button[aria-pressed="true"] { outline:2px solid var(--shadow-text-primary);outline-offset:3px; }
.ct-custom-colors { display:grid;gap:12px;margin:18px 0; }
.ct-color-control { display:flex;align-items:center;gap:12px;font-size:12px;color:var(--shadow-text-primary); }
.ct-color-control span:first-child { flex:1; }
.ct-color-control input { width:48px;height:40px;padding:2px;border:1px solid var(--shadow-border);border-radius:8px;background:var(--shadow-bg-surface); }
.ct-angle { display:flex;flex-direction:column;gap:14px;margin:24px 0;color:var(--shadow-text-primary);font-size:13px; }
.ct-angle input { width:100%;accent-color:var(--shadow-text-primary); }

@media (min-width: 640px) { .ct-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 16px; } .ct-preview { min-height: 180px; } .ct-preview-small { min-height: 0; } }
@media (min-width: 960px) { .ct-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 350px) { .ct-inner { padding-left: 11px; padding-right: 11px; } .ct-tab { gap: 4px; font-size: 11px; } .ct-preview-small .ct-preview-in, .ct-preview-small .ct-preview-out { font-size: 8px; } }
@media (prefers-reduced-motion: reduce) { .ct-progress span { transition: none; } }
`;

function PhotoImage({ item, t }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [item.image_url]);
  return failed ? (
    <span>{t("chatStoryThemes.imageFailed")}</span>
  ) : (
    <img
      src={item.thumbnail_url || item.image_url}
      alt=""
      loading="lazy"
      decoding="async"
      className="ct-photo-image"
      onError={() => {
        setFailed(true);
      }}
    />
  );
}

export default function ChatStoryThemePage({ onBack, onApply } = {}) {
  const navigate = useNavigate();
  const { t } = useDisplayTranslation();
  const saved = useChatStoryTheme();
  const accountRef = useRef(saved.account);
  const [selection, setSelection] = useState(saved.selection);
  const [tab, setTab] = useState("colors");
  const [colorPageOpen, setColorPageOpen] = useState(false);
  const [colorMode, setColorMode] = useState('solid');
  const [customColors, setCustomColors] = useState(['#8b5cf6', '#287de0']);
  const [customAngle, setCustomAngle] = useState(135);
  const [backgrounds, setBackgrounds] = useState({
    items: [],
    cursor: "",
    loaded: false,
  });
  const [photos, setPhotos] = useState({ items: [], loaded: false });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [retry, setRetry] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [applied, setApplied] = useState(false);
  const fileRef = useRef(null);
  const operationRef = useRef(null);
  const moreRef = useRef(null);
  const tabsRef = useRef([]);
  const mountedRef = useRef(true);
  const selectedTheme = resolveChatTheme(selection);
  const themeTitle = themeName(selection, 0, t);
  const dirty = !sameTheme(selection, saved.selection);
  const errorText = (code) =>
    t(`chatStoryThemes.${ERROR_KEYS.has(code) ? code : "requestFailed"}`);
  const visibleColors = CHAT_THEME_STYLES.map((style) => ({ ...selection, source: 'preset', id: selectedTheme.paletteId, paletteId: selectedTheme.paletteId, styleId: style.id, styleOption: true }));
  const colorDraft = { ...selection, source: 'preset', id: selectedTheme.paletteId, paletteId: selectedTheme.paletteId, accentColor: customColors[0], gradientColors: colorMode === 'gradient' ? customColors : undefined, gradientAngle: customAngle };
  const openColorPage = () => {
    setCustomColors(selection.gradientColors || [selection.accentColor || selectedTheme.outgoing, '#287de0']);
    setCustomAngle(selection.gradientAngle ?? 135);
    setColorMode(selection.gradientColors ? 'gradient' : 'solid');
    setColorPageOpen(true);
  };
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      operationRef.current?.abort();
      moreRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (saved.account === accountRef.current) return;
    accountRef.current = saved.account;
    operationRef.current?.abort();
    moreRef.current?.abort();
    setBackgrounds({ items: [], cursor: "", loaded: false });
    setPhotos({ items: [], loaded: false });
    setSelection(saved.selection);
    setColorPageOpen(false);
    setUploading(false);
    setDeleting(false);
    setPendingDelete(null);
    setMutationError("accountChanged");
  }, [saved.account, saved.selection]);

  useEffect(() => {
    setError("");
    setMutationError("");
    if (
      tab === "colors" ||
      (tab === "shadow" ? backgrounds.loaded : photos.loaded)
    ) {
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    const load = async () => {
      try {
        if (tab === "shadow") {
          const result = await listChatThemeBackgrounds({
            signal: controller.signal,
          });
          if (!controller.signal.aborted)
            setBackgrounds({
              items: result.items,
              cursor: result.nextCursor,
              loaded: true,
            });
        } else {
          const items = await listChatThemePhotos({
            signal: controller.signal,
          });
          if (!controller.signal.aborted) setPhotos({ items, loaded: true });
        }
      } catch (loadError) {
        if (!controller.signal.aborted)
          setError(loadError.code || "requestFailed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [tab, retry, saved.account, backgrounds.loaded, photos.loaded]);

  const handleBack = () => {
    operationRef.current?.abort();
    moreRef.current?.abort();
    if (onBack) onBack();
    else navigate(-1);
  };

  const choose = (next) => {
    setSelection((current) => next.styleOption
      ? { ...current, source: 'preset', id: selectedTheme.paletteId, paletteId: selectedTheme.paletteId, image_url: undefined, title: undefined, styleId: next.styleId }
      : { ...current, ...next, styleId: current.styleId || selectedTheme.styleId, paletteId: selectedTheme.paletteId });
    setApplied(false);
    setMutationError('');
  };

  const apply = () => {
    try {
      const result = saveChatTheme(selection, accountRef.current);
      setApplied(true);
      setMutationError("");
      onApply?.(result);
    } catch (saveError) {
      setMutationError(saveError.code || "saveFailed");
    }
  };

  const loadMore = async () => {
    if (moreRef.current || !backgrounds.cursor) return;
    const controller = new AbortController();
    moreRef.current = controller;
    const cursor = backgrounds.cursor;
    setLoadingMore(true);
    setError("");
    try {
      const result = await listChatThemeBackgrounds({
        cursor,
        signal: controller.signal,
      });
      if (!controller.signal.aborted && mountedRef.current)
        setBackgrounds((current) => ({
          loaded: true,
          cursor: result.nextCursor === cursor ? "" : result.nextCursor,
          items: [
            ...current.items,
            ...result.items.filter(
              (item) =>
                !current.items.some((existing) => existing.id === item.id),
            ),
          ],
        }));
    } catch (loadError) {
      if (!controller.signal.aborted && mountedRef.current)
        setError(loadError.code || "requestFailed");
    } finally {
      if (moreRef.current === controller) moreRef.current = null;
      if (mountedRef.current) setLoadingMore(false);
    }
  };

  const autoLoadOnScroll = (event) => {
    const node = event.currentTarget;
    if (
      tab === "shadow" &&
      backgrounds.loaded &&
      27 > backgrounds.items.length &&
      backgrounds.cursor &&
      !loading &&
      !loadingMore &&
      !error &&
      node.scrollTop > 0 &&
      180 > node.scrollHeight - node.clientHeight - node.scrollTop
    )
      loadMore();
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || operationRef.current || !photos.loaded) return;
    if (photos.items.length >= CHAT_THEME_PHOTO_LIMIT) {
      setMutationError("limitReached");
      return;
    }
    const controller = new AbortController();
    operationRef.current = controller;
    setUploading(true);
    setPercent(0);
    setMutationError("");
    try {
      const item = await uploadChatThemePhoto(file, {
        signal: controller.signal,
        onProgress: (value) => {
          if (!controller.signal.aborted && mountedRef.current)
            setPercent(value);
        },
      });
      if (!controller.signal.aborted && mountedRef.current) {
        setPhotos((current) => ({
          loaded: true,
          items: [
            item,
            ...current.items.filter((photo) => photo.id !== item.id),
          ].slice(0, CHAT_THEME_PHOTO_LIMIT),
        }));
        choose(item);
      }
    } catch (uploadError) {
      if (mountedRef.current && !controller.signal.aborted)
        setMutationError(uploadError.code || "uploadFailed");
    } finally {
      if (operationRef.current === controller) operationRef.current = null;
      if (mountedRef.current) setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || operationRef.current) return;
    const id = pendingDelete.id;
    const controller = new AbortController();
    operationRef.current = controller;
    setDeleting(true);
    setMutationError("");
    try {
      await deleteChatThemePhoto(id, { signal: controller.signal });
      if (controller.signal.aborted || !mountedRef.current) return;
      setPhotos((current) => ({
        loaded: true,
        items: current.items.filter((item) => item.id !== id),
      }));
      if (selection.source === "photo" && selection.id === id)
        setSelection({
          source: "preset",
          id: DEFAULT_CHAT_THEME.id,
          paletteId: DEFAULT_CHAT_THEME.id,
        });
      if (saved.selection.source === "photo" && saved.selection.id === id)
        saveChatTheme(
          {
            source: "preset",
            id: DEFAULT_CHAT_THEME.id,
            paletteId: DEFAULT_CHAT_THEME.id,
          },
          accountRef.current,
        );
      setPendingDelete(null);
    } catch (deleteError) {
      if (!controller.signal.aborted && mountedRef.current)
        setMutationError(deleteError.code || "deleteFailed");
    } finally {
      if (operationRef.current === controller) operationRef.current = null;
      if (mountedRef.current) setDeleting(false);
    }
  };

  if (colorPageOpen) return (
    <PageShell className={`chat-theme-page ${onBack ? 'chat-theme-overlay' : ''}`}>
      <style>{PAGE_CSS}</style>
      <PageHeader title={t('chatStoryThemes.chooseColors')} onBack={() => setColorPageOpen(false)} backLabel={t('chatStoryThemes.back')}
        right={<button type="button" className="ct-apply-text" onClick={() => { setSelection(colorDraft); setApplied(false); setColorPageOpen(false); }}>{t('chatStoryThemes.doneColor')}</button>} />
      <main className="ct-main"><div className="ct-inner">
        <Preview selection={colorDraft} t={t} />
        <div className="ct-color-modes">{['solid', 'gradient'].map((mode) => <FilterChip key={mode} selected={colorMode === mode} onClick={() => setColorMode(mode)} aria-pressed={colorMode === mode}>{t(mode === 'solid' ? 'chatStoryThemes.solidColor' : 'chatStoryThemes.gradientColor')}</FilterChip>)}</div>
        {colorMode === 'gradient' ? <div className="ct-gradient-grid">{[
          ['#8b5cf6', '#38bdf8'], ['#ec4899', '#fb923c'], ['#14b8a6', '#3b82f6'], ['#f97316', '#facc15', '#ec4899'], ['#6366f1', '#a855f7', '#ec4899'], ['#065f46', '#34d399']
        ].map((colors) => <button type="button" key={colors.join('')} style={{ background: `linear-gradient(135deg, ${colors.join(',')})` }} aria-label={colors.join(' → ')} aria-pressed={JSON.stringify(customColors) === JSON.stringify(colors)} onClick={() => setCustomColors(colors)} />)}</div> : null}
        <div className="ct-custom-colors">{(colorMode === 'solid' ? customColors.slice(0, 1) : customColors).map((color, index) => <label key={index} className="ct-color-control"><span>{t('chatStoryThemes.customColor')} {index + 1}</span><input type="color" value={color} onChange={(event) => setCustomColors((current) => current.map((value, i) => i === index ? event.target.value : value))} /><span>{color.toUpperCase()}</span></label>)}</div>
        {colorMode === 'gradient' ? <>
          <button type="button" className="ct-secondary" onClick={() => setCustomColors((current) => current.length === 2 ? [...current, '#ec4899'] : current.slice(0, 2))}>{t(customColors.length === 2 ? 'chatStoryThemes.addColor' : 'chatStoryThemes.removeColor')}</button>
          <label className="ct-angle"><span>{t('chatStoryThemes.direction')} · {customAngle}°</span><input type="range" min="0" max="360" step="15" value={customAngle} onChange={(event) => setCustomAngle(Number(event.target.value))} /></label>
        </> : null}
      </div></main>
    </PageShell>
  );

  const tabKeys = ["colors", "shadow", "photos"];
  const items =
    tab === "colors"
      ? visibleColors
      : tab === "shadow"
        ? backgrounds.items
        : photos.items;
  return (
    <PageShell
      className={`chat-theme-page ${onBack ? "chat-theme-overlay" : ""}`}
    >
      <style>{PAGE_CSS}</style>
      <PageHeader
        title={t("chatStoryThemes.title")}
        onBack={handleBack}
        backLabel={t("chatStoryThemes.back")}
        right={<button type="button" className="ct-apply-text" onClick={apply} disabled={uploading || deleting}>{t('chatStoryThemes.applyShort')}</button>}
      />
      <main className="ct-main" onScroll={autoLoadOnScroll}>
        <div className="ct-inner">
          <section aria-label={t("chatStoryThemes.preview")}>
            <div className="ct-preview-heading"><span className="ct-label">{t("chatStoryThemes.preview")}</span><span className="ct-selected-name" aria-live="polite">{themeTitle}</span></div>
            <Preview selection={selection} t={t} />
          </section>
          <div
            className="ct-tabs"
            role="tablist"
            aria-label={t("chatStoryThemes.title")}
          >
            {tabKeys.map((key, index) => (
              <button
                key={key}
                type="button"
                className="ct-tab"
                role="tab"
                id={`ct-tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`ct-panel-${key}`}
                tabIndex={tab === key ? 0 : -1}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                onClick={() => {
                  setTab(key);
                  setPendingDelete(null);
                }}
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : (index + (event.key === "ArrowRight" ? 1 : -1) + 3) %
                          3;
                  setTab(tabKeys[next]);
                  tabsRef.current[next]?.focus();
                }}
              >
                <Icon
                  name={
                    key === "colors"
                      ? "palette"
                      : key === "shadow"
                        ? "moon"
                        : "image"
                  }
                  size={18}
                />
                <span>{t(`chatStoryThemes.${key}`)}</span>
              </button>
            ))}
          </div>
          <section
            role="tabpanel"
            id={`ct-panel-${tab}`}
            aria-labelledby={`ct-tab-${tab}`}
            aria-busy={loading || uploading || deleting}
          >
            {tab === 'colors' ? <h2 className="ct-style-heading">{t('chatStoryThemes.chooseStyle')}</h2> : null}
            {tab === "photos" ? (
              <>
                <div className="ct-upload-bar">
                  <div>
                    <span className="ct-counter">
                      {t("chatStoryThemes.photoCount", {
                        count: photos.items.length,
                      })}
                    </span>
                    <div className="ct-counter">
                      {t("chatStoryThemes.uploadHelp")}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ct-primary"
                    disabled={
                      !photos.loaded ||
                      uploading ||
                      deleting ||
                      photos.items.length >= CHAT_THEME_PHOTO_LIMIT ||
                      !chatThemeToken()
                    }
                    onClick={() => fileRef.current?.click()}
                  >
                    {t("chatStoryThemes.upload")}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
                    hidden
                    onChange={upload}
                    aria-label={t("chatStoryThemes.upload")}
                  />
                </div>
                {uploading ? (
                  <div role="status">
                    <div className="ct-progress-info">
                      <span>
                        {percent < 10
                          ? t("chatStoryThemes.preparing")
                          : t("chatStoryThemes.uploading", { percent })}
                      </span>
                      <button
                        type="button"
                        className="ct-secondary"
                        onClick={() => operationRef.current?.abort()}
                      >
                        {t("chatStoryThemes.cancel")}
                      </button>
                    </div>
                    <div
                      className="ct-progress"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                      aria-label={t("chatStoryThemes.upload")}
                    >
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                ) : null}
                {pendingDelete ? (
                  <div
                    className="ct-confirm"
                    role="group"
                    aria-label={t("chatStoryThemes.deleteQuestion")}
                  >
                    <strong>{t("chatStoryThemes.deleteQuestion")}</strong>
                    <p>{t("chatStoryThemes.deleteBody")}</p>
                    <div className="ct-confirm-buttons">
                      <button
                        type="button"
                        className="ct-secondary"
                        disabled={deleting}
                        onClick={() => setPendingDelete(null)}
                      >
                        {t("chatStoryThemes.cancel")}
                      </button>
                      <button
                        type="button"
                        className="ct-primary"
                        disabled={deleting}
                        onClick={confirmDelete}
                      >
                        {t(
                          deleting
                            ? "chatStoryThemes.deleting"
                            : "chatStoryThemes.remove",
                        )}
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
            {loading ? (
              <PageLoadingState label={t("chatStoryThemes.loading")} rows={2} />
            ) : null}
            {!loading && error && !items.length ? (
              <PageErrorState
                title={errorText(error)}
                actionLabel={t("chatStoryThemes.retry")}
                onAction={() => setRetry((value) => value + 1)}
              />
            ) : null}
            {!loading && !error && tab !== "colors" && !items.length ? (
              <PageEmptyState
                title={t(
                  tab === "shadow"
                    ? "chatStoryThemes.shadowEmpty"
                    : "chatStoryThemes.photosEmpty",
                )}
                body={t(
                  tab === "shadow"
                    ? "chatStoryThemes.shadowEmptyBody"
                    : "chatStoryThemes.photosEmptyBody",
                )}
                icon={
                  <Icon name={tab === "shadow" ? "moon" : "image"} size={25} />
                }
              />
            ) : null}
            {!loading && items.length ? (
              <div className="ct-grid">
                {items.map((item, index) => {
                  const name = tab === 'colors' ? t(`chatStoryThemes.styles.${item.styleId}`) : themeName(item, index, t);
                  const selected =
                    tab === 'colors' ? selection.source === 'preset' && item.styleId === selectedTheme.styleId : item.source === selection.source && item.id === selection.id;
                  return (
                    <article
                      key={tab === "colors" ? item.styleId : `${item.source}-${item.id}`}
                      className="ct-card"
                    >
                      <button
                        type="button"
                        className="ct-card-choice"
                        aria-label={t("chatStoryThemes.selectTheme", { name })}
                        aria-pressed={selected}
                        onClick={() => choose(item)}
                      >
                        <span className="ct-card-frame">
                          {item.source === "preset" ? (
                            <Preview selection={item} compact t={t} />
                          ) : (
                            <span className="ct-photo-frame">
                              <PhotoImage item={item} t={t} />
                            </span>
                          )}
                          {selected ? (
                            <span
                              className="ct-check"
                              aria-label={t("chatStoryThemes.selected")}
                            >
                              <Icon name="check" size={15} />
                            </span>
                          ) : null}
                        </span>
                        <span className="ct-card-name">{name}</span>
                      </button>
                      {item.source === "photo" ? (
                        <button
                          type="button"
                          className="ct-delete"
                          disabled={uploading || deleting}
                          aria-label={`${t("chatStoryThemes.remove")}: ${name}`}
                          onClick={() => {
                            setPendingDelete(item);
                            setMutationError("");
                          }}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : null}
            {tab === "shadow" && backgrounds.items.length ? (
              <div className="ct-more">
                {error ? (
                  <p className="ct-error" role="alert">
                    {errorText(error)}
                  </p>
                ) : null}
                {backgrounds.cursor ? (
                  <button
                    type="button"
                    className="ct-secondary"
                    disabled={loadingMore}
                    onClick={loadMore}
                  >
                    {t(
                      loadingMore
                        ? "chatStoryThemes.loading"
                        : "chatStoryThemes.loadMore",
                    )}
                  </button>
                ) : (
                  <p className="ct-end">{t("chatStoryThemes.end")}</p>
                )}
              </div>
            ) : null}
          </section>
          {mutationError ? (
            <p className="ct-error" role="alert">
              {errorText(mutationError)}
            </p>
          ) : null}
        </div>
      </main>
      {tab === 'colors' ? (
        <footer className="ct-footer">
          <div className="ct-color-label">{t('chatStoryThemes.accentColor')}</div>
          <div className="ct-color-dock">
            <div className="ct-color-scroll" role="group" aria-label={t('chatStoryThemes.accentColor')}>
              {CHAT_THEME_ACCENTS.map((accent) => (
                <button type="button" key={accent.id} className="ct-color-swatch" aria-label={t(accent.nameKey)}
                  aria-pressed={!selection.gradientColors && (selection.accentColor || selectedTheme.outgoing).toLowerCase() === accent.color.toLowerCase()}
                  onClick={() => { setSelection((current) => ({ ...current, source: 'preset', id: accent.id, paletteId: accent.id, image_url: undefined, title: undefined, styleId: selectedTheme.styleId, accentColor: accent.color, gradientColors: undefined, gradientAngle: undefined })); setApplied(false); }}>
                  <span style={{ background: accent.color }} />
                </button>
              ))}
            </div>
            <button type="button" className="ct-gradient-picker" aria-label={t('chatStoryThemes.customColor')} onClick={openColorPage}><span /></button>
          </div>
        </footer>
      ) : null}
    </PageShell>
  );
}
