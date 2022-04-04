import React, {useEffect, useRef, useState} from "react"
import Link from "next/link"
import Collapsible from 'react-collapsible';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Image from "../components/image"
import { fetchAPI } from "../lib/api"


const Home = ({ homepage, menus, global, items }) => {
    
  console.log(items) 
  
  return (
    <Layout page={homepage} menus={menus}>
      <div className="columns">
        <div className="wrapper-medium">
          <div className="image logo">
            <div class="glitch" data-text="Sonic Acts">Sonic</div> 
            <div class="glitch" data-text="Acts">Acts</div> 
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
                    {items[i].slice(0, 3).map((item, i) => {
                      return(
                        <div>
                          <Image image={item.attributes.cover_image.data.attributes}/>
                          <h2>{item.attributes.title}</h2>
                        </div>
                      )
                    })}
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
  const [homepageRes, globalRes, menusRes, newsRes] = await Promise.all([
    fetchAPI("/homepage", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
    fetchAPI("/news-items", { populate: "*" }),
  ])

  return {
    props: {
      homepage: homepageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
      items: {
        0: newsRes.data,
        1: newsRes.data,
        2: newsRes.data,
        3: newsRes.data,
        4: newsRes.data,
        5: newsRes.data,
      }
      
    },
    revalidate: 1,
  }
}

export default Home
