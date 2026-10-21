import {
  CalendarCheck,
  CalendarClock,
  Container,
  Factory,
  Forklift,
  Layers,
  ReceiptText,
  Repeat,
  Ruler,
  Scale,
  Tractor,
  Truck,
} from "lucide-react";

// The copy for /services and each service page, /services/<slug>. Like the
// About page, it lives here rather than in Strapi.
//
// What goes in a bin, what we collect, the weigh tickets and the delivery area
// are what a scrap yard typically offers. The yard should confirm they match
// how it actually works, as with the home page FAQ in Strapi. The payment and
// ID answers follow Victoria's Scrap Metal Dealers Act 2016, as that FAQ does.

// Free stock photos (Unsplash and Pexels licenses, no credit required). Each
// notes its source page. A url takes a width on the end (&w=1280), so a page
// can ask for the size it shows the photo at.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=70`;
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;

// "An excavator working on a pile of scrap metal", also in the home page hero
// and on the About page:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
export const overviewImage = {
  url: unsplash("photo-1722695694560-f452b0919d3a"),
  alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
  title: "Excavator sorting scrap metal",
};

// Each service:
//   slug       its page, /services/<slug>; a new service needs a folder of that
//              name with a page.jsx, like the others (see service-page.jsx)
//   anchor     its id on /services, where links from before the pages existed
//              (such as the home page's in Strapi) still land
//   title      the short name, for menus, cards and the breadcrumb
//   heading    the page's h1
//   summary    one line, for the cards linking to it
//   seo        { title, description }
//   image      the header photo, also on the cards
//   overview   { heading, paragraphs, features: [{ icon, title, text }] }
//   steps      { intro, items: [{ title, text }] }
//   details    { heading, intro, images: [main, inset], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   cta        the band at the foot: { heading, text, cta: { text, href } }
export const services = [
  {
    slug: "bin-hire",
    anchor: "bin-hire",
    title: "Bin Hire",
    heading: "Scrap Metal Bin Hire",
    icon: Container,
    summary: "Scrap bins dropped at your site and collected when full.",
    seo: {
      title: "Scrap Metal Bin Hire",
      description:
        "Hire a scrap metal bin from Metal Werx in Hallam. We drop it at your home, farm or worksite, collect it when it's full and pay you for the metal inside.",
    },
    lede: "Clearing out a shed, stripping a site or piling up offcuts? We'll drop a bin where you need it, collect it when it's full and pay you for the metal inside.",
    image: {
      // https://www.pexels.com/photo/rusty-blue-industrial-container-against-metal-wall-33842119/
      url: pexels(33842119),
      alt: "A long, rusty blue roll-off bin on brick paving in front of a dark corrugated metal wall",
      title: "Roll-off scrap bin",
    },
    overview: {
      heading: "A Bin Built for Scrap",
      paragraphs: [
        "A scrap bin keeps your metal in one place while you work, instead of scattered across the yard or piled up behind the shed. Load it at your own pace, then call us when it's full and we'll take it away or swap it for an empty one.",
        "Unlike a skip full of rubbish, a bin of scrap metal is worth something. We weigh every bin at our Hallam yard and pay you for the metal inside.",
      ],
      features: [
        {
          icon: Truck,
          title: "Dropped and collected",
          text: "We place the bin where you need it and pick it up when you call.",
        },
        {
          icon: Scale,
          title: "Weighed and paid",
          text: "Every bin is weighed at our yard, and you're paid for the metal by bank transfer.",
        },
        {
          icon: Repeat,
          title: "One-off or ongoing",
          text: "Hire a bin for a single clean-out, or keep one on site and swap it as it fills.",
        },
        {
          icon: Ruler,
          title: "Sized to the job",
          text: "Small bins for a garage clean-out, big ones for building and demolition sites.",
        },
      ],
    },
    steps: {
      intro: "From booking to getting paid, in four steps.",
      items: [
        {
          title: "Book a bin",
          text: "Tell us what you're clearing, roughly how much and where the bin should go, and we'll suggest a size.",
        },
        {
          title: "We drop it off",
          text: "We place the bin on firm, level ground, with room for our truck to get in and out.",
        },
        {
          title: "Fill it with metal",
          text: "Load scrap metal only, and keep out the things listed below.",
        },
        {
          title: "We collect and pay",
          text: "Call us when it's full. We take it to the yard, weigh it and pay you for the metal.",
        },
      ],
    },
    details: {
      heading: "What Can Go in the Bin",
      intro:
        "Our bins are for scrap metal only. Mixed metals are fine, though a clean, sorted load gets a better price. Anything that isn't metal, or isn't safe to handle, has to stay out.",
      images: [
        {
          // https://unsplash.com/photos/FmkuQgXzSoQ
          url: unsplash("photo-1758609554573-81474880be44"),
          alt: "A rusty wire cage bin packed with old aluminium road signs and steel poles against a block wall",
          title: "Bin of scrap signs and poles",
        },
        {
          // https://unsplash.com/photos/a-crane-is-lifting-a-container-onto-a-truck-b3M-o1I1uz8
          url: unsplash("photo-1723709525972-e5b1af84a839"),
          alt: "A hook-lift truck with its crane raised beside a row of green roll-off bins outside a recycling shed",
          title: "Hook-lift truck and bins",
        },
      ],
      lists: [
        {
          title: "Yes, please",
          items: [
            "Steel and iron: offcuts, beams, sheet and pipe",
            "Copper, brass and aluminium",
            "Stainless steel",
            "Roofing iron, fencing and guttering",
            "Old tools, machinery and car parts",
            "Washing machines, dryers and stoves",
          ],
        },
        {
          title: "Keep out",
          kind: "no",
          items: [
            "General rubbish, timber, plastic and green waste",
            "Gas bottles and aerosol cans",
            "Drums or tanks with fuel, oil or chemicals in them",
            "Fridges and air conditioners that still hold gas",
            "Asbestos, and anything contaminated with it",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about hiring a scrap bin.",
      questions: [
        {
          question: "How long can I keep the bin?",
          answer:
            "As long as the job takes. Some customers fill a bin in a day; others keep one on site for weeks and call us when it's full.",
        },
        {
          question: "Can the bin go on the street?",
          answer:
            "If it won't fit on your property, a bin on the road or nature strip usually needs a permit from your local council. Check with your council before you book, and we'll place the bin once it's approved.",
        },
        {
          question: "Can I mix different metals in one bin?",
          answer:
            "Yes. Mixed metal is fine, but clean, sorted metal gets a better price. If you have a lot of copper, brass or aluminium, ask us about keeping it separate.",
        },
        {
          question: "How do I get paid for the metal?",
          answer:
            "We weigh the bin at our yard and pay you by bank transfer, as scrap metal dealers in Victoria can't pay in cash. We'll need your photo ID and your BSB and account number.",
        },
        {
          question: "Where do you deliver bins?",
          answer:
            "From our yard in Hallam across Melbourne's south-east. If you're further out, get in touch and we'll let you know if we can help.",
        },
      ],
    },
    cta: {
      heading: "Need a Scrap Bin?",
      text: "Tell us about your job and we'll get a bin to you.",
      cta: { text: "Book a Bin", href: "/contact-us" },
    },
  },
  {
    slug: "pickup-and-collection",
    anchor: "collection",
    title: "Pickup & Collection",
    heading: "Scrap Metal Pickup & Collection",
    icon: Truck,
    summary: "Bulk scrap collected from homes, farms and businesses.",
    seo: {
      title: "Scrap Metal Pickup & Collection",
      description:
        "Book a scrap metal pickup from Metal Werx. We collect bulk scrap and old machinery from homes, farms and businesses across Melbourne's south-east, and pay you for the metal.",
    },
    lede: "Too much scrap for the ute, or too heavy to lift? We'll come to you, load it up and pay you for the metal.",
    image: {
      // https://www.pexels.com/photo/a-rusty-farm-machines-on-the-brown-grass-field-4953659/
      url: pexels(4953659),
      alt: "Rusty old farm implements, including a disc plough and a seeder with an iron seat, in a dry paddock beside an old gum tree",
      title: "Old farm machinery",
    },
    overview: {
      heading: "We Come to You",
      paragraphs: [
        "Not every load fits on a trailer. Old farm machinery, steel tanks, beams, a shed full of offcuts: we bring the truck and the gear to load it, so you don't have to.",
        "Tell us what you have and where it is, and we'll quote and book a time that suits. Everything we collect is weighed at our Hallam yard, and you're paid for the metal by bank transfer.",
      ],
      features: [
        {
          icon: Forklift,
          title: "We do the lifting",
          text: "Our crew and truck load heavy and awkward items, so you don't have to.",
        },
        {
          icon: Tractor,
          title: "Homes, farms and businesses",
          text: "From a backyard clean-up to a paddock full of old machinery.",
        },
        {
          icon: CalendarCheck,
          title: "Booked around you",
          text: "Pick a day that suits, and we'll fit in with your site.",
        },
        {
          icon: Scale,
          title: "Weighed and paid",
          text: "Your metal is weighed at the yard and paid for by bank transfer.",
        },
      ],
    },
    steps: {
      intro: "Getting rid of a big load takes one call.",
      items: [
        {
          title: "Tell us what you have",
          text: "Call or message us with what needs collecting, roughly how much and where it is. Photos help.",
        },
        {
          title: "Get a quote",
          text: "We'll give you a price for the metal and book a pickup time that suits you.",
        },
        {
          title: "We load it up",
          text: "Our crew arrives with the right truck, loads your scrap and takes it away.",
        },
        {
          title: "Get paid",
          text: "We weigh your metal at the yard and pay you by bank transfer.",
        },
      ],
    },
    details: {
      heading: "What We Collect",
      intro:
        "If it's metal and it's too big or heavy to bring in yourself, we can usually collect it. A little preparation makes the pickup quicker and safer.",
      images: [
        {
          // https://www.pexels.com/photo/industrial-scrap-metal-recycling-with-claw-crane-36397858/
          url: pexels(36397858),
          alt: "A crane's orange-peel grab dropping shredded scrap metal onto a pile beside open wagons",
          title: "Grab loading scrap metal",
        },
        {
          // https://unsplash.com/photos/a-white-truck-with-a-large-brown-container-is-parked-p2LQxI81DRM
          url: unsplash("photo-1756753142721-6017ff7b7e11"),
          alt: "A white truck with a tall steel body and a folded grapple crane parked in a concrete yard",
          title: "Grapple truck for collections",
        },
      ],
      lists: [
        {
          title: "We collect",
          items: [
            "Old farm machinery and implements",
            "Steel tanks, frames and trailers",
            "Dismantled sheds, fencing and roofing iron",
            "Steel beams, pipe and offcuts",
            "Washing machines, stoves and hot water systems",
            "Car bodies, engines and parts",
          ],
        },
        {
          title: "Before we arrive",
          items: [
            "Make sure our truck can get close to the scrap",
            "Empty and drain any tanks, drums or machinery",
            "Pull general rubbish out of the pile",
            "Have your photo ID and bank details ready",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about booking a pickup.",
      questions: [
        {
          question: "Is there a charge for collection?",
          answer:
            "It depends on how much metal there is, what it is and how far we have to travel. We'll tell you before we book the pickup, so there are no surprises.",
        },
        {
          question: "Do you collect from farms and rural properties?",
          answer:
            "Yes. We collect old machinery, implements, tanks, fencing and other farm scrap. Tell us what's there and how to get to it, and we'll bring the right truck.",
        },
        {
          question: "What do I need to have ready?",
          answer:
            "Clear access for our truck, plus your photo ID and bank details. Victorian law requires us to record the ID of everyone who sells us scrap, and we pay by bank transfer, not cash.",
        },
        {
          question: "Can you take an old car at the same time?",
          answer:
            "Yes. We buy cars, utes, vans and trucks in any condition, running or not, and tow them away for free. You'll need proof that you own the vehicle and photo ID.",
        },
        {
          question: "My load is small. Should I book a pickup?",
          answer:
            "If it fits in a car, ute or trailer, it's usually quickest to bring it to our Hallam yard yourself. For anything bigger, get in touch.",
        },
      ],
    },
    cta: {
      heading: "Got a Load to Shift?",
      text: "Tell us what you have and where it is, and we'll book a pickup.",
      cta: { text: "Book a Pickup", href: "/contact-us" },
    },
  },
  {
    slug: "commercial-recycling",
    anchor: "commercial",
    title: "Commercial Recycling",
    heading: "Commercial Scrap Metal Recycling",
    icon: Factory,
    summary: "Ongoing scrap removal for workshops, builders and manufacturers.",
    seo: {
      title: "Commercial Scrap Metal Recycling",
      description:
        "Ongoing scrap metal recycling for workshops, fabricators, builders and manufacturers in Melbourne's south-east. Bins on site, scheduled swaps and payment for every load.",
    },
    lede: "Regular scrap removal for workshops, fabricators, builders and manufacturers. We keep your site clear and pay you for the metal.",
    image: {
      // https://unsplash.com/photos/person-grinding-metal-beam-with-sparks-tXJhAFVOHVk
      url: unsplash("photo-1598302936625-6075fbd98dd7"),
      alt: "A worker in a welding helmet and leather gloves cuts a steel beam with an angle grinder, sending out a spray of sparks",
      title: "Grinding steel in a workshop",
    },
    overview: {
      heading: "Your Offcuts Are Worth Money",
      paragraphs: [
        "If your business turns out offcuts, swarf, old stock or worn-out equipment, that metal has value. We set you up with bins sized to your output and a pickup schedule that matches how fast you fill them.",
        "Every load is weighed at our Hallam yard and paid for by bank transfer, with a weigh ticket for your records. Keeping metals apart on site gets you a better price, and we'll help you set that up.",
      ],
      features: [
        {
          icon: Container,
          title: "Bins on site",
          text: "Bins placed where your team works, sized to how much metal you produce.",
        },
        {
          icon: CalendarClock,
          title: "Scheduled or on call",
          text: "Swaps on a set day each week, or whenever you call to say a bin's full.",
        },
        {
          icon: ReceiptText,
          title: "A ticket for every load",
          text: "Each load is weighed and ticketed, so you can track what you've recycled.",
        },
        {
          icon: Layers,
          title: "Sorted for better prices",
          text: "Separate bins for copper, brass, aluminium or stainless earn more than a mixed load.",
        },
      ],
    },
    steps: {
      intro: "We'll set up a service that fits your business.",
      items: [
        {
          title: "Talk to us",
          text: "Tell us which metals you produce, roughly how much, and how often.",
        },
        {
          title: "We set you up",
          text: "We drop off bins to suit your metals and your space, and agree a pickup schedule.",
        },
        {
          title: "We swap the bins",
          text: "Full bins are swapped for empty ones, so your team never has to stop work.",
        },
        {
          title: "You get paid",
          text: "Each load is weighed at our yard and paid for by bank transfer, with a weigh ticket.",
        },
      ],
    },
    details: {
      heading: "Who We Work With",
      intro:
        "Any business that produces scrap metal, from a one-person workshop to a factory floor. If you're not sure your metal is worth collecting, ask us.",
      images: [
        {
          // https://unsplash.com/photos/7k3IJac07RE
          url: unsplash("photo-1764114440880-9bdbfe570a4d"),
          alt: "Thick steel offcuts on an old machine bed, surrounded by curls of bright metal shavings",
          title: "Steel offcuts and swarf",
        },
        {
          // https://unsplash.com/photos/construction-site-with-debris-and-heavy-machinery-psyk9BBI-AU
          url: unsplash("photo-1776108508755-bf10282f9599"),
          alt: "A heap of rusty steel beams on a cleared demolition site, with skips and a boom lift nearby",
          title: "Demolition steel for recycling",
        },
      ],
      lists: [
        {
          title: "Industries",
          items: [
            "Metal fabricators and engineering shops",
            "Builders, demolition and fit-out crews",
            "Plumbers, electricians and air-con installers",
            "Mechanics, panel shops and wreckers",
            "Manufacturers and factories",
            "Farms and agricultural businesses",
          ],
        },
        {
          title: "Metals we take",
          items: [
            "Steel offcuts, sheet and structural",
            "Swarf and turnings, drained of oil",
            "Copper pipe, cable and busbar",
            "Brass fittings, valves and castings",
            "Aluminium extrusion, sheet and castings",
            "Stainless steel offcuts and fittings",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about recycling scrap from your business.",
      questions: [
        {
          question: "Do you work with small businesses?",
          answer:
            "Yes. Whether you're a one-person workshop or a large manufacturer, we'll set up bins and pickups to suit how much metal you produce.",
        },
        {
          question: "Can we have separate bins for different metals?",
          answer:
            "Yes, and it's worth doing. Clean, sorted metal gets a better price than a mixed load, so keeping copper, brass, aluminium and stainless steel apart from steel pays off.",
        },
        {
          question: "What if we only fill a bin now and then?",
          answer:
            "That's fine. Keep a bin on site and call us when it's full, instead of booking regular swaps.",
        },
        {
          question: "How are we paid?",
          answer:
            "By bank transfer, once each load is weighed. Scrap metal dealers in Victoria can't pay in cash.",
        },
        {
          question: "Do you provide paperwork for our records?",
          answer: "Yes. Every load comes with a weigh ticket showing the metal and its weight.",
        },
      ],
    },
    cta: {
      heading: "Let's Talk About Your Scrap",
      text: "Tell us what your business produces and we'll set up a service to match.",
      cta: { text: "Talk to Us", href: "/contact-us" },
    },
  },
];

export function getService(slug) {
  return services.find((service) => service.slug === slug);
}
