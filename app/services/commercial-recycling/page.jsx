import { ServicePage, serviceMetadata } from "../service-page";

export const metadata = serviceMetadata("commercial-recycling");

export default function CommercialRecyclingPage() {
  return <ServicePage slug="commercial-recycling" />;
}
