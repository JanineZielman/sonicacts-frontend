import { getStrapiMedia } from "/lib/biennial/media"
import NextImage from "next/image"

const Image = ({ image, fill, layout, objectFit, sizes, priority }) => {
  if (!image) {
    return null
  }

  const { name, alternativeText, width, height, formats = {} } = image

  const pickFormatForWidth = (requestedWidth) => {
    const availableFormats = Object.values(formats || {}).filter(Boolean)

    if (!availableFormats.length || !requestedWidth) {
      return image
    }

    const sortedFormats = [...availableFormats].sort(
      (a, b) => a.width - b.width
    )
    const matchingFormat = sortedFormats.find(
      (format) => format.width >= requestedWidth
    )

    return matchingFormat || sortedFormats[sortedFormats.length - 1] || image
  }

  const buildSrc = (format) => {
    const target = format?.url ? format : image

    if (!target?.url) {
      return ""
    }

    return getStrapiMedia(target)
  }

  const defaultFormat = pickFormatForWidth(width)
  const src = buildSrc(defaultFormat)
  const isSvg =
    image?.mime === "image/svg+xml" || src?.toLowerCase().endsWith(".svg")

  const resolvedAlt = alternativeText
    ? `Sonic Acts ${alternativeText}`
    : `Sonic Acts ${name}`

  if (!src) {
    return null
  }

  const baseProps = {
    src,
    alt: resolvedAlt,
    sizes,
    className: "img",
    priority,
  }

  if (objectFit) {
    baseProps.style = {
      ...(baseProps.style || {}),
      objectFit,
    }
  }

  if (isSvg) {
    baseProps.unoptimized = true
  }

  if (layout === "fill" || fill) {
    return (
      <span
        className="next-image-fill-wrapper"
        style={{
          position: "relative",
          display: "block",
      width: "100%",
      height: "100%",
    }}
  >
        <img className="img" src={'https://cms.sonicacts.com' + image.url} />
      </span>
    )
  }

  return (
    <NextImage
      {...baseProps}
      width={width || defaultFormat.width || 300}
      height={height || defaultFormat.height || 300}
    />
  )
}

export default Image
