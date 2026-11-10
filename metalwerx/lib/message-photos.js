// The limits on the photos sent with a contact form message. The form checks
// them as photos are chosen and the Server Action checks them again (see
// app/contact-us/actions.js). next.config.mjs's serverActions.bodySizeLimit
// has to fit MAX_PHOTOS of MAX_PHOTO_SIZE, and the CMS takes up to 20 MB a
// file.

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

// What's wrong with the chosen files, as a sentence for the visitor, or null
// if they can all be sent. An input with nothing chosen still sends one empty
// file, so empty files don't count.
export function photosProblem(files) {
  const photos = files.filter((file) => file.size > 0);
  if (photos.length > MAX_PHOTOS) {
    return `Please choose up to ${MAX_PHOTOS} photos.`;
  }
  const notPhoto = photos.find((file) => !file.type.startsWith("image/"));
  if (notPhoto) return `${notPhoto.name} isn't a photo. Please choose image files only.`;
  const tooBig = photos.find((file) => file.size > MAX_PHOTO_SIZE);
  if (tooBig) {
    return `${tooBig.name} is too large. Each photo can be up to ${MAX_PHOTO_SIZE / 1024 / 1024} MB.`;
  }
  return null;
}
