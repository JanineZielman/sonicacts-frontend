import React from "react"
import Layout from "../../components/layout"
import Article from "../../components/article"
import { fetchAPI } from "../../lib/api"

const About = ({ menus, global, page }) => {
  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="about-page">
        <Article page={page}/>
      </div>
    </Layout>
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
