// The copy and photos on the home page. Like the service pages, it lives here
// in the code.
//
// The photos are free stock photos saved in public/images (see lib/photo.js).
// Each notes its source page. An image's alt text describes the photo for
// screen readers, and its title is the tooltip.
const unsplash = (id) => `/images/unsplash/${id}.jpg`;

// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
const excavator = unsplash("photo-1722695694560-f452b0919d3a");
const bale = unsplash("photo-1722695510527-cc033e43be1b");
const motorbikeParts = unsplash("photo-1723365316514-8509dea457f2");

export const homePage = {
  // "absolute" in app/page.jsx keeps the layout's "| Metal Werx" suffix off,
  // since this title already starts with the name.
  seo: {
    title: "Metal Werx | Scrap Metal Recycling & Cash for Cars",
    description:
      "Turn your scrap metal into cash. Metal Werx buys ferrous and non-ferrous metals, car bodies and batteries. Bring it to the yard, hire a bin or book a pickup.",
  },

  // The background photos take turns behind the copy.
  hero: {
    eyebrow: "Metal Werx Scrap Metal Recycling",
    title: "Turn Your Scrap Metal Into Cash",
    description:
      "We buy ferrous and non-ferrous metals, car bodies and batteries. Bring your scrap to the yard, hire a bin, or book a pickup.",
    primaryCta: { text: "Get a Quote", href: "/contact-us" },
    secondaryCta: { text: "What We Buy", href: "/what-we-buy" },
    backgroundImages: [
      {
        src: excavator,
        alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
        title: "Excavator sorting scrap metal",
      },
      {
        src: bale,
        alt: "A grapple holding a crushed bale of scrap metal against a blue sky",
        title: "Grapple lifting a bale of scrap",
      },
      {
        src: unsplash("photo-1536094627107-abf98dedaa8f"),
        alt: "A worker in a hard hat cutting up scrap metal with a gas torch as sparks fly",
        title: "Cutting up scrap metal with a torch",
      },
      {
        src: motorbikeParts,
        alt: "A pile of old motorbike parts, including brake shoes, switches and a speedometer",
        title: "Mixed scrap motorbike parts",
      },
    ],
  },

  // The scrolling band under the hero.
  ticker: [
    "Copper",
    "Brass",
    "Aluminium",
    "Stainless Steel",
    "Lead",
    "Electric Motors",
    "PVC Wire",
    "Aluminium Wheels",
    "Scrap Car Parts",
    "Scrap Machinery",
    "Unwanted Cars",
  ],

  whyUs: {
    heading: "Why Metal Werx",
    intro: "Selling scrap should be simple. Here is how we make it that way.",
    reasons: [
      {
        title: "We Buy It All",
        description:
          "Copper, brass, aluminium, stainless steel, lead, motors, wire, car parts, machinery and whole cars.",
        href: "/what-we-buy",
        image: {
          src: motorbikeParts,
          alt: "A pile of old motorbike parts, including brake shoes, switches and a speedometer",
          title: "Mixed scrap metal",
        },
      },
      {
        title: "We Come to You",
        description: "Book a pickup or hire a bin, and we collect the scrap from your home or site.",
        href: "/services/pickup-and-collection",
        image: {
          src: bale,
          alt: "A grapple holding a crushed bale of scrap metal against a blue sky",
          title: "Collecting scrap metal",
        },
      },
      {
        title: "Built for Business",
        description:
          "Regular collections and bins for workshops, builders, factories and other commercial customers.",
        href: "/services/commercial-recycling",
        image: {
          src: excavator,
          alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
          title: "Commercial scrap recycling",
        },
      },
    ],
  },

  // icon: handshake, truck, file-pen, recycle, car, factory, container or
  // phone (see app/components/index-commercial.jsx).
  commercial: {
    heading: "Commercial and Industrial Customers",
    intro: "We offer a range of services to make recycling your scrap more convenient and rewarding.",
    services: [
      { title: "Join Us", href: "/services/commercial-recycling", icon: "handshake" },
      { title: "Arrange a Pick Up", href: "/services/pickup-and-collection", icon: "truck" },
      { title: "Request a Bin", href: "/services/bin-hire", icon: "file-pen" },
    ],
  },

  // icon: phone, message, dollar, scale, truck, car, handshake or check (see
  // app/components/index-cash-for-cars.jsx).
  cashForCars: {
    heading: "Cash for Cars",
    subheading: "Get Top Dollar for Old Cars",
    body: "Got an old, damaged or unwanted car taking up space? We buy cars, utes, vans and trucks in any condition, running or not. Tell us what you have, we'll give you a fair price, and we'll tow it away for free. It's as simple as 1-2-3.",
    image: {
      src: unsplash("photo-1645216755684-c946ce202427"),
      alt: "An old rusty car sitting in long grass on a farm",
      title: "An old car ready for scrap",
    },
    steps: [
      {
        title: "Get in Touch",
        description: "Tell us the make, model and condition of your car.",
        points: ["Via website", "Via telephone", "Via email"],
        icon: "phone",
      },
      {
        title: "Get the Best Price",
        description: "We give you a fair offer for your car.",
        points: ["Top prices", "All makes and models", "Any condition"],
        icon: "dollar",
      },
      {
        title: "We Pick Up Your Car",
        description: "We tow it away for free and pay you on the spot.",
        points: ["Paid on the spot", "Quick removal", "Reliable service"],
        icon: "truck",
      },
    ],
    cta: { text: "Get a Free Quote", href: "/contact-us" },
  },

  faq: {
    heading: "Frequently Asked Questions",
    intro: "Can't find your answer here? Get in touch and we'll help.",
    questions: [
      {
        question: "What metals do you buy?",
        answer:
          "We buy ferrous and non-ferrous metals, including copper, brass, aluminium, stainless steel, lead, electric motors, PVC wire, aluminium wheels, car parts, machinery and whole cars.",
      },
      {
        question: "Do you pick up scrap?",
        answer:
          "Yes. We collect scrap from homes, workshops and commercial sites. Book a pickup and we come to you.",
      },
      {
        question: "Can I hire a bin for my scrap?",
        answer: "Yes. We drop off a bin, you fill it, and we collect it when it is full.",
      },
      {
        question: "Do you buy cars that don’t run?",
        answer:
          "Yes. We buy cars, utes, vans and trucks in any condition, running or not, and tow them away for free.",
      },
      {
        question: "How do I get a quote?",
        answer:
          "Contact us through the website, call 0470 131 025 or email info@metalwerx.com.au with what you have.",
      },
    ],
  },
};
