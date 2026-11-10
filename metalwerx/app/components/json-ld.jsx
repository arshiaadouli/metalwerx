// Structured data for search engines and AI assistants: a schema.org object as
// a JSON-LD <script>. Check the output with https://validator.schema.org/.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify doesn't escape "<", which could otherwise close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
