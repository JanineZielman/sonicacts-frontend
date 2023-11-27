import React, {useState, useEffect} from "react"
import Layout from "../../components/layout"
import { fetchAPI } from "../../lib/api"
import Hero from "./hero"
import ReactMarkdown from "react-markdown";

const Festival = ({ menus, global, page, params, programmes, artists, news }) => {
	var text;
	if (page.attributes.slug == 'biennial-2022'){
		text = "Sonic  Acts Bien–nial 20 22 Son ic Acts Bien–nial 20 22"
	}
	const [loading, setLoading] = useState(true);

	const pageSlug = {
    attributes:
      	{slug: `biennial/${page.attributes.slug}`}
	}

	useEffect(() => {
    setTimeout(function() {
       setLoading(false)
    }, 100);
  }, []);


  return (
		<>
			<section className="festival-home">
				<Layout page={pageSlug} menus={menus} global={global} festival={page}>
					{loading ?
						<div className="loader"></div>
						:
						<>
						{page.attributes.links &&
							<div className="links">
								<ReactMarkdown 
									children={page.attributes.links} 
								/>
							</div>
						}
						{text &&
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
						}
						<div className="content-wrapper">
							<Hero slug={params.slug} programmes={programmes} artists={artists} news={news}/>
							<br/>
						</div>
					</>
				}
				</Layout>
			</section>
		</>
  )
}

export async function getServerSideProps({ params }) {
	const totalItems = 
    await fetchAPI( `/community-items?&filters[biennials][slug][$eq]=${params.slug}&sort[0]=slug`
  );

	const number = Math.floor(Math.random() * (totalItems.meta.pagination.total - 6));

  // Run API calls in parallel
  const [pageRes, globalRes, menusRes, programmeRes, artistsRes, newsRes] = await Promise.all([
		fetchAPI(`/biennials?filters[slug][$eq]=${params.slug}&populate[prefooter][populate]=*`),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
		fetchAPI(`/programmes?filters[biennial][slug][$eq]=${params.slug}&filters[main][$eq]=true&sort[0]=order%3Adesc&sort[1]=start_date%3Aasc&pagination[limit]=${4}&populate=*`),
		fetchAPI(`/community-items?&filters[biennials][slug][$eq]=${params.slug}&pagination[start]=${number}&pagination[limit]=${6}&populate=*`),
		fetchAPI(`/news-items?filters[biennials][slug][$eq]=${params.slug}&sort[0]=date%3Adesc&pagination[limit]=${4}&populate=*`),
  ])

  return {
    props: {
      page: pageRes.data[0],
      global: globalRes.data,
      menus: menusRes.data,
			params: params,
			programmes: programmeRes.data,
			artists: artistsRes.data,
			news: newsRes.data,
    }
  }
}

export default Festival
