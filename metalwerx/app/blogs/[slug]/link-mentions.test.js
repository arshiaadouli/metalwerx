import assert from "node:assert/strict";
import { test } from "node:test";
import { linkMentions, MAX_LINKS } from "./link-mentions.js";

test("links the first mention of each page, most specific first, up to the limit", () => {
  const [first, second] = linkMentions([
    "Aluminium wheels and aluminium sheet.\nCopper too.",
    "Copper again, brass, and steel.",
  ]);
  assert.equal(MAX_LINKS, 3);
  assert.deepEqual(first, [
    { text: "Aluminium wheels", href: "/what-we-buy/aluminium-wheels" },
    " and ",
    { text: "aluminium", href: "/what-we-buy/alloy-mix" },
    " sheet.\n",
    { text: "Copper", href: "/what-we-buy/copper" },
    " too.",
  ]);
  // Copper is already linked, and the post has its three links.
  assert.deepEqual(second, ["Copper again, brass, and steel."]);
});

test("prefers stainless steel over steel, and leaves plain bins alone", () => {
  assert.deepEqual(linkMentions(["Stainless steel, not steel, in the bin."]), [
    [
      { text: "Stainless steel", href: "/what-we-buy/stainless-steel" },
      ", not ",
      { text: "steel", href: "/what-we-buy/hms-steel" },
      ", in the bin.",
    ],
  ]);
});

test("leaves a post without mentions alone", () => {
  assert.deepEqual(linkMentions(["Nothing to see."]), [["Nothing to see."]]);
});
