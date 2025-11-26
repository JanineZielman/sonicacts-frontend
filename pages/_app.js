import App from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { createContext } from "react"
import React, { useEffect, useState } from "react"

import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"

export const GlobalContext = createContext({})

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  const { global } = pageProps

  const [loading, setLoading] = useState(true)

  // detect biennial route
  const isBiennial2026 = router.pathname.startsWith("/biennial/biennial-2026")

  // Dynamically load CSS based on route
  if (typeof window !== "undefined") {
    const old = document.querySelectorAll("style[data-dynamic], link[data-dynamic]")
    old.forEach((el) => el.remove())
  }

  if (!isBiennial2026) {
    // PORTAL STYLES
    require("../assets/css/style.scss")
    require("../assets/css/article.scss")
    require("../assets/css/filter.scss")
    require("../assets/css/agenda.scss")
    require("../assets/css/search.scss")
    require("../assets/css/slider.scss")
    require("../assets/css/festival.scss")
    require("../assets/css/animation.scss")
    require("../assets/css/timetable.scss")
    require("../assets/css/error.scss")
    require("../assets/css/breakpoints.scss")
    require("../assets/css/festival-breakpoints.scss")
  }

  if (isBiennial2026) {
    // BIENNIAL STYLES
    require("./biennial/biennial-2026/assets/css/style.scss")
    require("./biennial/biennial-2026/assets/css/breakpoints.scss")
    require("./biennial/biennial-2026/assets/css/error.scss")
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 100)
  }, [])

  return (
    <>
      <Head>
        {/* Global favicon */}
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global?.attributes?.favicon?.data?.attributes)}
        />

        {/* Slick ONLY for portal */}
        {!isBiennial2026 && (
          <>
            <link
              data-dynamic
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
              data-dynamic
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
          </>
        )}
      </Head>

      <GlobalContext.Provider value={global?.attributes || {}}>
        {/* Optional loader re-enabled if you want */}
        {/* {loading ? <div className="loader"/> : <Component {...pageProps} />} */}
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  )
}

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx)

  const globalRes = await fetchAPI("/global", { populate: "*" })

  return { ...appProps, pageProps: { global: globalRes.data } }
}

export default MyApp
