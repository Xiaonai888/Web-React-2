import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

export const STUDIO_PRESETS = [
  { id: 'basic', label: 'Basic Drawing', width: 1200, height: 800, resolution: 144 },
  { id: 'manga', label: 'Manga Page', width: 1600, height: 2263, resolution: 300 },
  { id: 'webtoon', label: 'Webtoon', width: 1080, height: 1920, resolution: 144 },
  { id: 'cover', label: 'Book Cover', width: 1600, height: 2560, resolution: 300 },
  { id: 'square', label: 'Square', width: 1080, height: 1080, resolution: 144 },
  { id: 'video', label: '16:9', width: 1920, height: 1080, resolution: 144 },
  { id: 'custom', label: 'Custom', width: 1200, height: 800, resolution: 144 },
]

const STUDIO_TEXT = {
  "km": {
    "New File": "ឯកសារថ្មី",
    "New": "ថ្មី",
    "Close new file dialog": "បិទផ្ទាំងឯកសារថ្មី",
    "Name:": "ឈ្មោះ៖",
    "Document Type:": "ប្រភេទឯកសារ៖",
    "Size:": "ទំហំ៖",
    "Width:": "ទទឹង៖",
    "Height:": "កម្ពស់៖",
    "Resolution:": "កម្រិតបង្ហាញ៖",
    "Color Mode:": "របៀបពណ៌៖",
    "Background Contents:": "ផ្ទៃខាងក្រោយ៖",
    "Advanced": "ការកំណត់បន្ថែម",
    "Color Profile:": "កម្រងពណ៌៖",
    "Pixel Aspect Ratio:": "សមាមាត្រ Pixel៖",
    "Image Size:": "ទំហំរូបភាព៖",
    "New document actions": "សកម្មភាពឯកសារថ្មី",
    "OK": "យល់ព្រម",
    "Cancel": "បោះបង់",
    "Save Preset": "រក្សាទុក Preset",
    "Save Preset...": "រក្សាទុក Preset...",
    "Delete Preset...": "លុប Preset...",
    "Preset name:": "ឈ្មោះ Preset៖",
    "Orientation": "ទិសក្រដាស",
    "Portrait": "បញ្ឈរ",
    "Landscape": "ផ្ដេក",
    "Width unit": "ឯកតាទទឹង",
    "Height unit": "ឯកតាកម្ពស់",
    "Resolution unit": "ឯកតាកម្រិតបង្ហាញ",
    "RGB Color only": "គាំទ្រតែ RGB Color",
    "Only RGB Color is currently supported": "បច្ចុប្បន្នគាំទ្រតែ RGB Color",
    "8 bit only": "គាំទ្រតែ 8 bit",
    "Only 8-bit color is currently supported": "បច្ចុប្បន្នគាំទ្រតែពណ៌ 8 bit",
    "White": "ស",
    "Light Gray": "ប្រផេះស្រាល",
    "Black": "ខ្មៅ",
    "Custom Color": "ពណ៌កំណត់ផ្ទាល់ខ្លួន",
    "Custom background color": "ពណ៌ផ្ទៃខាងក្រោយកំណត់ផ្ទាល់ខ្លួន",
    "Pick a background color": "ជ្រើសពណ៌ផ្ទៃខាងក្រោយ",
    "The browser canvas uses sRGB": "Canvas របស់ Browser ប្រើ sRGB",
    "Square Pixels": "Pixels ការ៉េ",
    "Square pixels only": "គាំទ្រតែ Pixels ការ៉េ",
    "Canvas limit: 4096 px per side / 12 MP. Large paper sizes may require a lower resolution. Only RGB 8-bit and opaque backgrounds are currently supported.": "ទំហំ Canvas អតិបរមា 4096 px ក្នុងមួយជ្រុង / 12 MP។ ក្រដាសធំអាចត្រូវបន្ថយ Resolution។ បច្ចុប្បន្នគាំទ្រតែ RGB 8-bit និងផ្ទៃខាងក្រោយមិនថ្លា។",
    "Resolution must be a whole number between 72 and 600 Pixels/Inch.": "Resolution ត្រូវជាចំនួនគត់ចន្លោះ 72 ដល់ 600 Pixels/Inch។",
    "Enter valid width and height.": "សូមបញ្ចូលទទឹង និងកម្ពស់ឱ្យត្រឹមត្រូវ។",
    "Canvas limit: 64–4096 px per side, no more than 12 million pixels. Reduce size or resolution.": "Canvas អាចមានពី 64 ដល់ 4096 px ក្នុងមួយជ្រុង និងសរុបមិនលើស 12 លាន pixels។ សូមបន្ថយទំហំ ឬ Resolution។",
    "Enter a preset name.": "សូមបញ្ចូលឈ្មោះ Preset។",
    "My Presets is full. Delete one before saving another.": "My Presets ពេញហើយ។ សូមលុបមួយ មុនពេលរក្សាទុកថ្មី។",
    "A preset with this name already exists.": "មាន Preset ឈ្មោះនេះរួចហើយ។",
    "Preset saved on this browser.": "បានរក្សាទុក Preset ក្នុង Browser នេះ។",
    "Could not save this preset in the browser.": "មិនអាចរក្សាទុក Preset ក្នុង Browser នេះបានទេ។",
    "Delete preset": "លុប Preset",
    "Preset deleted.": "បានលុប Preset។",
    "Could not delete this preset from the browser.": "មិនអាចលុប Preset ពី Browser នេះបានទេ។",
    "A document name is required.": "សូមបញ្ចូលឈ្មោះឯកសារ។",
    "My Presets": "Preset របស់ខ្ញុំ",
    "Basic Drawing": "គំនូរមូលដ្ឋាន",
    "Manga Page": "ទំព័រ Manga",
    "Book Cover": "ក្របសៀវភៅ",
    "Square": "ការ៉េ",
    "Custom": "កំណត់ផ្ទាល់ខ្លួន",
    "Drawing & Illustration": "គំនូរ និងរូបភាព",
    "Manga & Comic": "Manga និង Comic",
    "International Paper": "ក្រដាសអន្តរជាតិ",
    "U.S. Paper": "ក្រដាសអាមេរិក",
    "Photo": "រូបថត",
    "Web & Social": "វេប និងបណ្ដាញសង្គម",
    "Mobile App Design": "រចនា Mobile App",
    "Film & Video": "ភាពយន្ត និងវីដេអូ",
    "Iconography": "រចនា Icon",
    "Book & Cover": "សៀវភៅ និងក្រប",
    "Pixels": "Pixels",
    "Inches": "អ៊ីញ",
    "Centimeters": "សង់ទីម៉ែត្រ",
    "Millimeters": "មីល្លីម៉ែត្រ",
    "Points": "Points",
    "Picas": "Picas"
  },
  "zh": {
    "New File": "新建文件",
    "New": "新建",
    "Close new file dialog": "关闭新建文件窗口",
    "Name:": "名称：",
    "Document Type:": "文档类型：",
    "Size:": "尺寸：",
    "Width:": "宽度：",
    "Height:": "高度：",
    "Resolution:": "分辨率：",
    "Color Mode:": "颜色模式：",
    "Background Contents:": "背景内容：",
    "Advanced": "高级",
    "Color Profile:": "色彩配置文件：",
    "Pixel Aspect Ratio:": "像素宽高比：",
    "Image Size:": "图像大小：",
    "New document actions": "新建文件操作",
    "OK": "确定",
    "Cancel": "取消",
    "Save Preset": "保存预设",
    "Save Preset...": "保存预设…",
    "Delete Preset...": "删除预设…",
    "Preset name:": "预设名称：",
    "Orientation": "方向",
    "Portrait": "纵向",
    "Landscape": "横向",
    "Width unit": "宽度单位",
    "Height unit": "高度单位",
    "Resolution unit": "分辨率单位",
    "RGB Color only": "仅支持 RGB 颜色",
    "Only RGB Color is currently supported": "目前仅支持 RGB 颜色",
    "8 bit only": "仅支持 8 位",
    "Only 8-bit color is currently supported": "目前仅支持 8 位颜色",
    "White": "白色",
    "Light Gray": "浅灰色",
    "Black": "黑色",
    "Custom Color": "自定义颜色",
    "Custom background color": "自定义背景颜色",
    "Pick a background color": "选择背景颜色",
    "The browser canvas uses sRGB": "浏览器画布使用 sRGB",
    "Square Pixels": "方形像素",
    "Square pixels only": "仅支持方形像素",
    "Canvas limit: 4096 px per side / 12 MP. Large paper sizes may require a lower resolution. Only RGB 8-bit and opaque backgrounds are currently supported.": "画布最大每边 4096 px / 1200 万像素。大尺寸纸张可能需要降低分辨率。目前仅支持 RGB 8 位和不透明背景。",
    "Resolution must be a whole number between 72 and 600 Pixels/Inch.": "分辨率必须是 72 到 600 Pixels/Inch 之间的整数。",
    "Enter valid width and height.": "请输入有效的宽度和高度。",
    "Canvas limit: 64–4096 px per side, no more than 12 million pixels. Reduce size or resolution.": "画布每边必须为 64～4096 px，总像素不超过 1200 万。请减小尺寸或分辨率。",
    "Enter a preset name.": "请输入预设名称。",
    "My Presets is full. Delete one before saving another.": "我的预设已满，请先删除一个。",
    "A preset with this name already exists.": "同名预设已存在。",
    "Preset saved on this browser.": "预设已保存在当前浏览器。",
    "Could not save this preset in the browser.": "无法在浏览器中保存预设。",
    "Delete preset": "删除预设",
    "Preset deleted.": "预设已删除。",
    "Could not delete this preset from the browser.": "无法从浏览器删除预设。",
    "A document name is required.": "必须填写文件名。",
    "My Presets": "我的预设",
    "Basic Drawing": "基础绘画",
    "Manga Page": "漫画页面",
    "Book Cover": "书籍封面",
    "Square": "正方形",
    "Custom": "自定义",
    "Drawing & Illustration": "绘画与插画",
    "Manga & Comic": "漫画与连环画",
    "International Paper": "国际纸张",
    "U.S. Paper": "美国纸张",
    "Photo": "照片",
    "Web & Social": "网页与社交媒体",
    "Mobile App Design": "移动应用设计",
    "Film & Video": "影视与视频",
    "Iconography": "图标设计",
    "Book & Cover": "书籍与封面",
    "Pixels": "像素",
    "Inches": "英寸",
    "Centimeters": "厘米",
    "Millimeters": "毫米",
    "Points": "磅",
    "Picas": "派卡"
  },
  "ja": {
    "New File": "新規ファイル",
    "New": "新規",
    "Close new file dialog": "新規ファイル画面を閉じる",
    "Name:": "名前：",
    "Document Type:": "ドキュメントの種類：",
    "Size:": "サイズ：",
    "Width:": "幅：",
    "Height:": "高さ：",
    "Resolution:": "解像度：",
    "Color Mode:": "カラーモード：",
    "Background Contents:": "背景の内容：",
    "Advanced": "詳細設定",
    "Color Profile:": "カラープロファイル：",
    "Pixel Aspect Ratio:": "ピクセル縦横比：",
    "Image Size:": "画像サイズ：",
    "New document actions": "新規ファイルの操作",
    "OK": "OK",
    "Cancel": "キャンセル",
    "Save Preset": "プリセットを保存",
    "Save Preset...": "プリセットを保存…",
    "Delete Preset...": "プリセットを削除…",
    "Preset name:": "プリセット名：",
    "Orientation": "用紙の向き",
    "Portrait": "縦向き",
    "Landscape": "横向き",
    "Width unit": "幅の単位",
    "Height unit": "高さの単位",
    "Resolution unit": "解像度の単位",
    "RGB Color only": "RGB カラーのみ対応",
    "Only RGB Color is currently supported": "現在は RGB カラーのみ対応しています",
    "8 bit only": "8 bit のみ対応",
    "Only 8-bit color is currently supported": "現在は 8 bit カラーのみ対応しています",
    "White": "白",
    "Light Gray": "薄いグレー",
    "Black": "黒",
    "Custom Color": "カスタムカラー",
    "Custom background color": "カスタム背景色",
    "Pick a background color": "背景色を選択",
    "The browser canvas uses sRGB": "ブラウザーのキャンバスは sRGB を使用します",
    "Square Pixels": "正方形ピクセル",
    "Square pixels only": "正方形ピクセルのみ対応",
    "Canvas limit: 4096 px per side / 12 MP. Large paper sizes may require a lower resolution. Only RGB 8-bit and opaque backgrounds are currently supported.": "キャンバスの上限は各辺 4096 px / 1200 万ピクセルです。大きな用紙には低い解像度が必要な場合があります。RGB 8 bit と不透明な背景のみ対応します。",
    "Resolution must be a whole number between 72 and 600 Pixels/Inch.": "解像度は 72～600 Pixels/Inch の整数で入力してください。",
    "Enter valid width and height.": "幅と高さを正しく入力してください。",
    "Canvas limit: 64–4096 px per side, no more than 12 million pixels. Reduce size or resolution.": "キャンバスは各辺 64～4096 px、合計 1200 万ピクセル以下です。サイズか解像度を下げてください。",
    "Enter a preset name.": "プリセット名を入力してください。",
    "My Presets is full. Delete one before saving another.": "マイプリセットが上限に達しました。追加する前に一つ削除してください。",
    "A preset with this name already exists.": "同じ名前のプリセットがあります。",
    "Preset saved on this browser.": "プリセットをこのブラウザーに保存しました。",
    "Could not save this preset in the browser.": "ブラウザーにプリセットを保存できませんでした。",
    "Delete preset": "プリセットを削除",
    "Preset deleted.": "プリセットを削除しました。",
    "Could not delete this preset from the browser.": "ブラウザーからプリセットを削除できませんでした。",
    "A document name is required.": "ドキュメント名を入力してください。",
    "My Presets": "マイプリセット",
    "Basic Drawing": "基本の描画",
    "Manga Page": "マンガページ",
    "Book Cover": "本の表紙",
    "Square": "正方形",
    "Custom": "カスタム",
    "Drawing & Illustration": "描画とイラスト",
    "Manga & Comic": "マンガとコミック",
    "International Paper": "国際規格用紙",
    "U.S. Paper": "米国用紙",
    "Photo": "写真",
    "Web & Social": "ウェブと SNS",
    "Mobile App Design": "モバイルアプリのデザイン",
    "Film & Video": "映像と動画",
    "Iconography": "アイコンデザイン",
    "Book & Cover": "本と表紙",
    "Pixels": "ピクセル",
    "Inches": "インチ",
    "Centimeters": "センチメートル",
    "Millimeters": "ミリメートル",
    "Points": "ポイント",
    "Picas": "パイカ"
  },
  "ko": {
    "New File": "새 파일",
    "New": "새로 만들기",
    "Close new file dialog": "새 파일 창 닫기",
    "Name:": "이름:",
    "Document Type:": "문서 유형:",
    "Size:": "크기:",
    "Width:": "너비:",
    "Height:": "높이:",
    "Resolution:": "해상도:",
    "Color Mode:": "색상 모드:",
    "Background Contents:": "배경 내용:",
    "Advanced": "고급 설정",
    "Color Profile:": "색상 프로필:",
    "Pixel Aspect Ratio:": "픽셀 가로세로 비율:",
    "Image Size:": "이미지 크기:",
    "New document actions": "새 파일 작업",
    "OK": "확인",
    "Cancel": "취소",
    "Save Preset": "프리셋 저장",
    "Save Preset...": "프리셋 저장…",
    "Delete Preset...": "프리셋 삭제…",
    "Preset name:": "프리셋 이름:",
    "Orientation": "방향",
    "Portrait": "세로",
    "Landscape": "가로",
    "Width unit": "너비 단위",
    "Height unit": "높이 단위",
    "Resolution unit": "해상도 단위",
    "RGB Color only": "RGB 색상만 지원",
    "Only RGB Color is currently supported": "현재 RGB 색상만 지원합니다",
    "8 bit only": "8비트만 지원",
    "Only 8-bit color is currently supported": "현재 8비트 색상만 지원합니다",
    "White": "흰색",
    "Light Gray": "밝은 회색",
    "Black": "검정",
    "Custom Color": "사용자 지정 색상",
    "Custom background color": "사용자 지정 배경색",
    "Pick a background color": "배경색 선택",
    "The browser canvas uses sRGB": "브라우저 캔버스는 sRGB를 사용합니다",
    "Square Pixels": "정사각형 픽셀",
    "Square pixels only": "정사각형 픽셀만 지원",
    "Canvas limit: 4096 px per side / 12 MP. Large paper sizes may require a lower resolution. Only RGB 8-bit and opaque backgrounds are currently supported.": "캔버스는 한 변 최대 4096 px / 1,200만 픽셀입니다. 큰 용지는 해상도를 낮춰야 할 수 있습니다. RGB 8비트 및 불투명 배경만 지원합니다.",
    "Resolution must be a whole number between 72 and 600 Pixels/Inch.": "해상도는 72~600 Pixels/Inch 사이의 정수여야 합니다.",
    "Enter valid width and height.": "올바른 너비와 높이를 입력하세요.",
    "Canvas limit: 64–4096 px per side, no more than 12 million pixels. Reduce size or resolution.": "캔버스는 한 변 64~4096 px, 총 1,200만 픽셀 이하여야 합니다. 크기나 해상도를 낮추세요.",
    "Enter a preset name.": "프리셋 이름을 입력하세요.",
    "My Presets is full. Delete one before saving another.": "내 프리셋이 가득 찼습니다. 하나를 삭제한 후 저장하세요.",
    "A preset with this name already exists.": "같은 이름의 프리셋이 이미 있습니다.",
    "Preset saved on this browser.": "이 브라우저에 프리셋을 저장했습니다.",
    "Could not save this preset in the browser.": "브라우저에 프리셋을 저장할 수 없습니다.",
    "Delete preset": "프리셋 삭제",
    "Preset deleted.": "프리셋이 삭제되었습니다.",
    "Could not delete this preset from the browser.": "브라우저에서 프리셋을 삭제할 수 없습니다.",
    "A document name is required.": "문서 이름을 입력하세요.",
    "My Presets": "내 프리셋",
    "Basic Drawing": "기본 드로잉",
    "Manga Page": "만화 페이지",
    "Book Cover": "책 표지",
    "Square": "정사각형",
    "Custom": "사용자 지정",
    "Drawing & Illustration": "드로잉 및 일러스트",
    "Manga & Comic": "만화 및 코믹",
    "International Paper": "국제 용지",
    "U.S. Paper": "미국 용지",
    "Photo": "사진",
    "Web & Social": "웹 및 소셜",
    "Mobile App Design": "모바일 앱 디자인",
    "Film & Video": "영화 및 동영상",
    "Iconography": "아이콘 디자인",
    "Book & Cover": "책 및 표지",
    "Pixels": "픽셀",
    "Inches": "인치",
    "Centimeters": "센티미터",
    "Millimeters": "밀리미터",
    "Points": "포인트",
    "Picas": "파이카"
  }
}

