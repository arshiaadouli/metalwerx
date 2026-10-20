// Station "office": stop 5: the site office, the payment window, the ID check and the bank transfer.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildOffice(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "office", group, update() {} };
}
