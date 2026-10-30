import type { UploadFieldServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'

import './MessagePhotos.scss'

// Shows a message's photos in the admin (see Messages.ts) as a grid of
// pictures, where Payload's own upload field only shows tiny thumbnails next
// to the filenames. Each picture opens at full size in a new tab. The files
// need a login (see MessagePhotos.ts), so they're loaded as the signed in
// user, whose cookie the browser also sends for the pictures themselves.
export const MessagePhotos: UploadFieldServerComponent = async ({ clientField, data, req }) => {
  const ids = ((data?.photos ?? []) as (number | { id: number })[]).map((photo) =>
    typeof photo === 'object' ? photo.id : photo,
  )
  const { docs } =
    ids.length > 0
      ? await req.payload.find({
          collection: 'message-photos',
          depth: 0,
          limit: ids.length,
          overrideAccess: false,
          pagination: false,
          req,
          where: { id: { in: ids } },
        })
      : { docs: [] }
  // In the order the photos were sent.
  const photos = ids.flatMap((id) => docs.filter((doc) => doc.id === id))

  return (
    <div className="field-type message-photos">
      <FieldLabel label={clientField.label} path={clientField.name} />
      {photos.length > 0 ? (
        <ul className="message-photos__grid">
          {photos.map((photo) => (
            <li key={photo.id}>
              <a href={photo.url ?? undefined} rel="noopener" target="_blank">
                <img alt={photo.filename ?? ''} loading="lazy" src={photo.url ?? undefined} />
                <span>{photo.filename}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="message-photos__none">No photos were sent with this message.</p>
      )}
    </div>
  )
}
