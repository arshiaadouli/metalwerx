"use client";

import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

import { Enter } from "@/components/ui/enter";

const STORAGE_KEY = "blog-view";
const DEFAULT_VIEW = "grid";
const VIEWS = [
  { id: "grid", label: "Grid view", Icon: LayoutGrid },
  { id: "list", label: "List view", Icon: LayoutList },
];
const VIEW_IDS = VIEWS.map((view) => view.id);

// The visitor's last pick, else the grid.
function storedView() {
  try {
    const view = localStorage.getItem(STORAGE_KEY);
    if (VIEW_IDS.includes(view)) return view;
  } catch {
    // Storage is blocked; use the default.
  }
  return DEFAULT_VIEW;
}

// Runs as the HTML is parsed, after the buttons and before the posts, so a
// visitor who picked the list never sees the grid first. It makes the same
// changes the first client render makes: data-view and the pressed button.
const applyStoredView = `{var v;try{v=localStorage.getItem(${JSON.stringify(STORAGE_KEY)})}catch(e){}if(${JSON.stringify(VIEW_IDS)}.indexOf(v)>=0){var w=document.currentScript.parentElement;w.setAttribute("data-view",v);w.querySelectorAll("[data-view-option]").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-view-option")===v))})}}`;

// Grid and list buttons above the posts, and the wrapper whose data-view the
// cards style themselves by (group-data-[view=list]/blogs:...), so the posts
// stay server-rendered. The choice is remembered in localStorage. Both views
// are one column on phones, so the buttons only show from the sm breakpoint.
export default function BlogViews({ summary, children }) {
  // On the server there's no storage, so the HTML has the default; the inline
  // script corrects it before React hydrates, and this reads the same value,
  // so React agrees with the corrected HTML.
  const [view, setView] = useState(() =>
    typeof window === "undefined" ? DEFAULT_VIEW : storedView(),
  );

  function choose(next) {
    setView(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage is blocked; the choice lasts until the next page load.
    }
  }

  return (
    // suppressHydrationWarning: the inline script may have changed data-view
    // and aria-pressed, and the DOM it left is the one to keep.
    <div data-view={view} suppressHydrationWarning className="group/blogs">
      {/* Follows the page header in (see components/ui/enter.jsx). */}
      <Enter step={3} className="mt-10 flex items-center justify-between gap-4">
        <p className="font-oswald text-sm uppercase tracking-[0.2em] text-ink-muted">{summary}</p>
        <div
          role="group"
          aria-label="Post layout"
          className="hidden divide-x divide-line border border-line sm:flex"
        >
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              data-view-option={id}
              aria-pressed={view === id}
              suppressHydrationWarning
              onClick={() => choose(id)}
              title={label}
              className="grid size-10 cursor-pointer place-items-center text-ink-muted transition-colors not-aria-pressed:hover:text-ink-cherry aria-pressed:bg-cherry aria-pressed:text-chrome focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon aria-hidden="true" className="size-5" />
              <span className="sr-only">{label}</span>
            </button>
          ))}
        </div>
      </Enter>
      <InlineScript html={applyStoredView} />
      {children}
    </div>
  );
}

// An inline <script> that runs only from the server HTML. On a client-side
// navigation React would render it without running it, and warn about it in
// development, so the client renders it as inert text/plain instead; the
// lazy useState above covers that case. (From the Next.js guide "Preventing
// flash before hydration".)
function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
