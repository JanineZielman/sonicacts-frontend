import ReactMarkdown from "react-markdown"
import React, { useEffect, useState } from "react"
import Moment from "moment"
import Image from "./image"
import LazyLoad from "react-lazyload"
import Collapsible from "./collapsible"
import Modal from "react-modal"
import { createPortal } from "react-dom"

const Article = ({
  page,
  relations,
  programmeLocations = [],
  wrapperModifier = "",
  showHero = true,
  hideLocations = false,
  showWhenAboveTitle = false,
  hideTickets = false,
  sidebarPortalTarget = null,
  hideWhenRange = null,
  hideDuplicateHeroImage = true,
}) => {
  const relationsAttributes = relations?.attributes || {}
  const dates = relationsAttributes.WhenWhere || []
  const start_date = dates?.length
    ? new Date(dates[0]?.date?.split("/")?.reverse()?.join("/") || "")
    : null
  const end_date = dates?.length
    ? new Date(
      dates[dates.length - 1]?.date?.split("/")?.reverse()?.join("/") || ""
    )
    : null
  const mainProgrammeItems =
    relationsAttributes.main_programme_items?.data || []
  const firstMainProgramme = mainProgrammeItems[0]?.attributes
  const contentBlocks = page?.attributes?.content || []
  const firstContentImageIndex = contentBlocks.findIndex(
    (block) =>
      block?.__component === "basic.image" && block?.image?.data?.attributes
  )
  const firstContentImageBlock =
    firstContentImageIndex >= 0 ? contentBlocks[firstContentImageIndex] : null
  const heroImageAttributes =
    relationsAttributes.cover_image?.data?.attributes ||
    relationsAttributes.biennial_cover_image?.data?.attributes ||
    firstContentImageBlock?.image?.data?.attributes ||
    null
  const shouldHideFirstContentImageBlock =
    hideDuplicateHeroImage &&
    !showHero &&
    heroImageAttributes?.url &&
    firstContentImageBlock?.image?.data?.attributes?.url ===
    heroImageAttributes.url
  const renderWhenDetails = () => {
    const hasCustomWhen =
      typeof page.attributes.custom_when_where === "string" &&
      page.attributes.custom_when_where.trim().length > 0

    if (page.attributes.hide_when_where === true && !hasCustomWhen) {
      return null
    }

    if (hasCustomWhen) {
      return (
        <div className="when-wrapper">
          <ReactMarkdown
            className="when"
            children={page.attributes.custom_when_where}
          />
        </div>
      )
    }

    if (!Array.isArray(dates) || dates.length === 0) {
      return null
    }

    const hasDateRange = Boolean(start_date && end_date)
    const hasSingleTime = dates.length === 1

    if (!hasDateRange && !hasSingleTime) {
      return null
    }

    const buildRangeLabel = () => {
      if (!hasDateRange || !start_date || !end_date) {
        return null
      }
      if (
        Moment(start_date).format("MMM") ===
        Moment(end_date).format("MMM") &&
        dates.length > 1
      ) {
        return `${Moment(start_date).format("D")}–${Moment(end_date).format(
          "D MMM"
        )}`
      }
      if (dates.length > 1) {
        return `${Moment(start_date).format("D MMM")} – ${Moment(end_date).format(
          "D MMM"
        )}`
      }
      return Moment(start_date).format("D MMM")
    }
    const rangeLabel = buildRangeLabel()
    const shouldHideRange =
      hideWhenRange && rangeLabel && rangeLabel === hideWhenRange
    const isSpecialRange = rangeLabel === "5 Feb – 29 Mar"

    return (
      <div className="when-wrapper">
        {rangeLabel && !shouldHideRange && (
          <div
            className={[
              "when",
              isSpecialRange ? "when--special" : null,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{rangeLabel}</span>
          </div>
        )}
        {hasSingleTime && (
          <div className="time">
            <span>
              {dates[0]?.start_time}
              {dates[0]?.end_time && `–${dates[0].end_time}`}
            </span>
          </div>
        )}
      </div>
    )
  }
  const whenDetails = renderWhenDetails()
  const inlineWhenDetails =
    showWhenAboveTitle && whenDetails ? whenDetails : null
  const sidebarWhenDetails =
    showWhenAboveTitle || !whenDetails ? null : whenDetails

  useEffect(() => {
    var text = document.getElementsByClassName("text-block")
    for (let i = 0; i < text.length; i++) {
      var links = text[i].getElementsByTagName("a")
      for (let j = 0; j < links.length; j++) {
        if (links[j].href.includes("#footnotes") != true) {
          links[j].setAttribute("target", "_blank")
        } else {
          links[j].classList.add("footnote")
        }
        if (links[j].href.includes(".pdf") == true) {
          links[j].href =
            "https://cms.sonicacts.com/uploads/" +
            links[j].href.substring(links[j].href.lastIndexOf("/") + 1)
        }
      }
    }
  }, [])

  const modalStyles = {
    overlay: {
      backgroundColor: "transparent",
    },
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const rawSocialLinks =
    relationsAttributes?.links ?? page?.attributes?.links ?? []
  const socialLinks = Array.isArray(rawSocialLinks)
    ? rawSocialLinks.filter((link) => link?.title && link?.slug)
    : []

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      // console.log("[SingleArtist] socialLinks:", socialLinks)
    }
  }, [socialLinks])

  const renderSidebar = () => {
    const shouldRenderSidebar =
      (relationsAttributes.locations?.data?.length ?? 0) > 0 ||
      dates?.length > 0

    if (!shouldRenderSidebar) {
      return null
    }

    const sidebarMarkup = (
      <div className="sidebar">
        <div className="sidebar-content">
          {sidebarWhenDetails}

          {!hideLocations &&
            (relationsAttributes.locations?.data?.length ?? 0) > 0 && (
              <div className="locations-wrapper">
                <h3>{`Location${relationsAttributes.locations?.data.length > 1 ? "s" : ""
                  }`}</h3>
                {relationsAttributes.locations?.data?.map((loc, j) => {
                  let locInfo = programmeLocations?.filter(
                    (item) => item.title == loc.attributes.title
                  )
                  const locationKey =
                    loc.id || loc.attributes?.slug || `location-${j}`
                  return (
                    <div className="location" key={locationKey}>
                      {loc.attributes.title?.startsWith("Online") ? (
                        loc.attributes.link ? (
                          <a target="_blank" href={loc.attributes.link}>
                            <h4>
                              {loc.attributes.title}{" "}
                              {loc.attributes.subtitle && (
                                <> – {loc.attributes.subtitle} </>
                              )}
                            </h4>
                            {relationsAttributes.hide_opening_times != true && (
                              <ReactMarkdown
                                children={locInfo?.[0]?.opening_times}
                              />
                            )}
                            <ReactMarkdown
                              children={loc.attributes.additional_info}
                            />
                          </a>
                        ) : (
                          <div>
                            <h4>
                              {loc.attributes.title}{" "}
                              {loc.attributes.subtitle && (
                                <> – {loc.attributes.subtitle} </>
                              )}
                            </h4>
                            {relationsAttributes.hide_opening_times != true && (
                              <ReactMarkdown
                                children={locInfo?.[0]?.opening_times}
                              />
                            )}
                            <ReactMarkdown
                              children={loc.attributes.additional_info}
                            />
                          </div>
                        )
                      ) : (
                        <a href={`/visit`}>
                          <h4>
                            {loc.attributes.title}{" "}
                            {loc.attributes.subtitle && (
                              <> – {loc.attributes.subtitle} </>
                            )}
                          </h4>
                          {relationsAttributes.hide_opening_times != true && (
                            <ReactMarkdown
                              className="opening-times"
                              children={locInfo?.[0]?.opening_times}
                            />
                          )}
                          {loc.attributes.floorplan?.data?.attributes.url && (
                            <a
                              className="floorplan"
                              target="_blank"
                              href={
                                "https://cms.sonicacts.com" +
                                loc.attributes.floorplan?.data?.attributes.url
                              }
                            >
                              Floorplan
                            </a>
                          )}
                          <ReactMarkdown
                            className="additional-info"
                            children={loc.attributes.additional_info}
                          />
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

          {relationsAttributes.registration_link && (
            <a
              href={relationsAttributes.registration_link}
              className="register-wrapper"
            >
              <div>
                {relationsAttributes.registration_label &&
                  relationsAttributes.registration_label}
              </div>
            </a>
          )}
        </div>

        {!hideTickets &&
          (relationsAttributes.ticket_link ? (
            <div className="tickets-wrapper">
              {relationsAttributes.embed == true ? (
                <>
                  <div
                    className={`ticket ${relationsAttributes.ticket_link ? "" : "available-soon"} ${relationsAttributes.price === "SOLD OUT" ? "sold-out" : ""
                      } ${relationsAttributes?.title?.replace(/\s|:/g, "")}`}
                    onClick={handleShow}
                  >
                    <h3>Tickets</h3>

                    <div className="ticket-content">
                      <ReactMarkdown children={relationsAttributes.price} />
                    </div>
                  </div>

                  <Modal
                    isOpen={show}
                    onHide={handleClose}
                    className={`ticket-modal`}
                    ariaHideApp={false}
                    style={modalStyles}
                  >
                    <div onClick={handleClose} className="close">
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
                  className={`ticket ${relationsAttributes.ticket_link ? "" : "available-soon"} ${relationsAttributes?.title?.replace(/\s|:/g, "")
                    }`}
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
          ) : (
            <div className="free-tickets">
              <div className="ticket-content">
                <ReactMarkdown children={relationsAttributes.price} />
              </div>
            </div>
          ))}
      </div>
    )

    if (sidebarPortalTarget) {
      return createPortal(sidebarMarkup, sidebarPortalTarget)
    }

    return sidebarMarkup
  }

  return (
    <section className="article biennial-article">
      <>
        {page.attributes.title && (
          <div className="title-wrapper">
            {firstMainProgramme?.title && (
              <div className="category">
                <a
                  href={
                    firstMainProgramme?.slug
                      ? `/biennial/biennial-2026/programme/${firstMainProgramme.slug}`
                      : "/biennial/biennial-2026/programme"
                  }
                >
                  {firstMainProgramme.title}
                </a>
              </div>
            )}
            {inlineWhenDetails}
            <h1 className="page-title">{page.attributes.title}</h1>
          </div>
        )}
        {page.attributes.name && (
          <div className="title-wrapper">
            <h1 className="page-title">{page.attributes.name}</h1>
            <div className="subtitle">{page.attributes.job_description}</div>
          </div>
        )}

        {showHero && heroImageAttributes && (
          <div className="article-hero">
            <Image
              image={heroImageAttributes}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        )}
        <div className="content">
          <div className="programme-content-bg">
            <img
              src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-1.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className={`wrapper ${page.attributes.slug} ${wrapperModifier}`}>
            <>
              {contentBlocks.map((item, i) => {
                if (
                  shouldHideFirstContentImageBlock &&
                  i === firstContentImageIndex &&
                  item?.__component === "basic.image"
                ) {
                  return null
                }
                return (
                  <div
                    key={`content${i}`}
                    className={`${page.attributes.slug}-block`}
                  >
                    {item.image?.data && (
                      <LazyLoad height={600}>
                        {item.image_caption ? (
                          <div className="columns" key={"column" + i}>
                            <div className={`image ${page.attributes.slug}`}>
                              <Image
                                image={item.image.data.attributes}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="
                              />
                            </div>
                            <div className="caption">
                              <ReactMarkdown children={item.image_caption} />
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`image ${item.size} ${page.attributes.slug}`}
                          >
                            <Image
                              image={item.image.data.attributes}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="
                            />
                          </div>
                        )}
                      </LazyLoad>
                    )}
                    {item.sidenote && (
                      <div className={"sidenote " + item.size}>
                        <ReactMarkdown children={item.sidenote} />
                      </div>
                    )}
                    {item.text_block && (
                      <div
                        className={"text-block " + item.size}
                        key={`text${i}`}
                      >
                        <ReactMarkdown children={item.text_block} />
                      </div>
                    )}
                    {item.url && (
                      <div
                        className={`iframe-wrapper ${item.sound}`}
                        key={`url${i}`}
                      >
                        <iframe
                          className="iframe"
                          src={item.url.match(/\bhttps?:\/\/\S+/gi)[0]}
                          frameBorder="0"
                        />
                      </div>
                    )}
                    {item.__component == "basic.collapsible" && (
                      <div className="collapsible about">
                        <Collapsible
                          trigger={item.title}
                          open={item.open == true && item.open}
                        >
                          <div
                            className={"text-block " + item.text?.size}
                            key={`textcol${i}`}
                          >
                            <ReactMarkdown children={item.text?.text_block} />
                          </div>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                )
              })}
              {relationsAttributes?.footnotes && (
                <div className="footnotes" id="footnotes">
                  <ReactMarkdown
                    children={relationsAttributes?.footnotes?.footnotes}
                  />
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="single-artist-socials">
                  <h2 className="single-artist-socials__heading visually-hidden">
                    Socials
                  </h2>
                  <ul className="single-artist-socials__list">
                    {socialLinks.map((link) => {
                      const href = link.slug?.startsWith("http")
                        ? link.slug
                        : `https://${link.slug}`
                      return (
                        <li
                          key={`${link.slug}-${link.title}`}
                          className="single-artist-socials__item"
                        >
                          <a
                            className="single-artist-socials__link"
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.title}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </>
          </div>

          {renderSidebar()}

        </div>
      </>
    </section>
  )
}

export default Article
