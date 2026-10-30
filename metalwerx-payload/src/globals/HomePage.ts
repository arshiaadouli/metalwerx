import type { GlobalConfig } from 'payload'

import { icon, link, photo, seo } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The copy and photos on the website's home page, section by section, top to
// bottom. The shared fields are in ../fields.ts.
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateWebsite(['cms:home-page'])],
  },
  fields: [
    seo(),
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        link('primaryCta', 'Primary button'),
        link('secondaryCta', 'Secondary button'),
        {
          name: 'backgroundImages',
          type: 'array',
          admin: { description: 'The photos take turns behind the copy.' },
          minRows: 1,
          required: true,
          fields: photo(),
        },
      ],
    },
    {
      name: 'ticker',
      type: 'array',
      admin: { description: 'The scrolling band under the hero.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'whyUs',
      label: 'Why us',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea' },
        {
          name: 'reasons',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
            ...photo(),
          ],
        },
      ],
    },
    {
      name: 'commercial',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea' },
        {
          name: 'services',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
            icon(['handshake', 'truck', 'file-pen', 'recycle', 'car', 'factory', 'container', 'phone']),
          ],
        },
      ],
    },
    {
      name: 'cashForCars',
      label: 'Cash for cars',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'text' },
        { name: 'body', type: 'textarea', required: true },
        ...photo(),
        {
          name: 'steps',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'points', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
            icon(['phone', 'message', 'dollar', 'scale', 'truck', 'car', 'handshake', 'check']),
          ],
        },
        link('cta', 'Button'),
      ],
    },
    {
      name: 'faq',
      label: 'FAQ',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea' },
        {
          name: 'questions',
          type: 'array',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ],
}
