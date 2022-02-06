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
  const [homepageRes, pagesRes] = await Promise.all([
    fetchAPI("/homepage"),
    fetchAPI("/pages"),
  ])

  return {
    props: {
      homepage: homepageRes,
      pages: pagesRes,
    },
    revalidate: 1,
  }
}

export default Home
