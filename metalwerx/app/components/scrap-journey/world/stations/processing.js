// Station "processing": stop 6: the excavator and magnet, the baler, bales, the container truck and the smelter island.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildProcessing(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "processing", group, update() {} };
}
