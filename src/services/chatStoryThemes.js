import { useMemo, useSyncExternalStore } from "react";
import { optimizeImageForUpload } from "../utils/imageUploadOptimizer";
import { prepareChatReaderImage } from "../utils/chatStoryReaderImage";

export const CHAT_THEME_PHOTO_LIMIT = 10;
export const CHAT_THEME_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const CHAT_THEME_EVENT = "shadow:chat-theme-changed";
const API_URL = String(
  import.meta.env?.VITE_API_URL ||
    (typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5000"
      : "https://shadow-backend-kucw.onrender.com"),
).replace(/\/+$/, "");
const THEME_KEY = "shadow_chat_theme_v1:";
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
]);

const definitions = [
  [
    "classicViolet",
    "soft",
    "#f2edff",
    "#ffffff",
    "#2c2340",
    "#786b90",
    "#8b5cf6",
    "#7045cb",
  ],
  [
    "oceanMist",
    "soft",
    "#e8f7fb",
    "#ffffff",
    "#173840",
    "#557985",
    "#237d94",
    "#19667d",
  ],
  [
    "peachGlow",
    "soft",
    "#fff0e2",
    "#ffffff",
    "#493025",
    "#916e59",
    "#bd513e",
    "#a44435",
  ],
  [
    "sageGarden",
    "soft",
    "#eaf1e6",
    "#ffffff",
    "#283a2b",
    "#697c61",
    "#486b51",
    "#36563e",
  ],
  [
    "roseQuartz",
    "soft",
    "#fbe9f0",
    "#ffffff",
    "#492b38",
    "#946579",
    "#a8476e",
    "#8f365a",
  ],
  [
    "lavenderCloud",
    "gradient",
    "#f0eafb",
    "#ffffff",
    "#352745",
    "#82718f",
    "#8054aa",
    "#64418c",
  ],
  [
    "mintBreeze",
    "soft",
    "#e4f5ee",
    "#ffffff",
    "#244138",
    "#5b8575",
    "#26745c",
    "#1c5a46",
  ],
  [
    "skyBlue",
    "soft",
    "#eaf3ff",
    "#ffffff",
    "#263a59",
    "#6d80a0",
    "#376cba",
    "#285496",
  ],
  [
    "honeyCream",
    "soft",
    "#fff5d8",
    "#ffffff",
    "#493c20",
    "#8c7b4b",
    "#92631c",
    "#795017",
  ],
  [
    "cocoaMilk",
    "soft",
    "#f1e7df",
    "#ffffff",
    "#443125",
    "#8e7663",
    "#80583f",
    "#64432f",
  ],
  [
    "cherryBlossom",
    "gradient",
    "#ffe8ed",
    "#ffffff",
    "#4b2d38",
    "#967080",
    "#a94265",
    "#8c3250",
  ],
  [
    "lilacDawn",
    "gradient",
    "#f1e6fa",
    "#ffffff",
    "#3d2e50",
    "#827093",
    "#7e50a7",
    "#633a8b",
  ],
  [
    "sunset",
    "gradient",
    "#ffe9da",
    "#ffffff",
    "#4d322e",
    "#97766c",
    "#b14d47",
    "#903941",
  ],
  [
    "seaGlass",
    "gradient",
    "#e0f3f0",
    "#ffffff",
    "#24403f",
    "#668581",
    "#246f75",
    "#20555d",
  ],
  [
    "arctic",
    "gradient",
    "#edf2ff",
    "#ffffff",
    "#28394c",
    "#6c7e95",
    "#426a94",
    "#315477",
  ],
  [
    "midnight",
    "dark",
    "#161e32",
    "#29334a",
    "#f1f4ff",
    "#bdc5df",
    "#7751b5",
    "#614197",
  ],
  [
    "forestNight",
    "dark",
    "#152a25",
    "#253e36",
    "#e9f4ee",
    "#b5cbbb",
    "#3f795e",
    "#32664c",
  ],
  [
    "plumNight",
    "dark",
    "#281c32",
    "#3c2b47",
    "#f7edf9",
    "#d2bcd9",
    "#98537f",
    "#793d67",
  ],
  [
    "deepOcean",
    "dark",
    "#122638",
    "#233c52",
    "#edf7ff",
    "#b1cadd",
    "#337c9d",
    "#256281",
  ],
  [
    "graphite",
    "dark",
    "#1d2027",
    "#303640",
    "#f1f3f7",
    "#c3c8d4",
    "#626a86",
    "#4d566f",
  ],
];

export const CHAT_STORY_THEMES = Object.freeze(
  definitions.map((row) => {
    const [
      id,
      group,
      background,
      incoming,
      text,
      muted,
      outgoing,
      outgoingEnd,
    ] = row;
    const accent = group === "dark" ? "#c4b5fd" : outgoing;
    return Object.freeze({
      id,
      source: "preset",
      group,
      paletteId: id,
      nameKey: `chatStoryThemes.presets.${id}`,
      background,
      incoming,
      text,
      muted,
      outgoing,
      outgoingEnd,
      accent,
      surface: group === "dark" ? incoming : "#ffffff",
      border: group === "dark" ? "#ffffff24" : "#00000012",
      pattern: `radial-gradient(ellipse at 110% -20%, ${outgoing}16 0%, ${outgoing}16 35%, transparent 35.5%), radial-gradient(ellipse at -10% 120%, ${outgoing}10 0%, ${outgoing}10 40%, transparent 40.5%)`,
    });
  }),
);

export const DEFAULT_CHAT_THEMES = Object.freeze(CHAT_STORY_THEMES.slice(0, 4));
export const DEFAULT_CHAT_THEME = CHAT_STORY_THEMES[0];

function themeError(code, status = 0) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

export function chatThemeToken() {
  try {
    return (
  sessionStorage.getItem("shadow_reader_token") ||
  localStorage.getItem("shadow_reader_token") ||
  ""
);
  } catch {
    return "";
  }
}

export function chatThemeAccount() {
  const token = chatThemeToken();
  if (!token) return "guest";
  try {
    const segment = token.split(".")[1];
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );
    const id = String(payload.user_id || payload.sub || payload.id || "");
    if (/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return id;
  } catch {}
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(index), 16777619);
  }
  return `session-${(hash >>> 0).toString(36)}`;
}

function safeImageUrl(value) {
  try {
    const url = new URL(String(value || ""));
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.href.length > 2048
    )
      return "";
    return url.href;
  } catch {
    return "";
  }
}

