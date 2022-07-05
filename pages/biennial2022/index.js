import React from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Landing from "./landing"
import Hero from "./hero"
import ReactMarkdown from "react-markdown";

const Festival = ({ menus, global, page, relations }) => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"

  return (
		<>
		<section className="festival">
			<Layout page={page} menus={menus} global={global}>
				<div className="intro-text">
					<div><ReactMarkdown children={page.attributes.sidebar}/></div>
					<div><p>{page.attributes.IntroText}</p></div>
				</div>
        <div className="festival-hero-bg">
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
          <Landing page={page}/>
        </div>
			</Layout>
		</section>
				</>
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
