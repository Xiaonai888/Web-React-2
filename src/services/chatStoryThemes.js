import { useMemo, useSyncExternalStore } from "react";
import { optimizeImageForUpload } from "../utils/imageUploadOptimizer";

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
      localStorage.getItem("shadow_reader_token") ||
      sessionStorage.getItem("shadow_reader_token") ||
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

export const CHAT_THEME_STYLES = Object.freeze(['classic', 'soft', 'gradient', 'night', 'paper', 'outline', 'minimal', 'neon'].map((id) => ({ id, nameKey: `chatStoryThemes.styles.${id}` })));
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
  const dark = ['night', 'neon'].includes(styleId);
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
  if (selected.gradientColors) {
    theme.pattern = `linear-gradient(${selected.gradientAngle}deg, ${selected.gradientColors.map((color) => mixColor(color, dark ? '#080c18' : '#ffffff', dark ? .82 : .8)).join(', ')})`;
    if (styleId !== 'outline') { theme.outgoing = readableAccent(selected.gradientColors[0]); theme.outgoingEnd = readableAccent(selected.gradientColors.at(-1)); }
    theme.backgroundSize = 'cover';
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
  const ready = optimized.file;
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
