import {
  CalendarCheck,
  CalendarClock,
  Container,
  Factory,
  Forklift,
  Layers,
  ReceiptText,
  Recycle,
  Repeat,
  Ruler,
  Scale,
  Tractor,
  Truck,
} from "lucide-react";
import { getServicesContent } from "@/lib/cms";

// The services for /services and each service page, /services/<slug>. They're
// written in the CMS (see lib/cms.js), which names each icon; here the names
// become lucide icons.
//
// Each service:
//   slug       its page, /services/<slug>
//   anchor     its id on /services, where links from before the pages existed
//              (such as the home page's) still land
//   title      the short name, for menus, cards and the breadcrumb
//   heading    the page's h1
//   summary    one line, for the cards linking to it
//   seo        { title, description }
//   image      the header photo, also on the cards: { url, alt, title }
//   overview   { heading, paragraphs, features: [{ icon, title, text }] }
//   steps      { intro, items: [{ title, text }] }
//   details    { heading, intro, images: [main, inset], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   cta        the band at the foot: { heading, text, cta: { text, href } }

const icons = {
  "calendar-check": CalendarCheck,
  "calendar-clock": CalendarClock,
  container: Container,
  factory: Factory,
  forklift: Forklift,
  layers: Layers,
  "receipt-text": ReceiptText,
  recycle: Recycle,
  repeat: Repeat,
  ruler: Ruler,
  scale: Scale,
  tractor: Tractor,
  truck: Truck,
};
const icon = (name) => icons[name] ?? Recycle;

// Every service, in its order on /services.
export async function getServices() {
  const { services } = await getServicesContent();
  return services.map((service) => ({
    ...service,
    icon: icon(service.icon),
    overview: {
      ...service.overview,
      features: service.overview.features.map((feature) => ({
        ...feature,
        icon: icon(feature.icon),
      })),
    },
  }));
}

export async function getService(slug) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

// The /services page's header and closing band: { seo, hero, cta }.
export async function getServicesPage() {
  const { page } = await getServicesContent();
  return page;
}
