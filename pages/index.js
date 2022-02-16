import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"
import Link from "next/link"

const Home = ({ homepage, pages, global }) => {
  console.log(homepage)
  return (
    <Layout page={homepage} pages={pages}>
      <div className="columns">
        <div className="wrapper-medium">
          <div className="image">
            <Image image={homepage.attributes.logo.data.attributes}/>
          </div>
          <div className="intro-text">
            <h1>{homepage.attributes.IntroText}</h1>
          </div>
        </div>

        <div className="wrapper-large">
          <div className="image">
         
          </div>
          <div className="home-menu">
            {pages.map((page, i) => {
              return (
                <h2>{page.attributes.slug}</h2>
                // <Link href={page.attributes.slug} key={'link'+i}>
                //   <a className="menu-link">{page.attributes.slug}</a>
                // </Link>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [homepageRes, globalRes, pagesRes] = await Promise.all([
    fetchAPI("/homepage", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/pages", { populate: "*" }),
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
