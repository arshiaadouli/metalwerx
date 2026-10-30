import type { GlobalConfig } from 'payload'

import { cta, pageHero, seo, steps, titledTexts } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The website's /what-we-buy page: its header, what affects the price, the
// groups of material cards, the selling steps and the closing band. The
// materials themselves are in collections/Materials.ts; the selling steps also
// show on every material page without steps of its own.
export const WhatWeBuyPage: GlobalConfig = {
  slug: 'what-we-buy-page',
  label: 'What We Buy page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateWebsite(['cms:materials'])],
  },
  fields: [
    seo(),
    pageHero(),
    {
      name: 'priceFactors',
      label: 'What affects the price',
      type: 'group',
      admin: {
        description:
          'Under the header: why what you are paid can differ from the average prices on the cards. Hidden while it has no items.',
      },
      fields: [
        { name: 'heading', type: 'text', admin: { placeholder: 'What Affects the Price' } },
        { name: 'intro', type: 'textarea' },
        titledTexts('items', 'Factors'),
      ],
    },
    {
      name: 'groups',
      type: 'array',
      admin: { description: 'The sections of material cards, in order.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'anchor',
              type: 'text',
              required: true,
              admin: { description: 'The section is at /what-we-buy#<anchor>.' },
            },
          ],
        },
        { name: 'intro', type: 'textarea' },
        {
          name: 'materials',
          type: 'relationship',
          relationTo: 'materials',
          hasMany: true,
          required: true,
          admin: { description: 'The cards in the section, in order.' },
        },
      ],
    },
    steps('sellingSteps', 'Selling steps', 'How selling at the yard works, here and on the material pages.'),
    cta(),
  ],
}
