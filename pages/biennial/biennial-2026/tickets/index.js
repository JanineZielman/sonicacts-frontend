import { BIENNIAL_SLUG, PROGRAMME_SLUG } from "/lib/biennial/constants"
import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import Modal from "react-modal"

const Tickets = ({ global, tickets, festival, params }) => {
  const [openTicketId, setOpenTicketId] = useState(null)

  const modalStyles = {
    overlay: {
      backgroundColor: "transparent",
    },
  }

  const getTicketKey = (ticket, index) =>
    ticket?.id ?? `${ticket?.__component || "ticket"}-${index}`

  const openModal = (ticketId) => setOpenTicketId(ticketId)
  const closeModal = () => setOpenTicketId(null)
  const shareImage =
    festival?.attributes?.cover_image?.data?.attributes?.url
      ? { url: festival.attributes.cover_image.data.attributes.url }
      : undefined
  const pageSeo =
    festival?.attributes?.tickets_seo || {
      metaTitle: "Tickets",
      metaDescription:
        "Secure tickets for Sonic Acts Biennial 2026 events and performances.",
      shareImage,
    }

  return (
    <section className="festival-wrapper tickets">
      <div
        className="tickets-aquarelle"
        suppressHydrationWarning
        data-tilt
        data-tilt-full-page-listening=""
        data-tilt-max="6"
        data-tilt-speed="50"
        data-tilt-perspective="700"
        aria-hidden="true"
      >
        <img
          src="/biennial/biennial-2026/assets/aquarelle/ak-aquarell-10-13.png"
          alt=""
          loading="lazy"
        />
      </div>
      <Layout page={params} global={global} festival={festival} seo={pageSeo}>
        <div className="title-wrapper">
          <h1 className="page-title">Tickets</h1>
        </div>
        <div className="info-wrapper">
          {tickets.map((ticket, i) => {
            if (ticket.__component !== "biennial.info") {
              return null
            }

            const key = getTicketKey(ticket, i)

            return (
              <div key={key} className="ticket-info">
                <ReactMarkdown children={ticket.text} />
              </div>
            )
          })}
        </div>
        <div className="tickets-container">
          {tickets.map((ticket, i) => {
            const key = getTicketKey(ticket, i)

            if (ticket.__component === "biennial.ticket") {
              const baseClasses = ["ticket"]
              if (!ticket?.link) {
                baseClasses.push("available-soon")
              }
              if (ticket?.price === "SOLD OUT") {
                baseClasses.push("sold-out")
              }
              if (ticket?.title) {
                const cleanTitle = ticket.title
                  .replace(/&amp;/gi, "")
                  .replace(/\s+/g, "")
                  .replace(/[^A-Za-z0-9_-]/g, "")
                baseClasses.push(cleanTitle)
              }

              const className = baseClasses.join(" ")
              const programmeAttributes =
                ticket.programme_item?.data?.attributes || null
              const programmeSlugRaw = programmeAttributes?.slug || null
              const programmeSlug = programmeSlugRaw || PROGRAMME_SLUG
              const programmeBelongsToBiennial =
                programmeAttributes?.biennial?.data?.attributes?.slug || null

              if (
                programmeAttributes &&
                programmeBelongsToBiennial &&
                programmeBelongsToBiennial !== BIENNIAL_SLUG
              ) {
                return null
              }
              const isModalOpen = openTicketId === key

              return (
                <React.Fragment key={key}>
                  <div className={className}>
                    <div className="ticket-content">
                      <div className="ticket-heading">
                        <h3>{ticket.title}</h3>
                        <div className="ticket-subtitle">
                          <ReactMarkdown children={ticket.subtitle} />
                          {programmeSlug && (
                            <a href={`/biennial/biennial-2026/programme/${programmeSlug}`}>
                              Find out more
                            </a>
                          )}
                        </div>
                      </div>

                      {ticket.embed ? (
                        <div className="price" onClick={() => openModal(key)}>
                          <span>Buy tickets</span>
                          <ReactMarkdown children={ticket.price} />
                        </div>
                      ) : programmeSlug ? (
                        <a
                          className="price"
                          href={ticket.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>Buy tickets</span>
                          <ReactMarkdown children={ticket.price} />
                        </a>
                      ) : (
                        <a
                          className="price"
                          href={ticket.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ReactMarkdown children={ticket.price} />
                        </a>
                      )}
                    </div>
                  </div>

                  {ticket.embed && (
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      className={`ticket-modal`}
                      ariaHideApp={false}
                      style={modalStyles}
                    >
                      <div onClick={closeModal} className="close">
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
                        src={ticket.link}
                        style={{ aspectRatio: "1 / 1", border: "none" }}
                      />
                    </Modal>
                  )}
                </React.Fragment>
              )
            }

            if (ticket.__component === "biennial.donate") {
              return (
                <a
                  key={key}
                  className={`ticket donate`}
                  href={ticket.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="ticket-content">
                    <h3>{ticket.title}</h3>
                  </div>
                </a>
              )
            }

            return null
          })}
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
  const [festivalRes, ticketsRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`
    ),
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[tickets][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      tickets: ticketsRes.data[0].attributes.tickets,
      global: globalRes.data,
      params: params,
    },
  }
}

export default Tickets
