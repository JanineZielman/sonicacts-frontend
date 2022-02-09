import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, style }) => {
  const { url, alternativeText, width, height } = image

  const loader = () => {
    return getStrapiMedia(image)
  }

  return (
    <NextImage
      loader={loader}
      layout="intrinsic"
      width={width}
      height={height}
      objectFit="contain"
      src={getStrapiMedia(image)}
      alt={alternativeText || ""}
    />
  )
}

export default Image
