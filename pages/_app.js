import App from "next/app"
import Head from "next/head"
import "../assets/css/style.scss"
import "../assets/css/article.scss"
import "../assets/css/filter.scss"
import "../assets/css/agenda.scss"
import "../assets/css/search.scss"
import "../assets/css/slider.scss"
import "../assets/css/breakpoints.scss"
import { createContext } from "react"
import { fetchAPI } from "../lib/api"
import { getStrapiMedia } from "../lib/media"
import React, {useEffect, useState} from "react"

// Store Strapi Global object in context
export const GlobalContext = createContext({})

const MyApp = ({ Component, pageProps }) => {
  const { global } = pageProps
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);
  
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global.attributes.favicon?.data?.attributes)}
        />
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <GlobalContext.Provider value={global.attributes}>
        {loading ?
          <div className="loader"></div>
          :
          <>
            <div className={`loader ${loading}`}></div>
            <Component {...pageProps} />
          </>
        }
        
      </GlobalContext.Provider>
    </>
  )
}


MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx)
  // // Fetch global site settings from Strapi
  const globalRes = await fetchAPI("/global", { populate: "*"})
  // Pass the data to our page via props
  return { ...appProps, pageProps: { global: globalRes.data } }
  // return { ...appProps }
}

export default MyApp
