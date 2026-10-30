import type { Field, SelectField } from 'payload'

// The fields the collections and globals share. Each is a function, so every
// collection gets its own copy for Payload to set up.

// A photo from the media collection: its alt text lives there, and the
// tooltip where it's used lives here.
export const photo = (description?: string): Field[] => [
  { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { description } },
  { name: 'imageTitle', label: 'Image tooltip', type: 'text' },
]

// One of the lucide icons the website can show here.
export const icon = (options: string[], admin?: SelectField['admin']): Field => ({
  name: 'icon',
  type: 'select',
  required: true,
  options,
  admin,
})

// A button or link: its text and where it goes.
export const link = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'text', type: 'text', required: true },
    { name: 'href', label: 'Link', type: 'text', required: true },
  ],
})

// The page's title and description for search engines.
export const seo = (): Field => ({
  name: 'seo',
  label: 'SEO',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
})

// The header of a page global: eyebrow, title, lede, photo and a button.
export const pageHero = (): Field => ({
  name: 'hero',
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'lede', type: 'textarea', required: true },
    ...photo(),
    link('cta', 'Button'),
  ],
})

// One textarea per paragraph.
export const paragraphs = (): Field => ({
  name: 'paragraphs',
  type: 'array',
  minRows: 1,
  fields: [{ name: 'text', type: 'textarea', required: true }],
})

// Rows of a title over a paragraph: steps, grades, price factors.
export const titledTexts = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
})

// Numbered steps under an intro: "How it works" on the service and material
// pages, and the selling steps on the What We Buy page.
export const steps = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'group',
  admin: { description },
  fields: [{ name: 'intro', type: 'text' }, titledTexts('items')],
})

export const faq = (): Field => ({
  name: 'faq',
  label: 'FAQ',
  type: 'group',
  fields: [
    { name: 'intro', type: 'text' },
    {
      name: 'questions',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
})

// What goes in and what stays out: up to two photos beside lists of ticks or
// crosses.
export const details = (): Field => ({
  name: 'details',
  type: 'group',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'intro', type: 'textarea' },
    {
      name: 'images',
      type: 'array',
      admin: { description: 'A large photo and a smaller one over its corner.' },
      maxRows: 2,
      fields: photo(),
    },
    {
      name: 'lists',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'yes',
          options: [
            { label: 'Ticks (what we take)', value: 'yes' },
            { label: 'Crosses (what to leave out)', value: 'no' },
          ],
        },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
  ],
})

// The band at the foot of the page.
export const cta = (): Field => ({
  name: 'cta',
  label: 'Closing call to action',
  type: 'group',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    { name: 'buttonText', type: 'text', required: true },
    { name: 'buttonHref', label: 'Button link', type: 'text', required: true },
  ],
})
