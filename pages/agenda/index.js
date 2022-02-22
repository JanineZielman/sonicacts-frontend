import React from "react"
import Link from "next/link"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"

const News = ({ menus, global, page, items }) => {
  console.log(items)
  return (
    <Layout page={page} menus={menus} global={global}>
      {items.map((item, i) => {
        return (
          <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
            <a>{item.attributes.title}</a>
          </Link>
        )
      })}
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, itemRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/agenda-overview", { populate: "*" }),
    fetchAPI("/agenda-items", { populate: "*" }),
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
