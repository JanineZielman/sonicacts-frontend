import {
  BIENNIAL_SLUG,
  PROGRAMME_SLUG,
  PROGRAMME_CLOUD_IMAGES,
} from "/lib/biennial/constants"
import { useEffect, useState, useRef, useMemo } from "react"
import { fetchAPI } from "/lib/biennial/api"
import Layout from "/components/biennial/layout"
import BiennialArticle from "/components/biennial/biennial-article"
import Image from "/components/biennial/image"
import Link from "next/link"
import Modal from "react-modal"
import ReactMarkdown from "react-markdown"

import Moment from "moment"

const getArtistCountClass = (count) => {
  if (count <= 0) {
    return null
  }
  if (count === 1) {
    return "one-artists"
  }
  if (count === 2) {
    return "two-artists"
  }
  if (count === 3) {
    return "three-artists"
  }
  if (count === 4) {
    return "four-artists"
  }
  return "more-than-four-artists"
}

const ProgrammeItem = ({
  page,
  global,
  relations,
  params,
  sub,
  festival,
  programmePage,
}) => {
  console.log(sub)
  const festivalRangeLabel = "5 Feb – 29 Mar"
  const relationsAttributes = relations?.attributes || {}
  const programmeLocations =
    programmePage?.attributes?.location_item &&
      Array.isArray(programmePage.attributes.location_item)
      ? programmePage.attributes.location_item
      : []
  const communityItems =
    relationsAttributes?.community_items?.data &&
      Array.isArray(relationsAttributes.community_items.data)
      ? relationsAttributes.community_items.data
      : []
  const artworkItems =
    (Array.isArray(relationsAttributes?.artworks?.data)
      ? relationsAttributes.artworks.data
      : null) ||
    (Array.isArray(relationsAttributes?.artwork_items?.data)
      ? relationsAttributes.artwork_items.data
      : null) ||
    []
  const rawProgrammeEntries = Array.isArray(
    programmePage?.attributes?.programme_item
  )
    ? programmePage.attributes.programme_item
    : []
  const allProgrammeEntries = rawProgrammeEntries.filter((entry) => {
    const biennialSlug =
      entry?.programme_item?.data?.attributes?.biennial?.data?.attributes?.slug
    return !biennialSlug || biennialSlug === BIENNIAL_SLUG
  })
  const programmeBackgrounds = allProgrammeEntries.map((_, index) => {
    return PROGRAMME_CLOUD_IMAGES[index % PROGRAMME_CLOUD_IMAGES.length]
  })
  const allProgrammeItems =
    relationsAttributes?.main_programme_items?.data &&
      Array.isArray(relationsAttributes.main_programme_items.data)
      ? relationsAttributes.main_programme_items.data
      : []
  const doorsOpenFallback =
    relationsAttributes?.doors_open ||
    page?.attributes?.doors_open ||
    relationsAttributes?.doors_open_time
  const partnerLogos =
    relationsAttributes?.logos?.data &&
      Array.isArray(relationsAttributes.logos.data)
      ? relationsAttributes.logos.data
      : []
  const fallbackPrefooterLogos =
    festival?.attributes?.prefooter?.logos?.data || []
  const logosToRender = partnerLogos.length
    ? partnerLogos
    : fallbackPrefooterLogos

  const [subItems, setSubItems] = useState()
  const [isMobileView, setIsMobileView] = useState(false)
  const [isContentCollapsed, setIsContentCollapsed] = useState(false)
  const aquarelleContainerRef = useRef(null)
  const pageSlug = page?.attributes?.slug || ""
  const artistsFirstSlugs = new Set([
    "exhibition-w139",
    "exhibition-arti-et-amicitiae",
    "rozenstraat-exhibition",
    "framer-framed",
  ])
  const isArtistsFirst = artistsFirstSlugs.has(pageSlug)
  const getEarliestWhenWhereDate = (item) => {
    const entries = Array.isArray(item?.attributes?.WhenWhere)
      ? item.attributes.WhenWhere
      : []
    const parsedDates = entries
      .map((when) => {
        const rawDate = when?.date
        if (!rawDate) return null
        const normalizedDate = rawDate.includes("/")
          ? rawDate.split("/").reverse().join("-")
          : rawDate
        const time = when?.start_time || "00:00"
        const date = new Date(`${normalizedDate}T${time}`)
        return Number.isNaN(date.getTime()) ? null : date
      })
      .filter(Boolean)
      .sort((a, b) => a - b)
    return parsedDates[0] || null
  }

  useEffect(() => {
    const subData = Array.isArray(sub) ? [...sub] : []

    if (!subData.length) {
      setSubItems([])
      return
    }

    subData.sort((a, b) => {
      const dateA = getEarliestWhenWhereDate(a)
      const dateB = getEarliestWhenWhereDate(b)
      if (dateA && dateB) {
        return dateA - dateB
      }
      if (dateA) return -1
      if (dateB) return 1
      const titleA = a?.attributes?.title?.toLowerCase() || ""
      const titleB = b?.attributes?.title?.toLowerCase() || ""
      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })

    setSubItems(subData)
  }, [sub, page])

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Sub events for programme", params?.programme, subItems)
      console.log("Raw sub prop", sub)
      const linkedLocations =
        relations?.attributes?.locations?.data?.map((loc) => ({
          slug: loc?.attributes?.slug,
          title: loc?.attributes?.title,
        })) || []
      const linkedArtworks =
        relations?.attributes?.artworks?.data ||
        relations?.attributes?.artwork_items?.data ||
        []
      const linkedPeople = relations?.attributes?.community_items?.data || []
      const normalizedPeople = linkedPeople.map((person) => {
        const attrs = person?.attributes || {}
        return {
          id: person?.id,
          slug: attrs.slug,
          name: attrs.name,
          hasAttributes: Boolean(person?.attributes),
          attributeKeys: Object.keys(attrs || {}),
          coverImage: Boolean(attrs?.cover_image?.data),
          artworksCount: attrs?.artworks?.data?.length || 0,
          locationsCount: attrs?.locations?.data?.length || 0,
        }
      })
      console.log("Linked locations", linkedLocations)
      console.log("[programme] linked artworks (full detail)", {
        count: linkedArtworks.length,
        artworks: linkedArtworks.map((item) => {
          const attrs = item?.attributes || {}
          const artists =
            attrs.community_items?.data
              ?.map((artist) => ({
                id: artist?.id,
                slug: artist?.attributes?.slug,
                name: artist?.attributes?.name,
              }))
              .filter(Boolean) || []
          const locations =
            attrs.locations?.data
              ?.map((loc) => ({
                id: loc?.id,
                slug: loc?.attributes?.slug,
                title: loc?.attributes?.title,
              }))
              .filter(Boolean) || []
          const whenWhere =
            Array.isArray(attrs.WhenWhere) && attrs.WhenWhere.length
              ? attrs.WhenWhere
              : []
          return {
            id: item?.id,
            slug: attrs.slug,
            title: attrs.title,
            artists,
            locations,
            whenWhere,
            rawAttributes: attrs,
          }
        }),
      })
      console.log("[programme] people (community_items)", {
        count: linkedPeople.length,
        people: normalizedPeople,
      })
    }
  }, [params?.programme, subItems, sub, relations])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (params?.programme !== "exhibition-2026") {
      return
    }

    const parentLocations =
      relations?.attributes?.locations?.data
        ?.map((loc) => loc?.attributes?.slug)
        .filter(Boolean) || []

    if (!parentLocations.length) {
      console.log(
        "[programme] exhibition-2026 has no linked locations to compare against"
      )
      return
    }

    const subList = Array.isArray(subItems) ? subItems : []
    const matchingSubs = subList.filter((item) => {
      const locSlugs =
        item?.attributes?.locations?.data
          ?.map((loc) => loc?.attributes?.slug)
          .filter(Boolean) || []
      return locSlugs.some((slug) => parentLocations.includes(slug))
    })

    console.log("[programme] exhibition-2026 location matches", {
      parentLocations,
      matchedCount: matchingSubs.length,
      totalSubCount: subList.length,
      matched: matchingSubs.map((item) => ({
        id: item?.id,
        slug: item?.attributes?.slug,
        title: item?.attributes?.title,
        locations:
          item?.attributes?.locations?.data
            ?.map((loc) => loc?.attributes?.slug)
            .filter(Boolean) || [],
      })),
    })
  }, [params?.programme, relations, subItems])

  const sortedCommunityItems = useMemo(() => {
    return [...communityItems].sort((a, b) => {
      const slugA = a?.attributes?.slug?.toLowerCase() || ""
      const slugB = b?.attributes?.slug?.toLowerCase() || ""
      if (slugA < slugB) {
        return -1
      }
      if (slugA > slugB) {
        return 1
      }
      return 0
    })
  }, [communityItems])
  const artistCountClass = getArtistCountClass(sortedCommunityItems.length)
  const firstContentImageBlock = (page?.attributes?.content || []).find(
    (block) =>
      block?.__component === "basic.image" && block?.image?.data?.attributes
  )
  const heroImageAttributes =
    relationsAttributes?.cover_image?.data?.attributes ||
    relationsAttributes?.biennial_cover_image?.data?.attributes ||
    firstContentImageBlock?.image?.data?.attributes ||
    null
  const heroImageOrientation =
    heroImageAttributes?.width && heroImageAttributes?.height
      ? heroImageAttributes.height >= heroImageAttributes.width
        ? "portrait"
        : "landscape"
      : null
  const heroImageClassName = [
    "single-artist-layout__image",
    heroImageOrientation
      ? `single-artist-layout__image--${heroImageOrientation}`
      : null,
  ]
    .filter(Boolean)
    .join(" ")

  const locationEntries =
    relationsAttributes?.locations?.data &&
      Array.isArray(relationsAttributes.locations.data)
      ? relationsAttributes.locations.data
      : []
  const primaryLocationLabel = locationEntries
    .map((loc) => {
      const title = loc?.attributes?.title?.trim()
      const subtitle = loc?.attributes?.subtitle?.trim()
      if (!title) {
        return null
      }
      return subtitle ? `${title} – ${subtitle}` : title
    })
    .filter(Boolean)
    .join(", ")

  const parseWhenWhereDate = (value) => {
    if (typeof value !== "string") {
      return null
    }
    const trimmed = value.trim()
    if (!trimmed) {
      return null
    }
    const parsed = Moment(trimmed, ["DD/MM/YYYY", "YYYY-MM-DD"], true)
    if (parsed.isValid()) {
      return parsed.toDate()
    }
    const fallback = trimmed.includes("/")
      ? trimmed.split("/").reverse().join("/")
      : trimmed
    const fallbackDate = new Date(fallback)
    return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate
  }

  const formatWhenWhereRangeLabel = (entries) => {
    const normalized = (Array.isArray(entries) ? entries : [])
      .map((entry) => ({
        ...entry,
        parsedDate: parseWhenWhereDate(entry?.date),
      }))
      .filter((entry) => entry.parsedDate instanceof Date && !Number.isNaN(entry.parsedDate.getTime()))
      .sort((a, b) => a.parsedDate - b.parsedDate)

    if (!normalized.length) {
      return null
    }

    const startDate = normalized[0].parsedDate
    const endDate = normalized[normalized.length - 1].parsedDate
    let rangeLabel = Moment(startDate).format("D MMM")

    if (normalized.length > 1) {
      if (Moment(startDate).format("MMM") === Moment(endDate).format("MMM")) {
        rangeLabel = `${Moment(startDate).format("D")}–${Moment(endDate).format("D MMM")}`
      } else {
        rangeLabel = `${Moment(startDate).format("D MMM")}–${Moment(endDate).format("D MMM")}`
      }
    }

    return { rangeLabel, startDate, endDate }
  }

  const customWhenWhere = (() => {
    const candidates = [
      page?.attributes?.custom_when_where,
      relationsAttributes?.custom_when_where,
      ...(Array.isArray(relationsAttributes?.WhenWhere)
        ? relationsAttributes.WhenWhere.map((entry) => entry?.custom_when_where)
        : []),
    ]

    const first = candidates.find(
      (val) => typeof val === "string" && val.trim().length > 0
    )

    return typeof first === "string" ? first.trim() : ""
  })()
  const shouldRespectHiddenWhen =
    page?.attributes?.hide_when_where === true && !customWhenWhere
  const hasCustomWhenWhere = Boolean(customWhenWhere)

  const primaryWhenWhereSummary = (() => {
    if (shouldRespectHiddenWhen) {
      return null
    }
    const whenEntries = Array.isArray(relationsAttributes?.WhenWhere)
      ? relationsAttributes.WhenWhere.filter((entry) => entry?.date)
      : []
    if (!whenEntries.length) {
      return null
    }
    const normalizedEntries = whenEntries
      .map((entry) => {
        const parsedDate = parseWhenWhereDate(entry.date)
        if (!parsedDate) {
          return null
        }
        return { ...entry, parsedDate }
      })
      .filter(Boolean)
      .sort((a, b) => a.parsedDate - b.parsedDate)
    if (!normalizedEntries.length) {
      return null
    }

    const startDateObj = normalizedEntries[0].parsedDate
    const endDateObj =
      normalizedEntries[normalizedEntries.length - 1].parsedDate
    let rangeLabel = null

    if (startDateObj && endDateObj) {
      const startMoment = Moment(startDateObj)
      const endMoment = Moment(endDateObj)
      if (
        normalizedEntries.length > 1 &&
        startMoment.format("MMM") === endMoment.format("MMM")
      ) {
        rangeLabel = `${startMoment.format("D")}–${endMoment.format("D MMM")}`
      } else if (normalizedEntries.length > 1) {
        rangeLabel = `${startMoment.format("D MMM")} – ${endMoment.format(
          "D MMM"
        )}`
      } else {
        rangeLabel = startMoment.format("D MMM")
      }
    } else if (startDateObj) {
      rangeLabel = Moment(startDateObj).format("D MMM")
    }

    if (rangeLabel === festivalRangeLabel) {
      rangeLabel = null
    }

    const firstEntry = normalizedEntries[0]
    const timeLabel =
      normalizedEntries.length === 1 && firstEntry?.start_time
        ? firstEntry.end_time
          ? `${firstEntry.start_time}–${firstEntry.end_time}`
          : firstEntry.start_time
        : null
    const doorsOpen = firstEntry?.doors_open || firstEntry?.doorsOpen

    if (!rangeLabel && !timeLabel) {
      return doorsOpen ? { doorsOpen } : null
    }

    return { rangeLabel, timeLabel, doorsOpen }
  })()

  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const ticketModalStyles = {
    overlay: {
      backgroundColor: "transparent",
    },
  }
  const handleTicketClose = () => setTicketModalOpen(false)
  const handleTicketShow = () => setTicketModalOpen(true)
  const ticketLink = relationsAttributes.ticket_link
  const ticketTitleClass = relationsAttributes?.title?.replace(/\s|:/g, "")
  const ticketClasses = [
    "ticket",
    ticketLink ? "" : "available-soon",
    relationsAttributes.price === "SOLD OUT" ? "sold-out" : "",
    ticketTitleClass,
  ]
    .filter(Boolean)
    .join(" ")
  const hasTickets = Boolean(ticketLink || relationsAttributes.price)
  const hasArtists = sortedCommunityItems.length > 0
  const hasSubEvents = Boolean(subItems?.length)
  const hasNonEmptyString = (val) => typeof val === "string" && val.trim().length > 0
  const doorsLabel =
    hasNonEmptyString(primaryWhenWhereSummary?.doorsOpen)
      ? primaryWhenWhereSummary.doorsOpen
      : hasNonEmptyString(doorsOpenFallback)
        ? doorsOpenFallback
        : ""
  const hasWhenWhereContent = Boolean(
    primaryWhenWhereSummary?.rangeLabel ||
    primaryWhenWhereSummary?.timeLabel ||
    hasNonEmptyString(primaryLocationLabel) ||
    (hasCustomWhenWhere && hasNonEmptyString(customWhenWhere)) ||
    hasNonEmptyString(doorsLabel)
  )
  const showWhenWhereDetails = Boolean(
    primaryWhenWhereSummary ||
    hasCustomWhenWhere ||
    hasNonEmptyString(primaryLocationLabel)
  )
  const pageSubtitle =
    relationsAttributes?.subtitle?.trim() || page?.attributes?.subtitle?.trim()
  const parentProgrammes =
    Array.isArray(relationsAttributes?.main_programme_items?.data) &&
      relationsAttributes.main_programme_items.data.length > 0
      ? relationsAttributes.main_programme_items.data
      : []
  const fallbackTitle =
    relationsAttributes?.title || page?.attributes?.title || "Programme"
  const fallbackDescription =
    relationsAttributes?.excerpt ||
    page?.attributes?.excerpt ||
    "Programme item details from Sonic Acts Biennial 2026."
  const shareImageAttributes =
    relationsAttributes?.biennial_cover_image?.data?.attributes ||
    relationsAttributes?.cover_image?.data?.attributes ||
    heroImageAttributes
  const shareImage =
    shareImageAttributes?.url && !shareImageAttributes?.data
      ? { url: shareImageAttributes.url }
      : undefined
  const pageSeo = page?.attributes?.seo || {
    metaTitle: fallbackTitle,
    metaDescription: fallbackDescription,
    shareImage,
    article: true,
  }

  const renderTicketsBlock = () => {
    if (!ticketLink && !relationsAttributes.price) {
      return null
    }

    if (ticketLink) {
      return (
        <div className="tickets-wrapper">
          {relationsAttributes.embed == true ? (
            <>
              <div className={ticketClasses} onClick={handleTicketShow}>
                <h3>Tickets</h3>

                <div className="ticket-content">
                  <ReactMarkdown children={relationsAttributes.price} />
                </div>
              </div>

              <Modal
                isOpen={ticketModalOpen}
                onHide={handleTicketClose}
                className={`ticket-modal`}
                ariaHideApp={false}
                style={ticketModalStyles}
              >
                <div onClick={handleTicketClose} className="close">
                  <svg
                    width="36"
                    height="34"
                    viewBox="0 0 36 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="1"
                      y1="-1"
                      x2="44.6296"
                      y2="-1"
                      transform="matrix(0.715187 0.698933 -0.715187 0.698933 1.5 2)"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                    <line
                      x1="1"
                      y1="-1"
                      x2="44.6296"
                      y2="-1"
                      transform="matrix(0.715187 -0.698933 0.715187 0.698933 1.5 34)"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
                <iframe
                  width="100%"
                  height="100%"
                  src={relationsAttributes.ticket_link}
                  style={{ "aspect-ratio": "1/1", border: "none" }}
                />
              </Modal>
            </>
          ) : (
            <a
              href={relationsAttributes.ticket_link}
              className={ticketClasses}
              target="_blank"
              rel="noreferrer"
            >
              <h3>Tickets</h3>
              <div className="ticket-content">
                <ReactMarkdown children={relationsAttributes.price} />
              </div>
            </a>
          )}
        </div>
      )
    }

    return (
      <div className="free-tickets">
        <div className="ticket-content">
          <ReactMarkdown children={relationsAttributes.price} />
        </div>
      </div>
    )
  }

  const ticketsBlockElement = renderTicketsBlock()
  const resolveArtistsForSubProgrammeItem = (item) => {
    const directArtists = Array.isArray(
      item?.attributes?.community_items?.data
    )
      ? item.attributes.community_items.data
      : []
    if (directArtists.length) {
      return directArtists
    }

    const subSlug = item?.attributes?.slug?.toLowerCase()
    const subTitle = item?.attributes?.title?.trim().toLowerCase()

    const matchingArtwork = artworkItems.find((artwork) => {
      const artworkAttrs = artwork?.attributes || {}
      const artworkSlug = artworkAttrs.slug?.toLowerCase()
      const artworkTitle = artworkAttrs.title?.trim().toLowerCase()
      return (
        (subSlug && artworkSlug && subSlug === artworkSlug) ||
        (subTitle && artworkTitle && subTitle === artworkTitle)
      )
    })

    const fallbackArtists = Array.isArray(
      matchingArtwork?.attributes?.community_items?.data
    )
      ? matchingArtwork.attributes.community_items.data
      : []

    return fallbackArtists
  }

  const formatArtistsLabel = (artistItems) =>
    (artistItems || [])
      .map((artist) => artist?.attributes?.name?.trim())
      .filter(Boolean)
      .filter((name, index, self) => self.indexOf(name) === index)
      .join(", ")
  const whenWhereAsideBlock = hasWhenWhereContent ? (
    <div className="discover sub primary-when-where">
      <div className="subtitle">
        <h1>When &amp; Where</h1>
      </div>
      <div className="discover-container programme-container sub-programme-container">
        <div className="day-programme">
          <div className="discover-container programme-container sub-programme-container">
            <div
              className="discover-item discover-item--when-where"
              key="primary-when-where"
            >
              <div className="item-wrapper item-wrapper--text-only">
                {showWhenWhereDetails && (
                  <div className="when-where-details">
                    {primaryWhenWhereSummary?.rangeLabel && (
                      <div className="when">
                        <span>{primaryWhenWhereSummary.rangeLabel}</span>
                      </div>
                    )}
                    {primaryWhenWhereSummary?.timeLabel && (
                      <div className="time">
                        <span>{primaryWhenWhereSummary.timeLabel}</span>
                      </div>
                    )}
                    {primaryLocationLabel && (
                      <div className="locations">{primaryLocationLabel}</div>
                    )}
                    {hasCustomWhenWhere && (
                      <ReactMarkdown
                        className="custom-when-where"
                        children={customWhenWhere}
                      />
                    )}
                  </div>
                )}
                {hasNonEmptyString(doorsLabel) && (
                  <div className="doors">
                    <span>
                      Doors open {doorsLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
  const hasSidebarContent = Boolean(
    hasWhenWhereContent ||
    subItems?.length ||
    ticketsBlockElement ||
    sortedCommunityItems.length ||
    parentProgrammes.length
  )

  const subProgrammesBlock = subItems?.length > 0 ? (
    (() => {
      const allHaveImages = subItems.every(
        (item) => item?.attributes?.cover_image?.data
      )
      return (
        <div className="discover sub">
          <div className="subtitle">
            {relationsAttributes?.sub_programmes_title && (
              <h1>{relationsAttributes.sub_programmes_title}</h1>
            )}
          </div>
          <div className="discover-container programme-container sub-programme-container">
            <div className="day-programme">
              <div className="discover-container programme-container sub-programme-container">
                {subItems.map((item, i) => {
                  const subProgrammeKey =
                    item.id ||
                    item.attributes?.slug ||
                    `sub-programme-${i}`
                  const whenWhereRange = formatWhenWhereRangeLabel(item.attributes.WhenWhere)
                  const dateLabel = whenWhereRange?.rangeLabel || null
                  const hasCoverImage = Boolean(item.attributes.cover_image?.data)
                  const artistItems = resolveArtistsForSubProgrammeItem(item)
                  const artistLabel = formatArtistsLabel(artistItems)
                  const showArtists =
                    Array.isArray(artistItems) && artistItems.length > 0 && artistItems.length < 8
                  return (
                    <div
                      className="discover-item"
                      key={subProgrammeKey}
                    >
                      <div className="item-wrapper">
                        <a href={`/biennial/biennial-2026/programme/${item.attributes.slug}`}>
                          {hasCoverImage && allHaveImages && (
                            <div className="image">
                              {item.attributes.WhenWhere?.[0] &&
                                page?.attributes?.hide_when_where ===
                                true && (
                                  <div className="info-overlay">
                                    <div className="date">
                                      {Moment(start_date).format(
                                        "MMM"
                                      ) ===
                                        Moment(end_date).format(
                                          "MMM"
                                        ) && dates.length > 1
                                        ? `${Moment(start_date).format("D")}–${Moment(end_date).format("D MMM")}`
                                        : `${Moment(start_date).format("D MMM")}–${Moment(end_date).format("D MMM")}`}
                                    </div>
                                    <div className="times">
                                      <div className="time">
                                        <span>
                                          {
                                            item.attributes.WhenWhere[0]
                                              .start_time
                                          }
                                          {item.attributes.WhenWhere[0]
                                            .end_time &&
                                            `—${item.attributes.WhenWhere[0].end_time}`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <div className="image-inner">
                                <Image
                                  image={
                                    item.attributes.cover_image?.data
                                      ?.attributes
                                  }
                                  fill
                                  objectFit="cover"
                                />
                              </div>
                            </div>
                          )}

                          <div className="category-title-wrapper">
                            {dateLabel && (
                              <div className="date-label">
                                {dateLabel}
                              </div>
                            )}
                            <div className="title">
                              {item.attributes.title}
                            </div>
                            {showArtists && artistLabel && (
                              <div className="locations">
                                {artistLabel}
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
          </div>
        </div>
      )
    })()
  ) : null

  const artistsBlock = sortedCommunityItems.length > 0 ? (
    <div className="discover artists">
      <div className="subtitle">
        <h1>Artists</h1>
      </div>
      <div className="discover-container programme-container sub-programme-container">
        <div className="day-programme">
          <div className="discover-container programme-container sub-programme-container">
            <div
              className={["items-wrapper", artistCountClass]
                .filter(Boolean)
                .join(" ")}
            >
              {sortedCommunityItems.map((item, i) => {
                const communityKey =
                  item.id ||
                  item.attributes?.slug ||
                  `community-${i}`
                const hasCoverImage = Boolean(
                  item.attributes.cover_image?.data
                )
                return (
                  <div
                    className="discover-item artist-item"
                    key={communityKey}
                  >
                    <div className="item-wrapper">
                      <a
                        href={`/biennial/biennial-2026/artists/${item.attributes.slug}`}
                      >
                        {hasCoverImage && (
                          <div className="image">
                            <div className="image-inner">
                              <Image
                                image={
                                  item.attributes.cover_image?.data
                                    ?.attributes
                                }
                                fill
                                objectFit="cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className="category-title-wrapper">
                          <div className="title">
                            {item.attributes.name}
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const hasArtistsBlock = Boolean(artistsBlock)
  const hasSubProgrammesBlock = Boolean(subProgrammesBlock)
  const parentProgrammesBlock =
    parentProgrammes.length > 0 ? (
      (() => {
        const allParentsHaveImages = parentProgrammes.every(
          (parent) => parent?.attributes?.cover_image?.data
        )
        return (
          <div className="discover parent-programmes">
            <div className="subtitle">
              <h1>Part of</h1>
            </div>
            <div className="discover-container programme-container parent-programme-container">
              <div className="day-programme">
                <div className="discover-container programme-container parent-programme-container">
                  {parentProgrammes.map((parent, idx) => {
                    const parentAttrs = parent?.attributes || {}
                    const parentSlug = parentAttrs.slug
                    const whenWhereRange = formatWhenWhereRangeLabel(parentAttrs?.WhenWhere)
                    const dateLabel = whenWhereRange?.rangeLabel || null
                    if (!parentSlug) {
                      return null
                    }
                    const hasCoverImage = Boolean(parentAttrs?.cover_image?.data)
                    return (
                      <div className="discover-item" key={parent.id || parentSlug || idx}>
                        <div className="item-wrapper">
                          <a href={`/biennial/biennial-2026/programme/${parentSlug}`}>
                            {hasCoverImage && allParentsHaveImages && (
                              <div className="image">
                                <div className="image-inner">
                                  <Image
                                    image={parentAttrs.cover_image?.data?.attributes}
                                    fill
                                    objectFit="cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="category-title-wrapper">
                              {dateLabel && <div className="date-label">{dateLabel}</div>}
                              {parentAttrs.title && (
                                <div className="title">{parentAttrs.title}</div>
                              )}
                            </div>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })()
    ) : null
  const eventAsideClasses = [
    "event-aside",
    hasArtistsBlock && !hasSubProgrammesBlock && !parentProgrammesBlock && isArtistsFirst
      ? "event-aside--artists-only"
      : null,
    hasSubProgrammesBlock && !hasArtistsBlock && !parentProgrammesBlock && !isArtistsFirst
      ? "event-aside--subs-only"
      : null,
  ].filter(Boolean)
  const asideContent = hasSidebarContent ? (
    <aside className={eventAsideClasses.join(" ")}>
      {whenWhereAsideBlock && <div className="desktop-only">{whenWhereAsideBlock}</div>}
      {ticketsBlockElement && <div className="desktop-only">{ticketsBlockElement}</div>}
      {isArtistsFirst ? (
        <>
          {artistsBlock}
          {subProgrammesBlock}
        </>
      ) : (
        <>
          {subProgrammesBlock}
          {artistsBlock}
        </>
      )}
      {parentProgrammesBlock}
    </aside>
  ) : null

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined
    }

    const body = document.body
    if (!body) {
      return undefined
    }

    const hasContent = hasSubEvents || hasTickets || hasArtists
    if (hasContent) {
      body.classList.add("sidebar-has-content")
      body.classList.remove("no-sidebar")
    } else {
      body.classList.remove("sidebar-has-content")
      body.classList.add("no-sidebar")
    }

    return () => {
      body.classList.remove("no-sidebar")
      body.classList.remove("sidebar-has-content")
    }
  }, [hasSubEvents, hasTickets, hasArtists])

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)")

    const handleChange = (event) => {
      const matches = event.matches ?? event.currentTarget?.matches ?? false
      setIsMobileView(matches)
      if (matches) {
        setIsContentCollapsed(true)
      } else {
        setIsContentCollapsed(false)
      }
    }

    handleChange(mediaQuery)

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return (
    <section
      className={`festival-wrapper template-single-artist ${params.programme}`}
    >
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
        <div className="event-layout__header title-wrapper">
          {page?.attributes?.title && (
            <div className="event-layout__header-inner">
              <h1 className="event-layout__title page-title">
                {page.attributes.title}
              </h1>
              {pageSubtitle && (
                <div className="event-layout__subtitle">
                  {pageSubtitle}
                </div>
              )}
            </div>
          )}
        </div>
        {whenWhereAsideBlock && <div className="mobile-only">{whenWhereAsideBlock}</div>}
        {ticketsBlockElement && <div className="mobile-only">{ticketsBlockElement}</div>}
        <div className="event-layout__grid">
          <div
            className={[
              "event-layout__content",
              isMobileView && isContentCollapsed
                ? "event-layout__content--collapsed"
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <BiennialArticle
              page={page}
              relations={relations}
              programmeLocations={programmeLocations}
              wrapperModifier="template-single-artist"
              showHero={false}
              hideLocations
              showWhenAboveTitle
              hideTickets
              hideDuplicateHeroImage={false}
              hideWhenRange={festivalRangeLabel}
            />
          </div>
          {isMobileView && isContentCollapsed && (
            <button
              type="button"
              className="programme-mobile-expander"
              onClick={() => setIsContentCollapsed(false)}
            >
              <span>+</span>
            </button>
          )}
          {asideContent}
        </div>
        {allProgrammeEntries.length > 0 && (
          <section className="discover artists programme-all">
            <div className="subtitle">
              <h1>Programme</h1>
            </div>
            <div
              id="programme-overview-grid"
              className="discover-container programme-container"
            >
              <div className="items-wrapper">
                {allProgrammeEntries.map((programmeEntry, index) => {
                  const entryData = programmeEntry?.programme_item?.data
                  const entryAttributes = entryData?.attributes || {}
                  if (!entryData?.id || !entryAttributes?.title) {
                    return null
                  }
                  const background =
                    programmeBackgrounds[index] || PROGRAMME_CLOUD_IMAGES[0]
                  const backgroundImage = background.src
                  const backgroundKey = backgroundImage
                    .split("/")
                    .pop()
                    ?.replace(".webp", "")
                  const backgroundColor = background.color
                    ?.toLowerCase()
                    .replace(/[^a-z0-9_-]/g, "-")
                  const stableSlug =
                    typeof entryAttributes.slug === "string"
                      ? entryAttributes.slug
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, "-")
                      : null
                  const discoverItemClasses = [
                    "discover-item",
                    backgroundKey ? `discover-item--bg-${backgroundKey}` : null,
                    backgroundColor
                      ? `discover-item--color-${backgroundColor}`
                      : null,
                    `discover-item--id-${entryData.id}`,
                    stableSlug ? `discover-item--slug-${stableSlug}` : null,
                  ].filter(Boolean)

                  const whenWhere = Array.isArray(entryAttributes?.WhenWhere)
                    ? entryAttributes.WhenWhere
                    : []
                  const sortedDates = whenWhere
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() -
                        new Date(b.date).getTime()
                    )
                  const startDateRaw = sortedDates[0]?.date
                  const endDateRaw =
                    sortedDates[sortedDates.length - 1]?.date || startDateRaw

                  const start_date = startDateRaw
                    ? new Date(startDateRaw.split("/").reverse().join("/"))
                    : null
                  const end_date = endDateRaw
                    ? new Date(endDateRaw.split("/").reverse().join("/"))
                    : null
                  const biennialTags =
                    entryAttributes?.biennial_tags?.data &&
                      Array.isArray(entryAttributes.biennial_tags.data)
                      ? entryAttributes.biennial_tags.data
                      : []
                  const primaryTag = biennialTags[0]

                  const rawTitle = entryAttributes.title || "Programme Item"
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
                  const locationLabel = (entryAttributes.locations?.data || [])
                    .map((loc) => loc?.attributes?.title?.trim())
                    .filter(Boolean)
                    .join(", ")
                  return (
                    <div
                      className={discoverItemClasses.join(" ")}
                      key={`all-programme-${entryData.id}-${index}`}
                    >
                      <div className="item-wrapper item-wrapper--text-only">
                        <a
                          href={`/biennial/biennial-2026/programme/${entryAttributes.slug || ""}`}
                          className="programme-card-link"
                        >
                          <div
                            className="card-background"
                            id={`programme-card-background-${entryData.id}`}
                            data-bg={backgroundKey}
                            data-color={backgroundColor}
                          >
                            <img
                              src={backgroundImage}
                              alt=""
                              aria-hidden="true"
                            />
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
                                  ? `${Moment(start_date).format("D")}–${Moment(
                                    end_date
                                  ).format("D MMM")}`
                                  : `${Moment(start_date).format(
                                    "D MMM"
                                  )} – ${Moment(end_date).format("D MMM")}`
                                : Moment(start_date).format("D MMM")
                              const whenClass = [
                                "when",
                                rangeLabel === festivalRangeLabel
                                  ? "when--special"
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(" ")
                              return (
                                <div className={whenClass}>
                                  <span className="black-label">
                                    {rangeLabel}
                                  </span>
                                </div>
                              )
                            })()}
                          <div className="category-title-wrapper">
                            {categoryLabel && (
                              <span className="category">
                                {categoryLabel}
                              </span>
                            )}
                            <div className="title">
                              <span>{derivedTitle}</span>
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
              <div className="divider"></div>
            </div>
          </section>
        )}
      </Layout>
    </section>
  )
}

export async function getServerSideProps({ params, query }) {
  const biennial = {
    slug: BIENNIAL_SLUG,
  }

  const preview = query.preview || process.env.NEXT_PUBLIC_PREVIEW
  const publicationState = preview ? "preview" : "live"
  const publicationParam = `&publicationState=${publicationState}`
  const pageRes = await fetchAPI(
    `/programme-items?filters[slug][$eq]=${params.programme}&filters[biennial][slug][$eq]=${biennial.slug}${publicationParam}&populate[content][populate]=*`
  )

  const pageRel = await fetchAPI(
    `/programme-items?filters[slug][$eq]=${params.programme}&filters[biennial][slug][$eq]=${biennial.slug}${publicationParam}&populate[content][populate]=*&populate[cover_image][populate]=*&populate[main_programme_items][populate]=*&populate[locations][populate]=*&populate[sub_programme_items][populate]=*&populate[biennial_tags][populate]=*&populate[WhenWhere][populate]=*&populate[community_items][populate]=*&populate[artworks][populate]=community_items,cover_image,locations,WhenWhere&populate[artwork_items][populate]=community_items,cover_image,locations,WhenWhere`
  )

  const subRes = await fetchAPI(
    `/programme-items?filters[main_programme_items][slug][$eq]=${params.programme}&populate[community_items][populate]=*&filters[biennial][slug][$eq]=${biennial.slug}${publicationParam
    }&pagination[limit]=${100}&populate[biennial][populate]=*&populate[main_programme_items][populate]=*&populate[WhenWhere][populate]=*&populate[locations][populate]=*&populate[cover_image][populate]=*&populate[biennial_tags][populate]=*&populate=*`
  )
  console.log(
    "[programme] sub-programme fetch",
    params.programme,
    "count",
    subRes?.data?.length,
    "slugs",
    (subRes?.data || []).map((item) => item?.attributes?.slug)
  )

  const [globalRes, categoryRes, festivalRes, programmePageRes] =
    await Promise.all([
      fetchAPI(
        "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
        { populate: "*" }
      ),
      fetchAPI(
        `/biennial-tags?filters[biennials][slug][$eq]=${biennial.slug}${publicationParam}&populate=*`
      ),
      fetchAPI(
        `/biennials?filters[slug][$eq]=${biennial.slug}${publicationParam}&populate[prefooter][populate]=*`
      ),
      fetchAPI(
        `/programme-pages?filters[slug][$eq]=${PROGRAMME_SLUG}${publicationParam}&populate[location_item][populate]=*&populate[programme_item][populate]=programme_item,programme_item.cover_image,programme_item.biennial_tags,programme_item.locations,programme_item.WhenWhere`
      ),
    ])

  const page = pageRes?.data?.[0] || null
  const relations = pageRel?.data?.[0] || null
  const programmePage = programmePageRes?.data?.[0] || null
  const festivalData = festivalRes?.data?.[0] || null

  console.log(
    "[programme] locations/artworks",
    params.programme,
    {
      locations: (relations?.attributes?.locations?.data || []).map((loc) => ({
        slug: loc?.attributes?.slug,
        title: loc?.attributes?.title,
      })),
      artworks: (
        relations?.attributes?.artworks?.data ||
        relations?.attributes?.artwork_items?.data ||
        []
      ).map((item) => ({
        id: item?.id,
        slug: item?.attributes?.slug,
        title: item?.attributes?.title,
      })),
    }
  )

  if (!page || !relations) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page,
      global: globalRes.data,
      relations,
      sub: subRes?.data || [],
      params,
      categories: categoryRes.data,
      festival: festivalData,
      programmePage,
    },
  }
}

export { ProgrammeItem }
export default ProgrammeItem
