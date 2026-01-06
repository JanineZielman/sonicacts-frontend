import Document, { Html, Head, Main, NextScript } from "next/document"
import slugify from "slugify"

export default class MyDocument extends Document {
  render() {
    const nextData = this.props.__NEXT_DATA__ || {}
    const { page: pathName = "/", query = {}, props: rawProps = {} } = nextData
    const pageProps = rawProps?.pageProps || {}

    const isBiennial2026 = pathName.startsWith("/biennial/biennial-2026")

    // --- BIENNIAL BODY CLASS LOGIC ---
    let biennialBodyClass = ""
    if (isBiennial2026) {
      const dynamicSlug = typeof query.slug === "string" ? query.slug : null

      const segmentClasses = pathName
        .split("/")
        .filter(Boolean)
        .map((segment) => `slug-${slugify(segment)}`)

      if (dynamicSlug) {
        segmentClasses.push(`slug-${slugify(dynamicSlug)}`)
      }

      const bodyClasses = new Set(
        segmentClasses.length ? segmentClasses : ["slug-home"]
      )

      // Add "slug-home" only for /biennial/biennial-2026
      if (pathName === "/biennial/biennial-2026") {
        bodyClasses.add("slug-home")
      }

      if (pathName.startsWith("/biennial/biennial-2026/news")) {
        bodyClasses.add("slug-news")
      }
      if (pathName.startsWith("/biennial/biennial-2026/about")) {
        bodyClasses.add("slug-about")
      }
      if (pathName.startsWith("/biennial/biennial-2026/tickets")) {
        bodyClasses.add("slug-tickets")
      }
      if (pathName.startsWith("/biennial/biennial-2026/programme")) {
        bodyClasses.add("slug-programme")
      }
      if (pathName === "/biennial/biennial-2026/programme") {
        bodyClasses.add("programme-overview")
      }
      if (pathName === "/biennial/biennial-2026/artists") {
        bodyClasses.add("artists-overview")
      }
      if (pathName.startsWith("/biennial/biennial-2026/artists/")) {
        bodyClasses.add("slug-artist")
      }
      if (pathName.startsWith("/biennial/biennial-2026/artists")) {
        bodyClasses.add("slug-artists")
      }


      [
        pageProps?.page?.attributes?.slug,
        pageProps?.festival?.attributes?.slug,
        pageProps?.relations?.attributes?.slug,
        pageProps?.programme?.attributes?.slug,
      ].forEach((candidate) => {
        if (typeof candidate === "string" && candidate.trim()) {
          bodyClasses.add(`slug-${slugify(candidate)}`)
        }
      })

      if (segmentClasses.includes("slug-news") || dynamicSlug) {
        bodyClasses.add("slug-single-news")
      }
      if (segmentClasses.includes("slug-programme")) {
        bodyClasses.add("slug-single-programme-event")
        if (segmentClasses.includes("slug-sub")) {
          bodyClasses.add("slug-single-event")
        }
      }

      biennialBodyClass = Array.from(bodyClasses).join(" ")
    }

    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            type="image/png"
            href="/biennial/biennial-2026/assets/favicon/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/biennial/biennial-2026/assets/favicon/favicon.svg"
          />
          <link rel="shortcut icon" href="/biennial/biennial-2026/assets/favicon/favicon.ico" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/biennial/biennial-2026/assets/favicon/apple-touch-icon.png"
          />
          {/* ---------------------------------------------------------------
             PORTAL HEAD (default)
             --------------------------------------------------------------- */}
          {!isBiennial2026 && (
            <>
          <link rel="canonical" href="https://sonicacts.com/" />

              <script
                async
                src="https://cdn.jsdelivr.net/npm/uikit@3.2.3/dist/js/uikit-icons.min.js"
              />

              <script
                async
                src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"
              />

              <script async src="//npmcdn.com/isotope-layout@3/dist/isotope.pkgd.js" />

              {/* GA Portal */}
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-230S6R5HLT"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-230S6R5HLT', { 'anonymize_ip': true });
                  `,
                }}
              />

              <script
                defer
                data-domain="sonicacts.com"
                src="https://plausible.io/js/script.js"
              ></script>
            </>
          )}

          {/* ---------------------------------------------------------------
             BIENNIAL 2026 HEAD
             --------------------------------------------------------------- */}
          {isBiennial2026 && (
            <>
              <meta name="theme-color" content="transparent" />

              <script defer src="/biennial/biennial-2026/assets/js/vanilla-tilt.js" />


              <link rel="manifest" href="/biennial/biennial-2026/assets/favicon/site.webmanifest" />

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

              {/* GA Biennial */}
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-ZMXZTX96T6"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-ZMXZTX96T6', { 'anonymize_ip': true });
                  `,
                }}
              />
            </>
          )}
        </Head>

        <body className={isBiennial2026 ? biennialBodyClass : ""}>
          {/* BIENNIAL HEADER ONLY ON BIENNIAL PAGES */}
          {isBiennial2026 && (
            <header
              id="main-header"
              className="intro-fade-target"
              data-intro-step="6"
            >
              <section className="minimal-nav">
                <div className="minimal-nav__overlay" />

                <ul className="group-1">
                  <li>
                    <a href="/biennial/biennial-2026/#news">News</a>
                  </li>
                  <li>
                    <a href="/biennial/biennial-2026/artists">Artists</a>
                  </li>
                  <li>
                    <a href="/biennial/biennial-2026/visit">Visit</a>
                  </li>
                </ul>

                <ul>
                  <li><a href="/biennial/biennial-2026/programme">Programme</a></li>
                  <li><a href="/biennial/biennial-2026/timetable">Timetable</a></li>
                </ul>

                <ul>
                  <li><a href="/biennial/biennial-2026/tickets">Tickets</a></li>
                  <li><a href="/biennial/biennial-2026/about">Information</a></li>
                </ul>
              </section>
            </header>
          )}

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
