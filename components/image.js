import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, layout, objectFit, sizes  }) => {

  const { alternativeText, width, height } = image

  const loader = ({ width, quality }) => {
    return `${getStrapiMedia(image)}?w=${width}&q=${quality || 75}`
  }

  return (
    <>
    {layout == 'fill' ?
      <NextImage
        loader={loader}
        layout={layout}
        objectFit={objectFit}
        src={getStrapiMedia(image)}
        alt={alternativeText || ""}
        sizes={sizes}
        className="img"
      />
    :
     <NextImage
        loader={loader}
        layout={layout}
        width={width || 300} 
        height={height || 300}
        objectFit={objectFit}
        src={getStrapiMedia(image)}
        alt={alternativeText || ""}
        sizes={sizes}
        className="img"
      />
    }
    </>
  )
}

export default Image
