import Link from "next/link";
import { linkMentions } from "./link-mentions";

// Renders a post body as paragraphs, on the server, so the post is in the
// prerendered page. A single line break inside a paragraph stays a line break,
// and the first mention of a metal or service links to its page (see
// link-mentions.js), so every post points on to the pages that sell.
export default function BlogBody({ paragraphs }) {
  return (
    <div className="mt-10 space-y-6 border-t border-line pt-10 text-lg leading-8 text-ink-soft">
      {linkMentions(paragraphs).map((parts, i) => (
        <p key={i}>
          {parts.map((part, j) =>
            typeof part === "string" ? (
              <Lines key={j} text={part} />
            ) : (
              <Link
                key={j}
                href={part.href}
                className="text-ink-cherry underline underline-offset-4 transition-colors hover:text-ink"
              >
                {part.text}
              </Link>
            ),
          )}
        </p>
      ))}
    </div>
  );
}

// Text with its single line breaks kept.
function Lines({ text }) {
  return text.split("\n").flatMap((line, j) => (j === 0 ? [line] : [<br key={j} />, line]));
}
