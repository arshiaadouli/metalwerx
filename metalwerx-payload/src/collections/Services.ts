import type { CollectionConfig } from 'payload'

import { cta, details, faq, icon, paragraphs, photo, seo, steps } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The website's services. Each has its own page at /services/<slug> and a row
// on /services, in the order of the order field. The page's sections after
// the overview are the same as a material's (see Materials.ts): the shared
// fields are in ../fields.ts.

// The lucide icons the website can show for a service and its features.
const icons = [
  'container',
  'truck',
  'factory',
  'scale',
  'repeat',
  'ruler',
  'forklift',
  'tractor',
  'calendar-check',
  'calendar-clock',
  'receipt-text',
  'layers',
  'recycle',
]

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'order'],
    useAsTitle: 'title',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateWebsite(['cms:services'])],
    afterDelete: [revalidateWebsite(['cms:services'])],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'The short name, for menus, cards and the breadcrumb.' },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: { description: "The page's main heading." },
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'The page is at /services/<slug>.', position: 'sidebar' },
    },
    {
      name: 'anchor',
      type: 'text',
      required: true,
      admin: {
        description: "The service's row on /services is at /services#<anchor>.",
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Lower numbers come first on /services.', position: 'sidebar' },
    },
    icon(icons, { position: 'sidebar' }),
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: { description: 'One line, for the cards linking to the service.' },
    },
    {
      name: 'lede',
      type: 'textarea',
      required: true,
      admin: { description: 'The paragraph under the heading.' },
    },
    ...photo('The header photo, also on the cards.'),
    seo(),
    {
      name: 'overview',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        paragraphs(),
        {
          name: 'features',
          type: 'array',
          fields: [
            icon(icons),
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    },
    steps('steps', 'How it works'),
    details(),
    faq(),
    cta(),
  ],
}
