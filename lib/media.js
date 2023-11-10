// import { getStrapiURL } from "./api";

export function getStrapiMedia(media) {
  console.log(media)
  const imageUrl = media.url.startsWith("/")
    ? 'https://cms.sonicacts.com/public' + media.url
    : media.url;
  return imageUrl;
}