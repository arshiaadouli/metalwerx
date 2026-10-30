import type { CollectionConfig } from 'payload'

// The photos sent with contact form messages (see Messages.ts). They're the
// public's photos, so they stay out of the media collection's object storage,
// whose bucket anyone can read: the files are on this server's disk, in
// message-photos/, and like the messages themselves only a login can see
// them. The website uploads them with the shared MESSAGES_SECRET before it
// saves the message that lists them. Deleting a message deletes its photos.
export const MessagePhotos: CollectionConfig = {
  slug: 'message-photos',
  labels: { singular: 'Message Photo', plural: 'Message Photos' },
  access: {
    create: ({ req }) => {
      const secret = process.env.MESSAGES_SECRET
      return Boolean(secret) && req.headers.get('x-messages-secret') === secret
    },
    update: () => false,
  },
  admin: {
    defaultColumns: ['filename', 'filesize', 'createdAt'],
    description: 'Photos sent with messages from the contact form on the website.',
    useAsTitle: 'filename',
  },
  defaultSort: '-createdAt',
  fields: [],
  upload: {
    mimeTypes: ['image/*'],
    staticDir: 'message-photos',
  },
}
