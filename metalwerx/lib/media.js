// The CMS's photos are files in one bucket of its object storage (SeaweedFS,
// see metalwerx-payload), on the LAN. The site serves them itself at
// /media/<key> (see app/media/[...path]/route.js), so pages never link to the
// storage's private address and only this server needs to reach it.
export const MEDIA_BUCKET_URL =
  process.env.MEDIA_BUCKET_URL ?? "http://192.168.15.240:9000/metalwerx-media";

// "/media/home/photo.jpg" for a file's URL in the bucket, as the CMS gives it.
// Any other URL is returned as it is.
export function mediaPath(url) {
  const prefix = `${MEDIA_BUCKET_URL}/`;
  return url?.startsWith(prefix) ? `/media/${url.slice(prefix.length)}` : url;
}
