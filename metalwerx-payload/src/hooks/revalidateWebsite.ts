import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Tells the website to drop its cached copy of the content, so a change made
// here shows on its next visit. The website's /api/revalidate route checks the
// shared REVALIDATE_SECRET and revalidates the given cache tags. A failure is
// logged and doesn't stop the save: the website also refreshes on its own
// every 15 minutes.
export const revalidateWebsite =
  (tags: string[]): CollectionAfterChangeHook & CollectionAfterDeleteHook & GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    const { WEBSITE_URL, REVALIDATE_SECRET } = process.env
    if (!WEBSITE_URL || !REVALIDATE_SECRET || req.context.skipRevalidate) return doc
    try {
      const res = await fetch(new URL('/api/revalidate', WEBSITE_URL), {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-revalidate-secret': REVALIDATE_SECRET },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error(`the website answered ${res.status}`)
    } catch (error) {
      req.payload.logger.warn(`Couldn't revalidate ${tags.join(', ')} on the website: ${String(error)}`)
    }
    return doc
  }
