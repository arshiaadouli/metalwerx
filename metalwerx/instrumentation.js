// Runs once when the server starts (Next's instrumentation hook).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Node gives each connection attempt 250 ms before trying the next address
  // family. The handshake to api.telegram.org takes longer than that from this
  // server and its IPv6 route is unreachable, so fetch always timed out. Raise
  // the per-attempt limit so slow hosts still connect.
  const net = await import("node:net");
  net.setDefaultAutoSelectFamilyAttemptTimeout(3000);
}