function studioTranslate(language, text) {
  return STUDIO_TEXT[language]?.[text] || text
}

const MAX_SIDE = 4096
const MAX_AREA = 12_000_000
const SAVED_KEY = 'shadow-studio-paper-presets-v1'
const MAX_SAVED = 20
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

const PAPER_GROUPS = [
  { id: 'drawing', label: 'Drawing & Illustration', presets: [STUDIO_PRESETS[0], STUDIO_PRESETS[4], { id: 'art-portrait', label: 'Portrait Illustration', width: 2400, height: 3200, resolution: 300 }, { id: 'art-landscape', label: 'Landscape Illustration', width: 3200, height: 2400, resolution: 300 }] },
  { id: 'manga', label: 'Manga & Comic', presets: [STUDIO_PRESETS[1], STUDIO_PRESETS[2], { id: 'manga-b5', label: 'B5 Manga Page', width: 2079, height: 2953, resolution: 300 }, { id: 'manga-spread', label: 'Manga Double Page', width: 3200, height: 2263, resolution: 300 }, { id: 'comic-us', label: 'US Comic Page', width: 2100, height: 3150, resolution: 300 }] },
  { id: 'international', label: 'International Paper', presets: [
    { id: 'a0', label: 'A0 · 72 PPI', width: 2384, height: 3370, resolution: 72 },
    { id: 'a1', label: 'A1 · 100 PPI', width: 2339, height: 3307, resolution: 100 },
    { id: 'a2', label: 'A2 · 144 PPI', width: 2381, height: 3368, resolution: 144 },
    { id: 'a3', label: 'A3 · 200 PPI', width: 2339, height: 3307, resolution: 200 },
    { id: 'a4', label: 'A4 · 300 PPI', width: 2480, height: 3508, resolution: 300 },
    { id: 'a5', label: 'A5 · 300 PPI', width: 1748, height: 2480, resolution: 300 },
    { id: 'a6', label: 'A6 · 300 PPI', width: 1240, height: 1748, resolution: 300 },
    { id: 'b4', label: 'B4 · 200 PPI', width: 1969, height: 2787, resolution: 200 },
    { id: 'b5', label: 'B5 · 300 PPI', width: 2079, height: 2953, resolution: 300 },
  ] },
  { id: 'us', label: 'U.S. Paper', presets: [
    { id: 'us-letter', label: 'Letter · 300 PPI', width: 2550, height: 3300, resolution: 300 },
    { id: 'us-legal', label: 'Legal · 200 PPI', width: 1700, height: 2800, resolution: 200 },
    { id: 'us-tabloid', label: 'Tabloid · 150 PPI', width: 1650, height: 2550, resolution: 150 },
    { id: 'us-half', label: 'Half Letter · 300 PPI', width: 1650, height: 2550, resolution: 300 },
  ] },
  { id: 'photo', label: 'Photo', presets: [
    { id: 'photo-4x6', label: '4 × 6 in', width: 1200, height: 1800, resolution: 300 },
    { id: 'photo-5x7', label: '5 × 7 in', width: 1500, height: 2100, resolution: 300 },
    { id: 'photo-8x10', label: '8 × 10 in', width: 2400, height: 3000, resolution: 300 },
  ] },
  { id: 'web', label: 'Web & Social', presets: [STUDIO_PRESETS[4], STUDIO_PRESETS[5], { id: 'web-hd', label: 'HD 1280 × 720', width: 1280, height: 720, resolution: 144 }, { id: 'web-post', label: 'Social Portrait 1080 × 1350', width: 1080, height: 1350, resolution: 144 }, { id: 'web-banner', label: 'Social Banner 1200 × 630', width: 1200, height: 630, resolution: 144 }, { id: 'web-4k', label: '4K 3840 × 2160', width: 3840, height: 2160, resolution: 144 }] },
  { id: 'mobile', label: 'Mobile App Design', presets: [{ id: 'mobile-story', label: 'Story 1080 × 1920', width: 1080, height: 1920, resolution: 144 }, { id: 'mobile-phone', label: 'Phone 1170 × 2532', width: 1170, height: 2532, resolution: 144 }, { id: 'mobile-large', label: 'Large Phone 1290 × 2796', width: 1290, height: 2796, resolution: 144 }] },
  { id: 'video', label: 'Film & Video', presets: [STUDIO_PRESETS[5], { id: 'video-portrait', label: 'Vertical 9:16', width: 1080, height: 1920, resolution: 144 }, { id: 'video-cinema', label: 'Cinema 2K', width: 2048, height: 1080, resolution: 144 }, { id: 'video-4k', label: 'UHD 4K', width: 3840, height: 2160, resolution: 144 }] },
  { id: 'icon', label: 'Iconography', presets: [{ id: 'icon-256', label: 'Icon 256 × 256', width: 256, height: 256, resolution: 144 }, { id: 'icon-512', label: 'Icon 512 × 512', width: 512, height: 512, resolution: 144 }, { id: 'icon-1024', label: 'Icon 1024 × 1024', width: 1024, height: 1024, resolution: 144 }, { id: 'icon-2048', label: 'Icon 2048 × 2048', width: 2048, height: 2048, resolution: 144 }] },
  { id: 'cover', label: 'Book & Cover', presets: [STUDIO_PRESETS[3], { id: 'cover-ebook', label: 'E-book Cover 1600 × 2400', width: 1600, height: 2400, resolution: 300 }, { id: 'cover-print', label: 'Print Cover 2400 × 3600', width: 2400, height: 3600, resolution: 300 }] },
  { id: 'custom', label: 'Custom', presets: [STUDIO_PRESETS[6]] },
]

