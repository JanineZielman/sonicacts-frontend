import React from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Hero from "./hero"
import ReactMarkdown from "react-markdown";

const Festival = ({ menus, global, page, params, biennial, programmes }) => {
	const text = "Sonic  Acts Bien–nial 20 22 Son ic Acts Bien–nial 20 22"

	const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}`}
	}

  return (
		<>
		<section className="festival-home">
			<Layout page={pageSlug} menus={menus} global={global} festival={page}>
				{page.attributes.links &&
					<div className="links">
						<ReactMarkdown 
							children={page.attributes.links} 
						/>
					</div>
				}
        <div className="festival-hero-bg">
					<div className={`title`}>
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
          <Hero slug={params.slug} biennial={biennial.attributes} programmes={programmes}/>
          <br/>
        </div>
			</Layout>
		</section>
				</>
  )
}

export async function getServerSideProps({params}) {
  // Run API calls in parallel
  const [pageRes, biennialRes, globalRes, menusRes, programmeRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[community_items][populate]=*&populate[news_items][populate]=*&populate[programmes][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
		fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main][$eq]=true&sort[0]=order%3Adesc&sort[1]=start_date%3Aasc&populate=*`),
  ])

  return {
    props: {
      page: pageRes.data[0],
			biennial: biennialRes.data[0],
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
			programmes: programmeRes.data,
    }
  }
}

export default Festival
