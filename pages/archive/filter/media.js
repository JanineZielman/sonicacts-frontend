import React, {useEffect, useState} from "react"
import Layout from "../../../components/layout"
import { fetchAPI } from "../../../lib/api"
import CuratorWidget from "../../../components/curatorWidget"


const DiscoverFiltered = ({ menus, global, page, categories}) => {
  let filter = "media"

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <div className="filter">
          <div><span>Filter by category</span></div>
						<a key={'category-all'} href={`/archive`}>All</a>
						{categories?.map((category, i) => {
							return (
								<a key={'category'+i} href={`/archive/filter/${category?.attributes.slug}`}
									className={category?.attributes.slug == filter && 'active'}
								>
									{category?.attributes.title}
								</a>
							)
						})}
        </div>
        <div className="discover-container">
          <CuratorWidget feedId="5e5a781d-0dba-4966-823a-29c0591ac51e"/>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories?sort[0]=order&filters[$or][0][sub_category][$null]=true&filters[$or][1][sub_category][$eq]=false&populate=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default DiscoverFiltered
