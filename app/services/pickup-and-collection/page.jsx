import { ServicePage, serviceMetadata } from "../service-page";

export const metadata = serviceMetadata("pickup-and-collection");

export default function PickupAndCollectionPage() {
  return <ServicePage slug="pickup-and-collection" />;
}
