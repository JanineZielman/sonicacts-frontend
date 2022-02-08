import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { fetchAPI } from "../lib/api"

const Home = ({ homepage, pages }) => {
  return (
    <Layout pages={pages}>
      <div className="hero-bg">

      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [homepageRes, globalRes, pagesRes] = await Promise.all([
    fetchAPI("/api/homepage"),
    fetchAPI("/api/global"),
    fetchAPI("/api/pages"),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      pages: pagesRes.data,
    },
    revalidate: 1,
  }
}

export default Home
