import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import React, { useEffect, useMemo, useState } from "react"
import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import Moment from "moment"
import ensureJquery from "/lib/biennial/ensureJquery"

const Timetable = ({ global, festival, programmes, locRes }) => {
  const [loading, setLoading] = useState(true)
  const DEFAULT_HOUR_WIDTH_REM = 10 // keep in sync with --timetable-hour-width in SCSS
  const [hourWidthRem, setHourWidthRem] = useState(DEFAULT_HOUR_WIDTH_REM)
  const [isMobileView, setIsMobileView] = useState(false)
  const weekdaysShort = ["Mo", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const normalizeDate = (dateStr) => {
    if (!dateStr) {
      return null
    }

    if (dateStr instanceof Date) {
      return dateStr.toISOString().split("T")[0]
    }

    if (typeof dateStr !== "string") {
      return null
    }

    const trimmed = dateStr.trim()

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed
    }

    if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
      return trimmed.replace(/\//g, "-")
    }

    const tokens = trimmed.split("/")
    if (tokens.length === 3) {
      const [first, second, third] = tokens
      if (third.length === 4) {
        const day = first.padStart(2, "0")
        const month = second.padStart(2, "0")
        return `${third}-${month}-${day}`
      }
      if (first.length === 4) {
        const month = second.padStart(2, "0")
        const day = third.padStart(2, "0")
        return `${first}-${month}-${day}`
      }
    }

    return trimmed
  }

  function getDates(startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
      const date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }
    while (currentDate <= endDate) {
      dates.push(currentDate)
      currentDate = addDays.call(currentDate, 1)
    }
    return dates
  }

  const dates = getDates(new Date("2024-02-02"), new Date("2024-03-24"))
  const LOCATION_WIDTH_REM = 13.5 // keep in sync with --timetable-location-width in SCSS
  const PROGRAMME_MARGIN_OFFSET_REM = 0.5 // small nudge so blocks sit just inside the timeline
  useEffect(() => {
    if (typeof window === "undefined") return
    const rootStyles = getComputedStyle(document.documentElement)
    const bodyStyles = getComputedStyle(document.body)
    const rawWidth =
      bodyStyles.getPropertyValue("--timetable-hour-width") ||
      rootStyles.getPropertyValue("--timetable-hour-width")
    const parsedWidth = parseFloat(rawWidth)
    if (Number.isFinite(parsedWidth)) {
      setHourWidthRem(parsedWidth)
    }
    const checkMobile = () => {
      setIsMobileView(
        window.matchMedia("(max-width: 768px)").matches ||
          window.matchMedia("(pointer: coarse)").matches
      )
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const parseTime = (value) => {
    if (!value || typeof value !== "string") return null
    const [hoursStr, minutesStr = "0"] = value.split(":")
    const hoursNum = Number(hoursStr)
    const minutesNum = Number(minutesStr)
    if (Number.isNaN(hoursNum) || Number.isNaN(minutesNum)) {
      return null
    }
    return hoursNum + minutesNum / 60
  }

  const times = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
  ]

  // Track event dates only for timed + placed items (matches rendered timetable days)
  const eventDateCounts = useMemo(() => {
    const counts = {}
    locRes.forEach((loc) => {
      const programmesForLoc =
        Array.isArray(loc?.attributes?.programme_items?.data) &&
          loc.attributes.programme_items.data.length > 0
          ? loc.attributes.programme_items.data
          : []
      programmesForLoc.forEach((progRef) => {
        const fullProg = programmes.find(
          (fullProgItem) => fullProgItem?.attributes?.slug === progRef?.attributes?.slug
        )
        if (!fullProg) return

        const whenWhere = Array.isArray(fullProg.attributes?.WhenWhere)
          ? fullProg.attributes.WhenWhere
          : []

        whenWhere.forEach((entry) => {
          const normalized = normalizeDate(entry?.date)
          if (!normalized) return
          if (loc?.attributes?.title !== entry?.location?.data?.attributes?.title) return

          const startTime = parseTime(entry?.start_time)
          const endTime = parseTime(entry?.end_time)
          const hasTimes = Number.isFinite(startTime) && Number.isFinite(endTime)
          if (!hasTimes) return

          const key = Moment(normalized).format("YYYY-MM-DD")
          counts[key] = (counts[key] || 0) + 1
        })
      })
    })
    return counts
  }, [locRes, programmes])

  const sortedEventKeys = useMemo(() => Object.keys(eventDateCounts).sort(), [eventDateCounts])

  const firstEventDate = useMemo(() => {
    if (sortedEventKeys.length === 0) return dates[0]
    return new Date(sortedEventKeys[0])
  }, [sortedEventKeys, dates])

  const lastEventDate = useMemo(() => {
    if (sortedEventKeys.length === 0) return dates[dates.length - 1]
    return new Date(sortedEventKeys[sortedEventKeys.length - 1])
  }, [sortedEventKeys, dates])

  const calendarMonths = useMemo(() => {
    if (!firstEventDate || !lastEventDate) {
      return []
    }

    const months = []
    const start = new Date(
      firstEventDate.getFullYear(),
      firstEventDate.getMonth(),
      1
    )
    const end = new Date(
      lastEventDate.getFullYear(),
      lastEventDate.getMonth(),
      1
    )
    let cursor = new Date(start)

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1

    for (let i = 0; i < totalMonths; i += 1) {
      const year = cursor.getFullYear()
      const month = cursor.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0

      const dayCells = []
      const prevMonth = new Date(year, month, 0)
      const prevDays = prevMonth.getDate()

      for (let j = firstDayOffset; j > 0; j -= 1) {
        const dayNum = prevDays - j + 1
        const dateObj = new Date(year, month, 1 - j)
        const dateKey = Moment(dateObj).format("YYYY-MM-DD")
        const dayId = Moment(dateObj).format("ddd-D-MMM")
        const count = eventDateCounts[dateKey] || 0
        dayCells.push({
          type: "adjacent",
          day: dayNum,
          id: dayId,
          key: dateKey,
          eventCount: count,
          clickable: count > 0,
        })
      }
      for (let d = 1; d <= daysInMonth; d += 1) {
        const dateObj = new Date(year, month, d)
        const dateKey = Moment(dateObj).format("YYYY-MM-DD")
        const dayId = Moment(dateObj).format("ddd-D-MMM")
        const count = eventDateCounts[dateKey] || 0
        dayCells.push({
          type: "day",
          day: d,
          id: dayId,
          key: dateKey,
          eventCount: count,
          clickable: count > 0,
        })
      }

      const remainder = dayCells.length % 7
      if (remainder > 0) {
        const daysToAdd = 7 - remainder
        for (let n = 1; n <= daysToAdd; n += 1) {
          const dateObj = new Date(year, month + 1, n)
          const dateKey = Moment(dateObj).format("YYYY-MM-DD")
          const dayId = Moment(dateObj).format("ddd-D-MMM")
          const count = eventDateCounts[dateKey] || 0
          dayCells.push({
            type: "adjacent",
            day: n,
            id: dayId,
            key: dateKey,
            eventCount: count,
            clickable: count > 0,
          })
        }
      }

      const activeDaysThisMonth = Array.from(
        { length: daysInMonth },
        (_, idx) => idx + 1
      ).filter((d) => {
        const dateObj = new Date(year, month, d)
        const dateKey = Moment(dateObj).format("YYYY-MM-DD")
        return (eventDateCounts[dateKey] || 0) > 0
      })

      const isSkippableJanuary =
        month === 0 &&
        activeDaysThisMonth.length > 0 &&
        activeDaysThisMonth.every((d) => d >= 26)

      if (isSkippableJanuary) {
        cursor = new Date(year, month + 1, 1)
        continue
      }

      months.push({
        key: `${year}-${month + 1}`,
        label: Moment(cursor).format("MMMM YYYY"),
        days: dayCells,
      })

      cursor = new Date(year, month + 1, 1)
    }

    return months
  }, [eventDateCounts, firstEventDate, lastEventDate])

  const renderDates = useMemo(() => {
    if (!firstEventDate || !lastEventDate || sortedEventKeys.length === 0) {
      return []
    }
    return getDates(firstEventDate, lastEventDate)
  }, [firstEventDate, lastEventDate, sortedEventKeys])

  const handleDayClick = (day) => {
    if (!day?.id) return
    const el = document.getElementById(day.id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const days = document.getElementsByClassName("timetable-locations")
      for (let i = 0; i < days.length; i += 1) {
        if (days[i].getElementsByClassName("loc-text").length < 1) {
          days[i].classList.add("hide")
        }
      }
    }, 2000)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const $ = ensureJquery()
    if (!$) {
      return undefined
    }

    const currentDate = Moment(new Date()).format("ddd-D-MMM")

    const animateTimeout = window.setTimeout(() => {
      $("body, html").animate({
        scrollTop: 200,
      })
    }, 1000)

    const scrollTimeout = window.setTimeout(() => {
      document.getElementById(currentDate)?.scrollIntoView({
        behavior: "smooth",
      })
    }, 2000)

    return () => {
      window.clearTimeout(animateTimeout)
      window.clearTimeout(scrollTimeout)
      $("body, html").stop(true)
    }
  }, [])

  useEffect(() => {
    for (
      let j = 0;
      j < document.getElementsByClassName("timetable-row").length;
      j += 1
    ) {
      if (document.getElementsByClassName("timetable-row")[j].children.length === 0) {
        document.getElementsByClassName("timetable-row")[j].remove()
      }
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const ROW_ARROW_CLASS = "timetable-row__overflow-arrow"
    const ARROW_SELECTOR = `.${ROW_ARROW_CLASS}`
    const RIGHT_CONTAINER_SELECTOR = ".timetable-day__right"
    const PROGRAMME_SELECTOR = ".programme"

    const ensureArrow = (row) => {
      let arrow = row.querySelector(ARROW_SELECTOR)
      let created = false
      if (!arrow) {
        arrow = document.createElement("button")
        arrow.type = "button"
        arrow.className = ROW_ARROW_CLASS
        arrow.setAttribute("aria-label", "Scroll to later events")
        arrow.innerText = "→"
        arrow.style.transition = "opacity 0.25s ease"
        row.appendChild(arrow)
        created = true
      }
      return { arrow, created }
    }

    const updateArrows = () => {
      const rightContainers = Array.from(
        document.querySelectorAll(RIGHT_CONTAINER_SELECTOR)
      )

      rightContainers.forEach((container) => {
        const containerRect = container.getBoundingClientRect()
        const rows = Array.from(container.querySelectorAll(".timetable-row"))

        rows.forEach((row) => {
          const programmes = Array.from(row.querySelectorAll(PROGRAMME_SELECTOR))
          if (!programmes.length) {
            const existing = row.querySelector(ARROW_SELECTOR)
            if (existing) {
              existing.style.opacity = "0"
              existing.style.pointerEvents = "none"
            }
            return
          }

          const { arrow, created } = ensureArrow(row)
          arrow.style.display = "flex"
          const arrowRect = arrow.getBoundingClientRect()
          const thresholdLeft =
            (arrowRect && Number.isFinite(arrowRect.left)
              ? arrowRect.left
              : window.innerWidth * 0.8) + 8

          const nextHidden = programmes.find((prog) => {
            const timeEl = prog.querySelector(".time") || prog
            const rect = timeEl.getBoundingClientRect()
            console.log("[timetable] arrow vs item", {
              row: row.className,
              arrowLeft: thresholdLeft,
              itemLeft: rect.left,
              delta: rect.left - thresholdLeft,
            })
            return rect.left > thresholdLeft
          })

          if (!nextHidden) {
            arrow.style.opacity = "0"
            arrow.style.pointerEvents = "none"
            return
          }

          if (created) {
            console.log(
              "[timetable] adding arrow: items beyond arrow threshold",
              row.className
            )
          }
          arrow.style.opacity = "1"
          arrow.style.pointerEvents = "auto"
          const rowRect = row.getBoundingClientRect()
          arrow.style.top = `${rowRect.top + window.scrollY + 8}px`
          arrow.onclick = () => {
            const timeEl = nextHidden.querySelector(".time") || nextHidden
            const nextRect = timeEl.getBoundingClientRect()
            const delta = nextRect.left - containerRect.left
            const targetLeft = Math.max(container.scrollLeft + delta - 16, 0)
            container.scrollTo({
              left: targetLeft,
              behavior: "smooth",
            })
          }
        })
      })
    }

    updateArrows()
    window.requestAnimationFrame(updateArrows)
    const delayed = window.setTimeout(updateArrows, 250)
    const delayedLong = window.setTimeout(updateArrows, 2500)

    const timetableRoot =
      document.querySelector(".timetable-day__right") ||
      document.querySelector(".timetable")
    let mutationTimeout
    const mutationObserver =
      timetableRoot &&
      new MutationObserver(() => {
        window.clearTimeout(mutationTimeout)
        mutationTimeout = window.setTimeout(updateArrows, 50)
      })
    if (mutationObserver && timetableRoot) {
      mutationObserver.observe(timetableRoot, {
        childList: true,
        subtree: true,
      })
    }

    const rightContainers = Array.from(
      document.querySelectorAll(RIGHT_CONTAINER_SELECTOR)
    )
    rightContainers.forEach((container) =>
      container.addEventListener("scroll", updateArrows, { passive: true })
    )
    window.addEventListener("resize", updateArrows)

    return () => {
      window.clearTimeout(delayed)
      window.clearTimeout(delayedLong)
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
      window.clearTimeout(mutationTimeout)
      rightContainers.forEach((container) =>
        container.removeEventListener("scroll", updateArrows)
      )
      window.removeEventListener("resize", updateArrows)
    }
  }, [programmes, locRes])

  return (
    <>
      <div className="timetable"></div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <section className="festival-wrapper">
          <Layout global={global} festival={festival}>
            <div className="title-wrapper">
              <h1 className="page-title">Timetable</h1>
            </div>
            <div className="timetable-links">
              {festival.attributes.timetable.map((item, i) => {
                const linkKey = item.id || `${item.label || "timetable"}-${i}`
                return (
                  <a key={linkKey} className="timetable-link" href={item.url}>
                    {item.label}
                  </a>
                )
              })}
            </div>
            <div className="timetable-layout">
              <aside className="timetable-sidebar">
                {calendarMonths.map((month) => (
                  <div className="timetable-sidebar__month" key={month.key}>
                    <div className="timetable-sidebar__header">
                      {month.label}
                    </div>
                    <div className="timetable-sidebar__weekdays">
                      {weekdaysShort.map((wd) => (
                        <div
                          key={`${month.key}-${wd}`}
                          className="timetable-sidebar__weekday"
                        >
                          {wd}
                        </div>
                      ))}
                    </div>
                    <div className="timetable-sidebar__days">
                      {month.days.map((day, idx) =>
                        day.type === "blank" ? (
                          <div
                            key={`${month.key}-blank-${idx}`}
                            className="timetable-sidebar__day timetable-sidebar__day--blank"
                          />
                        ) : (
                          <button
                            key={`${month.key}-${day.key}`}
                            type="button"
                            className={[
                              "timetable-sidebar__day",
                              day.clickable
                                ? "timetable-sidebar__day--clickable"
                                : "timetable-sidebar__day--disabled",
                              day.type === "adjacent"
                                ? "timetable-sidebar__day--adjacent"
                                : null,
                              day.eventCount > 0
                                ? `timetable-sidebar__day--events-${Math.min(
                                  day.eventCount,
                                  4
                                )}`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            disabled={!day.clickable}
                            onClick={() => handleDayClick(day)}
                            aria-label={
                              day.clickable
                                ? `Go to ${day.key}`
                                : `No events on ${day.key}`
                            }
                          >
                            {day.day}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </aside>
              <div className="timetable">
                {renderDates.map((day, i) => {
                  let number = 0
                  let end = 24
                  let list = []
                  let list2 = []
                  let timeWidth = 24
                  const EXTRA_HOURS = isMobileView ? 0 : 3
                  const MIN_VISIBLE_HOURS = 12

                  programmes.forEach((programme) => {
                    const items = programme.attributes.WhenWhere.filter((when) => {
                      const normalized = normalizeDate(when.date)
                      if (!normalized) {
                        return false
                      }
                      return (
                        Moment(normalized).format("DD MM") ===
                        Moment(day).format("DD MM")
                      )
                    })
                    if (items[0]?.start_time) {
                      list.push(items[0].start_time.slice(0, 2))
                    }
                    if (items[0]?.end_time) {
                      if (Number(items[0].end_time.slice(0, 2)) < 7) {
                        list2.push(24 + Number(items[0].end_time.slice(0, 2)))
                      } else {
                        list2.push(items[0].end_time.slice(0, 2))
                      }
                    }
                  })
                  if (list.sort()[0]) {
                    number = list.sort()[0] - 7
                  }
                  if (list2.sort()[0]) {
                    const lastHour = Number(list2.sort().reverse()[0])
                    end = Math.min(
                      times.length,
                      lastHour - 6 + EXTRA_HOURS
                    )
                    timeWidth =
                      lastHour - Number(list.sort()[0]) + EXTRA_HOURS
                  }

                  // Ensure at least a minimum visible window even for sparse days
                  if (timeWidth < MIN_VISIBLE_HOURS) {
                    timeWidth = MIN_VISIBLE_HOURS
                    end = Math.min(times.length, number + MIN_VISIBLE_HOURS)
                  }

                  const dayKey = `${Moment(day).format("YYYY-MM-DD")}-${i}`

                  const locationsForDay = locRes.filter((loc) => {
                    const programmesForLoc = loc.attributes.programme_items.data
                    if (!Array.isArray(programmesForLoc) || programmesForLoc.length === 0) {
                      return false
                    }

                    return programmesForLoc.some((prog) => {
                      const fullProgItem = programmes.filter(
                        (fullProg) => fullProg.attributes.slug == prog.attributes.slug
                      )[0]
                      if (!fullProgItem) return false

                      return fullProgItem.attributes.WhenWhere.some((when) => {
                        const normalized = normalizeDate(when.date)
                        if (!normalized) return false
                        if (
                          loc.attributes.title !== when.location.data?.attributes?.title
                        ) {
                          return false
                        }
                        const startTime = parseTime(when.start_time)
                        const endTime = parseTime(when.end_time)
                        const hasTimes =
                          Number.isFinite(startTime) && Number.isFinite(endTime)
                        if (!hasTimes) return false
                        return (
                          Moment(normalized).format("DD MM") ===
                          Moment(day).format("DD MM")
                        )
                      })
                    })
                  })

                  if (locationsForDay.length === 0) {
                    return null
                  }

                  return (
                    <div
                      className="timetable-locations-outer-wrapper"
                      key={dayKey}
                    >
                      <div
                        className="timetable-locations"
                        id={`${Moment(day).format("ddd-D-MMM")}`}
                      >
                        <div
                          className="day timetable-wrapper"
                          style={{
                            "--time-width": timeWidth * hourWidthRem + hourWidthRem + "rem",
                            minHeight: `calc(${locationsForDay.length} * var(--timetable-row-height) + var(--timetable-date-height))`,
                          }}
                        >
                          <div className="timetable-day__left">
                            <h1 className="date">
                              {Moment(day).format("ddd D MMM")}
                            </h1>
                            <div className="location-list">
                              {locationsForDay.map((loc, j) => (
                                <div
                                  className={`location ${loc.attributes.sub ? "sub" : ""}`}
                                  key={loc.id || `location-${j}`}
                                >
                                  <p className="loc-text">{loc.attributes.title}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="timetable-day__right">
                            <div className="timetable-day__canvas">
                              <div
                                key={`times${i}`}
                                className="timetable-times"
                                style={{
                                  "--time-width": timeWidth * hourWidthRem + hourWidthRem + "rem",
                                }}
                              >
                                {times.slice(number, end).map((time, i) => {
                                  return (
                                    <div key={`time${i}`} className="time-block">
                                      <div className="time">{time}</div>
                                    </div>
                                  )
                                })}
                              </div>
                              {locationsForDay.map((loc, j) => {
                                const programmesForLoc = loc.attributes.programme_items.data
                                const timedProgrammes = programmesForLoc.filter((prog) => {
                                  const fullProgItem = programmes.find(
                                    (fullProg) => fullProg.attributes.slug == prog.attributes.slug
                                  )
                                  if (!fullProgItem) return false
                                  return fullProgItem.attributes.WhenWhere.some((when) => {
                                    const normalized = normalizeDate(when.date)
                                    if (!normalized) return false
                                    const startTime = parseTime(when.start_time)
                                    const endTime = parseTime(when.end_time)
                                    const hasTimes =
                                      Number.isFinite(startTime) && Number.isFinite(endTime)
                                    if (!hasTimes) return false
                                    if (
                                      loc.attributes.title !==
                                      when.location.data?.attributes?.title
                                    ) {
                                      return false
                                    }
                                    return (
                                      Moment(normalized).format("DD MM") ===
                                      Moment(day).format("DD MM")
                                    )
                                  })
                                })
                                if (!timedProgrammes.length) {
                                  return null
                                }
                                return (
                                  <div
                                    className={`timetable-row ${loc.attributes.slug}`}
                                    key={loc.id || `location-${j}`}
                                  >
                                    {timedProgrammes.map((prog, k) => {
                                      const fullProgItem = programmes.filter(
                                        (fullProg) =>
                                          fullProg.attributes.slug == prog.attributes.slug
                                      )[0]
                                      const items = fullProgItem.attributes.WhenWhere.filter(
                                        (when) => {
                                          const normalized = normalizeDate(when.date)
                                          if (!normalized) {
                                            return false
                                          }
                                          const startTimeCheck = parseTime(when.start_time)
                                          const endTimeCheck = parseTime(when.end_time)
                                          const hasTimesCheck =
                                            Number.isFinite(startTimeCheck) &&
                                            Number.isFinite(endTimeCheck)
                                          if (!hasTimesCheck) {
                                            return false
                                          }
                                          return (
                                            Moment(normalized).format("DD MM") ===
                                            Moment(day).format("DD MM")
                                          )
                                        }
                                      )
                                      return (
                                        <React.Fragment
                                          key={
                                            prog.id ||
                                            `${loc.id || loc.attributes.slug}-programme-${k}`
                                          }
                                        >
                                          {items?.map((item, l) => {
                                            const startTime = parseTime(item.start_time)
                                            const endTimeRaw = parseTime(item.end_time)
                                            const hasTimes =
                                              Number.isFinite(startTime) &&
                                              Number.isFinite(endTimeRaw)
                                            const endTime =
                                              hasTimes && endTimeRaw <= 6
                                                ? endTimeRaw + 24
                                                : endTimeRaw
                                            const blockWidthHours = hasTimes
                                              ? Math.max(endTime - startTime, 1)
                                              : 1
                                            const offsetHours = hasTimes
                                              ? startTime - 7 - number
                                              : 0
                                            if (
                                              loc.attributes.title !==
                                              item.location.data?.attributes?.title
                                            ) {
                                              return null
                                            }
                                            return (
                                              <div
                                                key={`${prog.id || prog.attributes.slug}-programme-${l}`}
                                                id="programme_wrapper"
                                                className={`programme-wrapper`}
                                              >
                                                <a
                                                  href={`/biennial/${BIENNIAL_SLUG}/programme/${prog.attributes.slug}`}
                                                  className={[
                                                    "programme",
                                                    prog.attributes.hide_in_timetable ? "hide" : "",
                                                    !hasTimes ? "programme--untimed" : null,
                                                  ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                                  style={{
                                                    "--margin": `calc(${offsetHours} * var(--timetable-hour-width, ${DEFAULT_HOUR_WIDTH_REM}rem) + ${PROGRAMME_MARGIN_OFFSET_REM}rem)`,
                                                    "--width": `calc(${blockWidthHours} * var(--timetable-hour-width, ${DEFAULT_HOUR_WIDTH_REM}rem) - ${PROGRAMME_MARGIN_OFFSET_REM * 2
                                                      }rem)`,
                                                  }}
                                                >
                                                  <div className="inner-programme">
                                                    <div className="inner-wrapper">
                                                      <div className="time">
                                                        {hasTimes
                                                          ? `${item.start_time}–${item.end_time}`
                                                          : "–"}
                                                      </div>
                                                      <div className="title-artist-wrapper">
                                                        <div className="title">
                                                          {prog.attributes.title}
                                                        </div>
                                                        {prog.attributes.hide_artists_in_timetable !==
                                                          true && (
                                                            <div className="artists">
                                                              {fullProgItem.attributes.community_items.data.map(
                                                                (com, k) => {
                                                                  return (
                                                                    <div
                                                                      key={`${prog.id || prog.attributes.slug}-artist-${k}`}
                                                                    >
                                                                      {com.attributes.name}
                                                                    </div>
                                                                  )
                                                                }
                                                              )}
                                                            </div>
                                                          )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </a>
                                              </div>
                                            )
                                          })}
                                        </React.Fragment>
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Layout>
        </section>
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  const params = {
    slug: BIENNIAL_SLUG,
  }


  const preview = query.preview || process.env.NEXT_PUBLIC_PREVIEW
  const publicationState = preview ? "preview" : "live"
  const publicationParam = `&publicationState=${publicationState}`

  const [festivalRes, globalRes, programmeRes, locRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*&populate[timetable][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
    fetchAPI(
      `/programme-items?filters[biennial][slug][$eq]=${params.slug}${publicationParam}&populate[WhenWhere][populate]=*&populate[WhenWhere][location][populate]=*&populate[community_items][populate]=*&pagination[limit]=${100}`
    ),
    fetchAPI(
      `/locations?filters[biennial][slug][$eq]=${params.slug}${publicationParam}&populate[programme_items][populate]=*&sort[0]=title:asc&pagination[limit]=${100}`
    ),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
      programmes: programmeRes.data,
      locRes: locRes.data,
    },
  }
}

export default Timetable
