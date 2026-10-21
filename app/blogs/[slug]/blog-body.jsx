import Link from "next/link";

// Renders a post body from Strapi's Rich text (Blocks) editor as HTML, on the
// server, so the formatted post is in the prerendered page. The column is set
// for reading: 18px type at about 68 to 72 characters a line, with more space
// over a heading than under it. Archivo's zero (what the ch unit measures) is
// far wider than its average letter, so that measure is 54ch, not 68ch.

// The page title is the only <h1>, so a post's headings start at <h2>, and
// each heading level the editor used takes the next tag down, in order. A post
// written with Heading 3 alone gets <h2>s, and none skips a level.
function headingTags(blocks) {
  const levels = [...new Set(blocks.filter((b) => b.type === "heading").map((b) => b.level))];
  levels.sort((a, b) => a - b);
  return new Map(levels.map((level, i) => [level, Math.min(i + 2, 6)]));
}

// Styles by tag, on the site's type scale.
const HEADING_STYLES = {
  2: "mt-12 type-subheading text-ink",
  3: "mt-10 text-lg leading-snug font-bold text-ink [font-stretch:104%]",
  4: "mt-8 text-base leading-snug font-bold text-ink",
  5: "mt-8 type-meta text-ink",
  6: "mt-8 type-meta text-ink-muted",
};

// Each block's space over it; the block straight after a heading sits closer.
const FLOW = "mt-6 [h2+&]:mt-3 [h3+&]:mt-3 [h4+&]:mt-2 [h5+&]:mt-2 [h6+&]:mt-2";

export default function BlogBody({ blocks }) {
  const tags = headingTags(blocks);
  return (
    <div className="mt-12 max-w-[54ch] text-lg leading-[1.7] text-pretty text-ink-soft sm:mt-14 [&>:first-child]:mt-0">
      {blocks.map((block, i) => (
        <Block key={i} block={block} tags={tags} />
      ))}
    </div>
  );
}

function Block({ block, tags }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={FLOW}>
          <Inline nodes={block.children} />
        </p>
      );
    case "heading": {
      const level = tags.get(block.level) ?? 6;
      const Tag = `h${level}`;
      return (
        <Tag className={HEADING_STYLES[level]}>
          <Inline nodes={block.children} />
        </Tag>
      );
    }
    case "list":
      return <List list={block} className={FLOW} />;
    case "quote":
      // A quiet inset: set in from the column on a hairline, a step larger.
      return (
        <blockquote className={`${FLOW} border-l border-ink pl-6 text-[1.1875rem] leading-[1.6] text-ink sm:pl-8`}>
          <Inline nodes={block.children} />
        </blockquote>
      );
    case "code":
      // tabIndex, so a keyboard can scroll a long line into view.
      return (
        <pre
          tabIndex={0}
          className={`${FLOW} overflow-x-auto rounded-[2px] bg-sunk px-5 py-4 font-mono text-[0.9375rem] leading-relaxed text-ink`}
        >
          <code>{block.children.map((child) => child.text).join("")}</code>
        </pre>
      );
    case "image":
      return <Figure image={block.image} />;
    default:
      return null;
  }
}

function List({ list, className = "" }) {
  const ordered = list.format === "ordered";
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`${className} space-y-2 pl-6 marker:text-ink-muted ${
        ordered ? "list-decimal marker:font-semibold marker:tabular-nums" : "list-[square]"
      }`}
    >
      {list.children.map((item, i) =>
        // Indented items arrive as a list inside the list. An <li> around it
        // keeps the HTML valid; list-none hides the extra bullet.
        item.type === "list" ? (
          <li key={i} className="list-none">
            <List list={item} />
          </li>
        ) : (
          <li key={i} className="pl-1">
            <Inline nodes={item.children} />
          </li>
        ),
      )}
    </Tag>
  );
}

// A photo in the post, as a plate with its caption under it, given more room
// than a paragraph on either side.
function Figure({ image }) {
  return (
    <figure className="my-10">
      {/* A plain <img> rather than next/image, so no next.config remotePatterns
          entry is needed for the Strapi server. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alternativeText ?? ""}
        title={image.caption || undefined}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="h-auto w-full rounded-[2px] bg-sunk"
      />
      {image.caption && (
        <figcaption className="mt-3 text-sm leading-snug text-ink-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}

// A link's words without their formatting, for its title.
function plainText(nodes) {
  return nodes.map((node) => node.text ?? plainText(node.children ?? [])).join("");
}

const LINK = "text-ink underline decoration-ink-muted decoration-1 transition-colors duration-150 ease-out-expo hover:decoration-ink";

function Inline({ nodes }) {
  return nodes.map((node, i) => {
    if (node.type !== "link") return <Text key={i} node={node} />;
    // Links to the site's own pages navigate without a full page load.
    const Anchor = node.url?.startsWith("/") ? Link : "a";
    return (
      <Anchor key={i} href={node.url} title={plainText(node.children)} className={LINK}>
        <Inline nodes={node.children} />
      </Anchor>
    );
  });
}

function Text({ node }) {
  // Shift+Enter in the editor puts a line break inside the text.
  let content = node.text
    .split("\n")
    .flatMap((line, i) => (i === 0 ? [line] : [<br key={i} />, line]));
  if (node.code) {
    content = (
      <code className="rounded-[2px] bg-sunk px-1.5 py-0.5 font-mono text-[0.875em] text-ink">{content}</code>
    );
  }
  if (node.bold) content = <strong className="font-semibold text-ink">{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return content;
}
