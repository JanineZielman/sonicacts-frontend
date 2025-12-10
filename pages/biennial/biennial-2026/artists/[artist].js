import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import { fetchAPI } from "/lib/biennial/api"
import Layout from "/components/biennial/layout"
import BiennialArticle from "/components/biennial/biennial-article"
import Moment from "moment"
import Image from "/components/biennial/image"
import React, { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import ArtistCard from "/components/biennial/artist-card"

const CommunityItem = ({
  params,
  page,
  global,
  relations,
  programmes,
  festival,
  allArtists = [],
}) => {
  const aquarelleContainerRef = useRef(null)

  // useEffect(() => {
  //   if (process.env.NODE_ENV !== "production") {
  //     // Log page/remix data client-side so it appears in the browser console
  //     // eslint-disable-next-line no-console
  //     console.log("[SingleArtist] page prop:", page)
  //     // eslint-disable-next-line no-console
  //     console.log("[SingleArtist] relations prop:", relations)
  //   }
  // }, [page, relations])

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const container = aquarelleContainerRef.current
    if (!container) {
      return undefined
    }

    const overlays = Array.from(
      container.querySelectorAll("[data-parallax-speed]")
    )

    if (overlays.length === 0) {
      return undefined
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || 0

      overlays.forEach((overlay) => {
        const speed = Number(overlay.dataset.parallaxSpeed || 0)
        const offset = scrollY * speed
        overlay.style.setProperty("--parallax-offset", `${offset}px`)
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  page.attributes.slug = `community`

  const relationsAttributes = relations?.attributes || {}
  const communityItems = relationsAttributes?.community_items?.data || []
  const filteredAllArtists = allArtists.filter(
    (artist) => artist?.attributes?.slug !== params.artist
  )
  const getRelationItems = (relationField) =>
    Array.isArray(relationField?.data) ? relationField.data : []
  const programmeHasValidParent = (programmeAttributes) => {
    if (!programmeAttributes) {
      return false
    }

    return getRelationItems(
      programmeAttributes.main_programme_items
    ).some((parentItem) => {
      const parentSlug = parentItem?.attributes?.slug
      return parentSlug && parentSlug !== programmeAttributes.slug
    })
  }
  const programmesData = programmes?.data || []
  const programmeChildCountsBySlug = programmesData.reduce(
    (acc, programmeItem) => {
      const attributes = programmeItem?.attributes || {}
      const itemSlug = attributes?.slug
      if (!itemSlug) {
        return acc
      }

      const parentEntries = getRelationItems(
        attributes?.main_programme_items
      )
      parentEntries.forEach((parentEntry) => {
        const parentSlug = parentEntry?.attributes?.slug
        if (parentSlug && parentSlug !== itemSlug) {
          acc[parentSlug] = (acc[parentSlug] || 0) + 1
        }
      })

      const directSubProgrammes = getRelationItems(
        attributes?.sub_programme_items
      )
      if (directSubProgrammes.length > 0) {
        acc[itemSlug] = Math.max(
          acc[itemSlug] || 0,
          directSubProgrammes.length
        )
      }

      return acc
    },
    {}
  )
  const filteredProgrammesData = programmesData.filter((programmeItem) => {
    const attributes = programmeItem?.attributes
    if (!attributes) {
      return false
    }

    const programmeBiennialSlug =
      attributes?.biennial?.data?.attributes?.slug

    return programmeBiennialSlug === BIENNIAL_SLUG
  })
  const hasVisibleSubEvents = filteredProgrammesData.some((programmeItem) =>
    programmeHasValidParent(programmeItem?.attributes)
  )
  const contentBlocks = page?.attributes?.content || []
  const firstContentImageIndex = contentBlocks.findIndex(
    (block) =>
      block?.__component === "basic.image" && block?.image?.data?.attributes
  )
  const firstContentImageBlock =
    firstContentImageIndex > -1 ? contentBlocks[firstContentImageIndex] : null
  const coverImageAttributes =
    relationsAttributes?.cover_image?.data?.attributes
  const biennialCoverAttributes =
    relationsAttributes?.biennial_cover_image?.data?.attributes
  const contentImageAttributes = firstContentImageBlock?.image?.data?.attributes
  const heroImageAttributes =
    coverImageAttributes ||
    biennialCoverAttributes ||
    contentImageAttributes ||
    null
  const heroUsesContentImage = Boolean(
    heroImageAttributes &&
    contentImageAttributes &&
    heroImageAttributes === contentImageAttributes
  )
  const heroImageCaption = heroUsesContentImage
    ? firstContentImageBlock?.image_caption
    : null
  const filteredContent =
    heroUsesContentImage && firstContentImageIndex > -1
      ? contentBlocks.filter((_, idx) => idx !== firstContentImageIndex)
      : contentBlocks
  const articlePage = heroUsesContentImage
    ? {
      ...page,
      attributes: {
        ...page.attributes,
        content: filteredContent,
      },
    }
    : page
  const leftColumnImageAttributes = heroUsesContentImage
    ? contentImageAttributes
    : coverImageAttributes || biennialCoverAttributes
  const shouldRenderLeftImage = Boolean(leftColumnImageAttributes)
  const biennialArticleShowHero = !shouldRenderLeftImage
  const leftColumnImageOrientation =
    leftColumnImageAttributes?.width && leftColumnImageAttributes?.height
      ? leftColumnImageAttributes.height >= leftColumnImageAttributes.width
        ? "portrait"
        : "landscape"
      : null
  const leftColumnImageClassName = [
    "single-artist-layout__image",
    leftColumnImageOrientation
      ? `single-artist-layout__image--${leftColumnImageOrientation}`
      : null,
  ]
    .filter(Boolean)
    .join(" ")
  const pageSeo =
    page?.attributes?.seo || {
      metaTitle:
        relationsAttributes?.title || page?.attributes?.title || "Artist",
      metaDescription:
        page?.attributes?.excerpt ||
        relationsAttributes?.excerpt ||
        "Artist profile for Sonic Acts Biennial 2026.",
      shareImage: heroImageAttributes?.url
        ? { url: heroImageAttributes.url }
        : undefined,
      article: true,
    }

  return (
    <section className="festival-wrapper template-single-artist">
      <div className="single-artist-layout__sketch-layer" aria-hidden="true" />
      <div
        className="single-artist-layout__aquarelles"
        ref={aquarelleContainerRef}
        aria-hidden="true"
      >
        <div
          className="single-artist-layout__aquarelle single-artist-layout__aquarelle--center"
          data-parallax-speed="-0.3"
        >
          <img src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-1.webp" alt="" />
        </div>
        <div
          className="single-artist-layout__aquarelle single-artist-layout__aquarelle--right"
          data-parallax-speed="0.4"
        >
          <img src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-6.webp" alt="" />
        </div>
        <div
          className="single-artist-layout__aquarelle single-artist-layout__aquarelle--left"
          data-parallax-speed="-0.7"
        >
          <img src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-dach.webp" alt="" />
        </div>
      </div>
      <Layout global={global} festival={festival} seo={pageSeo}>
        <div className="single-artist-layout">
          <aside className="single-artist-layout__media">
            {shouldRenderLeftImage && (
              <div className={leftColumnImageClassName}>
                <Image
                  image={leftColumnImageAttributes}
                  layout="responsive"
                  fill
                  objectFit="cover"
                />
              </div>
            )}
            {heroImageCaption && (
              <div className="single-artist-layout__caption">
                <ReactMarkdown children={heroImageCaption} />
              </div>
            )}
          </aside>

          <div className="single-artist-layout__content">
            <BiennialArticle
              page={articlePage}
              relations={relations}
              params={params}
              wrapperModifier="single-artist-content"
              showHero={biennialArticleShowHero}
            />
          </div>

          <aside className="single-artist-layout__related">
            <div
              className={[
                "discover sub single-artist-related",
                hasVisibleSubEvents
                  ? "has-sub-events"
                  : "has-no-subevents",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="subtitle">
                <h2>{`Programme${filteredProgrammesData.length > 1 ? "s" : ""}`}</h2>
              </div>
              <div className="discover-container programme-container">
                {filteredProgrammesData.map((item, i) => {
                  const programmeKey =
                    item.id || item.attributes?.slug || `programme-${i}`
                  const attributes = item?.attributes || {}
                  const slug = attributes?.slug
                  const whenWhere = attributes.WhenWhere || []
                  const sortedDates = [...whenWhere].sort((a, b) => {
                    const dateA = a?.date
                      ? new Date(a.date.split("/").reverse().join("-"))
                      : null
                    const dateB = b?.date
                      ? new Date(b.date.split("/").reverse().join("-"))
                      : null
                    return (
                      (dateA?.getTime?.() || 0) - (dateB?.getTime?.() || 0)
                    )
                  })
                  const firstDateEntry = sortedDates[0]
                  const lastDateEntry = sortedDates[sortedDates.length - 1]
                  const startDate = firstDateEntry?.date
                    ? new Date(
                      firstDateEntry.date.split("/").reverse().join("-")
                    )
                    : null
                  const endDate = lastDateEntry?.date
                    ? new Date(
                      lastDateEntry.date.split("/").reverse().join("-")
                    )
                    : null
                  const isSingleDay =
                    sortedDates.length === 1 ||
                    (startDate &&
                      endDate &&
                      Moment(startDate).isSame(endDate, "day"))

                  let dateLabel = ""
                  if (startDate && endDate) {
                    const sameMonth =
                      Moment(startDate).format("MMM") ===
                      Moment(endDate).format("MMM")

                    if (isSingleDay) {
                      dateLabel = Moment(startDate).format("D MMM")
                    } else if (sameMonth) {
                      dateLabel = `${Moment(startDate).format("D")}–${Moment(endDate).format("D MMM")}`
                    } else {
                      dateLabel = `${Moment(startDate).format("D MMM")} - ${Moment(endDate).format("D MMM")}`
                    }
                  }

                  const timeLabel = isSingleDay
                    ? [firstDateEntry?.start_time, firstDateEntry?.end_time]
                      .filter(Boolean)
                      .join(" - ")
                    : ""
                  const locationLabel = (attributes?.locations?.data || [])
                    .map((loc) => loc?.attributes?.title?.trim())
                    .filter(Boolean)
                    .join(", ")
                  const isSubProgramme = programmeHasValidParent(attributes)
                  const directSubProgrammes = getRelationItems(
                    attributes?.sub_programme_items
                  )
                  const hasDirectSubProgrammes = directSubProgrammes.some(
                    (child) => {
                      const childSlug = child?.attributes?.slug
                      return childSlug && childSlug !== slug
                    }
                  )
                  const derivedChildCount = slug
                    ? programmeChildCountsBySlug[slug] || 0
                    : 0
                  const hasSubProgrammes =
                    hasDirectSubProgrammes || derivedChildCount > 0
                  const discoverItemClassName = [
                    "discover-item",
                    isSubProgramme
                      ? "discover-item--sub-programme"
                      : "discover-item--main-programme",
                    hasSubProgrammes
                      ? "discover-item--has-sub-programmes"
                      : "discover-item--no-sub-programmes",
                  ]
                    .filter(Boolean)
                    .join(" ")

                  return (
                    <div className={discoverItemClassName} key={programmeKey}>
                      <div className="item-wrapper">
                        <a href={"/biennial/biennial-2026/programme/" + slug}>
                          <div className="image">
                            <div className="image-inner">
                              {attributes?.cover_image?.data && (
                                <Image
                                  image={
                                    attributes.cover_image?.data
                                      ?.attributes
                                  }
                                  layout="fill"
                                  objectFit="cover"
                                />
                              )}
                            </div>
                          </div>

                          {dateLabel && (
                            <div className="single-artist-timing">
                              <div className="single-artist-timing__date">
                                {dateLabel}
                              </div>
                              {timeLabel && (
                                <div className="single-artist-timing__time">
                                  {timeLabel}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="category-title-wrapper">
                            <div className="title">
                              {attributes?.title}
                            </div>
                            {locationLabel && (
                              <div className="locations">
                                {locationLabel}
                              </div>
                            )}
                          </div>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
        {filteredAllArtists.length > 0 && (
          <section className="discover artists single-artist-all">
            <div className="subtitle">
              <h1>Artists</h1>
            </div>
            <div className="discover-container">
              <div className="items-wrapper">
                {filteredAllArtists.map((artist, index) => {
                  const artistKey =
                    artist.id ||
                    artist.attributes?.slug ||
                    `all-artist-${index}`
                  return (
                    <ArtistCard
                      key={artistKey}
                      item={artist}
                      sizes="(max-width: 768px) 60vw, 320px"
                    />
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </section>
  )
}

export async function getServerSideProps({ params }) {
  const biennial = {
    slug: BIENNIAL_SLUG,
  }

  const preview =
    String(process.env.NEXT_PUBLIC_PREVIEW || "").toLowerCase() === "true"
  const pageRes = await fetchAPI(
    `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : "&publicationState=live"}&populate[content][populate]=*&populate[links]=*`
  )

  const pageRel = await fetchAPI(
    `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : "&publicationState=live"}&populate[community_items][populate]=*&populate[links]=*&populate=*`
  )

  const programmesRes = await fetchAPI(
    `/community-items?filters[slug][$eq]=${params.artist}${preview ? "&publicationState=preview" : "&publicationState=live"}&populate[programme_items][populate]=*`
  )

  const allArtistsRes = await fetchAPI(
    `/community-items?filters[biennials][slug][$eq]=${biennial.slug}&sort[0]=slug:asc&pagination[limit]=100&populate=*`
  )
  const [festivalRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  const allArtists = Array.isArray(allArtistsRes?.data)
    ? [...allArtistsRes.data]
    : []
  allArtists.sort((a, b) => {
    const slugA = a?.attributes?.slug?.toLowerCase?.() || ""
    const slugB = b?.attributes?.slug?.toLowerCase?.() || ""
    if (slugA < slugB) return -1
    if (slugA > slugB) return 1
    return 0
  })

  // if (process.env.NODE_ENV !== "production") {
  //   // Log the raw responses to inspect available fields (e.g., socials)
  //   console.log(
  //     "[SingleArtist] pageRes data:",
  //     JSON.stringify(pageRes?.data?.[0] || null, null, 2)
  //   )
  //   console.log(
  //     "[SingleArtist] relations data:",
  //     JSON.stringify(pageRel?.data?.[0] || null, null, 2)
  //   )
  // }

  return {
    props: {
      festival: festivalRes.data[0],
      page: pageRes.data[0],
      global: globalRes.data,
      relations: pageRel.data[0],
      programmes: programmesRes.data[0].attributes.programme_items,
      params: params,
      allArtists,
    },
  }
}

export default CommunityItem
