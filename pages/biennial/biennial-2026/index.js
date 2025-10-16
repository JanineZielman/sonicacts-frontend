import { fetchAPI } from "../../../lib/api"
import Image from "../../../components/image"
import Head from "next/head"

const Festival = ({ news }) => {
  
  return (
    <>
      <Head>
        <link rel="canonical" href="https://2026.sonicacts.com/" />
        <title>Sonic Acts Biennial 2026</title>
        <meta property="og:title" content="Sonic Acts Biennial 2026 🫠 Melted for Love" />
        <meta property="og:description" content="Contemporary sound experiments, performance, moving image, and multidisciplinary art 🩷 5 Feb – 29 Mar 2026" />
        <meta name="description" content="Contemporary sound experiments, performance, moving image, and multidisciplinary art 🩷 5 Feb – 29 Mar 2026" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://2026.sonicacts.com" />
        <meta property="og:image" content="https://2026.sonicacts.com/assets/og-image/250923-SAB-2026-19by9-1.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta property="og:image:alt" content="Sonic Acts Biennial 2026 Melted for Love" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://2026.sonicacts.com/assets/og-image/250923-SAB-2026-19by9-1.jpg" />
      </Head>
      <section className="biennial-2026">
        <h1>Sonic Acts Biennial 2026</h1>
        <h2 className="visually-hidden">Melted for love</h2>
        <p className="visually-hidden">05 Feb–29 Mar 2026 Biennial</p>

        <h3>News</h3>
          <div className='news-preview preview'>
            {news.map((item, i) => {
              return(
                <a href={`https://2026.sonicacts.com/news/${item.attributes.slug}`} className='image-text'>
                  <div className='image'>
                    <Image image={item.attributes.cover_image?.data?.attributes ? item.attributes.cover_image?.data?.attributes : item.attributes.biennial_cover_image?.data?.attributes} />
                    </div>
                  <p>{item.attributes.title}</p>
                </a>
              )
            })}
          </div>
      </section>
    </>
  )
}

export async function getServerSideProps() {

  const params = {
    slug: 'biennial-2026'
  }

  // Run API calls in parallel
  const [pageRes, globalRes, newsRes] = await Promise.all([
    fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI(`/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&populate=*`),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data,
      news: newsRes.data,
    }
  }
}

export default Festival
