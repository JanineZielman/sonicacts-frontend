import React from "react"
import Link from "next/link"
import Collapsible from 'react-collapsible';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"

const Home = ({ homepage, menus, global }) => {
  console.log(menus)
  return (
    <Layout page={homepage} menus={menus}>
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
            {menus.map((page, i) => {
              return (
                <div key={'home'+i} className="collapsible">
                  <Collapsible trigger={page.attributes.slug}>
                    {page.attributes.slug} highlights..
                  </Collapsible>
                </div>
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
  const [homepageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/homepage", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default Home
