"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

// The visitor's last pick, else their OS setting, else dark. The inline script
// in app/layout.jsx applies the same rule before the first paint.
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

// A square button fixed to the bottom-right corner that flips between the dark
// and light themes and remembers the choice. Its icon and label follow
// data-theme through CSS, so the server render never has to know the theme.
export default function ThemeToggle() {
  // In development, React's Strict Mode remount resets <html> to its JSX
  // attributes, dropping the theme the inline script set. A no-op in production.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = preferredTheme();
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
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
      className="fixed right-4 bottom-4 z-40 grid size-11 cursor-pointer place-items-center rounded-[2px] bg-raised text-ink shadow-[0_0_0_1px_var(--rule),0_8px_20px_-8px_rgb(0_0_0/0.3)] transition-[background-color,transform] duration-150 hover:bg-sunk active:scale-95 print:hidden"
    >
      {/* Shows the theme a click switches to. */}
      <Moon aria-hidden="true" className="size-5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-5 dark:block" />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
    </button>
  );
}
