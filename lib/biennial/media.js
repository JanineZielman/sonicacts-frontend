// import { getStrapiURL } from "./api";

export function getStrapiMedia(media) {
  const imageUrl = media.url.startsWith("/")
    ? "https://cms.sonicacts.com" + media.url
    : media.url
  return imageUrl
}
