"use client";

// Sets data-theme as the page is parsed, so it never paints in the wrong theme:
// the visitor's last pick in ThemeToggle, else their OS setting. With scripts
// off, the page stays on the dark default. suppressHydrationWarning on <html>
// lets React accept the attribute the script changed.
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()`;

// The server HTML carries a normal script, which runs before the first paint.
// If React ever renders this on the client, the script wouldn't run anyway, so
// mark it as data there; that keeps React from warning about a script tag.
// suppressHydrationWarning covers the differing type during hydration.
export default function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? undefined : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
