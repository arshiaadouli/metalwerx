import type { Block, GlobalConfig } from 'payload'

import { seo } from '../fields'
import { revalidateWebsite } from '../hooks/revalidateWebsite'

// The text of a legal page on the website, such as /privacy or /terms. The
// page is a list of sections, each with an icon and a list of topics, and each
// topic is made of blocks: paragraphs, questions and answers, callouts, an
// address or a list. In a long text field, a blank line starts a new paragraph.
// The website caches the page under the tag cms:<slug>.
export function legalPage({
  slug,
  label,
  path,
}: {
  slug: string
  label: string
  path: string
}): GlobalConfig {
  return {
    slug,
    label,
    access: {
      read: () => true,
    },
    hooks: {
      afterChange: [revalidateWebsite([`cms:${slug}`])],
    },
    fields: [
      seo(),
      {
        name: 'hero',
        type: 'group',
        fields: [
          { name: 'eyebrow', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          { name: 'intro', type: 'textarea', required: true },
        ],
      },
      {
        name: 'sections',
        type: 'array',
        minRows: 1,
        required: true,
        fields: [
          {
            name: 'anchor',
            type: 'text',
            required: true,
            admin: { description: `The section is linked as ${path}#<anchor>.` },
          },
          { name: 'title', type: 'text', required: true },
          {
            name: 'icon',
            type: 'select',
            required: true,
            options: [
              'shield-check',
              'info',
              'database',
              'chart-column',
              'mail',
              'lock',
              'scale',
              'file-text',
              'banknote',
              'car',
              'truck',
              'triangle-alert',
              'globe',
            ],
          },
          {
            name: 'topics',
            type: 'array',
            fields: [
              { name: 'title', type: 'text', required: true },
              {
                name: 'content',
                type: 'blocks',
                blocks: [paragraph(), questions(), callout(), address(), iconList()],
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: 'cta',
        label: 'Closing call to action',
        type: 'group',
        fields: [
          { name: 'heading', type: 'text', required: true },
          { name: 'body', type: 'textarea' },
          { name: 'buttonText', type: 'text', required: true },
          { name: 'buttonHref', label: 'Button link', type: 'text', required: true },
        ],
      },
    ],
  }
}

function paragraph(): Block {
  return {
    slug: 'paragraph',
    fields: [{ name: 'text', type: 'textarea', required: true }],
  }
}

// Shown as cards in a two-column grid.
function questions(): Block {
  return {
    slug: 'questions',
    labels: { singular: 'Questions and answers', plural: 'Questions and answers' },
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'question', type: 'text', required: true },
          { name: 'answer', type: 'textarea', required: true },
        ],
      },
    ],
  }
}

function callout(): Block {
  return {
    slug: 'callout',
    fields: [
      {
        name: 'kind',
        type: 'select',
        required: true,
        defaultValue: 'legal-basis',
        options: [
          { label: 'Legal basis', value: 'legal-basis' },
          { label: 'Please note', value: 'note' },
        ],
      },
      { name: 'text', type: 'textarea', required: true },
    ],
  }
}

function address(): Block {
  return {
    slug: 'address',
    fields: [{ name: 'text', type: 'textarea', required: true }],
  }
}

function iconList(): Block {
  return {
    slug: 'iconList',
    labels: { singular: 'Icon list', plural: 'Icon lists' },
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true },
          {
            name: 'icon',
            type: 'select',
            required: true,
            options: ['globe', 'monitor', 'link', 'server', 'clock', 'network'],
          },
        ],
      },
    ],
  }
}
