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
        {items.map((item, i) => {
          return (
            <Link href={'/'+page.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
              <a>{item.attributes.title}</a>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/agenda-overview", { populate: "*" }),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  const totalItems = 
    await fetchAPI( `/agenda-items`
  );

  const number = totalItems.meta.pagination.total;

  const itemRes = 
    await fetchAPI( `/agenda-items?pagination[limit]=${number}&populate=*`
  );

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
