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

export function normalizeChatTheme(value) {
  if (!value || !["preset", "shadow", "photo"].includes(value.source))
    return {
      source: "preset",
      id: DEFAULT_CHAT_THEME.id,
      paletteId: DEFAULT_CHAT_THEME.id,
    };
  const paletteId = CHAT_STORY_THEMES.some(
    (theme) => theme.id === value.paletteId,
  )
    ? value.paletteId
    : DEFAULT_CHAT_THEME.id;
  if (value.source === "preset") {
    const preset = CHAT_STORY_THEMES.find((theme) => theme.id === value.id);
    return {
      source: "preset",
      id: preset?.id || DEFAULT_CHAT_THEME.id,
      paletteId: preset?.id || DEFAULT_CHAT_THEME.id,
    };
  }
  const id = String(value.id || "");
  const imageUrl = safeImageUrl(value.image_url);
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id) || !imageUrl)
    return {
      source: "preset",
      id: DEFAULT_CHAT_THEME.id,
      paletteId: DEFAULT_CHAT_THEME.id,
    };
  return {
    source: value.source,
    id,
    image_url: imageUrl,
    title: String(value.title || "").slice(0, 100),
    paletteId,
  };
}

export function resolveChatTheme(selection) {
  const selected = normalizeChatTheme(selection);
  const palette =
    CHAT_STORY_THEMES.find((theme) => theme.id === selected.paletteId) ||
    DEFAULT_CHAT_THEME;
  return { ...palette, ...selected };
}

export function chatThemeStyle(selection) {
  const theme = resolveChatTheme(selection);
  const image = theme.image_url
    ? `linear-gradient(#00000012, #00000012), url(${JSON.stringify(theme.image_url)})`
    : theme.pattern;
  return {
    "--cs-bg": theme.background,
    "--cs-surface": theme.surface,
    "--cs-soft": theme.incoming,
    "--cs-text": theme.text,
    "--cs-muted": theme.muted,
    "--cs-border": theme.border,
    "--cs-outgoing": theme.outgoing,
    "--cs-outgoing-end": theme.outgoingEnd,
    "--cs-accent": theme.accent,
    "--chat-theme-background": theme.background,
    "--chat-theme-incoming": theme.incoming,
    "--chat-theme-text": theme.text,
    "--chat-theme-outgoing": theme.outgoing,
    "--chat-theme-outgoing-end": theme.outgoingEnd,
    "--chat-theme-background-image": image,
    backgroundColor: theme.background,
    backgroundImage: image,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
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
