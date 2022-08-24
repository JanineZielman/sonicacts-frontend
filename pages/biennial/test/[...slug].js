import React from "react"
import Layout from "../../../components/layout"
import { fetchAPI } from "../../../lib/api"
import Hero from "../hero"

const Festival = ({ menus, global, page, relations, params }) => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"

	const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}`}
	}

  return (
		<>
		<section className="festival-home">
			<Layout page={pageSlug} menus={menus} global={global}>
        <div className="festival-hero">
					<div className={`title random-color`}>
						<div className={`layer1`}>
							{(text).split("").map(function(char, index){
							return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 10) + 90 ), '--delay': (Math.floor(Math.random() * 10) * 0.5) + 's'}}>{char}</span>;
							})}
						</div>
						<div className={`layer2`}>
							{(text).split("").map(function(char, index){
							return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 50) + 50 ), '--delay': (Math.floor(Math.random() * 10) * 0.5) + 's'}}>{char}</span>;
							})}
						</div>
						<div className={`layer3`}>
							{(text).split("").map(function(char, index){
							return <span className={`random-letter`} aria-hidden="true" key={index} style={{'--random': (Math.floor(Math.random() * 10) + 90 )}}>{char}</span>;
							})}
						</div>
					</div>
				</div>
        <div className="content-wrapper">
          <Hero relations={relations}/>
          <br/>
        </div>
			</Layout>
		</section>
				</>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [pageRes, relationRes, globalRes, menusRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[content][populate]=*`),
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[festival][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data[0],
			relations: relationRes.data[0],
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
    }
  }
}

export default Festival
