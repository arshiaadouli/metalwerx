// Renders a post body from Strapi's Rich text (Blocks) editor as HTML, on the
// server, so the formatted post is in the prerendered page.

// The page title is the only <h1>, so the editor's Heading 1 becomes an <h2>,
// Heading 2 an <h3>, and so on (Heading 5 and 6 both become <h6>).
const HEADING_STYLES = {
  1: "pt-4 font-bebas-neue text-5xl leading-none tracking-wide text-ink",
  2: "pt-2 font-bebas-neue text-4xl leading-none tracking-wide text-ink",
  3: "pt-2 font-oswald text-xl uppercase tracking-[0.15em] text-ink",
  4: "font-oswald text-lg uppercase tracking-[0.15em] text-ink",
  5: "font-oswald text-base uppercase tracking-[0.15em] text-ink-muted",
  6: "font-oswald text-sm uppercase tracking-[0.15em] text-ink-muted",
};

export default function BlogBody({ blocks }) {
  return (
    <div className="mt-10 space-y-6 border-t border-line pt-10 text-lg leading-8 text-ink-soft">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <Inline nodes={block.children} />
        </p>
      );
    case "heading": {
      const Tag = `h${Math.min(block.level + 1, 6)}`;
      return (
        <Tag className={HEADING_STYLES[block.level]}>
          <Inline nodes={block.children} />
        </Tag>
      );
    }
    case "list":
      return <List list={block} />;
    case "quote":
      return (
        <blockquote className="border-l-4 border-cherry pl-6 italic text-ink">
          <Inline nodes={block.children} />
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg bg-well p-4 text-sm leading-6 text-ink">
          <code>{block.children.map((child) => child.text).join("")}</code>
        </pre>
      );
    case "image":
      return <Figure image={block.image} />;
    default:
      return null;
  }
}

function List({ list }) {
  const ordered = list.format === "ordered";
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`space-y-2 pl-6 marker:text-cherry ${ordered ? "list-decimal" : "list-disc"}`}>
      {list.children.map((item, i) =>
        // Indented items arrive as a list inside the list. An <li> around it
        // keeps the HTML valid; list-none hides the extra bullet.
        item.type === "list" ? (
          <li key={i} className="list-none">
            <List list={item} />
          </li>
        ) : (
          <li key={i}>
            <Inline nodes={item.children} />
          </li>
        ),
      )}
    </Tag>
  );
}

function Figure({ image }) {
  return (
    <figure>
      {/* A plain <img> rather than next/image, so no next.config remotePatterns
          entry is needed for the Strapi server. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alternativeText ?? ""}
        title={image.caption || image.alternativeText || image.name}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="h-auto w-full rounded-lg"
      />
      {image.caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}

// A link's words without their formatting, for its title.
function plainText(nodes) {
  return nodes.map((node) => node.text ?? plainText(node.children ?? [])).join("");
}

function Inline({ nodes }) {
  return nodes.map((node, i) =>
    node.type === "link" ? (
      <a
        key={i}
        href={node.url}
        title={plainText(node.children)}
        className="text-ink-cherry underline underline-offset-4 transition-colors hover:text-ink"
      >
        <Inline nodes={node.children} />
      </a>
    ) : (
      <Text key={i} node={node} />
    ),
  );
}

function Text({ node }) {
  // Shift+Enter in the editor puts a line break inside the text.
  let content = node.text
    .split("\n")
    .flatMap((line, i) => (i === 0 ? [line] : [<br key={i} />, line]));
  if (node.code) {
    content = <code className="rounded bg-well px-1.5 py-0.5 text-[0.9em] text-ink">{content}</code>;
  }
  if (node.bold) content = <strong className="font-semibold text-ink">{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;
  return content;
}
