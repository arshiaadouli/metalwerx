import {
  BatteryFull,
  Cable,
  CarFront,
  Cog,
  CookingPot,
  Cylinder,
  Disc3,
  Layers,
  Tractor,
  Wrench,
  Zap,
} from "lucide-react";

// The copy for /what-we-buy and each material's page, /what-we-buy/<slug>.
// Like the service pages, it lives here rather than in Strapi.
//
// The grades, what we take and what has to stay out are how scrap yards
// typically grade and accept metal. The yard should confirm they match how it
// actually works (tyres, household batteries and lead-acid batteries that are
// cracked especially), as with the service pages. The payment and ID answers
// follow Victoria's Scrap Metal Dealers Act 2016, as the home page FAQ does.

// Free stock photos (Unsplash and Pexels licenses, no credit required). Each
// notes its source page. A url takes a width on the end (&w=1280), so a page
// can ask for the size it shows the photo at. The header photos are the
// navbar's thumbnails at full size.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=70`;
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;

// https://www.pexels.com/photo/metal-junkyard-under-the-sky-10628555/
export const overviewImage = {
  url: pexels(10628555),
  alt: "A large mound of mixed scrap metal in a recycling yard under a blue sky",
  title: "Scrap metal pile",
};

// Selling at the yard, for every material without steps of its own, and on
// /what-we-buy.
export const sellingSteps = {
  intro: "Selling scrap at our Hallam yard takes a few minutes.",
  items: [
    {
      title: "Bring it in",
      text: "Bring your scrap to our Hallam yard in the car, ute or trailer. For bigger loads, we can collect.",
    },
    {
      title: "We sort and weigh it",
      text: "We sort your metal by grade and weigh each grade on its own, so every kilo is paid at the right price.",
    },
    {
      title: "Show your ID",
      text: "Victorian law requires us to record photo ID from everyone who sells us scrap metal.",
    },
    {
      title: "Get paid",
      text: "We pay by bank transfer, as scrap metal dealers in Victoria can't pay in cash. Bring your BSB and account number.",
    },
  ],
};

const paymentQuestion = {
  question: "How do I get paid?",
  answer:
    "By bank transfer, once your metal is weighed. Scrap metal dealers in Victoria can't pay in cash, and we need to see your photo ID.",
};

