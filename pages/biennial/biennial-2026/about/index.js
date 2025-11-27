import { BIENNIAL_SLUG } from "/lib/biennial/constants"
import Layout from "/components/biennial/layout"
import { fetchAPI } from "/lib/biennial/api"
import ReactMarkdown from "react-markdown"
import InformationSection from "/components/biennial/about/InformationSection"
import PictureWithWebp from "/components/biennial/PictureWithWebp"
import Head from "next/head"

const About = ({ global, page }) => {
  const attributes = page?.attributes ?? {}
  const { sidebar, information_intro, content } = attributes

  const metaDescription =
    content?.[0]?.text?.text_block ||
    "All practical information about Sonic Acts Biennial 2026."
  const pageSeo =
    attributes?.seo || {
      metaTitle: "Sonic Acts Biennial 2026 - About",
      metaDescription,
      shareImage: {
        url: "https://sonicacts.com/biennial/biennial-2026/assets/og-image/250923-SAB-2026-19by9-1.jpg",
      },
    }

  return (
    <>
      <Head>
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta
          property="og:image:alt"
          content="Sonic Acts Biennial 2026 Melted for Love"
        />
      </Head>
      <div
        id="aqua-01"
        data-tilt
        data-tilt-full-page-listening=""
        data-tilt-max="4"
        data-tilt-speed="50"
        data-tilt-perspective="500"
      >
        <PictureWithWebp
          src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-10.png"
          loading="lazy"
          alt=""
        />
      </div>

      <div
        id="aqua-02"
        data-tilt
        data-tilt-full-page-listening=""
        data-tilt-max="4"
        data-tilt-speed="50"
        data-tilt-perspective="500"
      >
        <PictureWithWebp
          src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-6.png"
          loading="lazy"
          alt=""
        />
      </div>

      <div
        id="aqua-03"
        data-tilt
        data-tilt-full-page-listening=""
        data-tilt-max="4"
        data-tilt-speed="50"
        data-tilt-perspective="500"
      >
        <PictureWithWebp
          src="/biennial/biennial-2026/assets/aquarelle/aquarell-10-2-1.png"
          loading="lazy"
          alt=""
        />
      </div>

      <section className="festival-wrapper about-page">
        <Layout global={global} festival={page} seo={pageSeo}>
          <div className="title-wrapper">
            <h1 className="page-title">Information</h1>
          </div>

          <div className="intro-text">
            <div>
              <ReactMarkdown children={sidebar} />
            </div>
            <div>
              <ReactMarkdown children={information_intro} />
            </div>
          </div>

          <InformationSection content={content} />
        </Layout>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  const params = {
    slug: BIENNIAL_SLUG,
  }
  // Run API calls in parallel
  const [pageRes, globalRes] = await Promise.all([
    fetchAPI(
      `/biennials?filters[slug][$eq]=${params.slug}&populate[content][populate]=*&populate[prefooter][populate]=*`
    ),
    fetchAPI(
      "/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*",
      { populate: "*" }
    ),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data,
    },
  }
}

export default About
