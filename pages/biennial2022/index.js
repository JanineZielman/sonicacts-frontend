import React from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Landing from "./landing"
import Hero from "./hero"

const Festival = ({ menus, global, page, relations }) => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"

  return (
		<section className="festival">
			<Layout page={page} menus={menus} global={global}>
        <div className="festival-hero-bg">
					<div className={`title`}>
						<div className={`layer1`}>
							{(text).split("").map(function(char, index){
							return <span className={``} aria-hidden="true" key={index}>{char}</span>;
							})}
						</div>
						<div className={`layer2`}>
							{(text).split("").map(function(char, index){
							return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
							})}
						</div>
						<div className={`layer3`}>
							{(text).split("").map(function(char, index){
							return <span className={``} aria-hidden="true" key={index}>{char}</span>;
							})}
						</div>
					</div>
				</div>
        <div className="content-wrapper">
          <Hero relations={relations}/>
          <br/>
          <Landing page={page}/>
        </div>
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
