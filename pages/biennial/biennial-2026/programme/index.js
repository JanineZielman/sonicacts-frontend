import { useEffect, useRef } from "react"
import {
  BIENNIAL_SLUG,
  PROGRAMME_SLUG,
  PROGRAMME_CLOUD_IMAGES,
} from "/lib/biennial/constants"
import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import LazyLoad from "react-lazyload"
import Moment from "moment"

const Programme = ({ global, festival, programme }) => {
  const aquarelleContainerRef = useRef(null)
  const programmeAttributes = programme?.attributes || {}
  const pageSeo = programmeAttributes?.seo || {
    metaTitle: "Programme",
    metaDescription:
      "Browse the Sonic Acts Biennial 2026 programme, spanning performances, installations, and talks.",
    shareImage: programmeAttributes?.hero_image?.data?.attributes?.url
      ? { url: programmeAttributes.hero_image.data.attributes.url }
      : undefined,
  }

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

  const programmeItems =
    programme?.attributes?.programme_item &&
      Array.isArray(programme.attributes.programme_item)
      ? programme.attributes.programme_item.filter((proItem) => {
        const biennialSlug =
          proItem?.programme_item?.data?.attributes?.biennial?.data
            ?.attributes?.slug
        return !biennialSlug || biennialSlug === BIENNIAL_SLUG
      })
      : []

  const programmeBackgrounds = programmeItems.map((_, index) => {
    return PROGRAMME_CLOUD_IMAGES[index % PROGRAMME_CLOUD_IMAGES.length]
  })

  return (
    <section className="festival-wrapper template-programme">
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
        <div className="title-wrapper">
          <h1 className="page-title">Programme</h1>
        </div>
        <div className="discover programme-wrapper">
          <div
            id="programme-overview-grid"
            className="discover-container programme-container"
          >
            {programmeItems.map((pro_item, i) => {
              const item = pro_item?.programme_item?.data
              const itemAttributes = item?.attributes
              if (!item || !itemAttributes) {
                return null
              }

              const programmeKey =
                item?.id || itemAttributes?.slug || `programme-${i}`
              const sanitizedProgrammeKey = String(programmeKey)
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "-")
              const cardBackgroundId = `programme-card-background-${sanitizedProgrammeKey}`
              const stableSlug =
                typeof itemAttributes?.slug === "string"
                  ? itemAttributes.slug
                    .toLowerCase()
                    .replace(/[^a-z0-9_-]/g, "-")
                  : null
              const background =
                programmeBackgrounds[i] || PROGRAMME_CLOUD_IMAGES[0]
              const backgroundImage = background.src
              const backgroundKey = backgroundImage
                .split("/")
                .pop()
                ?.replace(".webp", "")
              const backgroundColor = background.color
                ?.toLowerCase()
                .replace(/[^a-z0-9_-]/g, "-")

              const discoverItemClasses = [
                "discover-item",
                backgroundKey ? `discover-item--bg-${backgroundKey}` : null,
                backgroundColor
                  ? `discover-item--color-${backgroundColor}`
                  : null,
              ]

              if (item?.id) {
                discoverItemClasses.push(`discover-item--id-${item.id}`)
              } else if (stableSlug) {
                discoverItemClasses.push(`discover-item--slug-${stableSlug}`)
              }

              const whenWhere = Array.isArray(itemAttributes?.WhenWhere)
                ? itemAttributes.WhenWhere
                : []

              const sortedDates = whenWhere
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )

              const startDateRaw = sortedDates[0]?.date
              const endDateRaw = sortedDates[sortedDates.length - 1]?.date

              let start_date = startDateRaw
                ? new Date(startDateRaw.split("/").reverse().join("/"))
                : null
              let end_date = endDateRaw
                ? new Date(endDateRaw.split("/").reverse().join("/"))
                : null

              const biennialTags =
                itemAttributes?.biennial_tags?.data &&
                  Array.isArray(itemAttributes.biennial_tags.data)
                  ? itemAttributes.biennial_tags.data
                  : []

              const primaryTag = biennialTags[0]

              const rawTitle = itemAttributes.title || "Programme Item"
              let derivedCategory = null
              let derivedTitle = rawTitle

              if (!primaryTag?.attributes?.title) {
                const colonMatch = rawTitle.match(/^([^:]+):\s*(.+)$/)
                if (colonMatch) {
                  derivedCategory = colonMatch[1].trim()
                  derivedTitle = colonMatch[2].trim()
                }
              }

              const categoryLabel =
                primaryTag?.attributes?.title || derivedCategory || null

              const locationLabel = (itemAttributes.locations?.data || [])
                .map((loc) => loc?.attributes?.title?.trim())
                .filter(Boolean)
                .join(", ")

              const cardContent = (
                <div className="item-wrapper item-wrapper--text-only">
                  <a
                    href={`programme/${itemAttributes.slug || ""}`}
                    className="programme-card-link"
                  >
                    <div
                      className="card-background"
                      id={cardBackgroundId}
                      data-bg={backgroundKey}
                      data-color={backgroundColor}
                    >
                      <img src={backgroundImage} alt="" aria-hidden="true" />
                    </div>

                    {sortedDates.length > 0 &&
                      start_date &&
                      end_date &&
                      (() => {
                        const sameMonth =
                          Moment(start_date).format("MMM") ===
                          Moment(end_date).format("MMM")
                        const hasRange = sortedDates.length > 1
                        const rangeLabel = hasRange
                          ? sameMonth
                            ? `${Moment(start_date).format("D")}–${Moment(end_date).format("D MMM")}`
                            : `${Moment(start_date).format("D MMM")} – ${Moment(end_date).format("D MMM")}`
                          : Moment(start_date).format("D MMM")
                        const whenClass = [
                          "when",
                          rangeLabel === "5 Feb – 29 Mar"
                            ? "when--special"
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" ")
                        return (
                          <div className={whenClass}>
                            <span className="black-label">{rangeLabel}</span>
                          </div>
                        )
                      })()}

                    <div className="category-title-wrapper">
                      {categoryLabel && (
                        <span className="category">{categoryLabel}</span>
                      )}
                      <div className="title">
                        <span>{derivedTitle}</span>
                      </div>
                      {locationLabel && (
                        <div className="locations">{locationLabel}</div>
                      )}
                    </div>
                  </a>
                </div>
              )

              const shouldLazyLoad = i >= 16

              return (
                <div
                  className={discoverItemClasses.join(" ")}
                  key={programmeKey}
                >
                  {shouldLazyLoad ? (
                    <LazyLoad height={600} offset={200} once>
                      {cardContent}
                    </LazyLoad>
                  ) : (
                    cardContent
                  )}
                </div>
              )
            })}
            {programmeItems.length === 0 && (
              <p className="programme-empty">
                Programme information will be announced soon.
              </p>
            )}
            <div className="divider"></div>
          </div>
        </div>
      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
    slug: BIENNIAL_SLUG,
  }

  // Run API calls in parallel
  const [festivalRes, programmePageRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`
    ),
    fetchAPI(
      `/programme-pages?filters[slug][$eq]=${PROGRAMME_SLUG}&populate[programme_item][populate]=programme_item,programme_item.cover_image,programme_item.biennial_tags,programme_item.locations,programme_item.WhenWhere`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
      programme: programmePageRes?.data?.[0] || null,
    },
  }
}

export default Programme
