import assert from "node:assert/strict";
import { test } from "node:test";
import { binPermits, local } from "./local.js";
import { getSuburb, nearby, suburbs } from "./suburbs.js";

test("every suburb has its own page address and plausible details", () => {
  assert.equal(new Set(suburbs.map(({ slug }) => slug)).size, suburbs.length);
  for (const { name, slug, postcode, council, km, minutes, via, lat, lng } of suburbs) {
    assert.match(slug, /^[a-z]+(-[a-z]+)*$/, name);
    assert.match(postcode, /^3\d{3}$/, name);
    assert.match(council, /Council/, name);
    assert.ok(via, name);
    assert.ok(Number.isInteger(km) && km > 0 && km < 60, name);
    assert.ok(minutes >= 5 && minutes % 5 === 0, name);
    // Within about 40 km of the yard, so a lat and lng aren't swapped or mistyped.
    assert.ok(Math.abs(lat + 38.015) < 0.35 && Math.abs(lng - 145.259) < 0.35, name);
  }
});

test("the suburbs the business named have a page", () => {
  for (const slug of ["hallam", "bayswater", "boronia", "lilydale", "dandenong-south", "pakenham"]) {
    assert.ok(getSuburb(slug)?.local, slug);
  }
  assert.equal(getSuburb("nowhere"), null);
});

// Runs of four words, to measure how much wording two pages share.
const runs = (paragraphs) => {
  const words = paragraphs.join(" ").toLowerCase().match(/[a-z0-9'³]+/g);
  return new Set(words.slice(3).map((_, i) => words.slice(i, i + 4).join(" ")));
};

test("every suburb page has words of its own", () => {
  const pages = suburbs.filter((suburb) => suburb.local);
  // A key in local.js that's no suburb's slug would never get a page.
  assert.equal(pages.length, Object.keys(local).length);
  for (const page of pages) {
    assert.ok(binPermits[page.council], `no bin permit rules for ${page.council}`);
    const own = runs(page.local);
    assert.ok(own.size >= 80, `${page.name} has too little copy of its own`);
    // Many near-identical suburb pages read as doorway pages to Google.
    for (const other of pages.filter((p) => p !== page)) {
      const theirs = runs(other.local);
      const shared = [...own].filter((run) => theirs.has(run)).length / Math.min(own.size, theirs.size);
      assert.ok(shared < 0.1, `${page.name} and ${other.name} share ${Math.round(shared * 100)}% of their wording`);
    }
  }
});

test("nearby gives the closest other suburbs, nearest first", () => {
  assert.deepEqual(
    nearby(getSuburb("pakenham"), 3).map(({ name }) => name),
    ["Officer South", "Officer", "Beaconsfield"],
  );
});
