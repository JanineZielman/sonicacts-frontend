import React from "react"
import Layout from "../../../../components/layout"
import { fetchAPI } from "../../../../lib/api"
import Landing from "../../landing"
import Hero from "../../hero"
import ReactMarkdown from "react-markdown";

const About = ({ menus, global, page, params }) => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"

  const pageSlug = {
    attributes:
      	{slug: `biennial/${params.slug}/about`}
	}

  return (
		<>
		<section className="festival-wrapper">
			<Layout page={pageSlug} menus={menus} global={global} festival={page}>
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

export async function getStaticPaths() {
  const pagesRes = await fetchAPI("/biennials");
  return {
    paths: pagesRes.data.map((page) => ({
      params: {
        slug: page.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  // Run API calls in parallel
  const [pageRes, globalRes, menusRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[content][populate]=*&populate[prefooter][populate]=*`),
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data,
      menus: menusRes.data,
      params: params,
    }
  }
}

export default About
