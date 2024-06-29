import React from "react"
import Layout from "../../components/layout"
import Article from "../../components/article"
import { fetchAPI } from "../../lib/api"
import Head from "next/head"

const About = ({ menus, global, page }) => {
  console.log(page.attributes.content[0].text_block)
  return (
    <>
      <Head>
      <meta name="description" content={page.attributes.content?.[0]?.text_block} />
      <meta property="og:description" content={page.attributes.content?.[0]?.text_block} />
      <meta name="image" content={'https://cms.sonicacts.com' + page?.attributes?.images?.data[0].attributes.url } />
      <meta property="og:image" content={'https://cms.sonicacts.com' + page?.attributes?.images?.data[0].attributes.url } />
    </Head>
    <Layout page={page} menus={menus} global={global}>
     
      <div className="about-page">
        <Article page={page}/>
      </div>
    </Layout>
    </>
  )
}

export async function getServerSideProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/about?populate[content][populate]=*&populate[images][populate]=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  }
}

export default About
