import App from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

import { fetchAPI } from "../lib/api";
import { getStrapiMedia } from "../lib/media";

// Global context
export const GlobalContext = createContext({});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const { global } = pageProps;
  const [loading, setLoading] = useState(true);

  // Detect Biennial route
  const isBiennial2026 = router.pathname.startsWith("/biennial/biennial-2026");

  // Dynamically remove previously loaded dynamic CSS on route change
  useEffect(() => {
    const oldStyles = document.querySelectorAll("link[data-dynamic]");
    oldStyles.forEach((el) => el.remove());
  }, [router.pathname]);

  // Set loading state (optional)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isBiennial2026) {
    // PORTAL STYLES
    import("../assets/css/style.scss");
    import("../assets/css/article.scss");
    import("../assets/css/filter.scss");
    import("../assets/css/agenda.scss");
    import("../assets/css/search.scss");
    import("../assets/css/slider.scss");
    import("../assets/css/festival.scss");
    import("../assets/css/animation.scss");
    import("../assets/css/timetable.scss");
    import("../assets/css/error.scss");
    import("../assets/css/breakpoints.scss");
    import("../assets/css/festival-breakpoints.scss");
  }

  return (
    <> <Head>
      {/* Global favicon */} <link
        rel="shortcut icon"
        href={getStrapiMedia(global?.attributes?.favicon?.data?.attributes)}
      />

      {/* Portal Slick Carousel CSS */}
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

      {/* Biennial CSS loaded dynamically */}
      {isBiennial2026 && (
        <link
          rel="stylesheet"
          href="/biennial.css"
          data-dynamic
        />
      )}
    </Head>

      <GlobalContext.Provider value={global?.attributes || {}}>
        {/* Optional loader */}
        {/* {loading ? <div className="loader" /> : <Component {...pageProps} />} */}
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>

  );
};

// Fetch global settings
MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  const globalRes = await fetchAPI("/global", { populate: "*" });

  return {
    ...appProps,
    pageProps: { ...appProps.pageProps, global: globalRes.data },
  };
};

export default MyApp;
