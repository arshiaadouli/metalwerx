// Station "yard": the yard itself: fence, gate and sign, the ring road, floodlights and the big steel stockpile in the middle.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildYard(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "yard", group, update() {} };
}
