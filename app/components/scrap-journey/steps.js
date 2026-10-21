import { YARD } from "@/lib/yard";

// The six stops of the scrap journey under the home page rack, in the order
// the camera visits them. The copy follows how selling scrap at the yard works
// (see PRODUCT.md): call ahead, sort the load, drop off and grade, weigh, show
// ID and get paid by bank transfer, then the metal goes back into the loop.
//   label    the short name on the route rail
//   eyebrow  the step and its name, "Step 1 · Call ahead", shown as a line
//            under the title
//   title    the stop's heading
//   body     one or two short sentences
//   tags?    up to three proof chips
//   actions? [{ text, href }], links under the body; a tel: link is the Call
// The last stop shows the hero's two CTAs, passed in from the page.
//
// For the yard to confirm: "verified scales", the weighbridge that loads cross
// full and empty, "an indicative price per kilo" and the degassing and rego
// advice are not in PRODUCT.md yet.
export const phone = { text: YARD.phone, href: YARD.phoneHref };

export const steps = [
  {
    id: "call-ahead",
    label: "Call ahead",
    eyebrow: "Step 1 · Call ahead",
    title: "Tell us what you've got",
    body: "Tell us the metal and roughly how much, and we'll give you an indicative price per kilo.",
    actions: [
      { text: `Call ${phone.text}`, href: phone.href },
      { text: "Send a message", href: "/contact-us" },
    ],
    tags: ["Bring photo ID", "Have your BSB handy", "Pickups & bins too"],
  },
  {
    id: "sort-the-load",
    label: "Sort the load",
    eyebrow: "Step 2 · Sort the load",
    title: "Clean, sorted metal pays more",
    body: "Split it by metal and strip off plastic, timber and rubber. Leave gas bottles, sealed drums and asbestos at home, and get fridges degassed first.",
    tags: ["Sorted means a better grade", "No gas bottles"],
  },
  {
    id: "drop-off",
    label: "Drop-off",
    eyebrow: "Step 3 · Drop-off & grading",
    title: "Drive in, we'll grade it",
    body: "Pull into the yard and unload where we point. We grade it: clean or mixed copper, brass, cable, aluminium, stainless and steel. Selling a car? Take the plates off and cancel the rego first.",
    tags: ["Graded metal by metal", "Car bodies too"],
  },
  {
    id: "weigh",
    label: "Weigh",
    eyebrow: "Step 4 · Weigh & price",
    title: "Every grade, weighed",
    body: "Each grade goes on verified scales, and trailer loads cross the weighbridge full on the way in and empty on the way out. Weight times the rate for that grade is your total, printed on a weigh ticket.",
    tags: ["Verified scales", "Weigh ticket"],
  },
  {
    id: "get-paid",
    label: "Get paid",
    eyebrow: "Step 5 · ID check & payment",
    title: "Paid straight to your account",
    body: "Show your photo ID, we record the sale as the law requires, and we pay by bank transfer. Victoria doesn't allow cash for scrap.",
    tags: ["Photo ID", "Bank transfer", "No cash"],
  },
  {
    id: "back-into-the-loop",
    label: "Recycled",
    eyebrow: "Step 6 · Back into the loop",
    title: "Your scrap, made new",
    body: "After you leave, we stockpile it by grade, then cut, bale or strip it and send it on to smelters and exporters to become new metal.",
  },
];
