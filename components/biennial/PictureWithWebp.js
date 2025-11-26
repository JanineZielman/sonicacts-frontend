import React from "react"

const deriveWebpSrc = (src) => {
  if (typeof src !== "string") {
    return null
  }

  if (/\.png$/i.test(src)) {
    return src.replace(/\.png$/i, ".webp")
  }

  return null
}

const PictureWithWebp = ({ src, webpSrc, children, ...imgProps }) => {
  if (!src) {
    return null
  }

  const derivedWebpSrc = webpSrc || deriveWebpSrc(src)

  return (
    <picture>
      {derivedWebpSrc ? (
        <source srcSet={derivedWebpSrc} type="image/webp" />
      ) : null}
      <img src={src} {...imgProps} />
      {children}
    </picture>
  )
}

export default PictureWithWebp
