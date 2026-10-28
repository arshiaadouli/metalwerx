// The blog posts at /blogs. Like the service pages, they live here in the
// code, so a new or edited post goes live with the next deployment.
//
// Each post:
//   title   its URL is /blogs/<title with hyphens> (see blogSlug in
//           lib/blogs.js), so changing a title changes its URL
//   date    "YYYY-MM-DD"
//   cover?  { src, alt }: a photo in public/ (see lib/photo.js)
//   body    paragraphs, one string each
//
// The order here doesn't matter: the blog lists them newest first.
//
// The payment and ID details follow Victoria's Scrap Metal Dealers Act 2016,
// as the service and material pages do.

const unsplash = (id) => `/images/unsplash/${id}.jpg`;
const pexels = (id) => `/images/pexels/${id}.jpg`;

export const posts = [
  {
    title: "Ferrous or Non-Ferrous? Why It Matters When You Sell Scrap",
    date: "2026-09-08",
    cover: {
      src: pexels(5279317),
      alt: "Tangled scrap copper wire",
    },
    body: [
      "Every load of scrap that comes over our scales is sorted into two big families: ferrous and non-ferrous. Knowing which is which is the quickest way to understand what your scrap is worth.",
      "Ferrous metals contain iron. Steel and cast iron are the common ones: car bodies, roofing, fencing, machinery frames, old tools and white goods. There's a lot of it about and it's heavy, so it's paid by the tonne, at a lower rate per kilo than non-ferrous metal.",
      "Non-ferrous metals don't contain iron. Copper, brass, aluminium, stainless steel and lead are the ones we see most. They're worth more per kilo, sometimes many times more, so even a small bucket of copper offcuts or brass fittings can be worth the trip.",
      "The easiest test is a magnet. If it sticks firmly, the metal is ferrous. If it doesn't stick, it's probably non-ferrous and worth keeping apart. Stainless steel is the exception that catches people out: most grades are only slightly magnetic or not magnetic at all, but it's still graded on its own.",
      "Keep the two apart as you collect. A mixed load is paid at the rate of its cheapest metal, but sorted bins of copper, brass, aluminium and steel are each paid at their own price. Not sure what something is? Bring it in and we'll grade it for you.",
    ],
  },
  {
    title: "How to Prepare Your Scrap Metal for the Yard",
    date: "2026-09-29",
    cover: {
      src: pexels(10628555),
      alt: "A large mound of mixed scrap metal in a recycling yard under a blue sky",
    },
    body: [
      "A little preparation before you load the ute makes your visit quicker and puts more money in your account. Here's what we suggest.",
      "Sort by metal. Keep copper, brass, aluminium, stainless steel and lead apart from steel and from each other. Each is weighed and paid on its own, so sorting at home means nothing gets paid at a lower grade than it should.",
      "Take off what isn't metal. Plastic, rubber, timber and concrete add weight but aren't paid for, and heavily contaminated metal is graded lower. Unscrewing a plastic handle or knocking off a timber base is usually worth the few minutes.",
      "Strip it if it pays. Clean, bare copper is worth more than copper still attached to brass fittings or covered in insulation. For a small amount of wire it's often not worth the effort, so ask us before you spend an afternoon stripping cable.",
      "Drain anything that held fluids. Motors, gearboxes and machinery should be drained of oil and fuel, and gas bottles need to be empty with the valve removed.",
      "Bring your photo ID and bank details. Victorian law requires us to record the ID of everyone who sells us scrap metal, and we pay by bank transfer rather than cash, so have your BSB and account number handy.",
    ],
  },
  {
    title: "Scrapping an Old Car: What to Do Before We Tow It Away",
    date: "2026-10-14",
    cover: {
      src: unsplash("photo-1645216755684-c946ce202427"),
      alt: "An old rusty car sitting in long grass on a farm",
    },
    body: [
      "An old car that hasn't moved in years still has value as scrap, and we'll take it in any condition, running or not. A few steps before pick-up day make the handover smooth.",
      "Find your proof of ownership. We'll need to see that the car is yours to sell, such as the registration papers or a receipt, along with your photo ID.",
      "Empty the car. Check the glovebox, the boot, under the seats and the door pockets. Once the car is gone, anything left in it is too. Take off your toll tag and any number plates you want to keep.",
      "Sort out the registration. If the car is still registered, cancel the registration or lodge a notice of disposal with VicRoads, so tolls, fines and fees for the car stop being your responsibility once it's gone.",
      "Make sure we can get to it. Let us know where the car is parked and whether the tow truck can reach it. A car with flat tyres or no keys is fine; we just need to know before we arrive.",
      "Then get in touch with the make, model and condition of the car. We'll give you a price, book a time to tow it away for free and pay you by bank transfer.",
    ],
  },
];
