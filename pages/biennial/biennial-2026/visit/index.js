import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import { BIENNIAL_SLUG } from "/lib/biennial/constants"

const parseGpsCoordinates = (gpsString) => {
  if (!gpsString || typeof gpsString !== "string") {
    return { lat: null, lng: null }
  }

  const parts = gpsString
    .split(",")
    .map((value) => parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value))

  if (parts.length < 2) {
    return { lat: null, lng: null }
  }

  let [first, second] = parts

  if (Math.abs(first) > 90 && Math.abs(second) <= 90) {
    ;[first, second] = [second, first]
  } else if (Math.abs(first) <= 30 && Math.abs(second) > 30) {
    ;[first, second] = [second, first]
  }

  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return { lat: null, lng: null }
  }

  return { lat: first, lng: second }
}

const formatSlashSpacing = (value) =>
  typeof value === "string" ? value.replace(/\s*\/\s*/g, "\u00A0/ ") : value

const Visit = ({ global, festival, locations }) => {
  const [expandedLocationIndex, setExpandedLocationIndex] = useState(null)
  const [markersReady, setMarkersReady] = useState(false)
  const mapRef = useRef(null)
  const markerRefs = useRef([])

  console.log(festival)
  const shareImage =
    festival?.attributes?.visit_share_image?.data?.attributes?.url
      ? { url: festival.attributes.visit_share_image.data.attributes.url }
      : festival?.attributes?.cover_image?.data?.attributes?.url
        ? { url: festival.attributes.cover_image.data.attributes.url }
        : undefined
  const pageSeo =
    festival?.attributes?.visit_seo || {
      metaTitle: "Visit – Biennial 2026",
      metaDescription:
        "Plan your visit to Sonic Acts Biennial 2026 with venue details, maps, and accessibility info.",
      shareImage,
    }

  const rawLocationItems = Array.isArray(locations) ? locations : []

  const preparedLocations = rawLocationItems.map((item) => {
    const directAttributes = item?.attributes || {}
    const nestedAttributes = item?.location?.data?.attributes || {}

    const attributes = { ...directAttributes, ...nestedAttributes }

    const rawTitle = attributes.title || item.title || "Location"
    const title = formatSlashSpacing(rawTitle)
    const subtitle = formatSlashSpacing(attributes.subtitle || item.subtitle || "")
    const locationName = formatSlashSpacing(
      attributes.location || item.location_title || ""
    )
    const additionalInfo =
      attributes.additional_info || item.additional_info || ""
    const openingTimes = item?.opening_times || attributes.opening_times || ""
    const link = attributes.link || item.link || ""
    const gpsRaw = attributes.gps || item.gps || ""
    const { lat, lng } = parseGpsCoordinates(gpsRaw)

    return {
      original: item,
      title,
      subtitle,
      locationName,
      additionalInfo,
      openingTimes,
      link,
      gpsRaw,
      lat,
      lng,
    }
  })

  const sortedLocations = preparedLocations
    .slice()
    .sort((a, b) => {
      const titleCompare = a.title.localeCompare(b.title)
      if (titleCompare !== 0) {
        return titleCompare
      }

      const latA = Number.isFinite(a.lat) ? a.lat : -Infinity
      const latB = Number.isFinite(b.lat) ? b.lat : -Infinity

      if (latA === latB) {
        return 0
      }

      return latB - latA
    })
    .map((entry, index) => ({ ...entry, globalIndex: index }))

  const totalLocations = sortedLocations.length
  let firstColumnCount = Math.floor(totalLocations / 2)
  if (totalLocations > 0 && firstColumnCount === 0) {
    firstColumnCount = 1
  }
  const columnThemePatterns = [
    ["blue", "grey", "sand"],
    ["grey", "sand", "blue"],
  ]

  const locationColumns = [
    sortedLocations.slice(0, firstColumnCount),
    sortedLocations.slice(firstColumnCount),
  ]
    .filter((column) => column.length > 0)
    .map((columnItems, columnIndex) =>
      columnItems.map((entry, itemIndex) => {
        const pattern = columnThemePatterns[columnIndex] || columnThemePatterns[0]
        const theme = pattern[itemIndex % pattern.length] || "blue"
        return {
          ...entry,
          columnIndex,
          columnRowIndex: itemIndex,
          theme,
        }
      })
    )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const loadMapboxFromCdn = () =>
      new Promise((resolve, reject) => {
        if (window.mapboxgl) {
          resolve(window.mapboxgl)
          return
        }

        const scriptId = "mapbox-gl-js"
        const styleId = "mapbox-gl-css"

        if (!document.getElementById(styleId)) {
          const stylesheet = document.createElement("link")
          stylesheet.id = styleId
          stylesheet.rel = "stylesheet"
          stylesheet.href =
            "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
          document.head.appendChild(stylesheet)
        }

        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          existingScript.addEventListener("load", () =>
            resolve(window.mapboxgl)
          )
          existingScript.addEventListener("error", reject)
          return
        }

        const script = document.createElement("script")
        script.id = scriptId
        script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
        script.async = true
        script.onload = () => resolve(window.mapboxgl)
        script.onerror = reject
        document.head.appendChild(script)
      })

    const initialiseMap = async () => {
      let mapboxglInstance

      try {
        mapboxglInstance = await loadMapboxFromCdn()
      } catch (error) {
        console.warn(
          "Mapbox GL unavailable, skipping map initialisation.",
          error
        )
        return
      }

      if (!mapboxglInstance) {
        return
      }

      mapboxglInstance.accessToken =
        "pk.eyJ1Ijoic29uaWNhY3RzIiwiYSI6ImNscTZmOTd6NTBwOXMya251YnVjNG4xcDYifQ._mX8dAapy0UIkcHEzMUI3g"

      setMarkersReady(false)

      const isMobileViewport = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches

      const map = new mapboxglInstance.Map({
        container: "map",
        style: "mapbox://styles/sonicacts/cmgusj7p3003e01quffr3fmq4",
        center: isMobileViewport ? [4.92, 52.368] : [4.9, 52.355],
        zoom: isMobileViewport ? 10.5 : 12,
      })

      const colorVarOrder = ["--color-blue", "--color-grey", "--color-sand"]
      const basePink = "#ff87ff"
      let keycolors = []
      let accentPink = basePink
      let palette = { blue: "", grey: "", sand: "" }

      if (typeof window !== "undefined") {
        const rootStyles = window.getComputedStyle(document.documentElement)
        keycolors = colorVarOrder
          .map((varName) => rootStyles.getPropertyValue(varName)?.trim())
          .filter(Boolean)
        palette = {
          blue: rootStyles.getPropertyValue("--color-blue")?.trim() || "",
          grey: rootStyles.getPropertyValue("--color-grey")?.trim() || "",
          sand: rootStyles.getPropertyValue("--color-sand")?.trim() || "",
        }
        const extractedPink = rootStyles.getPropertyValue("--color-pink")?.trim()
        if (extractedPink) {
          accentPink = extractedPink
        }
      }

      if (keycolors.length !== colorVarOrder.length) {
        keycolors = ["#7b87ff", "#babadf", "#e1cebc"]
      }

      const locationElements = Array.from(
        document.querySelectorAll(".location")
      )

      const elementEntries = locationElements.map((element) => {
        const themeAttr = element.dataset.theme || ""
        const latAttr = parseFloat(element.dataset.lat)
        const lngAttr = parseFloat(element.dataset.lng)
        const indexAttr = parseInt(element.dataset.index, 10)
        const linkAttr = element.dataset.link || ""

        let lat = Number.isFinite(latAttr) ? latAttr : null
        let lng = Number.isFinite(lngAttr) ? lngAttr : null

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          const fallbackGps = element.getAttribute("data-gps") || ""
          const fallback = parseGpsCoordinates(fallbackGps)
          lat = fallback.lat
          lng = fallback.lng
        }

        return {
          element,
          lat,
          lng,
          index: Number.isInteger(indexAttr) ? indexAttr : null,
          link: linkAttr,
          theme: themeAttr,
          marker: null,
        }
      })

      markerRefs.current = new Array(sortedLocations.length).fill(null)

      const layeredEntries = elementEntries
        .slice()
        .sort((a, b) => {
          const latA = Number.isFinite(a.lat) ? a.lat : -Infinity
          const latB = Number.isFinite(b.lat) ? b.lat : -Infinity
          if (latA === latB) {
            return 0
          }
          return latB - latA
        })

      layeredEntries.forEach((entry) => {
        const { element, lat, lng, index, link, theme = "" } = entry

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          console.warn(
            "[Visit] Skipping location due to invalid GPS:",
            element.dataset.title || element
          )
          return
        }

        const computedStyles = window.getComputedStyle(element)
        const backgroundColor = computedStyles
          .getPropertyValue("background-color")
          ?.trim()
        const themeBaseColor = palette[theme] || ""
        const locationColor =
          backgroundColor &&
            backgroundColor !== "transparent" &&
            backgroundColor !== "rgba(0, 0, 0, 0)"
            ? backgroundColor
            : computedStyles.getPropertyValue("--location-bg-color")?.trim() ||
            themeBaseColor
        const colorIndex = Number.isInteger(index) ? index : 0
        const markerColor =
          locationColor ||
          themeBaseColor ||
          keycolors[colorIndex % keycolors.length] ||
          keycolors[0]

        const title =
          element.dataset.title ||
          element.querySelector("h2")?.textContent ||
          ""
        const subtitle = element.dataset.subtitle || ""
        const locationName = element.dataset.locationName || ""
        const openingTimesHtml =
          element.querySelector(".opening-times")?.innerHTML?.trim() || ""
        const additionalInfoHtml =
          element.querySelector(".additional-info")?.innerHTML?.trim() || ""

        const themeColor = markerColor || "var(--color-sand)"
        const popupThemeClass =
          theme && typeof theme === "string" ? ` popup-inner--${theme}` : ""
        const popupContent = `
          <div class="popup-inner${popupThemeClass}" data-popup-theme="${theme}" style="--popup-theme:${themeColor};">
            <h2>${title}</h2>
            ${subtitle ? `<h3>${subtitle}</h3>` : ""}
            ${locationName
            ? `<p class="popup-location">${locationName}</p>`
            : ""
          }
            ${openingTimesHtml
            ? `<div class="opening-times">${openingTimesHtml}</div>`
            : ""
          }
            ${additionalInfoHtml
            ? `<div class="additional-info">${additionalInfoHtml}</div>`
            : ""
          }
            <div class="location-link">
              ${link
            ? `<a class="location__external-link" href="${link}" target="_blank" rel="noopener noreferrer">Visit website</a>`
            : ""
          }
              <a class="location__external-link location__external-link--maps" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${lat},${lng}`
          )}" target="_blank" rel="noopener noreferrer">Get directions</a>
            </div>
          </div>
        `

        const popup = new mapboxglInstance.Popup({ offset: 25 })
          .setMaxWidth("20vw")
          .setHTML(popupContent)

        popup.on("open", () => {
          const popupElement = popup.getElement()
          if (popupElement) {
            popupElement.style.setProperty("--popup-theme", themeColor)
          }
        })

        const marker = new mapboxglInstance.Marker({
          color: "#ffffff",
        })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map)

        const markerElement = marker.getElement()
        if (markerElement) {
          const overlayPath = markerElement.querySelector('path[opacity]')
          const circle = markerElement.querySelector('circle')
          const bodyPath = markerElement.querySelector('path[fill]')
          if (overlayPath) {
            overlayPath.setAttribute('fill', accentPink)
            overlayPath.setAttribute('opacity', '1')
            overlayPath.setAttribute('fill-opacity', '1')
          }
          if (bodyPath) {
            bodyPath.setAttribute('fill', accentPink)
          }
          if (circle) {
            circle.setAttribute('fill', '#ffffff')
          }
        }

        entry.marker = marker

        if (Number.isInteger(index)) {
          markerRefs.current[index] = marker
        }
      })

      elementEntries.forEach(({ element, marker }) => {
        if (!marker) {
          return
        }

        element.addEventListener("mouseenter", () => {
          marker.getElement().classList.add("hovered-marker")
        })

        element.addEventListener("mouseleave", () => {
          marker.getElement().classList.remove("hovered-marker")
        })
      })

      mapRef.current = map
      setMarkersReady(true)
    }

    const timeout = window.setTimeout(initialiseMap, 100)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [sortedLocations.length])

  useEffect(() => {
    if (!markersReady || !mapRef.current || !markerRefs.current.length) {
      return
    }

    markerRefs.current.forEach((marker, index) => {
      if (!marker) {
        return
      }

      if (expandedLocationIndex === index) {
        marker.getElement().classList.add("marker--active")
        const lngLat = marker.getLngLat()
        marker.getPopup()?.setLngLat(lngLat).addTo(mapRef.current)
        mapRef.current?.flyTo({ center: lngLat, zoom: 13, essential: true })
      } else {
        marker.getElement().classList.remove("marker--active")
        marker.getPopup()?.remove()
      }
    })
  }, [expandedLocationIndex, markersReady])

  const handleToggleLocation = (index, hasGps) => {
    const isCurrentlyExpanded = expandedLocationIndex === index
    setExpandedLocationIndex(isCurrentlyExpanded ? null : index)

    if (!hasGps) {
      markerRefs.current.forEach((marker) => {
        marker?.getElement().classList.remove("marker--active")
        marker?.getPopup()?.remove()
      })
    }
  }

  const renderLocation = (entry) => {
    const {
      title,
      subtitle,
      locationName,
      additionalInfo,
      openingTimes,
      link,
      gpsRaw,
      lat,
      lng,
      globalIndex,
      original,
      theme = "",
    } = entry

    const hasGps = Number.isFinite(lat) && Number.isFinite(lng)
    const isExpanded = expandedLocationIndex === globalIndex
    const locationClasses = ["location"]
    if (!hasGps) {
      locationClasses.push("location--no-gps")
    }
    if (isExpanded) {
      locationClasses.push("location--expanded")
    }

    const locationKey =
      original?.id ||
      original?.attributes?.slug ||
      `programme-location-${globalIndex}`

    return (
      <div
        key={locationKey}
        className={locationClasses.join(" ")}
        data-gps={gpsRaw || ""}
        data-lat={hasGps ? lat : ""}
        data-lng={hasGps ? lng : ""}
        data-index={globalIndex}
        data-title={title}
        data-subtitle={subtitle}
        data-location-name={locationName}
        data-link={link || ""}
        data-theme={theme}
      >
        <button
          type="button"
          className="location__toggle"
          onClick={() => handleToggleLocation(globalIndex, hasGps)}
          aria-expanded={isExpanded}
          aria-controls={`location-panel-${locationKey}`}
        >
          <span className="location__title-text">
            {title}
            {subtitle && (
              <span className="location__subtitle"> – {subtitle}</span>
            )}
          </span>
          <span className="location__toggle-icon" aria-hidden="true" />
        </button>

        <div
          id={`location-panel-${locationKey}`}
          className="location__panel"
          hidden={!isExpanded}
        >
          {locationName && <h3>{locationName}</h3>}
          <ReactMarkdown className="opening-times" children={openingTimes} />
          {additionalInfo && (
            <ReactMarkdown
              className="additional-info"
              children={additionalInfo}
            />
          )}
          <div className="location__actions">
            {link && (
              <a
                className="location__external-link"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit website
              </a>
            )}
            {hasGps && (
              <a
                className="location__external-link location__external-link--maps"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${lat},${lng}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="festival-wrapper template-visit">
      <div className="title-wrapper">
        <h1 className="page-title">Visit</h1>
      </div>
      <Layout global={global} festival={festival} seo={pageSeo}>
        <section className="article visit">
          <div className="visit__aquarelles" aria-hidden="true">
            <div className="visit__aquarelle visit__aquarelle--left">
              <img src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-dach.webp" alt="" />
            </div>
          </div>
          <div className="content">
            <div className="wrapper">
              <div className="visit__left-column">
                <div className="locations">
                  {locationColumns.map((columnItems, columnIndex) => (
                    <div
                      className="locations__column"
                      key={`locations-column-${columnIndex}`}
                    >
                      {columnIndex === 0 && (
                        <div className="info-wrapper">
                          <h2>Venues</h2>
                        </div>
                      )}
                      {columnItems.map((entry) => renderLocation(entry))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="visit__map">
                <div id="map"></div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const params = {
    slug: BIENNIAL_SLUG,
  }
  // Run API calls in parallel
  const [festivalRes, globalRes, locationsRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*&populate[visit][populate]=*&populate[cover_image][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
    fetchAPI(
      `/locations?filters[biennial][slug][$eq]=${params.slug}&populate=*`
    ),
  ])

  const locations = locationsRes?.data || []

  return {
    props: {
      festival: festivalRes?.data?.[0] || null,
      global: globalRes?.data || null,
      locations,
    },
  }
}

export default Visit
