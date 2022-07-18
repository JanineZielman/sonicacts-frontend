import React from "react"
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Landing from "../../landing"
import Hero from "../../hero"
import ReactMarkdown from "react-markdown";

const About = ({ menus, global, page, relations }) => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"

  return (
		<>
		<section className="festival-about">
			<Layout page={page} menus={menus} global={global}>
				<div className="intro-text">
					<div><ReactMarkdown children={page.attributes.sidebar}/></div>
					<div><p>{page.attributes.IntroText}</p></div>
				</div>
        
        <div className="content-wrapper">
          <Landing page={page}/>
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
    }
  }
}

export default About
