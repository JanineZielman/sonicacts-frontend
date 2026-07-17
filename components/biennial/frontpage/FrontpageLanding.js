import { useEffect, useRef, useState } from "react"

import FrontpageVisuals from "./FrontpageVisuals"
import RaycastCanvas from "./RaycastCanvas"
import PictureWithWebp from "../PictureWithWebp"

const OVERLAY_BASE_PATH = "/biennial/biennial-2026/assets/frontpage"
const AQUARELLE_BASE_PATH = "/biennial/biennial-2026/assets/aquarelle"

const FrontpageLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const startTimeRef = useRef(performance.now())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  const hideLanding = isScrolled

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined
    }

    const body = document.body

    if (!body?.classList.contains("slug-")) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const introNodes = Array.from(
      document.querySelectorAll("[data-intro-step]")
    )
    introNodes.forEach((node) => {
      node.classList.add("intro-fade-target")
      node.classList.remove("intro-fade-target--visible")
    })

    if (!introNodes.length || prefersReducedMotion) {
      introNodes.forEach((node) =>
        node.classList.add("intro-fade-target--visible")
      )
      return undefined
    }

    body.classList.add("frontpage-intro")

    const waitForImage = (img) => {
      if (!img || img.tagName !== "IMG") {
        return Promise.resolve()
      }

      if (img.complete && img.naturalWidth !== 0) {
        return Promise.resolve()
      }

      return new Promise((resolve) => {
        const handleResolve = () => resolve()
        img.addEventListener("load", handleResolve, { once: true })
        img.addEventListener("error", handleResolve, { once: true })
      })
    }

    const stepMap = new Map()
    introNodes.forEach((node) => {
      const step = Number(node.getAttribute("data-intro-step")) || 0
      const list = stepMap.get(step) || []
      list.push(node)
      stepMap.set(step, list)
    })

    const sortedSteps = Array.from(stepMap.keys()).sort((a, b) => a - b)
    const stepDelay = 500
    const timeouts = []
    let cancelled = false

    const formatElapsed = () => {
      const elapsed = Number(
        ((performance.now() - startTimeRef.current) / 1000).toFixed(1)
      )
      return `${elapsed.toFixed(1)}s`
    }

    const revealStep = (step) => {
      const nodes = stepMap.get(step) || []
      nodes.forEach((node) => {
        const before = window.getComputedStyle(node).opacity
        // console.log(
        //   `[intro] ${formatElapsed()} before`,
        //   step,
        //   node.id || node.className,
        //   before
        // )
        node.classList.add("intro-fade-target--visible")
        requestAnimationFrame(() => {
          const after = window.getComputedStyle(node).opacity
          // console.log(
          //   `[intro] ${formatElapsed()} after`,
          //   step,
          //   node.id || node.className,
          //   after
          // )
        })
      })
    }

    const imagesToWait = (stepMap.get(sortedSteps[0]) || []).filter((node) => {
      if (node.tagName !== "IMG") {
        return false
      }

      const style = window.getComputedStyle(node)
      return style && style.display !== "none" && style.visibility !== "hidden"
    })

    Promise.all(imagesToWait.map(waitForImage)).then(() => {
      if (cancelled) {
        return
      }

      startTimeRef.current = performance.now()
      sortedSteps.forEach((step, index) => {
        timeouts.push(
          window.setTimeout(() => {
            if (cancelled) {
              return
            }

            revealStep(step)

            if (index === sortedSteps.length - 1) {
              timeouts.push(
                window.setTimeout(() => {
                  if (!cancelled) {
                    body.classList.remove("frontpage-intro")
                  }
                }, 300)
              )
            }
          }, stepDelay * index)
        )
      })
    })

    return () => {
      cancelled = true
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      body.classList.remove("frontpage-intro")
      introNodes.forEach((node) =>
        node.classList.remove("intro-fade-target--visible")
      )
    }
  }, [])

  return (
    <>
      <div id="amsterdam" className="intro-fade-target" data-intro-step="5">
        AMSTERDAM (NL)
      </div>

      <PictureWithWebp
        id="frontpage-background-overlay"
        className="intro-fade-target"
        data-intro-step="1"
        src={`${OVERLAY_BASE_PATH}/250904-SonicActs-2026-WebSketch5_pink_ff87ff.png`}
        webpSrc={`${OVERLAY_BASE_PATH}/250904-SonicActs-2026-WebSketch5_pink_ff87ff.webp`}
        alt="Sonic Acts overlay"
      />

      <PictureWithWebp
        id="frontpage-background-overlay-mobile"
        className="intro-fade-target"
        data-intro-step="1"
        src={`${OVERLAY_BASE_PATH}/250930-SAB-2026-Mobile-Background-blueprint.png`}
        webpSrc={`${OVERLAY_BASE_PATH}/250930-SAB-2026-Mobile-Background-blueprint.webp`}
        alt="Sonic Acts mobile overlay"
      />

      <div
        className={`frontpage-landing${hideLanding ? " frontpage-landing--hidden" : ""}`}
      >
        <FrontpageVisuals />

        <div id="frontpage-main">
          <div
            id="frontpage-aqua-01"
            data-tilt
            data-tilt-full-page-listening=""
            data-tilt-max="4"
            data-tilt-speed="50"
            data-tilt-perspective="500"
          >
            <PictureWithWebp
              src={`${AQUARELLE_BASE_PATH}/aquarell-10-2-10.png`}
              webpSrc={`${AQUARELLE_BASE_PATH}/aquarell-10-2-10.webp`}
              loading="lazy"
              alt="Watercolour overlay"
            />
          </div>

          <div
            id="frontpage-aqua-02"
            data-tilt
            data-tilt-full-page-listening=""
            data-tilt-max="4"
            data-tilt-speed="50"
            data-tilt-perspective="500"
          >
            <PictureWithWebp
              src={`${AQUARELLE_BASE_PATH}/aquarell-10-2-6.png`}
              webpSrc={`${AQUARELLE_BASE_PATH}/aquarell-10-2-6.webp`}
              loading="lazy"
              alt="Watercolour overlay"
            />
          </div>

          <div
            id="frontpage-aqua-03"
            data-tilt
            data-tilt-full-page-listening=""
            data-tilt-max="4"
            data-tilt-speed="50"
            data-tilt-perspective="500"
          >
            <PictureWithWebp
              src={`${AQUARELLE_BASE_PATH}/aquarell-10-2-1.png`}
              webpSrc={`${AQUARELLE_BASE_PATH}/aquarell-10-2-1.webp`}
              loading="lazy"
              alt="Watercolour overlay"
            />
          </div>
        </div>
        <RaycastCanvas />
      </div>
    </>
  )
}

export default FrontpageLanding