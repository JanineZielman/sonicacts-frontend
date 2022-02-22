import React from "react"
import Link from "next/link"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"

const Discover = ({ menus, global, page, items, categories }) => {
  console.log(items)
  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <p className="wrapper">{page.attributes.intro}</p>
        <div className="filter">
          <div><span>Filter by category</span></div>
          {categories.map((category, i) => {
            return (
              <Link href={'/'+page.attributes.slug+'/categories/'+category.attributes.slug} key={'agenda'+i}>
                <a>{category.attributes.slug}</a>
              </Link>
            )
          })}
        </div>
        <div className="discover-container">
          {items.map((item, i) => {
            return (
              <div className="discover-item">
              <Image image={item.attributes.cover_image.data.attributes}/>
              <div className="category">
                <Link href={'/'+page.attributes.slug+'/categories/'+item.attributes.category.data.attributes.slug} key={'agenda'+i}>
                  <a>{item.attributes.category.data.attributes.slug}</a>
                </Link>
              </div>
              <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
                <a>{item.attributes.title}</a>
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
  const [pageRes, itemRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/discover-items", { populate: "*" }),
    fetchAPI("/categories", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      items: itemRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default Discover
