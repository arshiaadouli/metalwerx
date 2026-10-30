import type { CollectionConfig } from 'payload'

import { revalidateWebsite } from '../hooks/revalidateWebsite'

// What the yard pays for each material, in Australian dollars. One entry per
// material, as a single average price; an empty price means it isn't priced
// yet.
export const Price: CollectionConfig = {
  slug: 'price',
  labels: { singular: 'Price', plural: 'Prices' },
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['material', 'price', 'unit', 'updatedAt'],
  },
  defaultSort: 'material',
  hooks: {
    afterChange: [revalidateWebsite(['cms:price'])],
    afterDelete: [revalidateWebsite(['cms:price'])],
  },
  fields: [
    {
      name: 'material',
      type: 'relationship',
      relationTo: 'materials',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'price',
      label: 'Average price (AUD $)',
      type: 'number',
      min: 0,
      admin: { step: 0.01, description: 'Leave empty if the material has no price yet.' },
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      defaultValue: 'kg',
      options: [
        { label: 'Per kg', value: 'kg' },
        { label: 'Per tonne', value: 'tonne' },
        { label: 'Each', value: 'each' },
      ],
    },
  ],
}
