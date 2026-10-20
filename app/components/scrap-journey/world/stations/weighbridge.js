// Station "weighbridge": stop 4: the weighbridge on the west ring road, its readout and the weigh ticket.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildWeighbridge(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "weighbridge", group, update() {} };
}
