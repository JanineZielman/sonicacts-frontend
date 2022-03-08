import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, layout, objectFit  }) => {
  const { alternativeText, width, height } = image


  const loader = () => {
    return getStrapiMedia(image)
  }

  return (
    <NextImage
      loader={loader}
      layout={layout}
      width={width}
      height={height}
      objectFit={objectFit}
      src={getStrapiMedia(image)}
      alt={alternativeText || ""}
      className="img"
    />
  )
}

export default Image
