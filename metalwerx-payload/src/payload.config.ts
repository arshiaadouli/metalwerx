import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Materials } from './collections/Materials'
import { Media } from './collections/Media'
import { MessagePhotos } from './collections/MessagePhotos'
import { Messages } from './collections/Messages'
import { Posts } from './collections/Posts'
import { Price } from './collections/Price'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { ServicesPage } from './globals/ServicesPage'
import { Terms } from './globals/Terms'
import { WhatWeBuyPage } from './globals/WhatWeBuyPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // The CMS is at http://192.168.15.240:3001 on the LAN (see README.md), and
  // at localhost:3001 through VS Code's port forwarding. No serverURL, so the
  // admin calls the API on whichever address it was opened at, and a login
  // only counts from these addresses (the csrf list).
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://192.168.15.240:3001',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://admin.metalwerx.com.au',
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Services, Materials, Price, Messages, MessagePhotos],
  globals: [HomePage, PrivacyPolicy, Terms, ServicesPage, WhatWeBuyPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    // The media files live in the S3 bucket, not on this server's disk. Each
    // file's prefix (brand/, home/, blogs/, …) is its folder in the bucket.
    // The bucket is publicly readable, so a file's URL points straight at the
    // object storage: http://192.168.15.240:9000/metalwerx-media/home/<file>.
    s3Storage({
      alwaysInsertFields: true,
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: { disablePayloadAccessControl: true },
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        region: 'us-east-1',
      },
    }),
    // An MCP server at /api/mcp. An API key made under MCP > API Keys picks
    // which of these each client may read or change.
    mcpPlugin({
      collections: {
        posts: {
          description: 'The blog posts on the Metal Werx website, at /blogs/<slug>.',
          enabled: true,
        },
        services: {
          description: 'The services on the Metal Werx website, each at /services/<slug>.',
          enabled: true,
        },
        materials: {
          description: 'The materials Metal Werx buys, each at /what-we-buy/<slug>.',
          enabled: true,
        },
        price: {
          description: 'What Metal Werx pays for each material, as an average price in Australian dollars per kg, per tonne or each.',
          enabled: true,
        },
        media: {
          description:
            'The photos on the Metal Werx website, kept in object storage. Files are uploaded in the admin; MCP can find them and edit their alt text.',
          enabled: { find: true, update: true },
        },
      },
      globals: {
        'home-page': {
          description: 'The copy and photos of the Metal Werx home page.',
          enabled: true,
        },
        'privacy-policy': {
          description: 'The text of the Metal Werx privacy policy page.',
          enabled: true,
        },
        terms: {
          description: 'The text of the Metal Werx terms and conditions page, at /terms.',
          enabled: true,
        },
        'services-page': {
          description: 'The header and closing band of the Metal Werx /services page.',
          enabled: true,
        },
        'what-we-buy-page': {
          description:
            'The Metal Werx /what-we-buy page: header, what affects the price, groups of material cards, selling steps and closing band.',
          enabled: true,
        },
      },
    }),
  ],
})
