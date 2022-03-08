import React from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown";
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"

const News = ({ menus, global, page, items }) => {
  console.log(items)
  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <h1 className="wrapper intro">{page.attributes.introTextBig}</h1>
        <div className="wrapper intro">
          <ReactMarkdown 
            children={page.attributes.introTextSmall} 
          />
        </div>
        <div className="filter">
          <div><span>Sort By</span></div>
        </div>
        <div className="discover-container">
          {items.map((item, i) => {
            return (
              <div className="discover-item community">
                <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
                  <a>
                    <div className="image">
                      {item.attributes?.cover_image?.data &&
                        <Image image={item.attributes.cover_image.data.attributes} layout='fill' objectFit='cover'/>
                      }
                    </div>
                    <div className="info">
                      {item.attributes.name} 
                      <div>{item.attributes.job_description}</div> 
                    </div>
                  </a>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, itemRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/community", { populate: "*" }),
    fetchAPI("/community-items", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default News
