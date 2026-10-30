// Uploads every photo on the website to the media collection, which keeps the
// files in the object storage under their folder's prefix (brand/, home/,
// blogs/, services/, what-we-buy/), and files each in the admin folder of the
// same name. The photos and their alt text come from seed/images.json and the
// files from the website's public/ folder.
//
// It also makes, on a fresh database, the first admin user and an MCP API key,
// which seed/seed-content.mjs uses to save the copy through the MCP server.
// Both are written to .admin-credentials and .env. Running it again skips what
// is already there.
//
//   npm run seed:images              (the website is at ../metalwerx)
//   SITE_DIR=/path/to/site npm run seed:images
import { CreateBucketCommand, PutBucketPolicyCommand, S3Client } from '@aws-sdk/client-s3'
import crypto from 'node:crypto'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const root = path.resolve(import.meta.dirname, '..')
const siteDir = path.resolve(process.env.SITE_DIR ?? path.join(root, '../metalwerx'))
const images: Array<{
  file: string
  folder: string
  alt: string
  title?: string
  source?: string
}> = JSON.parse(readFileSync(path.join(import.meta.dirname, 'images.json'), 'utf8'))

await ensureBucket()

const payload = await getPayload({ config })
// No revalidation calls to the website while seeding.
const context = { skipRevalidate: true }

const folderIds = new Map<string, number>()
for (const name of new Set(images.map((image) => image.folder))) {
  const { docs } = await payload.find({
    collection: 'payload-folders',
    where: { name: { equals: name } },
    limit: 1,
  })
  const folder =
    docs[0] ??
    (await payload.create({
      collection: 'payload-folders',
      data: { name, folderType: ['media'] },
      context,
    }))
  folderIds.set(name, folder.id)
}

let uploaded = 0
for (const image of images) {
  const filename = path.basename(image.file)
  const { totalDocs } = await payload.count({
    collection: 'media',
    where: { filename: { equals: filename } },
  })
  if (totalDocs > 0) continue
  await payload.create({
    collection: 'media',
    data: {
      alt: image.alt,
      title: image.title,
      source: image.source,
      prefix: image.folder,
      folder: folderIds.get(image.folder),
    },
    filePath: path.join(siteDir, 'public', image.file),
    context,
  })
  uploaded++
  payload.logger.info(`Uploaded ${image.folder}/${filename}`)
}
payload.logger.info(`${uploaded} uploaded, ${images.length - uploaded} already there.`)

await ensureAdminAndApiKey()
process.exit(0)

// The bucket, readable by anyone so the website and browsers can load the
// photos straight from it. SeaweedFS also allows anonymous reads in its
// s3.json; the policy says the same for any other S3 store.
async function ensureBucket() {
  const bucket = process.env.S3_BUCKET!
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    region: 'us-east-1',
  })
  try {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
  } catch (error) {
    const name = (error as Error).name
    if (name !== 'BucketAlreadyOwnedByYou' && name !== 'BucketAlreadyExists') throw error
  }
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  }
  try {
    await s3.send(new PutBucketPolicyCommand({ Bucket: bucket, Policy: JSON.stringify(policy) }))
  } catch {
    // Not every S3 store has bucket policies.
  }
}

async function ensureAdminAndApiKey() {
  let { docs: users } = await payload.find({ collection: 'users', limit: 1 })
  if (users.length === 0) {
    const email = process.env.ADMIN_EMAIL ?? 'info@fuelzone.com.au'
    const password = crypto.randomBytes(12).toString('base64url')
    users = [await payload.create({ collection: 'users', data: { email, password }, context })]
    writeFileSync(
      path.join(root, '.admin-credentials'),
      `Payload admin, http://192.168.15.240:3001/admin\nemail: ${email}\npassword: ${password}\n` +
        'Change the password after signing in, then delete this file.\n',
      { mode: 0o600 },
    )
    payload.logger.info(`Made the admin user ${email}; the password is in .admin-credentials.`)
  }

  // What the key may do. An existing key gets these again, so it covers any
  // collection or global added since it was made.
  const label = 'Content seed and Claude Code'
  const permissions = {
    posts: { find: true, create: true, update: true, delete: true },
    services: { find: true, create: true, update: true, delete: true },
    media: { find: true, update: true },
    homePage: { find: true, update: true },
    privacyPolicy: { find: true, update: true },
    terms: { find: true, update: true },
    servicesPage: { find: true, update: true },
    materials: { find: true, create: true, update: true, delete: true },
    whatWeBuyPage: { find: true, update: true },
  }
  const { docs: keys } = await payload.find({
    collection: 'payload-mcp-api-keys',
    where: { label: { equals: label } },
    limit: 1,
  })
  if (keys.length > 0) {
    await payload.update({
      collection: 'payload-mcp-api-keys',
      id: keys[0].id,
      data: permissions,
      context,
    })
    return
  }
  const apiKey = crypto.randomUUID()
  await payload.create({
    collection: 'payload-mcp-api-keys',
    data: {
      user: users[0].id,
      label,
      description: 'Saves the website copy through the MCP server.',
      enableAPIKey: true,
      apiKey,
      ...permissions,
    },
    context,
  })
  appendFileSync(
    path.join(root, '.env'),
    `\n# The MCP API key seed/seed-content.mjs uses.\nPAYLOAD_MCP_API_KEY=${apiKey}\n`,
  )
  payload.logger.info('Made an MCP API key and saved it to .env as PAYLOAD_MCP_API_KEY.')
}
