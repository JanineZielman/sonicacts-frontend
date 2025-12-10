import App from "next/app";
import Head from "next/head";
// import "../assets/css/style.scss";
// import "../assets/css/article.scss";
// import "../assets/css/filter.scss";
// import "../assets/css/agenda.scss";
// import "../assets/css/search.scss";
// import "../assets/css/slider.scss";
// import "../assets/css/festival.scss";
// import "../assets/css/animation.scss";
// import "../assets/css/timetable.scss";
// import "../assets/css/error.scss";
// import "../assets/css/breakpoints.scss";
// import "../assets/css/festival-breakpoints.scss";
import "../assets/css/fonts.scss";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchAPI } from "../lib/api";
import { getStrapiMedia } from "../lib/media";

// Store Strapi Global object in context
export const GlobalContext = createContext({});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const { global } = pageProps;
  const [loading, setLoading] = useState(true);

  const isBiennial2026 = router.pathname.startsWith("/biennial/biennial-2026");

  // Keep preview mode active across internal navigation when ?preview=true is present.
  useEffect(() => {
    if (!router.query?.preview) return;

    const addPreviewParam = (anchor) => {
      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      const url = new URL(rawHref, window.location.origin);

      if (url.origin !== window.location.origin || url.searchParams.has("preview")) return;

      url.searchParams.set("preview", router.query.preview);
      anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    };

    const updateAllAnchors = () => {
      document.querySelectorAll("a[href]").forEach(addPreviewParam);
    };

    updateAllAnchors();
    const clickHandler = (event) => {
      const anchor = event.target.closest("a[href]");
      if (anchor) addPreviewParam(anchor);
    };
    document.addEventListener("click", clickHandler, true);

    return () => {
      document.removeEventListener("click", clickHandler, true);
    };
  }, [router.asPath, router.query?.preview]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 100);

    if (isBiennial2026) {
      // Inject Biennial CSS
      const biennialLink = document.createElement("link");
      biennialLink.rel = "stylesheet";
      biennialLink.href = "/biennial.css";
      biennialLink.dataset.dynamic = "true";
      document.head.appendChild(biennialLink);
    }
  }, [router.pathname]);

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(global?.attributes?.favicon?.data?.attributes)}
        />
        {!isBiennial2026 ?
          <>
            <link
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="/portal.css"
            />
          </>
          :
          <>
            <link
              rel="canonical"
              href={`https://sonicacts.com${router.asPath}`}
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="/biennial.css"
            />
          </>
        }
      </Head>

      <GlobalContext.Provider value={global?.attributes || {}}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  );
};

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  const globalRes = await fetchAPI("/global", { populate: "*" });

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, global: globalRes.data },
  };
};

export default MyApp;