const BUILTIN_PRESETS = PAPER_GROUPS.flatMap((group) => group.presets)
const UNITS = [
  { id: 'px', label: 'Pixels' },
  { id: 'in', label: 'Inches' },
  { id: 'cm', label: 'Centimeters' },
  { id: 'mm', label: 'Millimeters' },
  { id: 'pt', label: 'Points' },
  { id: 'pc', label: 'Picas' },
]
const VALID_UNITS = new Set(UNITS.map((item) => item.id))
const PHYSICAL = {
  a0: [841, 1189], a1: [594, 841], a2: [420, 594], a3: [297, 420],
  a4: [210, 297], a5: [148, 210], a6: [105, 148], b4: [250, 353], b5: [176, 250],
  'us-letter': [8.5, 11], 'us-legal': [8.5, 14], 'us-tabloid': [11, 17], 'us-half': [5.5, 8.5],
  'photo-4x6': [4, 6], 'photo-5x7': [5, 7], 'photo-8x10': [8, 10],
}
const factor = (unit, ppi) => unit === 'in' ? ppi : unit === 'cm' ? ppi / 2.54 : unit === 'mm' ? ppi / 25.4 : unit === 'pt' ? ppi / 72 : unit === 'pc' ? ppi / 6 : 1
const toPixels = (value, unit, ppi) => Math.round(Number(value) * factor(unit, ppi))
const toUnit = (value, unit, ppi) => unit === 'px' ? String(value) : String(Number((value / factor(unit, ppi)).toFixed(unit === 'in' || unit === 'pc' ? 4 : 3)))
const presetUnit = (group) => group === 'international' ? 'mm' : group === 'us' || group === 'photo' ? 'in' : 'px'
const presetLabel = (item) => PHYSICAL[item.id] ? item.label.replace(/\s*[·•]\s*\d+\s*PPI/i, '').trim() : item.label
const validSize = (w, h, ppi) => Number.isInteger(w) && Number.isInteger(h) && Number.isInteger(ppi) && w >= 64 && h >= 64 && w <= MAX_SIDE && h <= MAX_SIDE && w * h <= MAX_AREA && ppi >= 72 && ppi <= 600

