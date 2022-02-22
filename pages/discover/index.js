import React from "react"
import Link from "next/link"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"

const Discover = ({ menus, global, page, items }) => {
  console.log(page)
  return (
    <Layout page={page} menus={menus} global={global}>
      <p className="wrapper">{page.attributes.intro}</p>
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
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/discover-items", { populate: "*" }),
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

export default Discover
