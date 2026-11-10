// Metal Werx's social media accounts, shown in the footer and on /contact-us.
// lucide-react no longer ships brand logos, so these are drawn in its style
// (24px box, 2px round stroke) to sit next to its icons.
function BrandIcon({ children }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const socialLinks = [
  {
    name: "Instagram",
    handle: "@metal__werx",
    href: "https://www.instagram.com/metal__werx/",
    icon: (
      <BrandIcon>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </BrandIcon>
    ),
  },
  {
    name: "X",
    handle: "@metalwerxhallam",
    href: "https://x.com/metalwerxhallam",
    // X's own logo is a filled shape, not a stroked one. Its viewBox has 2px
    // of padding each side so it fills the same area as the drawn icons.
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 28 28" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "facebook.com/werxmetal",
    href: "https://www.facebook.com/werxmetal",
    icon: (
      <BrandIcon>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </BrandIcon>
    ),
  },
];
