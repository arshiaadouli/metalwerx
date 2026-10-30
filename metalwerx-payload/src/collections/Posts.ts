import type { CollectionConfig } from 'payload'

import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The blog posts at /blogs. A post's URL is /blogs/<slug>, where the slug is
// made from the title when it's left empty: "Copper Prices: What's Changed?"
// becomes "copper-prices-whats-changed".
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'date', 'slug'],
    useAsTitle: 'title',
  },
  defaultSort: '-date',
  hooks: {
    afterChange: [revalidateWebsite(['cms:posts'])],
    afterDelete: [revalidateWebsite(['cms:posts'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        description: 'The post is at /blogs/<slug>. Leave empty to make it from the title.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [({ value, data }) => value || (data?.title ? slugify(data.title) : value)],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The summary on the blog page, and the description search engines show.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'The photo at the top of the post and on its card.' },
    },
    {
      name: 'body',
      type: 'array',
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      minRows: 1,
      required: true,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}

// The same slugs as the website's blogSlug in lib/blogs.js.
function slugify(title: string) {
  return title
    .normalize('NFKD') // Split accented letters so the accents can be dropped: é → e.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '') // "what's" → "whats", not "what-s".
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
