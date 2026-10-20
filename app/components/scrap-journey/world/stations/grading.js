// Station "grading": stop 3: the grade bays along the east fence, the grader, and the car bodies.
// Placeholder until the station is built; see create-world.js for the contract.
export function buildGrading(ctx) {
  const { kit } = ctx;
  const group = kit.group();
  return { name: "grading", group, update() {} };
}
