import Layout from "/components/biennial/layout"
import BiennialArticle from "/components/biennial/biennial-article"
import NewsSection from "/components/biennial/frontpage/NewsSection"
import { fetchAPI } from "/lib/biennial/api"
import { BIENNIAL_SLUG, PROGRAMME_SLUG } from "/lib/biennial/constants"
import Head from "next/head"

const NewsItem = ({ global, festival, page, relations, programmeLoc }) => {
  if (!page || !relations) {
    return null
  }

  const pageWithSlug = page?.attributes
    ? {
      ...page,
      attributes: {
        ...page.attributes,
        slug: page.attributes.slug || "news",
      },
    }
    : page

  const programmeLocations = programmeLoc?.attributes?.location_item || []

  const currentSlug = pageWithSlug?.attributes?.slug || null

  const title =
    pageWithSlug?.attributes?.seo?.metaTitle ||
    pageWithSlug?.attributes?.title ||
    "Sonic Acts Biennial 2026 – News"
  const description =
    pageWithSlug?.attributes?.seo?.metaDescription ||
    pageWithSlug?.attributes?.excerpt ||
    "Latest news from Sonic Acts Biennial 2026: contemporary art, sound, and performance."
  const coverImagePath =
    relations?.attributes?.biennial_cover_image?.data?.attributes?.url ||
    relations?.attributes?.cover_image?.data?.attributes?.url ||
    ""
  const image = coverImagePath
    ? `https://cms.sonicacts.com/public${coverImagePath}`
    : "/biennial/biennial-2026/assets/og-image/250923-SAB-2026-19by9-1.jpg"
  const url = `/biennial/biennial-2026/news/${currentSlug}`
  const pageSeo = {
    metaTitle: title,
    metaDescription: description,
    shareImage: {
      url: image,
    },
    article: true,
  }

  return (
    <>
      <Head>
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Sonic Acts" />
      </Head>
      <Layout global={global} festival={festival} seo={pageSeo}>
        <NewsSection
          showListing
          initialSlug={currentSlug}
          excludeSlug={currentSlug}
          leadContent={
            <section id="news">
              <article className="news-card news-card--expanded news-card--single news-article">
                <BiennialArticle
                  page={pageWithSlug}
                  relations={relations}
                  programmeLocations={programmeLocations}
                  wrapperModifier="slug-single-news"
                />
              </article>
            </section>
          }
        />
      </Layout>
    </>
  )
}

export async function getServerSideProps({ params, query }) {
  const slug = params?.slug

  if (!slug) {
    return { notFound: true }
  }

  const preview = query.preview || process.env.NEXT_PUBLIC_PREVIEW
  const publicationState = preview
    ? "&publicationState=preview"
    : "&publicationState=live"

  const [pageRes, relationsRes, globalRes, festivalRes, programmeLocRes] =
    await Promise.all([
      fetchAPI(
        `/news-items?filters[slug][$eq]=${slug}${publicationState}&populate[content][populate]=*`
      ),
      fetchAPI(
        `/news-items?filters[slug][$eq]=${slug}${publicationState}&populate=*`
      ),
      fetchAPI(
        "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
        { populate: "*" }
      ),
      fetchAPI(
        `/biennials?filters[slug][$eq]=${BIENNIAL_SLUG}&populate[prefooter][populate]=*`
      ),
      fetchAPI(
        `/programme-pages?filters[slug][$eq]=${PROGRAMME_SLUG}&populate[location_item][populate]=*`
      ),
    ])

  const page = pageRes?.data?.[0] || null
  const relations = relationsRes?.data?.[0] || null

  if (!page || !relations) {
    return { notFound: true }
  }

  return {
    props: {
      page,
      relations,
      global: globalRes?.data ?? null,
      festival: festivalRes?.data?.[0] ?? null,
      programmeLoc: programmeLocRes?.data?.[0] ?? null,
    },
  }
}

export default NewsItem
