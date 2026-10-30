import type { GlobalConfig } from 'payload'

import { cta, pageHero, seo } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The header and closing band of the website's /services page. The rows
// between them are the services themselves (see collections/Services.ts).
export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateWebsite(['cms:services'])],
  },
  fields: [seo(), pageHero(), cta()],
}