// Each material:
//   slug       its page, /what-we-buy/<slug>; a new material needs a folder of
//              that name with a page.jsx, like the others (see material-page.jsx)
//   anchor    its id on /what-we-buy, where links from before the pages
//              existed still land
//   title      the short name, for menus, cards and the breadcrumb
//   heading    the page's h1
//   icon       in the pill above the h1
//   summary    one line, for the cards linking to it
//   seo        { title, description }
//   lede       under the h1
//   image      the header photo, also on the cards
//   overview   { heading, paragraphs, gradesTitle?, grades: [{ title, text }] };
//              gradesTitle defaults to "Grades We Buy"
//   steps?     { intro, items: [{ title, text }] }; defaults to sellingSteps
//   details    { heading, intro, images: [main, inset?], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   related    the slugs of three materials to suggest next
//   cta        the band at the foot: { heading, text, cta: { text, href } }
export const materials = [
  {
    slug: "copper",
    anchor: "copper",
    title: "Copper",
    heading: "Scrap Copper",
    icon: Cylinder,
    summary: "Pipe, wire, cable and offcuts.",
    seo: {
      title: "Scrap Copper",
      description:
        "Sell scrap copper pipe, wire and offcuts to Metal Werx in Hallam. We grade it, weigh it and pay by bank transfer, for homes, trades and businesses across Melbourne's south-east.",
    },
    lede: "Copper pays more per kilo than any other common scrap metal. Bring in your pipe, wire and offcuts, and we'll grade it, weigh it and pay you for every kilo.",
    // https://www.pexels.com/photo/close-up-photo-of-copper-wires-5279317/
    image: {
      url: pexels(5279317),
      alt: "A tangle of bright, bare copper wire, stripped of its insulation",
      title: "Scrap copper wire",
    },
    overview: {
      heading: "Clean Copper Pays Best",
      paragraphs: [
        "Copper is graded on how clean it is. Bare, bright wire is worth the most, clean pipe a little less, and copper with solder, paint, fittings or insulation less again. Sorting it before you come in can lift the price of the whole load.",
        "Plumbers, electricians and air-con installers bring us their offcuts, and so do homeowners clearing out a shed or renovating. A handful of pipe or a ute load, we'll weigh it and pay you for it.",
      ],
      grades: [
        {
          title: "Bright & Shiny",
          text: "Bare, uncoated copper wire with no solder, paint or tarnish. The top grade.",
        },
        {
          title: "Clean Pipe",
          text: "Copper pipe and offcuts with the fittings, solder and insulation removed.",
        },
        {
          title: "Mixed Copper",
          text: "Painted, soldered, tinned or tarnished copper, and pipe with a little solder left on.",
        },
        {
          title: "Copper with Attachments",
          text: "Pipe with brass fittings or steel still on. Cut the extras off for a better price.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "If it's copper, we'll take it, from a short offcut to a whole house's worth of pipe. A few minutes of sorting before you come in can lift the price.",
      images: [
        // https://www.pexels.com/photo/close-up-photo-of-metal-scraps-5279344/
        {
          url: pexels(5279344),
          alt: "A tangle of shiny copper strips and wire offcuts",
          title: "Copper strip and wire scrap",
        },
        // https://www.pexels.com/photo/copper-pipes-on-black-background-3721272/
        {
          url: pexels(3721272),
          alt: "Copper pipes joined with a tee fitting against a black background",
          title: "Copper pipe joint",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Copper pipe and tube",
            "Bare copper wire, busbar and earth strap",
            "Plumbing, roofing and air-con offcuts",
            "Copper hot water cylinders",
            "Copper sheet and flashing",
          ],
        },
        {
          title: "For a better price",
          items: [
            "Cut off brass fittings and steel brackets",
            "Keep bare wire apart from pipe",
            "Pull off insulation foam, plastic and tape",
            "Keep copper out of mixed loads of steel",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling scrap copper.",
      questions: [
        {
          question: "Should I strip insulated copper wire?",
          answer:
            "Only if it's thick. Stripped copper is worth more than wire with the insulation on, but thin cable takes a long time to strip for very little gain. We buy insulated cable as it is, as PVC wire. Never burn the insulation off: it's illegal, the smoke is toxic, and burnt wire is graded lower.",
        },
        {
          question: "Do you buy copper hot water cylinders?",
          answer:
            "Yes. Drain them, and take off the outer case if there is one. Fittings left on lower the grade, so cut them off if you can.",
        },
        {
          question: "Why was my copper paid at a lower grade?",
          answer:
            "Copper is graded on how clean it is. Solder, paint, fittings, insulation and corrosion all move it down a grade. Ask us and we'll show you what held your load back, so you know for next time.",
        },
        {
          question: "Do you buy copper from trades and businesses?",
          answer:
            "Yes. Plumbers, electricians and air-con installers sell us their offcuts all the time. If your business produces a lot of copper, ask us about a bin on site.",
        },
        paymentQuestion,
      ],
    },
    related: ["pvc-wire", "brass", "electric-motors"],
    cta: {
      heading: "Got Copper to Sell?",
      text: "Bring it to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "brass",
    anchor: "brass",
    title: "Brass",
    heading: "Scrap Brass",
    icon: Wrench,
    summary: "Taps, fittings, valves and keys.",
    seo: {
      title: "Scrap Brass",
      description:
        "Sell scrap brass taps, fittings, valves and keys to Metal Werx in Hallam. We grade it, weigh it and pay by bank transfer.",
    },
    lede: "Old taps, plumbing fittings, valves and keys add up. Brass is worth far more than steel, so keep it out of the general scrap and bring it to us.",
    // https://www.pexels.com/photo/pile-of-golden-screws-14593018/
    image: {
      url: pexels(14593018),
      alt: "A heap of small, shiny brass threaded fittings",
      title: "Brass threaded fittings",
    },
    overview: {
      heading: "Small Pieces, Good Money",
      paragraphs: [
        "Brass is mostly copper mixed with zinc, which is why it's worth so much more than steel. A bucket of old taps and fittings from a renovation or a plumber's van is well worth bringing in.",
        "Like copper, it's graded on how clean it is. Brass with steel, plastic or rubber attached is paid at a lower rate, so a few minutes with a screwdriver or a hacksaw can pay off.",
      ],
      grades: [
        {
          title: "Yellow Brass",
          text: "Taps, plumbing fittings, keys, door hardware and other common brass, free of steel and plastic.",
        },
        {
          title: "Red Brass",
          text: "Heavier, redder castings such as valves, water meter bodies and pump housings. Often called gunmetal.",
        },
        {
          title: "Brass Swarf",
          text: "Turnings and shavings from machining, kept dry and free of steel and oil.",
        },
        {
          title: "Brass with Attachments",
          text: "Brass with steel screws, plastic handles or rubber washers still on. Paid at a lower rate.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "Brass turns up all over the house, the workshop and the job site. A magnet helps: brass isn't magnetic, so if a magnet sticks, there's steel inside or it isn't brass.",
      images: [
        // https://www.pexels.com/photo/brass-plumbing-olive-compression-fittings-28179319/
        {
          url: pexels(28179319),
          alt: "A heap of shiny brass plumbing compression olives",
          title: "Brass compression fittings",
        },
        // https://www.pexels.com/photo/close-up-of-aged-brass-water-faucet-handle-33585897/
        {
          url: pexels(33585897),
          alt: "A worn, tarnished brass water tap with a cross-head handle",
          title: "Old brass tap",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Taps, mixers and shower fittings",
            "Plumbing fittings, valves and couplings",
            "Keys, locks and door hardware",
            "Water meters and pump bodies",
            "Garden hose fittings and sprinklers",
            "Brass swarf and machining offcuts",
          ],
        },
        {
          title: "For a better price",
          items: [
            "Unscrew steel screws and handles",
            "Pull off plastic and rubber washers",
            "Keep brass apart from copper",
            "Keep swarf dry and free of oil",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling scrap brass.",
      questions: [
        {
          question: "How can I tell if something is brass?",
          answer:
            "Brass is yellow to reddish gold, heavy for its size, and a magnet won't stick to it. If a magnet sticks, it's steel plated to look like brass, or there's steel inside.",
        },
        {
          question: "Do chrome-plated taps count as brass?",
          answer:
            "Many are brass underneath, but some cheaper taps are made of zinc alloy. We'll check yours when you bring them in. Take off the plastic handles and steel screws first.",
        },
        {
          question: "Is brass worth more than copper?",
          answer:
            "No. Brass is about two-thirds copper, so it pays less than clean copper but much more than steel. Keep the two apart, as a mixed load is paid at the lower price.",
        },
        paymentQuestion,
      ],
    },
    related: ["copper", "stainless-steel", "aluminium"],
    cta: {
      heading: "Got Brass to Sell?",
      text: "Bring it to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "aluminium",
    anchor: "aluminium",
    title: "Aluminium",
    heading: "Scrap Aluminium",
    icon: Layers,
    summary: "Cans, extrusions, sheet and castings.",
    seo: {
      title: "Scrap Aluminium",
      description:
        "Sell scrap aluminium to Metal Werx in Hallam: window frames, extrusions, sheet, castings and cans. Sorted, weighed and paid by bank transfer.",
    },
    lede: "Window frames, sheet, castings, boat parts and cans. Aluminium is light, but every kilo is worth far more than steel.",
    // https://unsplash.com/photos/crushed-assorted-beverage-cans-lot-k1tUxfs8JYY
    image: {
      url: unsplash("photo-1561503412-852800622772"),
      alt: "A bale of crushed aluminium drink cans in mixed colours",
      title: "Crushed aluminium cans",
    },
    overview: {
      heading: "Sorted by Type",
      paragraphs: [
        "Aluminium comes in a few grades, and the price depends on which one it is and how clean it is. Clean extrusion, such as window frames with the glass and rubber removed, pays best. Sheet, castings and cans each have their own price.",
        "If you're replacing windows, pulling down a pergola or clearing out an old boat or caravan, keep the aluminium apart from the steel and you'll be paid more for it.",
      ],
      grades: [
        {
          title: "Extrusion",
          text: "Window and door frames, flyscreen frames and other extruded sections, with glass, rubber and steel screws removed.",
        },
        {
          title: "Sheet",
          text: "Sheet, plate, roofing, cladding and signs.",
        },
        {
          title: "Cast Aluminium",
          text: "Engine heads, gearbox housings, lawn mower decks and other castings.",
        },
        {
          title: "Cans",
          text: "Drink cans, crushed or loose. Cans that are eligible for a CDS Vic refund are worth more there.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "Not sure it's aluminium? It's light, silver-grey and a magnet won't stick to it. Stainless steel looks similar but is much heavier.",
      images: [
        // https://unsplash.com/photos/92M96x-BE9s
        {
          url: unsplash("photo-1727372417003-3c227717b62c"),
          alt: "A red scrap bin filled with silver cast metal parts and offcuts",
          title: "Bin of cast aluminium scrap",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Window and door frames",
            "Sheet, plate and roofing",
            "Ladders, pergolas and boat parts",
            "Engine heads, gearboxes and other castings",
            "Alloy wheels",
            "Drink cans",
          ],
        },
        {
          title: "For a better price",
          items: [
            "Remove glass, rubber seals and flyscreen mesh",
            "Unscrew steel brackets and screws",
            "Keep extrusion, sheet and castings apart",
            "Drain oil from engine parts",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling scrap aluminium.",
      questions: [
        {
          question: "Should I bring my drink cans here?",
          answer:
            "Eligible drink cans earn a 10c refund each through CDS Vic, Victoria's container deposit scheme, which is far more than they're worth as scrap. We'll take cans that aren't eligible, along with your other aluminium.",
        },
        {
          question: "Do I need to take the glass out of window frames?",
          answer:
            "If you can. Clean frames with the glass, rubber and screws removed get the best price, and broken glass is a hazard in the yard.",
        },
        {
          question: "How can I tell aluminium from stainless steel?",
          answer:
            "Weight is the giveaway: aluminium is about a third as heavy as steel. A magnet usually won't stick to either, but stainless steel is much heavier for its size.",
        },
        paymentQuestion,
      ],
    },
    related: ["aluminium-wheels", "stainless-steel", "copper"],
    cta: {
      heading: "Got Aluminium to Sell?",
      text: "Bring it to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "aluminium-wheels",
    anchor: "aluminium-wheels",
    title: "Aluminium Wheels",
    heading: "Scrap Alloy Wheels",
    icon: Disc3,
    summary: "Alloy rims from cars, utes and trucks.",
    seo: {
      title: "Scrap Aluminium Wheels",
      description:
        "Sell old alloy wheels and rims to Metal Werx in Hallam. Car, ute and truck aluminium wheels, weighed and paid by bank transfer.",
    },
    lede: "Upgraded your rims, or got a stack of old alloys in the garage? Aluminium wheels are one of the cleanest grades of aluminium, and we'll pay you for every one.",
    // https://www.pexels.com/photo/wheel-mags-on-a-stand-5661682/
    image: {
      url: pexels(5661682),
      alt: "Rows of used alloy wheels in different spoke designs on yellow steel shelving",
      title: "Stacked alloy wheels",
    },
    overview: {
      heading: "Clean Wheels Pay More",
      paragraphs: [
        "Alloy wheels are cast from a high grade of aluminium, so they're worth more than most aluminium scrap, as long as they're clean. Tyres, wheel weights, valve stems and centre caps all count against the price.",
        "We buy them one at a time or by the pallet, from car and ute wheels to heavy truck rims. Tyre shops, wreckers and mechanics can ask us about regular pickups.",
      ],
      grades: [
        {
          title: "Clean Alloy Wheels",
          text: "Car and ute wheels with the tyre, weights, valve stem and centre cap removed. The best price.",
        },
        {
          title: "Dirty Alloy Wheels",
          text: "Wheels with weights, valve stems or other attachments still on. Paid at a lower rate.",
        },
        {
          title: "Truck Wheels",
          text: "Heavy aluminium rims from trucks, buses and trailers.",
        },
        {
          title: "Chrome-Plated Wheels",
          text: "Chrome-plated alloys are graded on their own, at a lower rate than painted wheels.",
        },
      ],
    },
    details: {
      heading: "Before You Bring Them In",
      intro:
        "A clean wheel gets the best price, so strip off anything that isn't aluminium. Steel wheels are welcome too, though they're paid as steel.",
      images: [
        // https://www.pexels.com/photo/aluminum-rim-on-a-pile-of-tires-6602921/
        {
          url: pexels(6602921),
          alt: "A polished multi-spoke alloy wheel leaning on a stack of car tyres",
          title: "Alloy rim on old tyres",
        },
        // https://www.pexels.com/photo/wheels-stacked-near-wall-16938867/
        {
          url: pexels(16938867),
          alt: "A gold mesh-style alloy wheel on a stack of tyres in front of a roller door",
          title: "Gold mesh alloy wheel",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Car and ute alloy wheels",
            "4WD and SUV wheels",
            "Truck, bus and trailer alloy rims",
            "Damaged, cracked or bent alloys",
            "Steel wheels, paid as steel",
          ],
        },
        {
          title: "Take off first",
          items: [
            "Tyres",
            "Wheel weights",
            "Valve stems and tyre pressure sensors",
            "Centre caps and wheel nuts",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling alloy wheels.",
      questions: [
        {
          question: "Do the tyres need to come off?",
          answer:
            "For the best price, yes. If you have wheels with the tyres still on, get in touch first and we'll let you know what we can do.",
        },
        {
          question: "Do you buy damaged or bent wheels?",
          answer:
            "Yes. Cracked, bent or kerbed wheels are worth the same as good ones, as we pay for the aluminium, not the wheel.",
        },
        {
          question: "What about the wheel weights?",
          answer:
            "Wheel weights can be lead, steel or zinc. Prise them off before you come in, and we'll buy the lead ones as lead.",
        },
        {
          question: "Do you buy steel wheels?",
          answer:
            "Yes, but they're paid as steel, which is worth much less than aluminium. A magnet will tell you which you've got: it sticks to steel, not aluminium.",
        },
        paymentQuestion,
      ],
    },
    related: ["aluminium", "scrap-car-parts", "lead"],
    cta: {
      heading: "Got Old Wheels?",
      text: "Bring them to our Hallam yard, or tell us how many you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "stainless-steel",
    anchor: "stainless-steel",
    title: "Stainless Steel",
    heading: "Scrap Stainless Steel",
    icon: CookingPot,
    summary: "Sinks, benches, tanks and offcuts.",
    seo: {
      title: "Scrap Stainless Steel",
      description:
        "Sell scrap stainless steel to Metal Werx in Hallam: sinks, benches, tanks, pipe and offcuts. Graded, weighed and paid by bank transfer.",
    },
    lede: "Old sinks, kitchen benches, tanks and fabrication offcuts. Stainless steel pays far more than ordinary steel, so it's worth keeping separate.",
    // https://www.pexels.com/photo/container-of-short-stainless-steel-pipes-with-milled-ends-12951634/
    image: {
      url: pexels(12951634),
      alt: "A blue bin heaped with short stainless steel pipe offcuts",
      title: "Stainless steel offcuts",
    },
    overview: {
      heading: "Not All Stainless Is Equal",
      paragraphs: [
        "Most stainless steel in kitchens, bathrooms and food and dairy equipment is grade 304 or 316. Both contain nickel and chromium, which is why they're worth so much more than ordinary steel.",
        "Cheaper magnetic stainless, found in some appliances, cutlery and exhausts, is graded on its own at a lower price. We sort it with a magnet, so you're paid for what you actually have.",
      ],
      grades: [
        {
          title: "304 Stainless",
          text: "Sinks, benches, splashbacks, kitchen equipment and most offcuts. Non-magnetic.",
        },
        {
          title: "316 Stainless",
          text: "Marine fittings, and dairy, chemical and food-processing equipment. Pays more than 304.",
        },
        {
          title: "Magnetic Stainless",
          text: "400-series stainless from some appliances, cutlery and exhausts. Paid at a lower rate.",
        },
        {
          title: "Stainless with Attachments",
          text: "Tanks and equipment with steel frames, motors or plastic still on. Paid at a lower rate until stripped.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "If it's stainless, we'll take it, from a single sink to a commercial kitchen fit-out. The magnet test is a good guide: a magnet barely sticks, if at all, to the better grades.",
      images: [
        // https://unsplash.com/photos/a-stainless-steel-kitchen-with-a-sink-and-oven-Kyqu9GSsV9Q
        {
          url: unsplash("photo-1671656200343-d2a322492223"),
          alt: "A stainless steel sink and hand basin under stainless steel cupboards in a commercial kitchen",
          title: "Stainless steel commercial sinks",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Sinks, tubs and splashbacks",
            "Benches, shelving and kitchen equipment",
            "Tanks, vats and dairy equipment",
            "Pipe, tube, sheet and offcuts",
            "Balustrades, handrails and wire",
            "Boat fittings and marine hardware",
          ],
        },
        {
          title: "For a better price",
          items: [
            "Remove steel frames, legs and brackets",
            "Take off motors, plastic and rubber",
            "Empty and clean out tanks",
            "Keep magnetic stainless separate",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling scrap stainless steel.",
      questions: [
        {
          question: "How can I tell if it's stainless steel?",
          answer:
            "It's shiny, doesn't rust easily and is heavy for its size. On the common 304 and 316 grades, a magnet barely sticks, if at all. If a magnet grabs it hard, it's magnetic stainless or plated steel.",
        },
        {
          question: "Do you buy whole commercial kitchens?",
          answer:
            "Yes. Benches, sinks, shelving and equipment from a restaurant or café fit-out are all welcome. For a big job, we can collect.",
        },
        {
          question: "Is stainless steel worth more than steel?",
          answer:
            "Much more, thanks to the nickel and chromium in it. Keep it out of your steel pile so it's paid at the stainless price.",
        },
        paymentQuestion,
      ],
    },
    related: ["brass", "aluminium", "scrap-machinery"],
    cta: {
      heading: "Got Stainless to Sell?",
      text: "Bring it to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "lead",
    anchor: "lead",
    title: "Lead",
    heading: "Scrap Lead & Batteries",
    icon: BatteryFull,
    summary: "Batteries, flashing and wheel weights.",
    seo: {
      title: "Scrap Lead & Car Batteries",
      description:
        "Sell scrap lead and old car batteries to Metal Werx in Hallam: lead-acid batteries, flashing, sheet and wheel weights. Weighed and paid by bank transfer.",
    },
    lede: "Old car, truck and boat batteries, roof flashing and wheel weights. Lead is heavy, so it adds up fast, and lead-acid batteries are among the most recycled products there are.",
    // https://unsplash.com/photos/rows-of-batteries-with-red-and-blue-terminals-CH7kRmyBQ4I
    image: {
      url: unsplash("photo-1742899273038-67ff67477663"),
      alt: "Close-up of rows of industrial battery cells with red and blue terminal caps",
      title: "Industrial battery cells",
    },
    overview: {
      heading: "Don't Bin Your Battery",
      paragraphs: [
        "A car battery is mostly lead, and it doesn't belong in the bin: lead and battery acid are harmful in landfill. We buy old lead-acid batteries from cars, trucks, boats, tractors and forklifts and send them for recycling.",
        "We also buy soft lead, such as roof flashing, sheet and pipe, and lead wheel weights. Lead is heavy, so even a small amount is worth bringing in.",
      ],
      grades: [
        {
          title: "Lead-Acid Batteries",
          text: "Car, truck, boat, tractor and forklift batteries, whole and upright.",
        },
        {
          title: "Soft Lead",
          text: "Roof flashing, sheet, pipe and other clean lead.",
        },
        {
          title: "Wheel Weights",
          text: "Lead balance weights, with or without their steel clips.",
        },
        {
          title: "Mixed Lead",
          text: "Lead with solder, steel, paint or other metals attached. Paid at a lower rate.",
        },
      ],
    },
    details: {
      heading: "Bringing In Batteries",
      intro:
        "Lead-acid batteries are safe to carry when they're whole and upright. Lithium batteries are another story: they can catch fire when they're crushed, so they can't go anywhere near the scrap.",
      images: [
        // https://unsplash.com/photos/close-up-of-a-car-battery-with-wires-connected-E4Oz0TZUDe8
        {
          url: unsplash("photo-1765211003026-f7666ea3a948"),
          alt: "A black lead-acid car battery with its cables connected, mounted in a car",
          title: "Lead-acid car battery",
        },
        // https://www.pexels.com/photo/close-up-of-car-battery-in-engine-bay-37177070/
        {
          url: pexels(37177070),
          alt: "An orange car battery in a dark engine bay",
          title: "Car battery in engine bay",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Car, ute and truck batteries",
            "Lead-acid deep-cycle and marine batteries",
            "Tractor, forklift and machinery batteries",
            "Lead flashing, sheet and pipe",
            "Wheel weights",
            "Dive weights and fishing sinkers",
          ],
        },
        {
          title: "Keep out",
          kind: "no",
          items: [
            "Lithium and lithium-ion batteries",
            "Phone, laptop and power tool batteries",
            "E-bike and e-scooter batteries",
            "Household AA, AAA and 9V batteries",
            "Cracked or leaking batteries: call us first",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling lead and batteries.",
      questions: [
        {
          question: "Do you take lithium batteries?",
          answer:
            "No. Lithium and lithium-ion batteries, from phones, laptops, power tools, e-bikes and scooters, can start fires when they're damaged, so they can't go in with scrap metal. B-cycle drop-off points, at many supermarkets and hardware stores, take them for recycling.",
        },
        {
          question: "Should I drain the acid from a battery?",
          answer:
            "No. Bring batteries in whole, with the caps on and the acid inside. Battery acid is corrosive, and spilling it is dangerous for you and the environment.",
        },
        {
          question: "How should I carry an old battery?",
          answer:
            "Upright, in a tub or tray in the boot or the back of the ute, so it can't tip over. Cover the terminals if they might touch metal.",
        },
        {
          question: "Is lead dangerous to handle?",
          answer:
            "Lead can be harmful if it's swallowed or breathed in as dust or fumes. Wear gloves, don't eat while you're handling it, and wash your hands afterwards.",
        },
        paymentQuestion,
      ],
    },
    related: ["scrap-car-parts", "aluminium-wheels", "copper"],
    cta: {
      heading: "Got Old Batteries?",
      text: "Bring them to our Hallam yard, whole and upright, and we'll pay you for the lead.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "pvc-wire",
    anchor: "pvc-wire",
    title: "PVC Wire",
    heading: "Scrap PVC Wire & Cable",
    icon: Cable,
    summary: "Insulated copper and household cable.",
    seo: {
      title: "Scrap PVC Wire & Cable",
      description:
        "Sell insulated copper wire and cable to Metal Werx in Hallam: household cable, power leads and heavy cable. Graded, weighed and paid by bank transfer.",
    },
    lede: "Offcuts from a rewire, old extension leads, appliance cords and heavy power cable. You don't need to strip it: we buy insulated wire as it is.",
    // https://unsplash.com/photos/a-colorful-bundle-of-electrical-wires-on-a-light-background-Sbxf5Dbyerk
    image: {
      url: unsplash("photo-1761507320645-b11a00bfcc34"),
      alt: "Loose lengths of thin insulated wire in many colours on a white background",
      title: "Insulated electrical wire",
    },
    overview: {
      heading: "Graded by the Copper Inside",
      paragraphs: [
        "Insulated wire is graded by how much copper is inside the plastic. Thick power cable is mostly copper and pays well. Thin wire, like data cable and appliance cords, is mostly plastic and pays less.",
        "Electricians, data cablers and builders bring us their offcuts, and so do homeowners after a renovation. Keep the different types apart and cut off the plugs, and you'll get a better price for the lot.",
      ],
      grades: [
        {
          title: "Heavy Cable",
          text: "Thick single and multi-core power cable, mains and welding cable. The most copper per kilo.",
        },
        {
          title: "Household Cable",
          text: "TPS and building wire offcuts from rewires and renovations.",
        },
        {
          title: "Light Wire",
          text: "Extension leads, appliance cords, data and phone cable, and car wiring looms.",
        },
        {
          title: "Wire with Attachments",
          text: "Cable with plugs, sockets, lugs or connectors still on. Paid at a lower rate.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "If it's copper wire with plastic or rubber around it, we'll take it. Leave the stripping to us, but please don't burn it.",
      images: [
        // https://www.pexels.com/photo/close-up-shot-of-black-wires-9754820/
        {
          url: pexels(9754820),
          alt: "A large tangled pile of black insulated electrical cable in a workshop",
          title: "Pile of scrap cable",
        },
        // https://www.pexels.com/photo/green-red-and-yellow-coated-wires-5090637/
        {
          url: pexels(5090637),
          alt: "Coils of red, yellow, black, brown and pale blue electrical cable on a bench, one with its plug still on",
          title: "Coloured insulated wire",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Building wire and TPS cable",
            "Power cable and mains",
            "Extension leads and appliance cords",
            "Data, phone and coaxial cable",
            "Car and machinery wiring looms",
            "Welding and battery cable",
          ],
        },
        {
          title: "For a better price",
          items: [
            "Cut off plugs, sockets and lugs",
            "Keep heavy cable apart from light wire",
            "Pull out steel, cable ties and tape",
            "Never burn off the insulation",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling insulated wire.",
      questions: [
        {
          question: "Should I strip the wire myself?",
          answer:
            "Thick cable can be worth stripping, as bare copper pays more than insulated wire. Thin wire usually isn't worth the time, so bring it in as it is.",
        },
        {
          question: "Can I burn the plastic off?",
          answer:
            "No. Burning cable is illegal in Victoria, gives off toxic smoke, and leaves copper that's graded lower than clean stripped wire.",
        },
        {
          question: "Do I need to sort my wire?",
          answer:
            "No, but it pays. A mixed bag is usually paid at a lower grade, so keeping heavy cable apart from thin cords gets you more for both.",
        },
        paymentQuestion,
      ],
    },
    related: ["copper", "electric-motors", "brass"],
    cta: {
      heading: "Got Wire to Sell?",
      text: "Bring it to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "electric-motors",
    anchor: "electric-motors",
    title: "Electric Motors",
    heading: "Scrap Electric Motors",
    icon: Zap,
    summary: "Motors, alternators and starters.",
    seo: {
      title: "Scrap Electric Motors",
      description:
        "Sell scrap electric motors, alternators and starter motors to Metal Werx in Hallam. Weighed and paid by bank transfer, with no stripping needed.",
    },
    lede: "Burnt-out pump motors, old alternators and starter motors, compressor and machinery motors. They're full of copper windings, so they're worth more than plain steel.",
    // https://unsplash.com/photos/gray-ac-motor-2MLhOfRL_hI
    image: {
      url: unsplash("photo-1563456020111-f02d832ae94c"),
      alt: "A rusty grey electric motor bolted to green machinery in an old factory",
      title: "Old electric motor",
    },
    overview: {
      heading: "Copper Inside",
      paragraphs: [
        "An electric motor is a steel or aluminium case wrapped around copper windings. That copper is why motors have their own price, well above steel, and why you shouldn't throw them in with the rest of your scrap.",
        "There's no need to pull them apart. Drain any oil, bring them in whole, and we'll weigh them and pay for them as motors.",
      ],
      grades: [
        {
          title: "Electric Motors",
          text: "Motors from pumps, compressors, machinery, fans and appliances.",
        },
        {
          title: "Alternators",
          text: "Car, truck and machinery alternators, whole.",
        },
        {
          title: "Starter Motors",
          text: "Starters from cars, trucks, tractors and boats.",
        },
        {
          title: "Sealed Units",
          text: "Fridge and air-con compressors, once the gas has been removed by a licensed technician.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "Big or small, working or burnt out, we'll take it. We pay for the metal, so it makes no difference whether a motor still runs.",
      images: [
        // https://www.pexels.com/photo/industrial-motor-on-wooden-surface-in-workshop-34194564/
        {
          url: pexels(34194564),
          alt: "A grey industrial electric gear motor on a wooden workbench",
          title: "Industrial electric motor",
        },
        // https://www.pexels.com/photo/man-fixing-a-car-alternator-16048266/
        {
          url: pexels(16048266),
          alt: "A tradesman at a workshop bench holding an open electric motor casing, its copper windings exposed",
          title: "Rewinding an electric motor",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Pump and pool motors",
            "Machinery and workshop motors",
            "Alternators and starter motors",
            "Washing machine and appliance motors",
            "Power tool and fan motors",
            "Fridge and air-con compressors, degassed",
          ],
        },
        {
          title: "Before you come in",
          items: [
            "Drain oil from gearboxes and pumps",
            "Take the batteries out of power tools",
            "Have compressors degassed by a licensed technician",
            "Cut off long power leads and sell them as wire",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling electric motors.",
      questions: [
        {
          question: "Do I need to strip the copper out?",
          answer:
            "No. Motors are bought whole, at their own price. Pulling the copper out takes hours and is rarely worth it for small motors.",
        },
        {
          question: "Do you buy motors that don't work?",
          answer: "Yes. We pay for the metal, so it makes no difference whether a motor runs.",
        },
        {
          question: "Can I bring in a whole fridge or air conditioner?",
          answer:
            "Only once a licensed technician has removed the refrigerant gas. It's illegal to release it, so we can't take fridges or air-con units that still hold gas.",
        },
        paymentQuestion,
      ],
    },
    related: ["copper", "pvc-wire", "scrap-machinery"],
    cta: {
      heading: "Got Old Motors?",
      text: "Bring them to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "scrap-car-parts",
    anchor: "car-parts",
    title: "Scrap Car Parts",
    heading: "Scrap Car Parts",
    icon: Cog,
    summary: "Engines, gearboxes, radiators and more.",
    seo: {
      title: "Scrap Car Parts",
      description:
        "Sell scrap car parts to Metal Werx in Hallam: engines, gearboxes, radiators, brake discs, batteries and alloy wheels. Sorted, weighed and paid by bank transfer.",
    },
    lede: "Pulled an engine, swapped a gearbox or cleared out the shed after a project car? Engines, gearboxes, radiators and other parts are worth more sorted than thrown in with steel.",
    // https://unsplash.com/photos/pile-of-old-car-engines-and-parts-G-Fno_v4alo
    image: {
      url: unsplash("photo-1767340078189-4258fbb7bd7c"),
      alt: "Used car engines piled together, still fitted with their hoses and wiring",
      title: "Old car engines and parts",
    },
    overview: {
      heading: "Sorted Parts Pay More",
      paragraphs: [
        "A car is made of many metals. Engine blocks and brake discs are mostly cast iron, heads and gearbox cases are often aluminium, radiators are copper, brass or aluminium, and the battery is lead. Each one has its own price.",
        "Mechanics, wreckers and home restorers all bring us parts. Drain the fluids, keep the parts apart, and you'll be paid for what each one is worth.",
      ],
      gradesTitle: "Parts We Buy",
      grades: [
        {
          title: "Engines & Gearboxes",
          text: "Whole engines, gearboxes and diffs, drained of oil and fuel.",
        },
        {
          title: "Radiators",
          text: "Copper-brass and aluminium radiators, heater cores and intercoolers, each with its own price.",
        },
        {
          title: "Cast Iron",
          text: "Brake discs and drums, engine blocks, exhaust manifolds and other heavy castings.",
        },
        {
          title: "Steel Parts",
          text: "Panels, chassis rails, exhausts, springs and other mixed steel.",
        },
      ],
    },
    details: {
      heading: "What We Buy",
      intro:
        "Bring in a single part or a trailer full from the workshop. Draining the fluids first keeps the yard clean and gets you a better price.",
      images: [
        // https://www.pexels.com/photo/storage-of-used-machinery-16135855/
        {
          url: pexels(16135855),
          alt: "Old, grimy engines lined up on wooden pallets on a shed floor",
          title: "Used car engines",
        },
        // https://www.pexels.com/photo/top-view-of-a-pile-of-junk-21470313/
        {
          url: pexels(21470313),
          alt: "A tangled heap of rusty engine parts and a radiator in a wrecking yard",
          title: "Heap of rusty car parts",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Engines, gearboxes and diffs",
            "Radiators, heater cores and intercoolers",
            "Brake discs, drums and calipers",
            "Alternators and starter motors",
            "Alloy wheels and steel rims",
            "Car batteries",
          ],
        },
        {
          title: "Keep out",
          kind: "no",
          items: [
            "Oil, fuel and coolant: drain them first",
            "Airbags and seatbelt pretensioners that haven't gone off",
            "LPG tanks and gas bottles",
            "Tyres, plastic trim and upholstery",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling scrap car parts.",
      questions: [
        {
          question: "Do I need to drain the oil?",
          answer:
            "Yes. Drain the oil, fuel and coolant before you come in. They're hazardous waste, and parts that still hold them can't go in with the scrap.",
        },
        {
          question: "Are radiators worth keeping separate?",
          answer:
            "Yes. Copper-brass radiators are worth much more than steel, and aluminium radiators have their own price too. Drain the coolant and cut off steel brackets first.",
        },
        {
          question: "Can you take the rest of the car too?",
          answer:
            "Yes. We buy cars, utes, vans and trucks in any condition, running or not, and tow them away for free.",
        },
        paymentQuestion,
      ],
    },
    related: ["unwanted-cars", "aluminium-wheels", "lead"],
    cta: {
      heading: "Got Parts to Sell?",
      text: "Bring them to our Hallam yard, or tell us what you've got and we'll give you a price.",
      cta: { text: "Get a Price", href: "/contact-us" },
    },
  },
  {
    slug: "scrap-machinery",
    anchor: "machinery",
    title: "Scrap Machinery",
    heading: "Scrap Machinery",
    icon: Tractor,
    summary: "Old farm, factory and workshop equipment.",
    seo: {
      title: "Scrap Machinery",
      description:
        "Sell old farm, factory and workshop machinery for scrap to Metal Werx. We collect heavy machinery across Melbourne's south-east and pay you for the metal.",
    },
    lede: "Old tractors, implements, lathes, compressors and machinery that's had its day. Bring it in, or we'll come and collect it, and we'll pay you for the metal.",
    // https://unsplash.com/photos/old-industrial-machinery-with-rust-and-debris-BpBT7i3JnoM
    image: {
      url: unsplash("photo-1776254575132-fbc8f3d50210"),
      alt: "A rusting, disused industrial plant with steel stairs and railings against a wooded hill",
      title: "Old rusty machinery",
    },
    overview: {
      heading: "Paid by the Tonne",
      paragraphs: [
        "Machinery is heavy, and most of that weight is steel and cast iron. Motors, copper wiring, brass fittings and aluminium parts are worth more again, so if you have time to take them off, you'll be paid more for them.",
        "Most old machinery is too big for a trailer, so we'll come to you with a truck and the gear to load it. Tell us what you have, where it is and how to get to it.",
      ],
      gradesTitle: "Machinery We Buy",
      grades: [
        {
          title: "Farm Machinery",
          text: "Tractors, ploughs, slashers, balers, harrows and other implements.",
        },
        {
          title: "Factory & Workshop",
          text: "Lathes, presses, compressors, generators, welders and racking.",
        },
        {
          title: "Heavy Cast Iron",
          text: "Engine blocks, machine bases, flywheels and other thick castings.",
        },
        {
          title: "Mixed Steel",
          text: "Frames, tanks, trailers and machinery with attachments still on.",
        },
      ],
    },
    steps: {
      intro: "Big or small, getting old machinery gone is simple.",
      items: [
        {
          title: "Tell us what you have",
          text: "Send us photos, rough sizes and where it is. Let us know if anything is bolted down or hard to reach.",
        },
        {
          title: "Get a quote",
          text: "We'll give you a price for the metal and book a pickup time that suits you.",
        },
        {
          title: "We collect it",
          text: "Our crew brings the right truck and loads it. Smaller pieces you can bring to our Hallam yard yourself.",
        },
        {
          title: "Get paid",
          text: "We weigh the metal at the yard and pay you by bank transfer.",
        },
      ],
    },
    details: {
      heading: "Getting It Ready",
      intro:
        "We take machinery whole or in pieces. A bit of preparation makes the pickup quicker and safer, and taking off the valuable parts gets you more for them.",
      images: [
        // https://unsplash.com/photos/brown-tractor-T0BqG4PnUdg
        {
          url: unsplash("photo-1575704497240-17622d90265f"),
          alt: "A weathered, rusty farm tractor parked beside an open-sided shed",
          title: "Rusty old tractor",
        },
        // https://unsplash.com/photos/an-old-bulldozer-sitting-on-the-side-of-a-dirt-road-9TmqJ0m_sSE
        {
          url: unsplash("photo-1697534444242-ddc344579636"),
          alt: "A rusty yellow crawler bulldozer with a glass cab, left on a grassy clifftop above the sea",
          title: "Abandoned rusty bulldozer",
        },
      ],
      lists: [
        {
          title: "We buy",
          items: [
            "Tractors and farm implements",
            "Lathes, mills and presses",
            "Compressors, generators and welders",
            "Pumps, motors and gearboxes",
            "Conveyors, racking and frames",
            "Old trailers, tanks and silos",
          ],
        },
        {
          title: "Before we collect",
          items: [
            "Drain oil, fuel and hydraulic fluid",
            "Take out gas bottles and batteries",
            "Clear away rubbish, timber and tyres",
            "Make sure our truck can get close",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about scrapping old machinery.",
      questions: [
        {
          question: "Can you collect machinery from my farm?",
          answer:
            "Yes. We collect from farms and rural properties across Melbourne's south-east. Tell us what's there and how to get to it, and we'll bring the right truck.",
        },
        {
          question: "Does machinery need to be cut up first?",
          answer:
            "No. We can take most machinery whole. If something is too big to lift in one piece, we'll talk to you about the best way to handle it.",
        },
        {
          question: "Do you buy machinery that still works?",
          answer:
            "We pay scrap prices, by weight. If a machine still runs and is worth something second-hand, you'll usually get more by selling it as it is.",
        },
        {
          question: "What about the oil and fuel?",
          answer:
            "Drain oil, fuel and hydraulic fluid before the pickup if you can. If you can't, tell us when you book, so we can plan for it.",
        },
        paymentQuestion,
      ],
    },
    related: ["electric-motors", "scrap-car-parts", "stainless-steel"],
    cta: {
      heading: "Got Old Machinery?",
      text: "Tell us what you have and where it is, and we'll arrange a pickup.",
      cta: { text: "Book a Pickup", href: "/contact-us" },
    },
  },
  {
    slug: "unwanted-cars",
    anchor: "cars",
    title: "Unwanted Cars",
    heading: "We Buy Unwanted Cars",
    icon: CarFront,
    summary: "Cars, utes and trucks, running or not.",
    seo: {
      title: "Sell Your Unwanted Car",
      description:
        "Sell your old, damaged or unregistered car, ute, van or truck to Metal Werx. Running or not, we tow it away for free and pay by bank transfer.",
    },
    lede: "Old, damaged, unregistered or just not worth fixing? We buy cars, utes, vans and trucks in any condition, tow them away for free and pay you by bank transfer.",
    // https://unsplash.com/photos/a-bunch-of-cars-that-are-sitting-in-the-dirt-GcBoM7B40Ck
    image: {
      url: unsplash("photo-1719242513425-f5eed99b282f"),
      alt: "An overgrown wrecking yard with old cars behind a wire fence and a green sedan out front",
      title: "Old cars in a junkyard",
    },
    overview: {
      heading: "Any Car, Any Condition",
      paragraphs: [
        "A car that's not worth fixing is still worth its weight in metal. Whether it's been in an accident, failed a roadworthy, stopped running years ago or is just taking up the driveway, we'll make you an offer.",
        "We tow it away for free and pay you once the paperwork is done. All we need is proof that it's yours and your photo ID.",
      ],
      gradesTitle: "Vehicles We Buy",
      grades: [
        {
          title: "Cars",
          text: "Sedans, hatches and wagons of any make and any age.",
        },
        {
          title: "Utes, Vans & 4WDs",
          text: "Work utes, vans, people movers and four-wheel drives.",
        },
        {
          title: "Trucks",
          text: "Light trucks, tippers and other commercial vehicles.",
        },
        {
          title: "Wrecks & Non-Runners",
          text: "Crashed, flood-damaged, rusted out or stripped for parts.",
        },
      ],
    },
    steps: {
      intro: "Selling your car to us takes one call.",
      items: [
        {
          title: "Tell us about it",
          text: "Give us the make, model, condition and where it is. Photos help.",
        },
        {
          title: "Get an offer",
          text: "We'll give you a price and book a pickup time that suits you.",
        },
        {
          title: "Free tow",
          text: "Our tow truck collects it, running or not, from your driveway, street or yard.",
        },
        {
          title: "Get paid",
          text: "Once we've checked your ID and proof of ownership, we pay you by bank transfer.",
        },
      ],
    },
    details: {
      heading: "What You'll Need",
      intro:
        "Selling a car takes a little more paperwork than a load of scrap. Have these ready and the pickup will be quick.",
      images: [
        // https://www.pexels.com/photo/stacked-abandoned-cars-in-a-junkyard-outdoors-35503911/
        {
          url: pexels(35503911),
          alt: "Stripped car bodies stacked on steel racks above rows of car doors in a wrecking yard",
          title: "Stacked car wrecks",
        },
        // https://www.pexels.com/photo/dumped-cars-on-the-grass-field-12902781/
        {
          url: pexels(12902781),
          alt: "Rows of crushed and stacked scrap cars in an outdoor junkyard",
          title: "Junkyard car stacks",
        },
      ],
      lists: [
        {
          title: "Have ready",
          items: [
            "Proof of ownership, such as the registration papers",
            "Your photo ID",
            "Your BSB and account number",
            "The keys, if you still have them",
          ],
        },
        {
          title: "Before we tow",
          items: [
            "Take out your belongings",
            "Remove the number plates and toll tag",
            "Cancel the rego with VicRoads, if it's registered",
            "Tell us if it's missing wheels or can't roll",
          ],
        },
      ],
    },
    faq: {
      intro: "Common questions about selling your car.",
      questions: [
        {
          question: "Does the car need to be running?",
          answer:
            "No. We buy cars in any condition, running or not, including crashed, rusted and stripped cars.",
        },
        {
          question: "Do you charge for towing?",
          answer: "No. We tow your car away for free.",
        },
        {
          question: "What paperwork do I need?",
          answer:
            "Proof that the car is yours, such as the registration papers or a receipt, and your photo ID. Victorian law requires us to record who we buy from.",
        },
        {
          question: "What if I've lost the paperwork?",
          answer:
            "We need to be sure the car is yours, so get in touch and we'll talk through what you have.",
        },
        {
          question: "How do I get paid?",
          answer:
            "By bank transfer, once the car is collected and the paperwork is checked. Scrap metal dealers in Victoria can't pay in cash.",
        },
      ],
    },
    related: ["scrap-car-parts", "aluminium-wheels", "lead"],
    cta: {
      heading: "Got a Car to Sell?",
      text: "Tell us what it is and where it is, and we'll make you an offer.",
      cta: { text: "Get an Offer", href: "/contact-us" },
    },
  },
];

// The two groups on /what-we-buy, in order. The ids are where the footer's
// Ferrous and Non-Ferrous links land.
export const groups = [
  {
    id: "non-ferrous",
    title: "Non-Ferrous & Stainless",
    intro:
      "Copper, brass, aluminium, lead and stainless steel pay more per kilo than steel and iron, and so do the wire, motors and wheels made from them. Clean, sorted metal gets the best price.",
    slugs: [
      "copper",
      "brass",
      "aluminium",
      "aluminium-wheels",
      "stainless-steel",
      "lead",
      "pvc-wire",
      "electric-motors",
    ],
  },
  {
    id: "ferrous",
    title: "Steel, Cars & Machinery",
    intro:
      "Steel and iron in bulk, from whole cars to old machinery. We also take general steel: offcuts, sheet, beams, pipe, roofing iron and whitegoods. Too big to bring in? We'll collect it.",
    slugs: ["unwanted-cars", "scrap-car-parts", "scrap-machinery"],
  },
];

export function getMaterial(slug) {
  return materials.find((material) => material.slug === slug);
}
