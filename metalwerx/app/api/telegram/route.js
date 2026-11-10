import { sendTelegramMessage, telegramConfigured } from "@/lib/telegram";

// POST { text, chatId?, parseMode?, silent? } here with the shared secret to
// have the site's Telegram bot send a message (see lib/telegram.js). Meant for
// the CMS and scripts on the same network, so the bot token never leaves the
// server. Answers { sent: true, messageId } or { error } with 4xx/5xx.
export async function POST(request) {
  const secret = process.env.TELEGRAM_API_SECRET;
  if (!secret || request.headers.get("x-telegram-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!telegramConfigured()) {
    return Response.json(
      { error: "The Telegram bot is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) return Response.json({ error: "Send JSON with a non-empty text." }, { status: 400 });

  const parseMode = ["HTML", "MarkdownV2", "Markdown"].includes(body.parseMode)
    ? body.parseMode
    : undefined;
  const chatId =
    typeof body.chatId === "string" || typeof body.chatId === "number" ? body.chatId : undefined;

  try {
    const message = await sendTelegramMessage(text, {
      chatId,
      parseMode,
      silent: body.silent === true,
    });
    return Response.json({ sent: true, messageId: message.message_id });
  } catch (error) {
    console.error("Telegram send failed:", error);
    return Response.json({ error: error.message }, { status: 502 });
  }
}
