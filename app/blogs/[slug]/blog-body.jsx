// Renders a post body as paragraphs, on the server, so the post is in the
// prerendered page. A single line break inside a paragraph stays a line break.
export default function BlogBody({ paragraphs }) {
  return (
    <div className="mt-10 space-y-6 border-t border-line pt-10 text-lg leading-8 text-ink-soft">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>
          {paragraph
            .split("\n")
            .flatMap((line, j) => (j === 0 ? [line] : [<br key={j} />, line]))}
        </p>
      ))}
    </div>
  );
}
