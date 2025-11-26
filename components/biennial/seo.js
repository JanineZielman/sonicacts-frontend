import Head from "next/head"
import { useContext, useMemo } from "react"
// import { GlobalContext } from "./_app"
import { getStrapiMedia } from "/lib/biennial/media"

const normalizeMedia = (media) => {
  if (!media) {
    return null
  }

  // Support both direct objects ({ url }) and Strapi relations ({ data: { attributes: { url }}})
  const mediaWithUrl =
    media?.data?.attributes?.url ? media.data.attributes : media?.url ? media : null

  if (!mediaWithUrl?.url) {
    return null
  }

  return getStrapiMedia(mediaWithUrl)
}

const Seo = ({ seo = {} }) => {
  const global = {}
  const { defaultSeo = {}, siteName = "Sonic Acts" } = global

  const fullSeo = useMemo(() => {
    const merged = {
      ...defaultSeo,
      ...seo,
    }

    const metaTitle = merged.metaTitle
      ? siteName
        ? `${merged.metaTitle} | ${siteName}`
        : merged.metaTitle
      : siteName

    const shareImage = normalizeMedia(merged.shareImage)

    return {
      ...merged,
      metaTitle,
      shareImage,
    }
  }, [defaultSeo, seo, siteName])

  if (
    !fullSeo.metaTitle &&
    !fullSeo.metaDescription &&
    !fullSeo.shareImage &&
    !fullSeo.article
  ) {
    return null
  }

  return (
    <Head>
      {fullSeo.metaTitle && (
        <>
          <title>{fullSeo.metaTitle}</title>
          <meta property="og:title" content={fullSeo.metaTitle} />
          <meta name="twitter:title" content={fullSeo.metaTitle} />
        </>
      )}
      {fullSeo.metaDescription && (
        <>
          <meta name="description" content={fullSeo.metaDescription} />
          <meta property="og:description" content={fullSeo.metaDescription} />
          <meta name="twitter:description" content={fullSeo.metaDescription} />
        </>
      )}
      {fullSeo.shareImage && (
        <>
          <meta property="og:image" content={fullSeo.shareImage} />
          <meta name="twitter:image" content={fullSeo.shareImage} />
          <meta name="image" content={fullSeo.shareImage} />
        </>
      )}
      <meta
        property="og:type"
        content={fullSeo.article ? "article" : "website"}
      />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}

export default Seo
