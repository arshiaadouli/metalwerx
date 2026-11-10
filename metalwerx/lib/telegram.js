import "server-only";

// The Telegram bot the site sends notices through (Bot API, https://core.telegram.org/bots/api).
// TELEGRAM_BOT_TOKEN is the token @BotFather gave the bot, and TELEGRAM_CHAT_ID
// the chat it posts to by default: the owner's chat with the bot, or a group the
// bot is in. Each message is one Bot API call; the functions below are the
// one place to send from (see app/api/telegram/route.js).

const API = "https://api.telegram.org";
// Telegram's own limit for one sendMessage call.
export const MAX_TEXT_LENGTH = 4096;

function botToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set. Create a bot with @BotFather and paste its token.");
  }
  return token;
}

function defaultChatId() {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    throw new Error(
      "TELEGRAM_CHAT_ID is not set. Message the bot, then read the chat id from getUpdates.",
    );
  }
  return chatId;
}

// Calls one Bot API method with a JSON payload, or a FormData when it uploads
// files, and returns Telegram's result. Throws when the bot isn't configured,
// the request fails or Telegram says no.
async function callBot(method, payload) {
  const upload = payload instanceof FormData;
  const res = await fetch(`${API}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: upload ? undefined : { "content-type": "application/json" },
    body: upload ? payload : JSON.stringify(payload),
    signal: AbortSignal.timeout(upload ? 60000 : 10000),
  });
  // Telegram answers { ok, result } or { ok: false, error_code, description }.
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram returned ${data.error_code ?? res.status}: ${data.description ?? "unknown error"}`);
  }
  return data.result;
}

// Sends text to a Telegram chat and returns the sent message as Telegram
// returns it ({ message_id, chat, date, text, … }).
//   text      what to send, up to MAX_TEXT_LENGTH characters (longer is cut)
//   chatId    the chat to post to; TELEGRAM_CHAT_ID when left out
//   parseMode "HTML" or "MarkdownV2" to format the text; plain text when left out
//   silent    true sends without a notification sound
export async function sendTelegramMessage(text, { chatId, parseMode, silent = false } = {}) {
  const body = String(text ?? "").trim();
  if (!body) throw new Error("There is nothing to send: the message text is empty.");

  const payload = {
    chat_id: chatId ?? defaultChatId(),
    text: body.length > MAX_TEXT_LENGTH ? `${body.slice(0, MAX_TEXT_LENGTH - 1)}…` : body,
    disable_notification: silent,
  };
  if (parseMode) payload.parse_mode = parseMode;
  return callBot("sendMessage", payload);
}

// Sends 1 to 10 image files (File or Blob objects, up to 10 MB each) to a chat
// as one album and returns the sent message(s). Telegram re-encodes them, so
// a format it can't read (HEIC, say) fails the whole album.
//   chatId  the chat to post to; TELEGRAM_CHAT_ID when left out
export async function sendTelegramPhotos(files, { chatId } = {}) {
  if (files.length === 0) throw new Error("There is nothing to send: no photos.");
  if (files.length > 10) throw new Error("Telegram takes at most 10 photos in one album.");

  const payload = new FormData();
  payload.set("chat_id", chatId ?? defaultChatId());
  if (files.length === 1) {
    payload.set("photo", files[0], files[0].name);
    return callBot("sendPhoto", payload);
  }
  // sendMediaGroup wants 2 to 10 items, each pointing at an uploaded field.
  const media = files.map((file, i) => ({ type: "photo", media: `attach://photo${i}` }));
  payload.set("media", JSON.stringify(media));
  files.forEach((file, i) => payload.set(`photo${i}`, file, file.name));
  return callBot("sendMediaGroup", payload);
}

// Whether both TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set, for code that
// should skip the notice rather than fail when the bot isn't configured.
export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}
