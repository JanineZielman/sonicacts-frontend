import React from "react"
import Link from "next/link"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"

const News = ({ menus, global, page }) => {
  console.log(page)
  return (
    <Layout page={page} menus={menus} global={global}>
      
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/community", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default News