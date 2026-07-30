import App from "next/app"
import Head from "next/head"
import { createContext } from "react"

import "../assets/css/style.scss"
import "../assets/css/article.scss"
import "../assets/css/filter.scss"
import "../assets/css/agenda.scss"
import "../assets/css/search.scss"
import "../assets/css/slider.scss"
import "../assets/css/festival.scss"
import "../assets/css/animation.scss"
import "../assets/css/timetable.scss"
import "../assets/css/error.scss"
import "../assets/css/breakpoints.scss"
import "../assets/css/festival-breakpoints.scss"

import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"

export const GlobalContext = createContext({})

const MyApp = ({ Component, pageProps }) => {
  const global = pageProps?.global ?? {
    attributes: {},
  }

  const globalAttributes = global?.attributes ?? {}
  const favicon = globalAttributes?.favicon?.data?.attributes
  const faviconUrl = favicon ? getStrapiMedia(favicon) : null

  return (
    <>
      <Head>
        {faviconUrl && (
          <link
            rel="shortcut icon"
            href={faviconUrl}
          />
        )}

        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>

      <GlobalContext.Provider value={globalAttributes}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  // Collect props from the current page.
  const appProps = await App.getInitialProps(appContext)

  try {
    const globalRes = await fetchAPI("/global", {
      populate: "*",
    })

    return {
      ...appProps,
      pageProps: {
        // Preserve props returned by getStaticProps/getServerSideProps.
        ...appProps.pageProps,

        // Prefer a global value fetched by the page itself.
        global:
          appProps.pageProps?.global ??
          globalRes?.data ?? {
            attributes: {},
          },
      },
    }
  } catch (error) {
    console.error("Could not load global Strapi data in _app.js:", error)

    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,

        // Preserve the page's global data or use a safe fallback.
        global:
          appProps.pageProps?.global ?? {
            attributes: {},
          },
      },
    }
  }
}

export default MyApp