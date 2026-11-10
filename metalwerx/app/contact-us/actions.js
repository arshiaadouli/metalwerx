"use server";

import { headers } from "next/headers";
import { createMessage, uploadMessagePhoto } from "@/lib/cms";
import { photosProblem } from "@/lib/message-photos";
import { sendTelegramMessage, sendTelegramPhotos } from "@/lib/telegram";

// At most RATE_LIMIT messages from one address in RATE_WINDOW, so a script
// can't flood the CMS. Counted in memory, so the count starts again when the
// server restarts. The address is the visitor's, which the proxy in front of
// the site puts first in X-Forwarded-For.
const RATE_LIMIT = 5;
const RATE_WINDOW = 10 * 60 * 1000;
const sendTimes = new Map();

// Records a send from address and says whether it's over the limit.
function overLimit(address) {
  const now = Date.now();
  const recent = (times) => times.filter((time) => now - time < RATE_WINDOW);
  // Forget addresses that have gone quiet, so the map doesn't grow forever.
  if (sendTimes.size > 1000) {
    for (const [key, times] of sendTimes) {
      if (recent(times).length === 0) sendTimes.delete(key);
    }
  }
  const times = recent(sendTimes.get(address) ?? []);
  if (times.length >= RATE_LIMIT) return true;
  sendTimes.set(address, [...times, now]);
  return false;
}

// The contact form's Server Action (see contact-with-globe.jsx).
// It uploads the photos, saves the message listing them in the CMS and returns
// { status: "sent" }, or { status: "error", error, fields } so the form can
// show the error and keep what was typed. The browser can't refill a file
// input, so an error asks for the photos again.
export async function sendMessage(previousState, formData) {
  const fields = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };
  const files = formData.getAll("photos").filter((file) => file instanceof File);
  const photos = files.filter((file) => file.size > 0);
  const failed = (error) => ({
    status: "error",
    error: photos.length > 0 ? `${error} Please choose your photos again.` : error,
    fields,
  });

  // The same limits as the CMS's messages collection.
  if (!fields.name || !fields.email || !fields.message) {
    return failed("Please fill in your name, email address and message.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return failed("Please check your email address.");
  }
  if (fields.name.length > 200 || fields.phone.length > 50 || fields.message.length > 5000) {
    return failed("Your message is too long. Please shorten it.");
  }
  const problem = photosProblem(files);
  if (problem) return failed(problem);

  // A bot that filled in the hidden field gets the usual thanks, but nothing
  // is saved.
  if (String(formData.get("website") ?? "") !== "") return { status: "sent" };
  const address = (await headers()).get("x-forwarded-for")?.split(",")[0].trim();
  if (address && overLimit(address)) {
    return failed(
      "You've sent several messages in the last few minutes. Please wait a little, or call or email us.",
    );
  }

  try {
    // If the message then can't be saved, its photos stay in the CMS on their
    // own, under Message Photos.
    const photoIds = await Promise.all(photos.map(uploadMessagePhoto));
    await createMessage({ ...fields, photos: photoIds });
  } catch (error) {
    console.error("Couldn't save a contact form message:", error);
    return failed("Sorry, your message couldn't be sent. Please try again, or call or email us.");
  }

  // Tell the owner on Telegram: the message, then its photos as one album.
  // The message is saved either way, so a Telegram failure is only logged.
  try {
    await sendTelegramMessage(
      `New contact form message from ${fields.name} (${fields.email}, ${fields.phone || "no phone"}):\n\n${fields.message}`,
    );
    if (photos.length > 0) await sendTelegramPhotos(photos);
  } catch (error) {
    console.error("Couldn't send Telegram message:", error);
  }

  return { status: "sent" };
}