function readSaved() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item) => item && /^saved-[a-z0-9-]{1,28}$/.test(item.id) && typeof item.label === 'string' && item.label.trim() && validSize(item.width, item.height, item.resolution))
      .slice(0, MAX_SAVED).map((item) => ({
        id: item.id, label: item.label.trim().slice(0, 48), width: item.width, height: item.height,
        resolution: item.resolution, background: isHexColor(item.background) ? item.background : '#FFFFFF',
        unit: VALID_UNITS.has(item.unit) ? item.unit : 'px',
        heightUnit: VALID_UNITS.has(item.heightUnit) ? item.heightUnit : VALID_UNITS.has(item.unit) ? item.unit : 'px',
        physicalWidth: Number.isFinite(item.physicalWidth) && item.physicalWidth > 0 ? item.physicalWidth : null,
        physicalHeight: Number.isFinite(item.physicalHeight) && item.physicalHeight > 0 ? item.physicalHeight : null,
      }))
  } catch {
    return []
  }
}

function findGroup(id) {
  return PAPER_GROUPS.find((group) => group.presets.some((item) => item.id === id))?.id || 'drawing'
}

export default function StudioNewFileDialog({ open, defaultName, initialPreset = 'basic', onClose, onCreate }) {
  const initial = BUILTIN_PRESETS.find((item) => item.id === initialPreset) || STUDIO_PRESETS[0]
  const { language } = useDisplayTranslation()
  const tr = (text) => studioTranslate(language, text)
  const [saved, setSaved] = useState(readSaved)
  const [name, setName] = useState(defaultName || 'Untitled-1')
  const [groupId, setGroupId] = useState(findGroup(initial.id))
  const [presetId, setPresetId] = useState(initial.id)
  const [widthUnit, setWidthUnit] = useState('px')
  const [heightUnit, setHeightUnit] = useState('px')
  const [widthInput, setWidthInput] = useState(String(initial.width))
  const [heightInput, setHeightInput] = useState(String(initial.height))
  const [resolutionInput, setResolutionInput] = useState(String(initial.resolution))
  const [backgroundType, setBackgroundType] = useState('white')
  const [customBackground, setCustomBackground] = useState('#FFFFFF')
  const [savedName, setSavedName] = useState('')
  const [presetNaming, setPresetNaming] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const ppi = Number(resolutionInput)
  const width = toPixels(widthInput, widthUnit, ppi)
  const height = toPixels(heightInput, heightUnit, ppi)
  const background = backgroundType === 'black' ? '#000000' : backgroundType === 'gray' ? '#E5E7EB' : backgroundType === 'custom' ? customBackground : '#FFFFFF'

  useEffect(() => {
    if (!open) return
    const next = BUILTIN_PRESETS.find((item) => item.id === initialPreset) || STUDIO_PRESETS[0]
    const group = findGroup(next.id)
    const unit = presetUnit(group)
    const physical = PHYSICAL[next.id]
    setSaved(readSaved())
    setName(defaultName || 'Untitled-1')
    setGroupId(group)
    setPresetId(next.id)
    setWidthUnit(unit)
    setHeightUnit(unit)
    setWidthInput(physical ? String(physical[0]) : toUnit(next.width, unit, next.resolution))
    setHeightInput(physical ? String(physical[1]) : toUnit(next.height, unit, next.resolution))
    setResolutionInput(String(next.resolution))
    setBackgroundType('white')
    setCustomBackground('#FFFFFF')
    setSavedName('')
    setPresetNaming(false)
    setError('')
    setNotice('')
  }, [open, defaultName, initialPreset])

  const groups = saved.length ? [...PAPER_GROUPS, { id: 'saved', label: `${tr('My Presets')} (${saved.length})`, presets: saved }] : PAPER_GROUPS
  const currentGroup = groups.find((item) => item.id === groupId) || groups[0]
  const choices = currentGroup.presets.some((item) => item.id === presetId) ? currentGroup.presets : [...currentGroup.presets, { id: 'custom', label: 'Custom' }]
  const status = useMemo(() => {
    if (!Number.isInteger(ppi) || ppi < 72 || ppi > 600) return tr('Resolution must be a whole number between 72 and 600 Pixels/Inch.')
    if (!widthInput.trim() || !heightInput.trim() || !Number.isFinite(Number(widthInput)) || !Number.isFinite(Number(heightInput)) || Number(widthInput) <= 0 || Number(heightInput) <= 0) return tr('Enter valid width and height.')
    if (!validSize(width, height, ppi)) return tr('Canvas limit: 64–4096 px per side, no more than 12 million pixels. Reduce size or resolution.')
    return ''
  }, [width, height, ppi, widthInput, heightInput, language])
  const imageSize = Number.isFinite(width * height) ? (width * height * 4 / 1048576).toFixed(1) : '0.0'

  function markCustom() {
    setPresetId('custom')
    setError('')
    setNotice('')
  }

  function applyBackground(color) {
    const safe = isHexColor(color) ? color.toUpperCase() : '#FFFFFF'
    setCustomBackground(safe)
    setBackgroundType(safe === '#FFFFFF' ? 'white' : safe === '#000000' ? 'black' : safe === '#E5E7EB' ? 'gray' : 'custom')
  }

  function applyPreset(next, targetGroup = groupId) {
    const unit = VALID_UNITS.has(next.unit) ? next.unit : presetUnit(targetGroup)
    const hu = VALID_UNITS.has(next.heightUnit) ? next.heightUnit : unit
    const physical = PHYSICAL[next.id]
    setGroupId(targetGroup)
    setPresetId(next.id)
    setWidthUnit(unit)
    setHeightUnit(hu)
    setResolutionInput(String(next.resolution))
    setWidthInput(physical && unit === presetUnit(targetGroup) ? String(physical[0]) : next.physicalWidth ? String(next.physicalWidth) : toUnit(next.width, unit, next.resolution))
    setHeightInput(physical && hu === presetUnit(targetGroup) ? String(physical[1]) : next.physicalHeight ? String(next.physicalHeight) : toUnit(next.height, hu, next.resolution))
    applyBackground(next.background)
    setError('')
    setNotice('')
  }

  function selectGroup(id) {
    const group = groups.find((item) => item.id === id)
    if (!group) return
    if (group.id === 'custom') {
      setGroupId('custom')
      markCustom()
    } else if (group.presets[0]) applyPreset(group.presets[0], group.id)
  }

  function changeUnit(nextUnit, dimension) {
    if (!VALID_UNITS.has(nextUnit)) return
    const current = dimension === 'width' ? widthUnit : heightUnit
    if (current === nextUnit) return
    const currentPixels = dimension === 'width' ? width : height
    const updateInput = dimension === 'width' ? setWidthInput : setHeightInput
    updateInput(Number.isFinite(currentPixels) && currentPixels > 0 && Number.isFinite(ppi) && ppi > 0 ? toUnit(currentPixels, nextUnit, ppi) : '')
    if (dimension === 'width') setWidthUnit(nextUnit)
    else setHeightUnit(nextUnit)
    markCustom()
  }

  function orient(direction) {
    if ((direction === 'portrait' && width > height) || (direction === 'landscape' && height > width)) {
      setWidthInput(heightInput)
      setHeightInput(widthInput)
      setWidthUnit(heightUnit)
      setHeightUnit(widthUnit)
      markCustom()
    }
  }

  function savePreset() {
    if (!presetNaming) {
      setPresetNaming(true)
      setSavedName(name.trim().slice(0, 48))
      return
    }
    const title = savedName.trim().slice(0, 48)
    if (!title) return setError(tr('Enter a preset name.'))
    if (status) return setError(status)
    if (saved.length >= MAX_SAVED) return setError(tr('My Presets is full. Delete one before saving another.'))
    if (saved.some((item) => item.label.toLowerCase() === title.toLowerCase())) return setError(tr('A preset with this name already exists.'))
    const item = {
      id: `saved-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      label: title, width, height, resolution: ppi, background, unit: widthUnit, heightUnit,
      physicalWidth: Number(widthInput), physicalHeight: Number(heightInput),
    }
    const next = [...saved, item]
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      setGroupId('saved')
      setPresetId(item.id)
      setSavedName('')
      setPresetNaming(false)
      setError('')
      setNotice(`${tr('Preset saved on this browser.')} “${title}”`)
    } catch {
      setError(tr('Could not save this preset in the browser.'))
    }
  }

  function deletePreset() {
    const selected = saved.find((item) => item.id === presetId)
    if (!selected || !window.confirm(`${tr('Delete preset')} “${selected.label}”?`)) return
    const next = saved.filter((item) => item.id !== selected.id)
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      setSaved(next)
      if (next.length) applyPreset(next[0], 'saved')
      else { setGroupId('custom'); markCustom() }
      setNotice(`${tr('Preset deleted.')} “${selected.label}”`)
      setError('')
    } catch {
      setError(tr('Could not delete this preset from the browser.'))
    }
  }

  function submit(event) {
    event.preventDefault()
    const cleanName = name.trim().slice(0, 80)
    if (!cleanName) return setError(tr('A document name is required.'))
    if (status) return setError(status)
    setError('')
    onCreate({ name: cleanName, width, height, resolution: ppi, background, presetId })
  }

  if (!open) return null

  return (
    <div className="ss-dialog-backdrop ss-nd-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <style>{`
        .shadow-studio .ss-nd-backdrop{padding:8px;background:rgba(0,0,0,.68)}
        .shadow-studio .ss-paper-dialog{box-sizing:border-box;width:min(568px,100%);max-height:calc(100dvh - 16px);display:flex;flex-direction:column;overflow:hidden;border:1px solid #858585;border-radius:2px;background:#535353;color:#f1f1f1;box-shadow:0 20px 55px #0009;font:12px Arial,Helvetica,sans-serif}
        .shadow-studio .ss-nd-head{display:flex;align-items:center;justify-content:space-between;height:29px;flex:none;border-bottom:1px solid #aaa;background:#f9f9f9;color:#222;padding:0 10px}
        .shadow-studio .ss-nd-head h2{margin:0;font-size:12px;font-weight:400}
        .shadow-studio .ss-nd-close{width:23px;height:23px;border:0;border-radius:0;background:transparent;color:#222;font:18px Arial;cursor:pointer}
        .shadow-studio .ss-nd-close:hover{background:#dedede}
        .shadow-studio .ss-nd-content{display:grid;grid-template-columns:minmax(0,1fr) 127px;min-height:0;flex:1;overflow:hidden}
        .shadow-studio .ss-nd-fields{display:grid;align-content:start;gap:6px;min-width:0;overflow-y:auto;overscroll-behavior:contain;padding:11px 12px 12px 13px}
        .shadow-studio .ss-nd-row{display:grid;grid-template-columns:120px minmax(0,1fr);align-items:center;gap:7px;min-width:0}
        .shadow-studio .ss-nd-label{color:#f1f1f1;font-size:11px;font-weight:400;text-align:right}
        .shadow-studio .ss-nd-control{box-sizing:border-box;min-width:0;width:100%;height:25px;border:1px solid #747474;border-radius:1px;background:#454545;color:#fff;padding:0 5px;font:11px Arial,Helvetica,sans-serif;outline:none}
        .shadow-studio .ss-nd-control:focus-visible{border-color:#7badf7;box-shadow:0 0 0 1px #7badf7}
        .shadow-studio .ss-nd-control:disabled{color:#d1d1d1;background:#595959;opacity:.85}
        .shadow-studio .ss-nd-three{display:grid;grid-template-columns:minmax(0,1fr) 118px;gap:5px;min-width:0}
        .shadow-studio .ss-nd-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:5px;min-width:0}
        .shadow-studio .ss-nd-line{display:flex;align-items:center;gap:6px;min-width:0}
        .shadow-studio .ss-nd-line>.ss-nd-control{flex:1}
        .shadow-studio .ss-nd-orient{display:flex;gap:3px;flex:none}
        .shadow-studio .ss-nd-orient button{width:23px;height:24px;border:1px solid #737373;border-radius:1px;background:#4a4a4a;color:#e9e9e9;font:13px Arial;cursor:pointer}
        .shadow-studio .ss-nd-orient button[aria-pressed=true]{border-color:#84b8f4;background:#38669c;color:#fff}
        .shadow-studio .ss-nd-background{display:grid;grid-template-columns:minmax(0,1fr) 26px 26px;gap:5px;align-items:center;min-width:0}
        .shadow-studio .ss-nd-background input[type=color]{width:26px;height:25px;border:1px solid #888;padding:1px;cursor:pointer}
        .shadow-studio .ss-nd-swatch{display:block;width:25px;height:24px;border:1px solid #aaa;box-sizing:border-box}
        .shadow-studio .ss-nd-info{margin:2px 0 0;border:1px solid #757575;border-radius:2px;padding:6px 8px;color:#e1e1e1;font-size:10px;line-height:1.5}
        .shadow-studio .ss-nd-advanced{margin-top:1px;border:1px solid #7a7a7a;padding:5px 8px 7px}
        .shadow-studio .ss-nd-advanced summary{cursor:pointer;color:#f2f2f2;font-size:11px}
        .shadow-studio .ss-nd-advanced-body{display:grid;gap:6px;margin-top:7px}
        .shadow-studio .ss-nd-hint{margin:2px 0;color:#c8c8c8;font-size:10px;line-height:1.4}
        .shadow-studio .ss-nd-actions{display:flex;flex-direction:column;gap:7px;min-width:0;border-left:1px solid #727272;padding:11px 9px}
        .shadow-studio .ss-nd-actions button{min-height:26px;border:1px solid #999;border-radius:16px;background:#565656;color:#fff;font:11px Arial,Helvetica,sans-serif;cursor:pointer}
        .shadow-studio .ss-nd-actions button.primary{background:#4b9df4;border-color:#8ebdff;color:#102033;font-weight:700}
        .shadow-studio .ss-nd-actions button:disabled{color:#aaa;border-color:#6e6e6e;opacity:.62;cursor:default}
        .shadow-studio .ss-nd-actions button:not(:disabled):hover{filter:brightness(1.13)}
        .shadow-studio .ss-nd-preset-save{display:grid;gap:4px;margin-top:5px;border-top:1px solid #787878;padding-top:6px}
        .shadow-studio .ss-nd-preset-save input{box-sizing:border-box;width:100%;min-width:0;height:25px;border:1px solid #777;background:#404040;color:#fff;padding:0 5px;font:11px Arial}
        .shadow-studio .ss-nd-image-size{margin-top:auto;color:#eaeaea;text-align:center;font-size:11px;line-height:1.65}
        .shadow-studio .ss-nd-status{margin:2px 0;background:#683b3b;color:#ffdbdb;padding:6px;border-radius:2px;font-size:10px;line-height:1.45}
        .shadow-studio .ss-nd-success{margin:0;background:#356149;color:#e7ffec;padding:6px;border-radius:2px;font-size:10px}
        @media(max-width:620px){
          .shadow-studio .ss-paper-dialog{width:100%;max-height:calc(100dvh - 10px)}
          .shadow-studio .ss-nd-content{display:flex;flex-direction:column;overflow-y:auto}
          .shadow-studio .ss-nd-fields{overflow:visible;flex:0 0 auto;padding:11px 9px;gap:7px}
          .shadow-studio .ss-nd-row{grid-template-columns:88px minmax(0,1fr);gap:6px}
          .shadow-studio .ss-nd-three{grid-template-columns:minmax(0,1fr) 102px}
          .shadow-studio .ss-nd-actions{border-top:1px solid #777;border-left:0;display:grid;grid-template-columns:1fr 1fr;padding:9px}
          .shadow-studio .ss-nd-image-size{grid-column:1/-1;margin-top:0}
          .shadow-studio .ss-nd-preset-save{grid-column:1/-1}
        }
        @media(max-width:370px){.shadow-studio .ss-nd-three{grid-template-columns:minmax(0,1fr) 90px}.shadow-studio .ss-nd-row{grid-template-columns:76px minmax(0,1fr)}}
      `}</style>
      <form className="ss-new-dialog ss-paper-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-label={tr('New File')} onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onClose() } }}>
        <div className="ss-nd-head"><h2>{tr('New')}</h2><button type="button" className="ss-nd-close" onClick={onClose} aria-label={tr('Close new file dialog')}>×</button></div>
        <div className="ss-nd-content">
          <div className="ss-nd-fields">
            <label className="ss-nd-row"><span className="ss-nd-label">{tr('Name:')}</span><input className="ss-nd-control" maxLength={80} value={name} autoFocus onChange={(event) => { setName(event.target.value); setError('') }} /></label>
            <label className="ss-nd-row"><span className="ss-nd-label">{tr('Document Type:')}</span><select className="ss-nd-control" value={groupId} onChange={(event) => selectGroup(event.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{tr(group.label)}</option>)}</select></label>
            <label className="ss-nd-row"><span className="ss-nd-label">{tr('Size:')}</span><select className="ss-nd-control" value={presetId} onChange={(event) => { const next = choices.find((item) => item.id === event.target.value); if (next?.id === 'custom') markCustom(); else if (next) applyPreset(next) }}>{choices.map((item) => <option key={item.id} value={item.id}>{item.id.startsWith('saved-') ? item.label : tr(presetLabel(item))}</option>)}</select></label>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-width">{tr('Width:')}</label><div className="ss-nd-three"><div className="ss-nd-line"><input id="ss-nd-width" className="ss-nd-control" inputMode="decimal" type="number" min="0" step="any" value={widthInput} onChange={(event) => { setWidthInput(event.target.value); markCustom() }} /><div className="ss-nd-orient" role="group" aria-label={tr('Orientation')}><button type="button" aria-label={tr('Portrait')} title={tr('Portrait')} aria-pressed={height > width} disabled={Boolean(status)} onClick={() => orient('portrait')}>▯</button><button type="button" aria-label={tr('Landscape')} title={tr('Landscape')} aria-pressed={width >= height} disabled={Boolean(status)} onClick={() => orient('landscape')}>▭</button></div></div><select className="ss-nd-control" aria-label={tr('Width unit')} value={widthUnit} onChange={(event) => changeUnit(event.target.value, 'width')}>{UNITS.map((item) => <option key={item.id} value={item.id}>{tr(item.label)}</option>)}</select></div></div>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-height">{tr('Height:')}</label><div className="ss-nd-three"><input id="ss-nd-height" className="ss-nd-control" inputMode="decimal" type="number" min="0" step="any" value={heightInput} onChange={(event) => { setHeightInput(event.target.value); markCustom() }} /><select className="ss-nd-control" aria-label={tr('Height unit')} value={heightUnit} onChange={(event) => changeUnit(event.target.value, 'height')}>{UNITS.map((item) => <option key={item.id} value={item.id}>{tr(item.label)}</option>)}</select></div></div>
            <div className="ss-nd-row"><label className="ss-nd-label" htmlFor="ss-nd-ppi">{tr('Resolution:')}</label><div className="ss-nd-three"><input id="ss-nd-ppi" className="ss-nd-control" type="number" min="72" max="600" step="1" value={resolutionInput} onChange={(event) => { setResolutionInput(event.target.value); markCustom() }} /><input className="ss-nd-control" value="Pixels/Inch" aria-label={tr('Resolution unit')} disabled readOnly /></div></div>
            <div className="ss-nd-row"><span className="ss-nd-label">{tr('Color Mode:')}</span><div className="ss-nd-two"><input className="ss-nd-control" value="RGB Color" readOnly disabled aria-label={tr('RGB Color only')} title={tr('Only RGB Color is currently supported')} /><input className="ss-nd-control" value="8 bit" readOnly disabled aria-label={tr('8 bit only')} title={tr('Only 8-bit color is currently supported')} /></div></div>
            <label className="ss-nd-row"><span className="ss-nd-label">{tr('Background Contents:')}</span><div className="ss-nd-background"><select className="ss-nd-control" value={backgroundType} onChange={(event) => { setBackgroundType(event.target.value); setNotice('') }}><option value="white">{tr('White')}</option><option value="gray">{tr('Light Gray')}</option><option value="black">{tr('Black')}</option><option value="custom">{tr('Custom Color')}</option></select><input type="color" value={customBackground} aria-label={tr('Custom background color')} title={tr('Pick a background color')} onChange={(event) => { setCustomBackground(event.target.value); setBackgroundType('custom') }} /><span className="ss-nd-swatch" style={{ backgroundColor: background }} title={background} /></div></label>
            <details className="ss-nd-advanced" open><summary>{tr('Advanced')}</summary><div className="ss-nd-advanced-body"><div className="ss-nd-row"><span className="ss-nd-label">{tr('Color Profile:')}</span><input className="ss-nd-control" value="sRGB (browser canvas)" disabled readOnly title={tr('The browser canvas uses sRGB')} /></div><div className="ss-nd-row"><span className="ss-nd-label">{tr('Pixel Aspect Ratio:')}</span><input className="ss-nd-control" value={tr('Square Pixels')} disabled readOnly title={tr('Square pixels only')} /></div></div></details>
            {error || status ? <p className="ss-nd-status" role="alert">{error || status}</p> : null}
            {notice ? <p className="ss-nd-success" role="status">{notice}</p> : null}
            <p className="ss-nd-hint">{tr('Canvas limit: 4096 px per side / 12 MP. Large paper sizes may require a lower resolution. Only RGB 8-bit and opaque backgrounds are currently supported.')}</p>
          </div>
          <aside className="ss-nd-actions" aria-label={tr('New document actions')}>
            <button type="submit" className="primary" disabled={Boolean(status)}>{tr('OK')}</button>
            <button type="button" onClick={onClose}>{tr('Cancel')}</button>
            <button type="button" disabled={saved.length >= MAX_SAVED || Boolean(status)} onClick={savePreset}>{presetNaming ? tr('Save Preset') : tr('Save Preset...')}</button>
            <button type="button" disabled={!saved.some((item) => item.id === presetId)} onClick={deletePreset}>{tr('Delete Preset...')}</button>
            {presetNaming ? <div className="ss-nd-preset-save"><label htmlFor="ss-nd-preset-name">{tr('Preset name:')}</label><input id="ss-nd-preset-name" type="text" maxLength={48} value={savedName} onChange={(event) => { setSavedName(event.target.value); setError('') }} /></div> : null}
            <div className="ss-nd-image-size">{tr('Image Size:')}<br />{imageSize} MB<br /><small>{Number.isFinite(width) && Number.isFinite(height) ? `${width.toLocaleString()} × ${height.toLocaleString()} px` : ''}</small></div>
          </aside>
        </div>
      </form>
    </div>
  )
}
