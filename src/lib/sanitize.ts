import sanitize from "sanitize-html";

/**
 * Sanitize author-supplied HTML before rendering it on public pages.
 * Uses sanitize-html (pure Node, no jsdom) so it runs reliably in the
 * serverless runtime.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitize(html, {
    allowedTags: [
      "p", "br", "hr", "h2", "h3", "h4", "strong", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "img", "code", "pre", "figure", "figcaption", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    // Make every external link safe by default.
    transformTags: {
      a: (tagName, attribs) => {
        const target = attribs.target;
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(target === "_blank"
              ? { rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
    },
  });
}
