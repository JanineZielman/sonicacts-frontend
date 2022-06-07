import React from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Landing from "./landing"
import Hero from "./hero"

const Festival = ({ menus, global, page, relations }) => {
  return (
		<section className="festival">
			<Layout page={page} menus={menus} global={global}>
				<Hero relations={relations}/>
				<Landing page={page}/>
			</Layout>
		</section>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [pageRes, relationRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/festival?populate[content][populate]=*"),
		fetchAPI("/festival?populate[festival][populate]=*"),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
			relations: relationRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
    revalidate: 1,
  }
}

export default Festival
