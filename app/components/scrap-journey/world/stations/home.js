// Station "home": stops 1 and 2: the customer's house and driveway, the phone call, and sorting the pile into the trailer's crates.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildHome(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "home", group, update() {} };
}
