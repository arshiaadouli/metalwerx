import IndexCashForCars from "./components/index-cash-for-cars";
import IndexCommercial from "./components/index-commercial";
import IndexHero from "./components/index-hero";

export const metadata = {
  title: { absolute: "Metal Werx | Scrap Metal Recycling & Cash for Cars" },
  description:
    "Turn your scrap metal into cash. Metal Werx buys ferrous and non-ferrous metals, car bodies and batteries. Bring it to the yard, hire a bin or book a pickup.",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <IndexHero />
      <IndexCommercial />
      <IndexCashForCars />
    </main>
  );
}
