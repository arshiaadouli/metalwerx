import type { GlobalConfig } from 'payload'

import { legalPage } from './legalPage'

// The text of the website's /terms page, laid out like the privacy policy (see
// legalPage.ts).
export const Terms: GlobalConfig = {
  ...legalPage({ slug: 'terms', label: 'Terms & Conditions', path: '/terms' }),
  // Not "Term", which Payload would make of the slug.
  typescript: { interface: 'Terms' },
}
