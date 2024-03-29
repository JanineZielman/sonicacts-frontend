import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, layout, objectFit, sizes  }) => {
  const { name, alternativeText, width, height } = image

  const loader = ({ width, quality }) => {
    return `${getStrapiMedia(image.formats?.large ? image.formats.large : image)}?w=${width}&q=${quality || 75}`
  }

  let imgUrl = image.formats?.large ? image.formats.large : image;

  return (
    <>
    {imgUrl.url?.startsWith("/") &&
    <>
    {layout == 'fill' ?
      <NextImage
        loader={loader}
        layout={layout}
        objectFit={objectFit}
        src={getStrapiMedia(imgUrl)}
        alt={`Sonic Acts ${alternativeText}` || `Sonic Acts ${name}`}
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
        src={getStrapiMedia(imgUrl)}
        alt={`Sonic Acts ${alternativeText}` || `Sonic Acts ${name}`}
        sizes={sizes}
        className="img"
      />
    }
    </>
    }
    </>
  )
}

export default Image
