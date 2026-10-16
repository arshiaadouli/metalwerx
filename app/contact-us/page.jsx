import { Mail, MapPin, Phone } from "lucide-react";
import ContactWithGlobe from "@/components/ui/contact-with-globe";

export const metadata = {
  title: "Contact Us",
  description:
    "Get a quote for your scrap metal, book a pickup or hire a bin. Call, email or send Metal Werx a message.",
};

// The phone number and email are placeholders: the yard's real details still
// need to be added here.
const contactLinks = [
  {
    icon: <Phone />,
    label: "Call us",
    value: "0470 131 025",
    href: "tel:+610470131025",
  },
  {
    icon: <Mail />,
    label: "Email us",
    value: "info@metalwerx.com.au",
    href: "mailto:info@metalwerx.com.au",
  },
  {
    icon: <MapPin />,
    label: "Visit the yard",
    value: "131 Wedgewood Rd, Hallam VIC 3803",
    href: "https://www.google.com/maps/search/?api=1&query=Metal+Werx+Scrap+Metal+Recycling",
  },
];

export default function ContactUsPage() {
  return (
    <main className="flex-1 bg-carbon">
      <ContactWithGlobe
        title="Contact Us"
        description="Need a quote for your scrap, a pickup or a bin? Get in touch and we'll get back to you."
        contactLinks={contactLinks}
      />
    </main>
  );
}
