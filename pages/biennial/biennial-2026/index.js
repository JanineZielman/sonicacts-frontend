import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import FrontpageLanding from "/components/biennial/frontpage/FrontpageLanding"
import NewsSection from "/components/biennial/frontpage/NewsSection"
import Head from "next/head"
import ReactMarkdown from "react-markdown"

const Festival = ({ global, festival, initialSlug = null }) => {
  const seoText = (
    <section className="seo-summary" aria-hidden="true">
      <h1>Sonic Acts Biennial 2026 — Melted for Love</h1>
      <p>
        Contemporary sound experiments, performance, moving image, and
        multidisciplinary art. 5 Feb – 29 Mar 2026, Amsterdam (NL).
      </p>
    </section>
  );

  const pageSeo = {
    metaTitle: "Sonic Acts Biennial 2026",
    metaDescription:
      "Contemporary sound experiments, performance, moving image, and multidisciplinary art. 5 Feb – 29 Mar 2026, Amsterdam (NL).",
    shareImage: {
      url: "/biennial/biennial-2026/assets/og-image/250923-SAB-2026-19by9-1.jpg",
    },
  }

  const aboutText = festival?.attributes?.information_intro

  return (
    <section className="festival-home">

      {/* SSR-visible text (for SEO) */}
      {seoText}

      <Head>
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta
          property="og:image:alt"
          content="Sonic Acts Biennial 2026 Melted for Love"
        />
      </Head>
      <Layout global={global} festival={festival} seo={pageSeo}>
        {aboutText && (
          <section className="visually-hidden frontpage-about" aria-hidden="true">
            <ReactMarkdown children={aboutText} />
          </section>
        )}
        <FrontpageLanding />
        <NewsSection initialSlug={initialSlug} />
      </Layout>
    </section>
  )
}

export async function getServerSideProps() {
  const biennial = { slug: BIENNIAL_SLUG }

  const [festivalRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${biennial.slug}&populate[prefooter][populate]=*&populate[information_intro]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  return {
    props: {
      festival: festivalRes.data[0],
      global: globalRes.data,
    },
  }
}

export default Festival
