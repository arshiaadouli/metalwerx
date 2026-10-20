import { ServicePage, serviceMetadata } from "../service-page";

export const metadata = serviceMetadata("bin-hire");

export default function BinHirePage() {
  return <ServicePage slug="bin-hire" />;
}
