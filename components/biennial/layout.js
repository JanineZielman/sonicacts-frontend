"use client"

import Nav from "./nav"
import React, { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/router';
import Image from "./image"
import ReactMarkdown from "react-markdown"
import * as THREE from "three"
import Modal from "react-modal"
import ensureJquery from "/lib/biennial/ensureJquery"
import Seo from "./seo"

const frontpageHiddenIntro = `
<div class="information-card__content" style="pointer-events: auto;">
  <h2>Sonic Acts Biennial 2026 — Melted for Love</h2>
  <p style="pointer-events: auto;">
    The Sonic Acts Biennial 2026, titled <em>Melted for Love</em>, explores the sounds of home.
    It proposes friendly ways of feeling (at) home, technologies of welcoming, and open-ended
    invitations to participate in hospitality. With 'melted for love' as its guide, it seeks to animate
    closeness and friendship. Instead of seeing strangers everywhere, it embraces the world as a mesh
    of souls - human and otherwise - woven together. If home is love - love as a network of family,
    friendship, kinship, and beyond - this Biennial foregrounds communities that work in solidarity,
    exchanging exhaustion for tenderness.
  </p>
  <p>
    Attentiveness, respect, and care are essential expressions of love, and this is what we enact each
    time we listen closely. The voice has long been a force for liberation and resistance, and in a time
    when free speech is under threat and empty noise abounds, our task is to cultivate spaces of openness
    - blueprints for the institutions yet to come.
  </p>
  <p>
    We share the sense of slowly losing home, as solid ground - our public institutions and familiar cultures -
    tumbles under the pressures of populism. The Sonic Acts Biennial builds on the legacy of collectivism,
    free spirit, and experimentation that defined previous editions of the festival, investigating how radical
    listening and making can open new pathways of communication and togetherness.
  </p>
  <p>
    The curatorial process, shaped by five distinct voices, has been guided by collective listening.
    Inspired by the verses of Palestinian national poet Mahmoud Darwish - echoed in the Biennial's title -
    the programme offers listening prompts for times of war, transition, and exile. To be 'melted for love' is
    to dissolve into gentleness, to stand against violence, and to open ourselves to vulnerability. The questions
    that follow chart this horizon: How can sound bring us closer to home? What is a folk song, and can it be
    liberated? Can grief be censored, and what is the history of lament songs? Can we learn the importance of
    listening from Indigenous practices? How might we rethink musical legacies to include those who have been
    excluded? What can rituals teach us, and how can they be staged through sound? How can radio transmission
    become a tool of solidarity in exile? How is sound used in warfare? What is the sound of space, of territory?
    Who gets to have a voice, and how does voice translate to music? And how might listening together open us
    to unconditional hospitality, to love - even in conditions of lovelessness?
  </p>
</div>`

const Layout = ({ children, festival, seo }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isBiennialHome = pathname === "/biennial/biennial-2026" || pathname === "/biennial/biennial-2026/";

  const [loading, setLoading] = useState(false)

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const modalStyles = {
    overlay: {
      backgroundColor: "transparent",
    },
  }

  useEffect(() => {
    if (!pathname) {
      return undefined
    }

    const hideInformationAquarelles = () => {
      ;["aqua-01", "aqua-02", "aqua-03"].forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          element.style.visibility = "hidden"
          element.style.opacity = "0"
        }
      })
    }

    const showInformationAquarelles = () => {
      ;["aqua-01", "aqua-02", "aqua-03"].forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          element.style.visibility = ""
          element.style.opacity = ""
        }
      })
    }

    const applyForPath = (path) => {
      if (typeof path !== "string") {
        return
      }

      if (path.startsWith("/about")) {
        showInformationAquarelles()
      } else {
        hideInformationAquarelles()
      }
    }

    applyForPath(pathname)
    return undefined
  }, [pathname])

  useEffect(() => {
    const toggleScrollClass = () => {
      if (typeof window === "undefined") {
        return
      }

      const shouldToggle = window.scrollY > 1
      const rootElement = document.documentElement
      const bodyElement = document.body

      if (!rootElement || !bodyElement) {
        return
      }

      if (shouldToggle) {
        rootElement.classList.add("has-scrolled")
        bodyElement.classList.add("has-scrolled")
      } else {
        rootElement.classList.remove("has-scrolled")
        bodyElement.classList.remove("has-scrolled")
      }
    }

    toggleScrollClass()
    window.addEventListener("scroll", toggleScrollClass, { passive: true })

    return () => {
      window.removeEventListener("scroll", toggleScrollClass)
    }
  }, [])

  const [isMobileLayout, setIsMobileLayout] = useState(false)

  const lastMobileCheckRef = useRef(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    const checkMobile = () => {
      const isMobile =
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth <= 768
      if (lastMobileCheckRef.current !== isMobile) {
        console.log("[MinimalNav] checkMobile change", {
          isMobile,
          width: window.innerWidth,
          hoverNone: window.matchMedia("(hover: none)").matches,
          coarse: window.matchMedia("(pointer: coarse)").matches,
        })
        lastMobileCheckRef.current = isMobile
      } else {
        console.log("[MinimalNav] checkMobile same", {
          isMobile,
          width: window.innerWidth,
        })
      }
      setIsMobileLayout(isMobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    console.log("[MinimalNav] mobile effect mount", { isMobileLayout, pathname, isBiennialHome })
    if (!isMobileLayout) {
      console.log("[MinimalNav] mobile effect skipped", {
        reason: "desktop",
      })
      return undefined
    }

    const menu = document.querySelector(".menu")
    if (!menu) {
      console.log("[MinimalNav] menu not found")
      return undefined
    }

    const body = document.body
    let menuIsActive = false
    let hideTimeout = null
    let linksReadyTimeout = null

    const minimalNav =
      document.querySelector(".minimal-nav") ||
      menu.querySelector(".minimal-nav")
    let overlayElement =
      minimalNav?.querySelector(".minimal-nav__overlay") || null

    if (minimalNav && !overlayElement) {
      overlayElement = document.createElement("div")
      overlayElement.className = "minimal-nav__overlay"
      minimalNav.appendChild(overlayElement)
      console.log("[MinimalNav] overlay created")
    }

    const navLinks = minimalNav
      ? Array.from(minimalNav.querySelectorAll("a"))
      : []
    const disableNavLinks = () => {
      navLinks.forEach((link) => {
        if (!link.hasAttribute("data-original-href")) {
          const href = link.getAttribute("href")
          if (href) {
            link.setAttribute("data-original-href", href)
          }
        }
        link.setAttribute("href", "#")
      })
    }
    const enableNavLinks = () => {
      navLinks.forEach((link) => {
        const original = link.getAttribute("data-original-href")
        if (original) {
          link.setAttribute("href", original)
          link.removeAttribute("data-original-href")
        }
      })
    }

    const handleOverlayClick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (!menuIsActive) {
        overlayElement?.classList.add("minimal-nav__overlay--active")
        activateMenu()
        logNavState("overlay-open", "")
      } else {
        overlayElement?.classList.remove("minimal-nav__overlay--active")
        collapseMenu()
        logNavState("overlay-close", "")
      }
    }

    overlayElement?.addEventListener("click", handleOverlayClick)

    const logNavState = (context, metadata = "") => {
      const mode = isMobileLayout ? "mobile" : "desktop"
      console.log(
        `[MinimalNav] ${context} (${mode}) -> active:${menuIsActive}, body:${body.className}, menu:${menu.className}${metadata}`
      )
    }

    const activateMenu = () => {
      menuIsActive = true
      menu.classList.add("menu--mobile-active")
      body.classList.add("menu-expanded")
      body.classList.remove("menu-small")
      body.classList.remove("menu-links-ready")
      disableNavLinks()
      if (linksReadyTimeout) {
        window.clearTimeout(linksReadyTimeout)
      }
      linksReadyTimeout = window.setTimeout(() => {
        if (body.classList.contains("menu-expanded")) {
          body.classList.add("menu-links-ready")
          enableNavLinks()
        }
      }, 350)
      overlayElement?.classList.add("minimal-nav__overlay--active")
    }

    const collapseMenu = () => {
      menuIsActive = false
      menu.classList.remove("menu--mobile-active")
      body.classList.remove("menu-expanded")
      body.classList.add("menu-small")
      body.classList.remove("menu-links-ready")
      disableNavLinks()
      if (linksReadyTimeout) {
        window.clearTimeout(linksReadyTimeout)
        linksReadyTimeout = null
      }
      overlayElement?.classList.remove("minimal-nav__overlay--active")
      console.log("[MinimalNav] collapseMenu")
    }

    const syncHomeScrollState = () => {
      if (!isBiennialHome) {
        return
      }
      const hasScrolled = body.classList.contains("has-scrolled")
      if (hasScrolled) {
        menuIsActive = false
        menu.classList.remove("menu--mobile-active")
        body.classList.add("menu-small")
        body.classList.remove("menu-expanded")
        body.classList.remove("menu-links-ready")
        disableNavLinks()
        overlayElement?.classList.remove("minimal-nav__overlay--active")
        return
      }
      menuIsActive = false
      menu.classList.remove("menu--mobile-active")
      body.classList.remove("menu-small")
      body.classList.remove("menu-expanded")
      body.classList.add("menu-links-ready")
      enableNavLinks()
      overlayElement?.classList.remove("minimal-nav__overlay--active")
    }

    const handleClick = (event) => {
      const link = event.target.closest("a")
      const isMinimalNavLink = link && minimalNav && minimalNav.contains(link)
      if (!body.classList.contains("menu-links-ready")) {
        event.preventDefault()
        event.stopPropagation()
      }
      if (isMinimalNavLink) {
        event.preventDefault()
      }

      if (!menuIsActive) {
        event.preventDefault()
        event.stopPropagation()
        activateMenu()
        logNavState(
          "click-open",
          isMinimalNavLink
            ? `, link:${link.getAttribute("href")}, text:${link.textContent.trim()}`
            : ""
        )
        return
      }
      if (hideTimeout) {
        window.clearTimeout(hideTimeout)
      }
      hideTimeout = window.setTimeout(() => {
        collapseMenu()
      }, 500)
      logNavState(
        "click-close",
        isMinimalNavLink
          ? `, link:${link.getAttribute("href")}, text:${link.textContent.trim()}`
          : ""
      )
    }

    const handleScroll = () => {
      if (isBiennialHome) {
        syncHomeScrollState()
        return
      }
      collapseMenu()
    }

    menu.addEventListener("touchstart", activateMenu, { passive: true })
    menu.addEventListener("click", handleClick)
    window.addEventListener("scroll", handleScroll, { passive: true })
    if (isBiennialHome) {
      syncHomeScrollState()
    } else {
      body.classList.add("menu-small")
      disableNavLinks()
    }

    return () => {
      overlayElement?.removeEventListener("click", handleOverlayClick)
      menu.removeEventListener("touchstart", activateMenu)
      menu.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", handleScroll)
      collapseMenu()
      body.classList.remove("menu-small")
      body.classList.remove("menu-links-ready")
      enableNavLinks()
      if (hideTimeout) {
        window.clearTimeout(hideTimeout)
      }
      if (linksReadyTimeout) {
        window.clearTimeout(linksReadyTimeout)
      }
    }
  }, [isMobileLayout])

  useEffect(() => {
    const $ = ensureJquery()
    if (!$) {
      setLoading(false)
      return undefined
    }

    const detectBrowser = () => {
      if (typeof navigator === "undefined") {
        return "unknown"
      }

      const ua = navigator.userAgent

      if (ua.includes("Opera") || ua.includes("OPR")) {
        return "opera"
      }

      if (ua.includes("Edg")) {
        return "edge"
      }

      if (ua.includes("Chrome")) {
        return "chrome"
      }

      if (ua.includes("Safari")) {
        return "safari"
      }

      if (ua.includes("Firefox")) {
        return "firefox"
      }

      if (ua.includes("MSIE") || document.documentMode === true) {
        return "ie"
      }

      return "unknown"
    }

    const browserCheck = detectBrowser()

    const handleColophonClick = (e) => {
      if (window.location.pathname === "/about") {
        e.preventDefault()
        const target = document.getElementById("information-card-97")

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
          target.classList.add("information-card--highlight")
          window.setTimeout(() => {
            target.classList.remove("information-card--highlight")
          }, 1400)
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(false)

      $(".normal-image").each(function () {
        let container, stats, loader
        let camera, scene, renderer
        let mesh
        let directionalLight, pointLight, ambientLight

        let mouseX = 0
        let mouseY = 0

        let targetX = 0
        let targetY = 0

        const windowHalfX = window.innerWidth / 2
        const windowHalfY = window.innerHeight / 2

        const wrapper = $(this)
        const video = $(this).find("video")[0]
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load($(this).find("img").attr("src"))
        texture.colorSpace = THREE.SRGBColorSpace

        init()

        fpsInterval = 1000 / fps
        then = Date.now()
        startTime = then

        animate()

        function init() {
          $("html").addClass("browser-" + browserCheck)

          const threeWapper = $("<div class='three-normal'></div>")
          threeWapper.hide()

          setTimeout(function () {
            threeWapper.fadeIn("slow")
          }, 2000)

          wrapper.append(threeWapper)

          container = threeWapper[0]

          camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            1000
          )
          camera.position.z = 12

          scene = new THREE.Scene()

          // LIGHTS

          ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
          scene.add(ambientLight)

          //pointLight = new THREE.PointLight( 0xffffff, 10 );
          //pointLight.position.set( 0, 0, 6 );
          //scene.add( pointLight );

          directionalLight = new THREE.DirectionalLight(0xffffff, 4.5)
          directionalLight.position.set(1, -0.5, -1)
          scene.add(directionalLight)

          const normalMap = new THREE.VideoTexture(video)

          let material = new THREE.MeshStandardMaterial({
            fog: false,
            map: texture,
            //specular: 0xFFFFFF, //Specular color of the material. Default is a Color set to 0x111111 (very dark grey).
            //shininess: 1000,  //How shiny the .specular highlight is; a higher value gives a sharper highlight. Default is 30.
            normalMap: normalMap,
            normalScale: new THREE.Vector2(1, 1),
            //normalMapType: THREE.ObjectSpaceNormalMap,
          })

          mesh = new THREE.Mesh(new THREE.PlaneGeometry(26, 14), material)

          scene.add(mesh)

          scene.background = null

          renderer = new THREE.WebGLRenderer({
            //antialias: true,
            alpha: true,
          })

          //renderer.setClearAlpha( 0 );
          //renderer.setClearColor( 0x000000, 0 ); // the default
          //renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing

          renderer.setSize(window.innerWidth, window.innerHeight)
          container.appendChild(renderer.domElement)

          //stats = new Stats();
          //container.appendChild( stats.dom );
          ////wrapper.append(stats.dom);

          document.addEventListener("mousemove", onDocumentMouseMove)
          window.addEventListener("resize", onWindowResize)
        }

        function onWindowResize() {
          const width = window.innerWidth
          const height = window.innerHeight

          camera.aspect = width / height
          camera.updateProjectionMatrix()

          renderer.setSize(width, height)
        }

        function onDocumentMouseMove(event) {
          mouseX = event.clientX - windowHalfX
          mouseY = event.clientY - windowHalfY
        }

        var stop = false
        var frameCount = 0
        var $results = $("#results")
        var fps, fpsInterval, startTime, now, then, elapsed

        fpsInterval = 30

        function animate() {
          requestAnimationFrame(animate)

          // calc elapsed time since last loop
          now = Date.now()
          elapsed = now - then

          // if enough time has elapsed, draw the next frame

          if (elapsed > fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval)

            // Put your drawing code here
            render()
            //stats.update();
          }
        }

        function render() {
          targetX = mouseX * 0.001
          targetY = -1 * mouseY * 0.002

          //console.log(mouseX, targetX, mouseY, targetY);

          if (mesh) {
            mesh.rotation.y = 0.2 * (targetX - mesh.rotation.y)
            mesh.rotation.x = 0.2 * (targetY - mesh.rotation.x)

            directionalLight.position.set(1.5, targetY, 1)
          }

          renderer.render(scene, camera)
        }
      })

      $("#colophon-link a").on("click", handleColophonClick)
    }, 100)

    return () => {
      window.clearTimeout(timeoutId)
      $("#colophon-link a").off("click", handleColophonClick)
    }
  }, [])

  const resolvedSeo =
    seo ||
    festival?.attributes?.seo ||
    (festival?.attributes
      ? {
        metaTitle:
          festival.attributes.meta_title ||
          festival.attributes.title ||
          festival.attributes.slug,
        metaDescription:
          festival.attributes.meta_description ||
          festival.attributes.description ||
          festival.attributes.excerpt,
        shareImage:
          festival.attributes?.seo?.shareImage ||
          festival.attributes?.cover_image ||
          festival.attributes?.biennial_cover_image,
      }
      : undefined)

  return (
    <>
      <Seo seo={resolvedSeo} />
      <div className="global-frontpage-visuals" aria-hidden="true">
        <img
          className="global-frontpage-visuals__image global-frontpage-visuals__image--desktop"
          data-intro-step="1"
          src="/biennial/biennial-2026/assets/frontpage/250904-SonicActs-2026-WebSketch3.svg"
          alt=""
        />
      </div>

      <div id="sonic-acts">
        <a href="/biennial/biennial-2026">
          <div id="sonic" className="intro-fade-target" data-intro-step="2">
            <svg
              id="Ebene_1"
              xmlns="http://www.w3.org/2000/svg"
              baseProfile="tiny"
              version="1.2"
              viewBox="0 0 1316.7 1163.2"
            >
              <path
                d="M998.3,511.5c-35.5,17.3-71.4,20.8-107.6,10.3-36.2-10.5-70-31.4-101.4-62.7-31.4-31.3-57.8-69-79.3-113.1-19.2-39.3-29.4-76.1-30.6-110.5-1.2-34.3,5.6-64,20.3-89.1s35.9-44.3,63.3-57.7c36-17.6,72.6-20.9,109.9-10.1,37.3,10.9,71.5,32.1,102.8,63.8s57.3,68.8,78.1,111.5c18,37,27.9,72.5,29.5,106.6,1.7,34.1-4.9,64.3-19.6,90.5-14.7,26.3-36.5,46.4-65.4,60.5M992.9,556.4c49.7-24.3,89.6-57.3,119.6-99.3,30-41.9,47.5-87.5,52.4-136.9,5-49.3-3.9-97.2-26.5-143.7-23.3-47.8-55.5-85.5-96.5-113.1-41-27.5-86.2-42.7-135.7-45.5s-98.4,7.5-146.7,31.1c-43.6,21.3-80.1,51.4-109.5,90.3-29.4,39-46.7,83.9-52.1,134.9-5.3,51,5.4,104,32.2,158.9,22.7,46.4,54.1,82.7,94.4,108.8,40.3,26.1,84.2,40.3,131.7,42.7,47.6,2.5,93.1-6.9,136.7-28.2"
                fill="#babadf"
              ></path>
              <path
                d="M1044.1,1136.7c38.5,0,74.3-7.3,107.5-21.7,33.2-14.5,61.7-34.1,85.4-58.9,23.7-24.8,41.1-52.4,52.2-83l-28.5-8.7c-20.6,25.8-45.3,45.9-74.3,60.1s-61.7,21.3-98,21.3-80.4-10-114.7-30-61-46.8-80.3-80.3c-19.2-33.5-28.9-70-28.9-109.5s8.2-75.8,24.5-105.6c16.3-29.8,38.7-52.6,67.2-68.4s60.4-23.7,95.7-23.7,76.2,10.2,105.2,30.4c29,20.3,51.7,45.3,68,75.1,16.3,29.8,27.7,60,34,90.5h30l7.9-156.6c-9.5-10.5-25.8-22.8-49-36.8s-50.7-26.1-82.6-36.4-64.7-15.4-98.4-15.4c-61.7,0-115,13.6-160.1,40.7-45.1,27.2-79.2,62.3-102.4,105.6-23.2,43.2-34.8,88.3-34.8,135.2s10.3,89.2,30.8,131.7c20.6,42.4,51.5,77.1,92.9,104,41.4,27,91.6,40.4,150.7,40.4M580.7,1095.6v32.4h262.5v-32.4c-31.6,0-53.6-6.6-66-19.8-12.4-13.2-18.6-33.2-18.6-60.1v-313.1c0-29.5,6.7-50.5,20.2-62.9,13.4-12.4,34.9-18.6,64.4-18.6v-32.4h-262.5v32.4c32.7,0,55.2,6.5,67.6,19.4,12.4,12.9,18.6,34.7,18.6,65.2v298.9c0,22.7-2.1,40.3-6.3,53s-12.5,22.1-24.9,28.5c-12.4,6.3-30.7,9.5-55,9.5"
                fill="#babadf"
              ></path>
              <path
                d="M402,586.4c35.3,0,68.7-7,100-21,31.4-14,56.4-33.1,75.1-57.3,18.7-24.2,28.1-51.1,28.1-80.7s-7-49-21-68-32.4-35.1-55.3-48.2c-22.9-13.2-52.3-26.6-88.2-40.3-38.5-14.8-67.5-26.6-87-35.6s-35.7-20.2-48.6-33.6c-12.9-13.4-19.4-29.7-19.4-48.6s10.1-43.7,30.4-58.5,48.1-22.1,83.4-22.1,52.2,7,75.9,21c23.7,14,43.1,33.6,58.1,58.9,15,25.3,23.3,53.8,24.9,85.4h29.3l6.3-129.7c-7.9-7.9-21.3-18-40.3-30.4s-42.8-23.7-71.6-34c-28.7-10.3-59.7-15.4-92.9-15.4s-72.7,7-102.8,21c-30,14-53.5,32.7-70.4,56.1-16.9,23.5-25.3,48.9-25.3,76.3s8.6,56.9,25.7,77.5c17.1,20.6,37.7,36.9,61.7,49,24,12.1,60,27.9,107.9,47.4,33.2,13.7,57.5,24.4,72.7,32,15.3,7.6,28.5,17.7,39.5,30,11.1,12.4,16.6,27.8,16.6,46.3s-10.3,43.4-30.8,58.9c-20.6,15.6-47.4,23.3-80.7,23.3-52.2,0-92.3-17.1-120.2-51.4-27.9-34.3-46.9-78.3-56.9-132h-39.2v139.2c7.4,6.9,21.9,17,43.5,30.4s47.7,25.8,78.3,37.2c30.5,11.2,61.6,16.9,93.2,16.9"
                fill="#babadf"
              ></path>
              <path
                d="M498.9,1132.3h63.3c-.5-16.3-3.2-34.3-7.9-53.8-3.2-15.8-5.7-30.2-7.5-43.1-1.9-12.9-2.8-29.9-2.8-51v-242c0-37.4,7-66.9,21-88.6,14-21.6,35.2-32.4,63.7-32.4v-32.4h-215.3v32.4c36.4,0,61.2,10.9,74.4,32.8,13.2,21.9,19.8,51.3,19.8,88.2v197.8c0,20.6,1.6,37.2,4.7,49.8l-342.1-400.9H17.6v32.4c17.4,2.1,31.3,5.4,41.5,9.9,10.3,4.5,21.5,12.8,33.6,24.9l32.4,32.4v321c0,32.2-7.1,54.6-21.4,67.2-14.2,12.7-39,19-74.4,19v32.4h228.7v-32.4c-32.7,0-57-8-72.8-24.1s-23.7-41.8-23.7-77.1v-265.7l274.8,328.9c22.2,21.7,43.1,46.5,62.6,74.4"
                fill="#babadf"
              ></path>
            </svg>
          </div>
          <div id="acts" className="intro-fade-target" data-intro-step="3">
            <svg
              id="Ebene_1"
              xmlns="http://www.w3.org/2000/svg"
              baseProfile="tiny"
              version="1.2"
              viewBox="0 0 1068 1163.2"
            >
              <path
                d="M793.4,1137.5c35.3,0,68.7-7,100-21,31.4-14,56.4-33.1,75.1-57.3,18.7-24.2,28.1-51.1,28.1-80.7s-7-49-21-68-32.4-35.1-55.4-48.2c-22.9-13.2-52.3-26.6-88.2-40.3-38.5-14.8-67.5-26.6-87-35.6s-35.7-20.2-48.6-33.6c-12.9-13.4-19.4-29.7-19.4-48.6s10.1-43.7,30.4-58.5c20.3-14.8,48.1-22.1,83.4-22.1s52.2,7,75.9,21,43.1,33.6,58.1,58.9,23.3,53.8,24.9,85.4h29.3l6.3-129.7c-7.9-7.9-21.4-18-40.3-30.4-19-12.4-42.8-23.7-71.6-34-28.7-10.3-59.7-15.4-92.9-15.4s-72.7,7-102.8,21c-30,14-53.5,32.7-70.4,56.1-16.9,23.5-25.3,48.9-25.3,76.3s8.6,56.9,25.7,77.5c17.1,20.6,37.7,36.9,61.7,49s60,27.9,107.9,47.4c33.2,13.7,57.4,24.4,72.7,32s28.5,17.7,39.5,30c11.1,12.4,16.6,27.8,16.6,46.3s-10.3,43.4-30.8,58.9c-20.6,15.6-47.4,23.3-80.7,23.3-52.2,0-92.3-17.1-120.2-51.4s-46.9-78.3-56.9-132h-39.5v139.2c7.4,6.9,21.9,17,43.5,30.4s47.7,25.8,78.3,37.2c30.8,11.2,62,16.9,93.6,16.9M162.4,1095.6v32.4h262.5v-32.4c-31.6,0-53.8-6.2-66.4-18.6-12.7-12.4-19-31.8-19-58.1v-393h72.7c35.3,0,62.7,8.4,82.2,25.3s34.5,47.2,45.1,90.9h30v-153.4H17.6v153.5h30c10.5-43.7,25.6-74.1,45.1-90.9,19.5-16.9,46.9-25.3,82.2-25.3h72.7v387.4c0,29.5-6.2,50.6-18.6,63.3-12.2,12.6-34.5,18.9-66.6,18.9"
                fill="#ed92d8"
              ></path>
              <path
                d="M376.7,341.3h-174l87.8-188.2,86.2,188.2ZM16.9,544.5v32.4h193.7v-32.4c-21.6-1-38.2-6.6-49.8-16.6s-17.4-23.2-17.4-39.5,3.4-27.7,10.3-41.9l29.3-62.5h213.5l35.6,79.1c5.8,13.2,8.7,24.5,8.7,34,0,26.9-22.4,42.7-67.2,47.4v32.4h240.4v-32.4c-14.2,0-25.7-4.1-34.4-12.3-8.7-8.2-17.8-22-27.3-41.5L372,100.9l-19.8-63.3h-162.1v32.4h15.8c19,0,33.9,3.6,44.7,10.7,10.8,7.1,16.2,16.2,16.2,27.3s-.9,9-2.8,12.7c-1.9,3.7-4.1,6.6-6.7,8.7L102.3,458.3c-13.7,28.5-26.4,48.6-38,60.5-11.5,11.9-27.4,20.4-47.4,25.7"
                fill="#ed92d8"
              ></path>
              <path
                d="M897.5,545.1c34.6-16.9,63.6-39.1,87.1-66.7s40.5-57.7,50.9-90.4c10.5-32.7,14-65.2,10.5-97.5l-29.4,4.7c-7.2,32.2-20.6,61.1-40.5,86.6-19.8,25.5-46.1,46.2-78.8,62.2-37.9,18.5-76.6,26.2-116.2,23.3-39.6-3-75.3-15.3-107.3-37-32-21.6-56.6-50.2-73.9-85.8-17.8-36.5-25.9-71.7-24.2-105.6,1.6-33.9,11.8-64.2,30.4-90.9,18.7-26.7,43.8-47.8,75.6-63.3,37-18,72.9-24.3,107.9-18.7,34.9,5.5,66.3,18.1,94,37.7,27.7,19.6,51.2,41.8,70.2,66.5l27-13.2-61.5-144.2c-13.1-5.3-33.2-9.2-60.2-11.6-27-2.4-57-1.2-90.2,3.5s-64.9,14.5-95.2,29.3c-55.4,27-97.5,62.6-126.1,106.8s-43.9,90.8-45.8,139.8c-1.9,49,7.4,94.6,28,136.8,19.9,40.8,48.4,75.7,85.4,104.8,37.1,29.1,80.1,46.7,129.1,52.7,49.1,6,100.1-3.9,153.2-29.8"
                fill="#ed92d8"
              ></path>
            </svg>
          </div>
        </a>
      </div>

      <div
        id="social-homelink"
        className="intro-fade-target"
        data-intro-step="5"
      >
        <div className="social-channel">
          <a
            id="sa-logo"
            href="https://sonicacts.com/"
            aria-label="Sonic Acts homepage"
            className="social-item social-item--logo"
          >
            <svg version="1.1" x="0px" y="0px" viewBox="0 0 200 200">
              <g id="sa-logo-svg">
                <path
                  d="M100,0C44.77,0,0,44.77,0,100c0,55.23,44.77,100,100,100c55.23,0,100-44.77,100-100C200,44.77,155.23,0,100,0z
          M79.79,111.94c-3.45,0.87-6.96,1.31-10.52,1.31c-9,0-16.23-2.2-21.67-6.6c-5.58-4.61-8.97-11.2-10.15-19.79
          c-0.35-2.65-0.52-5.02-0.52-7.12h2.09c0,0.91,0.14,3.18,0.42,6.8c1.19,8.17,4.36,14.31,9.53,18.42c5.09,4.12,11.86,6.18,20.31,6.18
          c3.42,0,6.77-0.42,10.05-1.26c3.28-0.84,6.18-1.99,8.69-3.45c6.98-4.26,10.47-10.29,10.47-18.11c0-3.91-0.99-7.38-2.95-10.41h-2.18
          c2.23,2.95,3.35,6.42,3.35,10.41c0,3.49-0.82,6.63-2.46,9.42c-1.64,2.79-4.03,5.17-7.17,7.12c-2.37,1.4-5.11,2.48-8.22,3.25
          c-3.11,0.77-6.3,1.15-9.58,1.15c-4.12,0-7.68-0.49-10.68-1.47c-3-0.91-5.83-2.37-8.48-4.4c-2.44-1.95-4.43-4.4-5.97-7.33
          c-1.54-3.07-2.51-6.39-2.93-9.94c-0.21-1.6-0.31-3.73-0.31-6.39h2.09c0,2.65,0.1,4.68,0.31,6.07c0.84,6.98,3.56,12.28,8.17,15.91
          c2.16,1.75,4.75,3.11,7.75,4.08c2.93,0.91,6.28,1.36,10.05,1.36c3.14,0,6.16-0.37,9.06-1.1c2.9-0.73,5.46-1.76,7.69-3.09
          c2.79-1.67,4.92-3.75,6.39-6.23c1.47-2.48,2.2-5.29,2.2-8.43c0-3.28-0.84-6.11-2.51-8.48c-0.48-0.67-1-1.31-1.57-1.93h-2.63
          c3.15,2.74,4.72,6.21,4.72,10.41c0,2.79-0.65,5.29-1.94,7.48c-1.29,2.2-3.19,4.03-5.71,5.5c-2.02,1.26-4.41,2.23-7.17,2.93
          c-2.76,0.7-5.6,1.05-8.53,1.05c-6.98,0-12.53-1.64-16.64-4.92c-4.26-3.49-6.74-8.51-7.43-15.07c-0.14-0.98-0.21-2.83-0.21-5.55
          h2.09c0,2.03,0.07,3.8,0.21,5.34c0.63,6,2.86,10.54,6.7,13.61c3.77,3,8.86,4.5,15.28,4.5c2.72,0,5.36-0.31,7.9-0.94
          c2.55-0.63,4.8-1.53,6.75-2.72c4.4-2.65,6.6-6.39,6.6-11.2c0-4.19-1.88-7.54-5.65-10.05c-0.19-0.12-0.38-0.24-0.57-0.36H80.3
          c1.28,0.54,2.38,1.11,3.3,1.72c3.42,2.16,5.13,5.06,5.13,8.69c0,2.09-0.49,3.94-1.47,5.55c-0.91,1.54-2.34,2.9-4.29,4.08
          c-1.75,1.12-3.82,1.95-6.23,2.51c-2.41,0.56-4.9,0.84-7.48,0.84c-12.42,0-19.16-5.58-20.2-16.75c-0.07-0.56-0.1-2.16-0.1-4.82h2.09
          c0,2.58,0.03,4.12,0.1,4.61c0.42,5.1,2.16,8.86,5.23,11.31c3,2.37,7.29,3.56,12.88,3.56c5.16,0,9.39-1.01,12.67-3.04
          c3.14-1.88,4.71-4.5,4.71-7.85c0-2.86-1.36-5.16-4.08-6.91c-2.1-1.3-5.09-2.47-8.99-3.5h6.38c-2.35-0.97-5.29-1.83-8.8-2.57
          l-8.9-2.09c-5.93-1.47-10.64-3.66-14.13-6.59c-4.68-3.84-7.01-8.79-7.01-14.87c0-3.42,0.8-6.49,2.41-9.21
          c1.6-2.72,3.94-4.95,7.01-6.7c2.3-1.32,4.95-2.36,7.96-3.09c3-0.73,6.14-1.1,9.42-1.1c7.54,0,13.78,1.75,18.74,5.23
          c3.07,2.16,5.51,4.66,7.33,7.48c1.81,2.83,2.93,5.91,3.35,9.26c0.28,2.37,0.42,4.54,0.42,6.49h-2.09c0-1.88-0.14-3.94-0.42-6.18
          c-0.42-3.49-1.55-6.49-3.4-9c-1.85-2.51-3.96-4.61-6.33-6.28c-4.68-3.28-10.54-4.92-17.59-4.92c-3.07,0-6.04,0.35-8.9,1.05
          c-2.86,0.7-5.34,1.64-7.43,2.83c-5.58,3.35-8.37,8.06-8.37,14.13c0,5.37,2.09,9.81,6.28,13.29c3.21,2.79,7.64,4.82,13.29,6.07
          l8.9,2.09c5.75,1.32,10.05,2.87,12.91,4.67h3.14c-0.5-0.42-1.03-0.83-1.6-1.21c-3.42-2.23-8.1-3.98-14.03-5.23l-8.9-2.09
          c-5.23-1.26-9.42-3.17-12.56-5.76c-3.7-3.14-5.55-7.08-5.55-11.83c0-2.65,0.66-5.06,1.99-7.22c1.32-2.16,3.14-3.91,5.44-5.23
          c4.12-2.37,9.25-3.56,15.39-3.56c6.77,0,12.28,1.5,16.54,4.5c2.23,1.54,4.2,3.49,5.91,5.86c1.71,2.37,2.74,5.2,3.09,8.48
          c0.21,2.72,0.31,4.57,0.31,5.55h-2.09c0-0.63-0.1-2.41-0.31-5.34c-0.56-5.23-3.28-9.53-8.17-12.88c-3.84-2.72-8.93-4.08-15.28-4.08
          c-5.79,0-10.57,1.08-14.34,3.25c-4.26,2.58-6.39,6.14-6.39,10.68c0,4.05,1.6,7.47,4.82,10.26c2.72,2.3,6.6,4.05,11.62,5.23
          l8.9,2.09c3,0.7,5.71,1.47,8.11,2.3c2.41,0.84,4.62,1.92,6.65,3.25c1.35,0.91,2.52,1.91,3.5,2.99h2.37
          c-1.5-1.94-3.49-3.67-5.97-5.19c-3.56-2.16-8.31-3.87-14.24-5.13l-8.9-2.09c-4.68-1.19-8.27-2.83-10.78-4.92
          c-2.79-2.3-4.19-5.23-4.19-8.79c0-3.84,1.81-6.84,5.44-9c3.42-2.02,7.89-3.04,13.4-3.04c5.86,0,10.61,1.26,14.24,3.77
          c4.4,3.07,6.87,7.05,7.43,11.93c0.07,0.84,0.1,2.41,0.1,4.71h-2.09c0-2.23-0.04-3.77-0.1-4.61c-0.42-4.12-2.58-7.57-6.49-10.36
          c-3.42-2.23-7.78-3.35-13.09-3.35c-5.17,0-9.28,0.91-12.35,2.72c-2.93,1.75-4.4,4.15-4.4,7.22c0,2.79,1.15,5.2,3.45,7.22
          c2.16,1.88,5.48,3.35,9.94,4.4l8.9,2.09c5.79,1.19,10.71,3,14.76,5.44c3.26,1.99,5.76,4.31,7.49,6.97h2.44
          c1.61,2.91,2.42,6.38,2.42,10.41c0,4.26-0.98,8.08-2.93,11.46c-1.95,3.39-4.82,6.19-8.58,8.43
          C86.33,109.83,83.24,111.07,79.79,111.94z M148.38,159.74l-8.37-21.46h-30.15l-8.37,21.46h-2.2l9.11-23.55h33.08l9.21,23.55H148.38
          z M152.57,159.74l-9.84-25.33h-35.7l-9.84,25.33h-2.3l14.65-37.58h-1.93L93,159.74h-2.3l14.61-37.58h1.98l14.6-37.58h5.55
          l14.76,37.58h-2.09l14.75,37.58H152.57z M156.96,159.74l-14.71-37.58h1.98L128.7,82.48h-7.96l-15.43,39.68h-2.24l16.2-41.77h10.89
          l16.31,41.77h-2.03l14.72,37.58H156.96z"
                ></path>
                <polygon
                  points="139.96,122.16 126.08,86.67 123.36,86.67 109.58,122.16 111.65,122.16 124.72,88.55 137.87,122.16 135.92,122.16 
          139.17,130.43 110.69,130.43 113.89,122.16 115.86,122.16 124.72,99.34 133.67,122.16 131.45,122.16 124.72,105.09 118.08,122.16 
          116.12,122.16 113.73,128.33 136.13,128.33 133.7,122.16 135.65,122.16 124.72,94.31 113.87,122.16 111.82,122.16 107.87,132.31 
          141.89,132.31 137.91,122.16"
                ></polygon>
              </g>
            </svg>
          </a>

          <a
            href="https://www.instagram.com/sonicacts"
            target="_blank"
            className="social-item"
            rel="noreferrer"
          >
            <svg id="Layer_2" viewBox="0 0 48.39 48.39">
              <g id="design">
                <g>
                  <path d="M29.86,12.65h-11.33c-3.23,0-5.85,2.62-5.85,5.85v11.33c0,3.23,2.62,5.85,5.85,5.85h11.33c3.23,0,5.85-2.63,5.85-5.85v-11.33c0-3.23-2.63-5.85-5.85-5.85Zm-5.55,18.5c-3.85,0-6.99-3.13-6.99-6.99s3.13-6.99,6.99-6.99,6.99,3.13,6.99,6.99-3.13,6.99-6.99,6.99Zm7.39-12.78c-.92,0-1.66-.74-1.66-1.66s.74-1.66,1.66-1.66,1.66,.74,1.66,1.66-.74,1.66-1.66,1.66Z"></path>
                  <path d="M24.31,19.69c-2.47,0-4.48,2.01-4.48,4.47s2.01,4.48,4.48,4.48,4.47-2.01,4.47-4.48-2.01-4.47-4.47-4.47Z"></path>
                  <path d="M24.19,0C10.83,0,0,10.83,0,24.19s10.83,24.19,24.19,24.19,24.19-10.83,24.19-24.19S37.56,0,24.19,0Zm14.18,29.82c0,4.7-3.82,8.52-8.52,8.52h-11.33c-4.7,0-8.52-3.82-8.52-8.52v-11.33c0-4.7,3.82-8.52,8.52-8.52h11.33c4.7,0,8.52,3.82,8.52,8.52v11.33Z"></path>
                </g>
              </g>
            </svg>
          </a>

          <a
            href="https://substack.com/@sonicacts"
            target="_blank"
            className="social-item substack"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 448 511.471"
            >
              <path
                fill="#FF681A"
                d="M0 0h448v62.804H0V0zm0 229.083h448v282.388L223.954 385.808 0 511.471V229.083zm0-114.542h448v62.804H0v-62.804z"
              />
            </svg>
          </a>

          <a
            href="https://tmsqr.link/sonic-acts"
            target="_blank"
            className="social-item tmsqr"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 235.9 271"
            >
              <path
                d="M118.5,271l116.48-67.27.92-1.08-.15-134.66L118.5,0"
                fill="#fff"
              />
              <path d="M118.5 0l117.25 68 .15 134.66-.92 1.08-116.48 67.27h-1L0 203.5v-136L117.5 0h1zm51 72h-103v25h37v105h29V97h37V72z" />
              <path
                className="t-fill"
                d="M169.5 72v25h-37v105h-29V97h-37V72h103z"
                fill="#fff"
              />
            </svg>
          </a>
        </div>

        <div id="social-homelink-inner">
          <a
            className="radio"
            href="https://radio.sonicacts.com/"
            target="_blank"
          >
            Radio
          </a>

          <a
            className="newsletter"
            target="_blank"
            href="https://stats.sender.net/forms/ejRvGl/view"
          >
            Newsletter
          </a>

          <a
            className="magazine"
            href="https://shop.sonicacts.com/product/ecoes-6/"
            target="_blank"
          >
            Magazine
          </a>
        </div>
      </div>

      {pathname === "/" && (
        <section
          className="visually-hidden frontpage-hidden-intro"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: frontpageHiddenIntro }}
        />
      )}

      <section
        className={`main-container ${festival?.attributes?.radio ? "topbanner" : ""}`}
      >
        <>
          <Nav festival={festival} />
          {loading ? (
            <div className="loader"></div>
          ) : (
            <>
              <div className={`loader ${loading}`}></div>
              {children}
            </>
          )}
        </>
      </section>
      <footer className="footer">
        {festival && festival.attributes.prefooter ? (
          <div className="prefooter">
            <div className="text-block medium">
              <p className="visually-hidden">
                {festival.attributes.prefooter.title}
              </p>
              <div className="logos">
                {festival.attributes.prefooter.logos.data.map((logo, i) => {
                  let logoId = "logo-id-" + logo.id
                  return (
                    <div className="logo" id={logoId} key={logoId || i}>
                      <Image image={logo.attributes} priority />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="text-block small">
              <ReactMarkdown children={festival.attributes.prefooter.text} />
            </div>
          </div>
        ) : (
          <div className="prefooter prefooter-portal">
            <div className="text-block medium">
              <p className="visually-hidden">
                {festival?.attributes.prefooter?.title}
              </p>
              <div className="logos">
                {festival?.attributes.prefooter?.logos.data.map((logo, i) => {
                  const logoKey = logo?.id
                    ? `prefooter-logo-${logo.id}`
                    : `prefooter-logo-${i}`
                  return (
                    <div className="logo" key={logoKey}>
                      <Image image={logo.attributes} priority />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div id="colophon-menu">
          <div id="colophon-link" className="colophon-item">
            <a href="/about#information-card-97">Colophon</a>
          </div>
          <div className="colophon-item">
            <a href="https://sonicacts.com/policy" target="_blank">
              Privacy Policy
            </a>
          </div>
          <div className="colophon-item">
            <a href="https://sonicacts.com/cookies" target="_blank">
              Cookies
            </a>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={show}
        onHide={handleClose}
        className={`mail-modal`}
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
      </Modal>
    </>
  )
}

export default Layout
