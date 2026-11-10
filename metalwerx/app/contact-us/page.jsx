import { Mail, MapPin, Phone } from "lucide-react";
import ContactWithGlobe from "./contact-with-globe";
import AreasServed from "@/app/components/areas-served";
import ContactFindUs from "@/app/components/contact-find-us";
import { socialLinks } from "@/app/components/social-links";
import { business, formattedAddress, telHref } from "@/lib/business";
import { sendMessage } from "./actions";

// "absolute" keeps the layout's "| Metal Werx" suffix off, since the title
// already names the business.
export const metadata = {
  title: { absolute: `Contact ${business.name}, ${formattedAddress.replace(/ \d{4}$/, "")}` },
  description: `Get a quote for your scrap metal, book a pickup or hire a bin. Call ${business.phone.display}, email or visit ${business.name} at ${formattedAddress}.`,
};

// The details themselves are in lib/business.js.
const contactLinks = [
  {
    icon: <Phone />,
    label: "Call us",
    value: business.phone.display,
    href: telHref,
  },
  {
    icon: <Mail />,
    label: "Email us",
    value: business.email,
    href: `mailto:${business.email}`,
  },
  {
    icon: <MapPin />,
    label: "Visit the yard",
    value: formattedAddress,
    href: business.mapsUrl,
  }
];

export default function ContactUsPage() {
  return (
    <main className="flex-1 bg-surface">
      <ContactWithGlobe
        title="Contact Us"
        description="Need a quote for your scrap, a pickup or a bin? Get in touch and we'll get back to you."
        contactLinks={contactLinks}
        action={sendMessage}
      />
      <ContactFindUs />
      <AreasServed />
    </main>
  );
}
