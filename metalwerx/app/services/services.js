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
//   image      the header photo, also on the cards: { src, alt, title }
//   overview   { heading, paragraphs, features: [{ icon, title, text }] }
//   steps      { intro, items: [{ title, text }] }
//   details    { heading, intro, images: [main, inset], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   cta        the band at the foot: { heading, text, buttonText, buttonHref, image },
//              image being the photo behind it (see bandPhotos)

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

// The photo behind each page's closing band, from public/images: a different
// one on each page, and none that's already shown higher up it (in the header,
// the details or the cards). The CMS doesn't hold these, so a service added
// there gets the default.
const unsplash = (id) => `/images/unsplash/${id}.jpg`;
const bandPhotos = {
  "bin-hire": unsplash("photo-1727372417003-3c227717b62c"), // a bin of cast aluminium scrap
  "pickup-and-collection": unsplash("photo-1723709525972-e5b1af84a839"), // hook-lift truck and bins
  "commercial-recycling": unsplash("photo-1722695510527-cc033e43be1b"), // grapple lifting a bale
};
const pageBandPhoto = unsplash("photo-1756753142721-6017ff7b7e11"); // grapple truck, for /services
const defaultBandPhoto = unsplash("photo-1722695694560-f452b0919d3a"); // excavator sorting scrap

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
    cta: { ...service.cta, image: bandPhotos[service.slug] ?? defaultBandPhoto },
  }));
}

export async function getService(slug) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

// The /services page's header and closing band: { seo, hero, cta }.
export async function getServicesPage() {
  const { page } = await getServicesContent();
  return { ...page, cta: { ...page.cta, image: pageBandPhoto } };
}
