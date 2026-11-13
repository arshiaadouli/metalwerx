import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { turnstilePasses } from "./turnstile.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.TURNSTILE_SECRET_KEY;
});

test("passes everything when no secret key is set", async () => {
  globalThis.fetch = () => assert.fail("shouldn't ask Cloudflare");
  assert.equal(await turnstilePasses(""), true);
});

test("fails a missing token without asking Cloudflare", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  globalThis.fetch = () => assert.fail("shouldn't ask Cloudflare");
  assert.equal(await turnstilePasses(""), false);
});

test("sends the token, secret and address to siteverify and returns its verdict", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  for (const success of [true, false]) {
    globalThis.fetch = async (url, { body }) => {
      assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
      assert.equal(String(body), "secret=secret&response=token&remoteip=1.2.3.4");
      return Response.json({ success });
    };
    assert.equal(await turnstilePasses("token", "1.2.3.4"), success);
  }
});
