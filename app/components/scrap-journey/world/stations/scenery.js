// Station "scenery": the land around the yard: ground cover, the public roads, the customer's street and neighbours, trees, street lights and the bush.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildScenery(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "scenery", group, update() {} };
}