const extendedStyleNames = [
  [
    "glassRoom",
    "Glass Room",
    "បន្ទប់កញ្ចក់",
    "玻璃房",
    "ガラスの部屋",
    "유리방"
  ],
  [
    "comicTalk",
    "Comic Talk",
    "សន្ទនាបែបគំនូរ",
    "漫画对话",
    "コミックトーク",
    "만화 대화"
  ],
  [
    "postcard",
    "Postcard",
    "កាតប្រៃសណីយ៍",
    "明信片",
    "ポストカード",
    "엽서"
  ],
  [
    "terminal",
    "Terminal",
    "ស្ថានីយបញ្ជា",
    "终端",
    "ターミナル",
    "터미널"
  ],
  [
    "cloudLetters",
    "Cloud Letters",
    "សារពពក",
    "云端来信",
    "雲の手紙",
    "구름 편지"
  ],
  [
    "stitchedFabric",
    "Stitched Fabric",
    "ក្រណាត់ដេរ",
    "缝线织物",
    "ステッチクロス",
    "바느질 천"
  ],
  [
    "polaroidNotes",
    "Polaroid Notes",
    "កាតរូបថត",
    "拍立得便笺",
    "ポラロイドメモ",
    "폴라로이드 메모"
  ],
  [
    "metroLines",
    "Metro Lines",
    "ខ្សែរថភ្លើង",
    "地铁线路",
    "メトロライン",
    "지하철 노선"
  ],
  [
    "origami",
    "Origami",
    "ក្រដាសបត់",
    "折纸",
    "折り紙",
    "종이접기"
  ],
  [
    "pixelQuest",
    "Pixel Quest",
    "ដំណើរផ្សងព្រេងភីកសែល",
    "像素冒险",
    "ピクセルクエスト",
    "픽셀 모험"
  ],
  [
    "botanicalFrame",
    "Botanical Frame",
    "ស៊ុមរុក្ខជាតិ",
    "植物边框",
    "植物のフレーム",
    "식물 프레임"
  ],
  [
    "cinemaDialogue",
    "Cinema Dialogue",
    "សន្ទនាភាពយន្ត",
    "电影对白",
    "シネマの会話",
    "영화 속 대화"
  ],
  [
    "waxSeal",
    "Wax Seal",
    "ត្រាក្រមួន",
    "火漆印章",
    "封蝋",
    "밀랍 인장"
  ],
  [
    "pebbleGarden",
    "Pebble Garden",
    "សួនគ្រួស",
    "卵石庭院",
    "小石の庭",
    "조약돌 정원"
  ],
  [
    "ribbonChat",
    "Ribbon Chat",
    "សន្ទនាខ្សែបូ",
    "丝带对话",
    "リボントーク",
    "리본 대화"
  ],
  [
    "blueprint",
    "Blueprint",
    "ប្លង់គំនូរ",
    "蓝图",
    "設計図",
    "설계도"
  ],
  [
    "clayStudio",
    "Clay Studio",
    "ស្ទូឌីយោដីឥដ្ឋ",
    "陶土工作室",
    "クレイスタジオ",
    "클레이 스튜디오"
  ],
  [
    "ticketBooth",
    "Ticket Booth",
    "កាតសំបុត្រចូល",
    "票券亭",
    "チケットブース",
    "티켓 부스"
  ],
  [
    "artDeco",
    "Art Deco",
    "សិល្បៈដេកូ",
    "装饰艺术",
    "アールデコ",
    "아르데코"
  ],
  [
    "watercolorWash",
    "Watercolor Wash",
    "ពណ៌ទឹករាល",
    "水彩晕染",
    "水彩のにじみ",
    "수채화 번짐"
  ],
  [
    "vinylSession",
    "Vinyl Session",
    "ថាសចម្រៀង",
    "黑胶时光",
    "レコードタイム",
    "바이닐 세션"
  ],
  [
    "wovenBasket",
    "Woven Basket",
    "កន្ត្រកត្បាញ",
    "编织篮",
    "編みかご",
    "바구니 짜임"
  ],
  [
    "mosaicTiles",
    "Mosaic Tiles",
    "ក្បឿងម៉ូសាអ៊ិក",
    "马赛克砖",
    "モザイクタイル",
    "모자이크 타일"
  ],
  [
    "inkBrush",
    "Ink Brush",
    "ជក់ទឹកថ្នាំ",
    "水墨笔触",
    "墨の筆",
    "먹 붓"
  ],
  [
    "capsuleChat",
    "Capsule Chat",
    "សន្ទនារាងគ្រាប់ថ្នាំ",
    "胶囊对话",
    "カプセルトーク",
    "캡슐 대화"
  ],
  [
    "embossedLeather",
    "Embossed Leather",
    "ស្បែកចុចលំនាំ",
    "压纹皮革",
    "型押しレザー",
    "양각 가죽"
  ],
  [
    "laceWindow",
    "Lace Window",
    "បង្អួចក្រណាត់ចរ",
    "蕾丝窗",
    "レースの窓",
    "레이스 창"
  ],
  [
    "topographic",
    "Topographic",
    "ផែនទីកម្ពស់ដី",
    "地形等高线",
    "等高線",
    "지형도"
  ],
  [
    "circuitBoard",
    "Circuit Board",
    "បន្ទះសៀគ្វី",
    "电路板",
    "回路基板",
    "회로 기판"
  ],
  [
    "quiltPatch",
    "Quilt Patch",
    "ក្រណាត់ផ្គុំ",
    "拼布",
    "パッチワーク",
    "퀼트 조각"
  ],
  [
    "chalkboard",
    "Chalkboard",
    "ផ្ទាំងដីស",
    "黑板",
    "黒板",
    "칠판"
  ],
  [
    "layeredTabs",
    "Layered Tabs",
    "កាតត្រួតគ្នា",
    "层叠标签",
    "重なるタブ",
    "겹친 탭"
  ],
  [
    "bookChapters",
    "Book Chapters",
    "ទំព័រសៀវភៅ",
    "书页章节",
    "本の章",
    "책의 장"
  ],
  [
    "sculptedStone",
    "Sculpted Stone",
    "ថ្មឆ្លាក់",
    "雕刻石板",
    "彫刻の石",
    "조각한 돌"
  ],
  [
    "floatingIslands",
    "Floating Islands",
    "កោះអណ្ដែត",
    "浮岛",
    "浮かぶ島",
    "떠 있는 섬"
  ],
  [
    "windowPane",
    "Window Pane",
    "ផ្ទាំងបង្អួច",
    "窗格",
    "窓枠",
    "창틀"
  ],
  [
    "beadedThread",
    "Beaded Thread",
    "ខ្សែអង្កាំ",
    "串珠线",
    "ビーズの糸",
    "구슬 실"
  ],
  [
    "pressedMetal",
    "Pressed Metal",
    "លោហៈចុចលំនាំ",
    "压纹金属",
    "プレスメタル",
    "압형 금속"
  ],
  [
    "puzzlePieces",
    "Puzzle Pieces",
    "បំណែកផ្គុំ",
    "拼图块",
    "パズルピース",
    "퍼즐 조각"
  ],
  [
    "sandDunes",
    "Sand Dunes",
    "រលកខ្សាច់",
    "沙丘",
    "砂丘",
    "모래 언덕"
  ],
  [
    "embroideryHoop",
    "Embroidery Hoop",
    "ស៊ុមប៉ាក់",
    "刺绣绷",
    "刺繍枠",
    "자수 틀"
  ],
  [
    "galleryFrames",
    "Gallery Frames",
    "ស៊ុមវិចិត្រសាល",
    "画廊相框",
    "ギャラリーフレーム",
    "갤러리 액자"
  ]
];

export const CHAT_THEME_STYLE_TRANSLATIONS = Object.freeze(Object.fromEntries(["en", "km", "zh", "ja", "ko"].map((language, index) => [language, Object.freeze(Object.fromEntries(extendedStyleNames.map((row) => [row[0], row[index + 1]])))])));

export const CHAT_THEME_STYLES = Object.freeze([...['classic', 'soft', 'gradient', 'night', 'paper', 'outline', 'minimal', 'neon'].map((id) => ({ id, nameKey: `chatStoryThemes.styles.${id}` })), ...extendedStyleNames.map(([id, name]) => Object.freeze({ id, name, nameKey: `chatStoryThemes.styles.${id}` }))]);
export const CHAT_THEME_ACCENTS = Object.freeze(CHAT_STORY_THEMES.map((theme) => ({ id: theme.id, color: theme.outgoing, nameKey: theme.nameKey })));

const hexColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value).toLowerCase() : null;
function mixColor(first, second, amount) {
  const read = (hex, index) => parseInt(hex.slice(index, index + 2), 16);
  return '#' + [1, 3, 5].map((index) => Math.round(read(first, index) * (1 - amount) + read(second, index) * amount).toString(16).padStart(2, '0')).join('');
}
function luminance(hex) {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, index) => sum + v * [.2126, .7152, .0722][index], 0);
}
function readableAccent(hex) {
  let result = hex;
  for (let index = 0; index < 30 && 1.05 / (luminance(result) + .05) < 4.5; index += 1) result = mixColor(result, '#000000', .08);
  return result;
}
const extendedStyleIds = new Set(extendedStyleNames.map(([id]) => id));

function svgWallpaper(content, accent, width = 480, height = 600) {
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><g fill="none" stroke="${accent}" stroke-width="1.5" opacity=".13">${content}</g></svg>`)}")`;
}

