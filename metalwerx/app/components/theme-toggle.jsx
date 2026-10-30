"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

// The visitor's last pick, else their OS setting. The inline script in
// app/components/theme-script.jsx applies the same rule before the first paint.
function preferredTheme() {
  let stored;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage is blocked; fall back to the OS setting.
  }
  if (stored === "light" || stored === "dark") return stored;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

// Switches every colour at once. Otherwise the elements with transition-colors
// fade over while the rest of the page snaps.
function applyTheme(theme) {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  document.documentElement.dataset.theme = theme;
  // Reading a style flushes the new colours while transitions are still off.
  window.getComputedStyle(document.body).getPropertyValue("color");
  setTimeout(() => style.remove(), 1);
}

// A round button fixed to the bottom-right corner that flips between the dark
// and light themes and remembers the choice. Its icon and label follow
// data-theme through CSS, so the server render never has to know the theme.
export default function ThemeToggle() {
  // In development, React's Strict Mode remount resets <html> to its JSX
  // attributes, dropping the theme the inline script set. A no-op in production.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = preferredTheme();
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage is blocked; the choice lasts until the next page load.
    }
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-5 bottom-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-input bg-panel text-ink shadow-lg shadow-black/20 transition-colors hover:border-cherry hover:text-ink-cherry focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background print:hidden"
    >
      {/* Shows the theme a click switches to. */}
      <Sun aria-hidden="true" className="size-5 light:hidden" />
      <Moon aria-hidden="true" className="hidden size-5 light:block" />
      <span className="sr-only light:hidden">Switch to light theme</span>
      <span className="sr-only hidden light:inline">Switch to dark theme</span>
    </button>
  );
}
