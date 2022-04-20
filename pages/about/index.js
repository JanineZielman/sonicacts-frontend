import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Article from "../../components/article"
import { fetchAPI } from "../../lib/api"

const About = ({ menus, global, page }) => {
  return (
    <Layout page={page} menus={menus} global={global}>
      <Article page={page}/>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/about?populate[content][populate]=*"),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default About
