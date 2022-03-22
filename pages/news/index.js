import React from "react"
import Link from "next/link"
import Moment from 'moment';
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"


const News = ({ menus, global, page, items }) => {
  console.log(items)
  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <div className="highlight">
          <div className="image">
            <Image image={items[0].attributes.cover_image?.data?.attributes}/>
          </div>
          <div className="text">
            <div className="date">{Moment(items[0].attributes.publishedAt).format('D MMM y')}</div>
            <Link href={page.attributes.slug+'/'+items[0].attributes.slug}>
              <a>{items[0].attributes.title}</a>
            </Link>
          </div>
        </div>
        <div className="filter">
          <div><span>Sort By</span></div>
          
        </div>
        <div className="discover-container">
          {items.slice(1).map((item, i) => {
            return (
              <div className="discover-item">
                <div className="item-wrapper">
                  <Link href={page.attributes.slug+'/'+item.attributes.slug} key={'link'+i}>
                    <a>
                      <div className="image">
                        <Image image={item.attributes.cover_image?.data?.attributes} layout='fill' objectFit='cover'/>
                      </div>
                      <div className="date">{Moment(item.attributes.publishedAt).format('D MMM y')}</div>
                    
                      {item.attributes.title}
                    </a>
                  </Link>
                </div>
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
    fetchAPI("/news-index", { populate: "*" }),
    fetchAPI("/news-items", { populate: "*" }),
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
