import type { CollectionConfig } from 'payload'

import { cta, details, faq, icon, paragraphs, photo, seo, steps, titledTexts } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The materials the yard buys. Each has its own page at /what-we-buy/<slug>,
// and a card on /what-we-buy in the group that lists it (see
// globals/WhatWeBuyPage.ts). The page's sections after the overview are the
// same as a service's (see Services.ts): the shared fields are in ../fields.ts.

// The lucide icons the website can show for a material.
const icons = [
  'cylinder',
  'wrench',
  'layers',
  'disc-3',
  'cooking-pot',
  'battery-full',
  'cable',
  'zap',
  'cog',
  'tractor',
  'car-front',
  'recycle',
  'anvil',
  'shapes',
  'engine',
  'air-vent',
  'refrigerator',
]

export const Materials: CollectionConfig = {
  slug: 'materials',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultSort: 'title',
  hooks: {
    afterChange: [revalidateWebsite(['cms:materials'])],
    afterDelete: [revalidateWebsite(['cms:materials'])],
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
      admin: { description: 'The page is at /what-we-buy/<slug>.', position: 'sidebar' },
    },
    {
      name: 'anchor',
      type: 'text',
      required: true,
      admin: {
        description: "The material's card on /what-we-buy is at /what-we-buy#<anchor>.",
        position: 'sidebar',
      },
    },
    icon(icons, { description: 'In the pill above the heading.', position: 'sidebar' }),
    {
      name: 'related',
      label: 'We also buy',
      type: 'relationship',
      relationTo: 'materials',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'The materials suggested at the foot of the page.',
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: { description: 'One line, for the cards linking to the material.' },
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
          name: 'gradesTitle',
          label: 'Grades heading',
          type: 'text',
          admin: { placeholder: 'Grades We Buy' },
        },
        titledTexts('grades'),
      ],
    },
    steps(
      'steps',
      'How it works',
      'Leave the items empty to show the selling steps from the What We Buy page.',
    ),
    details(),
    faq(),
    cta(),
  ],
}
