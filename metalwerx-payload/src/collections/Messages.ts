import type { CollectionAfterDeleteHook, CollectionConfig } from 'payload'

// The messages sent from the website's contact form (/contact-us). The website
// creates them through the REST API with the shared MESSAGES_SECRET in an
// x-messages-secret header; nobody else can. Nobody can edit them either, so
// the admin panel shows them read-only. Reading and deleting them needs a
// login, as with any collection without its own access rules. The photos sent
// with a message are in the message-photos collection (see MessagePhotos.ts).

// Deletes a deleted message's photos, which nothing else uses.
const deletePhotos: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const ids = (doc.photos ?? []).map((photo: number | { id: number }) =>
    typeof photo === 'object' ? photo.id : photo,
  )
  if (ids.length > 0) {
    await req.payload.delete({ collection: 'message-photos', where: { id: { in: ids } }, req })
  }
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  access: {
    create: ({ req }) => {
      const secret = process.env.MESSAGES_SECRET
      return Boolean(secret) && req.headers.get('x-messages-secret') === secret
    },
    update: () => false,
  },
  admin: {
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    description: 'Messages sent from the contact form on the website.',
    useAsTitle: 'name',
  },
  defaultSort: '-createdAt',
  hooks: {
    afterDelete: [deletePhotos],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      maxLength: 200,
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      maxLength: 50,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 5000,
      required: true,
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'message-photos',
      hasMany: true,
      maxRows: 10,
      admin: {
        components: { Field: '/components/MessagePhotos#MessagePhotos' },
      },
    },
  ],
}