function extendedTheme(styleId, accent, outgoing) {
  if (!extendedStyleIds.has(styleId)) return null;
  const pale = mixColor(accent, '#ffffff', .94);
  const tint = mixColor(accent, '#ffffff', .88);
  const line = `${outgoing}3d`;
  const result = { extendedStyle: true, radius: '16px', corner: '16px', background: pale, incoming: '#ffffff', text: '#202333', muted: '#62687a', surface: '#ffffff', border: '#00000016', bubbleBorder: `1px solid ${line}`, bubbleShadow: 'none', outgoingText: '#ffffff', outgoing, outgoingEnd: readableAccent(mixColor(accent, '#263144', .25)), accent: outgoing, pattern: 'none', backgroundSize: '100% 600px', backgroundRepeat: 'repeat', bubbleFill: 'none', bubbleBackdrop: 'none', bubblePadding: '12px 16px', avatarRadius: '50%', nameSpacing: 'normal', nameTransform: 'none' };
  const wall = (svg, width = 480, height = 600) => svgWallpaper(svg, accent, width, height);
  switch (styleId) {
    case 'glassRoom':
      Object.assign(result, { radius: '24px', corner: '12px', incoming: '#ffffffb8', bubbleBorder: '1px solid #ffffffcc', bubbleShadow: `0 8px 24px ${accent}18, inset 0 1px 0 #ffffffbb`, bubbleBackdrop: 'blur(12px)', pattern: `radial-gradient(ellipse at 5% 15%,${accent}38,transparent 50%),radial-gradient(ellipse at 95% 85%,${accent}2b,transparent 55%),linear-gradient(130deg,transparent 35%,#ffffffaa 35.5% 36%,transparent 36.5%)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' });
      break;
    case 'comicTalk':
      Object.assign(result, { radius: '24px 16px 22px 8px', corner: '6px', bubbleBorder: '2px solid #262431', bubbleShadow: '3px 4px 0 #262431', pattern: wall('<defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="currentColor" stroke="none"/></pattern></defs><path d="M-100 100L180 240M-100 240L180 240M-100 390L180 240M600 180L350 400M600 400L350 400M600 600L350 400" stroke-width="5"/><rect width="480" height="600" fill="url(#dots)" color="'+accent+'" opacity=".6"/>') });
      break;
    case 'postcard':
      Object.assign(result, { radius: '3px', corner: '3px', background: '#faf7f0', incoming: '#fffdf6', bubbleBorder: `3px double ${outgoing}80`, bubbleShadow: '0 3px 0 #322a1e12', bubblePadding: '15px 18px', pattern: wall('<path d="M18 0V600M462 0V600" stroke-width="7" stroke-dasharray="20 16"/><rect x="390" y="34" width="48" height="62" rx="3" stroke-dasharray="3 3"/><circle cx="410" cy="65" r="15"/><path d="M25 490Q65 477 105 490T185 490M25 500Q65 487 105 500T185 500M25 510Q65 497 105 510T185 510"/>') });
      break;
    case 'terminal':
      Object.assign(result, { radius: '2px', corner: '2px', group: 'dark', background: '#0d1715', incoming: '#132923', text: '#e6fff2', muted: '#add6bf', accent: mixColor(accent, '#ffffff', .65), surface: '#10211c', border: '#b6f5cf30', bubbleBorder: '1px solid #b6f5cf55', bubbleShadow: 'inset 3px 0 0 #b6f5cf66', pattern: 'repeating-linear-gradient(0deg,transparent 0 4px,#b6f5cf05 4px 5px)', backgroundSize: 'auto', bubblePadding: '11px 16px 11px 26px' });
      break;
    case 'cloudLetters':
      Object.assign(result, { radius: '34px 42px 30px 38px', corner: '28px', bubbleBorder: 'none', bubbleShadow: `-4px 3px 0 ${accent}12,4px -3px 0 #ffffff80`, bubblePadding: '14px 22px', pattern: wall('<path d="M-28 90Q-24 55 10 62Q25 20 58 44Q90 18 111 53Q150 48 155 90Z" fill="'+accent+'" stroke="none"/><path d="M370 420Q356 388 388 370Q403 328 439 350Q470 324 493 362Q526 357 532 420Z" fill="'+accent+'" stroke="none"/>') });
      break;
    case 'stitchedFabric':
      Object.assign(result, { radius: '13px', corner: '13px', incoming: mixColor(accent, '#fff9f2', .96), bubbleBorder: `1px dashed ${outgoing}99`, bubbleShadow: `0 0 0 3px ${accent}15`, bubbleFill: 'repeating-linear-gradient(0deg,#ffffff09 0 1px,#00000004 1px 2px)', pattern: `repeating-linear-gradient(0deg,transparent 0 3px,${accent}08 3px 4px),repeating-linear-gradient(90deg,transparent 0 3px,${accent}08 3px 4px)`, backgroundSize: '8px 8px' });
      break;
    case 'polaroidNotes':
      Object.assign(result, { radius: '2px', corner: '2px', bubbleBorder: '5px solid #ffffff', bubblePadding: '12px 14px 24px', bubbleShadow: '0 5px 12px #00000020', pattern: wall('<path d="M20 65L110 40L116 62L26 87ZM375 430L461 455L455 477L369 452Z" fill="'+accent+'" stroke-dasharray="5 3"/><rect x="12" y="200" width="90" height="120" transform="rotate(-12 12 200)"/><rect x="396" y="100" width="70" height="88" transform="rotate(10 396 100)"/>') });
      break;
    case 'metroLines':
      Object.assign(result, { radius: '10px', corner: '4px', bubbleBorder: `1px solid ${line}`, bubbleShadow: `-4px 0 0 ${accent}44`, pattern: wall('<path d="M28-10V155Q28 185 58 185H90Q120 185 120 215V340Q120 370 90 370H50Q28 370 28 400V610M452-10V85Q452 115 422 115H394Q364 115 364 145V430Q364 460 394 460H422Q452 460 452 490V610" stroke-width="4"/><g fill="'+pale+'" stroke-width="3"><circle cx="28" cy="75" r="6"/><circle cx="120" cy="270" r="6"/><circle cx="28" cy="480" r="6"/><circle cx="452" cy="42" r="6"/><circle cx="364" cy="300" r="6"/><circle cx="452" cy="540" r="6"/></g>') });
      break;
    case 'origami':
      Object.assign(result, { radius: '2px 18px 2px 2px', corner: '2px', bubbleBorder: 'none', bubbleShadow: `3px 4px 0 ${accent}20`, bubblePadding: '16px 22px 12px 14px', pattern: wall('<path d="M0 0L130 0L0 150ZM480 300L350 405L480 550Z" fill="'+accent+'"/><path d="M0 150L130 0L72 145ZM350 405L480 300L430 440Z" fill="'+accent+'" opacity=".7"/>') });
      break;
    case 'pixelQuest':
      Object.assign(result, { radius: '0px', corner: '0px', bubbleBorder: `2px solid ${outgoing}`, bubbleShadow: `4px 0 0 ${pale},-4px 0 0 ${pale},0 4px 0 ${outgoing},4px 4px 0 ${outgoing}`, avatarRadius: '4px', pattern: wall('<path d="M16 30H32V46H48V62H32V78H16V62H0V46H16ZM440 260H456V276H472V292H456V308H440V292H424V276H440ZM30 510H46V526H62V542H46V558H30V542H14V526H30Z" fill="'+accent+'" stroke="none"/>') });
      break;
    case 'botanicalFrame':
      Object.assign(result, { radius: '28px 8px 28px 8px', corner: '8px', bubbleBorder: `1px solid ${line}`, bubbleShadow: `0 4px 12px ${accent}12`, pattern: wall('<path d="M-10 600Q95 330 12 0M488 600Q400 330 478 0"/><path d="M15 500Q85 450 32 400Q-18 445 15 500ZM27 330Q92 280 36 230Q-17 280 27 330ZM16 155Q78 125 22 65Q-18 115 16 155ZM465 520Q400 470 455 420Q505 465 465 520ZM454 340Q390 290 450 235Q500 285 454 340ZM467 160Q405 120 465 70Q505 115 467 160Z" fill="'+accent+'" stroke="none"/>') });
      break;
    case 'cinemaDialogue':
      Object.assign(result, { radius: '4px', corner: '4px', background: mixColor(accent, '#f0eee9', .92), bubbleBorder: 'none', bubbleShadow: `0 3px 0 ${outgoing}25`, bubblePadding: '13px 18px', pattern: wall('<path d="M10 0V600M470 0V600" stroke-width="20"/><path d="M10 0V600M470 0V600" stroke="'+pale+'" stroke-width="8" stroke-dasharray="12 14"/><path d="M0 30L240 240L480 30" fill="'+accent+'" stroke="none" opacity=".4"/>') });
      break;
    case 'waxSeal':
      Object.assign(result, { radius: '6px', corner: '6px', background: '#f8f3eb', incoming: '#fffaf1', bubbleBorder: `1px solid ${outgoing}50`, bubbleShadow: '0 4px 8px #43322512', bubblePadding: '15px 18px 20px', pattern: wall('<path d="M0 20L240 180L480 20M0 580L240 420L480 580"/><circle cx="45" cy="300" r="25"/><circle cx="45" cy="300" r="18" stroke-dasharray="2 3"/><path d="M30 320L20 355L44 346L57 356L60 320"/>') });
      break;
    case 'pebbleGarden':
      Object.assign(result, { radius: '30% 46% 32% 42% / 24px 30px 24px 28px', corner: '28px', incoming: '#fafaf5', bubbleBorder: `1px solid ${accent}20`, bubbleShadow: 'inset 0 2px 4px #ffffffcc,0 2px 5px #00000012', bubblePadding: '14px 22px', pattern: wall('<g stroke-width="2"><ellipse cx="0" cy="150" rx="55" ry="80"/><ellipse cx="0" cy="150" rx="75" ry="105"/><ellipse cx="0" cy="150" rx="95" ry="130"/><ellipse cx="480" cy="440" rx="60" ry="85"/><ellipse cx="480" cy="440" rx="80" ry="110"/><ellipse cx="480" cy="440" rx="100" ry="135"/></g>') });
      break;
    case 'ribbonChat':
      Object.assign(result, { radius: '2px', corner: '2px', bubbleBorder: 'none', bubblePadding: '12px 26px 12px 16px', bubbleShadow: `0 4px 0 ${accent}22`, pattern: wall('<path d="M-25 0Q115 110 20 240T35 600M495 0Q375 130 462 270T455 600" stroke-width="22"/><path d="M-25 0Q115 110 20 240T35 600M495 0Q375 130 462 270T455 600" stroke="'+pale+'" stroke-width="14"/>') });
      break;
    case 'blueprint':
      Object.assign(result, { radius: '0px', corner: '0px', group: 'dark', background: '#132b42', incoming: '#1b3852', surface: '#142d44', text: '#f0f7ff', muted: '#becfdf', accent: '#b8dbf6', border: '#d0eaff30', bubbleBorder: '1px solid #d0eaff99', bubbleShadow: '0 0 0 3px #b8dbf611', bubblePadding: '14px 18px', pattern: 'linear-gradient(#b8dbf610 1px,transparent 1px),linear-gradient(90deg,#b8dbf610 1px,transparent 1px),linear-gradient(#b8dbf608 1px,transparent 1px),linear-gradient(90deg,#b8dbf608 1px,transparent 1px)', backgroundSize: '80px 80px,80px 80px,16px 16px,16px 16px' });
      break;
    case 'clayStudio':
      Object.assign(result, { radius: '22px', corner: '22px', incoming: tint, bubbleBorder: 'none', bubbleShadow: 'inset 3px 3px 6px #ffffff99,inset -3px -3px 6px #00000016,3px 5px 12px #00000016', bubblePadding: '15px 20px', pattern: wall('<path d="M-40 80C20 20 98 105 62 170S-65 250-40 80ZM505 370C430 330 402 412 435 475S550 505 505 370Z" fill="'+accent+'" stroke-width="8"/>') });
      break;
    case 'ticketBooth':
      Object.assign(result, { radius: '3px', corner: '3px', bubbleBorder: `1px dashed ${outgoing}88`, bubblePadding: '14px 22px', bubbleShadow: `0 3px 0 ${accent}15`, pattern: wall('<rect x="12" y="45" width="64" height="130" rx="5" transform="rotate(-12 44 110)" stroke-dasharray="4 3"/><path d="M22 132L66 122" stroke-dasharray="2 3"/><circle cx="43" cy="90" r="13"/><rect x="408" y="370" width="64" height="130" rx="5" transform="rotate(12 440 435)" stroke-dasharray="4 3"/><path d="M420 458L462 468" stroke-dasharray="2 3"/>') });
      break;
    case 'artDeco':
      Object.assign(result, { radius: '2px 12px 2px 12px', corner: '2px', bubbleBorder: `3px double ${outgoing}99`, bubbleShadow: `0 0 0 2px ${accent}10`, bubblePadding: '15px 20px', nameSpacing: '.08em', pattern: wall('<path d="M0 150Q0 0 120 0M0 120Q0 0 90 0M0 90Q0 0 60 0M0 60Q0 0 30 0M480 450Q480 600 360 600M480 480Q480 600 390 600M480 510Q480 600 420 600M480 540Q480 600 450 600" stroke-width="3"/><path d="M0 300L35 270L70 300L35 330ZM480 200L445 170L410 200L445 230Z"/>') });
      break;
    case 'watercolorWash':
      Object.assign(result, { radius: '18px 13px 22px 16px', corner: '14px', bubbleBorder: `2px solid ${accent}30`, bubbleShadow: `0 0 0 3px ${accent}12,0 0 0 6px ${accent}07`, pattern: `radial-gradient(ellipse at 0% 25%,${accent}28 0 8%,${accent}12 13%,transparent 25%),radial-gradient(ellipse at 100% 75%,${accent}25 0 10%,${accent}10 16%,transparent 30%),radial-gradient(ellipse at 90% 0%,${accent}15,transparent 30%)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' });
      break;
    case 'vinylSession':
      Object.assign(result, { radius: '5px 20px 20px 5px', corner: '5px', bubbleBorder: `1px solid ${line}`, bubblePadding: '13px 18px 13px 23px', bubbleFill: 'repeating-radial-gradient(circle at -30px 50%,transparent 0 6px,#ffffff0d 6px 7px)', pattern: wall('<g stroke-width="3"><circle cx="-35" cy="140" r="100"/><circle cx="-35" cy="140" r="85"/><circle cx="-35" cy="140" r="70"/><circle cx="-35" cy="140" r="40"/><circle cx="515" cy="450" r="120"/><circle cx="515" cy="450" r="105"/><circle cx="515" cy="450" r="90"/><circle cx="515" cy="450" r="45"/></g>') });
      break;
    case 'wovenBasket':
      Object.assign(result, { radius: '10px', corner: '10px', incoming: '#fffdf7', bubbleBorder: `1px solid ${line}`, bubblePadding: '22px 16px 12px', bubbleShadow: '0 3px 6px #40352410', pattern: `repeating-linear-gradient(45deg,${accent}0d 0 7px,transparent 7px 21px),repeating-linear-gradient(-45deg,${accent}0d 0 7px,transparent 7px 21px)`, backgroundSize: '60px 60px' });
      break;
    case 'mosaicTiles':
      Object.assign(result, { radius: '2px 14px 2px 14px', corner: '2px', bubbleBorder: `1px solid ${outgoing}55`, bubbleShadow: `3px 3px 0 ${accent}25,-2px -2px 0 #ffffff`, avatarRadius: '6px', pattern: wall('<path d="M0 0H45V45H0ZM48 0H90V22H48ZM48 25H90V70H48ZM0 48H45V95H0ZM390 390H435V435H390ZM438 390H480V412H438ZM438 415H480V460H438ZM390 438H435V485H390Z" fill="'+accent+'" stroke="'+pale+'" stroke-width="3"/>') });
      break;
    case 'inkBrush':
      Object.assign(result, { radius: '1px', corner: '1px', background: '#f7f6f2', incoming: '#fffefa', bubbleBorder: 'none', bubbleShadow: `0 3px 0 ${outgoing}66,0 5px 0 ${outgoing}20`, bubblePadding: '12px 18px 16px', pattern: wall('<path d="M-30 50Q100 120 20 210Q-45 300 40 350M510 240Q390 330 465 420Q520 485 430 560" stroke-width="28"/><path d="M0 70Q75 125 10 210M480 270Q420 330 470 390" stroke-width="5"/><circle cx="55" cy="370" r="4" fill="'+accent+'"/><circle cx="420" cy="580" r="6" fill="'+accent+'"/>') });
      break;
    case 'capsuleChat':
      Object.assign(result, { radius: '999px', corner: '999px', bubblePadding: '13px 24px', bubbleBorder: 'none', bubbleShadow: `0 3px 8px ${accent}18`, pattern: wall('<rect x="-24" y="35" width="60" height="160" rx="30" transform="rotate(25 6 115)"/><path d="M-15 115H34"/><rect x="444" y="360" width="60" height="180" rx="30" transform="rotate(-25 474 450)"/><path d="M445 450H495"/>') });
      break;
    case 'embossedLeather':
      Object.assign(result, { radius: '11px', corner: '11px', background: mixColor(accent, '#ece4da', .9), incoming: '#f8f1e8', bubbleBorder: `2px groove ${outgoing}40`, bubbleShadow: 'inset 1px 2px 3px #00000010,0 2px 0 #ffffff88', bubbleFill: 'repeating-radial-gradient(ellipse at 20% 30%,#00000004 0 1px,transparent 1px 4px)', pattern: wall('<defs><pattern id="grain" width="12" height="8" patternUnits="userSpaceOnUse"><path d="M1 2L5 1L9 3M2 7L6 5L11 7"/></pattern></defs><rect width="480" height="600" fill="url(#grain)"/><path d="M25 0V600M455 0V600" stroke-width="3"/>') });
      break;
    case 'laceWindow':
      Object.assign(result, { radius: '16px', corner: '16px', bubbleBorder: `3px dotted ${outgoing}66`, bubblePadding: '13px 18px', bubbleShadow: `0 0 0 3px #ffffff80`, pattern: wall('<defs><pattern id="lace" width="30" height="40" patternUnits="userSpaceOnUse"><circle cx="15" cy="20" r="12"/><circle cx="15" cy="20" r="6"/><path d="M0 0L30 40M30 0L0 40"/></pattern></defs><rect width="55" height="600" fill="url(#lace)"/><rect x="425" width="55" height="600" fill="url(#lace)"/>') });
      break;
    case 'topographic':
      Object.assign(result, { radius: '22px 14px 24px 12px', corner: '12px', bubbleBorder: `1px solid ${outgoing}60`, bubbleShadow: `0 0 0 3px ${accent}15,0 0 0 6px ${accent}0a`, bubblePadding: '14px 18px', pattern: wall('<path d="M-40 50C130-10 130 190-20 220M-40 75C100 20 100 170-20 195M-40 100C70 50 70 150-20 170M-40 125C40 90 40 130-20 145M500 340C340 290 340 540 510 520M500 365C375 330 375 505 510 495M500 390C410 370 410 470 510 470M500 415C445 405 445 440 510 445"/>') });
      break;
    case 'circuitBoard':
      Object.assign(result, { radius: '0px 14px 0px 14px', corner: '0px', bubbleBorder: `1px solid ${outgoing}88`, bubbleShadow: `inset 4px 0 0 ${accent}22`, avatarRadius: '8px', pattern: wall('<path d="M0 45H30L55 70V180H18V300M480 90H450L425 115V260H465V340M0 430H40L65 455V550H20V600M480 450H435V525L460 550V600" stroke-width="2"/><g fill="'+pale+'"><circle cx="18" cy="300" r="5"/><circle cx="465" cy="340" r="5"/><circle cx="55" cy="140" r="4"/><circle cx="435" cy="490" r="4"/></g>') });
      break;
    case 'quiltPatch':
      Object.assign(result, { radius: '6px', corner: '6px', incoming: tint, bubbleBorder: `2px dashed ${outgoing}60`, bubblePadding: '20px 16px 16px', bubbleFill: 'linear-gradient(0deg,#ffffff18 0 10px,transparent 10px),linear-gradient(90deg,#ffffff18 0 8px,transparent 8px)', bubbleShadow: '2px 2px 0 #0000000c', pattern: wall('<path d="M0 0H110V110H0ZM0 115H55V225H0ZM60 115H110V170H60ZM370 360H480V470H370ZM425 475H480V585H425ZM370 475H420V530H370Z" fill="'+accent+'" stroke-dasharray="4 4"/><path d="M0 0L110 110M0 110L110 0M370 360L480 470M370 470L480 360"/>') });
      break;
    case 'chalkboard':
      Object.assign(result, { radius: '8px 4px 7px 3px', corner: '3px', group: 'dark', background: '#20332e', incoming: '#294139', text: '#f1f5e9', muted: '#c2d2c4', surface: '#22382f', accent: '#d7e6c9', border: '#d7e6c933', bubbleBorder: '2px dashed #e6efdd99', bubbleShadow: '0 0 0 1px #e6efdd22', pattern: svgWallpaper('<path d="M20 25L45 60L10 55ZM435 420L450 445L475 430M22 230Q70 195 45 270M440 100Q415 145 465 150" stroke-width="3" stroke-dasharray="4 2"/><circle cx="35" cy="480" r="22" stroke-dasharray="5 2"/><path d="M425 560H475M450 535V585"/>', '#e6efdd') });
      break;
    case 'layeredTabs':
      Object.assign(result, { radius: '2px 14px 14px 14px', corner: '14px', bubbleBorder: `1px solid ${line}`, bubbleShadow: `3px 3px 0 ${tint},6px 6px 0 ${accent}22`, bubblePadding: '16px 18px', pattern: wall('<path d="M0 70H65V95H90V200H0ZM5 85H78V215H5M480 380H415V405H390V510H480ZM475 395H402V525H475" stroke-width="2"/>') });
      break;
    case 'bookChapters':
      Object.assign(result, { radius: '2px 10px 10px 2px', corner: '2px', background: '#f8f5ed', incoming: '#fffdf6', bubbleBorder: '1px solid #5f51402a', bubbleShadow: '3px 1px 0 #e8e0d3,5px 2px 0 #fffaf0', bubblePadding: '14px 18px 20px', bubbleFill: 'linear-gradient(90deg,transparent 48%,#00000007 50%,transparent 52%)', pattern: wall('<path d="M0 0Q55 300 0 600M10 0Q65 300 10 600M480 0Q425 300 480 600M470 0Q415 300 470 600" stroke-width="2"/>') });
      break;
    case 'sculptedStone':
      Object.assign(result, { radius: '3px 11px 4px 9px', corner: '3px', background: '#eeeeeb', incoming: '#f6f6f2', bubbleBorder: '2px ridge #66685e44', bubbleShadow: 'inset 2px 2px 0 #ffffff99,2px 4px 0 #00000015', bubbleFill: 'linear-gradient(130deg,transparent 25%,#00000004 26%,transparent 28%,transparent 70%,#ffffff22 71%,transparent 75%)', pattern: wall('<path d="M-20 120L45 155L30 240L80 300L10 390M500 50L435 130L450 240L405 350L455 450L420 600" stroke-width="3"/><path d="M45 155L100 165M450 240L390 210M10 390L60 440"/>') });
      break;
    case 'floatingIslands':
      Object.assign(result, { radius: '24px', corner: '24px', bubbleBorder: 'none', bubbleShadow: `0 8px 0 ${accent}14,0 14px 16px ${accent}12`, bubblePadding: '14px 20px', pattern: wall('<path d="M-30 150Q30 115 95 150L72 175L40 220L10 180Z" fill="'+accent+'"/><ellipse cx="35" cy="150" rx="65" ry="18" fill="'+pale+'"/><path d="M410 440Q460 405 515 440L495 465L455 510L430 465Z" fill="'+accent+'"/><ellipse cx="462" cy="440" rx="56" ry="18" fill="'+pale+'"/>') });
      break;
    case 'windowPane':
      Object.assign(result, { radius: '8px 8px 3px 3px', corner: '3px', bubbleBorder: `1px solid ${outgoing}66`, bubblePadding: '24px 16px 12px', bubbleShadow: `0 3px 8px ${accent}12`, pattern: wall('<path d="M-30 40H95V230H-30ZM30 40V230M-30 135H95M390 360H510V550H390ZM450 360V550M390 455H510" stroke-width="7"/><path d="M10 240L95 230L165 320L50 340ZM390 550L480 550L465 600L330 600Z" fill="'+accent+'" stroke="none" opacity=".45"/>') });
      break;
    case 'beadedThread':
      Object.assign(result, { radius: '18px', corner: '18px', bubbleBorder: `2px dotted ${outgoing}80`, bubbleShadow: `0 0 0 3px ${accent}12`, bubblePadding: '14px 20px', pattern: wall('<path d="M10 0Q90 150 10 300T10 600M470 0Q390 150 470 300T470 600" stroke-width="7" stroke-dasharray="1 18" stroke-linecap="round"/><path d="M10 0Q90 150 10 300T10 600M470 0Q390 150 470 300T470 600" stroke-width="1"/>') });
      break;
    case 'pressedMetal':
      Object.assign(result, { radius: '6px', corner: '6px', background: '#e9ecef', incoming: '#f4f5f6', bubbleBorder: '2px outset #a6aeb955', bubbleShadow: 'inset 0 1px 0 #ffffffcc,0 3px 0 #68717c30', bubblePadding: '15px 22px', bubbleFill: 'repeating-linear-gradient(0deg,#ffffff0c 0 1px,#00000004 1px 2px)', pattern: 'repeating-linear-gradient(0deg,#ffffff28 0 1px,#00000004 1px 3px),linear-gradient(110deg,#ffffff55,transparent 40%,#00000008 70%,#ffffff55)', backgroundSize: 'auto' });
      break;
    case 'puzzlePieces':
      Object.assign(result, { radius: '12px 3px 12px 3px', corner: '3px', bubbleBorder: `1px solid ${outgoing}55`, bubbleShadow: `2px 3px 0 ${accent}18`, bubblePadding: '16px 22px', pattern: wall('<path d="M0 100H30C15 75 65 75 50 100H90V140C115 125 115 175 90 160V200H0ZM390 380H430C415 355 465 355 450 380H480V480H440C455 505 405 505 420 480H390V440C365 455 365 405 390 420Z" stroke-width="2"/>') });
      break;
    case 'sandDunes':
      Object.assign(result, { radius: '42% 58% 12px 12px / 24px 18px 12px 12px', corner: '12px', background: '#fbf5e9', incoming: '#fffbf2', bubbleBorder: 'none', bubbleShadow: `0 4px 0 ${accent}15`, bubblePadding: '18px 20px 12px', pattern: wall('<path d="M-40 130Q80 65 230 130T520 130M-40 150Q80 85 230 150T520 150M-40 180Q80 115 230 180T520 180M-40 420Q100 350 260 420T520 420M-40 445Q100 375 260 445T520 445M-40 480Q100 410 260 480T520 480"/>') });
      break;
    case 'embroideryHoop':
      Object.assign(result, { radius: '50% / 26px', corner: '26px', bubbleBorder: `3px double ${outgoing}70`, bubbleShadow: `0 0 0 2px ${accent}16`, bubblePadding: '18px 25px', pattern: wall('<g stroke-dasharray="3 3"><circle cx="5" cy="170" r="65"/><circle cx="5" cy="170" r="70"/><circle cx="475" cy="450" r="75"/><circle cx="475" cy="450" r="80"/></g><path d="M5 110V230M-35 170H45M-25 140L35 200M-25 200L35 140M475 395V505M430 450H520M445 420L505 480M445 480L505 420"/><circle cx="5" cy="170" r="12"/><circle cx="475" cy="450" r="14"/>') });
      break;
    case 'galleryFrames':
      Object.assign(result, { radius: '1px', corner: '1px', incoming: '#fffefa', bubbleBorder: `6px ridge ${outgoing}50`, bubbleShadow: '0 4px 12px #00000016', bubblePadding: '17px 22px 23px', pattern: wall('<rect x="-35" y="50" width="100" height="135" stroke-width="5"/><rect x="-25" y="60" width="80" height="115"/><path d="M0 200H40" stroke-width="4"/><rect x="415" y="370" width="100" height="135" stroke-width="5"/><rect x="425" y="380" width="80" height="115"/><path d="M440 520H480" stroke-width="4"/>') });
      break;
  }
  return result;
}

const extendedBubbleCss = {
  glassRoom: 'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
  comicTalk: 'font-weight:500;',
  postcard: 'outline:1px dashed var(--cs-style-line);outline-offset:-7px;',
  terminal: 'font-family:ui-monospace,"Noto Sans Khmer",monospace;',
  cloudLetters: 'outline:3px solid #ffffff28;outline-offset:-2px;',
  stitchedFabric: 'outline:1px dashed var(--cs-style-line);outline-offset:-5px;',
  polaroidNotes: 'outline:1px solid #0000000d;outline-offset:0;',
  metroLines: 'border-left-width:4px!important;',
  origami: 'border-top-right-radius:0!important;',
  pixelQuest: 'outline:2px solid var(--cs-accent);outline-offset:2px;',
  botanicalFrame: 'border-top-left-radius:28px!important;border-top-right-radius:8px!important;border-bottom-right-radius:28px!important;border-bottom-left-radius:8px!important;',
  cinemaDialogue: 'border-top:2px solid var(--cs-accent)!important;',
  waxSeal: 'border-bottom-width:3px!important;',
  pebbleGarden: 'border-radius:30% 46% 32% 42% / 24px 30px 24px 28px!important;',
  ribbonChat: 'border-right:9px solid var(--cs-style-line)!important;',
  blueprint: 'outline:1px solid #d0eaff33;outline-offset:4px;',
  clayStudio: 'border-radius:22px!important;',
  ticketBooth: 'border-left-width:3px!important;border-right-width:3px!important;',
  artDeco: 'outline:1px solid var(--cs-style-line);outline-offset:3px;',
  watercolorWash: 'filter:drop-shadow(0 1px 1px var(--cs-style-line));',
  vinylSession: 'border-left:5px double var(--cs-style-line)!important;',
  wovenBasket: 'border-top:7px solid var(--cs-style-line)!important;',
  mosaicTiles: 'border-left:5px solid var(--cs-accent)!important;',
  inkBrush: 'border-bottom:3px solid var(--cs-accent)!important;',
  capsuleChat: 'border-radius:999px!important;',
  embossedLeather: 'outline:1px solid var(--cs-style-line);outline-offset:-6px;',
  laceWindow: 'outline:1px dotted var(--cs-style-line);outline-offset:3px;',
  topographic: 'outline:1px solid var(--cs-style-line);outline-offset:5px;',
  circuitBoard: 'outline:1px solid var(--cs-style-line);outline-offset:3px;',
  quiltPatch: 'border-top:5px dashed var(--cs-style-line)!important;',
  chalkboard: 'outline:1px dotted #e6efdd44;outline-offset:-5px;',
  layeredTabs: 'margin-bottom:7px;',
  bookChapters: 'border-left:4px double #7b6c5444!important;',
  sculptedStone: 'outline:1px solid #66685e22;outline-offset:-5px;',
  floatingIslands: 'border-radius:24px!important;margin-bottom:8px;',
  windowPane: 'border-top:6px solid var(--cs-style-line)!important;',
  beadedThread: 'outline:1px solid var(--cs-style-line);outline-offset:3px;',
  pressedMetal: 'outline:1px solid #ffffff66;outline-offset:-5px;',
  puzzlePieces: 'border-left:5px solid var(--cs-style-line)!important;',
  sandDunes: 'border-radius:42% 58% 12px 12px / 24px 18px 12px 12px!important;',
  embroideryHoop: 'border-radius:50% / 26px!important;',
  galleryFrames: 'outline:2px solid var(--cs-style-line);outline-offset:2px;',
};

const extendedDecorations = {
  comicTalk: ['after', 'left:16px;bottom:-9px;width:13px;height:13px;background:var(--cs-style-fill);border-right:2px solid #262431;border-bottom:2px solid #262431;transform:rotate(45deg);'],
  terminal: ['before', 'content:"›";left:10px;top:10px;color:currentColor;font-weight:700;'],
  cloudLetters: ['before', 'left:14px;top:-4px;width:32px;height:10px;background:var(--cs-style-fill);border-radius:50%;'],
  polaroidNotes: ['before', 'left:calc(50% - 17px);top:-9px;width:34px;height:12px;background:var(--cs-style-line);transform:rotate(-5deg);'],
  metroLines: ['before', 'left:-9px;top:15px;width:10px;height:10px;border:2px solid var(--cs-accent);border-radius:50%;background:var(--cs-bg);'],
  origami: ['after', 'right:0;top:0;width:0;height:0;border-left:16px solid #ffffff88;border-top:16px solid var(--cs-bg);filter:drop-shadow(-1px 1px 0 #00000015);'],
  cinemaDialogue: ['before', 'left:12px;top:5px;width:22px;height:2px;background:currentColor;opacity:.3;'],
  waxSeal: ['after', 'right:10px;bottom:-7px;width:16px;height:16px;border:3px double var(--cs-bg);border-radius:40% 45% 40% 45%;background:var(--cs-accent);box-shadow:0 2px 3px #00000022;'],
  ribbonChat: ['after', 'right:-9px;top:calc(50% - 6px);width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:7px solid var(--cs-bg);'],
  blueprint: ['before', 'left:-5px;top:-5px;width:8px;height:8px;border-top:2px solid #d0eaff;border-left:2px solid #d0eaff;'],
  ticketBooth: ['before', 'left:-6px;top:calc(50% - 5px);width:10px;height:10px;border-radius:50%;background:var(--cs-bg);box-shadow:0 0 0 1px var(--cs-style-line);'],
  wovenBasket: ['before', 'left:0;right:0;top:-7px;height:7px;background:repeating-linear-gradient(45deg,transparent 0 3px,#ffffff66 3px 5px);'],
  mosaicTiles: ['before', 'left:5px;top:5px;width:4px;height:4px;background:var(--cs-style-line);box-shadow:7px 0 0 var(--cs-style-line),0 7px 0 var(--cs-style-line);'],
  inkBrush: ['after', 'left:8px;right:18px;bottom:-6px;height:2px;background:var(--cs-accent);opacity:.25;transform:rotate(-1deg);'],
  circuitBoard: ['after', 'right:-4px;top:10px;width:7px;height:7px;border:2px solid var(--cs-accent);border-radius:50%;background:var(--cs-bg);'],
  layeredTabs: ['before', 'left:12px;top:-7px;width:30px;height:7px;border-radius:4px 4px 0 0;background:var(--cs-accent);'],
  bookChapters: ['after', 'left:calc(50% - 6px);bottom:6px;width:12px;height:2px;background:currentColor;opacity:.2;'],
  windowPane: ['before', 'left:10px;top:4px;width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.3;box-shadow:8px 0 0 currentColor,16px 0 0 currentColor;'],
  beadedThread: ['after', 'right:10px;bottom:-5px;width:9px;height:9px;border-radius:50%;background:var(--cs-accent);border:2px solid var(--cs-bg);'],
  pressedMetal: ['before', 'left:7px;top:7px;width:4px;height:4px;border-radius:50%;background:#626b7888;box-shadow:inset 1px 1px 1px #ffffff77;'],
  puzzlePieces: ['after', 'right:-6px;top:calc(50% - 6px);width:12px;height:12px;background:var(--cs-style-fill);border:1px solid var(--cs-style-line);border-radius:50%;'],
  embroideryHoop: ['before', 'left:calc(50% - 8px);top:-5px;width:16px;height:5px;background:var(--cs-accent);border-radius:2px;'],
  galleryFrames: ['after', 'left:calc(50% - 10px);bottom:7px;width:20px;height:4px;background:currentColor;opacity:.15;'],
};

export const CHAT_THEME_STYLE_CSS = extendedStyleNames.map(([id]) => {
  const scope = `[data-chat-style="${id}"]`;
  const bubble = `${scope} .cs-style-bubble`;
  let css = `${bubble}{position:relative;isolation:isolate;max-width:100%;box-sizing:border-box;border-radius:var(--cs-radius)!important;padding:var(--cs-style-padding)!important;background-image:var(--cs-style-bubble-fill),linear-gradient(var(--cs-soft),var(--cs-soft))!important;backdrop-filter:var(--cs-style-backdrop);${extendedBubbleCss[id] || ''}}`;
  css += `${bubble}[data-side="right"]{--cs-style-fill:var(--cs-outgoing);background-image:var(--cs-style-bubble-fill),linear-gradient(125deg,var(--cs-outgoing),var(--cs-outgoing-end))!important;}`;
  css += `${scope} .cs-style-name{letter-spacing:var(--cs-style-name-spacing);}${scope} .cs-style-avatar{border-radius:var(--cs-style-avatar-radius)!important;}`;
  const decoration = extendedDecorations[id];
  if (decoration) css += `${bubble}::${decoration[0]}{content:"";position:absolute;pointer-events:none;${decoration[1]}}`;
  if (id === 'terminal') css += `${scope} .cs-style-name{font-family:ui-monospace,"Noto Sans Khmer",monospace;}`;
  if (id === 'cinemaDialogue') css += `${scope} .cs-style-name{border-bottom:1px solid var(--cs-style-line);padding-bottom:3px;}`;
  if (id === 'waxSeal') css += `${scope} .cs-style-avatar{border:3px double var(--cs-accent);padding:1px;}`;
  if (id === 'capsuleChat') css += `${scope} .cs-style-name{display:inline-block;border:1px solid var(--cs-style-line);border-radius:20px;padding:1px 8px;}`;
  if (id === 'quiltPatch') css += `${scope} .cs-style-name{background:var(--cs-style-line);display:inline-block;padding:2px 8px;border-radius:4px;}`;
  if (id === 'chalkboard') css += `${scope} .cs-style-name{text-decoration:underline;text-decoration-style:dashed;text-underline-offset:4px;}`;
  if (id === 'floatingIslands') css += `${scope} .cs-style-row[data-grouped="true"] .cs-style-bubble{border-top-left-radius:8px!important;border-top-right-radius:8px!important;box-shadow:none!important;}`;
  if (id === 'puzzlePieces') css += `${scope} .cs-style-row[data-grouped="true"] .cs-style-bubble{border-top:2px dashed var(--cs-style-line)!important;}`;
  return css;
}).join('\n');

export function normalizeChatTheme(value) {
  const valid = value && ['preset', 'shadow', 'photo'].includes(value.source);
  const input = valid ? value : {};
  const preset = CHAT_STORY_THEMES.find((theme) => theme.id === (input.source === 'preset' ? input.id : input.paletteId)) || DEFAULT_CHAT_THEME;
  const extras = {};
  if (CHAT_THEME_STYLES.some((style) => style.id === input.styleId)) extras.styleId = input.styleId;
  const accent = hexColor(input.accentColor);
  if (accent) extras.accentColor = accent;
  if (Array.isArray(input.gradientColors) && [2, 3].includes(input.gradientColors.length) && input.gradientColors.every(hexColor)) {
    extras.gradientColors = input.gradientColors.map(hexColor);
    extras.gradientAngle = Number.isFinite(Number(input.gradientAngle)) ? Math.max(0, Math.min(360, Math.round(Number(input.gradientAngle)))) : 135;
  }
  if (valid && input.source !== 'preset') {
    const imageUrl = safeImageUrl(input.image_url);
    const id = String(input.id || '');
    if (/^[a-zA-Z0-9_-]{1,128}$/.test(id) && imageUrl) return { source: input.source, id, image_url: imageUrl, title: String(input.title || '').slice(0, 100), paletteId: preset.id, ...extras };
  }
  return { source: 'preset', id: preset.id, paletteId: preset.id, ...extras };
}

export function resolveChatTheme(selection) {
  const selected = normalizeChatTheme(selection);
  const palette = CHAT_STORY_THEMES.find((theme) => theme.id === selected.paletteId) || DEFAULT_CHAT_THEME;
  const styleId = selected.styleId || (palette.group === 'dark' ? 'night' : 'classic');
  const accent = selected.accentColor || palette.outgoing;
  const outgoing = readableAccent(accent);
  const dark = ['night', 'neon', 'terminal', 'blueprint', 'chalkboard'].includes(styleId);
  const bg = dark ? mixColor(accent, '#080c18', .93) : mixColor(accent, '#ffffff', .92);
  const theme = { ...palette, ...selected, styleId, group: dark ? 'dark' : 'soft', background: bg, incoming: dark ? '#263043' : '#ffffff', text: dark ? '#f4f6ff' : '#202333', muted: dark ? '#bfc8de' : '#62687a', outgoing, outgoingEnd: readableAccent(mixColor(accent, '#37205f', .28)), accent: dark ? mixColor(accent, '#ffffff', .5) : outgoing, surface: dark ? '#101725' : '#ffffff', border: dark ? '#ffffff26' : '#00000016', radius: '18px', corner: '5px', bubbleBorder: 'none', bubbleShadow: 'none', outgoingText: '#ffffff' };
  theme.pattern = palette.pattern;
  if (styleId === 'classic') theme.pattern = `radial-gradient(ellipse at 110% -20%, ${accent}20 0 35%, transparent 35.5%), radial-gradient(ellipse at -10% 120%, ${accent}14 0 40%, transparent 40.5%)`;
  if (styleId === 'soft') { theme.radius = '26px'; theme.corner = '22px'; theme.bubbleShadow = `0 5px 16px ${accent}20`; theme.pattern = `radial-gradient(ellipse at 15% 20%, ${accent}35, transparent 65%), radial-gradient(ellipse at 90% 90%, ${accent}22, transparent 60%)`; }
  if (styleId === 'gradient') { theme.radius = '20px'; theme.pattern = `linear-gradient(145deg, ${mixColor(accent, '#ffffff', .84)}, ${mixColor(accent, '#bde9fa', .72)}, ${mixColor(accent, '#ffffff', .95)})`; }
  if (styleId === 'night') { theme.radius = '16px'; theme.pattern = `radial-gradient(circle, ${accent}30 1px, transparent 1.5px)`; theme.backgroundSize = '28px 28px'; }
  if (styleId === 'paper') { theme.radius = '5px'; theme.corner = '2px'; theme.background = '#faf6ed'; theme.incoming = '#fffdf7'; theme.text = '#302c26'; theme.muted = '#716a5f'; theme.bubbleBorder = '1px solid #40352422'; theme.bubbleShadow = '2px 3px 0 #40352412'; theme.pattern = 'repeating-linear-gradient(0deg, transparent 0 27px, #806d4520 27px 28px)'; }
  if (styleId === 'outline') { theme.radius = '14px'; theme.background = mixColor(accent, '#ffffff', .97); theme.bubbleBorder = `1.5px solid ${outgoing}`; theme.outgoingText = outgoing; theme.outgoing = '#ffffff'; theme.outgoingEnd = '#ffffff'; theme.pattern = `radial-gradient(circle, ${accent}25 1px, transparent 1px)`; theme.backgroundSize = '18px 18px'; }
  if (styleId === 'minimal') { theme.radius = '9px'; theme.corner = '9px'; theme.background = '#f7f8fa'; theme.incoming = '#e9ecf1'; theme.pattern = 'none'; }
  if (styleId === 'neon') { theme.radius = '22px'; theme.corner = '8px'; theme.bubbleBorder = `1px solid ${theme.accent}88`; theme.bubbleShadow = `0 0 14px ${accent}44`; theme.pattern = `linear-gradient(${accent}12 1px, transparent 1px), linear-gradient(90deg, ${accent}12 1px, transparent 1px)`; theme.backgroundSize = '32px 32px'; }
  Object.assign(theme, extendedTheme(styleId, accent, outgoing) || {});
  if (selected.gradientColors) {
    const originalPattern = theme.pattern;
    const originalSize = theme.backgroundSize;
    const originalRepeat = theme.backgroundRepeat;
    theme.pattern = `linear-gradient(${selected.gradientAngle}deg, ${selected.gradientColors.map((color) => mixColor(color, dark ? '#080c18' : '#ffffff', dark ? .82 : .8)).join(', ')})`;
    if (styleId !== 'outline') { theme.outgoing = readableAccent(selected.gradientColors[0]); theme.outgoingEnd = readableAccent(selected.gradientColors.at(-1)); }
    theme.backgroundSize = 'cover';
    if (theme.extendedStyle && originalPattern !== 'none') {
      theme.pattern = `${originalPattern}, ${theme.pattern}`;
      theme.backgroundSize = `${originalSize || 'cover'}, cover`;
      theme.backgroundRepeat = `${originalRepeat || 'no-repeat'}, no-repeat`;
    }
  }
  return theme;
}

export function chatThemeStyle(selection) {
  const theme = resolveChatTheme(selection);
  const image = theme.image_url ? `linear-gradient(#00000012, #00000012), url(${JSON.stringify(theme.image_url)})` : theme.pattern;
  return {
    '--cs-bg': theme.background, '--cs-surface': theme.surface, '--cs-soft': theme.incoming, '--cs-text': theme.text,
    '--cs-muted': theme.muted, '--cs-border': theme.border, '--cs-outgoing': theme.outgoing, '--cs-outgoing-end': theme.outgoingEnd,
    '--cs-outgoing-text': theme.outgoingText, '--cs-accent': theme.accent, '--cs-radius': theme.radius, '--cs-corner': theme.corner,
    '--cs-bubble-border': theme.bubbleBorder, '--cs-bubble-shadow': theme.bubbleShadow,
    '--chat-theme-background': theme.background, '--chat-theme-incoming': theme.incoming, '--chat-theme-text': theme.text,
    '--chat-theme-outgoing': theme.outgoing, '--chat-theme-outgoing-end': theme.outgoingEnd, '--chat-theme-background-image': image,
    backgroundColor: theme.background, backgroundImage: image, backgroundSize: theme.image_url ? 'cover' : theme.backgroundSize || 'cover', backgroundPosition: 'center', backgroundRepeat: theme.image_url ? 'no-repeat' : theme.backgroundSize ? 'repeat' : 'no-repeat',
    ...(theme.extendedStyle ? {
      '--cs-style-line': `${theme.outgoing}40`, '--cs-style-fill': theme.incoming,
      '--cs-style-bubble-fill': theme.bubbleFill, '--cs-style-backdrop': theme.bubbleBackdrop,
      '--cs-style-padding': theme.bubblePadding, '--cs-style-avatar-radius': theme.avatarRadius,
      '--cs-style-name-spacing': theme.nameSpacing,
      backgroundRepeat: theme.image_url ? 'no-repeat' : theme.backgroundRepeat || 'no-repeat',
    } : {}),
  };
}

function snapshot() {
  const account = chatThemeAccount();
  try {
    return `${account}\n${localStorage.getItem(`${THEME_KEY}${account}`) || ""}`;
  } catch {
    return `${account}\n`;
  }
}

function subscribe(listener) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHAT_THEME_EVENT, listener);
  window.addEventListener("focus", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHAT_THEME_EVENT, listener);
    window.removeEventListener("focus", listener);
  };
}

export function readChatTheme(account = chatThemeAccount()) {
  try {
    return normalizeChatTheme(
      JSON.parse(localStorage.getItem(`${THEME_KEY}${account}`) || "null"),
    );
  } catch {
    return normalizeChatTheme(null);
  }
}

export function saveChatTheme(selection, expectedAccount = chatThemeAccount()) {
  if (chatThemeAccount() !== expectedAccount)
    throw themeError("accountChanged");
  const normalized = normalizeChatTheme(selection);
  try {
    localStorage.setItem(
      `${THEME_KEY}${expectedAccount}`,
      JSON.stringify(normalized),
    );
  } catch {
    throw themeError("saveFailed");
  }
  window.dispatchEvent(new Event(CHAT_THEME_EVENT));
  return normalized;
}

export function useChatStoryTheme() {
  const state = useSyncExternalStore(subscribe, snapshot, () => "guest\n");
  return useMemo(() => {
    const index = state.indexOf("\n");
    const account = state.slice(0, index);
    let selection;
    try {
      selection = normalizeChatTheme(
        JSON.parse(state.slice(index + 1) || "null"),
      );
    } catch {
      selection = normalizeChatTheme(null);
    }
    return {
      account,
      selection,
      theme: resolveChatTheme(selection),
      style: chatThemeStyle(selection),
    };
  }, [state]);
}

async function request(
  path,
  {
    method = "GET",
    body,
    signal,
    timeout = 20000,
    token = chatThemeToken(),
  } = {},
) {
  if (!token) throw themeError("signIn", 401);
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);
  try {
    const response = await fetch(`${API_URL}/api/reader/chat-themes${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) {
      const code =
        response.status === 401
          ? "signIn"
          : response.status === 409 || result.code === "CHAT_THEME_PHOTO_LIMIT"
            ? "limitReached"
            : response.status === 404 || response.status === 503
              ? "unavailable"
              : "requestFailed";
      throw themeError(code, response.status);
    }
    return result;
  } catch (error) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (timedOut) throw themeError("requestFailed");
    if (error.code) throw error;
    throw themeError("requestFailed");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}

function normalizeRows(rows, source, limit) {
  if (!Array.isArray(rows)) return [];
  return rows
    .slice(0, limit)
    .map((row) => {
      const image_url = safeImageUrl(row?.image_url);
      const id = String(row?.id || "");
      if (!image_url || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return null;
      return {
        id,
        source,
        image_url,
        thumbnail_url: safeImageUrl(row.thumbnail_url) || image_url,
        title: String(row.title || "").slice(0, 100),
      };
    })
    .filter(Boolean);
}

export async function listChatThemeBackgrounds({ cursor = "", signal } = {}) {
  const query = new URLSearchParams({ limit: "9" });
  if (cursor) query.set("cursor", String(cursor).slice(0, 512));
  const result = await request(`/backgrounds?${query}`, { signal });
  return {
    items: normalizeRows(result.items, "shadow", 9),
    nextCursor: result.next_cursor
      ? String(result.next_cursor).slice(0, 512)
      : "",
  };
}

const photoMemory = new Map();
const photoPending = new Map();
const photoVersions = new Map();

function photoCacheKey(account) {
  return "shadow_chat_theme_photos_v1:" + account;
}

function readPhotoCache(account) {
  try {
    const stored = localStorage.getItem(photoCacheKey(account));
    if (stored) {
      const value = JSON.parse(stored);
      if (value.v === 1 && Array.isArray(value.items))
        return normalizeRows(value.items, "photo", CHAT_THEME_PHOTO_LIMIT);
    }
  } catch {}
  return photoMemory.get(account) ?? null;
}

function writePhotoCache(account, items) {
  const rows = normalizeRows(items, "photo", CHAT_THEME_PHOTO_LIMIT);
  if (photoMemory.size >= 4 && !photoMemory.has(account))
    photoMemory.delete(photoMemory.keys().next().value);
  photoMemory.set(account, rows);
  try {
    localStorage.setItem(
      photoCacheKey(account),
      JSON.stringify({ v: 1, items: rows }),
    );
  } catch {}
  return rows;
}

function changePhotoCache(account, change) {
  photoVersions.set(account, (photoVersions.get(account) || 0) + 1);
  const current = readPhotoCache(account);
  if (current !== null) writePhotoCache(account, change(current));
}

function waitForPhotos(promise, signal) {
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const aborted = () => reject(new DOMException("Aborted", "AbortError"));
    if (signal.aborted) return aborted();
    signal.addEventListener("abort", aborted, { once: true });
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", aborted));
  });
}

export async function listChatThemePhotos({ signal } = {}) {
  if (!chatThemeToken()) throw themeError("signIn");
  const account = chatThemeAccount();
  const cached = readPhotoCache(account);
  if (cached !== null) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return cached;
  }
  let pending = photoPending.get(account);
  if (!pending) {
    const version = photoVersions.get(account) || 0;
    pending = request("/photos?limit=10")
      .then((result) => {
        const rows = normalizeRows(
          result.items,
          "photo",
          CHAT_THEME_PHOTO_LIMIT,
        );
        if ((photoVersions.get(account) || 0) !== version)
          return readPhotoCache(account) ?? rows;
        return writePhotoCache(account, rows);
      })
      .finally(() => photoPending.delete(account));
    photoPending.set(account, pending);
  }
  return waitForPhotos(pending, signal);
}

function uploadToCloud(url, file, signal, onProgress) {
  const destination = new URL(url);
  if (
    destination.protocol !== "https:" ||
    destination.username ||
    destination.password
  )
    throw themeError("uploadFailed");
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const abort = () => xhr.abort();
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve();
    };
    xhr.open("PUT", destination.href);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = 180000;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total)
        onProgress?.(Math.round(10 + (event.loaded / event.total) * 80));
    };
    xhr.onload = () =>
      finish(
        xhr.status >= 200 && xhr.status < 300
          ? null
          : themeError("uploadFailed"),
      );
    xhr.onerror = () => finish(themeError("uploadFailed"));
    xhr.ontimeout = () => finish(themeError("uploadFailed"));
    xhr.onabort = () => finish(new DOMException("Aborted", "AbortError"));
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) finish(new DOMException("Aborted", "AbortError"));
    else xhr.send(file);
  });
}

export async function uploadChatThemePhoto(file, { signal, onProgress } = {}) {
  const token = chatThemeToken();
  const account = chatThemeAccount();
  if (!token) throw themeError("signIn");
  if (!file || !ACCEPTED_TYPES.has(file.type)) throw themeError("invalidType");
  if (file.size <= 0 || file.size > CHAT_THEME_PHOTO_MAX_BYTES)
    throw themeError("tooLarge");
  onProgress?.(0);
  let optimized;
  try {
    optimized = await optimizeImageForUpload(file, {
      preset: "cover",
      force: true,
      signal,
      maxSourceBytes: CHAT_THEME_PHOTO_MAX_BYTES,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw themeError("invalidImage");
  }
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const ready = (
  await prepareChatReaderImage(optimized.file, {
    kind: "theme",
    signal,
  })
).file;
  if (!["image/jpeg", "image/png", "image/webp"].includes(ready.type))
    throw themeError("invalidImage");
  if (account !== chatThemeAccount() || token !== chatThemeToken())
    throw themeError("accountChanged");
  onProgress?.(10);
  const init = await request("/photos/init", {
    method: "POST",
    token,
    signal,
    body: {
      mime_type: ready.type,
      file_size: ready.size,
      title: String(file.name || "").slice(0, 100),
    },
  });
  if (!init.upload_url || !init.upload_token) throw themeError("uploadFailed");
  await uploadToCloud(init.upload_url, ready, signal, onProgress);
  if (account !== chatThemeAccount() || token !== chatThemeToken())
    throw themeError("accountChanged");
  onProgress?.(95);
  const result = await request("/photos/complete", {
    method: "POST",
    token,
    signal,
    body: { upload_token: init.upload_token },
  });
  const photo = normalizeRows([result.item], "photo", 1)[0];
  if (!photo) throw themeError("uploadFailed");
  changePhotoCache(account, (items) => [
    photo,
    ...items.filter((item) => item.id !== photo.id),
  ]);
  onProgress?.(100);
  return photo;
}

export async function deleteChatThemePhoto(id, { signal } = {}) {
  const account = chatThemeAccount();
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(String(id)))
    throw themeError("deleteFailed");
  await request(`/photos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal,
  });
  changePhotoCache(account, (items) =>
    items.filter((item) => item.id !== String(id)),
  );
}
