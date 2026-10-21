"use client";

import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "blog-view";
const DEFAULT_VIEW = "grid";
const VIEWS = [
  { id: "grid", label: "Grid", title: "Grid view", Icon: LayoutGrid },
  { id: "list", label: "List", title: "List view", Icon: LayoutList },
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

// The post count and the grid and list buttons over the catalogue, and the
// wrapper whose data-view the posts style themselves by
// (group-data-[view=list]/blogs:...), so the posts stay server-rendered. The
// choice is remembered in localStorage. Both views are one column on phones,
// so the buttons only show from the sm breakpoint.
export default function BlogViews({ summary, className, children }) {
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
    <div data-view={view} suppressHydrationWarning className={cn("group/blogs", className)}>
      <div className="flex min-h-11 items-center justify-between gap-4 pb-4">
        <p className="type-meta text-ink-muted">{summary}</p>
        <div role="group" aria-label="Post layout" className="hidden gap-1 sm:flex">
          {VIEWS.map(({ id, label, title, Icon }) => (
            <button
              key={id}
              type="button"
              data-view-option={id}
              aria-pressed={view === id}
              suppressHydrationWarning
              onClick={() => choose(id)}
              title={title}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[2px] px-3.5 type-meta text-ink-soft transition-colors duration-150 ease-out-expo not-aria-pressed:hover:bg-sunk not-aria-pressed:hover:text-ink aria-pressed:bg-ink aria-pressed:text-ground"
            >
              <Icon aria-hidden="true" strokeWidth={2} className="size-[1.125rem]" />
              {label}
            </button>
          ))}
        </div>
      </div>
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
