// Structured data for search engines, as Next's JSON-LD guide recommends: a
// script in the page, with "<" escaped so no string in the data can close it.
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
