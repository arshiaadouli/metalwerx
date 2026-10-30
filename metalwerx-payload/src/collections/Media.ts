import type { CollectionConfig } from 'payload'

import { revalidateWebsite } from '../hooks/revalidateWebsite'

// Every photo on the website. The files are kept in the object storage
// (SeaweedFS's S3 API, see payload.config.ts), each under the prefix of the
// website section it belongs to: brand/, home/, blogs/, services/ or
// what-we-buy/. The admin's folders use the same names.
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'prefix', 'updatedAt'],
    useAsTitle: 'filename',
  },
  folders: true,
  hooks: {
    // A new alt text or file changes the pages that show the photo.
    afterChange: [revalidateWebsite(['cms:home-page', 'cms:posts', 'cms:services', 'cms:materials'])],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describes the photo for screen readers.' },
    },
    {
      name: 'title',
      type: 'text',
      admin: { description: 'The tooltip shown when the photo is hovered.' },
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'The Unsplash or Pexels page the photo came from.' },
    },
  ],
  upload: true,
}
